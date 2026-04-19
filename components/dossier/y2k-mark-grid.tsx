import type { ReactNode } from "react";

type MarkProps = { size?: number; color?: string };

function Hexagon({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <polygon points="30,4 54,18 54,42 30,56 6,42 6,18" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Recycle({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="2">
        <path d="M15 35 L22 22 L29 35 Z" />
        <path d="M45 35 L38 22 L31 35 Z" />
        <path d="M30 50 L23 42 L37 42 Z" />
      </g>
    </svg>
  );
}
function Asterisk({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <g stroke={color} strokeWidth="3" strokeLinecap="square">
        <line x1="30" y1="10" x2="30" y2="50" />
        <line x1="10" y1="30" x2="50" y2="30" />
        <line x1="16" y1="16" x2="44" y2="44" />
        <line x1="44" y1="16" x2="16" y2="44" />
      </g>
    </svg>
  );
}
function NestedCubes({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <rect x="10" y="10" width="40" height="40" fill="none" stroke={color} strokeWidth="2" />
      <rect x="20" y="20" width="20" height="20" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Peace({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <circle cx="30" cy="30" r="24" fill="none" stroke={color} strokeWidth="2" />
      <line x1="30" y1="6" x2="30" y2="54" stroke={color} strokeWidth="2" />
      <line x1="30" y1="30" x2="12" y2="48" stroke={color} strokeWidth="2" />
      <line x1="30" y1="30" x2="48" y2="48" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Target({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <circle cx="30" cy="30" r="24" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="30" cy="30" r="14" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="30" cy="30" r="5" fill={color} />
    </svg>
  );
}
function Triad({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <polygon points="30,8 52,50 8,50" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Orbit({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <circle cx="30" cy="30" r="6" fill={color} />
      <ellipse cx="30" cy="30" rx="22" ry="10" fill="none" stroke={color} strokeWidth="2" />
      <ellipse cx="30" cy="30" rx="10" ry="22" fill="none" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function Spiral({ size = 60, color = "currentColor" }: MarkProps) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} aria-hidden="true">
      <path d="M30 30 m 0,-4 a 4,4 0 1,1 -0.1,0 m 8,4 a 12,12 0 1,1 -0.1,0 m -12,-14 a 22,22 0 1,1 0.2,0" fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}
function Arrows(): ReactNode {
  return (
    <svg viewBox="0 0 60 60" width={60} height={60} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M10 30 L50 30" />
        <path d="M44 24 L50 30 L44 36" />
        <path d="M30 10 L30 50" />
        <path d="M24 44 L30 50 L36 44" />
      </g>
    </svg>
  );
}

const SHAPES = [Hexagon, Recycle, Asterisk, NestedCubes, Peace, Target, Triad, Orbit, Spiral, () => <Arrows />];

function pad(n: number) { return String(n).padStart(3, "0"); }

export function Y2KMarkGrid({ count = 60, litIndex = 42 }: { count?: number; litIndex?: number }) {
  return (
    <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-0 border-t border-l" style={{ borderColor: "oklch(0.15 0 0 / 0.4)" }}>
      {Array.from({ length: count }, (_, i) => {
        const Shape = SHAPES[i % SHAPES.length];
        const isLit = i + 1 === litIndex;
        return (
          <li
            key={i}
            data-plate="brando-mark"
            data-lit={isLit ? "true" : "false"}
            className="border-r border-b p-3 flex flex-col items-center justify-center aspect-square"
            style={{
              borderColor: "oklch(0.15 0 0 / 0.4)",
              color: isLit ? "oklch(0.65 0.3 350)" : "oklch(0.15 0 0)",
            }}
          >
            <Shape size={40} />
            <div
              className="text-[9px] uppercase tracking-[0.15em] mt-2"
              style={{ fontFamily: "var(--font-jetbrains), monospace", opacity: isLit ? 1 : 0.6 }}
            >
              SF//MRK-{pad(i + 1)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
