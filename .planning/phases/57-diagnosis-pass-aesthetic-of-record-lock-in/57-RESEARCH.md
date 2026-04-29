# Phase 57: Diagnosis Pass + Aesthetic-of-Record Lock-in - Research

**Researched:** 2026-04-25
**Domain:** Performance diagnosis tooling (LCP measurement, bundle attribution, deterministic visual baselines) + aesthetic invariant codification (lock-in mode)
**Confidence:** HIGH — all four locked decisions verified against shipped code; only one MEDIUM gotcha surfaced (Anton `display: optional` interaction with LCP candidate identity).

## Summary

Phase 57 is pure documentation + baseline capture. CONTEXT.md locks four decisions: AESTHETIC-OF-RECORD.md is a thin standing-rules doc that cites LOCKDOWN.md (D-01); v1.8-lcp-diagnosis.md is strictly diagnostic with no Phase-60 ranking (D-02); Playwright captures the 20 baseline images (D-03); `@next/bundle-analyzer` writes the chunk attribution table inline in the diagnosis doc (D-04). All four locked tools are present in the repo at the expected versions: Next.js 15.5.14, `@next/bundle-analyzer ^16.2.2`, `@playwright/test ^1.59.1`, LOCKDOWN.md @ 522 lines covering R-01..R-64.

Critical execution gotchas the planner must encode into tasks: (1) `playwright.config.ts` does NOT currently disable animations or pin viewports for visual reproducibility — the baseline spec must explicitly pin viewport, set `reducedMotion: "reduce"`, and either `await` font load or use `animations: "disabled"` in `toHaveScreenshot` calls; (2) Anton currently ships `display: optional` at `app/layout.tsx:45` — on first visit Anton may not paint, which means the GhostLabel (clamp 200-400px Anton, opacity 3-5%) might NOT be the LCP candidate even though PITFALLS.md Pitfall #1 treats it as the canonical case; the homepage `<h1>SIGNALFRAME//UX</h1>` at `entry-section.tsx:124-129` is the documented LCP element per `tests/phase-35-lcp-homepage.spec.ts:14-25` and STATE.md D-08, so DGN-01 must capture **both** candidate identities under the current font-display contract; (3) `@next/bundle-analyzer` runs against webpack `next build` (project's `pnpm build` script is `next build`, NOT `next build --turbopack` — Turbopack is `dev`-only at `package.json:58`), so analyzer output is well-formed; (4) `public/sf-canvas-sync.js` exists AND is loaded as `<script src="/sf-canvas-sync.js" />` from `components/layout/scale-canvas.tsx:143` AND a separate inline `scaleScript` IIFE runs in `<head>` at `app/layout.tsx:100, 113` — the diagnosis doc must distinguish the two so Phase 59 CRT-01 doesn't conflate them.

**Primary recommendation:** Single Playwright spec at `tests/v1.8-baseline-capture.spec.ts` that loops 5 routes × 4 viewports with explicit Anton wait + reducedMotion + animations:"disabled"; one diagnosis doc that captures LCP element identity at 360 mobile + 1440 desktop with file:line evidence and lists chunk attribution as an inline markdown table; one ~150-line AESTHETIC-OF-RECORD.md that codifies AES-01..04 as standing rules + cites LOCKDOWN.md sections + lists trademark primitive paths.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**D-01 — AESTHETIC-OF-RECORD.md scope:**
- Doc structure is **standing rules + canonical token references**, not full self-contained extraction.
- Body codifies the four standing rules (AES-01 extract-from-shipped-code, AES-02 no-Chromatic-rebaseline-for-perf, AES-03 mid-milestone cohort review, AES-04 per-phase pixel-diff <=0.5%).
- Body cites — does not duplicate — the existing locked artifacts: `.planning/LOCKDOWN.md`, `app/globals.css` token block, trademark primitive component paths.
- Target length ~150 lines. LOCKDOWN.md remains the authoritative source for invariants; AESTHETIC-OF-RECORD.md is the perf-phase entry point that points downstream agents at the right slices.
- Why: prevents content drift between two documents that say similar things. Lock-in mode (`feedback_lockin_before_execute.md`) explicitly requires extraction from shipped code, not re-derivation; LOCKDOWN.md already does that.

**D-02 — Diagnosis output posture:**
- `v1.8-lcp-diagnosis.md` is **strictly diagnostic** — findings only.
- Captures: LCP element identity per viewport (mobile 360 + desktop 1440) with file:line evidence; Lighthouse trace + `PerformanceObserver({type: 'largest-contentful-paint'})` corroboration; per-chunk owner attribution table for chunks `3302`, `e9a6067a`, `74c6194b`, `7525`.
- Does NOT rank the three Phase-60 LCP-02 candidate paths (a/b/c). Ranking lives in Phase 60 plan-phase RESEARCH.md where intervention tradeoffs are properly contextualized against measurement.
- Why: keeps diagnosis decoupled from intervention thinking. Phase 60 plan-phase reads the diagnosis cold and ranks against then-current evidence (LHCI median, Phase 59 ship state, real-device divergence). Phase 57 ranking would freeze a stale recommendation.

**D-03 — Baseline screenshot tooling:**
- Use **Playwright** as the baseline capture tool for the 20 v1.8-start images.
- Already in repo (`@playwright/test ^1.59.1`, `playwright.config.ts`, existing phase-35 visual specs to model from).
- Add a baseline-capture spec that loops 5 pages × 4 viewports → emits to `.planning/visual-baselines/v1.8-start/`.
- Per-phase AES-04 pixel-diff runs through the same Playwright harness for reproducibility.
- chrome-devtools MCP is **retained** for AES-03 cohort review and ad-hoc visual verification (per `feedback_visual_verification.md`) — but is NOT the baseline-capture tool.

