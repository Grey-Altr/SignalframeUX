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

/**
 * Floating content panel — FRAME layer overlay primitive.
 *
 * Radix Popover root wrapped with SF contract. Compose with
 * SFPopoverTrigger, SFPopoverContent, SFPopoverHeader,
 * SFPopoverTitle, and SFPopoverDescription for full popover structure.
 * Content applies sharp corners, 2px border, no shadow.
 *
 * @example
 * <SFPopover>
 *   <SFPopoverTrigger asChild><SFButton size="sm">Info</SFButton></SFPopoverTrigger>
 *   <SFPopoverContent>
 *     <SFPopoverHeader><SFPopoverTitle>Details</SFPopoverTitle></SFPopoverHeader>
 *   </SFPopoverContent>
 * </SFPopover>
 */
function SFPopover(props: React.ComponentProps<typeof Popover>) {
  return <Popover {...props} />;
}

/** Sub-component of SFPopover — trigger element that opens the floating panel on interaction. */
function SFPopoverTrigger(props: React.ComponentProps<typeof PopoverTrigger>) {
  return <PopoverTrigger {...props} />;
}

/** Sub-component of SFPopover — floating content panel with sharp corners, 2px border, and no shadow. */
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

/** Sub-component of SFPopover — header region with 2px bottom border separating it from content. */
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

/** Sub-component of SFPopover — title rendered in font-mono uppercase with letter-spacing. */
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

/** Sub-component of SFPopover — supporting description text in muted foreground at text-xs. */
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
