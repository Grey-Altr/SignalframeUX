// lib/component-registry.ts
// Pure data module — no client directive, no React imports, safe for Server Components
// Consumed by Phase 25 ComponentDetail panel for variant previews, code snippets, and doc pointer lookups

export interface VariantPreview {
  label: string;                    // UPPERCASE — e.g. "PRIMARY", "GHOST"
  props: Record<string, unknown>;   // spread onto the live SF component at render time
}

export interface ComponentRegistryEntry {
  index: string;          // matches ComponentsExplorer COMPONENTS[n].index
  name: string;           // display name, matches COMPONENTS[n].name
  component: string;      // SF component import name, e.g. "SFButton"
  importPath: string;     // "@/components/sf" barrel for Pattern A, direct path for Pattern B/C
  variants: VariantPreview[];
  code: string;           // canonical usage snippet — template literal
  docId: string;          // key into API_DOCS in lib/api-docs.ts
  layer: "frame" | "signal";
  pattern: "A" | "B" | "C";
  category: string;       // matches COMPONENTS[n].category exactly
}

export const COMPONENT_REGISTRY: Record<string, ComponentRegistryEntry> = {

  // ── FORMS ──────────────────────────────────────────────────────────────────

  "001": {
    index: "001",
    name: "BUTTON",
    component: "SFButton",
    importPath: "@/components/sf",
    variants: [
      { label: "PRIMARY", props: { intent: "primary", size: "md", children: "LAUNCH" } },
      { label: "GHOST",   props: { intent: "ghost",   size: "md", children: "CANCEL" } },
      { label: "SIGNAL",  props: { intent: "signal",  size: "md", children: "DEPLOY" } },
    ],
    code: `import { SFButton } from '@/components/sf'

<SFButton intent="primary" size="md">LAUNCH</SFButton>
<SFButton intent="ghost" size="md">CANCEL</SFButton>
<SFButton intent="signal" size="md">DEPLOY</SFButton>`,
    docId: "sfButton",
    layer: "frame",
    pattern: "A",
    category: "FORMS",
  },

  "002": {
    index: "002",
    name: "INPUT",
    component: "SFInput",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: { placeholder: "IDENTIFIER", type: "text" } },
      { label: "PASSWORD", props: { placeholder: "ACCESS KEY", type: "password" } },
    ],
    code: `import { SFInput } from '@/components/sf'

<SFInput placeholder="IDENTIFIER" type="text" />`,
    docId: "sfInput",
    layer: "frame",
    pattern: "A",
    category: "FORMS",
  },

  "003": {
    index: "003",
    name: "TOGGLE",
    component: "SFToggle",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: { "aria-label": "Toggle", children: "ENABLE" } },
      { label: "ACTIVE",  props: { "aria-label": "Toggle", defaultPressed: true, children: "ACTIVE" } },
    ],
    code: `import { SFToggle } from '@/components/sf'

<SFToggle aria-label="Toggle mode">ENABLE</SFToggle>`,
    docId: "sfToggle",
    layer: "frame",
    pattern: "A",
    category: "FORMS",
  },

  "004": {
    index: "004",
    name: "SLIDER",
    component: "SFSlider",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT",  props: { defaultValue: [50], min: 0, max: 100, step: 1 } },
      { label: "RANGED",   props: { defaultValue: [20, 80], min: 0, max: 100, step: 1 } },
    ],
    code: `import { SFSlider } from '@/components/sf'

<SFSlider defaultValue={[50]} min={0} max={100} step={1} />`,
    docId: "sfSlider",
    layer: "frame",
    pattern: "A",
    category: "FORMS",
  },

  "023": {
    index: "023",
    name: "TOGGLE_GRP",
    component: "SFToggleGroup",
    importPath: "@/components/sf",
    variants: [
      { label: "SINGLE",    props: { type: "single", defaultValue: "a" } },
      { label: "MULTIPLE",  props: { type: "multiple", defaultValue: ["a", "b"] } },
    ],
    code: `import { SFToggleGroup, SFToggleGroupItem } from '@/components/sf'

<SFToggleGroup type="single" defaultValue="a">
  <SFToggleGroupItem value="a">ALPHA</SFToggleGroupItem>
  <SFToggleGroupItem value="b">BETA</SFToggleGroupItem>
</SFToggleGroup>`,
    docId: "sfToggleGroup",
    layer: "frame",
    pattern: "A",
    category: "FORMS",
  },

  // Pattern B — lazy import via next/dynamic; NOT in sf/index.ts barrel
  "026": {
    index: "026",
    name: "CALENDAR",
    component: "SFCalendar",
    importPath: "@/components/sf/sf-calendar-lazy",
    variants: [
      { label: "DEFAULT", props: { mode: "single" } },
    ],
    code: `// Pattern B — lazy load via next/dynamic (ssr: false)
import SFCalendarLazy from '@/components/sf/sf-calendar-lazy'

<SFCalendarLazy mode="single" />`,
    docId: "sfCalendar",
    layer: "frame",
    pattern: "B",
    category: "FORMS",
  },

  "029": {
    index: "029",
    name: "INPUT_OTP",
    component: "SFInputOTP",
    importPath: "@/components/sf",
    variants: [
      { label: "6-DIGIT", props: { maxLength: 6 } },
    ],
    code: `import { SFInputOTP, SFInputOTPGroup, SFInputOTPSlot } from '@/components/sf'

<SFInputOTP maxLength={6}>
  <SFInputOTPGroup>
    <SFInputOTPSlot index={0} />
    <SFInputOTPSlot index={1} />
    <SFInputOTPSlot index={2} />
    <SFInputOTPSlot index={3} />
    <SFInputOTPSlot index={4} />
    <SFInputOTPSlot index={5} />
  </SFInputOTPGroup>
</SFInputOTP>`,
    docId: "sfInputOTP",
    layer: "frame",
    pattern: "A",
    category: "FORMS",
  },

  "030": {
    index: "030",
    name: "INPUT_GROUP",
    component: "SFInputGroup",
    importPath: "@/components/sf",
    variants: [
      { label: "WITH ADDON",  props: {} },
      { label: "WITH BUTTON", props: {} },
    ],
    code: `import { SFInputGroup, SFInputGroupAddon, SFInputGroupInput } from '@/components/sf'

<SFInputGroup>
  <SFInputGroupAddon>HTTPS://</SFInputGroupAddon>
  <SFInputGroupInput placeholder="DOMAIN" />
</SFInputGroup>`,
    docId: "sfInputGroup",
    layer: "frame",
    pattern: "A",
    category: "FORMS",
  },

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
    docId: "sfModal",
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
    docId: "sfTabs",
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
    docId: "sfPagination",
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
    docId: "sfAvatar",
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
    docId: "sfBreadcrumb",
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
        <SFNavigationMenuLink href="/components">COMPONENTS</SFNavigationMenuLink>
      </SFNavigationMenuContent>
    </SFNavigationMenuItem>
  </SFNavigationMenuList>
