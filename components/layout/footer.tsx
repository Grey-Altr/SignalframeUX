import { SFSeparator } from "@/components/sf/sf-separator";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-foreground px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <span
              className="sf-display text-2xl text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SF<span className="text-primary">//</span>UX
            </span>
            <p className="mt-2 text-muted-foreground text-xs uppercase tracking-wider">
              Universal design system
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-foreground mb-3">
              DOCS
            </h3>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <li><a href="/start" className="sf-link-draw hover:text-foreground">Getting Started</a></li>
              <li><a href="/components" className="sf-link-draw hover:text-foreground">Components</a></li>
              <li><a href="/tokens" className="sf-link-draw hover:text-foreground">Tokens</a></li>
              <li><a href="/api" className="sf-link-draw hover:text-foreground">API Reference</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-foreground mb-3">
              RESOURCES
            </h3>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <li><a href="https://github.com" className="sf-link-draw hover:text-foreground">GitHub</a></li>
              <li><a href="/components" className="sf-link-draw hover:text-foreground">Registry</a></li>
              <li><a href="/tokens" className="sf-link-draw hover:text-foreground">Figma</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-foreground mb-3">
              INSTALL
            </h3>
            <div className="bg-foreground text-background px-3 py-2 font-mono text-xs">
              pnpm dlx shadcn@latest add
              <br />
              &quot;signalframeux.com/r/base.json&quot;
            </div>
          </div>
        </div>

        <SFSeparator weight="thin" className="my-8" />

        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} SIGNALFRAMEUX</span>
          <span>SIGNAL // FIELD</span>
        </div>
      </div>
    </footer>
  );
}
