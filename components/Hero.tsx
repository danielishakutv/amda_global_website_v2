"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Sparkles, ShieldCheck } from "lucide-react";
import { AnimatedCounter } from "./ui/AnimatedCounter";

const STATS = [
  { value: "100+", label: "Brands Built" },
  { value: "Africa", label: "Service Coverage" },
  { value: "360°", label: "Brand Solutions" },
];

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Hero"
      className="relative isolate min-h-screen overflow-hidden bg-navy-deep pb-24 pt-32 text-white sm:pt-36 lg:pt-40"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="dot-pattern absolute inset-0 opacity-40" />
        <div className="absolute inset-x-0 top-0 h-96 bg-radial-gold" />
        <div
          className="gradient-orb"
          style={{ top: "-8rem", right: "-6rem", height: "28rem", width: "28rem", background: "rgb(var(--color-gold))" }}
        />
        <div
          className="gradient-orb"
          style={{ bottom: "-12rem", left: "-8rem", height: "32rem", width: "32rem", background: "rgb(var(--color-teal))" }}
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        />
      </div>

      <div className="container">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center"
        >
          <span className="section-tag section-tag-dark">
            <Sparkles size={12} className="text-gold" />
            Brand Strategy &amp; Compliance Advisory
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-8 max-w-5xl text-center font-display text-display-xl font-medium leading-[1.02] tracking-tight"
        >
          Building{" "}
          <span className="relative inline-block">
            <span className="italic text-gold">Scalable</span>
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
          </span>{" "}
          and{" "}
          <span className="italic text-gold">Protected</span>
          <br className="hidden sm:block" /> Brands
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-7 max-w-2xl text-center text-base text-white/70 sm:text-lg"
        >
          A brand strategy, experience, and compliance advisory firm helping businesses build
          brands that are clear, credible, scalable, and legally protected.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
        >
          <a href="#contact" className="btn-primary w-full sm:w-auto">
            Start Your Project
            <ArrowRight size={16} strokeWidth={2.5} />
          </a>
          <a href="#services" className="btn-ghost-dark w-full sm:w-auto">
            Explore Services
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-8 backdrop-blur-md sm:gap-10 sm:px-10"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <AnimatedCounter
                value={stat.value}
                className="block font-display text-3xl font-semibold tracking-tight text-gold sm:text-4xl"
              />
              <span className="mt-2 block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/55 sm:text-xs">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Preview cards */}
        <div className="mt-16 grid gap-5 sm:mt-20 lg:grid-cols-2 lg:gap-6">
          <PreviewCard
            icon={<Compass size={20} />}
            title="Brand Strategy & Experience"
            body="Define who you are, how you communicate, and how you show up across all touchpoints."
            tags={["Brand Identity", "Content Strategy", "Print Materials"]}
            delay={0.85}
          />
          <PreviewCard
            icon={<ShieldCheck size={20} />}
            title="Brand Protection & Compliance"
            body="Preventive brand protection and compliance services to help businesses build legally safe brands."
            tags={["Trademark Support", "Brand Governance", "Risk Assessment"]}
            delay={0.95}
          />
        </div>
      </div>
    </section>
  );
}

type PreviewProps = {
  icon: React.ReactNode;
  title: string;
  body: string;
  tags: string[];
  delay?: number;
};

function PreviewCard({ icon, title, body, tags, delay = 0 }: PreviewProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      className="card-dark group"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
          {icon}
        </span>
        <div className="flex-1">
          <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{title}</h3>
          <p className="mt-2 text-sm text-white/65">{body}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-white/70"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
