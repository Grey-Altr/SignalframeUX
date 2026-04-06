# Stack Research

**Domain:** Generative web visuals — 3D meshes, motion graphics, procedural graphics, shader-based effects within Next.js 15.3 App Router
**Researched:** 2026-04-05
**Confidence:** MEDIUM (core library recommendations HIGH; bundle size figures approximate; GLSL/Turbopack integration MEDIUM due to toolchain volatility)

---

## Context: What Already Exists

The following stack is locked and NOT re-researched here:

- Next.js 15.3 (App Router, Turbopack) + TypeScript 5.8
- GSAP 3.12.7 + ScrollTrigger, @gsap/react 2.1.2
- Lenis 1.1.20 (smooth scroll)
- Tailwind CSS v4, CVA, Radix/shadcn SF layer
- Canvas 2D: `HeroMesh` is a production canvas animation (2D grid mesh, mouse repulsion, RAF loop, IntersectionObserver guard, reduced-motion support). This is the baseline — all generative additions must match this quality bar.

The existing `hero-mesh.tsx` proves canvas 2D is viable. The research question is: what additional libraries are needed to extend into WebGL (3D meshes), shader effects, and motion graphics, without blowing the 200KB initial budget.

---

## Recommended Stack

### Core Generative Layer

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `three` | `^0.183.2` | WebGL scene graph, geometry, materials, shaders | Industry standard for web 3D. Full GLSL control. Excellent tree-shaking when imported selectively. Required peer dep for R3F and Drei. |
| `@react-three/fiber` | `^9.5.0` | React renderer for Three.js | v9 targets React 19 explicitly (this project uses React 19.1). Declarative scene authoring in JSX. Compatible with Next.js App Router via `dynamic()` + `ssr: false`. |
| `@react-three/drei` | `^10.x` | Helper abstractions for R3F | Drei v10 pairs with R3F v9/React 19. Provides `shaderMaterial`, `useTexture`, `OrbitControls`, `PerformanceMonitor`, and dozens of scene utilities without reinventing. Tree-shakeable — import only what you use. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@react-three/postprocessing` | `^3.x` | Screen-space effects (bloom, noise, chromatic aberration, scan lines) | When adding post-process layer to WebGL scenes. Merges effects into single render pass for performance. Pairs with `postprocessing` package (auto-installed). |
| `raw-loader` | `^4.0.2` | Import `.glsl`/`.vert`/`.frag` files as strings | Required when writing inline GLSL as separate files. Works with both Turbopack (dev) and Webpack (build) via dual config. |
| `ogl` | `^1.x` | Minimal WebGL library (~29KB min+gzip total) | When Three.js is overkill for a specific isolated effect — pure GLSL quads, particle sims, 2D shader passes. Use in place of Three.js for non-scene effects only. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `@next/bundle-analyzer` | Visualize bundle chunks post-build | Run after adding generative libs to confirm code-split chunks are isolated from initial 200KB budget. |
| `typescript` shader `.d.ts` declarations | Type-safe GLSL imports | Add `declare module '*.glsl' { const value: string; export default value; }` to `src/types/shaders.d.ts`. Required for both `raw-loader` and inline template literal shaders. |

---

## Installation

```bash
# Core generative stack
npm install three @react-three/fiber @react-three/drei

# Post-processing (optional — add per scene)
npm install @react-three/postprocessing

# OGL for isolated lightweight effects (optional)
npm install ogl

# Dev: shader file imports + bundle analysis
npm install -D raw-loader @next/bundle-analyzer
```

---

## Critical Integration: Next.js App Router + SSR

Three.js cannot execute on the server — it depends on `window`, `WebGLRenderingContext`, and Canvas APIs unavailable in Node.js. This is a hard constraint.

**Required pattern for every R3F scene component:**

```typescript
// app/some-page/page.tsx (Server Component)
import dynamic from 'next/dynamic'

const GenerativeScene = dynamic(
  () => import('@/components/animation/generative-scene'),
  { ssr: false, loading: () => null }
)
```

```typescript
// components/animation/generative-scene.tsx
'use client'

