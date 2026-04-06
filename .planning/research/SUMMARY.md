# Project Research Summary

**Project:** SignalframeUX v1.4 Feature Complete
**Domain:** Design system component library + interactive showcase site (Next.js 15 / React 19)
**Researched:** 2026-04-06
**Confidence:** HIGH

## Executive Summary

SignalframeUX v1.4 is a completion milestone for an existing, well-structured design system — not a greenfield build. The system ships 45 SF components, a working registry, and a ComponentsExplorer at v1.3. The v1.4 goal is threefold: (1) close the remaining shadcn/Radix component wrapping gaps, (2) build interactive component detail views (inline expand with props, variants, code), and (3) finalize the token system. Critically, all required infrastructure already exists — GSAP for animation, SFTabs for the detail panel, SharedCodeBlock for code display, api-docs.ts for prop data, and the registry for metadata. The milestone requires authoring and wiring, not new architecture.

The recommended approach is dependency-ordered execution: close known tech debt first (MutationObserver leaks, NaN guards, Lenis scroll races, duplicate TOAST entry), then finalize tokens, then wrap the one remaining SF component (SFInputGroup), then build SFDrawer, then construct the detail view data layer, then build the ComponentDetail panel itself, then integrate it into ComponentsExplorer. This order is not optional — the tech debt items directly undermine detail view behavior if left open. The interactive detail views are the highest-value feature and have the most failure modes; they must be built last when the foundation is stable. Syntax highlighting (shiki, server-only, ~0 KB initial bundle impact) is the only new package required beyond shadcn CLI peer deps.

The key risk is bundle bloat from naive detail view implementation. ComponentsExplorer is already a client component. If all 49 component detail previews are imported at the top level, the page chunk will balloon and break the 150 KB performance gate. The mitigation is clear and verified: use `next/dynamic` for the ComponentDetail panel, load detail content only on click, source all data from static TypeScript imports (zero fetch calls), and keep the panel as a DOM sibling outside the GSAP Flip container. Secondary risks — z-index conflicts between the detail panel and the canvas cursor/SignalOverlay, Lenis scroll races on panel open, and WebGL color bridge breakage from token changes — each have specific, low-cost fixes documented in PITFALLS.md.

---

## Key Findings

### Recommended Stack

The existing stack requires no new framework-level additions. The v1.4 dependencies are minimal and well-understood. `shiki` (server-only, ~50-80 KB async, zero initial bundle impact) handles syntax highlighting in detail views using the RSC pattern — no client JS shipped, no MDX pipeline needed. Remaining shadcn component dependencies (`vaul`, `input-otp`) are installable via `pnpm dlx shadcn@latest add` and have confirmed React 19 support. The projected post-v1.4 bundle sits at 107-110 KB — well within the 150 KB gate — provided heavy components use the proven P3 lazy pattern (`next/dynamic`, `ssr: false`).

**Core new packages:**
- `shiki@^1.x` (server-only): Code block syntax highlighting — RSC-native, zero client JS, Serverless Runtime only (project default). Use `shiki/core` fine-grained (~50-80 KB async) not `shiki/bundle/web` (695 KB gzip).
- `vaul@^1.1.2`: Required by shadcn Drawer (SFDrawer). React 19 support confirmed in v1.1.1.
- `input-otp@^1.x`: Required by shadcn InputOTP (SFInputOTP, P2). P1 direct import acceptable (~5 KB).

**What NOT to add:**
- `framer-motion` / `motion` — dual animation system conflicts with GSAP `globalTimeline.timeScale(0)` reduced-motion kill switch
- `@storybook/*` — 200+ MB infrastructure duplicating the in-site explorer
- `recharts` — defer until SFChart is explicitly scoped (cdOS milestone)
- `shiki/bundle/web` or `shiki/bundle/full` — 695 KB and 6.4 MB respectively; use `shiki/core` only
- MDX pipeline — structured TypeScript data in api-docs.ts is the established pattern
- `react-docgen-typescript` — CVA variant types confuse the parser; hand-authored api-docs.ts is the correct approach

Full stack detail: `.planning/research/STACK.md`

### Expected Features

The detail view is the milestone's primary feature. The industry standard (shadcn/ui, Radix, MUI) is full-page component documentation. SignalframeUX's differentiating approach is inline expansion — card expands in place, grid context preserved — which is architecturally consistent with the existing GSAP Flip filter animations. The detail panel content follows the industry norm of 3 tabs (VARIANTS, PROPS, CODE). The biggest non-engineering effort is authoring `ComponentDoc` entries for all ~31 grid components; only ~15 have entries today.

