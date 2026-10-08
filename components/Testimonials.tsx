"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Mic, ImageIcon, Truck, MessageSquareText, Maximize2, GraduationCap, Megaphone } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionTag } from "./ui/SectionTag";
import { Lightbox } from "./ui/Lightbox";
import { useSiteContent } from "@/lib/content-store";
import { mediaKind } from "@/lib/media";
import type { TestimonialItem } from "@/lib/site-content";
// Videos play directly inline (no preview facade, no modal), fully responsive.

type Filter = "all" | TestimonialItem["kind"];

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "written", label: "Written" },
  { id: "screenshot", label: "Screenshots" },
  { id: "photo", label: "Photos" },
  { id: "video", label: "Videos" },
  { id: "audio", label: "Voice notes" },
  { id: "delivery", label: "Delivery" },
  { id: "training", label: "Training" },
  { id: "outreach", label: "Outreach" },
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
      <div className="container relative min-w-0">
        <div className="max-w-3xl">
          <Reveal>
            <SectionTag>Client Results</SectionTag>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="testimonials-heading"
              className="mt-6 text-balance break-words font-display text-display-lg font-semibold leading-[1.04] tracking-tight text-navy"
            >
              Testimonials &amp; <span className="italic text-gold-deep">Client Evidence</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            Written testimonials, screenshots, photos, videos, voice notes,
            deliveries, training and outreach: one flexible wall that grows
            as AMDA collects more client evidence.
            </p>
          </Reveal>
        </div>

        {/* Client count: shown only once a real figure is set in admin (never invented) */}
        {content.clientCount && (
          <Reveal delay={0.12}>
            <p className="mt-8 inline-flex items-center gap-3 rounded-full border border-navy/10 bg-white px-6 py-3 text-sm font-semibold text-navy shadow-sm">
              <span className="font-display text-2xl text-gold-deep">{content.clientCount}</span>
              <span className="text-muted">clients &amp; brands served</span>
            </p>
          </Reveal>
        )}

        {/* Filters: wrap to 2-3 rows on phones */}
        <Reveal delay={0.15}>
          <div className="mt-8 flex max-w-full flex-wrap gap-2 sm:mt-10">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`min-h-[36px] rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
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

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={0.04 + (i % 3) * 0.05} className="min-w-0">
              <TestimonialCard item={t} />
            </Reveal>
          ))}
        </div>

        {items.length === 0 && (
          <p className="mt-12 text-sm text-muted">Nothing in this category yet.</p>
        )}
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
    case "training":
      return "Training";
    case "outreach":
      return "Outreach";
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
    case "training":
      return <GraduationCap size={14} />;
    case "outreach":
      return <Megaphone size={14} />;
  }
}

function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

function toYouTubeEmbed(url: string) {
  const m =
    url.match(/[?&]v=([^&]+)/) ?? url.match(/youtu\.be\/([^?&]+)/) ?? url.match(/embed\/([^?&]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

function VideoBlock({ item }: { item: TestimonialItem }) {
  // Direct playback, no preview facade, no modal. Responsive 16:9 inline.
  const src = (item.media ?? "").trim();
  if (!src) return null;
  if (isYouTubeUrl(src)) {
    return (
      <div className="aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={`${toYouTubeEmbed(src)}?rel=0`}
          title={`Video testimonial from ${item.client}`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <video
      controls
      preload="metadata"
      playsInline
      className="aspect-video max-h-[70vh] w-full bg-black object-contain"
      aria-label={`Video testimonial from ${item.client}`}
    >
      <source src={src} />
      Sorry, your browser can&apos;t play this video.
    </video>
  );
}

function ZoomableImage({ item }: { item: TestimonialItem }) {
  const [open, setOpen] = useState(false);
  const src = (item.media ?? "").trim();
  if (!src) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full min-w-0 overflow-hidden bg-cream/60"
        aria-label={`View larger: ${item.client}, ${item.project}`}
      >
        <Image
          src={src}
          alt={`${item.client}, ${item.project}`}
          width={800}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-[4/3] h-auto w-full object-cover"
          loading="lazy"
        />
        <span className="absolute inset-0 flex items-center justify-center gap-2 bg-navy/0 text-cream opacity-0 transition-all group-hover:bg-navy/45 group-hover:opacity-100">
          <Maximize2 size={18} />
          <span className="text-xs font-semibold">Click to view</span>
        </span>
      </button>
      {open && (
        <Lightbox
          items={[
            {
              src,
              alt: `${item.client}, ${item.project}`,
              caption: `${item.client}, ${item.project}`,
            },
          ]}
          index={0}
          onClose={() => setOpen(false)}
          onNav={() => {}}
        />
      )}
    </>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  const media = (item.media ?? "").trim();
  const mediaType = mediaKind(media);
  return (
    <article className="card-light flex h-full w-full min-w-0 flex-col overflow-hidden p-5 sm:p-7">
      <div className="flex min-w-0 items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-gold-deep">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold/15">
          {kindIcon(item.kind)}
        </span>
        <span className="truncate">{kindLabel(item.kind)}</span>
      </div>

      {/* Media slot: rendered by the file's actual type (so Training/Outreach
          items can be a photo or a video), not by the category. */}
      {media && (
        <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-navy/10 bg-cream/60 sm:rounded-2xl">
          {mediaType === "video" ? (
            <VideoBlock item={item} />
          ) : mediaType === "audio" ? (
            <div className="flex min-w-0 flex-col gap-2 p-4">
              <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-navy">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-gold-soft">
                  <Mic size={14} />
                </span>
                <span className="truncate">Voice note from {item.client}</span>
              </div>
              <audio controls preload="none" className="w-full min-w-0" aria-label={`Voice note from ${item.client}`}>
                <source src={media} />
              </audio>
            </div>
          ) : (
            <ZoomableImage item={item} />
          )}
        </div>
      )}

      {item.quote && (
        <p className="mt-4 flex-1 text-pretty break-words text-sm leading-relaxed text-navy/85">“{item.quote}”</p>
      )}

      <div className="mt-5 min-w-0 border-t border-navy/10 pt-4">
        <p className="truncate text-sm font-semibold text-navy">{item.client}</p>
        <p className="mt-0.5 break-words text-xs uppercase leading-relaxed tracking-[0.14em] text-muted">{item.project}</p>
      </div>
    </article>
  );
}
