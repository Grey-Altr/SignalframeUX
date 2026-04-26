# Phase 61 Research — Bundle Hygiene

**Captured:** 2026-04-26
**Phase:** 61
**Inputs:** DGN-02 (`.planning/codebase/v1.8-lcp-diagnosis.md`), ROADMAP.md, REQUIREMENTS.md
**Build invocation:** `rm -rf .next/cache .next && ANALYZE=true pnpm build`
**Firecrawl:** Not available (standard desk research mode)

---

## 1. optimizePackageImports — Mechanics & Compatibility

### What it does

`experimental.optimizePackageImports` is a Next.js webpack transform that rewrites barrel-file imports into direct deep-path imports at build time. For example, `import { Foo } from "some-lib"` becomes `import Foo from "some-lib/dist/Foo"` (or equivalent), eliminating the need for webpack to statically analyze the full barrel to determine what is used. This reduces both development HMR overhead and production bundle size for packages with hundreds or thousands of barrel-exported modules.

**Critical distinction:** This is a webpack-layer transform. Turbopack performs equivalent tree-shaking automatically without config. The repo uses `pnpm dev --turbopack` for development but `pnpm build` = `next build` (standard webpack, no `--turbopack` per `package.json:59`). Therefore `optimizePackageImports` only affects production builds — the gating measurement surface.

Source: Context7 / vercel/next.js canary docs, retrieved 2026-04-26.

### Default-optimized packages (no config needed)

Next.js 15.x automatically applies this optimization to a curated list including `date-fns`, `lodash-es`, `ramda`, and several icon + UI libraries (`@heroicons/react`, `@tabler/icons-react`, `antd`, `react-bootstrap`, `@mui/material`, `recharts`, `@visx/visx`, `@tremor/react`, `rxjs`). **`date-fns` v4 is in this default list.** Adding it to `optimizePackageImports` is redundant but harmless.

Source: Context7 / vercel/next.js `optimizePackageImports.mdx`, retrieved 2026-04-26.

### Per-package compatibility matrix

| Package | Version | Import pattern in this repo | optimizePackageImports compatible? | Notes |
|---------|---------|----------------------------|-----------------------------------|-------|
| `radix-ui` | ^1.4.3 | `import { Dialog as DialogPrimitive } from "radix-ui"` (meta-package, 27 files) | YES — this is the correct form | The `radix-ui` meta-package ^1.4.x was introduced precisely to support this pattern. Individual `@radix-ui/react-*` scoped packages are NOT imported directly anywhere in this repo (grep returned zero results). Add `"radix-ui"` not `"@radix-ui/react-*"` |
| `cmdk` | ^1.1.1 | `import { Command as CommandPrimitive } from "cmdk"` (single file: `components/ui/command.tsx`) | YES | Small surface; lazy-loaded via CommandPaletteLazy → NOT on initial shared bundle. optimizePackageImports would have marginal effect on initial load but is safe to add. |
| `vaul` | ^1.1.2 | `import { Drawer as DrawerPrimitive } from "vaul"` (single file: `components/ui/drawer.tsx`) | YES | Lazy-loaded via `sf-drawer-lazy.tsx` using `next/dynamic`. NOT on initial shared bundle. Safe to add; marginal gain on initial load. |
| `sonner` | ^2.0.7 | `import { Toaster, toast } from "sonner"` (single file: `components/sf/sf-toast.tsx`) | YES | Lazy-loaded via `sf-toast-lazy.tsx` using `next/dynamic` with `ssr: false`. App layout mounts `SFToasterLazy`. NOT on initial shared bundle. Safe to add; marginal gain on initial load. |
| `react-day-picker` | ^9.14.0 | `import {...} from "react-day-picker"` (single file: `components/ui/calendar.tsx`) | YES | Calendar is P3 lazy — NOT exported from `sf/index.ts` barrel, NOT used anywhere in app pages. `SFCalendarLazy` uses `next/dynamic`. Only appears as a static DOM preview mock in `components-explorer.tsx:364-381` (no real import — `PreviewCalendar()` renders plain HTML grid, no calendar package import). Negligible gain on initial load, but safe to add. |
| `date-fns` | ^4.1.0 | **Zero imports** in `components/`, `app/`, `lib/` | N/A — already in Next.js default list | `date-fns` is auto-optimized by Next.js 15. No direct imports exist in this repo (date-fns is a transitive dep via `react-day-picker`). Skip or add redundantly — no harm either way. |
| `input-otp` | ^1.4.2 | `import { OTPInput, OTPInputContext } from "input-otp"` (single file: `components/ui/input-otp.tsx`) | YES | **EAGER path.** `sf/index.ts` barrel exports `SFInputOTP` (line 177-181) from `sf-input-otp.tsx` → `ui/input-otp.tsx` → `"input-otp"`. Any page importing from the sf barrel (including `/` via `SFPanel, SFSection`) transitively pulls input-otp into the initial bundle. This is confirmed by DGN-02 chunk 3302 containing input-otp 9.1 KB. Priority candidate for optimizePackageImports. |

