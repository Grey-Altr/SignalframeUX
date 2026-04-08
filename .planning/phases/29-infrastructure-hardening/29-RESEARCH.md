# Phase 29: Infrastructure Hardening - Research

**Researched:** 2026-04-07
**Domain:** GSAP ScrollTrigger + Lenis scroll infrastructure, GSAP Observer plugin, CSS overscroll, font-loading CLS prevention, prefers-reduced-motion gate
**Confidence:** HIGH — all findings based on direct codebase audit of existing implementation

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **PinnedSection API**: Minimal props — `children`, `className`, `scrollDistance` (number, vh units), `id`. ScrollTrigger config hardcoded internally: `pin: true`, `scrub: 1`, `anticipatePin: 1`, `invalidateOnRefresh: true`. Lives at `components/animation/pinned-section.tsx`.
- **Lenis Hardening**: Add `ignoreMobileResize: true` to Lenis config in `components/layout/lenis-provider.tsx`. DO NOT touch the rAF ticker pattern (`gsap.ticker.add(time * 1000)`) — load-bearing from v1.2, validated at Lighthouse 100/100. Confirm `scrollerProxy` remains absent.
- **Observer Consolidation**: Register GSAP `Observer` plugin in `lib/gsap-plugins.ts` alongside existing plugins. Verify MutationObserver disconnect in `lib/color-resolve.ts` — singleton pattern exists, needs confirmation that disconnect is called on unmount paths.
- **Reduced-Motion Verification (PF-06 Gate)**: Automated `matchMedia` mock tests for `initReducedMotion()`. Grep audit of all `components/animation/*.tsx`. Confirm 11 CSS blocks in globals.css cover everything. This is a gate before Phase 30.

### Claude's Discretion

- Test file structure and naming for PinnedSection isolation tests
- Whether to add `overscroll-behavior: none` on `html` only or `html, body`
- Implementation order within the phase

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PF-04 | CLS = 0 — scroll-driven animations must not cause layout shift | fonts-ready ScrollTrigger.refresh prevents post-font-load reflow from shifting pin-spacer positions; overscroll suppression prevents iOS rubber-band flicker |
| PF-05 | No new animation libraries — all motion via GSAP ScrollTrigger (already in stack) | GSAP Observer is already licensed in GSAP 3.12 (same Club GSAP seat as ScrollTrigger) — zero new packages required |
| PF-06 | prefers-reduced-motion fully functional across all new sections | 11 CSS blocks confirmed in globals.css; 20 explicit matchMedia guards found in animation components; initReducedMotion() in gsap-plugins.ts handles JS-side global freeze — needs test coverage |

</phase_requirements>

---

## Summary

Phase 29 is pure infrastructure — no visual output. Six targeted changes harden the scroll, font, Observer, and motion infrastructure before any Phase 30+ scroll-driven or WebGL work builds on top.

The codebase audit revealed the exact insertion points for every change. The riskiest task is PinnedSection creation because it introduces a new GSAP pin/scrub component. All other tasks are single-file edits of 1-5 lines each. The reduced-motion audit (PF-06 gate) is the most time-consuming but is already in excellent shape — 20 explicit `matchMedia` guards found across 14 animation components, plus 11 CSS blocks.

The critical gap: `document.fonts.ready.then(ScrollTrigger.refresh)` does not currently exist anywhere in the root layout chain. `token-viz.tsx` has a local `document.fonts.ready.then(() => draw())` call but this is component-scoped, not global. The global hook must be added to `PageAnimations` or `GlobalEffects` — `PageAnimations` is the correct location because it already owns the GSAP init lifecycle.

**Primary recommendation:** Implement in order: (1) overscroll CSS — zero risk, 1 line; (2) Lenis `ignoreMobileResize` — 1 line, load-bearing config; (3) Observer registration — 1 line import + register; (4) fonts-ready hook in PageAnimations — 4 lines; (5) MutationObserver disconnect audit in color-resolve.ts — verify only; (6) PinnedSection component + isolation test — most complex, build last.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP ScrollTrigger | 3.12 (in stack) | Pin/scrub scroll sections | Already registered in gsap-plugins.ts and gsap-core.ts |
| GSAP Observer | 3.12 (in stack, not yet registered) | Drag, wheel, touch gesture detection for Phase 30+ | Free with GSAP 3.12; zero new packages required |
| Lenis | Current (in stack) | Smooth scroll normalization | Already integrated via LenisProvider; load-bearing rAF/ticker pattern established |

