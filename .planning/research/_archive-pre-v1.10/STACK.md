# Technology Stack — v1.8 Speed of Light

**Project:** SignalframeUX v1.8 — Performance Recovery
**Researched:** 2026-04-25
**Scope:** Brownfield perf recovery (LCP, render-blocking, bundle hygiene). Closes the gap between current prod (Lighthouse mobile Perf 76, LCP 6.5s) and the original CLAUDE.md gate (100/100, LCP <1.0s, CLS=0, TTI <1.5s, <200KB initial).
**Confidence:** HIGH

> Existing stack is fixed — no framework swaps, no GSAP/Lenis/Three replacements, no new runtime deps. Almost all gap closure is **configuration + critical-path restructure**, not new packages. Prior milestone STACK.md (v1.7) is superseded by this document for v1.8 scope only.

---

## State of the Existing Stack (verified 2026-04-25)

| Capability | Already Installed | Source of Truth |
|---|---|---|
| Next.js | `15.5.14` | `node_modules/next/package.json`. Peer says ≥15.3; production tip is 15.5.x. Migration to 16.x rolled back per Phase 37 STATE entry. |
| `next/font/google` | yes — Inter, Electrolize, JetBrains_Mono with `display: swap` | `app/layout.tsx:23-40` |
| `next/font/local` | yes — Anton with `display: optional` | `app/layout.tsx:42-51`. Comment confirms "swap was causing 0.485 CLS" — `optional` is intentional and locked. |
| `@next/bundle-analyzer` | `^16.2.2` devDep, wired via `ANALYZE=true pnpm build` | `next.config.ts:2-6`. **No additional bundle tooling needed.** |
| `lighthouse` (CLI engine) | `^13.1.0` devDep | What's missing is **CI orchestration + assertions**, not the engine. |
| `next/web-vitals` | ships with Next.js | Built-in `useReportWebVitals` reports LCP/CLS/INP/FCP/TTFB without external dep. |
| Single-ticker rule | enforced — GSAP `globalTimeline` drives WebGL via `useSignalScene` | Memory: `feedback_raf_loop_no_layout_reads.md`, `feedback_consume_quality_tier.md` |
| `optimizePackageImports` | `["lucide-react"]` only | `next.config.ts:10`. Working; can expand in v1.8. |

**Implication:** v1.8 stack additions are tightly bounded — at most **two devDep families** (LHCI orchestration; optional `web-vitals` for attribution debugging) plus configuration changes that use already-installed primitives.

---

## Recommended Stack

### Core Technologies (no changes — keep all)

| Technology | Version | Status | Notes for v1.8 |
|---|---|---|---|
| Next.js | `15.5.14` | **Keep, do not upgrade** | Next 16.x rollback is recent (Phase 37). Upgrading mid-perf-recovery would confound measurement. Re-evaluate in v1.9. |
| Tailwind CSS v4 | `^4.2.2` | **Keep** | `@theme inline` token bridge from v1.7 is the source of truth; Tailwind v4 `--*` vars already drive utilities. |
| GSAP | `^3.14.2` | **Keep** | Single-ticker discipline already enforced. Ships in shared bundle; necessary on first paint. |
| Lenis | `^1.1.20` | **Keep** | `autoResize: true` per `feedback_pf04_autoresize_contract.md` (PF-04 contract). Do not touch. |
| Three.js | `^0.183.2` | **Keep** | Already in async chunk (102 KB initial baseline). Confirmed via v1.1 validation. |

### Supporting Libraries (devDep additions only)

