# Project Research Summary

**Project:** SignalframeUX v1.3 Component Expansion
**Domain:** Design system component library — React/Next.js, SF-wrapped Radix primitives
**Researched:** 2026-04-06
**Confidence:** HIGH

## Executive Summary

SignalframeUX v1.3 is a targeted component expansion of an already-proven design system. The system ships 29 SF-wrapped components, a working SIGNAL generative layer, and a locked v1.0–v1.2 architecture. The task is not to build a new system — it is to close the gap between what the system currently ships and what product engineers expect from a complete component library. Research across four domains (stack, features, architecture, pitfalls) confirms this gap is well-defined and closeable in three implementation phases without architectural change.

The recommended approach is additive and disciplined: 7 P1 components close the most critical gaps immediately (accordion, toast, progress, alert-dialog, avatar, breadcrumb, empty-state), 5 P2 components complete the coverage (navigation-menu, pagination, stepper, status-dot, toggle-group), and 2 heavy-dep components (calendar, menubar) land as registry-only lazy entries in P3. All new components follow the existing SF wrapper pattern: shadcn base in `ui/`, SF-wrapped with CVA `intent` variants in `sf/`, exported from `sf/index.ts` barrel. Zero new architectural patterns are required for P1/P2. Pattern B (registry-only lazy) is the only genuinely new pattern and applies exclusively to P3.

The primary risks are all operational rather than architectural: Radix-generated `rounded-full` classes that silently survive the global `--radius: 0px` token, barrel export contamination if `'use client'` is ever added to `sf/index.ts`, bundle budget creep from Client Component accumulation, and CVA prop naming drift away from the system's `intent` convention. All six critical pitfalls identified in research are preventable with a Phase 0 checklist before a single component is authored. The risk profile is low for P1/P2 and medium for P3 only because of Calendar's bundle weight.

## Key Findings

### Recommended Stack

The stack is fully locked from v1.0–v1.2 and requires only two new runtime dependencies for the entire milestone. `sonner@2.0.7` replaces the deprecated Radix Toast primitive for all notification patterns — it is the official shadcn/ui recommendation, ships an imperative API, and provides stacking/promise behavior with no configuration. `react-day-picker@9.14.0` covers Calendar in P3 and must be lazy-loaded via `next/dynamic` with `ssr: false`; it bundles `date-fns` internally, eliminating the peer dependency problem from v8. All P1 and P2 components are fully covered by the existing `radix-ui@1.4.3` umbrella package — no installs are required for those phases.

**Core technologies:**
- `radix-ui@1.4.3` (existing): All P1/P2 Radix primitives (Accordion, AlertDialog, Avatar, NavigationMenu, Progress, ToggleGroup) — zero new installs, tree-shakeable namespace imports
- `sonner@2.0.7` (new, P1): Toast notifications — `pnpm add sonner`, imperative API, official shadcn replacement for deprecated Radix Toast
- `react-day-picker@9.14.0` (new, P3 only): Calendar — lazy-loaded, date-fns bundled, WCAG 2.1, `pnpm add react-day-picker` deferred to P3 sprint
- `gsap@3.12.7` (existing): SIGNAL layer for Progress fill tween, Toast slide entrance, Accordion stagger — no new plugins required
- `class-variance-authority@0.7.1` (existing): CVA variants with `intent` as primary prop across all new components

### Expected Features

Research surveyed shadcn/ui (70 components), Mantine v9 (110+), Radix Themes 3.0 (~40), and Ark UI (45+) to establish the gap. The 14 target components fall into three categories.

**Must have — P1 (table stakes, absence blocks real work):**
- SFAccordion — ubiquitous disclosure pattern; every major library ships it; stagger SIGNAL eligible
- SFToast (Sonner) — async feedback is non-negotiable for interactive apps; GSAP slide entrance
- SFProgress — required by SFStepper (hard dep); standalone for uploads/loading; SIGNAL fill intensity eligible
- SFAlertDialog — destructive action confirmation; separate from SFDialog by Radix semantics
- SFAvatar — user representation in nav, lists, comments; Radix fallback chain (image → initials → icon)
- SFBreadcrumb — navigation hierarchy; pure composition, no Radix primitive
- SFEmptyState — every list/table needs this; DU/TDR design moment with ScrambleText SIGNAL option

