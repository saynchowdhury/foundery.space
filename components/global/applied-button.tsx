"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AppliedButtonProps {
  opportunityId: string;
  variant?: "default" | "technical";
  className?: string;
}

function getAppliedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem("fs_applied") || "[]"));
  } catch {
    return new Set();
  }
}

function setAppliedSet(set: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("fs_applied", JSON.stringify(Array.from(set)));
}

export function AppliedButton({
  opportunityId,
  variant = "default",
  className
}: AppliedButtonProps) {
  const [applied, setApplied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setApplied(getAppliedSet().has(opportunityId));
  }, [opportunityId]);

  function toggle() {
    const next = getAppliedSet();
    if (applied) {
      next.delete(opportunityId);
      toast.info("Opportunity removed from your applied list");
    } else {
      next.add(opportunityId);
      toast.success("Opportunity marked as applied");
    }
    setAppliedSet(next);
    setApplied(!applied);
  }

  const isTechnical = variant === "technical";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={applied}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-10 px-4 text-[14px] border transition-colors rounded-sm",
        mounted && applied
          ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
          : "border-green-600 text-green-700 dark:text-green-400 bg-transparent hover:bg-green-600/10",
        isTechnical && "font-mono-technical text-[12px] tracking-widest",
        className
      )}
    >
      <Check className={cn("h-4 w-4", isTechnical && "h-3.5 w-3.5")} />
      {mounted && applied
        ? (isTechnical ? "STATUS_APPLIED" : "Applied")
        : (isTechnical ? "MARK_AS_APPLIED" : "I applied")}
    </button>
  );
}
