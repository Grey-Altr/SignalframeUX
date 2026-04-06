# executor Agent Memory

> Loaded at agent spawn. Append-only. Max 50 entries.
> Oldest entries archived automatically.

### 2026-04-05T00:02:00Z | Phase 09 | tags: signal-motion, scrub, scrolltrigger, gsap-fromto

SignalMotion is a scroll-POSITION-tied wrapper (scrub) — distinct from ScrollReveal (scroll-ENTRY one-shot). Key: use `gsap.fromTo(inner, from, { ...to, scrollTrigger: { trigger: container, scrub } })` with `scope: containerRef`. Reduced-motion guard uses `gsap.set(inner, to)` to jump to end state immediately (no ScrollTrigger created). Both `containerRef` (ScrollTrigger trigger) and `innerRef` (tweened element) are needed — two separate refs, two separate divs in the render.

### 2026-04-05T00:02:00Z | Phase 09 | tags: signal-overlay, css-custom-properties, setproperty, ssr-false, next-dynamic

SignalOverlay writes `--signal-intensity` (value/100), `--signal-speed` (value/50, 50=1x), `--signal-accent` (passthrough degrees) to `document.documentElement.style.setProperty`. These values persist on :root across navigation — a Reset button is ESSENTIAL for demo UX. SFSlider API: `value={[number]}` (array), `onValueChange={([v]) => handler(v)}` — Radix uses array for multi-thumb support. Keyboard shortcut uses `e.shiftKey && e.key === "S"` check. The `'use client'` wrapper file pattern (`signal-overlay-lazy.tsx`) is required for `next/dynamic({ ssr: false })` in Next.js 15 Server Component trees.

### 2026-04-05T00:00:00Z | Phase 08 | tags: next-dynamic, ssr-false, server-component, client-boundary

Next.js 15 rejects `ssr: false` with `next/dynamic` when used directly in Server Components — build fails with "ssr: false is not allowed with next/dynamic in Server Components". The fix is a thin `'use client'` wrapper component (e.g. `token-viz-loader.tsx`) that holds the dynamic import. The Server Component page imports the wrapper, not the dynamic import directly. This pattern applies to ALL canvas/WebGL components placed on Server Component pages — the wrapper is a one-liner component with no logic. The GlobalEffectsLazy pattern (already in the project) avoids this because it lives in `global-effects.tsx` which is already `'use client'`.

### 2026-04-05T00:00:00Z | Phase 08 | tags: canvas-2d, token-viz, type-scale, globals.css

The globals.css type scale has 10 entries (not 9): --text-2xs (9px), --text-xs (10px), --text-sm (11px), --text-base (13px), --text-md (16px), --text-lg (18px), --text-xl (24px), --text-2xl (32px), --text-3xl (48px), --text-4xl (80px). The plan spec listed 9 entries and incorrect pixel values. Always read globals.css for actual values before hardcoding type scale data. The --text-md entry at 16px is the body/content size equivalent (not --text-base at 13px as in Tailwind defaults — this project uses a compressed scale).

### 2026-04-06T05:16:00Z | Phase 05 | tags: stp-02-guard, setProperty, sf-no-transition, color-cycle

In SignalframeUX, `color-cycle-frame.tsx` calls `setProperty("--color-primary", ...)` via a wipe `onMid` callback (~150ms after trigger). The STP-02 guard is: `if (root.classList.contains("sf-no-transition")) return;` before the setProperty call. This prevents the cycling color from overwriting the theme's `--color-primary` during the ~2 rAF theme toggle window. Mount-time init setProperty is intentionally left unguarded (fires once at load, before any user toggle). GSAP itself has zero color mutations in `components/animation/` — only `setProperty` is the color mutation surface.

### 2026-04-06T05:16:00Z | Phase 05 | tags: dx-spec, deferred-items, interface-sketches, open-questions

