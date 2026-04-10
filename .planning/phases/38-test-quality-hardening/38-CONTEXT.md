# Phase 38: Test & Quality Hardening - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Comprehensive automated quality gates — unit tests (Vitest), accessibility automation (axe-core in Playwright), prefers-reduced-motion coverage, and developer workflow hooks (pre-commit). This phase adds test infrastructure and CI-blocking gates, not new features.

</domain>

<decisions>
## Implementation Decisions

### Vitest Setup
- Install Vitest with jsdom environment for React component utility testing
- Target: utility functions and pure logic in `lib/` (color-resolve, nomenclature, utils, system-stats, component-registry, etc.)
- SF components are React/GSAP-heavy — visual/interaction behavior stays in Playwright E2E
- Coverage reporting enabled (v8 provider) but no hard coverage threshold initially — track but don't gate
- Test files colocated as `*.test.ts` alongside source, or in a `__tests__/` within `lib/`
- Add `"test"` and `"test:coverage"` scripts to package.json

### axe-core Integration
- Install `@axe-core/playwright` — native Playwright integration, no extra runner
- Wire into existing Playwright test suite as a dedicated a11y spec file
- Audit all 5 routes: `/`, `/inventory`, `/system`, `/init`, `/reference`
- Assertion: fail on any WCAG AA violation (critical + serious), warn on AAA-only issues
- Run axe after page load + hydration complete (wait for network idle)
- Test both default theme and dark/light toggle states if applicable

### prefers-reduced-motion Testing
- Use Playwright `page.emulateMedia({ reducedMotion: 'reduce' })` to simulate the preference
- Verify GSAP timelines are killed/paused — check that `gsap.globalTimeline.timeScale()` behavior respects the query
- Cover all animation entry points: ScrollTrigger sections, GSAP stagger animations (SFAccordion, SFToast), hero shader, SignalMesh
- Dedicated Playwright spec file for reduced-motion assertions
- Visual assertions: ensure content is visible/positioned without animation (no blank/offscreen elements)

### Pre-commit Hooks
- Use husky + lint-staged (most widely used, stable)
- Pre-commit runs: `pnpm lint` (ESLint) + `tsc --noEmit` (TypeScript type check) on staged files
- lint-staged config in package.json targeting `*.{ts,tsx}` files
- Blocked commits must fail visibly with clear error output
- Add `"prepare": "husky"` script for automatic setup on `pnpm install`

### TypeScript Strict Verification
- Strict mode already enabled in tsconfig.json — verify `tsc --noEmit` passes clean (0 errors including test files)
- Fix any errors surfaced by adding Vitest test files to the compilation scope
- Ensure vitest types don't conflict with Playwright types (separate tsconfig for tests if needed)

### Claude's Discretion
- Vitest config details (globals, setup files, path aliases)
- Exact axe-core rule configuration (which AA rules to include/exclude)
- lint-staged glob patterns and ordering
- Whether to create a separate tsconfig.test.json or extend the main one
- Specific utility functions to prioritize for initial unit test coverage

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Dependencies
- `.planning/phases/36-housekeeping-carry-overs/36-CONTEXT.md` — ESLint config decisions (flat config, strict + style rules)
- `.planning/phases/37-next-js-16-migration/37-CONTEXT.md` — Next.js 16 migration context, proxy.ts rename

### Current Test Infrastructure
- `playwright.config.ts` — Existing Playwright configuration (19 E2E spec files in `tests/`)
- `tsconfig.json` — TypeScript strict mode already enabled, `noEmit: true`
- `package.json` — Current scripts (`lint`, `dev`, `build`), devDependencies (Playwright, ESLint, TypeScript)

### Component Architecture
- `components/sf/index.ts` — SF component barrel export (49 components)
- `lib/` — 22 utility modules (color-resolve, nomenclature, utils, component-registry, etc.)

### Quality Baseline
- `.planning/phases/36-housekeeping-carry-overs/36-CONTEXT.md` — ESLint error-level from day 1, `pnpm lint` passes clean

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `playwright.config.ts` — existing Playwright setup, can extend for axe-core and reduced-motion specs
- `tests/` — 19 E2E specs following `phase-NN-*.spec.ts` naming convention
- `eslint.config.js` — ESLint 9 flat config (Phase 36) — lint-staged can invoke `pnpm lint`
- `lib/utils.ts` — cn() utility, prime candidate for first Vitest unit test

### Established Patterns
- E2E tests organized by phase: `phase-35-homepage.spec.ts`, `phase-35-system.spec.ts`, etc.
- No unit test infrastructure exists — Vitest will be net-new
- No pre-commit hooks — husky will be net-new
- TypeScript strict mode already on, `tsc --noEmit` should pass (fixed in Phase 36)

### Integration Points
- `package.json` scripts — add `test`, `test:coverage`, `prepare` scripts
- `.husky/pre-commit` — new file for git hook
- `lib/gsap-core.ts` — GSAP initialization, likely where reduced-motion logic lives
- `lib/signalframe-provider.tsx` — provider component, may handle reduced-motion at app level

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 38-test-quality-hardening*
*Context gathered: 2026-04-10*
