"use client";

import { Toggle } from "@/components/ui/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfToggleVariants = cva(
  "sf-pressable sf-focusable rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs transition-colors duration-[var(--sfx-duration-fast)]",
  {
    variants: {
      intent: {
        default:
          "bg-transparent text-foreground hover:bg-foreground hover:text-background data-[state=on]:bg-foreground data-[state=on]:text-background",
        primary:
          "bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
      },
      size: {
        sm: "h-8 min-w-8 px-3",
        md: "h-10 min-w-10 px-4",
        lg: "h-12 min-w-12 px-6",
      },
    },
    defaultVariants: {
      intent: "default",
      size: "md",
    },
  }
);

interface SFToggleProps
  extends Omit<React.ComponentProps<typeof Toggle>, "size">,
    VariantProps<typeof sfToggleVariants> {}

/**
 * Pressable toggle button — FRAME layer interactive primitive.
 *
 * Radix Toggle with SF styling: sharp corners, 2px border, sf-pressable
 * press transform, and inverted fill on active state. Use for binary
 * on/off controls like filter chips or view mode switches.
 *
 * @param intent - Visual variant. "default" | "primary"
 * @param size - Height and padding scale. "sm" | "md" | "lg"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFToggle intent="default" size="md">Grid</SFToggle>
 * <SFToggle intent="primary" pressed>Active</SFToggle>
 */
export function SFToggle({
  intent,
  size,
  className,
  ...props
}: SFToggleProps) {
  return (
    <Toggle
      className={cn(sfToggleVariants({ intent, size }), className)}
      {...props}
    />
  );
}
