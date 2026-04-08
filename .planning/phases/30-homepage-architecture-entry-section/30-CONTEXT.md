# Phase 30: Homepage Architecture + ENTRY Section - Context

**Gathered:** 2026-04-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Restructure `app/page.tsx` from the current 7-section marketing layout into the 6-section cinematic architecture (ENTRY → THESIS → PROOF → INVENTORY → SIGNAL → ACQUISITION). Build the full-viewport GLSL hero as ENTRY with title overlay and mouse-driven shader interaction. Hide navigation until scroll. Remove CircuitDivider and MarqueeBand from the homepage. Stub remaining sections as real SFSection landmarks with minimum heights.

This phase delivers the page skeleton and one fully realized section (ENTRY). Phases 31–33 fill in the remaining sections.

</domain>

<decisions>
## Implementation Decisions

### ENTRY Composition
- **D-01:** The current split-panel `Hero` component is replaced entirely. `GLSLHero` becomes the primary ENTRY content filling 100vh with zero padding or containment.
- **D-02:** `SIGNALFRAME//UX` title rendered as an HTML overlay on top of the shader canvas at 120px+ (Anton font), centered. Not embedded in the shader — HTML for LCP and accessibility.
- **D-03:** Single subtitle line below the title. No paragraph, no description, no scroll indicator (EN-03).
- **D-04:** CTAs ("GET STARTED", "VIEW ON GITHUB") relocate to ACQUISITION section — AQ-03 covers navigation links, AQ-05 explicitly rejects button energy.
- **D-05:** Component count and version tag relocate to ACQUISITION section — AQ-02 covers system stats as monospaced data points.
- **D-06:** Multilingual text (JFM katakana/farsi/mandarin) is deferred — does not map to any v1.5 requirement. Can return in Phase 34 visual language pass or v2.
- **D-07:** Manifesto copy ("a system you can feel") absorbed into THESIS section (Phase 31) — that's where manifesto content lives in the new architecture.
- **D-08:** LCP safety: title must NOT use `opacity: 0` as start state. Use `opacity: 0.01` or `clip-path` reveal per STATE.md constraint.

### Section Transitions
- **D-09:** Hard cuts between all sections. No animated transitions, no decorative dividers. Zero-gap section stacking via CSS.
- **D-10:** Background color shifts via existing `data-bg-shift` pattern handle visual separation between sections.
- **D-11:** `CircuitDivider` and `MarqueeBand` imports removed from `page.tsx`. Components remain in codebase for potential subpage use until Phase 34 audit.

### Nav Reveal
- **D-12:** Nav invisible on initial viewport. Appears via GSAP ScrollTrigger at the ENTRY/THESIS boundary (when ENTRY leaves viewport).
- **D-13:** Hard-cut appear — no slide, no fade. `visibility: hidden; opacity: 0` → `visibility: visible; opacity: 1` at threshold. DU channel-switch aesthetic.
- **D-14:** Replace existing `sf-nav-roll-up` behavior with the new ScrollTrigger-based reveal. Nav remains `fixed top-0` with `z-[var(--z-nav)]`.
- **D-15:** Nav starts `visibility: hidden` not `display: none` — preserves accessibility tree for skip-nav links and keyboard navigation.

### Stub Section Architecture
- **D-16:** THESIS through ACQUISITION rendered as real `SFSection` components with correct `data-section`, `data-bg-shift`, `id`, and `label` attributes.
- **D-17:** Minimum height per stub: `100vh`. Exception: THESIS stub at `200vh` (will be a PinnedSection in Phase 31).
- **D-18:** Stub content: single `<h2>` with section name in monospaced type (JetBrains Mono), muted color, centered. Zero placeholder prose.
- **D-19:** Stubs preserve section indicator, bg-shift system, and scroll measurement so Phase 31–33 implementors drop in real content without touching page architecture.

### Claude's Discretion
- Plan count and plan boundaries (how to split the work across plans)
- Exact ScrollTrigger config for nav reveal (start/end positions, toggleActions)
- Whether to keep `HeroMesh` (Three.js mesh on the left panel) or remove it along with the old Hero — `GLSLHero` replaces its visual function
- Import cleanup strategy (remove unused block component imports vs leave for other pages)
- Test structure for the new page architecture

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Page Architecture
- `app/page.tsx` — Current homepage (REPLACE — 7-section layout → 6-section architecture)
- `components/blocks/hero.tsx` — Current Hero component (REPLACE entirely)
- `components/animation/glsl-hero.tsx` — Existing GLSL shader (EXTEND — add mouse interaction uniforms)
- `components/animation/glsl-hero-lazy.tsx` — SSR-safe lazy wrapper (KEEP)

