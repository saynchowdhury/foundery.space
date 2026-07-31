"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { FilterPanel, type FilterOptions } from "@/components/filters/filter-panel";
import type { Category } from "@/lib/categories";

export interface BrowseFilterState {
  fundingAmount: { min: number; max: number };
  equityPercentage: { min: number; max: number };
  duration: { min: number; max: number; unit: "weeks" | "months" | "years" };
  categories: Category[];
  regions: string[];
  tags: string[];
}

export const EMPTY_FILTERS: BrowseFilterState = {
  fundingAmount: { min: 0, max: 2000000 },
  equityPercentage: { min: 0, max: 20 },
  duration: { min: 0, max: 52, unit: "weeks" },
  categories: [],
  regions: [],
  tags: [],
};

interface MoreFiltersSheetProps {
  state: BrowseFilterState;
  onChange: (next: BrowseFilterState) => void;
}

function countActive(state: BrowseFilterState): number {
  let count = 0;
  count += state.categories.length;
  count += state.regions.length;
  count += state.tags.length;
  if (state.fundingAmount.min > 0 || state.fundingAmount.max < 2000000) count += 1;
  if (state.equityPercentage.min > 0 || state.equityPercentage.max < 20) count += 1;
  if (state.duration.min > 0 || state.duration.max < 52) count += 1;
  return count;
}

export function MoreFiltersSheet({ state, onChange }: MoreFiltersSheetProps) {
  const [open, setOpen] = useState(false);
  const active = countActive(state);

  const filterOptions: FilterOptions = {
    categories: state.categories,
    regions: state.regions,
    tags: state.tags,
    fundingAmount: state.fundingAmount,
    equityPercentage: state.equityPercentage,
    duration: state.duration,
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 shrink-0"
          aria-label="More filters"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">More</span>
          {active > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {active}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col bg-card"
      >
        <SheetHeader className="px-5 py-4 border-b flex-row items-center justify-between">
          <SheetTitle>More filters</SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" aria-label="Close filters">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-5">
          <FilterPanel
            filters={filterOptions}
            onFiltersChange={(next) => {
              onChange({
                fundingAmount: next.fundingAmount,
                equityPercentage: next.equityPercentage,
                duration: next.duration,
                categories: next.categories,
                regions: next.regions,
                tags: next.tags,
              });
            }}
            isOpen
            onToggle={() => setOpen(false)}
          />
        </div>
        <div className="px-5 py-3 border-t flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="flex-1"
          >
            Clear all
          </Button>
          <Button size="sm" onClick={() => setOpen(false)} className="flex-1">
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
