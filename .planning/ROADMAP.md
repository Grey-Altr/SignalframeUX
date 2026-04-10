# Roadmap: SignalframeUX

## Milestones

- [x] **v1.0 Craft & Feedback** — Phases 1-5 (shipped 2026-04-05)
- [x] **v1.1 Generative Surface** — Phases 6-9 (shipped 2026-04-06)
- [x] **v1.2 Tech Debt Sweep** — Phases 10-15 (shipped 2026-04-06)
- [x] **v1.3 Component Expansion** — Phases 16-20 (shipped 2026-04-06)
- [x] **v1.4 Feature Complete** — Phases 21-27 (shipped 2026-04-08)
- [ ] **v1.5 Redesign** — Phases 28-35 (in progress)

## Phases

<details>
<summary>v1.0 Craft & Feedback (Phases 1-5) — SHIPPED 2026-04-05</summary>

- [x] Phase 1: FRAME Foundation (3/3 plans) — completed 2026-04-06
- [x] Phase 2: FRAME Primitives (2/2 plans) — completed 2026-04-06
- [x] Phase 3: SIGNAL Expression (4/4 plans) — completed 2026-04-06
- [x] Phase 4: Above-the-Fold Lock (3/3 plans) — completed 2026-04-06
- [x] Phase 5: DX Contract & State (2/2 plans) — completed 2026-04-06

</details>

<details>
<summary>v1.1 Generative Surface (Phases 6-9) — SHIPPED 2026-04-06</summary>

- [x] Phase 6: Generative SIGNAL Foundation (2/2 plans) — completed 2026-04-06
- [x] Phase 7: SIGNAL Activation (2/2 plans) — completed 2026-04-06
- [x] Phase 8: First Generative Scenes (2/2 plans) — completed 2026-04-06
- [x] Phase 9: Extended Scenes + Production Integration (3/3 plans) — completed 2026-04-06

</details>

<details>
<summary>v1.2 Tech Debt Sweep (Phases 10-15) — SHIPPED 2026-04-06</summary>

- [x] Phase 10: Foundation Fixes (2/2 plans) — completed 2026-04-06
- [x] Phase 11: Registry Completion (1/1 plans) — completed 2026-04-06
- [x] Phase 12: SIGNAL Wiring (2/2 plans) — completed 2026-04-06
- [x] Phase 13: Config Provider (1/1 plans) — completed 2026-04-06
- [x] Phase 14: Session Persistence (1/1 plans) — completed 2026-04-06
- [x] Phase 15: Documentation Cleanup (2/2 plans) — completed 2026-04-06

</details>

<details>
<summary>v1.3 Component Expansion (Phases 16-20) — SHIPPED 2026-04-06</summary>

- [x] Phase 16: Infrastructure Baseline (2/2 plans) — completed 2026-04-06
- [x] Phase 17: P1 Non-Animated Components (2/2 plans) — completed 2026-04-06
- [x] Phase 18: P1 Animated Components (2/2 plans) — completed 2026-04-06
- [x] Phase 19: P2 Components (2/2 plans) — completed 2026-04-06
- [x] Phase 20: P3 Registry-Only + Final Audit (2/2 plans) — completed 2026-04-06

</details>

<details>
<summary>v1.4 Feature Complete (Phases 21-27) — SHIPPED 2026-04-08</summary>

- [x] Phase 21: Tech Debt Closure (2/2 plans) — completed 2026-04-06
- [x] Phase 22: Token Finalization (2/2 plans) — completed 2026-04-06
- [x] Phase 23: Remaining SF Components (2/2 plans) — completed 2026-04-06
- [x] Phase 24: Detail View Data Layer (2/2 plans) — completed 2026-04-07
- [x] Phase 25: Interactive Detail Views + Site Integration (2/2 plans) — completed 2026-04-07
- [x] Phase 26: Verification + Launch Gate (2/2 plans) — completed 2026-04-08
- [x] Phase 27: Integration Bug Fixes (1/1 plans) — completed 2026-04-07

</details>

**v1.5 Redesign (Phases 28-35):**

- [x] **Phase 28: Route Infrastructure** — Rename routes, add redirects, update all internal links (1/2 plans complete)
- [x] **Phase 29: Infrastructure Hardening** — Fonts-ready, overscroll-behavior, Lenis audit, Observer registration, PinnedSection primitive (completed 2026-04-08)
- [x] **Phase 30: Homepage Architecture + ENTRY Section** — 6-section restructure, full-viewport GLSL hero, nav reveal, mouse-responsive shader (completed 2026-04-08)
- [ ] **Phase 31: THESIS Section** — Scroll-driven typographic manifesto, 200-300vh pinned scroll, large type moments
- [x] **Phase 32: SIGNAL + PROOF Sections** — Atmospheric WebGL scene, interactive SIGNAL/FRAME layer separation demo (completed 2026-04-08)
- [x] **Phase 33: INVENTORY + ACQUISITION Sections** — Coded nomenclature catalog, CLI acquisition panel (completed 2026-04-09)
- [x] **Phase 34: Visual Language + Subpage Redesign** — Ghost labels, display type audit, HUD indicators, specimen-style subpages (completed 2026-04-09)
- [ ] **Phase 35: Performance + Launch Gate** — Bundle gate, Lighthouse 100/100, OG tags, Awwwards package

## Phase Details

### Phase 10: Foundation Fixes
**Goal**: The codebase has zero type mismatches and correct CSS var defaults before any wiring work begins
**Depends on**: Nothing (first phase of v1.2)
**Requirements**: FND-01, FND-02, INT-01
**Success Criteria** (what must be TRUE):
  1. SignalOverlay sliders render correct colors on first load — no magenta flash from missing --signal-* CSS var defaults
  2. TypeScript compilation passes with zero errors after bgShift prop change — `tsc --noEmit` clean
  3. Any component consuming SFSection with bgShift="white" or bgShift="black" compiles without `@ts-ignore`
  4. The reference page renders with correct top spacing (nav clearance) and NEXT_CARDS grid is wrapped in SFSection
