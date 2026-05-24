/**
 * Environment variable validator.
 * Called from instrumentation.ts (server startup) so misconfigurations
 * are caught immediately — not silently at runtime.
 *
 * Checks:
 * 1. Required vars are present
 * 2. Supabase URL and anon key belong to the SAME project (ref match)
 *    — prevents the "duplicate project" bug where localhost and production
 *      point to different databases
 */

const EXPECTED_PROJECT_REF = "tpvpacwoquygbykcjqle";

function decodeJwtRef(jwt: string): string | null {
  try {
    const payload = JSON.parse(
      Buffer.from(jwt.split(".")[1], "base64").toString()
    );
    return payload.ref ?? null;
  } catch {
    return null;
  }
}

export function validateEnv(): void {
  const errors: string[] = [];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 1. Presence checks
  if (!url) errors.push("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!anonKey) errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
  if (!serviceKey) errors.push("SUPABASE_SERVICE_ROLE_KEY is not set");

  if (errors.length > 0) {
    console.error("\n❌ [env-check] Missing environment variables:\n" +
      errors.map(e => `   • ${e}`).join("\n") + "\n");
    return;
  }

  // 2. Project ref consistency — URL must match key refs
  const urlRef = url!.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  const anonRef = decodeJwtRef(anonKey!);
  const serviceRef = decodeJwtRef(serviceKey!);

  const mismatch: string[] = [];

  if (urlRef && urlRef !== EXPECTED_PROJECT_REF) {
    mismatch.push(
      `NEXT_PUBLIC_SUPABASE_URL points to project "${urlRef}" — expected "${EXPECTED_PROJECT_REF}"`
    );
  }
  if (anonRef && anonRef !== EXPECTED_PROJECT_REF) {
    mismatch.push(
      `NEXT_PUBLIC_SUPABASE_ANON_KEY belongs to project "${anonRef}" — expected "${EXPECTED_PROJECT_REF}"`
    );
  }
  if (serviceRef && serviceRef !== EXPECTED_PROJECT_REF) {
    mismatch.push(
      `SUPABASE_SERVICE_ROLE_KEY belongs to project "${serviceRef}" — expected "${EXPECTED_PROJECT_REF}"`
    );
  }
  if (urlRef && anonRef && urlRef !== anonRef) {
    mismatch.push(
      `URL project "${urlRef}" does not match anon key project "${anonRef}" — keys are from different projects`
    );
  }
  if (urlRef && serviceRef && urlRef !== serviceRef) {
    mismatch.push(
      `URL project "${urlRef}" does not match service key project "${serviceRef}" — keys are from different projects`
    );
  }

  if (mismatch.length > 0) {
    console.error(
      "\n⚠️  [env-check] Supabase project mismatch detected:\n" +
      mismatch.map(m => `   • ${m}`).join("\n") +
      "\n   Fix: update Vercel env vars to match the correct project.\n"
    );
    return;
  }

  console.log(`✓ [env-check] Supabase connected to project: ${urlRef}`);
}
