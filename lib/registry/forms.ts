import type { ComponentRegistryEntry } from "./types";

export const FORMS: Record<string, ComponentRegistryEntry> = {
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
    docId: "SFButton",
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
    docId: "SFInput",
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
    docId: "SFToggle",
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
    docId: "SFSlider",
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
    docId: "SFToggleGroup",
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
    docId: "SFInputOTP",
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
    docId: "SFInputGroup",
    layer: "frame",
    pattern: "A",
    category: "FORMS",
  },
};