### Known compatibility issues

No known runtime-breaking incompatibilities with any of the seven packages. The transform is purely build-time import rewriting. Risk profile:

- **Packages with conditional exports** (e.g., CJS/ESM split): Next.js 15 handles these correctly via package.json `exports` field resolution.
- **Packages using `__esModule` interop markers**: Low risk for all seven candidates; all are modern ESM packages.
- **Side-effect imports** (CSS-in-JS, theme registrations): None of the seven candidates rely on import side-effects in this repo's usage patterns. The `sideEffects` array in `package.json` covers only GSAP helpers and CSS.

### Radix-ui: meta-package vs scoped packages — resolution

All 27 files importing from `radix-ui` use the **meta-package form** (`from "radix-ui"`), not the individual scoped `@radix-ui/react-*` packages. The `radix-ui` ^1.4.3 meta-package re-exports all sub-packages through its own barrel. Therefore `optimizePackageImports: ["radix-ui"]` is the correct entry — NOT `"@radix-ui/react-dialog"` etc. Adding individual scoped packages would be redundant since none appear in this repo's direct imports.

---

## 2. Per-Package Import Surface in This Repo

### Import surface map

| Package | Direct import files | Load posture | On `/` initial bundle? | Phase 61 priority |
|---------|--------------------|--------------|-----------------------|------------------|
| `radix-ui` | 27 files in `components/ui/*.tsx` + 2 in `components/sf/*.tsx` | EAGER via sf barrel chain (ui/ wrappers are consumed by sf/ wrappers which are in index.ts) | YES — chunk 3302 (148.1 KB @radix-ui aggregate) + chunk 7525 (53.3 KB popper cluster) | HIGH — largest savings |
| `input-otp` | `components/ui/input-otp.tsx` | EAGER via sf barrel (sf/index.ts:177-181 → sf-input-otp.tsx → ui/input-otp.tsx) | YES — chunk 3302 (9.1 KB) | HIGH |
| `cmdk` | `components/ui/command.tsx` | LAZY via CommandPaletteLazy (`next/dynamic`, `ssr: false`) | NO | LOW — safe to add, no initial-load gain |
| `vaul` | `components/ui/drawer.tsx` | LAZY via sf-drawer-lazy.tsx (`next/dynamic`) | NO | LOW — safe to add, no initial-load gain |
| `sonner` | `components/sf/sf-toast.tsx` | LAZY via sf-toast-lazy.tsx (`next/dynamic`, `ssr: false`) | NO | LOW — safe to add, no initial-load gain |
| `react-day-picker` | `components/ui/calendar.tsx` | LAZY via sf-calendar-lazy.tsx (`next/dynamic`); NOT in barrel; PreviewCalendar in components-explorer uses a static HTML mock with no package import | NO | LOW — safe, negligible gain |
| `date-fns` | Zero direct imports | Transitive via react-day-picker; already in Next.js default optimization list | NO | SKIP — already default-optimized |

### Barrel chain for radix-ui (eager path explained)

```
app/page.tsx
  → import { SFPanel, SFSection } from "@/components/sf"  (sf/index.ts barrel)
  → sf/index.ts exports SFPanel → sf-panel.tsx → ui/dialog.tsx → import { Dialog } from "radix-ui"
  → sf/index.ts exports SFNavigationMenu → sf-navigation-menu.tsx → ui/navigation-menu.tsx → import { NavigationMenu } from "radix-ui"
  → ... (all 27 components transitively loaded when any barrel consumer mounts)
```

The sf barrel's eager-export model means adding `"radix-ui"` to `optimizePackageImports` will tell webpack to only bundle the specific Radix sub-packages actually referenced, rather than the full re-exported surface. This is the primary BND-02 gain.

