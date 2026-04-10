# Phase 38: Test & Quality Hardening - Research

**Researched:** 2026-04-10
**Domain:** Vitest unit testing, axe-core Playwright accessibility, husky/lint-staged pre-commit hooks
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Vitest Setup**
- Install Vitest with jsdom environment for React component utility testing
- Target: utility functions and pure logic in `lib/` (color-resolve, nomenclature, utils, system-stats, component-registry, etc.)
- SF components are React/GSAP-heavy — visual/interaction behavior stays in Playwright E2E
- Coverage reporting enabled (v8 provider) but no hard coverage threshold initially — track but don't gate
- Test files colocated as `*.test.ts` alongside source, or in a `__tests__/` within `lib/`
- Add `"test"` and `"test:coverage"` scripts to package.json

**axe-core Integration**
- Install `@axe-core/playwright` — native Playwright integration, no extra runner
- Wire into existing Playwright test suite as a dedicated a11y spec file
- Audit all 5 routes: `/`, `/inventory`, `/system`, `/init`, `/reference`
- Assertion: fail on any WCAG AA violation (critical + serious), warn on AAA-only issues
- Run axe after page load + hydration complete (wait for network idle)
- Test both default theme and dark/light toggle states if applicable

**prefers-reduced-motion Testing**
- Use Playwright `page.emulateMedia({ reducedMotion: 'reduce' })` to simulate the preference
- Verify GSAP timelines are killed/paused — check that `gsap.globalTimeline.timeScale()` behavior respects the query
- Cover all animation entry points: ScrollTrigger sections, GSAP stagger animations (SFAccordion, SFToast), hero shader, SignalMesh
- Dedicated Playwright spec file for reduced-motion assertions
- Visual assertions: ensure content is visible/positioned without animation (no blank/offscreen elements)

**Pre-commit Hooks**
- Use husky + lint-staged (most widely used, stable)
- Pre-commit runs: `pnpm lint` (ESLint) + `tsc --noEmit` (TypeScript type check) on staged files
- lint-staged config in package.json targeting `*.{ts,tsx}` files
- Blocked commits must fail visibly with clear error output
- Add `"prepare": "husky"` script for automatic setup on `pnpm install`

**TypeScript Strict Verification**
- Strict mode already enabled in tsconfig.json — verify `tsc --noEmit` passes clean (0 errors including test files)
- Fix any errors surfaced by adding Vitest test files to the compilation scope
- Ensure vitest types don't conflict with Playwright types (separate tsconfig for tests if needed)

### Claude's Discretion
- Vitest config details (globals, setup files, path aliases)
- Exact axe-core rule configuration (which AA rules to include/exclude)
- lint-staged glob patterns and ordering
- Whether to create a separate tsconfig.test.json or extend the main one
- Specific utility functions to prioritize for initial unit test coverage

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| QA-01 | Vitest configured with coverage; SF component utility functions have unit tests | Vitest 4.1.4 + @vitest/coverage-v8 4.1.4 confirmed available; jsdom install pattern documented; testable lib/ functions identified |
| QA-02 | axe-core integrated into Playwright suite — every route passes WCAG AA audit | @axe-core/playwright 4.11.1 confirmed; AxeBuilder API with withTags(['wcag2a','wcag2aa']) documented; page.emulateMedia for reduced-motion documented |
| QA-03 | Pre-commit hooks run `pnpm lint` + `tsc --noEmit`; blocked commits fail visibly | husky 9.1.7 + lint-staged 16.4.0 confirmed; setup pattern with `prepare` script documented |
</phase_requirements>

---

## Summary

Phase 38 installs three net-new quality infrastructure layers on top of the existing Next.js 16 / Playwright stack: Vitest for unit testing pure `lib/` utilities, axe-core/playwright for WCAG AA accessibility audits across all 5 routes, and husky + lint-staged for pre-commit enforcement of lint + type-check.

The existing project has no unit test infrastructure (Vitest is net-new), no pre-commit hooks (husky is net-new), and no accessibility automation (axe-core/playwright is net-new). All three are additive — nothing is removed or modified except `package.json` scripts and tsconfig scope. The current `tsc --noEmit` baseline must be confirmed clean (Phase 36 asserts it was fixed) before Vitest test files are added to the compilation scope.

The reduced-motion Playwright spec is a natural extension of the existing E2E suite (19 spec files in `tests/`). The critical insight here is that `signalframe-provider.tsx` already implements `gsap.globalTimeline.timeScale(0)` when `prefers-reduced-motion: reduce` is detected — the Playwright test must verify this runtime behavior fires, not just re-test the code. Use `page.emulateMedia({ reducedMotion: 'reduce' })` before navigation to put the media query in the reduced state before hydration.

