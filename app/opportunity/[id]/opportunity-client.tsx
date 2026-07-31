"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, MapPin, Clock, Globe, Tag, Building2, DollarSign, Users, ShieldCheck } from "lucide-react";
import { SiteShell } from "@/components/global/site-shell";
import { PageBreadcrumb } from "@/components/global/page-breadcrumb";
import { AppliedButton } from "@/components/global/applied-button";
import { ShareButton } from "@/components/global/share-button";
import { StickyApplyBar } from "@/app/opportunity/[id]/sticky-apply-bar";
import { AsciiHeading } from "@/components/ui/ascii-heading";

import { getDaysUntilDeadline, type Opportunity } from "@/lib/data";
import { categoryLabel, categoryLabelSingular, categorySlug } from "@/lib/categories";
import { cleanDisplayText, normalizeTagDisplay, formatFunding } from "@/lib/utils";

function deadlineInfo(closeDate: Opportunity["closeDate"]) {
  if (closeDate === "closed") {
    return {
      big: "CLOSED",
      sub: "APPLICATIONS_TERMINATED",
      tone: "closed" as const,
    };
  }
  if (!closeDate) {
    return {
      big: "ROLLING",
      sub: "PROTOCOL_OPEN_ALWAYS",
      tone: "rolling" as const,
    };
  }
  const days = getDaysUntilDeadline(closeDate);
  if (days < 0) {
    return {
      big: "CLOSED",
      sub: `TERMINATED_ON_${new Date(closeDate).toLocaleDateString().toUpperCase()}`,
      tone: "closed" as const,
    };
  }
  const big =
    days === 0
      ? "TODAY"
      : days === 1
        ? "1 DAY LEFT"
        : days < 30
          ? `${days} DAYS LEFT`
          : days < 365
            ? `${Math.floor(days / 30)} MONTHS LEFT`
            : `${Math.floor(days / 365)} YEARS LEFT`;
  const sub = `CLOSES_${new Date(closeDate).toLocaleDateString().toUpperCase()}`;
  const tone: "urgent" | "soon" | "ok" =
    days < 14 ? "urgent" : days < 60 ? "soon" : "ok";
  return { big, sub, tone };
}

