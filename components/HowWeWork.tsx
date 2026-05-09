import {
  Search,
  PenTool,
  Palette,
  Rocket,
  RefreshCcw,
  Wifi,
  Handshake,
  GitBranch,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";

const STEPS = [
  {
    icon: Search,
    title: "Discovery & Consultation",
    body: "We begin by understanding your business, goals, target audience, and current brand positioning through in-depth conversations.",
  },
  {
    icon: PenTool,
    title: "Strategy Development",
    body: "Based on our discovery, we develop a comprehensive brand strategy that aligns with your business objectives and market positioning.",
  },
  {
    icon: Palette,
    title: "Creative Execution",
    body: "Our team brings the strategy to life through creative design, content development, and brand identity systems.",
  },
  {
    icon: Rocket,
    title: "Implementation & Launch",
    body: "We help implement your brand across all touchpoints—digital, print, and physical—ensuring consistency and impact.",
  },
  {
    icon: RefreshCcw,
    title: "Review & Optimize",
    body: "Post-launch, we review performance, gather feedback, and provide recommendations for continuous brand improvement.",
  },
];

const OPERATING_MODEL = [
  {
    icon: Wifi,
    title: "Remote-First",
    body: "We operate as a lean, remote-first agency, enabling efficient service delivery without geographical limitations.",
  },
  {
    icon: Handshake,
    title: "Partner-Based Model",
    body: "We collaborate with licensed professionals and industry experts to deliver comprehensive solutions.",
  },
  {
    icon: GitBranch,
    title: "Systems & Accountability",
    body: "We prioritize professional systems and accountability, ensuring transparent communication throughout.",
  },
];

export function HowWeWork() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="section relative overflow-hidden bg-navy-deep text-white"
    >
      <div aria-hidden className="absolute inset-0 dot-pattern opacity-25" />
      <div
        aria-hidden
        className="gradient-orb"
        style={{
          bottom: "-10rem",
          left: "-10rem",
          height: "30rem",
          width: "30rem",
          background: "rgb(var(--color-teal))",
          opacity: 0.3,
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionTag variant="dark">Our Process</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="process-heading"
              className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight"
            >
              How We <span className="italic text-gold">Work</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base text-white/65 sm:text-lg">
              A systematic approach to building brands that are intentional, scalable, and protected.
            </p>
          </Reveal>
        </div>

        {/* Timeline */}
        <ol className="relative mx-auto mt-16 max-w-4xl">
          {/* vertical rail */}
          <span
            aria-hidden
            className="absolute left-[1.4rem] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent sm:block"
          />

          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.title} delay={0.05 + i * 0.06} className="relative pb-10 sm:pl-20">
              <div className="absolute left-0 top-0 hidden sm:block">
                <span className="relative grid h-12 w-12 place-items-center rounded-full bg-navy ring-4 ring-navy-deep">
                  <span className="absolute inset-0 rounded-full bg-gold/15" />
                  <span className="relative font-mono text-sm font-bold text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold sm:hidden">
                    <step.icon size={18} />
                  </span>
                  <span className="font-mono text-xs text-gold sm:hidden">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold sm:grid">
                    <step.icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white sm:mt-0">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{step.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Operating Model */}
        <div className="mt-16">
          <Reveal>
            <h3 className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Operating Model
            </h3>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3 lg:gap-6">
            {OPERATING_MODEL.map((item, i) => (
              <Reveal key={item.title} delay={0.05 + i * 0.07}>
                <article className="card-dark group h-full text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gold/15 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                    <item.icon size={20} />
                  </span>
                  <h4 className="mt-5 font-display text-lg font-semibold text-white">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm text-white/65">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 flex justify-center">
            <a href="#contact" className="btn-primary">
              Start Your Project
              <ArrowRight size={16} strokeWidth={2.5} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
