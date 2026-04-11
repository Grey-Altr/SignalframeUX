"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Slide-out panel — FRAME layer overlay primitive.
 *
 * Radix Sheet root wrapped with SF contract. Compose with
 * SFSheetTrigger, SFSheetContent, SFSheetHeader, SFSheetTitle,
 * SFSheetDescription, SFSheetFooter, and SFSheetClose.
 * Content slides in from the edge with sharp corners and 2px border.
 *
 * @example
 * <SFSheet>
 *   <SFSheetTrigger asChild><SFButton>Open Panel</SFButton></SFSheetTrigger>
 *   <SFSheetContent side="right">
 *     <SFSheetHeader><SFSheetTitle>Settings</SFSheetTitle></SFSheetHeader>
 *   </SFSheetContent>
 * </SFSheet>
 */
function SFSheet(props: React.ComponentProps<typeof Sheet>) {
  return <Sheet {...props} />;
}

/**
 * Sub-component of SFSheet — trigger element that opens the slide-out panel on interaction.
 * @example
 * <SFSheetTrigger asChild><SFButton>Open Panel</SFButton></SFSheetTrigger>
 */
function SFSheetTrigger(props: React.ComponentProps<typeof SheetTrigger>) {
  return <SheetTrigger {...props} />;
}

/**
 * Sub-component of SFSheet — close control that dismisses the panel when activated.
 * @example
 * <SFSheetClose asChild><SFButton intent="ghost">Close</SFButton></SFSheetClose>
 */
function SFSheetClose(props: React.ComponentProps<typeof SheetClose>) {
  return <SheetClose {...props} />;
}

/**
 * Sub-component of SFSheet — slide-out content panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFSheetContent side="right"><SFSheetHeader><SFSheetTitle>Settings</SFSheetTitle></SFSheetHeader></SFSheetContent>
 */
function SFSheetContent({
  className,
  ...props
}: React.ComponentProps<typeof SheetContent>) {
  return (
    <SheetContent
      className={cn(
        "rounded-none border-foreground border-2 bg-background shadow-none",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFSheet — header region with 2px bottom border separating it from body content.
 * @example
 * <SFSheetHeader><SFSheetTitle>Settings</SFSheetTitle></SFSheetHeader>
 */
function SFSheetHeader({
  className,
  ...props
}: React.ComponentProps<typeof SheetHeader>) {
  return (
    <SheetHeader
      className={cn("border-b-2 border-foreground pb-4", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFSheet — footer region with 2px top border and muted background for action buttons.
 * @example
 * <SFSheetFooter><SFButton>Apply</SFButton></SFSheetFooter>
 */
function SFSheetFooter({
  className,
  ...props
}: React.ComponentProps<typeof SheetFooter>) {
  return (
    <SheetFooter
      className={cn("border-t-2 border-foreground bg-muted/30 pt-4", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFSheet — sheet title in font-mono uppercase with letter-spacing.
 * @example
 * <SFSheetTitle>Preferences</SFSheetTitle>
 */
function SFSheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetTitle>) {
  return (
    <SheetTitle
      className={cn("font-mono uppercase tracking-wider text-sm", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFSheet — supporting description text in muted foreground, uppercase, xs size.
 * @example
 * <SFSheetDescription>Adjust your display preferences.</SFSheetDescription>
 */
function SFSheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetDescription>) {
  return (
    <SheetDescription
      className={cn("text-muted-foreground text-xs uppercase tracking-wide", className)}
      {...props}
    />
  );
}

export {
  SFSheet,
  SFSheetTrigger,
  SFSheetClose,
  SFSheetContent,
  SFSheetHeader,
  SFSheetFooter,
  SFSheetTitle,
  SFSheetDescription,
};
