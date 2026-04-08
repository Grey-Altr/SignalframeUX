# Pitfalls Research

**Domain:** Adding scroll-driven animations (200-300vh), multiple full-viewport WebGL scenes, route renames, interactive demos, and Awwwards-level polish to an existing Next.js 15.3 + GSAP + Three.js + Lenis site — SignalframeUX v1.5
**Researched:** 2026-04-07
**Confidence:** HIGH (GSAP ScrollTrigger/Lenis — verified across GSAP community forums and official docs) / HIGH (WebGL context limits — verified against Three.js forum and browser bug trackers) / MEDIUM (Route rename SEO — standard practice, well-documented) / MEDIUM (LCP + canvas — verified via Lighthouse issue tracker) / HIGH (Lenis + pin integration — extensively documented in GSAP community)

---

## Critical Pitfalls

### Pitfall 1: ScrollTrigger Pin + iOS Address Bar Causes Scroll Position Jumps

**What goes wrong:**
When `pin: true` is used on a 200-300vh section, GSAP inserts a `pin-spacer` div that doubles the element's height in document flow. On iOS Safari (portrait, any version) and Chrome iOS, the browser's dynamic address bar hides and shows as the user scrolls. Each visibility change resizes the viewport, which forces ScrollTrigger to recalculate start/end positions. The result is a visible "jump" — the page scroll position snaps to a wrong offset after the user pauses scrolling. This is most severe when multiple pinned sections are stacked, because each recalculation compounds the error.

ScrollTrigger 3.12.2 changed its 100vh calculation specifically because of this issue, but the address bar physics on iOS (portrait + forced browser chrome) remain impossible to fully resolve via the library. The only partial mitigation is `ScrollTrigger.config({ ignoreMobileResize: true })`, which suppresses the recalculation at the cost of not responding to legitimate resize events.

**Why it happens:**
`pin: true` relies on knowing the viewport height at initialization. Mobile browser chrome is outside JavaScript's control. Every address bar state change invalidates the initialized measurements. With 200-300vh of pinned scroll space, even a 60px address bar change causes a visible offset error.

**How to avoid:**
- Call `ScrollTrigger.normalizeScroll(true)` — the GSAP-provided normalization layer absorbs address bar changes before they propagate to ScrollTrigger calculations.
- Add `ScrollTrigger.config({ ignoreMobileResize: true })` as a fallback.
- Test pinned sections specifically on an iPhone 14/15 in portrait Safari before shipping. Simulator does not replicate address bar behavior.
- If the scroll-driven section can work without `pin: true` (i.e., the pinning is aesthetic, not structural), use `scrub` without `pin` — eliminates the spacer problem entirely.
- Verify with a real device, not Chrome DevTools mobile simulation.

**Warning signs:**
- Page jumps after the user finishes scrolling through a pinned section on mobile.
- Pin-spacer height in DevTools does not match the section's intended scroll distance.
- `ScrollTrigger.refresh()` called after font load does not fix the jump on iOS.

**Phase to address:** First scroll animation implementation phase. Establish the normalize/ignoreMobileResize config at the global GSAP setup before any pinned section is built. Retrofitting is painful.

---

### Pitfall 2: Font Load After ScrollTrigger Init Invalidates Pin-Spacer Dimensions

**What goes wrong:**
ScrollTrigger calculates all pin-spacer heights and trigger offsets at initialization (inside `useGSAP`). If custom fonts — Inter, JetBrains Mono, Electrolize, Anton — finish loading after this init call, the text blocks reflow. Any section containing text above a pinned section grows or shrinks by the font's line-height difference vs the fallback font. The pin-spacer was sized against the fallback layout, not the final layout. The visual result: animations fire too early or late by 20-80px, scroll progress bars are offset, and scrubbed animations feel desynced.

With `font-display: swap` (Next.js default), this reflow happens within the first 100-300ms of page load — after the React tree hydrates and GSAP initializes.

**Why it happens:**
`useGSAP` runs after the React component mounts, but font loading is asynchronous and not coordinated with the component lifecycle. Developers assume fonts are ready at mount time because `next/font` preloads them — but preloading only begins the request sooner; it does not guarantee the font is decoded and applied before the first render.

**How to avoid:**
- Call `ScrollTrigger.refresh()` inside a `document.fonts.ready` promise:
  ```typescript
  document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
  });
  ```
- Place this call in the root layout's `useGSAP` effect, not in individual page components. It only needs to fire once per page load.
- With Anton (the display font used in heading-1 / `SFHeadline`), the dimension change between system fallback and final font can be 30-50px on a full-width heading. This is enough to shift a 300vh scroll sequence by a full trigger point.

