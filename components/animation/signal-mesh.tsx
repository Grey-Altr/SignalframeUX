"use client";

/**
 * SignalMesh — First WebGL 3D scene in the SignalframeUX generative surface.
 *
 * Renders a wireframe icosahedron using the SignalCanvas singleton renderer.
 * Scroll position drives vertex displacement via GSAP ScrollTrigger + ShaderMaterial uniforms.
 * GSAP ticker accumulates uTime for organic breathing motion.
 *
 * Architecture:
 * - useSignalScene registers with singleton (scissor/viewport split, single renderer)
 * - EdgesGeometry + LineSegments gives clean icosahedron edges (not triangulation diagonals)
 * - ScrollTrigger directly mutates uniform values (no gsap.to tween)
 * - ResizeObserver keeps camera aspect ratio correct
 * - WebGL unavailable → SVG fallback silhouette
 * - prefers-reduced-motion → static frame, no ScrollTrigger, no ticker
 *
 * @module components/animation/signal-mesh
 */

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useSignalScene } from "@/hooks/use-signal-scene";
import { resolveColorAsThreeColor } from "@/lib/color-resolve";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-core";
import { getState } from "@/lib/signal-canvas";

// ---------------------------------------------------------------------------
// WebGL availability check — runs once at module level on client
// ---------------------------------------------------------------------------

