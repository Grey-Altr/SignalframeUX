"use client";

import { useState } from "react";

const COMPONENTS = [
  { id: "001", name: "BUTTON", bg: "white", layer: "SIGNAL" },
  { id: "002", name: "INPUT", bg: "black", layer: "SIGNAL" },
  { id: "003", name: "CARD", bg: "white", layer: "SIGNAL" },
  { id: "004", name: "MODAL", bg: "white", layer: "SIGNAL" },
  { id: "005", name: "TABLE", bg: "white", layer: "SIGNAL" },
  { id: "006", name: "TOAST", bg: "white", layer: "SIGNAL" },
  { id: "007", name: "NOISE_BG", bg: "black", layer: "FIELD" },
  { id: "008", name: "PARTICLE_MESH", bg: "black", layer: "FIELD" },
  { id: "009", name: "GLITCH_TEXT", bg: "black", layer: "FIELD" },
  { id: "010", name: "DROPDOWN", bg: "white", layer: "SIGNAL" },
  { id: "011", name: "TABS", bg: "white", layer: "SIGNAL" },
  { id: "012", name: "WAVEFORM", bg: "black", layer: "FIELD" },
];

export function ComponentGrid() {
  const [activeCell, setActiveCell] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  return (
    <section className="border-b-4 border-foreground">
      {/* Section header */}
      <div className="px-6 md:px-12 pt-16 pb-6 border-b-2 border-foreground">
        <h2
          className="text-[clamp(36px,5vw,64px)] leading-none text-foreground"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          BROWSE_COMPONENTS ( 12 / 340 )
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {COMPONENTS.map((comp) => {
          const isBlack = comp.bg === "black";
          const isActive = activeCell === comp.id;
          const isHovered = hoveredCell === comp.id;

          // Determine colors based on state
          let bgColor: string;
          let textColor: string;
          let borderColor: string | undefined;

          if (isActive) {
            bgColor = isBlack ? "oklch(0.65 0.29 350)" : "oklch(0.145 0 0)";
            textColor = "white";
            borderColor = undefined;
          } else if (isHovered) {
            bgColor = isBlack ? "oklch(0.65 0.29 350)" : "oklch(0.145 0 0)";
            textColor = "white";
            borderColor = "oklch(0.65 0.29 350)";
          } else {
            bgColor = isBlack ? "oklch(0.145 0 0)" : "white";
            textColor = isBlack ? "white" : "oklch(0.145 0 0)";
            borderColor = undefined;
          }

          return (
            <button
              key={comp.id}
              data-anim="comp-cell"
              className="relative border-r-2 border-b-2 border-foreground cursor-pointer group"
              style={{
                aspectRatio: "1",
                backgroundColor: bgColor,
                color: textColor,
                borderColor: borderColor || undefined,
              }}
              onMouseEnter={() => setHoveredCell(comp.id)}
              onMouseLeave={() => setHoveredCell(null)}
              onClick={() => {
                setActiveCell(comp.id);
                setTimeout(() => setActiveCell(null), 150);
              }}
            >
              {/* Index */}
              <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.15em] opacity-40">
                {comp.id}
              </span>

              {/* Name */}
              <span className="absolute inset-0 flex items-center justify-center text-[11px] uppercase tracking-[0.15em] font-bold">
                {comp.name}
              </span>

              {/* Layer */}
              <span className="absolute bottom-3 right-3 text-[8px] uppercase tracking-[0.15em] opacity-40">
                {comp.layer}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
