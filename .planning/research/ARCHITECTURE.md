# Architecture Patterns — v1.2 Tech Debt Sweep

**Domain:** SignalframeUX integration layer — wiring existing components, fixing type mismatches, shipping deferred DX features, adding session persistence
**Researched:** 2026-04-06
**Confidence:** HIGH — all findings verified against actual codebase files

---

## Context: What v1.2 Is and Is Not

v1.2 is not a new feature milestone. Every item is either:
- **Wiring** an existing component that is complete but unused (INT-03, INT-04)
- **Fixing** a type mismatch introduced when usage diverged from the prop definition (bgShift)
- **Completing** a scaffolded file that is partially done (registry.json)
- **Implementing** interface sketches that were deferred from v1.1 with open questions resolved (DX-05, STP-01)

This shapes the architecture: the v1.2 build order minimizes blast radius. Each item is self-contained with a clean rollback point.

---

## Existing Architecture Baseline

```
RootLayout (Server Component)
├── LenisProvider ('use client')
├── TooltipProvider ('use client')
├── {children}            ← page-level Server Components
├── GlobalEffectsLazy     ← next/dynamic ssr:false
│    └── GlobalEffects ('use client')
│         ├── VHSOverlay, CanvasCursor, ScrollProgress, ScrollToTop
│         ├── IdleOverlay (8s grain drift + OKLCH lightness pulse)
│         └── SignalOverlayLazy  ← writes --signal-{intensity,speed,accent} to :root
├── SignalCanvasLazy       ← next/dynamic ssr:false
│    └── SignalCanvas ('use client')
│         └── THREE.WebGLRenderer singleton (GSAP ticker as render driver)
│              ├── GlslHero scene    → reads scroll, uTime, uColor uniforms
│              └── SignalMesh scene  → reads scroll, uTime uniforms
├── PageAnimations ('use client')
└── PageTransition ('use client')

SIGNAL CSS var bridge (ONE-SIDED — INT-04 tech debt):
  SignalOverlay writes:  :root { --signal-intensity, --signal-speed, --signal-accent }
  WebGL scenes read:     (nothing — uniforms are not wired to these CSS vars)
  globals.css declares:  (nothing — no defaults for --signal-* vars)

SignalMotion component:
  State: CREATED but not placed on any page (INT-03 tech debt)
  Location: components/animation/signal-motion.tsx
  API: wraps children, scroll-scrub via GSAP ScrollTrigger fromTo

SFSection bgShift prop:
  Declared type:  bgShift?: boolean  (renders data-bg-shift="" or nothing)
  Actual usage:   data-bg-shift="white" | data-bg-shift="black" (spread as HTML attr)
  Result:         prop is dead; usage bypasses it entirely via spread

registry.json:
  State: EXISTS at project root with shadcn schema
  Coverage: 23 of 28 SF components registered
  Missing:  sf-container, sf-grid, sf-section, sf-stack, sf-text (layout primitives)

createSignalframeUX / useSignalframe:
  State: Interface sketch in .planning/DX-SPEC.md — not implemented
  Existing related code: lib/theme.ts (toggleTheme singleton)

Session persistence:
  State: Interface sketch in .planning/DX-SPEC.md — not implemented
  Target state: ComponentsExplorer (activeFilter, searchQuery) + token page (activeTab)
```

---

## Component Boundaries

### New vs Modified for v1.2

| Item | New / Modified / Fixed | Location | What Changes |
|------|----------------------|----------|--------------|
| SignalMotion placement | **Modified** (pages) | `app/page.tsx` and other showcase pages | Wrap existing section content with `<SignalMotion>` wrapper — no changes to the component itself |
| SignalOverlay→WebGL bridge | **Modified** (WebGL scenes) | `components/animation/glsl-hero.tsx`, `signal-mesh.tsx` | Add CSS var reads inside GSAP ticker callbacks; read `--signal-intensity`, `--signal-speed`, `--signal-accent` from `getComputedStyle` on each tick and push to uniforms |
| globals.css signal defaults | **Modified** (globals) | `app/globals.css` | Add `--signal-intensity: 0.5; --signal-speed: 1; --signal-accent: 0;` defaults to `:root` block |
| SFSection bgShift type | **Fixed** (component + type) | `components/sf/sf-section.tsx` | Change `bgShift?: boolean` to `bgShift?: "white" \| "black"` and render `data-bg-shift={bgShift}` — matching actual usage |
| registry.json | **Extended** (static file) | `registry.json` | Add 5 missing layout primitive entries |
| SignalframeUXProvider | **New** | `lib/signalframe-provider.tsx` | React context provider wrapping existing `toggleTheme`; exposes `useSignalframe()` hook |
| `createSignalframeUX` | **New** | `lib/signalframe-provider.tsx` (same file) | Factory function that returns `{ SignalframeUXProvider, useSignalframe }` |
| Session persistence | **Modified** (block component) | `components/blocks/components-explorer.tsx` | Add `sessionStorage` read/write for `activeFilter` + `searchQuery` in `useEffect` |
| Session persistence (tokens) | **Modified** (page block) | `app/tokens/page.tsx` or its block | Add `sessionStorage` read/write for active tab |

