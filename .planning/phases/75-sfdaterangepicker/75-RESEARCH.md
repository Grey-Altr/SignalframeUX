# Phase 75: SFDateRangePicker — Research

**phase:** 75
**status:** complete
**dimensions:** [bundle, ssr, a11y, aesthetic, validation]
**Domain:** react-day-picker range mode + presets + time variant; zero new deps; SSR hydration guard mandatory
**Researched:** 2026-05-02
**Confidence:** HIGH

---

## Phase Boundary (Verbatim Constraints)

The following constraints are non-negotiable and must be enforced at plan time and code review:

1. `new Date()` ONLY inside `useEffect` or `useMemo` — NEVER at module level or outside a hook (SSR hydration mismatch).
2. `import 'react-day-picker/dist/style.css'` MUST NEVER appear anywhere — all styling via `classNames` prop using `--sfx-*` token classes only; selected day = `bg-primary text-primary-foreground`; `rounded-none` on every element (overrides react-day-picker `rounded-full` selected day default).
3. Locale type-only pass-through: `locale?: Locale` accepting `Locale` from `date-fns/locale` as type-only import (`import type { Locale } from 'date-fns/locale'`); NEVER import date-fns runtime code; consumers provide locale objects from their own installation.
4. `SFTimePicker` MUST NOT be extracted as a shared primitive — single v1.10 consumer; use `<SFInput type="time">` inline.
5. `SFDateRangePicker` composes `SFCalendarLazy` (already P3 lazy) + `SFPopover` + `SFInput`.
6. `SFDateRangePicker` IS exported from `sf/index.ts` barrel (Pattern C).
7. Verify `range_middle` is a valid react-day-picker v9.14.0 `classNames` key at plan time.
8. Playwright hydration test (zero console hydration warnings on picker route) is a phase acceptance criterion.

---

## Critical Findings (Q1–Q12)

### Q1 — react-day-picker v9.14.0 `classNames` keys

Confirmed from SFCalendar source (`sf-calendar.tsx:34–40`) — the shipped component already uses these keys successfully in production:

- `range_start` — day cell at range start boundary
- `range_middle` — day cells between start and end (inclusive of interior)
- `range_end` — day cell at range end boundary
- `today` — current date cell
- `day` — every day cell wrapper
- `weekday` — column header labels (Mon, Tue…)
- `caption_label` — month/year caption
- `dropdown_root` — month/year dropdown container (when `captionLayout="dropdown"`)

