"use client";

import {
  SFTabs,
  SFTabsList,
  SFTabsTrigger,
  SFTabsContent,
} from "@/components/sf/sf-tabs";
import { SFBadge } from "@/components/sf/sf-badge";

/* ── COLOR SCALE DATA ── */
const COLOR_SCALES = [
  {
    name: "NEUTRAL",
    hue: 0,
    swatches: [
      { step: 50, l: 0.99, c: 0, h: 0 },
      { step: 100, l: 0.96, c: 0, h: 0 },
      { step: 200, l: 0.90, c: 0, h: 0 },
      { step: 300, l: 0.82, c: 0, h: 0 },
      { step: 400, l: 0.70, c: 0, h: 0 },
      { step: 500, l: 0.55, c: 0, h: 0 },
      { step: 600, l: 0.45, c: 0, h: 0 },
      { step: 700, l: 0.37, c: 0, h: 0 },
      { step: 800, l: 0.27, c: 0, h: 0 },
      { step: 900, l: 0.20, c: 0, h: 0 },
      { step: 950, l: 0.14, c: 0, h: 0 },
      { step: 1000, l: 0.05, c: 0, h: 0 },
    ],
  },
  {
    name: "SIGNAL",
    hue: 350,
    swatches: [
      { step: 50, l: 0.97, c: 0.02, h: 350 },
      { step: 100, l: 0.93, c: 0.05, h: 350 },
      { step: 200, l: 0.85, c: 0.10, h: 350 },
      { step: 300, l: 0.77, c: 0.16, h: 350 },
      { step: 400, l: 0.68, c: 0.22, h: 350 },
      { step: 500, l: 0.60, c: 0.28, h: 350 },
      { step: 600, l: 0.52, c: 0.26, h: 350 },
      { step: 700, l: 0.44, c: 0.22, h: 350 },
      { step: 800, l: 0.36, c: 0.18, h: 350 },
      { step: 900, l: 0.28, c: 0.14, h: 350 },
      { step: 950, l: 0.22, c: 0.10, h: 350 },
      { step: 1000, l: 0.15, c: 0.06, h: 350 },
    ],
  },
  {
    name: "FRAME",
    hue: 145,
    swatches: [
      { step: 50, l: 0.97, c: 0.03, h: 145 },
      { step: 100, l: 0.93, c: 0.08, h: 145 },
      { step: 200, l: 0.85, c: 0.15, h: 145 },
      { step: 300, l: 0.78, c: 0.22, h: 145 },
      { step: 400, l: 0.70, c: 0.28, h: 145 },
      { step: 500, l: 0.62, c: 0.28, h: 145 },
      { step: 600, l: 0.52, c: 0.24, h: 145 },
      { step: 700, l: 0.42, c: 0.20, h: 145 },
      { step: 800, l: 0.34, c: 0.16, h: 145 },
      { step: 900, l: 0.26, c: 0.12, h: 145 },
      { step: 950, l: 0.20, c: 0.08, h: 145 },
      { step: 1000, l: 0.12, c: 0.04, h: 145 },
    ],
  },
  {
    name: "DANGER",
    hue: 25,
    swatches: [
      { step: 50, l: 0.97, c: 0.02, h: 25 },
      { step: 100, l: 0.90, c: 0.08, h: 25 },
      { step: 200, l: 0.82, c: 0.14, h: 25 },
      { step: 300, l: 0.72, c: 0.20, h: 25 },
      { step: 400, l: 0.62, c: 0.24, h: 25 },
      { step: 500, l: 0.55, c: 0.24, h: 25 },
      { step: 600, l: 0.48, c: 0.22, h: 25 },
      { step: 700, l: 0.40, c: 0.18, h: 25 },
      { step: 800, l: 0.32, c: 0.14, h: 25 },
      { step: 900, l: 0.25, c: 0.10, h: 25 },
      { step: 950, l: 0.18, c: 0.06, h: 25 },
      { step: 1000, l: 0.12, c: 0.04, h: 25 },
    ],
  },
  {
    name: "YELLOW",
    hue: 100,
    swatches: [
      { step: 50, l: 0.99, c: 0.03, h: 100 },
      { step: 100, l: 0.96, c: 0.08, h: 100 },
      { step: 200, l: 0.93, c: 0.14, h: 100 },
      { step: 300, l: 0.90, c: 0.18, h: 100 },
      { step: 400, l: 0.88, c: 0.20, h: 100 },
      { step: 500, l: 0.85, c: 0.20, h: 100 },
      { step: 600, l: 0.75, c: 0.16, h: 100 },
      { step: 700, l: 0.60, c: 0.12, h: 100 },
      { step: 800, l: 0.45, c: 0.08, h: 100 },
      { step: 900, l: 0.35, c: 0.06, h: 100 },
      { step: 950, l: 0.25, c: 0.04, h: 100 },
      { step: 1000, l: 0.15, c: 0.02, h: 100 },
    ],
  },
  {
    name: "ACCENT",
    hue: 350,
    swatches: [
      { step: 50, l: 0.97, c: 0.03, h: 350 },
      { step: 100, l: 0.93, c: 0.06, h: 350 },
      { step: 200, l: 0.85, c: 0.12, h: 350 },
      { step: 300, l: 0.77, c: 0.18, h: 350 },
      { step: 400, l: 0.68, c: 0.24, h: 350 },
      { step: 500, l: 0.60, c: 0.29, h: 350 },
      { step: 600, l: 0.52, c: 0.27, h: 350 },
      { step: 700, l: 0.44, c: 0.23, h: 350 },
      { step: 800, l: 0.36, c: 0.19, h: 350 },
      { step: 900, l: 0.28, c: 0.15, h: 350 },
      { step: 950, l: 0.22, c: 0.11, h: 350 },
      { step: 1000, l: 0.15, c: 0.07, h: 350 },
    ],
  },
];