**Must have (table stakes):**
- Component detail view — inline expand from grid card with variant grid, props table, copyable code snippet, and CLI install command
- Props data authored for all 45 existing components — prerequisite for the detail view having value; largest non-engineering effort
- Homepage grid cards clickable with same detail expansion behavior (PROJECT.md hard requirement)
- SFDrawer (vaul-based, lazy, meta.heavy: true) — fills bottom-sheet overlay gap not covered by SFSheet
- Copy-to-clipboard on all code blocks in detail view
- FRAME/SIGNAL badge + pattern tier (A/B/C) surfaced in detail view — data already exists in registry
- CLI install snippet per component in detail view — deterministic from component name, zero new data needed
- Token system audit committed — globals.css annotated, elevation absence explicitly documented

**Should have (differentiators):**
- SIGNAL layer animation tokens surfaced per component in detail view — no other design system exposes this
- DU/TDR aesthetic applied to the detail panel itself — sharp edges, uppercase labels, yellow accent on selected state
- Component composition callout (which SF components compose another)
- v1.2/v1.3 tech debt closed (MutationObserver, NaN guard, Lenis race, duplicate TOAST)

**Defer to v1.4.x:**
- SFHoverCard — Radix HoverCard, FRAME-only; trigger: detail view visual QA passes
- SFInputOTP — cdOS auth flows; trigger: cdOS milestone scoping starts
- Token usage callout per component in detail view

**Defer to v2+ (explicitly excluded from v1.4):**
- SFCarousel — GSAP animation frame conflict; aesthetic misalignment with DU/TDR
- SFChart — recharts ~50 KB; no current consumer identified
- SFResizable — no identified use case
- SFContextMenu — inaccessible on touch; aesthetic misalignment
- SFSidebar — large composable system; defer to cdOS milestone
- DataTable composite block, SFFileUpload, Figma embed, registry namespace strategy

Full feature detail: `.planning/research/FEATURES.md`

### Architecture Approach

The v1.4 architecture adds two new files (`components/blocks/component-detail.tsx`, `lib/component-registry.ts`), modifies five existing files, and creates three registry artifacts. No new routes, no new top-level directories. The critical structural constraint is keeping `ComponentDetail` as a DOM sibling of the GSAP Flip grid div — not inside it — to prevent detail panel geometry from polluting Flip state captures during filter animations. All detail data is sourced from static TypeScript imports (zero runtime fetches), making the data layer synchronous, tree-shakeable, and free of loading states.

**Major new components:**
1. `ComponentDetail` (NEW Client Component) — expandable panel below the grid; SFTabs structure (VARIANTS/PROPS/CODE); GSAP height animation from 0 to auto; keyboard accessible (Escape closes, focus returns to trigger)
2. `lib/component-registry.ts` (NEW) — static map of `ComponentEntry.index` → `ComponentRegistryEntry` (variants with preview JSX, code snippet, docId pointer to api-docs.ts)
3. `lib/api-docs.ts` (MODIFY) — extend with `ComponentDoc` entries for all ~31 grid components lacking docs; existing `PropDef` type is sufficient
4. `ComponentsExplorer` (MODIFY) — add `activeDetail` state via `useSessionState`, `onClick` per grid cell, `<ComponentDetail>` rendered as DOM sibling after gridRef
5. `lib/code-highlight.ts` (NEW, server-only) — shiki RSC module; returns highlighted HTML string; zero client JS

**Sequenced build order (each phase has hard prerequisites):**
1. Token finalization (no prerequisites — pure CSS, two-line change + audit pass)
2. SFInputGroup (only remaining unwrapped ui/ component)
3. SFDrawer (P3 lazy pattern — proven from v1.3 Calendar/Menubar)
4. Detail data authoring — `component-registry.ts` + `api-docs.ts` extensions (parallelizable)
5. ComponentDetail panel (depends on Phase 4 data existing)
6. ComponentsExplorer integration (depends on Phase 5 component existing)
7. Audit, tech debt closure, Lighthouse verification

Full architecture detail: `.planning/research/ARCHITECTURE.md`

### Critical Pitfalls

1. **MutationObserver never disconnects in signal-mesh.tsx / glsl-hero.tsx** — module-level `_signalObserver` has no cleanup. Detail views dramatically increase mount/unmount frequency, causing observer accumulation and WebGL animation jank. Fix: add `disconnect()` + null reset in GSAP context cleanup `return` before building any detail views.

