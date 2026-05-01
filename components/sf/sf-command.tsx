"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

/**
 * Command palette — FRAME layer search/navigation primitive.
 *
 * Radix Command wrapped with SF styling: sharp corners, 2px foreground
 * border, dark background. Compose with SFCommandInput, SFCommandList,
 * SFCommandGroup, and SFCommandItem for full palette functionality.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFCommand>
 *   <SFCommandInput placeholder="Search..." />
 *   <SFCommandList>
 *     <SFCommandGroup heading="Actions">
 *       <SFCommandItem>Open file</SFCommandItem>
 *     </SFCommandGroup>
 *   </SFCommandList>
 * </SFCommand>
 */
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

/**
 * Sub-component of SFCommand — modal dialog wrapper for command palette overlay usage.
 * @example
 * <SFCommandDialog open={open} onOpenChange={setOpen}><SFCommandInput placeholder="Search..." /></SFCommandDialog>
 */
function SFCommandDialog({
  className,
  ...props
}: React.ComponentProps<typeof CommandDialog>) {
  return <CommandDialog className={cn("rounded-none", className)} {...props} />;
}

/**
 * Sub-component of SFCommand — search input rendered in font-mono uppercase.
 * @example
 * <SFCommandInput placeholder="Search commands..." />
 */
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

/**
 * Sub-component of SFCommand — scrollable results list container in font-mono.
 * @example
 * <SFCommandList><SFCommandGroup heading="Actions"><SFCommandItem>Open</SFCommandItem></SFCommandGroup></SFCommandList>
 */
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

/**
 * Sub-component of SFCommand — empty state message shown when no results match the query.
 * @example
 * <SFCommandEmpty>No results found.</SFCommandEmpty>
 */
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

/**
 * Sub-component of SFCommand — loading-state indicator rendered inside SFCommandList while async data resolves.
 * cmdk renders this as <div role="progressbar"> (axe-friendly).
 * @example
 * <SFCommandList>
 *   {loading ? <SFCommandLoading>Loading...</SFCommandLoading> : <SFCommandEmpty>No results.</SFCommandEmpty>}
 * </SFCommandList>
 */
function SFCommandLoading({
  className,
  ...props
}: React.ComponentProps<typeof CommandLoading>) {
  return (
    <CommandLoading
      className={cn(
        "font-mono uppercase tracking-wider text-xs px-[var(--sfx-space-3)] py-[var(--sfx-space-2)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFCommand — labeled group of related command items with mono uppercase heading.
 * @example
 * <SFCommandGroup heading="Navigation"><SFCommandItem>Go to dashboard</SFCommandItem></SFCommandGroup>
 */
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

/**
 * Sub-component of SFCommand — selectable command item; highlights with inverted colors on selection.
 * @example
 * <SFCommandItem onSelect={() => router.push('/dashboard')}>Dashboard</SFCommandItem>
 */
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

/**
 * Sub-component of SFCommand — keyboard shortcut label rendered in mono uppercase, right-aligned.
 * @example
 * <SFCommandItem>New File<SFCommandShortcut>⌘N</SFCommandShortcut></SFCommandItem>
 */
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

/**
 * Sub-component of SFCommand — full-width foreground-colored rule dividing command groups.
 * @example
 * <SFCommandSeparator />
 */
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
  SFCommandLoading,
  SFCommandEmpty,
  SFCommandGroup,
  SFCommandItem,
  SFCommandSeparator,
  SFCommandShortcut,
};
