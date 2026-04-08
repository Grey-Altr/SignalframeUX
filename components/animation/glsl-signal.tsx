"use client";

/**
 * GLSLSignal — Ikeda-inspired data field for the SIGNAL homepage section.
 *
 * Visual language: Ryoji Ikeda aesthetic — scanlines, data columns, precise
 * signal spikes. High contrast dark field with sparse bright elements.
 * Three color registers:
 *   uForeground  — base scanline grid (--color-foreground, near-black/white)
 *   uPrimary     -- signal data columns (--color-primary, pink/magenta)
 *   uWarning     — peak spike markers (--color-warning, yellow)
 *
 * 3rd concurrent WebGL scene registered with the SignalCanvas singleton via
 * useSignalScene. Architecture differences from GLSLHero:
 * 1. Non-interactive — no pointer uniform
 * 2. No CSS var observer — uIntensity locked 1.0
 * 3. No ScrollTrigger — parent SignalSection owns scroll lifecycle
 * 4. forwardRef so parent can receive container div if needed
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 *
 * @module components/animation/glsl-signal
 */

import { useRef, useEffect, useState, forwardRef } from "react";
import * as THREE from "three";
import { useSignalScene } from "@/hooks/use-signal-scene";
import { resolveColorAsThreeColor } from "@/lib/color-resolve";
import { gsap, useGSAP } from "@/lib/gsap-core";

// ---------------------------------------------------------------------------
// WebGL availability check — globalThis cache (iOS Safari context limit)
// ---------------------------------------------------------------------------

const _g = globalThis as unknown as { __sf_has_webgl?: boolean };

function checkWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (_g.__sf_has_webgl !== undefined) return _g.__sf_has_webgl;
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
    _g.__sf_has_webgl = !!ctx;
    if (ctx) {
      const ext = (ctx as WebGLRenderingContext).getExtension("WEBGL_lose_context");
      ext?.loseContext();
    }
    return _g.__sf_has_webgl;
  } catch {
    _g.__sf_has_webgl = false;
    return false;
  }
}

// ---------------------------------------------------------------------------
// Vertex shader — pass-through (identical to GLSLHero)
// ---------------------------------------------------------------------------

const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// Fragment shader — Ikeda data field
//
// Layered composition:
//   1. Dense horizontal scanlines (uForeground, very dim) — structural grid
//   2. Vertical data columns (uPrimary, strobing binary) — signal registers
//   3. Horizontal data bursts (uForeground, sparse) — transmission events
//   4. Peak spike markers (uWarning yellow, rare) — perception threshold hits
//
// Hash-driven pseudo-random gives systematic feel (Ikeda: rule-based, not
// organic). Time updates are slow — Ikeda scenes breathe, they don't animate.
// ---------------------------------------------------------------------------

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec3  uForeground;
  uniform vec3  uPrimary;
  uniform vec3  uWarning;

  // Deterministic hash — 2D → [0,1]
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // 1D hash from float
  float hash1(float v) {
    return fract(sin(v * 43758.5453) * 127.1);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    // Flip Y so top is uv.y=1.0
    uv.y = 1.0 - uv.y;

    vec3 col = vec3(0.0);

    // ── 1. Horizontal scanlines — thin bright lines on dark field ────────────
    // 120 lines across the viewport height, ~1px each
    float lineFreq = 120.0;
    float lineV    = fract(uv.y * lineFreq);
    float line     = step(0.94, lineV); // top 6% of each line slot = bright
    col += uForeground * line * 0.12;

    // ── 2. Vertical data columns — binary strobing ───────────────────────────
    // 32 columns. Each column's hash determines if it's "active" this frame.
    // Columns update at ~2Hz (floor(uTime * 2.0)) for digital feel.
    float colCount = 32.0;
    float colIndex = floor(uv.x * colCount);
    float colPhase = hash(vec2(colIndex, floor(uTime * 2.0)));
    float colOn    = step(0.6, colPhase); // 40% of columns active at any time

    // Column brightness: varies by position within the column (top-heavy data)
    float colBrightness = hash(vec2(colIndex, floor(uv.y * 8.0 + uTime * 0.5)));
    float colEdge = step(0.97, fract(uv.x * colCount)); // column separator (1px)

    col += uPrimary * colOn * colBrightness * 0.35;
    col += uForeground * colEdge * 0.08; // column separators always visible

    // ── 3. Horizontal data bursts — brief bright lines ───────────────────────
    // 8 possible burst positions. Each burst fires for ~0.1s, then off.
    float burstSlot  = floor(uTime * 10.0);
    float burstY     = hash1(burstSlot + 7.3);   // random vertical position
    float burstDist  = abs(uv.y - burstY);
    float burst      = step(burstDist, 0.003);   // very thin line
    float burstFire  = step(0.7, hash1(burstSlot)); // 30% chance of firing
    col += uForeground * burst * burstFire * 0.6;

    // ── 4. Peak spike markers — yellow, rarest element ───────────────────────
    // One spike per ~3s at a hash-determined column + y position.
    float spikeSlot = floor(uTime * 0.33);
    float spikeX    = hash1(spikeSlot * 3.7);
    float spikeY    = hash1(spikeSlot * 5.1);
    float spikeDX   = abs(uv.x - spikeX);
    float spikeDY   = abs(uv.y - spikeY);
    // Cross-hair spike: thin horizontal + vertical marker
    float spikeH    = step(spikeDY, 0.002) * step(spikeDX, 0.03);
    float spikeV    = step(spikeDX, 0.002) * step(spikeDY, 0.03);
    float spike     = clamp(spikeH + spikeV, 0.0, 1.0);
    col += uWarning * spike * 0.9;

    // ── 5. Background texture — very faint FBM to prevent pure black ─────────
    float bgNoise = fract(sin(dot(uv * 50.0, vec2(12.9898, 78.233))) * 43758.5453);
    col += uForeground * bgNoise * 0.018;

    // Clamp and output — fully opaque so the section background shows through
    // the canvas alpha (transparent material) below the data field
    float alpha = clamp(length(col) * 2.0, 0.0, 1.0);
    gl_FragColor = vec4(clamp(col, 0.0, 1.0), alpha);
  }
