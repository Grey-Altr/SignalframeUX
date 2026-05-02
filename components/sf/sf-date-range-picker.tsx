"use client";

/**
 * Date range picker — FRAME layer Pattern C composition.
 *
 * Read-only SFInput trigger + SFPopover panel containing SFCalendarLazy
 * (inherited P3 lazy boundary — react-day-picker stays out of homepage
 * First Load JS) + optional left-rail presets (SFButton) + optional
 * inline time inputs (two `<SFInput type="time">` when withTime=true).
 * Controlled-only API. classNames-only styling — zero stylesheet imports.
 *
 * ============================================================
 * ANTI-FEATURES (NOT shipped — by design, not by oversight)
 * ============================================================
 *
 * 1. Built-in date library (date-fns runtime / dayjs / luxon) — Locale
 *    is a TYPE-ONLY pass-through; consumers bring their own date library
 *    for preset thunks (`subDays`, `startOfMonth`, etc.). DR-05 contract.
 *
 * 2. SFTimePicker primitive extraction — Single v1.10 consumer; we use
 *    two inline `<SFInput type="time">` when withTime=true. D-06 lock.
 *
 * 3. Datetime mode / comparison range / time-only mode — DR-07 deferred
 *    to v1.11+. Triple-feature scope explosion.
 *
 * 4. Uncontrolled-mode `defaultValue` — Pattern C precedent (Phase 71-74)
 *    is controlled-only API for new components. Consumers manage state
 *    via useState + value/onValueChange.
 *
 * 5. react-day-picker stylesheet (`react-day-picker/dist/style.css`) —
 *    NEVER imported. All styling via classNames prop using --sfx-* token
 *    classes. D-04 lock; DR-06 contract.
 *
 * 6. Custom popover positioning — Radix Popover handles avoidCollisions,
 *    flip, and viewport-edge detection. Consumers pass `align` only.
 *
 * 7. Internal date validation / parsing — fromDate/toDate/disabled flow
 *    straight to react-day-picker which owns the date math. The
 *    component contains zero comparison-arithmetic on Date objects.
 *
 * ============================================================
 * KNOWN CAVEATS
 * ============================================================
 *
 * - `value` is consumer-supplied; the component reads only `value.from`
 *   and `value.to` (no spread, no Object.assign). Trust boundary: malformed
 *   `value` shapes are NOT validated by the component (Pattern C policy).
 *
 * - `preset.getValue()` is a consumer-supplied thunk — called ONLY inside
 *   the preset onClick handler (never at module scope, never at render).
 *   Consumer owns thunk correctness; component does not catch thrown
 *   exceptions (parent error boundary catches).
 *
 * - `Locale` is `import type` only — TS erases at emit. Zero date-fns
 *   runtime code lands in the bundle from this component. Consumers who
 *   want localization install date-fns themselves (peer dep of
 *   react-day-picker, so already in node_modules) and pass a Locale
 *   object: `import { fr } from 'date-fns/locale'; <SFDateRangePicker locale={fr} />`.
 *
 * - `range_middle` classNames key is the most upgrade-fragile predicate
 *   — a future react-day-picker minor that renames this key would
 *   silently fail (RDP ignores unknown classNames keys). Re-verify on
 *   any version bump.
 *
 * - `<SFInput type="time">` keyboard parity varies across browsers
 *   (Chrome step-arrows vs Safari spinner vs Firefox). Manual UAT item
 *   in 75-VALIDATION.md.
 *
 * @example  // controlled range mode
 * const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
 * <SFDateRangePicker mode="range" value={range} onValueChange={setRange} />
 *
 * @example  // with presets (consumer owns date-fns)
 * import { subDays, startOfMonth } from "date-fns";
 * <SFDateRangePicker
 *   value={range}
 *   onValueChange={setRange}
 *   presets={[
 *     { label: "LAST 7 DAYS",  getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }) },
 *     { label: "LAST 30 DAYS", getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }) },
 *     { label: "THIS MONTH",   getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
 *   ]}
 * />
 *
 * @example  // with time variant
 * <SFDateRangePicker
 *   value={range}
 *   onValueChange={setRange}
 *   withTime
 *   startTime={startTime}
 *   endTime={endTime}
 *   onStartTimeChange={setStartTime}
 *   onEndTimeChange={setEndTime}
 * />
 */

import { useMemo, useState } from "react";
import type { Locale } from "date-fns/locale";
import { SFCalendarLazy } from "@/components/sf/sf-calendar-lazy";
import {
  SFPopover,
  SFPopoverTrigger,
  SFPopoverContent,
  SFInput,
  SFButton,
} from "@/components/sf";
import { cn } from "@/lib/utils";

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export interface SFDateRangePreset {
  label: string;
  /**
   * Lazy thunk — called ONLY inside the preset onClick handler
   * (client-only execution; SSR-safe). Consumers compose date-fns
   * helpers (subDays, startOfMonth, etc.) inside the thunk body.
   */
  getValue: () => DateRange;
}

