import { NextResponse, type NextRequest } from "next/server";
import { randomBytes, pbkdf2 as pbkdf2Cb } from "node:crypto";
import {
  checkSession,
  saveCredentials,
  verifyPassword,
} from "@/lib/admin-server";

function hashNext(next: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    pbkdf2Cb(next, salt, 600_000, 32, "sha256", (err, derived) => {
      if (err) reject(err);
      else resolve(derived.toString("hex"));
    });
  });
}

export async function POST(req: NextRequest) {
  const authed = await checkSession(req.cookies.get("amda_admin_session")?.value);
  if (!authed) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  let current = "";
  let next = "";
  try {
    const body = (await req.json()) as { current?: unknown; next?: unknown };
    if (typeof body.current === "string") current = body.current;
    if (typeof body.next === "string") next = body.next;
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }
  if (next.length < 12) {
    return NextResponse.json({ ok: false, reason: "too-short" }, { status: 400 });
  }
  if (!(await verifyPassword(current))) {
    return NextResponse.json({ ok: false, reason: "bad-current" }, { status: 403 });
  }
  const salt = randomBytes(16).toString("hex");
  await saveCredentials(salt, await hashNext(next, salt));
  return NextResponse.json({ ok: true });
}
