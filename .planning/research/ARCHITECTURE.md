# Architecture Research — v1.8 Speed of Light

**Domain:** LCP/Lighthouse-100 perf recovery for shipped Next.js 15 App Router site (SignalframeUX portfolio)
**Researched:** 2026-04-25
**Mode:** Project research — integration architecture (NOT ecosystem survey)
**Confidence:** HIGH for codebase-specific integration points (file paths, contracts), MEDIUM for Next.js 15 critical-path patterns (verified against current docs), LOW where Lighthouse CI runner choice is open

> Scope discipline: this document does NOT re-investigate framework choices, animation stack, or aesthetic contracts. Those are locked. It only addresses HOW perf-recovery interventions slot into the existing rendering / cascade / ticker chain without breaching the locked contracts.

## Existing Architecture (Reference, Not Re-Researched)

```
┌──────────────────────────────────────────────────────────────────────┐
│  CRITICAL PATH (current — Phase 37 measured)                         │
├──────────────────────────────────────────────────────────────────────┤
│  HTML stream                                                         │
│    ├─ inline themeScript        (<script>, ~250B, blocking)          │
│    ├─ inline scaleScript        (<script>, ~600B, blocking)          │
│    ├─ Tailwind+app CSS          (render-blocking, ~570ms total)      │
│    └─ /sf-canvas-sync.js        (external sync, BLOCKING by design)  │
│         └─ writes outer.style.height pre-paint → CLS=0               │
│  React hydration                                                     │
│    ├─ LenisProvider.useEffect   (Lenis init + GSAP ticker hook)      │
│    ├─ ScaleCanvas.useEffect     (rAF debounced applyScale)           │
│    ├─ GlobalEffectsLazy         (next/dynamic ssr:false)             │
│    └─ SignalCanvasLazy          (next/dynamic ssr:false, Three.js)   │
│  GSAP ticker starts → drives:                                        │
│    ├─ Lenis.raf(time*1000)                                           │
│    ├─ ScrollTrigger.update                                           │
│    └─ All SIGNAL surfaces (single rAF rule)                          │
│  First SIGNAL frame (currently visible LCP @ 6.5s mobile)            │
└──────────────────────────────────────────────────────────────────────┘
```

| Locked contract | File-of-record | What perf work MUST NOT break |
|-----------------|----------------|-------------------------------|
| Single GSAP ticker | `lib/gsap-core.ts:8-13` | No new rAF loops; `getQualityTier()` mandatory for new SIGNAL |
| WebGL singleton | `components/layout/signal-canvas-lazy.tsx`, `lib/signal-canvas.ts` | Max 1 SignalCanvas instance (iOS Safari context limit) |
| `@layer signalframeux` cascade | `app/globals.css`, `dist/signalframeux.css` | Consumer (unlayered) wins; no flash, no SSR magenta |
| `--sfx-*` vs `--sf-*` prefix split | `app/globals.css`, `components/layout/scale-canvas.tsx:75-81` | Color/duration → `--sfx-*`; sizing/canvas/nav-state → `--sf-*` |
| Reduced-motion kill switch | `lib/gsap-core.ts`, `components/layout/lenis-provider.tsx:18-21` | All derived motion collapses to 0 with one timeScale flip |
| Pre-hydration scale write | `app/layout.tsx:91-100` (themeScript + scaleScript inline) | First paint must already be scaled → CLS=0 |
| Hole-in-the-donut SSR | `components/layout/signalframe-config.tsx` | Children stay Server Components |

## Phase 37 Measured Gaps (HARD, drive intervention scope)

| Gap | Current | Target | Root cause hypothesis |
|-----|---------|--------|------------------------|
| LCP (mobile, prod) | 6.5s | <1.0s | Ghost-label `span.sf-display` picked as LCP element after ScaleCanvas transform-box pulls below-fold elements into viewport calc |
| Render-blocking | 570ms total | <200ms | Two CSS files + `/sf-canvas-sync.js` fetch on critical path |
| Unused JS | 119 KiB across 4 chunks (`3302`, `e9a6067a`, `74c6194b`, `7525`) | <30 KiB | Unattributed; needs `@next/bundle-analyzer` audit |
| Main-thread block | 2.4s | <1.5s TTI | Hydration + GSAP ticker registration + Lenis init front-loaded |

## Integration Architecture (Question-by-Question)

---

### Q1. `/sf-canvas-sync.js` repositioning

**Current contract** (`public/sf-canvas-sync.js`, 1 line minified):
```js
// Reads inner [data-sf-canvas].offsetHeight, multiplies by vw/1280, writes outer.style.height
// Render-blocking; runs at HTML parse, after React-emitted DOM exists, before first paint.
// Required: prevents the post-hydration height jump that ScaleCanvas's useEffect would create.
```

The script is **already redundant with `app/layout.tsx:100`** — the inline `scaleScript` in `<head>` already writes `--sf-content-scale`, `--sf-canvas-scale`, `--sf-nav-scale`, `--sf-frame-offset-x`, and `--sf-frame-bottom-gap` before paint. The external `/sf-canvas-sync.js` exists ONLY to set `outer.style.height = inner.offsetHeight * scale` — which the inline script CANNOT do because at `<head>` parse time the body doesn't exist yet.

