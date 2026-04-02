"use client";

import { useState } from "react";
import Link from "next/link";
import { SFButton } from "@/components/sf/sf-button";
import { SFInput } from "@/components/sf/sf-input";
import { SFCard, SFCardHeader, SFCardTitle, SFCardContent } from "@/components/sf/sf-card";
import { SFBadge } from "@/components/sf/sf-badge";
import { GRAIN_SVG } from "@/lib/grain";
import { SFTabs, SFTabsList, SFTabsTrigger } from "@/components/sf/sf-tabs";

/* ── Live preview renderers for each component cell ──
 * These use actual SF primitives (SFButton, SFCard, etc.) for rich demos.
 * The components-explorer.tsx has its own CSS-only preview set (lightweight thumbnails)
 * — this is intentional: homepage previews are "live demos", explorer previews are "icon sketches".
 */

function PreviewButton() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <SFButton intent="primary" size="sm">PRIMARY</SFButton>
      <SFButton intent="ghost" size="sm">GHOST</SFButton>
    </div>
  );
}

function PreviewInput() {
  return (
    <div className="w-[80%] max-w-[200px]">
      <SFInput placeholder="ENTER SIGNAL..." />
    </div>
  );
}

function PreviewCard() {
  return (
    <SFCard hoverable={false} className="w-[80%] max-w-[200px]">
      <SFCardHeader>
        <SFCardTitle>CARD</SFCardTitle>
      </SFCardHeader>
      <SFCardContent>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Modular container</p>
      </SFCardContent>
    </SFCard>
  );
}

function PreviewModal() {
  return (
    <div className="w-[75%] max-w-[180px] border-2 border-foreground bg-background text-foreground p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider mb-2">CONFIRM ACTION</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">Are you sure?</p>
      <div className="flex gap-1">
        <SFButton intent="primary" size="sm" className="text-[10px] px-2 py-1">YES</SFButton>
        <SFButton intent="ghost" size="sm" className="text-[10px] px-2 py-1">NO</SFButton>
      </div>
    </div>
  );
}

function PreviewTable() {
  return (
    <div className="w-[80%] max-w-[200px] border-2 border-foreground text-[11px] uppercase tracking-wider">
      <div className="bg-foreground text-background px-2 py-1.5 flex dark:bg-[var(--sf-dark-surface)] dark:text-foreground">
        <span className="flex-1">TOKEN</span>
        <span className="flex-1 text-right">VALUE</span>
      </div>
      <div className="px-2 py-1.5 flex border-b border-foreground/20">
        <span className="flex-1 text-muted-foreground">primary</span>
        <span className="flex-1 text-right text-primary">#FF0090</span>
      </div>
      <div className="px-2 py-1.5 flex">
        <span className="flex-1 text-muted-foreground">yellow</span>
        <span className="flex-1 text-right text-[var(--sf-yellow)]">#E5C800</span>
      </div>
    </div>
  );
}

function PreviewToast() {
  return (
    <div className="w-[80%] max-w-[200px] border-2 border-primary bg-foreground text-background dark:bg-[var(--sf-dark-surface)] dark:text-foreground p-3 flex items-start gap-2">
      <span className="text-primary text-sm">◉</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider">DEPLOYED</p>
        <p className="text-[10px] uppercase tracking-wider opacity-60 mt-0.5">Build #4201 live</p>
      </div>
    </div>
  );
}

function PreviewNoiseBg() {
  return (
    <div className="w-[80%] max-w-[180px] h-[60px] relative overflow-hidden border border-[var(--sf-subtle-border)]">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: GRAIN_SVG,
        }}
      />
      <p className="absolute bottom-1 left-2 text-[10px] text-[var(--sf-dim-text)] uppercase tracking-wider">
        FRACTAL NOISE
      </p>
    </div>
  );
}

