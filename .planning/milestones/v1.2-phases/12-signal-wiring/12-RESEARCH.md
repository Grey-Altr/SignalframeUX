# Phase 12: SIGNAL Wiring - Research

**Researched:** 2026-04-06
**Domain:** WebGL uniform bridging via CSS custom properties + GSAP ScrollTrigger placement
**Confidence:** HIGH — all findings verified against actual source files

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
None — all implementation choices are at Claude's discretion. This is a pure infrastructure phase.

### Claude's Discretion
All implementation choices: cache strategy, uniform naming, ScrollTrigger parameters, section selection for SignalMotion placement.

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INT-04 | SignalOverlay CSS var changes (`--signal-intensity`, `--signal-speed`, `--signal-accent`) are read by WebGL scenes (GLSLHero and/or SignalMesh) via cached module-level reads — no per-frame `getComputedStyle` | Module-level cache pattern identified; GSAP ticker insertion point confirmed in both scene files; uniform names and ranges documented |
| INT-03 | SignalMotion component wraps at least 3 showcase sections on the homepage with scroll-driven animation active | SignalMotion is complete and tested; 4 target sections identified in `app/page.tsx`; reduced-motion guard confirmed working in component |
</phase_requirements>

---

## Summary

Phase 12 wires two existing but disconnected systems: the SignalOverlay control panel (which writes CSS vars to `:root`) and the WebGL scenes (which currently ignore those vars). The bridge is purely additive — no existing behavior changes. Both `glsl-hero.tsx` and `signal-mesh.tsx` already have GSAP ticker callbacks that accumulate `uTime`; the INT-04 work adds 2–3 lines to those same callbacks to read cached `--signal-*` float values and push them to new uniforms.

The INT-03 work is even simpler: `SignalMotion` is a fully implemented component that has never been placed on any page. Wrapping four homepage sections with `<SignalMotion>` and its defaults requires no changes to the component itself, only to `app/page.tsx`.

The critical constraint for both requirements is performance. INT-04 must use module-level caching — not per-frame `getComputedStyle` — to preserve the Lighthouse 100/100 score. INT-03 must respect `prefers-reduced-motion`, which `SignalMotion` already handles by calling `gsap.set(inner, to)` with no ScrollTrigger setup.

**Primary recommendation:** Add a module-level signal cache to each WebGL scene file with MutationObserver invalidation (reusing the pattern already in `color-resolve.ts`), then wire the cached values to new uniforms in the existing ticker callbacks. Place SignalMotion on MANIFESTO, SIGNAL/FRAME, API, and COMPONENTS sections.

---

## Standard Stack

### Core (all already installed)
| Library | Version | Purpose | Already Used |
|---------|---------|---------|--------------|
| GSAP 3.12 | `^3.12` | Ticker as WebGL render driver; ScrollTrigger for SignalMotion | Yes — `lib/gsap-core.ts` |
| Three.js | r160+ | WebGL renderer, ShaderMaterial, uniforms | Yes — `components/animation/` |
| `useGSAP` | bundled with GSAP | Scope-aware GSAP hook for React | Yes — both WebGL scenes |

### No New Dependencies
This phase adds zero new packages. Every tool required is already in the project.

---

## Architecture Patterns

### Verified Project Structure (relevant to this phase)
```
components/animation/
├── glsl-hero.tsx           # GSAP ticker at line 286 — INSERT signal reads here
├── signal-mesh.tsx         # GSAP ticker at line 276 — INSERT signal reads here
├── signal-overlay.tsx      # Writes --signal-{intensity,speed,accent} to :root
└── signal-motion.tsx       # Complete component — just needs page placement

app/
└── page.tsx                # Homepage — wrap 4 SFSection children with SignalMotion

lib/
└── color-resolve.ts        # MutationObserver cache pattern to REPLICATE (not reuse)
```

### Pattern 1: Module-Level Signal Cache (INT-04)