---

## Data Flow Changes

### INT-04: SignalOverlay → WebGL Uniform Bridge

The current flow is one-sided:

```
SignalOverlay slider change
    ↓
document.documentElement.style.setProperty("--signal-intensity", value)
    ↓
:root CSS var updated
    ↓
[NOTHING reads this]
```

The completed flow reads CSS vars inside the existing GSAP ticker:

```
SignalOverlay slider change
    ↓
document.documentElement.style.setProperty("--signal-intensity", value)
    ↓
:root CSS var updated
    ↓
GSAP ticker fires (next frame, ~16ms)
    ↓
glsl-hero.tsx ticker callback:
  const intensity = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--signal-intensity")
  ) || 0.5
  uniformsRef.current.uIntensity.value = intensity
    ↓
THREE.WebGLRenderer renders with updated uniform
```

This pattern — reading CSS vars inside the existing ticker callback — is already established by `color-resolve.ts` and the `--color-primary` reads in `canvas-cursor.tsx`. No new loop is needed. The three vars map to existing or new uniforms:

| CSS Var | Uniform Target | Scene(s) | Transform |
|---------|---------------|----------|-----------|
| `--signal-intensity` | `uIntensity` (new) | glsl-hero, signal-mesh | Direct: 0.0–1.0 |
| `--signal-speed` | `uSpeed` (new) | glsl-hero, signal-mesh | Direct: 0.0–2.0 |
| `--signal-accent` | `uAccent` (new) | glsl-hero | Degrees → radians or direct |

Reading from `getComputedStyle` on each GSAP tick is not expensive at this scale (two reads per frame across the page). The existing color-resolve pattern confirms this is acceptable.

### INT-03: SignalMotion on Showcase Sections

No data flow change. SignalMotion is a self-contained GSAP wrapper — it manages its own ScrollTrigger and refs internally. The change is purely placement: wrap existing section content in `<SignalMotion>` in page components. The component takes `from`, `to`, `scrub`, `start`, `end` props and is already fully implemented with reduced-motion guard.

The primary decision is which sections to activate. Based on the existing section taxonomy in `app/page.tsx`:

```
Homepage sections with data-bg-shift (the scroll-reactive sections):
  MANIFESTO → strong candidate for SignalMotion (opacity/y scrub as user scrolls in)
  SIGNAL/FRAME → strong candidate
  API → strong candidate
  COMPONENTS → strong candidate
  HERO section: skip — hero has its own GLSL animation
  STATS section: skip — StatsBand is data display, motion would distract
```

### DX-05: createSignalframeUX + useSignalframe

The open questions from DX-SPEC.md resolve as follows, based on existing codebase evidence:

**Q: Provider vs global singleton?**
Answer: Provider, but thin. The existing `lib/theme.ts` is a global singleton that imperatively modifies `document.documentElement`. The provider wraps this — it does not replace it. Theme state is initialized from `localStorage.getItem("sf-theme")` (same key as the inline script in `layout.tsx`). The provider synchronizes React state with the DOM class, it does not own the source of truth.

**Q: SSR hydration strategy for token values?**
Answer: Do not expose resolved OKLCH token values from `useSignalframe()`. The DX-SPEC.md sketch includes `tokens.colorPrimary` (resolved sRGB) — this requires a DOM probe (Canvas 2D `getImageData`). SSR cannot provide this. The v1.2 implementation scopes `useSignalframe()` to: theme state + setTheme + motion controller. Token resolution via `resolveColorToken` remains a separate utility call, not part of the hook return value. This resolves the hydration mismatch without sacrificing DX.

**Q: Motion controller scope?**
Answer: Global GSAP timeline only. `motion.pause()` calls `gsap.globalTimeline.pause()` — identical to the existing reduced-motion guard in `gsap-plugins.ts`. Not subtree-scoped.

