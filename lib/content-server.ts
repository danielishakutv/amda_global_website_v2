// Server-only published site content (node runtime). The admin's "Save" writes
// DATA_DIR/site-content.json; every page render reads it, so edits go live for
// all visitors immediately. Missing/partial file -> falls back to DEFAULT_CONTENT.
import { promises as fs } from "node:fs";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import { CONTENT_VERSION, DEFAULT_CONTENT, type SiteContent } from "./site-content";

const DATA_DIR = process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
export const MAX_CONTENT_BYTES = 512 * 1024;

type Stored = { version: number; updatedAt: string; content: Partial<SiteContent> };

export async function readSiteContent(): Promise<{ content: SiteContent; updatedAt: string | null }> {
  // Opt the calling render out of static caching — content changes at runtime.
  noStore();
  try {
    const parsed = JSON.parse(await fs.readFile(CONTENT_FILE, "utf8")) as Stored;
    if (!parsed.content || typeof parsed.content !== "object") throw new Error("no content");
    return { content: { ...DEFAULT_CONTENT, ...parsed.content }, updatedAt: parsed.updatedAt ?? null };
  } catch {
    return { content: DEFAULT_CONTENT, updatedAt: null };
  }
}

export async function writeSiteContent(content: SiteContent): Promise<string> {
  const updatedAt = new Date().toISOString();
  const payload: Stored = { version: CONTENT_VERSION, updatedAt, content };
  await fs.mkdir(DATA_DIR, { recursive: true });
  // Write-then-rename so a crash mid-write can never leave a half-written file live.
  const tmp = `${CONTENT_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(payload, null, 2), { mode: 0o600 });
  await fs.rename(tmp, CONTENT_FILE);
  return updatedAt;
}

export async function clearSiteContent(): Promise<void> {
  await fs.rm(CONTENT_FILE, { force: true });
}

// Links and image paths end up in href/src. Only allow site-relative paths and
// http(s)/mailto/tel URLs — anything else (javascript:, data:, //host) is dropped.
function safeUrl(v: unknown): string {
  if (typeof v !== "string") return "";
  const s = v.trim();
  if (s === "") return "";
  return /^(\/(?![/\\])|https?:\/\/|mailto:|tel:)/i.test(s) ? s : "";
}

// Social profile links: a pasted bare domain ("tiktok.com/@amdaglobal") would be
// treated by browsers as a page on this site, so add the https:// for them.
function externalUrl(v: unknown): string {
  if (typeof v !== "string") return "";
  const s = v.trim();
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/|$)/i.test(s)) return `https://${s}`;
  return /^https?:\/\//i.test(s) ? s : "";
}

/** Validate an admin-submitted payload. Returns null if it isn't SiteContent-shaped. */
export function sanitizeContent(input: unknown): SiteContent | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const c = { ...DEFAULT_CONTENT, ...(input as Partial<SiteContent>) };
  if (!c.hero || typeof c.hero !== "object" || !Array.isArray(c.packages) || !Array.isArray(c.testimonials)) {
    return null;
  }
  return {
    ...c,
    phoneHref: safeUrl(c.phoneHref) || DEFAULT_CONTENT.phoneHref,
    hero: { ...c.hero, backgroundImage: safeUrl(c.hero.backgroundImage) },
    founder: { ...c.founder, photo: safeUrl(c.founder?.photo), linkedin: safeUrl(c.founder?.linkedin) },
    complianceAudit: { ...c.complianceAudit, formUrl: safeUrl(c.complianceAudit?.formUrl) },
    socials: {
      linkedin: externalUrl(c.socials?.linkedin),
      instagram: externalUrl(c.socials?.instagram),
      facebook: externalUrl(c.socials?.facebook),
      tiktok: externalUrl(c.socials?.tiktok),
    },
    team: (Array.isArray(c.team) ? c.team : []).map((m) => ({
      ...m,
      photo: safeUrl(m.photo),
      linkedin: safeUrl(m.linkedin),
    })),
    testimonials: c.testimonials.map((t) => ({ ...t, media: safeUrl(t.media) })),
  };
}
