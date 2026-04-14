/**
 * Runtime quality-tier computation for the effects subsystem.
 *
 * Evaluates DPR, GPU capability (WebGL2 / renderer string), core count,
 * reduced-motion preference, and an optional live FPS probe to bucket the
 * device into one of four tiers: ultra | high | medium | fallback.
 *
 * Tier selection is deterministic for the same hardware + preferences.
 * The result is cached for the page lifetime (hardware doesn't change mid-session).
 *
 * @module lib/effects/quality-tier
 */

export type QualityTier = "ultra" | "high" | "medium" | "fallback";

type GPUProfile = {
  webgl2: boolean;
  renderer: string;
  maxTextureSize: number;
};

const TIER_KEY = "__sfx_quality_tier" as const;

function getGPUProfile(): GPUProfile | null {
  if (typeof document === "undefined") return null;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    if (!gl) return null;

    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg
      ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)
      : gl.getParameter(gl.RENDERER);
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const isWebGL2 = "createTransformFeedback" in gl;

    const ext = gl.getExtension("WEBGL_lose_context");
    ext?.loseContext();

    return { webgl2: isWebGL2, renderer: String(renderer), maxTextureSize: maxTex };
  } catch {
    return null;
  }
}

const LOW_END_GPU_PATTERNS = [
  /swiftshader/i,
  /llvmpipe/i,
  /mesa/i,
  /intel.*hd.*[2-4]\d{3}/i,
  /intel.*uhd.*6[0-2]\d/i,
  /adreno.*[1-4]\d{2}/i,
  /mali-t/i,
  /powervr/i,
];

function isLowEndGPU(renderer: string): boolean {
  return LOW_END_GPU_PATTERNS.some((p) => p.test(renderer));
}

function computeTier(): QualityTier {
  if (typeof window === "undefined") return "fallback";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reducedMotion) return "fallback";

  const gpu = getGPUProfile();
  if (!gpu) return "fallback";

  const cores = navigator.hardwareConcurrency ?? 2;
  const dpr = Math.min(window.devicePixelRatio ?? 1, 3);

  if (isLowEndGPU(gpu.renderer)) return cores <= 2 ? "fallback" : "medium";

  if (!gpu.webgl2 || gpu.maxTextureSize < 4096) return "medium";

  if (cores >= 8 && dpr >= 2 && gpu.maxTextureSize >= 8192) return "ultra";

  if (cores >= 4 && dpr >= 1.5) return "high";

  return "medium";
}

/**
 * Return the cached quality tier for the current device.
 * Computed once on first call, then memoised on globalThis.
 */
export function getQualityTier(): QualityTier {
  const g = globalThis as unknown as Record<string, QualityTier | undefined>;
  if (!g[TIER_KEY]) {
    g[TIER_KEY] = computeTier();
  }
  return g[TIER_KEY]!;
}

/**
 * Force recompute (useful after a runtime motion-preference change).
 */
export function resetQualityTier(): void {
  const g = globalThis as unknown as Record<string, QualityTier | undefined>;
  delete g[TIER_KEY];
}

/**
 * Numeric multiplier 0–1 usable as a uniform scaling factor.
 */
export function tierMultiplier(tier?: QualityTier): number {
  const t = tier ?? getQualityTier();
  switch (t) {
    case "ultra":
      return 1.0;
    case "high":
      return 0.75;
    case "medium":
      return 0.45;
    case "fallback":
      return 0;
  }
}