The resulting architecture is minimal:

```typescript
// lib/signalframe-provider.tsx

const SignalframeContext = createContext<UseSignalframeReturn | null>(null);

export function createSignalframeUX(config: SignalframeUXConfig) {
  function SignalframeUXProvider({ children }) {
    // theme: read from localStorage + classList, write via toggleTheme()
    // motion: wrap gsap.globalTimeline.pause/resume
    // prefersReduced: MediaQueryList('prefers-reduced-motion')
    return (
      <SignalframeContext.Provider value={...}>
        {children}
      </SignalframeContext.Provider>
    );
  }

  function useSignalframe() {
    return useContext(SignalframeContext);
  }

  return { SignalframeUXProvider, useSignalframe };
}
```

The provider mounts in `RootLayout` alongside `LenisProvider`. It does not replace any existing providers.

**SSR note:** The provider renders on the server with `theme: "dark"` default (matches the inline blocking script behavior). Client hydration reads `localStorage` and classList in a `useEffect` to sync. This matches the existing `suppressHydrationWarning` on `<html>` — the pattern is already established.

### STP-01: Session Persistence

The open questions from DX-SPEC.md resolve as follows:

**Q: Storage backend?**
Answer: `sessionStorage`. Tab-local, survives navigation within the tab (Next.js App Router navigations do not reload the page), clears on tab close. No URL params (changes the URL, breaks direct links to the page). No Zustand (adds a dependency for a feature scoped to two pages).

**Q: Hydration timing?**
Answer: Read in `useEffect` (client-only), not during render. The component renders with default empty state on SSR and on initial client render, then immediately restores from `sessionStorage` in `useEffect`. This causes a brief flicker of the default state — acceptable for a developer tool page. The alternative (read in `useLayoutEffect`) risks SSR errors in strict mode.

**Q: State reset policy?**
Answer: Persist until tab close (sessionStorage natural behavior). No manual reset needed.

**Q: Scope?**
Answer: Two locations only — ComponentsExplorer (`activeFilter`, `searchQuery`) and the token page active tab. No other pages.

The integration is localized to `ComponentsExplorer`:

```
ComponentsExplorer mounts
    ↓
useEffect fires (client-only)
    ↓
Read sessionStorage.getItem("sf-components-state")
    ↓
If exists: parse JSON → setActiveFilter, setSearchQuery
    ↓
On state change (filter, search): write sessionStorage.setItem(...)
```

No new hooks or abstractions. `sessionStorage` reads/writes directly in `useEffect` inside the existing component. The JSON key is `"sf-components-state"` (namespaced to avoid collisions).

---

## Suggested Build Order

Dependencies flow downward. Each item is independently deployable with a commit rollback point.

### Step 1: globals.css signal defaults (30 min)

Zero dependencies. Add three CSS custom property defaults to `:root` in `app/globals.css`:

```css
--signal-intensity: 0.5;
--signal-speed: 1;
--signal-accent: 0;
```

Commit immediately. This unblocks INT-04 and makes the SignalOverlay panel correct at initial state (currently it shows 0.50/1.00/0° but the CSS vars are undefined until first slider interaction).

### Step 2: SFSection bgShift type fix (30 min)

Zero dependencies. Change `bgShift?: boolean` to `bgShift?: "white" | "black"` in `sf-section.tsx`. Update the JSDoc. Verify `app/page.tsx` usage passes through spread — the actual callers use `data-bg-shift="white"` as a spread HTML attribute, so the prop change does not break them. This is a type cleanup, not a behavioral change.

Commit immediately.

### Step 3: registry.json layout primitives (1 hr)

Zero dependencies. Add the 5 missing SF layout primitives to `registry.json`:
- `sf-container` — wraps content with max-width + gutter tokens
- `sf-section` — semantic section primitive with bgShift, spacing, label
- `sf-stack` — flex column with blessed gap stops
- `sf-grid` — responsive grid with blessed column/gap tokens
- `sf-text` — typography primitive with semantic alias enforcement

These have no npm dependencies (no Radix base). `registryDependencies` field is empty. The `type` is `"registry:ui"` matching existing entries.

Commit immediately.

### Step 4: SignalOverlay → WebGL bridge (2–3 hr)

Depends on: Step 1 (CSS var defaults must exist before wiring).

Two modifications:

