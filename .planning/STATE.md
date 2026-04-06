---
pde_state_version: 1.0
milestone: v1.1
milestone_name: Generative Surface
status: active
stopped_at: ""
last_updated: "2026-04-05T00:00:00.000Z"
last_activity: "2026-04-05 — Milestone v1.1 started"
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
---

# STATE — SignalframeUX

## Quick Reference

| Property | Value |
|----------|-------|
| Project | SignalframeUX — Product Design Engineer Portfolio |
| Core Value | Portfolio showcasing design engineering craft, built on custom design system |
| Current Focus | Defining requirements |
| Milestone | v1.1 Generative Surface |

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-04-05 — Milestone v1.1 started

## Progress

```
Phase 1 — FRAME Foundation:    [██████████] 100% (3/3 plans) COMPLETE
Phase 2 — FRAME Primitives:    [██████████] 100% (2/2 plans) COMPLETE
Phase 3 — SIGNAL Expression:   [██████████] 100% (4/4 plans) COMPLETE
Phase 4 — Above-the-Fold Lock: [██████████] 100% (3/3 plans) COMPLETE
Phase 5 — DX Contract & State: [██████████] 100% (2/2 plans) COMPLETE

Overall:   [██████████] 100% (15/15 plans) MILESTONE COMPLETE
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
- Plan 05-02: Full JSDoc block on primary export of each compound component; one-liner on all sub-exports — avoids noise without sacrificing discoverability
- Plan 05-02: Pattern A (Radix wrapper) JSDoc placed above export function; Pattern B/C (forwardRef const) JSDoc placed above const declaration — TypeScript LS surfaces both correctly
- Plan 05-01: STP-02 guard skips setProperty if sf-no-transition class is present — prevents color cycle from overwriting theme primary during ~150ms wipe window; mount-time init intentionally unguarded
- Plan 05-01: GSAP color mutation audit confirmed zero matches — GSAP only animates opacity and transform in all animation/ files; setProperty is the only color mutation surface
- Plan 05-01: DX-SPEC.md interface sketches are shape-only with open questions — deferred items (DX-04, DX-05, STP-01) documented without locked decisions per pitfall 4 from RESEARCH.md
- Plan 04-03: Reduced-motion CSS audit confirmed complete — no gaps found; hero-mesh and error-code were already added in 04-01 and 04-02; [data-anim] catch-all covers any future unlisted values
- Plan 04-03: Hover transitions (SIG-02) suppressed by global transition-duration: 0.01ms but state changes remain instant — intentional; hover feedback is pointer state not decorative motion
- Plan 04-03: Two-layer architecture documented as authoritative pattern — CSS fires at paint-time before JS, GSAP layer handles timeline suppression at runtime
- Plan 04-02: ScrambleText guard pattern — matchMedia check before async gsap-plugins import prevents code fetch on reduced-motion devices entirely
- Plan 04-02: not-found.tsx Server Component uses data-anim="page-heading" — reuses existing initPageHeadingScramble without a new client boundary
- Plan 04-02: ComponentsExplorer reset clears both searchInput and searchQuery — debounced search has two state vars; must clear both to avoid stale filter state
- Plan 04-02: token-tabs placeholder uses SFButton ghost — matches existing toggle pattern, avoids inconsistency with raw button
- Plan 03-01: [data-anim] catch-all after specific rules — CSS attribute presence selector ([data-anim]) has lower specificity than value selectors ([data-anim="section-reveal"]), guaranteeing GSAP-animated elements still start hidden
- Plan 03-01: Asymmetric hover: base state 400ms (return), :hover override 100ms (snap-in) — CSS transition-duration on :hover overrides base; base duration governs the release, hover duration governs the snap
- Plan 03-01: sf-hoverable:not(:hover) removed — redundant once base state is --duration-slow; simpler CSS with same behavior
- Plan 03-01: Section-reveal hard cut at 34ms / ease:none — DU aesthetic signature; snap reveals not fade-ins
- Plan 03-02: Canvas zIndex as "var(--z-cursor, 9999)" requires "as unknown as number" cast — React CSSProperties types z-index as number only
- Plan 03-02: OKLCH→RGB resolved via probe 1x1 canvas (fillStyle + getImageData) — correct approach for canvas draw calls, handles any browser-parseable CSS value
- Plan 03-03: ScrollTrigger start: "top bottom" for headings — fires immediately for above-fold elements; wires scroll-based reveal for below-fold headings. Per-element ScrollTrigger.create (not batch) because each heading needs its own once: true independent state
- Plan 03-03: stagger interval and stagger delay both set to 0.04 (40ms) — grouping window and per-item delay matched for clean cascade without bunching
- Plan 03-04: SIGNAL-SPEC.md mobile collapse uses pointer:coarse (not viewport-width) — targets touch devices correctly regardless of screen size; this is the right signal for "no precise cursor" behavior
- Plan 03-04: SIG-06/07/08 deferred with explicit implementation barriers — Web Audio API gesture-gating complexity, Vibration API limited Safari support, IdleOverlay visual QA deferral — documented to prevent future rediscovery
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
- None — pre-existing TypeScript errors in color-cycle-frame.tsx and dark-mode-toggle.tsx fixed during Plan 04-02 build verification.

## Roadmap

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 1 — FRAME Foundation | Token system locked and enforced | FRM-01–08 (8 reqs) | COMPLETE — 3/3 plans |
| 2 — FRAME Primitives | Six SF primitives enforce token system | PRM-01–06 (6 reqs) | COMPLETE — 2/2 plans |
| 3 — SIGNAL Expression | Full SIGNAL layer authored and progressively enhanced | SIG-01–10 (10 reqs) | COMPLETE — 4/4 plans |
| 4 — Above-the-Fold Lock | Hero wins without scroll, states crafted, reduced-motion QA'd | ATF-01–06 (6 reqs) | COMPLETE — 3/3 plans |
| 5 — DX Contract & State | Scaffolding spec, JSDoc, boundary, API, session state | DX-01–05, STP-01–02 (7 reqs) | COMPLETE — 2/2 plans |

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-05)

**Core value:** Dual-layer FRAME/SIGNAL model — deterministic structure + generative expression
**Current focus:** Planning next milestone

## Session Continuity

Last session: 2026-04-05
Stopped at: Milestone v1.0 Craft & Feedback completed and archived. Audit: tech_debt (12 items, 0 blockers). All 31/37 active requirements satisfied.
Resume file: .planning/MILESTONES.md
