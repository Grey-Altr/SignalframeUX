"use client";

/**
 * BloomPass — Post-processing glow effect (TouchDesigner Bloom TOP).
 *
 * Fullscreen quad that generates a soft luminous glow using a multi-tap
 * gaussian blur on bright-pass fragments. Composites as additive overlay.
 *
 * Registered with SignalCanvas singleton via useSignalScene.
 *
 * @module components/animation/bloom-pass
 */

import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useSignalScene } from "@/hooks/use-signal-scene";
import { gsap, useGSAP } from "@/lib/gsap-core";
import { getPreset } from "@/lib/effects";
import { resolveColorAsThreeColor } from "@/lib/color-resolve";

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
  uniform float uThreshold;
  uniform float uRadius;
  uniform float uIntensity;
  uniform float uSoftKnee;
  uniform vec3  uColor;
  uniform vec2  uResolution;

  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }

  void main(){
    vec2 uv=gl_FragCoord.xy/uResolution;

    float n=noise(uv*4.0+uTime*0.2);
    float bright=smoothstep(uThreshold-uSoftKnee,uThreshold+uSoftKnee,n);

    float blur=0.0;
    float weight=0.0;
    for(float x=-3.0;x<=3.0;x+=1.0){
      for(float y=-3.0;y<=3.0;y+=1.0){
        vec2 off=vec2(x,y)*uRadius/uResolution;
        float s=noise((uv+off)*4.0+uTime*0.2);
        float b=smoothstep(uThreshold-uSoftKnee,uThreshold+uSoftKnee,s);
        float w=exp(-(x*x+y*y)/(2.0*uRadius*uRadius+0.001));
        blur+=b*w;
        weight+=w;
      }
    }
    blur/=max(weight,0.001);

    vec3 glow=uColor*blur*uIntensity;
    float alpha=blur*uIntensity*0.4;
    gl_FragColor=vec4(glow,clamp(alpha,0.0,0.3));
  }
`;

export type BloomPassProps = {
  className?: string;
  intensity?: number;
  threshold?: number;
  radius?: number;
  bloomIntensity?: number;
  color?: string;
};

function BloomWebGL({
  intensity = 1,
  threshold: threshOv,
  radius: radOv,
  bloomIntensity: bIntOv,
  color,
}: BloomPassProps) {
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
    const preset = getPreset("bloom");
    const el = containerRef.current!;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();

    const primaryColor = resolveColorAsThreeColor("--color-primary");

    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0 },
      uThreshold: { value: threshOv ?? preset.threshold },
      uRadius: { value: radOv ?? preset.radius },
      uIntensity: { value: bIntOv ?? preset.intensity },
      uSoftKnee: { value: preset.softKnee },
      uColor: { value: primaryColor },
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
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    return { scene, camera };
  };

  useSignalScene(containerRef as React.RefObject<HTMLElement | null>, buildScene);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tickerFn = () => {
        if (!uniformsRef.current) return;
        uniformsRef.current.uTime.value += 0.016 * intensity;
      };
      gsap.ticker.remove(tickerFn);
      gsap.ticker.add(tickerFn);
      return () => { gsap.ticker.remove(tickerFn); };
    },
    { scope: containerRef, dependencies: [intensity] }
  );

  return (
    <div
      ref={containerRef}
      data-signal-scene="bloom-pass"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}

export function BloomPass(props: BloomPassProps) {
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
  return <BloomWebGL {...props} />;
}
