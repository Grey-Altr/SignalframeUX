# Feature Research — v1.8 Speed of Light

**Domain:** Brownfield Next.js 16 perf-recovery on a heavy GSAP/WebGL/CSS-effect stack
**Milestone:** v1.8 Speed of Light
**Researched:** 2026-04-25
**Confidence:** HIGH (codebase grounded, current docs verified)
**Measured gap:** Lighthouse mobile Perf 76 → 100 (24-pt gap). LCP 6.5s → <1.0s. Render-blocking 570ms → 0. Unused JS 119 KiB → 0.

> "Features" here = perf-recovery techniques and their behavioral expectations, not new product features. Categories below feed roadmap phase ordering.

## Verified Codebase Facts (Ground Truth)

These shaped the categorization. Reading them changes what's table-stakes vs anti-feature.

1. **Ghost-label is *legitimately* the LCP candidate, not misdetected.**
   `components/animation/ghost-label.tsx` renders `clamp(200px, 25vw, 400px)` Anton text already painted at `opacity: 0.03` from first frame (`globals.css:1508-1519`). The previous fix raised it from `opacity: 0` to `0.03` *specifically because Lighthouse excludes opacity:0 from LCP*. Per [web.dev/lcp](https://web.dev/articles/lcp), LCP visible-size = viewport intersection minus clipped overflow. At 200-400px Anton, the ghost-label is the largest visible text element by area.
2. **The 6.5s timing is the cost of rendering Anton at 400px**, not bad detection. Anton is `font-display: optional` (`app/layout.tsx:46-51`) — on cold-cache mobile, fallback paints fast but the metric still triggers on the *contentful* paint of the rendered Anton glyphs once the font resolves (or on the fallback paint at fallback metrics, whichever the browser picks).
3. **`/sf-canvas-sync.js` is 200 bytes of correct CLS-prevention code.** Reading `inner.offsetHeight` and writing `outer.style.height` *must* happen synchronously between HTML parse and first paint, or the ScaleCanvas wrapper has no height and CLS goes to 0.65. Render-blocking is by design (`scale-canvas.tsx:135-143`).
4. **Two render-blocking inline scripts already live in `<head>`** for theme + scale (`layout.tsx:91, 100`). They are 1-2 KB each, compute scale tokens before paint, and exist for the same CLS-prevention reason as `/sf-canvas-sync.js`.
5. **Three.js + GSAP are already async-split.** `SignalCanvasLazy` and `GlobalEffectsLazy` use `next/dynamic({ ssr: false })`. `gsap-split.ts` only loads ScrollTrigger + SplitText + ScrambleTextPlugin + CustomEase (~35 KB), not the full plugin bundle (~75 KB).
6. **GSAP is loaded as a peer dep + side-effect-marked module.** `package.json:sideEffects` lists 5 GSAP wrappers — webpack tree-shaking is preserved at the module boundary, but anything imported into the homepage tree is non-shakable.
7. **There is no Lighthouse CI yet.** `lighthouse@13.1.0` is a devDependency (used for local one-off runs). No `.lighthouserc` file. No GitHub Action. Per-PR enforcement is currently manual.
8. **No web-vitals reporting in production.** `@vercel/speed-insights` is not installed. There's no `reportWebVitals` export anywhere in `app/`. Real-device telemetry is zero.
9. **Mobile transformation magnifies LCP cost.** ScaleCanvas applies `transform: scale(vw/1280)` ≈ 0.293 on mobile 375px. The ghost-label's *rendered* viewport size is 25vw × 0.293 ≈ 7.3vw. But the unscaled DOM size is what the browser raster + paint costs scale with — the GPU still rasterizes at 400px before compositing. On low-end Android the rasterization of 200-400px Anton glyphs is the LCP-time tax.
10. **getQualityTier() is shipped and documented as ship-blocker for new SIGNAL surfaces** (memory `feedback_consume_quality_tier.md`). Available now for first-paint decisions.

## Feature Landscape

### Table Stakes (Required to hit LCP <1.0s on this stack)

Without these, the LCP <1.0s gate cannot be cleared. Each one is grounded in the measured 24-pt gap.

| Feature | Why Required | Complexity | Notes / Dependency |
|---------|--------------|------------|--------------------|
| **LCP candidate diagnosis pass** | Confirm via Lighthouse trace + `LargestContentfulPaint` PerformanceObserver in DevTools whether the ghost-label, the THESIS manifesto Anton statement, OR a hero shader canvas frame is the LCP element on cold mobile. The 6.5s timing is too slow for a paint-from-first-frame element — likely the manifesto statement (`clamp(56px, 10vw, 120px)` Anton, `opacity: 0` start state, GSAP scrub reveal). The "ghost-label is LCP candidate" comment in `globals.css:1511` may be stale; the LCP could be the THESIS pinned heading entering at scroll. | LOW (1-2h) | Zero deps. MUST run first — every other phase depends on knowing the right target. Use Chrome DevTools Performance panel + `web-vitals` script in console. |
| **Anton font preload + character subset** | Anton at 400px is the largest paint. `next/font/local` already self-hosts; missing piece is `preload: true` (default true but verify the variable is consumed before LCP) + a character-subset Anton WOFF2 containing only the headlines/ghost-label glyphs (THESIS, PROOF, INVENTORY, SIGNAL, ACQUISITION + the manifesto strings). Per [Vercel next/font docs](https://vercel.com/blog/nextjs-next-font), local fonts subset to actual chars used. | LOW (3-4h) | No new deps — Anton is already `localFont`. Build a subset .woff2 (use `glyphhanger` or hand-curate) and reference it. |
| **Switch Anton from `display: optional` → `display: swap` + `size-adjust`** | `optional` blocks Anton from painting if it doesn't arrive within 100ms — on cold mobile that means LCP is the *fallback* paint. With the font self-hosted + preloaded + subset, `swap` lets Anton paint as soon as it lands. CLS risk mitigated by `next/font`'s automatic `size-adjust`/`ascent-override` matching ([next/font docs](https://nextjs.org/docs/app/getting-started/fonts)). The original CLS-fix comment in `layout.tsx:46-51` was correct *for the previous setup* — Anton was self-hosted but un-preloaded, swap caused CLS. With preload + subset, that calculus changes. | MEDIUM (4-6h) | Depends on **subset preload** above. Requires Chromatic baseline re-capture; verify CLS stays 0 with Lighthouse cold-cache run. Document the change reason in CLAUDE.md/STATE.md per `feedback_ratify_reality_bias.md`. |
| **Inline `/sf-canvas-sync.js` into `<head>` as third inline script** | The file is ~200 bytes. Inlining eliminates the round-trip + parse cost (each render-blocking external script is 50-150ms on mobile 4G even with HTTP/2). Co-locates with `themeScript` and `scaleScript` already inlined at `layout.tsx:91, 100`. Per [Chrome docs on render-blocking](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources), small critical scripts should be inlined. | LOW (1h) | No deps. Verify CLS still 0. Single-file change to `app/layout.tsx` + delete `public/sf-canvas-sync.js`. Update `scale-canvas.tsx` to remove the `<script src="/sf-canvas-sync.js" />` JSX. |
| **Critical CSS extraction for above-the-fold (ENTRY section)** | One of the 570ms render-blocking is two CSS files. Tailwind v4 CSS-in-JS via `@theme` is loaded as one main CSS file. With `globals.css` at 1500+ lines (token system, `.sf-display`, `.sf-mesh-gradient`, all data-anim selectors, all effect classes), the critical render path includes effect-stack CSS that paints below-the-fold. Extract critical CSS for above-the-fold to inline; defer the rest. Tailwind v4 doesn't ship official critical-extraction; viable tools: `@critters/critters` (next.config experimental.optimizeCss) or hand-pick the ENTRY-section ruleset. | HIGH (12-16h) | Risk: Tailwind v4 `@theme inline` aliasing makes naive critical-extraction tools miss CSS-var resolution. Mitigation: enable Next.js `experimental.optimizeCss: true` first (uses critters), measure delta, then decide whether hand-extraction is worth it. **Aesthetic preservation hard gate** — verify Chromatic. |
| **Lighthouse CI in GitHub Actions per-PR** | The 24-pt gap exists *because* there's no perf gate on PRs. Without enforcement, perf will regress between v1.8 ship and v1.9. [Lighthouse CI Action](https://github.com/marketplace/actions/lighthouse-ci-action) provides the standard pattern: `.lighthouserc.json` + `assertions` block + Vercel preview URL as target. Performance budgets fail PR builds. | MEDIUM (4-6h) | Depends on Vercel preview deployment URL pattern (already exists). Run on `pull_request` event, target the preview URL, require LCP <1.0s + Perf 100 thresholds. Use 3-run median to reduce variance. |
| **Real-device telemetry: `@vercel/speed-insights`** | Lighthouse is synthetic — emulates Moto G4 on slow 4G. Real iPhone Safari + mid-tier Android samples are needed because: (a) WebGL behavior diverges (memory `feedback_consume_quality_tier.md`), (b) ScaleCanvas transform interaction with iOS Safari rasterizer is unique, (c) real users hit the 75th-percentile metric Google ranks against. `@vercel/speed-insights` is one drop-in for INP/LCP/CLS at p75. | LOW (2h) | New runtime dep — small (~5 KB). Aligns with Vercel deployment. Consider as differentiator if "no new runtime deps" rule from v1.7 carries forward, but the perf-recovery milestone is precisely the place to add it. |

### Differentiators (Beyond pass — reduce regression risk, improve real-device parity)

These don't move the Lighthouse needle on their own but materially reduce the chance of regression and improve the real-user experience.

| Feature | Value Proposition | Complexity | Notes / Dependency |
|---------|-------------------|------------|--------------------|
| **`getQualityTier()` reads at first-paint for ghost-label & ENTRY hero** | The hero shader, ghost-label opacity, and any first-paint effect should consume `getQualityTier()` to decide: low-tier = render ghost-label as `display: none` (ship-blocker memory says low-end parity is non-negotiable), or render at smaller `font-size` cap. Same pattern for ENTRY's GLSL shader: low-tier could fall back to a static dithered SVG painted from CSS `background-image` (zero JS, zero WebGL context). | MEDIUM (8-12h) | Depends on **LCP candidate diagnosis** (above). Reuses existing `getQualityTier()` from v1.7. Aesthetic-preserving by definition because the high-tier render is unchanged. |
| **Bundle hygiene pass on chunks `3302`, `e9a6067a`, `74c6194b`, `7525`** | 119 KiB unused JS = somewhere components are top-level imported but only used conditionally. Likely culprits given the codebase: (a) `cmdk` + Radix popover/dialog imports in CommandPalette are already lazy via `command-palette-lazy`, but `Footer` or `Nav` may statically import a heavy submodule, (b) `shiki` (4.0.2) docs page imports may leak into root, (c) `react-day-picker` (Calendar) is meant to be lazy but might be referenced from a non-lazy registry index, (d) `vaul` Drawer is dep but only used in mobile detail. Run `ANALYZE=true pnpm build` and inspect the four chunks specifically. | MEDIUM (8-12h) | Depends on bundle analyzer output. May reveal need to add `"sideEffects": false` to additional barrel files OR move imports to dynamic. Per [Next.js package bundling docs](https://nextjs.org/docs/app/guides/package-bundling), `optimizePackageImports` already covers `lucide-react` — extend to `radix-ui`, `cmdk`, `shiki/core` candidates. |
| **`fetchpriority="high"` on Anton preload `<link>`** | Even with `next/font` preload, manually adding `<link rel="preload" as="font" fetchpriority="high">` for the Anton subset moves it ahead of the CSS download in the priority queue on cold cache. [web.dev/optimize-lcp](https://web.dev/articles/optimize-lcp) lists this as a top-3 LCP intervention. | LOW (1-2h) | Depends on **Anton subset** above. `next/font` may already emit this; verify via DevTools Network panel and only add manually if absent. |
| **Speculation rules / route prefetch hints** | Next.js 16 supports speculation rules. For the homepage → `/system`/`/init`/`/inventory`/`/reference` navigation pattern, prerender on hover-intent. Doesn't directly affect homepage LCP but improves perceived nav perf which Lighthouse picks up via INP. | LOW (2-3h) | Standard Next.js feature. No deps. |
| **GSAP `lazy: true` for non-LCP scenes** | GSAP supports `lazy` flag on tweens that defers tween instance creation until first tick. PageAnimations registers many ScrollTriggers at mount — most fire below-the-fold. Mark them `lazy: true` to skip first-tick work during LCP window. | LOW (3-4h) | Verify no GSAP-pinned content depends on first-tick computation. Current `gsap-split.ts` setup is unchanged. |
| **`content-visibility: auto` on below-fold SFSection wrappers** | Browser skips rendering work for off-screen sections. THESIS/PROOF/INVENTORY/SIGNAL/ACQUISITION all live below ENTRY. `content-visibility: auto` + `contain-intrinsic-size` lets the browser short-circuit layout/paint until they enter the viewport. **Caveat:** ScaleCanvas's `transform: scale` interaction with `contain-intrinsic-size` should be tested — containment may break scroll measurement. | MEDIUM (6-8h) | Depends on tests verifying ScrollTrigger pin distances stay correct. Aesthetic-preserving (only affects render order, not visual). |
| **Anton fallback metrics override** | If we keep `display: optional` (or even with `swap`), declare a `@font-face` fallback with explicit `size-adjust`/`ascent-override`/`descent-override`/`line-gap-override` matching Anton metrics. `next/font` does this for itself but not for arbitrary fallback chains. Eliminates any residual swap CLS. | MEDIUM (4-6h) | Tooling: [Fontaine](https://github.com/unjs/fontaine) or hand-compute via [Fallback Font Generator](https://github.com/screamingdemonart/fallback-font-generator). |

### Anti-Features (Tempting but bad ROI or aesthetic violation)

These will be proposed during planning. Reject them up-front.

| Feature | Why It Looks Tempting | Why Problematic | Better Alternative |
|---------|------------------------|-----------------|--------------------|
| **Disqualify ghost-label as LCP candidate (e.g., `display: none` until scroll, or move to absolute element clipped from viewport)** | Easy "fix" — make the metric forget about it. | (a) The ghost-label is a load-bearing aesthetic element per LOCKDOWN/CLAUDE.md ("DU/TDR aesthetic, ghost-label as structural wayfinding") — hiding it violates aesthetic preservation HARD gate. (b) It will simply re-shift LCP onto the next-largest element (THESIS Anton manifesto) which is *also* opacity-animated — same problem. (c) Per [web.dev/lcp](https://web.dev/articles/lcp), opacity:0 elements are excluded from LCP — so this is "fix by deletion." | Make the element paint faster: subset Anton, preload, switch to `swap`. Treat the candidate as the constraint, not a bug. |
| **Remove ScaleCanvas transform** | ScaleCanvas is the source of the mobile-LCP magnification effect. Removing it would simplify many things. | The pillarbox-free 1280px design canvas is a structural design decision (memory `project_canvas_frame_vars.md`, locked v1.0). Reversing it is a redesign, not stabilization. v1.8 scope explicitly excludes "ScaleCanvas pillarbox/counter-scale/portal architectural decision" (Track B parked). | Keep ScaleCanvas. Optimize what's *inside* it (font, ghost-label, critical CSS). |
| **Remove `/sf-canvas-sync.js` entirely (just async-load)** | It's render-blocking; defer it. | It exists for CLS=0. Async/defer means it runs post-paint, the wrapper has no height for one frame, and CLS regresses to 0.65. The original commit message (per `scale-canvas.tsx:135-141`) is explicit. | Inline it (already in Table Stakes). |
| **Replace GSAP with CSS animations + Web Animations API** | "Reduce JS bundle." | (a) The aesthetic is GSAP-driven (scrub, ScrambleText, SplitText, CustomEase). Replacing it = redesign. (b) GSAP's bundle is already minimal (only the plugins consumed via `gsap-split.ts`). (c) This is a v0.5 → v1.0 conversation, not a v1.8 perf-recovery one. | Tree-shake GSAP plugins (already done). Use `lazy: true` on tweens. |
| **React Three Fiber for hero shader** | "More idiomatic Three.js." | Explicitly out-of-scope per `PROJECT.md`: "R3F's independent rAF conflicts with GSAP `globalTimeline.timeScale(0)`." The singleton WebGL pattern (`useSignalScene`) is locked. | N/A — keep raw Three.js. |
| **Server Components for blocks/* sections** | "Reduce client JS." | Most blocks (THESIS, ENTRY, PROOF, SIGNAL, ACQUISITION) are GSAP-driven and require `'use client'`. INVENTORY, ManifestoStatement, GhostLabel are inert renderers that *could* drop the directive — but GhostLabel already has no `'use client'`, so already correct. ManifestoStatement has `'use client'` for `useEffect` resolution of `mobileAnchor` — required. | Audit only — likely a 0-3 KB win. Low priority. |
| **Service Worker / app-shell caching** | "Subsequent loads instant." | Doesn't affect cold-load Lighthouse, which is what fails. Adds maintenance burden. Vercel CDN already handles repeat loads. | Skip. |
| **Image-format LCP optimization (AVIF, blurhash)** | Standard LCP advice. | LCP is a *text* element here, not an image. Standard image advice doesn't apply. | Skip. Don't waste a phase on it. |
| **Aggressive `optimizeCss: true` rollout without measurement** | One-line config win. | Critters can mangle `@layer signalframeux` cascade ordering or `@theme inline` Tailwind aliasing — the v1.7 token bridge architecture depends on those layers staying intact. Saw a [GitHub issue](https://github.com/vercel/next.js/discussions/13646) where critters broke styled-components and CSS-modules layering. | Enable behind a feature flag, run Chromatic baseline diff, only ship if zero visual regressions. |
| **Dynamic-import the entire `<Footer>` and `<Nav>`** | Reduces initial chunk. | Both are above-the-fold or sticky chrome — dynamic-import causes layout shift (CLS) and delays nav skeleton paint (LCP candidate risk). | Static-import. Lazy only truly off-screen / interaction-gated components (`SFToaster`, `GlobalEffects`, `SignalCanvas` already lazy). |

## Feature Dependencies

```
[LCP candidate diagnosis] (LOW, 1-2h)
    └──must precede──> [Anton subset preload]
    └──must precede──> [font-display switch]
    └──must precede──> [getQualityTier first-paint reads]

[Anton subset preload]
    └──unlocks──> [font-display: swap with size-adjust]
        └──unlocks──> [fetchpriority="high" verification]

[Lighthouse CI in GitHub Actions]
    └──gates──> [all subsequent perf changes — regression-proofs them]

[Critical CSS extraction]
    ⇆──conflicts with──> [Tailwind v4 @theme inline + @layer signalframeux]
        (mitigated by: enable optimizeCss: true behind Chromatic gate)

[Inline /sf-canvas-sync.js]
    └──independent of all others──> can ship alongside diagnosis pass

[Bundle hygiene pass]
    └──depends on──> [ANALYZE=true pnpm build] visualization
    └──parallel-eligible with──> [LCP candidate diagnosis], [Lighthouse CI]

[@vercel/speed-insights real-device]
    └──independent──> can ship anytime; ideally early to start collecting data

[content-visibility: auto on SFSection]
    └──may conflict with──> [ScaleCanvas transform + ScrollTrigger pinning]
        (mitigated by: full Playwright test suite + manual scroll verification)
```

### Dependency Notes

- **LCP candidate diagnosis MUST go first.** The "ghost-label" assumption in the milestone context may be stale; the actual LCP element on cold mobile could be the THESIS manifesto Anton statement (which is opacity:0 → animated, larger DOM size, more glyph rasterization). Every other phase's effort is wasted if it targets the wrong element. **2-hour spike.**
- **Lighthouse CI MUST land before any other perf change** so we can measure deltas per-PR and prevent regression.
- **Critical CSS extraction is the highest-risk feature.** Defer until other gains are exhausted; it may not be needed if subset/preload/inline-script land us under 1.0s.
- **`@vercel/speed-insights` is the lowest-risk diff.** Add early — even if it doesn't move the Lighthouse score, it gives us field data to validate the synthetic improvements once they ship.

## MVP Definition (v1.8 ship)

### Launch With (Required to clear LCP <1.0s + Perf 100 gates)

- [ ] **LCP candidate diagnosis pass** — confirm the actual LCP element on cold mobile via Lighthouse trace + `web-vitals` script. Update `globals.css:1511` comment with finding.
- [ ] **Anton font subset + `next/font` preload verification** — generate `Anton-Subset.woff2` containing only displayed characters; verify preload `<link>` emits.
- [ ] **Anton `font-display: swap` migration** — preserve CLS=0 via `next/font` automatic `size-adjust`. Re-baseline Chromatic.
- [ ] **Inline `/sf-canvas-sync.js`** — third inline script in `<head>`, removes one render-blocking request.
- [ ] **Lighthouse CI in GitHub Actions** — `.lighthouserc.json` with assertions for Perf 100, LCP <1.0s, CLS=0 against Vercel preview URL.
- [ ] **Bundle hygiene pass** — close 119 KiB unused-JS gap on chunks `3302/e9a6067a/74c6194b/7525` via `ANALYZE=true` + targeted lazy-imports or `optimizePackageImports` extensions.
- [ ] **`@vercel/speed-insights` install** — real-device p75 telemetry for INP/LCP/CLS.

### Add If LCP Still > 1.0s After Above (v1.8.1)

- [ ] **`getQualityTier()` first-paint reads** — low-tier devices skip ghost-label, fall back to CSS-painted dithered hero, etc.
- [ ] **`content-visibility: auto` on below-fold SFSection** — skip rasterization of THESIS/PROOF/INVENTORY/SIGNAL/ACQUISITION until in viewport.
- [ ] **GSAP `lazy: true` audit** — defer non-LCP-window tweens.
- [ ] **Critical CSS extraction (`experimental.optimizeCss: true`)** — Chromatic-gated rollout.

### Future Consideration (v1.9+)

- [ ] **Speculation rules for route prefetch** — perceived perf, not synthetic LCP.
- [ ] **Anton fallback metrics override (Fontaine)** — only if `next/font`'s built-in match isn't sufficient post-swap migration.
- [ ] **Server Components audit on `components/blocks/`** — small win, no urgency.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Phase Hint |
|---------|------------|---------------------|----------|------------|
| LCP candidate diagnosis pass | HIGH (gates everything) | LOW (2h) | **P1 — first phase** | Phase A |
| Lighthouse CI in GitHub Actions | HIGH (regression prevention) | MEDIUM | **P1 — second phase** | Phase B (parallel-OK with A) |
| Anton subset + preload + swap | HIGH (likely the LCP fix) | LOW-MEDIUM | **P1** | Phase C (after A) |
| Inline `/sf-canvas-sync.js` | MEDIUM (-150ms render-blocking) | LOW | **P1** | Phase C (parallel) |
| Bundle hygiene pass (chunks 119 KiB) | MEDIUM (Perf score points) | MEDIUM | **P1** | Phase D |
| `@vercel/speed-insights` real-device | MEDIUM (validation) | LOW | **P1 (early)** | Phase B |
| `getQualityTier()` first-paint reads | MEDIUM (real-device parity) | MEDIUM | **P2** | Phase E (only if Phase C insufficient) |
| `content-visibility: auto` | LOW-MEDIUM (paint cost reduction) | MEDIUM (test risk) | **P2** | Phase E |
| GSAP `lazy: true` audit | LOW (small TBT win) | LOW | **P2** | Phase E |
| Critical CSS extraction | MEDIUM (-300ms render-blocking) | HIGH (regression risk) | **P2 — last resort** | Phase F (gated) |
| `fetchpriority="high"` Anton link | LOW (next/font may already do it) | LOW | **P3 (verify only)** | Folded into Phase C |
| Speculation rules | LOW (INP only) | LOW | **P3** | Defer to v1.9 |

**Priority key:**
- P1 = required to ship v1.8 (LCP <1.0s gate)
- P2 = ship if P1 insufficient; otherwise carry to v1.8.1
- P3 = defer to v1.9 unless trivial folding into P1 work

## Stack-Specific Constraints (Reject Generic Perf Advice)

This list ensures the roadmapper doesn't accept generic perf playbook items that don't apply here.

| Generic Advice | Why It Doesn't Apply Here |
|----------------|---------------------------|
| "Optimize images" | LCP element is text. Hero is GLSL shader (no image to optimize). |
| "Add `loading=\"lazy\"` to images" | Per above — moot. |
| "Use Next.js Image component" | Already used where applicable. Not the bottleneck. |
| "Preconnect to third-party domains" | Zero third-party requests in critical path. Self-hosted everything (per v1.6 metadata work). |
| "Reduce DOM size" | Homepage DOM is moderate (~32 SFSection instances + scaffolding). Not the issue. |
| "Use a CDN" | Vercel edge already does this. |
| "Replace GSAP with [smaller lib]" | Aesthetic-locked per CLAUDE.md `DO NOT add new GSAP effects`. GSAP is foundational, not optional. |
| "Use React Server Components everywhere" | Most blocks need `'use client'` for GSAP. Aspirational only. |
| "Defer the WebGL canvas" | Already lazy via `SignalCanvasLazy + next/dynamic({ssr:false})`. |
| "Lazy-load below-fold components" | Already done for SFToaster, GlobalEffects, SignalCanvas, CommandPalette, Calendar, Menubar. |

## Sources

**Codebase ground truth (HIGH confidence):**
- `/Users/greyaltaer/code/projects/SignalframeUX/components/animation/ghost-label.tsx`
- `/Users/greyaltaer/code/projects/SignalframeUX/components/blocks/manifesto-statement.tsx`
- `/Users/greyaltaer/code/projects/SignalframeUX/components/blocks/thesis-section.tsx`
- `/Users/greyaltaer/code/projects/SignalframeUX/components/layout/scale-canvas.tsx`
- `/Users/greyaltaer/code/projects/SignalframeUX/components/layout/page-animations.tsx:285-312`
- `/Users/greyaltaer/code/projects/SignalframeUX/app/layout.tsx:23-117`
- `/Users/greyaltaer/code/projects/SignalframeUX/app/globals.css:1495-1546`
- `/Users/greyaltaer/code/projects/SignalframeUX/public/sf-canvas-sync.js`
- `/Users/greyaltaer/code/projects/SignalframeUX/lib/gsap-split.ts`
- `/Users/greyaltaer/code/projects/SignalframeUX/lib/gsap-core.ts`
- `/Users/greyaltaer/code/projects/SignalframeUX/next.config.ts`
- `/Users/greyaltaer/code/projects/SignalframeUX/package.json`

**External (verified — HIGH/MEDIUM confidence):**
- [Largest Contentful Paint (LCP) — web.dev](https://web.dev/articles/lcp) — opacity:0 exclusion, viewport-intersection size rule (HIGH)
- [Optimize LCP — web.dev](https://web.dev/articles/optimize-lcp) — fetchpriority, preload, priority hints (HIGH)
- [Components: Script — Next.js](https://nextjs.org/docs/app/api-reference/components/script) — beforeInteractive, afterInteractive (HIGH)
- [Optimizing third-party script loading — Chrome for Developers](https://developer.chrome.com/blog/script-component) — measured 1s LCP improvement with Script (MEDIUM)
- [Eliminate render-blocking resources — Chrome for Developers](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources) — inline-critical pattern (HIGH)
- [Custom fonts without compromise — Vercel](https://vercel.com/blog/nextjs-next-font) — automatic subset + size-adjust (HIGH)
- [Getting Started: Font Optimization — Next.js](https://nextjs.org/docs/app/getting-started/fonts) — preload + subset behavior (HIGH)
- [CSS Font Display: Keep Text Visible — DebugBear](https://www.debugbear.com/blog/ensure-text-remains-visible-during-webfont-load) — swap vs optional tradeoffs (MEDIUM)
- [How To Fix LCP For Text Elements And H1 Headings — DebugBear](https://www.debugbear.com/docs/largest-contentful-paint-text-h1) — text-element LCP fixes (MEDIUM)
- [Lighthouse CI Action — GitHub Marketplace](https://github.com/marketplace/actions/lighthouse-ci-action) — per-PR enforcement pattern (HIGH)
- [GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci/) — assertion config + budgets (HIGH)
- [Speed Insights Metrics — Vercel](https://vercel.com/docs/speed-insights/metrics) — INP/LCP/CLS p75 (HIGH)
- [Guides: Package Bundling — Next.js](https://nextjs.org/docs/app/guides/package-bundling) — optimizePackageImports (HIGH)
- [Guides: Lazy Loading — Next.js](https://nextjs.org/docs/pages/guides/lazy-loading) — next/dynamic (HIGH)
- [Improve Largest Contentful Paint — CSS-Tricks](https://css-tricks.com/improve-largest-contentful-paint-lcp-on-your-website-with-ease/) — general LCP tactics (MEDIUM)
- [How CSS Opacity Animations Can Delay LCP — DebugBear](https://www.debugbear.com/blog/opacity-animation-poor-lcp) — opacity:0 → animated reveal anti-pattern (HIGH — confirms ghost-label fix already applied)

**Memory references (project-specific HIGH confidence):**
- `feedback_consume_quality_tier.md` — getQualityTier mandatory for new SIGNAL surfaces
- `feedback_ratify_reality_bias.md` — when changing locked decisions, document why and re-baseline
- `project_phase37_mobile_a11y_architectural.md` — Track B parked, ScaleCanvas architectural decision deferred
- `project_canvas_frame_vars.md` — ScaleCanvas contract is locked
- `feedback_raf_loop_no_layout_reads.md` — perf rule for any rAF work added in this milestone

---

*Feature research for: SignalframeUX v1.8 Speed of Light perf-recovery milestone*
*Researched: 2026-04-25*
*Confidence: HIGH on codebase facts and table-stakes/anti-feature categorization; MEDIUM on whether critical-CSS extraction will be needed (depends on what subset+preload+inline-script delta yields).*
