# Pitfalls Research

**Domain:** Adding remaining SF components, interactive component detail views, token finalization — SignalframeUX v1.4
**Researched:** 2026-04-06
**Confidence:** HIGH (tech debt items, bundle, barrel boundary — verified directly in codebase) / HIGH (interactive doc patterns — verified against component architecture) / MEDIUM (token finalization edge cases — based on Tailwind v4 behavior)

---

## Critical Pitfalls

### Pitfall 1: Module-Level MutationObserver Never Disconnects — Memory and Double-Registration Risk

**What goes wrong:**
`signal-mesh.tsx` and `glsl-hero.tsx` both create a module-level `_signalObserver` via `ensureSignalObserver()`. This observer is initialized once and never disconnected. In development (HMR), modules re-execute on hot reload, creating a new MutationObserver instance while the old one may still be running. In production, if SignalMesh is conditionally rendered and re-mounted (e.g., navigating away and back to a page that contains it), `ensureSignalObserver()` guards against double-registration with `if (_signalObserver) return` — but only if the module is not re-evaluated. In Next.js App Router, page transitions that unmount and remount the component tree can trigger effects re-running against a stale module state.

The practical v1.4 risk: if interactive component detail views embed live component previews (including any animated SF component that triggers GSAP effects), every preview mount/unmount cycle can accumulate stale observers. The total effect is subtle jank as the observer fires more than once per CSS variable change.

**Why it happens:**
Module-level singletons are a reasonable optimization (avoid re-observing on re-render), but they require explicit lifecycle management. The v1.2 implementation notes this as "non-blocking" debt, but v1.4's interactive detail views increase the mount/unmount frequency significantly.

**How to avoid:**
Close the tech debt before building interactive detail views. Add `disconnect()` in the cleanup phase of the component that owns the WebGL context. Pattern:

```typescript
// In signal-mesh.tsx useGSAP cleanup:
return () => {
  gsap.ticker.remove(tickerFn);
  if (_signalObserver) {
    _signalObserver.disconnect();
    _signalObserver = null; // allow re-init on next mount
  }
};
```

Same fix applies to `glsl-hero.tsx`. Do this in the tech debt phase before adding interactive detail views.

**Warning signs:**
- HMR in dev shows console warnings about duplicate observers or double-firing effects
- CSS variable slider in SignalOverlay causes two renders per change instead of one (observable via React DevTools Profiler)
- Interactive detail views with animated component previews cause increasing animation jank over time

**Phase to address:** Tech debt closure phase (first phase). Must close before interactive detail views introduce high mount/unmount frequency.

---

### Pitfall 2: `readSignalVars` NaN Propagation Into WebGL Uniforms

**What goes wrong:**
`readSignalVars()` does `parseFloat(style.getPropertyValue("--signal-intensity") || "0.5")`. The fallback `"0.5"` guards against empty string. But `getPropertyValue` can return a string with leading/trailing whitespace (e.g., `" 0.5"` — a common CSS variable serialization behavior). `parseFloat(" 0.5")` returns `0.5` correctly, so whitespace is handled.

However: if any component sets `--signal-intensity` to a non-numeric value (even temporarily during a CSS transition or GSAP tween to a color value), `parseFloat` returns `NaN`. The OR fallback does not trigger because `parseFloat("invalid")` returns `NaN`, not an empty string, and `NaN || "0.5"` correctly falls back — but only because `NaN` is falsy. This means the guard works for full garbage values but fails for partial cases where `parseFloat` returns something non-NaN but wrong (e.g., `parseFloat("0.5px")` returns `0.5`, which is correct; `parseFloat("0.5em")` returns `0.5`, which may not be intended).

The actual failure mode: if a new SF component or token finalization work accidentally writes a string value to `--signal-intensity` or `--signal-speed` that begins with a number but has a unit suffix, the WebGL uniform gets a plausible-but-wrong value. The animation does not break obviously — it just behaves unexpectedly. Debugging is non-trivial because the WebGL output provides no error.

**Why it happens:**
CSS custom property values are untyped strings. Any code can write any value. The guard was not written with unit-suffix edge cases in mind.

**How to avoid:**
Replace the current guard with an explicit NaN guard:

```typescript
function safeParseSignalFloat(raw: string, fallback: number): number {
  const n = parseFloat(raw);
  return isNaN(n) ? fallback : n;
}

function readSignalVars(): void {
  const style = getComputedStyle(document.documentElement);
  _signalIntensity = safeParseSignalFloat(style.getPropertyValue("--signal-intensity"), 0.5);
  _signalSpeed     = safeParseSignalFloat(style.getPropertyValue("--signal-speed"), 1.0);
  _signalAccent    = safeParseSignalFloat(style.getPropertyValue("--signal-accent"), 0.0);
}
```

Apply the same fix to `glsl-hero.tsx` which duplicates this pattern.

**Warning signs:**
- SignalMesh or GLSL hero behaves differently on pages that also run CSS animations that touch custom properties
- GSAP tweens on new animated components produce unexpected WebGL behavior
- Token finalization work that adds unit-bearing values to the `:root` block

**Phase to address:** Tech debt closure phase. Fix before token finalization work modifies globals.css.

---

### Pitfall 3: Interactive Detail Views Breaking ComponentsExplorer's Server Component Rendering Path

**What goes wrong:**
`ComponentsExplorer` is a Client Component (`'use client'` — it uses `useState` for filter and focus). The v1.4 goal is to make each component card clickable to reveal props, variants, and implementation details. The natural implementation reaches for a `Dialog` or `Sheet` modal pattern with `selectedComponent` state.

The pitfall: if detail view content (props table, code snippets, variant previews) is imported at the top of `components-explorer.tsx`, it brings all imported component previews into the same client bundle. With 49+ components in the registry, each needing a live preview in the detail view, this can multiply the client JS for the page significantly. The current ComponentsExplorer already renders 31 static preview elements — adding live interactive detail previews for all 49 entries will balloon the component if handled naively.

Second failure vector: if the detail view content is a separate Server Component (ideal for static prop tables and code blocks), it cannot be composed directly inside a Client Component's JSX without going through the `children` prop boundary. Authors unfamiliar with the hole-in-the-donut pattern will put a `fetch`-based or static Server Component inside a Client Component and get the wrong behavior silently in dev (works due to React's automatic Client boundary promotion) but may cause issues in production with certain cache behaviors.

**Why it happens:**
Modal/drawer patterns are client-side by nature (state: open/closed). Developers default to putting all content inside the same client file for simplicity. At 49 components with live previews, "simplicity" becomes a performance problem.

**How to avoid:**
- Detail view content must be lazy-loaded: use `next/dynamic` for the detail panel component, with `loading` state showing a skeleton.
- Props tables and code examples are static — consider generating them from the registry JSON at build time (`generateStaticParams` pattern for `/components/[slug]` routes) rather than rendering them in a modal. This keeps interactive explorer fast and gives each component a dedicated URL for deep-linking.
- If modal approach is used, load detail content only when the card is clicked — not on page load. The data-source for props/variants should be the registry JSON (already exists), not component imports.
- Keep the detail view component in a separate file with its own `'use client'` boundary. Do not co-locate with ComponentsExplorer.

**Warning signs:**
- `ANALYZE=true pnpm build` shows ComponentsExplorer's client chunk growing by more than 20KB after adding detail views
- Detail view file imported at the top level of `components-explorer.tsx` (not lazily)
- Live component previews for 49 components all instantiated in the DOM on page load

**Phase to address:** Interactive detail views phase. Establish the lazy-load + data-from-registry pattern before building any detail view content.

---

### Pitfall 4: Lenis Scroll Race on Pages With Scroll-Linked Detail Panel Animations

**What goes wrong:**
The known v1.2/v1.3 debt: `useScrollRestoration` uses an `rAF` to give Lenis time to initialize before calling `window.scrollTo`. This is a timing workaround, not a structural fix. The documented risk: "if Lenis overrides the position, use `lenis.scrollTo(y, { immediate: true })` instead."

In v1.4, interactive detail views may introduce new scroll behavior: opening a detail panel might scroll the user to a specific section, or a detail panel opening might trigger GSAP ScrollTrigger recalculation. Lenis intercepts `window.scrollTo` calls. If the detail panel's open animation and Lenis's scroll normalization fire in the same frame, the page scroll position snaps back to the top (Lenis wins the race).