**Integration options (ranked):**

| Option | Mechanism | Pros | Cons | Recommendation |
|--------|-----------|------|------|----------------|
| **A. Static aspect-ratio CSS (RECOMMENDED)** | Move outer height calc to pure CSS using `aspect-ratio` + `width: 100%` so outer height = `inner.height * (vw/1280)` resolves at first style recalc, no JS needed | Eliminates `/sf-canvas-sync.js` entirely; CLS=0 by construction | Requires authoring inner content with predictable intrinsic height OR explicit per-page wrapper height | Phase 1 of v1.8 — biggest single critical-path win |
| **B. Inline as `<script>` in layout.tsx body** | Move the 1-line IIFE inline as a sibling of `<ScaleCanvas>{children}</ScaleCanvas>` rendered into the body via the existing inline-script pattern | Removes the network roundtrip; still runs pre-paint | Still synchronous JS in critical path; inline injection increases HTML payload by ~200B per request (no caching) | Acceptable fallback if (A) blocked |
| **C. `next/script` strategy="beforeInteractive"** | Wrap with `<Script src="/sf-canvas-sync.js" strategy="beforeInteractive" />` in App Router | Automatic deduplication, SRI possible | App Router `next/script` `beforeInteractive` strategy has documented limitations — only runs reliably from root layout, must be in `<head>`, NOT body. Won't see `[data-sf-canvas]` because it sits in `<body>`. **Will not work for this use case.** | Reject |
| **D. Server-compute via Vercel headers + cookie** | Use `next/headers` viewport hint + cookie persistence to inline computed scale | Eliminates JS for repeat visitors | Forces dynamic rendering (already removed in Phase 37 to fix SEO); breaks "all routes static" contract | Reject — directly conflicts with Phase 37 fix |

**Concrete recommendation for v1.8:** Option (A). Refactor `ScaleCanvas` so outer's height is determined by a CSS `aspect-ratio` derived from a build-time-known design height per route (homepage = 6 panels × 100vh + 2 pinned spans documented in the codebase), eliminating the runtime `inner.offsetHeight` read entirely. Files touched: `components/layout/scale-canvas.tsx:72`, `app/globals.css` (new `[data-sf-canvas-outer]` rule), delete `public/sf-canvas-sync.js`. This closes the **render-blocking 570ms** gap by removing a render-blocking external request.

**CLS protection invariant:** the inline `scaleScript` in `app/layout.tsx:100` MUST remain — it sets `--sf-content-scale` which the CSS rule `[data-sf-canvas]{transform:scale(var(--sf-content-scale))}` reads on first paint. Removing it reintroduces CLS 0.65 (the Wave 3 T-01/T-02 finding documented in the Anton-font comment block).

**Sources:**
- Next.js 15 App Router Script docs (Context7-verified): `beforeInteractive` only fires from root layout, executes before any Next.js code
- Repository file: `app/layout.tsx:91-100`, `public/sf-canvas-sync.js`, `components/layout/scale-canvas.tsx:42-83`

---

### Q2. Ghost-label LCP repositioning

**Current state** (`components/animation/ghost-label.tsx`):
```tsx
<span
  data-anim="ghost-label"
  className="sf-display pointer-events-none select-none absolute leading-none"
  style={{ fontSize: "clamp(200px, calc(25*var(--sf-vw)), 400px)" }}
>{text}</span>
```
- Renders inside `app/page.tsx:50` THESIS section
- Anton font (~50KB woff2, `display: optional` per `app/layout.tsx:42-51`)
- Class `sf-display` carries the Anton font binding
- Positioned absolute at `top-1/2 -translate-y-1/2`, color `text-foreground/[0.04]` (4% opacity but Lighthouse counts ANY paint as LCP)

**Why it wins LCP**: Lighthouse picks the largest in-viewport text/image at FCP. After ScaleCanvas applies `transform: scale(0.x)` to `[data-sf-canvas]`, the THESIS section's translate math places the ghost-label glyphs in the mobile viewport's first frame because the GLSL hero is `ssr: false` and renders blank initially — ghost-label is the first paintable text in the LCP candidate set.

**Two-track strategy** (one or both per phase):

**Track A — Force ghost-label to paint instantly:**

| Intervention | File | Mechanism | Closes |
|--------------|------|-----------|--------|
| **Anton preload** | `app/layout.tsx` `<head>` | `<link rel="preload" href="/fonts/Anton-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" fetchPriority="high">` | LCP 6.5s → expected ~3s mobile (font fetch parallelized) |
| **`size-adjust` + `ascent-override`** | `app/layout.tsx:42-51` localFont options | Add `adjustFontFallback: { ascentOverride, descentOverride, sizeAdjust }` to match Anton metrics; eliminates fallback shift entirely so `display: swap` becomes safe | Allows changing `display: optional` → `display: swap` without CLS, which makes Anton paint on first visit (currently first-visit users get fallback per `optional` policy) |
| **`fetchPriority="high"` on the font link** | layout.tsx | Already supported by Next.js localFont — inspect emitted `<link>` and ensure the preload tag carries it | Bumps font fetch ahead of CSS (Chrome 102+) |

**Track B — Push another element into LCP candidate position:**