### Key finding on `input-otp`

`input-otp` is the only non-Radix package with a confirmed eager path through the sf barrel. The v1.3 barrel discipline (no `'use client'` in index.ts) is unrelated to whether components are eagerly exported. `SFInputOTP` IS eagerly exported (lines 177-181). Adding `"input-otp"` to `optimizePackageImports` will help webpack tree-shake any unused exports from the input-otp barrel.

### Note on chunk 4901 (lib/api-docs, 95.8 KB)

This chunk is NOT on `/`'s first load JS. `component-detail.tsx` (which imports `API_DOCS` from `lib/api-docs`) is lazy-loaded via `next/dynamic` in every consumer (`components-explorer.tsx`, `inventory-section.tsx`, `component-grid.tsx`). This is confirmed by the explicit comments in those files ("API_DOCS lookup now lives inside ComponentDetail (lazy chunk)"). Phase 61 does not need to touch this chunk.

---

## 3. Three.js Posture (Out of Scope)

### Why three cannot be addressed by optimizePackageImports

`optimizePackageImports` is a barrel-import rewriting transform — it is effective against packages that export large numbers of named symbols through a barrel file where only a subset is used. Three.js does not have this problem: it exposes one namespace (`THREE`) and the code in this repo already imports specific three.js classes (e.g., `import { WebGLRenderer, Scene } from "three"`). The tree-shaking is already applied at the class/symbol level. `optimizePackageImports` would do nothing.

Three.js's 515 KB (parsed) / ~128 KB (gz) footprint across two chunks (`e9a6067a` + `74c6194b`) represents the genuinely-used portion of three after existing tree-shaking.

### Route-level scoping of three.js

The two three.js chunks appear in the "All chunks" build output but the Route (app) table from DGN-02 shows:

- `/` (homepage): 279 KB First Load JS
- `/_not-found`: 103 KB (pure Next.js runtime + shared — the floor)
- Delta for `/`: ~176 KB route-specific JS

The shared-by-all floor (103 KB) includes `2979-…` (Next.js runtime, 45.8 KB) and `5791061e-…` (Next compiled react-dom, 54.2 KB). Three.js chunks are NOT listed under "Shared by all" — they are route-specific or shared across a subset of routes that use WebGL.

**Important:** The three.js chunks may be shared across `/`, `/system`, `/init` etc. (all of which render WebGL). They do NOT belong in the "shared by all" floor. Phase 61's BND-01 target ("shared JS ≤102 KB") refers to the `/_not-found` proxy (103 KB current baseline = Next.js runtime, NOT three.js). Three.js's route-specific share is separate.

**Standing rule:** Phase 61 must NOT count three.js reduction as progress toward BND-01. If the "shared by all" row drops after Phase 61, it is due to Radix/input-otp optimization, not three.

---

## 4. Measurement Protocol (BND-04)

### Stale-chunk guard (mandatory before any gating measurement)

```bash
rm -rf .next/cache .next
```

This must run before every production build used for measurement. The `.next/cache` directory can contain stale webpack module graphs and chunk splits from previous builds. Any measurement sourced from a cached build is invalid as a gate.

### Full measurement invocation

```bash
rm -rf .next/cache .next && ANALYZE=true pnpm build 2>&1 | tee /tmp/phase61-build-$(date +%Y%m%d-%H%M).txt
```

### Gating source: Route (app) table — MANDATORY

Read the "Route (app)" table printed to stdout during `pnpm build`. Specifically:

- **Shared by all**: This line reports the First Load JS that every route pays. Target: ≤102 KB.
- **`/` (homepage)**: First Load JS including route-specific chunks.
- **`/_not-found`**: First Load JS approximating raw shared JS (route code is 141 B).

```
Route (app)                        Size     First Load JS
┌ ○ /                              9.61 kB        279 kB    ← watch this number
├ ○ /_not-found                      141 B        103 kB    ← proxy for shared JS floor
...
+ First Load JS shared by all        103 kB
  ├ chunks/2979-….js                45.8 kB
  ├ chunks/5791061e-….js            54.2 kB
  └ other shared chunks             2.55 kB
```

**FORBIDDEN gating source:** The analyzer intermediate HTML at `.next/analyze/client.html` (webpack-bundle-analyzer treemap chartData). This file represents the analyzer's parsing of module graph — NOT the actual emitted-artifact sizes used by the browser. Size numbers diverge because the analyzer does not account for webpack's final minification pass. Per ROADMAP success criterion 1, this source is explicitly prohibited for gating.