This is not a new bug — it is a latent race that becomes more likely as v1.4 introduces more programmatic scroll interactions on the same pages where Lenis is active.

**Why it happens:**
Lenis wraps native scroll and processes position changes in its own rAF loop. `window.scrollTo` called outside Lenis's tick gets overridden. The rAF workaround delays by one frame, which is usually sufficient — but "usually" is not "always" on slow devices or when multiple scroll-affecting effects fire simultaneously.

**How to avoid:**
Close the tech debt structurally: expose the Lenis instance via the existing `useSignalframe()` hook or a dedicated `useLenis()` hook. Any code needing programmatic scroll must call `lenis.scrollTo(y, { immediate: true })` instead of `window.scrollTo`. This eliminates the race entirely.

```typescript
// In the provider, expose the lenis instance:
const lenis = useLenisRef(); // or however it's stored
// On scroll restoration:
lenis?.scrollTo(savedY, { immediate: true });
// On detail panel open/close that needs scroll adjustment:
lenis?.scrollTo(targetY, { duration: 0.4, easing: ... });
```

Do NOT add more rAF delays as a band-aid for new race conditions.

**Warning signs:**
- Page scrolls to position 0 after opening a detail panel on mobile
- Scroll restoration works on desktop but fails intermittently on devices where the `rAF` delay is insufficient (throttled CPU)
- Adding a new `window.scrollTo` call anywhere in the codebase (grep check: any new `window.scrollTo` is an automatic red flag)

**Phase to address:** Tech debt closure phase. Fix before interactive detail views add new programmatic scroll interactions.

---

### Pitfall 5: Token Finalization Introducing Dark Mode OKLCH Values That Break the WebGL Color Bridge

**What goes wrong:**
The WebGL color bridge (`color-resolve.ts`) reads OKLCH values from CSS custom properties via `getComputedStyle`, parses them, and converts to `THREE.Color` RGB values for shader uniforms. It has a TTL cache. If token finalization work changes the numeric OKLCH values of any color tokens (e.g., adjusting `--color-primary` chroma or lightness for WCAG contrast), the cached WebGL colors become stale until the TTL expires.

More critically: if token finalization adds new dark-mode overrides that use OKLCH values with `oklch(L C H / A)` alpha syntax, the existing parser may not handle the alpha channel, silently producing an incorrect color.

The second vector: if token finalization introduces CSS `color-mix()` expressions as token values (a pattern growing in Tailwind v4 work), `getComputedStyle` returns the computed (resolved) value, which should be fine — but only if the CSS is evaluated. During SSR, `getComputedStyle` does not exist, and the WebGL color bridge has an SSR guard. If a new token is added that the SSR guard does not cover, the server render may throw.

**Why it happens:**
Token finalization happens in `globals.css` — a file that is modified frequently. The WebGL color bridge is a separate system that depends on those values without any type-checked contract between them. Changes to token values do not trigger any warning in the bridge.

**How to avoid:**
- Before finalizing tokens, document every token consumed by the WebGL color bridge in `SCAFFOLDING.md`. These are the tokens that cannot be changed without testing the WebGL output.
- After any OKLCH value change, clear the TTL cache and verify WebGL scenes visually (SignalMesh, GLSL hero) in both light and dark mode.
- Extend the color parser to handle `oklch(L C H / A)` if alpha syntax is used anywhere in the token system.
- Never use `color-mix()` as a token value if that token feeds the WebGL bridge.

**Warning signs:**
- GLSL hero shows wrong accent color after a globals.css change
- SignalMesh mesh color does not shift when theme is toggled (cache stale)
- Console error during SSR on a page that renders a WebGL-dependent component

**Phase to address:** Token finalization phase. Audit WebGL bridge dependencies before modifying any OKLCH value.

---

### Pitfall 6: Interactive Detail Views Creating Z-Index Conflicts With Fixed-Position System Chrome

**What goes wrong:**
The fixed-position element inventory (from globals.css):
- `--z-nav`: 9999 (nav bar, top)
- `--z-vhs`: 99999 (VHS overlay, full-screen)
- `--z-cursor`: 500 (canvas cursor)
- `--z-scroll-top`: 200 (SignalOverlay button, bottom-right)
- `--z-skip`: 900 (skip-to-content link)
- `--z-progress`: 300 (progress bar)

