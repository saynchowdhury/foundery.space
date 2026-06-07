"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AppliedButtonProps {
  opportunityId: string;
  className?: string;
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

export function AppliedButton({
  opportunityId,
  className,
  variant = "default"
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
      toast.info("REMOVED_FROM_APPLIED");
    } else {
      next.add(opportunityId);
      toast.success("MARKED_AS_APPLIED");
    }
    setAppliedSet(next);
    setApplied(!applied);
  }

  if (variant === "technical") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={applied}
        className={cn(
          "inline-flex items-center justify-center gap-2 h-14 px-6 font-mono-technical text-[10px] tracking-widest uppercase border transition-all rounded-sm",
          mounted && applied
            ? "bg-green-600/10 border-green-600/50 text-green-400 hover:bg-green-600/20"
            : "border-white/10 text-white/40 bg-transparent hover:bg-white/5 hover:text-white/60",
          className
        )}
      >
        <Check className={cn("h-4 w-4", mounted && applied ? "text-green-400" : "text-white/20")} />
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
          : "border-green-600 text-green-700 dark:text-green-400 bg-transparent hover:bg-green-600/10",
        className
      )}
    >
      <Check className="h-4 w-4" />
      {mounted && applied ? "APPLIED" : "I_APPLIED"}
    </button>
  );
}