**Warning signs:**
- Scroll animations that feel "correct" in dev (where fonts are cached) but are offset on first load or incognito.
- Pinned section animations that start slightly early on first visit, then work correctly on refresh.
- Lighthouse simulated throttling shows animation desynced from scroll progress.

**Phase to address:** Scroll animation architecture phase. Add `document.fonts.ready.then(ScrollTrigger.refresh)` to the global GSAP provider before building any scroll sequence.

---

### Pitfall 3: Multiple WebGL Contexts Crash Mobile — Hard Browser Limits Apply

**What goes wrong:**
Chrome enforces a limit of 16 active WebGL contexts per page. Safari iOS enforces a limit of 2-8 (device-dependent, documented in Mozilla bug tracker as 2 per "principal" on some configurations). Three.js creates one WebGLRenderer per canvas. With "multiple full-viewport WebGL scenes" on a single page route, a page with 3+ Three.js canvases will silently lose the oldest WebGL context on iOS Safari — the canvas goes black with no error in the console for the end user.

The project already has `glsl-hero.tsx`, `signal-mesh.tsx`, and `hero-mesh.tsx` as separate Three.js instances. Adding new full-viewport WebGL sections to the same page route will trigger this limit on mobile.

**Why it happens:**
WebGL contexts are GPU resources managed by the browser, not JavaScript heap. Browsers impose hard limits independent of available RAM. Three.js does not warn you when a context is lost due to this limit — it fires the `webglcontextlost` event on the canvas, which most implementations don't handle. Resources (geometry, materials, textures) cannot be shared between WebGL contexts.

**How to avoid:**
- One WebGLRenderer per page route maximum on mobile. Use scene switching (render different Three.js scenes through one renderer via `renderer.setRenderTarget` and scene/camera swapping) rather than multiple canvas elements.
- For sections that need "different" visual worlds: composite them as different scenes rendered to the same canvas, switching with ScrollTrigger scroll progress as the control signal.
- For non-hero WebGL sections that can tolerate static imagery on mobile: detect GPU tier and disable Three.js on low-tier or mobile devices. `@pmndrs/detect-gpu` provides GPU tier detection.
- If multiple canvases are architecturally required: call `renderer.dispose()` and `renderer.forceContextLoss()` when a canvas scrolls out of view (IntersectionObserver), then reinitialize on scroll-back-in. This is complex and prone to flicker.
- Add a `webglcontextlost` handler to every canvas to degrade gracefully (show a static fallback image) rather than a black rectangle.

**Warning signs:**
- "WARNING: Too many active WebGL contexts. Oldest context will be lost." in the browser console.
- One of the Three.js canvases on the page renders as black or shows only the clear color.
- GPU memory usage climbs with each page navigation and does not return to baseline after navigating away.

**Phase to address:** WebGL scene planning phase. Decide on single-renderer architecture before building any new WebGL section. Retrofitting multiple scenes into one renderer after they're built is a significant rewrite.

---

### Pitfall 4: Three.js Resources Not Disposed on Route Navigation — GPU Memory Leak

**What goes wrong:**
Next.js App Router navigates between routes without a full page reload. The Three.js renderer, geometries, materials, and textures allocated on page A remain in GPU memory after navigating to page B unless explicitly disposed. In a design system site with multiple routes each showing WebGL scenes, repeated navigation creates a GPU memory leak that grows until the browser tab crashes or forces a context loss.

The specific failure: removing a Three.js component from the React tree does not garbage-collect GPU resources. `geometry.dispose()`, `material.dispose()`, `texture.dispose()`, and `renderer.dispose()` must be called explicitly. ImageBitmap textures (common in glTF loaders) additionally require `imageBitmap.close()` — a step that `texture.dispose()` does not handle in Three.js as of 2025.

**Why it happens:**
Developers familiar with JavaScript GC assume removing the object reference is sufficient. GPU resources are unmanaged buffers — they live outside the JS heap and have no automatic GC. The problem is invisible in dev (short sessions, few routes), but accumulates over a 10-minute user session exploring multiple pages.

**How to avoid:**
- In every `useGSAP` or `useEffect` that creates a Three.js renderer or scene, the cleanup function must traverse the scene and dispose all resources:
  ```typescript
  return () => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    renderer.dispose();
    renderer.forceContextLoss();
  };
  ```
