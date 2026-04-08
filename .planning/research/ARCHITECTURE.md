# Architecture Research — v1.5 Redesign

**Domain:** Design system showcase site — 6-section homepage, route renames, 200-300vh scroll sections, multiple WebGL scenes, 4 redesigned subpages
**Researched:** 2026-04-07
**Confidence:** HIGH — all findings based on direct codebase audit of existing implementation

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ROUTE LAYER (app/)                              │
│                                                                       │
│  /           /inventory      /tokens     /start    /reference        │
│  (was /)     (was /components) (same)    (same)    (same)            │
│  Server      Server           Server     Server    Server            │
│                                                                       │
│  next.config.ts: redirects /components → /inventory (308 permanent) │
└──────────────────────────┬──────────────────────────────────────────┘
                            │
┌──────────────────────────▼──────────────────────────────────────────┐
│                     BLOCK LAYER (components/blocks/)                  │
│                                                                       │
│  HomePage sections (NEW):     Existing subpage blocks:               │
│  EntryHero                    ComponentsExplorer (→/inventory)       │
│  ProofSection                 ComponentDetail                        │
│  SignalSection                APIExplorer                            │
│  SystemSection                TokenExplorer                          │
│  PhilosophySection            StartGuide                             │
│  CtaSection                                                          │
└──────────────────────────┬──────────────────────────────────────────┘
                            │
┌──────────────────────────▼──────────────────────────────────────────┐
│                   WEBGL LAYER (SignalCanvas singleton)                │
│                                                                       │
│  SignalCanvas (fixed canvas, z:-1, full viewport)                    │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Map<id, SceneEntry>                                            │  │
│  │                                                                  │  │
│  │  Scene A: EntryHero GLSL field (GLSLHero pattern)               │  │
│  │  Scene B: ProofSection demo mesh (SignalMesh pattern)           │  │
│  │  Scene C: SignalSection generative field                        │  │
│  │                                                                  │  │
│  │  renderAllScenes() — scissor/viewport split per scene rect      │  │
│  │  IntersectionObserver per scene — offscreen scenes skip loop    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  GSAP ticker: single RAF loop drives all 3 scenes simultaneously     │
└──────────────────────────┬──────────────────────────────────────────┘
                            │
┌──────────────────────────▼──────────────────────────────────────────┐
│              SCROLL LAYER (Lenis + GSAP ScrollTrigger)                │
│                                                                       │
│  LenisProvider: instance.on("scroll", ScrollTrigger.update)          │
│  gsap.ticker drives both Lenis.raf() AND SignalCanvas render loop    │
│                                                                       │
│  Per-section ScrollTriggers:                                          │
│  - Standard sections: once: true reveal animations                   │
│  - PinnedSection (200-300vh): pin: true, scrub: 1, anticipatePin:1   │
│    ↳ gsap.context().revert() on unmount — critical for cleanup       │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | State |
|-----------|----------------|-------|
| `app/page.tsx` | 6-section homepage shell, Server Component, metadata | REWRITE |
| `components/blocks/entry-hero.tsx` | ENTRY section — hero content + GLSLHero WebGL background | NEW |
| `components/blocks/proof-section.tsx` | PROOF section — live component demo + SignalMesh WebGL | NEW |
| `components/blocks/signal-section.tsx` | SIGNAL section — generative surface explainer + 3rd WebGL scene | NEW |
| `components/blocks/system-section.tsx` | SYSTEM section — token/component counts, static or mild animation | NEW |
| `components/blocks/philosophy-section.tsx` | PHILOSOPHY section — FRAME/SIGNAL theory, DU/TDR lineage | NEW |
| `components/blocks/cta-section.tsx` | CTA section — call to action, links to /inventory and /start | NEW |
| `components/animation/pinned-section.tsx` | 200-300vh pin/scrub scroll container — reusable wrapper | NEW |
| `app/inventory/page.tsx` | Renamed /components route — identical to current /components/page.tsx | NEW (copy) |
| `app/components/` directory | Deleted after redirect is confirmed working | DELETE |
| `next.config.ts` | Permanent 308 redirects: /components → /inventory | MODIFY |
| `lib/signal-canvas.tsx` | No changes required — singleton handles N scenes already | UNCHANGED |
| `hooks/use-signal-scene.ts` | No changes required — UUID-keyed, supports concurrent registrations | UNCHANGED |
| `components/layout/page-animations.tsx` | Add data-anim selectors for new homepage sections | MODIFY |

