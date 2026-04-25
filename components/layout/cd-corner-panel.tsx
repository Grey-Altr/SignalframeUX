/**
 * Ported from cdb-v3-dossier (components/cdb/cdb-corner-chrome.tsx).
 *
 * Bilingual stamp: line 1 katakana (ユニバーサルデザインシステム — "universal
 * design system"), line 2 mixed Latin + JP particle ("CULTURE DIVISION による").
 * The kana glyphs are knocked out of the yellow plaque via an SVG `<mask>` so
 * the page content behind the panel (hero animation, particles, etc.) shows
 * through the character shapes — true see-through, not a faked color match.
 *
 * Implementation: the outer div handles fixed positioning + the corner-notch
 * clipPath. Inside, an SVG renders the masked yellow rect (kana shapes punched
 * out) and the visible English overlay. `による` in line 2 stays in the visible
 * text run with `fill="transparent"` so layout/spacing matches the original
 * bilingual reading order, but only the mask actually punches the glyph.
 */
export function CdCornerPanel() {
  return (
    <div
      data-corner="br"
      data-cd-corner-panel=""
      role="complementary"
      aria-label="ユニバーサルデザインシステム — CULTURE DIVISION による"
      className="fixed z-[var(--sfx-z-nav,40)] pointer-events-none w-[200px] h-[40px]"
      style={{
        bottom: "calc(var(--sf-frame-bottom-gap, 0px) + 24px)",
        right: "calc(var(--sf-frame-offset-x, 0px) + 24px)",
        clipPath: "polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)",
      }}
    >
      <svg
        viewBox="0 0 200 40"
        preserveAspectRatio="none"
        className="block h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="cd-corner-kana-knockout"
            maskContentUnits="userSpaceOnUse"
          >
            {/* White = panel visible. Black kana glyphs = punched-out shape. */}
            <rect width="200" height="40" fill="white" />
            <text
              x="192"
              y="18"
              textAnchor="end"
              fontFamily="'JetBrains Mono', 'Hiragino Sans', 'Noto Sans JP', sans-serif"
              fontSize="11"
              fontWeight="700"
              letterSpacing="1.76"
              fill="black"
            >
              ユニバーサルデザインシステム
            </text>
            <text
              x="192"
              y="33"
              textAnchor="end"
              fontFamily="'JetBrains Mono', 'Hiragino Sans', 'Noto Sans JP', sans-serif"
              fontSize="11"
              fontWeight="700"
              letterSpacing="1.76"
              fill="black"
            >
              による
            </text>
          </mask>
        </defs>
        {/* Yellow plaque with kana shapes punched out via the mask above. */}
        <rect
          width="200"
          height="40"
          fill="var(--sfx-cube-fill)"
          mask="url(#cd-corner-kana-knockout)"
        />
        {/* English overlay — `による` stays in the run as transparent fill so
            its glyph slot keeps the same x-advance as the original bilingual
            reading order, but the visual hole comes from the mask only. */}
        <text
          x="192"
          y="33"
          textAnchor="end"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="11"
          fontWeight="700"
          letterSpacing="1.76"
          fill="black"
        >
          CULTURE DIVISION <tspan fill="transparent">による</tspan>
        </text>
      </svg>
    </div>
  );
}
