export default function OpportunityLoading() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation breadcrumb skeleton */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-3 w-32 bg-white/5 animate-pulse" />
          <div className="h-px w-12 bg-white/5" />
          <div className="h-3 w-24 bg-white/5 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16">
          {/* Main content skeleton */}
          <div>
            <div className="flex items-center gap-6 mb-12">
              <div className="h-20 w-20 bg-white/5 animate-pulse" />
              <div className="flex-1">
                <div className="h-3 w-48 bg-white/5 mb-2 animate-pulse" />
                <div className="h-16 bg-white/5 animate-pulse" />
              </div>
            </div>

            {/* Description skeleton */}
            <section className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-3 w-32 bg-white/5 animate-pulse" />
                <div className="h-px flex-1 bg-white/5" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-white/5 animate-pulse" />
                <div className="h-4 w-11/12 bg-white/5 animate-pulse" />
                <div className="h-4 w-10/12 bg-white/5 animate-pulse" />
                <div className="h-4 w-9/12 bg-white/5 animate-pulse" />
              </div>
            </section>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-white/5 bg-white/[0.01] h-64 animate-pulse" />
              <div className="p-8 border border-white/5 bg-white/[0.01] h-64 animate-pulse" />
            </div>
          </div>

          {/* Sidebar skeleton */}
          <aside className="space-y-8">
            <div className="p-8 border border-brand/20 bg-brand/[0.02] h-80 animate-pulse" />
            <div className="p-8 border border-white/5 bg-white/[0.01] h-96 animate-pulse" />
          </aside>
        </div>
      </div>
    </div>
  );
}
