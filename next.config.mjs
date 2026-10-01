/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Server mode (runs on the VPS with `npm start`): enables API routes,
  // middleware, and real httpOnly-cookie admin sessions.
  // NOTE: no `output: "export"` — the old static `out/` workflow is retired.
  trailingSlash: true,
  images: { unoptimized: true },
  // Trim ~30-40% off the client bundle by tree-shaking these heavy deps per-route.
  // No visual/content change — same components, smaller JS.
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
