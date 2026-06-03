"use client";

import { type OpportunityCardData } from "@/lib/data";
import { OpportunityCard } from "./opportunity-card";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface InfiniteCarouselProps {
  opportunities: OpportunityCardData[];
  direction?: "left" | "right";
  speed?: "normal" | "slow" | "fast";
  className?: string;
  from?: string;
}

export function InfiniteCarousel({
  opportunities,
  direction = "left",
  speed = "normal",
  className,
  from,
}: InfiniteCarouselProps) {
  // Memoize filtered opportunities to prevent unnecessary recalculations
  const openOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (!opp.closeDate) return true;
      return new Date(opp.closeDate) > new Date();
    });
  }, [opportunities]);

  return (
    <div
      className={cn(
        "w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      style={{ contentVisibility: "auto" }}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 gap-2 sm:gap-3 lg:gap-4 py-2 sm:py-4 w-max flex-nowrap",
          direction === "left" ? "animate-scroll" : "animate-scroll-reverse",
          speed === "slow" && "animation-duration-slow",
          speed === "fast" && "animation-duration-fast",
          "hover:[animation-play-state:paused]",
          "will-change-transform" // GPU acceleration hint
        )}
        style={{
          animationDuration:
            speed === "normal" ? "30s" : speed === "slow" ? "40s" : "20s",
        }}
      >
        {/* Real cards */}
        {openOpportunities.map((opportunity, idx) => (
          <div
            key={`${opportunity.id}-${idx}`}
            className="w-[280px] sm:w-[320px] lg:w-[350px] shrink-0"
          >
            <OpportunityCard
              opportunity={opportunity}
              className="w-full"
              isCarousel
              from={from}
              priority={idx < 2}
            />
          </div>
        ))}
        {/* Clones — aria-hidden for a11y, no priority loading */}
        {openOpportunities.map((opportunity, idx) => (
          <div
            key={`${opportunity.id}-${idx}-clone`}
            className="w-[280px] sm:w-[320px] lg:w-[350px] shrink-0"
            aria-hidden="true"
          >
            <OpportunityCard
              opportunity={opportunity}
              className="w-full"
              isCarousel
              from={from}
              priority={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
