"use client";

import { useEffect, useRef, useState } from "react";
import { useNavReveal } from "@/hooks/use-nav-reveal";

type Mode = "pending" | "intro" | "scroll";

/**
 * Homepage: reveals the nav via the page-load intro sequence. Sets
 * body[data-nav-visible="true"] so the nav container flips out of
 * `sf-nav-hidden`, and body[data-nav-intro="true"] so per-block clip-path
 * construct animations in globals.css run with their staggered delays.
 * Construction window is tuned to land inside the existing entry choreography
 * (t≈7.0s → 8.6s, before the subtitle at ~9s) so total intro length is
 * unchanged.
 */
function NavIntroMount() {
  useEffect(() => {
    document.body.dataset.navVisible = "true";
    document.body.dataset.navIntro = "true";
    return () => {
      delete document.body.dataset.navIntro;
      document.body.dataset.navVisible = "true";
    };
  }, []);
  return null;
}

/** Subpage: existing scroll-trigger reveal path (nav appears once the page
 *  header scrolls out of view). */
function NavScrollMount({ targetSelector }: { targetSelector: string }) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    triggerRef.current = document.querySelector<HTMLElement>(targetSelector);
    setReady(true);
  }, [targetSelector]);

  useNavReveal(triggerRef);
  return null;
}

/**
 * Mounts the correct nav-reveal strategy based on the matched trigger:
 *  - `[data-entry-section]` (homepage) → page-load intro construct
 *  - `[data-nav-reveal-trigger]` (subpages) → ScrollTrigger reveal on header scroll-out
 *
 * Renders nothing -- pure side effect.
 */
export function NavRevealMount({ targetSelector }: { targetSelector: string }) {
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(targetSelector);
    setMode(el?.hasAttribute("data-entry-section") ? "intro" : "scroll");
  }, [targetSelector]);

  if (mode === "pending") return null;
  if (mode === "intro") return <NavIntroMount />;
  return <NavScrollMount targetSelector={targetSelector} />;
}
