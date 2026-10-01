"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Mic, ImageIcon, Quote, Truck, MessageSquareText } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";
import { useSiteContent } from "@/lib/content-store";
import type { TestimonialItem } from "@/lib/site-content";

type Filter = "all" | TestimonialItem["kind"];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "written", label: "Written" },
  { id: "screenshot", label: "Screenshots" },
  { id: "photo", label: "Photos" },
  { id: "video", label: "Videos" },
  { id: "audio", label: "Voice notes" },
  { id: "delivery", label: "Delivery" },
];

export function Testimonials() {
  const content = useSiteContent();
  const [filter, setFilter] = useState<Filter>("all");
  const items =
    filter === "all"
      ? content.testimonials
      : content.testimonials.filter((t) => t.kind === filter);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="section bg-cream"
    >
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionTag>Client Results</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="testimonials-heading"
              className="mt-6 font-display text-display-lg font-semibold leading-[1.04] tracking-tight text-navy"
            >
              Testimonials &amp; <span className="italic text-gold-deep">Client Evidence</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base text-muted sm:text-lg">
              Screenshots, photos, videos and voice notes — one flexible wall that
              grows as AMDA collects more client evidence.
            </p>
          </Reveal>
        </div>

        {/* Client count — guide: do NOT invent; editable placeholder */}
        <Reveal delay={0.12}>
          <div className="mx-auto mt-10 max-w-xl text-center">
            {content.clientCount ? (
              <p className="inline-flex items-center gap-3 rounded-full border border-navy/10 bg-white px-6 py-3 text-sm font-semibold text-navy shadow-sm">
                <span className="font-display text-2xl text-gold-deep">{content.clientCount}</span>
                <span className="text-muted">clients &amp; brands served</span>
              </p>
            ) : (
              <p className="inline-block rounded-full border border-dashed border-navy/25 bg-white/60 px-6 py-3 text-sm text-muted">
                Client / brand count — to be announced (update in Admin → Testimonials)
              </p>
            )}
          </div>
        </Reveal>

        {/* Filters */}
        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  filter === f.id
                    ? "bg-navy text-cream"
                    : "border border-navy/15 bg-white text-navy/70 hover:border-navy/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={0.04 + (i % 3) * 0.05}>
              <TestimonialCard item={t} />
            </Reveal>
          ))}
        </div>

        {items.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted">
            Nothing in this category yet — add it in Admin → Testimonials.
          </p>
        )}

        <p className="mt-10 text-center text-xs text-muted">
          Structure: Client → Testimonial → Photo / Video / Audio / Screenshot →
          Project / Service. New formats slot in without a redesign.
        </p>
      </div>
    </section>
  );
}

function kindLabel(kind: TestimonialItem["kind"]) {
  switch (kind) {
    case "written":
      return "Written";
    case "screenshot":
      return "Screenshot";
    case "photo":
      return "Photo";
    case "video":
      return "Video";
    case "audio":
      return "Voice note";
    case "delivery":
      return "Delivery photo";
  }
}

function kindIcon(kind: TestimonialItem["kind"]) {
  switch (kind) {
    case "written":
      return <MessageSquareText size={14} />;
    case "screenshot":
      return <ImageIcon size={14} />;
    case "photo":
      return <ImageIcon size={14} />;
    case "video":
      return <Play size={14} />;
    case "audio":
      return <Mic size={14} />;
    case "delivery":
      return <Truck size={14} />;
  }
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <article className="card-light flex h-full flex-col">
      <div className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/15">
          {kindIcon(item.kind)}
        </span>
        {kindLabel(item.kind)}
      </div>

      {/* Media slot */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-navy/10 bg-cream/60">
        {item.media ? (
          <Image
            src={item.media}
            alt={`${item.client} — ${item.project}`}
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
        ) : item.kind === "video" ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-2 border border-dashed border-navy/20 p-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-gold">
              <Play size={18} />
            </span>
            <p className="text-xs font-semibold text-navy">Video testimonial — placeholder</p>
            <p className="text-[11px] text-muted">16:9 · upload MP4/WebM, set media path in Admin</p>
          </div>
        ) : item.kind === "audio" ? (
          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-navy">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-gold">
                <Mic size={14} />
              </span>
              Voice-note testimonial — placeholder
            </div>
            <audio controls preload="none" className="w-full" aria-label={`Voice note from ${item.client}`}>
              {item.media ? <source src={item.media} /> : null}
            </audio>
            <p className="text-[11px] text-muted">Upload MP3/M4A, set media path in Admin</p>
          </div>
        ) : (
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 border border-dashed border-navy/20 p-6 text-center">
            <Quote size={18} className="text-gold-deep" />
            <p className="text-xs font-semibold text-navy">Media placeholder</p>
            <p className="text-[11px] text-muted">Add a screenshot / photo in Admin</p>
          </div>
        )}
      </div>

      {item.quote && <p className="mt-4 flex-1 text-sm leading-relaxed text-navy/85">“{item.quote}”</p>}

      <div className="mt-5 border-t border-navy/10 pt-4">
        <p className="text-sm font-semibold text-navy">{item.client}</p>
        <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-muted">{item.project}</p>
      </div>
    </article>
  );
}