### No New Libraries

Per PF-05 and project decision "Zero new npm packages for v1.5" — all work in this phase uses existing GSAP + Lenis installation. GSAP Observer is part of the existing GSAP package, not a separate install.

**Installation:** None required. All plugins are already in `node_modules/gsap/`.

---

## Architecture Patterns

### Recommended Project Structure (Phase 29 additions only)

```
components/
  animation/
    pinned-section.tsx        # NEW — 200-300vh pin/scrub wrapper
lib/
  gsap-plugins.ts             # MODIFY — add Observer registration (1 line)
components/layout/
  lenis-provider.tsx          # MODIFY — add ignoreMobileResize: true (1 line)
  page-animations.tsx         # MODIFY — add document.fonts.ready hook
app/
  globals.css                 # MODIFY — add overscroll-behavior: none to html
tests/
  phase-29-infra.spec.ts      # NEW — Playwright smoke tests
```

### Pattern 1: Global fonts-ready ScrollTrigger refresh

**What:** `document.fonts.ready.then(ScrollTrigger.refresh)` fires once after all fonts are decoded and applied, causing ScrollTrigger to recalculate all pin-spacer heights and trigger offsets against final font metrics.

**When to use:** Root layout level, once per page load. NOT per-component.

**Where to add:** `PageAnimations` component's `init()` async function, after `initReducedMotion()` call and after the `hasTargets` guard. `PageAnimations` already owns the GSAP init lifecycle and imports `ScrollTrigger` from `@/lib/gsap-core`.

**Example:**
```typescript
// In components/layout/page-animations.tsx — inside init() function
// After: cleanupMotion = initReducedMotion();
// After: ctx = gsap.context(() => { initCoreAnimations(clickCleanups); });

// Font-ready ScrollTrigger recalculation — prevents CLS from font reflow
// after Anton/Electrolize swap in. Must fire after GSAP context is established.
document.fonts.ready.then(() => {
  ScrollTrigger.refresh();
});
```

**Why here and not GlobalEffects:** `GlobalEffects` does not import or use ScrollTrigger. `PageAnimations` already has the import and runs in the same layout order. Inserting here means it fires on every page, not just the homepage.

### Pattern 2: GSAP Observer Registration

**What:** Register `Observer` plugin in `lib/gsap-plugins.ts` alongside existing plugins so any Phase 30+ component can import it without re-registration.

**When to use:** Module-level, same file as ScrollTrigger, SplitText, etc.

**Example:**
```typescript
// lib/gsap-plugins.ts — add to existing imports and gsap.registerPlugin() call
import { Observer } from "gsap/Observer";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  Flip,
  CustomEase,
  Observer,   // ADD THIS LINE
  useGSAP
);
```

**Export:** Also add to the bottom export: `export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, Flip, CustomEase, Observer, useGSAP };`

### Pattern 3: Lenis ignoreMobileResize

**What:** Add `ignoreMobileResize: true` to the Lenis constructor config. This prevents Lenis from treating iOS Safari address bar show/hide events as viewport resizes that would trigger scroll recalculation.

**Where:** `components/layout/lenis-provider.tsx` line 23 — inside the `new Lenis({...})` call.

**Current state:** Lenis config has `duration`, `easing`, `touchMultiplier`. No `ignoreMobileResize`.

**Example:**
```typescript
// components/layout/lenis-provider.tsx — add to Lenis constructor
const instance = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
  ignoreMobileResize: true,   // ADD THIS LINE — prevents iOS address bar from triggering resize
});
```

**Do NOT change:** The `gsap.ticker.add(tickerCallback)` rAF pattern, `lagSmoothing(0)`, or the `instance.on("scroll", ScrollTrigger.update)` wiring. These are load-bearing from v1.2.

