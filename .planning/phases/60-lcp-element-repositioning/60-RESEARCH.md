# Research

**Domain:** Phase 60 — LCP Element Repositioning (mobile LCP <1.0s via GhostLabel candidate (b))
**Researched:** 2026-04-26
**Confidence:** HIGH

---

## Standard Architecture

### Current system overview

The homepage (`app/page.tsx`) renders six coded blocks in sequence: ENTRY → THESIS → PROOF → INVENTORY → SIGNAL → ACQUISITION. The THESIS section (`app/page.tsx:42-53`) wraps a `<GhostLabel text="THESIS" />` leaf element immediately inside an `<SFSection>` container before rendering `<ThesisSection />`.

`GhostLabel` (`components/animation/ghost-label.tsx`) is a 23-line Server Component — a single `<span>` with no client-side JavaScript. It renders:

```
<span
  aria-hidden="true"
  data-anim="ghost-label"
  data-ghost-label="true"
  className={`sf-display pointer-events-none select-none absolute leading-none ${className}`}
  style={{ fontSize: "clamp(200px, calc(25*var(--sf-vw)), 400px)" }}
>
  {text}
</span>
```

The call site supplies the className `"-left-[calc(3*var(--sf-vw))] top-1/2 -translate-y-1/2 text-foreground/[0.04]"`. This yields a full-width Anton span at 200–400 px, 4% opacity, `position: absolute`, `aria-hidden`, `pointer-events-none`. It is structurally FRAME (wayfinding), not SIGNAL (no animation, no GPU surface).

**Phase 57 DGN-01 established** that on mobile-360x800, this span is the LCP candidate at both cold (180 ms startTime) and warm (68 ms) font states — element size 28,459 px². The desktop LCP candidate diverges entirely: it is the visible VL-05 magenta `//` overlay at `entry-section.tsx:208` (61,560 px²). Phase 60 intervenes on mobile only (D-05).

**Phase 59 shipped** Anton `font-display: optional → swap` with tuned `size-adjust` / `ascent-override` / `descent-override` / `line-gap-override` against `Impact, Helvetica Neue Condensed, Arial Black`. Lenis init was deferred to `requestIdleCallback` with 100 ms timeout. Both changes are live on `chore/v1.7-ratification` and must be active when Phase 60 takes measurements.

---

## Recommended Approach

### Plan 01 — Pre-need LCP candidate analysis script

**Goal:** Playwright spec + JSON emitter that becomes a standing v1.8 measurement tool, not a one-time artifact.

**Spec name:** `tests/v1.8-lcp-candidates.spec.ts`  
**Output:** `.planning/codebase/v1.8-lcp-candidates.json`

**Algorithm (extends `tests/v1.8-lcp-diagnosis.spec.ts` pattern):**

1. Run at all 4 viewports: mobile-360x800, iphone13-390x844, ipad-834x1194, desktop-1440x900. This matches the `v1.8-baseline-capture.spec.ts` viewport set.
2. For each viewport, run warm-state only (force Anton via `document.fonts.load('700 100px "Anton"')` before measurement). Cold-state identity is already captured in `v1.8-lcp-evidence.json`; candidates script focuses on stable warm-state ranking.
3. Use a `PerformanceObserver({ type: 'largest-contentful-paint', buffered: true })` that collects **all** buffered entries, not just the last. The API fires for every candidate displacement — the browser emits a sequence of entries as progressively larger elements paint; the final entry is the LCP. By collecting all entries you get the full candidate ranking in arrival order.
4. For each entry, record: `selector`, `elementSize` (px²), `startTime` (ms), `resourceUrl`. Filter to entries where `size >= 50` (px² threshold from D-06).
5. After collecting the candidate list, identify the final LCP entry (last in the buffered list) and set `isLcp: true` on it.
6. Record `qualityTier` alongside each viewport run per `feedback_consume_quality_tier.md`. Call `getQualityTier()` from `lib/quality-tier.ts` (or equivalent) in the page evaluate context. This gives Phase 62 VRF-04 a cross-reference between quality tier and candidate identity.
7. Emit the JSON using the same append/idempotent pattern as the diagnosis spec (`appendCandidates` replaces by viewport).

