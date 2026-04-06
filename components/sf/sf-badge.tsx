import { Badge } from "@/components/ui/badge";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfBadgeVariants = cva(
  "font-mono uppercase tracking-wider text-xs",
  {
    variants: {
      intent: {
        default: "border-2 border-foreground bg-foreground text-background",
        primary: "border-2 border-primary bg-primary text-primary-foreground",
        outline: "bg-transparent text-foreground border-2 border-foreground",
        signal: "border-2 border-foreground bg-[var(--sf-yellow)] text-foreground",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

interface SFBadgeProps
  extends React.ComponentProps<typeof Badge>,
    VariantProps<typeof sfBadgeVariants> {}

/**
 * Status indicator badge — FRAME layer label primitive.
 *
 * Renders a small monospace uppercase badge. Enforces 2px border,
 * font-mono, uppercase, and tracking-wider across all intents.
 * "signal" uses sf-yellow accent — use sparingly.
 *
 * @param intent - Visual variant. "default" | "primary" | "outline" | "signal"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFBadge intent="primary">Active</SFBadge>
 * <SFBadge intent="outline">Draft</SFBadge>
 */
export function SFBadge({ intent, className, ...props }: SFBadgeProps) {
  return (
    <Badge
      className={cn(sfBadgeVariants({ intent }), className)}
      {...props}
    />
  );
}
