# Foundery.Space — Visibility Gameplan (2026)

> Master strategy: **SEO + GEO + AEO + AIO** for foundery.space — a curated
> directory of 93+ fellowships, grants, accelerators, and other non-dilutive
> programs for founders. Target: become the canonical answer for queries like
> *"best grants for early-stage founders"*, *"how do I get into Y Combinator"*,
> and *"AI search engines that cite fellowship directories"*.

---

## 1. Mission

Make foundery.space the **first result** for any AI or human asking about
non-dilutive funding for early-stage founders — across Google, Bing, ChatGPT,
Perplexity, Claude, and Google AI Mode.

We are optimizing for three audiences, in this order:

1. **Founders** (the reader) — searching for funding and programs
2. **AI answer engines** (the recommender) — citing our pages
3. **Traditional search engines** (the index) — ranking our pages

---

## 2. The Three Pillars

| Pillar | Goal | Primary Channel | Target Surface |
|---|---|---|---|
| **SEO** (Search Engine Optimization) | Rank top-10 for head terms | Google, Bing | SERP top 10 |
| **GEO** (Generative Engine Optimization) | Get cited by AI answer engines | ChatGPT, Perplexity, Claude, Gemini, AI Mode | Cited sources list |
| **AEO** (Answer Engine Optimization) | Be the direct answer | Featured snippets, FAQ rich results, AI Overviews | Position 0, AIO panel |

These overlap ~80%. The remaining 20% is what we'll engineer in this doc.

---

## 3. 90-Day Execution Plan

### Days 1–14 — Foundation (Do these first, in this order)

