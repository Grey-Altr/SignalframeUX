---
phase: 09-extended-scenes-production-integration
plan: "03"
subsystem: ui
tags: [next.js, sfsection, sfstack, sfgrid, layout-primitives, stagger, gsap, scroll-trigger]

# Dependency graph
requires:
  - phase: 09-extended-scenes-production-integration
    provides: SFSection/SFStack/SFGrid layout primitives (created in Phase 2), PageAnimations stagger batch at line 368, data-anim CSS initial states

provides:
  - All 5 portfolio pages consume SFSection at section level (zero-consumer tech debt resolved)
  - data-anim="stagger" active on NEXT_CARDS grid (start page) and color-scale-grid (tokens page)
  - ScrollTrigger.batch stagger animation fires automatically on showcase grids via existing PageAnimations

affects: future page development — all new pages should follow SFSection section-level pattern

# Tech tracking
tech-stack:
  added: []
  patterns: [SFSection as section-level wrapper with py-0 className override for zero-spacing sections, data-bg-shift as spread prop (never bgShift boolean), data-anim="stagger" on multi-item showcase grids]

key-files:
  created: []
  modified:
    - app/page.tsx
    - app/components/page.tsx
    - app/tokens/page.tsx
    - app/start/page.tsx
    - app/reference/page.tsx
    - components/blocks/token-tabs.tsx

key-decisions:
  - "py-0 className override neutralizes SFSection default spacing (spacing='16') for section-level wrappers that have no own padding — spacing lives inside block children, not on the section element itself"
  - "data-anim='stagger' CSS initial state already existed in globals.css at line 1038 (opacity:0, translateY(20px)) — no new CSS rule needed, only data attribute placement"
  - "token-tabs.tsx #color-scale-grid chosen for stagger over TokenVizLoader (canvas, no DOM children) and ComponentsExplorer (would conflict with comp-cell)"

patterns-established:
  - "SFSection pattern: import SFSection from '@/components/sf', use at section level, pass className='py-0' when section has no own vertical padding, pass data-bg-shift='value' as spread prop"
  - "Stagger placement rule: data-anim='stagger' on wrapper whose direct children are the items to animate — never on grids with data-anim='comp-cell' children"

requirements-completed: [INT-01, INT-02]
requirements_completed: [INT-01, INT-02]

# Metrics
duration: 25min
completed: 2026-04-06
---

# Phase 9 Plan 03: SF Primitive Consumer Migration + Stagger Activation Summary

**All 5 portfolio pages migrated to SFSection at section level, resolving zero-consumer tech debt; stagger animation activated on NEXT_CARDS and token color-scale grid via existing PageAnimations ScrollTrigger.batch infrastructure**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-04-06T09:20:00Z
- **Completed:** 2026-04-06T09:45:00Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- Migrated 6 section-level divs in app/page.tsx to SFSection (hero, manifesto, signal/frame, stats, code, grid) with data-bg-shift as spread props
- Migrated app/components/page.tsx (header + SignalMesh sections), app/tokens/page.tsx (page header), app/start/page.tsx (hero, 5 steps, checklist, community), app/reference/page.tsx (APIExplorer wrapper)
- Added data-anim="stagger" to NEXT_CARDS grid in start/page.tsx and #color-scale-grid in token-tabs.tsx — stagger fires via existing PageAnimations ScrollTrigger.batch at line 368
- Confirmed globals.css already contains stagger initial state at line 1038 (opacity:0, translateY(20px)) with reduced-motion reset — no new CSS needed

## Task Commits

1. **Task 1: Migrate all 5 pages to SFSection/SFStack/SFGrid primitives** - `b56d32f` (feat)
2. **Task 2: Add stagger CSS initial state and data-anim attributes to showcase grids** - `0bf0b6c` (feat)

## Files Created/Modified

- `app/page.tsx` - 6 section divs replaced with SFSection; SFSection imported from @/components/sf
- `app/components/page.tsx` - Page header + SignalMesh div wrapped in SFSection
- `app/tokens/page.tsx` - Page header div wrapped in SFSection
- `app/start/page.tsx` - hero section, 5 step sections, checklist section, community section → SFSection; NEXT_CARDS grid gets data-anim="stagger"
- `app/reference/page.tsx` - APIExplorer wrapped in SFSection
- `components/blocks/token-tabs.tsx` - #color-scale-grid gets data-anim="stagger" attribute

## Decisions Made

- **py-0 override pattern:** SFSection defaults to `spacing="16"` which adds `py-16`. Section-level wrappers in this portfolio have no own vertical padding — spacing lives inside the block components (Hero, ManifestoBand, etc.). Added `className="py-0 ..."` to all zero-padding sections; tailwind-merge resolves `py-16 py-0` to `py-0` correctly.
- **Stagger CSS pre-existing:** globals.css already contained `[data-anim="stagger"] > *` initial state at line 1038 from a prior phase. No duplicate needed.
- **token-tabs.tsx chosen over tokens page-level:** TokenTabs is a client island — adding stagger to its internal #color-scale-grid (which has direct `[role="row"]` children) is the correct stagger placement level. TokenVizLoader is canvas-based, not a DOM grid.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Avoided duplicate stagger CSS — globals.css already had the rule**
- **Found during:** Task 2 (stagger CSS addition)
- **Issue:** Plan stated to add `[data-anim="stagger"] > * { opacity: 0; transform: translateY(8px); }` but globals.css already contained this rule at line 1038 with `translateY(20px)` (slightly different offset) plus a reduced-motion reset block at line 996
- **Fix:** Confirmed existing rule satisfies AC-6. Did not add duplicate. Reverted the new CSS addition after discovering the pre-existing rule.
- **Files modified:** app/globals.css (net zero change — added then reverted)
- **Verification:** grep confirms `[data-anim="stagger"] > *` at line 1038 with opacity:0 and transform initial state
- **Committed in:** 0bf0b6c (no net globals.css change)

---

**Total deviations:** 1 auto-fixed (Rule 1 — pre-existing CSS avoided duplication)
**Impact on plan:** AC-6 satisfied by pre-existing rule. No scope creep.

## Issues Encountered

None — build passed cleanly on first attempt for both tasks.

## Next Phase Readiness

- Phase 9 Plan 03 complete — all requirements INT-01 and INT-02 resolved
- All 5 portfolio pages now consume SF layout primitives at section level
- Stagger animation activated and ready to fire on scroll for NEXT_CARDS and token scales
- Phase 9 complete: SCN-03 + SCN-04 (GLSLHero) + INT-03 + INT-04 (SignalMotion + SignalOverlay) + INT-01 + INT-02 (primitive consumers + stagger) all done

---
*Phase: 09-extended-scenes-production-integration*
*Completed: 2026-04-06*
