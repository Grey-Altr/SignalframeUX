import type { Metadata } from "next";
import {
  CdBField,
  CdBCornerChrome,
  CdBStamp,
  CdBMark,
  CdBBanner,
  CdBPointcloud,
} from "@/components/cdb";

/*
 * cdB aesthetic-deep-dive home.
 * Seven-section single-scroll, pure vault grammar. No reuse of
 * components/sf/* or blocks/*. Companion artifact to the two
 * digests at .planning/aesthetic/.
 */

export const metadata: Metadata = {
  title: "SIGNALFRAME//UX — cdB",
  description:
    "Culture Division · cdB aesthetic deep-dive build · pure peer-grammar reset.",
};

export default function HomePage() {
  return (
    <main className="bg-[var(--cdb-black)] text-[var(--cdb-paper)]">
      <ColdOpen />
      <Catalog />
      <MoireBanners />
      <Schematic />
      <StampField />
      <TypeSpecimen />
      <TerminalClose />
    </main>
  );
}

// ────────────────────────────────────────────────────────────────
// 01 · COLD OPEN
// ────────────────────────────────────────────────────────────────
function ColdOpen() {
  return (
    <CdBField bleed="viewport" className="min-h-screen">
      <CdBCornerChrome
        topLeft="CULTURE DIVISION · SIGNALFRAME SYSTEM"
        topRight={"CDBRANCH/EXT · 2026.04.18 · v1.0"}
        bottomLeft="SF//FRM-001 · PAGE 01/07"
        bottomRight="signalframe.culturedivision.com"
        geoCoord="-33.9249°S · 18.4241°E"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <CdBPointcloud
          morphology="ring"
          pointCount={22000}
          className="w-full h-full max-w-[78vw] max-h-[78vh]"
        />
      </div>
      {/* decoded stamp floats top-center */}
      <div className="absolute top-[14vh] left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        <CdBStamp text="DECODED" code="SF//STM-004" rotate={-1.5} />
        <CdBStamp text="CLASS I" variant="outline" rotate={2} />
      </div>
      {/* hero wordmark */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-screen pb-[14vh] gap-4">
        <div className="font-[var(--font-bungee)] text-[clamp(48px,11vw,180px)] leading-[0.9] text-[var(--cdb-paper)] text-center tracking-[-0.02em]">
          SIGNALFRAME
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-paper)]/70">
          <span className="inline-block w-10 h-px bg-[var(--cdb-lime)]" />
          <span>DETERMINISTIC INTERFACE / GENERATIVE EXPRESSION</span>
          <span className="inline-block w-10 h-px bg-[var(--cdb-lime)]" />
        </div>
        <div className="font-[var(--font-archivo-narrow)] text-[var(--cdb-lime)] text-[clamp(12px,1.2vw,16px)] uppercase tracking-[0.4em] font-bold">
          A CULTURE DIVISION PROTOCOL
        </div>
      </div>
    </CdBField>
  );
}

// ────────────────────────────────────────────────────────────────
// 02 · CATALOG — the catalog IS the brand
// ────────────────────────────────────────────────────────────────
type MarkSpec = {
  code: string;
  label: string;
  form: React.ReactNode;
  accent?: boolean;
};

