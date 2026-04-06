import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

/**
 * Multi-line text input — FRAME layer form primitive.
 *
 * Enforces SF textarea contract: font-mono, uppercase, 2px foreground
 * border, sf-border-draw-focus SIGNAL animation on focus, no shadow,
 * no ring. Placeholder inherits uppercase and tracking styles.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFTextarea placeholder="Enter notes..." rows={4} />
 * <SFTextarea placeholder="Description" className="min-h-32" />
 */
export function SFTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      className={cn(
        "sf-focusable sf-border-draw-focus rounded-none border-2 border-foreground bg-background",
        "font-mono uppercase tracking-wider text-xs",
        "placeholder:text-muted-foreground placeholder:uppercase placeholder:tracking-wider",
        "shadow-none focus-visible:ring-0",
        className
      )}
      {...props}
    />
  );
}