**Plans:** 2/2 plans complete
Plans:
- [x] 10-01-PLAN.md — Signal CSS var defaults + SFSection bgShift type fix
- [x] 10-02-PLAN.md — Reference page nav clearance + NEXT_CARDS SFSection wrap

### Phase 11: Registry Completion
**Goal**: Every SF component and the token system are installable via the shadcn CLI from a complete, schema-valid registry
**Depends on**: Phase 10 (FND-02 ensures bgShift type is correct before registry captures it)
**Requirements**: DX-04
**Success Criteria** (what must be TRUE):
  1. `pnpm shadcn add [component-name]` resolves and installs any of the 29 interactive SF components
  2. `pnpm shadcn add sf-theme` installs only the token system (cssVars) without any component files
  3. All 5 layout primitives appear as installable registry items alongside the 29 interactive components
  4. Each registry item carries `meta.layer` ("frame" or "signal") and `meta.pattern` ("A", "B", or "C") fields
  5. `/r/[name].json` files exist for every component in `public/r/`
**Plans:** 1/1 plans complete
Plans:
- [x] 11-01-PLAN.md — Complete registry.json (33 items + meta) and rebuild public/r/

### Phase 12: SIGNAL Wiring
**Goal**: SignalOverlay slider changes visibly affect the GLSL hero and signal mesh shaders; scroll-driven motion is active on showcase sections
**Depends on**: Phase 10 (FND-01 CSS var defaults must exist before reading them)
**Requirements**: INT-04, INT-03
**Success Criteria** (what must be TRUE):
  1. Moving the SignalOverlay intensity slider changes the visual noise amplitude in GLSLHero and/or SignalMesh in real time
  2. Moving the SignalOverlay speed slider changes the animation speed of the WebGL scenes in real time
  3. No `getComputedStyle` call appears in any GSAP ticker callback — CSS var values are read from a module-level cache
  4. At least 3 homepage showcase sections (e.g. MANIFESTO, SIGNAL/FRAME, API, COMPONENTS) have scroll-driven entrance motion via SignalMotion
  5. Reduced-motion preference disables SignalMotion animations without JS errors
**Plans:** 2/2 plans complete
Plans:
- [x] 12-01-PLAN.md — CSS->WebGL signal cache bridge for glsl-hero and signal-mesh
- [x] 12-02-PLAN.md — SignalMotion placement on 4 homepage showcase sections

### Phase 13: Config Provider
**Goal**: External consumers can initialize SignalframeUX via a config factory with full SSR safety and type-checked config
**Depends on**: Phase 12 (provider benefits from stable SIGNAL wiring as context)
**Requirements**: DX-05
**Success Criteria** (what must be TRUE):
  1. `createSignalframeUX(config)` returns `{ SignalframeProvider, useSignalframe }` that can be imported and used in a Next.js App Router layout
  2. `useSignalframe()` called outside its provider throws a descriptive error naming the missing provider
  3. Server-side render produces stable HTML with no hydration mismatch warnings in the browser console
  4. Layout primitives (SFContainer, SFSection, etc.) remain Server Components after provider wraps the app — bundle analyzer shows no layout primitives in the client chunk
  5. `motion.pause()` and `motion.resume()` pause and resume all GSAP animations globally
**Plans:** 1/1 plans complete
Plans:
- [x] 13-01-PLAN.md — createSignalframeUX factory + provider mount in layout.tsx

### Phase 14: Session Persistence
**Goal**: User state (filters, tabs, scroll position) survives page navigation within a browser session without causing hydration errors
**Depends on**: Phase 11 (ComponentsExplorer fully populated before session state added)
**Requirements**: STP-01
**Success Criteria** (what must be TRUE):
  1. Selecting a filter on /components, navigating away, and returning restores the same filter selection
  2. The active tab on /tokens persists across navigations within the same browser session
  3. Scroll position on /components is restored on back-navigation
  4. A hard page reload clears all persisted state (sessionStorage semantics, not localStorage)
  5. No hydration mismatch warnings appear in the browser console on any page that uses session state
**Plans:** 1/1 plans complete
Plans:
- [x] 14-01-PLAN.md — useSessionState + useScrollRestoration hooks and integration into ComponentsExplorer + TokenTabs

### Phase 15: Documentation Cleanup
**Goal**: All planning documents accurately reflect the v1.2 state — no stale checkboxes, no missing frontmatter fields, API contracts complete
**Depends on**: Phases 10-14 (docs reflect what was actually built)
**Requirements**: DOC-01
**Success Criteria** (what must be TRUE):
  1. Every SUMMARY.md frontmatter has an accurate `requirements_completed` field matching the implemented state
  2. All REQUIREMENTS.md checkboxes from v1.0, v1.1, and v1.2 reflect actual completion status — no stale unchecked boxes for shipped work
  3. SCAFFOLDING.md documents the `useSignalframe()` API contract with correct parameter and return types
  4. SFSection JSDoc reflects the updated `bgShift: "white" | "black"` type (not boolean)
**Plans:** 2/2 plans complete
Plans:
- [x] 15-01-PLAN.md — SUMMARY frontmatter normalization + REQUIREMENTS archive checkbox fixes
- [x] 15-02-PLAN.md — SCAFFOLDING.md API contract + DOC-01 closure

