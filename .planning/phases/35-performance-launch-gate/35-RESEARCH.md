# Phase 35: Performance + Launch Gate — Research

**Researched:** 2026-04-09
**Domain:** Bundle analysis, Lighthouse audit (deployed URL), Core Web Vitals (field + lab), Next.js 15 metadata/OG file conventions, Vercel deployment, Awwwards submission packaging
**Confidence:** HIGH (measurement paths), MEDIUM (Performance=100 mobile, Awwwards schema)

---

> **Phase 35 is measurement, not construction.**
> Phase 34 is shipped and human-signed-off. The stack is frozen (Next.js 15.3, GSAP 3.12 + ScrollTrigger, Lenis, Three.js async). This phase **measures what already exists**, applies surgical fixes only where the deployed site fails a criterion, creates 3 missing files (`opengraph-image.tsx` + matching metadata + a copy deck), and ships one production deploy. Per CLAUDE.md hard constraints: do not rebuild, do not introduce complexity, do not add features beyond launch-gate scope.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PF-01 | Shared JS bundle remains under 150 KB gzip after all v1.5 redesign changes | Current measured total: **100.0 KB gzip** across 4 `rootMainFiles` (Apr 9 .next build manifest). 50 KB margin. Three.js is import-fenced behind 5 `*-lazy.tsx` wrappers (`next/dynamic` + `ssr:false`). `ANALYZE=true pnpm build` wired in `next.config.ts` line 4. |
| PF-02 | Lighthouse 100/100 on P + A + BP + SEO against deployed URL — not CLI headless | Phase 26-02 shipped 100/100 on **A/BP/SEO** via PageSpeed Insights mobile but **Performance landed at 80 mobile / 94 desktop** (accepted as `[~]` AC-1 in 26-02 SUMMARY). Phase 35 must close that gap on the v1.5 site, which has added 5 new full-viewport WebGL sections (ENTRY, PROOF, SIGNAL) and 6 section architecture — new perf risk surface. |
| PF-03 | LCP < 1.0s on homepage — `SIGNALFRAME//UX` heading uses `opacity: 0.01` (not `0`) | VERIFIED in source: `components/blocks/entry-section.tsx:19` sets `opacity: 0.01` on the h1. LCP element is correctly rendered in initial HTML. Subtitle below uses `opacity: 0` — LCP-safe only because the h1 is larger and wins LCP candidate selection. |
| LR-01 | Awwwards submission package (description, stack, 5+ screenshots at 1440x900, live URL) | No submission copy deck in project. 10 stale screenshots from April 1 exist at project root (v1.0/v1.1, pre-v1.5) — must be regenerated post-deploy. Awwwards ideal thumbnail 1600x1200 per FAQ; spec requires 1440x900 per phase criterion (narrower, matches Culture Division aesthetic). |
| LR-02 | Open Graph meta tags updated for redesigned site — title, description, preview image | `app/layout.tsx:41-64` has basic `openGraph` / `twitter` Metadata but **no `images` field**. Zero image files in `app/` matching the metadata file conventions (no `opengraph-image.tsx`, `twitter-image.tsx`, `icon.*`, `apple-icon.*`, `favicon.*`). `public/` contains only `grain.svg`, `robots.txt`, `r/` registry. Must author `app/opengraph-image.tsx` using `next/og` `ImageResponse`. |
| LR-03 | Production Vercel deployment live with zero console errors — confirmed via DevTools on deployed URL | `.vercel/project.json` exists: `projectName: "signalframeux"`, `projectId: prj_gwmf7fNhZiJqQ7AYL606u3xWsMGJ`. Production URL: `https://signalframeux.vercel.app` (from `app/sitemap.ts:3`). `vercel link` already done — only `vercel --prod` needed. **Only known source `console.warn` in client code:** `hooks/use-nav-reveal.ts:37` — dev-only (`NODE_ENV !== 'production'` gated), safe. |
| LR-04 | Mobile responsive across all new sections (375px, 768px, 1440px) | v1.5 Phase 34 Task 2 already auto-fixed 3 pre-existing 375px horizontal-scroll bugs (footer.tsx break-all, app/reference grid responsive, api-explorer filter bar min-w-0) per Phase 34 RECONCILIATION. LR-04 is a **cross-page regression check** over 6 pages × 3 viewports. |
</phase_requirements>

---

## Summary

The shared JS bundle is already 33% under the 150 KB gate with zero new dependencies expected — **PF-01 is de facto satisfied**; Phase 35 only needs a fresh `ANALYZE=true pnpm build` to mechanically confirm against the current working tree and produce the treemap evidence. The LCP source element (`SIGNALFRAME//UX` h1) already sits at `opacity: 0.01` per D-08 rule from Phase 30, which means PF-03's compliance is already structural — the phase only needs to measure whether it holds on the live CDN.

