"use client";

import React, { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import {
  type OpportunityCardData,
  getDaysUntilDeadline,
  getDeadlineUrgency,
} from "@/lib/data";
import { generateAltText } from "@/lib/image-seo";
import { categoryLabelSingular } from "@/lib/categories";
import { cn, cleanDisplayText } from "@/lib/utils";

interface OpportunityCardProps {
  opportunity: OpportunityCardData;
  variant?: "default" | "compact";
  className?: string;
  isCarousel?: boolean;
  from?: string;
  priority?: boolean;
}

function OpportunityCardInner({
  opportunity,
  variant = "default",
  className,
  isCarousel = false,
  from,
  priority = false,
}: OpportunityCardProps) {
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  
  const daysUntil = opportunity.closeDate
    ? getDaysUntilDeadline(opportunity.closeDate)
    : null;
  const urgency = opportunity.closeDate
    ? getDeadlineUrgency(opportunity.closeDate)
    : "safe";
  const altText = generateAltText(opportunity);

  // Direct DOM manipulation — avoids React re-renders on every mouse pixel
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) return;
    // Guard: currentTarget can be null if event is pooled/replayed
    if (!e.currentTarget) return;
    // Capture values synchronously before the async RAF callback
    const clientX = e.clientX;
    const clientY = e.clientY;
    let rect: DOMRect;
    try {
      rect = e.currentTarget.getBoundingClientRect();
    } catch {
      return;
    }
    rafRef.current = requestAnimationFrame(() => {
      if (glowRef.current) {
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        glowRef.current.style.background = `radial-gradient(500px circle at ${x}px ${y}px, var(--brand-dim), transparent 45%)`;
      }
      rafRef.current = null;
    });
  }, []);

  const getOpportunityUrl = () => {
    const baseUrl = `/opportunity/${opportunity.id}`;
    return from ? `${baseUrl}?from=${from}` : baseUrl;
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "group relative overflow-hidden bg-[#0a0a0a] border border-white/5 p-5 md:p-6 transition-all duration-700 hover:border-brand/40 shadow-2xl",
        isCarousel ? "h-[340px]" : "h-full",
        className
      )}
    >
      {/* Dynamic Background Glow — ref-based, zero re-renders */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start gap-5 mb-5">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-black border border-white/10 group-hover:border-brand/30 transition-colors duration-500">
            {opportunity.logoUrl ? (
              <Image
                src={opportunity.logoUrl}
                alt={altText}
                fill
                className="object-cover p-1.5 transition-all duration-700 group-hover:scale-110 group-hover:rotate-2 group-hover:brightness-110"
                priority={priority}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-ascii text-2xl text-white/10 uppercase">
                {opportunity.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
            <motion.div 
              animate={{ y: ["0%", "100%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-[2px] bg-brand/30 z-10 pointer-events-none"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <span className="font-mono-technical text-[8px] text-brand/60 tracking-[0.25em] uppercase">
                NODE_INTEL::{opportunity.id.slice(0, 8)}
              </span>
              <div className="h-[1px] flex-1 bg-white/5" />
              <div className={cn(
                "flex items-center gap-1 font-mono-technical text-[7px] px-2 py-0.5 border tracking-[0.2em] transition-all duration-500",
                urgency === "urgent" ? "border-brand/40 text-brand bg-brand/10 shadow-[0_0_8px_rgba(240,90,36,0.2)]" : "border-white/10 text-white/30"
              )}>
                <ShieldCheck size={8} className={urgency === "urgent" ? "text-brand" : "text-white/20"} />
                {urgency === "urgent" ? "PRIORITY_OMEGA" : "SYSTEM_STABLE"}
              </div>
            </div>
            <Link href={getOpportunityUrl()} prefetch={true}>
              <h3 className="font-ascii text-2xl text-foreground group-hover:text-brand transition-all duration-500 leading-none tracking-tight uppercase">
                {opportunity.name}
              </h3>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-grow">
          <p className="text-muted-foreground/80 text-[13px] leading-relaxed line-clamp-3 mb-6 font-light group-hover:text-foreground transition-colors duration-500">
            {cleanDisplayText(opportunity.description)}
          </p>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 bg-white/[0.01]">
          <div className="flex flex-col gap-1">
            <span className="font-mono-technical text-[7px] text-white/20 uppercase tracking-[0.2em]">PROTOCOL_REGION</span>
            <div className="flex items-center gap-2 text-foreground/70 text-[11px]">
              <MapPin size={11} className="text-brand/50" />
              <span className="truncate uppercase">{opportunity.region}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono-technical text-[7px] text-white/20 uppercase tracking-[0.2em]">EXPIRY_SEQUENCE</span>
            <div className="flex items-center gap-2 text-foreground/70 text-[11px]">
              <Calendar size={11} className="text-brand/50" />
              <span className="font-mono-technical uppercase">
                {daysUntil === null ? "ROLLING_CYCLE" : daysUntil <= 0 ? "STALE_NODE" : `${daysUntil}D_UNTIL_LOCK`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            <span className="font-mono-technical text-[9px] text-brand/70 bg-brand/5 border border-brand/10 px-2.5 py-1 uppercase tracking-wider">
              {categoryLabelSingular(opportunity.category)}
            </span>
          </div>
          
          <Link 
            href={getOpportunityUrl()}
            prefetch={true}
            className="group/link font-mono-technical text-[10px] text-foreground hover:text-brand transition-all flex items-center gap-2 tracking-widest uppercase px-3 py-1.5 border border-white/10 hover:border-brand/50 hover:bg-brand/5"
          >
            VIEW_DETAILS <ExternalLink size={11} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Futuristic Accents */}
      <div className="absolute top-0 right-0 w-10 h-[1px] bg-brand/40 group-hover:w-full transition-all duration-700" />
      <div className="absolute top-0 right-0 w-[1px] h-10 bg-brand/40 group-hover:h-full transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-3 h-[1px] bg-white/10" />
      <div className="absolute bottom-0 left-0 w-[1px] h-3 bg-white/10" />
      
      {/* Corner Brackets */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20" />
    </motion.div>
  );
}

// Memoized to skip re-renders when parent updates with identical card data
export const OpportunityCard = React.memo(OpportunityCardInner, (prev, next) => {
  // Fast-path: skip render if the opportunity id and variant props are identical
  return (
    prev.opportunity.id === next.opportunity.id &&
    prev.variant === next.variant &&
    prev.isCarousel === next.isCarousel &&
    prev.from === next.from &&
    prev.priority === next.priority &&
    prev.className === next.className
  );
});
OpportunityCard.displayName = "OpportunityCard";
