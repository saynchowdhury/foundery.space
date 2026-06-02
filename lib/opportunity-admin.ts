import type { Opportunity } from "./data";
import { getAnonClient, getServiceClient } from "@/lib/supabase";

export type AdminOpportunity = Opportunity & {
  mongoId?: string;
  createdAt?: string;
  updatedAt?: string;
};

function normalizeDate(
  value: unknown
): Opportunity["closeDate"] | Opportunity["openDate"] {
  if (value === undefined || value === null) return null;
  if (value === "closed") return "closed";
  if (value instanceof Date) return value.toISOString();
  const strValue = String(value).trim();
  return strValue.length > 0 ? strValue : null;
}

function parseStringArray(
  value: unknown,
  separator: "," | "\n" = ","
): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    const chosenSeparator = value.includes("\n") ? "\n" : separator;
    return value
      .split(chosenSeparator)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizeOpportunityPayload(
  raw: Record<string, unknown>
): Omit<Opportunity, "id" | "logoUrl"> & { shareImageUrl?: string } {
  const name = String(raw.name ?? "").trim();
  const description = String(raw.description ?? "").trim();
  const fullDescription = String(
    raw.fullDescription ?? raw.description ?? ""
  ).trim();
  const organizer = String(raw.organizer ?? "").trim();
  const category = String(raw.category ?? "").trim() as Opportunity["category"];
  const region = String(raw.region ?? "").trim();
  const eligibility = String(raw.eligibility ?? "").trim();
  const applyLink = String(raw.applyLink ?? "").trim();
  const countryValue = raw.country ?? null;
  const applicationVideo = raw.applicationVideo
    ? String(raw.applicationVideo)
    : undefined;

  const missingFields = [
    { key: "name", value: name },
    { key: "description", value: description },
    { key: "fullDescription", value: fullDescription },
    { key: "organizer", value: organizer },
    { key: "category", value: category },
    { key: "region", value: region },
    { key: "eligibility", value: eligibility },
    { key: "applyLink", value: applyLink },
  ]
    .filter((field) => !field.value)
    .map((field) => field.key);

  if (missingFields.length > 0) {
    throw new Error("Missing required fields");
  }

  return {
    name,
    description,
    fullDescription,
    organizer,
    category,
    region,
    eligibility,
    applyLink,
    openDate: normalizeDate(raw.openDate),
    closeDate: normalizeDate(raw.closeDate),
    tags: parseStringArray(raw.tags),
    benefits: parseStringArray(raw.benefits, "\n"),
    country:
      countryValue === null || countryValue === undefined
        ? null
        : String(countryValue),
    duration: raw.duration as Opportunity["duration"],
    funding: raw.funding as Opportunity["funding"],
    applicationVideo,
    shareImageUrl: raw.shareImageUrl
      ? String(raw.shareImageUrl)
      : undefined,
  };
}

export function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
}

async function getClient() {
  return getServiceClient();
}

export async function getOpportunitiesCollection() {
  return getAnonClient().from("opportunities");
}

export async function fetchAllAdmin(): Promise<AdminOpportunity[]> {
  const client = await getClient();
  const { data, error } = await client
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin opportunities:", error);
    return [];
  }

  return (data || []).map(mapRowToAdminOpportunity);
}

export async function fetchById(id: string): Promise<AdminOpportunity | null> {
  const client = await getClient();
  const { data, error } = await client
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    // Also try by name match for slug-based lookups
    const { data: byName } = await client
      .from("opportunities")
      .select("*")
      .eq("id", generateId(id))
      .single();

    if (!byName) return null;
    return mapRowToAdminOpportunity(byName);
  }

  return mapRowToAdminOpportunity(data);
}

