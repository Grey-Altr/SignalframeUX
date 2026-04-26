interface GhostLabelProps {
  text: string;
  className?: string;
}

/**
 * Oversized background text marker — structural wayfinding, not decoration.
 * Anton display at 200–400px, 3–5% opacity, pointer-events none.
 * Positioned absolute behind section content.
 */
export function GhostLabel({ text, className }: GhostLabelProps) {
  return (
    <span
      aria-hidden="true"
      data-anim="ghost-label"
      data-ghost-label="true"
      className={`sf-display pointer-events-none select-none absolute leading-none ${className ?? ""}`}
      style={{
        fontSize: "clamp(200px, calc(25*var(--sf-vw)), 400px)",
        // Phase 60 LCP-02 candidate (b): defer paint of the 4% opacity decorative
        // wayfinding glyph until it scrolls into the viewport. Anti-Pattern #5
        // discipline (PITFALLS.md Pitfall 9): content-visibility on the LEAF only,
        // NEVER on the SFSection wrapper. Removes GhostLabel from the mobile LCP
        // critical-path candidate pool (per Phase 57 DGN-01 mobile-360 = ghost-label).
        contentVisibility: "auto",
        // RESEARCH §Q1: derived from Task 60-02-01 measurement at mobile-360 viewport
        // (60-02-wave0-measurements.json: mobile-360 height=81px). Rounded to nearest
        // 10px per Task 60-02-01 decision rule (commit 73a3aeb). Under-estimate is
        // safe — GhostLabel is position:absolute and does not contribute to flow.
        containIntrinsicSize: "auto 80px",
      }}
    >
      {text}
    </span>
  );
}