A detail panel (Dialog or Sheet) rendered by shadcn Radix defaults to `z-index: 50` in the shadcn stylesheet. This is below the canvas cursor (500) and SignalOverlay (200). The practical result: the detail panel opens and the canvas cursor appears on top of the panel content, and the SignalOverlay button appears to float over the modal backdrop.

Additionally, if the detail view uses `SFSheet` (the right-side drawer pattern used for NavigationMenu mobile), the Radix Sheet portal mounts at the document body — which is correct — but the z-index of 50 means the custom canvas cursor (z-500) continues to track on top of the sheet content. This is visually broken: the custom cursor bleeds over the modal.

**Why it happens:**
Modal z-index is set by Radix/shadcn at values from their default scale (z-50). The SignalframeUX z-index scale uses entirely different numeric values from the Tailwind default. The mismatch is not obvious until the panel opens next to other fixed-position elements.

**How to avoid:**
- Any detail view implementation (Dialog, Sheet, or custom panel) must use `--z-overlay` token (100) as a minimum, and the backdrop must use `--z-overlay - 1` (99).
- The canvas cursor must be suspended when a modal is open. Add a `data-modal-open` attribute to `<body>` when any detail panel opens, and use a CSS rule to reduce cursor z-index below the modal: `[data-modal-open] .sf-cursor { z-index: 99; }`.
- When using `SFDialog` or `SFSheet` for detail views, override the Radix portal z-index via the `className` prop to use `--z-overlay`.
- Suppress the SignalOverlay panel (collapse it) when a detail view opens, or ensure its z-index is below the modal backdrop.

**Warning signs:**
- Canvas cursor visible on top of an open detail panel
- SignalOverlay button floating above the modal backdrop
- Backdrop click-through to underlying page elements

**Phase to address:** Interactive detail views phase. Define the z-index contract for detail panels before building the first panel implementation.

---

### Pitfall 7: Duplicate TOAST Entry in ComponentsExplorer Breaking Filter Logic

**What goes wrong:**
Known v1.3 tech debt: `components-explorer.tsx` has two entries with `name: "TOAST"` — index `"010"` (FEEDBACK/FRAME, v2.0.0) and index `"022"` (FEEDBACK/SIGNAL, v1.3.0). Currently cosmetic because each has a unique `index` key. However:

1. If any filter logic is added that groups by `name` (plausible for the detail view feature — "show all variants of TOAST"), both entries will conflate.
2. If the detail view uses `name` as a URL slug (e.g., `/components/toast`), both entries resolve to the same slug, creating ambiguous routing.
3. Adding search that highlights by component name will highlight both entries — which is confusing when they have different subcategories (FRAME vs. SIGNAL) and versions.

v1.4's interactive detail views make this cosmetic problem structural.

**Why it happens:**
The two TOAST entries represent the same component with different SIGNAL/FRAME subcategories. The registry models them as separate items. The naming convention (`name` = component name, not `name` = unique display name) creates the collision.

**How to avoid:**
Before building detail views, resolve the naming:
- Option A: Rename index `"010"` to `"TOAST/FRAME"` and `"022"` to `"TOAST/SIGNAL"` (disambiguates display and URL).
- Option B: Merge into a single entry with both FRAME and SIGNAL subcategory indicators shown in the grid cell.
- Option C: Use `index` (not `name`) as the URL slug for detail views — `"010"` and `"022"` are already unique.

Recommended: Option C for URL slug (zero changes to existing data), rename display labels to `TOAST (FRAME)` and `TOAST (SIGNAL)` for grid display.

**Warning signs:**
- Any new code that groups or routes by `name` field
- Search highlighting lighting up two different cells for "TOAST"
- A `/components/toast` route that matches two entries

**Phase to address:** Tech debt closure phase. Fix naming before building detail view routing.

---

### Pitfall 8: Remaining SF Component Wrappers Introducing Arbitrary Spacing Values

**What goes wrong:**
The blessed spacing stops are: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px. This was enforced during v1.3 for the components built in that milestone. For remaining components (anything not yet SF-wrapped), the pressure to match a specific Figma/design spec for a given component can result in a developer using `p-[18px]`, `gap-[10px]`, or `m-[6px]` — values not in the blessed set.

