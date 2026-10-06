// Telegram notifications — new website leads, and deploy/watchdog style alerts.
//
// Two chats on purpose: leads are a business feed somebody reads daily, alerts
// are an ops feed. TELEGRAM_ALERT_CHAT_ID falls back to TELEGRAM_CHAT_ID, so a
// single group works until there is a reason to split them.
//
// Never throws: a Telegram outage must not cost a lead, because the message is
// already saved to disk before this runs. But it never fails SILENTLY either —
// every failure is classified and logged with enough detail to act on.

const API_BASE = "https://api.telegram.org";
const TIMEOUT_MS = 8000;
// Telegram hard-rejects messages over 4096 chars. Leave room for the wrapper.
const MAX_DESCRIPTION = 2500;

export type TelegramResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "http" | "network" | "timeout"; detail: string };

export type TelegramTarget = "leads" | "alerts";

function chatIdFor(target: TelegramTarget): string | undefined {
  const leads = process.env.TELEGRAM_CHAT_ID?.trim();
  if (target === "leads") return leads || undefined;
  return process.env.TELEGRAM_ALERT_CHAT_ID?.trim() || leads || undefined;
}

export function telegramConfigured(target: TelegramTarget = "leads"): boolean {
  return !!process.env.TELEGRAM_BOT_TOKEN?.trim() && !!chatIdFor(target);
}

/** Telegram's HTML parse mode only requires these three escaped. */
export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendTelegram(
  html: string,
  target: TelegramTarget = "leads",
): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = chatIdFor(target);
  if (!token || !chatId) {
    const missing = [!token && "TELEGRAM_BOT_TOKEN", !chatId && "TELEGRAM_CHAT_ID"]
      .filter(Boolean)
      .join(" + ");
    // Not an error: the site is expected to run before Telegram is wired up.
    console.warn(`[telegram] skipped (${target}) — unset: ${missing}`);
    return { ok: false, reason: "not-configured", detail: `unset: ${missing}` };
  }

  try {
    const res = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: html,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!res.ok) {
      // Telegram explains refusals in the body ("chat not found", "bot was
      // blocked", "wrong file identifier"). Logging only the status would
      // leave the next person guessing which of those it was.
      const body = (await res.text().catch(() => "")).slice(0, 300);
      console.error(`[telegram] HTTP ${res.status} (${target}) chat=${chatId}: ${body}`);
      return { ok: false, reason: "http", detail: `HTTP ${res.status}: ${body}` };
    }
    return { ok: true };
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`[telegram] ${timedOut ? "timeout" : "network"} (${target}): ${detail}`);
    return { ok: false, reason: timedOut ? "timeout" : "network", detail };
  }
}

// ---------------------------------------------------------------- new leads

/**
 * A new contact-form submission, formatted for the group.
 *
 * `phoneE164` is the already-normalised number so the group gets a tappable
 * wa.me link — the whole point of collecting a dial code on the form.
 */
export async function notifyNewLead(msg: {
  name: string;
  email: string;
  phone: string;
  service: string;
  description: string;
  ts: string;
}, phoneE164: string): Promise<TelegramResult> {
  const when = new Date(msg.ts).toLocaleString("en-GB", {
    timeZone: "Africa/Lagos",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const description =
    msg.description.length > MAX_DESCRIPTION
      ? `${msg.description.slice(0, MAX_DESCRIPTION)}… (truncated — full text in the dashboard)`
      : msg.description;

  const lines = [
    "🔔 <b>New enquiry — amdaglobal.com</b>",
    "",
    `<b>Name:</b> ${escapeHtml(msg.name)}`,
    `<b>Service:</b> ${escapeHtml(msg.service)}`,
    `<b>Email:</b> ${escapeHtml(msg.email)}`,
  ];

  if (phoneE164) {
    const waNumber = phoneE164.replace(/\D/g, "");
    lines.push(
      `<b>Phone:</b> ${escapeHtml(phoneE164)} — <a href="https://wa.me/${waNumber}">WhatsApp</a>`,
    );
  }

  lines.push(
    "",
    `<b>Message:</b>`,
    escapeHtml(description),
    "",
    `<i>${escapeHtml(when)} (Lagos) · <a href="https://amdaglobal.com/admin/">dashboard</a></i>`,
  );

  return sendTelegram(lines.join("\n"), "leads");
}