| Intervention | File | Mechanism | Trade-off |
|--------------|------|-----------|-----------|
| **Hero `<h1>` LCP candidate** | `components/blocks/entry-section.tsx:122-133` | The h1 already exists with `sf-hero-deferred` class on each char. Lighthouse currently doesn't pick it because `opacity: 0.01` is below LCP threshold. Move opacity reveal earlier (instant first frame, then GSAP reveals chars within) | Conflicts with current "char-by-char reveal" animation — needs page-animations.tsx coordination |
| **Add explicit `width`/`height` to GhostLabel** | ghost-label.tsx | `width` + `height` attributes hint Lighthouse for stable LCP detection | Cosmetic; doesn't change which element wins |
| **`content-visibility: auto`** on THESIS section | app/page.tsx:42-60 wrapper | Skips render until in-viewport; ghost-label drops out of FCP candidate set | RISK: `content-visibility: auto` interacts badly with GSAP ScrollTrigger pin/scrub — verify behavior on `pinned-section.tsx` first |

**ScaleCanvas transform-box behavior**: The inner `[data-sf-canvas]` has `transform-origin: top left` (`scale-canvas.tsx:128`). LCP candidate detection uses transformed bounding boxes, so a scale of 0.3 on mobile means the THESIS ghost-label's translated position lands in the visible 0–100vh band even though pre-transform it sits at e.g. y=2400px. **`transform-box: fill-box`** would not help — the issue is the cascade of section heights × content scale, not the box reference.

**LCP suppression hazard (carry-forward from v1.5)**: `feedback_visual_verification.md` and STATE.md v1.5 carry-forward both flag: "Hero heading must NOT use `opacity: 0` as start state. Use `opacity: 0.01` or `clip-path` reveal." This applies to any reveal pattern in v1.8. The hero `<h1>` already follows this — verify no regressions when changing reveal timing.

**Concrete recommendation for v1.8:** Run BOTH tracks. Track A is mechanical (3 files, near-zero risk). Track B (h1 elevation to LCP) is the durable fix — pair with a small `page-animations.tsx` change so the h1 paints at opacity 1 immediately, with chars revealing via `clip-path` instead of opacity.

**Files touched:**
- `app/layout.tsx` (Anton preload + adjustFontFallback)
- `components/animation/ghost-label.tsx` (potential `content-visibility` + width/height)
- `components/blocks/entry-section.tsx:122-133` (h1 reveal mechanism)
- `components/layout/page-animations.tsx` (char-reveal timeline change)

**Sources:**
- web.dev/lcp 2025 guidance, Next.js 15 localFont docs (Context7-verified)
- Repo: `app/layout.tsx:42-51`, `components/animation/ghost-label.tsx:13-22`

---

### Q3. Bundle topology — surfacing 119 KiB unused

`@next/bundle-analyzer@16.2.2` is **already installed and wired** (`next.config.ts:2-6`). Activated via `ANALYZE=true pnpm build`. STATE.md v1.3 carry-forward already mandates running this after every P1 component.

**Per-chunk attribution workflow:**

```
1. ANALYZE=true pnpm build
   → emits .next/analyze/{client,server,edge}.html
2. For each unused chunk in {3302, e9a6067a, 74c6194b, 7525}:
   a. Open client.html, locate chunk by name
   b. Inspect contained modules (treemap)
   c. Cross-reference module path against importer graph
3. Per-route attribution:
   pnpm next build --debug 2>&1 | grep -A 5 "Page                "
   → maps chunks to routes
```

**Probable owners** (LOW confidence — needs analyzer run to confirm):

| Chunk hash | Likely owner | Reasoning |
|------------|-------------|-----------|
| `3302` (largest unused) | `radix-ui` umbrella import | `radix-ui@1.4.3` is the single-package umbrella; tree-shaking depends on per-primitive subpath imports. If any SF wrapper imports `from "radix-ui"` instead of `from "radix-ui/react-X"`, the entire bundle ships |
| `e9a6067a` | `cmdk` (CommandPalette) | `command-palette-lazy.tsx` exists but if any non-lazy route imports CommandPalette directly, the lazy boundary leaks |
| `74c6194b` | `shiki` core | `shiki@4.0.2`, used by code blocks in `/inventory`. If imported in shared layout, leaks to homepage. Verify via `grep -r "from \"shiki\"" components/ app/` |
| `7525` | `date-fns` | `date-fns@4.1.0` only used by `react-day-picker` (Calendar). Calendar is `next/dynamic ssr:false` per STATE.md v1.3 — verify no leak |

**Tree-shaking failure detection:**

```bash
# Existing tooling (already shipped in scripts/):
pnpm tsx scripts/verify-tree-shake.ts   # consumer-import probe
pnpm tsx scripts/verify-bundle-size.ts  # asserts gzip budget

# Add for v1.8:
pnpm tsx scripts/audit-chunk-attribution.ts  # NEW — maps chunks → first-importing route
```

**Code-split candidates beyond Calendar/Menubar:**

