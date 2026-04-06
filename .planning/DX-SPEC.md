# DX-SPEC — Deferred Item Interface Sketches

> Interface shapes for DX-04, DX-05, and STP-01 — all deferred to post-v1.0.
> These are shape-only sketches. No function bodies, no internal state, no implementation detail.
> Each section annotates open questions rather than locking in decisions.

**Status:** Deferred — post-v1.0
**Created:** 2026-04-06 (Phase 5 Plan 01)

---

## DX-04: `registry.json` — Component Distribution Surface

### Rationale

SignalframeUX components should be installable into other projects via a machine-readable registry — similar to the shadcn/ui model where a `registry.json` describes component files, dependencies, and metadata. This enables AI-driven scaffolding tools and CLI installers to pull specific SF components without copying the entire system.

Deferred because: the distribution format, versioning strategy, and shadcn compatibility requirements need to be resolved before implementation. This sketch captures the intended shape.

### Interface Sketch

```typescript
interface SFRegistryComponent {
  /** Unique component identifier, matches sf-{name}.tsx filename stem */
  name: string;
  /** Relative path from project root */
  file: string;
  /** Human-readable description for registry browsing */
  description: string;
  /** npm packages required (not already in project) */
  dependencies: string[];
  /** Other SF components this one depends on */
  sfDependencies: string[];
  /** Available CVA intent/size/width variants — for documentation */
  variants: Record<string, string[]>;
  /** Which pattern this component follows */
  pattern: "A" | "B" | "C";
  /** Layer classification */
  layer: "frame" | "signal";
}

interface SFRegistry {
  /** Schema version for tooling compatibility */
  version: string;
  /** Registry name for disambiguation */
  name: "signalframeux";
  /** All registered components */
  components: SFRegistryComponent[];
}
```

### Open Questions

1. **Distribution format** — JSON file checked into repo vs separate npm package vs GitHub Releases artifact? shadcn/ui uses a hosted URL; SF may prefer repo-local.
2. **Versioning strategy** — Semver on the registry file itself, or keyed to the main project version?
3. **shadcn compatibility** — Should `registry.json` conform to the shadcn registry spec so `npx shadcn@latest add` can install SF components? Requires field mapping audit.
4. **Auto-generation vs manual** — Should the registry be generated from source (JSDoc annotations + file analysis) or maintained manually? Auto-gen requires a build step.
5. **Scope** — Should `animation/` SIGNAL components be included, or only `sf/` FRAME components?

---

## DX-05: `createSignalframeUX` + `useSignalframe` — API Foundation

### Rationale

A programmatic API for configuring and consuming the SignalframeUX system — analogous to theme providers in design systems like Chakra or Radix Themes. `createSignalframeUX(config)` produces a configured provider; `useSignalframe()` gives any component access to the resolved token values, current theme, and motion controller handles.

Deferred because: provider vs singleton architecture decision, SSR hydration strategy, and motion controller scope need resolution before implementation.

### Interface Sketch

```typescript
/** Configuration object passed to createSignalframeUX() */
interface SignalframeUXConfig {
  /** Default color mode on first load */
  defaultTheme?: "light" | "dark" | "system";
  /** Override motion preference detection */
  motionPreference?: "full" | "reduced" | "system";
  /** Token overrides — merges with globals.css defaults */
  tokens?: Partial<SignalframeUXTokens>;
}

/** Resolved token values available to consumers */
interface SignalframeUXTokens {
  /** Current --color-primary resolved to hex/rgb (not oklch string) */
  colorPrimary: string;
  /** Current --color-background resolved */
  colorBackground: string;
  /** Current --color-foreground resolved */
  colorForeground: string;
  /** All duration tokens in ms */
  durations: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
    glacial: number;
  };
}

/** Motion controller handle returned by useSignalframe() */
interface SignalframeMotionController {
  /** Pause all active GSAP timelines */
  pause: () => void;
  /** Resume all active GSAP timelines */
  resume: () => void;
  /** Whether system prefers reduced motion */
  prefersReduced: boolean;
}

/** Return type of useSignalframe() hook */
interface UseSignalframeReturn {
  tokens: SignalframeUXTokens;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  motion: SignalframeMotionController;
}

/** Factory function — creates configured provider component and hook */
declare function createSignalframeUX(config: SignalframeUXConfig): {
  SignalframeUXProvider: React.ComponentType<{ children: React.ReactNode }>;
  useSignalframe: () => UseSignalframeReturn;
};
```