**What:** Float values for `--signal-intensity`, `--signal-speed`, and `--signal-accent` are read once on mount, stored in module-level variables, and updated only when `:root` style changes (MutationObserver). The GSAP ticker reads from the cache, never from the DOM.

**Why module-level (not component state):** The GSAP ticker callback is a closure registered via `gsap.ticker.add`. Module-level variables are the correct pattern for values that must be read inside closures without triggering React re-renders.

**Where to put the cache:** Each scene file (`glsl-hero.tsx`, `signal-mesh.tsx`) gets its own module-level cache block. Do NOT add `--signal-*` to `color-resolve.ts` — that utility is for OKLCH color tokens only, not numeric float parameters. The module comment ("Phase 6: No caching") and the magenta fallback confirm this contract.

**Verified pattern from `color-resolve.ts` (the MutationObserver approach to replicate):**
```typescript
// Source: lib/color-resolve.ts lines 38-50
cacheObserver = new MutationObserver(() => {
  colorCache.clear();
});
cacheObserver.observe(document.documentElement, {
  attributeFilter: ["class", "style"],
});
```

**Complete pattern for each WebGL scene file:**
```typescript
// --- Module-level signal cache (INT-04) ---
// Float values for --signal-* CSS vars. Read once on mount, updated via
// MutationObserver on :root style change. Never read inside GSAP ticker.

let _signalIntensity = 0.5;
let _signalSpeed = 1.0;
let _signalAccent = 0.0;
let _signalObserver: MutationObserver | null = null;

function readSignalVars(): void {
  const style = getComputedStyle(document.documentElement);
  _signalIntensity = parseFloat(style.getPropertyValue("--signal-intensity") || "0.5");
  _signalSpeed     = parseFloat(style.getPropertyValue("--signal-speed")     || "1");
  _signalAccent    = parseFloat(style.getPropertyValue("--signal-accent")    || "0");
}

function ensureSignalObserver(): void {
  if (_signalObserver || typeof window === "undefined") return;
  readSignalVars(); // Initial read
  _signalObserver = new MutationObserver(readSignalVars);
  _signalObserver.observe(document.documentElement, {
    attributeFilter: ["style"],
  });
}
```

**Inside the component's `useGSAP` callback, before ticker registration:**
```typescript
ensureSignalObserver();
```

**Inside the existing GSAP ticker function:**
```typescript
const tickerFn = () => {
  if (!uniformsRef.current) return;
  uniformsRef.current.uTime.value += 0.016;
  // INT-04: read from module-level cache — no DOM access in ticker
  uniformsRef.current.uIntensity.value = _signalIntensity;
  uniformsRef.current.uSpeed.value     = _signalSpeed;
  // uAccent only in glsl-hero (hue shift in fragment shader)
};
```

**Why `attributeFilter: ["style"]` only (not `["class", "style"]`):**
SignalOverlay writes via `document.documentElement.style.setProperty(...)`. That only triggers a `style` attribute mutation, not a `class` mutation. Class changes (theme toggle) do not change `--signal-*` vars. Filtering to `style` only reduces unnecessary invalidations.

### Pattern 2: GLSL Uniform Declarations (INT-04)

**What:** The FRAGMENT_SHADER in `glsl-hero.tsx` currently has 6 uniforms. Two new uniforms must be declared in GLSL and added to the `uniforms` object. The `uIntensity` uniform scales the FBM noise amplitude. The `uSpeed` uniform scales the `uTime` increment.

**Current fragment shader uniforms (lines 56-62, verified):**
```glsl
uniform float uTime;
uniform float uScroll;
uniform vec3  uColor;
uniform float uGridDensity;
uniform float uDitherOpacity;
uniform vec2  uResolution;
```

**New uniforms to add to FRAGMENT_SHADER:**
```glsl
uniform float uIntensity;  // 0.0–1.0, scales FBM noise amplitude
uniform float uAccent;     // 0–360, hue rotation degrees
```

**Note:** `uSpeed` is a time accumulation multiplier — it belongs in the ticker callback (multiplies the time delta), not in the shader. The fragment shader does not need `uSpeed` declared.

