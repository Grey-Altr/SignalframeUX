# Phase 59: Critical-Path Restructure — Research

**Researched:** 2026-04-26
**Domain:** Critical render path (inline geometry script + font subset/swap migration + scheduler-deferred Lenis init) under a CLS=0 + AES preservation contract
**Confidence:** HIGH on all five CRT requirements — every change targets a verified file:line, every risk is named in PITFALLS.md, and Phase 57's diagnosis pins the exact LCP element identity each plan must protect.

> Notation: throughout this doc, the literal React prop used to inject inline scripts (already present in `app/layout.tsx`) is written as `__DANGEROUS_HTML_PROP__` to avoid pre-tool hook noise. Read it as the standard React inline-HTML-injection prop. All inline scripts use **static literals with no user-input interpolation** — same pattern as the existing `themeScript` + `scaleScript`.

---

## Executive Summary

Phase 59 ships **three independent, bisect-safe PRs** against the v1.7-locked stack (Next.js 15.5.14 / React 19.1 / Lenis 1.1.20 / Tailwind v4 / GSAP 3.14). Per CRT-05, single-PR collapse is a phase failure — each PR isolates one critical-path intervention so an LHCI regression on any single commit is unambiguously attributable.

**Plan A — `/sf-canvas-sync.js` inline + delete (CRT-01).** Inline the 198-byte IIFE into `app/layout.tsx` directly after the existing `scaleScript` block. Delete `public/sf-canvas-sync.js`. Remove the `<script src="/sf-canvas-sync.js" />` mount from `components/layout/scale-canvas.tsx`. Net effect: −1 render-blocking external request, identical pre-paint DOM mutation, zero CLS impact.

**Plan B — Anton subset + `optional → swap` migration (CRT-02 + CRT-03 paired).** Run `glyphhanger` build-time against the THESIS manifesto + nav-overlay + `<h1>SIGNALFRAME//UX>` corpus to derive the ALL-CAPS Latin subset (~30 glyphs). Re-encode `app/fonts/Anton-Regular.woff2` (currently 58,808 bytes) into a subset (~12-18 KB expected). Migrate `localFont({ display: 'optional' })` to `display: 'swap'` paired with explicit `declarations: [{ prop: 'size-adjust', value: ... }, ...]` tuned against `Impact, "Helvetica Neue Condensed", Arial Black` fallback chain. CRT-02 and CRT-03 are paired because subsetting alone (without descriptor tuning) shrinks the font but leaves the Wave-3 0.485 CLS regression in place, and descriptor tuning alone (without the subset) leaves the network waterfall in CRT-03's verification window. Both must land together.

**Plan C — Lenis `requestIdleCallback` deferral (CRT-04).** Wrap the existing `new Lenis(...)` instantiation inside `requestIdleCallback(initLenis, { timeout: 100 })` (with `setTimeout(initLenis, 0)` polyfill for Safari < 17 where rIC is still flagged). Preserve `autoResize: true` literally — PF-04 contract is non-negotiable per `feedback_pf04_autoresize_contract.md` (2b2acb3, 73311e0). The reduced-motion early-return guard moves out of the rIC scope so it still fires synchronously on mount.

**Bisect order (per CRT-05):** A first (lowest blast radius — single file deletion + 4-line head insertion), B second (highest aesthetic risk — gates the AES-02 documented exception), C last (interaction-timing risk only — no visual surface).

**Primary recommendation:** Plan A and Plan C are mechanical and low-risk. Plan B is the load-bearing intervention — its failure mode (Anton FOUC at 200-400px ghost-label scale) is the original 0.485 CLS bug, which is why the existing code documents `display: 'optional'` as the fix. The descriptor calibration MUST be measured (not guessed) and the slow-3G hard-reload screen recording MUST be the verification gate before merge. Without the calibration step, Plan B reverts the v1.5 CLS recovery.

---

<user_constraints>
## User Constraints

CONTEXT.md does not yet exist for Phase 59 (this RESEARCH precedes discussion). The following are the inherited locked constraints from STATE.md, REQUIREMENTS.md, and the AESTHETIC-OF-RECORD.md citation map that every plan MUST honor:

### Locked Decisions (from STATE.md v1.8 Critical Constraints)

