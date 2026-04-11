# Phase 39: Library Build Pipeline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 39-library-build-pipeline
**Areas discussed:** Export surface, Next.js decoupling, Heavy dependency isolation, Build configuration
**Mode:** --auto (all decisions auto-selected)

---

## Export Surface

| Option | Description | Selected |
|--------|-------------|----------|
| Full export | Export all 51 components + all hooks + all lib modules | |
| Curated subset | SF components + primitives + hooks + core utils; exclude app-specific content | ✓ |
| Minimal core | Only layout primitives + core utils; components opt-in | |

**User's choice:** [auto] Curated subset (recommended default)
**Notes:** App-specific files (thesis-manifesto, proof-components, api-docs, system-stats, nomenclature) stay internal. Component registry excluded due to Next.js code snippets.

---

## Next.js Decoupling

| Option | Description | Selected |
|--------|-------------|----------|
| Exclude lazy wrappers + optional peer | Remove next/dynamic wrappers from build, make next optional peerDep | ✓ |
| Shim next imports | Create thin shims for next/dynamic and next/navigation | |
| Full decouple | Rewrite all Next.js-dependent code to be framework-agnostic | |

**User's choice:** [auto] Exclude lazy wrappers + optional peer (recommended default)
**Notes:** 3 lazy wrappers (calendar, drawer, menubar) use next/dynamic — excluded. use-scroll-restoration uses next/navigation — planner decides exclude vs. restructure.

---

## Heavy Dependency Isolation

| Option | Description | Selected |
|--------|-------------|----------|
| Separate entry points | signalframeux/core, signalframeux/animation, signalframeux/webgl | ✓ |
| Single entry + peerDeps | One entry point, mark gsap/three as peerDeps, rely on tree-shaking | |
| Exclude heavy deps entirely | Only ship FRAME-layer components, no SIGNAL components in library | |

**User's choice:** [auto] Separate entry points (recommended default)
**Notes:** 6 GSAP-dependent components go to /animation, 6 Three.js modules go to /webgl. Core entry point stays clean. Tree-shaking validation test required.

---

## Build Configuration

| Option | Description | Selected |
|--------|-------------|----------|
| Ship token CSS file | Standalone CSS with OKLCH custom properties; consumers import alongside JS | ✓ |
| Tailwind plugin | Ship as Tailwind plugin that injects token values | |
| CSS-in-JS tokens | Embed tokens in JS via CSS object syntax | |

**User's choice:** [auto] Ship token CSS file (recommended default)
**Notes:** Consumers get `signalframeux.css` with design token custom properties. Tailwind v4 remains peerDep for utility classes. React/ReactDOM as standard peerDeps.

---

## Claude's Discretion

- tsup config details (splitting, minification, sourcemaps)
- dist/ folder structure
- prepublishOnly script vs manual build
- shadcn registry coexistence with library build