### Phase 16: Infrastructure Baseline
**Goal**: All preconditions for component authoring are satisfied — shadcn bases installed, build clean, wrapper checklist codified, prop vocabulary locked
**Depends on**: Phase 15 (v1.2 complete)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04
**Success Criteria** (what must be TRUE):
  1. `pnpm build` completes with zero errors after all P1/P2 shadcn bases are installed — `tsc --noEmit` clean
  2. SCAFFOLDING.md contains an SF Wrapper Creation Checklist covering: rounded-none audit, `intent` prop rule, barrel rule, registry same-commit rule, a11y smoke test, and prefers-reduced-motion rule
  3. Lighthouse LCP, TTI, and initial bundle size are recorded as a numbered baseline before any v1.3 component ships
  4. ComponentsExplorer on /components displays six named category groups: Forms, Feedback, Navigation, Data Display, Layout, Generative
  5. Prop vocabulary is documented — `intent` for semantic variants, `size` for scale, `asChild` for composition — and any existing component deviating from it is flagged for remediation
**Plans:** 2/2 plans complete
Plans:
- [x] 16-01-PLAN.md — Install 7 shadcn bases + capture performance baseline
- [x] 16-02-PLAN.md — SCAFFOLDING.md (checklist + prop vocabulary) + ComponentsExplorer category migration

### Phase 17: P1 Non-Animated Components
**Goal**: Seven FRAME-only components are live in the system — user identity, navigation hierarchy, inline feedback, and confirmation patterns — with zero SIGNAL layer involvement
**Depends on**: Phase 16 (shadcn bases installed, wrapper checklist available)
**Requirements**: NAV-01, NAV-02, NAV-03, FD-04, FD-05, FD-06, MS-02
**Success Criteria** (what must be TRUE):
  1. SFAvatar renders with a square crop (zero border-radius) and correctly cascades through image → initials → icon fallback states
  2. SFBreadcrumb renders navigation hierarchy as a Server Component with no client-side JavaScript
  3. SFEmptyState renders with DU/TDR aesthetic and accepts an optional ScrambleText slot — the design moment is intentional, not a gray placeholder
  4. SFAlertDialog blocks interaction with a focus-trapped overlay, supports a loading state on the confirm button, and uses `intent` (not `variant`) as its CVA prop
  5. SFAlert displays intent variants (info, warning, destructive, success) with correct token-mapped colors
  6. SFCollapsible toggles content visibility without accordion semantics — single panel, no sibling coordination
  7. SFStatusDot renders at active, idle, and offline states; GSAP pulse fires only on active state and is suppressed by prefers-reduced-motion
**Plans:** 2/2 plans complete
Plans:
- [x] 17-01-PLAN.md — Install shadcn bases + SFCollapsible, SFBreadcrumb, SFAvatar, SFAlert (completed 2026-04-06)
- [x] 17-02-PLAN.md — SFAlertDialog, SFEmptyState, SFStatusDot + ComponentsExplorer entries (completed 2026-04-06)

### Phase 18: P1 Animated Components
**Goal**: The three SIGNAL-eligible P1 components are live — Accordion stagger, Toast slide entrance, and Progress fill tween all function correctly and degrade gracefully under prefers-reduced-motion
**Depends on**: Phase 17 (FRAME layer stable before SIGNAL complexity added)
**Requirements**: FD-01, FD-02, FD-03
**Success Criteria** (what must be TRUE):
  1. SFAccordion opens a panel with a GSAP stagger animation on child content elements; closing reverses the stagger; prefers-reduced-motion shows an instant expand with no motion
  2. SFToast (Sonner) notifications slide in from the bottom-left; SFToaster is positioned at bottom-left with `--z-toast: 100`, avoiding the SignalOverlay at bottom-right
  3. SFProgress fill width animates via GSAP tween when the `value` prop changes; the SIGNAL intensity tween is guarded by prefers-reduced-motion
  4. `pnpm build` after Phase 18 passes — initial bundle size has not breached 150KB, verified with `ANALYZE=true pnpm build`
  5. All three components pass a11y smoke test: keyboard navigable, ARIA attributes correct, focus rings visible
**Plans:** 2/2 plans complete
Plans:
- [x] 18-01-PLAN.md — SFAccordion (GSAP stagger) + SFProgress (GSAP fill tween) + Sonner install (completed 2026-04-06)
- [x] 18-02-PLAN.md — SFToast/SFToaster (Sonner + GSAP slide) + ComponentsExplorer entries + bundle gate

### Phase 19: P2 Components
**Goal**: Coverage completion — view/filter controls, paginated navigation, multi-step flows, and full site navigation are all available in the system
**Depends on**: Phase 18 (SFProgress must exist before SFStepper can consume it)
**Requirements**: NAV-04, NAV-05, MS-01, MS-03
**Success Criteria** (what must be TRUE):
  1. SFNavigationMenu renders flyout panels that open on focus/hover; keyboard navigation (Tab, Enter, arrow keys, Escape) functions correctly without SF class overrides breaking Radix focus management
  2. SFPagination renders as a Server Component; previous/next and numbered page links are keyboard reachable and display current page via ARIA `aria-current`
  3. SFStepper renders a multi-step flow with per-step error state; each step's connector uses SFProgress fill — SFProgress is the underlying primitive, not a reimplementation
  4. SFToggleGroup supports both exclusive (single selection) and multi-select modes; `intent` prop drives color variant; zero border-radius on all toggle buttons
  5. All four components are exported from `sf/index.ts` barrel and have registry entries with `meta.layer` and `meta.pattern` fields
**Plans:** 2/2 plans complete
Plans:
- [x] 19-01-PLAN.md — SFToggleGroup + SFPagination + SFStepper (3 FRAME/SIGNAL components)
- [x] 19-02-PLAN.md — SFNavigationMenu (flyout + mobile SFSheet) + ComponentsExplorer entries + bundle gate (completed 2026-04-06)

