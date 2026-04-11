---
phase: 42-tracking-reconciliation-peerdep-fix
plan: "01"
subsystem: tracking
tags: [requirements-tracking, frontmatter, peerDependencies, package-json, npm-distribution]

requires: []
provides:
  - requirements-completed frontmatter in phase 36 and 39 SUMMARYs
  - next in peerDependencies with optional:true
affects: [REQUIREMENTS.md, package.json, npm-consumers]

tech-stack:
  added: []
  patterns:
    - "requirements-completed YAML array in SUMMARY frontmatter to close artifact tracking gaps"
    - "peerDependenciesMeta optional:true for framework peer deps (next, gsap, three, tailwindcss)"

key-files:
  created: []
  modified:
    - .planning/phases/36-housekeeping-carry-overs/36-01-SUMMARY.md
    - .planning/phases/36-housekeeping-carry-overs/36-02-SUMMARY.md
    - .planning/phases/39-library-build-pipeline/39-01-SUMMARY.md
    - .planning/phases/39-library-build-pipeline/39-02-SUMMARY.md
    - package.json

key-decisions:
  - "requirements-completed inserted after tags: line — minimal frontmatter diff, no content modified"
  - "next peerDependency set to >=15.3.0 (not >=16.0.0) — matches existing project runtime, consistent with Plan 39-02 decision"

patterns-established:
  - "SUMMARY frontmatter requirements-completed: list all requirement IDs fulfilled by the plan"

requirements-completed: [CO-01, CO-02, CO-03, CO-04, LIB-01, LIB-02, LIB-03]

duration: 2m
completed: 2026-04-11
---

# Phase 42 Plan 01: Tracking Reconciliation + peerDep Fix Summary

**Closed CO-01-04 and LIB-01-03 artifact tracking gaps by backfilling requirements-completed frontmatter into 4 SUMMARY files, and moved `next` from dependencies to peerDependencies with optional:true to eliminate duplicate consumer installs.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-11T19:33:12Z
- **Completed:** 2026-04-11T19:34:51Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Added `requirements-completed` frontmatter to 36-01, 36-02, 39-01, 39-02 SUMMARYs — CO-01-04 and LIB-01-03 now tracked
- Moved `next` from `dependencies` to `peerDependencies` with `peerDependenciesMeta: { next: { optional: true } }`
- `npm publish --dry-run` exits 0 (18 dist/ files, prepublishOnly hook ran cleanly)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add requirements-completed to Phase 36 and 39 SUMMARYs** - `3fdcf61` (chore)
2. **Task 2: Move next from dependencies to peerDependencies** - `7a1fd1f` (chore)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `.planning/phases/36-housekeeping-carry-overs/36-01-SUMMARY.md` - Added `requirements-completed: [CO-01, CO-02]` after tags line
- `.planning/phases/36-housekeeping-carry-overs/36-02-SUMMARY.md` - Added `requirements-completed: [CO-03, CO-04]` after tags line
- `.planning/phases/39-library-build-pipeline/39-01-SUMMARY.md` - Added `requirements-completed: [LIB-02]` after tags line
- `.planning/phases/39-library-build-pipeline/39-02-SUMMARY.md` - Added `requirements-completed: [LIB-01, LIB-03]` after tags line
- `package.json` - next removed from dependencies, added to peerDependencies + peerDependenciesMeta

## Decisions Made

- `requirements-completed` inserted after the `tags:` line in each SUMMARY — minimal frontmatter diff with no content modification
- `next` peer minimum set to `>=15.3.0` (plan said `>=15.3.0`; 39-02 decision record confirms this was already the settled value)
- No `pnpm install` run — the package.json edit is a peer/distribution metadata change only; local devDependency `next` remains in devDeps via lockfile and is unaffected

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Requirements CO-01-04 and LIB-01-03 are now fully tracked in artifact frontmatter
- `npm publish` will no longer bundle `next` as a hard dependency — consumers who already have Next.js installed will not receive a duplicate
- REQUIREMENTS.md `mark-complete` state update pending (handled by state update commands)

---
*Phase: 42-tracking-reconciliation-peerdep-fix*
*Completed: 2026-04-11*
