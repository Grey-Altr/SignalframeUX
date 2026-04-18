"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface VaultBiocircuitProps {
  cellCount?: number;
  synapseCount?: number;
  seed?: number;
  accentRatio?: number;
  className?: string;
}

/*
 * Vanzyst MULTICOLORED-register biocircuit: procedural field of small
 * cellular-cybernetic hybrid shapes connected by a thin synapse web.
 * Pure SVG, deterministic per-seed, rendered once per mount.
 *
 * Each cell is one of 8 hybrid glyphs (organic disc with cybernetic
 * notch, cross-through circle, square with antennae, etc.). Synapses
 * are straight line segments between near-neighbor cells — not a
 * proper graph, just enough density to read as circuit-tissue.
 */

// Small seeded RNG so the pattern is deterministic across hydration
// (server + client produce the same SVG, no hydration mismatch).
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t |= 0;
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Cell = {
  x: number;
  y: number;
  size: number;
  glyph: number;
  accent: boolean;
  id: string;
};

function generate(
  seed: number,
  cellCount: number,
  synapseCount: number,
  accentRatio: number,
  w = 1200,
  h = 800
): { cells: Cell[]; synapses: [number, number][] } {
  const rnd = mulberry32(seed);
  const cells: Cell[] = [];
  // Poisson-ish placement: retry a few times to avoid overlap.
  for (let i = 0; i < cellCount; i++) {
    let x = 0,
      y = 0,
      ok = false;
    for (let t = 0; t < 25 && !ok; t++) {
      x = 40 + rnd() * (w - 80);
      y = 40 + rnd() * (h - 80);
      ok = cells.every(
        (c) => Math.hypot(c.x - x, c.y - y) > 55 + c.size + 16
      );
    }
    cells.push({
      x,
      y,
      size: 10 + rnd() * 18,
      glyph: Math.floor(rnd() * 8),
      accent: rnd() < accentRatio,
      id: `C-${String(i).padStart(3, "0")}`,
    });
  }
  // Synapses: nearest-neighbor links up to synapseCount.
  const pairs: [number, number][] = [];
  for (let i = 0; i < cells.length && pairs.length < synapseCount; i++) {
    let nearest = -1;
    let best = Infinity;
    for (let j = 0; j < cells.length; j++) {
      if (j === i) continue;
      const d = Math.hypot(cells[i].x - cells[j].x, cells[i].y - cells[j].y);
      if (d < best && d < 220) {
        best = d;
        nearest = j;
      }
    }
    if (nearest >= 0) pairs.push([i, nearest]);
  }
  return { cells, synapses: pairs };
}

function CellGlyph({ cell }: { cell: Cell }) {
  const s = cell.size;
  const fill = cell.accent ? "var(--cdb-lime)" : "none";
  const stroke = cell.accent
    ? "var(--cdb-lime)"
    : "var(--cdb-paper)";
  const sw = 1.25;
  const common = { stroke, fill, strokeWidth: sw };
  switch (cell.glyph) {
    case 0:
      return (
        <g transform={`translate(${cell.x} ${cell.y})`}>
          <circle r={s} {...common} />
          <line x1={-s} y1="0" x2={-s - 8} y2="0" stroke={stroke} strokeWidth={sw} />
          <line x1={s} y1="0" x2={s + 8} y2="0" stroke={stroke} strokeWidth={sw} />
        </g>
      );
    case 1:
      return (
        <g transform={`translate(${cell.x} ${cell.y})`}>
          <rect x={-s} y={-s} width={s * 2} height={s * 2} {...common} />
          <line x1={0} y1={-s} x2={0} y2={-s - 7} stroke={stroke} strokeWidth={sw} />
          <line x1={0} y1={s} x2={0} y2={s + 7} stroke={stroke} strokeWidth={sw} />
        </g>
      );
    case 2:
      return (
        <g transform={`translate(${cell.x} ${cell.y})`}>
          <circle r={s} {...common} />
          <line
            x1={-s * 0.8}
            y1={-s * 0.8}
            x2={s * 0.8}
            y2={s * 0.8}
            stroke={stroke}
            strokeWidth={sw}
          />
        </g>
      );
    case 3:
      return (
        <g transform={`translate(${cell.x} ${cell.y})`}>
          <polygon
            points={`0,${-s} ${s},0 0,${s} ${-s},0`}
            {...common}
          />
          <circle r={2} fill={stroke} />
        </g>
      );
    case 4:
      return (
        <g transform={`translate(${cell.x} ${cell.y})`}>
          <circle r={s} {...common} />
          <circle r={s * 0.5} fill={stroke} stroke="none" />
        </g>
      );
    case 5:
      return (
        <g transform={`translate(${cell.x} ${cell.y})`}>
          <path
            d={`M ${-s} 0 A ${s} ${s} 0 0 1 ${s} 0`}
            {...common}
          />
          <line x1={-s} y1="0" x2={s} y2="0" stroke={stroke} strokeWidth={sw} />
        </g>
      );
    case 6:
      return (
        <g transform={`translate(${cell.x} ${cell.y})`}>
          <rect
            x={-s * 0.8}
            y={-s * 0.8}
            width={s * 1.6}
            height={s * 1.6}
            {...common}
          />
          <rect
            x={-s * 0.3}
            y={-s * 0.3}
            width={s * 0.6}
            height={s * 0.6}
            fill={stroke}
            stroke="none"
          />
        </g>
      );
    case 7:
    default:
      return (
        <g transform={`translate(${cell.x} ${cell.y})`}>
          <circle r={s} {...common} />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i * Math.PI) / 3;
            return (
              <line
                key={i}
                x1={Math.cos(a) * s}
                y1={Math.sin(a) * s}
                x2={Math.cos(a) * (s + 7)}
                y2={Math.sin(a) * (s + 7)}
                stroke={stroke}
                strokeWidth={sw}
              />
            );
          })}
        </g>
      );
  }
}

export function VaultBiocircuit({
  cellCount = 42,
  synapseCount = 60,
  seed = 104_41,
  accentRatio = 0.11,
  className,
}: VaultBiocircuitProps) {
  const { cells, synapses } = React.useMemo(
    () => generate(seed, cellCount, synapseCount, accentRatio),
    [seed, cellCount, synapseCount, accentRatio]
  );
  return (
    <div
      className={cn(
        "relative w-full h-full",
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 800"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* synapses under cells */}
        <g>
          {synapses.map(([a, b], i) => (
            <line
              key={i}
              x1={cells[a].x}
              y1={cells[a].y}
              x2={cells[b].x}
              y2={cells[b].y}
              stroke="var(--cdb-paper)"
              strokeWidth="0.6"
              opacity="0.45"
            />
          ))}
        </g>
        {/* cells */}
        <g>
          {cells.map((c) => (
            <CellGlyph key={c.id} cell={c} />
          ))}
        </g>
        {/* id labels under accent cells only — avoid visual overload */}
        <g>
          {cells
            .filter((c) => c.accent)
            .map((c) => (
              <text
                key={`${c.id}-label`}
                x={c.x + c.size + 4}
                y={c.y + 3}
                fontFamily="var(--font-jetbrains), monospace"
                fontSize="8"
                fill="var(--cdb-lime)"
                letterSpacing="0.5"
              >
                {c.id}
              </text>
            ))}
        </g>
      </svg>
    </div>
  );
}
