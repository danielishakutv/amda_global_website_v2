#!/usr/bin/env bash
#
# amdaglobal.com production deploy. Invoked by GitHub Actions over SSH as a
# FORCED COMMAND, so the CI key can only ever trigger this — never get a shell.
#
# Install (as root, by hand — deliberately NOT self-updating, because the file
# GitHub can trigger must not be rewritable by a push):
#   install -m 700 deploy/amda-deploy.sh /usr/local/sbin/amda-deploy.sh
#
# Run by hand:  /usr/local/sbin/amda-deploy.sh
#
# Design notes:
#   - Build BEFORE restarting. A failed build leaves the running site
#     untouched, so a bad push cannot take production down.
#   - `git merge --ff-only`, never `reset --hard`: if someone edited files on
#     the box, this stops and says so instead of destroying their work.
#   - Health-checked after restart. "pm2 says online" is not "the site works".
#   - Exits non-zero on failure so the Action goes red, and reports to Telegram.

set -uo pipefail

APP_DIR=${APP_DIR:-/opt/amdaglobal}
PM2_NAME=${PM2_NAME:-amdaglobal}
HEALTH_URL=${HEALTH_URL:-http://127.0.0.1:3006/}
PUBLIC_URL=${PUBLIC_URL:-https://amdaglobal.com/}
BRANCH=${BRANCH:-main}
LOCK=/var/lock/amda-deploy.lock
LOG=/var/log/amda-deploy.log

exec > >(tee -a "$LOG") 2>&1
echo "=============================================================="
if [ -n "${SSH_CONNECTION:-}" ]; then
  TRIGGERED_BY="CI from ${SSH_CONNECTION%% *}"
else
  TRIGGERED_BY="hand"
fi
echo "deploy started $(date -Is) by ${TRIGGERED_BY}"

# ------------------------------------------------------------------ telegram
# Read one KEY=value from the app env. Deliberately not `source`: that would
# execute the app's entire .env inside a root process.
env_value() {
  local key=$1 file=$2 v
  [ -r "$file" ] || return 0
  v=$(sed -n "s/^[[:space:]]*\(export[[:space:]]\{1,\}\)\{0,1\}${key}=//p" "$file" | head -1)
  v=${v%$'\r'}
  case "$v" in
    \"*\") v=${v#\"}; v=${v%\"} ;;
    \'*\') v=${v#\'}; v=${v%\'} ;;
  esac
  printf '%s' "$v"
}

# Where the machine's Telegram credential lives. NOT the app's .env: this box
# alerts about every site on it, so a credential owned by one tenant would go
# with that tenant the day it is decommissioned.
TELEGRAM_CONF=${TELEGRAM_CONF:-/etc/toko-telegram.conf}

notify() {
  local text=$1 token chat code
  token=$(env_value TELEGRAM_BOT_TOKEN "$TELEGRAM_CONF")
  chat=$(env_value TELEGRAM_ALERT_CHAT_ID "$TELEGRAM_CONF")
  [ -n "$chat" ] || chat=$(env_value TELEGRAM_CHAT_ID "$TELEGRAM_CONF")
  if [ -z "$token" ] || [ -z "$chat" ]; then
    logger -t amda-deploy "telegram not configured; skipped: $(printf '%s' "$text" | head -1)"
    return 0
  fi
  # --data-urlencode so there is no JSON to escape by hand.
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 \
    -X POST "https://api.telegram.org/bot${token}/sendMessage" \
    --data-urlencode "chat_id=${chat}" \
    --data-urlencode "text=${text}" \
    -d "parse_mode=HTML" -d "disable_web_page_preview=true")
  case "$code" in
    2*) ;;
    *) logger -t amda-deploy "telegram send failed (HTTP ${code:-none})" ;;
  esac
}

fail() {
  echo "DEPLOY FAILED: $1"
  notify "🚨 <b>amdaglobal.com deploy FAILED</b>
${1}

Commit: <code>${NEW_SHA:-unknown}</code>
Host: $(hostname)
Log: ${LOG}
The site is still serving the previous build."
  exit 1
}

# Root runs npm lifecycle scripts and the built app from APP_DIR. If any
# directory on the way to it can be renamed by a non-root user, that user can
# swap in their own package.json and get root on the next deploy.
#
# This script was FIRST written with the checkout at /home/amdaglobal/app,
# whose parent is owned by the unprivileged vhost user - exactly that hole.
# It is re-checked on every run so the mistake cannot quietly return.
check_trust_path() {
  local p=$APP_DIR bad="" owner mode
  while :; do
    # A path that cannot be stat'ed is not a path that has been checked.
    # Breaking out here silently would report "trusted" for a directory that
    # does not exist, which is the one answer this guard must never give.
    if ! owner=$(stat -c %U "$p" 2>/dev/null); then
      bad="${bad}  ${p} cannot be read, so it cannot be trusted
"
      break
    fi
    mode=$(stat -c %A "$p" 2>/dev/null)
    if [ "$owner" != "root" ]; then
      bad="${bad}  ${p} is owned by ${owner}, not root
"
    elif [ "${mode:5:1}" = "w" ] || [ "${mode:8:1}" = "w" ]; then
      bad="${bad}  ${p} is group/other writable (${mode})
"
    fi
    [ "$p" = "/" ] && break
    p=$(dirname "$p")
  done
  [ -z "$bad" ] || fail "unsafe path to ${APP_DIR}: root would execute code from a directory a non-root user can replace.
${bad}"
}

