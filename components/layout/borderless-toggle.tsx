"use client";

import { useBorderless } from "@/components/providers/theme-provider";

/**
 * Maximize glyph — four filled L-brackets at outer corners with arms reaching
 * inward (crop-mark / fullscreen-frame pattern). 24×24 viewBox, 5-unit thick
 * arms of length 9, 2-unit margin from edges. Matches the navbar trademark
 * register: filled polygons, sharp brutalist corners.
 */
const IconMaximize = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M2 2 L11 2 L11 7 L7 7 L7 11 L2 11 Z" />
    <path d="M22 2 L22 11 L17 11 L17 7 L13 7 L13 2 Z" />
    <path d="M2 22 L2 13 L7 13 L7 17 L11 17 L11 22 Z" />
    <path d="M22 22 L13 22 L13 17 L17 17 L17 13 L22 13 Z" />
  </svg>
);

/**
 * Minimize glyph — four filled L-brackets with elbows pulled toward the center
 * and arms reaching outward to the corners. Same 5-unit thickness / 9-unit arm
 * length geometry as IconMaximize, mirrored.
 */
const IconMinimize = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6 2 L11 2 L11 11 L2 11 L2 6 L6 6 Z" />
    <path d="M13 2 L18 2 L18 6 L22 6 L22 11 L13 11 Z" />
    <path d="M2 13 L11 13 L11 22 L6 22 L6 18 L2 18 Z" />
    <path d="M13 13 L22 13 L22 18 L18 18 L18 22 L13 22 Z" />
  </svg>
);

const NAV_GLYPH_PX = 16;

export function BorderlessToggle() {
  const { isBorderless, toggleBorderless } = useBorderless();

  return (
    <button
      onClick={toggleBorderless}
      className="flex items-center justify-center h-8 w-8 bg-transparent text-muted-foreground hover:text-primary transition-colors duration-200"
      aria-label={isBorderless ? "Disable borderless mode" : "Enable borderless mode"}
      title={isBorderless ? "Disable borderless mode" : "Enable borderless mode"}
    >
      {isBorderless ? (
        <IconMinimize width={NAV_GLYPH_PX} height={NAV_GLYPH_PX} aria-hidden />
      ) : (
        <IconMaximize width={NAV_GLYPH_PX} height={NAV_GLYPH_PX} aria-hidden />
      )}
    </button>
  );
}
