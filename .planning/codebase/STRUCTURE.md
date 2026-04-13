# Codebase Structure

**Analysis Date:** 2026-04-12

## Directory Layout

```text
SignalframeUX/
├── app/                 # Next.js App Router routes, layout, metadata, error boundaries
├── components/
│   ├── ui/              # Base shadcn/Radix-derived primitives
│   ├── sf/              # SF wrappers and design-system-facing component API
│   ├── blocks/          # Page sections and composite feature blocks
│   ├── layout/          # Nav, footer, providers, global UI shells
│   └── animation/       # GSAP/Three-driven visual components and lazy wrappers
├── lib/                 # Shared runtime logic, registries, GSAP/WebGL utilities, entry exports
├── hooks/               # Reusable React hooks (session, nav reveal, scene lifecycle)
├── tests/               # Playwright route and regression tests
├── stories/             # Storybook stories for component surfaces
├── scripts/             # Build/doc verification scripts
├── dist/                # Built package artifacts (esm/cjs/dts)
├── public/              # Static assets and registry JSON payloads
└── .planning/           # Project workflow artifacts and generated codebase maps
```

## Directory Purposes

**`app/`:**
- Purpose: Route entry points and global document shell.
- Contains: `layout.tsx`, route pages, metadata assets (`sitemap.ts`, `icon.tsx`, `opengraph-image.tsx`), and error/loading boundaries.
- Key files: `app/layout.tsx`, `app/page.tsx`, `app/inventory/page.tsx`, `app/system/page.tsx`, `app/reference/page.tsx`, `app/init/page.tsx`.

**`components/ui/`:**
- Purpose: Primitive base components that SF wrappers compose.
- Contains: low-level UI controls and Radix integrations.
- Key files: `components/ui/button.tsx`, `components/ui/dialog.tsx`, `components/ui/tabs.tsx`.

**`components/sf/`:**
- Purpose: Public-facing design system layer.
- Contains: SF-prefixed wrappers and layout primitives.
- Key files: `components/sf/index.ts`, `components/sf/sf-section.tsx`, `components/sf/sf-button.tsx`, `components/sf/sf-grid.tsx`.

**`components/blocks/`:**
- Purpose: High-level, page-specific feature sections.
- Contains: explorer blocks, hero/manifesto/content bands, token and API surfaces.
- Key files: `components/blocks/components-explorer.tsx`, `components/blocks/token-tabs.tsx`, `components/blocks/api-explorer.tsx`.

**`components/layout/`:**
- Purpose: App chrome and persistent global islands.
- Contains: navigation, footer, providers, dynamic global effects mounts.
- Key files: `components/layout/nav.tsx`, `components/layout/lenis-provider.tsx`, `components/layout/page-animations.tsx`, `components/layout/signal-canvas-lazy.tsx`.

**`components/animation/`:**
- Purpose: SIGNAL visual modules and lazy wrappers.
- Contains: GSAP-heavy UI effects and Three scene components.
- Key files: `components/animation/signal-mesh.tsx`, `components/animation/signal-mesh-lazy.tsx`, `components/animation/signal-overlay-lazy.tsx`.

**`lib/`:**
- Purpose: Shared logic and package API entry surfaces.
- Contains: utilities, registries, provider factory, GSAP/WebGL internals, generated docs data.
- Key files: `lib/signalframe-provider.tsx`, `lib/signal-canvas.tsx`, `lib/component-registry.ts`, `lib/api-docs.ts`, `lib/entry-core.ts`, `lib/entry-animation.ts`, `lib/entry-webgl.ts`.

**`hooks/`:**
- Purpose: Cross-component behavior hooks.
- Contains: session persistence, nav reveal, scene lifecycle, scroll restoration.
- Key files: `hooks/use-session-state.ts`, `hooks/use-nav-reveal.ts`, `hooks/use-signal-scene.ts`.

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: root document shell and global providers.
- `app/page.tsx`: homepage section orchestration.
- `proxy.ts`: CSP middleware/proxy policy.
- `lib/entry-core.ts`: FRAME package entry.
- `lib/entry-animation.ts`: SIGNAL animation package entry.
- `lib/entry-webgl.ts`: SIGNAL WebGL package entry.

