"use client";

import { useBorderless } from "@/components/providers/theme-provider";
import { Maximize, Minimize } from "lucide-react";

export function BorderlessToggle() {
  const { isBorderless, toggleBorderless } = useBorderless();

  return (
    <button
      onClick={toggleBorderless}
      className="flex items-center justify-center size-[clamp(28px,3vw,36px)] border-2 border-foreground text-foreground hover:text-primary hover:border-primary transition-colors duration-200"
      aria-label={isBorderless ? "Disable borderless mode" : "Enable borderless mode"}
      title={isBorderless ? "Disable borderless mode" : "Enable borderless mode"}
    >
      {isBorderless ? (
        <Minimize className="size-[clamp(14px,1.5vw,18px)]" strokeWidth={2} />
      ) : (
        <Maximize className="size-[clamp(14px,1.5vw,18px)]" strokeWidth={2} />
      )}
    </button>
  );
}
