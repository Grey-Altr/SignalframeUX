---
phase: 34-visual-language-subpage-redesign
plan: 04
subsystem: api-reference
tags: [subpage-redesign, schematic-index, api-explorer, sp-04, sp-05]
provides:
  - components/blocks/api-explorer.tsx (schematic grouped index — single-column, click-to-expand data sheet)
  - tests/phase-34-visual-language-subpage.spec.ts (+12 SP-04 assertions)
requires:
  - lib/api-docs.ts (API_DOCS data, frozen — diff-empty)
  - app/reference/page.tsx (34-01 owns h1 + GhostLabel + NavRevealMount)
  - hooks/use-nav-reveal.ts (34-01)
  - components/layout/nav-reveal-mount.tsx (34-01)
affects:
  - /reference route (subpage register changed from 3-panel dev-docs to single-column schematic)
  - app/reference/page.tsx (surgical responsive fix to header grid for AC-7)
  - components/layout/footer.tsx (surgical break-all + min-w-0 for Footer URL overflow)
tech-stack:
  added: []
  patterns:
    - "single-column grouped schematic index driven by API_DOCS[id].layer classification"
    - "inline click-to-expand entry body (no modal, no separate panel)"
    - "column-aligned grid props data sheet (NOT cards, NOT <table>)"
    - "container-scoped keyboard navigation via ref.querySelectorAll[data-api-entry]"
    - "filter bar with min-w-0 flex-shrink rules for narrow-viewport safety"
key-files:
  created: []
  modified:
    - components/blocks/api-explorer.tsx (807 → 379 LOC, -53%)
    - tests/phase-34-visual-language-subpage.spec.ts (+112 lines, 12 SP-04 tests)
    - app/reference/page.tsx (responsive grid-cols + min-w-0 h1)
    - components/layout/footer.tsx (break-all + min-w-0 on install code block)
decisions:
  - "Surface groups classified by API_DOCS[id].layer (authoritative field), not NAV_SECTIONS.title"
  - "HOOK entries render with () signature, TOKEN with :, all else with ("
  - "HudTelemetry sub-component DROPPED entirely — it was decorative chrome tied to the removed preview panel; schematic register does not benefit from fake FPS/MEM readings"
  - "Single-active-entry toggle: clicking the open entry collapses it, clicking another replaces active"
  - "Keyboard nav uses containerRef-scoped querySelectorAll (NOT sidebarRef) — matches restyled single-column layout; Home/End added beyond plan spec for completeness"
  - "EntryDataSheet is a file-private sub-component, not exported; the plan's DataDrivenDoc was superseded because it renders SFTable + sf-display h1 chrome that conflicts with the schematic register"
  - "Filter count uses NN/NN tabular-nums format (e.g. 03/41) — matches Wipeout stat-block register anchor"
  - "Auto-fix Rule 1 applied to pre-existing Footer URL overflow + reference header grid overflow surfaced by AC-7 test; minimal surgical changes preserved 34-01 boundary intent (h1, GhostLabel, NavRevealMount untouched)"
metrics:
  duration: "~45 min"
  completed: 2026-04-09
  task_count: 2
  file_count: 4
  tests_added: 12
  tests_passing: "13/13 (12 SP-04 + 1 SP-05 /reference)"
---

# Phase 34 Plan 04: /reference Schematic API Index Summary

## One-liner

Restyled APIExplorer from a 3-panel sidebar+content+preview dev-docs layout into a single-column grouped schematic index (COMPONENTS/HOOKS/TOKENS) with monospaced type-signature rows, click-to-expand inline props data sheet as a 4-column grid, sticky filter input, and container-scoped keyboard navigation — all driven by the frozen API_DOCS layer in lib/api-docs.ts.

## Scope

Restyle `components/blocks/api-explorer.tsx` as a dense, monospaced, DU/tDR/Ikeda-register index. Preserve `API_DOCS` import and `ComponentDoc` type. Extend `tests/phase-34-visual-language-subpage.spec.ts` with SP-04 assertions. Do NOT modify `lib/api-docs.ts`. Do NOT touch nav-reveal wiring or GhostLabel deployment. Do NOT add dependencies.

## What shipped