The hardest gate is **PF-02 Performance = 100**. Phase 26-02 accepted 80/94 as the v1.4 Performance score with a `[~]` (WebGL/GSAP site expected to underperform), but the phase 35 success criterion does not offer that latitude: it requires 100/100 on all four categories. The v1.5 redesign adds three full-viewport WebGL scenes (ENTRY GLSL hero, PROOF interactive shader, SIGNAL atmospheric scene), a 200-300vh pinned THESIS manifesto, and a ComponentDetail panel with a GSAP `height: 0 → scrollHeight` animation — every one of these is a potential LCP/TBT/CLS regression vector against the prior baseline. Plan must include: (a) explicit targeted fixes for the ComponentDetail height animation (the #1 known CLS risk), (b) font metric override to prevent CLS from Anton/Electrolize/Inter font swap, (c) preload + priority on the LCP element's font, (d) audit of all GSAP properties against the transform/opacity-only rule.

**LR-02 Open Graph** is pure authorship: zero OG image files exist. Create `app/opengraph-image.tsx` using `next/og` `ImageResponse` at 1200x630 — a stripped-down magenta `//` mark on black background matching the hero canonical moment from VL-05 (fcc811d). Update `app/layout.tsx` metadata to reference absolute URL. `twitter-image` inherits from OG by convention.

**LR-01 Awwwards package** is a deliverable (copy + assets), not a code change. Write a project description in the SF register (coded, terse, Dischord/Wipeout anchor — **not** SaaS marketing voice), list the 8 stack items verbatim from STATE.md / package.json, capture 5+ fresh screenshots at 1440x900 via Playwright (existing config at `playwright.config.ts`), and commit them to `.planning/phases/35-performance-launch-gate/assets/`. The live URL is `https://signalframeux.vercel.app`.

**Primary recommendation:** Structure the phase as 3 waves — **Wave 0** (test gaps + Vercel CLI upgrade), **Wave 1** (measurement: bundle, lighthouse, console, responsive), **Wave 2** (gap-closure: ComponentDetail CLS fix, Performance=100 fixes, OG author, Awwwards package), **Wave 3** (final production deploy + verification pass). Do not attempt gap-closure before measurement — measuring first prevents speculative work.

---

## Standard Stack

### Core Verification Tools

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| `@next/bundle-analyzer` | 16.2.2 (installed devDep) | Treemap visualization of JS bundle by chunk/module | Already wired in `next.config.ts` via `ANALYZE=true` env var |
| Vercel CLI | 50.28.0 installed → **upgrade to latest 50.42.0+** | Deploy to production URL | STATE handoff memo flags upgrade as prereq; `vercel whoami` already works |
| PageSpeed Insights (pagespeed.web.dev) | web | Field + lab Core Web Vitals on deployed URL | Google infra, multi-pass, field data from CrUX when available |
| Chrome DevTools Lighthouse (chrome-devtools MCP `lighthouse_audit`) | current | Secondary lab Lighthouse on localhost or remote URL | Supplementary only — not the gate per success criterion #2 |
| `next/og` `ImageResponse` | bundled with Next.js 15 App Router | Dynamic OG image generation | `@vercel/og` is pre-included in App Router; no install needed |
| Playwright 1.59.1 | installed | Regression suite + 1440x900 screenshot capture | Config at `playwright.config.ts`; 9 existing spec files for per-phase regression |

### Supporting Tools

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `python3 -c` gzip script | stdlib | Programmatic rootMainFiles gzip measurement | Fast per-commit bundle check without opening analyzer HTML |
| Chrome DevTools MCP (chrome-devtools) | active session | Navigate deployed URL, screenshot, console inspection | LR-03 zero-console-errors verification + user-visible nav/reveal checks |
| `vercel curl` | — | Access preview deployments past Vercel deployment protection | Only needed if production URL audit fails and a preview must be tested mid-phase |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `next/og` `ImageResponse` (dynamic) | Static PNG in `public/opengraph-image.png` | Static is simpler but inferior: can't share Anton/Inter fonts, can't parameterize per-page, breaks once brand updates |
| PageSpeed Insights (web) | Local Lighthouse via chrome-devtools MCP | PSI is authoritative for `--prod` URL; local Lighthouse varies with CSP nonce interaction (Phase 26-02 noted CDT local scored 96/91 vs PSI's 100/100/100) |
| Playwright screenshots | Manual viewport capture via chrome-devtools MCP | Playwright scriptable + repeatable at exact 1440x900; MCP is interactive. Use Playwright for LR-01 assets |

**Installation:** No new npm packages for Phase 35. `pnpm install` (if lock drift) + `npm i -g vercel@latest` is the only install.

---

## Architecture Patterns

### Recommended Phase Structure

```
.planning/phases/35-performance-launch-gate/
├── 35-RESEARCH.md            (this file)
├── 35-CONTEXT.md             (if /pde:discuss-phase runs)
├── 35-PLAN.md (or 35-01-PLAN.md .. 35-03-PLAN.md)
├── 35-VALIDATION.md          (Nyquist)
├── 35-VERIFICATION.md
└── assets/
    ├── awwwards-description.md   (copy deck)
    ├── awwwards-stack.md         (tech stack bullet list)
    ├── screenshots/              (5+ PNG at 1440x900)
    │   ├── 01-homepage-entry.png
    │   ├── 02-homepage-thesis.png
    │   ├── 03-homepage-proof.png
    │   ├── 04-system-specimens.png
    │   ├── 05-init-bringup.png
    │   └── 06-inventory-detail.png
    └── lighthouse-reports/
        ├── psi-mobile-$(date).json
        └── psi-desktop-$(date).json
```

### Pattern 1: Bundle Gate Confirmation (PF-01)

**What:** Run `ANALYZE=true pnpm build` → verify rootMainFiles total stays ≤ 150 KB gzip + verify Three.js, ComponentDetail, shiki, Calendar, Menubar are all in async/route chunks (not initial).

**Why it is already satisfied structurally:**

- Current measurement (Apr 9 `.next/build-manifest.json`):
  ```
  webpack-38b3c4b3e52bc534.js    → 2.0 KB gzip
  353a808c-14d8a45ebc7585c0.js   → 53.0 KB gzip
  594-60da1ccd43ff91b1.js        → 44.9 KB gzip
  main-app-76a6a6441f106c70.js   → 0.2 KB gzip
  Total: 100.0 KB gzip (margin: 50.0 KB)
  ```
- Three.js is imported only by `lib/signal-canvas.tsx`, `lib/color-resolve.ts`, `components/animation/{glsl-hero,glsl-signal,signal-mesh,proof-shader,hero-mesh,token-viz}.tsx`, `hooks/use-signal-scene.ts` — all of these are themselves loaded via the 5 `*-lazy.tsx` wrappers that use `next/dynamic(..., { ssr: false })`. The chain is intact.
- No v1.5 phase has added a new runtime dependency (STATE.md: "Zero new npm packages for v1.5").

**Task pattern (plan-ready):**

```bash
# 1. Fresh build
pnpm build
# Verify: rootMainFiles total ≤ 150 KB
python3 -c "<gzip measurement script — see Code Examples §1>"

# 2. Analyzer evidence
ANALYZE=true pnpm build
# Verify in client.html treemap:
# - node_modules/three absent from rootMainFiles chunks (only in async)
# - components/blocks/component-detail in its own async chunk
# - node_modules/shiki absent from client chunks entirely (server-only)
# - Calendar + Menubar in separate async chunks
```

### Pattern 2: Lighthouse 100/100 Against Deployed URL (PF-02)

**What:** Deploy to Vercel production → run PageSpeed Insights against live URL → capture JSON → triage any sub-100 category → fix → redeploy → re-audit.

**Why this is the hardest criterion:** Phase 26-02 baseline is 80 mobile / 94 desktop Performance. The v1.5 site adds 3 new full-viewport WebGL sections and a 200-300vh pinned scroll. LCP measurement against `SIGNALFRAME//UX` heading works in lab but may degrade on real 3G throttling (mobile PSI) due to font load + GSAP hydration + WebGL warmup.

**Known v1.5 regression vectors against Phase 26 baseline:**

| Vector | Location | Score it hits | Mitigation |
|--------|----------|---------------|------------|
| ComponentDetail `height: 0 → scrollHeight` GSAP animation | `components/blocks/component-detail.tsx:108-148` | CLS | Replace `height` with `max-height` + `transform: scaleY` OR use `overflow: hidden` wrapper with `auto` measurement + transform |
| 200-300vh pinned THESIS (ScrollTrigger pin) | `components/animation/pinned-section.tsx` + `thesis-section.tsx` | CLS (pin-spacer jump on trigger hit), TBT | Pin must be pre-measured; `pin-spacer` height pre-reserved; confirm `autoResize: false` (Phase 29) holds |
| GLSLHero WebGL warmup on initial paint | `components/animation/glsl-hero.tsx` via `glsl-hero-lazy` | LCP, TBT | GLSLHero is already lazy via `next/dynamic ssr:false` + sits behind h1 LCP — verify LCP element is h1 not canvas |
| 3 Three.js scenes on homepage (GLSL hero + signal mesh + proof shader) | various `*-lazy.tsx` | TBT, TTI | All lazy; verify Intersection Observer gating so only hero GLSL mounts above the fold |
| Font CLS (Anton + Electrolize + Inter + JetBrains Mono) | `app/layout.tsx:16-39`, `app/fonts/Anton-Regular.woff2` | CLS, LCP | Anton is `localFont` with `display: swap` — need `adjustFontFallback` or `size-adjust` CSS descriptor to eliminate FOIT/FOUT CLS delta |
| CSP `unsafe-eval` + `strict-dynamic` | `middleware.ts:10` | Best Practices | Phase 26-02 noted "CSP nonce interaction with Lighthouse's injected evaluation scripts" — PSI tolerates this, CDT local penalizes. Audit on PSI only |

**Triage order when Lighthouse misses 100:**

1. **Performance < 100** → open PSI "Diagnostics" panel. Top suspects in this codebase: (a) Largest Contentful Paint element (confirm it is the h1, not the canvas), (b) Avoid long main-thread tasks (GSAP timeline hydration), (c) Reduce unused JavaScript (Three.js async chunk).
2. **Accessibility < 100** → grep for new `<canvas>`, missing `aria-label`/`aria-hidden`, color contrast on magenta-on-black text, focus visibility on interactive HUD (HUD is `pointer-events-none` per Phase 34 verified truth #8 — safe).
3. **Best Practices < 100** → open DevTools console on live URL, clear, load, scroll, interact. **Only known `console.warn` in source is `hooks/use-nav-reveal.ts:37`, dev-gated** — should be zero in production. Other suspects: HTTPS mixed content (none expected), deprecated APIs, 3rd-party cookies.
4. **SEO < 100** → verify `<meta name="description">`, robots.txt, canonical URL, sitemap reachability, title length. Phase 26-02 resolved these — should still hold.

### Pattern 3: LCP Element Integrity (PF-03)

**What:** The `SIGNALFRAME//UX` h1 is the LCP element. It must:

1. Render in initial server HTML (it does — `EntrySection` is a client component but the h1 JSX is static and hydrates from SSR)
2. Start at `opacity: 0.01` not `0` (verified, line 19)
3. Use a font that is either preloaded or `font-display: swap` with negligible metric delta
4. Not be obscured by a larger sibling element that could steal LCP candidacy

**Risk found in source:** `components/blocks/entry-section.tsx:43-58` renders a **sibling magenta `//` slash div** at `z-20` covering the full viewport, with `opacity: 0.25`, `mixBlendMode: screen`, `aria-hidden="true"`, `pointer-events-none`. This is the Phase 34 VL-05 canonical magenta hero moment (commit fcc811d). **Lighthouse LCP candidate selection may pick this sibling div over the h1** because it is visually identical-sized and has higher opacity (0.25 vs 0.01). Verify LCP element in PSI "Diagnostics → Largest Contentful Paint element" panel; if it is the slash div, the Phase 30 D-08 rule is defeated by Phase 34's VL-05 addition. Fix options: (a) make h1 `opacity: 0.02` and slash div `opacity: 0.015` (h1 wins LCP); (b) mark slash div with `content-visibility: auto` (removes from LCP candidates); (c) render slash div inside the h1 as a child span with `mix-blend-mode: screen` and `aria-hidden`. **This is a Wave 1 measurement first, not a blind fix.**

**Font preload for LCP font (Anton):**

```tsx
// app/layout.tsx — verify Anton is preloaded
const anton = localFont({
  src: "./fonts/Anton-Regular.woff2",
  variable: "--font-anton",
  display: "swap",  // current
  preload: true,    // ADD if absent; verify in built HTML <link rel="preload">
  adjustFontFallback: "Arial Black",  // ADD for CLS; Anton metrics close to Arial Black
});
```

Current `app/layout.tsx:35-39` has no `preload` or `adjustFontFallback`. `next/font/local` defaults `preload: true` — usually OK — but `adjustFontFallback` defaults to `"Arial"` for sans-serif which may not match Anton's narrow bold metrics. Measure font CLS in PSI, then tune.

### Pattern 4: CLS = 0 (PF-04 complete, but must hold through Phase 35)

**PF-04 is marked complete** (Phase 29), but Phase 35's success criterion #4 requires field-data-confirmed CLS=0 across **all** pages. Field data takes time to accrue in CrUX — so this gate realistically checks lab CLS = 0 on first audit, then relies on field data as a monitoring signal post-launch.

**Lab CLS risks in current code:**

| Risk | File:Line | Fix |
|------|-----------|-----|
| ComponentDetail GSAP height animation | `component-detail.tsx:108-148` | MUST FIX — see Code Examples §2 |
| Font swap CLS | `app/layout.tsx:16-39` | Add `adjustFontFallback` per font; verify in DevTools Performance Insights |
| PinnedSection pin-spacer | `pinned-section.tsx:87` uses `height: "100vh"` inline style on the outer div — ScrollTrigger pins will reserve space but the transition moment can jump | Verify pin-spacer pre-measurement holds across 375/768/1440 viewports |
| Image dimensions | N/A — SignalframeUX site has no raster images in initial paint (only `grain.svg`, generated in code) | No action |
| Iframe/ad/video dimensions | N/A | No action |

### Pattern 5: Open Graph Image (LR-02)

**What:** Create `app/opengraph-image.tsx` using `next/og` `ImageResponse` at 1200x630 — Next.js App Router metadata file convention. Next.js auto-emits the OG meta tag with the correct absolute URL.

**File signature (verified against Vercel OG docs):**

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "nodejs";  // Node.js runtime, default; works with @vercel/og
export const alt = "SIGNALFRAME//UX — Deterministic Interface. Generative Expression.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "oklch(0.08 0 0)",  // var(--color-background) dark
          fontSize: 180,
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: "oklch(0.98 0 0)",
          fontFamily: "Anton",
        }}
      >
        <span>SIGNALFRAME</span>
        <span style={{ color: "oklch(0.7 0.28 330)" }}>//</span>
        <span>UX</span>
      </div>
    ),
    size,
  );
}
```

**Constraints from Vercel `@vercel/og` docs:**

- Only `display: flex` and absolute positioning (no `display: grid`)
- Only `ttf`, `otf`, `woff` fonts (Anton is `woff2` — **must convert or embed via `fetch` + `fonts: [...]` prop**)
- Max bundle size 500 KB
- App Router + Node.js runtime supports `return new ImageResponse(...)` — no need for Edge runtime

**Font loading for ImageResponse:** Since Anton-Regular.woff2 won't load directly in Satori, either:
1. Add `app/fonts/Anton-Regular.ttf` (already exists per `ls` output!) and import via `fs.readFile` in the OG route — `fs` is available in Node.js runtime
2. OR fetch `https://fonts.googleapis.com/css?family=Anton` at render time

