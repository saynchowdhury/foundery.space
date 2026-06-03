import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans, VT323, DM_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import Script from "next/script";

import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { generateWebsiteSchema, generateFAQSchema, generateOrganizationSchema } from "@/lib/schema";

const dmSans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-dm-sans",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://foundery.space"
  ),
  title: "Foundery.Space — Discover Fellowships, Grants & Startup Opportunities",
  description:
    "Find and track 100+ tech fellowships, grants, accelerators, incubators, and competitions. Get deadline reminders, compare programs, and never miss funding opportunities for founders and startups.",
  keywords:
    "fellowships, grants, accelerators, incubators, competitions, residencies, research programs, developer programs, startup funding, venture capital, founder opportunities, tech grants, accelerator programs",
  alternates: {
    canonical: "https://foundery.space",
    types: {
      "text/markdown": "/index.md",
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    title: "Foundery.Space — Discover Fellowships, Grants & Startup Opportunities",
    description:
      "Find and track 100+ tech fellowships, grants, accelerators, incubators, and competitions. Get deadline reminders, compare programs, and never miss funding opportunities for founders and startups.",
    url: "https://foundery.space",
    siteName: "Foundery.Space",
    type: "website",
    images: [
      {
        url: "https://foundery.space/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Foundery.Space — Discover Fellowships, Grants & Startup Opportunities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foundery.Space — Discover Fellowships, Grants & Startup Opportunities",
    description:
      "Find and track 100+ tech fellowships, grants, accelerators, incubators, and competitions. Get deadline reminders, compare programs, and never miss funding opportunities for founders and startups.",
    images: ["https://foundery.space/og-image.jpg"],
  },
  applicationName: "Foundery.Space",
  referrer: "origin",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = generateWebsiteSchema();
  const faqSchema = generateFAQSchema();
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${vt323.variable} ${dmMono.variable}`}>
      <head>
        {/* DNS Prefetch & Preconnect for faster resource loading */}
        <link rel="dns-prefetch" href="https://tpvpacwoquygbykcjqle.supabase.co" />
        <link rel="preconnect" href="https://tpvpacwoquygbykcjqle.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F05A24" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Foundery" />
        
        {/* Viewport optimization for mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body className="font-sans antialiased bg-[#050505]">
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="org-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Script
          id="faq-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <SpeedInsights />
          <Analytics />
          <QueryProvider>
            <main className="min-h-screen">{children}</main>
          </QueryProvider>
        </ThemeProvider>
        <Toaster richColors theme="dark" />
      </body>
    </html>
  );
}
