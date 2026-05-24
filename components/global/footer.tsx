import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-3 w-fit">
              <span className="text-lg font-semibold wordmark">
                Foundery.Space
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
              The community-ranked directory for ambitious founders, researchers,
              and builders. Discover fellowships, grants, accelerators, and
              competitions — never miss a deadline again.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Categories</h3>
            <ul className="space-y-1.5">
              {[
                { href: "/fellowship", label: "Fellowships" },
                { href: "/accelerator", label: "Accelerators" },
                { href: "/incubator", label: "Incubators" },
                { href: "/grant", label: "Grants" },
                { href: "/developer-program", label: "Developer Programs" },
                { href: "/competition", label: "Competitions" },
                { href: "/residency", label: "Residencies" },
                { href: "/research", label: "Research Programs" },
                { href: "/venture-capital", label: "Venture Capital" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-sm">Legal</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-6 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Foundery.Space. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Built for ambitious founders &amp; builders worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
