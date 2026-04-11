"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap-core";

// ---------------------------------------------------------------------------
// Singleton key — mirrors use-scramble-text.ts HMR-safe pattern
// ---------------------------------------------------------------------------
const SIGNAL_KEY = "__sf_signal_canvas" as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SceneEntry = {
  element: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.Camera;
  /** Custom render function. Default: renderer.render(scene, camera) */
  renderFn: (scene: THREE.Scene, camera: THREE.Camera) => void;
  visible: boolean;
};

type SignalCanvasState = {
  renderer: THREE.WebGLRenderer | null;
  canvas: HTMLCanvasElement | null;
  scenes: Map<string, SceneEntry>;
  tickerCallback: (() => void) | null;
  reducedMotion: boolean;
  mql: MediaQueryList | null;
};

// ---------------------------------------------------------------------------
// Singleton accessor — survives HMR, never re-initialises on hot reload
// ---------------------------------------------------------------------------

export function getState(): SignalCanvasState {
  const g = globalThis as unknown as Record<string, SignalCanvasState | undefined>;
  if (!g[SIGNAL_KEY]) {
    g[SIGNAL_KEY] = {
      renderer: null,
      canvas: null,
      scenes: new Map(),
      tickerCallback: null,
      reducedMotion: false,
      mql: null,
    };
  }
  return g[SIGNAL_KEY]!;
}

// ---------------------------------------------------------------------------
// Render all visible scenes using scissor/viewport split
// Y-axis conversion: Three.js uses bottom-left origin (Y-up).
// getBoundingClientRect() uses top-left origin (Y-down).
// Convert: canvasY = canvas.clientHeight - rect.bottom
// ---------------------------------------------------------------------------

function renderAllScenes(state: SignalCanvasState): void {
  const { renderer, scenes } = state;
  if (!renderer) return;

  renderer.setScissorTest(false);
  renderer.clear();
  renderer.setScissorTest(true);

  scenes.forEach((entry) => {
    if (!entry.visible) return;

    const rect = entry.element.getBoundingClientRect();
    // Skip zero-size or fully offscreen elements
    if (rect.width === 0 || rect.height === 0) return;

    const canvasH = renderer.domElement.clientHeight;
    // Y-axis inversion: Three.js origin is bottom-left, DOM origin is top-left
    const canvasY = canvasH - rect.bottom;

    renderer.setScissor(rect.left, canvasY, rect.width, rect.height);
    renderer.setViewport(rect.left, canvasY, rect.width, rect.height);
    entry.renderFn(entry.scene, entry.camera);
  });
}

// ---------------------------------------------------------------------------
// Public API: initSignalCanvas
// ---------------------------------------------------------------------------

export function initSignalCanvas(canvas: HTMLCanvasElement): void {
  const state = getState();

  // Guard: singleton already initialised — do nothing
  if (state.renderer) return;

  state.canvas = canvas;

  // Create renderer — antialias off for pixel-sharp DU/TDR aesthetic
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  state.renderer = renderer;

  // Reduced-motion detection
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  state.reducedMotion = mql.matches;
  state.mql = mql;

  // GSAP ticker callback — GSAP is the ONLY render driver (not the Three.js animation loop)
  const tickerCallback = () => {
    if (state.reducedMotion || state.scenes.size === 0) return;
    renderAllScenes(state);
  };
  state.tickerCallback = tickerCallback;

  if (!state.reducedMotion) {
    gsap.ticker.add(tickerCallback);
  } else {
    // Static fallback: render exactly one frame for reduced-motion users
    renderAllScenes(state);
  }

  // Runtime motion change handler — mirrors lenis-provider.tsx lines 32-38
  const motionHandler = (e: MediaQueryListEvent) => {
    state.reducedMotion = e.matches;
    if (e.matches) {
      // Entering reduced-motion: stop ticker, render one static frame
      gsap.ticker.remove(tickerCallback);
      renderAllScenes(state);
    } else {
      // Leaving reduced-motion: re-add ticker to resume animation
      gsap.ticker.add(tickerCallback);
    }
  };
  mql.addEventListener("change", motionHandler);

  // Resize handler — passive for scroll performance
  const resizeHandler = () => {
    if (!state.renderer) return;
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    // Render one frame immediately so scenes update layout after resize
    renderAllScenes(state);
  };
  window.addEventListener("resize", resizeHandler, { passive: true });
}

// ---------------------------------------------------------------------------
// Public API: registerScene
// ---------------------------------------------------------------------------

export function registerScene(
  id: string,
  entry: Omit<SceneEntry, "renderFn"> & { renderFn?: SceneEntry["renderFn"] }
): void {
  const state = getState();
  const resolvedEntry: SceneEntry = {
    ...entry,
    // Default renderFn delegates to the singleton renderer
    renderFn:
      entry.renderFn ??
      ((scene, camera) => {
        if (state.renderer) state.renderer.render(scene, camera);
      }),
  };
  state.scenes.set(id, resolvedEntry);
}

// ---------------------------------------------------------------------------
// Public API: deregisterScene
// ---------------------------------------------------------------------------

export function deregisterScene(id: string): void {
  const state = getState();
  state.scenes.delete(id);
  // NOTE: do NOT call disposeScene here — that is the caller's (hook's) responsibility
}

// ---------------------------------------------------------------------------
// Public API: setSceneVisibility (called by IntersectionObserver in hook)
// ---------------------------------------------------------------------------

export function setSceneVisibility(id: string, visible: boolean): void {
  const state = getState();
  const entry = state.scenes.get(id);
  if (entry) {
    entry.visible = visible;
  }
}

// ---------------------------------------------------------------------------
// Public API: disposeScene — traverses the scene graph and frees GPU memory
// Geometries, materials, and textures are all disposed.
// Does NOT dispose the singleton renderer — that lives for the page lifetime.
// ---------------------------------------------------------------------------

export function disposeScene(scene: THREE.Scene): void {
  scene.traverse((object) => {
    // Cast to Mesh to access geometry/material (not all objects have them)
    const mesh = object as THREE.Mesh;

    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    if (mesh.material) {
      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : [mesh.material];

      materials.forEach((mat: THREE.Material) => {
        // Dispose all texture slots on the material
        Object.values(mat).forEach((value) => {
          if (value instanceof THREE.Texture) {
            value.dispose();
          }
        });
        mat.dispose();
      });
    }
  });
}

// ---------------------------------------------------------------------------
// SignalCanvas React component — mounts the full-viewport canvas
// Consumed exclusively via signal-canvas-lazy.tsx (next/dynamic, ssr: false)
// ---------------------------------------------------------------------------

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
export function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    initSignalCanvas(canvasRef.current);
    // Do NOT clean up renderer on unmount — singleton survives route changes.
    // The canvas element itself is preserved; React does not unmount layout.tsx providers.
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Generative visual — decorative"
      role="img"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
