import { getAnonClient } from "@/lib/supabase";
import { normalizeCategory } from "@/lib/opportunities-public";
import type { Opportunity } from "@/lib/data";

const EMPTY: RecentlyAddedResult = { recent: [], hasMore: false, windowDays: 30 };

export interface RecentlyAddedResult {
  recent: Opportunity[];
  hasMore: boolean;
  windowDays: number;
}

const RECENT_WINDOW_DAYS = 30;
const RECENT_FETCH_LIMIT = 20;

export async function fetchRecentlyAdded(): Promise<RecentlyAddedResult> {
  const since = new Date(Date.now() - RECENT_WINDOW_DAYS * 24 * 3600 * 1000).toISOString();
  const { data, error } = await getAnonClient()
    .from("opportunities")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(RECENT_FETCH_LIMIT + 1);

  if (error || !data || data.length === 0) return EMPTY;

  const hasMore = data.length > RECENT_FETCH_LIMIT;
  const rows = hasMore ? data.slice(0, RECENT_FETCH_LIMIT) : data;
  const recent: Opportunity[] = rows.map((row) => ({
    id: String(row.id || ""),
    name: String(row.name || ""),
    logoUrl: String(row.logo_url || ""),
    shareImageUrl: row.share_image_url ? String(row.share_image_url) : undefined,
    description: String(row.description || ""),
    fullDescription: String(row.full_description || row.description || ""),
    openDate: row.open_date ?? null,
    closeDate: row.close_date ?? null,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    category: normalizeCategory(row.category),
    region: String(row.region || ""),
    country: row.country ? String(row.country) : null,
    eligibility: String(row.eligibility || ""),
    applyLink: String(row.apply_link || ""),
    benefits: Array.isArray(row.benefits) ? (row.benefits as string[]) : [],
    organizer: String(row.organizer || ""),
    duration: row.duration as Opportunity["duration"],
    funding: row.funding as Opportunity["funding"],
    applicationVideo: row.application_video ? String(row.application_video) : undefined,
    createdAt: row.created_at ? String(row.created_at) : undefined,
    votes: typeof row.votes === "number" ? row.votes : 0,
  }));

  return { recent, hasMore, windowDays: RECENT_WINDOW_DAYS };
}
