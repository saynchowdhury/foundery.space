-- ============================================================
-- Foundery.Space — Full Migration
-- Run once in Supabase SQL Editor
-- ============================================================

-- ── PART 1: Full-Text Search Setup ──────────────────────────

ALTER TABLE opportunities
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

UPDATE opportunities
SET search_vector =
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(organizer, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'B') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(eligibility, '')), 'D');

CREATE INDEX IF NOT EXISTS idx_opportunities_search_vector
  ON opportunities USING gin(search_vector);

CREATE OR REPLACE FUNCTION update_opportunity_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.organizer, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.eligibility, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_opportunity_search_vector ON opportunities;
CREATE TRIGGER trg_opportunity_search_vector
  BEFORE INSERT OR UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_opportunity_search_vector();

-- ── PART 2: Performance Indexes ─────────────────────────────

CREATE INDEX IF NOT EXISTS idx_opportunities_votes
  ON opportunities(votes DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_opportunities_close_date
  ON opportunities(close_date ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_opportunities_category
  ON opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_category_votes
  ON opportunities(category, votes DESC NULLS LAST);

-- ── PART 3: Search RPC ──────────────────────────────────────

CREATE OR REPLACE FUNCTION search_opportunities(query_text text)
RETURNS SETOF opportunities
LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT *
  FROM opportunities
  WHERE search_vector @@ to_tsquery('english', query_text)
     OR (search_vector IS NULL AND (
           name ILIKE '%' || query_text || '%'
           OR description ILIKE '%' || query_text || '%'))
  ORDER BY
    ts_rank(search_vector, to_tsquery('english', query_text), 32) DESC,
    votes DESC NULLS LAST
  LIMIT 50;
$$;

GRANT EXECUTE ON FUNCTION search_opportunities(text) TO anon;
GRANT EXECUTE ON FUNCTION search_opportunities(text) TO authenticated;

-- ── PART 4: Startup Programs Seed Data ──────────────────────

INSERT INTO opportunities (
  id, name, description, full_description, category, region,
  organizer, apply_link, logo_url, tags, eligibility,
  benefits, close_date, open_date, funding
) VALUES
(
  gen_random_uuid(),
  'AWS Activate',
  'Up to $100,000 in AWS credits for eligible startups. Access compute, storage, AI/ML services, and technical support to build and scale your product on AWS infrastructure.',
  'AWS Activate is Amazon''s program for startups, offering up to $100,000 in AWS credits, technical support, training, and access to the AWS startup ecosystem. Credits can be used across 200+ AWS services including EC2, S3, RDS, SageMaker, and more. Program tiers include Activate Founders (free, $300 credits) and Activate Portfolio (up to $100k for VC/accelerator-backed startups).',
  'startup_program', 'Global',
  'Amazon Web Services', 'https://aws.amazon.com/activate/',
  'https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=128',
  ARRAY['cloud', 'infrastructure', 'credits', 'AI', 'SaaS', 'tech'],
  'Early-stage startups. Portfolio tier requires backing from a recognized VC, accelerator, or incubator.',
  ARRAY['Up to $100,000 in AWS credits', 'Technical support credits', 'AWS Activate training courses', 'Access to AWS Startup Loft events', 'Dedicated startup solutions architects'],
  NULL,
  NOW(),
  '{"amount": 100000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Google for Startups Cloud Program',
  'Up to $200,000 in Google Cloud credits over 2 years, plus technical support, mentorship, and access to Google''s global startup network.',
  'Google for Startups Cloud Program provides startups with Google Cloud credits, technical mentorship from Google engineers, access to exclusive events, co-sell opportunities, and connections to Google''s partner network of VCs and accelerators. Seed-stage startups receive up to $200k in credits; Series A+ receive $350k.',
  'startup_program', 'Global',
  'Google', 'https://cloud.google.com/startup',
  'https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128',
  ARRAY['cloud', 'AI', 'credits', 'GCP', 'infrastructure', 'SaaS'],
  'Early to growth-stage tech startups. Must be a for-profit company less than 10 years old.',
  ARRAY['Up to $200,000 in Google Cloud credits', 'Technical mentorship from Google engineers', 'Access to Google Workspace', 'Networking with 5000+ global startups', 'Co-marketing opportunities'],
  NULL,
  NOW(),
  '{"amount": 200000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Microsoft for Startups Founders Hub',
  'Up to $150,000 in Azure credits plus GitHub, Microsoft 365, LinkedIn, and OpenAI API access — free for startups at any stage.',
  'Microsoft for Startups Founders Hub is a no-equity program offering Azure cloud credits, GitHub Enterprise, Microsoft 365 Business Premium, LinkedIn Premium, and OpenAI credits. No VC backing required. Startups progress through tiers (Start, Build, Scale) unlocking increasing credit amounts. Includes access to Microsoft''s global partner network and co-sell opportunities.',
  'startup_program', 'Global',
  'Microsoft', 'https://www.microsoft.com/en-us/startups',
  'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
  ARRAY['cloud', 'Azure', 'AI', 'credits', 'SaaS', 'developer-tools'],
  'Open to any startup at any stage. No VC backing or revenue required.',
  ARRAY['Up to $150,000 in Azure credits', 'GitHub Enterprise free', 'Microsoft 365 Business Premium', 'LinkedIn Premium access', 'OpenAI API credits', 'Azure OpenAI Service access'],
  NULL,
  NOW(),
  '{"amount": 150000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Stripe Atlas',
  'Incorporate your US startup and get $10,000 in Stripe credits, plus $5,000+ in AWS credits and partner benefits from over 50 tools.',
  'Stripe Atlas helps founders incorporate a US Delaware C-Corp or LLC online in minutes. Every Atlas company receives Stripe credits, AWS Activate membership ($5,000 credits), and a curated bundle of partner perks from tools like OpenAI, Notion, Brex, and 50+ others. Atlas also provides legal templates, banking setup, and an invite to the Atlas founder community.',
  'startup_program', 'Global',
  'Stripe', 'https://stripe.com/atlas',
  'https://www.google.com/s2/favicons?domain=stripe.com&sz=128',
  ARRAY['incorporation', 'fintech', 'credits', 'US-company', 'legal', 'payments'],
  'Open to international founders wanting to incorporate in the US. $500 one-time fee.',
  ARRAY['$10,000 in Stripe credits', '$5,000 in AWS Activate credits', 'US bank account setup', 'Delaware C-Corp incorporation', 'Access to 50+ partner perks', 'Atlas founder community access'],
  NULL,
  NOW(),
  '{"amount": 10000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'GitHub for Startups',
  'Free GitHub Team or Enterprise for up to 20 seats, plus access to GitHub Copilot — for startups backed by VCs, accelerators, or incubators.',
  'GitHub for Startups gives early-stage startups free access to GitHub Team (or Enterprise) for up to 20 seats for 12 months, plus GitHub Copilot for every developer. Includes access to GitHub''s global partner network, co-sell opportunities, and dedicated startup support. The program is designed for startups that have raised seed or Series A funding.',
  'startup_program', 'Global',
  'GitHub', 'https://github.com/enterprise/startups',
  'https://www.google.com/s2/favicons?domain=github.com&sz=128',
  ARRAY['developer-tools', 'AI', 'Copilot', 'version-control', 'open-source'],
  'Startups backed by a recognized VC, accelerator, or incubator. Seed to Series A stage.',
  ARRAY['Free GitHub Team for 20 seats (12 months)', 'GitHub Copilot included', 'GitHub Actions minutes', 'GitHub Packages storage', 'Dedicated startup support'],
  NULL,
  NOW(),
  '{"amount": 0, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Vercel Startup Program',
  '$50,000 in Vercel credits, plus priority support and co-marketing for startups building on the Vercel platform.',
  'Vercel''s Startup Program gives early-stage startups $50,000 in Vercel credits for 12 months, access to enterprise-grade features, priority technical support, and co-marketing opportunities. The program is designed for startups building web applications on Next.js or other frameworks deployed on Vercel. Includes access to Vercel''s partner ecosystem and potential case study features.',
  'startup_program', 'Global',
  'Vercel', 'https://vercel.com/startups',
  'https://www.google.com/s2/favicons?domain=vercel.com&sz=128',
  ARRAY['frontend', 'deployment', 'credits', 'Next.js', 'developer-tools', 'SaaS'],
  'Early-stage startups building on the web. Must be using or planning to use Vercel.',
  ARRAY['$50,000 in Vercel credits (12 months)', 'Priority support', 'Enterprise features', 'Co-marketing opportunities', 'Access to Vercel partner ecosystem'],
  NULL,
  NOW(),
  '{"amount": 50000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Anthropic for Startups',
  'Accelerated access to Claude API with $25,000 in API credits for startups building AI-powered products.',
  'Anthropic''s startup program provides qualifying early-stage AI companies with accelerated API access, $25,000 in Claude API credits, dedicated technical support from Anthropic engineers, and access to the latest Claude models including Claude 3.5 Sonnet and Claude 3 Opus. Participants get early access to new features and models before general availability.',
  'startup_program', 'Global',
  'Anthropic', 'https://www.anthropic.com/startups',
  'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128',
  ARRAY['AI', 'LLM', 'credits', 'API', 'Claude', 'machine-learning'],
  'Early-stage startups building AI-powered products. Must have a clear AI/ML use case.',
  ARRAY['$25,000 in Claude API credits', 'Early access to new models', 'Dedicated technical support', 'Priority API access', 'Access to Anthropic startup community'],
  NULL,
  NOW(),
  '{"amount": 25000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'OpenAI Startup Fund',
  '$1M in OpenAI API credits for startups building transformative AI applications, plus access to the OpenAI team and network.',
  'The OpenAI Startup Fund invests in and supports AI startups building transformative applications. Portfolio companies receive up to $1M in OpenAI API credits, direct access to OpenAI researchers and engineers, introductions to top-tier VCs, and co-marketing support. OpenAI also makes equity investments in select portfolio companies.',
  'startup_program', 'Global',
  'OpenAI', 'https://openai.com/fund',
  'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
  ARRAY['AI', 'LLM', 'GPT', 'API', 'deep-tech', 'machine-learning'],
  'Startups building transformative AI applications. Highly competitive — preference for companies using GPT-4 and advanced OpenAI APIs.',
  ARRAY['Up to $1M in OpenAI API credits', 'Direct access to OpenAI team', 'VC introductions', 'Co-marketing opportunities', 'Potential equity investment from OpenAI'],
  NULL,
  NOW(),
  '{"amount": 1000000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Notion for Startups',
  'Free Notion Plus plan for up to 6 months, with all features unlocked for your entire team — no credit card required.',
  'Notion for Startups gives early-stage companies a free Notion Plus workspace for up to 6 months. Includes unlimited blocks, unlimited file uploads, 30-day version history, and all collaboration features. Apply through approved VC or accelerator partners to qualify.',
  'startup_program', 'Global',
  'Notion', 'https://www.notion.so/startups',
  'https://www.google.com/s2/favicons?domain=notion.so&sz=128',
  ARRAY['productivity', 'tools', 'SaaS', 'collaboration', 'no-code'],
  'Must be less than 2 years old and backed by a recognized VC, accelerator, or incubator.',
  ARRAY['Free Notion Plus (6 months)', 'Unlimited blocks and file uploads', 'Full team access', 'Priority support', 'Access to Notion startup community'],
  NULL,
  NOW(),
  '{"amount": 0, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'HubSpot for Startups',
  '50-90% off HubSpot CRM, Marketing Hub, Sales Hub, and Service Hub — tailored for startups at seed to Series A stage.',
  'HubSpot for Startups offers massive discounts on the full HubSpot platform: 90% off in year 1 for pre-seed/seed companies, 50% off for Series A. Includes access to HubSpot Academy certifications, startup-specific onboarding, and the HubSpot Startup community. Must apply through a recognized partner (VC, accelerator, incubator, or startup program).',
  'startup_program', 'Global',
  'HubSpot', 'https://www.hubspot.com/startups',
  'https://www.google.com/s2/favicons?domain=hubspot.com&sz=128',
  ARRAY['CRM', 'marketing', 'sales', 'SaaS', 'growth', 'B2B'],
  'Pre-seed through Series A. Must apply through an approved VC, accelerator, or startup program partner.',
  ARRAY['90% off year 1 (pre-seed/seed)', '50% off year 1 (Series A)', 'All HubSpot Hubs included', 'HubSpot Academy certifications', 'Dedicated startup onboarding'],
  NULL,
  NOW(),
  '{"amount": 0, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Brex for Startups',
  'Corporate cards, banking, and $50,000+ in partner rewards — no personal guarantee required. Built specifically for high-growth startups.',
  'Brex provides startups with corporate credit cards (no personal guarantee), business banking, expense management, and travel booking in one platform. Startups receive $50,000+ in partner offers from AWS, Stripe, Google Ads, and others, plus Brex''s rewards program. Integrates with major accounting software.',
  'startup_program', 'Global',
  'Brex', 'https://www.brex.com/startups',
  'https://www.google.com/s2/favicons?domain=brex.com&sz=128',
  ARRAY['fintech', 'banking', 'corporate-cards', 'finance', 'SaaS'],
  'Open to most US-incorporated startups. No personal guarantee or credit history required.',
  ARRAY['Corporate card with no personal guarantee', '$50,000+ in partner rewards', 'Business banking account', 'Expense management software', 'Dedicated startup support'],
  NULL,
  NOW(),
  '{"amount": 50000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Cloudflare for Startups',
  'Workers, R2 Storage, Stream, and all Cloudflare services free for 12 months — up to $250,000 in value for qualifying startups.',
  'Cloudflare for Startups provides up to $250,000 in Cloudflare services for 12 months, including Workers (serverless), R2 Storage, Stream (video), Pages, Zero Trust, and DDoS protection. Designed for startups building on the edge. Includes access to Cloudflare''s startup community and technical mentorship.',
  'startup_program', 'Global',
  'Cloudflare', 'https://www.cloudflare.com/lp/next-gen-startup-program/',
  'https://www.google.com/s2/favicons?domain=cloudflare.com&sz=128',
  ARRAY['cloud', 'edge', 'serverless', 'infrastructure', 'security', 'CDN'],
  'Early-stage startups. Must be backed by a recognized VC or accelerator.',
  ARRAY['Up to $250,000 in Cloudflare credits (12 months)', 'Workers and Workers KV', 'R2 Storage', 'Cloudflare Stream', 'Zero Trust security', 'DDoS protection'],
  NULL,
  NOW(),
  '{"amount": 250000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Datadog for Startups',
  'Free Datadog Pro plan for 2 years for VC-backed startups — full observability, APM, log management, and security monitoring.',
  'Datadog for Startups gives early-stage, VC-backed companies free access to the full Datadog platform for 2 years — including infrastructure monitoring, APM, log management, synthetics, security monitoring, and more. After 2 years, companies receive 50% off for an additional year. Apply through your VC or accelerator.',
  'startup_program', 'Global',
  'Datadog', 'https://www.datadoghq.com/partner/datadog-for-startups/',
  'https://www.google.com/s2/favicons?domain=datadoghq.com&sz=128',
  ARRAY['monitoring', 'observability', 'DevOps', 'infrastructure', 'SaaS', 'APM'],
  'VC-backed startups less than 5 years old with fewer than 200 employees.',
  ARRAY['Free Datadog Pro plan (2 years)', 'Full APM and tracing', 'Log management', 'Infrastructure monitoring', 'Security monitoring', '50% off in year 3'],
  NULL,
  NOW(),
  '{"amount": 0, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Figma for Startups',
  'Free Figma Professional for 12 months for early-stage startups — full design, prototyping, and collaboration features.',
  'Figma for Startups offers early-stage companies a free Professional plan for 12 months, covering unlimited projects, advanced prototyping, design system libraries, developer handoff, and the full FigJam whiteboarding tool. Apply through an approved partner program or directly if your startup meets criteria.',
  'startup_program', 'Global',
  'Figma', 'https://www.figma.com/startups/',
  'https://www.google.com/s2/favicons?domain=figma.com&sz=128',
  ARRAY['design', 'UI/UX', 'prototyping', 'tools', 'SaaS', 'collaboration'],
  'Pre-seed or seed stage startups less than 2 years old with under $5M raised.',
  ARRAY['Free Figma Professional (12 months)', 'Unlimited projects', 'FigJam included', 'Dev mode for handoff', 'Design systems and libraries'],
  NULL,
  NOW(),
  '{"amount": 0, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'MongoDB for Startups',
  '$500 in MongoDB Atlas credits, plus technical support and co-marketing for early-stage startups building with MongoDB.',
  'MongoDB for Startups provides qualifying companies with $500 in Atlas credits, technical architecture reviews, access to MongoDB University courses, priority support, and potential co-marketing opportunities. Part of MongoDB''s broader ecosystem support for startups building data-intensive applications.',
  'startup_program', 'Global',
  'MongoDB', 'https://www.mongodb.com/lp/startups',
  'https://www.google.com/s2/favicons?domain=mongodb.com&sz=128',
  ARRAY['database', 'NoSQL', 'cloud', 'infrastructure', 'developer-tools'],
  'Early-stage startups using or planning to use MongoDB Atlas. No revenue requirements.',
  ARRAY['$500 in MongoDB Atlas credits', 'Technical architecture review', 'MongoDB University access', 'Priority technical support', 'Co-marketing opportunities'],
  NULL,
  NOW(),
  '{"amount": 500, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Intercom for Early Stage',
  'Full Intercom platform free for 12 months — customer messaging, support, and product tours for qualifying startups.',
  'Intercom''s Early Stage Program gives qualifying startups free access to the full Intercom platform for 12 months, covering customer messaging (live chat, in-app messages, email), help center, product tours, outbound messaging, and AI-powered Fin chatbot. After 12 months, 50% off for year 2.',
  'startup_program', 'Global',
  'Intercom', 'https://www.intercom.com/early-stage',
  'https://www.google.com/s2/favicons?domain=intercom.com&sz=128',
  ARRAY['customer-support', 'messaging', 'SaaS', 'growth', 'B2B', 'AI'],
  'Pre-Series A startups with under $1M in funding. Must be backed by a recognized VC or accelerator.',
  ARRAY['Full Intercom platform free (12 months)', 'AI Fin chatbot included', 'Customer messaging suite', 'Help center and knowledge base', '50% off in year 2'],
  NULL,
  NOW(),
  '{"amount": 0, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Twilio for Startups',
  '$1,000 in free Twilio credits plus hands-on technical guidance for early-stage startups building communications into their product.',
  'Twilio Startups offers $1,000 in free credits across all Twilio products — SMS, Voice, Email (SendGrid), WhatsApp, Video, and Verify. Includes access to dedicated startup solutions engineers, architecture reviews, and an invite to the Twilio Startups Slack community.',
  'startup_program', 'Global',
  'Twilio', 'https://www.twilio.com/en-us/startups',
  'https://www.google.com/s2/favicons?domain=twilio.com&sz=128',
  ARRAY['communications', 'SMS', 'API', 'developer-tools', 'fintech', 'B2B'],
  'Early-stage startups. Must be backed by a recognized VC, incubator, or accelerator.',
  ARRAY['$1,000 in Twilio credits', 'Access to all Twilio products', 'Dedicated solutions engineer', 'Architecture review', 'Twilio Startups Slack community'],
  NULL,
  NOW(),
  '{"amount": 1000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Supabase Startup Program',
  '$300 in Supabase credits plus Pro plan access for 12 months — for startups building with the open source Firebase alternative.',
  'Supabase Startup Program gives qualifying startups access to the Pro plan free for 12 months ($300 value), including 8GB database, 100GB storage, 50GB bandwidth, edge functions, and realtime subscriptions. Apply through the Supabase dashboard or via a partner.',
  'startup_program', 'Global',
  'Supabase', 'https://supabase.com/startups',
  'https://www.google.com/s2/favicons?domain=supabase.com&sz=128',
  ARRAY['database', 'backend', 'open-source', 'PostgreSQL', 'developer-tools', 'SaaS'],
  'Early-stage startups. Any funding stage accepted.',
  ARRAY['Free Pro plan (12 months)', '8GB database included', '100GB storage', 'Edge functions', 'Realtime subscriptions', 'Auth and storage included'],
  NULL,
  NOW(),
  '{"amount": 300, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Segment Startup Program',
  'Free Segment Business Tier for 12 months — full customer data infrastructure with unlimited sources, destinations, and Protocols.',
  'Segment Startup Program provides early-stage startups free access to the Segment Business plan for 12 months — unlimited sources, 10 destination connections, 1,000 monthly tracked users (MTUs), data quality with Protocols, and Personas identity resolution. After 12 months, 50% off Team plan.',
  'startup_program', 'Global',
  'Twilio Segment', 'https://segment.com/industry/startups/',
  'https://www.google.com/s2/favicons?domain=segment.com&sz=128',
  ARRAY['analytics', 'data', 'CDP', 'growth', 'SaaS', 'B2B'],
  'Startups less than 2 years old with under $5M raised and fewer than 10 employees.',
  ARRAY['Free Business Tier (12 months)', 'Unlimited event sources', '10 destination connections', 'Protocols for data quality', '50% off after year 1'],
  NULL,
  NOW(),
  '{"amount": 0, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
),
(
  gen_random_uuid(),
  'Mixpanel for Startups',
  'Free Mixpanel Growth plan for 12 months — advanced product analytics for startups to understand user behavior and improve retention.',
  'Mixpanel Startup Program provides 12 months of the Growth plan free (worth $24,000/year), including unlimited data history, group analytics, data views, and predictive analytics. Must apply through an approved accelerator or VC partner. Includes onboarding support from Mixpanel''s startup team.',
  'startup_program', 'Global',
  'Mixpanel', 'https://mixpanel.com/startups/',
  'https://www.google.com/s2/favicons?domain=mixpanel.com&sz=128',
  ARRAY['analytics', 'product', 'growth', 'SaaS', 'data', 'retention'],
  'Pre-Series A startups applying through an approved VC, accelerator, or incubator partner.',
  ARRAY['Free Growth plan (12 months, $24k value)', 'Unlimited data history', 'Group analytics', 'Predictive analytics', 'Dedicated onboarding support'],
  NULL,
  NOW(),
  '{"amount": 24000, "currency": "USD", "equityPercentage": 0, "fundingType": "equity-free"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ── PART 5: Refresh search vectors for new rows ──────────────

UPDATE opportunities
SET search_vector =
  setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(organizer, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'B') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
  setweight(to_tsvector('english', coalesce(eligibility, '')), 'D')
WHERE search_vector IS NULL;

-- ── PART 6: Verify row counts ────────────────────────────────

SELECT
  category,
  count(*) AS total
FROM opportunities
GROUP BY category
ORDER BY total DESC;

-- ============================================================
-- Done. Paste entire file into Supabase SQL Editor → Run
-- ============================================================
