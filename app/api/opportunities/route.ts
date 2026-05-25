import { NextResponse, type NextRequest } from "next/server";
import type { Opportunity } from "@/lib/data";
import { getAnonClient } from "@/lib/supabase";
import { cacheHeaders } from "@/lib/api-utils";

export const runtime = "nodejs";
export const maxDuration = 10;

function normalizeDate(value: unknown): Opportunity["closeDate"] | Opportunity["openDate"] {
  if (value === undefined || value === null) return null;
  if (value === "closed") return "closed";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function mapRow(row: Record<string, unknown>, voterId?: string): Opportunity {
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
    category: (row.category as Opportunity["category"]) || "fellowship",
    region: String(row.region || ""),
    country: row.country ? String(row.country) : null,
    eligibility: String(row.eligibility || ""),
    applyLink: String(row.apply_link || ""),
    benefits: Array.isArray(row.benefits) ? (row.benefits as string[]) : [],
    organizer: String(row.organizer || ""),
    duration: row.duration as Opportunity["duration"],
    funding: row.funding as Opportunity["funding"],
    applicationVideo: row.application_video ? String(row.application_video) : undefined,
    votes: voterList.length,
    hasVoted: voterId ? voterList.includes(voterId) : false,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const voterId = searchParams.get("voterId") || undefined;

    if (id) {
      const { data, error } = await getAnonClient()
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
      }

      return NextResponse.json(mapRow(data, voterId), {
        status: 200,
        headers: cacheHeaders(60, 300),
      });
    }

    const { data, error } = await getAnonClient()
      .from("opportunities")
      .select("*")
      .order("close_date", { ascending: true });

    if (error) {
      throw error;
    }

    const opportunities = (data || []).map((d) => mapRow(d, voterId));

    return NextResponse.json(opportunities, {
      status: 200,
      headers: cacheHeaders(60, 300),
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
  }
}
