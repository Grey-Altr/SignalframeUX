import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfAlertVariants = cva(
  "rounded-none border-2 font-mono text-sm",
  {
    variants: {
      intent: {
        info: "border-primary bg-primary/10 text-foreground [&>svg]:text-primary",
        warning:
          "border-accent bg-accent/10 text-foreground [&>svg]:text-accent",
        destructive:
          "border-destructive bg-destructive/10 text-foreground [&>svg]:text-destructive",
        success:
          "border-success bg-success/10 text-foreground [&>svg]:text-success",
      },
    },
    defaultVariants: {
      intent: "info",
    },
  }
);

interface SFAlertProps
  extends React.ComponentProps<typeof Alert>,
    VariantProps<typeof sfAlertVariants> {}

/**
 * Inline feedback banner — FRAME layer notification primitive.
 * Four intents: info (primary), warning (accent), destructive, success.
 *
 * Uses CVA with `intent` as the variant key. Overrides base alert's
 * rounded-lg with rounded-none and applies 2px border with
 * token-mapped background tints.
 *
 * @param intent - Visual variant. "info" | "warning" | "destructive" | "success"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFAlert intent="warning">
 *   <SFAlertTitle>Caution</SFAlertTitle>
 *   <SFAlertDescription>Check your input.</SFAlertDescription>
 * </SFAlert>
 */
function SFAlert({ intent, className, ...props }: SFAlertProps) {
  return (
    <Alert
      className={cn(sfAlertVariants({ intent }), className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFAlert — title in monospace uppercase with wider tracking.
 * @example
 * <SFAlertTitle>Warning</SFAlertTitle>
 */
function SFAlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertTitle>) {
  return (
    <AlertTitle
      className={cn("font-mono uppercase tracking-wider", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFAlert — description text rendered below the alert title.
 * @example
 * <SFAlertDescription>Your session will expire in 5 minutes.</SFAlertDescription>
 */
function SFAlertDescription(
  props: React.ComponentProps<typeof AlertDescription>
) {
  return <AlertDescription {...props} />;
}

export { SFAlert, SFAlertTitle, SFAlertDescription };
