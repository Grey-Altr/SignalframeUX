---
phase: 36-housekeeping-carry-overs
plan: "02"
subsystem: toolchain
tags: [eslint, typescript, code-quality, flat-config]
dependency_graph:
  requires: []
  provides: [eslint-flat-config, zero-lint-violations]
  affects: [package.json, eslint.config.js]
tech_stack:
  added:
    - "@eslint/eslintrc ^3.3.5 (direct devDep — pnpm hoisting requires direct install)"
    - "@typescript-eslint/eslint-plugin ^8.58.1 (direct devDep)"
    - "@typescript-eslint/parser ^8.58.1 (direct devDep)"
  patterns:
    - "FlatCompat wrapping eslint-config-next for ESLint 9 flat config compatibility"
    - "import type declarations replacing inline import() type annotations"
    - 'JSX // text content wrapped in {"//"} expressions to satisfy react/jsx-no-comment-textnodes'
key_files:
  created:
    - eslint.config.js
  modified:
    - package.json
    - components/animation/color-cycle-frame.tsx
    - components/animation/signal-motion.tsx
    - components/blocks/api-explorer.tsx
    - components/blocks/component-detail.tsx
    - components/blocks/components-explorer.tsx
    - components/blocks/dual-layer.tsx
    - components/blocks/hero.tsx
    - components/layout/breadcrumb.tsx
    - components/layout/footer.tsx
    - components/sf/sf-text.tsx
    - scripts/launch-gate.ts
    - tests/phase-25-detail-view.spec.ts
    - pnpm-lock.yaml
decisions:
  - "@typescript-eslint packages added as direct devDeps — pnpm does not hoist transitive deps, making them unresolvable from project-level ESM imports"
  - "test files get relaxed config spread (no-unsafe-* off) — intentional untyped patterns in Playwright specs"
  - "eslint.config.js uses ESM syntax (import/export) without adding type:module to package.json — exit 0 achieved, NODE MODULE_TYPELESS_PACKAGE_JSON is a cosmetic runtime hint not an ESLint error"
metrics:
  duration_seconds: ~1910
  completed_date: "2026-04-10"
  tasks_completed: 2
  files_modified: 14
---

# Phase 36 Plan 02: ESLint 9 Flat Config Summary

ESLint 9 flat config wired with eslint-config-next via FlatCompat + @typescript-eslint/recommended-type-checked at error level; `pnpm lint` exits 0 with zero violations across all source files.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create eslint.config.js + update lint script | 85e20ce | eslint.config.js, package.json |
| 2 | ESLint auto-fix + manual fix to zero violations | 8198bea | 14 source files, pnpm-lock.yaml |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] @typescript-eslint/eslint-plugin and @typescript-eslint/parser not resolvable**
- **Found during:** Task 2 (first lint run)
- **Issue:** pnpm does not hoist transitive packages to project root node_modules. Both @typescript-eslint packages and @eslint/eslintrc were transitive deps of eslint-config-next but unreachable from ESM imports in eslint.config.js.
- **Fix:** Added all three as direct devDependencies via `pnpm add -D`
- **Files modified:** package.json, pnpm-lock.yaml
- **Commit:** 8198bea

**2. [Rule 1 - Bug] Stale eslint-disable-next-line comments removed by auto-fix**
- **Found during:** Task 2 (eslint --fix pass)
- **Issue:** Auto-fix removed `// eslint-disable-next-line` comments for rules not in our config (@typescript-eslint/naming-convention, @typescript-eslint/no-require-imports), leaving blank stub lines in component-detail.tsx, sf-text.tsx, scripts/launch-gate.ts
- **Fix:** Cleaned up blank lines manually after auto-fix pass
- **Files modified:** components/blocks/component-detail.tsx, components/sf/sf-text.tsx, scripts/launch-gate.ts
- **Commit:** 8198bea

## Violations Fixed

| File | Rule | Fix Applied |
|------|------|-------------|
| components/animation/color-cycle-frame.tsx | consistent-type-imports | `typeof import("gsap").default` → `import type gsap` |
| components/blocks/components-explorer.tsx | consistent-type-imports (×2) | `import type * as GsapFlipMod`, replace inline import() refs |
| tests/phase-25-detail-view.spec.ts | consistent-type-imports | `import type { Page }` replacing inline `import("@playwright/test").Page` |
| components/blocks/api-explorer.tsx | jsx-no-comment-textnodes (×4) | Wrap `//` in `{"//"}` or `{"// "}` expressions |
| components/blocks/dual-layer.tsx | jsx-no-comment-textnodes | `{"//SIGNAL"}` |
| components/blocks/hero.tsx | jsx-no-comment-textnodes | `{"//"}` in hero-slashes span |
| components/layout/breadcrumb.tsx | jsx-no-comment-textnodes | `{"//"}` in separator span |
| components/layout/footer.tsx | jsx-no-comment-textnodes | `{"//"}` in SF//UX brand mark |
| components/animation/signal-motion.tsx | consistent-type-imports | Auto-fixed by eslint --fix (ScrollTrigger → import type) |

## Acceptance Criteria

- [x] AC-1: eslint.config.js contains FlatCompat, next/core-web-vitals, flat/recommended-type-checked, consistent-type-imports
- [x] AC-2: package.json scripts.lint = "eslint ."
- [x] AC-3: `pnpm lint` exits 0, zero errors
- [x] AC-4: .planning/**, .next/**, node_modules/**, public/** in ignores array

## Self-Check: PASSED

Files exist:
- eslint.config.js — FOUND
- package.json (lint script updated) — FOUND

Commits exist:
- 85e20ce — FOUND
- 8198bea — FOUND
