# Technology Stack

**Project:** SignalframeUX v1.2 Tech Debt Sweep
**Researched:** 2026-04-06
**Scope:** NEW capabilities only — registry.json, config provider API, session persistence, CSS var→WebGL bridge

---

## Context: What Is NOT Re-Researched

The following stack is locked from v1.0/v1.1 and NOT covered here:

- Next.js 15.3 (App Router, Turbopack) + TypeScript 5.8
- GSAP 3.12.7 + ScrollTrigger, @gsap/react 2.1.2, Lenis 1.1.20
- Tailwind CSS v4, CVA, Radix/shadcn SF layer
- Three.js 0.183.2 (async chunk), SignalCanvas singleton, useSignalScene, color-resolve

Existing architecture decisions that constrain this milestone:
- GSAP ticker is the ONLY render driver for WebGL — no independent rAF loops
- Three.js lives in async chunk — 102 kB initial shared bundle maintained
- Server Components default — `'use client'` only when required
- Document-level event listener pattern proven in v1.1 (audio/haptics)

---

## Feature 1: registry.json (DX-04)

### What It Is

A machine-readable component manifest that lets AI assistants (Claude, v0, Cursor) and the shadcn CLI install SignalframeUX components directly into consumer projects via URL:

```bash
pnpm dlx shadcn@latest add https://signalframeux.com/r/sf-button.json
```

### Stack Decision: shadcn Registry Format

**Use the shadcn registry schema.** No additional library required — it is a JSON build artifact.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Schema | `https://ui.shadcn.com/schema/registry.json` | Industry standard; supported by shadcn CLI, v0, and AI tools |
| Build command | `shadcn build` (already in devDeps: `shadcn@4.1.2`) | No new dependency — shadcn CLI already installed |
| Output dir | `public/r/` | Convention; served by Next.js static file serving at `/r/[name].json` |
| Source dir | `registry/` at project root | Convention from shadcn registry template |

### registry.json Top-Level Structure

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "signalframeux",
  "homepage": "https://signalframeux.com",
  "items": [ ...registry items... ]
}
```

### File Type Mapping for SF Components

| SF Component Type | Registry Type | When to Use |
|-------------------|---------------|-------------|
| SF-wrapped shadcn component | `registry:ui` | `sf-button.tsx`, `sf-card.tsx`, etc. |
| Layout primitive | `registry:ui` | `sf-container.tsx`, `sf-section.tsx`, etc. |
| Animation component | `registry:component` | `signal-motion.tsx`, `scroll-reveal.tsx`, etc. |
| Hook | `registry:hook` | `use-signal-scene.ts`, etc. |
| Lib utility | `registry:lib` | `color-resolve.ts`, `signal-canvas.tsx`, etc. |
| CSS theme/tokens | `registry:theme` | `globals.css` token subset |

### Build Script Addition

```json
// package.json — add to scripts:
"registry:build": "shadcn build"
```

The `shadcn build` command reads `registry.json` at project root, processes all file paths, and outputs per-component JSON files to `public/r/`. No configuration needed beyond adding the source files.

**Confidence:** HIGH — official shadcn/ui documentation, `shadcn@4.1.2` already in devDeps.

---

## Feature 2: createSignalframeUX(config) + useSignalframe() (DX-05)

### What It Is

A React context provider factory that lets consumers configure SignalframeUX behavior at the application boundary:

```typescript
// consumer's app/layout.tsx
const { SignalframeProvider } = createSignalframeUX({
  signal: { defaultIntensity: 0.3, defaultSpeed: 1.0 },
  reducedMotion: 'system',
  theme: 'dark',
});
```

```typescript
// any component
const { signal, theme } = useSignalframe();
```

### Stack Decision: Native React Context — No Library

**Use plain React `createContext` + `useContext`.** No new dependency.

| Option | Decision | Rationale |
|--------|----------|-----------|
| Native React context | **RECOMMENDED** | Zero bundle cost; already in project; TypeScript generics handle the factory pattern cleanly |
| `react-use-config` | Rejected | Adds dependency for what is ~30 lines of code; unmaintained (last commit 2021) |
| Zustand | Rejected | Overkill; global store conflicts with the provider factory pattern; existing project has no Zustand |
| Jotai | Rejected | Overkill for design system config; adds atoms complexity for a simple read-only config tree |

### Implementation Pattern

The factory pattern is proven in the ecosystem (Wagmi `createConfig`, Ant Design `ConfigProvider`, Radix UI theming) and is straightforward with TypeScript:

```typescript
// lib/signalframe-context.tsx
interface SignalframeConfig {
  signal?: { defaultIntensity?: number; defaultSpeed?: number; defaultAccent?: number; };
  reducedMotion?: 'system' | 'always' | 'never';
  theme?: 'dark' | 'light' | 'system';
}

