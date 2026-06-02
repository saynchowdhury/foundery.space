"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpDown, SearchX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OpportunityCard } from "@/components/features/opportunity-card";
import { InfiniteCarousel } from "@/components/features/infinite-carousel";
import { GuideHeader } from "./guide-header";
import { generateGuideContent } from "@/lib/guide-content-generator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuideConfig } from "@/lib/guide-generator";
import type { Opportunity } from "@/lib/data";
import { categoryLabel, categorySlug, CATEGORY_LABELS } from "@/lib/categories";

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

  // Carousel: open opportunities only, shuffled
  const carouselOpportunities = useMemo(() => {
    const open = opportunities.filter((o) => {
      if (!o.closeDate || o.closeDate === "closed") return !o.closeDate;
      return new Date(o.closeDate).getTime() >= Date.now();
    });
    return [...open].sort(() => Math.random() - 0.5).slice(0, 12);
  }, [opportunities]);

  // Related categories: find other categories present in the filtered set
  const relatedCategories = useMemo(() => {
    if (!config.filters.categories?.length) return [];
    const primaryCat = config.filters.categories[0];
    // Find programs in allOpportunities that share tags with this category's programs
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
    <>
      <GuideHeader config={config} overview={guideContent.overview} />

      {/* Carousel */}
      {carouselOpportunities.length > 0 && (
        <div className="py-6 border-b border-border">
          <InfiniteCarousel
            opportunities={carouselOpportunities}
            direction="right"
            speed="slow"
            from="guide"
          />
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* SEO content cards */}
        {(guideContent.whatYoullFind.length > 0 ||
          guideContent.benefits.length > 0 ||
          guideContent.tips.length > 0) && (
          <div className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guideContent.whatYoullFind.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">What You&apos;ll Find</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                      {guideContent.whatYoullFind.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {guideContent.benefits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                      {guideContent.benefits.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {guideContent.tips.length > 0 && (
                <Card className={
                  guideContent.whatYoullFind.length > 0 && guideContent.benefits.length > 0
                    ? "md:col-span-2"
                    : ""
                }>
                  <CardHeader>
                    <CardTitle className="text-base">Application Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                      {guideContent.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {opportunities.length === 0 ? (
          <div className="text-center py-16">
            <SearchX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No opportunities found</h3>
            <p className="text-muted-foreground mb-6">
              No opportunities match the filters for this guide.
            </p>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm hover:bg-muted hover:border-[var(--brand)] transition-colors"
            >
              Browse all opportunities
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Sort + count */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {sortedOpportunities.length}{" "}
                {sortedOpportunities.length === 1 ? "opportunity" : "opportunities"}
              </div>
              <Select value={sortBy} onValueChange={(v: SortOption) => setSortBy(v)}>
                <SelectTrigger className="w-44">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">By Deadline</SelectItem>
                  <SelectItem value="votes">By Votes</SelectItem>
                  <SelectItem value="name">By Name</SelectItem>
                  <SelectItem value="category">By Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sortedOpportunities.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} from="guide" />
              ))}
            </div>
          </div>
        )}

        {/* Related categories — cross-discovery for multi-category programs */}
        {relatedCategories.length > 0 && (
          <div className="mt-14 pt-10 border-t border-border">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Related categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/${CATEGORY_SLUGS[cat] ?? cat}`}
                  className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground hover:border-[var(--brand)] transition-colors"
                >
                  {CATEGORY_GUIDE_LABELS[cat] ?? cat}
                </Link>
              ))}
              <Link
                href="/browse"
                className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground hover:border-[var(--brand)] transition-colors"
              >
                Browse all →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