### Navigation
- `components/layout/nav.tsx` — Current nav (MODIFY — add scroll-triggered visibility)
- `app/globals.css` — Contains `sf-nav-roll-up` class (MODIFY — replace with new reveal behavior)

### Components Being Removed from Homepage
- `components/animation/circuit-divider.tsx` — CircuitDivider (REMOVE from page.tsx imports)
- `components/blocks/marquee-band.tsx` — MarqueeBand (REMOVE from page.tsx imports)

### Infrastructure (Phase 29 — confirmed working)
- `components/animation/pinned-section.tsx` — PinnedSection primitive (used for THESIS stub height)
- `components/layout/lenis-provider.tsx` — Lenis config with `autoResize: false`
- `lib/gsap-plugins.ts` — Central GSAP plugin registration
- `lib/gsap-core.ts` — GSAP + ScrollTrigger re-exports

### Layout Primitives
- `components/sf/index.ts` — Barrel export including SFSection
- `components/layout/section-indicator.tsx` — Section indicator (must work with new data-section attributes)

### Requirements
- `.planning/REQUIREMENTS.md` §Route Architecture — RA-05 (6-section architecture)
- `.planning/REQUIREMENTS.md` §ENTRY Section — EN-01 through EN-05
- `.planning/REQUIREMENTS.md` §Visual Language — VL-03 (CircuitDivider removal), VL-07 (MarqueeBand removal)

### Research
- `.planning/research/PITFALLS.md` — LCP suppression hazard, ScrollTrigger pin-spacer gotchas
- `.planning/research/ARCHITECTURE.md` — Section architecture recommendation

### Prior Phase Context
- `.planning/phases/29-infrastructure-hardening/29-CONTEXT.md` — Infrastructure decisions (fonts-ready, overscroll, PinnedSection API, reduced-motion gate)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `GLSLHero`: Full-screen FBM noise + grid lines + Bayer dither via SignalCanvas singleton. Already has `uScroll` uniform — needs `uMouse` uniform added for EN-05.
- `SFSection`: Layout primitive with `data-section`, `data-bg-shift`, `label` props — foundation for all 6 section landmarks.
- `SectionIndicator`: Reads `data-section-label` attributes — will automatically pick up new section names.
- `data-bg-shift` pattern: Existing bg-shift system transitions background colors between sections — reusable for hard-cut transitions.
- `PinnedSection`: Pin/scrub wrapper from Phase 29 — ready for THESIS stub's 200vh scroll distance.

### Established Patterns
- `next/dynamic` with `ssr: false` for WebGL components (GLSLHeroLazy, SignalCanvasLazy, SignalMeshLazy)
- Server Component default for `page.tsx` with `'use client'` only on interactive children
- `highlight()` from `lib/code-highlight` for pre-computed server-side syntax highlighting
- GSAP ScrollTrigger for scroll-driven behavior (consistent with nav reveal approach)

### Integration Points
- `app/page.tsx` — complete rewrite (Server Component, imports 6 section components + nav + footer)
- `components/layout/nav.tsx` — add ScrollTrigger for visibility toggle
- `app/globals.css` — update/replace `sf-nav-roll-up` with new nav-hidden/nav-visible states
- `components/animation/glsl-hero.tsx` — add `uMouse` uniform for pointer interaction (EN-05)

</code_context>

<specifics>
## Specific Ideas

- GLSLHero mouse interaction should be subtle — modulate FBM offset or grid density based on normalized mouse position, not a dramatic warp effect
- Title overlay must be HTML (not canvas-rendered) for LCP measurement and screen reader access
- The 6-section ordering is ENTRY → THESIS → PROOF → INVENTORY → SIGNAL → ACQUISITION — this is the exact sequence from RA-05, non-negotiable
- Hard-cut section transitions are the DU channel-switch aesthetic — the absence of animation IS the design statement
- Nav hard-cut appear mirrors the VHS channel-switch register from the DU lineage

</specifics>

<deferred>
## Deferred Ideas

- **JFM multilingual text** — Katakana, Farsi, Mandarin flourishes from current Hero. Could return as SIGNAL-layer detail in Phase 34 visual language pass or v2 localization work.
- **"a system you can feel" manifesto line** — Absorbed into Phase 31 THESIS section content.
- **HeroMesh (Three.js mesh)** — May be redundant once GLSLHero fills the full viewport. Claude's discretion on removal.

</deferred>

---

*Phase: 30-homepage-architecture-entry-section*
*Context gathered: 2026-04-07*
