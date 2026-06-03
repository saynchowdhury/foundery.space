"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface AsciiHeadingProps {
  text: string;
  className?: string;
}

export const AsciiHeading: React.FC<AsciiHeadingProps> = ({ text, className }) => {
  const [displayText, setDisplayText] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startAnimation = () => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (char === " ") return " ";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 4;
      }, 40);
    };

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        onStart: startAnimation,
      });
    });

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, [text]);

  return (
    <h1 
      ref={headingRef}
      className={`font-ascii text-brand leading-none glitch-text ${className}`} 
      data-text={text}
    >
      {displayText}
    </h1>
  );
};
