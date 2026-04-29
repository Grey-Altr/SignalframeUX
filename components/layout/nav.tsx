"use client";

import { useState, memo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPaletteLazy as CommandPalette } from "@/components/layout/command-palette-lazy";
import { SlashFocusListener } from "./slash-focus-listener";
import { ColorCycleFrame } from "@/components/animation/color-cycle-frame";
import { useLenisInstance } from "@/components/layout/lenis-provider";
import {
  getSignalOverlayOpen,
  subscribeSignalOverlay,
  toggleSignalOverlayOpen,
} from "@/lib/signal-overlay-store";

const IconInventory = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <g className="sf-inventory-cell sf-inventory-cell--1">
      <rect x="3" y="3" width="8" height="8" />
    </g>
    <g className="sf-inventory-cell sf-inventory-cell--2">
      <rect x="13" y="3" width="8" height="4" />
    </g>
    <g className="sf-inventory-cell sf-inventory-cell--3">
      <rect x="13" y="9" width="8" height="12" />
    </g>
    <g className="sf-inventory-cell sf-inventory-cell--4">
      <rect x="3" y="13" width="8" height="8" />
    </g>
  </svg>
);

const IconApi = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <g className="sf-api-segment sf-api-segment--1">
      <rect x="3" y="10" width="12" height="4" />
    </g>
    <g className="sf-api-segment sf-api-segment--2">
      <rect x="15" y="7" width="6" height="10" />
    </g>
    <g className="sf-api-segment sf-api-segment--3">
      <rect x="7" y="5" width="4" height="14" />
    </g>
  </svg>
);

const IconSystem = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <g className="sf-system-outer">
      <path fillRule="evenodd" clipRule="evenodd" d="M3 3h18v18H3V3zm4 4v10h10V7H7z" />
    </g>
    <rect className="sf-system-inner" x="9" y="9" width="6" height="6" />
  </svg>
);

const IconBuilds = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <g className="sf-builds-segment sf-builds-segment--1">
      <rect x="3" y="5" width="18" height="4" />
    </g>
    <g className="sf-builds-segment sf-builds-segment--2">
      <rect x="3" y="11" width="10" height="8" />
    </g>
    <g className="sf-builds-segment sf-builds-segment--3">
      <rect x="15" y="11" width="6" height="8" />
    </g>
  </svg>
);

const IconInit = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <g className="sf-init-segment sf-init-segment--1">
      <rect x="4" y="4" width="6" height="16" />
    </g>
    <g className="sf-init-segment sf-init-segment--2">
      <rect x="12" y="8" width="4" height="8" />
    </g>
    <g className="sf-init-segment sf-init-segment--3">
      <rect x="18" y="10" width="2" height="4" />
    </g>
  </svg>
);

const IconGithub = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13 3h8v8h-4V8.828l-5.172 5.172-2.828-2.828L14.172 6H13V3zM3 13h4v8H3v-8z" />
  </svg>
);
const IconCommandGrid = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M1 2h14v20H1V2zM6 7h9v10H6V7z" />
    <path d="M8 9h7v6H8z" />
    <path d="M17 2h7v6h-7z" />
    <path d="M17 9h7v6h-7z" />
    <path d="M17 16h7v6h-7z" />
  </svg>
);

/**
 * SIGNAL overlay button glyph — the // brand mark in the same brutalist-flat
 * geometric register as the rest of the nav glyphs. Two parallelograms, 6-unit
 * thick, lean-shift 6, 2-unit gap, symmetric in the 24x24 viewBox.
 */
const IconSignal = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <polygon points="8 2, 14 2, 8 22, 2 22" />
    <polygon points="16 2, 22 2, 16 22, 10 22" />
  </svg>
);

/**
 * Scroll-to-top glyph — two MAX-chunk chevron BANDS pointing up. Full-width
 * (x=0..24), 9-unit vertical thickness (~8.31 perpendicular), 1-unit inter-band
 * gap. Slope 5/12 (22.6°) — borderline-flat but still reads as chevron, max
 * thickness while keeping the V-cut notch at inner-apex visible.
 *   Chev 1: apex (12, 0), outer-bot (0|24, 5), inner-apex (12, 9), inner-bot (0|24, 14)
 *   Chev 2: apex (12, 10), outer-bot (0|24, 15), inner-apex (12, 19), inner-bot (0|24, 24)
 */
