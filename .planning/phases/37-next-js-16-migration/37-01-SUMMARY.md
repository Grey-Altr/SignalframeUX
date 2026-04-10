---
phase: 37-next-js-16-migration
plan: 01
subsystem: infra
tags: [next.js, next-16, tailwindcss, proxy, migration, turbopack]

requires:
  - phase: 36-housekeeping-carry-overs
    provides: Clean ESLint baseline, Lighthouse 100/100, stable Next.js 15.5.14

provides:
  - Next.js 16.2.3 with Turbopack production bundler
  - proxy.ts (CSP header injection via Next.js 16 convention)
  - Tailwind CSS 4.2.2 (Unicode bug resolved)
  - eslint-config-next 16.2.3

affects: [37-02, phase-38-test-quality, phase-39-library-build]

tech-stack:
  added: []
  patterns: [proxy.ts replaces middleware.ts for Next.js 16+]

key-files:
  created: [proxy.ts]
  modified: [package.json, pnpm-lock.yaml]

key-decisions:
  - "Tailwind bumped first (4.1.4 → 4.2.2) to isolate Unicode bug risk before Next.js upgrade"
  - "Manual upgrade instead of codemod (codemod required interactive TTY; manual was cleaner for 3 known changes)"
  - "React 19.2.4 was already installed — no bump needed"
  - "proxy.ts uses export default function proxy (Next.js 16 convention, not named export)"

patterns-established:
  - "proxy.ts convention: default export function, same config.matcher pattern as prior middleware.ts"

requirements-completed: [MG-01]

duration: 17min
completed: 2026-04-10
---

# Phase 37 Plan 01: Core Migration Summary

**Next.js 15.5.14 → 16.2.3 with Tailwind 4.2.2 and middleware→proxy rename — build green, TypeScript clean**

## Performance

- **Duration:** 17 min
- **Started:** 2026-04-10T22:19:37Z
- **Completed:** 2026-04-10T22:36:50Z
- **Tasks:** 3
- **Files modified:** 3 (package.json, pnpm-lock.yaml, proxy.ts)

## Accomplishments
- Next.js upgraded from 15.5.14 to 16.2.3 — build exits 0, root route serves HTTP 200
- Tailwind CSS upgraded from 4.1.4 to 4.2.2 — Unicode code-point bug resolved
- middleware.ts renamed to proxy.ts with `export default function proxy` convention
- eslint-config-next upgraded from 15.5.14 to 16.2.3
- TypeScript compilation clean (`tsc --noEmit` zero errors)
- Turbopack production bundler active (build output: `✓ Compiled successfully`)

## Task Commits

Each task was committed atomically:

1. **Task 1: Upgrade Tailwind CSS to latest patch** - `29cad70` (chore)
2. **Task 2: Upgrade to Next.js 16 + eslint-config-next** - `64abbb0` (feat)
3. **Task 3: Rename middleware.ts to proxy.ts** - `ccc5de0` (feat)

## Files Created/Modified
- `proxy.ts` — CSP header injection via Next.js 16 proxy convention (created, replaces middleware.ts)
- `package.json` — next 16.2.3, tailwindcss 4.2.2, eslint-config-next 16.2.3
- `pnpm-lock.yaml` — Updated lockfile

## Decisions Made
- Skipped codemod (`npx @next/codemod@canary upgrade latest`) — required interactive TTY input, manual upgrade was cleaner since we knew the exact 3 changes needed
- React was already at 19.2.4 (codemod detection confirmed) — no version bump required
- Feature branch `next-16-migration` created per CONTEXT.md decision (branch-based rollback)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Codemod required interactive TTY**
- **Found during:** Task 2 (Run codemod)
- **Issue:** `npx @next/codemod@canary upgrade latest` launched interactive terminal UI requiring arrow keys — incompatible with non-interactive shell
- **Fix:** Performed manual dependency upgrades: `pnpm add next@latest`, `pnpm add -D eslint-config-next@latest` (React already at 19.2.4)
- **Files modified:** package.json, pnpm-lock.yaml
- **Verification:** All dependency versions match plan targets, build green, TypeScript clean
- **Committed in:** 64abbb0

**2. [Rule 1 - Bug] Port 3000 occupied during HTTP verification**
- **Found during:** Task 2 (verify root route serves)
- **Issue:** `pnpm start` failed with EADDRINUSE — a prior dev server was running on port 3000
- **Fix:** Killed stale process (PID 15508), restarted server, confirmed HTTP 200
- **Files modified:** None
- **Verification:** curl returned HTTP 200 after restart

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both deviations were environmental, not architectural. Same outcomes achieved through equivalent paths.

## Issues Encountered
None beyond the deviations documented above.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- Core migration complete — Next.js 16.2.3 builds and runs
- Ready for Plan 37-02: full test regression suite + Lighthouse gate + cache PoC
- Feature branch `next-16-migration` active — will merge to main after all Phase 37 gates pass

---
*Phase: 37-next-js-16-migration*
*Completed: 2026-04-10*
