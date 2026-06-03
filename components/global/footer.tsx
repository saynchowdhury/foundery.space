import Link from "next/link";

export function Footer() {
  const categories = [
    { href: "/fellowship", label: "fellowships" },
    { href: "/accelerator", label: "accelerators" },
    { href: "/incubator", label: "incubators" },
    { href: "/grant", label: "grants" },
    { href: "/developer-program", label: "developer programs" },
    { href: "/competition", label: "competitions" },
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-white/5 py-24 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="md:col-span-2">
            <h3 className="font-ascii text-2xl text-brand mb-6">FOUNDERY</h3>
            <p className="text-muted-foreground max-w-sm text-xs leading-relaxed font-light">
              THE NEXT GENERATION DIRECTORY FOR AMBITIOUS BUILDERS. 
              MAPPING THE GLOBAL PROTOCOLS OF INNOVATION.
            </p>
          </div>

          <div>
            <h4 className="font-mono-technical text-[10px] tracking-widest text-brand mb-6 uppercase">
              RESOURCES
            </h4>
            <ul className="space-y-3">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs font-light lowercase"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono-technical text-[10px] tracking-widest text-brand mb-6 uppercase">
              LEGAL
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground text-xs font-light lowercase">
                  terms_and_conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-xs font-light lowercase">
                  privacy_policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4">
          <span className="font-mono-technical text-[8px] text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} FOUNDERY_SPACE // ALL_RIGHTS_RESERVED
          </span>
          <span className="font-mono-technical text-[8px] text-brand uppercase tracking-widest">
            BUILT_FOR_AMBITIOUS_BUILDERS
          </span>
        </div>
      </div>

      {/* Giant background text - similar to forge. reference */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0 overflow-hidden w-full">
        <div className="text-center leading-none">
          <span 
            className="font-light text-[20vw] md:text-[18vw] lg:text-[16vw] tracking-tighter opacity-[0.03]"
            style={{ 
              color: '#ffffff',
              textTransform: 'lowercase',
              fontFamily: 'var(--font-dm-sans)',
              letterSpacing: '-0.05em',
            }}
          >
            foundery
          </span>
          <span 
            className="font-light text-[8vw] md:text-[7vw] lg:text-[6vw] text-brand/10 tracking-wider"
            style={{ 
              fontFamily: 'var(--font-dm-sans)',
              letterSpacing: '0.02em',
            }}
          >
            .
          </span>
        </div>
      </div>
    </footer>
  );
}
