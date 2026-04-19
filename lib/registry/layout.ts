import type { ComponentRegistryEntry } from "./types";

export const LAYOUT: Record<string, ComponentRegistryEntry> = {
  // ── LAYOUT ─────────────────────────────────────────────────────────────────

  "005": {
    index: "005",
    name: "CARD",
    component: "SFCard",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFCard, SFCardHeader, SFCardTitle, SFCardContent } from '@/components/sf'

<SFCard>
  <SFCardHeader>
    <SFCardTitle>SYSTEM STATUS</SFCardTitle>
  </SFCardHeader>
  <SFCardContent>NOMINAL</SFCardContent>
</SFCard>`,
    docId: "SFCard",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },

  "006": {
    index: "006",
    name: "MODAL",
    component: "SFDialog",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFDialog, SFDialogTrigger, SFDialogContent, SFDialogHeader, SFDialogTitle } from '@/components/sf'

<SFDialog>
  <SFDialogTrigger asChild>
    <SFButton intent="primary">OPEN</SFButton>
  </SFDialogTrigger>
  <SFDialogContent>
    <SFDialogHeader>
      <SFDialogTitle>CONFIRM ACTION</SFDialogTitle>
    </SFDialogHeader>
  </SFDialogContent>
</SFDialog>`,
    docId: "SFDialog",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },

  // Pattern B — lazy import via next/dynamic (vaul, ssr: false); NOT in sf/index.ts barrel
  "012": {
    index: "012",
    name: "DRAWER",
    component: "SFDrawer",
    importPath: "@/components/sf/sf-drawer-lazy",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `// Pattern B — lazy load via next/dynamic (ssr: false)
import SFDrawerLazy from '@/components/sf/sf-drawer-lazy'

<SFDrawerLazy
  trigger={<SFButton intent="primary">OPEN DRAWER</SFButton>}
  title="DRAWER TITLE"
>
  DRAWER CONTENT
</SFDrawerLazy>`,
    docId: "SFDrawer",
    layer: "frame",
    pattern: "B",
    category: "LAYOUT",
  },

  "028": {
    index: "028",
    name: "HOVER_CARD",
    component: "SFHoverCard",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: { openDelay: 300 } },
    ],
    code: `import { SFHoverCard, SFHoverCardTrigger, SFHoverCardContent } from '@/components/sf'

<SFHoverCard openDelay={300}>
  <SFHoverCardTrigger asChild>
    <span className="underline cursor-pointer">@HANDLE</span>
  </SFHoverCardTrigger>
  <SFHoverCardContent>
    PROFILE PREVIEW CONTENT
  </SFHoverCardContent>
</SFHoverCard>`,
    docId: "SFHoverCard",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },

  "037": {
    index: "037",
    name: "CONTAINER",
    component: "SFContainer",
    importPath: "@/components/sf",
    variants: [
      { label: "WIDE",    props: { width: "wide",    children: "WIDE CONTAINER" } },
      { label: "CONTENT", props: { width: "content", children: "CONTENT WIDTH" } },
      { label: "FULL",    props: { width: "full",    children: "FULL WIDTH" } },
    ],
    code: `import { SFContainer, SFText } from '@/components/sf'

<SFContainer width="content">
  <SFText variant="body">READABLE PROSE COLUMN</SFText>
</SFContainer>`,
    docId: "SFContainer",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },

  "038": {
    index: "038",
    name: "GRID",
    component: "SFGrid",
    importPath: "@/components/sf",
    variants: [
      { label: "3 COLS", props: { cols: "3", gap: "6" } },
      { label: "4 COLS", props: { cols: "4", gap: "4" } },
      { label: "AUTO",   props: { cols: "auto", gap: "8" } },
    ],
    code: `import { SFGrid, SFCard, SFCardContent } from '@/components/sf'

<SFGrid cols="3" gap="6">
  <SFCard><SFCardContent>ITEM 01</SFCardContent></SFCard>
  <SFCard><SFCardContent>ITEM 02</SFCardContent></SFCard>
  <SFCard><SFCardContent>ITEM 03</SFCardContent></SFCard>
</SFGrid>`,
    docId: "SFGrid",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },

  "039": {
    index: "039",
    name: "SCROLL_AREA",
    component: "SFScrollArea",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: { className: "h-64 w-full" } },
    ],
    code: `import { SFScrollArea } from '@/components/sf'

<SFScrollArea className="h-64 w-full">
  <div className="p-[var(--sfx-space-4)]">
    LONG CONTENT THAT OVERFLOWS THE CONSTRAINED HEIGHT...
  </div>
</SFScrollArea>`,
    docId: "SFScrollArea",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },

  "040": {
    index: "040",
    name: "SECTION",
    component: "SFSection",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: { label: "WORK",     spacing: "16" } },
      { label: "COMPACT", props: { label: "OVERVIEW", spacing: "8" } },
    ],
    code: `import { SFSection, SFContainer } from '@/components/sf'

<SFSection label="WORK" spacing="24" bgShift="white">
  <SFContainer>SECTION CONTENT</SFContainer>
</SFSection>`,
    docId: "SFSection",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },

  "041": {
    index: "041",
    name: "SEPARATOR",
    component: "SFSeparator",
    importPath: "@/components/sf",
    variants: [
      { label: "THIN",   props: { weight: "thin" } },
      { label: "NORMAL", props: { weight: "normal" } },
      { label: "HEAVY",  props: { weight: "heavy" } },
    ],
    code: `import { SFSeparator } from '@/components/sf'

<SFSeparator weight="normal" />
<SFSeparator orientation="vertical" weight="thin" className="h-6" />`,
    docId: "SFSeparator",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },

  "042": {
    index: "042",
    name: "SHEET",
    component: "SFSheet",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFSheet, SFSheetTrigger, SFSheetContent, SFSheetHeader, SFSheetTitle, SFSheetDescription, SFButton } from '@/components/sf'

