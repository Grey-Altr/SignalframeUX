import type { ComponentRegistryEntry } from "./types";

export const DATA_DISPLAY: Record<string, ComponentRegistryEntry> = {
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
};
