# Phase 18: P1 Animated Components - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Three SIGNAL-eligible P1 components are live — SFAccordion with GSAP stagger, SFToast/SFToaster with Sonner integration and GSAP slide entrance, SFProgress with GSAP fill tween. All degrade gracefully under prefers-reduced-motion. Bundle stays under 150KB initial.

</domain>

<decisions>
## Implementation Decisions

### Animation Timing
- Accordion stagger: 50ms delay per child element, reverse stagger on close
- Progress fill: `--duration-normal` (200ms) tween with `--ease-default`
- Toast slide: GSAP-driven slide (not CSS transition) for consistency with system animation tokens
- All animations guarded by `prefers-reduced-motion` check BEFORE creating tween

### Toast Design
- Minimal bar aesthetic: sharp-edged, 2px border, monospace text, foreground/background tokens
- Icon left, dismiss X right, no shadow, zero border-radius
- Positioned bottom-left with `--z-toast: 100` to avoid SignalOverlay at bottom-right
- Uses Sonner as the toast engine

### Component Patterns
- SFAccordion: Pattern A (Radix-wrapped), `'use client'` for GSAP
- SFToast/SFToaster: Pattern A (Sonner-wrapped), `'use client'` for GSAP slide
- SFProgress: Pattern A (Radix-wrapped), `'use client'` for GSAP tween

### Claude's Discretion
- GSAP import strategy (tree-shaking approach)
- Sonner theme customization implementation details
- Accordion content stagger target selector

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- GSAP 3.12 already in project with ScrollTrigger
- Accordion base installed in Phase 16 (`components/ui/accordion.tsx`)
- Progress base installed in Phase 16 (`components/ui/progress.tsx`)
- Animation tokens: `--duration-instant` through `--duration-glacial`, `--ease-default`, `--ease-hover`, `--ease-spring`
- SFStatusDot (Phase 17) has reference GSAP pulse implementation with reduced-motion guard

### Established Patterns
- GSAP usage: `useRef` + `useEffect` cleanup pattern, `gsap.context()` for scope
- Reduced-motion guard: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` check before tween
- CVA with `intent` for visual variants

### Integration Points
- sf/index.ts barrel export under Feedback category
- registry.json with meta.layer: "signal", meta.pattern: "A"
- ComponentsExplorer entries under Feedback category

</code_context>

<specifics>
## Specific Ideas

- Toast should feel like a system notification, not a friendly popup — monospace, terse, sharp
- Accordion stagger should feel mechanical/precise, not bouncy — use ease-default, not spring
- Progress fill should feel like a data visualization, not a loading bar

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
