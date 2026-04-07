---
phase: 21-tech-debt-closure
generated: "2026-04-06T00:00:00Z"
finding_count: 4
high_count: 1
has_bdd_candidates: true
---

# Phase 21: Edge Cases

**Generated:** 2026-04-06
**Findings:** 4 (cap: 8)
**HIGH severity:** 1
**BDD candidates:** yes

## Findings

### 1. [HIGH] LenisProvider context re-render triggers consumer cascade on every scroll

**Plan element:** `components/layout/lenis-provider.tsx`
**Category:** boundary_condition

The plan adds `useState<Lenis | null>` to LenisProvider. When `setLenis(instance)` is called, the context value changes, triggering re-renders in all 5 consumer components. This is a one-time cost on mount/unmount (not per-scroll). However, if `motionHandler` fires (reduced-motion toggle at runtime), `setLenis(null)` triggers a second cascade. The plan handles this correctly since state only changes on Lenis create/destroy, not on scroll events. This is acceptable but worth noting -- the Lenis instance reference is stable.

**BDD Acceptance Criteria Candidate:**
```
Given LenisProvider is mounted and Lenis instance is created
When the user toggles prefers-reduced-motion on at runtime
Then all 5 consumer components receive null from useLenisInstance and fall back to window.scrollTo without throwing
```

### 2. [MEDIUM] page-transition.tsx lenisRef.current may be null during transitionend

**Plan element:** `components/animation/page-transition.tsx`
**Category:** error_path

The plan correctly identifies that page-transition.tsx calls scrollTo inside a `transitionend` DOM event handler and stores the Lenis instance in a ref. However, if the Lenis provider unmounts or reduced-motion activates between the transition start and the transitionend event firing, `lenisRef.current` will be null. The plan's fallback pattern (`if (lenisRef.current) ... else window.scrollTo`) handles this correctly. No gap.

### 3. [MEDIUM] readSignalVars fallback values may not match current CSS defaults

**Plan element:** `readSignalVars()`
**Category:** boundary_condition

The plan hardcodes fallback values: intensity=0.5, speed=1, accent=0. If the CSS custom properties in globals.css are changed to different defaults in a future phase, the hardcoded fallbacks in the TypeScript code will diverge. This is pre-existing tech debt (the current `|| "0.5"` pattern has the same issue) and not introduced by this plan, but the isNaN guard makes the fallback path more likely to be exercised.

### 4. [LOW] grep verification for TD-03 will show false positives from fallback branches

**Plan element:** `hooks/use-scroll-restoration.ts`
**Category:** boundary_condition

The ROADMAP success criterion says "grep -r 'window.scrollTo' returns zero results" but the plan intentionally keeps `window.scrollTo` in else-branch fallbacks for reduced-motion. Plan 02's action text acknowledges this tension and resolves it correctly: the intent is that no PRIMARY scroll path uses window.scrollTo. The verification commands in the plan account for this by checking that matches are only in fallback branches.
