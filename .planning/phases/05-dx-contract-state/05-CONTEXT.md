# Phase 5: DX Contract & State - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Define and enforce the developer experience contract: scaffolding spec, JSDoc coverage on all SF components, FRAME/SIGNAL import boundary documentation, and theme toggle GSAP guard. Document deferred items (registry.json, API foundation, session state) with interface sketches for post-v1.0. No new components or tokens.

</domain>

<decisions>
## Implementation Decisions

### Scaffolding & JSDoc (DX-01, DX-02, DX-03)
- Scaffolding spec as `docs/SCAFFOLDING.md` — file structure, CVA shape, barrel export pattern, required props, data attributes
- JSDoc on all SF-wrapped components — one JSDoc block per exported function with usage example
- Import boundary documented in SCAFFOLDING.md: `sf/` = FRAME, `animation/` = SIGNAL, data attributes bridge them. No runtime enforcement.

### Deferred Items (DX-04, DX-05, STP-01)
- DX-04 (registry.json): defer to post-v1.0
- DX-05 (API foundation — createSignalframeUX/useSignalframe): defer to post-v1.0
- STP-01 (session state persistence): defer to post-v1.0
- All deferred items documented in DX-SPEC.md with interface sketches for future implementation

### Theme Toggle Guard (STP-02)
- Transition buffer: `sf-no-transition` class applied during toggle, removed after 2 rAF ticks (existing pattern in lib/theme.ts)
- Audit and fix OKLCH/inline color conflicts between GSAP inline styles and theme CSS variable changes

### Claude's Discretion
- JSDoc copy and usage example specifics
- SCAFFOLDING.md structure and section organization
- DX-SPEC.md interface sketch detail level
- Specific GSAP properties that need theme toggle guards

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/theme.ts` — existing theme toggle with `sf-no-transition` pattern
- 29 SF-wrapped components in `components/sf/` (24 original + 5 new primitives)
- `components/sf/index.ts` — barrel export with Layout Primitives section
- All Phase 1-4 work: tokens, primitives, SIGNAL effects, crafted states

### Established Patterns
- CVA + cn() + forwardRef + barrel export (canonical SF pattern)
- `[data-anim]` bridging FRAME and SIGNAL layers
- Motion tokens in globals.css
- `sf-no-transition` class for hard theme cuts

### Integration Points
- `components/sf/*.tsx` — JSDoc target files
- `lib/theme.ts` — theme toggle guard
- `docs/` — new docs directory for SCAFFOLDING.md
- `.planning/` — DX-SPEC.md for deferred item documentation

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond locked decisions. DX documentation should be practical and action-oriented — not academic.

</specifics>

<deferred>
## Deferred Ideas

- DX-04: registry.json distribution surface — post-v1.0
- DX-05: createSignalframeUX(config) + useSignalframe() hook — post-v1.0
- STP-01: Session state persistence (filters, scroll, tabs) — post-v1.0

</deferred>
