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

function SFDialog(props: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />;
}

function SFDialogTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
  return <DialogTrigger {...props} />;
}

function SFDialogClose(props: React.ComponentProps<typeof DialogClose>) {
  return <DialogClose {...props} />;
}

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
