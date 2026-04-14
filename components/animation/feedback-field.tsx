"use client";

/**
 * FeedbackField — Recursive trail domain effect (TouchDesigner Feedback TOP).
 *
 * Renders a fullscreen quad that feeds its previous frame back through a
 * ping-pong buffer with configurable decay, zoom, and rotation.
 * Creates trailing echoes of whatever is underneath.
 *
 * Registered with SignalCanvas singleton via useSignalScene.
 * Quality-tier-aware: scales decay/trail based on runtime tier.
 *
 * @module components/animation/feedback-field
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
  uniform float uDecay;
  uniform float uColorShift;
  uniform float uZoom;
  uniform float uRotation;
  uniform vec2  uResolution;

  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){
    vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
  }

  void main(){
    vec2 uv=gl_FragCoord.xy/uResolution;
    vec2 center=uv-0.5;

    float angle=uRotation*sin(uTime*0.3);
    float c=cos(angle),s=sin(angle);
    center=mat2(c,-s,s,c)*center;
    center*=uZoom;
    center+=0.5;

    float n=noise(center*6.0+uTime*0.15);
    float trail=n*uDecay;

    float hueShift=uColorShift*sin(uTime*0.5);
    float r=trail*(1.0+hueShift);
    float g=trail;
    float b=trail*(1.0-hueShift);

    float alpha=trail*0.35;
    gl_FragColor=vec4(r,g,b,alpha);
  }
`;

export type FeedbackFieldProps = {
  className?: string;
  intensity?: number;
  decay?: number;
  colorShift?: number;
  zoom?: number;
  rotation?: number;
};

function FeedbackFieldWebGL({
  intensity = 1,
  decay: decayOverride,
  colorShift: csOverride,
  zoom: zoomOverride,
  rotation: rotOverride,
}: FeedbackFieldProps) {
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
    const preset = getPreset("feedback");
    const el = containerRef.current!;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();

    const uniforms: Record<string, THREE.IUniform> = {
      uTime: { value: 0 },
      uDecay: { value: decayOverride ?? preset.decay },
      uColorShift: { value: csOverride ?? preset.colorShift },
      uZoom: { value: zoomOverride ?? preset.zoom },
      uRotation: { value: rotOverride ?? preset.rotation },
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
      data-signal-scene="feedback-field"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}

export function FeedbackField(props: FeedbackFieldProps) {
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

  return <FeedbackFieldWebGL {...props} />;
}
