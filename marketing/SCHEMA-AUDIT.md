# Schema Audit for foundery.space (2026)

> Full coverage analysis of JSON-LD structured data on foundery.space.
> Goal: every page has the right schema types for AI engines to understand
> and cite it.

---

## Current Schema Coverage (as of June 2026)

| Page Type | Schema Types Present | Source File | Status |
|---|---|---|---|
| **Homepage** (`/`) | `WebSite` + `Organization` + `SearchAction` | `app/layout.tsx` + `lib/schema.ts` | ✅ Complete |
| **Browse** (`/browse`) | None | — | ❌ Missing `ItemList` |
| **Category** (`/{category}`) | None on most | — | ❌ Missing `CollectionPage` + `BreadcrumbList` |
| **Opportunity detail** (`/opportunity/{id}`) | `EducationalOccupationalProgram` + `BreadcrumbList` + `FAQ` | `app/opportunity/[id]/page.tsx` + `lib/schema.ts` | ✅ Excellent (just updated) |
| **Pillar guides** (`/guide/*`) | None yet | — | ❌ Missing `Article` + `FAQPage` + `BreadcrumbList` |
| **Comparison** (`/compare/*`) | None yet | — | ❌ Missing `Article` + `FAQPage` + `BreadcrumbList` |
| **Blog posts** (`/blog/*`) | None yet | — | ❌ Missing `BlogPosting` + `BreadcrumbList` |
| **About** (`/about`) | None | — | ❌ Missing `AboutPage` + `Organization` |
| **FAQ** (`/faq`) | `FAQPage` (5 Q-A) | `lib/schema.ts` | ⚠️ 5 Q-A — should be 8+ |
| **Methodology** (`/methodology`) | None | — | ❌ Missing `Article` + `BreadcrumbList` |
| **Privacy** (`/privacy`) | None | — | ❌ Should have `WebPage` |
| **Terms** (`/terms`) | None | — | ❌ Should have `WebPage` |
| **For Founders** (`/for-founders`) | None | — | ❌ Missing `WebPage` + `FAQPage` |
| **For Operators** (`/for-operators`) | None | — | ❌ Missing `WebPage` + `FAQPage` |

**Overall coverage: ~15% of pages have proper schema. Target: 90%+.**

---

## Schema Types We Need (Per Page Type)

### Homepage (`/`)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Foundery.Space",
  "url": "https://foundery.space/",
  "description": "...",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://foundery.space/browse?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://foundery.space/#organization",
  "name": "Foundery.Space",
  "url": "https://foundery.space",
  "logo": "https://foundery.space/logos/foundery-logo-256.webp",
  "description": "...",
  "sameAs": [
    "https://twitter.com/founderyspace",
    "https://www.linkedin.com/company/founderyspace",
    "https://github.com/founderyspace"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": "https://foundery.space/browse"
  }
}
```
**Status:** ✅ Already implemented in `lib/schema.ts`

### Browse Page (`/browse`)
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "All Open Programs for Founders",
  "numberOfItems": 73,
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Thing",
        "name": "Y Combinator",
        "url": "https://foundery.space/opportunity/{id}",
        "description": "..."
      }
    }
  ]
}

{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://foundery.space/"},
    {"@type": "ListItem", "position": 2, "name": "Browse", "item": "https://foundery.space/browse"}
  ]
}
```
**Status:** ❌ Not implemented. **Action:** Add to `app/browse/page.tsx`

### Category Page (`/grant`, `/fellowship`, etc.)
```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Grants for Founders",
  "description": "...",
  "url": "https://foundery.space/grant",
  "isPartOf": {"@type": "WebSite", "name": "Foundery.Space"},
  "about": {"@type": "Thing", "name": "Startup Grants"},
  "mainEntity": {
    "@type": "ItemList",
    "name": "Grants",
    "numberOfItems": 17,
    "itemListElement": [...]
  }
}

{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://foundery.space/"},
    {"@type": "ListItem", "position": 2, "name": "Grants", "item": "https://foundery.space/grant"}
  ]
}
```
**Status:** ❌ Not implemented. **Action:** Add to `app/[category]/page.tsx`