### Per-package re-run template (BND-02 mandate)

ROADMAP criterion 2 states: "Each addition is accompanied by an `ANALYZE=true pnpm build` re-run logged in plan RESEARCH.md." This mandates per-addition builds, not a batch. The template for each:

```
### Package: [package-name] — Build N/7
Command: rm -rf .next/cache .next && ANALYZE=true pnpm build
Timestamp: [YYYY-MM-DD HH:MM]
Before (Shared by all): [X KB]
After (Shared by all): [Y KB]
Before (/ First Load JS): [X KB]
After (/ First Load JS): [Y KB]
Delta: [+/-Z KB]
next.config.ts state:
  optimizePackageImports: ["lucide-react", ..., "[package-name]"]
```

**Resolved ambiguity — batch vs. per-package:** The ROADMAP criterion 2 text is unambiguous: "each addition is accompanied by an `ANALYZE=true pnpm build` re-run." This mandates per-addition sequential builds. Each package addition gets its own build + measurement logged. The overhead (~30-60s × 7 additions = ~7 minutes) is acceptable given the milestone's calibration requirements.

**Recommended plan shape:** One plan per package group (high-impact first, lazy packages as a single batch at end). See Section 6 for ordering recommendation.

---

## 5. Visual Regression Verification

### Existing test infrastructure (fully sufficient)

The project has a complete pixel-diff harness from Phase 59 that can be reused verbatim for Phase 61:

- **Baseline capture script:** `tests/v1.8-baseline-capture.spec.ts` — captures full-page screenshots at 4 viewports × 5 routes = 20 images to `.planning/visual-baselines/v1.8-start/`
- **Pixel-diff test:** `tests/v1.8-phase59-pixel-diff.spec.ts` — compares current production screenshots against the v1.8-start baselines using `pixelmatch` at a 0.5% threshold (AES-04)
- **Phase 60 variant:** `tests/v1.8-phase60-aes04-diff.spec.ts` — same pattern, slightly different gate (also 0.5%)
- **devDeps available:** `pixelmatch@^7.1.0`, `pngjs@^7.0.0`, `@types/pixelmatch`, `@types/pngjs` — all installed

### Recommended approach for Phase 61

Create `tests/v1.8-phase61-aes04-diff.spec.ts` as a copy-with-rename of `v1.8-phase59-pixel-diff.spec.ts`, changing only the describe label and using `MAX_DIFF_RATIO = 0` (bundle hygiene is invisible by construction — zero pixel diff expected, same logic as CRT-01).

**Run sequence:**
1. `pnpm build && pnpm start` (must be production build with Phase 61 changes applied)
2. `pnpm playwright test tests/v1.8-phase61-aes04-diff.spec.ts --project=chromium`

The test compares against `.planning/visual-baselines/v1.8-start/` which already exists (20 baseline PNGs confirmed present). No new baseline capture is needed for Phase 61 — the v1.8-start baselines are the reference.

**Gate:** 0% pixel diff (any non-zero diff is a regression since bundle hygiene changes are by definition invisible). Escalation path: if a non-zero diff appears, revert the most recent `optimizePackageImports` addition and bisect.

---

## 6. Plan Ordering Recommendation

### Resolved: per-addition builds are mandatory

ROADMAP criterion 2 explicitly mandates a build re-run per package addition. This is not ambiguous. The planner must structure plans so each addition gets its own build and logged measurement.

### Recommended plan decomposition

**Plan 01 — High-impact eager packages + baseline measurement**

Add in one commit: `"radix-ui"` and `"input-otp"` to `optimizePackageImports`. These are the only two packages with confirmed eager load paths on `/`'s initial bundle (DGN-02 confirmed: chunk 3302 = Radix 148.1 KB + input-otp 9.1 KB, chunk 7525 = Radix 53.3 KB). Run a full build measurement after each addition (two builds total in this plan).

Expected impact: the two Radix chunks (3302 + 7525) are candidates for size reduction. The actual reduction depends on how many Radix sub-packages are actually used vs. exported by the meta-package barrel.

**Plan 02 — Lazy packages (batch, single build)**

