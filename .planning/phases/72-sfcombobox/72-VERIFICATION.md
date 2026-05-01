---
phase: 72-sfcombobox
verified: 2026-05-01T22:30:00Z
status: passed
score: 11/11 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: null
  initial_verification: true
---

# Phase 72: SFCombobox Verification Report

**Phase Goal:** Ship SFCombobox<T> Pattern C composition over cmdk + Radix Popover with single-select (CB-01), clear+grouping (CB-02), multi-select with chip remove (CB-03), and barrel export with zero new runtime deps (CB-04). Plus TST-03 Playwright + axe coverage.

**Verified:** 2026-05-01T22:30:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (merged from ROADMAP Success Criteria + PLAN must_haves)

| #   | Truth                                                                                                                                                          | Status     | Evidence                                                                                                                                                                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | SC-1 / CB-01: Single-select — typing filters in real time, ArrowUp/Down move highlight, Enter selects, Escape closes without selecting                          | VERIFIED   | `sf-combobox.tsx:317` SFCommand carries `loop`+`label`; `:319` SFCommandList; `:329-355` SFCommandItem with onSelect→handleSelect→setOpen(false) (single branch :169). Playwright spec covers via `CB-01 open`, `CB-01 filter`, `CB-01 keyboard`, `CB-01 Enter`, `CB-01 Escape` (5 tests, 12/12 PASS).      |
| 2   | SC-2 / CB-02: Clear affordance resets selection; grouping via CommandGroup renders heading correctly                                                            | VERIFIED   | `sf-combobox.tsx:295-314` sibling `<button aria-label="Clear selection">` with stopPropagation+handleClear; `:325-341` SFCommandGroup keyed on `groupKey` w/ heading. Playwright `CB-02 clear` + `CB-02 grouping` (cmdk-group-heading attr matches North/South/East). 2/2 tests PASS.                       |
| 3   | SC-3 / CB-03: Multi-select via `multiple` — SFBadge chips with remove × + controlled `value: string[]` API; popover STAYS OPEN after select                     | VERIFIED   | `sf-combobox.tsx:53` SFBadge import; `:155-164` multi handleSelect toggles array, NO setOpen(false); `:243-274` chip render with SFBadge intent="outline"; `:253-271` chip remove `<span role="button" tabIndex={0} aria-label={\`Remove ${label}\`}>` w/ stopPropagation+Enter/Space onKeyDown. 4/4 PASS. |
| 4   | SC-4 / TST-03: axe-core zero violations on open combobox in controlled + uncontrolled (listbox role, activedescendant, keyboard nav, button-name, aria-allowed) | VERIFIED   | 6 axe tests at `tests/v1.10-phase72-sf-combobox-axe.spec.ts` — section-1 single-select OPEN, section-2 controlled+grouped OPEN+listbox accessible name, section-2 clear button-name, section-3 multi OPEN+aria-multiselectable, section-3 chips, section-4 loading. 6/6 PASS at ~10s.                       |
| 5   | CB-04: SFCombobox barrel-exported (Pattern C); zero new runtime deps; cmdk ABSENT from homepage First Load chunk                                                | VERIFIED   | `components/sf/index.ts:71-74` exports `SFCombobox` + types from `./sf-combobox`. `:75-79` SFCommand* exclusion comment preserved + extended. `package.json` cmdk count=1 (unchanged from Phase 47). Plan 02 SUMMARY records B1 audit: cmdk fingerprint absent from homepage 12 chunks; present in fixture. |
| 6   | TST-03 acceptance gate: ≥10 Playwright tests + ≥6 axe-core tests, vacuous-green guards in beforeEach                                                             | VERIFIED   | Playwright: 12 tests (>= 10) at `tests/v1.10-phase72-sf-combobox.spec.ts`; beforeEach asserts `section-1` + `section-3` visible. Axe: 6 tests (>= 6) at `...-axe.spec.ts`; each test asserts `[role="listbox"]`/`[role="progressbar"]` visible BEFORE analyze(). 18/18 combined PASS at 26.3s.            |
| 7   | SFCommand* import contract: sf-combobox.tsx imports SFCommand* DIRECTLY from `@/components/sf/sf-command`, NEVER via barrel                                     | VERIFIED   | `sf-combobox.tsx:57-65` direct import block. `grep -c '@/components/sf/sf-command' = 2` (import + JSDoc reference). Barrel import block at `:49-54` only contains SFPopover/SFPopoverTrigger/SFPopoverContent/SFBadge — zero SFCommand* leak.                                                              |
| 8   | ARIA isolation: PopoverTrigger asChild wraps a plain `<button type="button">`, NOT SFInput (avoids aria-haspopup-on-combobox conflict)                           | VERIFIED   | `sf-combobox.tsx:220-294` `<SFPopoverTrigger asChild><button type="button" ...>`. Anti-pattern guard `grep -B0 -A3 "SFPopoverTrigger asChild" \| grep -c "<SFInput"` = 0. axe-core `aria-allowed-attr` rule scan green across 4 sections.                                                                  |
| 9   | aria-multiselectable threaded onto SFCommandList in multi mode; verifiable via DOM inspection AND axe rule                                                       | VERIFIED   | `sf-combobox.tsx:319` `<SFCommandList aria-multiselectable={isMulti ? true : undefined}>`. Axe spec test `section-3 multi-select OPEN` asserts `[role="listbox"][aria-multiselectable="true"]` selector visible BEFORE rule scan; passes 0/0 violations on aria-allowed-attr.                              |
| 10  | Active-state styling routes through Cluster-C pair slots — no `--sfx-primary` / `--sfx-magenta` literals                                                         | VERIFIED   | `sf-combobox.tsx:233` `data-[state=open]:bg-foreground data-[state=open]:text-background`. SFCommandItem default `data-selected:bg-foreground data-selected:text-background` (sf-command.tsx:169). `grep -E '#[0-9a-fA-F]{6}'` = 0 matches; zero --sfx-primary/--sfx-magenta literals.                    |
| 11  | Registry contract REG-01: same-commit cohort — sf-combobox standalone JSON + items[] entry + barrel export landed together                                       | VERIFIED   | `public/r/sf-combobox.json` exists w/ `meta.layer="frame"`, `meta.pattern="C"`, 4 registryDependencies. `public/r/registry.json` items count = 54 (was 53); sf-combobox entry has `meta.pattern="C"`, `meta.layer="frame"`. Cohort commit `394786f` (Plan 01 Task 3).                                       |

