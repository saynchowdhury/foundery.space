import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={className ?? "mb-8 flex flex-wrap items-center gap-2 text-sm"}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span className="text-white/20" aria-hidden>/</span>}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-mono-technical text-[10px] text-white/40 hover:text-brand uppercase tracking-[0.2em] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "font-mono-technical text-[10px] text-brand uppercase tracking-[0.2em]"
                    : "font-mono-technical text-[10px] text-white/40 uppercase tracking-[0.2em]"
                }
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
