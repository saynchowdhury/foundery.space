import { NextResponse } from "next/server";
import { CATEGORIES, PRIORITY, runCategoryScrape, scrapeWithFirecrawl, parseOpportunity, type Category, type ScrapeRunResult } from "@/lib/scrape";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET;

  if (!expectedToken) {
    return NextResponse.json({ error: "Cron secret not configured" }, { status: 500 });
  }
  if (authHeader !== `Bearer ${expectedToken}`) {
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

  let body: any = {};
  try {
    body = await request.json();
  } catch (e) {
    // Body is optional
  }

  const reqCategories: string[] = body.categories || [];
  const reqSeedUrls: string[] = body.seedUrls || [];

  const categories: Category[] = reqCategories.length > 0
    ? (reqCategories.filter(c => CATEGORIES.includes(c as Category)) as Category[])
    : (CATEGORIES as unknown as Category[]).filter((c) => PRIORITY[c] !== "low");

  const results: ScrapeRunResult[] = [];
  const totalStart = Date.now();
  let seedInserted = 0;
  let seedErrors = 0;

  // Process Seed URLs first if provided
  if (reqSeedUrls.length > 0) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    for (const url of reqSeedUrls) {
      try {
        console.log(`[rescrape] Scraping seed ${url}...`);
        const scraped = await scrapeWithFirecrawl(url, firecrawlKey);
        
        // Fake ExaResult
        const exaResult = { title: "Direct Scrape", url, text: scraped?.markdown || "" };
        const opp = parseOpportunity(exaResult, scraped, "accelerator");
        
        if (!opp) {
          seedErrors++;
          continue;
        }

        const slug = opp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
        const { error } = await supabase.from("opportunities").upsert({
          id: slug,
          ...opp,
          region: opp.region || "Global",
          eligibility: opp.eligibility || "",
          benefits: opp.benefits || [],
        });

        if (error) {
          seedErrors++;
        } else {
          seedInserted++;
        }
      } catch (e) {
        seedErrors++;
      }
    }
  }

  // Process categories
  for (const category of categories) {
    console.log(`[rescrape] Starting category: ${category}`);
    const r = await runCategoryScrape(category, exaKey, firecrawlKey, supabaseUrl, supabaseKey);
    results.push(r);
  }

  const totalDuration = Date.now() - totalStart;

  const summary = results.reduce(
    (acc, r) => ({
      discovered: acc.discovered + r.discovered,
      scraped: acc.scraped + r.scraped,
      duplicates: acc.duplicates + r.duplicates,
      inserted: acc.inserted + r.inserted,
      errors: acc.errors + r.errors.length,
    }),
    { discovered: 0, scraped: 0, duplicates: 0, inserted: seedInserted, errors: seedErrors }
  );

  return NextResponse.json({
    success: true,
    totalDurationMs: totalDuration,
    results,
    summary,
  });
}
