"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MapPin, Clock, ShieldCheck } from "lucide-react";
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

// The three brand-board pillars, in board order.
const PILLARS = [
  { label: "Trust", className: "bg-gold text-white" },
  { label: "Authority", className: "bg-navy text-white" },
  { label: "Creativity", className: "bg-amber text-navy" },
];

export function Hero() {
  const content = useSiteContent();
  const hero = content.hero;
  const prefersReduced = useReducedMotion();

  const rise = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
        };

  return (
    <section id="top" aria-label="Hero" className="relative overflow-x-clip bg-navy text-white">
      <div className="container pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pt-36">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Copy */}
          <div className="min-w-0 lg:col-span-7">
            <motion.p
              {...rise(0)}
              className="flex items-start gap-3 text-[0.7rem] font-semibold uppercase leading-relaxed tracking-[0.2em] text-white/70 sm:items-center sm:text-xs"
            >
              <span aria-hidden className="mt-[0.45em] h-2 w-2 shrink-0 bg-amber sm:mt-0" />
              <span>{hero.tag}</span>
            </motion.p>

            <motion.h1
              {...rise(0.06)}
              className="mt-6 text-balance break-words font-display text-[clamp(2.5rem,5.4vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.02em]"
            >
              {hero.titleA} <span className="italic text-gold-soft">{hero.titleAccent1}</span>{" "}
              {hero.titleB} <span className="italic text-gold-soft">{hero.titleAccent2}</span>{" "}
              {hero.titleC}
            </motion.h1>

            <motion.p
              {...rise(0.12)}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg"
            >
              {hero.sub}
            </motion.p>

            <motion.div
              {...rise(0.18)}
              className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
            >
              <a href="#contact" className="btn-primary min-h-[48px] w-full sm:w-auto">
                {hero.primaryCta}
                <ArrowRight size={16} strokeWidth={2.5} className="shrink-0" />
              </a>
              <a href="#services" className="btn-ghost-dark min-h-[48px] w-full sm:w-auto">
                {hero.secondaryCta}
              </a>
            </motion.div>

            {/* Immediate trust indicators */}
            <motion.ul
              {...rise(0.24)}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[0.8rem] text-white/70 sm:text-sm"
            >
              <li className="inline-flex items-center gap-2">
                <Clock size={15} className="shrink-0 text-gold-soft" />
                Response within {content.responseTime}
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin size={15} className="shrink-0 text-gold-soft" />
                {content.coverage}
              </li>
              <li className="inline-flex items-center gap-2">
                <ShieldCheck size={15} className="shrink-0 text-gold-soft" />
                CAC &amp; trademark support
              </li>
            </motion.ul>
          </div>

          {/* Visual — the team photo, or the brand-board pillars if none is set */}
          <motion.figure {...rise(0.1)} className="relative lg:col-span-5">
            {hero.backgroundImage ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-navy-soft lg:aspect-[4/5]">
                <Image
                  src={hero.backgroundImage}
                  alt="The AMDA Global Solutions team at work"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                {/* Brand-board signature: Trust / Authority / Creativity */}
                <div aria-hidden className="absolute bottom-5 left-5 grid h-1.5 w-24 grid-cols-3 sm:bottom-6 sm:left-6 sm:w-28">
                  <span className="bg-gold" />
                  <span className="bg-navy" />
                  <span className="bg-amber" />
                </div>
              </div>
            ) : (
              <div className="grid aspect-[4/3] grid-cols-3 gap-4 rounded-xl bg-paper p-6 sm:gap-6 sm:p-10 lg:aspect-[4/5]">
                {PILLARS.map((p) => (
                  <div key={p.label} className={`grid place-items-center ${p.className}`}>
                    <span className="-rotate-90 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] sm:text-base">
                      {p.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.figure>
        </div>

        {/* What we do + key figures */}
        <motion.div
          {...rise(0.3)}
          className="mt-12 grid gap-8 border-t border-white/15 pt-8 lg:mt-16 lg:grid-cols-12 lg:items-end lg:gap-14"
        >
          <div className="lg:col-span-7">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-xs">
              What we do
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
              {FOCUS.map((f) => (
                <li key={f} className="inline-flex items-center gap-2">
                  <span aria-hidden className="h-1 w-1 shrink-0 bg-gold-soft" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <dl className="grid grid-cols-3 divide-x divide-white/15 lg:col-span-5">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex min-w-0 flex-col px-3 first:pl-0 last:pr-0 sm:px-5">
                <dt className="order-2 mt-1 text-[0.62rem] font-medium uppercase leading-tight tracking-[0.14em] text-white/55 sm:text-xs">
                  {stat.label}
                </dt>
                <dd className="order-1">
                  <AnimatedCounter
                    value={stat.value}
                    className="block truncate font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                  />
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