| Library | Recommended Version | Purpose | Closes which Phase-37 gap |
|---|---|---|---|
| `@lhci/cli` | `^0.15.1` (npm verified 2025-06-25) | Lighthouse CI runner — orchestrates the existing `lighthouse@13.1.0` engine for per-PR enforcement | **Lighthouse CI gate — durable per-PR enforcement.** Without LHCI, the only enforcement was a manual phase gate. With LHCI, every PR fails on Perf <100, LCP >1.0s, CLS >0. Replaces the v1.7 manual launch-gate dance. |
| `web-vitals` | `^5.2.0` (npm verified 2026-04-25) | Real-user metric collection with **attribution build** for LCP-element diagnosis | **LCP element identification under real conditions.** Lighthouse mobile emulation flags `#thesis > span.sf-display`, but real devices may differ. The attribution build (1.5 KB extra brotli) returns `lcpEntry.element`, `lcpResourceEntry`, `loadTime` breakdown — necessary for confirming the ScaleCanvas `transform: scale()` artifact theory. **Optional** — built-in `next/web-vitals` covers the baseline; add `web-vitals` only if attribution is needed. |
| (none else) | — | — | **No need** for `next/script` install (built-in), `@vercel/speed-insights`, `@vercel/analytics`, image-optimization libs, perf-monitoring SaaS. See "What NOT to Use." |

### Development Tools (configuration, not packages)

| Tool | Purpose | Notes |
|---|---|---|
| `lighthouserc.json` | Declarative LHCI assertion config — runs against prod URL or `next start` localhost | New file at repo root. Asserts `categories:performance >= 1`, `largest-contentful-paint <= 1000`, `cumulative-layout-shift <= 0`, `total-blocking-time <= 200`, `unused-javascript <= 50000`. |
| `.github/workflows/lhci.yml` | GitHub Action wiring — runs `lhci autorun` on PR | Use `treosh/lighthouse-ci-action@v12` (canonical wrapper) or call `@lhci/cli` directly. Mobile preset only — desktop is already 100. |
| `app/_components/web-vitals.tsx` | Tiny `'use client'` component using built-in `useReportWebVitals` from `next/web-vitals` | No `web-vitals` npm import needed for baseline. Logs to `console` in dev, `navigator.sendBeacon()` to a logging endpoint in prod. **Real-device telemetry without a third-party SaaS.** |
| `next/dynamic` (already used) | Audit `InstrumentHUD`, `CheatsheetOverlay`, `SFToasterLazy`, `GlobalEffectsLazy`, `SignalCanvasLazy`, `PageTransition` for actual lazy boundaries | The `*Lazy` names suggest correctness; the 119 KiB unused-JS metric implies one is leaking. Verify via `ANALYZE=true pnpm build`. |
| `next/script` | **Specifically NOT for `sf-canvas-sync.js`.** | The 280-byte IIFE in `public/sf-canvas-sync.js` is no longer referenced from `app/layout.tsx` — the inline `scaleScript` literal at `layout.tsx:100` superseded it. Confirm with grep; if dead, delete the file (removes one render-blocking resource for free). |

---

## Installation

```bash
# DevDeps only — zero runtime additions
pnpm add -D @lhci/cli@^0.15.1

# Optional — only if next/web-vitals (built-in) is insufficient for attribution
pnpm add -D web-vitals@^5.2.0
```

> All other "additions" are configuration files (`lighthouserc.json`, `.github/workflows/lhci.yml`, `app/_components/web-vitals.tsx`) and edits to existing files (`next.config.ts`, `app/layout.tsx`).

---

## Configuration Changes — the actual v1.8 work

These are **not** new packages — they are the levers that close measured Phase 37 gaps using existing primitives.

### Gap 1 — LCP 6.5s on `section#thesis > span.sf-display`

**Root cause hypothesis (HIGH confidence):** `ScaleCanvas` applies `transform: scale(vw/1280)` to a wrapper containing the entire page. Mobile Lighthouse's LCP heuristic picks the largest paint within the viewport — the ghost-label spans 200–400px font-size × 25vw clamp, which is the largest element after scale. Compounded by `display: optional` Anton (the CLS-correct choice from Wave 3) — on cold cache, the fallback renders, fails to swap to Anton, but the LCP timestamp still measures the final paint.

**Levers (no new packages):**

