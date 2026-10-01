// Session token crypto shared by API routes AND middleware.
// Web-Crypto only (no node: imports) so it runs on the edge runtime too.
//
// Token format: `${id}.${exp}.${sig}` where sig = HMAC-SHA256(secret, `${id}.${exp}`)
const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

export async function signSessionToken(secret: string, id: string, exp: number): Promise<string> {
  const payload = `${id}.${exp}`;
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifySessionToken(
  secret: string,
  token: string
): Promise<{ id: string; exp: number } | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, expRaw, sig] = parts;
  if (!/^[0-9a-f]{32}$/.test(id)) return null;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < Date.now()) return null;
  const expected = await hmac(secret, `${id}.${exp}`);
  try {
    // constant-time compare on raw bytes
    const a = fromHex(sig);
    const b = fromHex(expected);
    if (a.length !== b.length) return null;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    if (diff !== 0) return null;
  } catch {
    return null;
  }
  return { id, exp };
}
