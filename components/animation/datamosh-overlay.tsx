"use client";

/**
 * DatamoshOverlay — ambient fullscreen WebGL fragment shader.
 *
 * Produces noise-driven micro-displacement with chromatic aberration (R/G/B
 * channel separation) composited at the SignalCanvas layer (z:-1). The effect
 * sits in the "close inspection zone": 1-2px drift visible at 100% zoom,
 * imperceptible during casual scroll.
 *
 * Architecture:
 *   - Registered with SignalCanvas singleton via useSignalScene (NOT a separate
 *     WebGL context — iOS Safari context limit compliance)
 *   - OrthographicCamera(-1,1,1,-1) + PlaneGeometry(2,2) fullscreen quad
 *   - INT-04 module-level cache + MutationObserver for --signal-intensity reads
 *   - GSAP ticker drives uTime; GSAP breathing tween oscillates uIntensity base
 *   - uIntensity formula: breathingObj.value + _signalIntensity * 0.002
 *     Max: 0.004 + 1.0 * 0.002 = 0.006 (xtop spec ceiling)
 *   - prefers-reduced-motion: returns static fallback div, no scene registration
 *   - ResizeObserver updates uResolution on viewport resize
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 *
 * @module components/animation/datamosh-overlay
 */

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useSignalScene } from "@/hooks/use-signal-scene";
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
// Module-level signal cache (INT-04)
// Float values for --signal-* CSS vars. Read once on mount, updated via
// MutationObserver on :root style change. Never read inside GSAP ticker.
// ---------------------------------------------------------------------------

let _signalIntensity = 0.5;
let _signalObserver: MutationObserver | null = null;

function readSignalVars(): void {
  const v = parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--sfx-signal-intensity")
  );
  _signalIntensity = isNaN(v) ? 0.5 : v;
}

function ensureSignalObserver(): void {
  if (_signalObserver || typeof window === "undefined") return;
  readSignalVars();
  _signalObserver = new MutationObserver(readSignalVars);
  _signalObserver.observe(document.documentElement, {
    attributeFilter: ["style"],
  });
}

// ---------------------------------------------------------------------------
// Vertex shader — pass-through (identical to GLSLHero and GLSLSignal)
// ---------------------------------------------------------------------------

const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// Fragment shader — datamosh micro-displacement + chromatic aberration
//
// Single-pass structure:
//   1. Value noise generates UV offset vector (noise-driven displacement)
//   2. Block quantization creates optional codec macroblock feel
//   3. Channel separation: R/G/B sampled at offset * 1.0 / 0.66 / -0.33
//   4. Output: very faint chromatic fringe (near-transparent ambient overlay)
//
// At uIntensity=0.003: 1-2px drift, visible at 100% zoom only.
// At uIntensity=0.006: max ceiling per xtop spec — still subtle.
// ---------------------------------------------------------------------------

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntensity;
  uniform float uBlockRes;
  uniform vec2  uResolution;

  // Value noise — hash + smooth interpolation (from glsl-hero.tsx)
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),               hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // 1. Noise-driven UV displacement
    float n = noise(uv * 8.0 + vec2(uTime * 0.3, uTime * 0.17));
    vec2 offset = vec2(n, noise(uv * 8.0 + vec2(uTime * 0.17, uTime * 0.3))) * uIntensity;

    // 2. Block quantization — subtle codec macroblock feel
    vec2 blockUV  = floor(uv * uBlockRes) / uBlockRes;
    vec2 sampleUV = mix(uv, blockUV, step(0.003, uIntensity) * 0.15);

    // 3. Channel separation — R/G/B at different displacement offsets
    vec2 uvR = sampleUV + offset;
    vec2 uvG = sampleUV + offset * 0.66;
    vec2 uvB = sampleUV - offset * 0.33;

    // 4. Chromatic fringe — very faint ambient noise output
    float r = noise(uvR * 12.0 + uTime * 0.05) * uIntensity * 40.0;
    float g = noise(uvG * 12.0 + uTime * 0.05) * uIntensity * 40.0;
    float b = noise(uvB * 12.0 + uTime * 0.05) * uIntensity * 40.0;

    gl_FragColor = vec4(r, g, b, max(r, max(g, b)));
  }
