import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Initialize Supabase client with service role for full access (if needed) or anon for public data
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Using anon client since opportunities are public (same as in API routes)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Opportunity = {
  id: string
  name: string
  logoUrl: string
  shareImageUrl?: string
  description: string
  fullDescription: string
  openDate: string | null
  closeDate: string | null
  tags: string[]
  category: string
  region: string
  country: string | null
  eligibility: string
  applyLink: string
  benefits: string[]
  organizer: string
  duration?: string
  funding?: string
  applicationVideo?: string
  votes: number
  hasVoted: boolean
}

async function exportOpportunities() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')

  if (error) {
    console.error('Error fetching opportunities:', error)
    process.exit(1)
  }

  // Transform the data to match our Opportunity type (though the select * should already match)
  const opportunities = data.map((row: any) => ({
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    shareImageUrl: row.share_image_url ?? undefined,
    description: row.description,
    fullDescription: row.full_description ?? row.description,
    openDate: row.open_date ?? null,
    closeDate: row.close_date ?? null,
    tags: row.tags ?? [],
    category: row.category,
    region: row.region,
    country: row.country ?? null,
    eligibility: row.eligibility,
    applyLink: row.apply_link,
    benefits: row.benefits ?? [],
    organizer: row.organizer,
    duration: row.duration,
    funding: row.funding,
    applicationVideo: row.application_video ?? undefined,
    votes: row.voters?.length ?? 0,
    hasVoted: false // Since we're exporting for public scraping, we don't have a specific voter
  }))

  // Ensure public/data directory exists
  const dir = join(process.cwd(), 'public', 'data')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }

  // Write to JSON file
  writeFileSync(
    join(dir, 'opportunities.json'),
    JSON.stringify(opportunities, null, 2),
    'utf8'
  )

  console.log(`Exported ${opportunities.length} opportunities to public/data/opportunities.json`)
}

exportOpportunities()