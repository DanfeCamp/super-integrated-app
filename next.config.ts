import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // The production host (Passenger + FTP deploy) serves the build from `_next`.
  distDir: "_next",

  // Don't let `next dev` write AGENTS.md / CLAUDE.md into the repo root.
  agentRules: false,

  // Only ship the icon modules that are actually imported.
  experimental: {
    optimizePackageImports: ["lucide-react", "cmdk"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // The site previously exposed a single "about-us"/"contact-us" pair; keep
      // the shorter aliases pointing at the canonical URLs.
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/tools", destination: "/apps", permanent: true },
      { source: "/tools/:slug", destination: "/apps/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
