"use client";

import { useBorderless } from "@/components/providers/theme-provider";
import { Maximize, Minimize } from "lucide-react";

export function BorderlessToggle() {
  const { isBorderless, toggleBorderless } = useBorderless();

  return (
    <button
      onClick={toggleBorderless}
      className="flex items-center justify-center h-8 w-8 border-2 border-muted-foreground text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-200"
      aria-label={isBorderless ? "Disable borderless mode" : "Enable borderless mode"}
      title={isBorderless ? "Disable borderless mode" : "Enable borderless mode"}
    >
      {isBorderless ? (
        <Minimize className="size-4" strokeWidth={2} />
      ) : (
        <Maximize className="size-4" strokeWidth={2} />
      )}
    </button>
  );
}
