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
    name: "Google Cloud for Startups",
    organizer: "Google Cloud",
    description: "Up to $350,000 in Google Cloud credits for early-stage startups. Access AI, data analytics, and custom solutions to scale your MVP efficiently.",
    applyLink: "https://cloud.google.com/startup",
    funding: { amount: 350000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["cloud", "infrastructure", "AI", "Google", "credits"],
    region: "Global",
    benefits: ["Up to $350,000 in Google Cloud credits", "Technical support", "Access to AI & ML tools", "Firebase, BigQuery, Vertex AI access"],
  },
  {
    name: "AWS Activate Founders",
    organizer: "Amazon Web Services",
    description: "Up to $100,000 in AWS cloud credits for early-stage startups. Get technical support, mentorship, and resources to scale your startup today.",
    applyLink: "https://aws.amazon.com/activate/",
    funding: { amount: 100000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["cloud", "infrastructure", "AWS", "Amazon", "credits"],
    region: "Global",
    benefits: ["Up to $100,000 in AWS Activate Credits", "Technical support", "Training resources", "AWS Partner Network access"],
  },
  {
    name: "Microsoft for Startups Founders Hub",
    organizer: "Microsoft",
    description: "Access up to $150,000 in free Azure credits, AI tools, and expert guidance. Build and scale faster with Microsoft's startup program.",
    applyLink: "https://www.microsoft.com/en-us/startups",
    funding: { amount: 150000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["cloud", "Azure", "Microsoft", "AI", "credits"],
    region: "Global",
    benefits: ["Up to $150,000 in Azure credits", "GitHub Enterprise", "Microsoft 365", "LinkedIn Premium", "OpenAI credits"],
  },
  {
    name: "Cloudflare for Startups",
    organizer: "Cloudflare",
    description: "Up to $250,000 in Cloudflare credits for startups. Build fast, secure, and scalable apps with Cloudflare's global network.",
    applyLink: "https://www.cloudflare.com/forstartups/",
    funding: { amount: 250000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["cloud", "security", "CDN", "Cloudflare", "credits"],
    region: "Global",
    benefits: ["Up to $250,000 in Cloudflare credits", "DDoS protection", "CDN access", "Workers & Pages access"],
  },
  {
    name: "OpenAI Startup Credits",
    organizer: "OpenAI",
    description: "Unlock $2,500 in OpenAI startup credits. Access powerful API tools to build AI applications and transform your business solutions.",
    applyLink: "https://openai.com/startups",
    funding: { amount: 2500, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["AI", "GPT", "LLM", "OpenAI", "API", "credits"],
    region: "Global",
    benefits: ["$2,500 in API credits", "Access to GPT-4, DALL-E, Whisper", "Developer community access"],
  },
  {
    name: "Anthropic Startup Program",
    organizer: "Anthropic",
    description: "Apply for free API credits, priority rate limits, and exclusive community access for your early-stage AI startup building with Claude.",
    applyLink: "https://www.anthropic.com/startups",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["AI", "Claude", "LLM", "Anthropic", "API", "credits"],
    region: "Global",
    benefits: ["Free API credits", "Priority rate limits", "Exclusive community access", "Early access to new models"],
  },
  {
    name: "ElevenLabs Grants Program",
    organizer: "ElevenLabs",
    description: "Unlock $4,000+ in value with ElevenLabs Startup Grants. Get 12 months free access and 33 million characters for AI voice generation.",
    applyLink: "https://elevenlabs.io/grants",
    funding: { amount: 4000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["AI", "voice", "audio", "ElevenLabs", "credits", "TTS"],
    region: "Global",
    benefits: ["12 months free access", "33,000,000 characters (>$4,000 value)", "AI voice generation tools"],
  },
  {
    name: "GitHub for Startups",
    organizer: "GitHub",
    description: "Unlock $50,000 in credits with GitHub for Startups. Access mentorship, networking, and AI/ML tools to scale your early-stage venture.",
    applyLink: "https://github.com/solutions/startups",
    funding: { amount: 50000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["developer tools", "GitHub", "CI/CD", "Copilot", "credits"],
    region: "Global",
    benefits: ["$50,000 in GitHub credits", "GitHub Copilot", "GitHub Actions", "GitHub Enterprise", "Community access"],
  },
  {
    name: "Stripe for Startups",
    organizer: "Stripe",
    description: "Join Stripe for Startups to get $20,000 in credits. Access expert resources, a founder community, and financial support to accelerate your venture-backed business.",
    applyLink: "https://stripe.com/startups",
    funding: { amount: 20000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["payments", "fintech", "Stripe", "credits", "finance"],
    region: "Global",
    benefits: ["$20,000 in Stripe credits", "Founder community access", "Expert resources", "Exclusive startup events"],
  },
  {
    name: "Stripe Atlas",
    organizer: "Stripe",
    description: "Launch your startup with Stripe Atlas. Incorporate in Delaware, get $2,500 in credits, and access $50,000+ in partner perks.",
    applyLink: "https://stripe.com/atlas",
    funding: { amount: 2500, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["payments", "incorporation", "Delaware", "Stripe", "legal"],
    region: "Global",
    benefits: ["$2,500 in Stripe credits", "Delaware incorporation", "$50,000+ in partner perks (Mercury, Xero, AWS)", "Legal templates"],
  },
  {
    name: "Vercel for Startups",
    organizer: "Vercel",
    description: "Join thousands of founders building on Vercel. Get startup credits for zero-config deployment, AI-powered development, and global scaling.",
    applyLink: "https://vercel.com/startups",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["deployment", "hosting", "Vercel", "Next.js", "credits"],
    region: "Global",
    benefits: ["Startup credits", "Zero-config deployment", "AI-powered dev tools", "Global edge network"],
  },
  {
    name: "Datadog for Startups",
    organizer: "Datadog",
    description: "Secure up to $100,000 in Datadog credits for your startup. Get real-time visibility, AI integrations, and quick setup to scale your stack efficiently.",
    applyLink: "https://www.datadoghq.com/partner/startups/",
    funding: { amount: 100000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["monitoring", "observability", "DevOps", "Datadog", "credits"],
    region: "Global",
    benefits: ["Up to $100,000 in credits", "Real-time monitoring", "APM & distributed tracing", "Log management"],
  },
  {
    name: "Notion for Startups",
    organizer: "Notion",
    description: "Boost productivity with Notion for Startups. Get 6 months of the Business plan free including Notion AI. Save $12,000 on your tools.",
    applyLink: "https://www.notion.so/startups",
    funding: { amount: 12000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["productivity", "documentation", "Notion", "AI", "workspace"],
    region: "Global",
    benefits: ["6 months Business plan free", "Notion AI included", "Unlimited members", "Save up to $12,000"],
  },
  {
    name: "HubSpot for Startups",
    organizer: "HubSpot",
    description: "Get 30-90% off HubSpot for Startups. Access marketing, sales, and service tools to scale your business from day one.",
    applyLink: "https://www.hubspot.com/startups",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["CRM", "marketing", "sales", "HubSpot", "discount"],
    region: "Global",
    benefits: ["30-90% off HubSpot tools", "CRM platform", "Marketing Hub", "Sales Hub", "Customer service tools"],
  },
  {
    name: "Atlassian for Startups",
    organizer: "Atlassian",
    description: "Boost your startup's productivity with Atlassian Premium. Get free access for 12 months for up to 50 users. Includes Jira, Confluence, and more.",
    applyLink: "https://www.atlassian.com/startups",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["productivity", "project management", "Jira", "Confluence", "Atlassian"],
    region: "Global",
    benefits: ["Free for 12 months", "Up to 50 users", "Jira Software", "Confluence", "Trello", "Bitbucket"],
  },
  {
    name: "Intercom Early Stage Program",
    organizer: "Intercom",
    description: "Save 90% on Intercom's AI customer support platform. Get 1 year of Fin AI free and $100K in startup perks for your early-stage company.",
    applyLink: "https://www.intercom.com/early-stage",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["customer support", "AI", "chat", "Intercom", "CX"],
    region: "Global",
    benefits: ["Up to 95% off", "1 year of Fin AI free", "$100K in startup perks", "Full platform access"],
  },
  {
    name: "PostHog for Startups",
    organizer: "PostHog",
    description: "Unlock $100,000 in PostHog credits for your startup. Get access to product analytics, session replay, feature flags, and A/B testing.",
    applyLink: "https://posthog.com/startups",
    funding: { amount: 100000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["analytics", "product", "PostHog", "credits", "open source"],
    region: "Global",
    benefits: ["$100,000 in credits", "Product analytics", "Session replay", "Feature flags", "A/B testing"],
  },
  {
    name: "Mixpanel for Startups",
    organizer: "Mixpanel",
    description: "Startups get their first year of Mixpanel for free. Track up to 1 billion events, access Session Replay, and find product-market fit fast.",
    applyLink: "https://mixpanel.com/startups/",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["analytics", "product", "Mixpanel", "events", "PMF"],
    region: "Global",
    benefits: ["First year free", "Up to 1 billion events", "Session Replay", "Funnel analysis", "No credit card required"],
  },
  {
    name: "Amplitude Startup Scholarship",
    organizer: "Amplitude",
    description: "Get one year of free access to Amplitude Growth plan. Includes Analytics, Experimentation, Session Replay, and Activation for startups.",
    applyLink: "https://amplitude.com/startups",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["analytics", "product", "Amplitude", "experimentation", "free"],
    region: "Global",
    benefits: ["Free access for one year", "1.2 billion events", "Analytics & Experimentation", "Session Replay", "Lifetime discounts"],
  },
  {
    name: "DigitalOcean Hatch",
    organizer: "DigitalOcean",
    description: "Accelerate your startup with DigitalOcean Hatch. Secure 12 months of cloud credits, GPU access, and expert support to scale your infrastructure.",
    applyLink: "https://www.digitalocean.com/hatch",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["cloud", "infrastructure", "DigitalOcean", "GPU", "hosting"],
    region: "Global",
    benefits: ["12 months of cloud credits", "GPU droplet access", "Expert technical support", "DropletOcean community"],
  },
  {
    name: "MongoDB for Startups",
    organizer: "MongoDB",
    description: "Build faster with MongoDB for Startups. Get free Atlas credits, Voyage AI tokens, and expert support to scale your AI-ready application.",
    applyLink: "https://www.mongodb.com/startups",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["database", "NoSQL", "MongoDB", "Atlas", "AI"],
    region: "Global",
    benefits: ["Free Atlas credits", "Voyage AI tokens", "Expert support", "Co-marketing opportunities"],
  },
  {
    name: "Figma Startup Program",
    organizer: "Figma",
    description: "Accelerate product design with the Figma Startup Program. Get $1,000 in free access to professional design and collaboration features.",
    applyLink: "https://www.figma.com/startups/",
    funding: { amount: 1000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["design", "UI/UX", "Figma", "collaboration", "prototyping"],
    region: "Global",
    benefits: ["$1,000 in Figma credits", "Professional features", "FigJam access", "Design system tools", "Team collaboration"],
  },
  {
    name: "Perplexity Startup Program",
    organizer: "Perplexity AI",
    description: "Boost your startup with the Perplexity Startup Program. Get $500 in credits for AI-powered search, research, and knowledge management.",
    applyLink: "https://www.perplexity.ai/",
    funding: { amount: 500, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["AI", "search", "research", "Perplexity", "LLM", "credits"],
    region: "Global",
    benefits: ["$500 in credits", "AI-powered search", "Perplexity Pro features", "API access"],
  },
  {
    name: "Zendesk for Startups",
    organizer: "Zendesk",
    description: "Boost your startup's customer service with 6 months of Zendesk free. Use AI automation to scale and impress investors.",
    applyLink: "https://www.zendesk.com/campaign/partner-startups/",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["customer support", "CX", "helpdesk", "Zendesk", "AI"],
    region: "Global",
    benefits: ["6 months free trial", "Full platform access", "AI automation", "Multichannel support"],
  },
  {
    name: "Brex for Startups",
    organizer: "Brex",
    description: "Unlock up to $6M FDIC insurance and 30x higher credit limits with Brex for Startups. Streamline finances with automated bill pay and global payments.",
    applyLink: "https://www.brex.com/product/startups",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["fintech", "banking", "Brex", "finance", "corporate card"],
    region: "United States",
    benefits: ["Up to $6M FDIC insurance", "30x higher credit limits", "Automated bill pay", "Global payments", "Exclusive partner deals"],
  },
  {
    name: "Retool Startup Program",
    organizer: "Retool",
    description: "Automate workflows and build internal tools with the Retool Startup Program. Get 100% off for one year and access $200K in partner deals.",
    applyLink: "https://retool.com/startups",
    funding: { amount: 60000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["developer tools", "internal tools", "Retool", "automation", "no-code"],
    region: "Global",
    benefits: ["100% off for one year", "Up to $60K value", "$200K in partner deals", "Full platform access"],
  },
  {
    name: "Linear Startup Program",
    organizer: "Linear",
    description: "Boost productivity with the Linear Startup Program. Get up to 6 months free on Basic & Business plans to streamline issue tracking and ship faster.",
    applyLink: "https://linear.app/startups",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["project management", "issue tracking", "Linear", "productivity", "engineering"],
    region: "Global",
    benefits: ["6 months free", "Basic & Business plan", "Unlimited issues", "Roadmaps & sprints"],
  },
  {
    name: "Sentry Startup Program",
    organizer: "Sentry",
    description: "Join the Sentry Startup Program to get free credits, mentorship, and tools. Accelerate growth with error monitoring and community support.",
    applyLink: "https://sentry.io/for/startups/",
    funding: { amount: 0, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["monitoring", "error tracking", "Sentry", "DevOps", "observability"],
    region: "Global",
    benefits: ["Free credits", "Error monitoring", "Performance monitoring", "Community access", "Mentorship"],
  },
  {
    name: "OVHcloud Startup Program",
    organizer: "OVHcloud",
    description: "Accelerate your growth with the OVHcloud Startup Program. Get up to €100,000 in free cloud credits, expert technical support, and access to funding.",
    applyLink: "https://startup.ovhcloud.com/en/",
    funding: { amount: 100000, currency: "EUR", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["cloud", "infrastructure", "OVHcloud", "European", "credits"],
    region: "Europe",
    benefits: ["Up to €100,000 in cloud credits", "Expert technical support", "Access to funding network", "European data sovereignty"],
  },
  {
    name: "Freshworks for Startups",
    organizer: "Freshworks",
    description: "Get up to $15,000 in free credits with Freshworks for Startups. Access top-tier CRM, customer support, and marketing tools to scale your business.",
    applyLink: "https://www.freshworks.com/startups/",
    funding: { amount: 15000, currency: "USD", equityPercentage: 0, fundingType: "equity-free" as const },
    tags: ["CRM", "customer support", "Freshworks", "marketing", "credits"],
    region: "Global",
    benefits: ["$15,000 in free credits", "CRM platform", "Helpdesk tools", "Marketing automation"],
  },
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
      logo_url: "",
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