### Opportunity Detail (`/opportunity/{id}`) — **Updated June 2026**
```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalProgram",
  "@id": "https://foundery.space/opportunity/{id}#program",
  "identifier": "foundery-space:{id}",
  "name": "Y Combinator",
  "description": "...",
  "url": "https://foundery.space/opportunity/{id}",
  "sameAs": ["https://foundery.space/opportunity/{id}.md"],
  "keywords": "accelerator, san-francisco, equity, saas, b2b",
  "inLanguage": "en",
  "dateModified": "2026-06-15T10:00:00Z",
  "datePublished": "2005-01-01T00:00:00Z",
  "provider": {
    "@type": "Organization",
    "name": "Y Combinator",
    "url": "https://www.ycombinator.com"
  },
  "educationalProgramMode": "classroom and/or distance learning",
  "applicationDeadline": "2026-09-15",
  "applicationStartDate": "2026-06-01",
  "programDuration": "P3M",
  "offers": {
    "@type": "Offer",
    "price": 500000,
    "priceCurrency": "USD",
    "availability": "https://schema.org/ItemAvailabilityInStock",
    "validThrough": "2026-09-15T23:59:00Z",
    "url": "https://www.ycombinator.com/apply"
  }
}

{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://foundery.space/"},
    {"@type": "ListItem", "position": 2, "name": "Accelerators", "item": "https://foundery.space/accelerator"},
    {"@type": "ListItem", "position": 3, "name": "Y Combinator", "item": "https://foundery.space/opportunity/{id}"}
  ]
}

{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "What does Y Combinator offer?", "acceptedAnswer": {"@type": "Answer", "text": "..."}},
    {"@type": "Question", "name": "How much equity does YC take?", "acceptedAnswer": {"@type": "Answer", "text": "..."}},
    {"@type": "Question", "name": "When is the YC deadline?", "acceptedAnswer": {"@type": "Answer", "text": "..."}},
    {"@type": "Question", "name": "How do I apply to YC?", "acceptedAnswer": {"@type": "Answer", "text": "..."}}
  ]
}
```
**Status:** ✅ **Just updated** in `lib/schema.ts` (June 2026)

### Pillar Guides (`/guide/*`)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The 15 Best Startup Grants of 2026",
  "description": "...",
  "image": "https://foundery.space/og-image.png",
  "datePublished": "2026-01-15",
  "dateModified": "2026-06-01",
  "author": {
    "@type": "Organization",
    "name": "Foundery.Space",
    "url": "https://foundery.space"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Foundery.Space",
    "logo": {"@type": "ImageObject", "url": "https://foundery.space/logos/foundery-logo-256.webp"}
  },
  "mainEntityOfPage": "https://foundery.space/guide/best-startup-grants-2026",
  "keywords": "grants, founders, startup funding, non-dilutive"
}

{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://foundery.space/"},
    {"@type": "ListItem", "position": 2, "name": "Guides", "item": "https://foundery.space/guide"},
    {"@type": "ListItem", "position": 3, "name": "Best Startup Grants 2026", "item": "https://foundery.space/guide/best-startup-grants-2026"}
  ]
}

