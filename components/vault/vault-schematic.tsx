import React from "react";
import { cn } from "@/lib/utils";

interface VaultSchematicProps {
  className?: string;
}

/*
 * Diagrams2-class dense electronics schematic. Single-page readout,
 * static SVG. The composition is an imaginary signal path: oscillator
 * → amplifier → transformer coupling → output stage, annotated with
 * callouts in lime. Designed to read like a page from a 1970s radio
 * textbook — paper-thin stroke weight, half-tone component symbols,
 * coordinate grid dots under the schematic.
 */
export function VaultSchematic({ className }: VaultSchematicProps) {
  const s = "stroke-[var(--cdb-paper)] fill-none stroke-[1.2]";
  const sf = "stroke-[var(--cdb-paper)] fill-[var(--cdb-paper)] stroke-[1.2]";
  const lime = "stroke-[var(--cdb-lime)] fill-[var(--cdb-lime)]";
  return (
    <svg
      viewBox="0 0 1200 700"
      className={cn("w-full h-full", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* grid */}
      <g opacity="0.22">
        {Array.from({ length: 40 }).flatMap((_, gx) =>
          Array.from({ length: 24 }).map((_, gy) => (
            <circle
              key={`g-${gx}-${gy}`}
              cx={gx * 30 + 15}
              cy={gy * 30 + 15}
              r="0.7"
              fill="var(--cdb-paper)"
            />
          ))
        )}
      </g>

      {/* ── STAGE 1 · OSCILLATOR (left) ───────────────────── */}
      {/* battery source */}
      <g className={s}>
        <line x1="60" y1="160" x2="60" y2="260" />
        <line x1="44" y1="200" x2="76" y2="200" strokeWidth="2" />
        <line x1="48" y1="220" x2="72" y2="220" />
        <line x1="44" y1="240" x2="76" y2="240" strokeWidth="2" />
        <line x1="48" y1="260" x2="72" y2="260" />
      </g>
      <text x="36" y="290" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-paper)" letterSpacing="0.5">
        V1  ·  12V
      </text>
      {/* wire up to resistor */}
      <line x1="60" y1="160" x2="160" y2="160" className={s} />
      {/* resistor R1 — zigzag */}
      <g className={s}>
        <polyline points="160,160 168,150 178,170 188,150 198,170 208,150 218,170 228,160" />
      </g>
      <text x="170" y="140" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-lime)" letterSpacing="0.5">
        R1 · 4.7kΩ
      </text>
      {/* wire to cap */}
      <line x1="228" y1="160" x2="300" y2="160" className={s} />
      {/* capacitor C1 */}
      <g className={s}>
        <line x1="300" y1="140" x2="300" y2="180" />
        <line x1="316" y1="140" x2="316" y2="180" strokeWidth="2" />
      </g>
      <text x="286" y="200" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-lime)">
        C1 · 10μF
      </text>
      {/* wire to transistor */}
      <line x1="316" y1="160" x2="420" y2="160" className={s} />

      {/* ── STAGE 2 · AMPLIFIER ───────────────────────────── */}
      {/* transistor Q1 — circle with three leads */}
      <g className={s}>
        <circle cx="460" cy="160" r="28" />
        <line x1="460" y1="132" x2="460" y2="100" /> {/* collector up */}
        <line x1="432" y1="160" x2="400" y2="160" /> {/* base left */}
        <line x1="460" y1="188" x2="460" y2="220" /> {/* emitter down */}
        <line x1="446" y1="150" x2="474" y2="170" /> {/* base-emitter slash */}
        <polyline points="468,164 474,170 466,174" className={sf} />
      </g>
      <text x="500" y="155" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-lime)">
        Q1 · NPN
      </text>
      {/* emitter to ground */}
      <line x1="460" y1="220" x2="460" y2="280" className={s} />
      {/* ground */}
      <g className={s}>
        <line x1="440" y1="280" x2="480" y2="280" strokeWidth="2" />
        <line x1="448" y1="288" x2="472" y2="288" />
        <line x1="454" y1="296" x2="466" y2="296" />
      </g>
      {/* collector up to transformer */}
      <line x1="460" y1="100" x2="620" y2="100" className={s} />

      {/* ── STAGE 3 · TRANSFORMER COUPLING ─────────────────── */}
      {/* transformer T1 — two coils */}
      <g className={s}>
        <line x1="620" y1="60" x2="620" y2="160" />
        <path d="M610 70 Q 620 78 630 70 M610 85 Q 620 93 630 85 M610 100 Q 620 108 630 100 M610 115 Q 620 123 630 115 M610 130 Q 620 138 630 130 M610 145 Q 620 153 630 145" />
        {/* core lines */}
        <line x1="638" y1="60" x2="638" y2="160" strokeWidth="0.5" />
        <line x1="642" y1="60" x2="642" y2="160" strokeWidth="0.5" />
        {/* secondary */}
        <line x1="660" y1="60" x2="660" y2="160" />
        <path d="M650 70 Q 660 78 670 70 M650 85 Q 660 93 670 85 M650 100 Q 660 108 670 100 M650 115 Q 660 123 670 115 M650 130 Q 660 138 670 130 M650 145 Q 660 153 670 145" />
      </g>
      <text x="610" y="46" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-lime)">
        T1 · 10:1
      </text>
      {/* transformer primary tap */}
      <line x1="620" y1="160" x2="720" y2="160" className={s} />
      <line x1="720" y1="160" x2="720" y2="100" className={s} />
      {/* secondary out */}
      <line x1="660" y1="100" x2="800" y2="100" className={s} />

      {/* ── STAGE 4 · DETECTOR / RECTIFIER ─────────────────── */}
      {/* diode */}
      <g className={s}>
        <polygon points="800,92 800,108 816,100" className={sf} />
        <line x1="816" y1="92" x2="816" y2="108" strokeWidth="2" />
      </g>
      <text x="786" y="80" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-lime)">
        D1
      </text>
      <line x1="816" y1="100" x2="880" y2="100" className={s} />
      {/* output cap */}
      <g className={s}>
        <line x1="880" y1="80" x2="880" y2="120" />
        <line x1="896" y1="80" x2="896" y2="120" strokeWidth="2" />
      </g>
      <text x="868" y="68" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-lime)">
        C2
      </text>
      {/* wire to speaker */}
      <line x1="896" y1="100" x2="980" y2="100" className={s} />

      {/* ── STAGE 5 · OUTPUT TRANSDUCER ────────────────────── */}
      {/* speaker symbol */}
      <g className={s}>
        <line x1="980" y1="80" x2="980" y2="120" />
        <polygon points="980,80 980,120 1010,135 1010,65" className={sf} />
        <path d="M1020 78 Q 1036 100 1020 122" />
        <path d="M1030 70 Q 1054 100 1030 130" />
      </g>
      <text x="988" y="160" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-lime)">
        SPK · 8Ω
      </text>

      {/* ── BOTTOM RAIL · feedback line ────────────────────── */}
      <line x1="60" y1="440" x2="980" y2="440" className={s} strokeDasharray="4 3" />
      <text x="60" y="428" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-paper)">
        FEEDBACK LOOP · σ[0→1]
      </text>

      {/* ── STAGE 6 · LFO / SIGNAL GENERATOR ────────────────── */}
      {/* waveguide box */}
      <g className={s}>
        <rect x="180" y="510" width="140" height="80" />
        <polyline points="190,550 200,530 220,570 240,530 260,570 280,530 300,550 310,550" />
      </g>
      <text x="186" y="502" fontFamily="var(--font-jetbrains), monospace" fontSize="10" fill="var(--cdb-lime)">
        LFO · 3.2Hz SINE
      </text>

      {/* IC chip */}
      <g className={s}>
        <rect x="420" y="500" width="140" height="100" />
        <line x1="420" y1="520" x2="408" y2="520" />
        <line x1="420" y1="540" x2="408" y2="540" />
        <line x1="420" y1="560" x2="408" y2="560" />
        <line x1="420" y1="580" x2="408" y2="580" />
        <line x1="560" y1="520" x2="572" y2="520" />
        <line x1="560" y1="540" x2="572" y2="540" />
        <line x1="560" y1="560" x2="572" y2="560" />
        <line x1="560" y1="580" x2="572" y2="580" />
        <circle cx="430" cy="510" r="2" fill="var(--cdb-paper)" />
      </g>
      <text x="432" y="555" fontFamily="var(--font-jetbrains), monospace" fontSize="11" fill="var(--cdb-paper)" letterSpacing="1">
        IC1
      </text>
      <text x="432" y="575" fontFamily="var(--font-jetbrains), monospace" fontSize="9" fill="var(--cdb-paper)" opacity="0.7">
        SF//7-441
      </text>

      {/* crystal */}
      <g className={s}>
        <rect x="700" y="540" width="30" height="24" />
        <line x1="690" y1="552" x2="700" y2="552" />
        <line x1="730" y1="552" x2="740" y2="552" />
        <line x1="707" y1="540" x2="707" y2="564" strokeWidth="2" />
        <line x1="723" y1="540" x2="723" y2="564" strokeWidth="2" />
      </g>
      <text x="696" y="582" fontFamily="var(--font-jetbrains), monospace" fontSize="9" fill="var(--cdb-lime)">
        XTAL · 4MHz
      </text>

      {/* σ scalar in bottom-right */}
      <g>
        <rect x="880" y="500" width="220" height="100" className={s} />
        <text x="896" y="528" fontFamily="var(--font-jetbrains), monospace" fontSize="11" fill="var(--cdb-paper)" letterSpacing="1">
          SIGNAL INTENSITY
        </text>
        <text x="896" y="560" fontFamily="var(--font-bungee), monospace" fontSize="28" fill="var(--cdb-lime)" className={lime}>
          σ = 0.812
        </text>
        <text x="896" y="584" fontFamily="var(--font-jetbrains), monospace" fontSize="8" fill="var(--cdb-paper)" opacity="0.7">
          FRAME ABSORBED / TRANSFER OK
        </text>
      </g>

      {/* chart */}
      <text x="60" y="654" fontFamily="var(--font-jetbrains), monospace" fontSize="8" fill="var(--cdb-paper)" opacity="0.7">
        FIG. 44A · CULTURE DIVISION / SF//7 SERIES / SCHEMATIC 04 OF 17
      </text>
    </svg>
  );
}
