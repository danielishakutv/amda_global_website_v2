/**
 * Toko lead notifications - the client side.
 *
 * Copy this into a client project. It is server-side only: TOKO_LEADS_KEY is a
 * credential, so it must never reach a browser and must never be named
 * NEXT_PUBLIC_anything.
 *
 * Everything here returns an outcome rather than throwing. A notification is
 * not the record: the lead is already saved before any of this runs, and a
 * visitor filling in a form must never see an error because a chat app was
 * unreachable.
 */

const BASE = process.env.TOKO_LEADS_URL ?? 'https://admin.tokoacademy.org/api/v1/tech-service';
const TIMEOUT_MS = 8000;

export type Outcome<T> =
  | { ok: true; data: T }
  | { ok: false; reason: 'not-configured' | 'http' | 'network' | 'timeout'; detail: string };

async function callHub<T>(path: string, init?: RequestInit): Promise<Outcome<T>> {
  const key = process.env.TOKO_LEADS_KEY?.trim();
  if (!key) {
    // Not an error: a site is expected to run before notifications are set up.
    console.warn('[toko-leads] skipped - TOKO_LEADS_KEY is not set');
    return { ok: false, reason: 'not-configured', detail: 'TOKO_LEADS_KEY is not set' };
  }

  try {
    const res = await fetch(BASE + path, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + key,
        ...(init?.headers ?? {}),
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    });

    const body = await res.text();
    if (!res.ok) {
      // The hub explains refusals in the body. Logging only the status would
      // leave the next person guessing between a revoked key and a bad payload.
      console.error('[toko-leads] HTTP ' + res.status + ' on ' + path + ': ' + body.slice(0, 300));
      return { ok: false, reason: 'http', detail: 'HTTP ' + res.status + ': ' + body.slice(0, 300) };
    }

    const parsed = body ? (JSON.parse(body) as { data?: T }) : {};
    return { ok: true, data: (parsed.data ?? parsed) as T };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    const detail = error instanceof Error ? error.message : String(error);
    console.error('[toko-leads] ' + (timedOut ? 'timeout' : 'network') + ' on ' + path + ': ' + detail);
    return { ok: false, reason: timedOut ? 'timeout' : 'network', detail };
  }
}

export interface Lead {
  name: string;
  email?: string;
  phone?: string;
  /** E.164, when the form already collects a dial code. Builds the wa.me link. */
  phoneE164?: string;
  service?: string;
  message?: string;
  source?: string;
  /** Where somebody should go to act on it - your own dashboard, usually. */
  actionUrl?: string;
}

/**
 * Announces a lead.
 *
 * Call it AFTER the lead is saved, and ignore the outcome in the response you
 * give the visitor. Log it; never surface it.
 */
export function announceLead(lead: Lead) {
  return callHub<{ sent: number; failed: number; skipped: number }>('/leads', {
    method: 'POST',
    body: JSON.stringify(lead),
  });
}

/* -- the settings wizard ---------------------------------------------------- */

export interface Recipient {
  id: string;
  label: string;
  pausedAt: string | null;
  lastDeliveredAt: string | null;
  lastErrorAt: string | null;
  chat: { type: string; title: string | null; username: string | null };
}

export function listRecipients() {
  return callHub<{ project: { name: string }; recipients: Recipient[] }>('/recipients');
}

export function startPairing(label?: string) {
  return callHub<{ id: string; code: string; expiresAt: string; instructions: string[] }>(
    '/pairings',
    { method: 'POST', body: JSON.stringify({ label: label ?? null }) },
  );
}

/**
 * Asks the hub whether the code has arrived yet.
 *
 * `note` is why nothing was linked, and it is the useful half: in a group the
 * bot only sees messages addressed to it, and Telegram forgets anything older
 * than about a day. Show it rather than a bare "not connected".
 */
export function checkPairing() {
  return callHub<{ linked: Array<{ label: string }>; note?: string }>('/pairings/check', {
    method: 'POST',
  });
}

export function removeRecipient(id: string) {
  return callHub<{ id: string }>('/recipients/' + encodeURIComponent(id), { method: 'DELETE' });
}
