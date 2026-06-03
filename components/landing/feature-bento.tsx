"use client";

import React from "react";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Search, Globe, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

// Static data — moved outside component to avoid recreation on every render
const FEATURES = [
  {
    title: "Discovery Engine",
    description:
      "Browse 100+ fellowships, grants, accelerators, and residencies — all in one ranked directory, refreshed every Monday. Never dig through dozens of sites again.",
    icon: <Search className="w-5 h-5" />,
    className: "md:col-span-2 lg:col-span-2",
    href: "/browse",
  },
  {
    title: "Global Coverage",
    description:
      "Opportunities spanning 40+ countries — from US fellowships to European grants and Asia-Pacific accelerators.",
    icon: <Globe className="w-5 h-5" />,
    className: "md:col-span-1 lg:col-span-1",
    href: "/browse",
  },
  {
    title: "Deadline Tracking",
    description:
      "Never miss an application window. Deadlines surfaced clearly — filter by closing soon, rolling, or open year-round.",
    icon: <Clock className="w-5 h-5" />,
    className: "md:col-span-1 lg:col-span-1",
    href: "/browse",
  },
  {
    title: "Community Ranked",
    description:
      "Vote on the opportunities that matter most. The community surfaces the best programs so you don't have to dig through noise.",
    icon: <Users className="w-5 h-5" />,
    className: "md:col-span-2 lg:col-span-2",
    href: "/browse",
  },
];

export const FeatureBento = () => {
  return (
    <section className="py-32 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono-technical text-brand text-[10px] tracking-[0.3em] uppercase mb-4"
        >
          WHAT_WE_DO
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl font-light text-foreground max-w-3xl leading-tight tracking-tight"
        >
          Built for the{" "}
          <span className="text-brand">ambitious builder</span>.
        </motion.h2>
      </div>

      <BentoGrid>
        {FEATURES.map((feature, i) => (
          <BentoCard
            key={i}
            index={i}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            className={feature.className}
            href={feature.href}
          />
        ))}
      </BentoGrid>
    </section>
  );
};