---

## Question 1: Can SignalCanvas Handle 3 WebGL Scenes on One Page?

**Answer: YES — the architecture already supports this. No changes to the singleton required.**

The singleton uses `Map<string, SceneEntry>` keyed by `crypto.randomUUID()`. Each `useSignalScene()` call registers one entry. The `renderAllScenes()` function iterates all entries and uses WebGL scissor/viewport splitting to isolate each scene to its container's `getBoundingClientRect()`. Three concurrent scenes means three scissor calls per GSAP ticker frame.

**Key verified facts from codebase audit:**
- `registerScene()` and `deregisterScene()` are already N-safe — no singleton assumptions about exactly 1 scene
- `IntersectionObserver` per scene already gates offscreen scenes out of the render loop — critical when 3 scenes exist and the user is not in all of their viewports simultaneously
- `disposeScene()` is called on unmount by the hook — GPU memory for unmounted scenes is correctly freed
- The single WebGL renderer is reused across all scenes — this is correct; multiple WebGLRenderer instances on one page is a known GPU context limit pitfall

**Performance constraint:** Three scenes that are all simultaneously visible will all render every ticker frame. The existing `if (!entry.visible) return` guard in `renderAllScenes()` relies on the IntersectionObserver correctly tracking visibility. If the page is laid out such that all 3 scene containers are on-screen at the same time, all 3 will render. Design the sections to have sufficient height so only 1-2 are intersecting at any given scroll position.

**MutationObserver duplication risk:** Each WebGL component (`GLSLHero`, `SignalMesh`) declares its own module-level `_signalObserver`. If a third component follows the same pattern with a module-level variable, all three will share-clobber the same observer slot at the module level. The fix: move MutationObserver management into the singleton (`lib/signal-canvas.tsx`) as a shared observer, called once. Each scene reads the cached values from the singleton. This prevents 3 separate observers on `document.documentElement`.

---

## Question 2: Route Rename — /components → /inventory

**Mechanism: `next.config.ts` `redirects` array + new `app/inventory/` directory.**

This is the lowest-risk approach. The redirects function runs at the edge, before React rendering. No middleware needed.

**Exact implementation pattern** (verified against Next.js App Router docs):

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async redirects() {
    return [
      {
        source: "/components",
        destination: "/inventory",
        permanent: true,  // 308 — tells search engines and browsers to update bookmarks
      },
      {
        source: "/components/:path*",
        destination: "/inventory/:path*",
        permanent: true,  // Covers any subroutes that may exist in future
      },
    ];
  },
};
```

**Build order for this rename:**
1. Create `app/inventory/` directory with `page.tsx` (copy from `app/components/page.tsx`)
2. Add redirects to `next.config.ts`
3. Update all internal `href="/components"` links (Nav, any CTA buttons) to `href="/inventory"`
4. Verify redirect works in dev before deleting `app/components/`
5. Delete `app/components/` directory

**Internal link audit targets** — these must be found and updated:
- `components/layout/nav.tsx` — nav links
- Any `href="/components"` in block components
- `app/sitemap.ts` — sitemap entries

**Status code choice: 308 not 307.** 308 is permanent redirect (preserves POST method, same as 301 but method-preserving). `permanent: true` in Next.js config emits 308. Crawlers and browsers will update cached URLs. For a design system docs site where the URL is referenced externally, 308 is correct.

---

## Question 3: 200-300vh Scroll-Driven Section Architecture

**Pattern: Pinned wrapper component with GSAP timeline + scrub.**

The existing `HorizontalScroll` component in `components/animation/horizontal-scroll.tsx` establishes the pattern for pin/scrub sections. The v1.5 scroll section needs a vertical pin variant.

**Verified integration with Lenis:** The existing `LenisProvider` already wires `instance.on("scroll", ScrollTrigger.update)` and drives Lenis via `gsap.ticker`. This is the correct integration. ScrollTrigger receives Lenis-smoothed scroll positions. Pin/scrub sections work with this setup without additional configuration.

**Known Lenis + pin issue from community research:** When `pin: true` is combined with `once: false` (scrub), window resize while scrolled can cause ScrollTrigger positions to shift. The fix is `invalidateOnRefresh: true` on the ScrollTrigger config, which tells GSAP to recalculate start/end positions on refresh. The existing `HorizontalScroll` already uses this pattern.

**Reusable PinnedSection component pattern:**

```typescript
// components/animation/pinned-section.tsx
"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-core";