1. **Reduce Anton's effective LCP weight without breaking the `optional` CLS fix.**
   - `next/font/local` does not auto-subset locals — manually subset Anton-Regular.woff2 to glyphs actually used (the project uses ALL CAPS English manifesto; aggressive subset is safe). One-time build step via `glyphhanger` or pre-built subset, no runtime dep.
   - Confirm `<link rel="preload" as="font" type="font/woff2" crossorigin>` is being emitted. Default for `next/font/local` when `preload: true` (which is the default).
   - Verify `adjustFontFallback` is not overridden to `false` (default for local fonts is `'Arial'` — keep default).

2. **Demote ghost-label out of the LCP candidate set.**
   - `components/animation/ghost-label.tsx:11-23` renders a `<span>` with `aria-hidden="true"` and 3-5% opacity. Lighthouse picks it because `aria-hidden` + low opacity does NOT exclude from LCP — only `display:none`, `visibility:hidden`, or `opacity:0` (zero) do.
   - **Option A (preferred):** add `content-visibility: auto` + `contain-intrinsic-size` to ghost-label CSS. Defers paint cost until in-view; LCP no longer fires on it.
   - **Option B (fallback):** start ghost-label at `opacity: 0` (excluded from LCP per spec), GSAP-tween to 0.03–0.05 in `requestAnimationFrame` after `'load'`. One-line change + ScrollTrigger entry.
   - Both preserve the "visually identical" aesthetic constraint.

3. **Hero shader / above-fold LCP candidate.**
   - The hero `SIGNALFRAME//UX` wordmark (per v1.5 EN-01..05) should be the *intended* LCP. Add `fetchpriority="high"` to the wordmark and verify the GLSL shader canvas does not race it.
   - The shader canvas is `data-sf-canvas` and goes through `ScaleCanvas`. The CSS rule `[data-sf-canvas]{transform:scale(var(--sf-canvas-scale))}` runs after the inline `scaleScript` (`layout.tsx:100`) — first paint is already scaled.

### Gap 2 — Render-blocking 570ms (`/sf-canvas-sync.js` + 2 CSS files)

**Root cause:** Phase 37 noted three render-blocking resources. Inspecting current `app/layout.tsx`:
- The two inline `<script>` blocks (`themeScript`, `scaleScript`) are blocking by design — they must run before first paint to prevent FOUC and CLS. Both static literals, ~150 bytes each. **Do not move.**
- `public/sf-canvas-sync.js` is referenced as render-blocking external `/sf-canvas-sync.js` in milestone context, but `grep` of `app/layout.tsx` and `app/` shows no `<script src="/sf-canvas-sync.js">` in the current tree. The inline `scaleScript` superseded it.

**Levers:**

1. **Delete `public/sf-canvas-sync.js`** — confirm with `grep -r 'sf-canvas-sync' app components lib public` (expected empty). If empty, delete the file. **One render-blocking request removed for free, zero behavior change.**
2. **CSS critical-path** — Tailwind v4 `@theme inline` already inlines tokens. The two render-blocking CSS files are likely `globals.css` (main token+layer file) and a page-level CSS chunk. Next.js 15 already inlines critical CSS for static routes — verify via `view-source:` on prod. If a `<link rel="stylesheet">` is still loading late, the cause is usually a non-static page or a `'use client'` component pulling an extra chunk. Audit with `ANALYZE=true pnpm build`.

### Gap 3 — Unused JS 119 KiB across chunks `3302`, `e9a6067a`, `74c6194b`, `7525`

**Root cause:** likely vendor splits (radix-ui, sonner, vaul, gsap, react-day-picker, cmdk, shiki) being pulled into shared chunk via barrel re-exports or eager imports.

**Levers (configuration, no packages):**

