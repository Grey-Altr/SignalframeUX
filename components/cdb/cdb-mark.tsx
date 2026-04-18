import React from "react";
import { cn } from "@/lib/utils";

interface CdBMarkProps {
  code: string;
  label?: string;
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}

/*
 * cdB catalog mark — a single entry in the serialized grid.
 *
 * "The catalog IS the brand" (per cdB digest). Each mark renders a
 * form slot + a coded label strip. Cells are square, 1px lime-border,
 * form centered. Label strip at bottom holds the serial code and an
 * optional secondary label (form descriptor).
 *
 * Accent=true swaps the border color to lime and tints the label
 * strip — one or two hero cells per catalog break the uniform grid.
 */
export function CdBMark({
  code,
  label,
  children,
  accent = false,
  className,
}: CdBMarkProps) {
  return (
    <div
      data-cdb-mark
      data-cdb-accent={accent}
      className={cn(
        "group relative aspect-square flex flex-col",
        "border",
        accent
          ? "border-[var(--cdb-lime)]"
          : "border-[var(--cdb-chrome-line)]",
        "bg-[var(--cdb-black)]",
        className
      )}
    >
      {/* form slot */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {children}
      </div>
      {/* label strip */}
      <div
        className={cn(
          "border-t font-mono text-[10px] leading-none uppercase tracking-[var(--cdb-tracking-code)] px-2 py-2 flex justify-between items-baseline gap-2",
          accent
            ? "border-[var(--cdb-lime)] bg-[var(--cdb-lime)] text-[var(--cdb-lime-foreground)]"
            : "border-[var(--cdb-chrome-line)] text-[var(--cdb-paper)]/80"
        )}
      >
        <span className="font-bold whitespace-nowrap">{code}</span>
        {label && (
          <span className="font-normal opacity-80 whitespace-nowrap truncate">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
