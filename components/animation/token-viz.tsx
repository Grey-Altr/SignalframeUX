"use client";

/**
 * TokenViz — Canvas 2D visualization of the design system's own tokens.
 *
 * Renders core 5 colors, blessed spacing stops, and typography scale.
 * Redraws live on theme change via MutationObserver.
 *
 * SCN-02 — Canvas 2D rendering path (non-WebGL counterpart to SignalMesh).
 *
 * @module components/animation/token-viz
 */

import { useEffect, useRef, useCallback } from "react";
import { resolveColorToken } from "@/lib/color-resolve";

// ── Layout constants ────────────────────────────────────────────────────────
const PADDING = 32;
const SWATCH_SIZE = 48;
const GAP = 16;
const SECTION_GAP = 48;
const LABEL_FONT = '9px "JetBrains Mono", monospace';
const BAR_HEIGHT = 12;
const LEFT_LABEL_WIDTH = 40; // px reserved for spacing labels

// ── Token data ───────────────────────────────────────────────────────────────

/** Core 5 color tokens — CSS custom property names */
const COLOR_TOKENS = [
  "--color-background",
  "--color-foreground",
  "--color-primary",
  "--color-secondary",
  "--color-accent",
] as const;

/** Blessed spacing stops from CLAUDE.md (px values) */
const SPACING_STOPS = [4, 8, 12, 16, 24, 32, 48, 64, 96] as const;

