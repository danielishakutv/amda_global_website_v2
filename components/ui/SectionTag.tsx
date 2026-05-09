type Props = {
  children: React.ReactNode;
  variant?: "light" | "dark";
  className?: string;
};

export function SectionTag({ children, variant = "light", className = "" }: Props) {
  return (
    <span
      className={`section-tag ${variant === "dark" ? "section-tag-dark" : "section-tag-light"} ${className}`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${variant === "dark" ? "bg-gold" : "bg-navy"}`}
      />
      {children}
    </span>
  );
}
