// Server-only admin auth helpers (node runtime — never import from client code).
// Credentials: DATA_DIR/admin-credentials.json override, else ADMIN_SALT/ADMIN_HASH env.
// Sessions: stateless HMAC tokens (see admin-token.ts) + in-memory activity map
// for the 30-minute idle timeout. Single-process VPS: fine. Multi-instance: use
// sticky sessions or an external store.

import { promises as fs } from "node:fs";
import path from "node:path";
import { pbkdf2, randomBytes, timingSafeEqual } from "node:crypto";
import { signSessionToken, verifySessionToken } from "./admin-token";

export const SESSION_COOKIE = "amda_admin_session";
export const SESSION_MS = 2 * 60 * 60 * 1000;
export const IDLE_MS = 30 * 60 * 1000;
const PBKDF2_ITERS = 600_000;
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

const DATA_DIR = process.env.ADMIN_DATA_DIR ?? path.join(process.cwd(), "data");
const CREDS_FILE = path.join(DATA_DIR, "admin-credentials.json");

function getSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

function validHash(h: string | undefined): h is string {
  return !!h && /^[0-9a-f]{64}$/i.test(h);
}

export async function isConfigured(): Promise<boolean> {
  const creds = await loadCredentials();
  return creds !== null && getSecret() !== null;
}

type Creds = { username: string; salt: string; hash: string };

function validUsername(u: string | undefined): u is string {
  const t = (u ?? "").trim();
  return t.length >= 3 && t.length <= 64;
}

async function loadCredentials(): Promise<Creds | null> {
  const username = (process.env.ADMIN_USERNAME ?? "").trim();
  let salt: string | undefined;
  let hash: string | undefined;
  try {
    const raw = await fs.readFile(CREDS_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Creds>;
    if (parsed.salt && parsed.hash) {
      salt = parsed.salt;
      hash = parsed.hash;
    }
  } catch {
    /* no override file — fall through to env */
  }
  salt ??= process.env.ADMIN_SALT;
  hash ??= process.env.ADMIN_HASH;
  if (!validUsername(username) || !salt || salt.length < 16 || !validHash(hash)) return null;
  return { username, salt, hash: hash as string };
}

export async function saveCredentials(salt: string, hash: string): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CREDS_FILE, JSON.stringify({ salt, hash, updatedAt: new Date().toISOString() }), {
    mode: 0o600,
  });
}

function hashPassword(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    pbkdf2(password, salt, PBKDF2_ITERS, 32, "sha256", (err, derived) => {
      if (err) reject(err);
      else resolve(derived);
    });
  });
}

function safeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

export async function verifyPassword(password: string): Promise<boolean> {
  const creds = await loadCredentials();
  if (!creds) return false;
  const derived = await hashPassword(password, creds.salt);
  const expected = Buffer.from(creds.hash, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

/** Username + password check. Same generic result either way (no user enumeration). */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const creds = await loadCredentials();
  // Always run the KDF so wrong-user and wrong-password take the same time.
  const userOk = creds ? safeEqualStr(username.trim(), creds.username) : false;
  const pwOk = await verifyPassword(password);
  return userOk && pwOk;
}

/* ---------- rate limiting (per IP, in-memory) ---------- */

/* ---------- persistent state (locks + session activity) ----------
   File-backed, because route-handler module memory is not guaranteed to
   persist across requests. Infrequent access (logins, /me polls) so disk
   I/O cost is negligible. */

type LockState = { attempts: number; lockedUntil: number };
type Persisted = { locks: Record<string, LockState>; activity: Record<string, number> };
const STATE_FILE = path.join(DATA_DIR, "admin-state.json");

async function readState(): Promise<Persisted> {
  try {
    const raw = await fs.readFile(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      locks: parsed.locks && typeof parsed.locks === "object" ? parsed.locks : {},
      activity: parsed.activity && typeof parsed.activity === "object" ? parsed.activity : {},
    };
  } catch (err) {
    const msg = (err as NodeJS.ErrnoException).code === "ENOENT" ? null : (err as Error).message;
    if (msg) console.warn(`[admin] auth state unreadable: ${msg}`);
    return { locks: {}, activity: {} };
  }
}

async function writeState(s: Persisted): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(STATE_FILE, JSON.stringify(s), { mode: 0o600 });
  } catch (err) {
    console.warn("[admin] could not persist auth state:", (err as Error).message);
  }
}

