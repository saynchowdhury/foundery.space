# Production Deployment Audit Report

**Date:** June 25, 2026  
**Status:** ⚠️ LIVE but with build configuration issues

---

## Summary

The site **foundery.space** IS currently live and serving content. However, the latest code commits may not be deployed due to **pnpm/pipeline configuration issues** that likely caused build failures on Vercel.

---

## Root Cause Analysis

### Issue 1: pnpm Lockfile Mismatch (HIGH PRIORITY)
- **File:** `pnpm-lock.yaml`
- **Problem:** The lockfile specifies `lockfileVersion: '9.0'` (pnpm v9) but `package.json` requires `"packageManager": "pnpm@10.9.0"`
- **Vercel Impact:** Build will use `pnpm install` which may fail if Vercel uses a different pnpm version
- **Evidence:**
  ```
  lockfileVersion: '9.0'           ← lockfile is v9
  packageManager: "pnpm@10.9.0"    ← requires v10
  ```

### Issue 2: Native Module Build Approvals (RESOLVED)
- **Commit:** `fda3a04` - "fix: approve esbuild, sharp, unrs-resolver native build scripts"
- **Status:** ✅ `.npmrc` properly configured with `approve-builds[]` for esbuild, sharp, and unrs-resolver
- **No action needed** for this issue

### Issue 3: Node Version Compatibility
- **Problem:** `@react-three/fiber@9.6.1` requires `react@>=19 <19.3` but lockfile shows `react@18.2.0`
- **Impact:** May cause runtime errors if deployed
- **Evidence:**
  ```
  peer react@">=19 <19.3" from @react-three/fiber@9.6.1
  → installed: react@18.2.0
  ```

### Issue 4: Dual node_modules Conflict (RESOLVED)
- **Commit:** `c3f125b` - "fix: resolve dual node_modules build conflict"
- **Changes Made:**
  - Added `.npmrc` with `shamefully-hoist=true`, `link-workspace-packages=false`, `node-linker=hoisted`
  - Removed Windows-specific paths from `tsconfig.json`
  - Fixed `distDir` pointing to `C:\next-build`
- **Status:** ✅ Configuration appears correct

---

## Commit History Analysis

| Commit | Date | Description | Deployed? |
|--------|------|-------------|-----------|
| `fda3a04` | Jun 4, 2026 | Approve native build scripts | ⚠️ Unknown |
| `c3f125b` | Jun 4, 2026 | Resolve node_modules conflict | ⚠️ Unknown |
| `9d50721` | Jun 4, 2026 | Cyberpunk redesign | ⚠️ Unknown |
| `8fd8d97` | Jun 4, 2026 | Hero background image | ⚠️ Unknown |
| `e35b017` | Earlier | Third-batch perf | ✅ Earlier |
| `0c3f36a` | Earlier | Cache fetchers + slim payload | ✅ Earlier |

**Note:** Last known successful deployment was before commits `c3f125b` and `fda3a04`.

---

## Recommended Actions

### 1. Verify Vercel Deployment Status (Manual)
Visit: https://vercel.com/saynchowdhury/foundery-space/deployments

Check for:
- Failed builds (red status)
- Build duration > 5 minutes
- Error logs in deployment details

### 2. Regenerate pnpm-lock.yaml (HIGH PRIORITY)
```bash
# Ensure pnpm v10.9.0 is installed
pnpm --version  # Should show 10.9.0

# Delete lockfile and regenerate
rm pnpm-lock.yaml
pnpm install

# Commit the new lockfile
git add pnpm-lock.yaml
git commit -m "chore: regenerate pnpm-lock.yaml for v10.9.0"
```

### 3. Check Vercel Build Logs
1. Go to Vercel Dashboard → your project → Deployments
2. Click on the most recent deployment
3. Look for red error messages in the build output
4. Common issues to look for:
   - `ERR_PNPM_NO_IMPORTER_MANIFEST_FOUND`
   - `Optional peer dependency` warnings
   - Native module build failures

### 4. Force Redeploy
If builds are passing but not deploying:
1. Vercel Dashboard → Settings → Git
2. Check "Deploy Hooks" for any issues
3. Try triggering a manual redeploy from the Deployments tab

### 5. Environment Variables Check
Verify in Vercel Dashboard → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `EXA_API_KEY` (if scraping is needed)
- `FIRECRAWL_API_KEY` (if scraping is needed)

---

## Quick Fix Commands

```bash
# Option A: Regenerate lockfile (recommended)
cd /workspace/project/foundery.space
pnpm import  # Convert package-lock.json to pnpm-lock.yaml if exists
pnpm install --force
git add pnpm-lock.yaml
git commit -m "chore: regenerate lockfile"
git push

# Option B: If using npm instead of pnpm
# Change vercel.json installCommand from "pnpm install" to "npm install"
# Change package.json packageManager to npm
```

---

## Verification Checklist

After making fixes, verify:
- [ ] `pnpm --version` shows `10.9.0`
- [ ] `pnpm-lock.yaml` exists and has `lockfileVersion: '9.0'` or higher
- [ ] Vercel build completes successfully (green checkmark)
- [ ] Production URL shows the latest design changes
- [ ] No console errors in browser devtools

---

## Current Site Status

**Live URL:** https://foundery.space ✅ LIVE
**Last Confirmed Working:** Pre-June 4, 2026 commits
**Latest Commit (unverified deploy):** `fda3a04` (Jun 4, 2026)