**Should have — P2 (completes coverage, lower urgency):**
- SFNavigationMenu — primary site nav with flyout panels; Radix primitive is the heaviest in the set; isolated, nothing depends on it
- SFPagination — numbered nav for tables; low complexity; pure composition
- SFStepper — multi-step flows; depends on SFProgress existing first (hard dependency)
- SFStatusDot — inline presence indicator; companion to SFAvatar; GSAP pulse on "active" state
- SFToggleGroup — exclusive/multi-select toggle set; extends existing SFToggle; Radix base

**Defer — P3 registry-only (heavy deps, `meta.heavy: true`, no SF wrapper in main bundle):**
- Calendar — react-day-picker dependency; lazy-loaded; consumers install via shadcn CLI
- Menubar — desktop-app pattern; Radix Menubar; niche use case

**Anti-features (do not build):** Carousel, Chart components, Rich Text Editor, Color Picker, File Upload with drag/drop, rounded corner variants, Data Table monolith.

### Architecture Approach

The architecture is proven and stable. v1.3 adds 15+ components to an existing 29-component system using the same three patterns that already exist, plus one new lazy pattern for P3. The barrel (`sf/index.ts`) remains the single consumer-facing import point for all P1/P2 components. Pattern A (Radix shadcn base → SF wrap), Pattern C (pure SF construction), and the new Pattern B (registry-only lazy via `next/dynamic`) cover all 14 new components. No new providers, foundational changes, or architectural inventions are needed.

**Major component groups and patterns:**
1. **Radix-wrapped (Pattern A):** SFAccordion, SFAlertDialog, SFAvatar, SFNavigationMenu, SFProgress, SFToggleGroup — shadcn base in `ui/`, SF wrap in `sf/`, `'use client'` determined by the generated shadcn file
2. **Pure SF composition (Pattern C):** SFBreadcrumb, SFEmptyState, SFPagination, SFStepper, SFStatusDot — semantic HTML + Tailwind tokens + CVA, typically Server Components
3. **Lazy registry-only (Pattern B):** SFCalendar, SFMenubar — `next/dynamic` with `SFSkeleton` fallback, NOT in `sf/index.ts`, `ssr: false`
4. **Toast system:** SFToast + SFToaster — Sonner package; Toaster mounted in layout client boundary at `bottom-left`, `--z-toast: 100`
5. **Composite (blocks/):** DataTable — SFTable + SFPagination + SFSelect + SFInput coordinated in `components/blocks/`, state in `hooks/use-data-table.ts`

**SIGNAL integration points (progressive enhancement, prefers-reduced-motion guarded):** SFProgress (fill width tween), SFToast (slide entrance/exit via `gsap.fromTo`), SFAccordion (content panel stagger on open), SFNavigationMenu (flyout entrance), SFStepper (step indicator transition).

### Critical Pitfalls

1. **Radix `rounded-full` survives global `--radius: 0px`** — Avatar, Progress, Toast, and Calendar all use literal `rounded-full` or `rounded-md` in shadcn output; the CSS var override does not reach these. Every SF wrapper must apply explicit `rounded-none` on every sub-element. Audit with DevTools computed styles before marking any component complete.

2. **`'use client'` added to `sf/index.ts` barrel** — This single line turns all 5 layout primitives into Client Components and silently inflates the bundle. The barrel must remain directive-free permanently. Each interactive SF wrapper declares `'use client'` in its own file only.

3. **Initial bundle budget breach** — Current baseline is 102KB; hard limit is 200KB. NavigationMenu adds ~12KB; Calendar adds 35-45KB if not lazy. Calendar and Menubar are P3/lazy — this is non-negotiable. Gate at 150KB; run `ANALYZE=true pnpm build` after every P1 component.

