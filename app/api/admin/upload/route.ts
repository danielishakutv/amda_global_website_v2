import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { checkSession } from "@/lib/admin-server";

// sharp is a native addon — loaded lazily inside the handler (not at module
// top level) so Next's build-time page-data workers never try to load it.

// Admin image upload. Session-guarded (also behind middleware). Every upload is
// re-encoded with sharp, which (1) strips EXIF/metadata, (2) caps dimensions,
// (3) converts to WebP, and (4) neutralizes any payload hidden in a polyglot
// file — the bytes we write are our own re-encode, never the raw upload.
export const runtime = "nodejs";

// Uploads live in the persistent data dir (not public/, which `next start`
// snapshots at startup and won't serve new files from). They're served back
// out through GET /api/uploads/[name].
const DATA_DIR = process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const MAX_BYTES = 12 * 1024 * 1024; // 12MB raw input
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(req: NextRequest) {
  if (!(await checkSession(req.cookies.get("amda_admin_session")?.value))) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-request" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, reason: "no-file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, reason: "bad-type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, reason: "too-large" }, { status: 413 });
  }

  const input = Buffer.from(await file.arrayBuffer());
  let out: Buffer;
  try {
    const { default: sharp } = await import("sharp");
    out = await sharp(input, { animated: file.type === "image/gif" })
      .rotate() // honour EXIF orientation before stripping it
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad-image" }, { status: 400 });
  }

  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.webp`;
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), out);
  } catch {
    return NextResponse.json({ ok: false, reason: "write-failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, url: `/api/uploads/${name}` });
}
