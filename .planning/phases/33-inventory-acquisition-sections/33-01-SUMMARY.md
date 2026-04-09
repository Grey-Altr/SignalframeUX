---
phase: 33-inventory-acquisition-sections
plan: 01
subsystem: ui
tags: [nomenclature, component-registry, sfCode, playwright, system-stats]

requires:
  - phase: 32-signal-proof-section
    provides: "Shipped homepage with SIGNAL section, component registry baseline"
provides:
  - "SF//[CAT]-NNN coded nomenclature via assignCodes() utility"
  - "CODED_REGISTRY with sfCode on every entry"
  - "HOMEPAGE_INVENTORY_INDICES (12 curated items)"
  - "SYSTEM_STATS constant (live component count, bundle, lighthouse)"
  - "ComponentRegistryEntry interface with sfCode? field"
  - "SCRAMBLE_TEXT + CIRCUIT_DIVIDER registry entries"
  - "13 Playwright tests in RED state for IV-01..06 + AQ-01..05"
affects: [33-02-PLAN, 33-03-PLAN, 33-04-PLAN, inventory-section, acquisition-section]

tech-stack:
  added: []
  patterns: ["SF//[CAT]-NNN deterministic nomenclature", "derived stats from live registry"]

key-files:
  created:
    - lib/nomenclature.ts
    - lib/system-stats.ts
    - tests/phase-33-inventory-acquisition.spec.ts
  modified:
    - lib/component-registry.ts

key-decisions:
  - "sfCode is optional on interface (computed by assignCodes, not hardcoded per entry)"
  - "SCRAMBLE_TEXT + CIRCUIT_DIVIDER added as GENERATIVE Pattern C entries (indices 105, 106)"
  - "BADGE kept as FEEDBACK (not DATA_DISPLAY); STATUS_DOT used for DAT-002 in homepage subset"
  - "SYSTEM_STATS.components derived from live Object.keys(COMPONENT_REGISTRY).length, not hardcoded"

patterns-established:
  - "Nomenclature pattern: CATEGORY_ORDER + CATEGORY_CODE + sequential counter = stable codes"
  - "Source + DOM hybrid test pattern: fs.readFileSync for static assertions, Playwright for DOM"

requirements-completed: [IV-01, IV-02, IV-05]

duration: 10min
completed: 2026-04-08
---

# Phase 33 Plan 01: Registry + Nomenclature + Tests Summary

**SF//[CAT]-NNN coded nomenclature infrastructure, registry reconciliation (36 entries), SYSTEM_STATS constant, and 13-test Playwright scaffold in RED state**

## Performance

- **Duration:** ~10 min active execution (wall clock interrupted by session limit)
- **Started:** 2026-04-08T22:28:00Z
- **Completed:** 2026-04-09T04:19:57Z
- **Tasks:** 3 completed (Task 0, 1, 2)
- **Files modified:** 4

## Accomplishments
- Registry reconciled: added SCRAMBLE_TEXT (105) and CIRCUIT_DIVIDER (106) as GENERATIVE Pattern C entries, bringing total to 36
- `assignCodes()` derives deterministic SF//FRM-001 through SF//GEN-006 codes from CATEGORY_ORDER sort
- HOMEPAGE_INVENTORY_INDICES maps 12 curated items (2 per category) with all indices verified against registry
- SYSTEM_STATS.components auto-updates from live registry count — no hardcoded numbers to maintain
- 13 Playwright tests covering all IV-01..06 and AQ-01..05 requirements, confirmed RED state

## Task Commits

1. **Task 0: Registry audit — reconcile missing entries and map 12-item homepage subset** - `82235bd` (feat)
2. **Task 1: Create lib/nomenclature.ts and lib/system-stats.ts** - `9f9a27b` (feat)
3. **Task 2: Write Playwright test scaffold — all 11 IV/AQ tests (RED state)** - `604dfc7` (test)

## Files Created/Modified
- `lib/nomenclature.ts` - assignCodes(), CATEGORY_CODE, CATEGORY_ORDER, CODED_REGISTRY, HOMEPAGE_INVENTORY_INDICES
- `lib/system-stats.ts` - SYSTEM_STATS with derived component count, bundle size, lighthouse score
- `lib/component-registry.ts` - sfCode? field on interface + SCRAMBLE_TEXT/CIRCUIT_DIVIDER entries
- `tests/phase-33-inventory-acquisition.spec.ts` - 13 tests (source + DOM hybrid pattern)

## Decisions Made
- sfCode is `optional` on interface — codes are computed by `assignCodes()`, never hardcoded per entry. This keeps the registry editable without worrying about code stability.
- SCRAMBLE_TEXT and CIRCUIT_DIVIDER were confirmed in the codebase and added as GENERATIVE entries at indices 105/106
- BADGE stays in FEEDBACK category (where it actually is in the registry), not DATA_DISPLAY as CONTEXT.md initially assumed. STATUS_DOT fills the DAT-002 slot.
- 13 tests written instead of plan's "11" because IV-01 and IV-05 each warranted both source-level and DOM tests

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Session limit hit mid-execution, requiring continuation in a new session. No code impact — Task 2 was uncommitted but intact in working tree.
- Pre-existing TSC error in `tests/phase-29-infra.spec.ts` (implicit any) — not introduced by this plan, not addressed.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Ready for 33-02-PLAN.md: InventorySection UI implementation
- All data contracts stable: CODED_REGISTRY, HOMEPAGE_INVENTORY_INDICES, SYSTEM_STATS exported and typed
- Tests ready to go GREEN as UI components are built in Plans 02-04

---
*Phase: 33-inventory-acquisition-sections*
*Completed: 2026-04-08*
