import "./globals.css";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";

import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { generateWebsiteSchema, generateFAQSchema } from "@/lib/schema";

const geist = Geist({ subsets: ["latin"] });

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
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
