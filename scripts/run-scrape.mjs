import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");

if (!existsSync(envPath)) {
  console.error("❌ .env.local not found at", envPath);
  process.exit(1);
}

const envRaw = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envRaw.split("\n")) {
  const m = line.match(/^\s*([^#=]+)=\s*(.+?)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}

const EXA_KEY = env["EXA_API_KEY"];
const FIRECRAWL_KEY = env["FIRECRAWL_API_KEY"];
const SUPABASE_URL = env["NEXT_PUBLIC_SUPABASE_URL"];
const SUPABASE_KEY = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!EXA_KEY || !FIRECRAWL_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing required env vars");
  process.exit(1);
}

console.log("=".repeat(60));
console.log("🏁 OPPORTUNITY SCRAPE PIPELINE");
console.log("=".repeat(60));

const CATEGORIES = [
  "fellowship",
  "accelerator",
  "grant",
  "developer_programs",
  "competition",
  "entrepreneurship",
  "research",
  "venture_capital",
  "incubator",
  "residency",
];

const CATEGORY_QUERIES = {
  fellowship: '"fellowship" AND ("applications open" OR "apply now" OR "call for applications") 2026',
  accelerator: '"accelerator" AND ("startup" OR "applications open" OR "batch" OR "apply") 2026',
  grant: '"grant" AND ("open source" OR "developers" OR "research" OR "funding") 2026',
  developer_programs: '"developer program" OR "developer relations" OR "community program" OR "devrel" 2026',
  competition: '"hackathon" OR "coding competition" OR "buildathon" OR "challenge" 2026',
  entrepreneurship: '"entrepreneurship program" OR "founder program" OR "startup competition" OR "pitch competition" 2026',
  research: '"research program" OR "research grant" OR "call for proposals" 2026',
  venture_capital: '"venture capital" AND ("apply" OR "funding" OR "rolling applications") 2026',
  incubator: '"incubator" AND ("applications open" OR "cohort" OR "startup") 2026',
  residency: '"residency program" OR "artist residency" OR "developer residency" 2026',
};

async function searchExa(query) {
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": EXA_KEY },
    body: JSON.stringify({ query, type: "auto", numResults: 10, contents: { highlights: true } }),
  });
  if (!res.ok) throw new Error(`Exa ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.results || [];
}

async function scrapeFirecrawl(url) {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${FIRECRAWL_KEY}` },
    body: JSON.stringify({ url, formats: [{ type: "markdown" }], onlyMainContent: true, timeout: 15000 }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (!json.success || !json.data) throw new Error(`Firecrawl unsuccessful for ${url}`);
  return json.data;
}

function extractDomain(url) {
  try { const u = new URL(url); return u.hostname.replace(/^www\./, ""); } catch { return ""; }
}

function stripHtml(t) { return t.replace(/<[^>]*>/g, "").trim(); }
function extractStr(v) { if (!v) return ""; return Array.isArray(v) ? v[0] || "" : v; }

const DEADLINE_PATTERNS = [
  /deadline[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /(?:applications\s+)?(?:due|closes?)[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /apply by[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /([A-Z][a-z]+ \d{1,2},?\s*\d{4})/,
];

const FUNDING_PATTERNS = [
  /(?:funding|grant|investment|stipend|award|prize)[:\s]+\$?([0-9,]+(?:\.\d{2})?(?:\s*(?:k|K|,?000|million|M|billion|B))?)/i,
  /\$([0-9,]+(?:\.\d{2})?)\s*(?:k|K|,?000)?(?:\s*(?:funding|grant|equity|investment|award|prize|stipend|support))?/i,
  /up to \$?([0-9,]+(?:\.\d{2})?(?:\s*(?:k|K|,?000|million|M|billion|B))?)/i,
];

function parseDeadline(text) {
  for (const re of DEADLINE_PATTERNS) {
    const m = re.exec(text);
    if (m) return (m[1] || m[0]).trim();
  }
  return null;
}

function parseFunding(text) {
  for (const re of FUNDING_PATTERNS) {
    const m = re.exec(text);
    if (m) return `$${m[1] || m[0]}`;
  }
  return null;
}

function extractTags(category, text) {
  const tags = [category.replace("_", "-")];
  const kw = ["remote", "online", "in-person", "hybrid", "ai", "climate", "biotech", "fintech", "saas", "hardware", "early-stage", "pre-seed", "seed", "women", "underrepresented", "diversity"];
  const lower = text.toLowerCase();
  for (const k of kw) { if (lower.includes(k) && !tags.includes(k)) tags.push(k); }
  return tags;
}

async function processCategory(category) {
  const start = Date.now();
  console.log(`\n📂 Category: ${category.toUpperCase()}`);
  console.log(`   Query: ${CATEGORY_QUERIES[category]}`);

  const result = { category, discovered: 0, scraped: 0, duplicates: 0, inserted: 0, errors: [], durationMs: 0 };

  try {
    const exaResults = await searchExa(CATEGORY_QUERIES[category]);
    result.discovered = exaResults.length;
    console.log(`   🔍 Exa discovered ${result.discovered} URLs`);

      const concurrency = 3;
      for (let i = 0; i < exaResults.length; i += concurrency) {
        const batch = exaResults.slice(i, i + concurrency);
        const batchResults = await Promise.allSettled(batch.map(async (exaR) => {
          const index = i + batch.indexOf(exaR);
          process.stdout.write(`   [${index + 1}/${exaResults.length}] Scraping ${exaR.url.slice(0, 65)}... `);
          const scraped = await scrapeFirecrawl(exaR.url);
          result.scraped++;

          const meta = scraped?.metadata;
          const md = scraped?.markdown || exaR.text || "";
          const body = [md, exaR.highlights?.join(" ") || ""].join("\n");

          const name = extractStr(meta?.title) || exaR.title || "Unknown";
          const desc = extractStr(meta?.description) || exaR.highlights?.[0] || stripHtml(md.slice(0, 300));
          const domain = extractDomain(exaR.url);
          const logo = meta?.ogImage || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          const organizer = domain ? domain.split(".")[0].charAt(0).toUpperCase() + domain.split(".")[0].slice(1) : null;
          const deadline = parseDeadline(body);
          const funding = parseFunding(body);
          const tags = extractTags(category, body);

          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

          const dedupRes = await fetch(
            `${SUPABASE_URL}/rest/v1/opportunities?select=id&or=(name.eq.${encodeURIComponent(name)},id.eq.${slug})&limit=1`,
            { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
          );
          const existing = dedupRes.ok ? await dedupRes.json() : [];
          if (existing.length > 0) {
            result.duplicates++;
            process.stdout.write("⏭️\n");
            return;
          }

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/opportunities`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
            body: JSON.stringify({
              id: slug, name, description: desc, full_description: stripHtml(md.slice(0, 5000)), category,
              region: "Global", country: null, organizer, apply_link: exaR.url, close_date: deadline,
              open_date: null, funding, eligibility: "", benefits: [], duration: null, tags,
              logo_url: logo, share_image_url: logo, application_video: null,
            }),
          });

          if (insertRes.ok) {
            result.inserted++;
            process.stdout.write(`✅ "${name.slice(0, 50)}"\n`);
          } else {
            const errBody = await insertRes.text().catch(() => "");
            result.errors.push(`Insert failed for ${name}: ${errBody}`);
            process.stdout.write(`❌ ${errBody.slice(0, 80)}\n`);
          }
        }));

        for (const br of batchResults) {
          if (br.status === "rejected") {
            result.errors.push(br.reason?.message?.slice(0, 120) || "Unknown error");
            process.stdout.write("❌\n");
          }
        }
      }
  } catch (err) {
    result.errors.push(`Category ${category} failed: ${err.message}`);
    console.log(`   ❌ Category error: ${err.message}`);
  }

  result.durationMs = Date.now() - start;
  console.log(`   ⏱ ${(result.durationMs / 1000).toFixed(1)}s | Discovered: ${result.discovered} | Scraped: ${result.scraped} | Dupes: ${result.duplicates} | Inserted: ${result.inserted} | Errors: ${result.errors.length}`);
  return result;
}

// Run all categories
const allResults = [];
const totalStart = Date.now();

for (const cat of CATEGORIES) {
  allResults.push(await processCategory(cat));
  // Small delay between categories to be polite to APIs
  await new Promise((r) => setTimeout(r, 1000));
}

const totalDuration = ((Date.now() - totalStart) / 1000).toFixed(1);
const summary = allResults.reduce(
  (a, r) => ({ discovered: a.discovered + r.discovered, scraped: a.scraped + r.scraped, duplicates: a.duplicates + r.duplicates, inserted: a.inserted + r.inserted, errors: a.errors + r.errors.length }),
  { discovered: 0, scraped: 0, duplicates: 0, inserted: 0, errors: 0 },
);

console.log("\n" + "=".repeat(60));
console.log("📊 FINAL REPORT");
console.log("=".repeat(60));
console.log(`   Total time: ${totalDuration}s`);
console.log(`   Discovered: ${summary.discovered} URLs via Exa`);
console.log(`   Scraped:    ${summary.scraped} pages via Firecrawl`);
console.log(`   Duplicates: ${summary.duplicates} skipped`);
console.log(`   Inserted:   ${summary.inserted} new opportunities`);
console.log(`   Errors:     ${summary.errors}`);
console.log("-".repeat(60));

if (summary.errors > 0) {
  console.log("\n⚠️  ERRORS:");
  for (const r of allResults) {
    for (const e of r.errors) console.log(`   [${r.category}] ${e}`);
  }
}

console.log("\n✅ Pipeline complete. Data is live at https://foundery.space");
