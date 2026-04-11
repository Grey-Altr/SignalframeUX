# Phase 39: Library Build Pipeline - Research

**Researched:** 2026-04-10
**Domain:** TypeScript library packaging — tsup, ESM/CJS dual output, package.json exports, tree-shaking
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Export Surface:**
- D-01: Public API is a curated subset — all SF components from `components/sf/index.ts`, layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText), hooks (`use-nav-reveal`, `use-scramble-text`, `use-scroll-restoration`, `use-session-state`, `use-signal-scene`), and core lib utilities (`utils.ts`, `theme.ts`, `color-resolve.ts`, `gsap-core.ts`, `gsap-easings.ts`, `gsap-plugins.ts`, `grain.ts`, `signalframe-provider.tsx`)
- D-02: Excluded from library: `thesis-manifesto.ts`, `proof-components.ts`, `api-docs.ts`, `system-stats.ts`, `nomenclature.ts`, code-highlight (Shiki), audio-feedback, haptic-feedback
- D-03: `component-registry.ts` excluded — contains Next.js-specific code snippets

**Next.js Decoupling:**
- D-04: Lazy wrappers (`sf-calendar-lazy.tsx`, `sf-drawer-lazy.tsx`, `sf-menubar-lazy.tsx`) excluded — use `next/dynamic`
- D-05: `use-scroll-restoration` depends on `next/navigation` — either exclude or restructure to accept pathname parameter. Planner decides.
- D-06: `next` listed as `peerDependency` (optional)

**Heavy Dependency Isolation:**
- D-07: Three entry points via `exports` field:
  - `signalframeux` (core) — all SF components, layout primitives, core hooks/utils. No GSAP or Three.js.
  - `signalframeux/animation` — GSAP-dependent components + GSAP utilities from lib/
  - `signalframeux/webgl` — Three.js-dependent modules (signal-canvas, use-signal-scene, color-resolve)
- D-08: `gsap` and `three` as `peerDependencies`
- D-09: Tree-shaking validation confirming core entry does NOT pull gsap or three

**Build Configuration:**
- D-10: tsup as the build tool (non-negotiable)
- D-11: Dual ESM + CJS output with `.d.ts` type declarations
- D-12: Ship standalone CSS file (`signalframeux.css`) with OKLCH token definitions from `globals.css` — design token custom properties, NOT Tailwind utility classes
- D-13: Tailwind CSS v4 remains a `peerDependency`
- D-14: `react` and `react-dom` as `peerDependencies`

### Claude's Discretion
- tsup configuration details (splitting, minification, sourcemaps)
- Exact file organization for the build output (`dist/` structure)
- Whether to add a `prepublishOnly` script or keep build manual
- How to handle the existing `shadcn build` registry alongside library build

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| LIB-01 | `package.json` exports field mapping SF components, tokens CSS, and utilities | Standard tsup + package.json `exports` subpath pattern; three-subpath structure (core/animation/webgl); CSS file as `.` subpath export |
| LIB-02 | `pnpm build:lib` produces ESM + CJS output via tsup in `dist/` with `.d.ts` declarations | tsup `format: ["esm", "cjs"]` + `dts: true`; separate `tsconfig.build.json` needed since current tsconfig has `noEmit: true` |
| LIB-03 | Consumer importing `@signalframe/sf` does NOT bundle GSAP or Three.js (tree-shaking verified) | Entry point isolation (three separate entry files); `sideEffects: false` in package.json; verification via `ANALYZE=true pnpm build` on a test consumer or bundle-size script |
</phase_requirements>

---

## Summary

Phase 39 converts SignalframeUX from a `"private": true` Next.js application into a distributable npm package. The primary challenge is threefold: (1) running tsup alongside an existing Next.js build without disrupting it, (2) correctly isolating GSAP and Three.js into separate entry points so core imports stay lean, and (3) shipping the OKLCH token CSS as a standalone file consumers can import separately.

