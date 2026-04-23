"use client";

import { useEffect } from "react";

/**
 * R-63-b dev-only assertion: total document scroll-height must be an integer
 * multiple of port-height. Logs a warning when the remainder exceeds the
 * sub-pixel tolerance, listing every panel and the computed delta.
 *
 * Runs in `process.env.NODE_ENV === 'development'` only — zero cost in
 * production builds. Rechecks on resize and panel add/remove via
 * ResizeObserver + MutationObserver, rAF-debounced.
 */

const TOLERANCE_PX = 2;
const LOG_PREFIX = "[R-63-b]";

type State = { key: string | null };

function buildCheck(state: State) {
  return function check(): void {
    const innerHeight = window.innerHeight;
    if (innerHeight <= 0) return;

    const scrollHeight = document.documentElement.scrollHeight;
    const ratio = scrollHeight / innerHeight;
    const remainder = scrollHeight - Math.round(ratio) * innerHeight;
    const remainderAbs = Math.abs(Math.round(remainder));

    // Signature: changes only when the actual violation changes. MutationObserver
    // fires on every GSAP / Lenis DOM mutation; dedupe to avoid log spam.
    const key =
      remainderAbs <= TOLERANCE_PX
        ? "pass"
        : `${scrollHeight}|${innerHeight}|${remainderAbs}`;
    if (key === state.key) return;
    state.key = key;

    if (remainderAbs <= TOLERANCE_PX) return;

    const panels = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]"),
    ).map((p) => {
      const rect = p.getBoundingClientRect();
      return {
        id: p.getAttribute("data-section"),
        height: Math.round(rect.height),
        offsetTop: Math.round(rect.top + window.scrollY),
      };
    });

    const panelsTotal = panels.reduce((sum, p) => sum + p.height, 0);
    const last = panels.at(-1);
    const orphanBelow = last
      ? scrollHeight - last.offsetTop - last.height
      : 0;

    console.warn(
      `%c${LOG_PREFIX}%c scroll-height is not an integer multiple of port height`,
      "color: oklch(0.7 0.2 30); font-weight: bold",
      "color: inherit",
      {
        scrollHeight,
        innerHeight,
        ratio: ratio.toFixed(3),
        remainderPx: Math.round(remainder),
        tolerancePx: TOLERANCE_PX,
        panels,
        panelsHeightTotal: panelsTotal,
        orphanBelowLastPanel: Math.round(orphanBelow),
      },
    );
  };
}

export function PanelHeightAssertion(): null {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const state: State = { key: null };
    const check = buildCheck(state);

    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        check();
      });
    };

    schedule();

    const resizeObs = new ResizeObserver(schedule);
    resizeObs.observe(document.documentElement);

    const mutationObs = new MutationObserver(schedule);
    mutationObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      resizeObs.disconnect();
      mutationObs.disconnect();
    };
  }, []);

  return null;
}
