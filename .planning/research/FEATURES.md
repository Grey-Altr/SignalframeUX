# Feature Research — v1.3 Component Expansion

**Domain:** Design system component library expansion — comprehensive UI component set
**Milestone:** v1.3 Component Expansion
**Researched:** 2026-04-06
**Confidence:** HIGH (shadcn/ui official docs via WebFetch, Mantine/Ark/Radix Themes verified via official sources, ecosystem patterns cross-referenced)

---

## Context: What This File Covers

SignalframeUX already ships 29 SF-wrapped components (24 interactive + 5 layout primitives) and a
complete SIGNAL generative layer. This research maps what the major component ecosystems ship that
SignalframeUX does not yet have, prioritizes additions by impact and complexity, and defines what
belongs in v1.3 vs what stays out of scope.

### Reference Ecosystems Surveyed

| Library | Component Count | Model |
|---------|----------------|-------|
| shadcn/ui | 70 components | Copy-owned, Radix-based |
| Mantine v9 | 110+ components | Full-styled, self-contained |
| Radix Themes 3.0 | ~40 components | Opinioned styling over Radix Primitives |
| Ark UI | 45+ components | Headless, Zag.js state machines |

### Already Shipped (do not re-implement)

SFButton, SFCard, SFDialog, SFInput, SFSelect, SFTable, SFBadge, SFToggle, SFTooltip,
SFDropdownMenu, SFSheet, SFSkeleton, SFSeparator, SFLabel, SFTextarea, SFSwitch, SFCheckbox,
SFRadioGroup, SFSlider, SFTabs, SFScrollArea, SFCommand, SFPopover, SFHoverCard,
SFContainer, SFSection, SFStack, SFGrid, SFText

---

## Feature Landscape

### Table Stakes (Users Expect These)

Every product engineer reaching for a component library expects these to exist. Their absence makes
the system feel incomplete for real UI work.

| Feature | Why Expected | Complexity | Dependencies on Existing |
|---------|--------------|------------|--------------------------|
| **Accordion** | Ubiquitous disclosure pattern — FAQs, settings panels, nav groups. Every major system ships it. | LOW | SFSeparator for dividers; CVA for open/closed variants |
| **Toast / Sonner** | Async feedback after mutations — submit success, error, copy confirmation. Non-negotiable for interactive apps. | MEDIUM | shadcn deprecated Toast in favor of Sonner; Sonner is a separate `sonner` package install |
| **Progress** | File upload, form steps, loading states. Single animated bar is table stakes. | LOW | CVA for determinate/indeterminate variants; SIGNAL layer eligible |
| **AlertDialog** | Destructive action confirmation — delete, reset, logout. Separate from Dialog because semantics differ (modal interrupt vs content container). | LOW | SFDialog base already exists; AlertDialog is a Radix Primitives separate package |
| **Avatar** | User representation in nav, comments, lists, teams. Expected with fallback to initials and image error handling. | LOW | No existing dependency; Radix Avatar primitive is the base |
| **Breadcrumb** | Navigation hierarchy in content-heavy apps, dashboards, deep navigation trees. | LOW | SFSeparator for dividers; no Radix primitive (shadcn builds it from scratch) |
| **EmptyState** | Every list, table, or search result needs a "nothing here" state. The PROJECT.md notes this was shipped as a first-class design moment in v1.0 — it should be a reusable SF component, not a one-off. | LOW | SFText, SFButton for CTA; no Radix base |
| **NavigationMenu** | Primary site nav with submenus, dropdowns, keyboard-navigable mega-menus. | HIGH | Radix NavigationMenu primitive is complex; heavy animation expectations |
| **Pagination** | Numbered page navigation for tables, lists, search results. | LOW | SFButton base; no Radix primitive (shadcn builds it from scratch) |
| **Stepper** | Multi-step flows — onboarding, checkout, wizards. Mantine ships it natively; shadcn/ui community has it. | MEDIUM | SFSeparator for step connectors; CVA for step states (active/complete/error) |
| **StatusDot** | Online/offline/pending indicators on avatars and list items. Tiny but universally expected. | LOW | Avatar enhancer; standalone usage in tables and lists |
| **ToggleGroup** | Exclusive or multi-select toggle set — view mode, alignment, filter chips. | LOW | SFToggle base already exists; Radix ToggleGroup primitive extends it |

