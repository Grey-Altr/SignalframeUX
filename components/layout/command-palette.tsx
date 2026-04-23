"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toggleTheme as sharedToggleTheme } from "@/lib/theme";
import { useLenisInstance } from "@/components/layout/lenis-provider";
import {
  SFCommand,
  SFCommandDialog,
  SFCommandInput,
  SFCommandList,
  SFCommandEmpty,
  SFCommandGroup,
  SFCommandItem,
  SFCommandSeparator,
  SFCommandShortcut,
} from "@/components/sf/sf-command";

const NAV_ITEMS = [
  { label: "HOME", href: "/", shortcut: "H" },
  { label: "INVENTORY", href: "/inventory", shortcut: "C" },
  { label: "API REFERENCE", href: "/reference", shortcut: "A" },
  { label: "SYSTEM", href: "/system", shortcut: "T" },
  { label: "BUILDS", href: "/builds", shortcut: "B" },
  { label: "GET STARTED", href: "/init", shortcut: "S" },
];

const EXTERNAL_ITEMS = [
  { label: "GITHUB", href: "https://github.com/signalframeux" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const lenis = useLenisInstance();

  const openRef = useRef(open);
  useEffect(() => { openRef.current = open; }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!openRef.current);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange]);

  const navigate = useCallback(
    (href: string) => {
      onOpenChange(false);
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener");
      } else {
        router.push(href);
      }
    },
    [router, onOpenChange]
  );

  const scrollToTop = useCallback(() => {
    onOpenChange(false);
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [onOpenChange, lenis]);

  // R-64-i: frame navigation via synthetic keyboard events. Dispatched to
  // window, handled by useFrameNavigation's keydown listener. setTimeout 0
  // defers until after the dialog close animation starts so focus return
  // and event dispatch don't race.
  const dispatchFrameKey = useCallback(
    (code: string, shiftKey = false) => {
      onOpenChange(false);
      setTimeout(() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", { code, shiftKey, bubbles: true }),
        );
      }, 0);
    },
    [onOpenChange],
  );
  const nextFrame = useCallback(() => dispatchFrameKey("Space"), [dispatchFrameKey]);
  const prevFrame = useCallback(() => dispatchFrameKey("Space", true), [dispatchFrameKey]);
  const firstFrame = useCallback(() => dispatchFrameKey("Home"), [dispatchFrameKey]);
  const lastFrame = useCallback(() => dispatchFrameKey("End"), [dispatchFrameKey]);

  const toggleTheme = useCallback(() => {
    onOpenChange(false);
    const isDark = document.documentElement.classList.contains("dark");
    sharedToggleTheme(isDark);
  }, [onOpenChange]);

  return (
    <SFCommandDialog open={open} onOpenChange={onOpenChange}>
      <SFCommand>
        <SFCommandInput placeholder="SEARCH COMMANDS..." />
        <SFCommandList>
          <SFCommandEmpty>NO RESULTS FOUND.</SFCommandEmpty>

          <SFCommandGroup heading="Navigation">
            {NAV_ITEMS.map((item) => (
              <SFCommandItem
                key={item.href}
                onSelect={() => navigate(item.href)}
              >
                <span className="text-primary mr-2">→</span>
                {item.label}
                <SFCommandShortcut>{item.shortcut}</SFCommandShortcut>
              </SFCommandItem>
            ))}
          </SFCommandGroup>

          <SFCommandSeparator />

          <SFCommandGroup heading="External">
            {EXTERNAL_ITEMS.map((item) => (
              <SFCommandItem
                key={item.href}
                onSelect={() => navigate(item.href)}
              >
                <span className="text-primary mr-2">↗</span>
                {item.label}
              </SFCommandItem>
            ))}
          </SFCommandGroup>

          <SFCommandSeparator />

          <SFCommandGroup heading="Frame">
            <SFCommandItem onSelect={nextFrame}>
              <span className="text-primary mr-2">▼</span>
              NEXT FRAME
              <SFCommandShortcut>SPACE</SFCommandShortcut>
            </SFCommandItem>
            <SFCommandItem onSelect={prevFrame}>
              <span className="text-primary mr-2">▲</span>
              PREVIOUS FRAME
              <SFCommandShortcut>⇧ SPACE</SFCommandShortcut>
            </SFCommandItem>
            <SFCommandItem onSelect={firstFrame}>
              <span className="text-primary mr-2">⇤</span>
              FIRST FRAME
              <SFCommandShortcut>HOME</SFCommandShortcut>
            </SFCommandItem>
            <SFCommandItem onSelect={lastFrame}>
              <span className="text-primary mr-2">⇥</span>
              LAST FRAME
              <SFCommandShortcut>END</SFCommandShortcut>
            </SFCommandItem>
          </SFCommandGroup>

          <SFCommandSeparator />

          <SFCommandGroup heading="Actions">
            <SFCommandItem onSelect={toggleTheme}>
              <span className="text-primary mr-2">◐</span>
              TOGGLE THEME
              <SFCommandShortcut>THEME</SFCommandShortcut>
            </SFCommandItem>
            <SFCommandItem onSelect={scrollToTop}>
              <span className="text-primary mr-2">↑</span>
              SCROLL TO TOP
            </SFCommandItem>
          </SFCommandGroup>
        </SFCommandList>
      </SFCommand>
    </SFCommandDialog>
  );
}