**Implementation note:** The diagnosis spec uses one `new Promise` that resolves on the last LCP entry. The candidates script must instead collect all buffered entries before resolving. Use `list.getEntries()` on each observer callback and accumulate into a closure array, resolving after a short settling window (e.g., `setTimeout(resolve, 1000)` after `waitUntil: 'load'`). See selector-building pattern at `v1.8-lcp-diagnosis.spec.ts:113-126` — reuse verbatim.

**Does NOT run against dev server.** Must run against `pnpm build && pnpm start`. Same rationale as `v1.8-lcp-diagnosis.spec.ts:6-10`.

### Plan 02 — Mobile LCP intervention (candidate b)

**Goal:** Apply `content-visibility: auto` + `contain-intrinsic-size` to the `GhostLabel` leaf span only. Single-file change in `components/animation/ghost-label.tsx`.

**The change:**

```tsx
<span
  aria-hidden="true"
  data-anim="ghost-label"
  data-ghost-label="true"
  className={`sf-display pointer-events-none select-none absolute leading-none ${className ?? ""}`}
  style={{
    fontSize: "clamp(200px, calc(25*var(--sf-vw)), 400px)",
    contentVisibility: "auto",
    containIntrinsicSize: "auto <measured-height>px",
  }}
>
  {text}
</span>
```

`content-visibility: auto` defers paint of the element until it is near the viewport. Since the GhostLabel is `position: absolute` inside the THESIS section (which is below the ENTRY hero), it is off-screen at initial paint time. Deferring its paint removes it from the browser's initial LCP candidate pool, allowing the actual LCP winner to be something that paints earlier (or pushing LCP to a less expensive element).

The `containIntrinsicSize` value must prevent layout shift when the element transitions from skipped to rendered. Without it, the browser uses a default 0×0 intrinsic size for the skipped element, which could cause a reflow when it enters the viewport.

---

## Integration Points

### Files that must be read before any change

- `components/animation/ghost-label.tsx` — the only file changed for Plan 02 intervention (23 LOC, Server Component, no `'use client'`)
- `app/page.tsx:42-53` — GhostLabel call site; confirms position in section hierarchy
- `app/globals.css:1486-1488` — `.sf-hero-deferred { opacity: 0; }` — D-04 reactive posture reference; the GhostLabel does NOT carry this class (it uses `text-foreground/[0.04]` directly), so content-visibility deferral is independent of the GSAP reveal system
- `components/layout/lenis-provider.tsx:37-43` — Lenis `autoResize: true` contract (PF-04); must not be broken
- `tests/v1.8-lcp-diagnosis.spec.ts` — template for Plan 01 spec
- `tests/v1.8-baseline-capture.spec.ts` — AES-04 pixel-diff harness reused without `--update-snapshots`
- `playwright.config.ts:22-27` — SwiftShader caveat; governs what synthetic results mean
- `.planning/codebase/v1.8-lcp-evidence.json` — JSON shape to match for Plan 01 output
- `.planning/codebase/AESTHETIC-OF-RECORD.md` — AES-01/03/04 standing rules
- `.planning/visual-baselines/v1.8-start/` — 20 PNGs for AES-04 pixel-diff comparison

### Files monitored but not changed

- `components/blocks/entry-section.tsx` — T4 `//` separator (desktop LCP); monitor-only per D-05
- `components/dossier/pointcloud-ring.tsx` and workers — T1 pixel-sort; must remain visible post-intervention (AES-04 verifies)

---

## Research Questions — Answers

### Q1: `containIntrinsicSize` value methodology

The value must match the rendered height of the GhostLabel at each mobile breakpoint to prevent layout shift when the element enters the viewport. The correct methodology:

1. In a Wave 0 Playwright spec (part of Plan 02 setup), navigate to `/` at each relevant viewport width (360, 390, 834), force warm Anton, wait for layout to settle, then call `element.getBoundingClientRect()` on the GhostLabel selector (`[data-ghost-label="true"]`).
2. Record `.width` and `.height` from `getBoundingClientRect()` at each viewport.
3. The GhostLabel is `position: absolute` and does not participate in block layout flow — so its intrinsic size matters for the containment box, not for document flow CLS. Use `containIntrinsicSize: "auto <height>px"` where `<height>` is the measured height at the smallest breakpoint (mobile-360), clamped to match the `clamp(200px, calc(25*var(--sf-vw)), 400px)` formula result.
4. The formula: at 360 px viewport width, `--sf-vw` = 1px (1% of vw), so `calc(25 * 1px)` = 25px... wait — `--sf-vw` is defined as `1vw` in tokens, so at 360 px: `25 * 3.6px = 90px`. But the `clamp(200px, 90px, 400px)` clamps to 200px at mobile-360. At iphone13-390: `25 * 3.9 = 97.5px`, clamps to 200px. At ipad-834: `25 * 8.34 = 208.5px` — this exceeds 200px, so font-size becomes 208.5px. Desktop-1440: `25 * 14.4 = 360px`.
5. The rendered height will be approximately equal to `font-size * leading-none` = font-size × 1.0 (since `leading-none` = `line-height: 1`). At mobile-360/390: ~200px height. The width spans the full viewport (the span is `position: absolute` with no width constraint, so it wraps based on text content).
6. **Single recommended value for mobile:** `containIntrinsicSize: "auto 200px"` covers both mobile-360 and iphone13-390 (both clamp to 200px font-size). Use a media-queried override for ipad (208px) if precision matters, but for a decorative element at 4% opacity the 8px difference is below any perceptible threshold.
7. **Measurement command (Wave 0):** Run a brief Playwright evaluate in the Plan 02 Wave 0 spec to confirm: `document.querySelector('[data-ghost-label="true"]').getBoundingClientRect()`. Record and use the measured height, not the estimated value. If the measured height differs from the estimate, use the measured value.

### Q2: `content-visibility: auto` + Lenis interaction

This is the most consequential interaction to understand before planning.

**Finding: content-visibility on a leaf element inside Lenis does NOT break the Lenis scroll contract.**

Lenis implements smooth scrolling by intercepting wheel/touch events and driving scroll via `window.scrollY` + a GSAP ticker. It does NOT use `transform: translateY` on the scrolled container — it uses native `scrollTop` manipulation. This is confirmed by the Lenis source: `lenis` drives scroll via actual scroll position, not CSS transforms on the container.

The `content-visibility: auto` spec says the browser skips rendering work for off-screen elements. "Off-screen" is determined by the element's scroll-container intersection. Since Lenis uses native scroll (not transform-based faking), the browser's native scroll container model is intact, and `content-visibility: auto` intersection testing works correctly against the real scroll position.

**Specific caveat for this codebase:** Phase 59 deferred Lenis init to `requestIdleCallback` with 100 ms timeout. LCP measurements run before Lenis initializes (LCP fires during initial paint, within the first 180 ms on mobile-cold). The `content-visibility: auto` deferral decision is made by the browser's rendering engine before Lenis is even instantiated. There is no interaction between the rIC-deferred Lenis init and the `content-visibility` paint-skipping decision.

**Potential caveat to verify (Wave 0):** The GhostLabel is `position: absolute` inside `SFSection`. If `SFSection` uses `overflow: hidden` or has a CSS containment context that confines the absolute element, the browser may compute the GhostLabel's scroll-container intersection as always-in-viewport (since it is positioned relative to the section, which is in the viewport at load). Check `SFSection`'s computed styles for `overflow` and `contain` properties. If the section uses `overflow: hidden` AND the GhostLabel overflows it (it extends off-screen with `-left-[calc(3*var(--sf-vw))]`), the intersection check may fire immediately, defeating the deferral.

**Mitigation if caveat fires:** Add `overflow: clip` to the section or use `contain-intrinsic-size` with an explicit height + `content-visibility: hidden` during initial paint only. However, given the diagnosis evidence that mobile LCP = 68–180 ms (which means the GhostLabel is CURRENTLY painting in that window), the intervention's goal is precisely to not have it paint in that window. If the deferral fires immediately due to overflow/containment, it means the element IS in the visible area — and in that case `content-visibility: auto` simply won't defer it.

**Resolution path:** The Wave 0 measurement will confirm. If post-intervention LCP still reads the GhostLabel as candidate, the deferral did not work and escalation to candidate (a) or (c) is triggered per D-04.

### Q3: PerformanceObserver candidate enumeration algorithm

The LCP API fires a new entry every time a larger element finishes painting (progressive candidate displacement). To enumerate ALL paint candidates:

