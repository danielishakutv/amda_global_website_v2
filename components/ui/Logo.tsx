type Props = {
  /** "onDark" wraps the logo in a cream pill so the colored mark stays readable on dark surfaces */
  variant?: "onLight" | "onDark";
  /** Pixel height of the logo image */
  height?: number;
  className?: string;
};

export function Logo({ variant = "onLight", height = 36, className = "" }: Props) {
  // SVG (~2:1 aspect). Use plain <img> since next/image doesn't optimize SVGs anyway,
  // and skipping it avoids the layout overhead of the optimization wrapper.
  // eslint-disable-next-line @next/next/no-img-element
  const img = (
    <img
      src="/amda_logo.svg"
      alt="AMDA Global Solution"
      style={{ height, width: "auto" }}
      className="block select-none"
      draggable={false}
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
