# 61-01 Research Log — Eager-path packages (radix-ui + input-otp)

**Plan:** 61-01
**Phase:** 61 — Bundle Hygiene
**Build invocation:** `rm -rf .next/cache .next && ANALYZE=true pnpm build`
**Stale-chunk guard:** Mandatory before every measurement (BND-04). The `.next/cache` and `.next` directories are deleted between builds to prevent webpack incremental-cache contamination of cross-commit measurements.
**Gating source:** "Route (app)" stdout table from `pnpm build`. The `.next/analyze/client.html` chartData is FORBIDDEN as a gating source (ROADMAP success criterion 1).

## Per-build measurement table

| Build | Package added | Shared by all (KB) | / First Load (KB) | /_not-found First Load (KB) | Delta vs Build 0 (KB) | Notes |
|-------|---------------|--------------------|-------------------|----------------------------|-----------------------|-------|
| 0     | (baseline — lucide-react only) | 103 | 280 | 103 | 0 | Captured before any 61-01 changes |
| A     | radix-ui      | 103 | 264 | 103 | 0 (Shared by all); −16 KB on / | optimizePackageImports: ["lucide-react", "radix-ui"]; tsc --noEmit exit 0; chunk 3302 split out, 7525 −0.5 KB |
| B     | input-otp     | 103 | 264 | 103 | 0 (Shared by all); −16 KB cumulative on / | optimizePackageImports: ["lucide-react", "radix-ui", "input-otp"]; tsc --noEmit exit 0; pixel-diff canary 20/20 PASS at 0%; sub-KB delta vs Build A (defensive inclusion per RESEARCH §7) |

## Build 0 — Baseline (lucide-react only)

Timestamp: 2026-04-26T20:09Z
next.config.ts state: `optimizePackageImports: ["lucide-react"]`
Build invocation: `rm -rf .next/cache .next && ANALYZE=true pnpm build`
Stale-chunk guard: APPLIED (BND-04)
Source: `/tmp/phase61-build-0.txt` Route (app) stdout table

Route (app) snapshot (relevant rows):
```
Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                     9.6 kB         280 kB
├ ○ /_not-found                            144 B         103 kB
+ First Load JS shared by all             103 kB
  ├ chunks/2979-7e3b1be684627f10.js      45.8 kB
  ├ chunks/5791061e-b51f32ecb5a3272a.js  54.2 kB
  └ other shared chunks (total)          2.56 kB
```

**Note on chunks 3302 / 7525 (DGN-02 reference):** Per 61-RESEARCH §3 and Risks #4, the "Shared by all" line does NOT include three.js or the Radix-bearing chunks 3302 / 7525 — those are route-specific First Load JS contributing to the `/` row delta (280 - 103 = 177 KB route-specific). Plan 03's reduction% calculation will need to read chunk 3302 + 7525 sizes from the per-build webpack stats inside `.next/static/chunks/` (or from the analyzer client.html for non-gating delta attribution), since those chunk IDs do not appear in the gating "Shared by all" stdout table. The gating metric (BND-01) is the "Shared by all" floor, currently 103 KB; target ≤102 KB.

**Chunk 3302 / 7525 individual sizes (Build 0):**
- `chunks/3302-8fecac2542f70b11.js` — 163,174 bytes (159.3 KB raw on disk / ~52 KB gz est)
- `chunks/7525-bd3c686ad4f95bc2.js` — 76,893 bytes (75.1 KB raw on disk / ~25 KB gz est)
- Source: `ls -la .next/static/chunks/` after Build 0
- Sum: 240,067 bytes raw (~234.4 KB raw / ~77 KB gz est)
- These do NOT appear in the gating "Shared by all" stdout table — they are route-specific (loaded by `/`, possibly other Radix-consuming routes). Plan 03 reduction% calculation reads these chunk IDs from the per-build `.next/static/chunks/` directory, with FALSE-PASS GUARD: missing successor chunks default `Bf_X = B0_X` rather than treating absence as zero size.

## Build A — radix-ui added

Timestamp: 2026-04-26T20:11Z
next.config.ts state: `optimizePackageImports: ["lucide-react", "radix-ui"]`
Build invocation: `rm -rf .next/cache .next && ANALYZE=true pnpm build`
Stale-chunk guard: APPLIED (BND-04)
Source: `/tmp/phase61-build-A.txt` Route (app) stdout table
Type-check: `pnpm exec tsc --noEmit` exit 0 (project has no `typecheck` npm script — Deviation Rule 3 fallback)

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

**Delta vs Build 0:**
- Shared by all: 103 KB → 103 KB (0 KB; expected — Radix lives in route-specific chunks, not the shared floor)
- `/` First Load JS: 280 KB → 264 KB (**−16 KB**, ~5.7% reduction on homepage initial load)
- `/_not-found` First Load JS: 103 KB → 103 KB (unchanged; confirms shared-floor stability)
- `/system`: 274 KB → 258 KB (−16 KB)
- `/inventory`: 282 KB → 267 KB (−15 KB)
- `/init`: 266 KB → 251 KB (−15 KB)
- `/reference`: 288 KB → 273 KB (−15 KB)

