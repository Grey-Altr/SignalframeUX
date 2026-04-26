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
| B     | input-otp     | TBD | TBD | TBD | TBD | optimizePackageImports: ["lucide-react", "radix-ui", "input-otp"] |

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

(populated in Task 4)
