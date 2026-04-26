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
| A     | radix-ui      | TBD | TBD | TBD | TBD | optimizePackageImports: ["lucide-react", "radix-ui"] |
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

(populated in Task 2)

## Build B — input-otp added

(populated in Task 4)
