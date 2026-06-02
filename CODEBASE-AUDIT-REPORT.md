# Foundery.Space Codebase Audit Report

**Date:** June 2, 2026  
**Scope:** Full codebase review of the fellowship/opportunity directory app  
**Files analyzed:** ~60 source files, 186 opportunity entries, scraping pipeline, frontend, API routes, data layer

---

## Executive Summary

This is a Next.js 15 fellowship directory app ("Foundery.Space") that scrapes opportunity data from the web using Exa + Firecrawl and stores it in Supabase. The codebase is well-structured but has **critical data quality problems** stemming from a scraping pipeline that stores raw markdown/HTML artifacts instead of clean, human-readable text. There are also security vulnerabilities, funding parsing bugs that corrupt amounts by orders of magnitude, and widespread encoding issues affecting 55+ entries.

**Top 5 priorities to fix:**
1. Cron endpoint is publicly accessible when `CRON_SECRET` is unset (security)
2. Funding amounts are off by 1000x-1000000x due to regex bugs (data corruption)
3. Raw markdown/HTML stored as descriptions -- not human-readable (data quality)
4. 55+ entries have garbled Unicode characters in key fields (data quality)
5. Country/region is wrong for most scraped records (data correctness)

---

## SECTION 1: Critical Security Issues

### 1.1 Cron Endpoint Publicly Accessible (CRITICAL)

**File:** `app/api/cron/scrape/route.ts`, lines 9-12

```typescript
const expectedToken = process.env.CRON_SECRET;
if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

When `CRON_SECRET` is undefined or empty, the condition `expectedToken &&` is falsy, and the auth check is **entirely skipped**. Anyone who discovers the `/api/cron/scrape` endpoint can trigger expensive scraping operations (Exa + Firecrawl API costs) and write arbitrary data to the database.

**Fix:** Invert the logic -- deny access when no secret is configured.

```typescript
if (!expectedToken) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 500 });
}
if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### 1.2 Admin Token Passed as URL Query Parameter

**File:** `middleware.ts`, line 25-26

The admin token is passed via `?token=` in the URL, which gets logged in server access logs, browser history, and referrer headers. This should be moved to a cookie or header-based auth.

### 1.3 SQL Injection Risk in Admin Search

**File:** `lib/opportunity-admin.ts`, lines 290-295

```typescript
.or(`name.ilike.%${query}%,description.ilike.%${query}%,organizer.ilike.%${query}%`)
```

The `query` parameter is interpolated directly into a PostgREST filter string. If `query` contains commas or parentheses, it could alter the filter expression.

### 1.4 `maxDuration: 60` Is Far Too Short

**File:** `app/api/cron/scrape/route.ts`, line 5

With 9 categories and sequential scraping of 10 URLs each (each with 15s Firecrawl timeout), worst case is 1,350 seconds. The 60-second limit will truncate most runs, leaving partial data inserted with no rollback.

---

## SECTION 2: Scraping Pipeline Bugs (Root Cause of Data Problems)

### 2.1 Funding Amounts Off by Orders of Magnitude (CRITICAL)

**File:** `lib/scrape.ts`, lines 201-223

Two separate bugs combine to corrupt funding data:

**Bug A -- The `$Xk` shorthand pattern doesn't apply the multiplier:**
The regex `/\$([0-9,]+(?:\.\d{2})?)\s*(?:k|K|,?000)?/` captures the number but the `k` suffix is matched outside the capture group. So `$50k` captures `"50"` and returns `$50` instead of `$50,000`.

**Bug B -- `parseFloat` succeeds before the suffix check runs:**
For `"50million"`, `parseFloat` returns `50` (not NaN), so the `.endsWith("million")` branch never executes. The result is `$50` instead of `$50,000,000`.

**Impact:** 53 entries have funding stored as truncated strings like `"$110"` (should be $110K), `"$50"` (should be $50M), `"$300"` (should be $300M).

### 2.2 Country/Region Wrong for Most Scraped Records

