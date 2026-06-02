"use client";
/* eslint-disable @next/next/no-img-element */
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Search, ChevronUp, ArrowUpDown, Loader2 } from "lucide-react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Opportunity } from "@/lib/data";
import { CATEGORIES, CATEGORY_LABELS, categoryLabel, type CategoryFilter } from "@/lib/categories";
import { MoreFiltersSheet, EMPTY_FILTERS, type BrowseFilterState } from "@/components/features/more-filters-sheet";

const ACCENT = "var(--brand)";
const PAGE_SIZE = 20;

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

function getVoterId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("fs_voter_id");
  if (!id) {
    id =
      crypto.randomUUID?.() ??
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("fs_voter_id", id);
  }
  return id;
}

function timeUntil(date: string | null | "closed"): {
  label: string;
  urgent: boolean;
} {
  if (!date) return { label: "rolling", urgent: false };
  if (date === "closed") return { label: "closed", urgent: false };
  const ms = new Date(date).getTime() - Date.now();
  if (Number.isNaN(ms)) return { label: "\u2014", urgent: false };
  if (ms < 0) return { label: "closed", urgent: false };
  const days = Math.floor(ms / 86400000);
  if (days === 0) return { label: "today", urgent: true };
  if (days < 30) return { label: `${days}d left`, urgent: days < 14 };
  const months = Math.floor(days / 30);
  if (months < 12) return { label: `${months}mo left`, urgent: false };
  return { label: `${Math.floor(months / 12)}y left`, urgent: false };
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

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
  if (more.equityPercentage.min > 0 || more.equityPercentage.max < 20) {
    list = list.filter((o) => {
      if (!o.funding) return false;
      return (
        o.funding.equityPercentage >= more.equityPercentage.min &&
        o.funding.equityPercentage <= more.equityPercentage.max
      );
    });
  }
  if (more.duration.min > 0 || more.duration.max < 52) {
    list = list.filter((o) => {
      if (!o.duration) return false;
      let v = o.duration.value;
      if (o.duration.unit === "weeks" && more.duration.unit === "months") v = v / 4.33;
      else if (o.duration.unit === "weeks" && more.duration.unit === "years") v = v / 52;
      else if (o.duration.unit === "months" && more.duration.unit === "weeks") v = v * 4.33;
      else if (o.duration.unit === "months" && more.duration.unit === "years") v = v / 12;
      else if (o.duration.unit === "years" && more.duration.unit === "weeks") v = v * 52;
      else if (o.duration.unit === "years" && more.duration.unit === "months") v = v * 12;
      return v >= more.duration.min && v <= more.duration.max;
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
let allCacheVoterId: string | null = null;
async function fetchAll(voterId: string): Promise<Opportunity[]> {
  if (allCache && allCacheVoterId === voterId) return allCache;
  const url = voterId
    ? `/api/opportunities?voterId=${encodeURIComponent(voterId)}`
    : "/api/opportunities";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("failed to load");
  const data = (await res.json()) as Opportunity[];
  allCache = Array.isArray(data) ? data : [];
  allCacheVoterId = voterId;
  return allCache;
}

function SkeletonRow() {
  return (
    <li className="flex gap-3 sm:gap-4 py-5 sm:py-4 animate-pulse">
      <div className="w-10 sm:w-9 flex flex-col items-center pt-1 gap-1 shrink-0">
        <div className="w-5 h-5 bg-muted" />
        <div className="h-[12px] w-6 bg-muted/70" />
      </div>
      <div className="w-11 h-11 sm:w-10 sm:h-10 bg-muted border border-border shrink-0" />
      <div className="flex-1 min-w-0 space-y-2.5 sm:space-y-2">
        <div className="space-y-1.5 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
          <div className="h-[18px] w-40 bg-muted" />
          <div className="h-[14px] w-24 bg-muted/70" />
        </div>
        <div className="space-y-1.5">
          <div className="h-[15px] sm:h-[14px] w-full bg-muted/70" />
          <div className="h-[15px] sm:h-[14px] w-4/5 bg-muted/70" />
        </div>
        <div className="flex flex-wrap gap-2 pt-0.5">
          <div className="h-[14px] w-16 bg-muted/60" />
          <div className="h-[14px] w-14 bg-muted/60" />
          <div className="h-[14px] w-20 bg-muted/60" />
        </div>
      </div>
    </li>
  );
}

function BrowsePageContent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    const fromUrl = searchParams.get("q") || "";
    setQ((prev) => (prev === fromUrl ? prev : fromUrl));
  }, [searchParams]);

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
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState<"open" | "all">("open");
  const [sort, setSort] = useState<SortOption>("votes");
  const [moreFilters, setMoreFilters] = useState<BrowseFilterState>(EMPTY_FILTERS);

  const queryClient = useQueryClient();
  const [voterId, setVoterId] = useState("");
  useEffect(() => {
    setVoterId(getVoterId());
  }, []);

  function mutateItem(id: string, patch: Partial<Opportunity>) {
    if (!allCache) return;
    const idx = allCache.findIndex((o) => o.id === id);
    if (idx >= 0) allCache[idx] = { ...allCache[idx], ...patch };
  }

  async function handleVote(id: string, current: number, hasVoted: boolean) {
    if (!voterId) return;
    const action: "up" | "down" = hasVoted ? "down" : "up";
    const optimisticCount = current + (hasVoted ? -1 : 1);
    mutateItem(id, { votes: optimisticCount, hasVoted: !hasVoted });
    queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    try {
      const res = await fetch(`/api/opportunities/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId, action }),
      });
      if (!res.ok) throw new Error();
      const json = (await res.json()) as { votes: number; voted: boolean };
      mutateItem(id, { votes: json.votes, hasVoted: json.voted });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    } catch {
      mutateItem(id, { votes: current, hasVoted });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    }
  }

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["opportunities", voterId, q, category, region, status, sort],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const all = await fetchAll(voterId);
      const filtered = applyFilters(all, q, category, region, status, sort, moreFilters);
      const start = (pageParam as number) * PAGE_SIZE;
      const items = filtered.slice(start, start + PAGE_SIZE);
      const nextPage =
        start + PAGE_SIZE < filtered.length ? (pageParam as number) + 1 : null;
      return { items, nextPage, total: filtered.length };
    },
    getNextPageParam: (lp) => lp.nextPage,
  });

  const items = data?.pages.flatMap((p) => p.items) ?? [];

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

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Browse header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/85 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/" className="shrink-0">
            <span className="font-semibold text-[17px] wordmark">Foundery.Space</span>
          </Link>
          <span className="text-sm text-muted-foreground hidden sm:inline shrink-0">/ Browse</span>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                aria-label="Search opportunities"
                className="pl-9 pr-3 h-9 w-[180px] sm:w-[240px] border border-border bg-card text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--brand)] transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              className="w-9 h-9 border border-border hover:bg-accent flex items-center justify-center transition-colors shrink-0"
            >
              {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Filter bar ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        {/* Mobile: scrollable category pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 sm:hidden scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 px-3 py-1.5 eyebrow border transition-colors ${
                category === c
                  ? "border-[var(--brand)] bg-[var(--brand)] bg-opacity-10 text-[var(--brand-light)]"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "all" ? "All" : CATEGORY_FILTER_LABELS[c]?.split(" ")[0] ?? c}
            </button>
          ))}
        </div>

        {/* Desktop: dropdowns */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          <Select value={category} onValueChange={(v) => setCategory(v as CategoryFilter)}>
            <SelectTrigger className="h-9 w-[170px] bg-card text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {CATEGORY_FILTER_LABELS[c] ?? c.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-9 w-[130px] bg-card text-sm">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r === "all" ? "All regions" : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => setStatus(v as "open" | "all")}>
            <SelectTrigger className="h-9 w-[110px] bg-card text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open only</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
              <SelectTrigger className="h-9 w-[120px] bg-card text-sm border-0 shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
                  <SelectItem key={s} value={s}>{SORT_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <MoreFiltersSheet state={moreFilters} onChange={setMoreFilters} />
          </div>
        </div>

        {/* Mobile: region + status + sort */}
        <div className="flex gap-2 sm:hidden mt-1.5">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="h-9 flex-1 bg-card text-sm">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r === "all" ? "All regions" : r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as "open" | "all")}>
            <SelectTrigger className="h-9 w-[90px] bg-card text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="h-9 w-[100px] bg-card text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
                <SelectItem key={s} value={s}>{SORT_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <MoreFiltersSheet state={moreFilters} onChange={setMoreFilters} />
        </div>
      </div>

      {/* ── Results ───────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        {/* Count + clear */}
        {!isLoading && (
          <div className="flex items-center justify-between mb-3 text-[13px] text-muted-foreground">
            <span>
              <span className="nums">{data?.pages[0]?.total ?? 0}</span> opportunities
              {category !== "all" && (
                <> in <span className="text-foreground">{CATEGORY_FILTER_LABELS[category]}</span></>
              )}
              {region !== "all" && (
                <> · <span className="text-foreground">{region}</span></>
              )}
            </span>
            {(category !== "all" || region !== "all" || q.trim()) && (
              <button
                type="button"
                onClick={() => { setCategory("all"); setRegion("all"); setQ(""); }}
                className="text-[var(--brand-light)] hover:opacity-80 transition-opacity"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <ul className="divide-y divide-border border-b border-border">
          {isLoading && Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}

          {!isLoading && items.length === 0 && (
            <li className="py-12 text-center text-muted-foreground text-[15px]">
              No opportunities match your filters.
            </li>
          )}

          {!isLoading && items.map((o) => {
            const host = hostname(o.applyLink);
            const deadline = timeUntil(o.closeDate);
            const count = o.votes ?? 0;
            const isVoted = !!o.hasVoted;
            return (
              <li key={o.id} className="flex gap-3 sm:gap-4 py-4 items-start">
                {/* Vote */}
                <button
                  type="button"
                  onClick={() => handleVote(o.id, count, isVoted)}
                  aria-label={isVoted ? "Remove upvote" : "Upvote"}
                  className={`shrink-0 w-9 flex flex-col items-center pt-0.5 select-none transition-colors ${
                    isVoted ? "text-[color:var(--accent-color)]" : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ "--accent-color": ACCENT } as React.CSSProperties}
                >
                  <ChevronUp className={`w-5 h-5 ${isVoted ? "fill-current" : ""}`} strokeWidth={isVoted ? 2.5 : 2} />
                  <span className="text-[12px] nums leading-none mt-0.5">{count}</span>
                </button>

                {/* Logo */}
                {o.logoUrl ? (
                  <img
                    src={o.logoUrl}
                    alt=""
                    className="w-10 h-10 object-cover bg-muted border border-border shrink-0 mt-0.5"
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }}
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted border border-border shrink-0 mt-0.5 flex items-center justify-center font-semibold text-sm text-muted-foreground">
                    {o.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Content */}
                <Link href={`/opportunity/${o.id}`} className="group flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
                    <span className="font-medium text-[16px] leading-snug group-hover:underline decoration-2 underline-offset-2">
                      {o.name}
                    </span>
                    {host && <span className="text-[13px] text-muted-foreground">{host}</span>}
                    <span className={`inline-flex items-center text-[11px] uppercase tracking-wide px-1.5 py-0.5 border shrink-0 ${
                      deadline.urgent
                        ? "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400"
                        : deadline.label === "closed"
                          ? "border-border bg-muted text-muted-foreground"
                          : "border-border bg-card text-foreground/80"
                    }`}>
                      {deadline.label}
                    </span>
                  </div>
                  <p className="text-[14px] text-muted-foreground leading-relaxed line-clamp-2 mb-1.5">
                    {o.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-muted-foreground">
                    <span>{categoryLabel(o.category)}</span>
                    <span aria-hidden className="text-muted-foreground/40">·</span>
                    <span>{o.region || "—"}</span>
                    <span aria-hidden className="text-muted-foreground/40">·</span>
                    <span className="min-w-0 truncate">{o.organizer || "—"}</span>
                    {o.tags.length > 0 && (
                      <span className="text-[12px] text-muted-foreground/70 truncate max-w-[200px]">
                        {o.tags.slice(0, 3).join(", ")}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}

          {isFetchingNextPage && Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={`more-${i}`} />)}
        </ul>

        <div ref={sentinelRef} aria-hidden className="h-8" />
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <BrowsePageContent />
    </Suspense>
  );
}
