import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { checkSession, clientIp } from "@/lib/admin-server";
import { recordAudit } from "@/lib/audit-server";

// Admin media upload. Session-guarded (also behind middleware).
//  - Images are re-encoded with sharp (loaded lazily so Next's build-time
//    page-data workers never touch the native addon): this strips EXIF, caps
//    dimensions, converts to WebP, and neutralizes any payload hidden in a
//    polyglot file (the bytes we write are our own re-encode).
//  - Audio and video are stored as-is (we can't re-encode them here); only
//    known media types are accepted and they are served back with a fixed
//    Content-Type and nosniff, never as HTML/script.
export const runtime = "nodejs";

// Uploads live in the persistent data dir (not public/, which `next start`
// snapshots at startup and won't serve new files from). Served via GET
// /api/uploads/[name].
const DATA_DIR = process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif", "avif"]);
// mime -> file extension for pass-through (non-image) uploads.
const AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/x-mp4a-latm": "m4a",
  "audio/aac": "aac",
  "audio/ogg": "ogg",
  "application/ogg": "ogg",
  "audio/opus": "opus",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/webm": "weba",
  "audio/flac": "flac",
  "audio/x-flac": "flac",
};
const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

const MAX = { image: 12 * 1024 * 1024, audio: 25 * 1024 * 1024, video: 64 * 1024 * 1024 };

const AUDIO_EXTENSIONS = new Set(Object.values(AUDIO_TYPES));
const VIDEO_EXTENSIONS = new Set(Object.values(VIDEO_TYPES));

type MediaKind = keyof typeof MAX;

// Some Windows and mobile browsers submit M4A/voice-note files with an empty
// type (or application/octet-stream). In that case only, fall back to the
// filename extension. A declared but unsupported MIME type is still rejected.
function classify(file: File): { kind: MediaKind; ext: string } | null {
  const type = file.type.toLowerCase();
  if (IMAGE_TYPES.has(type)) return { kind: "image", ext: "webp" };
  if (type in AUDIO_TYPES) return { kind: "audio", ext: AUDIO_TYPES[type] };
  if (type in VIDEO_TYPES) return { kind: "video", ext: VIDEO_TYPES[type] };
  if (type && type !== "application/octet-stream") return null;

  const ext = file.name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "";
  if (IMAGE_EXTENSIONS.has(ext)) return { kind: "image", ext: "webp" };
  if (AUDIO_EXTENSIONS.has(ext)) return { kind: "audio", ext };
  if (VIDEO_EXTENSIONS.has(ext)) return { kind: "video", ext };
  return null;
}

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

  const type = file.type.toLowerCase();
  const media = classify(file);
  if (!media) {
    return NextResponse.json({ ok: false, reason: "bad-type" }, { status: 415 });
  }
  const { kind } = media;
  if (file.size === 0) {
    return NextResponse.json({ ok: false, reason: "empty-file" }, { status: 400 });
  }
  if (file.size > MAX[kind]) {
    return NextResponse.json({ ok: false, reason: "too-large" }, { status: 413 });
  }

  const input = Buffer.from(await file.arrayBuffer());
  let out: Buffer;
  let ext: string;
  if (kind === "image") {
    try {
      const { default: sharp } = await import("sharp");
      out = await sharp(input, { animated: type === "image/gif" })
        .rotate()
        .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      ext = "webp";
    } catch {
      return NextResponse.json({ ok: false, reason: "bad-image" }, { status: 400 });
    }
  } else {
    out = input;
    ext = media.ext;
  }

  const name = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), out);
  } catch {
    return NextResponse.json({ ok: false, reason: "write-failed" }, { status: 500 });
  }

  await recordAudit(`${kind}-upload`, clientIp(req), `${name} (${Math.round(out.length / 1024)}KB from ${type || "extension fallback"})`);
  return NextResponse.json({ ok: true, url: `/api/uploads/${name}`, kind });
}