### Phase 20: P3 Registry-Only + Final Audit
**Goal**: Heavy-dep components are available to consumers via the shadcn CLI without entering the main bundle; the registry is complete and the build passes Lighthouse
**Depends on**: Phase 19 (all P1/P2 components shipped, barrel verified clean)
**Requirements**: REG-01, REG-02
**Success Criteria** (what must be TRUE):
  1. `pnpm shadcn add sf-calendar` installs SFCalendar as a lazy-loaded `next/dynamic` wrapper with `ssr: false` and `SFSkeleton` fallback — the calendar code is NOT in the initial bundle
  2. SFCalendar registry entry carries `meta.heavy: true` with a bundle cost annotation in its registry description
  3. `pnpm shadcn add sf-menubar` installs SFMenubar as a registry-only entry — Menubar is NOT exported from `sf/index.ts`
  4. Final `ANALYZE=true pnpm build` confirms initial bundle is under 200KB (target under 150KB); Lighthouse scores 100/100 all categories
  5. SCAFFOLDING.md and registry.json reflect all v1.3 additions — no component shipped without a registry entry and API contract entry
**Plans:** 2/2 plans complete
Plans:
- [x] 20-01-PLAN.md — SFCalendar + SFMenubar (lazy wrappers, loaders, registry entries)
- [x] 20-02-PLAN.md — Final audit (meta.pattern fix, public/r/ rebuild, SCAFFOLDING.md, ComponentsExplorer, bundle gate)

### Phase 21: Tech Debt Closure
**Goal**: All known instability from v1.2 and v1.3 is eliminated before any v1.4 feature work begins
**Depends on**: Phase 20 (v1.3 complete)
**Requirements**: TD-01, TD-02, TD-03, TD-04
**Success Criteria** (what must be TRUE):
  1. signal-mesh.tsx and glsl-hero.tsx both call `_signalObserver.disconnect()` and null-reset the module-level observer reference inside the GSAP context cleanup return — confirmed by code review
  2. readSignalVars in both WebGL scenes uses an explicit `isNaN()` guard such that any non-numeric CSS var value (including unit-suffixed values like "0.5px") returns the defined fallback, not a propagated NaN
  3. All programmatic scroll calls in the codebase route through `lenis.scrollTo` — `grep -r "window.scrollTo"` returns zero results
  4. ComponentsExplorer displays exactly one TOAST entry per component (TOAST (FRAME) at index 010 and TOAST (SIGNAL) at a distinct index) — no duplicate display names
**Plans:** 2/2 plans complete
Plans:
- [x] 21-01-PLAN.md — Observer disconnect + isNaN guard + TOAST dedup (TD-01, TD-02, TD-04)
- [x] 21-02-PLAN.md — Lenis scrollTo migration (TD-03)

### Phase 22: Token Finalization
**Goal**: The token system has no gaps — all extended palette tokens are in @theme, elevation absence is documented, and the WebGL color bridge is audited for safety
**Depends on**: Phase 21 (stable WebGL scenes before touching OKLCH values in globals.css)
**Requirements**: TK-01, TK-02, TK-03, TK-04
**Success Criteria** (what must be TRUE):
  1. `--color-success` and `--color-warning` are declared inside the `@theme` block in globals.css — removing the `:root` fallback declarations does not break any existing component rendering
  2. globals.css contains an explicit comment block documenting the absence of elevation tokens (no box-shadow scale, no z-elevation variables) as an intentional DU/TDR design decision
  3. SCAFFOLDING.md documents sidebar and chart color token behavior — including the recommendation to avoid SFSidebar and SFChart until respective milestones
  4. color-resolve.ts handles all current token values without silent failure — visual smoke test of SignalMesh and GLSLHero after every globals.css change confirms no color regression
**Plans:** 2/2 plans complete
Plans:
- [x] 22-01-PLAN.md — Token migration (success/warning to @theme) + WebGL bridge audit (completed 2026-04-06)
- [x] 22-02-PLAN.md — Elevation policy + deferred token groups documentation (completed 2026-04-06)

### Phase 23: Remaining SF Components
**Goal**: The component set is complete for v1.4 — every identified remaining shadcn/Radix component is SF-wrapped, registered, and in ComponentsExplorer
**Depends on**: Phase 22 (token system final before new components use it)
**Requirements**: CMP-01, CMP-02, CMP-03, CMP-04
**Success Criteria** (what must be TRUE):
  1. SFDrawer opens as a bottom-sheet overlay via vaul; it is loaded with `next/dynamic` (`ssr: false`, `meta.heavy: true`) and its code does NOT appear in the initial shared bundle
  2. SFHoverCard appears on hover/focus with a FRAME-only panel (no animation), keyboard accessible, zero border-radius on the content panel
  3. SFInputOTP renders an OTP input with individual character slots; the input is keyboard navigable and passes WCAG AA color contrast
  4. SFInputGroup wraps the last uncovered `ui/` component — all shadcn base components now have an SF wrapper equivalent; the gap is closed
  5. All four components have registry entries in registry.json and `/r/` artifacts, are exported from `sf/index.ts` (except SFDrawer which is lazy), and appear in ComponentsExplorer under the correct category
**Plans:** 2/2 plans complete
Plans:
- [x] 23-01-PLAN.md — Install bases + SFInputGroup, SFHoverCard, SFInputOTP (Pattern A wrappers)
- [x] 23-02-PLAN.md — SFDrawer (Pattern B lazy) + ComponentsExplorer entries + registry build + bundle gate

### Phase 24: Detail View Data Layer
**Goal**: All component data needed to render the interactive detail views is authored and accessible via static TypeScript imports — no runtime fetch calls
**Depends on**: Phase 23 (component set must be final before documenting all components)
**Requirements**: DV-01, DV-02, DV-03
**Success Criteria** (what must be TRUE):
  1. lib/component-registry.ts exists and maps every ComponentsExplorer grid item's index to a ComponentRegistryEntry containing: variant previews (live SF component renders), a code snippet, and a docId pointer to api-docs.ts
  2. lib/api-docs.ts contains a ComponentDoc entry for every component in the registry (~49 items) — each entry has at least one PropDef with name, type, default, required, and description fields
  3. lib/code-highlight.ts exists as a server-only RSC module; calling it with a code string returns highlighted HTML using shiki/core with an OKLCH-compatible theme — zero client JS added to the bundle