**File:** `lib/scrape.ts`, line 311

```typescript
const country = extractStr(meta?.language)?.toLowerCase() === "en" ? "US" : null;
```

Every English-language page is tagged as from the US. A fellowship from India, Nigeria, Kenya, or the UK written in English would all be incorrectly tagged `"US"`. This corrupts both `country` and `region` (via `resolveRegion`) for the majority of scraped records.

### 2.3 `fundingType` Always Returns "grant"

**File:** `lib/scrape.ts`, line 223

```typescript
return { amount: Math.round(amount), currency: "USD", fundingType: "grant" };
```

Every funding entry -- equity, investment, prize, stipend -- is hardcoded as `"grant"`. The regex matches keywords like "investment" or "stipend" but never passes them through.

### 2.4 Raw Markdown Stored as Descriptions (THE MAIN DATA QUALITY ISSUE)

**File:** `lib/scrape.ts`, lines 176-178 and 323

```typescript
function stripHtml(text: string): string {
    return text.replace(/<[^>]*>/g, "").trim();
}
// ...
full_description: stripHtml(md.slice(0, 5000)),
```

Firecrawl returns markdown. `stripHtml()` only removes HTML tags, NOT:
- HTML entities (`&amp;`, `&#39;`, `&nbsp;`) -- appear as literal text
- Markdown headings (`## About`)
- Markdown links (`[text](url)`)
- Markdown formatting (`**bold**`, `*italic*`)
- Markdown images (`![alt](src)`)
- Markdown tables (`| col1 | col2 |`)
- Script/style content between tags

**Result:** ~40 entries have `fullDescription` fields containing navigation menus, cookie policies, social media share buttons, or raw markdown syntax instead of clean opportunity descriptions.

### 2.5 Description Fallback Produces Poor Summaries

**File:** `lib/scrape.ts`, line 309

```typescript
const desc = extractStr(meta?.description) || result.highlights?.[0] || stripHtml(md.slice(0, 300));
```

When meta description and highlights are both missing, the first 300 characters of raw markdown are used. This frequently starts with navigation text or headers, and the arbitrary 300-char cutoff truncates mid-sentence.

### 2.6 No Validation of Scraped Data Before Insertion

**File:** `lib/scrape.ts`, lines 370-418

There is no check that:
- `opp.name` is not `"Unknown"` (the fallback on line 308)
- `opp.description` is non-empty or meaningful
- `opp.apply_link` is a valid URL
- `opp.full_description` is not mostly boilerplate/navigation text
- The scraped page actually describes a fellowship/program

Any garbage result from Exa/Firecrawl gets inserted into the database as-is.

---

## SECTION 3: Data Quality Issues in opportunities.json (186 entries)

### 3.1 Summary Statistics

| Issue Type | Count |
|-----------|-------|
| Total entries | 186 |
| Entries with garbled Unicode characters | 55+ |
| Empty eligibility fields | 93 (50%) |
| Empty benefits arrays | 93 (50%) |
| Funding as truncated string (not object) | 53 |
| fullDescription with scraping artifacts | ~40 |
| Non-opportunity entries (blog/wiki/jobs) | 7 |
| 404/error page entries | 2 |
| Names with whitespace/newlines | 5 |
| Wrong "ai" tag on non-AI entries | 38+ |
| VC firms mislabeled as "grant" | 9 |
| Past closeDates (expired programs) | 17 |
| Organizer names derived from domain names | 75+ |
| AI citation artifacts in text | 3 |
| Duplicate entries | 1 pair |

### 3.2 Entries That Are NOT Opportunities

These were scraped from the web but are blog posts, Wikipedia articles, handbook pages, or job descriptions:

| Name | What it actually is |
|------|---------------------|
| The Future of DevRel: Six Shifts Reshaping Developer Engagement in 2026 | Blog article |
| Developer relations - Wikipedia | Wikipedia article |
| The four pillars of DevRel (and the foundation they rest on) | Blog post |
| Developer Relations Programs - The GitLab Handbook | Internal handbook page |
| Developer Advocate: The Complete Career & Strategy Guide for 2026 | Blog post |
| Developer Relations Program Manager - The GitLab Handbook | Job role page |
| Google I/O 2026: Google Community Groups | Conference page stub |

### 3.3 Entries That Are 404/Error Pages

| Name | fullDescription |
|------|----------------|
| 404 | "Whoops! We couldn't find what you were looking for. (404)" |
| Page Not Found - Joan Mitchell Foundation | "Sorry, the page you're looking for does not exist." |

### 3.4 Encoding Issues (55+ Entries with Garbled Characters)

The most common pattern is em-dash characters and currency symbols being replaced with the Unicode replacement character. Examples:

- **2048 Ventures:** `Ventures\uFFFD Pre-Seed`, `$250K\uFFFD$750K`
- **Sequoia Arc:** `Sequoia\uFFFDs Company Design` (possessive apostrophe)
- **Antler:** `$200\uFFFD$250K`, `8\uFFFD9%`
- **Seedcamp:** `\uFFFD100\uFFFD200K` (EUR symbol garbled)
- **EWOR Fellowship:** `\uFFFD500,000`, `\uFFFD110,000` (EUR symbol garbled)
- **Coding it Forward:** `June?8?\uFFFD?August?14` (date garbled)

### 3.5 Entries Where fullDescription Is Entirely Cookie Policy or 404 Text

These have NO program information at all:

| Name | fullDescription content |
|------|------------------------|
| OIST Innovation Accelerator | Cookie policy text |
| 2026 EPiQS Experimental Investigators | Cookie policy text |
| 2026 Interpretability RFP | Cookie policy text |
| Flux Capacitor - 1517 Fund | Cookie policy text |

### 3.6 Category Misclassification: VC Firms Labeled as "grant"

9 major venture capital firms are incorrectly categorized:

| Name | Current | Should be |
|------|---------|-----------|
| General Catalyst | `grant` | `venture_capital` |
| Battery Ventures | `grant` | `venture_capital` |
| Founders Fund | `grant` | `venture_capital` |
| Bessemer Venture Partners | `grant` | `venture_capital` |
| Spark Capital | `grant` | `venture_capital` |
| Khosla Ventures | `grant` | `venture_capital` |
| Hummingbird VC | `grant` | `venture_capital` |
| Seven Seven Six (776) | `grant` | `venture_capital` |
| New Enterprise Associates (NEA) | `grant` | `venture_capital` |

### 3.7 Tag Inconsistencies

**"ai" tag applied to non-AI entries (38+ entries):**
- CNS Visiting Fellows (nuclear nonproliferation) -- tagged `["fellowship","ai"]`
- EHRI Conny Kristel Fellowship (Holocaust research) -- tagged `["fellowship","ai"]`
- New York Times Fellowship (journalism) -- tagged `["fellowship","ai"]`
- Rauschenberg Residencies (performative art) -- tagged `["residency","hybrid","ai"]`

**Case inconsistency:** Some entries use `"AI"` (uppercase) while most use `"ai"` (lowercase).

**Format inconsistency:** Tags use hyphens (`"pre-seed"`), spaces (`"venture capital"`), and underscores (`"funding_program"`) inconsistently.

### 3.8 Funding Amount Truncation Examples

| Name | Stored value | Likely intended value |
|------|-------------|----------------------|
| Build on Trainium | `"$110"` | $110,000 or $110K |
| Anthropic & AWS Agentic AI Accelerator | `"$50"` | $50K or $70K credits |
| SSC 2026 Summer Accelerator | `"$20"` | $20K or $200K |
| Anthropic Fellows Program | `"$15"` | $15K/month or $150K |
| Open Source for Science Fund | `"$20"` | $20 million |
| a16z speedrun SR007 | `"$300"` | $300M total invested |
| Startmate Accelerator | `"$120"` | $120K |
| 16VC Founder Fellowship | `"$250"` | $250K-$2M |

