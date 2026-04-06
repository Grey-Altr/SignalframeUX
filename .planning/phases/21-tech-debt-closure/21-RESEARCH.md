# Phase 21: Tech Debt Closure - Research

**Researched:** 2026-04-06
**Domain:** WebGL lifecycle, Lenis scroll integration, CSS var parsing, component registry data
**Confidence:** HIGH

## Summary

Phase 21 addresses four discrete, well-scoped bugs carried from v1.2/v1.3. All four are fully diagnosed with exact file locations, line numbers, and root causes identified through code inspection. No external library research was needed beyond confirming that Lenis ships `lenis/react` with a built-in `useLenis()` hook and `ReactLenis` provider component -- this eliminates the need to hand-roll a React Context for TD-03.

The fixes are independent of each other and can be parallelized into a single wave. Each has a binary verification: observer disconnect present (TD-01), isNaN guard present (TD-02), grep returns zero window.scrollTo matches (TD-03), TOAST entries have distinct display names (TD-04).

**Primary recommendation:** Execute all four fixes in one wave. TD-03 is the largest change (5 files + provider refactor); TD-01, TD-02, TD-04 are surgical edits.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None -- all implementation choices are at Claude's discretion per CONTEXT.md.

### Claude's Discretion
All implementation choices are at Claude's discretion -- pure infrastructure phase. Four bugfixes with well-defined requirements (TD-01 through TD-04).

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| TD-01 | MutationObserver in signal-mesh.tsx and glsl-hero.tsx disconnects on unmount | Module-level `_signalObserver` pattern identified in both files; `useGSAP` cleanup return is the correct location for disconnect + null reset |
| TD-02 | readSignalVars has explicit isNaN() guard in both WebGL scenes | Current `parseFloat(value \|\| fallback)` pattern identified; fails on unit-suffixed values like "0.5px" which parseFloat parses as 0.5 but should be caught |
| TD-03 | Programmatic scroll routes through lenis.scrollTo (not window.scrollTo) | 5 files with window.scrollTo identified; `lenis/react` ships ReactLenis + useLenis() hook -- provider refactor enables access |
| TD-04 | Duplicate TOAST entries in ComponentsExplorer resolved (unique names/indices) | Two entries both named "TOAST" at indices 010 (FRAME) and 022 (SIGNAL); need distinct display names |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lenis | ^1.1.20 | Smooth scroll | Already installed; ships `lenis/react` with ReactLenis + useLenis() |
| lenis/react | (bundled) | React provider + hook | Built-in context provider eliminates custom context code |
| gsap | 3.12 | Animation | Already installed; ticker integration with Lenis must be preserved |

### Supporting
No new dependencies needed. All fixes use existing libraries.

## Architecture Patterns

### TD-01: MutationObserver Disconnect Pattern

**Current problem:** Both `signal-mesh.tsx` and `glsl-hero.tsx` use a module-level `_signalObserver: MutationObserver | null` that is created by `ensureSignalObserver()` but never disconnected. The `useGSAP` cleanup only removes the GSAP ticker -- it does not disconnect the observer or null-reset the reference.

**Root cause:** `ensureSignalObserver()` guards against creating a second observer (`if (_signalObserver) return`), but since the module-level variable persists across component mount/unmount cycles, the observer accumulates style-attribute mutation callbacks pointing at stale closures. With detail views increasing mount/unmount frequency in Phase 25, this becomes a real performance issue.

**Fix pattern:**
```typescript
// Inside useGSAP cleanup return (both files):
return () => {
  gsap.ticker.remove(tickerFn);
  // TD-01: disconnect MutationObserver on unmount
  if (_signalObserver) {
    _signalObserver.disconnect();
    _signalObserver = null;
  }
};
```

**Files:** `components/animation/signal-mesh.tsx` (line ~322-324), `components/animation/glsl-hero.tsx` (line ~332-334)

**Note:** token-viz.tsx uses a LOCAL MutationObserver inside useEffect with proper `disconnect()` in cleanup (line 240-241). It is NOT affected by TD-01.

### TD-02: readSignalVars isNaN Guard Pattern

