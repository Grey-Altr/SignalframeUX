# Phase 39: Library Build Pipeline - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform SignalframeUX from a `"private": true` Next.js application into a consumable ESM+CJS library package. The library exposes SF components, layout primitives, hooks, and core utilities with proper TypeScript declarations. Heavy dependencies (GSAP, Three.js) are isolated into separate entry points so consumers only import what they use. The existing Next.js app continues to work as before — the build pipeline adds library output alongside the app build.

</domain>

<decisions>
## Implementation Decisions

### Export Surface
- **D-01:** Public API is a curated subset — all SF components from `components/sf/index.ts`, layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText), hooks (`use-nav-reveal`, `use-scramble-text`, `use-scroll-restoration`, `use-session-state`, `use-signal-scene`), and core lib utilities (`utils.ts`, `theme.ts`, `color-resolve.ts`, `gsap-core.ts`, `gsap-easings.ts`, `gsap-plugins.ts`, `grain.ts`, `signalframe-provider.tsx`)
- **D-02:** Excluded from library: app-specific content files (`thesis-manifesto.ts`, `proof-components.ts`, `api-docs.ts`, `system-stats.ts`, `nomenclature.ts`), code-highlight (Shiki dependency), audio-feedback, haptic-feedback
- **D-03:** `component-registry.ts` excluded from library build — it contains Next.js-specific code snippets for the app's reference page

### Next.js Decoupling
- **D-04:** Lazy wrapper components (`sf-calendar-lazy.tsx`, `sf-drawer-lazy.tsx`, `sf-menubar-lazy.tsx`) excluded from library build — they use `next/dynamic` which is framework-specific. Library exports the base components directly; consumers handle lazy loading in their own framework.
- **D-05:** `use-scroll-restoration` hook depends on `next/navigation` — either exclude from library or restructure to accept a pathname parameter instead of importing it. Planner decides approach.
- **D-06:** `next` listed as `peerDependency` (optional) — consumers using the scroll restoration hook need it, but core components don't require it

### Heavy Dependency Isolation
- **D-07:** Three entry points via package.json `exports` field:
  - `signalframeux` (or `signalframeux/core`) — all SF components, layout primitives, core hooks/utils. No GSAP or Three.js.
  - `signalframeux/animation` — GSAP-dependent components (SFAccordion, SFProgress, SFSection, SFStatusDot, SFStepper, SFToast) + GSAP utilities from lib/
  - `signalframeux/webgl` — Three.js-dependent modules (signal-canvas, use-signal-scene, color-resolve with Three.js imports)
- **D-08:** `gsap` and `three` as `peerDependencies` — not bundled, consumers install what they need
- **D-09:** Tree-shaking validation: a test confirming that importing from `signalframeux` alone does NOT pull in gsap or three chunks

### Build Configuration
- **D-10:** tsup as the build tool (per roadmap specification)
- **D-11:** Dual ESM + CJS output with `.d.ts` type declarations
- **D-12:** Ship a standalone CSS file (`signalframeux.css`) containing OKLCH token definitions from `globals.css` — the design token custom properties, not Tailwind utility classes. Consumers import this file to get the token system.
- **D-13:** Tailwind CSS v4 remains a `peerDependency` — consumers using SF components with Tailwind classes need it in their own project
- **D-14:** `react` and `react-dom` as `peerDependencies` (standard for React component libraries)

### Claude's Discretion
- tsup configuration details (splitting, minification, sourcemaps)
- Exact file organization for the build output (`dist/` structure)
- Whether to add a `prepublishOnly` script or keep build manual
- How to handle the existing `shadcn build` registry alongside library build

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Package Configuration
- `package.json` — Current dependencies, scripts, `"private": true` flag to remove
- `tsconfig.json` — Current TypeScript config (noEmit, bundler moduleResolution — library build needs separate tsconfig)

### Export Surface
- `components/sf/index.ts` — Current barrel export, defines the component API surface
- `lib/signalframe-provider.tsx` — Config provider, part of public API
- `hooks/` directory — All custom hooks, subset exported

### Dependency Mapping
- `components/sf/sf-accordion.tsx`, `sf-progress.tsx`, `sf-section.tsx`, `sf-status-dot.tsx`, `sf-stepper.tsx`, `sf-toast.tsx` — GSAP-dependent components (animation entry point)
- `lib/signal-canvas.tsx`, `hooks/use-signal-scene.ts`, `lib/color-resolve.ts` — Three.js-dependent modules (webgl entry point)
- `components/sf/sf-calendar-lazy.tsx`, `sf-drawer-lazy.tsx`, `sf-menubar-lazy.tsx` — Next.js dynamic imports (excluded from library)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/sf/index.ts` barrel export: well-organized, can serve as the source of truth for the core entry point
- 51 SF components already follow consistent patterns (CVA variants, cn() utility, Radix composition)
- SignalframeProvider + useSignalframe hook: existing config system, exportable as-is

### Established Patterns
- Pattern A (direct SF wrap): 35 components — no heavy deps, clean for core entry point
- Pattern B (lazy/next/dynamic): 3 components — framework-specific, excluded from library
- Pattern C (GSAP/Three.js): ~12 components/modules — isolated to animation/webgl entry points
- All components use Tailwind classes + OKLCH CSS custom properties — CSS token file needed

### Integration Points
- `package.json` `exports` field: new — defines entry points for consumers
- `tsconfig.build.json`: new — separate config for library compilation (not noEmit)
- `tsup.config.ts`: new — build configuration
- Existing `shadcn build` (registry) and `next build` (app) continue working alongside

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches for React component library packaging with tsup.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 39-library-build-pipeline*
*Context gathered: 2026-04-10*
