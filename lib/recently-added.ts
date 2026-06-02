import { cache } from "react";
import { getAnonClient } from "@/lib/supabase";
import {
  CARD_COLUMNS,
  mapRowToCardData,
} from "@/lib/opportunities-public";
import type { OpportunityCardData } from "@/lib/data";

const EMPTY: RecentlyAddedResult = { recent: [], hasMore: false, windowDays: 30 };

export interface RecentlyAddedResult {
  recent: OpportunityCardData[];
  hasMore: boolean;
  windowDays: number;
}

const RECENT_WINDOW_DAYS = 30;
const RECENT_FETCH_LIMIT = 20;

export const fetchRecentlyAdded = cache(
  async (): Promise<RecentlyAddedResult> => {
    const since = new Date(
      Date.now() - RECENT_WINDOW_DAYS * 24 * 3600 * 1000
    ).toISOString();
    const { data, error } = await getAnonClient()
      .from("opportunities")
      .select(CARD_COLUMNS)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(RECENT_FETCH_LIMIT + 1);

    if (error || !data || data.length === 0) return EMPTY;

    const hasMore = data.length > RECENT_FETCH_LIMIT;
    const rows = hasMore ? data.slice(0, RECENT_FETCH_LIMIT) : data;
    const recent: OpportunityCardData[] = rows.map(mapRowToCardData);

    return { recent, hasMore, windowDays: RECENT_WINDOW_DAYS };
  }
);