1. **Expand `optimizePackageImports`** in `next.config.ts:10` from `["lucide-react"]` to:
   ```ts
   optimizePackageImports: [
     "lucide-react",
     "radix-ui",         // 33-component umbrella
     "sonner",
     "vaul",
     "cmdk",
     "react-day-picker",
     "date-fns",
     "input-otp",
   ]
   ```
   Phase-gate: re-run `ANALYZE=true pnpm build` after each addition.

2. **Audit `*Lazy.tsx` wrappers** in `components/layout/`: `GlobalEffectsLazy`, `SignalCanvasLazy`, `SFToasterLazy`. Confirm each uses `next/dynamic({ ssr: false })` and that the underlying heavy module is **not** transitively imported by any page or layout.

3. **Shiki** (`^4.0.2`) — already a v1.4 critical constraint ("`shiki/core` only — never `shiki/bundle/web` 695 KB or `shiki/bundle/full` 6.4 MB"). Re-verify import path hasn't drifted in `inventory/` detail views.

### Gap 4 — Main-thread work 2.4s (script-eval 1.0s, other 0.6s, style+layout 0.4s)

**Levers:**
1. `optimizePackageImports` reduction (Gap 3) directly drops script-eval cost.
2. `updateSignalDerivedProps` MutationObserver from v1.7 (Phase 48) keeps ticker overhead at zero. Verify no new `getComputedStyle` regressions in v1.8 work — per memory `feedback_raf_loop_no_layout_reads.md`.
3. `getQualityTier()` continues gating any new SIGNAL surface — but v1.8 is perf-recovery, no new surfaces.

---

## Alternatives Considered

| Recommended | Alternative | When Alternative Makes Sense |
|---|---|---|
| `@lhci/cli` (devDep) for CI gate | `@vercel/speed-insights` (runtime SaaS) | If you need RUM with no infra effort and accept a third-party request + dashboard fee. v1.8 hard constraint is zero new runtime deps, so `@lhci/cli` wins. Reconsider for v1.9 if real-user trends matter. |
| `next/web-vitals` (built-in) for client telemetry | `web-vitals@5.2.0` package directly | Use `web-vitals` directly **only if** you need the attribution build (`web-vitals/attribution`) for LCP-element diagnosis. Built-in `useReportWebVitals` returns `entries[]` which is enough for 90% of cases. |
| Subset Anton via `glyphhanger` (build script) | Switch Anton → `next/font/google` (Anton is on Google Fonts) | Google Fonts version doesn't ship with the optimal subset for ALL-CAPS English-only manifesto. Build-time subset is one-shot and predictable. |
| Configuration-only LCP fix (Gap 1 levers) | Switch ScaleCanvas approach to native `min(vw, 1280px)` containers | Architectural change; explicitly Out of Scope per milestone context (Track B parked). |
| Keep Next.js `15.5.14` | Next.js 16.x | Next 16 was attempted (Phase 37) and rolled back. Mid-perf-recovery is wrong moment to retry. Belongs in v1.9. |
| Real-device sampling: WebPageTest free tier + manual iPhone Safari/Android | BrowserStack (paid) | Free WPT runs covers iPhone 15 Pro / Moto G Power profiles; combined with manual local devices, sufficient for v1.8 verification. BrowserStack adds cost without proportional benefit at this scope. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|---|---|---|
| `@vercel/speed-insights` | Runtime SaaS dep adds its own beacon overhead and a third-party request to the critical path. Conflicts with zero-new-runtime-dep contract. Duplicates LCP measurement we can do for free. | `next/web-vitals` (built-in) → custom endpoint via `navigator.sendBeacon` |
| `@vercel/analytics` | Same critique — runtime weight, third-party request, paid retention. Not needed for LCP recovery; the gap is *measurement* not *retention*. | `useReportWebVitals` to a self-hosted log endpoint |
| `next/image` for new image optimization | Project doesn't have an image-LCP problem — LCP is on a `<span>` text node. Adding image-optimization machinery is premature. | Keep current `<img>` / SVG usage. Re-evaluate if any image becomes the LCP element after Gap 1 fixes. |
| `react-three-fiber` (already excluded) | Independent rAF conflicts with GSAP `globalTimeline.timeScale(0)` reduced-motion contract. | Raw Three.js via `useSignalScene` singleton |
| `partytown` / `next/script strategy="worker"` | `worker` strategy is "experimental, App Router unsupported" per `next/script` docs (verified 2026-04-23). The two inline scripts in `layout.tsx` are static literals, not third-party — moving them to a worker provides no benefit and breaks FOUC/CLS prevention. | Keep inline blocking scripts. They are <500 bytes combined. |
| `next/script strategy="beforeInteractive"` for `sf-canvas-sync.js` | The script is dead code (superseded by inline `scaleScript`). Wrapping a dead file in `next/script` is the wrong fix. | Delete `public/sf-canvas-sync.js`. |
| `lighthouse-ci-action@v9` or earlier | Older versions of the official GitHub Action don't support Lighthouse 13.x assertions. | `treosh/lighthouse-ci-action@v12` (current, supports `@lhci/cli@0.15.x`) |
| Adding `web-vitals` to `dependencies` (runtime) | Violates zero-runtime-dep rule. | DevDep only. Use `next/web-vitals` (built-in) for prod telemetry; pull `web-vitals/attribution` only in dev/staging via dynamic import. |
| New CSS-in-JS perf tools (Linaria, vanilla-extract) | Tailwind v4 `@theme inline` is already source of truth; competing tool inflates bundle and breaks `--sfx-*` consumer overrides. | Tailwind v4 only. |
| Custom RUM dashboard | Out of scope for v1.8. | Plain `navigator.sendBeacon` to an in-house API route or external collector — upgrade in v2.x. |
| Premature Edge runtime conversion | Routes are already mostly static (Phase 37 confirmed `headers()` removal). Edge gives nothing extra here. | Keep static-by-default. |
| PPR (Partial Prerendering) | Stable in Next 16, experimental in 15.x. Pinning Next 15 means PPR is incremental work. Static homepage already has the fastest possible TTFB on Vercel. | Skip PPR for v1.8. Consider when Next 16 upgrade lands in v1.9. |
| Cache Components (Next 16 only) | Out of reach on Next 15.5. | Defer to v1.9 with Next 16 upgrade. |