- For textures loaded via `TextureLoader` or `GLTFLoader`: explicitly call `texture.dispose()` on each texture reference. For `ImageBitmap` textures, call `imageBitmap.close()` on the source.
- The existing `signal-mesh.tsx` and `glsl-hero.tsx` cleanup must be audited for completeness before adding new WebGL scenes. The v1.4 pitfall research flagged the MutationObserver disconnect gap — confirm the dispose sequence is also complete.

**Warning signs:**
- Chrome DevTools `Memory` tab (GPU Memory) climbs with each route navigation and does not return to baseline.
- After 5-6 route navigations, one of the WebGL canvases produces a context lost warning.
- `renderer.info.memory` logged to console shows geometries/textures accumulating between navigations.

**Phase to address:** WebGL cleanup audit phase (early, before new scenes are added). Run the Memory DevTools profiler on the existing routes before adding any new Three.js scenes.

---

### Pitfall 5: Lenis + ScrollTrigger Pin Flicker in Safari — The Integration Is Load-Bearing

**What goes wrong:**
When Lenis is driving the scroll and ScrollTrigger is pinning sections, Safari (desktop and iOS) exhibits a flicker inside the pinned section. The content inside the pinned element renders at the wrong position for one or two frames as Lenis and ScrollTrigger negotiate scroll position. This is a known issue with no complete fix — it is a timing conflict between Lenis's rAF loop and ScrollTrigger's scroll event listener.

The correct integration (verified against GSAP community discussions and darkroomengineering/lenis README) requires:
```typescript
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
// Lenis must be initialized with: autoRaf: false
```

Deviating from this exact pattern — particularly forgetting `autoRaf: false`, or using `scrollerProxy` (the older pattern) instead of the ticker approach — causes the flicker. The `scrollerProxy` approach is deprecated for Lenis and should not be used in new work.

A second Safari-specific issue: `ScrollTrigger.normalizeScroll()` conflicts with Lenis when both are active. Enable one or the other, not both.

**Why it happens:**
Lenis runs its own rAF loop to apply smooth scroll offsets. ScrollTrigger's scroll event fires from the native scroll event, which Lenis has overridden. If ScrollTrigger reads the scroll position before Lenis has applied its interpolated offset for the current frame, there is a one-frame discrepancy that manifests as flicker in pinned elements (which are positioned based on scroll offset).

**How to avoid:**
- Use the GSAP ticker integration pattern (shown above) exclusively. Do not use `scrollerProxy`.
- Initialize Lenis with `autoRaf: false`.
- Do not enable `ScrollTrigger.normalizeScroll()` when Lenis is active.
- Test pinned sections specifically in Safari (desktop) with Lenis active — Chrome does not exhibit the same flicker timing.
- The SignalframeUX project already has Lenis integrated. Before adding any new pinned sections, verify the existing integration matches the ticker pattern above.

**Warning signs:**
- Pinned section content flickers for 1-2 frames in Safari when scrolling into the pinned zone.
- A blank space appears below a pinned section after it unpins (symptom of `once: true` + `pin: true` + `scrub: true` with Lenis — a documented blank-space bug).
- Scroll progress animations are slightly behind scroll position in Safari but correct in Chrome.

**Phase to address:** Before the first new pinned section is built. Audit the existing Lenis integration against the ticker pattern. Fix any deviations before new scroll work begins.

---

### Pitfall 6: WebGL Canvas Is Invisible to LCP — Server-Rendered Text Overlay Is the LCP Element

**What goes wrong:**
Lighthouse and Chrome's LCP algorithm do not track `<canvas>` elements as LCP candidates. Canvas content — including Three.js WebGL output — is opaque to the performance measurement stack. For a full-viewport WebGL hero with a text overlay, the LCP element is the text, not the canvas. This is actually the correct behavior and can be leveraged.

The failure mode: developers who animate the text overlay into view (opacity 0 to 1, or a GSAP fade-in) inadvertently tell Chrome that the LCP element never becomes visible. Chrome's LCP observer stops tracking when an element's opacity is animated from 0 — a known Chromium bug triggered specifically by opacity animations. The result: Lighthouse reports `NO_LCP` or shows an artificially high LCP time, destroying the Lighthouse score.

The second failure mode: if the overlay text is a client-rendered component (rendered after hydration), the text does not exist in the initial HTML. The LCP element is only in the DOM after JavaScript runs, which Lighthouse measures as a much later LCP time than the actual visual paint.

**Why it happens:**
- Server-rendering the text is necessary for LCP but often overlooked when text is part of an animated component.
- Opacity-from-zero animations are a common aesthetic choice that Lighthouse penalizes via a Chromium bug that has persisted since at least 2021.

