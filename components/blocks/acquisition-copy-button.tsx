"use client";

/**
 * AcquisitionCopyButton — interactive copy trigger for the CLI init command.
 *
 * Isolated client component so AcquisitionSection stays a Server Component.
 * No button element — uses a span with role="button" to avoid CTA energy.
 * data-copy-trigger attribute required by Phase 33 AQ-01 Playwright test.
 *
 * @module components/blocks/acquisition-copy-button
 */

import { useState, useCallback } from "react";

interface AcquisitionCopyButtonProps {
  command: string;
}

export function AcquisitionCopyButton({ command }: AcquisitionCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Silent fail — clipboard may be unavailable (e.g. non-HTTPS dev)
    }
  }, [command]);

  return (
    <span
      data-copy-trigger
      role="button"
      tabIndex={0}
      aria-label={`Copy: ${command}`}
      onClick={handleCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCopy();
        }
      }}
      className="font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-[var(--sfx-duration-instant)] select-none"
    >
      {copied ? "[COPIED]" : "[COPY]"}
    </span>
  );
}
