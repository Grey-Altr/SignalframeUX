# Research — Phase 67: Bundle Barrel-Optimization (D-04 Unlock)

**Phase:** 67-bundle-barrel-optimization-d-04-unlock
**Domain:** Homepage First Load JS reduction: 258.9 KB → ≤200 KB (CLAUDE.md target)
**Researched:** 2026-04-30
**Confidence:** HIGH

---

## Standard Architecture

The current codebase operates under a **D-04 chunk-id stability lock** established after Phase 61 (Bundle Hygiene). That phase exhausted the `optimizePackageImports` lever at 7 entries and closed with chunk IDs 4335/e9a6067a/74c6194b/7525 stable across v1.7→v1.8. The homepage gzip First Load JS settled at 258.9 KB post-Phase-63.1 Plans 01+02+03, ratified under `_path_k_decision` at a 260 KB threshold.

**The measurement methodology that matters:**

`tests/v1.8-phase63-1-bundle-budget.spec.ts` (line 59: `BUDGET_BYTES = 260 * 1024`) reads `.next/app-build-manifest.json` pages[`"/page"`], gzip-compresses each chunk in-memory via `gzipSync`, sums bytes. This is the canonical measurement surface for BND-06. Plan 02 mutates the threshold. The manifest key is `/page` (App Router) with fallback to `/` (Pages Router).

**Build-order constraint:** `.next/` currently contains a **Turbopack dev build** (244 chunks with `turbopack-` prefixes, `67ae5_next_dist_*` entries). All gating measurements require `rm -rf .next/cache .next && ANALYZE=true pnpm build` (production webpack). The current dev-build chunks are NOT the gating surface.

---

## Recommended Approach

Execute the three reshape vectors in D-01 order, but with one critical revision to Vector 2 based on the ScrollSmoother investigation below.

### Revised Vector Order and Expected Impact

**Vector 1 (highest confidence):** Add `@/components/sf` to `optimizePackageImports`.

**Vector 2 (revised):** Dynamic-import the GSAP gsap-split / gsap-plugins lazy module chain — NOT ScrollSmoother (which is not imported).

**Vector 3 (confirmed viable):** Move TooltipProvider to a subtree below its current root-layout position.

---

## Integration Points

### next.config.ts:9-30
Single mutation point for Vector 1. The `optimizePackageImports` array is at line 10. The D-04 rejection comment at lines 11-19 must be **rewritten** at Plan 01 close to reflect Phase 67 unlock state → new Phase 67 v1.9 lock.

### tests/v1.8-phase63-1-bundle-budget.spec.ts:59
`BUDGET_BYTES = 260 * 1024` — Plan 02 mutation point per D-06 outcome ladder.

### app/layout.tsx:191-209
`<TooltipProvider>` wraps the entire client-provider tree. The tree order is:
```
TooltipProvider [line 191]
  └─ LenisProvider [line 192]
       └─ FrameNavigation, PanelHeightAssertion, CheatsheetOverlay
       └─ SignalframeProvider
            └─ BorderlessProvider
                 └─ ScaleCanvas, Nav, NavRevealMount
```
Vector 3 mutation surface.

---

## Per-Vector Implementation Analysis

### Vector 1 — `@/components/sf` to `optimizePackageImports`

**Mechanism:** Adding `"@/components/sf"` to `optimizePackageImports` triggers Next.js 15's barrel-file transform. Webpack rewrites every named import from `@/components/sf` to a direct per-file import, enabling tree-shaking at the Radix sub-package level.

**Homepage import surface (static, in First Load JS):**

`app/page.tsx` line 4: `import { SFPanel, SFSection } from "@/components/sf"` — exactly 2 exports consumed from a 194-line barrel with 44+ exports. Every other barrel export that pulls in heavyweight Radix sub-packages (ScrollArea → react-scroll-area, Dialog → react-dialog, Tooltip → react-tooltip + react-remove-scroll, etc.) is currently bundled into the homepage First Load JS because webpack cannot tree-shake re-export barrels without optimizePackageImports.

**What optimizePackageImports enables for `app/page.tsx`:**
- `SFPanel` → `components/sf/sf-panel.tsx` (no Radix dep — layout primitive)
- `SFSection` → `components/sf/sf-section.tsx` (no Radix dep — layout primitive)
- All other barrel exports → eliminated from homepage First Load JS (pulled into lazy chunks only when actually consumed)

**Critical constraint — `component-detail.tsx` wildcard import:**

