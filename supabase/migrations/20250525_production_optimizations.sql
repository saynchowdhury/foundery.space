-- Production optimization migrations for foundery.space
-- Run these in the Supabase SQL editor: https://supabase.com/dashboard/project/tpvpacwoquygbykcjqle/sql/new

-- 1. Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities (category);
CREATE INDEX IF NOT EXISTS idx_opportunities_region ON public.opportunities (region);
CREATE INDEX IF NOT EXISTS idx_opportunities_close_date ON public.opportunities (close_date);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON public.opportunities (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_tags ON public.opportunities USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_opportunities_voters ON public.opportunities USING GIN (voters);
CREATE INDEX IF NOT EXISTS idx_opportunities_name_trgm ON public.opportunities USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_opportunities_organizer_trgm ON public.opportunities USING GIN (organizer gin_trgm_ops);

-- Enable pg_trgm extension for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create separate votes table (scales better than JSON array)
CREATE TABLE IF NOT EXISTS public.opportunity_votes (
  id BIGSERIAL PRIMARY KEY,
  opportunity_id TEXT NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, voter_id)
);

CREATE INDEX IF NOT EXISTS idx_votes_opportunity_id ON public.opportunity_votes (opportunity_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_id ON public.opportunity_votes (voter_id);

-- 3. Create suggestions indexes
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON public.suggestions (status);
CREATE INDEX IF NOT EXISTS idx_suggestions_created_at ON public.suggestions (created_at DESC);

-- 4. Create feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_opportunity_id ON public.feedback (opportunity_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback (created_at DESC);

-- 5. Enable RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 6. RLS policies
-- Opportunities: public read, service-role write
DROP POLICY IF EXISTS "Public read opportunities" ON public.opportunities;
CREATE POLICY "Public read opportunities" ON public.opportunities
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role write opportunities" ON public.opportunities;
CREATE POLICY "Service role write opportunities" ON public.opportunities
  FOR ALL USING (auth.role() = 'service_role');

-- Votes: public can insert/select their own
DROP POLICY IF EXISTS "Public read votes" ON public.opportunity_votes;
CREATE POLICY "Public read votes" ON public.opportunity_votes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert votes" ON public.opportunity_votes;
CREATE POLICY "Public insert votes" ON public.opportunity_votes
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete own votes" ON public.opportunity_votes;
CREATE POLICY "Public delete own votes" ON public.opportunity_votes
  FOR DELETE USING (true);

-- Suggestions: public insert, service-role manage
DROP POLICY IF EXISTS "Public insert suggestions" ON public.suggestions;
CREATE POLICY "Public insert suggestions" ON public.suggestions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manage suggestions" ON public.suggestions;
CREATE POLICY "Service role manage suggestions" ON public.suggestions
  FOR ALL USING (auth.role() = 'service_role');

-- Feedback: public insert, service-role read
DROP POLICY IF EXISTS "Public insert feedback" ON public.feedback;
CREATE POLICY "Public insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service role read feedback" ON public.feedback;
CREATE POLICY "Service role read feedback" ON public.feedback
  FOR ALL USING (auth.role() = 'service_role');
