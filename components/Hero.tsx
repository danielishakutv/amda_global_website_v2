"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
      {/* Supplied background image, held back under layered navy overlays so
          type stays readable — darker at the top for the transparent navbar,
          softer in the middle, grounding at the bottom. */}
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
          {/* Base dim so image never looks raw */}
          <div aria-hidden className="absolute inset-0 bg-navy-deep/70" />
          {/* Top-down blend: heavy at the top for nav plus headline, lifts in middle, settles darker at bottom */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-navy-deep/90 via-navy-deep/30 to-navy-deep/80"
          />
          {/* Extra top scrim just behind navbar so upper area never looks like no overlay */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-navy-deep via-navy-deep/60 to-transparent"
          />
          {/* Soft left shade so headline always sits on dark */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-navy-deep/50 via-transparent to-transparent"
          />
        </>
      ) : null}

      <div className="container relative pb-20 pt-32 sm:pb-24 sm:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
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
        </motion.div>

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