1. `glsl-hero.tsx` — inside the existing GSAP ticker callback (currently increments `uTime`), add reads of `--signal-intensity`, `--signal-speed`, `--signal-accent` from `getComputedStyle`. Push to new `uIntensity`, `uSpeed`, `uAccent` uniforms. Add these three uniforms to the shader's `uniform` declarations and wire them to the visual output (e.g., `uIntensity` scales noise amplitude, `uSpeed` scales the time delta, `uAccent` shifts hue in the fragment shader output).

2. `signal-mesh.tsx` — same pattern: read `--signal-intensity` and `--signal-speed` in ticker, push to new uniforms, wire to vertex displacement amplitude and time scale.

The read happens once per GSAP tick (~60fps). `getComputedStyle` on `:root` is cheap at this frequency — this is the same technique as `canvas-cursor.tsx` line 41.

Commit after each scene.

### Step 5: SignalMotion on showcase sections (1–2 hr)

Depends on: nothing (SignalMotion is self-contained).

Place `<SignalMotion>` wrappers on 4 homepage sections. Use conservative defaults (`from={{ opacity: 0.6, y: 16 }}`, `scrub={1}`) — the sections already have layout and content, the motion should enhance not dominate. Verify reduced-motion renders at `to` state immediately.

Test: scroll slowly through the page, verify scrub behavior; test with `prefers-reduced-motion: reduce` in DevTools, verify no animation fires.

Commit.

### Step 6: createSignalframeUX + useSignalframe (3–4 hr)

Depends on: nothing externally, but conceptually benefits from Steps 1–5 being stable first (the motion controller wraps the already-settled GSAP timeline state).

Create `lib/signalframe-provider.tsx`. Export `createSignalframeUX`. Mount the returned `SignalframeUXProvider` in `RootLayout`. Document the hook contract in SCAFFOLDING.md.

**Critical constraint:** The provider's theme initialization must NOT conflict with the inline blocking script in `layout.tsx`. The inline script reads `localStorage("sf-theme")` and sets `document.documentElement.classList`. The provider must read the same key and treat the DOM classList as the source of truth — not re-apply its own default on mount (which would cause a flash).

Correct initialization:

```typescript
const [isDark, setIsDark] = useState(() => {
  if (typeof window === "undefined") return true; // SSR default: dark
  return document.documentElement.classList.contains("dark");
});
```

Commit after provider works. Commit separately after SCAFFOLDING.md update.

### Step 7: Session persistence (2–3 hr)

Depends on: nothing (self-contained in ComponentsExplorer).

Modify `components/blocks/components-explorer.tsx` to:
1. Read from `sessionStorage` in `useEffect` on mount — restore `activeFilter` and `searchQuery`.
2. Write to `sessionStorage` in a separate `useEffect` when either state changes.

The token page tab persistence follows the same pattern once the tab state location is identified.

Commit after ComponentsExplorer. Commit separately after token page.

### Step 8: Documentation cleanup

Depends on: all above complete.

Update SCAFFOLDING.md with `useSignalframe()` API contract. Update component frontmatter JSDoc for `SFSection` bgShift. Mark resolved tech debt items in PROJECT.md.

---

## Integration Points Summary

| Item | Files Read | Files Modified | New Files |
|------|-----------|----------------|-----------|
| globals.css defaults | none | `app/globals.css` | none |
| bgShift type fix | `sf-section.tsx` | `sf-section.tsx` | none |
| registry.json | `registry.json`, 5 sf component files | `registry.json` | none |
| INT-04 WebGL bridge | `glsl-hero.tsx`, `signal-mesh.tsx`, `globals.css` | `glsl-hero.tsx`, `signal-mesh.tsx` | none |
| INT-03 SignalMotion | `signal-motion.tsx`, `app/page.tsx` | `app/page.tsx` (+ other showcase pages) | none |
| createSignalframeUX | `lib/theme.ts`, `app/layout.tsx`, `DX-SPEC.md` | `app/layout.tsx` | `lib/signalframe-provider.tsx` |
| Session persistence | `components/blocks/components-explorer.tsx`, `DX-SPEC.md` | `components/blocks/components-explorer.tsx`, token page block | none |

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Polling CSS vars outside the existing ticker

**What:** Adding a new `setInterval` or `requestAnimationFrame` loop to watch `--signal-intensity` for changes.

**Why bad:** The GSAP ticker already runs at 60fps. A second loop is redundant and creates a second read cycle that can get out of phase with the render. The render only happens in the GSAP ticker callback anyway, so reading outside of it gains nothing.

