"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

function SFScrollBar({
  className,
  ...props
}: React.ComponentProps<typeof ScrollBar>) {
  return (
    <ScrollBar
      className={cn(
        "[&>div]:rounded-none",
        className
      )}
      {...props}
    />
  );
}

export { SFScrollArea, SFScrollBar };
