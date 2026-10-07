"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { useSiteContent } from "@/lib/content-store";

const paragraphs = (answer: string) =>
  answer.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export function Faq() {
  const faqs = (useSiteContent().faqs ?? []).filter((f) => f.q.trim() && f.a.trim());
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  if (!faqs.length) return null;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  // FAQPage structured data. "<" is escaped so admin-edited text can never close the script tag.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: paragraphs(f.a).join(" ") },
    })),
  }).replace(/</g, "\\u003c");

  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-y border-navy/10 bg-white py-20 sm:py-24 lg:py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-4">
            <p className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-muted sm:text-xs">
              <span aria-hidden className="h-2 w-2 bg-amber" />
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="mt-5 font-display text-display-md font-semibold tracking-tight text-navy"
            >
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Can&apos;t find your answer?{" "}
              <a href="#contact" className="font-semibold text-gold-deep underline-offset-4 hover:underline">
                Send us a message
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-8">
            <ul className="border-t border-navy/10">
              {faqs.map((f, i) => {
                const isOpen = open.has(i);
                return (
                  <li key={i} className="border-b border-navy/10">
                    <h3>
                      <button
                        type="button"
                        id={`faq-q-${i}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-a-${i}`}
                        onClick={() => toggle(i)}
                        className="flex w-full items-start justify-between gap-6 py-5 text-left sm:py-6"
                      >
                        <span className="font-display text-lg font-semibold leading-snug text-navy">{f.q}</span>
                        <span
                          aria-hidden
                          className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
                            isOpen ? "border-gold bg-gold text-white" : "border-navy/20 text-navy"
                          }`}
                        >
                          <Plus
                            size={15}
                            strokeWidth={2.5}
                            className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                          />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden" aria-hidden={!isOpen}>
                        <div className="space-y-3 pb-6 pr-2 text-base leading-relaxed text-muted sm:pr-14">
                          {paragraphs(f.a).map((p, j) => (
                            <p key={j} className="whitespace-pre-line">
                              {p}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
