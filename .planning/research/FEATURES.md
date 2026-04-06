# Feature Landscape

**Domain:** Design system DX — registry distribution, config provider, session persistence
**Milestone:** v1.2 Tech Debt Sweep (DX-04, DX-05, STP-01)
**Researched:** 2026-04-06
**Overall confidence:** HIGH (shadcn official docs verified via Context7/WebFetch, React patterns from official sources)

---

## Context: What This File Covers

The previous FEATURES.md covers v1.1 Generative Surface (SIGNAL effects, WebGL, etc.). This file covers
the three deferred DX features that were sketched in DX-SPEC.md and are now active in v1.2:

| Item | Feature | Status |
|------|---------|--------|
| DX-04 | registry.json — CLI/AI component installation | Active |
| DX-05 | createSignalframeUX(config) + useSignalframe() API | Active |
| STP-01 | Session state persistence (filters, scroll, tabs) | Active |

---

## DX-04: registry.json — Component Distribution Surface

### Current State

The project already has two registry files:

- `registry.json` — source registry at project root (26 SF components listed)
- `public/r/registry.json` — built output served at `/r/registry.json` (17 components — stale, missing 9 items added post-v1.0)

The source `registry.json` is correctly structured against the shadcn schema. The built `public/r/` output is stale.

### Table Stakes

Features an installable registry MUST have to function with `npx shadcn@latest add`:

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Valid `$schema` field pointing to shadcn schema URL | Required for CLI validation | None | Already present: `"https://ui.shadcn.com/schema/registry.json"` |
| Per-component JSON at `/r/[name].json` | The CLI fetches individual component JSON — not the root registry.json | LOW | shadcn CLI build step (`shadcn build`) generates these from source. Currently absent. |
| `registryDependencies` populated | CLI resolves shadcn/ui base component (button, card, etc.) before installing the SF wrapper | LOW | Partially done. Needs audit — animation components (circuit-divider, etc.) have no registryDependencies declared. |
| `cssVars` block on the theme item | The CLI can inject CSS custom properties into the consumer's globals.css via cssVars | MEDIUM | Not yet in registry.json. SF token system lives in globals.css — a `cssVars` block on a "sf-theme" registry item would let consumers install the token layer as a unit. |
| All 29 SF components present | 9 components from v1.0/v1.1 (sf-label, sf-select, sf-checkbox, sf-radio-group, sf-switch, sf-textarea, animation/scramble-text, animation/circuit-divider, animation/hero-mesh) are in source but not in `public/r/` | LOW | Run `pnpm shadcn build` after source is complete. |
| Layout primitives in registry | SFContainer, SFSection, SFStack, SFGrid, SFText are not in registry.json at all | MEDIUM | These have no shadcn/ui base — `registryDependencies: []` is correct. Type should be `registry:ui`. They enforce token system by construction — the cssVars approach or docs field should capture this. |

### Differentiators

