# Phase 4: Above-the-Fold Lock - Research

**Researched:** 2026-04-06
**Domain:** Hero layout + animation timing, crafted error/empty states, reduced-motion QA
**Confidence:** HIGH — all findings derived from direct codebase inspection

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Hero Lock (ATF-01, ATF-02, ATF-03)
- Hero motion fires within 500ms: ScrambleText on heading + hero-mesh fade-in + single CTA pulse — three effects maximum
- Component count claim: show accurate count with "growing" label (e.g. "24 components and growing")
- Hero layout: polish only — adjust spacing/typography to blessed tokens, no structural redesign
- Performance: LCP < 1.0s, CLS = 0, GSAP must not cause content jump

#### Crafted States (ATF-04, ATF-05)
- Error page (app/error.tsx): FRAME+SIGNAL moment — SFContainer/SFText for structure, ScrambleText on error code, subtle VHS glitch effect
- Not-found page (app/not-found.tsx): same FRAME+SIGNAL approach — crafted 404 with ScrambleText on "404", brief message, navigation CTA
- Empty states: component browser, token explorer, API explorer — three empty states as first-class design moments
- Empty state visual: structural placeholder using SF primitives — SFStack with muted text, subtle border animation, contextual action CTA

#### Reduced Motion (ATF-06)
- Philosophy: intentional alternative design, not "animations off" — emphasis shifts to typography and spacing
- ScrambleText → instant text, stagger → instant grid, cursor → hidden, VHS → off, section-reveal → instant — all effects resolve to end state
- Hero in reduced-motion: heading visible immediately, hero-mesh static, CTA visible without pulse
- QA: manual browser QA with `prefers-reduced-motion: reduce`, document in SIGNAL-SPEC.md update

