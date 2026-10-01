import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/admin-token";

// Edge guard: valid httpOnly session cookie required for /admin pages and
// /api/admin endpoints (except status + login). No valid cookie → login page.
export async function middleware(req: NextRequest) {
  // trailingSlash:true means /api/admin/login and /api/admin/login/ both occur
  const raw = req.nextUrl.pathname;
  const pathname = raw.length > 1 && raw.endsWith("/") ? raw.slice(0, -1) : raw;
  if (pathname === "/api/admin/login" || pathname === "/api/admin/status") {
    return NextResponse.next();
  }
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = req.cookies.get("amda_admin_session")?.value;
  const valid =
    !!secret &&
    secret.length >= 32 &&
    !!token &&
    (await verifySessionToken(secret, token)) !== null;
  if (valid) return NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
