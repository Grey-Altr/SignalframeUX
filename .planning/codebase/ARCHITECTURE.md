# Architecture

**Analysis Date:** 2026-04-12

## Pattern Overview

**Overall:** Next.js App Router with a server-first page shell and client islands for animation, WebGL, and interactive explorers.

**Key Characteristics:**
- Keep route files in `app/**/page.tsx` as Server Components unless browser APIs are required.
- Push animation, scrolling, and WebGL concerns into client boundaries under `components/layout/`, `components/animation/`, and `hooks/`.
- Split product surfaces into FRAME wrappers (`components/sf/`) and SIGNAL motion/rendering modules (`lib/entry-animation.ts`, `lib/entry-webgl.ts`).
- Maintain dual outputs: app runtime (`app/`) and publishable library bundles (`lib/entry-*.ts` + `tsup.config.ts`).

## Layers

**Routing and Document Shell:**
- Purpose: Own metadata, global providers, and route composition.
- Location: `app/layout.tsx`, `app/page.tsx`, `app/inventory/page.tsx`, `app/system/page.tsx`, `app/reference/page.tsx`, `app/init/page.tsx`.
- Contains: Route-level composition, static metadata, top-level mounts (`Nav`, `Footer`, page blocks).
- Depends on: SF wrappers, layout client islands, and lib data modules.
- Used by: All browser entry points through Next.js App Router.

**UI Composition (Server + Client Blocks):**
- Purpose: Build page sections and interactive surfaces.
- Location: `components/blocks/*.tsx`, `components/layout/*.tsx`.
- Contains: Content sections (`EntrySection`, `ComponentsExplorer`, `TokenTabs`, `APIExplorer`) and chrome (`Nav`, overlays, HUD).
- Depends on: `components/sf`, `hooks/*`, `lib/*`.
- Used by: Route files in `app/**`.

**Design System Wrapper Layer (FRAME):**
- Purpose: Provide stable component contracts over shadcn/Radix primitives.
- Location: `components/sf/*.tsx`, barrel `components/sf/index.ts`.
- Contains: SF-prefixed wrappers and layout primitives (`SFSection`, `SFContainer`, `SFText`).
- Depends on: Base primitives in `components/ui/*.tsx` and utilities in `lib/utils.ts`.
- Used by: Blocks, layout, and routes.

**Animation and Motion Layer (SIGNAL):**
- Purpose: Centralize GSAP/ScrollTrigger-driven behavior and keep it optional.
- Location: `components/layout/page-animations.tsx`, `lib/gsap-core.ts`, `lib/gsap-plugins.ts`, `hooks/use-nav-reveal.ts`.
- Contains: Scroll reveals, hero choreography, nav visibility control, reduced-motion branches.
- Depends on: DOM markers (`data-anim`, `data-bg-shift`) rendered by blocks/routes.
- Used by: `app/layout.tsx` via `PageAnimations` and per-page `NavRevealMount`.

**WebGL Scene Runtime (SIGNAL Canvas):**
- Purpose: Render all Three.js scenes through one fixed canvas.
- Location: `lib/signal-canvas.tsx`, `hooks/use-signal-scene.ts`, `components/animation/signal-mesh.tsx`.
- Contains: Singleton renderer state, scene registration API, viewport/scissor routing, disposal and visibility gating.
- Depends on: GSAP ticker (`lib/gsap-core.ts`) and scene components.
- Used by: Lazy canvas mount `components/layout/signal-canvas-lazy.tsx` and scene islands like `SignalMeshLazy`.

**Static Data and Docs Generation:**
- Purpose: Keep explorer/API surfaces data-driven and deterministic.
- Location: `lib/component-registry.ts`, `lib/api-docs.ts`, `scripts/generate-api-docs.ts`.
- Contains: Component metadata, canonical code snippets, generated API docs.
- Depends on: Entry points in `lib/entry-core.ts`, `lib/entry-animation.ts`, `lib/entry-webgl.ts`.
- Used by: `components/blocks/components-explorer.tsx`, `components/blocks/api-explorer.tsx`.

## Data Flow

**Primary Route Render Flow:**
1. Next.js resolves route and server-renders page trees from `app/**/page.tsx` under `app/layout.tsx`.
2. `app/layout.tsx` mounts shared client islands (`LenisProvider`, `SignalframeProvider`, `PageAnimations`, `SignalCanvasLazy`, `GlobalEffectsLazy`).
3. Server-provided data modules (for example `COMPONENT_REGISTRY` in `app/inventory/page.tsx`) are transformed before send (for example syntax highlighting via `lib/code-highlight.ts`).
4. Client explorers/hook islands hydrate and attach interactive behavior (`ComponentsExplorer`, `TokenTabs`, `APIExplorer`, nav reveal).

