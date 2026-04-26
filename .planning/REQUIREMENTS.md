# Requirements — v1.8 Speed of Light

**Goal:** Recover the original CLAUDE.md performance contract (Lighthouse 100/100, LCP <1.0s, CLS=0, TTI <1.5s, <200KB initial) on prod, without sacrificing the locked aesthetic.

**Constraint:** Aesthetic preservation is a hard constraint. Restructuring is permitted; visual change is not (one documented exception: Anton `optional` → `swap` font-display migration in CRT-03).

---

## Diagnosis (DGN)

- [ ] **DGN-01**: LCP element identity confirmed per-viewport (mobile + desktop) via Lighthouse trace + `PerformanceObserver({type: 'largest-contentful-paint'})`. Output committed to `.planning/codebase/v1.8-lcp-diagnosis.md`. Resolves Tension 3 from research.
- [ ] **DGN-02**: Per-chunk owner attribution complete for unused-JS chunks `3302`, `e9a6067a`, `74c6194b`, `7525` via `ANALYZE=true pnpm build`. Output committed to `.planning/codebase/v1.8-lcp-diagnosis.md`.
- [x] **DGN-03**: Visual-of-record snapshot captured at v1.8 start — full-page screenshots at desktop 1440×900 / iPhone-13 / iPad / mobile-360 of homepage + `/system` + `/init` + `/inventory` + `/reference`, stored as `.planning/visual-baselines/v1.8-start/`.

## CI Bench (CIB)

- [ ] **CIB-01**: `@lhci/cli@^0.15.1` installed as devDep.
- [ ] **CIB-02**: `.lighthouseci/lighthouserc.json` written with cold-start variance discipline — `numberOfRuns: 5`, warmup×2, median assertion, threshold ≥97 categories:performance, LCP ≤1000ms, CLS ≤0, TBT ≤200ms.
- [ ] **CIB-03**: `.github/workflows/lighthouse.yml` runs LHCI on PR against Vercel preview URLs via `treosh/lighthouse-ci-action@v12`. Failure blocks merge.
- [ ] **CIB-04**: `scripts/launch-gate.ts` retained for manual post-deploy production verification at strict 100/100 (gate is preview ≥97, prod 100/100).
- [ ] **CIB-05**: `app/_components/web-vitals.tsx` using built-in `next/web-vitals` `useReportWebVitals` reports LCP/CLS/INP/TTFB to telemetry endpoint. No third-party SaaS.

## Critical-Path Restructure (CRT)

- [ ] **CRT-01**: `/sf-canvas-sync.js` inlined as `<body>` tail IIFE in `app/layout.tsx`; `public/sf-canvas-sync.js` deleted; CLS=0 verified by Playwright test.
- [ ] **CRT-02**: Anton font character-subsetted via build-time `glyphhanger` (ALL-CAPS English glyphs used in app). No runtime dependency added.
- [ ] **CRT-03**: Anton `font-display` migrated `optional` → `swap` with tuned `size-adjust` + `ascent-override` + `descent-override` + `line-gap-override` against `Impact, Helvetica Neue Condensed, Arial Black` fallback chain. Slow-3G hard-reload screen recording is the verification gate. Documented Chromatic re-baseline exception per `feedback_ratify_reality_bias.md`.
- [ ] **CRT-04**: Lenis init wrapped in `requestIdleCallback(initLenis, { timeout: 100 })` inside existing `useEffect` at `components/animation/lenis-provider.tsx`. PF-04 `autoResize: true` contract preserved.
- [ ] **CRT-05**: CRT-01, CRT-02/03, CRT-04 each shipped as a separate PR for clean bisect.

## LCP Repositioning (LCP)

- [ ] **LCP-01**: LCP <1.0s on prod homepage mobile, verified via LHCI median of 5 runs.
- [ ] **LCP-02**: LCP candidate intervention shipped per DGN-01 diagnosis output. One of: (a) THESIS Anton manifesto reveal mechanism `opacity` → `clip-path`; (b) ghost-label `content-visibility: auto` + `contain-intrinsic-size` (on element only, NOT section wrapper); (c) hero h1 clip-path char-reveal in `page-animations.tsx`. Phase-60 plan finalizes which after DGN-01.
- [ ] **LCP-03**: Visual baseline diff <0.5% per page after LCP intervention; cohort review escalates if "feels different" without specific code change as cause.

