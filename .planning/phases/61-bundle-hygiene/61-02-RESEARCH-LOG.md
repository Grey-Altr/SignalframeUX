# 61-02 Research Log — Lazy-path packages (cmdk + vaul + sonner + react-day-picker)

**Plan:** 61-02
**Phase:** 61 — Bundle Hygiene
**Build invocation:** `rm -rf .next/cache .next && ANALYZE=true pnpm build`
**Stale-chunk guard:** Mandatory before every measurement (BND-04). The `.next/cache` and `.next` directories are deleted between builds to prevent webpack incremental-cache contamination of cross-commit measurements.
**Gating source:** "Route (app)" stdout table from `pnpm build`. The `.next/analyze/client.html` chartData is FORBIDDEN as a gating source (ROADMAP success criterion 1).
**Expected behavior:** The four lazy-loaded packages (cmdk via CommandPaletteLazy, vaul via sf-drawer-lazy, sonner via sf-toast-lazy, react-day-picker via SFCalendarLazy) do NOT contribute to the homepage's initial First Load JS per 61-RESEARCH §2. The Shared by all delta for builds C and D is expected to be approximately 0 KB. Zero delta is the expected result, NOT a regression (61-RESEARCH §Risks #5).

## date-fns SKIP decision

**date-fns SKIP** — `date-fns` ^4.1.0 is in the Next.js 15 default-optimized package list (61-RESEARCH §1). Zero direct `date-fns` imports exist in this repo (the package appears only as a transitive dependency via `react-day-picker`). Adding it to `optimizePackageImports` would be redundant but harmless; per 61-RESEARCH §6 + Risks #6 the cleaner choice is to SKIP and document the rationale. The final array therefore contains six non-skip BND-02 entries (lucide-react, radix-ui, input-otp, cmdk, vaul, sonner, react-day-picker) — the seven-string array reflects the planning conventions that count `lucide-react` as the original baseline + the six BND-02 additions.

## Per-build measurement table

| Build | Packages added | Shared by all (KB) | / First Load (KB) | /_not-found First Load (KB) | Delta vs Build B (KB) | Notes |
|-------|----------------|--------------------|-------------------|----------------------------|-----------------------|-------|
| B (carry-over from 61-01) | (baseline — lucide-react + radix-ui + input-otp) | 103 | 264 | 103 | 0 | Copied from 61-01-RESEARCH-LOG.md row B; serves as Plan 02 baseline. tsc --noEmit exit 0 at carry-over. |
| C     | cmdk + vaul    | 103                | 264               | 103                        | 0 (Shared); 0 on /    | optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul"]; tsc --noEmit exit 0; expected lazy-package no-delta confirmed (61-RESEARCH §Risks #5) |
| D     | sonner + react-day-picker | TBD     | TBD               | TBD                        | TBD                   | optimizePackageImports: [..., "sonner", "react-day-picker"]; expected ~0 KB delta on Shared by all (lazy packages) |

## Build B carry-over (baseline reference)

Source: `.planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md` row B (Build B — input-otp added).
Timestamp: 2026-04-26T20:14Z (Plan 01 capture).
next.config.ts state at carry-over: `optimizePackageImports: ["lucide-react", "radix-ui", "input-otp"]`
Build invocation: `rm -rf .next/cache .next && ANALYZE=true pnpm build`
Stale-chunk guard: APPLIED (BND-04)
Type-check: `pnpm exec tsc --noEmit` exit 0

Route (app) snapshot (relevant rows):
```
Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                    9.48 kB         264 kB
├ ○ /_not-found                            144 B         103 kB
+ First Load JS shared by all             103 kB
  ├ chunks/2979-7e3b1be684627f10.js      45.8 kB
  ├ chunks/5791061e-b51f32ecb5a3272a.js  54.2 kB
  └ other shared chunks (total)          2.56 kB
```

**Notes carried forward from Plan 01:**
- Eager-path harvest delivered −16 KB cumulative on `/` First Load JS at Plan 01 close (vs Build 0's 280 KB).
- Shared by all unchanged at 103 KB; BND-01 ≤102 KB target NOT closed by Plan 01. The 1 KB gap awaits Plan 02 lazy-package transforms (expected to yield 0 KB) or a separate vector outside Phase 61's scope (Plan 03 final-gate verdict).
- AES-04 pixel-diff canary 20/20 PASS at 0% confirmed invisible-by-construction for eager additions; same posture expected for lazy additions.

## Build C — cmdk + vaul added

Timestamp: 2026-04-26T20:23Z
next.config.ts state: `optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul"]`
Build invocation: `rm -rf .next/cache .next && ANALYZE=true pnpm build`
Stale-chunk guard: APPLIED (BND-04)
Source: `/tmp/phase61-build-C.txt` Route (app) stdout table
Type-check: `pnpm exec tsc --noEmit` exit 0 (project has no `typecheck` npm script — same Rule 3 substitution as Plan 01)

Route (app) snapshot (relevant rows):
```
Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                    9.48 kB         264 kB
├ ○ /_not-found                            144 B         103 kB
+ First Load JS shared by all             103 kB
  ├ chunks/2979-7e3b1be684627f10.js      45.8 kB
  ├ chunks/5791061e-b51f32ecb5a3272a.js  54.2 kB
  └ other shared chunks (total)          2.56 kB
```

**Delta vs Build B (carry-over baseline):**
- Shared by all: 103 KB → 103 KB (0 KB; **expected lazy-package no-delta confirmed** per 61-RESEARCH §Risks #5)
- `/` First Load JS: 264 KB → 264 KB (0 KB at KB-rounding granularity)
- `/_not-found` First Load JS: 103 KB → 103 KB (unchanged; confirms shared-floor stability)
- `/system`: 258 KB → 258 KB (0 KB)
- `/inventory`: 267 KB → 267 KB (0 KB)
- `/init`: 251 KB → 251 KB (0 KB)
- `/reference`: 273 KB → 273 KB (0 KB)
- `/builds`: 254 KB → 254 KB (0 KB)

**Interpretation:** cmdk and vaul are both behind `next/dynamic` wrappers (CommandPaletteLazy and sf-drawer-lazy.tsx respectively). They contribute zero bytes to the homepage's initial First Load JS, so the `optimizePackageImports` transform on these two packages has no measurable effect on the gating "Shared by all" metric or any per-route initial First Load. The transform may still reduce the size of the lazy chunks themselves when they are dynamically imported at user interaction time, but those chunks are NOT in the gating Route (app) stdout table per the BND-01 measurement protocol. **Zero delta is the expected, correct result — NOT a regression** (61-RESEARCH §Risks #5).

## Build D — sonner + react-day-picker added

(populated in Task 2)
