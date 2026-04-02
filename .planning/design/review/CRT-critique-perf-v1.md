# Performance Critique — SignalframeUX

**Reviewer:** Claude (PDE Critique Agent)
**Date:** 2026-04-01
**Scope:** Performance review of Next.js 15 App Router site — client/server boundaries, bundle size, animation cost, rendering efficiency
**Build context:** 102kB shared JS, pages 4-40kB First Load JS

---

## Score: 62 / 100

The architecture makes good decisions at the macro level — pages are Server Components, client islands are reasonably scoped, and reduced-motion is respected throughout. However, the site ships a heavy GSAP plugin bundle to every page, runs multiple always-on animation loops (canvas RAF, VHS overlay, cursor tracking, Lenis tick), and has several scroll handlers that bypass GSAP ScrollTrigger's batching. On mobile, performance is better because VHS/cursor are gated by `(pointer: coarse)`, but desktop users pay the full cost on every frame.

---

## Findings

| # | Severity | Effort | Location | Issue | Suggestion | Weight |
|---|----------|--------|----------|-------|------------|--------|
| 1 | critical | significant | `lib/gsap-plugins.ts` | **Monolithic GSAP bundle loaded on every page.** All 6 plugins (ScrollTrigger, SplitText, ScrambleText, DrawSVG, Flip, CustomEase) plus Lenis are registered in a single barrel file. Every page that imports `gsap` from this file pulls the entire plugin tree into its bundle. The `/tokens` page needs zero GSAP yet pays for SplitText, DrawSVG, Flip, etc. via `page-animations.tsx` in the layout. | Split into per-feature entry points: `lib/gsap-core.ts` (gsap + ScrollTrigger), `lib/gsap-text.ts` (SplitText + ScrambleText), `lib/gsap-flip.ts` (Flip), etc. Each component imports only what it needs. Move `PageAnimations` and `GlobalEffects` out of root layout and into page-level compositions or use `next/dynamic` with `ssr: false`. | 15 |
| 2 | critical | moderate | `components/layout/global-effects.tsx`, `app/layout.tsx:86` | **GlobalEffects renders on every route.** VHSOverlay, CustomCursor, ScrollProgress, ScrollToTop, and VHSBadge are mounted in the root layout. They render on `/tokens`, `/components`, `/start` — pages where VHS ambiance may not be wanted. Each adds event listeners (mousemove, mouseover, mousedown, scroll x2). The VHS overlay alone has 5 GSAP tweens running perpetually. | Conditionally mount GlobalEffects per-route, or at minimum lazy-load it with `next/dynamic({ ssr: false })`. Consider a user preference toggle that persists to localStorage to disable ambient effects entirely. | 12 |
| 3 | major | moderate | `components/animation/hero-mesh.tsx` | **Canvas RAF loop runs every frame indefinitely.** The hero mesh draws a grid of ~500+ nodes with line connections and dot fills on every animation frame. It never pauses even when the hero section is scrolled out of viewport. The `draw()` function runs `clearRect`, iterates all nodes for position updates (with sqrt per mouse-proximate node), then iterates twice more for lines and dots. | Add an IntersectionObserver to pause the RAF loop when the canvas is not visible. Batch the line drawing into a single `beginPath/stroke` call (already done, good), but skip the sqrt when `distSq >= MOUSE_RADIUS^2` (already done). The main win is pausing when offscreen. | 10 |
| 4 | major | moderate | `components/layout/page-animations.tsx` | **PageAnimations uses raw DOM queries in a global scope.** It queries `document.querySelectorAll` for `[data-anim='section-reveal']`, `[data-anim='stat-number']`, `[data-anim='comp-cell']`, `[data-anim='tag']` etc. on mount. This couples all animation logic to the home page DOM but the component runs in the root layout for every page. On non-home routes, these queries return empty NodeLists — harmless but wasteful. The click-pop event listeners (line 214) are never cleaned up individually (they rely on `ctx.revert()` which may not remove raw `addEventListener` calls). | Move PageAnimations to home page only (either inline in `app/page.tsx` or via a home-specific layout). For click handlers added via `addEventListener` in GSAP context, verify they are removed on cleanup — GSAP context reverts GSAP-created listeners but not raw DOM ones. | 8 |
| 5 | major | quick-fix | `components/layout/nav.tsx` | **5 simultaneous `useScrambleText` hooks on mount.** Each NavLink runs its own `setInterval` at 40ms (25fps) during the scramble animation, plus the logo runs its own independent RAF-based scramble. On initial page load, this means 5 intervals + 1 RAF + 1 ASCII cycling interval all firing concurrently for ~1-2 seconds during the entrance animation. | Consolidate scramble animations into a single RAF loop that drives all 5 links. Or use GSAP ScrambleTextPlugin (already in the bundle) instead of the custom hook, which would integrate with the global timeline and respect reduced-motion automatically. | 6 |
| 6 | major | quick-fix | `app/layout.tsx:10-13` | **Electrolize font missing `display: "swap"`.** The Electrolize font declaration does not include `display: "swap"`, while JetBrains Mono and Anton both do. Electrolize is the primary body font (`--font-sans`, `--font-heading`), so a slow network fetch will cause invisible text (FOIT) for the entire page. | Add `display: "swap"` to the Electrolize font config on line 10-14. | 6 |
| 7 | major | moderate | `components/layout/lenis-provider.tsx` | **Lenis adds a per-frame GSAP ticker callback globally.** `gsap.ticker.add()` fires on every frame for the lifetime of the app, calling `lenis.raf()`. Combined with `lagSmoothing(0)`, this disables GSAP's built-in frame-skip protection, meaning even during heavy JS work, GSAP will attempt to process every frame rather than skipping to catch up. | Consider whether `lagSmoothing(0)` is truly needed — it was likely added to prevent Lenis jitter, but it degrades graceful degradation under load. If Lenis is not needed on all routes, conditionally mount it. | 5 |
| 8 | major | quick-fix | `app/globals.css:496-512` | **Permanent `will-change: transform` on all `[data-anim="comp-cell"]` elements.** This promotes 12 elements to compositor layers permanently. While fine during animation, `will-change` should be applied only during the animation window, not as a static style. Persistent compositor layers consume GPU memory. | Remove `will-change: transform` from the static CSS. If needed, add it dynamically via GSAP's `will-change` auto-management or apply it only on hover via a class toggle. | 4 |
| 9 | major | moderate | `components/blocks/manifesto-band.tsx` | **Raw scroll handler without throttling.** The `handleScroll` callback fires on every scroll event and reads `getBoundingClientRect()` (forces layout/reflow) plus iterates ~25 word elements setting inline `opacity`. Although marked `{ passive: true }`, the per-frame DOM writes can cause layout thrashing when combined with the other scroll listeners. | Replace with a ScrollTrigger scrub animation or use `IntersectionObserver` for the coarse in/out check combined with a `requestAnimationFrame`-throttled scroll handler for the fine-grained word reveal. | 4 |
| 10 | minor | quick-fix | `components/layout/global-effects.tsx:145-154` | **ScrollProgress scroll handler does not use RAF throttling.** Every scroll event calls `barRef.current.style.transform = ...`. Modern browsers batch passive scroll handlers, but the direct style write per event is still suboptimal. | Wrap in a `requestAnimationFrame` guard to coalesce multiple scroll events per frame. Or replace with a single GSAP ScrollTrigger scrub on a scaleX tween. | 3 |
| 11 | minor | quick-fix | `components/layout/global-effects.tsx:170-183` | **ScrollToTop scroll handler writes 3 style properties per event.** `opacity`, `pointerEvents`, and `transform` are set on every scroll event. This is a candidate for class toggling instead of inline style writes. | Use `classList.toggle("visible", show)` with the styles in CSS, reducing per-scroll JS work to a single classList operation. | 2 |
| 12 | minor | moderate | `components/animation/vhs-overlay.tsx` | **VHS overlay uses `backdrop-filter: blur()` on two perpetually-animating elements.** The scanline elements (lines 206-226) apply `backdrop-filter: blur(1.2px) contrast(1.15) saturate(1.35)` and are translated via GSAP. `backdrop-filter` with blur forces the browser to re-rasterize underlying content on every frame the element moves. This is one of the most expensive CSS operations. | Consider reducing the blur radius or removing `backdrop-filter` entirely in favor of a semi-transparent gradient overlay that simulates the distortion visually without the compositing cost. The effect is subtle enough that a CSS-only approximation would be indistinguishable. | 4 |
| 13 | minor | quick-fix | `components/blocks/component-grid.tsx` | **`useState` for hover tracking causes re-render of all 12 cells.** `setHoveredCell(comp.id)` triggers a re-render of the entire `ComponentGrid` component on every mouse enter/leave of any cell. All 12 cells re-render, each with their Preview component. | Replace with CSS-only hover state (`:hover` is already partially used in `globals.css`). Or use refs for the border-color change instead of state. The existing `[data-anim="comp-cell"]:hover` CSS handles the transform; only the `borderColor` change needs state, and that can be done with a CSS `hover` selector. | 3 |
| 14 | minor | quick-fix | `components/blocks/hero.tsx:118-185` | **Styled JSX block in Hero adds ~70 lines of CSS per render.** The `<style jsx>` block contains CTA hover animations and border-draw effects. Styled JSX is scoped but emitted as a `<style>` tag in the document. This is fine functionally but adds to the client JS bundle since styled-jsx runtime must be included. | Move these styles to `globals.css` (they are specific enough with `.hero-cta-btn` class selectors) or use Tailwind classes. This removes the styled-jsx runtime dependency from the Hero chunk. | 2 |
| 15 | minor | quick-fix | `components/layout/nav.tsx:432-485` | **Styled JSX in LogoMark adds another styled-jsx chunk.** Similar to Hero — the logo glitch keyframes could live in globals.css. | Move `logoGlitch` and `slashPulse` keyframes to `globals.css`. | 2 |
| 16 | minor | moderate | `components/blocks/components-explorer.tsx` | **`useLayoutEffect` triggers synchronous Flip animation on every filter/search change.** GSAP Flip captures state, then synchronously lays out the animation before the browser paints. With 16 cards, this is manageable, but the `absolute: true` option in Flip.from() (line 298) causes GSAP to absolutely position all cards during the transition, triggering significant reflow. | For the current card count (16), this is acceptable. If the grid scales to more items, consider virtualizing or paginating. For now, ensure the Flip targets use `will-change: transform` only during the animation (GSAP handles this). | 2 |
| 17 | nit | quick-fix | `components/blocks/token-tabs.tsx` | **All tab content is rendered to the DOM simultaneously.** Radix Tabs renders all `TabsContent` children; non-active ones are hidden with `display: none`. The COLOR tab alone renders 72 swatch divs. This is fine for this data size but worth noting if token counts grow. | No action needed at current scale. If tabs become data-heavy, use `forceMount={false}` (if supported) or conditional rendering. | 1 |
| 18 | nit | quick-fix | `app/layout.tsx:65-68` | **Inline blocking script for theme detection.** The script is small and correctly placed in `<head>`. | This is actually the correct pattern for flash-free dark mode. No change needed. Noting for completeness only. | 0 |
| 19 | nit | quick-fix | `components/layout/nav.tsx:97-199` | **LiveClock `setInterval` at 1000ms + RAF loop.** The clock runs a 1-second interval and a separate RAF loop for scramble animations. The RAF loop properly self-terminates when no scrambles are active (`scrambles.size === 0`). This is well-implemented. | No change needed. The RAF loop is correctly demand-driven. | 0 |