**D-04 — Per-chunk attribution method:**
- Use **`@next/bundle-analyzer`** (already in repo, `^16.2.2`) and write the attribution table directly into `v1.8-lcp-diagnosis.md`.
- Run `rm -rf .next && ANALYZE=true pnpm build` (BND-04 stale-chunk guard).
- Inspect the emitted HTML, extract chunk → package mapping, write the table inline.
- Phase 61 re-runs the same `ANALYZE=true pnpm build` to verify reductions; no new tooling.
- No JSON artifact, no `source-map-explorer` script, no new dep.

### Claude's Discretion
- AESTHETIC-OF-RECORD.md exact section ordering and prose voice — Claude follows LOCKDOWN.md style precedent.
- Playwright baseline spec naming (e.g., `tests/v1.8-baseline-capture.spec.ts`) and viewport descriptor exact key names — Claude picks consistent with existing phase-35-* naming.
- Whether the Phase 57 commit is split (one for AES doc, one for diagnosis, one for baselines) or single — Claude picks based on what reviews cleanly.
- Trademark primitive file-path enumeration — Claude derives from grep against shipped code (verified during this discussion).

### Deferred Ideas (OUT OF SCOPE)
- AES-04 pixel-diff threshold automation (CI gate vs human review-only) — out of Phase 57 scope; lives in Phase 58 (CIB-* infrastructure) or Phase 62 (final gate).
- Cohort review external-eye recruitment process — operational, not a Phase 57 deliverable.
- `source-map-explorer` adoption — rejected for Phase 57 (no new deps); revisitable if Phase 61 BND-01 measurement needs finer-grained per-export tracing.
- Diagnosis-doc ranking of LCP-02 candidates — explicitly deferred to Phase 60 plan-phase RESEARCH.md (D-02).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DGN-01 | LCP element identity per-viewport (mobile + desktop) via Lighthouse trace + `PerformanceObserver({type: 'largest-contentful-paint'})`. Output to `.planning/codebase/v1.8-lcp-diagnosis.md`. | PerformanceObserver pattern verified in `tests/phase-35-lcp-homepage.spec.ts:17-23`. STATE.md D-08 + carry-forward fix opacity=0.01 hazard known. Anton `display: optional` (`app/layout.tsx:45`) creates two-state LCP candidate ambiguity that the diagnosis MUST surface explicitly. Homepage h1 at `components/blocks/entry-section.tsx:124-129`; THESIS GhostLabel at `components/animation/ghost-label.tsx:18` (clamp 200-400px Anton). |
| DGN-02 | Per-chunk owner attribution for `3302`, `e9a6067a`, `74c6194b`, `7525` via `ANALYZE=true pnpm build`. | `@next/bundle-analyzer ^16.2.2` installed (`package.json:128`). `next.config.ts:4-6` wires `withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })` correctly. `pnpm build` script is `next build` (no `--turbopack`, `package.json:59`) → analyzer runs against webpack as expected. BND-04 stale-chunk guard (`rm -rf .next && ANALYZE=true pnpm build`) is the canonical incantation per STATE.md v1.8 critical constraints + PITFALLS Pitfall #13. |
| DGN-03 | Visual-of-record snapshots: 5 pages × 4 viewports = 20 images at `.planning/visual-baselines/v1.8-start/`. | Playwright `^1.59.1` installed (`package.json:129`). 5 routes confirmed against `app/` directory: `/` (`app/page.tsx`), `/system` (`app/system/page.tsx`), `/init` (`app/init/page.tsx`), `/inventory` (`app/inventory/page.tsx`), `/reference` (`app/reference/page.tsx`). 4 viewports per ROADMAP.md:883: desktop 1440x900, iPhone-13 (390×844), iPad (834×1194), mobile-360 (360×800). `.planning/visual-baselines/` does NOT yet exist — directory creation is part of phase deliverable. |
| AES-01 | `.planning/codebase/AESTHETIC-OF-RECORD.md` created at v1.8 start, extracted from shipped code (lock-in mode). Every phase reads from it; no re-derivation per-phase. | LOCKDOWN.md @ `.planning/LOCKDOWN.md` (522 lines, v1.0 LOCKED 2026-04-23) is the authoritative invariant set covering R-01..R-64 + DECIDEs D-01..D-11. AESTHETIC-OF-RECORD.md is the ~150-line standing-rules entry-point that cites: §1 trademark primitives (T1-T4); §4.1 blessed 9 spacing stops; §4.4 panel model; §5 motion + animation; §6 SIGNAL HIG. Token source-of-truth at `app/globals.css:121-386` (`:root` block) covering `--sfx-*` color/theme/duration/spacing + `--sf-*` sizing/canvas. |
| AES-02 | Standing rule: no Chromatic re-baseline for perf changes (one documented exception: Anton `optional` → `swap` in CRT-03). | Documented inside AESTHETIC-OF-RECORD.md per ROADMAP.md:879 cross-cutting note. PITFALLS Pitfall #15 establishes the anti-pattern; the rule body codifies it. |
| AES-03 | Standing rule: mid-milestone cohort review by external eye after Phase 60 against `.planning/visual-baselines/v1.8-start/`. | Documented inside AESTHETIC-OF-RECORD.md. References `feedback_visual_verification.md` for the chrome-devtools MCP surface used in cohort review. |
| AES-04 | Standing rule: pixel-diff vs v1.8-start snapshot at every phase end; >0.5% diff flagged for human review. | Documented inside AESTHETIC-OF-RECORD.md. Run mechanism = same Playwright harness as DGN-03 baseline capture (D-03). Threshold automation deferred to Phase 58/62 per CONTEXT.md deferred-ideas. |
</phase_requirements>

## Standard Stack

