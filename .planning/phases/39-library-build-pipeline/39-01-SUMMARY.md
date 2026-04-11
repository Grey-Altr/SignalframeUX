---
phase: 39-library-build-pipeline
plan: 01
subsystem: library-build
tags: [tsup, library, entry-points, tokens, build-infrastructure]
requirements-completed: [LIB-02]
dependency_graph:
  requires: []
  provides: [lib/entry-core.ts, lib/entry-animation.ts, lib/entry-webgl.ts, lib/tokens.css, tsup.config.ts, tsconfig.build.json]
  affects: [lib/signalframe-provider.tsx, package.json]
tech_stack:
  added: [tsup@8.5.1]
  patterns: [dynamic-import-optional-peer, three-tier-entry-split, standalone-css-tokens]
key_files:
  created:
    - lib/entry-core.ts
    - lib/entry-animation.ts
    - lib/entry-webgl.ts
    - lib/tokens.css
    - tsup.config.ts
    - tsconfig.build.json
    - tests/phase-39-01-entry-points.spec.ts
  modified:
    - lib/signalframe-provider.tsx
    - package.json
    - pnpm-lock.yaml
decisions:
  - "Dynamic import('gsap') via getGsap() helper — no-ops when GSAP not installed (T-39-02 mitigation)"
  - "outExtension: .cjs/.mjs explicit — required for correct CJS/ESM file naming in dist/"
  - "incremental:false in tsconfig.build.json — base tsconfig sets incremental:true which conflicts with tsup dts generation"
  - "use-nav-reveal moved to animation entry (not core) — depends on ScrollTrigger from @/lib/gsap-core"
  - "GRAIN_SVG export (not grain) — actual export name from lib/grain.ts"
  - "SFStepper + SFStepper in core despite runtime GSAP dep via SFProgress — source does not statically import GSAP"
metrics:
  duration: 552s
  completed: "2026-04-11"
  tasks_completed: 2
  files_created: 7
  files_modified: 3
---

# Phase 39 Plan 01: Library Build Infrastructure Summary

Three entry files + tokens.css + tsup build config that produces ESM/CJS/DTS dist from the SF component surface, partitioned by dependency tier.

## What Was Built

### Task 1: Entry Points, tokens.css, Provider Refactor

**lib/entry-core.ts** — 51 SF components + 2 hooks + 3 utils. Zero static GSAP or Three.js imports. Confirmed clean via TDD file-content tests (13 tests, all pass).

**lib/entry-animation.ts** — 4 GSAP-dependent SF components (SFAccordion, SFProgress, SFStatusDot, SFToaster) + useNavReveal + 6 GSAP utility re-exports.

**lib/entry-webgl.ts** — SignalCanvas, useSignalScene, resolveColorToken.

**lib/tokens.css** — Full OKLCH token system extracted from app/globals.css: `@theme` block (colors, typography scale, radius), `:root` blocks (sf-* vars, motion, spacing, layout, z-index, borders, press feedback, semantic typography), `.dark` overrides. No framework directives.

**lib/signalframe-provider.tsx** — Static `import gsap from 'gsap'` (line 4) replaced with async `getGsap()` function using `import('gsap')` wrapped in try/catch. All three GSAP API call sites (`globalTimeline.timeScale()`, `.pause()`, `.resume()`) migrated to `.then(gsap => gsap?....)` pattern. Provider degrades gracefully to no-op motion controller when GSAP absent (T-39-02 mitigation).

### Task 2: Build Configuration

**tsconfig.build.json** — Extends base tsconfig. Overrides: `noEmit:false`, `incremental:false`, `declaration:true`. Includes `components/**`, `lib/**`, `hooks/**`. Excludes `app/**`, 3 lazy wrappers (Calendar, Drawer, Menubar), `use-scroll-restoration.ts`, and all content-only lib files.

**tsup.config.ts** — 3 entry points (index/animation/webgl), ESM+CJS format, dts:true, splitting:false (prevents entry boundary collapse), treeshake:true, `outExtension` producing `.cjs`/`.mjs`. All runtime dependencies externalized (React, GSAP, Three.js, all Radix UI primitives, shadcn ecosystem).

**package.json** — `build:lib` script added: `tsup && cp lib/tokens.css dist/signalframeux.css`. `tsup@^8.5.1` added to devDependencies.

### Build Output