### Differentiators (SignalframeUX-Specific Value)

Features that distinguish SignalframeUX from generic component libraries through SIGNAL integration
and DU/TDR aesthetic execution.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Progress with SIGNAL fill** | Progress bar fill driven by `--signal-intensity` uniform — ties completion state into the generative layer. Industrial aesthetic: sharp edges, no radius, monochrome fill with optional OKLCH accent. | LOW | Additive to basic Progress; SIGNAL integration is a CSS var on the fill element |
| **Toast with GSAP slide** | Toast enters with a 34ms hard-cut translate (DU/TDR timing) not a CSS transition. Exit is `--duration-fast` fade. Distinctive without being decorative. | LOW | Additive to Sonner; requires GSAP entrance hook on toast mount |
| **Accordion with stagger** | On open, child content items stagger in with `data-anim="stagger"` — already in the existing animation system. SignalframeUX-native behavior vs generic CSS transition. | LOW | Uses existing stagger infrastructure from v1.0 |
| **EmptyState as design moment** | EmptyState surfaces the SIGNAL layer — generative noise texture, scramble text on the headline, no decorative illustration. This is the DU/TDR empty state, not a friendly mascot. | MEDIUM | ScrambleText + optional SignalOverlay background; EmptyState must accept SIGNAL prop to activate |
| **StatusDot with pulse animation** | StatusDot "online" variant uses a GSAP pulse on the dot — not a CSS keyframe animation. Respects `prefers-reduced-motion` via existing reduced-motion gating. | LOW | GSAP small animation; no architectural dependency |
| **Stepper with FRAME progress bar** | Stepper progress bar uses SFProgress internally — the step connector is the Progress fill. Maintains token consistency across all progress representations. | LOW | Depends on SFProgress existing first |

### Anti-Features (Do Not Build)

Features commonly requested or found in other libraries that do not belong in SignalframeUX v1.3.

| Anti-Feature | Why Requested | Why Problematic | What to Do Instead |
|--------------|---------------|-----------------|-------------------|
| **Calendar / DatePicker** | Every design system ships a date picker | date-fns or day.js dependency required; heavy Radix Calendar primitive; interaction complexity is high and specific to consumer app needs. Out of scope for a generalist design system baseline. | Registry-only with heavy-deps annotation; consumers install when needed via `shadcn add calendar` |
| **Menubar** | Desktop app-style top menu bar | Rarely used in web apps; heavy Radix Menubar dependency; niche use case that adds implementation burden without broad payoff. Same category as Calendar. | Registry-only; annotated as heavy; lazy-loaded when added to consumer projects |
| **Carousel** | Visual richness, image galleries | Embla dependency adds 4kB+; use cases are narrow and always custom; generic carousel is never actually used as-shipped. | Ship nothing; consumers integrate Embla directly if needed |
| **Data Table with sorting/filtering** | Power user tables | This is application logic, not a component. A table with pagination is a pattern built from SFTable + SFPagination + application state. | Document the composition pattern; do not abstract into a monolithic component |
| **Chart components** | Data visualization | Recharts or Tremor dependency; chart types are domain-specific; impossible to generalize well. Heavy bundle. | Document `recharts` as recommended pairing; do not wrap it |
| **Rich Text Editor** | Content authoring | TipTap or Slate — entirely separate engineering effort; scope-busting | Out of scope entirely |
| **Color Picker** | Token editor tooling | Niche; high complexity; relevant only for future cdOS not for the current consumer surface | Defer to cdOS milestone |
| **File Upload with drag/drop** | Forms with attachments | Complex interaction model + server integration assumptions; not part of a pure component library | SFInput type="file" handles the basic case; complex upload is application code |
| **Rounded corner variants** | Generic softness appeal | Directly violates CLAUDE.md hard constraint: zero border-radius everywhere. This is a DU/TDR industrial system. | Never implement; reject if requested |
| **Dark/light mode toggle component** | UX convenience | Already shipped in v1.0 as a custom component. Re-implementing as an SFComponent adds no value and duplicates the existing toggle. | Use existing theme toggle; do not re-wrap |

---

## Feature Dependencies