export interface SFDateRangePickerProps {
  /** Controlled value. */
  value?: DateRange;
  /** Controlled change callback. */
  onValueChange?: (value: DateRange | undefined) => void;
  /** Selection mode — "range" (default) or "single". */
  mode?: "range" | "single";
  /** Lower date bound (inclusive). Forwarded to react-day-picker. */
  fromDate?: Date;
  /** Upper date bound (inclusive). Forwarded to react-day-picker. */
  toDate?: Date;
  /** Disabled state — boolean OR a (date) => boolean predicate. */
  disabled?: boolean | ((date: Date) => boolean);
  /** Optional left-rail presets. Each preset's getValue() is a thunk. */
  presets?: SFDateRangePreset[];
  /** When true, render two inline <SFInput type="time"> below the calendar. */
  withTime?: boolean;
  startTime?: string;
  endTime?: string;
  onStartTimeChange?: (v: string) => void;
  onEndTimeChange?: (v: string) => void;
  /** date-fns Locale object (TYPE-ONLY pass-through; zero runtime cost). */
  locale?: Locale;
  /** Trigger placeholder copy. Defaults to "SELECT DATE RANGE". */
  placeholder?: string;
  /** Popover alignment. Defaults to "start". */
  align?: "start" | "center" | "end";
  /** Trigger className override; merged via cn() after defaults. */
  className?: string;
}

function formatRange(value: DateRange | undefined, mode: "range" | "single"): string {
  if (!value?.from) return "";
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (mode === "single" || !value.to) return fmt(value.from);
  return `${fmt(value.from)} — ${fmt(value.to)}`;
}

export function SFDateRangePicker(props: SFDateRangePickerProps) {
  const {
    value,
    onValueChange,
    mode = "range",
    fromDate,
    toDate,
    disabled,
    presets,
    withTime,
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange,
    locale,
    placeholder = "SELECT DATE RANGE",
    align = "start",
    className,
  } = props;

  const [open, setOpen] = useState(false);

  // SSR guard (D-03): new Date() ONLY inside useMemo — client-only via 'use client'.
  // defaultMonth is the calendar's initial visible month when no value is set.
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
          data-testid="sf-date-range-picker-trigger"
        />
      </SFPopoverTrigger>
      <SFPopoverContent
        align={align}
        className="p-0 w-auto flex flex-row rounded-none"
        data-testid="sf-date-range-picker-content"
      >
        {presets && presets.length > 0 && (
          <ul
            role="list"
            className="border-r-2 border-border p-[var(--sfx-space-3)] flex flex-col gap-[var(--sfx-space-1)] min-w-[140px]"
            data-testid="sf-date-range-picker-presets"
          >
            {presets.map((preset) => (
              <li key={preset.label}>
                <SFButton
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left font-mono uppercase tracking-wider text-xs rounded-none"
                  onClick={() => {
                    // D-08 lazy thunk: getValue() runs ONLY inside this onClick handler.
                    onValueChange?.(preset.getValue());
                    setOpen(false);
                  }}
                >
                  {preset.label}
                </SFButton>
              </li>
            ))}
          </ul>
        )}
        <div className="p-[var(--sfx-space-3)]">
          <SFCalendarLazy
            mode={mode}
            selected={value as never}
            onSelect={(v: unknown) => onValueChange?.(v as DateRange | undefined)}
            defaultMonth={value?.from ?? defaultMonth}
            fromDate={fromDate}
            toDate={toDate}
            disabled={disabled}
            locale={locale}
            {...(mode === "range" && { required: false })}
            classNames={{
              range_start: "rounded-none bg-primary text-primary-foreground",
              range_middle: "rounded-none bg-primary/20",
              range_end: "rounded-none bg-primary text-primary-foreground",
              selected: "rounded-none bg-primary text-primary-foreground",
              today: "rounded-none underline",
              day: "rounded-none",
              day_button: "rounded-none",
              month_grid: "rounded-none",
            }}
          />
          {withTime && (
            <div
              className="border-t-2 border-border pt-[var(--sfx-space-3)] mt-[var(--sfx-space-3)] flex gap-[var(--sfx-space-2)]"
              data-testid="sf-date-range-picker-time-row"
            >
              <SFInput
                type="time"
                value={startTime ?? ""}
                onChange={(e) => onStartTimeChange?.(e.target.value)}
                aria-label="Start time"
              />
              <SFInput
                type="time"
                value={endTime ?? ""}
                onChange={(e) => onEndTimeChange?.(e.target.value)}
                aria-label="End time"
              />
            </div>
          )}
        </div>
      </SFPopoverContent>
    </SFPopover>
  );
}

// -----------------------------------------------------------------------
// Pattern C contract reminder (DR-05 + DR-06):
//   - SFDateRangePicker IS exported from components/sf/index.ts barrel
//   - Zero new runtime npm deps — react-day-picker (^9.14.0) and date-fns
//     (^4.1.0) ALREADY in package.json before this phase. date-fns is
//     TYPE-ONLY (`import type { Locale }`) — zero runtime code lands
//     in the bundle from this file.
//   - Composes SFCalendarLazy (NOT SFCalendar directly) — react-day-picker
//     stays in the deferred lazy chunk inherited from SFCalendarLazy's
//     dynamic({ ssr: false }) boundary; absent from homepage First Load JS.
//   - NEVER `import 'react-day-picker/dist/style.css'`. All styling via
//     classNames prop with rounded-none on every key + bg-primary
//     text-primary-foreground for selected/range_start/range_end +
//     bg-primary/20 for range_middle.
//   - new Date() ONLY inside useMemo (defaultMonth) and inside consumer
//     preset thunks (executed only on click). NEVER at module scope.
//   - Plan 02 chunk-grep DCE proof verifies react-day-picker IS in
//     app/showcase/date-range-picker chunks but ABSENT from homepage
//     chunks (pages-*.js, app-*.js, main-*.js).
// -----------------------------------------------------------------------
