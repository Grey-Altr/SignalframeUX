# Roadmap: SignalframeUX

## Milestones

- [x] **v1.0 Craft & Feedback** — Phases 1-5 (shipped 2026-04-05)
- [x] **v1.1 Generative Surface** — Phases 6-9 (shipped 2026-04-06)
- [x] **v1.2 Tech Debt Sweep** — Phases 10-15 (shipped 2026-04-06)
- [x] **v1.3 Component Expansion** — Phases 16-20 (shipped 2026-04-06)
- [ ] **v1.4 Feature Complete** — Phases 21-27 (in progress)

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

- [x] **Phase 10: Foundation Fixes** — CSS var defaults, bgShift type, reference page layout (COMPLETE 2026-04-06)
- [x] **Phase 11: Registry Completion** — Full 33-item registry with meta.layer/meta.pattern fields (COMPLETE 2026-04-06)
- [x] **Phase 12: SIGNAL Wiring** — CSS->WebGL bridge + SignalMotion placement (COMPLETE 2026-04-06)
- [x] **Phase 13: Config Provider** — createSignalframeUX factory + useSignalframe hook (COMPLETE 2026-04-06)
- [x] **Phase 14: Session Persistence** — Filter, tab, and scroll state via sessionStorage (COMPLETE 2026-04-06)
- [x] **Phase 15: Documentation Cleanup** — Frontmatters, stale checkboxes, API contract docs (COMPLETE 2026-04-06)

</details>

<details>
<summary>v1.3 Component Expansion (Phases 16-20) — SHIPPED 2026-04-06</summary>

- [x] **Phase 16: Infrastructure Baseline** — SF wrapper checklist, performance baseline, ComponentsExplorer categories, prop vocabulary (completed 2026-04-06)
- [x] **Phase 17: P1 Non-Animated Components** — Avatar, Breadcrumb, EmptyState, AlertDialog, Alert, Collapsible, StatusDot (FRAME-only) (completed 2026-04-06)
- [x] **Phase 18: P1 Animated Components** — Accordion (stagger), Toast/Toaster (slide), Progress (fill tween) (completed 2026-04-06)
- [x] **Phase 19: P2 Components** — NavigationMenu, Pagination, Stepper, ToggleGroup (completed 2026-04-06)
- [x] **Phase 20: P3 Registry-Only + Final Audit** — Calendar (lazy), Menubar (lazy), Lighthouse check (completed 2026-04-06)

</details>

**v1.4 Feature Complete (Phases 21-26):**

- [x] **Phase 21: Tech Debt Closure** — MutationObserver disconnect, NaN guard, Lenis scroll race, duplicate TOAST entry (completed 2026-04-06)
- [x] **Phase 22: Token Finalization** — success/warning into @theme, elevation absence documented, WebGL bridge audited, sidebar/chart tokens documented (completed 2026-04-06)
- [x] **Phase 23: Remaining SF Components** — SFInputGroup, SFDrawer, SFHoverCard, SFInputOTP (completed 2026-04-06)
- [x] **Phase 24: Detail View Data Layer** — component-registry.ts, api-docs.ts extensions, code-highlight.ts (shiki RSC) (completed 2026-04-07)
- [x] **Phase 25: Interactive Detail Views + Site Integration** — ComponentDetail panel, ComponentsExplorer wiring, homepage grid wiring (completed 2026-04-07)
- [x] **Phase 27: Integration Bug Fixes** — homepage ID mismatch, SignalOverlay suppression, stale docId (completed 2026-04-07)
- [ ] **Phase 26: Verification + Launch Gate** — bundle gate (VF-01 PASSED 100.0 KB), Lighthouse deployed audit (VF-02 pending)

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
**Plans:** 2 plans (2 waves)
Plans:
- [x] 26-01-PLAN.md — Bundle gate verification (ANALYZE=true build + rootMainFiles measurement + Playwright regression)
- [ ] 26-02-PLAN.md — Vercel deploy + Lighthouse 100/100 audit against production URL

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
| 23. Remaining SF Components | v1.4 | Complete    | 2026-04-06 | 2026-04-06 |
| 24. Detail View Data Layer | v1.4 | Complete    | 2026-04-07 | 2026-04-07 |
| 25. Interactive Detail Views + Site Integration | v1.4 | Complete    | 2026-04-07 | 2026-04-07 |
| 27. Integration Bug Fixes | v1.4 | Complete    | 2026-04-07 | - |
| 26. Verification + Launch Gate | v1.4 | 1/2 | In Progress | - |
