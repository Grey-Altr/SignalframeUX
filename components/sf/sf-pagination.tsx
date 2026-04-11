import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

/**
 * SFPagination -- FRAME layer numbered page navigation.
 *
 * Server Component. Wraps shadcn Pagination with monospace text,
 * sharp corners, 2px borders, and inverted active state. No ellipsis
 * export -- pagination should show explicit page numbers.
 *
 * @example
 * <SFPagination>
 *   <SFPaginationContent>
 *     <SFPaginationItem><SFPaginationPrevious href="/page/1" /></SFPaginationItem>
 *     <SFPaginationItem><SFPaginationLink href="/page/1">1</SFPaginationLink></SFPaginationItem>
 *     <SFPaginationItem><SFPaginationLink href="/page/2" isActive>2</SFPaginationLink></SFPaginationItem>
 *     <SFPaginationItem><SFPaginationLink href="/page/3">3</SFPaginationLink></SFPaginationItem>
 *     <SFPaginationItem><SFPaginationNext href="/page/3" /></SFPaginationItem>
 *   </SFPaginationContent>
 * </SFPagination>
 */

function SFPagination({
  className,
  ...props
}: React.ComponentProps<typeof Pagination>) {
  return <Pagination className={cn("font-mono", className)} {...props} />;
}

/**
 * Sub-component of SFPagination — flex container for pagination items with gap-0 edge-to-edge layout.
 * @example
 * <SFPaginationContent><SFPaginationItem><SFPaginationLink href="/page/1">1</SFPaginationLink></SFPaginationItem></SFPaginationContent>
 */
function SFPaginationContent({
  className,
  ...props
}: React.ComponentProps<typeof PaginationContent>) {
  return (
    <PaginationContent className={cn("gap-0", className)} {...props} />
  );
}

/**
 * Sub-component of SFPagination — wrapper for a single pagination control (link, prev, or next).
 * @example
 * <SFPaginationItem><SFPaginationLink href="/page/2">2</SFPaginationLink></SFPaginationItem>
 */
function SFPaginationItem(
  props: React.ComponentProps<typeof PaginationItem>
) {
  return <PaginationItem {...props} />;
}

/**
 * Sub-component of SFPagination — page number link with inverted active state and 2px border.
 * @example
 * <SFPaginationLink href="/page/3" isActive>3</SFPaginationLink>
 */
function SFPaginationLink({
  className,
  isActive,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      isActive={isActive}
      className={cn(
        "rounded-none border-2 border-foreground uppercase tracking-wider text-xs font-mono",
        isActive
          ? "bg-foreground text-background hover:bg-foreground hover:text-background"
          : "bg-transparent text-foreground hover:bg-foreground hover:text-background",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFPagination — previous page navigation control with 2px border and mono uppercase.
 * @example
 * <SFPaginationPrevious href="/page/1" />
 */
function SFPaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationPrevious>) {
  return (
    <PaginationPrevious
      className={cn(
        "rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFPagination — next page navigation control with 2px border and mono uppercase.
 * @example
 * <SFPaginationNext href="/page/4" />
 */
function SFPaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationNext>) {
  return (
    <PaginationNext
      className={cn(
        "rounded-none border-2 border-foreground font-mono uppercase tracking-wider text-xs",
        className
      )}
      {...props}
    />
  );
}

export {
  SFPagination,
  SFPaginationContent,
  SFPaginationItem,
  SFPaginationLink,
  SFPaginationPrevious,
  SFPaginationNext,
};
