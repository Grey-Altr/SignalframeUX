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

function SFSelect(props: React.ComponentProps<typeof Select>) {
  return <Select {...props} />;
}

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

function SFSelectValue(props: React.ComponentProps<typeof SelectValue>) {
  return <SelectValue {...props} />;
}

function SFSelectGroup(props: React.ComponentProps<typeof SelectGroup>) {
  return <SelectGroup {...props} />;
}

function SFSelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectLabel>) {
  return (
    <SelectLabel
      className={cn(
        "rounded-none font-mono uppercase tracking-wider text-[var(--text-2xs)] text-muted-foreground px-2 py-1.5",
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
