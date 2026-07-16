export const CATEGORIES = [
  "fellowship", "accelerator", "grant", "developer_programs",
  "competition", "entrepreneurship", "research", "venture_capital",
  "incubator", "residency",
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_QUERIES: Record<Category, string> = {
  fellowship: '"fellowship" AND ("applications open" OR "apply now" OR "call for applications" OR "AI" OR "climate" OR "web3") 2026',
  accelerator: '"accelerator" AND ("startup" OR "applications open" OR "batch" OR "apply" OR "AI" OR "climate" OR "web3") 2026',
  grant: '"grant" AND ("open source" OR "developers" OR "research" OR "funding" OR "AI" OR "climate" OR "web3") 2026',
  developer_programs: '"developer program" OR "developer relations" OR "community program" OR "devrel" 2026',
  competition: '"hackathon" OR "coding competition" OR "buildathon" OR "challenge" 2026',
  entrepreneurship: '"entrepreneurship program" OR "founder program" OR "startup competition" OR "pitch competition" 2026',
  research: '"research program" OR "research grant" OR "call for proposals" 2026',
  venture_capital: '"venture capital" AND ("apply" OR "funding" OR "rolling applications") 2026',
  incubator: '"incubator" AND ("applications open" OR "cohort" OR "startup") 2026',
  residency: '"residency program" OR "artist residency" OR "developer residency" 2026',
};

export const PRIORITY: Record<Category, "high" | "medium" | "low"> = {
  fellowship: "high",
  accelerator: "high",
  grant: "high",
  developer_programs: "medium",
  competition: "medium",
  entrepreneurship: "medium",
  research: "medium",
  venture_capital: "medium",
  incubator: "medium",
  residency: "low",
};

export interface ExaResult {
  title: string;
  url: string;
  publishedDate?: string;
  text?: string;
  highlights?: string[];
  score?: number;
}

export interface FirecrawlScrapeResponse {
  success: boolean;
  data?: {
    markdown?: string;
    metadata?: {
      title?: string | string[];
      description?: string | string[];
      language?: string;
      sourceURL?: string;
      url?: string;
      ogImage?: string;
      statusCode?: number;
      error?: string;
    };
  };
}

export interface ParsedOpportunity {
  name: string;
  description: string;
  full_description: string;
  category: Category;
  region: string | null;
  country: string | null;
  organizer: string | null;
  apply_link: string | null;
  close_date: string | null;
  open_date: string | null;
  funding: { amount: number; currency: string; fundingType: string } | null;
  eligibility: string | null;
  benefits: string[] | null;
  duration: string | null;
  tags: string[];
  logo_url: string | null;
  share_image_url: string | null;
  application_video: string | null;
}

export interface ScrapeRunResult {
  category: Category;
  discovered: number;
  scraped: number;
  duplicates: number;
  inserted: number;
  errors: string[];
  durationMs: number;
}

const COUNTRY_REGION_MAP: Record<string, string> = {
  us: "North America",
  usa: "North America",
  "united states": "North America",
  ca: "North America",
  canada: "North America",
  mx: "North America",
  mexico: "North America",
  gb: "Europe",
  uk: "Europe",
  "united kingdom": "Europe",
  de: "Europe",
  germany: "Europe",
  fr: "Europe",
  france: "Europe",
  es: "Europe",
  spain: "Europe",
  it: "Europe",
  italy: "Europe",
  nl: "Europe",
  netherlands: "Europe",
  se: "Europe",
  sweden: "Europe",
  no: "Europe",
  norway: "Europe",
  dk: "Europe",
  denmark: "Europe",
  fi: "Europe",
  finland: "Europe",
  ch: "Europe",
  switzerland: "Europe",
  at: "Europe",
  austria: "Europe",
  be: "Europe",
  belgium: "Europe",
  ie: "Europe",
  ireland: "Europe",
  pt: "Europe",
  portugal: "Europe",
  pl: "Europe",
  poland: "Europe",
  jp: "Asia",
  japan: "Asia",
  cn: "Asia",
  china: "Asia",
  in: "Asia",
  india: "Asia",
  kr: "Asia",
  "south korea": "Asia",
  sg: "Asia",
  singapore: "Asia",
  il: "Asia",
  israel: "Asia",
  ae: "Asia",
  "uae": "Asia",
  au: "Oceania",
  australia: "Oceania",
  nz: "Oceania",
  "new zealand": "Oceania",
  br: "South America",
  brazil: "South America",
  ar: "South America",
  argentina: "South America",
  za: "Africa",
  "south africa": "Africa",
  ng: "Africa",
  nigeria: "Africa",
  ke: "Africa",
  kenya: "Africa",
};

function resolveRegion(country: string | null): string | null {
  if (!country) return null;
  const c = country.trim().toLowerCase();
  if (COUNTRY_REGION_MAP[c]) return COUNTRY_REGION_MAP[c];
  return null;
}

function extractStr(val: string | string[] | undefined): string {
  if (!val) return "";
  if (Array.isArray(val)) return val[0] || "";
  return val;
}

function stripHtml(text: string): string {
  return text
    // Remove script and style blocks entirely (including content)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Decode common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&hellip;/g, "...")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&laquo;/g, "\u00AB")
    .replace(/&raquo;/g, "\u00BB")
    // Strip markdown syntax
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")           // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")           // links → text only
    .replace(/^#{1,6}\s+/gm, "")                        // headings
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")         // bold/italic
    .replace(/~~(.*?)~~/g, "$1")                        // strikethrough
    .replace(/^\s*[-*+]\s+/gm, "• ")                   // list items
    .replace(/^\s*\d+\.\s+/gm, "")                      // ordered lists
    .replace(/^\s*>\s+/gm, "")                          // blockquotes
    .replace(/\|/g, " ")                                // table pipes
    .replace(/^[-=]{3,}\s*$/gm, "")                    // horizontal rules
    .replace(/`{1,3}[^`]*`{1,3}/g, "")                 // inline code
    // Collapse whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Clean markdown to produce a human-readable plain-text summary. */
function markdownToPlainText(md: string, maxLen = 300): string {
  const cleaned = stripHtml(md);
  // Take the first meaningful paragraph (skip nav, cookie banners, short lines)
  const lines = cleaned.split("\n").filter((l) => l.trim().length > 40);
  const text = lines.slice(0, 3).join(" ").trim();
  if (!text) return cleaned.slice(0, maxLen).trim();
  // Don't truncate mid-word
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > maxLen * 0.7 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

/** Validate that scraped content looks like a real opportunity (not a blog, 404, or cookie page). */
function isValidOpportunity(name: string, description: string, fullDesc: string): boolean {
  if (/\b(404|page not found|not found|couldn'?t find|does not exist)\b/i.test(name)) return false;
  if (/cookie (policy|settings|preferences|consent)/i.test(fullDesc.slice(0, 500)) && fullDesc.length < 1000) return false;
  if (/wikipedia|wikimedia/i.test(name)) return false;
  return description.length >= 20 && name !== "Unknown" && name.trim().length >= 3;
}

/** Clean a scraped name by stripping whitespace, newlines, and tabs. */
function cleanName(name: string): string {
  return name.replace(/[\n\r\t]+/g, " ").replace(/\s+/g, " ").trim();
}

/** Extract a human-readable organizer name from the page metadata, falling back to domain. */
function extractOrganizer(meta: NonNullable<FirecrawlScrapeResponse["data"]>["metadata"], url: string): string | null {
  // Try og:site_name or structured metadata first
  const siteName = extractStr(meta?.title);
  if (siteName && siteName.length > 2 && siteName.length < 60) {
    // Extract organization from title patterns like "Program Name | Organization"
    const pipeMatch = siteName.match(/\|\s*(.+?)$/);
    if (pipeMatch) return pipeMatch[1].trim();
    const dashMatch = siteName.match(/[-–—]\s*([A-Z][^-–—]+)$/);
    if (dashMatch && dashMatch[1].trim().length > 2) return dashMatch[1].trim();
  }
  // Fall back to domain, but format nicely
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const domainPart = hostname.split(".")[0];
    if (!domainPart || domainPart.length < 2) return null;
    // Convert "sscventurepartners" → "Sscventurepartners" (better than raw domain)
    return domainPart.charAt(0).toUpperCase() + domainPart.slice(1);
  } catch {
    return null;
  }
}

/** Infer country from URL domain TLD rather than page language. */
function inferCountryFromUrl(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const tld = hostname.split(".").pop() || "";
    const TLD_COUNTRY_MAP: Record<string, string> = {
      us: "United States", uk: "United Kingdom", ca: "Canada", au: "Australia",
      de: "Germany", fr: "France", es: "Spain", it: "Italy", nl: "Netherlands",
      se: "Sweden", no: "Norway", dk: "Denmark", fi: "Finland", ch: "Switzerland",
      at: "Austria", be: "Belgium", ie: "Ireland", pt: "Portugal", pl: "Poland",
      jp: "Japan", cn: "China", in: "India", kr: "South Korea", sg: "Singapore",
      il: "Israel", ae: "UAE", br: "Brazil", ar: "Argentina", za: "South Africa",
      ng: "Nigeria", ke: "Kenya", mx: "Mexico", nz: "New Zealand",
    };
    return TLD_COUNTRY_MAP[tld] || null;
  } catch {
    return null;
  }
}

function findMatch(text: string, patterns: RegExp[], maxLen = 200): string | null {
  for (const re of patterns) {
    const m = re.exec(text);
    if (m) {
      const val = (m[1] || m[0]).trim();
      if (val.length > maxLen) return val.slice(0, maxLen);
      return val;
    }
  }
  return null;
}

const DEADLINE_PATTERNS = [
  /deadline[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /(?:applications\s+)?(?:due|closes?)[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /(?:closes?|due)[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /apply by[:\s]+([A-Z][a-z]+ \d{1,2},?\s*\d{4})/i,
  /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/,
  /([A-Z][a-z]+ \d{1,2},?\s*\d{4})/,
];

const FUNDING_PATTERNS = [
  // $Xk / $XK / $X,000 patterns — capture number AND suffix together
  /\$([0-9,]+(?:\.\d+)?)\s*(k|K|,?000)(?:\s*(?:in\s+)?(?:funding|grant|equity|investment|award|prize|stipend|support))?/i,
  // $X million / $XM patterns
  /\$([0-9,]+(?:\.\d+)?)\s*(million|M|billion|B)(?:\s*(?:in\s+)?(?:funding|grant|equity|investment|award|prize|stipend|support))?/i,
  // Plain $X (no suffix) with optional context keyword
  /\$([0-9,]+(?:\.\d{2})?)(?:\s*(?:in\s+)?(?:funding|grant|equity|investment|award|prize|stipend|support))?/i,
  // Keyword-first: "funding: $X" etc.
  /(?:funding|grant|investment|equity|stipend|award|prize)[:\s]+\$?([0-9,]+(?:\.\d+)?)\s*(k|K|million|M|billion|B|,?000)?/i,
  // "up to $X" pattern
  /up to \$?([0-9,]+(?:\.\d+)?)\s*(k|K|million|M|billion|B|,?000)?/i,
];

/** Detect funding type from surrounding text context. */
function detectFundingType(text: string): string {
  const lower = text.toLowerCase();
  if (/\b(equity|shares|ownership|dilut)/i.test(lower)) return "equity-based";
  if (/\b(stipend|salary|compensation|paid)/i.test(lower)) return "stipend";
  if (/\b(investment|vc|venture|seed round)/i.test(lower)) return "investment";
  if (/\b(prize|award|winner|hackathon)/i.test(lower)) return "prize";
  return "grant";
}

function parseFundingValue(text: string): { amount: number; currency: string; fundingType: string } | null {
  for (const re of FUNDING_PATTERNS) {
    const m = re.exec(text);
    if (!m) continue;

    const numStr = m[1].replace(/,/g, "");
    let amount = parseFloat(numStr);
    if (isNaN(amount) || amount <= 0) continue;

    // Apply suffix multiplier from capture group 2 (if present)
    const suffix = (m[2] || "").toLowerCase();
    if (suffix === "k" || suffix === ",000" || suffix === "000") {
      amount *= 1_000;
    } else if (suffix === "million" || suffix === "m") {
      amount *= 1_000_000;
    } else if (suffix === "billion" || suffix === "b") {
      amount *= 1_000_000_000;
    }

    // Sanity check: amounts under $10 are likely parsing errors (unless per-month stipend)
    if (amount < 10 && !/month|monthly|per\s+month/i.test(text.slice(m.index, m.index + 100))) {
      continue;
    }

    const fundingType = detectFundingType(text.slice(Math.max(0, m.index - 50), m.index + m[0].length + 50));
    return { amount: Math.round(amount), currency: "USD", fundingType };
  }
  return null;
}

function parseDeadline(text: string): string | null {
  return findMatch(text, DEADLINE_PATTERNS);
}

function extractTags(category: Category, text: string): string[] {
  const tags = [category.replace(/_/g, "-")];
  // Use word-boundary matching to avoid false positives (e.g. "ai" matching "email", "maintain")
  const kw: Array<{ tag: string; pattern: RegExp }> = [
    { tag: "remote", pattern: /\bremote\b/i },
    { tag: "online", pattern: /\bonline\b/i },
    { tag: "in-person", pattern: /\bin[- ]person\b/i },
    { tag: "hybrid", pattern: /\bhybrid\b/i },
    { tag: "ai", pattern: /\bartificial intelligence\b|\bAI\b|\bmachine learning\b|\bdeep learning\b|\bLLM\b/i },
    { tag: "climate", pattern: /\bclimate\b/i },
    { tag: "biotech", pattern: /\bbiotech\b/i },
    { tag: "fintech", pattern: /\bfintech\b/i },
    { tag: "saas", pattern: /\bsaas\b/i },
    { tag: "hardware", pattern: /\bhardware\b/i },
    { tag: "early-stage", pattern: /\bearly[- ]stage\b/i },
    { tag: "pre-seed", pattern: /\bpre[- ]seed\b/i },
    { tag: "seed", pattern: /\bseed (funding|round|stage|capital)\b/i },
    { tag: "series-a", pattern: /\bseries[- ]?a\b/i },
    { tag: "women", pattern: /\bwomen\b/i },
    { tag: "underrepresented", pattern: /\bunderrepresented\b/i },
    { tag: "diversity", pattern: /\bdiversity\b/i },
  ];
  for (const { tag, pattern } of kw) {
    if (pattern.test(text) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }
  return tags;
}

export async function searchExa(query: string, apiKey: string, numResults = 15): Promise<ExaResult[]> {
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      query,
      type: "auto",
      numResults,
      contents: { highlights: true },
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Exa search failed (${res.status}): ${body}`);
  }
  const json = await res.json();
  return json.results || [];
}