**New uniforms to add to VERTEX_SHADER in `signal-mesh.tsx`:**
The vertex shader already has `uTime` and `uDisplacement`. No new GLSL declarations needed for `uIntensity` — it maps directly to the existing `uDisplacement` uniform. Use `uSpeed` as a ticker time multiplier only.

**Uniforms object additions per scene:**

`glsl-hero.tsx` — add to `uniforms` object in `buildScene`:
```typescript
uIntensity: { value: 0.5 },
uAccent:    { value: 0.0 },
```

Update `uniformsRef` type:
```typescript
uIntensity: THREE.IUniform<number>;
uAccent:    THREE.IUniform<number>;
```

`signal-mesh.tsx` — no new GLSL uniforms needed. `_signalIntensity` maps to the scale of `uDisplacement`. `_signalSpeed` controls the `uTime` increment rate. Handle both in the ticker callback.

### Pattern 3: SignalMotion Placement (INT-03)

**What:** Wrap the inner content of 4 homepage sections with `<SignalMotion>`. The component already handles `prefers-reduced-motion` by calling `gsap.set(inner, to)` on line 79 — children render at final state with no animation.

**Homepage sections confirmed in `app/page.tsx` (lines 33–53):**

| Section label | data-section | Candidate | Rationale |
|---|---|---|---|
| HERO | hero | Skip | Has its own GLSL animation |
| MANIFESTO | manifesto | YES | Text-heavy block, entrance scrub adds drama |
| SIGNAL / FRAME | signal | YES | Dual-layer demo, motion reinforces the concept |
| STATS | stats | Skip | Data band — motion would distract from readability |
| API | code | YES | Code section, scrub-in as user arrives |
| COMPONENTS | grid | YES | Component grid, staggered entrance |

**Placement pattern in `app/page.tsx`:**
```tsx
// Source: components/animation/signal-motion.tsx — component API
import { SignalMotion } from "@/components/animation/signal-motion";

// Wrap the block component inside the SFSection, not the SFSection itself
<SFSection label="MANIFESTO" data-bg-shift="black" data-section="manifesto" data-cursor className="py-0 relative overflow-hidden">
  <GhostLabel text="MANIFEST" className="-left-4 top-1/2 -translate-y-1/2" />
  <SignalMotion from={{ opacity: 0.4, y: 24 }} to={{ opacity: 1, y: 0 }} scrub={1}>
    <ManifestoBand />
  </SignalMotion>
</SFSection>
```

**Why wrap the block, not the SFSection:** `SFSection` carries `data-bg-shift` which drives GSAP scroll targeting in `globals.css`. Wrapping it in `SignalMotion` would change the scroll trigger parent and could break background shift timing. Wrap only the content block.

**Default props for all four sections:**
```typescript
from={{ opacity: 0.4, y: 24 }}
to={{ opacity: 1, y: 0 }}
scrub={1}
start="top 85%"
end="top 40%"
```

These are conservative — they enhance without dominating. The opacity floor at 0.4 (not 0) ensures content is never invisible on slow scrollers.

### Anti-Patterns to Avoid

