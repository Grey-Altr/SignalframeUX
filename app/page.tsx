"use client";
import React from "react";
import {
  VaultField,
  VaultChrome,
  VaultStamp,
  type VaultStampTreatment,
  VaultTrademark,
  type VaultTrademarkGlyph,
  VaultFlag,
  type FlagPattern,
  VaultPointcloud,
  VaultBiocircuit,
  VaultSchematic,
  VaultHelghanese,
  VaultDataField,
} from "@/components/vault";

/*
 * cdB-v1 vault build. Direct pack quotations. 9 sections.
 * Bootloader · KLOROFORM × Cyber2k HUD · Brando Corp 250 catalog ·
 * E0000 Black Flag wall · Vanzyst circuitry · Diagrams2 schematic ·
 * NCL typescape · Stamp circulation · Helghanese + Ikeda exit.
 */

export default function HomePage() {
  return (
    <main className="bg-[var(--cdb-black)] text-[var(--cdb-paper)]">
      <Bootloader />
      <ColdVoid />
      <BrandoCatalog />
      <FlagWall />
      <VanzystCircuitry />
      <SchematicPage />
      <NclTypescape />
      <StampCirculation />
      <HelghaneseExit />
      <PageRail />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared: scroll progress hook
// ─────────────────────────────────────────────────────────────
function useSectionProgress(
  ref: React.RefObject<HTMLElement | null>
): number {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const progressed = vh - rect.top;
      setP(Math.max(0, Math.min(1, progressed / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return p;
}

// ─────────────────────────────────────────────────────────────
// 00 · BOOTLOADER — 4s cold-boot overlay then pointer-events:none
// ─────────────────────────────────────────────────────────────
function Bootloader() {
  const [stage, setStage] = React.useState<"running" | "fade" | "gone">(
    "running"
  );
  React.useEffect(() => {
    const t1 = setTimeout(() => setStage("fade"), 3400);
    const t2 = setTimeout(() => setStage("gone"), 4600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  if (stage === "gone") return null;
  const lines = [
    "CULTURE DIVISION · COLD BOOT  ·  2026.04.18 / TS+22:19:52",
    "........",
    "[ OK ]  MEMORY BUS                        LINK  1.412GHz",
    "[ OK ]  SIGNAL INTEGRITY CHECK            σ = 0.812",
    "[ OK ]  FRAME REGISTRY                    N=184 TOKENS",
    "[ OK ]  KLOROFORM MORPHOLOGY POOL         7 / 7",
    "[ OK ]  E0000 PACK                        30 VARIANTS",
    "[ OK ]  BRANDO CORP 250                   64 CATALOG CELLS",
    "[ OK ]  VANZYST MULTICOLORED              SEED 10441",
    "[ OK ]  NCL GRAXEBEOSA TYPEFACE           4864 GLYPHS",
    "[ OK ]  HELGHANESE PARALLEL ALPHABET      26 GLYPHS",
    "[ OK ]  IKEDA DATA-FIELD                  10 x 32 LIVE",
    "........",
    "SYS.READY · ENTERING SIGNALFRAME//UX",
    "$ _",
  ];
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] bg-[var(--cdb-black)] transition-opacity duration-[1200ms] ${
        stage === "fade" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent 0 2px, rgba(250,250,250,0.04) 2px 3px)`,
          }}
        />
        <div className="relative px-6 sm:px-10 py-10 sm:py-14 font-mono text-[11px] sm:text-[13px] leading-[1.6] text-[var(--cdb-paper)]">
          {lines.map((l, i) => (
            <div
              key={i}
              className="whitespace-pre"
              style={{
                opacity: 0,
                animation: `vaultBootLine 0.001s ${i * 180 + 120}ms forwards`,
              }}
            >
              <span className={l.startsWith("[ OK ]") ? "text-[var(--cdb-lime)]" : ""}>
                {l}
              </span>
            </div>
          ))}
        </div>
        <style>{`@keyframes vaultBootLine{to{opacity:1}}`}</style>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 01 · COLD VOID — KLOROFORM pointcloud × Cyber2k HUD
// ─────────────────────────────────────────────────────────────
function ColdVoid() {
  const ref = React.useRef<HTMLElement | null>(null);
  const progress = useSectionProgress(ref);
  return (
    <VaultField
      ref={ref as unknown as React.Ref<HTMLElement>}
      bleed="viewport"
      grain="strong"
      scanlines
      pack="KLOROFORM · POINTCLOUD FIELD / σ[0→1]"
      className="min-h-[120vh]"
    >
      <VaultChrome
        code="SF//VLT-001 · COLD VOID"
        mode="FRAME / SIGNAL IDLE"
        reticle
        waveform
        rangeFinder
        brackets
        ticks
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <VaultPointcloud
          morphologies={[
            "ring",
            "torus",
            "comet",
            "eventHorizon",
            "spiral",
            "nebula",
            "lattice",
          ]}
          progress={progress}
          pointCount={22000}
          className="w-full h-full max-w-[88vw] max-h-[82vh]"
        />
      </div>
      {/* sticky wordmark */}
      <div className="sticky top-[50vh] -translate-y-1/2 relative z-10 flex flex-col items-center gap-4 pointer-events-none">
        <div className="font-[var(--font-bungee)] text-[clamp(96px,22vw,400px)] leading-[0.8] uppercase mix-blend-difference text-[var(--cdb-paper)]">
          VOID
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--cdb-paper)]/75">
          {progressLabel(progress)} / SIGNAL σ={progress.toFixed(3)}
        </div>
      </div>
      {/* floating stamps */}
      <div className="absolute top-[22vh] right-[8vw] flex gap-3">
        <VaultStamp text="COLD BOOT" code="STM-001" treatment="inverted" />
        <VaultStamp text="σ VERIFIED" treatment="ink" rotate={-2} />
      </div>
    </VaultField>
  );
}
function progressLabel(p: number): string {
  if (p < 0.15) return "RING";
  if (p < 0.3) return "TORUS";
  if (p < 0.45) return "COMET";
  if (p < 0.6) return "EVENT HORIZON";
  if (p < 0.75) return "SPIRAL";
  if (p < 0.9) return "NEBULA";
  return "LATTICE";
}

// ─────────────────────────────────────────────────────────────
// 02 · BRANDO CORP 250 CATALOG — 64-cell Y2K trademark grid
// ─────────────────────────────────────────────────────────────
const GLYPH_POOL: VaultTrademarkGlyph[] = [
  "hexStacked",
  "recycling",
  "starBurst",
  "peaceRing",
  "cubeNest",
  "circuitWheel",
  "tigerEye",
  "smileyCrown",
  "quadrant",
  "dotMatrix",
  "chevronArrow",
  "gearWedge",
  "orbit",
  "asterField",
  "maze",
  "sunburst",
];
function BrandoCatalog() {
  const cells = React.useMemo(() => {
    return Array.from({ length: 64 }).map((_, i) => ({
      code: `SF//TMK-${String(i + 1).padStart(3, "0")}`,
      glyph: GLYPH_POOL[i % GLYPH_POOL.length],
      variant: (i % 17 === 5
        ? "lime"
        : i % 6 === 3
        ? "fill"
        : "line") as "line" | "fill" | "lime",
    }));
  }, []);
  return (
    <VaultField pack="BRANDO CORP 250 / UNSORTED TRADEMARKS" className="py-[10vh]">
      <SectionHeader
        code="[02 / CATALOG]"
        title="64 TRADEMARK CELLS"
        strap="every mark is addressable · expansion controlled · no decoration without serial"
      />
      <div className="px-6 sm:px-10 mt-12">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-px bg-[var(--cdb-chrome-line)]">
          {cells.map((c) => (
            <VaultTrademark
              key={c.code}
              code={c.code}
              glyph={c.glyph}
              variant={c.variant}
            />
          ))}
        </div>
      </div>
    </VaultField>
  );
}

// ─────────────────────────────────────────────────────────────
// 03 · E0000 BLACK FLAG WALL
// ─────────────────────────────────────────────────────────────
const FLAGS: { word: string; code: string; pattern: FlagPattern; skew: number; accent: "lime" | "paper" | "orange" }[] = [
  { word: "SIGNAL", code: "E0000_004", pattern: "stripesTight", skew: -3, accent: "lime" },
  { word: "FRAME", code: "E0000_011", pattern: "dotsGrid", skew: 2, accent: "lime" },
  { word: "VAULT", code: "E0000_018", pattern: "corrugated", skew: -2, accent: "lime" },
  { word: "CULTURE", code: "E0000_021", pattern: "dotsGradient", skew: 1, accent: "orange" },
  { word: "DIVISION", code: "E0000_025", pattern: "crossHatch", skew: -4, accent: "lime" },
  { word: "TRANSMIT", code: "E0000_028", pattern: "verticalBars", skew: 3, accent: "lime" },
  { word: "RECEIVE", code: "E0000_030", pattern: "diagonal", skew: -1, accent: "paper" },
];
function FlagWall() {
  return (
    <VaultField pack="ENERO.STUDIO / BLACK FLAG PACK" className="py-[8vh]">
      <SectionHeader
        code="[03 / E0000 PACK]"
        title="7 HALFTONE FLAGS"
        strap="industrial substrate turned into a banner · moire is the form"
      />
      <div className="mt-10 space-y-6">
        {FLAGS.map((f) => (
          <VaultFlag key={f.code} {...f} />
        ))}
      </div>
    </VaultField>
  );
}

// ─────────────────────────────────────────────────────────────
// 04 · VANZYST CIRCUITRY — dither grain + procedural biocircuit
// ─────────────────────────────────────────────────────────────
function VanzystCircuitry() {
  return (
    <VaultField
      grain="dither"
      scanlines
      pack="VANZYST · MULTICOLORED / SEED 10441"
      className="py-[10vh] min-h-[110vh]"
    >
      <SectionHeader
        code="[04 / VANZYST BIOCIRCUIT]"
        title="CELLULAR / CYBERNETIC HYBRID"
        strap="42 cells · 60 synapses · pixel-erosion substrate"
      />
      <div className="relative mt-8 mx-6 sm:mx-10 h-[70vh] border border-[var(--cdb-chrome-line)] overflow-hidden">
        <VaultBiocircuit cellCount={42} synapseCount={60} seed={10441} />
        <div className="pointer-events-none absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/70">
          BIO-CIRCUIT FIELD · SUBSTRATE OK
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cdb-lime)]">
          MACH ELEGY
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--cdb-paper)]/55">
          <span>SAMPLE 0.1024s</span>
          <span>DRIFT 0.002</span>
          <span>LOCK ON</span>
          <span>RESOLUTION 1200×800</span>
        </div>
      </div>
      <div className="mt-6 mx-6 sm:mx-10 font-[var(--font-archivo-narrow)] text-[clamp(80px,14vw,220px)] leading-[0.82] font-bold uppercase text-[var(--cdb-paper)]">
        DECEASED
        <br />
        <span className="text-[var(--cdb-lime)]">BUT RUNNING</span>
      </div>
    </VaultField>
  );
}

