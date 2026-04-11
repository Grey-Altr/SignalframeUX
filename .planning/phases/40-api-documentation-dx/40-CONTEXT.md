# Phase 40: API Documentation & DX - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Make SignalframeUX discoverable and usable for external developers through comprehensive documentation: JSDoc audit, README, Storybook setup with published deployment, /reference route aligned with actual library exports, and a consumer migration guide. This phase produces documentation artifacts only — no component or build pipeline changes.

</domain>

<decisions>
## Implementation Decisions

### Storybook
- **D-01:** Storybook serves dual purpose — local dev sandbox AND published consumer showcase
- **D-02:** Tiered story approach — all exported components get a basic story, 10-15 flagship components (layout primitives, interactive components, SIGNAL layer examples) get rich stories with interactive controls, variants, and composition examples
- **D-03:** Custom branded Storybook theme — dark, zero rounded corners, OKLCH colors from SFUX tokens, monospaced labels. Must reinforce the DU/TDR design system identity.
- **D-04:** Storybook deployed to Vercel subdomain (e.g. storybook.signalframeux.com) — separate Vercel project, auto-deploys on push

### README
- **D-05:** Technical specimen tone — terse, monospaced code blocks, minimal prose, data-dense. Matches the /init page's system initialization aesthetic. No warm/friendly developer guide style.
- **D-06:** Four required sections: Install + Quick Start (under 10 lines to first component), FRAME/SIGNAL model explainer, Token system overview (import, custom properties, OKLCH rationale), Entry point guide (core vs animation vs webgl, peer dependency requirements)
- **D-07:** README lives at repo root as `README.md`

### /reference Alignment
- **D-08:** Auto-generate `api-docs.ts` from source — build script parses entry files + JSDoc to produce the data layer automatically. Zero drift between exports and documentation.
- **D-09:** /reference page shows ALL library exports — everything in entry-core + entry-animation + entry-webgl. Complete API surface, nothing hidden.

### Migration Guide
- **D-10:** Concise cheat sheet format — single page under 200 lines. Old import -> new import mapping table, peer deps checklist, token CSS setup.
- **D-11:** Lives at `MIGRATION.md` in repo root — standalone file linked from README

### Claude's Discretion
- Storybook version and addon selection
- Which 10-15 components qualify as "flagship" for rich stories
- Auto-generation script implementation approach (AST parsing, regex, or TypeScript compiler API)
- Storybook directory structure and naming conventions
- JSDoc audit scope — verify existing coverage is complete and accurate vs the export surface

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Library Export Surface
- `lib/entry-core.ts` — Core entry point, 49 SF components + utils + hooks (defines what /reference must cover)
- `lib/entry-animation.ts` — GSAP-dependent exports (SFAccordion, SFProgress, SFStatusDot, etc.)
- `lib/entry-webgl.ts` — Three.js-dependent exports (SignalCanvas, useSignalScene, resolveColorToken)

### Existing Documentation
- `lib/api-docs.ts` — Current hand-curated API docs data layer (2203 lines, potentially stale vs exports)
- `SCAFFOLDING.md` — Internal SF component authoring guide (not consumer-facing)
- `CLAUDE.md` — Design system rules, aesthetic constraints, token system

### Component Source
- `components/sf/index.ts` — Barrel export defining the component API surface
- `lib/signalframe-provider.tsx` — Config provider, part of public API

### Phase 39 Context
- `.planning/phases/39-library-build-pipeline/39-CONTEXT.md` — Library build decisions (entry point structure, dependency isolation, export surface)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/api-docs.ts` — Existing ComponentDoc interface and 2203 lines of curated docs data. Auto-generation replaces the data but the interface/types may be reusable.
- `components/blocks/api-explorer.tsx` — Existing /reference renderer. Consumes API_DOCS record. Will consume auto-generated data instead.
- All 51 SF component files already have JSDoc with `@param`, `@returns`, `@example` tags — audit pass needed, not greenfield writing.

### Established Patterns
- DU/TDR aesthetic enforced everywhere — zero rounded corners, OKLCH colors, monospaced labels, data-dense layouts
- Token system in `app/globals.css` — custom properties that Storybook theme must consume
- CVA for variants, `cn()` for class merging — stories should demonstrate these patterns

### Integration Points
- Storybook needs Tailwind CSS v4 + SFUX token CSS configured in preview
- Auto-generation script needs to run as part of build or as standalone `pnpm` script
- Vercel deployment for Storybook — separate project config needed

</code_context>

<specifics>
## Specific Ideas

- Storybook theme should feel like part of SignalframeUX itself — not a generic tool chrome around the components
- README should read like a technical instrument spec sheet, not a marketing page
- /reference auto-generation ensures the docs site is never stale — single source of truth from JSDoc + entry files

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 40-api-documentation-dx*
*Context gathered: 2026-04-10*