interface PinnedSectionProps {
  children: (progress: gsap.core.Tween) => ReactNode;
  /** Total scroll distance in viewport heights. Default: 2 (200vh) */
  scrollVh?: number;
  /** Scrub smoothing. 1 = 1s lag. true = instant. Default: 1 */
  scrub?: number | boolean;
  className?: string;
}

export function PinnedSection({ children, scrollVh = 2, scrub = 1, className }: PinnedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub,
          anticipatePin: 1,           // prevents pin flash on fast scroll
          start: "top top",
          end: () => `+=${scrollVh * window.innerHeight}`,
          invalidateOnRefresh: true,  // recalculate on resize — required for Lenis compat
        },
      });
      timelineRef.current = tl;
    });

    return () => ctx.revert();
  }, [scrollVh, scrub]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ height: "100vh" }}  // Viewport height — pin adds scroll space automatically
    >
      {/* children receive no timeline ref — they use data-anim selectors driven by PageAnimations */}
      {typeof children === "function" ? children(timelineRef.current!) : children}
    </div>
  );
}
```

**Simpler alternative for v1.5 (recommended):** Rather than a render-prop pattern, use a straightforward block component where the pinned section's internal animations are wired in `PageAnimations.initCoreAnimations()` via `data-anim` selectors. This keeps WebGL and scroll logic separated and avoids prop-drilling the timeline.

**Critical measurement:** GSAP's `pin: true` creates a spacer div equal to the scroll distance (`end - start`). For a 200vh pin, the total page height increases by 200vh. This is expected and intentional — the user scrolls 200vh while the element stays fixed. The spacer ensures downstream content scrolls correctly after the pin releases.

---

## Question 4: 6-Section Homepage and SFSection/data-anim System

**The 6-section structure slots directly into the existing system. No architectural changes needed to SFSection, PageAnimations, or the bg-shift system.**

**Current homepage:** 7 SFSection instances (hero, manifesto, signal/frame, stats, code, components) using `data-bg-shift`, `data-section`, `data-section-label`, `data-anim` attributes. `PageAnimations` wires all animations via `document.querySelectorAll("[data-anim='...']")`.

**v1.5 homepage:** 6 named SFSection instances (ENTRY, PROOF, SIGNAL, SYSTEM, PHILOSOPHY, CTA). The existing attribute system supports this without modification.

**New data-anim values needed for v1.5 sections:**

| Section | data-anim values | Notes |
|---------|-----------------|-------|
| ENTRY | `hero-title`, `hero-subtitle`, `cta-btn` | Reuse existing values where semantics match |
| PROOF | `proof-demo`, `proof-label` | New — component demo live preview |
| SIGNAL | `signal-mesh` | WebGL scene — same as existing `hero-mesh` pattern |
| SYSTEM | `stat-number` (reuse), `system-label` | Reuse stat count-up pattern |
| PHILOSOPHY | `section-reveal` (reuse) | Standard stagger reveal is sufficient |
| CTA | `cta-btn` (reuse) | Existing click-pop behavior already handles this |

**bg-shift for 6 sections:** The existing `applyBgShift()` function reads `data-bg-shift` attribute and switches between the dark/light backgrounds. For 6 sections, assign alternating values:

```
ENTRY:       data-bg-shift="black"
PROOF:       data-bg-shift="white"
SIGNAL:      data-bg-shift="black"
SYSTEM:      data-bg-shift="white"
PHILOSOPHY:  data-bg-shift="black"
CTA:         data-bg-shift="white"
```

**SFSection spacing for scroll-pinned sections:** Any section containing a `PinnedSection` should use `className="py-0"` on the SFSection wrapper, as the pinned content manages its own internal layout. All other sections continue using the existing `spacing` prop.

**The existing `#bg-shift-wrapper` div wraps all SFSection instances.** The new homepage structure continues this pattern — all 6 sections go inside `#bg-shift-wrapper`, and CTA/footer go outside it as now.

---

## Question 5: Build Order

Dependencies drive the sequence. Each phase has a hard prerequisite.

