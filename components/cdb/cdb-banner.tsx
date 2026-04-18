"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface CdBBannerProps {
  word: string;
  code?: string;
  halftoneStep?: number;
  skew?: number;
  className?: string;
}

/*
 * Black Flag / moire corrugated banner.
 *
 * Implementation: SVG text masked over a repeating-diagonal-stripe
 * pattern to produce the halftone/moire register from Enero.Studio's
 * E0000 pack. The word is typeset in Bungee (wide display) and
 * stretched to fill the banner height. Skew + stripes interact to
 * create the flag-in-motion illusion without animation.
 *
 * `halftoneStep` = gap between stripes in px (tighter = more moire).
 * `skew` = degrees of banner skew (0 = flat, negative = peeling).
 */
export function CdBBanner({
  word,
  code,
  halftoneStep = 6,
  skew = -4,
  className,
}: CdBBannerProps) {
  const patternId = React.useId();
  return (
    <div
      data-cdb-banner
      className={cn(
        "relative w-full overflow-hidden",
        "bg-[var(--cdb-black)]",
        className
      )}
      style={{ transform: skew ? `skewY(${skew}deg)` : undefined }}
    >
      {/* halftone field */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, var(--cdb-paper) 0 1px, transparent 1px ${halftoneStep}px)`,
          opacity: 0.7,
        }}
      />
      {/* moire overlay — second stripe set at slight angle */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-multiply"
        style={{
          backgroundImage: `repeating-linear-gradient(88deg, var(--cdb-black) 0 1px, transparent 1px ${halftoneStep}px)`,
          opacity: 0.9,
        }}
      />
      {/* word — clipped to lime */}
      <svg
        viewBox="0 0 1200 300"
        preserveAspectRatio="xMidYMid slice"
        className="relative block w-full h-[clamp(180px,28vw,420px)]"
      >
        <defs>
          <pattern
            id={patternId}
            width={halftoneStep}
            height={halftoneStep}
            patternUnits="userSpaceOnUse"
          >
            <rect
              width={halftoneStep}
              height={halftoneStep}
              fill="var(--cdb-lime)"
            />
            <rect
              x="0"
              y="0"
              width="1"
              height={halftoneStep}
              fill="var(--cdb-black)"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-bungee), var(--font-jetbrains), monospace"
          fontSize="220"
          fill={`url(#${patternId})`}
          letterSpacing="-6"
        >
          {word}
        </text>
      </svg>
      {/* E0000_XX code strip */}
      {code && (
        <div
          className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-paper)]/80"
          style={{ transform: skew ? `skewY(${-skew}deg)` : undefined }}
        >
          {code}
        </div>
      )}
    </div>
  );
}