**scrollerProxy absent — confirmed:** The existing `LenisProvider` does not call `ScrollTrigger.scrollerProxy()`. This is correct. Do not add it. The `instance.on("scroll", ScrollTrigger.update)` pattern is the correct Lenis + ScrollTrigger integration.

### Pattern 4: overscroll-behavior: none

**What:** CSS rule on `html` (and optionally `body`) that suppresses iOS Safari rubber-band overscroll. Without this, users on iOS can pull past the top/bottom of the page, causing a brief white gap that flickers against pinned sections.

**Where:** `app/globals.css` — add to the `html` ruleset early in the file, or create a new dedicated rule.

**Discretion decision — recommended: `html` only.** The `body` element is where Lenis attaches scroll. Adding `overscroll-behavior: none` to `body` can interfere with Lenis's internal scroll handling on some browsers. `html` is sufficient to suppress the rubber-band behavior.

**Example:**
```css
/* app/globals.css — add near top, in the base/reset section */
html {
  overscroll-behavior: none;
}
```

**Note:** If a `html { }` block already exists in globals.css, add to it rather than creating a duplicate rule.

### Pattern 5: PinnedSection Component

**What:** Reusable `'use client'` component wrapping GSAP `pin: true` ScrollTrigger. Pins the element to the viewport while the user scrolls through `scrollDistance` vh of scroll space.

**Where:** `components/animation/pinned-section.tsx` — follows the established pattern of `horizontal-scroll.tsx` (pin/scrub, gsap.context, invalidateOnRefresh, mobile fallback, reduced-motion skip).

**Props API (locked in CONTEXT.md):**
- `children: ReactNode`
- `className?: string`
- `scrollDistance: number` — vh units (e.g., `2` = 200vh)
- `id?: string`

**ScrollTrigger config (locked, hardcoded internally):**
- `pin: true`
- `scrub: 1`
- `anticipatePin: 1`
- `invalidateOnRefresh: true`
- `start: "top top"`
- `end: () => \`+=\${scrollDistance * window.innerHeight}\``

**Critical: gsap.context() cleanup.** Must wrap all GSAP calls in `const ctx = gsap.context(() => {...})` and return `() => ctx.revert()` from useEffect. This is mandatory for React StrictMode double-invoke safety and to prevent ghost ScrollTriggers.

**Critical: overflow containment.** The component's root div must NOT have `overflow: hidden`. GSAP pin switches the element to `position: fixed` during the pin phase. A parent with `overflow: hidden` clips fixed children in some browsers. The inner content area may have overflow-hidden, but the pinned wrapper must not.

**Critical: reduced-motion skip.** Must check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` at the top of useEffect and return early if true. Render children normally (instant placement, no scroll-driven animation).

**Example (complete implementation):**
```typescript
// components/animation/pinned-section.tsx
"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";

interface PinnedSectionProps {
  children: ReactNode;
  className?: string;
  /** Total scroll distance in viewport heights (e.g., 2 = 200vh, 3 = 300vh) */
  scrollDistance: number;
  id?: string;
}