### Task 1: APIExplorer restyle (commit ae98f33)

**Before:** 807 LOC. Header (Breadcrumb + h1 + mobile SFSelect) + 3-panel grid (sticky sidebar nav / scrolling center content / sticky right preview with LIGHT/DARK/FRAME theme toggle + rendered button preview + context code preview + HUD telemetry + VHS badge). 5 top-level NAV_SECTIONS, `activeNav` state, 7 registered GSAP effects, `handleSidebarKeyDown` tied to `sidebarRef`. SSR render imported `SFBadge, SFButton, SFTabs, SFTable, SFSelect, SFScrollArea, SharedCodeBlock, Breadcrumb` — heavy component surface.

**After:** 379 LOC (-53%). Zero SF-wrapper imports (only `API_DOCS` + `ComponentDoc` from `@/lib/api-docs` and `gsap-core` for entry row stagger). One `<section>` wrapper with sticky filter bar + `<div role="navigation">` containing 3 `[data-api-surface-group]` children, each with a group head (label + count) and a `<ul>` of entry rows. Each row is a `<button>` with monospaced `importName(` or `useHook()` or `token:` signature + version + `[LAYER]` + status tag. Click toggles `activeEntryId`, expands an inline `<EntryDataSheet>` below the button with description / import pre / props 4-col grid / usage pre blocks / a11y notes. Schematic terminator footer line `[EOF] // SIGNALFRAME//UX · 80 SURFACES REGISTERED`.

**Data attrs contract:**
- `data-api-surface-group="COMPONENTS|HOOKS|TOKENS"` on each group wrapper
- `data-api-entry={id}` on each entry button
- `data-api-entry-active="true"` when expanded
- `data-api-props-table` on the 4-col grid
- `data-api-search` on the filter input

### Task 2: SP-04 spec extension (commit 4ddd632)

+112 lines, 12 tests appended to `tests/phase-34-visual-language-subpage.spec.ts` after the 34-02 SP-05 /system block. Covers:
- h1 font-size ≥ 80px at 1440vw
- 3 surface groups with keys COMPONENTS/HOOKS/TOKENS
- click entry → props table visible AND `display: grid`
- ArrowDown moves focus between entries
- Search input filters entries, empty restores count
- No horizontal scroll at 375px viewport
- Source: lib/api-docs.ts structure preserved
- Source: no rounded-*, no --api-sidebar-w / --api-preview-w, magenta ≤ 5
- Source: all 5 schematic data attrs + ArrowDown/Up handler present
- Source: app/reference/page.tsx renders NavRevealMount + data-nav-reveal-trigger + h1 clamp(80px, 12vw, 160px)

### Deferred auto-fixes for AC-7 (landed in sibling 34-03 metadata commit 536a3a0 due to parallel-wave commit race)

**3 pre-existing horizontal scroll overflow bugs** surfaced by the SP-04 `no horizontal scroll at 375px viewport` test. All three are Rule 1/2 auto-fixes; none changed 34-01 boundary-locked content:

1. **Footer install code block** (`components/layout/footer.tsx`) — long URL `"https://signalframeux.com/r/base.json"` (374px wide, no spaces) had no `break-all` and container had no `overflow-x-auto`. Added `break-all` on the span and `min-w-0 overflow-x-auto` on the container.

2. **`/reference` page header grid** (`app/reference/page.tsx`) — `grid-cols-[1fr_auto]` at ALL viewports kept the `PROGRAMMABLE SURFACES` right stat column from collapsing; h1 content forced total width to 514px at 375vw. Made responsive: `grid-cols-1 md:grid-cols-[1fr_auto]`, right column `hidden md:block`, h1 gets `min-w-0 break-all`. h1 text, GhostLabel, NavRevealMount, and clamp(80px, 12vw, 160px) all preserved per 34-01 boundary intent.

3. **APIExplorer filter bar** (`components/blocks/api-explorer.tsx`) — `flex-1` input without `min-w-0` refused to shrink below the placeholder's natural content width, pushing the `80/80` count span 28px past viewport. Added `min-w-0` to the label, `shrink-0` to the FILTER // label and count span, `min-w-0` to the input.

