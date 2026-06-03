import { getAnonClient } from "@/lib/supabase";

export interface HomeStats {
  total: number;
  open: number;
  categories: { category: string; count: number }[];
}

const KNOWN_CATEGORIES = [
  "fellowship",
  "accelerator",
  "incubator",
  "grant",
  "developer_program",
  "entrepreneurship",
  "research",
  "venture_capital",
  "residency",
  "competition",
  "startup_program",
];

/**
 * Cheap count for the homepage hero copy. Runs in parallel, best-effort.
 * Always returns a number (defaults to 0 on error).
 */
export async function fetchHomeStats(): Promise<HomeStats> {
  const client = getAnonClient();

  const [totalRes, openRes, ...categoryRes] = await Promise.all([
    client.from("opportunities").select("id", { count: "exact", head: true }),
    client
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .or("close_date.is.null,close_date.gt." + new Date().toISOString()),
    ...KNOWN_CATEGORIES.map((c) =>
      client
        .from("opportunities")
        .select("id", { count: "exact", head: true })
        .eq("category", c),
    ),
  ]);

  const categories = categoryRes
    .map((res, i) => ({
      category: KNOWN_CATEGORIES[i],
      count: res.count ?? 0,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    total: totalRes.count ?? 0,
    open: openRes.count ?? 0,
    categories,
  };
}
