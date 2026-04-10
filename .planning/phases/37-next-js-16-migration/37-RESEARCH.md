# Phase 37: Next.js 16 Migration — Research

**Researched:** 2026-04-10
**Domain:** Next.js 15 → 16 framework migration
**Confidence:** HIGH (sourced directly from official Next.js blog posts and upgrade documentation)

---

## Executive Summary

Next.js 16.2 is the current stable release (as of April 2026). The jump from 15.5.14 to 16.x involves a well-defined set of breaking changes, most of which are either fully automated by codemods or require targeted file changes. The migration is characterized as "mostly straightforward" in community reports for apps already on Next.js 15 with async APIs already adopted.

**The single highest-risk item for SignalframeUX is the Tailwind CSS v4 + Turbopack build interaction** (a known Unicode code-point bug introduced between Tailwind 4.0.7 and 4.1.18). The project is on Tailwind 4.1.4 — this version falls in the affected range. Verify the current Tailwind patch status before running the first build. All other breaking changes are either non-issues for this codebase or straightforward codemods.

**Node.js compatibility is confirmed safe.** The project runs Node 20.20.0; Next.js 16 requires Node 20.9.0 minimum. No Node upgrade needed.

**middleware.ts is present and must be renamed to proxy.ts.** Next.js 16 treats `middleware.ts` as deprecated (with a console warning) and will remove it in a future version. The rename is a required migration step, not a future concern.

**Primary recommendation:** Run `npx @next/codemod@canary upgrade latest` first to automate the bulk of the migration, then address the five targeted manual changes documented in the Migration Steps section below.

---

## Breaking Changes Inventory

