"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, SearchX, ExternalLink, ShieldCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OpportunityCard } from "@/components/features/opportunity-card";
import { InfiniteCarousel } from "@/components/features/infinite-carousel";
import { generateGuideContent } from "@/lib/guide-content-generator";
import type { GuideConfig } from "@/lib/guide-generator";
import type { Opportunity } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/categories";
import { AsciiHeading } from "@/components/ui/ascii-heading";
import { SiteShell } from "@/components/global/site-shell";
import { PageBreadcrumb } from "@/components/global/page-breadcrumb";
import { cn } from "@/lib/utils";

const CATEGORY_GUIDE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_LABELS).map(([k, v]) => [k, v.plural]),
);

const CATEGORY_SLUGS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_LABELS).map(([k, v]) => [k, v.slug]),
);

interface GuideContentProps {
  config: GuideConfig;
  opportunities: Opportunity[];
  allOpportunities?: Opportunity[];
}

type SortOption = "deadline" | "name" | "votes" | "category";

export function GuideContent({ config, opportunities, allOpportunities = [] }: GuideContentProps) {
  const [sortBy, setSortBy] = useState<SortOption>("deadline");
  const guideContent = useMemo(
    () => generateGuideContent(config, opportunities),
    [config, opportunities]
  );

  const sortedOpportunities = useMemo(() => {
    const sorted = [...opportunities];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "deadline":
          if (!a.closeDate || a.closeDate === "closed") return 1;
          if (!b.closeDate || b.closeDate === "closed") return -1;
          return new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        case "votes":
          return (b.votes ?? 0) - (a.votes ?? 0);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
    return sorted;
  }, [opportunities, sortBy]);

  const carouselOpportunities = useMemo(() => {
    const open = opportunities.filter((o) => {
      if (!o.closeDate || o.closeDate === "closed") return !o.closeDate;
      return new Date(o.closeDate).getTime() >= Date.now();
    });
    return [...open].sort(() => Math.random() - 0.5).slice(0, 12);
  }, [opportunities]);

  const relatedCategories = useMemo(() => {
    if (!config.filters.categories?.length) return [];
    const primaryCat = config.filters.categories[0];
    const thisCatTags = new Set(opportunities.flatMap((o) => o.tags));
    const related = new Set<string>();
    for (const opp of allOpportunities) {
      if (opp.category === primaryCat) continue;
      if (opp.tags.some((t) => thisCatTags.has(t))) {
        related.add(opp.category);
      }
    }
    return Array.from(related).slice(0, 4);
  }, [opportunities, allOpportunities, config.filters.categories]);

  return (
    <SiteShell>
      <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <PageBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Browse", href: "/browse" },
            { label: config.title },
          ]}
        />

        {/* Futuristic Category Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono-technical text-[10px] text-brand tracking-[0.3em] uppercase">{config.title}_DIRECTORY</span>
            <div className="h-px flex-1 bg-white/5" />
            <span className="font-mono-technical text-[10px] text-white/20 uppercase tracking-widest">{opportunities.length}_PROGRAMS</span>
          </div>
          <AsciiHeading text={config.title.split(" ")[0].toUpperCase()} className="text-6xl md:text-8xl tracking-tighter mb-4" />
          <h2 className="text-xl md:text-2xl font-light text-foreground/60 mb-8 max-w-3xl leading-tight">
            {config.description}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
            <div className="flex flex-col gap-2">
              <span className="font-mono-technical text-[9px] text-brand tracking-[0.2em] uppercase">SYSTEM_OVERVIEW</span>
              <p className="text-xs text-muted-foreground leading-relaxed font-light">{guideContent.overview}</p>
            </div>
            {guideContent.benefits.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="font-mono-technical text-[9px] text-brand tracking-[0.2em] uppercase">CORE_BENEFITS</span>
                <ul className="space-y-1">
                  {guideContent.benefits.slice(0, 3).map((b, i) => (
                    <li key={i} className="text-[10px] text-muted-foreground flex items-center gap-2 font-light">
                      <div className="h-1 w-1 bg-brand" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <span className="font-mono-technical text-[9px] text-brand tracking-[0.2em] uppercase">ACCESS_STATUS</span>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 border border-brand/20 bg-brand/5 rounded-sm flex items-center gap-2">
                  <ShieldCheck size={10} className="text-brand" />
                  <span className="font-mono-technical text-[10px] text-brand uppercase tracking-widest">PUBLIC_RECORDS_OPEN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel (Holographic Ticker) */}
        {carouselOpportunities.length > 0 && (
          <div className="mb-24 py-12 border-y border-white/5 bg-white/[0.01] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-6">
              <span className="font-mono-technical text-[8px] text-white/20 uppercase tracking-[0.4em]">LIVE_NODE_TRANSMISSION</span>
            </div>
            <InfiniteCarousel
              opportunities={carouselOpportunities}
              direction="right"
              speed="slow"
              from="guide"
            />
          </div>
        )}

        {/* Listing Controls */}
        <div className="flex items-center justify-between mb-12 py-4 border-b border-white/5">
          <div className="font-mono-technical text-[10px] text-white/40 uppercase tracking-widest">
            NODES_IDENTIFIED: <span className="text-brand">{opportunities.length}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-mono-technical text-[9px] text-white/20 uppercase tracking-widest">FILTER_RANK:</span>
            <Select value={sortBy} onValueChange={(v: SortOption) => setSortBy(v)}>
              <SelectTrigger className="w-44 h-8 bg-transparent border-none font-mono-technical text-[10px] tracking-widest uppercase focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                <SelectItem value="deadline" className="font-mono-technical text-[10px] uppercase">By Deadline</SelectItem>
                <SelectItem value="votes" className="font-mono-technical text-[10px] uppercase">By Votes</SelectItem>
                <SelectItem value="name" className="font-mono-technical text-[10px] uppercase">By Name</SelectItem>
                <SelectItem value="category" className="font-mono-technical text-[10px] uppercase">By Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid */}
        {opportunities.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-white/10">
            <SearchX className="h-12 w-12 text-white/10 mx-auto mb-4" />
            <h3 className="font-ascii text-3xl mb-2">No programs here yet</h3>
            <Link
              href="/browse"
              className="font-mono-technical text-[10px] text-brand hover:underline uppercase tracking-widest"
            >
              Browse full directory
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOpportunities.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} from="guide" />
            ))}
          </div>
        )}

        {/* Related Categories (Sub-Protocol Discovery) */}
        {relatedCategories.length > 0 && (
          <div className="mt-32 pt-16 border-t border-white/5">
            <h2 className="font-mono-technical text-[10px] tracking-[0.3em] text-brand mb-8 uppercase">
              CROSS_PROTOCOL_DISCOVERY
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/${CATEGORY_SLUGS[cat] ?? cat}`}
                  className="group relative px-6 py-8 border border-white/5 bg-white/[0.02] hover:border-brand/40 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/10 group-hover:border-brand/40 transition-colors" />
                  <span className="font-mono-technical text-[8px] text-white/20 block mb-2 lowercase">ID_{cat.slice(0, 6)}</span>
                  <span className="font-ascii text-xl text-foreground group-hover:text-brand transition-colors block uppercase">
                    {CATEGORY_GUIDE_LABELS[cat] ?? cat}
                  </span>
                  <div className="mt-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="font-mono-technical text-[8px] text-brand tracking-widest uppercase">INITIALIZE_LINK</span>
                    <ExternalLink size={8} className="text-brand" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </SiteShell>
  );
}