**How to avoid:**
- Server-render all text overlays above WebGL scenes. The text must be in the initial HTML response. No `'use client'` on the text component unless required for interactivity. Hydrate interactivity separately.
- For reveal animations on LCP text: start from `opacity: 0.01` (not `0`) or use `visibility: hidden` → `visible` instead. The Chromium bug is triggered specifically by `opacity: 0`. Starting at `0.01` avoids it.
- Alternatively: use `clip-path` or `transform: translateY` animations for the text reveal rather than opacity. These do not suppress LCP measurement.
- Preload Anton and Electrolize (the fonts used in display headings) with `rel="preload"` or rely on `next/font`'s preload behavior. A font-blocked LCP text element tanks LCP.

**Warning signs:**
- Lighthouse reports `NO_LCP` or a LCP time > 2s on a page with a WebGL hero.
- Chrome DevTools Performance timeline shows LCP firing very late (after all animations complete) on a page with animated overlay text.
- PageSpeed Insights flags "Largest Contentful Paint element" as a GSAP-animated text element.

**Phase to address:** Hero/WebGL section implementation phase. Establish the SSR-text-over-client-canvas pattern before building any hero section. Verify Lighthouse score immediately after the first hero implementation — do not defer this check.

---

### Pitfall 7: Route Renames Without Redirects Break Vercel's Edge Network Cache and Social Shares

**What goes wrong:**
When a route is renamed in Next.js App Router (a directory rename in `app/`), any previously shared URLs (social, bookmarks, backlinks) 404. The SEO impact of a 404 is worse than a 301 redirect — a 301 passes ~90-99% of link equity to the new URL, while a 404 signals deletion and may cause deindexing. Vercel's edge cache for the old URL also needs to be invalidated.

The secondary issue specific to this project: the `app/reference/` and `app/start/` routes may be renamed as part of the v1.5 redesign. Each rename that is not covered by a redirect in `next.config.ts` creates a silent 404 for any external link. The sitemap at `app/sitemap.ts` also needs updating — a sitemap pointing to old URLs tells Google to crawl URLs that no longer exist.

The tertiary issue: Next.js `next.config.ts` static redirects have a 1,024 limit on Vercel. This project is unlikely to exceed this limit for route renames (single-digit count of renamed routes), so the static redirect approach is appropriate. Do not use Middleware for this — it adds latency to every request.

**Why it happens:**
Route renames feel like a local change (rename a folder), but they are breaking changes to the URL structure. In SPAs, navigating within the app uses the router, masking the 404. The 404 only appears to external traffic and search engines.

**How to avoid:**
- For every directory renamed in `app/`, add a `permanent: true` redirect in `next.config.ts` before the rename is deployed:
  ```typescript
  redirects: async () => [
    { source: '/old-route', destination: '/new-route', permanent: true },
    { source: '/old-route/:path*', destination: '/new-route/:path*', permanent: true },
  ]
  ```
- Update `app/sitemap.ts` in the same commit as the rename.
- After deploy, use Google Search Console's URL Inspection tool to request indexing of new URLs and submit the updated sitemap.
- `permanent: true` generates a 308 (Next.js) / 301 (traditional). Both pass link equity. Use `permanent: true` for all route renames — these are permanent, not temporary moves.

**Warning signs:**
- Any renamed `app/` directory without a corresponding redirect in `next.config.ts`.
- `app/sitemap.ts` still references old route paths after a rename.
- Vercel deployment log shows no redirect entries for renamed routes.

**Phase to address:** Route architecture phase (before any routes are renamed). Establish the redirect-before-rename protocol. Add a pre-deploy check: `grep` for old route strings in `next.config.ts` to confirm coverage.

---

### Pitfall 8: GSAP ScrollTrigger Accumulates Instances Across React Re-Renders Without Cleanup

**What goes wrong:**
In Next.js App Router with React Strict Mode (development), effects run twice. Without proper cleanup, each double-invocation creates two ScrollTrigger instances for the same element. In production, route navigation that re-mounts a page component creates a fresh ScrollTrigger instance without killing the previous one — because the previous component unmounted but its ScrollTrigger was not killed.

With 200-300vh scroll sections and multiple `ScrollTrigger.create()` calls per page, accumulated stale instances cause animations to fire multiple times per scroll event, produce incorrect pin behavior (two pin-spacers for one element), and degrade scroll performance.