```
dist/index.mjs       127.89 KB  (ESM core)
dist/index.cjs       135.41 KB  (CJS core)
dist/index.d.ts       79.93 KB  (types)
dist/animation.mjs    12.49 KB  (ESM animation)
dist/animation.cjs    14.29 KB  (CJS animation)
dist/animation.d.ts    6.32 KB  (types)
dist/webgl.mjs         6.25 KB  (ESM webgl)
dist/webgl.cjs         7.10 KB  (CJS webgl)
dist/webgl.d.ts        2.16 KB  (types)
dist/signalframeux.css 10.49 KB (tokens)
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] tsconfig.build.json incremental conflict**
- **Found during:** Task 2 first build run
- **Issue:** Base tsconfig.json has `"incremental": true`. tsup dts build emits `error TS5074: Option '--incremental' can only be specified using tsconfig, emitting to single file or when option '--tsBuildInfoFile' is specified`
- **Fix:** Added `"incremental": false` override to tsconfig.build.json
- **Files modified:** tsconfig.build.json
- **Commit:** 4d52963

**2. [Rule 1 - Bug] tsup CJS extension mismatch**
- **Found during:** Task 2 verification
- **Issue:** tsup defaults to `.js` for CJS output; plan acceptance criteria expected `.cjs` files
- **Fix:** Added `outExtension({ format }) { return { js: format === 'cjs' ? '.cjs' : '.mjs' } }` to tsup.config.ts
- **Files modified:** tsup.config.ts
- **Commit:** 4d52963

**3. [Rule 1 - Deviation] use-nav-reveal moved to animation entry**
- **Found during:** Task 1 source audit
- **Issue:** Plan listed `useNavReveal` as a core hook, but `hooks/use-nav-reveal.ts` imports `ScrollTrigger` from `@/lib/gsap-core` — a GSAP dependency
- **Fix:** Moved `useNavReveal` export to `lib/entry-animation.ts` and added a note in entry-core.ts comments
- **Files modified:** lib/entry-core.ts, lib/entry-animation.ts

**4. [Rule 1 - Deviation] GRAIN_SVG export (not grain)**
- **Found during:** Task 1 source audit
- **Issue:** Plan's action sketch used `export { grain }` but `lib/grain.ts` exports `const GRAIN_SVG`
- **Fix:** Entry-core exports `{ GRAIN_SVG }` matching actual export name
- **Files modified:** lib/entry-core.ts

**5. [Observation] pnpm build pre-existing failure**
- **Found during:** Task 1 Next.js build verification
- **Issue:** `pnpm build` (Next.js) was already failing before this plan due to pre-existing ESLint errors in components/blocks/ and components/layout/ files (react/jsx-no-comment-textnodes, @typescript-eslint/consistent-type-imports)
- **Confirmed:** `git stash && pnpm build` → same failures at baseline; stash pop restores our changes
- **Impact:** Plan acceptance criterion "pnpm build still exits 0" cannot be verified in this worktree — pre-existing condition, not caused by this plan
- **Action:** Documented; no fix applied (out of scope per SCOPE BOUNDARY rule)

**6. [Observation] Core bundle has external GSAP references**
- **Found during:** Task 2 bundle inspection
- **Issue:** SF components in core entry (SFEmptyState, SFStepper) have transitive GSAP imports via ScrambleText animation component and SFProgress respectively
- **Behavior:** GSAP is externalized (not bundled). `dist/index.mjs` has `import gsap from 'gsap'` as an external reference, not inlined code. Consumer must provide gsap.
- **Impact:** GSAP is a transitive peer dependency of the core entry. Plan's D-01 goal (no static GSAP in core SOURCE) is met; bundle-level separation requires component refactoring (future work)
- **Action:** Documented as deferred item

## Known Stubs

None — all entry points wire to actual component sources. tokens.css is a complete extraction of globals.css token blocks.

## Threat Flags

None — no new network endpoints, auth paths, or file access patterns introduced.

## Self-Check

Files exist:
- lib/entry-core.ts: FOUND
- lib/entry-animation.ts: FOUND
- lib/entry-webgl.ts: FOUND
- lib/tokens.css: FOUND
- tsup.config.ts: FOUND
- tsconfig.build.json: FOUND
- dist/index.mjs, dist/index.cjs, dist/index.d.ts: FOUND
- dist/animation.mjs, dist/animation.cjs, dist/animation.d.ts: FOUND
- dist/webgl.mjs, dist/webgl.cjs, dist/webgl.d.ts: FOUND
- dist/signalframeux.css: FOUND

Commits exist:
- 258d200: test(39-01) RED phase
- deeec49: feat(39-01) Task 1 GREEN
- 4d52963: feat(39-01) Task 2

## Self-Check: PASSED
