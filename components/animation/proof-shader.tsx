"use client";

/**
 * ProofShader — SIGNAL/FRAME intensity-driven WebGL shader for the PROOF section.
 *
 * Fork of GLSLHero with these differences:
 * 1. Accepts sectionRef: React.RefObject<HTMLElement | null> as a prop
 * 2. Has its OWN MutationObserver bound to sectionRef.current (section-scoped, not :root)
 * 3. The FRAGMENT_SHADER uses u_signal_intensity to blend between:
 *    - Low intensity (0-0.3): geometric lattice (regular grid, step fract)
 *    - High intensity (0.7-1.0): FBM noise output (GLSLHero baseline)
 *    - Mid range [0.3, 0.7]: smoothstep crossfade between the two
 * 4. No pointermove handler — parent ProofSection sets --signal-intensity;
 *    this observer reads it.
 * 5. No ScrollTrigger — parent ProofSection owns scroll lifecycle.
 * 6. No uMouse / uScroll uniforms — this shader is intensity-only.
 *
 * SIGNAL/FRAME ordering: signal runs through the frame.
 *
 * @module components/animation/proof-shader
 */

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useSignalScene } from "@/hooks/use-signal-scene";
import { resolveColorAsThreeColor } from "@/lib/color-resolve";
import { gsap, useGSAP } from "@/lib/gsap-core";

// ---------------------------------------------------------------------------
// WebGL availability check — identical to GLSLHero
// ---------------------------------------------------------------------------

function checkWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Section-scoped module-level cache + MutationObserver (Divergence A)
//
// CRITICAL: This observer watches sectionRef.current (the PROOF section element),
// The target is sectionRef.current — this prevents CSS custom property scope bleed
// from PROOF into ENTRY/SIGNAL shaders (AC-7 / RESEARCH pitfall 2).
//
// Only ONE ProofShader is ever mounted — the module-level singleton is safe.
// ---------------------------------------------------------------------------

let _proofIntensity = 0.5;
let _proofObserver: MutationObserver | null = null;

function readProofIntensity(sectionEl: HTMLElement): void {
  const v = parseFloat(
    getComputedStyle(sectionEl).getPropertyValue("--signal-intensity"),
  );
  _proofIntensity = isNaN(v) ? 0.5 : v;
}

function ensureProofObserver(sectionEl: HTMLElement): void {
  if (_proofObserver || typeof window === "undefined") return;
  readProofIntensity(sectionEl);
  _proofObserver = new MutationObserver(() => readProofIntensity(sectionEl));
  _proofObserver.observe(sectionEl, { attributeFilter: ["style"] });
}

function disposeProofObserver(): void {
  if (_proofObserver) {
    _proofObserver.disconnect();
    _proofObserver = null;
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
// Fragment shader — geometric lattice branch + FBM noise + Bayer 4x4 dither
//
// Divergence C+D from GLSLHero:
// - Added uniform float u_signal_intensity
// - main() uses smoothstep(0.3, 0.7, u_signal_intensity) to blend lattice/FBM
// - Removed uMouse, uScroll, uGridDensity (PROOF is intensity-only)
// ---------------------------------------------------------------------------

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec3  uColor;
  uniform float uDitherOpacity;
  uniform vec2  uResolution;
  uniform float u_signal_intensity;  // 0.0-1.0 set by ProofSection rAF lerp

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

  // ── Bayer 4x4 ordered dither matrix (identical to GLSLHero) ─────────────
  float bayerThreshold(ivec2 pos) {
    int ix = int(mod(float(pos.x), 4.0));
    int iy = int(mod(float(pos.y), 4.0));
    int idx = iy * 4 + ix;

    float bayer4x4[16];
    bayer4x4[0]  =  0.0 / 16.0;
    bayer4x4[1]  =  8.0 / 16.0;
    bayer4x4[2]  =  2.0 / 16.0;
    bayer4x4[3]  = 10.0 / 16.0;
    bayer4x4[4]  = 12.0 / 16.0;
    bayer4x4[5]  =  4.0 / 16.0;
    bayer4x4[6]  = 14.0 / 16.0;
    bayer4x4[7]  =  6.0 / 16.0;
    bayer4x4[8]  =  3.0 / 16.0;
    bayer4x4[9]  = 11.0 / 16.0;
    bayer4x4[10] =  1.0 / 16.0;
    bayer4x4[11] =  9.0 / 16.0;
    bayer4x4[12] = 15.0 / 16.0;
    bayer4x4[13] =  7.0 / 16.0;
    bayer4x4[14] = 13.0 / 16.0;
    bayer4x4[15] =  5.0 / 16.0;

    return bayer4x4[idx];
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // Base FBM noise (matches GLSLHero baseline)
    float fbmOffsetX = uTime * 0.1;
    float fbmOffsetY = uTime * 0.07;
    float n = fbm(uv * 4.0 + vec2(fbmOffsetX, fbmOffsetY));

    // Geometric lattice branch — structured grid at low intensity
    // Regular grid lines, right angles, step(fract(...), threshold)
    float latticeX = step(fract(uv.x * 8.0), 0.04);
    float latticeY = step(fract(uv.y * 8.0), 0.04);
    float lattice = clamp(latticeX + latticeY, 0.0, 1.0);

    // Blend: intensity 0 = lattice, intensity 1 = FBM noise
    // Transition band [0.3, 0.7] — below is pure lattice, above is pure noise
    float blend = smoothstep(0.3, 0.7, u_signal_intensity);
    float signal = mix(lattice * 0.8, n * 0.6, blend);

    // Bayer 4x4 ordered dither (preserved from GLSLHero)
    float threshold = bayerThreshold(ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y)));
    float dithered  = step(threshold, signal);
    gl_FragColor = vec4(uColor * dithered, uDitherOpacity);
  }