**Why it happens:**
`ScrollTrigger.create()` registers globally. If the component that created it is unmounted without calling `trigger.kill()`, the trigger persists in ScrollTrigger's global registry. The next mount creates a duplicate. This is the single most common GSAP + React bug.

**How to avoid:**
- Use `useGSAP()` hook exclusively (from `@gsap/react`). It provides automatic context-based cleanup: all ScrollTriggers created within the `useGSAP` callback are automatically killed when the component unmounts.
- Never use `useEffect` for GSAP animations in this codebase — `useGSAP` handles cleanup correctly, `useEffect` requires manual `gsap.context().revert()` or `trigger.kill()`.
- In the GSAP provider / root layout, call `ScrollTrigger.clearScrollMemory()` on route change if any stale triggers are suspected.
- The existing animation components in this project use `useGSAP` — maintain this pattern for all v1.5 scroll work.

**Warning signs:**
- An animation fires twice per scroll event.
- Two `pin-spacer` elements around the same section in the DOM.
- `ScrollTrigger.getAll().length` grows with each page navigation rather than staying constant.

**Phase to address:** Scroll animation architecture phase. Audit all existing `useGSAP` usages before adding new scroll sections to confirm cleanup is present. Then apply consistently to all v1.5 scroll work.

---

### Pitfall 9: Bundle Size Bloat From Importing GSAP Plugins and Three.js at Module Level

**What goes wrong:**
GSAP's `ScrollTrigger` plugin adds ~48KB (minified, pre-gzip). Three.js adds ~600KB (minified). If these are imported at the top of a component that is included in the root layout, they are bundled into the initial JS chunk and block TTI. On a portfolio/design-system site where some routes have no animations, this overhead is unnecessary.

The existing project already has lazy-loaded variants (`glsl-hero-lazy.tsx`, `signal-mesh-lazy.tsx`, `signal-overlay-lazy.tsx`) — this pattern is correct and must be extended to all new WebGL sections in v1.5.

The second vector: if multiple new scroll-animated sections each import GSAP plugins independently without a centralized registration, Next.js may bundle ScrollTrigger multiple times if tree-shaking does not deduplicate across dynamic import boundaries.

**Why it happens:**
Adding an import to a component is the path of least resistance. The bundle impact is invisible during development. Bundle analysis is typically only run at milestone end, after the damage is done.

**How to avoid:**
- All new Three.js components must use the `-lazy.tsx` pattern: `next/dynamic` with `ssr: false` and `loading` skeleton.
- Register GSAP plugins (ScrollTrigger, ScrollSmoother) once in a centralized provider or root layout effect — not in each component:
  ```typescript
  gsap.registerPlugin(ScrollTrigger);
  ```
- Run `ANALYZE=true pnpm build` after implementing each new major scroll section, not just at milestone end.
- Target: initial JS bundle should not grow by more than 15KB per new scroll section (excluding the lazily-loaded Three.js payloads).
- The 200KB initial page weight limit from `CLAUDE.md` applies. Track this at each phase, not just at the end.

**Warning signs:**
- `ANALYZE=true pnpm build` shows a new chunk containing both GSAP and page component code in the initial load.
- `next/dynamic` is not used for any new Three.js component.
- GSAP plugin registration appears in more than one component file.

**Phase to address:** Every scroll/WebGL implementation phase. Run bundle analyzer after each phase as a gate condition before moving to the next.

---

### Pitfall 10: Overscroll and Rubber-Banding Break Lenis on iOS

**What goes wrong:**
iOS Safari implements native rubber-banding (elastic overscroll) at the document level. Lenis intercepts scroll events to apply smooth scrolling, but when the user overscrolls past the top or bottom of the page, the native rubber-band animation fights Lenis's scroll normalization. The result: the page snaps back to the Lenis-controlled position instead of rubber-banding smoothly, which feels broken and unnatural.

With 200-300vh scroll sections, users frequently reach the "bottom" of a section that is still mid-scroll, and the overscroll behavior fires unexpectedly at section boundaries.

**Why it happens:**
Lenis uses `overflow: hidden` on the `<html>` element and drives scroll via `transform` on the document body (in virtual scroll mode) or via `window.scrollTo` with `behavior: instant` (in native scroll mode). The collision between Lenis's scroll model and iOS's rubber-band implementation is documented in the lenis GitHub issues. The `prevent` option and `overscroll-behavior: none` CSS are the standard mitigations.

