"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const INSTALL_CMD = `pnpm dlx shadcn@latest add "https://signalframeux.com/r/base.json"`;

export function CopyButton() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(INSTALL_CMD).then(() => {
      setCopied(true);
      // Trigger VHS flash
      const btn = btnRef.current;
      if (btn) {
        btn.classList.add("sf-flash--active");
        btn.addEventListener("animationend", () => btn.classList.remove("sf-flash--active"), { once: true });
      }
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Clipboard API unavailable — silent fallback
    });
  }, []);

  return (
    <>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
      <button
        ref={btnRef}
        type="button"
        onClick={handleCopy}
        data-copied={copied || undefined}
        aria-label={copied ? "Copied to clipboard" : "Copy install command"}
        className="sf-copy sf-pressable absolute -top-4 right-3 bg-primary text-foreground px-3 py-2 text-[var(--text-2xs)] font-bold uppercase tracking-[0.2em] cursor-pointer border-none hover:brightness-110 transition-all duration-150"
      >
        <span className="sf-copy-label">{copied ? "" : "COPY"}</span>
        <span className="sf-copy-label--done">{copied ? "COPIED" : ""}</span>
      </button>
    </>
  );
}
