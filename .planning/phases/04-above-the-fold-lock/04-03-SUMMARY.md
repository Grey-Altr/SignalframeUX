---
phase: 04-above-the-fold-lock
plan: "03"
subsystem: reduced-motion-qa
tags: [reduced-motion, signal-spec, accessibility, visual-qa, documentation]
dependency_graph:
  requires: [app/globals.css, components/layout/page-animations.tsx, lib/gsap-plugins.ts]
  provides: [.planning/phases/03-signal-expression/SIGNAL-SPEC.md (Section 7)]
  affects: [app/globals.css (confirmed complete, no changes needed)]
tech_stack:
  added: []
  patterns: [two-layer-reduced-motion, css-paint-time-suppression, js-runtime-gsap-pause]
key_files:
  created: []
  modified:
    - .planning/phases/03-signal-expression/SIGNAL-SPEC.md
decisions:
  - "Reduced-motion CSS coverage confirmed complete after Task 1 audit — no new selectors needed; hero-mesh and error-code were already added in 04-01 and 04-02 respectively"
  - "Hover transitions (SIG-02) suppressed by global transition-duration: 0.01ms but state changes remain instant — intentional; hover feedback is pointer state not decorative motion"
  - "Two-layer architecture documented as authoritative pattern: CSS fires at paint-time before JS, GSAP layer handles timeline suppression at runtime — zero-gap contract"
metrics:
  duration_minutes: 15
  completed_date: "2026-04-05"
  tasks_completed: 3
  files_modified: 1
requirements: [ATF-06]
---

# Phase 04 Plan 03: Reduced-Motion QA and Documentation Summary

**One-liner:** Reduced-motion experience confirmed as first-class intentional design across all surfaces; SIGNAL-SPEC.md Section 7 documents 17 effects with two-layer suppression architecture, QA checklist, and CSS rule references.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Audit reduced-motion CSS coverage for all data-anim values | No code change — audit confirmed complete | app/globals.css (read-only) |
| 2 | Visual QA checkpoint — reduced-motion at 1440x900 | Human-verified: APPROVED | All surfaces |
| 3 | Document reduced-motion behaviors in SIGNAL-SPEC.md | 367750b | .planning/phases/03-signal-expression/SIGNAL-SPEC.md |

## What Was Built

**Task 1 — CSS coverage audit:** Ran `grep -rn "data-anim="` across all components and app files to enumerate every `[data-anim]` value in the codebase. Cross-referenced against the reduced-motion reset block in `app/globals.css`. Finding: all values were already covered. Plans 04-01 and 04-02 had added `[data-anim="hero-mesh"]` and `[data-anim="error-code"]` to the reset block respectively. The `[data-anim]` catch-all provides safety-net coverage for any unlisted values. No CSS changes required.

**Task 2 — Human-verified visual QA:** User evaluated the reduced-motion experience at 1440x900 with DevTools prefers-reduced-motion emulation. All surfaces reviewed:
- Hero: complete composition, heading visible, hero-mesh static, CTAs visible, manifesto text visible
- Not-found: 404 text immediate, no scramble, clean intentional page
- Error: error code immediate, sf-glitch suppressed, clean error state
- Overall judgment: each surface reads as deliberately designed, not stripped animations
- Result: APPROVED — all surfaces pass.

**Task 3 — SIGNAL-SPEC.md Section 7:** Added comprehensive "Reduced-Motion Behavior" section covering:
- Per-effect table documenting 17 effects across all SIGNAL layer behaviors — ScrambleText, asymmetric hover, section reveals, stagger grid, [data-anim] catch-all, canvas cursor, SIG-10 mobile, VHS overlay, sf-glitch, hero-mesh, hero heading (SplitText), color cycle, CTA buttons, tag elements, component cells, error ScrambleText, circuit dividers
- Each entry documents: normal behavior, reduced-motion state, controlling CSS/JS rule, QA status (all Verified)
- Two-layer suppression architecture section — CSS paint-time block (fires before JS) + JS runtime block (GSAP timeline pause, early return from initHeroAnimations, matchMedia guard before gsap-plugins import)
- Why-two-layers rationale documented: CSS eliminates flash of invisible content before hydration; JS handles GSAP timelines CSS cannot target
- Full QA checklist from Plan 04-03 human-verify session — 14 items, all checked

## Deviations from Plan

None — plan executed exactly as written. CSS audit confirmed complete coverage requiring no changes. Human verify returned approved on first pass. Section 7 added to SIGNAL-SPEC.md per plan specification.

## Decisions Made

- **No CSS changes required:** The reduced-motion audit found complete coverage already in place. hero-mesh and error-code selectors were added during their respective implementation plans (04-01 and 04-02). The global catch-all `[data-anim]` covers any future values not yet explicitly listed.
- **Hover transitions documented as intentional suppression:** The global `transition-duration: 0.01ms` rule does suppress all CSS transitions in reduced-motion, but this is correct behavior — state change (hover active/inactive) is instant and still visible; only the easing duration is removed. Documented explicitly in Section 7 to prevent future confusion.
- **SIGNAL-SPEC Section 7 positioned at end:** Added as Section 7 after the Key Links table, following the document's established numbering sequence. Reduces-motion section is the natural terminal section since it describes the suppression contract for all preceding effects.

## Self-Check: PASSED

SIGNAL-SPEC.md confirmed modified on disk. Commit 367750b confirmed in git log. `grep -c "Reduced-Motion" .planning/phases/03-signal-expression/SIGNAL-SPEC.md` returns 3. `grep -c "Verified" .planning/phases/03-signal-expression/SIGNAL-SPEC.md` returns 17.
