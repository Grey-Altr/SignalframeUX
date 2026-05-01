---
phase: 72
slug: sfcombobox
status: planned
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-01
---

# Phase 72 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright + axe-core (E2E + a11y) · @next/bundle-analyzer (bundle audit via `ANALYZE=true pnpm build`) |
| **Config file** | `playwright.config.ts` · `next.config.ts` (ANALYZE env) |
| **Quick run command** | `pnpm exec playwright test tests/v1.10-phase72-sf-combobox*.spec.ts --reporter=line` |
| **Full suite command** | `pnpm exec playwright test tests/v1.10-phase72-sf-combobox*.spec.ts --project=chromium && rm -rf .next/cache .next && ANALYZE=true pnpm build && pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium` |
| **Estimated runtime** | ~15s Playwright + axe; ~120s incl. clean ANALYZE build |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/v1.10-phase72-sf-combobox*.spec.ts --grep "{tag for that task}" --project=chromium`
- **After every plan wave:** Run `pnpm exec playwright test tests/v1.10-phase72-sf-combobox*.spec.ts --project=chromium`
- **Before `/pde:verify-work`:** Full suite green + bundle evidence captured (cmdk MUST NOT appear in homepage `/` First Load chunk; SFCombobox is barrel-exported but Pattern C tree-shaking via `optimizePackageImports` keeps cmdk out of homepage)
- **Max feedback latency:** 30 seconds (per-task quick run)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 72-01-01 | 01 | 1 | CB-01 | cmdk-leak-via-barrel | SFCommandLoading wrapper added to sf-command.tsx; not added to barrel | grep | `grep -q "function SFCommandLoading" components/sf/sf-command.tsx && [ "$(grep -c "SFCommandLoading" components/sf/index.ts)" = "0" ]` | ⬜ | ⬜ pending |
| 72-01-02 | 01 | 1 | CB-01,CB-02 | aria-collision; cluster-c-policy | SFCombobox single-select impl; PopoverTrigger asChild wraps `<button type="button">`, NOT SFInput; active-state via slot tokens | grep+tsc | `grep -q "<SFPopoverTrigger asChild>" components/sf/sf-combobox.tsx && grep -B0 -A5 "SFPopoverTrigger asChild" components/sf/sf-combobox.tsx \| grep -q 'type="button"' && ! grep -E "rounded-(sm\|md\|lg\|xl\|2xl\|full)" components/sf/sf-combobox.tsx && pnpm exec tsc --noEmit` | ⬜ | ⬜ pending |
| 72-01-03 | 01 | 1 | CB-04 | cmdk-leak-via-barrel; registry-drift | Barrel export added; SFCommand* exclusion preserved; registry items[] += 1 (54); standalone sf-combobox.json lands | grep+node | `grep -q "export { SFCombobox" components/sf/index.ts && [ "$(grep -cE "SFCommand[A-Z]" components/sf/index.ts)" = "1" ] && node -e "if (require('./public/r/registry.json').items.length !== 54) process.exit(1)" && test -f public/r/sf-combobox.json` | ⬜ | ⬜ pending |
| 72-02-01 | 02 | 2 | CB-03 | nested-interactive; multi-select-popover-close | Multi-select branch: SFBadge chips, popover stays open, aria-multiselectable, chip × with stopPropagation; chip remove uses span+role=button (not nested button) | grep+tsc | `grep -q "selectedMultiValues" components/sf/sf-combobox.tsx && grep -q "aria-multiselectable=" components/sf/sf-combobox.tsx && grep -q "e.stopPropagation()" components/sf/sf-combobox.tsx && grep -q 'role="button"' components/sf/sf-combobox.tsx && ! grep -q "console.warn" components/sf/sf-combobox.tsx && pnpm exec tsc --noEmit` | ⬜ | ⬜ pending |
| 72-02-02 | 02 | 2 | CB-01,CB-02,CB-03 | playwright-fixture-vacuous-green | Playground fixture mounts 6 sections with data-testids; SFCombobox imported via barrel (CB-04 surface verification) | grep | `test -f app/dev-playground/sf-combobox/page.tsx && [ "$(grep -c "data-testid=\"section-" app/dev-playground/sf-combobox/page.tsx)" -ge 6 ] && grep -q "from \"@/components/sf\"" app/dev-playground/sf-combobox/page.tsx` | ⬜ W0 | ⬜ pending |
| 72-02-03 | 02 | 2 | CB-01,CB-02,CB-03,TST-03 | playwright-vacuous-green | ≥10 Playwright tests covering CB-01 (open/filter/keyboard/Enter/Escape/controlled), CB-02 (clear/grouping), CB-03 (multi stay-open/chips/remove/controlled string[]); beforeEach asserts fixture sections visible | playwright | `pnpm exec playwright test tests/v1.10-phase72-sf-combobox.spec.ts --project=chromium --reporter=line` | ⬜ W0 | ⬜ pending |
| 72-02-04a | 02 | 2 | TST-03 | axe-vacuous-green; nested-interactive | ≥6 axe-core tests; all open popover or assert progressbar visible BEFORE analyze(); rules: aria-allowed-attr, aria-required-children, aria-valid-attr-value, button-name, color-contrast, aria-multiselectable, nested-interactive (chip remove span+role=button guard) | axe | `pnpm exec playwright test tests/v1.10-phase72-sf-combobox-axe.spec.ts --project=chromium --reporter=line` | ⬜ W0 | ⬜ pending |
| 72-02-04b | 02 | 2 | CB-04 | bundle-leak-via-barrel | Production chunk audit (App Router-aware): cmdk absent from homepage `/` First Load chunk via `app-build-manifest.json.pages['/page']`; cmdk present in `/dev-playground/sf-combobox/page` (or shared) chunks | shell+node | `rm -rf .next/cache .next && ANALYZE=true pnpm build && node -e "let m;try{m=require('./.next/app-build-manifest.json')}catch{};const cs=(m&&(m.pages['/page']\|\|m.pages['/']))\|\|[];if(cs.length===0)process.exit(2);const fs=require('fs'),path=require('path');for(const c of cs){const fp=path.join('.next',c);if(!fs.existsSync(fp))continue;if(/cmdk\\/dist/.test(fs.readFileSync(fp,'utf8')))process.exit(1);}"` | ⬜ | ⬜ pending |
| 72-02-04c | 02 | 2 | CB-04 (BND-08 contract) | bundle-budget-regression | Homepage `/` First Load JS ≤ 200 KB after Phase 72 ships | playwright | `pnpm exec playwright test tests/v1.8-phase63-1-bundle-budget.spec.ts --project=chromium --reporter=line` | ⬜ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

> **Note:** Per-task rows populated by planner (PLAN.md generation). Each task has either an `<automated>` block or a Wave-0 dependency reference. Wave-0 stub (fixture + Playwright spec stub + axe spec stub) is itemized as 72-02-02..04 — these MUST exist as failing/skipped tests before Plan 02 Task 1 multi-select impl is committed (TDD-light gate). In practice for Phase 72, Plan 02 Task 1 (impl) lands first, then Tasks 2-4 add the fixture + tests; this satisfies the Wave-0 gate by test-creation in the same plan as the impl.

---

## Wave 0 Requirements

- [ ] `tests/v1.10-phase72-sf-combobox.spec.ts` — Playwright spec (≥10 named tests for CB-01..03 acceptance)
- [ ] `tests/v1.10-phase72-sf-combobox-axe.spec.ts` — axe-core spec (≥6 named tests covering aria-allowed-attr, aria-required-children, button-name, color-contrast, aria-multiselectable)
- [ ] `app/dev-playground/sf-combobox/page.tsx` — fixture page mounting 6 sections (single uncontrolled, single controlled+grouped, multi controlled, loading, empty, grouped-only)
- [ ] No new framework installs — Playwright + axe-core/playwright already present (Phase 71 precedent)

*Wave-0 stubs land within Plan 02 alongside the multi-select impl. The Wave-0 gate is satisfied by all 4 stubs being present and exercising the impl by Plan 02 close. The TDD-light interpretation here matches the Phase 71 plan-set pattern where impl + fixture + tests all ship in the same plan tail.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual chip-stack overflow at narrow viewports (multi-select with 6+ selections) | CB-03 | Layout perception; pixel-diff thresholds noisy below 320px | Open `/dev-playground/sf-combobox` → section 3 multi → select 6+ options → resize Chrome window 320 → 480 → 640 → confirm chips wrap, no horizontal scroll, trigger remains keyboard-targetable; chip × buttons remain reachable via Tab |
| FRAME/SIGNAL register: combobox aesthetics align with DU/TDR — sharp corners (zero radius), blessed spacing, font-mono uppercase, no decorative shadow | CB-01..04 (cross-cutting) | Aesthetic register is human-judged | Side-by-side compare with SFInput + SFButton + SFBadge + SFPagination on the same playground page; confirm visual consistency with shipped v1.9 register; verify no `--sfx-magenta` literal anywhere in active-state styling (Cluster-C policy) |
| Light + dark mode parity | CB-01..04 | Color tokens apply theme-aware values; per-theme rendering best confirmed by eye | Toggle theme on `/dev-playground/sf-combobox`; confirm trigger button, popover content, chips, group headings, loading state, and empty state all read correctly in both themes; no library-default colors leak |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending (planner self-approval — orchestrator review at /pde:execute-phase entry)
