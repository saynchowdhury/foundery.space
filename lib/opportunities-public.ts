import type { Opportunity } from "@/lib/data";
import { getAnonClient } from "@/lib/supabase";

function normalizeCategory(raw: unknown): Opportunity["category"] {
  const val = String(raw || "fellowship").toLowerCase().trim();
  const map: Record<string, Opportunity["category"]> = {
    developer_programs: "developer_program",
    "developer programs": "developer_program",
    entrepreneurship: "fellowship",
    startup: "accelerator",
    incubation: "incubator",
    vc: "venture_capital",
    "venture capital": "venture_capital",
    hackathon: "competition",
    contest: "competition",
    scholarship: "fellowship",
  };
  return (map[val] ?? val) as Opportunity["category"];
}

function normalizeDate(
  value: unknown
): Opportunity["closeDate"] | Opportunity["openDate"] {
  if (value === undefined || value === null) return null;
  if (value === "closed") return "closed";
  if (typeof value === "string") return value;
  return String(value);
}

function mapRowToOpportunity(row: Record<string, unknown>): Opportunity {
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
    votes: typeof row.votes === "number" ? row.votes : 0,
  };
}

export async function fetchAllOpportunities(): Promise<Opportunity[]> {
  const { data, error } = await getAnonClient()
    .from("opportunities")
    .select("*")
    .order("close_date", { ascending: true });

  if (error) {
    console.error("Error fetching opportunities:", error);
    return [];
  }

  return (data || []).map(mapRowToOpportunity);
}

export async function fetchOpportunityById(
  id: string
): Promise<Opportunity | null> {
  const { data, error } = await getAnonClient()
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapRowToOpportunity(data);
}

export function isOpportunityOpen(o: Opportunity): boolean {
  if (o.closeDate === "closed") return false;
  if (!o.closeDate) return true;
  const t = new Date(o.closeDate).getTime();
  if (Number.isNaN(t)) return true;
  return t >= Date.now();
}