### 3.9 Date Issues

**closeDate before openDate:**
- Founders Inc Off Season: openDate `2026-06-01`, closeDate `2025-06-18`

**17 expired programs still listed as active** (closeDates in 2024/2025):
- Nullfellows Fellowship (Jan 2025), NEO Accelerator (Mar 2025), 776 Foundation (Apr 2025), Techstars (Jun 2025), Entrepreneurs First (Aug 2025), Y Combinator Fall 2025 (Aug 2025), 500 Global Flagship (Oct 2025), NYT Fellowship (Oct 2025), and more.

**Date format inconsistency:** Manually curated entries use ISO (`"2025-06-11"`), scraped entries use natural language (`"June 30, 2026"`, `"Jun 28 2026"`).

### 3.10 Region/Country Inconsistencies

| Value used | Count | Should be |
|-----------|-------|-----------|
| `"US"` (as region) | 3 | `"North America"` |
| `"United States"` (as region) | 1 | `"North America"` |
| `"Global (primarily US-focused)"` | 1 | `"Global"` or `"North America"` |
| `"US"` (as country) | 2 | `"United States"` |
| `"Global"` (as country) | 4 | Not a country |
| `"Europe"` (as country) | 1 | Not a country |

### 3.11 Organizer Names Derived from Domain Names

75+ entries have organizer values that are domain name fragments:

| Name | `organizer` value | Correct organizer |
|------|-------------------|-------------------|
| SSC 2026 Summer Accelerator | `"Sscventurepartners"` | SSC Venture Partners |
| Anthropic Fellows Program | `"Alignment"` | Anthropic |
| EHRI Conny Kristel Fellowship | `"Ehri-project"` | EHRI-ERIC |
| NYT Fellowship | `"Nytco"` | The New York Times Company |
| Cambridge Social Ventures | `"Jbs"` | Cambridge Judge Business School |

### 3.12 AI Citation Artifacts

3 entries contain `:contentReference[oaicite:1]{index=1}` in their descriptions -- an artifact from AI-generated content that was never cleaned.

- Cloudflare for Startups
- TKS World 2026
- Coding it Forward Fellowship

### 3.13 Duplicate Entry

"Z Fellows" appears twice with different IDs (`z-fellows` and `zfellows`) and slightly different descriptions/funding structures.

### 3.14 Names with Whitespace/Formatting Issues

5 entries have names containing newlines and tabs from scraping:
- `"\n\t\t\tOIST Innovation Accelerator...\n\n\t\t"`
- `"\n      Tether Launches Developer Grants...  \n    "`
- `"\n\t\t\t2026 EPiQS Experimental Investigators...\n\n\t\t"`
- `"\n\t\t\t2026 Interpretability RFP...\n\n\t\t"`
- `"\n\t\t\tFlux Capacitor - Request for Explorers...\n\n\t\t"`

---

## SECTION 4: Cross-Cutting Code Issues

### 4.1 ID Generation Inconsistency

| Location | Truncation | Result |
|----------|-----------|--------|
| `scrape.ts` line 397 | `.slice(0, 60)` | Up to 60 chars |
| `seed-16-new-programs.ts` line 31 | `.substring(0, 50)` | Up to 50 chars |
| `opportunity-admin.ts` line 103 | `.substring(0, 50)` | Up to 50 chars |
| `run-scrape.mjs` line 176 | `.slice(0, 60)` | Up to 60 chars |

Names longer than 50 chars but shorter than 60 will get **different IDs** depending on which path inserted them, creating duplicates.

### 4.2 Deduplication Logic Differs Across All Three Ingestion Paths

| Location | Strategy |
|----------|---------|
| `scrape.ts` line 373 | Match by name only |
| `run-scrape.mjs` line 179 | Match by name OR slug |
| `seed-16-new-programs.ts` line 53 | Match by slug only |

