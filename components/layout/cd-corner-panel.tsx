import { WORDMARK_PATH_D } from "@/lib/wordmark-path";

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
 * out) and the visible English overlay. The English overlay is now a static
 * <path> (Phase 63.1 Plan 03 Path A — eliminates JetBrains Mono font-swap
 * wait that was making this element the LCP candidate at the swap moment on
 * iPhone 14 Pro 4G). Path data lives in lib/wordmark-path.ts; regenerate via
 * scripts/vectorize-wordmark.mjs.
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
        {/* English overlay — pre-vectorized to a static <path> so paint
            doesn't wait for JetBrains Mono font swap (Phase 63.1 Plan 03
            Path A; LCP candidate-shift fix). The original <text> with
            text-anchor="end" at x=192 included a transparent <tspan>による</tspan>
            for layout spacing; that offset is baked into the path's
            x-positioning (kana_offset=23.32 in the vectorizer). */}
        <path d={WORDMARK_PATH_D} fill="black" />
      </svg>
    </div>
  );
}
