"use client";

import { useEffect, useCallback } from "react";
import { useLenisInstance } from "@/components/layout/lenis-provider";

export function BackToTop() {
  const lenis = useLenisInstance();

  const scrollToTop = useCallback(() => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [lenis]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Only trigger spacebar when near bottom of page and not in an input
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      if (e.code === "Space") {
        const scrollBottom = window.scrollY + window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        // Within 200px of bottom
        if (docHeight - scrollBottom < 200) {
          e.preventDefault();
          scrollToTop();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [scrollToTop]);

  return (
    <button
      onClick={scrollToTop}
      className="w-full mt-6 py-3 border-2 border-foreground/20 hover:border-primary text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary font-bold font-mono transition-colors duration-[var(--sfx-duration-normal)]"
    >
      ▲ BACK TO TOP
    </button>
  );
}
