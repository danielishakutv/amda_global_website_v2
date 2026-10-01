import { NextResponse, type NextRequest } from "next/server";
import { checkSession } from "@/lib/admin-server";

export async function GET(req: NextRequest) {
  const authed = await checkSession(req.cookies.get("amda_admin_session")?.value);
  return NextResponse.json({ authed });
}
