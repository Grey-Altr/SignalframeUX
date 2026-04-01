import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SFInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        "font-mono border-2 border-foreground bg-background",
        "focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-0",
        "placeholder:text-muted-foreground placeholder:uppercase placeholder:tracking-wider",
        className
      )}
      {...props}
    />
  );
}
