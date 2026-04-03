import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
