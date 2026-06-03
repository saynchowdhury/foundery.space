"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface RibbonMarqueeProps {
  items: { text: string; variant: "light" | "brand" }[];
  speed?: number;
}

export function RibbonMarquee({ items, speed = 80 }: RibbonMarqueeProps) {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!track1Ref.current || !track2Ref.current) return;

    const track1 = track1Ref.current;
    const track2 = track2Ref.current;

    // Clone items for seamless loop
    const clone1 = track1.cloneNode(true) as HTMLDivElement;
    const clone2 = track2.cloneNode(true) as HTMLDivElement;
    track1.parentElement?.appendChild(clone1);
    track2.parentElement?.appendChild(clone2);

    // Animate with GSAP for smooth ribbon effect
    const tl1 = gsap.timeline({ repeat: -1 });
    const tl2 = gsap.timeline({ repeat: -1 });

    tl1.to([track1, clone1], {
      x: "-100%",
      duration: speed,
      ease: "none",
      onComplete: () => {
        gsap.set(track1, { x: "0%" });
        gsap.set(clone1, { x: "100%" });
      },
    });

    tl2.to([track2, clone2], {
      x: "0%",
      duration: speed * 0.85,
      ease: "none",
      from: { x: "-100%" },
    });

    // Ribbon wave effect
    const waveItems = track1.querySelectorAll("span");
    waveItems.forEach((item, i) => {
      gsap.to(item, {
        y: "+=8",
        duration: 2 + (i % 3) * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1,
      });
    });

    return () => {
      tl1.kill();
      tl2.kill();
      clone1.remove();
      clone2.remove();
    };
  }, [items, speed]);

  return (
    <div className="relative w-full overflow-hidden py-24 border-y border-white/5 bg-[#050505]">
      {/* Ribbon 1 — moving right */}
      <div className="flex whitespace-nowrap mb-6 relative">
        <div ref={track1Ref} className="flex items-center gap-12 px-6 will-change-transform">
          {items.map((item, i) => (
            <span
              key={i}
              className={`font-ascii text-6xl md:text-8xl ${
                item.variant === "brand" ? "text-brand/10" : "text-white/5"
              } uppercase transition-all duration-300 hover:scale-110 hover:text-brand/30`}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Ribbon 2 — moving left */}
      <div className="flex whitespace-nowrap relative">
        <div ref={track2Ref} className="flex items-center gap-12 px-6 will-change-transform">
          {items.map((item, i) => (
            <span
              key={i}
              className={`font-ascii text-5xl md:text-7xl ${
                item.variant === "brand" ? "text-brand/15" : "text-white/8"
              } uppercase transition-all duration-300 hover:scale-110 hover:text-brand/40`}
            >
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10" />
    </div>
  );
}
