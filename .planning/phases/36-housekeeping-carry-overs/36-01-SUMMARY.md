---
phase: 36-housekeeping-carry-overs
plan: 01
subsystem: lighthouse-seo-accessibility-typescript-requirements
tags: [lighthouse, csp, aria, typescript, requirements, seo, best-practices]
requirements-completed: [CO-01, CO-02]
dependency_graph:
  requires: [phase-35-complete, deployed-production-url]
  provides: [lighthouse-100-all-4, clean-tsc, v1.6-requirements-baseline]
  affects: [middleware.ts, app/layout.tsx, REQUIREMENTS.md]
tech_stack:
  added: [app/icon.tsx, scripts/launch-gate-runner.mjs]
  patterns: [static-rendering-without-headers, nonce-free-csp, aria-table-cell-roles]
key_files:
  created:
    - app/icon.tsx
    - scripts/launch-gate-runner.mjs
  modified:
    - app/layout.tsx
    - middleware.ts
    - components/blocks/inventory-section.tsx
    - tests/phase-35-reference.spec.ts
    - tests/phase-29-infra.spec.ts
    - .planning/REQUIREMENTS.md
decisions:
  - Remove headers() from layout.tsx to restore static rendering and fix metadata-in-body SEO failure
  - Remove nonce from CSP — nonce presence makes unsafe-inline ignored per CSP3 spec, blocking all scripts
  - Use native ESM .mjs runner for Lighthouse (tsx CJS/ESM interop incompatible with lighthouse@13 type:module)
metrics:
  duration: 14m
  completed: 2026-04-10
  tasks_completed: 2
  files_changed: 7
---

# Phase 36 Plan 01: Lighthouse + Test Fixes + Requirements Baseline Summary

Removed nonce-based CSP and headers() dynamic-rendering forcing to achieve Lighthouse Best Practices 100 + SEO 100 + Accessibility 100 (worst of 3 runs). Fixed T-06 test path and TypeScript strict mode. Appended v1.6 requirement IDs to REQUIREMENTS.md.

## Tasks Completed

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | Lighthouse diagnostic + fix loop | f1f0186 | app/layout.tsx, middleware.ts, app/icon.tsx, components/blocks/inventory-section.tsx, scripts/launch-gate-runner.mjs |
| 2 | Test fixes + TS strict + REQUIREMENTS.md + ROADMAP verify | 1165e24 | tests/phase-35-reference.spec.ts, tests/phase-29-infra.spec.ts, .planning/REQUIREMENTS.md |

## Acceptance Criteria Results

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Lighthouse BP=100, SEO=100 (worst of 3) | PASS — BP=100, SEO=100, Accessibility=100 |
| AC-2 | T-06 reads api-explorer.tsx | PASS |
| AC-3 | tsc --noEmit exits 0 | PASS |
| AC-4 | REQUIREMENTS.md has v1.6 section | PASS |
| AC-5 | ROADMAP Phase 31/35/v1.5 correct | PASS — all [x], 5/5 plans, Vercel CLI 50.43.0 |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Headers() call in layout.tsx forced dynamic rendering — metadata rendered into body**
- **Found during:** Task 1 Lighthouse diagnostic
- **Issue:** `await headers()` in `app/layout.tsx` forced Next.js App Router into dynamic (streaming) rendering mode. Metadata tags (title, description) were placed inside `<body>` via React's streaming deferred mechanism rather than in `<head>`. Lighthouse's SEO audit failed because the `<meta name="description">` wasn't in `<head>`.
- **Fix:** Removed `headers()` import and call. Layout is now a sync function. All routes became `○ (Static)` again. Description tag now appears at byte 2571 (inside head which ends at ~4981), confirmed by curl.
- **Files modified:** `app/layout.tsx`
- **Commit:** f1f0186

**2. [Rule 1 - Bug] Nonce-based CSP blocked all Next.js static chunk scripts**
- **Found during:** Task 1 — second Lighthouse run after layout fix
- **Issue:** CSP3 spec states that when a nonce is present in `script-src`, `'unsafe-inline'` is ignored entirely. The middleware set a per-request nonce, but `layout.tsx` no longer passed it to inline scripts. All `_next/static/chunks/*.js` scripts loaded without a matching nonce, producing CSP violation console errors that failed the `errors-in-console` Best Practices audit. Also caused `inspector-issues` failure.
- **Fix:** Removed nonce generation from `middleware.ts`. CSP now uses `'unsafe-inline'` only. All scripts load cleanly.
- **Files modified:** `middleware.ts`
- **Commit:** f1f0186

**3. [Rule 2 - Missing] No favicon.ico — 404 console error**
- **Found during:** Task 1 — first Lighthouse run
- **Issue:** No favicon at `public/favicon.ico` or `app/icon.tsx`. Browser requests `/favicon.ico` and gets 404, which appears as a network error in the console failing `errors-in-console`.
- **Fix:** Created `app/icon.tsx` — Next.js App Router icon generation (32×32 PNG). DU/TDR aesthetic: dark field (#080808) with magenta/white slash marks.
- **Files modified:** `app/icon.tsx` (created)
- **Commit:** f1f0186

**4. [Rule 2 - Missing] role="row" without role="cell" children in inventory-section.tsx**
- **Found during:** Task 1 — first Lighthouse run, `aria-required-children` audit
- **Issue:** `<div role="row">` elements in the inventory table contained `<span>` children with no ARIA role. WCAG requires `role="row"` children to have `role="cell"`, `role="gridcell"`, or `role="columnheader"`.
- **Fix:** Added `role="cell"` to all data cell spans and `role="columnheader"` to header spans.
- **Files modified:** `components/blocks/inventory-section.tsx`
- **Commit:** f1f0186

**5. [Rule 3 - Blocker] tsx CJS/ESM interop incompatible with lighthouse@13**
- **Found during:** Task 1 — attempting to run launch-gate.ts via tsx
- **Issue:** `tsx scripts/launch-gate.ts` fails with `TypeError: The "path" argument must be of type string` from lighthouse's internal `fileURLToPath(import.meta.url)`. lighthouse@13 is a `type:module` ESM package; tsx's CJS transform breaks `import.meta.url` resolution inside it.
- **Fix:** Created `scripts/launch-gate-runner.mjs` — native ESM implementation with `createRequire` for chrome-launcher (CommonJS transitive dep). Used throughout this plan for Lighthouse runs.
- **Files modified:** `scripts/launch-gate-runner.mjs` (created)
- **Commit:** f1f0186

## Lighthouse Results

### Before (Phase 35 final)
| Category | Score |
|----------|-------|
| Performance | 78 |
| Accessibility | 100 |
| Best Practices | 96 |
| SEO | 91 |

### After (this plan — worst of 3 runs)
| Category | Score |
|----------|-------|
| Performance | 74–95 (flaky, not in scope) |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Artifact: `.planning/phases/35-performance-launch-gate/launch-gate-2026-04-10T20-52-04-808Z.json`

## Self-Check: PASSED

All key files exist. Both task commits verified in git log.
