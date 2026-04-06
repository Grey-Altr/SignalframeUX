"use client";

/**
 * OKLCH-to-sRGB color bridge.
 * Extracted from canvas-cursor.tsx probe technique.
 * Used by all canvas/WebGL components to resolve CSS OKLCH tokens to sRGB.
 *
 * Phase 6: No caching — color-cycle-frame.tsx dynamically mutates --color-primary
 * via setProperty, so cached values go stale. Optimize in Phase 8.
 *
 * @module lib/color-resolve
 */

import * as THREE from "three";

/** sRGB color values in 0-255 range */
export type RGB = { r: number; g: number; b: number };

/**
 * Resolve a CSS custom property (OKLCH or any format) to sRGB values.
 * Uses 1x1 canvas probe — zero bundle cost, uses browser's own color engine.
 *
 * @param cssVar - CSS custom property name including `--` prefix, e.g. `"--color-primary"`
 * @returns RGB object with r, g, b in 0-255 range
 */
export function resolveColorToken(cssVar: string): RGB {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();

  if (!raw) return { r: 255, g: 0, b: 128 }; // magenta fallback (matches canvas-cursor.tsx)

  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const ctx = probe.getContext("2d");
  if (!ctx) return { r: 255, g: 0, b: 128 };

  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b };
}

/**
 * Resolve a CSS custom property to a Three.js Color object.
 * Values are normalized from 0-255 to 0-1 range for Three.js.
 *
 * @param cssVar - CSS custom property name, e.g. `"--color-primary"`
 * @returns THREE.Color with components in 0-1 range
 */
export function resolveColorAsThreeColor(cssVar: string): THREE.Color {
  const { r, g, b } = resolveColorToken(cssVar);
  return new THREE.Color(r / 255, g / 255, b / 255);
}
