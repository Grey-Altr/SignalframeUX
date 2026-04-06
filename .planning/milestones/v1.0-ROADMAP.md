# ROADMAP — SignalframeUX v1.0 Craft & Feedback

## Milestone

**v1.0 Craft & Feedback** — Stabilize the FRAME foundation, amplify SIGNAL craft to SOTD level, and make the DX so fluent that AI agents produce award-quality output without friction.

**Pillars:** Foundation · Feeling · Fluency

---

## Phases

- [x] **Phase 1: FRAME Foundation** — Lock tokens, enforce spacing, define typography aliases, layout tokens, color tiers, and variant standards across the system (COMPLETE — 3/3 plans)
- [x] **Phase 2: FRAME Primitives** — Build the six SF primitives (Container, Section, Stack, Grid, Text, Button) that enforce the locked token system (COMPLETE — 2/2 plans)
- [x] **Phase 3: SIGNAL Expression** — Author the full SIGNAL layer: scramble, asymmetric hover, hard-cut transitions, scroll choreography, cursor detail, mobile fallbacks, and progressive enhancement guarantees (COMPLETE — 4/4 plans)
- [x] **Phase 4: Above-the-Fold Lock** — Seal the 90-second jury moment at 1440px, resolve component count claim, craft error and empty states as first-class design moments, and QA reduced-motion as a standalone experience (COMPLETE — 3/3 plans)
- [x] **Phase 5: DX Contract & State** — Finalize scaffolding spec, JSDoc contract, FRAME/SIGNAL import boundary, API foundation, and session state persistence (COMPLETE — 2/2 plans)

---

## Phase Details

### Phase 1: FRAME Foundation
**Goal**: The token system is locked, enforced, and conflict-free — every spacing, typography, layout, color, and variant decision has exactly one valid answer
**Depends on**: Nothing (first phase)
**Requirements**: FRM-01, FRM-02, FRM-03, FRM-04, FRM-05, FRM-06, FRM-07, FRM-08
**Success Criteria** (what must be TRUE):
  1. A developer can grep the entire codebase for Tailwind spacing utilities and find zero values outside the blessed set (4/8/12/16/24/32/48/64/96)
  2. A developer can apply `text-heading-1` through `text-small` semantic aliases in any component without consulting a spec document
  3. Any SF component with a missing CSS custom property renders with a declared fallback — no silent blank or invisible elements
  4. The color palette has a defined tier boundary: core 5 tokens in one list, extended tokens in a second list, and no mechanism to add to either without a deliberate system change
  5. Every CVA call in `sf/` uses `intent` as the variant prop name and has `defaultVariants` declared
**Plans:** 3 plans
Plans:
- [x] 01-01-PLAN.md — Token definitions: semantic typography aliases, layout tokens, color tiers, VHS namespace
- [x] 01-02-PLAN.md — Component sweep: blessed spacing enforcement + CVA compliance audit
- [x] 01-03-PLAN.md — CSS fallbacks on critical var() calls + print stylesheet

### Phase 2: FRAME Primitives
**Goal**: Six SF primitives exist that enforce Phase 1 tokens by construction — using them correctly is easier than deviating from them
**Depends on**: Phase 1
**Requirements**: PRM-01, PRM-02, PRM-03, PRM-04, PRM-05, PRM-06
**Success Criteria** (what must be TRUE):
  1. A developer can build a page section using only SFContainer, SFSection, SFStack, SFGrid, SFText, and SFButton without reaching outside the SF layer for layout or typography
  2. SFContainer renders at the correct max-width token, applies standard gutters, and responds correctly at all Tailwind v4 breakpoints without prop configuration
  3. SFSection applies `data-section` and `data-section-label` data attributes automatically and uses consistent vertical spacing from blessed stops
  4. SFText renders using semantic typography aliases and rejects (via TypeScript types) any typography value outside the defined scale
**Plans:** 2 plans
Plans:
- [x] 02-01-PLAN.md — SFContainer + SFSection + SFStack layout primitives and barrel export
- [x] 02-02-PLAN.md — SFGrid + SFText primitives and SFButton PRM-06 audit

### Phase 3: SIGNAL Expression
**Goal**: The SIGNAL layer is fully authored, specced, and progressively enhanced — every effect has a timing spec, a CSS fallback, and a mobile behavior definition
**Depends on**: Phase 2
**Requirements**: SIG-01, SIG-02, SIG-03, SIG-04, SIG-05, SIG-06, SIG-07, SIG-08, SIG-09, SIG-10
**Success Criteria** (what must be TRUE):
  1. On every route entry, primary headings fire ScrambleText with the correct character set, duration, and easing — measurable against a written spec
  2. Every interactive element in the system responds with 100ms transition in and 400ms transition out — verifiable by recording at 0.25x speed
  3. A user with JavaScript disabled sees all `[data-anim]` elements fully visible and readable, with no invisible or zero-opacity content
  4. The magenta crosshair cursor detail appears on canvas sections and is visually distinguishable from the system cursor at 1440px viewport width
  5. Mobile behavior for all generative SIGNAL elements is explicitly specced and implemented: either a defined static fallback is visible, or the element is suppressed with a documented rationale
