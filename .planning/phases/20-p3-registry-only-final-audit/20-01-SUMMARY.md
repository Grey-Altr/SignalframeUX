---
phase: 20-p3-registry-only-final-audit
plan: 01
subsystem: ui
tags: [react-day-picker, radix, menubar, calendar, lazy-loading, next-dynamic]

# Dependency graph
requires:
  - phase: 16-infrastructure-baseline
    provides: SCAFFOLDING.md Pattern B definition, bundle baseline
  - phase: 19-p2-components
    provides: SFSkeleton for lazy loader fallbacks
provides:
  - SFCalendar lazy-loaded date picker with zero border-radius
  - SFMenubar lazy-loaded desktop menubar with zero border-radius
  - Registry entries for both with meta.heavy:true and pattern:B
affects: [20-02-final-audit]

# Tech tracking
tech-stack:
  added: [react-day-picker, date-fns]
  patterns: [Pattern B lazy loading with next/dynamic and SFSkeleton fallback]

key-files:
  created:
    - components/sf/sf-calendar.tsx
    - components/sf/sf-calendar-lazy.tsx
    - components/sf/sf-menubar.tsx
    - components/sf/sf-menubar-lazy.tsx
    - components/ui/calendar.tsx
    - components/ui/menubar.tsx
  modified:
    - registry.json

key-decisions:
  - "Calendar uses --cell-radius:0px CSS var override instead of per-element rounded-none for DayPicker internal elements"
  - "SFMenubar wraps all 15 sub-components for complete API parity with shadcn base"

patterns-established:
  - "Pattern B P3: wrapper + lazy loader pair, never in barrel, registry meta.heavy:true"

requirements-completed: [REG-01, REG-02]

# Metrics
duration: 5min
completed: 2026-04-06
---

# Phase 20 Plan 01: P3 Components Summary

**SFCalendar and SFMenubar as Pattern B lazy-loaded components with react-day-picker, zero border-radius, and registry entries with meta.heavy:true**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-06T20:39:08Z
- **Completed:** 2026-04-06T20:44:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- SFCalendar wraps react-day-picker with --cell-radius:0px override eliminating all rounded corners
- SFMenubar wraps all 15 Radix menubar sub-components with DU/TDR industrial styling
- Both lazy loaders use next/dynamic with ssr:false and SFSkeleton fallback
- Neither component pollutes sf/index.ts barrel -- shared bundle remains at 102 KB
- Registry entries include meta.heavy:true and meta.pattern:B for both

## Task Commits

Each task was committed atomically:

1. **Task 1: Install shadcn bases + create SFCalendar** - `ef351bb` (feat)
2. **Task 2: Create SFMenubar + registry entries + build gate** - `d220fa8` (feat)

## Files Created/Modified
- `components/ui/calendar.tsx` - shadcn base calendar (react-day-picker)
- `components/ui/menubar.tsx` - shadcn base menubar (Radix)
- `components/sf/sf-calendar.tsx` - SF wrapper with --cell-radius:0px and border-2
- `components/sf/sf-calendar-lazy.tsx` - next/dynamic lazy loader with SFSkeleton
- `components/sf/sf-menubar.tsx` - SF wrapper for all 15 sub-components with rounded-none
- `components/sf/sf-menubar-lazy.tsx` - next/dynamic lazy loader with SFSkeleton
- `registry.json` - Two new entries with meta.heavy:true, pattern:B

## Decisions Made
- Used --cell-radius:0px CSS variable override on Calendar root rather than overriding each DayPicker internal element individually -- cleaner and catches all dynamic rounded-* classes
- Wrapped all 15 menubar sub-components for complete API surface, even pass-through ones like SFMenubarMenu and SFMenubarSub

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Both P3 components complete, ready for Phase 20 Plan 02 (Final Audit / Lighthouse)
- Shared bundle at 102 KB, well under 150 KB gate

## Self-Check: PASSED

All 6 created files verified on disk. Both commit hashes (ef351bb, d220fa8) confirmed in git log.

---
*Phase: 20-p3-registry-only-final-audit*
*Completed: 2026-04-06*
