"use client";

/**
 * @status reference-template
 * No live consumers (lockdown audit 2026-04-22, §6.30).
 * See: .planning/lockdown-audit/AUDIT-VERDICTS.md
 * Retained as layout-generation reference per KEEP-ref policy.
 */

/**
 * ParticleField — Ambient particle drift layer via SignalCanvas singleton.
 *
 * Device-tiered particle count based on hardwareConcurrency:
 *   - <= 2 cores: 0 particles (skip entirely)
 *   - <= 4 cores: 2000 particles (mid-tier)
 *   - > 4 cores:  5000 particles (high-end)
 *
 * Architecture:
 * - useSignalScene registers with singleton (no second WebGL context)
 * - THREE.Points + BufferGeometry — single draw call for all particles
 * - Ambient floating drift wired to --sfx-signal-intensity for opacity/speed
 * - prefers-reduced-motion: static frame, zero animation (handled by SignalCanvas)
 * - iOS Safari: no Float32Array resizing, proper disposal, minimal draw calls
 *
 * @module components/animation/particle-field
 */

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useSignalScene } from "@/hooks/use-signal-scene";
import { gsap } from "@/lib/gsap-core";

// ---------------------------------------------------------------------------
// Device-tiered particle count
// ---------------------------------------------------------------------------

function getParticleCount(): number {
  if (typeof navigator === "undefined") return 0;
  const cores = navigator.hardwareConcurrency || 2;
  if (cores <= 2) return 0;
  if (cores <= 4) return 2000;
  return 5000;
}

// ---------------------------------------------------------------------------
// Module-level signal intensity cache — no DOM reads in render loop
// ---------------------------------------------------------------------------

let _intensity = 0.5;
let _intensityObserver: MutationObserver | null = null;

function readIntensity(): void {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--sfx-signal-intensity")
    .trim();
  const v = parseFloat(raw);
  _intensity = isNaN(v) ? 0.5 : v;
}

function ensureIntensityObserver(): void {
  if (_intensityObserver || typeof window === "undefined") return;
  readIntensity();
  _intensityObserver = new MutationObserver(readIntensity);
  _intensityObserver.observe(document.documentElement, {
    attributeFilter: ["style"],
  });
}

// ---------------------------------------------------------------------------
// ParticleField component
// ---------------------------------------------------------------------------

export function ParticleField() {
  const count = useMemo(() => getParticleCount(), []);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for animation loop access
  const pointsRef = useRef<THREE.Points | null>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const velocitiesRef = useRef<Float32Array | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);

  // buildScene factory — called once by useSignalScene on mount
  const buildScene = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 30;

    if (count === 0) {
      return { scene, camera };
    }

    // Pre-allocate all buffers once — no resizing (iOS Safari stability)
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    // Distribute particles in a box volume
    const SPREAD = 50;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * SPREAD;
      positions[i3 + 1] = (Math.random() - 0.5) * SPREAD;
      positions[i3 + 2] = (Math.random() - 0.5) * SPREAD;

      // Subtle drift velocities — ambient floating
      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    positionsRef.current = positions;
    velocitiesRef.current = velocities;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      sizeAttenuation: true,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    return { scene, camera };
  };

  // Register with SignalCanvas singleton
  useSignalScene(containerRef as React.RefObject<HTMLElement | null>, buildScene);

  // Animation loop via GSAP ticker (not a second requestAnimationFrame)
  useEffect(() => {
    if (count === 0) return;

    // Reduced-motion: SignalCanvas already handles static frame — skip ticker
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    ensureIntensityObserver();

    const SPREAD = 50;
    const HALF_SPREAD = SPREAD / 2;

    const tickerFn = () => {
      const positions = positionsRef.current;
      const velocities = velocitiesRef.current;
      const points = pointsRef.current;
      if (!positions || !velocities || !points) return;

      // Scale speed by signal intensity (0.5 default)
      const speedScale = 0.5 + _intensity * 1.5;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3] * speedScale;
        positions[i3 + 1] += velocities[i3 + 1] * speedScale;
        positions[i3 + 2] += velocities[i3 + 2] * speedScale;

        // Wrap around when particles drift out of bounds
        if (positions[i3] > HALF_SPREAD) positions[i3] = -HALF_SPREAD;
        else if (positions[i3] < -HALF_SPREAD) positions[i3] = HALF_SPREAD;
        if (positions[i3 + 1] > HALF_SPREAD) positions[i3 + 1] = -HALF_SPREAD;
        else if (positions[i3 + 1] < -HALF_SPREAD) positions[i3 + 1] = HALF_SPREAD;
        if (positions[i3 + 2] > HALF_SPREAD) positions[i3 + 2] = -HALF_SPREAD;
        else if (positions[i3 + 2] < -HALF_SPREAD) positions[i3 + 2] = HALF_SPREAD;
      }

      // Flag buffer for GPU upload
      (points.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      // Modulate opacity by intensity
      if (materialRef.current) {
        materialRef.current.opacity = 0.05 + _intensity * 0.1;
      }
    };

    gsap.ticker.add(tickerFn);

    return () => {
      gsap.ticker.remove(tickerFn);
      if (_intensityObserver) {
        _intensityObserver.disconnect();
        _intensityObserver = null;
      }
    };
  }, [count]);

  // Skip rendering entirely on low-end devices
  if (count === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}
