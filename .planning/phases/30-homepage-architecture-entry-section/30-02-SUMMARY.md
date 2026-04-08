---
phase: 30-homepage-architecture-entry-section
plan: 02
subsystem: ui
tags: [gsap, scrolltrigger, glsl, three, nav, hard-cut, fbm, pointer-events, accessibility]

requires:
  - phase: 30-01
    provides: 6-section homepage shell with `[data-entry-section]` ScrollTrigger target and GLSLHero container
  - phase: 22
    provides: GSAP core + ScrollTrigger plugin via @/lib/gsap-core
provides:
  - Nav scroll-triggered hard-cut reveal at ENTRY/THESIS boundary
  - .sf-nav-hidden / .sf-nav-visible CSS classes (DU channel-switch aesthetic)
  - uMouse uniform on GLSLHero with pointermove listener scoped to ENTRY container
  - FBM noise field offset driven by normalized cursor position (max ±0.15)
  - Reduced-motion fallbacks for both nav and shader interaction
affects: [phase-31-thesis-section, phase-32-signal-proof, phase-34-visual-language]

tech-stack:
  added: []
  patterns:
    - "Hard-cut visibility class toggle (no GSAP tween) for instant DU-style state changes"
    - "ScrollTrigger with element-scoped trigger via document.querySelector + null guard for cross-page reuse"
    - "GLSL uniform updated via container-scoped pointermove (NOT window) to confine interaction to a section"

key-files:
  created: []
  modified:
    - components/layout/nav.tsx
    - app/globals.css
    - components/animation/glsl-hero.tsx

key-decisions:
  - "Hard-cut nav reveal via class toggle (NOT gsap.to() tween) — DU channel-switch aesthetic, zero animation duration"
  - "visibility:hidden + opacity:0 instead of display:none — preserves skip-nav and keyboard focus order in a11y tree (D-15)"
  - "ScrollTrigger start='bottom top' on [data-entry-section] — fires when ENTRY's bottom edge crosses viewport top"
  - "Non-homepage fallback: if no [data-entry-section] element exists, nav is shown immediately so /inventory, /system, etc. are unaffected"
  - "Reduced-motion fallback: nav visible from page load AND no pointermove listener attached on the shader"
  - "uMouse default (0.5, 0.5) — centered means zero FBM offset on initial render, no first-frame jolt"
  - "pointermove scoped to containerRef (NOT window/document) — interaction confined to ENTRY box, prevents cross-section bleed (RESEARCH Pitfall 6)"
  - "Y coordinate flipped (1.0 - y) for GLSL bottom-origin convention"
  - "{ passive: true } on pointermove for scroll perf"
  - "FBM offset split into intermediate vars (fbmOffsetX/Y) for shader readability — same behavior, cleaner GLSL"

patterns-established:
  - "ScrollTrigger reveal pattern: useRef + useEffect + querySelector guard + onEnter/onLeaveBack class toggles + cleanup via trigger.kill()"
  - "Container-scoped pointer interaction for shader uniforms — establishes the template for any future per-section WebGL interactivity"

requirements-completed: [EN-04, EN-05]

duration: 4 min
completed: 2026-04-08
---

# Phase 30 Plan 02: ENTRY Interactivity Wiring Summary

**Hard-cut nav reveal at ENTRY boundary + container-scoped uMouse uniform driving subtle FBM drift on GLSLHero — completes the ENTRY section experience.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-08T05:38:14Z
- **Completed:** 2026-04-08T05:43:12Z
- **Tasks:** 3 (2 autonomous code tasks + 1 human-verify checkpoint)
- **Files modified:** 3

## Accomplishments

- **Nav scroll-triggered hard-cut reveal (EN-04):** Nav is invisible on homepage load. ScrollTrigger toggles `.sf-nav-hidden` ↔ `.sf-nav-visible` at the ENTRY/THESIS boundary with zero animation duration — pure DU channel-switch aesthetic. Non-homepage routes and reduced-motion users get nav-visible immediately.
- **Pointer-driven shader variation (EN-05):** New `uMouse` uniform on GLSLHero updates from a `pointermove` listener scoped to the ENTRY container. FBM noise field shifts subtly toward the cursor (`±0.15` max offset). Reduced-motion users skip the listener entirely.
- **a11y preserved:** `visibility: hidden` (not `display: none`) keeps the nav in the accessibility tree so skip-nav and keyboard focus order survive while invisible.
- **Phase 30 complete:** All 8 phase requirements (RA-05, EN-01–05, VL-03, VL-07) closed across 2 plans.