**How to avoid:**
- Add `overscroll-behavior: none` to `<html>` in `globals.css`. This disables the native rubber-band on iOS and Android Chrome, which is acceptable since Lenis provides its own scroll feel.
- Configure Lenis with `overscroll: false` if the version supports it.
- Test scroll behavior specifically at the top and bottom of each scroll section on a physical iOS device, not simulator.
- For sections where overscroll is intentional (pull-to-refresh patterns, if any) — exempt those from the `overscroll-behavior` rule. This project has no such patterns.

**Warning signs:**
- Page feels "stuck" or "snaps back" when scrolling past the bottom of a pinned section on iOS.
- Console shows Lenis fighting with native scroll position during the rubber-band animation frame.
- `scrollY` reported by Lenis does not match `window.scrollY` during overscroll.

**Phase to address:** Scroll infrastructure phase. Add `overscroll-behavior: none` to `globals.css` before any new scroll sections are implemented.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Multiple Three.js renderers (one per canvas) | Simple component isolation | Mobile context limit crash on iOS Safari at 3+ canvases | Never for routes with 3+ WebGL sections |
| `useEffect` instead of `useGSAP` for scroll animations | Familiar React API | ScrollTrigger instances leak across route navigations; double-fire in React Strict Mode | Never |
| Opacity `0` for text reveal on LCP element | Common animation choice | Chromium bug reports NO_LCP to Lighthouse; Lighthouse score tanks | Never — use `0.01` or clip-path instead |
| Importing Three.js in a non-lazy component | Simpler import structure | ~600KB in initial JS bundle, TTI/LCP destroyed | Never for above-fold components |
| Static redirects only (no sitemap update on rename) | Faster rename workflow | Search Console crawls old URLs; deindexing risk | Never |
| Skipping `document.fonts.ready` ScrollTrigger refresh | One less async wait | Scroll animations desynced on first load when fonts cause reflow | Never on pages with Anton/display fonts |
| `ScrollTrigger.normalizeScroll()` + Lenis together | Seems like belt-and-suspenders | Conflicts produce double-normalization, scroll position errors in Safari | Never — pick one |

---

## Integration Gotchas

