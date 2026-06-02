import { Header } from "@/components/global/header";
import { Footer } from "@/components/global/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { CarouselSection } from "@/components/landing/carousel-section";
import { WhatYouGetSection } from "@/components/landing/what-you-get";
import { ViewAllOpportunitiesSection } from "@/components/landing/view-all-opportunities-section";
import { RecentlyAddedSection } from "@/components/landing/recently-added-section";
import { fetchHomeStats } from "@/lib/home-stats";
import { fetchRecentlyAdded } from "@/lib/recently-added";
import { fetchOpportunityCardData } from "@/lib/opportunities-public";

export const revalidate = 600; // 10 minutes

export default async function HomePage() {
  const [stats, recentResult, all] = await Promise.all([
    fetchHomeStats(),
    fetchRecentlyAdded(),
    fetchOpportunityCardData(),
  ]);

  const open = all.filter((o) => {
    if (!o.closeDate || o.closeDate === "closed") return true;
    const t = new Date(o.closeDate).getTime();
    return Number.isNaN(t) || t >= Date.now();
  });
  const mid = Math.ceil(open.length / 2);
  const carousel1 = open.slice(0, mid);
  const carousel2 = open.slice(mid);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection stats={stats} />
      <CarouselSection
        distributedCarousel1={carousel1}
        distributedCarousel2={carousel2}
      />
      <RecentlyAddedSection
        recent={recentResult.recent}
        hasMore={recentResult.hasMore}
        windowDays={recentResult.windowDays}
      />
      <WhatYouGetSection />
      <ViewAllOpportunitiesSection />
      <Footer />
    </div>
  );
}