Features that make the registry genuinely useful beyond basic shadcn compatibility:

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| `layer` metadata (frame/signal) | Consumers can filter registry items by FRAME vs SIGNAL layer — this is the core SF mental model | LOW | Add via `meta: { layer: "frame" }` field. shadcn registry-item schema has a `meta` object for arbitrary key-value. |
| `pattern` metadata (A/B/C) | Mirrors the shadcn integration pattern classification already used in SCAFFOLDING.md | LOW | `meta: { pattern: "A" }` alongside layer. Zero cost to add. |
| `categories` field populated | Enables filtering in registry browsers and tooling | LOW | shadcn registry-item has a `categories` array. Use `["frame", "interactive"]`, `["signal", "animation"]`, etc. |
| `docs` field with usage example | Brief snippet of how to use the component — visible in AI-assisted scaffolding | LOW | Single `import + usage` line is sufficient. |
| `envVars` field where needed | If any SF component reads from env (none currently, but future cdOS components might) | LOW | N/A for current components. Keep in mind for future. |
| Separate per-component JSON auto-generated, NOT hand-maintained | Manual maintenance of per-component JSON will drift. Auto-generation via `shadcn build` is the only maintainable path. | MEDIUM | Requires confirming `shadcn build` command works in this project's Turbopack/Next.js 15 config. |
| `sf-theme` registry item with `cssVars` | A dedicated installable item that delivers just the token layer — spacing, typography, OKLCH color palette, animation tokens — into the consumer's globals.css | MEDIUM | This is the highest-leverage addition. Consumers who don't want all 29 components can install just the token system. Maps to the existing globals.css `@theme` block. |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Hand-maintained per-component JSON in `public/r/` | Will immediately drift from source. Already stale after v1.0. | Use `shadcn build` to auto-generate. Add to `package.json` scripts as `registry:build`. |
| Embedding full component source inline in registry.json | Registry.json is an index, not a bundle. Inline source defeats the point of file-reference resolution. | Keep `files[].path` as relative paths. Let the CLI resolve them. |
| Version field on individual components | Shadcn registry does not version individual components. Per-component versions create maintenance overhead with no consumer benefit. | Version the registry at the root level (`"version"` in the registry name or as a `meta` field on the root item) aligned to project semver. |
| Including `node_modules` paths in files[] | Breaks portability. | Ensure all `files[].path` are relative to project root. |

### Feature Dependencies

```
public/r/ per-component JSON (auto-generated)
    requires: shadcn CLI build step
    requires: source registry.json complete and valid

cssVars on sf-theme item
    requires: globals.css @theme block stable (already true in v1.2)
    requires: sf-theme named item added to registry.json items[]

layout primitives in registry
    requires: no shadcn base (registryDependencies: [])
    requires: type: "registry:ui" (correct type for primitives without base)
```

---

## DX-05: createSignalframeUX(config) + useSignalframe() — Config Provider API

### Existing Sketch

DX-SPEC.md already contains a well-reasoned interface sketch. The open questions identified there
remain the implementation decision points. This research resolves them with ecosystem evidence.

### What the Ecosystem Does (HIGH confidence — verified against MUI, Ant Design, Radix patterns)

The standard config provider pattern in mature React design systems:

1. **Factory function returns Provider + hook as a pair.** MUI uses `createTheme()` + `ThemeProvider` + `useTheme()`. Ant Design uses `ConfigProvider` (pre-configured globally) + `useConfig()` hook. Radix Themes uses `Theme` + `useTheme`. The pattern is consistent: factory produces a configured Provider, hook reads from that Provider's context.

2. **Provider wraps the app root, not individual components.** All major systems place the Provider at `layout.tsx` (Next.js App Router) or `_app.tsx`. This is the correct placement for SignalframeUX — wrapping `app/layout.tsx` is the right call.

3. **CSS custom property resolution happens client-side only.** Every design system that reads resolved CSS variable values uses `getComputedStyle()` in a `useLayoutEffect` or `useEffect`. This is unavoidable — CSS custom properties are resolved at paint time in the browser, not during SSR. The correct pattern: return a stable server-safe default on SSR, then hydrate with resolved values after mount. MUI's `tokens.colorPrimary` returns a string like `"oklch(0 0 0)"` on the server and the real value post-hydration.

4. **Motion controller scope should be global, not subtree.** GSAP's `gsap.globalTimeline` is already a singleton. `motion.pause()` / `motion.resume()` should call `gsap.globalTimeline.pause()` / `.resume()`. Scoped timelines (per-subtree) require a GSAP `Timeline` instance per Provider — unnecessary complexity given SF's single-app-per-page assumption.