```ts
const candidates = await page.evaluate(() =>
  new Promise<CandidateEntry[]>((resolve) => {
    const entries: CandidateEntry[] = [];
    const po = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const lcpEntry = entry as PerformanceEntry & {
          element?: Element;
          size?: number;
          url?: string;
          startTime: number;
        };
        const el = lcpEntry.element ?? null;
        entries.push({
          selector: el ? buildSelector(el) : null,
          elementSize: lcpEntry.size ?? 0,
          startTime: lcpEntry.startTime,
          resourceUrl: lcpEntry.url ?? "",
          isLcp: false, // updated after collection
        });
      }
    });
    po.observe({ type: "largest-contentful-paint", buffered: true });
    // Settle: wait 1500ms after page load for all LCP candidates to fire
    setTimeout(() => {
      po.disconnect();
      if (entries.length > 0) entries[entries.length - 1].isLcp = true;
      // Sort by startTime ascending (should already be in order, but sort defensively)
      entries.sort((a, b) => a.startTime - b.startTime);
      resolve(entries.filter((e) => e.elementSize >= 50));
    }, 1500);
  })
);
```

The 1500 ms settling window after `waitUntil: 'load'` is sufficient because LCP candidates stop being emitted when the user interacts with the page or when the page loses focus — in a headless Playwright session, neither occurs, so the PerformanceObserver runs freely. The spec should use `await page.goto("/", { waitUntil: "load" })` then `await page.waitForTimeout(1500)` before resolving (or use the setTimeout inside evaluate as above).

**Selector-building function:** Reuse the selector composition from `v1.8-lcp-diagnosis.spec.ts:113-126` verbatim. Extract to a shared helper if desired.

### Q4: JSON shape for `v1.8-lcp-candidates.json`

The shape must extend `v1.8-lcp-evidence.json` for Phase 62 VRF-04 reuse. The evidence file uses:

```ts
type LcpEntry = {
  viewport: string;
  fontState: string;
  startTime: number;
  selector: string | null;
  elementSize: number;
  resourceUrl: string;
  capturedAt: string;
};
```

The candidates file extends this with a per-viewport array of all candidates, not just the LCP winner:

```ts
type CandidateEntry = {
  selector: string | null;
  elementSize: number;   // px²
  startTime: number;     // ms
  resourceUrl: string;
  isLcp: boolean;        // true only on the final (largest) entry
};

type ViewportCandidates = {
  viewport: string;         // "mobile-360x800" | "iphone13-390x844" | "ipad-834x1194" | "desktop-1440x900"
  fontState: "warm";        // candidates script is warm-only
  qualityTier: number;      // from getQualityTier() — 1=high, 2=mid, 3=low
  candidates: CandidateEntry[];
  capturedAt: string;       // ISO 8601
};

// Root: ViewportCandidates[]
```

The root is an array of `ViewportCandidates`, one per viewport. This is the extension of the flat `LcpEntry[]` root in the evidence file — same idempotent upsert-by-viewport pattern, same output directory (`.planning/codebase/`).

**Phase 62 VRF-04 note:** The `qualityTier` field allows Phase 62 to confirm that real-device candidate enumeration at lower quality tiers does not reveal a different LCP candidate (e.g., if the WebGL ring canvas is skipped on tier-3 devices, the next LCP candidate may differ).

### Q5: Anti-Pattern #5 verification

**Finding: No source file in `components/` or `app/` applies `content-visibility: auto` to any element.**

Grep of `components/**/*.{tsx,css}` and `app/**/*.{tsx,css}` for `content-visibility` returns zero matches in source files. The only matches are in:
- `node_modules/` (jsdom default stylesheet, csstype TypeScript definitions, Storybook)
- `.next/static/css/` (built output, not source)

The PITFALLS.md at `.planning/research/PITFALLS.md:242` documents a related constraint: "Do NOT add `content-visibility: auto` to ScaleCanvas containers as a perf optimization." This is NOT Anti-Pattern #5 in a numbered sense — the ROADMAP uses the label "Anti-Pattern #5" informally to mean "applying content-visibility to the section wrapper rather than the leaf element." The actual pitfall is that `content-visibility: auto` on a ScaleCanvas container breaks `transform-origin` math. GhostLabel is NOT inside ScaleCanvas — it is inside `SFSection` directly. The ScaleCanvas pitfall does not apply to Plan 02's target.

**Sibling cleanup:** None required. No existing component misapplies `content-visibility` in a way that would need cleanup as part of Phase 60.

