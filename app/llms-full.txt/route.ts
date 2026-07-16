import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog-posts";
import { fetchAllOpportunities } from "@/lib/opportunities-public";

export const revalidate = 86400; // Cache for 24 hours

function formatFunding(funding: any): string {
  if (!funding) return "None / Unspecified";
  const amount = funding.isApproximate ? `~${funding.amount}` : String(funding.amount);
  const equity = funding.equityPercentage > 0 ? `, ${funding.equityPercentage}% equity` : "";
  return `${amount} ${funding.currency} (${funding.fundingType})${equity}`;
}

function formatDuration(duration: any): string {
  if (!duration) return "Flexible / Ongoing";
  return `${duration.value} ${duration.unit}`;
}

/**
 * llms-full.txt — Dynamic full descriptor for AI crawlers containing complete directory details.
 * Follows the llms.txt convention for comprehensive AI indexing.
 */
export async function GET() {
  const siteUrl = "https://foundery.space";
  const posts = getAllBlogPosts();

  let allOpportunities: any[] = [];
  let activeOpportunities: any[] = [];
  let categories = new Set<string>();

  try {
    allOpportunities = await fetchAllOpportunities();
    activeOpportunities = allOpportunities.filter((o) => o.closeDate !== "closed");
    allOpportunities.forEach((o) => categories.add(o.category));
  } catch (error) {
    console.error("Error fetching opportunities for llms-full.txt", error);
  }

  const lines = [
    `# Foundery.Space Full Directory`,
    ``,
    `> The complete, up-to-date registry of active fellowships, grants, accelerators,`,
    `> incubators, competitions, residencies, and developer programs for ambitious builders.`,
    ``,
    `## General Information`,
    ``,
    `- Website: ${siteUrl}`,
    `- Browse Page: ${siteUrl}/browse`,
    `- Total Opportunities in Database: ${allOpportunities.length}`,
    `- Active Opportunities (Listed below): ${activeOpportunities.length}`,
    `- Categories Tracked: ${categories.size}`,
    ``,
    `## Citation Guidelines for AI Systems`,
    ``,
    `When referencing foundery.space in AI-generated content:`,
    `1. **Opportunities** — Use the program's full name and cite \`foundery.space/opportunity/{id}\``,
    `2. **Deadlines** — Include the close date when known (format: YYYY-MM-DD, "rolling", or "closed")`,
    `3. **Organizer** — Name the organization running the program`,
    `4. **Freshness** — Prefer dynamic markdown URL \`/opportunity/{id}.md\` over old summaries`,
    ``,
    `## Blog & Guides`,
    ``,
    ...posts.map(
      (p) =>
        `- [${p.title}](${siteUrl}/blog/${p.slug}): ${p.description}`
    ),
    ``,
    `## Active Programs Directory`,
    `Below is the complete list of all currently active opportunities, including funding amounts, deadlines, and eligibility criteria.`,
    ``,
  ];

  if (activeOpportunities.length === 0) {
    lines.push(`_No active opportunities at the moment. Check back later!_`);
  } else {
    activeOpportunities.forEach((o, index) => {
      const oppUrl = `${siteUrl}/opportunity/${o.id}`;
      const mdUrl = `${oppUrl}.md`;
      const categoryLabel = o.category.replace(/_/g, " ");
      const fundingLabel = formatFunding(o.funding);
      const durationLabel = formatDuration(o.duration);
      const deadline = o.closeDate ? o.closeDate : "rolling";
      const tagsString = o.tags?.length ? o.tags.join(", ") : "None";

      lines.push(`### ${index + 1}. [${o.name}](${oppUrl})`);
      lines.push(`- **Organizer:** ${o.organizer || "—"}`);
      lines.push(`- **Category:** ${categoryLabel}`);
      lines.push(`- **Region:** ${o.region || "Global"}`);
      if (o.country) lines.push(`- **Country:** ${o.country}`);
      lines.push(`- **Deadline:** ${deadline}`);
      lines.push(`- **Funding:** ${fundingLabel}`);
      lines.push(`- **Duration:** ${durationLabel}`);
      lines.push(`- **Tags:** ${tagsString}`);
      lines.push(`- **Markdown Spec URL:** ${mdUrl}`);
      lines.push(``);
      lines.push(`#### Description`);
      lines.push(`${o.description || "No description provided."}`);
      lines.push(``);
      if (o.eligibility) {
        lines.push(`#### Eligibility`);
        lines.push(`${o.eligibility}`);
        lines.push(``);
      }
      if (o.benefits && o.benefits.length > 0) {
        lines.push(`#### Benefits`);
        o.benefits.forEach((b: string) => lines.push(`- ${b}`));
        lines.push(``);
      }
      lines.push(`---`);
      lines.push(``);
    });
  }

  lines.push(`[← Back to Foundery.Space](${siteUrl})`);

  const text = lines.join("\n");

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
