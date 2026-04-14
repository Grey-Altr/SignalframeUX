"use client";

/**
 * GlitchPass — Controlled datamosh/chromatic jitter (TouchDesigner Glitch).
 *
 * Produces block corruption, scanline interference, and RGB channel split.
 * Intermittent bursts triggered by a random cadence — not continuous.
 *
 * Registered with SignalCanvas singleton via useSignalScene.
 *
 * @module components/animation/glitch-pass
 */

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useSignalScene } from "@/hooks/use-signal-scene";
import { gsap, useGSAP } from "@/lib/gsap-core";
import { getPreset } from "@/lib/effects";

const _g = globalThis as unknown as { __sf_has_webgl?: boolean };

function checkWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (_g.__sf_has_webgl !== undefined) return _g.__sf_has_webgl;
  try {
    const c = document.createElement("canvas");
    const ctx = c.getContext("webgl2") || c.getContext("webgl");
    _g.__sf_has_webgl = !!ctx;
    if (ctx) ctx.getExtension("WEBGL_lose_context")?.loseContext();
    return _g.__sf_has_webgl;
  } catch {
    _g.__sf_has_webgl = false;
    return false;
  }
}

const VERTEX = /* glsl */ `void main(){gl_Position=vec4(position,1.0);}`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uGlitchActive;
  uniform float uBlockSize;
  uniform float uChromaticShift;
  uniform float uScanlineIntensity;
  uniform float uRGBSplit;
  uniform vec2  uResolution;

  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

  void main(){
    if(uGlitchActive<0.01){
      gl_FragColor=vec4(0.0);
      return;
    }

    vec2 uv=gl_FragCoord.xy/uResolution;

    // Block corruption
    vec2 block=floor(uv*uResolution/uBlockSize);
    float blockNoise=hash(block+floor(uTime*10.0));
    float corrupt=step(0.92,blockNoise)*uGlitchActive;

    // UV displacement per block
    vec2 displaceUV=uv;
    displaceUV.x+=corrupt*(hash(block*3.14)-0.5)*0.08;
    displaceUV.y+=corrupt*(hash(block*2.72)-0.5)*0.02;

    // RGB channel split
    float splitAmt=uRGBSplit*uGlitchActive/uResolution.x;
    float r=hash(displaceUV*12.0+uTime)*corrupt;
    float g=hash((displaceUV+vec2(splitAmt,0.0))*12.0+uTime)*corrupt*0.8;
    float b=hash((displaceUV-vec2(splitAmt,0.0))*12.0+uTime)*corrupt*0.6;

    // Scanlines
    float scanline=sin(uv.y*uResolution.y*1.5)*0.5+0.5;
    float scanEffect=scanline*uScanlineIntensity*uGlitchActive;

    // Chromatic fringe at block edges
    float chromatic=abs(fract(uv.y*uResolution.y/uBlockSize)-0.5)*2.0;
    chromatic=step(0.9,chromatic)*uChromaticShift*uGlitchActive*0.01;

    float finalR=(r+chromatic+scanEffect)*0.5;
    float finalG=(g+scanEffect)*0.4;
    float finalB=(b+chromatic+scanEffect)*0.5;
    float alpha=max(finalR,max(finalG,finalB));

    gl_FragColor=vec4(finalR,finalG,finalB,clamp(alpha,0.0,0.35));
  }
`;

export type GlitchPassProps = {
  className?: string;
  intensity?: number;
  rate?: number;
  blockSize?: number;
  chromaticShift?: number;
};

function GlitchWebGL({
  intensity = 1,
  rate: rateOv,
  blockSize: bsOv,
  chromaticShift: csOv,
}: GlitchPassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !uniformsRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width > 0 && height > 0 && uniformsRef.current) {
          (uniformsRef.current.uResolution.value as THREE.Vector2).set(width, height);
        }
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const buildScene = () => {
    const preset = getPreset("glitch");
    const el = containerRef.current!;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();

    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0 },
      uGlitchActive: { value: 0 },
      uBlockSize: { value: bsOv ?? preset.blockSize },
      uChromaticShift: { value: csOv ?? preset.chromaticShift },
      uScanlineIntensity: { value: preset.scanlineIntensity },
      uRGBSplit: { value: preset.rgbSplitAmount },
      uResolution: {
        value: new THREE.Vector2(
          el.clientWidth || window.innerWidth,
          el.clientHeight || window.innerHeight
        ),
      },
    };
    uniformsRef.current = uniforms;

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    return { scene, camera };
  };

  useSignalScene(containerRef as React.RefObject<HTMLElement | null>, buildScene);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const preset = getPreset("glitch");
      const glitchRate = rateOv ?? preset.rate;
      let nextGlitch = Math.random() * (2 / Math.max(glitchRate, 0.01));

      const tickerFn = () => {
        if (!uniformsRef.current) return;
        uniformsRef.current.uTime.value += 0.016 * intensity;

        nextGlitch -= 0.016;
        if (nextGlitch <= 0) {
          uniformsRef.current.uGlitchActive.value = 1.0;
          gsap.to(uniformsRef.current.uGlitchActive, {
            value: 0,
            duration: 0.08 + Math.random() * 0.15,
            ease: "power2.out",
          });
          nextGlitch = (1 + Math.random() * 4) / Math.max(glitchRate * intensity, 0.01);
        }
      };
      gsap.ticker.remove(tickerFn);
      gsap.ticker.add(tickerFn);
      return () => { gsap.ticker.remove(tickerFn); };
    },
    { scope: containerRef, dependencies: [intensity, rateOv] }
  );

  return (
    <div
      ref={containerRef}
      data-signal-scene="glitch-pass"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}

export function GlitchPass(props: GlitchPassProps) {
  const [ok] = useState(() => checkWebGL());
  const [rm, setRm] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const h = () => setRm(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  if (!ok || rm) return null;
  return <GlitchWebGL {...props} />;
}