const MARK_SPECS: MarkSpec[] = [
  { code: "SF//FRM-001", label: "FORM / CROSS", form: <FormCross /> },
  { code: "SF//FRM-002", label: "FORM / RING", form: <FormRing /> },
  { code: "SF//FRM-003", label: "FORM / BARS", form: <FormBars /> },
  { code: "SF//FRM-004", label: "FORM / HEX", form: <FormHex /> },
  {
    code: "SF//FRM-005",
    label: "FORM / TARGET",
    form: <FormTarget />,
    accent: true,
  },
  { code: "SF//FRM-006", label: "FORM / GRID", form: <FormDotGrid /> },
  { code: "SF//GEN-007", label: "GEN / HALFTONE", form: <FormHalftone /> },
  { code: "SF//GEN-008", label: "GEN / TRIANGLE", form: <FormTriangle /> },
  { code: "SF//GEN-009", label: "GEN / NOTCH", form: <FormNotch /> },
  { code: "SF//GEN-010", label: "GEN / ASTERISK", form: <FormAsterisk /> },
  {
    code: "SF//GEN-011",
    label: "GEN / ARROW",
    form: <FormArrow />,
  },
  { code: "SF//GEN-012", label: "GEN / S-CURVE", form: <FormCurve /> },
  { code: "SF//SYS-013", label: "SYS / BRACKET", form: <FormBracket /> },
  { code: "SF//SYS-014", label: "SYS / DIAGONAL", form: <FormDiagonal /> },
  {
    code: "SF//SYS-015",
    label: "SYS / NESTED",
    form: <FormNested />,
    accent: true,
  },
  { code: "SF//SYS-016", label: "SYS / CIRCUIT", form: <FormCircuit /> },
  { code: "SF//STM-017", label: "STM / PULSE", form: <FormPulse /> },
  { code: "SF//STM-018", label: "STM / STAR", form: <FormStar /> },
  { code: "SF//STM-019", label: "STM / LBRACKET", form: <FormLBracket /> },
  { code: "SF//STM-020", label: "STM / DISC", form: <FormDisc /> },
  { code: "SF//EXP-021", label: "EXP / RAYS", form: <FormRays /> },
  { code: "SF//EXP-022", label: "EXP / STRIPE", form: <FormStripe /> },
  { code: "SF//EXP-023", label: "EXP / COMB", form: <FormComb /> },
  { code: "SF//EXP-024", label: "EXP / FIELD", form: <FormField /> },
];

function Catalog() {
  return (
    <CdBField className="py-[12vh] sm:py-[18vh] min-h-screen">
      {/* section chrome */}
      <div className="relative px-6 sm:px-12 mb-[6vh] flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-paper)]/60 mb-3">
            [02//CATALOG]
          </div>
          <h2 className="font-[var(--font-bungee)] text-[clamp(36px,6.5vw,96px)] leading-[0.95] uppercase">
            24 SERIAL
            <br />
            MARKS
          </h2>
        </div>
        <div className="max-w-[380px] font-mono text-[11px] sm:text-xs leading-[1.65] uppercase tracking-[var(--cdb-tracking-code)] text-[var(--cdb-paper)]/70">
          <div className="border-t border-[var(--cdb-chrome-line)] pt-3">
            the catalog IS the brand · every form is addressable by code ·
            expansion controlled · no decoration without serial
          </div>
        </div>
      </div>
      <div className="px-6 sm:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-px bg-[var(--cdb-chrome-line)]">
          {MARK_SPECS.map((m) => (
            <CdBMark
              key={m.code}
              code={m.code}
              label={m.label}
              accent={m.accent}
            >
              {m.form}
            </CdBMark>
          ))}
        </div>
      </div>
    </CdBField>
  );
}

// ────────────────────────────────────────────────────────────────
// 03 · MOIRE BANNERS
// ────────────────────────────────────────────────────────────────
function MoireBanners() {
  return (
    <CdBField className="py-[8vh] space-y-8 sm:space-y-14 overflow-visible">
      <div className="px-6 sm:px-12">
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-paper)]/60">
          [03//BANNERS · E0000 PACK]
        </div>
      </div>
      <CdBBanner word="SIGNALFRAME" code="E0000_012 / CORRUGATED" skew={-4} />
      <CdBBanner word="CULTURE DIVISION" code="E0000_021 / PEELING" skew={2} halftoneStep={5} />
    </CdBField>
  );
}

