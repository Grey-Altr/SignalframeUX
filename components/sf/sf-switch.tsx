"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export function SFSwitch({
  className,
  ...props
}: React.ComponentProps<typeof Switch>) {
  return (
    <Switch
      className={cn(
        "rounded-none border-2 border-foreground",
        "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
        "data-[state=unchecked]:bg-transparent",
        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className
      )}
      {...props}
    />
  );
}
