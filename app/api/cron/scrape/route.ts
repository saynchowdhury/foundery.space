import { NextResponse } from "next/server";
import { CATEGORIES, CATEGORY_QUERIES, PRIORITY, runCategoryScrape, type Category, type ScrapeRunResult } from "@/lib/scrape";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const exaKey = process.env.EXA_API_KEY;
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!exaKey || !firecrawlKey || !supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Missing env vars: EXA_API_KEY, FIRECRAWL_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const categoryParam = searchParams.get("category");

  const categories: Category[] = categoryParam
    ? ([categoryParam] as Category[])
    : (CATEGORIES as unknown as Category[]).filter((c) => PRIORITY[c] !== "low");

  const results: ScrapeRunResult[] = [];
  const totalStart = Date.now();

  for (const category of categories) {
    if (!CATEGORY_QUERIES[category]) {
      results.push({
        category,
        discovered: 0,
        scraped: 0,
        duplicates: 0,
        inserted: 0,
        errors: [`Unknown category: ${category}`],
        durationMs: 0,
      });
      continue;
    }

    console.log(`[scrape] Starting category: ${category}`);
    const r = await runCategoryScrape(category, exaKey, firecrawlKey, supabaseUrl, supabaseKey);
    results.push(r);
    console.log(`[scrape] Finished ${category}: ${r.inserted} inserted, ${r.duplicates} dupes, ${r.errors.length} errors`);
  }

  const totalDuration = Date.now() - totalStart;

  return NextResponse.json({
    success: true,
    totalDurationMs: totalDuration,
    results,
    summary: results.reduce(
      (acc, r) => ({
        discovered: acc.discovered + r.discovered,
        scraped: acc.scraped + r.scraped,
        duplicates: acc.duplicates + r.duplicates,
        inserted: acc.inserted + r.inserted,
        errors: acc.errors + r.errors.length,
      }),
      { discovered: 0, scraped: 0, duplicates: 0, inserted: 0, errors: 0 },
    ),
  });
}
