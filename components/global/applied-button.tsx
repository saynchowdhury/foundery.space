"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

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
      aria-label={applied ? "Mark as not applied" : "Mark as applied"}
      className={`inline-flex items-center justify-center gap-2 h-10 px-4 font-mono-technical text-[10px] tracking-widest uppercase border transition-all rounded-sm ${
        mounted && applied
          ? "bg-brand/20 border-brand/50 text-brand hover:bg-brand/30 shadow-[0_0_10px_rgba(240,90,36,0.1)]"
          : "border-white/10 text-white/40 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 hover:text-white"
      } ${className || ""}`}
    >
      <Check size={14} className={mounted && applied ? "text-brand" : "text-white/20"} />
      {mounted && applied ? "APPLIED" : "MARK_APPLIED"}
    </button>
  );
}