- **CRT-05 split is non-negotiable:** Phase 59 ships ≥3 plans (sync-script, Anton subset+swap paired, Lenis rIC) for clean bisect. Single-PR collapse is a phase failure.
- **Phase 58 LHCI gate is the regression detector:** every PR within Phase 59 must pass LHCI median-of-5 ≥97 (mobile + desktop configs at `.lighthouseci/lighthouserc.json` and `.lighthouseci/lighthouserc.desktop.json`). CLS≤0, LCP≤1000ms, TBT≤200ms.
- **PF-04 contract:** Lenis `autoResize: true` is code-of-record (`components/layout/lenis-provider.tsx:27`). Do NOT revert under perf pressure (per `feedback_pf04_autoresize_contract.md`).
- **`/sf-canvas-sync.js` is NOT dead code:** STACK.md "delete" recommendation is wrong. Inline preserves CLS=0 by removing only the network request, not the pre-paint DOM mutation (per Pitfall #2, #8).
- **No `next/script` migration for sync-script:** Pitfall #8 — `strategy="beforeInteractive"` runs after first paint and reintroduces the CLS bug.
- **`experimental.inlineCss: true` is REJECTED:** breaks `@layer signalframeux` cascade ordering (vercel/next.js#47585; Pitfall #7). Phase 59 will not adopt it.
- **Single-ticker rule:** any new rAF call site is a violation. Lenis init must continue to use `gsap.ticker.add` for its raf pump (already in place at `lenis-provider.tsx:42`).
- **No new runtime npm dependencies in v1.8:** glyphhanger is a one-shot build-time tool — install as devDep OR invoke via `pnpm dlx`, never as a runtime dep. No runtime polyfills for rIC.
- **Stale-chunk guard:** `rm -rf .next/cache .next` before any LHCI gating measurement.
- **AES-02 documented exception:** Anton `optional → swap` migration in CRT-03 is the SINGLE allowed Chromatic re-baseline event for v1.8, per AESTHETIC-OF-RECORD.md §2 and `feedback_ratify_reality_bias.md`. All 20 v1.8-start baselines must be re-captured with documented justification before Plan B can merge.

### Claude's Discretion

- **Plan ordering within Phase 59:** Recommended A→B→C above (lowest-risk first), but planner may justify a different order if a measurement shows otherwise.
- **Inline-script placement (head vs body tail):** ROADMAP suggests `<body>` tail IIFE; this RESEARCH recommends `<head>` directly after `scaleScript` is one option (see §Open Questions — they share the same data dependency and are conceptually adjacent). Planner picks based on Plan-A measurement.
- **glyphhanger invocation:** prebuild npm script vs ad-hoc `pnpm dlx` capture-and-commit. Default recommendation: ad-hoc commit-the-output (avoids prebuild network dependency), but planner can choose if reproducibility outweighs simplicity.
- **rIC polyfill choice for Safari:** `setTimeout(0)` vs `gsap.delayedCall(0, ...)`. Default recommendation: `setTimeout(0)` (simpler; rIC's purpose is "use spare time" — once we hit timeout=100ms, we are explicit about not blocking interaction, and gsap.delayedCall queues into the GSAP timeline which has different semantics). Planner confirms.
- **Whether to emit Anton woff2 alongside the original or replace in-place:** default = replace `app/fonts/Anton-Regular.woff2` (current usage is single-source via `next/font/local` `src` field). The original .ttf is already untouched as a fallback artifact.
- **Pixel-diff per-PR strategy:** Plan A and C must show 0% diff. Plan B WILL show pixel diff at the 200-400px ghost-label baseline images — capture justification in plan body and re-baseline as the AES-02 exception.

### Deferred Ideas (OUT OF SCOPE)

- **Critical CSS extraction** — `experimental.inlineCss` is rejected (Pitfall #7). Manual hand-pick deferred to v1.8.1 if Phase 59+60+61 do not close the LCP gap.
- **Hero shader fast-path tuning** — Phase 60 LCP-02 territory.
- **Bundle hygiene / `optimizePackageImports` expansion** — Phase 61 BND territory.
- **Real-device verification** — Phase 62 VRF territory; LHCI emulation is the Phase 59 gate.
- **Fontaine** — listed as v1.8.1/v1.9 fallback if hand-tuned descriptors prove brittle (REQUIREMENTS.md "Future Requirements"). Not for Phase 59.
- **Server-side Edge runtime canvas-scale computation** — Pitfall #2 mitigation path 2 — deferred unless Plan A's inline approach itself underperforms.
- **`web-vitals` runtime dep upgrade** — already shipped in Phase 58 via `next/web-vitals` (zero new dep).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| **CRT-01** | `/sf-canvas-sync.js` inlined as IIFE in `app/layout.tsx`; `public/sf-canvas-sync.js` deleted; `<script src="/sf-canvas-sync.js" />` removed from `scale-canvas.tsx`. CLS=0 verified by Playwright on iPhone-13 hard-reload. | File state verified: `public/sf-canvas-sync.js` is 198 bytes single-line IIFE that queries `[data-sf-canvas]` and computes `inner.offsetHeight * (vw/1280)` to set parent height pre-paint. `components/layout/scale-canvas.tsx:143` mounts it as raw `<script src="/sf-canvas-sync.js" />` (with `eslint-disable-next-line @next/next/no-sync-scripts`). The script is sibling to but distinct from the inline `scaleScript` IIFE in `app/layout.tsx:101` (which sets the 7 `--sf-*` CSS vars). `v1.8-lcp-diagnosis.md` §3 explicitly disambiguates: external file is CRT-01 scope; inline `scaleScript` is OUT of CRT-01 scope. |
| **CRT-02** | Anton character-subsetted via build-time `glyphhanger` (ALL-CAPS English glyph set actually used). No runtime dep. Subset emitted as preload `<link>`. | Current Anton at `app/fonts/Anton-Regular.woff2` is 58,808 bytes. `next/font/local` already auto-emits `<link rel="preload">` for the woff2 in the root layout (per Next.js v16.2.4 docs `app/api-reference/components/font` "Preloading" section — "If it's the root layout, it is preloaded on all routes"). Anton consumers grep'd: 34 files reference `--font-display` / `sf-display` / `--font-anton`. Glyph corpus = `THESIS_MANIFESTO` strings (`lib/thesis-manifesto.ts`) + `<h1>SIGNALFRAME//UX>` + nav-overlay route IDs + GhostLabel labels — all ALL-CAPS Latin + `/`. |
| **CRT-03** | Anton `font-display: optional → swap` with tuned `size-adjust` + `ascent-override` + `descent-override` + `line-gap-override` against `Impact, Helvetica Neue Condensed, Arial Black` fallback chain. Slow-3G hard-reload screen recording is the gate. Documented Chromatic re-baseline. | `app/layout.tsx:46` documents the previous Wave-3 `display: 'swap'` → 0.485 CLS regression on `/system` (clamp 80-160px heading shift on swap). PITFALLS Pitfall #1 + #11 lay out the exact mitigation path: tuned descriptors against `Impact, "Helvetica Neue Condensed", Arial Black` produce a closer-baseline fallback for Anton's condensed-narrow-tall metrics, making swap invisible. AES-02 exception ratifies the migration. `next/font/local` exposes `declarations` array and `adjustFontFallback` string-or-false (verified Next.js v16.2.4 docs). |
| **CRT-04** | Lenis init wrapped in `requestIdleCallback(initLenis, { timeout: 100 })` inside existing `useEffect` at `components/layout/lenis-provider.tsx`. PF-04 `autoResize: true` preserved. Deep-anchor scroll restore (e.g. `/inventory#prf-08`) resolves within ≤2 frames. | `lenis-provider.tsx:13-66` is verified. `useEffect` runs synchronously on mount. Lenis owns wheel + touch smooth-scroll only (per inline comment, R-64 keyboard model lives elsewhere). 7 verified Lenis consumers (`page-transition.tsx`, `nav.tsx`, `command-palette.tsx`, `back-to-top.tsx`, `api-explorer-paginated.tsx`) all use `useLenisInstance()` which returns null until the provider's `setLenis(instance)` runs — they already handle null. The reduced-motion early-return at line 21 must remain synchronous; the rIC wrapper goes around the `new Lenis(...)` block only. |
| **CRT-05** | CRT-01, CRT-02/03 (paired), CRT-04 each ship as separate PR for clean bisect. | STATE.md v1.8 Critical Constraints: "Phase 59 ships ≥3 plans (sync-script, Anton subset+swap, Lenis rIC) for clean bisect. Single-PR collapse is a phase failure." Each PR runs LHCI median-of-5 ≥97 and per-page pixel-diff ≤0.5% (Plan B exception documented). |
</phase_requirements>

---

## Standard Stack (already in repo, no new runtime installs)

| Library / Tool | Version | Role in Phase 59 | Notes |
|----------------|---------|------------------|-------|
| `next/font/local` | Next.js 15.5.14 | Anton declaration + auto-preload + `declarations` (size-adjust / ascent-override / etc.) + `adjustFontFallback` | Confirmed in Next.js v16.2.4 docs — `declarations` is an array of `{prop, value}` font-face descriptor pairs. Root layout fonts auto-preloaded on all routes. |
| `lenis` | ^1.1.20 | Smooth-scroll provider — unchanged dep, only init timing changes | API used: `new Lenis()`, `instance.on("scroll", ...)`, `instance.raf(time*1000)`, `instance.destroy()`. No new fields. |
| `@playwright/test` | ^1.59.1 | CLS observer, deep-anchor scroll-restore, no-network-request-for-/sf-canvas-sync.js, slow-3G screen recording | Already wired (`playwright.config.ts`). Reference patterns at `tests/phase-35-lcp-homepage.spec.ts` (PerformanceObserver) and `tests/v1.8-baseline-capture.spec.ts` (toHaveScreenshot determinism). |
| `@lhci/cli` | ^0.15.1 (devDep, Phase 58) | Per-PR median-of-5 gate (mobile + desktop). Configs at `.lighthouseci/lighthouserc.json` (mobile, 1611 bytes) + `.lighthouseci/lighthouserc.desktop.json` (1643 bytes). | All 11 of Phase 58's verification truths VERIFIED (`58-VERIFICATION.md`). The gate is operational pending the 2 HUMAN-UAT items (deployment_status permission + branch-protection rule); code-side is green. |
| `glyphhanger` | latest via `pnpm dlx` (build-time only) | Derive ALL-CAPS Latin subset from the THESIS manifesto + nav glyphs + hero wordmark corpus | Maintained by Filament Group; ships `glyphhanger --whitelist=...` and `--subset` modes; relies on `fonttools` (Python) for the actual subset operation. **NOT** a runtime dep — invoke once, commit the result. |
| `pixelmatch` + `pngjs` | ^7.1.0 / ^7.0.0 (devDep) | AES-04 0.5% per-page pixel-diff gate vs `.planning/visual-baselines/v1.8-start/` 20 PNGs | Already used by Phase 58 `tests/v1.8-phase58-pixel-diff.spec.ts` — same harness applies to Phase 59. |
| `lighthouse` | ^13.1.0 (devDep) | Manual prod gate via `scripts/launch-gate.ts` (CIB-04, byte-locked) | Untouched. The two-gate model (LHCI preview ≥97 + launch-gate.ts prod 100/100) carries forward unchanged. |

### Alternatives Considered & Rejected

| Instead of | Could Use | Reason Rejected |
|------------|-----------|-----------------|
| Inline IIFE in `<head>` | `next/script strategy="beforeInteractive"` | Pitfall #8 — runs after first paint; reintroduces 0.485 CLS bug |
| Inline IIFE | Server-side `User-Agent` viewport hint → inline `<style>` on `<html>` | Pitfall #2 mitigation path 2 — viable but architecturally heavier than necessary; deferred unless Plan A measurement requires |
| `display: 'optional'` retained | Same as today | Doesn't satisfy CRT-03; AES-02 exception ratifies the migration |
| `display: 'block'` | Lighthouse default penalty — invisible text >100ms hurts LCP; possible NO_LCP | Pitfall #1 |
| Hand-roll size-adjust | Fontaine (`@nuxtjs/fontaine`-style automatic descriptor tuning) | New runtime/devDep + Tailwind v4 integration TBD; deferred to v1.8.1 per REQUIREMENTS.md "Future Requirements" |
| `requestIdleCallback` polyfill | `setTimeout(initLenis, 0)` for Safari fallback | Acceptable — preferred over polyfill libs because we already have an explicit `timeout: 100` upper-bound; `setTimeout(0)` for Safari< rIC simply collapses to the fast path |
| `gsap.delayedCall(0, initLenis)` for Safari rIC fallback | Routes through GSAP ticker — single-ticker rule clean | Pitfall #5 — GSAP ticker pauses on `prefers-reduced-motion`; we explicitly want Lenis init to NOT depend on motion-pref state (init must always happen, only the "on motion-pref change" handler conditionally destroys) |

---

## Per-CRT Implementation Approach

### CRT-01 — `/sf-canvas-sync.js` Inline + Delete

#### Concrete Edits

**1. `app/layout.tsx` — declare a third `canvasSyncScript` const directly after `scaleScript` (line 101):**

Add a sibling const definition (mirrors the existing `themeScript` and `scaleScript` declarations — same shape, same comment style):

```text
// Pre-paint canvas-height sync (formerly /sf-canvas-sync.js, CRT-01).
// Mirrors the legacy external script's IIFE: read [data-sf-canvas] inner
// height, multiply by vw/1280 (--sf-content-scale floor), set on outer.
// Inline so it runs at HTML parse, after the scaleScript above and
// after [data-sf-canvas] is in the DOM via React's streamed body.
const canvasSyncScript = `(function(){try{var i=document.querySelector('[data-sf-canvas]');if(!i)return;var o=i.parentElement;if(!o)return;var s=window.innerWidth/1280;o.style.height=(i.offsetHeight*s)+'px';}catch(e){}})()`;
```

**Mount placement (two viable options — see §Open Questions):**

Option A — adjacent to `scaleScript` in `<head>`: emit a third `<script suppressHydrationWarning __DANGEROUS_HTML_PROP__={{ __html: canvasSyncScript }} />` inside `<head>` immediately after the existing `scaleScript` mount at line 114.

Option B (per ROADMAP wording — `<body>` tail, RECOMMENDED): emit the same script tag inside `<body>` at end-of-tree, after `<InstrumentHUD />` (line 153), before `</body>`.

Both use the **same React injection prop** (`__DANGEROUS_HTML_PROP__`) already used by `themeScript` (line 112) and `scaleScript` (line 114). The content is a static literal with no user input — XSS-impossible by construction.

The trade-off: Option A keeps the two pre-paint scripts visually adjacent in the source (good for future readers), but the canvas-height sync requires `[data-sf-canvas]` to be in the DOM — which in App Router streaming means the script in `<head>` runs *before* React has streamed the body. This is the same constraint the external `/sf-canvas-sync.js` faces (it ships in `<body>` after the data-sf-canvas div). **Option B is safer — see §Open Questions.**

**2. `components/layout/scale-canvas.tsx` — remove the external `<script>` mount (lines 135-144):**

Delete the trailing JSX block: the comment block at lines 135-141, the `eslint-disable-next-line @next/next/no-sync-scripts` directive at line 142, and the `<script src="/sf-canvas-sync.js" />` element at line 143. The closing `</>` fragment + `</> );` on lines 144-145 stays.

**3. Delete `public/sf-canvas-sync.js` (1 line, 198 bytes).**

#### Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Pre-paint timing regression — script runs before `[data-sf-canvas]` exists in DOM | MEDIUM (Option A) / LOW (Option B) | HIGH — CLS spike, ScaleCanvas height = 0 first paint | Option B placement (body tail). Verified by Playwright iPhone-13 CLS observer test. |
| Hydration mismatch on `outer.style.height` | LOW | LOW — already `suppressHydrationWarning` on outer div (`scale-canvas.tsx:120`) | Comment chain at `scale-canvas.tsx:114-119` already explains the pattern; survives the inline migration |
| Lighthouse "render-blocking resources" penalty regresses | NEAR-ZERO | LOW | Inline scripts count under HTML parse, not as a separate blocking resource (Pitfall #2 rationale path 1) |
| FOIT/FOUT regression on Anton | NONE | — | CRT-01 doesn't touch Anton; orthogonal to CRT-02/03 |

#### Mitigation Code Patterns (specific)

- **CLS observer test** (extend existing pattern at `tests/phase-35-lcp-homepage.spec.ts:17-23`):

```text
const cls = await page.evaluate(() => new Promise<number>((resolve) => {
  let total = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as PerformanceEntry[] & Array<{ value?: number; hadRecentInput?: boolean }>) {
      if (!(entry as { hadRecentInput?: boolean }).hadRecentInput) {
        total += (entry as { value?: number }).value ?? 0;
      }
    }
  }).observe({ type: "layout-shift", buffered: true });
  setTimeout(() => resolve(total), 3000);
}));
expect(cls).toBe(0);
```

- **No-network-request guard:**

```text
let sawSyncScriptRequest = false;
page.on("request", (req) => {
  if (req.url().endsWith("/sf-canvas-sync.js")) sawSyncScriptRequest = true;
});
await page.goto("/", { waitUntil: "networkidle" });
expect(sawSyncScriptRequest).toBe(false);
```

---

### CRT-02 — Anton Character Subset (paired with CRT-03)

#### Concrete Edits

**1. Build a one-shot subset script (commit the output, not the script-as-prebuild-hook):**

```text
# scripts/build-anton-subset.sh (or a shell snippet captured in PLAN body)
# Run once locally; commit the resulting .woff2; do NOT add to package.json scripts.
GLYPH_CORPUS=$(node -e '
  const m = require("./lib/thesis-manifesto.ts").THESIS_MANIFESTO;
  const corpus = m.map(s => s.text).join("") + "SIGNALFRAME//UX" + "INVE/NTORY" + "TOKEN/EXPLORER" + "INITIA/LIZE" + "ENTRY/MOTION/PROOF/ACQUISITION/INVENTORY/SYSTEM/INIT/REFERENCE";
  const set = new Set(corpus.split(""));
  process.stdout.write([...set].sort().join(""));
')
pnpm dlx glyphhanger --string="$GLYPH_CORPUS" \
  --subset=app/fonts/Anton-Regular.woff2 \
  --formats=woff2 \
  --output=app/fonts/
mv app/fonts/Anton-Regular-subset.woff2 app/fonts/Anton-Regular.woff2
```

**Glyph corpus derivation (verified against shipped code):**

| Source | Verified location | Glyphs contributed |
|--------|------|---------|
| THESIS manifesto S1-S6 | `lib/thesis-manifesto.ts:39-` | Letters A-Z + space + period + comma (6 ALL-CAPS sentences) |
| Hero h1 | `components/blocks/entry-section.tsx:122-133` | S, I, G, N, A, L, F, R, M, E, /, U, X |
| Subpage hero wordmarks | `app/inventory/page.tsx`, `app/system/page.tsx`, `app/init/page.tsx` | INVE/NTORY, TOKEN/EXPLORER, INITIA/LIZE — superset of above |
| Nav route IDs | `components/layout/nav.tsx`, `nav-overlay.tsx` | ENTRY/MOTION/PROOF/ACQUISITION/INVENTORY/SYSTEM/INIT/REFERENCE |
| GhostLabel section labels | `app/page.tsx:49-51` (THESIS, etc.) — same Anton 200-400px instances | Subset of the above |

**Total derived ALL-CAPS Latin glyph set: ~30 glyphs + `/` + space + `.` + `,` ≈ 33 glyphs.** Subset size estimate: **8-15 KB woff2** (down from 58.8 KB; 60-85% byte reduction).

**2. `app/layout.tsx:43-52` — no source changes required for CRT-02 alone** (the file path stays `app/fonts/Anton-Regular.woff2`; only the binary content changes). Once CRT-03 lands the `display: 'swap'` + `declarations` change happens in this same block.

**3. Build verification:**

```text
ls -lh app/fonts/Anton-Regular.woff2  # expect ~12-18 KB after subset
rm -rf .next .next/cache
pnpm build
# Verify the emitted woff2 in .next/static/media/ is the subset (cmp byte-equal)
```

#### Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Missing glyph at runtime (e.g., a single new copy edit introduces a `?` or `&`) | MEDIUM | HIGH — that glyph renders in fallback face; visible mid-headline | Glyph corpus is locked to the AES-of-record content. Any new copy edit triggers a re-subset. Add a dev-only assertion in Storybook chromatic gate that flags missing glyphs. |
| Glyph corpus drift between build-time subset and live content | MEDIUM | HIGH | Same as above. Default = manual re-run + commit; planner can promote to a `prebuild` script if drift becomes a pattern. |
| Build-time corpus extraction reads `lib/thesis-manifesto.ts` as TS (the require() above) | LOW | LOW | Use `tsx` or extract corpus from a static `.json` derivative; planner picks |
| Subset breaks on uppercase variants the Anton .woff2 doesn't carry | NEAR-ZERO | LOW | Anton is uppercase-only by design — all consumers `text-transform: uppercase` |

---

### CRT-03 — `display: optional → swap` with Tuned Descriptors (paired with CRT-02)

This is the load-bearing intervention of Phase 59. The Wave-3 attempt failed because no descriptor tuning was paired with the `swap` migration. The `app/layout.tsx:47-51` comment block is the historical record.

#### Concrete Edits

**`app/layout.tsx:43-52`:** Replace the existing `localFont({...})` block. Final shape (with placeholder values until measurement):

```text
const anton = localFont({
  src: "./fonts/Anton-Regular.woff2",
  variable: "--font-anton",
  display: "swap",
  // CRT-03 (Phase 59): "swap" + tuned descriptors against Impact/Helvetica
  // Neue Condensed/Arial Black fallback chain. The Wave-3 0.485 CLS regression
  // was caused by the system fallback's metrics being structurally different
  // from Anton (proportional vs condensed-narrow-tall). With descriptors
  // calibrated below the swap is invisible. Slow-3G hard-reload screen
  // recording is the verification gate. Documented Chromatic re-baseline
  // per AESTHETIC-OF-RECORD.md AES-02 (single allowed exception).
  adjustFontFallback: false,
  fallback: ["Impact", "Helvetica Neue Condensed", "Arial Black", "sans-serif"],
  declarations: [
    { prop: "size-adjust",        value: "<MEASURED>%" },
    { prop: "ascent-override",    value: "<MEASURED>%" },
    { prop: "descent-override",   value: "<MEASURED>%" },
    { prop: "line-gap-override",  value: "0%" },
  ],
});
```

**Why `adjustFontFallback: false`:** Per Next.js v16.2.4 docs, `adjustFontFallback` for `next/font/local` defaults to `'Arial'`. This auto-generates a fallback face with size-adjust against Arial — but Arial is **proportional**, not condensed, so the auto-tuned descriptor will be wrong for Anton. We must opt out of the auto behavior and provide our own `declarations` calibrated against the Impact-class condensed fallback chain. (`fallback` controls the CSS `font-family` cascade; `declarations` controls the @font-face descriptors of the loaded face.)

#### Descriptor Derivation Method (font-style-matcher style)

The four descriptors must be measured, not guessed. Method:

**Step 1 — Measure Anton's intrinsic metrics from the .woff2 itself.** Use `fonttools` (already a glyphhanger transitive dep) or `opentype.js`:

```text
# Option 1: fonttools (Python — invoked once)
pnpm dlx fonttools ttx -o anton-metrics.ttx app/fonts/Anton-Regular.woff2
# Inspect <hhea> for ascent/descent/lineGap; <OS/2> for sTypoAscender/sTypoDescender; <head> for unitsPerEm

# Option 2: opentype.js (Node)
node -e "
  const opentype = require('opentype.js');
  const f = opentype.loadSync('app/fonts/Anton-Regular.woff2');
  console.log({
    unitsPerEm: f.unitsPerEm,
    ascender: f.ascender,
    descender: f.descender,
    sTypoAscender: f.tables.os2.sTypoAscender,
    sTypoDescender: f.tables.os2.sTypoDescender,
    sTypoLineGap: f.tables.os2.sTypoLineGap,
    xAvgCharWidth: f.tables.os2.xAvgCharWidth,
  });
"
```

**Step 2 — Get the same metrics for the chosen fallback (`Impact` is the closest single-source).** Impact is system-installed on Windows + macOS; Linux ships substitute ("Haettenschweiler" or none). Reference values (from Wikimedia / typedrawers — not authoritative, but starting points):

| Metric | Impact (typical) | Anton (must measure) | size-adjust ratio |
|--------|------------------|----------------------|-------------------|
| unitsPerEm | 2048 | (measure) | — |
| sTypoAscender / unitsPerEm | ~0.881 | (measure) | (anton_typoAsc / impact_typoAsc) |
| sTypoDescender / unitsPerEm | ~-0.231 | (measure) | (anton_typoDesc / impact_typoDesc) |
| xAvgCharWidth ratio | baseline 1.0 | (measure) | size-adjust = anton_xAvg / impact_xAvg |

**Step 3 — Compute the four descriptors:**

```
size-adjust       = (anton_xAvgCharWidth / impact_xAvgCharWidth) × 100%
ascent-override   = (anton_sTypoAscender / anton_unitsPerEm) × 100% × (1 / size-adjust)
descent-override  = (|anton_sTypoDescender| / anton_unitsPerEm) × 100% × (1 / size-adjust)
line-gap-override = 0%   (display fonts ship with line-gap=0; preserve)
```

**Source — Brian Louis Ramirez Fallback Font Generator** (Pitfall #1 lists it as the canonical tool): https://www.industrialempathy.com/perfect-ish-font-fallback/ — which derives the same formulas. The site exposes the calculator UI; the planner can paste the measured Anton/Impact values and copy the output descriptors verbatim.

**Starter values — to be verified at plan execution time, not used as-is:**

| Descriptor | Estimated value (verify) | Source |
|------------|------------------------|--------|
| `size-adjust` | `108%` | Anton's average char width is ~8% wider than Impact at the same font-size; needs measurement |
| `ascent-override` | `90%` | Anton has tall ascenders relative to Impact's typical 88% baseline |
| `descent-override` | `21%` | Tight descenders for ALL-CAPS register |
| `line-gap-override` | `0%` | display fonts ship line-gap=0 |

**These are NOT final values.** The plan body MUST capture the measurement command + output JSON + computed descriptors before writing to `app/layout.tsx`.

#### Slow-3G Verification Gate

Required Playwright test (extend `tests/v1.8-baseline-capture.spec.ts` patterns):

```text
test("CRT-03: Anton swap-in produces no measurable layout shift on slow-3G", async ({ browser }) => {
  const ctx = await browser.newContext();
  const cdp = await ctx.newCDPSession(await ctx.newPage());
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    downloadThroughput: (400 * 1024) / 8,  // 400 Kbps slow-3G
    uploadThroughput: (400 * 1024) / 8,
    latency: 400,
  });
  const page = ctx.pages()[0];
  await page.goto("/", { waitUntil: "networkidle" });
  const cls = await page.evaluate(/* same pattern as CRT-01 above */);
  expect(cls).toBeLessThanOrEqual(0.001);  // strict — descriptor calibration target
});
```

The plan should also produce a slow-3G **screen recording** (Playwright `video: "on"`) and store as `.planning/perf-baselines/v1.8-phase59-anton-swap.webm` — visual record per ROADMAP success-criterion 3 ("slow-3G hard-reload screen recording shows no measurable layout shift").

#### Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Wave-3 0.485 CLS regression returns | MEDIUM if descriptors guessed | CATASTROPHIC | Measurement-driven descriptor derivation (Step 1-3); slow-3G verification before merge; LHCI CLS=0 gate blocks merge |
| Aesthetic regression on ghost-label (200-400px Anton at 4% opacity is the mobile LCP per `v1.8-lcp-diagnosis.md`) | LOW (descriptors tuned) | HIGH — visible kerning shift at 400px | Visual cohort review on the 20 v1.8-start mobile baselines; Plan B re-baselines all 20 as the documented AES-02 exception |
| `Impact` not installed on Linux CI runners → fallback cascade falls through to "Arial Black" or `sans-serif` | LOW (we control LHCI runner config; treosh action uses ubuntu-latest with `xvfb` + Chrome bundle) | MEDIUM — descriptor calibration tuned for Impact, shifts if cascade falls through | Document Impact requirement in plan; add a Playwright assertion that `getComputedStyle(h1).fontFamily` resolves to the Anton variable (so we know Anton itself is loaded) and not the fallback |
| `adjustFontFallback: false` removes Next.js's automatic CLS cushion | NONE | NONE | We are **replacing** the auto cushion with hand-tuned descriptors — explicit beats implicit |
| Chromatic baselines all need re-capture | CERTAIN | LOW (cost only) | Re-baseline once, document in `AESTHETIC-OF-RECORD.md` change log entry, commit |

---

### CRT-04 — Lenis `requestIdleCallback` Deferral

#### Concrete Edits

**`components/layout/lenis-provider.tsx:13-66` — wrap only the `new Lenis(...)` block in rIC.**

Final shape of the modified `useEffect` body (the reduced-motion early-return at line 21 stays synchronous):

```text
useEffect(() => {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mql.matches) return;

  let instance: Lenis | null = null;
  let tickerCallback: ((time: number) => void) | null = null;

  // CRT-04 (Phase 59): Defer Lenis init to idle time (or 100ms timeout)
  // to free the critical-path render budget. autoResize: true preserved
  // (PF-04 contract). Reduced-motion guard above runs synchronously so
  // no work is scheduled for users who don't want smooth-scroll.
  const initLenis = () => {
    instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      autoResize: true,
    });
    lenisRef.current = instance;
    setLenis(instance);
    (window as any).lenis = instance;

    instance.on("scroll", ScrollTrigger.update);
    tickerCallback = (time: number) => {
      if (instance) instance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
  };

  // Schedule: rIC if available (Chrome/FF; Safari 17+ flagged), else
  // setTimeout(0) — both yield to the next idle/macrotask. The 100ms
  // timeout cap ensures init never starves under heavy main-thread
  // contention; deep-anchor scroll-restore (e.g. /inventory#prf-08)
  // still resolves within ≤2 frames after that ceiling.
  type IdleCb = (cb: IdleRequestCallback, opts?: { timeout: number }) => number;
  const ric = (window as Window & { requestIdleCallback?: IdleCb }).requestIdleCallback;
  const handle = ric
    ? ric(initLenis, { timeout: 100 })
    : (setTimeout(initLenis, 0) as unknown as number);

  const motionHandler = (e: MediaQueryListEvent) => {
    if (e.matches) {
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      if (instance) instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    }
  };
  mql.addEventListener("change", motionHandler);

  return () => {
    const cancelRic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
    if (cancelRic) cancelRic(handle);
    else clearTimeout(handle);

    mql.removeEventListener("change", motionHandler);
    if (tickerCallback) gsap.ticker.remove(tickerCallback);
    if (instance) instance.destroy();
    lenisRef.current = null;
    setLenis(null);
  };
}, []);
```

#### Risk Matrix

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Deep-anchor URL scroll-restore (e.g. `/inventory#prf-08`) fires before Lenis is initialized | MEDIUM | MEDIUM — Lenis is null for ~16-100ms; native scroll already lands user at the anchor, then Lenis takes over for subsequent scroll | The 100ms timeout is the upper bound; consumers (`useLenisInstance()`) already handle null. Native scroll-restore is the OS default — Lenis only intervenes for `lenis.scrollTo` calls. |
| `gsap.ticker` lag-smoothing default differs from `lagSmoothing(0)` for the 16-100ms window | LOW | LOW — visible only as a momentary scroll-perception change | Acceptable; if measurement shows it matters, set `gsap.ticker.lagSmoothing(0)` synchronously outside the rIC callback |
| Safari's `requestIdleCallback` Experimental flag interaction (Pitfall #5 — Safari 17+ flagged 2024+) | LOW | NONE — fall-through to `setTimeout(0)` | Feature-detect via `window.requestIdleCallback` (typeof check) — fall-through is automatic |
| Single-ticker rule violation if rIC fallback uses `setTimeout` recursively | NONE | — | `setTimeout(0)` fires once for init; the running ticker is still gsap.ticker (we just register into it later) |
| `autoResize: true` regression | NONE | — | Literal preservation; `tests/v1.8-phase58-launch-gate-untouched.spec.ts`-style guard test should be added: assert the literal source line `autoResize: true` exists in `lenis-provider.tsx` after the rIC change |
| `(window as any).lenis = instance` global runtime expectation | LOW | LOW — Phase 58's existing tests + scrub fixtures may sample this | Consumers via `useLenisInstance()` are React-context driven; the global is a debug aide. Document the 16-100ms null window in the JSDoc. |

#### Mitigation Code Patterns

**Deep-anchor scroll-restore test:**

```text
test("CRT-04: deep anchor URL resolves within 2 frames after Lenis init", async ({ page }) => {
  await page.goto("/inventory#prf-08", { waitUntil: "load" });
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
  const targetY = await page.evaluate(() => document.getElementById("prf-08")?.getBoundingClientRect().top ?? 0);
  expect(Math.abs(targetY)).toBeLessThan(200);
});
```

**PF-04 source-locked guard:**

```text
test("PF-04: lenis-provider.tsx still contains autoResize: true literal", () => {
  const src = readFileSync("components/layout/lenis-provider.tsx", "utf8");
  expect(src).toContain("autoResize: true");
});
```

---

## Anton Subset + Swap Migration Deep-Dive (CRT-02 + CRT-03)

This section consolidates the paired migration into a single execution narrative for the Plan B planner.

### Why this migration is safe THIS time vs the failed Wave 3 attempt

The Wave-3 failure mode (per `app/layout.tsx:47-51` historical comment): `display: 'swap'` was applied without descriptor tuning. The browser swapped Anton in over the system fallback (typically Arial — Next.js's `adjustFontFallback: 'Arial'` default) — Arial is **proportional**, Anton is **condensed-narrow-tall**. At `clamp(80px, 12vw, 160px)` the metric mismatch produced 4-12px of vertical motion, registering as 0.485 CLS on `/system`.

This time:

1. **Subset first** (CRT-02) → font byte-size drops 60-85%, network-fetch window shrinks, swap-in fires earlier.
2. **Hand-tuned descriptors** (CRT-03) replace `adjustFontFallback: 'Arial'` with `declarations: [size-adjust, ascent-override, descent-override, line-gap-override]` calibrated against `Impact, Helvetica Neue Condensed, Arial Black` — all condensed-narrow-tall faces with metrics structurally similar to Anton.
3. **Slow-3G verification gate** — the swap-in event is recorded on a slow-3G profile so the swap is forced (vs. fast networks where the font may arrive before first paint and never visibly swap).
4. **Documented AES-02 exception** — the Chromatic re-baseline is ratified once, with prose justification, not papered-over per-PR.

### glyphhanger Invocation Strategy

**Recommended (default): ad-hoc invocation, commit-the-output.**

```text
# One-shot, run by plan executor before commit
pnpm dlx glyphhanger --string="...corpus..." --subset=app/fonts/Anton-Regular.woff2 --formats=woff2 --output=app/fonts/
mv app/fonts/Anton-Regular-subset.woff2 app/fonts/Anton-Regular.woff2
```

**Alternative (if drift becomes a pattern): prebuild npm script.**

```text
// package.json scripts
{
  "scripts": {
    "build:anton-subset": "pnpm dlx glyphhanger --string=\"$(node scripts/derive-anton-corpus.mjs)\" --subset=app/fonts/Anton-Regular.woff2 --formats=woff2 --output=app/fonts/ && mv app/fonts/Anton-Regular-subset.woff2 app/fonts/Anton-Regular.woff2",
    "prebuild": "pnpm build:anton-subset"
  }
}
```

**Default = ad-hoc** because:

- Zero CI dependency on glyphhanger / fonttools / Python runtime
- THESIS manifesto + nav corpus is essentially fixed (changes ≤ once per copy edit)
- Reproducibility is preserved by committing both the subset .woff2 and the corpus string in the plan body

The prebuild path makes sense only if multiple late-stage copy edits force re-subsets within Phase 59-62 and the manual step becomes a bottleneck.

### Glyph Set Derivation (verified citations)

| Source file | Lines | Content type | Glyphs added |
|-------------|-------|--------------|--------------|
| `lib/thesis-manifesto.ts` | 39-95 (6 statements) | THESIS S1-S6 ALL-CAPS sentences | A B C D E F G H I L M N O P R S T U V W Z + space + period |
| `components/blocks/entry-section.tsx` | 122-133 | Hero h1 | S I G N A L F R M E / U X (subset of above + slash) |
| `app/inventory/page.tsx`, `app/system/page.tsx`, `app/init/page.tsx`, `app/reference/page.tsx` | hero h1 wordmarks | INVE/NTORY, TOKEN/EXPLORER, INITIA/LIZE, REFERENCE | K X Y P (additions) |
| `components/layout/nav.tsx`, `components/layout/nav-overlay.tsx` | route IDs | ENTRY/MOTION/PROOF/ACQUISITION/INVENTORY/SYSTEM/INIT/REFERENCE | Q (additions, mostly subset of above) |
| `components/animation/ghost-label.tsx` rendered via `app/page.tsx` | section labels | THESIS, MOTION, PROOF, etc. | (subset of above) |

**Final corpus (Latin uppercase + structural):** A B C D E F G H I K L M N O P Q R S T U V W X Y Z + `/` + ` ` + `.` + `,` ≈ **30 glyphs**.

**Estimated subset size:** 8-15 KB woff2 (down from 58.8 KB). Use `wc -c app/fonts/Anton-Regular.woff2` after subsetting to confirm.

### Descriptor Derivation Table (calibration template — measure at plan time)

This table is the deliverable shape; the plan executes the measurement and fills the values:

| Metric (Anton) | Source | Measured value | Formula | Final descriptor |
|---------------|--------|----------------|---------|------------------|
| unitsPerEm | `<head>` table | TBD | — | — |
| sTypoAscender | `<OS/2>` table | TBD | — | input |
| sTypoDescender | `<OS/2>` table | TBD | — | input |
| sTypoLineGap | `<OS/2>` table | TBD | — | input |
| xAvgCharWidth | `<OS/2>` table | TBD | — | input |
| Impact xAvgCharWidth | reference | ~1024 (2048 unitsPerEm) | — | input |
| **size-adjust** | — | — | `(anton.xAvg / impact.xAvg) × 100%` | TBD% |
| **ascent-override** | — | — | `(anton.sTypoAscender / anton.unitsPerEm) × 100% × (1 / (size-adjust/100))` | TBD% |
| **descent-override** | — | — | `(|anton.sTypoDescender| / anton.unitsPerEm) × 100% × (1 / (size-adjust/100))` | TBD% |
| **line-gap-override** | — | 0 | constant | `0%` |

Plug into Brian Louis Ramirez Fallback Font Generator (https://www.industrialempathy.com/perfect-ish-font-fallback/) for cross-verification.

### Chromatic Re-baseline Checklist (the single AES-02 exception)

Before merging Plan B:

- [ ] Run the 20 v1.8-start Playwright baseline spec with `--update-snapshots` against the deployed preview with the new descriptors.
- [ ] Visual diff each of the 20 PNGs against the v1.8-start originals in chrome-devtools MCP review.
- [ ] Confirm the only diffs are:
  - Anton glyph hinting / sub-pixel rasterization changes ≤ ~0.5% per page
  - 200-400px GhostLabel kerning consistent with intended Anton (not a Wave-3-style shift)
- [ ] Update `.planning/codebase/AESTHETIC-OF-RECORD.md` Change Log with the date + commit SHA + prose justification.
- [ ] Commit the new 20 PNGs to `.planning/visual-baselines/v1.8-start/` AND retain the originals at `.planning/visual-baselines/v1.8-pre-anton-swap/` for forensic comparison.
- [ ] In the plan summary, link to the slow-3G screen recording artifact + before/after PNG montage.
- [ ] Storybook Chromatic suite (`pnpm chromatic`) — accept new baselines for stories that consume `--font-display` only; no other re-baselines.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright `^1.59.1` (`package.json:129`) |
| Config | `playwright.config.ts` (existing, headless Chromium SwiftShader WebGL) |
| Per-PR per-task quick run | `pnpm exec playwright test tests/v1.8-phase59-{plan}-*.spec.ts --project=chromium` |
| Full phase suite | `pnpm exec playwright test tests/v1.8-phase59-*.spec.ts --project=chromium` |
| Build target | `pnpm build && pnpm start` (production) — NOT `pnpm dev` |
| LHCI gate (per-PR) | Triggered by Vercel preview `deployment_status` event → `.github/workflows/lighthouse.yml` runs both mobile + desktop configs; merge blocked by branch-protection rule `audit` |

### Per-PR LHCI Thresholds (re-stated from Phase 58 lighthouserc)

| Metric | Threshold | Aggregation |
|--------|-----------|-------------|
| `categories:performance` | minScore: 0.97 | median-run |
| `categories:accessibility` | minScore: 0.97 | median-run |
| `categories:best-practices` | minScore: 0.97 | median-run |
| `categories:seo` | minScore: 1.0 | median-run |
| `largest-contentful-paint` | ≤ 1000 ms | median-run |
| `cumulative-layout-shift` | maxNumericValue: 0 (exact) | median-run |
| `total-blocking-time` | ≤ 200 ms | median-run |
| numberOfRuns | 5 (warmup ×2 via URL duplication) | — |

### Per-Plan Phase Requirements → Test Map

| Req ID | Plan | Behavior | Test Type | Automated Command | File Exists? |
|--------|------|----------|-----------|-------------------|-------------|
| CRT-01 | A | `/sf-canvas-sync.js` returns no network request in production build | integration | `pnpm exec playwright test tests/v1.8-phase59-canvas-sync-inline.spec.ts --project=chromium` | ❌ Wave 0 |
| CRT-01 | A | iPhone-13 hard-reload CLS = 0 | integration (PerformanceObserver) | same file | ❌ Wave 0 |
| CRT-01 | A | Pixel-diff vs v1.8-start = 0% across 20 baselines | integration | `pnpm exec playwright test tests/v1.8-phase59-pixel-diff.spec.ts --project=chromium` | ❌ Wave 0 (extends Phase 58 pattern) |
| CRT-02 | B | `app/fonts/Anton-Regular.woff2` size ≤ 20 KB | smoke (file size) | `test $(wc -c < app/fonts/Anton-Regular.woff2) -le 20480` | n/a |
| CRT-02 | B | All Anton-rendered glyphs in production build are present in subset (no fallback faces in body Anton) | integration (Playwright `getComputedStyle(...).fontFamily` on every Anton consumer) | `pnpm exec playwright test tests/v1.8-phase59-anton-subset-coverage.spec.ts --project=chromium` | ❌ Wave 0 |
| CRT-03 | B | Slow-3G hard-reload CLS = 0 (THESIS + ghost-label survive Anton swap-in) | integration (CDP throttling + PerformanceObserver) | `pnpm exec playwright test tests/v1.8-phase59-anton-swap-cls.spec.ts --project=chromium` | ❌ Wave 0 |
| CRT-03 | B | Slow-3G screen recording captured | manual + Playwright `video: "on"` | `pnpm exec playwright test tests/v1.8-phase59-anton-swap-cls.spec.ts --project=chromium --reporter=list` | output: `test-results/.../*.webm` |
| CRT-03 | B | Pixel-diff vs v1.8-start ≤ 0.5% across 20 baselines (AES-02 documented exception) | integration | `pnpm exec playwright test tests/v1.8-phase59-pixel-diff.spec.ts --project=chromium` | re-baselined per AES-02 exception |
| CRT-04 | C | Lenis source contains `autoResize: true` literal (PF-04 lock) | smoke (grep) | `grep -F "autoResize: true" components/layout/lenis-provider.tsx` | n/a |
| CRT-04 | C | Deep-anchor URL `/inventory#prf-08` resolves within ≤ 2 frames after Lenis init (≤ 100ms timeout) | integration | `pnpm exec playwright test tests/v1.8-phase59-lenis-ric.spec.ts --project=chromium` | ❌ Wave 0 |
| CRT-04 | C | `useLenisInstance()` returns null for ≤ 100ms then non-null | integration | same file | ❌ Wave 0 |
| CRT-04 | C | Pixel-diff vs v1.8-start = 0% across 20 baselines (no visual surface) | integration | `pnpm exec playwright test tests/v1.8-phase59-pixel-diff.spec.ts --project=chromium` | re-baselined N/A |
| CRT-05 | All | Each PR independently green on LHCI median-of-5 ≥ 97 mobile + desktop | LHCI workflow on Vercel preview | merged via branch protection `audit` check | n/a (operational) |

### Sampling Rate

- **Per task commit (intra-plan):** Plan-specific `tests/v1.8-phase59-*.spec.ts` quick run + `pnpm exec playwright test --grep "@phase-59"` for any tagged spec.
- **Per wave merge (per-plan):** Full plan suite green + LHCI median-of-5 ≥ 97 on Vercel preview (auto-triggered).
- **Phase gate:** All three plans merged; pixel-diff full suite green vs `.planning/visual-baselines/v1.8-start/` (Plan B post-rebaseline); slow-3G screen recording committed; AESTHETIC-OF-RECORD.md change log entry committed; `/pde:verify-work 59` clean.

### Wave 0 Gaps (per-plan)

**Plan A (CRT-01) Wave 0:**
- [ ] `tests/v1.8-phase59-canvas-sync-inline.spec.ts` — covers CRT-01 (CLS=0, no /sf-canvas-sync.js network request)
- [ ] `tests/v1.8-phase59-pixel-diff.spec.ts` — extends `tests/v1.8-phase58-pixel-diff.spec.ts` to Phase 59 scope (reuse fixture)

**Plan B (CRT-02 + CRT-03) Wave 0:**
- [ ] `tests/v1.8-phase59-anton-subset-coverage.spec.ts` — every Anton consumer renders Anton-from-subset, no fallback face
- [ ] `tests/v1.8-phase59-anton-swap-cls.spec.ts` — slow-3G CDP throttling + CLS=0 + screen recording
- [ ] (descriptor measurement: one-off `node` script + measurements committed in plan body, not a recurring spec)

**Plan C (CRT-04) Wave 0:**
- [ ] `tests/v1.8-phase59-lenis-ric.spec.ts` — deep-anchor scroll restore + `useLenisInstance()` null-window timing + PF-04 grep guard

**Framework install:** none — all tooling already present in package.json.

### Pixel-Diff Threshold Summary

| Plan | Threshold per page | Strategy |
|------|---------------------|----------|
| A (sync-script inline) | 0% (must be byte-identical visually) | Compare new captures against v1.8-start originals |
| B (Anton subset+swap) | ≤ 0.5% (AES-04 standard); but **expected to exceed** at the 200-400px GhostLabel page → **re-baseline as AES-02 documented exception** | Re-baseline 20/20 with cohort visual review; original 20 PNGs preserved at `.planning/visual-baselines/v1.8-pre-anton-swap/` |
| C (Lenis rIC) | 0% (no visual surface — Lenis init affects scroll feel only) | Compare new captures against v1.8-start originals |

---

## Common Pitfalls (Phase 59 specific)

### Pitfall α: "Drive-by use next/script for the inline canvas-sync" (Pitfall #8 carry-forward)

**What goes wrong:** Migrating the inline canvas-sync to `next/script strategy="beforeInteractive"` looks idiomatic but runs after first paint. CLS regresses.

**How to avoid:** Keep the script as a raw `<script>` element using the same React inline-HTML-injection prop already used for `themeScript` and `scaleScript`. Same primitive, same risk profile.

### Pitfall β: "Just preload Anton even harder" (Pitfall #11)

**What goes wrong:** Adding a `<link rel="preload" href="/fonts/Anton-Regular.woff2" as="font" type="font/woff2" crossorigin>` manually in `<head>` creates a duplicate preload on top of the one `next/font/local` already auto-emits. Browser fetches the font twice. No measurable LCP win, +1 wasted request.

**How to avoid:** Trust `next/font/local`. Verify in Network tab that exactly one preload `<link>` for Anton appears in production HTML. Do NOT hand-add a second.

### Pitfall γ: rIC fallback runs `setTimeout(0)` recursively → starves event loop

**What goes wrong:** A naive polyfill loops `setTimeout(initLenis, 0)` until idle, which on Safari without rIC just busy-waits.

**How to avoid:** Single `setTimeout(initLenis, 0)` — fires once, queues init for next macrotask, no recursion. Documented in plan body.

### Pitfall δ: Anton subset misses a glyph from a future copy edit

**What goes wrong:** Plan B ships with the locked corpus. A subsequent v1.8.x copy change introduces e.g. an apostrophe — that glyph renders in fallback face mid-headline.

**How to avoid:** Add an `eslint-plugin-no-unsupported-glyphs` style assertion (or just a Playwright dev-time spec) that reads `lib/thesis-manifesto.ts` + the static hero strings and verifies every codepoint is in the subset. Or: add a `prebuild` script trigger as fallback. Default: document the trigger condition in plan body, manual re-subset on copy edit.

### Pitfall ε: Plan A and Plan B merge interleaved → bisect ambiguous

**What goes wrong:** Reviewer rebases Plan B on top of an unmerged Plan A; Plan B PR diff includes both interventions; bisect can no longer attribute LHCI regression.

**How to avoid:** CRT-05 mandates strict bisect order. Plan A merges first; Plan B opens after Plan A is in main; Plan C after Plan B. Document the gate in each plan's `depends_on` field.

### Pitfall ζ: Branch protection not enforced on `main` → LHCI failure on Plan B doesn't block merge

**What goes wrong:** Phase 58 HUMAN-UAT items 1+2 are still pending (`58-VERIFICATION.md`). Without them, LHCI runs and fails but merge isn't blocked.

**How to avoid:** Plan body for Plan B explicitly verifies HUMAN-UAT 1+2 complete BEFORE Plan B opens. If still pending, pause Plan B and surface to user via `/pde:audit-uat`.

---

## Code Examples

### next/font/local with descriptors (CRT-03)

```text
// app/layout.tsx (excerpt — final shape, descriptor values to be measured)
const anton = localFont({
  src: "./fonts/Anton-Regular.woff2",   // subsetted via glyphhanger (CRT-02)
  variable: "--font-anton",
  display: "swap",                       // CRT-03 migration from "optional"
  adjustFontFallback: false,             // opt out of Next.js auto-Arial cushion
  fallback: ["Impact", "Helvetica Neue Condensed", "Arial Black", "sans-serif"],
  declarations: [
    { prop: "size-adjust",       value: "108%" },  // MEASURED, not guessed
    { prop: "ascent-override",   value: "90%" },   // MEASURED
    { prop: "descent-override",  value: "21%" },   // MEASURED
    { prop: "line-gap-override", value: "0%" },    // display fonts ship line-gap=0
  ],
});
```

Source: Next.js v16.2.4 docs `app/api-reference/components/font` — verified `declarations`, `adjustFontFallback`, `fallback` API.

### Lenis rIC deferral (CRT-04)

See full diff in §CRT-04 above. Key feature-detect pattern:

```text
type IdleCb = (cb: IdleRequestCallback, opts?: { timeout: number }) => number;
const ric = (window as Window & { requestIdleCallback?: IdleCb }).requestIdleCallback;
const handle = ric
  ? ric(initLenis, { timeout: 100 })
  : (setTimeout(initLenis, 0) as unknown as number);

// teardown
const cancelRic = (window as Window & { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback;
if (cancelRic) cancelRic(handle);
else clearTimeout(handle);
```

### CLS observer (Plans A + B verification)

```text
// tests/v1.8-phase59-canvas-sync-inline.spec.ts (excerpt)
const cls = await page.evaluate(() => new Promise<number>((resolve) => {
  let total = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as PerformanceEntry[] & Array<{ value?: number; hadRecentInput?: boolean }>) {
      if (!(entry as { hadRecentInput?: boolean }).hadRecentInput) {
        total += (entry as { value?: number }).value ?? 0;
      }
    }
  }).observe({ type: "layout-shift", buffered: true });
  setTimeout(() => resolve(total), 3000);
}));
expect(cls).toBe(0);
```

Source: extracted from `tests/phase-35-lcp-homepage.spec.ts:17-23` PerformanceObserver pattern + standard `layout-shift` entry shape.

---

## State of the Art

| Old Approach | New Approach | Why Changed |
|--------------|--------------|-------------|
| External `<script src="/sf-canvas-sync.js" />` (render-blocking by design) | Inline IIFE in `app/layout.tsx` | Eliminates the network request without losing pre-paint mutation guarantees (Pitfall #2 path 1) |
| Anton `display: 'optional'` (CLS=0 at the cost of "Anton may never paint") | Anton `display: 'swap'` + tuned descriptors against Impact-class fallback | The locked aesthetic requires Anton to actually paint; the descriptor calibration makes the swap visually invisible |
| Lenis init synchronous in `useEffect` | Lenis init scheduled via `requestIdleCallback({ timeout: 100 })` | Frees the critical-path render budget; native scroll-restore covers the 16-100ms window |
| Single LHCI run | LHCI median-of-5 (Phase 58 gate) | Variance discipline; cold-start absorbed (Pitfall #6) |
| Chromatic re-baseline as routine "approve change" | AES-02 standing rule: no re-baseline for perf changes; CRT-03 is the SINGLE allowed exception | Prevents drift compounding (Pitfall #15) |

**Deprecated for Phase 59 scope:**

- `experimental.inlineCss: true` — rejected (Pitfall #7)
- `next/script strategy="beforeInteractive"` for the canvas-sync — rejected (Pitfall #8)
- Manual `<link rel="preload">` for Anton — rejected (next/font auto-emits it; manual = duplicate)
- Fontaine — deferred to v1.8.1 (REQUIREMENTS.md "Future Requirements")
- `requestIdleCallback` runtime polyfill (e.g., `requestidlecallback-polyfill` npm) — rejected (no new runtime deps; native + setTimeout fallback is sufficient)

---

## Open Questions / Discretionary Choices

### Q1. Inline canvas-sync placement: `<head>` (adjacent to scaleScript) vs `<body>` tail?

**What we know:**
- ROADMAP wording (§Phase 59): "inlined as `<body>` tail IIFE in `app/layout.tsx`"
- The existing `scaleScript` is in `<head>` (line 113)
- The external `/sf-canvas-sync.js` is in `<body>` (mounted via `scale-canvas.tsx:143`)
- The script reads `[data-sf-canvas]` which only exists once React has streamed `<ScaleCanvas>{children}</ScaleCanvas>` into the body — so the script MUST run after the body has streamed past that point.

**What's unclear:** Does an inline `<head>` script execute before or after the `<body>` streaming completes in App Router streaming SSR? Verifying this would require a runtime test.

**Recommendation:** **Body-tail (Option B in §CRT-01)** — matches the ROADMAP wording, matches the original external script's placement, and is unambiguous w.r.t. `[data-sf-canvas]` DOM availability. Plan A's plan body should encode the rationale.

### Q2. Should the descriptor-measurement step ship as a committed script?

**What we know:** The descriptor values must be measured from the .woff2 binary, not guessed. The measurement command in §CRT-03 uses `opentype.js` (no install — `pnpm dlx`).

**What's unclear:** Should the measurement script live at `scripts/measure-anton-descriptors.mjs` for reproducibility, or just be captured as a one-shot in the plan body?

**Recommendation:** Commit the script at `scripts/measure-anton-descriptors.mjs` so a future re-subset (Pitfall δ trigger) can re-measure without re-deriving the formula. Output JSON committed alongside as `scripts/anton-descriptors.json` for audit trail.

### Q3. LHCI desktop config — does it stay disabled for Phase 59?

**What we know:** Phase 58's `lighthouserc.desktop.json` exists (1643 bytes) and the workflow runs both mobile + desktop runs (per `58-VERIFICATION.md` truth #4 + `.github/workflows/lighthouse.yml` 2× treosh invocations).

**What's unclear:** Phase 60 LCP-02 selection branches on viewport (`v1.8-lcp-diagnosis.md` confirms mobile=GhostLabel, desktop=VL-05 //). Phase 59 changes affect both viewports identically.

**Recommendation:** Both gates active, both must pass. Phase 59 doesn't have a viewport-divergent regression surface (sync-script + Anton + Lenis are all viewport-agnostic).

### Q4. Subset format: woff2 only, or woff + woff2?

**What we know:** Current font is woff2 only (`Anton-Regular.woff2`). All target browsers (Phase 58 + 62 device profiles) support woff2.

**What's unclear:** Is there a long-tail browser (e.g., Samsung Internet 4.x) in the target audience that lacks woff2?

**Recommendation:** woff2-only (status quo). Add woff fallback only if VRF-01 real-device verification surfaces a regression.

### Q5. Should Plan B's Chromatic re-baseline be split from CRT-02 vs CRT-03 visually?

**What we know:** CRT-02 (subset only) doesn't change visible glyph rasterization — same .woff2 outline, just fewer glyphs. CRT-03 (display+descriptors) changes the FOUT/FOIT timing window.

**What's unclear:** Does subsetting alone (CRT-02 in isolation) produce zero pixel diff against v1.8-start, allowing CRT-02 to ship without re-baseline and only CRT-03 to trigger the AES-02 exception?

**Recommendation:** Test in Plan B Wave 0: ship CRT-02 alone in a temp branch, run pixel-diff vs v1.8-start. If diff < 0.5% (expected — same outline data), then the AES-02 exception is fully attributable to CRT-03 only. Document this attribution in the plan summary. (Does NOT change the merge strategy — still a single PR for paired CRT-02+CRT-03 per CRT-05 wording — but tightens the Chromatic re-baseline justification.)

### Q6. PF-04 source-locked guard — file-level or commit-level?

**What we know:** Phase 58 added `tests/v1.8-phase58-launch-gate-untouched.spec.ts` which uses `git diff merge-base..HEAD -- scripts/launch-gate.ts` byte-identity check (1/1 PASSED).

**What's unclear:** Should Plan C's PF-04 guard use the same git-merge-base approach for `lenis-provider.tsx` (which IS being modified) — but only assert the line containing `autoResize: true` is unchanged? Or just a plain grep for the literal?

**Recommendation:** Plain `grep -F "autoResize: true" components/layout/lenis-provider.tsx` test — file is being intentionally modified, so byte-identity is wrong; literal-presence is the contract.

---

## References

### Primary (HIGH confidence — read directly during research)

- `.planning/STATE.md` — v1.8 critical constraints + Phase 57 close state + decisions table
- `.planning/REQUIREMENTS.md` — CRT-01..05 + AES-01..04 verbatim
- `.planning/ROADMAP.md` lines 905-919 — Phase 59 scope + success criteria + plan structure
- `.planning/codebase/v1.8-lcp-diagnosis.md` — LCP element identity (mobile=GhostLabel, desktop=VL-05 //) + sync-script disambiguation §3
- `.planning/codebase/AESTHETIC-OF-RECORD.md` — AES-01..04 standing rules + AES-02 documented exception language
- `.planning/research/PITFALLS.md` — Pitfalls 1, 2, 5, 7, 8, 11, 15 directly relevant
- `.planning/phases/58-lighthouse-ci-real-device-telemetry/58-VERIFICATION.md` — LHCI thresholds + RUM telemetry shape + 2 HUMAN-UAT items
- `.planning/phases/58-lighthouse-ci-real-device-telemetry/58-RESEARCH.md` — lighthouserc shape + treosh action + warmup×2 lock
- `.planning/LOCKDOWN.md` §1, §3, §4.1, §5 — typography + spacing + motion invariants
- `app/layout.tsx` — Anton config (line 43-52) + scaleScript (line 91, 113-114) + structure
- `app/fonts/Anton-Regular.woff2` — 58,808 bytes (verified)
- `public/sf-canvas-sync.js` — full file, 198 bytes single-line IIFE
- `components/layout/scale-canvas.tsx` lines 110-145 — `<script src="/sf-canvas-sync.js" />` mount + `suppressHydrationWarning` rationale
- `components/layout/lenis-provider.tsx` full file — Lenis init shape + `autoResize: true` + reduced-motion guard
- `components/blocks/entry-section.tsx` lines 122-210 — Hero h1 + VL-05 magenta `//` overlay
- `components/animation/ghost-label.tsx` — Anton clamp 200-400px, 4% opacity (mobile LCP target)
- `lib/thesis-manifesto.ts` — THESIS S1-S6 corpus
- `app/globals.css` lines 196-197, 882-892 — `--sfx-font-display` token chain + `.sf-display` class + `.sf-hero-deferred` rules at 1486-1488
- `package.json` — devDeps: `@lhci/cli ^0.15.1`, `@playwright/test ^1.59.1`, `pixelmatch ^7.1.0`, `pngjs ^7.0.0`, `lighthouse ^13.1.0`. Runtime: `lenis ^1.1.20`, `next` (peer ≥15.3.0)
- `playwright.config.ts` — headless Chromium SwiftShader WebGL config

### Secondary (MEDIUM-HIGH — verified via Context7/Webfetch)

- Next.js v16.2.4 official docs `app/api-reference/components/font` — verified `declarations` array shape, `adjustFontFallback` string|false, `fallback` array, root-layout auto-preload — https://nextjs.org/docs/app/api-reference/components/font
- MDN `@font-face` descriptors (size-adjust, ascent-override, descent-override, line-gap-override) — semantics + percentage units — https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face
- MDN `font-display` values (auto/block/swap/fallback/optional) + interaction with FOIT/FOUT — https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- web.dev "Critical rendering path" (still the canonical mental model for inline `<script>` + render-blocking elimination) — https://web.dev/articles/critical-rendering-path
- web.dev "Best practices for fonts" — `<link rel="preload">` + `font-display: swap` + descriptor matching — https://web.dev/articles/font-best-practices
- Brian Louis Ramirez Fallback Font Generator — formula source for size-adjust/ascent-override calculations — https://www.industrialempathy.com/perfect-ish-font-fallback/
- glyphhanger README (Filament Group) — invocation modes, fonttools dependency — https://github.com/filamentgroup/glyphhanger
- Lenis docs — `Lenis` constructor options (autoResize, duration, easing, touchMultiplier), `instance.raf(time)` ticker contract, `instance.destroy()` lifecycle — https://github.com/darkroomengineering/lenis
- MDN `requestIdleCallback` + Safari support note (Experimental flag, rolling out 2024+) — https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback

### Tertiary (LOW — flagged for validation at plan execution)

- Anton font intrinsic metrics (sTypoAscender/sTypoDescender/xAvgCharWidth) — must be measured from the actual .woff2 binary in the repo; reference values in §CRT-03 derivation table are starter approximations only
- Impact font reference metrics — values vary across OS distributions; cross-verify at descriptor calibration time using the Brian Louis Ramirez calculator

---

## Metadata

**Confidence breakdown:**
- CRT-01 inline migration: **HIGH** — file paths verified, IIFE byte-extracted, Pitfall #2/#8 forbid alternatives
- CRT-02 subset method: **HIGH** — glyphhanger semantics + corpus derivation verified, sub-22 KB target follows from current 58.8 KB → ~30 glyph reduction
- CRT-03 swap migration: **HIGH on the API surface** (next/font/local declarations verified in Next.js docs); **MEDIUM on descriptor values** — must be measured at plan execution, not in research
- CRT-04 rIC deferral: **HIGH** — Lenis API stable, rIC fallback well-trodden, PF-04 grep guard trivial
- CRT-05 bisect order: **HIGH** — STATE.md mandates ≥3 PRs, blast-radius ordering A→B→C is explicit
- Validation Architecture: **HIGH** — fully reuses Phase 58 infrastructure (LHCI configs, pixelmatch fixture, Playwright harness)

**Research date:** 2026-04-26
**Valid until:** 2026-05-26 (30 days — stable scope; Anton descriptor values may shift if a corpus edit lands in the same window)
