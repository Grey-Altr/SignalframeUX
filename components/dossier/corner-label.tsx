import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CornerSlot = "tl" | "tr" | "bl" | "br";

const slotClass: Record<CornerSlot, string> = {
  tl: "top-0 left-0",
  tr: "top-0 right-0 text-right",
  bl: "bottom-0 left-0",
  br: "bottom-0 right-0 text-right",
};

export function CornerLabel({
  slot,
  children,
  className,
}: {
  slot: CornerSlot;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-corner={slot}
      className={cn(
        "fixed z-50 p-6 md:p-8 font-[var(--font-jetbrains)] text-[10px] md:text-[11px] uppercase tracking-[0.15em] leading-[1.4]",
        slotClass[slot],
        className,
      )}
      style={{
        color: "var(--dossier-ink, oklch(0.95 0 0))",
        backgroundColor: "var(--dossier-substrate, oklch(0 0 0))",
      }}
    >
      {children}
    </div>
  );
}