### Core (already in repo, no new installs)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@playwright/test` | ^1.59.1 | Deterministic visual baseline capture (20 images) + AES-04 per-phase pixel-diff harness | Already wired (`playwright.config.ts`); 30+ existing `tests/phase-*.spec.ts` files; CI-runnable; supports `toHaveScreenshot` with `animations: "disabled"` and `reducedMotion: "reduce"` natively |
| `@next/bundle-analyzer` | ^16.2.2 | Generate webpack chunk visualization HTML for DGN-02 attribution table | Already wired (`next.config.ts:4-6`); `ANALYZE=true pnpm build` is the documented invocation; emits HTML to `.next/analyze/{client,nodejs,edge}.html` |
| Next.js | 15.5.14 | Runtime — needed only as the build target for analyzer | Pinned at v1.7 (STATE.md "Stack swaps — Next.js 15.5.14 / Tailwind v4 / GSAP / Lenis / Three.js all locked at v1.7 versions") |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Browser-built-in `PerformanceObserver` | n/a | LCP element identity capture in Playwright spec | Already used at `tests/phase-35-lcp-homepage.spec.ts:17-23` — pattern: `new PerformanceObserver((list) => resolve(list.getEntries()[list.getEntries().length-1])).observe({ type: "largest-contentful-paint", buffered: true })`. The entry's `.element` field gives the DOM node; `.startTime` gives the timestamp. |
| `lighthouse` | ^13.1.0 (devDep) | Lighthouse trace generation for DGN-01 corroboration | Already installed (`package.json:149`). Invoke as `npx lighthouse http://localhost:3000 --output=json --form-factor=mobile --screenEmulation.mobile=true --emulatedFormFactor=mobile` to get trace JSON; extract `audits['largest-contentful-paint-element']` for the element selector. |
| `chrome-devtools` MCP | n/a (workflow tool) | AES-03 cohort review + ad-hoc visual verification per `feedback_visual_verification.md` | NOT for baseline capture (D-03 reserves Playwright for that); used for human-in-loop "feels different" review against committed v1.8-start images |

### Alternatives Considered

| Instead of | Could Use | Tradeoff | Why Rejected for Phase 57 |
|------------|-----------|----------|---------------------------|
| `@next/bundle-analyzer` | `source-map-explorer` | Per-export source-map attribution finer than per-chunk | New devDep; Phase 57 scope explicitly forbids new deps (CONTEXT.md D-04). Revisitable in Phase 61 if BND-01 needs finer granularity. |
| Playwright `toHaveScreenshot` | chrome-devtools MCP manual capture | MCP is interactive, friendlier for ad-hoc | Not reproducible; can't run in CI; D-03 explicitly assigns MCP to AES-03 cohort review only |
| Inline diagnosis JSON artifact | Markdown table only (D-04) | JSON is machine-parseable | Phase 61 will read the markdown table by hand to plan `optimizePackageImports` additions; no consumer requires JSON |
| Lighthouse-CI for DGN-01 | Manual `npx lighthouse` invocation | LHCI gives variance discipline (5 runs, median) | LHCI standup is Phase 58 scope (CIB-01..05); Phase 57 only needs single-pass identity capture, not statistical thresholds |

**Installation:**
No new packages. Verified present:
```bash
pnpm ls @next/bundle-analyzer @playwright/test lighthouse
# @next/bundle-analyzer 16.2.2
# @playwright/test 1.59.1
# lighthouse 13.1.0
```

## Architecture Patterns

### Recommended Phase 57 File Output Structure

```
.planning/
├── codebase/
│   ├── AESTHETIC-OF-RECORD.md       # NEW — ~150 lines, AES-01 deliverable
│   └── v1.8-lcp-diagnosis.md         # NEW — DGN-01 + DGN-02 deliverable
├── visual-baselines/
│   └── v1.8-start/                   # NEW dir
│       ├── home-desktop-1440x900.png
│       ├── home-iphone13-390x844.png
│       ├── home-ipad-834x1194.png
│       ├── home-mobile-360x800.png
│       ├── system-desktop-1440x900.png
│       ├── ... (5 routes × 4 viewports = 20 images)
│       └── reference-mobile-360x800.png
└── phases/
    └── 57-diagnosis-pass-aesthetic-of-record-lock-in/
        └── ... (already exists)
tests/
└── v1.8-baseline-capture.spec.ts     # NEW — Playwright spec for DGN-03
```

### Pattern 1: Deterministic Playwright Screenshot Spec
**What:** A single spec file that iterates 5 routes × 4 viewports and writes to `.planning/visual-baselines/v1.8-start/`.

**When to use:** DGN-03 baseline capture. Same harness reused per-phase for AES-04 diff.

**Critical determinism settings (verified by reading `playwright.config.ts`):**

`playwright.config.ts` does NOT currently set `reducedMotion`, `animations`, or per-viewport projects beyond `chromium` Desktop Chrome — the baseline spec MUST set these inline. Reference pattern:

