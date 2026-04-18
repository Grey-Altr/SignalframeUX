import React from "react";
import { cn } from "@/lib/utils";

export type VaultTrademarkGlyph =
  | "hexStacked"
  | "recycling"
  | "starBurst"
  | "peaceRing"
  | "cubeNest"
  | "circuitWheel"
  | "tigerEye"
  | "smileyCrown"
  | "quadrant"
  | "dotMatrix"
  | "chevronArrow"
  | "gearWedge"
  | "orbit"
  | "asterField"
  | "maze"
  | "sunburst";

interface VaultTrademarkProps {
  glyph: VaultTrademarkGlyph;
  code: string;
  variant?: "line" | "fill" | "lime";
  className?: string;
}

/*
 * Brando Corp 250-class Y2K trademark cell — single thick-stroke
 * geometry, serialized, unsoftened. 16 glyph variants supply enough
 * vocabulary for a 64-cell catalog section without repetition.
 *
 * Variants:
 *   line     white 2.5px stroke on black (default, Brando catalog norm)
 *   fill     solid white geometry on black
 *   lime     black geometry on lime ground (accent cell)
 */

const strokeStyle = "stroke-[var(--cdb-paper)] fill-none stroke-[2.5]";
const fillStyle = "fill-[var(--cdb-paper)]";
const limeStyle = "stroke-[var(--cdb-lime-foreground)] fill-[var(--cdb-lime-foreground)] stroke-[2]";

function GlyphSvg({
  glyph,
  className,
}: {
  glyph: VaultTrademarkGlyph;
  className: string;
}) {
  const c = `w-[62%] h-[62%] ${className}`;
  switch (glyph) {
    case "hexStacked":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" />
          <polygon points="32,16 46,24 46,40 32,48 18,40 18,24" />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
        </svg>
      );
    case "recycling":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <path d="M32 6 L46 28 L38 28 L44 40 L24 40 L14 28 Z" />
          <path d="M14 36 L22 50 L54 50 L44 36" />
          <circle cx="32" cy="32" r="2.5" fill="currentColor" />
        </svg>
      );
    case "starBurst":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <polygon points="32,4 36,24 58,24 40,36 48,58 32,44 16,58 24,36 6,24 28,24" />
          <circle cx="32" cy="32" r="6" />
        </svg>
      );
    case "peaceRing":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <circle cx="32" cy="32" r="26" />
          <line x1="32" y1="6" x2="32" y2="58" />
          <line x1="32" y1="32" x2="14" y2="50" />
          <line x1="32" y1="32" x2="50" y2="50" />
        </svg>
      );
    case "cubeNest":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <rect x="6" y="6" width="52" height="52" />
          <rect x="14" y="14" width="36" height="36" />
          <rect x="22" y="22" width="20" height="20" />
          <rect x="28" y="28" width="8" height="8" fill="currentColor" />
        </svg>
      );
    case "circuitWheel":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <circle cx="32" cy="32" r="22" />
          <circle cx="32" cy="32" r="8" />
          {[0, 60, 120, 180, 240, 300].map((d) => {
            const a = (d * Math.PI) / 180;
            const x1 = 32 + Math.cos(a) * 10;
            const y1 = 32 + Math.sin(a) * 10;
            const x2 = 32 + Math.cos(a) * 22;
            const y2 = 32 + Math.sin(a) * 22;
            return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
      );
    case "tigerEye":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <ellipse cx="32" cy="32" rx="26" ry="14" />
          <ellipse cx="32" cy="32" rx="12" ry="14" />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
        </svg>
      );
    case "smileyCrown":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <circle cx="32" cy="32" r="22" />
          <circle cx="25" cy="28" r="2.5" fill="currentColor" />
          <circle cx="39" cy="28" r="2.5" fill="currentColor" />
          <path d="M22 40 Q 32 48 42 40" />
          <polyline points="18,12 24,4 32,10 40,4 46,12" />
        </svg>
      );
    case "quadrant":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <rect x="4" y="4" width="26" height="26" />
          <rect x="34" y="4" width="26" height="26" fill="currentColor" />
          <rect x="34" y="34" width="26" height="26" />
          <rect x="4" y="34" width="26" height="26" fill="currentColor" />
        </svg>
      );
    case "dotMatrix":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          {[12, 22, 32, 42, 52].flatMap((y) =>
            [12, 22, 32, 42, 52].map((x) => {
              const r = ((x + y) * 13) % 5 === 0 ? 3 : 1.8;
              return <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="currentColor" stroke="none" />;
            })
          )}
        </svg>
      );
    case "chevronArrow":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <polyline points="10,20 32,40 54,20" />
          <polyline points="10,32 32,52 54,32" />
        </svg>
      );
    case "gearWedge":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <path d="M32 6 L36 14 L46 12 L48 22 L56 26 L52 34 L58 42 L50 46 L46 54 L38 50 L32 58 L26 50 L18 54 L14 46 L6 42 L12 34 L8 26 L16 22 L18 12 L28 14 Z" />
          <circle cx="32" cy="32" r="6" fill="currentColor" />
        </svg>
      );
    case "orbit":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <ellipse cx="32" cy="32" rx="26" ry="10" />
          <ellipse cx="32" cy="32" rx="10" ry="26" />
          <circle cx="32" cy="32" r="4" fill="currentColor" />
        </svg>
      );
    case "asterField":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          {[16, 32, 48].map((cx) =>
            [16, 32, 48].map((cy) => (
              <g key={`${cx}-${cy}`}>
                <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} />
                <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} />
              </g>
            ))
          )}
        </svg>
      );
    case "maze":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <path d="M6 6 H58 V58 H6 V14 H50 V50 H14 V22 H42 V42 H22 V30 H34" />
        </svg>
      );
    case "sunburst":
      return (
        <svg viewBox="0 0 64 64" className={c}>
          <circle cx="32" cy="32" r="6" fill="currentColor" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            const len = i % 2 === 0 ? 22 : 14;
            const x2 = 32 + Math.cos(a) * len;
            const y2 = 32 + Math.sin(a) * len;
            const x1 = 32 + Math.cos(a) * 10;
            const y1 = 32 + Math.sin(a) * 10;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
      );
  }
}

export function VaultTrademark({
  glyph,
  code,
  variant = "line",
  className,
}: VaultTrademarkProps) {
  const style =
    variant === "line"
      ? strokeStyle
      : variant === "fill"
      ? fillStyle
      : limeStyle;
  return (
    <div
      data-vault-trademark
      data-glyph={glyph}
      data-variant={variant}
      className={cn(
        "group relative aspect-square flex flex-col border",
        variant === "lime"
          ? "bg-[var(--cdb-lime)] border-[var(--cdb-lime)]"
          : "bg-[var(--cdb-black)] border-[var(--cdb-chrome-line)]",
        className
      )}
    >
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden"
        style={{ color: variant === "lime" ? "var(--cdb-lime-foreground)" : "var(--cdb-paper)" }}
      >
        <GlyphSvg glyph={glyph} className={style} />
      </div>
      <div
        className={cn(
          "border-t font-mono text-[9px] leading-none uppercase tracking-[0.08em] px-1.5 py-1.5 flex justify-between items-baseline gap-1",
          variant === "lime"
            ? "border-[var(--cdb-lime-foreground)]/30 text-[var(--cdb-lime-foreground)]"
            : "border-[var(--cdb-chrome-line)] text-[var(--cdb-paper)]/75"
        )}
      >
        <span className="font-bold whitespace-nowrap">{code}</span>
        <span className="opacity-70 whitespace-nowrap">{glyph.toUpperCase()}</span>
      </div>
    </div>
  );
}
