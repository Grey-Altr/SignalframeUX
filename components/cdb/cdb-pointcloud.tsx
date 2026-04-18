"use client";
import React from "react";
import * as THREE from "three";

export type CdBMorphology = "ring" | "torus" | "comet" | "event-horizon";

interface CdBPointcloudProps {
  morphology?: CdBMorphology;
  pointCount?: number;
  rotationSpeed?: number;
  className?: string;
}

/*
 * KLOROFORM-canon pointcloud. Raw Three.js (no fiber). Points are
 * generated on the CPU once per morphology, uploaded as a static
 * BufferGeometry, rendered as THREE.Points with a custom fragment
 * that draws a soft round dot.
 *
 * Morphologies (mathematical distributions, not random scatter —
 * this is the cdB contract for SIGNAL-layer output):
 *   ring          — 2D circular band on XZ plane, thin in Y.
 *   torus         — full torus surface with minor-radius jitter.
 *   comet         — elongated head with a trailing tail in +X.
 *   event-horizon — equatorial disc with accretion density falloff.
 *
 * The point color is pure cdB paper (#fafafa); depth is given by
 * per-vertex alpha varying with distance from the morphology's
 * central curve. Slow Y-axis rotation = the register, not decoration.
 */

function generatePoints(
  morphology: CdBMorphology,
  count: number
): Float32Array {
  const positions = new Float32Array(count * 3);
  const rand = () => Math.random() - 0.5;

  for (let i = 0; i < count; i++) {
    let x = 0,
      y = 0,
      z = 0;
    switch (morphology) {
      case "ring": {
        const t = Math.random() * Math.PI * 2;
        const r = 1 + rand() * 0.04;
        x = Math.cos(t) * r;
        z = Math.sin(t) * r;
        y = rand() * 0.04;
        break;
      }
      case "torus": {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const R = 1;
        const rMinor = 0.28 + rand() * 0.03;
        x = (R + rMinor * Math.cos(v)) * Math.cos(u);
        y = rMinor * Math.sin(v);
        z = (R + rMinor * Math.cos(v)) * Math.sin(u);
        break;
      }
      case "comet": {
        // Elongated head + tail: bias density along +X.
        const headP = Math.random();
        if (headP < 0.6) {
          // head: tight cluster near origin
          const r = Math.random() * 0.3;
          const t = Math.random() * Math.PI * 2;
          const p = Math.acos(2 * Math.random() - 1);
          x = r * Math.sin(p) * Math.cos(t);
          y = r * Math.sin(p) * Math.sin(t);
          z = r * Math.cos(p);
        } else {
          // tail: extend along +X with exponential decay in cross-section
          const t = Math.random();
          const tailX = t * 2.5;
          const spread = 0.08 + t * 0.18;
          x = tailX;
          y = rand() * spread;
          z = rand() * spread;
        }
        break;
      }
      case "event-horizon": {
        // Equatorial accretion disc, density falling with radius.
        const r = Math.sqrt(Math.random()) * 1.6 + 0.3;
        const t = Math.random() * Math.PI * 2;
        x = Math.cos(t) * r;
        z = Math.sin(t) * r;
        y = rand() * 0.02 * r;
        break;
      }
    }
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

export function CdBPointcloud({
  morphology = "ring",
  pointCount = 18000,
  rotationSpeed = 0.06,
  className,
}: CdBPointcloudProps) {
  const mountRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.6, 3.1);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = generatePoints(morphology, pointCount);
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSize: { value: 1.6 * renderer.getPixelRatio() },
        uColor: { value: new THREE.Color(0xfafafa) },
      },
      vertexShader: /* glsl */ `
        uniform float uSize;
        varying float vDepth;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * (300.0 / -mv.z);
          vDepth = clamp(1.0 - (-mv.z - 1.5) * 0.5, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vDepth;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float a = smoothstep(0.5, 0.0, d) * (0.45 + vDepth * 0.55);
          if (a < 0.01) discard;
          gl_FragColor = vec4(uColor, a);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let raf = 0;
    let last = performance.now();
    const animate = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      points.rotation.y += rotationSpeed * dt;
      // Subtle axial wobble — gives life without drifting into decoration.
      points.rotation.x = Math.sin(now * 0.00015) * 0.08;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [morphology, pointCount, rotationSpeed]);

  return (
    <div
      ref={mountRef}
      data-cdb-pointcloud
      data-cdb-morphology={morphology}
      className={className}
      aria-hidden="true"
    />
  );
}
