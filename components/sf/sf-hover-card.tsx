"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";

/**
 * Hover/focus preview panel — FRAME layer overlay primitive.
 *
 * Radix HoverCard wrapped with SF contract. Content applies sharp corners,
 * 2px border, no shadow. Keyboard accessible via Radix open-on-focus.
 *
 * @example
 * <SFHoverCard>
 *   <SFHoverCardTrigger asChild><SFButton>Preview</SFButton></SFHoverCardTrigger>
 *   <SFHoverCardContent>Card details here</SFHoverCardContent>
 * </SFHoverCard>
 */
function SFHoverCard(props: React.ComponentProps<typeof HoverCard>) {
  return <HoverCard {...props} />;
}

/**
 * Sub-component of SFHoverCard — trigger that opens on hover or keyboard focus.
 * @example
 * <SFHoverCardTrigger asChild><SFButton>Preview</SFButton></SFHoverCardTrigger>
 */
function SFHoverCardTrigger(
  props: React.ComponentProps<typeof HoverCardTrigger>
) {
  return <HoverCardTrigger {...props} />;
}

/**
 * Sub-component of SFHoverCard — floating content panel with sharp corners, 2px border, no shadow.
 * @example
 * <SFHoverCardContent><p className="text-xs font-mono">Component details</p></SFHoverCardContent>
 */
function SFHoverCardContent({
  className,
  ...props
}: React.ComponentProps<typeof HoverCardContent>) {
  return (
    <HoverCardContent
      className={cn(
        "rounded-none border-2 border-foreground bg-background shadow-none ring-0",
        className
      )}
      {...props}
    />
  );
}

export { SFHoverCard, SFHoverCardTrigger, SFHoverCardContent };
