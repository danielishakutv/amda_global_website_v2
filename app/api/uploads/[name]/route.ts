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

// Only our own naming scheme — blocks path traversal and stray file types.
const NAME_RE = /^[a-z0-9]+-[a-z0-9]+\.webp$/;

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const name = params.name;
  if (!NAME_RE.test(name)) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
