"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

/**
 * Radio selection group — FRAME layer form primitive.
 *
 * Radix RadioGroup wrapped with SF grid layout. Use with
 * SFRadioGroupItem and SFLabel for full accessible radio sets.
 * Items render with sharp corners, 2px foreground border, and
 * sf-focusable keyboard indicator.
 *
 * @param className - Merged via cn() after grid base class
 *
 * @example
 * <SFRadioGroup defaultValue="option-a">
 *   <SFRadioGroupItem value="option-a" id="opt-a" />
 *   <SFLabel htmlFor="opt-a">Option A</SFLabel>
 * </SFRadioGroup>
 */
function SFRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroup>) {
  return <RadioGroup className={cn("grid gap-2", className)} {...props} />;
}

/** Sub-component of SFRadioGroup — individual radio button with SF sharp corners and focus indicator. */
function SFRadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupItem>) {
  return (
    <RadioGroupItem
      className={cn(
        "sf-focusable rounded-none border-2 border-foreground",
        "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  );
}

export { SFRadioGroup, SFRadioGroupItem };
