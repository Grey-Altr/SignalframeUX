"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

/**
 * Bottom-sheet overlay via vaul — FRAME layer.
 * Lazy-load via sf-drawer-lazy.tsx.
 *
 * Compose with SFDrawerTrigger, SFDrawerContent, SFDrawerHeader,
 * SFDrawerTitle, SFDrawerDescription, SFDrawerFooter, and SFDrawerClose.
 * Content slides up from bottom with sharp corners and 2px top border.
 *
 * @example
 * ```tsx
 * import { SFDrawerLazy } from "@/components/sf/sf-drawer-lazy";
 * import {
 *   SFDrawerContent, SFDrawerHeader, SFDrawerTitle,
 *   SFDrawerDescription, SFDrawerFooter, SFDrawerClose,
 * } from "@/components/sf/sf-drawer";
 *
 * <SFDrawerLazy>
 *   <SFDrawerContent>
 *     <SFDrawerHeader>
 *       <SFDrawerTitle>Panel</SFDrawerTitle>
 *       <SFDrawerDescription>Supporting info</SFDrawerDescription>
 *     </SFDrawerHeader>
 *     <div className="p-4">Body content</div>
 *     <SFDrawerFooter>
 *       <SFDrawerClose>Close</SFDrawerClose>
 *     </SFDrawerFooter>
 *   </SFDrawerContent>
 * </SFDrawerLazy>
 * ```
 */
function SFDrawer(props: React.ComponentProps<typeof Drawer>) {
  return <Drawer {...props} />;
}

/** Sub-component of SFDrawer — trigger element that opens the bottom-sheet on interaction. */
function SFDrawerTrigger(props: React.ComponentProps<typeof DrawerTrigger>) {
  return <DrawerTrigger {...props} />;
}

/** Sub-component of SFDrawer — close control that dismisses the bottom-sheet when activated. */
function SFDrawerClose(props: React.ComponentProps<typeof DrawerClose>) {
  return <DrawerClose {...props} />;
}

/** Sub-component of SFDrawer — bottom-sheet content panel with sharp corners, 2px top border, and no radius. */
function SFDrawerContent({
  className,
  ...props
}: React.ComponentProps<typeof DrawerContent>) {
  return (
    <DrawerContent
      className={cn(
        "rounded-none border-t-2 border-foreground bg-background",
        className
      )}
      {...props}
    />
  );
}

/** Sub-component of SFDrawer — header region with 2px bottom border separating it from body content. */
function SFDrawerHeader({
  className,
  ...props
}: React.ComponentProps<typeof DrawerHeader>) {
  return (
    <DrawerHeader
      className={cn("border-b-2 border-foreground", className)}
      {...props}
    />
  );
}

/** Sub-component of SFDrawer — footer region with 2px top border for action buttons. */
function SFDrawerFooter({
  className,
  ...props
}: React.ComponentProps<typeof DrawerFooter>) {
  return (
    <DrawerFooter
      className={cn("border-t-2 border-foreground", className)}
      {...props}
    />
  );
}

/** Sub-component of SFDrawer — sheet title in font-mono uppercase with letter-spacing. */
function SFDrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerTitle>) {
  return (
    <DrawerTitle
      className={cn("font-mono uppercase tracking-wider text-xs", className)}
      {...props}
    />
  );
}

/** Sub-component of SFDrawer — supporting description text in muted foreground, xs size. */
function SFDrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerDescription>) {
  return (
    <DrawerDescription
      className={cn("text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}

export {
  SFDrawer,
  SFDrawerTrigger,
  SFDrawerClose,
  SFDrawerContent,
  SFDrawerHeader,
  SFDrawerFooter,
  SFDrawerTitle,
  SFDrawerDescription,
};
