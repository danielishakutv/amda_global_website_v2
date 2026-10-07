"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CONTENT_VERSION, DEFAULT_CONTENT, type SiteContent } from "./site-content";

// Content is published on the server (see lib/content-server.ts) and rendered
// into every page by the root layout, so this provider just holds that value —
// plus live updates when the admin publishes from the same tab.

const UPDATED_EVENT = "amda:content-updated";

const ContentCtx = createContext<SiteContent>(DEFAULT_CONTENT);

export function ContentProvider({
  initial,
  children,
}: {
  initial: SiteContent;
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<SiteContent>(initial);

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const next = (e as CustomEvent<SiteContent>).detail;
      if (next) setContent(next);
    };
    window.addEventListener(UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(UPDATED_EVENT, onUpdate);
  }, []);

  return <ContentCtx.Provider value={content}>{children}</ContentCtx.Provider>;
}

export function useSiteContent(): SiteContent {
  return useContext(ContentCtx);
}

type Result = { ok: boolean; reason?: string; updatedAt?: string };

async function readJson(res: Response): Promise<Record<string, unknown>> {
  try {
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Latest published content, fresh from the server (admin only). */
export async function fetchSiteContent(): Promise<{ content: SiteContent; updatedAt: string | null } | null> {
  try {
    const res = await fetch("/api/admin/content/", { cache: "no-store" });
    if (!res.ok) return null;
    const body = await readJson(res);
    if (!body.content) return null;
    return { content: body.content as SiteContent, updatedAt: (body.updatedAt as string | null) ?? null };
  } catch {
    return null;
  }
}

/** Publish to the live site. */
export async function saveSiteContent(next: SiteContent): Promise<Result> {
  try {
    const res = await fetch("/api/admin/content/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: next }),
    });
    const body = await readJson(res);
    if (!res.ok) return { ok: false, reason: typeof body.reason === "string" ? body.reason : "error" };
    window.dispatchEvent(new CustomEvent(UPDATED_EVENT, { detail: body.content ?? next }));
    return { ok: true, updatedAt: body.updatedAt as string };
  } catch {
    return { ok: false, reason: "network" };
  }
}

/** Remove published edits — the site falls back to the built-in defaults. */
export async function resetSiteContent(): Promise<Result> {
  try {
    const res = await fetch("/api/admin/content/", { method: "DELETE" });
    if (!res.ok) return { ok: false, reason: "error" };
    window.dispatchEvent(new CustomEvent(UPDATED_EVENT, { detail: DEFAULT_CONTENT }));
    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export function exportSiteContent(content: SiteContent): string {
  return JSON.stringify(
    { version: CONTENT_VERSION, updatedAt: new Date().toISOString(), content },
    null,
    2
  );
}