**Animation Control Flow:**
1. Route/blocks expose animation markers (`data-anim`, `data-bg-shift`) in markup.
2. `components/layout/page-animations.tsx` discovers markers after mount and conditionally lazy-loads heavy plugins.
3. `lib/gsap-core.ts` owns plugin registration and ticker; per-feature modules subscribe/unsubscribe in `useEffect`.
4. Reduced-motion checks in `page-animations.tsx`, `lenis-provider.tsx`, and `signal-mesh.tsx` short-circuit animation setup.

**WebGL Control Flow:**
1. `SignalCanvasLazy` mounts `SignalCanvas` once at root.
2. `initSignalCanvas()` in `lib/signal-canvas.tsx` initializes a singleton renderer and GSAP ticker callback.
3. Scene components call `useSignalScene()` to register scene + camera + element bounds.
4. Renderer iterates visible scenes and maps DOM rects to scissor/viewport slices each tick.

## Rendering Model

- Default to Server Components in `app/**/page.tsx`; only files with browser APIs use `"use client"`.
- Use dynamic client-only boundaries (`next/dynamic` with `ssr: false`) for heavy surfaces:
  - `components/layout/global-effects-lazy.tsx`
  - `components/layout/signal-canvas-lazy.tsx`
  - `components/animation/signal-mesh-lazy.tsx`
  - `components/animation/signal-overlay-lazy.tsx`
- Keep interactive islands local to where state lives (`components/blocks/components-explorer.tsx`, `components/blocks/token-tabs.tsx`).
- Use cache directives only in server routes that are static-safe (`app/system/page.tsx` includes `'use cache'`).

## Key Abstractions

**Signalframe Provider Factory:**
- Purpose: Theme and motion orchestration with SSR-safe initialization.
- Examples: `lib/signalframe-provider.tsx`, `components/layout/signalframe-config.tsx`.
- Pattern: Module-scope provider construction, context-backed hook access, optional GSAP loading.

**Component Registry Contract:**
- Purpose: Single source of truth for component metadata and explorer behavior.
- Examples: `lib/component-registry.ts`, consumer `components/blocks/components-explorer.tsx`.
- Pattern: Index-keyed records with layer/pattern metadata and code/documentation pointers.

**Split Entry Surface for Package Consumers:**
- Purpose: Keep FRAME-only consumers free from animation/WebGL payloads.
- Examples: `lib/entry-core.ts`, `lib/entry-animation.ts`, `lib/entry-webgl.ts`.
- Pattern: Capability-based exports compiled by `tsup.config.ts`.

## Entry Points

**Application Entry:**
- Location: `app/layout.tsx`
- Triggers: Every route request.
- Responsibilities: Global metadata, theme bootstrap script, provider stack, persistent client islands.

**Library Build Entry:**
- Location: `lib/entry-core.ts`, `lib/entry-animation.ts`, `lib/entry-webgl.ts`
- Triggers: `pnpm build:lib` via `tsup`.
- Responsibilities: Public API contract for npm consumers by capability tier.

**Security and Header Entry:**
- Location: `proxy.ts`
- Triggers: Matched requests excluding static assets.
- Responsibilities: Set CSP response header and enforce response policy defaults.

## Error Handling

**Strategy:** Route-level graceful degradation with explicit error boundaries and reduced-motion-safe fallbacks.

**Patterns:**
- Use route error boundary in `app/error.tsx` for recoverable runtime failures (`reset()` path).
- Use shell-level fallback in `app/global-error.tsx` for fatal tree failures.
- Use missing-route fallback in `app/not-found.tsx`.
- Feature modules guard missing DOM targets and unsupported capabilities (`signal-mesh.tsx` WebGL fallback, null checks in `page-animations.tsx`).

## Boundaries

**Server/Client Boundary:**
- Keep serializable data and metadata in server routes and `lib/*.ts`.
- Keep browser APIs (`window`, `document`, WebGL, media queries) only in `"use client"` files.

**FRAME/SIGNAL Boundary:**
- FRAME wrappers stay in `components/sf/` and `lib/entry-core.ts`.
- SIGNAL behavior stays in animation/webgl modules and optional entries (`lib/entry-animation.ts`, `lib/entry-webgl.ts`).

**UI/Data Boundary:**
- Keep data catalogs (`lib/component-registry.ts`, `lib/api-docs.ts`) free of React hooks.
- Keep rendering behavior in blocks/components that consume those catalogs.

## Cross-Cutting Concerns

**Logging:** Minimal runtime logging; debug traces mainly in rendering subsystems (`components/animation/signal-mesh.tsx`).
**Validation:** TypeScript strict mode (`tsconfig.json`) and lint rules (`eslint.config.js`) enforce structure.
**Authentication:** Not applicable; no auth layer detected in `app/` routes.

---

*Architecture analysis: 2026-04-12*
