import type { Metadata } from "next";
import {
  ArrowRight,
  Eye,
  Target,
  ShieldCheck,
  Sparkles,
  Compass,
  Handshake,
  HeartHandshake,
  Globe2,
  Brain,
  Layers,
  PenTool,
  ScrollText,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";

export const metadata: Metadata = {
  title: "About Us — A Brand Strategy & Compliance Advisory Firm",
  description:
    "Learn how AMDA Global Solution helps businesses across Nigeria and Africa build brands that are clear, credible, scalable, and legally protected. Our story, vision, mission, and core values.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Integrity Above All",
    body: "We do what we say, and we say what we mean. Every recommendation, deliverable, and conversation is rooted in honesty — even when it's not the easy path.",
  },
  {
    icon: Compass,
    title: "Strategy-Led Thinking",
    body: "We never start with execution. Every solution begins with a clear understanding of the business, the market, and the long-term vision behind the brand.",
  },
  {
    icon: ScrollText,
    title: "Compliance by Design",
    body: "Brand protection isn't an afterthought — it's woven in from day one. We build brands that are not only beautiful, but legally defensible and built to last.",
  },
  {
    icon: HeartHandshake,
    title: "Client Partnership",
    body: "We work as an extension of your team. Your business goals become ours, and your wins become the reason we show up the next day.",
  },
  {
    icon: Sparkles,
    title: "Creative Excellence",
    body: "Good is not good enough. We hold our craft to a standard that reflects the kind of brands we believe Africa deserves to put forward.",
  },
  {
    icon: Globe2,
    title: "African Confidence",
    body: "We build with cultural authenticity and global standards in equal measure — proving that African brands can compete and lead anywhere in the world.",
  },
];

const EXPERTISE_AREAS = [
  {
    icon: Brain,
    title: "Brand Strategy",
    body: "Positioning, audience research, naming, narrative, and the long-range thinking that defines who a brand is in the market.",
  },
  {
    icon: PenTool,
    title: "Creative & Identity",
    body: "Visual systems, brand identity design, content direction, and the production work that turns strategy into something people can see and feel.",
  },
  {
    icon: ShieldCheck,
    title: "Brand Protection & Compliance",
    body: "Trademark advisory, brand governance, and compliance workflows — delivered in collaboration with licensed legal practitioners.",
  },
  {
    icon: Layers,
    title: "Implementation & Systems",
    body: "Operating models, brand guidelines, content frameworks, and the systems that keep a brand consistent as it scales.",
  },
];

