---
phase: 59-critical-path-restructure
reviewed: 2026-04-25T22:30:00.000Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - app/layout.tsx
  - components/layout/scale-canvas.tsx
  - components/layout/lenis-provider.tsx
  - scripts/measure-anton-descriptors.mjs
  - tests/v1.8-phase59-canvas-sync-inline.spec.ts
  - tests/v1.8-phase59-pixel-diff.spec.ts
  - tests/v1.8-phase59-anton-subset-coverage.spec.ts
  - tests/v1.8-phase59-anton-swap-cls.spec.ts
  - tests/v1.8-phase59-lenis-ric.spec.ts
findings:
  critical: 0
  warning: 4
  info: 5
  total: 9
status: issues_found
---

# Phase 59: Code Review Report

**Reviewed:** 2026-04-25T22:30:00.000Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Phase 59 introduces three critical-path restructures for v1.8 Speed of Light: canvas-sync inlining (CRT-01), Anton subset + display:swap with measured descriptors (CRT-02/03), and Lenis requestIdleCallback deferral (CRT-04). The implementation is largely well-executed and respects all v1.8 hard constraints: single-ticker rule (gsap.ticker remains the sole rAF source), PF-04 contract (`autoResize: true` literal preserved verbatim), inline-script rule (React inline-HTML-injection prop with static literals; no `defer`/`async`/`next/script beforeInteractive`), and the no-runtime-deps rule (opentype.js / fonttools confined to a measurement-time dev script).

The three inline `<script>` blocks in `app/layout.tsx` are XSS-impossible by construction — all three use template literals with **zero** interpolation of any user-controlled, request-derived, or runtime-derived value. The static-literal claim in the comments is verified.

Findings concentrate on:
1. A real bug in `LenisProvider`'s reduced-motion handler when the preference flips while the rIC is still pending (W-01).
2. Three sources of truth for the `1280` design-width constant (W-02), brittle to drift.
3. A silent hardcoded-fallback path in the measurement script that bypasses the "MEASURED" guarantee (W-03).
4. A doc/code contradiction in the pixel-diff spec where the comment claims `=== 0` but the gate is `<= 0.005` (W-04).

No critical issues. No security holes. Inline-script XSS surface verified clean.

## Critical Issues

(none)

## Warnings

### WR-01: Reduced-motion handler bypasses lenis init when rIC fires after preference flip

**File:** `components/layout/lenis-provider.tsx:73-80`
**Issue:** When the user enables `prefers-reduced-motion: reduce` AFTER mount but BEFORE the rIC-deferred `initLenis` fires (a window of up to 100ms), the `motionHandler` runs while `instance === null`, then no-ops both the destroy and ticker-remove branches. Once the rIC subsequently fires, `initLenis` creates a Lenis instance and registers a gsap.ticker callback unconditionally — without re-checking `mql.matches`. Result: the user's reduced-motion preference is silently ignored for the lifetime of the component.

**Fix:** Re-check the media query inside `initLenis` before constructing Lenis, OR cancel the pending rIC handle inside `motionHandler`:

```ts
const motionHandler = (e: MediaQueryListEvent) => {
  if (e.matches) {
    // Cancel any still-pending rIC/setTimeout so initLenis cannot fire later.
    const cancelRic = (window as Window & {
      cancelIdleCallback?: (h: number) => void;
    }).cancelIdleCallback;
    if (cancelRic) cancelRic(handle);
    else clearTimeout(handle);

    if (tickerCallback) gsap.ticker.remove(tickerCallback);
    if (instance) instance.destroy();
    lenisRef.current = null;
    setLenis(null);
  }
};
```

Alternatively, gate `initLenis`:

```ts
const initLenis = () => {
  if (mql.matches) return; // user flipped preference between mount and rIC fire
  instance = new Lenis({ ... });
  // ...
};
```

The cancel-handle approach is cleaner because it also frees the rIC slot.

---

### WR-02: Design-width constant `1280` duplicated across three files (drift hazard)

**File:** `app/layout.tsx:117`, `app/layout.tsx:128`, `components/layout/scale-canvas.tsx:6`
**Issue:** The literal `1280` (DESIGN_WIDTH) is declared three times:
- `scale-canvas.tsx:6` — `const DESIGN_WIDTH = 1280;`
- `app/layout.tsx:117` — `var ... DW=1280, ...` inside the pre-paint scaleScript IIFE
- `app/layout.tsx:128` — `window.innerWidth/1280` inside the canvasSyncScript IIFE

