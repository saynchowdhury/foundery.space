import { NextResponse, type NextRequest } from "next/server";
import { getAnonClient } from "@/lib/supabase";
import { cacheHeaders } from "@/lib/api-utils";
import { mapOpportunityRow } from "@/lib/opportunities-public";

export const runtime = "nodejs";
export const maxDuration = 10;

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

      return NextResponse.json(mapOpportunityRow(data, { voterId }), {
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

    const opportunities = (data || []).map((d) =>
      mapOpportunityRow(d, { voterId })
    );

    return NextResponse.json(opportunities, {
      status: 200,
      headers: cacheHeaders(60, 300),
    });
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
  }
}
