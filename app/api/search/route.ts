import { NextResponse, type NextRequest } from "next/server";
import { checkBotId } from "botid/server";
import { getAnonClient } from "@/lib/supabase";
import { mapOpportunityRow } from "@/lib/opportunities-public";

export const runtime = "nodejs";
export const maxDuration = 10;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Converts a free-text query into a Postgres tsquery string.
 * Handles multi-word phrases with prefix matching and OR fallback.
 *
 * Examples:
 *   "react developer fellowship" → "react:* & developer:* & fellowship:*"
 *   "ML grant"                   → "ml:* & grant:*"
 */
function toTsQuery(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    // strip characters unsafe in tsquery
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => `${w}:*`) // prefix matching → "react:*" matches "reactjs"
    .join(" & ");
}

/**
 * Simple keyword extraction — used as a fallback ilike when full-text misses.
 */
function sanitize(raw: string): string {
  return raw.trim().replace(/[(),.\\%_]/g, "");
}

// ─── Route ──────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const verification = await checkBotId();
  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }
  if (query.length > 500) {
    return NextResponse.json({ error: "Query too long (max 500 characters)" }, { status: 400 });
  }

  const client = getAnonClient();
  const tsQuery = toTsQuery(query);
  const safe = sanitize(query);

  try {
    // ── Stage 1: Weighted full-text search ──────────────────────────────────
    // Uses Postgres tsvector column (if it exists) or falls back to to_tsvector.
    // We run two parallel queries and merge results:
    //   A) Full-text with rank — highest semantic relevance first
    //   B) ilike on name/organizer — catches short codes & acronyms

    const [ftResult, likeResult] = await Promise.all([
      // Full-text search with ts_rank ordering
      client.rpc("search_opportunities", { query_text: tsQuery }).limit(50),

      // Exact/prefix name + organizer matches as a complement
      client
        .from("opportunities")
        .select("*")
        .or(
          `name.ilike.%${safe}%,organizer.ilike.%${safe}%`
        )
        .order("votes", { ascending: false })
        .limit(30),
    ]);

    // ── Stage 2: Merge + deduplicate by id, FTS results ranked first ────────
    const seen = new Set<string>();
    const merged: ReturnType<typeof mapOpportunityRow>[] = [];

    const ftRows = Array.isArray(ftResult.data) ? ftResult.data : [];
    const likeRows = Array.isArray(likeResult.data) ? likeResult.data : [];

    for (const row of [...ftRows, ...likeRows]) {
      const id: string = row.id;
      if (!seen.has(id)) {
        seen.add(id);
        merged.push(mapOpportunityRow(row));
      }
    }

    // If FTS/RPC not available yet (function doesn't exist), fall back gracefully
    if (ftResult.error && ftResult.error.code === "42883") {
      // PGRST function not found — use enhanced ilike fallback
      const fallback = await client
        .from("opportunities")
        .select("*")
        .or(
          `name.ilike.%${safe}%,description.ilike.%${safe}%,organizer.ilike.%${safe}%,tags.cs.{${safe}}`
        )
        .order("votes", { ascending: false })
        .limit(60);

      if (fallback.error) throw fallback.error;

      const results = (fallback.data || []).map(mapOpportunityRow);
      return NextResponse.json(results, {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-Search-Mode": "ilike-fallback",
        },
      });
    }

    if (ftResult.error) throw ftResult.error;

    return NextResponse.json(merged, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Search-Mode": "fulltext",
        "X-Results-Count": String(merged.length),
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