`components/blocks/component-detail.tsx` line 5: `import * as SF from "@/components/sf"` — this wildcard import prevents tree-shaking for that specific chunk. However, `component-detail.tsx` is lazy-loaded via `next/dynamic` with `ssr: false` from `inventory-section.tsx` (line 21), which itself is `dynamic()` from `app/page.tsx` (line 36-39). The `SF.*` wildcard import will keep the full barrel in the `component-detail` lazy chunk — this is correct and expected behavior. It does NOT land in homepage First Load JS.

**Predicted payoff:** Chunks 4335 (Radix ScrollArea 31.1 KB), 7525 (react-remove-scroll 26.0 KB + Radix popper), and the sf-navigation-menu/tooltip/scrollArea/dialog Radix surface currently dragged into the homepage via barrel should move out. Estimated 30-50 KB gzip reduction on homepage, but must be measured — actual splitChunks behavior cannot be predicted without a build (D-02 audit-first).

**Risk:** chunk ID reshuffle is CERTAIN and deliberate (D-04 unlock). CSS load order shifts are the top regression risk; AES-04 per-commit (D-08) is the guard.

### Vector 2 — GSAP Dynamic Import (CRITICAL CORRECTION to CONTEXT.md)

**Investigation finding: ScrollSmoother is NOT imported in the codebase.**

A codebase-wide search (`grep -rn "ScrollSmoother" . --include="*.ts" --include="*.tsx"`) against all non-`node_modules` source files returns ZERO hits except in comments inside `tests/v1.8-phase63-1-bundle-budget.spec.ts` (lines 42, 48) and stale worktree copies of that file. There is no `import ... from "gsap/ScrollSmoother"` anywhere in the application.

**The chunk 8964 misattribution:**

The `_path_k_decision` comment at `tests/v1.8-phase63-1-bundle-budget.spec.ts:43` states: `"8964 = GSAP ScrollSmoother + ScrollTrigger (24.9 KB gzip)"`. The authoritative source — `v1.8-lcp-diagnosis.md §2b line 82` — states: `"8964-02d5beb63a80f3f5.js | 62 KB / 62.0 KB / 24.9 KB | next 61.9 KB | Next.js runtime auxiliary"`. The gzip sizes match (24.9 KB) but the package content differs. **The lcp-diagnosis document's programmatic extraction from `chartData` is the authoritative source. Chunk 8964 is a Next.js runtime chunk, not GSAP.**

**What the GSAP import chain actually looks like:**

- `lib/gsap-core.ts` — static import: `gsap`, `ScrollTrigger`, `Observer`, `useGSAP` (registered at module load)
- `lib/gsap-split.ts` — static import: adds `SplitText`, `ScrambleTextPlugin`, `CustomEase`
- `lib/gsap-plugins.ts` — static import: full plugin set
- `lib/gsap-draw.ts` — static import: `DrawSVGPlugin`
- `lib/gsap-flip.ts` — static import: `Flip`, `CustomEase`

The gsap-core entry is consumed by `lenis-provider.tsx`, `page-animations.tsx`, `scale-canvas.tsx`, `nav.tsx` and many block/animation components — it is genuinely load-bearing for the LenisProvider and scroll machinery.

**Chunk 584bde89** (from §2b): `584bde89-478e5bcc7be5ae42.js` = 50 KB parsed / 19.3 KB gzip, top package `gsap 50.4 KB`. This is the real GSAP split point in the production webpack build. The lcp-diagnosis notes it as a `NEW_FINDING` — it was not in the v1.7 chunk set. This chunk is the target for vector 2.

**Revised Vector 2 mechanism:**

The `lib/gsap-plugins.ts` module (`SplitText`, `ScrambleTextPlugin`, `Flip`, `CustomEase`) and `lib/gsap-split.ts` are imported eagerly by:
- `components/blocks/thesis-section.tsx` line 4: `import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-split"`
- `components/animation/split-headline.tsx`: `import { gsap, SplitText, useGSAP } from "@/lib/gsap-split"`
- `components/animation/scramble-text.tsx`: `import { gsap, useGSAP } from "@/lib/gsap-split"`

But `thesis-section.tsx` is already a `next/dynamic` import from `app/page.tsx` (line 28-31, `ssr: true`). The gsap-split module rides that dynamic chunk — it should already be out of the synchronous First Load JS. The 19.3 KB gzip `584bde89` GSAP chunk appearing in the analysis needs to be verified: is it actually in the homepage First Load JS or only in the lazy thesis-section chunk?

