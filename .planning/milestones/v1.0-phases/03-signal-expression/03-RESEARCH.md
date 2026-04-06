# Phase 3: SIGNAL Expression — Research

**Researched:** 2026-04-05
**Domain:** GSAP animation orchestration, CSS progressive enhancement, canvas cursor systems, mobile signal behavior specification
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- ScrambleText fires via GSAP ScrollTrigger `onEnter` — triggers when heading enters viewport, consistent with existing scroll-reveal pattern
- Asymmetric hover timing via CSS `transition` with separate in/out durations: `transition: all var(--duration-fast) ease` base, `&:hover { transition-duration: var(--duration-slow) }` — 100ms in, 400ms out
- Hard-cut section transitions: `opacity: 0→1` with `duration-instant` (34ms) replacing any existing fade transitions on section boundaries
- `[data-anim]` CSS fallback: base CSS rule `[data-anim] { opacity: 1 }`, GSAP sets `opacity: 0` on init — content visible by default if GSAP fails
- Staggered grid entry on all `SFGrid` instances and `component-grid.tsx` — 40ms stagger via GSAP ScrollTrigger batch on `[data-anim="stagger"]` children
- Canvas overlay implementation for cursor — magenta crosshair on fixed-position canvas with particle trail as fading dots
- Cursor only active on sections with `[data-cursor]` attribute
- Cursor color: `var(--color-primary)` for crosshair, fading alpha for trail particles
- Cursor hidden on mobile (< md breakpoint)
- SIG-10 is a spec document only this phase — define which effects collapse and their static fallbacks
- Effects that collapse on mobile: cursor (hidden), VHS grain (reduced opacity), circuit dividers (static SVG), hero-mesh (static frame)
- Effects that persist on mobile: ScrambleText, hover timing, staggered grid entry, hard-cut transitions

### Claude's Discretion
- GSAP ScrollTrigger configuration details (scrub, markers, pin behavior)
- Canvas particle system parameters (particle count, decay rate, trail length)
- Exact mobile breakpoint behavior for each effect beyond the spec categories
- Reduced-motion implementation details (`prefers-reduced-motion` query scope)

### Deferred Ideas (OUT OF SCOPE)
- SIG-06: Audio feedback palette (Web Audio API) — post-v1.0
- SIG-07: Haptic feedback (Vibration API) — post-v1.0
- SIG-08: Idle state animation (grain drift, color pulse) — post-v1.0

**NOTE FOR PLANNER:** SIG-06, SIG-07, SIG-08 are formally deferred. Mark as DEFERRED in plan — do not create implementation tasks for them.

</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SIG-01 | ScrambleText fires on every route entry for primary headings | ScrambleTextPlugin already in gsap-plugins.ts; `initPageHeadingScramble()` in page-animations.tsx handles `[data-anim="page-heading"]` — needs ScrollTrigger `onEnter` wiring, not just setTimeout |
| SIG-02 | Asymmetric hover timing across all interactive elements (100ms in / 400ms out) | CSS transition split pattern locked. Existing `.sf-pressable`, `.sf-hoverable`, `.sf-invert-hover` classes need audit and update; new global rule needed |
| SIG-03 | Hard-cut section transitions replace soft fades | `applyBgShift()` in page-animations.tsx already uses step-end; `[data-anim="section-reveal"]` uses 700ms ease — needs replacement with 34ms instant opacity |
| SIG-04 | Staggered grid entry animation with 40ms stagger on scroll reveal | `ScrollTrigger.batch()` approach — gsap-core.ts has ScrollTrigger; `component-grid.tsx` uses `data-anim="comp-cell"` with convergence (not stagger); SFGrid needs `data-anim="stagger"` wiring |
| SIG-05 | `[data-anim]` elements visible without JavaScript — CSS fallback ensures content never invisible if GSAP fails | Currently partial — only specific `[data-anim="section-reveal"]`, `[data-anim="tag"]`, etc. have initial-state CSS; need a catch-all `[data-anim] { opacity: 1 }` with GSAP overriding on init |
| SIG-09 | Signature cursor — magenta crosshair with particle trail on canvas sections | Existing `CustomCursor` in global-effects.tsx is commented out; current impl is div-based crosshair. Locked decision requires canvas-based implementation with `[data-cursor]` section scoping |
| SIG-10 | Mobile Signal layer behavior specified — SIGNAL-SPEC.md document | Spec-only deliverable. Research establishes what to specify per effect. No code changes. |
| SIG-06 | Audio feedback (DEFERRED) | Out of scope for v1.0 |
| SIG-07 | Haptic feedback (DEFERRED) | Out of scope for v1.0 |
| SIG-08 | Idle state animation (DEFERRED) | Out of scope for v1.0 — `IdleOverlay` component already exists in global-effects.tsx |

</phase_requirements>

---