**Plans:** 2/2 plans complete
Plans:
- [x] 24-01-PLAN.md — Shiki RSC module (code-highlight.ts) + component-registry.ts (35 grid entries)
- [x] 24-02-PLAN.md — api-docs.ts extension (~36 new ComponentDoc entries for full registry coverage)

### Phase 25: Interactive Detail Views + Site Integration
**Goal**: Clicking any component card on /components or the homepage grid expands an inline detail panel showing variants, props, and copyable code — the milestone's primary feature
**Depends on**: Phase 24 (all data must exist before the UI can render it)
**Requirements**: DV-04, DV-05, DV-06, DV-07, DV-08, DV-09, DV-10, DV-11, DV-12, SI-01, SI-02, SI-03, SI-04
**Success Criteria** (what must be TRUE):
  1. Clicking a component card on /components opens a ComponentDetail panel below the grid with three tabs (VARIANTS / PROPS / CODE); the panel animates open via GSAP height tween from 0 to auto; pressing Escape closes the panel and returns focus to the trigger card
  2. The VARIANTS tab renders a live grid of all `intent` and `size` values as actual SF component instances — not screenshots or static markup
  3. The PROPS tab renders a table with name, type, default, required, and description for every prop; the table is readable at all viewport widths
  4. The CODE tab shows a usage snippet with syntax highlighting and a CLI install command; both have working copy-to-clipboard buttons
  5. The detail panel header displays the FRAME or SIGNAL layer badge, the pattern tier (A / B / C), and the animation token callout (durations and easings used) for SIGNAL-layer components
  6. ComponentDetail is loaded with `next/dynamic`; opening the first detail panel does NOT push the shared JS bundle past the 150 KB gate
  7. ComponentDetail is a DOM sibling of the GSAP Flip grid div (not a child) — the panel's open/close geometry does not corrupt GSAP Flip state captures during filter animations
  8. Homepage grid cards on / open the same ComponentDetail panel with identical behavior to /components
  9. The detail panel renders with DU/TDR aesthetic: sharp edges, uppercase labels, accent color on the active tab, no decorative gradients
  10. The z-index contract is enforced — the detail panel appears above content but below the canvas cursor; `[data-modal-open]` CSS rule drops cursor z-index when panel is open
**Plans:** 2/2 plans complete
Plans:
- [x] 25-01-PLAN.md — ComponentDetail panel + ComponentsExplorer wiring
- [x] 25-02-PLAN.md — Homepage grid integration + bundle gate verification

### Phase 27: Integration Bug Fixes
**Goal**: All integration bugs found during milestone audit are resolved — homepage cards open correct detail panels, z-index contract is airtight, and registry data is accurate
**Depends on**: Phase 25 (bugs found in Phase 25 deliverables)
**Requirements**: IBF-01, IBF-02, IBF-03
**Gap Closure:** Closes P0, P1, P2 integration gaps + homepage flow break from v1.4 audit
**Success Criteria** (what must be TRUE):
  1. Clicking any homepage grid card opens the ComponentDetail panel for the correct component — the COMPONENTS array IDs map to their intended COMPONENT_REGISTRY keys
  2. Opening a detail panel with `[data-modal-open]` suppresses SignalOverlay toggle (z-210) below the panel z-index — overlay is not clickable over the detail panel
  3. Registry entry 102 docId reads `waveformSignal` and resolves to the current Phase-24 doc with correct importPath
**Plans:** 1/1 plans complete
Plans:
- [x] 27-01-PLAN.md — Homepage ID remap + SignalOverlay suppression + docId fix

### Phase 26: Verification + Launch Gate
**Goal**: The v1.4 milestone meets all hard performance constraints — bundle gate and Lighthouse audit pass against the deployed URL
**Depends on**: Phase 27 (all integration bugs fixed before final verification)
**Requirements**: VF-01, VF-02
**Success Criteria** (what must be TRUE):
  1. `ANALYZE=true pnpm build` confirms the shared JS bundle is under 150 KB — ComponentDetail lazy-load, P3 component lazy-load, and shiki server-only module all verified as non-contributors to initial bundle
  2. Lighthouse audit against the deployed Vercel URL (not CLI headless) returns 100/100 on Performance, Accessibility, Best Practices, and SEO — LCP < 1.0s, CLS = 0, TTI < 1.5s
**Plans:** 2/2 plans complete
Plans:
- [x] 26-01-PLAN.md — Bundle gate verification (ANALYZE=true build + rootMainFiles measurement + Playwright regression)
- [x] 26-02-PLAN.md — Vercel deploy + Lighthouse 100/100 audit against production URL

### Phase 28: Route Infrastructure
**Goal**: All route renames are in effect with permanent redirects and zero broken internal links — users and crawlers always land on the correct URL
**Depends on**: Nothing (first phase of v1.5; zero-risk, zero dependencies)
**Requirements**: RA-01, RA-02, RA-03, RA-04
**Success Criteria** (what must be TRUE):
  1. Navigating to `/components` returns a 308 redirect to `/inventory`; navigating to `/tokens` returns 308 to `/system`; navigating to `/start` returns 308 to `/init` — all verified via `curl -I`
  2. Every internal `<Link>` component, nav item, and footer link in the codebase points to the new route names — `grep -r '"/components"' src/` and `grep -r '"/tokens"'` return zero results
  3. The `/inventory`, `/system`, and `/init` page files exist in `app/` and render without console errors
  4. Existing functionality on all three renamed pages is unaffected — ComponentsExplorer, TokenTabs, and getting-started content are intact
**Plans:** 2/2 plans complete
Plans:
- [x] 28-01-PLAN.md — 308 redirects config + directory moves (RA-01, RA-02, RA-03)
- [x] 28-02-PLAN.md — Internal link surgery + test updates (RA-04)