**Confirmation needed in Plan 02 Wave 0:** Before writing the style, confirm that `SFSection` (or any ancestor of GhostLabel) does not already carry a CSS containment context that would conflict. `SFSection` uses `data-section`, `data-bg-shift` — these are data attributes with no containment semantics. The `className="py-0 relative block overflow-x-hidden"` at `app/page.tsx:47` gives `overflow-x: hidden` on the section. This does NOT affect vertical intersection testing for `content-visibility: auto`.

### Q6: Validation Architecture

See dedicated section below.

### Q7: Headless WebGL caveat and D-07 anchor

`playwright.config.ts:24-26` enables `--use-gl=swiftshader` (software WebGL). This means:

1. **GPU-bound work runs in software.** The WebGL ring/iris canvas in `EntrySection` renders via SwiftShader. Software WebGL is slower than real GPU, inflating shader-compilation timing in synthetic tests.
2. **LCP timing is pessimistic on GPU-bound paths, optimistic on CPU-bound paths.** The GhostLabel is a text element — entirely CPU-bound (font render, layout). SwiftShader does not affect its paint timing. The mobile LCP cold=180ms measurement is a valid CPU-side baseline.
3. **D-07 (WebPageTest real-device gate) is the required complement** because: (a) real iPhone 13 Safari uses WebKit, not Blink; font-rendering pipeline differences exist; (b) real device network (Verizon LTE) adds network jitter not simulated by Playwright's local server; (c) real device thermal state and GPU memory pressure are not simulatable headlessly.
4. **The SwiftShader caveat does NOT invalidate the LHCI median-of-5 measurement** for the specific LCP intervention being tested. The GhostLabel is not GPU-accelerated — `content-visibility: auto` defers a CPU paint operation. The before/after delta (GhostLabel removed from LCP critical path) is measurable with SwiftShader because the measurement is relative (does the GhostLabel still appear as LCP candidate?), not absolute (is the absolute timing production-accurate?).

**D-07 pass threshold is <1.5s** (more lenient than LHCI <1.0s) to accommodate real-network noise. The in-phase WebPageTest run is a catch-not-gate: it catches obvious real-device failures before Phase 62 VRF-04's strict multi-device matrix.

### Q8: Phase 59 measurement environment parity

Phase 59 shipped:
- Anton `font-display: optional → swap` with tuned descriptors (CRT-03)
- Lenis rIC deferral (CRT-04)

**Any LCP measurement in Phase 60 MUST run against the post-Phase-59 state.** The current working branch is `chore/v1.7-ratification` which carries the Phase 59 commits. Before Plan 01 runs, verify that `pnpm build && pnpm start` reflects the post-Phase-59 state by checking that `app/layout.tsx` uses `display: 'swap'` for Anton and that `lenis-provider.tsx` uses the rIC pattern.

**The Anton `swap` migration changes mobile LCP behavior.** Under `optional`, cold-state Anton may not paint (100 ms window); the LCP candidate at 180 ms (cold) was still the GhostLabel, meaning Anton DID paint within 180 ms in the diagnosis run. Under `swap`, Anton always paints after arrival — the warm/cold distinction collapses to "how fast does Anton arrive." The Phase 57 diagnosis was captured under `optional` (CRT-03 was not yet shipped). Plan 01 will re-measure under `swap` and may find that:
- Cold LCP timing has changed (Anton now always paints, so cold LCP timing = Anton network fetch time + paint)
- The GhostLabel selector still wins mobile LCP (it is the largest element regardless of font state)

The GhostLabel's LCP candidacy is font-state-stable per Phase 57 finding ("the cold-state selector matches the warm-state selector exactly"). Phase 59's Anton swap migration does not change the element identity, but it may change the timing. Plan 01 re-measures timing; if the mobile LCP is now much lower due to Anton's swap semantics improving load, the intervention may already be partly won.

---

## Anti-Patterns

1. **Applying `content-visibility: auto` to `SFSection` instead of the `GhostLabel` span.** The section contains branded content, SVG dividers, and the ThesisSection block — deferring the section would defer all of this, breaking AES-04 and potentially CLS. ROADMAP §Phase 60 success criterion 2 names this "Anti-Pattern #5" and forbids it explicitly.

