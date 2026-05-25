import { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,

  async headers() {
    return [
      // ── Security headers on every response ──────────────────────────────
      {
        source: "/(.*)",
        headers: [
          // HSTS — max-age 2 years, preload-ready
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // CSP — tightened: added fonts.googleapis.com for DM Sans preconnect
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https:",
              "frame-src 'self' https://www.youtube.com https://youtube.com",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          // Prevent MIME sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Referrer
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Permissions
          {
            key: "Permissions-Policy",
            value:
              "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
          },
        ],
      },

      // ── Static asset caching ─────────────────────────────────────────────
      {
        source: "/:path*\\.(jpg|jpeg|png|gif|webp|avif|svg|ico|woff2|woff)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ── API write/admin routes — no caching ──────────────────────────────
      {
        source: "/api/submit",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/feedback",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/vote",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
      {
        source: "/api/admin/(.*)",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },

  async redirects() {
    return [
      // Redirect the old /submit path (was in nav, now removed)
      {
        source: "/submit",
        destination: "/browse",
        permanent: true,
      },
    ];
  },
};

export default withBotId(nextConfig);
