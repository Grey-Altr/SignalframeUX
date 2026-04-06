"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  SFSheet,
  SFSheetTrigger,
  SFSheetContent,
  SFSheetHeader,
  SFSheetTitle,
} from "@/components/sf/sf-sheet";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

/**
 * Site navigation — FRAME layer navigation primitive.
 *
 * Desktop (>=768px): Radix NavigationMenu with flyout viewport panels,
 * industrial DU/TDR styling — zero border-radius, 2px borders, mono uppercase.
 *
 * Mobile (<768px): SFSheet slide-out with hamburger trigger for vertical navigation.
 *
 * Compose desktop and mobile together for responsive navigation:
 *
 * @example
 * ```tsx
 * <nav>
 *   <SFNavigationMenu className="hidden md:flex">
 *     <SFNavigationMenuList>
 *       <SFNavigationMenuItem>
 *         <SFNavigationMenuTrigger>DOCS</SFNavigationMenuTrigger>
 *         <SFNavigationMenuContent>
 *           <SFNavigationMenuLink href="/docs/intro">INTRO</SFNavigationMenuLink>
 *         </SFNavigationMenuContent>
 *       </SFNavigationMenuItem>
 *     </SFNavigationMenuList>
 *   </SFNavigationMenu>
 *
 *   <SFNavigationMenuMobile>
 *     <a href="/docs">DOCS</a>
 *     <a href="/api">API</a>
 *   </SFNavigationMenuMobile>
 * </nav>
 * ```
 */

/** SF-wrapped NavigationMenu root with industrial styling. */
function SFNavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenu> & { viewport?: boolean }) {
  return (
    <NavigationMenu
      viewport={viewport}
      className={cn("rounded-none font-mono", className)}
      {...props}
    >
      {children}
    </NavigationMenu>
  );
}

/** Sub-component of SFNavigationMenu — list container for navigation items. */
function SFNavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuList>) {
  return <NavigationMenuList className={cn(className)} {...props} />;
}

/** Sub-component of SFNavigationMenu — individual navigation item wrapper. */
function SFNavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuItem>) {
  return <NavigationMenuItem className={cn(className)} {...props} />;
}

/** Sub-component of SFNavigationMenu — trigger button with chevron, industrial styling. */
function SFNavigationMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuTrigger>) {
  return (
    <NavigationMenuTrigger
      className={cn(
        "sf-focusable rounded-none font-mono uppercase tracking-wider text-xs border-2 border-transparent hover:border-foreground data-popup-open:border-foreground transition-colors duration-[var(--duration-fast)]",
        "focus-visible:ring-0 focus-visible:outline-none",
        className
      )}
      {...props}
    />
  );
}

/** Sub-component of SFNavigationMenu — flyout content panel with preserved motion animations. */
function SFNavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuContent>) {
  return (
    <NavigationMenuContent
      className={cn("rounded-none", className)}
      {...props}
    />
  );
}

/** Sub-component of SFNavigationMenu — navigation link with inverted hover state. */
function SFNavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink>) {
  return (
    <NavigationMenuLink
      className={cn(
        "rounded-none font-mono text-xs uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors",
        className
      )}
      {...props}
    />
  );
}

/** Sub-component of SFNavigationMenu — viewport flyout container with 2px industrial border. */
function SFNavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuViewport>) {
  return (
    <NavigationMenuViewport
      className={cn(
        "rounded-none border-2 border-foreground shadow-none ring-0",
        className
      )}
      {...props}
    />
  );
}

/** Mobile navigation — SFSheet slide-out with hamburger trigger, visible only below md breakpoint. */
function SFNavigationMenuMobile({
  children,
  className,
  title = "NAVIGATION",
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={cn("md:hidden", className)}>
      <SFSheet>
        <SFSheetTrigger
          aria-label="Open navigation menu"
          className="sf-focusable sf-pressable inline-flex items-center justify-center size-10 border-2 border-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          <Menu className="size-5" />
        </SFSheetTrigger>
        <SFSheetContent side="left">
          <SFSheetHeader>
            <SFSheetTitle>{title}</SFSheetTitle>
          </SFSheetHeader>
          <nav className="flex flex-col gap-1 mt-4">
            {children}
          </nav>
        </SFSheetContent>
      </SFSheet>
    </div>
  );
}

export {
  SFNavigationMenu,
  SFNavigationMenuList,
  SFNavigationMenuItem,
  SFNavigationMenuTrigger,
  SFNavigationMenuContent,
  SFNavigationMenuLink,
  SFNavigationMenuViewport,
  SFNavigationMenuMobile,
};
