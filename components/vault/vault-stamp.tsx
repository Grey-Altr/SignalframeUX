import React from "react";
import { cn } from "@/lib/utils";

export type VaultStampTreatment =
  | "ink"
  | "faded"
  | "smeared"
  | "double"
  | "strike"
  | "rotated"
  | "outline"
  | "inverted";

interface VaultStampProps {
  text: string;
  code?: string;
  treatment?: VaultStampTreatment;
  rotate?: number;
  className?: string;
}

/*
 * Stamp primitive with 8 treatment variants — the peer-group's
 * physical-ink-mark vocabulary carried into the browser. Each
 * treatment models a different failure mode of actual rubber-stamp
 * application, which is what makes the cdB stamp register feel
 * analog rather than decorative.
 *
 *   ink        clean full-strength fill (reference)
 *   faded      reduced opacity, partial transfer
 *   smeared    horizontal x-skew + slight blur, stamp-in-motion
 *   double     offset duplicate, double-stamped
 *   strike     strikethrough line across
 *   rotated    violent rotation (default +/-8°)
 *   outline    lime border, transparent fill
 *   inverted   black-on-lime → lime-on-black
 */
export function VaultStamp({
  text,
  code,
  treatment = "ink",
  rotate = 0,
  className,
}: VaultStampProps) {
  const base =
    "inline-flex flex-col items-start gap-0.5 px-3 py-1.5 font-mono uppercase tracking-[var(--cdb-tracking-chrome)] text-[11px] sm:text-xs leading-none select-none border-2";

  const fillStyles = {
    ink: "bg-[var(--cdb-lime)] text-[var(--cdb-lime-foreground)] border-[var(--cdb-lime)]",
    faded:
      "bg-[var(--cdb-lime)]/55 text-[var(--cdb-lime-foreground)]/75 border-[var(--cdb-lime)]/55",
    smeared:
      "bg-[var(--cdb-lime)] text-[var(--cdb-lime-foreground)] border-[var(--cdb-lime)]",
    double:
      "bg-[var(--cdb-lime)] text-[var(--cdb-lime-foreground)] border-[var(--cdb-lime)]",
    strike:
      "bg-[var(--cdb-lime)] text-[var(--cdb-lime-foreground)] border-[var(--cdb-lime)] line-through decoration-[var(--cdb-lime-foreground)] decoration-2",
    rotated:
      "bg-[var(--cdb-lime)] text-[var(--cdb-lime-foreground)] border-[var(--cdb-lime)]",
    outline:
      "bg-transparent text-[var(--cdb-lime)] border-[var(--cdb-lime)]",
    inverted:
      "bg-[var(--cdb-black)] text-[var(--cdb-lime)] border-[var(--cdb-lime)]",
  }[treatment];

  const effectiveRotate =
    treatment === "rotated" && rotate === 0
      ? (Math.random() > 0.5 ? 1 : -1) * 8
      : rotate;

  const transform = [
    effectiveRotate && `rotate(${effectiveRotate}deg)`,
    treatment === "smeared" && "skewX(-9deg)",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <span className={cn(base, fillStyles, className)} style={{ transform }}>
      <span className="font-bold whitespace-nowrap">{text}</span>
      {code && (
        <span className="font-normal text-[9px] sm:text-[10px] opacity-80 whitespace-nowrap">
          {code}
        </span>
      )}
    </span>
  );

  if (treatment === "double") {
    // Offset duplicate beneath the main stamp for registration-error effect.
    return (
      <span className="relative inline-flex">
        <span
          className={cn(base, fillStyles, "absolute top-[3px] left-[3px] opacity-55")}
          aria-hidden="true"
          style={{ transform }}
        >
          <span className="font-bold whitespace-nowrap">{text}</span>
          {code && (
            <span className="font-normal text-[9px] sm:text-[10px] opacity-80 whitespace-nowrap">
              {code}
            </span>
          )}
        </span>
        {content}
      </span>
    );
  }

  if (treatment === "smeared") {
    return (
      <span className="inline-flex" style={{ filter: "blur(0.4px)" }}>
        {content}
      </span>
    );
  }

  return content;
}