If `DESIGN_WIDTH` is changed in `scale-canvas.tsx` and either inline IIFE is forgotten, the pre-paint scale will diverge from the post-hydrate scale by exactly the change ratio, reintroducing CLS — silently, because TypeScript cannot reach into the inline-script string literals. The same drift hazard exists for `SHRINK = 435` and `IDLE = 800` (also duplicated between `scale-canvas.tsx` constants and the scaleScript IIFE).

**Fix:** Two viable options:
1. Hoist the constants to a non-component module (e.g., `lib/canvas-constants.ts`) and **build the IIFE strings via template-tagged constants** at module load time:

```ts
// lib/canvas-constants.ts
export const DESIGN_WIDTH = 1280;
export const SHRINK_VH = 435;
export const NAV_MORPH_VH_IDLE = 800;
```

```ts
// app/layout.tsx
import { DESIGN_WIDTH, SHRINK_VH, NAV_MORPH_VH_IDLE } from "@/lib/canvas-constants";
const scaleScript = `(function(){...DW=${DESIGN_WIDTH},SHRINK=${SHRINK_VH},IDLE=${NAV_MORPH_VH_IDLE};...})()`;
const canvasSyncScript = `(function(){...vw/${DESIGN_WIDTH};...})()`;
```

This preserves the static-literal XSS-impossible property (interpolated values are number literals from your own module), gives one source of truth, and a TypeScript change propagates everywhere.

2. If interpolation is rejected on principle, add a runtime invariant in `ScaleCanvas.useEffect` that asserts the `--sf-content-scale` set by the inline script equals `vw / DESIGN_WIDTH` and throws / `console.error` on drift. Cheaper than the refactor but only catches drift after deploy.

---

### WR-03: Measurement script silently substitutes hardcoded fallback metrics on fonttools failure

**File:** `scripts/measure-anton-descriptors.mjs:77-93`
**Issue:** When the `python3 -c "..."` call fails (fonttools not installed, brotli missing, font path moved), the script writes a `[WARN]` to stderr but then **continues** with hardcoded `unitsPerEm/sTypoAscender/sTypoDescender/xAvgCharWidth` values from a one-time 2026-04-25 measurement. The output `result` JSON labels these descriptors `// MEASURED` (lines 161-163), and the layout.tsx comment (`// MEASURED Task 4`) treats the script output as authoritative.

If the operator re-subsets the woff2 with different glyph coverage that affects `xAvgCharWidth`, or upgrades to a different Anton release, the script will output stale descriptors **without failing**. The `[WARN]` is easy to miss in CI logs or shell scrollback. This violates the "MEASURED via scripts/..." guarantee in the layout.tsx CRT-03 comment block.

**Fix:** Fail loudly when fonttools is unavailable. The fallback values are a maintenance burden, not a feature:

```js
try {
  // ... existing python3 execFileSync ...
} catch (err) {
  process.stderr.write(
    `[ERROR] fonttools required for descriptor measurement.\n` +
      `Install: pip3 install fonttools brotli\n` +
      `Cause: ${err.message}\n`
  );
  process.exit(1);
}
```

If a hardcoded fallback is desired for offline development, gate it behind an explicit `--allow-stale` CLI flag and tag the output `// STALE` instead of `// MEASURED`.

---

### WR-04: Pixel-diff spec comment contradicts its actual assertion (`=== 0` vs `<= 0.005`)

**File:** `tests/v1.8-phase59-pixel-diff.spec.ts:16-18` and `:89-98`
**Issue:** The header comment states:
> Plan A strict gate: ratio === 0 (any diff is a regression, not just > 0.5%).

But the assertion at line 96-98 is `expect(ratio).toBeLessThanOrEqual(MAX_DIFF_RATIO)` with `MAX_DIFF_RATIO = 0.005`. The inline comment at line 92-94 acknowledges this and says the strict-zero rule is "enforced as a comment" — meaning it is not enforced at all. A future Plan-A-only invisible regression of 0.4% would pass this test silently while the spec's stated contract is `=== 0`.

**Fix:** Pick one and make it real. Two options:
1. Strict Plan A enforcement (matches comment): `expect(diffPx).toBe(0);` and document that Plan B/C tests use the 0.5% gate in a separate spec.
2. Relaxed AES-04 enforcement (matches current code): delete the `=== 0` claim from the header comment. Update the assertion message to "AES-04 0.5% gate" only.

The current state — strict claim, lax assertion — is a maintenance trap because reviewers reading the comment will assume regression coverage that does not exist.

