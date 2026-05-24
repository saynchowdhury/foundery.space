import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MapPin, Tag, DollarSign, ArrowLeft } from "lucide-react";
import type { GuideConfig } from "@/lib/guide-generator";

const CATEGORY_NAMES: Record<string, string> = {
  accelerator: "Accelerator",
  fellowship: "Fellowship",
  incubator: "Incubator",
  venture_capital: "Venture Capital",
  grant: "Grant",
  residency: "Residency",
  competition: "Competition",
  research: "Research Program",
  developer_program: "Developer Program",
};

interface GuideHeaderProps {
  config: GuideConfig;
  overview: string;
}

function formatFundingRange(fundingAmount?: { min: number; max: number }): string {
  if (!fundingAmount) return "";
  const { min, max } = fundingAmount;
  if (max === Infinity || max >= 2000000) {
    return min === 0 ? "Any amount" : `$${min.toLocaleString()}+`;
  }
  if (min === 0) return `Under $${max.toLocaleString()}`;
  return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
}

export function GuideHeader({ config, overview }: GuideHeaderProps) {
  const { filters } = config;

  return (
    <section className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative">
        {/* Breadcrumb nav */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Foundery.Space
          </Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-foreground transition-colors">
            Browse
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{config.title}</span>
        </div>

        <div className="max-w-3xl">
          {/* Category pill */}
          {filters.categories?.length === 1 && (
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 border border-indigo-500/30 bg-indigo-500/5 text-xs text-indigo-400 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              {CATEGORY_NAMES[filters.categories[0]] ?? filters.categories[0]}
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-semibold leading-tight mb-4">
            {config.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {overview}
          </p>

          {/* Active filter badges */}
          {(
            (filters.categories?.length ?? 0) > 1 ||
            filters.regions?.length ||
            filters.tags?.length ||
            filters.fundingAmount
          ) && (
            <div className="flex flex-wrap gap-2 mt-6">
              {(filters.categories?.length ?? 0) > 1 &&
                filters.categories?.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs px-2.5 py-1">
                    <Tag className="h-3 w-3 mr-1.5" />
                    {CATEGORY_NAMES[category] ?? category}
                  </Badge>
                ))}

              {filters.regions?.map((region) => (
                <Badge key={region} variant="secondary" className="text-xs px-2.5 py-1">
                  <MapPin className="h-3 w-3 mr-1.5" />
                  {region}
                </Badge>
              ))}

              {filters.tags?.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-2.5 py-1">
                  {tag}
                </Badge>
              ))}

              {filters.fundingAmount && (
                <Badge variant="secondary" className="text-xs px-2.5 py-1">
                  <DollarSign className="h-3 w-3 mr-1.5" />
                  {formatFundingRange(filters.fundingAmount)}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
