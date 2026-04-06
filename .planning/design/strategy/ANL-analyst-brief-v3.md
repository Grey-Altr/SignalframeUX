# Analyst Brief v3

**Generated:** 2026-04-06
**Milestone:** v1.2 "Tech Debt Sweep" (8 carried items from v1.0 + v1.1)
**Interview rounds:** 5
**Dimensions covered:** User Journeys, Error States, Edge Cases, Non-Functional Requirements, Integration Points
**Prior briefs:** ANL-v1 (v1.0 Craft & Feedback), ANL-v2 (v1.1 Generative Surface) -- findings from v1/v2 are referenced but not repeated

---

## Preamble

v1.2 is the first milestone that is entirely inward-facing: zero new features, zero new components, zero new user-visible behavior. Every item is wiring, cleanup, or DX infrastructure. This makes it the lowest-risk milestone in terms of user regression, but the highest-risk for introducing subtle coupling bugs between systems that were previously disconnected. The 8 items span three distinct architectural layers (WebGL uniforms, CSS custom properties, React component props), two DX surfaces (registry JSON, provider API), one persistence system (sessionStorage), and one documentation sweep. The interview focused on ordering dependencies, integration risks, and hidden assumptions in the deferred interface sketches.

---

## Round 1 -- Integration Points (INT-03/INT-04 Wiring)

**Questions probed:**
- What is the actual data flow path from SignalOverlay sliders to WebGL shader uniforms? Where does the bridge break?
- Which WebGL scenes should consume --signal-* vars, and how does each scene's render loop access CSS custom properties?
- What happens if SignalMotion wraps a section that also contains a WebGL scene (SignalMesh, GLSLHero)?

**Findings:**

The bridge is broken at a very specific point. SignalOverlay writes three CSS custom properties to `:root` via `document.documentElement.style.setProperty()`:
- `--signal-intensity` (0.0-1.0)
- `--signal-speed` (0.0-2.0)
- `--signal-accent` (0-360, degrees)

Neither SignalMesh nor GLSLHero reads any of these. Both scenes have their own hardcoded uniforms (`uTime`, `uDisplacement`, `uScroll`, `uGridDensity`, `uColor`, etc.) that are mutated directly by ScrollTrigger callbacks and GSAP ticker functions. The bridge requires each scene to add a CSS-var-to-uniform sync step in its render/ticker loop -- something like `getComputedStyle(document.documentElement).getPropertyValue('--signal-intensity')` parsed to a float and written to a new uniform.

The performance implication is non-trivial: `getComputedStyle()` forces style recalculation. Calling it 60 times per second per scene (two scenes on the homepage) is a layout thrashing risk. The alternative -- reading CSS vars only on change events from SignalOverlay -- requires a communication channel (custom event, shared ref, or context) that does not currently exist. The DX-SPEC interface sketch for `useSignalframe()` includes a `motion` controller but no signal-parameter channel, which means INT-04 wiring and DX-05 API design are coupled: the provider could be the bridge.

Additionally, `--signal-*` CSS vars have zero defaults in `globals.css`. If SignalOverlay has not mounted yet (SSR, lazy load delay, or page without GlobalEffects), any consumer reading these vars gets empty string. Defaults must be declared in `globals.css` or in the `@theme` block.

SignalMotion wrapping WebGL containers is an untested composition. SignalMotion creates two nested divs (`containerRef` > `innerRef`) and applies GSAP `fromTo` with scroll scrub to the inner div. If that inner div contains a WebGL scene that itself uses ScrollTrigger, there are now two ScrollTrigger instances watching overlapping scroll ranges, both mutating properties of the same visual element. The GSAP `fromTo` on the wrapper will animate `opacity` and `transform` on the outer div while the inner scene's ScrollTrigger mutates shader uniforms. This may work if the scroll ranges are aligned, but will produce visual disconnect if they drift. This interaction needs explicit testing or a documented constraint that SignalMotion should not wrap WebGL scene containers.

---

## Round 2 -- Error States (bgShift Prop Mismatch + CSS Var Defaults)

**Questions probed:**
- What is the actual mismatch between SFSection's `bgShift` boolean prop and the `data-bg-shift` string attribute usage in page.tsx?
- What breaks if bgShift is fixed -- does page-animations.tsx's `querySelectorAll("[data-bg-shift]")` still find elements?
- What is the failure mode if --signal-* vars are consumed before defaults exist?

