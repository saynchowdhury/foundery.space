import { createClient } from "@supabase/supabase-js";
import { scrapeWithFirecrawl, parseOpportunity } from "../lib/scrape";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY!;

const seedUrls = [
  "https://www.ycombinator.com/apply",
  "https://www.sequoiacap.com/scouts/",
  "https://a16z.com/start/"
];

async function main() {
  console.log("Starting trigger-rescrape...");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  let inserted = 0;
  let errors = 0;

  for (const url of seedUrls) {
    try {
      console.log(`Scraping ${url}...`);
      const scraped = await scrapeWithFirecrawl(url, FIRECRAWL_API_KEY);
      
      // Fake an ExaResult since we have a direct URL
      const exaResult = { title: "Direct Scrape", url, text: scraped?.markdown || "" };
      
      const opp = parseOpportunity(exaResult, scraped, "accelerator");
      if (!opp) {
        console.log(`Failed to parse opportunity for ${url}`);
        errors++;
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
        console.error(`Error inserting ${opp.name}:`, error.message);
        errors++;
      } else {
        console.log(`Inserted ${opp.name} successfully.`);
        inserted++;
      }
    } catch (e: any) {
      console.error(`Failed to process ${url}:`, e.message);
      errors++;
    }
  }
  
  console.log(`Run summary: Inserted=${inserted}, Errors=${errors}`);
}

main().catch(console.error);
