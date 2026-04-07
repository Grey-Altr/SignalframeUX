# Analyst Brief v4

**Generated:** 2026-04-06
**Milestone:** v1.3 "Comprehensive Component Expansion"
**Interview rounds:** 5 (synthesized from codebase audit + MECE framework — AskUserQuestion not available)
**Dimensions covered:** User Segments, User Journeys, Error States, Edge Cases, Non-Functional Requirements
**Prior briefs:** ANL-v1 (v1.0), ANL-v2 (v1.1), ANL-v3 (v1.2) — findings not repeated

---

## Preamble

This is the first milestone that is explicitly about breadth over depth. v1.0 built the foundation, v1.1 built the generative layer, v1.2 paid all technical debt. v1.3 asks: can a product engineer reach for SignalframeUX as their primary component library and have everything they need? That is a different question than "is the system architecturally sound" — it is a completeness and coherence question.

The current inventory has 29 SF-wrapped components (24 interactive + 5 layout primitives). Audit against standard product UI patterns reveals three categories of gap:

**Category A — Missing Radix primitives with shadcn equivalents already available:**
Accordion, Alert, AlertDialog, AspectRatio, Avatar, Calendar, Collapsible, ContextMenu, HoverCard, Menubar, NavigationMenu, Progress, ResizablePanelGroup, Toast/Sonner, ToggleGroup

**Category B — Patterns with no direct Radix base (require custom SF implementation):**
Breadcrumb, Pagination, Stepper, EmptyState, DataTable (beyond basic SFTable), ConfirmationDialog, FileUpload, RichTag/MultiSelect, CodeBlock, Timeline, Stat/Metric card, Status/StatusDot, SkipLink (a11y)

**Category C — Animation-eligible wrappers around existing SF components:**
SFAccordion with entrance stagger, SFProgress with GSAP-driven fill, SFToast with slide + scramble

The risk profile for this milestone is not architecture — the system is stable. The risks are:
1. Scope inflation: "every UI pattern" is unbounded without a forcing function
2. Aesthetic drift: adding 15+ components increases the surface area where DU/TDR discipline can erode
3. API inconsistency: components added in rapid succession without a single authoring pass tend to diverge on prop naming, variant vocabulary, and accessibility patterns
4. Bundle bloat: each new Radix primitive adds to the shared bundle; the <200KB initial budget is already stressed

The interview below probes each of these risks using the MECE framework.

---

## Round 1 — User Segments

**Dimension:** Who uses a "comprehensive" component library, and what does completeness mean to each persona?

**Findings:**

Three distinct consumer segments exist for this milestone, and they have conflicting definitions of "complete":

**Segment 1: The portfolio visitor (current primary)**
A hiring manager or creative director evaluating SignalframeUX by browsing the showcase site. For this persona, "comprehensive" means the showcase demonstrates depth: complex component compositions (tables with filters, form validation flows, navigation patterns) that signal production readiness. Empty state components and skeleton screens matter here — they demonstrate that the engineer thought about failure modes, not just happy paths. A single well-designed error/empty state component does more work than five utility components.

**Segment 2: The cdOS/CD-Operator engineer (future primary)**
An internal engineer building production tooling using SignalframeUX as the component library. For this persona, "comprehensive" means nothing is missing that would force a raw HTML fallback or pulling in a second component library. The forcing functions are: data display (tables, stats, progress), navigation patterns (breadcrumbs, pagination, stepper), and feedback patterns (toast, confirmation dialog, loading states). If these six patterns are missing, the engineer reaches for shadcn directly — which breaks the SF abstraction layer.

**Segment 3: The design system evaluator (external)**
A product engineer at another studio who encounters SignalframeUX on SOTD/Awwwards and considers adopting it. This persona evaluates: (a) does the component set cover the 80% case, (b) are the APIs consistent, (c) is the visual system coherent across all components. For this persona, inconsistency is more damaging than incompleteness — five components with mismatched prop APIs signal a system that was not designed, only accumulated.

**Gap surfaced:** The milestone goal says "every UI pattern a product engineer would reach for" but has not been filtered through which consumer segment is primary. Category B (custom implementations) requires significant authoring effort and only serves Segment 2. Category A (available Radix primitives) serves all three segments. Prioritizing by multi-segment value: Accordion, Toast, Progress, Avatar, AlertDialog, NavigationMenu.

---

## Round 2 — User Journeys

**Dimension:** What are the authoring and consumption flows for new components?

**Findings:**