```
SFAccordion
    └── uses: SFSeparator (already exists)
    └── uses: CVA (already exists)
    └── base: Radix Accordion primitive
    └── signal eligible: stagger on open (data-anim="stagger")

SFToast (Sonner wrapper)
    └── base: sonner npm package (new install required)
    └── signal eligible: GSAP entrance on mount
    └── no dependency on other SF components

SFProgress
    └── no Radix base (HTML progress + CSS)
    └── signal eligible: --signal-intensity CSS var on fill
    └── used-by: SFStepper (dependency — Progress must exist first)

SFAlertDialog
    └── base: Radix AlertDialog primitive (separate from Dialog primitive)
    └── uses: SFButton (already exists) for Confirm/Cancel actions
    └── companion to: SFDialog (same mental model, different Radix package)

SFAvatar
    └── base: Radix Avatar primitive
    └── used-by: SFStatusDot (StatusDot is an Avatar enhancer variant)
    └── no other dependencies

SFBreadcrumb
    └── uses: SFSeparator for chevron dividers
    └── no Radix base (shadcn builds from scratch — li/ol + aria)
    └── no other SF dependencies

SFEmptyState
    └── uses: SFText (already exists) for headline/body
    └── uses: SFButton (already exists) for optional CTA
    └── signal eligible: ScrambleText headline, optional SignalOverlay background
    └── no Radix base

SFNavigationMenu
    └── base: Radix NavigationMenu primitive (heaviest new dep in this set)
    └── uses: SFButton / anchor styling
    └── NOTE: Must not block P1 delivery — implement after simpler components ship

SFPagination
    └── uses: SFButton (already exists) for page number items
    └── no Radix base (shadcn builds from scratch)
    └── used-by: SFTable compositions (documentation pattern, not hard dep)

SFStepper
    └── uses: SFProgress (hard dependency — must exist first)
    └── uses: SFSeparator for connectors
    └── no Radix base (custom implementation)

SFStatusDot
    └── companion to: SFAvatar (Indicator variant over Avatar)
    └── standalone usage in tables and lists
    └── signal eligible: GSAP pulse on "online" state

SFToggleGroup
    └── base: Radix ToggleGroup primitive
    └── extends: SFToggle (already exists)
    └── no other dependencies
```

### Dependency Notes

- **SFStepper requires SFProgress:** The step connector uses Progress fill internally. Stepper cannot ship before Progress exists. This dictates P1 ordering.
- **SFStatusDot enhances SFAvatar:** StatusDot is an Indicator positioned over an Avatar. Avatar must exist first, but StatusDot can be a thin wrapper that accepts any child.
- **SFNavigationMenu is isolated:** The heaviest implementation in the set. No other component depends on it. Safe to defer to P2 without blocking anything.
- **SFToast (Sonner) is isolated:** Sonner package; no inter-component dependencies. Can ship in any order.
- **Calendar and Menubar conflict with bundle budget:** Both require heavy Radix primitives. Registry-only (no SF wrapper) prevents bundle contamination.

---

## MVP Definition

### v1.3 Phase 1 — Launch With (P1)

Minimum viable component expansion. These unblock real UI work immediately.

- [ ] **SFAccordion** — table stakes; FAQ, settings, nav groups. Stagger SIGNAL eligible.
- [ ] **SFToast** — async feedback is non-negotiable for interactive apps. GSAP slide entrance.
- [ ] **SFProgress** — required by SFStepper; standalone for uploads, loading states. SIGNAL fill eligible.
- [ ] **SFAlertDialog** — destructive confirmation pattern; required for any CRUD UI.
- [ ] **SFAvatar** — user representation; appears in nav, lists, comments.
- [ ] **SFBreadcrumb** — navigation hierarchy; expected in content/dashboard apps.
- [ ] **SFEmptyState** — every list/table needs this; DU/TDR design moment opportunity.

### v1.3 Phase 2 — Add After P1 Ships (P2)

- [ ] **SFNavigationMenu** — primary site nav with submenus. High complexity; implement after simpler components stable.
- [ ] **SFPagination** — numbered nav for tables; low complexity but depends on SFButton patterns being stable.
- [ ] **SFStepper** — multi-step flows; depends on SFProgress existing first.
- [ ] **SFStatusDot** — tiny but universally expected; low risk, add after Avatar ships.
- [ ] **SFToggleGroup** — view mode / filter chips; extends existing SFToggle.

