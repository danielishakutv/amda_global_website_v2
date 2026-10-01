import type { Metadata } from "next";
import {
  ArrowRight,
  Eye,
  Target,
  ShieldCheck,
  Brain,
  Layers,
  PenTool,
  Users,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTag } from "@/components/ui/SectionTag";
import { StoryBlock, ValuesBlock } from "@/components/AboutSections";

const Footer = dynamic(() => import("@/components/Footer").then((m) => m.Footer));
const Founder = dynamic(() => import("@/components/Founder").then((m) => m.Founder));
const WhatsAppWidget = dynamic(
  () => import("@/components/WhatsAppWidget").then((m) => m.WhatsAppWidget),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "About Us — A Brand Strategy & Compliance Advisory Firm",
  description:
    "Learn how AMDA Global Solution helps businesses across Nigeria and Africa build brands that are clear, credible, scalable, and legally protected. Our story, vision, mission, and core values.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About AMDA Global Solution",
    description:
      "Our story, vision, mission and values — a brand strategy and compliance advisory firm for Nigeria and Africa.",
    url: "https://amdaglobal.com/about",
  },
};

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

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- Page Hero ---------- */}
        <section className="bg-navy-deep pb-24 pt-36 text-white sm:pt-44">
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

        {/* ---------- Story (guide §4, editable in Admin → Story) ---------- */}
        <StoryBlock />

        {/* ---------- Vision + Mission (guide §5) ---------- */}
        <section className="section bg-navy text-white">
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
                <article className="h-full overflow-hidden rounded-3xl border border-gold/30 bg-navy-deep p-9">
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
                    <span className="italic text-gold">intentional, sustainable, and protected</span>{" "}
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

        {/* ---------- Core Values (guide §5: Integrity • Excellence • Impact) ---------- */}
        <ValuesBlock />

        {/* ---------- Founder (guide §12) ---------- */}
        <Founder />

        {/* ---------- Our Team ---------- */}
        <section className="section bg-navy-deep text-white">
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
