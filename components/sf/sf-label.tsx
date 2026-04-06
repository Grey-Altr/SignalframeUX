"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Form field label — FRAME layer typography primitive.
 *
 * Associates with an input via htmlFor. Renders in font-mono uppercase
 * with tracking-wider and text-xs — consistent with other form
 * chrome elements (SFInput, SFCheckbox).
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFLabel htmlFor="project-name">Project Name</SFLabel>
 * <SFInput id="project-name" placeholder="Untitled" />
 */
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