**Critical codebase finding:** `lib/signalframe-provider.tsx` imports `gsap` directly at the module level (line 4: `import gsap from 'gsap'`). This means including `signalframe-provider.tsx` in the "core" entry point — as currently planned in D-01 — will pull GSAP into the core bundle. The planner must resolve this conflict: either move `signalframe-provider.tsx` to the animation entry point, or refactor it to lazy-load GSAP, or accept gsap as a core peer dependency. This is the single biggest planning risk.

Additionally, `use-scroll-restoration` imports `next/navigation` and `useLenisInstance` from `@/components/layout/lenis-provider` — both are Next.js-specific. D-05 calls for excluding or restructuring; the research recommends excluding from library v1 rather than restructuring, since `lenis-provider` is an app-internal component not part of the public API.

**Primary recommendation:** Use tsup 8.5.1 (already available globally, not yet in project devDeps) with three named entry files, one `tsconfig.build.json` that overrides `noEmit: false`, and a `cp` postbuild step for the CSS token file.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tsup | 8.5.1 | TypeScript library bundler | Zero-config esbuild-powered; standard for React library packaging in 2025 |

[VERIFIED: npm registry — `npm view tsup version` returned `8.5.1`, published 2025-11-12]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| publint | latest | Validates package.json exports field correctness | Run as post-build check before `npm pack` |

[ASSUMED — publint is widely cited in React library packaging guides; version not verified against npm]

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| tsup | tsdown | tsdown is newer (Rolldown-based) but still alpha in 2025; tsup is locked by D-10 |
| tsup | Rollup | More control but significantly more config; tsup is locked by D-10 |
| Manual `cp` for CSS | tsup CSS entry | tsup CSS support is experimental and has known PostCSS issues; manual copy is more reliable |

**Installation:**
```bash
pnpm add -D tsup
```

**Version verification:** `npm view tsup version` confirmed `8.5.1` published 2025-11-12.

---

## Architecture Patterns

### Recommended Project Structure
```
dist/
├── index.js           # ESM core
├── index.cjs          # CJS core
├── index.d.ts         # Types core (CJS)
├── index.d.mts        # Types core (ESM)
├── animation.js       # ESM animation entry
├── animation.cjs      # CJS animation entry
├── animation.d.ts     # Types animation
├── animation.d.mts    # Types animation (ESM)
├── webgl.js           # ESM webgl entry
├── webgl.cjs          # CJS webgl entry
├── webgl.d.ts         # Types webgl
├── webgl.d.mts        # Types webgl (ESM)
└── signalframeux.css  # Token CSS (standalone, copied)

lib/
├── entry-core.ts          # NEW: core entry — all SF components + safe lib utils
├── entry-animation.ts     # NEW: GSAP entry — GSAP components + gsap-* utils
└── entry-webgl.ts         # NEW: Three.js entry — signal-canvas, use-signal-scene, color-resolve
```

### Pattern 1: Three Named Entry Files

**What:** Three dedicated entry files at project root (or `lib/`) that import only the components appropriate for their dependency tier.

**When to use:** Required whenever you have heavy peerDependencies that must be kept out of the base bundle.

**Example (entry-core.ts):**
```typescript
// Source: verified pattern from dorshinar.me/posts/treeshaking-with-tsup
// Exports only dependency-free SF components and utilities
export * from "./components/sf/index";  // But excluding GSAP-dependent ones
export * from "./lib/utils";
export * from "./lib/theme";
export * from "./lib/grain";
// OMIT: gsap-core, gsap-easings, gsap-plugins, gsap-draw, gsap-flip, gsap-split
// OMIT: signalframe-provider (imports gsap directly — see Critical Issue)
// OMIT: color-resolve (imports three)
```

**Example (entry-animation.ts):**
```typescript
// gsap + @gsap/react as peerDependencies
export * from "./lib/gsap-core";
export * from "./lib/gsap-easings";
export * from "./lib/gsap-plugins";
export * from "./lib/gsap-draw";
export * from "./lib/gsap-flip";
export * from "./lib/gsap-split";
export * from "./lib/signalframe-provider";   // Contains gsap import
// + GSAP-dependent SF components (accordion, progress, status-dot, stepper, toast)
```