### Phase 29: Infrastructure Hardening
**Goal**: The codebase is hardened against known Awwwards-class integration hazards — scroll, font, and Observer infrastructure are correct before any new scroll or WebGL work begins
**Depends on**: Phase 28 (routes stable before adding scroll infrastructure on top of them)
**Requirements**: PF-04, PF-05, PF-06
**Success Criteria** (what must be TRUE):
  1. `document.fonts.ready.then(ScrollTrigger.refresh)` fires in root layout — font reflow cannot cause CLS or ScrollTrigger pin miscalculation after Phase 31 manifesto lands
  2. `overscroll-behavior: none` is set on `<html>` in globals.css — iOS Safari rubber-band scrolling cannot flicker pinned sections
  3. GSAP Observer plugin is registered in `lib/gsap-plugins.ts` alongside ScrollTrigger — available for all Phase 30+ work without repeated imports
  4. Lenis config is audited: `ignoreMobileResize: true` is active, rAF ticker pattern matches the load-bearing pattern from v1.2, and `scrollerProxy` is confirmed absent
  5. PinnedSection component exists in `components/animation/` with `pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true` — tested in isolation with a placeholder before Phase 31 uses it in production
  6. A prefers-reduced-motion CSS media query and a JS `matchMedia` utility are confirmed present and covering all GSAP contexts before scroll-driven work begins (PF-06 gate)
**Plans:** 2/2 plans complete
Plans:
- [x] 29-01-PLAN.md — Infrastructure micro-edits + Playwright tests (PF-04, PF-05)
- [x] 29-02-PLAN.md — PinnedSection component + reduced-motion gate (PF-04, PF-06)

### Phase 30: Homepage Architecture + ENTRY Section
**Goal**: The homepage delivers a cinematic first impression — six-section architecture replaces the old page, the full-viewport GLSL hero is the entry point, and navigation is invisible until the user scrolls
**Depends on**: Phase 29 (PinnedSection primitive ready; Lenis + ScrollTrigger hardened; fonts-ready pattern in place)
**Requirements**: RA-05, EN-01, EN-02, EN-03, EN-04, EN-05, VL-03, VL-07
**Success Criteria** (what must be TRUE):
  1. `app/page.tsx` contains exactly six section landmarks in order: ENTRY, THESIS, PROOF, INVENTORY, SIGNAL, ACQUISITION — no legacy section structure remains
  2. The GLSL hero fills 100vh with zero padding or containment — it IS the viewport on load; no scrollbar, no nav bar, no sub-section padding visible above the fold
  3. `SIGNALFRAME//UX` renders at minimum 120px (Anton) centered on the shader — visible immediately, not deferred behind a fade that could suppress LCP
  4. The navigation bar is invisible on the initial viewport and becomes sticky after the user scrolls past ENTRY — confirmed at 0px scroll and at ENTRY-bottom scroll position
  5. Moving the mouse over the ENTRY section produces subtle, non-overwhelming shader parameter variation — the effect is present but does not distract from the typography
  6. CircuitDivider and MarqueeBand components are removed from the homepage — section transitions use hard cuts or scroll-driven reveals with no decorative dividers
**Plans:** 2/2 plans complete
Plans:
- [ ] 30-01-PLAN.md — Page rewrite + EntrySection + stub sections + test scaffold (RA-05, EN-01, EN-02, EN-03, VL-03, VL-07)
- [ ] 30-02-PLAN.md — Nav scroll reveal + mouse-responsive shader (EN-04, EN-05)

### Phase 31: THESIS Section
**Goal**: The manifesto occupies 200-300vh of scroll distance, placing individual type statements across the viewport as the user scrolls — the primary signature interaction that defines the Awwwards submission
**Depends on**: Phase 30 (homepage architecture must exist; PinnedSection must be production-proven in ENTRY before THESIS uses it)
**Requirements**: TH-01, TH-02, TH-03, TH-04, TH-05, TH-06
**Success Criteria** (what must be TRUE):
  1. THESIS occupies between 200vh and 300vh of scroll distance — measured in browser DevTools scroll height; not a flowing paragraph but a pinned scroll sequence
  2. Each manifesto phrase is positioned individually across the viewport via GSAP ScrollTrigger pin/scrub — statements do not flow as running text
  3. At least 3 type moments render at 80px or larger and occupy their full scroll frame as the dominant visual element
  4. Gaps between key statements measure at least 30vh in scroll distance — the void is visible and intentional, not collapsed by browser layout
  5. The content covers the SIGNAL/FRAME thesis, the Enhanced Flat Design position, and cybernetic biophilia — as declarative statements, not explanatory prose
  6. With `prefers-reduced-motion` active, all manifesto text is instantly placed at its final position with no scroll-driven animation — the content is readable without scrolling
**Plans:** 2 plans
Plans:
- [ ] 31-01-PLAN.md — Manifesto authoring (typed lib/thesis-manifesto.ts) + TH-05 content tests (TH-05)
- [ ] 31-02-PLAN.md — ThesisSection engineering: PinnedSection forwardRef + nested ScrollTrigger + reduced-motion fallback + TH-01..04, TH-06 browser tests (TH-01, TH-02, TH-03, TH-04, TH-06)