**The authoring journey for each new SF component has four steps:**
1. shadcn add [component] → installs base to `components/ui/`
2. Create `components/sf/sf-{name}.tsx` following the SF-wrapping pattern
3. Export from `components/sf/index.ts` barrel
4. Add registry entry to `registry.json` and rebuild `public/r/`

This is the established Pattern A (shadcn base + SF thin wrapper). It is reliable for Category A components. The risk is that with 15+ new components added in one milestone, the authoring process becomes mechanical and the SF layer adds no value — it becomes a rename with `cn()`. The SF wrapper MUST add something: enforced token application, zero border-radius enforcement, a variant that maps to the DU/TDR aesthetic, or a SIGNAL layer integration point.

**The consumption journey has changed since v1.0:**
The registry now exists and works with the shadcn CLI (`pnpm shadcn add sf-button`). Adding 15 new components means 15 new registry entries, 15 new `/r/` files, and 15 new components in the ComponentsExplorer browser. If the ComponentsExplorer categorization is not updated to handle the expanded set, the browser becomes an unstructured list. The current implementation has no category grouping beyond the `layer` metadata — with 45+ components, grouping by usage category (Navigation, Forms, Feedback, Data Display, Layout) becomes necessary for usability.

**The documentation journey is unspecified:**
v1.0 established SCAFFOLDING.md as the authoring contract. v1.2 updated it with the Config Provider API. Adding 15 components without updating SCAFFOLDING.md means the DX contract falls behind the implementation. Each new component should add one entry to SCAFFOLDING.md's component table with: name, layer, pattern, variants, and usage guidance.

**Gap surfaced:** There is no defined "MVP SF wrapper" checklist — a minimum bar each new component must clear. Without it, quality of the new components is inconsistent by default. The checklist needs: zero border-radius (enforced), token-only colors (no arbitrary hex), blessed spacing stops (no arbitrary values), at least one CVA variant, WCAG AA compliant default state, exported from barrel + added to registry.

---

## Round 3 — Error States

**Dimension:** What can go wrong at scale when a component library doubles in size?

**Findings:**

