"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { type OpportunityCardData } from "@/lib/data";
import { OpportunityCard } from "./opportunity-card";

interface CircularCarouselProps {
  opportunities: OpportunityCardData[];
  from?: string;
}

export function CircularCarousel({ opportunities, from }: CircularCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const [radius, setRadius] = useState(0);

  const getRadius = useCallback(() => {
    const vw = window.innerWidth;
    if (vw < 768) return 280;
    if (vw < 1024) return 400;
    return 550;
  }, []);

  useEffect(() => {
    setRadius(getRadius());

    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setRadius(getRadius()), 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, [getRadius]);

  useEffect(() => {
    if (!containerRef.current || opportunities.length === 0 || radius === 0) return;

    const container = containerRef.current;
    const cards = Array.from(container.querySelectorAll<HTMLElement>(".carousel-card"));
    const count = cards.length;
    const angleStep = (2 * Math.PI) / count;

    // Position cards based on current rotation
    const positionCards = () => {
      const baseRotation = rotationRef.current;
      for (let i = 0; i < count; i++) {
        const angle = baseRotation + i * angleStep;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const card = cards[i];
        if (card) {
          card.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0.85)`;
        }
      }
    };

    // Efficient animation loop — single rAF, direct DOM writes
    let lastTime = performance.now();
    const speed = (2 * Math.PI) / 60; // Full rotation in 60 seconds

    const animate = (now: number) => {
      if (!pausedRef.current) {
        const dt = (now - lastTime) / 1000;
        rotationRef.current += speed * dt;
      }
      lastTime = now;
      positionCards();
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [opportunities, radius]);

  if (opportunities.length === 0) return null;

  return (
    <div className="relative w-full py-24 overflow-hidden">
      <div
        ref={containerRef}
        className="relative mx-auto"
        style={{
          width: radius * 2 + 400,
          height: radius * 2 + 400,
          maxWidth: "100%",
        }}
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {/* Center Mascot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
          <div className="relative w-[240px] md:w-[300px] lg:w-[360px]">
            <div className="absolute inset-0 bg-brand/20 blur-[80px] animate-pulse" />
            <Image
              src="/images/mascot-center.png"
              alt="Foundery Mascot"
              width={360}
              height={360}
              className="relative w-full h-auto object-contain drop-shadow-2xl"
              loading="lazy"
              priority={false}
            />
          </div>
        </div>

        {/* Opportunity cards rotating around */}
        {opportunities.slice(0, 12).map((opportunity, idx) => (
          <div
            key={`${opportunity.id}-circular`}
            className="carousel-card absolute top-1/2 left-1/2 w-[300px] md:w-[340px]"
            style={{ marginLeft: "-150px", marginTop: "-170px" }}
          >
            <OpportunityCard
              opportunity={opportunity}
              className="w-full shadow-2xl"
              from={from}
              priority={idx < 3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
