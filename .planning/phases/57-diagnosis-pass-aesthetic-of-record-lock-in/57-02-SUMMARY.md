---
phase: 57-diagnosis-pass-aesthetic-of-record-lock-in
plan: 02
subsystem: tests
tags: [dgn-03, baselines, playwright, aes-04-harness, captured-state-finalized]

requires:
  - phase: 57-diagnosis-pass-aesthetic-of-record-lock-in
    plan: 01
    provides: "AESTHETIC-OF-RECORD.md captured-state §4 placeholder authored — finalized here"
provides:
  - "tests/v1.8-baseline-capture.spec.ts — reusable Playwright harness (warm-Anton + reduced-motion + dev-overlay gate); doubles as AES-04 pixel-diff source for Phases 58-62"
  - "20 baseline PNGs at .planning/visual-baselines/v1.8-start/ — immutable v1.8-start ground truth (5 routes × 4 viewports)"
  - "AESTHETIC-OF-RECORD.md §4 finalized — captured-state Variant A/B mixed (desktop revealed, mobile frozen pre-reveal)"
affects: [58-lhci-rum, 59-critical-path, 60-lcp-intervention, 61-bundle-hygiene, 62-verification]

tech-stack:
  added: []
  patterns:
    - "Spec-side dev-overlay gate: expect(page.locator('nextjs-portal')).toHaveCount(0) before screenshot — replaces post-hoc human PNG inspection for production-vs-dev capture mode"
    - "Warm-state font forcing: document.fonts.load('700 100px \"Anton\"') + document.fonts.ready before screenshot, eliminating display:optional skip non-determinism"
    - "Direct page.screenshot({ path }) on first run for SEED capture; expect-toHaveScreenshot diff harness deferred to Phase 58+ AES-04 wrapper"
    - ".gitignore exception !.planning/visual-baselines/**/*.png mirrors existing !.planning/claude-design-probes/**/*.png precedent for versioned artifact provenance"

key-files:
  created:
    - "tests/v1.8-baseline-capture.spec.ts — 95 lines, 20 tests"
    - ".planning/visual-baselines/v1.8-start/home-desktop-1440x900.png (494 KB)"
    - ".planning/visual-baselines/v1.8-start/home-iphone13-390x844.png (65 KB)"
    - ".planning/visual-baselines/v1.8-start/home-ipad-834x1194.png (280 KB)"
    - ".planning/visual-baselines/v1.8-start/home-mobile-360x800.png (56 KB)"
    - ".planning/visual-baselines/v1.8-start/system-* (4 viewports, 31 KB-195 KB)"
    - ".planning/visual-baselines/v1.8-start/init-* (4 viewports, 57 KB-366 KB)"
    - ".planning/visual-baselines/v1.8-start/inventory-* (4 viewports, 117 KB-495 KB)"
    - ".planning/visual-baselines/v1.8-start/reference-* (4 viewports, 109 KB-688 KB)"
  modified:
    - ".gitignore — exception line for visual-baselines path (Rule 3 fix)"
    - ".planning/codebase/AESTHETIC-OF-RECORD.md — §4 captured-state placeholder finalized + change-log entry"

key-decisions:
  - "Captured-state is Variant A/B mixed (desktop fully revealed, mobile frozen pre-reveal at opacity 0.01) — documented as canonical for v1.8-start; AES-04 pixel-diff in Phases 58-62 must distinguish reveal-timing regressions from aesthetic regressions"
  - "page.screenshot({ path }) over toHaveScreenshot — Plan 02 SEEDS, Phase 58+ owns the diff wrapper"
  - ".gitignore exception line added (mirrors probe-screenshot precedent) — visual baselines treated as first-class versioned artifacts"
  - "Stale .next cache cleanup IS required when prior mode was pnpm dev --turbopack — PLAN.md Task 2 'do NOT clean .next' guidance is unsafe in mixed-mode caches"

requirements-completed:
  - DGN-03

duration: 17 min
completed: 2026-04-26
---

# Phase 57 Plan 02: DGN-03 Baseline Capture Summary

20 v1.8-start baseline PNGs captured against `pnpm build && pnpm start` (production), reusable Playwright harness authored, AESTHETIC-OF-RECORD.md §"Captured-state definition" finalized — DGN-03 deliverable shipped, AES-04 pixel-diff comparison surface for Phases 58-62 now exists on disk.

## Execution Metrics

- **Duration:** 17 min (start: 2026-04-26T00:53:16Z, end: 2026-04-26T01:10:52Z)
- **Task count:** 3 (2 auto via subagent + 1 human-verify checkpoint)
- **File count:** 23 changed (1 spec + 20 PNGs + 1 doc + 1 .gitignore)
- **Commit:** `8869f85` (atomic — spec + 20 PNGs + .gitignore + doc)
- **PNG total size on disk:** 4.4 MB across 20 files (32 KB–704 KB per PNG)
- **Pattern routed:** B (verify-only checkpoint at Task 3) — Tasks 1-2 in pde-executor subagent (`afe5c36c17177ae1a`); Task 3 in main context

## What Shipped

### `tests/v1.8-baseline-capture.spec.ts` (95 lines, 20 tests)

