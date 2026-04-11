"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Modal dialog — FRAME layer overlay primitive.
 *
 * Radix Dialog root wrapped with SF contract. Compose with
 * SFDialogTrigger, SFDialogContent, SFDialogHeader, SFDialogTitle,
 * SFDialogDescription, SFDialogFooter, and SFDialogClose.
 * Content applies sharp corners, 2px border, no shadow.
 *
 * @example
 * <SFDialog>
 *   <SFDialogTrigger asChild><SFButton>Open</SFButton></SFDialogTrigger>
 *   <SFDialogContent>
 *     <SFDialogHeader><SFDialogTitle>Confirm</SFDialogTitle></SFDialogHeader>
 *   </SFDialogContent>
 * </SFDialog>
 */
function SFDialog(props: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />;
}

/**
 * Sub-component of SFDialog — trigger element that opens the dialog on interaction.
 * @example
 * <SFDialogTrigger asChild><SFButton>Open</SFButton></SFDialogTrigger>
 */
function SFDialogTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props} />;
}

/**
 * Sub-component of SFDialog — close button that dismisses the dialog when activated.
 * @example
 * <SFDialogClose asChild><SFButton intent="ghost">Cancel</SFButton></SFDialogClose>
 */
function SFDialogClose(props: React.ComponentProps<typeof DialogClose>) {
  return <DialogClose {...props} />;
}

/**
 * Sub-component of SFDialog — modal content panel with sharp corners, 2px border, and no shadow.
 * @example
 * <SFDialogContent><SFDialogHeader><SFDialogTitle>Title</SFDialogTitle></SFDialogHeader></SFDialogContent>
 */
function SFDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      className={cn(
        "rounded-none border-2 border-foreground bg-background shadow-none ring-0",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFDialog — header region with 2px bottom border separating it from content.
 * @example
 * <SFDialogHeader><SFDialogTitle>Confirm Action</SFDialogTitle></SFDialogHeader>
 */
function SFDialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof DialogHeader>) {
  return (
    <DialogHeader
      className={cn("border-b-2 border-foreground pb-4", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFDialog — footer region with 2px top border and muted background for action buttons.
 * @example
 * <SFDialogFooter><SFButton>Save</SFButton></SFDialogFooter>
 */
function SFDialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof DialogFooter>) {
  return (
    <DialogFooter
      className={cn(
        "rounded-none border-t-2 border-foreground bg-muted/30",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFDialog — dialog title in font-mono uppercase with letter-spacing.
 * @example
 * <SFDialogTitle>Confirm Deletion</SFDialogTitle>
 */
function SFDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  return (
    <DialogTitle
      className={cn("font-mono uppercase tracking-wider text-sm", className)}
      {...props}
    />
  );
}

/**
 * Sub-component of SFDialog — supporting description text in muted foreground, uppercase, xs size.
 * @example
 * <SFDialogDescription>This action cannot be undone.</SFDialogDescription>
 */
function SFDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  return (
    <DialogDescription
      className={cn("text-muted-foreground text-xs uppercase tracking-wide", className)}
      {...props}
    />
  );
}

export {
  SFDialog,
  SFDialogTrigger,
  SFDialogClose,
  SFDialogContent,
  SFDialogHeader,
  SFDialogFooter,
  SFDialogTitle,
  SFDialogDescription,
};