const IconChevronsUp = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M0 5 L12 0 L24 5 L24 14 L12 9 L0 14 Z" />
    <path d="M0 15 L12 10 L24 15 L24 24 L12 19 L0 24 Z" />
  </svg>
);
import { DarkModeToggle } from "@/components/layout/dark-mode-toggle";
import { BorderlessToggle } from "@/components/layout/borderless-toggle";

/**
 * SIGNAL overlay toggle living inside the nav chrome cluster (was previously
 * a floating bottom-right "S" button in components/animation/signal-overlay.tsx).
 * Drives the shared lib/signal-overlay-store so the panel + Shift+S shortcut
 * stay in sync. Always visible — opening the panel is a deliberate action, so
 * the affordance should be discoverable at all times.
 */
function NavSignalToggle() {
  const [isOpen, setIsOpen] = useState<boolean>(getSignalOverlayOpen);
  useEffect(() => subscribeSignalOverlay(setIsOpen), []);
  return (
    <button
      type="button"
      onClick={toggleSignalOverlayOpen}
      aria-label={isOpen ? "Close SIGNAL overlay" : "Open SIGNAL overlay (or press Shift+S)"}
      aria-expanded={isOpen}
      aria-controls="signal-overlay-panel"
      className={`flex items-center justify-center w-8 h-8 border-2 transition-colors duration-[var(--sfx-duration-fast)] ${
        isOpen
          ? "border-primary bg-primary text-primary-foreground"
          : "border-muted-foreground bg-transparent text-muted-foreground hover:text-primary hover:border-primary"
      }`}
    >
      <IconSignal width={NAV_GLYPH_PX} height={NAV_GLYPH_PX} aria-hidden />
    </button>
  );
}

/**
 * Scroll-to-top control living inside the nav chrome cluster (was previously
 * a floating bottom-right button). Stays in-flow so the row doesn't reflow on
 * first scroll; opacity + pointer-events gate the affordance until the user
 * has actually scrolled past 1 viewport.
 */
function NavScrollToTop() {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const lenis = useLenisInstance();

  useEffect(() => {
    let rafId = 0;
    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const next = window.scrollY > window.innerHeight;
        if (next !== visibleRef.current) {
          visibleRef.current = next;
          setVisible(next);
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: "auto" });
      }}
      className="flex items-center justify-center w-8 h-8 border-2 border-muted-foreground bg-transparent text-muted-foreground hover:text-primary hover:border-primary transition-colors duration-[var(--sfx-duration-fast)]"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition:
          "opacity var(--sfx-duration-normal) var(--sfx-ease-default), background-color var(--sfx-duration-fast) var(--sfx-ease-default), color var(--sfx-duration-fast) var(--sfx-ease-default), border-color var(--sfx-duration-fast) var(--sfx-ease-default)",
      }}
    >
      <IconChevronsUp width={NAV_GLYPH_PX} height={NAV_GLYPH_PX} aria-hidden />
    </button>
  );
}

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/[]{}";
const NAV_UNIT_PX = 32;
const NAV_NOTCH_PX = 8;
const NAV_GLYPH_PX = 16;

function scrambleLabel(target: string, revealCount: number) {
  return target
    .split("")
    .map((char, index) => {
      if (char === " ") return " ";
      if (index < revealCount) return target[index];
      return SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
    })
    .join("");
}