The same record could be inserted by different scripts without detecting the duplicate.

### 4.3 Type System Fragmentation

The `Opportunity` type is defined in **three different places** with incompatible shapes:

| Field | `data.ts` (public) | `export-opportunities.ts` | `scrape.ts` |
|-------|---------|----------|----------|
| `category` | Union of 9 strings | `string` | `Category` (10 strings) |
| `funding` | Complex object with `equityPercentage`, `fundingType` | `string` | `{ amount, currency, fundingType: "grant" }` |
| `duration` | `{ value, unit }` | `string` | `string \| null` |
| `closeDate` | `string \| null \| "closed"` | `string \| null` | `string \| null` |

### 4.4 Parsing Logic Duplicated Between Files

All utility functions (`stripHtml`, `extractStr`, `parseDeadline`, `parseFundingValue`, `extractTags`, etc.) are copy-pasted from `lib/scrape.ts` into `scripts/run-scrape.mjs` with subtle divergence:
- `DEADLINE_PATTERNS` has 4 patterns in the script vs. 6 in the library
- `FUNDING_PATTERNS` has different ordering
- `parseFundingAmount` is a separate function in one but inlined in the other

Any fix applied to one file will not propagate to the other.

### 4.5 `getDaysUntilDeadline` Returns NaN for Invalid Dates

**File:** `lib/data.ts`, lines 85-89

If `closeDate` is an unparseable string (e.g., `"March 15 2026"` without comma, or a raw markdown fragment), the function returns `NaN`. Callers like `getDeadlineUrgency` compare `NaN <= 7` which is `false`, so invalid dates silently appear as `"safe"`. In `opportunities-public.ts`, `isOpportunityOpen` treats NaN dates as perpetually open.

### 4.6 Category Mapping Hides Correct Data

**File:** `lib/opportunities-public.ts`, line 9

```typescript
entrepreneurship: "fellowship",
```

The scraper inserts records with `category: "entrepreneurship"`. The public layer silently maps this to `"fellowship"`, so entrepreneurship programs appear as fellowships in the UI.

### 4.7 Duration Filter Is Dead Code

The `Opportunity.duration` type is `{ value: number; unit: "weeks" | "months" | "years" }`, but the scrape pipeline stores `duration: null` for ALL records. The duration filter code in `data.ts` (lines 155-196) is complex unit-conversion logic that will never execute because no record has a non-null duration.

### 4.8 Battery Ventures Funding Object Anomaly

Battery Ventures has `funding.amount: 3.8` and `funding.currency: "billion USD"`. The amount is a decimal (unusual) and "billion USD" is not a valid currency code.

---

## SECTION 5: Frontend Issues

### 5.1 Opportunity Detail Page Renders Raw Text

**File:** `app/opportunity/[id]/page.tsx`, line 313

```tsx
<p className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-line">
    {opportunity.fullDescription || opportunity.description}
</p>
```

Since `fullDescription` contains raw markdown/HTML artifacts from the scraper, this renders garbled text directly to users. The `whitespace-pre-line` makes the newlines and tabs in scraped content visible.

### 5.2 Logo Images Use External URLs Without Fallback

The detail page uses `<img>` (not Next.js `<Image>`) for logos, bypassing optimization. External URLs (Google favicons, scraped logo URLs) may break, load slowly, or be low resolution (128px favicons).

### 5.3 Tags Rendered Raw on Detail Page

**File:** `app/opportunity/[id]/page.tsx`, lines 224-235

Tags are rendered directly as uppercase text, so inconsistent tag formats (`"ai"`, `"AI"`, `"pre-seed"`, `"venture capital"`, `"funding_program"`) are all visible to users in their inconsistent forms.

### 5.4 `new Date(closeDate).toLocaleDateString()` Fails on Non-ISO Dates

**File:** `components/features/opportunity-card.tsx`, lines 227-229

