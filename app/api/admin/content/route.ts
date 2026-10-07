import { NextResponse, type NextRequest } from "next/server";
import { checkSession, clientIp } from "@/lib/admin-server";
import { recordAudit } from "@/lib/audit-server";
import {
  MAX_CONTENT_BYTES,
  clearSiteContent,
  readSiteContent,
  sanitizeContent,
  writeSiteContent,
} from "@/lib/content-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authed(req: NextRequest): Promise<boolean> {
  return checkSession(req.cookies.get("amda_admin_session")?.value);
}

// Current published content (what visitors see right now).
export async function GET(req: NextRequest) {
  if (!(await authed(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const { content, updatedAt } = await readSiteContent();
  return NextResponse.json({ ok: true, content, updatedAt });
}

// Publish: replaces the live site content.
export async function PUT(req: NextRequest) {
  if (!(await authed(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const raw = await req.text();
  if (raw.length > MAX_CONTENT_BYTES) {
    return NextResponse.json({ ok: false, reason: "too-large" }, { status: 413 });
  }
  let body: { content?: unknown };
  try {
    body = JSON.parse(raw) as { content?: unknown };
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }
  const content = sanitizeContent(body.content);
  if (!content) {
    return NextResponse.json({ ok: false, reason: "invalid" }, { status: 400 });
  }
  let updatedAt: string;
  try {
    updatedAt = await writeSiteContent(content);
  } catch {
    return NextResponse.json({ ok: false, reason: "write-failed" }, { status: 500 });
  }
  await recordAudit("content-published", clientIp(req));
  return NextResponse.json({ ok: true, content, updatedAt });
}

// Reset: drop the published file so the site falls back to the built-in defaults.
export async function DELETE(req: NextRequest) {
  if (!(await authed(req))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  await clearSiteContent();
  await recordAudit("content-reset", clientIp(req));
  return NextResponse.json({ ok: true });
}
