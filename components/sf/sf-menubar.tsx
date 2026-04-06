"use client";

/**
 * SFMenubar -- FRAME layer desktop application menubar with zero border-radius.
 *
 * P3 lazy component: import via sf-menubar-lazy.tsx, NOT from sf/index.ts.
 *
 * Wraps every shadcn Menubar sub-component with DU/TDR industrial styling:
 * sharp corners, 2px borders, no decorative shadows or rounding.
 *
 * @example
 * ```tsx
 * import { SFMenubarLazy } from "@/components/sf/sf-menubar-lazy";
 *
 * // Use SFMenubar* sub-components from sf-menubar.tsx via lazy loader
 * ```
 */

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarShortcut,
  MenubarGroup,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

function SFMenubar({
  className,
  ...props
}: React.ComponentProps<typeof Menubar>) {
  return (
    <Menubar
      className={cn(
        "rounded-none border-2 border-border shadow-none",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Pass-through (no rounded-* to override)                            */
/* ------------------------------------------------------------------ */

function SFMenubarMenu(props: React.ComponentProps<typeof MenubarMenu>) {
  return <MenubarMenu {...props} />;
}

function SFMenubarGroup(props: React.ComponentProps<typeof MenubarGroup>) {
  return <MenubarGroup {...props} />;
}

function SFMenubarRadioGroup(
  props: React.ComponentProps<typeof MenubarRadioGroup>
) {
  return <MenubarRadioGroup {...props} />;
}

function SFMenubarSub(props: React.ComponentProps<typeof MenubarSub>) {
  return <MenubarSub {...props} />;
}

function SFMenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarSeparator>) {
  return (
    <MenubarSeparator
      className={cn("bg-foreground h-[var(--border-element)]", className)}
      {...props}
    />
  );
}

function SFMenubarLabel({
  className,
  ...props
}: React.ComponentProps<typeof MenubarLabel>) {
  return (
    <MenubarLabel
      className={cn(
        "font-mono uppercase tracking-[0.15em] text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function SFMenubarShortcut({
  className,
  ...props
}: React.ComponentProps<typeof MenubarShortcut>) {
  return (
    <MenubarShortcut
      className={cn("font-mono uppercase tracking-wider text-xs", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/* rounded-none overrides                                              */
/* ------------------------------------------------------------------ */

function SFMenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarTrigger>) {
  return (
    <MenubarTrigger
      className={cn("rounded-none sf-focusable", className)}
      {...props}
    />
  );
}

function SFMenubarContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarContent>) {
  return (
    <MenubarContent
      className={cn(
        "rounded-none border-2 border-foreground shadow-none ring-0",
        className
      )}
      {...props}
    />
  );
}

function SFMenubarItem({
  className,
  ...props
}: React.ComponentProps<typeof MenubarItem>) {
  return (
    <MenubarItem
      className={cn(
        "rounded-none font-mono uppercase tracking-wider text-xs cursor-pointer focus:bg-foreground focus:text-background",
        className
      )}
      {...props}
    />
  );
}

function SFMenubarCheckboxItem({
  className,
  ...props
}: React.ComponentProps<typeof MenubarCheckboxItem>) {
  return (
    <MenubarCheckboxItem
      className={cn("rounded-none", className)}
      {...props}
    />
  );
}

function SFMenubarRadioItem({
  className,
  ...props
}: React.ComponentProps<typeof MenubarRadioItem>) {
  return (
    <MenubarRadioItem className={cn("rounded-none", className)} {...props} />
  );
}

function SFMenubarSubTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarSubTrigger>) {
  return (
    <MenubarSubTrigger
      className={cn("rounded-none", className)}
      {...props}
    />
  );
}

function SFMenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarSubContent>) {
  return (
    <MenubarSubContent
      className={cn(
        "rounded-none border-2 border-foreground shadow-none ring-0",
        className
      )}
      {...props}
    />
  );
}

export {
  SFMenubar,
  SFMenubarMenu,
  SFMenubarTrigger,
  SFMenubarContent,
  SFMenubarItem,
  SFMenubarSeparator,
  SFMenubarLabel,
  SFMenubarShortcut,
  SFMenubarGroup,
  SFMenubarSub,
  SFMenubarSubTrigger,
  SFMenubarSubContent,
  SFMenubarCheckboxItem,
  SFMenubarRadioGroup,
  SFMenubarRadioItem,
};
