# Phase 16: Infrastructure Baseline - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

All preconditions for v1.3 component authoring are satisfied: shadcn bases installed for P1/P2 components, build clean, wrapper checklist codified in SCAFFOLDING.md, prop vocabulary locked and documented, ComponentsExplorer regrouped into six named categories, and performance baseline captured.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key decisions pre-determined by success criteria and research:
- Seven shadcn bases to install (accordion, alert, alert-dialog, avatar, breadcrumb, collapsible, progress)
- Six ComponentsExplorer categories: Forms, Feedback, Navigation, Data Display, Layout, Generative
- Prop vocabulary: `intent` for semantic variants, `size` for scale, `asChild` for composition
- SCAFFOLDING.md created from scratch with six-point checklist
- Performance baseline via `ANALYZE=true pnpm build` + Lighthouse

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- 29 SF-wrapped components in `components/sf/` with barrel export from `sf/index.ts`
- 24 shadcn bases in `components/ui/`
- CVA used for variants in SFButton, SFBadge, SFToggle — all use `intent` as primary variant key
- `@next/bundle-analyzer` already installed and wired in `next.config.ts`

### Established Patterns
- SF wrapping: thin passthrough with `cn()` class overrides and `rounded-none` enforcement
- Barrel export: `sf/index.ts` is directive-free; `'use client'` in individual files only
- Layout primitives use structural CVA keys (`width`, `direction`, `gap`, `cols`) — not `intent`

### Integration Points
- ComponentsExplorer: COMPONENTS array and CATEGORIES array in the explorer component
- Registry: `public/r/` JSON files for shadcn CLI install
- SCAFFOLDING.md: new file at project root (referenced in CLAUDE.md but currently absent)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase with all specs defined in success criteria and research.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
