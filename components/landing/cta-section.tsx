"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const particles = section.querySelectorAll(".particle");

    // Floating particles animation
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        y: "random(-40, 40)",
        x: "random(-30, 30)",
        rotation: "random(-180, 180)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
    });

    // Pulse glow animation
    const glowElements = section.querySelectorAll(".glow-pulse");
    glowElements.forEach((el) => {
      gsap.to(el, {
        opacity: "random(0.3, 0.8)",
        scale: "random(1, 1.3)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }, []);

  // Direct DOM manipulation for glow parallax — avoids re-renders
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100;
        if (glow1Ref.current) {
          glow1Ref.current.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px)`;
        }
        if (glow2Ref.current) {
          glow2Ref.current.style.transform = `translate(${x * -0.03}px, ${y * -0.03}px)`;
        }
      }
      rafRef.current = null;
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative py-32 overflow-hidden bg-[#050505] border-y border-white/5"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div
          ref={glow1Ref}
          className="glow-pulse absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] bg-brand/20"
        />
        <div
          ref={glow2Ref}
          className="glow-pulse absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] bg-purple-500/10"
        />
      </div>

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="particle absolute w-1 h-1 bg-brand/40 rounded-full"
          style={{
            left: `${10 + i * 7}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-brand/30 bg-brand/5 backdrop-blur-sm"
        >
          <Zap size={12} className="text-brand animate-pulse" />
          <span className="font-mono-technical text-[9px] text-brand tracking-[0.3em] uppercase">
            READY_TO_START
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 leading-tight tracking-tight"
        >
          <span className="block mb-2">What Are You</span>
          <span className="font-ascii text-brand text-5xl md:text-7xl lg:text-8xl tracking-wider">
            WAITING FOR?
          </span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto mb-12"
        >
          Your next fellowship, grant, or accelerator is here.{" "}
          <span className="text-foreground">Start exploring now.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary CTA */}
          <Link
            href="/browse"
            className="group relative overflow-hidden px-8 py-4 bg-brand text-black font-mono-technical text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(240,90,36,0.4)] flex items-center gap-3"
          >
            <span className="relative z-10">Explore All Opportunities</span>
            <ArrowRight
              size={16}
              className="relative z-10 transition-transform group-hover:translate-x-1"
            />
            {/* Animated shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/fellowship"
            className="group px-8 py-4 border border-white/20 bg-white/[0.02] text-foreground font-mono-technical text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:border-brand/50 hover:bg-brand/5 flex items-center gap-3"
          >
            <span>View Fellowships</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 pt-12 border-t border-white/5 flex flex-wrap items-center justify-center gap-12"
        >
          {[
            { label: "Active Programs", value: "100+" },
            { label: "Countries", value: "40+" },
            { label: "Weekly Updates", value: "∞" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-ascii text-3xl md:text-4xl text-brand mb-1">
                {stat.value}
              </div>
              <div className="font-mono-technical text-[9px] text-white/40 uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Pulsing corner accents */}
        <div className="absolute top-8 left-8 w-12 h-12">
          <div className="absolute inset-0 border-t-2 border-l-2 border-brand/30 animate-pulse" />
          <div className="absolute top-0 left-0 w-2 h-2 bg-brand" />
        </div>
        <div className="absolute bottom-8 right-8 w-12 h-12">
          <div className="absolute inset-0 border-b-2 border-r-2 border-brand/30 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-brand" />
        </div>
      </div>
    </section>
  );
}