```typescript
// Source: tests/phase-35-homepage.spec.ts:23 (test.use viewport)
//       + tests/phase-35-homepage.spec.ts:93 (page.emulateMedia reducedMotion)
//       + Playwright API for toHaveScreenshot animations option

import { test, expect } from "@playwright/test";

const ROUTES = [
  { path: "/", slug: "home" },
  { path: "/system", slug: "system" },
  { path: "/init", slug: "init" },
  { path: "/inventory", slug: "inventory" },
  { path: "/reference", slug: "reference" },
] as const;

const VIEWPORTS = [
  { name: "desktop-1440x900", width: 1440, height: 900, dsf: 1 },
  { name: "iphone13-390x844", width: 390, height: 844, dsf: 3 },
  { name: "ipad-834x1194", width: 834, height: 1194, dsf: 2 },
  { name: "mobile-360x800", width: 360, height: 800, dsf: 2 },
] as const;

test.describe("@v1.8-baseline visual-of-record capture", () => {
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      test(`${route.slug} ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(route.path, { waitUntil: "networkidle" });
        // Wait for Anton + Inter to settle — display: optional means Anton may
        // not paint, so we wait for fonts.ready resolution rather than a
        // specific font face. fonts.ready resolves regardless of optional
        // outcome.
        await page.evaluate(() => (document as Document).fonts.ready);
        // Belt-and-suspenders: idle for one rAF tick after fonts.ready so any
        // font-driven layout settles before snapshot.
        await page.waitForTimeout(100);
        await expect(page).toHaveScreenshot(
          `v1.8-start/${route.slug}-${vp.name}.png`,
          {
            fullPage: true,
            animations: "disabled", // freezes CSS + Web Animations
            caret: "hide",
            // Threshold left at default (0.2) — baselines themselves are not
            // diffed in Phase 57; pixelDiff threshold becomes relevant in
            // AES-04 per-phase runs where ratio < 0.005 (0.5%) is the gate.
          }
        );
      });
    }
  }
});
```

**Notes on the pattern:**
- `playwright.config.ts:9` has `workers: 1` and `fullyParallel: false` — sequencing is already deterministic.
- `playwright.config.ts:8` has `retries: 0` — a flaky baseline run fails fast (intentional).
- `webServer` block at `playwright.config.ts:31-36` only runs in CI; locally the dev server must be already running. **Important:** baselines should be captured against `pnpm build && pnpm start` (production output), NOT `pnpm dev` — dev double-renders inflate the ENTRY-section paint timing AND inject HMR overlay markup into the screenshot. This is the same gate already enforced in `tests/phase-35-lcp-homepage.spec.ts:7` ("Brief §PF-03 requires running against `pnpm build && pnpm start`, NOT `pnpm dev`").

### Pattern 2: PerformanceObserver LCP Element Capture (DGN-01)
**What:** Headless Chromium evaluates a PerformanceObserver inside `page.evaluate`, returns the LCP entry's element selector + startTime.

**Source pattern (already in repo):** `tests/phase-35-lcp-homepage.spec.ts:17-23` returns `last.startTime`. For DGN-01, extend to also return the element identity:

```typescript
// Extension of tests/phase-35-lcp-homepage.spec.ts pattern
const lcpInfo = await page.evaluate(() => new Promise<{
  startTime: number;
  selector: string | null;
  size: number;
  url: string;
}>((resolve) => {
  new PerformanceObserver((list) => {
    const entries = list.getEntries() as PerformanceEntry[] & Array<{
      element?: Element;
      size?: number;
      url?: string;
    }>;
    const last = entries[entries.length - 1];
    const el = (last as { element?: Element }).element ?? null;
    // Selector: tag#id.class[data-attr] composite, deterministic
    const selector = el
      ? `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${
          el.className && typeof el.className === "string"
            ? "." + el.className.split(/\s+/).filter(Boolean).join(".")
            : ""
        }`
      : null;
    resolve({
      startTime: last.startTime,
      selector,
      size: (last as { size?: number }).size ?? 0,
      url: (last as { url?: string }).url ?? "",
    });
  }).observe({ type: "largest-contentful-paint", buffered: true });
}));
```

**When to use:** DGN-01 only. Run twice per route (mobile 360 viewport, desktop 1440 viewport). Capture into `v1.8-lcp-diagnosis.md` as a markdown table with file:line evidence.

### Pattern 3: Bundle-Analyzer Chunk Attribution (DGN-02)
**What:** Run `rm -rf .next && ANALYZE=true pnpm build`; open `.next/analyze/client.html`; for each named chunk (`3302`, `e9a6067a`, `74c6194b`, `7525`), record the dominant module(s) it contains.

**Verification of analyzer wiring** (`next.config.ts:1-25`):
```typescript
import withBundleAnalyzer from "@next/bundle-analyzer";
const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],   // ← only lucide-react today
    useCache: true,
  },
  // ...
};
export default analyzer(nextConfig);
```

**Output format (verified — `@next/bundle-analyzer ^16.2.2`):** Webpack-Bundle-Analyzer treemap HTML at `.next/analyze/client.html`, `.next/analyze/nodejs.html`, `.next/analyze/edge.html`. Hover-tooltip shows module path + parsed/gzip sizes. **Manual extraction is the documented method per D-04.**

**No Turbopack interaction risk for Phase 57:** `package.json:58-59` shows `"dev": "next dev --turbopack"` (dev only) and `"build": "next build"` (no flag → webpack). Analyzer runs against webpack and works as documented.

### Anti-Patterns to Avoid

- **Lazy-loading the LCP candidate to "win" Lighthouse render-blocking score** — Phase 57 documents identity, doesn't act. PITFALLS Pitfall #3.
- **Re-baselining a Chromatic story to make a perf-driven visual diff "pass"** — captured as AES-02 standing rule. PITFALLS Pitfall #15.
- **Capturing baselines against `pnpm dev`** — React dev double-renders inflate timing. Run `pnpm build && pnpm start` per `phase-35-lcp-homepage.spec.ts:7`.
- **Using a single `pnpm build` without `rm -rf .next` first** — stale-chunk hazard (PITFALLS Pitfall #13; STATE.md BND-04). Documented in CONTEXT.md D-04.
- **Re-deriving aesthetic invariants in AESTHETIC-OF-RECORD.md instead of citing LOCKDOWN.md** — explicitly forbidden by D-01.
- **Ranking the three LCP-02 intervention paths inside `v1.8-lcp-diagnosis.md`** — D-02 reserves ranking for Phase 60 plan-phase RESEARCH.md.
- **Migrating `<script src="/sf-canvas-sync.js" />` to `next/script`** — out of Phase 57 scope (Phase 59 CRT-01); but PITFALLS Pitfall #8 means even *documenting* the wrong migration path inside the diagnosis doc is risky. Stick to identity, not intervention.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| LCP element identity capture | Custom mutation observer + intersection observer + paint timer | `PerformanceObserver({type: "largest-contentful-paint"})` | Already used in `tests/phase-35-lcp-homepage.spec.ts:18`; spec-aligned; gives `.element`, `.startTime`, `.size`, `.url`, `.renderTime` natively |
| Per-chunk attribution | Custom regex over webpack stats JSON | `@next/bundle-analyzer` HTML treemap (D-04) | Locked decision; battle-tested; no extra config needed |
| Deterministic visual snapshots | `puppeteer.screenshot` + `evaluate` for animation pause + manual font wait | Playwright `toHaveScreenshot` with `animations: "disabled"`, `reducedMotion: "reduce"` via `page.emulateMedia`, `document.fonts.ready` | Playwright 1.59 batteries-included; D-03 lock |
| Aesthetic invariant catalog | Re-extract from shipped code (lock-in mode forbids) | Cite LOCKDOWN.md sections + `app/globals.css` line ranges | LOCKDOWN.md @ 522 lines already does the extraction; D-01 lock |
| Trademark primitive grep | Hand-list paths inside AESTHETIC-OF-RECORD.md | Cite LOCKDOWN.md §1 (T1-T4) + the verified paths in CONTEXT.md `<canonical_refs>` | Already enumerated; CONTEXT.md "Trademark primitive locations" (lines 68-71) is the source list |

**Key insight:** Every Phase 57 deliverable is a REFERENCE document, not a standalone artifact. The job is to point downstream phases at the right slice of LOCKDOWN.md, `app/globals.css`, and shipped component code — never to re-derive.

## Common Pitfalls

### Pitfall A: Anton `display: optional` Creates a Two-State LCP Identity (HIGH likelihood, HIGH impact)
**What goes wrong:** `app/layout.tsx:45` declares Anton with `display: "optional"`. On a cold visit (no font cached) Anton has 100ms to load; if it misses, the fallback locks in for the page lifetime and Anton **never paints**. The GhostLabel (`components/animation/ghost-label.tsx:18`, `clamp(200px, calc(25*var(--sf-vw)), 400px)` Anton, opacity 3-5%, `aria-hidden`) is the canonical Pitfall #1 case from PITFALLS.md, but at 3-5% opacity Lighthouse may already disqualify it from LCP candidacy. The homepage `<h1>SIGNALFRAME//UX</h1>` at `entry-section.tsx:124-129` (`font-display`, opacity controlled by `sf-hero-deferred` class with `opacity: 0.01` start state per STATE.md D-08 + `globals.css:694, 1701, 1715`) is what `tests/phase-35-lcp-homepage.spec.ts` actually measures.