const COMMITMENTS = [
  "Transparent scope, timelines, and pricing — always.",
  "Clear ownership of every deliverable, with no hand-off gaps.",
  "Compliance and legal soundness built into every brand we build.",
  "Documentation and governance that outlive the engagement.",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- Page Hero ---------- */}
        <section className="relative isolate overflow-hidden bg-navy-deep pb-24 pt-36 text-white sm:pt-44">
          <div className="absolute inset-0 -z-10">
            <div className="dot-pattern absolute inset-0 opacity-30" />
            <div className="absolute inset-x-0 top-0 h-96 bg-radial-gold" />
            <div
              className="gradient-orb"
              style={{
                top: "-6rem",
                right: "-8rem",
                height: "26rem",
                width: "26rem",
                background: "rgb(var(--color-gold))",
              }}
            />
            <div
              className="gradient-orb"
              style={{
                bottom: "-12rem",
                left: "-10rem",
                height: "30rem",
                width: "30rem",
                background: "rgb(var(--color-teal))",
              }}
            />
          </div>

          <div className="container relative">
            <Reveal>
              <div className="flex justify-center">
                <SectionTag variant="dark">About AMDA Global Solution</SectionTag>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mx-auto mt-7 max-w-4xl text-center font-display text-display-xl font-medium leading-[1.02] tracking-tight">
                A firm built on{" "}
                <span className="italic text-gold">strategy</span>, craft, and{" "}
                <span className="italic text-gold">conviction</span>.
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mx-auto mt-7 max-w-2xl text-center text-base text-white/70 sm:text-lg">
                We help startups, SMEs, personal brands, and growing organizations across Nigeria
                and Africa build brands that are clear, credible, scalable, and legally protected.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <a href="/#contact" className="btn-primary w-full sm:w-auto">
                  Work with us
                  <ArrowRight size={16} strokeWidth={2.5} />
                </a>
                <a href="/#services" className="btn-ghost-dark w-full sm:w-auto">
                  Explore services
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- Story ---------- */}
        <section className="section bg-cream">
          <div
            aria-hidden
            className="dot-pattern-dark absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          />
          <div className="container relative">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
              <div className="lg:col-span-5">
                <Reveal>
                  <SectionTag>Our Story</SectionTag>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-6 font-display text-display-md font-semibold leading-[1.06] tracking-tight text-navy">
                    We sit at the intersection of branding, strategy, and brand protection.
                  </h2>
                </Reveal>
              </div>

              <div className="space-y-6 text-base leading-relaxed text-muted lg:col-span-7">
                <Reveal delay={0.1}>
                  <p>
                    AMDA Global Solution exists because too many promising African brands are built
                    without the foundations they need to grow — strategy that is unclear, identity
                    that is inconsistent, and protection that is left until something goes wrong.
                  </p>
                </Reveal>
                <Reveal delay={0.15}>
                  <p>
                    We were built to change that. From the very first conversation, we work with
                    business owners to design brands that can be defended, scaled, and trusted —
                    brands that move with intention rather than reaction.
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <p>
                    Today, we serve businesses across Nigeria and the wider African continent as a
                    lean, remote-first advisory firm — combining strategy-led thinking, creative
                    excellence, and compliance-aligned solutions with a partner-based service model.
                  </p>
                </Reveal>

                <Reveal delay={0.25}>
                  <ul className="mt-8 space-y-3">
                    {COMMITMENTS.map((c) => (
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

        {/* ---------- Vision + Mission ---------- */}
        <section className="section relative overflow-hidden bg-navy text-white">
          <div aria-hidden className="absolute inset-0 dot-pattern opacity-30" />
          <div
            aria-hidden
            className="gradient-orb"
            style={{
              top: "10%",
              right: "-12rem",
              height: "26rem",
              width: "26rem",
              background: "rgb(var(--color-gold))",
              opacity: 0.22,
            }}
          />

          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <SectionTag variant="dark">Our North Star</SectionTag>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight">
                  What we&apos;re <span className="italic text-gold">building toward</span>.
                </h2>
              </Reveal>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-2">
              <Reveal delay={0.05}>
                <article className="card-dark h-full p-9">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold">
                      <Eye size={20} />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                      Our Vision
                    </span>
                  </div>
                  <p className="mt-7 font-display text-2xl leading-snug text-white sm:text-3xl">
                    To become the number one trusted{" "}
                    <span className="italic text-gold">African brand partner</span>.
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-white/65">
                    A future where African businesses are recognized for the same quality of brand
                    thinking and brand protection as the most respected names anywhere in the world
                    — and where AMDA is the partner they trust to get them there.
                  </p>
                </article>
              </Reveal>

              <Reveal delay={0.12}>
                <article className="h-full overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/15 via-navy-soft to-navy-deep p-9">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-white">
                      <Target size={20} />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                      Our Mission
                    </span>
                  </div>
                  <p className="mt-7 font-display text-2xl leading-snug text-white sm:text-3xl">
                    Help businesses build{" "}
                    <span className="italic text-gold">intentional, scalable, and protected</span>{" "}
                    brands.
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-white/75">
                    Through strategy-led thinking, creative excellence, and compliance-aligned
                    solutions — delivered with transparency, professionalism, and partnership at
                    every stage of the relationship.
                  </p>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- Core Values ---------- */}
        <section className="section relative overflow-hidden bg-cream">
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
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
                  These aren&apos;t poster words. They are the standards we use to make decisions —
                  about who we work with, how we deliver, and what we refuse to compromise on.
                </p>
              </Reveal>
            </div>

            <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} as="li" delay={0.05 + (i % 3) * 0.07}>
                  <article className="card-light group h-full">
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold-deep transition-colors group-hover:bg-navy group-hover:text-gold">
                        <v.icon size={20} />
                      </span>
                      <span className="font-mono text-xs text-muted/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold text-navy">{v.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{v.body}</p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Our Team ---------- */}
        <section className="section relative overflow-hidden bg-navy-deep text-white">
          <div aria-hidden className="absolute inset-0 dot-pattern opacity-25" />
          <div
            aria-hidden
            className="gradient-orb"
            style={{
              bottom: "-12rem",
              right: "-10rem",
              height: "30rem",
              width: "30rem",
              background: "rgb(var(--color-teal))",
              opacity: 0.28,
            }}
          />

          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <SectionTag variant="dark">Our Team</SectionTag>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight">
                  A team of <span className="italic text-gold">experts</span> working as one.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-base text-white/65 sm:text-lg">
                  AMDA is built and run by a team of experts across brand strategy, creative
                  direction, content, and brand protection — alongside a network of licensed legal
                  professionals and industry specialists. We work as a single, accountable unit, not
                  a collection of freelancers.
                </p>
              </Reveal>
            </div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:gap-6">
              {EXPERTISE_AREAS.map((area, i) => (
                <Reveal key={area.title} delay={0.05 + i * 0.06}>
                  <article className="card-dark h-full">
                    <div className="flex items-center gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold">
                        <area.icon size={20} />
                      </span>
                      <h3 className="font-display text-xl font-semibold text-white">
                        {area.title}
                      </h3>
                    </div>
                    <p className="mt-5 text-sm leading-relaxed text-white/65">{area.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.1}>
              <div className="mt-12 rounded-3xl border-l-4 border-gold bg-white/[0.04] p-7 backdrop-blur-md sm:p-9">
                <div className="flex items-start gap-4">
                  <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold text-white sm:grid">
                    <Users size={20} />
                  </span>
                  <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                    Our partner-based model means you get a focused, senior team for every
                    engagement — strategists, creatives, and compliance advisors who collaborate
                    directly with you and with each other. No layers, no hand-offs to junior
                    teams, no blurred ownership.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- Closing CTA ---------- */}
        <section className="section relative overflow-hidden bg-cream">
          <div className="container relative">
            <Reveal>
              <div className="overflow-hidden rounded-[2rem] bg-navy p-10 text-cream shadow-card sm:p-16">
                <div className="grid items-center gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                      Ready When You Are
                    </span>
                    <h2 className="mt-4 font-display text-display-md font-semibold leading-[1.05] tracking-tight">
                      Let&apos;s build a brand that is clear, credible, scalable, and{" "}
                      <span className="italic text-gold">protected</span>.
                    </h2>
                    <p className="mt-5 max-w-xl text-base text-white/70">
                      Tell us about your business and what you&apos;re trying to build. We&apos;ll
                      come back with a clear path forward — no jargon, no inflated promises.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
                    <a href="/#contact" className="btn-primary w-full sm:w-auto">
                      Start your project
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </a>
                    <a href="/#services" className="btn-ghost-dark w-full sm:w-auto">
                      See services
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