| Component | File | Current loading | Split mechanism |
|-----------|------|-----------------|-----------------|
| `SignalOverlay` (Shift+S debug) | `components/animation/signal-overlay.tsx` | Already wrapped via `signal-overlay-lazy.tsx` — VERIFY barrel doesn't leak | Confirm lazy |
| `CommandPalette` | `components/layout/command-palette.tsx` | `command-palette-lazy.tsx` exists | Verify import path everywhere uses `-lazy` |
| `InstrumentHUD` | `components/layout/instrument-hud.tsx` | Mounted in layout.tsx:151 — eager | Move behind a Shift+I gate; lazy import on activation |
| `CheatsheetOverlay` | `components/layout/cheatsheet-overlay.tsx` | layout.tsx:130 — eager | Same pattern as InstrumentHUD |
| `ProofShader`, `SignalMesh`, `TokenViz`, `ParticleFieldHQ` | `components/animation/*-lazy.tsx` | Already lazy | Verify scene-by-scene split (currently bundled in WebGL umbrella?) |

**Storybook leak check** (from question 5 — relevant here too):
```bash
# Storybook stories should NOT ship in main bundle. Verify:
grep -r "\.stories\." components/ | grep -v node_modules
# If stories import from app/ or components/sf/ via paths Webpack/Turbopack picks up
# at build time, they leak. pnpm build-storybook is separate; main `pnpm build` should
# emit zero story bytes.
```

**Concrete recommendation for v1.8:** Phase 1 of v1.8 is `ANALYZE=true pnpm build` + write `scripts/audit-chunk-attribution.ts`. No optimization work begins until ownership is mapped. This avoids the v1.7 anti-pattern where effects shipped before measurement.

**Files touched:**
- `scripts/audit-chunk-attribution.ts` (NEW)
- Potentially `components/sf/index.ts` (barrel export hygiene)
- Per-component lazy boundary fixes (TBD by analyzer output)

**Closes:** Unused JS budget 119 KiB → target <30 KiB

---

### Q4. GSAP ticker / Lenis on critical path

**Current sequence** (`components/layout/lenis-provider.tsx:17-63`):
```
hydrate → useEffect runs →
  matchMedia('(prefers-reduced-motion: reduce)') check (skip if reduced) →
  new Lenis({ ... }) →
  gsap.ticker.add(tickerCallback) →
  gsap.ticker.lagSmoothing(0)
```

GSAP ticker is the **single rAF loop rule** — adding deferred imports must not introduce a second ticker. `lib/gsap-core.ts:8-13` registers plugins at module top-level; SSR guard via `"use client"` directive per Phase 41 (`feedback_pde_not_gsd.md` cross-ref via STATE.md).

**Hydration deferral options:**

| Option | Mechanism | TTI impact | Risk |
|--------|-----------|-----------|------|
| **A. `requestIdleCallback` wrap inside useEffect** | Defer Lenis init by 1-2 frames using `requestIdleCallback(initLenis, { timeout: 100 })` | Saves ~200ms TTI by yielding to first paint | Lenis scroll-restoration race (already documented as minor tech debt) — defer makes the race window slightly larger, not fundamentally different |
| **B. Defer `gsap.ticker.lagSmoothing(0)` only** | Move the lagSmoothing call to first scroll/interaction event | Minor TTI win | Marginal; not worth complexity |
| **C. `next/dynamic` with `ssr: false` for LenisProvider** | Wrap LenisProvider via dynamic import in layout.tsx | Removes Lenis JS from initial HTML payload | Children of LenisProvider become Client Components — RISK: violates hole-in-the-donut SSR contract |
| **D. Intersection-based ScrollTrigger init** | Currently `ScrollTrigger.update` is wired immediately. Defer until first scroll | Saves ScrollTrigger.refresh cost on hydrate | Breaks scroll-restoration on reload |

**Concrete recommendation for v1.8:** Option (A). Wrap the Lenis instantiation block in `lenis-provider.tsx:23-44` with `requestIdleCallback`. Keep the matchMedia check synchronous (cheap). Files touched: `components/layout/lenis-provider.tsx:17-63` only.

**SSR plugin guard sanity check**: Phase 41 already wrapped `gsap.registerPlugin()` in `typeof window` checks. Verify this is honored in:
- `lib/gsap-core.ts` ✓ (file is `"use client"`)
- `lib/gsap-split.ts`, `lib/gsap-flip.ts`, `lib/gsap-draw.ts`, `lib/gsap-plugins.ts` — verify all carry `"use client"` or window guards.

**Lenis scroll-restoration race**: The v1.2 minor tech debt entry (PROJECT.md "Lenis vs window.scrollTo race on scroll restoration (rAF mitigates)") becomes more visible if Lenis init is deferred. Mitigation: ensure the deferral is bounded (`{ timeout: 100 }` so even if browser is busy, Lenis comes up within 100ms).

**Closes:** Main-thread block 2.4s → target <1.5s

---

### Q5. CSS render-blocking budget

**Current emitted CSS** (estimate from build output structure):

| File | Source | Likely size | Render-blocking? |
|------|--------|-------------|------------------|
| `_next/static/css/[hash].css` | Tailwind v4 emit from `app/globals.css` | ~80-120KB | YES |
| `_next/static/css/[hash].css` | Component CSS modules / `@theme inline` derivatives | ~20-40KB | YES |
| `dist/signalframeux.css` | Library build output (consumer-side only) | N/A | Not loaded by app — separate `pnpm build:lib` artifact |

