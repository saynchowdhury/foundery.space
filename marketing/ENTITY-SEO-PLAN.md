# Entity SEO Plan for foundery.space (2026)

> Entity SEO = making Foundery.Space a recognized entity in the Knowledge
> Graph + across third-party platforms. AI engines heavily weight entity
> authority when citing sources.

---

## What is Entity SEO?

When you search "Y Combinator" on Google, you see a Knowledge Panel on the
right. That's an entity. When ChatGPT says "according to Y Combinator's
website", it's pulling from an entity it recognizes.

Entity SEO builds these signals:
- **Third-party mentions** (Wikipedia, Crunchbase, G2, etc.)
- **Structured data** (Organization schema with `sameAs`)
- **Brand consistency** (same name, logo, description everywhere)
- **Inbound links from authoritative sites**
- **Social media presence** (Twitter/X, LinkedIn, GitHub)

---

## The 2026 Entity Stack for Foundery.Space

### Tier 1 — Must-Have (Critical for AI Citations)

| Platform | URL Pattern | Status | Action |
|---|---|---|---|
| **Wikipedia** | `en.wikipedia.org/wiki/Foundery.Space` | ❌ Not present | Apply for notability, then create stub |
| **Crunchbase** | `crunchbase.com/organization/foundery-space` | ❌ Not present | Create org profile (free) |
| **LinkedIn Company** | `linkedin.com/company/founderyspace` | ❌ Not present | Create company page |
| **Twitter/X** | `twitter.com/founderyspace` | ❌ Not present | Create account, bio links to site |
| **GitHub Org** | `github.com/founderyspace` | ❌ Not present | Create org (we have code, so this is legit) |
| **Product Hunt** | `producthunt.com/products/foundery-space` | ❌ Not present | Launch on PH (free) |
| **Organization schema** | On our own homepage | ✅ Present | Update with `sameAs` to all above |

### Tier 2 — High-Value

| Platform | URL Pattern | Status | Action |
|---|---|---|---|
| **G2** | `g2.com/products/foundery-space` | ❌ Not present | List as free tool |
| **Capterra** | `capterra.com/p/foundery-space` | ❌ Not present | List as free tool |
| **GetApp** | `getapp.com/products/foundery-space` | ❌ Not present | List as free tool |
| **Indie Hackers** | `indiehackers.com/product/foundery-space` | ❌ Not present | List product |
| **BetaList** | `betalist.com/startups/foundery-space` | ❌ Not present | Submit |
| **Hacker News** | `news.ycombinator.com/show` | ❌ Not present | Show HN post |
| **Substack** | `founderyspace.substack.com` | ❌ Not present | Launch newsletter |
| **YouTube** | `youtube.com/@founderyspace` | ❌ Not present | Optional, only if doing video |
| **Facebook Page** | `facebook.com/founderyspace` | ❌ Not present | Optional |
| **Instagram** | `instagram.com/founderyspace` | ❌ Not present | Optional |

### Tier 3 — Nice-to-Have

| Platform | URL Pattern | Status | Action |
|---|---|---|---|
| **Medium publication** | `medium.com/foundery-space` | ❌ Not present | Republish blog posts |
| **Dev.to** | `dev.to/founderyspace` | ❌ Not present | Cross-post guides |
| **Hashnode** | `hashnode.com/@founderyspace` | ❌ Not present | Cross-post guides |
| **Reddit** | `reddit.com/user/founderyspace` | ❌ Not present | Participate in founder subs |
| **Quora** | `quora.com/profile/foundery-space` | ❌ Not present | Answer funding questions |
| **Stack Overflow** | N/A (off-topic) | — | Skip |
| **Yelp** | N/A (off-topic) | — | Skip |
| **Trustpilot** | `trustpilot.com/review/foundery.space` | ❌ Not present | Optional |
| **Glassdoor** | N/A (off-topic) | — | Skip |
| **AngelList** | `angel.co/company/foundery-space` | ❌ Not present | Create company profile |

### Tier 4 — Authority-Building