**If the GSAP chunk is in First Load JS** (needs fresh build verification), the fix is: move any component that eagerly imports `lib/gsap-split` or `lib/gsap-plugins` to be a `next/dynamic` import, or refactor the lenis-provider's `lib/gsap-core` consumption to use a lazy init pattern. However, `lenis-provider.tsx` is in the static provider tree (inside `app/layout.tsx` and thus always in First Load JS), and it statically imports `gsap, ScrollTrigger` from `lib/gsap-core`. The `lib/gsap-core` module is load-bearing and CANNOT be dynamic-imported without breaking the Lenis + ScrollTrigger sync setup.

**Bottom line for Vector 2:** The D-02 audit-first build will identify whether the 19.3 KB GSAP chunk is actually in homepage First Load JS. If it is, the mechanism is: identify which eagerly-imported component pulls `gsap-split` or `gsap-plugins` into the First Load path, and ensure it's wrapped in `next/dynamic`. The `gsap-core` module (ScrollTrigger + Observer) stays eager — it's the PF-04 contract surface.

**PF-04 preservation:** `lenis-provider.tsx` uses `autoResize: true` (code-of-record per `feedback_pf04_autoresize_contract.md`, commit `73311e0`). ScrollTrigger is registered at `lib/gsap-core.ts:12`. Any dynamic-import strategy must NOT move `ScrollTrigger.update` (called at `lenis-provider.tsx:52`) into an async path — the Lenis sync must remain synchronous with the ticker.

### Vector 3 — TooltipProvider Re-tree

**Investigation finding: Tooltip has zero actual consumers in `app/` or `components/layout/`.**

`grep -rn "SFTooltip|Tooltip" --include="*.tsx" ./app/ ./components/` returns:
- `app/layout.tsx:16,191,209` — the TooltipProvider mount itself
- `components/ui/tooltip.tsx` — the Radix wrapper
- `components/sf/sf-tooltip.tsx` — the SF wrapper

No page, block, layout, or animation component in `./app/` or `./components/` imports or renders `<SFTooltip>`, `<Tooltip>`, or `<TooltipProvider>` except the root layout's provider mount. The only tooltip imports are: the tooltip UI component, the SF tooltip wrapper, and the root layout provider.

**Why TooltipProvider is at root layout:** Radix Tooltip requires a `TooltipProvider` ancestor. With it at root layout, any SF component added to any page can use `SFTooltip` without additional setup. This is a DX convenience, not a functional requirement for any currently-rendered tooltip.

**What TooltipProvider pulls in (chunk 7525):** `@radix-ui/react-tooltip` 7.7 KB, `react-remove-scroll` 10.6 KB, `@radix-ui/react-popper` 25.9 KB, `aria-hidden` 1.4 KB — total chunk 7525 = 75.1 KB parsed / 26.2 KB gzip. This entire chunk lands in homepage First Load JS solely because `TooltipProvider` is in the root layout.

**Re-tree options:**

A. **Per-page mounting:** Remove `TooltipProvider` from `app/layout.tsx`. Add it to the pages that actually use `<SFTooltip>` (currently none, so the answer is: add nowhere until a consumer exists). Risk: breaks any future tooltip usage until TooltipProvider is explicitly added.

B. **Move below the LenisProvider in the tree:** `TooltipProvider` currently wraps `LenisProvider`. Moving it deeper (e.g., to wrap only the `BorderlessProvider` subtree or to wrap only the section body within `ScaleCanvas`) keeps a root-level TooltipProvider but changes the React tree position. This does NOT eliminate the chunk from First Load JS unless the provider itself is lazy-mounted.

C. **Lazy-mount TooltipProvider:** Wrap `<TooltipProvider>` in a client component that renders it only after hydration. This is a thin wrapper approach. The Radix TooltipProvider has no SSR-critical behavior; it provides context only. A lazy wrapper that renders null on server and mounts the provider after hydration would defer chunk 7525 out of the critical path.

Option C is the recommended mechanism: create `components/providers/tooltip-provider-lazy.tsx` with `'use client'` + `useState` initialized to `false`, `useEffect` to set `true` — renders `<TooltipProvider>{children}</TooltipProvider>` after mount, passes `{children}` directly during SSR. Since no page currently renders a tooltip, SSR pass-through is correct. The 26 KB gzip chunk 7525 moves out of First Load JS.

**React tree + portal interaction:** `TooltipProvider` manages tooltip open state and delay timing via React context. `SFTooltipContent` renders into a `TooltipPrimitive.Portal`. Portal rendering requires the TooltipProvider context to exist. The lazy-mount approach means portals will be null until hydration — acceptable since tooltips are interaction-triggered (hover/focus) and cannot fire before hydration anyway.

