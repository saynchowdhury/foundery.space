"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "fixed bottom-24 right-6 z-50 rounded-none border-white/10 bg-[#050505]/80 backdrop-blur-sm transition-all duration-300 hover:border-brand/50 hover:bg-brand/5 group",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      )}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ChevronUp className="h-5 w-5 text-white/50 group-hover:text-brand transition-colors" />
      <span className="sr-only">Back to top</span>
    </Button>
  );
}
