import Image from "next/image";

type Props = {
  /** "onDark" wraps the logo in a cream pill so the colored mark stays readable on dark surfaces */
  variant?: "onLight" | "onDark";
  /** Pixel height of the logo image */
  height?: number;
  className?: string;
  /** Set false for below-fold logos (footer/widget) so they don't compete with LCP */
  priority?: boolean;
};

export function Logo({ variant = "onLight", height = 36, className = "", priority = false }: Props) {
  // Optimized WebP (~10KB, 480x240) rasterized from the original 548KB SVG wrapper.
  // Same visuals, explicit dimensions prevent CLS.
  const width = Math.round(height * 2);
  const img = (
    <Image
      src="/amda-logo.webp"
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