<SFSheet>
  <SFSheetTrigger asChild>
    <SFButton intent="primary">OPEN PANEL</SFButton>
  </SFSheetTrigger>
  <SFSheetContent side="right">
    <SFSheetHeader>
      <SFSheetTitle>SETTINGS</SFSheetTitle>
      <SFSheetDescription>ADJUST YOUR DISPLAY PREFERENCES.</SFSheetDescription>
    </SFSheetHeader>
  </SFSheetContent>
</SFSheet>`,
    docId: "SFSheet",
    layer: "frame",
    pattern: "B",
    category: "LAYOUT",
  },

  "043": {
    index: "043",
    name: "STACK",
    component: "SFStack",
    importPath: "@/components/sf",
    variants: [
      { label: "VERTICAL",   props: { direction: "vertical",   gap: "4" } },
      { label: "HORIZONTAL", props: { direction: "horizontal", gap: "6" } },
    ],
    code: `import { SFStack, SFText } from '@/components/sf'

<SFStack gap="8" align="start">
  <SFText variant="heading-2">TITLE</SFText>
  <SFText variant="body">DESCRIPTION</SFText>
</SFStack>`,
    docId: "SFStack",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },

  "044": {
    index: "044",
    name: "TEXT",
    component: "SFText",
    importPath: "@/components/sf",
    variants: [
      { label: "HEADING-1", props: { variant: "heading-1", children: "SIGNAL FRAME" } },
      { label: "HEADING-2", props: { variant: "heading-2", children: "SECTION TITLE" } },
      { label: "BODY",      props: { variant: "body",      children: "BODY COPY RENDERS HERE." } },
    ],
    code: `import { SFText } from '@/components/sf'

<SFText variant="heading-1">SIGNAL FRAME</SFText>
<SFText variant="body">BODY COPY RENDERS HERE.</SFText>
<SFText variant="small" as="span">INLINE CAPTION</SFText>`,
    docId: "SFText",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },
};
