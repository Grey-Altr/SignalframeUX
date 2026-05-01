---
phase: 72-sfcombobox
plan: 01
subsystem: ui-component-library
tags: [cb-01, cb-02, cb-04, sf-combobox, sf-command-loading, cmdk, radix-popover, pattern-c, barrel-export, registry, zero-dep]
one-liner: "SFCombobox<T> single-select shipped — Pattern C composition over cmdk + Radix Popover with type-ahead, grouping, clear, loading, controlled/uncontrolled API; barrel-exported with same-commit registry cohort; zero new runtime deps"
status: complete
completed: 2026-05-01
duration: ~12m
requirements: [CB-01, CB-02, CB-04]
nyquist_compliant: true

dependency_graph:
  requires:
    - components/sf/sf-command.tsx (cmdk SF wrappers — Phase 47 baseline)
    - components/sf/sf-popover.tsx (Radix Popover SF wrappers — Phase 17 baseline)
    - components/sf/sf-button.tsx (CVA intent vocabulary — Phase 1 baseline)
    - components/ui/command.tsx (shadcn/cmdk base — Phase 47)
    - .planning/phases/72-sfcombobox/72-RESEARCH.md (cmdk ARIA contract verified from minified source)
    - .planning/phases/72-sfcombobox/72-VALIDATION.md (per-task verify map)
    - LOCKDOWN.md §2 Color System (Cluster-C policy: --sfx-primary-foreground / --sfx-primary-on-dark pair slots)
  provides:
    - components/sf/sf-combobox.tsx (SFCombobox<T> single-select Pattern C composition)
    - components/sf/sf-command.tsx::SFCommandLoading (loading-state wrapper, direct-import only)
    - components/ui/command.tsx::CommandLoading (cmdk re-export — was missing from shadcn base)
    - components/sf/index.ts barrel export — SFCombobox + types (CB-04 acceptance)
    - public/r/sf-combobox.json standalone registry-item file (REG-01 same-commit)
    - public/r/registry.json items[54] — sf-combobox entry (Pattern C, frame layer)
  affects:
    - Plan 02 (multi-select + Playwright + axe + bundle audit) — consumes SFCombobox<T> API verbatim, replaces multi-branch warning fallback with real SFBadge chip impl
    - Phase 73 SFRichEditor — same Pattern C zero-dep precedent for trivial Pattern A wrappers
    - Phase 76 Final Gate — registry items count base of 54 advances by Phases 73/74/75

tech-stack:
  added: []  # zero new runtime npm deps (CB-04 contract)
  patterns:
    - "Pattern C composition for selection inputs — pure SF over cmdk + Radix Popover with no new deps; barrel-export the composition, never the underlying SFCommand* slots"
    - "ARIA isolation pattern — PopoverTrigger asChild wraps a plain <button type='button'> to avoid double aria-expanded + aria-haspopup-on-combobox conflict (cmdk hardcodes role='combobox' on its CommandInput)"
    - "Discriminated-union forward-API — multi-select shape committed in Plan 01 union with dev-only warn + single-select fallback; Plan 02 narrows multiple===true and ships real chip impl"
    - "Active-state slot-token routing — data-[state=open]:bg-foreground / data-[state=open]:text-background instead of --sfx-primary literals (Cluster-C policy)"

key-files:
  created:
    - components/sf/sf-combobox.tsx (279 lines — SFCombobox<T> single-select Pattern C)
    - public/r/sf-combobox.json (22 lines — standalone registry-item, mirrors sf-button.json shape)
  modified:
    - components/ui/command.tsx (+17 lines — CommandLoading wrapper added; was missing from shadcn base)
    - components/sf/sf-command.tsx (+25 lines — SFCommandLoading SF wrapper with blessed-stop spacing)
    - components/sf/index.ts (+5/-2 lines — SFCombobox + types barrel export; comment extended to mention SFCombobox direct-import dependency)
    - public/r/registry.json (+17 lines — sf-combobox entry inserted after sf-command for adjacency)