`;

// ---------------------------------------------------------------------------
// Reduced-motion static fallback (Divergence E)
// ---------------------------------------------------------------------------

function ProofShaderFallback() {
  return (
    <div
      data-proof-shader-fallback
      className="absolute inset-0 z-0 rounded-none"
      aria-hidden="true"
      style={{ backgroundColor: "var(--color-primary)", opacity: 0.1 }}
    />
  );
}

// ---------------------------------------------------------------------------
// Props contract (Divergence B)
// ---------------------------------------------------------------------------

export interface ProofShaderProps {
  sectionRef: React.RefObject<HTMLElement | null>;
}

// ---------------------------------------------------------------------------
// ProofShader component
// ---------------------------------------------------------------------------

/**
 * WebGL shader for the PROOF section. Registers with SignalCanvas singleton.
 * Reads --signal-intensity from sectionRef (section-scoped, not :root).
 * Blends between geometric lattice (intensity low) and FBM noise (intensity high).
 */
export function ProofShader({ sectionRef }: ProofShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL] = useState(() => checkWebGL());

  // Uniforms ref — accessible from GSAP ticker closure
  const uniformsRef = useRef<{
    uTime: THREE.IUniform<number>;
    uColor: THREE.IUniform<THREE.Color>;
    uDitherOpacity: THREE.IUniform<number>;
    uResolution: THREE.IUniform<THREE.Vector2>;
    u_signal_intensity: THREE.IUniform<number>;
  } | null>(null);

  // ResizeObserver — update uResolution on container resize
  useEffect(() => {
    if (!hasWebGL) return;
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
  }, [hasWebGL]);

  // buildScene factory — called once by useSignalScene on mount
  const buildScene = () => {
    const container = containerRef.current!;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();

    const primaryColor = resolveColorAsThreeColor("--color-primary", {
      ttl: 2000,
    });

    const uniforms = {
      uTime: { value: 0 },
      uColor: { value: primaryColor },
      uDitherOpacity: { value: 0.25 },
      uResolution: {
        value: new THREE.Vector2(
          container.clientWidth,
          container.clientHeight,
        ),
      },
      u_signal_intensity: { value: 0.5 },
    };
    uniformsRef.current = uniforms;

    const geo = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    return { scene, camera };
  };

  // Register with SignalCanvas singleton — 3rd concurrent WebGL scene
  useSignalScene(containerRef as React.RefObject<HTMLElement | null>, buildScene);

  // GSAP effects — ticker time accumulation + section-scoped intensity bridge
  useGSAP(
    () => {
      if (!hasWebGL) return;

      // Reduced-motion guard — skip all animation setup
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const sectionEl = sectionRef.current;
      if (!sectionEl) return;

      // Initialize section-scoped MutationObserver (watches sectionRef, not :root)
      ensureProofObserver(sectionEl);

      const tickerFn = () => {
        if (!uniformsRef.current) return;
        uniformsRef.current.uTime.value += 0.016;
        uniformsRef.current.u_signal_intensity.value = _proofIntensity;
      };

      // Remove any stale ticker before registering (HMR safety)
      gsap.ticker.remove(tickerFn);
      gsap.ticker.add(tickerFn);

      return () => {
        gsap.ticker.remove(tickerFn);
        // AC-8: disconnect section-scoped observer on cleanup, null the reference
        disposeProofObserver();
      };
    },
    { scope: containerRef, dependencies: [hasWebGL] },
  );

  // Reduced-motion fallback — static div, no WebGL
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return <ProofShaderFallback />;
  }

  // No WebGL support fallback
  if (!hasWebGL) {
    return <ProofShaderFallback />;
  }

  return (
    <div
      ref={containerRef}
      data-proof-layer="shader"
      className="absolute inset-0 z-0 rounded-none"
      aria-hidden="true"
    />
  );
}
