import { SFSeparator } from "@/components/sf/sf-separator";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-foreground">
      <div className="px-6 py-12 origin-top" style={{ transform: "scale(1.08)", transformOrigin: "top center" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Brand */}
            <div className="md:mt-1.5">
              <span
                className="sf-display text-[30px] text-foreground"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                SF<span className="text-primary">//</span>UX
              </span>
              <p className="mt-1 text-muted-foreground text-[15px] uppercase tracking-wider">
                Universal design system
              </p>
              <p className="mt-1 text-muted-foreground text-[16px] uppercase tracking-wider">
                By Grey Alt+R
              </p>
            </div>

            {/* Links */}
            <div className="mx-auto">
              <h3 className="text-[15px] font-mono uppercase tracking-wider text-foreground mb-3">
                DOCS
              </h3>
              <ul className="space-y-2 text-[15px] font-mono uppercase tracking-wider text-muted-foreground">
                <li><a href="/start" className="sf-link-draw hover:text-foreground">Getting Started</a></li>
                <li><a href="/components" className="sf-link-draw hover:text-foreground">Components</a></li>
                <li><a href="/tokens" className="sf-link-draw hover:text-foreground">Tokens</a></li>
                <li><a href="/api" className="sf-link-draw hover:text-foreground">API Reference</a></li>
              </ul>
            </div>

            <div className="mx-auto">
              <h3 className="text-[15px] font-mono uppercase tracking-wider text-foreground mb-3">
                RESOURCES
              </h3>
              <ul className="space-y-2 text-[15px] font-mono uppercase tracking-wider text-muted-foreground">
                <li><a href="https://github.com" className="sf-link-draw hover:text-foreground">GitHub</a></li>
                <li><a href="/components" className="sf-link-draw hover:text-foreground">Registry</a></li>
                <li><a href="/tokens" className="sf-link-draw hover:text-foreground">Figma</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-[15px] font-mono uppercase tracking-wider text-foreground mb-3">
                INSTALL
              </h3>
              <div className="bg-foreground dark:bg-[oklch(0.2_0_0)] text-background dark:text-foreground px-3 py-2 font-mono text-[15px]">
                pnpm dlx shadcn@latest add
                <br />
                &quot;signalframeux.com/r/base.json&quot;
              </div>
            </div>
          </div>

          <SFSeparator weight="thin" className="my-8" />

          <div className="flex items-center justify-between text-[15px] font-mono uppercase tracking-wider text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} SIGNALFRAMEUX</span>
            <span>SIGNAL // FRAME</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
