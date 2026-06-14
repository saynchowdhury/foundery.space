import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Clean raw text from the database for display.
 * Strips leftover markdown, HTML entities, and scraping artifacts.
 */
export function cleanDisplayText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    // Remove AI citation artifacts
    .replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, "")
    // Strip remaining markdown image syntax
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
    // Convert markdown links to just the text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // Strip markdown headings markers
    .replace(/^#{1,6}\s+/gm, "")
    // Strip bold/italic markers
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    // Strip strikethrough
    .replace(/~~(.*?)~~/g, "$1")
    // Strip inline code
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    // Convert markdown list markers to bullet points
    .replace(/^\s*[-*+]\s+/gm, "• ")
    // Remove table pipes
    .replace(/\|/g, " ")
    // Remove horizontal rules
    .replace(/^[-=]{3,}\s*$/gm, "")
    // Decode common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "...")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    // Fix Unicode replacement characters (best effort)
    .replace(/\uFFFD/g, "\u2013")
    // Collapse excessive whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Normalize a tag for consistent display.
 * Converts to title case with hyphens preserved.
 */
export function normalizeTagDisplay(tag: string): string {
  return tag
    .replace(/_/g, "-")
    .split("-")
    .map((word) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

/**
 * Format a tag as a URL-safe slug (for filtering, URLs).
 */
export function normalizeTagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Format a funding amount for display.
 * Handles large numbers with K/M suffixes.
 */
export function formatFunding(amount: number | undefined): string {
  if (!amount || amount <= 0) return "Varies";
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(amount % 1_000_000_000 === 0 ? 0 : 1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 1)}K`;
  return `$${amount.toLocaleString()}`;
}

/**
 * Safely parse a date string, returning null if invalid.
 */
export function safeParseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Safely stringify data for use in JSON-LD script tags.
 * Prevents XSS by escaping < and > characters to stop script tag breakouts.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}
