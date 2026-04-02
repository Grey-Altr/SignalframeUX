"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

function SFRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroup>) {
  return <RadioGroup className={cn("grid gap-2", className)} {...props} />;
}

function SFRadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupItem>) {
  return (
    <RadioGroupItem
      className={cn(
        "rounded-none border-2 border-foreground",
        "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
        className
      )}
      {...props}
    />
  );
}

export { SFRadioGroup, SFRadioGroupItem };
