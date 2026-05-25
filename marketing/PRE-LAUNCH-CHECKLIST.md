# Foundery.Space — Pre-Launch & Indexing Checklist

> Production-grade checklist used by engineering teams before launching any SaaS or website.

---

## 1. Domain & DNS

- [x] Domain registered (foundery.space)
- [ ] DNS records configured (A, CNAME, MX, TXT)
- [x] SSL/TLS certificate active (Vercel auto-provisions)
- [ ] `www` subdomain resolves (www.foundery.space)
- [ ] Non-`www` → `www` redirect or vice versa
- [x] Custom domain linked in Vercel project settings
- [ ] DNSSEC enabled (if supported by registrar)
- [ ] SPF/DKIM/DMARC records for sending email (if applicable)

---

## 2. Indexing & Search Console

- [ ] **Google Search Console** — Add property (URL prefix preferred for Vercel)
  - Verify via HTML meta tag in `<head>` (add to layout.tsx)
  - Submit sitemap: `https://foundery.space/sitemap.xml`
  - Monitor coverage report for errors
  - Set up email alerts for manual actions & critical issues

- [ ] **Bing Webmaster Tools** — Add site
  - Import from Google Search Console (quickest)
  - Submit sitemap
  - Configure geo-targeting if needed

- [ ] **IndexNow Protocol** — Notify search engines on content changes
  - Vercel supports this via `_redirects` or custom header
  - Submit URLs: `https://www.bing.com/indexnow` (covers Bing, Yandex, Seznam, Naver)

---

## 3. Analytics & Monitoring

- [ ] **Google Analytics 4 (GA4)** — Property created
  - Measurement ID added to Vercel env vars
  - Events tracked: page_view, opportunity_click, submission, vote
  - Conversions defined (sign-up, opportunity apply)
  - Enhanced measurement enabled (scroll, outbound clicks, site search)
  - Exclude internal traffic (filter your IP)

- [x] **Vercel Analytics** — Already in layout.tsx
- [x] **Vercel Speed Insights** — Already in layout.tsx

- [ ] **Error Tracking** — Configure one:
  - [ ] Sentry (`@sentry/nextjs`)
  - [ ] Highlight.io (free tier)

- [ ] **Uptime Monitoring** — Configure one:
  - [ ] Better Uptime (free tier: 3 monitors)
  - [ ] Pingdom (free tier: 1 monitor)

---

## 4. Performance & Speed (Core Web Vitals)

**Target thresholds:**
- LCP < 2.5s (Largest Contentful Paint)
- INP < 200ms (Interaction to Next Paint)
- CLS < 0.1 (Cumulative Layout Shift)
- TTFB < 800ms (Time to First Byte)

- [ ] PageSpeed Insights — Test homepage AND 3+ opportunity pages
- [ ] Lighthouse audit — Mobile AND Desktop
- [ ] WebPageTest — Run from US, Europe, Asia locations
- [x] Image optimization — Cloudinary + Next/Image
- [x] Font loading — `font-display: swap`, preconnect to Google Fonts
- [x] CDN — Vercel Edge Network
- [x] Preconnect/prefetch — Added for Supabase, Cloudinary, Google Fonts

---

## 5. Technical SEO

### Robots & Crawling
- [x] `robots.txt` — At `/robots.ts`, allows all, disallows `/api/admin/` + `/admin/`

- [x] **XML Sitemap** — Dynamic at `/sitemap.ts`
  - 400+ URLs covering all opportunities, categories, guides, comparisons
  - Submitted to Google Search Console & Bing

- [x] **Canonical URLs** — `https://foundery.space` on all pages
- [ ] **Pagination** — `rel="next"` / `rel="prev"` on paginated lists
- [x] **404 page** — Custom not-found page
- [ ] **500 page** — Custom error page for server errors
- [ ] **Redirects** — Map old/broken URLs to correct locations

### HTML Head
- [x] `<title>` — Foundery.Space — Discover Fellowships, Grants & Startup Opportunities
- [x] `<meta name="description">` — Find and track 100+ tech fellowships...
- [x] `<link rel="canonical">` — On every page
- [x] `<html lang="en">`
- [x] `<meta charset="utf-8">` — Implicit in Next.js