---

## Stack Patterns by Variant

**If web-vitals attribution confirms LCP element is `#thesis > span.sf-display`:**
- Apply Gap 1 levers (ghost-label demotion + Anton subset). Likely closes 5+ seconds of LCP single-handedly.

**If web-vitals attribution shows LCP is the hero shader canvas or wordmark:**
- Gap 1 levers do not apply. Audit `SignalCanvasLazy` mount timing — `ssr: false` may delay first paint of the canvas.
- Add `fetchpriority="high"` to the hero wordmark.
- Confirm GLSL shader compiles synchronously on first frame, not deferred.

**If `ANALYZE=true pnpm build` shows shared chunk >150 KB after `optimizePackageImports`:**
- Audit barrel re-exports in `components/sf/index.ts` — even with `'use client'` discipline, `radix-ui` umbrella imports can leak.
- Convert any `import { X } from "radix-ui"` to direct `radix-ui/dialog` style sub-paths where supported.

**If LHCI mobile run is still <100 after all configuration changes:**
- The remaining gap is architectural (ScaleCanvas + ghost-label-as-LCP) — exactly Track B (parked). Open a v1.9 spike, do not extend v1.8.

---

## Version Compatibility

| Package A | Compatible With | Notes |
|---|---|---|
| `@lhci/cli@^0.15.1` | `lighthouse@^13.1.0` (already installed) | LHCI 0.15.x bundles or wraps Lighthouse ≥10. Project's `lighthouse@13.1.0` is the engine; LHCI orchestrates. |
| `web-vitals@^5.2.0` | `next@15.5.14`, React 19 | v5 is current (verified 2026-04-25). Includes attribution build. ESM-only — Next 15 handles. |
| `@next/bundle-analyzer@^16.2.2` | `next@15.5.14` | Already installed. `@next/bundle-analyzer@16.x` works against `next@15.x` — major version is just a versioning convention, not a hard dep boundary. |
| `next/font/local` `display: optional` | Anton local font, Phase 35 CLS fix | **Do not change to `swap`.** Documented at `app/layout.tsx:46-50` — `swap` caused 0.485 CLS on `/system`. `optional` is the locked v1.5 decision. |
| `optimizePackageImports` | Next 15 + 16 | Stable since Next 13.5. |
| `treosh/lighthouse-ci-action@v12` | LHCI 0.15.x | Current generation; v9 and below are unmaintained. |

