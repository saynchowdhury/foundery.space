/**
 * JSON-LD Schema generators for SEO
 * Generates structured data for better search engine understanding
 */

import type { Opportunity } from "./data";

/**
 * Generate Website schema for the homepage
 */
export function generateWebsiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Foundery.Space",
    url: "https://foundery.space/",
    description:
      "The community-ranked directory for ambitious founders, researchers, and builders. Discover fellowships, grants, accelerators, incubators, competitions, residencies, and developer programs.",
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
 * Generate Organization schema
 */
export function generateOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Foundery.Space",
    url: "https://foundery.space",
    logo: "https://foundery.space/logos/foundery-logo-32.webp",
    description:
      "Community-ranked directory of fellowships, grants, accelerators, incubators, competitions, residencies, research programs, and developer programs for ambitious founders and builders.",
    sameAs: [],
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
 */
export function generateOpportunitySchema(
  opportunity: Opportunity
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: opportunity.name,
    description: opportunity.description,
    url: `https://foundery.space/opportunity/${opportunity.id}`,
    provider: {
      "@type": "Organization",
      name: opportunity.organizer,
    },
    educationalProgramMode: opportunity.tags.includes("online")
      ? "distance learning"
      : "classroom and/or distance learning",
    applicationDeadline:
      opportunity.closeDate !== "closed" && opportunity.closeDate
        ? new Date(opportunity.closeDate).toISOString().split("T")[0]
        : undefined,
    programDuration: "P1Y", // Default to 1 year, could be made more specific
    offers: {
      "@type": "Offer",
      price: opportunity.description.includes("$")
        // Try to extract price from description
        ? parseInt(
            opportunity.description.match(/\$([0-9,]+(?:\.[0-9]+)?)/)?.[1] ||
              "0"
          ) * 1000
        : undefined,
      priceCurrency: "USD",
      availability:
        opportunity.closeDate === "closed"
          ? "https://schema.org/ItemAvailabilityOutOfStock"
          : "https://schema.org/ItemAvailabilityInStock",
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