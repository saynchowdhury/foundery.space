import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Initialize Supabase client with service role for full access (if needed) or anon for public data
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

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

export type SiteMapPage = {
  url: string
  type: 'home' | 'browse' | 'category' | 'opportunity'
  category?: string
  opportunityId?: string
}

async function exportOpportunitiesAndSiteMap() {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')

  if (error) {
    console.error('Error fetching opportunities:', error)
    process.exit(1)
  }

  // Transform the data to match our Opportunity type
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
    hasVoted: false
  }))

  // Ensure public/data directory exists
  const dataDir = join(process.cwd(), 'public', 'data')
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }

  // Write opportunities to JSON file
  writeFileSync(
    join(dataDir, 'opportunities.json'),
    JSON.stringify(opportunities, null, 2),
    'utf8'
  )

  console.log(`Exported ${opportunities.length} opportunities to public/data/opportunities.json`)

  // Generate site map
  const siteMap: SiteMapPage[] = [
    { url: '/', type: 'home' },
    { url: '/browse', type: 'browse' }
  ]

  // Add category pages (unique categories)
  const categories = Array.from(new Set(opportunities.map(o => o.category)))
  categories.forEach(category => {
    siteMap.push({ url: `/${category}`, type: 'category', category })
  })

  // Add opportunity detail pages
  opportunities.forEach(opportunity => {
    siteMap.push({ url: `/opportunity/${opportunity.id}`, type: 'opportunity', opportunityId: opportunity.id })
  })

  // Write site map to JSON file
  writeFileSync(
    join(process.cwd(), 'public', 'site-map.json'),
    JSON.stringify(siteMap, null, 2),
    'utf8'
  )

  console.log(`Generated site map with ${siteMap.length} pages to public/site-map.json`)
}

exportOpportunitiesAndSiteMap()