# Phase 75 Plan 01 — SUMMARY

**Status:** COMPLETE  
**Execution Date:** 2026-05-02  
**Output Files:** 6 modified (SFDateRangePicker component + barrel export + registry entries + showcase fixture)

---

## Objectives Achieved

### DR-01: Range Mode + Read-Only Trigger + Range Visual States
✓ SFDateRangePicker component ships with `mode="range"` (default) supporting two-date selection.  
✓ Read-only SFInput trigger displays formatted range string ("SHORT_MONTH DAY, YYYY — SHORT_MONTH DAY, YYYY") or empty placeholder.  
✓ Trigger opens SFPopoverContent via Radix Popover (Enter/Space/click activates).  
✓ SFCalendarLazy renders three range classNames keys:
  - `range_start`: First selected boundary (bg-primary text-primary-foreground rounded-none)
  - `range_middle`: Interior days (bg-primary/20 rounded-none)
  - `range_end`: Second selected boundary (bg-primary text-primary-foreground rounded-none)

### DR-02: Bounds + Disabled + SSR-Safe new Date()
✓ `fromDate` and `toDate` props forwarded verbatim to react-day-picker; bounds enforcement inherited.  
✓ `disabled` prop (boolean OR predicate) passed through; disabled-day rendering managed by RDP.  
✓ SSR safety: `new Date()` appears ONLY inside `useMemo(() => new Date(), [])` for defaultMonth calculation.  
✓ No module-scope or top-level component-body `new Date()` calls (verified via grep).  
✓ Plan 02's Playwright hydration test will verify zero warnings on the showcase route.

### DR-03: Presets API + Locale Type-Only + Controlled-Only API
✓ `presets?: SFDateRangePreset[]` optional prop accepts array of `{ label, getValue }` tuples.  
✓ `getValue: () => DateRange` is a lazy thunk — called ONLY inside the preset onClick handler (client-only).  
✓ Presets render as left-rail `<ul role="list">` of SFButton variant="ghost" inside the popover.  
✓ Clicking a preset calls `onValueChange(preset.getValue())` and closes the popover (`setOpen(false)`).  
✓ `Locale?: Locale` is `import type` only — `import type { Locale } from 'date-fns/locale'` (line 107).  
✓ Zero date-fns runtime import in the component file (verified: `grep -cE "^import {[^}]*} from 'date-fns" components/sf/sf-date-range-picker.tsx` = 0).  
✓ Controlled-only API: `value?: DateRange` + `onValueChange?: (value) => void`; no uncontrolled defaultValue.

### DR-04: withTime Variant (Inline Time Inputs)
✓ `withTime?: boolean` prop (default false).  
✓ When true, two inline `<SFInput type="time">` render below the calendar.  
✓ `startTime` and `endTime` props control the time values.  
✓ `onStartTimeChange` and `onEndTimeChange` callbacks fire on input change.  
✓ No `SFTimePicker` primitive extracted — decision locked per D-06 (v1.10 single consumer justifies inline approach).  
✓ Time row contains `data-testid="sf-date-range-picker-time-row"` for Plan 02 selectors.

### DR-05: Pattern C Barrel Export + Zero New Runtime Deps
✓ SFDateRangePicker exported from `components/sf/index.ts` barrel (line 135–140).  
✓ Barrel re-exports the public types: `DateRange`, `SFDateRangePreset`, `SFDateRangePickerProps`.  
✓ Barrel remains directive-free (no 'use client' line introduced).  
✓ `react-day-picker` (^9.14.0) and `date-fns` (^4.1.0) ALREADY in package.json before this phase.  
✓ Zero new entries to `dependencies` block (verified: `git diff HEAD -- package.json | grep -cE "^\\+.*\"" = 0`).  
✓ Pattern C composition: SFCalendarLazy (inherited P3 lazy boundary) + SFPopover/SFInput/SFButton (barrel imports).