/** Typography scale — actual pixel values from globals.css (base 16px) */
const TYPE_SCALE = [
  { label: "2xs", px: 9, cssVar: "--text-2xs" },
  { label: "xs", px: 10, cssVar: "--text-xs" },
  { label: "sm", px: 11, cssVar: "--text-sm" },
  { label: "base", px: 13, cssVar: "--text-base" },
  { label: "md", px: 16, cssVar: "--text-md" },
  { label: "lg", px: 18, cssVar: "--text-lg" },
  { label: "xl", px: 24, cssVar: "--text-xl" },
  { label: "2xl", px: 32, cssVar: "--text-2xl" },
  { label: "3xl", px: 48, cssVar: "--text-3xl" },
  { label: "4xl", px: 80, cssVar: "--text-4xl" },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function toRgbString(r: number, g: number, b: number, alpha = 1): string {
  if (alpha === 1) return `rgb(${r},${g},${b})`;
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Canvas 2D visualization depicting the design system's own tokens.
 *
 * - Section 1: Core 5 color swatches with CSS var names and resolved hex values
 * - Section 2: Blessed spacing stops as proportional horizontal bars
 * - Section 3: Typography scale rendered at actual font sizes
 *
 * Live-updates on dark/light mode toggle via MutationObserver.
 * No animation loop — draw-once + redraw on mutation/resize.
 *
 * @example
 * ```tsx
 * import dynamic from "next/dynamic";
 * const TokenVizLazy = dynamic(
 *   () => import("@/components/animation/token-viz").then((m) => ({ default: m.TokenViz })),
 *   { ssr: false }
 * );
 * ```
 */
export function TokenViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const w = parent ? parent.clientWidth : 800;

    // ── Section height estimates ──────────────────────────────────────────────
    // Section 1 (colors): swatch + labels ≈ SWATCH_SIZE + 32
    const colorSectionH = SWATCH_SIZE + 34;
    // Section 2 (spacing): 9 bars at BAR_HEIGHT + 8px gap each
    const spacingSectionH = SPACING_STOPS.length * (BAR_HEIGHT + 8);
    // Section 3 (typography): sum of clamped font sizes + line gaps
    const typeSectionH = TYPE_SCALE.reduce(
      (acc, { px }) => acc + Math.min(px, 80) + 8,
      0
    );

    const totalH =
      PADDING +
      colorSectionH +
      SECTION_GAP +
      spacingSectionH +
      SECTION_GAP +
      typeSectionH +
      PADDING;

    // ── DPR setup ─────────────────────────────────────────────────────────────
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(totalH * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${totalH}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ── Resolve colors once per draw ──────────────────────────────────────────
    const fg = resolveColorToken("--color-foreground");
    const bg = resolveColorToken("--color-background");

    // Clear to background
    ctx.fillStyle = toRgbString(bg.r, bg.g, bg.b);
    ctx.fillRect(0, 0, w, totalH);

    let y = PADDING;

    // ── SECTION 1: Colors ─────────────────────────────────────────────────────
    const totalSwatchWidth =
      COLOR_TOKENS.length * SWATCH_SIZE + (COLOR_TOKENS.length - 1) * GAP;
    let swatchX = PADDING;

    for (const cssVar of COLOR_TOKENS) {
      const rgb = resolveColorToken(cssVar);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const label = cssVar.replace("--color-", "");

      // Swatch fill (zero border-radius — fillRect not roundRect)
      ctx.fillStyle = toRgbString(rgb.r, rgb.g, rgb.b);
      ctx.fillRect(swatchX, y, SWATCH_SIZE, SWATCH_SIZE);

      // 1px border on swatch using foreground at 0.15 opacity
      ctx.strokeStyle = toRgbString(fg.r, fg.g, fg.b, 0.15);
      ctx.lineWidth = 1;
      ctx.strokeRect(swatchX + 0.5, y + 0.5, SWATCH_SIZE - 1, SWATCH_SIZE - 1);

      // Token name label
      ctx.font = LABEL_FONT;
      ctx.fillStyle = toRgbString(fg.r, fg.g, fg.b, 0.5);
      ctx.fillText(label, swatchX, y + SWATCH_SIZE + 13);

      // Hex value
      ctx.fillStyle = toRgbString(fg.r, fg.g, fg.b, 0.8);
      ctx.fillText(hex, swatchX, y + SWATCH_SIZE + 24);

      swatchX += SWATCH_SIZE + GAP;
    }

    // Suppress unused variable warning — totalSwatchWidth used for documentation
    void totalSwatchWidth;

    y += colorSectionH + SECTION_GAP;

    // ── SECTION 2: Spacing ────────────────────────────────────────────────────
    const maxBarWidth = w - PADDING * 2 - LEFT_LABEL_WIDTH;

    for (const stop of SPACING_STOPS) {
      const barWidth = (stop / 96) * maxBarWidth;
      const barX = PADDING + LEFT_LABEL_WIDTH;

      // Label (left-aligned in reserved space)
      ctx.font = LABEL_FONT;
      ctx.fillStyle = toRgbString(fg.r, fg.g, fg.b, 0.5);
      ctx.textAlign = "right";
      ctx.fillText(`${stop}px`, PADDING + LEFT_LABEL_WIDTH - 8, y + BAR_HEIGHT - 1);
      ctx.textAlign = "left";

      // Bar fill
      ctx.fillStyle = toRgbString(fg.r, fg.g, fg.b, 0.18);
      ctx.fillRect(barX, y, barWidth, BAR_HEIGHT);

      // Bar end marker (1px vertical line at actual pixel value boundary)
      ctx.fillStyle = toRgbString(fg.r, fg.g, fg.b, 0.4);
      ctx.fillRect(barX + barWidth, y, 1, BAR_HEIGHT);

      y += BAR_HEIGHT + 8;
    }

    y += SECTION_GAP;

    // ── SECTION 3: Typography ─────────────────────────────────────────────────
    for (const { label, px } of TYPE_SCALE) {
      // Clamp render size so very large entries don't overflow
      const renderSize = Math.min(px, 80);

      ctx.font = `${renderSize}px "Inter", sans-serif`;
      ctx.fillStyle = toRgbString(fg.r, fg.g, fg.b);

      const sampleText = `${label} — ${px}px`;
      ctx.fillText(sampleText, PADDING, y + renderSize);

      y += renderSize + 8;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Wait for fonts before first draw to avoid system-font flash
    document.fonts.ready.then(() => draw());

    // Redraw on theme class/style changes (dark/light toggle)
    const mutationObserver = new MutationObserver(() => draw());
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // Redraw on resize
    const resizeObserver = new ResizeObserver(() => draw());
    const parent = canvas.parentElement;
    if (parent) resizeObserver.observe(parent);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [draw]);

  return (
    <div className="px-6 md:px-12 py-12">
      <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold mb-6">
        TOKEN DIAGNOSTIC
      </h2>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Design system token visualization showing colors, spacing, and typography scales"
        className="w-full"
      />
    </div>
  );
}