**CheatsheetOverlay interaction:** `components/layout/cheatsheet-overlay.tsx` imports from `@/components/sf/sf-dialog` (direct, not barrel). `SFDialog` uses `@radix-ui/react-dialog`, which is separate from Tooltip. No conflict.

---

## Chunk Fingerprint Freshness

**Current `.next/` state:** Turbopack dev build (244 chunks). The production webpack chunk IDs from the `_path_k_decision` analysis (4335, 7525, 8964, etc.) are webpack chunk IDs from `pnpm build` — they are NOT present in the current dev build.

**Last known production build state:** Phase 61 final build (2026-04-26) at `61-03-FINAL-GATE.md`:
- Homepage First Load JS: 264 KB (pre-path_k ratification)
- Post-PR-#4 merge (ratification): 258.9 KB at `_path_k_decision`

**Phase 66 impact on bundle:** Phase 66 shipped architectural changes to `scale-canvas.tsx` and `app/layout.tsx` (pillarbox + GhostLabel pseudo-element mechanism). The 66-03-SUMMARY confirms local LHCI a11y pass but no bundle measurement is documented for Phase 66 — the bundle was not the Phase 66 concern. The layout.tsx changes (scaleScript and canvasSyncScript extensions at lines 119-140) are small inline IIFE additions (~200 bytes), negligible bundle impact.

**Freshness verdict:** The chunk fingerprint claims from `_path_k_decision` are from the PR-#4 merge state. No production webpack build has been run since Phase 66 shipped. **Plan 01 Task 0 MUST run a fresh `rm -rf .next/cache .next && ANALYZE=true pnpm build` to capture current baseline** before any reshape vectors are applied. This is the D-10 standing rule and also the only way to get accurate pre-reshape measurements for the D-02 audit-first gate.

**Chunk 8964 misattribution alert:** The `_path_k_decision` comment labels chunk 8964 as "GSAP ScrollSmoother + ScrollTrigger (24.9 KB)". The authoritative `v1.8-lcp-diagnosis.md §2b` labels chunk 8964 as `next 61.9 KB` (Next.js runtime auxiliary, 24.9 KB gzip). The misattribution originated when the _path_k comment was written — it incorrectly associated the gzip size (24.9 KB) with GSAP rather than the Next runtime. The planner must NOT plan a "ScrollSmoother dynamic-import" vector. ScrollSmoother is not imported in the codebase (`grep -rn "ScrollSmoother" . --include="*.ts" --include="*.tsx"` returns zero source hits).

---

## DCE Audit — SF Barrel Exports vs Homepage Consumers

**Methodology:** grep-driven consumption analysis against `./app/`, `./components/layout/`, and `./components/blocks/` (excluding registry string-literals, which are code template strings not runtime imports, and excluding `./components/sf/` internal imports).

### Homepage First Load JS Static Import Chain

```
app/page.tsx
├── import { SFPanel, SFSection } from "@/components/sf"  [STATIC — 2 exports only]
├── import { CDSymbol } from "@/components/sf/cd-symbol"  [DIRECT — bypasses barrel]
├── import { EntrySection } from "@/components/blocks/entry-section"  [STATIC]
└── next/dynamic: ThesisSection, SignalSection, ProofSection,
                  InventorySection, AcquisitionSection  [LAZY]
```

`app/layout.tsx`: imports `SFToasterLazy` from direct path (not barrel). No other SF barrel imports.

**SF barrel exports that NEVER land in homepage First Load JS (regardless of barrel reshape):**

All 44+ non-`SFPanel`/`SFSection` exports in `components/sf/index.ts` are unused on the homepage's static import graph. Currently they ARE in First Load JS because webpack cannot tree-shake the barrel. With `optimizePackageImports: ["@/components/sf"]`, webpack rewrites named imports to direct file imports, enabling DCE of all unused exports from the homepage chunk.

### Per-Export DCE Status

