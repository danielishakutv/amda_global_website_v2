"use client";

import { Cookie } from "lucide-react";

export function CookiePrefsLink({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("amda:open-consent"))}
      className={`inline-flex items-center gap-1.5 text-xs text-white/55 transition-colors hover:text-gold ${className}`}
    >
      <Cookie size={12} />
      Cookie Preferences
    </button>
  );
}
