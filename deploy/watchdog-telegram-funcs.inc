# ---------------------------------------------------------------- telegram
#
# Plain text, NOT parse_mode=HTML: findings contain <, > and & (thresholds,
# shell snippets, "2.0x"), and a malformed entity makes Telegram reject the
# whole message. An alert that does not arrive is worse than an unstyled one.
#
# Returns non-zero when the message did not leave, and says why to syslog.
send_telegram() {
  local subject=$1 body=$2 token chat text res code
  token=$TELEGRAM_BOT_TOKEN
  chat=$TELEGRAM_CHAT_ID
  [ -n "$token" ] || token=$(env_value TELEGRAM_BOT_TOKEN "$TELEGRAM_ENV_FILE")
  [ -n "$chat" ] || chat=$(env_value TELEGRAM_ALERT_CHAT_ID "$TELEGRAM_ENV_FILE")
  [ -n "$chat" ] || chat=$(env_value TELEGRAM_CHAT_ID "$TELEGRAM_ENV_FILE")

  if [ -z "$token" ] || [ -z "$chat" ]; then
    logger -t server-watchdog "ALERT (telegram not configured): $subject"
    return 1
  fi

  text="${subject}

${body}"
  # Truncate rather than let Telegram refuse the lot.
  if [ "${#text}" -gt "$TELEGRAM_MAX_CHARS" ]; then
    text="${text:0:$TELEGRAM_MAX_CHARS}

[truncated - full detail on the box]"
  fi

  res=$(curl -s -w '\n%{http_code}' --max-time 20 \
    -X POST "https://api.telegram.org/bot${token}/sendMessage" \
    --data-urlencode "chat_id=${chat}" \
    --data-urlencode "text=${text}" \
    -d "disable_web_page_preview=true" 2>/dev/null)
  code=$(printf '%s' "$res" | tail -n1)

  case "$code" in
    2*) return 0 ;;
  esac
  # Telegram says which it is in the body: "chat not found" (wrong id), "bot
  # was kicked", "Unauthorized" (bad token). Logging only the code would make
  # the next person guess between them.
  logger -t server-watchdog \
    "TELEGRAM SEND FAILED (HTTP ${code:-none}): $(printf '%s' "$res" | sed '$d' | tr -d '\n' | cut -c1-200)"
  return 1
}

# One door for every alert, so adding a channel never means editing the checks.
# Returns non-zero only when NOTHING got out — which is what the caller uses to
# clear the cooldown and try again in five minutes.
send_alert() {
  local subject=$1 body=$2 sent=0 channel=${ALERT_CHANNEL:-telegram}

  case "$channel" in
    telegram|both) send_telegram "$subject" "$body" && sent=1 ;;
  esac
  case "$channel" in
    email|both) send_email "$subject" "$body" && sent=1 ;;
  esac

  # Telegram was asked for and did not deliver: use email rather than nothing.
  if [ "$sent" = "0" ] && [ "$channel" = "telegram" ] && [ "$EMAIL_FALLBACK" = "1" ]; then
    logger -t server-watchdog "telegram failed - falling back to email"
    send_email "$subject" "$body" && sent=1
  fi

  [ "$sent" = "1" ]
}