{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "What are the best startup grants in 2026?", "acceptedAnswer": {"@type": "Answer", "text": "..."}},
    ...
  ]
}
```
**Status:** ❌ Not implemented (no pillar guides exist yet). **Action:** Add to all new pillar pages.

### Comparison Pages (`/compare/*`)
Same as Pillar Guides, but with `Article.headline` format:
```
"{Program A} vs {Program B}: Which is Better for [audience]?"
```
**Status:** ❌ Not implemented. **Action:** Add to all new comparison pages.

### Blog Posts (`/blog/*`)
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "5 Grants Closing This Week (June 2026)",
  "description": "...",
  "image": "...",
  "datePublished": "2026-06-10",
  "dateModified": "2026-06-10",
  "author": {"@type": "Organization", "name": "Foundery.Space"},
  "publisher": {"@type": "Organization", "name": "Foundery.Space"},
  "mainEntityOfPage": "https://foundery.space/blog/5-grants-closing-this-week"
}
```
**Status:** ❌ Not implemented. **Action:** Add to all blog posts.

### About / Methodology / For Founders / For Operators
```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About Foundery.Space",
  "description": "...",
  "url": "https://foundery.space/about",
  "isPartOf": {"@type": "WebSite", "name": "Foundery.Space"}
}
```
**Status:** ❌ Not implemented. **Action:** Add to static pages.

---

## Schema Implementation Plan

### Phase 1 (Days 1–7) — Critical
- [x] Update `generateOpportunitySchema` with `dateModified`, `datePublished`, `keywords`, `inLanguage`, `identifier` (done)
- [x] Add `@id` and `sameAs` to all opportunity schemas (done)
- [ ] Add `ItemList` + `BreadcrumbList` to `/browse`
- [ ] Add `CollectionPage` + `BreadcrumbList` to `/[category]`
- [ ] Expand `FAQPage` from 5 → 8 Q-A on `/faq`

### Phase 2 (Days 8–30) — Guides
- [ ] Add `Article` + `BreadcrumbList` + `FAQPage` to first 5 pillar guides
- [ ] Add `Article` + `BreadcrumbList` + `FAQPage` to first 5 comparison pages
- [ ] Add `BlogPosting` + `BreadcrumbList` to all blog posts

### Phase 3 (Days 31–60) — Programmatic
- [ ] Add `CollectionPage` + `BreadcrumbList` to all `/{category}/{audience}` pages
- [ ] Add `CollectionPage` + `BreadcrumbList` to all `/{category}/in/{location}` pages
- [ ] Add `ItemList` schema to dynamic comparison pages

### Phase 4 (Days 61–90) — Polish
- [ ] Add `AboutPage` to /about, /methodology
- [ ] Add `WebPage` to /privacy, /terms, /for-founders, /for-operators
- [ ] Add `author` and `publisher` with `sameAs` to all Article schemas
- [ ] Add `Organization` with full `sameAs` (Twitter, LinkedIn, GitHub, Crunchbase)

---

## Schema Validation

### Tools
- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Schema.org Validator:** https://validator.schema.org/
- **Google Search Console → Enhancements:** Real-time schema reports

### Acceptance Criteria
- All pages pass Google Rich Results Test with 0 errors
- All pages have ≥1 schema type
- All schema is valid JSON-LD (no syntax errors)
- All schema uses 2026-current types (no deprecated)

### How to Test
```bash
# Local validation
curl -s https://foundery.space/opportunity/{id} | grep -o 'application/ld+json' | wc -l
# Should return ≥ 3 (3 schemas per opportunity page)

# Per-page JSON-LD extract
curl -s https://foundery.space/opportunity/{id} | python -c "import sys, re; data = sys.stdin.read(); scripts = re.findall(r'<script type=\"application/ld\+json\">(.+?)</script>', data, re.DOTALL); [print(f'\\n=== Schema {i+1} ===\\n{s}') for i, s in enumerate(scripts)]"
```

---

## AI Engine Schema Preferences

Different engines weight schema differently:

| Engine | Most-Cited Schema Types |
|---|---|
| **ChatGPT** | FAQPage, Article, Organization |
| **Perplexity** | FAQPage, Article, BreadcrumbList |
| **Google AI Mode** | FAQPage, HowTo, Article, BreadcrumbList |
| **Claude** | Article, Organization, BreadcrumbList |
| **Copilot** | FAQPage, Article, Organization |

**Universal truth:** FAQPage + Article + BreadcrumbList is the trifecta. Ship it on every page that has content.

---

## Common Schema Mistakes (We Must Avoid)

| Mistake | Fix |
|---|---|
| Using `Review` on our own pages | Don't. Google penalizes self-reviews. |
| Using `AggregateRating` without verified reviews | Don't. Manual action risk. |
| Marking blog posts as `NewsArticle` when they're evergreen | Use `Article` or `BlogPosting` instead. |
| Missing `@context` | Always include `"@context": "https://schema.org"`. |
| Using schema types that don't exist | Stick to schema.org documented types. |
| Stuffing `keywords` with 50+ terms | Use 5–10 relevant terms. |
| Putting JSON-LD in `<body>` randomly | Put all JSON-LD in `<head>` (Next.js does this via `dangerouslySetInnerHTML` or metadata). |
| Using `sameAs` with wrong-format URLs | Use full canonical URLs only. |
| Mixing `@graph` with top-level types | Pick one approach. We use top-level. |

---

## See Also

- `VISIBILITY-GAMEPLAN.md` — Master strategy
- `CONTENT-CLUSTER-PLAN.md` — Pillar pages + supporting
- `AI-CITATION-PLAYBOOK.md` — Platform-specific
- `DIRECT-ANSWER-BLOCKS.md` — Page-level answer templates
