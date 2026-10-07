import Image from "next/image";

type Props = {
  /**
   * "onLight"  — padded mark, for light surfaces
   * "onDark"   — padded mark in a cream pill so it stays readable on dark surfaces
   * "wordmark" — tightly cropped mark (no padding), for the off-white header
   */
  variant?: "onLight" | "onDark" | "wordmark";
  /** Pixel height of the logo image */
  height?: number;
  className?: string;
  /** Set false for below-fold logos (footer/widget) so they don't compete with LCP */
  priority?: boolean;
};

// amda-logo-wide.webp is cropped from the 8334px master PNG (520x125).
const WORDMARK_RATIO = 520 / 125;

export function Logo({ variant = "onLight", height = 36, className = "", priority = false }: Props) {
  const wordmark = variant === "wordmark";
  // Optimized WebP (~10KB, 480x240) rasterized from the original 548KB SVG wrapper.
  // Same visuals, explicit dimensions prevent CLS.
  const width = Math.round(height * (wordmark ? WORDMARK_RATIO : 2));
  const img = (
    <Image
      src={wordmark ? "/amda-logo-wide.webp" : "/amda-logo.webp"}
      alt="AMDA Global Solution"
      width={width}
      height={height}
      style={{ height, width: "auto" }}
      className="block select-none"
      draggable={false}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      sizes={`${width}px`}
    />
  );

  if (variant === "onDark") {
    return (
      <span
        className={`inline-flex items-center rounded-2xl bg-cream px-3 py-1.5 shadow-sm ${className}`}
      >
        {img}
      </span>
    );
  }

  return <span className={`inline-flex items-center ${className}`}>{img}</span>;
}