4. **CVA `intent` prop naming drift** — Existing system uses `intent` as the primary CVA variant prop. Under authoring pressure, new components default to `variant`, `type`, `status`, or `color`. The CVA key must be `intent:` in every new SF wrapper — code review gate, zero exceptions.

5. **Toast position conflicts with SignalOverlay** — shadcn Toaster default is `bottom-right` at z~100; SignalOverlay occupies `bottom-right` at z~210. SFToaster must default to `bottom-left` with a new `--z-toast: 100` token. Address in P1 Toast implementation.

6. **Keyboard navigation regressions in complex components** — NavigationMenu and Calendar have Radix-managed WAI-ARIA keyboard interaction models that SF class overrides can silently break. Mandatory keyboard nav test protocol (Tab, Enter/Space, arrow keys, Escape) required before marking either complete.

## Implications for Roadmap

The build order is dictated by three constraints: shadcn base install before SF wrap, primitive before composite (SFProgress before SFStepper), and non-animated before animated within each phase to isolate SIGNAL layer blast radius.

### Phase 0: Infrastructure Baseline

**Rationale:** Establish a clean build baseline and document the SF wrapper creation checklist before any component is authored. All pitfall prevention is front-loaded here.
**Delivers:** All P1+P2 shadcn bases installed in one pass, clean `pnpm build` confirmed, SF wrapper checklist codified (rounded-none audit, `intent` prop rule, barrel rule, registry same-commit rule, JSDoc rule, prefers-reduced-motion rule).
**Key action:** `pnpm dlx shadcn add accordion alert-dialog avatar navigation-menu progress toast toggle-group` + `ANALYZE=true pnpm build` to record the bundle baseline.
**Avoids:** Pitfalls 1, 2, 3, 4 caught before the first line of wrapper code is written.
**Research flag:** No additional research needed — standard setup.

### Phase 1: P1 Non-Animated Components

**Rationale:** Highest-value, lowest-complexity components ship first, establishing SF wrapper momentum with zero SIGNAL layer risk. FRAME-only components isolate any aesthetic or API issues before animation complexity is introduced.
**Delivers:** SFStatusDot, SFAvatar, SFBreadcrumb, SFEmptyState, SFAlertDialog — 5 components covering user identity, navigation hierarchy, and confirmation patterns.
**Implements:** Pattern A (SFAvatar, SFAlertDialog) and Pattern C (SFStatusDot, SFBreadcrumb, SFEmptyState).
**Build order:** SFStatusDot first (smallest possible Pattern C baseline), then SFAvatar, SFBreadcrumb, SFEmptyState, SFAlertDialog.
**Avoids:** Pitfall 1 (`rounded-none` on Avatar sub-elements); Pitfall 4 (`intent` on AlertDialog, not `variant`).
**Research flag:** No additional research needed — all patterns have 29 precedents in the codebase.

### Phase 2: P1 Animated Components

**Rationale:** SIGNAL integration is added after non-animated P1 components are stable. These three components carry the most architectural nuance: Radix CSS transition override for Toast, stagger wiring for Accordion, fill tween for Progress. Completing them together as a batch reduces context-switching.
**Delivers:** SFProgress, SFToast/SFToaster, SFAccordion — the feedback and disclosure layer.
**Implements:** SIGNAL integration via `useGSAP`/`useEffect` with `prefers-reduced-motion` guard on all three.
**Stack:** `pnpm add sonner` for SFToast; GSAP existing.
**Avoids:** Pitfall 5 (Toast positioned `bottom-left` with `--z-toast: 100`); Pitfall 6 (Accordion `onKeyDown` does not intercept Radix event handlers).
**Research flag:** Sonner styling override pattern is confirmed; GSAP integration follows existing `signal-motion.tsx` precedent. No additional research needed.

### Phase 3: P2 Components

