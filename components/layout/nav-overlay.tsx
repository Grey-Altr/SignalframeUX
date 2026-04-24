"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavOverlayProps {
  open: boolean;
  onClose: () => void;
  links: Array<{ href: string; label: string; external?: boolean }>;
}

/**
 * Full-screen overlay navigation — DU/TDR style.
 * Black overlay, Anton display type at 48–72px, staggered entry.
 * Clip-path reveal from bottom, items slide up individually.
 */
export function NavOverlay({ open, onClose, links }: NavOverlayProps) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Focus trap + escape key
  useEffect(() => {
    if (!open) return;

    // Store the element that opened the overlay for focus restoration
    triggerRef.current = document.activeElement as HTMLElement;

    // Focus first link after animation
    const timer = setTimeout(() => firstLinkRef.current?.focus(), 400);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
      // Simple focus trap within overlay
      if (e.key === "Tab") {
        const overlay = overlayRef.current;
        if (!overlay) return;
        const focusable = overlay.querySelectorAll<HTMLElement>("a, button");
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      // Restore focus
      triggerRef.current?.focus();
    };
  }, [open, onClose]);

  // Close on route change
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = useCallback(
    (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href),
    [pathname]
  );

  const renderNavLabel = useCallback((label: string) => {
    if (!label.startsWith("//")) return label;
    return (
      <>
        <span className="mr-[0.22em] inline-block tracking-[-0.28em]">{"//"}</span>
        {label.slice(2)}
      </>
    );
  }, []);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-[var(--z-overlay)] bg-foreground dark:bg-[var(--sfx-darkest-surface)]"
      style={{
        clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        transition: "clip-path 0.4s var(--sfx-ease-default)",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close navigation menu"
        className="absolute top-[clamp(12px,calc(3*var(--sf-vw)),24px)] right-[clamp(16px,calc(4*var(--sf-vw)),32px)] text-background dark:text-foreground font-mono text-2xl leading-none p-[var(--sfx-space-2)] hover:text-primary transition-colors"
      >
        ✕
      </button>

      {/* Nav items */}
      <div className="flex flex-col justify-center h-full px-[clamp(24px,calc(6*var(--sf-vw)),64px)] gap-[var(--sfx-space-2)]">
        {links.map((link, i) => (
          <Link
            key={link.href}
            ref={i === 0 ? firstLinkRef : undefined}
            href={link.href}
            onClick={onClose}
            aria-current={isActive(link.href) ? "page" : undefined}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`sf-display no-underline block leading-[1.1] transition-all ${
              isActive(link.href)
                ? "text-primary"
                : "text-background dark:text-foreground hover:text-primary"
            }`}
            style={{
              fontSize: "clamp(48px, calc(10*var(--sf-vw)), 72px)",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(30px)",
              transition: `opacity 0.4s ease ${0.15 + i * 0.06}s, transform 0.4s ease ${0.15 + i * 0.06}s, color 0.2s ease`,
            }}
          >
            {renderNavLabel(link.label)}
          </Link>
        ))}
      </div>

      {/* Bottom branding */}
      <div
        className="absolute bottom-[clamp(16px,calc(4*var(--sf-vw)),32px)] left-[clamp(24px,calc(6*var(--sf-vw)),64px)] text-[var(--text-xs)] uppercase tracking-[0.2em] text-background/40 dark:text-foreground/40"
        style={{
          opacity: open ? 1 : 0,
          transition: `opacity 0.4s ease 0.5s`,
        }}
      >
        SIGNALFRAME//UX — DETERMINISTIC INTERFACE
      </div>
    </div>
  );
}
