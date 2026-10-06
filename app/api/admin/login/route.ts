import { NextResponse } from "next/server";
import {
  checkLock,
  clearLock,
  clientIp,
  createSession,
  isConfigured,
  recordFailure,
  sessionCookieHeader,
  verifyCredentials,
  wantsSecure,
} from "@/lib/admin-server";
import { recordAudit } from "@/lib/audit-server";

export async function POST(req: Request) {
  if (!(await isConfigured())) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 503 });
  }
  const ip = clientIp(req);
  const lock = await checkLock(ip);
  if (lock.locked) {
    await recordAudit("login-blocked", ip, "attempt while IP locked out");
    return NextResponse.json({ ok: false, reason: "locked", retryAfterMs: lock.retryAfterMs }, { status: 429 });
  }
  let username = "";
  let password = "";
  try {
    const body = (await req.json()) as { username?: unknown; password?: unknown };
    if (typeof body.username === "string") username = body.username;
    if (typeof body.password === "string") password = body.password;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }
  if (!username || !password || !(await verifyCredentials(username, password))) {
    const res = await recordFailure(ip);
    if (res.locked) {
      await recordAudit("login-locked", ip, `locked out after repeated failures (user="${username.slice(0, 64)}")`);
      return NextResponse.json({ ok: false, reason: "locked", retryAfterMs: res.retryAfterMs }, { status: 429 });
    }
    await recordAudit("login-failed", ip, `bad credentials (user="${username.slice(0, 64)}")`);
    return NextResponse.json({ ok: false, reason: "bad-password" }, { status: 401 });
  }
  await clearLock(ip);
  const session = await createSession();
  if (!session) {
    return NextResponse.json({ ok: false, reason: "not-configured" }, { status: 503 });
  }
  await recordAudit("login-success", ip, `user="${username.slice(0, 64)}"`);
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", sessionCookieHeader(session.token, session.exp, wantsSecure(req)));
  return res;
}
