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
  sfCode?: string;        // computed by assignCodes() in lib/nomenclature.ts — undefined until util runs
}
