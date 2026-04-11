# Phase 44: Copy Audit Fixes - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix all false or stale copy claims across the site. Reconcile component count to the real number, update version strings, replace inaccurate marketing copy, and update Playwright assertions to match. No new features — pure accuracy pass.

</domain>

<decisions>
## Implementation Decisions

### Component Count Reconciliation
- Count source: non-lazy SF component files in `components/sf/` (currently 48, site claims 28)
- Hardcoded count — update manually when components change (matches current pattern across all locations)
- All locations must show the same number: stats-band, hero, OG image metadata, init page, homepage meta description

### Version String
- OG image currently shows "v1.5 — REDESIGN" — update to current milestone "v1.7"
- Hero version string (if present) must match OG image

### Replacement Copy
- `FRAMEWORK-AGNOSTIC` on /init → replace with "BUILT FOR REACT + NEXT.JS" (accurate, matches actual stack)
- `SHIP FASTER` in marquee-band → Claude's Discretion: choose a specific, honest claim that fits the DU/TDR typographic voice
- `and growing` filler in hero + homepage meta → remove entirely, state the count without filler

### Test Updates
- `phase-35-metadata.spec.ts` assertions must validate exact copy strings (not patterns) — catches drift
- Update all assertions to match new copy after changes land

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Copy Locations
- `components/blocks/hero.tsx` — Hero component with component count claim (line 93)
- `components/blocks/stats-band.tsx` — Stats band with "28" SF COMPONENTS (line 2)
- `components/blocks/marquee-band.tsx` — Marquee with "SHIP FASTER" (line 2)
- `app/page.tsx` — Homepage meta description with "28 SF components and growing" (line 17)
- `app/init/page.tsx` — Init page with "FRAMEWORK-AGNOSTIC" claim (line 109)
- `app/opengraph-image.tsx` — OG image with stale "v1.5 — REDESIGN" version (line 64)

### Test Files
- `tests/phase-35-metadata.spec.ts` — Playwright metadata assertions that must match new copy

### Component Source of Truth
- `components/sf/` — 48 non-lazy SF component files (+ index.ts + 3 lazy variants)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- All copy is hardcoded inline — no central copy constants file
- Stats-band uses a simple array of `{ value, label, accent }` objects

### Established Patterns
- Copy strings are uppercase in DU/TDR typographic voice throughout
- Component count appears as raw number (no "+" or "~" prefix)
- OG image is generated via `opengraph-image.tsx` (ImageResponse)

### Integration Points
- `phase-35-metadata.spec.ts` validates page metadata — must be updated last after all copy changes
- Homepage meta description in `app/page.tsx` affects SEO/social sharing

</code_context>

<specifics>
## Specific Ideas

No specific requirements — straightforward accuracy pass. All replacements should maintain the established DU/TDR typographic voice (sharp, controlled, uppercase, no filler).

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 44-copy-audit-fixes*
*Context gathered: 2026-04-11*
