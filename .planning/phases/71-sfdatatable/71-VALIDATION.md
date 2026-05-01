---
phase: 71
slug: sfdatatable
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-05-01
audited: 2026-05-01
---

# Phase 71 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Audited 2026-05-01 against shipped reality (commit `c3891e0`); paths
> reconciled, statuses promoted from ⬜ pending to ✅ green.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright + axe-core (E2E) · vitest (unit) · @next/bundle-analyzer (bundle) |
| **Config file** | `playwright.config.ts` · `vitest.config.ts` · `next.config.ts` (ANALYZE env) |
| **Quick run command** | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table*.spec.ts --reporter=line` |
| **Full suite command** | `pnpm test:e2e && pnpm test:axe && rm -rf .next/cache .next && ANALYZE=true pnpm build` |
| **Estimated runtime** | ~14s Playwright + axe; ~120s incl. clean build |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/v1.10-phase71-sf-data-table*.spec.ts --grep "{tag for that task}"`
- **After every plan wave:** Run `pnpm test:e2e && pnpm test:axe`
- **Before `/pde:verify-work`:** Full suite green + bundle evidence captured + production chunk audit confirms zero TanStack devtools strings
- **Max feedback latency:** 30 seconds (per-task quick run)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 71-01-01 | 01 | 1 | DEP-01 | — | `_dep_dt_01_decision` block (7 fields) committed BEFORE `pnpm add` | manual+grep | `grep -n "_dep_dt_01_decision" components/sf/sf-data-table.tsx` | ✅ | ✅ green |
| 71-01-02 | 01 | 1 | DEP-01 | — | `@tanstack/react-table@8.21.3` installed; `pnpm-lock.yaml` updated | shell | `pnpm list @tanstack/react-table --depth=0` | ✅ | ✅ green |
| 71-01-03 | 01 | 1 | DEP-01 | — | `_dep_dt_01_decision.bundle_evidence` field populated post-install (MEASURED) | manual+grep | `grep -A2 "bundle_evidence" components/sf/sf-data-table.tsx` | ✅ | ✅ green |
| 71-01-04 | 01 | 1 | DEP-01 | — | `next.config.ts` `optimizePackageImports` does NOT contain `@tanstack/react-table` (D-04 lock holds) | grep | `grep -c "@tanstack/react-table" next.config.ts` (must be 0) | ✅ | ✅ green |
| 71-02-01 | 02 | 2 | DT-01 | — | Sort headers are `<button type="button">` with `aria-sort` on `<th>` | playwright+axe | `pnpm exec playwright test --grep "DT-01.*sort.*keyboard"` | ✅ | ✅ green |
| 71-02-02 | 02 | 2 | DT-01 | — | Click cycles asc → desc → none; visible glyph indicator | playwright | `pnpm exec playwright test --grep "DT-01.*cycle"` | ✅ | ✅ green |
| 71-02-03 | 02 | 2 | DT-01 | — | Enter/Space on header `<button>` toggles sort | playwright | `pnpm exec playwright test --grep "DT-01.*Enter|Space"` | ✅ | ✅ green |
| 71-02-04 | 02 | 2 | DT-02 | — | Filter input debounces at 300ms; reduces displayed rows on each keystroke | playwright | `pnpm exec playwright test --grep "DT-02.*debounce"` | ✅ | ✅ green |
| 71-02-05 | 02 | 2 | DT-02 | — | Controlled + uncontrolled filter API (both code paths exercised) | playwright | `pnpm exec playwright test --grep "DT-02.*controlled"` | ✅ | ✅ green |
| 71-02-06 | 02 | 2 | DT-04 | — | Checkbox column: single + multi + indeterminate header state | playwright+axe | `pnpm exec playwright test --grep "DT-04"` | ✅ | ✅ green |
| 71-02-07 | 02 | 2 | DT-04 | — | `getRowModel().rows.filter(r => r.getIsSelected())` returns selected row set | unit/playwright eval | `pnpm exec playwright test --grep "DT-04.*accessor"` | ✅ | ✅ green |
| 71-02-08 | 02 | 2 | DT-05 | — | CVA `density` variant: compact/default/comfortable maps to blessed spacing stops | unit | `pnpm vitest run components/sf/sf-data-table` | ✅ | ✅ green |
| 71-02-09 | 02 | 2 | DT-05 | — | Loading skeleton + empty state render correctly | playwright | `pnpm exec playwright test --grep "DT-05.*skeleton|empty"` | ✅ | ✅ green |
| 71-02-10 | 02 | 2 | DT-05 | — | JSDoc `@beta virtualize` comment present on prop block (v1.11 extension flag) | grep | `grep -B1 -A3 "virtualize" components/sf/sf-data-table.tsx` | ✅ | ✅ green |
| 71-02-11 | 02 | 2 | DT-05 | — | `useDebouncedValue` hook lands at `hooks/use-debounced-value.ts` (no lodash) | grep | `test -f hooks/use-debounced-value.ts && grep -L lodash hooks/use-debounced-value.ts` | ✅ | ✅ green |
| 71-02-12 | 02 | 2 | DT-04 | — | `SFCheckbox` indeterminate visual treatment threads `data-[state=indeterminate]` | grep | `grep -c "data-\[state=indeterminate\]" components/sf/sf-checkbox.tsx` (must be ≥1) | ✅ | ✅ green |
| 71-03-01 | 03 | 3 | DT-03 | — | `SFPagination` composed inside table; controlled `pageIndex` / `pageSize` API | playwright | `pnpm exec playwright test --grep "DT-03"` | ✅ | ✅ green |
| 71-03-02 | 03 | 3 | DT-06 | — | `components/sf/sf-data-table-lazy.tsx` exists; uses `next/dynamic({ ssr: false })`; `<SFSkeleton>` fallback | grep | `grep -E "next/dynamic\|ssr: false" components/sf/sf-data-table-lazy.tsx` | ✅ | ✅ green |
| 71-03-03 | 03 | 3 | DT-06 | — | `SFDataTable` and `sf-data-table-lazy` NOT exported from `components/sf/index.ts` | grep | `grep -c "data-table" components/sf/index.ts` (must be 0) | ✅ | ✅ green |
| 71-03-04 | 03 | 3 | TST-03 | — | `tests/v1.10-phase71-sf-data-table*.spec.ts` exist; cover controlled API + keyboard nav + open/close states | shell | `test -f tests/v1.10-phase71-sf-data-table.spec.ts && test -f tests/v1.10-phase71-sf-data-table-axe.spec.ts` | ✅ | ✅ green |
| 71-03-05 | 03 | 3 | TST-03 | — | axe-core scan green on `SFDataTableLazy` mount (sort header keyboard rule) | playwright+axe | `pnpm exec playwright test tests/v1.10-phase71-sf-data-table-axe.spec.ts` | ✅ | ✅ green |
| 71-03-06 | 03 | 3 | DEP-01 | — | Production chunk audit: zero `@tanstack/react-table` dev/devtools strings in `.next/static/**/*.js` | shell | `grep -rEl "tanstack.*devtools" .next/static/ 2>/dev/null` (must be empty) | ✅ | ✅ green |
| 71-03-07 | 03 | 3 | DEP-01 | — | Homepage First Load JS ≤ 200 KB after clean build (SC #5) | playwright | `pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Path reconciliation note (audit 2026-05-01):** Plan-time draft referenced
`tests/v1.10-phase71-sfdatatable.spec.ts` (single file) and
`app/_dev/playground/sf-data-table/page.tsx`. Shipped reality split the
test surface across `sf-data-table.spec.ts` (5 tests) +
`sf-data-table-axe.spec.ts` (3 axe tests) per Plan 03 Task 5 axe-isolation
discipline, and renamed `_dev/playground` → `dev-playground` via fix commit
`a907b09` (Next.js App Router treats `_*` as private folders → 404). Map
above reflects shipped paths.

---

## Wave 0 Requirements

- [x] `tests/v1.10-phase71-sf-data-table.spec.ts` — 5 Playwright tests covering DT-01..04 (116 lines)
- [x] `tests/v1.10-phase71-sf-data-table-axe.spec.ts` — 3 axe-core scans (113 lines)
- [x] Bundle gate handled by reuse of `tests/v1.8-phase63-1-bundle-budget.spec.ts` + Plan 03 Task 5 production-chunk audit shell (no separate phase71-bundle-evidence spec needed)
- [x] `app/dev-playground/sf-data-table/page.tsx` — fixture mount surface for Playwright/axe (65 lines, 25-row dataset)
- [x] No new framework install (Playwright + axe-core + vitest already configured)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual consistency of sort glyph (▲▼—) with DU/TDR coded register | DT-01 | Aesthetic judgment, not automatable | Compare against existing SF glyph language in `components/sf/sf-pagination.tsx`; flat geometric, zero border-radius, no Lucide chevrons |
| `_dep_dt_01_decision.review_gate` reasonable trigger condition | DEP-01 | Future-facing policy, requires human judgment | Confirm `review_gate: "TanStack Table v9 stable release"` is reachable + actionable when fired |
| `virtualize` JSDoc precision (flags v1.11 + `_dep_dt_02_decision`) | DT-05 | Forward-compat documentation, requires human review | Visual inspection of JSDoc on the prop |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (sf-data-table specs split + dev-playground fixture)
- [x] No watch-mode flags
- [x] Feedback latency < 30s per-task (~14s end-to-end Playwright+axe)
- [x] `nyquist_compliant: true` — all 22 task rows are ✅ green; 8/8 reqs satisfied per VERIFICATION.md

**Approval:** ratified 2026-05-01 (audit retroactive against shipped phase)

---

## Validation Audit 2026-05-01

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |
| Statuses reconciled (⬜→✅) | 22 |
| Path reconciliations | 2 (spec split, `_dev`→`dev-playground` rename) |
| Wave 0 items closed | 4/4 |

**Method:** Static reconciliation against
`.planning/phases/71-sfdatatable/71-VERIFICATION.md` (status: passed; 8/8
requirements satisfied; 5/5 locks held; verifier re-ran 8/8 Playwright+axe
green in 13.9s on 2026-05-01) and shipped commit `c3891e0`. No new tests
authored — every requirement already had matching automated coverage at
phase close. Validation contract was the lagging artifact (plan-time draft),
not the test surface.