**Registry drift is the primary operational risk.**
The v1.2 registry was built and validated. Adding 15+ components means 15+ manual registry mutations. If even one component file is added without a corresponding registry entry, the registry is silently incomplete. There is no build-step validation (this was noted as an open question in v1.2's brief, still unresolved). The risk compounds: if cdOS or CD-Operator tries to install a component that exists in the source but not the registry, the shadcn CLI gives a "component not found" error that looks like the component does not exist.

**Token enforcement degrades under authoring pressure.**
When authoring many components quickly, the natural tendency is to reach for arbitrary values. `gap-3` (12px) is a blessed stop; `gap-[14px]` is not. `text-sm` maps to a semantic alias; `text-[13px]` does not. With 15 new components, the probability that at least one uses an unblessed value approaches 1. The audit tooling from v1.2 (tsc --noEmit) catches type errors but not spacing violations. A Tailwind v4 config that restricts the spacing scale to blessed stops would catch this automatically, but does not currently exist.

**The border-radius constraint is easily violated by Radix primitives.**
Several shadcn/Radix components have hard-coded `rounded-*` classes in their base implementation: Avatar (rounded-full), Toast (rounded-*), Calendar (rounded-*), Progress (rounded-full). The SF wrapper layer must explicitly override these. Missing one override produces a component with a rounded element — a subtle aesthetic violation that may not be caught in visual QA if the component is not rendered in the showcase.

**Accessibility regressions compound with surface area.**
Each new interactive component adds new keyboard navigation paths. v1.0 established WCAG AA as the minimum bar. But "minimum bar" for a dialog is different from "minimum bar" for a combobox or a date picker. Complex Radix components (NavigationMenu, Menubar, Calendar) have elaborate focus management built into the Radix primitives — but the SF wrapper can accidentally break this by adding a wrapper div that intercepts focus events, applying `tabIndex` incorrectly, or using an `aria-label` that contradicts the Radix-generated one.

**Gap surfaced:** There is no accessibility smoke-test checklist for new SF components. The minimum bar needs to be explicit: (1) keyboard navigable to all interactive elements, (2) screen reader announces component role and state, (3) focus visible with `--ring` token, (4) no aria conflicts introduced by SF wrapper.

---

## Round 4 — Edge Cases

**Dimension:** What happens at the boundaries of a larger component surface?

**Findings:**

**The ComponentsExplorer becomes unusable past ~35 components without categorization.**
Current implementation lists all components in a filterable grid. At 45+ components, the grid without category grouping produces cognitive overload. The session state from v1.2 (filter persistence) helps, but does not solve the discoverability problem for a first-time visitor. Category groups — Forms, Feedback, Navigation, Data Display, Layout, Generative — reduce the initial cognitive load. This is a Product requirement surfaced by the expansion, not an engineering requirement.

**Multi-component compositions create API surface conflicts.**
Some new components compose existing SF components. A DataTable is an SFTable + SFSelect (pagination) + SFInput (search filter) + SFButton (actions). Each sub-component has its own API. If the DataTable wrapper exposes props for all sub-components, the API becomes unwieldy. If it does not expose them, the table is inflexible. The SF system has no established pattern for composite component APIs. This needs a decision before DataTable or similar composites are built.

**Toast/notification positioning conflicts with the SignalOverlay panel.**
SignalOverlay (Shift+S toggle) renders as a fixed panel from the right edge. Toast components typically render from bottom-right. If both are visible simultaneously, they overlap. The z-index hierarchy needs to be explicit: SignalOverlay sits above toasts, or toasts inset to avoid the panel when it is open. This requires SignalOverlay to expose a `isOpen` signal that the toast provider can consume — which is exactly the `useSignalframe()` hook use case.

**First-time vs returning user for components that have state:**
Toast and notification patterns have queuing logic. If a component triggers a toast during SSR (e.g., a form validation message from a Server Action), the toast must be deferred to client mount. The existing pattern (useEffect for client-only operations) handles this, but a toast triggered by a URL param (e.g., `?success=1` after a form POST) requires reading `searchParams` on mount, displaying the toast, then clearing the param — a flow that does not have an established SF pattern.

**The "zero border-radius everywhere" constraint breaks some Radix assumptions.**
Radix's Avatar component renders an image inside a circle (border-radius: 9999px) as its primary use case. A square avatar with zero border-radius is semantically valid but visually different from every other avatar on the web. The SF wrapper needs to make an explicit aesthetic decision: square cropped avatar (DU/TDR consistent), not rounded. This will look intentional if documented, wrong if undocumented.

**Calendar/DatePicker components are extremely heavy and rarely needed.**
The shadcn Calendar component pulls in `react-day-picker` (~30KB gzipped). If added to the registry, it is available to consumers. If added to the ComponentsExplorer showcase, it is rendered on the components page — which means the page weight increases. The component should be registry-only (not in the showcase) if added at all, or the showcase should lazy-load calendar rendering.

**Gap surfaced:** Components that import third-party libraries (react-day-picker for Calendar, date-fns for DatePicker, @tanstack/react-virtual for virtualized lists) need a "bundle cost" annotation in the registry entry and SCAFFOLDING.md. The <200KB initial budget must be defended on a per-component basis for heavy additions.

---

## Round 5 — Non-Functional Requirements

**Dimension:** What are the performance, accessibility, and consistency constraints on a doubled component surface?

**Findings:**

**Bundle size is the tightest constraint.**
The current Three.js async chunk is ~102KB. The initial shared bundle (from v1.2) needs to be measured before starting this milestone — that is the baseline. Each new SF component adds client-side JavaScript only if it is a Client Component. Many SF wrappers can remain Server Components (SFCard, SFTable, SFBadge, SFSeparator). Radix interactive components require `'use client'` in the SF wrapper. Adding 10 interactive Radix components (each ~5-15KB) could push the client bundle to its limit. The rule: any component that pushes the initial bundle above 190KB must be lazy-loaded by default in its SF wrapper.

**API consistency across 45 components requires an explicit vocabulary.**
The existing SF components have an implicit vocabulary: `intent` (not `variant`, not `color`) for semantic variants, `size` for scale. If new components use `variant` instead of `intent`, or `type` instead of `intent`, the API surface is inconsistent. This is invisible at the component level but visible when a product engineer uses multiple components together. A prop vocabulary reference — a single table in SCAFFOLDING.md listing the canonical names for common prop concepts — prevents drift before it happens.

**Reduced motion coverage must extend to every new animated component.**
v1.0 documented `prefers-reduced-motion` as a first-class 16-effect alternative. New components that include animation (Progress with GSAP fill, Toast with slide, Accordion with height animation) must each have a `prefers-reduced-motion` path. The risk is that "add reduced-motion support" becomes a checkbox that is forgotten in the authoring pressure of building 15 components.

**WCAG AA keyboard navigation for complex components requires deliberate testing.**
NavigationMenu, Menubar, Combobox, and Calendar are among the most complex keyboard navigation patterns in ARIA. The Radix implementations handle most of this, but the SF wrapper can introduce regressions. Each of these components needs explicit keyboard navigation documentation in SCAFFOLDING.md: what tab/arrow/escape patterns are supported, what is the focus ring behavior, what screenreader announcement is expected.

**The showcase site's own performance must not regress.**
If 15 new components are added to the ComponentsExplorer showcase and all are rendered client-side on `/components`, the page TTI will increase. The current SFSkeleton component exists precisely for this — but the showcase needs to use it consistently for components that have client-side rendering latency. A Suspense boundary pattern for the component grid (skeleton while loading) should be established as standard before the new components land.

**Gap surfaced:** There is no performance baseline document capturing current bundle size, LCP, and TTI before this milestone. Without a baseline, "did we regress?" is unanswerable. A pre-milestone Lighthouse audit with specific numbers should be captured and committed before the first new component is added.

---

## Unstated Requirements

- [REQ] A "minimum viable SF wrapper" checklist must be defined and committed to SCAFFOLDING.md before authoring begins. Every new component must pass it: zero border-radius, token-only colors, blessed spacing, at least one CVA variant, WCAG AA default, barrel export, registry entry. Without this, quality is inconsistent by default.
- [REQ] ComponentsExplorer must be categorized before new components land. At 45+ components, an uncategorized grid is unusable. Categories: Forms, Feedback, Navigation, Data Display, Layout, Generative. This is a pre-condition, not a post-condition.
- [REQ] A performance baseline (Lighthouse report: LCP, TTI, bundle size) must be captured before the first new component is authored. This is the regression baseline for the milestone.
- [REQ] The prop vocabulary must be locked and documented: `intent` for semantic variants (not `variant` or `color`), `size` for scale, `asChild` where Radix supports composition. New components that deviate need an explicit rationale.
- [REQ] Toast/notification positioning must be defined relative to the SignalOverlay panel. Either toasts inset when the panel is open, or the overlay has a higher z-index and toasts are positioned to avoid it. This requires `useSignalframe()` integration in the toast provider.
- [REQ] Any new component that imports a third-party library heavier than ~10KB gzipped requires a bundle cost annotation in registry.json and must be lazy-loaded by default in its SF wrapper. Calendar/DatePicker are the primary candidates.
- [REQ] Avatar must be explicitly square — the SF wrapper must set `border-radius: 0` and document "square cropped avatar is the intentional aesthetic, not a missing rounded corner." Without documentation, future maintainers will add border-radius thinking it was an oversight.
- [REQ] A Suspense + SFSkeleton pattern for the ComponentsExplorer component grid must be established before new components are added, to prevent TTI regression on the `/components` page.

---

## Assumption Risks

- [RISK] "Comprehensive means all Radix components" — Radix has ~30 primitives. Not all are relevant to the DU/TDR aesthetic or the Culture Division use case. Resizable panels, context menus, and menubar are Radix components that carry design assumptions (e.g., menubar assumes an app-level navigation bar) that may not fit the system's identity. Indiscriminate addition of all available Radix components produces a generic shadcn clone, not a distinctive design system.
- [RISK] "Pattern A works for all new components" — The shadcn base + SF thin wrapper pattern works when the base component has sensible defaults and the SF layer only constrains tokens and removes border-radius. Some components (NavigationMenu, DataTable) require significant structural customization. Forcing them into Pattern A produces an SF wrapper that is more complex than a custom implementation, which contradicts the system's "reduce friction" principle.
- [RISK] "The registry auto-updates when a component is added" — It does not. The registry is manually maintained. With 15 new components, the risk of a registry entry being missed or stale is high. The probability is not zero; it is approximately 15 × (probability of forgetting one step in a multi-step manual process). If a component ships without a registry entry, it is invisible to CLI consumers.
- [RISK] "Adding components does not affect existing components" — Barrel exports from `sf/index.ts` grow. If any new component introduces a circular dependency, a name collision, or an import that inadvertently forces a Server Component to become a Client Component, the entire barrel is affected. This is especially risky because the barrel is imported by the ComponentsExplorer, which is already a Client Component — but layout primitives exported from the same barrel are used as Server Components in `app/`. If the barrel import path is shared, it must remain dual-compatible.
- [RISK] "Token enforcement is already handled" — The v1.2 tech debt sweep fixed existing violations. New components authored under authoring pressure will introduce new violations. The tsc --noEmit check does not catch spacing or color violations. If no new enforcement tooling is added before authoring begins, the next audit will find violations in the new components.
- [RISK] "The DU/TDR aesthetic scales to more components" — The current aesthetic is coherent partly because the component count is small. With 45+ components, maintaining coherence requires active curation — not just "don't use rounded corners." The tone, density, spacing rhythm, and motion character must be consistent across components that were authored at different times. Without a visual QA pass on the full component set before the milestone ships, drift will be invisible until an outside observer notices it.
- [RISK] "Completeness is the right goal" — The CLAUDE.md rule is "if the system grows, you are doing it wrong." Adding 15 components is growth. The milestone must justify each addition against the principle: does this component reduce friction for a real use case (portfolio showcase, cdOS, CD-Operator), or does it reduce friction for a hypothetical future use case? Components added for hypothetical use cases violate the system's core design philosophy.

---

## Edge Cases

- [EDGE] Toast rendered by a Server Action response — if a form POST returns a success redirect with `?toast=saved`, the toast must fire on client mount after reading `searchParams`. There is no established SF pattern for this flow. Expected behavior: `useSearchParams` + `useEffect` + router.replace to clear the param after display. Must not fire on SSR.
- [EDGE] DataTable with zero rows — the empty state. A table with zero rows must render an EmptyState component, not an empty `<tbody>`. The EmptyState must be part of the DataTable API (via a `emptyState` prop), not caller-managed. Expected behavior: `emptyState` prop defaults to a generic SF-styled empty state; caller can override.
- [EDGE] Accordion with all items closed as default — many accordions default to the first item open. If the design spec requires all closed on first render, the Radix `defaultValue` must be undefined and the SF wrapper must not supply a default. This is a prop API decision that affects visual first impression.
- [EDGE] Progress at 100% — the filled state. A progress bar at 100% that still shows the incomplete color is a common bug. The SF wrapper must test the 100% render path explicitly. Expected behavior: full fill, no visual artifact at the edge.
- [EDGE] NavigationMenu on mobile — NavigationMenu is a desktop pattern (hover-triggered submenus). On mobile, hover does not exist; the pattern either becomes a click-triggered dropdown or collapses into a hamburger menu. The SF wrapper must define the mobile behavior explicitly or document that NavigationMenu is desktop-only and must be replaced by SFSheet on mobile.
- [EDGE] Avatar with no image source — the fallback state. If `src` fails to load or is not provided, the avatar must render a fallback (initials or icon), not a broken image. Radix Avatar handles this, but the SF wrapper must expose the `fallback` slot clearly.
- [EDGE] Combobox/Command with 500+ items — the performance boundary. SFCommand uses cmdk which virtualizes well, but if items are not memoized, each keystroke re-filters the full list. Expected behavior: items prop accepts a memoized array or a server-side search callback for large lists. The SF wrapper should not force full client-side filtering.
- [EDGE] Multiple toasts fired simultaneously — the queuing case. If a user triggers three actions in rapid succession and each fires a toast, the toast provider must queue them with visual stacking or sequential display. Expected behavior: stack up to 3 toasts, dismiss oldest when a 4th arrives. This is a behavior decision, not a default.
- [EDGE] ToggleGroup with zero items selected when `type="single"` — Radix allows this (no item selected). The UI must communicate the "unselected" state distinctly from the "selected" state. Expected behavior: the SF wrapper does not force a default selection; the empty selection is a valid state and must have a visible style.
- [EDGE] Stepper (custom, no Radix base) with a step that errors — if step 2 validation fails after the user has moved to step 3, the stepper must allow navigation back to step 2 and display the error state there. This requires the Stepper to hold error state per step, not just active step index. The API must expose an `errors` prop or a `setStepError` function.

---

## User Segment Analysis

- [USER] Portfolio visitor (hiring manager / creative director) — needs the showcase to demonstrate production-readiness through complex compositions. Prioritizes: EmptyState, DataTable, ConfirmationDialog, Pagination, Progress (with animation). Does NOT need: Calendar, Resizable, ContextMenu.
- [USER] cdOS/CD-Operator engineer (internal, future) — needs nothing missing that forces a fallback. Prioritizes: Toast/Notification, Breadcrumb, NavigationMenu, Stepper, FileUpload, MultiSelect. The absence of any one of these forces a second component library, which breaks the SF abstraction.
- [USER] Design system evaluator (external) — evaluates coherence over completeness. For this persona, 30 perfectly consistent components beat 45 inconsistent ones. The visual QA and API consistency work is more important than adding the last 5 components.
- [USER] Accessibility auditor — not a persona the team thinks about but a persona that matters for WCAG AA compliance claims. Complex new components (NavigationMenu, Menubar, Calendar, Combobox) are the highest-risk additions. Each needs explicit ARIA pattern documentation.

---

## Priority Assessment

| Priority | Item | Rationale |
|----------|------|-----------|
| P0 | Define and commit "minimum viable SF wrapper" checklist to SCAFFOLDING.md | Without this, every new component is authored to an undefined standard. Quality inconsistency at 45+ components is irreversible without a full audit. |
| P0 | Capture pre-milestone Lighthouse baseline (LCP, TTI, initial bundle size) | Without a baseline, bundle regression is undetectable. The <200KB constraint is only meaningful if it is measured before and after. |
| P0 | Categorize ComponentsExplorer (Forms / Feedback / Navigation / Data Display / Layout / Generative) | The showcase becomes unusable at 45+ components without categories. This is a precondition for the expansion, not a follow-up task. |
| P0 | Lock prop vocabulary: `intent` for semantic variants, `size` for scale, document in SCAFFOLDING.md | API drift at 45+ components is permanent. Locking vocabulary before authoring begins prevents it entirely. |
| P1 | Accordion — Category A, high reachability, serves all 3 consumer segments | Among the highest-frequency UI patterns; absence is immediately visible in any content-heavy UI |
| P1 | Toast/Sonner — Category A, required for feedback loops in any product UI | cdOS engineers need this before anything else; defines the "system handles user feedback" capability |
| P1 | Progress — Category A, animation-eligible (GSAP fill), serves portfolio showcase narrative | With SIGNAL layer treatment (GSAP-driven fill at custom easing), this demonstrates the dual-layer model explicitly |
| P1 | AlertDialog — Category A, confirms destructive actions, required for production UIs | The distinction from SFDialog (modal) is: AlertDialog for irreversible actions, Dialog for configuration. cdOS needs both. |
| P1 | Avatar — Category A, universal pattern; square + zero border-radius makes it distinctively SF | Every profile, author, and team member pattern reaches for avatar first |
| P1 | Breadcrumb — Category B (custom), required for any multi-level navigation (cdOS will have this) | No Radix base, but the pattern is so common and so structurally simple that custom implementation is low-effort |
| P1 | EmptyState — Category B (custom), high showcase value, demonstrates design thinking | A well-designed empty state is one of the most revealing signals of system maturity |
| P2 | NavigationMenu — Category A, complex keyboard nav, mobile behavior undefined | High value for cdOS; high implementation risk due to mobile behavior gap |
| P2 | Pagination — Category B (custom), needed with DataTable | Straightforward pattern, low complexity, high frequency |
| P2 | Stepper — Category B (custom), needed for multi-step flows in cdOS | Medium complexity due to error state per step; worth building once correctly |
| P2 | StatusDot/StatusBadge — Category B (custom), low effort, high semantic value | Animated pulse for "live" status; static variants for other states. Serves cdOS monitoring panels. |
| P2 | ToggleGroup — Category A, extends SFToggle to multi-select | Low complexity, high frequency in filter UIs |
| P3 | Calendar/DatePicker — Category A, heavy third-party dep (~30KB), narrow use case | Add to registry only; do not render in showcase. Lazy-load by default. |
| P3 | Menubar — Category A, desktop-only pattern, unclear Culture Division use case | Worth having in the registry; not worth showcase placement until a real use case exists |
| P3 | Resizable | No identified use case in portfolio, cdOS, or CD-Operator. Defer unless a consumer requests it. |
| P3 | ContextMenu | Right-click interaction model conflicts with the DU/TDR desktop metaphor. Defer. |

---

*Generated by PDE-OS pde-analyst | 2026-04-06*
*Interview rounds: 5 (synthesized analysis — AskUserQuestion not available; findings drawn from full codebase audit, prior briefs ANL-v1 through ANL-v3, MILESTONES.md, ROADMAP.md, STATE.md, component inventory, and MECE framework) | Source artifacts reviewed: components/sf/ (29 files), components/animation/ (21 files), components/blocks/ (14 files), components/ui/ (25 files), .planning/STATE.md, .planning/MILESTONES.md, .planning/ROADMAP.md, .planning/REQUIREMENTS.md, .planning/DX-SPEC.md, ANL-v2, ANL-v3*
