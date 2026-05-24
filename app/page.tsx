"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/global/header";
import { Footer } from "@/components/global/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { CarouselSection } from "@/components/landing/carousel-section";
import { WhatYouGetSection } from "@/components/landing/what-you-get";
import { ViewAllOpportunitiesSection } from "@/components/landing/view-all-opportunities-section";
import type { Opportunity } from "@/lib/data";

export default function HomePage() {
  const [carousel1, setCarousel1] = useState<Opportunity[]>([]);
  const [carousel2, setCarousel2] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetch("/api/opportunities", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        const all = Array.isArray(data) ? data : [];
        const open = all.filter((o: Opportunity) => {
          if (!o.closeDate || o.closeDate === "closed") return true;
          const t = new Date(o.closeDate).getTime();
          return Number.isNaN(t) || t >= Date.now();
        });
        const mid = Math.ceil(open.length / 2);
        setCarousel1(open.slice(0, mid));
        setCarousel2(open.slice(mid));
      })
      .catch(() => {});
  }, []);

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
