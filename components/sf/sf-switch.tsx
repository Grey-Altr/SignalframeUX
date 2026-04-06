"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * Toggle switch input — FRAME layer form primitive.
 *
 * Radix Switch with SF styling: sharp corners (rounded-none), 2px
 * foreground border, primary fill on checked state, transparent when
 * unchecked, and sf-toggle-snap snap animation on the thumb.
 * Inherits all Radix SwitchProps.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFSwitch id="notifications" defaultChecked />
 * <SFLabel htmlFor="notifications">Enable notifications</SFLabel>
 */
export function SFSwitch({
  className,
  ...props
}: React.ComponentProps<typeof Switch>) {
  return (
    <Switch
      className={cn(
        "sf-focusable rounded-none border-2 border-foreground",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        "data-[state=unchecked]:bg-transparent",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "[&>span]:sf-toggle-snap",
        className
      )}
      {...props}
    />
  );
}
