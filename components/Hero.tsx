"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimatedCounter } from "./ui/AnimatedCounter";
import { useSiteContent } from "@/lib/content-store";

const STATS = [
  { value: "100+", label: "Brands Built" },
  { value: "Africa", label: "Service Coverage" },
  { value: "360°", label: "Brand Solutions" },
];

const FOCUS = [
  "Branding",
  "Brand Protection",
  "Business Compliance",
  "Printing & Publishing",
  "Brand Consultancy",
];

export function Hero() {
  const content = useSiteContent();
  const hero = content.hero;

  return (
    <section
      id="top"
      aria-label="Hero"
      className="relative overflow-hidden bg-navy-deep text-white"
    >
      {/* Supplied background image under one flat navy overlay.
          Text paints instantly (no entrance animation) so copy and image
          arrive together — no lag, no busy gradient stacks. */}
      {hero.backgroundImage ? (
        <>
          <Image
            src={hero.backgroundImage}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-navy-deep/65" />
        </>
      ) : null}

      <div className="container relative pb-20 pt-32 sm:pb-24 sm:pt-40">
        <div className="hero-copy max-w-3xl">
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            <span aria-hidden className="h-px w-8 bg-gold" />
            {hero.tag}
          </p>

          <h1 className="mt-6 font-display text-display-xl font-medium leading-[1.04] tracking-tight">
            {hero.titleA}{" "}
            <span className="italic text-gold">{hero.titleAccent1}</span>{" "}
            {hero.titleB}{" "}
            <span className="italic text-gold">{hero.titleAccent2}</span>{" "}
            {hero.titleC}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {hero.sub}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <a href="#contact" className="btn-primary w-full sm:w-auto">
              {hero.primaryCta}
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
            <a href="#services" className="btn-ghost-dark w-full sm:w-auto">
              {hero.secondaryCta}
            </a>
          </div>
        </div>

        {/* Focus areas — guide §1: what AMDA stands for, plain list */}
        <div className="mt-14 border-t border-white/15 pt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            What we do
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {FOCUS.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm font-medium text-white/85">
                <span aria-hidden className="h-1.5 w-1.5 bg-gold" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Stats — flat row, no glass */}
        <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/15 pt-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <AnimatedCounter
                value={stat.value}
                className="block font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
              />
              <p className="mt-2 block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/55 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
