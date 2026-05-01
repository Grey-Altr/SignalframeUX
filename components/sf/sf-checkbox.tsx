"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * Toggle checkbox input — FRAME layer form primitive.
 *
 * Radix Checkbox wrapped with SF styling: sharp corners (rounded-none),
 * 2px foreground border, primary fill on checked state, horizontal-bar
 * fill on indeterminate state (DU/TDR coded register; geometric, FRAME-aligned),
 * and sf-focusable keyboard indicator. Inherits all Radix CheckboxProps.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFCheckbox id="terms" />
 * <SFLabel htmlFor="terms">Accept terms</SFLabel>
 *
 * @example
 * <SFCheckbox checked="indeterminate" /> // header in some-rows-selected state
 */
export function SFCheckbox({
  className,
  ...props
}: React.ComponentProps<typeof Checkbox>) {
  return (
    <Checkbox
      className={cn(
        "sf-focusable rounded-none border-2 border-foreground",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:relative data-[state=indeterminate]:before:absolute data-[state=indeterminate]:before:inset-x-1 data-[state=indeterminate]:before:top-1/2 data-[state=indeterminate]:before:-translate-y-1/2 data-[state=indeterminate]:before:h-[2px] data-[state=indeterminate]:before:bg-primary-foreground data-[state=indeterminate]:before:content-['']",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  );
}