**Findings:**

The bgShift mismatch is a prop-vs-attribute divergence. SFSection accepts `bgShift?: boolean` and renders `data-bg-shift={bgShift ? "" : undefined}`. But in `app/page.tsx`, every SFSection passes `data-bg-shift="white"` or `data-bg-shift="black"` as a spread string attribute via `...props`. This means the `bgShift` boolean prop is never used -- callers bypass it entirely by passing the data attribute directly. The page-animations.tsx consumer reads `el.getAttribute("data-bg-shift")` and uses the value ("white" or "black") to determine the background color target.

The fix has two paths: (a) remove the `bgShift` boolean prop and document that `data-bg-shift` is a string attribute passed via spread, or (b) change the prop to `bgShift?: "white" | "black"` and have SFSection render the attribute with the correct value. Path (b) is better for type safety -- it catches invalid values at compile time. But it changes the component API, which means the registry.json entries and any AI scaffolding documentation must be updated simultaneously. This is a dependency on DX-04.

The --signal-* var failure mode is silent. CSS `var(--signal-intensity)` with no fallback resolves to the `initial` value of the property it is applied to. For numeric uniforms that parse the CSS value as a float, `parseFloat("")` returns `NaN`, which propagates through shader math as visual corruption (black fragments, NaN colors). This is not a theoretical risk -- it will happen on every page load before SignalOverlay mounts, and on every page that does not include SignalOverlay. The fix (defaults in globals.css) must land before INT-04 wiring, otherwise the wiring introduces a boot-order race condition.

---

## Round 3 -- Edge Cases (DX-04/DX-05 API Design)

**Questions probed:**
- The registry.json already exists with 26 items. What is DX-04 actually asking for -- is it done, incomplete, or wrong?
- What is the shadcn registry v2 spec, and does the current registry conform?
- What consumers does DX-05's `createSignalframeUX()` serve that do not already have what they need?

**Findings:**

The registry.json at project root already exists and appears to conform to the shadcn registry schema (`"$schema": "https://ui.shadcn.com/schema/registry.json"`). It contains 26 items covering all SF-wrapped components plus 4 animation components. There are also individual component JSON files in `public/r/`. This means DX-04 may be substantially complete -- but the tech debt item was written when the registry did not exist, and it has not been verified against the current shadcn CLI (`npx shadcn@latest add`). The open questions from DX-SPEC remain relevant:

1. **Auto-generation**: The registry is manually maintained. If a new SF component is added and the registry is not updated, the registry is silently stale. There is no build-step validation.
2. **Missing components**: The 5 layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText) are not in the registry. These are FRAME-layer components that external consumers would need.
3. **Layer classification**: The DX-SPEC sketch includes a `layer: "frame" | "signal"` field. The current registry has no layer metadata.
4. **Variant documentation**: The DX-SPEC sketch includes `variants: Record<string, string[]>`. The current registry has no variant metadata.

So DX-04 is "exists but incomplete." The risk is treating it as done because the file exists, when the shadcn compatibility and metadata completeness have not been verified.

DX-05 (`createSignalframeUX` + `useSignalframe`) is the most architecturally consequential item and the one with the most open questions. The DX-SPEC sketch shows a provider pattern, but the current system is entirely CSS-custom-property-driven with no React context. Introducing a provider means:
- Every page in the app needs to be wrapped (layout.tsx change)
- SSR hydration must handle token resolution (CSS vars are client-only)
- The provider becomes the single point of failure for the entire design system runtime
- The `useSignalframe()` hook becomes a client-only hook, which means any Server Component that needs token values cannot use it

The question is whether DX-05 solves a real problem for the current milestone. The portfolio is the only consumer. cdOS and CD-Operator are future. If DX-05 is built for future consumers that do not exist yet, it risks over-engineering. If it is built to solve INT-04 (providing the signal-parameter bridge between SignalOverlay and WebGL scenes), it has a clear scope: the provider holds --signal-* state in React, and scenes subscribe via the hook instead of reading CSS vars. This is the only framing that justifies DX-05 in a tech debt milestone.

---

## Round 4 -- Non-Functional Requirements (STP-01 Persistence)

