"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function SFDropdownMenu(props: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu {...props} />;
}

function SFDropdownMenuTrigger(
  props: React.ComponentProps<typeof DropdownMenuTrigger>
) {
  return <DropdownMenuTrigger {...props} />;
}

function SFDropdownMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      className={cn(
        "rounded-none border-2 border-foreground bg-background shadow-none ring-0",
        className
      )}
      {...props}
    />
  );
}

function SFDropdownMenuGroup({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuGroup>) {
  return (
    <DropdownMenuGroup
      className={cn(
        "**:[[data-slot=dropdown-menu-label]]:font-mono **:[[data-slot=dropdown-menu-label]]:uppercase **:[[data-slot=dropdown-menu-label]]:tracking-[0.15em]",
        className
      )}
      {...props}
    />
  );
}

function SFDropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      className={cn(
        "rounded-none font-mono uppercase tracking-wider text-xs cursor-pointer focus:bg-foreground focus:text-background",
        className
      )}
      {...props}
    />
  );
}

function SFDropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuLabel>) {
  return (
    <DropdownMenuLabel
      className={cn(
        "font-mono uppercase tracking-[0.15em] text-[var(--text-xs)] text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function SFDropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuShortcut>) {
  return (
    <DropdownMenuShortcut
      className={cn("font-mono uppercase tracking-wider text-xs", className)}
      {...props}
    />
  );
}

function SFDropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return (
    <DropdownMenuSeparator
      className={cn("bg-foreground h-[var(--border-element)]", className)}
      {...props}
    />
  );
}

export {
  SFDropdownMenu,
  SFDropdownMenuTrigger,
  SFDropdownMenuContent,
  SFDropdownMenuGroup,
  SFDropdownMenuItem,
  SFDropdownMenuLabel,
  SFDropdownMenuSeparator,
  SFDropdownMenuShortcut,
};