**Rationale:** Second tier of coverage ships after P1 is stable and the barrel is verified clean. SFStepper has a hard dependency on SFProgress (from Phase 2). SFNavigationMenu is isolated and the heaviest implementation — deferred until all simpler patterns are established.
**Delivers:** SFToggleGroup, SFPagination, SFStepper, SFNavigationMenu — view/filter controls, pagination, multi-step flows, primary nav.
**Build order:** SFToggleGroup (Pattern A, extends existing SFToggle), SFPagination (Pattern C, pure SF), SFStepper (Pattern C, depends on SFProgress), SFNavigationMenu (Pattern A, most complex — last).
**Avoids:** Pitfall 6 (NavigationMenu keyboard nav regression — mandatory arrow key test protocol before marking complete).
**Research flag:** SFNavigationMenu warrants a targeted pre-implementation spike on Radix `data-state` CSS selector interaction with SF class overrides — MEDIUM risk without it.

### Phase 4: P3 Registry-Only Components + Composite

**Rationale:** Heavy-dep components land last, isolated by the lazy pattern, with no impact on the main bundle. DataTable composite ships here because it depends on SFPagination (Phase 3).
**Delivers:** SFCalendar and SFMenubar as `dynamic()` lazy registry entries; DataTable composite block.
**Stack:** `pnpm add react-day-picker` (P3 sprint only — not before).
**Implements:** Pattern B (lazy registry-only) for Calendar and Menubar; Pattern D (composite in `blocks/`) for DataTable.
**Avoids:** Pitfall 3 (Calendar never enters initial bundle — `dynamic()` with `ssr: false` enforced); Pitfall 6 (Calendar focus ring regression — mandatory keyboard + visual test before completing).
**Research flag:** Calendar WCAG focus ring interaction with SF class overrides on day cells may require a CSS scope isolation strategy. Validate during P3 implementation.

### Phase 5: Wiring and Documentation

**Rationale:** ComponentsExplorer, registry JSON, and SCAFFOLDING.md updates batched at the end to avoid fragmenting documentation work. Note: the same-commit rule (registry.json + public/r/ + barrel export in the same commit as each component file) is enforced throughout all phases — Phase 5 is for the final audit and Lighthouse check.
**Delivers:** Updated `COMPONENTS` array in `components-explorer.tsx`, all 13+ registry entries confirmed clean, SCAFFOLDING.md API contracts updated, final Lighthouse + bundle audit.
**Research flag:** No additional research needed.

### Phase Ordering Rationale

- SFProgress must precede SFStepper — hard dependency; Stepper uses Progress fill as step connector
- SFAvatar must precede SFStatusDot conceptually, though StatusDot ships first as a minimal Pattern C baseline
- SFNavigationMenu is always last in P2 — most complex, fully isolated, nothing depends on it
- Non-animated before animated within each phase — isolates SIGNAL layer risk from FRAME layer risk
- Pattern C before Pattern A within P1 — establishes the simpler pattern before adding Radix complexity
- Calendar and Menubar permanently deferred to P3 — bundle budget is non-negotiable, no exceptions

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (SFNavigationMenu):** Radix NavigationMenu `data-state` CSS selector model is complex; SF class overrides interact with Radix focus/open state management in non-obvious ways. Recommend a 30-minute spike reading the generated `ui/navigation-menu.tsx` before authoring the SF wrapper.
- **Phase 4 (SFCalendar):** Focus ring visibility after `rounded-none` + `sf-focusable` class override on day cells may require `[data-day-picker]` CSS scope isolation. Validate immediately after `pnpm dlx shadcn add calendar` runs.

