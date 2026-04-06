import { cn } from "@/lib/utils";
import React from "react";

interface SFSectionProps extends React.ComponentProps<"section"> {
  label?: string;
  bgShift?: boolean;
  spacing?: "8" | "12" | "16" | "24";
}

/**
 * Semantic page section — FRAME layer layout primitive.
 *
 * Renders a `<section>` with data-section always present. Applies
 * spacing variant mapped to blessed stops. Supports optional
 * data-section-label (CSS ::before content) and data-bg-shift
 * (scroll-triggered background toggle via GSAP).
 *
 * @param label - Optional label string applied as data-section-label
 * @param bgShift - Enables data-bg-shift presence attribute for GSAP scroll targeting
 * @param spacing - Vertical padding from blessed stops. "8" | "12" | "16" | "24"
 * @param className - Merged via cn() after spacing class
 *
 * @example
 * <SFSection label="Work" spacing="24" bgShift>
 *   <SFContainer>Content here</SFContainer>
 * </SFSection>
 */
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
