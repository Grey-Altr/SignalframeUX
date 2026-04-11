import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/**
 * Navigation hierarchy breadcrumb — FRAME layer wayfinding primitive.
 *
 * Server Component. Wraps shadcn Breadcrumb with monospace text
 * and `/` separator instead of chevron icon.
 *
 * @example
 * <SFBreadcrumb>
 *   <SFBreadcrumbList>
 *     <SFBreadcrumbItem><SFBreadcrumbLink href="/">Home</SFBreadcrumbLink></SFBreadcrumbItem>
 *     <SFBreadcrumbSeparator />
 *     <SFBreadcrumbItem><SFBreadcrumbPage>Current</SFBreadcrumbPage></SFBreadcrumbItem>
 *   </SFBreadcrumbList>
 * </SFBreadcrumb>
 */
function SFBreadcrumb(props: React.ComponentProps<typeof Breadcrumb>) {
  return <Breadcrumb {...props} />;
}

/**
 * Sub-component of SFBreadcrumb — ordered list container with monospace font.
 * @example
 * <SFBreadcrumbList><SFBreadcrumbItem><SFBreadcrumbLink href="/">Home</SFBreadcrumbLink></SFBreadcrumbItem></SFBreadcrumbList>
 */
function SFBreadcrumbList({
  className,
  ...props
}: React.ComponentProps<typeof BreadcrumbList>) {
  return <BreadcrumbList className={cn("font-mono", className)} {...props} />;
}

/**
 * Sub-component of SFBreadcrumb — individual breadcrumb item wrapper.
 * @example
 * <SFBreadcrumbItem><SFBreadcrumbLink href="/docs">Docs</SFBreadcrumbLink></SFBreadcrumbItem>
 */
function SFBreadcrumbItem(
  props: React.ComponentProps<typeof BreadcrumbItem>
) {
  return <BreadcrumbItem {...props} />;
}

/**
 * Sub-component of SFBreadcrumb — navigable breadcrumb link to a parent page.
 * @example
 * <SFBreadcrumbLink href="/components">Components</SFBreadcrumbLink>
 */
function SFBreadcrumbLink(
  props: React.ComponentProps<typeof BreadcrumbLink>
) {
  return <BreadcrumbLink {...props} />;
}

/**
 * Sub-component of SFBreadcrumb — current page indicator (non-interactive, aria-current="page").
 * @example
 * <SFBreadcrumbPage>Button</SFBreadcrumbPage>
 */
function SFBreadcrumbPage(
  props: React.ComponentProps<typeof BreadcrumbPage>
) {
  return <BreadcrumbPage {...props} />;
}

/**
 * Sub-component of SFBreadcrumb — monospace `/` separator between breadcrumb items.
 * @example
 * <SFBreadcrumbSeparator />
 */
function SFBreadcrumbSeparator({
  className,
  ...props
}: React.ComponentProps<typeof BreadcrumbSeparator>) {
  return (
    <BreadcrumbSeparator className={cn("font-mono", className)} {...props}>
      /
    </BreadcrumbSeparator>
  );
}

export {
  SFBreadcrumb,
  SFBreadcrumbList,
  SFBreadcrumbItem,
  SFBreadcrumbLink,
  SFBreadcrumbPage,
  SFBreadcrumbSeparator,
};