The v1.7 contract (`app/globals.css`) has `@theme inline` aliasing `--color-*` → `--sfx-*` and `@layer signalframeux` wrapping is in `dist/` only — app globals are unlayered. This means:

- App CSS is fully unlayered → ships at standard cascade weight, not deferrable via layer order tricks
- `--sfx-*` derivations in `app/globals.css` (12 derived properties from `updateSignalDerivedProps`) are CSS variables — cheap, no critical-CSS extraction needed for them

**Critical CSS inlining options:**

| Option | Mechanism | Win | Risk |
|--------|-----------|-----|------|
| **A. Next.js 15 native critical CSS (default behavior)** | Next.js 15 already inlines critical CSS for App Router by default | Already on | None — verify it's actually firing via `view-source` of prod HTML |
| **B. Manual above-the-fold CSS extraction** | Extract `entry-section.tsx` + nav + scale-canvas styles into inline `<style>` in layout.tsx | ~100ms FCP | Maintenance burden; styles drift |
| **C. Split `app/globals.css` into critical + deferred** | Create `app/globals-critical.css` (tokens, layout primitives, hero-relevant utilities) + defer the rest via `<link rel="stylesheet" media="print" onload="this.media='all'">` | ~150ms FCP | Tailwind v4 `@theme` block must stay in critical (it defines all CSS vars); risks splitting `@layer` cascade |
| **D. Move `.sf-mesh-gradient`, `.sf-circuit`, halftone, VHS classes to lazy CSS** | These v1.7 effects ship CSS even when off-route | ~30-60KB CSS savings | Requires per-route CSS loading — not currently architected |

**Concrete recommendation for v1.8:** Verify (A) is firing via prod HTML inspection. If yes, attribute the 570ms to (A1) Anton font fetch + (A2) `/sf-canvas-sync.js` — already addressed in Q1 and Q2. Defer (C)/(D) to a v1.9 if (A1+A2+Q1) doesn't recover the budget.

**Storybook story leak check**:
```bash
# 61 stories per v1.7 ship — verify isolation:
grep -r "import.*\.stories" components/ app/ --include="*.tsx" --include="*.ts"
# Expected: zero hits in app/ or components/ outside of .stories. files
```
`pnpm build-storybook` is a separate command (`package.json:scripts:build-storybook`) — main `next build` should not include stories. Verify via analyzer chunk inspection (Q3).

**`@layer signalframeux` cascade**: Distinction matters for Q3 not Q5 — the layer wrapper is in `dist/signalframeux.css` (consumer library distribution), NOT in the app's emitted CSS. App `globals.css` is unlayered by design. This is correct and shouldn't change.

**Closes:** Render-blocking 570ms → target <200ms (combined with Q1 `/sf-canvas-sync.js` removal)

---

### Q6. Lighthouse CI integration

**Current state** (`scripts/launch-gate.ts`, 110 lines):
- Runs `lighthouse@13.1.0` against a URL
- 3 runs, takes worst score per category
- Writes audit JSON to `.planning/phases/35-performance-launch-gate/`
- **Advisory only** — comment at line 6: "It is NOT wired into CI"
- Invoked manually: `pnpm tsx scripts/launch-gate.ts --url <prod-or-preview>`

**CI workflow** (`.github/workflows/ci.yml`, 41 lines):
- Runs lint, vitest, Playwright on `push:main` + PR
- **No Lighthouse step**

**Integration architecture options:**

| Option | Runner | Trigger | Pros | Cons |
|--------|--------|---------|------|------|
| **A. `treosh/lighthouse-ci-action@v12` against Vercel preview URL** | GitHub Action | PR opened/updated → wait for Vercel preview → run LH | True end-to-end; matches prod build; PR comment integration | Requires Vercel deployment hook; preview URL discovery via Vercel API or `actions/github-script` |
| **B. `lhci autorun` against `next start` in CI** | `@lhci/cli` Docker | Every PR | No external dep on Vercel | CI runs LH on GitHub-hosted runner — known to be 30-50% slower than emulated mobile target, leading to false fails. Existing `launch-gate.ts` already mitigates via "worst of 3" pattern — this would inherit but at cost |
| **C. Hybrid — `launch-gate.ts` upgraded + GH Action calls it** | Existing script + new workflow | PR + `workflow_dispatch` | Reuses existing tooling; minimum drift | Need to teach the script to fetch Vercel preview URL via `vercel.json` or env var |

**Budget enforcement** (`.lighthouseci/lighthouserc.json` standard format, RECOMMENDED with Option A or C):

