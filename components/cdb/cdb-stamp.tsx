import React from "react";
import { cn } from "@/lib/utils";

interface CdBStampProps extends React.ComponentProps<"span"> {
  text: string;
  variant?: "fill" | "outline";
  rotate?: number;
  code?: string;
}

/*
 * cdB stamp vocabulary — the green-pill mark that recurs across
 * peer packs (ORGULLECIDA, NEVER COME BACK, BERSERKER!, Nevermore,
 * DECODED, COUNTERPRODUCTIVE). Lime-green fill, hard rectangle, no
 * rounded corners, always all-caps mono. Optional rotation simulates
 * physical ink-stamp application.
 *
 * Variant "fill" = solid lime background, black text (the peer default).
 * Variant "outline" = lime 2px border, lime text, transparent ground.
 *
 * The `code` prop appends a serialized ID below the main text in a
 * smaller weight, matching E0000_NN / SF//STM-NN catalog grammar.
 */
export function CdBStamp({
  text,
  variant = "fill",
  rotate = 0,
  code,
  className,
  style,
  ...props
}: CdBStampProps) {
  return (
    <span
      data-cdb-stamp
      data-cdb-variant={variant}
      className={cn(
        "inline-flex flex-col items-start gap-0.5 px-3 py-1.5 font-mono uppercase tracking-[var(--cdb-tracking-chrome)] text-[11px] sm:text-xs leading-none select-none",
        variant === "fill" &&
          "bg-[var(--cdb-lime)] text-[var(--cdb-lime-foreground)] border-2 border-[var(--cdb-lime)]",
        variant === "outline" &&
          "bg-transparent text-[var(--cdb-lime)] border-2 border-[var(--cdb-lime)]",
        className
      )}
      style={{
        transform: rotate !== 0 ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
      {...props}
    >
      <span className="font-bold whitespace-nowrap">{text}</span>
      {code && (
        <span className="font-normal text-[9px] sm:text-[10px] opacity-80 whitespace-nowrap">
          {code}
        </span>
      )}
    </span>
  );
}
