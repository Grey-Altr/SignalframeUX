"use client";
import React from "react";
import * as THREE from "three";

export type VaultMorphology =
  | "ring"
  | "torus"
  | "comet"
  | "eventHorizon"
  | "spiral"
  | "lattice"
  | "nebula";

interface VaultPointcloudProps {
  morphologies: VaultMorphology[];
  pointCount?: number;
  progress?: number;
  rotationSpeed?: number;
  className?: string;
}

/*
 * KLOROFORM-canon pointcloud with scroll-driven morphology morphing.
 *
 * Given N morphologies and a [0-1] progress value, the component
 * interpolates between consecutive morphologies as progress advances.
 * All morphology point arrays are precomputed once on mount and held
 * as Float32Array buffers; during interpolation two are active as
 * position attributes and a uniform `uMix` does the GPU-side mix.
 *
 * This is what lets a single scroll sweep traverse ring→torus→comet→
 * event-horizon→spiral→lattice as the visitor moves through the
 * Cold Void section.
 */

function gen(morph: VaultMorphology, n: number): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = () => Math.random() - 0.5;
  for (let i = 0; i < n; i++) {
    let x = 0,
      y = 0,
      z = 0;
    switch (morph) {
      case "ring": {
        const t = Math.random() * Math.PI * 2;
        x = Math.cos(t);
        z = Math.sin(t);
        y = rand() * 0.03;
        break;
      }
      case "torus": {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;
        const R = 1,
          r = 0.28;
        x = (R + r * Math.cos(v)) * Math.cos(u);
        y = r * Math.sin(v);
        z = (R + r * Math.cos(v)) * Math.sin(u);
        break;
      }
      case "comet": {
        const t = Math.random();
        if (t < 0.55) {
          const r = Math.random() * 0.28;
          const a = Math.random() * Math.PI * 2;
          const p = Math.acos(2 * Math.random() - 1);
          x = r * Math.sin(p) * Math.cos(a);
          y = r * Math.sin(p) * Math.sin(a);
          z = r * Math.cos(p);
        } else {
          const s = Math.random();
          x = s * 2.4;
          const sp = 0.06 + s * 0.2;
          y = rand() * sp;
          z = rand() * sp;
        }
        break;
      }
      case "eventHorizon": {
        const r = Math.sqrt(Math.random()) * 1.7 + 0.25;
        const t = Math.random() * Math.PI * 2;
        x = Math.cos(t) * r;
        z = Math.sin(t) * r;
        y = rand() * 0.02 * r;
        break;
      }
      case "spiral": {
        // Archimedean spiral wrapped on XY
        const u = Math.random() * 8 * Math.PI;
        const r = 0.05 + u * 0.04;
        x = Math.cos(u) * r;
        y = Math.sin(u) * r * 0.6;
        z = rand() * 0.02;
        break;
      }
      case "lattice": {
        // 3D cubic grid with jitter
        const g = 9;
        const ix = Math.floor(Math.random() * g) - g / 2;
        const iy = Math.floor(Math.random() * g) - g / 2;
        const iz = Math.floor(Math.random() * g) - g / 2;
        x = (ix / (g / 2)) * 1.2 + rand() * 0.02;
        y = (iy / (g / 2)) * 1.2 + rand() * 0.02;
        z = (iz / (g / 2)) * 1.2 + rand() * 0.02;
        break;
      }
      case "nebula": {
        // Gaussian-distributed soft cloud
        const g = () => {
          let u = 0,
            v = 0;
          while (u === 0) u = Math.random();
          while (v === 0) v = Math.random();
          return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        };
        x = g() * 0.55;
        y = g() * 0.45;
        z = g() * 0.55;
        break;
      }
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

export function VaultPointcloud({
  morphologies,
  pointCount = 22000,
  progress = 0,
  rotationSpeed = 0.06,
  className,
}: VaultPointcloudProps) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const materialRef = React.useRef<THREE.ShaderMaterial | null>(null);
  const geomRef = React.useRef<THREE.BufferGeometry | null>(null);
  const buffersRef = React.useRef<Float32Array[]>([]);
  const stageRef = React.useRef(0);

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount || morphologies.length < 2) return;

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

    // Precompute all morphology buffers once.
    buffersRef.current = morphologies.map((m) => gen(m, pointCount));

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "positionA",
      new THREE.BufferAttribute(buffersRef.current[0], 3)
    );
    geometry.setAttribute(
      "positionB",
      new THREE.BufferAttribute(buffersRef.current[1], 3)
    );
    geomRef.current = geometry;

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSize: { value: 1.7 * renderer.getPixelRatio() },
        uColor: { value: new THREE.Color(0xfafafa) },
        uLime: { value: new THREE.Color(0xbdff00) },
        uMix: { value: 0 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 positionA;
        attribute vec3 positionB;
        uniform float uSize;
        uniform float uMix;
        varying float vDepth;
        void main() {
          vec3 p = mix(positionA, positionB, smoothstep(0.0, 1.0, uMix));
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * (300.0 / -mv.z);
          vDepth = clamp(1.0 - (-mv.z - 1.5) * 0.5, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform vec3 uLime;
        uniform float uMix;
        varying float vDepth;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float a = smoothstep(0.5, 0.0, d) * (0.45 + vDepth * 0.55);
          if (a < 0.01) discard;
          vec3 c = mix(uColor, uLime, smoothstep(0.3, 0.6, uMix) * 0.2);
          gl_FragColor = vec4(c, a);
        }
      `,
    });
    materialRef.current = material;

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let raf = 0;
    let last = performance.now();
    const animate = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      points.rotation.y += rotationSpeed * dt;
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
  }, [morphologies, pointCount, rotationSpeed]);

  // On progress change, recompute which stage we're in and rebind
  // positionB attribute if needed.
  React.useEffect(() => {
    const mat = materialRef.current;
    const geom = geomRef.current;
    const buffers = buffersRef.current;
    if (!mat || !geom || buffers.length < 2) return;
    const stages = morphologies.length - 1;
    const raw = Math.max(0, Math.min(0.9999, progress)) * stages;
    const stage = Math.min(stages - 1, Math.floor(raw));
    const local = raw - stage;
    if (stage !== stageRef.current) {
      stageRef.current = stage;
      geom.setAttribute(
        "positionA",
        new THREE.BufferAttribute(buffers[stage], 3)
      );
      geom.setAttribute(
        "positionB",
        new THREE.BufferAttribute(buffers[stage + 1], 3)
      );
      (geom.attributes.positionA as THREE.BufferAttribute).needsUpdate = true;
      (geom.attributes.positionB as THREE.BufferAttribute).needsUpdate = true;
    }
    mat.uniforms.uMix.value = local;
  }, [progress, morphologies]);

  return (
    <div
      ref={mountRef}
      data-vault-pointcloud
      className={className}
      aria-hidden="true"
    />
  );
}