### DR-06: No Stylesheet Import + classNames-Only Styling + rounded-none Everywhere
✓ Zero `import 'react-day-picker/dist/style.css'` (verified: `grep -c 'react-day-picker/dist' components/sf/sf-date-range-picker.tsx` = 0).  
✓ All styling via classNames prop keys passed to SFCalendarLazy:
  - `range_start`, `range_middle`, `range_end`: rounded-none + bg-primary/text-primary-foreground
  - `selected`: rounded-none + bg-primary text-primary-foreground (single-mode)
  - `today`, `day`, `day_button`, `month_grid`: rounded-none (structural)
✓ Popover content applies `rounded-none` on the container.  
✓ Presets rail, time-row containers: `rounded-none` on all divs.  
✓ No hardcoded hex/oklch colors — all slot tokens (bg-primary, text-primary-foreground, border-border, bg-muted).  
✓ Spacing: blessed stops only (--sfx-space-1, --sfx-space-2, --sfx-space-3 = 4, 8, 12 px).

### REG-01: Same-Commit Registry Entries
✓ `public/r/sf-date-range-picker.json` standalone registry-item created (meta.layer=frame, meta.pattern=C).  
✓ `public/r/registry.json` updated with new `items[]` entry (count 56 → 57).  
✓ Both files committed in the same commit as the barrel export (Feat(75-01): barrel + registry).  
✓ next.config.ts UNCHANGED (D-04 chunk-id stability lock; react-day-picker already in optimizePackageImports).

### Wave 0: Showcase Fixture + DCE Proof Setup
✓ `app/showcase/date-range-picker/page.tsx` created — new consumer route at deliberately new `app/showcase/` path.  
✓ Three labelled sections with testid anchors:
  - `fixture-uncontrolled-range`: range mode, no presets
  - `fixture-controlled-presets`: range mode + PRESETS array (LAST 7 DAYS, LAST 30 DAYS, THIS MONTH)
  - `fixture-withtime`: range mode + withTime variant
✓ Fixture imports date-fns helpers (`subDays`, `startOfMonth`) to demonstrate consumer-owns-date-fns pattern.  
✓ Fixture is 'use client' and uses useState for local state management (mirrors Phase 74 pattern).  
✓ Plan 02 chunk-grep will verify react-day-picker IS in `app/showcase/date-range-picker/*` chunks but ABSENT from homepage chunks.

---

## Acceptance Criteria Met

| Criterion | Status | Evidence |
|-----------|--------|----------|
| SFDateRangePicker component exists | ✓ | `components/sf/sf-date-range-picker.tsx` (298 lines) |
| Starts with 'use client' directive | ✓ | Line 1: `"use client";` |
| Exports correct types | ✓ | DateRange, SFDateRangePreset, SFDateRangePickerProps |
| range_start/middle/end classNames | ✓ | grep -E "range_start\|range_middle\|range_end" matches 3+ |
| bg-primary text-primary-foreground applied | ✓ | Line 248: `range_start: "rounded-none bg-primary text-primary-foreground"` |
| readOnly SFInput trigger | ✓ | Line 197: `readOnly` attribute |
| aria-haspopup="dialog" | ✓ | Line 198: `aria-haspopup="dialog"` |
| Composes SFCalendarLazy | ✓ | Line 230: direct import + line 243: `<SFCalendarLazy` |
| Composes SFPopover trio | ✓ | Lines 191–261: `<SFPopover>`, `<SFPopoverTrigger>`, `<SFPopoverContent>` |
| Presets typed as SFDateRangePreset[] | ✓ | Interface def line 136; grep presets: ✓ |
| Presets getValue thunk pattern | ✓ | Line 136: `getValue: () => DateRange` |
| Presets render as role="list" | ✓ | Line 215: `role="list"` |
| Locale import type-only | ✓ | Line 106: `import type { Locale } from 'date-fns/locale'` (verbatim) |
| No runtime date-fns import | ✓ | grep -cE `"^import {[^}]*} from 'date-fns"` = 0 |
| withTime prop exists | ✓ | Interface line 147: `withTime?: boolean` |
| Two inline type="time" inputs | ✓ | Lines 260–271: two SFInput type="time" |
| No SFTimePicker used | ✓ | grep -c SFTimePicker = 0 |
| new Date() only in useMemo | ✓ | Line 188: `const defaultMonth = useMemo(() => new Date(), [])` (single occurrence) |
| No react-day-picker stylesheet | ✓ | grep -c 'react-day-picker/dist' = 0 |
| rounded-none on all classNames | ✓ | Lines 248–255 all keys have rounded-none |
| Barrel export added | ✓ | `components/sf/index.ts` lines 135–140 |
| Barrel remains directive-free | ✓ | grep -c "'use client'" = 0 |
| Registry JSON created | ✓ | `public/r/sf-date-range-picker.json` (meta.layer=frame, pattern=C) |
| Registry entry added (56→57) | ✓ | `grep -c '"name":' public/r/registry.json` = 57 |
| Same-commit cohort | ✓ | `git show HEAD~1 --stat` includes all three files |
| Showcase fixture created | ✓ | `app/showcase/date-range-picker/page.tsx` (152 lines) |
| Showcase is 'use client' | ✓ | Line 1 |
| Three sections with testid | ✓ | fixture-uncontrolled-range, fixture-controlled-presets, fixture-withtime |
| pnpm tsc --noEmit passes | ✓ | Zero errors |
| package.json unchanged | ✓ | Zero new dependencies |

