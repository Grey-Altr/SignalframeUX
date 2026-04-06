# Domain Pitfalls

**Domain:** Adding CSS→WebGL bridge, component registry, config provider API, and session persistence to an existing Next.js design system (v1.2 Tech Debt Sweep)
**Researched:** 2026-04-06
**Confidence:** HIGH (CSS vars/WebGL, hydration, session) / MEDIUM (registry format specifics, provider pattern)

---

## Critical Pitfalls

### Pitfall 1: Per-Frame `getComputedStyle` Kills Lighthouse Performance Score

**What goes wrong:**
Reading `--signal-*` CSS custom properties via `getComputedStyle` on every WebGL render frame causes forced synchronous layout on each tick. The GSAP ticker fires at 60fps — that is 60 layout recalculations per second. On a page that already runs Three.js, ScrollTrigger, and Lenis, this compounds into measurable TBT (Total Blocking Time) regression on Lighthouse, directly attacking the 100/100 score target. The existing `color-resolve.ts` probe (1x1 canvas) is even heavier: it creates a canvas element, gets a 2D context, draws a fill, and reads pixels back — all per frame.

**Why it happens:**
`getComputedStyle()` forces the browser to flush all pending style recalculations and return a resolved value synchronously. When called inside a rAF loop (`gsap.ticker.add`), the browser cannot batch these reads with writes — every call is a forced synchronous layout. The `--signal-intensity`, `--signal-speed`, and `--signal-accent` vars change only when the user interacts with SignalOverlay (rare), yet the current architecture assumes they change every frame.

**The project-specific trap:**
`color-resolve.ts` line 9 explicitly says "Phase 6: No caching." This was correct for `color-cycle-frame.tsx` (which dynamically mutates `--color-primary`). Wiring the same uncached probe to `--signal-*` vars that are user-controlled (not animation-driven) would be incorrect — the `--signal-*` vars change 0 times per second during normal viewing, but would trigger layout recalc 60 times per second. Do NOT reuse the uncached code path for signal uniforms.

**Prevention:**
- Cache `--signal-*` resolved values in a module-level ref. Invalidate only on the `style` attribute mutation of `:root` (MutationObserver already exists in `color-resolve.ts` — wire into the TTL cache path with a generous TTL like 5000ms).
- Better: skip `getComputedStyle` entirely for `--signal-*` float values. These are not colors — they are plain numbers (0–1 floats). Read them once on mount and subscribe to changes via `MutationObserver` or a shared signal store. Write the uniform value to a module-level variable; read that variable in the ticker instead of reading the DOM.
- Pattern to use in the GSAP ticker:
  ```ts
  // At module level (not inside ticker)
  let cachedIntensity = 0.5;
  let cachedSpeed = 1.0;

  // Updated only when CSS var changes (MutationObserver or explicit setter)
  function syncSignalUniforms() {
    cachedIntensity = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--signal-intensity') || '0.5'
    );
    cachedSpeed = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--signal-speed') || '1'
    );
  }

  // Inside GSAP ticker — reads cached values only, no DOM access
  gsap.ticker.add(() => {
    material.uniforms.uIntensity.value = cachedIntensity;
    material.uniforms.uSpeed.value = cachedSpeed;
    renderer.render(scene, camera);
  });
  ```
- The `--signal-accent` var is a hue rotation (0–360 degrees), not a color token. Do NOT run it through the `color-resolve.ts` canvas probe — parse it as a float directly.

**Detection:**
- Lighthouse Performance score drops after wiring bridge (TBT spike)
- Chrome DevTools Performance panel shows `Recalculate Style` entries on every frame in the GSAP ticker
- `renderer.info.render.calls` increasing is not the signal — look for `Layout` entries in the flame chart

**Phase to address:** Phase 1 of v1.2 (INT-04: SignalOverlay→WebGL bridge). Wire the bridge with module-level caching from the start. Do not prototype with per-frame reads and "optimize later" — the Lighthouse regression will be immediate.

---

### Pitfall 2: Missing `--signal-*` CSS Var Defaults Cause Magenta Flash

**What goes wrong:**
`--signal-intensity`, `--signal-speed`, and `--signal-accent` have no declared defaults in `globals.css`. This is confirmed — grepping globals.css for `--signal-` returns nothing. `color-resolve.ts` returns magenta `{ r: 255, g: 0, b: 128 }` as its fallback for empty CSS var values (line 108). On page load, before the SignalOverlay mounts and writes defaults to `:root`, any WebGL component reading these vars via the color resolver will receive magenta. On a fast connection this is invisible. On a slow connection or cold cache, the shader renders a vivid magenta frame before the correct values arrive.

