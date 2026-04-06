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
} from "@/components/sf";

const NAV_ITEMS = [
  { label: "HOME", href: "/", shortcut: "H" },
  { label: "COMPONENTS", href: "/components", shortcut: "C" },
  { label: "API REFERENCE", href: "/reference", shortcut: "A" },
  { label: "TOKENS", href: "/tokens", shortcut: "T" },
  { label: "GET STARTED", href: "/start", shortcut: "S" },
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