```json
{
  "ci": {
    "collect": {
      "url": ["${LHCI_PREVIEW_URL}"],
      "numberOfRuns": 3,
      "settings": { "preset": "desktop" }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 1.0 }],
        "categories:accessibility": ["error", { "minScore": 1.0 }],
        "categories:best-practices": ["error", { "minScore": 1.0 }],
        "categories:seo": ["error", { "minScore": 1.0 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 1000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0 }],
        "interactive": ["error", { "maxNumericValue": 1500 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

**Real-device vs Lighthouse emulation tension**:

The Lighthouse mobile preset emulates throttled CPU (4× slowdown) + 3G network. This is PROVABLY different from real iPhone Safari and mid-tier Android. v1.8 wants both.

| Stream | Tool | Cadence | Owner |
|--------|------|---------|-------|
| **Lighthouse emulation** | `lhci` in CI (Option A/C) | Every PR | Automated gate |
| **Real-device sampling** | `chrome-devtools` MCP + manual iPhone Safari + BrowserStack/SauceLabs run | Per phase + pre-ship | Manual (per `feedback_visual_verification.md`) |

The split is already implied by STATE.md feedback entries. v1.8 should formalize: CI gates emulation (PR-blocking), real-device verification gates ship (milestone-blocking, NOT per-PR).

**Concrete recommendation for v1.8:** Option C. Wire `launch-gate.ts` into a new `.github/workflows/lighthouse.yml` that runs on PR + waits for Vercel preview deployment. Add `.lighthouseci/lighthouserc.json` with above thresholds. Leave existing manual `pnpm tsx scripts/launch-gate.ts` path intact. PR comment integration via `treosh/lighthouse-ci-action@v12` ↳ comment posting.

**Files touched:**
- `.github/workflows/lighthouse.yml` (NEW)
- `.lighthouseci/lighthouserc.json` (NEW)
- `scripts/launch-gate.ts` (minor — accept LHCI_BUILD_CONTEXT env)
- `package.json:scripts` — add `lhci:autorun`

**Closes:** Durable per-PR enforcement (acceptance criterion from PROJECT.md v1.8)

---

### Q7. Build order / phase dependency analysis

Suggested phase boundaries derived from dependency analysis. Each phase has a hard prerequisite — reordering breaks the chain.

```
┌──────────────────────────────────────────────────────────────────┐
│ Phase 57 — Bundle Audit (HARD PREREQUISITE)                      │
│   ANALYZE=true pnpm build → attribute 119 KiB                    │
│   Write scripts/audit-chunk-attribution.ts                       │
│   Output: per-chunk owner map → informs Phases 60, 61            │
│   Closes: nothing yet (measurement only)                         │
│   Risk: low                                                      │
└──────────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│ Phase 58 — Lighthouse CI Install (HARD PREREQUISITE)             │
│   .github/workflows/lighthouse.yml + .lighthouseci/lighthouserc  │
│   Wire to Vercel preview URL                                     │
│   Establish baseline: capture current scores into CI history     │
│   Closes: durable per-PR enforcement                             │
│   Risk: low — additive, no code changes                          │
│   ⚠ MUST land before Phase 59-62 to gate regressions             │
└──────────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│ Phase 59 — Critical Path Restructure (Q1 + Q5 + Q4)              │
│   /sf-canvas-sync.js → CSS aspect-ratio (Option A)               │
│   Anton preload + adjustFontFallback (Q2 Track A)                │
│   Lenis init via requestIdleCallback (Q4)                        │
│   Closes: render-blocking 570ms → <200ms; main-thread 2.4 → 1.5  │
│   Risk: HIGH — touches CLS-protection contract; full LH run req  │
│   ⚠ DEPENDS ON Phase 58 (need CI gate live before regressing)   │
└──────────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│ Phase 60 — LCP Element Repositioning (Q2 Track B)                │
│   Hero h1 elevated to LCP candidate via clip-path char-reveal    │
│   ghost-label optional content-visibility                        │
│   Closes: LCP 6.5s → <1.0s                                       │
│   Risk: HIGH — hero is signature aesthetic, single most-viewed   │
│   ⚠ DEPENDS ON Phase 59 (font preload must be live)              │
└──────────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│ Phase 61 — Bundle Optimization (Q3 — informed by Phase 57)       │
│   Per-chunk fixes per audit: radix subpath imports, command-     │
│   palette barrel hygiene, InstrumentHUD/Cheatsheet lazy          │
│   Closes: unused JS 119 KiB → <30 KiB                            │
│   Risk: medium — must verify lazy boundaries don't leak via SF   │
│   barrel export contract                                         │
│   ⚠ DEPENDS ON Phase 57 (per-chunk attribution required)         │
└──────────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│ Phase 62 — Real-Device Verification + Final Gate                 │
│   iPhone Safari (real) + mid-tier Android (real) sampling        │
│   chrome-devtools MCP scroll-test (per feedback_visual_*)        │
│   launch-gate.ts 3× run against prod URL                         │
│   Closes: real-device verification (acceptance criterion)        │
│   Risk: low (measurement) — but blocks ship if devices regress   │
│   ⚠ DEPENDS ON Phases 59, 60, 61 all complete                    │
└──────────────────────────────────────────────────────────────────┘
```

**Phase dependency rationale:**

- **57 → 58**: Independent — could parallelize, but sequencing keeps audit signal clean (CI baseline reflects the ANALYZED state).
- **58 → 59**: HARD. Lighthouse CI must be live before Phase 59 because Phase 59 actively manipulates the critical path (`/sf-canvas-sync.js` removal is the single most regression-risky change in v1.8). Without CI, a regression silently ships.
- **59 → 60**: HARD. Anton preload (in Phase 59) is a precondition for h1-as-LCP (Phase 60) — if the font isn't preloaded, h1 won't paint fast enough to win LCP.
- **57 → 61**: HARD. Cannot fix unused chunks without knowing which chunks own which modules.
- **All → 62**: HARD. Real-device verification only meaningful after all three intervention phases ship.

**Parallelizable**: Phase 57 and 58 can run concurrently (independent measurement/CI work).

**Highest-risk phase**: Phase 59. The `/sf-canvas-sync.js` removal touches the CLS-protection contract documented in `app/layout.tsx:91-100` and `components/layout/scale-canvas.tsx:135-144`. Mitigation: Phase 58 gate must be passing GREEN before Phase 59 lands; one-feature-at-a-time PRs (3 separate PRs for Q1, Q2-A, Q4) so any regression is bisectable.

---

## Summary Matrix — Intervention → Gap Closure

| Intervention | Phase | Closes (Phase 37 measured gap) | Files |
|--------------|-------|--------------------------------|-------|
| Bundle attribution audit | 57 | (measurement → informs 61) | `scripts/audit-chunk-attribution.ts` (NEW) |
| Lighthouse CI workflow | 58 | (gate → blocks regression in 59-61) | `.github/workflows/lighthouse.yml`, `.lighthouseci/lighthouserc.json` (NEW) |
| `/sf-canvas-sync.js` → CSS aspect-ratio | 59 | render-blocking 570ms (~80ms) | `components/layout/scale-canvas.tsx`, `app/globals.css`, delete `public/sf-canvas-sync.js` |
| Anton font preload + adjustFontFallback | 59 | LCP (~2s) + render-blocking (~150ms) | `app/layout.tsx:42-51` |
| Lenis init via requestIdleCallback | 59 | main-thread 2.4s (~200ms) | `components/layout/lenis-provider.tsx:17-63` |
| Hero h1 → LCP candidate | 60 | LCP (final ~3s to land <1.0s) | `components/blocks/entry-section.tsx:122-133`, `components/layout/page-animations.tsx` |
| Per-chunk lazy boundary fixes | 61 | unused JS 119 KiB | TBD by Phase 57 audit (likely `components/sf/index.ts` barrel + radix imports + InstrumentHUD/Cheatsheet) |
| Real-device sampling | 62 | (verification only) | None — process change |

---

## Architecture Anti-Patterns to Avoid (v1.8-Specific)

### Anti-Pattern 1: Removing the inline `scaleScript` in `app/layout.tsx:91-100`

**What people might do**: "It's a render-blocking inline script — let's defer it." Move to `next/script strategy="afterInteractive"`.
**Why wrong**: The script writes `--sf-content-scale` BEFORE first paint. Deferring it reintroduces CLS 0.65 (Wave 3 T-01/T-02 finding, documented at `app/layout.tsx:93-99`).
**Do instead**: The inline script is the CLS-protection contract. `/sf-canvas-sync.js` (the EXTERNAL script) is the redundant one targeted for removal.

### Anti-Pattern 2: `next/dynamic ssr:false` on LenisProvider

**What people might do**: Wrap LenisProvider in dynamic import to remove Lenis from initial JS payload.
**Why wrong**: LenisProvider has children that propagate down via context. `ssr:false` forces children into the Client Component tree, breaking the hole-in-the-donut SSR contract (PROJECT.md v1.2 key decision).
**Do instead**: `requestIdleCallback`-deferred init INSIDE LenisProvider's `useEffect`. Children stay Server-Component-eligible.

### Anti-Pattern 3: Adding a second rAF loop for "deferred" measurement

**What people might do**: Spawn a separate rAF loop to measure FPS or perf metrics outside the GSAP ticker.
**Why wrong**: Violates the single-ticker rule. R3F was rejected in v1.1 specifically for this reason.
**Do instead**: All perf measurement hooks via `gsap.ticker.add()` callbacks, OR use `PerformanceObserver` + one-shot `requestAnimationFrame`s (not loops).

### Anti-Pattern 4: Splitting `app/globals.css` into critical + deferred without preserving `@theme`

**What people might do**: Extract atomic Tailwind utilities into critical, defer the rest.
**Why wrong**: Tailwind v4 `@theme inline` block defines all CSS variables. If `@theme` lands in deferred CSS, the first-paint cascade has zero `--sfx-*` values → SSR magenta flash (the exact v1.7 hazard FND-01 was designed to prevent).
**Do instead**: Keep `@theme` and all `--sfx-*` definitions in critical. Defer only effect classes (`.sf-mesh-gradient`, `.sf-circuit`, halftone) — these are display-only and degrade gracefully.

### Anti-Pattern 5: `content-visibility: auto` on a section containing a ScrollTrigger pin

**What people might do**: Apply `content-visibility: auto` to THESIS to skip rendering.
**Why wrong**: ScrollTrigger pin/scrub measures element heights. `content-visibility: auto` reports zero height when off-screen, breaking pin calculations (visible regression: PinnedSection scroll math goes haywire).
**Do instead**: Apply `content-visibility: auto` only to leaf elements that don't participate in scroll math. Verify against `components/animation/pinned-section.tsx` consumers.

---

## Integration Points — File-by-File

### Files MODIFIED (existing)

| File | Phase | Change |
|------|-------|--------|
| `app/layout.tsx` | 59 | Add Anton `<link rel="preload">` + adjustFontFallback options |
| `app/globals.css` | 59 | Add `[data-sf-canvas-outer]` aspect-ratio rule |
| `components/layout/scale-canvas.tsx` | 59 | Remove `<script src="/sf-canvas-sync.js" />` line; refactor outer height to CSS |
| `components/layout/lenis-provider.tsx` | 59 | Wrap Lenis init in requestIdleCallback |
| `components/blocks/entry-section.tsx` | 60 | h1 reveal mechanism: opacity → clip-path |
| `components/layout/page-animations.tsx` | 60 | Char-reveal timeline target switch (opacity → clip-path) |
| `components/animation/ghost-label.tsx` | 60 | (Optional) explicit width/height for LCP detection stability |
| `components/sf/index.ts` | 61 | Barrel hygiene per audit |
| `next.config.ts` | (none) | No changes — bundle analyzer already wired |
| `package.json` | 58 | Add `lhci:autorun` script |

### Files CREATED (new)

| File | Phase | Purpose |
|------|-------|---------|
| `.github/workflows/lighthouse.yml` | 58 | LHCI workflow against Vercel preview |
| `.lighthouseci/lighthouserc.json` | 58 | Budget assertions |
| `scripts/audit-chunk-attribution.ts` | 57 | Per-chunk owner attribution from analyzer output |

### Files DELETED

| File | Phase | Reason |
|------|-------|--------|
| `public/sf-canvas-sync.js` | 59 | Replaced by CSS aspect-ratio |

---

## Confidence Assessment

| Area | Confidence | Source |
|------|------------|--------|
| Existing critical-path topology | HIGH | Direct read of `app/layout.tsx`, `components/layout/scale-canvas.tsx`, `components/layout/lenis-provider.tsx`, `public/sf-canvas-sync.js` |
| `@next/bundle-analyzer` capabilities | HIGH | Context7-verified Next.js docs + already wired in `next.config.ts` |
| Next.js 15 App Router `next/script` `beforeInteractive` constraints | MEDIUM | Documented constraint that it only fires from root layout — verified in Next.js 15 docs |
| Lighthouse mobile emulation vs real device disparity | MEDIUM | Web.dev field-vs-lab guidance; corroborated by `feedback_visual_verification.md` memory entry |
| Per-chunk owner hypotheses (`3302`/`e9a6067a`/etc.) | LOW | Educated guesses pending actual analyzer run; flagged in Phase 57 |
| `content-visibility` × ScrollTrigger pin interaction | LOW | Theoretical based on how each system measures layout; needs spike if pursued |
| `requestIdleCallback` Lenis-deferral race window size | MEDIUM | Existing v1.2 carry-forward says rAF "mitigates"; deferring widens but bounded by `{ timeout: 100 }` |
| Anton `adjustFontFallback` metrics | MEDIUM | Next.js localFont supports it; exact override values need a one-shot calibration run |

---

## Sources

**Repository (HIGH confidence — direct file reads):**
- `app/layout.tsx:42-155` — root layout, themeScript, scaleScript, font definitions, mount order
- `components/layout/scale-canvas.tsx:1-146` — ScaleCanvas component + sf-canvas-sync.js script tag
- `public/sf-canvas-sync.js` — full content (1 line, 175 bytes)
- `components/layout/lenis-provider.tsx:1-66` — Lenis + GSAP ticker wiring
- `components/animation/ghost-label.tsx:1-23` — current LCP element
- `components/blocks/entry-section.tsx:1-213` — hero h1 char-reveal architecture
- `next.config.ts:1-25` — bundle analyzer already wired
- `scripts/launch-gate.ts:1-110` — existing manual Lighthouse runner
- `.github/workflows/ci.yml:1-41` — current CI (no LH step)
- `lib/gsap-core.ts:1-13` — single-ticker source of record
- `package.json` — dep tree, scripts, peerDeps
- `.planning/PROJECT.md` — v1.8 milestone goal + acceptance criteria
- `.planning/STATE.md` — v1.5 LCP suppression hazard + carry-forward constraints

**Memory (HIGH confidence — verified user instructions):**
- `feedback_consume_quality_tier.md` — `getQualityTier()` mandatory for new SIGNAL surfaces
- `feedback_raf_loop_no_layout_reads.md` — single-ticker rule
- `feedback_visual_verification.md` — chrome-devtools MCP scroll-test before claiming done
- `project_pf04_autoresize_contract.md` — Lenis `autoResize: true` is code-of-record
- `project_phase37_mobile_a11y_architectural.md` — Phase 37 measured gaps (LCP 6.5s, perf 76)

**External (MEDIUM confidence — Context7/web docs):**
- Next.js 15 App Router docs: Script strategies, localFont, bundle analyzer integration
- web.dev/lcp 2025: LCP candidate detection + transform-box behavior
- web.dev/cls: `display: optional` vs `swap` interaction with `adjustFontFallback`
- Lighthouse CI docs: `lighthouserc.json` budget format, treosh/lighthouse-ci-action

---

*Architecture research for: SignalframeUX v1.8 Speed of Light — perf recovery integration*
*Researched: 2026-04-25*
*Downstream: roadmapper consumes this for phase boundaries (suggested 57-62) and per-phase RESEARCH.md generation*