export async function checkLock(ip: string): Promise<{ locked: boolean; retryAfterMs: number }> {
  const state = await readState();
  const s = state.locks[ip];
  // lockedUntil: 0 means "counting attempts, not locked" — never treat as expired.
  if (!s || !s.lockedUntil) return { locked: false, retryAfterMs: 0 };
  const remaining = s.lockedUntil - Date.now();
  if (remaining <= 0) {
    delete state.locks[ip];
    await writeState(state);
    return { locked: false, retryAfterMs: 0 };
  }
  return { locked: true, retryAfterMs: remaining };
}

export async function recordFailure(ip: string): Promise<{ locked: boolean; retryAfterMs: number }> {
  const state = await readState();
  const s = state.locks[ip] ?? { attempts: 0, lockedUntil: 0 };
  s.attempts += 1;
  if (s.attempts >= MAX_ATTEMPTS) {
    s.attempts = 0;
    s.lockedUntil = Date.now() + LOCK_MS;
    state.locks[ip] = s;
    await writeState(state);
    console.warn(`[admin] IP lockout: ${ip} (${MAX_ATTEMPTS} failed logins)`);
    return { locked: true, retryAfterMs: LOCK_MS };
  }
  state.locks[ip] = s;
  await writeState(state);
  return { locked: false, retryAfterMs: 0 };
}

export async function clearLock(ip: string): Promise<void> {
  const state = await readState();
  if (state.locks[ip]) {
    delete state.locks[ip];
    await writeState(state);
  }
}

async function touchActivity(id: string): Promise<void> {
  const state = await readState();
  state.activity[id] = Date.now();
  // prune stale entries
  const now = Date.now();
  for (const [key, at] of Object.entries(state.activity)) {
    if (now - at > Math.max(SESSION_MS, IDLE_MS)) delete state.activity[key];
  }
  const keys = Object.keys(state.activity);
  if (keys.length > 5000) {
    const oldest = keys.sort((a, b) => state.activity[a] - state.activity[b])[0];
    delete state.activity[oldest];
  }
  await writeState(state);
}

async function lastActivity(id: string, fallback: number): Promise<number> {
  const state = await readState();
  return state.activity[id] ?? fallback;
}

async function dropActivity(id: string): Promise<void> {
  const state = await readState();
  if (state.activity[id] !== undefined) {
    delete state.activity[id];
    await writeState(state);
  }
}

/* ---------- sessions ---------- */

export async function createSession(): Promise<{ token: string; exp: number } | null> {
  const secret = getSecret();
  if (!secret) return null;
  const id = randomBytes(16).toString("hex");
  const exp = Date.now() + SESSION_MS;
  await touchActivity(id);
  return { token: await signSessionToken(secret, id, exp), exp };
}

export async function checkSession(token: string | undefined): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;
  const verified = await verifySessionToken(secret, token);
  if (!verified) return false;
  const now = Date.now();
  const last = await lastActivity(verified.id, verified.exp - SESSION_MS);
  if (now - last > IDLE_MS) {
    await dropActivity(verified.id);
    return false;
  }
  await touchActivity(verified.id);
  return true;
}

export async function dropSessionActivity(token: string | undefined): Promise<void> {
  if (!token) return;
  const id = token.split(".")[0];
  if (id) await dropActivity(id);
}

/* ---------- cookies ---------- */

export function sessionCookieHeader(token: string, exp: number, secure: boolean): string {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${Math.floor(SESSION_MS / 1000)}`,
    `Expires=${new Date(exp).toUTCString()}`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function wantsSecure(req: Request): boolean {
  if (process.env.NODE_ENV === "production") return true;
  return req.headers.get("x-forwarded-proto") === "https";
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "local";
}
