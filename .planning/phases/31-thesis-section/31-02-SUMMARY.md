---
phase: 31-thesis-section
plan: 02
subsystem: animation
tags: [gsap, scrolltrigger, pinned-section, manifesto, forwardref, reduced-motion, playwright]

requires:
  - phase: 31-01
    provides: lib/thesis-manifesto.ts with 6 locked wiki statements + TH-05 source tests
  - phase: 29
    provides: PinnedSection component, GSAP Observer, fonts-ready hook, Lenis autoResize:false
  - phase: 22
    provides: GSAP core + ScrollTrigger + SplitText plugin via @/lib/gsap-core

provides:
  - ThesisSection block — 250vh pinned scroll sequence choreographing 6 manifesto statements
  - ManifestoStatement subcomponent — absolutely-positioned span with data-void-before rhythm
  - PinnedSection forwardRef upgrade — containerRef exposed for nested ScrollTrigger pinnedContainer
  - Scrubbed master timeline driven by nested ScrollTrigger (pinnedContainer pattern)
  - Reduced-motion fallback — stacked document-flow specimen, no pin, no GSAP
  - TH-01, TH-02, TH-03, TH-04, TH-06 browser tests (9 new tests; 15 total in suite)

affects: [phase-32-signal-proof, phase-34-visual-language]

tech-stack:
  added: []
  patterns:
    - "Nested ScrollTrigger with pinnedContainer — scrub timeline uses parent's pinned container as reference for progress calculation"
    - "Parent-owned GSAP timeline — ThesisSection owns the master tl; ManifestoStatement attaches tweens to it via prop"
    - "Whole-span opacity + yPercent animation (SplitText char-level dropped due to autoSplit async race + stagger budget collision)"
    - "data-void-before attribute drives asymmetric whitespace rhythm without CSS custom property proliferation"
    - "forwardRef on PinnedSection — containerRef exposed as ref, semantic-neutral, required by nested ScrollTrigger"

key-files:
  created:
    - components/blocks/thesis-section.tsx
    - components/blocks/manifesto-statement.tsx
  modified:
    - components/animation/pinned-section.tsx
    - app/page.tsx
    - tests/phase-31-thesis.spec.ts

key-decisions:
  - "SplitText char-level animation dropped — 3 compounding bugs (zero-range trigger, enter/exit overlap, autoSplit async race) made it unshippable. Whole-span opacity+yPercent is stable and visually coherent."
  - "Parent-owned timeline pattern (not per-statement useGSAP) — single tl makes scrub progress deterministic; statement tweens attach via GSAP position labels"
  - "Weighted-arc void rhythm: S1/S6 = data-void-before=40 (bookends), S2-S5 = data-void-before=25 (pillars)"
  - "scrollDistance={2.5} — 250vh effective scroll range (between TH-01's 200-300vh floor/ceiling)"
  - "end: () => `+=${scrollDistance * window.innerHeight}` on nested trigger — dynamically computes range to avoid zero-range collapse (root cause of original scrub bug)"
  - "Physical iPhone Safari (D-34) verification deferred by user — code ships with gate noted but not blocking"

patterns-established:
  - "Nested ScrollTrigger pinnedContainer pattern — template for any future multi-statement pinned sequence"
  - "data-void-before as layout rhythm signal — avoids CSS var sprawl for per-element spacing that varies per instance"

requirements-completed: [TH-01, TH-02, TH-03, TH-04, TH-05, TH-06]

duration: ~45 min (including scrub bug investigation and fix)
completed: 2026-04-08
---

# Phase 31 Plan 02: THESIS Section Implementation Summary

**250vh pinned manifesto scroll — 6 wiki-locked statements choreographed by a scrubbed GSAP master timeline. The primary SOTD signature interaction of the v1.5 redesign.**

## Performance

- **Completed:** 2026-04-08
- **Tasks:** 5 (4 autonomous code tasks + 1 deferred human-verify gate)
- **Files created:** 2 · **Files modified:** 3
- **Tests:** 15/15 passing (9 TH-05 source tests + 9 browser tests — forwardRef + TH-01..04 + TH-06 + regression)

## Accomplishments