**Primary recommendation:** Install all packages in one pass (`pnpm add -D vitest @vitest/coverage-v8 jsdom @axe-core/playwright husky lint-staged`), configure in sequence (Vitest → axe-core → husky), then add test files.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | 4.1.4 | Unit test runner for lib/ utilities | Vite-native, zero config for TS projects, fastest watch mode |
| @vitest/coverage-v8 | 4.1.4 | V8-based coverage reporting | No instrumentation step, ships with vitest ecosystem |
| jsdom | latest | DOM environment for jsdom-dependent tests | Required peer dep when `environment: 'jsdom'` is set |
| @axe-core/playwright | 4.11.1 | WCAG accessibility audits inside Playwright | Native Playwright integration, wraps axe-core 4.11.x |
| husky | 9.1.7 | Git hook management | Simplest modern hook setup, no shell script boilerplate |
| lint-staged | 16.4.0 | Run linters only on staged files | Prevents full-repo lint on every commit, fast |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vitest/ui | 4.1.4 | Visual test browser UI | Optional, useful during development; not required for CI |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vitest | jest | Jest has slower startup, lacks Vite integration; Vitest is the standard for Vite/Next projects |
| @axe-core/playwright | @axe-core/react | React-specific, requires mounting components; Playwright version tests real rendered pages |
| husky + lint-staged | simple-git-hooks | simple-git-hooks is lighter but less ecosystem support; husky is the universal choice |

**Installation:**
```bash
pnpm add -D vitest @vitest/coverage-v8 jsdom @axe-core/playwright husky lint-staged
```

---

## Architecture Patterns

### Recommended Project Structure

```
signalframeux/
├── lib/
│   ├── utils.ts
│   ├── utils.test.ts            # colocated unit test
│   ├── nomenclature.ts
│   ├── nomenclature.test.ts     # colocated unit test
│   ├── color-resolve.ts         # browser-only (canvas probe) — no unit test
│   └── ...
├── tests/
│   ├── phase-38-a11y.spec.ts    # axe-core WCAG AA audit (all 5 routes)
│   ├── phase-38-reduced-motion.spec.ts  # prefers-reduced-motion assertions
│   └── ...existing specs...
├── .husky/
│   └── pre-commit               # pnpm lint && tsc --noEmit
├── vitest.config.ts             # Vitest configuration
└── tsconfig.test.json           # extends tsconfig.json, adds vitest types
```

### Pattern 1: Vitest Configuration

**What:** `vitest.config.ts` at project root, extending with path alias and jsdom environment
**When to use:** All Vitest configuration lives here (not in vite.config.ts — this project has no vite.config.ts)

```typescript
// vitest.config.ts
// Source: https://vitest.dev/config/
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    alias: {
      '@': resolve(__dirname, '.'),
    },
    include: ['lib/**/*.test.ts', 'lib/**/__tests__/**/*.ts'],
    exclude: ['node_modules', '.next', 'tests/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['lib/**'],
      exclude: ['lib/**/*.test.ts', 'lib/gsap-*.ts', 'lib/signal-canvas.tsx'],
    },
  },
});
```

### Pattern 2: TypeScript Config for Vitest

**What:** Separate `tsconfig.test.json` that extends base and adds Vitest types without conflicting with Playwright types
**When to use:** When the base tsconfig includes Playwright types (`@playwright/test`), which declares `test` globally — this conflicts with Vitest's `test` global if both are in scope simultaneously

```json
// tsconfig.test.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["vitest/globals"]
  },
  "include": ["lib/**/*.ts", "lib/**/*.tsx", "vitest.config.ts"],
  "exclude": ["node_modules", ".next", "tests"]
}
```

Then reference in `vitest.config.ts`:
```typescript
// Add to defineConfig test block:
typecheck: {
  tsconfig: './tsconfig.test.json',
},
```

### Pattern 3: axe-core/playwright WCAG AA Spec

**What:** Dedicated Playwright spec that loads each route and runs AxeBuilder with WCAG AA tags
**When to use:** Must run against a live server (`pnpm build && pnpm start` or `pnpm dev`)

