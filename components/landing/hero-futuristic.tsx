"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { AsciiHeading } from "@/components/ui/ascii-heading";
import { motion, AnimatePresence } from "framer-motion";

const BackgroundGrid = dynamic(
  () =>
    import("@/components/ui/background-grid").then((m) => m.BackgroundGrid),
  { ssr: false }
);

const FOUNDER_IMAGES = [
  {
    src: "/images/think-different.jpg",
    name: "Steve Jobs",
    quote: "Think Different.",
    sub: "The people crazy enough to think they can change the world are the ones who do.",
  },
  {
    src: "/images/mark-zuckerberg.jpg",
    name: "Mark Zuckerberg",
    quote: "Just Start.",
    sub: "The biggest risk is not taking any risk.",
  },
  {
    src: "/images/founder3.jpg",
    name: "The Builder",
    quote: "Keep Building.",
    sub: "Every opportunity you discover is one step closer.",
  },
];

interface HeroFuturisticProps {
  openCount?: number;
}

export const HeroFuturistic = ({ openCount: _ }: HeroFuturisticProps) => {
  const [current, setCurrent] = useState(0);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % FOUNDER_IMAGES.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) setShowGrid(true);
    };
    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(run);
      return () => {
        cancelled = true;
        cancelIdleCallback(id);
      };
    }
    const t = setTimeout(run, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const img = FOUNDER_IMAGES[current];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 overflow-hidden bg-[#050505]">
      {/* Lightweight CSS grid — paints immediately */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(240, 90, 36, 0.15) 25%, rgba(240, 90, 36, 0.15) 26%, transparent 27%, transparent 74%, rgba(240, 90, 36, 0.15) 75%, rgba(240, 90, 36, 0.15) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(240, 90, 36, 0.15) 25%, rgba(240, 90, 36, 0.15) 26%, transparent 27%, transparent 74%, rgba(240, 90, 36, 0.15) 75%, rgba(240, 90, 36, 0.15) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {showGrid && <BackgroundGrid />}

      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={img.src}
            alt={img.name}
            fill
            sizes="100vw"
            priority={current === 0}
            loading={current === 0 ? "eager" : "lazy"}
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/60" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 text-center px-4 w-full max-w-5xl mx-auto">

        <AsciiHeading
          text="FOUNDERY"
          className="text-6xl md:text-9xl mb-6 tracking-tighter"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed mb-8"
        >
          <span className="text-foreground font-medium">Discover Fellowships, Grants</span>
          <span className="text-white/60"> &amp; </span>
          <span className="text-brand font-medium">Startup Opportunities</span>
          <span className="text-white/50"> — ranked by the community, tracked by deadline.</span>
        </motion.p>

        <form
          action="/browse"
          method="get"
          className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-xl mx-auto mb-8"
        >
          <div className="flex-1 relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
              aria-hidden
            />
            <input
              name="q"
              type="search"
              placeholder="Search programs, grants, accelerators…"
              className="pl-9 pr-3 h-11 w-full border border-white/10 bg-black/40 backdrop-blur-sm text-sm focus:outline-none focus:border-brand/40 focus:bg-black/60 transition-all"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-6 bg-brand text-black font-mono-technical text-[10px] tracking-widest uppercase hover:bg-brand/90 transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        <Link
          href="/browse"
          className="inline-flex items-center gap-2 mb-10 font-mono-technical text-[10px] text-white/50 hover:text-brand border border-white/10 hover:border-brand/40 px-5 py-2.5 uppercase tracking-[0.2em] transition-colors"
        >
          Explore directory <ArrowRight size={12} />
        </Link>

        <AnimatePresence mode="wait">
          <motion.div
            key={`quote-${current}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <p className="font-ascii text-2xl md:text-4xl text-brand tracking-wide mb-2">
              {img.quote}
            </p>
            <p className="font-light text-white/40 text-sm md:text-base max-w-lg mx-auto">
              {img.sub}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3 mb-8">
          {FOUNDER_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 ${
                i === current
                  ? "w-8 h-[3px] bg-brand"
                  : "w-3 h-[3px] bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
