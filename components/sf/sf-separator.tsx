"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SFSeparatorProps extends React.ComponentProps<typeof Separator> {
  weight?: "thin" | "normal" | "heavy";
}

/**
 * Visual divider — FRAME layer structural primitive.
 *
 * Radix Separator with SF foreground color and three weight variants
 * mapped to border token values. Supports both horizontal (default)
 * and vertical orientation.
 *
 * @param orientation - Layout direction. "horizontal" | "vertical"
 * @param weight - Line thickness variant. "thin" | "normal" | "heavy"
 * @param className - Merged via cn() after weight/orientation classes
 *
 * @example
 * <SFSeparator weight="normal" />
 * <SFSeparator orientation="vertical" weight="thin" className="h-6" />
 */
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