</SFNavigationMenu>`,
    docId: "sfNavigationMenu",
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
    docId: "sfMenubar",
    layer: "frame",
    pattern: "B",
    category: "NAVIGATION",
  },

  // ── FEEDBACK ───────────────────────────────────────────────────────────────

  "008": {
    index: "008",
    name: "BADGE",
    component: "SFBadge",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT",  props: { intent: "default",  children: "DEFAULT" } },
      { label: "PRIMARY",  props: { intent: "primary",  children: "PRIMARY" } },
      { label: "OUTLINE",  props: { intent: "outline",  children: "OUTLINE" } },
      { label: "SIGNAL",   props: { intent: "signal",   children: "SIGNAL" } },
    ],
    code: `import { SFBadge } from '@/components/sf'

<SFBadge intent="primary">NEW</SFBadge>
<SFBadge intent="outline">STABLE</SFBadge>
<SFBadge intent="signal">LIVE</SFBadge>`,
    docId: "sfBadge",
    layer: "frame",
    pattern: "A",
    category: "FEEDBACK",
  },

  "010": {
    index: "010",
    name: "TOAST (FRAME)",
    component: "SFToaster",
    importPath: "@/components/sf",
    variants: [
      { label: "SUCCESS", props: {} },
      { label: "ERROR",   props: {} },
    ],
    code: `import { SFToaster, sfToast } from '@/components/sf'

// In layout.tsx:
<SFToaster />

// Trigger:
sfToast.success('OPERATION COMPLETE')
sfToast.error('SYSTEM FAILURE')`,
    docId: "sfToastFrame",
    layer: "frame",
    pattern: "A",
    category: "FEEDBACK",
  },

  "015": {
    index: "015",
    name: "ALERT",
    component: "SFAlert",
    importPath: "@/components/sf",
    variants: [
      { label: "INFO",        props: { intent: "info" } },
      { label: "WARNING",     props: { intent: "warning" } },
      { label: "DESTRUCTIVE", props: { intent: "destructive" } },
      { label: "SUCCESS",     props: { intent: "success" } },
    ],
    code: `import { SFAlert, SFAlertTitle, SFAlertDescription } from '@/components/sf'

