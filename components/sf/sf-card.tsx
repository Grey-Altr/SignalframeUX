import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BorderDraw } from "@/components/animation/border-draw";

interface SFCardProps extends React.ComponentProps<typeof Card> {
  hoverable?: boolean;
  /** Use clockwise magenta border-draw instead of simple color hover */
  borderDraw?: boolean;
}

/**
 * Content surface card — FRAME layer container primitive.
 *
 * Renders a bordered card with 2px foreground border and no shadow
 * (SF aesthetic contract: no elevation, only edge definition). Supports
 * optional hover color transition and SIGNAL-layer borderDraw animation.
 *
 * @param hoverable - Enables hover border color transition to primary
 * @param borderDraw - Replaces color hover with SIGNAL borderDraw animation (clockwise magenta stroke)
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFCard hoverable>
 *   <SFCardHeader><SFCardTitle>Project Alpha</SFCardTitle></SFCardHeader>
 *   <SFCardContent>Description text</SFCardContent>
 * </SFCard>
 */
function SFCard({ className, hoverable = false, borderDraw = false, ...props }: SFCardProps) {
  const card = (
    <Card
      className={cn(
        "border-2 border-foreground bg-background shadow-none",
        hoverable && !borderDraw &&
          "sf-hoverable transition-colors duration-[var(--duration-fast)] hover:border-primary",
        className
      )}
      {...props}
    />
  );

  if (borderDraw) {
    return <BorderDraw>{card}</BorderDraw>;
  }

  return card;
}

/** Sub-component of SFCard — renders the card header region with reduced bottom padding. */
function SFCardHeader({
  className,
  ...props
}: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn("pb-3", className)} {...props} />;
}

/** Sub-component of SFCard — renders the card title in font-mono uppercase. */
function SFCardTitle({
  className,
  ...props
}: React.ComponentProps<typeof CardTitle>) {
  return (
    <CardTitle
      className={cn("font-mono uppercase tracking-wider text-sm", className)}
      {...props}
    />
  );
}

/** Sub-component of SFCard — renders the card description in muted foreground at text-xs. */
function SFCardDescription({
  className,
  ...props
}: React.ComponentProps<typeof CardDescription>) {
  return (
    <CardDescription
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}

/** Sub-component of SFCard — renders the main card body content region with p-4 padding. */
function SFCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("p-4", className)} {...props} />;
}

/** Sub-component of SFCard — renders the card footer region, flush bottom with no top gap. */
function SFCardFooter({
  className,
  ...props
}: React.ComponentProps<typeof CardFooter>) {
  return <CardFooter className={cn("p-4 pt-0", className)} {...props} />;
}

export {
  SFCard,
  SFCardHeader,
  SFCardTitle,
  SFCardDescription,
  SFCardContent,
  SFCardFooter,
};
