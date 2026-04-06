import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const sfContainerVariants = cva(
  "w-full mx-auto px-[var(--gutter-sm)] md:px-[var(--gutter)]",
  {
    variants: {
      width: {
        wide: "max-w-[var(--max-w-wide)]",
        content: "max-w-[var(--max-w-content)]",
        full: "max-w-[var(--max-w-full)]",
      },
    },
    defaultVariants: {
      width: "wide",
    },
  }
);

interface SFContainerProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof sfContainerVariants> {}

const SFContainer = React.forwardRef<HTMLDivElement, SFContainerProps>(
  function SFContainer({ width, className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(sfContainerVariants({ width }), className)}
        {...props}
      />
    );
  }
);

SFContainer.displayName = "SFContainer";

export { SFContainer };