**Why it happens:**
CSS custom properties with no declaration and no `var(--signal-intensity, fallback)` usage return an empty string from `getPropertyValue`. The absence of a fallback in the var declaration is a v1.1 oversight (documented as INT-04 tech debt).

**Prevention:**
- Declare all three `--signal-*` vars with defaults in `:root` in `globals.css` before wiring any WebGL uniform reads:
  ```css
  :root {
    --signal-intensity: 0.5;
    --signal-speed: 1;
    --signal-accent: 0;
  }
  ```
- This must be done as the first step of INT-04 — before the uniform read code is written. The defaults become the canonical initial state; SignalOverlay then overrides them on interaction.
- Do NOT rely on the WebGL component's shader default uniform values to cover for missing CSS vars — the CSS vars are the source of truth. If the CSS declaration is absent, the bridge is broken at the source, not the destination.

**Detection:**
- Throttle network to Slow 3G in DevTools, hard reload — observe if a frame with incorrect colors appears in the hero or generative scene before the first paint settles
- `getComputedStyle(document.documentElement).getPropertyValue('--signal-intensity')` in the browser console returns empty string

**Phase to address:** Phase 1 of v1.2 (INT-04). This is a one-line-per-var fix in globals.css. Do it first, before any WebGL uniform wiring.

---

### Pitfall 3: `createSignalframeUX(config)` Context Provider Wrapping App Router Server Components

**What goes wrong:**
`createContext` and all Context Provider APIs require `'use client'`. A config provider implemented as a React context cannot wrap `app/layout.tsx` directly if `layout.tsx` is a Server Component — this is the common App Router pattern. The error is subtle: the provider itself can be a Client Component, but if it is imported directly into a Server Component layout, every component the layout imports becomes a Client Component boundary. This is the "context infection" pattern — a single context provider at the root can accidentally force an entire subtree into the client bundle.

The `useSignalframe()` consumer hook has the same constraint: it can only be called from Client Components. If a component that calls `useSignalframe()` is otherwise a Server Component (no state, no effects), adding the hook forces it to become a Client Component and adds it to the JS bundle.

**Why it happens:**
App Router's Server/Client boundary works by file, not by import depth. A Client Component file (marked `'use client'`) can import and render Server Components as `children`, but not the reverse. Config providers are typically placed at the layout root — the highest point in the tree — which is exactly where the Server/Client boundary matters most.

**Prevention:**
- The correct App Router pattern for a config provider is the "hole in the donut":
  ```tsx
  // providers.tsx — 'use client' file
  'use client';
  import { createContext, useContext } from 'react';
  const SignalframeContext = createContext<SignalframeConfig | null>(null);

  export function SignalframeProvider({
    config,
    children,
  }: {
    config: SignalframeConfig;
    children: React.ReactNode;
  }) {
    return (
      <SignalframeContext.Provider value={config}>
        {children}
      </SignalframeContext.Provider>
    );
  }

  export function useSignalframe() {
    const ctx = useContext(SignalframeContext);
    if (!ctx) throw new Error('useSignalframe must be used inside SignalframeProvider');
    return ctx;
  }
  ```
  ```tsx
  // app/layout.tsx — Server Component
  import { SignalframeProvider } from '@/components/sf/providers';

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html>
        <body>
          <SignalframeProvider config={defaultConfig}>
            {children} {/* children remain Server Components */}
          </SignalframeProvider>
        </body>
      </html>
    );
  }
  ```
- `children` passed into a Client Component Provider are NOT forced to become Client Components — they stay as Server Components. This is the critical rule. The provider wraps; it does not infect.
- The `config` object passed as props to the Provider must be serializable (no functions, no class instances, no React nodes). If `createSignalframeUX(config)` allows callback configuration (e.g., custom color resolver functions), these cannot be passed through the provider — they must live in a separate Client Component layer.
- `useSignalframe()` consumers in layout primitives (`SFSection`, `SFContainer`, etc.) would force those primitives to become Client Components. Current decision: layout primitives are Server Components. Do not make them consume context. The config API is for consumer-app setup, not for SF primitives themselves.