2. **Using `content-visibility: hidden` instead of `content-visibility: auto`.** `hidden` permanently hides the element until explicitly un-hidden — it is not the scroll-based deferral model. The GhostLabel must appear when the user scrolls to the THESIS section.

3. **Setting `containIntrinsicSize` to 0 or omitting it.** Without a size hint, the browser assigns 0×0 to the skipped element. If the section has `position: relative` and the GhostLabel contributes to the section's scroll height (even at 4% opacity), a 0-height intrinsic size causes a reflow when the element enters viewport. Use `auto <measured-height>px`.

4. **Measuring `containIntrinsicSize` in dev mode.** Dev-mode React double-render produces different layout timing. Measure from `pnpm start` (production build) only, matching the LCP diagnosis method.

5. **Running AES-04 pixel-diff in dev mode or with `--update-snapshots`.** The diff must compare against the existing `.planning/visual-baselines/v1.8-start/` PNGs. Dev mode injects the Next.js portal element; the spec has a hard gate at `expect(page.locator("nextjs-portal")).toHaveCount(0)`.

6. **Assuming content-visibility works on `position: absolute` elements in all browsers.** The CSS Containment specification applies `content-visibility` to block boxes in the normal flow as of Chrome 85+, Safari 17.2+ (with caveats). For `position: absolute` elements, containment behavior is the same — the element is a skipped rendering context when off-screen. However, Safari 17.x has known issues with `content-visibility: auto` on absolutely positioned elements inside scroll containers. D-07 (WebPageTest Safari real-device run) is the verification gate for this.

---

## Sources

| File | Lines read | Confidence |
|------|-----------|-----------|
| `.planning/phases/60-lcp-element-repositioning/60-CONTEXT.md` | 1–168 (full) | HIGH — primary decision record |
| `.planning/codebase/v1.8-lcp-diagnosis.md` | 1–158 (full) | HIGH — Phase 57 DGN-01 measurement baseline |
| `.planning/codebase/v1.8-lcp-evidence.json` | full (38 lines) | HIGH — machine-readable LCP measurements |
| `.planning/codebase/AESTHETIC-OF-RECORD.md` | 1–161 (full) | HIGH — AES-01..04 standing rules |
| `.planning/research/PITFALLS.md` | lines 1–30, 230–283 | HIGH — Anti-Pattern #5 context, Pitfall #10 |
| `components/animation/ghost-label.tsx` | 1–23 (full) | HIGH — intervention target, confirmed 23 LOC Server Component |
| `tests/v1.8-lcp-diagnosis.spec.ts` | 1–153 (full) | HIGH — Plan 01 template |
| `tests/v1.8-baseline-capture.spec.ts` | 1–95 (full) | HIGH — AES-04 pixel-diff harness |
| `playwright.config.ts` | 1–37 (full) | HIGH — SwiftShader caveat confirmed at lines 24-26 |
| `next.config.ts` | 1–25 (full) | HIGH — `optimizePackageImports: ["lucide-react"]` only; Phase 61 extends |
| `package.json` | lines 1–30 | HIGH — @playwright/test + @axe-core/playwright present; no new deps confirmed |
| `components/layout/lenis-provider.tsx` | 1–101 (full) | HIGH — rIC deferral + autoResize:true contract |
| `app/globals.css` | lines 1468–1495 | HIGH — `.sf-hero-deferred { opacity: 0 }` at line 1486 |
| `app/page.tsx` | lines 40–59 | HIGH — GhostLabel call site confirmed |
| `.planning/REQUIREMENTS.md` | lines 28–57 | HIGH — LCP-01..03, AES-01..04, VRF-04 |
| `.planning/ROADMAP.md` | lines 924–933 | HIGH — Phase 60 success criteria |
| Codebase grep for `content-visibility` in source | components/, app/ | HIGH — zero matches confirmed |

---

## Validation Architecture

> REQUIRED — drives Nyquist gate. Maps every measurable check to requirement IDs.
> "Measurable" means it can be confirmed via a specific CLI command, test, or file check.

### Plan 01 Acceptance Criteria

