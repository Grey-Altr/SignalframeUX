# Coding Conventions

**Analysis Date:** 2026-04-12

## Naming Patterns

**Files:**
- Kebab-case for components and utilities (examples: `components/sf/sf-button.tsx`, `components/layout/nav-overlay.tsx`, `lib/color-resolve.ts`).
- SF wrapper files use `sf-` prefix (examples: `components/sf/sf-input.tsx`, `components/sf/sf-section.tsx`).
- End-to-end tests use phase-prefixed names in `tests/` (examples: `tests/phase-38-a11y.spec.ts`, `tests/phase-35-homepage.spec.ts`).
- Unit tests are colocated in `lib/` with `.test.ts` suffix (examples: `lib/utils.test.ts`, `lib/nomenclature.test.ts`).

**Functions:**
- Components use PascalCase export names (examples: `SFButton`, `SFSection` in `components/sf/sf-button.tsx`, `components/sf/sf-section.tsx`).
- Helpers use camelCase function names (examples: `cn` in `lib/utils.ts`, `assignCodes` in `lib/nomenclature.ts`).

**Variables:**
- Constants are `SCREAMING_SNAKE_CASE` when global/static (examples: `AXE_EXCLUDE` in `tests/phase-38-a11y.spec.ts`, `VIEWPORTS` in `tests/phase-35-homepage.spec.ts`).
- Local runtime values are camelCase (example: `themeScript` in `app/layout.tsx`).

**Types:**
- Type aliases/interfaces use PascalCase (examples: `TextVariant` in `components/sf/sf-text.tsx`, `SFButtonProps` in `components/sf/sf-button.tsx`).

## Code Style

**Formatting:**
- No dedicated Prettier/Biome config detected; formatting is enforced primarily through ESLint and existing file style.
- Style is mixed between semicolon and no-semicolon files, reflecting different source layers (`components/ui/button.tsx` vs `components/sf/sf-button.tsx`).

**Linting:**
- ESLint flat config is defined in `eslint.config.js` with `eslint-config-next/core-web-vitals`.
- Type-aware `@typescript-eslint` rules are enabled via `parserOptions.project: true` in `eslint.config.js`.
- Test files under `tests/` relax unsafe-assignment/member/call/argument rules in `eslint.config.js`.
- Lint command: `pnpm lint` from `package.json`.

## Import Organization

**Order:**
1. External libraries/types first (example: `next`, font imports in `app/layout.tsx`).
2. Internal aliases (`@/`) next (examples in `app/layout.tsx`, `components/sf/sf-button.tsx`).
3. Relative imports and styles last (example: `./globals.css` in `app/layout.tsx`).

**Path Aliases:**
- `@/*` maps to project root in `tsconfig.json`.
- Use alias imports for app/component/lib boundaries (`@/components/...`, `@/lib/...`).

## Error Handling

**Patterns:**
- Assertion-driven failure in tests with explicit error messages (`tests/phase-37-lighthouse-gate.spec.ts`).
- Guard + throw patterns for required runtime dependencies (server availability checks in `tests/phase-37-lighthouse-gate.spec.ts`).

## Logging

**Framework:** No centralized logging package detected.

**Patterns:**
- Runtime app code avoids console logging in sampled files.
- Tests surface diagnostics by embedding details in assertion messages and thrown errors (`tests/phase-38-a11y.spec.ts`, `tests/phase-37-lighthouse-gate.spec.ts`).

## Comments

**When to Comment:**
- Use comments for architectural constraints and non-obvious behavior (examples in `app/layout.tsx`, `tests/phase-35-homepage.spec.ts`).
- Use section-divider comments in larger tests to segment behavior blocks (`tests/phase-35-homepage.spec.ts`).

**JSDoc/TSDoc:**
- Public SF wrappers and utilities commonly include JSDoc with `@param` and `@example` tags (`components/sf/sf-button.tsx`, `components/sf/sf-text.tsx`, `lib/utils.ts`).
- A dedicated audit enforces JSDoc and `@example` coverage for entry exports (`tests/phase-40-01-jsdoc-audit.spec.ts`).

## Function Design

**Size:** 
- UI wrappers are thin pass-through functions that compose base UI primitives and token classes (`components/sf/sf-input.tsx`, `components/sf/sf-button.tsx`).
- Complex logic is kept in scripts/tests rather than component wrappers (`scripts/launch-gate-runner.mjs`, `tests/phase-40-01-jsdoc-audit.spec.ts`).

**Parameters:** 
- Props are typed with `React.ComponentProps` or explicit interfaces and destructured in function signatures (`components/sf/sf-input.tsx`, `components/sf/sf-section.tsx`).

**Return Values:** 
- React components return JSX directly.
- Utility/test helpers return explicit typed values (examples in `lib/utils.ts`, helper functions inside `tests/phase-40-01-jsdoc-audit.spec.ts`).

## Module Design

**Exports:** 
- Prefer named exports for components/utilities (`components/sf/sf-button.tsx`, `lib/utils.ts`).
- Entry-point style is explicit named re-export aggregation (`lib/entry-core.ts`, `lib/entry-animation.ts`, `lib/entry-webgl.ts`).

**Barrel Files:** 
- `components/sf/index.ts` is the primary barrel for SF wrappers.
- Continue adding new SF wrapper exports to `components/sf/index.ts` to preserve import ergonomics.

## Standards Checklist (Current)

- **Lint standard:** `pnpm lint` + `lint-staged` hook (`package.json`, `.husky/pre-commit`).
- **Type standard:** `pnpm tsc --noEmit` pre-commit gate (`.husky/pre-commit`).
- **Test standard:** unit tests via Vitest (`vitest.config.ts`) and integration/E2E gates via Playwright (`playwright.config.ts`).

---

*Convention analysis: 2026-04-12*
