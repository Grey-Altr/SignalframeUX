"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SFDialog,
  SFDialogContent,
  SFDialogHeader,
  SFDialogTitle,
  SFDialogDescription,
} from "@/components/sf/sf-dialog";

/**
 * R-64-i · discoverability cheatsheet. Opens on `?` keypress (when focus
 * is not in an editable surface). Lists the full keymap in FRAME
 * vocabulary. Uses SFDialog for focus-trap + focus-return-to-trigger on
 * dismiss (R-64-j).
 */

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

const KEYMAP: Array<{ keys: string; label: string }> = [
  { keys: "Space", label: "Next frame" },
  { keys: "⇧ Space", label: "Previous frame" },
  { keys: "Home", label: "First frame" },
  { keys: "End", label: "Last frame" },
  { keys: "↓ PgDn", label: "Next frame (alt)" },
  { keys: "↑ PgUp", label: "Previous frame (alt)" },
  { keys: "⌘ K", label: "Command palette" },
  { keys: "?", label: "Toggle this cheatsheet" },
  { keys: "Esc", label: "Close overlays" },
];

export function CheatsheetOverlay(): React.JSX.Element {
  const [open, setOpen] = useState(false);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isInEditable(e.target)) return;
    if (e.key !== "?") return;
    e.preventDefault();
    setOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <SFDialog open={open} onOpenChange={setOpen}>
      <SFDialogContent className="sm:max-w-[480px] font-mono">
        <SFDialogHeader>
          <SFDialogTitle className="uppercase tracking-wider">
            {"// KEYMAP"}
          </SFDialogTitle>
          <SFDialogDescription className="uppercase tracking-wider text-foreground/60">
            Keyboard shortcuts for navigation
          </SFDialogDescription>
        </SFDialogHeader>
        <ul className="mt-[var(--sfx-space-4)] flex flex-col gap-[var(--sfx-space-2)]">
          {KEYMAP.map((row) => (
            <li
              key={row.keys}
              className="flex items-baseline justify-between gap-[var(--sfx-space-6)] text-[var(--sfx-text-sm)] uppercase tracking-wider"
            >
              <span className="text-foreground/70">{row.label}</span>
              <span className="text-foreground">{row.keys}</span>
            </li>
          ))}
        </ul>
      </SFDialogContent>
    </SFDialog>
  );
}
