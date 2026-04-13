# Codebase Concerns

**Analysis Date:** 2026-04-12

## Priority Summary

1. **High:** Quality gates provide partial confidence because many tests validate source text patterns rather than runtime behavior.
2. **High:** Operational verification is manual/environment-coupled, with no repository CI workflow found.
3. **High:** Hook-safety lint rules are globally disabled for TS/TSX, increasing regression risk in animation-heavy code.
4. **Medium:** Large generated/static registries are concentrated regression hotspots with weak typing (`type: "any"` in docs metadata).
5. **Medium:** Global singleton and document-level effect patterns create fragile coupling across unrelated UI modules.

## Tech Debt

**Testing strategy skewed toward static source assertions (High):**
- Issue: Many Playwright specs read files via `readFileSync` and assert literal strings, which can pass while real UX behavior regresses.
- Files: `tests/phase-34-visual-language-subpage.spec.ts`, `tests/phase-35-homepage.spec.ts`, `tests/phase-40-04-api-docs.spec.ts`, `tests/phase-39-01-entry-points.spec.ts`.
- Impact: False positives in release gating; regressions in actual browser behavior can escape.
- Fix approach: Shift critical checks to DOM/runtime assertions; keep source-read checks only for explicit contract locks.

**Large generated/static data modules as single-point hotspots (Medium):**
- Issue: Massive files combine many unrelated concerns, making edits high blast-radius.
- Files: `lib/api-docs.ts` (~3946 lines), `lib/component-registry.ts` (~831 lines), `scripts/generate-api-docs.ts` (~633 lines).
- Impact: Small content updates can create large diffs and hard-to-review regressions.
- Fix approach: Split by domain/category and generate deterministic per-module artifacts.

## Known Bugs

**Brittle Lighthouse runner dependency path (High):**
- Symptoms: Lighthouse runner can fail after dependency updates even when app behavior is unchanged.
- Files: `scripts/launch-gate-runner.mjs`.
- Trigger: `chrome-launcher` version/path drift (script hardcodes `.pnpm/chrome-launcher@1.2.1/...`).
- Workaround: Use `scripts/launch-gate.ts` where possible, or resolve package path dynamically from package resolution instead of pinned filesystem path.

## Security Considerations

**Inline script + raw HTML rendering surfaces require strict trust boundaries (Medium):**
- Risk: XSS blast radius increases if script/html sources become tainted.
- Files: `app/layout.tsx` (inline theme script in `<head>`), `components/blocks/component-detail.tsx` (raw Shiki HTML rendering).
- Current mitigation: Comments document trusted sources; theme script is static literal.
- Recommendations: Enforce CSP nonce/hash strategy where feasible; add sanitizer/allowlist validation for rendered HTML payloads before injection.

## Performance Bottlenecks

**Page-level animation orchestration concentration (Medium):**
- Problem: High-density ScrollTrigger/querySelector orchestration in one module.
- Files: `components/layout/page-animations.tsx`, `components/layout/global-effects.tsx`.
- Cause: Many behaviors are coordinated in large lifecycle blocks with broad DOM queries and multiple listeners.
- Improvement path: Partition animation init by route/section and introduce narrower lifecycle boundaries to reduce cross-feature coupling.

## Fragile Areas

**Global singleton + global listeners across app lifetime (Medium):**
- Files: `lib/signal-canvas.tsx`, `hooks/use-signal-scene.ts`, `components/layout/global-effects.tsx`, `components/layout/lenis-provider.tsx`.
- Why fragile: Shared global state (`globalThis`) and document/window listeners can create hidden interdependencies between features.
- Safe modification: Treat singleton contracts as APIs; add/modify behavior behind focused helpers with explicit teardown paths.
- Test coverage: Runtime lifecycle teardown/cleanup behavior is not directly validated by dedicated tests.

**Hook dependency suppression in production code (High):**
- Files: `eslint.config.js`, `hooks/use-signal-scene.ts`, `components/blocks/component-detail.tsx`.
- Why fragile: Disabled `react-hooks` safety rules and local `exhaustive-deps` suppressions can hide stale closure defects.
- Safe modification: Re-enable targeted hook rules incrementally and refactor effects to stable callback patterns.
- Test coverage: No explicit stale-closure regression suite detected.

## Scaling Limits

**Execution pipeline does not scale to reliable automation (High):**
- Current capacity: Tests run with `workers: 1`, `fullyParallel: false`, `retries: 0`.
- Files: `playwright.config.ts`.
- Limit: Slow execution and low flake tolerance; local-environment dependence.
- Scaling path: Add CI workflows, introduce selective retries for flaky classes, and split smoke/extended suites.

## Dependencies at Risk

**Transitive dependency reliance in scripts (Medium):**
- Risk: Scripts depend on transitive module availability/details rather than declared direct dependencies.
- Files: `scripts/launch-gate.ts`, `scripts/launch-gate-runner.mjs`.
- Impact: Tooling breaks on package manager layout changes.
- Migration plan: Add explicit dependency and use package resolution APIs instead of hardcoded pnpm store paths.

## Missing Critical Features

**No repository CI workflow detected (High):**
- Problem: No `.github/workflows/*.yml` or `.yaml` found.
- Blocks: Consistent pre-merge verification across environments and contributors.

**No explicit production error telemetry integration detected (Medium):**
- Problem: Error boundary handles UI fallback but no monitoring/reporting hook.
- Files: `app/error.tsx`.
- Blocks: Fast detection and triage of runtime failures after deployment.

## Test Coverage Gaps

**Vitest scope excludes most runtime/UI modules (High):**
- What's not tested: `app/**`, `components/**`, and `hooks/**` in unit-test runner.
- Files: `vitest.config.ts` (includes only `lib/**/*.test.ts`, excludes `tests/**`).
- Risk: UI/hook regressions rely mainly on E2E and manual validation.
- Priority: High.

**Operational gates depend on local server preconditions (Medium):**
- What's not tested robustly: Self-contained E2E bootstrapping and hermetic gate execution.
- Files: `playwright.config.ts` (`webServer: undefined`), `tests/phase-37-lighthouse-gate.spec.ts` (requires running local production server).
- Risk: Inconsistent outcomes across machines and sessions.
- Priority: Medium.

---

*Concerns audit: 2026-04-12*