### Phase 1: Route Infrastructure (no prerequisites)

**1a.** Create `app/inventory/` directory and copy/adapt `app/components/page.tsx` → `app/inventory/page.tsx`. Update metadata title.

**1b.** Add `redirects()` to `next.config.ts` with two entries: `/components` and `/components/:path*`.

**1c.** Audit and update all internal `href="/components"` links in Nav, blocks, sitemap.

**1d.** Verify redirect works in `next dev`. Delete `app/components/` directory.

**Why first:** Route infrastructure is pure filesystem + config work. Zero risk of breaking existing pages. Establishes the correct URL structure before new pages reference it.

**Output:** Working `/inventory` route, `/components` → `/inventory` permanent redirect, clean internal links.

---

### Phase 2: SignalCanvas MutationObserver Consolidation (depends on: nothing, but unblocks Phase 3)

Move the module-level `_signalObserver` / `readSignalVars()` / `ensureSignalObserver()` pattern from individual components (`glsl-hero.tsx`, `signal-mesh.tsx`) into `lib/signal-canvas.tsx` as a shared module-level observer. Expose `getSignalVars()` function that returns cached `{ intensity, speed, accent }`. Both existing and new WebGL components call `getSignalVars()` from the ticker instead of maintaining their own observers.

**Why this phase, why now:** With 3 WebGL scenes on the homepage, three separate MutationObservers watching `document.documentElement` would fire `readSignalVars()` 3x on every `:root` style change. One shared observer fires once. This is a small refactor (~30 lines) with zero visual impact.

**Output:** Updated `lib/signal-canvas.tsx`, updated `glsl-hero.tsx`, updated `signal-mesh.tsx`.

---

### Phase 3: PinnedSection Component (depends on: Phase 2 optional, but clean)

Create `components/animation/pinned-section.tsx` as a reusable 200-300vh scroll container. Wire its internal `data-anim` targets into `PageAnimations.initCoreAnimations()`. Test with a placeholder content section before connecting WebGL scenes.

**Critical config:**
```
pin: true
scrub: 1
anticipatePin: 1
invalidateOnRefresh: true
start: "top top"
end: () => `+=${scrollVh * window.innerHeight}`
```

**Mobile fallback:** For viewport width < 768px, skip the pin and render content as a standard scroll section (same pattern as `HorizontalScroll`). Pin/scrub UX requires sufficient vertical scroll space that mobile viewports often don't provide cleanly.

**Output:** `components/animation/pinned-section.tsx`.

---

### Phase 4: New WebGL Scene Component (depends on: Phase 2 MutationObserver consolidation)

Build the third WebGL scene for the SIGNAL section. Follow the `GLSLHero` pattern exactly:
- `useSignalScene()` hook with `buildScene()` factory
- Uniforms stored in ref for ticker/ScrollTrigger mutation
- `IntersectionObserver` already handled by `useSignalScene()`
- Reduced-motion → static fallback div
- Export as `SignalField` or similar, with a `*-lazy.tsx` wrapper using `next/dynamic({ ssr: false })`

**Why Phase 4 not Phase 1:** The singleton consolidation in Phase 2 should happen before adding a third scene component that would otherwise introduce a third MutationObserver.

**Output:** `components/animation/signal-field.tsx` (or similar), `components/animation/signal-field-lazy.tsx`.

---

### Phase 5: 6-Section Homepage Block Components (depends on: Phases 3-4 components exist)

Build 6 block components in `components/blocks/`:

- `entry-hero.tsx` — replaces existing `Hero` block. Uses existing `GLSLHeroLazy` as WebGL background. Reuses existing hero animation system (`data-anim='hero-title'` etc). This is primarily a **content and layout redesign** of the existing hero.
- `proof-section.tsx` — uses existing `SignalMeshLazy` for WebGL. Live demo of a component (likely `SFButton` or `SFCard`) as PROOF of system quality.
- `signal-section.tsx` — uses new `SignalFieldLazy`. Contains `PinnedSection` wrapper if the 200-300vh scroll section lives here.
- `system-section.tsx` — stats, component counts. Reuses `data-anim='stat-number'` count-up pattern.
- `philosophy-section.tsx` — text-driven, standard `section-reveal` animation.
- `cta-section.tsx` — links to `/inventory` and `/start`. Reuses `data-anim='cta-btn'`.

