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
    docId: "sfCard",
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
    docId: "sfDialog",
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
    docId: "sfDrawer",
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
    docId: "sfHoverCard",
    layer: "frame",
    pattern: "A",
    category: "LAYOUT",
  },
};
