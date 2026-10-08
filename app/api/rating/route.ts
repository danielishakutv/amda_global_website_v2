import { NextResponse, type NextRequest } from "next/server";
import { createHmac, randomBytes } from "node:crypto";
import { checkLock, clientIp, recordFailure } from "@/lib/admin-server";
import { addRating, average, readRatings } from "@/lib/ratings-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const VOTER_COOKIE = "amda_rating_id";
const VOTER_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

function validVoterId(value: string | undefined): value is string {
  return !!value && /^[A-Za-z0-9_-]{40,100}$/.test(value);
}

function voterId(req: NextRequest): { id: string; isNew: boolean } {
  const existing = req.cookies.get(VOTER_COOKIE)?.value;
  if (validVoterId(existing)) return { id: existing, isNew: false };
  return { id: randomBytes(32).toString("base64url"), isNew: true };
}

function voterKey(id: string): string {
  // HMAC prevents the anonymous browser token from becoming a reusable lookup
  // value if the ratings data file is ever exposed.
  const secret = process.env.ADMIN_SESSION_SECRET ?? "amda-local-rating-key";
  return createHmac("sha256", secret).update(`rating:${id}`).digest("hex");
}

function attachVoterCookie(res: NextResponse, id: string, isNew: boolean) {
  if (isNew) {
    res.cookies.set(VOTER_COOKIE, id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: VOTER_COOKIE_MAX_AGE,
    });
  }
  return res;
}

// Public aggregate for the widget.
export async function GET(req: NextRequest) {
  const stats = await readRatings();
  const voter = voterId(req);
  return attachVoterCookie(
    NextResponse.json({ ok: true, count: stats.count, average: average(stats) }),
    voter.id,
    voter.isNew
  );
}

// Submit a 1..5 star rating. The anonymous browser ID makes this one rating per
// browser even if localStorage is cleared; the IP limiter remains as a second
// lightweight anti-spam layer.
export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const lock = await checkLock(`rating:${ip}`);
  if (lock.locked) {
    return NextResponse.json({ ok: false, reason: "too-many" }, { status: 429 });
  }

  let stars = 0;
  try {
    const body = (await req.json()) as { stars?: unknown };
    if (typeof body.stars === "number") stars = Math.trunc(body.stars);
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }
  if (stars < 1 || stars > 5) {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  const voter = voterId(req);
  let result;
  try {
    result = await addRating(stars, voterKey(voter.id));
  } catch {
    return NextResponse.json({ ok: false, reason: "save-failed" }, { status: 500 });
  }
  if (result.duplicate) {
    return attachVoterCookie(
      NextResponse.json({ ok: false, reason: "already-rated", count: result.stats.count, average: average(result.stats) }, { status: 409 }),
      voter.id,
      voter.isNew
    );
  }
  await recordFailure(`rating:${ip}`); // counts toward the per-IP limit
  return attachVoterCookie(
    NextResponse.json({ ok: true, count: result.stats.count, average: average(result.stats) }),
    voter.id,
    voter.isNew
  );
}
