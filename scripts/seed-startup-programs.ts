/**
 * Seed script: Startup Programs (credits, SaaS perks, cloud programs)
 * Source: founderlift.space/startups
 *
 * Run: pnpm tsx scripts/seed-startup-programs.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function id(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const PROGRAMS = [
  {
    "name": "Google Cloud for Startups",
    "organizer": "Google Cloud",
    "description": "Up to $350,000 in Google Cloud credits for early-stage startups. Access AI, data analytics, and custom solutions to scale your MVP efficiently.",
    "applyLink": "https://cloud.google.com/startup",
    "funding": {
      "amount": 350000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "cloud",
      "infrastructure",
      "AI",
      "Google",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "Up to $350,000 in Google Cloud credits",
      "Technical support",
      "Access to AI & ML tools",
      "Firebase, BigQuery, Vertex AI access"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=cloud.google.com&amp;sz=128"
  },
  {
    "name": "AWS Activate Founders",
    "organizer": "Amazon Web Services",
    "description": "Up to $100,000 in AWS cloud credits for early-stage startups. Get technical support, mentorship, and resources to scale your startup today.",
    "applyLink": "https://aws.amazon.com/activate/",
    "funding": {
      "amount": 100000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "cloud",
      "infrastructure",
      "AWS",
      "Amazon",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "Up to $100,000 in AWS Activate Credits",
      "Technical support",
      "Training resources",
      "AWS Partner Network access"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=aws.amazon.com&amp;sz=128"
  },
  {
    "name": "Microsoft for Startups Founders Hub",
    "organizer": "Microsoft",
    "description": "Access up to $150,000 in free Azure credits, AI tools, and expert guidance. Build and scale faster with Microsoft's startup program.",
    "applyLink": "https://www.microsoft.com/en-us/startups",
    "funding": {
      "amount": 150000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "cloud",
      "Azure",
      "Microsoft",
      "AI",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "Up to $150,000 in Azure credits",
      "GitHub Enterprise",
      "Microsoft 365",
      "LinkedIn Premium",
      "OpenAI credits"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=startups.microsoft.com&amp;sz=128"
  },
  {
    "name": "Cloudflare for Startups",
    "organizer": "Cloudflare",
    "description": "Up to $250,000 in Cloudflare credits for startups. Build fast, secure, and scalable apps with Cloudflare's global network.",
    "applyLink": "https://www.cloudflare.com/forstartups/",
    "funding": {
      "amount": 250000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "cloud",
      "security",
      "CDN",
      "Cloudflare",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "Up to $250,000 in Cloudflare credits",
      "DDoS protection",
      "CDN access",
      "Workers & Pages access"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.cloudflare.com&amp;sz=128"
  },
  {
    "name": "OpenAI Startup Credits",
    "organizer": "OpenAI",
    "description": "Unlock $2,500 in OpenAI startup credits. Access powerful API tools to build AI applications and transform your business solutions.",
    "applyLink": "https://openai.com/startups",
    "funding": {
      "amount": 2500,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "AI",
      "GPT",
      "LLM",
      "OpenAI",
      "API",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "$2,500 in API credits",
      "Access to GPT-4, DALL-E, Whisper",
      "Developer community access"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=ramp.com&amp;sz=128"
  },
  {
    "name": "Anthropic Startup Program",
    "organizer": "Anthropic",
    "description": "Apply for free API credits, priority rate limits, and exclusive community access for your early-stage AI startup building with Claude.",
    "applyLink": "https://www.anthropic.com/startups",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "AI",
      "Claude",
      "LLM",
      "Anthropic",
      "API",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "Free API credits",
      "Priority rate limits",
      "Exclusive community access",
      "Early access to new models"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.anthropic.com&amp;sz=128"
  },
  {
    "name": "ElevenLabs Grants Program",
    "organizer": "ElevenLabs",
    "description": "Unlock $4,000+ in value with ElevenLabs Startup Grants. Get 12 months free access and 33 million characters for AI voice generation.",
    "applyLink": "https://elevenlabs.io/grants",
    "funding": {
      "amount": 4000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "AI",
      "voice",
      "audio",
      "ElevenLabs",
      "credits",
      "TTS"
    ],
    "region": "Global",
    "benefits": [
      "12 months free access",
      "33,000,000 characters (>$4,000 value)",
      "AI voice generation tools"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=elevenlabs.io&amp;sz=128"
  },
  {
    "name": "GitHub for Startups",
    "organizer": "GitHub",
    "description": "Unlock $50,000 in credits with GitHub for Startups. Access mentorship, networking, and AI/ML tools to scale your early-stage venture.",
    "applyLink": "https://github.com/solutions/startups",
    "funding": {
      "amount": 50000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "developer tools",
      "GitHub",
      "CI/CD",
      "Copilot",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "$50,000 in GitHub credits",
      "GitHub Copilot",
      "GitHub Actions",
      "GitHub Enterprise",
      "Community access"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=github.com&amp;sz=128"
  },
  {
    "name": "Stripe for Startups",
    "organizer": "Stripe",
    "description": "Join Stripe for Startups to get $20,000 in credits. Access expert resources, a founder community, and financial support to accelerate your venture-backed business.",
    "applyLink": "https://stripe.com/startups",
    "funding": {
      "amount": 20000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "payments",
      "fintech",
      "Stripe",
      "credits",
      "finance"
    ],
    "region": "Global",
    "benefits": [
      "$20,000 in Stripe credits",
      "Founder community access",
      "Expert resources",
      "Exclusive startup events"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=stripe.com&amp;sz=128"
  },
  {
    "name": "Stripe Atlas",
    "organizer": "Stripe",
    "description": "Launch your startup with Stripe Atlas. Incorporate in Delaware, get $2,500 in credits, and access $50,000+ in partner perks.",
    "applyLink": "https://stripe.com/atlas",
    "funding": {
      "amount": 2500,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "payments",
      "incorporation",
      "Delaware",
      "Stripe",
      "legal"
    ],
    "region": "Global",
    "benefits": [
      "$2,500 in Stripe credits",
      "Delaware incorporation",
      "$50,000+ in partner perks (Mercury, Xero, AWS)",
      "Legal templates"
    ]
  },
  {
    "name": "Vercel for Startups",
    "organizer": "Vercel",
    "description": "Join thousands of founders building on Vercel. Get startup credits for zero-config deployment, AI-powered development, and global scaling.",
    "applyLink": "https://vercel.com/startups",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "deployment",
      "hosting",
      "Vercel",
      "Next.js",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "Startup credits",
      "Zero-config deployment",
      "AI-powered dev tools",
      "Global edge network"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=vercel.com&amp;sz=128"
  },
  {
    "name": "Datadog for Startups",
    "organizer": "Datadog",
    "description": "Secure up to $100,000 in Datadog credits for your startup. Get real-time visibility, AI integrations, and quick setup to scale your stack efficiently.",
    "applyLink": "https://www.datadoghq.com/partner/startups/",
    "funding": {
      "amount": 100000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "monitoring",
      "observability",
      "DevOps",
      "Datadog",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "Up to $100,000 in credits",
      "Real-time monitoring",
      "APM & distributed tracing",
      "Log management"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.datadoghq.com&amp;sz=128"
  },
  {
    "name": "Notion for Startups",
    "organizer": "Notion",
    "description": "Boost productivity with Notion for Startups. Get 6 months of the Business plan free including Notion AI. Save $12,000 on your tools.",
    "applyLink": "https://www.notion.so/startups",
    "funding": {
      "amount": 12000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "productivity",
      "documentation",
      "Notion",
      "AI",
      "workspace"
    ],
    "region": "Global",
    "benefits": [
      "6 months Business plan free",
      "Notion AI included",
      "Unlimited members",
      "Save up to $12,000"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.notion.so&amp;sz=128"
  },
  {
    "name": "HubSpot for Startups",
    "organizer": "HubSpot",
    "description": "Get 30-90% off HubSpot for Startups. Access marketing, sales, and service tools to scale your business from day one.",
    "applyLink": "https://www.hubspot.com/startups",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "CRM",
      "marketing",
      "sales",
      "HubSpot",
      "discount"
    ],
    "region": "Global",
    "benefits": [
      "30-90% off HubSpot tools",
      "CRM platform",
      "Marketing Hub",
      "Sales Hub",
      "Customer service tools"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.hubspot.com&amp;sz=128"
  },
  {
    "name": "Atlassian for Startups",
    "organizer": "Atlassian",
    "description": "Boost your startup's productivity with Atlassian Premium. Get free access for 12 months for up to 50 users. Includes Jira, Confluence, and more.",
    "applyLink": "https://www.atlassian.com/startups",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "productivity",
      "project management",
      "Jira",
      "Confluence",
      "Atlassian"
    ],
    "region": "Global",
    "benefits": [
      "Free for 12 months",
      "Up to 50 users",
      "Jira Software",
      "Confluence",
      "Trello",
      "Bitbucket"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.atlassian.com&amp;sz=128"
  },
  {
    "name": "Intercom Early Stage Program",
    "organizer": "Intercom",
    "description": "Save 90% on Intercom's AI customer support platform. Get 1 year of Fin AI free and $100K in startup perks for your early-stage company.",
    "applyLink": "https://www.intercom.com/early-stage",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "customer support",
      "AI",
      "chat",
      "Intercom",
      "CX"
    ],
    "region": "Global",
    "benefits": [
      "Up to 95% off",
      "1 year of Fin AI free",
      "$100K in startup perks",
      "Full platform access"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.intercom.com&amp;sz=128"
  },
  {
    "name": "PostHog for Startups",
    "organizer": "PostHog",
    "description": "Unlock $100,000 in PostHog credits for your startup. Get access to product analytics, session replay, feature flags, and A/B testing.",
    "applyLink": "https://posthog.com/startups",
    "funding": {
      "amount": 100000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "analytics",
      "product",
      "PostHog",
      "credits",
      "open source"
    ],
    "region": "Global",
    "benefits": [
      "$100,000 in credits",
      "Product analytics",
      "Session replay",
      "Feature flags",
      "A/B testing"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=posthog.com&amp;sz=128"
  },
  {
    "name": "Mixpanel for Startups",
    "organizer": "Mixpanel",
    "description": "Startups get their first year of Mixpanel for free. Track up to 1 billion events, access Session Replay, and find product-market fit fast.",
    "applyLink": "https://mixpanel.com/startups/",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "analytics",
      "product",
      "Mixpanel",
      "events",
      "PMF"
    ],
    "region": "Global",
    "benefits": [
      "First year free",
      "Up to 1 billion events",
      "Session Replay",
      "Funnel analysis",
      "No credit card required"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=mixpanel.com&amp;sz=128"
  },
  {
    "name": "Amplitude Startup Scholarship",
    "organizer": "Amplitude",
    "description": "Get one year of free access to Amplitude Growth plan. Includes Analytics, Experimentation, Session Replay, and Activation for startups.",
    "applyLink": "https://amplitude.com/startups",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "analytics",
      "product",
      "Amplitude",
      "experimentation",
      "free"
    ],
    "region": "Global",
    "benefits": [
      "Free access for one year",
      "1.2 billion events",
      "Analytics & Experimentation",
      "Session Replay",
      "Lifetime discounts"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=amplitude.com&amp;sz=128"
  },
  {
    "name": "DigitalOcean Hatch",
    "organizer": "DigitalOcean",
    "description": "Accelerate your startup with DigitalOcean Hatch. Secure 12 months of cloud credits, GPU access, and expert support to scale your infrastructure.",
    "applyLink": "https://www.digitalocean.com/hatch",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "cloud",
      "infrastructure",
      "DigitalOcean",
      "GPU",
      "hosting"
    ],
    "region": "Global",
    "benefits": [
      "12 months of cloud credits",
      "GPU droplet access",
      "Expert technical support",
      "DropletOcean community"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.digitalocean.com&amp;sz=128"
  },
  {
    "name": "MongoDB for Startups",
    "organizer": "MongoDB",
    "description": "Build faster with MongoDB for Startups. Get free Atlas credits, Voyage AI tokens, and expert support to scale your AI-ready application.",
    "applyLink": "https://www.mongodb.com/startups",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "database",
      "NoSQL",
      "MongoDB",
      "Atlas",
      "AI"
    ],
    "region": "Global",
    "benefits": [
      "Free Atlas credits",
      "Voyage AI tokens",
      "Expert support",
      "Co-marketing opportunities"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.mongodb.com&amp;sz=128"
  },
  {
    "name": "Figma Startup Program",
    "organizer": "Figma",
    "description": "Accelerate product design with the Figma Startup Program. Get $1,000 in free access to professional design and collaboration features.",
    "applyLink": "https://www.figma.com/startups/",
    "funding": {
      "amount": 1000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "design",
      "UI/UX",
      "Figma",
      "collaboration",
      "prototyping"
    ],
    "region": "Global",
    "benefits": [
      "$1,000 in Figma credits",
      "Professional features",
      "FigJam access",
      "Design system tools",
      "Team collaboration"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.figma.com&amp;sz=128"
  },
  {
    "name": "Perplexity Startup Program",
    "organizer": "Perplexity AI",
    "description": "Boost your startup with the Perplexity Startup Program. Get $500 in credits for AI-powered search, research, and knowledge management.",
    "applyLink": "https://www.perplexity.ai/",
    "funding": {
      "amount": 500,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "AI",
      "search",
      "research",
      "Perplexity",
      "LLM",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "$500 in credits",
      "AI-powered search",
      "Perplexity Pro features",
      "API access"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.perplexity.ai&amp;sz=128"
  },
  {
    "name": "Zendesk for Startups",
    "organizer": "Zendesk",
    "description": "Boost your startup's customer service with 6 months of Zendesk free. Use AI automation to scale and impress investors.",
    "applyLink": "https://www.zendesk.com/campaign/partner-startups/",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "customer support",
      "CX",
      "helpdesk",
      "Zendesk",
      "AI"
    ],
    "region": "Global",
    "benefits": [
      "6 months free trial",
      "Full platform access",
      "AI automation",
      "Multichannel support"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.zendesk.com&amp;sz=128"
  },
  {
    "name": "Brex for Startups",
    "organizer": "Brex",
    "description": "Unlock up to $6M FDIC insurance and 30x higher credit limits with Brex for Startups. Streamline finances with automated bill pay and global payments.",
    "applyLink": "https://www.brex.com/product/startups",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "fintech",
      "banking",
      "Brex",
      "finance",
      "corporate card"
    ],
    "region": "United States",
    "benefits": [
      "Up to $6M FDIC insurance",
      "30x higher credit limits",
      "Automated bill pay",
      "Global payments",
      "Exclusive partner deals"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.brex.com&amp;sz=128"
  },
  {
    "name": "Retool Startup Program",
    "organizer": "Retool",
    "description": "Automate workflows and build internal tools with the Retool Startup Program. Get 100% off for one year and access $200K in partner deals.",
    "applyLink": "https://retool.com/startups",
    "funding": {
      "amount": 60000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "developer tools",
      "internal tools",
      "Retool",
      "automation",
      "no-code"
    ],
    "region": "Global",
    "benefits": [
      "100% off for one year",
      "Up to $60K value",
      "$200K in partner deals",
      "Full platform access"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=retool.com&amp;sz=128"
  },
  {
    "name": "Linear Startup Program",
    "organizer": "Linear",
    "description": "Boost productivity with the Linear Startup Program. Get up to 6 months free on Basic & Business plans to streamline issue tracking and ship faster.",
    "applyLink": "https://linear.app/startups",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "project management",
      "issue tracking",
      "Linear",
      "productivity",
      "engineering"
    ],
    "region": "Global",
    "benefits": [
      "6 months free",
      "Basic & Business plan",
      "Unlimited issues",
      "Roadmaps & sprints"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=linear.app&amp;sz=128"
  },
  {
    "name": "Sentry Startup Program",
    "organizer": "Sentry",
    "description": "Join the Sentry Startup Program to get free credits, mentorship, and tools. Accelerate growth with error monitoring and community support.",
    "applyLink": "https://sentry.io/for/startups/",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "monitoring",
      "error tracking",
      "Sentry",
      "DevOps",
      "observability"
    ],
    "region": "Global",
    "benefits": [
      "Free credits",
      "Error monitoring",
      "Performance monitoring",
      "Community access",
      "Mentorship"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=sentry.io&amp;sz=128"
  },
  {
    "name": "OVHcloud Startup Program",
    "organizer": "OVHcloud",
    "description": "Accelerate your growth with the OVHcloud Startup Program. Get up to €100,000 in free cloud credits, expert technical support, and access to funding.",
    "applyLink": "https://startup.ovhcloud.com/en/",
    "funding": {
      "amount": 100000,
      "currency": "EUR",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "cloud",
      "infrastructure",
      "OVHcloud",
      "European",
      "credits"
    ],
    "region": "Europe",
    "benefits": [
      "Up to €100,000 in cloud credits",
      "Expert technical support",
      "Access to funding network",
      "European data sovereignty"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=startup.ovhcloud.com&amp;sz=128"
  },
  {
    "name": "Freshworks for Startups",
    "organizer": "Freshworks",
    "description": "Get up to $15,000 in free credits with Freshworks for Startups. Access top-tier CRM, customer support, and marketing tools to scale your business.",
    "applyLink": "https://www.freshworks.com/startups/",
    "funding": {
      "amount": 15000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "CRM",
      "customer support",
      "Freshworks",
      "marketing",
      "credits"
    ],
    "region": "Global",
    "benefits": [
      "$15,000 in free credits",
      "CRM platform",
      "Helpdesk tools",
      "Marketing automation"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.freshworks.com&amp;sz=128"
  },
  {
    "name": "Polar Startup Program",
    "organizer": "Polar",
    "description": "Get Polar&#x27;s Scale tier free for 1 year! Automate usage-based billing, global tax compliance, and real-time analytics to scale your startup faster.",
    "applyLink": "https://polar.sh",
    "funding": {
      "amount": 1,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "finance",
      "polar"
    ],
    "region": "Global",
    "benefits": [
      "Scale tier for 1 year"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=polar.sh&amp;sz=128"
  },
  {
    "name": "Kiro For Startup",
    "organizer": "Kiro",
    "description": "Secure up to one year of free Kiro Pro+ credits. Build faster and scale smarter with AI coding workflows. Ideal for early-stage to Series A VC-backed startups.",
    "applyLink": "https://kiro.dev",
    "funding": {
      "amount": 1,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "developer-tools",
      "kiro"
    ],
    "region": "Global",
    "benefits": [
      "Up to 1 year of Kiro Pro+ credits"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=kiro.dev&amp;sz=128"
  },
  {
    "name": "Codex for university students",
    "organizer": "Codex",
    "description": "Get $100 in Codex credits for university students. Boost your coding projects with 2,500 free credits to extend your ChatGPT usage. Verify via SheerID today.",
    "applyLink": "https://chatgpt.com",
    "funding": {
      "amount": 100,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "codex"
    ],
    "region": "Global",
    "benefits": [
      "$100 in credits"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=chatgpt.com&amp;sz=128"
  },
  {
    "name": "Kiro for students",
    "organizer": "Kiro",
    "description": "Students can get Kiro for free! Receive 1,000 credits monthly for one year. Build pro-level projects like RAG chatbots faster. Sign up now.",
    "applyLink": "https://kiro.dev",
    "funding": {
      "amount": 1000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "kiro"
    ],
    "region": "Global",
    "benefits": [
      "1,000 credits per month free for one year"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=kiro.dev&amp;sz=128"
  },
  {
    "name": "Z.ai For Startups",
    "organizer": "Z.ai",
    "description": "Apply for Z.ai For Startups to get generous free API credits. Accelerate growth with priority support and early access to AGI technology. Scale globally today.",
    "applyLink": "https://startup.z.ai",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "ai-ml",
      "z.ai"
    ],
    "region": "Global",
    "benefits": [
      "Generous free API credits"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=startup.z.ai&amp;sz=128"
  },
  {
    "name": "Zed for Students",
    "organizer": "Zed",
    "description": "Students get Zed Pro free for one year. Boost coding with real-time collaboration, AI credits, and unlimited edit predictions. Claim your $120 value today!",
    "applyLink": "https://zed.dev",
    "funding": {
      "amount": 12000000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "zed"
    ],
    "region": "Global",
    "benefits": [
      "Zed Pro features for 12 months"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=zed.dev&amp;sz=128"
  },
  {
    "name": "Gusto for Startups",
    "organizer": "Gusto",
    "description": "Streamline your startup with Gusto. Enjoy automated payroll, HR, and benefits management. Join 400k+ businesses. Sign up for free today!",
    "applyLink": "https://gusto.com",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "other",
      "gusto"
    ],
    "region": "Global",
    "benefits": [
      "Free to sign up; pricing based on selected plan."
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=gusto.com&amp;sz=128"
  },
  {
    "name": "Ramp Partner Perks",
    "organizer": "Ramp",
    "description": "Access over $350,000 in partner rewards with Ramp. Enjoy exclusive discounts on accounting, travel, and insurance to boost your business operations.",
    "applyLink": "https://ramp.com",
    "funding": {
      "amount": 350000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "ramp"
    ],
    "region": "Global",
    "benefits": [
      "Over $350,000 in partner rewards"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=ramp.com&amp;sz=128"
  },
  {
    "name": "Canva for Teams",
    "organizer": "Canva",
    "description": "Supercharge your startup&#x27;s content creation with Canva for Teams. Get a free trial today to design on-brand, simplify workflows, and unlock AI tools.",
    "applyLink": "https://www.canva.com",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "productivity",
      "canva"
    ],
    "region": "Global",
    "benefits": [
      "Free tier + discounts"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.canva.com&amp;sz=128"
  },
  {
    "name": "PlanetScale Startup Program",
    "organizer": "PlanetScale",
    "description": "Accelerate growth with the PlanetScale Startup Program. Get scalable, serverless MySQL databases starting at just $5/mo. No downtime or hidden fees.",
    "applyLink": "https://planetscale.com",
    "funding": {
      "amount": 5,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "planetscale"
    ],
    "region": "Global",
    "benefits": [
      "Clusters start at $5 per month."
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=planetscale.com&amp;sz=128"
  },
  {
    "name": "Zoho One For Startup",
    "organizer": "Zoho",
    "description": "Get £4,000 in Zoho Wallet Credits for your startup! Access 55+ apps, free support, and expert training. Scale your business with Zoho One today.",
    "applyLink": "https://www.zoho.com",
    "funding": {
      "amount": 4000,
      "currency": "GBP",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "zoho"
    ],
    "region": "Global",
    "benefits": [
      "£4,000 worth of Zoho Wallet Credits"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.zoho.com&amp;sz=128"
  },
  {
    "name": "Dropbox for Startups",
    "organizer": "Other Services",
    "description": "Secure your files and boost team collaboration with Dropbox for Startups. Get exclusive credits, free storage, and business tools for early-stage companies today.",
    "applyLink": "https://www.dropbox.com",
    "funding": {
      "amount": 40,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "other-services",
      "other services"
    ],
    "region": "Global",
    "benefits": [
      "40-90% off"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.dropbox.com&amp;sz=128"
  },
  {
    "name": "PowerSync: Offline-First Sync for Supabase",
    "organizer": "PowerSync",
    "description": "PowerSync offers a drop-in sync layer to make your Supabase apps work offline-first. Boost performance and user experience with seamless data synchronization today.",
    "applyLink": "https://supabase.com",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "powersync"
    ],
    "region": "Global",
    "benefits": [
      "Not provided"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=supabase.com&amp;sz=128"
  },
  {
    "name": "Twilio Startups Program: Free Credits &amp; API Access",
    "organizer": "Twilio",
    "description": "Join the Twilio Startups Program to get free trial credits, developer resources, and scalable communication APIs to grow your business today.",
    "applyLink": "https://www.twilio.com",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "twilio"
    ],
    "region": "Global",
    "benefits": [
      "Free account with trial credits and access to various products and services."
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.twilio.com&amp;sz=128"
  },
  {
    "name": "Miro For Startups",
    "organizer": "Miro",
    "description": "Unlock Miro for Startups: Get free credits for early-stage teams and up to 25% off for scale-ups. Enhance collaboration with AI tools today.",
    "applyLink": "https://miro.com",
    "funding": {
      "amount": 25,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "miro"
    ],
    "region": "Global",
    "benefits": [
      "Free Miro credits and up to 25% discount for scale-ups."
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=miro.com&amp;sz=128"
  },
  {
    "name": "Algolia Startup Program",
    "organizer": "Page",
    "description": "Accelerate your startup with Algolia&#x27;s Startup Program. Get free credits for AI-powered search and discovery to boost user engagement and conversion rates.",
    "applyLink": "https://www.algolia.com",
    "funding": {
      "amount": 10000,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "page"
    ],
    "region": "Global",
    "benefits": [
      "$10,000"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=www.algolia.com&amp;sz=128"
  },
  {
    "name": "Segment Startup Program",
    "organizer": "Twilio",
    "description": "Join the Segment Startup Program to access free trial credits, educational resources, and Twilio support to build personalized customer experiences and grow your business.",
    "applyLink": "https://segment.com",
    "funding": {
      "amount": 0,
      "currency": "USD",
      "equityPercentage": 0,
      "fundingType": "equity-free" as const
    },
    "tags": [
      "startup",
      "credits",
      "twilio"
    ],
    "region": "Global",
    "benefits": [
      "Free account with trial credits"
    ],
    "logoUrl": "https://www.google.com/s2/favicons?domain=segment.com&amp;sz=128"
  }
];

async function seed() {
  console.log(`Seeding ${PROGRAMS.length} startup programs...`);
  let inserted = 0;
  let skipped = 0;

  for (const p of PROGRAMS) {
    const programId = id(p.name);

    const { data: existing } = await supabase
      .from("opportunities")
      .select("id")
      .eq("id", programId)
      .maybeSingle();

    if (existing) {
      console.log(`  SKIP  "${p.name}"`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from("opportunities").insert({
      id: programId,
      name: p.name,
      logo_url: p.logoUrl || "",
      description: p.description,
      full_description: p.description,
      open_date: null,
      close_date: null,
      tags: p.tags,
      category: "startup_program",
      region: p.region,
      country: null,
      eligibility: "Early-stage startups. Requirements vary by program — check the program page for specific eligibility criteria.",
      apply_link: p.applyLink,
      benefits: p.benefits,
      organizer: p.organizer,
      duration: null,
      funding: p.funding.amount > 0 ? p.funding : null,
      application_video: null,
    });

    if (error) {
      console.error(`  ERROR "${p.name}": ${error.message}`);
      continue;
    }

    console.log(`  OK    "${p.name}" → ${programId}`);
    inserted++;
  }

  console.log(`\nDone: ${inserted} inserted, ${skipped} skipped`);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