### Phase 32: SIGNAL + PROOF Sections
**Goal**: Two consecutive full-viewport sections deliver the generative identity and the interactive layer separation demo — the site's technical credibility is visible and interactable
**Depends on**: Phase 31 (THESIS complete; MutationObserver singleton confirmed solid before adding 3rd WebGL scene in SIGNAL)
**Requirements**: SG-01, SG-02, SG-03, SG-04, SG-05, PR-01, PR-02, PR-03, PR-04, PR-05, PR-06
**Success Criteria** (what must be TRUE):
  1. The SIGNAL section contains a full-viewport WebGL scene (SignalMesh or new shader) rendering at maximum intensity — no text overlay competes with the generative output
  2. SIGNAL section scroll distance is 150vh; the scene intensity ramps up as the user scrolls through — confirmed by observing uniform value change via GSAP ticker log
  3. With `prefers-reduced-motion` active, the SIGNAL section shows a static frame of the generative output with no animation
  4. The PROOF section demonstrates SIGNAL/FRAME layer separation — the user can directly observe the generative expression separate from the deterministic structure without any explanatory panel
  5. Moving the mouse (or dragging on touch) across PROOF changes the SIGNAL layer intensity in real time — the effect is immediate and proportional to pointer position
  6. System stats (component count, bundle size, Lighthouse score) appear as data points within the PROOF section, not as a separate band above or below it
  7. Touch support on PROOF is functional — tap and drag on a 375px mobile viewport produces the same SIGNAL/FRAME separation effect as mouse on desktop
  8. With `prefers-reduced-motion` active, PROOF shows a static split view with both layers visible side-by-side
**Plans:** 2/2 plans complete
Plans:
- [ ] 32-01-PLAN.md — PROOF section (A+B+C concurrent layers, rAF lerp, pointer/gyroscope, ScrollTrigger lifecycle) [PR-01..06]
- [ ] 32-02-PLAN.md — SIGNAL section (150vh scrub:2 parallax, GLSLSignal 3rd concurrent WebGL scene, reduced-motion static) [SG-01..05]

### Phase 33: INVENTORY + ACQUISITION Sections
**Goal**: The component catalog presents as a technical instrument with coded nomenclature, and the acquisition panel delivers the CLI command as the sharp close of the homepage
**Depends on**: Phase 30 (homepage architecture; INVENTORY section slot must exist before catalog is populated)
**Requirements**: IV-01, IV-02, IV-03, IV-04, IV-05, IV-06, AQ-01, AQ-02, AQ-03, AQ-04, AQ-05
**Success Criteria** (what must be TRUE):
  1. Every component in the catalog displays a coded identifier in `SF//[CAT]-NNN` format — no component renders with its plain name as the primary label
  2. Each catalog entry shows its layer tag (`[//SIGNAL]` or `[FRAME]`), pattern tier (`A`, `B`, or `C`), and component name — all three data points visible without expanding the entry
  3. Catalog entries use monospaced type (JetBrains Mono) in a dense list or grid layout — no card-based rounded-corner UI
  4. Clicking or tapping any catalog entry on the homepage or `/inventory` page opens the Phase 25 ComponentDetail panel with correct component data
  5. The homepage INVENTORY section shows exactly 12 components; the `/inventory` page shows the full catalog with filter controls (layer, pattern, category) functional
  6. The ACQUISITION section renders at or below 50vh height; it contains the `npx signalframeux init` CLI command in monospaced type with a working copy-to-clipboard button, key system stats as monospaced data points, and links to `/init` and `/inventory`
**Plans:** 4/4 plans complete
Plans:
- [x] 33-01-PLAN.md — Nomenclature system + registry reconciliation + Playwright scaffold
- [x] 33-02-PLAN.md — InventorySection homepage UI + homepage wire-up
- [x] 33-03-PLAN.md — ComponentsExplorer layer+pattern filters + live registry bridge (36 items)
- [x] 33-04-PLAN.md — AcquisitionSection terminal panel + ProofSection SYSTEM_STATS refactor [AQ-01..05, IV-06]

### Phase 34: Visual Language + Subpage Redesign
**Goal**: The full visual language system is applied site-wide — ghost labels, display type moments, HUD indicators, and redesigned subpages complete the transformation from docs site to designed artifact
**Depends on**: Phase 33 (homepage complete; all sections established before visual language audit runs across them)
**Requirements**: VL-01, VL-02, VL-04, VL-05, VL-06, SP-01, SP-02, SP-03, SP-04, SP-05
**Success Criteria** (what must be TRUE):
  1. Ghost labels (architectural text elements scaled to 200px or larger) appear in at least 2 locations as structural elements, not background decoration — they are positioned with intent in the layout grid
  2. Display type moments at 120px or larger exist in at least 3 locations across the site — ENTRY counts as one; two additional locations are required
  3. At least 40% of viewport is intentional void in THESIS and SIGNAL sections — measured by eye; negative space is the design material, not a gap to fill
  4. Magenta accent color appears in 5 or fewer distinct moments per page — counted by scanning each page; high impact, low frequency
  5. Section indicators across all pages display as system readout HUD — monospaced type, coded labels (e.g. `[01//ENTRY]`), data-dense — no decorative or generic nav dot styling
  6. The `/system` page presents token groups as specimen-style visual diagrams for spacing scale, type scale, color palette, and motion tokens — no plain tables
  7. The `/init` page uses the system initialization framing — sharp, technical, minimal prose; no "Get Started" button energy
  8. The `/reference` page uses monospaced, dense schematic layout for API docs — consistent with the DU/TDR coded aesthetic
  9. All subpages share the redesigned nav (hidden on initial viewport if applicable, sticky on scroll) and footer from Phase 30
