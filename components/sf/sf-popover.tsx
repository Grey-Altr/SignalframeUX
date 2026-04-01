"use client";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function SFPopover(props: React.ComponentProps<typeof Popover>) {
  return <Popover {...props} />;
}

function SFPopoverTrigger(props: React.ComponentProps<typeof PopoverTrigger>) {
  return <PopoverTrigger {...props} />;
}

function SFPopoverContent({
  className,
  ...props
}: React.ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      className={cn(
        "rounded-none border-2 border-foreground bg-background shadow-none ring-0",
        className
      )}
      {...props}
    />
  );
}

function SFPopoverHeader({
  className,
  ...props
}: React.ComponentProps<typeof PopoverHeader>) {
  return (
    <PopoverHeader
      className={cn("border-b-2 border-foreground pb-2", className)}
      {...props}
    />
  );
}

function SFPopoverTitle({
  className,
  ...props
}: React.ComponentProps<typeof PopoverTitle>) {
  return (
    <PopoverTitle
      className={cn("font-mono uppercase tracking-wider text-xs", className)}
      {...props}
    />
  );
}

function SFPopoverDescription({
  className,
  ...props
}: React.ComponentProps<typeof PopoverDescription>) {
  return (
    <PopoverDescription
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}

export {
  SFPopover,
  SFPopoverTrigger,
  SFPopoverContent,
  SFPopoverHeader,
  SFPopoverTitle,
  SFPopoverDescription,
};
