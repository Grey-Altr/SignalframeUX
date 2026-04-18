"use client";
import React from "react";
import {
  VaultSchematic,
  VaultDataField,
  VaultHelghanese,
  type VaultTrademarkGlyph,
} from "@/components/vault";

/*
 * V5 // FIELD RECORDING
 *
 * Branch cdb-v2-broadcast. Original recomposition of the cdB reference
 * grammar — no corner chrome, no fixed HUD, no bootloader, no section
 * boundaries. The page is a single continuous black field through which
 * seven movements emerge and dissolve.
 *
 * Grammar borrowed — never quoted:
 *   KLOROFORM pointcloud morphology       (movements 1, 7)
 *   Black Flag corrugated halftone        (movement 4)
 *   Diagrams2 technical schematic         (movement 5)
 *   Brando Corp 250 Y2K trademark marks   (movement 6, uncased)
 *   Ikeda data-field telemetry            (movement 7)
 *   NCL / Segapunk type-axis extremes     (movements 2, 3, 4)
 *   Helghanese parallel alphabet          (movement 7, final glyph)
 *
 * Lime used as the one pop color. Everything else is paper on black,
 * substrate-honest, industrial edges. Zero border-radius, zero chrome
 * boxes, zero framing rectangles. Type and form do the structural work
 * that chrome would otherwise do.
 */