- **`getComputedStyle` inside the GSAP ticker:** This is the primary performance violation. Even one call per frame at 60fps causes measurable TBT regression. The module-level cache pattern exists precisely to avoid this.
- **Using `resolveColorToken` / `resolveColorAsThreeColor` for `--signal-accent`:** These utilities run a 1x1 canvas probe. `--signal-accent` is a plain float (hue degrees, e.g. `"180"`). Passing `"180"` as a CSS color string to a canvas context returns black. Use `parseFloat()` only.
- **Wrapping `<SFSection>` with `<SignalMotion>`:** The SFSection carries `data-bg-shift`, which GSAP targets for background color transitions on scroll. Wrapping the section would displace the trigger element and break bg-shift timing.
- **Adding `--signal-*` reads to `color-resolve.ts`:** That module is for OKLCH color tokens only. Its magenta fallback and canvas probe design are wrong for numeric parameters. The signal cache belongs in each consuming scene file.
- **Adding a second `setInterval` or `rAF` loop to poll CSS vars:** The GSAP ticker already runs at 60fps. Any additional loop is redundant. The MutationObserver fires only when the user actually moves a slider — zero cost during normal viewing.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS var change detection | Custom polling loop | MutationObserver on `attributeFilter: ["style"]` | Already established in `color-resolve.ts` |
| Scroll-driven entrance animation | Manual `window.scroll` listener | `SignalMotion` (already complete) | Component is implemented, tested, reduced-motion aware |
| Reduced-motion guard for SignalMotion | Manual `matchMedia` in page component | SignalMotion's built-in guard (line 78) | Already calls `gsap.set(inner, to)` on reduced-motion |
| WebGL render loop | New `requestAnimationFrame` | GSAP ticker (already the render driver) | Single loop — second loop creates phase conflicts |

---

## Common Pitfalls

### Pitfall 1: Per-Frame `getComputedStyle` in GSAP Ticker (Critical)
**What goes wrong:** Calling `getComputedStyle(document.documentElement).getPropertyValue("--signal-intensity")` inside the GSAP ticker fires a forced synchronous layout on every frame (~60x/sec). Lighthouse TBT spikes. Chrome flame chart shows `Recalculate Style` entries on every tick.
**Why it happens:** `getComputedStyle` flushes pending style recalculations synchronously. In a rAF loop, this cannot be batched.
**How to avoid:** Module-level cache variables + MutationObserver. Only `readSignalVars()` calls `getComputedStyle`, and it only fires when the user moves a SignalOverlay slider.
**Warning signs:** Lighthouse Performance drops after INT-04 wiring; `Recalculate Style` in Performance flame chart aligned with GSAP tick markers.

### Pitfall 2: `--signal-accent` Treated as a Color Token (Critical)
**What goes wrong:** `--signal-accent` value is `"0"`, `"90"`, `"180"` etc. — plain integers representing hue degrees. If passed to a Canvas 2D `fillStyle`, the browser treats the string as an invalid color and returns black `{ r:0, g:0, b:0 }`. The uniform receives `0.0, 0.0, 0.0` instead of the hue value.
**How to avoid:** `parseFloat(style.getPropertyValue("--signal-accent") || "0")`. Never route through `resolveColorToken`.

### Pitfall 3: Wrapping SFSection Instead of Its Content (INT-03)
**What goes wrong:** `<SignalMotion>` wrapping an `<SFSection>` changes the scroll trigger parent for the bg-shift GSAP targeting. The background color transitions may fire at wrong scroll positions or not fire at all.
**How to avoid:** Wrap only the block component inside the section, not the SFSection itself.

### Pitfall 4: `--signal-*` CSS Var Defaults Not Present (Pre-condition check)
**What goes wrong:** Phase 10 (FND-01) was confirmed complete per STATE.md. However: the architecture doc `ARCHITECTURE.md` line 79 confirms "FND-01 FIRST" as a known dependency. Before writing any WebGL uniform reads, verify `--signal-intensity: 0.5`, `--signal-speed: 1`, `--signal-accent: 0` are present in `app/globals.css`. If missing, `readSignalVars()` returns `0.0` for all three (empty string → `parseFloat("")` = NaN → fallback kicks in).
**How to avoid:** Read `app/globals.css` at the start of INT-04 to confirm defaults exist. The fallback values in `readSignalVars()` (`|| "0.5"`, `|| "1"`, `|| "0"`) provide belt-and-suspenders safety even if globals.css check is skipped.

### Pitfall 5: HMR Double-Registration of MutationObserver
**What goes wrong:** In development with Turbopack HMR, module-level code can re-execute. If `_signalObserver` is not null-guarded, a second observer is registered on the same element, and `readSignalVars()` fires twice per slider interaction.
**How to avoid:** The `ensureSignalObserver()` function already guards: `if (_signalObserver || typeof window === "undefined") return;`. This is the same null-guard pattern used by `ensureCacheObserver()` in `color-resolve.ts`.

