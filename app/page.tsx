"use client";

import { Header } from "@/components/global/header";
import { Footer } from "@/components/global/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { CarouselSection } from "@/components/landing/carousel-section";
import { WhatYouGetSection } from "@/components/landing/what-you-get";
import { ViewAllOpportunitiesSection } from "@/components/landing/view-all-opportunities-section";
import { useQuery } from "@tanstack/react-query";
import type { Opportunity } from "@/lib/data";

export default function HomePage() {
  const { data: all = [] } = useQuery<Opportunity[]>({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const res = await fetch("/api/opportunities");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    select: (data) => data ?? [],
  });

  const open = all.filter((o: Opportunity) => {
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
      <HeroSection />
      <CarouselSection
        distributedCarousel1={carousel1}
        distributedCarousel2={carousel2}
      />
      <WhatYouGetSection />
      <ViewAllOpportunitiesSection />
      <Footer />
    </div>
  );
}
