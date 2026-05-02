---
phase: 75-sfdaterangepicker
status: passed
nyquist_compliant: true
closed: 2026-05-02
wave_0_complete: true
created: 2026-05-02
---

# Phase 75 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Predicates favor structural greps over text-content (per `feedback_validation_predicate_drift.md`).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.x (E2E) + Vitest (unit, if introduced) |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm test:e2e --grep "SFDateRangePicker"` |
| **Full suite command** | `pnpm test:e2e && pnpm build` |
| **Estimated runtime** | ~120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck` (≤30s feedback)
- **After every plan wave:** Run `pnpm test:e2e --grep "SFDateRangePicker"` + `pnpm build` (chunk-grep)
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 75-01-01 | 01 | 1 | DR-01..06 | T-75-01..11 | Component impl + classNames-only + SSR-safe | structural grep | `pnpm exec tsc --noEmit && grep -E "range_start\|range_middle\|range_end" components/sf/sf-date-range-picker.tsx \| wc -l` | ✅ components/sf/sf-date-range-picker.tsx | ✅ green |
| 75-01-02 | 01 | 1 | DR-05 + REG-01 | T-75-10 | Barrel + registry same-commit cohort | grep + git show | `git show HEAD~2 --stat \| grep -cE "components/sf/index.ts\|public/r/sf-date-range-picker.json\|public/r/registry.json"` = 3 | ✅ barrel + registry | ✅ green |
| 75-01-03 | 01 | 1 | (Wave 0) | — | Showcase fixture for hydration spec + DCE proof | route-exists + tsc | `test -f app/showcase/date-range-picker/page.tsx && pnpm exec tsc --noEmit` | ✅ app/showcase/date-range-picker/page.tsx | ✅ green |
| 75-02-01 | 02 | 2 | TST-03 | T-75-V01..V03 | Playwright hydration + acceptance | E2E | `pnpm exec playwright test tests/e2e/sf-date-range-picker.spec.ts --project=chromium` | ✅ tests/e2e/sf-date-range-picker.spec.ts | ✅ green |
| 75-02-02 | 02 | 2 | TST-03 | T-75-V02 | axe-core WCAG AA | E2E + AxeBuilder | `pnpm exec playwright test tests/e2e/sf-date-range-picker-axe.spec.ts --project=chromium` | ✅ tests/e2e/sf-date-range-picker-axe.spec.ts | ✅ green |
| 75-02-03 | 02 | 2 | DR-05 + DR-06 | T-75-V04..V06 | Chunk-grep DCE proof + bundle measurement + type-only Locale | grep + build + budget spec | (see 75-VERIFICATION.md commands) | ✅ .planning/phases/75-sfdaterangepicker/75-VERIFICATION.md | ✅ green |
| 75-02-04 | 02 | 2 | (deferred) | T-75-V09 | 4 manual UAT items M-01..M-04 deferred | doc-exists | `test -f .planning/phases/75-sfdaterangepicker/75-HUMAN-UAT.md && grep -c 'M-0[1-4]' .planning/phases/75-sfdaterangepicker/75-HUMAN-UAT.md` = 4 | ✅ .planning/phases/75-sfdaterangepicker/75-HUMAN-UAT.md | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Plan-level mapping is finalized by `pde-planner`; per-requirement predicates below are the authoritative Nyquist contract.*

---

## Per-Requirement Predicates (Nyquist Contract)

Predicates are intentionally structural (grep / file-exists / build-output) rather than text-content. Drift risk noted per req.

### DR-01 — Range mode + classNames map

- **Structural grep:** `grep -E "range_start|range_middle|range_end" components/sf/sf-date-range-picker.tsx | wc -l` ≥ 3
- **CSS isolation grep:** `grep -r "react-day-picker/dist/style.css" components/ app/ && exit 1 || exit 0` (must NOT match)
- **Token grep:** `grep -E "\\bbg-primary text-primary-foreground\\b" components/sf/sf-date-range-picker.tsx` ≥ 1
- **Drift risk:** react-day-picker may rename `range_middle` in a future minor; pin version + add changelog read to v1.11 milestone audit.

### DR-02 — Read-only SFInput trigger + popover composition

- **Composition grep:** `grep -E "SFCalendarLazy|SFPopover|SFInput" components/sf/sf-date-range-picker.tsx | wc -l` ≥ 3 (one per partner)
- **Read-only grep:** `grep -E "readOnly|aria-haspopup=\"dialog\"" components/sf/sf-date-range-picker.tsx` ≥ 1
- **Drift risk:** none — composition partners are SF-internal.

### DR-03 — Presets API

- **Type grep:** `grep -E "presets\\??:\\s*Array<\\{\\s*label" components/sf/sf-date-range-picker.tsx` ≥ 1
- **Lazy thunk grep:** `grep -E "getValue:\\s*\\(\\)\\s*=>" components/sf/sf-date-range-picker.tsx` ≥ 1
- **Showcase usage:** Showcase route renders ≥ 2 preset buttons (Playwright `getByRole('button', { name: /Last 7 days/ })`).
- **Drift risk:** preset shape may need expansion (e.g., `disabled?: boolean`) — keep API additive only.

### DR-04 — `withTime` variant

- **Prop grep:** `grep -E "withTime\\??:\\s*boolean" components/sf/sf-date-range-picker.tsx` ≥ 1
- **Inline time input grep:** `grep -E "type=\"time\"" components/sf/sf-date-range-picker.tsx | wc -l` ≥ 2
- **No SFTimePicker grep:** `grep -r "SFTimePicker" components/sf/ app/` returns nothing.
- **Drift risk:** if `<SFInput type="time">` aria fails screen-reader audit, plan a Phase-75-followup not a v1.10 reopen.

### DR-05 — Locale type-only pass-through

- **Type-only import grep:** `grep -E "^import type \\{ Locale \\} from 'date-fns/locale'" components/sf/sf-date-range-picker.tsx` ≥ 1
- **No runtime date-fns grep:** `grep -E "^import \\{[^}]*\\} from 'date-fns" components/sf/sf-date-range-picker.tsx` returns nothing (zero matches; type-only line is excluded by `^import type`).
- **Bundle proof:** chunk-grep below (DR-06) double-confirms no date-fns runtime in chunks.
- **Drift risk:** TS `verbatimModuleSyntax` would catch a missing `type` keyword at compile — verify `tsconfig.json` has it set or rely on planner's typecheck task.

### DR-06 — Pattern C barrel + DCE bundle proof

- **Barrel grep:** `grep -E "(export \\* from|export \\{[^}]*SFDateRangePicker[^}]*\\} from) ['\"]./sf-date-range-picker['\"]" components/sf/index.ts` ≥ 1
- **optimizePackageImports verify:** `grep -E "'@/?components/sf'" next.config.ts` ≥ 1 (already present from Phase 71+)
- **Homepage chunk-grep (Pattern C DCE proof):** after `pnpm build`:
  - `grep -rE "react-day-picker|SFDateRangePicker" .next/static/chunks/pages-*.js .next/static/chunks/app-*.js .next/static/chunks/main-*.js 2>/dev/null` returns nothing for homepage chunks
  - Same grep against `.next/static/chunks/app/showcase/date-range-picker/*.js` MUST match (the showcase route consumes it)
- **Bundle ceiling:** homepage First Load JS ≤ 200 KB (CLAUDE.md hard limit; current floor 187.6 KB per memory `project_phase71_closed.md`).
- **Drift risk:** Next.js chunk file naming may change in 16.x; planner's Plan 02 owns the chunk-grep recipe maintenance.

### TST-03 — Playwright hydration + integration tests

- **Hydration test exists:** `test -f tests/e2e/sf-date-range-picker.spec.ts` (Playwright spec)
- **Zero-warning assertion:** spec asserts `consoleMessages.filter(m => m.text().match(/hydrat/i)).length === 0` on `/showcase/date-range-picker` route
- **Range interaction test:** spec clicks two day cells and asserts `range_start`, `range_middle`, `range_end` classes appear in DOM
- **Preset test:** spec clicks "Last 7 days" preset, asserts popover closes + trigger displays formatted range
- **withTime test:** spec toggles `withTime` prop in showcase fixture, asserts two `input[type="time"]` render
- **Drift risk:** Playwright console listener API stable; React hydration warning text may shift between minor versions — match on `/hydrat/i` regex.

---

## Wave 0 Requirements

- [ ] `tests/e2e/sf-date-range-picker.spec.ts` — Playwright spec stubs for DR-01..DR-06 + TST-03
- [ ] `app/showcase/date-range-picker/page.tsx` — showcase route fixture (Pattern C requires consumer route for DCE proof)
- [ ] (No new framework install — Playwright + Next.js infrastructure already present)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Touch-target on calendar day cells (44×44 minimum on mobile) | DR-01 | react-day-picker default sizing may not hit 44×44 with `rounded-none` | iPhone Safari: visit `/showcase/date-range-picker`, tap a day cell with thumb, confirm hit |
| Screen-reader announce of range selection | DR-01 | NVDA/VoiceOver behavior on `<button aria-pressed>` cells varies | NVDA: navigate calendar with arrows, hit Enter on start + Enter on end, confirm "selected, range start" / "range end" announcements |
| Popover positioning on small viewport (375px width) | DR-02 | Radix UI auto-positions but may collide with viewport edge in `withTime` mode | Mobile Safari: tap trigger near right edge, confirm popover flips |
| `<SFInput type="time">` keyboard parity across browsers | DR-04 | Native `type="time"` UX varies (Chrome step-arrows vs Safari spinner vs Firefox) | Chrome/Safari/Firefox: type-mode + arrow keys produce coherent value |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (showcase route + Playwright spec)
- [x] No watch-mode flags
- [x] Feedback latency < 120s
- [x] `nyquist_compliant: true` set in frontmatter (post-planner sign-off)

**Approval:** approved 2026-05-02

---

## Phase 75 Closeout Summary

- Component-side: 6/6 DR requirements satisfied (DR-01..DR-06) — Plan 01
- Test-side: TST-03 satisfied via Plan 02 Playwright spec (7+ tests) + axe spec (3 scans, 0 violations)
- Bundle gate (BND-08 prerequisite): homepage First Load JS within 200 KB hard target (measured 192 KB, 8 KB headroom) — see 75-VERIFICATION.md
- Pattern C DCE proof: react-day-picker lazy-loaded via SFCalendarLazy dynamic({ ssr: false }), absent from homepage chunks — see 75-VERIFICATION.md
- 4 manual UAT items deferred to 75-HUMAN-UAT.md (touch-target, screen-reader, mobile-popover, time-input keyboard parity)
- Registry items count: 56 → 57 (sf-date-range-picker added in Plan 01 same-commit cohort)
- D-04 chunk-id stability lock: HOLDS (next.config.ts unchanged)
- DR-05 zero-new-deps: HOLDS (package.json unchanged)

Phase 75 status: **CLOSED**. Phase 76 (Final Gate) is the next milestone phase.