```typescript
// tests/phase-38-a11y.spec.ts
// Source: https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/inventory', '/system', '/init', '/reference'];

for (const route of ROUTES) {
  test(`@a11y WCAG AA: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    // Fail on critical + serious violations (AA gate)
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(
      blocking,
      `WCAG AA violations on ${route}:\n${blocking.map((v) => `  [${v.impact}] ${v.id}: ${v.description}`).join('\n')}`
    ).toHaveLength(0);
  });
}
```

### Pattern 4: prefers-reduced-motion Playwright Spec

**What:** Emulate reduced-motion media query before navigation; verify GSAP globalTimeline timeScale is 0
**When to use:** Must use `page.emulateMedia` BEFORE `page.goto` so the media query is active during hydration

```typescript
// tests/phase-38-reduced-motion.spec.ts
import { test, expect } from '@playwright/test';

const ANIMATED_ROUTES = ['/', '/inventory', '/system', '/init', '/reference'];

for (const route of ANIMATED_ROUTES) {
  test(`@reduced-motion content visible on ${route}`, async ({ page }) => {
    // Set BEFORE navigation — media query must be active during hydration
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route, { waitUntil: 'networkidle' });

    // Verify GSAP global timeline is paused (timeScale === 0)
    const timeScale = await page.evaluate(() => {
      // @ts-ignore — gsap is attached to window in client context
      return typeof window.gsap !== 'undefined'
        ? window.gsap.globalTimeline.timeScale()
        : null;
    });
    // timeScale 0 means reduced motion is respected
    if (timeScale !== null) {
      expect(timeScale).toBe(0);
    }

    // Visual: no element should be offscreen due to animation start states
    // Hero heading must be visible (opacity: 0.01 rule from Phase 30)
    if (route === '/') {
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
      const box = await heading.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
    }
  });
}
```

### Pattern 5: husky + lint-staged Setup

**What:** Automated pre-commit hook that blocks commits with lint or type errors
**When to use:** Run once during setup; auto-runs on every subsequent `git commit`

```bash
# One-time setup after installing husky:
pnpm exec husky init
```

```sh
# .husky/pre-commit
pnpm lint-staged
```

```json
// package.json additions
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --max-warnings=0",
      "bash -c 'tsc --noEmit'"
    ]
  }
}
```

**Important:** `tsc --noEmit` in lint-staged runs the full project type-check (not file-scoped). This is correct behavior — TypeScript type checking is inherently cross-file and cannot be safely scoped to staged files alone. The cost is ~2-5 seconds per commit, which is acceptable.

### Anti-Patterns to Avoid

- **`tsc --noEmit` on individual files in lint-staged:** TypeScript checks depend on the full type graph. Running `tsc file.ts` in isolation silently skips cross-file type errors. Always run `tsc --noEmit` without file arguments.
- **`page.emulateMedia` AFTER `page.goto`:** The reduced-motion signal must be present during React hydration, not applied post-load. Hydration fires synchronously on mount — by the time you call emulateMedia post-navigation, GSAP is already initialized.
- **Testing GSAP effects on DOM elements with axe-core:** axe-core tests the accessibility tree, not visual state. Run axe AFTER `networkidle` to ensure hydration is complete and ARIA attributes are set.
- **globals: true in vitest.config.ts without tsconfig update:** When `globals: true`, Vitest injects `test`, `describe`, `expect` globally. Without `"types": ["vitest/globals"]` in a separate tsconfig, TypeScript will report "Cannot find name 'test'" in test files.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| WCAG AA page auditing | Custom axe-core wrapper | `@axe-core/playwright` | AxeBuilder handles injection, serialization, and results parsing; rule sets are versioned |
| Git pre-commit filtering | Shell scripts parsing `git diff --cached` | `lint-staged` | Staged-file filtering has edge cases (partial staging, renames, deletes); lint-staged handles all of them |
| GSAP window typing in Playwright | Redeclare `window.gsap` types | `// @ts-ignore` with inline comment | Playwright's `page.evaluate` runs in the browser context, not the TypeScript project; the type is unavailable |
| Coverage threshold enforcement | CI script that parses coverage JSON | `vitest --coverage --coverage.thresholds.*` | Built-in Vitest feature; don't re-invent it (though no hard threshold is required for QA-01) |

**Key insight:** axe-core's rule set (WCAG 2.0 A/AA) represents years of accessibility research codified into 90+ automated checks. Custom page-level accessibility checks will always be incomplete and stale relative to axe-core's maintained rule library.

---

## Common Pitfalls

### Pitfall 1: Vitest / Playwright globals collision

