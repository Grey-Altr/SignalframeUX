"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SFSliderProps extends React.ComponentProps<typeof Slider> {}

export function SFSlider({ className, ...props }: SFSliderProps) {
  return (
    <Slider
      className={cn(
        "[&_[data-slot=slider-track]]:rounded-none [&_[data-slot=slider-track]]:h-[3px] [&_[data-slot=slider-track]]:bg-muted",
        "[&_[data-slot=slider-range]]:bg-primary",
        "[&_[data-slot=slider-thumb]]:rounded-none [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-foreground [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-thumb]]:size-4 [&_[data-slot=slider-thumb]]:ring-0",
        className
      )}
      {...props}
    />
  );
}