### Structured Data (JSON-LD)
- [x] **Organization** schema — Foundery.Space entity
- [x] **Website** schema — With SearchAction
- [x] **ItemList** schema — For opportunity listings
- [x] **EducationalOccupationalProgram** schema — For opportunity pages
- [x] **FAQ** schema — 5 common questions
- [x] **BreadcrumbList** schema — On opportunity pages
- [ ] Validate all schemas at: https://validator.schema.org/
- [ ] Validate at: https://search.google.com/test/rich-results

---

## 6. Open Graph & Social Cards

- [x] **Open Graph tags** — In layout.tsx
  - `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:site_name`
- [x] **Twitter Cards** — `summary_large_image` with title, description, image
- [x] **Dynamic OG images** — `app/opengraph-image.tsx` via `@vercel/og`
- [x] **Favicon** — `app/icon.tsx` via `@vercel/og`
- [x] **Apple Touch Icon** — `app/apple-icon.tsx` via `@vercel/og`
- [ ] **Test with:**
  - https://www.opengraph.xyz/
  - https://cards-dev.twitter.com/validator
  - https://www.linkedin.com/post-inspector/

---

## 7. Mobile & Cross-Browser

- [ ] Mobile-friendly test: https://search.google.com/test/mobile-friendly
- [x] Touch targets ≥ 48px (shadcn/ui defaults)
- [ ] No horizontal scroll on mobile viewports
- [ ] Font sizes legible (body ≥ 16px recommended)
- [ ] Test on: Chrome, Firefox, Safari, Edge (both desktop & mobile)
- [ ] Test on: iOS Safari, Android Chrome

---

## 8. Security & Headers

- [x] **HTTPS** — Vercel auto-enables
- [ ] **HSTS** — Add via `vercel.json` or Next.js headers
- [ ] **Content Security Policy (CSP)** — Review & set appropriate headers
- [ ] **X-Content-Type-Options** — `nosniff`
- [ ] **X-Frame-Options** — `DENY` (or `SAMEORIGIN` if iframes needed)
- [ ] **Referrer-Policy** — Already set to `origin` in metadata
- [ ] **Dependencies audit** — `pnpm audit`

---

## 9. Content & On-Page SEO

- [ ] **Keyword mapping** — Every page targets 1 primary + 2-3 secondary keywords
- [ ] **Heading hierarchy** — One H1 per page, logical H2 → H3 flow
- [ ] **Internal linking** — Every page linked from ≥1 other page
- [ ] **External links** — Open in new tab, `rel="noopener noreferrer"`
- [x] **Image alt text** — Has `generateAltText` function
- [x] **Descriptive URLs** — Clean, hyphen-separated
- [ ] **Thin content pages** — No pages with < 300 words of unique content
- [ ] **Duplicate content** — No two pages with substantially same content

---

## 10. Backlinks & Authority (First 30 Days)

- [ ] **Submit to directories:**
  - [ ] Bing Webmaster Tools
  - [ ] Crunchbase
  - [ ] AlternativeTo
  - [ ] SaaSHub

- [ ] **Social profiles** — Create/share on:
  - [ ] X/Twitter — Announce launch, share updates
  - [ ] LinkedIn — Company page, share content
  - [ ] GitHub — Public repo with README
  - [ ] Product Hunt — Prepare launch page
  - [ ] Indie Hackers — Post about the journey

---

## 11. Environment & Deployment

- [ ] `.env.local` — Contains correct variables for production
  ```
  NEXT_PUBLIC_APP_URL=https://foundery.space
  NEXT_PUBLIC_APP_BASE_URL=https://foundery.space
  ```
- [x] Vercel project — Connected to Git branch
- [x] Build completes without errors — `pnpm build` passes
- [ ] Lint passes — `pnpm lint` passes
- [x] Production deployment — Works on `foundery.space`
- [ ] Rollback plan — Know how to revert deployment

---

## 12. Monitoring & Alerts (Post-Launch)

**Set up alerts for:**
- [ ] Sudden traffic drops (>50% in 24h)
- [ ] 4xx/5xx error spikes
- [ ] Core Web Vitals regressions
- [ ] Search Console index drops
- [ ] SSL certificate expiry (auto-renew with Vercel)
- [ ] Domain expiry (auto-renew with registrar)
- [ ] Database connection failures