function PreviewParticleMesh() {
  return (
    <div className="w-[80%] max-w-[180px] h-[60px] relative">
      <svg viewBox="0 0 180 60" className="w-full h-full">
        {/* Grid dots */}
        {Array.from({ length: 24 }).map((_, i) => {
          const x = 15 + (i % 6) * 30;
          const y = 12 + Math.floor(i / 6) * 14;
          return <circle key={i} cx={x} cy={y} r="1.5" fill="var(--sf-dim-text)" />;
        })}
        {/* Connection lines */}
        <line x1="15" y1="12" x2="45" y2="12" stroke="var(--sf-subtle-border)" strokeWidth="0.5" />
        <line x1="45" y1="12" x2="75" y2="26" stroke="var(--sf-subtle-border)" strokeWidth="0.5" />
        <line x1="75" y1="26" x2="105" y2="12" stroke="var(--sf-subtle-border)" strokeWidth="0.5" />
        <line x1="105" y1="12" x2="135" y2="26" stroke="var(--sf-subtle-border)" strokeWidth="0.5" />
        <line x1="135" y1="26" x2="165" y2="12" stroke="var(--sf-subtle-border)" strokeWidth="0.5" />
        <line x1="15" y1="26" x2="45" y2="40" stroke="var(--sf-subtle-border)" strokeWidth="0.5" />
        <line x1="45" y1="40" x2="75" y2="40" stroke="var(--sf-subtle-border)" strokeWidth="0.5" />
        <line x1="105" y1="40" x2="135" y2="54" stroke="var(--sf-subtle-border)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

function PreviewGlitchText() {
  return (
    <div className="relative">
      <span
        className="sf-display text-[18px] font-bold uppercase tracking-wider text-[var(--sf-muted-text-dark)]"
      >
        GLITCH
      </span>
      <span
        className="sf-display absolute top-0 left-[2px] text-[18px] font-bold uppercase tracking-wider text-primary opacity-50"
        style={{ clipPath: "inset(30% 0 40% 0)" }}
      >
        GLITCH
      </span>
      <span
        className="sf-display absolute top-0 left-[-2px] text-[18px] font-bold uppercase tracking-wider text-[var(--sf-yellow)] opacity-40"
        style={{ clipPath: "inset(60% 0 10% 0)" }}
      >
        GLITCH
      </span>
    </div>
  );
}

function PreviewDropdown() {
  return (
    <div className="w-[80%] max-w-[180px]">
      <div className="border-2 border-foreground px-3 py-1.5 flex items-center justify-between text-[10px] uppercase tracking-wider">
        <span>SELECT</span>
        <span className="text-muted-foreground">▾</span>
      </div>
      <div className="border-2 border-t-0 border-foreground">
        <div className="px-3 py-1 text-[11px] uppercase tracking-wider bg-foreground text-background dark:bg-[var(--sf-dark-surface)] dark:text-foreground">OPTION A</div>
        <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">OPTION B</div>
        <div className="px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">OPTION C</div>
      </div>
    </div>
  );
}

function PreviewTabs() {
  return (
    <div className="w-[80%] max-w-[200px]">
      <SFTabs defaultValue="signal">
        <SFTabsList>
          <SFTabsTrigger value="signal" className="text-[11px]">SIGNAL</SFTabsTrigger>
          <SFTabsTrigger value="frame" className="text-[11px]">FRAME</SFTabsTrigger>
        </SFTabsList>
      </SFTabs>
    </div>
  );
}

function PreviewWaveform() {
  // Generate smooth sine-based waveform paths
  const w = 180;
  const h = 60;
  const mid = h / 2;
  const steps = 120;

  function wave(freq: number, amp: number, phase: number) {
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * w;
      const y = mid + Math.sin((i / steps) * Math.PI * 2 * freq + phase) * amp;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  }

  return (
    <div className="w-[85%] max-w-[200px] h-[60px] relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Background amplitude envelope */}
        <polyline
          points={wave(3, 22, 0)}
          fill="none"
          stroke="var(--sf-waveform-bg)"
          strokeWidth="0.5"
        />
        {/* Main waveform */}
        <polyline
          points={wave(5, 18, 0.5)}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Harmonic overlay */}
        <polyline
          points={wave(11, 6, 1.2)}
          fill="none"
          stroke="var(--sf-waveform-harmonic)"
          strokeWidth="0.7"
          opacity="0.6"
        />
        {/* Center line */}
        <line x1="0" y1={mid} x2={w} y2={mid} stroke="var(--sf-subtle-border)" strokeWidth="0.5" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}

/* ── Preview map ── */
const PREVIEW_MAP: Record<string, () => React.ReactNode> = {
  "001": PreviewButton,
  "002": PreviewInput,
  "003": PreviewCard,
  "004": PreviewModal,
  "005": PreviewTable,
  "006": PreviewToast,
  "007": PreviewNoiseBg,
  "008": PreviewParticleMesh,
  "009": PreviewGlitchText,
  "010": PreviewDropdown,
  "011": PreviewTabs,
  "012": PreviewWaveform,
};

const COMPONENTS = [
  { id: "001", name: "BUTTON", bg: "white", layer: "FRAME" },
  { id: "002", name: "INPUT", bg: "black", layer: "FRAME" },
  { id: "003", name: "CARD", bg: "white", layer: "FRAME" },
  { id: "004", name: "MODAL", bg: "white", layer: "FRAME" },
  { id: "005", name: "TABLE", bg: "white", layer: "FRAME" },
  { id: "006", name: "TOAST", bg: "white", layer: "FRAME" },
  { id: "007", name: "NOISE_BG", bg: "black", layer: "SIGNAL" },
  { id: "008", name: "PARTICLE_MESH", bg: "black", layer: "SIGNAL" },
  { id: "009", name: "GLITCH_TEXT", bg: "black", layer: "SIGNAL" },
  { id: "010", name: "DROPDOWN", bg: "white", layer: "FRAME" },
  { id: "011", name: "TABS", bg: "white", layer: "FRAME" },
  { id: "012", name: "WAVEFORM", bg: "black", layer: "SIGNAL" },
];

export function ComponentGrid() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  return (
    <section className="border-b-4 border-foreground">
      {/* Section header */}
      <div className="px-6 md:px-12 pt-16 pb-6 border-b-2 border-foreground">
        <h2
          className="sf-display text-[clamp(36px,5vw,64px)] leading-none text-foreground"
        >
          BROWSE_COMPONENTS ( 12 / 340 )
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {COMPONENTS.map((comp) => {
          const isBlack = comp.bg === "black";
          const isHovered = hoveredCell === comp.id;
          const Preview = PREVIEW_MAP[comp.id];

          return (
            <Link
              key={comp.id}
              href="/components"
              data-anim="comp-cell"
              aria-label={`${comp.name} component`}
              suppressHydrationWarning
              className="relative border-r-2 border-b-2 border-foreground group no-underline"
              style={{
                aspectRatio: "1",
                backgroundColor: isBlack ? "var(--sf-darker-surface)" : "var(--sf-cell-light-bg)",
                color: "var(--color-foreground)",
                borderColor: isHovered ? "var(--color-primary)" : undefined,
              }}
              onMouseEnter={() => setHoveredCell(comp.id)}
              onMouseLeave={() => setHoveredCell(null)}
            >
              {/* Index */}
              <span className="absolute top-3 left-3 text-[11px] uppercase tracking-[0.15em] opacity-40">
                {comp.id}
              </span>

              {/* Live preview */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4">
                {Preview && <Preview />}
              </div>

              {/* Name + Layer label */}
              <span className="absolute bottom-3 left-3 text-[11px] uppercase tracking-[0.15em] font-bold opacity-60">
                {comp.name}
              </span>
              <span className="absolute bottom-3 right-3 text-[10px] uppercase tracking-[0.15em] opacity-40">
                {comp.layer}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
