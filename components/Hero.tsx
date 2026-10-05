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

export function Hero() {
  const content = useSiteContent();
  const hero = content.hero;
  const prefersReduced = useReducedMotion();

  const rise = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
        };

  return (
    <section
      id="top"
      aria-label="Hero"
      className="relative isolate overflow-x-clip bg-navy-deep text-white"
    >
      {/* Background: photo + layered legibility gradients + glow. No text lag. */}
      {hero.backgroundImage ? (
        <>
          <Image
            src={hero.backgroundImage}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-deep/90 via-navy-deep/70 to-navy-deep/95"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(27,125,194,0.35)_0%,transparent_70%)]"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-grid-dark opacity-60 [background-size:44px_44px]" />
        </>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_0%,rgba(27,125,194,0.35)_0%,transparent_70%),linear-gradient(180deg,#04162A_0%,#082038_100%)]"
        />
      )}

      <div className="container relative flex min-h-[92svh] flex-col justify-center pb-14 pt-28 sm:pb-20 sm:pt-36 lg:pt-40">
        <div className="hero-copy min-w-0 max-w-3xl">
          <motion.p
            {...rise(0)}
            className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/15 bg-white/5 py-2 pl-3 pr-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur sm:text-xs"
          >
            <span aria-hidden className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="truncate">{hero.tag}</span>
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-5 text-balance break-words font-display text-display-xl font-medium leading-[1.04] tracking-tight"
          >
            {hero.titleA}{" "}
            <span className="italic text-gold">{hero.titleAccent1}</span>{" "}
            {hero.titleB}{" "}
            <span className="italic text-gold">{hero.titleAccent2}</span>{" "}
            {hero.titleC}
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
          >
            <a
              href="#contact"
              className="btn-primary min-h-[48px] w-full justify-center px-7 text-center sm:w-auto"
            >
              {hero.primaryCta}
              <ArrowRight size={16} strokeWidth={2.5} className="shrink-0" />
            </a>
            <a
              href="#services"
              className="btn-ghost-dark min-h-[48px] w-full justify-center border-white/25 bg-white/5 px-7 text-center backdrop-blur sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </motion.div>

          {/* Trust row — wraps cleanly on small screens */}
          <motion.ul
            {...rise(0.32)}
            className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/65 sm:text-[0.8rem]"
          >
            <li className="inline-flex min-w-0 items-center gap-1.5">
              <Clock size={14} className="shrink-0 text-gold" />
              <span className="truncate">{content.responseTime} response</span>
            </li>
            <li className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin size={14} className="shrink-0 text-gold" />
              <span className="truncate">{content.coverage}</span>
            </li>
            <li className="inline-flex min-w-0 items-center gap-1.5">
              <ShieldCheck size={14} className="shrink-0 text-gold" />
              <span className="truncate">CAC &amp; trademark support</span>
            </li>
          </motion.ul>
        </div>

        {/* Focus areas — 2-col pills on mobile, row on desktop */}
        <motion.div {...rise(0.4)} className="mt-10 border-t border-white/15 pt-6 sm:pt-7">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-xs">
            What we do
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            {FOCUS.map((f) => (
              <li
                key={f}
                className="inline-flex min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[0.72rem] font-medium text-white/85 backdrop-blur transition-colors hover:border-gold/50 sm:px-4 sm:text-sm"
              >
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span className="truncate">{f}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Stats — glass cards, never squeeze */}
        <motion.div
          {...rise(0.48)}
          className="mt-6 grid grid-cols-3 gap-2.5 border-t border-white/15 pt-6 sm:mt-8 sm:gap-4 sm:pt-8"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.05] p-3 backdrop-blur sm:p-5"
            >
              <AnimatedCounter
                value={stat.value}
                className="block truncate font-display text-xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl"
              />
              <p className="mt-1.5 block text-[0.58rem] font-medium uppercase leading-tight tracking-[0.14em] text-white/55 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue — desktop only */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center lg:flex">
        <span className="h-8 w-[22px] rounded-full border border-white/25 p-1">
          <span className="mx-auto block h-2 w-1 animate-bounce rounded-full bg-gold" />
        </span>
      </div>
    </section>
  );
}