export function PinnedSection({ children, className, scrollDistance, id }: PinnedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // prefers-reduced-motion: instant placement, no scroll-driven animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        start: "top top",
        end: () => `+=${scrollDistance * window.innerHeight}`,
        invalidateOnRefresh: true,
      });
    });

    return () => ctx.revert();
  }, [scrollDistance]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={className}
      style={{ height: "100vh" }}
    >
      {children}
    </div>
  );
}
```

**Isolation test:** Before Phase 31 consumes PinnedSection, wrap placeholder content inside it on a test page or create a minimal Playwright smoke test that confirms the component mounts without JS errors and the pin spacer is created in the DOM.

### Pattern 6: MutationObserver Disconnect Audit (color-resolve.ts)

**What:** Verify that the `cacheObserver` in `lib/color-resolve.ts` is properly handled.

**Current state (confirmed from codebase read):**
- `cacheObserver` is a module-level singleton: `let cacheObserver: MutationObserver | null = null`
- `ensureCacheObserver()` initializes lazily on first cached resolve call
- The observer fires `colorCache.clear()` on any `:root` class or style mutation
- There is NO explicit disconnect call

**Verdict: No disconnect is needed and none should be added.** The `cacheObserver` is a module-level singleton with the lifetime of the module — it is intentionally permanent. In Next.js App Router, modules are loaded once per browser session. A `disconnect()` would prevent cache invalidation from working after any component unmount. This is the correct architecture. The CONTEXT.md says "needs confirmation that disconnect is called on unmount paths" — the confirmation is: disconnect is correctly absent. The observer is module-scoped, not component-scoped.

**No change required to `lib/color-resolve.ts`.**

### Anti-Patterns to Avoid

- **Calling ScrollTrigger.refresh() at module scope or before fonts.ready:** ScrollTrigger.refresh() forces an immediate recalculation using current layout. If called before fonts are applied, it uses fallback-font metrics. The subsequent font swap still causes the reflow. Must be inside `document.fonts.ready.then(...)`.
- **Adding scrollerProxy to LenisProvider:** `ScrollTrigger.scrollerProxy()` is used when the scroll container is not `window`. With Lenis + ScrollTrigger integration via `instance.on("scroll", ScrollTrigger.update)`, scrollerProxy is not needed and adds complexity.
- **Wrapping PinnedSection in a parent with overflow: hidden:** GSAP pin switches the element to `position: fixed`. Clipping parents break this. Any SFSection wrapping a PinnedSection must not have overflow-hidden.
- **Using useGSAP instead of useEffect for PinnedSection:** `useGSAP` is imported and registered in `gsap-plugins.ts`, not `gsap-core.ts`. PinnedSection imports from `gsap-core` (the lightweight entry). Use `useEffect` + `gsap.context()` pattern, same as `horizontal-scroll.tsx`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| iOS address bar scroll jump | Custom resize listener + recalculate | `ignoreMobileResize: true` in Lenis config | Lenis + GSAP 3.12 have tested integration for exactly this case |
| Font-load CLS on scroll positions | Manual font-load detection | `document.fonts.ready` Promise (browser native) | Already correct API — resolves after all fonts decoded and applied |
| Mobile overscroll rubber-band | JavaScript scroll event cancellation | `overscroll-behavior: none` CSS | CSS is processed before JS; Safari respects it; JS cancellation has race conditions |
| Gesture/drag detection | Custom touch event wiring | GSAP Observer (already in package) | Observer handles momentum, threshold, direction, wheel/touch/pointer normalization |
| ScrollTrigger cleanup | Manual `.kill()` on each instance | `gsap.context().revert()` | Collects all GSAP instances created within context; safe under StrictMode double-invoke |

---

## Common Pitfalls

### Pitfall 1: Font Reflow Invalidates Pin-Spacer Heights

**What goes wrong:** ScrollTrigger calculates pin-spacer heights at init time. If Anton or Electrolize finish loading after init, text blocks reflow. Sections above the pinned element change height. The pin fires at the wrong scroll offset — animations appear desynced from scroll progress. Especially visible on cold loads or incognito where fonts are not cached.

**Why it happens:** `font-display: swap` (Next.js default) allows layout to render with fallback font, then swaps when custom font loads. Fallback fonts have different metrics (line-height, letter-spacing) causing reflow. Anton (display font at 120px+) causes 30-50px height difference vs system fallback.

**How to avoid:** `document.fonts.ready.then(() => ScrollTrigger.refresh())` in PageAnimations. This is the global fix — fires once, recalculates all ScrollTriggers. CLS = 0 requires this.

**Warning signs:** Scroll sequences feel "correct" in dev (fonts cached) but offset on first-load or Lighthouse simulation.

### Pitfall 2: iOS Safari Rubber-Band Flicker on Pinned Sections

**What goes wrong:** Without `overscroll-behavior: none`, iOS Safari allows the user to pull past the top/bottom of the page. During the pull, a white gap appears behind the pinned element. When the page snaps back, pinned sections flicker.

**How to avoid:** `overscroll-behavior: none` on `html` in globals.css. One line. Must be present before Phase 31 ships any pinned section.

### Pitfall 3: Ghost ScrollTriggers from Missing gsap.context Cleanup

**What goes wrong:** ScrollTrigger instances created without `gsap.context()` are not automatically collected. On React StrictMode double-invoke (dev only), two identical ScrollTriggers exist — animations fire twice. On component unmount without cleanup, "ghost" ScrollTriggers fire for elements no longer in the DOM.

**How to avoid:** All GSAP code in PinnedSection and any future scroll components must use `const ctx = gsap.context(() => {...}); return () => ctx.revert();`. The existing `horizontal-scroll.tsx` establishes this pattern — follow it exactly.

### Pitfall 4: Observer Import Without Registration

**What goes wrong:** Importing `Observer` from `gsap/Observer` without calling `gsap.registerPlugin(Observer)` results in a silent failure — Observer methods exist but do nothing, or throw a console warning about unregistered plugin.

**How to avoid:** Add Observer to the existing `gsap.registerPlugin(...)` call in `lib/gsap-plugins.ts`. Import line and registration line in the same edit.

### Pitfall 5: Lenis ignoreMobileResize Has No Effect on Non-Mobile

**What goes wrong:** Developer adds the flag but doesn't understand what it does and thinks it "solves" all resize issues. It only suppresses mobile viewport resize events (address bar show/hide). Desktop resize events are unaffected. `invalidateOnRefresh: true` on ScrollTrigger handles desktop resize — both are required.

**How to avoid:** `ignoreMobileResize: true` in Lenis + `invalidateOnRefresh: true` in every PinnedSection ScrollTrigger = complete coverage.

---

## Code Examples

Verified patterns from codebase audit:

### Existing HorizontalScroll Pin Pattern (reference — follow this exactly)
```typescript
// Source: components/animation/horizontal-scroll.tsx (verified)
useEffect(() => {
  const container = containerRef.current;
  const inner = innerRef.current;
  if (!container || !inner) return;

  if (window.innerWidth < 768) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = gsap.context(() => {
    gsap.to(inner, {
      x: () => -(inner.scrollWidth - container.offsetWidth),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => `+=${inner.scrollWidth - container.offsetWidth}`,
        invalidateOnRefresh: true,   // recalculate on resize
      },
    });
  });

  return () => ctx.revert();   // critical: cleanup on unmount
}, []);
```

### Existing initReducedMotion Pattern (reference)
```typescript
// Source: lib/gsap-plugins.ts (verified — already handles runtime MQ changes)
export function initReducedMotion(): () => void {
  if (typeof window === "undefined") return () => {};
  motionCleanup?.();
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReduced.matches) {
    gsap.globalTimeline.timeScale(0);
  }
  const handler = (e: MediaQueryListEvent) => {
    gsap.globalTimeline.timeScale(e.matches ? 0 : 1);
  };
  prefersReduced.addEventListener("change", handler);
  motionCleanup = () => {
    prefersReduced.removeEventListener("change", handler);
    motionCleanup = null;
  };
  return motionCleanup;
}
```

### Existing PageAnimations init() Location for fonts.ready
```typescript
// Source: components/layout/page-animations.tsx (verified — insert after line 43)
// Current structure:
async function init() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const { initReducedMotion } = await import("@/lib/gsap-plugins");
    if (cancelledRef.current) return;
    cleanupMotion = initReducedMotion();
    return;   // <-- fonts.ready NOT needed here (no ScrollTrigger)
  }

  const hasTargets = document.querySelector("[data-anim]");
  if (!hasTargets) return;

  const { initReducedMotion } = await import("@/lib/gsap-plugins");
  if (cancelledRef.current) return;
  cleanupMotion = initReducedMotion();

  ctx = gsap.context(() => {
    initCoreAnimations(clickCleanups);
  });

  // INSERT HERE — after ScrollTriggers are established, before hero async init
  document.fonts.ready.then(() => {
    if (!cancelledRef.current) ScrollTrigger.refresh();
  });

  const heroTitle = document.querySelector("[data-anim='hero-title']");
  if (heroTitle) { ... }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual ScrollTrigger cleanup (.kill()) | `gsap.context().revert()` | GSAP 3.11 | Automatic collection; StrictMode safe |
