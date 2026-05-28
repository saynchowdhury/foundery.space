"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SearchInput } from "@/components/global/search-input";

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchMode =
    (process.env.NEXT_PUBLIC_SEARCH_MODE || "ai") === "text" ? "text" : "ai";
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Hero background image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      {/* Dark gradient overlay — keeps text legible */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-14 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-[var(--brand)] border-opacity-30 bg-[var(--brand)] bg-opacity-[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-light)] animate-pulse" />
            <span className="eyebrow text-[var(--brand-light)]">Community-ranked opportunities</span>
          </div>
          <h1 className="text-fluid-hero font-semibold mb-6">
            Discover Your Next <br />
            <span className="wordmark">
              Breakthrough Opportunity
            </span>
          </h1>
          <h2 className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            The definitive directory for ambitious founders, researchers, and
            builders. Fellowships, grants, accelerators, and competitions —
            ranked by the community, tracked by deadline.
          </h2>
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto"
          >
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-[var(--brand)] opacity-[0.07] blur-2xl rounded-lg -z-10" />
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search fellowships, grants, accelerators..."
                onSubmit={handleSearch}
                size="lg"
                showAiBadge={searchMode === "ai"}
              />
            </div>
          </form>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { label: "Fellowships", href: "/fellowship" },
              { label: "Accelerators", href: "/accelerator" },
              { label: "Grants", href: "/grant" },
              { label: "Developer Programs", href: "/developer-program" },
              { label: "Competitions", href: "/competition" },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="px-3 py-1 text-xs border border-border text-muted-foreground hover:text-foreground hover:border-[var(--brand)] transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
