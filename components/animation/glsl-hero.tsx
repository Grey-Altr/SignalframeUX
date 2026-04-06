"use client";

/**
 * GLSLHero — Full-screen procedural noise field with geometric grid lines and Bayer 4x4 dither.
 *
 * Renders a full-screen quad ShaderMaterial (OrthographicCamera, PlaneGeometry(2,2)) via the
 * SignalCanvas singleton. Scroll drives uScroll + uGridDensity uniforms. GSAP ticker accumulates
 * uTime for slow FBM drift. --color-primary updates the monochrome output via uColor uniform.
 *
 * Architecture:
 * - OrthographicCamera(-1,1,1,-1,0,1) + PlaneGeometry(2,2) fills NDC space exactly
 * - useSignalScene registers with singleton (scissor/viewport split, single renderer)
 * - ScrollTrigger directly mutates uniform values (no gsap.to tween)
 * - FBM noise (4 octaves) + geometric grid lines + Bayer 4x4 ordered dither (20-30% blend)
 * - prefers-reduced-motion → static div with --color-primary at 10% opacity, no WebGL
 *
 * @module components/animation/glsl-hero
 */

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useSignalScene } from "@/hooks/use-signal-scene";
import { resolveColorAsThreeColor } from "@/lib/color-resolve";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-core";

// ---------------------------------------------------------------------------
// WebGL availability check — runs once at module level on client
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
// Module-level signal cache (INT-04)
// Float values for --signal-* CSS vars. Read once on mount, updated via
// MutationObserver on :root style change. Never read inside GSAP ticker.
// ---------------------------------------------------------------------------

let _signalIntensity = 0.5;
let _signalSpeed = 1.0;
let _signalAccent = 0.0;
let _signalObserver: MutationObserver | null = null;

