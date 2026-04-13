"use client";

import { useState, memo, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/layout/command-palette";

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
  ariaLabel,
  external,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
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
    setExpanded(false);
    stopScramble();
    setDisplayText("");
  }, [stopScramble]);

  useEffect(() => () => stopScramble(), [stopScramble]);

  const cubeBaseClass =
    "group relative flex h-6 min-w-6 items-center overflow-hidden no-underline font-mono text-[var(--text-2xs)] font-bold uppercase tracking-[0.08em] transition-all duration-[var(--sfx-duration-slow)] ease-[var(--sfx-ease-default)] pointer-events-auto";
  const cubePaletteClass = isActive
    ? "bg-primary text-primary-foreground"
    : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground";

  return (
    <div
      className={`${cubeBaseClass} ${cubePaletteClass}`}
      style={{ width: expanded ? "140px" : "24px", cursor: "pointer" }}
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
        <span className={`pr-[var(--sfx-space-2)] whitespace-nowrap transition-opacity duration-[var(--sfx-duration-fast)] ${expanded ? "opacity-100" : "opacity-0"}`}>
          {displayText}
        </span>
      </Link>
    </div>
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
            {NAV_LINKS.map((link) => (
              <NavCubeLink
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                ariaLabel={link.ariaLabel}
                external={link.external}
                isActive={isActivePath(link.href, pathname)}
              />
            ))}
          </div>

          {/* Mobile nav trigger cube */}
          <div className="md:hidden">
            <button
              onClick={() => setOverlayOpen(true)}
              className="flex h-[var(--sfx-space-12)] w-[var(--sfx-space-12)] items-center justify-center bg-foreground text-background text-[var(--text-sm)] font-bold uppercase tracking-[0.12em] transition-colors duration-[var(--sfx-duration-fast)] hover:bg-primary hover:text-primary-foreground"
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
            <Link
              href="/"
              aria-label="SF//UX homepage"
              className="hidden sm:flex h-6 items-center gap-[var(--sfx-space-1)] bg-foreground dark:bg-[var(--sf-dark-surface)] text-background dark:text-foreground px-[var(--sfx-space-2)] text-[9px] font-bold uppercase tracking-[0.1em] no-underline"
            >
              <span className="text-primary text-[10px]">◉◉</span>
              SF//UX
            </Link>
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex h-6 w-6 items-center justify-center bg-foreground text-background font-mono text-[var(--text-2xs)] font-bold uppercase tracking-[0.08em] transition-colors duration-[var(--sfx-duration-fast)] hover:bg-primary hover:text-primary-foreground"
              aria-label="Open command palette (Cmd+K)"
            >
              K
            </button>
            <div className="origin-left scale-[0.7]">
              <BorderlessToggle />
            </div>
            <div className="origin-left scale-[0.6] -ml-[var(--sfx-space-2)]">
              <DarkModeToggle />
            </div>
          </div>
        </div>

        <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      </nav>
    </>
  );
}
