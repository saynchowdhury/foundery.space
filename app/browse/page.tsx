"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, ChevronUp } from "lucide-react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Opportunity } from "@/lib/data";
import { CATEGORIES, CATEGORY_LABELS, type CategoryFilter } from "@/lib/categories";
import { MoreFiltersSheet, EMPTY_FILTERS, type BrowseFilterState } from "@/components/features/more-filters-sheet";
import { OpportunityCard } from "@/components/features/opportunity-card";
import { AsciiHeading } from "@/components/ui/ascii-heading";
import { SiteShell } from "@/components/global/site-shell";
import { PageBreadcrumb } from "@/components/global/page-breadcrumb";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;

const CATEGORY_FILTER_LABELS: Record<CategoryFilter, string> = {
  all: "All categories",
  ...Object.fromEntries(
    CATEGORIES.filter((c): c is Exclude<CategoryFilter, "all"> => c !== "all").map((c) => [
      c,
      CATEGORY_LABELS[c].plural,
    ]),
  ),
} as Record<CategoryFilter, string>;

const REGIONS = [
  "all",
  "Global",
  "United States",
  "Europe",
  "Asia",
  "India",
  "Canada",
  "Australia",
];

type SortOption = "votes" | "deadline" | "name";

const SORT_LABELS: Record<SortOption, string> = {
  votes: "Top voted",
  deadline: "Deadline",
  name: "Name A–Z",
};

// --- Helper Functions (Restored from original) ---

function isOpen(o: Opportunity): boolean {
  if (o.closeDate === "closed") return false;
  if (!o.closeDate) return true;
  const t = new Date(o.closeDate).getTime();
  if (Number.isNaN(t)) return true;
  return t >= Date.now();
}

function applyFilters(
  all: Opportunity[],
  q: string,
  category: string,
  region: string,
  status: "open" | "all",
  sort: SortOption,
  more: BrowseFilterState = EMPTY_FILTERS
): Opportunity[] {
  let list = all;
  if (status === "open") list = list.filter(isOpen);
  if (q.trim()) {
    const needle = q.toLowerCase();
    list = list.filter(
      (o) =>
        o.name.toLowerCase().includes(needle) ||
        o.organizer.toLowerCase().includes(needle) ||
        o.description.toLowerCase().includes(needle) ||
        o.tags.some((t) => t.toLowerCase().includes(needle))
    );
  }
  if (category !== "all") list = list.filter((o) => o.category === category);
  if (region !== "all") list = list.filter((o) => o.region === region);

  if (more.categories.length > 0) {
    list = list.filter((o) => more.categories.includes(o.category as never));
  }
  if (more.regions.length > 0) {
    list = list.filter((o) => more.regions.includes(o.region));
  }
  if (more.tags.length > 0) {
    list = list.filter((o) => more.tags.every((t) => o.tags.includes(t)));
  }
  if (more.fundingAmount.min > 0 || more.fundingAmount.max < 2000000) {
    list = list.filter((o) => {
      if (!o.funding) return false;
      return (
        o.funding.amount >= more.fundingAmount.min &&
        o.funding.amount <= more.fundingAmount.max
      );
    });
  }
  
  return [...list].sort((a, b) => {
    switch (sort) {
      case "votes":
        return (b.votes ?? 0) - (a.votes ?? 0);
      case "deadline": {
        const aDate = a.closeDate && a.closeDate !== "closed" ? new Date(a.closeDate).getTime() : Infinity;
        const bDate = b.closeDate && b.closeDate !== "closed" ? new Date(b.closeDate).getTime() : Infinity;
        return aDate - bDate;
      }
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return (b.votes ?? 0) - (a.votes ?? 0);
    }
  });
}

let allCache: Opportunity[] | null = null;
let allCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchAll(): Promise<Opportunity[]> {
  const now = Date.now();
  if (allCache && now - allCacheTime < CACHE_TTL) return allCache;
  const res = await fetch("/api/opportunities");
  if (!res.ok) throw new Error("failed to load");
  const data = (await res.json()) as Opportunity[];
  allCache = Array.isArray(data) ? data : [];
  allCacheTime = now;
  return allCache;
}

