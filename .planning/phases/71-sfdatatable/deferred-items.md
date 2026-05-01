# Phase 71 Deferred Items

## Plan 03 Scope-Boundary Items

### 1. ESLint Warning: Unused `// eslint-disable-next-line no-console` directive

- **Location:** `components/sf/sf-data-table.tsx:257`
- **Severity:** Warning (build still succeeds)
- **Origin:** Pre-existing — landed in Plan 02 commit `a37f42d` (Task 3)
- **Symptom:** `Warning: Unused eslint-disable directive (no problems were reported from 'no-console').`
- **Why deferred:** Out-of-scope for Plan 03 per execute-plan scope-boundary rule. Plan 03's task set covered DT-03 pagination, DT-06 lazy wrapper, playground fixture, Playwright spec, axe spec, production chunk audit, and DEP-01 close — not Plan 02 lint cleanup.
- **Recommended fix:** Remove the unused directive (the `console.warn` call is allowed by the project's eslint config; the directive was likely defensive). Alternatively, configure eslint to allow the warning. Single-line fix.
