/**
 * Route-level loading skeleton for /[category] pages
 * Streams in while generateStaticParams / data resolves
 */
export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="h-3 w-40 bg-white/[0.04] animate-pulse mb-4" />
          <div className="h-14 w-80 bg-white/[0.04] animate-pulse mb-4" />
          <div className="h-4 w-[60%] bg-white/[0.03] animate-pulse" />
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="h-[340px] bg-white/[0.02] border border-white/5 animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