**Current problem:** `readSignalVars()` in both files uses:
```typescript
_signalIntensity = parseFloat(style.getPropertyValue("--signal-intensity") || "0.5");
```

`parseFloat("0.5px")` returns `0.5` (not NaN) -- so the current pattern actually handles unit-suffixed strings that start with a number. However, `parseFloat("")` returns `NaN`, and `parseFloat("auto")` returns `NaN`. The `|| "0.5"` fallback handles empty string but NOT the case where `getPropertyValue` returns a non-empty non-numeric string.

**Fix pattern:**
```typescript
function readSignalVars(): void {
  const style = getComputedStyle(document.documentElement);
  const raw = (name: string, fallback: number): number => {
    const v = parseFloat(style.getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  };
  _signalIntensity = raw("--signal-intensity", 0.5);
  _signalSpeed     = raw("--signal-speed", 1);
  _signalAccent    = raw("--signal-accent", 0);
}
```

**Files:** `components/animation/signal-mesh.tsx` (lines 53-58), `components/animation/glsl-hero.tsx` (lines 51-56)

### TD-03: Lenis scrollTo Migration

**Current problem:** 5 files use `window.scrollTo`:
1. `hooks/use-scroll-restoration.ts` line 57 -- `requestAnimationFrame(() => window.scrollTo(0, y))`
2. `components/animation/page-transition.tsx` line 43 -- `window.scrollTo(0, 0)`
3. `components/layout/back-to-top.tsx` line 7 -- `window.scrollTo({ top: 0, behavior: "smooth" })`
4. `components/layout/global-effects.tsx` line 147 -- `window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })`
5. `components/layout/command-palette.tsx` line 66 -- `window.scrollTo({ top: 0, behavior: "smooth" })`

**Infrastructure gap:** The Lenis instance is currently trapped in `LenisProvider` as a local `useRef` with no external access. No `useLenis()` hook exists in the project.

**Solution:** Lenis ships `lenis/react` which provides:
- `ReactLenis` -- a provider component with `root` prop for global scroll
- `useLenis()` -- a hook that returns the Lenis instance from context

**Migration plan:**
1. Refactor `components/layout/lenis-provider.tsx` to use `ReactLenis` from `lenis/react` with `root` prop, preserving the GSAP ticker integration via `useLenis` callback or `autoRaf: false` + manual ticker
2. Each consumer file imports `useLenis` from `lenis/react` and calls `lenis.scrollTo(target, options)` instead of `window.scrollTo`
3. For non-component contexts (event handlers), get `lenis` from `useLenis()` in the component and use it in callbacks

**Lenis scrollTo API:**
```typescript
const lenis = useLenis();

// Equivalent of window.scrollTo(0, 0)
lenis?.scrollTo(0, { immediate: true });

// Equivalent of window.scrollTo({ top: 0, behavior: "smooth" })
lenis?.scrollTo(0);

// Equivalent of window.scrollTo(0, y) with immediate positioning
lenis?.scrollTo(y, { immediate: true });
```

**Fallback safety:** `useLenis()` returns `undefined` when reduced-motion disables Lenis. All call sites must use optional chaining (`lenis?.scrollTo`) and fall back to `window.scrollTo` when Lenis is not available:
```typescript
const lenis = useLenis();
// ...
if (lenis) {
  lenis.scrollTo(0, { immediate: true });
} else {
  window.scrollTo(0, 0);
}
```

**CRITICAL: page-transition.tsx is NOT a hook consumer.** It uses `useCallback` with DOM event listeners (`transitionend`). The Lenis instance must be captured in a ref from the hook call at the component level.

**CRITICAL: GSAP ticker integration.** The current `LenisProvider` manually calls `lenis.raf(time * 1000)` via `gsap.ticker.add`. When switching to `ReactLenis`, set `options={{ autoRaf: false }}` and use the `useLenis` callback to wire the GSAP ticker:
```typescript
<ReactLenis root options={{ autoRaf: false, duration: 1.2, easing: ..., touchMultiplier: 2 }}>
```
Then inside a child component, wire GSAP:
```typescript
const lenis = useLenis();
useEffect(() => {
  if (!lenis) return;
  lenis.on("scroll", ScrollTrigger.update);
  const tickerCallback = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tickerCallback);
  };
}, [lenis]);
```

