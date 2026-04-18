"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Dropdown select input — FRAME layer form primitive.
 *
 * Radix Select root wrapped with SF contract. Compose with
 * SFSelectTrigger, SFSelectContent, SFSelectItem, SFSelectValue,
 * SFSelectGroup, and SFSelectLabel for a complete select control.
 * Trigger enforces font-mono, uppercase, sf-border-draw-focus.
 *
 * @example
 * <SFSelect>
 *   <SFSelectTrigger><SFSelectValue placeholder="Choose..." /></SFSelectTrigger>
 *   <SFSelectContent>
 *     <SFSelectItem value="a">Option A</SFSelectItem>
 *   </SFSelectContent>
 * </SFSelect>
 */
function SFSelect(props: React.ComponentProps<typeof Select>) {
  return <Select {...props} />;
}

/**
 * Sub-component of SFSelect — trigger button with sf-border-draw-focus, mono uppercase, and no ring.
 * @example
 * <SFSelectTrigger><SFSelectValue placeholder="Choose..." /></SFSelectTrigger>
 */
function SFSelectTrigger({
  className,
  ...props
}: React.ComponentProps<typeof SelectTrigger>) {
  return (
    <SelectTrigger
      className={cn(
        "sf-focusable sf-border-draw-focus rounded-none border-2 border-foreground bg-background font-mono uppercase tracking-wider text-xs",
        "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFSelect — dropdown panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFSelectContent><SFSelectItem value="a">Option A</SFSelectItem></SFSelectContent>
 */
function SFSelectContent({
  className,
  ...props
}: React.ComponentProps<typeof SelectContent>) {
  return (
    <SelectContent
      className={cn(
        "rounded-none border-2 border-foreground bg-background shadow-none",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFSelect — option item in mono uppercase; inverts colors on focus.
 * @example
 * <SFSelectItem value="dark">Dark</SFSelectItem>
 */
function SFSelectItem({
  className,
  ...props
}: React.ComponentProps<typeof SelectItem>) {
  return (
    <SelectItem
      className={cn(
        "rounded-none font-mono uppercase tracking-wider text-xs",
        "focus:bg-foreground focus:text-background",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFSelect — renders the currently selected value or placeholder inside SFSelectTrigger.
 * @example
 * <SFSelectValue placeholder="Select theme..." />
 */
function SFSelectValue(props: React.ComponentProps<typeof SelectValue>) {
  return <SelectValue {...props} />;
}

/**
 * Sub-component of SFSelect — groups related select items under a common label.
 * @example
 * <SFSelectGroup><SFSelectLabel>Themes</SFSelectLabel><SFSelectItem value="dark">Dark</SFSelectItem></SFSelectGroup>
 */
function SFSelectGroup(props: React.ComponentProps<typeof SelectGroup>) {
  return <SelectGroup {...props} />;
}

/**
 * Sub-component of SFSelect — non-interactive group label in muted mono uppercase at 2xs size.
 * @example
 * <SFSelectLabel>Color Themes</SFSelectLabel>
 */
function SFSelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectLabel>) {
  return (
    <SelectLabel
      className={cn(
        "rounded-none font-mono uppercase tracking-wider text-[var(--text-2xs)] text-muted-foreground px-[var(--sfx-space-2)] py-[var(--sfx-space-1)]",
        className
      )}
      {...props}
    />
  );
}

export {
  SFSelect,
  SFSelectTrigger,
  SFSelectContent,
  SFSelectGroup,
  SFSelectItem,
  SFSelectLabel,
  SFSelectValue,
};
