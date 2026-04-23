"use client";

/**
 * R-64 keyboard model — spacebar-driven panel navigation.
 *
 * Space advances one frame, Shift+Space retreats, Home/End jump to ends.
 * PageUp/PageDown and Arrow keys aliased. One keypress = one frame.
 *
 * Registry-backed per R-63-i and R-64-g: panel offsets (px) are cached on
 * mount, invalidated via ResizeObserver (port resize) + MutationObserver
 * (panel add/remove). The keydown hot path is O(1) and reads no layout.
 *
 * Integrates with the existing LenisProvider for smooth scroll. Under
 * prefers-reduced-motion or `QualityTier === 'fallback'`, skips the tween
 * and uses window.scrollTo({ behavior: 'auto' }) per R-64-e / R-64-h.
 *
 * Focus guards per R-64-d: keybindings inactive inside input/textarea/
 * contenteditable/role=textbox/role=combobox — native space preserved.
 *
 * @module hooks/use-frame-navigation
 */

import { useEffect, useRef } from "react";
import { useLenisInstance } from "@/components/layout/lenis-provider";
import { getQualityTier } from "@/lib/effects/quality-tier";

const PANEL_SELECTOR = "[data-section]";
const SNAP_TOLERANCE_PX = 2;

const EDITABLE_ROLES = new Set([
  "textbox",
  "combobox",
  "searchbox",
  "spinbutton",
]);

function isInEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  if (target.isContentEditable) return true;
  const role = target.getAttribute("role");
  if (role && EDITABLE_ROLES.has(role)) return true;
  return false;
}

function readPanelOffsets(): number[] {
  const panels = document.querySelectorAll<HTMLElement>(PANEL_SELECTOR);
  const offsets: number[] = [];
  const scrollY = window.scrollY;
  for (const panel of panels) {
    const rect = panel.getBoundingClientRect();
    offsets.push(rect.top + scrollY);
  }
  offsets.sort((a, b) => a - b);
  return offsets;
}

export function useFrameNavigation(): void {
  const lenis = useLenisInstance();
  const offsetsRef = useRef<number[]>([]);
  const transitioningRef = useRef(false);

  useEffect(() => {
    let rebuildScheduled = false;
    const rebuild = () => {
      offsetsRef.current = readPanelOffsets();
    };
    const scheduleRebuild = () => {
      if (rebuildScheduled) return;
      rebuildScheduled = true;
      requestAnimationFrame(() => {
        rebuildScheduled = false;
        rebuild();
      });
    };

    rebuild();

    const resizeObs = new ResizeObserver(scheduleRebuild);
    resizeObs.observe(document.documentElement);

    const mutationObs = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (
            node instanceof HTMLElement &&
            (node.matches(PANEL_SELECTOR) ||
              node.querySelector(PANEL_SELECTOR))
          ) {
            scheduleRebuild();
            return;
          }
        }
        for (const node of m.removedNodes) {
          if (
            node instanceof HTMLElement &&
            (node.matches(PANEL_SELECTOR) ||
              node.querySelector(PANEL_SELECTOR))
          ) {
            scheduleRebuild();
            return;
          }
        }
      }
    });
    mutationObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      resizeObs.disconnect();
      mutationObs.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isInEditable(e.target)) return;

      const isNext =
        (e.code === "Space" && !e.shiftKey) ||
        e.code === "ArrowDown" ||
        e.code === "PageDown";
      const isPrev =
        (e.code === "Space" && e.shiftKey) ||
        e.code === "ArrowUp" ||
        e.code === "PageUp";
      const isFirst = e.code === "Home";
      const isLast = e.code === "End";

      if (!isNext && !isPrev && !isFirst && !isLast) return;

      if (transitioningRef.current) {
        e.preventDefault();
        return;
      }

      const offsets = offsetsRef.current;
      if (offsets.length === 0) return;

      const currentScroll = window.scrollY;

      let currentIdx = 0;
      for (let i = 0; i < offsets.length; i++) {
        if (offsets[i] <= currentScroll + SNAP_TOLERANCE_PX) currentIdx = i;
        else break;
      }

      const atCurrent =
        Math.abs(currentScroll - offsets[currentIdx]) <= SNAP_TOLERANCE_PX;

      let targetIdx: number;
      if (isFirst) {
        targetIdx = 0;
      } else if (isLast) {
        targetIdx = offsets.length - 1;
      } else if (isNext) {
        targetIdx = Math.min(currentIdx + 1, offsets.length - 1);
      } else {
        targetIdx = atCurrent
          ? Math.max(currentIdx - 1, 0)
          : currentIdx;
      }

      if (
        targetIdx === currentIdx &&
        atCurrent &&
        !isFirst &&
        !isLast
      ) {
        return;
      }

      e.preventDefault();

      const target = offsets[targetIdx];
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const tier = getQualityTier();
      const instant = reducedMotion || tier === "fallback" || !lenis;

      if (instant) {
        window.scrollTo({ top: target, behavior: "auto" });
        return;
      }

      transitioningRef.current = true;
      lenis.scrollTo(target, {
        lock: true,
        onComplete: () => {
          transitioningRef.current = false;
        },
      });
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lenis]);
}
