/**
 * Ported from cdb-v3-dossier (components/cdb/cdb-corner-chrome.tsx).
 *
 * The dossier branch had a four-corner chrome strip with hairline bracket
 * ticks and JetBrains Mono labels. Label is bilingual: line 1 in Japanese
 * katakana (ユニバーサルデザインシステム — "universal design system"),
 * line 2 in English attribution ("BY CULTURE DIVISION"). The bilingual
 * pairing reads as a trademark stamp and ties the system into the tDR /
 * Autechre coded-nomenclature register.
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
      className="fixed z-[var(--sfx-z-nav,40)] font-mono text-[10px] md:text-[11px] font-bold uppercase tracking-[0.16em] leading-[1.4] bg-[var(--sfx-cube-fill)] text-black text-right pointer-events-none px-3 py-2"
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
      {/* Surface matches nav cube-tile trademark: bg-[--sfx-cube-fill] +
       *  text-black, theme-hue coupled. Cube-fill is T3 (L=0.80 C=0.22 at the
       *  theme-hue). Caveat: per feedback_t3_text_contrast_floor memory,
       *  cube-fill as a BACKGROUND for small bold text only clears AA at the
       *  yellow end of the hue rotation (hue ~90–110, high relative-luminance
       *  band). At magenta/blue hues the panel approaches but may not clear
       *  4.5:1 at 11px. This is the same contract the nav cube-tiles ship
       *  with — the trademark propagation is intentional. If hue rotates
       *  below AA on small text here, fall back to --sfx-yellow (static,
       *  AA-tuned, L=0.91 C=0.18). */}
      {/* Japanese katakana — "universal design system". CSS `uppercase` has
       *  no effect on kana/kanji (no case in Japanese), so the line renders
       *  as typed. JetBrains Mono doesn't ship Japanese glyphs; the browser
       *  falls back to the system Japanese font (Hiragino Sans on macOS,
       *  Noto Sans JP or Yu Gothic on Windows/Linux). Minor metric mismatch
       *  vs line 2 is intentional — reads as bilingual stamp, not unified run. */}
      <div lang="ja">ユニバーサルデザインシステム</div>
      <div>BY CULTURE DIVISION</div>
    </div>
  );
}
