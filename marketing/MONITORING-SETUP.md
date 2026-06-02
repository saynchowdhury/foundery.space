# Foundery.Space SEO & GEO Monitoring Setup

> **Note (June 2026):** This is the original monitoring doc. The full
> AI-citation-aware tracking flow is now integrated into
> `VISIBILITY-GAMEPLAN.md` § "Metrics That Matter". This file remains the
> operational reference for GA4 events, GSC alerts, and the cadence.

## Overview
This document outlines the monitoring setup for tracking SEO and GEO performance metrics for Foundery.Space.

## Key Metrics to Track

### SEO Metrics
1. **Organic Traffic**
   - Sessions from organic search
   - Organic click-through rate (CTR)
   - Average position for target keywords
   - Top landing pages from organic search

2. **Keyword Rankings**
   - Target keyword positions (track 20-30 core keywords)
   - Visibility score (% of keywords in top 3, top 10)
   - New keyword discoveries
   - Keyword movements (gainers/losers)

3. **Technical Health**
   - Crawl errors (Google Search Console)
   - Indexing issues (pages indexed vs. submitted)
   - Core Web Vitals (LCP, INP, CLS)
   - Mobile usability issues
   - HTTPS/security issues

4. **Engagement & Conversion**
   - Bounce rate (organic traffic)
   - Time on page
   - Pages per session
   - Conversion rate (to opportunity clicks, submissions)
   - Exit pages

### GEO/AEO Metrics
1. **llms.txt Performance**
   - llms.txt fetch rate (if trackable via server logs)
   - llms.txt validity (monthly validation)
   - llms-full.txt fetch rate

2. **AI Referral Traffic**
   - Traffic from known AI crawlers/user agents
   - Referrals from AI platforms (if identifiable)
   - Brand mentions in AI responses (manual tracking)

3. **Content Performance in AI Contexts**
   - Citation frequency in public content
   - Usage in educational/research materials
   - References in news/articles

### 2026 Addendum — AI-Specific Tracking

Per `AI-CITATION-PLAYBOOK.md`, we now track these AI-specific signals:

**4. AI Crawler Hits (Server Log Analysis)**
Set up a log drain (Vercel Log Drains → Datadog/Axiom) to count hits from:
- `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` (OpenAI)
- `ClaudeBot`, `Claude-User`, `Claude-SearchBot` (Anthropic)
- `PerplexityBot`, `Perplexity-User`
- `Google-Extended`
- `Applebot-Extended`
- `Bytespider`, `CCBot`, `cohere-ai`, `Diffbot`, `FacebookBot`, `YouBot`

Target by Day 90: ≥ 1,000 AI crawler hits/month.

**5. AI Referral Traffic (GA4)**
Filter `Session source` containing:
- `chat.openai.com`, `chatgpt.com`
- `perplexity.ai`
- `claude.ai`
- `gemini.google.com`
- `copilot.microsoft.com`
- `you.com`
- `phind.com`
- `poe.com`

Target by Day 90: ≥ 200 AI referral sessions/month.

**6. Brand Mention Volume (Mention.com / Brand24 / Google Alerts)**
Track "Foundery.Space" mentions across:
- Reddit, Hacker News, Indie Hackers, Product Hunt
- LinkedIn, Twitter/X
- Substack, Medium, Dev.to
- YouTube transcripts (podcast mentions)
- Crunchbase, G2, Capterra

Target by Day 90: ≥ 20 distinct third-party mentions.

**7. Manual Citation Testing (Weekly)**
Test these 5 prompts on 5 engines, every Monday:

| Engine | Prompt |
|---|---|
| ChatGPT | "best grants for early-stage founders 2026" |
| Perplexity | "fellowships for first-time founders" |
| Claude | "how do I get into Y Combinator with no prior startup" |
| Google AI Mode | "non-dilutive funding for SaaS founders" |
| Copilot | "accelerator vs incubator differences" |

Record: (a) is foundery.space cited, (b) which URL, (c) ranked position in cited sources.

## Implementation

### 1. Google Search Console Setup
- Verify property: https://foundery.space
- Submit sitemap: https://foundery.space/sitemap.xml
- Enable email alerts for:
  - Manual actions
  - Security issues
  - Crawl errors increase
  - Indexing issues

