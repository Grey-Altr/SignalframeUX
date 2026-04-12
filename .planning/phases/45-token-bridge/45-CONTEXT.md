# Phase 45: Token Bridge - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

SF//UX-side only. Rename all tokens to --sfx-* namespace, wrap compiled CSS output in @layer signalframeux { }, create signalframeux.css as a tsup CSS entry point, ship cd-tokens.css with CD's real palette, and update MIGRATION.md as a full consumer integration guide. CD site repo changes are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Scope
- SF//UX repo only — no changes to ~/code/projects/Culture Division/
- CD site integration is a separate future phase/project
- Validate the @layer cascade architecture with the cd-tokens.css example, not a live CD integration

### Token Rename: --color-* → --sfx-*
- Full rename of ALL tokens to --sfx-* namespace (--sfx-background, --sfx-foreground, --sfx-primary, etc.)
- Breaking change for the SF//UX site — all component references, globals.css, and Tailwind utilities must be updated
- All in one phase (no split)
- Includes spacing (--sfx-spacing-*), typography (--sfx-font-*, --sfx-text-*), layout (--sfx-max-w-*), animation tokens

### @layer Cascade: Nested Containment
- Wrap the entire compiled CSS output in `@layer signalframeux { ... }`
- Consumer CSS outside the layer always wins by default — no specificity hacks needed
- @theme declarations stay OUTSIDE the layer (Tailwind v4 needs them at compile time)
- Only the compiled output gets layered during the build step
- Consumer override pattern: load signalframeux.css first, then cd-tokens.css (unlayered) — unlayered CSS wins over layered CSS

### Build Pipeline
- Add CSS entry point to tsup.config.ts
- Export as `signalframeux/signalframeux.css`
- Source: lib/tokens.css (post-rename to --sfx-*)
- Build step wraps output in @layer signalframeux { }

### cd-tokens.css: CD's Real Palette
- Ship with CD's actual palette (yellows, dark tones, DU×TDR aesthetic), not a generic example
- CD is NOT dark-only — uses tasteful color over different greys, blacks, whites, and yellow
- cd-tokens.css overrides --sfx-* tokens to CD's specific values
- Font tokens set to Geist Sans/Mono for now (custom typefaces pending cd-typeface-system pipeline)
- Font token structure must accommodate future typeface swap (NCL Graxebeosa, Segapunk, DEN HVNTER, Wipeout candidates)

### SSR Dark Mode
- Hardcode `class="dark"` + cd-tokens.css approach
- CD's palette IS the dark variant of SF//UX tokens
- Server-render class="dark" in layout.tsx so SF//UX components pick up the right values immediately
- No magenta primary visible during streaming — cd-tokens.css overrides it

### MIGRATION.md
- Full consumer integration guide (not just a rename table)
- Complete --color-* → --sfx-* rename table for all token tiers
- @layer import instructions
- cd-tokens.css override pattern with before/after examples
- Font token structure documented for future typeface swap

### Claude's Discretion
- Exact Tailwind v4 @theme → @layer interaction mechanics (research needed)
- Build step implementation details for wrapping output in @layer
- Token rename automation approach (manual vs script)
- cd-tokens.css color values (reference CD site's actual palette)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Integration Spec
- `~/vaults/second-brain/wiki/analyses/cd-sfux-integration-plan.md` — Full CD×SF//UX integration plan with token bridge architecture, divergence table, component migration map
- `~/vaults/second-brain/wiki/analyses/sfux-aesthetic-upgrade-plan.md` — 3-tier aesthetic vision, token bridge context

### Token System (current)
- `app/globals.css` — Current token source of truth with @theme block, all --color-* / --font-* declarations
- `lib/tokens.css` — Existing consumer-facing token file
- `MIGRATION.md` — Current migration guide (import paths), to be expanded with --sfx-* consumer guide

### Typeface Sources (for font token design)
- `~/vaults/second-brain/wiki/entities/cd-typeface-system.md` — Custom typeface pipeline, scoring gate, design DNA sources
- `~/vaults/second-brain/wiki/sources/ncl-graxebeosa-typeface.md` — Typeface candidate
- `~/vaults/second-brain/wiki/sources/segapunk-typeface.md` — Typeface candidate
- `~/vaults/second-brain/wiki/sources/den-typeface-hvnter.md` — Typeface candidate
- `~/vaults/second-brain/wiki/sources/wipeout-fonts-repo.md` — Typeface reference
- `~/vaults/second-brain/wiki/sources/typeface-innovation-prompt.md` — Typeface generation methodology

### Build System
- `tsup.config.ts` — Current build configuration
- `package.json` — Package exports configuration
- `dist/` — Current build output

### CD Site Reference
- `~/code/projects/Culture Division/` — CD site for palette reference (do NOT modify)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/tokens.css` — existing token file with consumer usage comment, starting point for rename
- `app/globals.css` — full @theme block with all token declarations
- `tsup.config.ts` — existing build pipeline to extend with CSS entry

### Established Patterns
- @theme { } block in globals.css for Tailwind v4 token declarations
- @custom-variant dark (&:is(.dark *)) — dark mode variant definition
- @layer base { } and @layer utilities { } already in use
- OKLCH color space throughout

### Integration Points
- Every `components/sf/*.tsx` file references --color-* tokens (via Tailwind classes)
- Every `components/blocks/*.tsx` may reference tokens directly
- `components.json` (shadcn config) may reference token paths
- `dist/` output needs rebuilding after rename

</code_context>

<specifics>
## Specific Ideas

- The token rename is mechanical but touches many files — consider a script or find-and-replace approach
- cd-tokens.css should reference CD's actual site palette, not the integration plan's achromatic spec (which was written before the "CD uses color" correction)
- Font tokens should be structured as --sfx-font-sans, --sfx-font-mono, --sfx-font-heading, --sfx-font-display to accommodate any future typeface from the pipeline
- The @layer containment means consumers don't need to know SF//UX's internal specificity — anything they write outside the layer wins

</specifics>

<deferred>
## Deferred Ideas

- CD site repo changes (importing signalframeux.css, applying cd-tokens.css) — separate phase/project
- Custom typeface integration (replacing Geist with pipeline output) — future phase after typeface pipeline delivers
- Light mode support for CD — not needed (CD's palette works as dark variant)

</deferred>

---

*Phase: 45-token-bridge*
*Context gathered: 2026-04-11*