/** Semantic FTS via /api/search when user types a query */
async function fetchSearch(q: string): Promise<Opportunity[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function BrowsePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState<"open" | "all">("open");
  const [sort, setSort] = useState<SortOption>("votes");
  const [moreFilters, setMoreFilters] = useState<BrowseFilterState>(EMPTY_FILTERS);

  useEffect(() => {
    const current = searchParams.get("q") || "";
    if (q === current) return;
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      const qs = params.toString();
      router.replace(qs ? `/browse?${qs}` : "/browse", { scroll: false });
    }, 200);
    return () => clearTimeout(handle);
  }, [q, router, searchParams]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["opportunities", q, category, region, status, sort, moreFilters],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      let base: Opportunity[];

      // When there's a search query, use the semantic FTS endpoint
      // otherwise load all and apply client-side filters
      if (q.trim().length > 1) {
        const searched = await fetchSearch(q.trim());
        // apply non-text filters on top of search results
        base = applyFilters(searched, "", category, region, status, sort, moreFilters);
      } else {
        const all = await fetchAll();
        base = applyFilters(all, q, category, region, status, sort, moreFilters);
      }

      const start = (pageParam as number) * PAGE_SIZE;
      return {
        items: base.slice(start, start + PAGE_SIZE),
        nextPage: start + PAGE_SIZE < base.length ? (pageParam as number) + 1 : null,
        total: base.length,
      };
    },
    getNextPageParam: (lp) => lp.nextPage,
  });

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const totalItems = data?.pages[0]?.total ?? 0;

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const clearFilters = () => {
    setQ("");
    setCategory("all");
    setRegion("all");
    setStatus("open");
    setSort("votes");
    setMoreFilters(EMPTY_FILTERS);
    router.replace("/browse", { scroll: false });
  };

  return (
    <SiteShell>
      <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <PageBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Browse" },
          ]}
        />

        {/* Page Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono-technical text-[10px] text-brand tracking-[0.3em] uppercase">DIRECTORY_ACCESS_V1.0</span>
            <div className="h-px flex-1 bg-white/5" />
            <span className="font-mono-technical text-[10px] text-white/20 uppercase tracking-widest">{totalItems}_NODES_FOUND</span>
          </div>
          <AsciiHeading text="BROWSE" className="text-7xl md:text-8xl tracking-tighter mb-8" />
        </div>

        {/* Command Center */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/20 group-focus-within:text-brand transition-colors">
                <span className="font-mono-technical text-xs">[</span>
                <Search size={14} />
                <span className="font-mono-technical text-xs">]</span>
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="EXECUTE_SEARCH_QUERY..."
                className="w-full bg-white/[0.02] border border-white/5 h-12 pl-16 pr-4 font-mono-technical text-xs tracking-wider focus:outline-none focus:border-brand/40 focus:bg-white/[0.04] transition-all uppercase"
              />
              <div className="absolute bottom-0 left-0 h-0.5 bg-brand/40 w-0 group-focus-within:w-full transition-all duration-500" />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <Select value={category} onValueChange={(v) => setCategory(v as CategoryFilter)}>
                <SelectTrigger className="w-[180px] h-12 bg-white/[0.02] border-white/5 font-mono-technical text-[10px] tracking-widest uppercase rounded-sm border-none">
                  <SelectValue placeholder="CATEGORY" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="font-mono-technical text-[10px] uppercase">{CATEGORY_FILTER_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-[140px] h-12 bg-white/[0.02] border-white/5 font-mono-technical text-[10px] tracking-widest uppercase rounded-sm border-none">
                  <SelectValue placeholder="REGION" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r} className="font-mono-technical text-[10px] uppercase">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <MoreFiltersSheet state={moreFilters} onChange={setMoreFilters} />
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-y border-white/5">
            <div className="flex gap-4">
              <button 
                onClick={() => setStatus("open")}
                className={cn(
                  "font-mono-technical text-[9px] tracking-widest uppercase px-4 py-2 transition-all",
                  status === "open" ? "text-brand bg-brand/10 border border-brand/20" : "text-white/20 hover:text-white/40"
                )}
              >
                OPEN_ONLY
              </button>
              <button 
                onClick={() => setStatus("all")}
                className={cn(
                  "font-mono-technical text-[9px] tracking-widest uppercase px-4 py-2 transition-all",
                  status === "all" ? "text-brand bg-brand/10 border border-brand/20" : "text-white/20 hover:text-white/40"
                )}
              >
                VIEW_ALL
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono-technical text-[9px] text-white/20 uppercase tracking-widest">SORT_BY:</span>
              <Select value={sort} onValueChange={(v: SortOption) => setSort(v)}>
                <SelectTrigger className="w-[140px] h-8 bg-transparent border-none font-mono-technical text-[10px] tracking-widest uppercase focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  {Object.entries(SORT_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k} className="font-mono-technical text-[10px] uppercase">{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white/[0.02] border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-32 text-center border border-dashed border-white/10 bg-white/[0.01] px-6">
            <div className="font-ascii text-3xl text-white/20 mb-3">No matches</div>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Try a broader search, switch to &ldquo;View all&rdquo;, or clear your filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="font-mono-technical text-[10px] tracking-widest uppercase px-5 py-2 border border-brand/30 text-brand hover:bg-brand/10 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}

        <div ref={sentinelRef} className="h-20 flex items-center justify-center">
          {isFetchingNextPage && <Loader2 className="animate-spin text-brand" size={24} />}
        </div>
      </div>
      </div>
    </SiteShell>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <SiteShell>
          <div className="pt-32 pb-24 flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        </SiteShell>
      }
    >
      <BrowsePageContent />
    </Suspense>
  );
}
