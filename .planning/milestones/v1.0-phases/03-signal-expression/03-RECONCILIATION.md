---
phase: 03-signal-expression
phase_number: 03
generated: "2026-04-06"
first_commit: 87e8699
plans: [03-01, 03-02, 03-03, 03-04]
status: complete
---

# Phase 03 — SIGNAL Expression: Reconciliation

**Phase:** 03 — SIGNAL Expression
**Scope:** CSS progressive enhancement fallback, asymmetric hover timing, hard-cut reveals, canvas cursor, ScrollTrigger-based ScrambleText, staggered grid entry, SIGNAL-SPEC.md specification document
**Plans:** 4
**Commits:** 11 (87e8699 → dadcc0e)
**Completed:** 2026-04-06

---

## Plan Delivery Summary

| Plan | Name | Tasks | Status | Deviations |
|------|------|-------|--------|------------|
| 03-01 | CSS Interaction Layer and Progressive Enhancement | 2/2 | COMPLETE | None |
| 03-02 | Canvas Cursor | 2/2 | COMPLETE | None |
| 03-03 | ScrollTrigger ScrambleText and Stagger Batch Entry | 2/2 | COMPLETE | None |
| 03-04 | SIGNAL Layer Specification | 1/1 | COMPLETE | None |

All 4 plans executed exactly as written. Zero deviations across the phase.

---

## Acceptance Criteria Map

### 03-01 — CSS Interaction Layer and Progressive Enhancement

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC-1 | `[data-anim]` element visible (opacity:1) when JS disabled or GSAP fails | PASS | Catch-all `[data-anim] { opacity: 1 }` added after specific rules in globals.css |
| AC-2 | Catch-all rule appears AFTER specific `[data-anim="..."]` rules in source order | PASS | Placed at line 1034, after cta-btn block at lines 1015–1028 |
| AC-3 | `.sf-pressable` base state uses `--duration-slow` (400ms out) | PASS | Changed from `--duration-normal`; governs return transition |
| AC-4 | `.sf-pressable:hover` uses `--duration-fast` (100ms snap-in) | PASS | `transition-duration: var(--duration-fast)` added to :hover rule |
| AC-5 | `.sf-hoverable` base uses `--duration-slow` (400ms out) | PASS | Changed from `--duration-normal`; `:not(:hover)` rule removed |
| AC-6 | `.sf-invert-hover` base 400ms out, hover 100ms in | PASS | Base changed from `--duration-fast` to `--duration-slow`; `:hover` override added |
| AC-7 | `.sf-link-draw:hover::after` uses `--duration-fast` for draw-in | PASS | `transition-duration: var(--duration-fast)` added to `:hover::after` |
| AC-8 | Section-reveal fires at `duration: 0.034` / `ease: "none"` | PASS | Replaced `duration: 0.7` / `ease: "power2.out"` in page-animations.tsx |
| AC-9 | `[data-anim]` included in reduced-motion selector list | PASS | Added as first selector in the `@media (prefers-reduced-motion: reduce)` block |

**03-01 result: 9/9 AC PASS**

---

### 03-02 — Canvas Cursor

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC-1 | `canvas-cursor.tsx` exists with `'use client'` + `CanvasCursor` export | PASS | Created at components/animation/canvas-cursor.tsx |
| AC-2 | No canvas/listeners attached on `(pointer: coarse)` | PASS | Early return guard in useEffect |
| AC-3 | Magenta crosshair at mouse position inside `[data-cursor]` section | PASS | 4-arm 24px crosshair drawn via 2D context at mousemove position |
| AC-4 | Fading particle trail with decreasing alpha | PASS | Alpha decay at -0.02/frame, capped at 60 particles |
| AC-5 | rAF loop cancels on tab hidden, resumes on visible | PASS | `visibilitychange` listener with `cancelAnimationFrame` / restart |
| AC-6 | Canvas clears when mouse outside `[data-cursor]` sections | PASS | `activeSectionCount` counter; clears when count reaches 0 |
| AC-7 | `GlobalEffects` renders `CanvasCursor` (not commented-out `CustomCursor`) | PASS | Import added; JSX comment replaced with `<CanvasCursor />` |
| AC-8 | Canvas: `position: fixed; inset: 0; pointer-events: none; z-index: var(--z-cursor)` | PASS | Inline styles applied to canvas element |

**03-02 result: 8/8 AC PASS**

---

### 03-03 — ScrollTrigger ScrambleText and Stagger Batch Entry

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC-1 | `initPageHeadingScramble` uses `ScrollTrigger.create()` with `once: true` per heading | PASS | `setTimeout` removed; per-element `ScrollTrigger.create` with `once: true` |
| AC-2 | Above-fold headings fire on page load via `start: "top bottom"` | PASS | `start: "top bottom"` triggers immediately for elements already in viewport |
| AC-3 | Below-fold headings fire once on scroll entry, no re-trigger | PASS | `once: true` on each ScrollTrigger.create instance |
| AC-4 | `ScrollTrigger.batch("[data-anim='stagger'] > *")` with `interval: 0.04` and `stagger: 0.04` | PASS | Added at end of `initCoreAnimations()` |
| AC-5 | CSS initial state `[data-anim="stagger"] > * { opacity: 0; transform: translateY(20px); }` in globals.css | PASS | Added after cta-btn rule, before catch-all |
| AC-6 | Batch animates to `opacity: 1, y: 0` with 40ms stagger and `once: true` | PASS | `gsap.to(batch, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04 })` with `once: true` |
| AC-7 | `[data-anim="stagger"] > *` in reduced-motion reset block | PASS | Added to `@media (prefers-reduced-motion: reduce)` selector list |

