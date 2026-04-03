"use client";

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
        !isVertical && weight === "normal" && "h-[var(--border-element)]",
        !isVertical && weight === "heavy" && "h-[var(--border-divider)]",
        isVertical && weight === "thin" && "w-px",
        isVertical && weight === "normal" && "w-[var(--border-element)]",
        isVertical && weight === "heavy" && "w-[var(--border-divider)]",
        className
      )}
      {...props}
    />
  );
}
