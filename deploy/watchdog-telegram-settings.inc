
# --- where alerts go -------------------------------------------------------
# telegram | email | both. Telegram is the default because it arrives on a
# phone in seconds and cannot be rejected by a mail provider.
ALERT_CHANNEL=${ALERT_CHANNEL:-telegram}
# If Telegram is the only channel and a send FAILS, try email anyway rather
# than stay mute. A watchdog that thinks it alerted is the failure this script
# exists to avoid, so silence is never an acceptable outcome.
EMAIL_FALLBACK=${EMAIL_FALLBACK:-1}
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN:-}
TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID:-}
# One token, one place: fall back to the app's env so rotating it there cannot
# quietly leave this script mute (same reasoning as ZEPTOMAIL_TOKEN below).
TELEGRAM_ENV_FILE=${TELEGRAM_ENV_FILE:-/home/amdaglobal/app/.env}
# Telegram hard-rejects a message over 4096 characters.
TELEGRAM_MAX_CHARS=${TELEGRAM_MAX_CHARS:-3900}
