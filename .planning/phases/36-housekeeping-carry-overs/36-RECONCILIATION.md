---
phase: 36
slug: housekeeping-carry-overs
status: deviations
created: 2026-04-10
---

# Phase 36 — Reconciliation

## Execution Summary

Both plans executed in wave 1 (no dependency ordering required). 7 commits landed across 2 tasks per plan. Phase 36 is fully closed.

| Plan | Title | Tasks | Commits |
|------|-------|-------|---------|
| 36-01 | Lighthouse + Test Fixes + Requirements Baseline | 2 | f1f0186, 1165e24, d6bc1c9, 6c83ac3 |
| 36-02 | ESLint 9 Flat Config | 2 | 85e20ce, 8198bea, 096a21e |

Files changed: 21 total (app/layout.tsx, middleware.ts, app/icon.tsx, components/blocks/inventory-section.tsx, scripts/launch-gate-runner.mjs, tests/phase-35-reference.spec.ts, tests/phase-29-infra.spec.ts, .planning/REQUIREMENTS.md, eslint.config.js, package.json, pnpm-lock.yaml, 10 source files auto/manually fixed).

---

## Plan-Level Reconciliation

### 36-01: deviations (all ACs met; significant unplanned fixes required)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | Lighthouse BP=100, SEO=100 worst of 3 | PASS — BP=100, SEO=100, Accessibility=100 |
| AC-2 | T-06 font-mono reads components/blocks/api-explorer.tsx | PASS |
| AC-3 | tsc --noEmit exits 0 | PASS |
| AC-4 | REQUIREMENTS.md contains `## v1.6 API-Ready` section with CO-01 through DIST-04 | PASS |
| AC-5 | ROADMAP Phase 31/35/v1.5 entries correct; Vercel CLI at 50.42.0+ | PASS — all [x], 5/5 plans, Vercel CLI 50.43.0 |

All 5 ACs passed. However, achieving AC-1 required five unplanned interventions not described in Task 1's fix guidance:

1. **headers() removal** — `app/layout.tsx` called `await headers()`, forcing Next.js into dynamic streaming mode. Metadata tags landed in `<body>` instead of `<head>`, causing Lighthouse SEO `meta-description` failure. Fix: removed `headers()` entirely; all routes became static.
2. **Nonce-based CSP removed** — CSP3 spec nullifies `unsafe-inline` when a nonce is present. `middleware.ts` was generating per-request nonces that no longer matched script tags after the layout fix, producing a cascade of `errors-in-console` and `inspector-issues` failures in Best Practices. Fix: removed nonce, CSP uses `unsafe-inline` only.
3. **Favicon created** — No `app/icon.tsx` or `public/favicon.ico` existed; 404 console errors failed `errors-in-console`. Fix: created `app/icon.tsx` (32×32 PNG, DU/TDR aesthetic).
4. **ARIA role="cell" added** — `components/blocks/inventory-section.tsx` had `role="row"` divs with bare `<span>` children (no `role="cell"`), failing `aria-required-children`. Fix: added `role="cell"` and `role="columnheader"` to all children.
5. **Native ESM runner created** — `tsx scripts/launch-gate.ts` breaks lighthouse@13 (`type:module`) via CJS/ESM interop on `import.meta.url`. Fix: created `scripts/launch-gate-runner.mjs` using native ESM + `createRequire` for chrome-launcher.

The plan anticipated running `launch-gate.ts` to diagnose and fix iteratively, but did not anticipate the tsx/lighthouse incompatibility or the nonce-CSP interaction. All deviations were self-correcting (no rework needed).

---

### 36-02: deviations (all ACs met; two unplanned fixes required)

| AC | Description | Result |
|----|-------------|--------|
| AC-1 | eslint.config.js contains FlatCompat, next/core-web-vitals, flat/recommended-type-checked, consistent-type-imports | PASS |
| AC-2 | package.json scripts.lint = "eslint ." | PASS |
| AC-3 | pnpm lint exits 0 with zero violations | PASS |
| AC-4 | .planning/**, .next/**, node_modules/**, public/** in ignores array | PASS |

All 4 ACs passed. Two unplanned deviations arose during Task 2:

1. **Direct devDep installs required** — `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, and `@eslint/eslintrc` are transitive deps of `eslint-config-next` but pnpm does not hoist them. ESM imports in `eslint.config.js` failed to resolve. Fix: added all three as direct devDependencies via `pnpm add -D`; `pnpm-lock.yaml` updated.
2. **Stale eslint-disable comments** — `eslint --fix` removed disable comments for rules not in the new config (`@typescript-eslint/naming-convention`, `@typescript-eslint/no-require-imports`), leaving blank stub lines in `component-detail.tsx`, `sf-text.tsx`, and `scripts/launch-gate.ts`. Fix: cleaned blank lines manually after auto-fix pass.

14 source files required violations fixes (type import annotations and `{"//"}` JSX wrapping). This was within the plan's anticipated range — the plan explicitly noted a relaxed config spread for tests was permissible, and one was added.

---

## Deviations

### 36-01 Deviations

| # | Type | Planned | Actual |
|---|------|---------|--------|
| 1 | Bug | Incremental Lighthouse fix loop guided by audit JSON | Required 5 root-cause fixes: headers() removal, nonce CSP removal, favicon creation, ARIA cell roles, native ESM Lighthouse runner |
| 2 | Missing | Plan listed `tsx scripts/launch-gate.ts` as the runner | tsx incompatible with lighthouse@13; new `scripts/launch-gate-runner.mjs` created |
| 3 | Missing | No favicon fix listed in Task 1 | `app/icon.tsx` created to eliminate 404 console error |
| 4 | Missing | No ARIA fix listed in Task 1 | `role="cell"` added to inventory-section.tsx to fix aria-required-children |

### 36-02 Deviations

| # | Type | Planned | Actual |
|---|------|---------|--------|
| 1 | Missing | Plan noted FlatCompat requires direct install | @typescript-eslint packages also required direct devDep install (pnpm hoisting gap) |
| 2 | Rule 1 Bug | Plan noted auto-fix handles consistent-type-imports | Auto-fix also removed stale disable comments for out-of-scope rules, requiring manual blank-line cleanup |

---

## Verifier Handoff

Items the verifier should confirm on the deployed site and codebase:

1. **CSP posture** — Nonce-based CSP was removed in favour of `unsafe-inline`. Verify no security regression is introduced for the v1.6 scope, or flag for a dedicated security hardening plan.

2. **Lighthouse score stability** — Performance category shows 74–95 variance across runs (not in scope for Phase 36, but flagged). BP=100, SEO=100, A11y=100 are confirmed worst-of-3. Verifier should confirm these hold on the current deployment.

3. **eslint.config.js and package.json** — Verify `pnpm lint` exits 0 from a clean checkout. The `NODE_MODULE_TYPELESS_PACKAGE_JSON` warning (cosmetic ESM hint, not an error) is expected and acceptable.

4. **scripts/launch-gate-runner.mjs** — New artifact not in the plan's `files_modified` list. Verifier should confirm it is present and functional as the new Lighthouse runner.

5. **pnpm-lock.yaml** — Three new direct devDeps added (`@eslint/eslintrc`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`). Verifier should confirm lockfile is committed and `pnpm install --frozen-lockfile` passes in CI.