import { Canvas } from '@react-three/fiber'
// ... scene contents
```

This pattern:
- Keeps the Server Component parent clean
- Code-splits the entire Three.js chunk into a separate JS bundle
- Defers load until the component is needed (not on initial page load)
- Prevents SSR hydration errors

**`transpilePackages` in `next.config.ts`:**

```typescript
const nextConfig = {
  transpilePackages: ['three'],
  // ...
}
```

Required because Three.js ships ESM and Next.js must transpile it.

---

## GLSL Shader File Configuration

Turbopack (dev server) and Webpack (production build) require separate config. Both must be set.

```typescript
// next.config.ts
const nextConfig = {
  transpilePackages: ['three'],
  experimental: {
    turbopack: {
      rules: {
        '*{.glsl,.vert,.frag,.vs,.fs}': {
          loaders: ['raw-loader'],
          as: '*.js',
        },
      },
    },
  },
  webpack(config: WebpackConfig) {
    config.module.rules.push({
      test: /\.(glsl|vert|frag|vs|fs)$/,
      use: 'raw-loader',
    })
    return config
  },
}
```

**Alternative (no raw-loader):** Write shaders as TypeScript template literals in `.ts` files. No loader config needed. Acceptable for simple shaders; less ergonomic for complex GLSL with imports.

---

## Bundle Size Analysis

### The 200KB Problem

The project has a hard 200KB initial page weight budget. Three.js is large.

| Library | Min+Gzip (approx) | Loaded When |
|---------|-------------------|-------------|
| `three` (full import) | ~160KB | Never — import selectively |
| `three` (selective imports) | ~40–80KB | Only on dynamic chunk load |
| `@react-three/fiber` | ~15KB | Dynamic chunk only |
| `@react-three/drei` (selective) | ~5–20KB | Dynamic chunk only |
| `ogl` (full) | ~29KB | Dynamic chunk only |
| Canvas 2D (`hero-mesh.tsx`) | 0KB overhead | Already ships in client bundle |

**Key insight:** Because R3F scenes are loaded via `dynamic(() => import(...), { ssr: false })`, Three.js and all its dependencies land in a separate JS chunk that is NOT part of the initial page load. The 200KB budget applies to the initial bundle. The Three.js chunk loads asynchronously when the component mounts.

This means Three.js does NOT violate the 200KB initial budget if — and only if — every WebGL component uses `dynamic()` import.

**Validation step:** Run `ANALYZE=true npm run build` after setup (with `@next/bundle-analyzer`) and confirm Three.js lives in a chunk separate from `_app` and route bundles.

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| `@react-three/fiber` + `three` | Raw Three.js imperatively | No React lifecycle integration; manual cleanup; harder composition |
| `@react-three/fiber` + `three` | Babylon.js | Larger bundle; React integration unofficial; ecosystem less mature for this use case |
| `@react-three/fiber` + `three` | PlayCanvas | Not open-source friendly; proprietary editor dependency |
| `@react-three/drei` | Manual helpers | Drei is tree-shakeable v10+; no cost for unused helpers |
| `ogl` (for isolated shaders) | WebGL from scratch | OGL is ~29KB total and provides a clean abstraction without Three.js overhead for 2D quad effects |
| GLSL shader files | `glslify-loader` | glslify adds complexity; not needed unless shader module imports are required |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@react-three/fiber@8` | React 19 incompatible — `ReactCurrentOwner` error confirmed in Next.js 15 issues | `@react-three/fiber@9.x` |
| Full `three` barrel import (`import * as THREE from 'three'`) | Pulls entire library; no tree-shaking possible; balloons bundle | `import { BoxGeometry, ShaderMaterial } from 'three'` — named imports only |
| Lottie (`@lottiefiles/dotlottie-react`, `lottie-web`) | Motion graphics via JSON animation — not generative, not procedural, not aligned with DU/TDR raw aesthetic. Adds 60–200KB. | GSAP + Canvas 2D or R3F for true generative output |
| Babylon.js | ~500KB+; designed for game engines; React integration is unofficial community wrapper | Three.js + R3F |
| `vite-plugin-glsl` | Vite plugin — not compatible with Next.js/Turbopack build pipeline | `raw-loader` via `next.config.ts` rules |
| New GSAP effects beyond existing | CLAUDE.md explicitly forbids expanding GSAP animations. GSAP is for scroll choreography + scene transitions, not generative graphics. | R3F/Three.js for WebGL generative output |
| `react-spring` or `framer-motion` for 3D | Redundant with GSAP + R3F; adds bundle weight with no gain | GSAP for timeline control; R3F `useFrame` for per-frame 3D animation |

