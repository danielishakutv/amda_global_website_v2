"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Palette,
  ShieldCheck,
  ArrowRight,
  Check,
  Plus,
  Minus,
  Sparkles,
  Building2,
  Stamp,
  ClipboardCheck,
  FileSearch,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";

type Tab = "branding" | "protection";

const PACKAGES = [
  {
    name: "Starter Package",
    price: "₦20,000",
    description: "Perfect for businesses starting their brand journey",
    features: ["Brand audit", "Content direction", "2 social media designs"],
    featured: false,
  },
  {
    name: "Growth Package",
    price: "₦40,000",
    description: "Ideal for businesses ready to level up their brand",
    features: [
      "Brand refresh or identity",
      "4 social media designs with captions",
      "30-day content plan",
    ],
    featured: true,
  },
  {
    name: "Authority Package",
    price: "₦60,000",
    description: "Complete brand system for established businesses",
    features: [
      "Full brand system",
      "Brand positioning strategy",
      "6 weeks of content support",
    ],
    featured: false,
  },
];

const ADDITIONAL_BRANDING = [
  "Brand strategy & positioning",
  "Brand identity systems & guidelines",
  "Content direction & communication frameworks",
  "Printing of branded materials",
];

type ProtectionService = {
  id: string;
  icon: React.ElementType;
  title: string;
  summary: string;
  rows: { label: string; value: string }[];
  highlights?: string[];
  priceLabel?: string;
};

const PROTECTION_SERVICES: ProtectionService[] = [
  {
    id: "cac",
    icon: Building2,
    title: "Business Name Registration (CAC)",
    summary:
      "Register your business correctly with the Corporate Affairs Commission and start operating with confidence.",
    rows: [
      { label: "Business Name Registration", value: "₦35,000" },
      { label: "Limited Liability Company (1 million shares)", value: "₦110,000" },
      { label: "Other registration types", value: "Contact us for pricing" },
    ],
  },
  {
    id: "trademark",
    icon: Stamp,
    title: "Trademark Registration & Advisory",
    summary:
      "Secure ownership of your brand identity through proper trademark search, application, and protection guidance.",
    rows: [
      { label: "Trademark Search and Analysis", value: "Included" },
      { label: "Application Support", value: "Included" },
      { label: "Brand Protection Guidance", value: "Included" },
      { label: "Partnership with licensed professionals", value: "Included" },
    ],
    priceLabel: "₦120,000 – ₦150,000",
  },
  {
    id: "compliance",
    icon: ClipboardCheck,
    title: "Brand Compliance Checks & Audits",
    summary:
      "Comprehensive compliance audit and governance framework so your brand operates within the right legal lanes.",
    rows: [
      { label: "Full compliance audit", value: "Included" },
      { label: "Governance framework", value: "Included" },
      { label: "Ongoing advisory support", value: "Included" },
      { label: "Legal partnership coordination", value: "Included" },
    ],
    priceLabel: "₦250,000+",
  },
  {
    id: "documentation",
    icon: FileSearch,
    title: "Documentation & Regulatory Guidance",
    summary:
      "Pre-launch checks and risk assessments that confirm your brand name is available, defensible, and ready.",
    rows: [
      { label: "Brand Name Availability Check", value: "Included" },
      { label: "Risk Assessment Report", value: "Included" },
      { label: "Recommendations for brand protection", value: "Included" },
    ],
    priceLabel: "₦40,000",
  },
];

