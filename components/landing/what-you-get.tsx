"use client";

import {
  Search,
  Filter,
  Bell,
  Users,
  Clock,
  Calendar,
  TrendingUp,
} from "lucide-react";

const cards = [
  {
    icon: Search,
    eyebrow: "Discovery",
    title: "One directory, every program",
    body: "Fellowships, grants, accelerators, residencies, and developer programs — in one ranked list. No more 12 open tabs.",
    span: "md:col-span-2 md:row-span-2",
    emphasis: true,
  },
  {
    icon: Filter,
    eyebrow: "Filtering",
    title: "Filter to what you can actually apply to",
    body: "Open vs. rolling, region, funding range, equity-free, deadline urgency — find programs that match your profile in seconds.",
    span: "md:col-span-2 md:row-span-2",
    emphasis: true,
  },
  {
    icon: TrendingUp,
    eyebrow: "Ranking",
    title: "Community voted",
    body: "Programs move up as founders upvote the ones that matter.",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    icon: Bell,
    eyebrow: "Reminders",
    title: "Add deadlines to your calendar",
    body: "One click to push to Google, Outlook, or Apple. Never miss a window.",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    icon: Clock,
    eyebrow: "Refreshed weekly",
    title: "New every Monday",
    body: "New opportunities from across the web, automated every week.",
    span: "md:col-span-1 md:row-span-1",
  },
];

export function WhatYouGetSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
      <div className="text-center mb-8 sm:mb-12">
        <span className="eyebrow text-[var(--brand-light)]">
          Why Foundery.Space
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mt-2 mb-3">
          Built for builders who don&apos;t miss opportunities
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          A focused, ranked directory — not a content farm. Every feature earns
          its place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`group relative border border-border bg-card p-5 sm:p-6 transition-colors hover:border-[var(--brand)] ${card.span}`}
            >
              <div className="flex items-center gap-2 mb-3 text-[var(--brand-light)]">
                <Icon className="w-4 h-4" />
                <span className="eyebrow">{card.eyebrow}</span>
              </div>
              <h3 className="text-base sm:text-lg font-medium leading-snug mb-1.5">
                {card.title}
              </h3>
              <p
                className={`text-muted-foreground leading-relaxed ${
                  card.emphasis
                    ? "text-[14px] sm:text-[15px]"
                    : "text-[13px] sm:text-[14px]"
                }`}
              >
                {card.body}
              </p>
              {card.emphasis && (
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