**Plans:** 4 plans
Plans:
- [x] 03-01-PLAN.md — CSS fallback catch-all, asymmetric hover timing, hard-cut section transitions
- [x] 03-02-PLAN.md — Canvas cursor with crosshair and particle trail on [data-cursor] sections
- [x] 03-03-PLAN.md — ScrambleText ScrollTrigger wiring + staggered grid entry batch
- [x] 03-04-PLAN.md — SIGNAL-SPEC.md specification document + deferred SIG-06/07/08 documentation

### Phase 4: Above-the-Fold Lock
**Goal**: The hero at 1440x900 is a standalone SOTD jury moment requiring no scroll, error and empty states are crafted design moments, and the reduced-motion experience is a first-class alternative
**Depends on**: Phase 3
**Requirements**: ATF-01, ATF-02, ATF-03, ATF-04, ATF-05, ATF-06
**Success Criteria** (what must be TRUE):
  1. A screenshot of the hero at 1440x900 passes a binary comparison against Darknode/Shift 5 reference quality — sharp, controlled, no generic dark SaaS markers
  2. Hero motion begins within 500ms of page load on a cold 4G connection, measurable in DevTools performance trace
  3. The component count displayed on the hero matches the actual number of built components, with "growing" label if the count is partial
  4. The error page (app/error.tsx) uses FRAME layout primitives and SIGNAL expression — it is visually distinct from a browser default error and consistent with the design system's visual language
  5. Reduced-motion mode presents a complete, intentional layout experience with no empty regions, invisible elements, or layout collapse where animations would have been
**Plans:** 3 plans
Plans:
- [x] 04-01-PLAN.md — Hero animation fast-path (sub-500ms first motion), component count fix, hero spacing polish
- [x] 04-02-PLAN.md — Crafted error/not-found pages (FRAME+SIGNAL) + ComponentsExplorer empty state
- [x] 04-03-PLAN.md — Reduced-motion QA audit, CSS coverage verification, SIGNAL-SPEC.md documentation

### Phase 5: DX Contract & State
**Goal**: The developer experience is fully contractual — scaffolding spec, JSDoc coverage, import boundary, and theme toggle guard are defined and documented; deferred items (registry, API, session state) have interface sketches for post-v1.0
**Depends on**: Phase 2 (can run parallel to Phases 3-4)
**Requirements**: DX-01, DX-02, DX-03, DX-04, DX-05, STP-01, STP-02
**Success Criteria** (what must be TRUE):
  1. A developer (or AI agent) can scaffold a new SF component to spec — correct file location, CVA shape, barrel export, required props, and data attributes — using only the documented scaffolding spec without asking clarifying questions
  2. The FRAME/SIGNAL import boundary is documented and enforced: `sf/` imports are FRAME-only, `animation/` imports are SIGNAL-only, and the data attribute bridge pattern is demonstrated with a working example
  3. Every SF-wrapped component in `sf/` has a JSDoc block with at minimum one usage example that renders correctly
  4. Activating the theme toggle during an active GSAP animation does not produce OKLCH color conflicts or inline style collisions — verified by toggling during a ScrambleText sequence
**Plans:** 2 plans
Plans:
- [x] 05-01-PLAN.md — SCAFFOLDING.md + DX-SPEC.md deferred sketches + STP-02 theme toggle GSAP audit
- [x] 05-02-PLAN.md — JSDoc sweep on all 28 SF-wrapped components

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. FRAME Foundation | 3/3 | Complete | 2026-04-06 |
| 2. FRAME Primitives | 2/2 | Complete | 2026-04-06 |
| 3. SIGNAL Expression | 4/4 | Complete | 2026-04-06 |
| 4. Above-the-Fold Lock | 3/3 | Complete | 2026-04-05 |
| 5. DX Contract & State | 2/2 | Complete | 2026-04-06 |

---

## Coverage Map

| Requirement | Phase |
|-------------|-------|
| FRM-01 | Phase 1 |
| FRM-02 | Phase 1 |
| FRM-03 | Phase 1 |
| FRM-04 | Phase 1 |
| FRM-05 | Phase 1 |
| FRM-06 | Phase 1 |
| FRM-07 | Phase 1 |
| FRM-08 | Phase 1 |
| PRM-01 | Phase 2 |
| PRM-02 | Phase 2 |
| PRM-03 | Phase 2 |
| PRM-04 | Phase 2 |
| PRM-05 | Phase 2 |
| PRM-06 | Phase 2 |
| SIG-01 | Phase 3 |
| SIG-02 | Phase 3 |
| SIG-03 | Phase 3 |
| SIG-04 | Phase 3 |
| SIG-05 | Phase 3 |
| SIG-06 | Phase 3 |
| SIG-07 | Phase 3 |
| SIG-08 | Phase 3 |
| SIG-09 | Phase 3 |
| SIG-10 | Phase 3 |
| ATF-01 | Phase 4 |
| ATF-02 | Phase 4 |
| ATF-03 | Phase 4 |
| ATF-04 | Phase 4 |
| ATF-05 | Phase 4 |
| ATF-06 | Phase 4 |
| DX-01 | Phase 5 |
| DX-02 | Phase 5 |
| DX-03 | Phase 5 |
| DX-04 | Phase 5 |
| DX-05 | Phase 5 |
| STP-01 | Phase 5 |
| STP-02 | Phase 5 |

**Coverage: 37/37 requirements mapped**

---

*Created: 2026-04-05*
*Milestone: v1.0 Craft & Feedback*
*Granularity: Standard (5 phases)*
