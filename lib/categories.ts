import type { Opportunity } from "@/lib/data";

/**
 * Single source of truth for opportunity categories.
 *
 * - `PRIMARY` is the canonical set exposed to users. Every category in this
 *   list must map to itself via `toCanonicalCategory` (i.e. it's already
 *   canonical).
 * - `LEGACY_ALIASES` maps the historical/plural forms that exist in the
 *   database to their canonical equivalent. `toCanonicalCategory` resolves
 *   any category string to its canonical form.
 *
 * Use `CATEGORIES` (canonical + "all") when building filter UIs.
 * Use `CATEGORY_LABELS` (singular, plural, slug) when rendering labels.
 * Use `CATEGORY_ORDER` when sorting in a predictable sequence.
 */
export const PRIMARY = [
  "fellowship",
  "accelerator",
  "incubator",
  "venture_capital",
  "grant",
  "residency",
  "competition",
  "research",
  "developer_program",
  "entrepreneurship",
  "startup_program",
] as const satisfies readonly Opportunity["category"][];

export type Category = (typeof PRIMARY)[number];

export const LEGACY_ALIASES: Record<string, Category> = {
  developer_programs: "developer_program",
};

const ALIAS_KEYS = new Set(Object.keys(LEGACY_ALIASES));

const PRIMARY_SET = new Set<string>(PRIMARY);

export function toCanonicalCategory(
  value: string,
): Category | null {
  if (PRIMARY_SET.has(value)) return value as Category;
  if (ALIAS_KEYS.has(value)) return LEGACY_ALIASES[value];
  return null;
}

export function isCategory(value: string): value is Category {
  return PRIMARY_SET.has(value);
}

export const CATEGORIES = ["all", ...PRIMARY] as const;
export type CategoryFilter = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, { singular: string; plural: string; slug: string }> = {
  fellowship: { singular: "Fellowship", plural: "Fellowships", slug: "fellowship" },
  accelerator: { singular: "Accelerator", plural: "Accelerators", slug: "accelerator" },
  incubator: { singular: "Incubator", plural: "Incubators", slug: "incubator" },
  venture_capital: { singular: "Venture Capital", plural: "Venture Capital", slug: "venture-capital" },
  grant: { singular: "Grant", plural: "Grants", slug: "grant" },
  residency: { singular: "Residency", plural: "Residencies", slug: "residency" },
  competition: { singular: "Competition", plural: "Competitions", slug: "competition" },
  research: { singular: "Research Program", plural: "Research Programs", slug: "research" },
  developer_program: { singular: "Developer Program", plural: "Developer Programs", slug: "developer-program" },
  entrepreneurship: { singular: "Entrepreneurship", plural: "Entrepreneurship", slug: "entrepreneurship" },
  startup_program: { singular: "Startup Program", plural: "Startup Programs", slug: "startup-program" },
};

/**
 * Plural label for any category string (handles legacy aliases too).
 */
export function categoryLabel(value: string): string {
  const canonical = toCanonicalCategory(value);
  if (!canonical) return value.replace(/_/g, " ");
  return CATEGORY_LABELS[canonical].plural;
}

/**
 * Singular label for any category string (handles legacy aliases too).
 */
export function categoryLabelSingular(value: string): string {
  const canonical = toCanonicalCategory(value);
  if (!canonical) return value.replace(/_/g, " ");
  return CATEGORY_LABELS[canonical].singular;
}

/**
 * URL slug for any category string.
 */
export function categorySlug(value: string): string {
  const canonical = toCanonicalCategory(value);
  if (!canonical) return value.replace(/_/g, "-");
  return CATEGORY_LABELS[canonical].slug;
}

/**
 * Both developer-program routes are valid legacy slugs. Returns the full
 * set of paths that should resolve to this category.
 */
export function categorySlugs(value: string): string[] {
  const canonical = toCanonicalCategory(value);
  if (canonical === "developer_program") return ["developer-program", "developer-programs"];
  if (!canonical) return [value];
  return [CATEGORY_LABELS[canonical].slug];
}

export const CATEGORY_ORDER: Record<Category, number> = {
  fellowship: 0,
  accelerator: 1,
  incubator: 2,
  venture_capital: 3,
  grant: 4,
  residency: 5,
  competition: 6,
  research: 7,
  developer_program: 8,
  entrepreneurship: 9,
  startup_program: 10,
};
