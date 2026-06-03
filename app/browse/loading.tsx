export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-3 w-32 bg-white/5 animate-pulse" />
        </div>

        {/* Title skeleton */}
        <div className="text-center mb-16">
          <div className="h-20 bg-white/5 mb-6 max-w-md mx-auto animate-pulse" />
          <div className="h-4 bg-white/5 max-w-xs mx-auto animate-pulse" />
        </div>

        {/* Search skeleton */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="h-12 bg-white/5 animate-pulse" />
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-[340px] bg-[#0a0a0a] border border-white/5 p-6 animate-pulse"
            >
              <div className="flex items-start gap-5 mb-5">
                <div className="h-14 w-14 bg-white/5" />
                <div className="flex-1">
                  <div className="h-3 w-24 bg-white/5 mb-2" />
                  <div className="h-6 w-full bg-white/5" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="h-3 w-full bg-white/5" />
                <div className="h-3 w-5/6 bg-white/5" />
                <div className="h-3 w-4/6 bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