export async function scrapeWithFirecrawl(url: string, apiKey: string): Promise<FirecrawlScrapeResponse["data"]> {
  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      formats: [{ type: "markdown" }],
      onlyMainContent: true,
      timeout: 15000,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Firecrawl scrape failed (${res.status}): ${body}`);
  }
  const json: FirecrawlScrapeResponse = await res.json();
  if (!json.success || !json.data) {
    throw new Error(`Firecrawl returned unsuccessful for ${url}`);
  }
  return json.data;
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function parseOpportunity(
  result: ExaResult,
  scraped: FirecrawlScrapeResponse["data"],
  category: Category,
): ParsedOpportunity | null {
  const meta = scraped?.metadata;
  const md = scraped?.markdown || result.text || "";
  const body = [md, result.highlights?.join(" ") || ""].join("\n");

  // Clean name: strip whitespace, tabs, newlines
  const rawName = extractStr(meta?.title) || result.title || "Unknown";
  const name = cleanName(rawName);

  // Build a clean human-readable description
  const metaDesc = extractStr(meta?.description);
  const highlight = result.highlights?.[0] || "";
  const desc = metaDesc || highlight || markdownToPlainText(md, 300);
  const fullDesc = stripHtml(md.slice(0, 5000));

  // Validate this is actually an opportunity
  if (!isValidOpportunity(name, desc, fullDesc)) {
    console.log(`[scrape] Skipping "${name}": invalid content`);
    return null;
  }

  // Infer country from URL domain TLD, not page language
  const country = inferCountryFromUrl(result.url);
  const region = resolveRegion(country);

  const deadline = parseDeadline(body);
  const funding = parseFundingValue(body);
  const tags = extractTags(category, body);
  const domain = extractDomain(result.url);
  const logo = meta?.ogImage || (domain ? `https://logo.clearbit.com/${domain}` : null) || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  const organizer = extractOrganizer(meta, result.url);

  return {
    name,
    description: desc,
    full_description: fullDesc,
    category,
    region: region || "Global",
    country,
    organizer,
    apply_link: result.url,
    close_date: deadline,
    open_date: null,
    funding,
    eligibility: null,
    benefits: null,
    duration: null,
    tags,
    logo_url: logo,
    share_image_url: logo,
    application_video: null,
  };
}

