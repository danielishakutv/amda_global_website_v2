"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";
import { useSiteContent } from "@/lib/content-store";

/* Guide §4 — Our Story, verbatim, editable in Admin → Story */
export function StoryBlock() {
  const content = useSiteContent();
  const story = content.story;
  return (
    <section className="section bg-cream">
      <div className="container relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionTag>{story.heading}</SectionTag>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 font-display text-display-md font-semibold leading-[1.06] tracking-tight text-navy">
                {story.headline}
              </h2>
            </Reveal>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted lg:col-span-7">
            {story.body.map((p, i) => (
              <Reveal key={i} delay={0.08 + i * 0.04}>
                <p>{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <ul className="mt-8 space-y-3">
                {[
                  "Transparent scope, timelines, and pricing. Always.",
                  "Clear ownership of every deliverable, with no hand-off gaps.",
                  "Compliance and legal soundness built into every brand we build.",
                  "Documentation and governance that outlive the engagement.",
                ].map((c) => (
                  <li key={c} className="flex items-start gap-3 text-navy">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep">
                      <ArrowRight size={11} strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium">{c}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Guide §5 — Core Values: Integrity • Excellence • Impact */
export function ValuesBlock() {
  const content = useSiteContent();
  const values = content.coreValues;
  return (
    <section className="section relative overflow-hidden bg-cream">
      <div className="container relative">
        <div className="max-w-3xl">
          <Reveal>
            <SectionTag>Core Beliefs &amp; Values</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight text-navy">
              The principles that{" "}
              <span className="italic text-gold-deep">shape our work</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base text-muted sm:text-lg">
              Three standards we use to make decisions about who we work with,
              how we deliver, and what we refuse to compromise on.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-3 lg:gap-6">
          {values.map((v, i) => (
            <Reveal key={v} as="li" delay={0.05 + i * 0.07}>
              <article className="card-light group h-full">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy font-display text-lg font-semibold text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                  {v.charAt(0)}
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold text-navy">{v}</h3>
                <p className="mt-2 font-mono text-xs text-muted/60">
                  {String(i + 1).padStart(2, "0")}
                </p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
