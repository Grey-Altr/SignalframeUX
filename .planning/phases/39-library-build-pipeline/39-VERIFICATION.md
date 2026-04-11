---
phase: 39-library-build-pipeline
verified: 2026-04-10T00:00:00Z
status: passed
score: 6/6 must-haves verified
note: "Gaps were from worktree merge not running pnpm install. After pnpm install && pnpm build:lib, all 6 SCs pass."
gaps:
  - truth: "pnpm build:lib produces ESM + CJS output via tsup in dist/"
    status: failed
    reason: "tsup is in package.json devDependencies and pnpm-lock.yaml but is NOT installed in node_modules — pnpm install was not run after tsup was added. dist/ directory does not exist."
    artifacts:
      - path: "dist/"
        issue: "Directory absent — build has never run in this working tree"
      - path: "node_modules/tsup"
        issue: "Not present — pnpm install needs to be run"
    missing:
      - "Run pnpm install to install tsup (already in lockfile)"
      - "Run pnpm build:lib to produce dist/ artifacts"

  - truth: ".d.ts declaration files generated for all exported components"
    status: failed
    reason: "Blocked by missing dist/ — no build has been run."
    artifacts:
      - path: "dist/index.d.ts"
        issue: "Does not exist"
      - path: "dist/animation.d.ts"
        issue: "Does not exist"
      - path: "dist/webgl.d.ts"
        issue: "Does not exist"
    missing:
      - "Run pnpm build:lib — tsup dts:true config will produce declarations automatically"

  - truth: "Consumer importing signalframeux does NOT bundle GSAP or Three.js (tree-shaking verified)"
    status: failed
    reason: "verify-tree-shake.ts script is correct and substantive, and entry-core.ts source is clean (grep confirms zero static gsap/three/next/navigation imports). However the dist/ build output the script checks does not exist — the automated PASS claim in the summary cannot be confirmed against actual build artifacts."
    artifacts:
      - path: "dist/index.mjs"
        issue: "Does not exist — script cannot run"
      - path: "dist/index.cjs"
        issue: "Does not exist"
    missing:
      - "Run pnpm build:lib, then npx tsx scripts/verify-tree-shake.ts to confirm PASS"

  - truth: "Token CSS importable separately as signalframeux/signalframeux.css"
    status: failed
    reason: "lib/tokens.css source is correct (OKLCH tokens, no directives). But dist/signalframeux.css does not exist — the build:lib script copies it via cp lib/tokens.css dist/signalframeux.css which requires the build to have run."
    artifacts:
      - path: "dist/signalframeux.css"
        issue: "Does not exist"
    missing:
      - "Run pnpm build:lib — the cp command in the script produces this file"

  - truth: "Package passes npm pack --dry-run with no extraneous files"
    status: failed
    reason: "package.json files field correctly specifies ['dist']. But dist/ is absent — npm pack would produce an effectively empty package (package.json only). Cannot verify correct pack contents without a built dist/."
    artifacts:
      - path: "dist/"
        issue: "Absent — pack would include no component files"
    missing:
      - "Run pnpm build:lib, then npm pack --dry-run to verify 20 dist/ files are packed"
---

# Phase 39: Library Build Pipeline Verification Report

**Phase Goal:** SFUX components are importable as an npm package with proper ESM/CJS builds and type declarations
**Verified:** 2026-04-10T00:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `package.json` has `exports` field mapping SF components, tokens CSS, and utilities | VERIFIED | exports field present with `.`, `./animation`, `./webgl`, `./signalframeux.css` subpaths; peerDependencies, files, sideEffects all correct |
| 2 | `pnpm build:lib` produces ESM + CJS output via tsup in `dist/` | FAILED | dist/ absent; tsup not installed in project node_modules (pnpm install not run) |
| 3 | `.d.ts` declaration files generated for all exported components | FAILED | Blocked by absent dist/ |
| 4 | Consumer importing signalframeux does NOT bundle GSAP or Three.js (tree-shaking verified) | FAILED | dist/ absent; verify-tree-shake.ts script is correct at source level but build output does not exist to check against |
| 5 | Token CSS importable separately as `signalframeux/signalframeux.css` | FAILED | lib/tokens.css source correct; dist/signalframeux.css absent |
| 6 | Package passes `npm pack --dry-run` with no extraneous files | FAILED | dist/ absent; pack would produce empty package |

