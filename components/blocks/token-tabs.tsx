"use client";

import React, { useState } from "react";
import { useSessionState, SESSION_KEYS } from "@/hooks/use-session-state";
import {
  SFTabs,
  SFTabsList,
  SFTabsTrigger,
  SFTabsContent,
  SFTable,
  SFTableHeader,
  SFTableHead,
  SFTableBody,
  SFTableRow,
  SFTableCell,
  SFButton,
  SFBadge,
} from "@/components/sf";

const CORE_SCALE_COUNT = 6;

/* ── COLOR SCALE GENERATION ── */
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000] as const;
const L_CURVE = [0.97, 0.93, 0.85, 0.77, 0.68, 0.60, 0.52, 0.44, 0.36, 0.28, 0.22, 0.15];
const C_CURVE = [0.02, 0.05, 0.10, 0.16, 0.22, 0.28, 0.26, 0.22, 0.18, 0.14, 0.10, 0.06];

type ScaleDef = { name: string; hue: number; cMax?: number };

function generateScale(def: ScaleDef) {
  const cScale = def.cMax ?? 1;
  return {
    name: def.name,
    hue: def.hue,
    swatches: STEPS.map((step, i) => ({
      step,
      l: def.hue === 0 && def.name === "NEUTRAL"
        ? [0.99, 0.96, 0.90, 0.82, 0.70, 0.55, 0.45, 0.37, 0.27, 0.20, 0.14, 0.05][i]
        : L_CURVE[i],
      c: def.name === "NEUTRAL" ? 0 : +(C_CURVE[i] * cScale).toFixed(3),
      h: def.name === "NEUTRAL" ? 0 : def.hue,
    })),
  };
}

/* 49 scales: 6 core + 43 extended hue coverage (every ~8° of the color wheel) */
const SCALE_DEFS: ScaleDef[] = [
  // ── Core (always visible first) ──
  { name: "NEUTRAL", hue: 0 },
  { name: "SIGNAL", hue: 350 },
  { name: "FRAME", hue: 145, cMax: 1.0 },
  { name: "DANGER", hue: 25, cMax: 0.86 },
  { name: "YELLOW", hue: 100, cMax: 0.71 },
  { name: "ACCENT", hue: 350, cMax: 1.04 },
  // ── Extended: warm reds → oranges ──
  { name: "RED-5", hue: 5, cMax: 0.90 },
  { name: "RED-15", hue: 15, cMax: 0.88 },
  { name: "ORANGE-35", hue: 35, cMax: 0.82 },
  { name: "ORANGE-45", hue: 45, cMax: 0.78 },
  { name: "AMBER-55", hue: 55, cMax: 0.74 },
  { name: "AMBER-65", hue: 65, cMax: 0.72 },
  // ── Extended: yellows → limes ──
  { name: "GOLD-75", hue: 75, cMax: 0.72 },
  { name: "GOLD-85", hue: 85, cMax: 0.72 },
  { name: "LIME-110", hue: 110, cMax: 0.80 },
  { name: "LIME-120", hue: 120, cMax: 0.85 },
  { name: "LIME-130", hue: 130, cMax: 0.90 },
  // ── Extended: greens ──
  { name: "GREEN-155", hue: 155, cMax: 0.95 },
  { name: "GREEN-165", hue: 165, cMax: 0.92 },
  { name: "TEAL-175", hue: 175, cMax: 0.88 },
  { name: "TEAL-185", hue: 185, cMax: 0.85 },
  // ── Extended: cyans → blues ──
  { name: "CYAN-195", hue: 195, cMax: 0.82 },
  { name: "CYAN-205", hue: 205, cMax: 0.80 },
  { name: "SKY-215", hue: 215, cMax: 0.82 },
  { name: "SKY-225", hue: 225, cMax: 0.85 },
  { name: "BLUE-235", hue: 235, cMax: 0.88 },
  { name: "BLUE-245", hue: 245, cMax: 0.90 },
  // ── Extended: indigos → violets ──
  { name: "INDIGO-255", hue: 255, cMax: 0.92 },
  { name: "INDIGO-265", hue: 265, cMax: 0.94 },
  { name: "VIOLET-275", hue: 275, cMax: 0.96 },
  { name: "VIOLET-285", hue: 285, cMax: 0.96 },
  // ── Extended: purples → magentas ──
  { name: "PURPLE-295", hue: 295, cMax: 0.96 },
  { name: "PURPLE-305", hue: 305, cMax: 0.96 },
  { name: "MAGENTA-315", hue: 315, cMax: 0.98 },
  { name: "MAGENTA-325", hue: 325, cMax: 1.00 },
  // ── Extended: pinks → reds (closing the wheel) ──
  { name: "PINK-335", hue: 335, cMax: 1.00 },
  { name: "PINK-345", hue: 345, cMax: 1.00 },
  { name: "ROSE-355", hue: 355, cMax: 0.95 },
  // ── Extended: tinted neutrals ──
  { name: "WARM-GRAY", hue: 45, cMax: 0.12 },
  { name: "COOL-GRAY", hue: 245, cMax: 0.12 },
  { name: "SLATE", hue: 215, cMax: 0.15 },
  { name: "ZINC", hue: 285, cMax: 0.08 },
  { name: "STONE", hue: 55, cMax: 0.10 },
  { name: "OLIVE", hue: 110, cMax: 0.14 },
  { name: "SAND", hue: 70, cMax: 0.10 },
  { name: "ASH", hue: 200, cMax: 0.06 },
  { name: "IRON", hue: 230, cMax: 0.05 },
  { name: "SMOKE", hue: 0, cMax: 0.03 },
  { name: "GRAPHITE", hue: 260, cMax: 0.04 },
];

