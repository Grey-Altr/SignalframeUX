import Link from "next/link";
import type { ReactNode } from "react";

export type SchematicNode = {
  slug: string;
  code: string;
  label: string;
  kind: "transformer" | "relay" | "cathode" | "plate";
};

const NODE_GLYPH: Record<SchematicNode["kind"], ReactNode> = {
  transformer: (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <circle cx="20" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="40" cy="30" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0"  y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="50" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  relay: (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <rect x="10" y="20" width="40" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0"  y1="30" x2="10" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="50" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="20" x2="30" y2="10" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  cathode: (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <line x1="0"  y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="25" y1="20" x2="25" y2="40" stroke="currentColor" strokeWidth="2" />
      <polygon points="35,20 35,40 25,30" fill="currentColor" />
      <line x1="35" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  plate: (
    <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
      <rect x="15" y="15" width="30" height="30" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1.5" />
      <line x1="0"  y1="30" x2="15" y2="30" stroke="currentColor" strokeWidth="1.5" />
      <line x1="45" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

export function BuildSchematic({ nodes }: { nodes: SchematicNode[] }) {
  return (
    <div
      role="img"
      aria-label="Build schematic — six conceptual SFUX builds wired as a circuit diagram"
      className="relative w-full"
      style={{
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        color: "oklch(0.35 0.18 28)",
      }}
    >
      {/* Rail is the desktop compositional device. At narrow viewports it
          auto-scales too short for the 6 node cards to fit; hide it and let
          the grid flow naturally as a 2-column stack. */}
      <svg
        viewBox="0 0 1200 520"
        className="hidden md:block w-full h-auto"
        aria-hidden="true"
      >
        <g stroke="currentColor" strokeWidth="1" fill="none">
          <polyline points="40,120 1160,120" />
          <polyline points="40,400 1160,400" />
          <line x1="40"   y1="120" x2="40"   y2="400" />
          <line x1="1160" y1="120" x2="1160" y2="400" />
        </g>
      </svg>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 p-4 md:p-8 md:absolute md:inset-0 md:grid-rows-2 list-none">
        {nodes.map((n) => (
          <li
            key={n.slug}
            data-plate="diagrams2-node"
            className="flex items-center justify-center"
          >
            <Link
              href={`/builds/${n.slug}`}
              className="no-underline text-center group"
              style={{ color: "currentColor" }}
            >
              <div className="flex justify-center group-hover:scale-110 transition-transform">
                {NODE_GLYPH[n.kind]}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] mt-2 opacity-60">
                {n.code}
              </div>
              <div
                className="text-[14px] uppercase tracking-[0.02em] mt-1"
                style={{ fontFamily: "var(--font-ibm-plex-sans-condensed), sans-serif", fontWeight: 600 }}
              >
                {n.label}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
