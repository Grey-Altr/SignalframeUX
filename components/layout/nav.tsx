"use client";

import { useState, memo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/layout/command-palette";
import { ColorCycleFrame } from "@/components/animation/color-cycle-frame";

const IconInventory = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 3h8v8H3zM13 3h8v4h-8zM13 9h8v12h-8zM3 13h8v8H3z" />
  </svg>
);

const IconApi = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M3 11h12v2H3zM15 7h6v10h-6zM7 5h4v14H7z" />
  </svg>
);

const IconSystem = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M3 3h18v18H3V3zm4 4v10h10V7H7zm2 2h6v6H9V9z" />
  </svg>
);

const IconBuilds = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 5h18v4H3zM3 11h10v8H3zM15 11h6v8h-6z" />
  </svg>
);

const IconInit = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 4h6v16H4zm8 4h4v8h-4zm6 2h2v4h-2z" />
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
import { NavOverlay } from "@/components/layout/nav-overlay";
import { DarkModeToggle } from "@/components/layout/dark-mode-toggle";
import { BorderlessToggle } from "@/components/layout/borderless-toggle";

const SCRAMBLE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_/[]{}";

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
  ariaLabel,
  external,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  rolloutActive: boolean;
  ariaLabel?: string;
  external?: boolean;
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

  const cubeBaseClass =
    "group relative flex h-6 min-w-6 items-center overflow-hidden no-underline font-mono text-[var(--text-2xs)] font-bold uppercase tracking-[0.08em] transition-all duration-[var(--sfx-duration-slow)] ease-in-out pointer-events-auto";
  const cubePaletteClass = isActive
    ? "bg-[var(--sfx-yellow)] text-black ring-1 ring-black"
    : "bg-[var(--sfx-yellow)] text-black hover:bg-[var(--sfx-yellow)]";

  return (
    <div
      className={`${cubeBaseClass} ${cubePaletteClass}`}
      style={{ width: isRolledOut ? "140px" : "24px", cursor: "pointer" }}
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
        <span className="flex w-6 shrink-0 items-center justify-center text-[var(--text-2xs)]">
          <Icon className="w-[14px] h-[14px] transition-transform duration-[var(--sfx-duration-fast)] group-hover:scale-110 group-hover:rotate-90" />
        </span>
        <span className={`pr-[var(--sfx-space-2)] whitespace-nowrap transition-opacity duration-[var(--sfx-duration-fast)] ${isRolledOut ? "opacity-100" : "opacity-0"}`}>
          {displayText}
        </span>
      </Link>
    </div>
  );
});

/** Base design in 14×14 space; expanded state scales vb up so border + spacing grow together. */
const GLYPH_VB_BASE = 14;
const GLYPH_VB_IDLE = 14;
/** Taller box so more rows + scaled modules fit without overlap. */
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
}: {
  pinned: boolean;
  onPinnedChange: (next: boolean) => void;
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
  const rowCount = Math.min(5, Math.max(3, Math.round(3 + (2 * (vb - GLYPH_VB_IDLE)) / vbSpan)));
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
    <button
      type="button"
      aria-label="Toggle signal glyph orientation"
      aria-pressed={pinned}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={handleClick}
      className={`group relative flex h-6 w-6 items-center justify-center bg-transparent transition-colors duration-[var(--sfx-duration-glacial)] ease-in-out ${
        pinned || isFlashing ? "text-[var(--sfx-yellow)]" : "text-black"
      }`}
    >
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
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
  );
});

const NAV_LINKS: Array<{ href: string; label: string; ariaLabel?: string; external?: boolean; icon: React.ElementType }> = [
  { href: "/inventory", label: "INVENTORY", icon: IconInventory },
  { href: "/reference", label: "API", icon: IconApi },
  { href: "/system", label: "SYSTEM", icon: IconSystem },
  { href: "/builds", label: "BUILDS", icon: IconBuilds },
  { href: "/init", label: "GET STARTED", icon: IconInit },
  { href: "https://github.com/signalframeux", label: "GITHUB", icon: IconGithub, external: true },
];


function isActivePath(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [rolloutPinned, setRolloutPinned] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Nav reveal is owned by per-page <NavRevealMount /> islands (Phase 34 SP-05).
  // The Nav root keeps its initial `sf-nav-hidden` class; CSS in globals.css flips
  // visibility based on body[data-nav-visible="true"] which the hook sets.

  return (
    <>
      <nav 
        ref={navRef} 
        aria-label="Main navigation" 
        className="fixed bottom-[clamp(16px,2vw,24px)] left-[clamp(16px,2vw,24px)] z-[var(--sfx-z-nav)] transition-[filter] duration-75"
        
      >
        <div className="flex flex-col items-start gap-[var(--sfx-space-1)]">
          {/* Floating cube stack (desktop): I / A / S / G / G */}
          <div className="hidden md:flex flex-col items-start gap-[var(--sfx-space-1)]">
            <NavSignalGlyph pinned={rolloutPinned} onPinnedChange={setRolloutPinned} />
            {NAV_LINKS.map((link) => (
              <NavCubeLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                ariaLabel={link.ariaLabel}
                external={link.external}
                isActive={isActivePath(link.href, pathname)}
                rolloutActive={rolloutPinned}
              />
            ))}
          </div>

          {/* Mobile nav trigger cube */}
          <div className="md:hidden">
            <button
              onClick={() => setOverlayOpen(true)}
              className="flex h-[var(--sfx-space-12)] w-[var(--sfx-space-12)] items-center justify-center bg-muted-foreground text-background text-[var(--text-sm)] font-bold uppercase tracking-[0.12em] transition-colors duration-[var(--sfx-duration-fast)] hover:bg-primary hover:text-primary-foreground"
              aria-label="Open navigation menu"
              aria-expanded={overlayOpen}
            >
              M
            </button>
          </div>

          <NavOverlay
            open={overlayOpen}
            onClose={() => setOverlayOpen(false)}
            links={NAV_LINKS}
          />

          {/* Corner badge + utility controls cluster */}
          <div className="mt-[var(--sfx-space-1)] flex items-center gap-[var(--sfx-space-1)]">
            <ColorCycleFrame style={{ marginTop: 0, overflow: "visible", verticalAlign: "baseline" }}>
              <Link
                href="/"
                aria-label="SF//UX homepage"
                className="hidden sm:flex h-6 items-center gap-[var(--sfx-space-1)] bg-muted-foreground text-background pl-[var(--sfx-space-2)] pr-[var(--sfx-space-1)] text-[9px] font-bold uppercase tracking-[0.1em] no-underline"
              >
                <span className="text-primary text-[10px]">◉◉</span>
                SF<span className="text-primary">{"//"}</span>UX
              </Link>
            </ColorCycleFrame>
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center justify-center border-2 border-muted-foreground bg-transparent text-muted-foreground transition-colors duration-[var(--sfx-duration-fast)] hover:text-primary hover:border-primary"
              style={{ width: 32, height: 24 }}
              aria-label="Open command palette (Cmd+K)"
            >
              <IconCommandGrid aria-hidden="true" className="w-[14px] h-[14px]" />
            </button>
            <BorderlessToggle />
            <DarkModeToggle />
          </div>
        </div>

        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </nav>
    </>
  );
}
