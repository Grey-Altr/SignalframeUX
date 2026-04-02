"use client";

import { useState } from "react";

const INSTALL_CMD = `pnpm dlx shadcn@latest add "https://signalframeux.com/r/base.json"`;

export function CopyButton() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy install command"
      className="absolute -top-2.5 right-3 bg-primary text-primary-foreground px-2 py-0.5 text-[var(--text-2xs)] font-bold uppercase tracking-[0.2em] cursor-pointer border-none hover:brightness-110 transition-all duration-150"
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}
