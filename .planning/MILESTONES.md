# Milestones

## v1.4 Feature Complete (Shipped: 2026-04-08)

**Phases completed:** 7 phases, 13 plans, 6 tasks

**Key accomplishments:**

- TD-01 — MutationObserver disconnect on unmount
- One-liner:
- Elevation absence and deferred sidebar/chart token groups documented in globals.css and SCAFFOLDING.md with explicit DU/TDR rationale and do-not-use guidance for v1.4
- lib/code-highlight.ts
- One-liner:
- One-liner:
- One-liner:
- Production build at 100.0 KB gzip shared bundle (50 KB under 150 KB gate), all lazy-load isolation verified, 15/15 Playwright tests passing.
- Accessibility (90→100):
- IBF-01 (ID/registry mismatch):

---

## v1.3 Component Expansion (Shipped: 2026-04-06)

**Phases completed:** 5 phases, 10 plans, 6 tasks

**Key accomplishments:**

- (none recorded)

---

## v1.2 Tech Debt Sweep (Shipped: 2026-04-06)

**Phases completed:** 6 phases, 9 plans, 6 tasks

**Key accomplishments:**

- (none recorded)

---

## v1.1 Generative Surface (Shipped: 2026-04-06)

**Phases completed:** 4 phases, 9 plans
**Timeline:** 6 days (2026-03-31 → 2026-04-06)
**Requirements:** 15/17 satisfied (2 partial: INT-03 zero consumers, INT-04 one-sided bridge)
**Audit:** tech_debt — 2 partial reqs + documentation tracking debt, no blockers
**Nyquist:** 0/4 phases compliant (all draft)

**Key accomplishments:**

- Singleton WebGL infrastructure: SignalCanvas renderer, useSignalScene hook, color-resolve OKLCH→sRGB bridge with TTL cache
- Multi-sensory SIGNAL activation: audio feedback (Web Audio square wave), haptic feedback (Vibration API), idle animation (8s grain drift + OKLCH ±5% lightness pulse)
- Two generative scenes: SignalMesh (IcosahedronGeometry + vertex displacement + ScrollTrigger) and TokenViz (Canvas 2D self-depicting token visualization)
- GLSL procedural hero shader with FBM 4-octave noise, geometric grid lines, and integrated Bayer 4×4 ordered dither
- SF layout primitive migration across all 5 pages (32 SFSection instances, zero raw div section wrappers)
- SignalMotion scroll-driven wrapper + SignalOverlay live parameter panel with Shift+S toggle

**Known gaps (accepted):**

- INT-03: SignalMotion built but zero consumers — component exists with no page placement
- INT-04: SignalOverlay writes CSS vars (--signal-intensity, --signal-speed, --signal-accent) but no WebGL scene reads them
- INT-01 minor: reference page missing mt-[var(--nav-height)], start NEXT_CARDS grid not SFSection-wrapped
- Documentation tracking: 14/17 SUMMARY frontmatters missing requirements_completed, 8 REQUIREMENTS.md checkboxes stale

**Archives:** `.planning/milestones/v1.1-ROADMAP.md`, `v1.1-REQUIREMENTS.md`, `v1.1-MILESTONE-AUDIT.md`

---

## v1.0 Craft & Feedback (Shipped: 2026-04-05)

**Phases completed:** 5 phases, 14 plans
**Timeline:** 6 days (2026-03-31 → 2026-04-05)
**Requirements:** 31/37 satisfied (6 formally deferred)
**Audit:** tech_debt — 12 items, no blockers
**Nyquist:** 5/5 phases compliant

**Key accomplishments:**

- Token system locked and enforced — 9 blessed spacing stops, 5 semantic typography aliases, 3 layout tokens, tiered color palette (core 5 + extended), animation durations/easings
- 6 SF primitives built (SFContainer, SFSection, SFStack, SFGrid, SFText, SFButton) enforcing tokens by construction with CVA variants and TypeScript enforcement
- SIGNAL layer authored — ScrambleText, asymmetric hover (100ms/400ms), 34ms hard-cut section reveals, 40ms stagger cascades, canvas cursor with IntersectionObserver scoping
- Above-the-fold locked — hero fast-path (sub-500ms first motion), crafted error/404 pages, 3 designed empty states, reduced-motion as first-class 16-effect alternative
- DX contract established — SCAFFOLDING.md (337 lines), JSDoc on all 28 SF components, FRAME/SIGNAL import boundary documented, deferred items with interface sketches in DX-SPEC.md

**Known gaps (accepted):**

- SIG-06/07/08: Audio, haptic, idle state — deferred with rationale
- DX-04/05: Registry, API factory — deferred with interface sketches
- STP-01: Session persistence — deferred with interface sketch
- SIG-09: [data-cursor] not placed on any section — cursor never activates (tech debt)
- PRM-02/03/04: SFSection, SFStack, SFGrid exported but zero consumers

**Archives:** `.planning/milestones/v1.0-ROADMAP.md`, `v1.0-REQUIREMENTS.md`, `v1.0-MILESTONE-AUDIT.md`

---
