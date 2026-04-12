import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfButtonVariants = cva(
  "sf-pressable sf-focusable font-mono uppercase tracking-wider border-2 border-foreground transition-colors duration-[var(--sfx-duration-fast)] ease-[var(--sfx-ease-default)] cursor-pointer",
  {
    variants: {
      intent: {
        primary:
          "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
        ghost:
          "sf-border-thicken bg-transparent text-foreground hover:bg-foreground hover:text-background",
        // signal: pre-standard extension — kept for SignalframeUX brand accent usage.
        // Blessed intent set: default, primary, secondary, destructive, ghost, outline.
        signal:
          "bg-foreground text-background border-primary hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-12 text-lg",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

interface SFButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "size">,
    VariantProps<typeof sfButtonVariants> {}

/**
 * Primary action button — FRAME layer interactive primitive.
 *
 * Enforces SF button contract: font-mono, uppercase, 2px border,
 * asymmetric hover timing (100ms in / 400ms out), and press transform
 * via .sf-pressable. "signal" intent uses primary border accent — use
 * for brand-level CTAs only.
 *
 * @param intent - Visual variant. "primary" | "ghost" | "signal"
 * @param size - Height and padding scale. "sm" | "md" | "lg" | "xl"
 * @param className - Merged via cn() — appended, never replaces base classes
 *
 * @example
 * <SFButton intent="primary" size="md">Launch</SFButton>
 * <SFButton intent="ghost" size="sm" onClick={handleCancel}>Cancel</SFButton>
 */
export function SFButton({
  intent,
  size,
  className,
  ...props
}: SFButtonProps) {
  return (
    <Button
      className={cn(sfButtonVariants({ intent, size }), className)}
      {...props}
    />
  );
}