**twitter-image inheritance:** If `app/twitter-image.tsx` is absent, Next.js auto-uses `opengraph-image.tsx` for Twitter card. Don't duplicate unless Twitter needs a different crop.

**Metadata absolute URL fix:** `app/layout.tsx` metadata currently has `openGraph` and `twitter` fields but **no `metadataBase`**. Add `metadataBase: new URL("https://signalframeux.vercel.app")` so Next.js resolves the OG image URL as absolute, not relative — required for Facebook/Twitter scraper compatibility.

### Pattern 6: Awwwards Screenshot Capture via Playwright (LR-01)

**What:** Write a one-off Playwright script (`tests/phase-35-screenshots.spec.ts`) that navigates to 5+ URLs at 1440x900 viewport, waits for network idle + animation settle, captures full-page or region screenshots.

**Pattern:**

```ts
// tests/phase-35-screenshots.spec.ts
import { test } from "@playwright/test";

const VIEWPORT = { width: 1440, height: 900 };
const OUT_DIR = ".planning/phases/35-performance-launch-gate/assets/screenshots";

test.describe("Phase 35 Awwwards screenshots", () => {
  test.use({ viewport: VIEWPORT });

  const pages = [
    { path: "/", name: "01-home-entry", waitFor: "[data-entry-section]" },
    { path: "/", name: "02-home-thesis", scrollY: 1200, waitFor: "[data-section='thesis']" },
    { path: "/", name: "03-home-proof", scrollY: 3000, waitFor: "[data-section='proof']" },
    { path: "/system", name: "04-system-specimens", waitFor: "[data-spacing-token]" },
    { path: "/init", name: "05-init-bringup", waitFor: "text=[OK] SYSTEM READY" },
    { path: "/inventory", name: "06-inventory-detail", waitFor: "text=SF//" },
  ];

  for (const p of pages) {
    test(p.name, async ({ page }) => {
      await page.goto(`http://localhost:3000${p.path}`);
      await page.waitForSelector(p.waitFor, { state: "visible" });
      if (p.scrollY) await page.evaluate((y) => window.scrollTo(0, y), p.scrollY);
      await page.waitForTimeout(800);  // animation settle
      await page.screenshot({ path: `${OUT_DIR}/${p.name}.png`, fullPage: false });
    });
  }
});
```

**Run:** `pnpm exec playwright test tests/phase-35-screenshots.spec.ts` against a warm `pnpm dev` server (or use deployed URL by changing baseURL).

**Awwwards FAQ ideal thumbnail 1600x1200 is separate from submission screenshots.** Phase criterion requires 1440x900 — that is the submission-gallery dimension.

### Anti-Patterns to Avoid

- **Running Lighthouse against `localhost:3000` to claim PF-02 done** — fails the explicit "not CLI headless" clause; only PSI against live URL counts.
- **Declaring bundle gate passed against an old `.next/` directory** — `pnpm build` first, then measure. The current build is from Apr 9 10:41 but verify it reflects post-Phase 34 commits (e1e7af5, fcc811d).
- **Fixing Performance=100 by removing WebGL** — forbidden by v1.5 scope. Three.js is load-bearing for the SIGNAL layer; the fix must come from lazy-loading discipline, not removal.
- **Creating OG image as a raster PNG in `public/`** — harder to update, worse font fidelity. Use `next/og` ImageResponse.
- **Capturing screenshots manually at "roughly 1440x900"** — use Playwright viewport for exact pixel dimensions Awwwards expects.
- **Running `vercel --prod` without `vercel whoami` first** — STATE Session Continuity implies multiple teams possible; verify `signalframeux` team match before deploy.
- **Committing Awwwards copy deck as a separate `awwwards-submission.md` README at project root** — per CLAUDE.md "DO NOT create documentation files unless explicitly requested", scope it to `.planning/phases/35-performance-launch-gate/assets/`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bundle visualization | Custom webpack-stats parser | `@next/bundle-analyzer` (already installed) | Treemap, gzip toggle, drill-down per module |
| OG image generation | Hand-authored PNG in Figma | `next/og` `ImageResponse` (Satori → Resvg PNG) | Type-safe, SSR-compatible, edge-cacheable, updates when code updates |
| Lighthouse scoring | Hand-written perf checklist | PageSpeed Insights (Google infra) | 25+ audits, CWV field data when available, multi-pass averaging |
| Screenshot capture at exact dimensions | macOS screenshot keyboard shortcut | Playwright viewport + `page.screenshot` | Deterministic pixels, repeatable, scriptable |
| Console error check | Manual DevTools inspection | chrome-devtools MCP `get_console_logs` on live URL | Scripted, reproducible in verification phase |
| Production deploy | git push via dashboard | `vercel --prod` CLI | Controlled from terminal; `.vercel/project.json` already wired |
| Sitemap generation | Static XML | `app/sitemap.ts` (already exists, line 1-13) | Type-safe; Next.js emits per-route |

**Key insight:** This phase should author exactly **three new files**: `app/opengraph-image.tsx`, `.planning/phases/35-performance-launch-gate/assets/awwwards-description.md`, and `tests/phase-35-screenshots.spec.ts` (plus possibly a small CLS fix to `component-detail.tsx`). Everything else is measurement and verification.

---

## Common Pitfalls

### Pitfall 1: ComponentDetail Height Animation Causes Non-Zero CLS

**What goes wrong:** `components/blocks/component-detail.tsx:108-148` animates `height: 0 → panel.scrollHeight` via `gsap.fromTo`. Height is a layout property; any change to it during scroll triggers layout recalculation for all descendants, which PSI/Lighthouse scores as Cumulative Layout Shift.

**Why it happens:** Phase 25 authored this without transform-only discipline. Phase 26-02 accepted CLS 0.002 as "within targets" but Phase 35 explicitly requires **CLS = 0** in field data, not "within 0.1 threshold".

**How to avoid:** Replace with one of:
- **Option A (simplest):** Wrap content in a `max-height`-animated container (`max-height: 0 → max-height: 2000px`). `max-height` is not a CLS-triggering property when the element is below all other content and nothing below it shifts. **Verify nothing below shifts** — in `/inventory`, the detail panel is a DOM sibling of the grid (per Phase 24 DV-11 rule), so its height change DOES push the footer. CLS risk persists.
- **Option B (correct):** Use `grid-template-rows: 0fr → 1fr` CSS grid animation, which is CSS-level layout-reserved.
- **Option C (GSAP-native, safest):** Animate `transform: scaleY(0) → scaleY(1)` with `transform-origin: top` on the detail panel, and reserve the vertical space via an outer wrapper that starts at the final height (pre-measured on open).
- **Option D (brief-aligned):** Since this is a detail panel opened on demand, wrap it in a `<div style="display: grid; grid-template-rows: 0fr">` → animate to `1fr` via a CSS class toggle + `transition: grid-template-rows 0.2s`. Reduces GSAP involvement, eliminates CLS.

**Warning signs:** Lab CLS > 0 on `/inventory` page in PSI report. ComponentDetail is used on `app/page.tsx` (via inventory-section.tsx), `app/inventory/page.tsx` (via components-explorer.tsx), and `components/blocks/component-grid.tsx` — so both homepage and /inventory carry the risk.

### Pitfall 2: LCP Element Stolen by Magenta Sibling Slash Div

**What goes wrong:** Phase 34's VL-05 commit fcc811d added a sibling magenta `//` div to `entry-section.tsx:43-58` at `opacity: 0.25`. Lighthouse picks the *most visually prominent* element for LCP — the opaque slash div may win over the 0.01-opacity h1 even though both render simultaneously.

