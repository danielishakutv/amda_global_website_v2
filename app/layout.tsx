import type { Metadata, Viewport } from "next";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import dynamic from "next/dynamic";
import { ContentProvider } from "@/lib/content-store";
import "./globals.css";

const ConsentBanner = dynamic(
  () => import("@/components/ConsentBanner").then((m) => m.ConsentBanner),
  { ssr: false }
);

const GA_MEASUREMENT_ID = "G-X9392YXEZK";

const display = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a1628",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://amdaglobal.com"),
  title: {
    default: "AMDA Global Solution — Building Scalable and Protected Brands",
    template: "%s | AMDA Global Solution",
  },
  description:
    "AMDA Global Solution is a brand strategy, experience, and compliance advisory firm helping businesses build brands that are clear, credible, scalable, and legally protected across Nigeria and Africa.",
  keywords: [
    "brand strategy Nigeria",
    "brand identity Africa",
    "trademark registration Nigeria",
    "CAC business name registration",
    "brand compliance advisory",
    "AMDA Global Solution",
  ],
  authors: [{ name: "AMDA Global Solution" }],
  creator: "AMDA Global Solution",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://amdaglobal.com",
    title: "AMDA Global Solution — Building Scalable and Protected Brands",
    description:
      "Brand strategy, experience, and compliance advisory for businesses across Nigeria and Africa.",
    siteName: "AMDA Global Solution",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMDA Global Solution",
    description:
      "Brand strategy, experience, and compliance advisory for businesses across Nigeria and Africa.",
  },
  icons: {
    // Perf: 10KB WebP logo instead of the 548KB SVG wrapper (same visuals).
    // Saves ~540KB on every first visit. Replace with an optimized
    // 180x180 PNG (<30KB) when you have one.
    icon: [{ url: "/amda-logo.webp", type: "image/webp" }],
    apple: "/amda-logo.webp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        {/* Perf-only resource hints — no visual change */}
        <link rel="preload" as="image" href="/amda-logo.webp" type="image/webp" />
        <link rel="preload" as="image" href="/hero-bg.webp" type="image/webp" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://docs.google.com" />
      </head>
      <body className="font-sans antialiased">
        <ContentProvider>{children}</ContentProvider>
        <ConsentBanner />

        {/* Consent Mode v2 — defaults must run BEFORE gtag.js loads.
            We default everything to 'denied' so nothing tracks until the user opts in
            via the consent banner. The banner calls gtag('consent','update', ...). */}
        <Script id="ga-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });
          `}
        </Script>
        {/* Perf: lazyOnload (idle) instead of afterInteractive — GA (~100KB) no longer
            competes with LCP/hero on first paint. Same tracking, later load. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="ga-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