decisions:
  - "Plan-time Rule 3 auto-fix: components/ui/command.tsx was missing the CommandLoading wrapper that the plan assumed existed (cmdk exports Loading as CommandLoading; the shadcn base imports it via CommandPrimitive.Loading but the wrapper was never written). Added a 17-line wrapper paralleling other slots (cn() merge, data-slot=command-loading, py-[--sfx-space-6] center text-sm baseline matching CommandEmpty). This is the minimum unblocking fix; sf-command.tsx then layers SF register on top per the plan."
  - "PopoverTrigger asChild wraps <button type='button'> NOT SFInput — verified per RESEARCH.md §ARIA Conflict Analysis. SFInput-as-trigger collides cmdk's hardcoded role='combobox' + aria-expanded=true with Radix's runtime-injected aria-expanded + aria-haspopup. Plain <button> isolates Radix ARIA on the trigger; cmdk's CommandInput owns its own combobox ARIA inside SFPopoverContent."
  - "SFCommand* direct-import contract preserved — sf-combobox.tsx imports SFCommand/SFCommandInput/SFCommandList/SFCommandEmpty/SFCommandGroup/SFCommandItem/SFCommandLoading via @/components/sf/sf-command (NEVER via @/components/sf barrel). The barrel exclusion comment at sf/index.ts:75-79 was preserved + extended to reference SFCombobox's direct-import dependency."
  - "Multi-select discriminated-union committed at Plan 01 — SFComboboxMultiProps interface lives in the union now so consumers can adopt the API even though Plan 01 falls back to single-select with a dev-only console.warn. Plan 02 will narrow on multiple===true and ship the real SFBadge chip impl + popover-stay-open mechanism without any breaking type change."
  - "Active-state styling routes through Cluster-C pair slots — combobox trigger uses data-[state=open]:bg-foreground / text-background (Radix data-attribute) and SFCommandItem default data-selected:bg-foreground / text-background. Zero --sfx-primary or --sfx-magenta literal references. Honors feedback_primary_slot_not_color memory + Cluster-C policy."
  - "D-04 chunk-id stability lock holds — next.config.ts UNCHANGED (8-entry optimizePackageImports unchanged; cmdk + radix-ui already there from Phase 61). git diff HEAD next.config.ts wc -l = 0."
  - "REG-01 same-commit rule honored across Tasks 2+3 — components/sf/sf-combobox.tsx (Task 2 commit 6cd5aa5) + barrel export + registry items entry + standalone JSON file (all in Task 3 commit 394786f). Cohort gap of one commit acceptable per plan: 'committing barrel + registry as one cohort minimizes review surface'."
  - "Pre-existing eslint-disable hygiene fix-up: Plan 01 Task 2 originally shipped with an eslint-disable-next-line no-console directive over the dev-only multi-select console.warn. Project eslint config does NOT ban no-console at this scope, so the directive flagged as 'Unused eslint-disable directive' under max-warnings=0. Removed in fix commit f392229. Per project rule: never amend; new fix commit instead."

patterns-established:
  - "Pattern C selection-input composition — SFPopover + plain-button trigger + SFPopoverContent + SFCommand[loop label] + SFCommandInput + SFCommandList[loading? SFCommandLoading : SFCommandEmpty + grouped/ungrouped SFCommandGroup → SFCommandItem onSelect]"
  - "Same-commit cohort for new SF components — registry items[] entry + standalone JSON file land in same commit as barrel export (registry follows the surface, not the implementation)"
  - "Discriminated-union forward-API trick for staged-rollout components — declare both branches now (single + multi); narrow at runtime with NODE_ENV-gated warn + fallback in the unfinished branch; replace branch impl in next plan without breaking consumer types"

requirements-completed: [CB-01, CB-02, CB-04]

# Metrics
duration: 12min
completed: 2026-05-01
---