export default function OpportunityPageClient({ opportunity }: { opportunity: Opportunity }) {
  const deadline = deadlineInfo(opportunity.closeDate);
  const catSlug = categorySlug(opportunity.category);

  return (
    <SiteShell>
      <div className="pt-32 pb-24 font-light">
      <div className="max-w-7xl mx-auto px-6">
        <PageBreadcrumb
          className="mb-12"
          items={[
            { label: "Home", href: "/" },
            { label: "Browse", href: "/browse" },
            {
              label: categoryLabelSingular(opportunity.category),
              href: `/${catSlug}`,
            },
            { label: opportunity.name },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
          {/* Main Intelligence Block */}
          <div>
            <div className="flex items-center gap-6 mb-12">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-black border border-white/10 p-2 rounded-sm group hover:border-brand/40 transition-colors duration-500">
                {opportunity.logoUrl ? (
                  <Image
                    src={opportunity.logoUrl}
                    alt={opportunity.name}
                    fill
                    className="object-cover p-2 transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-ascii text-3xl text-white/10 uppercase">
                    {opportunity.name.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />
              </div>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono-technical text-[8px] text-brand/60 tracking-[0.3em] uppercase">PROTOCOL_ID::{opportunity.id.slice(0, 12)}</span>
                  <div className="px-2 py-0.5 border border-brand/20 bg-brand/5 rounded-sm">
                    <span className="font-mono-technical text-[7px] text-brand uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck size={8} /> AUTHENTICATED
                    </span>
                  </div>
                </div>
                <AsciiHeading text={opportunity.name.toUpperCase()} className="text-4xl md:text-6xl tracking-tighter" />
              </div>
            </div>

            {/* Description Section */}
            <section className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <span className="font-mono-technical text-[9px] text-brand tracking-[0.2em] uppercase">DATA_OVERVIEW</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <p className="text-lg text-muted-foreground/90 leading-relaxed whitespace-pre-line font-light">
                {cleanDisplayText(opportunity.fullDescription || opportunity.description)}
              </p>
            </section>

            {/* Technical Specifications (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {opportunity.benefits.length > 0 && (
                <div className="p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-brand/40 transition-colors" />
                  <span className="font-mono-technical text-[9px] text-brand mb-6 block uppercase tracking-[0.2em]">YIELD_BENEFITS</span>
                  <ul className="space-y-4">
                    {opportunity.benefits.map((b, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-3 leading-relaxed">
                        <span className="text-brand/40 mt-0.5">::</span> {cleanDisplayText(b)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {opportunity.eligibility && (
                <div className="p-8 border border-white/5 bg-white/[0.01] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 group-hover:border-brand/40 transition-colors" />
                  <span className="font-mono-technical text-[9px] text-brand mb-6 block uppercase tracking-[0.2em]">ELIGIBILITY_REQUIREMENTS</span>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {cleanDisplayText(opportunity.eligibility)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tactical Sidebar */}
          <aside className="space-y-8">
            <div className="p-8 border border-brand/20 bg-brand/[0.02] relative overflow-hidden rounded-sm">
              <div className="absolute top-0 right-0 w-12 h-[1px] bg-brand/40" />
              <div className="absolute top-0 right-0 w-[1px] h-12 bg-brand/40" />
              
              <div className="flex flex-col gap-8 relative z-10">
                <div>
                  <span className="font-mono-technical text-[9px] text-brand/60 uppercase tracking-widest block mb-3">SYSTEM_DEADLINE</span>
                  <div className="text-5xl font-ascii text-foreground uppercase tracking-tight">{deadline.big}</div>
                  <div className="font-mono-technical text-[10px] text-white/30 uppercase mt-3 tracking-widest">{deadline.sub}</div>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href={opportunity.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-14 bg-brand text-black font-mono-technical text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-brand/90 transition-all rounded-sm font-bold"
                  >
                    INITIALIZE_APPLICATION <ExternalLink size={14} />
                  </a>
                  <div className="grid grid-cols-2 gap-3">
                    <AppliedButton opportunityId={opportunity.id} className="w-full" />
                    <ShareButton opportunity={opportunity} className="w-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/5 bg-white/[0.01] rounded-sm">
              <span className="font-mono-technical text-[9px] text-white/40 uppercase tracking-widest block mb-8">INTEL_PARAMETERS</span>
              
              <div className="space-y-8">
                <div className="flex flex-col gap-2 pb-6 border-b border-white/5">
                  <span className="text-[8px] text-white/20 uppercase tracking-[0.3em] flex items-center gap-2"><Building2 size={10} /> ORGANIZER</span>
                  <span className="text-xs text-foreground uppercase font-mono-technical tracking-wider">{opportunity.organizer}</span>
                </div>

                {opportunity.funding && (
                  <div className="flex flex-col gap-2 pb-6 border-b border-white/5">
                    <span className="text-[8px] text-white/20 uppercase tracking-[0.3em] flex items-center gap-2"><DollarSign size={10} /> FUNDING_LEVEL</span>
                    <span className="text-xl text-brand font-mono-technical tracking-tighter">{formatFunding(opportunity.funding.amount)}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2 pb-6 border-b border-white/5">
                  <span className="text-[8px] text-white/20 uppercase tracking-[0.3em] flex items-center gap-2"><Globe size={10} /> REGION_DOMAIN</span>
                  <span className="text-xs text-foreground uppercase font-mono-technical tracking-wider">{opportunity.region}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {opportunity.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1.5 bg-white/5 border border-white/10 text-[9px] text-white/30 font-mono-technical uppercase tracking-tighter hover:border-brand/30 hover:text-brand/50 transition-colors cursor-default">
                    #{normalizeTagDisplay(t)}
                  </span>
                ))}
              </div>
            </div>

            <Link href={`/${catSlug}`} className="block p-8 border border-white/5 bg-white/[0.01] hover:border-brand/20 transition-all group rounded-sm">
              <span className="font-mono-technical text-[9px] text-white/40 uppercase tracking-widest block mb-4">CROSS_PROTOCOL_SYNC</span>
              <div className="text-xs text-brand/80 group-hover:text-brand flex items-center gap-2 tracking-[0.2em] font-mono-technical uppercase">
                EXPLORE_SIMILAR_NODES <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          </aside>
        </div>
      </div>
      
      {opportunity.applyLink && (
        <StickyApplyBar
          opportunity={opportunity}
        />
      )}
      </div>
    </SiteShell>
  );
}
