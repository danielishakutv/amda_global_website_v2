import { NextResponse, type NextRequest } from "next/server";
import { checkSession } from "@/lib/admin-server";
import { readAuditLog } from "@/lib/audit-server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await checkSession(req.cookies.get("amda_admin_session")?.value))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const events = await readAuditLog();
  // Newest first for display.
  return NextResponse.json({ ok: true, events: events.slice().reverse() });
}