**Questions probed:**
- What state actually needs persisting? Is this a real user pain point or a speculative feature?
- What are the SSR hydration implications of sessionStorage reads?
- Does the App Router's client-side navigation already preserve component state?

**Findings:**

STP-01 was deferred from v1.0 with a clear interface sketch. The state to persist is:
- Component browser: search query, pattern filter, layer filter, scroll position
- Token explorer: active tab, scroll position

The real user pain is narrow: navigating from the component browser to a component detail page and back resets all filters. With Next.js App Router client-side navigation (`router.push`), React component state IS preserved for components that remain mounted. The question is whether the component browser unmounts on navigation -- if it does (different route segment), state is lost; if it does not (parallel route or layout persistence), state survives without any persistence layer.

If the component browser is at `/components` and detail pages are at `/components/[slug]`, the browser component unmounts on navigation to the detail page. This is the scenario STP-01 addresses. The fix options are:

1. **sessionStorage** -- simplest, but requires `useEffect` read on mount, which causes a flash of default state before restored state appears (layout shift risk)
2. **URL search params** -- no hydration issue (params are available on server), shareable, but changes the URL on every filter interaction
3. **Zustand with sessionStorage middleware** -- adds a dependency for a narrow use case
4. **Intercepting routes** -- `/components/(.)detail/[slug]` as a modal over the browser, preserving browser state by keeping it mounted. This is the App Router-native solution and requires zero persistence layer.

Option 4 (intercepting routes) is architecturally the cleanest and avoids the entire persistence problem. But it changes the navigation model from "page transition" to "modal overlay," which has UX implications for deep linking and browser history. Whether this is acceptable depends on the portfolio's navigation design intent.

The scope question matters: the DX-SPEC sketch includes `TokenExplorerState`, but the token explorer is on a separate page (`/tokens`). Cross-page state persistence with sessionStorage is straightforward, but intercepting routes only work within a single route tree. If STP-01 needs to cover both `/components` and `/tokens`, intercepting routes alone are insufficient.

---

## Round 5 -- User Journeys (Docs Cleanup + Ordering Dependencies)

**Questions probed:**
- Do the 14 missing SUMMARY frontmatters and 8 stale REQUIREMENTS.md checkboxes affect any tooling or automation?
- What is the correct execution order for all 8 items to avoid rework?
- Are there items that should be dropped rather than fixed?

**Findings:**

The docs cleanup (item 8) appears to be pure documentation hygiene -- no tooling currently reads SUMMARY frontmatters or REQUIREMENTS.md checkboxes programmatically. However, if DX-04 registry auto-generation is implemented as a build step that reads source annotations, the frontmatter format becomes load-bearing. And if future milestone planning uses requirement completion data, stale checkboxes produce incorrect planning inputs. The risk is low today but increases if automation is built on top of these documents. The fix is cheap (grep + sed), so it should be done regardless.

**Execution ordering (dependency analysis):**

The 8 items have the following dependency graph:

```
1. globals.css --signal-* defaults (INT-04 prerequisite)
   ↓
2. INT-04: Wire SignalOverlay CSS vars → WebGL uniforms
   (depends on: defaults exist, decision on read mechanism)
   ↓
3. INT-03: Place SignalMotion on showcase sections
   (depends on: understanding of INT-04 wiring, to avoid wrapping WebGL containers)

4. bgShift: Fix SFSection prop (independent, but touches sf-section.tsx)
   ↓
5. INT-01: Reference page nav-height + NEXT_CARDS SFSection wrap
   (independent, but if bgShift prop changes, SFSection consumers may need update)

6. DX-04: Verify/complete registry.json
   (depends on: bgShift fix landing first so registry reflects correct API)

7. DX-05: createSignalframeUX + useSignalframe
   (depends on: INT-04 decision — if provider is the bridge, DX-05 and INT-04 are coupled)
   (if provider is NOT the bridge, DX-05 is independent and can be deferred)

8. STP-01: Session state persistence
   (independent of all other items)

9. Docs: Frontmatter + checkbox cleanup
   (should run last — captures final state)
```

**Items that could be dropped or descoped:**
- **DX-05** is the strongest candidate for deferral. The portfolio is the only consumer. No external project consumes `useSignalframe()` today. Building a provider API for future consumers in a tech debt milestone risks scope creep. If INT-04 can be wired without DX-05 (via custom events or a lightweight shared ref), the provider can wait for the first external consumer.
- **STP-01** could be descoped to "intercepting routes for /components" only, deferring the full sessionStorage implementation and token explorer state.

