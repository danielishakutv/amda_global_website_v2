import { NextResponse, type NextRequest } from "next/server";
import { checkSession, clientIp } from "@/lib/admin-server";
import { recordAudit } from "@/lib/audit-server";
import { average, clearRatings, readRatings } from "@/lib/ratings-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authed(req: NextRequest): Promise<boolean> {
  return checkSession(req.cookies.get("amda_admin_session")?.value);
}

// Full stats (count, average, per-star distribution) for the dashboard.
export async function GET(req: NextRequest) {
  if (!(await authed(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const stats = await readRatings();
  return NextResponse.json({ ok: true, count: stats.count, average: average(stats), dist: stats.dist });
}

// Reset all ratings to zero.
export async function DELETE(req: NextRequest) {
  if (!(await authed(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  await clearRatings();
  await recordAudit("ratings-reset", clientIp(req));
  return NextResponse.json({ ok: true });
}
