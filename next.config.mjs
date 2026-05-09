/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produce a fully static site in /out — uploadable to any static host
  // (Apache, Nginx, S3, GitHub Pages, Netlify, cPanel, etc.). No Node runtime needed.
  output: "export",
  // Emit /about/index.html (instead of /about.html) so plain static servers serve it
  // when visiting /about — and links between pages stay clean.
  trailingSlash: true,
  // We don't use next/image, but if any future <Image> is added, this lets the export work.
  images: { unoptimized: true },
};

export default nextConfig;