**What goes wrong:** Both Vitest (with `globals: true`) and Playwright declare a `test` global. If `tests/` directory is included in tsconfig scope AND vitest types are also in scope, TypeScript reports type conflicts on `test`.

**Why it happens:** The base `tsconfig.json` includes `**/*.ts` which captures both `tests/*.spec.ts` (Playwright) and `lib/*.test.ts` (Vitest). Both define global `test()` with different signatures.

**How to avoid:** Use `tsconfig.test.json` that explicitly excludes `tests/` and adds `"types": ["vitest/globals"]`. Keep the base `tsconfig.json` for Next.js compilation (which includes Playwright types via `@playwright/test` in devDeps).

**Warning signs:** TypeScript errors like "Duplicate identifier 'test'" or "Type 'TestFunction' is not assignable to type 'TestFunction'".

### Pitfall 2: axe-core false negatives on unhydrated content

**What goes wrong:** axe-core reports zero violations on a route that actually has violations, because it ran before React hydrated the full DOM.

**Why it happens:** Using `waitUntil: 'domcontentloaded'` (the existing Playwright pattern in this project) captures the shell HTML before client components mount. Server-rendered content may be minimal.

**How to avoid:** Use `waitUntil: 'networkidle'` for the a11y spec specifically. This waits for all async data fetching and hydration to settle. This is slower than other specs but appropriate for accessibility auditing.

**Warning signs:** axe-core reports no violations on a page with client-only content; ARIA attributes appear to be missing.

### Pitfall 3: GSAP not exposed on window in Playwright evaluate

**What goes wrong:** `page.evaluate(() => window.gsap)` returns `undefined` even though GSAP is running on the page.

**Why it happens:** Next.js bundles GSAP as a module — it is NOT attached to `window.gsap` by default. The `gsap-core.ts` module exports `gsap` but does not assign it to window.

**How to avoid:** Test the reduced-motion behavior indirectly — check for presence/absence of animated states on DOM elements (CSS transforms, opacity, visibility) rather than inspecting `window.gsap` directly. Alternatively, verify that `data-motion-reduced` or similar attribute is set by the provider.

**Better approach for reduced-motion verification:**
```typescript
// Check that SignalframeProvider sets prefersReduced = true
// by verifying gsap.globalTimeline behavior indirectly through DOM state
const bodyMotion = await page.evaluate(() =>
  document.body.getAttribute('data-reduced-motion')
);
```
OR: check that hero heading is positioned at final state (not hidden at opacity 0.01 starting position) since animations don't run.

**Warning signs:** `page.evaluate(() => window.gsap)` returns `undefined`; timeScale check always returns `null`.

### Pitfall 4: lint-staged tsc check is slow / times out

**What goes wrong:** `tsc --noEmit` takes 10+ seconds on first run after cache invalidation, causing pre-commit hook timeouts.

**Why it happens:** TypeScript's incremental compile cache (`tsconfig.tsbuildinfo`) is project-level, but lint-staged runs in a fresh context. Cold starts on large projects with no cache can be slow.

**How to avoid:** The project already has `"incremental": true` in tsconfig.json and a `tsconfig.tsbuildinfo` file at root. This cache persists between hook runs. Cold start only happens once per fresh checkout. Acceptable tradeoff given the benefit of blocking bad commits.

**Warning signs:** Pre-commit hook takes >15 seconds; developers bypass with `git commit --no-verify`.

### Pitfall 5: Vitest tries to run `lib/gsap-core.ts` tests in jsdom

**What goes wrong:** Vitest picks up non-test files or GSAP-dependent files that import from `"use client"` modules, causing import errors in jsdom.

**Why it happens:** GSAP's `ScrollTrigger` and `Observer` are browser-only. Under jsdom they may throw or fail to import.

**How to avoid:** The `coverage.exclude` in vitest.config.ts should exclude GSAP utility modules. Write unit tests only for pure logic modules (`utils.ts`, `nomenclature.ts`, `component-registry.ts`, `system-stats.ts`, `thesis-manifesto.ts`). Do NOT write Vitest unit tests for `color-resolve.ts` (requires real canvas), `gsap-core.ts`, `gsap-*.ts`, or `signal-canvas.tsx`.

---

## Code Examples

Verified patterns from official sources:

### Vitest unit test for cn() utility

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates conflicting Tailwind classes (tailwind-merge)', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('handles falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });
});
```

### Vitest unit test for nomenclature assignCodes()

```typescript
// lib/nomenclature.test.ts
import { describe, it, expect } from 'vitest';
import { assignCodes, CATEGORY_CODE, CATEGORY_ORDER } from './nomenclature';

