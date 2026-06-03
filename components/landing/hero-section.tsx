import Image from "next/image";
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
    <section className="relative overflow-hidden bg-[#050505]">
      {/* Animated grid background instead of image */}
      <div className="absolute inset-0 -z-20">
        <div
          className="w-full h-full opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(240, 90, 36, 0.1) 25%, rgba(240, 90, 36, 0.1) 26%, transparent 27%, transparent 74%, rgba(240, 90, 36, 0.1) 75%, rgba(240, 90, 36, 0.1) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(240, 90, 36, 0.1) 25%, rgba(240, 90, 36, 0.1) 26%, transparent 27%, transparent 74%, rgba(240, 90, 36, 0.1) 75%, rgba(240, 90, 36, 0.1) 76%, transparent 77%, transparent)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Dark gradient for depth */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-[#050505]/80 to-[#050505]"
        aria-hidden
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 sm:pb-16 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-brand/30 bg-brand/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="font-mono-technical text-[9px] text-brand tracking-[0.3em] uppercase">
              {openLabel}_ACTIVE_NODES
            </span>
          </div>

          <h1 className="text-fluid-hero font-semibold mb-6 text-foreground">
            The directory for{" "}
            <span className="wordmark">ambitious builders</span>
          </h1>

          <h2 className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            <span className="nums text-foreground font-medium font-mono-technical">
              {totalLabel}
            </span>{" "}
            fellowships, grants, accelerators, and residencies — ranked by
            community, tracked by deadline, refreshed every Monday.
            {top.length > 0 && (
              <>
                {" "}
                <span className="hidden sm:inline font-mono-technical text-[11px] text-brand/60">
                  [{" "}
                  {top
                    .map(
                      (c) =>
                        `${c.count}_${categoryLabel(c.category).toUpperCase().replace(/\s/g, "_")}`,
                    )
                    .join(" :: ")}
                  {" "}]
                </span>
              </>
            )}
          </h2>

          <form
            action="/browse"
            method="get"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto"
          >
            <div className="flex-1 w-full relative group">
              <div className="absolute inset-0 bg-brand/5 blur-xl -z-10 opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  name="q"
                  type="search"
                  placeholder="EXECUTE_SEARCH_QUERY..."
                  className="pl-9 pr-3 h-11 w-full border border-white/10 bg-black/40 backdrop-blur-sm text-sm font-mono-technical tracking-wider focus:outline-none focus:border-brand/40 focus:bg-black/60 transition-all uppercase placeholder:text-white/20"
                />
              </div>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Link
              href="/browse"
              className="px-3 py-1 text-[10px] border border-brand/30 bg-brand/10 text-brand hover:bg-brand/20 transition-colors font-mono-technical tracking-[0.2em] uppercase"
            >
              BROWSE_ALL
            </Link>
            {stats.categories.slice(0, 5).map(({ category, count }) => {
              const slug = category === "developer_program" ? "developer-program" : category.replace(/_/g, "-");
              return (
                <Link
                  key={category}
                  href={`/${slug}`}
                  className="px-3 py-1 text-[10px] border border-white/10 text-white/60 hover:text-brand hover:border-brand/30 transition-colors font-mono-technical tracking-[0.2em] uppercase"
                >
                  {categoryLabel(category).replace(/\s/g, "_")}{" "}
                  <span className="opacity-50 nums">[{count}]</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
