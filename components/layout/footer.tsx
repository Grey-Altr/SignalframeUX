"use client";

import { useEffect, useRef } from "react";
import { SFSeparator } from "@/components/sf/sf-separator";

/* ── Circuit trace junction points ── */
const JUNCTIONS = [
  [0, 20],
  [80, 20],
  [80, 10],
  [160, 10],
  [160, 30],
  [240, 30],
  [240, 10],
  [320, 10],
  [320, 20],
  [400, 20],
  [400, 5],
  [480, 5],
  [480, 35],
  [560, 35],
  [560, 20],
  [640, 20],
  [640, 10],
  [720, 10],
  [720, 20],
  [800, 20],
] as const;

const MAIN_PATH =
  "M 0 20 H 80 L 80 10 H 160 L 160 30 H 240 L 240 10 H 320 L 320 20 H 400 L 400 5 H 480 L 480 35 H 560 L 560 20 H 640 L 640 10 H 720 L 720 20 H 800";

/* Secondary paths — shorter decorative branches */
const SECONDARY_PATHS = [
  "M 80 10 V 2",
  "M 240 10 V 2",
  "M 400 5 V 0",
  "M 560 20 V 38",
  "M 720 20 V 38",
  "M 160 30 V 38",
  "M 320 20 H 340",
  "M 480 35 H 500",
];

function CircuitSVG() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            svg.classList.add("sf-circuit--visible");
            observer.unobserve(svg);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      className="sf-circuit-svg w-full"
      viewBox="0 0 800 40"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: "40px", display: "block" }}
      aria-hidden="true"
    >
      {/* Secondary paths (gray) */}
      {SECONDARY_PATHS.map((d, i) => (
        <path
          key={`sec-${i}`}
          d={d}
          stroke="#555"
          strokeWidth="1"
          className="sf-circuit-path sf-circuit-path--secondary"
          style={{ animationDelay: `${0.6 + i * 0.08}s` }}
        />
      ))}

      {/* Main trace (magenta) */}
      <path
        d={MAIN_PATH}
        stroke="#FF0090"
        strokeWidth="1.5"
        className="sf-circuit-path sf-circuit-path--main"
      />

      {/* Junction dots */}
      {JUNCTIONS.map(([x, y], i) => (
        <circle
          key={`dot-${i}`}
          cx={x}
          cy={y}
          r="2"
          fill="#FF0090"
          className="sf-circuit-dot"
          style={{ animationDelay: `${0.3 + i * 0.05}s` }}
        />
      ))}
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t-[3px] border-foreground">
      {/* Circuit decoration */}
      <CircuitSVG />

      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <span
                className="sf-display text-2xl text-foreground"
                style={{ fontFamily: "var(--font-anton)" }}
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
      </div>
    </footer>
  );
}