Sourced from the [Next.js 16 official blog post](https://nextjs.org/blog/next-16) and [Version 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16).

### Hard Removals (Things That No Longer Work)

| Removed Feature | Replacement | Impact on SignalframeUX |
|----------------|-------------|------------------------|
| Sync `params` / `searchParams` prop access | Must `await params`, `await searchParams` | LOW — no dynamic route segments exist in this app (flat routes only: /, /init, /inventory, /system, /reference) |
| Sync `cookies()`, `headers()`, `draftMode()` | Must `await` these calls | LOW — layout.tsx had headers() removed in Phase 36; no remaining sync usage confirmed |
| `next lint` command | Run `eslint` CLI directly; codemod available | MEDIUM — `package.json` scripts use `next lint` indirectly via `pnpm lint`; must update to `eslint .` |
| `serverRuntimeConfig`, `publicRuntimeConfig` | Environment variables | NONE — not used in this project |
| AMP support (`useAmp`, `amp: true` config) | Removed entirely | NONE — not used |
| `experimental.dynamicIO` flag | Renamed to `cacheComponents` (opt-in) | NONE — not used |
| `experimental.ppr` flag | Superseded by Cache Components model | NONE — not used |
| `export const experimental_ppr` | Route-level PPR removed | NONE — not used |
| `unstable_rootParams()` | API in progress | NONE — not used |
| Automatic `scroll-behavior: smooth` injection | Add `data-scroll-behavior="smooth"` to `<html>` to restore | MEDIUM — Lenis controls scroll entirely; the removed automatic injection is neutral or beneficial. No action required. |
| `devIndicators` sub-options (`appIsrStatus`, `buildActivity`, `buildActivityPosition`) | Removed from config | NONE — not used in next.config.ts |
| `next/legacy/image` | Use `next/image` | NONE — project already on `next/image` |

### Config Changes (Rename / Move)

| Old Config | New Config | Impact |
|-----------|-----------|--------|
| `experimental.turbopack` | Top-level `turbopack` | LOW — current next.config.ts does NOT use `experimental.turbopack`; codemod handles this automatically |
| `eslint` option in next.config | Removed entirely | LOW — not present in current next.config.ts |
| `images.domains` | `images.remotePatterns` | NONE — not used |

### Behavior Changes (No Code Removal, Changed Defaults)

| Changed Behavior | Old Default | New Default | Impact on SignalframeUX |
|-----------------|-------------|-------------|------------------------|
| Default bundler | webpack | Turbopack | LOW — project already runs Turbopack in dev (`next dev --turbopack`); production now also uses Turbopack by default. Opt out with `next build --webpack` if issues arise. |
| `images.minimumCacheTTL` | 60s | 4 hours | NONE — no `<Image>` components use remote src in this project |
| `images.imageSizes` | includes `16` | `16` removed | NONE — no remote image optimization used |
| `images.qualities` | `[1..100]` | `[75]` | NONE — no remote image quality optimization |
| `images.maximumRedirects` | unlimited | 3 | NONE — no image redirects |
| `revalidateTag()` signature | single arg | requires second `cacheLife` arg | NONE — not used in project source |
| `@next/eslint-plugin-next` format | Legacy `.eslintrc` | ESLint Flat Config default | LOW — project already uses flat config (`eslint.config.mjs` from Phase 36) |
| Parallel routes `default.js` | Optional | Required (build fails without) | NONE — project has no parallel route slots (`@slot` directories) |
| Prefetch cache behavior | Full page prefetch | Incremental (layout dedup) | POSITIVE — reduced prefetch transfer size, no code changes needed |
| Dev/build output directories | Shared | Separate | NONE — no scripts assume shared directory |

### Deprecations (Work But Warn)

| Deprecated | Action Required |
|------------|----------------|
| `middleware.ts` filename | Rename to `proxy.ts`, rename export to `proxy` |
| `revalidateTag()` single argument | Add second `cacheLife` arg (not used in project) |
| `next/legacy/image` | Not used |
| `images.domains` config | Not used |

---

## Migration Steps (Ordered)

### Step 0: Pre-Migration Baseline

Before touching any files:

```bash
# Record current Lighthouse and test state
pnpm build && pnpm start
# Run all 18 Playwright tests
pnpm exec playwright test
# Verify baseline: all 18 pass
```

### Step 1: Run the Official Codemod

The codemod handles: async params/searchParams/cookies/headers, `experimental.turbopack` → `turbopack` move, `next lint` script migration, and other automated fixes.

```bash
npx @next/codemod@canary upgrade latest
```

This also upgrades `next`, `react`, and `react-dom` to latest in `package.json`. Review the diff carefully before accepting all changes.

**Alternative manual upgrade:**
```bash
pnpm add next@latest react@latest react-dom@latest
```

### Step 2: Update `middleware.ts` → `proxy.ts`

**Current file:** `middleware.ts` — exports `middleware` function with CSP header logic.

**Required changes:**
1. Rename file: `middleware.ts` → `proxy.ts`
2. Rename the exported function: `middleware` → `proxy`
3. The `config` export with `matcher` stays exactly as-is

```typescript
// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    { source: "/((?!api|_next/static|_next/image|favicon.ico|fonts/).*)" },
  ],
};
```

**Note:** `middleware.ts` remains supported in Next.js 16 for Edge runtime use cases (deprecated but not removed yet), but the deprecation warning will appear in every dev/build run if the old file remains.

### Step 3: Update `package.json` `lint` Script

The `next lint` command is removed. The `pnpm lint` script currently runs `eslint .` (confirmed from Phase 36 ESLint setup), so this may already be correct. Verify:

```json
// package.json — must be:
"lint": "eslint ."
// NOT:
"lint": "next lint"
```

Also update `eslint-config-next` in devDependencies to match the new next version:
```bash
pnpm add -D eslint-config-next@latest
```

### Step 4: Update `next.config.ts`

The current `next.config.ts` is clean — it uses `experimental.optimizePackageImports` (still valid in Next.js 16) and does not use any removed flags. The only change needed is to verify `@next/bundle-analyzer` is compatible:

```bash
pnpm add -D @next/bundle-analyzer@latest
```

The codemod will move `experimental.turbopack` to top-level `turbopack` if detected, but this config does not use that flag.

### Step 5: Verify Tailwind CSS Compatibility

**Critical check before running the build:**

```bash
# Check current Tailwind version
pnpm list tailwindcss --depth=0
```

The project is on `tailwindcss: ^4.1.4`. A known Unicode code-point build failure existed between Tailwind 4.0.7 and 4.1.18 when used with Turbopack in Next.js 16. This bug has been resolved in the Tailwind repository (confirmed by the GitHub discussion being marked "Resolved"). However:

- If build fails with a `String.fromCodePoint` or Unicode error: downgrade Tailwind to `4.0.7` as a temporary workaround
- Check the current latest patch: `pnpm add -D tailwindcss@latest @tailwindcss/postcss@latest`

**Expected outcome:** Since the bug was fixed upstream, updating to the latest Tailwind 4.x patch should resolve the issue. Do NOT downgrade unless the bug is actively reproducible.

### Step 6: Run Full Build and Test Suite

```bash
# Full production build
pnpm build

# Start production server
pnpm start

# Run all 18 Playwright tests against production server
pnpm exec playwright test

# Check bundle size (must remain < 150KB gzip)
ANALYZE=true pnpm build
```

### Step 7: Run Lighthouse Verification

Verify 100/100 all categories is maintained on the production build. Use the existing `scripts/launch-gate.ts` (or `.mjs`) runner established in Phase 35.

---

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Tailwind 4.x + Turbopack build failure | HIGH | LOW (bug marked resolved upstream) | Pin Tailwind to latest patch; downgrade to 4.0.7 as fallback |
| middleware.ts deprecation warning polluting Lighthouse Best Practices | MEDIUM | HIGH (if not renamed) | Rename immediately in Step 2 |
| Playwright tests fail due to behavioral differences in prefetch cache | LOW | LOW | Run full suite; tests test DOM/behavior, not internal prefetch mechanics |
| Bundle size regression from Turbopack production build | LOW | LOW | First-load JS measured at ~109KB across 15 → 16 transitions in comparable apps; gate test at 150KB |
| Lighthouse regression from changed behavior defaults | LOW | LOW | No image optimization, no `scroll-behavior` CSS, no PPR in use |
| TypeScript errors from async API enforcement | LOW | VERY LOW | No dynamic route segments, no sync cookies()/headers() calls found in project source |
| React 19.2 compatibility issues (GSAP, Lenis, Three.js) | LOW | LOW | All libraries support React 19; existing integration tested at v1.5 |

---

## Codebase Impact Analysis

### Files Confirmed to Require Changes

| File | Change | Why |
|------|--------|-----|
| `middleware.ts` | Rename to `proxy.ts`, rename `middleware` export to `proxy` | `middleware.ts` is deprecated in Next.js 16; must rename to silence deprecation warning and prepare for eventual removal |
| `package.json` | Bump `next` to `^16.x`, verify `lint` script uses `eslint .` not `next lint` | Core dependency upgrade; `next lint` removed |
| `package.json` | Update `eslint-config-next` to match Next.js 16 | Peer dependency alignment |

### Files Confirmed Clean (No Changes Needed)

| File | Why Clean |
|------|-----------|
| `next.config.ts` | No removed flags used; `experimental.optimizePackageImports` is valid in Next.js 16; `withBundleAnalyzer` wrapper unchanged; redirects API unchanged |
| `tsconfig.json` | TypeScript 5.8 exceeds the 5.1 minimum; no Next.js-specific tsconfig changes in v16 |
| `app/layout.tsx` | No `headers()` / `cookies()` calls (removed in Phase 36); no `params`; static metadata export; sync Server Component — fully compatible |
| `app/page.tsx` | Sync Server Component, no params/searchParams (flat route) |
| `app/init/page.tsx` | Flat route, no params — likely clean (verify with codemod output) |
| `app/inventory/page.tsx` | Flat route, no params — likely clean |
| `app/system/page.tsx` | Flat route, no params — likely clean |
| `app/reference/page.tsx` | Flat route, no params — likely clean |
| `playwright.config.ts` | No Next.js-specific config; Playwright 1.59.1 is compatible with Next.js 16 |
| All SF components in `components/sf/` | Client/Server components unaffected by framework version upgrade |
| GSAP, Lenis, Three.js integrations | No known compatibility issues with Next.js 16 |
| Tailwind CSS v4 + `@theme` in globals.css | Turbopack integration bug is resolved; `@tailwindcss/postcss` approach unchanged |

### Files to Spot-Check After Codemod

The codemod adds `@next/codemod` comments where it cannot automatically fix something. Search for these after running:

```bash
grep -r "@next/codemod\|UnsafeUnwrapped" /Users/greyaltaer/code/projects/SignalframeUX/app --include="*.tsx" --include="*.ts"
```

Any files with these markers require manual resolution before the build will succeed.

---

## Node.js Version Requirement

**Next.js 16 minimum:** Node.js 20.9.0 (LTS)
**Project current:** Node.js 20.20.0

**Status: COMPATIBLE. No Node.js upgrade required.**

Node.js 18 is no longer supported by Next.js 16. Node.js 20.20.0 satisfies the requirement with margin.

---

## Dependency Compatibility Matrix

| Dependency | Current Version | Next.js 16 Status | Action |
|-----------|----------------|-------------------|--------|
| `next` | 15.5.14 | UPGRADE TO | `pnpm add next@latest` |
| `react` | 19.1.0 → 19.2.x | Next.js 16 ships React 19.2 | Update via codemod |
| `react-dom` | 19.1.0 → 19.2.x | Same | Update via codemod |
| `tailwindcss` | ^4.1.4 | Known Turbopack bug (resolved) | Update to latest patch |
| `@tailwindcss/postcss` | ^4.1.4 | Same | Update to latest patch |
| `typescript` | ^5.8.3 | Requires 5.1+ | COMPATIBLE, no change |
| `gsap` | ^3.12.7 | No known issues | No change |
| `lenis` | ^1.1.20 | No known issues with Next.js 16 | No change |
| `three` | ^0.183.2 | No known issues | No change |
| `@gsap/react` | ^2.1.2 | No known issues | No change |
| `radix-ui` | ^1.4.3 | Compatible (shadcn/ui fully supported) | No change |
| `shadcn` | ^4.1.2 | COMPATIBLE with Next.js 16 | No change |
| `@playwright/test` | ^1.59.1 | COMPATIBLE | No change |
| `eslint-config-next` | ^15.3.0 | Must match next version | Update to `^16.x` |
| `@next/bundle-analyzer` | ^16.2.2 | Already on v16 | Verify patch |
| `sonner` | ^2.0.7 | No known issues | No change |
| `lucide-react` | ^0.488.0 | No known issues | No change |
| `shiki` | ^4.0.2 | No known issues | No change |

---

## Recommended Approach

**Target version:** `next@16.2.x` (current stable as of April 2026) — do NOT target 16.0 or 16.1; 16.2 includes Turbopack improvements that are beneficial for this project.

**Strategy: Surgical, codemods first, Lighthouse verified after.**

1. Do not enable any new Next.js 16 features (Cache Components, React Compiler, Turbopack File System Cache) during this migration phase. The goal is zero-regression upgrade, not feature adoption.
2. Do not rename anything beyond `middleware.ts` → `proxy.ts`.
3. The `experimental.optimizePackageImports: ["lucide-react"]` in next.config.ts is valid in Next.js 16 — keep it.
4. Production Turbopack is now the default. This is a benefit (2-5x faster builds) with no configuration needed since Turbopack was already the dev bundler.

**Do NOT enable:**
- `cacheComponents: true` — opt-in feature, not needed for zero-regression migration
- `reactCompiler: true` — opt-in, requires Babel, increases compile time
- `turbopackFileSystemCacheForDev: true` — enabled by default in 16.1+, no action needed

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `middleware.ts` | `proxy.ts` (deprecated, not removed) | Next.js 16.0 | Rename required; Edge runtime still uses old filename temporarily |
| `next lint` command | `eslint .` directly | Next.js 16.0 (deprecated in 15.5) | Update `pnpm lint` script |
| Webpack as default bundler | Turbopack as default | Next.js 16.0 | Production builds now also use Turbopack; opt out with `--webpack` |
| `experimental.ppr` | `cacheComponents` (opt-in) | Next.js 16.0 | PPR flag removed; not used in this project |
| Implicit caching (fetch de-duplication) | Explicit opt-in caching via `use cache` | Next.js 16.0 | `cacheComponents: false` by default — no behavioral change unless opt-in |
| `revalidateTag(tag)` | `revalidateTag(tag, profile)` | Next.js 16.0 | Not used in project source |
| Sync params/searchParams | Async only (`await params`) | Next.js 16.0 (was warned in 15.x) | Codemod handles; no dynamic segments in this app |

---

## Open Questions

1. **Tailwind version pin after upgrade**
   - What we know: The Unicode bug between Tailwind 4.0.7 and 4.1.18 is marked resolved upstream
   - What's unclear: The exact patch version that contains the fix; the project is on 4.1.4 which may predate the fix
   - Recommendation: Run `pnpm build` immediately after upgrading next; if the Unicode/`String.fromCodePoint` error appears, pin `tailwindcss` and `@tailwindcss/postcss` to `4.0.7` as a stopgap and open a separate Phase 37 task to track the Tailwind patch

2. **React 19.2 upgrade impact on GSAP/Lenis**
   - What we know: Next.js 16 ships React 19.2; GSAP and Lenis are known to support React 19; the upgrade from 19.1 → 19.2 is minor
   - What's unclear: Whether any React 19.2 concurrent rendering changes affect GSAP's `useGSAP` hook
   - Recommendation: Run the full Playwright suite and manually test scroll animations after upgrade; if regressions appear, check GSAP v3 changelog for React 19.2 notes

3. **`@next/bundle-analyzer` v16 compatibility with new Turbopack analysis**
   - What we know: `@next/bundle-analyzer` in devDependencies is already at `^16.2.2` (coincidentally); Next.js 16.1 added `next experimental-analyze` as a built-in replacement
   - What's unclear: Whether the existing `ANALYZE=true pnpm build` workflow still functions identically
   - Recommendation: Test `ANALYZE=true pnpm build` as part of Step 6; if it fails, use `next experimental-analyze` (no config change needed)

4. **Vercel platform requirements**
   - What we know: Vercel is zero-configuration for Next.js 16; no platform-side changes needed; Node.js 20.x runtime is supported
   - What's unclear: Whether any Vercel-specific build settings in `vercel.json` (if it exists) need updating
   - Recommendation: Check for `vercel.json` or Vercel project settings; if `nodeVersion` is pinned to 18.x, update to 20.x

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.1 |
| Config file | `playwright.config.ts` |
| Quick run command | `pnpm exec playwright test tests/phase-35-bundle-gate.spec.ts` |
| Full suite command | `pnpm exec playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MG-01 | Next 16 builds without errors | smoke | `pnpm build` exits 0 | ✅ (build script) |
| MG-01 | App starts and serves root route | smoke | `pnpm exec playwright test tests/phase-35-homepage.spec.ts -x` | ✅ |
| MG-02 | All 18 Playwright E2E tests pass | e2e | `pnpm exec playwright test` | ✅ |
| MG-03 | Bundle < 150KB gzip | automated | `pnpm exec playwright test tests/phase-35-bundle-gate.spec.ts` | ✅ |
| MG-03 | Lighthouse 100/100 all categories | manual/script | `pnpm tsx scripts/launch-gate.mjs` | ✅ |

### Sampling Rate

- **Per task commit:** `pnpm build && pnpm exec playwright test tests/phase-35-bundle-gate.spec.ts -x`
- **Per wave merge:** `pnpm build && pnpm exec playwright test`
- **Phase gate:** Full suite green + Lighthouse 100/100 before Phase 38

### Wave 0 Gaps

None — existing test infrastructure covers all phase requirements. No new test files needed for this migration phase (regression verification uses existing 18-test suite).

---

## Sources

### Primary (HIGH confidence)

- [Next.js 16 Official Blog Post](https://nextjs.org/blog/next-16) — complete feature list, breaking changes table, behavior changes table, deprecation table
- [Next.js 16.1 Official Blog Post](https://nextjs.org/blog/next-16-1) — Turbopack FS caching stable, bundle analyzer, install size reduction
- [Next.js Version 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16) — official migration steps
- [Renaming Middleware to Proxy — Next.js Docs](https://nextjs.org/docs/messages/middleware-to-proxy) — proxy.ts specification
- [proxy.js File Conventions](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) — new file API

### Secondary (MEDIUM confidence)

- [GitHub Discussion #87221](https://github.com/vercel/next.js/discussions/87221) — real-world upgrade reports from 15.5.x → 16
- [GitHub Discussion #88443](https://github.com/vercel/next.js/discussions/88443) — Tailwind CSS v4.1.18 + Turbopack build failure; confirmed resolved
- [Next.js 16 Turbopack blog post](https://nextjs.org/blog/next-16-2-turbopack) — Turbopack 16.2 improvements

### Tertiary (LOW confidence, for awareness only)

- Community migration reports on amillionmonkeys.co.uk and salmanizhar.com — general "mostly straightforward" characterization; not independently verified

---

## Metadata

**Confidence breakdown:**
- Breaking changes inventory: HIGH — sourced directly from official Next.js 16 blog post breaking changes table
- Node.js compatibility: HIGH — official documentation states 20.9.0 minimum
- Tailwind/Turbopack bug: HIGH — GitHub discussion confirmed resolved, exact patch version unclear
- Playwright compatibility: HIGH — no framework-level changes affect test runner
- GSAP/Lenis/Three.js: MEDIUM — no specific Next.js 16 issues found; React 19.2 minor version bump is low risk
- shadcn/ui: MEDIUM — widely reported as compatible; no official shadcn docs confirmation fetched

**Research date:** 2026-04-10
**Valid until:** 2026-05-10 (stable ecosystem; Next.js patch releases are backward-compatible)
