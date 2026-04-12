"use client";

/**
 * OKLCH-to-sRGB color bridge.
 * Extracted from canvas-cursor.tsx probe technique.
 * Used by all canvas/WebGL components to resolve CSS OKLCH tokens to sRGB.
 *
 * Phase 6: No caching — color-cycle-frame.tsx dynamically mutates --color-primary
 * via setProperty, so cached values go stale. Optimize in Phase 8.
 *
 * Phase 8: optional TTL cache added. Pass `{ ttl: ms }` as the second argument
 * to cache the resolved color for `ttl` milliseconds. Omit to bypass cache
 * entirely (default — preserves Phase 6 behavior for color-cycle-frame.tsx).
 * Cache is invalidated on `:root` class or style mutations via MutationObserver.
 *
 * @module lib/color-resolve
 */

import * as THREE from "three";

/** sRGB color values in 0-255 range */
export type RGB = { r: number; g: number; b: number };

/** Optional cache configuration */
export type ResolveColorOptions = {
  /** Time-to-live in milliseconds. When set, result is cached for this duration. */
  ttl?: number;
};

// ---------------------------------------------------------------------------
// Module-level cache — survives across renders, invalidated on :root mutation
// ---------------------------------------------------------------------------

const colorCache = new Map<string, { rgb: RGB; expires: number }>();
let cacheObserver: MutationObserver | null = null;

/** Initialize the MutationObserver lazily on first cached resolve */
function ensureCacheObserver(): void {
  if (cacheObserver || typeof window === "undefined") return;

  cacheObserver = new MutationObserver(() => {
    // Clear entire cache on any :root class or style mutation
    // (theme toggle, color-cycle-frame setProperty, etc.)
    colorCache.clear();
  });

  cacheObserver.observe(document.documentElement, {
    attributeFilter: ["class", "style"],
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve a CSS custom property (OKLCH or any format) to sRGB values.
 * Uses 1x1 canvas probe — zero bundle cost, uses browser's own color engine.
 *
 * @param cssVar - CSS custom property name including `--` prefix, e.g. `"--sfx-primary"`
 * @param options - Optional cache configuration. Omit to bypass cache (default).
 * @returns RGB object with r, g, b in 0-255 range
 *
 * @example
 * const { r, g, b } = resolveColorToken("--sfx-primary");
 * ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
 */
export function resolveColorToken(cssVar: string, options?: ResolveColorOptions): RGB {
  const ttl = options?.ttl;

  // TTL cache path — only active when ttl is explicitly provided
  if (ttl !== undefined) {
    ensureCacheObserver();

    const now = Date.now();
    const cached = colorCache.get(cssVar);
    if (cached && now < cached.expires) {
      return cached.rgb;
    }

    const rgb = probeColor(cssVar);
    colorCache.set(cssVar, { rgb, expires: now + ttl });
    return rgb;
  }

  // Default: no cache — probe every call (Phase 6 behavior)
  return probeColor(cssVar);
}

/**
 * Resolve a CSS custom property to a Three.js Color object.
 * Values are normalized from 0-255 to 0-1 range for Three.js.
 *
 * @param cssVar - CSS custom property name, e.g. `"--sfx-primary"`
 * @param options - Optional cache configuration. Omit to bypass cache (default).
 * @returns THREE.Color with components in 0-1 range
 *
 * @example
 * const color = resolveColorAsThreeColor("--sfx-accent", { ttl: 1000 });
 * material.color = color;
 */
export function resolveColorAsThreeColor(cssVar: string, options?: ResolveColorOptions): THREE.Color {
  const { r, g, b } = resolveColorToken(cssVar, options);
  return new THREE.Color(r / 255, g / 255, b / 255);
}

// ---------------------------------------------------------------------------
// Internal probe — 1x1 canvas color resolution
// ---------------------------------------------------------------------------

function probeColor(cssVar: string): RGB {
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
