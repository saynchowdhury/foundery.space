"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface GalleryCard {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  motivation: string;
}

const cards: GalleryCard[] = [
  {
    id: 1,
    image: "/images/think-different.jpg",
    title: "Steve Jobs",
    subtitle: "THINK DIFFERENT",
    motivation: "The people who are crazy enough to think they can change the world are the ones who do.",
  },
  {
    id: 2,
    image: "/images/mark-zuckerberg.jpg",
    title: "Mark Zuckerberg",
    subtitle: "JUST START",
    motivation: "The biggest risk is not taking any risk. In a world that is changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
  },
  {
    id: 3,
    image: "/images/founder3.jpg",
    title: "You Will Never",
    subtitle: "STOP BUILDING",
    motivation: "Every opportunity you discover is one step closer to the life you're building. Keep going.",
  },
];

export const MotivationalGallery = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-[#050505] overflow-hidden border-y border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-20">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="font-mono-technical text-[10px] text-brand tracking-[0.3em] uppercase block mb-4"
          >
            FOUNDER_MINDSET
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl font-light tracking-tight"
          >
            Built on the shoulders of <span className="text-brand">Giants</span>
          </motion.h2>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative"
              style={{
                transform:
                  hoveredCard === card.id
                    ? `perspective(1200px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`
                    : "none",
              }}
            >
              {/* Card Container */}
              <div className="relative h-[600px] rounded-lg overflow-hidden bg-black/40 border border-white/10 transition-all duration-300 hover:border-brand/50">
                {/* Image Layer */}
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    y: hoveredCard === card.id ? 0 : 20,
                  }}
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 25vw"
                    className="object-cover transition-all duration-500"
                    loading="lazy"
                    style={{
                      filter:
                        hoveredCard === card.id
                          ? "brightness(1.1) contrast(1.1) saturate(1.2)"
                          : "brightness(0.7) contrast(0.9) saturate(0.8) grayscale(20%)",
                    }}
                  />
                </motion.div>

                {/* Overlay Gradient - Static */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60" />

                {/* Content Overlay */}
                <motion.div
                  className="absolute inset-0 flex flex-col justify-end p-6 md:p-8"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: hoveredCard === card.id ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Title and Subtitle */}
                  <div className="mb-6">
                    <motion.p
                      className="font-light text-white/70 text-sm md:text-base mb-2 leading-tight"
                      animate={{
                        y: hoveredCard === card.id ? 0 : 10,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {card.title}
                    </motion.p>
                    <motion.h3
                      className="font-ascii text-3xl md:text-4xl text-brand font-bold tracking-wide leading-none"
                      animate={{
                        y: hoveredCard === card.id ? 0 : 15,
                        opacity: hoveredCard === card.id ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {card.subtitle}
                    </motion.h3>
                  </div>

                  {/* Motivation Quote - Appears on Hover */}
                  <motion.p
                    className="font-light text-white/60 text-xs md:text-sm leading-relaxed border-t border-white/10 pt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: hoveredCard === card.id ? 1 : 0,
                      y: hoveredCard === card.id ? 0 : 10,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.motivation}
                  </motion.p>
                </motion.div>

                {/* Hover Border Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  animate={{
                    boxShadow:
                      hoveredCard === card.id
                        ? "inset 0 0 40px rgba(255, 102, 0, 0.2)"
                        : "inset 0 0 0px rgba(255, 102, 0, 0)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Parallax Background Shift */}
              {hoveredCard === card.id && (
                <motion.div
                  className="absolute -inset-4 rounded-lg bg-gradient-to-br from-brand/20 via-transparent to-transparent blur-2xl -z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 md:mt-20 text-center"
        >
          <p className="text-white/50 text-sm md:text-base font-light mb-6">
            Their stories aren't just history. They're your blueprint.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/browse"
              className="font-mono-technical text-[10px] text-white/40 hover:text-brand uppercase tracking-[0.2em] transition-colors px-6 py-3 border border-white/10 hover:border-brand/50 hover:bg-brand/5"
            >
              FIND_YOUR_OPPORTUNITY
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
