"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  CONTENT_STORAGE_KEY,
  CONTENT_VERSION,
  DEFAULT_CONTENT,
  type SiteContent,
} from "./site-content";

type StoredShape = { version: number; updatedAt: string; content: SiteContent };

function readStored(): SiteContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredShape;
    if (parsed.version !== CONTENT_VERSION || !parsed.content) return null;
    // Shallow-merge over defaults so new fields added later still resolve.
    return { ...DEFAULT_CONTENT, ...parsed.content };
  } catch {
    return null;
  }
}

const ContentCtx = createContext<SiteContent>(DEFAULT_CONTENT);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    const stored = readStored();
    if (stored) setContent(stored);
    const onUpdate = () => {
      const next = readStored();
      setContent(next ?? DEFAULT_CONTENT);
    };
    window.addEventListener("amda:content-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("amda:content-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  return <ContentCtx.Provider value={content}>{children}</ContentCtx.Provider>;
}

export function useSiteContent(): SiteContent {
  return useContext(ContentCtx);
}

export function saveSiteContent(next: SiteContent) {
  const payload: StoredShape = {
    version: CONTENT_VERSION,
    updatedAt: new Date().toISOString(),
    content: next,
  };
  window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event("amda:content-updated"));
}

export function resetSiteContent() {
  window.localStorage.removeItem(CONTENT_STORAGE_KEY);
  window.dispatchEvent(new Event("amda:content-updated"));
}

export function exportSiteContent(): string {
  const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
  if (raw) return raw;
  return JSON.stringify(
    { version: CONTENT_VERSION, updatedAt: new Date().toISOString(), content: DEFAULT_CONTENT },
    null,
    2
  );
}

export function useContentSaver() {
  const content = useSiteContent();
  return useCallback(
    (patch: Partial<SiteContent>) => saveSiteContent({ ...content, ...patch }),
    [content]
  );
}

export function contentLastUpdated(): string | null {
  try {
    const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) return null;
    return (JSON.parse(raw) as StoredShape).updatedAt ?? null;
  } catch {
    return null;
  }
}

export function useLiveContent(): SiteContent {
  const ctx = useSiteContent();
  return useMemo(() => ctx, [ctx]);
}