## Bundle Hygiene (BND)

- [ ] **BND-01**: Initial shared JS ≤102 KB (current baseline) on prod; 119 KiB unused JS reduced by ≥80%.
- [ ] **BND-02**: `next.config.ts` `optimizePackageImports` expanded to cover all attributed offending packages from DGN-02 — likely `radix-ui`, `cmdk`, `vaul`, `sonner`, `react-day-picker`, `date-fns`, `input-otp`. `ANALYZE=true pnpm build` re-run after each addition.
- [ ] **BND-03**: `components/sf/index.ts` barrel directive-free (existing v1.3 rule maintained — `'use client'` in barrel inflates bundle silently).
- [ ] **BND-04**: Stale-chunk guard documented in plan-phase RESEARCH.md (`rm -rf .next/cache .next` before any gating measurement).

## Verification (VRF)

- [ ] **VRF-01**: WebPageTest free tier (or BrowserStack supplement) JSON for ≥3 device profiles (iPhone 13/14 Safari, Galaxy A14 Chrome, mid-tier Android) committed to `.planning/perf-baselines/v1.8/`.
- [ ] **VRF-02**: `pnpm tsx scripts/launch-gate.ts` run 5× against prod URL — median 100/100, LCP <1.0s, CLS=0, TTI <1.5s.
- [ ] **VRF-03**: `chrome-devtools` MCP scroll-test confirms motion contract intact (single GSAP ticker, all SIGNAL effects render, reduced-motion still kills timeline).
- [ ] **VRF-04**: Mid-milestone real-device checkpoint after Phase 60 (not deferred to end). Catches mobile-emulation-pass / real-device-fail divergence early (Pitfall #10).
- [ ] **VRF-05**: Field RUM 75th-percentile LCP <1.0s post-deploy (~24h sampling window via CIB-05 telemetry endpoint).

## Aesthetic Preservation (AES)

- [x] **AES-01**: `.planning/codebase/AESTHETIC-OF-RECORD.md` created at v1.8 start, extracted from shipped code (lock-in mode per `feedback_lockin_before_execute.md`). Every phase reads from it; no re-derivation per-phase.
- [x] **AES-02**: No Chromatic re-baseline for perf changes. Only documented exception: Anton `optional` → `swap` migration in CRT-03.
- [x] **AES-03**: Mid-milestone cohort review by external eye after Phase 60 against `.planning/visual-baselines/v1.8-start/`. "Feels different" without specific code-change cause escalates.
- [x] **AES-04**: Pixel-diff vs v1.8-start snapshot at every phase end; >0.5% diff flagged for human review.

---

## Future Requirements (v1.8.1 / v1.9)

- Critical CSS extraction via manual hand-pick (only if v1.8 MVP doesn't close gap; `experimental.inlineCss` rejected — breaks `@layer signalframeux`).
- Speculation rules / route prefetch hints (INP-only optimization; not LCP).
- Anton fallback override via Fontaine (alternative to hand-tuned descriptors if calibration proves brittle).
- Server Components audit on `components/blocks/` (<3KB win; defer until v1.8 measurements show it matters).
- Next.js 16 retry, PPR, Cache Components (rolled back in Phase 37; revisit after v1.8 stabilizes).
- Track B (a11y target-size) — ScaleCanvas pillarbox/counter-scale/portal architectural decision. Parked for v1.9.

## Out of Scope

- **Visual or aesthetic changes** — restructuring constrained to rendering/loading order. Ghost-label, hero shader, ScaleCanvas behavior visually identical (one documented exception: Anton font-display via tuned descriptors, where the *intent* is invisibility).
- **SEO recovery** — Phase 37 confirmed prod SEO 100; dev-artifact only.
- **Track B / a11y target-size** — parked; needs ScaleCanvas architectural decision.
- **Stack swaps** — Next.js 15.5.14 / Tailwind v4 / GSAP / Lenis / Three.js all locked at v1.7 versions.
- **`@vercel/speed-insights` / `@vercel/analytics`** — third-party runtime weight contradicts LCP <1.0s goal.
- **`partytown` / `next/script strategy="worker"`** — App Router unsupported.
- **`react-three-fiber`** — independent rAF conflicts with `globalTimeline.timeScale(0)`.
- **`experimental.inlineCss: true`** — breaks `@layer signalframeux` (vercel/next.js#47585).
- **Component additions** — v1.8 is performance-only; no new SF components.
- **New runtime dependencies** — devDep additions limited to `@lhci/cli` + optional `web-vitals` (attribution only).

## Traceability

100% coverage: 29 / 29 v1.8 requirements mapped to exactly one phase. No orphans, no duplicates. (Original instruction count of 26 was an undercount; recount of [ ] checkboxes in §Diagnosis through §Aesthetic Preservation yields 29: DGN×3, CIB×5, CRT×5, LCP×3, BND×4, VRF×5, AES×4.)

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| DGN-01 | 57 | TBD | Pending |
| DGN-02 | 57 | TBD | Pending |
| DGN-03 | 57 | TBD | Pending |
| AES-01 | 57 | TBD | Pending |
| AES-02 | 57 (standing rule, applies to all phases via AESTHETIC-OF-RECORD.md) | TBD | Pending |
| AES-03 | 57 (standing rule, applies to all phases via AESTHETIC-OF-RECORD.md) | TBD | Pending |
| AES-04 | 57 (standing rule, applies to all phases via AESTHETIC-OF-RECORD.md) | TBD | Pending |
| CIB-01 | 58 | TBD | Pending |
| CIB-02 | 58 | TBD | Pending |
| CIB-03 | 58 | TBD | Pending |
| CIB-04 | 58 | TBD | Pending |
| CIB-05 | 58 | TBD | Pending |
| CRT-01 | 59 | TBD | Pending |
| CRT-02 | 59 | TBD | Pending |
| CRT-03 | 59 | TBD | Pending |
| CRT-04 | 59 | TBD | Pending |
| CRT-05 | 59 | TBD | Pending |
| LCP-01 | 60 | TBD | Pending |
| LCP-02 | 60 | TBD | Pending |
| LCP-03 | 60 | TBD | Pending |
| BND-01 | 61 | TBD | Pending |
| BND-02 | 61 | TBD | Pending |
| BND-03 | 61 | TBD | Pending |
| BND-04 | 61 | TBD | Pending |
| VRF-01 | 62 | TBD | Pending |
| VRF-02 | 62 | TBD | Pending |
| VRF-03 | 62 | TBD | Pending |
| VRF-04 | 62 | TBD | Pending |
| VRF-05 | 62 | TBD | Pending |

**Cross-cutting note (AES-02, AES-03, AES-04):** These three are standing rules documented inside Phase 57's AES-01 deliverable (`.planning/codebase/AESTHETIC-OF-RECORD.md`). They are mapped to Phase 57 for ownership/traceability, but apply to *every* phase 58-62 as enforcement gates (no Chromatic re-baseline for perf changes; mid-milestone cohort review; per-phase pixel-diff <=0.5%). Phases 58-62 reference them; only Phase 57 produces them.

**Coverage summary by category:**

| Category | Count | Phase |
|----------|-------|-------|
| DGN (Diagnosis) | 3 | 57 |
| AES (Aesthetic Preservation) | 4 | 57 (1 deliverable + 3 standing rules) |
| CIB (CI Bench) | 5 | 58 |
| CRT (Critical-Path Restructure) | 5 | 59 |
| LCP (LCP Repositioning) | 3 | 60 |
| BND (Bundle Hygiene) | 4 | 61 |
| VRF (Verification) | 5 | 62 |
| **Total** | **29** | — |

**Phase-grouped totals:**
- Phase 57: 7 (DGN×3 + AES×4)
- Phase 58: 5 (CIB×5)
- Phase 59: 5 (CRT×5)
- Phase 60: 3 (LCP×3)
- Phase 61: 4 (BND×4)
- Phase 62: 5 (VRF×5)
- **Total: 29 unique REQ-IDs**, every one mapped exactly once.

---

*Last updated: 2026-04-25 — v1.8 Speed of Light requirements defined and traceability populated by pde-roadmapper*