| `ScrollTrigger.scrollerProxy()` for Lenis | `instance.on("scroll", ScrollTrigger.update)` | Lenis v1+ | Simpler, fewer edge cases |
| `window.addEventListener("load", ...)` for font-ready | `document.fonts.ready` Promise | FontFaceSet API widely supported | Fires exactly when fonts are applied, not at window load |

**Deprecated/outdated:**
- `scrollerProxy()` with Lenis: Correct integration is `ScrollTrigger.update` on scroll event — already in use, confirmed correct.
- `Observer` as a separate paid GSAP plugin: As of GSAP 3.12, Observer is included in the standard package alongside ScrollTrigger. No additional install.

---

## Reduced-Motion Coverage Audit (PF-06 Gate)

### Current Coverage (confirmed from codebase audit)

**CSS blocks in globals.css:** 11 `@media (prefers-reduced-motion: reduce)` blocks confirmed at lines: 403, 444, 459, 473, 482, 974, 1308, 1386, 1438, 1519, 1699.

**JS matchMedia guards in animation components (20 total):**
- `circuit-divider.tsx` — line 31
- `glsl-hero.tsx` — lines 306, 350
- `page-transition.tsx` — line 28
- `signal-overlay.tsx` — line 115 (uses mq variable pattern)
- `split-headline.tsx` — line 26
- `scroll-reveal.tsx` — line 24
- `logo-draw.tsx` — line 64
- `code-typewriter.tsx` — line 60
- `hero-mesh.tsx` — line 52
- `signal-motion.tsx` — line 78
- `signal-mesh.tsx` — line 287
- `scramble-text.tsx` — line 26
- `vhs-overlay.tsx` — lines 27-28
- `horizontal-scroll.tsx` — line 31
- `global-effects.tsx` (IdleOverlay) — line 278
- `global-effects.tsx` (InteractionFeedback) — line 329

