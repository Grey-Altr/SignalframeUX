# Roadmap: SignalframeUX

## Milestones

- [x] **v1.0 Craft & Feedback** — Phases 1-5 (shipped 2026-04-05)
- [x] **v1.1 Generative Surface** — Phases 6-9 (shipped 2026-04-06)
- [x] **v1.2 Tech Debt Sweep** — Phases 10-15 (shipped 2026-04-06)
- [ ] **v1.3 Component Expansion** — Phases 16-20 (active)

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

**v1.3 Component Expansion (Phases 16-20):**

- [x] **Phase 16: Infrastructure Baseline** — SF wrapper checklist, performance baseline, ComponentsExplorer categories, prop vocabulary (completed 2026-04-06)
- [x] **Phase 17: P1 Non-Animated Components** — Avatar, Breadcrumb, EmptyState, AlertDialog, Alert, Collapsible, StatusDot (FRAME-only) (completed 2026-04-06)
- [x] **Phase 18: P1 Animated Components** — Accordion (stagger), Toast/Toaster (slide), Progress (fill tween) (completed 2026-04-06)
- [ ] **Phase 19: P2 Components** — NavigationMenu, Pagination, Stepper, ToggleGroup
- [ ] **Phase 20: P3 Registry-Only + Final Audit** — Calendar (lazy), Menubar (lazy), Lighthouse check

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
**Plans:** 2 plans
Plans:
- [x] 19-01-PLAN.md — SFToggleGroup + SFPagination + SFStepper (3 FRAME/SIGNAL components)
- [ ] 19-02-PLAN.md — SFNavigationMenu (flyout + mobile SFSheet) + ComponentsExplorer entries + bundle gate

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
**Plans**: TBD

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
| 19. P2 Components | v1.3 | 1/2 | In progress | - |
| 20. P3 Registry-Only + Final Audit | v1.3 | 0/? | Not started | - |
