# Testing Patterns

**Analysis Date:** 2026-04-12

## Test Framework

**Runner:**
- Vitest `^4.1.4` for unit tests (`package.json`, `vitest.config.ts`).
- Playwright `^1.59.1` for integration/E2E/spec-gate tests (`package.json`, `playwright.config.ts`).

**Assertion Library:**
- Vitest `expect` for unit tests (`lib/utils.test.ts`, `lib/nomenclature.test.ts`).
- Playwright `expect` (and `@axe-core/playwright` for accessibility checks) in `tests/*.spec.ts`.

**Run Commands:**
```bash
pnpm test                 # Run Vitest unit suite (lib/**/*.test.ts)
pnpm test:watch           # Run Vitest in watch mode
pnpm test:coverage        # Run Vitest with V8 coverage reports
pnpm exec playwright test # Run Playwright spec suite in tests/
```

## Test File Organization

**Location:**
- Unit tests are colocated with library modules under `lib/` and selected by `vitest.config.ts` (`include: ['lib/**/*.test.ts']`).
- Integration/E2E and quality gates live in top-level `tests/` and are selected by `playwright.config.ts` (`testDir: './tests'`).

**Naming:**
- Unit tests: `*.test.ts` (examples: `lib/system-stats.test.ts`, `lib/thesis-manifesto.test.ts`).
- Playwright tests: phase-scoped `phase-XX-*.spec.ts` (examples: `tests/phase-37-lighthouse-gate.spec.ts`, `tests/phase-38-a11y.spec.ts`).

**Structure:**
```
lib/*.test.ts             # Vitest unit tests
tests/phase-*.spec.ts     # Playwright integration/E2E + quality gates
```

## Test Structure

**Suite Organization:**
```typescript
describe('cn()', () => {
  it('deduplicates conflicting Tailwind utilities (last wins)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });
});

test.describe("@phase38 WCAG AA accessibility audit", () => {
  test("WCAG AA: /", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });
});
```

**Patterns:**
- Unit tests are deterministic and function-level (`lib/utils.test.ts`, `lib/nomenclature.test.ts`).
- Playwright tests are requirement/phase-oriented with explicit scenario naming (`tests/phase-35-homepage.spec.ts`).
- Specs include rich inline rationale for behavior locks and known exceptions (`tests/phase-38-a11y.spec.ts`, `tests/phase-37-lighthouse-gate.spec.ts`).

## Mocking

**Framework:** No dedicated mocking library detected beyond built-in test framework utilities.

**Patterns:**
```typescript
// File/source assertion pattern (no runtime mock server)
const homeSrc = readFileSync(join(process.cwd(), "app/page.tsx"), "utf-8");
expect(homeSrc).toContain("GhostLabel");

// Subprocess isolation for external tooling
const result = spawnSync("node", [RUNNER_PATH, "--url", TARGET_URL], { cwd: PROJECT_ROOT });
expect(result.status).toBe(0);
```

**What to Mock:**
- Prefer deterministic source-read assertions and subprocess boundaries for audit/gate checks (`tests/phase-35-homepage.spec.ts`, `tests/phase-37-lighthouse-gate.spec.ts`).

**What NOT to Mock:**
- Route hydration, browser behavior, and accessibility tree are validated against real page runtime in Playwright (`tests/phase-38-a11y.spec.ts`, `tests/phase-38-reduced-motion.spec.ts`).

## Fixtures and Factories

**Test Data:**
```typescript
const VIEWPORTS = [
  { width: 1440, height: 900, name: "desktop" },
  { width: 768, height: 1024, name: "tablet" },
  { width: 375, height: 667, name: "mobile" },
] as const;
```

**Location:**
- In-file constants and arrays are preferred over shared fixture directories (`tests/phase-35-homepage.spec.ts`, `tests/phase-38-a11y.spec.ts`).

## Coverage

**Requirements:** 
- Coverage generation is configured, but no enforced threshold is defined in `vitest.config.ts`.
- Unit coverage scope is `lib/**` with explicit exclusions for selected files in `vitest.config.ts`.

**View Coverage:**
```bash
pnpm test:coverage
```

## Test Types

**Unit Tests:**
- Scope: utility and domain logic in `lib/`.
- Approach: direct function assertions with minimal setup (`lib/utils.test.ts`, `lib/nomenclature.test.ts`).

**Integration Tests:**
- Scope: route behavior, accessibility, metadata, performance gates, and library entry consistency in `tests/phase-*.spec.ts`.
- Approach: browser-driven flows plus file-content contract assertions (`tests/phase-35-homepage.spec.ts`, `tests/phase-39-01-entry-points.spec.ts`).

**E2E Tests:**
- Framework: Playwright (`playwright.config.ts`).
- Execution model: single worker, no retries, Chromium project, headless defaults.

## Test Entry Points

- `pnpm test` -> `vitest run` (`package.json`).
- `pnpm test:watch` -> `vitest` (`package.json`).
- `pnpm test:coverage` -> `vitest run --coverage` (`package.json`).
- `pnpm exec playwright test` -> specs in `tests/` via `playwright.config.ts`.

## CI / Workflow Signals

- No repository CI workflow files detected under `.github/workflows/`.
- Local quality gate exists in `.husky/pre-commit`: `pnpm lint-staged` and `pnpm tsc --noEmit`.
- Playwright config assumes an externally running app (`webServer: undefined`, `baseURL: "http://localhost:3000"` in `playwright.config.ts`).

## Common Patterns

**Async Testing:**
```typescript
await page.goto(route, { waitUntil: "networkidle" });
const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
expect(results.violations).toHaveLength(0);
```

**Error Testing:**
```typescript
if (!serverReachable) {
  throw new Error("production server not reachable at http://localhost:3000");
}
expect(result.status).toBe(0);
```

---

*Testing analysis: 2026-04-12*