5. **SSR hydration strategy for theme.** The existing `lib/theme.ts` already uses `document.documentElement.setAttribute('data-theme', ...)`. The Provider should read the current `data-theme` attribute value (which next-themes or the existing toggle sets) rather than managing theme state independently. This avoids double-registration.

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| `SignalframeUXProvider` component | Any design system with a programmatic API needs a Provider — it's the entry point for consumers | MEDIUM | Wraps app in context. Reads initial `data-theme` from `document.documentElement` on mount. |
| `useSignalframe()` hook | How consumers access config state — theme, tokens, motion | LOW | Throws if called outside Provider (`throw new Error("useSignalframe must be used within SignalframeUXProvider")`). This is the standard pattern. |
| `theme` + `setTheme()` in hook return | Theme read/write in one place | LOW | `setTheme` should delegate to existing `toggleTheme` in `lib/theme.ts` rather than replacing it. |
| `motion.prefersReduced` boolean | Read `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — already gated in all SF animation components | LOW | Hook syncs from MediaQuery listener on mount. |
| `motion.pause()` / `motion.resume()` | Global animation control — GSAP provides this natively | LOW | Thin wrapper over `gsap.globalTimeline.pause()` and `.resume()`. |
| SSR safety — no hydration mismatch | Provider must not cause hydration errors in Next.js App Router | MEDIUM | Use stable server defaults for CSS-var-derived values. Resolve in `useLayoutEffect`. |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| `tokens.colorPrimary` etc. (resolved CSS var values) | Enables generative components (WebGL, Canvas) to read token values without probing the DOM themselves. Currently `lib/color-resolve.ts` does this ad-hoc with TTL cache. Provider centralizes it. | MEDIUM | One `getComputedStyle(document.documentElement).getPropertyValue('--color-primary')` per token, on mount + on theme change. |
| `createSignalframeUX(config)` factory | Enables `defaultTheme` and `motionPreference` to be set at instantiation — useful for cdOS and CD-Operator consumers | LOW | The factory is a thin wrapper: it just closes over `config` and returns the Provider + hook pair with config baked in. The complexity is in the Provider, not the factory. |
| `tokens.durations` object | Animation duration tokens readable by JS — useful for GSAP `duration:` values that should match CSS token values | LOW | Read from CSS vars: `getComputedStyle(el).getPropertyValue('--duration-fast')` parsed to ms number. |

### Anti-Features

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Replacing `lib/theme.ts` toggle logic | Breaking change to existing 29 components that import from `lib/theme.ts` | Delegate from `setTheme()` to existing `toggleTheme()`. Wrapper, not replacement. |
| CSS-in-JS token injection | Adds a CSS-in-JS runtime dependency (Emotion, styled-components) to a system built on Tailwind v4 + CSS custom properties | CSS custom properties are already the token layer. Provider reads them; it doesn't rewrite them. |
| Provider managing GSAP timelines directly | GSAP's singleton architecture conflicts with React's component tree. React StrictMode double-mounts would register timelines twice. | Provider only calls `gsap.globalTimeline.pause/resume`. It never creates or registers timelines. |
| Context value re-computation on every render | If `value={}` is a new object every render, all consumers re-render. Classic React context pitfall. | `useMemo` for the context value. Stable references for `motion` object (it's just wrappers, `useCallback` it). |
| Async token resolution displayed as loading state | CSS vars resolve synchronously once the DOM exists. A loading spinner for token values is unnecessary complexity. | Read synchronously in `useLayoutEffect`. Server default (`""`) is fine — it's never painted if client JS runs fast. |

### Feature Dependencies

```
SignalframeUXProvider
    requires: existing lib/theme.ts (wraps, doesn't replace)
    requires: existing lib/color-resolve.ts (or inlines the getComputedStyle calls)
    requires: gsap installed (already true)

useSignalframe() hook
    requires: SignalframeUXProvider in ancestor tree
    requires: 'use client' directive (reads DOM, manages state)

createSignalframeUX factory
    requires: SignalframeUXProvider (factory returns it configured)
    complexity: trivial — factory is 5 lines wrapping the Provider
```

---

## STP-01: Session State Persistence

### What "Session" Means for This Project

The component browser (`/components`) and token explorer (`/tokens`) have filter/tab state that resets
on navigation. Users drilling into a component detail and pressing Back want to return to where they
were. This is a developer-tooling UX problem, not an authentication/security problem.

**Target:** `sessionStorage` (tab-scoped, cleared on close). Not `localStorage` (too persistent), not URL params (changes the URL, breaks bookmarks for filter-free state).

### SSR Hydration Problem — This Is The Main Risk

`sessionStorage` is browser-only. On SSR, `window` does not exist. Reading `sessionStorage` in a Server Component or during SSR render throws. The standard Next.js 15 / React 19 pattern to avoid hydration mismatch:

1. Server renders with `DEFAULT_SESSION_STATE` (empty filters, scrollTop: 0)
2. Client hydrates with the same default — no mismatch
3. `useLayoutEffect` fires after hydration and reads `sessionStorage`
4. State updates → second render on client only → no server/client discrepancy

This is the pattern used by `usehooks-ts`'s `useLocalStorage` hook as of 2025. The key insight: **render the default first, then update — never try to read storage before hydration.**

### Table Stakes

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Search query persists across navigation | Core developer tool expectation. Drilling into a component and returning should show the same search results. | LOW | One sessionStorage key per page. Read in `useLayoutEffect`, write on change. |
| Active tab persists | Token explorer tab (colors/spacing/typography/animation/layout) should not reset on navigate-away and return. | LOW | Same pattern as search. Single key per page. |
| Filter state persists (pattern, layer) | Component browser filters for FRAME/SIGNAL layer and pattern A/B/C should persist within session. | LOW | Same pattern. |
| Scroll position restoration | Returning to component list should scroll to the previously viewed item — not top of page. | MEDIUM | Requires storing `scrollTop` and restoring it after content mounts. `useLayoutEffect` + `element.scrollTo()`. Timing is fragile — content must be rendered before scroll restore fires. |
| State cleared on session end | `sessionStorage` does this natively — no implementation required. | None | This is the default behavior of sessionStorage. |

### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Typed state adapter (`SFSessionStorage` interface) | The interface sketch in DX-SPEC.md is correct. A typed adapter makes swapping storage backends possible without changing consumer code. | LOW | Define the interface, implement a `sessionStorageAdapter`. Total: ~30 lines. |
| `lastUpdated` timestamp on state | Enables staleness detection — if state is >1h old, reset it. Avoids stale filter states after a long break. | LOW | ISO timestamp written with every state update. Read on init — compare to `Date.now()`. |
| `useSessionState<T>(key, default)` generic hook | A single reusable hook that encapsulates the read-default-then-hydrate pattern. All three pages use it instead of repeating the pattern. | LOW | ~25 lines. Returns `[state, setState]` like `useState`. Write to sessionStorage on every set. |

### Anti-Features

| Feature | Why Avoid | What to Do Instead |
|---------|-----------|-------------------|
| URL search params as primary persistence | Changes the URL — breaks bookmarks for users who want the "no filters" view, adds param noise to browser history | sessionStorage is invisible to the URL. Use URL params only if deep-linking to a specific filtered view is a future requirement (it's not in scope). |
| Redux or Zustand for session state | Three key-value pairs in sessionStorage do not warrant a state management library. State is local to each page. | Three `useSessionState` hook calls per page. No global store. |
| Persisting to `localStorage` | localStorage persists across sessions. A stale filter from 3 months ago reappearing is more confusing than helpful. Session scope is correct for tooling state. | sessionStorage |
| React `useContext` global session store | Tempting because it avoids prop drilling, but session state is page-local. Global context creates unnecessary coupling between unrelated pages. | Page-local hook calls. Each page manages its own session slice. |
| `suppressHydrationWarning` as fix | Suppresses the warning but leaves the hydration mismatch in place — React renders the wrong DOM for one frame, which causes visible layout shift. | Render default first, hydrate in `useLayoutEffect`. Clean pattern, zero warnings. |

### Feature Dependencies

```
useSessionState hook
    requires: 'use client' directive
    requires: sessionStorage browser API (guarded by typeof window !== 'undefined')

Scroll restoration
    requires: useSessionState hook (scroll position is just another persisted value)
    requires: ref to scrollable container to call .scrollTo() on
    requires: content rendered before restoration fires (useLayoutEffect timing)

SFSessionStorage adapter interface
    requires: DX-SPEC.md interface shape (already defined)
    no external dependencies
```

---

## Cross-Feature Dependencies

```
DX-04 (registry.json complete)
    enables: AI/CLI component installation into consumer projects
    no dependency on DX-05 or STP-01

DX-05 (config provider)
    enables: programmatic access to SF tokens from JS (useful for WebGL uniform resolution)
    depends on: lib/theme.ts (existing — wrap, don't replace)
    no dependency on DX-04 or STP-01

STP-01 (session persistence)
    enables: improved developer tool UX on /components and /tokens pages
    no dependency on DX-04 or DX-05
```

**All three are independent.** They can be shipped in any order. Recommended order:

1. DX-04 — run `shadcn build`, fill gaps, verify CLI install works. Purely additive, zero risk.
2. STP-01 — the `useSessionState` hook is 25 lines. Highest UX payoff relative to complexity.
3. DX-05 — the Provider is the most complex because of SSR hydration and GSAP integration. Do last.

---

## MVP Definition (v1.2 Tech Debt Sweep — DX Features)

### Launch With

- **DX-04:** Source `registry.json` complete (all 29 components + 5 layout primitives + sf-theme cssVars item). `shadcn build` runs without error. Per-component JSON in `public/r/` auto-generated.
- **STP-01:** `useSessionState` hook. Component browser search + filter state persists in session. Token explorer tab persists. Scroll restoration on /components page.
- **DX-05:** `SignalframeUXProvider` + `useSignalframe()` hook. `theme`/`setTheme`, `motion.prefersReduced`, `motion.pause/resume`. SSR-safe with stable defaults. `createSignalframeUX` factory wraps it.

### Defer

- **DX-04 full auto-generation pipeline** (shadcn build as CI step): deferred post-v1.2. Manual build + commit for v1.2 is acceptable.
- **DX-05 `tokens.colorPrimary` etc.**: Resolved CSS var values. Useful but not critical for v1.2. Ship the Provider shell first; add token resolution in a follow-up if WebGL components need it.
- **STP-01 scroll restoration on /tokens page**: Low priority. Tab persistence covers the main pain point.

---

## Sources

- [shadcn registry.json spec — official docs](https://ui.shadcn.com/docs/registry/registry-json) — HIGH confidence
- [shadcn registry-item.json spec — official docs](https://ui.shadcn.com/docs/registry/registry-item-json) — HIGH confidence
- [shadcn registry getting started — official docs](https://ui.shadcn.com/docs/registry/getting-started) — HIGH confidence
- [shadcn CLI 3.0 and MCP Server — changelog Aug 2025](https://ui.shadcn.com/docs/changelog/2025-08-cli-3-mcp) — HIGH confidence
- [Ant Design ConfigProvider — official docs](https://ant.design/components/config-provider/) — MEDIUM confidence (WebFetch returned CSS, not docs content)
- [SSR-Safe React Hooks — ReactUse blog 2025](https://reactuse.com/blog/ssr-safe-react-hooks/) — MEDIUM confidence
- [usehooks-ts useLocalStorage SSR issue resolution](https://github.com/astoilkov/use-local-storage-state/issues/23) — MEDIUM confidence
- [Next.js scroll position persistence discussion](https://github.com/vercel/next.js/discussions/60146) — MEDIUM confidence
- DX-SPEC.md (SignalframeUX project, 2026-04-06) — interface sketches for DX-04/05/STP-01
- registry.json (SignalframeUX project root) — current source state audit
- public/r/registry.json (SignalframeUX) — current built output state audit

---

*Feature research for: SignalframeUX v1.2 Tech Debt Sweep — DX-04, DX-05, STP-01*
*Researched: 2026-04-06*
