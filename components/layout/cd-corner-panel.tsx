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
      className="fixed z-[var(--sfx-z-nav,40)] font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] leading-[1.4] text-muted-foreground text-right pointer-events-none pb-3 pr-3 before:content-[''] before:absolute before:bottom-0 before:right-0 before:w-3 before:h-px before:bg-muted-foreground after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-px after:h-3 after:bg-muted-foreground"
      style={{
        bottom: "calc(var(--sf-frame-bottom-gap, 0px) + 24px)",
        right: "calc(var(--sf-frame-offset-x, 0px) + 24px)",
      }}
    >
      <div>CULTURE DIVISION</div>
      <div className="text-muted-foreground/55">SIGNALFRAME SYSTEM</div>
    </div>
  );
}