| Export(s) | Route consumers (non-lazy) | DCE opportunity |
|-----------|---------------------------|-----------------|
| `SFPanel`, `SFSection` | `app/page.tsx:4` (homepage) | Keep in homepage bundle |
| `SFContainer`, `SFStack`, `SFGrid`, `SFText` | `app/error.tsx`, `app/not-found.tsx` (static in error routes, not in `/` First Load JS) | DCE from `/` First Load JS |
| `SFButton` | `app/error.tsx`, `app/not-found.tsx` | DCE from `/` |
| `SFTabs*` | `components/blocks/preview-tabs.tsx`, `components/blocks/token-tabs.tsx` (lazy chunks) | DCE from `/` |
| `SFTable*` | `components/blocks/component-grid.tsx` (lazy), `components/blocks/token-tabs.tsx` (lazy) | DCE from `/` |
| `SFBadge`, `SFInput` | `components/blocks/components-explorer.tsx` (lazy) | DCE from `/` |
| `SFSeparator`, `CDSymbol` | `components/layout/footer.tsx` (rendered on all pages but Footer is a direct import, not lazy — needs verification) | May stay in `/` via Footer |
| `SFScrollArea`, `SFScrollBar` | **ZERO consumers** in `./app/` or `./components/` (only `sf-scroll-area.tsx` definition + `index.ts` re-export) | DCE candidate — can be REMOVED from barrel |
| `SFNavigationMenu*` | **ZERO consumers** in layout or app (nav.tsx does not import from barrel; uses direct ColorCycleFrame etc.) | DCE candidate — can be REMOVED from barrel |
| `SFTooltip*` | **ZERO consumers** in `./app/` or `./components/layout/` or `./components/blocks/` (only sf-tooltip.tsx definition + registry code strings) | DCE candidate — consider removing from barrel |
| `SFAvatar*`, `SFBreadcrumb*`, `SFPagination*` | Registry code-strings only (not runtime imports) | DCE from `/` via optimizePackageImports |
| `SFDialog*` | `components/layout/cheatsheet-overlay.tsx` imports **direct** from `@/components/sf/sf-dialog` | DCE from `/` barrel |
| `SFSheet*` | Only consumed by `sf-navigation-menu.tsx` internally | DCE from `/` barrel |
| `SFAccordion*`, `SFCollapsible*`, `SFAlert*`, `SFAlertDialog*`, `SFEmptyState`, `SFProgress`, `SFStepper*` | `component-detail.tsx` (lazy, ssr:false) via `import * as SF` | DCE from `/` — stays in lazy chunk |
| `SFSlider` | `components/animation/signal-overlay.tsx` imports **direct** from `@/components/sf/sf-slider` | DCE from `/` barrel |
| `SFInputOTP*`, `SFInputGroup*`, `SFHoverCard*`, `SFStatusDot`, `SFToggleGroup*` | `component-detail.tsx` (lazy) only | DCE from `/` |
| `SFSelect*`, `SFCheckbox`, `SFRadioGroup*`, `SFSwitch`, `SFTextarea`, `SFLabel`, `SFToggle`, `SFDropdownMenu*`, `SFPopover*` | `component-detail.tsx` (lazy) only | DCE from `/` |

**Summary:** With `optimizePackageImports: ["@/components/sf"]`, the homepage First Load JS should keep only:
- `sf-panel.tsx` (layout primitive, no heavy Radix dep)
- `sf-section.tsx` (layout primitive, no heavy Radix dep)
- Whatever is transitively required by `Footer` via `SFSeparator` / `CDSymbol` (needs measurement)

**DCE via barrel removal (permanent):** `SFScrollArea` and `SFNavigationMenu*` have ZERO consumers in any runtime-executed file. These can be removed from `components/sf/index.ts` without breaking any page. This is a low-risk size reduction that does not depend on the optimizePackageImports mechanism.

---

## Threat Model Content

Phase 67 is a pure build-time / import-graph reshape. No security-relevant code paths are touched.

- No authentication, authorization, session, or data-handling code is modified
- No network requests are added or modified
- No environment variables are touched
- No npm runtime dependencies are added (D-03 standing rule)
- Mutations are limited to: `next.config.ts` (build config), `components/sf/index.ts` (barrel re-exports), `app/layout.tsx` (provider tree), and one test file

**OWASP-ASVS L1 assessment:** Out of scope. No security-relevant code paths are affected by barrel reshape, `optimizePackageImports` extension, or provider tree restructure.

---

## Validation Architecture

_Required for Nyquist Dimension 8 — drives VALIDATION.md generation._

### Test-to-Requirement Mapping

| Requirement | Validation Mechanism | Spec File | Threshold |
|-------------|---------------------|-----------|-----------|
| BND-05: D-04 lock deliberately broken + re-locked | Documentation gate: `v1.9-bundle-reshape.md` authored; `next.config.ts` D-04 comment rewritten | Manual (doc) | New chunk IDs documented in §2a-format table |
| BND-06: Homepage First Load JS ≤200 KB | `tests/v1.8-phase63-1-bundle-budget.spec.ts` line 59 threshold mutated | Existing spec — mutate `BUDGET_BYTES` | ≤200 KB (D-06: retire); 201-220 KB (replace with _path_q_decision); >220 KB (escalate) |
| BND-07: New chunk-ID baseline locked; LHCI re-tightened | (a) `v1.9-bundle-reshape.md` §chunk-table authored; (b) `.lighthouseci/lighthouserc.json` threshold update (if any) | Doc gate + LHCI config | New stable IDs in doc; LHCI bundle threshold update per D-06 |
| AES-04: Per-phase pixel-diff ≤0.5% | Playwright pixel-diff vs `.planning/visual-baselines/v1.8-start/` | Existing AES-04 harness (Phase 61 precedent: `tests/v1.8-phase61-bundle-hygiene.spec.ts` pattern) | MAX_DIFF_RATIO = 0.005 (0.5%) |

