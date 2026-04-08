// lib/nomenclature.ts
// Coded nomenclature for COMPONENT_REGISTRY entries.
// Assigns stable SF//[CAT]-NNN codes derived from category + sequential index.
// Sort order is deterministic: CATEGORY_ORDER defines the sort.
//
// SIGNAL/FRAME ordering: signal layer referenced first per project convention.

import { COMPONENT_REGISTRY, type ComponentRegistryEntry } from "./component-registry";

export const CATEGORY_CODE: Record<string, string> = {
  FORMS: "FRM",
  LAYOUT: "LAY",
  NAVIGATION: "NAV",
  FEEDBACK: "FBK",
  DATA_DISPLAY: "DAT",
  GENERATIVE: "GEN",
} as const;

export const CATEGORY_ORDER = [
  "FORMS",
  "LAYOUT",
  "NAVIGATION",
  "FEEDBACK",
  "DATA_DISPLAY",
  "GENERATIVE",
] as const;

/**
 * Derives SF//[CAT]-NNN codes for all registry entries.
 * Sort by CATEGORY_ORDER before assigning — codes are stable across builds.
 * Does not mutate the input; returns new objects with sfCode field.
 */
export function assignCodes<T extends { category: string }>(
  entries: T[]
): (T & { sfCode: string })[] {
  const sorted = [...entries].sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a.category as (typeof CATEGORY_ORDER)[number]) -
      CATEGORY_ORDER.indexOf(b.category as (typeof CATEGORY_ORDER)[number])
  );
  const counters: Record<string, number> = {};
  return sorted.map((entry) => {
    const cat = CATEGORY_CODE[entry.category] ?? "UNK";
    counters[cat] = (counters[cat] ?? 0) + 1;
    return {
      ...entry,
      sfCode: `SF//${cat}-${String(counters[cat]).padStart(3, "0")}`,
    };
  });
}

/**
 * Pre-computed registry with sfCode on every entry.
 * Use this in components — do not call assignCodes() per render.
 */
export const CODED_REGISTRY: (ComponentRegistryEntry & { sfCode: string })[] =
  assignCodes(Object.values(COMPONENT_REGISTRY));

/**
 * The 12-item homepage INVENTORY subset.
 * Indices map to COMPONENT_REGISTRY keys. Order: FRM → LAY → NAV → FBK → DAT → GEN.
 * GEN items last — SCRAMBLE_TEXT and CIRCUIT_DIVIDER signal what the system actually is.
 *
 * Index mapping resolved from registry audit (Phase 33 Task 0):
 * FRM: BUTTON(001), INPUT(002)
 * LAY: CARD(005), HOVER_CARD(028)  — CONTAINER/SECTION not in registry; substituted per CONTEXT.md amendment
 * NAV: NAV_MENU(025), BREADCRUMB(014)
 * FBK: PROGRESS(021), TOAST-SIGNAL(022)
 * DAT: TABLE(009), STATUS_DOT(019)  — BADGE is FEEDBACK category, not DATA_DISPLAY
 * GEN: SCRAMBLE_TEXT(105), CIRCUIT_DIVIDER(106)  — both added to registry in Task 0
 */
export const HOMEPAGE_INVENTORY_INDICES: string[] = [
  // FRM — 2 items
  "001", // BUTTON
  "002", // INPUT
  // LAY — 2 items
  "005", // CARD
  "028", // HOVER_CARD
  // NAV — 2 items
  "025", // NAV_MENU
  "014", // BREADCRUMB
  // FBK — 2 items
  "021", // PROGRESS
  "022", // TOAST (SIGNAL)
  // DAT — 2 items
  "009", // TABLE
  "019", // STATUS_DOT
  // GEN — 2 items (SIGNAL-layer showpiece rows — appear last in table)
  "105", // SCRAMBLE_TEXT
  "106", // CIRCUIT_DIVIDER
];