**Detection:**
- `next build` produces "Server Component cannot import Client Component" error if the provider is placed incorrectly
- Bundle analyzer shows layout primitives appearing in the client bundle after adding context consumers
- `@next/bundle-analyzer` shows unexpected components in the shared chunk

**Phase to address:** Phase 3 of v1.2 (DX-05: createSignalframeUX + useSignalframe). Design the provider boundary explicitly before writing any code — the architecture must be decided upfront.

---

### Pitfall 4: Session Persistence Causing Hydration Mismatch

**What goes wrong:**
Reading `localStorage` or `sessionStorage` during the initial render produces a hydration mismatch. The server renders with no session state (it has no access to browser storage) — so the HTML contains the default/empty state. The client immediately reads storage and renders a different state. React 18 treats this as a hydration error: "Hydration failed because the initial UI does not match server-rendered HTML." With filter, scroll, and tab session state, this means a section could render with no active tab on server (default index 0) but immediately jump to tab 2 on client — visible flash, potential CLS impact.

**Why it happens:**
`localStorage` is a browser-only API. Next.js App Router Server Components render on the server. Any code that runs during initial render (outside `useEffect`) that branches on `localStorage` values will produce different output server-side vs. client-side. This applies even to Client Components — they render on the server for the initial HTML, then hydrate on the client.

**The project-specific trap:**
The STP-01 requirement covers "filters, scroll, tabs." Tab state is the most dangerous: if a tab component renders different children based on the active tab index, and that index comes from `localStorage`, the server renders tab 0 children while the client immediately shows tab 2 children. React will throw a hydration error and fall back to client-only rendering, negating SSR benefits.

**Prevention:**
- Never read `localStorage` in the render path. Always read inside `useEffect`:
  ```tsx
  const [activeTab, setActiveTab] = useState(0); // stable default for SSR

  useEffect(() => {
    const saved = localStorage.getItem('sf-active-tab');
    if (saved !== null) setActiveTab(parseInt(saved, 10));
  }, []);
  ```
- For scroll position restoration: use `sessionStorage` (per-tab, not cross-session) and restore via `useEffect` after mount. Do not attempt scroll restoration before hydration completes.
- For filter state: same pattern. The first render always uses the default filter state. The `useEffect` applies saved state. This creates a visible "filter reset then snap" if the user returns to a page — acceptable for filters, but visually jarring for tabs.
- To eliminate the visible snap for tabs specifically: use `suppressHydrationWarning` on the tab container element (not the entire page) so React skips the mismatch warning for that subtree, combined with the `useEffect` pattern above. This is a targeted suppression, not a blanket fix.
- Consider cookies over localStorage for state that must be SSR-consistent: cookies are readable server-side via Next.js `cookies()` API and can be used to render the correct initial state. This eliminates the snap entirely but requires a `cookies()` read in a Server Component and passing the value as a prop to the Client Component.
- Zustand with `persist` middleware has the same pitfall — the `onRehydrateStorage` callback fires after mount, not during render. The initial render will always show the non-persisted default.

**Detection:**
- React warning in browser console: "Hydration failed because the initial UI does not match server-rendered HTML"
- Visible content flash/jump on page load when navigating back to a page with saved state
- Lighthouse CLS score increases after adding session persistence

**Phase to address:** Phase 4 of v1.2 (STP-01: session persistence). Decide the persistence mechanism (localStorage + useEffect vs. cookies) before implementation. Cookies are correct for tab state; localStorage is acceptable for filter state.

---

## Moderate Pitfalls

### Pitfall 5: `bgShift` Prop Boolean vs. String Type Mismatch Breaking Consumers

**What goes wrong:**
`SFSection` defines `bgShift?: boolean` in TypeScript. The JSX usage `<SFSection bgShift>` passes a boolean `true`. The rendered output is `data-bg-shift=""` (empty string attribute) when `true`, and the attribute is absent when `false/undefined`. This is correct — GSAP targets `[data-bg-shift]` by presence. However, if any consumer passes `bgShift="true"` (string) instead of `bgShift` (boolean), TypeScript should catch it — but JSX spread patterns can bypass this.

The real mismatch the analyst flagged: `data-bg-shift` is a spread attribute in some usage patterns. If a block component spreads props onto `SFSection` and the spread source types `bgShift` as `string | boolean`, TypeScript will widen the accepted type and the component will silently accept `bgShift="false"` (which renders as `data-bg-shift="false"` — a truthy attribute, GSAP targets it, unexpected behavior).