**Chunk-level changes (.next/static/chunks/):**
- `chunks/3302-…` 163,174 B (Build 0) → DISAPPEARED (Build A) — Radix barrel rewrite split this chunk into smaller per-sub-package chunks
- `chunks/7525-bd3c686ad4f95bc2.js` 76,893 B → `chunks/7525-0ad32677ff03b3b4.js` 76,392 B (−501 B; popper cluster largely intact)
- New chunks observed: `4335-bf50e6d7818b5591.js` 112,290 B (likely contains the surviving Radix sub-modules actually used)

**Interpretation:** The `optimizePackageImports: ["radix-ui"]` transform is working as designed — webpack now imports only the specific Radix sub-packages referenced by the codebase rather than the full meta-package barrel. The route-level First Load JS for every page that consumes Radix (via the sf barrel) drops by ~15-16 KB. Shared-floor (BND-01 metric) is unchanged because Radix was never on the shared floor; this confirms 61-RESEARCH §3 + Risks #4 — the BND-01 ≤102 KB target needs a different lever (date-fns is already default-optimized; Plan 03 final gate may show shared-floor remains 103 KB, in which case the −1 KB delta needed for BND-01 must come from Plan 02 lazy packages or a separate vector).

## Build B — input-otp added

Timestamp: 2026-04-26T20:14Z
next.config.ts state: `optimizePackageImports: ["lucide-react", "radix-ui", "input-otp"]`
Build invocation: `rm -rf .next/cache .next && ANALYZE=true pnpm build`
Stale-chunk guard: APPLIED (BND-04)
Source: `/tmp/phase61-build-B.txt` Route (app) stdout table
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

**Delta vs Build 0 (cumulative for radix-ui + input-otp):**
- Shared by all: 103 KB → 103 KB (0 KB; expected)
- `/` First Load JS: 280 KB → 264 KB (**−16 KB cumulative**, identical to Build A)
- `/_not-found` First Load JS: 103 KB → 103 KB (unchanged)
- All Radix-consuming routes: −15 to −16 KB (same as Build A)

**Delta vs Build A (input-otp marginal contribution):**
- Shared by all: 0 KB
- `/` First Load JS: 0 KB (sub-KB at the stdout's KB rounding)
- Chunk-level: chunks/4335 112,290 → 112,377 B (+87 B, likely hash-only); chunks/7525 unchanged at 76,392 B
- New chunk observed: chunks/4458-22236c64bfc7cb12.js 71,220 B (replaces chunk 6040 from Build A; net 0 B at the chunk-roster level)

**Interpretation — input-otp as defensive inclusion (RESEARCH §7):** input-otp ^1.4.2 has a small barrel surface and the optimizePackageImports transform produced no measurable initial-load delta beyond what Build A's radix-ui transform already captured. This is the documented "defensive inclusion" outcome — cost zero, gain nonzero (sub-KB level), no regression introduced. The package is now part of the build-time barrel-rewrite set so future input-otp surface expansion (or unused-export accumulation) will be tree-shaken automatically.

**AES-04 pixel-diff canary spec (Phase 59 → reused for Build B):**
- Command: `CI=true pnpm exec playwright test tests/v1.8-phase59-pixel-diff.spec.ts --project=chromium`
- Result: **20/20 PASS at 0% diff** (5 routes × 4 viewports = 20 screens)
- Routes covered: home, system, init, inventory, reference
- Viewports covered: desktop-1440x900, iphone13-390x844, ipad-834x1194, mobile-360x800
- Runtime: ~48.8s total (autoStart prod server + diff)
- Verdict: **invisible-by-construction confirmed** — eager-path package optimizations introduce zero pixel regression. Plan 03's final AES-04 gate (the dedicated `tests/v1.8-phase61-bundle-hygiene.spec.ts` with `MAX_DIFF_RATIO = 0`) is expected to pass on the same basis.

## Notes for Plan 02

1. **Eager-path packages have delivered the route-specific gain ceiling.** The per-route −16 KB on `/` is the entire eager-path harvest. Plan 02 (lazy packages cmdk + vaul + sonner + react-day-picker) is expected to show ~0 KB delta on Shared by all AND on `/` First Load JS, per RESEARCH §6 + Risks #5. This is not a failure mode.

2. **BND-01 ≤102 KB target is NOT closed by Plan 01.** "Shared by all" remains 103 KB. The 1 KB gap to BND-01 must come from either:
   (a) Plan 02 lazy-package transforms shifting some marginal modules off the shared floor, OR
   (b) A separate vector outside Phase 61's optimizePackageImports scope (would require escalation in Plan 03 final-gate).
   Plan 03 must record whether the 102 KB target is achievable within Phase 61's mandate or whether a follow-up phase is needed.

3. **Chunk 3302 fragmentation is a feature, not a bug.** Build 0's chunk 3302 (163,174 B containing aggregate Radix) was split by the radix-ui barrel rewrite into multiple smaller chunks, with chunk 4335 (112,377 B) absorbing the largest contiguous chunk of actually-used Radix sub-modules. Plan 03's reduction% calculation against the DGN-02 baseline must account for chunk-ID drift (per ROADMAP plan-checker FALSE-PASS GUARD: missing successor chunks default `Bf_X = B0_X`).

4. **No deviations escalated.** All work in Plan 01 fell within scope. The only deviation triggered was Rule 3 (blocking issue): no `typecheck` npm script in package.json — substituted `pnpm exec tsc --noEmit` (still exit 0 across all builds; no type regression).
