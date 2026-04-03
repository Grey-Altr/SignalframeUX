"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

function SFCommand({
  className,
  ...props
}: React.ComponentProps<typeof Command>) {
  return (
    <Command
      className={cn(
        "rounded-none border-2 border-foreground bg-background",
        className
      )}
      {...props}
    />
  );
}

function SFCommandDialog({
  className,
  ...props
}: React.ComponentProps<typeof CommandDialog>) {
  return <CommandDialog className={cn("rounded-none", className)} {...props} />;
}

function SFCommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandInput>) {
  return (
    <CommandInput
      className={cn("font-mono uppercase tracking-wider text-xs", className)}
      {...props}
    />
  );
}

function SFCommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandList>) {
  return (
    <CommandList
      className={cn("font-mono text-xs", className)}
      {...props}
    />
  );
}

function SFCommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandEmpty>) {
  return (
    <CommandEmpty
      className={cn("font-mono uppercase tracking-wider text-xs", className)}
      {...props}
    />
  );
}

function SFCommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandGroup>) {
  return (
    <CommandGroup
      className={cn(
        "**:[[cmdk-group-heading]]:font-mono **:[[cmdk-group-heading]]:uppercase **:[[cmdk-group-heading]]:tracking-[0.15em] **:[[cmdk-group-heading]]:text-[var(--text-xs)]",
        className
      )}
      {...props}
    />
  );
}

function SFCommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandItem>) {
  return (
    <CommandItem
      className={cn(
        "rounded-none font-mono uppercase tracking-wider text-xs cursor-pointer data-selected:bg-foreground data-selected:text-background",
        className
      )}
      {...props}
    />
  );
}

function SFCommandShortcut({
  className,
  ...props
}: React.ComponentProps<typeof CommandShortcut>) {
  return (
    <CommandShortcut
      className={cn("font-mono uppercase tracking-wider text-xs", className)}
      {...props}
    />
  );
}

function SFCommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandSeparator>) {
  return (
    <CommandSeparator
      className={cn("bg-foreground h-[var(--border-element)]", className)}
      {...props}
    />
  );
}

export {
  SFCommand,
  SFCommandDialog,
  SFCommandInput,
  SFCommandList,
  SFCommandEmpty,
  SFCommandGroup,
  SFCommandItem,
  SFCommandSeparator,
  SFCommandShortcut,
};
