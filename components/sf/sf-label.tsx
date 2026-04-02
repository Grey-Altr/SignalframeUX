"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SFLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        "font-mono uppercase tracking-wider text-xs",
        className
      )}
      {...props}
    />
  );
}