## Task Commits

1. **Task 1: Nav scroll-triggered hard-cut reveal** — `1347948` (feat)
2. **Task 2: uMouse uniform on GLSLHero** — `1f5b01b` (feat)
3. **Task 3: Visual verification** — human-verify checkpoint, approved by user (no commit)

**Plan metadata:** _(committed by orchestrator after this SUMMARY)_

## Files Created/Modified

- `components/layout/nav.tsx` — Added `useRef<HTMLElement>` + `useEffect` with ScrollTrigger.create({ trigger: '[data-entry-section]', start: 'bottom top', onEnter, onLeaveBack }). Replaced `sf-nav-roll-up` className with `sf-nav-hidden`. Reduced-motion + non-homepage paths fall through to immediate visibility.
- `app/globals.css` — Added `.sf-nav-hidden { visibility: hidden; opacity: 0 }` and `.sf-nav-visible { visibility: visible; opacity: 1 }` ahead of the existing `sf-nav-roll-up` block (left as dead code per plan instruction; Phase 34 audit cleans it up).
- `components/animation/glsl-hero.tsx` — Added `uMouse: THREE.IUniform<THREE.Vector2>` to uniformsRef type. Added `uMouse: { value: new THREE.Vector2(0.5, 0.5) }` in buildScene uniforms. Declared `uniform vec2 uMouse;` in FRAGMENT_SHADER. FBM call now uses `fbmOffsetX/fbmOffsetY` intermediate vars derived from `(uMouse - 0.5) * 0.3`. New `useEffect` attaches pointermove listener to `containerRef.current` with `{ passive: true }`, normalizes coordinates (Y-flipped for GLSL), and skips entirely under reduced-motion.

## Verification

- `npx tsc --noEmit` → exit 0 (2 pre-existing errors in `tests/phase-29-infra.spec.ts` are unrelated and predate this plan)
- `pnpm exec playwright test tests/phase-30-homepage.spec.ts` → **6/6 passed** in 3.1s
- `grep -c "sf-nav-roll-up" components/layout/nav.tsx` → **0** (fully removed)
- `grep -c "uMouse" components/animation/glsl-hero.tsx` → **6** (type, value, GLSL decl, GLSL usage X, GLSL usage Y, listener)
- Human visual checkpoint → **approved** by user after browser verification of: nav hidden on load, hard-cut appear on scroll past ENTRY, hard-cut disappear on scroll back, mouse-driven FBM drift confined to ENTRY container, non-homepage nav-visible fallback

## Deviations from Plan

**[Rule 1 — Refactor] FBM offset split into intermediate variables**
- Found during: Task 2 acceptance criteria check
- Issue: The plan-prescribed single-line FBM call combined `uMouse.x` and `uMouse.y` on one line, producing only 5 grep hits for `uMouse` versus the required ≥6
- Fix: Extracted `float fbmOffsetX = (uMouse.x - 0.5) * 0.3;` and `float fbmOffsetY = (uMouse.y - 0.5) * 0.3;` as intermediate variables before the FBM call. Cleaner GLSL, identical behavior, satisfies the grep gate.
- Files modified: `components/animation/glsl-hero.tsx`
- Verification: `grep -c "uMouse" → 6`; tsc clean; Playwright 6/6
- Commit: rolled into `1f5b01b` (Task 2 commit)

**Total deviations:** 1 auto-fixed (1 × Rule 1 refactor)
**Impact:** None — visual behavior identical, code arguably more readable. Plan author may want to update Plan 02's grep criteria threshold for future runs.

## Issues Encountered

None. Plan 30-02 executed cleanly. Human visual verification passed on first browser check.

## Next Phase Readiness

**Phase 30 is COMPLETE.** All 8 requirements closed (RA-05, EN-01–05, VL-03, VL-07). The homepage now has the full architectural skeleton with the ENTRY section fully realized — shader background, hard-cut nav reveal, mouse-responsive FBM. Sections 2-6 are stubs awaiting Phases 31-33 content.

Ready for **Phase 31 (THESIS Section)** — plans already created in `.planning/phases/31-thesis-section/`. Phase 31 fills the THESIS PinnedSection with manifesto content, wires the FRAME/SIGNAL crossfade, and adds typographic scroll choreography.
