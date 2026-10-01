import { NextResponse, type NextRequest } from "next/server";
import { clearSessionCookieHeader, dropSessionActivity } from "@/lib/admin-server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("amda_admin_session")?.value;
  await dropSessionActivity(token);
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearSessionCookieHeader());
  return res;
}
