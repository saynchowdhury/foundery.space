# Direct Answer Blocks for foundery.space (2026)

> The **Direct Answer Block** is a 40–120 word paragraph at the top of every
> pillar page that directly answers the page's main query. This is the
> single highest-leverage AEO tactic — AI engines prefer pages where the
> answer is the FIRST thing the crawler sees.

---

## Template

```markdown
# {Page Title}

> {Direct Answer — 40–120 words, conversational, factual, mentions numbers}

{Optional: small disclaimer or context}

## {First H2}
...
```

---

## Why It Works

| AI Engine | How it uses the Direct Answer |
|---|---|
| **ChatGPT** | Often pulls the first sentence verbatim for "what is X" queries |
| **Perplexity** | Uses it as the snippet above the cited sources |
| **Google AI Mode** | Pulls it into the AI Overview box |
| **Claude** | Uses it as the synthesis starting point |
| **Microsoft Copilot** | Same as ChatGPT |

The block should:
1. **Answer the page's main query** in 1–3 sentences
2. **Mention at least 1 specific number** (counts, dates, amounts)
3. **Cite at least 1 internal link** to a relevant opportunity or category
4. **Be conversational** — not stilted or marketing-speak
5. **Be 40–120 words** — long enough to be useful, short enough to quote
6. **Avoid filler** like "Welcome to..." or "In this article..."

---

## Block Templates by Page Type

### 1. Category Page (e.g., `/grant`)

```
Grants for early-stage founders in 2026 are non-dilutive funding awards
from $1K to $250K that don't require equity. Foundery.Space currently
tracks 17 active grant programs, with 12 still open for applications
in Q2 2026. Top options include Y Combinator's Startup School grants
($500K), the Halcyon fellowship ($10K–$50K plus residency), and the
SBA's small business innovation grants ($50K–$250K). Most grants close
within 3 months of opening, so timing matters.
```

**Word count:** 75
**Numbers used:** 17, 12, Q2 2026, $500K, $10K–$50K, $50K–$250K, 3 months
**Internal links to insert:** `[Y Combinator's Startup School](/opportunity/{id})`, `[Halcyon](/opportunity/{id})`, `[all 17 grants](/grant)`

### 2. Pillar Guide (e.g., `/guide/best-startup-grants-2026`)

```
The 15 best startup grants of 2026 are Y Combinator's Startup School
($500K), Halcyon ($10K–$50K), Techstars Startup Weekend ($50K), Google
for Startups Black Founders Fund ($100K), the SBA SBIR program
($50K–$250K), the Roddenberry Foundation ($15K), IndieBio's Pioneer
program ($25K), the WeFunder Open Fund ($50K), the AAPI-focused
Goldhouse ($25K), and 6 more. Of these, 11 are open for applications
as of June 2026. Most take 4–8 weeks to apply and have acceptance rates
between 5% and 20%. We've vetted all 15 below.
```

**Word count:** 90
**Numbers used:** 15, 2026, $500K, $10K–$50K, $50K, $100K, $50K–$250K, $15K, $25K, $50K, $25K, 6, 11, June 2026, 4–8 weeks, 5%, 20%
**Internal links:** all 15 grant opportunities

### 3. Comparison Page (e.g., `/compare/y-combinator-vs-techstars`)

```
Y Combinator and Techstars are the two most-cited startup accelerators
in the world. YC takes 7% equity for $500K, runs 2 batches per year
(winter + summer), and is based in San Francisco. Techstars takes
~6%–10% equity for $20K–$120K, runs 50+ batches per year worldwide,
and is more mentorship-driven. YC is harder to get into (1.5%–3%
acceptance) than Techstars (~5%–10%). For first-time founders with
a B2B SaaS, YC is usually the better fit. For consumer or hardware,
Techstars often wins.
```

**Word count:** 90
**Numbers used:** 7%, $500K, 2, 6%–10%, $20K–$120K, 50+, 1.5%–3%, 5%–10%
**Internal links:** `/guide/y-combinator`, `/guide/techstars`, `/accelerator`

### 4. How-To Page (e.g., `/guide/y-combinator`)

```
Y Combinator is a 3-month accelerator based in San Francisco that
invests $500K for 7% equity, plus an additional $375K on a post-money
SAFE. Founded in 2005, YC has funded 4,000+ companies including
Airbnb, Stripe, and Reddit. To get in: (1) apply on ycombinator.com
during the open window (typically 2× per year), (2) write a 1-page
application with a clear problem, traction, and team, (3) interview
with a YC partner (10-minute video call), and (4) accept within 24
hours if selected. Acceptance rate is roughly 1.5%–3%. Apply 2–3
months before your batch target.
```

**Word count:** 105
**Numbers used:** 3-month, $500K, 7%, $375K, 2005, 4,000+, 1-page, 10-minute, 24 hours, 1.5%–3%, 2–3 months
**Internal links:** YC opportunity page, related accelerators

