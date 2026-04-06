import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const sfStackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row flex-wrap",
    },
    gap: {
      "1": "gap-1",
      "2": "gap-2",
      "3": "gap-3",
      "4": "gap-4",
      "6": "gap-6",
      "8": "gap-8",
      "12": "gap-12",
      "16": "gap-16",
      "24": "gap-24",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    direction: "vertical",
    gap: "4",
    align: "stretch",
  },
});

interface SFStackProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof sfStackVariants> {}

const SFStack = React.forwardRef<HTMLDivElement, SFStackProps>(
  function SFStack({ direction, gap, align, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(sfStackVariants({ direction, gap, align }), className)}
        {...props}
      />
    );
  }
);

SFStack.displayName = "SFStack";

export { SFStack };