describe('assignCodes()', () => {
  it('assigns deterministic SF// codes', () => {
    const entries = [
      { category: 'FORMS', name: 'BUTTON' },
      { category: 'FORMS', name: 'INPUT' },
      { category: 'LAYOUT', name: 'CARD' },
    ];
    const coded = assignCodes(entries);
    expect(coded[0].sfCode).toBe('SF//FRM-001');
    expect(coded[1].sfCode).toBe('SF//FRM-002');
    expect(coded[2].sfCode).toBe('SF//LAY-001');
  });

  it('sorts by CATEGORY_ORDER before assigning codes', () => {
    const entries = [
      { category: 'LAYOUT', name: 'SECTION' },
      { category: 'FORMS', name: 'BUTTON' },
    ];
    const coded = assignCodes(entries);
    // FORMS comes before LAYOUT in CATEGORY_ORDER
    expect(coded[0].sfCode).toContain('FRM');
    expect(coded[1].sfCode).toContain('LAY');
  });

  it('uses UNK for unknown categories', () => {
    const entries = [{ category: 'UNKNOWN_CAT', name: 'THING' }];
    const coded = assignCodes(entries);
    expect(coded[0].sfCode).toBe('SF//UNK-001');
  });
});
```

### axe-core full WCAG AA spec structure (Source: @axe-core/playwright README)

```typescript
// tests/phase-38-a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('@phase38 WCAG AA accessibility audit', () => {
  const ROUTES = ['/', '/inventory', '/system', '/init', '/reference'];

  for (const route of ROUTES) {
    test(`WCAG AA: ${route}`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' });

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      expect(blocking, `Violations on ${route}:\n` +
        blocking.map(v => `  [${v.impact}] ${v.id}: ${v.description}\n` +
          v.nodes.slice(0, 2).map(n => `    HTML: ${n.html}`).join('\n')
        ).join('\n')
      ).toHaveLength(0);
    });
  }
});
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| husky v4 (`"husky": { "hooks": {} }` in package.json) | husky v9 (`pnpm exec husky init`, `.husky/pre-commit` shell file) | husky v5+ | Different config format — v4 config inside package.json does NOT work in v9 |
| `@testing-library/jest-dom` + jest | Vitest with `@vitest/coverage-v8` | Vitest 1.0+ (2023) | No babel transform needed; native ESM support |
| `axe-playwright` (community package) | `@axe-core/playwright` (official Deque package) | 2021 | Official package is maintained by Deque; `axe-playwright` is deprecated |
| lint-staged config in `.lintstagedrc` | lint-staged config in `package.json` `"lint-staged"` key | lint-staged 10+ | Both formats still work; package.json key is the recommended default |

**Deprecated/outdated:**
- `axe-playwright` npm package: Deprecated; use `@axe-core/playwright` (official Deque)
- husky v4 config format (`"husky": {"hooks": {}}` in package.json): Does not work with husky v9
- Vitest `setupFilesAfterFramework`: Renamed to `setupFiles` in Vitest 1.0+

---

## Open Questions

1. **GSAP window exposure for timeScale verification**
   - What we know: `signalframe-provider.tsx` calls `gsap.globalTimeline.timeScale(0)` when `prefers-reduced-motion: reduce` is detected; GSAP is NOT attached to `window.gsap` by default in Next.js bundles
   - What's unclear: Whether there's a data attribute or other DOM signal the provider emits to indicate reduced-motion state
   - Recommendation: Check `signalframe-provider.tsx` during implementation — if no DOM signal exists, test reduced-motion indirectly via content visibility assertions (heading bounding boxes, element positions). Adding `document.body.dataset.reducedMotion = 'true'` to the provider would make this testable without window.gsap.

2. **axe-core violations on existing content (baseline unknown)**
   - What we know: No axe-core baseline exists; WCAG AA errors may exist in current markup
   - What's unclear: Whether the current 5 routes pass WCAG AA clean or require fixes
   - Recommendation: Run axe-core in discovery mode first (log all violations without failing) in Wave 1, then add the failing assertion in Wave 2 after fixing discovered issues. The planner should account for a potential "fix a11y violations" task as part of QA-02 implementation.

