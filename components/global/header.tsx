"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "browse", href: "/browse" },
    { name: "fellowships", href: "/fellowship" },
    { name: "grants", href: "/grant" },
    { name: "accelerators", href: "/accelerator" },
    { name: "competitions", href: "/competition" },
    { name: "residencies", href: "/residency" },
    { name: "blog", href: "/blog" },
    { name: "startups", href: "/startup-program" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-sm border border-brand/20">
            <Image
              src="/logo.png"
              alt="Foundery"
              fill
              className="object-cover p-1.5 transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <span className="text-lg font-ascii tracking-tight text-foreground uppercase group-hover:text-brand transition-colors">
            Foundery
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-2.5 xl:gap-5 2xl:gap-7">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/browse" &&
                (pathname.startsWith("/browse") ||
                  pathname.startsWith("/opportunity/")));
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                aria-current={isActive ? "page" : undefined}
                className={`font-mono-technical text-[10px] tracking-[0.12em] xl:tracking-[0.2em] uppercase transition-all duration-200 py-1 whitespace-nowrap hover:text-white ${
                  isActive ? "text-brand" : "text-white/40"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-6">
          <Link
            href="/browse"
            prefetch={true}
            className="hidden lg:flex font-mono-technical text-[10px] tracking-widest uppercase h-9 px-5 bg-brand text-black hover:bg-brand/90 transition-all rounded-sm items-center shrink-0"
          >
            explore_all
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-foreground hover:text-brand"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-[#050505]/95 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col items-center justify-center h-full space-y-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-mono-technical text-2xl tracking-[0.2em] uppercase text-foreground hover:text-brand"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/browse"
              className="font-mono-technical text-xs tracking-widest uppercase bg-brand text-black h-12 px-8 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              explore_all
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
