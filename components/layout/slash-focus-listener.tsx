"use client";

import { useEffect } from "react";

/**
 * §14.18 + R-64-d compliant: `/` opens the command palette. Guarded against
 * input-focus contexts so typing `/` inside a form/search/content-editable
 * element does not hijack the character.
 */
export function SlashFocusListener({ openPalette }: { openPalette: () => void }) {
  useEffect(() => {
    function isEditableTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      const role = target.getAttribute("role");
      if (role === "textbox" || role === "combobox") return true;
      return false;
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
      openPalette();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openPalette]);

  return null;
}
