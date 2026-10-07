"use client";

import { Reveal } from "./ui/Reveal";
import { useSiteContent } from "@/lib/content-store";

export function WhoWeServe() {
  const items = (useSiteContent().whoWeServe ?? []).map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;

  return (
    <section id="serve" aria-labelledby="serve-heading" className="border-b border-navy/10 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-4">
            <p className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted sm:text-xs">
              <span aria-hidden className="h-2 w-2 bg-amber" />
              Our clients
            </p>
            <h2
              id="serve-heading"
              className="mt-5 font-display text-display-md font-semibold tracking-tight text-navy"
            >
              Who AMDA Serves
            </h2>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-8">
            <ul className="grid border-l border-t border-navy/10 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <li key={i} className="flex flex-col gap-3 border-b border-r border-navy/10 p-5 sm:p-6">
                  <span className="font-mono text-xs text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-lg font-semibold leading-snug text-navy">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