/** Generate a consistent slug ID from a name. Single source of truth for all scripts. */
export function generateId(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

/** Retry a fetch with exponential backoff. */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 2,
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429 || res.status >= 500) {
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
      }
      return res;
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("fetchWithRetry: unreachable");
}

export async function runCategoryScrape(
  category: Category,
  exaKey: string,
  firecrawlKey: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<ScrapeRunResult> {
  const start = Date.now();
  const MAX_DURATION_MS = 250_000; // 250s safety margin for Vercel's 300s limit
  const result: ScrapeRunResult = {
    category,
    discovered: 0,
    scraped: 0,
    duplicates: 0,
    inserted: 0,
    errors: [],
    durationMs: 0,
  };

  const supabaseHeaders = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
  };

  try {
    const query = CATEGORY_QUERIES[category];
    const exaResults = await searchExa(query, exaKey, 10);
    result.discovered = exaResults.length;

    for (const exaResult of exaResults) {
      // Early exit if approaching time limit
      if (Date.now() - start > MAX_DURATION_MS) {
        result.errors.push(`Time limit reached, stopping category ${category}`);
        break;
      }

      try {
        const scraped = await scrapeWithFirecrawl(exaResult.url, firecrawlKey);
        result.scraped++;

        const opp = parseOpportunity(exaResult, scraped, category);

        // Skip invalid entries (404s, blogs, cookie pages, etc.)
        if (!opp) {
          result.errors.push(`Skipped invalid: ${exaResult.url}`);
          continue;
        }

        const slug = generateId(opp.name);

        // Deduplicate by both name AND slug ID
        const dedupRes = await fetchWithRetry(
          `${supabaseUrl}/rest/v1/opportunities?select=id&or=(name.eq.${encodeURIComponent(opp.name)},id.eq.${encodeURIComponent(slug)})&limit=1`,
          { headers: supabaseHeaders },
        );
        const existing = dedupRes.ok ? await dedupRes.json() : [];
        if (existing.length > 0) {
          result.duplicates++;
          continue;
        }

        const insertRes = await fetchWithRetry(
          `${supabaseUrl}/rest/v1/opportunities`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...supabaseHeaders,
            },
            body: JSON.stringify({
              id: slug,
              name: opp.name,
              description: opp.description,
              full_description: opp.full_description,
              category: opp.category,
              region: opp.region || "Global",
              country: opp.country,
              organizer: opp.organizer,
              apply_link: opp.apply_link,
              close_date: opp.close_date,
              open_date: opp.open_date,
              funding: opp.funding,
              eligibility: opp.eligibility || "",
              benefits: opp.benefits || [],
              duration: opp.duration,
              tags: opp.tags,
              logo_url: opp.logo_url,
              share_image_url: opp.share_image_url,
              application_video: opp.application_video,
            }),
          },
        );

        if (insertRes.ok) {
          result.inserted++;
        } else {
          const errBody = await insertRes.text().catch(() => "");
          result.errors.push(`Insert failed for ${opp.name}: ${errBody}`);
        }
      } catch (err) {
        result.errors.push(`${exaResult.url}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  } catch (err) {
    result.errors.push(`Category ${category} failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  result.durationMs = Date.now() - start;
  return result;
}