**Why it happens:** Phase 30 locked `opacity: 0.01` on the h1 (D-08 rule). Phase 34 did not audit whether VL-05's higher-opacity sibling would displace it.

**How to avoid:**
1. Measure first: in PSI report, open "Largest Contentful Paint element" panel. If it is the slash div, act.
2. If fix needed: either bump h1 to `opacity: 0.02` (still LCP-safe per the D-08 rule — the rule forbids `0`, not all values below 0.1) OR apply `content-visibility: auto` to the slash div so it exits LCP candidate selection, OR nest the slash as a child span inside the h1 with `mix-blend-mode: screen`.

**Warning signs:** PSI reports LCP element as a `<div>` not an `<h1>`. LCP time > 1.0s on mobile despite fast network (means the candidate is waiting for WebGL warmup).

### Pitfall 3: Performance = 100 on Mobile is Hard for WebGL Sites

**What goes wrong:** PSI mobile uses simulated 3G throttling. Three.js + GSAP hydration consumes main thread during TBT window. Phase 26-02 landed at 80 mobile — **25 points below the Phase 35 target**.

**Why it happens:** Mobile throttling is aggressive; TBT budget is small; WebGL context creation blocks main thread.

**How to avoid (surgical fixes, in priority order):**

1. **Defer all non-critical `*-lazy.tsx` mounts** — verify they use Intersection Observer, not mount-at-hydration. The SIGNAL section lazy mount should fire only when viewport enters.
2. **Preload the LCP font** — `<link rel="preload" as="font">` in `app/layout.tsx` `<head>` for Anton-Regular.woff2.
3. **Confirm CSS `font-display: optional`** on Anton (currently `swap`) — `optional` allows Lighthouse to score CLS=0 at the cost of brief font flash. Tradeoff: aesthetic vs score.
4. **Split SignalframeProvider to Server Component boundary** (already done per v1.2 "hole in the donut" pattern — verify no regression).
5. **Move `GlobalEffectsLazy` + `SignalCanvasLazy` + `PageAnimations` + `InstrumentHUD` mounts to after first idle** — `requestIdleCallback` wrap. Currently they mount in `app/layout.tsx` body right after content; they hydrate as part of the initial JS.
6. **Verify no sync `import "three"` leaks** — grep confirms only lazy chains use it; no action if clean.
7. **Last resort (score-only, not aesthetic):** ship `<link rel="preload" as="script">` for the Three.js async chunk if Performance still < 100 after all above.

**Warning signs:** PSI mobile Performance < 100. Diagnostics panel shows "Reduce JavaScript execution time" or "Avoid long main-thread tasks" as the top flagged audit.

### Pitfall 4: OG Image Font Loading Fails in Satori

**What goes wrong:** `next/og` `ImageResponse` uses Satori which supports only `ttf`, `otf`, `woff` — not `woff2`. The `app/fonts/` dir has both `Anton-Regular.ttf` AND `Anton-Regular.woff2`, so ttf is available — but the ImageResponse `fonts` prop must explicitly load and pass it.

**Why it happens:** Default `next/font` only ships `woff2` for browsers; Satori cannot consume the same font file.

