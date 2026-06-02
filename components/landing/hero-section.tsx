import Link from "next/link";
import { Search } from "lucide-react";
import { categoryLabel } from "@/lib/categories";
import type { HomeStats } from "@/lib/home-stats";

interface HeroSectionProps {
  stats: HomeStats;
}

export function HeroSection({ stats }: HeroSectionProps) {
  const top = stats.categories.slice(0, 3);
  const totalLabel = stats.total.toLocaleString();
  const openLabel = stats.open.toLocaleString();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-bg.jpg"
          alt=""
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-14 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-[var(--brand)] border-opacity-30 bg-[var(--brand)] bg-opacity-[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-light)] animate-pulse" />
            <span className="eyebrow text-[var(--brand-light)]">
              {openLabel} open right now
            </span>
          </div>

          <h1 className="text-fluid-hero font-semibold mb-6">
            The directory for{" "}
            <span className="wordmark">ambitious builders</span>
          </h1>

          <h2 className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            <span className="nums text-foreground font-medium">{totalLabel}</span>{" "}
            fellowships, grants, accelerators, and residencies — ranked by
            community, tracked by deadline, and refreshed every Monday.
            {top.length > 0 && (
              <>
                {" "}
                <span className="hidden sm:inline">
                  Including{" "}
                  {top
                    .map(
                      (c) =>
                        `${c.count} ${categoryLabel(c.category).toLowerCase()}`,
                    )
                    .join(" · ")}
                  .
                </span>
              </>
            )}
          </h2>

          <form
            action="/browse"
            method="get"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto"
          >
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-[var(--brand)] opacity-[0.07] blur-2xl rounded-lg -z-10" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  name="q"
                  type="search"
                  placeholder="Search fellowships, grants, accelerators..."
                  className="pl-9 pr-3 h-11 w-full border border-border bg-card text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] transition-all"
                />
              </div>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Link
              href="/browse"
              className="px-3 py-1 text-xs border border-[var(--brand)] text-[var(--brand-light)] hover:bg-[var(--brand)] hover:text-white transition-colors"
            >
              Browse all
            </Link>
            {stats.categories.slice(0, 5).map(({ category, count }) => {
              const slug = category === "developer_program" ? "developer-program" : category.replace(/_/g, "-");
              return (
                <Link
                  key={category}
                  href={`/${slug}`}
                  className="px-3 py-1 text-xs border border-border text-muted-foreground hover:text-foreground hover:border-[var(--brand)] transition-colors"
                >
                  {categoryLabel(category)}{" "}
                  <span className="opacity-50 nums">({count})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
