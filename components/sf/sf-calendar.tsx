"use client";

/**
 * SFCalendar -- FRAME layer date picker with zero border-radius.
 *
 * P3 lazy component: import via sf-calendar-lazy.tsx, NOT from sf/index.ts.
 *
 * Wraps the shadcn Calendar (react-day-picker) with DU/TDR industrial styling:
 * sharp corners on every sub-element, 2px border, no decorative rounding.
 *
 * @example
 * ```tsx
 * import { SFCalendarLazy } from "@/components/sf/sf-calendar-lazy";
 *
 * <SFCalendarLazy />
 * ```
 */

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type SFCalendarProps = React.ComponentProps<typeof Calendar>;

function SFCalendar({ className, classNames, ...props }: SFCalendarProps) {
  return (
    <Calendar
      className={cn(
        "rounded-none border-2 border-border [--cell-radius:0px]",
        className
      )}
      classNames={{
        dropdown_root: "rounded-none",
        caption_label: "rounded-none",
        weekday: "rounded-none",
        day: "rounded-none",
        range_start: "rounded-none",
        range_middle: "rounded-none",
        range_end: "rounded-none",
        today: "rounded-none data-[selected=true]:rounded-none",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { SFCalendar };
export type { SFCalendarProps };
