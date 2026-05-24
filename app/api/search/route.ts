import { NextResponse, type NextRequest } from "next/server";
import { checkBotId } from "botid/server";
import type { Opportunity } from "@/lib/data";
import { getAnonClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 10;

function normalizeDate(value: unknown): Opportunity["closeDate"] | Opportunity["openDate"] {
  if (value === undefined || value === null) return null;
  if (value === "closed") return "closed";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function mapRow(row: Record<string, unknown>): Opportunity {
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
  };
}

export async function GET(request: NextRequest) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    if (query.length > 500) {
      return NextResponse.json({ error: "Query too long (max 500 characters)" }, { status: 400 });
    }

    const { data, error } = await getAnonClient()
      .from("opportunities")
      .select("*")
      .or(`name.ilike.%${query.trim()}%,description.ilike.%${query.trim()}%,organizer.ilike.%${query.trim()}%,tags.cs.{${query.trim()}}`)
      .order("close_date", { ascending: true });

    if (error) {
      throw error;
    }

    const opportunities = (data || []).map(mapRow);

    return NextResponse.json(opportunities, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error searching opportunities:", error);
    return NextResponse.json({ error: "Failed to search opportunities" }, { status: 500 });
  }
}