// ────────────────────────────────────────────────────────────────
// 04 · TECHNICAL SCHEMATIC
// ────────────────────────────────────────────────────────────────
function Schematic() {
  return (
    <CdBField className="py-[14vh] min-h-screen">
      <div className="px-6 sm:px-12 grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-start">
        <div>
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-paper)]/60 mb-3">
            [04//SCHEMATIC · PROBE 0441]
          </div>
          <h2 className="font-[var(--font-bungee)] text-[clamp(36px,6vw,92px)] leading-[0.95] uppercase mb-6">
            DUAL-LAYER
            <br />
            READOUT
          </h2>
          <div className="relative w-full aspect-[4/3] border border-[var(--cdb-chrome-line)] bg-[var(--cdb-black)]">
            <DiagramRead />
            <div className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--cdb-paper)]/70">
              FIG. 01 · FRAME ↔ SIGNAL TRANSFER
            </div>
            <div className="absolute bottom-2 right-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--cdb-paper)]/70">
              SCALE 1:1 · NO COLOUR
            </div>
          </div>
        </div>
        <div className="space-y-6 font-mono text-[12px] leading-[1.75] text-[var(--cdb-paper)]/85 uppercase tracking-[var(--cdb-tracking-code)]">
          <div className="border-b border-[var(--cdb-chrome-line)] pb-4">
            <div className="text-[var(--cdb-lime)] mb-1">FRAME LAYER /</div>
            deterministic · legible · semantic · consistent · the structural
            substrate through which SIGNAL passes.
          </div>
          <div className="border-b border-[var(--cdb-chrome-line)] pb-4">
            <div className="text-[var(--cdb-lime)] mb-1">SIGNAL LAYER /</div>
            generative · parametric · animated · data-driven · expression
            constrained by frame; never allowed to interfere with utility.
          </div>
          <div className="border-b border-[var(--cdb-chrome-line)] pb-4">
            <div className="text-[var(--cdb-lime)] mb-1">TRANSFER /</div>
            signal-intensity scalar [0.000-1.000] drives parametric shader
            and motion. frame responds via token not override.
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Stat label="DIMENSIONS" v="11" />
            <Stat label="TOKENS" v="184" />
            <Stat label="MORPHOLOGIES" v="4" />
            <Stat label="ACCENT" v="1" />
          </div>
        </div>
      </div>
    </CdBField>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="border border-[var(--cdb-chrome-line)] p-3">
      <div className="text-[10px] opacity-60 mb-1">{label}</div>
      <div className="font-[var(--font-bungee)] text-[28px] leading-none text-[var(--cdb-paper)]">
        {v}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 05 · STAMP FIELD
// ────────────────────────────────────────────────────────────────
const STAMPS = [
  { t: "ORGULLECIDA", c: "SF//STM-001", r: -3 },
  { t: "NEVER COME BACK", c: "SF//STM-002", r: 2, v: "outline" as const },
  { t: "BERSERKER!", c: "SF//STM-003", r: -1 },
  { t: "DECODED", c: "SF//STM-004", r: 4, v: "outline" as const },
  { t: "NEVERMORE", c: "SF//STM-005", r: -2 },
  { t: "COUNTERPRODUCTIVE MMXXVI", c: "SF//STM-006", r: 1 },
  { t: "FRAME LOCKED", c: "SF//STM-007", r: -4, v: "outline" as const },
  { t: "SIGNAL VERIFIED", c: "SF//STM-008", r: 3 },
  { t: "INTERRUPT", c: "SF//STM-009", r: 0 },
  { t: "MACH ELEGY", c: "SF//STM-010", r: -2, v: "outline" as const },
  { t: "LIMINAL CORP", c: "SF//STM-011", r: 3 },
  { t: "DECLASSIFIED", c: "SF//STM-012", r: -1 },
  { t: "CULTURE DIVISION", c: "SF//STM-013", r: 2 },
  { t: "PARALLEL WORLD", c: "SF//STM-014", r: -3, v: "outline" as const },
];

function StampField() {
  return (
    <CdBField className="py-[14vh] min-h-screen">
      <div className="px-6 sm:px-12 mb-[6vh]">
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-paper)]/60 mb-3">
          [05//STAMP FIELD · 14 OF 24]
        </div>
        <h2 className="font-[var(--font-bungee)] text-[clamp(32px,5.4vw,84px)] leading-[0.95] uppercase">
          MARKS IN
          <br />
          CIRCULATION
        </h2>
      </div>
      <div className="px-6 sm:px-12 flex flex-wrap gap-3 sm:gap-4">
        {STAMPS.map((s) => (
          <CdBStamp
            key={s.c}
            text={s.t}
            code={s.c}
            rotate={s.r}
            variant={s.v ?? "fill"}
          />
        ))}
      </div>
    </CdBField>
  );
}

