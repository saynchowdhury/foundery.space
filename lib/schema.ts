/**
 * JSON-LD Schema generators for SEO
 * Generates structured data for better search engine understanding
 */

import type { Opportunity } from "./data";

/**
 * Generate Website schema for the homepage
 * Links to Organization entity via publisher @id reference.
 */
export function generateWebsiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Foundery.Space",
    url: "https://foundery.space/",
    description:
      "The community-ranked directory for ambitious founders, researchers, and builders. Discover fellowships, grants, accelerators, incubators, competitions, residencies, and developer programs.",
    publisher: {
      "@id": ORGANIZATION_ID,
    },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://foundery.space/browse?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Organization entity ID — used for cross-page @id linking so that every
 * schema node (WebSite, Article, ItemList, etc.) can reference the same
 * canonical Organization entity. This is a core Entity-SEO signal that
 * helps Google Knowledge Graph consolidate brand signals.
 */
export const ORGANIZATION_ID = "https://foundery.space/#organization";

/**
 * Generate Organization schema with entity-linking signals.
 *
 * Entity-SEO best practices applied:
 *  - Stable `@id` lets other schemas (Article publisher, WebSite provider)
 *    reference this entity, forming a connected graph instead of isolated nodes.
 *  - `knowsAbout` declares topical expertise, reinforcing E-E-A-T signals.
 *  - `foundingDate` + `alternateName` disambiguate the brand entity.
 *  - `areaServed` signals geographic scope.
 */
export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Foundery.Space",
    alternateName: "Foundery",
    url: "https://foundery.space",
    logo: {
      "@type": "ImageObject",
      url: "https://foundery.space/logos/foundery-logo-32.webp",
    },
    description:
      "Community-ranked directory of fellowships, grants, accelerators, incubators, competitions, residencies, research programs, and developer programs for ambitious founders and builders.",
    foundingDate: "2024",
    knowsAbout: [
      "Tech fellowships",
      "Startup grants",
      "Accelerator programs",
      "Incubator programs",
      "Startup competitions",
      "Research residencies",
      "Developer programs",
      "Founder funding",
      "Venture capital",
      "Entrepreneurship",
    ],
    areaServed: {
      "@type": "Place",
      name: "Global",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://foundery.space/browse",
    },
  };
}

/**
 * Generate ItemList schema for opportunity listings
 */
export function generateItemListSchema(
  opportunities: Opportunity[],
  pageTitle: string
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    numberOfItems: opportunities.length,
    itemListElement: opportunities.map((opp, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: opp.name,
        url: `https://foundery.space/opportunity/${opp.id}`,
        description: opp.description,
      },
    })),
  };
}

/**
 * Generate Opportunity schema for individual opportunity pages
 *
 * 2026 SEO best practices applied:
 *  - dateModified signals freshness (AI citations correlate 25.7% with recency)
 *  - keywords gives crawlers explicit topical signal
 *  - inLanguage + availableLanguage broadens international discovery
 *  - identifier gives a stable cross-network ID for entity resolution
 */
export function generateOpportunitySchema(
  opportunity: Opportunity
): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "@id": `https://foundery.space/opportunity/${opportunity.id}#program`,
    identifier: `foundery-space:${opportunity.id}`,
    name: opportunity.name,
    description: opportunity.description,
    url: `https://foundery.space/opportunity/${opportunity.id}`,
    sameAs: [`https://foundery.space/opportunity/${opportunity.id}.md`],
    keywords: [
      opportunity.category,
      ...(opportunity.tags || []),
      opportunity.region,
    ]
      .filter(Boolean)
      .join(", "),
    inLanguage: "en",
    dateModified: now,
    datePublished:
      opportunity.openDate && opportunity.openDate !== "rolling"
        ? new Date(opportunity.openDate).toISOString()
        : now,
    provider: {
      "@type": "Organization",
      name: opportunity.organizer,
      url: opportunity.applyLink || undefined,
    },
    educationalProgramMode: opportunity.tags?.includes("online")
      ? "distance learning"
      : "classroom and/or distance learning",
    applicationDeadline:
      opportunity.closeDate !== "closed" && opportunity.closeDate
        ? new Date(opportunity.closeDate).toISOString().split("T")[0]
        : undefined,
    applicationStartDate:
      opportunity.openDate && opportunity.openDate !== "rolling"
        ? new Date(opportunity.openDate).toISOString().split("T")[0]
        : undefined,
    programDuration: "P1Y",
    offers: {
      "@type": "Offer",
      price: opportunity.description?.includes("$")
        ? parseInt(
            opportunity.description.match(/\$([0-9,]+(?:\.[0-9]+)?)/)?.[1] ||
              "0"
          ) * 1000
        : 0,
      priceCurrency: "USD",
      availability:
        opportunity.closeDate === "closed"
          ? "https://schema.org/ItemAvailabilityOutOfStock"
          : "https://schema.org/ItemAvailabilityInStock",
      validThrough:
        opportunity.closeDate !== "closed" && opportunity.closeDate
          ? new Date(opportunity.closeDate).toISOString()
          : undefined,
      url: opportunity.applyLink || undefined,
    },
  };
}

/**
 * Generate FAQ schema for common questions about fellowships/grants
 */
export function generateFAQSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Foundery.Space?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Foundery.Space is a free, community-ranked directory that helps founders, researchers, and students discover and track tech fellowships, grants, accelerators, incubators, competitions, residencies, and developer programs from around the world.",
        },
      },
      {
        "@type": "Question",
        name: "How often is the opportunity database updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Our database is updated continuously as new opportunities are discovered and submitted by our community. We verify each opportunity before adding it to ensure accuracy and legitimacy.",
        },
      },
      {
        "@type": "Question",
        name: "Are the opportunities on Foundery.Space legitimate?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, we manually verify each opportunity before listing it. We check official program websites, contact organizers when possible, and rely on community feedback to maintain quality and legitimacy.",
        },
      },
      {
        "@type": "Question",
        name: "How can I submit a new opportunity to Foundery.Space?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can submit new opportunities using the 'Submit an opportunity' button on our homepage. Simply provide the program URL, and our team will review and add it to the database after verification.",
        },
      },
      {
        "@type": "Question",
        name: "What types of programs does Foundery.Space list?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "We list fellowships, grants, accelerators, incubators, competitions, residencies, research programs, and developer programs focused on technology, entrepreneurship, and innovation.",
        },
      },
    ],
  };
}