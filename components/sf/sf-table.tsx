import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * Data table — FRAME layer data primitive.
 *
 * Semantically correct HTML table with SF styling: font-mono at text-xs
 * and 2px foreground outer border. Compose with SFTableHeader,
 * SFTableBody, SFTableRow, SFTableHead, and SFTableCell for full
 * table structure.
 *
 * @param className - Merged via cn() after base classes
 *
 * @example
 * <SFTable>
 *   <SFTableHeader><SFTableRow><SFTableHead>Name</SFTableHead></SFTableRow></SFTableHeader>
 *   <SFTableBody><SFTableRow><SFTableCell>Alice</SFTableCell></SFTableRow></SFTableBody>
 * </SFTable>
 */
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

/** Sub-component of SFTable — inverted header row (foreground background, background text). */
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

/** Sub-component of SFTable — column heading cell in uppercase tracking-wider at text-xs. */
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

/** Sub-component of SFTable — table row with muted border and subtle hover background. */
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

/** Sub-component of SFTable — data cell with consistent px-3 py-2 padding. */
function SFTableCell({
  className,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return (
    <TableCell className={cn("px-3 py-2", className)} {...props} />
  );
}

/** Sub-component of SFTable — table body container wrapping all data rows. */
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
