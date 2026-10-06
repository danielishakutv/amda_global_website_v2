/** @type {import('next').NextConfig} */

// Content-Security-Policy — pragmatic for a marketing site that loads Google
// Analytics (gtag) and self-hosts fonts via next/font. 'unsafe-inline' is kept
// for scripts/styles because next/script injects inline GA bootstrap and both
// Tailwind and framer-motion emit inline styles; everything else is locked down.
// The high-value wins here are frame-ancestors (clickjacking on /admin),
// object-src 'none', and base-uri/form-action 'self'.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Server mode (runs on the VPS with `npm start`): enables API routes,
  // middleware, and real httpOnly-cookie admin sessions.
  // NOTE: no `output: "export"` — the old static `out/` workflow is retired.
  trailingSlash: true,
  // Image optimization ON (server mode + sharp installed): next/image now
  // resizes and serves AVIF/WebP per-device instead of shipping the original
  // files. The 2.3MB founder PNG / 2.1MB team PNG become ~tens of KB on screen.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Trim ~30-40% off the client bundle by tree-shaking these heavy deps per-route.
  // No visual/content change — same components, smaller JS.
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
