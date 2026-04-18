import React from "react";
import { cn } from "@/lib/utils";

interface VaultHelghaneseProps extends React.ComponentProps<"div"> {
  text: string;
  size?: number;
  letterSpacing?: number;
}

/*
 * Fictional-script primitive — maps each Latin letter to a constructed
 * geometric glyph built from thin line segments. Provides a parallel-
 * world anchor stronger than multilingual-real-script. Glyphs are
 * designed as a single coherent alphabet: all 18px × 22px,
 * uniform stroke, geometric only, no curves.
 *
 * This isn't a font — rendering is done via SVG per character. That
 * keeps bundle cost at zero fonts and makes the glyph set directly
 * editable as code.
 */

// Each entry is a list of polyline point arrays (each array = one
// connected stroke as flat x0,y0,x1,y1,... sequence). 24x24
// coordinate space per glyph; renderer scales to any height.
const GLYPHS: Record<string, number[][]> = {
  A: [[2, 22, 12, 2, 22, 22], [6, 15, 18, 15]],
  B: [[4, 2, 4, 22], [4, 2, 18, 2, 18, 11, 4, 11], [4, 11, 20, 11, 20, 22, 4, 22]],
  C: [[20, 4, 6, 4, 4, 8, 4, 16, 6, 20, 20, 20]],
  D: [[4, 2, 4, 22], [4, 2, 18, 2, 22, 8, 22, 16, 18, 22, 4, 22]],
  E: [[22, 2, 4, 2, 4, 22, 22, 22], [4, 12, 18, 12]],
  F: [[22, 2, 4, 2, 4, 22], [4, 12, 18, 12]],
  G: [[20, 4, 6, 4, 4, 8, 4, 16, 6, 20, 20, 20, 20, 14, 14, 14]],
  H: [[4, 2, 4, 22], [22, 2, 22, 22], [4, 12, 22, 12]],
  I: [[4, 2, 20, 2], [12, 2, 12, 22], [4, 22, 20, 22]],
  J: [[22, 2, 22, 18, 18, 22, 6, 22, 2, 18]],
  K: [[4, 2, 4, 22], [22, 2, 4, 12, 22, 22]],
  L: [[4, 2, 4, 22, 22, 22]],
  M: [[4, 22, 4, 2, 12, 12, 20, 2, 20, 22]],
  N: [[4, 22, 4, 2, 20, 22, 20, 2]],
  O: [[4, 6, 4, 18, 8, 22, 18, 22, 22, 18, 22, 6, 18, 2, 8, 2, 4, 6]],
  P: [[4, 22, 4, 2, 18, 2, 22, 6, 22, 11, 18, 15, 4, 15]],
  Q: [[4, 6, 4, 18, 8, 22, 18, 22, 22, 18, 22, 6, 18, 2, 8, 2, 4, 6], [16, 16, 24, 24]],
  R: [[4, 22, 4, 2, 18, 2, 22, 6, 22, 11, 18, 15, 4, 15], [12, 15, 22, 22]],
  S: [[22, 4, 8, 4, 4, 8, 4, 10, 8, 12, 18, 12, 22, 14, 22, 18, 18, 22, 4, 22]],
  T: [[2, 2, 22, 2], [12, 2, 12, 22]],
  U: [[4, 2, 4, 18, 8, 22, 18, 22, 22, 18, 22, 2]],
  V: [[4, 2, 12, 22, 20, 2]],
  W: [[2, 2, 8, 22, 12, 12, 16, 22, 22, 2]],
  X: [[4, 2, 22, 22], [22, 2, 4, 22]],
  Y: [[4, 2, 12, 12, 20, 2], [12, 12, 12, 22]],
  Z: [[2, 2, 22, 2, 2, 22, 22, 22]],
  // minimal set for spaces/punct
  " ": [],
  ".": [[12, 22, 12, 24]],
  "/": [[20, 2, 4, 22]],
  "-": [[6, 12, 18, 12]],
};

function pointsStr(pts: number[]): string {
  const out: string[] = [];
  for (let i = 0; i < pts.length; i += 2) out.push(`${pts[i]},${pts[i + 1]}`);
  return out.join(" ");
}

export function VaultHelghanese({
  text,
  size = 48,
  letterSpacing = 3,
  className,
  ...props
}: VaultHelghaneseProps) {
  const chars = text.toUpperCase().split("");
  return (
    <div
      data-vault-helghanese
      className={cn("inline-flex items-center", className)}
      style={{ gap: `${letterSpacing}px` }}
      aria-label={text}
      {...props}
    >
      {chars.map((ch, i) => {
        const strokes = GLYPHS[ch] ?? [];
        return (
          <svg
            key={`${ch}-${i}`}
            viewBox="0 0 24 24"
            height={size}
            width={size * 0.72}
            className="stroke-[var(--cdb-paper)] fill-none"
            style={{ strokeWidth: 1.8 }}
            aria-hidden="true"
          >
            {strokes.map((poly, j) => (
              <polyline key={j} points={pointsStr(poly)} />
            ))}
          </svg>
        );
      })}
    </div>
  );
}