**Prevention:**
- Audit all `SFSection` consumers for `bgShift` prop usage. Accept only `bgShift` (no value) or `bgShift={true}` — never `bgShift="true"` or `bgShift={false}` (unnecessary, use omission).
- The TypeScript interface is correct. The issue is enforcement at consumer call sites, not the component definition.
- When fixing: do NOT change the prop type to `string` to accommodate broken consumers. Fix the consumers. Changing to string would mean changing the component logic and breaking the clean presence-attribute pattern.
- Add a JSDoc comment to the prop explicitly saying `bgShift` is a boolean presence toggle — never pass as string.

**Phase to address:** Phase 2 of v1.2 (bgShift type mismatch fix). One-pass audit of all SFSection usage. Low risk if caught before shipping the session persistence work that touches multiple pages.

---

### Pitfall 6: Registry JSON Format — Flat Structure Requirement Conflicts with SF Layer Structure

**What goes wrong:**
The shadcn registry spec requires a flat file structure: `/registry.json` at root, and `/[component-name].json` files also at root (not nested). SignalframeUX components live in `components/sf/`, `components/animation/`, `components/blocks/` — three separate source directories. A registry entry that points to files in nested directories will fail CLI resolution unless the `files[].path` values are explicit and the `target` property is set correctly for file placement at install time.

Additionally, the registry `files` array must NOT include a `content` property (shadcn spec constraint). AI tools that auto-generate registry entries sometimes add inline content — this causes schema validation failures.

**Prevention:**
- Structure `registry.json` at the project root (or `public/registry.json` for serving). Each item's `files[].path` should be relative to the registry root, not the component source root.
- Use explicit `target` paths in each file entry to tell the CLI where to place files in the consuming project:
  ```json
  {
    "name": "sf-button",
    "type": "registry:component",
    "files": [
      {
        "path": "components/sf/sf-button.tsx",
        "type": "registry:component",
        "target": "components/sf/sf-button.tsx"
      }
    ]
  }
  ```
- The `registryDependencies` field must list shadcn base component names (e.g., `"button"`) for SF-wrapped components that depend on `components/ui/`. If the base `button` is not in the consuming project, the CLI will fail without a useful error.
- Do NOT include `cssVars` for `--signal-*` variables in individual component registry entries — these are system-level globals. Include them in a separate `sf-tokens` registry entry that consumers install first.
- Validate the registry JSON against `https://ui.shadcn.com/schema/registry.json` before publishing. Schema violations produce silent CLI failures in some versions.

**Phase to address:** Phase 3 of v1.2 (DX-04: registry.json). The flat-structure requirement is the most common first-attempt mistake — address in initial scaffolding.

---

### Pitfall 7: `resolveColorAsThreeColor` Called Per-Frame for `--signal-accent` (Wrong Utility)

**What goes wrong:**
`--signal-accent` is a hue rotation value (0–360 degrees, a plain integer). It is NOT a color — it is a numeric parameter. Running it through `resolveColorAsThreeColor` or `resolveColorToken` (the canvas probe utility) would be incorrect: the canvas probe sets `ctx.fillStyle = raw` where `raw` would be `"180"` (just a number) — the browser would treat this as an invalid color string and return black `{ r: 0, g: 0, b: 0 }`. The shader uniform would receive black instead of a hue shift value.

**Prevention:**
- Read `--signal-accent` with a direct `parseFloat()` call on the `getPropertyValue` result, not through `resolveColorToken`. The two utility paths are for different var types:
  - Color tokens (`--color-primary`, etc.): use `resolveColorToken` / `resolveColorAsThreeColor`
  - Numeric signal parameters (`--signal-intensity`, `--signal-speed`, `--signal-accent`): use `parseFloat(getPropertyValue(...))` + module-level caching
- Document this distinction clearly in the color-resolve module. The current module name `color-resolve.ts` implies it is for colors only — enforce that contract.

**Phase to address:** Phase 1 of v1.2 (INT-04). Cannot be discovered after the fact — the wrong color black will look like a "theme issue" and be hard to trace.

---

### Pitfall 8: Breaking Consumers When Fixing Type Mismatches

