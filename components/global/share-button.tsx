"use client";

import { Share2 } from "lucide-react";
import { Opportunity } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  opportunity: Opportunity;
  className?: string;
}

export function ShareButton({ opportunity, className }: ShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title: `${opportunity.name} - Foundery.Space`,
      text: `Check out this opportunity: ${opportunity.name} on Foundery.Space`,
      url: window.location.href,
    };

    const canShare = navigator.canShare ? navigator.canShare(shareData) : !!navigator.share;
    if (canShare) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        } else {
          return; // User cancelled
        }
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      // Last resort fallback: open Twitter intent
      const shareText = `Check out this opportunity: ${opportunity.name} on Foundery.Space`;
      const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(window.location.href)}`;
      window.open(twitterIntentUrl, "_blank");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${opportunity.name}`}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-10 px-4 text-[14px] border border-border bg-card hover:bg-accent transition-colors",
        className
      )}
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
}
