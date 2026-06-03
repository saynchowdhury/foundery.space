"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryLabel, categorySlug } from "@/lib/categories";
import { cleanDisplayText } from "@/lib/utils";
import type { OpportunityCardData } from "@/lib/data";

interface RecentlyAddedSectionProps {
  recent: OpportunityCardData[];
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
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-[#050505]">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 border border-brand/30 bg-brand/5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="font-mono-technical text-[9px] text-brand tracking-[0.3em] uppercase">
              RECENTLY_ADDED
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-ascii uppercase tracking-tight text-foreground leading-tight">
            Added in the last {windowDays} days
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground/80 mt-2 font-light">
            <span className="font-mono-technical text-brand text-[11px] tracking-wider">{recent.length}_OPPORTUNITIES</span> :: New opportunities discovered across the web this week.
          </p>
        </div>
        {hasMore && (
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex font-mono-technical text-[10px] tracking-widest uppercase hover:text-brand border border-white/10 hover:border-brand/40">
            <Link href="/browse?sort=recent">
              VIEW_ALL
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
            className="group block border border-white/5 bg-[#0a0a0a] p-5 hover:border-brand/40 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-brand/40 transition-colors" />
            <div className="flex items-start gap-3 relative z-10">
              {opp.logoUrl ? (
                <div className="relative w-12 h-12 shrink-0 overflow-hidden bg-black border border-white/10 group-hover:border-brand/30 transition-colors">
                  <Image
                    src={opp.logoUrl}
                    alt=""
                    width={48}
                    height={48}
                    sizes="48px"
                    className="w-12 h-12 object-cover p-1.5 transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                  <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-black border border-white/10 shrink-0 flex items-center justify-center font-ascii text-xl text-white/10 uppercase">
                  {opp.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-mono-technical text-[8px] tracking-[0.2em] uppercase text-brand/70">
                    {categoryLabel(opp.category).replace(/\s/g, '_')}
                  </span>
                  {opp.region && (
                    <span className="font-mono-technical text-[9px] text-white/30 uppercase shrink-0">
                      {opp.region}
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-[15px] leading-snug text-foreground group-hover:text-brand transition-colors line-clamp-2 mb-1.5">
                  {opp.name}
                </h3>
                <p className="text-[13px] text-muted-foreground/80 line-clamp-2 leading-relaxed font-light">
                  {cleanDisplayText(opp.description)}
                </p>
                <div className="flex items-center gap-2 mt-3 text-[11px] text-muted-foreground font-mono-technical">
                  <span className="truncate uppercase tracking-wider text-[10px]">{opp.organizer || "—"}</span>
                  <Link
                    href={`/${categorySlug(opp.category)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto text-brand/70 hover:text-brand transition-colors shrink-0 text-[9px] tracking-widest uppercase"
                  >
                    EXPLORE →
                  </Link>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6 sm:hidden">
          <Button asChild variant="outline" size="sm" className="font-mono-technical text-[10px] tracking-widest uppercase">
            <Link href="/browse?sort=recent">
              VIEW_ALL
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