2. **Detail view bundle bloat from naive imports** — importing all 49 component previews at the top of ComponentsExplorer will balloon the page chunk and break the 150 KB gate. Use `next/dynamic` for ComponentDetail, load content only on click, source all data from static TypeScript imports (never `fetch()`). Recovery cost is HIGH if caught late.

3. **Z-index conflicts between detail panel and fixed-position chrome** — canvas cursor sits at z-500; shadcn modal defaults to z-50. Detail panel opens with cursor visible on top of content. Fix: use `--z-overlay` token for panel; add `[data-modal-open]` CSS rule dropping cursor z-index below panel.

4. **Lenis scroll race on programmatic scroll from detail view** — the existing `window.scrollTo` rAF workaround is brittle. Any new scroll in detail view code must use `lenis.scrollTo` via the hook. Fix existing race in tech debt phase; enforce via grep check for `window.scrollTo`.

5. **Token finalization breaking WebGL color bridge** — `color-resolve.ts` caches OKLCH values with a TTL. Any OKLCH value change in globals.css renders the cache stale. Extending alpha syntax (`oklch(L C H / A)`) may break the parser silently. Audit bridge token dependencies before modifying any color tokens; visual-verify SignalMesh + GLSL hero after each globals.css color change.

6. **`readSignalVars` NaN propagation into WebGL uniforms** — `NaN || fallback` guard works for full garbage values but is fragile for unit-suffix edge cases (`"0.5px"` returns `0.5`, which may be wrong). Replace with explicit `isNaN()` guard in both signal-mesh.tsx and glsl-hero.tsx before token finalization work modifies globals.css.

7. **Duplicate TOAST entries making detail view routing ambiguous** — indices `"010"` and `"022"` both carry `name: "TOAST"`. Any routing or grouping logic using `name` as key will collide. Use `index` as routing key; rename display labels to `TOAST (FRAME)` and `TOAST (SIGNAL)`.

Full pitfall detail: `.planning/research/PITFALLS.md`

---

## Implications for Roadmap

Based on combined research, a 5-phase structure is recommended. The dependency chain is explicit — each phase has hard prerequisites from the prior phase and must not be reordered.

### Phase 1: Tech Debt Closure

**Rationale:** Four known tech debt items (MutationObserver, NaN guard, Lenis race, duplicate TOAST) directly threaten v1.4 feature stability. The MutationObserver and Lenis issues are triggered by the increased mount/unmount and programmatic scroll frequency that detail views introduce. The TOAST naming issue becomes structural the moment any routing logic uses `name` as a key. These are low-cost fixes with high if-deferred risk. Close them first, before any new feature work.
**Delivers:** All four debt items verified closed via code review and grep; stable foundation for v1.4 features
**Addresses:** PITFALLS.md items 1, 4, 6, 7
**Avoids:** Observer jank accumulation, scroll races, routing ambiguity in later phases
**Research flag:** No research needed — all fixes are localized with clear implementation patterns

### Phase 2: Token Finalization

**Rationale:** Pure CSS audit with no dependency on the detail view feature. Doing it second means the token system is stable before any component is built and before the WebGL color bridge is exercised by new token values. The core change (moving `--color-success` / `--color-warning` into `@theme`) is two lines; the audit pass and SCAFFOLDING.md documentation are the bulk of the effort. The WebGL bridge dependency audit must happen in this phase — not after — to prevent silent visual regressions.
**Delivers:** Finalized globals.css with `--color-success` / `--color-warning` in `@theme`, elevation absence explicitly documented, WebGL bridge token dependencies audited and noted in SCAFFOLDING.md, sidebar/chart tokens documented
**Addresses:** FEATURES.md token system audit requirement; PITFALLS.md item 5 (WebGL bridge)
**Avoids:** Color token changes landing after detail views are live (harder to visual-verify with more moving parts)
**Research flag:** No research needed — token locations and gaps already identified in ARCHITECTURE.md and PITFALLS.md

### Phase 3: Remaining SF Components (SFInputGroup + SFDrawer)

**Rationale:** SFInputGroup is the only unwrapped `ui/` component — a single-file change. SFDrawer is the one new P1 component from FEATURES.md. Both must land after token finalization so they use the final token vocabulary. SFDrawer requires the P3 lazy pattern (`next/dynamic`, `ssr: false`, `meta.heavy: true`), which is proven from v1.3 Calendar/Menubar but deserves a clean verification pass. Grouping these two keeps the component surface final before detail view data authoring begins.
**Delivers:** `sf-input-group.tsx` + barrel + registry entry; `sf-drawer.tsx` (lazy, vaul-based) + registry entry — component set is complete for v1.4
**Uses:** STACK.md vaul v1.1.2 (verify package.json first; may already be present transitively)
**Addresses:** FEATURES.md P1 SFDrawer; ARCHITECTURE.md SFInputGroup gap closure
**Avoids:** PITFALLS.md item 8 (arbitrary spacing — same-commit spacing audit per component); `rounded-none` regression on Radix base components
**Research flag:** No research needed — SFInputGroup is standard Pattern A; SFDrawer follows proven P3 lazy pattern from v1.3

