/**
 * Next.js instrumentation hook — runs once at server startup.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Used to validate environment variables before any request is served,
 * so misconfigured deployments (e.g. wrong Supabase project) are caught
 * immediately in logs rather than silently serving empty data.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/lib/env-check");
    validateEnv();
  }
}
