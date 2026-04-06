# Phase 21: Tech Debt Closure - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Eliminate all known instability from v1.2 and v1.3 before any v1.4 feature work begins. Four targeted fixes: MutationObserver lifecycle, NaN guards, Lenis scroll routing, duplicate ComponentsExplorer entries.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Four bugfixes with well-defined requirements (TD-01 through TD-04).

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/animation/signal-mesh.tsx` — module-level `_signalObserver: MutationObserver | null` + `readSignalVars()` function
- `components/animation/glsl-hero.tsx` — identical pattern, module-level `_signalObserver` + `readSignalVars()`
- `components/animation/token-viz.tsx` — local MutationObserver in useEffect (separate pattern)
- `hooks/use-scroll-restoration.ts` — already has `isNaN(y)` guard for scroll position
- `components/blocks/components-explorer.tsx` — TOAST duplicate entry source

### Established Patterns
- Module-level MutationObserver cache pattern in signal-mesh.tsx and glsl-hero.tsx (INT-04 from v1.2)
- `readSignalVars()` reads `--signal-intensity`, `--signal-speed`, `--signal-accent` from `:root` computed style
- `window.scrollTo` calls exist in: `use-scroll-restoration.ts`, `page-transition.tsx`, `back-to-top.tsx`, `global-effects.tsx`, `command-palette.tsx`

### Integration Points
- Lenis instance accessed via `useLenis()` hook or global reference
- ComponentsExplorer categories and grid items defined inline in the block component

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
