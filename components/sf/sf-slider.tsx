"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function SFSlider({ className, ...props }: React.ComponentProps<typeof Slider>) {
  return (
    <Slider
      className={cn(
        "[&_[data-slot=slider-track]]:rounded-none [&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-track]]:bg-muted",
        "[&_[data-slot=slider-range]]:bg-primary",
        "[&_[data-slot=slider-thumb]]:sf-focusable [&_[data-slot=slider-thumb]]:rounded-none [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-foreground [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:ring-0",
        className
      )}
      {...props}
    />
  );
}