For deferred item interface sketches in `DX-SPEC.md`, follow pitfall 4 from the research doc: shape-only TypeScript interfaces (no function bodies, no implementation detail), each section annotated with 5+ open questions rather than locked decisions. The three deferred items are DX-04 (registry.json), DX-05 (createSignalframeUX/useSignalframe), STP-01 (session state). SCAFFOLDING.md lives in `docs/` (new directory, must be created) — 7 sections, three annotated sub-patterns extracted from actual codebase source.

### 2026-04-06T02:14:00Z | Phase 01 | tags: globals.css, token-placement, tailwind-v4, spacing

In SignalframeUX, spacing and layout tokens go in `:root` (NOT `@theme`) to avoid Tailwind v4 generating unwanted utility classes from custom properties — this is critical since Tailwind v4 auto-generates utilities from `@theme` values. Only put tokens in `@theme` if you explicitly want Tailwind utility generation.

### 2026-04-06T02:14:00Z | Phase 01 | tags: globals.css, vhs-tokens, namespace, pre-existing-error

The `--vhs-crt-opacity` and `--vhs-noise-opacity` tokens only appear in `app/globals.css` (zero component references) — VHS class names like `.vhs-overlay`, `.vhs-crt`, `.vhs-noise` are safe to leave as-is when renaming custom properties. Also found a pre-existing TypeScript error in `components/animation/color-cycle-frame.tsx:79` (`useRef` missing argument) that blocks `npx next build` type check but not CSS compilation — this predates Plan 01-01.

### 2026-04-06T02:14:00Z | Phase 01 | tags: next-build, typescript, pre-existing-check

When the plan's done criteria includes `npx next build`, always verify the error is NOT pre-existing by running build against the original branch first (via `git stash`). The globals.css file is 1100+ lines; read it in 200-line chunks rather than all at once (10K token limit). The `@layer utilities` block runs from line 425 to 780, and `.sf-display` ends around line 460.

### 2026-04-05T00:00:00Z | Phase 01 | tags: spacing, grep-pattern, token-enforcement

The grep pattern `" (p|px|py|...)-(5|7|10)[^0-9]"` (with leading space) misses classes where the spacing utility appears at the start of a className string right after `"` — no leading space. Always follow up with a direct `grep -n "p-5"` search. In this project, token-tabs.tsx had 9 such instances missed by the pattern but caught by the direct search.

### 2026-04-05T00:00:00Z | Phase 01 | tags: linter, file-modification, edit-workflow

The project's formatter modifies files on save and causes "File has been modified since read" errors when edits are applied after a sequence of reads. Safe pattern: re-read the file immediately before each Edit call. The error is recoverable — re-read and re-apply the edit.

### 2026-04-05T00:00:00Z | Phase 01 | tags: gsd-tools, state-management, manual-update

The gsd-tools.cjs binary is not installed in this environment. STATE.md and ROADMAP.md must be updated manually. Key fields: Current Position Plan/Status/Last activity, Progress bar percentages, Decisions section, Session Continuity, Roadmap table status column and checkbox list.

### 2026-04-06T02:22:00Z | Phase 01 | tags: css-fallbacks, globals.css, var-consumers

In globals.css, grep for `var(--color-[^,)]*)` to find color var() calls WITHOUT fallbacks — the regex excludes the comma meaning no fallback is present. Lines in @theme declarations start with `--color-` so filter with `| grep -v "@theme"`. The commented-out sf-cursor block (lines 1240–1300) contains active-looking CSS inside `/* */` comments — verify line numbers against comment open/close markers before adding fallbacks. Custom property declarations in `:root` (e.g. `--text-heading-1-family: var(--font-display)`) are NOT consumers and do not need fallbacks.

### 2026-04-06T02:22:00Z | Phase 01 | tags: print-stylesheet, signal-layer, media-print

For @media print in this project: suppress Signal layer with `display: none !important` on .vhs-overlay, .vhs-crt, .vhs-noise, .vhs-scanlines, [data-anim], .sf-grain::after, .sf-idle-overlay, .sf-cursor, and GSAP debug markers. Do NOT use blanket `* { position: static !important }` — it breaks flex/grid layout. Instead, scope position:static to nav, .scroll-to-top, [style*="position: fixed"], [style*="position: sticky"] only.

