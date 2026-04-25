# Project Research Summary — v1.8 Speed of Light

**Confidence:** HIGH for direction; MEDIUM for Phase 60 specific tactics until diagnosis (Phase 57) runs.

## Executive Summary

v1.8 is a **measurement-first critical-path restructure** to recover the original CLAUDE.md gate (Lighthouse 100/100 mobile, LCP <1.0s, CLS=0, TTI <1.5s, <200KB initial) on prod, where Phase 37 measured Perf 76 / LCP 6.5s. It is **not** a redesign and **not** a stack-modernization milestone.

Almost every gap closure is configuration + load-order — only one new devDep (`@lhci/cli`). Locked aesthetic, motion contract, CLS=0 protection, and parked Track B (ScaleCanvas pillarbox/counter-scale) all stay intact. Six bounded phases in dependency order: diagnosis → CI gate → critical-path restructure (font + sync-script inlining + Lenis idle defer) → LCP repositioning → bundle hygiene → real-device verification.

The key risk is **aesthetic-preservation drift** — each individual perf change is "barely visible" but the system can drift away from the locked DU/TDR register without any single Chromatic re-baseline failing. This is the only risk no automated gate can detect; treat as milestone-wide standing rule.

## Stack Additions (Tension 2 Resolved)

**Reconciled — Lighthouse CI runner choice:** Use `@lhci/cli@^0.15.1` (devDep). NOT extending `scripts/launch-gate.ts`.

PITFALLS #6 demands `numberOfRuns: 5` + warmup×2 + median assertion + threshold 2-3pts below prod target — `@lhci/cli` supports all natively via `lighthouserc.json`. Extending `launch-gate.ts` (current "worst-of-3") would re-implement it. **Hybrid:** keep `launch-gate.ts` as-is for manual post-deploy production verification (100/100 against prod URL); LHCI runs PR-gate against Vercel preview at threshold ≥97 to absorb cold-start variance.

**Add (devDep only — zero new runtime deps):**
- `@lhci/cli@^0.15.1` — Lighthouse CI runner. Closes durable per-PR enforcement.
- `web-vitals@^5.2.0` (devDep, OPTIONAL) — for **attribution** debugging only. Production telemetry uses built-in `next/web-vitals` `useReportWebVitals`.

**Keep, do not change:** Next.js 15.5.14 (Next 16 was rolled back in Phase 37), Tailwind v4 / `@theme inline` / `@layer signalframeux` (v1.7 lock), GSAP 3.14.2 single-ticker, Lenis 1.1.20 with `autoResize: true` (PF-04 contract), Three.js 0.183.2 via singleton `useSignalScene`.