# Phase 72 Plan 01: SFCombobox Single-Select + Loading Wrapper + Barrel/Registry Cohort Summary

**SFCombobox<T> single-select shipped — Pattern C composition over cmdk + Radix Popover with type-ahead, grouping, clear, loading, controlled/uncontrolled API; barrel-exported with same-commit registry cohort; zero new runtime deps; cmdk barrel-exclusion + D-04 chunk-id lock + Cluster-C active-state policy held throughout.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-05-01T20:55Z
- **Completed:** 2026-05-01T21:08Z
- **Tasks:** 3 (plus 1 lint hygiene fix-up)
- **Files modified:** 5 (plus 1 created)

## Accomplishments

- `SFCombobox<T>` Pattern C composition shipped at `components/sf/sf-combobox.tsx` (279 lines, 'use client'). Single-select with type-ahead via cmdk command-score, ArrowUp/Down keyboard navigation with loop wrap, Enter-to-select, Escape-to-close (Radix default), grouping (`opt.group` keyed `SFCommandGroup`), clear affordance (sibling `<button>` not nested), loading state (`SFCommandLoading` inside `SFCommandList`), and full controlled (`value`) / uncontrolled (`defaultValue`) bridge.
- `SFCommandLoading` wrapper added to `components/sf/sf-command.tsx` with blessed-stop spacing (`--sfx-space-2` / `--sfx-space-3`) and font-mono uppercase tracking-wider register. NOT exported from barrel (cmdk barrel-exclusion preserved per D-04 / index.ts:75-79).
- `CommandLoading` wrapper added to `components/ui/command.tsx` (was missing from the shadcn base; cmdk exports `Loading as CommandLoading` but the project wrapper had never written the slot — Rule 3 auto-fix at Task 1).
- Barrel export of `SFCombobox` + types `SFComboboxOption` / `SFComboboxProps` from `components/sf/index.ts` (CB-04 acceptance). SFCommand* exclusion comment preserved + extended.
- Same-commit registry cohort: `public/r/sf-combobox.json` standalone file (mirrors `sf-button.json`) + new `items[54]` entry in `public/r/registry.json` (was 53 → 54), both with `meta.layer="frame"`, `meta.pattern="C"`.
- D-04 chunk-id stability lock held: `next.config.ts` UNCHANGED.
- ARIA conflict avoided: PopoverTrigger asChild wraps a plain `<button type="button">`, NOT SFInput (no double `aria-expanded`, no `aria-haspopup` on `role="combobox"`).
- Active-state styling routes through Cluster-C pair slots (`--sfx-primary-foreground` / `--sfx-primary-on-dark`) via `data-[state=open]:bg-foreground / text-background` and SFCommandItem default `data-selected:bg-foreground / data-selected:text-background`. Zero `--sfx-magenta` / `--sfx-primary` literal references.

## Task Commits

| # | Task | Commit | Files | Notes |
|---|------|--------|-------|-------|
| 1 | Add SFCommandLoading wrapper (CB-01 loading-state primitive) | `c4806c4` | components/ui/command.tsx, components/sf/sf-command.tsx | Rule 3 auto-fix bundled: ui/command.tsx CommandLoading wrapper was missing |
| 2 | Implement SFCombobox<T> single-select component (CB-01 + CB-02) | `6cd5aa5` | components/sf/sf-combobox.tsx | 279-line component, Pattern C composition |
| 2.1 | Lint hygiene fix-up (remove unused eslint-disable directive) | `f392229` | components/sf/sf-combobox.tsx | Fix commit (project rule: never amend) |
| 3 | Add SFCombobox barrel export + same-commit registry entries (CB-04) | `394786f` | components/sf/index.ts, public/r/sf-combobox.json, public/r/registry.json | Same-commit cohort per REG-01 |

_(Plan-metadata commit follows separately when orchestrator finalizes the wave.)_

## Files Created/Modified