## Summary

Phase 3 authors the SIGNAL layer against an already-solid foundation. Phase 1 locked the token system (motion tokens: `--duration-instant` through `--duration-glacial`, three easings) and Phase 2 delivered the SF primitives (including `SFGrid`). The SIGNAL layer is partially implemented — `page-animations.tsx` orchestrates scroll-based reveals, ScrambleText, hero animations, and section bg-shifts. The task is to normalize, extend, and spec this existing work rather than build from scratch.

The dominant technical concern is the `[data-anim]` progressive enhancement pattern. Currently, specific data-anim values (`section-reveal`, `tag`, `comp-cell`, `cta-btn`) have CSS initial states that set opacity to 0 before GSAP runs. This needs to be generalized to a catch-all `[data-anim]` rule, with GSAP explicitly setting opacity:0 on init before animating — content must never disappear if GSAP fails to load. The `prefers-reduced-motion` reduced motion block already resets these to visible, which is the right model to extend.

The cursor is the most structurally new work. The existing `CustomCursor` component (div-based crosshair with mix-blend-mode) is commented out in global-effects.tsx and its CSS is commented out in globals.css. The locked decision calls for a canvas-based particle trail cursor scoped to `[data-cursor]` sections — this is a new component that replaces the commented-out div approach with a `requestAnimationFrame`-driven canvas render loop. The `[data-cursor]` intersection observation pattern is new but fits the established `ScrollTrigger.create()` model.

**Primary recommendation:** Build incrementally on existing patterns. Extend `initCoreAnimations()` in page-animations.tsx, wire `[data-anim="stagger"]` to SFGrid, add the catch-all CSS fallback, write the canvas cursor component, and produce SIGNAL-SPEC.md. Total deliverables: 4 code changes + 1 spec document.

---

## Current SIGNAL State Audit

This is a code-first phase. Understanding what exists prevents duplication and wasted planning cycles.

### What Already Works (DO NOT REBUILD)

| Feature | Location | State |
|---------|----------|-------|
| ScrambleText on page headings | `page-animations.tsx` → `initPageHeadingScramble()` | Works via `setTimeout(0)`, targets `[data-anim="page-heading"]` |
| Hero ScrambleText (multilingual) | `page-animations.tsx` → `initHeroAnimations()` | Full timeline, uses `ScrambleTextPlugin` from gsap-plugins |
| Section reveals | `page-animations.tsx` → `initCoreAnimations()` | `[data-anim="section-reveal"]` ScrollTrigger `onEnter`, 700ms ease-out |
| Component grid converge | `page-animations.tsx` → cells logic | `[data-anim="comp-cell"]` with center-converge stagger, ScrollTrigger once |
| Tag pill entrance | `page-animations.tsx` | `[data-anim="tag"]` ScrollTrigger scale/opacity reveal |
| BG shift (hard cuts) | `page-animations.tsx` → `applyBgShift()` | `step-end` transition, ScrollTrigger `onEnter`/`onEnterBack` |
| Scroll progress bar | `global-effects.tsx` → `ScrollProgress` | rAF-driven scaleX, passive scroll listener |
| VHS overlay | `global-effects.tsx` → `VHSOverlay` | 5-layer GSAP timeline, pauses on tab hidden, respects `prefers-reduced-motion` |
| CircuitDivider draw | `components/animation/circuit-divider.tsx` | DrawSVGPlugin scrub via `gsap-draw.ts`, respects reduced motion |
| Reduced-motion freeze | `gsap-plugins.ts` → `initReducedMotion()` | `gsap.globalTimeline.timeScale(0)` on match |
| CSS reduced-motion resets | `globals.css` ~line 988 | Resets specific `[data-anim]` variants to `opacity:1 !important` |

### What Is Incomplete or Needs Work

| Gap | Detail | SIG requirement |
|-----|--------|-----------------|
| ScrambleText uses `setTimeout(0)` not ScrollTrigger | Fires on DOM ready, not on viewport entry — misses the "on route entry" and "on scroll into view" intent | SIG-01 |
| Asymmetric hover timing not globally applied | `.sf-pressable` uses `--duration-normal`/`--ease-hover` but not the 100ms/400ms asymmetric pattern across all interactives | SIG-02 |
| Section-reveal animation is 700ms ease, not hard-cut | `duration: 0.7, ease: "power2.out"` contradicts SIG-03's instant opacity | SIG-03 |
| No `[data-anim="stagger"]` selector or ScrollTrigger batch | `component-grid.tsx` uses converge, not stagger; SFGrid has no anim wiring at all | SIG-04 |
| CSS fallback is partial | Only 4 specific data-anim values have initial states; `[data-anim]` catch-all missing | SIG-05 |
| Custom cursor commented out | `CustomCursor` in global-effects.tsx is commented out; all cursor CSS in globals.css is in a block comment | SIG-09 |
| No `[data-cursor]` attribute used anywhere | No blocks currently have this attribute | SIG-09 |
| No SIGNAL-SPEC.md document | No mobile behavior spec exists | SIG-10 |

