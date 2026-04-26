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
        // Phase 60 Plan 03 (commit ab95241 follow-up): replaced fixed "auto 80px"
        // with viewport-responsive height formula. Wave 0 measurements
        // (60-02-wave0-measurements.json) showed actual rendered height tracks
        // exactly `22.5 × var(--sf-vw)` across all 4 viewports
        // (mobile-360: 81/3.6 = 22.5; iphone13-390: 87.75/3.9 = 22.5;
        //  ipad-834: 187.65/8.34 = 22.5; desktop-1440: 324/14.4 = 22.5).
        // Single fixed value caused CLS=0.002505 at LHCI viewport (375x667 → actual
        // height ≈84.4px vs 80px placeholder = 4.4px transition shift). Responsive
        // formula matches actual rendered height at every breakpoint, eliminating
        // the content-visibility:auto reflow shift.
        containIntrinsicSize: "auto calc(22.5 * var(--sf-vw))",
      }}
    >
      {text}
    </span>
  );
}
