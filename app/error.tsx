"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

const ACCENT = "var(--brand)";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error tracking service when available
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/85 border-b border-border">
        <div className="max-w-4xl mx-auto px-5 py-3">
          <Link href="/">
            <span className="font-semibold text-[17px] wordmark">Foundery.Space</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-24">
        <div className="max-w-md">
          <div className="eyebrow text-muted-foreground mb-3">500</div>
          <h1 className="text-fluid-title font-semibold mb-3">
            Something went wrong
          </h1>
          <p className="text-[15px] text-muted-foreground mb-8 leading-relaxed">
            An unexpected error occurred. Our team has been notified.
            {error.digest && (
              <span className="block mt-2 text-xs font-mono opacity-60">
                Error ID: {error.digest}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 h-10 px-4 text-white text-[14px] font-medium"
              style={{ background: ACCENT }}
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 h-10 px-4 text-[14px] font-medium border border-border hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