export function Services() {
  const [tab, setTab] = useState<Tab>("branding");

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section relative overflow-hidden bg-cream"
    >
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionTag>What We Do</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="services-heading"
              className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight text-navy"
            >
              Our Services
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base text-muted sm:text-lg">
              Comprehensive solutions ensuring your brand is visually appealing, strategically
              positioned, and legally secure for long-term growth.
            </p>
          </Reveal>
        </div>

        {/* Tab Switcher */}
        <Reveal delay={0.15}>
          <div className="mt-12 flex justify-center">
            <div
              role="tablist"
              aria-label="Service categories"
              className="relative inline-flex w-full max-w-2xl items-center rounded-full border border-navy/10 bg-white p-1.5 shadow-card"
            >
              <TabButton
                active={tab === "branding"}
                onClick={() => setTab("branding")}
                id="tab-branding"
                controls="panel-branding"
                icon={<Palette size={16} />}
              >
                Branding &amp; Experience
              </TabButton>
              <TabButton
                active={tab === "protection"}
                onClick={() => setTab("protection")}
                id="tab-protection"
                controls="panel-protection"
                icon={<ShieldCheck size={16} />}
              >
                Brand Protection &amp; Compliance
              </TabButton>
            </div>
          </div>
        </Reveal>

        {/* Tab Panels */}
        <div className="mt-14">
          <AnimatePresence mode="wait">
            {tab === "branding" ? (
              <motion.div
                key="branding"
                role="tabpanel"
                id="panel-branding"
                aria-labelledby="tab-branding"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <BrandingPanel />
              </motion.div>
            ) : (
              <motion.div
                key="protection"
                role="tabpanel"
                id="panel-protection"
                aria-labelledby="tab-protection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <ProtectionPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ---------- Tab Button ---------- */

function TabButton({
  active,
  onClick,
  children,
  id,
  controls,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  id: string;
  controls: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      id={id}
      role="tab"
      type="button"
      aria-selected={active}
      aria-controls={controls}
      onClick={onClick}
      className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-xs font-semibold transition-colors sm:px-5 sm:text-sm"
    >
      {active && (
        <motion.span
          layoutId="active-tab"
          className="absolute inset-0 rounded-full bg-navy"
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        />
      )}
      <span className={`relative z-10 ${active ? "text-gold" : "text-navy/70"}`}>{icon}</span>
      <span className={`relative z-10 ${active ? "text-white" : "text-navy/70"}`}>{children}</span>
    </button>
  );
}

/* ---------- Branding Panel ---------- */

function BrandingPanel() {
  return (
    <div>
      <p className="mx-auto max-w-2xl text-center text-base text-muted">
        We help brands define who they are, how they communicate, and how they show up across all
        touchpoints.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <PackageCard key={pkg.name} {...pkg} />
        ))}
      </div>

      <div className="mt-16 rounded-3xl border border-navy/10 bg-white p-8 shadow-card sm:p-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
              Beyond Packages
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-navy">
              Additional Branding Services
            </h3>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {ADDITIONAL_BRANDING.map((item) => (
              <li key={item} className="flex items-start gap-3 text-navy">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-deep">
                  <Check size={12} strokeWidth={3} />
                </span>
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function PackageCard({
  name,
  price,
  description,
  features,
  featured,
}: (typeof PACKAGES)[number]) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-3xl p-8 transition-all duration-300 ${
        featured
          ? "border border-gold bg-navy text-cream shadow-card lg:scale-[1.03]"
          : "border border-navy/10 bg-white text-navy hover:-translate-y-1 hover:shadow-card"
      }`}
    >
      {featured && (
        <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-amber px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-navy">
          <Sparkles size={11} />
          Most Popular
        </span>
      )}
      <h3 className="font-display text-2xl font-semibold">{name}</h3>
      <p className={`mt-2 text-sm ${featured ? "text-white/65" : "text-muted"}`}>{description}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className={`font-display text-4xl font-semibold ${featured ? "text-gold" : "text-navy"}`}>
          {price}
        </span>
      </div>

      <ul className="mt-7 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                featured ? "bg-gold/20 text-gold" : "bg-gold/15 text-gold-deep"
              }`}
            >
              <Check size={12} strokeWidth={3} />
            </span>
            <span className={featured ? "text-white/85" : "text-navy/80"}>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
          featured
            ? "bg-gold text-white hover:bg-gold-soft"
            : "border border-navy bg-transparent text-navy hover:bg-navy hover:text-cream"
        }`}
      >
        Get Started
        <ArrowRight size={15} strokeWidth={2.5} />
      </a>
    </article>
  );
}

/* ---------- Protection Panel ---------- */

function ProtectionPanel() {
  const [openId, setOpenId] = useState<string | null>(PROTECTION_SERVICES[0].id);

  return (
    <div>
      <p className="mx-auto max-w-2xl text-center text-base text-muted">
        Preventive brand protection and compliance services delivered in partnership with licensed
        legal professionals.
      </p>

      <ul className="mx-auto mt-12 max-w-4xl space-y-4">
        {PROTECTION_SERVICES.map((svc) => (
          <ProtectionCard
            key={svc.id}
            svc={svc}
            open={openId === svc.id}
            onToggle={() => setOpenId(openId === svc.id ? null : svc.id)}
          />
        ))}
      </ul>

      <div className="mx-auto mt-12 max-w-4xl rounded-3xl border-l-4 border-gold bg-navy p-7 text-cream sm:p-9">
        <p className="text-sm leading-relaxed text-white/80 sm:text-base">
          <span className="mb-1 block font-display text-base font-semibold text-gold">
            Compliance Note
          </span>
          Our compliance services help brands avoid infringement, secure ownership, and operate with
          confidence. All legal and trademark-related services are provided as advisory and
          facilitative support in collaboration with licensed legal practitioners.
        </p>
      </div>

      <div className="mt-10 text-center">
        <p className="mb-4 text-sm text-muted">Need a custom solution?</p>
        <a href="#contact" className="btn-primary">
          Let&apos;s discuss your project
          <ArrowRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}

function ProtectionCard({
  svc,
  open,
  onToggle,
}: {
  svc: ProtectionService;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = svc.icon;
  return (
    <li
      className={`overflow-hidden rounded-3xl border bg-white transition-all duration-300 ${
        open ? "border-gold shadow-card" : "border-navy/10 hover:border-navy/30"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-6 text-left sm:p-7"
      >
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-colors ${
            open ? "bg-navy text-gold" : "bg-gold/15 text-gold-deep"
          }`}
        >
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-navy sm:text-xl">{svc.title}</h3>
          <p className="mt-1 hidden text-sm text-muted sm:block">{svc.summary}</p>
        </div>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
            open ? "rotate-180 border-gold bg-gold text-white" : "border-navy/15 text-navy"
          }`}
        >
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-navy/10 bg-cream/50 p-6 sm:p-7">
              <p className="mb-5 text-sm text-muted sm:hidden">{svc.summary}</p>

              <div className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
                {svc.rows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-4 px-5 py-4 ${
                      i !== svc.rows.length - 1 ? "border-b border-navy/10" : ""
                    }`}
                  >
                    <span className="text-sm text-navy/80">{row.label}</span>
                    <span className="text-right font-mono text-sm font-semibold text-navy">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                {svc.priceLabel && (
                  <div>
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                      Investment
                    </span>
                    <span className="mt-1 block font-display text-2xl font-semibold text-navy">
                      {svc.priceLabel}
                    </span>
                  </div>
                )}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream transition-all duration-300 hover:bg-navy-soft"
                >
                  Get Started
                  <ArrowRight size={15} strokeWidth={2.5} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
