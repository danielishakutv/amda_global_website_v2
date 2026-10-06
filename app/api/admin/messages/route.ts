import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { checkSession, clientIp } from "@/lib/admin-server";
import { recordAudit } from "@/lib/audit-server";
import type { ContactMessage } from "@/lib/messages";

const DATA_DIR = process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "contact-messages.json");

async function readMessages(): Promise<ContactMessage[]> {
  try {
    const raw = await fs.readFile(MESSAGES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ContactMessage[]) : [];
  } catch {
    return [];
  }
}

async function writeMessages(messages: ContactMessage[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), { mode: 0o600 });
}

async function authed(req: NextRequest): Promise<boolean> {
  return checkSession(req.cookies.get("amda_admin_session")?.value);
}

export async function GET(req: NextRequest) {
  if (!(await authed(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, messages: await readMessages() });
}

export async function PATCH(req: NextRequest) {
  if (!(await authed(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  let id = "";
  let read = true;
  try {
    const body = (await req.json()) as { id?: unknown; read?: unknown };
    if (typeof body.id === "string") id = body.id;
    if (typeof body.read === "boolean") read = body.read;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }
  const messages = await readMessages();
  const msg = messages.find((m) => m.id === id);
  if (!msg) {
    return NextResponse.json({ ok: false, reason: "not-found" }, { status: 404 });
  }
  msg.read = read;
  await writeMessages(messages);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await authed(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }
  const messages = await readMessages();
  await writeMessages(messages.filter((m) => m.id !== id));
  await recordAudit("message-deleted", clientIp(req), `id=${id}`);
  return NextResponse.json({ ok: true });
}