When `closeDate` is in natural language format (e.g., `"June 30, 2026"`, `"Jun 28 2026"`), `new Date()` may parse correctly in most browsers but can fail in edge cases, showing "Invalid Date" to users.

---

## SECTION 6: Optimization Opportunities

### 6.1 Data Enrichment (Scraping More Data)

The current dataset has 186 entries, but 93 (50%) have empty eligibility and benefits fields. To make the directory richer:

- **Re-scrape with better queries:** The current Exa queries for `developer_programs` are too broad and pull in blog posts/Wikipedia articles. Tighten queries to target actual program pages.
- **Add a post-scrape enrichment step:** Use an LLM to extract structured data (eligibility, benefits, funding, deadlines) from the raw markdown.
- **Manual curation for top entries:** The top ~50 most popular fellowships should have manually verified descriptions.
- **Add application tips and acceptance rates:** These differentiate a directory from a simple listing.
- **Source from additional platforms:** Devpost, Smash.vc, F6S, and GrantWatch have structured fellowship data.

### 6.2 Performance

- **Sequential Firecrawl calls:** Each Firecrawl scrape is awaited sequentially in `runCategoryScrape`. With 10 results and 15s timeout, this can take 150s per category. Add concurrency with `Promise.allSettled` and a concurrency limit.
- **No retry logic:** A single 429 (rate limit) or 503 causes the entire record to be skipped. Add exponential backoff retries.
- **Export script has no empty-result check:** If Supabase returns 0 rows, it writes an empty JSON file and reports success.

### 6.3 Data Pipeline Improvements

1. **Add a markdown-to-plaintext converter** in the pipeline (e.g., `turndown` + HTML entity decoding + markdown stripping)
2. **Add a content validation step** before insertion -- reject entries where the description is too short, contains cookie policy keywords, or has no program-like content
3. **Normalize dates** to ISO format during scraping
4. **Use the page URL/domain** to infer country (via IP geolocation or domain suffix) instead of language
5. **Extract organizer names** from meta tags or structured data instead of domain fragments
6. **Clean tag taxonomy** -- enforce lowercase, hyphenated format; remove the blanket "ai" keyword matching

---

## SECTION 7: Recommended Action Plan

### Phase 1: Critical Fixes (Do Immediately)

1. Fix the cron endpoint auth bypass
2. Fix the funding regex bugs (k/million/billion multipliers)
3. Fix the country/region inference (use URL domain, not language)
4. Remove the 7 non-opportunity entries and 2 error-page entries from the database
5. Merge the Z Fellows duplicate

### Phase 2: Data Cleanup (1-2 Weeks)

6. Add a markdown-to-plaintext conversion step to `stripHtml`
7. Run a one-time script to clean all 186 entries: decode HTML entities, strip markdown, fix encoding
8. Fix the 55+ entries with garbled Unicode characters
9. Recategorize the 9 misclassified VC firms
10. Clean up tag taxonomy (lowercase, hyphenated, remove false "ai" tags)
11. Fix all truncated/malformed funding amounts
12. Remove expired programs or add a "closed" status
13. Fix the 5 entries with whitespace in names
14. Fix organizer names derived from domain fragments

### Phase 3: Pipeline Hardening (2-4 Weeks)

15. Unify ID generation across all scripts (pick one truncation length)
16. Unify deduplication logic across all ingestion paths
17. Unify the `Opportunity` type definition (single source of truth)
18. Add content validation before database insertion
19. Add retry logic for API failures
20. Add concurrency to Firecrawl calls
21. Increase `maxDuration` for the cron route
22. Consolidate duplicated parsing logic between `scrape.ts` and `run-scrape.mjs`

### Phase 4: Data Enrichment (Ongoing)

23. Re-scrape with tighter Exa queries
24. Add LLM-based post-processing to extract structured fields from raw markdown
25. Manually curate the top 50 most popular fellowship entries
26. Source additional data from Devpost, Smash.vc, F6S, GrantWatch
27. Add application tips, acceptance rates, and alumni outcomes