function readSignalVars(): void {
  const style = getComputedStyle(document.documentElement);
  _signalIntensity = parseFloat(style.getPropertyValue("--signal-intensity") || "0.5");
  _signalSpeed     = parseFloat(style.getPropertyValue("--signal-speed")     || "1");
  _signalAccent    = parseFloat(style.getPropertyValue("--signal-accent")    || "0");
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
// Vertex shader — pass-through, fills NDC space
// ---------------------------------------------------------------------------

const VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// Fragment shader — FBM noise + grid lines + Bayer 4x4 ordered dither
// ---------------------------------------------------------------------------

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform vec3  uColor;
  uniform float uGridDensity;
  uniform float uDitherOpacity;
  uniform vec2  uResolution;

  // ---------------------------------------------------------------------------
  // Hash function — deterministic pseudo-random from 2D input
  // ---------------------------------------------------------------------------
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // ---------------------------------------------------------------------------
  // Value noise — smooth interpolation between hashed corners
  // ---------------------------------------------------------------------------
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smoothstep for C1 continuity
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // ---------------------------------------------------------------------------
  // FBM — 4 octaves, 0.5 amplitude decay per octave
  // Scroll modulates frequency scale for reactive field depth
  // ---------------------------------------------------------------------------
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    float scale = 1.0 + uScroll * 2.0;

    for (int i = 0; i < 4; i++) {
      value += amplitude * noise(p * frequency * scale);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  // ---------------------------------------------------------------------------
  // Bayer 4x4 ordered dither matrix — 16 threshold values for ordered dithering
  // ---------------------------------------------------------------------------
  float bayerThreshold(ivec2 pos) {
    int ix = int(mod(float(pos.x), 4.0));
    int iy = int(mod(float(pos.y), 4.0));
    int idx = iy * 4 + ix;

    // Bayer 4x4 matrix (row-major):
    //  0  8  2 10
    // 12  4 14  6
    //  3 11  1  9
    // 15  7 13  5
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
    // UV from fragment coordinate and resolution uniform
    vec2 uv = gl_FragCoord.xy / uResolution;

    // FBM noise — slow drift via uTime, scroll modulates scale inside fbm()
    float n = fbm(uv * 4.0 + vec2(uTime * 0.1, uTime * 0.07));

    // Geometric grid lines — thin lines at regular intervals on both axes
    float gridX = step(fract(uv.x * uGridDensity), 0.02);
    float gridY = step(fract(uv.y * uGridDensity), 0.02);
    float grid  = clamp(gridX + gridY, 0.0, 1.0);

    // Combine noise field + grid lines
    float signal = n * 0.6 + grid * 0.3;

    // Bayer 4x4 ordered dither — maps signal to binary pattern
    float threshold = bayerThreshold(ivec2(int(gl_FragCoord.x), int(gl_FragCoord.y)));
    float dithered  = step(threshold, signal);

    // Output: monochrome using --color-primary at uDitherOpacity (25% blend)
    gl_FragColor = vec4(uColor * dithered, uDitherOpacity);
  }
`;

// ---------------------------------------------------------------------------
// Reduced-motion static fallback
// ---------------------------------------------------------------------------

function HeroStaticFallback() {
  return (
    <div
      className="absolute inset-0 z-0"
      aria-hidden="true"
      style={{ backgroundColor: "var(--color-primary)", opacity: 0.1 }}
    />
  );
}

// ---------------------------------------------------------------------------
// GLSLHero component
// ---------------------------------------------------------------------------

/**
 * Full-screen GLSL noise field with grid lines and Bayer 4x4 dither.
 * Renders as background layer (z-0, absolute inset-0) behind hero content.
 * Falls back to a static --color-primary div at 10% opacity on reduced-motion.
 */
export function GLSLHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL] = useState(() => checkWebGL());

  // Shader uniforms stored in ref — accessible from ScrollTrigger + ticker closures
  const uniformsRef = useRef<{
    uTime:          THREE.IUniform<number>;
    uScroll:        THREE.IUniform<number>;
    uColor:         THREE.IUniform<THREE.Color>;
    uGridDensity:   THREE.IUniform<number>;
    uDitherOpacity: THREE.IUniform<number>;
    uResolution:    THREE.IUniform<THREE.Vector2>;
  } | null>(null);

  // ResizeObserver — update uResolution uniform on container resize
  useEffect(() => {
    if (!hasWebGL) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      if (!uniformsRef.current) return;
      uniformsRef.current.uResolution.value.set(
        container.clientWidth,
        container.clientHeight
      );
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [hasWebGL]);

  // buildScene factory — called once by useSignalScene on mount
  const buildScene = () => {
    const container = containerRef.current!;

    // Orthographic camera fills NDC space exactly — no perspective distortion
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const scene = new THREE.Scene();

    // Resolve --color-primary at build time with TTL cache (2s)
    const primaryColor = resolveColorAsThreeColor("--color-primary", { ttl: 2000 });

    // Uniforms — stored in ref for external mutation from ScrollTrigger + ticker
    const uniforms = {
      uTime:          { value: 0 },
      uScroll:        { value: 0 },
      uColor:         { value: primaryColor },
      uGridDensity:   { value: 12.0 },
      uDitherOpacity: { value: 0.25 },
      uResolution:    { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
    };
    uniformsRef.current = uniforms;

    // Full-screen quad — PlaneGeometry(2,2) matches NDC clip space exactly
    const geo = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader:   VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent:  true,
      depthWrite:   false,
    });

    const mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);

    return { scene, camera };
  };

  // Register scene with SignalCanvas singleton
  useSignalScene(containerRef as React.RefObject<HTMLElement | null>, buildScene);

  // GSAP effects — ScrollTrigger uniform mutation + ticker time accumulation
  useGSAP(
    () => {
      if (!hasWebGL) return;
      const container = containerRef.current;
      if (!container) return;

      // Reduced-motion guard — skip all animation setup
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // ScrollTrigger: wire scroll progress to uScroll + uGridDensity uniforms
      ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (!uniformsRef.current) return;
          uniformsRef.current.uScroll.value = self.progress;
          // Grid density expands as user scrolls — 12 → 20 over full scroll range
          uniformsRef.current.uGridDensity.value = 12.0 + self.progress * 8.0;
        },
      });

      // Ticker: accumulate uTime for FBM drift
      // ticker-accumulation-guard: remove any old ticker before registering (HMR safety)
      const tickerFn = () => {
        if (!uniformsRef.current) return;
        uniformsRef.current.uTime.value += 0.016;
      };

      gsap.ticker.remove(tickerFn);
      gsap.ticker.add(tickerFn);

      return () => {
        gsap.ticker.remove(tickerFn);
      };
    },
    { scope: containerRef, dependencies: [hasWebGL] }
  );

  // Reduced-motion fallback — static div, no WebGL loop
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return <HeroStaticFallback />;
  }

  // No WebGL support fallback
  if (!hasWebGL) {
    return <HeroStaticFallback />;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
