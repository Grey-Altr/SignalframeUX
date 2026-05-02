"use client";

/**
 * SFDateRangePicker showcase — Plan 02 Playwright hydration spec + DCE chunk-grep fixture.
 *
 * Sections (testid prefix `fixture-{section}`):
 *   1. fixture-uncontrolled-range      — uncontrolled range mode, no presets
 *   2. fixture-controlled-presets      — controlled range mode with presets (LAST 7, 30 DAYS, THIS MONTH)
 *   3. fixture-withtime                — range mode with withTime variant (inline time inputs)
 *
 * Not in sitemap. Not linked from public nav. Witness route for Plan 02 chunk-grep:
 * verifies react-day-picker IS present in `app/showcase/date-range-picker/*` chunks
 * but ABSENT from homepage chunks (pages-*.js, app-*.js, main-*.js).
 */

import { useState } from "react";
import { subDays, startOfMonth } from "date-fns";
import {
  SFDateRangePicker,
  type DateRange,
  type SFDateRangePreset,
} from "@/components/sf";

const PRESETS: SFDateRangePreset[] = [
  {
    label: "LAST 7 DAYS",
    getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }),
  },
  {
    label: "LAST 30 DAYS",
    getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }),
  },
  {
    label: "THIS MONTH",
    getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }),
  },
];

export default function ShowcaseDateRangePickerPage() {
  // Section 1: uncontrolled-feeling (controlled, but logs only)
  const [section1Range, setSection1Range] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Section 2: controlled with presets — JSON echo of selected range
  const [section2Range, setSection2Range] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  // Section 3: withTime variant
  const [section3Range, setSection3Range] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [section3StartTime, setSection3StartTime] = useState<string>("");
  const [section3EndTime, setSection3EndTime] = useState<string>("");

  return (
    <main
      data-testid="sf-date-range-picker-showcase"
      className="p-[var(--sfx-space-6)] space-y-[var(--sfx-space-12)] bg-background text-foreground"
    >
      <h1 className="font-mono uppercase tracking-wider text-2xl">
        SFDateRangePicker // Showcase
      </h1>

      {/* Section 1: uncontrolled-feeling range mode */}
      <section
        data-testid="fixture-uncontrolled-range"
        aria-label="Uncontrolled range mode date picker"
      >
        <h2 className="font-mono uppercase tracking-wider text-sm mb-[var(--sfx-space-3)]">
          {"// 01 // Uncontrolled // Range mode"}
        </h2>
        <SFDateRangePicker
          mode="range"
          value={section1Range}
          onValueChange={setSection1Range}
          placeholder="SELECT DATE RANGE"
        />
      </section>

      {/* Section 2: controlled with presets — JSON echo */}
      <section
        data-testid="fixture-controlled-presets"
        aria-label="Controlled range mode with presets"
      >
        <h2 className="font-mono uppercase tracking-wider text-sm mb-[var(--sfx-space-3)]">
          {"// 02 // Controlled // Presets // Range echo"}
        </h2>
        <SFDateRangePicker
          mode="range"
          value={section2Range}
          onValueChange={setSection2Range}
          presets={PRESETS}
          placeholder="SELECT DATE RANGE"
        />
        <pre
          data-testid="fixture-controlled-output"
          className="mt-[var(--sfx-space-3)] p-[var(--sfx-space-3)] border-2 border-foreground bg-muted font-mono text-xs whitespace-pre-wrap break-all"
        >
          {JSON.stringify(
            {
              from: section2Range?.from ? section2Range.from.toISOString().split("T")[0] : null,
              to: section2Range?.to ? section2Range.to.toISOString().split("T")[0] : null,
            },
            null,
            2
          )}
        </pre>
      </section>

      {/* Section 3: withTime variant */}
      <section
        data-testid="fixture-withtime"
        aria-label="Range mode with time inputs"
      >
        <h2 className="font-mono uppercase tracking-wider text-sm mb-[var(--sfx-space-3)]">
          {"// 03 // With Time // Range + Time inputs"}
        </h2>
        <SFDateRangePicker
          mode="range"
          value={section3Range}
          onValueChange={setSection3Range}
          withTime
          startTime={section3StartTime}
          endTime={section3EndTime}
          onStartTimeChange={setSection3StartTime}
          onEndTimeChange={setSection3EndTime}
          placeholder="SELECT DATE RANGE"
        />
        <pre
          data-testid="fixture-withtime-output"
          className="mt-[var(--sfx-space-3)] p-[var(--sfx-space-3)] border-2 border-foreground bg-muted font-mono text-xs whitespace-pre-wrap break-all"
        >
          {JSON.stringify(
            {
              from: section3Range?.from ? section3Range.from.toISOString().split("T")[0] : null,
              to: section3Range?.to ? section3Range.to.toISOString().split("T")[0] : null,
              startTime: section3StartTime || null,
              endTime: section3EndTime || null,
            },
            null,
            2
          )}
        </pre>
      </section>
    </main>
  );
}
