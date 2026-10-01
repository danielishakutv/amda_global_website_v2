"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Globe2,
  Clock,
  Send,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";
import { COUNTRIES, flagEmoji } from "@/lib/countries";
import { useSiteContent } from "@/lib/content-store";

const SERVICES = [
  "Branding - Starter Package",
  "Branding - Growth Package",
  "Branding - Authority Package",
  "Business Name Registration (CAC)",
  "Trademark Registration & Advisory",
  "Brand Compliance & Audits",
  "Documentation & Regulatory Guidance",
  "Custom Project",
];

type FormState = {
  name: string;
  email: string;
  countryIso: string;
  phone: string;
  service: string;
  description: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  countryIso: "NG",
  phone: "",
  service: "",
  description: "",
};

export function Contact() {
  const site = useSiteContent();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const update = <K extends keyof FormState>(key: K) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Please enter your full name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Please enter a valid email.";
    if (!form.service) next.service = "Please select a service.";
    if (!form.description.trim()) next.description = "Please describe your project.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);

    try {
      // Saved to the dashboard inbox AND forwarded to Google Forms by the server.
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          countryIso: form.countryIso,
          phone: form.phone,
          service: form.service,
          description: form.description,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { reason?: string } | null;
        if (data?.reason === "too-many") {
          throw new Error("too-many");
        }
        throw new Error("send-failed");
      }
      setSubmitted(true);
      setForm(EMPTY);
    } catch (err) {
      setSubmitError(
        err instanceof Error && err.message === "too-many"
          ? "You've sent several messages already — please wait a little while and try again."
          : "We couldn't send your message just now. Please try again, or email info@amdaglobal.com directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="section bg-cream"
    >
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionTag>Get In Touch</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="contact-heading"
              className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight text-navy"
            >
              Let&apos;s Build Your <span className="italic text-gold-deep">Brand</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base text-muted sm:text-lg">
              Ready to create a brand that&apos;s clear, credible, scalable, and legally protected?
              Let&apos;s start the conversation.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left — Contact info */}
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col rounded-3xl bg-navy p-8 text-cream shadow-card sm:p-10">
              <h3 className="font-display text-2xl font-semibold">Reach out directly</h3>
              <p className="mt-2 text-sm text-white/65">
                Prefer a call or email? Use the channels below to get in touch with the AMDA team.
              </p>

              <ul className="mt-8 space-y-5">
                <ContactItem
                  icon={<Phone size={18} />}
                  label="Phone"
                  value={site.phone}
                  href={site.phoneHref}
                />
                <ContactItem
                  icon={<Mail size={18} />}
                  label="Email"
                  value={site.email}
                  href={`mailto:${site.email}`}
                />
                <ContactItem
                  icon={<MapPin size={18} />}
                  label="Address"
                  value={site.address}
                />
                <ContactItem
                  icon={<Globe2 size={18} />}
                  label="Service Coverage"
                  value={site.coverage}
                />
              </ul>

              <div className="mt-auto rounded-2xl border border-gold/30 bg-gold/10 p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold text-white">
                    <Clock size={16} />
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-gold">Quick Response</p>
                    <p className="mt-1 text-sm text-white/80">
                      We typically respond within {site.responseTime}. Urgent? Call us directly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — Form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-card sm:p-10">
              {submitted ? (
                <SuccessState onReset={() => setSubmitted(false)} />
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <h3 className="font-display text-2xl font-semibold text-navy">Send us a message</h3>
                  <p className="-mt-2 text-sm text-muted">
                    Tell us a bit about your project and we&apos;ll be in touch.
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name" required error={errors.name}>
                      <input
                        type="text"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => update("name")(e.target.value)}
                        placeholder="Jane Doe"
                        className="input-field"
                      />
                    </Field>
                    <Field label="Email" required error={errors.email}>
                      <input
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => update("email")(e.target.value)}
                        placeholder="jane@company.com"
                        className="input-field"
                      />
                    </Field>
                  </div>

                  <Field label="Phone Number" error={errors.phone}>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <select
                        value={form.countryIso}
                        onChange={(e) => update("countryIso")(e.target.value)}
                        aria-label="Country dial code"
                        className="input-field w-full shrink-0 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230a1628%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:12px_12px] bg-[position:right_1rem_center] bg-no-repeat pr-10 sm:w-56"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.iso} value={c.iso}>
                            {flagEmoji(c.iso)} +{c.dial} {c.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        autoComplete="tel-national"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) => update("phone")(e.target.value)}
                        placeholder="707 779 8418"
                        className="input-field min-w-0 flex-1"
                      />
                    </div>
                  </Field>

                  <Field label="Service Interested In" required error={errors.service}>
                    <select
                      value={form.service}
                      onChange={(e) => update("service")(e.target.value)}
                      className="input-field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230a1628%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:12px_12px] bg-[position:right_1rem_center] bg-no-repeat pr-10"
                    >
                      <option value="">Select a service</option>
                      {SERVICES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Project Description" required error={errors.description}>
                    <textarea
                      value={form.description}
                      onChange={(e) => update("description")(e.target.value)}
                      placeholder="Tell us about your business, goals, and what you're looking to achieve."
                      rows={5}
                      className="input-field resize-none"
                    />
                  </Field>

                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send size={16} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-navy/70">
        {label}
        {required && <span className="ml-1 text-gold-deep">*</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold">
        {icon}
      </span>
      <div>
        <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/50">
          {label}
        </span>
        <span className="mt-1 block text-sm text-white/90 sm:text-base">{value}</span>
      </div>
    </div>
  );
  return href ? (
    <li>
      <a href={href} className="block rounded-2xl transition-colors hover:text-gold">
        {inner}
      </a>
    </li>
  ) : (
    <li>{inner}</li>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="py-10 text-center"
    >
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold-deep">
        <CheckCircle2 size={32} />
      </span>
      <h3 className="mt-6 font-display text-2xl font-semibold text-navy">Message Sent!</h3>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Thank you for reaching out. We&apos;ll get back to you shortly.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 hover:underline"
      >
        Send another message
        <ArrowRight size={15} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}