**Alternative (simpler):** Keep the custom LenisProvider but add a React Context to expose the ref:
```typescript
const LenisContext = createContext<React.RefObject<Lenis | null>>({ current: null });
export const useLenisInstance = () => useContext(LenisContext);
```
This avoids changing the GSAP ticker wiring and is lower risk. The `lenis/react` approach is cleaner but requires re-testing the GSAP integration.

**Recommendation:** Use the simpler custom context approach. It changes 1 file (LenisProvider) minimally and avoids re-testing GSAP ticker integration with ReactLenis. Create a `useLenisInstance()` hook that returns the ref.

### TD-04: TOAST Duplicate Names

**Current problem:** In `components/blocks/components-explorer.tsx`, the COMPONENTS array has:
- Line 379: `{ index: "010", name: "TOAST", subcategory: "FRAME", ... }`
- Line 395: `{ index: "022", name: "TOAST", subcategory: "SIGNAL", ... }`

Both display as "TOAST" in the grid. The success criteria requires "TOAST (FRAME) at index 010 and TOAST (SIGNAL) at a distinct index."

**Fix:** Change the `name` field to include the layer distinction:
```typescript
{ index: "010", name: "TOAST (FRAME)", ... }
{ index: "022", name: "TOAST (SIGNAL)", ... }
```

**File:** `components/blocks/components-explorer.tsx` lines 379 and 395

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lenis instance access | Custom global variable / window.lenis | React Context (custom or lenis/react) | Avoids memory leaks, works with React lifecycle |
| NaN checking | Custom string-to-number parser | `parseFloat()` + `isNaN()` guard | Standard JS, covers all edge cases |

## Common Pitfalls

### Pitfall 1: Lenis undefined in reduced-motion mode
**What goes wrong:** `useLenis()` (or custom hook) returns undefined/null when prefers-reduced-motion is active because Lenis is never instantiated.
**Why it happens:** LenisProvider skips initialization when `mql.matches` is true.
**How to avoid:** Every call site must handle `lenis === null/undefined` with a fallback to `window.scrollTo`.
**Warning signs:** Scroll-to-top stops working when reduced-motion is enabled.

### Pitfall 2: GSAP ticker double-registration after Lenis provider refactor
**What goes wrong:** If the GSAP ticker callback is registered in both the old and new code paths during the refactor, scroll speed doubles.
**Why it happens:** HMR or incomplete refactor leaves two ticker registrations.
**How to avoid:** Remove old ticker code completely when adding new. Test by checking scroll velocity is unchanged.

### Pitfall 3: Module-level observer null-reset race
**What goes wrong:** If two WebGL scenes unmount simultaneously, both try to disconnect and null-reset `_signalObserver`.
**Why it happens:** Module-level variable shared between SignalMesh and GLSLHero.
**How to avoid:** The disconnect + null-reset is idempotent (disconnect on already-disconnected is a no-op, null-reset on null is a no-op). No additional guard needed, but be aware the modules have SEPARATE `_signalObserver` variables since they are different files.
**Important:** signal-mesh.tsx and glsl-hero.tsx each have their OWN module-level `_signalObserver`. They do NOT share the variable. Each file's cleanup is independent.

### Pitfall 4: page-transition.tsx scrollTo inside transitionend handler
**What goes wrong:** The `window.scrollTo(0, 0)` in page-transition.tsx is called inside a `transitionend` DOM event handler, NOT inside a React effect. The Lenis instance from `useLenis()` must be captured in a ref at the component level and accessed from the event handler closure.
**How to avoid:** Store `lenis` from `useLenis()` in a `useRef` and read `lenisRef.current` inside the event handler.

## Code Examples

### TD-01: Observer disconnect in useGSAP cleanup
```typescript
// signal-mesh.tsx and glsl-hero.tsx -- inside useGSAP callback return
return () => {
  gsap.ticker.remove(tickerFn);
  if (_signalObserver) {
    _signalObserver.disconnect();
    _signalObserver = null;
  }
};
```

