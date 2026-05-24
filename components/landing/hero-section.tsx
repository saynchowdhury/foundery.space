"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-16 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-indigo-500/30 bg-indigo-500/5 text-xs text-indigo-400 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Community-ranked opportunities
          </div>
          <h1 className="text-3xl md:text-6xl font-semibold mb-6 leading-tight">
            Discover Your Next <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
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
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 blur-xl rounded-lg -z-10" />
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
                className="px-3 py-1 text-xs border border-border text-muted-foreground hover:text-foreground hover:border-indigo-500/50 transition-colors"
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
