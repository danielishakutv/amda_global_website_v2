"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, Globe2, Wifi, Eye, Target, Gem } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";
import { useSiteContent } from "@/lib/content-store";

export function About() {
  const content = useSiteContent();
  const { whoWeAre, vision, mission, coreValues, coverage } = content;
  const [expanded, setExpanded] = useState(false);
  // First paragraph always shows; the rest sits behind "Read more".
  const [lead, ...rest] = whoWeAre.body;

  return (
    <section id="about" aria-labelledby="about-heading" className="section bg-cream">
      <div className="container relative">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Left column — guide §3 Who We Are, verbatim */}
          <div className="lg:col-span-7">
            <Reveal>
              <SectionTag>Who We Are</SectionTag>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                id="about-heading"
                className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight text-navy"
              >
                {whoWeAre.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-lg font-medium text-navy/80 sm:text-xl">
                {whoWeAre.sub}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 text-base leading-relaxed text-muted">
                <p>{lead}</p>
                {rest.length > 0 && (
                  <>
                    {/* Height animates via grid rows (0fr -> 1fr); text stays in the HTML for SEO */}
                    <div
                      id="about-more"
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden" aria-hidden={!expanded}>
                        <div className="space-y-5 pt-5">
                          {rest.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => !v)}
                      aria-expanded={expanded}
                      aria-controls="about-more"
                      className="mt-4 inline-flex items-center gap-1.5 border-b border-gold-deep/40 pb-0.5 text-sm font-semibold text-gold-deep transition-colors hover:border-gold-deep"
                    >
                      {expanded ? "Read less" : "Read more"}
                      <ChevronDown
                        size={15}
                        strokeWidth={2.5}
                        className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge icon={<Globe2 size={14} />}>{coverage}</Badge>
                <Badge icon={<Wifi size={14} />}>Online &amp; In-Person Support</Badge>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <a
                href="/about"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 transition-colors hover:text-gold-deep hover:underline"
              >
                Read our full story
                <ArrowRight size={15} strokeWidth={2.5} />
              </a>
            </Reveal>
          </div>

          {/* Right column — vision / mission / values (guide §5) */}
          <div className="space-y-5 lg:col-span-5">
            <Reveal delay={0.1}>
              <article className="card-light overflow-hidden border-navy/10 bg-white">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-gold-soft">
                    <Eye size={18} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Our Vision
                  </span>
                </div>
                <p className="mt-5 font-display text-2xl leading-snug text-navy">{vision}</p>
              </article>
            </Reveal>

            <Reveal delay={0.18}>
              <article className="card-light overflow-hidden bg-navy text-cream hover:border-gold/40">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-white">
                    <Target size={18} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">
                    Our Mission
                  </span>
                </div>
                <p className="mt-5 font-display text-xl leading-snug text-cream">{mission}</p>
              </article>
            </Reveal>

            <Reveal delay={0.24}>
              <article className="card-light overflow-hidden border-navy/10 bg-white">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold-deep">
                    <Gem size={18} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Core Values
                  </span>
                </div>
                <p className="mt-5 font-display text-xl leading-snug text-navy">
                  {coreValues.join("  •  ")}
                </p>
              </article>
            </Reveal>
          </div>
        </div>

        {/* Service coverage banner */}
        <Reveal delay={0.1}>
          <div className="mt-20 overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
                  Service Coverage
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-navy sm:text-3xl">
                  Serving Businesses Across Nigeria &amp; International Markets
                </h3>
                <p className="mt-4 max-w-2xl text-muted">
                  Online &amp; in-person support with a partner-based service model,
                  prioritizing systems, professionalism, and accountability for efficient
                  service delivery.
                </p>
              </div>
              <div className="lg:col-span-5 lg:text-right">
                <a href="#contact" className="btn-primary">
                  Let&apos;s Work Together
                  <ArrowRight size={16} strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-4 py-2 text-xs font-medium text-navy">
      <span className="text-gold-deep">{icon}</span>
      {children}
    </span>
  );
}
