"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/**
 * Custom scroll container — FRAME layer overflow primitive.
 *
 * Radix ScrollArea with SF-styled thumb: sharp corners and
 * foreground/30 color replacing the default rounded thumb.
 * Use when content overflows a constrained height and native
 * scrollbar styling conflicts with the SF aesthetic.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFScrollArea className="h-64">
 *   <div className="p-4">{longContent}</div>
 * </SFScrollArea>
 */
function SFScrollArea({
  className,
  ...props
}: React.ComponentProps<typeof ScrollArea>) {
  return (
    <ScrollArea
      className={cn(
        "[&_[data-slot=scroll-area-thumb]]:rounded-none [&_[data-slot=scroll-area-thumb]]:bg-foreground/30",
        className
      )}
      {...props}
    />
  );
}

/** Sub-component of SFScrollArea — scrollbar track with sharp corners, composable with SFScrollArea. */
function SFScrollBar({
  className,
  ...props
}: React.ComponentProps<typeof ScrollBar>) {
  return (
    <ScrollBar
      className={cn(
        "rounded-none [&_[data-slot=scroll-area-scrollbar]]:rounded-none",
        className
      )}
      {...props}
    />
  );
}

export { SFScrollArea, SFScrollBar };
