import { cn } from "@/lib/utils";
import React from "react";

type PanelMode = "fit" | "fill";

interface SFPanelProps extends Omit<React.ComponentProps<"section">, "name"> {
  name: string;
  mode?: PanelMode;
  label?: string;
  bgShift?: "white" | "black";
}

/**
 * R-63-f · FRAME layer panel primitive — the v1-lock canonical page primitive.
 *
 * Enforces the panel box contract: `height: var(--sf-panel-height)` (dvh),
 * `overflow: hidden`. No internal scroll (R-63-c) — content that exceeds the
 * port either recomposes (fit) or paginates across panels (R-63-g).
 *
 * One panel per keyboard frame per R-64. Pinned sections count as one panel
 * externally (R-63-e, D-11) — PinnedSection still composes internally and
 * consumes N × port of scroll; R-64 skips the entire pin on one keystroke.
 *
 * @param name - Required. Sets `data-section={name}`. Used by useFrameNavigation.
 * @param mode - Authorial mode (R-63-d). "fit" = content composes inside the
 *               port, fluid type. "fill" = content fills edge-to-edge. Defaults
 *               to "fit".
 * @param label - Optional. Sets `data-section-label` for CSS ::before content.
 * @param bgShift - Optional. Sets `data-bg-shift` for GSAP bg-shift targeting.
 *
 * @example
 *   <SFPanel name="thesis" mode="fit" label="02//THESIS">
 *     <SFContainer>Statements here</SFContainer>
 *   </SFPanel>
 */
const SFPanel = React.forwardRef<HTMLElement, SFPanelProps>(function SFPanel(
  { name, mode = "fit", label, bgShift, className, children, ...props },
  ref,
) {
  return (
    <section
      ref={ref}
      data-section={name}
      data-section-label={label}
      data-bg-shift={bgShift}
      data-panel-mode={mode}
      className={cn(
        "h-[var(--sf-panel-height)] overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
});

SFPanel.displayName = "SFPanel";

export { SFPanel, type PanelMode };
