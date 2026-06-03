import { MetadataRoute } from "next";
import type { Opportunity } from "@/lib/data";
import { fetchAllOpportunities } from "@/lib/opportunities-public";

export const revalidate = 3600; // regenerate hourly, not on every request

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || "https://foundery.space";
  const currentDate = new Date().toISOString().split("T")[0];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(currentDate),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(currentDate),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2025-08-04"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2025-07-29"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch directly from Supabase — avoids API route round-trip + botid middleware
  let activeOpportunities: Opportunity[] = [];
  try {
    const all = await fetchAllOpportunities();
    activeOpportunities = all.filter((o) => o.closeDate !== "closed");
  } catch (error) {
    console.error("Error fetching opportunities for sitemap", error);
  }
  const opportunityRoutes: MetadataRoute.Sitemap = activeOpportunities.map(
    (opportunity) => ({
      url: `${baseUrl}/opportunity/${opportunity.id}`,
      lastModified: opportunity.openDate
        ? new Date(opportunity.openDate)
        : new Date(currentDate),
      changeFrequency: "weekly",
      priority: 0.9,
    })
  );

  // Category pages — all 9 canonical categories
  const categoryRoutes: MetadataRoute.Sitemap = [
    "accelerator",
    "fellowship",
    "incubator",
    "venture-capital",
    "grant",
    "residency",
    "competition",
    "research",
    "developer-program",
  ].map((category) => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(currentDate),
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // Guide pages - generate dynamically based on opportunities
  let guideRoutes: MetadataRoute.Sitemap = [];
  try {
    const { generateGuideConfigs } = await import("@/lib/guide-generator");
    const guideConfigs = generateGuideConfigs(activeOpportunities);
    
    // Add all generated guides at root level (they're accessible via [category] route)
    guideRoutes = Object.values(guideConfigs).map((config) => ({
      url: `${baseUrl}/${config.slug}`,
      lastModified: new Date(currentDate),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error generating guide routes for sitemap", error);
  }

  // Comparison pages - generate dynamically
  let comparisonRoutes: MetadataRoute.Sitemap = [];
  try {
    const { generateComparisonConfigs } = await import("@/lib/comparison-generator");
    const comparisons = generateComparisonConfigs(activeOpportunities);
    comparisonRoutes = comparisons.map((comp) => ({
      url: `${baseUrl}/compare/${comp.id1}/${comp.id2}`,
      lastModified: new Date(currentDate),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error generating comparison routes for sitemap", error);
  }

  // Blog routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const { getAllBlogPosts } = await import("@/lib/blog-posts");
    const posts = getAllBlogPosts();
    blogRoutes = [
      {
        url: `${baseUrl}/blog`,
        lastModified: new Date(currentDate),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      ...posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedDate || post.date),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
    ];
  } catch (error) {
    console.error("Error generating blog routes for sitemap", error);
  }

  return [
    ...staticRoutes,
    ...opportunityRoutes,
    ...categoryRoutes,
    ...guideRoutes,
    ...comparisonRoutes,
    ...blogRoutes,
  ];
}
