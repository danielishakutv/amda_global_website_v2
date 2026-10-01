"use client";

import { ArrowRight } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";
import { useSiteContent } from "@/lib/content-store";

export function WhyChoose() {
  const content = useSiteContent();

  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="section bg-navy text-white"
    >
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionTag variant="dark">Why Businesses Choose AMDA</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="why-heading"
              className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight"
            >
              Key <span className="italic text-gold">Differentiators</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base text-white/65 sm:text-lg">
              Practical reasons growing businesses trust AMDA with their brand.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {content.whyChoose.map((pillar, i) => (
            <Reveal key={pillar.title} as="li" delay={0.05 + (i % 3) * 0.07}>
              <article className="card-dark group h-full">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold/15 font-display text-base font-semibold text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs text-white/30">
                    {String(i + 1).padStart(2, "0")} / {String(content.whyChoose.length).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-white">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{pillar.body}</p>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="mt-16 flex justify-center">
            <a href="#services" className="btn-ghost-dark">
              Explore Our Services
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
