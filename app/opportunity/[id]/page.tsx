import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next";
import OpportunityPageClient from "./opportunity-client";
import { fetchOpportunityById, fetchAllOpportunities } from "@/lib/opportunities-public";
import { categoryLabel } from "@/lib/categories";
import { cleanDisplayText, safeJsonLd } from "@/lib/utils";

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://foundery.space";
}

const siteUrl = getSiteUrl();

export const revalidate = 600; // 10 minutes ISR

interface OpportunityPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const opportunities = await fetchAllOpportunities();
    return opportunities.map((o) => ({ id: o.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: OpportunityPageProps): Promise<Metadata> {
  const { id } = await params;
  const opportunity = await fetchOpportunityById(id);
  if (!opportunity) return { title: "Not Found — Foundery.Space" };

  const desc = cleanDisplayText(opportunity.description).slice(0, 160);
  const catLabel = categoryLabel(opportunity.category);
  const title = `${opportunity.name} — ${catLabel} | Foundery.Space`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `${siteUrl}/opportunity/${opportunity.id}`,
    },
    openGraph: {
      title,
      description: desc,
      url: `${siteUrl}/opportunity/${opportunity.id}`,
      siteName: "Foundery.Space",
      type: "article",
      images: [
        {
          url: `${siteUrl}/api/og?id=${opportunity.id}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [`${siteUrl}/api/og?id=${opportunity.id}`],
    },
  };
}

export default async function OpportunityPage({ params }: OpportunityPageProps) {
  const { id } = await params;
  const opportunity = await fetchOpportunityById(id);
  if (!opportunity) notFound();

  const opportunityUrl = `${siteUrl}/opportunity/${opportunity.id}`;
  const currentDate = new Date().toISOString();

  const scholarshipSchema = {
    "@context": "https://schema.org",
    "@type": "Scholarship",
    name: opportunity.name,
    description: cleanDisplayText(opportunity.fullDescription || opportunity.description),
    provider: {
      "@type": "Organization",
      name: opportunity.organizer,
      url: opportunity.applyLink,
    },
    url: opportunityUrl,
    applicationDeadline:
      opportunity.closeDate && opportunity.closeDate !== "closed"
        ? opportunity.closeDate
        : undefined,
    datePosted: opportunity.openDate,
    dateModified: currentDate,
    category: opportunity.category,
    eligibilityCriteria: opportunity.eligibility,
    areaServed: { "@type": "Place", name: opportunity.region },
  };

  return (
    <>
      <Script
        id="opportunity-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(scholarshipSchema) }}
      />
      <OpportunityPageClient opportunity={opportunity} />
    </>
  );
}