### TD-02: isNaN guard helper
```typescript
// Shared pattern for both files
function readSignalVars(): void {
  const style = getComputedStyle(document.documentElement);
  const raw = (name: string, fallback: number): number => {
    const v = parseFloat(style.getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  };
  _signalIntensity = raw("--signal-intensity", 0.5);
  _signalSpeed     = raw("--signal-speed", 1);
  _signalAccent    = raw("--signal-accent", 0);
}
```

### TD-03: Custom LenisContext approach (recommended)
```typescript
// components/layout/lenis-provider.tsx
"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";

const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return;

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenisRef.current = instance;
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);
    const tickerCallback = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const motionHandler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        gsap.ticker.remove(tickerCallback);
        instance.destroy();
        lenisRef.current = null;
        setLenis(null);
      }
    };
    mql.addEventListener("change", motionHandler);

    return () => {
      mql.removeEventListener("change", motionHandler);
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
```

### TD-03: Consumer pattern with fallback
```typescript
// In any component that needs programmatic scroll
import { useLenisInstance } from "@/components/layout/lenis-provider";

function MyComponent() {
  const lenis = useLenisInstance();

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0);  // smooth by default
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [lenis]);
}
```

### TD-04: Distinct TOAST names
```typescript
// components/blocks/components-explorer.tsx
{ index: "010", name: "TOAST (FRAME)", category: "FEEDBACK", subcategory: "FRAME", ... },
{ index: "022", name: "TOAST (SIGNAL)", category: "FEEDBACK", subcategory: "SIGNAL", ... },
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom Lenis provider with trapped ref | `lenis/react` ships ReactLenis + useLenis() | Lenis 1.1+ | Built-in React integration available |
| `window.scrollTo` + rAF workaround | `lenis.scrollTo` via hook | Documented debt since v1.2 | Eliminates scroll race condition |

## Open Questions

1. **ReactLenis vs custom context for TD-03**
   - What we know: Both approaches work. ReactLenis is the official integration; custom context is lower-risk refactor.
   - What's unclear: Whether ReactLenis `autoRaf: false` + manual GSAP ticker integration works identically to current setup.
   - Recommendation: Use custom context approach (add Context to existing LenisProvider). Lower risk, smaller diff, preserves battle-tested GSAP wiring.

## Validation Architecture

> Nyquist validation not explicitly configured -- including section.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual verification (no automated test suite detected) |
| Config file | none |
| Quick run command | `pnpm build && grep -rn "window.scrollTo" --include="*.ts" --include="*.tsx" components/ hooks/ app/` |
| Full suite command | `pnpm build` (type-check + build) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TD-01 | Observer disconnect on unmount | manual code review | `grep -A5 "ticker.remove" components/animation/signal-mesh.tsx components/animation/glsl-hero.tsx` | N/A |
| TD-02 | isNaN guard in readSignalVars | manual code review | `grep "isNaN" components/animation/signal-mesh.tsx components/animation/glsl-hero.tsx` | N/A |
| TD-03 | No window.scrollTo in codebase | grep check | `grep -rn "window.scrollTo" --include="*.ts" --include="*.tsx" components/ hooks/ app/ lib/` | N/A |
| TD-04 | Distinct TOAST display names | manual visual + grep | `grep "TOAST" components/blocks/components-explorer.tsx` | N/A |

### Sampling Rate
- **Per task commit:** `pnpm build` (catches type errors from refactor)
- **Per wave merge:** `pnpm build` + grep checks for TD-03
- **Phase gate:** All four grep/review checks pass

### Wave 0 Gaps
None -- no test infrastructure needed. All validations are grep-based code review checks and build verification.

## Sources

### Primary (HIGH confidence)
- Direct code inspection of all affected files in the repository
- `lenis/dist/lenis-react.d.ts` -- confirms ReactLenis and useLenis() exports
- `package.json` -- confirms lenis ^1.1.20 installed

### Secondary (MEDIUM confidence)
- None needed -- all findings from direct code analysis

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all fixes use existing code
- Architecture: HIGH -- all four bugs fully diagnosed with exact locations
- Pitfalls: HIGH -- edge cases identified from code inspection (reduced-motion fallback, event handler closure, module-level independence)

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable -- no external dependency changes expected)
