---
pde_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
stopped_at: Completed Phase 3 Plan 03-02 — CanvasCursor canvas crosshair + particle trail wired into GlobalEffects.
last_updated: "2026-04-06T03:52:00Z"
last_activity: "2026-04-06 — Plan 03-02 executed: CanvasCursor (canvas crosshair + particle trail) created and wired into GlobalEffects"
progress:
  total_phases: 5
  completed_phases: 2
  total_plans: 7
  completed_plans: 7
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Product Design Engineer Portfolio |
| Core Value | Portfolio showcasing design engineering craft, built on custom design system |
| Current Focus | v1.0 Craft & Feedback — Foundation + Feeling + Fluency |
| Milestone | v1.0 Craft & Feedback |

## Current Position

Phase: Phase 3 — SIGNAL Expression (in progress)
Plan: 03-02 (complete) — CanvasCursor canvas crosshair + particle trail; [data-cursor] IntersectionObserver scoping; GlobalEffects wired
Status: Phase 3 underway — 2/4 plans complete
Last activity: 2026-04-06 — Plan 03-02 executed: CanvasCursor created and wired into GlobalEffects

## Progress

```
Phase 1 — FRAME Foundation:    [██████████] 100% (3/3 plans) COMPLETE
Phase 2 — FRAME Primitives:    [██████████] 100% (2/2 plans) COMPLETE
Phase 3 — SIGNAL Expression:   [████░░░░░░]  50% (2/4 plans)
Phase 4 — Above-the-Fold Lock: [░░░░░░░░░░]   0%
Phase 5 — DX Contract & State: [░░░░░░░░░░]   0%

Overall:   [████░░░░░░]  50% (7/14 plans)
```

## Accumulated Context

### From Pre-Milestone Work
- Design pipeline COMPLETE (13/13 artifacts)
- 7 implementation sessions (dark mode, GSAP, nav, shadcn, VHS, cursor, critique remediation)
- CRT critique trajectory: v3→v12, 66→93/100 (A-)
- All hardcoded oklch → var(--color-primary) tokens
- Zero styled-jsx — all CSS in globals.css with motion tokens
- GSAP bundle split (gsap-core.ts lightweight vs gsap-plugins.ts full)
- GlobalEffects lazy-loaded via next/dynamic
- Monolithic GSAP bundle refactor DEFERRED per user request
- Dual-layer model corrected: FRAME=structure, SIGNAL=expression

