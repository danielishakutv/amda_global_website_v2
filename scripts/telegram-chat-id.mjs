// Finds the chat id of every group/channel your bot can currently see.
//
// Usage:
//   node scripts/telegram-chat-id.mjs                 # reads .env
//   node scripts/telegram-chat-id.mjs <bot-token>
//
// Telegram only reports a chat once the bot has SEEN a message there, so:
//   1. add the bot to the group
//   2. send any message in that group (or /start)
//   3. run this
//
// Note: getUpdates returns nothing if a webhook is set, and nothing for
// messages older than ~24h. Both are reported below rather than looking like
// "no groups found".
import { readFileSync } from "node:fs";

function tokenFromEnvFile() {
  for (const f of [".env", ".env.local"]) {
    try {
      const m = readFileSync(f, "utf8").match(/^\s*TELEGRAM_BOT_TOKEN\s*=\s*(.+)$/m);
      if (m) return m[1].trim().replace(/^["']|["']$/g, "");
    } catch {
      /* file absent — try the next one */
    }
  }
  return "";
}

const token = (process.argv[2] || process.env.TELEGRAM_BOT_TOKEN || tokenFromEnvFile()).trim();
if (!token) {
  console.error("No bot token. Pass it as an argument or set TELEGRAM_BOT_TOKEN in .env");
  process.exit(1);
}

const api = (m) => `https://api.telegram.org/bot${token}/${m}`;

const me = await fetch(api("getMe")).then((r) => r.json());
if (!me.ok) {
  console.error(`Token rejected by Telegram: ${me.description ?? JSON.stringify(me)}`);
  process.exit(1);
}
console.log(`Bot: @${me.result.username} (${me.result.first_name})\n`);

const hook = await fetch(api("getWebhookInfo")).then((r) => r.json());
if (hook.ok && hook.result?.url) {
  console.error(`A webhook is set (${hook.result.url}), so getUpdates returns nothing.`);
  console.error(`Clear it with:  curl -s "${api("deleteWebhook")}"`);
  process.exit(1);
}

const updates = await fetch(api("getUpdates?limit=100")).then((r) => r.json());
if (!updates.ok) {
  console.error(`getUpdates failed: ${updates.description ?? JSON.stringify(updates)}`);
  process.exit(1);
}

const chats = new Map();
for (const u of updates.result) {
  const chat = (u.message ?? u.channel_post ?? u.my_chat_member ?? u.edited_message)?.chat;
  if (chat) chats.set(chat.id, chat);
}

if (chats.size === 0) {
  console.log("No chats visible yet. Add the bot to the group, send a message there,");
  console.log("then run this again. (Telegram drops updates older than ~24 hours.)");
  process.exit(0);
}

console.log("Chats the bot can see:\n");
for (const c of chats.values()) {
  const name = c.title ?? [c.first_name, c.last_name].filter(Boolean).join(" ");
  console.log(`  ${String(c.id).padEnd(16)}  ${c.type.padEnd(10)}  ${name}`);
}
console.log("\nUse the negative id of your group as TELEGRAM_CHAT_ID.");