### Phase 4: Detail View Data Layer

**Rationale:** The detail view feature splits into data (what to show) and UI (how to show it). Building data first — `lib/component-registry.ts` and the `api-docs.ts` extensions — decouples the two work streams. The registry file can be authored while the panel UI is being designed. This is the largest non-engineering effort of the milestone (~31 ComponentDoc entries to author); starting it early reduces the tail risk of blocking the UI phase.
**Delivers:** `lib/component-registry.ts` (static map of all grid items to variants + code snippets + doc pointers); extended `lib/api-docs.ts` covering all 31+ grid components
**Addresses:** FEATURES.md dependency note on props data being the prerequisite for detail view value
**Avoids:** ARCHITECTURE.md anti-pattern of duplicating ComponentDoc data in ComponentEntry; runtime fetch anti-pattern
**Research flag:** Needs a pre-phase audit of `lib/api-docs.ts` vs the `COMPONENTS[]` array to produce an accurate authoring task count. The actual delta (currently ~15 of 31 entries exist) needs confirmation before estimating effort.

### Phase 5: Interactive Component Detail Views

**Rationale:** The milestone's primary feature. All prerequisites must be met before this phase: tech debt closed (Phase 1), tokens stable (Phase 2), component set final (Phase 3), data layer complete (Phase 4). Build the ComponentDetail panel first, then integrate into ComponentsExplorer. The lazy-load architecture (next/dynamic) must be established at the start of this phase — it is HIGH-cost to retrofit after the bundle has grown.
**Delivers:** `components/blocks/component-detail.tsx` (VARIANTS/PROPS/CODE tabs, GSAP height animation, keyboard accessible, z-index correct); updated `ComponentsExplorer` (activeDetail state, onClick, ComponentDetail as DOM sibling outside gridRef); shiki integration (`lib/code-highlight.ts`)
**Uses:** STACK.md shiki RSC pattern; existing GSAP fromTo expand pattern; SFTabs, SharedCodeBlock, useSessionState
**Implements:** ARCHITECTURE.md Phases 4-6 (ComponentDetail, shiki, ComponentsExplorer integration)
**Addresses:** All FEATURES.md MVP table-stakes items
**Avoids:** PITFALLS.md item 2 (bundle bloat — next/dynamic required); item 1 (GSAP Flip container boundary — panel is DOM sibling); item 3 (z-index — use --z-overlay token); item 4 (Lenis — lenis.scrollTo only, never window.scrollTo)
**Research flag:** The shiki OKLCH custom theme object construction needs a working prototype at phase start before full implementation. Also verify that `lib/component-registry.ts` variant preview JSX does not pull client-component imports that inflate the bundle.

### Phase Ordering Rationale

- Tech debt must precede all feature work because three of the four debt items are directly activated by patterns detail views introduce (mount/unmount frequency, programmatic scroll, routing-by-name).
- Token finalization precedes component building so new components use the final token vocabulary, and so the WebGL bridge audit happens before any OKLCH values are touched.
- SFInputGroup and SFDrawer are sequenced after token finalization but before detail view data authoring — the component set must be final before prop documentation is authored for it.
- Detail view data authoring (Phase 4) is decoupled from detail view UI (Phase 5) to enable parallel work and to front-load the largest non-engineering effort.
- Detail views come last because they have the most failure modes (bundle, z-index, scroll, data completeness) and are HIGH-cost to retrofit. Building on a stable foundation eliminates most of those risks.

### Research Flags

Phases needing deeper research during planning:
- **Phase 4 (Detail data authoring):** Pre-phase audit of `lib/api-docs.ts` vs `COMPONENTS[]` is required to produce an accurate task count and estimate authoring effort. The architecture doc estimates ~16 missing entries but this needs confirmation.
- **Phase 5 (shiki integration):** The custom OKLCH theme object construction (mapping `--sf-code-bg` / `--sf-code-text` OKLCH values into a shiki theme object) is described but not prototyped. Build a minimal proof-of-concept at phase start.
- **Phase 5 (variant preview JSX):** `ComponentRegistryEntry.variants[].preview` contains React.ReactNode. Confirm these preview renders do not pull in client component imports that add to the ComponentsExplorer bundle.

