import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

function SFTooltip(props: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip {...props} />;
}

function SFTooltipContent({
  className,
  ...props
}: React.ComponentProps<typeof TooltipContent>) {
  return (
    <TooltipContent
      className={cn(
        "bg-foreground text-background font-mono text-xs uppercase tracking-wider",
        "border-0 rounded-none px-3 py-1.5",
        className
      )}
      {...props}
    />
  );
}

function SFTooltipTrigger(props: React.ComponentProps<typeof TooltipTrigger>) {
  return <TooltipTrigger {...props} />;
}

export {
  SFTooltip,
  SFTooltipContent,
  SFTooltipTrigger,
};