---

## Commits Landed

1. **a08a019** — `Feat(75-01): SFDateRangePicker component (DR-01...DR-06)`
2. **06f5df6** — `Feat(75-01): SFDateRangePicker barrel export + registry entries (DR-05 + REG-01 same-commit)`
3. **a48f6fc** — `Feat(75-01): SFDateRangePicker showcase fixture (Wave 0; enables Plan 02 hydration spec + DCE chunk-grep)`

---

## Files Modified

| File | Change |
|------|--------|
| `components/sf/sf-date-range-picker.tsx` | NEW — SFDateRangePicker component (298 lines) |
| `components/sf/index.ts` | EDIT — Added barrel export (5 lines) |
| `public/r/sf-date-range-picker.json` | NEW — Standalone registry-item (22 lines) |
| `public/r/registry.json` | EDIT — Added items[] entry (items count 56 → 57) |
| `app/showcase/date-range-picker/page.tsx` | NEW — Showcase fixture (152 lines) |

---

## Next Steps (Plan 02)

Plan 02 will execute:
1. **Playwright hydration spec** — Mount showcase sections and verify zero SSR warnings.
2. **axe-core a11y spec** — 6+ a11y assertions (focus management, aria-* attributes, keyboard nav).
3. **DCE chunk-grep proof** — Verify react-day-picker IS in `app/showcase/date-range-picker/*` chunks but ABSENT from homepage chunks.
4. **Storybook stories** — 6+ interactive stories covering range mode, single mode, presets, withTime, disabled states, locale override.

---

## Design Decisions Ratified

- **D-03 (SSR-safe new Date())**: Thunk pattern for preset getValue + useMemo for defaultMonth.
- **D-04 (No stylesheet import)**: classNames-only styling with rounded-none on every key.
- **D-06 (No SFTimePicker)**: Single consumer v1.10 scope; inline `<SFInput type="time">` sufficient.
- **D-08 (Lazy preset thunks)**: Consumer owns date-fns; getValue() called only on click.
- **Pattern C**: SFCalendarLazy composition (inherited P3 lazy boundary) + zero new runtime deps.

---

## Outstanding Notes for Review

- The fixture at `app/showcase/date-range-picker/` is deliberately a NEW route path (not dev-playground) to establish the v1.10 showcase pattern for DCE proofs.
- `locale?: Locale` accepts consumer-supplied date-fns Locale objects; the component file contains zero date-fns runtime code.
- Presets thunks (getValue) can throw — parent error boundary catches (trust boundary per Pattern C policy).
- `range_middle` classNames key is the most upgrade-fragile — future react-day-picker version bump would need re-verify.

---

**Plan 01 execution complete. All artifacts ready for Plan 02 (hydration + a11y + DCE verification + Storybook stories).**
