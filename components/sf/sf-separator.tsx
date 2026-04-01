import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SFSeparatorProps extends React.ComponentProps<typeof Separator> {
  weight?: "thin" | "normal" | "heavy";
}

export function SFSeparator({
  className,
  weight = "normal",
  ...props
}: SFSeparatorProps) {
  return (
    <Separator
      className={cn(
        "bg-foreground",
        weight === "thin" && "h-px",
        weight === "normal" && "h-[2px]",
        weight === "heavy" && "h-[3px]",
        className
      )}
      {...props}
    />
  );
}
