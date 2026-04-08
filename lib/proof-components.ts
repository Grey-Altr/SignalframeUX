/**
 * PROOF_COMPONENT_SKELETONS — the 12 SF components rendered as stroke-only
 * FRAME-state skeletons in the PROOF section (Approach B, Phase 32) and
 * as the homepage 12-item INVENTORY subset (Phase 33). Pinning here
 * enforces visual coherence across both sections.
 *
 * Coded nomenclature: SF//[CAT]-NNN (category abbreviation + 3-digit index).
 * The 6 category abbreviations (BTN, CRD, INP, TGL, TBL, BDG, DLG, TAB, SLD,
 * SEL, TIP, PRG) are the subset Phase 33 will validate against the full
 * 49-item registry. This list may be refined during Phase 33 — Phase 32
 * only requires that the list has exactly 12 entries.
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 */

export type ProofComponentId =
  | "SF//BTN-001"
  | "SF//CRD-001"
  | "SF//INP-001"
  | "SF//TGL-001"
  | "SF//TBL-001"
  | "SF//BDG-001"
  | "SF//DLG-001"
  | "SF//TAB-001"
  | "SF//SLD-001"
  | "SF//SEL-001"
  | "SF//TIP-001"
  | "SF//PRG-001";

export const PROOF_COMPONENT_SKELETONS: readonly ProofComponentId[] = [
  "SF//BTN-001",
  "SF//CRD-001",
  "SF//INP-001",
  "SF//TGL-001",
  "SF//TBL-001",
  "SF//BDG-001",
  "SF//DLG-001",
  "SF//TAB-001",
  "SF//SLD-001",
  "SF//SEL-001",
  "SF//TIP-001",
  "SF//PRG-001",
] as const;
