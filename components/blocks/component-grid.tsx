'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  SFButton,
  SFInput,
  SFCard,
  SFCardHeader,
  SFCardTitle,
  SFCardContent,
  SFBadge,
  SFTable,
  SFTableHeader,
  SFTableHead,
  SFTableBody,
  SFTableRow,
  SFTableCell,
} from "@/components/sf";
import { GRAIN_SVG } from "@/lib/grain";
import { PreviewTabs } from "@/components/blocks/preview-tabs";
import { COMPONENT_REGISTRY } from "@/lib/component-registry";
import { API_DOCS } from "@/lib/api-docs";

/* ── Lazy-load ComponentDetail to keep it out of the shared bundle ── */
const ComponentDetailLazy = dynamic(
  () => import('@/components/blocks/component-detail').then((m) => ({ default: m.ComponentDetail })),
  { ssr: false, loading: () => null }
);

/* ── Live preview renderers for each component cell ──
 * These use actual SF primitives (SFButton, SFCard, etc.) for rich demos.
 * The components-explorer.tsx has its own CSS-only preview set (lightweight thumbnails)
 * — this is intentional: homepage previews are "live demos", explorer previews are "icon sketches".
 */

function PreviewButton() {
  return (
    <div className="flex flex-col gap-[var(--sfx-space-2)] items-center">
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
        <p className="text-[var(--text-xs)] text-muted-foreground uppercase tracking-wider">Modular container</p>
      </SFCardContent>
    </SFCard>
  );
}

function PreviewModal() {
  return (
    <div className="w-[75%] max-w-[180px] border-2 border-foreground bg-background text-foreground p-[var(--sfx-space-3)]">
      <p className="text-[var(--text-xs)] font-bold uppercase tracking-wider mb-[var(--sfx-space-2)]">CONFIRM ACTION</p>
      <p className="text-[var(--text-xs)] text-muted-foreground uppercase tracking-wider mb-[var(--sfx-space-3)]">Are you sure?</p>
      <div className="flex gap-[var(--sfx-space-1)]">
        <SFButton intent="primary" size="sm" className="text-[var(--text-xs)] px-[var(--sfx-space-2)] py-[var(--sfx-space-1)]">YES</SFButton>
        <SFButton intent="ghost" size="sm" className="text-[var(--text-xs)] px-[var(--sfx-space-2)] py-[var(--sfx-space-1)]">NO</SFButton>
      </div>
    </div>
  );
}

function PreviewTable() {
  return (
    <SFTable className="w-[80%] max-w-[200px] text-[var(--text-sm)] uppercase tracking-wider">
      <SFTableHeader>
        <SFTableRow>
          <SFTableHead className="px-[var(--sfx-space-2)] py-[var(--sfx-space-1)]">TOKEN</SFTableHead>
          <SFTableHead className="px-[var(--sfx-space-2)] py-[var(--sfx-space-1)] text-right">VALUE</SFTableHead>
        </SFTableRow>
      </SFTableHeader>
      <SFTableBody>
        <SFTableRow>
          <SFTableCell className="px-[var(--sfx-space-2)] py-[var(--sfx-space-1)] opacity-60">primary</SFTableCell>
          <SFTableCell className="px-[var(--sfx-space-2)] py-[var(--sfx-space-1)] text-right text-primary">oklch(.65 .3 350)</SFTableCell>
        </SFTableRow>
        <SFTableRow>
          <SFTableCell className="px-[var(--sfx-space-2)] py-[var(--sfx-space-1)] opacity-60">yellow</SFTableCell>
          <SFTableCell className="px-[var(--sfx-space-2)] py-[var(--sfx-space-1)] text-right text-[var(--sf-yellow)]">oklch(.91 .18 98)</SFTableCell>
        </SFTableRow>
      </SFTableBody>
    </SFTable>
  );
}

function PreviewToast() {
  return (
    <div className="w-[80%] max-w-[200px] border-2 border-primary bg-foreground text-background dark:bg-[var(--sf-dark-surface)] dark:text-foreground p-[var(--sfx-space-3)] flex items-start gap-[var(--sfx-space-2)]">
      <span className="text-primary text-sm">◉</span>
      <div>
        <p className="text-[var(--text-xs)] font-bold uppercase tracking-wider">DEPLOYED</p>
        <p className="text-[var(--text-xs)] uppercase tracking-wider opacity-60 mt-0.5">Build #4201 live</p>
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
      <p className="absolute bottom-1 left-2 text-[var(--text-xs)] text-[var(--sf-dim-text)] uppercase tracking-wider">
        FRACTAL NOISE
      </p>
    </div>
  );
}

function PreviewParticleMesh() {
  return (
    <div className="w-[80%] max-w-[180px] h-[60px] relative">
      <svg aria-hidden="true" viewBox="0 0 180 60" className="w-full h-full">
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
        className="sf-display text-[var(--text-lg)] font-bold uppercase tracking-wider text-[var(--sf-muted-text-dark)]"
      >
        GLITCH
      </span>
      <span
        aria-hidden="true"
        className="sf-display absolute top-0 left-[2px] text-[var(--text-lg)] font-bold uppercase tracking-wider text-primary opacity-50"
        style={{ clipPath: "inset(30% 0 40% 0)" }}
      >
        GLITCH
      </span>
      <span
        aria-hidden="true"
        className="sf-display absolute top-0 left-[-2px] text-[var(--text-lg)] font-bold uppercase tracking-wider text-[var(--sf-yellow)] opacity-40"
        style={{ clipPath: "inset(60% 0 10% 0)" }}
      >
        GLITCH
      </span>
    </div>
  );
}