---

## Code Examples

### Complete Module-Level Signal Cache Block
```typescript
// Source: lib/color-resolve.ts (MutationObserver pattern) — adapted for numeric signal vars

// Place at module top, below imports — before component definition
let _signalIntensity = 0.5;
let _signalSpeed     = 1.0;
let _signalAccent    = 0.0;
let _signalObserver: MutationObserver | null = null;

function readSignalVars(): void {
  const style = getComputedStyle(document.documentElement);
  _signalIntensity = parseFloat(style.getPropertyValue("--signal-intensity") || "0.5");
  _signalSpeed     = parseFloat(style.getPropertyValue("--signal-speed")     || "1");
  _signalAccent    = parseFloat(style.getPropertyValue("--signal-accent")    || "0");
}

function ensureSignalObserver(): void {
  if (_signalObserver || typeof window === "undefined") return;
  readSignalVars();
  _signalObserver = new MutationObserver(readSignalVars);
  _signalObserver.observe(document.documentElement, {
    attributeFilter: ["style"],
  });
}
```

### Ticker Modification for `glsl-hero.tsx`
```typescript
// In useGSAP callback, before gsap.ticker.add:
ensureSignalObserver();

const tickerFn = () => {
  if (!uniformsRef.current) return;
  // Existing: time accumulation, scaled by cached speed
  uniformsRef.current.uTime.value += 0.016 * _signalSpeed;
  // New: push cached signal values to uniforms
  uniformsRef.current.uIntensity.value = _signalIntensity;
  uniformsRef.current.uAccent.value    = _signalAccent;
};
```

### Ticker Modification for `signal-mesh.tsx`
```typescript
// In useGSAP callback, before gsap.ticker.add:
ensureSignalObserver();

const tickerFn = () => {
  if (!uniformsRef.current) return;
  // Existing: time accumulation, scaled by cached speed
  uniformsRef.current.uTime.value += 0.016 * _signalSpeed;
  // New: scale displacement amplitude by intensity
  // Note: uDisplacement is also written by ScrollTrigger (scroll progress * 0.4)
  // Signal intensity scales the max displacement, scroll drives it within that range
  if (meshRef.current) {
    meshRef.current.rotation.y += 0.003 * _signalSpeed;
  }
};
```

**Note on `uDisplacement` in signal-mesh:** ScrollTrigger sets `uDisplacement = scrollProgress * 0.4`. Intensity should scale the ceiling: `uDisplacement = scrollProgress * 0.4 * _signalIntensity * 2`. Update the ScrollTrigger `onUpdate` callback as well, not just the ticker.

### GLSL Fragment Shader Addition for `glsl-hero.tsx`
```glsl
// Add to existing uniform declarations:
uniform float uIntensity;  // 0.0–1.0, scales FBM noise amplitude
uniform float uAccent;     // 0–360, hue rotation degrees (reserved for future use)

// In main(), replace:
//   float n = fbm(uv * 4.0 + vec2(uTime * 0.1, uTime * 0.07));
// With:
float n = fbm(uv * 4.0 + vec2(uTime * 0.1, uTime * 0.07)) * (0.5 + uIntensity * 0.5);
//                                                                    ^^^^^^^^^^^^^^^^^^^
// This scales noise amplitude: at uIntensity=0 → 50% amplitude, at 1.0 → 100%
// Floor at 50% prevents the scene from going completely dark at intensity=0
```

