"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * Toggle checkbox input — FRAME layer form primitive.
 *
 * Radix Checkbox wrapped with SF styling: sharp corners (rounded-none),
 * 2px foreground border, primary fill on checked state, and
 * sf-focusable keyboard indicator. Inherits all Radix CheckboxProps.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFCheckbox id="terms" />
 * <SFLabel htmlFor="terms">Accept terms</SFLabel>
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
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  );
}