### 5. Programmatic Page (e.g., `/grant/women`)

```
Grants for women founders in 2026 include 11 active programs totaling
$2.4M in available funding. Top options are the Halcyon fellowship
($10K–$50K), the Female Founders Fund ($50K–$250K), the Womensnet
Amber Grant ($10K monthly), and the SoGal Foundation Black Girl
Ventures grant ($10K). Of these, 8 are open for applications as of
June 2026. Most take 30–60 days to apply, and acceptance rates
average 8%–15%. Foundery.Space tracks all 11 below, with deadlines,
eligibility, and apply links.
```

**Word count:** 88
**Numbers used:** 11, 2026, $2.4M, $10K–$50K, $50K–$250K, $10K, 8, June 2026, 30–60 days, 8%–15%
**Internal links:** all 11 grants

### 6. Opportunity Detail (e.g., `/opportunity/{id}`)

```
Y Combinator is a 3-month, San Francisco–based accelerator that
invests $500K for 7% equity, plus a $375K post-money SAFE. Founded
in 2005, YC has funded 4,000+ companies including Airbnb, Stripe,
Coinbase, and Reddit. Applications open twice a year (typically
September and March) and close 3–4 months later. Foundery.Space
tracks 3 related YC programs. Last verified June 2026.
```

**Word count:** 68
**Numbers used:** 3-month, $500K, 7%, $375K, 2005, 4,000+, 2, 3–4 months, 3, June 2026
**Internal links:** 3 related YC programs

### 7. FAQ-Only Page (e.g., `/faq`)

```
Foundery.Space is a free, community-ranked directory of 93+
fellowships, grants, accelerators, and other non-dilutive funding
opportunities for early-stage founders. We currently track 73
programs that are open for applications. All programs are vetted
by the community, ranked by transparent voting, and updated
continuously. Browse all programs at /browse, or filter by category
(fellowship, grant, accelerator, incubator, competition, residency,
research, developer-program, venture-capital).
```

**Word count:** 70
**Numbers used:** 93+, 73
**Internal links:** `/browse`, all 9 categories

---

## Checklist for Every Page

When writing a new pillar page, ensure the Direct Answer block:

- [ ] Is **40–120 words** (use word count tool)
- [ ] Is the **first content** after the H1 (before the first H2)
- [ ] **Answers the page's main query** directly
- [ ] Includes **at least 1 specific number** (count, date, dollar amount)
- [ ] Mentions **Foundery.Space** by name (when appropriate)
- [ ] **Links to at least 1 internal page** (anchor text, not raw URL)
- [ ] Uses **conversational tone** (read aloud — sounds natural)
- [ ] **Avoids filler** like "Welcome to...", "Let's dive in", "In this article"
- [ ] **Avoids superlatives** like "the best", "the ultimate" (let the data speak)
- [ ] **Cites a date** when freshness matters (e.g., "as of June 2026")

---

## AI Engine–Specific Tweaks

| Engine | Tweaks |
|---|---|
| **ChatGPT** | Use simple, declarative sentences. Avoid idioms. |
| **Perplexity** | Lead with a clear factual claim. Add 1–2 numerical specifics. |
| **Google AI Mode** | Mirror Google's "snippet" style — definition + list. |
| **Claude** | Long-form is fine. Add nuance. Cite source explicitly. |
| **Copilot** | Same as ChatGPT (uses GPT-4). |

---

## Block-Writing Workflow

For each new pillar page:

1. **Identify the main query** the page targets
2. **Search Perplexity / ChatGPT** for the answer they currently give
3. **Write the block** to be MORE specific, MORE current, MORE quantified
4. **Add 1–2 numerical claims** (counts, dates, amounts)
5. **Add 1–2 internal links** to relevant opportunities
6. **Word count check** (40–120 words)
7. **Read aloud check** (sounds natural)
8. **Schema link** to a FAQ block below

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Block is too long (>120 words) | Cut. AI engines truncate anyway. |
| Block is too short (<40 words) | Add 1 numerical claim and 1 internal link. |
| Block is generic | Add specifics: dates, counts, dollar amounts. |
| Block is marketing-speak | Replace "ultimate", "best in class" with facts. |
| Block is at the bottom | Move to TOP, right after the H1. |
| Block has no internal link | Add at least 1 to a relevant opportunity or category. |
| Block has no number | Add a count, date, or dollar amount. |

---

## See Also

- `VISIBILITY-GAMEPLAN.md` — Master strategy
- `KEYWORD-MAP.md` — Target keyword clusters
- `CONTENT-CLUSTER-PLAN.md` — Pillar pages + supporting
- `AI-CITATION-PLAYBOOK.md` — Platform-specific
- `SCHEMA-AUDIT.md` — Structured data coverage
