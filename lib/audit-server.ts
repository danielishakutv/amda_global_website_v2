// Server-side audit log (node runtime). Records security-relevant admin events
// to DATA_DIR/admin-audit.json so they survive restarts and are the same on
// every device — unlike the per-browser localStorage log in Settings.
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), "data");
const AUDIT_FILE = path.join(DATA_DIR, "admin-audit.json");
const MAX_EVENTS = 1000;

export type AuditEvent = {
  ts: string;
  event: string;
  ip: string;
  detail: string;
};

export async function readAuditLog(): Promise<AuditEvent[]> {
  try {
    const raw = await fs.readFile(AUDIT_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AuditEvent[]) : [];
  } catch {
    return [];
  }
}

// Best-effort: an audit write must never break the action it records, so
// failures are swallowed (and logged to the console) rather than thrown.
export async function recordAudit(event: string, ip: string, detail = ""): Promise<void> {
  try {
    const events = await readAuditLog();
    events.push({ ts: new Date().toISOString(), event, ip, detail: detail.slice(0, 300) });
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(AUDIT_FILE, JSON.stringify(events.slice(-MAX_EVENTS), null, 2), { mode: 0o600 });
  } catch (err) {
    console.warn("[audit] could not record event:", (err as Error).message);
  }
}