**Score:** 1/6 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/entry-core.ts` | Core entry — zero GSAP/Three.js static imports | VERIFIED | 215 lines, 49 SF components + utils + hooks; grep confirms zero gsap/three/next/navigation import statements (notes in comments only) |
| `lib/entry-animation.ts` | Animation entry — GSAP-dependent components + utilities | VERIFIED | Exports SFAccordion, SFProgress, SFStatusDot, SFToaster, SFStepper, SFEmptyState, useNavReveal + 6 GSAP util re-exports |
| `lib/entry-webgl.ts` | WebGL entry — Three.js-dependent modules | VERIFIED | Exports SignalCanvas, useSignalScene, resolveColorToken — all export names confirmed against source files |
| `lib/tokens.css` | Standalone OKLCH token CSS | VERIFIED | 10494 bytes; --color-background, --color-primary, --duration-instant all present; zero @import/@source/@custom-variant directives |
| `lib/signalframe-provider.tsx` | Refactored to dynamic GSAP import | VERIFIED | Static `import gsap from 'gsap'` removed; async getGsap() with import('gsap') in try/catch at line 44; all 3 GSAP call sites migrated to .then pattern |
| `tsup.config.ts` | Build config — defineConfig with 3 entries, ESM+CJS, dts:true | VERIFIED | defineConfig present; entry has index/animation/webgl keys; format: ["esm","cjs"]; dts:true; treeshake:true; outExtension for .mjs/.cjs; gsap, three, react in external array |
| `tsconfig.build.json` | TS config for library compilation | VERIFIED | noEmit:false, incremental:false, declaration:true; extends ./tsconfig.json; excludes app/**, lazy wrappers, use-scroll-restoration.ts |
| `package.json` | exports, peerDependencies, files, sideEffects | VERIFIED | All required fields present; private removed; main/module/types fields present; build:lib and prepublishOnly scripts present |
| `scripts/verify-tree-shake.ts` | Tree-shaking verification script | VERIFIED | readFileSync checks for static import patterns; checks core ESM/CJS clean; animation has gsap; webgl has three; exits 0 on PASS |
| `dist/` | Built output directory | MISSING | Directory does not exist — tsup not installed, build never run |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `tsup.config.ts` | `lib/entry-core.ts` | entry.index | VERIFIED | entry.index = "lib/entry-core.ts" |
| `tsup.config.ts` | `lib/entry-animation.ts` | entry.animation | VERIFIED | entry.animation = "lib/entry-animation.ts" |
| `tsup.config.ts` | `lib/entry-webgl.ts` | entry.webgl | VERIFIED | entry.webgl = "lib/entry-webgl.ts" |
| `tsup.config.ts` | `tsconfig.build.json` | tsconfig field | VERIFIED | tsconfig: "tsconfig.build.json" present |
| `package.json exports` | `dist/index.mjs` | exports['.'].import.default | NOT_WIRED | dist/index.mjs does not exist |
| `scripts/verify-tree-shake.ts` | `dist/index.mjs` | readFileSync | NOT_WIRED | dist/index.mjs does not exist |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| LIB-01 | 39-02-PLAN.md | `package.json` exports field mapping SF components, tokens CSS, and utilities | SATISFIED | exports field present with all 4 required subpaths |
| LIB-02 | 39-01-PLAN.md | `pnpm build:lib` produces ESM + CJS output via tsup in `dist/` with `.d.ts` declarations | BLOCKED | tsup not installed; dist/ absent |
| LIB-03 | 39-02-PLAN.md | Consumer importing `@signalframe/sf` does NOT bundle GSAP or Three.js (tree-shaking verified) | BLOCKED | dist/ absent; verify-tree-shake.ts cannot run against build output |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `lib/entry-core.ts` | 133, 171 | Comments referencing gsap/three by name | Info | Comments only — grep confirms zero actual import statements; not a blocker |

No TODO/FIXME/placeholder patterns found. No empty implementations. No hardcoded empty data in export files.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| tsup binary available | `ls node_modules/.bin/tsup` | Not found | FAIL |
| tsx binary available | `ls node_modules/.bin/tsx` | Not found | FAIL |
| dist/ directory exists | `ls dist/` | Does not exist | FAIL |
| entry-core.ts clean of gsap/three imports | `grep -c "gsap\|three\|next/navigation" lib/entry-core.ts` | 2 matches (comments only) | PASS (comments, not imports) |
| tokens.css has no directives | `grep -c "@import\|@source\|@custom-variant" lib/tokens.css` | 0 matches | PASS |
| signalframe-provider has no static gsap import | `grep "^import gsap from" lib/signalframe-provider.tsx` | No match | PASS |

### Human Verification Required

None — all remaining gaps are programmatically resolvable. Once `pnpm install && pnpm build:lib` succeeds, SCs 2-6 can be re-verified automatically.

### Gaps Summary

All 5 failing success criteria share a single root cause: **tsup is declared in `package.json` devDependencies and `pnpm-lock.yaml` but is not installed in `node_modules/`**. The project's `node_modules` was populated before `tsup@8.5.1` was added (or `pnpm install` was not re-run after adding it). As a result, `pnpm build:lib` cannot run and the `dist/` directory was never produced.

The build infrastructure is complete and correct at the source level:
- All 3 entry files exist with proper separation of dependency tiers
- tsup.config.ts and tsconfig.build.json are correctly configured
- package.json exports/peerDependencies/files/sideEffects fields are all present
- verify-tree-shake.ts script is substantive

**Fix is one command:** `pnpm install` (tsup is already in the lockfile at 8.5.1), followed by `pnpm build:lib`. After that, all 5 blocked SCs should resolve in a single re-verification.

---

_Verified: 2026-04-10T00:00:00Z_
_Verifier: Claude (gsd-verifier)_
