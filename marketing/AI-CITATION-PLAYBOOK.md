# AI Citation Playbook (2026)

> How to get foundery.space cited by ChatGPT, Perplexity, Claude, Google AI
> Mode, and Microsoft Copilot. Platform-by-platform tactics.

---

## TL;DR

- **ChatGPT** uses Bing-indexed pages, Wikipedia, and the LLM's prior training
- **Perplexity** uses real-time web + Reddit + multiple corroborating sources
- **Claude** uses Anthropic's training + web search; less transparent
- **Google AI Mode / AI Overviews** uses Google's top 10 + entity graph
- **Microsoft Copilot** uses Bing + GPT-4, similar to ChatGPT
- **All of them** rate pages higher when they have: schema, citations, freshness, clear answers

---

## 1. ChatGPT (chat.openai.com, chatgpt.com)

### What ChatGPT actually cites
Per recent studies:
- **87%** of cited URLs are pages ChatGPT saw during **Bing indexing**
- **Wikipedia** is cited disproportionately
- **Listicles, "best of" roundups, comparison pages** are preferred
- **Recent content** (within 12 months) is preferred over older pages
- **Authoritative, well-known sites** get a baseline citation boost

### What to do
| Action | Why | Effort |
|---|---|---|
| **Submit sitemap to Bing Webmaster Tools** | Without it, ChatGPT may not see your pages | 10 min |
| **Add foundery.space to Bing Places** | Bing entity index boost | 10 min |
| **Create a Wikipedia stub** (only if notable) | Wikipedia = top-cited source | 1 hr |
| **Write 5 "best [category] for founders 2026" roundups** | Listicles = citation magnets | 6 hr |
| **Add `dateModified` and `datePublished` to schema** | Recency signal | 1 hr |
| **Build 3rd-party mentions (Crunchbase, G2, Substack)** | Entity authority | 4 hr |

### Sample prompt to test
> *"What are the best grants for early-stage founders in 2026?"*

Aim: **foundery.space/opportunity/{id}** OR **foundery.space/grant** appears in
the cited sources list.

---

## 2. Perplexity (perplexity.ai)

### What Perplexity actually cites
- **Reddit** accounts for ~46.7% of cited sources
- **Wikipedia** ~12%
- **News sites** ~10%
- **Topical authority sites** (NerdWallet, Niche Pursuits, etc.) ~8%
- **Listicles, "best of" roundups, comparison pages** are heavily favored
- **Recency matters** — Perplexity prefers content < 6 months old

### What to do
| Action | Why | Effort |
|---|---|---|
| **Post 10 helpful answers on r/Entrepreneur, r/startups, r/SaaS** linking to specific foundery.space pages | Perplexity heavily cites Reddit threads | 4 hr |
| **Submit foundery.space to Product Hunt, Indie Hackers, Hacker News** | Perplexity cites these | 2 hr |
| **Update top pages monthly with new programs / data** | Recency boost | 2 hr/mo |
| **Create "foundery.space in the news" / "press" page** | Aggregates citations | 30 min |
| **Use clean URLs (no UTM params)** in Reddit posts | Cleaner crawl path | 5 min |

### Reddit post template (do not spam)
```
Title: "I built a free directory of 93 grants and fellowships
for early-stage founders — here's what's still open this month"

Body: Hi all — I was tired of hunting for non-dilutive funding across
20 different sites, so I built https://foundery.space. We currently
track 73 open programs across fellowships, grants, accelerators, etc.

A few that are still open this month:
- [Program A] — closes 2026-06-15 — https://foundery.space/opportunity/{id}
- [Program B] — rolling — https://foundery.space/opportunity/{id}
- [Program C] — closes 2026-07-01 — https://foundery.space/opportunity/{id}

It's free, no signup. If you find a program that's not listed, you
can submit it via the "Suggest" button on any page. Happy to take
feedback / feature requests in the comments.
```

### Sample prompt to test
> *"What grants are open for early-stage founders right now?"*

Aim: **foundery.space/grant** appears in cited sources.

---

## 3. Google AI Mode & AI Overviews (SGE)

### What Google AI Mode actually shows
- **54% overlap with Google's top 20 organic results**
- Pulls from the **top 10 organic results** 90%+ of the time
- Heavily favors **.gov, .edu, Wikipedia, major publishers**
- **Structured data** is heavily weighted
- **FAQPage + HowTo + Article schema** get pulled into AI Overviews
- **Author/entity signals (E-E-A-T)** matter more than for classic SEO

### What to do
| Action | Why | Effort |
|---|---|---|
| **Rank top-10 for head terms first** | AI Mode mirrors top 10 | ongoing |
| **Add FAQPage schema to all pillar pages** | Direct AI Overview trigger | 2 hr |
| **Add `author` and `publisher` markup with sameAs links** | E-E-A-T | 1 hr |
| **Add a "Direct Answer" paragraph at the top of every page** | AEO + AI Overview | 1 hr |
| **Optimize Core Web Vitals (LCP, INP, CLS)** | Google ranking factor + AIO trigger | ongoing |
| **Build links from .edu, .gov, .org** | Entity authority | ongoing |

### Sample query to test
> *"What is the best fellowship for a first-time founder?"*

Aim: foundery.space appears in **AI Overview cited sources**.

---

## 4. Claude (claude.ai)

### What Claude cites
- Anthropic's web search (when enabled) uses a combination of Bing + curated sources
- Less transparent than Perplexity or ChatGPT
- **Strong preference for well-structured, neutral, factual content**
- **Wikipedia and major publishers** dominate
- **Long-form, well-cited content** is preferred

