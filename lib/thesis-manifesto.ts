/**
 * THESIS Section — Manifesto Copy
 *
 * Source of truth: wiki/analyses/v1.5-thesis-copy-draft.md (Grey-approved 2026-04-07).
 * 6 statements, all at display scale (Anton 80-120px+), ALL CAPS, period-terminated.
 *
 * Consumed by: components/blocks/thesis-section.tsx (Phase 31 Plan 02).
 * Verified by: tests/phase-31-thesis.spec.ts (TH-05 content coverage).
 *
 * Color note: The wiki copy specifies magenta on "SIGNAL" in S6 as the sole
 * chromatic accent. Per 2026-04-08 user decision, magenta is dropped — the
 * THESIS section renders foreground-only, enforcing CONTEXT D-16.
 */

export type ManifestoSize = "anchor" | "connector";

export type ManifestoPillar =
  | "signal-frame"
  | "enhanced-flat"
  | "culture-infrastructure"
  | "biophilia"
  | "memetic-engineering";

export interface ManifestoAnchor {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

export interface ManifestoStatementData {
  text: string;
  size: ManifestoSize;
  anchor: ManifestoAnchor;
  mobileAnchor?: ManifestoAnchor;
  pillar: ManifestoPillar;
  wikiSource?: string;
}

export const THESIS_MANIFESTO: readonly ManifestoStatementData[] = [
  {
    // S1 — opening anchor — the thesis. Two lines stacked at biggest scale (120px+).
    text: "DETERMINISTIC STRUCTURE. GENERATIVE EXPRESSION.",
    size: "anchor",
    pillar: "signal-frame",
    anchor: { top: "calc(22*var(--sf-vh))", left: "calc(8*var(--sf-vw))" },
    wikiSource: "concepts/frame-signal-architecture.md, concepts/cybernetic-biophilia.md",
  },
  {
    // S2 — enhanced-flat design rule as manifesto. Hard declarative.
    text: "ZERO RADIUS. ZERO COMPROMISE.",
    size: "anchor",
    pillar: "enhanced-flat",
    anchor: { top: "calc(30*var(--sf-vh))", right: "calc(6*var(--sf-vw))" },
    wikiSource: "concepts/enhanced-flat-design.md (--radius: 0px everywhere)",
  },
  {
    // S3 — operational philosophy — wiki-copy extension (TH-05 does not require this pillar).
    text: "CULTURE AS INFRASTRUCTURE.",
    size: "anchor",
    pillar: "culture-infrastructure",
    anchor: { bottom: "calc(34*var(--sf-vh))", left: "calc(12*var(--sf-vw))" },
    wikiSource: "entities/culture-division.md, concepts/cd-event-system.md",
  },
  {
    // S4 — cybernetic biophilia compressed to three words. Founding principle.
    text: "STRUCTURE THAT BREATHES.",
    size: "anchor",
    pillar: "biophilia",
    anchor: { top: "calc(50*var(--sf-vh))", right: "calc(18*var(--sf-vw))" },
    wikiSource: "concepts/cybernetic-biophilia.md, moodboards/generative-systems.md",
  },
  {
    // S5 — memetic stance — wiki-copy extension. Container-as-strategy.
    text: "FORMAT IS STRATEGY.",
    size: "anchor",
    pillar: "memetic-engineering",
    anchor: { bottom: "calc(18*var(--sf-vh))", right: "calc(8*var(--sf-vw))" },
    wikiSource: "concepts/memetic-engineering.md",
  },
  {
    // S6 — closing anchor — paired symmetric clauses. FRAME-first is accepted per
    // AC-8 wiki-lock exception: the two clauses are independent parallel sentences,
    // not a slash-ordering. Original wiki copy had magenta on "SIGNAL" — dropped.
    text: "THE FRAME HOLDS. THE SIGNAL MOVES.",
    size: "anchor",
    pillar: "signal-frame",
    anchor: { bottom: "calc(28*var(--sf-vh))", left: "calc(10*var(--sf-vw))" },
    wikiSource: "concepts/frame-signal-architecture.md",
  },
] as const;
