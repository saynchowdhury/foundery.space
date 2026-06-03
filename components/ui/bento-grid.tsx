"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4 md:gap-5 lg:gap-6 w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
};

interface BentoCardProps {
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  href?: string;
  index?: number;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  header,
  icon,
  className,
  href,
  index = 0,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const card = (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden bg-[#0d0d0d] border border-white/5 p-6 md:p-8 lg:p-10 flex flex-col justify-between hover:border-brand/40 transition-all duration-500 h-full cursor-pointer ${className}`}
    >
      {/* Mouse-follow glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, oklch(65% 0.25 35 / 0.12), transparent 50%)`,
        }}
      />

      {/* Top-right accent line */}
      <div className="absolute top-0 right-0 w-12 h-[1px] bg-brand/50 group-hover:w-full transition-all duration-700" />
      <div className="absolute top-0 right-0 w-[1px] h-12 bg-brand/50 group-hover:h-full transition-all duration-700" />

      {/* Corner bracket */}
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/15" />
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/15" />

      <div className="relative z-10">
        {/* Icon + label row */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 border border-brand/20 bg-brand/5 flex items-center justify-center text-brand group-hover:bg-brand/10 group-hover:border-brand/40 transition-all duration-300">
            {icon}
          </div>
          <span className="font-mono-technical text-[9px] text-brand/60 tracking-[0.3em] uppercase">
            {title.replace(/\s/g, "_")}
          </span>
        </div>

        {/* Big title */}
        <h3 className="text-2xl md:text-3xl font-light text-foreground group-hover:text-brand transition-colors duration-500 leading-tight mb-4 tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light">
          {description}
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8 flex items-center justify-between">
        {header && <div className="flex-1">{header}</div>}
        <span className="font-mono-technical text-[9px] text-brand opacity-0 group-hover:opacity-100 transition-opacity duration-500 tracking-[0.2em] uppercase ml-auto">
          EXPLORE →
        </span>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href} className="block">{card}</Link>;
  }
  return card;
};
