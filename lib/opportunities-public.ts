import { cache } from "react";
import type { Opportunity, OpportunityCardData } from "@/lib/data";
import { getAnonClient } from "@/lib/supabase";
import { toCanonicalCategory } from "@/lib/categories";

export function normalizeCategory(raw: unknown): Opportunity["category"] {
  const val = String(raw || "fellowship").toLowerCase().trim();
  const friendlyAliases: Record<string, Opportunity["category"]> = {
    startup: "accelerator",
    incubation: "incubator",
    vc: "venture_capital",
    "venture capital": "venture_capital",
    hackathon: "competition",
    contest: "competition",
    scholarship: "fellowship",
    "developer programs": "developer_program",
  };
  if (friendlyAliases[val]) return friendlyAliases[val];
  const canonical = toCanonicalCategory(val);
  if (canonical) return canonical as Opportunity["category"];
  return "fellowship";
}

function normalizeDate(
  value: unknown
): Opportunity["closeDate"] | Opportunity["openDate"] {
  if (value === undefined || value === null) return null;
  if (value === "closed") return "closed";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

interface MapRowOptions {
  voterId?: string;
}

/**
 * Single source of truth for mapping a Supabase row to an Opportunity.
 * Used by lib/opportunities-public, lib/recently-added, /[category], /api/opportunities.
 */
export function mapOpportunityRow(
  row: Record<string, unknown>,
  options: MapRowOptions = {}
): Opportunity {
  const { voterId } = options;
  const voterList = Array.isArray(row.voters) ? (row.voters as string[]) : [];
  return {
    id: String(row.id || ""),
    name: String(row.name || ""),
    logoUrl: String(row.logo_url || ""),
    shareImageUrl: row.share_image_url ? String(row.share_image_url) : undefined,
    description: String(row.description || ""),
    fullDescription: String(row.full_description || row.description || ""),
    openDate: normalizeDate(row.open_date),
    closeDate: normalizeDate(row.close_date),
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
    votes: voterList.length,
    hasVoted: voterId ? voterList.includes(voterId) : false,
  };
}

/**
 * Fetch every opportunity from Supabase. Wrapped in React `cache` so that
 * multiple consumers within the same render tree (e.g. /[category] calling
 * fetchAll twice for metadata + page, or the home page calling
 * fetchAllOpportunities plus the carousel slicing it) share a single
 * Supabase roundtrip.
 */
export const fetchAllOpportunities = cache(
  async (): Promise<Opportunity[]> => {
    const { data, error } = await getAnonClient()
      .from("opportunities")
      .select("*")
      .order("close_date", { ascending: true });

    if (error) {
      console.error("Error fetching opportunities:", error);
      return [];
    }

    return (data || []).map((row) => mapOpportunityRow(row));
  }
);

/**
 * Fetch a single opportunity by id. Cached for the same reason: the
 * /opportunity/[id] route fetches it once for layout metadata and once
 * for the page body — with `cache`, the second call is free.
 */
export const fetchOpportunityById = cache(
  async (id: string): Promise<Opportunity | null> => {
    const { data, error } = await getAnonClient()
      .from("opportunities")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return mapOpportunityRow(data);
  }
);

export function isOpportunityOpen(o: Opportunity): boolean {
  if (o.closeDate === "closed") return false;
  if (!o.closeDate) return true; // rolling deadline — always open
  const t = new Date(o.closeDate).getTime();
  if (Number.isNaN(t)) return false; // invalid date — treat as closed, not perpetually open
  return t >= Date.now();
}

// Supabase column list for the slim card payload. Keep this aligned
// with the OpportunityCardData fields in lib/data.ts.
export const CARD_COLUMNS =
  "id,name,logo_url,description,category,region,close_date,tags,funding,organizer,created_at,apply_link";

/**
 * Map a Supabase row to the slim OpportunityCardData shape used by
 * card-rendering components (OpportunityCard, RecentlyAddedSection,
 * homepage carousels). The Supabase query should select CARD_COLUMNS
 * to keep the wire payload small.
 */
export function mapRowToCardData(
  row: Record<string, unknown>
): OpportunityCardData {
  return {
    id: String(row.id || ""),
    name: String(row.name || ""),
    logoUrl: String(row.logo_url || ""),
    description: String(row.description || ""),
    category: normalizeCategory(row.category),
    region: String(row.region || ""),
    closeDate: normalizeDate(row.close_date),
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    funding: row.funding as Opportunity["funding"],
    organizer: String(row.organizer || ""),
    createdAt: row.created_at ? String(row.created_at) : undefined,
    applyLink: String(row.apply_link || ""),
  };
}

/**
 * Fetch only the columns the homepage carousel/recent sections need.
 * Wrapped in `cache` so multiple consumers in one render tree share
 * a single Supabase roundtrip. Use this anywhere you're rendering
 * OpportunityCard, RecentlyAddedSection, or homepage carousels.
 */
export const fetchOpportunityCardData = cache(
  async (): Promise<OpportunityCardData[]> => {
    const { data, error } = await getAnonClient()
      .from("opportunities")
      .select(CARD_COLUMNS)
      .order("close_date", { ascending: true });

    if (error) {
      console.error("Error fetching card data:", error);
      return [];
    }

    return (data || []).map(mapRowToCardData);
  }
);