### v1.3 Phase 3 — Registry Only, No SF Wrapper (P3)

These are heavy or niche. Add to `registry.json` with `meta.heavy: true` annotation. Consumers install via `shadcn add` when needed. No SF wrapper shipped.

- [ ] **Calendar** — date-fns dependency; lazy-loaded in registry.
- [ ] **Menubar** — Radix Menubar primitive; desktop-app pattern only.

### Defer Beyond v1.3

- Color Picker — cdOS milestone only
- File Upload with drag/drop — application-layer concern
- Chart components — consumer responsibility; document recharts pairing
- Rich Text Editor — out of scope entirely
- Data Table (full) — composition pattern documented, not abstracted

---

## Feature Prioritization Matrix

| Component | User Value | Implementation Cost | SIGNAL Eligible | Priority |
|-----------|------------|---------------------|-----------------|----------|
| SFAccordion | HIGH | LOW | YES (stagger) | P1 |
| SFToast | HIGH | MEDIUM | YES (GSAP slide) | P1 |
| SFProgress | HIGH | LOW | YES (fill intensity) | P1 |
| SFAlertDialog | HIGH | LOW | NO | P1 |
| SFAvatar | HIGH | LOW | NO | P1 |
| SFBreadcrumb | MEDIUM | LOW | NO | P1 |
| SFEmptyState | HIGH | LOW | YES (ScrambleText) | P1 |
| SFNavigationMenu | HIGH | HIGH | NO | P2 |
| SFPagination | MEDIUM | LOW | NO | P2 |
| SFStepper | MEDIUM | MEDIUM | NO | P2 |
| SFStatusDot | MEDIUM | LOW | YES (pulse) | P2 |
| SFToggleGroup | MEDIUM | LOW | NO | P2 |
| Calendar (registry) | LOW | N/A | NO | P3 |
| Menubar (registry) | LOW | N/A | NO | P3 |

**Priority key:**
- P1: Must have for v1.3 milestone completion
- P2: Should have; add when P1 stable
- P3: Registry entry only; no SF wrapper

---

## Ecosystem Gap Analysis

Cross-referencing what shadcn/ui, Mantine, Radix Themes, and Ark UI ship vs what SignalframeUX has.

| Component | shadcn/ui | Mantine | Radix Themes | Ark UI | SignalframeUX | Gap? |
|-----------|-----------|---------|--------------|--------|---------------|------|
| Accordion | YES | YES | YES | YES | NO | YES — P1 |
| Alert (inline) | YES | YES | YES | NO | NO | MEDIUM — informational banners |
| AlertDialog | YES | NO (uses Modal) | YES | YES | NO | YES — P1 |
| Avatar | YES | YES | YES | YES | NO | YES — P1 |
| Breadcrumb | YES | YES | NO | NO | NO | YES — P1 |
| Calendar | YES | YES | NO | YES | NO | P3 registry only |
| Carousel | YES | NO | NO | YES | NO | Anti-feature — skip |
| Collapsible | YES | YES | NO | YES | NO | Covered by Accordion |
| Command/Search | YES | NO | NO | NO | YES | Shipped |
| EmptyState | YES | NO | NO | NO | NO | YES — P1 |
| HoverCard | YES | NO | NO | NO | YES | Shipped |
| Input OTP | YES | YES (PinInput) | NO | YES (PinInput) | NO | Deferred — niche |
| Menubar | YES | NO | NO | NO | NO | P3 registry only |
| NavigationMenu | YES | YES | NO | NO | NO | YES — P2 |
| Pagination | YES | YES | NO | YES | NO | YES — P2 |
| Progress | YES | YES | YES | YES | NO | YES — P1 |
| Sonner/Toast | YES | YES | NO | YES | NO | YES — P1 |
| Spinner | YES | YES (Loader) | NO | NO | NO | LOW — SFSkeleton covers most cases |
| Stepper | NO (community) | YES | NO | YES (Steps) | NO | YES — P2 |
| StatusDot | NO | YES (Indicator) | NO | NO | NO | YES — P2 |
| ToggleGroup | YES | NO | NO | YES | NO | YES — P2 |
| Number Input | NO (shadcn) | YES | YES | YES | NO | Deferred — use SFInput |
| Tags Input | NO (shadcn) | YES | NO | YES | NO | Deferred — application layer |
| Rating | NO (shadcn) | YES | NO | YES | NO | Anti-feature — consumer app |