**Weekly checks (first month):**
- [ ] Google Search Console — Coverage report
- [ ] PageSpeed Insights — Score changes
- [ ] Analytics — Traffic sources, top pages
- [ ] Crawl errors — New or recurring
- [ ] llms.txt — Accessible and valid
- [ ] Broken links — Manual spot-check or tool

---

## 13. Accessibility (Legal Compliance)

- [ ] **WCAG 2.1 Level AA compliance** (recommended minimum)
  - [ ] Color contrast ≥ 4.5:1 (normal text)
  - [ ] All images have `alt` text
  - [ ] Form inputs have associated `<label>` elements
  - [ ] Focus indicators visible
  - [ ] ARIA landmarks used correctly
  - [ ] Error messages are descriptive
- [x] **Legal pages** — Privacy Policy (GDPR-compliant) + Terms of Service
  - [ ] Cookie consent banner (if using cookies/analytics)

---

## 14. Launch Sequence

```
Day -14:  Set up all monitoring, analytics, Search Console
Day -7:   Final content audit, fix all SEO issues
Day -3:   Deploy to staging/preview, run full checklist
Day -1:   Remove all `noindex`, deploy to production
Day 0:    Submit sitemap to Search Console, IndexNow
Day +1:   Monitor Search Console, fix any crawl errors
Day +7:   First SEO review, adjust strategy
Day +30:  Full performance review, iterate
```

---

## Quick Reference: URL Checklist

| Resource | URL | Status |
|---|---|---|
| Homepage | https://foundery.space/ | ✅ |
| Sitemap | https://foundery.space/sitemap.xml | ✅ |
| Robots.txt | https://foundery.space/robots.txt | ✅ |
| llms.txt | https://foundery.space/llms.txt | ✅ |
| llms-full.txt | https://foundery.space/llms-full.txt | ✅ |
| OG Image | https://foundery.space/opengraph-image | ✅ (dynamic) |
| Favicon | https://foundery.space/icon | ✅ (dynamic) |
| Apple Icon | https://foundery.space/apple-icon | ✅ (dynamic) |
| Privacy | https://foundery.space/privacy | ✅ |
| Terms | https://foundery.space/terms | ✅ |

---

## Tools Reference

### Free & Essential
| Tool | Purpose | URL |
|---|---|---|
| Google Search Console | Index monitoring, crawl errors | https://search.google.com/search-console |
| Google Analytics 4 | Traffic analytics | https://analytics.google.com/ |
| Google PageSpeed Insights | Core Web Vitals | https://pagespeed.web.dev/ |
| Google Rich Results Test | Schema validation | https://search.google.com/test/rich-results |
| Google Mobile-Friendly Test | Mobile check | https://search.google.com/test/mobile-friendly |
| Bing Webmaster Tools | Bing indexing | https://www.bing.com/webmasters |
| OpenGraph.xyz | Social card preview | https://www.opengraph.xyz/ |
| Schema.org Validator | Schema validation | https://validator.schema.org/ |
| W3C HTML Validator | HTML correctness | https://validator.w3.org/ |
| SecurityHeaders.com | Header audit | https://securityheaders.com/ |
| SSL Labs | SSL audit | https://www.ssllabs.com/ssltest/ |
| GTmetrix | Performance | https://gtmetrix.com/ |
| WebPageTest | Performance deep-dive | https://www.webpagetest.org/ |

---

## Final Verification

Before calling launch complete, run this final sequence:

```bash
# 1. Build check
cd D:\fellow\repo
pnpm build

# 2. Lint check
pnpm lint

# 3. Test llms.txt validation
node D:\fellow\repo\marketing\scripts\update-llms-txt.js

# 4. Check Google Search Console (next day)
# Verify no critical errors in coverage report

# 5. Run lighthouse on 3 pages
# Homepage, one opportunity page, one category page
```

---

## Post-Launch Template (First Email/Action)

After deployment, immediately:
1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools  
3. IndexNow ping with top 10 URLs
4. Test llms.txt at `https://foundery.space/llms.txt`
5. Set up weekly monitoring review
6. Share on social channels
7. Monitor Search Console for 48h for critical errors