**Plans:** 4/4 plans complete
Plans:
- [x] 34-01-PLAN.md — Visual language pass: HUD indicator, GhostLabel deploy, useNavReveal extract, magenta audit, display-type bumps, /inventory h1 fix [VL-01, VL-02, VL-04, VL-05, VL-06, SP-05]
- [x] 34-02-PLAN.md — /system specimen redesign: 4 specimen sub-components replacing TokenTabs render bodies [SP-01, SP-02, SP-05]
- [x] 34-03-PLAN.md — /init bringup sequence redesign: STEPS data preserved, onboarding blocks stripped, [01//INIT]-[05//DEPLOY] coded indicators, [OK] SYSTEM READY terminal footer [SP-03, SP-05]
- [x] 34-04-PLAN.md — /reference schematic APIExplorer restyle: grouped index + props data sheet [SP-04, SP-05]

### Phase 35: Performance + Launch Gate
**Goal**: v1.5 Redesign meets all hard performance and launch constraints — the site is ready for Awwwards submission
**Depends on**: Phase 34 (all features complete before final audit)
**Requirements**: PF-01, PF-02, PF-03, LR-01, LR-02, LR-03, LR-04
**Success Criteria** (what must be TRUE):
  1. `ANALYZE=true pnpm build` confirms shared JS bundle is under 150 KB gzip after all v1.5 redesign changes — Three.js chunk remains async, no new sync imports
  2. Lighthouse audit against the deployed Vercel URL returns 100/100 on Performance, Accessibility, Best Practices, and SEO — not CLI headless
  3. LCP on the homepage measures under 1.0s — `SIGNALFRAME//UX` heading uses `opacity: 0.01` or `clip-path` start (not `opacity: 0`) to avoid LCP suppression
  4. CLS = 0 across all pages — scroll-driven animations produce zero layout shift, confirmed in PageSpeed Insights field data
  5. The Awwwards submission package is prepared: project description, technology stack, 5+ screenshots at 1440x900, and live URL
  6. Open Graph meta tags are updated for the redesigned site — title, description, and preview image reflect the v1.5 identity
  7. The production Vercel deployment is live with zero console errors — confirmed by opening DevTools on the deployed URL
**Plans:** 1/5 plans executed (35-03 partial — Tasks 1+2+5 complete, Tasks 3+4 pending OPEN-2 checkpoint)
Plans:
- [x] 35-01-PLAN.md — Wave 0 scaffolding: ROADMAP fix, Vercel CLI upgrade, Gap 2 test + RED stubs [PF-01, PF-03]
- [ ] 35-02-PLAN.md — Wave 1 Playwright agent test suites (5 routes x 3 viewports) [PF-01, PF-03, LR-04]
- [ ] 35-03-PLAN.md — OG image + metadata + launch-gate.ts advisory tool [LR-02, PF-02] — PARTIAL: Tasks 1+2+5 done; Task 3 CHECKPOINT:DECISION awaiting OPEN-2 (metadataBase URL)
- [ ] 35-04-PLAN.md — Wave 2 chrome-devtools MCP pass + Wave 3 triage + Awwwards package [LR-01]
- [ ] 35-05-PLAN.md — Wave 4 production deploy + LR-03 console sweep + close [LR-03, PF-02]

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. FRAME Foundation | v1.0 | 3/3 | Complete | 2026-04-06 |
| 2. FRAME Primitives | v1.0 | 2/2 | Complete | 2026-04-06 |
| 3. SIGNAL Expression | v1.0 | 4/4 | Complete | 2026-04-06 |
| 4. Above-the-Fold Lock | v1.0 | 3/3 | Complete | 2026-04-06 |
| 5. DX Contract & State | v1.0 | 2/2 | Complete | 2026-04-06 |
| 6. Generative SIGNAL Foundation | v1.1 | 2/2 | Complete | 2026-04-06 |
| 7. SIGNAL Activation | v1.1 | 2/2 | Complete | 2026-04-06 |
| 8. First Generative Scenes | v1.1 | 2/2 | Complete | 2026-04-06 |
| 9. Extended Scenes + Production Integration | v1.1 | 3/3 | Complete | 2026-04-06 |
| 10. Foundation Fixes | v1.2 | 2/2 | Complete | 2026-04-06 |
| 11. Registry Completion | v1.2 | 1/1 | Complete | 2026-04-06 |
| 12. SIGNAL Wiring | v1.2 | 2/2 | Complete | 2026-04-06 |
| 13. Config Provider | v1.2 | 1/1 | Complete | 2026-04-06 |
| 14. Session Persistence | v1.2 | 1/1 | Complete | 2026-04-06 |
| 15. Documentation Cleanup | v1.2 | 2/2 | Complete | 2026-04-06 |
| 16. Infrastructure Baseline | v1.3 | 2/2 | Complete | 2026-04-06 |
| 17. P1 Non-Animated Components | v1.3 | 2/2 | Complete | 2026-04-06 |
| 18. P1 Animated Components | v1.3 | 2/2 | Complete | 2026-04-06 |
| 19. P2 Components | v1.3 | 2/2 | Complete | 2026-04-06 |
| 20. P3 Registry-Only + Final Audit | v1.3 | 2/2 | Complete | 2026-04-06 |
| 21. Tech Debt Closure | v1.4 | 2/2 | Complete | 2026-04-06 |
| 22. Token Finalization | v1.4 | 2/2 | Complete | 2026-04-06 |
| 23. Remaining SF Components | v1.4 | 2/2 | Complete | 2026-04-06 |
| 24. Detail View Data Layer | v1.4 | 2/2 | Complete | 2026-04-07 |
| 25. Interactive Detail Views + Site Integration | v1.4 | 2/2 | Complete | 2026-04-07 |
| 26. Verification + Launch Gate | v1.4 | 2/2 | Complete | 2026-04-08 |
| 27. Integration Bug Fixes | v1.4 | 1/1 | Complete | 2026-04-07 |
| 28. Route Infrastructure | v1.5 | Complete    | 2026-04-08 | 2026-04-08 |
| 29. Infrastructure Hardening | v1.5 | Complete    | 2026-04-08 | 2026-04-08 |
| 30. Homepage Architecture + ENTRY Section | 2/2 | Complete   | 2026-04-08 | - |
| 31. THESIS Section | v1.5 | 0/? | Not started | - |
| 32. SIGNAL + PROOF Sections | 2/2 | Complete   | 2026-04-08 | - |
| 33. INVENTORY + ACQUISITION Sections | 2/4 | Complete    | 2026-04-09 | - |
| 34. Visual Language + Subpage Redesign | v1.5 | 4/4 | Complete   | 2026-04-09 |
| 35. Performance + Launch Gate | 1/5 | In Progress|  | - |
