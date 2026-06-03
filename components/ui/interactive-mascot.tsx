"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

interface InteractiveMascotProps {
  src: string;
  alt: string;
}

export const InteractiveMascot: React.FC<InteractiveMascotProps> = ({ src, alt }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animation for smooth movement
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const translateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const translateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Normalize mouse position relative to element center (-0.5 to 0.5)
      const x = (e.clientX - centerX) / rect.width;
      const y = (e.clientY - centerY) / rect.height;
      
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div 
      ref={ref}
      className="relative w-full max-w-2xl mx-auto px-4 py-12 md:py-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated glow background */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none"
        animate={{
          opacity: isHovered ? 0.15 : 0.08,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full h-full bg-gradient-radial from-brand/30 via-brand/10 to-transparent blur-[100px] rounded-full" />
      </motion.div>

      {/* Mascot with parallax and 3D rotation */}
      <motion.div
        className="relative z-20 group cursor-pointer"
        style={{
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.2 
        }}
      >
        {/* Money stack glow effect */}
        <motion.div
          className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 60% 70%, rgba(34, 197, 94, 0.3), transparent 60%)",
          }}
        />

        {/* Mascot image */}
        <motion.div 
          className="relative w-full aspect-[3/4] max-w-sm mx-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* mix-blend-mode: screen removes the black background on dark backgrounds */}
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 40px rgba(99,102,241,0.4))" }}
            priority
            sizes="(max-width: 768px) 80vw, 500px"
          />
          
          {/* Animated border accent */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: "linear-gradient(135deg, transparent 0%, var(--brand) 50%, transparent 100%)",
              opacity: 0.1,
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>

        {/* Floating particles around mascot */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-brand rounded-full"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos(i * 60 * (Math.PI / 180)) * 80,
                  y: Math.sin(i * 60 * (Math.PI / 180)) * 80,
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                style={{
                  left: "50%",
                  top: "50%",
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Shadow floor */}
      <motion.div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-brand/20 blur-2xl rounded-full"
        animate={{
          scaleX: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.4 : 0.25,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating text callout */}
      <motion.div
        className="absolute top-8 right-4 md:right-12 font-mono-technical text-[9px] text-brand tracking-[0.3em] uppercase opacity-0 group-hover:opacity-70 transition-opacity duration-500"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 0.7 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
          <span>GRANT_SECURED</span>
        </div>
      </motion.div>
    </div>
  );
};
