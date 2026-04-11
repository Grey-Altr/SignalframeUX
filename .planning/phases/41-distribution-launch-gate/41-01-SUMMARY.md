---
phase: 41-distribution-launch-gate
plan: 01
subsystem: infra
tags: [npm, publish, bundle-size, changelog, license, npmignore, gzip]

# Dependency graph
requires: []
provides:
  - .npmignore with dist/*.map exclusion (via files field negation)
  - MIT LICENSE file for Culture Division 2026
  - CHANGELOG.md in Keep a Changelog format with 0.1.0 entry
  - scripts/verify-bundle-size.ts gzip gate (50 KB budget, 28.3 KB actual)
  - package.json files field expanded to include metadata files
  - prepublishOnly chain extended with bundle size gate
affects: [42-distribution-launch-gate, any future npm publish workflow]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "npm files field negation (!dist/*.map) to exclude source maps from tarball"
    - "async main() wrapper pattern for tsx scripts (avoids top-level await CJS error)"
    - "gzip streaming via createReadStream + createGzip for accurate bundle measurement"

key-files:
  created:
    - .npmignore
    - LICENSE
    - CHANGELOG.md
    - scripts/verify-bundle-size.ts
  modified:
    - package.json

key-decisions:
  - "Use !dist/*.map negation in package.json files field rather than .npmignore alone — npm-packlist 5.x (used by npm 10) does not reliably filter within files[]-listed directories via .npmignore"
  - "Wrap async logic in main() function instead of top-level await — tsx/esbuild defaults to CJS output which rejects top-level await"

patterns-established:
  - "Bundle gate pattern: async main() + gzipSize streaming + BUDGET_BYTES threshold + process.exit(1) on failure"
  - "prepublishOnly chain: build -> tree-shake verify -> bundle size verify"

requirements-completed: [DIST-01, DIST-03]

# Metrics
duration: 28min
completed: 2026-04-11
---

# Phase 41 Plan 01: Distribution Metadata & Bundle Size Gate Summary

**npm publish-ready tarball with MIT LICENSE, Keep a Changelog 0.1.0 entry, source map exclusion via files negation, and automated 50 KB gzip gate (actual: 28.3 KB)**

## Performance

- **Duration:** 28 min
- **Started:** 2026-04-11T17:26:42Z
- **Completed:** 2026-04-11T17:31:12Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Created .npmignore + package.json files negation to exclude all 6 source map files from tarball (reduced from 1.2 MB to 513 KB unpacked, 218.7 KB to 94.4 KB packed)
- Created MIT LICENSE and CHANGELOG.md in Keep a Changelog format satisfying DIST-01 and DIST-03
- Created scripts/verify-bundle-size.ts measuring gzip of 4 entry points; 28.3 KB total against 50 KB budget
- Extended prepublishOnly chain: `pnpm build:lib && verify-tree-shake && verify-bundle-size`

## Task Commits

Each task was committed atomically:

1. **Task 1: Create distribution metadata files and update package.json** - `b47dc7a` (feat)
2. **Task 2: Create bundle size verification script and wire into prepublishOnly** - `bba6a14` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified
- `.npmignore` - Source map exclusion comment; primary exclusion via package.json files negation
- `LICENSE` - MIT license, Copyright (c) 2026 Culture Division
- `CHANGELOG.md` - Keep a Changelog format, [0.1.0] entry with all entry points documented
- `scripts/verify-bundle-size.ts` - Gzip streaming gate: 4 entry points, 50 KB budget, exits 1 on failure
- `package.json` - files field expanded (dist, !dist/*.map, README.md, LICENSE, CHANGELOG.md, MIGRATION.md); prepublishOnly extended with bundle size gate

## Decisions Made
- **`!dist/*.map` in files field, not .npmignore alone:** npm-packlist 5.x (npm 10) does not reliably apply .npmignore patterns to filter files within a directory listed in the `files` field. Tested both `dist/*.map` and `**/*.map` in .npmignore — neither excluded maps. Inspected npm-packlist source: `globFiles("dist")` expands to an explicit file list that bypasses ignore-walk's filterEntry for those paths. The correct fix is negation in the `files` array itself.
- **`async main()` wrapper in verify-bundle-size.ts:** tsx/esbuild defaults to CJS output format which rejects top-level await at transform time. Wrapping in an explicit async function avoids this without requiring tsconfig changes, consistent with the project's existing scripts pattern.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] .npmignore did not exclude .map files from tarball**
- **Found during:** Task 1 verification
- **Issue:** `npm pack --dry-run` showed all 6 `.map` files despite `dist/*.map` and `**/*.map` in .npmignore. Root cause: npm-packlist 5.x expands `files: ["dist"]` via globFiles into an explicit file set, which bypasses the ignore-walk filterEntry path that .npmignore hooks into.
- **Fix:** Added `"!dist/*.map"` negation pattern to the `files` array in package.json; retained .npmignore for documentation/gitignore-style tooling
- **Files modified:** package.json
- **Verification:** `npm pack --dry-run` shows 0 .map files, tarball reduced from 218.7 KB to 94.4 KB
- **Committed in:** b47dc7a (Task 1 commit)

**2. [Rule 3 - Blocking] Top-level await incompatible with tsx/esbuild CJS output**
- **Found during:** Task 2 verification
- **Issue:** `npx tsx scripts/verify-bundle-size.ts` exited 1 with "Top-level await is currently not supported with the 'cjs' output format" — script never ran
- **Fix:** Moved async logic into `async function main()` with `.catch()` handler; matches existing scripts pattern
- **Files modified:** scripts/verify-bundle-size.ts
- **Verification:** Script exits 0 with PASS output showing 28.3 KB total
- **Committed in:** bba6a14 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes essential for correctness. No scope creep — .npmignore still present as documented, negation pattern is the standard npm mechanism.

## Issues Encountered
- npm-packlist's interaction between `files[]` and `.npmignore` required source-level investigation (inspected `/usr/local/lib/node_modules/npm/node_modules/npm-packlist/lib/index.js` and `ignore-walk`) to confirm the correct exclusion mechanism.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Tarball is publish-ready: correct contents, no source maps, metadata files present
- Bundle size gate wired into prepublishOnly chain — will block publish if size exceeds 50 KB
- Ready for `npm publish` or next distribution phase steps

---
*Phase: 41-distribution-launch-gate*
*Completed: 2026-04-11*