---

## Standard Stack

### Core (Already Installed and Wired)

| Library | Version | Purpose | Note |
|---------|---------|---------|------|
| gsap | 3.12.x | Animation engine | Split: gsap-core.ts (core+ST), gsap-plugins.ts (full), gsap-draw.ts (DrawSVG) |
| gsap/ScrambleTextPlugin | same | Text scramble effect | Registered in gsap-plugins.ts; lazy-loaded in page-animations.tsx |
| gsap/ScrollTrigger | same | Scroll-based triggers | In gsap-core.ts and gsap-plugins.ts |
| @gsap/react useGSAP | same | React cleanup hook | Used in ScrambleText, scroll-reveal; `gsap.context()` for DOM-level code |
| canvas 2D API | native | Particle cursor | No library needed — native `requestAnimationFrame` + `CanvasRenderingContext2D` |

### No New Dependencies

This phase adds zero new npm packages. Everything needed is already installed. The canvas cursor uses the native browser Canvas API.

**Installation:** None required.

---

## Architecture Patterns

### Pattern 1: Data Attribute Bridge (FRAME → SIGNAL)

The established bridge: FRAME components output semantic data attributes, SIGNAL (page-animations.tsx) queries and animates them. This is the project's core animation pattern.

```
SFGrid / SFSection / blocks   →  data-anim="stagger"   →  page-animations.tsx initCoreAnimations()
SFSection                     →  data-cursor            →  canvas cursor IntersectionObserver
globals.css                   →  [data-anim] { opacity:1 }  →  CSS fallback (no-JS visible)
GSAP init                     →  gsap.set("[data-anim]", {opacity:0})  →  GSAP override on mount
```

### Pattern 2: Progressive Enhancement Fallback

**Current state (partial):** Specific data-anim selectors have opacity:0 initial CSS. Reduced-motion block resets them.

**Required state (SIG-05):** A catch-all makes all `[data-anim]` elements visible by default. GSAP explicitly sets opacity:0 at init time before animating. This means: no GSAP = all content visible.

```css
/* In globals.css — catch-all fallback */
[data-anim] {
  /* No opacity:0 here — content visible by default */
}

/* GSAP init (in page-animations.tsx initCoreAnimations) */
/* gsap.set("[data-anim='section-reveal']", { opacity: 0, y: 40 }); */
/* GSAP sets the hidden state, not CSS */
```

**Critical nuance:** This inverts the current model for section-reveal. Currently CSS sets `opacity:0` and GSAP animates to `opacity:1`. The SIG-05 model requires GSAP to set the initial hidden state. The reduced-motion `opacity:1 !important` block provides safety net regardless of which model is used for specific selectors.

**Practical approach:** Keep specific known selectors (`section-reveal`, `tag`, `comp-cell`, `cta-btn`) with CSS initial states since they are well-tested. Add catch-all `[data-anim] { opacity: 1; }` BELOW these specific rules so it only catches unspecified variants. GSAP sets hidden state for any new `[data-anim]` values.

### Pattern 3: Asymmetric Hover Timing (SIG-02)

The locked decision: 100ms snap-in, 400ms ease-out. This maps exactly to `--duration-fast` (100ms) for hover-in, `--duration-slow` (400ms) for hover-out.

CSS transition property order matters — separate properties can have different durations:

```css
/* Base state: slow return (400ms) */
.sf-interactive {
  transition:
    background-color var(--duration-slow) var(--ease-default),
    color var(--duration-slow) var(--ease-default),
    transform var(--duration-slow) var(--ease-default);
}

/* Hover state: fast snap-in (100ms) — overrides duration only */
.sf-interactive:hover {
  transition-duration: var(--duration-fast);
  transition-timing-function: var(--ease-hover);
}
```

**Note:** The existing `.sf-pressable` already partially implements this — it uses `--duration-normal` (200ms) for return. The SIG-02 update changes this to `--duration-slow` (400ms) for return, `--duration-fast` (100ms) for entry.

**Scope of SIG-02:** All interactive elements — `a`, `button`, `[role="button"]`, `input`, `select`, `textarea`. The `.sf-pressable`, `.sf-hoverable`, `.sf-invert-hover`, `.sf-link-draw`, `hero-cta-btn` classes all need alignment to the 100/400ms pattern.

### Pattern 4: Hard-Cut Section Transitions (SIG-03)

**Current:** `section-reveal` animates with `duration: 0.7, ease: "power2.out"` — a soft fade.

**Required:** Replace with `duration: 0.034` (34ms, `--duration-instant`) for section boundary opacity changes. Internal content can still have staggered entry — only the section-level boundary transition cuts.