### Created
- `components/sf/sf-combobox.tsx` (279 lines) — SFCombobox<T> single-select Pattern C composition. Imports SFCommand* via direct path; SFPopover* via barrel; cn() utility. Discriminated union for single+multi prop shapes; multi-branch falls back to single-select with NODE_ENV-gated console.warn until Plan 02 narrows it.
- `public/r/sf-combobox.json` (22 lines) — standalone registry-item JSON mirroring sf-button.json. Four registryDependencies (command, popover, button, badge) — badge declared now for Plan 02 multi-select chip dependency.

### Modified
- `components/ui/command.tsx` (+17 lines) — added CommandLoading wrapper paralleling other slots (`cn()`, `data-slot="command-loading"`, `py-[var(--sfx-space-6)] text-center text-sm` baseline matching CommandEmpty). Cmdk's `Loading` is re-exported via the wrapper; ui/ base now feature-complete for combobox needs.
- `components/sf/sf-command.tsx` (+25 lines) — SFCommandLoading SF-register wrapper around CommandLoading; font-mono uppercase tracking-wider text-xs with `px-[var(--sfx-space-3)] py-[var(--sfx-space-2)]` blessed-stop spacing. Added to local export block (alphabetical between SFCommandList and SFCommandEmpty), NOT to sf/index.ts barrel.
- `components/sf/index.ts` (+5/-2 lines) — `export { SFCombobox, type SFComboboxOption, type SFComboboxProps } from "./sf-combobox"` inserted before the SFCommand* exclusion comment block. Comment preserved + extended to reference SFCombobox's direct-import dependency on sf-command.
- `public/r/registry.json` (+17 lines) — new items[] entry for sf-combobox inserted after sf-command for reviewer ergonomics (combobox/command adjacency); meta.layer=frame, meta.pattern=C, four registryDependencies. items[] count now 54 (was 53).

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Auto-fix ui/command.tsx CommandLoading missing wrapper at Task 1 (Rule 3) | Plan assumed `CommandLoading` was already exported from `@/components/ui/command`; verification showed it wasn't. cmdk exports `Loading as CommandLoading` but the shadcn base wrapper file had skipped that slot. Adding it as a paralleled 17-line wrapper is the minimum-unblocking fix; sf-command.tsx then layers SF register on top per the plan. Logged as deviation Rule 3 auto-fix below. |
| PopoverTrigger asChild wraps plain `<button type="button">` NOT SFInput | RESEARCH.md §ARIA Conflict Analysis: SFInput-as-trigger collides cmdk's hardcoded `role="combobox"` + `aria-expanded=true` with Radix's runtime-injected `aria-expanded` + `aria-haspopup`. Plain button isolates Radix ARIA on the trigger; cmdk's CommandInput owns its own combobox ARIA inside SFPopoverContent. |
| SFCommand* direct-import contract preserved | sf/index.ts:75-79 documents cmdk barrel-exclusion (~12 KB gz). sf-combobox.tsx imports SFCommand* via `@/components/sf/sf-command` (direct path), never via barrel. Comment block preserved + extended to mention SFCombobox dependency. |
| Multi-select discriminated-union committed at Plan 01 | SFComboboxMultiProps shape committed now; consumers can adopt the API; multi branch falls back to single-select with NODE_ENV-gated console.warn until Plan 02 narrows on `multiple===true` and ships real SFBadge chip impl + popover-stay-open mechanism. No breaking type change between Plan 01 and Plan 02. |
| Active-state via Cluster-C pair slots, not --sfx-primary | feedback_primary_slot_not_color: combobox trigger uses `data-[state=open]:bg-foreground` / `text-background`; SFCommandItem default `data-selected:bg-foreground` / `text-background`. Zero `--sfx-primary` / `--sfx-magenta` literal references. |
| D-04 chunk-id stability lock holds | next.config.ts UNCHANGED. cmdk + @radix-ui/react-popover already in optimizePackageImports from Phase 61. `git diff HEAD next.config.ts wc -l` = 0. |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `CommandLoading` wrapper missing from `components/ui/command.tsx`**
- **Found during:** Task 1 (Add SFCommandLoading wrapper to sf-command.tsx)
- **Issue:** The plan instructs to extend the import block at the top of `sf-command.tsx` with `CommandLoading,` from `@/components/ui/command`. Verification showed `components/ui/command.tsx` does NOT export `CommandLoading` — the shadcn base never wrote that slot wrapper, even though cmdk does export `Loading as CommandLoading`. Without the ui/ wrapper, the planned import in sf-command.tsx would fail at compile time. Plan's RESEARCH.md §Loading State note ("CommandLoading is available via import { CommandLoading } from @/components/ui/command — it is NOT wrapped in sf-command.tsx currently") was based on stale information.
- **Fix:** Added a 17-line CommandLoading wrapper to `components/ui/command.tsx` paralleling the other cmdk slot wrappers. Uses `CommandPrimitive.Loading`, `cn()` merge, `data-slot="command-loading"`, baseline class `py-[var(--sfx-space-6)] text-center text-sm` (matches CommandEmpty visual register). Added to the export block alphabetically between `CommandList` and `CommandEmpty`.
- **Files modified:** `components/ui/command.tsx`
- **Verification:** `grep -q "function CommandLoading" components/ui/command.tsx` → true; `grep -q "CommandLoading," components/ui/command.tsx` → true (export); `pnpm exec tsc --noEmit` → 0 errors.
- **Committed in:** `c4806c4` (Task 1 commit — bundled with the SFCommandLoading SF wrapper that depends on it)

