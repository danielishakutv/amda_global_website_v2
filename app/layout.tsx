import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ConsentBanner } from "@/components/ConsentBanner";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-X9392YXEZK";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    icon: [
      { url: "/amda_logo.svg", type: "image/svg+xml" },
      { url: "/amda_global_logo.png", type: "image/png" },
    ],
    apple: "/amda_global_logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        {children}
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
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
