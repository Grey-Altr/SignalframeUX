"use client";

import { Toggle } from "@/components/ui/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfToggleVariants = cva(
  "rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs transition-colors duration-[var(--duration-fast)]",
  {
    variants: {
      intent: {
        default:
          "bg-transparent text-foreground hover:bg-foreground hover:text-background aria-pressed:bg-foreground aria-pressed:text-background data-[state=on]:bg-foreground data-[state=on]:text-background",
        primary:
          "bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
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
