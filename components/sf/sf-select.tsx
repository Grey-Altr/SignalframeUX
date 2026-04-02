"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SFSelect = Select;

function SFSelectTrigger({
  className,
  ...props
}: React.ComponentProps<typeof SelectTrigger>) {
  return (
    <SelectTrigger
      className={cn(
        "rounded-none border-2 border-foreground bg-background font-mono uppercase tracking-wider text-xs",
        "focus:ring-0 focus:ring-offset-0 focus:bg-foreground focus:text-background",
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

const SFSelectValue = SelectValue;

export {
  SFSelect,
  SFSelectTrigger,
  SFSelectContent,
  SFSelectItem,
  SFSelectValue,
};
