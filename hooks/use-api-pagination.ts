"use client";

import { useEffect, useMemo, useState } from "react";
import { API_DOCS, type ComponentDoc } from "@/lib/api-docs";
import { sliceIntoPanels } from "@/lib/pagination";

export interface APIEntry {
  id: string;
  doc: ComponentDoc;
}

type SurfaceKey = "COMPONENTS" | "HOOKS" | "TOKENS";

function classify(doc: ComponentDoc): SurfaceKey {
  if (doc.layer === "HOOK") return "HOOKS";
  if (doc.layer === "TOKEN") return "TOKENS";
  return "COMPONENTS";
}

const ROWS_PER_PANEL_MOBILE = 28;
const ROWS_PER_PANEL_DESKTOP = 56;
const DESKTOP_MQ = "(min-width: 768px)";

function matchEntry(entry: APIEntry, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  return (
    entry.id.toLowerCase().includes(needle) ||
    entry.doc.name.toLowerCase().includes(needle) ||
    entry.doc.description.toLowerCase().includes(needle)
  );
}

export interface PaginationResult {
  componentsSlices: APIEntry[][];
  hooksEntries: APIEntry[];
  tokensEntries: APIEntry[];
  totalAll: number;
  totalVisible: number;
  isDesktop: boolean;
  rowsPerPanel: number;
}

export function useAPIPagination(query: string): PaginationResult {
  const allEntries = useMemo<APIEntry[]>(() => {
    const list: APIEntry[] = Object.keys(API_DOCS).map((id) => ({ id, doc: API_DOCS[id] }));
    list.sort((a, b) => a.doc.name.localeCompare(b.doc.name));
    return list;
  }, []);

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_MQ);
    const read = () => setIsDesktop(mql.matches);
    read();
    mql.addEventListener("change", read);
    return () => mql.removeEventListener("change", read);
  }, []);

  const rowsPerPanel = isDesktop ? ROWS_PER_PANEL_DESKTOP : ROWS_PER_PANEL_MOBILE;

  return useMemo(() => {
    const buckets: Record<SurfaceKey, APIEntry[]> = { COMPONENTS: [], HOOKS: [], TOKENS: [] };
    for (const entry of allEntries) {
      if (!matchEntry(entry, query)) continue;
      buckets[classify(entry.doc)].push(entry);
    }
    const componentsSlices = sliceIntoPanels(buckets.COMPONENTS, rowsPerPanel);
    const totalVisible = buckets.COMPONENTS.length + buckets.HOOKS.length + buckets.TOKENS.length;
    return {
      componentsSlices,
      hooksEntries: buckets.HOOKS,
      tokensEntries: buckets.TOKENS,
      totalAll: allEntries.length,
      totalVisible,
      isDesktop,
      rowsPerPanel,
    };
  }, [allEntries, query, rowsPerPanel, isDesktop]);
}
