"use client";

import { type KeyboardEvent } from "react";

type ColorSwatch = { step: number; l: number; c: number; h: number };
type ColorScale = { name: string; hue: number; swatches: ColorSwatch[] };

interface ColorSpecimenProps {
  scales: ColorScale[];
  coreCount: number;
  showAll: boolean;
  onToggleShowAll: () => void;
  focusedSwatch: { scale: number; step: number };
  onFocusSwatch: (pos: { scale: number; step: number }) => void;
}

/**
 * OKLCH swatch matrix specimen.
 *
 * - Each swatch is inline-styled with its exact oklch() value.
 * - L / C / H axis labels displayed as visible text (LIGHTNESS / CHROMA / HUE).
 * - Arrow-key navigation between swatches (preserved from prior TokenTabs inline impl).
 * - Default view shows the first `coreCount` scales; `onToggleShowAll` expands to full set.
 * - Focus metadata readout below the matrix shows the L/C/H numeric values for the focused swatch.
 *
 * Client Component -- needs keyboard handlers and focus state.
 */
export function ColorSpecimen({
  scales,
  coreCount,
  showAll,
  onToggleShowAll,
  focusedSwatch,
  onFocusSwatch,
}: ColorSpecimenProps) {
  const visibleScales = showAll ? scales : scales.slice(0, coreCount);
  const focusedScale = visibleScales[focusedSwatch.scale];
  const focusedStepSwatch = focusedScale?.swatches[focusedSwatch.step];

  const handleRowKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    scaleIdx: number,
  ) => {
    const scale = visibleScales[scaleIdx];
    if (!scale) return;
    const stepCount = scale.swatches.length;
    const currentStep =
      focusedSwatch.scale === scaleIdx ? focusedSwatch.step : 0;
    let next = currentStep;

    switch (e.key) {
      case "ArrowRight":
        next = Math.min(currentStep + 1, stepCount - 1);
        break;
      case "ArrowLeft":
        next = Math.max(currentStep - 1, 0);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = stepCount - 1;
        break;
      case "ArrowDown": {
        e.preventDefault();
        const grid = e.currentTarget.parentElement;
        const rows = grid?.querySelectorAll<HTMLElement>("[role='row']");
        if (!rows) return;
        const rowArr = Array.from(rows);
        const curRowIdx = rowArr.indexOf(e.currentTarget);
        const nextRow = rowArr[curRowIdx + 1];
        if (!nextRow) return;
        const targetSwatch = nextRow.querySelectorAll<HTMLElement>(
          "[data-oklch-swatch]",
        )[currentStep];
        if (targetSwatch) {
          onFocusSwatch({ scale: scaleIdx + 1, step: currentStep });
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
        const targetSwatch = prevRow.querySelectorAll<HTMLElement>(
          "[data-oklch-swatch]",
        )[currentStep];
        if (targetSwatch) {
          onFocusSwatch({ scale: scaleIdx - 1, step: currentStep });
          targetSwatch.focus();
        }
        return;
      }
      default:
        return;
    }

    e.preventDefault();
    onFocusSwatch({ scale: scaleIdx, step: next });
    const row = e.currentTarget;
    const swatches = row.querySelectorAll<HTMLElement>("[data-oklch-swatch]");
    swatches[next]?.focus();
  };

  return (
    <div className="border-b-4 border-foreground">
      {/* ── HEADER / AXIS LEGEND / TOGGLE ── */}
      <div className="border-b-2 border-foreground px-6 md:px-12 py-8 space-y-4">
        <div className="sf-display" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
          OKLCH_MATRIX ( {scales.length} )
        </div>
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
          <div className="flex flex-wrap gap-6 font-mono text-[var(--text-2xs)] uppercase tracking-[0.2em] text-muted-foreground">
            <span>
              <span className="text-foreground font-bold">L</span> = LIGHTNESS
            </span>
            <span>
              <span className="text-foreground font-bold">C</span> = CHROMA
            </span>
            <span>
              <span className="text-foreground font-bold">H</span> = HUE
            </span>
          </div>
          <button
            type="button"
            onClick={onToggleShowAll}
            aria-expanded={showAll}
            aria-controls="color-oklch-matrix"
            className="font-mono text-[var(--text-2xs)] uppercase tracking-[0.2em] border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors duration-100 sf-pressable"
          >
            {showAll ? `SHOW CORE ${coreCount}` : `SHOW ALL ${scales.length}`}
          </button>
        </div>
      </div>

      {/* ── SWATCH MATRIX ── */}
      <div
        id="color-oklch-matrix"
        role="grid"
        aria-label="OKLCH color scales"
        data-anim="stagger"
        className="overflow-x-auto relative"
      >
        <div className="md:hidden text-[var(--text-2xs)] uppercase tracking-[0.2em] text-muted-foreground text-right px-4 py-1.5 border-b border-foreground/20">
          &larr; SCROLL &rarr;
        </div>
        {visibleScales.map((scale, scaleIdx) => (
          <div
            key={scale.name}
            role="row"
            className="grid grid-cols-[120px_repeat(12,minmax(48px,1fr))] md:grid-cols-[200px_repeat(12,1fr)] border-b border-foreground/15 min-w-[700px]"
            onKeyDown={(e) => handleRowKeyDown(e, scaleIdx)}
          >
            <div
              role="rowheader"
              className="px-4 flex flex-col justify-center font-mono text-[var(--text-2xs)] uppercase tracking-[0.15em] border-r border-foreground/15 bg-background"
            >
              <span className="text-foreground font-bold">{scale.name}</span>
              <span className="text-muted-foreground">H:{scale.hue}</span>
            </div>
            {scale.swatches.map((sw, stepIdx) => {
              const oklchStr =
                sw.c === 0
                  ? `oklch(${sw.l.toFixed(3)} 0 0)`
                  : `oklch(${sw.l.toFixed(3)} ${sw.c.toFixed(3)} ${sw.h.toFixed(1)})`;
              const isFocused =
                focusedSwatch.scale === scaleIdx &&
                focusedSwatch.step === stepIdx;
              return (
                <div
                  key={sw.step}
                  data-oklch-swatch={`${scale.name}-${sw.step}`}
                  role="gridcell"
                  tabIndex={isFocused ? 0 : -1}
                  aria-label={`${scale.name} step ${sw.step} ${oklchStr}`}
                  onFocus={() =>
                    onFocusSwatch({ scale: scaleIdx, step: stepIdx })
                  }
                  className="aspect-square border-r border-foreground/10 cursor-crosshair focus:outline-2 focus:outline-foreground focus:outline-offset-[-2px]"
                  style={{ backgroundColor: oklchStr }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* ── FOCUS READOUT ── */}
      {focusedScale && focusedStepSwatch && (
        <div className="px-6 md:px-12 py-6 border-t-2 border-foreground font-mono text-[var(--text-2xs)] uppercase tracking-[0.2em] text-muted-foreground flex flex-wrap gap-6">
          <span className="text-foreground font-bold">FOCUS //</span>
          <span>
            {focusedScale.name}.{focusedStepSwatch.step}
          </span>
          <span>L:{focusedStepSwatch.l.toFixed(3)}</span>
          <span>C:{focusedStepSwatch.c.toFixed(3)}</span>
          <span>H:{focusedStepSwatch.h.toFixed(1)}</span>
        </div>
      )}

      {!showAll && (
        <div className="border-t border-foreground/20 py-10 px-6 md:px-12 text-center">
          <p className="text-[var(--text-2xs)] uppercase tracking-[0.2em] text-muted-foreground">
            {scales.length - coreCount} EXTENDED SCALES AVAILABLE &middot; FULL SPECTRUM COVERAGE AT 8-DEGREE HUE INTERVALS
          </p>
        </div>
      )}
    </div>
  );
}