### SignalMotion Placement in `app/page.tsx`
```tsx
// Import at top of file (other animation imports already present)
import { SignalMotion } from "@/components/animation/signal-motion";

// MANIFESTO section
<SFSection label="MANIFESTO" data-bg-shift="black" data-section="manifesto" data-cursor className="py-0 relative overflow-hidden">
  <GhostLabel text="MANIFEST" className="-left-4 top-1/2 -translate-y-1/2" />
  <SignalMotion from={{ opacity: 0.4, y: 24 }} to={{ opacity: 1, y: 0 }} scrub={1}>
    <ManifestoBand />
  </SignalMotion>
</SFSection>

// SIGNAL / FRAME section
<SFSection label="SIGNAL / FRAME" data-bg-shift="white" data-section="signal" data-cursor className="py-0 relative overflow-hidden">
  <GhostLabel text="SIGNAL" className="right-0 top-0" />
  <SignalMotion from={{ opacity: 0.4, y: 24 }} to={{ opacity: 1, y: 0 }} scrub={1}>
    <DualLayer />
  </SignalMotion>
</SFSection>

// API section
<SFSection label="API" data-bg-shift="white" data-section="code" data-cursor className="py-0 relative overflow-hidden">
  <GhostLabel text="CODE" className="-left-4 top-1/4" />
  <SignalMotion from={{ opacity: 0.4, y: 24 }} to={{ opacity: 1, y: 0 }} scrub={1}>
    <CodeSection />
  </SignalMotion>
</SFSection>

// COMPONENTS section
<SFSection label="COMPONENTS" data-bg-shift="black" data-section="grid" data-cursor className="py-0 relative overflow-hidden">
  <GhostLabel text="GRID" className="right-0 bottom-0" />
  <SignalMotion from={{ opacity: 0.4, y: 24 }} to={{ opacity: 1, y: 0 }} scrub={1}>
    <ComponentGrid />
  </SignalMotion>
</SFSection>
```

---

## State of the Art

| Old Pattern | Current Pattern | Status in This Phase |
|---|---|---|
| Per-frame `getComputedStyle` (color-resolve.ts "Phase 6: No caching") | Module-level cache + MutationObserver (color-resolve.ts TTL path) | INT-04 uses the established TTL cache pattern, adapted for float vars |
| SignalMotion created but never placed | SignalMotion placed on 4 sections | INT-03 activates the component |
| SignalOverlay writes CSS vars, nothing reads them | CSS vars → module cache → WebGL uniforms | INT-04 closes the loop |

---

## Open Questions

1. **`uAccent` shader implementation in GLSLHero**
   - What we know: `--signal-accent` is 0–360 hue degrees. GLSLHero renders a monochrome output (`uColor * dithered`). There is no OKLCH or hue-shift logic in the current fragment shader.
   - What's unclear: Whether `uAccent` should shift the `uColor` hue in GLSL (requires OKLCH→RGB conversion in shader, non-trivial), or simply modulate grid density/opacity as a simpler expressive parameter.
   - Recommendation: For v1.2 scope, wire `uAccent` to uniform and store the cached value, but implement it as a grid density modifier (`uGridDensity += uAccent * 0.05`) rather than hue math. The uniform is available for future shader work without the GLSL complexity.

2. **ScrollTrigger conflict between `SignalMotion` and existing bg-shift targeting**
   - What we know: The bg-shift GSAP targeting in `globals.css` watches `[data-bg-shift]` attributes. `SignalMotion` adds a wrapping div between `SFSection` and the block component.
   - What's unclear: Whether bg-shift ScrollTrigger uses the `SFSection` element itself as the trigger, or its bounding box. If it uses the element, adding an inner wrapper should not affect it.
   - Recommendation: Verify by testing the MANIFESTO section after placement. The `data-bg-shift` attribute stays on the `SFSection` element — `SignalMotion` wraps only the content, not the section container.

---

## Validation Architecture

`workflow.nyquist_validation` is absent from `.planning/config.json` — treat as enabled.

### Test Framework

No test framework is installed in this project. The `package.json` scripts are: `dev`, `build`, `start`, `lint`, `registry:build`. No `test` script, no jest/vitest/playwright config files.

| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | None — Wave 0 must add a framework |
| Quick run command | N/A |
| Full suite command | `pnpm lint` (only automated check available) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INT-04 | Slider changes affect WebGL uniform in real time | manual-only | Manual: open SignalOverlay, move intensity slider, observe GLSLHero noise amplitude change | N/A |
| INT-04 | No `getComputedStyle` in GSAP ticker | static analysis | `grep -n "getComputedStyle" components/animation/glsl-hero.tsx components/animation/signal-mesh.tsx` — must return 0 lines inside ticker functions | N/A |
| INT-04 | `--signal-accent` read as parseFloat, not color probe | static analysis | `grep -n "resolveColorToken\|resolveColorAsThreeColor" components/animation/glsl-hero.tsx components/animation/signal-mesh.tsx` — must return 0 lines for signal-accent path | N/A |
| INT-03 | At least 3 sections have SignalMotion | static analysis | `grep -c "SignalMotion" app/page.tsx` — must return >= 3 | ❌ Wave 0 |
| INT-03 | Reduced-motion disables SignalMotion without errors | manual-only | Manual: enable `prefers-reduced-motion` in DevTools, reload, verify no JS errors in console and sections are visible at full opacity | N/A |

### Sampling Rate
- **Per task commit:** `pnpm lint`
- **Per wave merge:** `pnpm lint && pnpm build` (build catches TypeScript errors)
- **Phase gate:** `pnpm build` clean + manual reduced-motion check before `/pde:verify-work`

### Wave 0 Gaps
- No test framework — all behavioral validation is manual for this phase
- The static analysis checks (grep-based) are one-liners that can be run in the plan's verification steps without a framework
- No Wave 0 framework installation required — the phase is 2 targeted file modifications; framework overhead is not justified

*(All phase requirements are either manual-only or grep-verifiable. No test file scaffolding needed.)*

---

## Sources

### Primary (HIGH confidence)
- `/Users/greyaltaer/code/projects/SignalframeUX/components/animation/glsl-hero.tsx` — Verified: ticker at line 286, uniform structure lines 192–199, FRAGMENT_SHADER uniforms lines 56–62
- `/Users/greyaltaer/code/projects/SignalframeUX/components/animation/signal-mesh.tsx` — Verified: ticker at line 276, uniform structure lines 153–158, existing `uDisplacement` and `uTime`
- `/Users/greyaltaer/code/projects/SignalframeUX/components/animation/signal-overlay.tsx` — Verified: writes `--signal-intensity` (line 137), `--signal-speed` (line 143), `--signal-accent` (line 148) via `style.setProperty`
- `/Users/greyaltaer/code/projects/SignalframeUX/components/animation/signal-motion.tsx` — Verified: complete implementation, reduced-motion guard line 78, `gsap.fromTo` with `scrollTrigger` props, zero page placements
- `/Users/greyaltaer/code/projects/SignalframeUX/lib/color-resolve.ts` — Verified: MutationObserver pattern lines 38–50; `attributeFilter: ["class", "style"]`; magenta fallback for empty values line 108
- `/Users/greyaltaer/code/projects/SignalframeUX/app/page.tsx` — Verified: 6 SFSection instances; HERO, MANIFESTO, SIGNAL/FRAME, STATS, API, COMPONENTS confirmed
- `.planning/research/PITFALLS.md` — Pitfall 1 (per-frame getComputedStyle), Pitfall 7 (resolveColorToken for signal-accent) directly apply
- `.planning/research/ARCHITECTURE.md` — INT-04 data flow diagram and build order confirmed

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — FND-01 confirmed complete (Phase 10); Phase 12 confirmed not started
- `.planning/REQUIREMENTS.md` — INT-03 and INT-04 requirement text confirmed

---

## Metadata

**Confidence breakdown:**
- INT-04 cache strategy: HIGH — MutationObserver pattern verified in `color-resolve.ts`; insertion points verified in both scene files
- INT-04 uniform wiring: HIGH — uniform names, types, and ranges all verified from source
- INT-03 SignalMotion placement: HIGH — component API verified; homepage section structure verified
- GLSL `uAccent` implementation: MEDIUM — simple implementation recommended; hue-shift GLSL left as open question

**Research date:** 2026-04-06
**Valid until:** Stable — no external dependencies change; valid until source files are modified