| Check | How to verify | Requirement |
|-------|--------------|-------------|
| **P01-01** Spec file exists at correct path | `ls tests/v1.8-lcp-candidates.spec.ts` exits 0 | D-06 |
| **P01-02** Output JSON written at correct path | `ls .planning/codebase/v1.8-lcp-candidates.json` exits 0 | D-06 |
| **P01-03** JSON contains all 4 viewports | `node -e "const d=require('./.planning/codebase/v1.8-lcp-candidates.json'); console.log(d.map(v=>v.viewport))"` — must print all 4 viewport names | D-06 |
| **P01-04** Each viewport entry has at least 1 candidate | `node -e "const d=require('./.planning/codebase/v1.8-lcp-candidates.json'); d.forEach(v=>{ if(!v.candidates.length) throw new Error(v.viewport+' empty') })"` exits 0 | D-06 |
| **P01-05** Each viewport entry has exactly 1 `isLcp:true` candidate | `node -e "const d=require('./.planning/codebase/v1.8-lcp-candidates.json'); d.forEach(v=>{ const n=v.candidates.filter(c=>c.isLcp).length; if(n!==1) throw new Error(v.viewport+' isLcp count='+n) })"` exits 0 | D-06 |
| **P01-06** Mobile-360 LCP candidate matches Phase 57 diagnosis selector (GhostLabel `span.sf-display...`) | Manual inspection of JSON entry for `mobile-360x800` + `iphone13-390x844` — selector should contain `sf-display` | LCP-02 |
| **P01-07** JSON shape includes `qualityTier` field per viewport | `node -e "const d=require('./.planning/codebase/v1.8-lcp-candidates.json'); d.forEach(v=>{ if(typeof v.qualityTier==='undefined') throw new Error(v.viewport+' missing qualityTier') })"` exits 0 | `feedback_consume_quality_tier.md` |
| **P01-08** Spec runs against production build (not dev) — hard gate | `pnpm exec playwright test tests/v1.8-lcp-candidates.spec.ts --project=chromium` — must pass with 0 errors against `pnpm start` server | D-06 |
| **P01-09** Schema extends `v1.8-lcp-evidence.json` shape (viewport, capturedAt fields present) | `node -e "const d=require('./.planning/codebase/v1.8-lcp-candidates.json'); if(!d[0].viewport||!d[0].capturedAt) throw new Error('schema mismatch')"` exits 0 | VRF-04 (Phase 62 reuse) |

### Plan 02 Acceptance Criteria

