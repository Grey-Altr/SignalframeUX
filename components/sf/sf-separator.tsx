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
  const isVertical = props.orientation === "vertical";
  return (
    <Separator
      className={cn(
        "bg-foreground",
        !isVertical && weight === "thin" && "h-px",
        !isVertical && weight === "normal" && "h-[2px]",
        !isVertical && weight === "heavy" && "h-[3px]",
        isVertical && weight === "thin" && "w-px",
        isVertical && weight === "normal" && "w-[2px]",
        isVertical && weight === "heavy" && "w-[3px]",
        className
      )}
      {...props}
    />
  );
}