export function createSignalframeUX(config: SignalframeConfig = {}) {
  const SignalframeContext = createContext<SignalframeConfig>(config);

  function SignalframeProvider({ children }: { children: React.ReactNode }) {
    return <SignalframeContext.Provider value={config}>{children}</SignalframeContext.Provider>;
  }

  function useSignalframe() {
    return useContext(SignalframeContext);
  }

  return { SignalframeProvider, useSignalframe };
}

// Default export for apps that don't need customisation
export const { SignalframeProvider, useSignalframe } = createSignalframeUX();
```

**Key constraints:**
- `SignalframeProvider` must be a Client Component (`'use client'`) because it uses React context
- Config is read-only at runtime — no mutation API (no `setConfig`). SignalOverlay writes directly to CSS vars, not to this context
- `useSignalframe` is a thin accessor — not a settings panel. The SignalOverlay already handles interactive mutation

**Confidence:** HIGH — native React API, pattern validated across major libraries.

---

## Feature 3: Session State Persistence (STP-01)

### What It Is

Persist three types of UI state across page reloads: filter selections, scroll position, and tab state.

### Stack Decision: nuqs for Filter/Tab State, Native sessionStorage for Scroll

Two different mechanisms for two different data shapes:

| State Type | Mechanism | Why |
|------------|-----------|-----|
| Filter selections | nuqs `useQueryState` | URL-encoded → shareable, bookmarkable, SSR-compatible with Next.js App Router |
| Tab state | nuqs `useQueryState` | Same rationale; tab = navigation state, belongs in URL |
| Scroll position | `sessionStorage` (native) | Scroll is ephemeral positional data — NOT shareable, NOT needed in URL, `sessionStorage` clears on tab close (correct behavior) |

### nuqs

**Install: `pnpm add nuqs`** — new dependency.

| Aspect | Value |
|--------|-------|
| Version | `^2.8.9` (latest, April 2026) |
| Bundle size | 6 kB gzipped |
| Dependencies | Zero runtime dependencies |
| Next.js App Router support | First-class via `NuqsAdapter` |
| React version | Supports React 19 |

**Required setup — add `NuqsAdapter` to root layout:**

```typescript
// app/layout.tsx (Server Component)
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
```

**Usage in filter components:**

```typescript
'use client';
import { parseAsString, useQueryState } from 'nuqs';

