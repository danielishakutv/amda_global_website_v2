import { NextResponse, type NextRequest } from "next/server";
import { clearSessionCookieHeader, clientIp, dropSessionActivity } from "@/lib/admin-server";
import { recordAudit } from "@/lib/audit-server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("amda_admin_session")?.value;
  await dropSessionActivity(token);
  if (token) await recordAudit("logout", clientIp(req));
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearSessionCookieHeader());
  return res;
}