**Rewrite `app/page.tsx`** to compose these 6 blocks within `#bg-shift-wrapper` with the correct `data-bg-shift` alternation.

**Output:** 6 new/rewritten block files, rewritten `app/page.tsx`.

---

### Phase 6: PageAnimations Update + Subpage Redesigns (depends on: Phase 5 page exists in DOM)

**6a.** Add `data-anim` selectors for any new values introduced in Phase 5 to `initCoreAnimations()` in `page-animations.tsx`. Existing selectors continue to work unchanged.

**6b.** Redesign the 4 subpages (`/inventory`, `/tokens`, `/start`, `/reference`). These are independent of the homepage work — each can be built incrementally. The existing block components for these pages are the starting point.

**Output:** Updated `page-animations.tsx`, redesigned subpage blocks.

---

## Data Flow

### WebGL Multi-Scene Render Flow (3 scenes, one page)

```
GSAP ticker fires (~60fps)
    ↓
LenisProvider tickerCallback: lenis.raf(time * 1000)
    ↓
SignalCanvas tickerCallback: renderAllScenes(state)
    ↓
For each SceneEntry in state.scenes Map:
    ├── entry.visible === false? → skip (IntersectionObserver gate)
    ├── entry.element.getBoundingClientRect() → scissor rect
    ├── renderer.setScissor(rect) + renderer.setViewport(rect)
    └── entry.renderFn(scene, camera) → WebGL draw call
    ↓
Each component's ScrollTrigger onUpdate:
    └── directly mutates entry's uniformsRef.current values
        (no setState, no re-render — pure uniform mutation)
```

### Route Rename Redirect Flow

```
Browser requests /components
    ↓
Next.js edge: matches redirects[0].source === "/components"
    ↓
308 Permanent Redirect → Location: /inventory
    ↓
Browser requests /inventory
    ↓
app/inventory/page.tsx renders (Server Component)
```

### Scroll-Pinned Section Flow

```
User scrolls into PinnedSection trigger
    ↓
GSAP ScrollTrigger: pin: true → element switches to position: fixed
                    spacer div inserted to maintain document flow
    ↓
As user continues scrolling (200-300vh of scroll space consumed):
    scrub: 1 → timeline.progress() updates with 1s lag
    onUpdate → data-anim targets animate (opacity, transform, etc.)
    WebGL uniforms mutate directly via ScrollTrigger onUpdate
    ↓
User exits pin range:
    element unpins → returns to document flow
    spacer div removed
```

### MutationObserver Signal Bridge (consolidated)

```
CSS: document.documentElement.style.setProperty("--signal-intensity", "0.8")
    ↓
MutationObserver (ONE, in signal-canvas.tsx singleton): fires readSignalVars()
    ↓
Updates module-level cache: { intensity: 0.8, speed: 1.0, accent: 0.0 }
    ↓
GSAP ticker (each frame):
    Scene A tickerFn: reads getSignalVars().intensity → uniform update
    Scene B tickerFn: reads getSignalVars().intensity → uniform update
    Scene C tickerFn: reads getSignalVars().intensity → uniform update
```

---

## Integration Points

### New vs Modified Files

