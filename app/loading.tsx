export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Loading badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-brand/30 bg-brand/5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="font-mono-technical text-[9px] text-brand tracking-[0.3em] uppercase animate-pulse">
              INITIALIZING_PROTOCOL
            </span>
          </div>

          {/* Loading title skeleton */}
          <div className="h-16 bg-white/5 mb-6 max-w-2xl mx-auto animate-pulse" />
          
          {/* Loading subtitle skeleton */}
          <div className="h-8 bg-white/5 mb-8 max-w-xl mx-auto animate-pulse" />

          {/* Loading search skeleton */}
          <div className="h-11 bg-white/5 mb-6 max-w-2xl mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
}
