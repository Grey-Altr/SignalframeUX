"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/**
 * Tabbed interface — FRAME layer navigation primitive.
 *
 * Radix Tabs root wrapped with SF contract. Compose with
 * SFTabsList, SFTabsTrigger, and SFTabsContent for a full tab interface.
 * Triggers use underline active indicator (border-b-2) not background fill,
 * with muted → foreground color transition on hover.
 *
 * @example
 * <SFTabs defaultValue="overview">
 *   <SFTabsList>
 *     <SFTabsTrigger value="overview">Overview</SFTabsTrigger>
 *     <SFTabsTrigger value="specs">Specs</SFTabsTrigger>
 *   </SFTabsList>
 *   <SFTabsContent value="overview">Content here</SFTabsContent>
 * </SFTabs>
 */
function SFTabs(props: React.ComponentProps<typeof Tabs>) {
  return <Tabs {...props} />;
}

/**
 * Sub-component of SFTabs — tab navigation bar with 2px bottom border and no padding.
 * @example
 * <SFTabsList><SFTabsTrigger value="a">Tab A</SFTabsTrigger></SFTabsList>
 */
function SFTabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      className={cn(
        "bg-transparent border-b-2 border-foreground rounded-none h-auto p-0 gap-0",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFTabs — tab button with underline active indicator and mono uppercase type.
 * @example
 * <SFTabsTrigger value="overview">Overview</SFTabsTrigger>
 */
function SFTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      className={cn(
        "font-mono uppercase tracking-wider text-xs rounded-none px-4 py-2",
        "border-b-2 border-transparent -mb-[var(--border-element)]",
        "data-[state=active]:border-foreground data-[state=active]:bg-transparent",
        "data-[state=active]:shadow-none data-[state=active]:text-foreground",
        "text-muted-foreground hover:text-foreground transition-colors duration-[var(--sfx-duration-fast)]",
        className
      )}
      {...props}
    />
  );
}

/**
 * Sub-component of SFTabs — content panel shown when its matching tab trigger is active.
 * @example
 * <SFTabsContent value="overview">Overview content here</SFTabsContent>
 */
function SFTabsContent(props: React.ComponentProps<typeof TabsContent>) {
  return <TabsContent {...props} />;
}

export { SFTabs, SFTabsList, SFTabsTrigger, SFTabsContent };