| File | Change Type | What Changes | Integrates With |
|------|------------|--------------|-----------------|
| `app/inventory/page.tsx` | NEW (copy) | Renamed route | `components/blocks/components-explorer.tsx`, `component-registry.ts` |
| `app/inventory/` dir | NEW | Directory for renamed route | Next.js App Router |
| `app/components/` dir | DELETE | Removed after redirect verified | n/a |
| `next.config.ts` | MODIFY | Add `redirects()` async function | Next.js edge layer |
| `app/page.tsx` | REWRITE | 6-section structure, 3 WebGL scenes | 6 new block components, `SignalCanvasLazy` |
| `components/blocks/entry-hero.tsx` | NEW | ENTRY section with GLSLHero WebGL | `GLSLHeroLazy`, existing hero animation data-anim selectors |
| `components/blocks/proof-section.tsx` | NEW | PROOF section with SignalMesh | `SignalMeshLazy` |
| `components/blocks/signal-section.tsx` | NEW | SIGNAL section + optional pinned scroll | `signal-field-lazy.tsx`, `pinned-section.tsx` |
| `components/blocks/system-section.tsx` | NEW | System stats section | `data-anim='stat-number'` count-up, existing pattern |
| `components/blocks/philosophy-section.tsx` | NEW | Philosophy text section | `data-anim='section-reveal'`, existing pattern |
| `components/blocks/cta-section.tsx` | NEW | CTA section | `href="/inventory"`, `href="/start"` |
| `components/animation/pinned-section.tsx` | NEW | 200-300vh pin/scrub wrapper | `lib/gsap-core.ts`, `ScrollTrigger` |
| `components/animation/signal-field.tsx` | NEW | 3rd WebGL scene component | `lib/signal-canvas.tsx`, `useSignalScene`, `gsap-core` |
| `components/animation/signal-field-lazy.tsx` | NEW | SSR-safe dynamic import wrapper | `signal-field.tsx` |
| `lib/signal-canvas.tsx` | MODIFY | Add shared MutationObserver + `getSignalVars()` | All WebGL scene components |
| `components/animation/glsl-hero.tsx` | MODIFY | Remove local MutationObserver, use `getSignalVars()` | `lib/signal-canvas.tsx` |
| `components/animation/signal-mesh.tsx` | MODIFY | Remove local MutationObserver, use `getSignalVars()` | `lib/signal-canvas.tsx` |
| `components/layout/page-animations.tsx` | MODIFY | Add data-anim selectors for new sections | New block components |
| `components/layout/nav.tsx` | MODIFY | Update `/components` → `/inventory` in nav links | Router |
| `app/sitemap.ts` | MODIFY | Update `/components` → `/inventory` | Crawler |

### Internal Boundaries

| Boundary | Communication | Constraint |
|----------|---------------|------------|
| WebGL scenes ↔ SignalCanvas singleton | `useSignalScene()` hook → `registerScene()` / `deregisterScene()` | One-way registration; singleton does not call back into components |
| WebGL scenes ↔ CSS signal vars | `getSignalVars()` from singleton (module-level cache) | Never read CSS in GSAP ticker — always read cached values |
| ScrollTrigger ↔ WebGL uniforms | Direct `uniformsRef.current.uFoo.value = x` mutation | No React state, no re-render — uniform mutation only |
| PinnedSection ↔ Lenis | `ScrollTrigger.update` called on every Lenis scroll event | Already wired in `LenisProvider`; pin sections inherit this automatically |
| New routes ↔ /components redirect | 308 redirect in `next.config.ts` | Processed at edge before React; no component code needed |
| SF block components ↔ SFSection | `data-bg-shift`, `data-section`, `data-anim` attributes | Attribute-driven — no prop APIs needed between section and PageAnimations |

---

## Anti-Patterns

### Anti-Pattern 1: Multiple WebGLRenderer Instances

**What people do:** Create a `new THREE.WebGLRenderer()` inside each WebGL component, one per scene.

**Why it's wrong:** Browsers enforce a limit on concurrent WebGL contexts (typically 8-16, but can be lower on mobile and lower-powered hardware). Three scenes on one page with three renderers consumes 3 contexts. More critically, each renderer maintains its own GPU resources and runs its own render loop, producing CPU/GPU contention and jank.

**Do this instead:** The existing SignalCanvas singleton pattern is the correct answer — one renderer, multiple scenes rendered via scissor/viewport split per GSAP ticker frame. Never create a renderer outside the singleton.

---

### Anti-Pattern 2: Creating a MutationObserver per WebGL Component

**What people do:** Each component file declares its own module-level `_signalObserver` watching `document.documentElement`.

**Why it's wrong:** With 3 WebGL components, 3 observers fire `readSignalVars()` on every `:root` style change. With the current pattern (module-level variable), the third component's observer clobbers the previous two's state — they share the same module-level variable name but each component's module has its own isolated copy. The result is 3x observer callbacks on every CSS variable change.

**Do this instead:** Move `readSignalVars()`, the cached variables, and the observer lifecycle into `lib/signal-canvas.tsx`. Expose a `getSignalVars()` function. One observer fires once; all 3 ticker functions read the same cache.

---

### Anti-Pattern 3: Routing the Rename via `middleware.ts`

**What people do:** Use Next.js middleware to match `/components` and call `NextResponse.redirect()`.

**Why it's wrong:** Middleware runs on every request, including static assets. It adds latency to all routes, not just the renamed one. It's overkill for a permanent URL rename that is known at build time.