### Test Surfaces

**Test surface A — Bundle budget spec (BND-06):**

File: `tests/v1.8-phase63-1-bundle-budget.spec.ts` (Plan 02 mutation target)
- Mutate `BUDGET_BYTES` per D-06 outcome ladder
- The `_path_k_decision` header block is either retired (≤200 KB) or replaced with `_path_q_decision` (201-220 KB)
- Methodology (read `.next/app-build-manifest.json` → gzip in-memory → sum) stays unchanged
- Confirm `.next/app-build-manifest.json` key: App Router uses `"/page"` for homepage; fallback to `"/"` (confirmed in spec lines 78-79 and Next.js 15 App Router behavior)

**Test surface B — Chunk-ID stability (BND-07, documentation gate):**

Per D-05: NO new automated chunk-ID equality assertion test. The `v1.9-bundle-reshape.md` document is the lock. The planner must NOT write a spec that asserts specific chunk filenames.

**Test surface C — AES-04 pixel-diff (D-08, D-09):**

Routes covered per D-09: `/`, `/init`, `/inventory`, `/system` × mobile + tablet + desktop viewports.
Baseline: `.planning/visual-baselines/v1.8-start/` (Phase 57 captures).
Sanity check baseline: `.planning/visual-baselines/v1.9-pre/` (v1.9 entry, already captured).
Threshold: MAX_DIFF_RATIO = 0.005 (AES-04 standing rule; Phase 61 §6 closure ratified 0.005 over strict 0%).
Cadence: per-major-reshape-commit (D-08) + final phase-end gate.
Implementation: reuse Phase 61 pixel-diff harness pattern (`tests/v1.8-phase61-bundle-hygiene.spec.ts` as template).

**No parallel test surface** (no LHCI bundle-specific assertion): LHCI in `.lighthouseci/lighthouserc.json` does not have an explicit `resource-summary` or `uses-optimized-images` threshold gating bundle size. The LHCI performance gates (TBT 700ms, perf 0.85) are the proxy. No LHCI mutation is required for bundle size specifically — the bundle-budget spec handles BND-06 directly.

### Build Measurement Protocol (BND-04 standing rule)

Every gating measurement in Plan 01 and Plan 02 must be prefixed with:
```bash
rm -rf .next/cache .next && ANALYZE=true pnpm build
```
Stale-chunk guard non-negotiable per Phase 61 lessons (`61-03-FINAL-GATE.md` §2).

### LHCI Threshold Analysis

Current `.lighthouseci/lighthouserc.json` bundle-adjacent thresholds:
- `categories:performance minScore: 0.85` (preview-mobile; `_path_e_decision`)
- `total-blocking-time maxNumericValue: 700` (`_path_e_decision`)
- `largest-contentful-paint maxNumericValue: 1500` (`_path_f_decision`)
- CLS `maxNumericValue: 0.005` (`_path_a_decision`)
- Accessibility `minScore: 0.97`

No LHCI threshold directly measures First Load JS gzip size. Plan 02 does NOT need to modify LHCI thresholds for BND-06 compliance — the bundle-budget spec is the gate. However, if the bundle reshape significantly reduces TBT (by removing heavy eager chunks), the `_path_e_decision` 700ms TBT threshold could be tightened as a bonus. This is discretionary.

---

## Anti-Patterns

**1. Treating chunk 8964 as GSAP ScrollSmoother.**
Chunk 8964 = Next.js runtime auxiliary (verified against `v1.8-lcp-diagnosis.md §2b`). The `_path_k_decision` comment's attribution is incorrect. Do NOT plan a "ScrollSmoother dynamic-import" vector. ScrollSmoother is not imported anywhere in the codebase.

**2. Expecting optimizePackageImports to tree-shake the `import * as SF` wildcard in `component-detail.tsx`.**
Wildcard namespace imports (`import * as SF`) defeat tree-shaking by design — they import the full namespace. This is acceptable because `component-detail.tsx` is a lazy chunk (loaded only on user interaction). The wildcard must remain for the dynamic `SF[componentName]` lookup pattern at `component-detail.tsx:29-31`.

