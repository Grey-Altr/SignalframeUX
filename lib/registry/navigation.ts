import type { ComponentRegistryEntry } from "./types";

export const NAVIGATION: Record<string, ComponentRegistryEntry> = {
  // ── NAVIGATION ─────────────────────────────────────────────────────────────

  "007": {
    index: "007",
    name: "TABS",
    component: "SFTabs",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: { defaultValue: "tab1" } },
    ],
    code: `import { SFTabs, SFTabsList, SFTabsTrigger, SFTabsContent } from '@/components/sf'

<SFTabs defaultValue="overview">
  <SFTabsList>
    <SFTabsTrigger value="overview">OVERVIEW</SFTabsTrigger>
    <SFTabsTrigger value="specs">SPECS</SFTabsTrigger>
  </SFTabsList>
  <SFTabsContent value="overview">OVERVIEW CONTENT</SFTabsContent>
  <SFTabsContent value="specs">SPECS CONTENT</SFTabsContent>
</SFTabs>`,
    docId: "SFTabs",
    layer: "frame",
    pattern: "A",
    category: "NAVIGATION",
  },

  "011": {
    index: "011",
    name: "PAGINATION",
    component: "SFPagination",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFPagination, SFPaginationContent, SFPaginationItem, SFPaginationLink, SFPaginationPrevious, SFPaginationNext } from '@/components/sf'

<SFPagination>
  <SFPaginationContent>
    <SFPaginationItem><SFPaginationPrevious href="#" /></SFPaginationItem>
    <SFPaginationItem><SFPaginationLink href="#" isActive>1</SFPaginationLink></SFPaginationItem>
    <SFPaginationItem><SFPaginationLink href="#">2</SFPaginationLink></SFPaginationItem>
    <SFPaginationItem><SFPaginationNext href="#" /></SFPaginationItem>
  </SFPaginationContent>
</SFPagination>`,
    docId: "SFPagination",
    layer: "frame",
    pattern: "A",
    category: "NAVIGATION",
  },

  "013": {
    index: "013",
    name: "AVATAR",
    component: "SFAvatar",
    importPath: "@/components/sf",
    variants: [
      { label: "FALLBACK", props: {} },
      { label: "IMAGE",    props: {} },
    ],
    code: `import { SFAvatar, SFAvatarImage, SFAvatarFallback } from '@/components/sf'

<SFAvatar>
  <SFAvatarImage src="/avatar.png" alt="USER" />
  <SFAvatarFallback>CD</SFAvatarFallback>
</SFAvatar>`,
    docId: "SFAvatar",
    layer: "frame",
    pattern: "A",
    category: "NAVIGATION",
  },

  "014": {
    index: "014",
    name: "BREADCRUMB",
    component: "SFBreadcrumb",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFBreadcrumb, SFBreadcrumbList, SFBreadcrumbItem, SFBreadcrumbLink, SFBreadcrumbPage, SFBreadcrumbSeparator } from '@/components/sf'

<SFBreadcrumb>
  <SFBreadcrumbList>
    <SFBreadcrumbItem><SFBreadcrumbLink href="/">HOME</SFBreadcrumbLink></SFBreadcrumbItem>
    <SFBreadcrumbSeparator />
    <SFBreadcrumbItem><SFBreadcrumbPage>COMPONENTS</SFBreadcrumbPage></SFBreadcrumbItem>
  </SFBreadcrumbList>
</SFBreadcrumb>`,
    docId: "SFBreadcrumb",
    layer: "frame",
    pattern: "A",
    category: "NAVIGATION",
  },

  "025": {
    index: "025",
    name: "NAV_MENU",
    component: "SFNavigationMenu",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFNavigationMenu, SFNavigationMenuList, SFNavigationMenuItem, SFNavigationMenuTrigger, SFNavigationMenuContent, SFNavigationMenuLink } from '@/components/sf'

<SFNavigationMenu>
  <SFNavigationMenuList>
    <SFNavigationMenuItem>
      <SFNavigationMenuTrigger>SYSTEM</SFNavigationMenuTrigger>
      <SFNavigationMenuContent>
        <SFNavigationMenuLink href="/inventory">COMPONENTS</SFNavigationMenuLink>
      </SFNavigationMenuContent>
    </SFNavigationMenuItem>
  </SFNavigationMenuList>
</SFNavigationMenu>`,
    docId: "SFNavigationMenu",
    layer: "frame",
    pattern: "A",
    category: "NAVIGATION",
  },

  // Pattern B — lazy import via next/dynamic; NOT in sf/index.ts barrel
  "027": {
    index: "027",
    name: "MENUBAR",
    component: "SFMenubar",
    importPath: "@/components/sf/sf-menubar-lazy",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `// Pattern B — lazy load via next/dynamic (ssr: false)
import SFMenubarLazy from '@/components/sf/sf-menubar-lazy'

<SFMenubarLazy />`,
    docId: "SFMenubar",
    layer: "frame",
    pattern: "B",
    category: "NAVIGATION",
  },
};
