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

/**
 * Context menu — FRAME layer dropdown navigation primitive.
 *
 * Radix DropdownMenu root wrapped with SF contract. Compose with
 * SFDropdownMenuTrigger, SFDropdownMenuContent, SFDropdownMenuGroup,
 * SFDropdownMenuItem, SFDropdownMenuLabel, SFDropdownMenuSeparator,
 * and SFDropdownMenuShortcut for full context menu behavior.
 *
 * @example
 * <SFDropdownMenu>
 *   <SFDropdownMenuTrigger asChild><SFButton>Options</SFButton></SFDropdownMenuTrigger>
 *   <SFDropdownMenuContent>
 *     <SFDropdownMenuItem>Edit</SFDropdownMenuItem>
 *     <SFDropdownMenuSeparator />
 *     <SFDropdownMenuItem>Delete</SFDropdownMenuItem>
 *   </SFDropdownMenuContent>
 * </SFDropdownMenu>
 */
function SFDropdownMenu(props: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu {...props} />;
}

/**
 * Sub-component of SFDropdownMenu — trigger element that opens the dropdown on click.
 * @example
 * <SFDropdownMenuTrigger asChild><SFButton>Options</SFButton></SFDropdownMenuTrigger>
 */
function SFDropdownMenuTrigger(
  props: React.ComponentProps<typeof DropdownMenuTrigger>
) {
  return <DropdownMenuTrigger {...props} />;
}

/**
 * Sub-component of SFDropdownMenu — floating content panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFDropdownMenuContent><SFDropdownMenuItem>Edit</SFDropdownMenuItem></SFDropdownMenuContent>
 */
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

/**
 * Sub-component of SFDropdownMenu — groups related items with a mono uppercase label heading.
 * @example
 * <SFDropdownMenuGroup><SFDropdownMenuLabel>File</SFDropdownMenuLabel><SFDropdownMenuItem>New</SFDropdownMenuItem></SFDropdownMenuGroup>
 */
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

/**
 * Sub-component of SFDropdownMenu — selectable menu item; inverts colors on focus/hover.
 * @example
 * <SFDropdownMenuItem onSelect={() => handleEdit()}>Edit</SFDropdownMenuItem>
 */
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

/**
 * Sub-component of SFDropdownMenu — non-interactive section label in muted foreground at xs size.
 * @example
 * <SFDropdownMenuLabel>File Actions</SFDropdownMenuLabel>
 */
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

/**
 * Sub-component of SFDropdownMenu — keyboard shortcut hint in mono uppercase, right-aligned in item.
 * @example
 * <SFDropdownMenuItem>Save<SFDropdownMenuShortcut>⌘S</SFDropdownMenuShortcut></SFDropdownMenuItem>
 */
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

/**
 * Sub-component of SFDropdownMenu — full-width foreground rule separating menu sections.
 * @example
 * <SFDropdownMenuSeparator />
 */
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