**Instead:** Read CSS vars inside the existing GSAP ticker callback in each scene component. One read per render frame, zero extra loops.

### Anti-Pattern 2: Replacing lib/theme.ts with the new provider

**What:** Rewriting `toggleTheme()` inside the provider, deleting `lib/theme.ts`.

**Why bad:** `toggleTheme` is called by `DarkModeToggle` and `CommandPalette`. These components use `'use client'` and import directly from `lib/theme.ts`. Replacing the function breaks those callers unless they are simultaneously updated, and the commit is no longer atomic.

**Instead:** The provider wraps `toggleTheme`. It calls the existing function and syncs its own React state. `lib/theme.ts` stays unchanged.

### Anti-Pattern 3: Making useSignalframe return resolved OKLCH token values

**What:** Implementing `tokens.colorPrimary` as a resolved sRGB value from `resolveColorToken`.

**Why bad:** Requires a DOM Canvas 2D probe call during React render or in a `useLayoutEffect`. This causes an SSR/client mismatch if done during render, or a one-frame delay if done in `useLayoutEffect`. The DX-SPEC.md sketched this but marked it as an open question.

**Instead:** Scope `useSignalframe()` to theme + motion controller only. Document that color token resolution uses `resolveColorToken(cssVar)` directly — it is already exported from `lib/color-resolve.ts`.

### Anti-Pattern 4: Persisting session state to localStorage instead of sessionStorage

**What:** Using `localStorage` for component browser filter state.

**Why bad:** Filter state persists across sessions (even days later), can conflict with the system theme key (`sf-theme` in localStorage), and may return stale state if component names/categories change between deploys.

**Instead:** `sessionStorage` — tab-local, clears on close, no cross-session contamination. The DX-SPEC.md recommendation is confirmed correct.

### Anti-Pattern 5: Adding bgShift as a data-attribute-typed prop with "white"/"black" values treated as theme selectors

**What:** Making `bgShift="white"` activate different CSS based on light/dark mode.

**Why bad:** The existing `#bg-shift-wrapper` CSS in globals.css already handles dark/light mode correctly. The `data-bg-shift` value is already used by GSAP scroll targeting to identify which sections get which background color on scroll. Changing the semantics of the value would break GSAP targeting.

**Instead:** Fix only the TypeScript type — `bgShift?: "white" | "black"` — and propagate the value to `data-bg-shift`. Do not change the CSS or GSAP scroll logic.

---

## Confidence Assessment

| Area | Confidence | Basis |
|------|-----------|-------|
| INT-04 bridge approach | HIGH | getComputedStyle in ticker is verified pattern from canvas-cursor.tsx line 41 |
| INT-03 SignalMotion placement | HIGH | Component is complete and documented; placement is mechanical |
| bgShift fix | HIGH | Type mismatch confirmed by reading sf-section.tsx vs app/page.tsx side by side |
| registry.json completion | HIGH | shadcn schema is already in the file; 5 missing components identified by diff |
| createSignalframeUX scope | HIGH | Narrowed from DX-SPEC.md open questions using existing lib/theme.ts + layout.tsx evidence |
| Session persistence approach | HIGH | sessionStorage is DOM-native, no external deps; hydration timing resolved via useEffect |

---

## Sources

- `components/animation/signal-overlay.tsx` — CSS var write side confirmed (lines 136–148)
- `components/animation/signal-mesh.tsx`, `glsl-hero.tsx` — uniform structure confirmed, no signal-* reads exist
- `components/animation/signal-motion.tsx` — complete implementation, zero page placements
- `components/sf/sf-section.tsx` — bgShift boolean type confirmed
- `app/page.tsx` — data-bg-shift="white"/"black" spread usage confirmed (lines 29–50)
- `app/globals.css` lines 462–470 — bg-shift-wrapper CSS confirmed, no --signal-* defaults
- `registry.json` — 23 entries, 5 layout primitives missing
- `lib/theme.ts` — toggleTheme singleton confirmed
- `lib/color-resolve.ts` — getComputedStyle probe pattern confirmed (lines 104–120)
- `.planning/DX-SPEC.md` — interface sketches for DX-05 and STP-01 with open questions
- `components/blocks/components-explorer.tsx` — activeFilter, searchQuery, focusedIndex state confirmed (lines 278–283)

---

*Architecture research for: SignalframeUX v1.2 Tech Debt Sweep*
*Researched: 2026-04-06*
