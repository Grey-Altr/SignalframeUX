/**
 * Ported from cdb-v3-dossier (components/cdb/cdb-corner-chrome.tsx).
 *
 * The dossier branch had a four-corner chrome strip with hairline bracket
 * ticks and JetBrains Mono labels. We bring the "CULTURE DIVISION /
 * SIGNALFRAME SYSTEM" label (originally the TL default on the dossier) to
 * the BR corner of the main site so the parent-studio attribution reads
 * as a persistent page-frame affordance.
 *
 * Only this one corner is ported — the main site already owns the other
 * corners (nav stack + utility row in BL, InstrumentHUD in TR, hero in TL
 * area). Hairline bracket at bottom-right mirrors the dossier's corner-tick
 * grammar using pseudo-elements — a 12px horizontal hairline + 12px vertical
 * hairline, both in muted-foreground so the panel sits in the grey chrome
 * family.
 */
export function CdCornerPanel() {
  return (
    <div
      data-corner="br"
      data-cd-corner-panel=""
      className="fixed z-[var(--sfx-z-nav,40)] font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.16em] leading-[1.4] bg-muted-foreground text-background text-right pointer-events-none px-3 py-2"
      style={{
        bottom: "calc(var(--sf-frame-bottom-gap, 0px) + 24px)",
        right: "calc(var(--sf-frame-offset-x, 0px) + 24px)",
        // Top-left corner notch — mirrors the nav cubes' top-right notch
        // (NAV_NOTCH_PX = 8), so the panel reads as part of the same angled-
        // label family. TL cut on a BR-anchored panel points diagonally
        // toward the nav in the opposite corner.
        clipPath: "polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)",
      }}
    >
      {/* Inherits text-background (white) from parent — black on
       *  muted-foreground grey was 2.96:1, failing WCAG AA (needs 4.5:1).
       *  White on muted-foreground L=0.46 ≈ 4.57:1 passes. */}
      <div>CULTURE DIVISION</div>
      <div className="text-[var(--sfx-cube-fill)]">SIGNALFRAME SYSTEM</div>
    </div>
  );
}