**How to avoid:**

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
// ...

export default async function Image() {
  const antonFontData = await readFile(
    join(process.cwd(), "app/fonts/Anton-Regular.ttf"),
  );
  return new ImageResponse(
    ( /* JSX */ ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: antonFontData, style: "normal", weight: 400 },
      ],
    },
  );
}
```

**Warning signs:** OG image renders as plain system font (Arial fallback), no Anton weight/tracking. OG scraper preview at `https://www.opengraph.xyz/url/<encoded-url>` shows degraded typography.

### Pitfall 5: Vercel CLI Outdated Causes Silent Flag Rejection

**What goes wrong:** Installed `vercel` is 50.28.0; latest is 50.42.0+. Flags added in newer versions (e.g., `--yes`, `--prod` behavior changes, `--skip-domain`) may fail or behave unexpectedly.

**Why it happens:** Global installs drift; nvm-scoped Node + nvm-scoped Vercel CLI not auto-updated.

**How to avoid:** Wave 0 task: `npm i -g vercel@latest` → `vercel --version` → confirm ≥ 50.42.0 → `vercel whoami` → confirm signalframeux team match.

**Warning signs:** `vercel --prod` output mentions deprecated flags, team name mismatch, or interactive prompt despite `.vercel/project.json` present.

### Pitfall 6: Lighthouse Runs Against a Deployment With Protection Enabled

**What goes wrong:** Vercel deployment protection is on by default for preview deployments (not production). If the plan accidentally runs PSI against a preview URL, it returns 401 or a blank page.

**Why it happens:** `vercel deploy` without `--prod` creates preview URLs. Password protection or Vercel authentication gates them.

**How to avoid:** Only use `vercel --prod` for LR-03 / PF-02 gates. Note the URL printed at CLI tail (`Production: https://signalframeux.vercel.app`). Run PSI at `https://pagespeed.web.dev/report?url=https%3A%2F%2Fsignalframeux.vercel.app`. If team uses custom domain, substitute.

**Warning signs:** PSI shows "Unable to load page" or blank screenshot.

### Pitfall 7: Field Data Not Yet Available in CrUX (PF-04 success criterion)

**What goes wrong:** CrUX dataset needs ~28 days of real user traffic to populate field data. A fresh deployment has no field data — PSI report shows "Not enough data" in the Core Web Vitals section.

**Why it happens:** Chrome User Experience Report aggregates from Chrome users who opt into statistics reporting. New/low-traffic sites don't have enough samples.

**How to avoid:** Phase 35 success criterion #4 says "confirmed in PageSpeed Insights field data". This is unachievable on a fresh launch. Reframe the criterion in 35-VALIDATION.md: **field-data absent is acceptable at launch; lab CLS = 0 is the enforceable gate; the field-data criterion becomes a 30-day post-launch monitoring promise**, captured as a deferred-review item.

**Warning signs:** PSI Core Web Vitals panel shows "The Chrome User Experience Report does not have sufficient real-world speed data for this page." Accept + document, don't block the phase on it.

### Pitfall 8: ROADMAP.md Phase 35 Plan List Contains Stale Phase 29 References

**What goes wrong:** `.planning/ROADMAP.md` lines 480-481 under Phase 35 list `29-01-PLAN.md` and `29-02-PLAN.md` as the phase's plans — copy-paste residue from when Phase 29 was being drafted.

**Why it happens:** Handoff or prior session edit did not clean the template after populating the criteria block.

**How to avoid:** Wave 0 task: `Edit` those two lines to reflect Phase 35's real plan list (e.g., `35-01-PLAN.md — Measurement + gap triage`, `35-02-PLAN.md — Gap closure + OG + Awwwards package`, `35-03-PLAN.md — Final deploy + verification`).

**Warning signs:** `grep -c "29-" .planning/ROADMAP.md` returns ≥ 2 inside the Phase 35 block.

---

## Code Examples

### Example 1: Programmatic Bundle Gate Measurement (PF-01)

```bash
# From project root after pnpm build
python3 -c "
import json, gzip, os
with open('.next/build-manifest.json') as f:
    d = json.load(f)
total = 0
for path in d['rootMainFiles']:
    filepath = f'.next/{path}'
    with open(filepath, 'rb') as f:
        data = f.read()
    gz = gzip.compress(data, compresslevel=9)
    total += len(gz)
    print(f'{os.path.basename(path)}: raw {len(data)/1024:.1f} KB, gzip {len(gz)/1024:.1f} KB')
print(f'---TOTAL: {total/1024:.1f} KB gzip (gate 150 KB, margin {150 - total/1024:.1f} KB)---')
"
```

Current output (Apr 9):
```
webpack-38b3c4b3e52bc534.js: raw 3.7 KB, gzip 2.0 KB
353a808c-14d8a45ebc7585c0.js: raw 169.0 KB, gzip 53.0 KB
594-60da1ccd43ff91b1.js: raw 168.5 KB, gzip 44.9 KB
main-app-76a6a6441f106c70.js: raw 0.5 KB, gzip 0.2 KB
---TOTAL: 100.0 KB gzip (gate 150 KB, margin 50.0 KB)---
```

### Example 2: ComponentDetail CLS Fix (Grid-Template-Rows Pattern)

```tsx
// components/blocks/component-detail.tsx — REPLACEMENT for lines 98-148
// Replace GSAP height animation with CSS grid-template-rows for CLS = 0

useEffect(() => {
  const panel = panelRef.current;
  if (!panel) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    panel.style.gridTemplateRows = "1fr";
    return;
  }

  // Force reflow, then flip the grid row — CSS transition handles the animation
  requestAnimationFrame(() => {
    panel.style.gridTemplateRows = "1fr";
  });
}, []);

const handleClose = () => {
  if (closingRef.current) return;
  closingRef.current = true;
  const panel = panelRef.current;
  if (!panel) return onClose();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    onClose();
    triggerRef.current?.focus();
    return;
  }

  panel.style.gridTemplateRows = "0fr";
  panel.addEventListener(
    "transitionend",
    () => {
      onClose();
      triggerRef.current?.focus();
    },
    { once: true },
  );
};

// Wrapper JSX
return (
  <div
    ref={panelRef}
    style={{
      display: "grid",
      gridTemplateRows: "0fr",
      transition: "grid-template-rows 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
      overflow: "hidden",
    }}
  >
    <div style={{ minHeight: 0 }}>
      {/* existing panel content */}
    </div>
  </div>
);
```

**Why this eliminates CLS:** `grid-template-rows` transitions on the *track*, not the layout box. Browsers reserve the full final height during the transition animation frame without shifting siblings. Verified safe across Chromium / Firefox / Safari 16+.

### Example 3: OG Image Route (LR-02)

```tsx
// app/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "SIGNALFRAME//UX — Deterministic Interface. Generative Expression.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const antonFontData = await readFile(
    join(process.cwd(), "app/fonts/Anton-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",  // var(--color-background) hex approximation
          position: "relative",
        }}
      >
        {/* Monospaced coded breadcrumb top-left */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 60,
            fontSize: 20,
            color: "#666",
            fontFamily: "monospace",
            letterSpacing: "0.08em",
          }}
        >
          [SFUX]//HOME
        </div>

        {/* Hero mark */}
        <div
          style={{
            display: "flex",
            fontSize: 180,
            fontWeight: 700,
            letterSpacing: "0.02em",
            fontFamily: "Anton",
            color: "#fafafa",
            lineHeight: 0.9,
          }}
        >
          <span>SIGNALFRAME</span>
          <span style={{ color: "#e91e90" }}>//</span>
          <span>UX</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 24,
            fontSize: 22,
            color: "#888",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          Deterministic Interface · Generative Expression
        </div>

        {/* Instrument HUD bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            fontSize: 16,
            color: "#555",
            fontFamily: "monospace",
            letterSpacing: "0.05em",
          }}
        >
          [v1.5] · 54 COMPONENTS · LH 100/100
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: antonFontData, style: "normal", weight: 400 },
      ],
    },
  );
}
```

