// Server-only contact-message storage (node runtime).
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { ContactInput, ContactMessage } from "@/lib/messages";

const DATA_DIR = process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "contact-messages.json");
const MAX_MESSAGES = 2000;

export async function readMessages(): Promise<ContactMessage[]> {
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ContactMessage[]) : [];
  } catch {
    return [];
  }
}

export async function writeMessages(messages: ContactMessage[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), { mode: 0o600 });
}

export async function saveMessage(input: ContactInput): Promise<ContactMessage> {
  const messages = await readMessages();
  const msg: ContactMessage = {
    id: `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`,
    ts: new Date().toISOString(),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    countryIso: input.countryIso,
    service: input.service,
    description: input.description.trim(),
    read: false,
  };
  messages.unshift(msg);
  await writeMessages(messages.slice(0, MAX_MESSAGES));
  return msg;
}
