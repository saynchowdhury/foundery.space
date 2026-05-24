import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_LINKS = [
  { href: "/fellowship", label: "Fellowships" },
  { href: "/accelerator", label: "Accelerators" },
  { href: "/grant", label: "Grants" },
  { href: "/developer-program", label: "Developer Programs" },
  { href: "/incubator", label: "Incubators" },
  { href: "/competition", label: "Competitions" },
  { href: "/residency", label: "Residencies" },
  { href: "/research", label: "Research" },
  { href: "/venture-capital", label: "Venture Capital" },
];

export function ViewAllOpportunitiesSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category quick-links */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATEGORY_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-4 py-2 text-sm border border-border text-muted-foreground hover:text-foreground hover:border-[var(--brand)] transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/browse">
            Browse All Opportunities
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}