"use client";

import { useState } from "react";
import Link from "next/link";
import { SFSeparator } from "@/components/sf/sf-separator";

const INSTALL_CMD = `pnpm dlx shadcn@latest add "https://signalframeux.com/r/base.json"`;

export function Footer() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(INSTALL_CMD).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <footer className="border-t-[3px] border-foreground">
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-8 md:gap-12 items-start">
            {/* Brand */}
            <div className="md:mt-1.5">
              <span
                className="sf-display text-[30px] text-foreground"
              >
                SF<span className="text-primary">//</span>UX
              </span>
              <p className="mt-1 text-muted-foreground text-[11px] uppercase tracking-wider">
                Universal design system
              </p>
              <p className="mt-1 text-muted-foreground text-[11px] uppercase tracking-wider">
                By Grey Altaer
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-foreground mb-3">
                DOCS
              </h3>
              <ul className="space-y-0 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <li><Link href="/start" className="sf-link-draw hover:text-foreground py-2 inline-block">Getting Started</Link></li>
                <li><Link href="/components" className="sf-link-draw hover:text-foreground py-2 inline-block">Components</Link></li>
                <li><Link href="/tokens" className="sf-link-draw hover:text-foreground py-2 inline-block">Tokens</Link></li>
                <li><Link href="/reference" className="sf-link-draw hover:text-foreground py-2 inline-block">API Reference</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-foreground mb-3">
                RESOURCES
              </h3>
              <ul className="space-y-0 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <li><a href="https://github.com/signalframeux" target="_blank" rel="noopener noreferrer" className="sf-link-draw hover:text-foreground py-2 inline-block">GitHub <span className="text-[9px] text-muted-foreground">(opens in new tab)</span></a></li>
                <li><Link href="/components" className="sf-link-draw hover:text-foreground py-2 inline-block">Registry</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-[11px] font-mono uppercase tracking-wider text-foreground mb-3">
                INSTALL
              </h3>
              <div className="bg-foreground dark:bg-[var(--sf-dark-surface)] text-background dark:text-foreground px-4 py-3 font-mono text-[13px] border-2 border-foreground relative">
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy install command"
                  className="absolute -top-2.5 right-3 bg-primary text-primary-foreground px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] cursor-pointer border-none hover:brightness-110 transition-all duration-150"
                >
                  {copied ? "COPIED" : "COPY"}
                </button>
                <span className="text-primary select-all">pnpm dlx shadcn@latest add</span>
                <br />
                <span className="select-all">&quot;https://signalframeux.com/r/base.json&quot;</span>
              </div>
            </div>
          </div>

          <SFSeparator weight="thin" className="my-8" />

          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} SIGNALFRAMEUX</span>
            <span>SIGNAL // FRAME</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