Phases with well-documented patterns (skip research-phase):
- **Phase 0:** Standard shadcn install + checklist — no unknowns.
- **Phase 1 (non-animated):** Pattern A and C are established with 29 codebase precedents.
- **Phase 2 (animated):** GSAP integration follows `signal-motion.tsx` exactly; Sonner confirmed.
- **Phase 3 (non-NavigationMenu):** ToggleGroup, Pagination, Stepper are straightforward pattern extensions.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | `radix-ui@1.4.3` verified by direct `node_modules` inspection; all 14 target Radix primitives confirmed present; Sonner and react-day-picker versions confirmed via official sources |
| Features | HIGH | shadcn/ui, Mantine, Radix Themes, Ark UI inventories verified via WebFetch; gap cross-referenced against existing 29-component inventory; priorities anchored in PROJECT.md targets |
| Architecture | HIGH | All findings verified against actual codebase files (`sf/index.ts`, `registry.json`, `signalframe-provider.tsx`, `signal-motion.tsx`, `package.json`); no speculative claims |
| Pitfalls | HIGH / MEDIUM | Border-radius, bundle, Server/Client boundary, z-index pitfalls verified against actual codebase patterns; registry drift and SIGNAL consistency risks real but lower frequency (MEDIUM) |

**Overall confidence:** HIGH

### Gaps to Address

- **Sonner bundle size:** Estimated 7-10KB gzipped (bundlephobia approximation, MEDIUM confidence). Validate with `ANALYZE=true pnpm build` after P1 Toast integration; no remediation needed if under 15KB.
- **NavigationMenu `data-state` CSS interaction:** The specific class conflict pattern between SF Tailwind overrides and Radix's focus/open state management is not fully mapped. A pre-implementation spike on the generated `ui/navigation-menu.tsx` file eliminates this uncertainty before Phase 3.
- **react-day-picker v9 `rounded-*` surface area:** The exact sub-elements carrying `rounded-*` classes in the v9 shadcn Calendar output are not enumerated in research. Audit immediately after `pnpm dlx shadcn add calendar` runs in Phase 4.
- **Per-primitive Radix wrapper sizes:** Estimated 2-5KB gzipped total for all P1/P2 wrappers (MEDIUM confidence). Actual sizes confirmed by bundle analyzer after implementation.

## Sources

### Primary (HIGH confidence)
- `node_modules/radix-ui/src/index.ts` — direct inspection confirming all v1.3 Radix primitives available
- `node_modules/radix-ui/package.json` — sub-package versions confirmed (Accordion 1.2.12, AlertDialog 1.1.15, Avatar 1.1.10)
- `components/sf/index.ts` — current barrel structure (29 components, 104 lines) verified
- `registry.json` — 33 items, `meta.layer` + `meta.pattern` schema confirmed
- `lib/signalframe-provider.tsx` — SSR-safe hole-in-donut pattern verified
- `components/animation/signal-motion.tsx` — GSAP integration precedent verified
- `package.json` — React 19.1, Next.js 15.3, GSAP 3.12, radix-ui@1.4.3 all confirmed
- `app/globals.css` — motion tokens, z-index scale, `--radius: 0px` confirmed
- `components/animation/signal-overlay.tsx` — fixed positioning and z-index values confirmed
- shadcn/ui docs (ui.shadcn.com) — Sonner as official Toast replacement; Calendar v9 upgrade confirmed
- react-day-picker official changelog (daypicker.dev) — v9 date-fns bundled, WCAG 2.1

### Secondary (MEDIUM confidence)
- Mantine Core inventory (mantine.dev) — component gap analysis cross-reference
- Ark UI GitHub README — component gap analysis cross-reference
- Radix Themes release notes — component list inferred from release notes
- WAI-ARIA patterns (w3.org) — NavigationMenu menubar and Calendar grid keyboard interaction models
- bundlephobia — Sonner bundle size estimate (~7-10KB gzipped)
- Next.js App Router docs (nextjs.org) — Server/Client barrel export behavior, `optimizePackageImports`

### Tertiary (LOW confidence — validate during implementation)
- Per-primitive Radix wrapper size estimates (2-5KB total for P1/P2) — estimated, not measured

---
*Research completed: 2026-04-06*
*Ready for roadmap: yes*