**Why it happens:** PITFALLS.md Pitfall #1 was written treating GhostLabel as the canonical LCP candidate, but the live `font-display: optional` setting + 3-5% opacity disqualification create non-determinism: the same page can produce different LCP elements across cold/warm visits.

**How to avoid in Phase 57:** Capture LCP element identity TWICE per route per viewport — once after `Cache-Control: no-cache` cold reload (Anton miss state), once with warm Anton. Document **both** identities in `v1.8-lcp-diagnosis.md` so Phase 60 plan-phase has the full picture. Do NOT propose a fix.

**Warning signs:**
- `lcpInfo.selector` returns different selectors across runs of the same baseline spec.
- Lighthouse mobile run reports `audits['largest-contentful-paint-element']` as fallback-rendered text node, while warm desktop run reports the styled `<h1>` or `<span>` with Anton.

### Pitfall B: Playwright Screenshots Capture HMR Overlay or Dev-Mode Banners
**What goes wrong:** If the baseline spec is run against `pnpm dev`, Next.js dev overlay (build error indicators, error boundary banners, route announcer) and React's double-render can land in the captured PNG. Per-phase AES-04 diffs would then false-positive on dev-only chrome.

**Why it happens:** `playwright.config.ts:31-36` only spins up `pnpm build && pnpm start` in CI. Local runs default to whatever's on `localhost:3000`.

**How to avoid:** Document at the top of `tests/v1.8-baseline-capture.spec.ts` the same gate as `phase-35-lcp-homepage.spec.ts:7`: "Run against `pnpm build && pnpm start`, NOT `pnpm dev`." The Phase 57 plan should verify by checking for Next.js dev-overlay markers (`<nextjs-portal>`) before snapshotting, OR by gating the spec to require `process.env.NODE_ENV === "production"` at runtime.

**Warning signs:** Captured PNG contains the orange/red Next.js error tab in the bottom-left corner, or HMR ping in the bottom-right.

### Pitfall C: `document.fonts.ready` Resolves Even When Anton Is Optional-Skipped
**What goes wrong:** `document.fonts.ready` resolves when all `font-display: optional` faces have either loaded OR been skipped. So `await page.evaluate(() => document.fonts.ready)` is necessary but not sufficient to guarantee Anton is painting.

**Why it happens:** Per CSS Font Loading API spec, `optional`-skipped faces don't block `fonts.ready`.