Add in one commit: `"cmdk"`, `"vaul"`, `"sonner"`, `"react-day-picker"` to `optimizePackageImports`. These are all lazy-loaded; their impact on initial load is zero or negligible. Batching them into one build is justified because:
- They are all orthogonal (no inter-dependency in the optimization transform)
- None contributes to the homepage's initial First Load JS
- The ROADMAP criterion 2 "each addition" constraint is honored within the plan's build log (log them sequentially in the RESEARCH.md table even if the commit is batched)

ROADMAP criterion 2 says "each addition is accompanied by an `ANALYZE=true pnpm build` re-run." Strict reading = 4 individual builds. If the planner wants strict compliance, run 4 builds. If pragmatic, run 1 build for the batch and document why (lazy packages → no initial-load delta → single measurement sufficient for attribution). The research recommendation is: run 2 builds (after cmdk+vaul, then after sonner+react-day-picker) — split the lazy batch in half to produce two measurement points without 4× overhead.

**Plan 03 — BND-03 verify + BND-01 final gate**

Run `grep -n "use client" components/sf/index.ts` to confirm zero matches (BND-03 already satisfied per pre-audit, but requires a logged verification step). Run final gating build for BND-01 confirmation. Run Phase 61 pixel-diff spec.

### Sequencing rationale

| Plan | Packages added | Build runs | Expected delta (Shared by all) |
|------|---------------|------------|-------------------------------|
| 01 | radix-ui → build A; input-otp → build B | 2 | Unknown until measured; potentially -5 to -20 KB gz on / |
| 02 | cmdk+vaul → build C; sonner+react-day-picker → build D | 2 | ~0 KB (lazy packages) |
| 03 | None (verify + gate) | 1 | Final gate confirmation |

**Total builds:** 5 (well within overhead budget; ~3-4 minutes total build time).

---

## 7. Validation Architecture

Nyquist mapping — each BND requirement mapped to its full measurement chain.

