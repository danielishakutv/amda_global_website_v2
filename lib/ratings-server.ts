// Server-side store for the public star-rating widget (node runtime).
// Aggregate totals are kept together with one-way hashes of anonymous browser
// IDs. No visitor name, email, IP address, or other identity is stored.
import { promises as fs } from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), "data");
const RATINGS_FILE = path.join(DATA_DIR, "ratings.json");
let writeQueue: Promise<void> = Promise.resolve();

export type RatingStats = {
  count: number;
  sum: number;
  dist: Record<"1" | "2" | "3" | "4" | "5", number>;
  updatedAt: string | null;
  voters: Record<string, string>;
};

const empty = (): RatingStats => ({
  count: 0,
  sum: 0,
  dist: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  updatedAt: null,
  voters: {},
});

export async function readRatings(): Promise<RatingStats> {
  try {
    const parsed = JSON.parse(await fs.readFile(RATINGS_FILE, "utf8")) as Partial<RatingStats>;
    const base = empty();
    return {
      count: typeof parsed.count === "number" ? parsed.count : 0,
      sum: typeof parsed.sum === "number" ? parsed.sum : 0,
      dist: { ...base.dist, ...(parsed.dist ?? {}) },
      updatedAt: parsed.updatedAt ?? null,
      voters:
        parsed.voters && typeof parsed.voters === "object"
          ? Object.fromEntries(
              Object.entries(parsed.voters).filter(
                ([key, value]) => typeof key === "string" && typeof value === "string"
              )
            )
          : {},
    };
  } catch {
    return empty();
  }
}

function serializeWrite<T>(work: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(work, work);
  writeQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

export async function addRating(stars: number, voterKey: string): Promise<{ stats: RatingStats; duplicate: boolean }> {
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    throw new Error("stars must be an integer 1..5");
  }
  return serializeWrite(async () => {
    const stats = await readRatings();
    if (stats.voters[voterKey]) return { stats, duplicate: true };
    stats.count += 1;
    stats.sum += stars;
    stats.dist[String(stars) as keyof RatingStats["dist"]] += 1;
    stats.updatedAt = new Date().toISOString();
    stats.voters[voterKey] = stats.updatedAt;
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmp = `${RATINGS_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(stats, null, 2), { mode: 0o600 });
    await fs.rename(tmp, RATINGS_FILE);
    return { stats, duplicate: false };
  });
}

export async function clearRatings(): Promise<void> {
  await serializeWrite(() => fs.rm(RATINGS_FILE, { force: true }));
}

/** Rounded-to-one-decimal average, or 0 when there are no ratings. */
export function average(stats: RatingStats): number {
  return stats.count ? Math.round((stats.sum / stats.count) * 10) / 10 : 0;
}