### Claude's Discretion
- Exact error page copy and messaging tone
- Empty state contextual messages per explorer
- Specific hero spacing adjustments to blessed tokens
- Reduced-motion CSS specifics beyond the stated effect changes

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ATF-01 | Hero at 1440x900 is a standalone SOTD jury moment — no scroll required to evaluate quality | Hero layout audit reveals non-blessed spacing values; hero right panel lacks component count claim; SOTD framing requires both panels to read as complete within 100vh |
| ATF-02 | Hero motion fires within 500ms of load | Current animation sequence has 2.3s delay before character reveal — needs restructured fast-path timeline for sub-500ms effect ignition |
| ATF-03 | Component count claim resolved honestly (show what's built accurately, "growing" label if appropriate) | stats-band claims "340" but only 16 components in explorer COMPONENTS array; SF layer has 28 components; "growing" framing resolves the gap |
| ATF-04 | Error page (app/error.tsx) is a crafted FRAME+SIGNAL moment, not a functional fallback | Current error.tsx is bare-minimum functional — no SF primitives, no ScrambleText, no FRAME+SIGNAL structure |
| ATF-05 | Empty states for component browser, token explorer, and API explorer designed as first-class interaction moments | ComponentsExplorer has no empty state — filtered=[] results in an empty grid with no feedback |
| ATF-06 | Reduced-motion experience QA'd as a standalone intentional design, not just "animations off" | CSS infrastructure is solid; GSAP globalTimeline.timeScale(0) wires runtime MQ changes; hero deferred elements are reset; gap is QA documentation and SIGNAL-SPEC.md update |
</phase_requirements>

---

## Summary

Phase 4 is a polish and integration phase — no new systems, only application of Phase 1+2+3 outputs to four target surfaces: hero, error page, not-found page, and empty states. The underlying infrastructure (SF primitives, SIGNAL effects, reduced-motion CSS) is fully built and working. The work is surgical application to specific components.

The hero has two distinct problems: (1) the current animation sequence delays visible motion until 2.3s after load, violating the 500ms requirement; (2) the right panel lacks a component count claim, and the existing claims elsewhere in the site are inflated (stats-band says "340" while the explorer shows 16 entries). The CONTEXT.md decision to use "X components and growing" resolves this honestly.

Error and not-found pages exist as functional stubs — they work but have no design intent. They use zero SF primitives, no GSAP effects, and generic layout. Elevating them to FRAME+SIGNAL moments requires wrapping with SFContainer/SFText, adding data-anim attributes, and wiring ScrambleText on the error code — matching the established pattern from page-animations.tsx. The ComponentsExplorer empty state (when search/filter returns zero results) is currently a silent empty grid — a first-class empty state requires a designed fallback inside the grid.

**Primary recommendation:** Start with ATF-02 (hero timing) because it unblocks SOTD readability, then ATF-03 (component count), then ATF-04/ATF-05 (crafted states), then ATF-06 (reduced-motion QA and SIGNAL-SPEC documentation).

---

## Standard Stack

### Core (already established — no new libraries)
| Tool | Version | Purpose | Status |
|------|---------|---------|--------|
| GSAP + ScrambleTextPlugin | 3.12 | ScrambleText on error codes and 404 | Registered in gsap-plugins.ts |
| SFContainer, SFText, SFStack | Phase 2 output | FRAME structure for error/empty states | Available in sf/ |
| `data-anim` attribute system | Phase 3 output | Hooks GSAP effects to DOM elements | Fully operational |
| `initPageHeadingScramble()` | page-animations.tsx | ScrambleText pattern | Works on `[data-anim="page-heading"]` |
| `initReducedMotion()` | gsap-plugins.ts | `gsap.globalTimeline.timeScale(0)` on reduced-motion | Wired in PageAnimations |

### No New Libraries
Phase 4 introduces zero new dependencies. All effects are implemented using existing GSAP plugins and SF primitives.

---

## Architecture Patterns

### Pattern 1: Hero Animation Fast-Path (ATF-02)

**What:** The existing hero sequence delays character reveal until 2.3s (`delay: 2.3` in initHeroAnimations). The 500ms requirement means the FIRST visible motion must fire within 500ms of page load — not that the full sequence completes in 500ms.

**Current timeline (from page-animations.tsx):**
```
delay: 0ms   — heroFeel blur bloom starts (opacity 0→1, blur 20→0)
delay: 500ms — (nothing visible)
delay: 1000ms — slashes slide in (delay: 1)
delay: 2000ms — (nothing visible)
delay: 2300ms — hero-char SplitText reveal starts
delay: 4000ms — heroCopy and CTAs appear
delay: 4400ms — color cycle begins
```

**The gap:** The only effect firing before 500ms is `heroFeel` (blur bloom) — but it's a white panel element starting at opacity:0, so it's invisible until it fades in. This does NOT satisfy "motion fires within 500ms."

**What to fix:** Wire one of the three approved effects (ScrambleText on heading, hero-mesh fade-in, CTA pulse) to fire at delay:0 or delay:0.1. The cleanest option: start the hero-mesh fade from `opacity: 0 → 0.45` at delay:0 over 300ms. Hero-mesh already renders at `opacity-[0.45]` — we can start it at opacity:0 and fade in immediately.

**Implementation approach:**
```typescript
// In initHeroAnimations — fire hero-mesh fade FIRST, before SplitText
const heroMesh = document.querySelector("[data-anim='hero-mesh']");
if (heroMesh) {
  gsap.fromTo(heroMesh, { opacity: 0 }, { opacity: 0.45, duration: 0.3, ease: "power2.out", delay: 0 });
}
// Then restructure: ScrambleText on heading fires at delay: 0.1 (not 2.3)
// Keep slashes, color cycle, copy as secondary sequence
```

Alternatively: add `data-anim="hero-mesh"` to the HeroMesh component's wrapper and drive from page-animations. This requires checking if HeroMesh canvas already handles its own init visibility.

**CTA pulse** (third approved effect): add a single CSS pulse on `.hero-cta-btn.primary` that fires on class addition — not a GSAP keyframe, just a CSS `@keyframes` border-pulse at page load. This is lightweight and fires immediately with no JS delay.

### Pattern 2: ScrambleText on Error Codes (ATF-04)

**What:** The established ScrambleText pattern from `initPageHeadingScramble()` can be reused directly on error pages. Error pages are client components (`"use client"`) — they can use `useEffect` + lazy-load gsap-plugins directly.

**Key constraint:** `app/error.tsx` is already `"use client"` — ScrambleText must be wired via useEffect, not via PageAnimations (which runs on layout). Error boundary is separate from the normal React tree.

**Pattern (mirrors page-animations.tsx approach):**
```typescript
"use client";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    const el = document.querySelector("[data-anim='error-code']");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    import("@/lib/gsap-plugins").then(({ gsap, ScrambleTextPlugin }) => {
      gsap.to(el, {
        duration: 0.6,
        scrambleText: {
          text: "ERROR",
          chars: "01!<>-_\\/[]{}—=+*^?#",
          speed: 0.5,
        },
      });
    });
  }, []);

  // ... render
}
```

**VHS glitch on error:** The sf-glitch CSS class exists in globals.css (lines 1465–1473) with a `sf-glitch-1` / `sf-glitch-2` keyframe animation that creates a clip-path glitch effect. Apply `.sf-glitch` to the error code element. In reduced-motion, `@media (prefers-reduced-motion: reduce) { .sf-glitch { animation: none } }` already exists (line 1469–1473).

### Pattern 3: Empty State Design (ATF-05)

**What:** ComponentsExplorer renders `filtered.map(...)` — when `filtered.length === 0`, the grid renders nothing. A designed empty state requires a conditional branch.

**Current state:** No empty state exists. The grid becomes visually empty — just the filter bar and hint bar with nothing between them.

**Implementation pattern:**
```tsx
{filtered.length === 0 ? (
  <div className="col-span-full ..."> {/* Empty state */}
    {/* SF primitive structure + contextual message */}
  </div>
) : (
  filtered.map((comp) => /* existing cell */)
)}
```

**Empty state visual language (from CONTEXT.md):** SFStack with muted text, subtle border animation, contextual action CTA. Following the DU/TDR aesthetic: the empty state should feel like a terminal that returned 0 results — structured, not apologetic.

**For token explorer and API explorer:** These pages may not yet exist (they are linked from the component browser hint bar as `/reference`). Research needs to confirm whether these pages have content or are stubs. If stubs, the empty state is the primary design concern.

### Pattern 4: Reduced-Motion as Intentional Design (ATF-06)

**What:** The CSS infrastructure already handles reduced-motion comprehensively. The work is:
1. Verify each effect resolves to its end-state (not just "off")
2. Confirm the hero reads as a complete design in reduced-motion
3. Document in SIGNAL-SPEC.md

**Existing reduced-motion infrastructure (confirmed from globals.css):**
- `animation-duration: 0.01ms !important` on `*, *::before, *::after` (lines 941–949)
- `.sf-hero-deferred` included in `[data-anim]` catch-all reset → `opacity: 1 !important` (line 995–997)
- `.sf-cursor { display: none }` (line 1259)
- `.vhs-overlay { display: none }` (line 1650)
- `.sf-glitch { animation: none }` (line 1470)
- `gsap.globalTimeline.timeScale(0)` in initReducedMotion() — stops all GSAP animations

**Gap:** The `globalTimeline.timeScale(0)` approach means GSAP animations don't fire at all — the CSS initial states (`opacity: 0` on `[data-anim="cta-btn"]`, `[data-anim="hero-char"]` etc.) would be overridden by the reduced-motion CSS catch-all reset (`opacity: 1 !important`). This is correct behavior — the end state is visible, the animation sequence is suppressed.

**Hero in reduced-motion:** heading chars (hero-char) are covered by the `[data-anim]` catch-all reset → `opacity: 1; transform: none`. `.sf-hero-deferred` (katakana, farsi, mandarin, subtitle) are also reset to `opacity: 1`. HeroMesh goes static (no GSAP timeline drives it). CTAs are visible (cta-btn reset). This is already correct — QA needs to verify it LOOKS intentional, not just functional.

**Key QA questions:**
- Does the hero read as a designed composition in reduced-motion, or does it look half-assembled?
- Is there text contrast sufficient without the motion cues that normally draw attention?
- Does the static hero-mesh provide enough visual weight on the left panel?

### Anti-Patterns to Avoid

- **Adding delay:0 GSAP animations that trigger CLS:** Any GSAP animation that changes layout dimensions (width, height, top, left) will cause CLS. Only animate `opacity`, `transform`, and CSS filters.
- **ScrambleText on reduced-motion:** The `initPageHeadingScramble` pattern already guards with `if (window.matchMedia(...).matches) return` — replicate this guard in error page useEffect.
- **Empty grid as empty state:** Do not leave an empty grid — the `role="listbox"` element with zero children is semantically broken and visually confusing.
- **Hardcoded error codes in ScrambleText:** The error page receives a dynamic `error.digest` — use that as the scramble target text, not a static string.

---

## Critical Finding: Component Count Discrepancy (ATF-03)

**The actual numbers:**
| Location | Claim | Reality |
|----------|-------|---------|
| stats-band.tsx | "340" components | False — 16 in explorer, 28 in SF layer |
| page metadata | "340+ components" | False |
| ComponentsExplorer | 16 entries in COMPONENTS array | Accurate for explorer |
| SF layer (sf/) | 28 files (excluding index.ts) | Accurate but not labeled |
| All components | SF(28) + blocks(12) + animation(17) + layout(15) = ~72 | Closest accurate count |

**Resolution (from CONTEXT.md):** Use "X components and growing" with X = accurate count. The decision says "24 components" as an example — the actual count to display should reflect what's genuinely built. Given 28 SF-layer components, "28 components and growing" or "30+ components" (adding a handful of key blocks) is honest.

**Surfaces to fix:**
1. `components/blocks/stats-band.tsx` — change "340" to accurate count
2. `app/page.tsx` metadata description — remove "340+ components" claim
3. Hero right panel — add component count to hero copy (it currently has none)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ScrambleText | Custom character cycling loop | `ScrambleTextPlugin` from gsap-plugins.ts (already registered) | Already wired; custom loop won't match established DU aesthetic |
| Glitch animation | Custom CSS keyframe | `.sf-glitch` class in globals.css | Already exists with reduced-motion guard |
| Empty state layout | Custom flex layout | `SFStack` + `SFText` from sf/ | Enforces blessed tokens by construction |
| Error page structure | Custom centering layout | `SFContainer` | Enforces max-width and gutter tokens |
| GSAP context on error page | Full gsap.context() with ScrollTrigger | Single `gsap.to()` with lazy import | Error page only needs one animation; full context is overkill |

---

## Common Pitfalls

### Pitfall 1: Hero Animation Timing Measurement
**What goes wrong:** "Fires within 500ms" is measured from page load (navigation start), not from React hydration. GSAP's `delay` is relative to when the effect is registered, which is after hydration — meaning a GSAP `delay: 0` actually fires ~200-400ms after navigation start depending on bundle parse time.

**How to avoid:** To guarantee sub-500ms visible motion, the FIRST effect must fire at GSAP `delay: 0` and should be CSS-driven (no GSAP dependency) wherever possible. A CSS `@keyframes` on the hero-mesh opacity starts at paint time — before hydration.

**Alternative approach:** Apply initial fade-in to HeroMesh as a CSS animation on mount, not a GSAP animation. CSS animations fire before JS hydration. Then GSAP takes over for the richer sequence.

### Pitfall 2: error.tsx ScrambleText Race Condition
**What goes wrong:** Error boundaries mount asynchronously — the error page's useEffect fires after the error is caught and the boundary renders. The `import("@/lib/gsap-plugins")` lazy load adds another async gap. If the user has a slow network, the scramble effect may never run.

**How to avoid:** The `[data-anim]` catch-all ensures the error code is visible without the effect. Scramble is enhancement only. Guard with `if (!el) return` and no loading spinners — fail gracefully to static text.

### Pitfall 3: ComponentsExplorer Empty State ARIA
**What goes wrong:** The grid uses `role="listbox"` — an empty listbox with no `role="option"` children is valid but the status div says "0 RESULTS" while the visual area is blank. Screen reader announces the count but has no context.

**How to avoid:** The empty state element should also have `role="option"` or be outside the listbox. Keep the status div "0 RESULTS" announcement — it's the accessible signal. The visual empty state is inside the grid but uses `aria-hidden` or `role="presentation"` for its decorative elements.

### Pitfall 4: Reduced-Motion Hero Left Panel Text Visibility
**What goes wrong:** The hero heading `hero-char` elements use `SplitText.create()` which wraps chars in `<div>` elements. In reduced-motion, `globalTimeline.timeScale(0)` prevents GSAP from running — but SplitText wrapping still happens (it's DOM manipulation, not animation). The CSS reset `opacity: 1 !important` restores visibility, but the SplitText wrapping may affect text rendering.

**How to avoid:** The `cancelledRef` in initHeroAnimations bails early if reduced-motion — but `initReducedMotion()` doesn't set cancelledRef. Check that `initHeroAnimations` is actually skipped (not just that its animations are paused) when reduced-motion is active. From page-animations.tsx lines 25-31: when reduced-motion matches, the function returns early after loading initReducedMotion — `initHeroAnimations` is never called. This is correct.

### Pitfall 5: CTA Pulse Causing CLS
**What goes wrong:** If the CTA pulse uses `transform: scale()` or changes `box-shadow`, it can cause layout recalculation that shifts content during LCP measurement.

**How to avoid:** Pulse must be `transform: scale()` only (transform is compositor-only, no layout impact). Do NOT animate `width`, `border-width`, or `padding`. The existing `.hero-cta-btn` uses `border-2 border-foreground` — a pulse that scales the button 1→1.05→1 is compositor-safe.

---

## Code Examples

### Verified: Reduced-Motion Guard in initHeroAnimations (page-animations.tsx, lines 25-31)
```typescript
// When reduced-motion matches, initHeroAnimations is never called
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const { initReducedMotion } = await import("@/lib/gsap-plugins");
  if (cancelledRef.current) return;
  cleanupMotion = initReducedMotion();
  return; // <-- exits before initHeroAnimations
}
```

### Verified: globalTimeline.timeScale(0) Pattern (gsap-plugins.ts, lines 39-41)
```typescript
if (prefersReduced.matches) {
  gsap.globalTimeline.timeScale(0);
}
```
This pauses ALL GSAP animations globally. Combined with CSS initial state resets, content is visible without animation.

### Verified: sf-glitch CSS Class (globals.css)
The `.sf-glitch` class applies clip-path-based animation for VHS glitch. Its reduced-motion guard already exists:
```css
@media (prefers-reduced-motion: reduce) {
  .sf-glitch { animation: none; }
  .sf-glitch::before, .sf-glitch::after { display: none; }
}
```
Apply this class to the error code element — no new CSS needed.

### Verified: [data-anim] Reduced-Motion Reset (globals.css, lines 988-997)
```css
@media (prefers-reduced-motion: reduce) {
  [data-anim],
  [data-anim="section-reveal"],
  [data-anim="tag"],
  [data-anim="comp-cell"],
  [data-anim="cta-btn"],
  [data-anim="stagger"] > *,
  .sf-hero-deferred {
    opacity: 1 !important;
    transform: none !important;
  }
}
```
All hero animation targets are covered. New `[data-anim="error-code"]` must be added to this list.

### Verified: COMPONENTS array count (components-explorer.tsx, lines 201–218)
16 entries: indices 001–012 (FRAME primitives) + 101–104 (SIGNAL generative). These are the only components shown in the explorer.

---

## State of the Art

| Current Behavior | Phase 4 Target | Impact |
|-----------------|---------------|--------|
| Hero char reveal at 2.3s delay | First visible motion within 500ms | SOTD jurors see life immediately |
| Stats-band claims "340 components" | Honest count with "growing" label | Credibility with dev audience |
| error.tsx: bare div with text | FRAME+SIGNAL error moment | Error as designed system expression |
| not-found.tsx: functional stub | Crafted 404 with ScrambleText | 404 = system voice, not failure |
| ComponentsExplorer: empty grid on no results | Designed empty state with contextual CTA | Zero-result state is a moment |
| Reduced-motion: technically correct, unverified | QA'd and documented in SIGNAL-SPEC | Intentional alternative, not accident |

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual browser QA (no automated test suite detected) |
| Config file | None |
| Quick run command | `npm run dev` — visual inspection |
| Full suite command | `npm run build` — TypeScript + build validation |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ATF-01 | Hero reads as complete at 1440x900 without scroll | Manual visual | — | N/A |
| ATF-02 | First visible motion within 500ms of load | Manual + DevTools Performance tab | — | N/A |
| ATF-03 | Component count is accurate, has "growing" label | Code review + visual | `grep -n "340" components/blocks/stats-band.tsx` | N/A |
| ATF-04 | Error page has FRAME+SIGNAL structure | Manual — trigger error boundary | — | N/A |
| ATF-05 | Empty states exist in component browser | Manual — search with no matches | — | N/A |
| ATF-06 | Reduced-motion shows intentional design | Manual — browser DevTools > Rendering > prefers-reduced-motion | — | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` — confirms no TypeScript or Next.js build errors
- **Per wave merge:** Full manual QA pass in Chrome at 1440x900 + reduced-motion emulation
- **Phase gate:** All 6 ATF requirements verified before `/pde:verify-work`

### Wave 0 Gaps
None — existing test infrastructure (manual QA + build check) covers all phase requirements. No new test files needed.

---

## Open Questions

1. **Does HeroMesh control its own initial opacity?**
   - What we know: `HeroMesh` renders in `hero.tsx` with `className="absolute inset-0 z-0 opacity-[0.45]"` — the Tailwind class sets opacity at paint time, not GSAP-driven
   - What's unclear: Does HeroMesh's internal GSAP timeline set opacity:0 on init, then animate up? If so, it's already a sub-500ms effect candidate. If not, we need to add `opacity: 0` initial state + GSAP fade.
   - Recommendation: Read `components/animation/hero-mesh.tsx` before writing the ATF-02 plan task

2. **Do token explorer and API explorer pages exist?**
   - What we know: ComponentsExplorer hint bar links to `/reference`; REQUIREMENTS mentions "token explorer, API explorer" as having empty states
   - What's unclear: Whether `/reference`, `/tokens`, or similar routes exist as pages or are stubs
   - Recommendation: `ls app/` to confirm route structure before planning ATF-05 tasks

3. **"Growing" label exact phrasing**
   - What we know: CONTEXT.md says "24 components and growing" as example; actual SF layer count is 28
   - What's unclear: Whether to count 28 (SF only) or ~72 (all components across all layers)
   - Recommendation: Claude's Discretion — use "28 components and growing" for SF layer only, which matches what the explorer shows as category

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection — `components/blocks/hero.tsx`, `components/layout/page-animations.tsx`, `app/globals.css`, `lib/gsap-plugins.ts`, `components/blocks/components-explorer.tsx`, `app/error.tsx`, `app/not-found.tsx`
- `.planning/phases/03-signal-expression/SIGNAL-SPEC.md` — Phase 3 output, all effect specifications
- `.planning/phases/04-above-the-fold-lock/04-CONTEXT.md` — locked decisions

### Secondary (MEDIUM confidence)
- GSAP ScrambleTextPlugin API — pattern confirmed from existing usage in page-animations.tsx; no external verification needed (pattern already works in codebase)

---

## Metadata

**Confidence breakdown:**
- Hero timing fix: HIGH — exact delay values confirmed in page-animations.tsx; 500ms target is clear
- Component count discrepancy: HIGH — counted directly from COMPONENTS array (16), sf/ directory (28), and stats-band.tsx claim ("340")
- Error page pattern: HIGH — mirrors established ScrambleText pattern with direct code reference
- Empty state pattern: HIGH — ComponentsExplorer source confirms absence; implementation pattern is standard React conditional render
- Reduced-motion coverage: HIGH — CSS rules confirmed in globals.css; one gap identified (new `[data-anim="error-code"]` must be added to reset list)

**Research date:** 2026-04-06
**Valid until:** Stable — this is a code audit, not library research. Findings are tied to current codebase state.