**Do this instead:** `next.config.ts` `redirects()` array. Processed at the routing/edge layer before middleware, zero runtime cost after the initial 308 response is cached by browsers and crawlers.

---

### Anti-Pattern 4: Putting PinnedSection Inside a SFSection with Overflow Hidden

**What people do:** Wrap a GSAP-pinned element inside a parent with `overflow: hidden` thinking it will contain the pinned content.

**Why it's wrong:** `overflow: hidden` on a parent clips `position: fixed` children in some browsers. GSAP's pin mechanism switches the element to `position: fixed` during the pin phase. A clipping parent will cause the pinned element to disappear or be incorrectly clipped during the scroll.

**Do this instead:** The SFSection wrapping a PinnedSection must NOT have `overflow: hidden`. Use `className="py-0"` (no `overflow-hidden`) on the SFSection. The PinnedSection itself may have `overflow: hidden` on its internal content area, but not on the element that GSAP pins.

---

### Anti-Pattern 5: Animating in useEffect Without gsap.context

**What people do:** Write `useEffect(() => { gsap.to(...); ScrollTrigger.create(...) }, [])` without wrapping in `gsap.context()`.

**Why it's wrong:** Without `gsap.context()`, ScrollTrigger instances and tweens are not automatically collected. They must be manually killed on cleanup. Missed cleanup causes memory leaks, duplicate animations, and "ghost" ScrollTriggers that fire after the component unmounts — especially visible in React StrictMode with double-invoke of effects.

**Do this instead:** All new scroll animation code follows the existing `HorizontalScroll` pattern: `const ctx = gsap.context(() => { ... }); return () => ctx.revert();`. The `PinnedSection` component codifies this pattern.

---

## Scaling Considerations

| Scale | Architecture Note |
|-------|-------------------|
| 3 WebGL scenes (v1.5) | Scissor/viewport split works. IntersectionObserver gates keep non-visible scenes out of the render loop. Performance risk only if all 3 are simultaneously in viewport. |
| 5+ WebGL scenes | Still manageable with scissor pattern, but consider page-scoped scene management: scenes on the homepage are not relevant on /inventory. The singleton already handles this via `deregisterScene()` on unmount. |
| Pinned sections on multiple pages | Each `PinnedSection` instance creates its own ScrollTrigger context. `ctx.revert()` on unmount cleans up. No global state issues. |
| Redirect table growth | `next.config.ts` redirects are evaluated in order, linearly. For 10+ redirects, order by specificity (most specific first). Current 2-entry table has zero performance concerns. |

---

## Sources

- Direct codebase audit (all findings verified against current implementation):
  - `lib/signal-canvas.tsx` — `Map<string, SceneEntry>`, `registerScene()`, `renderAllScenes()` scissor pattern, `getState()` singleton
  - `hooks/use-signal-scene.ts` — `IntersectionObserver` visibility gate, `crypto.randomUUID()` keying, `disposeScene()` on unmount
  - `components/animation/glsl-hero.tsx` — module-level `_signalObserver`, `ensureSignalObserver()`, `readSignalVars()` pattern
  - `components/animation/signal-mesh.tsx` — identical MutationObserver pattern (confirms duplication risk)
  - `components/animation/horizontal-scroll.tsx` — existing pin/scrub implementation, `invalidateOnRefresh: true`, mobile breakpoint fallback
  - `components/layout/lenis-provider.tsx` — `instance.on("scroll", ScrollTrigger.update)`, GSAP ticker integration
  - `components/layout/page-animations.tsx` — `data-anim` selector system, `applyBgShift()`, `#bg-shift-wrapper`
  - `components/sf/sf-section.tsx` — SFSection prop API, data attribute system
  - `app/page.tsx` — current homepage structure, 7 SFSection instances
  - `app/layout.tsx` — `SignalCanvasLazy`, `LenisProvider`, `PageAnimations` mounting order
  - `next.config.ts` — current config (no redirects — confirmed gap)
- Next.js App Router docs: `redirects()` function, `permanent: true` → 308 status code
- GSAP ScrollTrigger docs: `pin`, `pinSpacing`, `scrub`, `anticipatePin`, `invalidateOnRefresh`

---

*Architecture research for: SignalframeUX v1.5 Redesign*
*Researched: 2026-04-07*