3. **tsconfig scope for Vitest test files**
   - What we know: Base `tsconfig.json` has `"include": ["**/*.ts", "**/*.tsx", ...]` which would include `lib/*.test.ts` files; it also has `"exclude": [".planning", "templates"]` but not `tests/`
   - What's unclear: Whether adding Vitest globals to the base tsconfig creates conflicts with Playwright
   - Recommendation: Use `tsconfig.test.json` extending the base, as documented in Pattern 2 above. Vitest's `typecheck.tsconfig` option points to this file.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 (unit) + @playwright/test 1.59.1 (E2E + a11y + reduced-motion) |
| Config file | `vitest.config.ts` (new — Wave 0) |
| Quick run command | `pnpm test` (runs `vitest run` — no watch) |
| Full suite command | `pnpm test:coverage && npx playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| QA-01 | Vitest configured with coverage; lib/ utility functions have unit tests | unit | `pnpm test` | ❌ Wave 0: `vitest.config.ts`, `lib/utils.test.ts`, `lib/nomenclature.test.ts` |
| QA-01 | Coverage report generated without errors | unit | `pnpm test:coverage` | ❌ Wave 0 |
| QA-02 | Every route passes WCAG AA audit (axe-core) | E2E + a11y | `npx playwright test tests/phase-38-a11y.spec.ts` | ❌ Wave 0: `tests/phase-38-a11y.spec.ts` |
| QA-02 | prefers-reduced-motion: content visible, no offscreen elements | E2E | `npx playwright test tests/phase-38-reduced-motion.spec.ts` | ❌ Wave 0: `tests/phase-38-reduced-motion.spec.ts` |
| QA-03 | Pre-commit hook runs lint + tsc, blocks on failure | manual-only | `git commit` with lint error in staged file | ❌ Wave 0: `.husky/pre-commit` |
| QA-03 | lint-staged only runs on staged `*.{ts,tsx}` files | manual-only | Stage one file, verify only that file is linted | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test` (Vitest unit run only — fast, ~1-3s)
- **Per wave merge:** `pnpm test:coverage && npx playwright test tests/phase-38-*.spec.ts`
- **Phase gate:** Full Vitest + full Playwright suite green before `/pde:verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` — Vitest configuration (environment, coverage, aliases)
- [ ] `tsconfig.test.json` — Vitest-scoped TypeScript config (excludes tests/, adds vitest/globals)
- [ ] `lib/utils.test.ts` — unit tests for `cn()` utility
- [ ] `lib/nomenclature.test.ts` — unit tests for `assignCodes()`
- [ ] `tests/phase-38-a11y.spec.ts` — axe-core WCAG AA audit for all 5 routes
- [ ] `tests/phase-38-reduced-motion.spec.ts` — prefers-reduced-motion assertions
- [ ] `.husky/pre-commit` — hook file (created by `pnpm exec husky init`, then modified)
- [ ] Framework install: `pnpm add -D vitest @vitest/coverage-v8 jsdom @axe-core/playwright husky lint-staged`

---

## Sources

### Primary (HIGH confidence)
- `https://vitest.dev/config/` — Vitest 4.x configuration shape (environment, globals, coverage, alias, include/exclude)
- `https://vitest.dev/guide/coverage` — @vitest/coverage-v8 install and setup
- `https://vitest.dev/guide/environment` — jsdom environment setup, per-file docblock syntax
- `https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright` — @axe-core/playwright AxeBuilder API, withTags(), analyze()
- `https://typicode.github.io/husky/get-started.html` — husky 9.x pnpm setup, prepare script
- `https://typicode.github.io/husky/how-to.html` — pnpm-specific pre-commit hook
- `https://github.com/lint-staged/lint-staged` — lint-staged config in package.json, glob patterns

### Secondary (MEDIUM confidence)
- npm registry `npm view vitest version` → 4.1.4 confirmed current
- npm registry `npm view @axe-core/playwright version` → 4.11.1 confirmed current
- npm registry `npm view husky version` → 9.1.7 confirmed current
- npm registry `npm view lint-staged version` → 16.4.0 confirmed current
- `lib/signalframe-provider.tsx` source read — `gsap.globalTimeline.timeScale(0)` confirmed implementation of reduced-motion guard

### Tertiary (LOW confidence)
- GSAP window.gsap exposure claim — based on Next.js module bundling behavior (modules do not auto-attach to window); recommend verifying during implementation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions confirmed via npm registry, APIs verified via official docs
- Architecture: HIGH — patterns derived from official docs and existing project conventions
- Pitfalls: HIGH for TypeScript conflicts (well-documented); MEDIUM for GSAP window exposure (needs runtime verification)

**Research date:** 2026-04-10
**Valid until:** 2026-07-10 (stable libraries; Vitest and husky have well-established APIs)
