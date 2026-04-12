import Link from "next/link";
import { SFSeparator, CDSymbol } from "@/components/sf";
import { CopyButton } from "@/components/layout/copy-button";
import { BackToTop } from "@/components/layout/back-to-top";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-foreground">
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-8 md:gap-12 items-start">
            {/* Brand */}
            <div className="md:mt-1.5">
              <span
                className="sf-display text-2xl text-foreground"
              >
                SF<span className="text-primary">{"//"}</span>UX
              </span>
              <p className="mt-1 text-muted-foreground text-[var(--text-sm)] uppercase tracking-wider">
                Universal design system
              </p>
              <p className="mt-1 text-muted-foreground text-[var(--text-sm)] uppercase tracking-wider">
                By Grey Altaer
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-[var(--text-sm)] font-mono uppercase tracking-wider text-foreground mb-3 font-bold">
                DOCS
              </p>
              <ul className="space-y-0 text-[var(--text-sm)] font-mono uppercase tracking-wider text-muted-foreground">
                <li><Link href="/init" className="sf-link-draw hover:text-foreground py-2 inline-block">Getting Started</Link></li>
                <li><Link href="/inventory" className="sf-link-draw hover:text-foreground py-2 inline-block">Components</Link></li>
                <li><Link href="/system" className="sf-link-draw hover:text-foreground py-2 inline-block">Tokens</Link></li>
                <li><Link href="/reference" className="sf-link-draw hover:text-foreground py-2 inline-block">API Reference</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[var(--text-sm)] font-mono uppercase tracking-wider text-foreground mb-3 font-bold">
                RESOURCES
              </p>
              <ul className="space-y-0 text-[var(--text-sm)] font-mono uppercase tracking-wider text-muted-foreground">
                <li><a href="https://github.com/signalframeux" target="_blank" rel="noopener noreferrer" className="sf-link-draw hover:text-foreground py-2 inline-block">GitHub<span className="sr-only"> (opens in new tab)</span></a></li>
                <li><Link href="/inventory" className="sf-link-draw hover:text-foreground py-2 inline-block">Registry</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[var(--text-sm)] font-mono uppercase tracking-wider text-foreground mb-3 font-bold">
                INSTALL
              </p>
              <div className="bg-foreground dark:bg-[var(--sf-dark-surface)] text-background dark:text-foreground px-4 py-3 font-mono text-[var(--text-base)] border-2 border-foreground relative min-w-0 overflow-x-auto">
                <div className="flex justify-end mb-1">
                  <CopyButton />
                </div>
                <span className="text-[var(--sf-primary-on-dark)] select-all break-all">pnpm dlx shadcn@latest add</span>
                <br />
                <span className="select-all break-all">&quot;https://signalframeux.com/r/base.json&quot;</span>
              </div>
            </div>
          </div>

          <SFSeparator weight="thin" className="my-8" />

          <div className="flex items-center justify-between text-[var(--text-sm)] font-mono uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <CDSymbol name="hex" size={12} className="text-primary" />
              &copy; 2026 SIGNALFRAMEUX
            </span>
            <span className="flex items-center gap-2">
              SIGNAL
              <CDSymbol name="signal-wave" size={14} className="text-primary" />
              FRAME
            </span>
          </div>

          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