### 2026-04-06T03:00:00Z | Phase 02 | tags: primitives, server-components, forwardRef, cva-pattern

In SignalframeUX, layout primitives (SFContainer, SFSection, SFStack) are Server Components — no 'use client' directive — and use `React.forwardRef` with a named inner function for GSAP targeting compatibility. SFSection uses plain typed props (not CVA) when there is only one variant dimension (spacing stops), keeping the API surface minimal. Data attribute boolean patterns: `data-section` is always present with no value; conditional attrs like `data-section-label` use `prop={value ?? undefined}` so React omits the attribute entirely when value is undefined.

### 2026-04-06T03:00:00Z | Phase 02 | tags: barrel-export, index.ts, layout-section-ordering

In sf/index.ts, layout primitives are inserted at line 1 under a `// Layout Primitives` comment before all Radix-based component exports — this ordering signals primacy of structural primitives over interactive components and satisfies AC-8. When inserting at the top of an existing barrel, use Edit with the first export line as the old_string anchor.

### 2026-04-06T03:06:00Z | Phase 02 | tags: polymorphic-ref, typescript, sftext, forwardref

For polymorphic components (SFText with `as` prop mapping to multiple HTML element types), TypeScript cannot resolve `React.Ref<HTMLElement>` down to the intersection `RefObject<HTMLHeadingElement> & RefObject<HTMLParagraphElement> & ...` required by JSX. The accepted pattern is `ref as React.Ref<any>` with an eslint-disable comment — this is a structural limitation of TypeScript's polymorphic element typing, not a design error.

### 2026-04-06T03:06:00Z | Phase 02 | tags: cva, sfgrid, numeric-string-keys, variant-design

SFGrid uses numeric string keys ("1", "2", "3", "4") rather than numeric literals for CVA cols variants — string keys allow multi-class values like "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" without ambiguity. CVA variants must be string keys; numeric literals would conflict. When a variant encodes responsive breakpoint logic (not a single class), CVA is the right tool — one prop abstracts multiple Tailwind classes across breakpoints.

### 2026-04-06T03:47:54Z | Phase 03 | tags: css-specificity, data-anim, hover-timing, progressive-enhancement

CSS attribute presence selector `[data-anim]` has lower specificity than attribute value selectors `[data-anim="section-reveal"]` — placing the catch-all `[data-anim] { opacity: 1 }` AFTER the specific rules is the correct CSS ordering to guarantee JS-off visibility without breaking GSAP initial states. For asymmetric hover timing, the base state governs the OUT transition and :hover overrides to the IN duration — `transition-duration` on :hover correctly overrides for the snap-in because the `transition` shorthand on the base state is already established.

### 2026-04-06T04:10:00Z | Phase 03 | tags: scrolltrigger, scrambletext, stagger-batch, setTimeout-replacement

In SignalframeUX page-animations.tsx, `start: "top bottom"` is the correct ScrollTrigger threshold for headings — it fires immediately when the trigger element's top crosses the viewport bottom, which happens on page load for any above-fold element. Using `once: true` per `ScrollTrigger.create` prevents re-fire on scroll-back; this requires individual create() calls per heading, not a batch call, since each heading needs its own independent once state. For `ScrollTrigger.batch` stagger, matching `interval` (grouping window) to `stagger` (per-item delay) at 0.04 keeps the cascade clean — the batch fires when 40ms passes without new entrants, and items animate at 40ms apart.

### 2026-04-06T03:58:00Z | Phase 03 | tags: signal-spec, mobile-matrix, deferred-effects, spec-doc

SIGNAL-SPEC.md (03-04) is a pure documentation task — created in a single task with no code changes. The spec documents effects as designed per CONTEXT.md decisions and the values from prior plan implementations. Mobile collapse behavior uses `@media (pointer: coarse)` not viewport-width; this is confirmed in globals.css at lines 1249 and 1647. When 03-03 had no commits (only STATE update), 03-04 can still proceed — the spec captures design intent regardless of implementation status.

