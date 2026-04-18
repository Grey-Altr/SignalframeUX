import React from "react";
import { cn } from "@/lib/utils";

interface CdBCornerChromeProps {
  topLeft?: string;
  topRight?: string;
  bottomLeft?: string;
  bottomRight?: string;
  geoCoord?: string;
  tick?: boolean;
  className?: string;
}

/*
 * Four-corner chrome strip — the peer-group signature.
 * Top-left system name, top-right studio+date grid, bottom-left
 * catalog ID, bottom-right URL + geo-coordinate as parallel-world
 * anchor. Corner ticks draw hairline brackets (Cyber2k HUD grammar).
 *
 * All text renders in JetBrains Mono at tracking-code. Corners are
 * absolute to the nearest positioned ancestor (CdBField), which means
 * this component MUST be rendered inside a relative container.
 */
const CornerLabel: React.FC<{
  anchor: "tl" | "tr" | "bl" | "br";
  text?: string;
  tick: boolean;
}> = ({ anchor, text, tick }) => {
  if (!text) return null;
  const pos = {
    tl: "top-4 left-4 sm:top-6 sm:left-6",
    tr: "top-4 right-4 sm:top-6 sm:right-6 text-right",
    bl: "bottom-4 left-4 sm:bottom-6 sm:left-6",
    br: "bottom-4 right-4 sm:bottom-6 sm:right-6 text-right",
  }[anchor];
  const bracket = {
    tl: "before:content-[''] before:absolute before:top-0 before:left-0 before:w-3 before:h-px before:bg-[var(--cdb-chrome-line)] after:content-[''] after:absolute after:top-0 after:left-0 after:w-px after:h-3 after:bg-[var(--cdb-chrome-line)]",
    tr: "before:content-[''] before:absolute before:top-0 before:right-0 before:w-3 before:h-px before:bg-[var(--cdb-chrome-line)] after:content-[''] after:absolute after:top-0 after:right-0 after:w-px after:h-3 after:bg-[var(--cdb-chrome-line)]",
    bl: "before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-3 before:h-px before:bg-[var(--cdb-chrome-line)] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-px after:h-3 after:bg-[var(--cdb-chrome-line)]",
    br: "before:content-[''] before:absolute before:bottom-0 before:right-0 before:w-3 before:h-px before:bg-[var(--cdb-chrome-line)] after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-px after:h-3 after:bg-[var(--cdb-chrome-line)]",
  }[anchor];
  const padByAnchor = {
    tl: "pt-3 pl-3",
    tr: "pt-3 pr-3",
    bl: "pb-3 pl-3",
    br: "pb-3 pr-3",
  }[anchor];
  return (
    <div
      className={cn(
        "absolute z-10 font-mono text-[10px] sm:text-[11px] leading-[1.4] uppercase tracking-[var(--cdb-tracking-code)] text-[var(--cdb-paper)]/80",
        pos,
        tick && bracket,
        tick && padByAnchor
      )}
    >
      {text.split(" · ").map((part, i) => (
        <span key={i} className="block whitespace-nowrap">
          {part}
        </span>
      ))}
    </div>
  );
};

export function CdBCornerChrome({
  topLeft = "CULTURE DIVISION · SIGNALFRAME SYSTEM",
  topRight,
  bottomLeft = "SF//FRM-001 · PAGE 01/07",
  bottomRight = "signalframe.culturedivision.com",
  geoCoord = "-33.9249°S · 18.4241°E",
  tick = true,
  className,
}: CdBCornerChromeProps) {
  const tr =
    topRight ??
    `CDBRANCH/EXT · 2026.04.18 · v1.0`;
  const br = geoCoord ? `${bottomRight} · ${geoCoord}` : bottomRight;
  return (
    <div
      aria-hidden="false"
      role="complementary"
      className={cn(
        "pointer-events-none absolute inset-0 z-[var(--z-hud,50)]",
        className
      )}
    >
      <CornerLabel anchor="tl" text={topLeft} tick={tick} />
      <CornerLabel anchor="tr" text={tr} tick={tick} />
      <CornerLabel anchor="bl" text={bottomLeft} tick={tick} />
      <CornerLabel anchor="br" text={br} tick={tick} />
    </div>
  );
}
