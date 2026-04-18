import React from "react";
import { cn } from "@/lib/utils";

export type FlagPattern =
  | "stripesTight"
  | "stripesLoose"
  | "dotsGrid"
  | "dotsGradient"
  | "corrugated"
  | "crossHatch"
  | "verticalBars"
  | "diagonal";

interface VaultFlagProps {
  word: string;
  code: string;
  pattern: FlagPattern;
  skew?: number;
  accent?: "lime" | "paper" | "orange";
  className?: string;
}

/*
 * Black Flag E0000 — full halftone/moire banner with 8 pattern
 * morphologies. Replaces the weaker CdBBanner stripe-only approach.
 *
 * Each pattern is a different SVG <pattern> used as the fill of the
 * word, turning the type itself into a structured-noise field. The
 * overall composition follows Enero.Studio's E0000_NN contract:
 * pure-black ground, one accent, serial code top-left, single word
 * spanning the band, optional skew for flag-in-motion illusion.
 */
export function VaultFlag({
  word,
  code,
  pattern,
  skew = 0,
  accent = "lime",
  className,
}: VaultFlagProps) {
  const patternId = React.useId();
  const accentColor =
    accent === "lime"
      ? "var(--cdb-lime)"
      : accent === "orange"
      ? "var(--vault-orange)"
      : "var(--cdb-paper)";

  const patternDef = (() => {
    switch (pattern) {
      case "stripesTight":
        return (
          <pattern id={patternId} width="3" height="3" patternUnits="userSpaceOnUse">
            <rect width="3" height="3" fill={accentColor} />
            <rect x="0" y="0" width="1" height="3" fill="var(--cdb-black)" opacity="0.55" />
          </pattern>
        );
      case "stripesLoose":
        return (
          <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill={accentColor} />
            <rect x="0" y="0" width="3" height="8" fill="var(--cdb-black)" />
          </pattern>
        );
      case "dotsGrid":
        return (
          <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="var(--cdb-black)" />
            <circle cx="4" cy="4" r="2.2" fill={accentColor} />
          </pattern>
        );
      case "dotsGradient":
        return (
          <pattern id={patternId} width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="var(--cdb-black)" />
            {Array.from({ length: 10 }).map((_, y) =>
              Array.from({ length: 10 }).map((_, x) => (
                <circle
                  key={`${x}-${y}`}
                  cx={x * 6 + 3}
                  cy={y * 6 + 3}
                  r={0.4 + (x / 10) * 2.2}
                  fill={accentColor}
                />
              ))
            )}
          </pattern>
        );
      case "corrugated":
        return (
          <pattern id={patternId} width="14" height="14" patternUnits="userSpaceOnUse">
            <rect width="14" height="14" fill={accentColor} />
            <path
              d="M0 7 Q 3.5 0 7 7 T 14 7"
              stroke="var(--cdb-black)"
              strokeWidth="2.5"
              fill="none"
            />
          </pattern>
        );
      case "crossHatch":
        return (
          <pattern id={patternId} width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="var(--cdb-black)" />
            <line x1="0" y1="0" x2="6" y2="6" stroke={accentColor} strokeWidth="1" />
            <line x1="0" y1="6" x2="6" y2="0" stroke={accentColor} strokeWidth="1" />
          </pattern>
        );
      case "verticalBars":
        return (
          <pattern id={patternId} width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="var(--cdb-black)" />
            <rect x="1" y="0" width="2" height="6" fill={accentColor} />
          </pattern>
        );
      case "diagonal":
        return (
          <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
            <rect width="10" height="10" fill={accentColor} />
            <rect x="0" y="0" width="3" height="10" fill="var(--cdb-black)" />
          </pattern>
        );
    }
  })();

  return (
    <div
      data-vault-flag
      data-pattern={pattern}
      className={cn(
        "relative w-full overflow-hidden bg-[var(--cdb-black)] border-y border-[var(--cdb-chrome-line)]",
        className
      )}
      style={{ transform: skew ? `skewY(${skew}deg)` : undefined }}
    >
      <svg
        viewBox="0 0 1200 240"
        preserveAspectRatio="xMidYMid slice"
        className="block w-full h-[clamp(120px,22vw,300px)]"
      >
        <defs>{patternDef}</defs>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-bungee), var(--font-jetbrains), monospace"
          fontSize="180"
          fill={`url(#${patternId})`}
          letterSpacing="-4"
        >
          {word}
        </text>
      </svg>
      {/* serial code + pattern name */}
      <div
        className="absolute top-3 left-4 sm:top-4 sm:left-6 flex gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/85"
        style={{ transform: skew ? `skewY(${-skew}deg)` : undefined }}
      >
        <span className="text-[var(--cdb-paper)]">{code}</span>
        <span className="opacity-60">/ {pattern.toUpperCase()}</span>
      </div>
      <div
        className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/60"
        style={{ transform: skew ? `skewY(${-skew}deg)` : undefined }}
      >
        ENERO.STUDIO / BLACK FLAG PACK
      </div>
    </div>
  );
}