`;

// ---------------------------------------------------------------------------
// Reduced-motion static fallback
// ---------------------------------------------------------------------------

function GLSLSignalFallback() {
  return (
    <div
      data-signal-scene="static-fallback"
      className="absolute inset-0 z-0 rounded-none"
      aria-hidden="true"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 7px, oklch(0.145 0 0 / 0.06) 8px)",
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Inner WebGL component
// ---------------------------------------------------------------------------

const GLSLSignalWebGL = forwardRef<HTMLDivElement>(
  function GLSLSignalWebGL(_, forwardedRef) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Expose container ref for parent (parallax or layout use)
    // No useImperativeHandle needed — forwardedRef is unused by parent now
    void forwardedRef;

    const uniformsRef = useRef<{
      uTime:       THREE.IUniform<number>;
      uResolution: THREE.IUniform<THREE.Vector2>;
      uForeground: THREE.IUniform<THREE.Color>;
      uPrimary:    THREE.IUniform<THREE.Color>;
      uWarning:    THREE.IUniform<THREE.Color>;
    } | null>(null);

    // ResizeObserver — update uResolution on container resize
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const observer = new ResizeObserver(() => {
        if (!uniformsRef.current) return;
        uniformsRef.current.uResolution.value.set(
          container.clientWidth,
          container.clientHeight,
        );
      });
      observer.observe(container);
      return () => observer.disconnect();
    }, []);

    const buildScene = () => {
      const container = containerRef.current!;
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const scene = new THREE.Scene();

      const uniforms = {
        uTime:       { value: 0 },
        uResolution: {
          value: new THREE.Vector2(container.clientWidth, container.clientHeight),
        },
        uForeground: {
          value: resolveColorAsThreeColor("--color-foreground", { ttl: 2000 }),
        },
        uPrimary: {
          value: resolveColorAsThreeColor("--color-primary", { ttl: 2000 }),
        },
        uWarning: {
          value: resolveColorAsThreeColor("--color-warning", { ttl: 2000 }),
        },
      };
      uniformsRef.current = uniforms;

      const geo = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader:   VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms,
        transparent: true,
        depthWrite:  false,
      });

      scene.add(new THREE.Mesh(geo, material));
      return { scene, camera };
    };

    useSignalScene(
      containerRef as React.RefObject<HTMLElement | null>,
      buildScene,
    );

    // Ticker — uTime drives column strobing + burst timing
    useGSAP(
      () => {
        const tickerFn = () => {
          if (!uniformsRef.current) return;
          uniformsRef.current.uTime.value += 0.016;
        };
        gsap.ticker.remove(tickerFn);
        gsap.ticker.add(tickerFn);
        return () => { gsap.ticker.remove(tickerFn); };
      },
      { scope: containerRef, dependencies: [] },
    );

    return (
      <div
        ref={containerRef}
        data-signal-scene="glsl-signal"
        className="absolute inset-0 z-0 rounded-none"
        aria-hidden="true"
      />
    );
  },
);

GLSLSignalWebGL.displayName = "GLSLSignalWebGL";

// ---------------------------------------------------------------------------
// GLSLSignal — outer component, branches on reduced-motion / WebGL
// ---------------------------------------------------------------------------

export const GLSLSignal = forwardRef<HTMLDivElement>(
  function GLSLSignal(_, forwardedRef) {
    const [hasWebGL] = useState(() => checkWebGL());
    const [isReducedMotion, setIsReducedMotion] = useState(() => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });

    useEffect(() => {
      if (typeof window === "undefined") return;
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handler = () => setIsReducedMotion(mq.matches);
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }, []);

    if (!hasWebGL || isReducedMotion) {
      return <GLSLSignalFallback />;
    }

    return <GLSLSignalWebGL ref={forwardedRef} />;
  },
);

GLSLSignal.displayName = "GLSLSignal";
