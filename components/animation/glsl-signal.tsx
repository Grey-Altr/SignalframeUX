"use client";

/**
 * GLSLSignal — Full-screen pure FBM noise field for the SIGNAL homepage section.
 *
 * 3rd concurrent WebGL scene registered with the SignalCanvas singleton via
 * useSignalScene. Architecture differences from GLSLHero:
 * 1. Non-interactive — no pointer uniform (pure atmospheric perception)
 * 2. No CSS var observer — uIntensity is LOCKED to 1.0 at buildScene time (never updated)
 * 3. No ScrollTrigger — parent SignalSection owns the scroll lifecycle
 * 4. FRAGMENT_SHADER has no grid lines — pure FBM noise field for atmospheric breathing
 * 5. forwardRef so parent SignalSection can receive the inner container div for parallax
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 *
 * @module components/animation/glsl-signal
 */

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { useSignalScene } from "@/hooks/use-signal-scene";
import { resolveColorAsThreeColor } from "@/lib/color-resolve";
import { gsap, useGSAP } from "@/lib/gsap-core";

// ---------------------------------------------------------------------------
// WebGL availability check — globalThis cache prevents extra context creation
// on iOS Safari (which enforces a 2-8 context limit).
// ---------------------------------------------------------------------------

const _g = globalThis as unknown as { __sf_has_webgl?: boolean };

function checkWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (_g.__sf_has_webgl !== undefined) return _g.__sf_has_webgl;
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
    _g.__sf_has_webgl = !!ctx;
    // Force-lose the test context immediately so it doesn't count against the limit
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
// Vertex shader — pass-through, fills NDC space (identical to GLSLHero)
// ---------------------------------------------------------------------------

const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// Fragment shader — pure FBM noise field, no grid, no dither overlay
//
// uIntensity is a constant 1.0 (locked at buildScene time) — no observer.
// Intentionally minimal: non-interactive, no scroll uniforms, no ordered dither,
// no geometric grid lines — pure FBM field for atmospheric breathing.
// ---------------------------------------------------------------------------

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3  uColor;
  uniform vec2  uResolution;
  uniform float uIntensity;  // Locked to 1.0 — never updated by observer

  // ── Hash function — deterministic pseudo-random from 2D input ────────────
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // ── Value noise — smooth interpolation between hashed corners ────────────
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // ── FBM — 4 octaves, 0.5 amplitude decay per octave ─────────────────────
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // Pure FBM noise field — atmospheric breathing, no grid overlay
    // Slower time offsets (0.08, 0.05) vs GLSLHero (0.1, 0.07) for atmospheric feel
    float fbmOffsetX = uTime * 0.08;
    float fbmOffsetY = uTime * 0.05;
    float n = fbm(uv * 4.0 + vec2(fbmOffsetX, fbmOffsetY));

    // uIntensity locked to 1.0 — full noise amplitude, no lattice blend
    float signal = n * (0.5 + uIntensity * 0.5);

    // Output — monochrome using --color-primary, fully opaque
    gl_FragColor = vec4(uColor * signal, 1.0);
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
      style={{ backgroundColor: "var(--color-primary)", opacity: 0.08 }}
    />
  );
}

// ---------------------------------------------------------------------------
// Inner WebGL component — only mounted when hasWebGL && !isReducedMotion.
// Keeps hooks call order unconditional within this component.
// ---------------------------------------------------------------------------

const GLSLSignalWebGL = forwardRef<HTMLDivElement>(
  function GLSLSignalWebGL(_, forwardedRef) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Forward the inner container ref so SignalSection can mutate its transform for parallax
    useImperativeHandle(
      forwardedRef,
      () => containerRef.current as HTMLDivElement,
      [],
    );

    // Uniforms ref — accessible from ticker closure
    const uniformsRef = useRef<{
      uTime:       THREE.IUniform<number>;
      uColor:      THREE.IUniform<THREE.Color>;
      uResolution: THREE.IUniform<THREE.Vector2>;
      uIntensity:  THREE.IUniform<number>;
    } | null>(null);

    // ResizeObserver — update uResolution uniform on container resize
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

    // buildScene factory — called once by useSignalScene on mount
    const buildScene = () => {
      const container = containerRef.current!;
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const scene = new THREE.Scene();

      const primaryColor = resolveColorAsThreeColor("--color-primary", {
        ttl: 2000,
      });

      const uniforms = {
        uTime:       { value: 0 },
        uColor:      { value: primaryColor },
        uResolution: {
          value: new THREE.Vector2(
            container.clientWidth,
            container.clientHeight,
          ),
        },
        uIntensity: { value: 1.0 }, // LOCKED — never updated, no observer
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

      const mesh = new THREE.Mesh(geo, material);
      scene.add(mesh);

      return { scene, camera };
    };

    // Register the 3rd concurrent scene with the SignalCanvas singleton.
    // The scissor/viewport follows containerRef.current.getBoundingClientRect()
    // automatically on each ticker frame — parallax translateY on the wrapper
    // shifts the rect, which shifts the scissor region.
    useSignalScene(
      containerRef as React.RefObject<HTMLElement | null>,
      buildScene,
    );

    // Ticker — accumulate uTime for FBM drift
    useGSAP(
      () => {
        const tickerFn = () => {
          if (!uniformsRef.current) return;
          uniformsRef.current.uTime.value += 0.016;
        };

        // Remove any stale ticker before registering (HMR safety)
        gsap.ticker.remove(tickerFn);
        gsap.ticker.add(tickerFn);

        return () => {
          gsap.ticker.remove(tickerFn);
        };
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
// GLSLSignal — outer component. Branches on reduced-motion / WebGL availability.
// Inner split pattern avoids unconditional hook-with-noop-buildScene issues.
// ---------------------------------------------------------------------------

/**
 * Full-screen atmospheric FBM noise field for the SIGNAL section.
 * 3rd concurrent WebGL scene in the SignalCanvas singleton.
 * Falls back to a static div under reduced-motion or no-WebGL.
 *
 * forwardRef: parent SignalSection receives the container div to drive parallax translateY.
 */
export const GLSLSignal = forwardRef<HTMLDivElement>(
  function GLSLSignal(_, forwardedRef) {
    const [hasWebGL] = useState(() => checkWebGL());
    const [isReducedMotion, setIsReducedMotion] = useState(() => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });

    // Update reduced-motion state on change (accessibility)
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
