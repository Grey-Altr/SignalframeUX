import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function SFTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      className={cn(
        "rounded-none border-2 border-foreground bg-transparent",
        "font-mono uppercase tracking-wider text-xs",
        "placeholder:text-muted-foreground placeholder:uppercase placeholder:tracking-wider",
        "shadow-none focus-visible:ring-0 focus-visible:border-primary",
        className
      )}
      {...props}
    />
  );
}