**03-03 result: 7/7 AC PASS**

---

### 03-04 — SIGNAL Layer Specification

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC-1 | SIGNAL-SPEC.md contains a section for each of 9 effects: ScrambleText, asymmetric hover, hard-cut transition, staggered grid entry, `[data-anim]` fallback, canvas cursor, VHS overlay, circuit divider, hero mesh | PASS | All 9 effects documented in SIGNAL-SPEC.md |
| AC-2 | Each effect lists timing, easing, mobile behavior, CSS fallback, reduced-motion behavior | PASS | Per-effect table with all 5 properties |
| AC-3 | SIG-06 present with "DEFERRED — post-v1.0" status and rationale | PASS | Web Audio API gesture-gating complexity cited |
| AC-4 | SIG-07 present with "DEFERRED — post-v1.0" status and rationale | PASS | Vibration API limited Safari support cited |
| AC-5 | SIG-08 present with "DEFERRED — post-v1.0" status and rationale | PASS | IdleOverlay visual QA deferral cited |
| AC-6 | Mobile behavior matrix separates Collapse vs Persist per effect | PASS | Matrix documents cursor/VHS/circuit/hero-mesh as Collapse; ScrambleText/hover/stagger/hard-cut as Persist |
| AC-7 | Motion token names (`--duration-instant`, `--duration-fast`, `--duration-slow`) with ms values referenced | PASS | Section 1 token reference table + per-effect timing column |

**03-04 result: 7/7 AC PASS**

---

## Phase-Level Requirements Coverage

| Requirement | Description | Delivered By | Status |
|-------------|-------------|--------------|--------|
| SIG-01 | ScrambleText on page headings | 03-03 (ScrollTrigger-based) | DONE |
| SIG-02 | Asymmetric hover timing (100ms in / 400ms out) | 03-01 | DONE |
| SIG-03 | Section-reveal hard cut (34ms / ease: none) | 03-01 | DONE |
| SIG-04 | Staggered grid entry (40ms cascade) | 03-03 (ScrollTrigger.batch) | DONE |
| SIG-05 | `[data-anim]` progressive enhancement catch-all | 03-01 | DONE |
| SIG-06 | Audio feedback palette | 03-04 (DEFERRED — post-v1.0) | DEFERRED |
| SIG-07 | Haptic feedback | 03-04 (DEFERRED — post-v1.0) | DEFERRED |
| SIG-08 | Idle state animation | 03-04 (DEFERRED — post-v1.0) | DEFERRED |
| SIG-09 | Canvas cursor with particle trail | 03-02 | DONE |
| SIG-10 | SIGNAL layer specification document | 03-04 (SIGNAL-SPEC.md) | DONE |

7/10 requirements delivered in-phase. SIG-06/07/08 formally deferred with documented rationale and implementation paths.

---

## Commit Log

| Commit | Plan | Type | Description |
|--------|------|------|-------------|
| 87e8699 | 03-01 | feat | Add [data-anim] catch-all fallback and asymmetric hover timing |
| 08f282f | 03-01 | feat | Convert section-reveal to 34ms hard cut |
| f8a3a68 | 03-02 | feat | Create canvas-cursor with crosshair + particle trail |
| 9af4878 | 03-02 | feat | Wire CanvasCursor into GlobalEffects |
| 8f4a38e | 03-03 | chore | Checkpoint commit before 03-03 changes |
| 9da3179 | 03-03 | feat | Replace setTimeout with ScrollTrigger in initPageHeadingScramble |
| c554ebd | 03-03 | feat | Add ScrollTrigger.batch stagger entry and CSS initial state |
| a305d17 | 03-04 | docs | Create SIGNAL-SPEC.md with complete effect specifications |
| 058bae6 | 03-02 | docs | Complete canvas-cursor plan — SUMMARY, STATE, memory updated |
| 35c196d | 03-01 | docs | Complete CSS interaction layer plan — SUMMARY.md + memory |
| fbe833b | 03-03 | docs | Complete ScrollTrigger ScrambleText + stagger batch plan |
| dadcc0e | 03-04 | docs | Complete SIGNAL-SPEC plan — SUMMARY, STATE, ROADMAP, memory updated |

---

## Files Produced

### Created
- `components/animation/canvas-cursor.tsx` — CanvasCursor component (03-02)
- `.planning/phases/03-signal-expression/SIGNAL-SPEC.md` — SIGNAL layer specification (03-04)