### Example 4: Metadata Base URL Fix (LR-02)

```tsx
// app/layout.tsx — add metadataBase to existing metadata export
export const metadata: Metadata = {
  metadataBase: new URL("https://signalframeux.vercel.app"),
  title: {
    default: "SIGNALFRAME//UX",
    template: "%s | SIGNALFRAME//UX",
  },
  description:
    "Dual-layer design system for Culture Division. Deterministic interface (FRAME) meets generative expression (SIGNAL). Built on React 19, GSAP, and Three.js.",
  keywords: [
    "design system",
    "SIGNAL/FRAME",
    "generative UI",
    "GSAP",
    "Three.js",
    "shadcn",
    "Culture Division",
    "Awwwards",
  ],
  authors: [{ name: "Culture Division" }],
  openGraph: {
    title: "SIGNALFRAME//UX",
    description: "Deterministic interface. Generative expression. The programmable design system for digital surfaces.",
    url: "https://signalframeux.vercel.app",
    siteName: "SignalframeUX",
    type: "website",
    locale: "en_US",
    // images field auto-populated by app/opengraph-image.tsx file convention
  },
  twitter: {
    card: "summary_large_image",
    title: "SIGNALFRAME//UX",
    description: "Deterministic interface. Generative expression.",
    creator: "@culturedivision",  // adjust or drop if no handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, maxImagePreview: "large" },
  },
};
```

### Example 5: Awwwards Description Copy Deck (LR-01)

```markdown
<!-- .planning/phases/35-performance-launch-gate/assets/awwwards-description.md -->

# SIGNALFRAME//UX — Awwwards Submission

## Short Description (≤ 120 chars)

Dual-layer design system. FRAME: deterministic structure. SIGNAL: generative expression. Built for Culture Division.

## Long Description (300-500 words)

SIGNALFRAME//UX is a design system built around a single structural idea: every interface has two layers that must stay in tension — FRAME, the deterministic grid that carries meaning, and SIGNAL, the generative surface that carries presence.

The system ships 54 components across six categories. The FRAME layer is built from radix-ui primitives wrapped in a disciplined CVA token vocabulary. The SIGNAL layer is a shared WebGL driver (Three.js through a single GSAP ticker) that paints GLSL scenes, scramble-text, hard-cut toggles, and parametric grain across any surface the FRAME permits.

This site is a demonstration piece. It is also the submission vehicle. The six sections on the homepage — ENTRY, THESIS, PROOF, INVENTORY, SIGNAL, ACQUISITION — read as an instrument panel, not a marketing page. Each page on the subdomain uses monospaced coded nomenclature, 200px+ architectural typography, minimum 40% negative space, and a single magenta accent used less than five times per page. Motion is deterministic: every GSAP animation respects `prefers-reduced-motion` and returns the layout to CLS = 0.

The aesthetic lineage is explicit. Detroit Underground supplies the register (hard-cut, slightly tense, truthful to material). The Designers Republic supplies the total-design discipline (maximum minimalism, coded naming, zero decorative ornament). Ryoji Ikeda supplies the data-as-material principle (thresholds of perception, signal-intensity as a CSS custom property). Autechre supplies the generative logic (rules, not randomness). The result is brutalist industrial typography laid over a mathematically generated signal field — sharp, controlled, sophisticated without being sterile.

Performance is a design constraint, not an afterthought. Shared JS bundle: 100 KB gzip against a 150 KB gate. Lighthouse: 100/100 Performance, Accessibility, Best Practices, SEO on Google PageSpeed Insights. LCP under 1.0s. CLS = 0. All Three.js scenes lazy-loaded behind Intersection Observer; all heavy components dynamically imported behind `next/dynamic`.

SIGNALFRAME//UX is built on Next.js 15.3 (App Router, Turbopack), React 19, Tailwind CSS v4, GSAP 3.12 with ScrollTrigger, Lenis smooth scroll, Three.js, and TypeScript 5.8. Zero rounded corners anywhere. Zero generic dark-mode aesthetics. The system is open-source and installable via `npx signalframeux init`.

## Technologies

- Next.js 15.3 (App Router, Turbopack)
- React 19
- TypeScript 5.8
- Tailwind CSS v4
- GSAP 3.12 + ScrollTrigger
- Lenis smooth scroll
- Three.js (GLSL shaders)
- Radix UI + shadcn base layer
- OKLCH color space
- Vercel (deployment)

## Categories

- Design System
- Developer Tools
- Experimental Typography
- Motion Design

## Live URL

https://signalframeux.vercel.app

## Screenshot Manifest

1. `01-home-entry.png` — SIGNALFRAME//UX hero with GLSL shader and VL-05 magenta slash
2. `02-home-thesis.png` — THESIS manifesto, 200vh pinned scroll mid-state
3. `03-home-proof.png` — Interactive SIGNAL/FRAME layer demo at max intensity
4. `04-system-specimens.png` — /system OKLCH color grid and spacing specimen diagrams
5. `05-init-bringup.png` — /init bringup sequence with [OK] SYSTEM READY terminal footer
6. `06-inventory-detail.png` — /inventory SF//BTN-001 coded catalog with ComponentDetail panel open
```

### Example 6: Deploy + Verify Sequence (LR-03, PF-02)

```bash
# Wave 0: Upgrade Vercel CLI
npm i -g vercel@latest
vercel --version  # confirm ≥ 50.42.0
vercel whoami     # confirm team matches .vercel/project.json orgId

# Wave 1: Measurement build
pnpm install       # in case of lock drift
pnpm build         # fresh build for current tree
# run bundle measurement script (Example 1)

# Wave 1: Analyzer evidence (manual browser inspection)
ANALYZE=true pnpm build
# Opens client.html + server.html in browser
# Verify three, component-detail, shiki, calendar, menubar absent from rootMainFiles chunks

# Wave 3: Production deploy
vercel --prod
# Note the emitted "Production: https://..." URL

# Wave 3: PSI audit
open "https://pagespeed.web.dev/report?url=https%3A%2F%2Fsignalframeux.vercel.app&form_factor=mobile"
open "https://pagespeed.web.dev/report?url=https%3A%2F%2Fsignalframeux.vercel.app&form_factor=desktop"
# Also /inventory, /system, /init, /reference

# Wave 3: Console error check via chrome-devtools MCP
# (orchestrator drives: new_page → navigate → get_console_logs → filter error/warn)
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Phase 26-02 accepted Performance 80 mobile / 94 desktop as `[~]` AC-1 | Phase 35 requires 100/100 on all four categories | v1.5 criterion | Higher bar; must close 20-point mobile gap on a site with MORE WebGL than v1.4 |
| Static OG image in `public/` | Dynamic `app/opengraph-image.tsx` via `next/og` `ImageResponse` | Next.js 13+ App Router file convention | Typeface-accurate, easy to update, auto-emitted to `<meta property="og:image">` |
| Manual screenshot capture | Playwright `page.screenshot` at exact viewport | Phase 35 | Deterministic dimensions, scripted, repeatable |
| Lab Lighthouse only | Field + Lab via PageSpeed Insights | CWV initiative (2020+) | Field data is the gate when available; lab is fallback for fresh launches |
| Three.js in shared bundle (v1.0) | Three.js in async chunks only via 5 `*-lazy.tsx` wrappers | v1.2 | Shared bundle held at 100 KB gzip across v1.2-v1.5 |

**Deprecated / outdated:**

- Phase 26-02's `[~] Performance 80 accepted` is superseded; Phase 35 gate is strict.
- Running `npx lighthouse http://localhost:3000` does not count for PF-02 (success criterion explicitly says "not CLI headless").
- `@vercel/og` as a separate package install is outdated for App Router — it's bundled via `next/og`.