// ────────────────────────────────────────────────────────────────
// 06 · TYPE SPECIMEN
// ────────────────────────────────────────────────────────────────
function TypeSpecimen() {
  return (
    <CdBField className="py-[14vh] min-h-screen">
      <div className="px-6 sm:px-12 mb-[8vh] flex justify-between items-end gap-6 flex-wrap">
        <div>
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-paper)]/60 mb-3">
            [06//SPECIMEN · TWO-AXIS]
          </div>
          <h2 className="font-[var(--font-bungee)] text-[clamp(32px,5.4vw,84px)] leading-[0.95] uppercase">
            TYPE
            <br />
            SYSTEM
          </h2>
        </div>
        <div className="max-w-[300px] font-mono text-[11px] uppercase tracking-[var(--cdb-tracking-code)] text-[var(--cdb-paper)]/70 leading-[1.7]">
          two opposite distortions — extreme horizontal (Bungee) / extreme
          vertical (Archivo Narrow). never combined on one surface.
        </div>
      </div>
      <div className="px-6 sm:px-12 grid md:grid-cols-2 gap-px bg-[var(--cdb-chrome-line)]">
        <div className="bg-[var(--cdb-black)] p-6 sm:p-10 min-h-[50vh] flex flex-col justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-lime)]">
            AXIS · HORIZONTAL · BUNGEE
          </div>
          <div className="font-[var(--font-bungee)] text-[clamp(88px,14vw,220px)] leading-[0.8] text-[var(--cdb-paper)] uppercase tracking-[-0.02em]">
            EXPANSE
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[var(--cdb-tracking-code)] text-[var(--cdb-paper)]/60 flex justify-between">
            <span>608 glyphs</span>
            <span>regular 400</span>
            <span>latin-ext</span>
          </div>
        </div>
        <div className="bg-[var(--cdb-black)] p-6 sm:p-10 min-h-[50vh] flex flex-col justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-lime)]">
            AXIS · VERTICAL · ARCHIVO NARROW
          </div>
          <div className="font-[var(--font-archivo-narrow)] text-[clamp(120px,18vw,280px)] leading-[0.82] text-[var(--cdb-paper)] uppercase font-bold tracking-[-0.03em]">
            RUPTURE
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[var(--cdb-tracking-code)] text-[var(--cdb-paper)]/60 flex justify-between">
            <span>4 weights</span>
            <span>400–700</span>
            <span>condensed grotesque</span>
          </div>
        </div>
      </div>
    </CdBField>
  );
}

