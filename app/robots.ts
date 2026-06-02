import { MetadataRoute } from "next";

/**
 * robots.ts — Crawl policy for foundery.space
 *
 * 2026 best practice: be explicit about AI crawlers (GPTBot, ClaudeBot,
 * PerplexityBot, Google-Extended, etc.) so it is unambiguous to operators
 * and to the crawlers themselves. The wildcard `*` already permits them,
 * but listing them is recommended for clarity and forward-compat.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/admin/", "/admin/"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Amazonbot",
          "Bytespider",
          "CCBot",
          "cohere-ai",
          "cohere-training-data-crawler",
          "Diffbot",
          "FacebookBot",
          "Meta-ExternalAgent",
          "YouBot",
          "PhindBot",
          "DuckAssistBot",
          "MistralAI-User",
        ],
        allow: "/",
        disallow: ["/api/admin/", "/admin/"],
      },
    ],
    sitemap: "https://foundery.space/sitemap.xml",
    host: "https://foundery.space",
  };
}
