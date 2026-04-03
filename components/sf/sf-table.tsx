import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function SFTable({
  className,
  ...props
}: React.ComponentProps<typeof Table>) {
  return (
    <Table
      className={cn("font-mono text-xs border-2 border-foreground", className)}
      {...props}
    />
  );
}

function SFTableHeader({
  className,
  ...props
}: React.ComponentProps<typeof TableHeader>) {
  return (
    <TableHeader
      className={cn("bg-foreground text-background", className)}
      {...props}
    />
  );
}

function SFTableHead({
  className,
  ...props
}: React.ComponentProps<typeof TableHead>) {
  return (
    <TableHead
      className={cn(
        "uppercase tracking-wider text-xs text-background font-normal h-9 px-3",
        className
      )}
      {...props}
    />
  );
}

function SFTableRow({
  className,
  ...props
}: React.ComponentProps<typeof TableRow>) {
  return (
    <TableRow
      className={cn(
        "border-b border-foreground/20 hover:bg-muted/50 transition-colors duration-[var(--duration-fast)]",
        className
      )}
      {...props}
    />
  );
}

function SFTableCell({
  className,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return (
    <TableCell className={cn("px-3 py-2", className)} {...props} />
  );
}

function SFTableBody({ className, ...props }: React.ComponentProps<typeof TableBody>) {
  return <TableBody className={cn(className)} {...props} />;
}

export {
  SFTable,
  SFTableHeader,
  SFTableHead,
  SFTableRow,
  SFTableCell,
  SFTableBody,
};
