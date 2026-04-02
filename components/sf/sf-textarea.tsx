"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function SFTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      className={cn(
        "rounded-none border-2 border-b-foreground border-x-0 border-t-0 bg-transparent",
        "font-mono uppercase tracking-wider text-xs",
        "placeholder:text-muted-foreground",
        "shadow-none focus-visible:ring-0 focus-visible:border-primary",
        className
      )}
      {...props}
    />
  );
}