Phases with standard patterns (skip research):
- **Phase 1 (Tech debt):** All four fixes are localized with clear implementation patterns and line references in PITFALLS.md.
- **Phase 2 (Token finalization):** Pure CSS audit with all gaps already identified.
- **Phase 3 (SFInputGroup):** Standard 9-point SF wrapper checklist; no new patterns.
- **Phase 3 (SFDrawer):** P3 lazy pattern proven from v1.3 SFCalendar and SFMenubar.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All version compatibility confirmed against official docs and npm registry. Bundle impact calculations verified against v1.3 baseline (102 KB confirmed). Shiki RSC pattern verified against official Shiki docs. |
| Features | HIGH | Grounded in direct codebase audit + official shadcn/Radix docs. Feature exclusions (Carousel, Chart, Resizable, ContextMenu) are reasoned against the project's specific constraints. Table-stakes features validated against shadcn/ui, Radix, MUI as reference. |
| Architecture | HIGH | All findings verified against direct codebase inspection with line references. File list, component count, type contracts, and session state keys confirmed from source. Architecture changes are additive and non-breaking. |
| Pitfalls | HIGH (tech debt, z-index, bundle) / MEDIUM (token edge cases) | Tech debt items confirmed in source code with line references. Z-index conflicts verified from globals.css z-scale. Token OKLCH edge cases (alpha syntax, color-mix()) are sound reasoning based on code review but unconfirmed by triggering the actual failure path. |

**Overall confidence:** HIGH

### Gaps to Address

- **api-docs.ts coverage scope:** The exact count of components lacking `ComponentDoc` entries needs a pre-Phase-4 audit. ARCHITECTURE.md estimates ~15 of 31 grid items have existing entries, but the delta needs verification before estimating Phase 4 authoring effort.
- **vaul transitive presence:** STACK.md notes that vaul may already be present transitively via Sonner. Check `pnpm-lock.yaml` before Phase 3 begins to determine whether `pnpm dlx shadcn@latest add drawer` will install it or find it already present.
- **shiki custom OKLCH theme object:** The mapping of `--sf-code-bg` / `--sf-code-text` / `--sf-code-keyword` OKLCH values into a shiki theme object is described but not prototyped. Build a minimal proof-of-concept at Phase 5 start.
- **color-resolve.ts alpha syntax support:** PITFALLS.md flags that the parser may not handle `oklch(L C H / A)`. Confirm whether any existing or planned tokens use alpha syntax before Phase 2 token finalization adds new entries to `@theme`.

---

## Sources

### Primary (HIGH confidence)
- `https://shiki.style/packages/next` — Shiki RSC integration, Serverless Runtime requirement
- `https://shiki.style/guide/bundles` — Bundle sizes: full 6.4 MB / 1.2 MB gzip, web 695 KB gzip, core ~50-80 KB
- `https://ui.shadcn.com/docs/components/drawer` — Vaul dependency confirmation
- `https://ui.shadcn.com/docs/components/resizable` — react-resizable-panels v4 confirmation
- `https://ui.shadcn.com/docs/changelog/2025-10-new-components` — October 2025 additions: Spinner, Kbd, ButtonGroup, InputGroup, Field, Item, Empty — no external peer deps
- `https://www.npmjs.com/package/vaul` — v1.1.2, React 19 in peerDependencies confirmed
- `https://www.npmjs.com/package/embla-carousel-react` — v8.6.0, React 19 support confirmed
- Codebase direct audit — `components/blocks/components-explorer.tsx`, `lib/api-docs.ts`, `components/sf/index.ts`, `components/animation/signal-mesh.tsx`, `components/animation/glsl-hero.tsx`, `hooks/use-session-state.ts`, `app/globals.css` (z-index scale, token gaps), `public/r/registry.json` (49 items), `package.json`

### Secondary (MEDIUM confidence)
- `https://gsap.com/community/forums/` — GSAP `scrollHeight` expand pattern, `height: auto` via `onComplete`
- `https://ui.shadcn.com/docs/changelog/2025-10-new-components` — October 2025 new components (search result, not direct fetch)
- WAI-ARIA modal dialog keyboard pattern — Escape key, focus trap, return focus on close

### Tertiary (LOW confidence — validate during implementation)
- Lenis + GSAP ScrollTrigger multi-instance interaction — based on documented behavior and community reports; needs verification in context of detail view open/close animation
- `color-resolve.ts` alpha syntax gap — theoretical based on reading the guard logic; not confirmed by triggering the failure path

---
*Research completed: 2026-04-06*
*Ready for roadmap: yes*