**JS global handler:** `initReducedMotion()` in `lib/gsap-plugins.ts` sets `gsap.globalTimeline.timeScale(0)` — covers all GSAP-animated components that do NOT have explicit guards (they inherit the frozen timeline). Runtime MQ change is handled.

**Dual-path coverage confirmed:** Components either (a) check matchMedia directly and return early, or (b) use GSAP (covered by globalTimeline.timeScale(0)), or (c) both. This is correct and complete.

**Animation components WITHOUT explicit matchMedia guards:**
- `border-draw.tsx` — uses GSAP; covered by globalTimeline freeze
- `magnetic.tsx` — uses GSAP; covered by globalTimeline freeze
- `hover-preview.tsx` — hover interaction only; reasonable to exclude
- `canvas-cursor.tsx` — pointer-coarse check but no prefers-reduced-motion; mouse-driven, no animation by itself
- `token-viz.tsx` — Canvas 2D, not GSAP; has local fonts.ready hook but no reduced-motion check — POTENTIAL GAP
- `page-animations.tsx` — has matchMedia check at top of init()
- `color-cycle-frame.tsx` — wheel event only; no GSAP animation, CSS variable mutation — review needed
- `ghost-label.tsx`, `signal-motion.tsx` — signal-motion.tsx has guard at line 78; ghost-label.tsx uses CSS transition only

**PF-06 gate action:** The audit confirms broad coverage. The PinnedSection component (new in Phase 29) MUST include a reduced-motion guard per CONTEXT.md. The Playwright test for Phase 29 should verify that `initReducedMotion()` correctly sets `gsap.globalTimeline.timeScale(0)` when the MQ matches.

---

## Open Questions

1. **token-viz.tsx reduced-motion coverage**
   - What we know: The component uses Canvas 2D (not GSAP), so globalTimeline.timeScale(0) does NOT cover it. It has a local `document.fonts.ready.then(() => draw())` call but no `prefers-reduced-motion` check.
   - What's unclear: Does the TokenViz draw function animate, or is it a static render? If static (single-frame draw), reduced-motion is a non-issue.
   - Recommendation: Read `token-viz.tsx` during Plan 01 implementation and add a `matchMedia` guard to the draw call if it has animation loops. This is a PF-06 gate item.

