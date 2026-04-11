---
phase: 39-library-build-pipeline
plan: 02
subsystem: library-build
tags: [package-json, exports, peerDependencies, tree-shaking, npm-distribution]
requirements-completed: [LIB-01, LIB-03]
dependency_graph:
  requires: [lib/entry-core.ts, lib/entry-animation.ts, lib/entry-webgl.ts, tsup.config.ts]
  provides: [package.json exports field, scripts/verify-tree-shake.ts]
  affects: [package.json, lib/entry-core.ts, lib/entry-animation.ts]
tech_stack:
  added: []
  patterns: [three-tier-exports-field, peerDependenciesMeta-optional, static-import-regex-verification]
key_files:
  created:
    - scripts/verify-tree-shake.ts
    - tests/phase-39-02-tree-shake.spec.ts
  modified:
    - package.json
    - lib/entry-core.ts
    - lib/entry-animation.ts
decisions:
  - "Skipped 'type: module' in package.json — tsup outExtension produces explicit .mjs/.cjs; adding type:module risks breaking Next.js config files"
  - "SFEmptyState moved to animation entry — transitive gsap dep via ScrambleText→gsap-split (missed in Plan 01)"
  - "SFStepper moved to animation entry — transitive gsap dep via SFProgress→gsap-core (missed in Plan 01)"
  - "Dynamic import('gsap') in signalframe-provider correctly excluded from tree-shake check — it's the optional-peer pattern, not a static dep"
  - "next peer minimum set to >=15.3.0 (not >=16.0.0 from plan spec) — project runs Next.js 15.3, plan spec was aspirational"
metrics:
  duration: ~900s
  completed: "2026-04-11"
  tasks_completed: 2
  files_created: 2
  files_modified: 3
---

# Phase 39 Plan 02: Package Configuration + Tree-Shaking Verification Summary

package.json exports field with 3 subpaths + CSS, peerDependencies with optional markers, and automated static-import regex verification proving core bundle has zero GSAP/Three.js leakage.

## What Was Built

### Task 1: package.json Configuration

**exports field (LIB-01):**
- `.` → dist/index.{mjs,cjs} with type-aware resolution (d.mts for ESM, d.ts for CJS)
- `./animation` → dist/animation.{mjs,cjs}
- `./webgl` → dist/webgl.{mjs,cjs}
- `./signalframeux.css` → dist/signalframeux.css

**Legacy resolution:** `main`, `module`, `types` fields for bundlers that don't support exports.

**Files field:** `["dist"]` — `npm pack --dry-run` shows 20 files, all in dist/, zero source files.

**sideEffects:** `["./dist/signalframeux.css"]` — all JS modules are side-effect-free for tree-shaking.

**peerDependencies:** react/react-dom (required), gsap/@gsap/react/three/next/tailwindcss (optional via peerDependenciesMeta).

**prepublishOnly:** `pnpm build:lib && npx tsx scripts/verify-tree-shake.ts` — safety net before any publish.

### Task 2: Tree-Shaking Verification Script (LIB-03)

**scripts/verify-tree-shake.ts:**
- Static import pattern regex: matches `from 'gsap'`, `from 'gsap/...`, `require('gsap'`, `require('gsap/...`
- Excludes dynamic `import('gsap')` — signalframe-provider uses this for optional-peer pattern
- 4 checks: core ESM clean, core CJS clean, animation has gsap, webgl has three
- Exits 0 on PASS, exits 1 on FAIL
- All 6 checks: PASS

**tests/phase-39-02-tree-shake.spec.ts:** 9 Playwright tests — script existence, content checks, dist/ bundle assertions, integration run.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] SFEmptyState incorrectly classified as core component**
- **Found during:** Task 2 — `dist/index.mjs` contained `import gsap from 'gsap'` (static)
- **Issue:** SFEmptyState → ScrambleText → gsap-split → gsap (transitive static import chain)
- **Fix:** Moved `SFEmptyState` export from `lib/entry-core.ts` to `lib/entry-animation.ts`
- **Files modified:** lib/entry-core.ts, lib/entry-animation.ts
- **Commit:** a4f2336

**2. [Rule 1 - Bug] SFStepper incorrectly classified as core component**
- **Found during:** Task 2 — same root cause as above
- **Issue:** SFStepper → SFProgress → gsap-core → gsap (transitive static import chain). Plan 01 noted "source does not statically import GSAP" but missed the SFProgress dependency resolving at bundle time.
- **Fix:** Moved `SFStepper`/`SFStep` export from `lib/entry-core.ts` to `lib/entry-animation.ts`
- **Files modified:** lib/entry-core.ts, lib/entry-animation.ts
- **Commit:** a4f2336

**3. [Deviation] Skipped `"type": "module"` field**
- **Plan spec:** Add `"type": "module"` to signal ESM-first package
- **Issue:** Project uses Next.js 15.3 with TypeScript config files; tsup already produces explicit `.mjs`/`.cjs` via `outExtension` — `"type": "module"` is redundant and could break Next.js build tool resolution
- **Resolution:** Per plan's own fallback guidance: "If `"type": "module"` breaks Next.js, fallback is to NOT add it." Tsup handles extensions explicitly. Omitted.

**4. [Deviation] next peer minimum set to >=15.3.0**
- **Plan spec:** `"next": ">=16.0.0"`
- **Issue:** Project runs Next.js 15.3. Setting >=16.0.0 would make the current codebase incompatible with its own peer requirement.
- **Resolution:** Set to `>=15.3.0` — matches the actual minimum compatible version.

## Bundle Size Change (Task 2 fix)

| Entry | Before Fix | After Fix | Delta |
|-------|-----------|-----------|-------|
| index.mjs | 127.89 KB | 120.76 KB | -7.13 KB |
| animation.mjs | 12.49 KB | 17.73 KB | +5.24 KB |
| index.cjs | 135.41 KB | 127.68 KB | -7.73 KB |
| animation.cjs | 14.29 KB | 19.75 KB | +5.46 KB |

## Known Stubs

None — all exports wire to real component implementations. dist/ is production build output.

## Threat Flags

None — no new network endpoints, auth paths, or file access patterns. `files: ["dist"]` mitigates T-39-04 (source leakage via npm publish).

## Self-Check

Files exist:
- scripts/verify-tree-shake.ts: FOUND
- tests/phase-39-02-tree-shake.spec.ts: FOUND
- package.json: FOUND (contains exports, peerDependencies, sideEffects, files)

Commits exist:
- b0d2751: feat(39-02) Task 1 — package.json configuration
- 3c40254: test(39-02) Task 2 RED — failing tests
- a4f2336: feat(39-02) Task 2 GREEN — verify-tree-shake.ts + entry fix

Verification:
- `npx tsx scripts/verify-tree-shake.ts` → RESULT: PASS (6/6)
- `npm pack --dry-run` → 20 files, all dist/, no source
- 9/9 Playwright tests pass

## Self-Check: PASSED