| Source | Action | Why |
|---|---|---|
| **.edu links** | Partner with 1–2 university entrepreneurship centers | High authority |
| **.gov links** | Get listed on SBA.gov resource page | High authority |
| **TechCrunch** | Pitch story: "93 fellowships, 73 open" | High authority + traffic |
| **The Verge** | Pitch same story | High authority |
| **Wired** | Pitch same story | High authority |
| **Forbes** | Contribute op-ed as founder | High authority |
| **Hacker News** | "Show HN: I built a free directory of 93 grants..." | High traffic + citations |
| **Reddit r/Entrepreneur** | Helpful post (not spam) | Perplexity loves Reddit |
| **Reddit r/startups** | Helpful post | Same |
| **Reddit r/SaaS** | Helpful post | Same |

---

## Brand Consistency Checklist

The same exact info must appear on every platform. Mismatches confuse AI
engines about the canonical entity.

### Canonical Info (copy-paste to all platforms)

```
Name: Foundery.Space
URL: https://foundery.space
Tagline: Community-ranked directory of fellowships, grants, and accelerators
        for early-stage founders
Description: Foundery.Space is a free, community-ranked directory of 93+
             fellowships, grants, accelerators, incubators, competitions,
             residencies, research programs, and developer programs that
             helps founders discover, track, and apply to non-dilutive
             funding opportunities.
Logo: https://foundery.space/logos/foundery-logo-256.webp
Twitter: @founderyspace
LinkedIn: linkedin.com/company/founderyspace
GitHub: github.com/founderyspace
Founded: 2025
Category: Internet > Directory > Funding
```

### Logo Variants Needed

| Variant | Size | Format | Use |
|---|---|---|---|
| `foundery-logo-32.webp` | 32×32 | webp | Favicon (done) |
| `foundery-logo-64.webp` | 64×64 | webp | OG image (done) |
| `foundery-logo-128.webp` | 128×128 | webp | App icon |
| `foundery-logo-256.webp` | 256×256 | webp | Knowledge Graph (in use) |
| `foundery-logo-512.webp` | 512×512 | webp | App stores (future) |
| `foundery-logo-1024.png` | 1024×1024 | png | High-res (App Store, Crunchbase) |
| `foundery-og-1200x630.png` | 1200×630 | png | OG image (done via app/opengraph-image.tsx) |
| `favicon.ico` | 32×32 | ico | Old browsers (done via app/icon.tsx) |
| `apple-touch-icon.png` | 180×180 | png | iOS home screen (done via app/apple-icon.tsx) |

---

## Wikipedia Notability Test

Wikipedia has strict notability rules for organizations. We need to pass
**at least one** of these before creating a page:

| Test | Current Status | Action |
|---|---|---|
| **Multiple independent media mentions** | ❌ 0 | Pitch TechCrunch, The Verge, Wired |
| **Significant coverage in reliable sources** | ❌ 0 | Same |
| **Listed in a Wikipedia:Notability_(organizations) example** | ❌ | N/A |
| **Major award winner** | ❌ | N/A |
| **Founder notable** | ❌ | Founder needs Wikipedia page first |
| **Frequently cited in academic papers** | ❌ | N/A |

**Path to Wikipedia:**
1. Get **3+ independent media mentions** in 6 months
2. Apply for **Crunchbase** listing (free, instant authority)
3. Build to **1,000 MAU** on the site
4. Get a **subreddit with 500+ members** (r/FounderySpace or similar)
5. Then create a stub with reliable third-party sources

**Current Wikipedia status:** Not eligible. Focus on media coverage first.

---

## Crunchbase Setup (Free)

1. Go to https://www.crunchbase.com/add-company
2. Submit with:
   - Name: Foundery.Space
   - URL: https://foundery.space
   - Description: (use canonical description)
   - Category: Internet > Directory
   - Founded: 2025
   - Headquarters: (your city)
   - Founders: (your name + LinkedIn)
3. Crunchbase editorial team reviews in 2–4 weeks

---

## LinkedIn Company Page

1. Go to https://www.linkedin.com/company/setup/new/
2. Create with:
   - Name: Foundery.Space
   - Tagline: Community-ranked directory of fellowships, grants, and accelerators
   - Industry: Internet
   - Company size: 1–10
3. Post 1/week (cross-post from blog)
4. Engage with founder communities
5. Build to 500+ followers in 90 days

---

## Twitter/X Account

