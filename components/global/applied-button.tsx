"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AppliedButtonProps {
  opportunityId: string;
  variant?: "default" | "technical";
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

export function AppliedButton({ opportunityId, variant = "default" }: AppliedButtonProps) {
  const [applied, setApplied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setApplied(getAppliedSet().has(opportunityId));
  }, [opportunityId]);

  function toggle() {
    const next = getAppliedSet();
    const isNowApplied = !applied;

    if (applied) {
      next.delete(opportunityId);
      toast.info("Removed from applied opportunities");
    } else {
      next.add(opportunityId);
      toast.success("Marked as applied!");
    }

    setAppliedSet(next);
    setApplied(isNowApplied);
  }

  if (variant === "technical") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={applied}
        className={cn(
          "w-full h-12 flex items-center justify-center gap-2 border font-mono-technical text-[10px] tracking-widest transition-all duration-300 rounded-sm",
          mounted && applied
            ? "bg-green-500/10 border-green-500/50 text-green-500 hover:bg-green-500/20"
            : "bg-white/[0.02] border-white/10 text-white/40 hover:border-brand/40 hover:text-brand"
        )}
      >
        <Check className={cn("h-3 w-3", mounted && applied ? "opacity-100" : "opacity-20")} />
        {mounted && applied ? "STATUS_APPLIED" : "MARK_AS_APPLIED"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={applied}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 h-10 px-4 text-[14px] border transition-colors",
        mounted && applied
          ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
          : "border-green-600 text-green-700 dark:text-green-400 bg-transparent hover:bg-green-600/10"
      )}
    >
      <Check className="h-4 w-4" />
      {mounted && applied ? "Applied" : "I applied"}
    </button>
  );
}