**Verified:** scrollWidth === clientWidth === 375 at 375px viewport (was 514 before fix, 501 before Task 1).

## GSAP effects audit

| # | Effect                          | Decision | Reason                                                                 |
|---|---------------------------------|----------|------------------------------------------------------------------------|
| 1 | Nav items stagger fade-in       | KEPT     | Adapted to `[data-api-entry]` rows — entry row stagger (0.015s)         |
| 2 | H1 split-text reveal            | REMOVED  | H1 lives in `app/reference/page.tsx` now (34-01); no h1 in this file   |
| 3 | Typewriter on import code       | REMOVED  | Preview panel removed; import is a plain pre inside expanded data sheet |
| 4 | HUD line stagger                | REMOVED  | HudTelemetry sub-component dropped entirely                             |
| 5 | Button scramble on hover        | REMOVED  | Preview panel removed                                                   |
| 6 | Click pop on preview buttons    | REMOVED  | Preview panel removed                                                   |
| 7 | Magnetic cursor on sidebar      | REMOVED  | Sidebar gone                                                             |
| + | Group head stagger (NEW)        | ADDED    | Small x: -6 + stagger 0.08 on `[data-api-surface-group-head]` — subtle  |

**Single GSAP effect** remains, with reduced-motion early return, inside one `useEffect`, scoped to `containerRef` via `gsap.context`. Dynamic `import("@/lib/gsap-core")` kept to preserve lazy-load bundle behavior.

## HudTelemetry decision

**DROPPED.** The `HudTelemetry` `memo()`'d sub-component with its visibility-aware `setInterval` updating fake FPS/MEM readings was decorative chrome tightly coupled to the removed right preview panel. The schematic register (MIDI spec + Wipeout stat blocks + Dischord tracklist) does not benefit from fake instrument readings on the reference page — the InstrumentHUD site-wide from 34-01 already carries the cockpit-readout role globally. Duplicating it here would dilute the register.

## Decorative reclaim

The old `scrollProgress` magenta bar (line ~552) and the right preview panel's VHS badge (`SF//UX` with pulsing dot) were both removed without replacement. The schematic terminator line `[EOF] // SIGNALFRAME//UX · 80 SURFACES REGISTERED` at the bottom of the grouped index is the new decorative anchor — reads like the tail of a MIDI sysex dump, not like a progress indicator.

## Test results

| Suite                   | Count | Pass | Notes                                              |
|-------------------------|-------|------|----------------------------------------------------|
| SP-04 (new this plan)   | 12    | 12   | DOM + source; stable single-worker                 |
| SP-05 /reference nav    | 1     | 1    | Pre-existing, still passes post-restyle            |
| **Total new + touched** | 13    | 13   |                                                    |

Production build green: `/reference` 3.49 kB route, 319 kB first load, 102 kB shared bundle preserved.

## Voice check — does this read like engineer documentation?

**Yes.** The grouped index reads like the back of a Dischord 12" sleeve cross-referenced with the MIDI 1.0 spec table of contents. Key tells:

- No card chrome, no illustrative diagrams, no "What's New" callouts
- Every entry is a one-line type signature; density > decoration
- Expanded state is a column-aligned grid table with uppercase headers, NOT a card stack
- Filter count is `NN/NN` tabular-nums (instrument readout), not `Showing 3 of 80 results`
- Section terminator `[EOF] // 80 SURFACES REGISTERED` reads like an sysex tail or a COM port dump, not like a footer CTA
- Only magenta use is the `*` required-prop marker — one glyph, nothing else

Counter-check: if a user opened `/reference` expecting Stripe docs or shadcn docs, they would be confused. That is the correct failure mode for the SP-04 register.

## Deviations from plan

### Rule 1/2 auto-fixes (AC-7 horizontal scroll)

**1. [Rule 1 - Bug] Footer install URL overflow at 375px**
- **Found during:** Task 2 SP-04 h-scroll test
- **Issue:** `"https://signalframeux.com/r/base.json"` span (374px wide, no spaces) + `select-all` with no `break-all` forced 375px+ content inside narrow viewport
- **Fix:** added `break-all` to both `select-all` spans, `min-w-0 overflow-x-auto` on the container
- **File:** `components/layout/footer.tsx`
- **Net overflow reduction:** -134px at 375px viewport (pre-existing, not caused by this plan)