### 2026-04-06T03:46:51Z | Phase 03 | tags: canvas-cursor, oklch-to-rgb, signal-layer, intersection-observer

Canvas 2D context does not understand oklch() CSS values — resolve --color-primary to RGB by creating a probe 1x1 canvas, setting fillStyle to the raw computed property value, drawing a pixel, and reading back with getImageData(). This is the correct approach for bridging CSS custom property color values into canvas draw calls. The zIndex style prop accepts string in JSX via `as unknown as number` cast — React's CSSProperties types number only, but CSS custom property references require string values like "var(--z-cursor, 9999)".

### 2026-04-05T00:00:00Z | Phase 04 | tags: crafted-states, frame-signal, scrambletext, reduced-motion-guard

In SignalframeUX error.tsx, ScrambleText must be gated with `window.matchMedia("(prefers-reduced-motion: reduce)").matches` BEFORE the async `import("@/lib/gsap-plugins")` — prevents the entire GSAP plugin bundle from loading on reduced-motion devices. For not-found.tsx, keeping it as a Server Component and using `data-anim="page-heading"` wires it to the existing `initPageHeadingScramble()` automatically — no new client boundary needed. ComponentsExplorer uses two state vars for search (`searchInput` = controlled input, `searchQuery` = debounced filter) — the empty state reset CTA must clear both or the filter stays active while the search box appears empty.

### 2026-04-06T07:16:00Z | Phase 06 | tags: pnpm, package-manager, npm-arborist-bug, install-pattern

SignalframeUX uses pnpm exclusively (pnpm-lock.yaml present, node_modules/.pnpm virtual store). Running `npm install` fails with `TypeError: Cannot read properties of null (reading 'matches')` from npm's arborist encountering pnpm symlinks. Always use `pnpm add <pkg>` and `pnpm add -D <pkg>` for dependency installs. Never use npm install in this project.

### 2026-04-06T07:16:00Z | Phase 06 | tags: three-js, ssr-safety, transpile-packages, turbopack

