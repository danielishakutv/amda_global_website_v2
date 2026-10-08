import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

// Public read endpoint for admin-uploaded images. Files are stored in the
// persistent data dir (written by /api/admin/upload) and served here with a
// long immutable cache — filenames are random, so content never changes under
// a name. This also lets next/image optimize them (the optimizer fetches the
// path back over HTTP).
export const runtime = "nodejs";

const DATA_DIR = process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

// Fixed extension -> Content-Type map. Only these are served (blocks stray
// types) and the type is set explicitly, never sniffed from content.
const TYPES: Record<string, string> = {
  webp: "image/webp",
  mp3: "audio/mpeg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  ogg: "audio/ogg",
  opus: "audio/opus",
  wav: "audio/wav",
  weba: "audio/webm",
  flac: "audio/flac",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
};
// Our own naming scheme only — blocks path traversal and stray file types.
const NAME_RE = /^[a-z0-9]+-[a-z0-9]+\.([a-z0-9]+)$/;

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const name = params.name;
  const m = NAME_RE.exec(name);
  const contentType = m && TYPES[m[1]];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
