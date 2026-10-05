"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxItem = {
  src: string;
  alt: string;
  caption?: string;
  kind?: "image" | "video";
};

export function Lightbox({
  items,
  index,
  onClose,
  onNav,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onNav: (next: number) => void;
}) {
  const item = items[index];
  const hasMany = items.length > 1;

  const prev = useCallback(
    () => onNav((index - 1 + items.length) % items.length),
    [index, items.length, onNav]
  );
  const next = useCallback(
    () => onNav((index + 1) % items.length),
    [index, items.length, onNav]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasMany) prev();
      if (e.key === "ArrowRight" && hasMany) next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, prev, next, hasMany]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="fixed inset-0 z-[100] bg-black/95"
      onClick={onClose}
    >
      {/* Floating top controls */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="pointer-events-auto rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
          {hasMany ? `${index + 1} / ${items.length}` : null}
          {hasMany && item.caption ? " · " : null}
          {item.caption ?? item.alt}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25"
        >
          <X size={20} />
        </button>
      </div>

      {/* Fullscreen stage — media fills the screen */}
      <div
        className="absolute inset-0 flex items-center justify-center p-2 pt-16 pb-4 sm:p-4 sm:pt-16"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMany && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:left-4"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {item.kind === "video" ? (
          <video
            key={item.src}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="h-full max-h-[92vh] w-full max-w-[96vw] bg-black object-contain"
            aria-label={item.alt}
          >
            <source src={item.src} />
          </video>
        ) : (
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            width={2000}
            height={1500}
            sizes="96vw"
            className="h-full max-h-[92vh] w-auto max-w-[96vw] object-contain"
            priority
          />
        )}

        {hasMany && (
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/25 sm:right-4"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