function PreviewBadge() {
  return (
    <div className="flex flex-col items-center gap-[var(--sfx-space-2)]">
      <SFBadge intent="default">DEFAULT</SFBadge>
      <SFBadge intent="outline">OUTLINE</SFBadge>
    </div>
  );
}

function PreviewWaveform() {
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
      <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="none">
        <polyline
          points={wave(3, 22, 0)}
          fill="none"
          stroke="var(--sf-waveform-bg)"
          strokeWidth="0.5"
        />
        <polyline
          points={wave(5, 18, 0.5)}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={wave(11, 6, 1.2)}
          fill="none"
          stroke="var(--sf-waveform-harmonic)"
          strokeWidth="0.7"
          opacity="0.6"
        />
        <line x1="0" y1={mid} x2={w} y2={mid} stroke="var(--sf-subtle-border)" strokeWidth="0.5" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}

/* ── Preview map ── */
const PREVIEW_MAP: Record<string, () => React.ReactNode> = {
  "001": PreviewButton,
  "002": PreviewInput,
  "005": PreviewCard,
  "006": PreviewModal,
  "009": PreviewTable,
  "010": PreviewToast,
  "101": PreviewNoiseBg,
  "104": PreviewParticleMesh,
  "103": PreviewGlitchText,
  "008": PreviewBadge,
  "007": PreviewTabs,
  "102": PreviewWaveform,
};

const COMPONENTS = [
  { id: "001", name: "BUTTON", bg: "white", layer: "FRAME" },
  { id: "002", name: "INPUT", bg: "black", layer: "FRAME" },
  { id: "005", name: "CARD", bg: "white", layer: "FRAME" },
  { id: "006", name: "MODAL", bg: "white", layer: "FRAME" },
  { id: "009", name: "TABLE", bg: "white", layer: "FRAME" },
  { id: "010", name: "TOAST", bg: "white", layer: "FRAME" },
  { id: "101", name: "NOISE_BG", bg: "black", layer: "SIGNAL" },
  { id: "104", name: "PARTICLE_MESH", bg: "black", layer: "SIGNAL" },
  { id: "103", name: "GLITCH_TEXT", bg: "black", layer: "SIGNAL" },
  { id: "008", name: "BADGE", bg: "black", layer: "FRAME" },
  { id: "007", name: "TABS", bg: "white", layer: "FRAME" },
  { id: "102", name: "WAVEFORM", bg: "black", layer: "SIGNAL" },
];

export function ComponentGrid({ highlightedCodeMap }: { highlightedCodeMap: Record<string, string> }) {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const triggerRefs = useRef<Record<string, HTMLElement | null>>({});

  const handleCardClick = useCallback((id: string) => {
    setOpenIndex((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section className="border-b-4 border-foreground h-screen h-[calc(100*var(--sf-vh))] flex flex-col overflow-hidden">
      {/* Section header */}
      <div className="px-[var(--sfx-space-6)] md:px-[var(--sfx-space-12)] pt-[clamp(8px,calc(2*var(--sf-vh)),16px)] pb-[clamp(4px,calc(1*var(--sf-vh)),6px)] border-b-2 border-foreground shrink-0">
        <h2
          className="sf-display text-[clamp(20px,calc(3*var(--sf-vw)),48px)] leading-none text-foreground"
        >
          BROWSE_COMPONENTS ( 12 / 340 )
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 flex-1 min-h-0 place-content-center">
        {COMPONENTS.map((comp) => {
          const isBlack = comp.bg === "black";
          const Preview = PREVIEW_MAP[comp.id];

          return (
            <div
              key={comp.id}
              role="button"
              tabIndex={0}
              ref={(el) => { triggerRefs.current[comp.id] = el; }}
              onClick={() => handleCardClick(comp.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(comp.id);
                }
              }}
              aria-expanded={openIndex === comp.id}
              data-anim="comp-cell"
              aria-roledescription="component card"
              className="relative border-r-2 border-b-2 border-foreground group cursor-pointer hover:border-primary transition-colors duration-[var(--sfx-duration-fast)]"
              style={{
                aspectRatio: "1",
                backgroundColor: isBlack ? "var(--sf-darker-surface)" : "var(--sf-cell-light-bg)",
                color: "var(--color-foreground)",
              }}
            >
              {/* Index — magenta numeral */}
              <span className="absolute top-2 right-3 sf-display text-primary text-[clamp(24px,calc(3*var(--sf-vw)),36px)] leading-none opacity-40 group-hover:opacity-80 transition-opacity duration-[var(--sfx-duration-normal)]">
                {comp.id}
              </span>

              {/* Live preview */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-[var(--sfx-space-4)]">
                {Preview && <Preview />}
              </div>

              {/* Name + Layer label */}
              <span className={`absolute bottom-3 left-3 text-[var(--text-sm)] uppercase tracking-[0.15em] font-bold ${isBlack ? "opacity-80" : "opacity-60"}`}>
                {comp.name}
              </span>
              <span className={`absolute bottom-3 right-3 text-[var(--text-xs)] uppercase tracking-[0.15em] ${isBlack ? "opacity-60" : "opacity-40"}`}>
                {comp.layer}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detail Panel — DOM sibling below grid */}
      {openIndex && COMPONENT_REGISTRY[openIndex] && (
        <ComponentDetailLazy
          entry={COMPONENT_REGISTRY[openIndex]}
          doc={API_DOCS[COMPONENT_REGISTRY[openIndex].docId]}
          highlightedCode={highlightedCodeMap[openIndex] ?? ''}
          onClose={() => setOpenIndex(null)}
          triggerRef={{ current: triggerRefs.current[openIndex] ?? null }}
        />
      )}
    </section>
  );
}