### Notable Gaps Not in v1.3 Scope

- **Alert (inline banner):** shadcn ships it; Mantine calls it `Alert`. Distinct from AlertDialog.
  A non-modal informational/warning/error banner. LOW complexity, could be added to P2 but is not in
  PROJECT.md targets. Flag for roadmap consideration.
- **Spinner:** Most use cases are covered by SFSkeleton (which is already shipped). A standalone
  Spinner (circular loader) is LOW complexity but redundant given Skeleton coverage.
- **Input OTP:** PinInput variant. Ark UI ships it; Mantine ships it. Niche — only relevant for
  auth flows. Defer until cdOS needs it.

---

## Edge-Case Patterns Considered Standard

Based on Carbon Design System, GitLab Pajamas, and USWDS research — these are not optional extras.

| Pattern | Standard? | How SignalframeUX Should Handle It | Component |
|---------|-----------|-------------------------------------|-----------|
| **Empty state with CTA** | YES — universal | SFEmptyState accepts `action` prop (SFButton); required for CRUD interfaces | SFEmptyState |
| **Empty state without CTA** | YES — search/filter results | SFEmptyState `action` prop is optional; "no results" variant | SFEmptyState |
| **Skeleton as loading state** | YES — shipped in v1.0 | SFSkeleton already covers this; do not add duplicate loading states | SFSkeleton (existing) |
| **Progress indeterminate** | YES — async with unknown duration | SFProgress must support `value={null}` for indeterminate animation | SFProgress |
| **Toast error with retry** | YES — network failures | SFToast accepts `action` slot for retry button; standard Sonner pattern | SFToast |
| **Avatar fallback to initials** | YES — image load failure | SFAvatar: image → initials → generic icon, in priority order | SFAvatar |
| **Avatar fallback to icon** | YES — when no initials available | Third fallback tier via Radix Avatar.Fallback | SFAvatar |
| **AlertDialog with loading state** | MEDIUM — async confirm | AlertDialog confirm button should accept `loading` state (disabled + spinner) | SFAlertDialog |
| **Stepper with error state** | YES — form validation | SFStepper: step states must include `error` (red dot, error label) | SFStepper |
| **Pagination with ellipsis** | YES — long page ranges | SFPagination: truncate with "..." when range > 7 pages | SFPagination |
| **Breadcrumb truncation** | YES — deep paths | SFBreadcrumb: truncate middle items with "..." when > 4 levels | SFBreadcrumb |
| **NavigationMenu keyboard nav** | YES — WCAG requirement | Full arrow-key navigation required; Radix handles this natively | SFNavigationMenu |
| **Toast deduplication** | MEDIUM — rapid actions | Sonner handles this natively with toast ID | SFToast |
| **StatusDot screen reader label** | YES — accessibility | StatusDot must render visually hidden status text for screen readers | SFStatusDot |

---

## Sources

- [shadcn/ui component docs — official](https://ui.shadcn.com/docs/components) — HIGH confidence, verified via WebFetch
- [Mantine Core component inventory — official](https://mantine.dev/core/package/) — HIGH confidence, verified via WebFetch
- [Ark UI component inventory — GitHub README](https://github.com/chakra-ui/ark) — HIGH confidence, verified via WebFetch
- [Radix Themes overview — official](https://www.radix-ui.com/themes/docs/overview/releases) — MEDIUM confidence (component list inferred from release notes)
- [Carbon Design System — loading, empty, error state patterns](https://carbondesignsystem.com/patterns/loading-pattern/) — HIGH confidence
- [GitLab Pajamas — Skeleton loader guidelines](https://design.gitlab.com/components/skeleton-loader/) — HIGH confidence
- [Design System Checklist — component categories](https://www.designsystemchecklist.com/category/components) — MEDIUM confidence
- [LogRocket — UI best practices for loading/error/empty states in React](https://blog.logrocket.com/ui-design-best-practices-loading-error-empty-state-react/) — MEDIUM confidence
- SignalframeUX PROJECT.md — v1.3 milestone targets verified against this research

---

*Feature research for: SignalframeUX v1.3 Component Expansion*
*Researched: 2026-04-06*