// ─────────────────────────────────────────────────────────────
// 05 · DIAGRAMS2 SCHEMATIC
// ─────────────────────────────────────────────────────────────
function SchematicPage() {
  return (
    <VaultField grain="strong" pack="DIAGRAMS2 / FIG.44A" className="py-[10vh]">
      <SectionHeader
        code="[05 / SCHEMATIC]"
        title="SIGNAL PATH / READOUT"
        strap="oscillator → amplifier → coupling → rectifier → transducer"
      />
      <div className="relative mt-10 mx-6 sm:mx-10 aspect-[12/7] border border-[var(--cdb-chrome-line)] bg-[var(--cdb-black)]">
        <VaultSchematic />
        <div className="pointer-events-none absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/70">
          FIG. 44A · SF//7 / SCHEMATIC 04 OF 17
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/70">
          SCALE 1:1 · NO COLOUR · CULTURE DIVISION PRESS
        </div>
      </div>
    </VaultField>
  );
}

// ─────────────────────────────────────────────────────────────
// 06 · NCL TYPESCAPE — 3-axis specimen
// ─────────────────────────────────────────────────────────────
function NclTypescape() {
  return (
    <VaultField pack="NCL GRAXEBEOSA · ENXYCLO STUDIO / 4864 GLYPHS" className="py-[10vh]">
      <SectionHeader
        code="[06 / NCL TYPESCAPE]"
        title="TWO-AXIS + PARALLEL SCRIPT"
        strap="horizontal bungee · vertical archivo · fictional helghanese"
      />
      {/* three side-by-side specimens */}
      <div className="mt-10 mx-6 sm:mx-10 grid md:grid-cols-3 gap-px bg-[var(--cdb-chrome-line)]">
        {/* horizontal */}
        <div className="bg-[var(--cdb-black)] p-6 md:p-10 min-h-[50vh] flex flex-col justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cdb-lime)]">
            AXIS · HORIZONTAL · BUNGEE
          </div>
          <div className="font-[var(--font-bungee)] text-[clamp(68px,10vw,140px)] leading-[0.82] uppercase tracking-[-0.02em]">
            EXPANSE
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/55">
            608 GLYPHS · REG 400 · LATIN-EXT
          </div>
        </div>
        {/* vertical */}
        <div className="bg-[var(--cdb-black)] p-6 md:p-10 min-h-[50vh] flex flex-col justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cdb-lime)]">
            AXIS · VERTICAL · ARCHIVO
          </div>
          <div className="font-[var(--font-archivo-narrow)] text-[clamp(100px,14vw,220px)] leading-[0.82] font-bold uppercase text-[var(--cdb-paper)] tracking-[-0.03em]">
            RUPTURE
          </div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/55">
            4 WEIGHTS · 400-700 · CONDENSED GROTESQUE
          </div>
        </div>
        {/* fictional */}
        <div className="bg-[var(--cdb-black)] p-6 md:p-10 min-h-[50vh] flex flex-col justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cdb-lime)]">
            AXIS · FICTIONAL · HELGHANESE
          </div>
          <VaultHelghanese text="SILENT PARALLEL" size={60} letterSpacing={4} />
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/55">
            26 GLYPHS · GEOMETRIC · NO CURVES
          </div>
        </div>
      </div>
      {/* sample-word strip — Warp lineage */}
      <div className="mt-8 mx-6 sm:mx-10 border-t border-[var(--cdb-chrome-line)] pt-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--cdb-paper)]/55 mb-4">
          SAMPLE WORDS / WARP LINEAGE / GENRE TAGGING
        </div>
        <div className="font-[var(--font-bungee)] text-[clamp(22px,3.2vw,46px)] leading-[1.05] uppercase flex flex-wrap gap-x-6 gap-y-1 text-[var(--cdb-paper)]">
          <span>aphex</span>
          <span className="text-[var(--cdb-lime)]">xstacy</span>
          <span>björk</span>
          <span>archive</span>
          <span className="text-[var(--vault-orange)]">sinogram</span>
          <span>autechre</span>
          <span>oval</span>
          <span>pansonic</span>
        </div>
      </div>
      {/* bezier-debug callout */}
      <div className="mt-10 mx-6 sm:mx-10 grid md:grid-cols-[1.2fr_1fr] gap-10 items-center">
        <div className="relative border border-[var(--cdb-chrome-line)] bg-[var(--cdb-black)] p-8 aspect-[5/3] flex items-center justify-center">
          <BezierDebug />
          <div className="pointer-events-none absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--cdb-lime)]">
            BEZIER DEBUG · GLYPH /C/ · 24 CONTROL POINTS
          </div>
        </div>
        <div className="font-mono text-[12px] leading-[1.75] uppercase tracking-[0.08em] text-[var(--cdb-paper)]/85">
          <div className="text-[var(--cdb-lime)] mb-3">DEN® · BEZIER-AS-DESIGN</div>
          construction visible as aesthetic · the typeface shows its anchor
          points · process visible = substrate-as-content · letterforms are
          not rendered output, they are catalogued geometry.
        </div>
      </div>
    </VaultField>
  );
}