export async function createOpportunity(
  payload: ReturnType<typeof normalizeOpportunityPayload>,
  id: string
): Promise<AdminOpportunity | null> {
  const client = await getClient();
  const { data, error } = await client
    .from("opportunities")
    .insert({
      id,
      name: payload.name,
      logo_url: `/logos/${id}.avif`,
      share_image_url: payload.shareImageUrl || `/images/${id}.avif`,
      description: payload.description,
      full_description: payload.fullDescription,
      open_date: payload.openDate,
      close_date: payload.closeDate,
      tags: payload.tags,
      category: payload.category,
      region: payload.region,
      country: payload.country,
      eligibility: payload.eligibility,
      apply_link: payload.applyLink,
      benefits: payload.benefits,
      organizer: payload.organizer,
      duration: payload.duration || null,
      funding: payload.funding || null,
      application_video: payload.applicationVideo || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating opportunity:", error);
    return null;
  }

  return mapRowToAdminOpportunity(data);
}

export async function updateOpportunity(
  id: string,
  payload: Partial<ReturnType<typeof normalizeOpportunityPayload>> & {
    logoUrl?: string;
    shareImageUrl?: string;
  }
): Promise<AdminOpportunity | null> {
  const client = await getClient();
  const updates: Record<string, unknown> = {};

  if (payload.name !== undefined) updates.name = payload.name;
  if (payload.logoUrl !== undefined) updates.logo_url = payload.logoUrl;
  if (payload.shareImageUrl !== undefined)
    updates.share_image_url = payload.shareImageUrl;
  if (payload.description !== undefined)
    updates.description = payload.description;
  if (payload.fullDescription !== undefined)
    updates.full_description = payload.fullDescription;
  if (payload.openDate !== undefined) updates.open_date = payload.openDate;
  if (payload.closeDate !== undefined) updates.close_date = payload.closeDate;
  if (payload.tags !== undefined) updates.tags = payload.tags;
  if (payload.category !== undefined) updates.category = payload.category;
  if (payload.region !== undefined) updates.region = payload.region;
  if (payload.country !== undefined) updates.country = payload.country;
  if (payload.eligibility !== undefined)
    updates.eligibility = payload.eligibility;
  if (payload.applyLink !== undefined) updates.apply_link = payload.applyLink;
  if (payload.benefits !== undefined) updates.benefits = payload.benefits;
  if (payload.organizer !== undefined) updates.organizer = payload.organizer;
  if (payload.duration !== undefined) updates.duration = payload.duration;
  if (payload.funding !== undefined) updates.funding = payload.funding;
  if (payload.applicationVideo !== undefined)
    updates.application_video = payload.applicationVideo;

  const { data, error } = await client
    .from("opportunities")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating opportunity:", error);
    return null;
  }

  return mapRowToAdminOpportunity(data);
}

export async function deleteOpportunity(
  id: string
): Promise<boolean> {
  const client = await getClient();
  const { error } = await client
    .from("opportunities")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting opportunity:", error);
    return false;
  }

  return true;
}

function mapRowToAdminOpportunity(row: Record<string, unknown>): AdminOpportunity {
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
    category: (row.category as Opportunity["category"]) || "fellowship",
    region: String(row.region || ""),
    country: row.country ? String(row.country) : null,
    eligibility: String(row.eligibility || ""),
    applyLink: String(row.apply_link || ""),
    benefits: Array.isArray(row.benefits) ? (row.benefits as string[]) : [],
    organizer: String(row.organizer || ""),
    duration: row.duration as Opportunity["duration"],
    funding: row.funding as Opportunity["funding"],
    applicationVideo: row.application_video
      ? String(row.application_video)
      : undefined,
    votes: Array.isArray(row.voters) ? (row.voters as string[]).length : 0,
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  };
}

export async function searchOpportunities(
  query: string
): Promise<AdminOpportunity[]> {
  const client = await getClient();
  // Sanitize query: escape commas and parentheses that could alter PostgREST filter expressions
  const sanitized = query.replace(/[(),]/g, "");
  const { data, error } = await client
    .from("opportunities")
    .select("*")
    .or(
      `name.ilike.%${sanitized}%,description.ilike.%${sanitized}%,organizer.ilike.%${sanitized}%`
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error searching opportunities:", error);
    return [];
  }

  return (data || []).map(mapRowToAdminOpportunity);
}
