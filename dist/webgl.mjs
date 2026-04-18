import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';
import { jsx } from 'react/jsx-runtime';

// lib/signal-canvas.tsx
gsap.registerPlugin(ScrollTrigger, Observer, useGSAP);
gsap.defaults({ ease: "power2.out" });
var SIGNAL_KEY = "__sf_signal_canvas";
function getState() {
  const g = globalThis;
  if (!g[SIGNAL_KEY]) {
    g[SIGNAL_KEY] = {
      renderer: null,
      canvas: null,
      scenes: /* @__PURE__ */ new Map(),
      tickerCallback: null,
      reducedMotion: false,
      mql: null
    };
  }
  return g[SIGNAL_KEY];
}
function renderAllScenes(state) {
  const { renderer, scenes } = state;
  if (!renderer) return;
  renderer.setScissorTest(false);
  renderer.clear();
  renderer.setScissorTest(true);
  scenes.forEach((entry) => {
    if (!entry.visible) return;
    const rect = entry.element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const canvasH = renderer.domElement.clientHeight;
    const canvasY = canvasH - rect.bottom;
    renderer.setScissor(rect.left, canvasY, rect.width, rect.height);
    renderer.setViewport(rect.left, canvasY, rect.width, rect.height);
    entry.renderFn(entry.scene, entry.camera);
  });
}
function initSignalCanvas(canvas) {
  const state = getState();
  if (state.renderer) return;
  state.canvas = canvas;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  state.renderer = renderer;
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  state.reducedMotion = mql.matches;
  state.mql = mql;
  const tickerCallback = () => {
    if (state.reducedMotion || state.scenes.size === 0) return;
    renderAllScenes(state);
  };
  state.tickerCallback = tickerCallback;
  if (!state.reducedMotion) {
    gsap.ticker.add(tickerCallback);
  } else {
    renderAllScenes(state);
  }
  const motionHandler = (e) => {
    state.reducedMotion = e.matches;
    if (e.matches) {
      gsap.ticker.remove(tickerCallback);
      renderAllScenes(state);
    } else {
      gsap.ticker.add(tickerCallback);
    }
  };
  mql.addEventListener("change", motionHandler);
  const resizeHandler = () => {
    if (!state.renderer) return;
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    renderAllScenes(state);
  };
  window.addEventListener("resize", resizeHandler, { passive: true });
}
function registerScene(id, entry) {
  const state = getState();
  const resolvedEntry = {
    ...entry,
    // Default renderFn delegates to the singleton renderer
    renderFn: entry.renderFn ?? ((scene, camera) => {
      if (state.renderer) state.renderer.render(scene, camera);
    })
  };
  state.scenes.set(id, resolvedEntry);
  if (state.renderer) {
    entry.scene.traverse((obj) => {
      const mesh = obj;
      if (mesh.isMesh && mesh.material) {
        mesh.material.needsUpdate = true;
      }
    });
  }
}
function deregisterScene(id) {
  const state = getState();
  state.scenes.delete(id);
}
function setSceneVisibility(id, visible) {
  const state = getState();
  const entry = state.scenes.get(id);
  if (entry) {
    entry.visible = visible;
  }
}
function disposeScene(scene) {
  scene.traverse((object) => {
    const mesh = object;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((mat) => {
        Object.values(mat).forEach((value) => {
          if (value instanceof THREE.Texture) {
            value.dispose();
          }
        });
        mat.dispose();
      });
    }
  });
}
function SignalCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    initSignalCanvas(canvasRef.current);
  }, []);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref: canvasRef,
      "aria-label": "Generative visual \u2014 decorative",
      role: "img",
      style: {
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: -1
      }
    }
  );
}
function useSignalScene(elementRef, buildScene) {
  const idRef = useRef(
    typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`
  );
  const buildSceneRef = useRef(buildScene);
  buildSceneRef.current = buildScene;
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const { scene, camera, renderFn } = buildSceneRef.current();
    const id = idRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSceneVisibility(id, entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(element);
    registerScene(id, {
      element,
      scene,
      camera,
      renderFn,
      visible: true
    });
    return () => {
      observer.disconnect();
      deregisterScene(id);
      disposeScene(scene);
    };
  }, [elementRef]);
}
var colorCache = /* @__PURE__ */ new Map();
var cacheObserver = null;
function ensureCacheObserver() {
  if (cacheObserver || typeof window === "undefined") return;
  cacheObserver = new MutationObserver(() => {
    colorCache.clear();
  });
  cacheObserver.observe(document.documentElement, {
    attributeFilter: ["class", "style"]
  });
}
function resolveColorToken(cssVar, options) {
  const ttl = options?.ttl;
  if (ttl !== void 0) {
    ensureCacheObserver();
    const now = Date.now();
    const cached = colorCache.get(cssVar);
    if (cached && now < cached.expires) {
      return cached.rgb;
    }
    const rgb = probeColor(cssVar);
    colorCache.set(cssVar, { rgb, expires: now + ttl });
    return rgb;
  }
  return probeColor(cssVar);
}
function probeColor(cssVar) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  if (!raw) return { r: 255, g: 0, b: 128 };
  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const ctx = probe.getContext("2d");
  if (!ctx) return { r: 255, g: 0, b: 128 };
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b };
}

export { SignalCanvas, resolveColorToken, useSignalScene };
//# sourceMappingURL=webgl.mjs.map
//# sourceMappingURL=webgl.mjs.map