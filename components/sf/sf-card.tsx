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

function SFCardHeader({
  className,
  ...props
}: React.ComponentProps<typeof CardHeader>) {
  return <CardHeader className={cn("pb-3", className)} {...props} />;
}

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

function SFCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("p-4", className)} {...props} />;
}

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
