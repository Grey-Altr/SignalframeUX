# Phase 2: FRAME Primitives - Context

**Gathered:** 2026-04-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Create six SF layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText, and SFButton refinement) that enforce Phase 1 tokens by construction. Using these primitives correctly must be easier than deviating from them. No new token definitions — consume what Phase 1 locked.

</domain>

<decisions>
## Implementation Decisions

### Component API Design
- All new primitives accept `className` for escape hatches — matches existing SFButton pattern
- All primitives use `forwardRef` to forward ref to underlying DOM element for GSAP/animation compatibility
- SFText uses polymorphic `as` prop to render as `p`, `h1`-`h6`, `span`, `label` depending on context
- Server Components by default — no `'use client'` unless interactive props needed (SFButton already needs client)

### Token Enforcement & Defaults
- SFText enforces via TypeScript union type: `variant: "heading-1" | "heading-2" | "heading-3" | "body" | "small"` — rejects invalid values at compile time
- SFContainer defaults to `wide` (80rem) max-width; `width="content"` (42rem) for prose contexts
- SFSection defaults to `py-16` (64px) vertical spacing — blessed stop, override via `spacing` prop with blessed values only
- SFGrid defaults responsive: 1 col mobile, 2 col md, 3 col lg — override via `cols` prop

### Composition & SFButton Refinement
- Nesting order: `SFSection > SFContainer > content` — section handles vertical spacing + data attributes, container handles max-width + gutters
- SFStack defaults to `direction="vertical"`, with `"horizontal"` available
- SFButton refinement: wire interaction feedback tokens only (`--press-scale`, `--hover-y` to CSS transitions) — no API changes
- New primitives grouped at top of `sf/index.ts` with `// Layout Primitives` comment before existing component exports

### Claude's Discretion
- Exact prop interface details beyond the locked decisions above
- Internal implementation of responsive behavior
- CSS class composition strategy within primitives
- Test/storybook examples if time permits

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- SFButton pattern in `sf/sf-button.tsx` — CVA + cn() + className + barrel export (canonical reference)
- Phase 1 tokens now in `app/globals.css`: `--space-*`, `--max-w-*`, `--gutter*`, `text-heading-*` utilities
- `cn()` helper in `lib/utils.ts`
- 24 existing SF-wrapped components in `components/sf/`

### Established Patterns
- CVA for variants with `intent` naming and `defaultVariants`
- Omit pattern for props: `Omit<React.ComponentProps<typeof Base>, "conflicting-prop">`
- `VariantProps<typeof variants>` for type-safe variant props
- Barrel export from `sf/index.ts`

### Integration Points
- `components/sf/index.ts` — barrel file for all SF exports
- `app/globals.css` — token source (Phase 1 tokens consumed by primitives)
- `components/blocks/*.tsx` — primary consumers of new primitives
- Data attributes: `data-section`, `data-section-label`, `data-bg-shift`, `data-anim`

</code_context>

<specifics>
## Specific Ideas

No specific requirements — primitives follow CLAUDE.md spec and existing SF component patterns. Phase 1 token values are the source of truth.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>