/* ── SPACING DATA ── */
const SPACING = [
  { name: "space-1", rem: "0.25rem", px: 4 },
  { name: "space-2", rem: "0.5rem", px: 8 },
  { name: "space-3", rem: "0.75rem", px: 12 },
  { name: "space-4", rem: "1rem", px: 16 },
  { name: "space-6", rem: "1.5rem", px: 24 },
  { name: "space-8", rem: "2rem", px: 32 },
  { name: "space-12", rem: "3rem", px: 48 },
  { name: "space-16", rem: "4rem", px: 64 },
  { name: "space-24", rem: "6rem", px: 96 },
];

/* ── TYPE SCALE DATA ── */
const TYPE_SCALE = [
  { name: "DISPLAY", sample: "SIGNAL//FRAME\u2122", font: "var(--font-display)", size: 64, weight: 700, meta: "ANTON \u00b7 64PX \u00b7 700" },
  { name: "H1", sample: "COMPONENTS", font: "var(--font-display)", size: 45, weight: 700, meta: "ANTON \u00b7 45PX \u00b7 700" },
  { name: "H2", sample: "API_REFERENCE", font: "var(--font-display)", size: 32, weight: 700, meta: "ANTON \u00b7 32PX \u00b7 700" },
  { name: "H3", sample: "TOKEN EXPLORER", font: "inherit", size: 22, weight: 700, meta: "ELECTROLIZE \u00b7 22PX \u00b7 700" },
  { name: "BODY", sample: "Deterministic interface. Generative expression.", font: "inherit", size: 14, weight: 400, meta: "ELECTROLIZE \u00b7 14PX \u00b7 400" },
  { name: "CAPTION", sample: "FRAME LAYER \u00b7 V2.1.0", font: "inherit", size: 11, weight: 700, meta: "ELECTROLIZE \u00b7 11PX \u00b7 700", uppercase: true },
  { name: "CODE", sample: "const sfux = createSignalframeUX()", font: "'JetBrains Mono', monospace", size: 13, weight: 400, meta: "JETBRAINS MONO \u00b7 13PX \u00b7 400", code: true },
];

/* ── MOTION DATA ── */
const MOTION_TOKENS = [
  { name: "EASE-DEFAULT", easing: "ease", duration: "200ms", css: "ease \u00b7 200ms" },
  { name: "EASE-IN", easing: "ease-in", duration: "200ms", css: "ease-in \u00b7 200ms" },
  { name: "EASE-OUT", easing: "ease-out", duration: "150ms", css: "ease-out \u00b7 150ms" },
  { name: "SPRING", easing: "cubic-bezier(0.68,-0.55,0.27,1.55)", duration: "400ms", css: "cubic-bezier(0.68,-0.55,0.27,1.55) \u00b7 400ms" },
  { name: "STEP", easing: "steps(8)", duration: "500ms", css: "steps(8) \u00b7 500ms" },
];

const EASING_MAP = ["ease", "ease-in", "ease-out", "cubic-bezier(0.68, -0.55, 0.27, 1.55)", "steps(8)"];

