import { ArrowRight, Globe2, Wifi, Eye, Target } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section bg-cream">
      <div
        aria-hidden
        className="dot-pattern-dark absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
      />

      <div className="container relative">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Left column — heading + body */}
          <div className="lg:col-span-7">
            <Reveal>
              <SectionTag>About Us</SectionTag>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                id="about-heading"
                className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight text-navy"
              >
                Who We Are
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl text-lg font-medium text-navy/80 sm:text-xl">
                A Brand Strategy, Experience &amp; Compliance Advisory Firm
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted">
                <p>
                  AMDA Global Solution is helping businesses build brands that are clear, credible,
                  scalable, and legally protected. We work with startups, SMEs, personal brands, and
                  growing organizations across Nigeria and Africa.
                </p>
                <p>
                  We sit at the intersection of branding, strategy, and brand protection. Our
                  services ensure that brands are not only visually appealing, but also strategically
                  positioned and legally secure for long-term growth.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge icon={<Globe2 size={14} />}>Nigeria &amp; Africa</Badge>
                <Badge icon={<Wifi size={14} />}>Remote-First</Badge>
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

          {/* Right column — vision/mission cards */}
          <div className="space-y-5 lg:col-span-5">
            <Reveal delay={0.1}>
              <article className="card-light overflow-hidden border-navy/10 bg-white">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-gold">
                    <Eye size={18} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Our Vision
                  </span>
                </div>
                <p className="mt-5 font-display text-2xl leading-snug text-navy">
                  To become the number one trusted African brand partner.
                </p>
              </article>
            </Reveal>

            <Reveal delay={0.18}>
              <article className="card-light overflow-hidden bg-navy text-cream hover:border-gold/40">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold text-white">
                    <Target size={18} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                    Our Mission
                  </span>
                </div>
                <p className="mt-5 font-display text-xl leading-snug text-cream">
                  To help businesses build intentional, scalable, and protected brands through
                  strategy-led thinking, creative excellence, and compliance-aligned solutions.
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
                  We operate as a lean, remote-first agency with a partner-based service model,
                  prioritizing systems, professionalism, and accountability for efficient service
                  delivery.
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
