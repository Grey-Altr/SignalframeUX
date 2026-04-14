"use client";

/**
 * DisplaceField — Noise/map-driven warping (TouchDesigner Displace TOP).
 *
 * Fullscreen quad fragment shader producing FBM noise displacement with
 * configurable gain, frequency, and octave count. Tier-aware via presets.
 *
 * Registered with SignalCanvas singleton via useSignalScene.
 *
 * @module components/animation/displace-field
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
  uniform float uGain;
  uniform float uFrequency;
  uniform float uSpeed;
  uniform float uLacunarity;
  uniform int   uOctaves;
  uniform vec2  uResolution;

  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }

  float fbm(vec2 p,int oct,float lac){
    float v=0.0,a=0.5;
    for(int i=0;i<8;i++){
      if(i>=oct) break;
      v+=a*noise(p);
      p*=lac;
      a*=0.5;
    }
    return v;
  }

  void main(){
    vec2 uv=gl_FragCoord.xy/uResolution;
    float t=uTime*uSpeed;

    float dx=fbm(uv*uFrequency+vec2(t*0.3,t*0.17),uOctaves,uLacunarity);
    float dy=fbm(uv*uFrequency+vec2(t*0.17,t*0.3)+99.0,uOctaves,uLacunarity);

    vec2 displaced=uv+vec2(dx-0.5,dy-0.5)*uGain;

    float pattern=fbm(displaced*uFrequency*2.0+t*0.1,uOctaves,uLacunarity);
    float edge=smoothstep(0.4,0.6,pattern);

    float r=edge*(0.8+0.2*sin(t*0.5));
    float g=edge*0.85;
    float b=edge*(0.8+0.2*cos(t*0.3));

    float alpha=edge*uGain*4.0;
    gl_FragColor=vec4(r,g,b,clamp(alpha,0.0,0.25));
  }
`;

export type DisplaceFieldProps = {
  className?: string;
  intensity?: number;
  gain?: number;
  frequency?: number;
  octaves?: number;
  speed?: number;
};

function DisplaceWebGL({
  intensity = 1,
  gain: gainOv,
  frequency: freqOv,
  octaves: octOv,
  speed: spdOv,
}: DisplaceFieldProps) {
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
    const preset = getPreset("displace");
    const el = containerRef.current!;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();

    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0 },
      uGain: { value: gainOv ?? preset.gain },
      uFrequency: { value: freqOv ?? preset.frequency },
      uSpeed: { value: spdOv ?? preset.speed },
      uLacunarity: { value: preset.lacunarity },
      uOctaves: { value: octOv ?? preset.octaves },
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
      data-signal-scene="displace-field"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}

export function DisplaceField(props: DisplaceFieldProps) {
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
  return <DisplaceWebGL {...props} />;
}
