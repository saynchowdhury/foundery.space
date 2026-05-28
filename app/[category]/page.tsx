import { notFound } from "next/navigation";
import { generateGuideConfigs } from "@/lib/guide-generator";
import { GuideContent } from "@/components/features/guide-content";
import { getAnonClient } from "@/lib/supabase";
import type { GuideConfig } from "@/lib/guide-generator";
import type { Opportunity } from "@/lib/data";

function normalizeCategory(raw: unknown): Opportunity["category"] {
  const val = String(raw || "fellowship").toLowerCase().trim();
  const map: Record<string, Opportunity["category"]> = {
    developer_programs: "developer_program",
    "developer programs": "developer_program",
    entrepreneurship: "fellowship",
    startup: "accelerator",
    incubation: "incubator",
    vc: "venture_capital",
    hackathon: "competition",
    scholarship: "fellowship",
  };
  return (map[val] ?? val) as Opportunity["category"];
}

function mapRow(row: Record<string, unknown>): Opportunity {
  return {
    id: String(row.id || ""),
    name: String(row.name || ""),
    logoUrl: String(row.logo_url || ""),
    shareImageUrl: row.share_image_url ? String(row.share_image_url) : undefined,
    description: String(row.description || ""),
    fullDescription: String(row.full_description || row.description || ""),
    openDate: row.open_date ? String(row.open_date) : null,
    closeDate: row.close_date ? String(row.close_date) : null,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    category: normalizeCategory(row.category),
    region: String(row.region || ""),
    country: row.country ? String(row.country) : null,
    eligibility: String(row.eligibility || ""),
    applyLink: String(row.apply_link || ""),
    benefits: Array.isArray(row.benefits) ? (row.benefits as string[]) : [],
    organizer: String(row.organizer || ""),
    duration: row.duration as Opportunity["duration"],
    funding: row.funding as Opportunity["funding"],
    applicationVideo: row.application_video ? String(row.application_video) : undefined,
  };
}

async function fetchAll(): Promise<Opportunity[]> {
  const { data, error } = await getAnonClient()
    .from("opportunities")
    .select("*")
    .order("close_date", { ascending: true });
  if (error) return [];
  return (data || []).map(mapRow);
}

export async function generateStaticParams() {
  try {
    const opportunities = await fetchAll();
    const configs = generateGuideConfigs(opportunities);
    return Object.values(configs).map((config) => ({
      category: config.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://foundery.space";
  const opportunities = await fetchAll();
  const configs = generateGuideConfigs(opportunities);
  const config = Object.values(configs).find((c) => c.slug === category);
  if (!config) return { title: "Not Found" };

  const filtered = filterByConfig(opportunities, config);

  return {
    title: `${config.title} — Foundery.Space`,
    description: config.description,
    alternates: {
      canonical: `${siteUrl}/${category}`,
    },
    openGraph: {
      title: `${config.title} — Foundery.Space`,
      description: config.description,
      url: `${siteUrl}/${category}`,
      siteName: "Foundery.Space",
      type: "website",
      images: [
        {
          url: `${siteUrl}/api/og`,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.title} — Foundery.Space`,
      description: config.description,
      images: [`${siteUrl}/api/og`],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const opportunities = await fetchAll();
  const configs = generateGuideConfigs(opportunities);
  const config = Object.values(configs).find((c) => c.slug === category);
  if (!config) notFound();

  const filtered = filterByConfig(opportunities, config);

  return (
    <GuideContent config={config} opportunities={filtered} allOpportunities={opportunities} />
  );
}

function filterByConfig(
  opportunities: Opportunity[],
  config: GuideConfig
): Opportunity[] {
  const { filters } = config;
  return opportunities.filter((opp) => {
    if (filters.categories?.length && !filters.categories.includes(opp.category)) return false;
    if (filters.regions?.length && !filters.regions.includes(opp.region)) return false;
    if (filters.tags?.length && !filters.tags.some((t) => opp.tags.includes(t))) return false;
    if (filters.fundingAmount) {
      if (!opp.funding) return false;
      const amount = opp.funding.amount;
      if (amount < filters.fundingAmount.min) return false;
      if (filters.fundingAmount.max !== Infinity && amount > filters.fundingAmount.max) return false;
    }
    return true;
  });
}
