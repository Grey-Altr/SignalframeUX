import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Text input field — FRAME layer form primitive.
 *
 * Enforces SF input contract: font-mono, uppercase, 2px foreground border,
 * sf-focusable keyboard indicator, and sf-border-draw-focus for SIGNAL-layer
 * focus animation. Placeholder inherits uppercase and tracking styles.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFInput placeholder="Enter value" />
 * <SFInput type="email" placeholder="you@studio.com" />
 */
export function SFInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "sf-focusable sf-border-draw-focus font-mono uppercase tracking-wider text-xs border-2 border-foreground bg-background",
        "focus-visible:ring-0",
        "placeholder:text-muted-foreground placeholder:uppercase placeholder:tracking-wider",
        className
      )}
      {...props}
    />
  );
}