1. Create @founderyspace
2. Bio: "Community-ranked directory of 93+ grants, fellowships, and accelerators for early-stage founders. https://foundery.space"
3. Profile pic: foundery-logo-256.webp
4. Header: og-image.png
5. Post 3–5×/week:
   - New program added
   - Deadline approaching
   - Founder wins
   - Industry news commentary

---

## GitHub Org

1. Create github.com/founderyspace
2. Move our open-source scraper code there (if any)
3. Create repos for:
   - `foundery-space` (main app, if open-sourced)
   - `opportunity-data` (JSON dump of all programs)
   - `awesome-grants` (curated list of grants)

The `opportunity-data` repo is the most valuable — it's a public dataset
that other developers will fork/star, building inbound links.

---

## Product Hunt Launch

1. Build a "launch page" 2 weeks before launch: https://foundery.space/launch
2. Schedule launch on Product Hunt
3. Aim for top 5 of the day
4. Hunters: reach out to 5 top PH hunters 2 weeks ahead
5. Assets needed: 4 screenshots, 1 GIF, 1 logo
6. Pre-promote on Twitter, LinkedIn, Indie Hackers, HN

**Expected outcome:** 1,000+ upvotes, 10,000+ visits, 50+ backlinks

---

## Substack Newsletter

1. Create founderyspace.substack.com
2. Free weekly newsletter: "5 Grants Closing This Week"
3. Cross-promote on site, social, founder communities
4. Goal: 1,000 subscribers in 90 days
5. Substack is heavily cited by AI engines (Tier 2 authority)

---

## SameAs Implementation

After all Tier 1 platforms are set up, update our `Organization` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://foundery.space/#organization",
  "name": "Foundery.Space",
  "url": "https://foundery.space",
  "logo": "https://foundery.space/logos/foundery-logo-256.webp",
  "description": "...",
  "sameAs": [
    "https://en.wikipedia.org/wiki/Foundery.Space",
    "https://crunchbase.com/organization/foundery-space",
    "https://www.linkedin.com/company/founderyspace",
    "https://twitter.com/founderyspace",
    "https://github.com/founderyspace",
    "https://producthunt.com/products/foundery-space",
    "https://founderyspace.substack.com",
    "https://www.youtube.com/@founderyspace",
    "https://www.facebook.com/founderyspace",
    "https://www.instagram.com/founderyspace",
    "https://dev.to/founderyspace",
    "https://hashnode.com/@founderyspace",
    "https://medium.com/foundery-space",
    "https://indiehackers.com/product/foundery-space",
    "https://betalist.com/startups/foundery-space",
    "https://angel.co/company/foundery-space",
    "https://www.g2.com/products/foundery-space",
    "https://www.capterra.com/p/foundery-space",
    "https://www.getapp.com/products/foundery-space"
  ]
}
```

Update `lib/schema.ts` `generateOrganizationSchema` function with this list.

---

## Timeline

| Week | Tasks |
|---|---|
| 1 | Create LinkedIn, Twitter, GitHub, Crunchbase |
| 2 | Launch Product Hunt, BetaList, Indie Hackers |
| 3 | Set up G2, Capterra, GetApp |
| 4 | Launch Substack newsletter |
| 5 | Pitch TechCrunch, The Verge, Wired |
| 6 | Apply to r/Entrepreneur "Founder of the Month" if available |
| 7–8 | Continue media pitching, follow-up on all submissions |
| 9 | Get to 1,000 MAU on site |
| 10 | Build 3 .edu backlinks (university entrepreneurship centers) |
| 11 | Get listed on SBA.gov |
| 12 | Re-evaluate Wikipedia eligibility |

---

## Measurement

Track these monthly:
- Number of third-party mentions (Google Alerts)
- Number of backlinks from DR > 50 (Ahrefs)
- Number of platforms where Foundery.Space has a profile
- Number of social followers (combined)
- Wikipedia page status (if eligible)
- Crunchbase page rank
- LinkedIn follower count
- Twitter follower count

---

## See Also

- `VISIBILITY-GAMEPLAN.md` — Master strategy
- `AI-CITATION-PLAYBOOK.md` — Platform-specific
- `CONTENT-CLUSTER-PLAN.md` — Pillar pages + supporting
- `KEYWORD-MAP.md` — Target keyword clusters
- `SCHEMA-AUDIT.md` — Structured data coverage