export default function HomePage() {
  return (
    <main className="relative bg-[var(--cdb-black)] text-[var(--cdb-paper)] overflow-x-clip">
      <PageGrain />
      <Coordinate />
      <Wordmark />
      <CatalogRiver />
      <Static />
      <Schematic />
      <MarkStorm />
      <Dissolve />
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// Page-level grain — applied once, not per-movement. Substrate
// continuity is part of what makes the page feel like one recording.
// ─────────────────────────────────────────────────────────────
function PageGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 mix-blend-screen z-[1]"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)' opacity='1'/></svg>")`,
        opacity: 0.05,
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
// Shared — scroll progress within an element (0 at entry, 1 at exit)
// ─────────────────────────────────────────────────────────────
function useElementProgress(
  ref: React.RefObject<HTMLElement | null>
): number {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const advanced = vh - rect.top;
      setP(Math.max(0, Math.min(1, advanced / total)));
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
}

// ─────────────────────────────────────────────────────────────
// M1 · COORDINATE
// The recording opens with one mathematical distribution on a black
// field. No logo, no nav, no masthead. The only declarative element
// is a single coordinate line — the parallel-world anchor.
// ─────────────────────────────────────────────────────────────
function Coordinate() {
  const ref = React.useRef<HTMLElement | null>(null);
  const p = useElementProgress(ref);
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <ParticleField
          progress={p}
          pointCount={2600}
          mode="ring-to-nebula"
          className="w-[min(96vw,1100px)] h-[min(88vh,900px)]"
        />
      </div>
      <TransmissionClock />
    </section>
  );
}

// Live-ticking timecode; formatted as "+HH:MM:SS" from page load.
// Kept mono, tiny, bottom-center — barely there.
function TransmissionClock() {
  const [s, setS] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setS((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none">
      <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-[var(--cdb-paper)]/60 text-center leading-[1.8]">
        <div>
          7°33&apos;22&quot;S · 112°45&apos;10&quot;E
        </div>
        <div>
          TRANSMISSION +{pad(h)}:{pad(m)}:{pad(sec)} · CULTURE DIVISION / PARALLEL STATION SF//07
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// M2 · WORDMARK
// A viewport-filling slab. Vertical-compressed grotesque with
// tight leading, negative letter-spacing, paper on black. The word
// is the composition. No label, no subtitle, nothing else.
// ─────────────────────────────────────────────────────────────
function Wordmark() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <h1
        className="font-[var(--font-archivo-narrow)] font-black uppercase text-[var(--cdb-paper)] text-center leading-[0.82] tracking-[-0.045em]"
        style={{ fontSize: "clamp(120px, 26vw, 520px)" }}
      >
        SIGNAL<br />FRAME
      </h1>
      {/* single marginal line — the scale indicator */}
      <div className="absolute bottom-8 right-6 sm:right-10 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/45">
        SPECIMEN · 600 GLYPHS · REG 900 · SF//TYP-004
      </div>
      <div className="absolute top-8 left-6 sm:left-10 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/45">
        AXIS · VERTICAL COMPRESSION
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// M3 · CATALOG RIVER
// Three streams of serialized codes rising as the page descends.
// No borders, no cells, no container boxes — just columns of
// monospaced serial numbers with a loose vertical parallax. This
// is the catalog-is-brand thesis rendered as pure flow.
// ─────────────────────────────────────────────────────────────
function CatalogRiver() {
  const ref = React.useRef<HTMLElement | null>(null);
  const p = useElementProgress(ref);
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* anchor text — tiny, margin-left */}
        <div className="absolute top-10 left-6 sm:left-10 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/55 leading-[1.8] max-w-[260px]">
          <div>INDEX · ACTIVE SERIES</div>
          <div className="text-[var(--cdb-paper)]/30 mt-1">
            four catalogs · forty-two thousand entries
          </div>
        </div>
        {/* anchor text — tiny, margin-right */}
        <div className="absolute top-10 right-6 sm:right-10 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/55 text-right leading-[1.8]">
          <div>READ ORDER · LINEAR</div>
          <div className="text-[var(--cdb-paper)]/30 mt-1">
            σ-progress {(p * 100).toFixed(1)}%
          </div>
        </div>

        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-16 px-6 sm:px-16 pt-[24vh] pb-[8vh]">
          <CatalogColumn
            prefix="E0000_"
            count={180}
            speed={1.1}
            progress={p}
            limeAt={57}
          />
          <CatalogColumn
            prefix="SYM-"
            count={240}
            speed={1.5}
            progress={p}
            limeAt={-1}
            pad={3}
          />
          <CatalogColumn
            prefix="SHAPE-"
            count={160}
            speed={0.9}
            progress={p}
            limeAt={112}
          />
          <CatalogColumn
            prefix="FCHMYCSF_"
            count={200}
            speed={1.8}
            progress={p}
            limeAt={-1}
            pad={3}
          />
        </div>
      </div>
    </section>
  );
}

function CatalogColumn({
  prefix,
  count,
  speed,
  progress,
  limeAt,
  pad = 3,
}: {
  prefix: string;
  count: number;
  speed: number;
  progress: number;
  limeAt: number;
  pad?: number;
}) {
  const items = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        code: `${prefix}${String(i + 1).padStart(pad, "0")}`,
        lime: i === limeAt,
        descriptor: DESCRIPTORS[(i * 7) % DESCRIPTORS.length],
      })),
    [prefix, count, pad, limeAt]
  );
  // translate upward proportional to progress × speed.
  const offset = -progress * speed * 2200;
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="font-mono text-[10px] sm:text-[11px] leading-[1.9] uppercase tracking-[0.06em] whitespace-nowrap"
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          willChange: "transform",
        }}
      >
        {items.map((it) => (
          <div
            key={it.code}
            className={
              it.lime
                ? "text-[var(--cdb-lime)]"
                : "text-[var(--cdb-paper)]/75"
            }
          >
            <span className="font-bold">{it.code}</span>
            <span className="opacity-55 ml-3">{it.descriptor}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const DESCRIPTORS = [
  "UNSORTED",
  "COLD STORE",
  "DRAFT",
  "FIELD TAKE",
  "LOCKED",
  "FORMAL",
  "PUBLIC",
  "BURIED",
  "REPEAT",
  "MATRIX 01",
  "MATRIX 02",
  "NULL",
  "TOKEN A",
  "TOKEN B",
  "PROOF",
  "DECAY",
  "ORIGIN",
  "SUPERSEDED",
  "WITHDRAWN",
  "RETAINED",
];

// ─────────────────────────────────────────────────────────────
// M4 · STATIC
// A horizon-wide halftone wave built in canvas. Dots swell toward
// the vertical midline and taper out to the edges — the Black Flag
// corrugated-sheet gesture. Over the wave, one single Bungee word
// rides in black, cut out of the halftone substrate.
// ─────────────────────────────────────────────────────────────
function Static() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden flex items-center justify-center">
      <HalftoneWave />
      <div
        className="relative font-[var(--font-bungee)] uppercase text-center leading-[0.82] mix-blend-difference text-[var(--cdb-paper)]"
        style={{
          fontSize: "clamp(120px, 25vw, 480px)",
          letterSpacing: "-0.03em",
        }}
      >
        STATIC
      </div>
      <div className="absolute bottom-8 left-6 sm:left-10 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/55">
        FIG. S-01 · INDUSTRIAL SUBSTRATE / HALFTONE WAVE
      </div>
      <div className="absolute bottom-8 right-6 sm:right-10 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/55">
        ONE WORD · ONE SURFACE
      </div>
    </section>
  );
}

function HalftoneWave() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const render = (t: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      const step = 14;
      const cols = Math.ceil(w / step);
      const rows = Math.ceil(h / step);
      const phase = t * 0.00025;
      for (let r = 0; r < rows; r++) {
        const rn = r / rows;
        // envelope: strong band at mid-height, tapered at top/bottom
        const envelope = 1 - Math.abs(rn - 0.5) * 2;
        const band = Math.pow(Math.max(0, envelope), 1.5);
        for (let c = 0; c < cols; c++) {
          const cn = c / cols;
          const y0 = rn * h;
          // sheet-warp: horizontal sine that creates the corrugated feel
          const warp = Math.sin(cn * Math.PI * 3 + phase) * 18 * band;
          const y = y0 + warp;
          // dot size grows with band, tapers at left/right edges
          const edge = Math.pow(1 - Math.abs(cn - 0.5) * 2, 0.4);
          const radius = band * edge * 4.2 + 0.2;
          ctx.fillStyle = `rgba(250,250,250,${0.25 + band * 0.55})`;
          ctx.beginPath();
          ctx.arc(c * step + step / 2, y + step / 2, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full"
    />
  );
}

// ─────────────────────────────────────────────────────────────
// M5 · SCHEMATIC
// The Diagrams2 primitive pushed to full-bleed. No outer frame, no
// caption card — the schematic sits directly on the black field
// like a loose page from a 1970s radio-shop manual. Labels are part
// of the drawing; nothing is chrome, everything is content.
// ─────────────────────────────────────────────────────────────
function Schematic() {
  return (
    <section className="relative min-h-[100vh] flex items-center py-[8vh] overflow-hidden">
      <div className="relative w-full px-6 sm:px-16">
        <VaultSchematic className="w-full h-auto" />
      </div>
      <div className="absolute top-8 left-6 sm:left-10 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/55 leading-[1.8]">
        <div>FIG. 44A</div>
        <div className="text-[var(--cdb-paper)]/30">OSCILLATOR → TRANSDUCER</div>
      </div>
      <div className="absolute bottom-8 right-6 sm:right-10 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/55 leading-[1.8] text-right">
        <div>SCALE 1:1 · NO COLOUR</div>
        <div className="text-[var(--cdb-paper)]/30">CULTURE DIVISION PRESS</div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// M6 · MARK STORM
// Sixty Y2K trademark glyphs scattered across the viewport, sized
// irregularly, bleeding off the edges on purpose. No card chrome,
// no grid, no labels. One mark — exactly one — is rendered in lime;
// the rest are paper on black. This is the catalog broken loose from
// its ledger.
// ─────────────────────────────────────────────────────────────
const GLYPH_KEYS: VaultTrademarkGlyph[] = [
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

function MarkStorm() {
  // Stable-pseudo-random layout — same arrangement on every render,
  // but irregular enough to read as "scattered."
  const marks = React.useMemo(() => {
    const rand = mulberry32(7309);
    return Array.from({ length: 60 }, (_, i) => ({
      glyph: GLYPH_KEYS[i % GLYPH_KEYS.length],
      left: rand() * 112 - 6,
      top: rand() * 100,
      size: 48 + rand() * 120,
      rot: (rand() - 0.5) * 30,
      opacity: 0.35 + rand() * 0.55,
      lime: i === 23,
    }));
  }, []);
  return (
    <section className="relative min-h-[120vh] overflow-hidden">
      <div className="absolute top-8 left-6 sm:left-10 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/55">
        DISPERSION · 60 MARKS · SF//TMK
      </div>
      <div className="absolute top-8 right-6 sm:right-10 font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--cdb-paper)]/55">
        ONE MARK IS LIT
      </div>
      {marks.map((m, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            transform: `rotate(${m.rot}deg)`,
            opacity: m.lime ? 1 : m.opacity,
          }}
        >
          <RawGlyph
            glyph={m.glyph}
            color={m.lime ? "var(--cdb-lime)" : "var(--cdb-paper)"}
          />
        </div>
      ))}
    </section>
  );
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Bare glyph renderer — the same vocabulary as VaultTrademark but
// stripped of the bordered card chrome. Paints the geometry directly
// on the black field so the marks read as loose artifacts, not catalog
// cells.
function RawGlyph({
  glyph,
  color,
}: {
  glyph: VaultTrademarkGlyph;
  color: string;
}) {
  const stroke = color;
  const fill = "none";
  const sw = 2.2;
  const common = { stroke, fill, strokeWidth: sw } as const;
  switch (glyph) {
    case "hexStacked":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" {...common} />
          <polygon points="32,16 46,24 46,40 32,48 18,40 18,24" {...common} />
          <circle cx="32" cy="32" r="3.5" fill={color} stroke="none" />
        </svg>
      );
    case "recycling":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <path d="M32 6 L46 28 L38 28 L44 40 L24 40 L14 28 Z" {...common} />
          <path d="M14 36 L22 50 L54 50 L44 36" {...common} />
        </svg>
      );
    case "starBurst":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <polygon
            points="32,4 36,24 58,24 40,36 48,58 32,44 16,58 24,36 6,24 28,24"
            {...common}
          />
          <circle cx="32" cy="32" r="5" {...common} />
        </svg>
      );
    case "peaceRing":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="32" cy="32" r="26" {...common} />
          <line x1="32" y1="6" x2="32" y2="58" {...common} />
          <line x1="32" y1="32" x2="14" y2="50" {...common} />
          <line x1="32" y1="32" x2="50" y2="50" {...common} />
        </svg>
      );
    case "cubeNest":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <rect x="6" y="6" width="52" height="52" {...common} />
          <rect x="14" y="14" width="36" height="36" {...common} />
          <rect x="22" y="22" width="20" height="20" {...common} />
          <rect x="28" y="28" width="8" height="8" fill={color} stroke="none" />
        </svg>
      );
    case "circuitWheel":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="32" cy="32" r="22" {...common} />
          <circle cx="32" cy="32" r="8" {...common} />
          {[0, 60, 120, 180, 240, 300].map((d) => {
            const a = (d * Math.PI) / 180;
            const r = (n: number) => n.toFixed(3);
            return (
              <line
                key={d}
                x1={r(32 + Math.cos(a) * 10)}
                y1={r(32 + Math.sin(a) * 10)}
                x2={r(32 + Math.cos(a) * 22)}
                y2={r(32 + Math.sin(a) * 22)}
                {...common}
              />
            );
          })}
        </svg>
      );
    case "tigerEye":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <ellipse cx="32" cy="32" rx="26" ry="14" {...common} />
          <ellipse cx="32" cy="32" rx="12" ry="14" {...common} />
          <circle cx="32" cy="32" r="3.5" fill={color} stroke="none" />
        </svg>
      );
    case "smileyCrown":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="32" cy="32" r="22" {...common} />
          <circle cx="25" cy="28" r="2" fill={color} stroke="none" />
          <circle cx="39" cy="28" r="2" fill={color} stroke="none" />
          <path d="M22 40 Q 32 48 42 40" {...common} />
          <polyline points="18,12 24,4 32,10 40,4 46,12" {...common} />
        </svg>
      );
    case "quadrant":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <rect x="4" y="4" width="26" height="26" {...common} />
          <rect x="34" y="4" width="26" height="26" fill={color} stroke="none" />
          <rect x="34" y="34" width="26" height="26" {...common} />
          <rect x="4" y="34" width="26" height="26" fill={color} stroke="none" />
        </svg>
      );
    case "dotMatrix":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {[12, 22, 32, 42, 52].flatMap((y) =>
            [12, 22, 32, 42, 52].map((x) => {
              const r = ((x + y) * 13) % 5 === 0 ? 2.8 : 1.6;
              return (
                <circle
                  key={`${x}-${y}`}
                  cx={x}
                  cy={y}
                  r={r}
                  fill={color}
                  stroke="none"
                />
              );
            })
          )}
        </svg>
      );
    case "chevronArrow":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <polyline points="10,20 32,40 54,20" {...common} />
          <polyline points="10,32 32,52 54,32" {...common} />
        </svg>
      );
    case "gearWedge":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <path
            d="M32 6 L36 14 L46 12 L48 22 L56 26 L52 34 L58 42 L50 46 L46 54 L38 50 L32 58 L26 50 L18 54 L14 46 L6 42 L12 34 L8 26 L16 22 L18 12 L28 14 Z"
            {...common}
          />
          <circle cx="32" cy="32" r="5" fill={color} stroke="none" />
        </svg>
      );
    case "orbit":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <ellipse cx="32" cy="32" rx="26" ry="10" {...common} />
          <ellipse cx="32" cy="32" rx="10" ry="26" {...common} />
          <circle cx="32" cy="32" r="3.5" fill={color} stroke="none" />
        </svg>
      );
    case "asterField":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {[16, 32, 48].map((cx) =>
            [16, 32, 48].map((cy) => (
              <g key={`${cx}-${cy}`}>
                <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} {...common} />
                <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} {...common} />
              </g>
            ))
          )}
        </svg>
      );
    case "maze":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <path
            d="M6 6 H58 V58 H6 V14 H50 V50 H14 V22 H42 V42 H22 V30 H34"
            {...common}
          />
        </svg>
      );
    case "sunburst":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <circle cx="32" cy="32" r="5" fill={color} stroke="none" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            const len = i % 2 === 0 ? 22 : 14;
            const r = (n: number) => n.toFixed(3);
            return (
              <line
                key={i}
                x1={r(32 + Math.cos(a) * 10)}
                y1={r(32 + Math.sin(a) * 10)}
                x2={r(32 + Math.cos(a) * len)}
                y2={r(32 + Math.sin(a) * len)}
                {...common}
              />
            );
          })}
        </svg>
      );
  }
}

// ─────────────────────────────────────────────────────────────
// M7 · DISSOLVE
// Three layered states fade through each other in sequence: pointcloud
// nebula → Ikeda telemetry → pure grain. Progress-driven opacity on
// each layer; by p=1 the page is just substrate. The final sign-off
// is a single line of Helghanese — a message from the parallel station
// in a script that cannot be casually read.
// ─────────────────────────────────────────────────────────────
function Dissolve() {
  const ref = React.useRef<HTMLElement | null>(null);
  const p = useElementProgress(ref);
  // Amplify — useElementProgress tops out near p≈0.74 because the
  // section exits the viewport before the last bit of scroll arrives.
  // Scaling lets the last scroll position land firmly on silence.
  const q = Math.min(1, p * 1.35);
  const nebulaOpacity = Math.max(0, 1 - q * 2.0);
  const dataOpacity =
    q < 0.18 ? 0 : q < 0.55 ? (q - 0.18) / 0.37 : Math.max(0, 1 - (q - 0.55) / 0.25);
  const silenceOpacity = q < 0.72 ? 0 : Math.min(1, (q - 0.72) / 0.18);
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative"
      style={{ height: "240vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* nebula */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: nebulaOpacity, transition: "opacity 120ms linear" }}
        >
          <ParticleField
            progress={Math.min(1, q * 1.6)}
            pointCount={2400}
            mode="nebula-to-lattice"
            className="w-[min(96vw,1100px)] h-[min(88vh,900px)]"
          />
        </div>
        {/* data field */}
        <div
          className="absolute inset-[8vh_6vw]"
          style={{ opacity: dataOpacity, transition: "opacity 120ms linear" }}
        >
          <VaultDataField columns={14} rows={42} />
        </div>
        {/* silence layer — opaque black with a last glyph */}
        <div
          className="absolute inset-0 bg-[var(--cdb-black)] flex flex-col items-center justify-center gap-10"
          style={{ opacity: silenceOpacity, transition: "opacity 120ms linear" }}
        >
          <VaultHelghanese text="END" size={72} letterSpacing={8} />
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--cdb-paper)]/55 text-center leading-[1.8]">
            <div>σ = 0.000 · TRANSMISSION CLOSED</div>
            <div className="text-[var(--cdb-paper)]/30 mt-1">
              the field remains · the signal does not
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Shared primitive · ParticleField
// Canvas 2D particle distribution that morphs between two target
// shapes as `progress` goes 0→1. Replaces the three.js pointcloud with
// a lighter, more robust implementation — the aesthetic read is the
// same (dense mathematical distribution on black) but the execution
// is portable and guaranteed to render.
//
// Modes describe the (start, end) shape pair:
//   ring-to-nebula    unit ring → gaussian cloud  (opening)
//   nebula-to-lattice soft cloud → cubic grid     (dissolve)
// ─────────────────────────────────────────────────────────────
type ParticleMode = "ring-to-nebula" | "nebula-to-lattice";

function ParticleField({
  progress,
  pointCount,
  mode,
  className,
}: {
  progress: number;
  pointCount: number;
  mode: ParticleMode;
  className?: string;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const progressRef = React.useRef(progress);
  progressRef.current = progress;

  // target coordinate pairs precomputed once; each is a unit-space
  // (x, y) in [-1, 1] range. Deterministic via seeded RNG so SSR and
  // client match.
  const shapes = React.useMemo(() => {
    const rng = mulberry32(pointCount * 31 + (mode === "ring-to-nebula" ? 1 : 2));
    const a = new Float32Array(pointCount * 2);
    const b = new Float32Array(pointCount * 2);
    for (let i = 0; i < pointCount; i++) {
      const [ax, ay] = mode === "ring-to-nebula" ? ring(rng) : nebula(rng);
      const [bx, by] = mode === "ring-to-nebula" ? nebula(rng) : lattice(rng);
      a[i * 2] = ax;
      a[i * 2 + 1] = ay;
      b[i * 2] = bx;
      b[i * 2 + 1] = by;
    }
    return { a, b };
  }, [pointCount, mode]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(() => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      resize();
    });
    ro.observe(canvas);

    let raf = 0;
    const render = (t: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.42;
      const rot = t * 0.00009;
      const p = progressRef.current;
      // eased mix
      const m = p * p * (3 - 2 * p);
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      ctx.fillStyle = "rgba(250,250,250,0.78)";
      for (let i = 0; i < pointCount; i++) {
        const ax = shapes.a[i * 2];
        const ay = shapes.a[i * 2 + 1];
        const bx = shapes.b[i * 2];
        const by = shapes.b[i * 2 + 1];
        const x = ax * (1 - m) + bx * m;
        const y = ay * (1 - m) + by * m;
        // rotate in-plane for a slow drift
        const rx = x * cos - y * sin;
        const ry = x * sin + y * cos;
        const px = cx + rx * scale;
        const py = cy + ry * scale;
        ctx.fillRect(px, py, 1.5, 1.5);
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [pointCount, shapes]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block" }}
    />
  );
}

function ring(rng: () => number): [number, number] {
  const t = rng() * Math.PI * 2;
  const jitter = (rng() - 0.5) * 0.04;
  return [Math.cos(t) * (1 + jitter), Math.sin(t) * (1 + jitter) * 0.52];
}
function nebula(rng: () => number): [number, number] {
  // gaussian via Box–Muller, clipped
  const u = Math.max(1e-6, rng());
  const v = rng();
  const g1 = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  const g2 = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
  return [
    Math.max(-1.4, Math.min(1.4, g1 * 0.55)),
    Math.max(-1.1, Math.min(1.1, g2 * 0.42)),
  ];
}
function lattice(rng: () => number): [number, number] {
  const g = 11;
  const ix = Math.floor(rng() * g) - (g - 1) / 2;
  const iy = Math.floor(rng() * g) - (g - 1) / 2;
  return [
    (ix / ((g - 1) / 2)) + (rng() - 0.5) * 0.02,
    (iy / ((g - 1) / 2)) * 0.7 + (rng() - 0.5) * 0.02,
  ];
}
