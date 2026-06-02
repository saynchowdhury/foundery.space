# Opportunity Scraping Agents

## Completed work

**First batch** (commit `5dd86d6`, deployed): cleaned the opportunity dataset by removing 3 broken scrapes (404 / "PROGRAM OVERVIEW" / "Page Not Found") and converting 55 string-encoded `funding` values into proper `{amount, currency, fundingType}` objects, making ~93 entries usable in the UI. On the code side, added route support for `/entrepreneurship` and `/developer-programs` (both previously 404'd), added a sticky Apply bar on the opportunity detail page, surfaced an Apply button on homepage carousel cards (collapsing the prior two-click flow), and made the browse page read the initial `?q=` search term from the URL. The full audit context lives in `CODEBASE-AUDIT-REPORT.md` at the repo root.

**Second batch** (commits `4d10397` + `80d217d`, deployed): category centralization, real-stats hero, recently-added section, advanced filters drawer, bento rebuild, and detail-page sidebar.
- `lib/categories.ts` — single source of truth: `PRIMARY` (10 canonical), `LEGACY_ALIASES` (developer_programs, entrepreneurship), `toCanonicalCategory()`, `CATEGORY_LABELS` (singular/plural/slug), helpers. Updated all 9 consumer files.
- Hero (server component): "163 open right now" pulse pill, "The directory for ambitious builders" h1, real totals (183 / 163 open), dynamic top-3 category line, quick-link chips with counts. `app/page.tsx` is now async with `revalidate = 600`.
- `lib/home-stats.ts` + `lib/recently-added.ts`: parallel count queries for hero, 30-day window for "Freshly added" landing section (21-row limit).
- `components/ui/sheet.tsx` (Radix Dialog wrapper) + `components/features/more-filters-sheet.tsx` (advanced filters: funding/equity/duration/region/tag/category). `applyFilters()` extended to handle `BrowseFilterState`; active-count badge in filter bar.
- Bento (`components/landing/what-you-get.tsx`): 5 cards in 4-col grid (Discovery/Filtering span 2, Ranking spans 2, Reminders, Refreshed weekly) with hover gradient borders.
- `/opportunity/[id]`: sidebar layout `grid-cols-[1fr_320px]` with sticky Organizer/Funding/Region/Opens/Duration/Tags card + "More like this" cross-link.
- Fix pre-existing build blocker `lib/schema.ts:114` (`organizerUrl` → `applyLink`).
- Drop `developer_programs` from `Opportunity` union (legacy alias resolved via `toCanonicalCategory` at API/display layer).
- `app/robots.ts`: explicit allow rules for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, and 18 other AI crawlers (2026 best practice).
- Build: 1688 pages, 27s. Bundle deltas: `/` 9.6→7.8 kB, `/browse` 6.54→17.4 kB, `/opportunity/[id]` 12→8.55 kB, `/admin/new` 12.6→11.3 kB.

**Marketing docs** (commit `9d549ba`, deployed): 2026 SEO/GEO/AI-citation strategy + launch monitoring in `marketing/`: VISIBILITY-GAMEPLAN, AI-CITATION-PLAYBOOK, ENTITY-SEO-PLAN, SCHEMA-AUDIT, DIRECT-ANSWER-BLOCKS, KEYWORD-MAP, CONTENT-CLUSTER-PLAN, SEO-GEO-STRATEGY, MONITORING-SETUP, PRE-LAUNCH-CHECKLIST.

## Architecture Overview

Two-tier scraping pipeline using **Exa** (semantic discovery) + **Firecrawl** (structured extraction) → validated → ingested into Supabase (`opportunities` table).

```
Orchestrator Agent
  ├── Discovery Agent (Exa)     → finds opportunity URLs per category
  ├── Extraction Agent (Firecrawl) → scrapes structured data from each URL
  ├── Validation Agent           → deduplicates, normalizes, validates
  └── Ingestion Agent            → upserts into Supabase
```

---

## Agent Pipeline

| Step | Agent | Tool | Input | Output | Endpoint / Method |
|---|---|---|---|---|---|
| **1. Schedule** | Orchestrator | Cron / Vercel Cron Jobs | `categories[]` config | Triggers per-category discovery | `GET /api/cron/scrape?category=<cat>` |
| **2. Discover** | Discovery Agent | Exa `/search` (semantic) | `{ query: "<category> opportunities 2026", numResults: 20 }` | `url[]` + page summaries (Exa highlights) | `POST https://api.exa.ai/search` |
| **3. Deep-Discover** | Discovery Agent | Exa `/deep_search` | Same query (follows threads automatically) | `url[]` + reasoning trace | `POST https://api.exa.ai/deep_search` |
| **4. Extract** | Extraction Agent | Firecrawl `/scrape` | `{ url, formats: [markdown, metadata] }` | Structured fields (name, description, dates, funding…) | `POST https://api.firecrawl.dev/v1/scrape` |
| **5. Map Site** | Extraction Agent | Firecrawl `/map` | `{ url: "<domain>" }` | All opportunity URLs on that domain | `POST https://api.firecrawl.dev/v1/map` |
| **6. Batch-Extract** | Extraction Agent | Firecrawl `/batch/scrape` | `url[]` (from map) | Bulk scraped pages | `POST https://api.firecrawl.dev/v1/batch/scrape` |
| **7. Validate** | Validation Agent | Supabase `SELECT` + LLM | Scraped fields + existing DB | Cleaned Opportunity object + dedup verdict | Checks `name` + `organizer` against existing rows |
| **8. Ingest** | Ingestion Agent | Supabase `upsert` | Cleaned Opportunity[] | Rows inserted into `opportunities` | `POST /rest/v1/opportunities` (service_role) |

---

## Category Mapping for Discovery Queries

| Category | Exa Search Query Pattern | Priority | Typical Sources |
|---|---|---|---|
| `fellowship` | `"fellowship" AND ("applications open" OR "apply now") 2026` | High | fellowship directories, foundation sites |
| `accelerator` | `"accelerator" AND ("startup" OR "applications" OR "batch") 2026` | High | YC, Techstars, SOSV, local accelerators |
| `grant` | `"grant" AND ("developers" OR "open source" OR "research") 2026` | High | GitHub, CNCF, foundations |
| `developer_programs` | `"developer program" OR "developer relations" OR "community program" 2026` | Medium | company developer portals |
| `competition` | `("hackathon" OR "coding competition" OR "buildathon") 2026` | Medium | Devpost, HackerEarth, company sites |
| `entrepreneurship` | `("entrepreneurship program" OR "founder program" OR "startup competition") 2026` | Medium | university centers, VC sites |
| `research` | `"research program" OR ("call for papers" AND "grant") 2026` | Medium | academic institutions, labs |
| `venture_capital` | `"venture capital" AND ("rolling applications" OR "apply" OR "funding") 2026` | Medium | VC firm sites, AngelList |
| `incubator` | `"incubator" AND ("applications open" OR "cohort") 2026` | Medium | university incubators, corporate |
| `residency` | `("residency program" OR "artist residency" OR "developer residency") 2026` | Low | foundation/arts sites |

---

## Data Extraction Mapping (Firecrawl → Supabase)

| DB Column | Extraction Strategy | Example CSS/MSA Selector |
|---|---|---|
| `name` | Firecrawl `metadata.title` or first `<h1>` | `h1` |
| `description` | First `<meta[name=description]>` or intro paragraph | `p:first-of-type` |
| `full_description` | Body content (cleaned markdown) | `article` or `main` |
| `category` | Inferred from search query context | — (assigned by Discovery Agent) |
| `region` | Extract from `{country}` → lookup region map | — (derived from country) |
| `country` | Page text or `meta[property=og:locale]` | — |
| `organizer` | Find parent org name in footer/header | `footer a` or `header a[href*=about]` |
| `apply_link` | Find "Apply" / "Register" button/link href | `a[href*=apply], a[href*=register]` |
| `close_date` | Find deadline text (parse relative/natural date) | near "deadline", "closes", "applications due" |
| `open_date` | Near "opens", "applications open" text | — |
| `funding` | Near "funding", "grant amount", "$" amounts | — |
| `eligibility` | Near "who can apply", "eligibility", "requirements" | — |
| `benefits` | Near "benefits", "perks", "what you get" (as array) | — |
| `duration` | Near "duration", "length", "program runs" | — |
| `tags` | Extract keyword phrases + category-derived tags | — |
| `logo_url` | `link[rel=icon]` or OpenGraph image | `meta[property=og:image]` |
| `share_image_url` | OpenGraph image | `meta[property=og:image]` |
| `application_video` | YouTube/Vimeo embed on page | `iframe[src*=youtube], iframe[src*=vimeo]` |

---

## Deduplication Logic (Validation Agent)

| Rule | Method | Action |
|---|---|---|
| **Exact name match** | `LOWER(name) = LOWER(candidate.name)` | Skip (duplicate) |
| **Name + organizer match** | `LOWER(name) = LOWER(candidate.name) AND LOWER(organizer) = LOWER(candidate.organizer)` | Skip (duplicate) |
| **Near-duplicate name** | `similarity(name, candidate.name) > 0.85` (pg_trgm) | Flag for human review |
| **Same URL** | `apply_link = candidate.apply_link` | Skip (duplicate) |
| **Same organizer + close date** | `organizer = candidate.organizer AND close_date = candidate.close_date` | Skip (same program, new window) |

---

## Supabase API (Ingestion)

```
POST /rest/v1/opportunities
Headers: apikey, Authorization: Bearer <service_role>
Body: { name, description, …, tags, …, category }
```

Use **upsert** via `?on_conflict=name` to avoid duplicating same-name opportunities.

```
POST /rest/v1/opportunities?on_conflict=name
```

---

## Configuration

```jsonc
// opencode.json (MCP servers for agents)
{
  "mcpServers": {
    "exa": {
      "type": "url",
      "url": "https://api.exa.ai/mcp",
      "env": { "EXA_API_KEY": "<key>" }
    },
    "firecrawl": {
      "type": "url",
      "url": "https://api.firecrawl.dev/mcp",
      "env": { "FIRECRAWL_API_KEY": "<key>" }
    },
    "supabase": {
      // existing supabase MCP config
    }
  }
}
```

## Env Variables Required

| Variable | Source | Used By |
|---|---|---|
| `EXA_API_KEY` | [exa.ai/dashboard](https://dashboard.exa.ai) | Discovery Agent |
| `FIRECRAWL_API_KEY` | [firecrawl.dev](https://www.firecrawl.dev) | Extraction Agent |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API | Ingestion Agent |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | All agents |

---

## Notes

- **Exa** is used for *semantic discovery* (finding opportunity pages even when you don't know the exact URL) — its ~10B-page neural index and sub-24hr freshness catch newly posted programs.
- **Firecrawl** is used for *extraction* from known URLs — its JS rendering handles modern SPAs that hide content behind JavaScript.
- Validation step uses a lightweight LLM call to normalize free-text fields (e.g. "deadline: March 15, 2026" → ISO date).
- Failed extractions (blocked pages, auth walls) are logged to a `scrape_errors` table for retry with alternative strategies.
