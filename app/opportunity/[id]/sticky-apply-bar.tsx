"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { AppliedButton } from "@/components/global/applied-button";
import { ShareButton } from "@/components/global/share-button";
import { Opportunity } from "@/lib/data";

const ACCENT = "var(--brand)";

interface StickyApplyBarProps {
  opportunity: Opportunity;
  anchorId?: string;
}

export function StickyApplyBar({
  opportunity,
  anchorId = "opportunity-apply-anchor",
}: StickyApplyBarProps) {
  const [showBar, setShowBar] = useState(false);
  const { applyLink, id: opportunityId } = opportunity;

  useEffect(() => {
    if (!applyLink) return;

    let observer: IntersectionObserver | null = null;
    let raf = 0;

    const setup = () => {
      const target = document.getElementById(anchorId);
      if (!target) {
        setShowBar(true);
        return;
      }

      const rect = target.getBoundingClientRect();
      if (rect.top >= window.innerHeight || rect.bottom <= 0) {
        setShowBar(true);
      } else {
        setShowBar(false);
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          setShowBar(!entry.isIntersecting);
        },
        { threshold: 0, rootMargin: "0px 0px -10px 0px" },
      );
      observer.observe(target);
    };

    raf = requestAnimationFrame(setup);

    return () => {
      cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
    };
  }, [applyLink, anchorId]);

  if (!applyLink) return null;

  return (
    <>
      <div
        aria-hidden
        className={`${showBar ? "h-20" : "h-0"} transition-[height] duration-200`}
      />
      <div
        role="region"
        aria-label="Apply to this opportunity"
        className={`fixed inset-x-0 bottom-0 z-40 bg-background/95 backdrop-blur border-t border-border transition-transform duration-200 ease-out ${
          showBar ? "translate-y-0" : "translate-y-full pointer-events-none"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-5 py-3 flex items-center gap-2 sm:gap-3 pr-24 sm:pr-4">
          <a
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-11 px-5 text-white text-[14px] font-medium flex-1 sm:flex-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--brand)]"
            style={{ background: ACCENT }}
          >
            Apply now
            <ExternalLink className="w-4 h-4" />
          </a>
          <AppliedButton opportunityId={opportunityId} className="h-11" />
          <ShareButton opportunity={opportunity} className="h-11" />
        </div>
      </div>
    </>
  );
}