---

## DevDep vs Runtime Boundary (explicit per quality gate)

| Package | Type | Justification |
|---|---|---|
| `@lhci/cli@^0.15.1` | **devDep** | CI-only tool. Runs in GitHub Actions, never ships to users. |
| `web-vitals@^5.2.0` | **devDep** (optional) | Used only via `'use client'` component dynamically imported in dev/staging for attribution debugging. Production telemetry uses built-in `next/web-vitals` which bundles its own minimal collector. If included in prod runtime, must remain ≤4 KB and gated to non-critical paths. |
| `@next/bundle-analyzer@^16.2.2` | **devDep** (already) | Build-time only. |
| `lighthouse@^13.1.0` | **devDep** (already) | CLI engine; never imported into app code. |

**Zero new runtime npm dependencies.** Preserves v1.7 contract.

---

## Sources

- `npm view @lhci/cli` (verified 2026-04-25): `0.15.1`, last modified 2025-06-25 — **HIGH**
- `npm view web-vitals` (verified 2026-04-25): `5.2.0`, last modified 2026-04-25 — **HIGH**
- `npm view @next/bundle-analyzer` (verified 2026-04-25): `16.2.4`, last modified 2026-04-22 — **HIGH**
- `npm view lighthouse` (verified 2026-04-25): `13.1.0`, last modified 2026-04-06 — **HIGH**
- `node_modules/next/package.json`: actual installed Next is `15.5.14` — **HIGH**
- Next.js docs `app/getting-started/fonts` (lastUpdated 2026-04-23): `next/font/local` `display: optional` semantics, `adjustFontFallback`, `preload: true` default — **HIGH**
- Next.js docs `app/api-reference/components/font` (lastUpdated 2026-04-23): full props matrix incl. `adjustFontFallback`, `declarations`, `axes` — **HIGH**
- Next.js docs `app/api-reference/components/script` (lastUpdated 2026-04-23): `worker` strategy is experimental + App Router unsupported — **HIGH**
- Next.js docs `app/api-reference/functions/use-report-web-vitals` (lastUpdated 2026-04-23): built-in hook returns LCP/CLS/INP/FCP/TTFB — **HIGH**
- GitHub `GoogleChrome/web-vitals` (verified 2026-04-25): v5 current, attribution build available — **HIGH**
- Project files `app/layout.tsx`, `next.config.ts`, `package.json`, `public/sf-canvas-sync.js`, `components/animation/ghost-label.tsx` — **HIGH** (read directly)
- Project memory `feedback_pf04_autoresize_contract.md`, `feedback_consume_quality_tier.md`, `feedback_raf_loop_no_layout_reads.md`, `project_phase37_mobile_a11y_architectural.md` — **HIGH**
- `treosh/lighthouse-ci-action@v12`: ecosystem-canonical wrapper — **MEDIUM** (not directly version-verified this session)

---

*Stack research for: SignalframeUX v1.8 Speed of Light — performance recovery to original CLAUDE.md gate*
*Researched: 2026-04-25*
*Supersedes: v1.7 STACK.md for v1.8 scope only; v1.7 effects-stack research remains accurate for prior milestone.*