### Decisions
- Plan 03-01: [data-anim] catch-all after specific rules — CSS attribute presence selector ([data-anim]) has lower specificity than value selectors ([data-anim="section-reveal"]), guaranteeing GSAP-animated elements still start hidden
- Plan 03-01: Asymmetric hover: base state 400ms (return), :hover override 100ms (snap-in) — CSS transition-duration on :hover overrides base; base duration governs the release, hover duration governs the snap
- Plan 03-01: sf-hoverable:not(:hover) removed — redundant once base state is --duration-slow; simpler CSS with same behavior
- Plan 03-01: Section-reveal hard cut at 34ms / ease:none — DU aesthetic signature; snap reveals not fade-ins
- Plan 03-02: Canvas zIndex as "var(--z-cursor, 9999)" requires "as unknown as number" cast — React CSSProperties types z-index as number only
- Plan 03-02: OKLCH→RGB resolved via probe 1x1 canvas (fillStyle + getImageData) — correct approach for canvas draw calls, handles any browser-parseable CSS value
- Plan 03-02: CustomCursor function preserved in global-effects.tsx — not exported, tree-shaken at build; rollback capability maintained
- Plan 02-02: SFGrid uses numeric string keys ("3") for CVA variants — allows Tailwind class strings as values without ambiguity
- Plan 02-02: SFText uses plain Record maps not CVA — single variant dimension, CVA adds no value
- Plan 02-02: Polymorphic ref cast uses React.Ref<any> — TypeScript cannot narrow across element union without it (accepted RESEARCH.md Pitfall 1)
- Plan 02-02: SFButton PRM-06 audit — no code changes; transition-colors (color props) and .sf-pressable (transform) are separate CSS properties, no conflict
- Plan 02-01: SFSection uses typed prop-based spacing (no CVA) — simpler API for a single-dimension spacing variant
- Plan 02-01: SFStack align variant included (stretch default) — plan listed as Claude's discretion; adds flex alignment control with zero API complexity cost
- Plan 02-01: data-bg-shift uses presence-only boolean pattern — value="" when true, undefined when false, consistent with data-section-label omission pattern
- Plan 01-03: Motion tokens (--duration-*, --ease-*) intentionally exempt from CSS fallbacks — decorative properties, no silent visual failure risk
- Plan 01-03: CSS fallback only applied to active rule consumers, not :root declarations or commented-out code
- Plan 01-03: Print position: static scoped to nav/fixed/sticky only — blanket * would break flex/grid layout structure
- Plan 01-02: p-5 px-6 → p-6 px-6: when p-5 is followed by axis override, p-5 is still non-blessed; drop redundant override
- Plan 01-02: signal intent in sf-button.tsx kept as pre-standard extension, documented via comment rather than removed
- Plan 01-01: Spacing tokens placed in :root (not @theme) — avoids Tailwind utility class generation
- Plan 01-01: Semantic typography defined as both @layer utilities AND :root custom properties for JS/inline access
- Plan 01-01: VHS CSS custom properties renamed to --sf-vhs-* namespace; class names (.vhs-overlay etc.) unchanged
- Awwwards target upgraded from Honorable Mention to SOTD
- Three-pillar milestone: Foundation, Feeling, Fluency
- AI DX is a first-class requirement — "as easy as feeling"
- Phase order locked: FRAME tokens → FRAME primitives → SIGNAL → ATF → DX (tokens before primitives, FRAME before SIGNAL)
- DX Contract (Phase 5) can run parallel to Phases 3–4 if capacity allows
- Execution budget: 40% to FRAME (Phase 1+2, strict), 60% to SIGNAL+ATF (Phase 3+4, iteration budget)
- SIG-06 (audio), SIG-07 (haptic), SIG-08 (idle), SIG-09 (cursor), DX-04 (registry), DX-05 (API), STP-01, STP-02 (state) — all formally in scope for v1.0 per requirements, but execution strategy marks SIG-06/07/08, DX-04/05, STP-01 as deferred unless time permits. SIG-09 and STP-02 ARE in sprint scope.

### Blockers
- Pre-existing TypeScript error in components/animation/color-cycle-frame.tsx (useRef missing argument) blocks `npx next build` — CSS compilation passes, TS check fails. Deferred to plan 01-02 investigation.

## Roadmap

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 — FRAME Foundation | Token system locked and enforced | FRM-01–08 (8 reqs) | COMPLETE — 3/3 plans |
| 2 — FRAME Primitives | Six SF primitives enforce token system | PRM-01–06 (6 reqs) | COMPLETE — 2/2 plans |
| 3 — SIGNAL Expression | Full SIGNAL layer authored and progressively enhanced | SIG-01–10 (10 reqs) | In progress — 2/4 plans |
| 4 — Above-the-Fold Lock | Hero wins without scroll, states crafted, reduced-motion QA'd | ATF-01–06 (6 reqs) | Not started |
| 5 — DX Contract & State | Scaffolding spec, JSDoc, boundary, API, session state | DX-01–05, STP-01–02 (7 reqs) | Not started |

## Session Continuity

Last session: 2026-04-06
Stopped at: Completed Phase 3 Plan 03-01 — CSS fallback catch-all, asymmetric hover timing, hard-cut section transitions. Next: 03-02.
Resume file: .planning/phases/03-signal-expression/03-02-PLAN.md