**3. Attempting a single-vector commit that reshuffles all chunk IDs without per-vector AES-04 checks.**
Phase 61's stale-chunk burn and the AES-04 calibration discussion in §6 both demonstrate that build artifacts can carry hidden rendering state. D-08 mandates per-major-reshape-commit AES-04.

**4. Treating `.next/` dev build chunks as gating surface.**
The current `.next/` contains Turbopack dev build output (244 chunks with `turbopack-` prefixes). All gating must use fresh `pnpm build` (webpack production) per BND-04.

**5. Removing the TooltipProvider without verifying portal interactions.**
`SFTooltipContent` renders into `TooltipPrimitive.Portal`. The portal requires the provider context. A lazy-mount approach (rendering `{children}` directly until hydration completes) is safe because tooltips cannot fire before hydration. BUT: the lazy-mount component must remain in the provider tree (not removed entirely) so that any future tooltip consumer works without per-page setup.

**6. Committing Vector 1 + Vector 2 + Vector 3 as a single atomic commit.**
D-02 requires a 2 KB gzip reduction floor per vector. If any vector underperforms, it should be dropped without reverting the others. Per-vector commits allow this. The plan boundary cut-line (see below) should reflect this.

---

## Plan Boundary Recommendation

### Plan 01 — Reshape (3 phases within plan)

**Task 0 — Pre-reshape baseline capture (mandatory):**
`rm -rf .next/cache .next && ANALYZE=true pnpm build 2>&1 | tee /tmp/67-build-pre.log`
Capture Route (app) table + programmatic `chartData` extraction. Record actual chunk fingerprints for the v1.9-pre state (post-Phase-66). This establishes the D-02 audit baseline and feeds `v1.9-bundle-reshape.md` pre-reshape column.

**Task 1 — Vector 1 commit (optimizePackageImports + DCE from barrel):**
- Add `"@/components/sf"` to `optimizePackageImports` in `next.config.ts`
- Remove zero-consumer exports from `components/sf/index.ts`: `SFScrollArea`, `SFScrollBar`, `SFNavigationMenu*` (all 8 sub-components)
- Build + measure: `rm -rf .next/cache .next && pnpm build 2>&1 | tee /tmp/67-build-v1.log`
- Apply AES-04: routes `/`, `/init`, `/inventory`, `/system` × 3 viewports
- If homepage delta < 2 KB gzip: document and revert (D-02 floor not met)

**Task 2 — Vector 2 commit (GSAP lazy path — AFTER fresh build confirms target):**
- Identify from Task 0 build whether any `gsap-split` / `gsap-plugins` module is in the homepage First Load JS (look for the `584bde89-*` chunk or its successor in the `/page` manifest entries)
- If YES: determine which eagerly-imported component pulls it in and wrap it in `next/dynamic`
- If NO (already lazy): skip vector 2, document 0 KB delta, move to vector 3
- Build + measure + AES-04 per D-08

