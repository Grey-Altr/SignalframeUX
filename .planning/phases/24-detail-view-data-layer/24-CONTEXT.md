# Phase 24: Detail View Data Layer - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

All component data needed to render interactive detail views is authored and accessible via static TypeScript imports — no runtime fetch calls. Three modules: component-registry.ts (variant previews, code snippets, doc pointers), api-docs.ts extensions (coverage for all ~49 registry items), and code-highlight.ts (shiki/core RSC module for syntax highlighting).

</domain>

<decisions>
## Implementation Decisions

### Registry Data Shape (component-registry.ts)
- ComponentRegistryEntry maps each ComponentsExplorer grid item's index to: variant previews (live SF component renders with props arrays), a code snippet (template literal string), and a docId pointer to api-docs.ts
- Variant previews are live SF component renders, not static HTML — each variant is a props object that gets spread onto the real component
- Additional fields beyond variants/code/docId: layer ("frame" | "signal"), pattern ("A" | "B" | "C"), category — derived from registry.json meta to avoid data duplication
- One canonical usage snippet per component, authored inline as template literal strings in component-registry.ts

### api-docs.ts Coverage
- Extend existing 27 entries to cover all ~49 registry items (not just the 35 grid items)
- Keep all existing CORE/HOOK/TOKEN entries intact — non-destructive extension
- Every new entry must have at least one PropDef with name, type, default, required, and description fields (per DV-02)
- Follow existing ComponentDoc interface — no schema changes needed

### Shiki Theme & Bundle (code-highlight.ts)
- Use shiki/core with selective language loading (tsx only) — zero client JS added to bundle
- Server-only RSC module (import 'server-only' guard)
- Custom minimal theme derived from vitesse-dark, mapped to OKLCH CSS vars from the design system
- Returns highlighted HTML string — consumer renders the pre-highlighted markup server-side

### Claude's Discretion
- Exact PropDef values for each component (types, defaults, descriptions) — derived from source code and existing JSDoc
- Internal organization of component-registry.ts (grouping, ordering)
- Shiki theme token-to-OKLCH mappings (specific color choices within the design system palette)
- Whether to use a shared types file or co-locate types with each module

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Component Data Sources
- `public/r/registry.json` — Full 49-item registry with meta.layer and meta.pattern fields; source of truth for component list
- `components/blocks/components-explorer.tsx` — 35 grid entries with index/name/category/subcategory/version/variant; defines the grid items that component-registry.ts must map
- `lib/api-docs.ts` — Existing 27 ComponentDoc entries with PropDef/UsageExample/PreviewHud interfaces; extend this file

### Design System References
- `app/globals.css` — OKLCH color tokens (source of truth for shiki theme mapping)
- `components/sf/index.ts` — Barrel export of all SF components (import paths for registry entries)

### Requirements
- `REQUIREMENTS.md` §DV-01, §DV-02, §DV-03 — Success criteria for this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/api-docs.ts` — Already has ComponentDoc, PropDef, UsageExample, PreviewHud interfaces. 27 entries covering CORE, HOOK, TOKEN, and some FRAME/SIGNAL components. Extend, don't replace.
- `public/r/registry.json` — 49 registry items with meta.layer/meta.pattern. Use as source of truth for component list and metadata.
- `components/sf/index.ts` — Barrel export for all SF components. Import paths for live variant renders.

### Established Patterns
- api-docs.ts uses UPPERCASE for all description strings (DU/TDR aesthetic convention)
- ComponentEntry in components-explorer.tsx has index/name/category/subcategory/version/variant fields
- CSS-only preview components exist in components-explorer.tsx (PreviewButton, PreviewInput, etc.) — component-registry.ts will provide richer live previews alongside these

### Integration Points
- component-registry.ts will be consumed by ComponentDetail panel (Phase 25)
- api-docs.ts entries referenced by docId pointer from component-registry.ts
- code-highlight.ts called at render time in RSC context (Phase 25 detail panel code tab)
- ComponentsExplorer grid item onClick will look up component-registry.ts by index (Phase 25 SI-01)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — auto-selected recommended defaults for all decisions.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 24-detail-view-data-layer*
*Context gathered: 2026-04-06*