**Do NOT add:**
- `@vercel/speed-insights` / `@vercel/analytics` — runtime SaaS, third-party request, duplicates free measurement
- `partytown` / `next/script strategy="worker"` — App Router unsupported, breaks CLS prevention
- `react-three-fiber` — independent rAF conflicts with `globalTimeline.timeScale(0)`
- `next/script strategy="beforeInteractive"` for `/sf-canvas-sync.js` — runs before hydration but NOT before first paint (PITFALLS #8)
- `experimental.inlineCss: true` — breaks `@layer signalframeux` cascade ordering (vercel/next.js#47585; PITFALLS #7)

## Feature Taxonomy

**Table stakes (MVP — required to clear LCP <1.0s gate):**
1. LCP candidate diagnosis pass (Lighthouse trace + `PerformanceObserver`)
2. Anton font preload + character subset (ALL-CAPS English; `glyphhanger` build step, no runtime dep)
3. Inline `/sf-canvas-sync.js` 200B IIFE (eliminates one render-blocking external request, preserves CLS=0)
4. Lenis init wrapped in `requestIdleCallback({ timeout: 100 })`
5. Lighthouse CI on PR via `@lhci/cli` against Vercel preview, with cold-start variance discipline
6. Real-device telemetry via built-in `next/web-vitals` `useReportWebVitals` (no third-party SaaS)
7. Bundle hygiene on the four named unused-JS chunks via `ANALYZE=true pnpm build` + `optimizePackageImports` expansion

**Differentiators (close real-device parity, prevent regression):**
- Anton `font-display` reconciliation with tuned `size-adjust`/`ascent-override` so `swap` becomes safe (Pitfall #1)
- `getQualityTier()` first-paint reads on hero/ghost-label for low-tier device parity
- `content-visibility: auto` on below-fold SFSection (CAUTION: ScrollTrigger pin interaction — Anti-Pattern #5)
- GSAP `lazy: true` on non-LCP-window tweens
- WebPageTest real-device sampling (iPhone 13/14 Safari + Galaxy A14 Chrome)

**Defer to v1.8.1 / v1.9:**
- Critical CSS extraction via manual hand-pick (only if MVP doesn't close gap)
- Speculation rules / route prefetch hints (INP-only)
- Anton fallback override via Fontaine
- Server Components audit on `components/blocks/` (<3KB win)
- Next.js 16 retry, PPR, Cache Components

**Anti-features (reject up-front):**
- "Optimize images" / `loading="lazy"` blanket — LCP element is text
- Disqualify ghost-label via `display: none` — load-bearing aesthetic AND will re-shift LCP
- Remove ScaleCanvas transform — Track B parked
- Replace GSAP with CSS animations — aesthetic is GSAP-driven
- Service Worker / app-shell caching — no cold-load Lighthouse impact
- Custom rAF loop for perf metrics — single-ticker rule
- Dynamic-import `<Footer>`/`<Nav>` — above-the-fold/sticky chrome

## Architecture Build Order (Tensions 1 & 3 Resolved)

**Reconciled — `/sf-canvas-sync.js` disposition (Tension 1):**

Direct read of `public/sf-canvas-sync.js` and `components/layout/scale-canvas.tsx:135-143` confirms the file is **NOT dead code**. STACK.md's "delete it" recommendation is wrong because:
- Inline `scaleScript` (`layout.tsx:100`) writes CSS vars at `<head>` parse — runs BEFORE `<body>` exists, so it CANNOT read `inner.offsetHeight`.
- External `/sf-canvas-sync.js` reads `[data-sf-canvas].offsetHeight` and writes `outer.style.height = inner.offsetHeight * (vw/1280)`. Runs AFTER body parses, BEFORE first paint. **Different job.**
- Both are required for CLS=0; removing either reintroduces the documented 0.65 CLS regression.

**Recommended:** **INLINE the IIFE** as a tail-of-`<body>` inline script in `app/layout.tsx`. Eliminates the render-blocking external request (~80-150ms on mobile 4G), preserves CLS=0 by construction, deletes `public/sf-canvas-sync.js`. ARCHITECTURE Q1's "Option A CSS aspect-ratio" path is structurally sound but is a ScaleCanvas refactor → crosses into Track B (parked) → OUT OF SCOPE for v1.8.

**Reconciled — LCP element identity (Tension 3):**

Diagnosis pass is **MANDATORY first phase**. Ghost-label is already painted at opacity 0.03 from first frame (the v1.5 fix because Lighthouse excludes opacity:0). The 6.5s LCP timing is **inconsistent with a paint-from-first-frame element**. Strong hypothesis: actual LCP element is the THESIS manifesto Anton statement (`clamp(56px, 10vw, 120px)`), opacity-animated via GSAP scrub-reveal. Do NOT commit to ghost-label demotion or hero h1 elevation until a Lighthouse trace + `PerformanceObserver({type: 'largest-contentful-paint'})` confirms element identity per-viewport.

### Phase 57 — Diagnosis Pass + Bundle Audit
- **Hard prerequisite for everything else.**
- Delivers: confirmed LCP element selector per-viewport (mobile + desktop); per-chunk owner attribution for `3302`/`e9a6067a`/`74c6194b`/`7525`; written to `.planning/codebase/v1.8-lcp-diagnosis.md`. NO code changes.
- Risk: LOW. Time: 4-6h.

### Phase 58 — Lighthouse CI + Real-Device Telemetry Install
- **Must land BEFORE Phase 59** so regressions are caught per-PR.
- Delivers: `.github/workflows/lighthouse.yml` (NEW), `.lighthouseci/lighthouserc.json` (NEW) with cold-start variance discipline (warmup×2, `numberOfRuns: 5`, median, ≥97 categories:performance, LCP ≤1000ms, CLS ≤0); `app/_components/web-vitals.tsx` using built-in `useReportWebVitals`; existing `scripts/launch-gate.ts` retained for manual post-deploy verification at 100/100.
- Stack: `@lhci/cli@^0.15.1` devDep + `treosh/lighthouse-ci-action@v12`.
- Risk: LOW. Time: 6-8h.

### Phase 59 — Critical-Path Restructure
- **HIGH RISK.** Touches CLS-protection contract. Phase 58 gate must be GREEN.
- Delivers: inline `/sf-canvas-sync.js` 200B into `<body>` tail (delete `public/sf-canvas-sync.js`); Anton character subset via build-time `glyphhanger`; Anton `display: optional` → `swap` migration WITH tuned `size-adjust`/`ascent-override` against `Impact, Helvetica Neue Condensed, Arial Black, sans-serif` fallback chain (deliberate Chromatic re-baseline, documented per `feedback_ratify_reality_bias.md`); Lenis init wrapped in `requestIdleCallback(initLenis, { timeout: 100 })` inside existing `useEffect`.
- Mitigation: ship as 3 separate PRs (sync-script, font, Lenis) for clean bisect. CLS Playwright test in pipeline before phase ships. Slow-3G hard-reload screen recording mandatory verification (Pitfall #1).
- Risk: HIGH.
- **Research-flag: YES** — needs `/pde:research-phase` for Anton fallback metrics calibration tooling decision (Brian Louis Ramirez Fallback Font Generator vs Fontaine).

### Phase 60 — LCP Element Repositioning
- **Phase shape contingent on Phase 57 diagnosis output.**
- Delivers (one of): (a) THESIS Anton manifesto reveal mechanism opacity → clip-path; OR (b) ghost-label `content-visibility: auto` + `contain-intrinsic-size` (on element only, NOT section wrapper); OR (c) hero h1 clip-path char-reveal in `page-animations.tsx`. Final: LCP <1.0s on prod homepage mobile.
- Risk: HIGH (signature aesthetic surface). Mitigation: `.planning/visual-baselines/v1.8-start/` snapshot diff per commit; cohort review before merge.
- **Research-flag: YES** — needs `/pde:research-phase` after Phase 57 diagnosis output is in hand.

### Phase 61 — Bundle Hygiene
- Depends on Phase 57 audit output. Parallel-safe with Phase 60.
- Delivers: `next.config.ts:10` `optimizePackageImports` expansion (`radix-ui`, `cmdk`, `vaul`, `sonner`, `react-day-picker`, `date-fns`, `input-otp` — phase-gate re-run `ANALYZE=true pnpm build` after each); `components/sf/index.ts` barrel hygiene; `*Lazy.tsx` wrapper verification (`InstrumentHUD`, `CheatsheetOverlay` likely candidates for interaction-gating); `shiki/core` import path drift check; stale-chunk guard via `rm -rf .next/cache .next` before any gating measurement.
- Risk: MEDIUM. Time: 8-12h.

### Phase 62 — Real-Device Verification + Final Gate
- All preceding phases must be complete.
- Delivers: WebPageTest free tier (or BrowserStack supplement) JSON for ≥3 device profiles in `.planning/perf-baselines/v1.8/`; `chrome-devtools` MCP scroll-test; `pnpm tsx scripts/launch-gate.ts` 5× against prod URL — median 100/100, LCP <1.0s, CLS=0; aesthetic-of-record diff <0.5% per page; cohort review confirms no "feels generic" drift; field RUM 75th-percentile <1.0s.
- Risk: LOW (measurement). Blocks ship if devices regress.

**Mid-milestone real-device checkpoint after Phase 60** (per Pitfall #10 — discovering a real-device blocker after all phases ship is a refactor crisis).

## Watch-Out-For (Top 7 Pitfalls → Phase Mapping)

1. **Aesthetic-preservation drift (#15)** → milestone-wide standing rule. **No Chromatic re-baseline for perf changes**; `.planning/visual-baselines/v1.8-start/` snapshot at start; mid-milestone external review. Every phase.
2. **`/sf-canvas-sync.js` defer/async reintroduces CLS (#2)** → Phase 59. **Inline in `<body>` tail, never defer/async**. Lighthouse audit goes green but CLS regresses 0.00→0.05+.
3. **Anton font-display swap CLS at 200-400px (#1)** → Phase 59. Sub-pixel fallback metric mismatch becomes 4-12px vertical motion. **Tune `size-adjust`/`ascent-override` BEFORE flipping `optional`→`swap`**. Slow-3G hard-reload screen recording is the verification gate.
4. **Blank-canvas LCP suppression (#3)** → Phase 60. Lazy-mounting hero canvas makes LCP WORSE — Lighthouse picks blank canvas. **Reserve LCP candidate as text or static poster, never blank canvas.** Memory rule (`feedback_visual_verification.md` v1.5 carry-forward).
5. **Lighthouse CI cold-start variance (#6)** → Phase 58. Vercel preview cold edges produce ±10pt swings. **Mandatory `numberOfRuns: 5` + warmup×2 + median assertion + ≥97 threshold buffer in CI**. THE reason `@lhci/cli` wins over `launch-gate.ts` extension.
6. **Mobile-emulation pass / real-device fail (#10)** → Phase 62 + mid-milestone after Phase 60. Lighthouse 100 with real-device LCP >2.5s on mid-tier Android. **Real-device sampling mandatory mid-milestone, not end-only**. JSON in `.planning/perf-baselines/v1.8/`.
7. **`experimental.inlineCss: true` breaks `@layer signalframeux` (#7)** → reject in planning. vercel/next.js#47585 open issue, consumer-override architecture lost, magenta flash returns. **Do NOT enable.** If critical CSS becomes necessary in v1.8.1, manual hand-pick with consumer-import Chromatic verification.

## Open Questions / Spike Candidates

- **LCP element identity per-viewport** — Phase 57 output. Until then, Phase 60 plan is provisional.
- **Per-chunk owner attribution** (`3302`/`e9a6067a`/`74c6194b`/`7525`) — ARCHITECTURE's hypotheses (radix-ui, cmdk, shiki, date-fns) are LOW-confidence guesses. Phase 57 `ANALYZE=true pnpm build` resolves.
- **Anton fallback metric override values** — exact `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override` numbers need one-shot calibration. Tooling decision (Brian Louis Ramirez Fallback Font Generator vs `@nuxtjs/fontaine`) deferred to Phase 59 research.
- **Whether Phase 60 needs both ghost-label AND THESIS Anton interventions, or just one** — Phase 57 diagnosis decides. Two-track strategy preserved as option, not commitment.
- **Lenis scroll-restoration race window after rIC defer** — v1.2 minor tech debt says rAF "mitigates"; rIC bound at `{ timeout: 100 }` widens window slightly. Verify on hard-reload to deep anchor URLs (e.g. `/inventory#prf-08`).
- **`content-visibility: auto` × ScrollTrigger pin interaction** — theoretical risk per Anti-Pattern #5; needs spike if pursued. Apply only to leaf elements, never section wrappers.

## Aesthetic Preservation Drift (First-Class Commitment)

Per PITFALLS #15 — the highest-priority pitfall for v1.8 because it's the only one no automated gate can detect.

**Standing rules for every phase:**
1. **No Chromatic re-baseline for perf changes.** If a perf change forces a Chromatic regression, the perf change is wrong; find another path. Re-baselining is reserved for deliberate aesthetic decisions (only documented exception in v1.8: Anton `optional` → `swap` migration in Phase 59, with `feedback_ratify_reality_bias.md` documentation).
2. **Visual-of-record snapshot at v1.8 start** — full-page screenshots at desktop / iPhone-13 / iPad / 1440×900 of homepage + 4 subpages, stored as `.planning/visual-baselines/v1.8-start/`. Every phase end: pixel-diff against this snapshot. Any diff >0.5% flagged for human review.
3. **Mid-milestone cohort review** — external eye reviews state vs. v1.8-start snapshot after Phase 60. If "feels different" without specific code change as cause, escalate.
4. **Lock-in mode** (memory: `feedback_lockin_before_execute.md`) — aesthetic contract extracted from shipped code into `.planning/codebase/AESTHETIC-OF-RECORD.md` at v1.8 start. Every phase reads from it. No re-derivation per-phase.

## Confidence Map

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions npm-verified 2026-04-25; Next 15.5.14 confirmed in `node_modules`. Reconciled `@lhci/cli` choice grounded in PITFALLS #6. |
| Features | HIGH | Codebase ground-truth (12 files read directly). All "must have" items grounded in measured Phase 37 gaps. |
| Architecture | MEDIUM | File-by-file integration points HIGH (direct reads). Phase boundaries MEDIUM until Phase 57 diagnosis runs — Phase 60 shape is contingent. |
| Pitfalls | HIGH | 20 pitfalls with confirmed-against-current-docs sources (lighthouse#16203, vercel/next.js#47585, GoogleChrome/web-vitals, GoogleChrome/lighthouse variability docs). |

**Overall: HIGH for direction; MEDIUM for Phase 60 specific tactics until Phase 57 diagnosis runs.**