**What goes wrong:**
Fixing a prop type (e.g., tightening `bgShift` from `boolean | string` to `boolean`, or changing a variant type in CVA) is a TypeScript breaking change for any consumer that passes the wrong type. In a design system with 29 SF-wrapped components, a type fix in a shared interface (e.g., `SFSectionProps`, a CVA variant config, the `spacing` union) ripples to every consumer of that component across all 5 pages plus any documentation examples.

The specific risk for v1.2: fixing `bgShift` to be strictly `boolean` may produce TypeScript errors in consumer files that currently pass the prop incorrectly but happen to work at runtime due to type widening.

**Prevention:**
- Before fixing any prop type, run `tsc --noEmit` to get a full list of current type errors. This establishes the baseline.
- Fix the type in the component definition, then immediately run `tsc --noEmit` again. All new errors are consumer call sites that need updating.
- Do NOT mark consumer errors as `@ts-ignore` or `as any`. Fix the call site — the point of the type fix is to enforce correctness at all call sites.
- Batch all type fixes together in a single pass rather than fixing one at a time — type errors from one fix may be masked by errors from another, giving a false "clean" result between fixes.

**Phase to address:** Phase 2 of v1.2 (bgShift type fix). This is the same phase as fixing reference page layout gaps — do both in a single `tsc --noEmit` sweep.

---

## Minor Pitfalls

### Pitfall 9: `useSignalframe()` Called Outside Provider Throws Unhelpful Error

**What goes wrong:**
If `useSignalframe()` is called in a component that is not inside `SignalframeProvider`, the `useContext` call returns `null`. Without an explicit null-check and throw, the component receives `null` and may silently render incorrectly, or throw a cryptic "Cannot read properties of null" error at a point distant from where the provider was missed.

**Prevention:**
- The `useSignalframe()` hook must guard and throw immediately:
  ```ts
  export function useSignalframe(): SignalframeConfig {
    const ctx = useContext(SignalframeContext);
    if (ctx === null) {
      throw new Error(
        '[SignalframeUX] useSignalframe() must be called inside a <SignalframeProvider>. ' +
        'Wrap your app root with createSignalframeUX(config).'
      );
    }
    return ctx;
  }
  ```
- The error message should include the fix — not just the problem.

**Phase to address:** Phase 3 of v1.2 (DX-05). Build this into the hook from the first commit.

---

### Pitfall 10: Session State Persisting Stale Filter Slugs After Component Rename

**What goes wrong:**
Saving filter state by component slug or label string (e.g., `"Animation"`, `"Layout"`) to localStorage means a rename or restructuring of filter categories breaks the restored state — the old slug is still in storage but no longer matches any active filter, producing a "no results" view on return.

**Prevention:**
- Store filter state as canonical keys that do not change (e.g., component type enum values, not display labels).
- Version the storage key: `sf-filters-v1` — when the filter schema changes, bump to `sf-filters-v2`. On read, if the key is the old version, discard and use defaults.
- Keep storage schema minimal: store only what is needed to restore the UI state, not derived data.

**Phase to address:** Phase 4 of v1.2 (STP-01). Define the storage schema and versioning strategy before implementation.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|----------------|------------|
| INT-04: CSS var→WebGL bridge | Per-frame `getComputedStyle` → Lighthouse TBT regression | Module-level cache + MutationObserver invalidation from day one |
| INT-04: CSS var→WebGL bridge | Missing `--signal-*` defaults → magenta flash on slow connections | Declare defaults in globals.css before wiring any uniform reads |
| INT-04: `--signal-accent` uniform | Wrong utility: passing hue int through canvas color probe → uniform receives black | Use `parseFloat(getPropertyValue(...))` directly, never `resolveColorToken` |
| INT-03: SignalMotion placement | Wiring unused component without testing reduced-motion contract | Verify `prefers-reduced-motion` path halts motion before merging |
| bgShift type fix | Propagating type fix breaks consumer call sites silently | Run `tsc --noEmit` before and after, fix all consumer errors in same commit |
| DX-04: registry.json | Nested file paths fail shadcn CLI resolution | Flat registry structure with explicit `target` paths per file |
| DX-04: registry.json | Omitting `registryDependencies` for shadcn base components | List all `ui/` base component names in `registryDependencies` |
| DX-05: config provider | Provider placed in Server Component layout → context infection | Use "hole in the donut" pattern; `children` stay server-rendered |
| DX-05: config provider | Callback props in config object → non-serializable, breaks server boundary | Config values must be plain serializable data only |
| STP-01: session persistence | Reading localStorage in render path → hydration mismatch | Always read in `useEffect`, never in render or component body |
| STP-01: tab state specifically | Tab children mismatch server/client → hydration error → CLS | Use cookies + `cookies()` API if tab children differ; otherwise `suppressHydrationWarning` on container |
| STP-01: filter slug persistence | Rename breaks saved state → "no results" on return | Version storage keys, use canonical enum keys not display labels |
| Any prop type fix | `@ts-ignore` hiding the real consumer error | Fix the consumer. Never suppress the type error. |

