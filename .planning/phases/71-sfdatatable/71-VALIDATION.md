---
phase: 71
slug: sfdatatable
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-01
---

# Phase 71 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright + axe-core (E2E) · vitest (unit) · @next/bundle-analyzer (bundle) |
| **Config file** | `playwright.config.ts` · `vitest.config.ts` · `next.config.ts` (ANALYZE env) |
| **Quick run command** | `pnpm exec playwright test tests/v1.10-phase71-*.spec.ts --reporter=line` |
| **Full suite command** | `pnpm test:e2e && pnpm test:axe && rm -rf .next/cache .next && ANALYZE=true pnpm build` |
| **Estimated runtime** | ~120s (Playwright + axe + clean build) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/v1.10-phase71-*.spec.ts --grep "{tag for that task}"`
- **After every plan wave:** Run `pnpm test:e2e && pnpm test:axe`
- **Before `/pde:verify-work`:** Full suite green + bundle evidence captured + production chunk audit confirms zero TanStack devtools strings
- **Max feedback latency:** 30 seconds (per-task quick run)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 71-01-01 | 01 | 1 | DEP-01 | — | `_dep_dt_01_decision` block (7 fields) committed BEFORE `pnpm add` | manual+grep | `grep -n "_dep_dt_01_decision" components/sf/sf-data-table.tsx` | ❌ W0 | ⬜ pending |
| 71-01-02 | 01 | 1 | DEP-01 | — | `@tanstack/react-table@8.21.x` installed; `pnpm-lock.yaml` updated | shell | `pnpm list @tanstack/react-table --depth=0` | ✅ | ⬜ pending |
| 71-01-03 | 01 | 1 | DEP-01 | — | `_dep_dt_01_decision.bundle_evidence` field populated post-install (MEASURED) | manual+grep | `grep -A2 "bundle_evidence" components/sf/sf-data-table.tsx` | ❌ W0 | ⬜ pending |
| 71-01-04 | 01 | 1 | DEP-01 | — | `next.config.ts` `optimizePackageImports` does NOT contain `@tanstack/react-table` (D-04 lock holds) | grep | `grep -c "@tanstack/react-table" next.config.ts` (must be 0) | ✅ | ⬜ pending |
| 71-02-01 | 02 | 2 | DT-01 | — | Sort headers are `<button type="button">` with `aria-sort` on `<th>` | playwright+axe | `pnpm exec playwright test --grep "DT-01.*sort.*keyboard"` | ❌ W0 | ⬜ pending |
| 71-02-02 | 02 | 2 | DT-01 | — | Click cycles asc → desc → none; visible glyph indicator | playwright | `pnpm exec playwright test --grep "DT-01.*cycle"` | ❌ W0 | ⬜ pending |
| 71-02-03 | 02 | 2 | DT-01 | — | Enter/Space on header `<button>` toggles sort | playwright | `pnpm exec playwright test --grep "DT-01.*Enter|Space"` | ❌ W0 | ⬜ pending |
| 71-02-04 | 02 | 2 | DT-02 | — | Filter input debounces at 300ms; reduces displayed rows on each keystroke | playwright | `pnpm exec playwright test --grep "DT-02.*debounce"` | ❌ W0 | ⬜ pending |
| 71-02-05 | 02 | 2 | DT-02 | — | Controlled + uncontrolled filter API (both code paths exercised) | playwright | `pnpm exec playwright test --grep "DT-02.*controlled"` | ❌ W0 | ⬜ pending |
| 71-02-06 | 02 | 2 | DT-04 | — | Checkbox column: single + multi + indeterminate header state | playwright+axe | `pnpm exec playwright test --grep "DT-04"` | ❌ W0 | ⬜ pending |
| 71-02-07 | 02 | 2 | DT-04 | — | `getRowModel().rows.filter(r => r.getIsSelected())` returns selected row set | unit/playwright eval | `pnpm exec playwright test --grep "DT-04.*accessor"` | ❌ W0 | ⬜ pending |
| 71-02-08 | 02 | 2 | DT-05 | — | CVA `density` variant: compact/default/comfortable maps to blessed spacing stops | unit | `pnpm vitest run components/sf/sf-data-table` | ❌ W0 | ⬜ pending |
| 71-02-09 | 02 | 2 | DT-05 | — | Loading skeleton + empty state render correctly | playwright | `pnpm exec playwright test --grep "DT-05.*skeleton|empty"` | ❌ W0 | ⬜ pending |
| 71-02-10 | 02 | 2 | DT-05 | — | JSDoc `@beta virtualize` comment present on prop block (v1.11 extension flag) | grep | `grep -B1 -A3 "virtualize" components/sf/sf-data-table.tsx` | ❌ W0 | ⬜ pending |
| 71-02-11 | 02 | 2 | DT-05 | — | `useDebouncedValue` hook lands at `hooks/use-debounced-value.ts` (no lodash) | grep | `test -f hooks/use-debounced-value.ts && grep -L lodash hooks/use-debounced-value.ts` | ❌ W0 | ⬜ pending |
| 71-02-12 | 02 | 2 | DT-04 | — | `SFCheckbox` indeterminate visual treatment threads `data-[state=indeterminate]` | grep | `grep -c "data-\[state=indeterminate\]" components/sf/sf-checkbox.tsx` (must be ≥1) | ❌ W0 | ⬜ pending |
| 71-03-01 | 03 | 3 | DT-03 | — | `SFPagination` composed inside table; controlled `pageIndex` / `pageSize` API | playwright | `pnpm exec playwright test --grep "DT-03"` | ❌ W0 | ⬜ pending |
| 71-03-02 | 03 | 3 | DT-06 | — | `components/sf/sf-data-table-lazy.tsx` exists; uses `next/dynamic({ ssr: false })`; `<SFSkeleton>` fallback | grep | `grep -E "next/dynamic\|ssr: false" components/sf/sf-data-table-lazy.tsx` | ❌ W0 | ⬜ pending |
| 71-03-03 | 03 | 3 | DT-06 | — | `SFDataTable` and `sf-data-table-lazy` NOT exported from `components/sf/index.ts` | grep | `grep -c "data-table" components/sf/index.ts` (must be 0) | ✅ | ⬜ pending |
| 71-03-04 | 03 | 3 | TST-03 | — | `tests/v1.10-phase71-sfdatatable.spec.ts` exists; covers controlled API + keyboard nav + open/close states | shell | `test -f tests/v1.10-phase71-sfdatatable.spec.ts` | ❌ W0 | ⬜ pending |
| 71-03-05 | 03 | 3 | TST-03 | — | axe-core scan green on `SFDataTableLazy` mount (sort header keyboard rule) | playwright+axe | `pnpm exec playwright test --grep "phase71.*axe"` | ❌ W0 | ⬜ pending |
| 71-03-06 | 03 | 3 | DEP-01 | — | Production chunk audit: zero `@tanstack/react-table` dev/devtools strings in `.next/static/**/*.js` | shell | `grep -rL "TanStackTableDevtools\|table-devtools" .next/static/ 2>/dev/null` | ❌ W0 | ⬜ pending |
| 71-03-07 | 03 | 3 | DEP-01 | — | Homepage First Load JS ≤ 200 KB after clean build (SC #5) | shell | `rm -rf .next/cache .next && ANALYZE=true pnpm build && grep -E "First Load JS.*[0-9]+ kB" .next/build-output.log` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/v1.10-phase71-sfdatatable.spec.ts` — Playwright spec stubs for DT-01..06 + axe-core scan
- [ ] `tests/v1.10-phase71-bundle-evidence.spec.ts` (or shell script) — bundle size + production-chunk devtools audit
- [ ] `app/_dev/playground/sf-data-table/page.tsx` — fixture mount surface for Playwright (keep out of public route map)
- [ ] No new framework install (Playwright + axe-core + vitest already configured)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual consistency of sort glyph (▲▼—) with DU/TDR coded register | DT-01 | Aesthetic judgment, not automatable | Compare against existing SF glyph language in `components/sf/sf-pagination.tsx`; flat geometric, zero border-radius, no Lucide chevrons |
| `_dep_dt_01_decision.review_gate` reasonable trigger condition | DEP-01 | Future-facing policy, requires human judgment | Confirm `review_gate: "TanStack Table v9 stable release"` is reachable + actionable when fired |
| `virtualize` JSDoc precision (flags v1.11 + `_dep_dt_02_decision`) | DT-05 | Forward-compat documentation, requires human review | Visual inspection of JSDoc on the prop |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (`tests/v1.10-phase71-sfdatatable.spec.ts`, `tests/v1.10-phase71-bundle-evidence.spec.ts`, playground mount)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s per-task
- [ ] `nyquist_compliant: true` set in frontmatter (toggle after planner fills `<automated>` blocks per task)

**Approval:** pending