// Cache on globalThis so the check survives HMR hot reloads without creating
// a new WebGL context on every remount (iOS Safari enforces a 2-8 context limit).
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
  const raw = (name: string, fallback: number): number => {
    const v = parseFloat(style.getPropertyValue(name));
    return isNaN(v) ? fallback : v;
  };
  _signalIntensity = raw("--sfx-signal-intensity", 0.5);
  _signalSpeed     = raw("--sfx-signal-speed", 1);
  _signalAccent    = raw("--sfx-signal-accent", 0);
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
// Vertex shader — displaces vertices along normal for organic breathing
// ---------------------------------------------------------------------------

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uDisplacement;

  void main() {
    // Displacement along normal: two sine waves at different frequencies
    float disp = (
      sin(position.x * 4.0 + uTime * 0.8) * 0.5 +
      sin(position.y * 3.5 + uTime * 0.6) * 0.5
    ) * uDisplacement;

    vec3 displaced = position + normal * disp;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// Fragment shader — transparent fill using color + opacity uniforms
// ---------------------------------------------------------------------------

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;

// ---------------------------------------------------------------------------
// SVG fallback — static icosahedron wireframe silhouette (2D projection)
// ---------------------------------------------------------------------------

function IcosahedronSVGFallback() {
  // 12 vertices of a regular icosahedron projected to 2D, centered at (100, 100), r=70
  // Golden ratio φ ≈ 1.618 used for vertex positions
  const phi = (1 + Math.sqrt(5)) / 2;
  const scale = 50;
  const cx = 100;
  const cy = 100;

  // Normalize and project to 2D (simple top-down orthographic)
  const norm = Math.sqrt(1 + phi * phi);
  const verts3D: [number, number, number][] = [
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1],
  ].map(([x, y, z]) => [x / norm, y / norm, z / norm] as [number, number, number]);

  // Project to screen: slight isometric tilt (x,y,z -> 2D)
  const project = ([x, y, z]: [number, number, number]): [number, number] => [
    cx + (x - z * 0.3) * scale,
    cy - (y + z * 0.2) * scale,
  ];

  // Icosahedron edges (index pairs)
  const edges = [
    [0,1],[0,4],[0,5],[0,8],[0,9],
    [1,6],[1,7],[1,8],[1,9],
    [2,3],[2,4],[2,5],[2,10],[2,11],
    [3,6],[3,7],[3,10],[3,11],
    [4,5],[4,8],[4,10],
    [5,9],[5,11],
    [6,7],[6,8],[6,10],
    [7,9],[7,11],
    [8,10],[9,11],
  ];

  const pts = verts3D.map(project);

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={pts[a][0]}
          y1={pts[a][1]}
          x2={pts[b][0]}
          y2={pts[b][1]}
          stroke="var(--color-primary)"
          strokeWidth="0.8"
          strokeOpacity="0.6"
        />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SignalMesh component
// ---------------------------------------------------------------------------

/**
 * Renders a wireframe icosahedron via the SignalCanvas singleton WebGL renderer.
 * Scroll-reactive via GSAP ScrollTrigger uniform mutation.
 * Falls back to SVG silhouette when WebGL is unavailable.
 */
export function SignalMesh() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL] = useState(() => checkWebGL());

  // Shader uniforms stored in ref — accessible from ScrollTrigger + ticker closures
  const uniformsRef = useRef<{
    uTime: THREE.IUniform<number>;
    uDisplacement: THREE.IUniform<number>;
    uColor: THREE.IUniform<THREE.Color>;
    uOpacity: THREE.IUniform<number>;
  } | null>(null);

  // Mesh ref for rotation in ticker
  const meshRef = useRef<THREE.Mesh | null>(null);

  // Camera ref for ResizeObserver aspect updates
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // ResizeObserver — update camera aspect ratio on container resize
  useEffect(() => {
    if (!hasWebGL) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const camera = cameraRef.current;
      if (!camera) return;
      const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [hasWebGL]);

  // buildScene factory — called once by useSignalScene on mount
  const buildScene = () => {
    const container = containerRef.current!;
    const aspect = container.clientWidth / Math.max(container.clientHeight, 1);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
    camera.position.z = 2.5;
    cameraRef.current = camera;

    // Resolve color at build time — not in the render loop
    const primaryColor = resolveColorAsThreeColor("--sfx-primary");

    // Uniforms — stored in ref for external mutation
    const uniforms = {
      uTime: { value: 0 },
      uDisplacement: { value: 0 },
      uColor: { value: primaryColor },
      uOpacity: { value: 0.15 },
    };
    uniformsRef.current = uniforms;

    // Icosahedron geometry (detail=2 → 540 vertices, smooth enough for displacement)
    const geo = new THREE.IcosahedronGeometry(1, 2);

    // ShaderMaterial — transparent fill layer
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // Wireframe overlay — EdgesGeometry gives clean icosahedron edges
    // (not the ShaderMaterial wireframe: true which shows triangulation diagonals)
    const edgesGeo = new THREE.EdgesGeometry(geo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.6,
    });
    const wireframe = new THREE.LineSegments(edgesGeo, wireframeMat);
    scene.add(wireframe);

    // Disposal logging — confirms GPU cleanup contract on unmount
    const state = getState();
    console.debug(
      "[SignalMesh] registered — geometries:",
      state.renderer?.info.memory.geometries ?? "renderer not yet initialized"
    );

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

      // INT-04: initialize module-level signal cache + MutationObserver
      ensureSignalObserver();

      // ScrollTrigger: wire scroll progress to uDisplacement uniform
      ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (!uniformsRef.current) return;
          // INT-04: scale displacement ceiling by cached intensity (0.5 default → 0.4 max)
          uniformsRef.current.uDisplacement.value = self.progress * 0.4 * (_signalIntensity * 2);

          // Also scale rotation speed with scroll progress + signal speed
          if (meshRef.current) {
            meshRef.current.rotation.y += 0.003 * _signalSpeed * (1 + self.progress * 2);
          }
        },
      });

      // Ticker: accumulate uTime for vertex displacement breathing
      // ticker-accumulation-guard: remove any old ticker before registering
      const tickerFn = () => {
        if (!uniformsRef.current) return;
        // INT-04: time and rotation scaled by cached speed — no DOM access in ticker
        uniformsRef.current.uTime.value += 0.016 * _signalSpeed;

        // Slow base rotation (independent of scroll), scaled by signal speed
        if (meshRef.current) {
          meshRef.current.rotation.y += 0.003 * _signalSpeed;
        }
      };

      // Guard: remove in case of HMR re-run
      gsap.ticker.remove(tickerFn);
      gsap.ticker.add(tickerFn);

      return () => {
        gsap.ticker.remove(tickerFn);
        // TD-01: disconnect MutationObserver on unmount
        if (_signalObserver) {
          _signalObserver.disconnect();
          _signalObserver = null;
        }
      };
    },
    { scope: containerRef, dependencies: [hasWebGL] }
  );

  // SVG fallback when WebGL is unavailable
  if (!hasWebGL) {
    return (
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        <IcosahedronSVGFallback />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
