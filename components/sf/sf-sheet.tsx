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

function SFSheet(props: React.ComponentProps<typeof Sheet>) {
  return <Sheet {...props} />;
}

function SFSheetTrigger(props: React.ComponentProps<typeof SheetTrigger>) {
  return <SheetTrigger {...props} />;
}

function SFSheetClose(props: React.ComponentProps<typeof SheetClose>) {
  return <SheetClose {...props} />;
}

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

function SFSheetFooter({
  className,
  ...props
}: React.ComponentProps<typeof SheetFooter>) {
  return (
    <SheetFooter
      className={cn("border-t-2 border-foreground pt-4", className)}
      {...props}
    />
  );
}

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