---

## Unstated Requirements

- [REQ] `--signal-intensity`, `--signal-speed`, and `--signal-accent` MUST have defaults in `globals.css` before any WebGL scene reads them -- otherwise `parseFloat("")` produces NaN, corrupting shader output. This is a hard prerequisite for INT-04.
- [REQ] The CSS-var-to-uniform read mechanism must avoid per-frame `getComputedStyle()` calls. Either use a change-event pattern (SignalOverlay dispatches custom events when sliders move) or a shared React ref/context. Performance constraint: zero forced style recalculations in the render loop.
- [REQ] SignalMotion must document a constraint: do not wrap elements that contain their own ScrollTrigger instances (WebGL scene containers). Two overlapping ScrollTrigger instances on the same visual region produce unpredictable animation interference.
- [REQ] The bgShift fix must change the prop type from `boolean` to `"white" | "black" | undefined`, not just remove the prop. Type safety for bg-shift values prevents silent misuse. The registry.json must be updated to reflect the new prop shape.
- [REQ] DX-04 registry must include the 5 layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText) -- these are the most likely components an external consumer needs first.
- [REQ] If DX-05 is implemented, the provider MUST NOT be required for the system to function. CSS custom properties must remain the source of truth. The provider is an optional convenience layer that reads and exposes what CSS already provides. A hard provider dependency would break Server Component usage.
- [REQ] STP-01 must handle the flash-of-default-state problem: if sessionStorage is the backend, the restored state must be applied before first paint (via `useLayoutEffect`) or the component must render a skeleton until state is resolved.

---

## Assumption Risks

- [RISK] "INT-04 just needs to read CSS vars in the render loop" -- `getComputedStyle()` in a 60fps render loop forces style recalculation. If both SignalMesh and GLSLHero read computed style every frame, the main thread budget for the frame drops. This is measurable and may regress the Lighthouse performance score.
- [RISK] "DX-05 is needed for this milestone" -- The only consumer is the portfolio itself. Building a provider + hook API for zero external consumers is speculative DX investment. If the provider introduces a hydration edge case or a rendering regression, the cost exceeds the benefit within this milestone's scope.
- [RISK] "The registry.json is done because the file exists" -- The file exists with 26 items, but it has not been tested with `npx shadcn@latest add`, the layout primitives are missing, and the DX-SPEC metadata fields (layer, variants) are absent. Treating it as complete is a false positive.
- [RISK] "bgShift is a simple rename" -- Changing SFSection's prop type from `boolean` to a string union requires updating every call site in page.tsx (currently ~7 instances). If any call site is missed, TypeScript will catch it at compile time. But if the change is done as "remove prop, callers already use spread" (path a), no type safety is added and future misuse is possible.
- [RISK] "Docs cleanup has no downstream effect" -- True today, but if milestone planning or registry auto-generation ever reads these files, stale data produces incorrect automation. The fix is cheap enough that the risk is not worth carrying.
- [RISK] "STP-01 sessionStorage is straightforward" -- sessionStorage reads are synchronous but client-only. In App Router with streaming SSR, the server renders the component browser with empty/default state, then the client hydrates with restored state. This produces a visible layout shift (filter bar changes, grid reflows) that may be perceptible on slow connections.

---

## Edge Cases