**2. [Rule 1 - Bug] Unused eslint-disable directive flagged max-warnings=0**
- **Found during:** Task 2 commit pre-commit hook (after the commit landed; lint-staged hook reported warning but commit had already been written)
- **Issue:** Plan instructed `// eslint-disable-next-line no-console` over the dev-only `console.warn` in the multi-select fallback branch. Project's eslint config does not ban `no-console` at this scope, so the directive flagged as "Unused eslint-disable directive (no problems were reported from 'no-console')" under `max-warnings=0`. Would block CI.
- **Fix:** Removed the `eslint-disable-next-line no-console` line. The dev-only `console.warn` (NODE_ENV-gated) is fine under current eslint config (mirrors React's own dev-warning patterns).
- **Files modified:** `components/sf/sf-combobox.tsx`
- **Verification:** `pnpm exec eslint --max-warnings=0 components/sf/sf-combobox.tsx` → clean exit 0.
- **Committed in:** `f392229` (separate fix commit per project rule: never amend, always create new commit when hook fails after-the-fact)

---

**Total deviations:** 2 auto-fixed (1 Rule 3 blocking, 1 Rule 1 bug)
**Impact on plan:** Both auto-fixes essential for the plan to ship cleanly. No scope creep — the Rule 3 fix added one missing wrapper that the plan assumed existed; the Rule 1 fix removed one stale directive added by the plan itself. SFCombobox functionality, API surface, and acceptance criteria are unchanged.

## Issues Encountered

None beyond the two deviations above.

## Verification Trace

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `pnpm exec tsc --noEmit` | 0 errors |
| Lint | `pnpm exec eslint --max-warnings=0 components/sf/sf-combobox.tsx components/sf/sf-command.tsx components/sf/index.ts components/ui/command.tsx` | 0 warnings |
| SFCommandLoading wrapper | `grep -q "function SFCommandLoading" components/sf/sf-command.tsx` | OK |
| SFCommandLoading export | `grep -q "SFCommandLoading," components/sf/sf-command.tsx` | OK |
| SFCommandLoading NOT in barrel | `grep -c "SFCommandLoading" components/sf/index.ts` | `0` |
| SFCombobox file | `test -f components/sf/sf-combobox.tsx` | OK |
| SFCombobox export | `grep -q "export function SFCombobox"` | OK |
| Direct import sf-command | `grep -q 'from "@/components/sf/sf-command"' components/sf/sf-combobox.tsx` | OK |
| Barrel import sf | `grep -q 'from "@/components/sf"' components/sf/sf-combobox.tsx` | OK |
| Anti-Pattern guard (no SFInput trigger) | `grep -B0 -A3 "SFPopoverTrigger asChild" \| grep -q "<SFInput"` | empty (OK) |
| `loop` + `label` props on SFCommand | `grep -q "loop"`, `grep -q 'label={'` | both OK |
| SFCommandGroup grouping (CB-02) | `grep -q "SFCommandGroup"` | OK |
| Clear affordance (CB-02) | `grep -c "Clear selection"` | `1` |
| Blessed-stop spacing only | `grep -oE "var\\(--sfx-space-[0-9]+\\)" \| sort -u` | `var(--sfx-space-2)`, `var(--sfx-space-3)` |
| No bad rounded-* classes | `grep -E "rounded-(sm\|md\|lg\|xl\|2xl\|full)" components/sf/sf-combobox.tsx` | empty (OK) |
| No hex literals | `grep -qE "#[0-9a-fA-F]{6}" components/sf/sf-combobox.tsx` | false (OK) |
| Active-state slot tokens | `grep -c "data-\\[state=open\\]:bg-foreground"` | `1` |
| Line count ≥ 220 | `wc -l components/sf/sf-combobox.tsx` | `279` |
| Pattern C reminder block | `grep -q "Pattern C contract reminder"` | OK |
| Barrel export landed | `grep -q "export { SFCombobox" components/sf/index.ts` | OK |
| SFCommand* exclusion comment preserved | `grep -q "SFCommand\\* — NOT re-exported" components/sf/index.ts` | OK |
| Standalone JSON exists | `test -f public/r/sf-combobox.json` | OK |
| Registry items count | `node -e "console.log(require('./public/r/registry.json').items.length)"` | `54` (was 53) |
| Registry sf-combobox entry | `cb.meta.pattern === "C" && cb.meta.layer === "frame"` | both true |
| D-04 lock | `git diff HEAD -- next.config.ts \| wc -l` | `0` |

Bundle-budget Playwright spec (`tests/v1.8-phase63-1-bundle-budget.spec.ts`) is intentionally deferred to Plan 02 Wave 2 (task 72-02-04c per VALIDATION.md). Reasoning: (a) homepage `/` does not import SFCombobox; (b) Pattern C tree-shaking via `optimizePackageImports` ensures cmdk is not pulled into homepage chunk by the new barrel export; (c) the spec requires a fresh `rm -rf .next/cache .next && ANALYZE=true pnpm build` which costs ~120s and is properly run once across both Plan 01 + Plan 02 components in Plan 02's bundle audit gate. Plan 01 surface is non-runtime-affecting on the homepage chunk.

## Locks Held

| Lock | Mechanism | Verification |
|------|-----------|--------------|
| D-04 chunk-id stability | `next.config.ts` `optimizePackageImports` unchanged (8 entries) | `git diff HEAD -- next.config.ts` → 0 lines |
| cmdk barrel-exclusion (sf/index.ts:75-79) | SFCommand* (incl. SFCommandLoading) NOT in barrel | `grep -c "SFCommandLoading" components/sf/index.ts` → `0` |
| Pattern C barrel inclusion (CB-04) | SFCombobox + types ARE in barrel | `grep -q "export { SFCombobox" components/sf/index.ts` → OK |
| Cluster-C active-state policy | Slot-token routing only, no --sfx-primary literals | `grep -c "data-\\[state=open\\]:bg-foreground"` → 1 |
| Zero border-radius (LOCKDOWN aesthetic) | No rounded-{sm,md,lg,xl,2xl,full} classes | `grep -E "rounded-(sm\|md\|lg\|xl\|2xl\|full)"` → empty |
| Blessed-stop spacing only | --sfx-space-2 + --sfx-space-3 only (8px / 12px) | `grep -oE "var\\(--sfx-space-[0-9]+\\)" \| sort -u` → 2 entries |
| Zero new runtime npm deps (CB-04) | package.json unchanged | `git diff HEAD -- package.json pnpm-lock.yaml` → 0 lines |
| Worktree-leakage guard | Each commit modified ONLY its declared files | `git show --stat` per commit |
| REG-01 same-commit rule | Component (Task 2) → barrel + standalone JSON + items[] entry (Task 3 cohort) | 1-commit gap, single-cohort review surface |

## Authentication Gates

None encountered.

## Worktree Hygiene

Each commit verified clean via `git show --stat`:

- Commit `c4806c4`: `components/ui/command.tsx` + `components/sf/sf-command.tsx` (2 files, +42 lines)
- Commit `6cd5aa5`: `components/sf/sf-combobox.tsx` (1 file, +280 lines)
- Commit `f392229`: `components/sf/sf-combobox.tsx` (1 file, -1 line — lint hygiene)
- Commit `394786f`: `components/sf/index.ts` + `public/r/sf-combobox.json` + `public/r/registry.json` (3 files, +47/-2 lines)

Pre-existing untracked `.lighthouseci/links.json` is baseline noise (matches Phase 71 close state); NOT touched by any Plan 01 commit.

## Forward Links

- **Plan 02 (CB-03 multi-select + TST-03 Playwright + axe-core)** — narrows `props.multiple === true` branch in SFCombobox, removes the dev-warn fallback, ships real SFBadge chip impl with popover-stay-open mechanism, adds `aria-multiselectable="true"` to SFCommandList in multi mode, ships fixture page at `app/dev-playground/sf-combobox/page.tsx` (6 sections), Playwright + axe-core specs against the fixture, and a homepage-bundle audit confirming cmdk absence from `pages["/page"]` chunks. Bundle budget Playwright spec runs at Plan 02 close.
- **Phase 73 SFRichEditor** — same Pattern C zero-dep precedent does NOT apply (Tiptap is a heavy runtime dep); but the discriminated-union forward-API trick used here for multi-select is reusable for any staged-rollout component.
- **Phase 76 Final Gate (REG-01)** — registry items[] count base of 54 advances by Phases 73 (SFRichEditor)/74 (SFFileUpload)/75 (SFDateRangePicker); each adds 1 entry under same-commit rule.

## Self-Check: PASSED

- [x] `components/sf/sf-combobox.tsx` exists at `/Users/greyaltaer/code/projects/SignalframeUX/components/sf/sf-combobox.tsx`
- [x] `components/ui/command.tsx` `CommandLoading` wrapper present and exported
- [x] `components/sf/sf-command.tsx` `SFCommandLoading` wrapper present and exported (NOT in barrel)
- [x] `components/sf/index.ts` `SFCombobox` + types exported via barrel; SFCommand* exclusion comment preserved
- [x] `public/r/sf-combobox.json` exists with `meta.pattern="C"` `meta.layer="frame"`
- [x] `public/r/registry.json` items[] count = `54`; sf-combobox entry has `meta.pattern="C"` `meta.layer="frame"`
- [x] `next.config.ts` UNCHANGED (D-04 lock)
- [x] Commit `c4806c4` (Task 1) exists in `git log`
- [x] Commit `6cd5aa5` (Task 2) exists in `git log`
- [x] Commit `f392229` (Task 2.1 lint hygiene) exists in `git log`
- [x] Commit `394786f` (Task 3) exists in `git log`
- [x] `pnpm exec tsc --noEmit` returns 0 errors
- [x] `pnpm exec eslint --max-warnings=0` clean across all 4 modified .ts/.tsx files
- [x] Anti-Pattern 1 guard: NO `<SFInput` inside any `SFPopoverTrigger asChild` block