# -------------------------------------------------------------------- locked
exec 9>"$LOCK" || fail "cannot open lock file $LOCK"
flock -n 9 || { echo "another deploy is running; exiting"; exit 0; }

cd "$APP_DIR" || fail "APP_DIR $APP_DIR does not exist"
[ -d .git ] || fail "$APP_DIR is not a git checkout"
check_trust_path

OLD_SHA=$(git rev-parse --short HEAD)

# --------------------------------------------------------------------- fetch
git -c core.hooksPath=/dev/null fetch --quiet --prune origin "$BRANCH" || fail "git fetch failed"
NEW_SHA=$(git rev-parse --short "origin/${BRANCH}")

if [ "$OLD_SHA" = "$NEW_SHA" ]; then
  echo "already at ${NEW_SHA}; rebuilding anyway (forced run)"
fi

# Tracked changes only.
#
# `--untracked-files=no` on purpose: a stray untracked file - an .env backup
# taken by hand, a log - cannot be destroyed by a fast-forward, so refusing on
# one is a deploy that fails for a reason that does not matter. The case that
# DOES matter, an untracked file the incoming commit wants to create, is caught
# by git itself when the merge runs, with a far better message than this check
# could write. What must never be silently overwritten is somebody's edit to a
# tracked file, which is exactly what this still refuses.
DIRTY=$(git status --porcelain --untracked-files=no)
if [ -n "$DIRTY" ]; then
  fail "working tree at $APP_DIR has local changes to tracked files, refusing to overwrite:
$(printf '%s' "$DIRTY" | head -10)
Resolve on the box, then re-run."
fi

# Noted, never fatal: useful when wondering what is lying about on the box.
UNTRACKED=$(git status --porcelain --untracked-files=all | grep '^??' || true)
if [ -n "$UNTRACKED" ]; then
  echo "note: untracked files present (ignored by this deploy):"
  printf '%s
' "$UNTRACKED" | head -5
fi

git -c core.hooksPath=/dev/null merge --ff-only --quiet "origin/${BRANCH}" || fail "cannot fast-forward to origin/${BRANCH} (diverged history)"
NEW_SHA=$(git rev-parse --short HEAD)
SUBJECT=$(git log -1 --pretty='%s' | cut -c1-120)
AUTHOR=$(git log -1 --pretty='%an')
echo "at ${NEW_SHA}: ${SUBJECT} (${AUTHOR})"

# ------------------------------------------------------------------- install
# Only reinstall when the lockfile actually moved — most pushes are code only,
# and npm ci is the slowest step by far.
if [ "$OLD_SHA" != "$NEW_SHA" ] && ! git diff --quiet "$OLD_SHA" "$NEW_SHA" -- package-lock.json package.json; then
  echo "dependencies changed -> npm ci"
  npm ci || fail "npm ci failed"
else
  echo "dependencies unchanged -> skipping npm ci"
  [ -d node_modules ] || { echo "no node_modules -> npm ci"; npm ci || fail "npm ci failed"; }
fi

# --------------------------------------------------------------------- build
# next/font/google fetches from Google AT BUILD TIME and has failed here once
# transiently. One retry turns that flake into a non-event.
build() { npm run build; }
if ! build; then
  echo "build failed — retrying once (next/font/google is fetched at build time)"
  sleep 5
  build || fail "npm run build failed twice"
fi

# ------------------------------------------------------------------- restart
pm2 restart "$PM2_NAME" --update-env >/dev/null 2>&1 || fail "pm2 restart $PM2_NAME failed"
pm2 save --force >/dev/null 2>&1 || true

# -------------------------------------------------------------- health check
# pm2 reporting "online" only means the wrapper started. Ask the app.
ok=0
for i in $(seq 1 20); do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$HEALTH_URL")
  if [ "$code" = "200" ]; then ok=1; echo "health: 200 after ${i} attempt(s)"; break; fi
  sleep 3
done
[ "$ok" = "1" ] || fail "app did not return 200 on ${HEALTH_URL} within 60s
$(pm2 logs "$PM2_NAME" --lines 15 --nostream --err 2>/dev/null | tail -15)"

# Verified from outside too — an app that answers on localhost while the world
# sees 522 is exactly the trap in the runbook.
PUB=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$PUBLIC_URL")
echo "public: ${PUBLIC_URL} -> ${PUB}"

echo "deploy OK ${OLD_SHA} -> ${NEW_SHA} at $(date -Is)"
notify "✅ <b>amdaglobal.com deployed</b>
<code>${OLD_SHA}</code> → <code>${NEW_SHA}</code>
${SUBJECT}
by ${AUTHOR}

Public check: HTTP ${PUB}"
exit 0