- [EDGE] SignalOverlay open + theme toggle -- SignalOverlay writes `--signal-accent` as a hue degree. If the theme toggle also modifies color tokens, and a WebGL scene reads both `--signal-accent` and `--color-primary` in the same frame, the color values may be temporarily inconsistent (one updated, one stale). The read must be atomic or order-guaranteed.
- [EDGE] SignalOverlay closed + page that consumes --signal-* -- If SignalOverlay is closed (panel hidden), CSS vars retain their last-set values on `:root`. But if the user navigates to a different page via client-side routing, the vars persist. If they reload, the vars are gone (no persistence). This means signal parameter state is inconsistent across navigation types.
- [EDGE] Two SignalMotion wrappers nested -- Nothing in the API prevents `<SignalMotion><SignalMotion>...</SignalMotion></SignalMotion>`. Nested scroll scrub animations on overlapping scroll ranges will fight each other. Need either a runtime guard or a documented constraint.
- [EDGE] registry.json consumed by shadcn CLI with `registryDependencies` pointing to shadcn base components that the consumer does not have -- e.g., `sf-button` depends on `button` (shadcn base). If the consumer has a different shadcn setup or no shadcn at all, the dependency resolution fails silently or with an unhelpful error.
- [EDGE] STP-01 state schema migration -- If the `SFSessionState` shape changes between deployments (new filter added, tab renamed), `sessionStorage` will contain stale data that does not match the expected schema. A version field and migration/clear strategy is needed.
- [EDGE] bgShift value "white" on dark theme -- `page-animations.tsx` reads `data-bg-shift="white"` and presumably sets `background: white`. If the user is on dark theme, this overrides the theme background for that section. This is intentional (alternating section backgrounds), but the interaction between bgShift and theme toggle must be tested: does toggling theme while scrolled into a bgShift section produce the correct colors?
- [EDGE] DX-05 provider + React Server Components -- If `SignalframeUXProvider` is a client component (it must be, it holds state), any Server Component child that needs token values cannot use `useSignalframe()`. The token values are only available via CSS vars on the server. This means the provider pattern creates two access paths: hook (client) and CSS vars (server). Consumers must know which to use.

---

## Priority Assessment

| Priority | Item | Rationale |
|----------|------|-----------|
| P0 | Add --signal-* defaults to globals.css | Hard prerequisite for INT-04. Without defaults, wiring CSS vars to uniforms introduces NaN corruption. Zero risk, 5-minute fix. |
| P0 | INT-04: Wire SignalOverlay vars to WebGL uniforms via change-event pattern (not per-frame getComputedStyle) | Completes the SIGNAL parameter bridge. Must use event-based or shared-ref pattern to avoid layout thrashing. |
| P0 | bgShift: Change SFSection prop from boolean to `"white" \| "black"` union | Type safety fix. Blocks DX-04 registry accuracy. All 7 call sites in page.tsx need update. |
| P1 | INT-03: Place SignalMotion on showcase sections with documented WebGL-container exclusion | Activates an unused component. Must document the ScrollTrigger overlap constraint. |
| P1 | INT-01: Reference page nav-height + NEXT_CARDS SFSection wrap | Straightforward DOM fix. Low risk, independent of other items. |
| P1 | DX-04: Complete registry.json (add layout primitives, validate shadcn CLI, add layer/variant metadata) | Registry exists but is incomplete. Must be verified against `npx shadcn@latest add` before being considered done. |
| P2 | STP-01: Session state persistence (start with intercepting routes for /components, defer full sessionStorage) | Narrow user pain (filter reset on back-nav). Intercepting routes solve it without a persistence layer. |
| P2 | Docs: Frontmatter + checkbox cleanup | Pure hygiene. No blocking dependencies. Run last to capture final state. |
| P3 | DX-05: createSignalframeUX + useSignalframe | Strongest deferral candidate. Zero current external consumers. If INT-04 can be wired without the provider (via custom events), DX-05 adds no value this milestone. Recommend deferring to when cdOS becomes a real consumer. |

---

## Ordering Recommendation

```
Wave 1 (independent, parallel):
  - globals.css --signal-* defaults
  - bgShift prop type fix (SFSection + page.tsx call sites)
  - INT-01 reference page fixes
  - Docs frontmatter/checkbox cleanup

Wave 2 (depends on Wave 1):
  - INT-04 wiring (depends on --signal-* defaults)
  - DX-04 registry completion (depends on bgShift fix for accurate API)

Wave 3 (depends on Wave 2):
  - INT-03 SignalMotion placement (depends on understanding INT-04 wiring)

Wave 4 (independent, can run anytime):
  - STP-01 session persistence

Deferred:
  - DX-05 (defer to first external consumer)
```

---

*Generated by PDE-OS pde-analyst | 2026-04-06*
*Interview rounds: 5 | MECE dimensions: 5 (User Segments excluded -- no new segment findings beyond v1/v2) | Source artifacts reviewed: DX-SPEC.md, signal-overlay.tsx, signal-motion.tsx, signal-mesh.tsx, glsl-hero.tsx, sf-section.tsx, page.tsx, page-animations.tsx, registry.json, globals.css, STATE.md, PROJECT.md, MILESTONES.md, ANL-v1, ANL-v2*
