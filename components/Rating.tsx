"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Loader2, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "amda-rating-v1";

type Summary = { count: number; average: number };

export function Rating() {
  const [summary, setSummary] = useState<Summary>({ count: 0, average: 0 });
  const [hover, setHover] = useState(0);
  const [mine, setMine] = useState<number | null>(null); // this browser's submitted rating
  const [locked, setLocked] = useState(false); // server knows this browser already voted
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      const saved = Number(v);
      if (Number.isInteger(saved) && saved >= 1 && saved <= 5) setMine(saved);
    } catch {
      /* ignore */
    }
    fetch("/api/rating/", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => {
        if (b?.ok) setSummary({ count: b.count, average: b.average });
      })
      .catch(() => {});
  }, []);

  const submit = async (stars: number) => {
    if (busy || mine !== null || locked) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/rating/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stars }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        setError(
          body.reason === "already-rated" || body.reason === "too-many"
            ? "You have already rated us. Thank you!"
            : "Could not save your rating. Please try again."
        );
        if (body.reason === "already-rated") setLocked(true);
        setBusy(false);
        return;
      }
      setSummary({ count: body.count, average: body.average });
      setMine(stars);
      try {
        window.localStorage.setItem(STORAGE_KEY, String(stars));
      } catch {
        /* ignore */
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    }
    setBusy(false);
  };

  const done = mine !== null || locked;
  // Stars shown filled: the submitted value, else the hover preview.
  const shown = mine ?? hover;

  return (
    <section id="rate" aria-labelledby="rate-heading" className="bg-navy py-16 text-white sm:py-20">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <p className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/55 sm:text-xs">
              <span aria-hidden className="h-2 w-2 bg-amber" />
              Your feedback
            </p>
            <h2 id="rate-heading" className="mt-5 font-display text-display-md font-semibold tracking-tight">
              {done ? "Thanks for rating us" : "Rate your experience"}
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              {done
                ? "We appreciate you taking a moment. Your feedback helps us keep raising the bar."
                : "One tap — tell us how we're doing. No form, no sign-up."}
            </p>
            {summary.count > 0 && (
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/80">
                <Star size={16} className="fill-amber text-amber" aria-hidden />
                <span className="font-display text-xl font-semibold text-white">{summary.average.toFixed(1)}</span>
                <span className="text-white/60">
                  from {summary.count} {summary.count === 1 ? "rating" : "ratings"}
                </span>
              </p>
            )}
          </div>

          <div className="lg:col-span-6">
            <div
              role="radiogroup"
              aria-label="Rate your experience from 1 to 5 stars"
              className="flex items-center gap-1.5 sm:gap-2"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= shown;
                return (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={mine === n}
                    aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
                    disabled={done || busy}
                    onMouseEnter={() => !done && setHover(n)}
                    onFocus={() => !done && setHover(n)}
                    onClick={() => submit(n)}
                    className={`rounded-md p-1 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber ${
                      done ? "cursor-default" : "hover:scale-110"
                    }`}
                  >
                    <Star
                      size={40}
                      className={`transition-colors ${active ? "fill-amber text-amber" : "fill-transparent text-white/30"}`}
                    />
                  </button>
                );
              })}
              {busy && <Loader2 size={20} className="ml-2 animate-spin text-amber" aria-hidden />}
              {done && !busy && <CheckCircle2 size={22} className="ml-2 text-amber" aria-hidden />}
            </div>
            <p ref={liveRef} aria-live="polite" className="mt-3 min-h-[1.25rem] text-sm text-white/70">
              {error ? <span className="text-amber">{error}</span> : done ? `You rated us ${mine} out of 5.` : ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
