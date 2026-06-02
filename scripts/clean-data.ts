import * as fs from "fs";
import * as path from "path";

const DATA_PATH = path.resolve(
  __dirname,
  "../public/data/opportunities.json"
);

// ---------- helpers ----------

function isString(v: unknown): v is string {
  return typeof v === "string";
}

const AI_KEYWORDS = [
  "artificial intelligence",
  " ai ",
  "ai/",
  "/ai",
  "machine learning",
  "deep learning",
  "llm",
  "neural",
];

function textMentionsAI(text: string): boolean {
  const lower = text.toLowerCase();
  // Check for "AI" as a standalone word or in common compounds
  if (/\bai\b/i.test(lower)) return true;
  for (const kw of AI_KEYWORDS) {
    if (lower.includes(kw)) return true;
  }
  return false;
}

// ---------- load ----------

let data: any[] = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
const originalCount = data.length;
const changes: string[] = [];

// =============================================
// 1. REMOVE non-opportunity entries
// =============================================
const beforeRemove = data.length;

data = data.filter((entry) => {
  const name = (entry.name || "") as string;
  const fd = (entry.fullDescription || "") as string;

  // Names containing DevRel
  if (/devrel/i.test(name)) return false;
  // Wikipedia
  if (/wikipedia/i.test(name)) return false;
  // GitLab Handbook
  if (/gitlab handbook/i.test(name)) return false;
  // Developer Advocate: The Complete Career
  if (/developer advocate.*complete career/i.test(name)) return false;
  // Google I/O 2026
  if (/google i\/o 2026/i.test(name)) return false;
  // Name is "404" or contains "Page Not Found"
  if (name.trim() === "404") return false;
  if (/page not found/i.test(name)) return false;
  // fullDescription contains error messages
  if (/whoops! we couldn't find/i.test(fd)) return false;
  if (/sorry, the page you're looking for does not exist/i.test(fd)) return false;

  return true;
});

changes.push(
  `1. Removed ${beforeRemove - data.length} non-opportunity entries (${beforeRemove} -> ${data.length})`
);

// =============================================
// 2. MERGE Z Fellows duplicates
// =============================================
const zFellowsIdx = data.findIndex((e) => e.id === "z-fellows");
const zfellowsIdx = data.findIndex((e) => e.id === "zfellows");

if (zFellowsIdx !== -1 && zfellowsIdx !== -1) {
  const a = data[zFellowsIdx];
  const b = data[zfellowsIdx];

  // Determine which has more data
  const scoreEntry = (e: any) => {
    let score = 0;
    if (e.funding && typeof e.funding === "object") {
      score += 2;
      if (e.funding.amount) score += 1;
    }
    if (e.fullDescription && e.fullDescription.length > 200) score += 1;
    if (e.description && e.description.length > 100) score += 1;
    if (e.duration) score += 1;
    if (e.benefits && e.benefits.length > 0) score += 1;
    return score;
  };

  const scoreA = scoreEntry(a);
  const scoreB = scoreEntry(b);

  if (scoreB >= scoreA) {
    // Keep zfellows (b), remove z-fellows (a)
    data.splice(zFellowsIdx, 1);
    changes.push(
      `2. Merged Z Fellows: kept "zfellows" (score ${scoreB}), removed "z-fellows" (score ${scoreA})`
    );
  } else {
    data.splice(zfellowsIdx, 1);
    changes.push(
      `2. Merged Z Fellows: kept "z-fellows" (score ${scoreA}), removed "zfellows" (score ${scoreB})`
    );
  }
} else {
  changes.push(`2. Z Fellows merge: only one entry found, no merge needed`);
}

// =============================================
// 3. FIX names with whitespace/newlines
// =============================================
let namesCleaned = 0;
for (const entry of data) {
  if (!entry.name) continue;
  let name = entry.name as string;
  const original = name;

  // Replace \n, \r, \t and other whitespace sequences with single space
  if (/[\n\r\t]/.test(name)) {
    name = name.replace(/[\n\r\t]+/g, " ");
  }
  // Collapse multiple spaces
  name = name.replace(/\s{2,}/g, " ").trim();
  // Strip trailing "..."
  name = name.replace(/\.{3,}$/, "").trim();

  if (name !== original) {
    entry.name = name;
    namesCleaned++;
  }
}
changes.push(`3. Cleaned whitespace/newlines in ${namesCleaned} names`);

// =============================================
// 4. FIX category misclassifications (VC firms labeled as "grant")
// =============================================
const vcFirms = [
  "general catalyst",
  "battery ventures",
  "founders fund",
  "bessemer venture partners",
  "spark capital",
  "khosla ventures",
  "hummingbird vc",
  "seven seven six",
  "new enterprise associates",
];

let categoriesFixed = 0;
for (const entry of data) {
  if (entry.category !== "grant") continue;
  const nameLower = (entry.name || "").toLowerCase();
  for (const vc of vcFirms) {
    if (nameLower.includes(vc)) {
      entry.category = "venture_capital";
      categoriesFixed++;
      break;
    }
  }
}
changes.push(
  `4. Fixed ${categoriesFixed} VC firm categories from "grant" to "venture_capital"`
);

// =============================================
// 5. FIX tags
// =============================================
let tagsNormalized = 0;
let tagsAILowered = 0;
let tagsAIRemoved = 0;

for (const entry of data) {
  if (!Array.isArray(entry.tags)) continue;

  const allText = [
    entry.name || "",
    entry.description || "",
    entry.fullDescription || "",
  ].join(" ");

  const newTags: string[] = [];
  for (let tag of entry.tags as string[]) {
    const origTag = tag;

    // Normalize to lowercase
    tag = tag.toLowerCase();

    // Replace underscores and spaces with hyphens
    tag = tag.replace(/[_\s]+/g, "-");

    if (tag !== origTag) tagsNormalized++;

    // Handle "ai" tag specifically
    if (tag === "ai") {
      // Check if the entry actually mentions AI-related content
      if (textMentionsAI(allText)) {
        newTags.push("ai");
      } else {
        tagsAIRemoved++;
        // Don't add this tag
        continue;
      }
    } else {
      newTags.push(tag);
    }
  }

  entry.tags = newTags;
}
changes.push(
  `5. Tags: normalized ${tagsNormalized}, removed incorrect "ai" tag from ${tagsAIRemoved} entries`
);

// =============================================
// 6. FIX region/country inconsistencies
// =============================================
let regionFixed = 0;
let countryFixed = 0;

const validRegions = new Set([
  "North America",
  "Europe",
  "Asia",
  "Oceania",
  "South America",
  "Africa",
  "Global",
]);

for (const entry of data) {
  // Region fixes
  if (entry.region === "US") {
    entry.region = "North America";
    regionFixed++;
  } else if (entry.region === "United States") {
    entry.region = "North America";
    regionFixed++;
  } else if (entry.region === "Global (primarily US-focused)") {
    entry.region = "Global";
    regionFixed++;
  }

  // Country fixes
  if (entry.country === "US") {
    entry.country = "United States";
    countryFixed++;
  }
  if (entry.country === "Global" || entry.country === "Europe") {
    entry.country = null;
    countryFixed++;
  }
}
changes.push(
  `6. Fixed ${regionFixed} region values, ${countryFixed} country values`
);

// =============================================
// 7. FIX date inconsistencies
// =============================================
let datesFixed = 0;

const MONTH_MAP: Record<string, string> = {
  january: "01",
  jan: "01",
  february: "02",
  feb: "02",
  march: "03",
  mar: "03",
  april: "04",
  apr: "04",
  may: "05",
  june: "06",
  jun: "06",
  july: "07",
  jul: "07",
  august: "08",
  aug: "08",
  september: "09",
  sep: "09",
  sept: "09",
  october: "10",
  oct: "10",
  november: "11",
  nov: "11",
  december: "12",
  dec: "12",
};

function parseCloseDate(val: string | null): string | null {
  if (!val) return null;
  val = val.trim();

  // Already ISO format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;

  // Garbled / non-date text
  if (val === "closed" || val.length < 5) return null;

  // "June 30, 2026" format
  const match1 = val.match(
    /^(\w+)\s+(\d{1,2}),?\s+(\d{4})$/
  );
  if (match1) {
    const month = MONTH_MAP[match1[1].toLowerCase()];
    if (month) {
      const day = match1[2].padStart(2, "0");
      return `${match1[3]}-${month}-${day}`;
    }
  }

  // "Jun 28 2026" format (no comma)
  const match2 = val.match(
    /^(\w+)\s+(\d{1,2})\s+(\d{4})$/
  );
  if (match2) {
    const month = MONTH_MAP[match2[1].toLowerCase()];
    if (month) {
      const day = match2[2].padStart(2, "0");
      return `${match2[3]}-${month}-${day}`;
    }
  }

  // "May 04, 2026" or similar already caught above

  // If it looks like garbled text, return null
  if (!/\d{4}/.test(val)) return null;

  return val; // leave as-is if we can't parse but it has a year
}

for (const entry of data) {
  if (entry.closeDate !== null && entry.closeDate !== undefined) {
    const parsed = parseCloseDate(entry.closeDate);
    if (parsed !== entry.closeDate) {
      entry.closeDate = parsed;
      datesFixed++;
    }
  }
}
changes.push(`7. Fixed ${datesFixed} date values`);

// =============================================
// 8. FIX description text
// =============================================
let descFixed = 0;

function cleanDescriptionText(text: string, entry?: any): string {
  if (!text) return text;
  let result = text;

  // Remove AI citation artifacts
  result = result.replace(
    /:contentReference\[oaicite:\d+\]\{index=\d+\}/g,
    ""
  );

  // Fix Unicode replacement characters (\uFFFD)
  // Between numbers like "250K\uFFFD$750K" -> en-dash
  result = result.replace(
    /(\d+K?)\uFFFD(\$?\d+K?)/g,
    "$1\u2013$2"
  );
  // Between percentages like "8\uFFFD9%" -> en-dash
  result = result.replace(/(\d+)\uFFFD(\d+%)/g, "$1\u2013$2");
  // In contractions like "isn\uFFFDt" -> apostrophe
  result = result.replace(/(\w+)\uFFFD(t|s|re|ve|ll|d|m)\b/gi, "$1'$2");
  // Possessives like "Sequoia\uFFFDs" -> apostrophe
  result = result.replace(/(\w+)\uFFFD(s)\b/g, "$1'$2");
  // Before currency like "\uFFFD500,000" -> check if European
  result = result.replace(/\uFFFD(\d[\d,]*)/g, (match, num) => {
    if (entry && entry.country && isEuropeanCountry(entry.country)) {
      return "\u20AC" + num; // Euro sign
    }
    return "$" + num;
  });
  // "Park\uFFFD" at end of word -> hyphen
  result = result.replace(/(\w)\uFFFD$/gm, "$1-");
  // Remaining \uFFFD -> hyphen
  result = result.replace(/\uFFFD/g, "-");

  // Also handle the mangled question-mark in box characters
  // These are often rendered as \uFFFD but we already handled above

  // Strip leading/trailing whitespace
  result = result.trim();

  return result;
}

function isEuropeanCountry(country: string): boolean {
  const european = [
    "Belgium",
    "Estonia",
    "Germany",
    "France",
    "United Kingdom",
    "Romania",
    "Spain",
    "Italy",
    "Netherlands",
    "Sweden",
    "Finland",
    "Denmark",
    "Norway",
    "Switzerland",
    "Austria",
    "Portugal",
    "Ireland",
    "Poland",
    "Czech Republic",
    "Hungary",
    "Greece",
    "Tunisia",
  ];
  return european.includes(country);
}

for (const entry of data) {
  if (entry.description) {
    const cleaned = cleanDescriptionText(entry.description, entry);
    if (cleaned !== entry.description) {
      entry.description = cleaned;
      descFixed++;
    }
  }
  if (entry.fullDescription) {
    const cleaned = cleanDescriptionText(entry.fullDescription, entry);
    if (cleaned !== entry.fullDescription) {
      entry.fullDescription = cleaned;
      descFixed++;
    }
  }
  // Also clean benefits array
  if (Array.isArray(entry.benefits)) {
    for (let i = 0; i < entry.benefits.length; i++) {
      const cleaned = cleanDescriptionText(entry.benefits[i], entry);
      if (cleaned !== entry.benefits[i]) {
        entry.benefits[i] = cleaned;
        descFixed++;
      }
    }
  }
  // Also clean eligibility
  if (entry.eligibility) {
    const cleaned = cleanDescriptionText(entry.eligibility, entry);
    if (cleaned !== entry.eligibility) {
      entry.eligibility = cleaned;
      descFixed++;
    }
  }
}
changes.push(
  `8. Cleaned description/description text in ${descFixed} fields (citation artifacts, unicode replacements)`
);

// =============================================
// 9. FIX organizer names derived from domain names
// =============================================
let orgFixed = 0;

// Known domain-fragment organizers and their fixes
const orgFixMap: Record<string, string | null> = {
  Sscventurepartners: "SSC Venture Partners",
  Nytco: "NYT Co",
  Mecam: "MECAM",
  "Ehri-project": "EHRI Project",
  Hsgstartaccelerator: "HSG START Accelerator",
  Nonproliferation: "James Martin Center for Nonproliferation Studies",
  Matsprogram: "MATS Program",
  Os4science: "Open Source for Science Fund",
  Theflaherty: "The Flaherty",
  Digitalthriving: "Center for Digital Thriving",
  Chrisreddington: "Chris Reddington",
  Astanahub: "Astana Hub",
  Oist: "OIST",
  Nsf: "National Science Foundation",
  Graphql: "GraphQL Foundation",
  Github: "Interledger Foundation",
  Eleuther: "EleutherAI",
  Xprize: "XPRIZE",
  Slackhack: "Slack",
  Unstop: "Unstop",
  "Onchain-summer": "Coinbase",
  Technation: "Tech Nation",
  Eit: "European Institute of Innovation & Technology",
  A16z: "Andreessen Horowitz (a16z)",
  Paradigm: "Paradigm",
  Tether: "Tether",
  Startmate: "Startmate",
  Codorra: "Codorra",
  Ksgc: "KSGC",
  Yorku: "York University",
  Meaningfulentrepreneurship: "Meaningful Entrepreneurship",
  Khalifafund: "Khalifa Fund",
  Theforge: "The Forge",
  Kpmg: "KPMG",
  Superai: "SuperAI",
  Ivs: "IVS",
  Epiqs: "Epiq",
  Anr: "ANR",
  Jst: "JST",
  Schmidtsciences: "Schmidt Sciences",
  Fondationbiodiversite: "Fondation Biodiversite",
  Mad: "MAD",
  "M-era": "M-ERA",
  "Fondation-hadamard": "Fondation Hadamard",
  E8angels: "E8 Angels",
  Fast: "FAST",
  Eduloaded: "EduLoaded",
  Pear: "Pear VC",
  "1517": "1517 Fund",
  Iterative: "Iterative",
  Bethnalgreenventures: "Bethnal Green Ventures",
  Jbs: "JBS",
  Missouritechnology: "Missouri Technology",
  "3f": "3F",
  Prnewswire: "PR Newswire",
  Gamecenter: "Game Center",
  Proveg: "ProVeg",
  Startupfeed: "Startup Feed",
  Yzilabs: "YZI Labs",
  Opportunities: null, // clearly wrong
  "16vc": "16 VC",
  Zkm: "ZKM",
  Joanmitchellfoundation: "Joan Mitchell Foundation",
  Banffcentre: "Banff Centre",
  Builderresidency: "Builder Residency",
  Stochasticlabs: "Stochastic Labs",
  "Tu-dresden": "TU Dresden",
  Aiav: "AIAV",
  Bek: "BEK",
  Edgecity: "Edge City",
  "Agentic-ai-accelerator": "Anthropic & AWS",
  Ycombinator: "Y Combinator",
};

// Entries where organizer is clearly wrong for specific entries
const wrongOrgByEntry: Record<string, string | null> = {
  "developer-relations-wikipedia": null, // "En" for Wikipedia
};

for (const entry of data) {
  const org = entry.organizer as string;
  if (!org) continue;

  // Check specific entry-level overrides first
  if (entry.id in wrongOrgByEntry) {
    entry.organizer = wrongOrgByEntry[entry.id];
    orgFixed++;
    continue;
  }

  // Check known domain-fragment fixes
  if (org in orgFixMap) {
    const replacement = orgFixMap[org];
    if (replacement !== org) {
      entry.organizer = replacement;
      orgFixed++;
    }
    continue;
  }

  // For organizers that are single capitalized words with no spaces, < 20 chars
  // that look like domain fragments, check if they need fixing
  if (
    /^[A-Z][a-z]+$/.test(org) &&
    org.length < 20 &&
    org.length > 2 &&
    // Exclude ones that look like real names or acronyms
    !["Arm", "Vercel", "PostHog", "Conviction", "Greylock", "Betaworks", "AngelPad", "LAUNCH", "Pioneer", "Seedcamp", "Accel", "EWOR", "Interact", "OpenAI"].includes(org)
  ) {
    // These are likely domain fragments but we don't have specific fixes
    // Leave as-is since we don't know the right name
  }
}

changes.push(`9. Fixed ${orgFixed} organizer names from domain fragments`);

// =============================================
// 10. FIX funding issues
// =============================================
let fundingFixed = 0;

for (const entry of data) {
  if (typeof entry.funding === "string") {
    const fundingStr = entry.funding as string;
    const desc = [
      entry.description || "",
      entry.fullDescription || "",
    ].join(" ");

    // Parse dollar amounts from string
    const amountMatch = fundingStr.match(
      /\$([\d,]+(?:\.\d+)?)/
    );
    if (amountMatch) {
      let amount = parseFloat(amountMatch[1].replace(/,/g, ""));

      // Check for garbled multiline funding like "$8\nm"
      if (fundingStr.includes("\n")) {
        entry.funding = null;
        fundingFixed++;
        continue;
      }

      // If amount seems too small and description mentions K/thousand
      if (
        amount < 1000 &&
        /\b\d+[kK]\b|\bthousand\b/i.test(desc)
      ) {
        amount = amount * 1000;
      }
      // If amount seems too small and description mentions million
      else if (
        amount < 1000 &&
        /\bmillion\b/i.test(desc)
      ) {
        amount = amount * 1000000;
      }
      // If amount is still very small and not a monthly stipend
      else if (amount < 100) {
        // Check if it could be a valid small amount (like a stipend)
        const isMonthlyStipend =
          /month|monthly|stipend|per participant/i.test(desc);
        if (!isMonthlyStipend && amount < 100) {
          // Check if description mentions K/thousand for this specific context
          if (/\b\d+[kK]\b/i.test(fundingStr + " " + desc)) {
            amount = amount * 1000;
          } else if (/\bmillion\b/i.test(fundingStr + " " + desc)) {
            amount = amount * 1000000;
          } else {
            entry.funding = null;
            fundingFixed++;
            continue;
          }
        }
      }

      entry.funding = {
        amount: amount,
        currency: "USD",
        fundingType: "unknown",
      };
      fundingFixed++;
    } else {
      // Can't parse, set to null
      entry.funding = null;
      fundingFixed++;
    }
  }

  // Fix Battery Ventures specifically
  if (
    entry.id === "battery-ventures" &&
    entry.funding &&
    typeof entry.funding === "object"
  ) {
    if (entry.funding.currency === "billion USD") {
      entry.funding.currency = "USD";
      // amount 3.8 billion -> the fund size, not individual investment
      // Remove the misleading amount or set to the actual fund size
      entry.funding.amount = 3800000000;
      fundingFixed++;
    }
  }
}

changes.push(`10. Fixed ${fundingFixed} funding entries`);

// =============================================
// WRITE cleaned data
// =============================================
fs.writeFileSync(
  DATA_PATH,
  JSON.stringify(data, null, 2) + "\n",
  "utf-8"
);

// =============================================
// VERIFICATION
// =============================================
console.log("\n=== DATA CLEANING SUMMARY ===\n");
console.log(`Original entries: ${originalCount}`);
console.log(`Final entries: ${data.length}`);
console.log(`Entries removed: ${originalCount - data.length}\n`);

console.log("--- Changes Made ---");
for (const c of changes) {
  console.log(c);
}

// Verify no names with \n, \r, \t
const namesWithWhitespace = data.filter(
  (e) => e.name && /[\n\r\t]/.test(e.name)
);
console.log(
  `\n[VERIFY] Entries with \\n/\\r/\\t in name: ${namesWithWhitespace.length}`
);

// Verify no "ai" tag on non-AI content
const badAITags = data.filter((e) => {
  if (!Array.isArray(e.tags) || !e.tags.includes("ai")) return false;
  const allText = [
    e.name || "",
    e.description || "",
    e.fullDescription || "",
  ].join(" ");
  return !textMentionsAI(allText);
});
console.log(
  `[VERIFY] Entries with "ai" tag on non-AI content: ${badAITags.length}`
);

// Verify all regions are from standard set
const badRegions = data.filter(
  (e) => e.region && !validRegions.has(e.region)
);
console.log(
  `[VERIFY] Entries with non-standard regions: ${badRegions.length}`
);
if (badRegions.length > 0) {
  for (const e of badRegions) {
    console.log(`  - "${e.name}": region="${e.region}"`);
  }
}

// Verify no entries with error descriptions
const errorEntries = data.filter(
  (e) =>
    /whoops! we couldn't find/i.test(e.fullDescription || "") ||
    /sorry, the page you're looking for/i.test(e.fullDescription || "")
);
console.log(
  `[VERIFY] Entries with error descriptions: ${errorEntries.length}`
);

// Count remaining string funding
const stringFunding = data.filter(
  (e) => typeof e.funding === "string"
);
console.log(
  `[VERIFY] Entries with string funding: ${stringFunding.length}`
);

console.log(`\nCleaned data written to: ${DATA_PATH}`);