Common mistakes when wiring new features into the existing system.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Lenis + new pinned sections | Use `scrollerProxy` (old pattern) | Use GSAP ticker integration: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add((time) => lenis.raf(time * 1000))` with `autoRaf: false` |
| Three.js + route navigation | Skip cleanup on component unmount | `renderer.dispose()` + `renderer.forceContextLoss()` + scene traverse dispose in `useGSAP`/`useEffect` cleanup |
| Animated text overlay on WebGL | Start opacity at `0` | Start at `opacity: 0.01` or use `clip-path`/`translateY` reveal — avoid LCP suppression bug |
| New WebGL section + mobile | One renderer per canvas | One renderer per route; switch scenes through single renderer, or use IntersectionObserver to dispose/reinit |
| Route rename + SEO | Rename directory, deploy, add redirect later | Add redirect to `next.config.ts` first, then rename, deploy both changes together |
| GSAP ScrollTrigger + React Strict Mode | `useEffect` with manual cleanup | `useGSAP` hook — it handles double-invocation in Strict Mode correctly |
| Bundle size + Three.js sections | Direct import at top of component | `next/dynamic` with `ssr: false` for all Three.js components, following the existing `*-lazy.tsx` pattern |

---

## Performance Traps

Patterns that work at small scale but fail with multiple scroll sections.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 3+ WebGL contexts on one page route | Black canvas on iOS Safari; "too many active WebGL contexts" warning | One renderer per route; scene switching | 3 canvases on iPhone Safari |
| GPU memory not disposed between routes | Tab crash after 5-10 navigation events; GPU memory climbs in Chrome DevTools | Explicit dispose in every Three.js component cleanup | After ~5 route navigations |
| Pin-spacer dimensions wrong after font load | Scroll animations offset on first load; correct after refresh | `document.fonts.ready.then(ScrollTrigger.refresh)` in root layout | On every first page load with Anton/display fonts |
| ScrollTrigger instances accumulating | Animations fire multiple times; two pin-spacers on one element | `useGSAP` exclusively for all GSAP work | After 2+ route navigations to pages with scroll animations |
| GSAP + Three.js in initial bundle | LCP > 2s; TTI > 3s on mobile | `next/dynamic` with `ssr: false` for all heavy animation components | Immediately, on first mobile Lighthouse run |
| `overscroll-behavior` not set | iOS rubber-band fights Lenis on section boundaries | `overscroll-behavior: none` in `globals.css` | On every scroll-intensive route on iOS |

---

## UX Pitfalls

Common experience mistakes when adding Awwwards-level scroll animations.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Scroll animations with no `prefers-reduced-motion` check | Users with vestibular disorders experience disorientation or nausea | Wrap all GSAP ScrollTrigger animations in a `prefers-reduced-motion` check; disable scroll-driven animations (keep layout, remove motion) |
| 300vh pinned section with no scroll progress indicator | Users don't know how much scroll travel remains; feel lost | Use an `SFProgressBar` or subtle scroll indicator tied to scroll progress |
| WebGL section that blocks interaction during load | Clicks on nav/links during WebGL init are lost | Show the page chrome (nav, text) before Three.js loads; use Suspense/skeleton for canvas |
| Horizontal scroll inside a vertical scroll page | Mobile users get confused by scroll axis switching | Only use horizontal scroll on dedicated sections with clear affordance cues |
| Transition out of pinned section feels abrupt | Jarring snap from pinned to flowing layout | Add a short unpin animation (ease-out over 200-300ms) when leaving the pinned zone |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **WebGL cleanup:** Every Three.js component has `renderer.dispose()` + scene traverse dispose in cleanup — verify with `renderer.info.memory` logged before/after route navigation
- [ ] **ScrollTrigger cleanup:** `ScrollTrigger.getAll().length` stays constant across route navigations — not growing
- [ ] **iOS pin jump:** Pinned sections tested on a physical iPhone in portrait Safari — no position jump after scrolling through pinned zone
- [ ] **Font-ready refresh:** `document.fonts.ready.then(ScrollTrigger.refresh)` exists in root layout GSAP provider
- [ ] **LCP text overlay:** All hero text overlays start at `opacity: 0.01` (not `0`) or use non-opacity reveal — Lighthouse does not report NO_LCP
- [ ] **Lenis integration pattern:** `autoRaf: false` is set; no `scrollerProxy` usage; ticker integration is the active pattern
- [ ] **Bundle:** `ANALYZE=true pnpm build` run after each new scroll/WebGL section — no Three.js in initial chunk
- [ ] **Route redirects:** Every renamed route has a permanent redirect in `next.config.ts` AND `sitemap.ts` is updated
- [ ] **overscroll-behavior:** `overscroll-behavior: none` present in `globals.css` or root layout styles
- [ ] **WebGL context count:** Maximum 2 Three.js canvases active simultaneously on any page route (accounting for existing `glsl-hero` and `signal-mesh`)
- [ ] **prefers-reduced-motion:** All new scroll animations check `window.matchMedia('(prefers-reduced-motion: reduce)')` or use CSS `@media (prefers-reduced-motion)` override
- [ ] **Lighthouse gate:** Lighthouse 100/100 confirmed after each phase, not just at milestone end

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| iOS pin jump discovered in QA | MEDIUM | Add `ScrollTrigger.normalizeScroll(true)` + `ignoreMobileResize: true` config. Retest on physical device. |
| WebGL context loss on mobile | HIGH | Refactor to single-renderer architecture with scene switching. Timeline: 1-2 days per affected section. |
| GPU memory leak discovered | MEDIUM | Add dispose traverse to each Three.js component cleanup. Profile with Chrome Memory tab to confirm fix. |
| LCP score tanked by animated text | LOW | Change `opacity: 0` to `opacity: 0.01` in GSAP fromTo. Immediate deploy fix. |
| Font reflow offsetting scroll animations | LOW | Add `document.fonts.ready.then(ScrollTrigger.refresh)` to root layout. One-line fix, fast deploy. |
| Stale ScrollTrigger instances | MEDIUM | Convert offending `useEffect` to `useGSAP`. Verify with `ScrollTrigger.getAll().length` logging. |
| Route 404 from missing redirect | LOW | Add redirect to `next.config.ts`, deploy. Google deindexing risk if the route was live for more than 48h without redirect. |
| Bundle bloat from non-lazy Three.js | MEDIUM | Convert to `next/dynamic` with `ssr: false`. May require component restructuring if state was shared. |
| Lenis + pin flicker in Safari | MEDIUM | Audit integration pattern; switch from scrollerProxy to ticker integration; `autoRaf: false`. Test cycle per section. |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Lenis + pin flicker in Safari | Scroll infrastructure setup (first) | Ticker integration pattern confirmed; no scrollerProxy; autoRaf: false |
| Font-ready ScrollTrigger refresh | Scroll infrastructure setup (first) | `document.fonts.ready.then(ScrollTrigger.refresh)` in root layout |
| overscroll-behavior iOS | Scroll infrastructure setup (first) | `overscroll-behavior: none` in globals.css |
| ScrollTrigger cleanup / useGSAP audit | Scroll infrastructure setup (first) | `ScrollTrigger.getAll().length` stable across navigations |
| iOS address bar pin jump | First pinned section implementation | Physical iPhone Safari test — no jump |
| WebGL context architecture | WebGL scene planning (before first new canvas) | Max 2 simultaneous Three.js contexts per route confirmed |
| Three.js dispose on route change | WebGL scene planning (audit existing before adding new) | `renderer.info.memory` stable across navigations |
| LCP text overlay opacity bug | Hero section implementation | Lighthouse does not report NO_LCP; LCP < 1.0s |
| Bundle size per section | Each scroll/WebGL implementation phase (gate) | `ANALYZE=true pnpm build` — no Three.js in initial chunk |
| Route redirects | Route architecture phase | Every renamed route has redirect + sitemap updated |
| prefers-reduced-motion | Each animation implementation phase | All scroll animations wrapped in motion preference check |
| Lighthouse 100/100 gate | End of each phase | Lighthouse run — 100/100 across all categories |

---

## Sources

- GSAP ScrollTrigger — iOS address bar and pin position jump: https://gsap.com/community/forums/topic/40393-gsap-scrolltrigger-pin-position-is-jumping-on-ios-due-to-its-address-bar/
- GSAP ScrollTrigger — normalizeScroll docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/static.normalizeScroll()/
- GSAP ScrollTrigger — 3.12.2 viewport height calculation change: https://gsap.com/community/forums/topic/37591-scrolltrigger-100vh-calculation-change-in-3122/
- GSAP ScrollTrigger — mobile page jump after pinned section: https://gsap.com/community/forums/topic/37244-page-jump-on-mobile-after-scrolling-past-scrolltrigger-pinned-section/
- Lenis + ScrollTrigger — pin flickering in Safari: https://gsap.com/community/forums/topic/37653-lenis-scrolltrigger-pin-flickering-issue-in-safari/
- Lenis + ScrollTrigger — blank space with once/pin/scrub: https://gsap.com/community/forums/topic/44795-scrolltrigger-once-with-pin-and-scrub-lenis-creates-a-blank-space/
- Lenis + ScrollTrigger — synchronization patterns in React/Next: https://gsap.com/community/forums/topic/40426-patterns-for-synchronizing-scrolltrigger-and-lenis-in-reactnext/
- Lenis GitHub — iOS scroll top problem: https://github.com/darkroomengineering/lenis/issues/288
- Three.js forum — too many active WebGL contexts: https://discourse.threejs.org/t/i-have-a-problem-in-warning-too-many-active-webgl-contexts-oldest-context-will-be-lost/41300
- Three.js forum — dispose things correctly: https://discourse.threejs.org/t/dispose-things-correctly-in-three-js/6534
- Three.js forum — context lost and memory: https://discourse.threejs.org/t/three-webglrenderer-context-lost-performance-ram/44213
- react-three-fiber — Too many active WebGL contexts on Safari: https://github.com/pmndrs/react-three-fiber/discussions/2457
- Mozilla Bugzilla — mobile WebGL 2-context limit: https://bugzilla.mozilla.org/show_bug.cgi?id=1421481
- Three.js — ImageBitmap texture dispose bug: https://github.com/mrdoob/three.js/issues/23953
- Lighthouse — NO_LCP error from opacity animation: https://renaissance-design.net/2024/fixing-the-no_lcp-error-in-lighthouse/
- Lighthouse — opacity: 0 LCP suppression bug: https://dev.to/roman_guivan_17680f142e28/google-lighthouse-failing-with-nolcp-error-1mjo
- Next.js — redirecting guide: https://nextjs.org/docs/app/guides/redirecting
- Vercel — redirect limits and dynamic redirects: https://vercel.com/kb/guide/how-can-i-increase-the-limit-of-redirects-or-use-dynamic-redirects-on-vercel
- Google Search Central — 301 redirects: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- Next.js bundle optimization and code splitting: https://medium.com/@sohail_saifi/code-splitting-in-next-js-how-i-reduced-initial-bundle-size-by-70-73a4c328cc6c
- GSAP + Next.js 15 best practices: https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232
- Evil Martians — OffscreenCanvas + Three.js for Web Workers: https://evilmartians.com/chronicles/faster-webgl-three-js-3d-graphics-with-offscreencanvas-and-web-workers

---

*Pitfalls research for: SignalframeUX v1.5 — scroll-driven animations, multiple WebGL scenes, route renames, Awwwards-level polish*
*Researched: 2026-04-07*
