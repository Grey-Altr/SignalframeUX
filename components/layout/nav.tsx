"use client";

import { useState, memo, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CommandPalette } from "@/components/layout/command-palette";
import { NavOverlay } from "@/components/layout/nav-overlay";
import { Magnetic } from "@/components/animation/magnetic";
import { useScrambleText } from "@/hooks/use-scramble-text";
import { LiveClock } from "@/components/layout/live-clock";
import { DarkModeToggle } from "@/components/layout/dark-mode-toggle";
import { LogoMark } from "@/components/layout/logo-mark";

const NAV_LINK_ANIM = {
  baseDelay: 300,
  stagger: 120,
  duration: 500,
} as const;

const NavLink = memo(function NavLink({ href, label, delay, isActive, ariaLabel, external }: { href: string; label: string; delay: number; isActive: boolean; ariaLabel?: string; external?: boolean }) {
  const text = useScrambleText(label, delay, NAV_LINK_ANIM.duration);
  const linkProps = external ? { target: "_blank" as const, rel: "noopener noreferrer" } : {};
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fromLeft = e.clientX < rect.left + rect.width / 2;
    const underline = e.currentTarget.querySelector(".nav-hover-underline") as HTMLElement;
    if (underline) {
      underline.dataset.dir = fromLeft ? "left" : "right";
    }
  }, []);

  return (
    <Magnetic radius={50} strength={0.12} maxDisplacement={6}>
      <Link
        ref={linkRef}
        href={href}
        data-anim="nav-link"
        aria-label={ariaLabel ?? label}
        aria-current={isActive ? "page" : undefined}
        className={`nav-hover-link relative no-underline mr-[clamp(20px,3.5vw,48px)] inline-block transition-colors duration-300 hover:text-primary ${isActive ? "text-primary" : "text-foreground"}`}
        onMouseEnter={handleMouseEnter}
        {...linkProps}
      >
        {text}
        <span className="nav-hover-underline" />
      </Link>
    </Magnetic>
  );
});

const NAV_LINKS: Array<{ href: string; label: string; ariaLabel?: string; external?: boolean }> = [
  { href: "/components", label: "COMPONENTS" },
  { href: "/reference", label: "API" },
  { href: "/tokens", label: "TOKENS" },
  { href: "/start", label: "START", ariaLabel: "Get started with SignalframeUX" },
  { href: "https://github.com/signalframeux", label: "GITHUB", external: true },
];


function isActivePath(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <nav aria-label="Main navigation" className="fixed top-0 left-0 right-0 z-[var(--z-nav)] bg-background border-b-[3px] border-foreground sf-nav-roll-up">
      <div className="flex items-center px-[clamp(8px,1.2vw,16px)] py-[clamp(2px,0.5vw,4px)] text-[clamp(10px,1.3vw,15px)] font-bold uppercase tracking-[0.15em]">
        {/* Logo: SF//UX */}
        <LogoMark />

        {/* Nav links */}
        <div className="hidden md:flex items-center shrink-0 -ml-[clamp(12px,2vw,24px)]">
          {NAV_LINKS.map((link, i) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              ariaLabel={link.ariaLabel}
              external={link.external}
              delay={NAV_LINK_ANIM.baseDelay + i * NAV_LINK_ANIM.stagger}
              isActive={isActivePath(link.href, pathname)}
            />
          ))}
        </div>

        {/* Mobile nav — full-screen overlay */}
        <div className="md:hidden ml-2">
          <button
            onClick={() => setOverlayOpen(true)}
            className="border-2 border-foreground px-2.5 py-1.5 text-[var(--text-sm)] uppercase tracking-wider font-bold"
            aria-label="Open navigation menu"
            aria-expanded={overlayOpen}
          >
            MENU
          </button>
        </div>

        <NavOverlay
          open={overlayOpen}
          onClose={() => setOverlayOpen(false)}
          links={NAV_LINKS}
        />

        {/* Right side: command palette trigger + dark mode toggle + clock */}
        <div className="flex items-center gap-[clamp(8px,1.5vw,24px)] ml-auto">
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden sm:flex items-center gap-1.5 border-2 border-foreground px-2 py-1 text-[var(--text-xs)] font-bold uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-200"
            aria-label="Open command palette (Cmd+K)"
          >
            <span className="text-primary">⌘</span>K
          </button>
          <DarkModeToggle />
          <div className="hidden sm:block">
            <LiveClock />
          </div>
        </div>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </nav>
  );
}
