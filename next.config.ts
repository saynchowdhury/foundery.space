import { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  
  // ── Performance Optimizations ────────────────────────────────────────
  compress: true,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  // ── Experimental Features for Performance ────────────────────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
    ],
    ppr: false, // Can enable Partial Prerendering when stable
  },
  
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year for external images
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

      // ── Static asset caching with preload hints ──────────────────────────
      {
        source: "/:path*\\.(jpg|jpeg|png|gif|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.(woff2|woff)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/:path*\\.(js|css)",
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
      
      // ── API read routes — short cache ────────────────────────────────────
      {
        source: "/api/opportunities",
        headers: [
          { 
            key: "Cache-Control", 
            value: "public, s-maxage=3600, stale-while-revalidate=7200" 
          }
        ],
      },
      {
        source: "/api/search",
        headers: [
          { 
            key: "Cache-Control", 
            value: "public, s-maxage=1800, stale-while-revalidate=3600" 
          }
        ],
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