<SFAlert intent="warning">
  <SFAlertTitle>SYSTEM WARNING</SFAlertTitle>
  <SFAlertDescription>DEGRADED PERFORMANCE DETECTED</SFAlertDescription>
</SFAlert>`,
    docId: "sfAlert",
    layer: "frame",
    pattern: "A",
    category: "FEEDBACK",
  },

  "016": {
    index: "016",
    name: "DIALOG_CFM",
    component: "SFAlertDialog",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFAlertDialog, SFAlertDialogTrigger, SFAlertDialogContent, SFAlertDialogHeader, SFAlertDialogTitle, SFAlertDialogDescription, SFAlertDialogFooter, SFAlertDialogAction, SFAlertDialogCancel } from '@/components/sf'

<SFAlertDialog>
  <SFAlertDialogTrigger asChild>
    <SFButton intent="destructive">DELETE</SFButton>
  </SFAlertDialogTrigger>
  <SFAlertDialogContent>
    <SFAlertDialogHeader>
      <SFAlertDialogTitle>CONFIRM DELETE</SFAlertDialogTitle>
      <SFAlertDialogDescription>THIS ACTION CANNOT BE UNDONE.</SFAlertDialogDescription>
    </SFAlertDialogHeader>
    <SFAlertDialogFooter>
      <SFAlertDialogCancel>CANCEL</SFAlertDialogCancel>
      <SFAlertDialogAction>DELETE</SFAlertDialogAction>
    </SFAlertDialogFooter>
  </SFAlertDialogContent>
</SFAlertDialog>`,
    docId: "sfAlertDialog",
    layer: "frame",
    pattern: "A",
    category: "FEEDBACK",
  },

  "017": {
    index: "017",
    name: "COLLAPSE",
    component: "SFCollapsible",
    importPath: "@/components/sf",
    variants: [
      { label: "CLOSED", props: { defaultOpen: false } },
      { label: "OPEN",   props: { defaultOpen: true } },
    ],
    code: `import { SFCollapsible, SFCollapsibleTrigger, SFCollapsibleContent } from '@/components/sf'

<SFCollapsible>
  <SFCollapsibleTrigger asChild>
    <SFButton intent="ghost">TOGGLE SECTION</SFButton>
  </SFCollapsibleTrigger>
  <SFCollapsibleContent>
    HIDDEN CONTENT REVEALED ON TOGGLE
  </SFCollapsibleContent>
</SFCollapsible>`,
    docId: "sfCollapsible",
    layer: "frame",
    pattern: "A",
    category: "FEEDBACK",
  },

  "018": {
    index: "018",
    name: "EMPTY",
    component: "SFEmptyState",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: { title: "NO DATA", description: "BEGIN BY CREATING YOUR FIRST ENTRY." } },
    ],
    code: `import { SFEmptyState } from '@/components/sf'

<SFEmptyState
  title="NO RESULTS"
  description="ADJUST YOUR FILTERS OR CREATE NEW CONTENT."
/>`,
    docId: "sfEmptyState",
    layer: "frame",
    pattern: "C",
    category: "FEEDBACK",
  },

  "020": {
    index: "020",
    name: "ACCORDION",
    component: "SFAccordion",
    importPath: "@/components/sf",
    variants: [
      { label: "SINGLE",   props: { type: "single", collapsible: true } },
      { label: "MULTIPLE", props: { type: "multiple" } },
    ],
    code: `import { SFAccordion, SFAccordionItem, SFAccordionTrigger, SFAccordionContent } from '@/components/sf'

<SFAccordion type="single" collapsible>
  <SFAccordionItem value="section-1">
    <SFAccordionTrigger>SECTION 01</SFAccordionTrigger>
    <SFAccordionContent>EXPANDED CONTENT</SFAccordionContent>
  </SFAccordionItem>
</SFAccordion>`,
    docId: "sfAccordion",
    layer: "signal",
    pattern: "A",
    category: "FEEDBACK",
  },

  "021": {
    index: "021",
    name: "PROGRESS",
    component: "SFProgress",
    importPath: "@/components/sf",
    variants: [
      { label: "25%",  props: { value: 25 } },
      { label: "60%",  props: { value: 60 } },
      { label: "100%", props: { value: 100 } },
    ],
    code: `import { SFProgress } from '@/components/sf'

<SFProgress value={60} />`,
    docId: "sfProgress",
    layer: "signal",
    pattern: "A",
    category: "FEEDBACK",
  },

  "022": {
    index: "022",
    name: "TOAST (SIGNAL)",
    component: "SFToaster",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFToaster, sfToast } from '@/components/sf'

