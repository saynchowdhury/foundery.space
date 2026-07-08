"use client";

import { Share2 } from "lucide-react";
import { Opportunity } from "@/lib/data";

interface ShareButtonProps {
  opportunity: Opportunity;
  className?: string;
}

export function ShareButton({ opportunity, className }: ShareButtonProps) {
  const handleShare = () => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://foundery.space";
    const opportunityUrl = `${siteUrl}/opportunity/${opportunity.id}`;
    const tweetText = `Check out this opportunity: ${opportunity.name} on @FounderySpace\n\n${opportunityUrl}`;
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;
    window.open(twitterIntentUrl, "_blank");
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${opportunity.name} on X`}
      className={`inline-flex items-center justify-center gap-2 h-10 px-4 font-mono-technical text-[10px] tracking-widest uppercase border border-white/10 bg-white/[0.02] hover:bg-brand/10 hover:border-brand/50 hover:text-brand transition-all rounded-sm ${
        className || ""
      }`}
    >
      <Share2 size={14} />
      SHARE_ON_X
    </button>
  );
}
