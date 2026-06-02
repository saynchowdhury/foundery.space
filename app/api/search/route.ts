import { NextResponse, type NextRequest } from "next/server";
import { checkBotId } from "botid/server";
import { getAnonClient } from "@/lib/supabase";
import { mapOpportunityRow } from "@/lib/opportunities-public";

export const runtime = "nodejs";
export const maxDuration = 10;

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

    const opportunities = (data || []).map((row) => mapOpportunityRow(row));

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