```javascript
// In initCoreAnimations(), replace section-reveal handler:
onEnter: () => {
  gsap.to(el, {
    opacity: 1,
    duration: 0.034,  // --duration-instant = 34ms
    ease: "none",     // No easing on hard cut
  });
},
```

**Scope clarification:** `[data-anim="section-reveal"]` is the section wrapper. Child elements (stagger, tags) can have their own timing. Only the section entry itself gets the hard cut.

### Pattern 5: ScrollTrigger Batch for Stagger (SIG-04)

`ScrollTrigger.batch()` is the correct GSAP method for staggered child entry. It groups elements that enter the viewport within a given interval and animates them together.

```javascript
// In initCoreAnimations() — add after existing animations:
ScrollTrigger.batch("[data-anim='stagger'] > *", {
  interval: 0.04,       // 40ms stagger
  batchMax: 12,         // Max items per batch
  start: "top 85%",
  onEnter: (batch) => {
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.04,    // 40ms per item
      ease: "power2.out",
    });
  },
  once: true,
});
```

**How it plugs in:** `SFGrid` accepts `...props` which pass through to the div. Blocks using `SFGrid` add `data-anim="stagger"` as a prop. The grid children (cards, cells) get their initial state set via CSS: `[data-anim="stagger"] > * { opacity: 0; transform: translateY(20px); }`.

### Pattern 6: Canvas Cursor with Section Scoping (SIG-09)

The locked decision specifies a canvas-based cursor scoped to `[data-cursor]` sections. This is new territory for the codebase but follows established principles.

**Implementation approach:**

1. New component: `components/animation/canvas-cursor.tsx` — client component, `'use client'`
2. Fixed-position canvas element, full viewport, `pointer-events: none`, `z-index: var(--z-cursor)`
3. `requestAnimationFrame` render loop — draw crosshair at mouse position, decay particle trail
4. `IntersectionObserver` on `[data-cursor]` sections — cursor activates/deactivates on section entry/exit
5. Hidden on `(pointer: coarse)` — same guard as existing CustomCursor

**Particle trail pattern:**
```typescript
type Particle = { x: number; y: number; alpha: number; };
// Each frame: push current mouse pos, reduce alpha on all particles, remove when alpha <= 0
// Draw: crosshair at current pos (4px lines, 48px extent), dots for each particle
```

**Replacing the div cursor:** The existing `CustomCursor` component in global-effects.tsx is commented out. The commented CSS block (~lines 1240-1300 in globals.css) is the div cursor. For Phase 3: uncomment and wire the new canvas component in global-effects.tsx in place of `{/* <CustomCursor /> */}`.

**Section scoping:** `IntersectionObserver` watching `document.querySelectorAll("[data-cursor]")`. On intersect entry → activate cursor. On intersect exit → deactivate. Canvas always renders but crosshair/particles only draw when active.

### Pattern 7: SIGNAL-SPEC.md Document (SIG-10)

