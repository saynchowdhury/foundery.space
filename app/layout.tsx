import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import Script from "next/script";

import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { generateWebsiteSchema, generateFAQSchema, generateOrganizationSchema } from "@/lib/schema";

// DM Sans: humanist sans — distinctive, not Inter/Geist, excellent at small sizes
const dmSans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-dm-sans",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts (DM Sans) — eliminates render-blocking */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* DNS prefetch for Supabase and Cloudinary */}
        <link rel="dns-prefetch" href="https://tpvpacwoquygbykcjqle.supabase.co" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`${dmSans.variable} font-sans antialiased`}>
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
          enableSystem
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