---

## Summary by Severity

| Severity | Count | Weighted Impact |
|----------|-------|-----------------|
| Critical | 2 | 27 |
| Major | 5 | 29 |
| Minor | 6 | 16 |
| Nit | 3 | 1 |
| **Total** | **16 actionable** | **73 weighted points** |

---

## Top 3 Recommendations (Ordered by Impact)

### 1. Split GSAP plugin bundle and scope animation components per-route
The single `lib/gsap-plugins.ts` barrel plus layout-level `PageAnimations` and `GlobalEffects` mean every route ships and executes the full animation stack. Split the barrel, move page-specific animations to page-level components, and lazy-load GlobalEffects.

### 2. Pause offscreen animation loops
The hero canvas RAF, VHS overlay GSAP tweens, and Lenis ticker all run continuously. Add IntersectionObserver guards so the canvas pauses when scrolled away, and consider route-aware mounting for VHS effects.

### 3. Consolidate scroll handlers
Four independent scroll listeners (ManifestoBand, ScrollProgress, ScrollToTop, Lenis/ScrollTrigger) fire on every scroll event. ManifestoBand should migrate to ScrollTrigger scrub. ScrollProgress and ScrollToTop should use RAF guards or ScrollTrigger.

---

## Positives

- Server Components are used correctly for all page shells (`app/page.tsx`, `app/tokens/page.tsx`, `app/start/page.tsx`, `app/components/page.tsx`) with client islands only where interactivity is needed.
- `prefers-reduced-motion` is respected at multiple levels: GSAP global freeze, CSS media query, and per-component guards.
- Touch device users (`pointer: coarse`) are exempted from cursor and VHS overhead.
- The hero mesh uses O(n) grid-topology line drawing instead of O(n^2) distance checks.
- Scroll listeners use `{ passive: true }`.
- The `app/start/page.tsx` is a pure Server Component with zero client JS beyond shared layout (good).
- Font loading uses `next/font` with variable injection (good for performance).
