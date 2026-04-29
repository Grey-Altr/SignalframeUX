# Domain Pitfalls — v1.8 Speed of Light

**Domain:** Retrofitting LCP <1.0s + Lighthouse 100/100 into a built Next.js 15.3 site with locked GSAP-singleton-ticker, WebGL-singleton, ScaleCanvas transform model, `@layer signalframeux` cascade, intensity-bridge effect stack, and Chromatic visual baselines.
**Researched:** 2026-04-25
**Milestone scope:** v1.8 — render-blocking budget closure (570 ms), unused-JS budget closure (119 KiB), LCP recovery from 6.5 s mobile to <1.0 s, Lighthouse CI in pipeline, real-device verification — without changing pixels or violating motion/a11y/CLS contracts.
**Confidence:** HIGH on font-swap CLS, WebGL singleton, GSAP-ticker conflicts, RSC streaming flash (carries forward from v1.7) / HIGH on Lighthouse variance + warm-up requirement (verified GoogleChrome/lighthouse docs) / HIGH on Next.js 15 `experimental.inlineCss` cascade-layer breakage (verified GitHub issue #47585) / MEDIUM on `requestIdleCallback` Safari status (rolling out via Experimental Features 2024+; treat as polyfill-required) / MEDIUM on Lighthouse mobile transform-scaled LCP candidate misdetection (issue #16203 documents NO_LCP on transform-translated headings; ScaleCanvas extrapolation directional-not-numeric).

---

## Critical Pitfalls

### Pitfall 1: Font-Display Strategy Trades CLS for LCP — Anton 200–400 px Magnifies Both

**What goes wrong:**
The current LCP candidate is `span.sf-display` (Anton, clamp 200–400 px). The two viable `font-display` choices each break a different contract:

- `font-display: swap` — fallback paints immediately (LCP wins), then swap fires when Anton arrives. At 200–400 px, even a 1 % metric mismatch between the system fallback and Anton produces a multi-pixel layout shift — and the ghost-label is often the only large element on the screen, so its CLS contribution dominates the page CLS score. CLS=0 contract violated.
- `font-display: optional` — gives the font 100 ms to load; after that the fallback locks in for the page lifetime and Anton **never paints** for that visit. The locked aesthetic is lost. Chromatic baselines (61 stories captured against Anton) regress for any visit where the font misses the 100 ms window.
- `font-display: block` (Lighthouse default penalty) — invisible text > 100 ms hurts LCP. NO_LCP is also possible if no other candidate exists.

**Why it happens:**
The system fallback for a display face like Anton (condensed, narrow caps, tall ascent) is structurally different from Arial / Helvetica / system-ui (proportional, normal ascent). At body size the metric difference is sub-pixel. At 200–400 px the same percentage shift becomes 4–12 px of vertical motion. Whichever direction CLS engineers optimise toward bites the other CWV.

**How to avoid:**
- Use `next/font/local` for Anton (self-hosted, no third-party CDN race) with **explicit `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`** computed against a chosen system fallback. Tools: Brian Louis Ramirez Fallback Font Generator or `@nuxtjs/fontaine`-style automatic descriptor tuning.
- Pick the fallback metrics deliberately: `Impact, "Helvetica Neue Condensed", Arial Black, sans-serif` produces a closer baseline for Anton than `system-ui`.
- Once metrics are tuned, `font-display: swap` becomes safe — the swap is invisible because the boxes match. This is the only configuration that wins both LCP and CLS for a 200–400 px display face.
- Verify with `Layout Shift Regions` in Chrome DevTools Performance panel and a slow-3G hard-reload screen recording. If a recording shows the ghost-label moving on swap, the override descriptors are not tuned.
- Capture Chromatic baselines **after** the override descriptors are tuned, so the swap state matches the production state. Re-baseline if descriptors are subsequently re-tuned.

**Warning signs:**
- `font-display: swap` ships and CLS jumps from 0.00 to 0.05+ on the homepage (visible in Lighthouse trace and field RUM).
- `font-display: optional` ships and a fraction of mobile field visits report missing custom font (compare RUM screenshots vs. baseline).
- Chromatic shows the ghost-label position moved by 1–10 px between baselines and current run after a font-strategy change.

**Phase to address:** Early (pre-LCP-recovery) phase — font strategy is foundational; every subsequent LCP measurement is invalidated by a later font tweak.

---

### Pitfall 2: Removing `/sf-canvas-sync.js` From Critical Path Reintroduces CLS

**What goes wrong:**
`/sf-canvas-sync.js` is render-blocking **by design** (commit f6225b4). It writes `--sf-canvas-scale`, `--sf-frame-offset-x`, `--sf-frame-bottom-gap` to `<html>` before first paint. ScaleCanvas geometry depends on these values being set before any `transform: scale()` is computed; without them the canvas paints once at `scale(1)`, then re-paints at `scale(vw/1280)` when the script lands. That second paint is a full-page reflow and a guaranteed CLS spike.

The naive Lighthouse fix — "eliminate render-blocking resources" — adds `defer` or `async` to the sync script, which silently reintroduces the bug it was created to fix.

**Why it happens:**
Lighthouse's "render-blocking resources" audit doesn't know that this particular script is computing geometry that the very-first paint depends on. The audit fires green if you defer the script, even though the runtime CLS regresses. A drive-by performance optimization based purely on Lighthouse audit text leads directly to this regression.

**How to avoid:**
- **Never** `defer` or `async` `/sf-canvas-sync.js` without simultaneously changing how `--sf-canvas-scale` is set on the very first paint. Acceptable migration paths:
  1. Inline the script body in `<head>` as a tiny synchronous `<script>` (eliminates the network request AND eliminates the render-blocking penalty — Lighthouse counts inline scripts under HTML parse, not as a separate blocking resource).
  2. Compute the values server-side from the `User-Agent` viewport hint (Vercel/Edge runtime) and emit them as inline `<style>` on `<html>`. Defers JS evaluation to post-paint.
  3. Default `--sf-canvas-scale: 1` and `--sf-frame-bottom-gap: 0` in `globals.css`, and only adjust on resize / mobile via `defer`-able JS — accepts that desktop paints at scale 1 first paint (no shift because already 1280 = 1280) but mobile would still shift on first paint. Rejected unless mobile traffic is gated by media-query CSS.
- Add a `phase-XX-cls-sync.spec.ts` Playwright test that hard-reloads the homepage on iPhone-13 viewport, asserts CLS = 0 from `PerformanceObserver({type: 'layout-shift'})`. This test must be in the pipeline before the sync-script optimization phase begins.

**Warning signs:**
- Lighthouse "Reduce render-blocking resources" green, but CLS regresses from 0.00 to 0.05+ on the same audit run.
- Visual: hard-reload on a throttled mobile shows ScaleCanvas content "snapping" smaller after first paint.
- ResizeObserver-driven nav reveal fires twice on first paint instead of once.

**Phase to address:** The same phase that touches `/sf-canvas-sync.js` — never split critical-path work from CLS regression testing.

---

### Pitfall 3: Hero Shader Lazy-Loaded → Blank Canvas at First Paint Suppresses LCP

**What goes wrong:**
The hero GLSL shader (FBM noise + grid + Bayer dither) is heavy. A common LCP-recovery instinct is to mount the SignalCanvas on `IntersectionObserver` or after `requestIdleCallback`. The result: at first paint, the hero `<canvas>` element exists but is blank (no `getContext('webgl')` call yet, or the Three.js bundle hasn't loaded). Lighthouse's LCP detector either:

1. Picks the blank canvas as the LCP candidate (largest visible rect = blank canvas), records a paint event, scores LCP at the canvas first-pixel time — which is delayed by the lazy-mount **plus** the WebGL compile/upload — making LCP **worse**, not better.
2. Falls through to `span.sf-display` as the LCP candidate (already covered by Pitfall 1).
3. Returns `NO_LCP` if neither qualifies in time (lighthouse #15021, #16934).

This is the documented "LCP suppression hazard" already captured in the v1.5 carry-forward (`opacity: 0` start state on hero heading was the original instance — the same trap exists for the canvas).

**Why it happens:**
LCP is "largest contentful paint of an element that's been **rendered**." A blank canvas counts as a rendered element with the canvas's painted pixel rect. The optimization pattern "defer until idle" is correct for non-LCP elements but inverts for the LCP candidate itself.

**How to avoid:**
- Hero shader fast-path requirement is already in the contract (sub-500 ms first motion). Reinforce: the SignalCanvas WebGL context creation and first `gl.drawArrays()` must run before the LCP detection window closes (~2.5 s on slow-mobile).
- For the LCP-candidate element specifically: render with `opacity: 0.01` or `clip-path` reveal, **never `display: none`, `visibility: hidden`, or `opacity: 0`**. Lighthouse de-qualifies elements with effective opacity 0 from LCP candidacy.
- If the shader must be deferred, render a same-aspect, same-color-mean static placeholder (data-URI 1×1 colored rect scaled by CSS, OR a pre-rendered first-frame WebP) that **is** the LCP candidate. The shader takes over post-LCP without changing the paint geometry.
- Test by recording a Lighthouse trace and inspecting "Largest Contentful Paint" details. The element selector must match the intended candidate (`span.sf-display` or `picture.hero-poster`), never `canvas#signalcanvas` if the canvas paints blank.

**Warning signs:**
- Lighthouse trace LCP element = `canvas` with timing > 1.0 s.
- Lighthouse "Largest Contentful Paint element" panel shows a blank thumbnail.
- LCP got worse after a "lazy hero" change despite a smaller initial bundle.

**Phase to address:** Any phase that touches hero shader mount timing OR introduces lazy-loading. The LCP element identity must be a deliberate output of the phase, not a discovery after the fact.

---

### Pitfall 4: Adding a Second WebGL Canvas (Particle / OG / Effect Preview) Crashes iOS Safari

**What goes wrong:**
This pitfall carries forward from v1.1, v1.5, v1.7 — and is at heightened risk in v1.8 because performance-recovery work often spawns "isolate this effect into its own canvas to make it cheaper to defer/lazy-load." Each `<canvas>` with a distinct `WebGLRenderingContext` counts against iOS Safari's hard 2–8 context cap. The system already runs near the safe limit (singleton `SignalCanvas` shares one context across multiple scenes via render targets).

A v1.8 pitfall pattern: "let's lazy-load the particle field as a separate canvas component so we can `next/dynamic` it independently of the main hero." The dynamic split looks like a bundle win, but it's a singleton violation that crashes lower-end iPhones in the field even though Lighthouse passes.

**Why it happens:**
Bundle-splitting incentives push toward "one component, one canvas, one chunk" which is the opposite of singleton WebGL architecture. Lighthouse runs on Chrome, not Safari, so iOS context-loss never appears in the score. iOS Simulator does not enforce GPU memory limits the way hardware does.

**How to avoid:**
- Hard rule (already in CLAUDE.md / memory): **max one `<canvas>` with WebGL context across the entire site.** Any new effect routes through `useSignalScene()` as an additional render pass on the singleton.
- Code-search gate before any phase ships: `grep -rn 'getContext.*webgl\|getContext.*experimental-webgl\|new THREE.WebGLRenderer' --include='*.tsx' --include='*.ts' src/` — must return ≤ 1 active call site.
- For OG-image / preview / sprite-sheet generation: do it at build time (`/api/og`, `next/og`, or static generation), never in a runtime `<canvas>`.
- Real-device test on a physical iPhone XR/11/12/13 before any phase that adds or splits a WebGL boundary ships. iOS Simulator is insufficient.

**Warning signs:**
- Bundle analyzer shows a new chunk containing `three`, `WebGLRenderer`, `ShaderMaterial`, or `getContext`.
- Real-device iPhone Safari console: `WebGL: context lost` or `Error: Out of memory`.
- Hero canvas goes black after navigating between pages on iOS (eviction of older context when new one created).

**Phase to address:** Any phase that splits / lazy-loads a WebGL surface, or adds a new canvas-based feature. Architectural review must precede implementation.

---

### Pitfall 5: New rAF Loop For Perf Metrics / Idle-Defer Violates Single-Ticker Rule

**What goes wrong:**
v1.8 is likely to want:

- A perf metrics reporter (e.g., the `web-vitals` package, or a custom ticker that probes `performance.now()`).
- An idle-defer mechanism for non-critical work (`requestIdleCallback` polyfill, or a `setTimeout(work, 0)` queue).
- A "wait for first paint" gate for hero-shader fast-path.

If any of these introduce their own `requestAnimationFrame` loop, the single-ticker contract breaks. Worse, when the user enables `prefers-reduced-motion`, the GSAP `globalTimeline.timeScale(0)` halts GSAP's rAF — but a sidecar rAF keeps running, producing motion that should be paused. This is exactly why React Three Fiber was excluded (PROJECT.md, Out of Scope).

**Why it happens:**
- The `web-vitals` package itself is **safe**: it uses `PerformanceObserver` (declarative, off-main-thread) for LCP/CLS/FID/INP, not rAF. Verified against GoogleChrome/web-vitals.
- The risk is **wrappers around `web-vitals`** that add custom timing — e.g., a developer-written "report metrics every 5s" loop using `setInterval` or `requestAnimationFrame`.
- `requestIdleCallback` is supported in Chrome/Firefox but is a **late-rolling experimental flag in Safari** (enable-via-DevTools as of late 2024). Most polyfills implement `requestIdleCallback` as `setTimeout` with a priority queue — this is a sidecar timer that can race GSAP's `gsap.ticker` scheduling and produce motion artifacts under `prefers-reduced-motion`.

**How to avoid:**
- Use `web-vitals` directly via its `onLCP`, `onCLS`, `onINP`, `onFCP`, `onTTFB` hooks. These are PerformanceObserver-based and do not start a ticker.
- Call each metric hook **once** per page load (the package warns against multiple registrations — each creates a new PerformanceObserver and registers listeners for the page lifetime).
- For deferred work, use `gsap.ticker.add(callback, false)` with `lagSmoothing` already handled — this routes deferred work through the same rAF loop GSAP owns. If GSAP is paused (reduced-motion), the deferred work pauses too, which is the correct behavior.
- If `requestIdleCallback` is needed, polyfill behind a feature check with `gsap.delayedCall(0, work)` as the fallback rather than `setTimeout(work, 0)`. This routes through the GSAP ticker.
- Code-search gate: `grep -rn 'requestAnimationFrame\|new RAFLoop\|setInterval' --include='*.tsx' --include='*.ts' src/` — every match must be on an exception allowlist (Lenis raf, GSAP ticker — and only these).

**Warning signs:**
- Bundle includes `web-vitals` AND a custom rAF loop wrapper.
- Reduced-motion test: user has `prefers-reduced-motion: reduce`, motion continues despite `gsap.globalTimeline.timeScale(0)`.
- Two rAF callbacks visible in Chrome DevTools Performance panel "Animation Frame Fired" events per frame instead of one.

**Phase to address:** The phase that introduces metric reporting. Architectural review of any new rAF call site.

---

### Pitfall 6: Lighthouse CI on Vercel Preview Deploys — Cold-Start Variance Kills Reproducibility

**What goes wrong:**
Vercel preview deploys are spun up on demand. The first request to a freshly-deployed preview hits a cold edge cache, cold lambda (if any SSR/RSC remains), and an un-warmed CDN. Lighthouse runs immediately after deploy on the first request. Result: LCP variance ±300 ms run-to-run, occasional NO_LCP, score variance ±10 points cold vs ±3 points warm. A single-run pipeline pass is luck, and a single-run pipeline fail is also luck — engineers will start ignoring the gate as flaky.

This pattern is known: GoogleChrome/lighthouse `docs/variability.md` documents that simulated throttling minimises variance, but external factors (network/server load, cold cache, neighbour resource contention) still produce 5–10 point swings.

**Why it happens:**
Lighthouse measures wall-clock time. Cold edges add 50–500 ms TTFB. Cold lambda routes for any non-static path add another 200–2000 ms. Lighthouse fires LCP-detection windows in real wall-clock; the cold start eats into those windows.

**How to avoid:**
- Lighthouse-CI configuration must include:
  1. **Warmup request:** `curl --silent --output /dev/null https://preview-url.vercel.app/` × 2 before the Lighthouse run (or `curl-runnings` step). This warms edge cache and any lambda routes.
  2. **Multiple runs (≥ 3, ideally 5):** `numberOfRuns: 5` in `lighthouserc.js`. Lighthouse-CI auto-medians.
  3. **Median assertion only:** never gate on a single-run minimum. Use `assertions.categories:performance.aggregationMethod: median-run`.
  4. **Loosen CI thresholds 2–3 points below production target:** if production target is Lighthouse 100, gate at ≥ 97 in CI (production verification stays at 100). This absorbs run-to-run noise without ignoring real regressions.
  5. **Stable Chrome version:** pin `--chrome-flags="--no-sandbox"` and the Chrome image SHA in CI. A Chrome auto-upgrade can change Lighthouse scoring across runs.
- Production verification (real Lighthouse 100/100) runs on the deployed `signalframeux.com` URL, post-deploy, also with warmup + multiple runs. Vercel preview gate is a leading indicator; production gate is the contract.

**Warning signs:**
- LHCI run-to-run variance > 5 points on the same commit.
- "First run flaky, second run passes" pattern emerges in CI logs.
- Engineers begin pushing "rerun CI" on perf gate failures without code changes.

**Phase to address:** The phase that introduces Lighthouse CI itself (likely an early infrastructure phase). Variance mitigation must ship with the gate, not be tacked on after engineers complain.

---

### Pitfall 7: Critical CSS Inlining Breaks `@layer signalframeux` Order — Consumer Overrides Lose

**What goes wrong:**
Next.js 15 ships `experimental.inlineCss: true`. When enabled, all stylesheet `<link>` tags are replaced with inline `<style>` tags in `<head>`. The order is preserved at the file level, but the **CSS Cascade Layers** (`@layer signalframeux`) ordering is fragile:

- v1.7 architecture uses `@layer signalframeux { :root, .dark { ... } }` in the dist artifact, with consumer (CD site) CSS unlayered. The consumer wins because **unlayered CSS beats any layered CSS, regardless of source order.** This is the consumer-override architecture.
- When critical CSS is inlined, multiple chunked CSS files are concatenated into one or more `<style>` blocks. If the concatenation order interleaves layered + unlayered rules in unexpected ways, consumer overrides can lose their precedence.
- Reported issue (vercel/next.js#47585): "App router CSS handling is incompatible with CSS Cascade Layers — no way to guarantee that CSS that defines layers can be loaded before any usage of the CSS layers." This is open and impacts critical-CSS extraction.

**Why it happens:**
Cascade layers are scoped by their first declaration. If `@layer signalframeux` is first declared in chunk A and consumer overrides land in chunk B, but the inlining concatenates them with chunk B first, the layer is implicitly created from chunk B's `@layer signalframeux { ... }` reference — which makes consumer overrides also layered, which makes them lose to anything else unlayered. The result is `--sfx-primary` flashing magenta or whatever value is unlayered in some other file.

**How to avoid:**
- Do **not** enable `experimental.inlineCss` on the SF//UX site without verifying every story in Chromatic post-enable. The flag is documented as not production-ready by the Next.js team.
- If LCP recovery requires critical CSS inlining, prefer **manual extraction**: identify the ~5 KB of critical CSS (root vars, `@layer signalframeux` declaration block, layout primitives, ScaleCanvas geometry rules), inline that manually as a `<style>` in `<head>` via `app/layout.tsx`, and keep the rest as link-loaded — but `<link rel="preload" as="style"> + <link rel="stylesheet" media="print" onload="this.media='all'">` pattern.
- Whatever path is chosen, the test gate is: "consumer CSS file imported as `app/cd-overrides.css` must override a `--sfx-*` token, verified visually in Chromatic, in production prerender." If this test passes after the change, layer order is intact.

**Warning signs:**
- After an inline-CSS change: magenta flash returns on first paint (consumer override lost).
- Chromatic shows token values shifted across all stories (`--sfx-primary` / `--sfx-foreground` / `--sfx-background` regressions in tandem).
- DevTools "Computed" panel shows a `--sfx-*` value coming from `signalframeux.css` instead of consumer override CSS.

**Phase to address:** Any phase that touches CSS delivery strategy. Cascade-layer integrity test must be part of phase definition-of-done, not added after.

---

### Pitfall 8: `next/script strategy="beforeInteractive"` Order Drift Triggers CLS On Arrival

**What goes wrong:**
`next/script` with `strategy="beforeInteractive"` renders the script tag before Next.js hydrates the page. The contract: the script lands before any client-side JS, but **not** before first paint. If `/sf-canvas-sync.js` is migrated to `next/script` with `strategy="beforeInteractive"` (a common "modernize the script tag" instinct), the script runs *after* the first frame — which produces the CLS bug Pitfall 2 describes.

The pitfall is similar to Pitfall 2 but specific to the migration path. A drive-by "use the framework primitive instead of a raw `<script>` tag" change silently regresses CLS even though the code looks more idiomatic.

**Why it happens:**
`next/script` strategies (`beforeInteractive`, `afterInteractive`, `lazyOnload`, `worker`) are documented relative to hydration, not relative to first paint. None of them guarantee "before any visible paint." For sync-before-paint behavior, the script must be a raw `<script>` tag in `<head>` (or inlined).

**How to avoid:**
- Keep `/sf-canvas-sync.js` as a raw `<script>` tag in `app/layout.tsx`'s `<head>`, OR inline its contents directly. Do not migrate to `next/script`.
- If `next/script` is needed for any other script (analytics, heatmap, etc.), audit which strategy lands when relative to first paint, and never put pre-paint geometry computation behind `next/script`.

**Warning signs:**
- `next/script` import appearing in `app/layout.tsx` or near the root layout.
- CLS regression appearing simultaneously with a "modernize script tags" PR.

**Phase to address:** Any phase that refactors how scripts are loaded. Code review checklist item.

---

### Pitfall 9: ScaleCanvas Transform-Scaled LCP Candidate Misdetection On Mobile

**What goes wrong:**
ScaleCanvas wraps content at 1280 px logical width and applies `transform: scale(vw/1280)` on mobile to fit-to-viewport. Lighthouse's LCP detector measures element bounding rects in the *post-transform* coordinate space — so a 1280 × 800 logical hero on a 390 px iPhone-13 viewport is reported as 390 × 244 visible. This usually works fine, but two failure modes exist:

1. **Wrong candidate:** A non-hero element that is unaffected by the transform (e.g., a `position: fixed` overlay outside ScaleCanvas) becomes the largest visible rect because its 100 % viewport width beats the scaled hero's effective rect. Lighthouse picks the overlay as LCP, scoring its paint time (which may be later than the hero's).
2. **NO_LCP:** If the hero has `transform: scale(0.x)` applied as part of a scroll animation that starts at scale < 1 and grows toward 1, Lighthouse may de-qualify it from LCP candidacy until the transform settles. On mobile the scale never reaches 1, so the hero never qualifies. NO_LCP is reported (issue #15021, #16934 are documented variants).

**Why it happens:**
Lighthouse follows the LCP spec, which uses element rendered geometry. Transform-scaled elements get their effective rendered rect, not their pre-transform layout rect. The combination of "ScaleCanvas always applies a transform on mobile" + "Lighthouse sees the post-transform rect" produces non-obvious LCP candidate selection.

**How to avoid:**
- Verify LCP candidate identity per-viewport in Lighthouse traces: run audit on iPhone-13 viewport, inspect "Largest Contentful Paint element" panel. Confirm it's the intended element (`span.sf-display` or hero canvas / poster).
- If a non-hero element is winning LCP on mobile, either (a) the hero element needs a higher-priority load (preload its font, ensure shader fast-path), or (b) the non-hero LCP candidate needs `loading="lazy"` / move below the fold to disqualify it.
- Do NOT add `content-visibility: auto` to ScaleCanvas containers as a perf optimization. `content-visibility: auto` interacts with `transform-origin` math in non-obvious ways (browser may compute layout origin from the containment box, breaking the `vw/1280` ratio). Out of scope: `inverse-scaling` / counter-scaling experiments — that's Track B territory.
- Real-device check: if Lighthouse mobile says `NO_LCP` but the page visually renders fine, the LCP candidate is a transform-disqualified element. Pick a non-transformed candidate (`<img>` poster, `<span>` heading) as the deliberate LCP target.

**Warning signs:**
- Lighthouse mobile LCP element selector ≠ Lighthouse desktop LCP element selector for the same page.
- `NO_LCP` errors on mobile only.
- LCP element panel shows a fixed-position chrome element (nav, footer, overlay) instead of hero content.

**Phase to address:** First LCP measurement phase. Identify the *intended* mobile LCP candidate up-front; every subsequent optimization is targeted at that specific element.

---

### Pitfall 10: Mobile Emulation Score Passes, Real Mid-Tier Android Underperforms

**What goes wrong:**
Lighthouse default mobile emulation = "Moto G4" (2016 device, 4× CPU throttle, 1.6 Mbps Slow 4G). It's conservative for high-end mobile but **optimistic** for current low-end / mid-tier Android shipping in 2026. Real mid-tier Android (e.g., Samsung Galaxy A14, A24 — high-volume devices in target audiences):

- 4× CPU throttle in Lighthouse approximates Moto G4's CPU; A14's CPU is similar but the **GPU is slower** for shader compilation.
- Lighthouse simulated network throttling does not simulate variable mobile network conditions, packet loss, or wake-from-sleep radio cost.
- Lighthouse does not enforce iOS Safari context limits, mobile GPU memory pressure, or mid-tier thermal throttling (the 5th heavy WebGL frame on a hot phone takes 4× the first frame's time).

Result: Lighthouse 100/100 on emulated mobile, real-device A14 reports LCP 2.5s, scroll jank, visible WebGL stutter. The contract is technically met, but the field experience fails.

**Why it happens:**
Lighthouse is a synthetic tool optimized for cross-run consistency, not for "this is what real users experience." Field RUM (real user monitoring) drift from Lighthouse is documented (Google Search Central thread #101405680: PSI Lighthouse always higher than field data on bad pages; or sometimes lower — the gap varies).

**How to avoid:**
- Real-device verification is **mandatory** for this milestone (already in scope per PROJECT.md). Sample at minimum:
  1. iPhone 13 / 14 Safari (high-end mobile, dominant in design-conscious audiences).
  2. Samsung Galaxy A14 / A24 Chrome (mid-tier Android).
  3. (Optional) iPhone XR Safari (oldest in-support iOS).
- Real-device platforms: BrowserStack and WebPageTest both work. WebPageTest's "Test from a real device" with location selection gives reliable LCP/CLS numbers. BrowserStack adds login complexity and billing.
- Field RUM: ship `web-vitals` with `onLCP/onCLS/onINP` reporting to a lightweight endpoint (Vercel Analytics, Cloudflare Analytics, or a simple POST to `/api/vitals`). Field 75th-percentile is the contract for production users; Lighthouse 100/100 is the gate for synthetic verification.
- Critical: the milestone definition-of-done **must include real-device numbers**, not just Lighthouse CI. A passing Lighthouse score with no real-device data is "looks done but isn't."

**Warning signs:**
- Lighthouse passes 100, RUM reports LCP > 2.5 s on 25th percentile mobile.
- WebPageTest real-device mobile LCP > Lighthouse simulated mobile LCP by > 1 s.
- "It works on my phone" emerges as the verification standard (single-device anecdote).

**Phase to address:** Final-gate / verification phase, but real-device sampling should occur **at least once mid-milestone** — not just at the end. Discovering a real-device blocker after all phases ship is a refactor crisis.

---

## Moderate Pitfalls

### Pitfall 11: `font-display: swap` Without Preconnect / Preload Adds Network Latency To LCP

**What goes wrong:**
Even with size-adjust descriptors tuned (Pitfall 1), `font-display: swap` only helps if the font arrives before the LCP detection window closes. On slow 3G the Anton font file (60–120 KB woff2) can take 800+ ms after HTML parse to fetch. If the font is referenced via `@font-face` inside a CSS file, the browser doesn't know to fetch it until CSS parses, which is after HTML parses, which adds a waterfall.

**Prevention:**
- `next/font/local` automatically generates `<link rel="preload">` for self-hosted fonts. Use it.
- If using a raw `@font-face` declaration, add `<link rel="preload" href="/fonts/Anton.woff2" as="font" type="font/woff2" crossorigin>` in `<head>` of `app/layout.tsx`.
- Verify in Lighthouse "Avoid chained critical requests" — Anton should appear at depth 1, not depth 2 or 3.

**Phase to address:** Same phase as Pitfall 1 (font strategy).

---

### Pitfall 12: `web-vitals` Reporter Posts To `/api/*` On Every Page Load — Adds Lambda Cold Start To Bad Path

**What goes wrong:**
Shipping `web-vitals` with a POST-to-server reporter means every page load fires `navigator.sendBeacon('/api/vitals', json)`. If `/api/vitals` is a Vercel function (not edge), each call may cold-start a lambda. The beacon is fire-and-forget so user-perceived perf is not affected — but lambda cost and (more importantly) the Vercel observability data shows an N+1 cold-start pattern that masks real perf issues.

**Prevention:**
- Use Vercel Analytics directly (`@vercel/analytics`) or Vercel Speed Insights — both ship `web-vitals` under the hood and route to Vercel's edge endpoint, no lambda cold-start per request.
- If a custom endpoint is needed, deploy as Edge Runtime function (`export const runtime = 'edge'`), not Node serverless function.
- Verify post-deploy: `/api/vitals` invocations should not show in lambda cold-start metrics.

**Phase to address:** Phase that adds field RUM reporting.

---

### Pitfall 13: Bundle Analyzer Stale Chunks Mislead "We Hit The Budget" Conclusion

**What goes wrong:**
`ANALYZE=true pnpm build` keeps `.next/cache` for incremental builds. After multiple iterations of "remove import → re-run analyzer," the chunk visualization shows ghost chunks from earlier builds. Engineers conclude the bundle is X KB when it's actually X + (stale Y) KB. Conversely, a "win" reported by analyzer may be the cache reusing an older smaller chunk.

**Prevention:**
- Before any bundle measurement that gates a phase: `rm -rf .next/cache .next` and rebuild fresh.
- Cross-verify with `pnpm build`'s end-of-build size table (from Next.js itself) — that table is sourced from the actual emitted artifacts, not the analyzer's intermediate state.
- For CI bundle gate, use `next-bundle-analyzer` in headless mode with a clean working tree, OR use `bundlesize` / `size-limit` packages that diff against a baseline JSON, OR run `pnpm dlx -y @next/bundle-analyzer` against a clean build.

**Phase to address:** Bundle-gate phase. Add the clean-build step to the gate definition explicitly.

---

### Pitfall 14: "Easy Wins" Drift — Optimizing FCP/TBT/CLS While LCP Stays Bad

**What goes wrong:**
Lighthouse Performance category weighting (current Lighthouse 12+):
- LCP: 25%
- TBT: 30%
- CLS: 25%
- FCP: 10%
- SI: 10%

Engineers see "TBT is the heaviest weight" and optimize TBT first. TBT is also "easy" — defer scripts, code-split, etc. — and produces visible perf improvements. Meanwhile LCP stays at 6.5 s (current state) because the actual root cause (font / shader / canvas-sync waterfall) requires deeper architectural change. The team ships 5 phases of TBT/FCP wins, perf score moves from 76 → 88 (still not 100), and the milestone goal (LCP < 1.0 s) is unmet.

**Prevention:**
- Milestone success criteria are **per-metric**, not aggregate score. Document explicitly: "LCP < 1.0 s on prod homepage" is a separate gate from "Performance 100." Treat them as parallel constraints.
- Roadmap phase ordering: LCP-targeted phases (font strategy, hero shader fast-path, canvas-sync inlining) are sequenced **first**. Easy wins (tree-shake unused JS, defer non-critical scripts) come after LCP root-cause is addressed, OR in parallel with explicit no-regression-on-LCP gates.
- Mid-milestone checkpoint: if LCP hasn't moved by 50% of the phases, escalate to "LCP-only swarm" (drop in-flight phases, focus all engineering on LCP). Don't drift into TBT optimisation as a substitute.

**Phase to address:** Roadmap structure decision (informs phase ordering).

---

### Pitfall 15: Aesthetic-Preservation Drift Compounds Into Cohort-Jury Rejection

**What goes wrong:**
Each individual perf-driven aesthetic change is "barely visible." Examples:
- Anton fallback descriptors slightly off → ghost-label kerning shifts 1 %.
- Hero shader poster falls back at 60 % opacity instead of intended 100 % → first-frame is 5 % lighter than design.
- VHS scan-line opacity reduced 0.02 to fit a paint-time budget → vignette feels less "tense."
- Particle count halved on tier-low devices → density profile changes subtly.

Each change passes Chromatic if baselines were re-captured per-change ("approve this change as the new baseline"). Cumulatively, the system has drifted away from the locked aesthetic. SOTD jury / portfolio review reports "feels generic" without identifying which change broke it.

This is the highest-priority pitfall for v1.8 because it's the **only** one that can't be detected by any automated gate.

**Prevention:**
- Hard rule: **no perf change re-baselines Chromatic**. If a perf change forces a Chromatic regression, the perf change is wrong; find another path. Re-baselining is reserved for deliberate aesthetic decisions, never for perf side-effects.
- Establish a "design-of-record" snapshot at v1.8 start: full-page screenshots at desktop / iPhone-13 / iPad / 1440×900 of homepage + 4 subpages, stored as `.planning/visual-baselines/v1.8-start/`. Every phase end: pixel-diff against this snapshot. Any diff > 0.5 % flagged for human review.
- Cohort review at mid-milestone: external eye (designer collaborator, peer Awwwards submitter) reviews current state vs. v1.8-start snapshot. If "feels different" without specific code change as cause, escalate.
- Lock-in mode (memory: `feedback_lockin_before_execute.md`) — extract aesthetic contract from shipped code into a single canonical doc at v1.8 start. Every phase reads from it. No re-derivation per-phase.

**Warning signs:**
- "Just approve the new Chromatic baseline" emerges as a phase pattern.
- Designer feedback shifts from "ship it" to "something feels off" without specific points.
- Phase-end visual diffs are consistently > 0 even on "perf-only" phases.

**Phase to address:** Every phase. This is a milestone-wide standing rule, not a single-phase gate.

---

## Minor Pitfalls

### Pitfall 16: `prefers-reduced-motion` Path Gets Deferred Until After First Interaction

**What goes wrong:**
A perf-driven pattern: "set up SIGNAL effects on first scroll / first pointer move to delay setup cost from LCP window." If `prefers-reduced-motion` users never scroll (or arrive at a static state), the alternative-design reduced-motion path **never initialises**. Reduced-motion users see broken or partial effects instead of the curated alternative experience.

**Prevention:**
- Reduced-motion path setup runs at component mount, not on interaction. The setup itself should be cheap (no WebGL compile, no heavy texture upload) — that's the point of having an alternative design rather than a degradation.
- Test by setting `prefers-reduced-motion: reduce` in DevTools rendering panel, hard-reloading the page, **not interacting**, and verifying every effect is in its intended reduced-motion state.

**Phase to address:** Phase that introduces interaction-deferred effect setup.

---

### Pitfall 17: WCAG AA Contrast Mid-Tune From Perf Change (Reduced Effect Opacity → Lower Contrast)

**What goes wrong:**
Performance work may reduce overlay opacity (grain, VHS, halftone) on low-quality tier devices via `getQualityTier()`. If the reduced-opacity rule applies to a section where text contrast was tuned against the full-opacity overlay, the text suddenly fails AA contrast on those devices. Light-mode `--sfx-muted-foreground` is currently 5.81:1 against tuned background — easy to lose if grain opacity drops without re-checking.

**Prevention:**
- Any `getQualityTier()` step-down rule that affects opacity, blur, or layered filter values must include a contrast re-check on the affected text. Use Chrome DevTools Lighthouse Accessibility audit in low-tier mode.
- Lock floor contrast: `--sfx-muted-foreground` AA ratio against `--sfx-background` must hold across all four quality tiers. Add an axe-core test that runs in low-tier configuration.

**Phase to address:** Any phase that adjusts effect intensity by quality tier.

---

### Pitfall 18: `loading="lazy"` On Above-The-Fold Image Disqualifies It From LCP

**What goes wrong:**
Reflexive pattern: add `loading="lazy"` to all `<img>` for "perf." Lighthouse penalizes lazy-loaded above-the-fold images by not counting them as LCP candidates (similar to opacity-0 disqualification). If a hero poster image is the intended LCP candidate (Pitfall 3 mitigation), `loading="lazy"` on it removes it from candidacy.

**Prevention:**
- Above-the-fold images: `loading="eager"` (or omitted, which defaults to eager) AND `fetchpriority="high"`. Use Next.js `Image` component with `priority` prop, which sets both.
- Below-the-fold images: `loading="lazy"`. Standard pattern.

**Phase to address:** Any phase that audits image loading attributes.

---

### Pitfall 19: Lighthouse CLI Headless vs. Real Browser WebGL Differs

**What goes wrong:**
Lighthouse CLI runs Chrome headless. Headless Chrome's WebGL behavior differs from headed Chrome: software rendering by default (SwiftShader), no real GPU. Heavy WebGL scenes that compile/upload fine in real Chrome may take 200–800 ms longer in headless, occasionally fail compile entirely. This was already noted in v1.3 minor tech debt: "Lighthouse CLI headless not representative with WebGL."

**Prevention:**
- Lighthouse CI verification uses Lighthouse-CI in headed mode with `--chrome-flags="--use-gl=angle --enable-features=Vulkan"` to enable hardware-ish rendering, OR runs against a real-browser CI service (BrowserStack / Lambdatest).
- Production verification (the source of truth for the contract) uses PageSpeed Insights against the live URL — that runs Chrome with real GPU on Google's infrastructure.

**Phase to address:** Lighthouse CI infrastructure phase.

---

### Pitfall 20: Cache-Busting Token Bridge File Renames Break Consumer Override Order

**What goes wrong:**
Production builds emit `signalframeux.css` with a content hash (`signalframeux-abc123.css`) for cache-busting. Consumer (CD site) imports `signalframeux/dist/signalframeux.css` — which is fine, the package resolution handles the hash internally. But if a perf optimization introduces explicit hash-aware paths (`<link href="/_next/static/css/signalframeux-abc123.css">`), the consumer override import order is now hash-coupled. Hash changes on every release; consumer site has no way to re-pin its override order without a coordinated release.

**Prevention:**
- Keep the package import shape (`import 'signalframeux/signalframeux.css'`) — never expose hashed paths to consumers. Next.js handles hashing internally.
- If critical CSS is inlined for SF//UX site itself, that's local — doesn't affect consumers.

**Phase to address:** Distribution-build phase (if v1.8 touches the dist pipeline).

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Font strategy / LCP candidate selection | swap CLS / optional missing-font / Anton 200–400 px magnification | `next/font/local` with tuned size-adjust + ascent-override; preload; hard-reload screen recording verification |
| `/sf-canvas-sync.js` optimization | CLS regression on defer/async | Inline in `<head>` instead of deferring; CLS Playwright test in pipeline before phase ships |
| Hero shader fast-path / lazy-mount | LCP suppression via blank canvas | Reserve LCP candidate as `span.sf-display` or static poster; canvas takes over post-LCP |
| Bundle splitting / code-split | Second WebGL canvas violation | grep-gate for new `getContext('webgl')` call sites; real-iPhone test before merge |
| Metric reporting (web-vitals or custom) | New rAF loop violating single-ticker | Verified `web-vitals` package uses PerformanceObserver; gate against custom rAF loops; use `gsap.ticker.add` for deferred work |
| Lighthouse CI introduction | Cold-start variance, single-run flake | Warmup requests + `numberOfRuns: 5` + median assertion + threshold 2–3pts below prod target |
| Critical CSS inlining (`experimental.inlineCss`) | `@layer signalframeux` order break / consumer override loss | Don't enable the experimental flag without Chromatic re-verification; prefer manual critical-CSS extraction |
| `next/script` migration of canvas-sync | Drift to non-pre-paint scheduling → CLS | Keep raw `<script>` in `<head>`; do not migrate canvas-sync to `next/script` |
| ScaleCanvas / mobile LCP candidate verification | Wrong candidate selection / NO_LCP | Identify intended mobile LCP candidate up-front; verify in Lighthouse trace per-viewport |
| Real-device verification | Mobile emulation pass, real-device fail | iPhone 13 Safari + Galaxy A14 Chrome at minimum; mid-milestone real-device sampling, not end-only |
| Quality-tier opacity step-down | WCAG AA contrast regression | Axe-core test in low-tier configuration; lock muted-foreground 5.81:1 floor |
| Bundle measurement | Stale chunk cache misleading numbers | `rm -rf .next/cache .next` before any gating measurement |
| Phase ordering | LCP stays bad, easy wins drift | Per-metric milestone gates (LCP <1.0 s separate from Performance 100); LCP-targeted phases first |
| Aesthetic preservation | Cumulative drift, cohort-jury rejection | No Chromatic re-baselining for perf changes; visual-of-record snapshot at start; mid-milestone external review |
| Reduced-motion path | Setup deferred to interaction → never initialises | Mount-time setup for reduced-motion path; scroll-free verification |
| Above-the-fold image lazy | LCP candidate disqualified | `priority` prop on Next `Image`; lazy only below-the-fold |

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|---|---|---|---|
| `experimental.inlineCss: true` (Next.js flag) | Eliminate CSS render-blocking, instant LCP win | Cascade-layer order breakage, undocumented flag, Next team explicitly says not production-ready | Never — use manual critical-CSS extraction |
| Re-baseline Chromatic on a perf-driven visual diff | Phase ships green | Cumulative aesthetic drift, cohort-jury rejection, locked aesthetic compromised | Never |
| Single-run Lighthouse-CI gate | Faster CI runs, simpler config | Run-to-run variance produces flaky failures, gate gets ignored, real regressions slip past | Never — minimum 3 runs with median |
| Defer `/sf-canvas-sync.js` for "render-blocking" win | Lighthouse audit goes green | CLS regresses from 0.00 to 0.05+, contract broken | Never — inline instead |
| `loading="lazy"` blanket on all images | Perf intuition match | Above-the-fold LCP candidate disqualified | Below-the-fold only |
| Custom rAF loop for perf metrics | Direct timing control | Single-ticker rule violated, reduced-motion path broken | Never — use `web-vitals` PerformanceObserver hooks |
| Skip real-device verification, trust Lighthouse CI | Faster milestone sign-off | Field LCP > 2.5 s on mid-tier devices, jury rejection on Awwwards submission | Never for v1.8 — milestone scope explicitly requires real-device |
| `font-display: optional` for guaranteed CLS=0 | CLS easy to hit | Anton silently missing on slow connections — locked aesthetic compromised | Acceptable only if size-adjust descriptors are also tuned (which makes `swap` viable) — `optional` then becomes redundant |
| Ship perf changes without `pnpm build` clean rebuild | Fast iteration | Stale-chunk bundle measurements, false "we hit budget" conclusions | Never for budget-gating measurements |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|---|---|---|
| `next/font/local` for Anton | Default `display: 'auto'` — undefined fallback metrics | Explicit `display: 'swap'` + `adjustFontFallback` (Next 13.4+) OR manual `size-adjust`/`ascent-override` descriptors |
| `web-vitals` package | Multiple `onLCP()` registrations across components | Single registration in `app/layout.tsx` or root provider, never per-component |
| Vercel Analytics / Speed Insights | Custom `/api/vitals` endpoint duplicating effort | Use `@vercel/analytics` or `@vercel/speed-insights` directly — same `web-vitals` under the hood, edge-routed |
| Lighthouse CI on Vercel | Run against deploy preview without warmup | `lhci collect --warm-runs=2` before scoring runs |
| Chromatic against perf changes | Re-baseline on every diff | Read-only verification for perf phases; baselines only update on intentional aesthetic changes |
| Lighthouse-CI assertion config | `minScore: 1.0` (require perfect) | `minScore: 0.97` in CI, real-Lighthouse 100 against prod URL post-deploy |
| WebPageTest real-device | Login complexity, manual run | Use the API + scripted recipe per release, store JSON results in `.planning/perf-baselines/v1.8/` |
| BrowserStack | Treated as Lighthouse replacement | Treat as supplement — for visual / interaction testing on real devices, not for perf scoring |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|---|---|---|---|
| Anton at 200–400 px swap-CLS | CLS 0.05+ on mobile homepage | size-adjust + ascent-override descriptors | Any swap event without metric matching |
| Blank-canvas LCP suppression | LCP element = `canvas`, time > 1.0 s | LCP candidate is text or static image, never blank canvas | Lazy-mount of hero canvas without poster |
| Second WebGL context | iOS Safari "context lost" black screen | Singleton `useSignalScene()` for all WebGL surfaces | Adding a particle / preview / OG canvas separate from singleton |
| Sidecar rAF loop | Reduced-motion users see motion despite `timeScale(0)` | All deferred work via `gsap.ticker.add` or `gsap.delayedCall` | Any `setTimeout`/`setInterval`/`requestAnimationFrame` outside Lenis or GSAP |
| Cold-start Lighthouse variance | ±10 point swings, flaky CI | Warmup + 5 runs + median + 3-pt CI threshold buffer | Any single-run gate config |
| Inlined CSS layer reorder | Magenta flash, all `--sfx-*` shifted | Manual critical-CSS extraction; no `experimental.inlineCss` | Enabling Next.js inline-CSS flag |
| `next/script` for canvas-sync | CLS regression on first paint | Raw `<script>` in `<head>` only | Migrating canvas-sync to next/script |
| Aesthetic drift via re-baseline | "Feels generic" without identifiable cause | No re-baseline for perf phases; visual-of-record snapshot | Approving Chromatic diffs as "fine" without scrutiny |
| Mobile-emulation-only verification | LH 100 with real-device LCP > 2.5 s | Real iPhone + mid-tier Android sampling | Skipping real-device for phase sign-off |
| Stale `.next` chunks in analyzer | False bundle-budget conclusions | Clean rebuild before any gating measurement | Any measurement after iterative builds |

---

## "Looks Done But Isn't" Checklist

- [ ] **LCP < 1.0 s declared:** Verify on real iPhone 13 Safari AND real Galaxy A14 Chrome — not just Lighthouse emulation. Field RUM 75th percentile also < 1.0 s.
- [ ] **Lighthouse 100/100 declared:** Run ≥ 5 runs against prod URL, median is 100. Single-run 100 is luck.
- [ ] **CLS = 0 declared:** Hard-reload on slow-3G iPhone-13 viewport in screen recording. No visible motion of ghost-label, no layout snap on canvas-sync. CLS = 0.000 in trace, not 0.001 ("close enough").
- [ ] **Render-blocking budget closed:** Lighthouse "Reduce render-blocking resources" reports 0 ms — and CLS regression test passes (Pitfall 2 trap).
- [ ] **Unused JS budget closed:** Bundle analyzer (clean rebuild) shows < 200 KB initial. Identified chunks (`3302`, `e9a6067a`, `74c6194b`, `7525`) accounted for or eliminated.
- [ ] **Lighthouse CI gate green on PR:** Median of 5 runs ≥ 97 in CI. Cold-start variance documented as expected. No "rerun CI" pattern in last 5 PRs.
- [ ] **Aesthetic preservation verified:** Visual-of-record snapshot pixel-diff < 0.5 % per page. Cohort review (external eye) confirms no "feels generic" drift.
- [ ] **WCAG AA holds across quality tiers:** axe-core passes in low-tier configuration. `--sfx-muted-foreground` ≥ 5.81:1 against `--sfx-background` in all tier states.
- [ ] **Reduced-motion path mounts at load:** Setting `prefers-reduced-motion: reduce` and hard-reloading without interaction shows intended alternative design fully initialised.
- [ ] **Single-ticker rule maintained:** `grep -rn 'requestAnimationFrame\|setInterval' src/` returns only Lenis raf and GSAP ticker call sites.
- [ ] **WebGL singleton maintained:** `grep -rn 'getContext.*webgl' src/` returns ≤ 1 match.
- [ ] **Real-device verification logged:** WebPageTest or BrowserStack JSON reports in `.planning/perf-baselines/v1.8/` for at least 3 device profiles.
- [ ] **Track B not accidentally addressed:** ScaleCanvas pillarbox / counter-scale architectural decision still parked. No commits modifying ScaleCanvas geometry math.
- [ ] **Chromatic stories pass without re-baselining:** All 61 stories green against pre-v1.8 baseline. If any phase required re-baseline, that's a phase failure not a phase sign-off.

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---|---|---|
| Anton swap CLS regression | LOW | Tune size-adjust/ascent-override descriptors; re-test; if still regressing, switch to `optional` and re-baseline Chromatic deliberately (one-time) |
| Canvas-sync defer reintroduces CLS | LOW | Revert defer; inline script in `<head>`; verify CLS = 0 |
| Blank-canvas LCP suppression | MEDIUM | Add static poster (data-URI 1×1 colored rect or pre-rendered first-frame WebP); shader takes over post-LCP |
| Second WebGL context shipped, iOS context-loss | MEDIUM-HIGH | Migrate new effect to singleton `useSignalScene()`; if architecture forces separate canvas, implement `webglcontextlost`/`webglcontextrestored` handlers; real-device re-test |
| Single-ticker rule violated | LOW-MEDIUM | grep for new rAF call site; route through `gsap.ticker.add` or remove |
| Lighthouse CI flakiness | LOW | Add warmup + median + threshold buffer; revisit pipeline config |
| `experimental.inlineCss` cascade-layer break | MEDIUM | Disable the flag; revert to manual critical-CSS inlining; verify `--sfx-*` overrides via consumer-import test |
| Wrong LCP candidate on mobile | MEDIUM | Identify actual candidate in Lighthouse trace; either preload-prioritise the intended candidate or disqualify the wrong one (lazy / off-screen) |
| Real-device perf gap discovered late | HIGH | Mid-milestone add real-device sampling; if discovered at end, phase added or milestone slips — not negotiable, the contract requires real-device |
| Aesthetic drift discovered post-ship | HIGH | Re-derive aesthetic-of-record from pre-v1.8 commit; re-Chromatic; identify drift-introducing PRs and revert / re-implement; jury submission held until clean |
| WCAG AA regression from quality-tier opacity step-down | LOW | Re-tune opacity to preserve contrast floor; OR pair tier step-down with foreground-color compensation |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---|---|---|
| Font strategy CLS / LCP tradeoff (#1) | Early infrastructure phase (font setup) | size-adjust descriptors tuned; slow-3G hard-reload screen recording; LCP < 1.0 s on Anton element |
| Canvas-sync defer regression (#2) | Same phase that touches sync script | CLS Playwright test in pipeline; CLS = 0 on iPhone-13 viewport |
| Blank-canvas LCP suppression (#3) | Hero shader / LCP candidate phase | Lighthouse trace LCP element matches intended target (text or static poster, never blank canvas) |
| Second WebGL context (#4) | Any phase splitting WebGL surfaces | grep gate ≤ 1 `getContext('webgl')`; real-iPhone test |
| Sidecar rAF / single-ticker violation (#5) | Metric reporting phase | grep gate; reduced-motion test confirms motion stops |
| Lighthouse CI variance (#6) | Lighthouse CI infrastructure phase | Median of 5 runs ≥ 97; ≤ 3 point variance run-to-run |
| Critical CSS layer order break (#7) | Any CSS delivery phase | Consumer-override Chromatic test passes |
| `next/script` canvas-sync drift (#8) | Code-review checklist (any phase) | grep gate against `next/script` for canvas-sync |
| Mobile LCP candidate misdetection (#9) | First LCP measurement phase | Lighthouse trace per-viewport confirms intended candidate |
| Real-device verification gap (#10) | Mid-milestone + final-gate phase | WebPageTest/BrowserStack reports for 3+ device profiles |
| Font-preload missing (#11) | Font strategy phase | Lighthouse "Avoid chained critical requests" depth ≤ 1 |
| `web-vitals` lambda cold-start (#12) | Field RUM phase | Endpoint runtime is edge, not Node serverless |
| Bundle analyzer stale chunks (#13) | Bundle-gate phase | Clean-build step in gate definition |
| Easy-wins drift (#14) | Roadmap structure decision | Per-metric gates; LCP-targeted phases sequenced first |
| Aesthetic preservation drift (#15) | Every phase (milestone-wide rule) | No re-baseline for perf phases; visual-of-record snapshot diff |
| Reduced-motion deferred setup (#16) | Any interaction-deferred effect phase | Mount-time setup; no-interaction reduced-motion test |
| WCAG AA tier step-down (#17) | Any quality-tier rule phase | axe-core in low-tier; muted-foreground 5.81:1 floor |
| Lazy above-the-fold image (#18) | Image audit phase | `priority` on hero image; LCP candidate verification |
| Headless Chrome WebGL gap (#19) | Lighthouse CI infrastructure phase | Headed Chrome OR PageSpeed Insights against prod URL for source-of-truth |
| Hashed token-bridge import path (#20) | Distribution-build phase | Consumer import shape unchanged (no exposed hash paths) |

---

## Confidence Assessment

| Finding | Confidence | Basis |
|---|---|---|
| Anton swap CLS at 200–400 px, size-adjust as mitigation | HIGH | DebugBear, web.dev font best practices, fontfyi swap/optional analysis (current 2025/2026 guidance) |
| `/sf-canvas-sync.js` defer reintroduces CLS | HIGH | Project-specific (commit f6225b4 contract); architectural certainty |
| Blank-canvas LCP suppression hazard | HIGH | Project carry-forward (v1.5 STATE.md); Lighthouse `NO_LCP` issue confirmed in #15021, #16934 |
| WebGL singleton iOS context limit | HIGH | Carries forward HIGH confidence from v1.7 PITFALLS.md (webkit.org/b/261331, b/262628); reinforced by current memory rules |
| Single-ticker rule + web-vitals safety | HIGH | GoogleChrome/web-vitals docs — uses PerformanceObserver, not rAF; project-specific single-ticker contract |
| Lighthouse CI cold-start variance | HIGH | GoogleChrome/lighthouse `docs/variability.md`; DebugBear analysis of throttling variance |
| `experimental.inlineCss` cascade-layer break | HIGH | vercel/next.js#47585 (open issue, App Router incompatible with cascade layers); Next.js team explicitly says experimental flag not production-ready |
| `next/script beforeInteractive` order drift | MEDIUM | Documented relative to hydration not first paint; logical extension of Pitfall 2 |
| Mobile LCP candidate misdetection on transform-scaled | MEDIUM | Lighthouse #16203 (NO_LCP on mobile only with transformed elements); ScaleCanvas extrapolation is directional, not exact-numeric |
| Mobile emulation vs real-device gap | HIGH | Lighthouse `docs/throttling.md` documents simulated throttling minimises variance, not field accuracy; Google Search Central #101405680 documents PSI vs field gap |
| Real-device verification mandatory | HIGH | Milestone scope (PROJECT.md) explicitly requires real-device |
| Font preload chain depth | HIGH | Lighthouse "Avoid chained critical requests" audit semantics |
| `web-vitals` lambda cold-start | MEDIUM | Vercel function model; logical extension of cold-start patterns |
| Bundle analyzer stale chunks | HIGH | `.next/cache` behavior; webpack analyzer reuse semantics |
| Easy-wins drift / metric weighting | HIGH | Lighthouse 12+ scoring weights documented |
| Aesthetic preservation drift | HIGH | Project memory (`feedback_aesthetic_direction`, `feedback_lockin_before_execute`); v1.7 PITFALLS pattern |
| Reduced-motion mount-time path | MEDIUM | Memory rule (`feedback_consume_quality_tier`); architectural extension |
| WCAG AA at quality-tier step-down | MEDIUM | Memory rule (`feedback_t3_text_contrast_floor`); compositional risk |
| Lazy above-the-fold disqualification | HIGH | Lighthouse LCP element rules documented |
| Headless Chrome WebGL software rendering | MEDIUM | v1.3 STATE.md acknowledges; SwiftShader fallback documented in Chromium |
| `requestIdleCallback` Safari status | MEDIUM | LambdaTest/MDN compat data; rolling out via Experimental Features 2024+; treat as polyfill-required |

---

## Sources

- [GoogleChrome/lighthouse — Throttling docs](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)
- [GoogleChrome/lighthouse — Variability docs](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md)
- [GoogleChrome/lighthouse — NO_LCP mobile issue #16203](https://github.com/GoogleChrome/lighthouse/issues/16203)
- [GoogleChrome/lighthouse — NO_LCP only on mobile #15021](https://github.com/GoogleChrome/lighthouse/issues/15021)
- [GoogleChrome/lighthouse — NO_LCP despite full render #16934](https://github.com/googlechrome/lighthouse/issues/16934)
- [GoogleChrome/lighthouse — LCP interesting cases #10527](https://github.com/GoogleChrome/lighthouse/issues/10527)
- [GoogleChrome/web-vitals — package source / API](https://github.com/googlechrome/web-vitals)
- [vercel/next.js — App router CSS handling incompatible with cascade layers #47585](https://github.com/vercel/next.js/issues/47585)
- [vercel/next.js — Add support for critical CSS inlining with App Router #59989](https://github.com/vercel/next.js/discussions/59989)
- [vercel/next.js — `experimental.inlineCss` config docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/inlineCss)
- [DebugBear — Fixing Layout Shifts Caused by Web Fonts](https://www.debugbear.com/blog/web-font-layout-shift)
- [DebugBear — Lighthouse Score Discrepancies](https://www.debugbear.com/blog/lighthouse-score-discrepancies)
- [DebugBear — Simulated Throttling In Lighthouse And On PageSpeed Insights](https://www.debugbear.com/blog/simulated-throttling)
- [web.dev — Best practices for fonts](https://web.dev/articles/font-best-practices)
- [Brian Louis Ramirez — Fallback Font Generator (size-adjust + ascent-override)](https://screenspan.net/fallback)
- [GSAP — gsap.updateRoot() docs](https://gsap.com/docs/v3/GSAP/gsap.updateRoot)
- [GSAP forums — GSAP and Google Core Web Vitals](https://gsap.com/community/forums/topic/24495-gsap-and-google-core-web-vitals/)
- [WebKit Bug 261331 — WebGL context lost backgrounding Safari iOS 17](https://bugs.webkit.org/show_bug.cgi?id=261331)
- [WebKit Bug 262628 — WebGL context lost iOS 17 Safari](https://bugs.webkit.org/show_bug.cgi?id=262628)
- [Trys Mudford — Fixing Next.js's CSS order using cascade layers](https://www.trysmudford.com/blog/next-js-css-order/)
- [Loke.dev — The Next.js CSS Bug That Drove Me Crazy](https://loke.dev/blog/nextjs-css-resolution-order-bug)
- [pladaria/requestidlecallback-polyfill](https://github.com/pladaria/requestidlecallback-polyfill)
- [LambdaTest — Browser Compatibility of requestIdleCallback on Safari](https://www.lambdatest.com/web-technologies/requestidlecallback-safari)
- [Project carry-forward: `.planning/research/PITFALLS.md` (v1.7) — WebGL singleton, GSAP-CSS-transition conflict, RSC streaming flash patterns]
- [Project memory: `feedback_aesthetic_direction.md`, `feedback_lockin_before_execute.md`, `feedback_consume_quality_tier.md`, `feedback_raf_loop_no_layout_reads.md`, `feedback_t3_text_contrast_floor.md`]
- [Project STATE.md — v1.5 LCP suppression hazard carry-forward; v1.6 GSAP SSR guard; v1.7 single-ticker rule]
- [Project commit f6225b4 — `/sf-canvas-sync.js` render-blocking by design]
