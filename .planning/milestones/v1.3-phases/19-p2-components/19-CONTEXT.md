# Phase 19: P2 Components - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Four P2 components complete the system's coverage: SFNavigationMenu (site navigation with flyout panels), SFPagination (page-level navigation), SFStepper (multi-step flows using SFProgress), SFToggleGroup (selection controls). All follow SCAFFOLDING.md 9-point checklist.

</domain>

<decisions>
## Implementation Decisions

### Component Design
- SFNavigationMenu: horizontal top-level items + vertical flyout panels on desktop; collapses to SFSheet slide-out on mobile (<768px)
- SFPagination: minimal numbered page links with previous/next, no dots or ellipsis — Server Component
- SFStepper: vertical layout with SFProgress connectors between steps, per-step error state via `status` prop
- SFToggleGroup: CVA `intent` prop with primary/ghost variants, supports exclusive (single) and multi-select modes

### Pattern Classification
- SFNavigationMenu: Pattern A (Radix-wrapped), `'use client'` for flyout state, meta.layer: "frame"
- SFPagination: Pattern A (Radix-free, shadcn breadcrumb-style), Server Component, meta.layer: "frame"
- SFStepper: Pattern C (pure-SF, consumes SFProgress), `'use client'`, meta.layer: "signal" (via SFProgress tween)
- SFToggleGroup: Pattern A (Radix-wrapped), `'use client'`, meta.layer: "frame"

### Claude's Discretion
- NavigationMenu flyout animation (CSS or GSAP)
- Stepper step numbering and icon patterns
- Pagination active page indicator styling
- ToggleGroup pressed state visual treatment

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- SFProgress (Phase 18) — consumed by SFStepper as connector between steps
- SFSheet — already exists for NavigationMenu mobile collapse
- navigation-menu base installed in Phase 16 (`components/ui/navigation-menu.tsx`)
- toggle-group base installed in Phase 16 (`components/ui/toggle-group.tsx`)
- Pagination — shadcn pagination is utility-based, no Radix dependency

### Established Patterns
- CVA with `intent` for visual variants
- Barrel export under category comments
- Registry entries with meta.layer and meta.pattern

### Integration Points
- sf/index.ts barrel export under Navigation and Multi-Step categories
- registry.json entries
- ComponentsExplorer entries under Navigation category

</code_context>

<specifics>
## Specific Ideas

- SFStepper must use SFProgress as the actual connector primitive — not a reimplementation
- SFNavigationMenu must not break Radix focus management with SF class overrides
- SFPagination must render as Server Component with zero client JS

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