The compound problem: once one component uses `p-[18px]`, the next developer sees it in the codebase and treats it as a precedent. The spacing system degrades by addition, not deletion.

**Why it happens:**
Spacing intent ("this needs a little more than 16px but less than 24px") is a natural design reflex. Without a linting rule enforcing the blessed set, arbitrary values are a zero-friction addition.

**How to avoid:**
- The 9-point SF wrapper checklist already includes spacing verification. Enforce it.
- Add a verification step to every PR for new SF wrappers: `grep -rn "\[.*px\]\|\[.*rem\]" components/sf/` must return zero new matches.
- When a design requires a spacing value outside the blessed set, the answer is: round to the nearest blessed stop, or escalate the request as a token addition (which requires architectural review, per globals.css comment on line 22).

**Warning signs:**
- `grep -rn "\[.*px\]" components/sf/` returns new lines after each component addition
- A component that visually "looks right" but uses `p-[18px]` instead of `p-4` or `p-5`

**Phase to address:** All component phases. Same-commit audit per component.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Keeping MutationObserver without disconnect | No code change needed | Double-firing in dev HMR; accumulating observers in detail view mount/unmount cycles | Never — close before v1.4 detail views |
| Keeping `readSignalVars` without NaN guard | No code change needed | Silent wrong WebGL uniforms when CSS variables carry unit suffixes from new tokens | Never — close before token finalization |
| Using `window.scrollTo` in new detail view code instead of `lenis.scrollTo` | Simpler API | Scroll races with Lenis on scroll restoration and programmatic navigation | Never |
| Putting all 49 component detail previews in ComponentsExplorer client bundle | Simpler import | Client bundle 3-5x larger; page load degraded; Lighthouse score drops | Never |
| Using `name` field as detail view URL slug without resolving the duplicate TOAST | Faster routing setup | Ambiguous routes, broken deep-links for TOAST component | Never |
| Hardcoding z-index values in detail view instead of using `--z-overlay` token | Faster implementation | Conflicts with cursor, SignalOverlay, or nav at specific z-values | Never |
| Adding token values without checking WebGL bridge dependency | Faster token work | Stale cached colors, wrong WebGL output, silent visual regression | Never |

---

## Integration Gotchas