---

## "Looks Done But Isn't" Checklist for v1.2

- [ ] **CSS var bridge (INT-04):** `--signal-intensity`, `--signal-speed`, `--signal-accent` declared in globals.css with defaults before any WebGL uniform reads
- [ ] **CSS var bridge (INT-04):** Lighthouse Performance score unchanged after wiring (run before/after comparison)
- [ ] **CSS var bridge (INT-04):** Chrome DevTools Performance flame chart shows zero `Recalculate Style` entries in GSAP ticker frames
- [ ] **Signal accent (INT-04):** `--signal-accent` read as `parseFloat`, never through canvas color probe
- [ ] **bgShift fix:** `tsc --noEmit` clean after fix — zero type errors, no `@ts-ignore` added
- [ ] **Registry (DX-04):** `npx shadcn@latest add` from a fresh project successfully installs an SF component end-to-end
- [ ] **Registry (DX-04):** JSON validated against `https://ui.shadcn.com/schema/registry.json` schema
- [ ] **Config provider (DX-05):** Layout primitives (`SFSection`, `SFContainer`, etc.) remain Server Components after provider is wired — verified with `next build` and bundle analyzer
- [ ] **Config provider (DX-05):** `useSignalframe()` outside provider throws descriptive error with fix instructions
- [ ] **Session persistence (STP-01):** No hydration warnings in browser console after implementing localStorage reads
- [ ] **Session persistence (STP-01):** Lighthouse CLS score unchanged after adding session persistence
- [ ] **Session persistence (STP-01):** Storage keys versioned — bump key if schema changes during implementation

---

## Sources

- [Nicolas Mattia — How to Set WebGL Shader Colors with CSS and JavaScript (2025-01-29)](https://nmattia.com/posts/2025-01-29-shader-css-properties/) — canvas probe color resolution, performance metrics
- [What forces layout/reflow — Paul Irish (comprehensive list)](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) — `getComputedStyle` as forced synchronous layout trigger
- [MDN — Window.getComputedStyle()](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) — forces layout, returns resolved values
- [MDN — Animation performance and frame rate](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate) — rAF performance model
- [Next.js — Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components) — createContext Client Component requirement
- [Vercel KB — Using React Context for State Management with Next.js](https://vercel.com/kb/guide/react-context-state-management-nextjs) — "hole in the donut" pattern
- [Next.js — createContext in Server Component error](https://nextjs.org/docs/messages/context-in-server-component) — official error explanation
- [Next.js — Hydration error message](https://nextjs.org/docs/messages/react-hydration-error) — official hydration mismatch docs
- [FluentReact — How to Fix Next.js localStorage and Hydration Errors Cleanly](https://www.fluentreact.com/blog/nextjs-localstorage-hydration-errors-fix) — useEffect pattern for localStorage
- [shadcn/ui — registry.json spec](https://ui.shadcn.com/docs/registry/registry-json) — required fields, flat structure requirement
- [shadcn/ui — registry-item.json spec](https://ui.shadcn.com/docs/registry/registry-item-json) — file type, target, no content property
- [shadcn/ui — Getting Started with Registry](https://ui.shadcn.com/docs/registry/getting-started) — CLI installation pattern
- [CVA — TypeScript guide](https://cva.style/docs/getting-started/typescript) — type safety for variant props
- [Next.js Hydration Errors in 2026 (Medium)](https://medium.com/@blogs-world/next-js-hydration-errors-in-2026-the-real-causes-fixes-and-prevention-checklist-4a8304d53702) — 2026 checklist
- [W3C CSSWG — getComputedStyle custom property resolved values (issue #2358)](https://github.com/w3c/csswg-drafts/issues/2358) — spec behavior for custom properties

---

*Pitfalls research for: v1.2 Tech Debt Sweep — CSS var→WebGL bridge, component registry, config provider, session persistence, type mismatch fixes*
*Researched: 2026-04-06*