| REQ-ID | sense_dimension | measurement_protocol | frequency | signal_to_capture | reference_baseline |
|--------|----------------|---------------------|-----------|------------------|-------------------|
| BND-01 | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build`; read "First Load JS shared by all" from Route (app) stdout table; must be ≤102 KB | Once per plan (Plans 01+02); final gate in Plan 03 | KB value from "First Load JS shared by all" row | 103 KB (current v1.8 baseline per DGN-02 §2c); target ≤102 KB; also track: 119 KiB unused-JS must be reduced ≥80% |
| BND-02 | build-output + static-grep | After each package addition: `rm -rf .next/cache .next && ANALYZE=true pnpm build`; log "Shared by all" + "/ First Load JS" before/after delta; also verify: `grep "optimizePackageImports" next.config.ts` shows all 6 non-skip packages | Per-package-addition (per Plan 01 builds A+B; per Plan 02 builds C+D) | KB delta per addition; final array must contain: radix-ui, cmdk, vaul, sonner, react-day-picker, input-otp | current `next.config.ts`: `optimizePackageImports: ["lucide-react"]` only |
| BND-03 | static-grep | `grep -n "use client" components/sf/index.ts` → must return zero matches | Once in Plan 03 (verify step) | Match count (pass = 0 matches) | Current state: 0 matches (pre-audit confirmed; this is a verification-only task) |
| BND-04 | process-discipline | Document `rm -rf .next/cache .next` as mandatory prefix in every plan's build step; add explicit comment in each PLAN.md wave that uses `ANALYZE=true pnpm build` | Every plan, every build step in Phase 61 | Presence of the cleanup command in the documented step (human-review gate) | The stale-chunk false-positive documented in Risks §1 below |

---

## Risks & Pitfalls

### 1. Stale-chunk false-positive (HIGH risk)

Running `ANALYZE=true pnpm build` without first deleting `.next/cache` and `.next` can report sizes from the previous build's chunk graph rather than the current one. Webpack's incremental cache is not safe for cross-commit measurements. **Always run `rm -rf .next/cache .next` before any gating measurement.** This is the BND-04 requirement.

### 2. Analyzer-intermediate-source false-positive (HIGH risk)

The webpack-bundle-analyzer HTML at `.next/analyze/client.html` reports parsed sizes from the module graph BEFORE final minification and chunk splitting. These numbers do NOT match the emitted file sizes that browsers download. The ROADMAP explicitly forbids using this as a gating source. Only use the "Route (app)" stdout table from `pnpm build`.

### 3. optimizePackageImports incompatibility — import path assumptions (MEDIUM risk)

If a package's internal structure changes (e.g., `radix-ui` ^2.x changes its deep-import paths), the transform can generate import paths that don't exist. With the current installed version (`radix-ui ^1.4.3`), no incompatibility is expected. The transform fails loudly at build time (webpack error), so detection is immediate.

### 4. three.js as a confounder for "shared JS" interpretation (MEDIUM risk)

The two three.js chunks (515 KB parsed / 128 KB gz) appear in the build output but are NOT in the "Shared by all" line. A planner who reads "Route / = 279 KB First Load JS" and tries to close that number to 102 KB via `optimizePackageImports` is chasing the wrong metric. BND-01 target is the "Shared by all" floor (≤102 KB), not `/`'s total First Load JS. Three.js routes that share the WebGL chunks will have First Load JS >> 102 KB and this is by design. Do not conflate route-specific JS with shared-JS floor.

### 5. Lazy-package optimizations produce zero initial-load gain (LOW risk, high confusion)

`cmdk`, `vaul`, `sonner`, and `react-day-picker` are all behind `next/dynamic` wrappers. Adding them to `optimizePackageImports` is safe and may reduce their lazy chunk size, but they do NOT contribute to the "Shared by all" measurement. If Plan 02 shows 0 KB delta on "Shared by all" after adding these four, that is the expected result, not a failure.

### 6. `date-fns` is already default-optimized — skip or note as redundant (LOW risk)

Adding `"date-fns"` to `optimizePackageImports` is harmless but unnecessary. It appears in the ROADMAP's candidate list ("likely... date-fns") but Next.js 15 already includes it in the default optimization set. Document the skip decision in the plan.

### 7. `SFInputOTP` is in the barrel — optimization window (MEDIUM impact note)

Adding `"input-otp"` to `optimizePackageImports` will reduce the number of input-otp sub-exports bundled for pages that don't use OTP. However, if the actual savings are smaller than expected (input-otp is a focused package with few exports), the planner should note this as a "defensive inclusion" — the cost is zero and the gain is nonzero.

### 8. Chunk ID drift after Phase 61 changes (LOW risk)

ROADMAP cautions that Phase 60+ changes may re-split the webpack chunk graph. Adding packages to `optimizePackageImports` can cause webpack to create new split points. The chunk IDs `3302` and `7525` may not survive unchanged. This is expected behavior and does not indicate a regression. Use the "Shared by all" Route (app) line as the stable metric, not chunk IDs.

---

## References

1. Context7 / vercel/next.js canary — `optimizePackageImports` API reference and default-optimized library list. Retrieved 2026-04-26. Source: `https://github.com/vercel/next.js/blob/canary/docs/01-app/03-api-reference/05-config/01-next-config-js/optimizePackageImports.mdx`

2. Context7 / vercel/next.js canary — `package-bundling.mdx` guide on `optimizePackageImports`. Retrieved 2026-04-26. Source: `https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/package-bundling.mdx`

3. Context7 / vercel/next.js canary — `local-development.mdx` (Turbopack auto-optimization note). Retrieved 2026-04-26. Source: `https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/local-development.mdx`

4. DGN-02 per-chunk attribution — `.planning/codebase/v1.8-lcp-diagnosis.md` §2. Captured 2026-04-26 via Phase 57 Plan 03.

5. Codebase grep audit — `components/ui/*.tsx`, `components/sf/index.ts`, `components/sf/*.tsx`, `components/layout/*.tsx`, `app/**/*.tsx`. Conducted 2026-04-26. Zero `@radix-ui/*` scoped imports found; all Radix usage via `radix-ui` meta-package.

6. `package.json` — installed versions: radix-ui ^1.4.3, cmdk ^1.1.1, vaul ^1.1.2, sonner ^2.0.7, react-day-picker ^9.14.0, date-fns ^4.1.0, input-otp ^1.4.2. Verified 2026-04-26.

7. `next.config.ts` — current `optimizePackageImports: ["lucide-react"]` only (line 10). BND-02 is unstarted.

8. `tests/v1.8-phase59-pixel-diff.spec.ts` — pixel-diff harness template (pixelmatch + pngjs, MAX_DIFF_RATIO 0.5%, baseline dir `.planning/visual-baselines/v1.8-start/`). Template reusable for Phase 61 AES-04 gate.

9. STATE.md v1.8 Critical Constraints — "Stale-chunk guard: `rm -rf .next/cache .next` before any gating measurement (BND-04)."