Common mistakes when connecting new features to existing system infrastructure.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Detail view modal + canvas cursor | Cursor z-500 bleeds over modal | Add `[data-modal-open]` CSS rule dropping cursor z-index below modal when panel is open |
| Detail view modal + SignalOverlay | Overlay button floats above backdrop | Collapse SignalOverlay when modal is open, or assign modal backdrop z to be above `--z-scroll-top` (200) |
| ComponentsExplorer + lazy detail content | Import detail component at top of file | Use `next/dynamic` with `ssr: false` for the detail panel; load only on card click |
| Registry JSON + detail view props | Fetch registry JSON client-side on each click | Import registry JSON at build time (it's static) — `import registryData from '@/registry.json'` |
| New SF wrappers + barrel export | Create wrapper but forget barrel update | Add to `sf/index.ts` in the same commit as the wrapper file |
| Lenis + programmatic scroll from detail view | `window.scrollTo(0, 0)` to reset after panel close | `lenis.scrollTo(0, { immediate: true })` via the hook — never call window.scrollTo directly |
| Token finalization + WebGL bridge | Update `--color-primary` OKLCH values without testing WebGL | After any color token change: toggle theme, verify SignalMesh and GLSL hero colors update correctly |
| Remaining SF wrappers + Radix rounded classes | New component adds `rounded-*` classes from base UI | Explicit `rounded-none` on every element inheriting from the Radix base — no exceptions |

---

## Performance Traps

Patterns that work at small scale but fail as detail views are added.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Instantiating all 49 component previews in detail view on page load | Slow initial paint, large JS chunk for ComponentsExplorer page | Render detail view content only when panel opens (lazy); use registry JSON for static data | First page load after detail views are added |
| Multiple GSAP ScrollTrigger instances from detail panel animations | Page scroll jank when detail panels animate open/close | Use CSS transitions for panel open/close; reserve GSAP for content within panels | 3+ concurrent ScrollTrigger instances |
| Stale MutationObserver accumulation in animated previews | WebGL animation speed doubles or triples over repeated panel open/close | Fix disconnect tech debt before building previews | After 3+ mount/unmount cycles of a WebGL-containing detail view |
| `@next/bundle-analyzer` not run after adding detail view component | Bundle budget breached silently | Run `ANALYZE=true pnpm build` after each phase that adds new imports | At milestone end, when rollback is costly |
| detail view generating all variant previews as rendered React trees | React reconciliation cost on every filter interaction | Render live previews only for the open panel; use static screenshots or CSS for thumbnails | With 49+ entries, all variants rendered |

---

## UX Pitfalls

Common experience mistakes specific to interactive component documentation.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Detail view with no keyboard shortcut to close | Keyboard users trapped in modal, rely on Tab to reach close button | Escape key always closes; also add `data-dialog-close` on panel backdrop click |
| Code snippets in detail view without copy button | High friction for the primary use case (copying implementation code) | Every code block in detail view must have a copy-to-clipboard button using the Clipboard API |
| Detail view showing only props without usage example | User understands props but not how to compose them | Each detail view must include at minimum: prop table, one live preview, one code snippet |
| Component detail URL that cannot be deep-linked | User cannot share a specific component's documentation | Use URL-based routing (`/reference/[component-slug]`) not purely modal state for detail views |
| Opening detail view scrolling the main page underneath | Scroll bleed through modal on mobile touch | Lock body scroll when detail panel is open (`overflow: hidden` on `<body>` or Lenis stop); restore on close |
| Animated detail panel open conflicting with page scroll | Panel appears to fight Lenis during open animation | Use `lenis.stop()` at panel open start, `lenis.start()` at panel open complete |
| Filter reset not closing open detail panel | User applies filter, old detail view stays open showing wrong context | Filter change should close any open detail panel before applying the new filter |

---

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Tech debt — MutationObserver:** `signal-mesh.tsx` and `glsl-hero.tsx` both disconnect and null `_signalObserver` in the GSAP context cleanup return — verify no observer leak after component unmount
- [ ] **Tech debt — NaN guard:** `readSignalVars` in both `signal-mesh.tsx` and `glsl-hero.tsx` uses `isNaN()` guard, not relying on `NaN || fallback` behavior
- [ ] **Tech debt — Lenis race:** No `window.scrollTo` calls remain in codebase — all programmatic scroll goes through `lenis.scrollTo` — verify with `grep -rn "window.scrollTo"`
- [ ] **Tech debt — Duplicate TOAST:** `components-explorer.tsx` has unique display names for both TOAST entries; routing logic uses `index` field not `name` field
- [ ] **Interactive detail views — z-index:** Detail panel uses `--z-overlay` token; canvas cursor suppressed when panel open; SignalOverlay does not float over backdrop
- [ ] **Interactive detail views — bundle:** `ANALYZE=true pnpm build` shows ComponentsExplorer page chunk did NOT grow by more than 30KB after adding detail view feature
- [ ] **Interactive detail views — deep link:** Each component has a URL (`/reference/[slug]`) that can be navigated to directly without opening ComponentsExplorer first
- [ ] **Interactive detail views — scroll lock:** Body scroll locked on panel open, restored on close; Lenis stopped and restarted correctly
- [ ] **Interactive detail views — keyboard:** Escape closes panel; Tab trap within open panel; focus returns to trigger card on close
- [ ] **Token finalization — WebGL bridge:** After any OKLCH value change in globals.css, SignalMesh and GLSL hero colors verified in both light and dark mode
- [ ] **Token finalization — dark mode:** All new tokens have dark-mode overrides in the `.dark` block (not just the light-mode `:root` block)
- [ ] **Remaining SF wrappers:** `rounded-none` on all elements from Radix base — verified with DevTools computed styles
- [ ] **Remaining SF wrappers:** `intent` as primary CVA variant prop — no `variant`, `type`, or `color` prop names for visual variants
- [ ] **Remaining SF wrappers:** Added to `sf/index.ts` barrel AND registry in same commit
- [ ] **Registry:** `pnpm registry:build` clean after each new component; no schema errors

---

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| MutationObserver leak discovered after detail views shipped | MEDIUM | Add disconnect to GSAP context cleanup in signal-mesh and glsl-hero. Verify with DevTools Memory tab: mount/unmount component 5x, confirm no accumulation. |
| NaN in WebGL uniforms causing wrong animation | LOW | Add `safeParseSignalFloat` guard to readSignalVars. Immediate fix, no API changes. |
| Lenis race causing scroll-snap-to-top in detail views | MEDIUM | Replace all `window.scrollTo` calls with `lenis.scrollTo`. Requires exposing lenis instance via hook if not already available. |
| Detail view bundle bloat discovered at milestone end | HIGH | Convert detail panel to lazy dynamic import. May require restructuring data source from component imports to registry JSON. Expensive to retrofit. |
| Z-index conflict with cursor and detail panel | LOW | Add `[data-modal-open]` CSS rule, set `data-modal-open` attribute on open. Two-line fix. |
| Token OKLCH change breaks WebGL color bridge | LOW | Clear TTL cache (or reduce TTL to 0 for debugging), verify color resolve output in console, restore correct OKLCH values. |
| Duplicate TOAST routing conflict after detail views launch | MEDIUM | Rename display labels, switch routing key to `index` field. Requires updating any generated URLs. |

---

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| MutationObserver no disconnect | Tech debt closure phase (Phase 1) | GSAP context cleanup returns include `_signalObserver.disconnect()` and null reset |
| NaN guard in readSignalVars | Tech debt closure phase (Phase 1) | `isNaN()` check present in both signal-mesh.tsx and glsl-hero.tsx |
| Lenis scroll race | Tech debt closure phase (Phase 1) | `grep -rn "window.scrollTo"` returns zero matches after fix |
| Duplicate TOAST naming | Tech debt closure phase (Phase 1) | ComponentsExplorer entries have unique display names; routing uses `index` not `name` |
| Detail view bundle bloat | Interactive detail views phase (lazy architecture required) | `ANALYZE=true pnpm build` — ComponentsExplorer chunk under 150KB gate after feature |
| Detail view z-index conflicts | Interactive detail views phase (pre-implementation design) | Visual test: open detail panel with cursor active, SignalOverlay visible — no overlap |
| Detail view scroll lock | Interactive detail views phase | Mobile touch test: scroll does not bleed through open panel; Lenis stops/starts cleanly |
| Token finalization WebGL bridge breakage | Token finalization phase (audit WebGL deps first) | After each globals.css OKLCH change: visual verify WebGL scenes in light + dark |
| Token dark mode gaps | Token finalization phase | All new tokens appear in `.dark` block — `grep -n "\.dark"` in globals.css covers them |
| Remaining wrapper rounded-none regressions | Each remaining component phase | DevTools computed styles: `border-radius: 0px` on every sub-element |
| Arbitrary spacing in remaining wrappers | Each remaining component phase | `grep -rn "\[.*px\]" components/sf/` returns zero new matches per phase |
| Registry drift | Each remaining component phase | `pnpm registry:build` clean after each addition |

---

## Sources

- Existing codebase — `components/animation/signal-mesh.tsx` lines 51–67: module-level MutationObserver with no disconnect in cleanup
- Existing codebase — `components/animation/glsl-hero.tsx` lines 49–66: same pattern duplicated
- Existing codebase — `components/animation/token-viz.tsx` lines 229–230: local MutationObserver with correct `return () => observer.disconnect()` at line 208 (this one IS cleaned up — the pattern exists, just not applied to the module-level observers)
- Existing codebase — `hooks/use-scroll-restoration.ts` lines 20–22: Lenis race acknowledged in code comment
- Existing codebase — `components/blocks/components-explorer.tsx` lines 379, 395: duplicate TOAST entries at indices 010 and 022
- Existing codebase — `app/globals.css` lines 179–188: z-index scale — canvas cursor at 500 is above any standard modal (z-50)
- PROJECT.md minor tech debt section (v1.2 and v1.3 non-blocking items)
- Next.js App Router — lazy imports: https://nextjs.org/docs/app/guides/lazy-loading
- Radix UI Dialog — portal z-index: https://www.radix-ui.com/primitives/docs/components/dialog
- WAI-ARIA modal dialog keyboard pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

---

*Pitfalls research for: SignalframeUX v1.4 — interactive detail views, remaining components, token finalization, tech debt closure*
*Researched: 2026-04-06*