const COLOR_SCALES = SCALE_DEFS.map(generateScale);

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
  { name: "CODE", sample: "const sfux = createSignalframeUX()", font: "var(--font-mono)", size: 13, weight: 400, meta: "JETBRAINS MONO · 13PX · 400", code: true },
];

/* ── MOTION DATA — values match globals.css motion tokens ── */
const MOTION_TOKENS = [
  { name: "EASE-DEFAULT", easing: "cubic-bezier(0.2, 0, 0, 1)", duration: "200ms", css: "var(--ease-default) \u00b7 200ms" },
  { name: "EASE-HOVER", easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", duration: "200ms", css: "var(--ease-hover) \u00b7 200ms" },
  { name: "DURATION-FAST", easing: "cubic-bezier(0.2, 0, 0, 1)", duration: "100ms", css: "var(--ease-default) \u00b7 100ms" },
  { name: "DURATION-NORMAL", easing: "cubic-bezier(0.2, 0, 0, 1)", duration: "200ms", css: "var(--ease-default) \u00b7 200ms" },
  { name: "DURATION-SLOW", easing: "cubic-bezier(0.2, 0, 0, 1)", duration: "400ms", css: "var(--ease-default) \u00b7 400ms" },
];

// Easing is accessed directly from MOTION_TOKENS[i].easing in the render loop

/* ── ELEVATION DATA ── */
const ELEVATION_TOKENS = [
  { name: "FLAT", value: "none", css: "none" },
  { name: "INSET", value: "inset 0 1px 2px oklch(0 0 0 / 0.08)", css: "inset 0 1px 2px oklch(0 0 0 / 0.08)" },
  { name: "DEBOSS-LIGHT", value: "0 1px 0 oklch(1 0 0 / 0.1)", css: "0 1px 0 oklch(1 0 0 / 0.1)" },
  { name: "DEBOSS-SHADOW", value: "0 -1px 0 oklch(0 0 0 / 0.15)", css: "0 -1px 0 oklch(0 0 0 / 0.15)" },
  { name: "PRESSED", value: "inset 0 2px 4px oklch(0 0 0 / 0.12), inset 0 1px 1px oklch(0 0 0 / 0.06)", css: "inset 0 2px 4px / 0.12, inset 0 1px 1px / 0.06" },
  { name: "EDGE", value: "0 0 0 1px oklch(0 0 0 / 0.08), 0 1px 2px oklch(0 0 0 / 0.06)", css: "0 0 0 1px / 0.08, 0 1px 2px / 0.06" },
];

/* ── RADIUS DATA ── */
const RADIUS_TOKENS = [
  { name: "RADIUS-XS", typical: "2px" },
  { name: "RADIUS-SM", typical: "4px" },
  { name: "RADIUS-MD", typical: "6px" },
  { name: "RADIUS-LG", typical: "8px" },
  { name: "RADIUS-XL", typical: "12px" },
  { name: "RADIUS-2XL", typical: "16px" },
  { name: "RADIUS-FULL", typical: "9999px" },
];

/* ── BREAKPOINT DATA ── */
const BREAKPOINT_TOKENS = [
  { name: "SM", px: 640, usage: "MOBILE LANDSCAPE" },
  { name: "MD", px: 768, usage: "TABLET PORTRAIT" },
  { name: "LG", px: 1024, usage: "TABLET LANDSCAPE" },
  { name: "XL", px: 1280, usage: "DESKTOP" },
  { name: "2XL", px: 1536, usage: "WIDE DESKTOP" },
];

export function TokenTabs() {
  const [activeTab, setActiveTab] = useSessionState<string>(SESSION_KEYS.TOKENS_TAB, "COLOR");
  const [showAll, setShowAll] = useState(false);
  const [focusedSwatch, setFocusedSwatch] = useState<{ scale: number; step: number }>({ scale: 0, step: 0 });
  const visibleScales = showAll ? COLOR_SCALES : COLOR_SCALES.slice(0, CORE_SCALE_COUNT);

  return (
    <SFTabs value={activeTab} onValueChange={setActiveTab}>
      <SFTabsList className="border-b-[3px] border-foreground w-full justify-start flex-wrap rounded-none">
        {["COLOR", "SPACING", "TYPOGRAPHY", "MOTION"].map((tab) => (
          <SFTabsTrigger
            key={tab}
            value={tab}
            className="border-r-2 border-foreground rounded-none px-6 py-3.5 text-[var(--text-sm)] tracking-[0.15em] data-[state=active]:bg-foreground data-[state=active]:text-[var(--sf-primary-on-dark)]"
          >
            {tab}
          </SFTabsTrigger>
        ))}
        {["ELEVATION", "RADIUS", "BREAKPOINTS"].map((tab) => (
          <SFTabsTrigger
            key={tab}
            value={tab}
            className="border-r-2 border-foreground rounded-none px-6 py-3.5 text-[var(--text-sm)] tracking-[0.15em] data-[state=active]:bg-foreground data-[state=active]:text-[var(--sf-primary-on-dark)]"
          >
            {tab}
          </SFTabsTrigger>
        ))}
      </SFTabsList>

      {/* ═══ COLOR TAB ═══ */}
      <SFTabsContent value="COLOR" className="mt-0">
        <div className="sf-yellow-band border-b-4 border-foreground relative py-12 px-6 md:px-12">
          <h2 className="sf-display text-foreground mb-4" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
            OKLCH COLOR SYSTEM&trade;
          </h2>
          <p className="text-sm leading-[1.7] text-foreground max-w-[700px]">
            SignalframeUX&trade; uses{" "}
            <code className="bg-foreground/10 px-1.5 py-0.5 text-[var(--text-xs)]">
              oklch()
            </code>{" "}
            for perceptually uniform color. Every scale maintains consistent
            lightness across hues. No more blue looking darker than yellow at
            the same step. {COLOR_SCALES.length} scales × 12 steps = {COLOR_SCALES.length * 12} color tokens. Accept
            color into your life.&trade;
          </p>
          <div className="h-8 overflow-hidden relative mt-6 border-t border-foreground/10 border-b border-b-foreground/10">
            <div
              aria-hidden="true"
              className="flex items-center h-full whitespace-nowrap animate-marquee"
            >
              <span className="font-mono text-[var(--text-xs)] font-bold uppercase tracking-[0.15em] text-foreground">
                PERCEPTUALLY UNIFORM // OKLCH COLOR SPACE // 588 TOKENS //
                CONSISTENT ACROSS HUES //&nbsp;&nbsp;&nbsp;&nbsp;PERCEPTUALLY
                UNIFORM // OKLCH COLOR SPACE // 588 TOKENS // CONSISTENT ACROSS
                HUES //&nbsp;&nbsp;&nbsp;&nbsp;PERCEPTUALLY UNIFORM // OKLCH
                COLOR SPACE // 588 TOKENS // CONSISTENT ACROSS HUES
                //&nbsp;&nbsp;&nbsp;&nbsp;PERCEPTUALLY UNIFORM // OKLCH COLOR
                SPACE // 588 TOKENS // CONSISTENT ACROSS HUES
                //&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-baseline justify-between px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground">
          <div className="sf-display" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
            COLOR_SCALES ( {COLOR_SCALES.length} )
          </div>
          <SFButton
            intent="ghost"
            size="sm"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            aria-controls="color-scale-grid"
            className="text-[var(--text-sm)] text-primary sf-pressable"
          >
            {showAll ? "SHOW CORE" : `SHOW ALL ${COLOR_SCALES.length}`}
          </SFButton>
        </div>
        <div id="color-scale-grid" role="grid" aria-label="Color scales" data-anim="stagger" className="overflow-x-auto relative">
          <div className="md:hidden text-[var(--text-2xs)] uppercase tracking-[0.2em] text-muted-foreground text-right px-4 py-1.5 border-b border-border">
            ← SCROLL →
          </div>
          {visibleScales.map((scale, scaleIdx) => (
            <div
              key={scale.name}
              role="row"
              className="grid grid-cols-[120px_repeat(12,minmax(48px,1fr))] md:grid-cols-[200px_repeat(12,1fr)] border-b-2 border-foreground min-w-[700px]"
              onKeyDown={(e) => {
                const stepCount = scale.swatches.length;
                const currentStep = focusedSwatch.scale === scaleIdx ? focusedSwatch.step : 0;
                let next = currentStep;
                switch (e.key) {
                  case "ArrowRight": next = Math.min(currentStep + 1, stepCount - 1); break;
                  case "ArrowLeft": next = Math.max(currentStep - 1, 0); break;
                  case "Home": next = 0; break;
                  case "End": next = stepCount - 1; break;
                  case "ArrowDown": {
                    e.preventDefault();
                    const grid = e.currentTarget.parentElement;
                    const rows = grid?.querySelectorAll<HTMLElement>("[role='row']");
                    if (!rows) return;
                    const rowArr = Array.from(rows);
                    const curRowIdx = rowArr.indexOf(e.currentTarget);
                    const nextRow = rowArr[curRowIdx + 1];
                    if (!nextRow) return;
                    const targetSwatch = nextRow.querySelectorAll<HTMLElement>("[data-swatch]")[currentStep];
                    if (targetSwatch) {
                      setFocusedSwatch({ scale: scaleIdx + 1, step: currentStep });
                      targetSwatch.focus();
                    }
                    return;
                  }
                  case "ArrowUp": {
                    e.preventDefault();
                    const grid = e.currentTarget.parentElement;
                    const rows = grid?.querySelectorAll<HTMLElement>("[role='row']");
                    if (!rows) return;
                    const rowArr = Array.from(rows);
                    const curRowIdx = rowArr.indexOf(e.currentTarget);
                    if (curRowIdx <= 0) return;
                    const prevRow = rowArr[curRowIdx - 1];
                    const targetSwatch = prevRow.querySelectorAll<HTMLElement>("[data-swatch]")[currentStep];
                    if (targetSwatch) {
                      setFocusedSwatch({ scale: scaleIdx - 1, step: currentStep });
                      targetSwatch.focus();
                    }
                    return;
                  }
                  default: return;
                }
                e.preventDefault();
                setFocusedSwatch({ scale: scaleIdx, step: next });
                const row = e.currentTarget;
                const swatches = row.querySelectorAll<HTMLElement>("[data-swatch]");
                swatches[next]?.focus();
              }}
            >
              <div role="rowheader" className="px-6 flex items-center text-[var(--text-sm)] font-bold uppercase tracking-[0.1em] border-r-2 border-foreground bg-foreground text-background">
                {scale.name}
              </div>
              {scale.swatches.map((sw, stepIdx) => {
                const isDark = sw.l < 0.55;
                const oklchStr = sw.c === 0
                  ? `oklch(${sw.l} 0 0)`
                  : `oklch(${sw.l} ${sw.c} ${sw.h})`;
                const isFocused = focusedSwatch.scale === scaleIdx && focusedSwatch.step === stepIdx;
                return (
                  <div
                    key={sw.step}
                    data-swatch
                    role="gridcell"
                    aria-label={`${scale.name} ${sw.step}: ${oklchStr}`}
                    tabIndex={isFocused ? 0 : -1}
                    onFocus={() => setFocusedSwatch({ scale: scaleIdx, step: stepIdx })}
                    className="group/swatch aspect-square flex flex-col items-center justify-center relative border-r border-foreground/10 cursor-crosshair focus:outline-2 focus:outline-primary focus:outline-offset-[-2px]"
                    style={{
                      background: oklchStr,
                      color: isDark ? "var(--color-background)" : "var(--color-foreground)",
                    }}
                  >
                    <span className="text-[var(--text-xs)] font-bold uppercase opacity-70 group-hover/swatch:opacity-0 group-focus/swatch:opacity-0 transition-opacity duration-100" aria-hidden="true">
                      {sw.step}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center text-[var(--text-2xs)] font-mono font-bold opacity-0 group-hover/swatch:opacity-100 group-focus/swatch:opacity-100 transition-opacity duration-100 px-0.5 text-center leading-tight" aria-hidden="true">
                      {oklchStr}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {!showAll && (
          <div className="border-t-2 border-foreground py-12 px-6 md:px-12 text-center">
            <p className="text-[var(--text-xs)] uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {COLOR_SCALES.length - CORE_SCALE_COUNT} EXTENDED SCALES AVAILABLE
            </p>
            <p className="text-[var(--text-2xs)] uppercase tracking-[0.15em] text-muted-foreground/60 mb-6">
              FULL SPECTRUM COVERAGE AT 8-DEGREE HUE INTERVALS. SELECT A SCALE TO INSPECT.
            </p>
            <SFButton
              intent="ghost"
              size="sm"
              onClick={() => setShowAll(true)}
              className="text-[var(--text-xs)] text-primary sf-pressable uppercase tracking-[0.2em]"
            >
              SHOW ALL {COLOR_SCALES.length} SCALES
            </SFButton>
          </div>
        )}
      </SFTabsContent>

      {/* ═══ SPACING TAB ═══ */}
      <SFTabsContent value="SPACING" className="mt-0">
        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          SPACING_SCALE
        </div>
        <SFTable className="border-b-4 border-foreground">
          <SFTableHeader>
            <SFTableRow>
              <SFTableHead className="w-[120px]">TOKEN</SFTableHead>
              <SFTableHead className="w-[200px]">VALUE</SFTableHead>
              <SFTableHead>VISUAL</SFTableHead>
              <SFTableHead className="w-[120px]">PX</SFTableHead>
            </SFTableRow>
          </SFTableHeader>
          <SFTableBody>
            {SPACING.map((s) => (
              <SFTableRow key={s.name}>
                <SFTableCell className="font-bold text-[var(--text-sm)] text-foreground">{s.name}</SFTableCell>
                <SFTableCell className="text-[var(--text-sm)] text-muted-foreground">{s.rem}</SFTableCell>
                <SFTableCell>
                  <div
                    className="h-4 bg-foreground transition-[width] duration-300"
                    style={{ width: `${s.px}px` }}
                    role="img"
                    aria-label={`${s.px} pixels wide`}
                  />
                </SFTableCell>
                <SFTableCell className="text-[var(--text-xs)] text-muted-foreground text-right">{s.px}px</SFTableCell>
              </SFTableRow>
            ))}
          </SFTableBody>
        </SFTable>
      </SFTabsContent>

      {/* ═══ TYPOGRAPHY TAB ═══ */}
      <SFTabsContent value="TYPOGRAPHY" className="mt-0">
        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          TYPE_SCALE ( MINOR THIRD · 1.2 )
        </div>
        <SFTable className="border-b-4 border-foreground">
          <SFTableHeader className="sr-only">
            <SFTableRow>
              <SFTableHead>Token</SFTableHead>
              <SFTableHead>Sample</SFTableHead>
              <SFTableHead>Specification</SFTableHead>
            </SFTableRow>
          </SFTableHeader>
          <SFTableBody>
            {TYPE_SCALE.map((t) => (
              <SFTableRow key={t.name} className="align-baseline">
                <SFTableCell className="p-6 text-[var(--text-xs)] text-foreground font-bold w-[160px]">
                  {t.name}
                </SFTableCell>
                <SFTableCell
                  className="p-6 overflow-hidden whitespace-nowrap text-ellipsis"
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
                </SFTableCell>
                <SFTableCell className="p-6 text-[var(--text-sm)] text-muted-foreground text-right w-[200px]">
                  {t.meta}
                </SFTableCell>
              </SFTableRow>
            ))}
          </SFTableBody>
        </SFTable>
      </SFTabsContent>

      {/* ═══ MOTION TAB ═══ */}
      <SFTabsContent value="MOTION" className="mt-0">
        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          MOTION_TOKENS
        </div>
        <SFTable className="border-b-4 border-foreground">
          <SFTableHeader className="sr-only">
            <SFTableRow>
              <SFTableHead>Token</SFTableHead>
              <SFTableHead>Preview</SFTableHead>
              <SFTableHead>Value</SFTableHead>
            </SFTableRow>
          </SFTableHeader>
          <SFTableBody>
            {MOTION_TOKENS.map((m, i) => (
              <SFTableRow key={m.name}>
                <SFTableCell className="py-4 font-bold text-[var(--text-sm)] text-foreground w-[200px]">
                  {m.name}
                </SFTableCell>
                <SFTableCell className="py-4 relative h-6" aria-label={`Animation preview: ${m.css}`}>
                  <div
                    data-motion-preview
                    className="w-7 h-7 bg-foreground absolute top-[calc(50%-14px)]"
                    aria-hidden="true"
                    style={{
                      animation: "sf-motion-slide 2s infinite alternate",
                      animationTimingFunction: m.easing,
                    }}
                  />
                </SFTableCell>
                <SFTableCell className="py-4 text-[var(--text-xs)] text-muted-foreground text-right w-[200px]">
                  {m.css}
                </SFTableCell>
              </SFTableRow>
            ))}
          </SFTableBody>
        </SFTable>
      </SFTabsContent>

      {/* ═══ ELEVATION TAB ═══ */}
      <SFTabsContent value="ELEVATION" className="mt-0">
        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          ELEVATION_SYSTEM
        </div>
        <div className="px-6 md:px-12 py-6 border-b-2 border-foreground text-[var(--text-base)] leading-[1.8] text-muted-foreground max-w-[700px]">
          SignalframeUX&trade; uses a debossed surface model — elements are pressed <em>into</em> the surface, not floated above it. Shadows create tactile depth without z-axis lift. This is a deliberate rejection of material elevation.
        </div>
        <SFTable className="border-b-4 border-foreground">
          <SFTableHeader className="sr-only">
            <SFTableRow>
              <SFTableHead>Token</SFTableHead>
              <SFTableHead>Preview</SFTableHead>
              <SFTableHead>CSS Value</SFTableHead>
            </SFTableRow>
          </SFTableHeader>
          <SFTableBody>
            {ELEVATION_TOKENS.map((e) => (
              <SFTableRow key={e.name}>
                <SFTableCell className="p-6 px-6 font-bold text-[var(--text-sm)] text-foreground w-[200px]">
                  {e.name}
                </SFTableCell>
                <SFTableCell className="p-6 px-6">
                  <div className="flex items-center gap-6">
                    <div
                      className="w-24 h-14 border-2 border-foreground bg-background"
                      style={{ boxShadow: e.value }}
                      role="img"
                      aria-label={`${e.name} shadow on light surface`}
                    />
                    <div
                      className="w-24 h-14 border-2 border-foreground bg-foreground"
                      style={{ boxShadow: e.value }}
                      role="img"
                      aria-label={`${e.name} shadow on dark surface`}
                    />
                  </div>
                </SFTableCell>
                <SFTableCell className="p-6 px-6 text-[var(--text-xs)] text-muted-foreground font-mono text-right w-[280px]">
                  {e.css}
                </SFTableCell>
              </SFTableRow>
            ))}
          </SFTableBody>
        </SFTable>
      </SFTabsContent>

      {/* ═══ RADIUS TAB ═══ */}
      <SFTabsContent value="RADIUS" className="mt-0">
        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          RADIUS_PHILOSOPHY
        </div>
        <div className="px-6 md:px-12 py-6 border-b-2 border-foreground text-[var(--text-base)] leading-[1.8] text-muted-foreground max-w-[700px]">
          Zero radius. Everywhere. Industrial edges communicate precision and intentionality. Rounded corners soften — SignalframeUX&trade; sharpens. Every element meets at 90°.
        </div>
        <SFTable className="border-b-4 border-foreground">
          <SFTableHeader>
            <SFTableRow>
              <SFTableHead className="px-6 w-[200px]">TOKEN</SFTableHead>
              <SFTableHead className="px-6">COMPARISON</SFTableHead>
              <SFTableHead className="px-6 w-[200px]">VALUE</SFTableHead>
            </SFTableRow>
          </SFTableHeader>
          <SFTableBody>
            {RADIUS_TOKENS.map((r) => (
              <SFTableRow key={r.name}>
                <SFTableCell className="p-6 px-6 font-bold text-[var(--text-sm)] text-foreground">
                  {r.name}
                </SFTableCell>
                <SFTableCell className="p-6 px-6">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-14 h-10 border-2 border-foreground bg-foreground/20"
                        style={{ borderRadius: "0px" }}
                        role="img"
                        aria-label="SF//UX: 0px radius"
                      />
                      <span className="text-[var(--text-2xs)] text-foreground font-bold uppercase">SF//UX</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-14 h-10 border border-border bg-muted"
                        style={{ borderRadius: r.typical }}
                        role="img"
                        aria-label={`Typical: ${r.typical} radius`}
                      />
                      <span className="text-[var(--text-2xs)] text-muted-foreground uppercase">TYPICAL</span>
                    </div>
                  </div>
                </SFTableCell>
                <SFTableCell className="p-6 px-6 text-[var(--text-xs)] text-muted-foreground font-mono">
                  <span className="text-primary font-bold">0px</span>
                  <span className="ml-2 opacity-50">vs {r.typical}</span>
                </SFTableCell>
              </SFTableRow>
            ))}
          </SFTableBody>
        </SFTable>
      </SFTabsContent>

      {/* ═══ BREAKPOINTS TAB ═══ */}
      <SFTabsContent value="BREAKPOINTS" className="mt-0">
        <div className="sf-display px-6 md:px-12 pt-8 pb-4 border-b-2 border-foreground" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          BREAKPOINT_SCALE
        </div>
        <div className="px-6 md:px-12 py-6 border-b-2 border-foreground text-[var(--text-base)] leading-[1.8] text-muted-foreground max-w-[700px]">
          Mobile-first responsive tokens aligned with Tailwind CSS defaults. SignalframeUX&trade; layouts shift at these thresholds — grid columns collapse, type scales compress, and spacing tightens.
        </div>
        <SFTable className="border-b-4 border-foreground">
          <SFTableHeader>
            <SFTableRow>
              <SFTableHead className="w-[120px]">TOKEN</SFTableHead>
              <SFTableHead className="w-[120px]">MIN-WIDTH</SFTableHead>
              <SFTableHead>VISUAL</SFTableHead>
              <SFTableHead className="w-[160px]">USAGE</SFTableHead>
            </SFTableRow>
          </SFTableHeader>
          <SFTableBody>
            {BREAKPOINT_TOKENS.map((bp) => (
              <SFTableRow key={bp.name}>
                <SFTableCell className="font-bold text-[var(--text-sm)] text-foreground">{bp.name}</SFTableCell>
                <SFTableCell className="text-[var(--text-sm)] text-muted-foreground font-mono">{bp.px}px</SFTableCell>
                <SFTableCell>
                  <div className="relative h-4 bg-muted">
                    <div
                      className="h-full bg-foreground transition-[width] duration-300"
                      style={{ width: `${(bp.px / 1536) * 100}%` }}
                      role="img"
                      aria-label={`${bp.px}px of 1536px`}
                    />
                  </div>
                </SFTableCell>
                <SFTableCell className="text-[var(--text-xs)] text-muted-foreground">{bp.usage}</SFTableCell>
              </SFTableRow>
            ))}
          </SFTableBody>
        </SFTable>
      </SFTabsContent>
    </SFTabs>
  );
}
