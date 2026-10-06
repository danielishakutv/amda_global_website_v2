#!/usr/bin/env python3
"""Add Telegram alerting to server-watchdog.sh, keeping email as a fallback.

Usage: patch-watchdog-telegram.py <watchdog.sh> <settings.inc> <funcs.inc>

Idempotent, and refuses to write unless every anchor matches exactly once — so
a future upstream edit can never leave a half-patched watchdog behind.
"""
import pathlib
import sys

if len(sys.argv) != 4:
    sys.exit(__doc__)

target = pathlib.Path(sys.argv[1])
settings_inc = pathlib.Path(sys.argv[2]).read_text()
funcs_inc = pathlib.Path(sys.argv[3]).read_text()

src = target.read_text()
if "send_telegram()" in src:
    print("already patched; nothing to do")
    sys.exit(0)

CHECKS_HEADER = "# --------------------------------------------------------------- the checks"
REPEAT_LINE = "REPEAT_AFTER=${REPEAT_AFTER:-3600}\n"

edits = [
    # Settings go right after the existing repeat-window setting.
    ("settings block", REPEAT_LINE, REPEAT_LINE + settings_inc),
    # Functions go immediately before the checks section.
    ("alert functions", CHECKS_HEADER, funcs_inc + CHECKS_HEADER),
    # Route both send sites through the dispatcher. Anchors deliberately stop
    # before the trailing backslash so there is no escaping to get wrong.
    (
        "--test dispatch",
        'if send_email "[watchdog] test from $(hostname)"',
        'if send_alert "[watchdog] test from $(hostname)"',
    ),
    (
        "--test wording",
        'echo "Accepted by ZeptoMail for ${ALERT_TO:-<unset>}. Now confirm it ARRIVES"',
        'echo "Sent via ALERT_CHANNEL=${ALERT_CHANNEL:-telegram}. Now confirm it ARRIVED"',
    ),
    (
        "main alert call",
        '  send_email "[watchdog] $(hostname):',
        '  send_alert "[watchdog] $(hostname):',
    ),
]

for name, old, new in edits:
    found = src.count(old)
    if found != 1:
        sys.exit(f"REFUSING TO WRITE: anchor for {name!r} found {found} times, expected 1")
    src = src.replace(old, new, 1)

target.write_text(src)
print("patched:", target)