// ────────────────────────────────────────────────────────────────
// 07 · TERMINAL CLOSE
// ────────────────────────────────────────────────────────────────
function TerminalClose() {
  return (
    <CdBField bleed="viewport" className="min-h-screen">
      <CdBCornerChrome
        topLeft="TRANSMISSION · SIGNALFRAME//UX"
        topRight="TERMINAL OPEN · 2026.04.18"
        bottomLeft="SF//FRM-007 · PAGE 07/07"
        bottomRight="END OF SYSTEM"
        geoCoord="SIGNAL CLOSED"
      />
      {/* background data-field */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent 0 3px, rgba(250,250,250,0.04) 3px 4px)`,
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 text-center">
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-lime)]">
          $ CULTURE-DIVISION --SIGNALFRAME INIT
        </div>
        <div className="font-[var(--font-bungee)] text-[clamp(44px,9vw,156px)] leading-[0.9] uppercase max-w-[1200px]">
          END OF
          <br />
          TRANSMISSION
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <CdBStamp text="SIGNAL CLOSED" code="SF//STM-024" />
          <CdBStamp text="FRAME HELD" variant="outline" code="SF//STM-025" />
        </div>
        <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[var(--cdb-tracking-chrome)] text-[var(--cdb-paper)]/60 max-w-[560px] leading-[1.7]">
          the last thing a user sees should feel like a terminal session that
          ended — not an invitation. the catalog remains. the signal does not.
        </div>
      </div>
    </CdBField>
  );
}

// ────────────────────────────────────────────────────────────────
// Mark form primitives — simple SVG glyphs for catalog cells.
// Each fills 64×64 viewBox, stroke lime or paper, no rounded joins.
// ────────────────────────────────────────────────────────────────
const svgBase =
  "w-[58%] h-[58%] stroke-[var(--cdb-paper)] fill-none stroke-[2.5]";
const svgAccent =
  "w-[58%] h-[58%] stroke-[var(--cdb-lime-foreground)] fill-none stroke-[2.5]";

function FormCross() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <line x1="8" y1="32" x2="56" y2="32" />
      <line x1="32" y1="8" x2="32" y2="56" />
    </svg>
  );
}
function FormRing() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <circle cx="32" cy="32" r="22" />
      <circle cx="32" cy="32" r="3" fill="var(--cdb-paper)" />
    </svg>
  );
}
function FormBars() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <line x1="14" y1="18" x2="50" y2="18" />
      <line x1="14" y1="32" x2="50" y2="32" />
      <line x1="14" y1="46" x2="50" y2="46" />
    </svg>
  );
}
function FormHex() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <polygon points="32,6 56,20 56,44 32,58 8,44 8,20" />
    </svg>
  );
}
function FormTarget() {
  return (
    <svg viewBox="0 0 64 64" className={svgAccent}>
      <circle cx="32" cy="32" r="24" />
      <circle cx="32" cy="32" r="15" />
      <circle cx="32" cy="32" r="6" fill="var(--cdb-lime-foreground)" />
      <line x1="0" y1="32" x2="64" y2="32" />
      <line x1="32" y1="0" x2="32" y2="64" />
    </svg>
  );
}
function FormDotGrid() {
  return (
    <svg viewBox="0 0 64 64" className="w-[58%] h-[58%]">
      {[16, 32, 48].flatMap((y) =>
        [16, 32, 48].map((x) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={3}
            fill="var(--cdb-paper)"
          />
        ))
      )}
    </svg>
  );
}
function FormHalftone() {
  return (
    <svg viewBox="0 0 64 64" className="w-[58%] h-[58%]">
      {[0, 8, 16, 24, 32, 40, 48, 56].map((y) =>
        [0, 8, 16, 24, 32, 40, 48, 56].map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x + 1}
            y={y + 1}
            width={Math.max(1, (64 - x) / 14)}
            height={Math.max(1, (64 - x) / 14)}
            fill="var(--cdb-paper)"
          />
        ))
      )}
    </svg>
  );
}
function FormTriangle() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <polygon points="32,8 56,52 8,52" />
    </svg>
  );
}
function FormNotch() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <path d="M8 8 H44 L56 20 V56 H8 Z" />
    </svg>
  );
}
function FormAsterisk() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <line x1="32" y1="8" x2="32" y2="56" />
      <line x1="11" y1="20" x2="53" y2="44" />
      <line x1="53" y1="20" x2="11" y2="44" />
      <line x1="8" y1="32" x2="56" y2="32" />
    </svg>
  );
}
function FormArrow() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <line x1="10" y1="32" x2="54" y2="32" />
      <polyline points="38,16 54,32 38,48" />
    </svg>
  );
}
function FormCurve() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <path d="M8 48 C 20 48, 20 16, 32 16 S 44 48, 56 48" />
    </svg>
  );
}
function FormBracket() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <polyline points="18,8 8,8 8,56 18,56" />
      <polyline points="46,8 56,8 56,56 46,56" />
    </svg>
  );
}
function FormDiagonal() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <line x1="8" y1="56" x2="56" y2="8" />
      <line x1="8" y1="8" x2="24" y2="8" />
      <line x1="8" y1="8" x2="8" y2="24" />
      <line x1="56" y1="56" x2="40" y2="56" />
      <line x1="56" y1="56" x2="56" y2="40" />
    </svg>
  );
}
function FormNested() {
  return (
    <svg viewBox="0 0 64 64" className={svgAccent}>
      <rect x="8" y="8" width="48" height="48" />
      <rect x="18" y="18" width="28" height="28" />
      <rect x="28" y="28" width="8" height="8" fill="var(--cdb-lime-foreground)" />
    </svg>
  );
}
function FormCircuit() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <line x1="8" y1="32" x2="22" y2="32" />
      <rect x="22" y="26" width="20" height="12" />
      <line x1="42" y1="32" x2="56" y2="32" />
      <circle cx="32" cy="18" r="3" fill="var(--cdb-paper)" />
      <line x1="32" y1="21" x2="32" y2="26" />
    </svg>
  );
}
function FormPulse() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <polyline points="4,40 16,40 22,20 30,52 38,40 50,40 60,40" />
    </svg>
  );
}
function FormStar() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <polygon points="32,6 38,26 58,26 42,38 48,58 32,46 16,58 22,38 6,26 26,26" />
    </svg>
  );
}
function FormLBracket() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <polyline points="8,8 8,56 56,56" />
      <line x1="8" y1="32" x2="32" y2="32" />
      <line x1="32" y1="56" x2="32" y2="32" />
    </svg>
  );
}
function FormDisc() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <circle cx="32" cy="32" r="22" fill="var(--cdb-paper)" />
      <circle cx="32" cy="32" r="8" fill="var(--cdb-black)" />
    </svg>
  );
}
function FormRays() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <circle cx="32" cy="32" r="5" fill="var(--cdb-paper)" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x2 = 32 + Math.cos(a) * 26;
        const y2 = 32 + Math.sin(a) * 26;
        return (
          <line key={i} x1={32 + Math.cos(a) * 10} y1={32 + Math.sin(a) * 10} x2={x2} y2={y2} />
        );
      })}
    </svg>
  );
}
function FormStripe() {
  return (
    <svg viewBox="0 0 64 64" className="w-[58%] h-[58%]">
      {[6, 14, 22, 30, 38, 46, 54].map((x) => (
        <line
          key={x}
          x1={x}
          y1="8"
          x2={x + 12}
          y2="56"
          stroke="var(--cdb-paper)"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
function FormComb() {
  return (
    <svg viewBox="0 0 64 64" className={svgBase}>
      <line x1="8" y1="20" x2="56" y2="20" />
      {[10, 18, 26, 34, 42, 50].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2={Math.random() > 0.5 ? 44 : 52} />
      ))}
    </svg>
  );
}
function FormField() {
  return (
    <svg viewBox="0 0 64 64" className="w-[58%] h-[58%]">
      <rect width="64" height="64" fill="var(--cdb-paper)" />
      <rect x="10" y="10" width="44" height="44" fill="var(--cdb-black)" />
      <rect x="20" y="20" width="24" height="24" fill="var(--cdb-paper)" />
    </svg>
  );
}

// ── Schematic diagram ──────────────────────────────────────────
function DiagramRead() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full stroke-[var(--cdb-paper)] fill-none stroke-[1.25]"
    >
      {/* frame rail */}
      <line x1="30" y1="80" x2="370" y2="80" />
      <line x1="30" y1="220" x2="370" y2="220" />
      {/* frame label */}
      <text
        x="30"
        y="70"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="9"
        fill="var(--cdb-paper)"
        letterSpacing="1"
      >
        FRAME
      </text>
      <text
        x="30"
        y="240"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="9"
        fill="var(--cdb-paper)"
        letterSpacing="1"
      >
        SIGNAL
      </text>
      {/* coupling — resistor */}
      <line x1="100" y1="80" x2="100" y2="110" />
      <polyline points="100,110 90,118 110,126 90,134 110,142 90,150 100,158" />
      <line x1="100" y1="158" x2="100" y2="220" />
      {/* coupling — capacitor */}
      <line x1="200" y1="80" x2="200" y2="130" />
      <line x1="188" y1="130" x2="212" y2="130" />
      <line x1="188" y1="140" x2="212" y2="140" />
      <line x1="200" y1="140" x2="200" y2="220" />
      {/* coupling — transformer */}
      <line x1="300" y1="80" x2="300" y2="110" />
      <path d="M290 110 Q 300 118 310 110 Q 300 118 290 110 M290 125 Q 300 133 310 125 Q 300 133 290 125 M290 140 Q 300 148 310 140 Q 300 148 290 140" />
      <line x1="300" y1="155" x2="300" y2="220" />
      {/* arrows — signal intensity scalar */}
      <line x1="360" y1="150" x2="390" y2="150" />
      <polyline points="382,144 390,150 382,156" />
      <text
        x="354"
        y="140"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="8"
        fill="var(--cdb-lime)"
      >
        σ[0→1]
      </text>
      {/* terminal dots */}
      {[30, 100, 200, 300, 370].map((x) => (
        <g key={x}>
          <circle cx={x} cy="80" r="3" fill="var(--cdb-paper)" />
          <circle cx={x} cy="220" r="3" fill="var(--cdb-paper)" />
        </g>
      ))}
    </svg>
  );
}