This is a documentation deliverable. Output location: `.planning/phases/03-signal-expression/SIGNAL-SPEC.md` (or `public/SIGNAL-SPEC.md` if it's meant to be developer-facing). The planner should decide location based on audience.

**Required content per effect:**
- Effect name
- Timing (in ms, referencing tokens)
- Easing (token name + cubic-bezier value)
- Mobile behavior (collapses to X / persists as Y)
- CSS fallback (what renders if JS fails)
- Reduced-motion (what replaces it)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Text scramble | Custom character-cycling loop | `gsap/ScrambleTextPlugin` (already installed) | Plugin handles character pools, speed, reveal delay, completion detection |
| Scroll batch stagger | Manual IntersectionObserver with queues | `ScrollTrigger.batch()` | Handles viewport grouping, interval timing, `once: true`, cleanup |
| Section enter triggers | Manual scroll event listeners | `ScrollTrigger.create()` (already in use) | Pin, start/end, onEnter/onEnterBack — avoids scroll jank |
| Animation context cleanup | Manual listener removal per component | `gsap.context()` + `ctx.revert()` (already established pattern) | One call reverts all animations, kills all triggers |
| Reduced motion detection | Custom matchMedia per animation | `initReducedMotion()` from gsap-plugins + `gsap.globalTimeline.timeScale(0)` (already wired) | Global freeze, runtime change detection |

**Key insight:** This codebase already has the full GSAP club membership. Every effect maps to an existing plugin. The only custom code needed is the canvas particle trail — there is no plugin for that specific effect.

---

## Common Pitfalls

### Pitfall 1: GSAP Sets Hidden State at Wrong Time (SIG-05 Failure Mode)

**What goes wrong:** If `gsap.set("[data-anim]", { opacity: 0 })` runs before hydration completes, Next.js hydration sees a mismatch between server HTML (opacity unset) and client DOM (opacity:0). This causes either a flash or hydration error.

**Why it happens:** `page-animations.tsx` uses `useEffect(() => { init(); }, [])` which defers until after hydration. The existing `setTimeout(0)` in `initPageHeadingScramble` pushes past React's microtask-based hydration. This is already handled correctly.

**How to avoid:** Any new `gsap.set()` calls that hide content must be inside the `useEffect`'s async `init()` function, not at module scope. Never use `gsap.set()` outside of a useEffect or useGSAP hook.

**Warning signs:** Console hydration warnings mentioning opacity or transform mismatches.

### Pitfall 2: ScrollTrigger Not Refreshing After Dynamic Content (SIG-04)

**What goes wrong:** If `SFGrid` instances render after `PageAnimations` has already called `initCoreAnimations()`, the `ScrollTrigger.batch()` won't pick up the late-rendered elements.

**Why it happens:** `page-animations.tsx` queries the DOM once on mount. Client-rendered content (component tabs, route changes) may add `[data-anim="stagger"]` elements after the initial scan.

**How to avoid:** Call `ScrollTrigger.refresh()` after dynamic content renders, OR use `ScrollTrigger.observe()` which watches for DOM mutations. For Phase 3, the simpler approach: ensure all `[data-anim="stagger"]` grids are server-rendered (RSC default).

**Warning signs:** Grid items that are visible but never animated — they entered the viewport before the trigger registered.

### Pitfall 3: Canvas Cursor RAF Loop on Tab Hidden

**What goes wrong:** `requestAnimationFrame` continues running when the tab is hidden, wasting CPU.

**Why it happens:** rAF is not automatically paused on tab switch.

**How to avoid:** Listen to `document.visibilitychange` and cancel rAF on hidden, restart on visible. The VHSOverlay already implements this pattern with `vhsTl.pause()/resume()` — follow the same model.

**Warning signs:** CPU usage doesn't drop when tab is backgrounded.

### Pitfall 4: Asymmetric Transition Breaks During GSAP Animation (SIG-02 / STP-02)

**What goes wrong:** A GSAP animation runs on an element that also has CSS `transition` defined. GSAP and CSS transitions conflict — GSAP injects inline styles which can fight with transition declarations.

**Why it happens:** GSAP uses inline styles. CSS transitions apply to all style changes including inline ones. Both compete on the same properties.

**How to avoid:** Use `overwrite: true` in GSAP tweens that target the same properties as CSS transitions. Or separate concerns: GSAP for entrance, CSS transitions for hover. The current codebase correctly separates `transform` (GSAP entrance) from `transition-colors` (CSS hover) on buttons — maintain this separation.

**Warning signs:** Hover state animates slowly during page load (GSAP entrance still running), or hover snaps but return is instant (GSAP cleared the transition).

### Pitfall 5: ScrambleText Fires Multiple Times on Re-render (SIG-01)

**What goes wrong:** React strict mode double-invokes effects. The `setTimeout(0)` in `initPageHeadingScramble` can fire twice in dev, causing scramble to run twice or error.

**Why it happens:** React 18 strict mode mounts, unmounts, remounts components in dev to surface side-effects.

**How to avoid:** The existing `cancelledRef.current = true` pattern in `page-animations.tsx` already guards against this — the cleanup sets `cancelledRef.current = true` and async functions check it before proceeding. Maintain this guard in any new async animation code.

**Warning signs:** Scramble text appears to run twice or produce garbled output in development.

---

## Code Examples

### SIG-01: ScrambleText on Route Entry via ScrollTrigger

Current code in page-animations.tsx defers via `setTimeout(0)`. The locked decision requires `onEnter` from ScrollTrigger for viewport-relative triggering. For page headings that are above-the-fold (already visible), ScrollTrigger `start: "top bottom"` triggers immediately.

```javascript
// Source: lib/gsap-core.ts (ScrollTrigger already imported)
// Replace initPageHeadingScramble in page-animations.tsx:
async function initPageHeadingScramble(headings: NodeListOf<Element>) {
  const { ScrambleTextPlugin } = await import("@/lib/gsap-plugins");
  if (!ScrambleTextPlugin) return;

  headings.forEach((el, i) => {
    const htmlEl = el as HTMLElement;
    const originalText = htmlEl.textContent || "";

    ScrollTrigger.create({
      trigger: htmlEl,
      start: "top bottom", // triggers even if already in viewport
      once: true,
      onEnter: () => {
        gsap.to(htmlEl, {
          duration: 0.8,
          delay: 0.1 + i * 0.05,
          scrambleText: {
            text: originalText,
            chars: "01!<>-_\\/[]{}—=+*^?#",
            speed: 0.4,
          },
        });
      },
    });
  });
}
```

### SIG-02: Asymmetric Hover — Global CSS Rule

```css
/* In globals.css @layer utilities — new .sf-interactive utility */
.sf-interactive {
  transition:
    background-color var(--duration-slow) var(--ease-default),
    color var(--duration-slow) var(--ease-default),
    border-color var(--duration-slow) var(--ease-default),
    transform var(--duration-slow) var(--ease-default),
    opacity var(--duration-slow) var(--ease-default);
}
.sf-interactive:hover {
  transition-duration: var(--duration-fast); /* 100ms snap-in */
  transition-timing-function: var(--ease-hover);
}

/* Update existing .sf-pressable return duration to 400ms */
.sf-pressable {
  transition:
    transform var(--duration-slow) var(--ease-default), /* was --duration-normal */
    box-shadow var(--duration-slow) var(--ease-default);
}
```

### SIG-03: Hard-Cut Section Reveal

```javascript
// In initCoreAnimations() — replace section-reveal handler:
document.querySelectorAll("[data-anim='section-reveal']").forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () => {
      gsap.to(el, {
        opacity: 1,
        duration: 0.034, // --duration-instant = 34ms
        ease: "none",
      });
    },
  });
});
```

### SIG-04: ScrollTrigger.batch Stagger

```javascript
// In initCoreAnimations() — add new block:
// Set initial state for stagger children (GSAP sets hidden state, not CSS)
gsap.set("[data-anim='stagger'] > *", { opacity: 0, y: 20 });

ScrollTrigger.batch("[data-anim='stagger'] > *", {
  interval: 0.04,  // 40ms grouping window
  start: "top 85%",
  onEnter: (batch) => {
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.04, // 40ms per item
      ease: "power2.out",
    });
  },
  once: true,
});
```

**SFGrid usage pattern (in blocks):**
```tsx
// Add data-anim="stagger" to SFGrid instances that should stagger:
<SFGrid cols="3" gap="6" data-anim="stagger">
  <ComponentCard ... />
  <ComponentCard ... />
  <ComponentCard ... />
</SFGrid>
```

### SIG-05: CSS Progressive Enhancement Catch-All

```css
/* In globals.css — add AFTER the specific [data-anim="..."] initial state rules */
/* Catch-all: any data-anim variant not explicitly listed above starts visible */
/* GSAP will set opacity:0 before animating for known variants */
[data-anim]:not([data-anim="section-reveal"]):not([data-anim="tag"]):not([data-anim="comp-cell"]):not([data-anim="cta-btn"]):not([data-anim="stagger"]) {
  /* No opacity:0 — visible by default */
  /* GSAP sets hidden state at runtime for managed variants */
}

/* Reduced-motion catch-all: ensure ALL data-anim variants are visible */
@media (prefers-reduced-motion: reduce) {
  [data-anim] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

**Simpler alternative (preferred):** Remove CSS initial states from `[data-anim="section-reveal"]` etc., and have GSAP set all initial hidden states at mount time. This is cleaner but risks a flash-of-content before GSAP runs. Current model (CSS sets hidden, GSAP reveals) is safer for CLS — keep it, just extend the reduced-motion catch-all.

### SIG-09: Canvas Cursor Component Sketch

```typescript
// components/animation/canvas-cursor.tsx
"use client";
import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; alpha: number };