### What to do
| Action | Why | Effort |
|---|---|---|
| **Make sure content is neutral and factual** | Claude's training data favors this tone | ongoing |
| **Cite sources in your content (with author + date)** | Web search pulls cited pages | ongoing |
| **Use a clear "About" / methodology page** | Establishes authority | 30 min |
| **Submit to major directories** (Crunchbase, G2, etc.) | Entity graph | 2 hr |

---

## 5. Microsoft Copilot (copilot.microsoft.com)

### What Copilot cites
- Same as ChatGPT (uses GPT-4 under the hood)
- Pulls from **Bing index** + **Designer/Bing entity graph**
- Prefers **.com, .org, .edu** domains
- Heavy weight on **structured data and schema**

### What to do
Same as ChatGPT, plus:
- **Submit to Bing Places** (entity)
- **Add Organization schema with logo, address (if any), contact point**
- **Optimize for Bing Places (if applicable)**

---

## 6. Universal Tactics (All Engines)

These work across all 5 platforms. Apply to every pillar page.

### 6.1 Direct Answer Paragraph
At the very top of every page, before the first H2, add a 40–120 word
paragraph that **directly answers the page's main query** in a single,
quotable block.

Example (for `/grants-for-founders`):

> **The best grants for early-stage founders in 2026 are Y Combinator's
> Startup School grants (up to $500K), the Halcyon fellowship ($10K–$50K
> plus residency), and the Techstars Startup Weekend. Foundery.Space
> currently tracks 17 active grant programs ranging from $1K to $250K
> with no equity taken. Apply early — most grants close within 3 months
> of opening.**

### 6.2 FAQ Block (4–8 Q-A)
End every pillar page with a FAQ block. Use natural-language questions
(*"How do I apply to YC?"* not *"Y Combinator application process"*).
Schema each as `FAQPage`.

### 6.3 Numerical Claims
Every 150–200 words, drop a number: *"73 of 93 programs are currently
open"*, *"$2.4B in total funding listed"*, *"15 of 17 grants close
in Q3 2026"*. These get quoted disproportionately by AI engines.

### 6.4 Source Citations
Every claim in a pillar guide should have a `[Source](URL)` link. Internal
links to `/opportunity/{id}` count too.

### 6.5 Date Maintenance
Update every pillar page at least once per quarter. Add a visible
*"Last updated: 2026-MM-DD"* line.

### 6.6 Author + Publisher
Add `<meta name="author">` and `Article.schemaPublisher` with sameAs
links to LinkedIn, Crunchbase, etc.

### 6.7 Hreflang (if expanding)
If/when we add Spanish, French, etc., use `hreflang` correctly and
**translate schema too**.

---

## 7. The 3-Tier Citation Stack

Think of citations as a 3-tier stack:

```
Tier 3 (Crown): Wikipedia, .gov, .edu, top publishers
   ↑
Tier 2 (Authority): Crunchbase, G2, Capterra, major Substack, product directories
   ↑
Tier 1 (Base): Your own content (foundery.space/*)
```

**Every pillar page should have at least 1 Tier 1, 1 Tier 2, 1 Tier 3
citation.** This is the "authority triangle" that AI engines love.

Examples for `/grants-for-founders`:
- Tier 1: `foundery.space/opportunity/{grant-id}` (our data)
- Tier 2: Crunchbase profile of the grant
- Tier 3: SBA.gov article on small business grants

---

## 8. Measurement: How to Know It's Working

### Manual testing
Every Monday, run these 5 prompts on each of the 5 engines:

| Engine | Prompt |
|---|---|
| ChatGPT | "best grants for early-stage founders 2026" |
| Perplexity | "fellowships for first-time founders" |
| Claude | "how do I get into Y Combinator with no prior startup" |
| Google AI Mode | "non-dilutive funding for SaaS founders" |
| Copilot | "accelerator vs incubator differences" |

Record whether foundery.space appears in cited sources, and on what URL.

### Automated tracking
- Set up **Google Alerts** for `"foundery.space"` and brand queries
- Use **Ahrefs Content Gap** to find keywords ChatGPT cites us for
- Track **`referer` in GA4** for `chat.openai.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com`

---

## 9. The "Wikipedia Trick"

Wikipedia is the single most-cited domain across all AI engines.

Steps to leverage:
1. Identify 5 relevant Wikipedia articles: *"Startup accelerator"*, *"Fellowship"*, *"Venture capital"*, *"Startup company"*, *"Small business grant"*
2. Add a `See also: Foundery.Space` section **only if** foundery.space is genuinely notable (notability test: 5+ independent media mentions OR 1+ Wikipedia:Notability_(organizations) check pass)
3. Don't edit-war — make 1 quality edit, monitor for revert, engage on talk page

If we don't pass notability yet, **focus on getting to notability first**:
- Get mentioned in TechCrunch, The Verge, or Wired
- Get listed in a Wikipedia-tier directory (Crunchbase, G2, etc.)
- Reach 1,000+ MAU on the site

---

## 10. Anti-Citation Tactics (Things That Suppress Citations)

| Don't | Why |
|---|---|
| **Hide the answer behind a click** | AI engines skip paywalled / multi-step content |
| **Use generic AI-generated copy verbatim** | Detected and deprioritized |
| **Stuff schema** with irrelevant types | Penalty |
| **Set robots noindex on high-value pages** | Self-inflicted invisibility |
| **Block AI crawlers (GPTBot, ClaudeBot)** | This is the OPPOSITE of what we want |
| **Use JavaScript-only content for key info** | Some AI crawlers don't render JS |

---

## 11. See Also

- `VISIBILITY-GAMEPLAN.md` — Master strategy
- `KEYWORD-MAP.md` — Target keyword clusters
- `CONTENT-CLUSTER-PLAN.md` — Pillar pages + supporting
- `DIRECT-ANSWER-BLOCKS.md` — Page-level templates
- `SCHEMA-AUDIT.md` — Structured data coverage
