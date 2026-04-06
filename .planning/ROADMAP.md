# Roadmap: SignalframeUX

## Milestones

- [x] **v1.0 Craft & Feedback** — Phases 1-5 (shipped 2026-04-05)
- [x] **v1.1 Generative Surface** — Phases 6-9 (shipped 2026-04-06)
- [ ] **v1.2 Tech Debt Sweep** — Phases 10-15 (in progress)

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

**v1.2 Tech Debt Sweep (Phases 10-15):**

- [ ] **Phase 10: Foundation Fixes** — CSS var defaults, bgShift type, reference page layout
- [ ] **Phase 11: Registry Completion** — Full 34-component registry with sf-theme token entry
- [ ] **Phase 12: SIGNAL Wiring** — CSS→WebGL bridge + SignalMotion placement
- [ ] **Phase 13: Config Provider** — createSignalframeUX factory + useSignalframe hook
- [ ] **Phase 14: Session Persistence** — Filter, tab, and scroll state via sessionStorage
- [ ] **Phase 15: Documentation Cleanup** — Frontmatters, stale checkboxes, API contract docs

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
**Plans:** 2 plans
Plans:
- [ ] 10-01-PLAN.md — Signal CSS var defaults + SFSection bgShift type fix
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
**Plans**: TBD

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
**Plans**: TBD

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
**Plans**: TBD

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
**Plans**: TBD

### Phase 15: Documentation Cleanup
**Goal**: All planning documents accurately reflect the v1.2 state — no stale checkboxes, no missing frontmatter fields, API contracts complete
**Depends on**: Phases 10-14 (docs reflect what was actually built)
**Requirements**: DOC-01
**Success Criteria** (what must be TRUE):
  1. Every SUMMARY.md frontmatter has an accurate `requirements_completed` field matching the implemented state
  2. All REQUIREMENTS.md checkboxes from v1.0, v1.1, and v1.2 reflect actual completion status — no stale unchecked boxes for shipped work
  3. SCAFFOLDING.md documents the `useSignalframe()` API contract with correct parameter and return types
  4. SFSection JSDoc reflects the updated `bgShift: "white" | "black"` type (not boolean)
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
| 10. Foundation Fixes | v1.2 | 1/2 | In progress | — |
| 11. Registry Completion | v1.2 | 0/? | Not started | — |
| 12. SIGNAL Wiring | v1.2 | 0/? | Not started | — |
| 13. Config Provider | v1.2 | 0/? | Not started | — |
| 14. Session Persistence | v1.2 | 0/? | Not started | — |
| 15. Documentation Cleanup | v1.2 | 0/? | Not started | — |