// Bezier-debug mockup: a big letter C with visible control points + handles.
function BezierDebug() {
  return (
    <svg viewBox="0 0 400 220" className="w-full h-full">
      <path
        d="M 320 50 Q 260 30 200 30 Q 80 30 80 110 Q 80 190 200 190 Q 260 190 320 170"
        fill="none"
        stroke="var(--cdb-paper)"
        strokeWidth="36"
        strokeLinecap="butt"
      />
      {/* control lines */}
      <g stroke="var(--cdb-lime)" strokeWidth="0.75" fill="none" opacity="0.85">
        <line x1="320" y1="50" x2="260" y2="30" />
        <line x1="260" y1="30" x2="200" y2="30" />
        <line x1="200" y1="30" x2="80" y2="30" />
        <line x1="80" y1="30" x2="80" y2="110" />
        <line x1="80" y1="110" x2="80" y2="190" />
        <line x1="80" y1="190" x2="200" y2="190" />
        <line x1="200" y1="190" x2="260" y2="190" />
        <line x1="260" y1="190" x2="320" y2="170" />
      </g>
      {/* anchor points */}
      {[
        [320, 50],
        [260, 30],
        [200, 30],
        [80, 30],
        [80, 110],
        [80, 190],
        [200, 190],
        [260, 190],
        [320, 170],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect
            x={x - 3}
            y={y - 3}
            width="6"
            height="6"
            fill="var(--cdb-lime)"
            stroke="var(--cdb-black)"
            strokeWidth="1"
          />
          <text
            x={x + 6}
            y={y + 10}
            fontFamily="var(--font-jetbrains), monospace"
            fontSize="7"
            fill="var(--cdb-lime)"
          >
            {String(i).padStart(2, "0")}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// 07 · STAMP CIRCULATION — 40-stamp manifesto wall
// ─────────────────────────────────────────────────────────────
const STAMPS: { t: string; c: string; tr: VaultStampTreatment; r?: number }[] = [
  { t: "ORGULLECIDA", c: "STM-001", tr: "ink", r: -3 },
  { t: "NEVER COME BACK", c: "STM-002", tr: "outline", r: 2 },
  { t: "BERSERKER!", c: "STM-003", tr: "smeared", r: -1 },
  { t: "DECODED", c: "STM-004", tr: "double", r: 4 },
  { t: "NEVERMORE", c: "STM-005", tr: "faded", r: -2 },
  { t: "COUNTERPRODUCTIVE MMXXVI", c: "STM-006", tr: "ink", r: 1 },
  { t: "FRAME LOCKED", c: "STM-007", tr: "rotated" },
  { t: "SIGNAL VERIFIED", c: "STM-008", tr: "ink", r: 3 },
  { t: "INTERRUPT", c: "STM-009", tr: "strike" },
  { t: "MACH ELEGY", c: "STM-010", tr: "inverted", r: -2 },
  { t: "LIMINAL CORP", c: "STM-011", tr: "ink", r: 3 },
  { t: "DECLASSIFIED", c: "STM-012", tr: "faded", r: -1 },
  { t: "CULTURE DIVISION", c: "STM-013", tr: "ink", r: 2 },
  { t: "PARALLEL WORLD", c: "STM-014", tr: "outline", r: -3 },
  { t: "LONG LIVE THE NOISE", c: "STM-015", tr: "smeared" },
  { t: "END HORIZON", c: "STM-016", tr: "ink" },
  { t: "SIGNAL COLLAPSE", c: "STM-017", tr: "strike" },
  { t: "FRAME ABSORBED", c: "STM-018", tr: "ink", r: 5 },
  { t: "CULTURE SEIZED", c: "STM-019", tr: "inverted" },
  { t: "DIVISION WON", c: "STM-020", tr: "ink", r: -4 },
  { t: "STATIC HOLDS", c: "STM-021", tr: "faded" },
  { t: "NO FUTURE PHASE", c: "STM-022", tr: "ink" },
  { t: "BRUTALIST HEART", c: "STM-023", tr: "outline", r: 2 },
  { t: "POST-CORPORATE", c: "STM-024", tr: "double" },
  { t: "DEATH TO UX", c: "STM-025", tr: "smeared", r: -1 },
  { t: "CATALOG IS BRAND", c: "STM-026", tr: "ink" },
  { t: "SIGNAL / FRAME", c: "STM-027", tr: "inverted", r: 1 },
  { t: "BEZIERS VISIBLE", c: "STM-028", tr: "outline" },
  { t: "GRAIN REQUIRED", c: "STM-029", tr: "faded" },
  { t: "REJECT LIQUID GLASS", c: "STM-030", tr: "strike", r: -2 },
  { t: "ZERO RADIUS", c: "STM-031", tr: "ink", r: 4 },
  { t: "ONE POP COLOR", c: "STM-032", tr: "ink" },
  { t: "KLOROFORM / LIVE", c: "STM-033", tr: "inverted", r: -3 },
  { t: "E0000 / REPEAT", c: "STM-034", tr: "outline" },
  { t: "HELGHANESE PASSKEY", c: "STM-035", tr: "faded" },
  { t: "IKEDA TRANSMISSION", c: "STM-036", tr: "smeared" },
  { t: "TDR / DU / LINEAGE", c: "STM-037", tr: "ink", r: 2 },
  { t: "SYSTEM WITHOUT SOFTNESS", c: "STM-038", tr: "ink" },
  { t: "BURN THE SPLASH", c: "STM-039", tr: "strike", r: -1 },
  { t: "END OF TRANSMISSION", c: "STM-040", tr: "rotated" },
];
function StampCirculation() {
  return (
    <VaultField pack="STAMP CIRCULATION / 40 VARIANTS / 8 TREATMENTS" className="py-[12vh]">
      <SectionHeader
        code="[07 / STAMP WALL]"
        title="MARKS IN CIRCULATION"
        strap="physical-ink register · 8 treatments · varying registration error"
      />
      <div className="mt-10 mx-6 sm:mx-10 flex flex-wrap gap-2 sm:gap-3 items-start">
        {STAMPS.map((s) => (
          <VaultStamp
            key={s.c}
            text={s.t}
            code={s.c}
            treatment={s.tr}
            rotate={s.r ?? 0}
          />
        ))}
      </div>
    </VaultField>
  );
}

// ─────────────────────────────────────────────────────────────
// 08 · HELGHANESE + IKEDA EXIT
// ─────────────────────────────────────────────────────────────
function HelghaneseExit() {
  return (
    <VaultField
      bleed="viewport"
      grain="strong"
      scanlines
      pack="IKEDA · DATA FIELD / HELGHANESE EXIT"
      className="min-h-screen"
    >
      <VaultChrome
        code="SF//VLT-008 · END OF SIGNAL"
        mode="TRANSMISSION CLOSED"
        reticle={false}
        waveform
        rangeFinder={false}
        brackets
        ticks
      />
      {/* background data field */}
      <div className="absolute inset-[12vh_6vw] opacity-75">
        <VaultDataField columns={10} rows={36} />
      </div>
      {/* center content over the data */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 text-center pointer-events-none">
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[var(--cdb-lime)]">
          $ CULTURE-DIVISION --SIGNALFRAME END
        </div>
        <div className="font-[var(--font-bungee)] text-[clamp(48px,9.5vw,160px)] leading-[0.9] uppercase">
          END OF
          <br />
          TRANSMISSION
        </div>
        <VaultHelghanese text="SILENCE IS A SIGNAL" size={36} letterSpacing={3} />
        <div className="flex gap-3 flex-wrap justify-center">
          <VaultStamp text="SIGNAL CLOSED" code="STM-041" treatment="ink" />
          <VaultStamp text="FRAME HELD" code="STM-042" treatment="outline" />
          <VaultStamp text="CATALOG PRESERVED" code="STM-043" treatment="inverted" rotate={-2} />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--cdb-paper)]/55 max-w-[640px] leading-[1.75]">
          the catalog remains. the signal does not. the frame is absorbed.
          every transmission ends in silence — the silence is the proof that
          the transmission happened at all.
        </div>
      </div>
    </VaultField>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared: section header
// ─────────────────────────────────────────────────────────────
function SectionHeader({
  code,
  title,
  strap,
}: {
  code: string;
  title: string;
  strap: string;
}) {
  return (
    <div className="relative px-6 sm:px-10 flex items-end justify-between gap-6 flex-wrap">
      <div>
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] text-[var(--cdb-paper)]/55 mb-3">
          {code}
        </div>
        <h2 className="font-[var(--font-bungee)] text-[clamp(36px,6.5vw,96px)] leading-[0.95] uppercase">
          {title}
        </h2>
      </div>
      <div className="max-w-[380px] font-mono text-[11px] sm:text-xs leading-[1.65] uppercase tracking-[0.08em] text-[var(--cdb-paper)]/70">
        <div className="border-t border-[var(--cdb-chrome-line)] pt-3">
          {strap}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Persistent page-edge rail — runs along the right side the entire
// time, shows section index + current position. Like a movie-film
// edge strip.
// ─────────────────────────────────────────────────────────────
function PageRail() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 bottom-0 w-[22px] z-[60] flex flex-col border-l border-[var(--vault-chrome-soft)]"
    >
      {Array.from({ length: 64 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 border-b border-[var(--vault-chrome-soft)] flex items-center justify-center"
        >
          {i % 8 === 0 && (
            <div className="font-mono text-[7px] uppercase tracking-[0.08em] text-[var(--cdb-paper)]/55 rotate-90 whitespace-nowrap">
              SF//{String(i).padStart(3, "0")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
