import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");

if (!existsSync(envPath)) {
  console.error("Missing .env.local at", envPath);
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
  console.error("Missing required env vars: EXA_API_KEY, FIRECRAWL_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

console.log("=".repeat(60));
console.log("OPPORTUNITY SCRAPE PIPELINE");
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

// ─── Helpers ───────────────────────────────────────────────────────────────────

function extractDomain(url) {
  try { const u = new URL(url); return u.hostname.replace(/^www\./, ""); } catch { return ""; }
}

function extractStr(v) { if (!v) return ""; return Array.isArray(v) ? v[0] || "" : v; }

/**
 * Comprehensive HTML + markdown artifact stripping.
 * Firecrawl returns markdown, so we need to clean markdown syntax too.
 */
function stripHtml(t) {
  if (!t) return "";
  return t
    // Remove script/style blocks
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove AI citation artifacts
    .replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, "")
    // Strip markdown image syntax
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
    // Convert markdown links to just text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // Strip markdown headings
    .replace(/^#{1,6}\s+/gm, "")
    // Strip bold/italic
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    // Strip strikethrough
    .replace(/~~(.*?)~~/g, "$1")
    // Strip inline code
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    // Convert list markers to bullets
    .replace(/^\s*[-*+]\s+/gm, "  ")
    // Remove table pipes
    .replace(/\|/g, " ")
    // Remove horizontal rules
    .replace(/^[-=]{3,}\s*$/gm, "")
    // Decode HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "...")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    // Fix Unicode replacement characters
    .replace(/\uFFFD/g, "\u2013")
    // Collapse whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Validate that a scraped page is actually an opportunity listing.
 */
function isValidOpportunity(text) {
  if (!text || text.length < 50) return false;
  const lower = text.toLowerCase();
  const rejectPatterns = [
    /page not found/i,
    /404 - /i,
    /this page doesn'?t exist/i,
    /access denied/i,
    /please enable cookies/i,
    /just a moment/i,       // Cloudflare challenge
    /checking your browser/i,
  ];
  for (const p of rejectPatterns) {
    if (p.test(lower)) return false;
  }
  return true;
}

// ─── Deadline extraction ───────────────────────────────────────────────────────

const DEADLINE_PATTERNS = [
  /deadline[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /(?:applications\s+)?(?:due|closes?)[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /apply by[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /([A-Z][a-z]+ \d{1,2},?\s*\d{4})/,
];

function parseDeadline(text) {
  for (const re of DEADLINE_PATTERNS) {
    const m = re.exec(text);
    if (m) return (m[1] || m[0]).trim();
  }
  return null;
}

// ─── Funding extraction (FIXED — proper suffix multiplier handling) ────────────

const FUNDING_PATTERNS = [
  /\$([0-9,]+(?:\.\d+)?)\s*(k|K|,?000)(?:\s*(?:in\s+)?(?:funding|grant|equity|investment|award|prize|stipend|support))?/i,
  /\$([0-9,]+(?:\.\d+)?)\s*(million|M|billion|B)(?:\s*(?:in\s+)?(?:funding|grant|equity|investment|award|prize|stipend|support))?/i,
  /\$([0-9,]+(?:\.\d{2})?)(?:\s*(?:in\s+)?(?:funding|grant|equity|investment|award|prize|stipend|support))?/i,
  /(?:funding|grant|investment|equity|stipend|award|prize)[:\s]+\$?([0-9,]+(?:\.\d+)?)\s*(k|K|million|M|billion|B|,?000)?/i,
  /up to \$?([0-9,]+(?:\.\d+)?)\s*(k|K|million|M|billion|B|,?000)?/i,
];

function detectFundingType(text) {
  const lower = text.toLowerCase();
  if (/\bequity\b/.test(lower)) return "equity";
  if (/\bstipend\b/.test(lower)) return "stipend";
  if (/\binvestment\b/.test(lower)) return "investment";
  if (/\bprize\b|\baward\b|\bcompetition\b/.test(lower)) return "prize";
  return "grant";
}

function parseFundingValue(text) {
  for (const pattern of FUNDING_PATTERNS) {
    const match = pattern.exec(text);
    if (!match) continue;

    const rawAmount = match[1].replace(/[,$\s]/g, "");
    let amount = parseFloat(rawAmount);
    if (isNaN(amount)) continue;

    const suffix = (match[2] || "").toLowerCase();
    if (suffix === "k" || suffix === ",000" || suffix === "000") {
      amount *= 1_000;
    } else if (suffix === "million" || suffix === "m") {
      amount *= 1_000_000;
    } else if (suffix === "billion" || suffix === "b") {
      amount *= 1_000_000_000;
    }

    // Sanity check: amounts under $10 are likely parsing errors
    if (amount < 10) continue;

    return {
      amount: Math.round(amount),
      currency: "USD",
      fundingType: detectFundingType(text),
    };
  }
  return null;
}

// ─── Tag extraction (FIXED — word boundary matching, no false positives) ───────

const TAG_PATTERNS = [
  { tag: "remote", pattern: /\bremote\b|\bwork from anywhere\b/i },
  { tag: "online", pattern: /\bonline\b|\bvirtual\b/i },
  { tag: "in-person", pattern: /\bin-person\b|\bon-site\b|\bin person\b/i },
  { tag: "hybrid", pattern: /\bhybrid\b/i },
  { tag: "ai", pattern: /\bartificial intelligence\b|\bAI\b|\bmachine learning\b|\bdeep learning\b|\bLLM\b/i },
  { tag: "climate", pattern: /\bclimate\b|\bclean energy\b|\bsustainability\b|\bcarbon\b/i },
  { tag: "biotech", pattern: /\bbiotech\b|\bbiomedical\b|\blife sciences\b/i },
  { tag: "fintech", pattern: /\bfintech\b|\bfinancial technology\b/i },
  { tag: "saas", pattern: /\bSaaS\b|\bsoftware as a service\b/i },
  { tag: "hardware", pattern: /\bhardware\b|\bIoT\b|\bembedded\b/i },
  { tag: "early-stage", pattern: /\bearly.stage\b|\bpre.seed\b/i },
  { tag: "seed", pattern: /\bseed\b|\bseed funding\b/i },
  { tag: "women", pattern: /\bwomen\b|\bfemale founders?\b/i },
  { tag: "underrepresented", pattern: /\bunderrepresented\b|\bdiversity\b|\binclusive\b/i },
  { tag: "diversity", pattern: /\bdiversity\b|\bequity and inclusion\b|\bDEI\b/i },
];

function extractTags(category, text) {
  const tags = [category.replace(/_/g, "-")];
  for (const { tag, pattern } of TAG_PATTERNS) {
    if (pattern.test(text) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }
  return tags;
}

// ─── Organizer extraction ──────────────────────────────────────────────────────

function extractOrganizer(meta, url) {
  const title = meta?.title || "";
  // Check for "Program Name | Organizer" or "Program Name - Organizer" patterns
  const separatorMatch = title.match(/(?:\||[-–—])\s*([^|–—]+?)\s*$/);
  if (separatorMatch && separatorMatch[1].length > 2 && separatorMatch[1].length < 60) {
    return separatorMatch[1].trim();
  }
  const domain = extractDomain(url);
  if (domain) {
    const base = domain.split(".")[0];
    return base.charAt(0).toUpperCase() + base.slice(1);
  }
  return null;
}

// ─── ID generation (50 char limit — single source of truth) ────────────────────

function generateId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

// ─── Country inference from URL TLD ────────────────────────────────────────────

const TLD_COUNTRY_MAP = {
  ".uk": "United Kingdom", ".co.uk": "United Kingdom",
  ".de": "Germany", ".fr": "France", ".es": "Spain",
  ".it": "Italy", ".nl": "Netherlands", ".se": "Sweden",
  ".no": "Norway", ".dk": "Denmark", ".fi": "Finland",
  ".ch": "Switzerland", ".at": "Austria", ".be": "Belgium",
  ".pt": "Portugal", ".ie": "Ireland", ".pl": "Poland",
  ".cz": "Czech Republic", ".hu": "Hungary", ".ro": "Romania",
  ".ca": "Canada", ".us": "United States",
  ".au": "Australia", ".com.au": "Australia",
  ".nz": "New Zealand",
  ".in": "India", ".co.in": "India",
  ".sg": "Singapore", ".com.sg": "Singapore",
  ".jp": "Japan", ".co.jp": "Japan",
  ".kr": "South Korea", ".co.kr": "South Korea",
  ".cn": "China", ".com.cn": "China",
  ".hk": "Hong Kong", ".com.hk": "Hong Kong",
  ".tw": "Taiwan", ".com.tw": "Taiwan",
  ".br": "Brazil", ".com.br": "Brazil",
  ".mx": "Mexico", ".com.mx": "Mexico",
  ".ar": "Argentina", ".co": "Colombia",
  ".za": "South Africa", ".co.za": "South Africa",
  ".ng": "Nigeria", ".ke": "Kenya",
  ".ae": "UAE", ".sa": "Saudi Arabia",
  ".il": "Israel", ".co.il": "Israel",
  ".tr": "Turkey", ".ru": "Russia",
};

function inferCountryFromUrl(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    // Check longer TLDs first (e.g., .co.uk before .uk)
    const sortedTlds = Object.keys(TLD_COUNTRY_MAP).sort((a, b) => b.length - a.length);
    for (const tld of sortedTlds) {
      if (hostname.endsWith(tld)) return TLD_COUNTRY_MAP[tld];
    }
  } catch { /* ignore */ }
  return null;
}

// ─── Sanitize values for PostgREST filter strings ──────────────────────────────

function sanitizeForPostgrest(value) {
  return value.replace(/[(),]/g, "");
}

// ─── Retry wrapper ─────────────────────────────────────────────────────────────

async function fetchWithRetry(url, options, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.ok) return res;
    if (res.status === 429 || res.status >= 500) {
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
    }
    return res;
  }
}

// ─── API wrappers ──────────────────────────────────────────────────────────────

async function searchExa(query) {
  const res = await fetchWithRetry("https://api.exa.ai/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": EXA_KEY },
    body: JSON.stringify({ query, type: "auto", numResults: 10, contents: { highlights: true } }),
  });
  if (!res.ok) throw new Error(`Exa ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.results || [];
}

async function scrapeFirecrawl(url) {
  const res = await fetchWithRetry("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${FIRECRAWL_KEY}` },
    body: JSON.stringify({ url, formats: [{ type: "markdown" }], onlyMainContent: true, timeout: 15000 }),
  });
  if (!res.ok) throw new Error(`Firecrawl ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (!json.success || !json.data) throw new Error(`Firecrawl unsuccessful for ${url}`);
  return json.data;
}

// ─── Category processing ───────────────────────────────────────────────────────

async function processCategory(category) {
  const start = Date.now();
  console.log(`\nCategory: ${category.toUpperCase()}`);
  console.log(`   Query: ${CATEGORY_QUERIES[category]}`);

  const result = { category, discovered: 0, scraped: 0, duplicates: 0, inserted: 0, errors: [], durationMs: 0 };

  try {
    const exaResults = await searchExa(CATEGORY_QUERIES[category]);
    result.discovered = exaResults.length;
    console.log(`   Exa discovered ${result.discovered} URLs`);

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

        // Validate content is actually an opportunity
        const plainBody = stripHtml(body);
        if (!isValidOpportunity(plainBody)) {
          process.stdout.write("skipped (not an opportunity)\n");
          return;
        }

        const name = (extractStr(meta?.title) || exaR.title || "Unknown").replace(/[\n\r\t]+/g, " ").replace(/\s+/g, " ").trim();
        const desc = stripHtml(extractStr(meta?.description) || exaR.highlights?.[0] || md.slice(0, 300));
        const domain = extractDomain(exaR.url);
        const logo = meta?.ogImage || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        const organizer = extractOrganizer(meta, exaR.url);
        const deadline = parseDeadline(body);
        const funding = parseFundingValue(body);
        const tags = extractTags(category, body);
        const country = inferCountryFromUrl(exaR.url);
        const id = generateId(name);

        // Dedup check — sanitize name and id for PostgREST filter
        const safeName = sanitizeForPostgrest(name);
        const safeId = sanitizeForPostgrest(id);
        const dedupRes = await fetch(
          `${SUPABASE_URL}/rest/v1/opportunities?select=id&or=(name.eq.${encodeURIComponent(safeName)},id.eq.${safeId})&limit=1`,
          { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } },
        );
        const existing = dedupRes.ok ? await dedupRes.json() : [];
        if (existing.length > 0) {
          result.duplicates++;
          process.stdout.write("duplicate\n");
          return;
        }

        const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/opportunities`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
          body: JSON.stringify({
            id, name, description: desc, full_description: stripHtml(md.slice(0, 5000)), category,
            region: "Global", country, organizer, apply_link: exaR.url, close_date: deadline,
            open_date: null, funding, eligibility: "", benefits: [], duration: null, tags,
            logo_url: logo, share_image_url: logo, application_video: null,
          }),
        });

        if (insertRes.ok) {
          result.inserted++;
          process.stdout.write(`OK "${name.slice(0, 50)}"\n`);
        } else {
          const errBody = await insertRes.text().catch(() => "");
          result.errors.push(`Insert failed for ${name}: ${errBody}`);
          process.stdout.write(`FAIL ${errBody.slice(0, 80)}\n`);
        }
      }));

      for (const br of batchResults) {
        if (br.status === "rejected") {
          result.errors.push(br.reason?.message?.slice(0, 120) || "Unknown error");
          process.stdout.write("FAIL\n");
        }
      }
    }
  } catch (err) {
    result.errors.push(`Category ${category} failed: ${err.message}`);
    console.log(`   Category error: ${err.message}`);
  }

  result.durationMs = Date.now() - start;
  console.log(`   ${(result.durationMs / 1000).toFixed(1)}s | Discovered: ${result.discovered} | Scraped: ${result.scraped} | Dupes: ${result.duplicates} | Inserted: ${result.inserted} | Errors: ${result.errors.length}`);
  return result;
}

