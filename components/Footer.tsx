"use client";

import { Linkedin, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { CookiePrefsLink } from "./ui/CookiePrefsLink";
import { Logo } from "./ui/Logo";
import { useSiteContent } from "@/lib/content-store";

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
  { label: "Contact", href: "/#contact" },
];

const SOCIALS = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

export function Footer() {
  const site = useSiteContent();
  return (
    <footer className="border-t border-white/10 bg-navy-deep text-cream">
      <div className="container relative pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <Logo variant="onDark" height={64} />
            <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-gold">
              Brand. Strategy. Compliance.
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/65">
              Helping businesses build brands that are clear, credible, scalable, and legally
              protected — across Nigeria and Africa.
            </p>

            <div className="mt-7 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:border-gold hover:text-gold"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {SERVICES.map((s) => (
                <li key={s}>
                  <a
                    href="/#services"
                    className="text-sm text-white/70 transition-colors hover:text-gold"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Company</h3>
            <ul className="mt-5 space-y-3">
              {COMPANY.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-white/70 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contact</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/70">
                <Phone size={16} className="mt-1 text-gold" />
                <a href={site.phoneHref} className="transition-colors hover:text-gold">
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <Mail size={16} className="mt-1 text-gold" />
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold">
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/70">
                <MapPin size={16} className="mt-1 text-gold" />
                <span>{site.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs leading-relaxed text-white/60 sm:text-sm">
            <span className="mb-1 block font-semibold uppercase tracking-[0.18em] text-gold">
              Legal Disclaimer
            </span>
            AMDA Global Solution is not a law firm. All legal and trademark-related services are
            provided as advisory and facilitative support in collaboration with licensed legal
            practitioners. Court representation and statutory fees are not included unless otherwise
            stated.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/55">
            © 2026 AMDA Global Solution. All rights reserved.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
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
