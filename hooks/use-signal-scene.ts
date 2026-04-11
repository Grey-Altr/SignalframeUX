"use client";

/**
 * Hook for registering a Three.js scene with the SignalCanvas singleton.
 * Handles: scene registration, IntersectionObserver visibility gating,
 * GPU resource disposal on unmount.
 *
 * Usage:
 *   const containerRef = useRef<HTMLDivElement>(null);
 *   useSignalScene(containerRef, () => ({
 *     scene: new THREE.Scene(),
 *     camera: new THREE.PerspectiveCamera(75, 1, 0.1, 100),
 *   }));
 *
 * @module hooks/use-signal-scene
 */

import { useEffect, useRef } from "react";
import type * as THREE from "three";
import {
  registerScene,
  deregisterScene,
  setSceneVisibility,
  disposeScene,
} from "@/lib/signal-canvas";

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
export function useSignalScene(
  elementRef: React.RefObject<HTMLElement | null>,
  buildScene: () => SceneBuildResult
): void {
  // crypto.randomUUID() requires iOS 15.4+; use a fallback for older devices
  const idRef = useRef(
    typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const { scene, camera, renderFn } = buildScene();
    const id = idRef.current;

    // IntersectionObserver gates rendering — offscreen scenes skip render loop
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSceneVisibility(id, entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(element);

    // Register with singleton — rendering is handled by the singleton's GSAP ticker
    registerScene(id, {
      element,
      scene,
      camera,
      renderFn,
      visible: true,
    });

    return () => {
      observer.disconnect();
      deregisterScene(id);
      disposeScene(scene); // GPU cleanup: geometry, material, texture disposal
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // intentionally empty deps — runs once per mount, buildScene is stable
}