---

## Stack Patterns by Variant

**If building a full 3D scene (meshes, camera, lighting):**
- Use R3F `Canvas` + `@react-three/drei` helpers
- Use `useFrame` for per-frame updates (replaces GSAP for WebGL)
- GSAP ScrollTrigger can drive R3F uniforms/camera position via ref values

**If building a 2D shader effect (fullscreen quad, noise field, data viz):**
- Use OGL `Renderer` + `Program` + `Mesh` — avoids Three.js overhead
- Or use a plain `<canvas>` + raw WebGL2 context (as `hero-mesh.tsx` does with Canvas 2D)
- Pattern: lazy load via `dynamic()`, write shader as template literal string

**If building a motion graphic (SVG morphing, vector animation):**
- GSAP MorphSVG or DrawSVG (already licensed) + inline SVG
- Do NOT use Lottie or R3F for 2D vector work

**If GSAP needs to control a 3D object:**
- Use `useRef` on the R3F mesh, then `gsap.to(meshRef.current.position, {...})`
- GSAP animates Three.js object properties natively — no special bridge needed

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `@react-three/fiber@9.5.0` | `three@0.170+`, `react@19.0–19.2` | Verified: pairs explicitly with React 19. Use `three@^0.183.2` (latest). |
| `@react-three/drei@10.x` | `@react-three/fiber@9.x` | Drei v10 targets R3F v9 / React 19 |
| `@react-three/postprocessing@3.x` | `@react-three/fiber@9.x`, `postprocessing@7.x` | `postprocessing` auto-installed as peer dep |
| `three@0.183.2` | Next.js 15.3 + Turbopack | Requires `transpilePackages: ['three']` in `next.config.ts` |
| `raw-loader@4.0.2` | Webpack 5, Turbopack (via `experimental.turbopack.rules`) | Dual config required: separate Turbopack + Webpack sections |

---

## Sources

- R3F docs (r3f.docs.pmnd.rs/getting-started/installation) — v9/React 19 pairing, Next.js transpilePackages requirement — HIGH confidence
- GitHub pmndrs/react-three-fiber releases — v9.5.0 confirmed latest, React 19 compat — HIGH confidence
- GitHub vercel/next.js issue #71836 — R3F v8 incompatible with Next.js 15/React 19 confirmed — HIGH confidence
- GitHub vercel/next.js discussion #64964 — Turbopack raw-loader pattern via `experimental.turbopack.rules` — MEDIUM confidence (community solution, not official docs)
- Next.js Turbopack docs (nextjs.org/docs/app/api-reference/config/next-config-js/turbopack) — loader rules format — HIGH confidence
- npm registry — `three` latest 0.183.2, `@react-three/fiber` latest 9.5.0 — HIGH confidence
- GitHub oframe/ogl — OGL ~29KB total min+gzip, zero deps, ES6 modules — HIGH confidence
- WebSearch — Three.js bundle size estimates; tree-shaking limitations — MEDIUM confidence (exact numbers require project-specific build analysis)
- bundlephobia.com (JavaScript-rendered, content not extractable) — cited as validation tool for post-install audit — verify manually

---

*Stack research for: Generative SIGNAL layer additions — SignalframeUX v1.1*
*Researched: 2026-04-05*