### Open Questions

1. **Provider vs global singleton** — Provider pattern requires wrapping the app; global singleton avoids this but breaks SSR. The current `lib/theme.ts` is a global singleton (imperatively modifies `document.documentElement`). Should the API formalize this or migrate to a provider?
2. **SSR hydration strategy** — Color tokens resolved from CSS variables require a DOM — unavailable on the server. How does `useSignalframe()` return token values during SSR without a hydration mismatch?
3. **Motion controller scope** — Should `motion.pause()` affect all GSAP timelines globally, or only timelines created within the provider subtree?
4. **Token resolution timing** — CSS custom properties are resolved at paint time, not at React render time. Does `tokens.colorPrimary` need a `useLayoutEffect` to stay in sync with `--color-primary` mutations from `ColorCycleFrame`?
5. **Relationship to existing `lib/theme.ts`** — `createSignalframeUX` should either wrap or replace the existing `toggleTheme` function. Wrapping risks double-registration; replacing is a breaking change.

---

## STP-01: Session State Persistence

### Rationale

The SignalframeUX component browser and token explorer have filter state, active tabs, and scroll positions that reset on every page navigation. Persisting these within a session (not across sessions) would significantly improve the developer tool experience — filters survive navigation to a component detail page and back.

Deferred because: storage backend choice, hydration timing complexity (SSR), and state reset policy require UX and architectural decisions before implementation.

### Interface Sketch

```typescript
/** Component browser filter state */
interface ComponentBrowserState {
  /** Active search query */
  searchQuery: string;
  /** Active pattern filter — null means "all" */
  patternFilter: "A" | "B" | "C" | null;
  /** Active layer filter — null means "all" */
  layerFilter: "frame" | "signal" | null;
  /** Last scroll position within the component list */
  scrollTop: number;
}

/** Token explorer tab state */
interface TokenExplorerState {
  /** Active tab identifier */
  activeTab: "colors" | "spacing" | "typography" | "animation" | "layout";
  /** Last scroll position within the token panel */
  scrollTop: number;
}

/** Full session state shape */
interface SFSessionState {
  componentBrowser: ComponentBrowserState;
  tokenExplorer: TokenExplorerState;
  /** ISO timestamp of last write — for staleness detection */
  lastUpdated: string;
}

/** Session state storage adapter interface */
interface SFSessionStorage {
  get: () => SFSessionState | null;
  set: (state: SFSessionState) => void;
  clear: () => void;
}

/** Default empty state — used on first load and after clear */
declare const DEFAULT_SESSION_STATE: SFSessionState;
```

### Open Questions

1. **Storage backend** — `sessionStorage` (tab-local, cleared on close) vs Zustand with session middleware vs URL search params (shareable but changes URL)? `sessionStorage` is simplest; URL params allow link sharing of filter state.
2. **Hydration timing** — `sessionStorage` reads require `useEffect` (client-only). How do we avoid layout shift between SSR render (empty state) and client hydration (restored state)?
3. **State reset policy** — When should state clear? Options: on page reload, on session end, on 30-min inactivity, never within session. Resetting on reload is safest; persisting across reloads is more ergonomic.
4. **Scope** — Should state persist only for the `/components` explorer page, or should other tool pages (token explorer, animation lab) each have their own state slice?
5. **Integration with router** — Next.js App Router does not preserve component state on navigation by default. Does session state restoration require `router.push` with state, or can it be implemented purely via `sessionStorage` read in `useLayoutEffect`?
