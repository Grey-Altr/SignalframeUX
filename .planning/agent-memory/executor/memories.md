# executor Agent Memory

> Loaded at agent spawn. Append-only. Max 50 entries.
> Oldest entries archived automatically.

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

### 2026-04-05T00:00:00Z | Phase 04 | tags: gsap-hero, animation-fast-path, data-anim-wrapper, component-count

For GSAP targeting of a component that renders a canvas (e.g. HeroMesh), wrap it in a plain div with data-anim rather than passing data-anim as a prop — canvas components use className for inline styles and the data attribute needs a clean DOM node for GSAP. Use gsap.fromTo (not gsap.to) at delay:0 for first visible motion — fromTo pins the start opacity, preventing stale reads from a prior context revert. Pre-existing TypeScript errors in this project (useRef missing argument, webkitBackdropFilter type) should be fixed when first encountered as they block build verification; both patterns have minimal fixes: useRef<T | undefined>(undefined) and (element.style as CSSStyleDeclaration & { key: string }).key.
