import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "rgb(var(--color-navy) / <alpha-value>)",
          deep: "rgb(var(--color-navy-deep) / <alpha-value>)",
          soft: "rgb(var(--color-navy-soft) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--color-gold) / <alpha-value>)",
          soft: "rgb(var(--color-gold-soft) / <alpha-value>)",
          deep: "rgb(var(--color-gold-deep) / <alpha-value>)",
        },
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        sand: "rgb(var(--color-sand) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        teal: "rgb(var(--color-teal) / <alpha-value>)",
        amber: "rgb(var(--color-amber) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.25rem, 5vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        "display-lg": ["clamp(1.875rem, 3.8vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.125rem)", { lineHeight: "1.15", letterSpacing: "-0.005em" }],
      },
      boxShadow: {
        glow: "0 0 60px -10px rgba(27, 125, 194, 0.4)",
        card: "0 30px 60px -30px rgba(8, 32, 56, 0.25)",
        ring: "0 0 0 1px rgba(255,255,255,0.06), 0 30px 60px -30px rgba(0,0,0,0.5)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(rgba(8,32,56,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(8,32,56,0.06) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        "radial-gold":
          "radial-gradient(60% 60% at 50% 0%, rgba(27,125,194,0.22) 0%, transparent 70%)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        "float-slow": "float 9s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%,100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
