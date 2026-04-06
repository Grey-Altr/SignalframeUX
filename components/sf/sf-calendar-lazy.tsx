"use client";

/**
 * Lazy loader for SFCalendar -- loads react-day-picker only when rendered.
 *
 * P3 component: never exported from sf/index.ts barrel.
 * Import this file directly when you need a calendar.
 *
 * @example
 * ```tsx
 * import { SFCalendarLazy } from "@/components/sf/sf-calendar-lazy";
 *
 * <SFCalendarLazy />
 * ```
 */

import dynamic from "next/dynamic";
import { SFSkeleton } from "@/components/sf";

const SFCalendarDynamic = dynamic(
  () =>
    import("@/components/sf/sf-calendar").then((m) => ({
      default: m.SFCalendar,
    })),
  {
    ssr: false,
    loading: () => <SFSkeleton className="h-[350px] w-[280px]" />,
  }
);

export function SFCalendarLazy(
  props: React.ComponentProps<typeof SFCalendarDynamic>
) {
  return <SFCalendarDynamic {...props} />;
}
