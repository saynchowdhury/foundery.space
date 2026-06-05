"use client";

import { Share2 } from "lucide-react";
import { type Opportunity, type OpportunityCardData } from "@/lib/data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  opportunity: Opportunity | OpportunityCardData;
  className?: string;
}

export function ShareButton({ opportunity, className }: ShareButtonProps) {
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/opportunity/${opportunity.id}`
    : "";
  const shareTitle = `${opportunity.name} | Foundery.Space`;
  const shareText = `Check out this opportunity on Foundery.Space: ${opportunity.name}`;

  const handleShare = async () => {
    // 1. Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        // If user cancelled, don't show error toast
        if ((err as Error).name === "AbortError") return;
        console.error("Error sharing:", err);
      }
    }

    // 2. Fallback to Clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("LINK_COPIED_TO_CLIPBOARD", {
        description: "Protocol synchronization complete.",
        className: "font-mono-technical text-[10px] uppercase tracking-widest",
      });
    } catch (err) {
      console.error("Failed to copy:", err);

      // 3. Last fallback: Open X/Twitter intent if clipboard fails
      const tweetText = `Check out ${opportunity.name} on @FounderySpace! ${shareUrl}`;
      const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        tweetText
      )}`;
      window.open(twitterIntentUrl, "_blank");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "inline-flex items-center justify-center gap-2 h-10 px-4 font-mono-technical text-[10px] tracking-widest uppercase border border-white/10 bg-white/5 hover:bg-brand/10 hover:border-brand/40 hover:text-brand transition-all transition-colors duration-300 rounded-sm",
        className
      )}
    >
      <Share2 className="h-3.5 w-3.5" />
      SHARE_LINK
    </button>
  );
}