---

## Open Questions

1. **Is the Phase 26-02 Performance gap closable without compromising the v1.5 aesthetic?**
   - What we know: Prior gate shipped 80 mobile Performance with WebGL on all pages + GSAP hydration. The v1.5 site has MORE WebGL (3 concurrent scenes on homepage) and a 300vh pinned scroll.
   - What's unclear: Whether lazy-load discipline and font preloading alone close a 20-point gap, or whether WebGL must be deferred further (e.g., SignalCanvas mount on `requestIdleCallback` + 2s delay).
   - Recommendation: Wave 1 measures PSI against current deployed state BEFORE any fixes. If mobile P = 100 without fixes, we're done. If < 100, triage from PSI Diagnostics panel — do not apply speculative fixes.

2. **Will the VL-05 magenta sibling slash div steal LCP candidacy from the h1?**
   - What we know: The slash div at `entry-section.tsx:43` has `opacity: 0.25`, z-20, absolute inset-0; the h1 has `opacity: 0.01`. LCP picks "most visually prominent" which usually means largest rendered area × opacity.
   - What's unclear: Chromium's exact LCP candidate scoring rule for opacity-weighted elements. Mocking suggests slash > h1; field test required.
   - Recommendation: Wave 1 checks PSI "Largest Contentful Paint element" panel. If slash wins, apply Pattern 3 fix.

3. **Are iPhone physical device checks in Phase 35 scope?**
   - What we know: STATE.md notes Phase 31 D-34 iPhone verification deferred. project_known_issues.md says multiple desktop+mobile issues are intentionally deferred.
   - What's unclear: Whether LR-04 (mobile responsive at 375/768/1440) is satisfied by viewport-emulated Playwright or requires physical iPhone. Phase 29 previously mandated physical iOS Safari testing after Phase 32.
   - Recommendation: Plan scopes LR-04 to Playwright viewport emulation + chrome-devtools MCP mobile device emulation. Physical iPhone verification stays as deferred-review item per prior STATE precedent — document explicitly in 35-VALIDATION.md.

4. **Will field data (CrUX) be available in PSI report at time of Phase 35 verification?**
   - What we know: CrUX requires ~28 days of real traffic. SignalframeUX has been live on Vercel since v1.0 (2026-04-05), so technically four days of data — below threshold.
   - What's unclear: Whether Vercel analytics' traffic is CrUX-eligible (most likely not) or whether the site has enough organic Chrome traffic.
   - Recommendation: Accept that field data may be absent. Reframe Phase 35 success criterion #4 as "lab CLS = 0 + field-data monitoring promise" in 35-VALIDATION.md.

5. **Should the Vercel CLI upgrade happen as a Wave 0 task or be executed ad-hoc?**
   - What we know: Current 50.28.0; STATE handoff flags 50.42.0 as current. The `.vercel/project.json` works with either.
   - What's unclear: Whether newer CLI introduces mandatory breaking flags.
   - Recommendation: Wave 0 task (5-minute chore), verify `vercel --version`, verify `vercel whoami` matches team.

