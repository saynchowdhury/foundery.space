import { NextResponse } from "next/server";
import { getAllBlogPosts } from "@/lib/blog-posts";
import { fetchAllOpportunities } from "@/lib/opportunities-public";

export const revalidate = 86400; // 24 hours

/**
 * llms.txt — Machine-readable site descriptor for AI crawlers.
 * Follows the llms.txt convention (https://llmstxt.org) for
 * discoverability by LLM-powered search engines and AI assistants.
 */
export async function GET() {
  const siteUrl = "https://foundery.space";
  const posts = getAllBlogPosts();

  let opportunityCount = 0;
  let categories = new Set<string>();
  try {
    const all = await fetchAllOpportunities();
    opportunityCount = all.filter((o) => o.closeDate !== "closed").length;
    all.forEach((o) => categories.add(o.category));
  } catch {
    // fallback
  }

  const lines = [
    `# Foundery.Space`,
    ``,
    `> The community-ranked directory for ambitious founders, researchers, and builders.`,
    `> Discover and track fellowships, grants, accelerators, incubators, competitions,`,
    `> residencies, research programs, and developer programs from around the world.`,
    ``,
    `## About`,
    ``,
    `Foundery.Space is a free directory that helps founders, researchers, and students`,
    `discover and track tech opportunities. We currently list ${opportunityCount}+ active`,
    `programs across ${categories.size} categories including fellowships, grants, accelerators,`,
    `incubators, competitions, residencies, research programs, developer programs, venture`,
    `capital, and entrepreneurship programs.`,
    ``,
    `## Key Pages`,
    ``,
    `- Homepage: ${siteUrl}/`,
    `- Browse all opportunities: ${siteUrl}/browse`,
    `- Blog and guides: ${siteUrl}/blog`,
    `- Privacy policy: ${siteUrl}/privacy`,
    `- Terms of service: ${siteUrl}/terms`,
    ``,
    `## Categories`,
    ``,
    ...Array.from(categories).map((cat) => {
      const slug = cat.replace(/_/g, "-");
      return `- ${cat.replace(/_/g, " ")}: ${siteUrl}/${slug}`;
    }),
    ``,
    `## Blog Articles`,
    ``,
    ...posts.map(
      (p) =>
        `- [${p.title}](${siteUrl}/blog/${p.slug}): ${p.description}`
    ),
    ``,
    `## How It Works`,
    ``,
    `1. Browse the directory by category, region, deadline, or keyword`,
    `2. Track opportunities you're interested in`,
    `3. Apply before deadlines using direct links to official program pages`,
    `4. The community votes to surface the best programs`,
    ``,
    `## Data Freshness`,
    ``,
    `Our database is updated continuously as new opportunities are discovered.`,
    `Each opportunity page shows its current deadline status (open, closed, or rolling).`,
    ``,
    `## Contact`,
    ``,
    `Website: ${siteUrl}`,
    `Support: ${siteUrl}/browse`,
  ];

  const text = lines.join("\n");

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
