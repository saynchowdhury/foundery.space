"use client";

import { Share2 } from "lucide-react";
import { Opportunity } from "@/lib/data";
import { toast } from "sonner";

interface ShareButtonProps {
  opportunity: Opportunity;
  className?: string;
}

export function ShareButton({ opportunity, className }: ShareButtonProps) {
  const handleShare = async () => {
    const url = `${window.location.origin}/opportunity/${opportunity.id}`;
    const title = `${opportunity.name} | Foundery.Space`;
    const text = `Check out this opportunity: ${opportunity.name} on Foundery.Space`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${opportunity.name}`}
      className={`inline-flex items-center justify-center gap-1.5 h-10 px-4 text-[14px] border border-border bg-card hover:bg-accent transition-colors font-mono-technical uppercase tracking-wider ${
        className || ""
      }`}
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
}