const NavCubeLink = memo(function NavCubeLink({
  href,
  label,
  icon: Icon,
  isActive,
  rolloutActive,
  rolloutWidth,
  isInventory,
  isApi,
  isSystem,
  isBuilds,
  isInit,
  isGithub,
  ariaLabel,
  external,
  cubeIndex,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  rolloutActive: boolean;
  rolloutWidth: string;
  isInventory: boolean;
  isApi: boolean;
  isSystem: boolean;
  isBuilds: boolean;
  isInit: boolean;
  isGithub: boolean;
  ariaLabel?: string;
  external?: boolean;
  cubeIndex: number;
}) {
  const linkProps = external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
  const [expanded, setExpanded] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [reduceMotion, setReduceMotion] = useState(false);
  const scrambleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const stopScramble = useCallback(() => {
    if (scrambleTimerRef.current) {
      window.clearInterval(scrambleTimerRef.current);
      scrambleTimerRef.current = null;
    }
  }, []);

  const runScramble = useCallback(() => {
    stopScramble();
    if (reduceMotion) {
      setDisplayText(label);
      return;
    }
    let frame = 0;
    setDisplayText(scrambleLabel(label, 0));
    scrambleTimerRef.current = window.setInterval(() => {
      frame += 1;
      const revealCount = Math.min(label.length, Math.floor(frame / 2));
      if (revealCount >= label.length) {
        setDisplayText(label);
        stopScramble();
        return;
      }
      setDisplayText(scrambleLabel(label, revealCount));
    }, 34);
  }, [label, reduceMotion, stopScramble]);

  const handleExpand = useCallback(() => {
    setExpanded(true);
    runScramble();
  }, [runScramble]);

  const handleCollapse = useCallback(() => {
    if (rolloutActive) return;
    setExpanded(false);
    stopScramble();
    setDisplayText("");
  }, [rolloutActive, stopScramble]);

  useEffect(() => () => stopScramble(), [stopScramble]);

  useEffect(() => {
    if (rolloutActive) {
      stopScramble();
      setDisplayText(label);
      return;
    }
    if (!expanded) {
      setDisplayText("");
    }
  }, [rolloutActive, expanded, label, stopScramble]);

  const isRolledOut = rolloutActive || expanded;
  const rolloutHoverWidth = `calc(${rolloutWidth} + 0.75ch)`;
  const hasPrefix = displayText.startsWith("//");
  const labelPrefix = hasPrefix ? "//" : "";
  const labelBody = hasPrefix ? displayText.slice(2) : displayText;

  const cubeBaseClass =
    "group relative flex items-center overflow-hidden no-underline font-mono text-[var(--text-2xs)] font-bold uppercase tracking-[0.08em] transition-all duration-[var(--sfx-duration-slow)] ease-in-out pointer-events-auto";
  const cubePaletteClass = isActive
    ? "bg-[var(--sfx-cube-fill)] text-black ring-1 ring-black"
    : "bg-[var(--sfx-cube-fill)] text-black hover:bg-[var(--sfx-cube-fill)]";

  return (
    <div
      data-nav-cube=""
      data-cube-index={cubeIndex}
      className="inline-flex"
      style={{
        ["--cube-index" as string]: cubeIndex,
      }}
    >
      <div
        className={`${cubeBaseClass} ${cubePaletteClass}`}
        style={{
          width: expanded ? rolloutHoverWidth : isRolledOut ? rolloutWidth : `${NAV_UNIT_PX}px`,
          minWidth: `${NAV_UNIT_PX}px`,
          height: `${NAV_UNIT_PX}px`,
          cursor: "pointer",
          clipPath: `polygon(0 0, calc(100% - ${NAV_NOTCH_PX}px) 0, 100% ${NAV_NOTCH_PX}px, 100% 100%, 0 100%)`,
          transitionTimingFunction: expanded ? "var(--sfx-ease-default)" : "cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        onMouseEnter={handleExpand}
        onMouseLeave={handleCollapse}
        onFocus={handleExpand}
        onBlur={handleCollapse}
      >
        <Link
        href={href}
        data-anim="nav-link"
        aria-label={ariaLabel ?? label}
        aria-current={isActive ? "page" : undefined}
        className="flex items-center w-full h-full no-underline text-inherit"
        {...linkProps}
      >
        <span
          className="flex shrink-0 items-center justify-center text-[var(--text-2xs)]"
          style={{ width: `${NAV_UNIT_PX}px`, height: `${NAV_UNIT_PX}px` }}
        >
          {isInventory ? (
            <Icon
              className="sf-nav-icon sf-nav-icon--inventory"
              style={{ width: `${NAV_GLYPH_PX}px`, height: `${NAV_GLYPH_PX}px` }}
            />
          ) : isApi ? (
            <Icon
              className="sf-nav-icon sf-nav-icon--api"
              style={{ width: `${NAV_GLYPH_PX}px`, height: `${NAV_GLYPH_PX}px` }}
            />
          ) : isSystem ? (
            <Icon
              className="sf-nav-icon sf-nav-icon--system"
              style={{ width: `${NAV_GLYPH_PX}px`, height: `${NAV_GLYPH_PX}px` }}
            />
          ) : isBuilds ? (
            <Icon
              className="sf-nav-icon sf-nav-icon--builds"
              style={{ width: `${NAV_GLYPH_PX}px`, height: `${NAV_GLYPH_PX}px` }}
            />
          ) : isInit ? (
            <Icon
              className="sf-nav-icon sf-nav-icon--init"
              style={{ width: `${NAV_GLYPH_PX}px`, height: `${NAV_GLYPH_PX}px` }}
            />
          ) : isGithub ? (
            <Icon
              className="sf-nav-icon sf-nav-icon--github"
              style={{ width: `${NAV_GLYPH_PX}px`, height: `${NAV_GLYPH_PX}px` }}
            />
          ) : (
            <span className="sf-nav-icon-stack">
              <Icon
                className="sf-nav-icon sf-nav-icon--trail sf-nav-icon--trail-1"
                style={{ width: `${NAV_GLYPH_PX}px`, height: `${NAV_GLYPH_PX}px` }}
              />
              <Icon
                className="sf-nav-icon sf-nav-icon--trail sf-nav-icon--trail-2"
                style={{ width: `${NAV_GLYPH_PX}px`, height: `${NAV_GLYPH_PX}px` }}
              />
              <Icon
                className="sf-nav-icon sf-nav-icon--main"
                style={{ width: `${NAV_GLYPH_PX}px`, height: `${NAV_GLYPH_PX}px` }}
              />
            </span>
          )}
        </span>
        <span
          className={`inline-flex h-full items-center whitespace-nowrap leading-none transition-opacity duration-[var(--sfx-duration-fast)] ${isRolledOut ? "opacity-100" : "opacity-0"}`}
          style={{
            paddingRight: `${NAV_UNIT_PX}px`,
            transform: isInventory && expanded ? "translateX(2px)" : "translateX(0)",
            transition: isInventory
              ? `transform 420ms ${expanded ? "cubic-bezier(0.22, 1, 0.36, 1)" : "cubic-bezier(0.34, 1.56, 0.64, 1)"}`
              : undefined,
          }}
        >
          {labelPrefix ? <span className="mr-[0.22em] inline-block tracking-[-0.28em]">{labelPrefix}</span> : null}
          {labelBody}
        </span>
      </Link>
      </div>
    </div>
  );
});

/** Base design in 14×14 space; expanded state scales vb up so border + spacing grow together. */
const GLYPH_VB_BASE = 14;
const GLYPH_VB_IDLE = 14;
/** Taller box so extra row + scaled modules fit without overlap (max 4 horizontal bands on hover). */
const GLYPH_VB_ACTIVE = 22;
const GLYPH_INSET_BASE = 2;
const ROW_MODULE_H_BASE = 2;
const CAP_H_BASE = 2;
const CAP_W_BASE = 6;
const BAR_W_BASE = 2;

/** Inner rollout bars: fixed px — only spacing/gaps animate with state. */
const SEG_H_PX = 2;
const SEG_W1_PX = 4;
const SEG_W2_PX = 3;
const SEG_W3_PX = 2;
const SEG_PIN_W1_PX = 11;
const SEG_PIN_W2_PX = 8;
const SEG_GAP_IDLE_PX = 1;
const SEG_GAP_ACTIVE_PX = 3;

function scaleFromVb(vb: number): number {
  return vb / GLYPH_VB_BASE;
}

function computeRolloutRows(rowCount: number, vb: number): { rowTops: number[]; rowH: number } {
  const s = scaleFromVb(vb);
  const inset = GLYPH_INSET_BASE * s;
  const innerTop = inset;
  const innerBottom = vb - inset;
  const innerH = innerBottom - innerTop;
  if (rowCount <= 0) return { rowTops: [], rowH: ROW_MODULE_H_BASE * s };
  const idealRowH = ROW_MODULE_H_BASE * s;
  let rowH = idealRowH;
  let gap = rowCount > 1 ? (innerH - rowCount * rowH) / (rowCount - 1) : 0;
  if (gap < 0.15 * s && rowCount > 1) {
    rowH = innerH / rowCount;
    gap = 0;
  }
  if (rowCount === 1) {
    return { rowTops: [innerTop + (innerH - rowH) / 2], rowH };
  }
  const rowTops = Array.from({ length: rowCount }, (_, i) => innerTop + i * (rowH + gap));
  return { rowTops, rowH };
}

/** Vertical bar segments only in gaps between row bands (cutouts frame each module row). */
function bracketVerticalSegments(
  rowTops: number[],
  vb: number,
  rowH: number,
): Array<{ y: number; h: number }> {
  const inset = GLYPH_INSET_BASE * scaleFromVb(vb);
  const innerBottom = vb - inset;
  const capBottom = inset;
  const segs: Array<{ y: number; h: number }> = [];
  const n = rowTops.length;
  if (n === 0) return segs;

  if (rowTops[0] > capBottom + 0.01) {
    segs.push({ y: capBottom, h: rowTops[0] - capBottom });
  }
  for (let i = 0; i < n - 1; i++) {
    const afterRow = rowTops[i] + rowH;
    const beforeNext = rowTops[i + 1];
    if (beforeNext > afterRow + 0.01) {
      segs.push({ y: afterRow, h: beforeNext - afterRow });
    }
  }
  const afterLast = rowTops[n - 1] + rowH;
  if (innerBottom > afterLast + 0.01) {
    segs.push({ y: afterLast, h: innerBottom - afterLast });
  }
  return segs;
}

function bracketCaps(vb: number): { capH: number; capW: number; barW: number } {
  const s = scaleFromVb(vb);
  return {
    capH: CAP_H_BASE * s,
    capW: CAP_W_BASE * s,
    barW: BAR_W_BASE * s,
  };
}

/** Ease for glyph vb / layout interpolation (matches glacial feel). */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

const GLYPH_VB_LERP_MS = 600;

const NavSignalGlyph = memo(function NavSignalGlyph({
  pinned,
  onPinnedChange,
  cubeIndex,
}: {
  pinned: boolean;
  onPinnedChange: (next: boolean) => void;
  cubeIndex: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const isActive = isHovered || pinned;
  const targetVb = isActive ? GLYPH_VB_ACTIVE : GLYPH_VB_IDLE;

  const vbRef = useRef(GLYPH_VB_IDLE);
  const rafRef = useRef<number | null>(null);
  const [vb, setVb] = useState(GLYPH_VB_IDLE);

  useEffect(() => {
    const from = vbRef.current;
    const to = targetVb;
    if (Math.abs(from - to) < 0.001) {
      vbRef.current = to;
      setVb(to);
      return;
    }
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    const t0 = performance.now();
    const tick = (now: number) => {
      const u = Math.min(1, (now - t0) / GLYPH_VB_LERP_MS);
      const eased = easeInOutCubic(u);
      const next = from + (to - from) * eased;
      vbRef.current = next;
      setVb(next);
      if (u < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        vbRef.current = to;
        setVb(to);
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [targetVb]);

  const vbSpan = GLYPH_VB_ACTIVE - GLYPH_VB_IDLE;
  const expandT = Math.max(0, Math.min(1, (vb - GLYPH_VB_IDLE) / vbSpan));
  const rowCount = Math.min(4, Math.max(3, Math.round(3 + (vb - GLYPH_VB_IDLE) / vbSpan)));
  const { rowTops, rowH: rowBandH } = computeRolloutRows(rowCount, vb);
  const vSegs = bracketVerticalSegments(rowTops, vb, rowBandH);
  const { capH, capW, barW } = bracketCaps(vb);
  const segmentGap = SEG_GAP_IDLE_PX + expandT * (SEG_GAP_ACTIVE_PX - SEG_GAP_IDLE_PX);

  const pinNarrow = pinned && expandT < 0.85;
  const segW1 = pinNarrow ? SEG_PIN_W1_PX : SEG_W1_PX;
  const segW2 = pinNarrow ? SEG_PIN_W2_PX : SEG_W2_PX;
  const segW3 = expandT * SEG_W3_PX;

  /** Left caps anchor at inner column (x=capW) and grow left on expand — reads as transforming in, not out from the outer corner. */
  const capS = isActive ? Math.max(expandT, 0.02) : 1;
  const capDrawW = capW * capS;
  const capX = capW - capDrawW;

  useEffect(() => {
    if (!isFlashing) return;
    const timer = window.setTimeout(() => setIsFlashing(false), 240);
    return () => window.clearTimeout(timer);
  }, [isFlashing]);

  const handleClick = () => {
    onPinnedChange(!pinned);
    setIsFlashing(true);
  };

  return (
    <div
      data-nav-glyph=""
      className="inline-flex"
      style={{ ["--cube-index" as string]: cubeIndex }}
    >
    <button
      type="button"
      aria-label="Toggle signal glyph orientation"
      aria-pressed={pinned}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={handleClick}
      className={`group relative flex items-center justify-center bg-transparent transition-colors duration-[var(--sfx-duration-glacial)] ease-in-out ${
        pinned || isFlashing ? "text-warning" : "text-black dark:text-[var(--sfx-primary-on-dark)]"
      }`}
      style={{
        width: `${NAV_UNIT_PX}px`,
        height: `${NAV_UNIT_PX}px`,
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 flex items-end justify-center"
        aria-hidden="true"
      >
        <span
          className="relative"
          style={{ width: vb, height: vb }}
        >
          <svg
            className="absolute left-0 top-0 h-full w-full"
            viewBox={`0 0 ${vb} ${vb}`}
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x={capX} y="0" width={capDrawW} height={capH} />
            <rect x={capX} y={vb - capH} width={capDrawW} height={capH} />
            {vSegs.map((seg, i) => (
              <rect key={i} x="0" y={seg.y} width={barW} height={seg.h} />
            ))}
          </svg>

          <span className="absolute inset-0">
            {rowTops.map((rowTop, index) => (
              <span
                key={index}
                className="absolute left-0 flex items-center"
                style={{
                  left: capW,
                  top: rowTop,
                  width: vb - capW,
                  height: rowBandH,
                  gap: segmentGap,
                }}
              >
                <span
                  className="bg-current shrink-0"
                  style={{
                    width: segW1,
                    height: SEG_H_PX,
                  }}
                />
                <span
                  className="bg-current shrink-0"
                  style={{
                    width: segW2,
                    height: SEG_H_PX,
                  }}
                />
                <span
                  className="shrink-0 min-w-0 overflow-hidden"
                  style={{
                    width: segW3,
                    height: SEG_H_PX,
                  }}
                >
                  <span className="block h-full bg-current" style={{ width: SEG_W3_PX }} />
                </span>
              </span>
            ))}
          </span>
        </span>
      </span>
    </button>
    </div>
  );
});

const NAV_LINKS: Array<{ href: string; label: string; ariaLabel?: string; external?: boolean; icon: React.ElementType }> = [
  { href: "/inventory", label: "//INVENTORY", icon: IconInventory },
  { href: "/reference", label: "//API", icon: IconApi },
  { href: "/system", label: "//SYSTEM", icon: IconSystem },
  { href: "/builds", label: "//BUILDS", icon: IconBuilds },
  { href: "/init", label: "//GET STARTED", icon: IconInit },
  { href: "https://github.com/signalframeux", label: "//GITHUB", icon: IconGithub, external: true },
];

const NAV_LONGEST_WORD_CH = NAV_LINKS.reduce((max, link) => {
  const longestWordInLabel = link.label
    .split(/\s+/)
    .reduce((wordMax, word) => Math.max(wordMax, word.length), 0);
  return Math.max(max, longestWordInLabel);
}, 0);

const NAV_ROLLOUT_EXTRA_CH = 3.25;
const NAV_LABEL_RIGHT_INSET_PX = NAV_UNIT_PX;
const NAV_ROLLOUT_WIDTH = `calc(${NAV_UNIT_PX}px + ${NAV_LABEL_RIGHT_INSET_PX}px + ${NAV_LONGEST_WORD_CH + NAV_ROLLOUT_EXTRA_CH}ch)`;


function isActivePath(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [rolloutPinned, setRolloutPinned] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Nav reveal pipeline (audit #13 restoration, 2026-04-22):
  // - Nav ships with `sf-nav-hidden` in its className (below) — initial hidden state.
  // - app/layout.tsx mounts <NavRevealMount targetSelector="..." /> which runs
  //   useNavReveal with a trigger ref. Hook creates a ScrollTrigger on that element
  //   and flips body[data-nav-visible] onEnter / onLeaveBack.
  // - CSS rule `body[data-nav-visible="true"] .sf-nav-hidden` (globals.css) overrides
  //   the hidden state back to visible once the trigger scrolls past.
  // Triggers: [data-entry-section] on /, [data-nav-reveal-trigger] on subpages.

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Main navigation"
        data-sf-nav=""
        className="sf-nav-hidden fixed origin-bottom-left z-[var(--sfx-z-nav)] transition-[filter] duration-75"
        style={{
          bottom: "var(--sf-frame-bottom-gap, 0px)",
          left: "var(--sf-frame-offset-x, 0px)",
          transform: "scale(var(--sf-nav-scale, 1))",
          padding: "24px",
        }}
      >
        <div className="flex flex-col items-start gap-[var(--sfx-nav-chrome-gap)]">
          {/* Floating cube stack. Morphs column↔row via body[data-nav-layout]. */}
          <div
            data-sf-nav-stack=""
            className="flex flex-col items-start gap-[var(--sfx-nav-chrome-gap)]"
          >
            <NavSignalGlyph
              pinned={rolloutPinned}
              onPinnedChange={setRolloutPinned}
              cubeIndex={0}
            />
            {NAV_LINKS.map((link, index) => (
              <NavCubeLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                ariaLabel={link.ariaLabel}
                external={link.external}
                isActive={isActivePath(link.href, pathname)}
                rolloutActive={rolloutPinned}
                rolloutWidth={NAV_ROLLOUT_WIDTH}
                isInventory={link.href === "/inventory"}
                isApi={link.href === "/reference"}
                isSystem={link.href === "/system"}
                isBuilds={link.href === "/builds"}
                isInit={link.href === "/init"}
                isGithub={link.href.startsWith("https://github.com")}
                cubeIndex={index + 1}
              />
            ))}
          </div>

          {/* Corner badge + utility controls cluster */}
          <div data-sf-nav-chrome="" className="flex items-center gap-[var(--sfx-nav-chrome-gap)]">
            <ColorCycleFrame className="hidden sm:inline-flex" style={{ marginTop: 0, overflow: "visible", verticalAlign: "baseline" }}>
              <Link
                href="/"
                aria-label="SF//UX homepage"
                className="flex h-8 items-center gap-[var(--sfx-space-1)] overflow-hidden bg-muted-foreground text-background pl-[var(--sfx-space-2)] pr-[var(--sfx-space-2)] text-[10px] font-bold uppercase tracking-[0.1em] no-underline"
              >
                <span className="inline-flex h-full items-center self-center leading-none text-primary text-[10px]">◉◉</span>
                <span className="inline-flex items-baseline gap-0">
                  SF<span className="text-primary text-[12px] leading-none">{"//"}</span>UX
                </span>
              </Link>
            </ColorCycleFrame>
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center justify-center border-2 border-muted-foreground bg-transparent text-muted-foreground transition-colors duration-[var(--sfx-duration-fast)] hover:text-primary hover:border-primary"
              style={{ width: 32, height: 32 }}
              aria-label="Open command palette (Cmd+K)"
            >
              <IconCommandGrid aria-hidden="true" className="w-4 h-4" />
            </button>
            <DarkModeToggle />
            <BorderlessToggle />
            <NavSignalToggle />
            <NavScrollToTop />
          </div>
        </div>

        <SlashFocusListener openPalette={() => setCommandOpen(true)} />
        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </nav>
    </>
  );
}