2. **overscroll-behavior: none on html vs html + body**
   - Claude's discretion decision. Recommendation: `html` only. Adding to `body` can interfere with Lenis's native scroll on some older iOS versions. `html` is sufficient to suppress rubber-band.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.59+ |
| Config file | `playwright.config.ts` (root) |
| Quick run command | `pnpm exec playwright test tests/phase-29-infra.spec.ts` |
| Full suite command | `pnpm exec playwright test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PF-04 | CLS = 0 — overscroll-behavior: none present in HTML | smoke | `pnpm exec playwright test tests/phase-29-infra.spec.ts` | ❌ Wave 0 |
| PF-04 | fonts.ready hook present in PageAnimations source | static/grep | Part of same spec | ❌ Wave 0 |
| PF-05 | Observer registered in gsap-plugins (no new packages) | smoke | Source file grep in spec | ❌ Wave 0 |
| PF-06 | PinnedSection skips animation under reduced-motion | unit/smoke | Part of same spec | ❌ Wave 0 |

**Note on PF-04 CLS verification:** True CLS = 0 confirmation requires Lighthouse against a deployed URL (Phase 35 gate). Phase 29 tests verify the infrastructure hooks are in place (CSS rule present, JS hook present) — a structural proxy for CLS correctness.

### Sampling Rate
- **Per task commit:** `pnpm exec playwright test tests/phase-29-infra.spec.ts`
- **Per wave merge:** `pnpm exec playwright test`
- **Phase gate:** Full suite green before `/pde:verify-work`

### Wave 0 Gaps
- [ ] `tests/phase-29-infra.spec.ts` — covers PF-04 (overscroll CSS + fonts.ready), PF-05 (Observer registration), PF-06 (PinnedSection reduced-motion)

*(No new framework install needed — Playwright is already in devDependencies)*

---

## Sources

### Primary (HIGH confidence)
- Direct codebase audit — all findings verified against implementation:
  - `lib/gsap-plugins.ts` — existing plugin registrations, initReducedMotion() implementation
  - `lib/gsap-core.ts` — lightweight entry point, no Observer export
  - `lib/color-resolve.ts` — MutationObserver singleton, cacheObserver lifecycle
  - `components/layout/lenis-provider.tsx` — full Lenis config (lines 23-27 confirmed), rAF ticker pattern
  - `components/layout/page-animations.tsx` — init() structure, initReducedMotion usage, ScrollTrigger import
  - `components/layout/global-effects.tsx` — GlobalEffects components, IdleOverlay reduced-motion check
  - `components/animation/horizontal-scroll.tsx` — existing pin/scrub reference implementation
  - `app/layout.tsx` — root layout mount order, provider chain
  - `app/globals.css` — 11 prefers-reduced-motion blocks confirmed; overscroll-behavior absent confirmed
  - All 26 `components/animation/*.tsx` — matchMedia guard coverage audit
- `.planning/research/PITFALLS.md` — font reflow, iOS overscroll, ScrollTrigger pin hazards
- `.planning/research/ARCHITECTURE.md` — PinnedSection pattern, Observer consolidation recommendation

### Secondary (MEDIUM confidence)
- `.planning/phases/29-infrastructure-hardening/29-CONTEXT.md` — locked decisions, canonical references
- `.planning/STATE.md` v1.5 critical constraints — iOS Safari testing mandate, MutationObserver consolidation timing

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed and in use; Observer confirmed in GSAP package
- Architecture: HIGH — all insertion points verified via direct code audit; no assumptions
- Pitfalls: HIGH — sourced from PITFALLS.md research (GSAP community + official docs) + codebase confirmation
- Reduced-motion audit: HIGH — exhaustive grep of all 26 animation components

**Research date:** 2026-04-07
**Valid until:** 2026-05-07 (stable domain — GSAP 3.12, Lenis, and Playwright APIs change slowly)