| Check | How to verify | Requirement |
|-------|--------------|-------------|
| **P02-01** `content-visibility: auto` applied to GhostLabel leaf span only (NOT section wrapper) | `grep -n "contentVisibility\|content-visibility" components/animation/ghost-label.tsx` — must return a match; `grep -rn "contentVisibility\|content-visibility" components/blocks/ app/` must return zero matches (section wrappers clean) | LCP-02 / Anti-Pattern #5 |
| **P02-02** `containIntrinsicSize` present in same style block as `contentVisibility` | `grep -n "containIntrinsicSize\|contain-intrinsic-size" components/animation/ghost-label.tsx` — returns a match | LCP-02 |
| **P02-03** LHCI median LCP <1.0s on mobile after intervention | Run `pnpm exec playwright test` or `pnpm lhci autorun` (Phase 58 LHCI gate) — 5 runs, mobile emulation, median LCP reported as <1000ms | LCP-01 |
| **P02-04** LHCI median CLS <=0 after intervention | Same LHCI run — median CLS=0 (verify no layout shift from containIntrinsicSize mis-tuning) | LCP-01 |
| **P02-05** LHCI Performance score >=97 | Same LHCI run — median Performance >=97 | LCP-01 |
| **P02-06** GhostLabel NO LONGER appears as mobile LCP candidate in post-intervention `v1.8-lcp-candidates.json` re-run | Re-run `pnpm exec playwright test tests/v1.8-lcp-candidates.spec.ts --project=chromium` after Plan 02 ships; check that `mobile-360x800` and `iphone13-390x844` `isLcp:true` candidate selector does NOT contain `sf-display` / `data-ghost-label` | LCP-02 |
| **P02-07** AES-04 pixel-diff <0.5% per page vs v1.8-start baselines | Run `pnpm exec playwright test tests/v1.8-baseline-capture.spec.ts --project=chromium` in comparison mode (without `--update-snapshots`); visual diff reported <0.5% for all 20 page×viewport combos | LCP-03 / AES-04 |
| **P02-08** `nextjs-portal` count === 0 during pixel-diff run | Hard gate in `v1.8-baseline-capture.spec.ts:72` — already enforced; verify test does not skip this assertion | AES-04 |
| **P02-09** GhostLabel still visible when THESIS section scrolled into viewport (not permanently hidden) | Chrome-devtools MCP scroll-test: navigate to `/`, scroll to THESIS section, confirm "THESIS" GhostLabel renders at ~4% opacity | AES-01 / LCP-03 |
| **P02-10** T1 pixel-sort visible on desktop | Chrome-devtools MCP scroll-test: confirm EntrySection pixel-sort ring renders on desktop viewport after intervention | AES-01 (`feedback_trademark_primitives.md`) |
| **P02-11** T4 `//` separator visible on desktop | Chrome-devtools MCP scroll-test: confirm VL-05 magenta `//` overlay visible in EntrySection on desktop | AES-01 (`feedback_trademark_primitives.md`) |
| **P02-12** GSAP motion contract intact — single ticker, reduced-motion kills timeline | Chrome-devtools MCP scroll-test with `prefers-reduced-motion: reduce` emulated: hero elements remain at start-state opacity; no GSAP warnings in console | VRF-03 / AES-01 |
| **P02-13** Lenis `autoResize: true` contract preserved | `grep "autoResize: true" components/layout/lenis-provider.tsx` exits 0 (PF-04 contract) | `feedback_pf04_autoresize_contract.md` |
| **P02-14** D-07 WebPageTest real-device run completed | File exists: `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md` AND contains iPhone 13 Safari median LCP value < 1500ms | VRF-04 / D-07 |
| **P02-15** AES-03 cohort review sign-off dropped | File exists: `.planning/phases/60-lcp-element-repositioning/60-AES03-COHORT.md` with user sign-off note | AES-03 / D-08 |
| **P02-16** `containIntrinsicSize` value derived from production measurement, not guessed | Plan 02 Wave 0 includes `getBoundingClientRect()` measurement step; measured height documented in plan notes or commit message | LCP-02 / `feedback_measure_descriptors_from_woff2.md` methodology |
| **P02-17** No new dependencies introduced | `git diff package.json` shows no new entries in `dependencies` or `devDependencies` | D-06 (CONTEXT) |
| **P02-18** TypeScript compilation clean after change | `pnpm tsc --noEmit` exits 0 (`contentVisibility` and `containIntrinsicSize` are valid React `CSSProperties` fields) | standing CLAUDE.md constraint |
| **P02-19** Desktop LHCI does not regress vs Phase 59 baseline | LHCI desktop run median LCP <=116ms (warm, Phase 57 baseline) — informational monitor per D-05 | LCP-01 (desktop monitor-only) |

### Requirement cross-reference summary

| Requirement | Covered by |
|-------------|-----------|
| LCP-01 (LCP <1.0s mobile, LHCI median of 5) | P02-03, P02-04, P02-05 |
| LCP-02 (intervention = diagnosed candidate b, leaf not wrapper) | P01-06, P02-01, P02-02, P02-06, P02-16 |
| LCP-03 (pixel-diff <0.5%, cohort review no escalation) | P02-07, P02-09, P02-15 |
| AES-01 (extract from shipped code, trademark primitives visible) | P02-09, P02-10, P02-11, P02-12 |
| AES-04 (per-phase pixel-diff <=0.5%) | P02-07, P02-08 |
| VRF-04 (mid-milestone real-device checkpoint) | P02-14 |

---

## RESEARCH COMPLETE

The most consequential finding for the planner is the **Lenis interaction analysis (Q2)**: `content-visibility: auto` is safe for the GhostLabel leaf because Lenis uses native `scrollTop` manipulation (not CSS transform-based virtual scroll), so the browser's intersection testing for `content-visibility` works against the real scroll position. However, the `SFSection` has `overflow-x: hidden` (confirmed at `app/page.tsx:47`), which must be verified not to create a scroll-container boundary that puts the GhostLabel permanently "in-viewport" from the browser's perspective — if it does, `content-visibility: auto` will not defer the paint and the intervention will be a no-op. Plan 02 Wave 0 must confirm this with a post-intervention LCP re-run before claiming success. The D-04 reactive posture (measure first, decide next step from data) is architecturally correct and precisely handles this uncertainty: ship (b), re-run the candidates script, check whether GhostLabel is still the LCP winner, escalate only if it is.