export function CanvasCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let rafId = 0;
    let active = false;
    let mouseX = 0, mouseY = 0;
    const particles: Particle[] = [];
    const MAX_PARTICLES = 20;
    const DECAY = 0.06; // alpha reduction per frame

    // Resize canvas to viewport
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Track mouse
    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (active) {
        particles.push({ x: mouseX, y: mouseY, alpha: 0.6 });
        if (particles.length > MAX_PARTICLES) particles.shift();
      }
    }
    document.addEventListener("mousemove", onMove);

    // Section scoping via IntersectionObserver
    const sections = document.querySelectorAll("[data-cursor]");
    const observer = new IntersectionObserver(
      (entries) => {
        const anyIntersecting = entries.some((e) => e.isIntersecting);
        active = anyIntersecting;
        if (!active) {
          particles.length = 0;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      },
      { threshold: 0.1 }
    );
    sections.forEach((s) => observer.observe(s));

    // Render loop
    function render() {
      rafId = requestAnimationFrame(render);
      if (!active) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particle trail
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= DECAY;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.65 0.3 350 / ${p.alpha})`;
        ctx.fill();
      }

      // Draw crosshair
      const size = 24;
      const gap = 4;
      ctx.strokeStyle = "oklch(0.65 0.3 350)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mouseX - size, mouseY);
      ctx.lineTo(mouseX - gap, mouseY);
      ctx.moveTo(mouseX + gap, mouseY);
      ctx.lineTo(mouseX + size, mouseY);
      ctx.moveTo(mouseX, mouseY - size);
      ctx.lineTo(mouseX, mouseY - gap);
      ctx.moveTo(mouseX, mouseY + gap);
      ctx.lineTo(mouseX, mouseY + size);
      ctx.stroke();
    }

    // Pause on tab hidden
    function onVisibility() {
      if (document.hidden) cancelAnimationFrame(rafId);
      else render();
    }
    document.addEventListener("visibilitychange", onVisibility);

    render();

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: "var(--z-cursor)",
      }}
    />
  );
}
```

**Integration in global-effects.tsx:** Replace `{/* <CustomCursor /> */}` with `<CanvasCursor />`. Import at top.

---

## State of the Art

| Old Approach | Current Approach | Phase 3 Change | Impact |
|--------------|------------------|----------------|--------|
| CSS initial state for all [data-anim] | CSS for known variants, GSAP for heroes | Add catch-all reduced-motion rule + new stagger variant | SIG-05 complete |
| ScrambleText via setTimeout(0) | setTimeout(0) defers past hydration | Replace with ScrollTrigger `onEnter` | SIG-01 — viewport-aware firing |
| Section reveals: 700ms ease-out fade | ScrollTrigger onEnter, duration 0.7 | Replace with 34ms hard cut | SIG-03 — DU/TDR aesthetic |
| No stagger on SFGrid | No wiring | ScrollTrigger.batch on [data-anim="stagger"] | SIG-04 — grid stagger |
| Div-based cursor (commented out) | No cursor active | Canvas cursor, [data-cursor] scoped | SIG-09 — new component |
| Hover timing: mixed durations | sf-pressable: --duration-normal return | Standardize: 100ms in / 400ms out everywhere | SIG-02 — consistent vocab |

**Deprecated/outdated in this codebase:**
- `setTimeout(0)` in `initPageHeadingScramble` — replace with ScrollTrigger onEnter (SIG-01)
- Div-based CustomCursor with mix-blend-mode — the entire commented-out block. Canvas is the replacement.
- 700ms `ease: "power2.out"` on section-reveal — hard-cut replacement (SIG-03)

---

## Integration Points Requiring Attention

### page-animations.tsx — Primary Change Target

All SIG-01, SIG-03, SIG-04 changes land in `initCoreAnimations()`. This function is called once per mount. Changes here are global.

- `initPageHeadingScramble` needs replacement (SIG-01)
- `section-reveal` handler duration needs update (SIG-03)
- New `ScrollTrigger.batch` block for stagger (SIG-04)
- Any new `gsap.set()` must remain inside the async `init()` guard

### globals.css — Two Change Areas

1. Asymmetric hover: update `.sf-pressable`, `.sf-hoverable`, `.sf-invert-hover` return durations to `--duration-slow`. Add new `.sf-interactive` utility if needed (SIG-02).
2. Progressive enhancement: extend reduced-motion block with `[data-anim]` catch-all (SIG-05).

### global-effects.tsx — Cursor Activation

Replace `{/* <CustomCursor /> */}` comment with `<CanvasCursor />`. The commented-out CSS cursor block in globals.css (lines 1240-1300) can remain commented — it documents the prior approach.

### SFGrid (sf-grid.tsx) — No Code Change

SFGrid already passes `...props` so `data-anim="stagger"` can be added by block authors. No changes to SFGrid needed. Blocks need the attribute added.

### SIGNAL-SPEC.md — New File

Spec document covering all active SIGNAL effects. Suggested location: `docs/SIGNAL-SPEC.md` or at project root. Should be readable without opening code.

---

## Open Questions

1. **Hard-cut scope: does section-reveal need y-transform removed?**
   - What we know: current section-reveal does `y: 40px → 0` + opacity. Hard-cut (SIG-03) specifies opacity: 0→1 only.
   - What's unclear: does the user also want y-transform removed, or just the duration shortened?
   - Recommendation: Remove y-transform entirely for section-level elements (hard cuts don't translate). Child elements can still use y-stagger.

2. **[data-cursor] blocks: which existing blocks should get this attribute?**
   - What we know: no blocks currently use `[data-cursor]`. The canvas cursor will be invisible everywhere until at least one block is tagged.
   - What's unclear: intended scope (hero only? all blocks? certain sections?)
   - Recommendation: Tag the hero block and one or two content blocks as a proof-of-concept in Phase 3. Full coverage is Phase 4/5 territory.

3. **SIGNAL-SPEC.md location**
   - What we know: SIG-10 requires a spec document developers can read without opening code.
   - What's unclear: should it be in `.planning/`, `docs/`, or project root?
   - Recommendation: `docs/SIGNAL-SPEC.md` — outside `.planning/` (which is tooling, not product docs), accessible to external developers.

4. **Asymmetric hover on SFButton: interaction with GSAP click-pop**
   - What we know: `initCoreAnimations` already applies click-pop via GSAP `fromTo` on `.sf-pressable` elements. CSS transition and GSAP animate the same `transform` property.
   - What's unclear: will SIG-02's transition update cause conflict on comp-cells that also get GSAP click-pop?
   - Recommendation: Per Plan 02-02's precedent (SFButton audit found no conflict because `transition-colors` and `transform` are separate properties), verify the click-pop uses `overwrite: true`. If not, add it.

---

## Validation Architecture

> nyquist_validation key is absent from .planning/config.json — treating as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test directory |
| Config file | None |
| Quick run command | Visual QA: `npm run dev` then manual browser check |
| Full suite command | `npx next build` — TypeScript compile + build validation |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SIG-01 | ScrambleText fires on page-heading elements entering viewport | manual-visual | `npm run dev` → navigate to `/components`, observe heading scramble | N/A |
| SIG-02 | All interactive elements: 100ms hover-in, 400ms hover-out | manual-visual | `npm run dev` → hover any button, measure with DevTools animation panel | N/A |
| SIG-03 | Section entry is instant (34ms), no soft fade | manual-visual | `npm run dev` → scroll through homepage, observe section boundaries | N/A |
| SIG-04 | Grid children stagger 40ms on scroll reveal | manual-visual | `npm run dev` → scroll to component grid | N/A |
| SIG-05 | Content visible without JS | manual-JS-disabled | Disable JS in DevTools → verify all content readable | N/A |
| SIG-09 | Cursor appears on [data-cursor] sections, hidden on mobile | manual-visual | `npm run dev` → resize to mobile, verify cursor hidden | N/A |
| SIG-10 | SIGNAL-SPEC.md exists and is complete | file-check | `ls docs/SIGNAL-SPEC.md` | ❌ Wave 0 |
| SIG-06 | DEFERRED | — | — | N/A |
| SIG-07 | DEFERRED | — | — | N/A |
| SIG-08 | DEFERRED | — | — | N/A |

**Manual-only justification:** All SIGNAL effects are visual/interaction-based. Automated assertion of timing durations, opacity values, and animation firing would require a headless browser with animation timing support (Playwright) — out of scope for this phase. Build verification (`npx next build`) catches TypeScript errors and import failures.

**Existing TypeScript blocker:** STATE.md notes a pre-existing TS error in `components/animation/color-cycle-frame.tsx` (useRef missing argument) that blocks `npx next build`. This may need resolution before Phase 3 build verification.

### Sampling Rate
- **Per task commit:** `npm run dev` — verify feature renders without console errors
- **Per wave merge:** `npx next build` — TypeScript clean (resolve color-cycle-frame.tsx blocker first)
- **Phase gate:** Full build green + visual QA of all SIG-01 through SIG-10 behaviors

### Wave 0 Gaps
- [ ] `docs/SIGNAL-SPEC.md` — created as part of SIG-10 implementation (Wave 1 or 2)
- [ ] Resolve `color-cycle-frame.tsx` useRef TS error — blocks `npx next build`

---

## Sources

### Primary (HIGH confidence)
- Codebase: `components/layout/page-animations.tsx` — full GSAP orchestration pattern
- Codebase: `lib/gsap-core.ts`, `lib/gsap-plugins.ts`, `lib/gsap-draw.ts` — bundle split
- Codebase: `app/globals.css` lines 138-146 — motion token values
- Codebase: `app/globals.css` lines 987-1001 — reduced-motion resets
- Codebase: `app/globals.css` lines 1015-1038 — `[data-anim]` CSS initial states
- Codebase: `components/layout/global-effects.tsx` — CustomCursor (commented), VHSOverlay, ScrollProgress
- Codebase: `components/animation/scramble-text.tsx` — ScrambleText component
- Codebase: `app/globals.css` lines 1240-1300 — cursor CSS (commented)
- `.planning/phases/03-signal-expression/03-CONTEXT.md` — locked decisions

### Secondary (MEDIUM confidence)
- GSAP ScrollTrigger.batch() — documented in GSAP Club docs; pattern verified against existing ScrollTrigger.create() usage in codebase
- Canvas API particle system — standard browser API, no version concerns
- IntersectionObserver — baseline supported in all modern browsers; no polyfill needed for this project's target

### Tertiary (LOW confidence)
- `requestAnimationFrame` pause-on-hidden pattern — inferred from VHSOverlay's `visibilitychange` implementation; not officially documented as a GSAP or canvas best practice

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — entire stack is already installed and in use
- Architecture patterns: HIGH — all patterns derived from existing code, not from external sources
- Pitfalls: HIGH — derived from actual code inspection of existing guards and comments in the codebase
- Canvas cursor: MEDIUM — no prior canvas code in codebase; pattern is standard but new to this project

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (stable — GSAP 3.12 APIs are stable; Next.js 15.3 APIs stable)
