import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Hover tooltip — FRAME layer contextual primitive.
 *
 * Radix Tooltip root wrapped with SF contract. Compose with
 * SFTooltipTrigger and SFTooltipContent for full tooltip behavior.
 * Content renders inverted (foreground bg, background text) in
 * font-mono uppercase with no border or border-radius.
 *
 * @example
 * <SFTooltip>
 *   <SFTooltipTrigger asChild><SFButton size="sm">?</SFButton></SFTooltipTrigger>
 *   <SFTooltipContent>Keyboard shortcut: ⌘K</SFTooltipContent>
 * </SFTooltip>
 */
function SFTooltip(props: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip {...props} />;
}

/** Sub-component of SFTooltip — floating label in inverted mono uppercase with no border or radius. */
function SFTooltipContent({
  className,
  ...props
}: React.ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipContent
      className={cn(
        "bg-foreground text-background font-mono text-xs uppercase tracking-wider",
        "border-0 rounded-none px-3 py-1.5",
        className
      )}
      {...props}
    />
  );
}

/** Sub-component of SFTooltip — trigger element that shows the tooltip on hover/focus. */
function SFTooltipTrigger(props: React.ComponentProps<typeof TooltipTrigger>) {
  return <TooltipTrigger {...props} />;
}

export {
  SFTooltip,
  SFTooltipContent,
  SFTooltipTrigger,
};