- **PinnedSection forwardRef (Task 0):** One-line upgrade wrapping PinnedSection in `React.forwardRef` and exposing `containerRef` as the forwarded ref. Required by the nested ScrollTrigger `pinnedContainer` option — without this the inner scrub has no reference to the pinned container's bounds.

- **ThesisSection + ManifestoStatement (Task 1):** `ThesisSection` composes PinnedSection with a 250vh scroll band. A GSAP master timeline (`gsap.timeline({ paused: true })`) is created in `useGSAP`, and each `ManifestoStatement` attaches its own `from→to` opacity+yPercent tween to it. The timeline is then scrubbed 1:1 by a nested ScrollTrigger using `pinnedContainer: containerRef.current`. Absolute positioning + `data-void-before` heights produce the asymmetric whitespace rhythm.

- **Scrub bug fixed (Task 1 post-ship, commit `3f6cec6`):** Three compounding bugs discovered after mount:
  1. Zero-range nested trigger (`end: "bottom bottom"` → same scroll pos as start) — timeline never advanced. Fixed to `end: () => \`+=${scrollDistance * window.innerHeight}\``.
  2. SplitText `autoSplit: true` async race — fonts-ready re-fires `onSplit` with new char elements, detaching original tweens. Dropped SplitText entirely.
  3. Enter/exit tween overlap — TIMELINE_UNIT stagger budget collision between consecutive statements. Eliminated by whole-span animation.

- **Homepage mount (Task 2):** `ThesisSection` imported and rendered inside the existing Phase 30 THESIS `SFSection` landmark, replacing the Phase 30 stub `<PinnedSection scrollDistance={2}>` block.

- **Browser tests (Task 3):** 6 new Playwright tests added (TH-01 scroll range, TH-02 DOM shape, TH-03 font-size floor, TH-04 void-before rhythm, TH-06 reduced-motion, regression). All pass against live dev server.

- **D-34 deferred (Task 4):** Physical iPhone Safari verification gate noted but not blocking. User accepted.

## Task Commits

1. **Task 0: PinnedSection forwardRef** — `7d5481c` (Feat)
2. **Task 1: ThesisSection + ManifestoStatement** — `8ee4cde` (Feat)
3. **Task 1 fix: scrub bug patch** — `3f6cec6` (Fix)
4. **Task 2: mount in app/page.tsx** — `e3c4d5b` (Feat)
5. **Task 3: TH-01..04 + TH-06 browser tests** — `696706c` (Feat)

## Files Created/Modified

- **`components/animation/pinned-section.tsx`** — Wrapped in `React.forwardRef<HTMLDivElement, PinnedSectionProps>`. `containerRef` forwarded via `ref` prop. Zero behavior change.
- **`components/blocks/thesis-section.tsx`** — ThesisSection block. PinnedSection with forwarded ref, absolute-positioned stage div, GSAP master timeline, nested ScrollTrigger with `pinnedContainer`. Reduced-motion guard renders static stacked fallback. `data-void-before` drives void height via inline style.
- **`components/blocks/manifesto-statement.tsx`** — ManifestoStatement subcomponent. Receives `timeline` + `position` props. Attaches `from { opacity:0, yPercent:20 } → to { opacity:1, yPercent:0 }` tween at label. Whole-span, no SplitText.
- **`app/page.tsx`** — THESIS SFSection updated: Phase 30 stub PinnedSection replaced with `<ThesisSection />`. Import added.
- **`tests/phase-31-thesis.spec.ts`** — Extended with 6 browser tests: TH-01 (scroll range 200-300vh), TH-02 (6 absolute statements in stage), TH-03 (80px+ font-size), TH-04 (≥2 void-before ≥30), TH-06 (reduced-motion specimen), regression (no console errors on THESIS load).

## Verification

- **Playwright 15/15:** All TH-05 source tests + TH-01..04 + TH-06 + regression green
- **D-34 (iPhone Safari):** Deferred — user accepted

## Requirements Closed

TH-01 · TH-02 · TH-03 · TH-04 · TH-05 · TH-06 — all Phase 31 requirements satisfied.

**Phase 31 complete.**
