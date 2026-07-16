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

    // Clone tracks for seamless infinite loop
    const clone1 = track1.cloneNode(true) as HTMLDivElement;
    const clone2 = track2.cloneNode(true) as HTMLDivElement;
    clone1.setAttribute("aria-hidden", "true");
    clone2.setAttribute("aria-hidden", "true");
    track1.parentElement?.appendChild(clone1);
    track2.parentElement?.appendChild(clone2);

    // Ribbon 1 — scrolls left
    const tl1 = gsap.timeline({ repeat: -1 });
    tl1.fromTo(
      [track1, clone1],
      { xPercent: 0 },
      { xPercent: -100, duration: speed, ease: "none" }
    );

    // Ribbon 2 — scrolls right (starts off-screen left, moves to center)
    gsap.set([track2, clone2], { xPercent: -100 });
    const tl2 = gsap.timeline({ repeat: -1 });
    tl2.fromTo(
      [track2, clone2],
      { xPercent: -100 },
      { xPercent: 0, duration: speed * 0.85, ease: "none" }
    );

    // Ribbon wave effect — subtle vertical bob
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
      gsap.killTweensOf(waveItems);
      clone1.remove();
      clone2.remove();
    };
  }, [items, speed]);

  return (
    <div className="relative w-full overflow-hidden py-24 border-y border-white/5 bg-[#050505]">
      {/* Ribbon 1 — moving left */}
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

      {/* Ribbon 2 — moving right */}
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
