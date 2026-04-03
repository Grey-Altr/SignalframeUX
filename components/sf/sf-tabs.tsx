"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

function SFTabs(props: React.ComponentProps<typeof Tabs>) {
  return <Tabs {...props} />;
}

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
        "text-muted-foreground hover:text-foreground transition-colors duration-[var(--duration-fast)]",
        className
      )}
      {...props}
    />
  );
}

function SFTabsContent(props: React.ComponentProps<typeof TabsContent>) {
  return <TabsContent {...props} />;
}

export { SFTabs, SFTabsList, SFTabsTrigger, SFTabsContent };
