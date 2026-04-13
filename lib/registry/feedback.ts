import type { ComponentRegistryEntry } from "./types";

export const FEEDBACK: Record<string, ComponentRegistryEntry> = {
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
};
