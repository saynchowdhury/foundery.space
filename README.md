# Foundery.Space

The community-ranked directory for ambitious founders, researchers, and builders.
Discover fellowships, grants, accelerators, incubators, competitions, residencies,
research programs, and developer programs — ranked by the community, tracked by deadline.

**Live:** [foundery.space](https://foundery.space)

---

## Features

- **9 categories** — Fellowships, Accelerators, Incubators, Grants, Developer Programs, Competitions, Residencies, Research, Venture Capital
- **Community voting** — upvote/downvote to surface the best programs
- **AI-powered search** — semantic search via Kimi K2 with text fallback
- **Deadline tracking** — calendar export (Google, Outlook, Apple, Yahoo)
- **1000+ SEO guide pages** — dynamically generated from opportunity data
- **LLM-friendly** — `llms.txt` + `llms-full.txt` + markdown content negotiation
- **Admin dashboard** — token-protected CRUD with Firecrawl + LLM import

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | TailwindCSS 3 + shadcn/ui |
| Font | DM Sans (variable, optical sizing) |
| Database | Supabase (PostgreSQL) |
| AI Search | Kimi K2 via custom endpoint + Groq fallback |
| Scraping | Firecrawl (admin import) |
| Images | Cloudinary |
| Deployment | Vercel |
| Analytics | Vercel Analytics + Speed Insights |
| Bot protection | BotID |

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy env template and fill in values
cp .env.example .env.local

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See `.env.example` for all required variables. The minimum to run locally:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://foundery.space
NEXT_PUBLIC_APP_BASE_URL=https://foundery.space
```

**Critical:** Both localhost and Vercel production must use the **same** Supabase project.
The startup validator (`lib/env-check.ts`) will log a warning if they differ.

## Project Structure

```
app/
  [category]/       # 1000+ dynamic SEO guide pages
  api/              # All API routes
  browse/           # Main listing page
  opportunity/[id]/ # Individual opportunity pages
  admin/            # Token-protected admin dashboard
components/
  features/         # OpportunityCard, InfiniteCarousel, GuideContent
  global/           # Header, Footer, SearchInput
  landing/          # HeroSection, CarouselSection, WhatYouGet
lib/
  supabase.ts       # Lazy Supabase client (anon + service role)
  env-check.ts      # Startup env validator
  schema.ts         # JSON-LD structured data generators
  guide-generator.ts # Dynamic SEO guide config generator
public/
  llms.txt          # AI/LLM discovery file
  llms-full.txt     # Comprehensive AI citation guide
```

## Admin

Access the admin dashboard at `/admin?token=YOUR_ADMIN_TOKEN`.

Set `ADMIN_TOKEN` in your environment variables. The token is required for all
`/admin` and `/api/admin/*` routes.

## Deployment

The project deploys automatically to Vercel on push to `main`.

Required Vercel environment variables (set in Vercel Dashboard → Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_BASE_URL`
- `ADMIN_TOKEN`
- `LLM_API_KEY` (optional — for AI search)
- `GROQ_API_KEY` (optional — AI search fallback)
- `FIRECRAWL_API_KEY` (optional — admin import)
- `CLOUDINARY_URL` (optional — logo uploads)
- `INDEXNOW_KEY` (optional — search engine pings)
