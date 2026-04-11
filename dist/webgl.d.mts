import * as React$1 from 'react';
import * as THREE from 'three';

/**
 * Full-viewport WebGL canvas singleton — SIGNAL layer rendering surface.
 * Mounts a single shared Three.js WebGLRenderer canvas that all useSignalScene instances draw into.
 * Must be mounted once at app root (layout.tsx). Lazy-loaded via signal-canvas-lazy.tsx.
 *
 * @example
 * // In app/layout.tsx:
 * import dynamic from 'next/dynamic';
 * const SignalCanvas = dynamic(() => import('signalframeux/webgl').then(m => ({ default: m.SignalCanvas })), { ssr: false });
 * <SignalCanvas />
 */
declare function SignalCanvas(): React$1.JSX.Element;

type SceneBuildResult = {
    scene: THREE.Scene;
    camera: THREE.Camera;
    /** Optional custom render function. Default: renderer.render(scene, camera) */
    renderFn?: (scene: THREE.Scene, camera: THREE.Camera) => void;
};
/**
 * Register a Three.js scene with the SignalCanvas singleton.
 *
 * @param elementRef - Ref to the DOM element that defines the scene's viewport rectangle
 * @param buildScene - Factory function called once on mount to create scene + camera
 *
 * @example
 * const containerRef = useRef<HTMLDivElement>(null);
 * useSignalScene(containerRef, () => ({
 *   scene: new THREE.Scene(),
 *   camera: new THREE.PerspectiveCamera(75, 1, 0.1, 100),
 * }));
 * return <div ref={containerRef} className="w-full h-64" />;
 */
declare function useSignalScene(elementRef: React.RefObject<HTMLElement | null>, buildScene: () => SceneBuildResult): void;

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

/** sRGB color values in 0-255 range */
type RGB = {
    r: number;
    g: number;
    b: number;
};
/** Optional cache configuration */
type ResolveColorOptions = {
    /** Time-to-live in milliseconds. When set, result is cached for this duration. */
    ttl?: number;
};
/**
 * Resolve a CSS custom property (OKLCH or any format) to sRGB values.
 * Uses 1x1 canvas probe — zero bundle cost, uses browser's own color engine.
 *
 * @param cssVar - CSS custom property name including `--` prefix, e.g. `"--color-primary"`
 * @param options - Optional cache configuration. Omit to bypass cache (default).
 * @returns RGB object with r, g, b in 0-255 range
 *
 * @example
 * const { r, g, b } = resolveColorToken("--color-primary");
 * ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
 */
declare function resolveColorToken(cssVar: string, options?: ResolveColorOptions): RGB;

export { SignalCanvas, resolveColorToken, useSignalScene };