export function TokenTabs() {
  return (
    <SFTabs defaultValue="COLOR">
      <SFTabsList className="border-b-[3px] border-foreground w-full justify-start flex-wrap rounded-none">
        {["COLOR", "SPACING", "TYPOGRAPHY", "MOTION"].map((tab) => (
          <SFTabsTrigger
            key={tab}
            value={tab}
            className="border-r-2 border-foreground rounded-none px-6 py-3.5 text-[11px] tracking-[0.15em] data-[state=active]:bg-foreground data-[state=active]:text-primary"
          >
            {tab}
          </SFTabsTrigger>
        ))}
        {["ELEVATION", "RADIUS", "BREAKPOINTS"].map((tab) => (
          <SFTabsTrigger
            key={tab}
            value={tab}
            className="border-r-2 border-foreground rounded-none px-6 py-3.5 text-[11px] tracking-[0.15em] text-muted-foreground/50 data-[state=active]:bg-foreground data-[state=active]:text-primary"
          >
            {tab} <span className="text-[9px] ml-1 opacity-50">·</span>
          </SFTabsTrigger>
        ))}
      </SFTabsList>

      {/* ═══ COLOR TAB ═══ */}
      <SFTabsContent value="COLOR" className="mt-0">
        <div className="sf-yellow-band border-b-4 border-foreground relative py-10 px-6 md:px-12">
          <h2 className="sf-display text-foreground mb-4" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
            OKLCH COLOR SYSTEM&trade;
          </h2>
          <p className="text-sm leading-[1.7] text-foreground max-w-[700px]">
            SignalframeUX&trade; uses{" "}
            <code className="bg-foreground/10 px-1.5 py-0.5 text-[12px]">
              oklch()
            </code>{" "}
            for perceptually uniform color. Every scale maintains consistent
            lightness across hues. No more blue looking darker than yellow at
            the same step. 48 scales × 12 steps = 576 color tokens. Accept
            color into your life.&trade;
          </p>
          <div className="h-8 overflow-hidden relative mt-5 border-t border-foreground/10 border-b border-b-foreground/10">
            <div
              className="flex items-center h-full whitespace-nowrap"
              style={{ animation: "sf-marquee-scroll 20s linear infinite" }}
            >
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">
                PERCEPTUALLY UNIFORM // OKLCH COLOR SPACE // 576 TOKENS //
                CONSISTENT ACROSS HUES //&nbsp;&nbsp;&nbsp;&nbsp;PERCEPTUALLY
                UNIFORM // OKLCH COLOR SPACE // 576 TOKENS // CONSISTENT ACROSS
                HUES //&nbsp;&nbsp;&nbsp;&nbsp;PERCEPTUALLY UNIFORM // OKLCH
                COLOR SPACE // 576 TOKENS // CONSISTENT ACROSS HUES
                //&nbsp;&nbsp;&nbsp;&nbsp;PERCEPTUALLY UNIFORM // OKLCH COLOR
                SPACE // 576 TOKENS // CONSISTENT ACROSS HUES
                //&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </div>

        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          COLOR_SCALES ( {COLOR_SCALES.length} / 48 )
        </div>
        <div className="overflow-x-auto relative">
          <div className="md:hidden text-[9px] uppercase tracking-[0.2em] text-muted-foreground text-right px-4 py-1.5 border-b border-border">
            ← SCROLL →
          </div>
          {COLOR_SCALES.map((scale) => (
            <div
              key={scale.name}
              className="grid grid-cols-[120px_repeat(12,minmax(48px,1fr))] md:grid-cols-[200px_repeat(12,1fr)] border-b-2 border-foreground min-w-[700px]"
            >
              <div className="px-6 flex items-center text-[11px] font-bold uppercase tracking-[0.1em] border-r-2 border-foreground bg-foreground text-background">
                {scale.name}
              </div>
              {scale.swatches.map((sw) => {
                const isDark = sw.l < 0.55;
                const oklchStr = sw.c === 0
                  ? `oklch(${sw.l} 0 0)`
                  : `oklch(${sw.l} ${sw.c} ${sw.h})`;
                return (
                  <div
                    key={sw.step}
                    className="aspect-square flex flex-col items-center justify-center relative border-r border-foreground/10"
                    style={{
                      background: oklchStr,
                      color: isDark ? "#fafafa" : "#1a1a1a",
                    }}
                  >
                    <span className="text-[10px] font-bold uppercase opacity-70">
                      {sw.step}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </SFTabsContent>

      {/* ═══ SPACING TAB ═══ */}
      <SFTabsContent value="SPACING" className="mt-0">
        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          SPACING_SCALE
        </div>
        <div className="border-b-4 border-foreground">
          <div className="grid grid-cols-[120px_200px_1fr_120px] bg-foreground text-background text-[11px] uppercase tracking-[0.2em] font-bold">
            <span className="p-2.5 px-4">TOKEN</span>
            <span className="p-2.5 px-4">VALUE</span>
            <span className="p-2.5 px-4">VISUAL</span>
            <span className="p-2.5 px-4">PX</span>
          </div>
          {SPACING.map((s) => (
            <div
              key={s.name}
              className="grid grid-cols-[120px_200px_1fr_120px] border-b border-border items-center"
            >
              <div className="p-3 px-4 font-bold text-[11px] uppercase text-primary">
                {s.name}
              </div>
              <div className="p-3 px-4 text-[11px] text-muted-foreground">
                {s.rem}
              </div>
              <div className="p-3 px-4">
                <div
                  className="h-4 bg-foreground transition-[width] duration-300"
                  style={{ width: `${s.px}px` }}
                />
              </div>
              <div className="p-3 px-4 text-[10px] text-muted-foreground text-right">
                {s.px}px
              </div>
            </div>
          ))}
        </div>
      </SFTabsContent>

      {/* ═══ TYPOGRAPHY TAB ═══ */}
      <SFTabsContent value="TYPOGRAPHY" className="mt-0">
        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          TYPE_SCALE ( AUGMENTED FOURTH · 1.414 )
        </div>
        <div className="border-b-4 border-foreground">
          {TYPE_SCALE.map((t) => (
            <div
              key={t.name}
              className="grid grid-cols-[160px_1fr_200px] border-b border-border items-baseline"
            >
              <div className="p-5 px-4 text-[10px] uppercase tracking-[0.15em] text-primary font-bold">
                {t.name}
              </div>
              <div
                className="p-5 px-4 overflow-hidden whitespace-nowrap text-ellipsis"
                style={{
                  fontFamily: t.font,
                  fontSize: `${t.size}px`,
                  fontWeight: t.weight,
                  lineHeight: 1,
                  textTransform: t.uppercase ? "uppercase" : undefined,
                  letterSpacing: t.uppercase ? "0.15em" : undefined,
                  ...(t.code
                    ? {
                        color: "var(--sf-code-text)",
                        background: "var(--sf-code-bg)",
                        padding: "8px 12px",
                        margin: "12px 16px",
                      }
                    : {}),
                }}
              >
                {t.sample}
              </div>
              <div className="p-5 px-4 text-[11px] text-muted-foreground text-right uppercase tracking-[0.1em]">
                {t.meta}
              </div>
            </div>
          ))}
        </div>
      </SFTabsContent>

      {/* ═══ MOTION TAB ═══ */}
      <SFTabsContent value="MOTION" className="mt-0">
        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          MOTION_TOKENS
        </div>
        <div className="border-b-4 border-foreground">
          {MOTION_TOKENS.map((m, i) => (
            <div
              key={m.name}
              className="grid grid-cols-[200px_1fr_200px] border-b border-border items-center py-4"
            >
              <div className="px-4 font-bold text-[11px] uppercase text-primary">
                {m.name}
              </div>
              <div className="px-4 relative h-6">
                <div
                  className="w-7 h-7 bg-foreground absolute top-[-2px]"
                  style={{
                    animation: "sf-motion-slide 2s infinite alternate",
                    animationTimingFunction: EASING_MAP[i],
                  }}
                />
              </div>
              <div className="px-4 text-[10px] text-muted-foreground text-right">
                {m.css}
              </div>
            </div>
          ))}
        </div>
      </SFTabsContent>

      {/* ═══ PLACEHOLDER TABS ═══ */}
      {["ELEVATION", "RADIUS", "BREAKPOINTS"].map((tab) => (
        <SFTabsContent key={tab} value={tab} className="mt-0">
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
            <span className="text-2xl opacity-40 sf-display" aria-hidden="true">//</span>
            <SFBadge intent="outline" className="text-sm py-2 px-6 opacity-60">
              {tab} TOKENS — COMING SOON
            </SFBadge>
          </div>
        </SFTabsContent>
      ))}
    </SFTabs>
  );
}