- 5 routes × 4 viewports: `home`/`system`/`init`/`inventory`/`reference` × `desktop-1440x900`/`iphone13-390x844`/`ipad-834x1194`/`mobile-360x800`
- Forces warm-state Anton via `document.fonts.load('700 100px "Anton"')` + `document.fonts.ready` (Q1 resolution)
- `reducedMotion: "reduce"` + `animations: "disabled"` + `caret: "hide"` for determinism
- **Hard gate:** `expect(page.locator('nextjs-portal')).toHaveCount(0)` BEFORE screenshot — fails the test if `pnpm dev` is the target by mistake; turns Pitfall B into a spec-side guarantee
- Direct `page.screenshot({ path })` (NOT `toHaveScreenshot`) — Plan 02 SEEDS the baselines
- File-size sanity assertion (>1 KB) catches blank-fallback failures

### 20 baseline PNGs at `.planning/visual-baselines/v1.8-start/`

All 20 routes × viewports captured cleanly. MD5s distinct across routes (no byte-identical false-success). Sizes proportional to content density (reference desktop 705 KB largest, system mobile 32 KB smallest).

### `.gitignore` exception

```
# preserve visual baselines (DGN-03 ground truth for AES-04 per-phase pixel-diff)
!.planning/visual-baselines/**/*.png
```

Mirrors the existing `!.planning/claude-design-probes/**/*.png` precedent (line 45).

### `AESTHETIC-OF-RECORD.md` §4 captured-state finalized

Resolved as **Variant A/B mixed**:

| Viewport | Hero `<h1>` state | Variant |
|----------|------------------|---------|
| Desktop 1440×900 | "SIGNALFRAME//UX" fully revealed in Anton | A — live first paint |
| Mobile 360×800 | `<h1>` invisible at start-state opacity 0.01 (`sf-hero-deferred`) | B — reduced-motion frozen pre-reveal |
| Tablet/iphone13 | Not visually inspected; assume mirror of mobile until Plan 03 confirms | B (assumed) |

Documented as canonical for v1.8-start. AES-04 pixel-diff in Phases 58-62 must distinguish reveal-timing regressions from aesthetic regressions when comparing against this mixed-state surface.

## Deviations from Plan

### [Rule 1 - Bug] Stale `.next` cache from turbopack/webpack mix

- **Found during:** Task 2 first run.
- **Issue:** First Playwright run captured 16 byte-identical PNGs (8.7 KB each) for `/system`, `/init`, `/inventory`, `/reference`. Server logs showed HTTP 500 with `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'`. Pitfall #13 (stale-chunk guard) fired in mixed-mode form: prior `pnpm dev --turbopack` session left turbopack residue in `.next/cache` that webpack-mode `pnpm build` partially overwrote.
- **Fix:** Killed leftover `next-server` PID 77821 occupying :3000, `rm -rf .next`, re-ran `pnpm build` (cold), restarted `pnpm start`, verified all 5 routes return 200 with sizes 58 KB–269 KB, re-ran spec.
- **Files modified:** None (cache files only).
- **Verification:** All 20 captures clean, MD5s distinct, sizes proportional to content density.
- **Commit hash:** Resolved before final atomic commit `8869f85`; no separate commit needed.
- **Plan note:** PLAN.md Task 2 §Step 2 explicitly stated "Plan 02 also does NOT clean `.next` first — re-using cached chunks is acceptable." That assumption holds only for clean-cache state. Recommend a Plan-Phase 03 follow-up note: clean `.next` IS required when prior mode may have been `pnpm dev --turbopack`.

### [Rule 3 - Blocking] `.gitignore *.png` blocked atomic commit

- **Found during:** Task 2 → Task 3 handoff (executor surfaced via `git check-ignore -v`).
- **Issue:** `.gitignore:42` global `*.png` rule matched all 20 baseline PNGs. PLAN.md Task 3 atomic-commit recipe (`git add .planning/visual-baselines/v1.8-start/`) would silently add zero PNGs.
- **Fix:** Added one-line exception `!.planning/visual-baselines/**/*.png` after the existing `!.planning/claude-design-probes/**/*.png` line, mirroring the probe-screenshot precedent.
- **Files modified:** `.gitignore` (one line + comment line added).
- **Verification:** `git check-ignore -v` now shows the exception is the matching rule; `git add` of all 20 PNGs successful.
- **Commit hash:** Included in atomic commit `8869f85`.

### Total deviations

**2 deviations:** 1 auto-resolved by executor (Rule 1, stale cache), 1 main-context-resolved (Rule 3, gitignore). **Impact:** Zero application code change. Both deviations are infrastructure hygiene; neither alters the DGN-03 deliverable shape.

## Issues Encountered

**Pre-existing observation (not a deviation):** `pnpm build` emits `Failed to load dynamic font for ✓ . Status: 400` twice during static-page generation — likely the OG-image route's dynamic font fetch hitting an external endpoint. Pre-existing, unrelated to Plan 02 scope. Worth tracking in deferred-items if not already.

## Next Phase Readiness

**Plan 03 (LCP diagnosis) ready to execute** — Plan 02 produced no scope blockers. Plan 03 owns the bundle-analyzer pass + LCP element-identity probe; depends only on Plan 01 (AESTHETIC-OF-RECORD.md exists) and Plan 02 (baselines exist for AES-04 read-back during diagnosis), both shipped.

**Phase 57 progress:** 2/3 plans complete. Plan 03 wave-2 sibling pending. After Plan 03 ships, Phase 57 closes and Phases 58-62 become unblocked.
