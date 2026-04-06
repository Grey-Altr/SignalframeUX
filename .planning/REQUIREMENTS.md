# REQUIREMENTS — SignalframeUX v1.0 Craft & Feedback

## FRAME — Token Foundation

- [ ] **FRM-01**: All spacing uses blessed stops only (4/8/12/16/24/32/48/64/96) — zero arbitrary values in codebase
- [ ] **FRM-02**: Semantic typography aliases implemented (`text-heading-1` through `text-body`, `text-small`) with font/weight rules
- [ ] **FRM-03**: Layout tokens defined and enforced (`--max-w-content`, `--max-w-wide`, `--max-w-full`, standard gutters)
- [ ] **FRM-04**: Every CSS custom property has a declared fallback value to prevent silent visual failures
- [ ] **FRM-05**: Color palette tiered and frozen — core 5 required, extended locked, expansion prohibited
- [ ] **FRM-06**: `--vhs-*` tokens namespaced to `--sf-vhs-*` for consistent Signal token boundary
- [ ] **FRM-07**: CVA variant prop standardized to `intent` across all SF components with `defaultVariants` on every CVA call
- [ ] **FRM-08**: Print media styles — dark backgrounds invert, Signal layer suppressed, readable on paper

## FRAME — Primitives

- [ ] **PRM-01**: SFContainer primitive enforces layout tokens (max-width, gutters, responsive behavior)
- [ ] **PRM-02**: SFSection primitive with `data-section`, `data-section-label`, consistent vertical spacing
- [ ] **PRM-03**: SFStack primitive enforcing blessed spacing stops for vertical rhythm
- [ ] **PRM-04**: SFGrid primitive with column system and responsive breakpoints
- [ ] **PRM-05**: SFText primitive enforcing semantic typography aliases
- [ ] **PRM-06**: SFButton refinement — consistent with new `intent` standard, interaction feedback tokens wired

## SIGNAL — Expression

- [ ] **SIG-01**: ScrambleText fires on every route entry for primary headings
- [ ] **SIG-02**: Asymmetric hover timing across all interactive elements (100ms in / 400ms out)
- [ ] **SIG-03**: Hard-cut section transitions replace soft fades
- [ ] **SIG-04**: Staggered grid entry animation with 40ms stagger on scroll reveal
- [ ] **SIG-05**: `[data-anim]` elements visible without JavaScript — CSS fallback ensures content never invisible if GSAP fails
- [ ] **SIG-06**: Audio feedback palette — Web Audio API synthesized tones (gesture-gated, monophonic), mapped to interaction types (click confirm, toggle, error)
- [ ] **SIG-07**: Haptic feedback via Vibration API on supported devices — mapped to press/confirm/error patterns
- [ ] **SIG-08**: Idle state animation — subtle Signal layer activity when page is inactive (grain drift, slow color pulse) that rewards lingering
- [ ] **SIG-09**: Signature cursor detail — magenta crosshair with particle trail on canvas sections
- [ ] **SIG-10**: Mobile Signal layer behavior specified — which generative elements collapse to static at mobile widths, what the static fallback looks like

## SIGNAL — Above-the-Fold

- [ ] **ATF-01**: Hero at 1440x900 is a standalone SOTD jury moment — no scroll required to evaluate quality
- [ ] **ATF-02**: Hero motion fires within 500ms of load
- [ ] **ATF-03**: Component count claim resolved honestly (show what's built accurately, "growing" label if appropriate)
- [ ] **ATF-04**: Error page (app/error.tsx) is a crafted FRAME+SIGNAL moment, not a functional fallback
- [ ] **ATF-05**: Empty states for component browser, token explorer, and API explorer designed as first-class interaction moments
- [ ] **ATF-06**: Reduced-motion experience QA'd as a standalone intentional design, not just "animations off"

## FLUENCY — DX Contract

- [ ] **DX-01**: SF component scaffolding spec documented — file structure, CVA shape, barrel export pattern, required props, data attributes
- [ ] **DX-02**: FRAME/SIGNAL import boundary explicit — `sf/` = FRAME, `animation/` = SIGNAL, data attributes bridge them
- [ ] **DX-03**: Per-component JSDoc with usage example on all SF-wrapped components
- [ ] **DX-04**: `registry.json` distribution surface for AI/CLI-driven component installation
- [ ] **DX-05**: API architecture foundation — `createSignalframeUX(config)`, `useSignalframe()` hook returning tokens/theme/motion controllers

## FLUENCY — State & Persistence

- [ ] **STP-01**: Session state persistence — component browser filters, token explorer tab, scroll position survive return visits within same session
- [ ] **STP-02**: Theme toggle during GSAP animation guarded — transition buffer prevents OKLCH/inline color conflicts

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| FRM-01 | Phase 1 — FRAME Foundation | Pending |
| FRM-02 | Phase 1 — FRAME Foundation | Pending |
| FRM-03 | Phase 1 — FRAME Foundation | Pending |
| FRM-04 | Phase 1 — FRAME Foundation | Pending |
| FRM-05 | Phase 1 — FRAME Foundation | Pending |
| FRM-06 | Phase 1 — FRAME Foundation | Pending |
| FRM-07 | Phase 1 — FRAME Foundation | Pending |
| FRM-08 | Phase 1 — FRAME Foundation | Pending |
| PRM-01 | Phase 2 — FRAME Primitives | Pending |
| PRM-02 | Phase 2 — FRAME Primitives | Pending |
| PRM-03 | Phase 2 — FRAME Primitives | Pending |
| PRM-04 | Phase 2 — FRAME Primitives | Pending |
| PRM-05 | Phase 2 — FRAME Primitives | Pending |
| PRM-06 | Phase 2 — FRAME Primitives | Pending |
| SIG-01 | Phase 3 — SIGNAL Expression | Pending |
| SIG-02 | Phase 3 — SIGNAL Expression | Pending |
| SIG-03 | Phase 3 — SIGNAL Expression | Pending |
| SIG-04 | Phase 3 — SIGNAL Expression | Pending |
| SIG-05 | Phase 3 — SIGNAL Expression | Pending |
| SIG-06 | Phase 3 — SIGNAL Expression | Pending |
| SIG-07 | Phase 3 — SIGNAL Expression | Pending |
| SIG-08 | Phase 3 — SIGNAL Expression | Pending |
| SIG-09 | Phase 3 — SIGNAL Expression | Pending |
| SIG-10 | Phase 3 — SIGNAL Expression | Pending |
| ATF-01 | Phase 4 — Above-the-Fold Lock | Pending |
| ATF-02 | Phase 4 — Above-the-Fold Lock | Pending |
| ATF-03 | Phase 4 — Above-the-Fold Lock | Pending |
| ATF-04 | Phase 4 — Above-the-Fold Lock | Pending |
| ATF-05 | Phase 4 — Above-the-Fold Lock | Pending |
| ATF-06 | Phase 4 — Above-the-Fold Lock | Pending |
| DX-01 | Phase 5 — DX Contract & State | Pending |
| DX-02 | Phase 5 — DX Contract & State | Pending |
| DX-03 | Phase 5 — DX Contract & State | Pending |
| DX-04 | Phase 5 — DX Contract & State | Pending |
| DX-05 | Phase 5 — DX Contract & State | Pending |
| STP-01 | Phase 5 — DX Contract & State | Pending |
| STP-02 | Phase 5 — DX Contract & State | Pending |

---

*Created: 2026-04-05*
*Milestone: v1.0 Craft & Feedback*
*Total requirements: 37 (31 core + 6 deferred-eligible per execution strategy)*