**Configuration:**
- `package.json`: scripts and dependency contract.
- `next.config.ts`: redirects and build/runtime flags.
- `tsconfig.json`: path aliases and strict TS behavior.
- `eslint.config.js`: lint policy and ignore boundaries.
- `playwright.config.ts`: E2E runner config.
- `vitest.config.ts`: unit test runner config for `lib/**`.

**Core Logic:**
- `lib/signal-canvas.tsx`: singleton render pipeline for all Three scenes.
- `components/layout/page-animations.tsx`: page-level animation orchestrator.
- `lib/component-registry.ts`: component catalog for inventory/detail explorer.
- `lib/api-docs.ts`: generated API surface data consumed by reference page.

**Testing:**
- `tests/*.spec.ts`: Playwright route/performance/a11y assertions.
- `lib/*.test.ts`: Vitest unit tests for utility modules.
- `stories/*.stories.tsx`: Storybook visual/component usage coverage.

## Naming Conventions

**Files:**
- Route files: App Router names (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`).
- SF wrappers: `sf-*.tsx` in `components/sf/`.
- Hooks: `use-*.ts` in `hooks/`.
- Lazy wrappers: `*-lazy.tsx` for `next/dynamic` client boundaries.

**Directories:**
- `components/{ui,sf,blocks,layout,animation}` separate primitive, wrapper, composition, chrome, and motion concerns.
- `lib/` holds framework-agnostic and package-surface logic; avoid placing route-specific JSX there unless it is shared runtime infrastructure.

## Where to Add New Code

**New Route Surface:**
- Primary code: `app/<route>/page.tsx` (or `app/<route>/layout.tsx` if nested shell needed).
- Shared section blocks: `components/blocks/`.
- Route nav reveal trigger: add `NavRevealMount` in the route page and target a local header marker.

**New SF Component Wrapper:**
- Implementation: `components/sf/sf-<name>.tsx`.
- Base primitive dependency: `components/ui/<name>.tsx` if needed.
- Public export: add in `components/sf/index.ts`.
- Package export (if public): add in `lib/entry-core.ts` or `lib/entry-animation.ts` based on dependency type.

**New Animation Feature:**
- Client component: `components/animation/<feature>.tsx`.
- Lazy mount wrapper: `components/animation/<feature>-lazy.tsx` if SSR-off required.
- Shared GSAP helpers: `lib/gsap-*.ts`.
- If globally mounted, compose from `components/layout/page-animations.tsx` or layout lazy mounts.

**New WebGL Scene:**
- Scene component: `components/animation/<scene>.tsx`.
- Register via `hooks/use-signal-scene.ts` and avoid standalone renderer instances.
- Mount shared canvas only once through `components/layout/signal-canvas-lazy.tsx`.

**Utilities and Shared Data:**
- Shared helpers: `lib/*.ts`.
- Data registries/constants: `lib/component-registry.ts` or adjacent `lib/*-registry.ts`.
- Generated artifacts: keep generation in `scripts/*.ts` and output in `lib/` when consumed by runtime.

**Tests:**
- Browser/route behavior: add Playwright specs to `tests/`.
- Pure logic in `lib/`: add Vitest tests beside source as `lib/*.test.ts`.

## Responsibility Map

- `app/`: routing contract and server-rendered composition.
- `components/layout/`: persistent shell and global client behavior.
- `components/blocks/`: route-level feature composition.
- `components/sf/`: stable design-system API for consumers.
- `components/ui/`: low-level primitive implementations.
- `components/animation/`: optional expressive layer components.
- `hooks/`: reusable behavioral contracts.
- `lib/`: shared logic, registries, runtime bridges, package entry points.
- `scripts/`: one-off generation/verification automation.

## Special Directories

**`dist/`:**
- Purpose: package build output.
- Generated: Yes (`pnpm build:lib`).
- Committed: Yes (present in repository state).

**`coverage/`:**
- Purpose: Vitest coverage reports.
- Generated: Yes (`pnpm test:coverage`).
- Committed: Not required for source changes (artifact directory).

**`storybook-static/`:**
- Purpose: static Storybook build output.
- Generated: Yes (`pnpm build-storybook`).
- Committed: Artifact directory, not source of truth.

**`test-results/`:**
- Purpose: Playwright run artifacts and status output.
- Generated: Yes (Playwright execution).
- Committed: Artifact directory.

**`.planning/`:**
- Purpose: roadmap, phase artifacts, and analysis docs.
- Generated: Mixed (manual + generated).
- Committed: Yes.

---

*Structure analysis: 2026-04-12*