## Info

### IN-01: `(window as any).lenis = instance` pollutes window globals via untyped assertion

**File:** `components/layout/lenis-provider.tsx:46`, `tests/v1.8-phase59-lenis-ric.spec.ts:81,88`
**Issue:** `(window as any).lenis` is the documented test-bridge for the lenis-ric spec, but `as any` defeats TypeScript and exposes the instance to any consumer that probes `window`. Tests rely on this surface (lines 81 and 88), so it cannot be removed without spec updates.

**Fix:** If keeping the bridge, declare a typed window augmentation in a `lib/types/window.d.ts`:

```ts
declare global {
  interface Window {
    lenis?: Lenis;
  }
}
```

Then `window.lenis = instance;` is type-safe and discoverable. If the bridge is test-only, gate it behind `process.env.NODE_ENV !== "production"` so the prop is dropped from prod bundles.

---

### IN-02: Python source string interpolation in measurement script is repo-static but brittle

**File:** `scripts/measure-anton-descriptors.mjs:51-59`
**Issue:** The fontPath is interpolated into Python source via `${fontPath.replace(/'/g, "\\'")}`. Since fontPath is `resolve(__dirname, "../app/fonts/Anton-Regular.woff2")` — fully repo-controlled — there is no security risk. However, the single-quote escape is incomplete: backslashes (Windows paths) and embedded `\n` are not handled. Anyone running this on a Windows checkout with a path containing backslashes would generate broken Python source.

**Fix:** Pass the path through argv instead of source interpolation. Cleanest variant:

```js
const pythonScript = `
import sys
from fontTools.ttLib import TTFont
font = TTFont(sys.argv[1])
print(font['head'].unitsPerEm)
print(font['OS/2'].sTypoAscender)
print(font['OS/2'].sTypoDescender)
print(font['OS/2'].sTypoLineGap)
print(font['OS/2'].xAvgCharWidth)
`;
const output = execFileSync("python3", ["-c", pythonScript, fontPath], { encoding: "utf8" });
```

This eliminates all source-injection concerns and works on every platform.

---

### IN-03: `output.split("\n").map(Number)` silently propagates `NaN` to descriptors

**File:** `scripts/measure-anton-descriptors.mjs:64-66`
**Issue:** If the fonttools output contains an empty trailing line, a stderr leak, or an unexpected log line, `Number("...")` returns `NaN` for that slot. The downstream math (`sTypoAscender / unitsPerEm`) propagates `NaN`, and the final output prints `"NaN%"` for the affected descriptor. The script does not validate the output shape before computing.

**Fix:** Validate after parse:

```js
if (output.length !== 5 || output.some((n) => !Number.isFinite(n))) {
  throw new Error(`Unexpected fonttools output: ${JSON.stringify(output)}`);
}
```

---

### IN-04: `ScrollTrigger.refresh()` runs on every resize/orientationchange/observed mutation

**File:** `components/layout/scale-canvas.tsx:82`
**Issue:** Every `applyScale()` invocation calls `ScrollTrigger.refresh()`. With the rAF debounce this is once per frame max during a resize gesture, but `refresh()` is documented-expensive (recomputes every trigger's start/end). Over a multi-second resize drag this can add up to dozens of full recomputations.

**Fix:** Out of scope for v1 (perf), and the rAF debounce is reasonable. Flagging for awareness only — if Phase 61 (Bundle Hygiene) or Phase 62 (Real-Device Verification) surfaces resize-jank reports, this is the first place to look. Possible mitigation later: throttle `refresh()` to every Nth applyScale() or call only on the trailing edge of a resize gesture.

---

### IN-05: Anton subset-coverage spec acknowledges that `document.fonts.check` does not validate per-glyph coverage

**File:** `tests/v1.8-phase59-anton-subset-coverage.spec.ts:85-94`
**Issue:** Test 3's own comment notes that `document.fonts.check` returns true if the FACE loaded, even when a specific glyph maps to `.notdef`. This is honest, but it means the spec cannot detect a re-subset that drops a required glyph (e.g., removing the trademark symbol again would not fail this test).

**Fix:** Acknowledged in-spec; visual QA + the `.webm` artifacts from `v1.8-phase59-anton-swap-cls.spec.ts` are the safety net. Optionally, harden by rendering each required corpus character into a hidden DOM node and asserting non-zero `clientWidth` (a `.notdef` box has predictable dimensions). Defer unless the corpus changes again.

---

_Reviewed: 2026-04-25T22:30:00.000Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
