"use client";
// Thin client for the server-side admin auth (httpOnly-cookie sessions).
// Passwords are verified on the server; the browser only sees ok/reason.
// Local audit log (content events on this device) stays in localStorage.

export type LoginResult = { ok: boolean; reason?: string; retryAfterMs?: number };

async function readJson(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function apiStatus(): Promise<{ configured: boolean }> {
  try {
    const res = await fetch("/api/admin/status/", { cache: "no-store" });
    if (!res.ok) return { configured: false };
    const body = await readJson(res);
    return { configured: body.configured === true };
  } catch {
    return { configured: false };
  }
}

export async function apiLogin(username: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch("/api/admin/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) return { ok: true };
    const body = await readJson(res);
    const reason = typeof body.reason === "string" ? body.reason : "error";
    const retryAfterMs = typeof body.retryAfterMs === "number" ? body.retryAfterMs : undefined;
    return { ok: false, reason, retryAfterMs };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export async function apiLogout(): Promise<void> {
  try {
    await fetch("/api/admin/logout/", { method: "POST" });
  } catch {
    /* already gone */
  }
}

export async function apiMe(): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/me/", { cache: "no-store" });
    if (!res.ok) return false;
    const body = await readJson(res);
    return body.authed === true;
  } catch {
    return false;
  }
}

export async function apiChangePassword(
  current: string,
  next: string
): Promise<{ ok: boolean; reason?: string }> {
  try {
    const res = await fetch("/api/admin/password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current, next }),
    });
    if (res.ok) return { ok: true };
    const body = await readJson(res);
    return { ok: false, reason: typeof body.reason === "string" ? body.reason : "error" };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export async function apiUpload(
  file: File
): Promise<{ ok: boolean; url?: string; reason?: string }> {
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload/", { method: "POST", body: fd });
    const body = await readJson(res);
    if (res.ok && typeof body.url === "string") return { ok: true, url: body.url };
    return { ok: false, reason: typeof body.reason === "string" ? body.reason : "error" };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export function audit(event: string, detail = "") {
  try {
    const raw = window.localStorage.getItem("amda-admin-audit-v1");
    const arr = raw ? (JSON.parse(raw) as { ts: string; event: string; detail: string }[]) : [];
    arr.push({ ts: new Date().toISOString(), event, detail });
    window.localStorage.setItem("amda-admin-audit-v1", JSON.stringify(arr.slice(-200)));
  } catch {
    /* ignore */
  }
}

export function readAudit(): { ts: string; event: string; detail: string }[] {
  try {
    const raw = window.localStorage.getItem("amda-admin-audit-v1");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export type InboxMessage = {
  id: string;
  ts: string;
  name: string;
  email: string;
  phone: string;
  countryIso: string;
  service: string;
  description: string;
  read: boolean;
};

export async function apiInbox(): Promise<InboxMessage[]> {
  try {
    const res = await fetch("/api/admin/messages/", { cache: "no-store" });
    if (!res.ok) return [];
    const body = await readJson(res);
    return Array.isArray(body.messages) ? (body.messages as InboxMessage[]) : [];
  } catch {
    return [];
  }
}

export async function apiMarkMessage(id: string, read: boolean): Promise<void> {
  try {
    await fetch("/api/admin/messages/", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    });
  } catch {
    /* refresh will reconcile */
  }
}

export async function apiDeleteMessage(id: string): Promise<void> {
  try {
    await fetch(`/api/admin/messages/?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    /* refresh will reconcile */
  }
}
