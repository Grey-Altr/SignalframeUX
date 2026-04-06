# Phase 4: Above-the-Fold Lock - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Lock the above-the-fold hero at 1440x900 as a standalone SOTD jury moment. Craft error and empty states as first-class design moments. QA reduced-motion as an intentional alternative design. No new tokens or primitives — apply Phase 1+2+3 outputs to hero, error, empty, and reduced-motion experiences.

</domain>

<decisions>
## Implementation Decisions

### Hero Lock (ATF-01, ATF-02, ATF-03)
- Hero motion fires within 500ms: ScrambleText on heading + hero-mesh fade-in + single CTA pulse — three effects maximum
- Component count claim: show accurate count with "growing" label (e.g. "24 components and growing")
- Hero layout: polish only — adjust spacing/typography to blessed tokens, no structural redesign
- Performance: LCP < 1.0s, CLS = 0, GSAP must not cause content jump

### Crafted States (ATF-04, ATF-05)
- Error page (app/error.tsx): FRAME+SIGNAL moment — SFContainer/SFText for structure, ScrambleText on error code, subtle VHS glitch effect
- Not-found page (app/not-found.tsx): same FRAME+SIGNAL approach — crafted 404 with ScrambleText on "404", brief message, navigation CTA
- Empty states: component browser, token explorer, API explorer — three empty states as first-class design moments
- Empty state visual: structural placeholder using SF primitives — SFStack with muted text, subtle border animation, contextual action CTA

### Reduced Motion (ATF-06)
- Philosophy: intentional alternative design, not "animations off" — emphasis shifts to typography and spacing
- ScrambleText→instant text, stagger→instant grid, cursor→hidden, VHS→off, section-reveal→instant — all effects resolve to end state
- Hero in reduced-motion: heading visible immediately, hero-mesh static, CTA visible without pulse
- QA: manual browser QA with `prefers-reduced-motion: reduce`, document in SIGNAL-SPEC.md update

### Claude's Discretion
- Exact error page copy and messaging tone
- Empty state contextual messages per explorer
- Specific hero spacing adjustments to blessed tokens
- Reduced-motion CSS specifics beyond the stated effect changes

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/blocks/hero.tsx` — existing hero component
- `app/error.tsx` — existing error boundary
- `app/not-found.tsx` — existing 404 page
- `components/blocks/components-explorer.tsx` — has empty state logic
- Phase 2 primitives: SFContainer, SFSection, SFStack, SFGrid, SFText
- Phase 3 SIGNAL effects: ScrambleText, asymmetric hover, hard-cut, stagger, canvas cursor

### Established Patterns
- SF primitives enforce tokens by construction
- GSAP animations via page-animations.tsx
- `[data-anim]` fallback ensures content visible without JS
- VHS overlay via global-effects.tsx

### Integration Points
- `app/globals.css` — reduced-motion rules already partially exist
- `components/layout/page-animations.tsx` — hero animation orchestration
- `components/blocks/hero.tsx` — primary hero component
- `.planning/phases/03-signal-expression/SIGNAL-SPEC.md` — update with reduced-motion QA results

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond locked decisions. Follow DU/TDR aesthetic — error states should feel intentional and designed, not apologetic.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
