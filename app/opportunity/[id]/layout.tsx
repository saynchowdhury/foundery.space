import type { Metadata } from "next";
import type { Opportunity } from "@/lib/data";
import { fetchOpportunityById } from "@/lib/opportunities-public";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_BASE_URL || "https://foundery.space";
  const opportunity: Opportunity | null = await fetchOpportunityById(id);

  if (!opportunity) {
    return {
      title: "Opportunity Not Found - Foundery.Space",
      description: "The requested opportunity could not be found.",
    };
  }

  const title = `${opportunity.name} - Deadlines, Requirements & How to Apply`;
  
  const { generateOpportunityMetaDescription } = await import("@/lib/meta-optimization");
  const description = generateOpportunityMetaDescription(
    opportunity.name,
    opportunity.fullDescription || opportunity.description,
    opportunity.organizer
  );

  return {
    title,
    description,
    keywords: [...opportunity.tags].join(", "),
    alternates: {
      canonical: `${siteUrl}/opportunity/${id}`,
      types: {
        "text/markdown": `/opportunity/${id}.md`,
      },
    },
    openGraph: {
      title: `${opportunity.name} - Deadlines, Requirements & How to Apply`,
      description: description,
      type: "article",
      url: `${siteUrl}/opportunity/${id}`,
      siteName: "Foundery.Space",
      publishedTime: opportunity.openDate || undefined,
      modifiedTime: new Date().toISOString(),
      images: [
        {
          url: `${siteUrl}/api/og?id=${id}`,
          width: 1200,
          height: 630,
          alt: opportunity.name,
        },
      ],
    },
    twitter: {
      title: `${opportunity.name} - Deadlines, Requirements & How to Apply`,
      description: description,
      card: "summary_large_image",
      images: [`${siteUrl}/api/og?id=${id}`],
      creator: "@disamdev",
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default function OpportunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
