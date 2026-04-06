import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const sfGridVariants = cva("grid", {
  variants: {
    cols: {
      "1": "grid-cols-1",
      "2": "grid-cols-1 md:grid-cols-2",
      "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      auto: "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]",
    },
    gap: {
      "4": "gap-4",
      "6": "gap-6",
      "8": "gap-8",
    },
  },
  defaultVariants: {
    cols: "3",
    gap: "6",
  },
});

interface SFGridProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof sfGridVariants> {}

const SFGrid = React.forwardRef<HTMLDivElement, SFGridProps>(
  function SFGrid({ cols, gap, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(sfGridVariants({ cols, gap }), className)}
        {...props}
      />
    );
  }
);

SFGrid.displayName = "SFGrid";

export { SFGrid };
