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

/**
 * Responsive page container — FRAME layer layout primitive.
 *
 * Enforces max-width tokens and responsive gutters defined in globals.css.
 * Default width is "wide" for most page sections. Use "content" for
 * prose/readable text columns.
 *
 * @param width - Max-width variant. "wide" | "content" | "full"
 * @param className - Merged via cn() after variant classes
 *
 * @example
 * <SFContainer width="content">
 *   <SFText variant="body">Readable prose column</SFText>
 * </SFContainer>
 */
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
