"use client";

import { Linkedin, Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { CookiePrefsLink } from "./ui/CookiePrefsLink";
import { Logo } from "./ui/Logo";
import { useSiteContent } from "@/lib/content-store";

// lucide has no TikTok glyph; this is Tabler's outline "brand-tiktok" (MIT),
// drawn on the same 24px grid / 2px stroke so it matches the lucide icons.
function TikTok({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 7.917v4.034a9.948 9.948 0 0 1 -5 -1.951v4.5a6.5 6.5 0 1 1 -8 -6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" />
    </svg>
  );
}

const SERVICES = [
  "Brand Strategy",
  "Brand Identity",
  "Content Direction",
  "Print Materials",
  "Trademark Support",
  "Brand Compliance",
];

const COMPANY = [
  { label: "About Us", href: "/about" },
  { label: "Our Services", href: "/#services" },
  { label: "How We Work", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export function Footer() {
  const site = useSiteContent();
  const socials = [
    { icon: Linkedin, label: "LinkedIn", href: site.socials?.linkedin },
    { icon: Instagram, label: "Instagram", href: site.socials?.instagram },
    { icon: Facebook, label: "Facebook", href: site.socials?.facebook },
    { icon: TikTok, label: "TikTok", href: site.socials?.tiktok },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-white/10 bg-navy-deep text-cream">
      <div className="container relative pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Logo variant="wordmark" height={52} />
            <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-gold-soft">
              Brand. Strategy. Compliance.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
              Helping businesses build brands that are clear, credible, scalable, and legally
              protected across Nigeria and Africa.
            </p>

            <div className="mt-7 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`AMDA on ${s.label}`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:border-gold hover:text-gold-soft"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a
                    href="/#services"
                    className="text-sm text-white/70 transition-colors hover:text-gold-soft"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">Company</h3>
            <ul className="mt-5 space-y-3">
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-gold-soft"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/70">
                <Phone size={16} className="mt-1 text-gold-soft" />
                <a href={site.phoneHref} className="transition-colors hover:text-gold-soft">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Mail size={16} className="mt-1 text-gold-soft" />
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold-soft">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin size={16} className="mt-1 text-gold-soft" />
                <span>{site.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs leading-relaxed text-white/60 sm:text-sm">
            <span className="mb-1 block font-semibold uppercase tracking-[0.18em] text-gold-soft">
              Legal Disclaimer
            </span>
            AMDA Global Solution is not a law firm. All legal and trademark-related services are
            provided as advisory and facilitative support in collaboration with licensed legal
            practitioners. Court representation and statutory fees are not included unless otherwise
            stated.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/55">
            © 2026 AMDA Global Solution. All rights reserved.
          </p>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <CookiePrefsLink />
            <p className="text-xs text-white/40">
              Crafted with intention in Abuja &amp; across Africa.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
