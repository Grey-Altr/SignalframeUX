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
| D     | sonner + react-day-picker | 103     | 264               | 103                        | 0 (Shared); 0 on /    | optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"] (final v1.8-lock end-state); tsc --noEmit exit 0; expected lazy-package no-delta confirmed (61-RESEARCH §Risks #5) |

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

Timestamp: 2026-04-26T20:25Z
next.config.ts state: `optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"]` (final v1.8-lock BND-02 end-state)
Build invocation: `rm -rf .next/cache .next && ANALYZE=true pnpm build`
Stale-chunk guard: APPLIED (BND-04)
Source: `/tmp/phase61-build-D.txt` Route (app) stdout table
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

**Delta vs Build B (carry-over baseline):**
- Shared by all: 103 KB → 103 KB (0 KB; **expected lazy-package no-delta confirmed** per 61-RESEARCH §Risks #5)
- `/` First Load JS: 264 KB → 264 KB (0 KB at KB-rounding granularity)
- `/_not-found` First Load JS: 103 KB → 103 KB (unchanged; confirms shared-floor stability)
- `/system`: 258 KB → 258 KB (0 KB)
- `/inventory`: 267 KB → 267 KB (0 KB)
- `/init`: 251 KB → 251 KB (0 KB)
- `/reference`: 273 KB → 273 KB (0 KB)
- `/builds`: 254 KB → 254 KB (0 KB)

**Delta vs Build C (sonner + react-day-picker marginal contribution):**
- Shared by all: 0 KB
- `/` First Load JS: 0 KB (sub-KB at the stdout's KB rounding)
- All routes hold steady at Build C values — no measurable initial-load impact from these two additions

**Interpretation:** sonner and react-day-picker are both behind `next/dynamic` wrappers (sf-toast-lazy.tsx with `ssr: false` mounting `SFToasterLazy` at app layout, and SFCalendarLazy with `ssr: false` — Calendar is NOT exported from `sf/index.ts` barrel and `PreviewCalendar` in components-explorer uses a static HTML mock with no real package import). Their `optimizePackageImports` transform has no measurable effect on the gating "Shared by all" metric or any per-route initial First Load JS. **Zero delta is the expected, correct result — NOT a regression** (61-RESEARCH §Risks #5).

**End-state confirmation:** `optimizePackageImports` array now contains the final v1.8-lock BND-02 list of 7 entries (`lucide-react` baseline + 6 BND-02 additions: `radix-ui`, `input-otp`, `cmdk`, `vaul`, `sonner`, `react-day-picker`). `date-fns` SKIPPED per Plan-02 §"date-fns SKIP decision" — already in Next.js 15 default-optimized list (61-RESEARCH §1).

## Notes for Plan 03

1. **Lazy-path harvest is complete at 0 KB delta on Shared by all AND on `/` First Load JS.** This confirms 61-RESEARCH §Risks #5 — adding lazy packages to `optimizePackageImports` does not move the gating metrics because those packages were never on the homepage's initial bundle. The transform may have shrunk the lazy chunks themselves, but lazy chunks are not measured by Plan 02.

2. **BND-01 ≤102 KB target remains UNCLOSED at end of Plan 02.** Shared by all is still 103 KB. The 1 KB gap to BND-01 must be addressed by Plan 03's final-gate verdict — either:
   (a) declare ≤102 KB target unachievable within Phase 61's optimizePackageImports-only mandate (escalation to Phase 62 follow-up), OR
   (b) discover a final-gate vector outside scope (e.g., re-baselining the 103 KB as the floor due to Next.js 15 runtime size, accepting `≤103 KB` as the practical lock).

3. **Total `/` First Load JS reduction across Phase 61:** 280 KB (Build 0) → 264 KB (Build D) = **−16 KB / 5.7%** route-specific reduction on the homepage. Per-route reductions of −15 to −16 KB across all Radix-consuming pages. This is the entire Phase 61 BND-02 harvest; lazy additions in Plan 02 added zero further harvest at the gating-metric level (defensive inclusions only).

4. **No regression risk to Plan 03 AES-04 pixel-diff gate.** Plan 01's 20/20 PASS at 0% canary already established invisible-by-construction for eager-path additions; lazy-path additions affect zero rendered pixels by definition (the lazy chunks remain unmounted on initial load). Plan 03's dedicated `tests/v1.8-phase61-bundle-hygiene.spec.ts` at MAX_DIFF_RATIO=0 is expected to pass on the same basis.

5. **Final next.config.ts state for Plan 03 input:**
   ```ts
   optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"],
   ```
   `useCache: true` and the `redirects()` block remain unchanged from Plan 01 baseline.

6. **No deviations escalated in Plan 02.** All work fell within scope. The two Plan 01 deviations carried forward (Rule 3 node_modules absence + Rule 3 typecheck-script substitution) recurred mechanically here: `pnpm install --frozen-lockfile` to populate node_modules; `pnpm exec tsc --noEmit` substituted for non-existent `pnpm typecheck` script. Both already documented in Plan 01 SUMMARY; no further escalation needed.