**Example (entry-webgl.ts):**
```typescript
// three as peerDependency
export * from "./lib/signal-canvas";
export * from "./lib/color-resolve";
export * from "./hooks/use-signal-scene";
```

### Pattern 2: tsup.config.ts for Three Entry Points

**What:** Single tsup config generating ESM + CJS for all three entry points simultaneously.

**Example:**
```typescript
// Source: verified from multiple tsup library guides (logrocket, medium, dorshinar.me)
import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: {
      index: "lib/entry-core.ts",
      animation: "lib/entry-animation.ts",
      webgl: "lib/entry-webgl.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    sourcemap: true,
    splitting: false,          // Disable code splitting — separate entry points handle this
    treeshake: true,
    external: [
      "react",
      "react-dom",
      "next",
      "gsap",
      "@gsap/react",
      "three",
      "@types/three",
    ],
    tsconfig: "tsconfig.build.json",
    outDir: "dist",
  },
]);
```

**Note on `splitting: false`:** Code splitting creates shared chunks, which can collapse the entry point boundary and inadvertently pull deps across entry points. With separate named entries and `sideEffects: false`, no splitting is the safer default.

**Note on JSX runtime:** tsup reads `jsx: "react-jsx"` from tsconfig automatically when tsconfig is provided, enabling automatic JSX transform without needing `esbuildOptions`. [VERIFIED: confirmed via tsup GitHub issue #792 resolution]

### Pattern 3: tsconfig.build.json

**What:** Separate TypeScript config for library compilation that overrides `noEmit: true` from the main tsconfig.

**Why needed:** Current `tsconfig.json` has `noEmit: true` (required for Next.js type-checking workflow) and `moduleResolution: "bundler"`. Library compilation needs `noEmit: false` (or omitted) and a compatible module resolution. [VERIFIED: current tsconfig.json confirmed via file read]

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": true,
    "declarationDir": "./dist",
    "outDir": "./dist",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "exclude": [
    "node_modules",
    ".next",
    ".planning",
    "app/**",
    "tests/**",
    "playwright.config.ts",
    "next.config.ts",
    "vitest.config.ts",
    "scripts/**"
  ]
}
```

**Important:** tsup handles the actual transpilation via esbuild; the `tsconfig.build.json` is primarily consumed by tsup's `dts` process (it uses tsc under the hood for declaration generation). Excluding `app/**` prevents Next.js-specific code from being scanned during `.d.ts` generation.

### Pattern 4: package.json exports Field

**What:** Subpath exports mapping each entry point + the CSS file. Replaces `"private": true`.

```json
{
  "name": "signalframeux",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.cjs"
      }
    },
    "./animation": {
      "import": {
        "types": "./dist/animation.d.mts",
        "default": "./dist/animation.mjs"
      },
      "require": {
        "types": "./dist/animation.d.ts",
        "default": "./dist/animation.cjs"
      }
    },
    "./webgl": {
      "import": {
        "types": "./dist/webgl.d.mts",
        "default": "./dist/webgl.mjs"
      },
      "require": {
        "types": "./dist/webgl.d.ts",
        "default": "./dist/webgl.cjs"
      }
    },
    "./signalframeux.css": "./dist/signalframeux.css"
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "sideEffects": ["./dist/signalframeux.css"],
  "peerDependencies": {
    "react": ">=19.0.0",
    "react-dom": ">=19.0.0",
    "tailwindcss": ">=4.0.0",
    "gsap": ">=3.12.0",
    "@gsap/react": ">=2.0.0",
    "three": ">=0.183.0",
    "next": ">=16.0.0"
  },
  "peerDependenciesMeta": {
    "gsap": { "optional": true },
    "@gsap/react": { "optional": true },
    "three": { "optional": true },
    "next": { "optional": true },
    "tailwindcss": { "optional": true }
  }
}
```

**Note on `"type": "module"`:** Setting this changes how Node.js treats `.js` files in the package. tsup's CJS output should use `.cjs` extension explicitly to remain valid regardless of this field. [CITED: dorshinar.me/posts/treeshaking-with-tsup]

**Note on `sideEffects`:** The CSS file must be listed as a side effect or bundlers may drop it. All JS files get `sideEffects: false` implicitly (not listed), which enables tree-shaking. [CITED: dorshinar.me/posts/treeshaking-with-tsup]

### Pattern 5: CSS Token File Handling

**What:** `signalframeux.css` is extracted from `app/globals.css` — only the `:root`/`@theme` token custom properties, not the `@import "tailwindcss"` or component-specific CSS.

**Approach:** Create `lib/tokens.css` containing only the token definitions, then copy it to `dist/signalframeux.css` as a postbuild step.

**Build script:**
```json
{
  "scripts": {
    "build:lib": "tsup && cp lib/tokens.css dist/signalframeux.css"
  }
}
```

**Why not use tsup CSS entry:** tsup's CSS entry point support is experimental and requires PostCSS. The `globals.css` has `@import "tailwindcss"` at the top — running it through tsup would attempt to process Tailwind v4 directives, which breaks without the full Next.js build pipeline. Manual copy of the pre-extracted token-only CSS file is the correct approach. [VERIFIED: confirmed via tsup GitHub issue #1287 and discussion #621 analysis]

### Anti-Patterns to Avoid

- **Including Next.js-specific imports in any library entry:** `next/navigation`, `next/dynamic`, `@/components/layout/lenis-provider` must not appear in any library entry file. The `@/` alias is a Next.js/build-tool concern — library entry files must use relative imports or restructure the dependencies.
- **Using `sideEffects: false` on CSS files:** CSS imports have side effects (they modify the document). CSS files must be either listed in the `sideEffects` array or excluded from `sideEffects: false` declarations.
- **Passing `splitting: true` with separate entry points:** Code splitting can create shared chunks that cross entry point boundaries, breaking the GSAP/Three.js isolation. Disable splitting for this use case.
- **Using the app tsconfig for library builds:** `moduleResolution: "bundler"` with `noEmit: true` and Next.js plugin scoping causes declaration generation to fail or include Next.js types. A separate `tsconfig.build.json` is required.
- **Putting `"type": "module"` without explicit `.cjs` extensions:** If `type: module` is set but the package needs to work in CommonJS consumers, CJS output must use `.cjs` extension explicitly.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dual ESM/CJS output | Custom rollup/webpack config | tsup `format: ["esm", "cjs"]` | tsup handles esbuild internals, declaration file generation, and format-specific extensions automatically |
| Type declarations | Manual `tsc --declaration` scripts | tsup `dts: true` | tsup orchestrates tsc for declarations tied to the same build run |
| External dependency exclusion | Manual bundle analysis | `external: [...]` in tsup config + peerDependencies in package.json | tsup auto-reads peerDependencies and marks them external |
| Package validation | Manually inspecting dist/ | `npm pack --dry-run` + `publint` | Catches missing files, wrong export paths, type resolution failures |

**Key insight:** The tsup + package.json exports combination is now the standard for React library packaging. The complexity is in correct entry point segmentation, not the build tooling itself.

---

## Critical Issue: signalframe-provider.tsx Imports GSAP

**Discovered via codebase grep:** [VERIFIED by file read]

```typescript
// lib/signalframe-provider.tsx line 4 (confirmed)
import gsap from 'gsap';
```

`signalframe-provider.tsx` directly imports `gsap` at the module level. D-01 lists it as part of the "core" entry point. D-07 says core must have "No GSAP or Three.js."

**These two decisions are contradictory.** The planner must choose one of:

1. **Move `signalframe-provider.tsx` to the animation entry point** — consumers using the animation entry get the provider, core consumers don't. Risk: breaks the intended core API.

2. **Refactor `signalframe-provider.tsx` to lazy-load GSAP** — replace `import gsap from 'gsap'` with a dynamic `import('gsap')` inside the `useEffect` that uses it. This is the architecturally correct solution for a library but requires code changes. The motion controller interface stays the same; GSAP only loads when a consumer has it installed.

3. **Accept gsap as a required peerDependency for core** — simplest but violates D-07 explicitly. The whole point of D-07 is tree-shaking GSAP for non-animation consumers.

**Recommendation:** Option 2 (lazy GSAP import in provider) is the correct library-grade solution. The provider's GSAP usage is limited to `gsap.globalTimeline.timeScale()` and `gsap.globalTimeline.pause/resume()` — these can be wrapped in a `typeof window !== 'undefined' && import('gsap').then(...)` pattern. [ASSUMED — this refactor approach is based on standard dynamic import patterns; needs implementation verification]

---

## Common Pitfalls

### Pitfall 1: `@/` Path Alias in Library Entry Files
**What goes wrong:** Entry files that import via `@/lib/utils` or `@/components/sf/...` fail at build time because the `@/` alias is a Next.js/Webpack/Turbopack concern wired in `tsconfig.json`. tsup reads the paths config, but the resolution target is the project root — which includes Next.js app files that shouldn't be in the library bundle.
**Why it happens:** The existing codebase uses `@/` everywhere. When tsup bundles, it follows the alias and may include unexpected files.
**How to avoid:** Library entry files (`lib/entry-core.ts` etc.) must use relative paths, not `@/`. tsup config can include `paths` override, but entry files should be clean.
**Warning signs:** tsup emitting files from `app/` directory into `dist/`; build errors about Next.js-specific imports.

### Pitfall 2: Declaration Files Include Next.js Types
**What goes wrong:** `.d.ts` files reference Next.js types (`NextPage`, `usePathname`, etc.) that consumers don't have, causing type errors at install time.
**Why it happens:** `tsconfig.build.json` includes files from `hooks/` (specifically `use-scroll-restoration.ts`) that import `next/navigation`.
**How to avoid:** Exclude `use-scroll-restoration` from library build if it can't be refactored (D-05 leaves this to the planner). Add it to `tsconfig.build.json` exclude list. If included, `next` must be in `peerDependencies` with proper types.
**Warning signs:** Consumer seeing `Cannot find module 'next/navigation'` in `.d.ts` files.

### Pitfall 3: CSS Token File Contains Tailwind Directives
**What goes wrong:** If `globals.css` is copied directly to `dist/signalframeux.css`, consumers get `@import "tailwindcss"`, `@custom-variant dark`, and `@source not` directives that only work inside a Tailwind v4 build pipeline.
**Why it happens:** `globals.css` is 1,813 lines — it mixes Tailwind configuration with token definitions.
**How to avoid:** Create a new `lib/tokens.css` that contains ONLY the `@theme {}` block and the `:root` variable blocks. This is the "OKLCH token definitions" that D-12 specifies. Do NOT copy the full `globals.css`.
**Warning signs:** Consumer reporting `@import "tailwindcss"` errors when importing the CSS file.

### Pitfall 4: GSAP Leaks Into Core Bundle Via Transitive Import
**What goes wrong:** Even if `entry-core.ts` doesn't directly import GSAP components, if it exports `signalframe-provider.tsx` (which imports `gsap`), the core bundle includes GSAP.
**Why it happens:** Tree-shaking operates at the module level for unused named exports, but module-level side effects (like `import gsap from 'gsap'`) are always executed regardless of what's tree-shaken. The `gsap.registerPlugin(...)` call in `gsap-core.ts` is a side effect that would survive tree-shaking.
**How to avoid:** Strict entry point discipline — `entry-core.ts` must not include any file that imports from `gsap` or `three`. Verify with the bundle analyzer test (D-09).
**Warning signs:** `pnpm build:lib` output — `dist/index.js` containing `from 'gsap'` strings.

### Pitfall 5: `sideEffects: false` Causes CSS to Be Dropped
**What goes wrong:** Bundler eliminates `signalframeux.css` because no JS code "uses" the CSS file's exports.
**Why it happens:** `sideEffects: false` tells bundlers to drop anything not explicitly imported. CSS files are side effects — they modify the document without returning a value.
**How to avoid:** Use `"sideEffects": ["./dist/signalframeux.css"]` in package.json — not blanket `false`.
**Warning signs:** Consumer imports `@signalframe/sf/signalframeux.css` but no styles appear.

### Pitfall 6: Existing `shadcn build` and `next build` Break After Changes
**What goes wrong:** Removing `"private": true`, adding `"type": "module"`, or changing the exports field can break how Next.js resolves the package from within the same monorepo-style workspace.
**Why it happens:** Next.js 16 reads `package.json` exports for internal resolution. Adding `"type": "module"` changes how `.js` files are treated at runtime.
**How to avoid:** Test `pnpm build` (Next.js) after every package.json structural change. The `build:lib` and `build` scripts must coexist. The `next.config.ts` already has `@next/bundle-analyzer` — confirm it still loads after package changes.
**Warning signs:** Next.js build failing with "cannot find module" or ESM interop errors after package.json edits.

---

## Code Examples

### tsup.config.ts (Recommended Starting Point)
```typescript
// Source: Verified from multiple tsup React library guides (logrocket, dorshinar.me, medium/@asafshakarzy)
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "lib/entry-core.ts",
    animation: "lib/entry-animation.ts",
    webgl: "lib/entry-webgl.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "next",
    "gsap",
    "@gsap/react",
    "three",
    "@types/three",
    "tailwindcss",
  ],
  tsconfig: "tsconfig.build.json",
  outDir: "dist",
});
```

### Tree-Shaking Verification Script
```typescript
// scripts/verify-tree-shake.ts — run after build:lib
// Source: [ASSUMED] — standard bundle content verification pattern
import { readFileSync } from "fs";

const coreESM = readFileSync("dist/index.mjs", "utf8");
const coreCJS = readFileSync("dist/index.cjs", "utf8");

const hasGSAP = coreESM.includes("gsap") || coreCJS.includes("gsap");
const hasThree = coreESM.includes("three") || coreCJS.includes("three");

if (hasGSAP) {
  console.error("FAIL: Core bundle contains 'gsap' reference");
  process.exit(1);
}
if (hasThree) {
  console.error("FAIL: Core bundle contains 'three' reference");
  process.exit(1);
}
console.log("PASS: Core bundle is free of gsap and three");
```

This script satisfies D-09 as a fast, automated check. It's a string-search heuristic — if `gsap` or `three` appear as import strings, the external marking failed. [ASSUMED for specific implementation; the verification approach is sound]

### npm pack Validation
```bash
# Run after build:lib to verify package contents
npm pack --dry-run

# Expected: dist/ files, package.json, README.md
# Not expected: app/, components/, lib/ source, node_modules, .next
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Rollup + hand-rolled config | tsup (esbuild-powered) | ~2022 | 10-100x faster builds, zero-config dual output |
| `main` + `module` fields | `exports` subpath field | Node.js 12+ / broadly adopted ~2022 | Encapsulated package, tree-shakeable subpaths |
| `tsc --declaration` post-step | tsup `dts: true` | tsup 5+ | Declarations generated in same build pass |
| `sideEffects: false` on entire package | Array form for CSS files | webpack/rollup best practices 2022+ | CSS not accidentally dropped by consumer bundlers |

**Deprecated/outdated:**
- `"module"` field: Still useful as fallback for bundlers that don't read `exports` field, but `exports` is now authoritative for Node.js 12+ consumers
- `peerDependenciesMeta` not included: Libraries should always mark optional peers as optional; consumers get cleaner install warnings

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `signalframe-provider.tsx` lazy-import refactor is the correct resolution for the GSAP conflict | Critical Issue | Planner picks wrong option; GSAP leaks into core bundle or provider is demoted to animation entry (breaking core API) |
| A2 | `splitting: false` prevents cross-entry-point chunk merging in tsup | Pattern 2 | If splitting behavior changed in tsup 8.x, shared chunks might still form; needs build verification |
| A3 | `publint` is the right post-build validation tool | Standard Stack | Minor — alternative tools exist (are-the-types-wrong); impact is DX only |
| A4 | Tree-shaking verification via string search in dist files is sufficient for D-09 | Code Examples | If tsup transforms import strings, false negatives possible — but bundle-analyzer would catch it |
| A5 | `use-scroll-restoration` should be excluded rather than refactored | Architecture | If included without refactor, `next/navigation` leaks into declarations; if excluded, hook is unavailable to library consumers |

---

## Open Questions

1. **signalframe-provider.tsx and GSAP conflict (CRITICAL)**
   - What we know: The file imports `gsap` at module level; core entry must be GSAP-free (D-07)
   - What's unclear: Which resolution strategy the planner chooses (exclude from core, refactor to lazy-load, or move to animation entry)
   - Recommendation: Refactor to lazy-load GSAP in provider's useEffect (Option 2 from Critical Issue section) — this preserves the core API while satisfying D-07

2. **use-scroll-restoration: exclude vs. refactor (D-05)**
   - What we know: Hook imports `next/navigation` and `useLenisInstance` from app-internal `lenis-provider`
   - What's unclear: D-05 leaves the decision to the planner
   - Recommendation: Exclude from library v1. The `useLenisInstance` dependency points to `@/components/layout/lenis-provider` which is app-internal, not an exportable library component. Refactoring requires extracting Lenis into a separate library context — out of scope for Phase 39.

3. **Package name: `signalframeux` vs `@signalframe/sf`**
   - What we know: CONTEXT.md uses both names; D-07 says `signalframeux/animation` etc.; success criteria says `@signalframe/sf`; `package.json` has `"name": "signalframeux"`
   - What's unclear: Which name is canonical for the published package
   - Recommendation: Keep `signalframeux` (matches current package.json); the `@signalframe/sf` in success criteria appears to be consumer-facing shorthand, not the npm package name. Planner should confirm.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| tsup | Build tool | Partial (global) | 8.5.1 (global via npx) | Install as devDep |
| pnpm | Build scripts | ✓ | confirmed (project uses it) | — |
| node | Build runtime | ✓ | v20.20.0 | — |
| tsc | Declaration generation | ✓ | ^5.8.3 (in devDeps) | — |
| npm (pack) | Validation | ✓ | bundled with node | — |

**tsup not in project devDependencies:** [VERIFIED via `node -e "require('./node_modules/tsup/package.json')"` returning not-found]. Must add to `devDependencies` in package.json. Available via `npx tsup` globally.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 |
| Config file | `vitest.config.ts` |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test:coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LIB-01 | `exports` field maps all three entry points + CSS | smoke | `npm pack --dry-run && node -e "require('./dist/index.cjs')"` | ❌ Wave 0 — manual verification |
| LIB-02 | `pnpm build:lib` produces ESM + CJS + `.d.ts` in `dist/` | smoke | `pnpm build:lib && ls dist/` file existence checks | ❌ Wave 0 |
| LIB-03 | Core bundle contains no `gsap` or `three` string references | unit/smoke | `node scripts/verify-tree-shake.mjs` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm build:lib` succeeds (exit 0)
- **Per wave merge:** `pnpm build:lib && node scripts/verify-tree-shake.mjs && npm pack --dry-run`
- **Phase gate:** All three LIB requirements verified before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `lib/entry-core.ts` — core entry point file (new file)
- [ ] `lib/entry-animation.ts` — animation entry point file (new file)
- [ ] `lib/entry-webgl.ts` — webgl entry point file (new file)
- [ ] `lib/tokens.css` — extracted token-only CSS (new file, subset of globals.css)
- [ ] `tsup.config.ts` — build configuration (new file)
- [ ] `tsconfig.build.json` — library-specific TypeScript config (new file)
- [ ] `scripts/verify-tree-shake.mjs` — D-09 validation script (new file)

---

## Security Domain

This phase is infrastructure-only (build pipeline configuration). No user-facing auth, session management, or data handling. The primary security consideration is package contents — `npm pack --dry-run` verifies that private keys, `.env` files, and internal app files are not included in the published package.

**Applicable ASVS Categories:**

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | — |
| V3 Session Management | No | — |
| V4 Access Control | No | — |
| V5 Input Validation | No | — |
| V6 Cryptography | No | — |

**Package safety check:** `files: ["dist"]` in package.json restricts what is published. Verify `npm pack --dry-run` does not include `.env`, `CLAUDE.md`, `app/`, `lib/` source, or `.planning/` before publishing.

---

## Sources

### Primary (HIGH confidence)
- `npm view tsup version` — confirmed 8.5.1, published 2025-11-12
- `/Users/greyaltaer/code/projects/SignalframeUX/tsconfig.json` — confirmed `noEmit: true`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`
- `/Users/greyaltaer/code/projects/SignalframeUX/package.json` — confirmed `"private": true`, current deps, no tsup in devDeps
- `/Users/greyaltaer/code/projects/SignalframeUX/lib/signalframe-provider.tsx` — confirmed `import gsap from 'gsap'` at line 4
- `/Users/greyaltaer/code/projects/SignalframeUX/lib/color-resolve.ts` — confirmed `import * as THREE from "three"`
- `/Users/greyaltaer/code/projects/SignalframeUX/hooks/use-scroll-restoration.ts` — confirmed `import { usePathname } from "next/navigation"`
- `/Users/greyaltaer/code/projects/SignalframeUX/app/globals.css` — confirmed 1,813-line file with `@import "tailwindcss"` mixed with token definitions

### Secondary (MEDIUM confidence)
- [dorshinar.me/posts/treeshaking-with-tsup](https://dorshinar.me/posts/treeshaking-with-tsup) — tsup config, sideEffects, ESM-only vs ESM+CJS for tree-shaking
- [dev.to/tigawanna — building-and-publishing-npm-packages...](https://dev.to/tigawanna/building-and-publishing-npm-packages-with-typescript-multiple-entry-points-tailwind-tsup-and-npm-9e7) — multiple entry points, Tailwind CSS in libraries
- [medium/@asafshakarzy — react library workspace](https://medium.com/@asafshakarzy/setting-up-a-minimal-react-library-workspace-with-typescript-tsup-biome-and-storybook-e689f4703e26) — complete tsup.config.ts with React external and dual format
- [dev.to/receter — subpath exports](https://dev.to/receter/organize-your-library-with-subpath-exports-4jb9) — package.json exports field structure
- [tsup GitHub discussion #621](https://github.com/egoist/tsup/discussions/621) — CSS entry point limitations confirmed
- [skovy.dev — tsup and Tailwind](https://www.skovy.dev/blog/build-component-libraries-with-tsup-tailwind) — CSS handling via PostCSS import in entrypoint

### Tertiary (LOW confidence)
- WebSearch findings on tree-shaking verification approach — general pattern, not tsup-specific docs

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — tsup 8.5.1 version verified via npm registry; already used globally on this machine
- Architecture: HIGH for patterns 1-4 (multiple independent verified sources); MEDIUM for CSS handling (experimental tsup feature, manual copy preferred)
- Critical Issue (signalframe-provider GSAP): HIGH — verified via direct file read; resolution strategy is ASSUMED
- Pitfalls: MEDIUM — derived from cross-referencing documentation and codebase analysis

**Research date:** 2026-04-10
**Valid until:** 2026-07-10 (tsup API is stable; package.json exports field is a Node.js standard)
