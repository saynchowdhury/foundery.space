"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabel, categorySlug } from "@/lib/categories";
import type { Opportunity } from "@/lib/data";

interface RecentlyAddedSectionProps {
  recent: Opportunity[];
  hasMore: boolean;
  windowDays: number;
}

export function RecentlyAddedSection({
  recent,
  hasMore,
  windowDays,
}: RecentlyAddedSectionProps) {
  if (recent.length === 0) return null;

  const featured = recent.slice(0, 6);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[var(--brand-light)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="eyebrow">Freshly added</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-medium leading-tight">
            Added in the last {windowDays} days
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            New opportunities discovered across the web this week.
          </p>
        </div>
        {hasMore && (
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/browse?sort=recent">
              See all
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.map((opp) => (
          <Link
            key={opp.id}
            href={`/opportunity/${opp.id}`}
            className="group block border border-border bg-card p-5 hover:border-[var(--brand)] transition-colors"
          >
            <div className="flex items-start gap-3">
              {opp.logoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={opp.logoUrl}
                  alt=""
                  className="w-12 h-12 object-cover bg-muted border border-border shrink-0"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.visibility = "hidden";
                  }}
                />
              ) : (
                <div className="w-12 h-12 bg-muted border border-border shrink-0 flex items-center justify-center font-semibold text-muted-foreground">
                  {opp.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-[var(--brand-light)] font-medium">
                    {categoryLabel(opp.category)}
                  </span>
                  {opp.region && (
                    <span className="text-[11px] text-muted-foreground shrink-0">
                      {opp.region}
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-[15px] leading-snug group-hover:underline decoration-2 underline-offset-2 line-clamp-2 mb-1.5">
                  {opp.name}
                </h3>
                <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {opp.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-[12px] text-muted-foreground">
                  <span className="truncate">{opp.organizer || "—"}</span>
                  <Link
                    href={`/${categorySlug(opp.category)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto text-[var(--brand-light)] hover:opacity-80 transition-opacity shrink-0"
                  >
                    More like this →
                  </Link>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6 sm:hidden">
          <Button asChild variant="outline" size="sm">
            <Link href="/browse?sort=recent">
              See all
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
