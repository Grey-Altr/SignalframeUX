---
phase: 33-inventory-acquisition-sections
plan: 02
subsystem: ui
tags: [inventory-section, createPortal, component-detail, monospaced-table, nomenclature]

requires:
  - phase: 33-inventory-acquisition-sections
    plan: 01
    provides: "CODED_REGISTRY, HOMEPAGE_INVENTORY_INDICES, sfCode field on ComponentRegistryEntry"
provides:
  - "InventorySection component — 12-row monospaced catalog table with fixed overlay ComponentDetail"
  - "Homepage INVENTORY section wired and rendering live data"
  - "IV-01 through IV-04 Playwright tests GREEN"
affects: [33-03-PLAN, 33-04-PLAN]

tech-stack:
  added: []
  patterns: ["Portal-level Escape handler for lazy-loaded overlay components"]

key-files:
  created:
    - components/blocks/inventory-section.tsx
  modified:
    - app/page.tsx

key-decisions:
  - "Portal-level Escape handler added alongside ComponentDetail's own — ensures close works even when lazy chunk hasn't loaded or GSAP animation is in-flight"
  - "highlightedCode passed as empty string — homepage is sync (cannot await shiki highlight()); ComponentDetail renders gracefully with empty code tab"

patterns-established:
  - "Fixed portal overlay pattern: createPortal to body + mounted guard + portal-level keydown + backdrop click"

requirements-completed: [IV-01, IV-02, IV-03, IV-04, IV-05]

duration: 4min
completed: 2026-04-09
---

# Phase 33 Plan 02: InventorySection UI Summary

**12-row monospaced catalog table with SF//[CAT]-NNN codes, layer tags, pattern tiers, and fixed overlay ComponentDetail via createPortal**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-09T04:24:20Z
- **Completed:** 2026-04-09T04:28:50Z
- **Tasks:** 2 completed
- **Files modified:** 2

## Accomplishments
- InventorySection renders 12 rows from CODED_REGISTRY with sfCode, name, [FRAME]/[//SIGNAL] tag, A/B/C tier
- Fixed overlay ComponentDetail via createPortal to document.body, lazy-loaded with next/dynamic
- Portal-level Escape handler ensures reliable close regardless of GSAP animation state
- 6 Playwright tests GREEN (IV-01 through IV-04 + 12-row count + source checks); IV-05 expected RED (Plan 33-03 scope)

## Task Commits

1. **Task 1: Build InventorySection component** - `cbc0cab` (feat)
2. **Task 2: Wire InventorySection into app/page.tsx** - `cad2f32` (feat)

## Files Created/Modified
- `components/blocks/inventory-section.tsx` - 12-row monospaced table, createPortal overlay, lazy ComponentDetail
- `app/page.tsx` - Import + mount InventorySection in INVENTORY SFSection slot

## Decisions Made
- Portal-level Escape handler added: ComponentDetail's GSAP close animation delays `onClose()` by 200ms via `onComplete` callback. In testing, the lazy-loaded chunk + animation timing caused Escape to not reliably close the panel. Adding a document-level keydown listener at the InventorySection level ensures immediate close.
- Empty `highlightedCode` prop: homepage page.tsx is a sync Server Component — cannot await `highlight()` from shiki. ComponentDetail handles empty string gracefully (code tab shows raw text).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Escape key close unreliable with lazy-loaded ComponentDetail**
- **Found during:** Task 1 verification (IV-04 test failure)
- **Issue:** ComponentDetail's Escape handler fires GSAP close animation (200ms) before calling `onClose()`. When lazy chunk loading adds latency, the Escape keydown has no handler registered yet.
- **Fix:** Added portal-level `useEffect` keydown listener on `openIndex` change — catches Escape at InventorySection level
- **Files modified:** components/blocks/inventory-section.tsx
- **Verification:** IV-04 Playwright test passes
- **Committed in:** `b50d293`

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential fix for test reliability. No scope creep.

## Issues Encountered
None beyond the deviation above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Ready for 33-03-PLAN.md: /inventory page upgrade (layer + pattern filters, live registry)
- InventorySection pattern (portal overlay, lazy ComponentDetail) can inform ACQUISITION section approach in 33-04
- IV-05 test will go GREEN when Plan 33-03 adds `data-component-index` to /inventory page items

---
*Phase: 33-inventory-acquisition-sections*
*Completed: 2026-04-09*
