import { API_DOCS, type ComponentDoc } from "@/lib/api-docs";

export interface APISearchItem {
  id: string;
  label: string;
  sublabel: string;
  value: string; // cmdk search field — combined haystack
}

export function buildAPISearchItems(): APISearchItem[] {
  return Object.keys(API_DOCS)
    .map((id) => {
      const doc: ComponentDoc = API_DOCS[id];
      return {
        id,
        label: doc.importName,
        sublabel: `${doc.layer} · ${doc.version}`,
        value: `${doc.importName} ${id} ${doc.layer} ${doc.name} ${doc.description}`.toLowerCase(),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}
