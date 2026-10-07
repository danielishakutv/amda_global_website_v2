"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Palette,
  ShieldCheck,
  ArrowRight,
  Check,
  Plus,
  Minus,
  Building2,
  Stamp,
  ClipboardCheck,
  Printer,
  ExternalLink,
  Maximize2,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";
import { Lightbox } from "./ui/Lightbox";
import { useSiteContent } from "@/lib/content-store";

type Tab = "brand" | "protect" | "comply" | "print";

const TABS: { id: Tab; label: string; icon: React.ReactNode; tabId: string; panelId: string }[] = [
  { id: "brand", label: "Branding", icon: <Palette size={16} />, tabId: "tab-brand", panelId: "panel-brand" },
  { id: "protect", label: "Protection", icon: <ShieldCheck size={16} />, tabId: "tab-protect", panelId: "panel-protect" },
  { id: "comply", label: "Compliance", icon: <ClipboardCheck size={16} />, tabId: "tab-comply", panelId: "panel-comply" },
  { id: "print", label: "Printing & Publication", icon: <Printer size={16} />, tabId: "tab-print", panelId: "panel-print" },
];

export function Services() {
  const [tab, setTab] = useState<Tab>("brand");

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section relative overflow-hidden bg-cream"
    >
      <div className="container relative">
        <div className="max-w-3xl">
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
              Branding, Protection, Compliance, Printing &amp; Publication: connected
              solutions ensuring your brand is visually appealing, strategically
              positioned, and legally secure for long-term growth.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 max-w-2xl text-sm text-muted">
              01 Branding: Brand Strategy • Visual Identity • Brand Consultancy &nbsp;·&nbsp;
              02 Protection: Trademark Support • Brand Protection • Brand Risk Checks
            </p>
          </Reveal>
        </div>

        {/* Tab Switcher */}
        <Reveal delay={0.15}>
          <div className="mt-12 flex">
            <div
              role="tablist"
              aria-label="Service categories"
              className="relative grid w-full grid-cols-2 items-center gap-1 rounded-3xl border border-navy/10 bg-white p-1.5 shadow-card md:grid-cols-4 md:rounded-full"
            >
              {TABS.map((t) => (
                <TabButton
                  key={t.id}
                  active={tab === t.id}
                  onClick={() => setTab(t.id)}
                  id={t.tabId}
                  controls={t.panelId}
                  icon={t.icon}
                >
                  {t.label}
                </TabButton>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Tab Panels */}
        <div className="mt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              role="tabpanel"
              id={TABS.find((t) => t.id === tab)?.panelId}
              aria-labelledby={TABS.find((t) => t.id === tab)?.tabId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {tab === "brand" && <BrandingPanel />}
              {tab === "protect" && <ProtectionPanel />}
              {tab === "comply" && <ComplyPanel />}
              {tab === "print" && <PrintPanel />}
            </motion.div>
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
      className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-xs font-semibold leading-tight transition-colors sm:px-4 sm:text-sm"
    >
      {active && (
        <motion.span
          layoutId="active-tab"
          className="absolute inset-0 rounded-full bg-navy"
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        />
      )}
      <span className={`relative z-10 shrink-0 ${active ? "text-gold-soft" : "text-navy/70"}`}>{icon}</span>
      <span className={`relative z-10 text-center ${active ? "text-white" : "text-navy/70"}`}>{children}</span>
    </button>
  );
}

/* ---------- 01 Brand: Visual Identity Packages (guide §6) ---------- */

function BrandingPanel() {
  const content = useSiteContent();
  return (
    <div>
      <p className="max-w-2xl text-base text-muted">
        Brand Strategy • Visual Identity • Brand Consultancy, presented as three
        progressive packages.
      </p>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {content.packages.map((pkg, i) => (
          <PackageCard key={pkg.id} name={pkg.name} price={pkg.price} description={pkg.description} features={pkg.features} featured={i === 1} />
        ))}
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
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured: boolean;
}) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-3xl p-8 transition-all duration-300 ${
        featured
          ? "border border-gold bg-navy text-cream shadow-card lg:scale-[1.03]"
          : "border border-navy/10 bg-white text-navy hover:-translate-y-1 hover:shadow-card"
      }`}
    >
      {featured && (
        <span className="absolute right-8 top-0 rounded-b-md bg-amber px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-navy">
          Most Popular
        </span>
      )}
      <h3 className="font-display text-2xl font-semibold">{name}</h3>
      <p className={`mt-2 text-sm ${featured ? "text-white/65" : "text-muted"}`}>{description}</p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className={`font-display text-4xl font-semibold ${featured ? "text-gold-soft" : "text-navy"}`}>
          {price}
        </span>
      </div>

      <ul className="mt-7 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <span
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                featured ? "bg-gold/20 text-gold-soft" : "bg-gold/15 text-gold-deep"
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

/* ---------- 02 Protect: CAC + Trademark (guide §7A–B) ---------- */

function ProtectionPanel() {
  const content = useSiteContent();
  const [openId, setOpenId] = useState<string | null>("cac");

  const services = [
    {
      id: "cac",
      icon: Building2,
      title: content.cac.title,
      summary: content.cac.summary,
      rows: content.cac.rows,
    },
    {
      id: "trademark",
      icon: Stamp,
      title: content.trademark.title,
      summary: content.trademark.summary,
      rows: content.trademark.rows,
      priceLabel: content.trademark.priceLabel,
    },
  ];

  return (
    <div>
      <p className="max-w-2xl text-base text-muted">
        Trademark Support • Brand Protection • Brand Risk Checks, delivered in
        partnership with licensed legal professionals.
      </p>

      <ul className="mt-12 space-y-4">
        {services.map((svc) => (
          <ProtectionCard
            key={svc.id}
            svc={svc as Parameters<typeof ProtectionCard>[0]["svc"]}
            open={openId === svc.id}
            onToggle={() => setOpenId(openId === svc.id ? null : svc.id)}
          />
        ))}
      </ul>

      <div className="mt-12 rounded-3xl border-l-4 border-gold bg-navy p-7 text-cream sm:p-9">
        <p className="text-sm leading-relaxed text-white/80 sm:text-base">
          <span className="mb-1 block font-display text-base font-semibold text-gold-soft">
            Compliance Note
          </span>
          Our compliance services help brands avoid infringement, secure ownership, and operate with
          confidence. All legal and trademark-related services are provided as advisory and
          facilitative support in collaboration with licensed legal practitioners.
        </p>
      </div>
    </div>
  );
}

function ProtectionCard({
  svc,
  open,
  onToggle,
}: {
  svc: {
    id?: string;
    icon: React.ElementType;
    title: string;
    summary: string;
    rows: { label: string; value: string }[];
    priceLabel?: string;
  };
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
            open ? "bg-navy text-gold-soft" : "bg-gold/15 text-gold-deep"
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

/* ---------- 03 Comply: Brand Compliance Check & Audit ₦20,000 + Google Form (guide §7C) ---------- */

function ComplyPanel() {
  const content = useSiteContent();
  const audit = content.complianceAudit;
  return (
    <div>
      <p className="max-w-2xl text-base text-muted">
        Business Registration • NGO Registration • Compliance Support, plus a
        standalone compliance audit for existing brands.
      </p>

      <div className="mt-12 overflow-hidden rounded-3xl border border-gold bg-navy text-cream shadow-card">
        <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
              Brand Compliance Check &amp; Audit
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{audit.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">{audit.summary}</p>
            <ul className="mt-6 space-y-3 text-sm text-white/85">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-soft">
                  <Check size={12} strokeWidth={3} />
                </span>
                Full Compliance Audit
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-soft">
                  <Check size={12} strokeWidth={3} />
                </span>
                Gap report + prioritized next steps
              </li>
            </ul>
          </div>
          <div className="lg:col-span-5">
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-md">
              <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/55">
                Investment
              </span>
              <span className="mt-1 block font-display text-4xl font-semibold text-gold-soft">
                {audit.price}
              </span>
              {audit.formUrl ? (
                <a
                  href={audit.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gold-soft"
                >
                  Request the audit
                  <ExternalLink size={15} />
                </a>
              ) : (
                // No form link set in admin yet: the enquiry form is the request path.
                <a
                  href="#contact"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gold-deep"
                >
                  Request the audit
                  <ArrowRight size={15} strokeWidth={2.5} />
                </a>
              )}
              {audit.formUrl && (
                <a
                  href="#contact"
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white/85 transition-colors hover:border-white/30 hover:bg-white/5"
                >
                  Or contact us directly
                  <ArrowRight size={15} strokeWidth={2.5} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 04 Print & Publish (guide §2.04) ---------- */

const PRINT_PROJECTS = [
  { src: "/newprojects/print-multiply-book.webp", title: "MULTIPLY: Book design + bulk print" },
  { src: "/newprojects/print-bazza-history.webp", title: "A History of Bazza: Book publishing" },
  { src: "/newprojects/print-edge-exposure.webp", title: "Edge of Exposure: Design + print run" },
  { src: "/newprojects/print-reason-great.webp", title: "A Reason To Be Great: Print delivery" },
  { src: "/newprojects/print-toko-academy.webp", title: "Toko Academy KSCC 2026: Booklet print" },
  { src: "/newprojects/brand-naf-sunday-shirts.webp", title: "NAF Protestant Sunday School: Custom tees" },
  { src: "/newprojects/brand-code103-shirts.webp", title: "CODE103: Branded apparel" },
];

function PrintPanel() {
  const content = useSiteContent();
  const pp = content.printPublish;
  const [lightbox, setLightbox] = useState<number | null>(null);
  return (
    <div>
      <p className="max-w-2xl text-base text-muted">{pp.summary}</p>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {pp.items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-4 rounded-3xl border border-navy/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-navy text-gold-soft">
              <Printer size={18} />
            </span>
            <span className="font-display text-lg font-semibold text-navy">{item}</span>
          </li>
        ))}
      </ul>

      {/* Recent print & branding work — click any tile to view fullscreen */}
      <div className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">
          Recent work
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINT_PROJECTS.map((p, i) => (
            <button
              key={p.src}
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative overflow-hidden rounded-3xl border border-navy/10 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
              aria-label={`View larger: ${p.title}`}
            >
              <Image
                src={p.src}
                alt={p.title}
                width={800}
                height={600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center gap-2 bg-navy/0 text-cream opacity-0 transition-all group-hover:bg-navy/45 group-hover:opacity-100">
                <Maximize2 size={18} />
                <span className="text-xs font-semibold">Click to view</span>
              </span>
              <span className="block px-4 py-3 text-xs font-semibold text-navy/80">{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox
          items={PRINT_PROJECTS.map((p) => ({ src: p.src, alt: p.title, caption: p.title }))}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNav={setLightbox}
        />
      )}

      <div className="mt-10">
        <a href="#contact" className="btn-primary">
          Discuss a print project
          <ArrowRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
}