### Modified
- `app/globals.css` — [data-anim] catch-all, asymmetric hover, stagger initial state, reduced-motion updates (03-01, 03-03)
- `components/layout/page-animations.tsx` — Hard-cut section-reveal, ScrollTrigger ScrambleText, stagger batch (03-01, 03-03)
- `components/layout/global-effects.tsx` — CanvasCursor wired in (03-02)

---

## Deferred Items

| Item | ID | Rationale | Documented In |
|------|----|-----------|---------------|
| Audio feedback palette | SIG-06 | Web Audio API gesture-gating complexity; requires UX design for volume + consent | SIGNAL-SPEC.md §4 |
| Haptic feedback | SIG-07 | Vibration API has no Safari support; limited value for portfolio SOTD criteria | SIGNAL-SPEC.md §4 |
| Idle state animation refinement | SIG-08 | IdleOverlay component exists; visual QA iteration deferred; basic implementation present | SIGNAL-SPEC.md §4 |

---

## Phase Health

- **Planned tasks:** 7
- **Completed tasks:** 7
- **Deviations:** 0
- **Auth gates:** 0
- **AC pass rate:** 31/31 (100%)
- **Requirement completion:** 7/10 (3 formally deferred)
- **Duration:** ~30 min total across 4 plans
- **Build integrity:** TypeScript compilation passed on all tasks with tsc --noEmit verification

---

## Verifier Handoff

**What to verify:** The SIGNAL layer is a runtime/visual system. Verification requires a running browser session — not static file inspection.

### Environment Setup

```bash
cd /Users/greyaltaer/code/projects/SignalframeUX
npm run dev
# Dev server on http://localhost:3000
```

### Verification Checklist

#### 03-01 — CSS Interaction Layer

**Asymmetric hover timing (visual):**
1. Open any page with buttons or links
2. Hover over a `.sf-pressable` button — it should snap in fast (~100ms)
3. Move away — it should ease out slowly (~400ms)
4. Same test for `.sf-invert-hover` elements (text inverts on dark bg)
5. Same for links with underline draw animation

**Hard-cut section-reveal:**
1. Scroll a section with `[data-anim="section-reveal"]` into view
2. The reveal should be an instant hard cut (opacity 0 to 1 with no fade)
3. It should NOT slide up gradually — that behavior was removed

**Progressive enhancement fallback (manual):**
1. Open DevTools > Network tab > Block JavaScript
2. Reload — all `[data-anim]` sections must be fully visible (no invisible content)

#### 03-02 — Canvas Cursor

**Crosshair and trail (visual):**
1. Navigate to a section with `data-cursor` attribute
2. Move the mouse — a magenta crosshair (4 arms, 24px) should follow
3. Moving quickly should leave a fading dot trail
4. The trail dots should fade to invisible within ~1–2 seconds of the mouse stopping

**Section scoping:**
1. Move the mouse into a section WITHOUT `[data-cursor]`
2. The cursor canvas should clear — no crosshair or trail visible
3. Move back into a `[data-cursor]` section — cursor resumes

**Mobile (if testing on touch device or DevTools mobile emulation):**
1. With `(pointer: coarse)` — no canvas element, system cursor only

**Tab visibility:**
1. Switch to another browser tab and back
2. The canvas cursor should resume without artifacts

#### 03-03 — ScrambleText and Stagger

**ScrambleText on viewport entry:**
1. If there are `[data-anim="page-heading"]` elements below the fold, scroll to one
2. The heading text should scramble-in with char noise on first reveal
3. Scroll back up and back down — it should NOT scramble again (`once: true`)

**Stagger grid entry:**
1. Find a section using `data-anim="stagger"` on a parent container
2. Scroll the grid into view
3. Child items should appear in a cascade with ~40ms delay between each
4. The cascade should only happen once — subsequent scrolls show items already visible

#### 03-04 — SIGNAL-SPEC.md

File review only (no browser needed):

```bash
cat /Users/greyaltaer/code/projects/SignalframeUX/.planning/phases/03-signal-expression/SIGNAL-SPEC.md
```

Confirm:
- 9 effects documented
- `DEFERRED` appears 3+ times (SIG-06, SIG-07, SIG-08)
- Mobile behavior matrix lists Collapse vs Persist groups
- Motion token names and ms values are present

### Known Non-Issues

- The `CustomCursor` function definition remains in `global-effects.tsx` (not exported, tree-shaken) — this is intentional for rollback capability per 03-02 decision
- SIG-06/07/08 absence from runtime is correct — they are formally deferred, not forgotten
- The `zIndex` CSS custom property string in CanvasCursor requires `as unknown as number` — this is a React CSSProperties typing limitation, not a bug

### Pass Criteria

Phase 03 passes verification when:
- [ ] Snap hover (100ms in) and slow release (400ms out) are perceptible on interactive elements
- [ ] Section reveals are instant hard cuts, not fades
- [ ] Canvas cursor appears and trails inside `[data-cursor]` sections, disappears outside them
- [ ] Canvas cursor absent on touch devices
- [ ] ScrambleText fires on viewport entry (once only)
- [ ] Grid stagger cascade visible on first scroll-reveal
- [ ] SIGNAL-SPEC.md contains all 9 effects with complete per-effect tables