For Three.js SSR safety in Next.js 15 + Turbopack: do NOT add `transpilePackages: ['three']` — it causes known Turbopack issues (vercel/next.js#63230). `next/dynamic({ ssr: false })` is the complete and sufficient guard. Three.js can be installed as a regular dependency; the SSR boundary is enforced by the dynamic import wrapper pattern mirroring GlobalEffectsLazy.

### 2026-04-06T07:16:00Z | Phase 06 | tags: color-resolve, oklch-probe, no-cache, color-cycle-frame

`lib/color-resolve.ts` (Phase 6 onwards) must NOT implement caching because `color-cycle-frame.tsx` mutates `--color-primary` via `setProperty` at ~150ms intervals during theme transitions. Cached RGB values go stale. The 1x1 canvas probe is cheap enough to call per-frame; optimization to a cache with invalidation can be considered in Phase 8. Magenta fallback `{ r: 255, g: 0, b: 128 }` matches canvas-cursor.tsx line 34 for visual consistency.

### 2026-04-05T00:00:00Z | Phase 04 | tags: gsap-hero, animation-fast-path, data-anim-wrapper, component-count

For GSAP targeting of a component that renders a canvas (e.g. HeroMesh), wrap it in a plain div with data-anim rather than passing data-anim as a prop — canvas components use className for inline styles and the data attribute needs a clean DOM node for GSAP. Use gsap.fromTo (not gsap.to) at delay:0 for first visible motion — fromTo pins the start opacity, preventing stale reads from a prior context revert. Pre-existing TypeScript errors in this project (useRef missing argument, webkitBackdropFilter type) should be fixed when first encountered as they block build verification; both patterns have minimal fixes: useRef<T | undefined>(undefined) and (element.style as CSSStyleDeclaration & { key: string }).key.

### 2026-04-06T05:45:00Z | Phase 05 | tags: jsdoc, compound-components, documentation-sweep, sf-components

In SignalframeUX, JSDoc placement differs by pattern: Pattern A (named function export) gets JSDoc directly above the export function declaration; Pattern B/C (forwardRef const) gets JSDoc above the const declaration — TypeScript language server surfaces both correctly on hover. For compound components, the primary export gets a full block while sub-exports get one-liner `/** Sub-component of SFX — renders the [region] ... */` descriptions. The @example field should reference actual props from the component's interface — always read the component source before writing JSDoc. With 28 files, this plan splits cleanly into two tasks of 14 files each (layout primitives + A-L, then M-Z), committed per task with 491 total lines added and zero logic changes.

### 2026-04-05T00:00:00Z | Phase 04 | tags: reduced-motion, signal-spec, two-layer-architecture, visual-qa

The reduced-motion suppression in SignalframeUX uses a two-layer contract: CSS layer fires at paint time (before JS loads) via `@media (prefers-reduced-motion: reduce)` blocks resetting all `[data-anim]` to opacity:1 and suppressing .sf-cursor/.vhs-overlay/.sf-glitch; JS layer fires at runtime via `gsap.globalTimeline.timeScale(0)` and an early return from `initHeroAnimations`. The CSS global block uses `animation-duration: 0.01ms` AND `transition-duration: 0.01ms` — transitions are NOT suppressed by animation-duration alone. During Plan 04-03 audit, CSS coverage was confirmed complete with zero gaps (hero-mesh and error-code selectors already added in 04-01/04-02). When SIGNAL-SPEC.md is updated with a documentation section, read the entire file first to identify the exact insertion anchor — the Key Links table at the end of Section 6 is the correct append point for Section 7.

### 2026-04-06T07:23:00Z | Phase 06 | tags: signal-canvas, jsx-extension, lib-tsx, build-error

In SignalframeUX, files in `lib/` that contain React components with JSX syntax must use `.tsx` extension even though the convention is `lib/*.ts` for utilities. Next.js/Turbopack rejects JSX in `.ts` files with `Expected '>', got 'ref'` at build time. The `@/lib/signal-canvas` path alias resolves both `.ts` and `.tsx` so downstream imports need no changes after the rename.

### 2026-04-06T07:23:00Z | Phase 06 | tags: signal-canvas, gsap-ticker, scissor-viewport, webgl-singleton

The SignalCanvas singleton uses `gsap.ticker.add(tickerCallback)` exclusively — never `renderer.setAnimationLoop()` or raw `requestAnimationFrame`. The ticker callback checks `state.reducedMotion` and `state.scenes.size === 0` to skip rendering when unnecessary. The scissor Y-axis conversion is: `canvasY = renderer.domElement.clientHeight - rect.bottom` (Three.js is Y-up, DOM is Y-down).

### 2026-04-06T07:23:00Z | Phase 06 | tags: use-signal-scene, dispose-pattern, intersection-observer

`useSignalScene` calls both `deregisterScene(id)` AND `disposeScene(scene)` in cleanup — they are intentionally separate. `deregisterScene` removes from the singleton Map (stops rendering); `disposeScene` traverses the scene graph and frees GPU memory. Scene components MUST call both or GPU memory leaks. The `buildScene` factory runs inside `useEffect` (not at render time) to prevent Three.js object creation during SSR.

### 2026-04-06T09:15:00Z | Phase 09 | tags: glsl-hero, full-screen-quad, bayer-dither, fbm-noise, uResolution, orthographic-camera

For full-screen quad shaders in Three.js: use `OrthographicCamera(-1,1,1,-1,0,1)` + `PlaneGeometry(2,2)` to fill NDC clip space exactly. UV must be computed from `gl_FragCoord.xy / uResolution` (not from vUv attribute) because scissored viewports offset fragment coordinates — container width/height must be passed as `uResolution` uniform and kept current via `ResizeObserver`. Bayer 4x4 threshold: store as a 16-entry `float[]` array in the fragment shader indexed by `int(mod(gl_FragCoord.x, 4.0)) + int(mod(gl_FragCoord.y, 4.0)) * 4` — GLSL array literals confirmed supported in WebGL1+2, no sampler2D needed. GLSL template literals in `.tsx` files compile correctly with Turbopack (no raw-loader needed). The `"use client"` directive byte check: od -c output shows straight ASCII `"` (0x22), not curly quotes — terminal rendering can be misleading; trust byte output.

### 2026-04-06T08:37:00Z | Phase 08 | tags: signal-mesh, webgl, glsl, three-js, ssr-dynamic, client-wrapper

In SignalframeUX, `next/dynamic({ ssr: false })` is NOT allowed directly in Server Components (Next.js 15 strict enforcement). The pattern for WebGL components: create a separate `'use client'` file (e.g., `signal-mesh-lazy.tsx`) containing the `dynamic()` call; import this wrapper from the Server Component. This mirrors the existing `SignalCanvasLazy` pattern in `components/layout/signal-canvas-lazy.tsx`. Three.js ShaderMaterial uniforms must be stored in `useRef` at the component level (not inside `buildScene`) so `ScrollTrigger.create` callbacks and GSAP ticker functions can mutate them — closures inside `useGSAP` can't access `buildScene`-local variables after the factory returns.

### 2026-04-06T08:37:00Z | Phase 08 | tags: color-resolve, ttl-cache, mutation-observer, opt-in-cache

`lib/color-resolve.ts` TTL cache is opt-in: pass `{ ttl: ms }` as second argument to cache; omit for no-cache (default, Phase 6 behavior). MutationObserver initialized lazily on first cached call — zero cost if cache is never used. Observer watches `document.documentElement` with `attributeFilter: ["class", "style"]` and calls `colorCache.clear()` on any mutation. `resolveColorToken` and `resolveColorAsThreeColor` both accept the same optional second parameter.

### 2026-04-06T08:37:00Z | Phase 08 | tags: icosahedron, edges-geometry, wireframe, shader-material

For clean wireframe rendering of Three.js geometries: use `new THREE.EdgesGeometry(geo)` + `new THREE.LineSegments(edgesGeo, lineBasicMat)` added to scene separately. Do NOT use `wireframe: true` on `ShaderMaterial` — that shows triangulation diagonals (ugly). `EdgesGeometry` extracts only the hard edges of the mesh. The separate LineSegments object also allows different opacity (0.6) vs the solid fill layer (0.15 uOpacity in ShaderMaterial).

### 2026-04-06T08:01:22Z | Phase 07 | tags: audio-feedback, web-audio-api, lazy-audiocontext, gesture-gating

Web Audio API AudioContext must be created inside a gesture handler — module-level or component-mount creation starts the context in `suspended` state and `.resume()` is unreliable outside a gesture. The correct pattern is `let _ctx: AudioContext | null = null` at module scope and a `getCtx()` factory that creates on first call from inside `playTone()`, which is only ever called from pointer event handlers. Each tone creates a fresh OscillatorNode (create-and-stop) — never a persistent singleton oscillator.

### 2026-04-06T08:01:22Z | Phase 07 | tags: haptic-feedback, vibration-api, document-delegation, lastHoveredRef

The `lastHoveredRef` debounce in `InteractionFeedback` is essential: `pointerover` fires on every pixel of movement within an element, not just on entry. Without the ref tracking the last interactive element, hundreds of OscillatorNodes are created per second on any hover. The pattern: `onPointerOver` checks `target.closest(INTERACTIVE) === lastHoveredRef.current` and skips if true; `onPointerOut` resets the ref to `null` so re-entry after leaving fires again. This is placed in `global-effects.tsx` as a single document-level delegated listener — zero per-component wiring needed.

### 2026-04-05T00:00:00Z | Phase 07 | tags: gsap-ticker, oklch-pulse, idle-overlay, ticker-guard

For GSAP ticker-driven CSS custom property mutation in IdleOverlay: always remove the old ticker before registering a new one (tickerRef guard), and clear `basePrimaryRef.current` AFTER `gsap.ticker.remove()` — the removal is synchronous so the ticker won't fire again after the remove call. The `pulseFn` closure captures `baseLightness` once at registration time (outside the ticker), then only computes the sin offset per frame. The snap-back sequence is: remove ticker → restore setProperty → remove grain class → set transition:none → remove --active class → restore transition via rAF.

### 2026-04-06T09:50:00Z | Phase 09 | tags: sfsection, layout-primitives, py-0-override, tailwind-merge, stagger-placement

SFSection defaults to `spacing="16"` which applies `py-16` via `cn(py-${spacing}, className)`. For section-level wrappers that carry no own vertical padding (spacing lives inside block children), pass `className="py-0 ..."` — tailwind-merge resolves `py-16 py-0` to `py-0` correctly since className comes second in cn(). Never pass `spacing="0"` (not a valid value). The `data-bg-shift` attribute must be a spread prop on SFSection — never use the `bgShift` boolean prop (SFSection spreads ...props onto `<section>` so custom data attributes pass through correctly). For stagger placement: add `data-anim="stagger"` to wrapper elements whose DIRECT children are the items to animate — check globals.css for pre-existing initial state rules before adding a duplicate (this project already had the rule at line 1038 from Phase 3).

### 2026-04-05T00:00:00Z | Phase 07 | tags: data-cursor, canvas-cursor, markup-only, showcase-sections

`data-cursor` placement is a pure markup task — CanvasCursor already queries `[data-cursor]` via IntersectionObserver (canvas-cursor.tsx, unchanged). For the homepage, add to every `data-bg-shift` div (6 sections). For showcase pages, add to `<main id="main-content">`. Total: 10 occurrences across 5 files. Explicit placement per section (not at SFSection primitive level) preserves showcase zone intentionality and avoids over-broad cursor activation on nav/footer areas.

### 2026-04-06T10:57:00Z | Phase 10 | tags: signal-css-vars, bgshift-type, globals.css, root-not-theme

CSS custom properties intended for JS runtime `setProperty()` mutation (e.g. `--signal-intensity`, `--signal-speed`, `--signal-accent`) MUST go in `:root`, NOT in `@theme` — Tailwind v4 auto-generates utility classes from `@theme` values, which is wrong for runtime-settable vars. The SFSection `bgShift` boolean-to-string-union migration is zero-callsite (no consumer files used the `bgShift` prop; all existing usages passed `data-bg-shift` as a spread HTML attribute) — confirmed by grep before committing. The old boolean pattern wrote `data-bg-shift=""` (empty string) which silently broke GSAP `applyBgShift`'s palette key lookup.

### 2026-04-06T00:00:00Z | Phase 10 | tags: sfsection-wrap, nav-height, py-0-override, reference-page

When SFSection wraps an existing block that has its own internal padding (NEXT_CARDS cards have `py-10`), use `className="py-0"` on the SFSection — tailwind-merge resolves `py-16 py-0` to `py-0` since className comes second in `cn()`. The `--nav-height: 83px` var in globals.css is the canonical nav clearance token; reference page was the only page missing `mt-[var(--nav-height)]` on its `<main>` element (start/page.tsx pattern was the correct reference to match).

### 2026-04-06T11:20:07Z | Phase 11 | tags: shadcn-registry, registry-build, meta-fields, cva-detection

`shadcn build` (devDep `shadcn@^4.1.2`) generates `public/r/*.json` from `registry.json` correctly including `registry:style` items (sf-theme generates sf-theme.json with cssVars) — no manual file creation needed. `shadcn build` does NOT wipe files not listed in registry.json (base.json was preserved without restore). Always read component source to confirm CVA usage before listing `class-variance-authority` in registry dependencies: sf-section and sf-text do NOT import CVA despite being B-pattern layout primitives — B-pattern means no Radix base, not CVA required.