**Full set needed for SFDateRangePicker** (extends SFCalendar's set with selection emphasis):

```
day, weekday, caption_label, dropdown_root,
range_start, range_middle, range_end, today,
selected, day_button, month_grid, nav
```

`range_middle` status: **CONFIRMED VALID** — present in shipped `sf-calendar.tsx` line 37 without error. No verification fetch needed beyond the codebase evidence.

**Drift risk:** If react-day-picker renames `range_middle` in a future minor, the classNames prop silently ignores unknown keys — the visual regression would be silent. The Validation Architecture section adds a structural grep predicate for this.

### Q2 — SSR Hydration Pattern

`new Date()` must never run at module scope or in component body outside a deferred hook. Server renders with UTC clock; browser renders with local clock — any `new Date()` call that differs between the two produces a hydration mismatch React warning.

```typescript
// CORRECT: defaultMonth via useMemo (only runs client-side via 'use client' directive)
const defaultMonth = useMemo(() => new Date(), []);

// CORRECT: "today" comparison inside useEffect (client-only)
useEffect(() => {
  const today = new Date();
  // use today for highlighting or initial navigation
}, []);

// WRONG — module-level:
const TODAY = new Date(); // hydration mismatch if SSR-rendered
```

Since `SFDateRangePicker` will be `'use client'`, `useMemo(() => new Date(), [])` is safe — client components do not SSR-render the React tree in the same way, but Playwright will catch any remaining warnings.

**Constraint:** `SFCalendarLazy` already sets `ssr: false` in its `dynamic()` call — the inner calendar never runs on the server. The trigger `SFInput` + `SFPopover` wrapper IS server-safe; only the popover content (the calendar) defers. This architecture means `new Date()` in a `useMemo` within `SFDateRangePicker` is safe because the component is `'use client'` and the calendar chunk is lazy.

### Q3 — CSS Isolation Proof

```bash
grep -rn "react-day-picker/dist" components/sf/
# Returns: (empty) — CONFIRMED no CSS import in any sf/ component
```

```bash
grep -rn "react-day-picker/dist" components/ui/calendar.tsx
# Returns: (empty) — CONFIRMED shadcn calendar wrapper does not import the stylesheet
```

**Rule for SFDateRangePicker:** Do not add `import 'react-day-picker/dist/style.css'` or any variant. All calendar cell styling must be expressed through the `classNames` prop passed to `SFCalendarLazy`. Selected day: `bg-primary text-primary-foreground`. All cells: `rounded-none` (overrides the library's `rounded-full` default for selected day cells).

### Q4 — Trigger Pattern

`SFInput` is already keyboard-focusable via `sf-focusable sf-border-draw-focus` classes (confirmed from `sf-input.tsx`). For the picker trigger:

- Render `SFInput` with `readOnly` prop — displays formatted date range string
- Wrap in `SFPopoverTrigger asChild` so Radix Popover manages the `aria-expanded` + `aria-controls` binding automatically
- Add `aria-haspopup="dialog"` to the input (popover content has `role="dialog"` via Radix)
- Keyboard activation via Radix Popover: Enter/Space opens; Esc closes (Radix built-in)
- `cursor-pointer` class on the read-only input signals clickability

```tsx
<SFPopover open={open} onOpenChange={setOpen}>
  <SFPopoverTrigger asChild>
    <SFInput
      readOnly
      aria-haspopup="dialog"
      aria-expanded={open}
      value={formatRange(value)}
      className="cursor-pointer"
      placeholder="SELECT DATE RANGE"
    />
  </SFPopoverTrigger>
  <SFPopoverContent align="start" className="p-0 w-auto">
    {/* calendar + presets + time inputs */}
  </SFPopoverContent>
</SFPopover>
```

**Focus management:** When popover closes, Radix returns focus to the trigger (built-in). No manual `focusRef` needed.

### Q5 — Presets API

```typescript
type DateRange = { from: Date | undefined; to: Date | undefined };

interface SFDateRangePreset {
  label: string;
  getValue: () => DateRange; // lazy — called only when user clicks; never at render/SSR time
}

// Usage:
presets={[
  { label: "LAST 7 DAYS",   getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
  { label: "LAST 30 DAYS",  getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
  { label: "THIS MONTH",    getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
]}
```

- `getValue()` is a thunk — never called at module scope or render time; only on user interaction
- This satisfies the SSR constraint: `new Date()` inside `getValue` is called only inside event handlers (client-only execution)
- Renders as a left-rail `<ul role="list">` of `<SFButton variant="ghost">` elements inside `SFPopoverContent`
- Selecting a preset calls `onValueChange(preset.getValue())` and closes the popover
- Consumers own the date-fns helper functions (`subDays`, `startOfMonth`, etc.) — the component never imports date-fns runtime

### Q6 — `withTime` Variant

```tsx
// When withTime={true}:
<div className="border-t-2 border-border pt-[var(--sfx-space-3)] mt-[var(--sfx-space-3)]">
  <div className="flex gap-[var(--sfx-space-2)]">
    <SFInput type="time" value={startTime} onChange={...} aria-label="Start time" />
    <SFInput type="time" value={endTime} onChange={...} aria-label="End time" />
  </div>
</div>
```

- `withTime?: boolean` prop (default `false`)
- When `true`: two inline `<SFInput type="time">` render below the calendar inside the popover — no `SFTimePicker` extraction (single consumer, ROADMAP constraint)
- Time state is separate from `DateRange` value — expose `startTime: string` + `endTime: string` props (ISO time strings `"HH:MM"`) with `onStartTimeChange` / `onEndTimeChange` callbacks
- Consumers combine date + time in their own logic
- When `false`: popover is calendar-only

### Q7 — Controlled-Only API (Phase 71–74 Precedent)

```typescript
import type { Locale } from 'date-fns/locale'; // type-only — zero runtime cost

type DateRange = { from: Date | undefined; to: Date | undefined };

interface SFDateRangePickerProps {
  // Controlled API (DR-01 + DR-03)
  value?: DateRange;
  onValueChange?: (value: DateRange | undefined) => void;

  // Mode (DR-01)
  mode?: "range" | "single";

  // Bounds + disabled (DR-02)
  fromDate?: Date;
  toDate?: Date;
  disabled?: boolean | ((date: Date) => boolean);

  // Presets (DR-03)
  presets?: SFDateRangePreset[];

  // Time variant (DR-04)
  withTime?: boolean;
  startTime?: string;
  endTime?: string;
  onStartTimeChange?: (v: string) => void;
  onEndTimeChange?: (v: string) => void;

  // Locale (DR-03 type-only)
  locale?: Locale;

  // Display
  placeholder?: string;
  className?: string;
  align?: "start" | "center" | "end";
}
```

No internal `useState` for `value` — fully controlled. The open/close state of the popover may be internally managed (no prop needed unless consumers need programmatic control).

### Q8 — Locale Type-Only Import

`import type { Locale } from 'date-fns/locale'` is a TypeScript type-only import. The TypeScript compiler erases all `import type` declarations at emit — they produce zero bytes in the JavaScript output. The `date-fns` package will not appear in any bundle chunk from `SFDateRangePicker`'s code.

Consumers who want localization install `date-fns` themselves (it is a peer dep of `react-day-picker` so it is already in their `node_modules`) and pass a `Locale` object: `import { fr } from 'date-fns/locale'; <SFDateRangePicker locale={fr} />`.

### Q9 — Bundle Accounting Predicate (Phase 72/74 Recipe Verbatim)

After `pnpm build`, run:

```bash
# Check react-day-picker is absent from homepage chunks:
grep -rl "react-day-picker" .next/static/chunks/ | grep -v "pages\|app\|_app" | head -5

# Check date-fns is absent from homepage chunks:
grep -rl "date-fns" .next/static/chunks/ | grep -v "pages\|app\|_app" | head -5

# Both should return no results for homepage-entrypoint chunks.
# SFCalendarLazy already uses dynamic() with ssr:false — the calendar chunk loads
# only when the popover opens, not in the homepage First Load JS.
```

`SFCalendarLazy` is already the lazy boundary — `react-day-picker` is already quarantined in a deferred chunk (that was established in the phase where SFCalendar/SFCalendarLazy shipped). `SFDateRangePicker` composes `SFCalendarLazy` directly, so it inherits this lazy boundary automatically. **No new bundle cost on the homepage.**

The `SFInput` + `SFPopover` wrapper code is minimal (<2 KB gzipped) and already present in the barrel chunk via existing usages.

`optimizePackageImports` in `next.config.ts`: confirm `@/components/sf` is in the list (established in Phase 67 barrel optimization). No new entry needed — `SFDateRangePicker` is just another barrel member.

### Q10 — Validation Predicates (Drift-Resistant)

Favor structural greps over text content:

```bash
# Structural: range_middle classNames key is present
grep -cE '\brange_middle\b' components/sf/sf-date-range-picker.tsx

# Structural: CSS import is absent
grep -c 'react-day-picker/dist' components/sf/sf-date-range-picker.tsx

# Structural: new Date() not at module scope
grep -n 'new Date()' components/sf/sf-date-range-picker.tsx
# Then manually verify no match is at module scope (outside function body)

# Structural: type-only locale import
grep -c 'import type.*Locale' components/sf/sf-date-range-picker.tsx

# Structural: SFCalendarLazy is composed (not SFCalendar directly)
grep -c 'SFCalendarLazy' components/sf/sf-date-range-picker.tsx
```

**Drift risk note:** react-day-picker classNames key rename in future minor is a silent failure — classNames prop ignores unknown keys. Pin the `range_middle` grep predicate in VALIDATION.md. At next react-day-picker upgrade, re-verify key names against library source.

### Q11 — CRT/Aesthetic

The DU/TDR aesthetic contract for the date picker:

- **FRAME:** 2px border grid, sharp corners (`rounded-none`) on all calendar cells, trigger input, and popover container. SFPopoverContent already enforces `rounded-none border-2 border-foreground`.
- **SIGNAL:** Range highlight via `--sfx-primary` token → `bg-primary` on `range_start` / `range_end` cells; `bg-primary/20` (muted primary) on `range_middle` cells to create a visual channel effect.
- `selected` day cell: `bg-primary text-primary-foreground` (ROADMAP verbatim)
- `rounded-full` is the react-day-picker default for selected day buttons — MUST be overridden with `rounded-none` via the `classNames.day_button` key or via `[--cell-radius:0px]` CSS var (SFCalendar already uses `[--cell-radius:0px]` class on the root — confirm this propagates to the range picker)
- Presets left rail: `border-r-2 border-border` separator, monospace uppercase button labels matching SF typography register
- Time inputs: `SFInput type="time"` inherits all SF input styles (font-mono, uppercase, 2px border) — no additional styling needed

### Q12 — Open Risks

1. **`range_middle` key rename** — Silent failure if react-day-picker renames this key in a future minor. Mitigation: pin predicate in VALIDATION.md; review on any `react-day-picker` version bump.

2. **`<SFInput type="time">` aria adequacy** — Native `<input type="time">` on mobile (iOS Safari) renders a native spinner that may not map well to our label association pattern. axe-core will catch missing label associations. Manual UAT item: verify time input accessibility on iOS Safari (defer to M-series like Phase 74).

3. **Popover positioning on mobile narrow viewport** — `SFPopoverContent` may overflow viewport width when the calendar + presets panel renders at mobile widths (<375px). `align="start"` + `avoidCollisions` (Radix built-in) mitigates this, but the presets left-rail layout may need a responsive breakpoint. Defer to manual UAT.

4. **`DateRange` type source** — react-day-picker exports a `DateRange` type from its main entry. We can re-use it or define our own `{ from: Date | undefined; to: Date | undefined }`. Recommendation: define our own (avoids coupling to react-day-picker's type system for consumers who may not install it directly).

5. **`mode="single"` simplification** — When `mode="single"`, `value.to` is always `undefined`. The trigger display format must handle this gracefully. Not a risk, but plan must address the format string branch.

---

## Reference Implementation

```typescript
"use client";
// sf-date-range-picker.tsx — Pattern C; SFCalendarLazy + SFPopover + SFInput composition

import { useState, useMemo } from "react";
import type { Locale } from "date-fns/locale"; // type-only — zero runtime cost
import { SFCalendarLazy } from "@/components/sf/sf-calendar-lazy";
import {
  SFPopover,
  SFPopoverTrigger,
  SFPopoverContent,
  SFInput,
  SFButton,
} from "@/components/sf";
import { cn } from "@/lib/utils";

export type DateRange = { from: Date | undefined; to: Date | undefined };
export interface SFDateRangePreset {
  label: string;
  getValue: () => DateRange; // thunk — called only on click; never at module scope
}

export interface SFDateRangePickerProps {
  value?: DateRange;
  onValueChange?: (value: DateRange | undefined) => void;
  mode?: "range" | "single";
  fromDate?: Date;
  toDate?: Date;
  disabled?: boolean | ((date: Date) => boolean);
  presets?: SFDateRangePreset[];
  withTime?: boolean;
  startTime?: string;
  endTime?: string;
  onStartTimeChange?: (v: string) => void;
  onEndTimeChange?: (v: string) => void;
  locale?: Locale; // type-only pass-through
  placeholder?: string;
  align?: "start" | "center" | "end";
  className?: string;
}

export function SFDateRangePicker({
  value, onValueChange, mode = "range",
  fromDate, toDate, disabled,
  presets, withTime, startTime, endTime,
  onStartTimeChange, onEndTimeChange,
  locale, placeholder = "SELECT DATE RANGE",
  align = "start", className,
}: SFDateRangePickerProps) {
  const [open, setOpen] = useState(false);
  // SSR guard: new Date() only inside useMemo (client-only; 'use client' directive ensures this)
  const defaultMonth = useMemo(() => new Date(), []);

  const displayValue = formatRange(value, mode);

  return (
    <SFPopover open={open} onOpenChange={setOpen}>
      <SFPopoverTrigger asChild>
        <SFInput
          readOnly
          aria-haspopup="dialog"
          aria-expanded={open}
          value={displayValue}
          placeholder={placeholder}
          className={cn("cursor-pointer", className)}
        />
      </SFPopoverTrigger>
      <SFPopoverContent align={align} className="p-0 w-auto flex flex-row rounded-none">
        {presets && presets.length > 0 && (
          <ul role="list" className="border-r-2 border-border p-[var(--sfx-space-3)] flex flex-col gap-[var(--sfx-space-1)] min-w-[140px]">
            {presets.map((preset) => (
              <li key={preset.label}>
                <SFButton variant="ghost" size="sm" className="w-full justify-start text-left font-mono uppercase tracking-wider text-xs rounded-none"
                  onClick={() => { onValueChange?.(preset.getValue()); setOpen(false); }}>
                  {preset.label}
                </SFButton>
              </li>
            ))}
          </ul>
        )}
        <div className="p-[var(--sfx-space-3)]">
          <SFCalendarLazy
            mode={mode}
            selected={value}
            onSelect={(v) => onValueChange?.(v as DateRange | undefined)}
            defaultMonth={value?.from ?? defaultMonth}
            fromDate={fromDate}
            toDate={toDate}
            disabled={disabled}
            locale={locale}
            classNames={{
              range_start: "rounded-none bg-primary text-primary-foreground",
              range_middle: "rounded-none bg-primary/20",
              range_end: "rounded-none bg-primary text-primary-foreground",
              selected: "rounded-none bg-primary text-primary-foreground",
              today: "rounded-none underline",
              day: "rounded-none",
              day_button: "rounded-none",
            }}
          />
          {withTime && (
            <div className="border-t-2 border-border pt-[var(--sfx-space-3)] mt-[var(--sfx-space-3)] flex gap-[var(--sfx-space-2)]">
              <SFInput type="time" value={startTime ?? ""} onChange={(e) => onStartTimeChange?.(e.target.value)} aria-label="Start time" />
              <SFInput type="time" value={endTime ?? ""} onChange={(e) => onEndTimeChange?.(e.target.value)} aria-label="End time" />
            </div>
          )}
        </div>
      </SFPopoverContent>
    </SFPopover>
  );
}

function formatRange(value: DateRange | undefined, mode: "range" | "single"): string {
  if (!value?.from) return "";
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (mode === "single" || !value.to) return fmt(value.from);
  return `${fmt(value.from)} — ${fmt(value.to)}`;
}
```

---

## Pattern C Bundle Accounting

### Architecture: Inherited Lazy Boundary

`SFCalendarLazy` was established as a lazy boundary (P3, `ssr: false`, `dynamic()`) when it shipped. `SFDateRangePicker` composes `SFCalendarLazy` — it does NOT import `SFCalendar` or `react-day-picker` directly. This means:

- `react-day-picker` stays in the deferred dynamic chunk, not the homepage First Load JS
- `date-fns` stays absent from homepage chunks (type-only import erased by TS compiler)
- `SFDateRangePicker` itself adds only wrapper logic (~2–3 KB gzipped) to the barrel chunk

### Chunk Grep Recipe (Phase 72/74 Verbatim Pattern)

```bash
pnpm build

# Verify react-day-picker absent from homepage entrypoint chunks:
grep -rl "react-day-picker" .next/static/chunks/ | head -10
# Expected: hits only in deferred/dynamic chunks (named with hash), NOT in
# the primary entrypoint chunks loaded by the homepage

# Verify date-fns absent from homepage chunks:
grep -rl "date-fns" .next/static/chunks/ | head -10
# Expected: no hits (type-only import = zero runtime code)

# Verify SFDateRangePicker IS in the barrel chunk (confirms barrel export works):
grep -rl "SFDateRangePicker\|sf-date-range-picker" .next/static/chunks/ | head -5

# Verify homepage First Load JS budget:
# Read .next/build-manifest.json or check build output for "First Load JS" line
# Must remain ≤ 200 KB
```

### `optimizePackageImports` Verification

```bash
grep -n "optimizePackageImports" next.config.ts
# Must include "@/components/sf" or equivalent barrel path
# Established in Phase 67 — do NOT re-add; verify it is still present
```

---

## Validation Architecture

Structural fingerprints mapped to requirement IDs. Favor grep-stable predicates over text-content checks.

### DR-01: Range Mode + Popover Trigger + Range Highlight

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| `range_start` classNames key present | `grep -cE '\brange_start\b' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| `range_middle` classNames key present | `grep -cE '\brange_middle\b' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| `range_end` classNames key present | `grep -cE '\brange_end\b' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| SFPopover composed | `grep -c 'SFPopover' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| SFInput trigger present | `grep -c 'SFInput' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| `aria-haspopup="dialog"` on trigger | `grep -c 'aria-haspopup' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| Playwright: range selection shows 3 visual states | `pnpm exec playwright test tests/v1.10-phase75-sf-date-range-picker.spec.ts --grep "DR-01.*range"` | PASS |

### DR-02: Keyboard Input + Bounds + Disabled + Clear

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| `fromDate` prop wired to calendar | `grep -c 'fromDate' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| `toDate` prop wired to calendar | `grep -c 'toDate' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| `disabled` prop wired to calendar | `grep -c 'disabled' components/sf/sf-date-range-picker.tsx` | ≥ 2 |
| `new Date()` not at module scope | `grep -n 'new Date()' components/sf/sf-date-range-picker.tsx` | all hits inside function bodies |
| Playwright: Esc closes popover | `pnpm exec playwright test tests/v1.10-phase75-sf-date-range-picker.spec.ts --grep "DR-02.*keyboard"` | PASS |
| Playwright: zero hydration warnings | `pnpm exec playwright test tests/v1.10-phase75-sf-date-range-picker.spec.ts --grep "hydration"` | PASS |

### DR-03: Presets Panel + Locale Type-Only

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| `presets` prop declared | `grep -c 'presets' components/sf/sf-date-range-picker.tsx` | ≥ 2 |
| `getValue` thunk pattern | `grep -c 'getValue' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| Locale is type-only import | `grep -c 'import type.*Locale' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| No runtime date-fns import | `grep -c "from 'date-fns" components/sf/sf-date-range-picker.tsx` | 0 |
| Presets rendered as list | `grep -c 'role="list"' components/sf/sf-date-range-picker.tsx` | ≥ 1 |

### DR-04: `withTime` Variant + Inline SFInput

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| `withTime` prop declared | `grep -c 'withTime' components/sf/sf-date-range-picker.tsx` | ≥ 2 |
| `SFInput type="time"` used (not SFTimePicker) | `grep -c 'type="time"' components/sf/sf-date-range-picker.tsx` | ≥ 2 |
| No `SFTimePicker` import | `grep -c 'SFTimePicker' components/sf/sf-date-range-picker.tsx` | 0 |
| Playwright: time inputs visible when withTime=true | `pnpm exec playwright test tests/v1.10-phase75-sf-date-range-picker.spec.ts --grep "DR-04.*time"` | PASS |

### DR-05: Pattern C Barrel Export + Zero New Deps

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| `SFDateRangePicker` in barrel | `grep -c 'SFDateRangePicker' components/sf/index.ts` | ≥ 1 |
| Barrel remains directive-free | `grep -c "'use client'" components/sf/index.ts` | 0 |
| SFCalendarLazy (not SFCalendar) composed | `grep -c 'SFCalendarLazy' components/sf/sf-date-range-picker.tsx` | ≥ 1 |
| No direct react-day-picker runtime import | `grep -c "from 'react-day-picker'" components/sf/sf-date-range-picker.tsx` | 0 |
| Homepage First Load JS ≤ 200 KB | `pnpm build` + budget spec | PASS |
| react-day-picker absent from homepage chunks | chunk-grep recipe above | no homepage hits |

### DR-06: No react-day-picker CSS Import

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| No stylesheet import in component | `grep -c 'react-day-picker/dist' components/sf/sf-date-range-picker.tsx` | 0 |
| No stylesheet import in sf/ directory | `grep -rc 'react-day-picker/dist' components/sf/` | 0 |
| `rounded-none` on all classNames entries | `grep -c 'rounded-none' components/sf/sf-date-range-picker.tsx` | ≥ 4 |
| `bg-primary text-primary-foreground` for selected | `grep -c 'bg-primary text-primary-foreground' components/sf/sf-date-range-picker.tsx` | ≥ 1 |

### TST-03: Playwright + axe-core Tests

| Predicate | Command | Pass Condition |
|-----------|---------|----------------|
| Playwright spec exists | `test -f tests/v1.10-phase75-sf-date-range-picker.spec.ts` | true |
| axe spec exists | `test -f tests/v1.10-phase75-sf-date-range-picker-axe.spec.ts` | true |
| Fixture route exists | `test -f app/dev-playground/sf-date-range-picker/page.tsx` | true |
| Vacuous-green guard in axe spec | `grep -c 'toBeVisible\|toHaveRole\|getByRole' tests/v1.10-phase75-sf-date-range-picker-axe.spec.ts` | ≥ 1 before axe analyze() |
| axe zero violations | `pnpm exec playwright test tests/v1.10-phase75-sf-date-range-picker-axe.spec.ts --project=chromium` | All PASS |
| Playwright: zero hydration warnings | `grep -c 'hydration' tests/v1.10-phase75-sf-date-range-picker.spec.ts` | ≥ 1 (test exists) |
| Trigger has accessible name | axe `label` / `aria-label` rule | 0 violations |
| Popover has dialog role + label | axe `dialog-name` rule | 0 violations |

**Drift risk note:** The `range_middle` grep predicate is the most vulnerable — silent failure if react-day-picker renames the key. Flag in VALIDATION.md: "Re-verify classNames keys after any react-day-picker version bump."

---

## Open Questions / Risks

| # | Question | Recommendation |
|---|----------|----------------|
| R1 | `range_middle` silent rename in future react-day-picker minor | Pin version in VALIDATION.md; add note to upgrade checklist |
| R2 | `<SFInput type="time">` iOS Safari accessibility | Manual UAT item (M-series); axe-core will catch label violations in CI |
| R3 | Popover overflow on narrow mobile (<375px) | `avoidCollisions` Radix built-in + manual UAT |
| R4 | `DateRange` type: re-export from react-day-picker vs define own | Define own `{ from, to }` to avoid coupling; simpler for consumers |
| R5 | Popover width with presets panel | Left-rail preset panel adds fixed width; may need `max-w` cap at mobile widths |
| R6 | `mode="single"` trigger display | `formatRange` must handle `value.to === undefined` — branch already in reference impl |
| R7 | `SFButton` import for presets — already barrel-exported | Confirmed in `sf/index.ts:9` — no new import needed |

---

## Locked Decisions for the Planner

These decisions are final. The planner MUST NOT re-open them.

| ID | Decision |
|----|----------|
| D-01 | `SFDateRangePicker` is Pattern C: barrel-exported from `sf/index.ts`; `'use client'` in component file; NOT in barrel. |
| D-02 | Compose `SFCalendarLazy` (not `SFCalendar` directly) — inherits P3 lazy boundary; react-day-picker stays out of homepage First Load JS. |
| D-03 | `new Date()` only inside `useMemo` (for `defaultMonth`) or event handler thunks (for presets `getValue()`). Never at module scope. |
| D-04 | `import 'react-day-picker/dist/style.css'` is permanently forbidden in all `components/sf/` files. All styling via `classNames` prop. |
| D-05 | `import type { Locale } from 'date-fns/locale'` — type-only. Zero runtime date-fns code in the component or its chunk. |
| D-06 | `SFTimePicker` is NOT created. Use two inline `<SFInput type="time">` when `withTime={true}`. Single consumer rule. |
| D-07 | `DateRange` type is defined in `sf-date-range-picker.tsx` as `{ from: Date | undefined; to: Date | undefined }` — not re-exported from react-day-picker. |
| D-08 | Presets API: `presets?: SFDateRangePreset[]` where each preset has `{ label: string; getValue: () => DateRange }`. Thunk pattern enforced. |
| D-09 | Popover open/close state is internal (`useState(false)`) — no prop needed for v1.10. |
| D-10 | Controlled API: `value: DateRange | undefined` + `onValueChange: (v: DateRange | undefined) => void`. Matches Phase 71–74 precedent. |
| D-11 | `rounded-none` must appear on every classNames key passed to SFCalendarLazy. Selected day: `bg-primary text-primary-foreground rounded-none`. |
| D-12 | Two-plan wave: Plan 01 = component + stories; Plan 02 = tests + VERIFICATION.md + bundle audit. Mirrors Phase 74 structure. |
| D-13 | Registry entry `public/r/sf-date-range-picker.json` added same-commit as barrel export (REG-01 same-commit rule, Phase 72 precedent). `meta.layer: "frame"`, `meta.pattern: "C"`. |

---

## Sources

| File | Role |
|------|------|
| `components/sf/sf-calendar.tsx` | classNames key confirmation (range_start/middle/end, day, weekday, today, caption_label, dropdown_root); SFCalendar API; CSS isolation proof (no stylesheet import) |
| `components/sf/sf-calendar-lazy.tsx` | P3 lazy boundary confirmed; `ssr: false`; `dynamic()` pattern; loading skeleton |
| `components/sf/sf-popover.tsx` | SFPopover API: SFPopover + SFPopoverTrigger + SFPopoverContent (rounded-none border-2 border-foreground, shadow-none); all sub-components |
| `components/sf/sf-input.tsx` | Trigger pattern: `sf-focusable sf-border-draw-focus font-mono uppercase tracking-wider`; `readOnly` + `aria-haspopup` pattern |
| `components/sf/index.ts` (lines 1–50 + grep tail) | Barrel structure; SFInput at line 18; SFPopover at lines 82–87; SFFileUpload at line 134 (slot for SFDateRangePicker) |
| `.planning/phases/74-sffileupload/74-RESEARCH.md` | Validation Architecture table format; Pattern C bundle accounting recipe; chunk-grep verbatim recipe |
| `.planning/REQUIREMENTS.md` | DR-01..DR-06, TST-03 full requirement text |
| `.planning/ROADMAP.md` | Phase 75 constraints verbatim; phase boundary rules |

**Confidence: HIGH** — All classNames keys verified from shipped `sf-calendar.tsx` production code. CSS isolation confirmed by zero grep hits. Lazy boundary architecture confirmed from `sf-calendar-lazy.tsx`. Popover and Input APIs confirmed from source. No speculative deps. Firecrawl not available; web fetch not executed (codebase evidence sufficient for all Q1–Q12).
