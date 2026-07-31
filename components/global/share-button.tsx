"use client";

import { Share2 } from "lucide-react";
import { Opportunity } from "@/lib/data";
import { Button, type ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonProps {
  opportunity: Opportunity;
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

export function ShareButton({
  opportunity,
  className,
  variant = "outline",
  size = "default",
}: ShareButtonProps) {
  const shareData = {
    title: `${opportunity.name} | Foundery.Space`,
    text: `Excited to share that I'm applying to ${opportunity.name}! This could be the start of an incredible new chapter.`,
    url: typeof window !== "undefined" ? window.location.href : "",
  };

  const handleShare = async () => {
    // Try native Web Share API first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
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

    // Fallback to X (Twitter) intent
    const tweetText = `${shareData.text}\n\n${shareData.url}`;
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tweetText
    )}`;

    try {
      window.open(twitterIntentUrl, "_blank");
    } catch (err) {
      console.error("Error opening twitter intent:", err);
      // Last resort: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        toast.success("Link copied to clipboard!");
      } catch (clipErr) {
        console.error("Clipboard error:", clipErr);
      }
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
      aria-label={`Share ${opportunity.name}`}
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  );
}