**Score:** 11/11 truths verified

---

### Required Artifacts

| Artifact                                              | Expected                                                                                            | Status     | Details                                                                                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/sf/sf-combobox.tsx`                       | SFCombobox<T> Pattern C — single+multi select; type-ahead; grouping; clear; loading; min 220 lines | VERIFIED   | 378 lines (>= 220 floor + 280 multi-extend). Exports `SFCombobox`, `SFComboboxOption`, `SFComboboxProps`, `SFComboboxBaseProps`, `SFComboboxSingleProps`, `SFComboboxMultiProps`. Pattern C contract reminder block at end (line 366-378). |
| `components/sf/sf-command.tsx`                        | SFCommandLoading wrapper added; exported but NOT in barrel                                          | VERIFIED   | Line 122-135 `function SFCommandLoading`; export block line 211-222 includes `SFCommandLoading,`. cmdk CommandLoading wrapped at ui/command.tsx (Rule 3 auto-fix per SUMMARY).                                                            |
| `components/sf/index.ts`                              | Barrel exports SFCombobox + types; SFCommand* exclusion comment preserved                           | VERIFIED   | Line 70-74 exports `SFCombobox`, `type SFComboboxOption`, `type SFComboboxProps`. Line 75-79 SFCommand* exclusion comment preserved + extended. `grep -E "SFCommand[A-Z]" components/sf/index.ts` = 0 export-line matches (only comments). |
| `public/r/registry.json`                              | Items count = 54; sf-combobox entry with `meta.layer="frame"`, `meta.pattern="C"`                   | VERIFIED   | `node -e "console.log(require('./public/r/registry.json').items.length)"` → 54. sf-combobox entry verified via JSON parse — registryDependencies=[command, popover, button, badge].                                                       |
| `public/r/sf-combobox.json`                           | Standalone registry-item file with shadcn schema; 4 registryDependencies                            | VERIFIED   | File exists; 22 lines; mirrors `sf-button.json` shape. `name=sf-combobox`, `meta.pattern=C`, `meta.layer=frame`.                                                                                                                            |
| `app/dev-playground/sf-combobox/page.tsx`             | 6-section playground fixture; min 120 lines; barrel-imports SFCombobox; not in sitemap              | VERIFIED   | 174 lines (>= 120). 6 sections (`grep -c 'data-testid="section-[1-6]"' = 6`). Imports `SFCombobox, type SFComboboxOption from "@/components/sf"` (CB-04 surface). Not in `app/sitemap.ts`.                                                |
| `tests/v1.10-phase72-sf-combobox.spec.ts`             | Playwright spec ≥10 tests covering CB-01/02/03                                                      | VERIFIED   | 237 lines; 12 tests (>= 10 floor). Covers CB-01 (6) + CB-02 (2) + CB-03 (4). beforeEach vacuous-green guard. 12/12 PASS at 17.9s.                                                                                                          |
| `tests/v1.10-phase72-sf-combobox-axe.spec.ts`         | axe-core spec ≥6 tests; opens popover BEFORE analyze(); aria-multiselectable verified              | VERIFIED   | 274 lines; 6 tests (>= 6 floor). Each calls `openCombobox()` + asserts `[role="listbox"]` visible BEFORE AxeBuilder.analyze(). 6/6 PASS at 9.9s.                                                                                            |

---

### Key Link Verification

| From                                              | To                                            | Via                                                                | Status     | Details                                                                                                            |
| ------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------ |
| `components/sf/sf-combobox.tsx`                   | `components/sf/sf-command.tsx`                | direct import — `from "@/components/sf/sf-command"`                | WIRED      | Line 57-65: `import { SFCommand, SFCommandInput, SFCommandList, SFCommandEmpty, SFCommandGroup, SFCommandItem, SFCommandLoading } from "@/components/sf/sf-command";` |
| `components/sf/sf-combobox.tsx`                   | `components/sf/sf-popover.tsx`                | barrel import — `from "@/components/sf"`                           | WIRED      | Line 49-54: `import { SFPopover, SFPopoverTrigger, SFPopoverContent, SFBadge } from "@/components/sf";`              |
| `components/sf/sf-combobox.tsx`                   | `components/sf/sf-badge.tsx`                  | barrel import — SFBadge intent="outline" for chips                  | WIRED      | Line 53 import; line 247-272 chip rendering with `<SFBadge intent="outline">`.                                       |
| `components/sf/index.ts`                          | `components/sf/sf-combobox.tsx`               | barrel export — Pattern C; CB-04 acceptance                         | WIRED      | Line 70-74: `export { SFCombobox, type SFComboboxOption, type SFComboboxProps } from "./sf-combobox";`              |
| `components/sf/index.ts`                          | `components/sf/sf-command.tsx`                | ABSENCE — SFCommand* MUST NOT be in barrel (D-04 + cmdk exclusion)  | WIRED      | `grep -cE "SFCommand[A-Z]" components/sf/index.ts` = 2 matches (lines 76, 79 — comment lines only, NO exports).      |
| `next.config.ts`                                  | `cmdk`                                        | PRESENCE — cmdk in optimizePackageImports (D-04 lock)               | WIRED      | `grep -c "cmdk" next.config.ts` = 1 (entry preserved from Phase 61); `git diff c389073a HEAD -- next.config.ts` = 0 |
| `app/dev-playground/sf-combobox/page.tsx`         | `components/sf/sf-combobox.tsx`               | barrel import — verifies CB-04 surface from consumer perspective     | WIRED      | Line 24: `import { SFCombobox, type SFComboboxOption } from "@/components/sf";`                                     |
| `tests/v1.10-phase72-sf-combobox.spec.ts`         | `app/dev-playground/sf-combobox/page.tsx`     | Playwright `page.goto(/dev-playground/sf-combobox)`                  | WIRED      | Line 18: `const PLAYGROUND_URL = ${ABS_BASE}/dev-playground/sf-combobox;`                                            |
| `tests/v1.10-phase72-sf-combobox-axe.spec.ts`     | `@axe-core/playwright`                        | `import AxeBuilder from "@axe-core/playwright"`                      | WIRED      | Line 22: `import AxeBuilder from "@axe-core/playwright";` — 6 tests use AxeBuilder().withRules().analyze().         |

---

### Data-Flow Trace (Level 4)

| Artifact                                          | Data Variable                            | Source                                                                                  | Produces Real Data | Status      |
| ------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------- | ------------------ | ----------- |
| `components/sf/sf-combobox.tsx`                   | `selectedSingleValue` / `selectedMultiValues` | Discriminated-union state; controlled bridge from `props.value`; uncontrolled `useState` defaults from `props.defaultValue` | YES                | FLOWING     |
| `components/sf/sf-combobox.tsx`                   | `grouped` (memo)                         | `useMemo([options])` over consumer-supplied `props.options: SFComboboxOption[]`         | YES                | FLOWING     |
| `app/dev-playground/sf-combobox/page.tsx` §3      | `section3Values`                         | `useState<string[]>([])` + onChange callback wired through SFCombobox controlled API; mirrored to `<p data-testid="section-3-count">` | YES                | FLOWING     |
| `app/dev-playground/sf-combobox/page.tsx` §2      | `section2Value`                          | `useState<string \| undefined>("north-1")` + onChange; mirrored to `<p data-testid="section-2-value">` | YES                | FLOWING     |
| `tests/v1.10-phase72-sf-combobox.spec.ts`         | (test data)                              | Test fixture options hardcoded in fixture; selection state mirrored back via testid observers | YES                | FLOWING     |

All data flows verified — controlled mirrors (section-2-value / section-3-count) are read by Playwright spec to confirm the API actually propagates state, not vacuous DOM smoke testing.

---

### Behavioral Spot-Checks

| Behavior                                              | Command                                                                                                       | Result                                                              | Status |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------ |
| TypeScript compiles                                   | `pnpm tsc --noEmit` (orchestrator-validated)                                                                  | exit 0                                                              | PASS   |
| Combined Playwright + axe specs green                 | `pnpm exec playwright test tests/v1.10-phase72-sf-combobox*.spec.ts` (orchestrator-validated)                  | 18/18 PASS at 26.3s                                                 | PASS   |
| Bundle audit: cmdk absent from homepage chunks        | Plan 02 SUMMARY: `rm -rf .next/cache .next && ANALYZE=true pnpm build` + fingerprint `cmdk-root\|cmdk-input\|cmdk-item\|cmdk-list` grep over homepage / 12 chunks | absent (B1 PASS); present in 11 fixture chunks (B2 PASS)            | PASS   |
| 200 KB First Load JS budget                           | Plan 02 SUMMARY: `tests/v1.8-phase63-1-bundle-budget.spec.ts`                                                  | 187.6 KB / 200 KB (12.4 KB headroom)                                | PASS   |
| Registry items[] count                                | `node -e "console.log(require('./public/r/registry.json').items.length)"`                                      | 54                                                                  | PASS   |
| Registry sf-combobox meta                             | `node -e "...items.find(i=>i.name==='sf-combobox')..."`                                                       | `meta.layer="frame"`, `meta.pattern="C"`                            | PASS   |
| D-04 lock holds                                       | Plan 02 SUMMARY: `git diff c389073a HEAD -- next.config.ts \| wc -l`                                          | 0                                                                   | PASS   |
| Zero new npm deps                                     | Plan 02 SUMMARY: `git diff c389073a HEAD -- package.json pnpm-lock.yaml`                                       | 0 lines                                                             | PASS   |

---

### Requirements Coverage

| Requirement | Source Plan(s) | Description                                                                                                                                                                                                       | Status     | Evidence                                                                                                                                                       |
| ----------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CB-01       | 72-01          | Single-select with type-ahead, keyboard nav, empty/loading state, controlled + uncontrolled API                                                                                                                   | SATISFIED  | sf-combobox.tsx single-select branch + SFCommandLoading + SFCommandEmpty; Playwright 5 tests (open/filter/keyboard/Enter/Escape/controlled) PASS 12/12.        |
| CB-02       | 72-01          | Clear/reset action + CommandGroup grouping + active-state via `--sfx-*` tokens                                                                                                                                    | SATISFIED  | Sibling clear `<button aria-label="Clear selection">`; SFCommandGroup keyed on `groupKey` with heading; Cluster-C `data-[state=open]:bg-foreground` pair slot. |
| CB-03       | 72-02          | Multi-select via `multiple` prop with SFBadge chip remove + controlled `value: string[]` API                                                                                                                       | SATISFIED  | Discriminated-union narrowing; SFBadge intent="outline" chip render; chip remove span+role=button (avoids nested-interactive); aria-multiselectable threaded.   |
| CB-04       | 72-01, 72-02   | Barrel-exported (Pattern C); zero new runtime deps; cmdk barrel-exclusion preserved                                                                                                                                | SATISFIED  | sf/index.ts:70-74 SFCombobox export; SFCommand* exclusion comment :75-79; package.json+pnpm-lock.yaml unchanged; B1 audit confirms cmdk absent from homepage. |
| TST-03      | 72-02          | Playwright + axe-core specs against playground fixture (CB-01/02/03 acceptance + WCAG AA scan in OPEN state)                                                                                                       | SATISFIED  | 12 Playwright + 6 axe-core tests; vacuous-green guards via testid+listbox visibility BEFORE analyze(); 18/18 PASS at 26.3s.                                    |

**No orphaned requirements.** Phase 72 declares 5 requirement IDs (CB-01..04, TST-03); all 5 mapped to plans 72-01 / 72-02; all 5 satisfied with evidence.

---

### Anti-Patterns Found

Per orchestrator context, REVIEW.md (`72-REVIEW.md`) found **0 critical / 4 warning / 6 info** during code review. These are advisory and explicitly **not blocking** per workflow rules. Captured for forward visibility only:

| File                            | Issue                                                                            | Severity   | Impact                                                                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `components/sf/sf-combobox.tsx` | W-01: aria-selected hijacked by cmdk in multi-select; should use aria-checked    | Warning    | Real ARIA semantic gap for multi-select listbox; current axe sweep doesn't catch (axe validates presence not semantics). Follow-on. |
| `components/ui/command.tsx`     | W-02: shadcn cmdk base `rounded-xl!`/`rounded-lg!` `!important` defeats SFCommand `rounded-none` | Warning    | LOCKDOWN aesthetic violation scoped to popover content interior; pre-existing upstream finding, not introduced by Plan 72.        |
| `components/sf/sf-combobox.tsx` | W-03: 6 `(props as SFComboboxSingleProps)` casts bypass discriminator narrowing   | Warning    | Type-narrowing hygiene; would silently break if a third union branch is added.                                                    |
| `components/sf/sf-combobox.tsx` | W-04: chip remove `stopPropagation` only on synthetic event, Radix dismiss runs on `pointerDown` | Warning    | Load-bearing race; empirically passes spec but would regress invisibly if Radix changes timing.                                   |

**Stub/placeholder check:** Zero TODO/FIXME/PLACEHOLDER comments in shipped files. Zero hardcoded empty data flowing to render. Plan 01's `console.warn` multi-select fallback (Plan 01 Decision §5) was fully replaced in Plan 02 — verified absent at sf-combobox.tsx (`grep -c "console.warn" components/sf/sf-combobox.tsx` = 0 in shipped tree).

**Worktree hygiene:** Pre-existing `.lighthouseci/links.json` untracked (Phase 71 baseline noise) and modified `.planning/config.json` (orchestrator state) are NOT touched by Phase 72.

---

### Locks Held (verified across both plans)

| Lock                                          | Mechanism                                                                                  | Verification                                                            |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| D-04 chunk-id stability                       | `next.config.ts` `optimizePackageImports` unchanged (cmdk + radix-popover from Phases 61/67) | `git diff c389073a HEAD -- next.config.ts` → 0 lines                    |
| cmdk barrel-exclusion (sf/index.ts:75-79)     | SFCommand* (incl. SFCommandLoading) NOT in barrel                                           | `grep -cE "SFCommand[A-Z]" components/sf/index.ts` → 2 (comments only)  |
| Pattern C barrel inclusion (CB-04)            | SFCombobox + types ARE in barrel                                                            | sf/index.ts:70-74 export block                                          |
| Cluster-C active-state policy                  | Slot-token routing only, no `--sfx-primary` / `--sfx-magenta` literals                      | `data-[state=open]:bg-foreground` pair slot; zero hex literals          |
| LOCKDOWN aesthetic register (zero rounded-*)   | sf-combobox.tsx contains zero `rounded-{sm,md,lg,xl,2xl,full}` classes                      | `grep -cE "rounded-(sm\|md\|lg\|xl\|2xl\|full)"` → 0                    |
| Blessed-stop spacing only                      | --sfx-space-{1,2,3} in component; -2/-6/-8 in fixture                                       | All match CLAUDE.md blessed stops                                       |
| Zero new runtime npm deps (CB-04)              | package.json unchanged                                                                      | `git diff c389073a HEAD -- package.json pnpm-lock.yaml` → 0 lines       |
| REG-01 same-commit rule                        | sf-combobox.tsx (Task 2) → barrel + standalone JSON + items[] (Task 3 cohort)               | Plan 01 Task 3 commit `394786f` includes all 3 registry-side files      |
| 200 KB First Load JS budget                    | Homepage / chunk size                                                                       | bundle-budget Playwright spec → 187.6 KB / 200 KB (12.4 KB headroom)    |
| Pattern C cmdk barrel-exclusion empirical      | Production chunk audit (cmdk fingerprint absent from homepage)                              | B1 audit script → OK (0 leaks across 12 homepage chunks)                |

---

### Human Verification Required

None. Phase 72 is verifiable end-to-end via grep + JSON parse + automated test run + production chunk audit. The 4 REVIEW warnings are advisory and explicitly not blocking per workflow rules. Visual/UX polish items are not in scope for this phase (component shipping is structural, not visual-treatment).

---

### Gaps Summary

**No gaps.** All 11 must-haves verified. All 5 requirement IDs (CB-01, CB-02, CB-03, CB-04, TST-03) traceable to satisfied implementation evidence. All 9 key links wired. All 8 behavioral spot-checks PASS. ROADMAP Success Criteria 1-4 fully covered. Bundle health verified empirically (cmdk absent from homepage, present in fixture, 187.6 KB / 200 KB).

The 4 code-review warnings (W-01 aria-selected→aria-checked semantic; W-02 cmdk-base rounded-* upstream finding; W-03 cast narrowing hygiene; W-04 chip stopPropagation race) are quality-improvement opportunities for a follow-on phase and do not block Phase 72 closure.

---

_Verified: 2026-05-01T22:30:00Z_
_Verifier: Claude (gsd-verifier)_
