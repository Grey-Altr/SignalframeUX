import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sfButtonVariants = cva(
  "font-mono uppercase tracking-wider border-2 border-foreground transition-colors duration-[var(--duration-normal)] ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer",
  {
    variants: {
      intent: {
        primary:
          "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
        ghost:
          "bg-transparent text-foreground hover:bg-foreground hover:text-background",
        signal:
          "bg-foreground text-background border-primary hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

interface SFButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "size">,
    VariantProps<typeof sfButtonVariants> {}

export function SFButton({
  intent,
  size,
  className,
  ...props
}: SFButtonProps) {
  return (
    <Button
      className={cn(sfButtonVariants({ intent, size }), className)}
      {...props}
    />
  );
}
