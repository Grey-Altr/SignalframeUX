"use client";

import { useRef, useCallback, useEffect } from "react";
import { triggerColorStutter } from "@/lib/color-stutter";

const ACCENT_COLORS = [
  "oklch(0.7 0.18 195)",   // Cyan
  "oklch(0.75 0.3 140)",   // Lime
  "oklch(0.75 0.18 75)",   // Amber
  "oklch(0.65 0.22 25)",   // Coral
  "oklch(0.55 0.25 290)",  // Violet
  "oklch(0.55 0.25 10)",   // Red
  "oklch(0.65 0.3 350)",   // Magenta
];

const SCROLL_THRESHOLD = 60;
const IDLE_MS = 200;
const WIPE_DURATION = 150;

function triggerLocalWipe(container: HTMLElement, direction: number, onMid: () => void) {
  let wipeEl = container.querySelector<HTMLDivElement>(".sf-frame-wipe");
  if (!wipeEl) {
    wipeEl = document.createElement("div");
    wipeEl.className = "sf-frame-wipe";
    Object.assign(wipeEl.style, {
      position: "absolute",
      inset: "0",
      zIndex: "1",
      background: "#000",
      pointerEvents: "none",
      transform: "scaleY(0)",
      willChange: "transform",
    });
    wipeEl.setAttribute("aria-hidden", "true");
    container.style.position = "relative";
    container.style.overflow = "hidden";
    container.appendChild(wipeEl);
  }

  const fromDir = direction > 0 ? "top" : "bottom";
  const toDir = direction > 0 ? "bottom" : "top";

  wipeEl.style.transition = "none";
  wipeEl.style.transformOrigin = fromDir;
  wipeEl.style.transform = "scaleY(0)";
  void wipeEl.offsetHeight;

  wipeEl.style.transition = `transform ${WIPE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  wipeEl.style.transform = "scaleY(1)";

  let covered = false;
  const handleCover = () => {
    if (covered) return;
    covered = true;
    wipeEl!.removeEventListener("transitionend", handleCover);
    onMid();

    wipeEl!.style.transition = "none";
    wipeEl!.style.transformOrigin = toDir;
    void wipeEl!.offsetHeight;

    wipeEl!.style.transition = `transform ${WIPE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    wipeEl!.style.transform = "scaleY(0)";

    // Safety: force hide if transitionend doesn't fire on reveal
    setTimeout(() => { wipeEl!.style.transform = "scaleY(0)"; }, WIPE_DURATION + 50);
  };
  wipeEl.addEventListener("transitionend", handleCover, { once: true });
  // Safety: force cover callback if transitionend doesn't fire
  setTimeout(handleCover, WIPE_DURATION + 50);
}

export function ColorCycleFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(-1);
  const hoveredRef = useRef(false);
  const accumulatedRef = useRef(0);
  const lockedRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const random = Math.floor(Math.random() * ACCENT_COLORS.length);
    indexRef.current = random;
    document.documentElement.style.setProperty("--color-primary", ACCENT_COLORS[random]);
  }, []);

  const apply = useCallback((next: number, direction: number) => {
    indexRef.current = next;
    lockedRef.current = true;

    const container = ref.current;
    if (!container) return;
    triggerLocalWipe(container, direction, () => {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", ACCENT_COLORS[next]);
      triggerColorStutter();
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!hoveredRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        lockedRef.current = false;
        accumulatedRef.current = 0;
      }, IDLE_MS);

      if (lockedRef.current) return;

      accumulatedRef.current += e.deltaY;

      if (Math.abs(accumulatedRef.current) >= SCROLL_THRESHOLD) {
        const direction = accumulatedRef.current > 0 ? 1 : -1;
        accumulatedRef.current = 0;
        const next = (indexRef.current + direction + ACCENT_COLORS.length) % ACCENT_COLORS.length;
        apply(next, direction);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [apply]);

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={() => { hoveredRef.current = true; accumulatedRef.current = 0; }}
      onMouseLeave={() => { hoveredRef.current = false; accumulatedRef.current = 0; }}
      style={{ cursor: "ns-resize", position: "relative", overflow: "clip", verticalAlign: "bottom", lineHeight: "inherit", marginTop: "-58px" }}
    >
      {children}
    </span>
  );
}
