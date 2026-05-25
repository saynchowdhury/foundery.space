export const CATEGORIES = [
  "fellowship", "accelerator", "grant", "developer_programs",
  "competition", "entrepreneurship", "research", "venture_capital",
  "incubator", "residency",
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_QUERIES: Record<Category, string> = {
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
  funding: string | null;
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
  return text.replace(/<[^>]*>/g, "").trim();
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
  /\$([0-9,]+(?:\.\d{2})?)\s*(?:k|K|,?000)?(?:\s*(?:in\s+)?(?:funding|grant|equity|investment|award|prize|stipend|support))?/i,
  /(?:funding|grant|investment|equity|stipend|award|prize)[:\s]+\$?([0-9,]+(?:\.\d{2})?(?:\s*(?:k|K|,?000|million|M|billion|B))?)/i,
  /up to \$?([0-9,]+(?:\.\d{2})?(?:\s*(?:k|K|,?000|million|M|billion|B))?)/i,
];

function parseDeadline(text: string): string | null {
  return findMatch(text, DEADLINE_PATTERNS);
}

function parseFunding(text: string): string | null {
  const m = findMatch(text, FUNDING_PATTERNS);
  if (m) return `$${m}`;
  return null;
}

function extractTags(category: Category, text: string): string[] {
  const tags = [category.replace("_", "-")];
  const kw = [
    "remote", "online", "in-person", "hybrid",
    "ai", "climate", "biotech", "fintech", "saas", "hardware",
    "early-stage", "pre-seed", "seed", "series-a",
    "women", "underrepresented", "diversity",
  ];
  const lower = text.toLowerCase();
  for (const k of kw) {
    if (lower.includes(k) && !tags.includes(k)) {
      tags.push(k);
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
      formats: ["markdown", "metadata"],
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

export function parseOpportunity(
  result: ExaResult,
  scraped: FirecrawlScrapeResponse["data"],
  category: Category,
): ParsedOpportunity {
  const meta = scraped?.metadata;
  const md = scraped?.markdown || result.text || "";
  const body = [md, result.highlights?.join(" ") || ""].join("\n");

  const name = extractStr(meta?.title) || result.title || "Unknown";
  const desc = extractStr(meta?.description) || result.highlights?.[0] || stripHtml(md.slice(0, 300));
  const applyLink = result.url;
  const country = extractStr(meta?.language)?.toLowerCase() === "en" ? "US" : null;

  const deadline = parseDeadline(body);
  const funding = parseFunding(body);
  const tags = extractTags(category, body);

  return {
    name,
    description: desc,
    full_description: stripHtml(md.slice(0, 5000)),
    category,
    region: resolveRegion(country),
    country,
    organizer: null,
    apply_link: applyLink,
    close_date: deadline,
    open_date: null,
    funding,
    eligibility: null,
    benefits: null,
    duration: null,
    tags,
    logo_url: meta?.ogImage || null,
    share_image_url: meta?.ogImage || null,
    application_video: null,
  };
}

export async function runCategoryScrape(
  category: Category,
  exaKey: string,
  firecrawlKey: string,
  supabaseUrl: string,
  supabaseKey: string,
): Promise<ScrapeRunResult> {
  const start = Date.now();
  const result: ScrapeRunResult = {
    category,
    discovered: 0,
    scraped: 0,
    duplicates: 0,
    inserted: 0,
    errors: [],
    durationMs: 0,
  };

  try {
    const query = CATEGORY_QUERIES[category];
    const exaResults = await searchExa(query, exaKey, 10);
    result.discovered = exaResults.length;

    for (const exaResult of exaResults) {
      try {
        const scraped = await scrapeWithFirecrawl(exaResult.url, firecrawlKey);
        result.scraped++;

        const opp = parseOpportunity(exaResult, scraped, category);

        const dedupRes = await fetch(
          `${supabaseUrl}/rest/v1/opportunities?select=id&name=eq.${encodeURIComponent(opp.name)}&limit=1`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          },
        );
        const existing = dedupRes.ok ? await dedupRes.json() : [];
        if (existing.length > 0) {
          result.duplicates++;
          continue;
        }

        const insertRes = await fetch(
          `${supabaseUrl}/rest/v1/opportunities?on_conflict=name`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
              Prefer: "resolution=merge-duplicates",
            },
            body: JSON.stringify({
              name: opp.name,
              description: opp.description,
              full_description: opp.full_description,
              category: opp.category,
              region: opp.region,
              country: opp.country,
              organizer: opp.organizer,
              apply_link: opp.apply_link,
              close_date: opp.close_date,
              open_date: opp.open_date,
              funding: opp.funding,
              eligibility: opp.eligibility,
              benefits: opp.benefits,
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