// In layout.tsx:
<SFToaster />

// SIGNAL variant — with GSAP slide entrance:
sfToast('SIGNAL TRANSMISSION COMPLETE', { duration: 4000 })`,
    docId: "sfToastSignal",
    layer: "signal",
    pattern: "A",
    category: "FEEDBACK",
  },

  "024": {
    index: "024",
    name: "STEPPER",
    component: "SFStepper",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFStepper, SFStep } from '@/components/sf'

<SFStepper activeStep={1}>
  <SFStep label="INIT" status="complete" />
  <SFStep label="CONFIG" status="active" />
  <SFStep label="DEPLOY" status="pending" />
</SFStepper>`,
    docId: "sfStepper",
    layer: "signal",
    pattern: "C",
    category: "FEEDBACK",
  },

  // ── DATA DISPLAY ───────────────────────────────────────────────────────────

  "009": {
    index: "009",
    name: "TABLE",
    component: "SFTable",
    importPath: "@/components/sf",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import { SFTable, SFTableHeader, SFTableHead, SFTableBody, SFTableRow, SFTableCell } from '@/components/sf'

<SFTable>
  <SFTableHeader>
    <SFTableRow>
      <SFTableHead>ID</SFTableHead>
      <SFTableHead>STATUS</SFTableHead>
    </SFTableRow>
  </SFTableHeader>
  <SFTableBody>
    <SFTableRow>
      <SFTableCell>001</SFTableCell>
      <SFTableCell>ACTIVE</SFTableCell>
    </SFTableRow>
  </SFTableBody>
</SFTable>`,
    docId: "sfTable",
    layer: "frame",
    pattern: "A",
    category: "DATA_DISPLAY",
  },

  "019": {
    index: "019",
    name: "STATUS_DOT",
    component: "SFStatusDot",
    importPath: "@/components/sf",
    variants: [
      { label: "ACTIVE",   props: { status: "active" } },
      { label: "IDLE",     props: { status: "idle" } },
      { label: "OFFLINE",  props: { status: "offline" } },
      { label: "ERROR",    props: { status: "error" } },
    ],
    code: `import { SFStatusDot } from '@/components/sf'

<SFStatusDot status="active" />
<SFStatusDot status="idle" />
<SFStatusDot status="offline" />`,
    docId: "sfStatusDot",
    layer: "frame",
    pattern: "C",
    category: "DATA_DISPLAY",
  },

  // ── GENERATIVE (Pattern C — animation components, no Radix base) ───────────

  "101": {
    index: "101",
    name: "NOISE_BG",
    component: "NoiseBg",
    importPath: "@/components/animation/noise-bg",
    variants: [
      { label: "DEFAULT",   props: { opacity: 0.15 } },
      { label: "INTENSE",   props: { opacity: 0.35 } },
    ],
    code: `import NoiseBg from '@/components/animation/noise-bg'

<div className="relative">
  <NoiseBg opacity={0.15} />
  CONTENT
</div>`,
    docId: "noiseBg",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },

  "102": {
    index: "102",
    name: "WAVEFORM",
    component: "Waveform",
    importPath: "@/components/animation/waveform",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import Waveform from '@/components/animation/waveform'

<Waveform />`,
    docId: "waveform",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },

  "103": {
    index: "103",
    name: "GLITCH_TXT",
    component: "GlitchText",
    importPath: "@/components/animation/glitch-text",
    variants: [
      { label: "DEFAULT", props: { children: "SIGNAL" } },
    ],
    code: `import GlitchText from '@/components/animation/glitch-text'

<GlitchText>SIGNAL ACTIVE</GlitchText>`,
    docId: "glitchText",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },

  "104": {
    index: "104",
    name: "PARTICLE",
    component: "ParticleMesh",
    importPath: "@/components/animation/particle-mesh",
    variants: [
      { label: "DEFAULT", props: {} },
    ],
    code: `import ParticleMesh from '@/components/animation/particle-mesh'

<ParticleMesh />`,
    docId: "particleMesh",
    layer: "signal",
    pattern: "C",
    category: "GENERATIVE",
  },
};