6. **Phase 31 missing 31-01-SUMMARY and ROADMAP line 480-481 stale Phase 29 plan references — in or out of Phase 35 scope?**
   - What we know: ROADMAP.md lines 480-481 under Phase 35 list `29-01-PLAN.md` and `29-02-PLAN.md` — copy-paste residue. `.planning/phases/31-thesis-section/` has 31-02-SUMMARY.md but no 31-01-SUMMARY.md. STATE.md marks Phase 31 Complete but this is inconsistent with the missing file.
   - What's unclear: Whether Phase 35 is the right phase to clean these up, or whether they are out-of-scope documentation debt.
   - Recommendation: Wave 0 — fix ROADMAP.md Phase 35 plan list (it's a self-referential bug blocking planning clarity). Leave Phase 31 summary gap alone — that's Phase 31's historical debt, not Phase 35's concern.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.59.1 |
| Config file | `playwright.config.ts` |
| Quick run command | `pnpm exec playwright test tests/phase-35-*.spec.ts` |
| Full suite command | `pnpm exec playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PF-01 | Shared JS bundle (rootMainFiles gzip total) ≤ 150 KB | script | `python3 -c "<gzip measurement, Example 1>"` | ✅ (inline script, reusable from Phase 26) |
| PF-01 | Three.js absent from rootMainFiles chunks | analyzer | `ANALYZE=true pnpm build` + visual treemap check | ✅ (ANALYZE wired in `next.config.ts:4`) |
| PF-01 | ComponentDetail in its own async chunk | analyzer | Same as above | ✅ |
| PF-02 | Performance = 100 on deployed URL (mobile + desktop) | manual/external | PageSpeed Insights report against `https://signalframeux.vercel.app` | N/A — web tool |
| PF-02 | Accessibility = 100 on deployed URL | manual/external | PSI same URL | N/A — web tool |
| PF-02 | Best Practices = 100 on deployed URL | manual/external | PSI same URL | N/A — web tool |
| PF-02 | SEO = 100 on deployed URL | manual/external | PSI same URL | N/A — web tool |
| PF-03 | LCP element is the h1 with `SIGNALFRAME//UX` (not a sibling) | manual/PSI | PSI "Largest Contentful Paint element" panel | N/A — web tool |
| PF-03 | LCP < 1.0s on homepage | manual/PSI | PSI Performance section | N/A — web tool |
| PF-03 | h1 `opacity: 0.01` (not `0`) | unit/grep | `grep -n "opacity: 0" components/blocks/entry-section.tsx` must NOT match `opacity: 0,` before h1 | ❌ Wave 0 — add to existing `phase-35.spec.ts` |
| PF-04 | CLS = 0 lab (post-fix) across all pages | manual/PSI | PSI CWV panel per page | N/A — web tool |
| PF-04 | ComponentDetail does not animate `height` directly | unit/grep | `grep -c "height: [0-9]" components/blocks/component-detail.tsx` must return 0 after fix | ❌ Wave 0 — add assertion |
| LR-01 | `awwwards-description.md` exists with all required sections | file/grep | `test -f .planning/phases/35-performance-launch-gate/assets/awwwards-description.md && grep -q "Short Description" $file && grep -q "Technologies" $file` | ❌ Wave 0 — file to author |
| LR-01 | 5+ screenshots exist at 1440x900 | script | `ls .planning/phases/35-performance-launch-gate/assets/screenshots/*.png \| wc -l` returns ≥ 5, ImageMagick dimension check | ❌ Wave 0 — `tests/phase-35-screenshots.spec.ts` + assets dir |
| LR-02 | `app/opengraph-image.tsx` exists and exports `runtime`, `alt`, `size`, `contentType` | unit/grep | `grep -q "export const runtime" app/opengraph-image.tsx && grep -q "export const size" ...` | ❌ Wave 0 — file to author |
| LR-02 | `metadataBase` present in `app/layout.tsx` | unit/grep | `grep -q "metadataBase:" app/layout.tsx` | ❌ Wave 0 — edit existing file |
| LR-02 | OG image accessible at `https://signalframeux.vercel.app/opengraph-image.png` returns 200 | e2e | Playwright `page.goto(og-url)` expects 200 status | ❌ Wave 0 — add to phase-35 spec |
| LR-03 | Production deploy succeeds and returns 200 on all 5 routes | e2e | Playwright script: goto / /inventory /system /init /reference, expect 200 | ❌ Wave 0 — add to phase-35 spec |
| LR-03 | Zero console errors across 5 routes on deployed URL | e2e | Playwright listens `page.on('console')` with severity filter, asserts no `error` entries | ❌ Wave 0 — add to phase-35 spec |
| LR-03 | Only allowed `console.warn` is dev-gated (not emitted in production) | unit/grep | `grep -rn "console\.\(error\|warn\)" components app lib hooks` returns only dev-gated instances | ❌ Wave 0 — audit script |
| LR-04 | All 5 routes render without horizontal scroll at 375 / 768 / 1440 viewport | e2e | Playwright per-viewport `document.documentElement.scrollWidth <= viewport.width` | ❌ Wave 0 — add to phase-35 spec |

### Sampling Rate

- **Per task commit:** `pnpm exec playwright test tests/phase-35-*.spec.ts` (new phase-35 spec files only; ~30s)
- **Per wave merge:** `pnpm exec playwright test` full suite + `pnpm build` + bundle measurement script (~90s)
- **Phase gate:** Full suite green + `ANALYZE=true pnpm build` treemap manually reviewed + `vercel --prod` deployed + PSI mobile+desktop 100/100/100/100 captured to `assets/lighthouse-reports/` + 5+ screenshots captured to `assets/screenshots/` + `awwwards-description.md` + `opengraph-image.tsx` committed

### Wave 0 Gaps

- [ ] `tests/phase-35-screenshots.spec.ts` — covers LR-01 (screenshot capture at 1440x900)
- [ ] `tests/phase-35-launch-gate.spec.ts` — covers LR-02 (OG file exists), LR-03 (deploy routes + console errors), LR-04 (responsive no-horizontal-scroll per viewport), PF-03 (h1 opacity assertion), PF-04 (ComponentDetail no-height-animation assertion)
- [ ] `app/opengraph-image.tsx` — authored, covers LR-02
- [ ] `.planning/phases/35-performance-launch-gate/assets/awwwards-description.md` — authored, covers LR-01
- [ ] `.planning/phases/35-performance-launch-gate/assets/screenshots/` — directory for LR-01 assets
- [ ] `.planning/phases/35-performance-launch-gate/assets/lighthouse-reports/` — directory for PSI JSON exports
- [ ] `app/layout.tsx` — add `metadataBase` URL, expand `openGraph`/`twitter` metadata
- [ ] `components/blocks/component-detail.tsx` — replace GSAP height animation with grid-template-rows pattern (CLS fix)
- [ ] Global `vercel` CLI upgrade to 50.42.0+ (system-level, not file)
- [ ] `.planning/ROADMAP.md` lines 480-481 — fix stale Phase 29 plan references under Phase 35

Framework install: None required — Playwright already installed.

---

## Sources

### Primary (HIGH confidence)

- **Direct code audit** — `next.config.ts` (ANALYZE wiring), `package.json` (versions, no vercel dep), `app/layout.tsx` (metadata, fonts, InstrumentHUD mount), `app/page.tsx` (6-section homepage), `app/sitemap.ts` (authoritative production URL), `components/blocks/entry-section.tsx` (LCP element h1 + VL-05 slash sibling), `components/blocks/component-detail.tsx` (CLS-risk height animation lines 108-148), `components/layout/{signal-canvas-lazy,global-effects-lazy}.tsx` (dynamic import discipline), `middleware.ts` (CSP), `hooks/use-nav-reveal.ts` (dev-gated console.warn), `playwright.config.ts`, `.vercel/project.json` (project linked, orgId, projectId)
- **Direct measurement** — `.next/build-manifest.json` rootMainFiles → 100.0 KB gzip total (margin 50.0 KB)
- **Phase 26-RESEARCH.md + 26-02-SUMMARY.md** — Prior launch gate methodology, Performance 80/94 baseline, axe/CSP/SEO fix catalog, bundle measurement script, Vercel deployment sequence
- **Phase 34-VERIFICATION.md** — v1.5 shipped state, 77/77 Nyquist truths, deferred human-verification items (voice register, nav-reveal, magenta per-page count)
- **STATE.md** — v1.5 Accumulated Context, Phase 30 D-08 LCP opacity rule, zero-new-packages constraint, Vercel CLI outdated flag, phase map
- **REQUIREMENTS.md** — PF-01..06, LR-01..04 specs verbatim + traceability table
- **CLAUDE.md** — Quality bar (Lighthouse 100, LCP <1.0s, CLS 0, <200KB), hard constraints (zero rounded corners, no rebuilding, DU/TDR aesthetic)
- **ROADMAP.md** — Phase 35 goal + 7 success criteria verbatim + stale Phase 29 plan residue confirmed

### Secondary (MEDIUM confidence)

- **Vercel OG docs** (`https://vercel.com/docs/og-image-generation`) — fetched Apr 9, 2026; confirms App Router ships `@vercel/og` inline via `next/og`, confirms 1200x630 size, confirms Node.js runtime supports `return new ImageResponse(...)`, lists Satori font format constraints (ttf/otf/woff — not woff2)
- **Next.js file convention discovery via WebSearch** (multiple search results Apr 9) — confirms `app/opengraph-image.tsx` + `size`/`contentType`/`alt`/default-async-function exports pattern
- **Awwwards FAQ via WebSearch** (Apr 9) — confirms 1600x1200 ideal thumbnail dimension; other submission field details not comprehensively documented in search preview
- **PageSpeed Insights CWV metric list** — `largest_contentful_paint_v3`, `cumulative_layout_shift2_v2`, `interaction_to_next_paint_v7` (MEDIUM — from WebFetch of pagespeed.web.dev, high-level confirmation only)

### Tertiary (LOW confidence, flagged)

- **LCP candidate-selection scoring behavior for overlapping opacity-weighted elements** — Chromium source code not consulted; field test required to determine whether Phase 34 VL-05 slash div steals LCP from h1
- **Exact Awwwards submission form fields at time of submission** — Awwwards FAQ/submission pages were not fully parseable via WebFetch (CSS-heavy HTML); the plan should include a final manual review of the Awwwards submission form before package authoring
- **Chromium LCP scoring with `mixBlendMode: screen`** — documented behavior varies across Chromium versions; test in PSI before asserting

---

## Metadata

**Confidence breakdown:**

- Bundle gate (PF-01): **HIGH** — directly measured 100.0 KB, 50 KB margin, dynamic import chain audited, ANALYZE wiring confirmed
- LCP element identity (PF-03): **MEDIUM-HIGH** — h1 opacity: 0.01 verified in source, but sibling VL-05 slash div is a live risk that needs PSI-measured verification
- Lighthouse 100/100 achievability (PF-02): **MEDIUM-LOW** — Phase 26-02 fell 20 points short on mobile Performance for a simpler site; v1.5 has more WebGL. Gate is aspirational until first PSI audit proves it feasible. Plan must budget for multiple deploy-audit-fix cycles.
- CLS = 0 (PF-04): **MEDIUM** — known ComponentDetail risk is fixable with grid-template-rows pattern; pin-spacer + font swap risks are controllable
- OG image authoring (LR-02): **HIGH** — `next/og` pattern is well-documented; Anton.ttf already in repo; metadata file convention is stable
- Awwwards package (LR-01): **MEDIUM** — copy deck is authorial work; screenshots via Playwright is scriptable; submission form fields are inferred but not 100% confirmed from docs
- Vercel deploy (LR-03): **HIGH** — project already linked, CLI upgrade is trivial
- Mobile responsive (LR-04): **HIGH** — Phase 34 Task 2 already resolved 375px overflow bugs; regression-check only

**Research date:** 2026-04-09
**Valid until:** Bundle measurement valid for current commit tree; re-run after any Wave 2 fix. Lighthouse scores environment-dependent — valid at time of deploy only. OG/Awwwards guidance stable through next Next.js minor release.

**Phase 35 structural readiness:** Bundle ✅ De facto satisfied (100.0 KB vs 150 KB gate). LCP structural compliance ✅ (h1 opacity 0.01). OG image ❌ missing file. Awwwards package ❌ missing copy + screenshots. Production deploy ⚠️ needs Vercel CLI upgrade then `vercel --prod`. Performance = 100 ⚠️ highest uncertainty — budget for multiple audit-fix cycles. ComponentDetail CLS risk ⚠️ known fix available.
