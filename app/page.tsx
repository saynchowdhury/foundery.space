import { Metadata } from "next";
import { SiteShell } from "@/components/global/site-shell";
import { HeroFuturistic } from "@/components/landing/hero-futuristic";
import { FeatureBento } from "@/components/landing/feature-bento";
import { CTASection } from "@/components/landing/cta-section";
import { fetchHomeStats } from "@/lib/home-stats";
import { fetchRecentlyAdded } from "@/lib/recently-added";
import { fetchOpportunityCardData } from "@/lib/opportunities-public";
import { InfiniteCarousel } from "@/components/features/infinite-carousel";
import { CircularCarousel } from "@/components/features/circular-carousel";
import { RibbonMarquee } from "@/components/ui/ribbon-marquee";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

// Aggressive caching - refresh every 5 minutes instead of 10
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Foundery.Space — Discover Fellowships, Grants & Startup Opportunities",
  description:
    "Find and track 100+ tech fellowships, grants, accelerators, incubators, and competitions. Built for ambitious founders and builders.",
  openGraph: {
    title: "Foundery.Space — The Future of Founder Funding",
    description:
      "Discover the next generation of fellowships, grants, and startup opportunities.",
    images: ["/images/think-different.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Foundery.Space — The Future of Founder Funding",
    images: ["/images/think-different.jpg"],
  },
};

export default async function HomePage() {
  // Parallel data fetching for speed
  const [stats, recentResult, all] = await Promise.all([
    fetchHomeStats(),
    fetchRecentlyAdded(),
    fetchOpportunityCardData(),
  ]);

  const openOpportunities = all.filter((o) => {
    if (!o.closeDate || o.closeDate === "closed") return true;
    const t = new Date(o.closeDate).getTime();
    return Number.isNaN(t) || t >= Date.now();
  });

  // Split for two carousel rows
  const mid = Math.ceil(openOpportunities.length / 2);
  const row1 = openOpportunities.slice(0, mid);
  const row2 = openOpportunities.slice(mid);

  return (
    <SiteShell>
      <main>
        {/* ── Hero ──────────────────────────────────────────────────── */}
        <HeroFuturistic openCount={stats.open} />

        {/* ── Data Ticker ───────────────────────────────────────────── */}
        <section className="py-10 border-y border-white/5 overflow-hidden bg-black/20">
          <div className="flex whitespace-nowrap animate-scroll">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-16 px-8">
                <span className="font-mono-technical text-[10px] tracking-[0.3em] text-white/20 uppercase">
                  ACTIVE_PROGRAMS: {stats.total}
                </span>
                <span className="font-mono-technical text-[10px] tracking-[0.3em] text-brand/40 uppercase">
                  RECENTLY_ADDED: {recentResult.recent.length}
                </span>
                <span className="font-mono-technical text-[10px] tracking-[0.3em] text-white/20 uppercase">
                  FELLOWSHIPS · GRANTS · ACCELERATORS
                </span>
                <span className="font-mono-technical text-[10px] tracking-[0.3em] text-brand/40 uppercase">
                  FOUNDERY.SPACE
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Latest Opportunities — circular animated carousel ────── */}
        <section className="py-16 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <span className="font-mono-technical text-[10px] text-brand tracking-[0.3em] uppercase block mb-3">
              RECENTLY_ADDED
            </span>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight">
              Latest <span className="text-brand">Opportunities</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-2xl mx-auto">
              Opportunities rotate continuously. Hover to pause and explore.
            </p>
          </div>

          <CircularCarousel
            opportunities={
              recentResult.recent.length > 0
                ? recentResult.recent
                : openOpportunities.slice(0, 12)
            }
            from="home"
          />

          <div className="text-center mt-8">
            <Link
              href="/browse"
              prefetch={true}
              className="inline-flex items-center gap-2 font-mono-technical text-[10px] text-white/40 hover:text-brand transition-colors uppercase tracking-[0.2em] px-6 py-3 border border-white/10 hover:border-brand/40"
            >
              VIEW_ALL_OPPORTUNITIES <ExternalLink size={10} />
            </Link>
          </div>
        </section>

        {/* ── Feature Bento ─────────────────────────────────────────── */}
        <FeatureBento />

        {/* ── Global Directory Carousel ─────────────────────────────── */}
        <section className="py-28 bg-black/40 border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-14">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono-technical text-[10px] text-white/30 tracking-[0.3em] uppercase block mb-3">
                  EXPLORE::GLOBAL_DIRECTORY
                </span>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                  All <span className="text-brand">Open Opportunities</span>
                </h2>
              </div>
              <Link
                href="/browse"
                prefetch={true}
                className="hidden md:flex items-center gap-2 font-mono-technical text-[10px] text-white/40 hover:text-brand transition-colors uppercase tracking-[0.2em]"
              >
                BROWSE_DIRECTORY <ExternalLink size={10} />
              </Link>
            </div>
          </div>

          {/* Two horizontal rows — alternating directions, fast speed */}
          <div className="space-y-4">
            <InfiniteCarousel
              opportunities={row1.slice(0, 15)}
              direction="right"
              speed="fast"
              from="home"
            />
            <InfiniteCarousel
              opportunities={row2.slice(0, 15)}
              direction="left"
              speed="fast"
              from="home"
            />
          </div>
        </section>

        {/* ── Call to Action ────────────────────────────────────────── */}
        <CTASection />

        {/* ── Category Ribbon Marquee ───────────────────────────────── */}
        <RibbonMarquee
          items={[
            { text: "FELLOWSHIPS", variant: "light" },
            { text: "ACCELERATORS", variant: "brand" },
            { text: "GRANTS", variant: "light" },
            { text: "INCUBATORS", variant: "brand" },
            { text: "RESIDENCIES", variant: "light" },
            { text: "FOUNDERY.SPACE", variant: "brand" },
          ]}
          speed={80}
        />
      </main>
    </SiteShell>
  );
}
