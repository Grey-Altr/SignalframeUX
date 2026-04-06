import { cn } from "@/lib/utils";
import React from "react";

interface SFSectionProps extends React.ComponentProps<"section"> {
  label?: string;
  bgShift?: boolean;
  spacing?: "8" | "12" | "16" | "24";
}

const SFSection = React.forwardRef<HTMLElement, SFSectionProps>(
  function SFSection(
    { label, bgShift, spacing = "16", className, children, ...props },
    ref
  ) {
    return (
      <section
        ref={ref}
        data-section
        data-section-label={label}
        data-bg-shift={bgShift ? "" : undefined}
        className={cn(`py-${spacing}`, className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

SFSection.displayName = "SFSection";

export { SFSection };