### 2. Google Analytics 4 Setup
- Ensure GA4 is properly implemented (already in layout.tsx via @vercel/analytics)
- Create custom reports for:
  - Organic search performance
  - Opportunity page engagement
  - Conversion funnels
  - Geographic performance

### 3. Rank Tracking
Use a rank tracking tool (free options to start):
- Manual tracking in Google Sheets for top 20 keywords
- Weekly checks using SERP simulators or incognito search
- Consider affordable tools like:
  - SERProbot (free tier available)
  - AccuRanker (trial available)
  - Nightwatch (tiered pricing)

### 4. Technical Monitoring
- **PageSpeed Insights**: Monthly automated checks
  - Homepage
  - Category pages (fellowship, grant, accelerator)
  - Sample opportunity pages
- **Schema Validation**: Monthly
  - Use Google's Rich Results Test
  - Validate opportunity pages
  - Validate FAQ/schema implementations
- **llms.txt Validation**: Monthly
  - Check accessibility: https://foundery.space/llms.txt
  - Validate format against spec
  - Verify all URLs return 200
  - Check for broken links

### 5. Custom Tracking
Add these to track specific behaviors:

#### Opportunity Click Tracking
```typescript
// Add to opportunity card click handler
const trackOpportunityClick = (opportunityId: string) => {
  // Track in analytics
  window.gtag?.('event', 'opportunity_click', {
    opportunity_id: opportunityId,
    opportunity_name: opportunity.name,
    category: opportunity.category,
    value: 1
  });
};
```

#### Submission Tracking
```typescript
// Add to form submission
const trackSubmission = () => {
  window.gtag?.('event', 'opportunity_submission', {
    opportunity_id: opportunityId,
    value: 1
  });
};
```

#### llms.txt Fetch Tracking (if using custom server)
```typescript
// In API route or middleware
app.get('/llms.txt', (req, res) => {
  // Track the request
  window.gtag?.('event', 'llms_txt_fetch', {
    user_agent: req.get('User-Agent'),
    referrer: req.get('Referrer')
  });
  
  // Serve file
  res.sendFile(path.join(__dirname, 'llms.txt'));
});
```

## Reporting Schedule

### Daily Checks
- Google Search Console alerts
- Site uptime and accessibility
- Critical error logs

### Weekly Reports
- Organic traffic trends
- Keyword position changes (top 10)
- Technical health summary
- Content performance (top pages)

### Monthly Deep Dive
- Comprehensive SEO audit report
- Keyword research update
- Backlink profile analysis
- Content gap analysis
- Competitive positioning
- GEO/AEO performance review
- llms.txt and llms-full.txt validation
- Technical SEO health check
- Conversion rate optimization opportunities

## Tools & Resources

### Free Tools
- Google Search Console
- Google Analytics 4
- PageSpeed Insights
- Rich Results Test
- Mobile-Friendly Test
- Schema.org Validator
- Ubersuggest (limited free)
- AnswerThePublic (limited free)

### Paid Tools Consideration (as budget allows)
- Ahrefs or SEMrush (comprehensive SEO suite)
- Screaming Frog (technical audits)
- Sitebulb (technical audits)
- MarketMuse (content optimization)
- Surfer SEO (content optimization)

## Alert Thresholds
Set up notifications when:
- Organic traffic drops >20% week-over-week
- >10% of target keywords drop 10+ positions
- Core Web Vitals fail thresholds for >25% of pages
- Crawl errors increase >50% week-over-week
- Indexing rate drops below 90% of submitted pages
- llms.txt becomes inaccessible or invalid

## Continuous Improvement Process
1. **Measure**: Collect data consistently
2. **Analyze**: Identify trends, issues, opportunities
3. **Optimize**: Implement changes based on insights
4. **Test**: A/B test where applicable
5. **Review**: Measure impact of changes
6. **Repeat**: Ongoing cycle

## Success Indicators
- Steady month-over-month growth in organic traffic
- Improving average position for target keywords
- Decreasing bounce rate, increasing engagement
- Growing number of ranking keywords
- Improved Core Web Vitals scores
- Valid and accessible llms.txt/llms-full.txt
- Positive ROI from SEO efforts (measured via conversions)

This monitoring setup will provide the data needed to continuously improve Foundery.Space's search visibility and AI discoverability.
