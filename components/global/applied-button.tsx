"use client";

import { useEffect, useState } from "react";
import { Check, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppliedButtonProps {
  opportunityId: string;
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

export function AppliedButton({ opportunityId, className }: AppliedButtonProps) {
  const [applied, setApplied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setApplied(getAppliedSet().has(opportunityId));
  }, [opportunityId]);

  function toggle() {
    const next = getAppliedSet();
    if (applied) next.delete(opportunityId);
    else next.add(opportunityId);
    setAppliedSet(next);
    setApplied(!applied);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={applied}
      className={cn(
        "inline-flex items-center justify-center gap-2 h-10 px-4 font-mono-technical text-[10px] tracking-widest uppercase transition-all duration-300 rounded-sm border",
        mounted && applied
          ? "bg-green-500/10 border-green-500/40 text-green-400 hover:bg-green-500/20"
          : "border-white/10 bg-white/5 text-white/40 hover:border-brand/40 hover:text-brand hover:bg-brand/10",
        className
      )}
    >
      {mounted && applied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          STATUS_APPLIED
        </>
      ) : (
        <>
          <ShieldAlert className="h-3.5 w-3.5" />
          MARK_AS_APPLIED
        </>
      )}
    </button>
  );
}