| # | Task | Channel | Effort | Impact |
|---|---|---|---|---|
| 1 | Add `meta name="google-site-verification"` to `app/layout.tsx` | SEO | 5 min | High — required to activate GSC |
| 2 | Submit `https://foundery.space/sitemap.xml` to GSC + Bing Webmaster | SEO | 10 min | High — fastest indexing |
| 3 | Add GA4 Measurement ID as `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var | SEO | 10 min | High — needed before any analysis |
| 4 | Run the RLS SQL fix on Supabase (see `PRE-LAUNCH-CHECKLIST.md`) | Tech | 5 min | Critical — security/data |
| 5 | Deploy the 3 new `app/*-image.tsx` files (opengraph, icon, apple-icon) | GEO | 0 (commit+push) | High — fixes 404 OG image |
| 6 | Register on IndexNow (instant-index API) | SEO | 10 min | Medium — faster indexing |
| 7 | Create 5 Reddit answers linking to foundery.space (no spam — see playbook) | GEO | 60 min | High — Perplexity cites Reddit 46.7% |
| 8 | Add foundery.space to Crunchbase, G2, Product Hunt as a *resource* | GEO | 30 min | Medium — entity authority |

### Days 15–45 — Build Citation Surface

| # | Task | Channel | Effort | Impact |
|---|---|---|---|---|
| 9 | Publish 5 "pillar" guides: `/guide/y-combinator`, `/guide/grants-for-founders`, `/guide/best-accelerators`, `/guide/grant-writing`, `/guide/ai-citation` | SEO+GEO | 4–6 hr | Very High — 5× traffic in 6 months |
| 10 | Add `FAQPage` JSON-LD to all 5 pillar pages (4–8 Q-A per page) | AEO | 2 hr | High — 3–4× more citations |
| 11 | Add a **Direct Answer block** (40–120 words) to top of every pillar page | AEO | 1 hr | High — required for AEO |
| 12 | Create 5 "comparison" pages: `/compare/y-combinator-vs-techstars`, `/compare/grind-vs-yc`, etc. | SEO+GEO | 4 hr | High — high-intent traffic |
| 13 | Add `Article` schema + `dateModified` to all dynamic pages | AEO | 1 hr | Medium — freshness signal |
| 14 | Add `BreadcrumbList` schema to all category & opportunity pages | SEO | 1 hr | Medium — SERP CTR boost |
| 15 | Create a Notion / Airtable of 100 manual citations: Reddit, Quora, Indie Hackers, LinkedIn, HN, Substack | GEO | 4 hr | Very High — 3rd-party corroboration |
| 16 | Add foundery.space to Wikipedia's *"List of startup accelerators"* or create a stub | GEO | 1 hr | Very High — ChatGPT heavily cites Wikipedia |
| 17 | Set up a Brand Mention alert (Mention.com free tier or Google Alerts) | GEO | 10 min | Ongoing — track citations |

### Days 46–90 — Compound & Measure

| # | Task | Channel | Effort | Impact |
|---|---|---|---|---|
| 18 | Publish 1 pillar guide/week (12 total by day 90) | SEO+GEO | 12 hr | High — compound traffic |
| 19 | Add comparison pages: 2/week (24 total) | SEO | 16 hr | High — long-tail |
| 20 | Add 100 opportunities to the directory (use the scraping pipeline) | SEO | 10 hr | High — internal link density |
| 21 | Add `Article` schema with author markup to all guides | AEO | 2 hr | Medium — E-E-A-T signal |
| 22 | Submit to Capterra, G2, GetApp as a free tool | GEO | 30 min | Medium — ChatGPT cites these |
| 23 | Publish on Product Hunt (aim for top 5 of the day) | GEO | 4 hr | Very High — citation fuel |
| 24 | Launch a free weekly newsletter (Substack): "5 grants closing this week" | GEO | 4 hr | High — repeat citations |
| 25 | Pitch 5 journalists (TechCrunch, The Verge, Wired) with a story: *"93 fellowships, 73 open"* | GEO | 4 hr | Very High — 1 article = 100s of citations |

---

## 4. The 5 Citation Factors (Apply to Every Page)

Every page on foundery.space must score high on these 5 factors. This is the
"AI Citation Quality Score" we'll use internally.

### Factor 1 — Extractability
AI crawlers should be able to read every page as plain text. ✅ **We already
have this** via the `.md` content negotiation.

**Action**: Verify all 5 pillar guides return valid markdown via `*.md` URLs.

### Factor 2 — Evidence (with citations)
Every claim should be backed by a real-world reference: a YC blog post, a
Crunchbase page, an official program page.

**Action**: All pillar guides need ≥3 external citations with hyperlinks.

### Factor 3 — Structure
Use H2 → H3 → paragraph, lists, and tables. **No walls of text**.

**Action**: All pillar pages audited for H2 every 200–300 words.

### Factor 4 — Authority
Be the recognized entity. LinkedIn Crunchbase, G2, Wikipedia, product
directories, and partner links all count.

**Action**: See Day 1–14 task #8 and Day 15–45 task #15.

### Factor 5 — Machine-Readability
JSON-LD, sitemaps, robots.txt, llms.txt, structured data everywhere.

**Action**: Audit `lib/schema.ts` — done in `SCHEMA-AUDIT.md`.

---

## 5. Metrics That Matter (Track These, Not Vanity)

| Metric | Tool | Target by Day 90 |
|---|---|---|
| **Indexed URLs in GSC** | GSC | 1,000+ |
| **Total clicks (GSC, 30-day)** | GSC | 5,000+ |
| **AI referral traffic** | GA4 (referral = chat.openai.com, perplexity.ai, claude.ai) | 200+/month |
| **Top 3 SERP rankings for** `grants for founders`, `fellowships for startup founders`, `best accelerators 2026` | Ahrefs WT / Semrush | 5+ keywords in top 3 |
| **Brand mentions on third-party sites** | Brand24 / Mention.com | 20+ |
| **Backlinks from DR > 70** | Ahrefs | 10+ |
| **Citation rate in ChatGPT for "best grants for early-stage founders"** | Manual | 1+ citation |
| **LCP (Largest Contentful Paint)** | PageSpeed Insights | < 2.0s on mobile |
| **CLS (Cumulative Layout Shift)** | PageSpeed Insights | < 0.1 |

---

## 6. Anti-Patterns (Don't Do These)

| Don't | Why |
|---|---|
| Stuff keywords | AI engines detect and downrank |
| Use AI-generated content verbatim | Google Helpful Content penalty + duplicate detection |
| Buy backlinks | All major engines detect; risks manual penalty |
| Use hidden text (white-on-white, `display:none`) | Manual penalty |
| Spammy directory submissions (1,000 low-DR links) | Treated as link spam |
| Gate everything behind login | Crawlers can't see gated content |
| Use canonicals incorrectly (`/foo` → `/bar` for every page) | Confuses engines about which page is canonical |
| Set `noindex` on your own money pages | Self-inflicted invisibility |

---

## 7. The Foundery.Space Advantage

We're not just another "best grants" listicle. Our moats:

1. **Community voting** — unique signal; we own this data
2. **Live data** — scrape pipeline keeps it current
3. **Markdown content negotiation** — AI-first serving
4. **9 categories** — broader than any competitor
5. **3rd-party verifiability** — every program links to its source

These are our levers. Use them in copy, schema, and link building.

---

## 8. Owner & Cadence

| Owner | Role | Cadence |
|---|---|---|
| Product | Pillar content, schema updates | Weekly |
| Growth | Backlinks, citations, PR | Bi-weekly |
| Eng | Performance, indexing, scraping | Continuous |
| Marketing | Brand mentions, social, newsletter | Daily |

---

## 9. See Also

- `AI-CITATION-PLAYBOOK.md` — Platform-specific (ChatGPT, Perplexity, Claude, AI Mode)
- `KEYWORD-MAP.md` — Target keyword clusters and intent
- `CONTENT-CLUSTER-PLAN.md` — Pillar pages + supporting article plan
- `DIRECT-ANSWER-BLOCKS.md` — Page-level 40–120 word answer templates
- `SCHEMA-AUDIT.md` — Full structured data coverage analysis
- `SEO-GEO-STRATEGY.md` — Original 6-month strategy (now superseded by this doc for execution)
- `MONITORING-SETUP.md` — Tracking + alerts
- `PRE-LAUNCH-CHECKLIST.md` — Final pre-deployment audit
