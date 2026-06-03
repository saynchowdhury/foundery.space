"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HeroImageProps {
  src: string;
  alt: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({ src, alt }) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-20">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 group"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotateX: [0, 5, 0],
            rotateY: [0, -5, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative aspect-video rounded-lg overflow-hidden border border-brand/20 shadow-2xl shadow-brand/10 scanlines"
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand/10 via-transparent to-purple-500/10 mix-blend-overlay opacity-50 pointer-events-none" />
          
          {/* Border highlight */}
          <div className="absolute inset-0 border border-brand/30 rounded-lg pointer-events-none group-hover:border-brand/50 transition-colors duration-500" />
        </motion.div>
        
        {/* Shadow floor */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-brand/20 blur-xl rounded-full opacity-50" />
      </motion.div>
    </div>
  );
};
