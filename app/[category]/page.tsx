import { notFound } from "next/navigation";
import { generateGuideConfigs } from "@/lib/guide-generator";
import { GuideContent } from "@/components/features/guide-content";
import type { GuideConfig } from "@/lib/guide-generator";
import type { Opportunity } from "@/lib/data";
import { fetchOpportunityCardData } from "@/lib/opportunities-public";

export const revalidate = 600; // 10 minutes

export async function generateStaticParams() {
  try {
    const opportunities = (await fetchOpportunityCardData()) as unknown as Opportunity[];
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
  const opportunities = (await fetchOpportunityCardData()) as unknown as Opportunity[];
  const configs = generateGuideConfigs(opportunities);
  const config = Object.values(configs).find((c) => c.slug === category);
  if (!config) return { title: "Not Found" };

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
  const opportunities = (await fetchOpportunityCardData()) as unknown as Opportunity[];
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
