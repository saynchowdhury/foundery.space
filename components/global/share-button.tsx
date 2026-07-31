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
      title: opportunity.name,
      text: `Check out this opportunity: ${opportunity.name} on Foundery.Space`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      } catch (err) {
        console.error("Error copying to clipboard:", err);
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "inline-flex items-center justify-center gap-2 h-14 px-6 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-brand/40 transition-all font-mono-technical text-[10px] tracking-widest uppercase rounded-sm group",
        className
      )}
    >
      <Share2 className="h-4 w-4 text-brand/60 group-hover:text-brand transition-colors" />
      SHARE_INTEL
    </button>
  );
}
