import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazy singletons — never initialised at module load time.
// Module-level execution runs during Next.js build page-data collection,
// where env vars are not yet injected. Both clients are created on first call.
let _supabase: SupabaseClient | null = null;
let _serviceClient: SupabaseClient | null = null;

/**
 * Public (anon) Supabase client.
 * Safe for server components and API routes — NOT for client components
 * that run in the browser (use NEXT_PUBLIC_ vars there directly).
 */
export function getAnonClient(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
      );
    }
    _supabase = createClient(url, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 5000);
          return fetch(input, { ...init, signal: controller.signal }).finally(
            () => clearTimeout(timeout)
          );
        },
      },
    });
  }
  return _supabase;
}

/**
 * Service-role Supabase client — server-only, never expose to the browser.
 * Only use in API routes and server actions.
 */
export function getServiceClient(): SupabaseClient {
  if (!_serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
      );
    }
    _serviceClient = createClient(url, serviceKey);
  }
  return _serviceClient;
}

/**
 * @deprecated Use getAnonClient() instead.
 * Kept as a named export so existing callers compile without changes.
 * Resolved lazily — safe during build.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getAnonClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
