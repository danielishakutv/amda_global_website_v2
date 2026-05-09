"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Shield, BarChart3, Megaphone, Settings2, X } from "lucide-react";

const STORAGE_KEY = "amda-consent-v1";
const REOPEN_EVENT = "amda:open-consent";

type Categories = {
  analytics: boolean;
  marketing: boolean;
};

type StoredConsent = Categories & {
  decidedAt: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    openConsentSettings?: () => void;
  }
}

const ALL_GRANTED: Categories = { analytics: true, marketing: true };
const ALL_DENIED: Categories = { analytics: false, marketing: false };

function applyToGtag(c: Categories) {
  if (typeof window === "undefined") return;
  // Ensure gtag exists even if GA hasn't loaded yet — pushes queue to dataLayer
  window.dataLayer = window.dataLayer || [];
  const gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });
  gtag("consent", "update", {
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
    analytics_storage: c.analytics ? "granted" : "denied",
  });
}

function loadStored(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(c: Categories) {
  if (typeof window === "undefined") return;
  const stored: StoredConsent = { ...c, decidedAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState<Categories>(ALL_GRANTED);

  // Decide whether to show banner on mount
  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setPrefs({ analytics: stored.analytics, marketing: stored.marketing });
      // Re-apply persisted choice in case beforeInteractive defaults overrode it
      applyToGtag({ analytics: stored.analytics, marketing: stored.marketing });
    } else {
      setOpen(true);
    }

    const reopen = () => {
      setShowDetails(true);
      setOpen(true);
    };
    window.addEventListener(REOPEN_EVENT, reopen);
    window.openConsentSettings = reopen;
    return () => {
      window.removeEventListener(REOPEN_EVENT, reopen);
      delete window.openConsentSettings;
    };
  }, []);

  // Mark body so other floating UI (e.g. WhatsApp widget) can step out of the way on mobile
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) document.body.setAttribute("data-consent-open", "true");
    else document.body.removeAttribute("data-consent-open");
    return () => document.body.removeAttribute("data-consent-open");
  }, [open]);

  const finalize = (c: Categories) => {
    setPrefs(c);
    persist(c);
    applyToGtag(c);
    setOpen(false);
    setShowDetails(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md"
        >
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-navy-deep text-white shadow-card">
            {/* Header */}
            <div className="flex items-start gap-3 border-b border-white/10 p-5 sm:p-6">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold">
                <Cookie size={18} />
              </span>
              <div className="flex-1">
                <h2 id="consent-title" className="font-display text-lg font-semibold">
                  We value your privacy
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                  We use cookies to understand how you use the site and to improve your
                  experience. Choose what you&apos;re comfortable with.{" "}
                  <a
                    href="https://policies.google.com/technologies/partner-sites"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold underline-offset-4 hover:underline"
                  >
                    Learn more
                  </a>
                  .
                </p>
              </div>
              <button
                type="button"
                aria-label="Close consent options"
                onClick={() => finalize(ALL_DENIED)}
                className="grid h-8 w-8 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Details panel */}
            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.div
                  key="details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-b border-white/10"
                >
                  <ul className="space-y-1 p-3">
                    <CategoryRow
                      icon={<Shield size={16} />}
                      title="Strictly Necessary"
                      description="Required for the site to function. Cannot be disabled."
                      checked
                      locked
                    />
                    <CategoryRow
                      icon={<BarChart3 size={16} />}
                      title="Analytics"
                      description="Helps us understand which pages and content perform best, anonymized."
                      checked={prefs.analytics}
                      onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
                    />
                    <CategoryRow
                      icon={<Megaphone size={16} />}
                      title="Marketing"
                      description="Used to measure the effectiveness of marketing campaigns and ads."
                      checked={prefs.marketing}
                      onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
                    />
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-col gap-2 p-4 sm:p-5">
              {showDetails ? (
                <>
                  <button
                    type="button"
                    onClick={() => finalize(prefs)}
                    className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-soft"
                  >
                    Save preferences
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => finalize(ALL_DENIED)}
                      className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 hover:bg-white/5"
                    >
                      Reject all
                    </button>
                    <button
                      type="button"
                      onClick={() => finalize(ALL_GRANTED)}
                      className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 hover:bg-white/5"
                    >
                      Accept all
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => finalize(ALL_DENIED)}
                      className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 hover:bg-white/5"
                    >
                      Reject all
                    </button>
                    <button
                      type="button"
                      onClick={() => finalize(ALL_GRANTED)}
                      className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-gold-soft"
                    >
                      Accept all
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-gold"
                  >
                    <Settings2 size={13} />
                    Customize
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CategoryRow({
  icon,
  title,
  description,
  checked,
  onChange,
  locked,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
}) {
  return (
    <li className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-white/[0.03]">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-gold">
        {icon}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-sm font-semibold text-white">{title}</span>
          <Toggle checked={checked} onChange={onChange} disabled={locked} />
        </div>
        <p className="mt-1 text-xs leading-relaxed text-white/55">{description}</p>
      </div>
    </li>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-gold" : "bg-white/15"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
          checked ? "translate-x-[1.2rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
