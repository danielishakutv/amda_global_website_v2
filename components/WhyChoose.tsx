import {
  Compass,
  ShieldCheck,
  Boxes,
  Handshake,
  MessagesSquare,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";

const PILLARS = [
  {
    icon: Compass,
    title: "Strategy-First Approach",
    body: "Every brand solution begins with deep strategy. We don't just create visuals—we build intentional brand systems designed for growth.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance-Aware Building",
    body: "We integrate brand protection from day one, ensuring your brand is not only beautiful but legally secure and sustainable.",
  },
  {
    icon: Boxes,
    title: "Clear Service Boundaries",
    body: "Professional systems with transparent processes. You always know what to expect, when to expect it, and how we'll deliver.",
  },
  {
    icon: Handshake,
    title: "Partner-Driven Expertise",
    body: "We collaborate with licensed professionals and industry experts to deliver comprehensive solutions across all touchpoints.",
  },
  {
    icon: MessagesSquare,
    title: "Transparent Communication",
    body: "Open, honest, and accountable communication throughout every project. No surprises, just results.",
  },
  {
    icon: HeartHandshake,
    title: "Client-Centric Focus",
    body: "Your success is our success. We work as an extension of your team, invested in your brand's long-term growth.",
  },
];

export function WhyChoose() {
  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="section relative overflow-hidden bg-navy text-white"
    >
      <div aria-hidden className="absolute inset-0 dot-pattern opacity-30" />
      <div
        aria-hidden
        className="gradient-orb"
        style={{
          top: "20%",
          right: "-10rem",
          height: "26rem",
          width: "26rem",
          background: "rgb(var(--color-gold))",
          opacity: 0.25,
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionTag variant="dark">Why Work With Us</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="why-heading"
              className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight"
            >
              Why Choose <span className="italic text-gold">AMDA</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base text-white/65 sm:text-lg">
              We bring together strategy, creativity, and compliance to build brands that stand the
              test of time.
            </p>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} as="li" delay={0.05 + (i % 3) * 0.07}>
              <PillarCard {...pillar} index={i + 1} />
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

function PillarCard({
  icon: Icon,
  title,
  body,
  index,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  index: number;
}) {
  return (
    <article className="card-dark group h-full">
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-white">
          <Icon size={20} />
        </span>
        <span className="font-mono text-xs text-white/30">
          {String(index).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-6 font-display text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/65">{body}</p>
    </article>
  );
}