// ─── Run all categories ────────────────────────────────────────────────────────

const allResults = [];
const totalStart = Date.now();

for (const cat of CATEGORIES) {
  allResults.push(await processCategory(cat));
  await new Promise((r) => setTimeout(r, 1000));
}

const totalDuration = ((Date.now() - totalStart) / 1000).toFixed(1);
const summary = allResults.reduce(
  (a, r) => ({ discovered: a.discovered + r.discovered, scraped: a.scraped + r.scraped, duplicates: a.duplicates + r.duplicates, inserted: a.inserted + r.inserted, errors: a.errors + r.errors.length }),
  { discovered: 0, scraped: 0, duplicates: 0, inserted: 0, errors: 0 },
);

console.log("\n" + "=".repeat(60));
console.log("FINAL REPORT");
console.log("=".repeat(60));
console.log(`   Total time: ${totalDuration}s`);
console.log(`   Discovered: ${summary.discovered} URLs via Exa`);
console.log(`   Scraped:    ${summary.scraped} pages via Firecrawl`);
console.log(`   Duplicates: ${summary.duplicates} skipped`);
console.log(`   Inserted:   ${summary.inserted} new opportunities`);
console.log(`   Errors:     ${summary.errors}`);
console.log("-".repeat(60));

if (summary.errors > 0) {
  console.log("\nERRORS:");
  for (const r of allResults) {
    for (const e of r.errors) console.log(`   [${r.category}] ${e}`);
  }
}

console.log("\nPipeline complete. Data is live at https://foundery.space");