const [activeFilter, setActiveFilter] = useQueryState('filter', parseAsString.withDefault('all'));
```

**Why not localStorage for filters?**
- URL state is shareable and bookmarkable — correct for filters/tabs
- nuqs is the de-facto standard for Next.js App Router URL state (used by Vercel, Supabase, Sentry, Clerk)
- localStorage accumulates stale state; URL state self-cleans on navigation
- nuqs v2.5+ provides key isolation — components only re-render when their specific key changes

**Scroll position — native sessionStorage:**

```typescript
// Simple hook — no library needed
function useScrollPersistence(key: string) {
  useEffect(() => {
    const saved = sessionStorage.getItem(key);
    if (saved) window.scrollTo(0, parseInt(saved, 10));

    const onScroll = () => sessionStorage.setItem(key, String(window.scrollY));
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [key]);
}
```

**Why not nuqs for scroll?** Scroll position in the URL creates ugly URLs, breaks browser back-button behavior, and generates unnecessary history entries. `sessionStorage` is the correct tool: it persists through refreshes on the same tab and clears when the tab closes.

**Confidence:** HIGH — nuqs official docs, NuqsAdapter pattern verified; sessionStorage is native Web API.

---

## Feature 4: SignalOverlay→WebGL CSS Var Bridge (INT-04)

### What It Is

Complete the one-sided bridge: `SignalOverlay` writes `--signal-intensity`, `--signal-speed`, `--signal-accent` to `:root` CSS vars, but no WebGL scene currently reads them. The bridge must poll these vars on each GSAP ticker frame and push values into Three.js uniforms.

### Stack Decision: getComputedStyle in GSAP Ticker — No Library

**No new library required.** The existing architecture already has everything needed:

1. GSAP ticker already drives the WebGL render loop (proven in `signal-canvas.tsx`, `glsl-hero.tsx`)
2. `getComputedStyle(document.documentElement).getPropertyValue('--signal-intensity')` reads CSS vars synchronously
3. Three.js uniform mutation on tick is the existing pattern (`glsl-hero.tsx` already does `uniformsRef.current.uTime.value += 0.016`)

**Why not StyleObserver / `@bramus/style-observer`?**
- Adds a dependency (~5 kB) for a problem already solved by the GSAP ticker
- The GSAP ticker already runs every frame — reading 3 CSS vars per tick is negligible (< 1µs)
- `getComputedStyle` is called every frame in `color-resolve.ts` for the canvas probe — this is an established pattern in this codebase

**Why not MutationObserver watching `:root` style attribute?**
- MutationObserver on `style` attribute fires when `element.style.setProperty()` is called — this would work for SignalOverlay's writes
- BUT: it fires synchronously on mutation, not on the render frame — could trigger uniform updates between GSAP ticker ticks, causing visual stutter
- The ticker-per-frame approach is frame-coherent: uniforms update at the same moment the scene renders

### Bridge Pattern

The bridge lives in `glsl-hero.tsx` (the primary WebGL consumer) and any future WebGL scene that reads signal parameters. Pattern:

```typescript
// Inside GSAP ticker callback in the scene component:
const tickerFn = () => {
  if (!uniformsRef.current) return;
  uniformsRef.current.uTime.value += 0.016;

  // Signal bridge — read CSS vars, push to uniforms
  const style = getComputedStyle(document.documentElement);
  const intensity = parseFloat(style.getPropertyValue('--signal-intensity') || '0.5');
  const speed = parseFloat(style.getPropertyValue('--signal-speed') || '1.0');
  uniformsRef.current.uIntensity.value = intensity;
  uniformsRef.current.uSpeed.value = speed;
};
```

**CSS var defaults in globals.css** — must be added as part of INT-04:

```css
/* globals.css — @theme or :root block */
--signal-intensity: 0.5;
--signal-speed: 1.0;
--signal-accent: 0;
```

Without defaults, `getPropertyValue` returns an empty string, and `parseFloat('')` returns `NaN`.

**Confidence:** HIGH — pattern validated by existing codebase (`glsl-hero.tsx` ticker + `color-resolve.ts` `getComputedStyle` probe). No new library needed.

---

## Installation Summary

### New Dependencies

```bash
pnpm add nuqs
```

That is the only new runtime dependency for the entire v1.2 milestone.

### New Dev Script (no install)

```json
// package.json
"registry:build": "shadcn build"
```

### What Is NOT Added

| Considered | Rejected | Why |
|------------|----------|-----|
| `@bramus/style-observer` | Rejected | GSAP ticker solves CSS var reading at no cost |
| `zustand` | Rejected | Overkill for read-only config context |
| `react-use-config` | Rejected | Unmaintained; 30 lines of native code replaces it |
| `jotai` | Rejected | No global state model needed |
| `use-local-storage` | Rejected | `sessionStorage` native API is sufficient for scroll |
| Any new animation library | Rejected | CLAUDE.md: do not expand animation system |

---

## Integration Checklist

### registry.json
- [ ] Create `registry/` directory at project root
- [ ] Write `registry.json` with all SF component entries
- [ ] Add `"registry:build": "shadcn build"` to `package.json` scripts
- [ ] Run `pnpm registry:build` → verify output in `public/r/`
- [ ] Serve endpoint at `https://[domain]/r/[name].json`

### Config Provider
- [ ] Create `lib/signalframe-context.tsx` with `createSignalframeUX` factory
- [ ] Add `'use client'` directive (context requires client boundary)
- [ ] Wrap root layout with default `SignalframeProvider`
- [ ] Export from `sf/index.ts` barrel

### Session Persistence
- [ ] Install: `pnpm add nuqs`
- [ ] Add `NuqsAdapter` to `app/layout.tsx` (Server Component, wraps children)
- [ ] Identify all filter/tab components → replace `useState` with `useQueryState`
- [ ] Create `hooks/use-scroll-persistence.ts` for scroll state

### CSS Var→WebGL Bridge
- [ ] Add `--signal-intensity: 0.5`, `--signal-speed: 1.0`, `--signal-accent: 0` defaults to `globals.css`
- [ ] Extend `glsl-hero.tsx` GSAP ticker to read CSS vars and push to uniforms
- [ ] Add `uIntensity` and `uSpeed` uniforms to hero fragment shader
- [ ] Verify `SignalOverlay` slider changes produce visible shader response

---

## Version Compatibility

| Package | Version | Peer Requirements | Notes |
|---------|---------|-------------------|-------|
| `nuqs` | `^2.8.9` | React 18+, Next.js 14.2+ | NuqsAdapter required for App Router |
| `shadcn` (build) | `4.1.2` | Next.js, TypeScript | Already installed in devDeps |
| React Context (native) | React 19.1.0 | — | Already in project |
| `sessionStorage` (native) | Browser API | — | No polyfill needed for target browsers |

---

## Sources

- shadcn/ui registry documentation (ui.shadcn.com/docs/registry) — registry.json schema, file types, build command — HIGH confidence
- shadcn/ui registry-item-json docs (ui.shadcn.com/docs/registry/registry-item-json) — all `registry:*` type values — HIGH confidence
- shadcn/ui getting-started docs (ui.shadcn.com/docs/registry/getting-started) — build workflow, `public/r/` output — HIGH confidence
- nuqs GitHub (github.com/47ng/nuqs) — NuqsAdapter pattern for Next.js App Router, v2.8.9 latest — HIGH confidence
- nuqs homepage (nuqs.dev) — 6 kB gzipped, zero dependencies, useQueryState API — HIGH confidence
- InfoQ nuqs 2.5 article — key isolation, debounce, React Advanced 2025 industry adoption — MEDIUM confidence
- GSAP community forum (gsap.com/community) — `getComputedStyle` + `getPropertyValue` for CSS var reading — HIGH confidence
- Codebase: `glsl-hero.tsx` — ticker-driven uniform mutation pattern, existing implementation — HIGH confidence
- Codebase: `color-resolve.ts` — `getComputedStyle` probe pattern, established precedent — HIGH confidence
- Codebase: `signal-overlay.tsx` — CSS var write pattern, confirmed `--signal-intensity/speed/accent` names — HIGH confidence
- WebSearch — StyleObserver alternatives evaluated and rejected (bramus/style-observer) — MEDIUM confidence

---

*Stack research for: SignalframeUX v1.2 Tech Debt Sweep — NEW capabilities only*
*Researched: 2026-04-06*