**Task 3 — Vector 3 commit (TooltipProvider lazy-mount):**
- Create `components/providers/tooltip-provider-lazy.tsx` with hydration-gated provider mount
- Replace `<TooltipProvider>` in `app/layout.tsx:191` with `<TooltipProviderLazy>`
- Build + measure + AES-04 per D-08
- If < 2 KB gzip delta: skip (but document — the mechanism is correct even if the LHCI version doesn't show it)

**Task 4 — Author `v1.9-bundle-reshape.md`:**
- Format: matches `v1.8-lcp-diagnosis.md §2a` column layout
- Columns: chunk ID | status | top packages (gzip) | total size | pre/post delta
- Pre-reshape column: Task 0 measurements
- Post-reshape column: final Task 3 measurements
- Method note: `rm -rf .next/cache .next && ANALYZE=true pnpm build`
- Rewrite `next.config.ts` lines 11-19 D-04 lock comment to reflect Phase 67 unlock → v1.9 new lock state

### Plan 02 — Re-lock + Gate

**Task 0:** `rm -rf .next/cache .next && pnpm build` (fresh gating build, D-10)

**Task 1:** Apply D-06 outcome ladder to `tests/v1.8-phase63-1-bundle-budget.spec.ts:59`:
- ≤200 KB: `BUDGET_BYTES = 200 * 1024`; retire `_path_k_decision` header; restore CLAUDE.md hard constraint
- 201-220 KB: `BUDGET_BYTES = (measured + 1 * 1024)`; replace `_path_k_decision` with `_path_q_decision` block
- >220 KB: STOP, escalate (document in SUMMARY)

**Task 2:** Final AES-04 gate — all 12 route×viewport combinations vs `.planning/visual-baselines/v1.8-start/`. MAX_DIFF_RATIO = 0.005.

**Task 3:** Commit new chunk-ID baseline documentation update + spec threshold + LHCI review (discretionary tighten if TBT improved).

### Atomic Commit Boundary

**Per-vector commits are required** (not a single atomic reshape commit). This allows D-02 floor checking per vector and safe revert if any vector underperforms. The plan boundary between Plan 01 and Plan 02 is clean: Plan 01 ends after `v1.9-bundle-reshape.md` is authored and committed; Plan 02 opens with a fresh gating build.

---

## Sources

| File | Purpose | Confidence |
|------|---------|-----------|
| `.planning/phases/67-bundle-barrel-optimization-d-04-unlock/67-CONTEXT.md` | Locked decisions (D-01 through D-11) | HIGH — source of truth |
| `.planning/REQUIREMENTS.md:27-29, 79-81` | BND-05/06/07 acceptance criteria | HIGH |
| `.planning/ROADMAP.md:1040-1101` | Phase 67 spec + v1.9 build-order constraints | HIGH |
| `next.config.ts:9-30` | `optimizePackageImports` current state + D-04 rejection comment | HIGH |
| `app/layout.tsx:191-209` | TooltipProvider tree position | HIGH |
| `components/sf/index.ts:1-194` | Full barrel re-export surface | HIGH |
| `tests/v1.8-phase63-1-bundle-budget.spec.ts:1-129` | `_path_k_decision` + measurement methodology | HIGH |
| `.planning/codebase/v1.8-lcp-diagnosis.md §2b` | Authoritative chunk fingerprint data (chunk 8964 = Next runtime, NOT GSAP ScrollSmoother) | HIGH |
| `app/page.tsx:1-156` | Homepage import graph — only SFPanel + SFSection from barrel | HIGH |
| `components/blocks/component-detail.tsx:5` | `import * as SF from "@/components/sf"` wildcard — lazy chunk only | HIGH |
| `lib/gsap-core.ts`, `lib/gsap-split.ts`, `lib/gsap-plugins.ts` | GSAP import chain — no ScrollSmoother | HIGH |
| `components/layout/lenis-provider.tsx` | PF-04 contract — autoResize:true + ScrollTrigger sync | HIGH |
| `.planning/phases/61-bundle-hygiene/61-03-FINAL-GATE.md` | Phase 61 gate format precedent; stale-chunk discipline lessons; FALSE-PASS GUARD | HIGH |
| `.planning/codebase/AESTHETIC-OF-RECORD.md:68` | AES-04 ≤0.5% standing rule | HIGH |
| `.lighthouseci/lighthouserc.json` | Current LHCI thresholds (no bundle-size-specific gate present) | HIGH |
| Grep: `grep -rn "ScrollSmoother"` | Confirmed: zero source hits outside comments | HIGH — empirical |
| Grep: `grep -rn "SFTooltip|TooltipProvider"` in `./app/ ./components/` | Confirmed: zero tooltip consumers outside layout.tsx and sf-tooltip.tsx | HIGH — empirical |
| Grep: `grep -rn "SFScrollArea|SFNavigationMenu"` in `./app/ ./components/layout/` | Confirmed: zero runtime consumers of these barrel exports | HIGH — empirical |

---

## RESEARCH COMPLETE

**Key finding:** The `_path_k_decision` comment's attribution of chunk 8964 to "GSAP ScrollSmoother" is incorrect — that chunk is a Next.js runtime auxiliary per `v1.8-lcp-diagnosis.md §2b`. ScrollSmoother is not imported anywhere in the codebase. Vector 2 must be reframed: investigate whether the `584bde89-*` GSAP chunk (19.3 KB gzip, `gsap` 50.4 KB parsed) is actually in homepage First Load JS, and if so, which eager import pulls gsap-split/gsap-plugins into the static path.

**Approach:** Three per-vector atomic commits within Plan 01, each with a D-02 2 KB floor gate and AES-04 check. Vector 1 (optimizePackageImports + DCE of SFScrollArea/SFNavigationMenu from barrel) is highest-confidence. Vector 3 (TooltipProvider lazy-mount) is mechanically clean and confirmed — TooltipProvider has zero actual consumers today. Vector 2 requires the pre-reshape build to determine if GSAP is actually in the First Load JS path. Plan 02 applies D-06 outcome ladder to retire or replace `_path_k_decision`.

**Written to:** `.planning/phases/67-bundle-barrel-optimization-d-04-unlock/67-RESEARCH.md`