`;

// ---------------------------------------------------------------------------
// Reduced-motion static fallback
// ---------------------------------------------------------------------------

function DatamoshFallback() {
  return (
    <div
      data-signal-scene="datamosh-static"
      className="fixed inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// Inner WebGL component
// ---------------------------------------------------------------------------

function DatamoshWebGL() {
  const containerRef = useRef<HTMLDivElement>(null);

  const uniformsRef = useRef<{
    uTime:       THREE.IUniform<number>;
    uIntensity:  THREE.IUniform<number>;
    uBlockRes:   THREE.IUniform<number>;
    uResolution: THREE.IUniform<THREE.Vector2>;
  } | null>(null);

  // ResizeObserver — update uResolution on viewport resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !uniformsRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && uniformsRef.current) {
          uniformsRef.current.uResolution.value.set(width, height);
        }
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const buildScene = () => {
    const container = containerRef.current!;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene  = new THREE.Scene();

    const uniforms = {
      uTime:       { value: 0 },
      uIntensity:  { value: 0.003 }, // default: close inspection zone
      uBlockRes:   { value: 256.0 },
      uResolution: {
        value: new THREE.Vector2(
          container.clientWidth  || window.innerWidth,
          container.clientHeight || window.innerHeight
        ),
      },
    };
    uniformsRef.current = uniforms;

    const geo      = new THREE.PlaneGeometry(2, 2);
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

  // GSAP ticker + breathing tween
  useGSAP(
    () => {
      // Reduced-motion guard — also checked in outer DatamoshOverlay, but belt-and-suspenders
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // INT-04: start observing --signal-intensity changes
      ensureSignalObserver();

      // Breathing object — intermediate to avoid tweening possibly-null uniform ref
      // Oscillates between 0.001 (min) and 0.004 (max base) over 8-12s cycles
      const breathingObj = { value: 0.003 };
      const breathingTween = gsap.to(breathingObj, {
        value:    0.001,
        duration: gsap.utils.random(8, 12),
        ease:     "sine.out",
        yoyo:     true,
        repeat:   -1,
      });

      // Ticker: uTime accumulation + corrected uIntensity formula
      //   Formula: breathingObj.value + _signalIntensity * 0.002
      //   At intensity=0.0: range 0.001–0.004 (breathing only)
      //   At intensity=0.5: range 0.002–0.005 (default)
      //   At intensity=1.0: range 0.003–0.006 (max ceiling per xtop spec)
      //   Max uIntensity = 0.004 + 1.0 * 0.002 = 0.006 — exactly the xtop ceiling
      const tickerFn = () => {
        if (!uniformsRef.current) return;
        uniformsRef.current.uTime.value += 0.016;
        uniformsRef.current.uIntensity.value =
          breathingObj.value + _signalIntensity * 0.002;
      };

      // HMR guard: remove before add to prevent ticker accumulation
      gsap.ticker.remove(tickerFn);
      gsap.ticker.add(tickerFn);

      return () => {
        // TD-01: full cleanup on unmount
        gsap.ticker.remove(tickerFn);
        breathingTween.kill();
        if (_signalObserver) {
          _signalObserver.disconnect();
          _signalObserver = null;
        }
      };
    },
    { scope: containerRef, dependencies: [] },
  );

  return (
    <div
      ref={containerRef}
      data-signal-scene="datamosh-overlay"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}

// ---------------------------------------------------------------------------
// DatamoshOverlay — outer gate: WebGL + reduced-motion check
// ---------------------------------------------------------------------------

export function DatamoshOverlay() {
  const [hasWebGL] = useState(() => checkWebGL());
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq      = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setIsReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!hasWebGL || isReducedMotion) {
    return <DatamoshFallback />;
  }

  return <DatamoshWebGL />;
}