**How to avoid:** Two paths the planner must choose between (Claude's discretion):
1. **Force Anton present** for the baseline run by `page.evaluate(() => document.fonts.load('700 100px Anton'))` — guarantees the warm-state baseline is reproducible. Then *separately* capture the cold-state DGN-01 LCP measurement without forcing the load.
2. **Accept the bimodal outcome** — capture both states explicitly, name baselines `*-anton-loaded.png` vs `*-anton-fallback.png`. Doubles the count to 40 images, exceeds DGN-03's 20 spec.

**Recommendation:** Path 1 for AES-04 (deterministic baselines) + Path 2's bimodal capture inside `v1.8-lcp-diagnosis.md` (documenting the cold/warm LCP identity divergence). This separates the "visual reference" job from the "diagnosis" job.

### Pitfall D: Bundle-Analyzer HTML Doesn't Show Chunk Numeric IDs Above a Threshold
**What goes wrong:** Webpack's `splitChunks` may rename or re-hash chunks across builds. The chunk IDs `3302`, `e9a6067a`, `74c6194b`, `7525` were captured in v1.7 research; a `rm -rf .next && ANALYZE=true pnpm build` in v1.8 might emit different IDs.

**Why it happens:** Webpack's deterministic chunk-id algorithm hashes module graph contents; any add/remove/move shifts IDs.

**How to avoid:** Phase 57 plan must NOT assume chunk IDs are stable. The diagnosis doc should:
1. List all initial-chunk modules above some size threshold (e.g., >5 KB), regardless of whether they match the four named IDs.
2. Annotate which (if any) match the v1.7 IDs `3302/e9a6067a/74c6194b/7525`.
3. Flag any new heavy chunks not in the v1.7 set as **NEW_FINDING** for Phase 61 to triage.

**Warning signs:** Analyzer HTML shows zero chunks matching the four named IDs — this is data, not failure.

### Pitfall E: Cross-Reference Drift Between AESTHETIC-OF-RECORD.md and LOCKDOWN.md
**What goes wrong:** D-01 mandates "cite, don't duplicate." If AESTHETIC-OF-RECORD.md cites `LOCKDOWN.md §4.1` (Blessed 9 Stops) and LOCKDOWN.md is later edited (renumbered, restructured), the citation breaks silently.

**Why it happens:** Markdown anchors aren't stable across edits.

**How to avoid:** AESTHETIC-OF-RECORD.md citations use **section heading text + line number**, e.g., `LOCKDOWN.md §4.1 "Blessed 9 stops" (line 165)`. Verifier task: every citation in AESTHETIC-OF-RECORD.md grep-matches a section heading present in LOCKDOWN.md HEAD. Add this verification step to the phase plan.

**Warning signs:** Cited LOCKDOWN.md section heading no longer exists at the cited line.

## Code Examples

### Example 1: PerformanceObserver LCP element capture
```typescript
// Source: tests/phase-35-lcp-homepage.spec.ts:17-23 (extended for element identity)
const lcpInfo = await page.evaluate(() => new Promise<{
  startTime: number;
  elementSelector: string | null;
  elementSize: number;
  resourceUrl: string;
}>((resolve) => {
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const last = entries[entries.length - 1] as PerformanceEntry & {
      element?: Element;
      size?: number;
      url?: string;
    };
    resolve({
      startTime: last.startTime,
      elementSelector: last.element
        ? `${last.element.tagName.toLowerCase()}${
            last.element.id ? "#" + last.element.id : ""
          }`
        : null,
      elementSize: last.size ?? 0,
      resourceUrl: last.url ?? "",
    });
  }).observe({ type: "largest-contentful-paint", buffered: true });
}));
```

### Example 2: Deterministic full-page screenshot
```typescript
// Source: Playwright API + tests/phase-35-homepage.spec.ts patterns
await page.setViewportSize({ width: 1440, height: 900 });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("/", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await expect(page).toHaveScreenshot("v1.8-start/home-desktop-1440x900.png", {
  fullPage: true,
  animations: "disabled",
  caret: "hide",
});
```

### Example 3: Bundle-analyzer invocation (DGN-02)
```bash
# Source: CONTEXT.md D-04 + STATE.md BND-04 stale-chunk guard
rm -rf .next && ANALYZE=true pnpm build
# Opens .next/analyze/client.html in default browser via @next/bundle-analyzer.
# Manually inspect chunks; record findings in .planning/codebase/v1.8-lcp-diagnosis.md
# as a markdown table.
```

### Example 4: AESTHETIC-OF-RECORD.md citation pattern (target style)
```markdown
## Standing Rule AES-01: Extract from shipped code; never re-derive

Authoritative sources (DO NOT duplicate; cite the slice):
- LOCKDOWN.md §1 "Trademark Primitives" (lines 27-81) — T1 PIXEL-SORT, T2 GLYPH, T3 CUBE-TILE, T4 `//` separator.
- LOCKDOWN.md §2 "Color System" (lines 83-130) — slot-typed two-hue model, R-40 saturation asymmetry, OKLCH matrix.
- `app/globals.css:121-386` — `:root` token block (`--sfx-*` color/theme/duration/spacing, `--sf-*` sizing/canvas).
- LOCKDOWN.md §4.1 "Blessed 9 stops" (line 165) — spacing tokens.
- LOCKDOWN.md §5 "Motion + Animation" (lines 208-238) — duration tokens, easing tokens, signal-leads-frame staging, scroll-trigger types, reduced-motion mandatory.

Trademark primitive component paths (for trademark-affecting changes):
- Pixel-sort signal: `components/blocks/entry-section.tsx`, `components/dossier/pointcloud-ring.tsx`, `components/dossier/pointcloud-ring-worker.ts`, `components/dossier/iris-cloud.tsx`, `components/dossier/iris-cloud-worker.ts`.
- Navbar glyph style: `components/layout/nav.tsx`, `components/layout/nav-overlay.tsx`, `components/layout/nav-reveal-mount.tsx`, `components/layout/frame-navigation.tsx`.
- Cube-tile box: `components/blocks/inventory-section.tsx` (semantic), `components/layout/instrument-hud.tsx`, `components/layout/cd-corner-panel.tsx`, `app/globals.css` (`--sfx-cube-hue` slot).
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual chrome-devtools MCP screenshots for visual baselines | Playwright `toHaveScreenshot` with `animations: "disabled"` + `reducedMotion: "reduce"` | D-03 lock 2026-04-25 | Reproducible across machines + CI; per-phase AES-04 runs the same harness |
| `source-map-explorer` or custom webpack-stats parsers | `@next/bundle-analyzer` HTML treemap (already in repo) | D-04 lock 2026-04-25 | Zero new deps; same tool will be used to verify Phase 61 BND reductions |
| Re-extract aesthetic contract per phase | Single AESTHETIC-OF-RECORD.md citing LOCKDOWN.md | D-01 lock 2026-04-25 | Eliminates per-phase re-derivation drift; preserves LOCKDOWN.md as single source of truth |
| Inline LCP candidate ranking inside diagnosis | Diagnosis is identity-only; ranking lives in Phase 60 plan-phase | D-02 lock 2026-04-25 | Decouples measurement from intervention; Phase 60 plan ranks against then-current LHCI median + Phase 59 ship state |

**Deprecated/outdated for Phase 57 scope:**
- v1.7 chunk IDs (`3302`, `e9a6067a`, `74c6194b`, `7525`) may not match v1.8 build output (Pitfall D). Treat them as a checklist, not a guaranteed match.
- Anton `display: optional` IS the current state (`app/layout.tsx:45`). PITFALLS Pitfall #1 discusses migration to `swap` with size-adjust descriptors; that migration is Phase 59 CRT-03 scope, NOT Phase 57. Phase 57 captures the CURRENT state under `optional`.

## Open Questions

### Q1. Cold-vs-warm Anton state in baseline images
**What we know:** Anton `display: optional` produces non-deterministic LCP candidates across cold/warm visits (Pitfall A).
**What's unclear:** Should DGN-03 baselines be warm-only (Anton always loaded) for AES-04 reproducibility, or include a cold variant for honest visual-of-record?
**Recommendation:** Force warm via `document.fonts.load('700 100px Anton')` in the baseline spec — AES-04 needs reproducibility above all. Capture cold-state separately inside `v1.8-lcp-diagnosis.md` as the DGN-01 evidence. Planner picks final phrasing; this is Claude's discretion per CONTEXT.md.

### Q2. Headless Chromium WebGL fidelity for visual baselines
**What we know:** `playwright.config.ts:24-26` enables SwiftShader (`--use-gl=swiftshader --enable-webgl`). PITFALLS Pitfall #19 documents headless software-rendered WebGL differs from real GPU.
**What's unclear:** Will the SignalCanvas hero pixel-sort effects render identically in headless vs real Chrome at the moment the screenshot is captured?
**Recommendation:** Accept SwiftShader output as the canonical baseline (it's what CI will diff against in AES-04). Document in `v1.8-lcp-diagnosis.md` and AESTHETIC-OF-RECORD.md that "baselines reflect SwiftShader rendering; real-GPU visual review is the AES-03 cohort review job." This matches the existing project precedent (`playwright.config.ts:21-26` rationale comment).

### Q3. Does `document.fonts.ready` resolve before opacity-0.01 hero chars are visible?
**What we know:** Hero chars at `entry-section.tsx:131` use `sf-hero-deferred` class with `opacity: 0.01` start state (STATE.md D-08); animation reveals them later via GSAP. **OPEN_QUESTION for the planner**: at the moment `fonts.ready` resolves, are the hero chars at 0.01 opacity (LCP-qualifying but invisible) or already animated to full opacity?
**What's unclear:** Without running the spec, can't verify whether the visual baseline shows hero chars revealed or hidden. The reduced-motion path matters here: `page.emulateMedia({ reducedMotion: "reduce" })` may short-circuit the GSAP reveal — which is desirable for baseline determinism but means the captured PNG is "reduced-motion variant," not the live visit.
**Recommendation:** Planner verifies via a one-shot probe (run the spec once, inspect the captured PNG) and documents the captured state in AESTHETIC-OF-RECORD.md. This is Claude's discretion (CONTEXT.md "AESTHETIC-OF-RECORD.md exact section ordering and prose voice").

### Q4. Where exactly do `.planning/codebase/` files belong vs `.planning/research/`?
**What we know:** `.planning/codebase/` already contains ARCHITECTURE.md, CONCERNS.md, CONVENTIONS.md, HERO-ANIMATION.md, INTEGRATIONS.md, STACK.md, STRUCTURE.md, TESTING.md (verified via `ls`). CONTEXT.md and ROADMAP.md both spec `v1.8-lcp-diagnosis.md` and `AESTHETIC-OF-RECORD.md` to live in `.planning/codebase/`.
**Recommendation:** No question — confirmed by `<code_context>` "Diagnosis docs land in `.planning/codebase/`" + ROADMAP.md success criteria 1+4. Logged as resolved.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright `^1.59.1` (`package.json:129`) |
| Config file | `playwright.config.ts` (already exists) |
| Quick run command | `pnpm exec playwright test tests/v1.8-baseline-capture.spec.ts --project=chromium` |
| Full suite command | `pnpm exec playwright test` |
| Build target | `pnpm build && pnpm start` (production) — NOT `pnpm dev` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| DGN-01 | LCP element identity captured for `/` at 360 mobile + 1440 desktop with `PerformanceObserver` evidence | integration (browser-driven) | `pnpm exec playwright test tests/v1.8-lcp-diagnosis.spec.ts --project=chromium` | ❌ Wave 0 — new spec creates the LCP capture harness; output is a JSON artifact piped into `v1.8-lcp-diagnosis.md` |
| DGN-02 | Per-chunk attribution table for `3302`, `e9a6067a`, `74c6194b`, `7525` (or current equivalents) | manual-only (analyzer HTML inspection) | `rm -rf .next && ANALYZE=true pnpm build` then human reads `.next/analyze/client.html` | n/a — manual per D-04; output is markdown table inside `v1.8-lcp-diagnosis.md` |
| DGN-03 | 20 baseline PNGs at `.planning/visual-baselines/v1.8-start/` | integration (Playwright screenshot) | `pnpm exec playwright test tests/v1.8-baseline-capture.spec.ts --project=chromium --update-snapshots` | ❌ Wave 0 — new spec |
| AES-01 | `.planning/codebase/AESTHETIC-OF-RECORD.md` exists, ~150 lines, cites LOCKDOWN.md sections + token paths + trademark primitive paths | smoke (file exists + heading grep) | `test -f .planning/codebase/AESTHETIC-OF-RECORD.md && grep -E "LOCKDOWN.md|app/globals.css|trademark" .planning/codebase/AESTHETIC-OF-RECORD.md \| wc -l` | n/a — documentation deliverable |
| AES-02 | Standing rule: no Chromatic re-baseline for perf changes (one Anton exception) | smoke (heading grep) | `grep -i "no.*re-baseline\|optional.*swap" .planning/codebase/AESTHETIC-OF-RECORD.md` | n/a |
| AES-03 | Standing rule: cohort review post-Phase-60 against v1.8-start baselines | smoke (heading grep) | `grep -i "cohort review\|external eye" .planning/codebase/AESTHETIC-OF-RECORD.md` | n/a |
| AES-04 | Standing rule: per-phase pixel-diff <=0.5% vs v1.8-start | smoke (heading grep) + reusable Playwright harness | `grep -i "0\\.5%\|pixel-diff" .planning/codebase/AESTHETIC-OF-RECORD.md` | n/a |

### Sampling Rate
- **Per task commit:** No automated sampling — Phase 57 is documentation-heavy, not runtime-changing. Run the new specs once to seed the artifacts.
- **Per wave merge:** `pnpm exec playwright test tests/v1.8-baseline-capture.spec.ts` (must succeed, captures the 20 PNGs); separately `rm -rf .next && ANALYZE=true pnpm build` (must succeed, populates `.next/analyze/client.html`).
- **Phase gate:** All 20 baseline PNGs present at `.planning/visual-baselines/v1.8-start/`; `.planning/codebase/v1.8-lcp-diagnosis.md` and `.planning/codebase/AESTHETIC-OF-RECORD.md` both committed.

### Wave 0 Gaps
- [ ] `tests/v1.8-baseline-capture.spec.ts` — implements DGN-03 (5 routes × 4 viewports = 20 screenshots).
- [ ] `tests/v1.8-lcp-diagnosis.spec.ts` — implements DGN-01 LCP identity capture per viewport. Output is JSON written to `.planning/codebase/v1.8-lcp-evidence.json` (or piped into `v1.8-lcp-diagnosis.md` directly during phase execution); planner picks the integration shape.
- [ ] `.planning/visual-baselines/v1.8-start/` directory creation (Playwright spec creates it on first `--update-snapshots` run).
- [ ] No framework install needed; no `conftest.py` equivalent (Playwright doesn't require shared fixtures for this scope).

**Note on AES-04 future use:** The same `tests/v1.8-baseline-capture.spec.ts` becomes the AES-04 per-phase pixel-diff runner — Phase 58+ adds a wrapper that calls it WITHOUT `--update-snapshots` and checks the diff ratio. Phase 57's job is to seed the baselines; Phase 58 (or wherever AES-04 automation lands) writes the diff gate.

## Sources

### Primary (HIGH confidence — read directly)
- `.planning/phases/57-diagnosis-pass-aesthetic-of-record-lock-in/57-CONTEXT.md` (lines 1-136) — locked decisions D-01..D-04
- `.planning/REQUIREMENTS.md` (lines 9-13, 52-57) — DGN/AES requirement text
- `.planning/STATE.md` (lines 188-216) — v1.8 critical constraints + decisions
- `.planning/ROADMAP.md` (lines 875-886, 1021-1030) — Phase 57 success criteria + v1.8 build-order
- `.planning/LOCKDOWN.md` (sections §0-§14, headings verified at lines 14, 27, 83, 131, 163, 208, 239, 291, 323, 362, 411, 426, 440, 456, 495)
- `.planning/research/PITFALLS.md` (full file, 638 lines) — Pitfalls 1, 2, 3, 8, 13, 15, 19 directly relevant to Phase 57
- `.planning/research/SYNTH-execution-strategy.md` — friction-driven execution philosophy
- `playwright.config.ts` (full file, 38 lines) — verified determinism settings + headless WebGL config
- `next.config.ts` (full file, 25 lines) — verified `withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })` wiring
- `package.json` (full file, 159 lines) — verified `@next/bundle-analyzer 16.2.2`, `@playwright/test 1.59.1`, `lighthouse 13.1.0`, build script is `next build` (no `--turbopack`)
- `tests/phase-35-homepage.spec.ts` (lines 13-167) — reusable viewport + reducedMotion patterns
- `tests/phase-35-lcp-homepage.spec.ts` (lines 7-25) — PerformanceObserver LCP pattern + `pnpm build && pnpm start` gate
- `app/layout.tsx` (lines 1-117) — Anton `display: "optional"` at line 45; inline `scaleScript` IIFE at line 100, 113
- `app/globals.css` (lines 1-399) — `:root` token block 121-386; `sf-hero-deferred` rules 1701, 1715
- `components/blocks/entry-section.tsx` (lines 124-160) — homepage `<h1>` LCP candidate
- `components/animation/ghost-label.tsx` (full file, 23 lines) — clamp 200-400px Anton, opacity 3-5%, `aria-hidden`
- `components/layout/scale-canvas.tsx` (lines 110-145) — `<script src="/sf-canvas-sync.js" />` mount confirmation
- `public/sf-canvas-sync.js` (full file, 1 line) — render-blocking IIFE that mutates outer height pre-paint

### Secondary (MEDIUM confidence — verified against shipped code, but Phase 57 doesn't need)
- `node_modules/next/package.json` — confirms Next.js 15.5.14 installed (matches STATE.md "v1.7-locked stack")
- `node_modules/@next/bundle-analyzer/package.json` — confirms 16.2.2 installed
- ROADMAP.md cross-cutting note (line 879) — AES-02..04 are standing rules referenced from AESTHETIC-OF-RECORD.md, not separate phases

### Tertiary (LOW confidence — flagged for validation)
- None. All findings cited against shipped code or locked decision records. No WebSearch / Context7 calls were needed because Phase 57 scope is project-specific lock-in, not new technology.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified against `package.json` and installed `node_modules`; analyzer wiring verified in `next.config.ts`.
- Architecture patterns: HIGH — every code example is sourced from a shipped file; line-numbers verified via grep.
- Pitfalls: HIGH on A (Anton optional + opacity-0.01 + GhostLabel — all three verified in code), B (dev-vs-prod gate matches existing precedent), D (chunk-id stability is a webpack-known property), E (markdown-anchor drift is a documentation-management certainty); MEDIUM on C (CSS Font Loading API spec interaction with `optional` skipped faces — verified by spec but not by live test in this codebase).
- User constraints: HIGH — copied verbatim from `<decisions>` block in CONTEXT.md.
- Validation Architecture: HIGH — built from existing `tests/phase-35-*.spec.ts` patterns; no novel tooling.

**Research date:** 2026-04-25
**Valid until:** 2026-05-25 (30 days — stable lock-in scope; chunk IDs may shift sooner if Phase 58/59 ships; Anton display contract may change in Phase 59 CRT-03)