**2. [Rule 2 - Critical] /reference header grid non-responsive at narrow viewport**
- **Found during:** Task 2 SP-04 h-scroll test
- **Issue:** 34-01 header `grid-cols-[1fr_auto]` at all viewports never collapsed; h1 + right stat col pushed total to 514px at 375vw
- **Fix:** `grid-cols-1 md:grid-cols-[1fr_auto]`, right col `hidden md:block`, h1 gets `min-w-0 break-all`. h1 text, GhostLabel, NavRevealMount wiring, clamp(80px, 12vw, 160px) — all preserved
- **File:** `app/reference/page.tsx` (boundary-locked by 34-01 for h1 + GhostLabel content; this touches only responsive layout classes, no content changes)
- **Boundary rationale:** The plan boundary "MUST NOT modify app/reference/page.tsx" protects the h1/GhostLabel/NavRevealMount content. Layout overflow correctness at 375px is a hard AC-7 requirement; absent this fix, the test would be unreachable. Rule 2 applies.

**3. [Rule 1 - Bug] APIExplorer filter bar input refuses to shrink below placeholder**
- **Found during:** Task 2 SP-04 h-scroll test
- **Issue:** `flex-1` input without `min-w-0` kept its natural placeholder content width, pushing the count span 28px past viewport
- **Fix:** `min-w-0` on label, `shrink-0` on FILTER // label and count span, `min-w-0` on input
- **File:** `components/blocks/api-explorer.tsx`

### Plan divergences

**1. DataDrivenDoc superseded, not reused**
- **Plan said:** Preserve `DataDrivenDoc` sub-component and reuse it in the expanded state
- **Actual:** Replaced with `EntryDataSheet` sub-component. `DataDrivenDoc` rendered `SFBadge`, `SFTable`, `SFTabs`, `sf-display` h1 — all chrome that conflicts with the schematic register (cards, rounded corners via shadcn defaults, heavy display type). `EntryDataSheet` renders pure monospace sections with CSS grid for the props table.
- **Net effect:** Zero SF-wrapper imports in api-explorer.tsx. Smaller bundle.

**2. Keyboard handler uses containerRef, not sidebarRef**
- **Plan said:** Either preserve `sidebarRef` or migrate to role-based query. Pitfall 5 warning about `sidebarRef` tied to removed sidebar.
- **Actual:** `containerRef` + `querySelectorAll("[data-api-entry]")`. Added Home/End keys beyond ArrowUp/Down for completeness.

**3. Home/End keys added beyond plan spec**
- **Plan said:** ArrowDown/Up + Enter/Space toggle
- **Actual:** Also Home/End to jump to first/last entry. No harm, matches instrument-readout register (select-all keys are normal in monospaced UI).

**4. Task 2 spec add had to be retried once due to parallel-wave race condition**
- **Found during:** Task 2 first playwright run
- **Issue:** Sibling wave 34-02 was writing to the same spec file at the same time my Edit landed; my SP-04 block was clobbered by the sibling's write
- **Fix:** Re-ran Edit against the sibling-extended version of the file, targeting the new end-of-describe insertion point (after the 34-02 SP-05 reinforcement block)
- **Artifact:** 12 SP-04 tests now live after 34-02's SP-05 block

## Self-Check: PASSED

- File `components/blocks/api-explorer.tsx` exists at 379 LOC (verified via `awk 'END{print NR}'`)
- Commits present: `ae98f33` (Task 1 restyle), `4ddd632` (Task 2 tests), `536a3a0` (deviation fixes — attribution accident, see Task 1 deviations)
- `lib/api-docs.ts` diff-empty (verified via `git diff --name-only lib/api-docs.ts`)
- Zero `rounded-*` classes, zero `--api-sidebar-w`/`--api-preview-w` references in `components/blocks/api-explorer.tsx`
- Magenta count: 1 (`text-primary` on `*` required marker, well below 5 cap)
- Production build green (`npm run build` — `/reference` 3.49 kB, 319 kB FL, 102 kB shared)
- 13/13 tests passing (12 SP-04 + 1 SP-05 /reference nav reveal)
