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
              CONNECT
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/saynchowdhury/foundery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-xs font-light"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              </li>
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
            <p className="text-muted-foreground text-[10px] font-light mt-4 leading-relaxed">
              Maintained by me
            </p>
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
