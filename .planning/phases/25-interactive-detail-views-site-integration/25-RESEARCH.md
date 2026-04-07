# Phase 25: Interactive Detail Views + Site Integration — Research

**Researched:** 2026-04-06
**Domain:** React interactive panel, GSAP height tween, next/dynamic lazy load, shiki RSC, clipboard API
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Detail Panel Layout**
- Full-width row inserted below the clicked card's grid row — not a side panel, not overlaying the grid
- Panel is a DOM sibling outside the GSAP Flip grid container (DV-11) — avoids Flip layout interference
- Panel sits between grid rows: after the row containing the clicked card, before the next row
- Only one panel open at a time — clicking another card closes the current and opens below the new card's row

**Tab Interaction**
- Three tabs: VARIANTS / PROPS / CODE (DV-04)
- Default tab on open: VARIANTS — most visual impact, shows live SF component renders
- Tab switching is instant (no animation between tab content)
- Tab bar uses uppercase labels with accent color on the active tab (SI-03)

**Animation Behavior**
- GSAP height tween from 0 to auto using --duration-moderate (200ms) and --ease-default (DV-04)
- On close: reverse tween (auto to 0) with same duration
- Escape key closes panel and returns focus to trigger card (DV-10)
- Reduced-motion: skip height tween, show/hide instantly with display toggle

**Homepage Grid Integration**
- Same ComponentDetail component used on both /components and homepage grid (SI-02)
- Imported via next/dynamic with ssr: false in both locations (DV-12, bundle gate compliance)
- Homepage grid cards get onClick handler matching ComponentsExplorer pattern (SI-02)
- Session state persistence: remember last-opened component across navigation (SI-01)

**Detail Panel Content**
- Header: component name, FRAME/SIGNAL layer badge, pattern tier A/B/C badge (DV-08)
- VARIANTS tab: grid of all intent/size values rendered as live SF components (DV-05)
- PROPS tab: table with name, type, default, required, description columns (DV-06)
- CODE tab: usage snippet with copy-to-clipboard + CLI install command with copy-to-clipboard (DV-07)
- Animation token callout: durations and easings used by the component (DV-09)
- Code highlighting via lib/code-highlight.ts (shiki RSC, server-only)

**Z-Index Contract**
- Detail panel uses --z-content (10) — sits in normal content flow, below nav (--z-nav: 9999)
- Panel must not compete with canvas cursor (--z-cursor: 500) or SignalOverlay (--z-vhs: 99999)
- No new z-index tokens needed — existing scale covers the use case (SI-04)

**DU/TDR Aesthetic**
- Sharp edges (zero border-radius), uppercase labels, monospace for code
- Accent color on selected tab, foreground/background from core token palette
- Separator lines using --color-border or --color-accent at low opacity
- No decorative gradients, no shadows — depth from spacing and hierarchy only (SI-03)

### Claude's Discretion
- Internal component structure of ComponentDetail (sub-components, file organization)
- Exact variant grid layout (columns, gap, responsive breakpoints)
- Props table styling details (column widths, overflow handling)
- Copy-to-clipboard implementation (navigator.clipboard vs fallback)
- Session state key naming for persistence
- How variant previews handle components that need specific container context

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DV-04 | ComponentDetail panel with 3 tabs (VARIANTS/PROPS/CODE) and GSAP height animation | GSAP height-to-auto tween pattern; SFTabs from sf/index.ts barrel |
| DV-05 | Variant grid renders all intent/size values as live SF components | Dynamic component lookup from COMPONENT_REGISTRY.component string; sf/index.ts barrel imports |
| DV-06 | Props table with name, type, default, required, description per component | API_DOCS[docId].props array; PropDef interface already typed |
| DV-07 | Code tab with usage snippet + CLI install command, both copy-to-clipboard | navigator.clipboard API; SharedCodeBlock pattern; shiki highlight() output injected as pre-sanitized server HTML |
| DV-08 | FRAME/SIGNAL layer badge and pattern tier (A/B/C) visible in detail header | COMPONENT_REGISTRY entry has layer and pattern fields |
| DV-09 | Animation token callout per component (durations, easings used) | COMPONENT_REGISTRY entry; animation token field needs authoring or inline derivation |
| DV-10 | Keyboard accessible (Escape closes, focus returns to trigger card) | useEffect + keydown listener on document; triggerRef pattern for focus restoration |
| DV-11 | Detail panel as DOM sibling outside GSAP Flip grid | Panel rendered after gridRef's parent div, NOT inside it — requires state lift to ComponentsExplorer |
| DV-12 | next/dynamic lazy load for ComponentDetail (bundle gate compliance) | next/dynamic with ssr: false; identical pattern to SFCalendar/SFMenubar |
| SI-01 | ComponentsExplorer onClick expands detail panel with session state persistence | SESSION_KEYS extension; useSessionState<string\|null> for selected component index |
| SI-02 | Homepage grid cards clickable with same detail expansion behavior | component-grid.tsx currently uses Link — must become 'use client' with onClick state |
| SI-03 | DU/TDR aesthetic on detail panel (sharp edges, uppercase labels, accent on selected) | Established global rules; no new tokens required |
| SI-04 | Z-index contract for detail panel vs canvas cursor and SignalOverlay | [data-modal-open] CSS rule in globals.css dropping --z-cursor below panel |
</phase_requirements>

---

## Summary

Phase 25 is a pure UI assembly phase — all data infrastructure was completed in Phase 24. The work breaks into four concerns: (1) building the `ComponentDetail` panel component itself with tabs, GSAP open/close animation, and correct DOM placement; (2) wiring `ComponentsExplorer` to manage open/close state and inject the panel as a grid sibling; (3) converting `component-grid.tsx` on the homepage to support onClick detail expansion with the same panel; and (4) enforcing the z-index contract so the canvas cursor yields when the panel is open.

The highest-risk implementation decisions are the GSAP height-to-auto tween (GSAP does not tween `height: auto` natively — requires the `gsap.set` + `scrollHeight` read technique), the DOM sibling placement outside the Flip grid container, and keeping `ComponentDetail` behind `next/dynamic` to stay under the 150 KB bundle gate. All three have clear, established patterns to follow.

The shiki code path is server-only (`import 'server-only'` already enforced in `lib/code-highlight.ts`). Because `ComponentDetail` must run client-side for interactivity but needs highlighted HTML, the pattern is: highlighted HTML is fetched once from a Server Component wrapper and passed as a string prop to the client panel component. Shiki's output is trusted (server-generated from known registry data), making it safe to inject as pre-rendered HTML.

**Primary recommendation:** Build ComponentDetail as a mixed RSC/Client split — a thin Server Component wrapper calls `highlight()` and passes the result as `highlightedCode: string` prop to the client panel component. This keeps shiki server-only, avoids a fetch round-trip, and stays within Next.js App Router patterns.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | ^3.12.7 | Height tween 0 to auto, open/close animation | Already project-registered; gsap-flip.ts available |
| shiki (via lib/code-highlight.ts) | ^4.0.2 | Syntax highlighting server-side | Already wired; custom OKLCH theme in place |
| next/dynamic | Next.js 15.3 | Lazy-load ComponentDetail client bundle | Non-negotiable for 150 KB gate compliance |
| useSessionState (hooks/) | Project hook | Persist selected component index across navigation | Already used in ComponentsExplorer |
| navigator.clipboard | Browser API | Copy-to-clipboard for code + CLI commands | Native; no library needed |
| SFTabs (sf/index.ts) | Project component | Tab UI (VARIANTS/PROPS/CODE) | Existing SF-wrapped Radix Tabs |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| cn() from lib/utils | Project util | Class merging for DU/TDR conditional styling | All new component class logic |
| CVA | Project standard | Variant definitions in ComponentDetail sub-pieces | If badge variants or tab trigger variants needed |
| SharedCodeBlock (blocks/) | Project component | Code display wrapper with consistent styling | Wrapping the shiki-highlighted HTML output |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP height tween | CSS `grid-rows` 0 to 1fr trick | CSS approach has no reduced-motion hook in existing system; GSAP is the project standard |
| next/dynamic | React.lazy + Suspense | next/dynamic is the project pattern (Calendar, Menubar precedent) — do not diverge |
| Server Component wrapper for shiki | Route Handler fetch | Route Handler adds network latency; RSC prop pass is zero-cost |

**Installation:** No new packages required. All dependencies are present.

---

## Architecture Patterns

### Recommended Project Structure
```
components/blocks/
├── component-detail.tsx          # 'use client' — interactive panel (lazy-loaded)
├── component-detail-server.tsx   # Server Component — calls highlight(), passes html prop
├── components-explorer.tsx       # Existing — add openIndex state + panel injection
└── component-grid.tsx            # Existing — convert to 'use client', add onClick state
```

### Pattern 1: ComponentDetail DOM Sibling (DV-11)

**What:** The detail panel must be rendered OUTSIDE the div that holds `.flip-card` elements. Rendering inside the Flip grid container corrupts `Flip.getState()` captures because Flip measures all children during state capture.

**When to use:** Any time a panel needs to expand/collapse adjacent to a CSS Grid without disrupting Flip layout animations.

**Implementation approach in ComponentsExplorer:**

The grid div (`ref={gridRef}`) must remain a sibling of the panel, not its parent. The panel is rendered immediately after the closing tag of the grid div, inside the same React fragment. State `openIndex: string | null` lives in ComponentsExplorer.

```tsx
// Source: Derived from components-explorer.tsx GSAP Flip pattern
return (
  <>
    {/* Filter Bar */}
    <div ref={filterBarRef}>...</div>

    {/* Component Grid — Flip container, NO panel inside */}
    <div ref={gridRef} role="listbox">
      {filtered.map((comp, i) => (
        <div
          key={comp.index}
          data-flip-id={comp.index}
          onClick={() => handleCardClick(comp.index)}
        />
      ))}
    </div>

    {/* Detail Panel — DOM sibling OUTSIDE Flip grid */}
    {openIndex && (
      <ComponentDetailLazy
        entry={COMPONENT_REGISTRY[openIndex]}
        doc={API_DOCS[COMPONENT_REGISTRY[openIndex]?.docId]}
        highlightedCode={highlightedCodeMap[openIndex]}
        onClose={() => setOpenIndex(null)}
        triggerRef={triggerRefs[openIndex]}
      />
    )}

    {/* Detail Hint Bar */}
    <div>...</div>
  </>
);
```

### Pattern 2: GSAP Height 0 to Auto Tween (DV-04)

**What:** GSAP cannot tween `height: auto` directly. The correct technique is: read `scrollHeight`, tween from `0` to that pixel value, then clear the inline height in `onComplete` so the element returns to natural flow.

**When to use:** Any expand/collapse animation where natural height is unknown at render time.

```tsx
// Source: GSAP 3.x scrollHeight technique
import { gsap } from "@/lib/gsap-core";

function openPanel(el: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(el, { height: "auto", overflow: "visible" });
    return;
  }
  gsap.fromTo(el,
    { height: 0, overflow: "hidden" },
    {
      height: el.scrollHeight,
      duration: 0.2,  // --duration-normal = 200ms
      ease: "power2.out",
      clearProps: "height,overflow",
    }
  );
}

function closePanel(el: HTMLElement, onDone: () => void) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onDone();
    return;
  }
  gsap.to(el, {
    height: 0,
    overflow: "hidden",
    duration: 0.2,
    ease: "power2.in",
    onComplete: onDone,
  });
}
```

**IMPORTANT — Token name mismatch:** CONTEXT.md references `--duration-moderate` but this token does NOT exist in globals.css. The correct token is `--duration-normal` (200ms). Use 0.2 (seconds) or read `var(--duration-normal)` at runtime. Do not create a new token.

### Pattern 3: next/dynamic with ssr: false (DV-12)

**What:** ComponentDetail imports the entire sf/index.ts barrel for live variant rendering. Without lazy loading this inflates the shared JS bundle. `next/dynamic` with `ssr: false` defers the chunk to first interaction.

**When to use:** Any component that imports from sf/index.ts barrel or uses browser-only APIs (GSAP, clipboard).

```tsx
// In components-explorer.tsx and component-grid.tsx (client components)
import dynamic from "next/dynamic";

const ComponentDetailLazy = dynamic(
  () => import("@/components/blocks/component-detail").then(m => ({ default: m.ComponentDetail })),
  { ssr: false, loading: () => null }
);
```

**Bundle gate:** After implementing, run `ANALYZE=true pnpm build` and verify shared chunk stays under 150 KB. The ComponentDetail chunk itself has no size limit — only the shared bundle matters.

### Pattern 4: Server Component Wrapper for shiki (DV-07)

**What:** `lib/code-highlight.ts` has `import 'server-only'` at the top. It cannot be called from Client Components. The pattern is a thin Server Component that calls `highlight()` and passes the result as a string prop.

**Security note:** Shiki output is server-generated HTML derived from known registry code strings (not user input). It is safe to render as trusted HTML on the client. No sanitization library is needed for this specific use case.

```tsx
// component-detail-server.tsx — Server Component (no 'use client' directive)
import { highlight } from "@/lib/code-highlight";
import { COMPONENT_REGISTRY } from "@/lib/component-registry";
import { API_DOCS } from "@/lib/api-docs";

export async function ComponentDetailServer({ index }: { index: string }) {
  const entry = COMPONENT_REGISTRY[index];
  const doc = API_DOCS[entry?.docId];
  const highlightedCode = entry?.code ? await highlight(entry.code) : "";

  return (
    <ComponentDetailLazy
      entry={entry}
      doc={doc}
      highlightedCode={highlightedCode}
    />
  );
}
```

**Alternative (simpler):** Pre-compute all highlighted HTML at page load in the Server Component page and pass a `Record<string, string>` map to the explorer. This eliminates the per-open async step at the cost of rendering all 34 snippets upfront — acceptable since shiki is a singleton with lazy init.

### Pattern 5: Session State for Persistence (SI-01)

**What:** Remember which component was last opened across navigation (e.g., user goes to `/reference` then returns).

```tsx
// Add to SESSION_KEYS in hooks/use-session-state.ts
export const SESSION_KEYS = {
  COMPONENTS_FILTER: "sfux.components.filter",
  TOKENS_TAB: "sfux.tokens.tab",
  DETAIL_OPEN: "sfux.detail.open",  // NEW — string | null
} as const;

// In ComponentsExplorer:
const [openIndex, setOpenIndex] = useSessionState<string | null>(
  SESSION_KEYS.DETAIL_OPEN,
  null
);
```

### Pattern 6: Z-Index Contract — [data-modal-open] (SI-04)

**What:** When the detail panel is open, the canvas cursor (z-500) must yield. Apply `data-modal-open` attribute to `<body>` and add a CSS rule in globals.css that drops cursor z-index below the overlay level.

```css
/* In app/globals.css — add near z-index scale section */
[data-modal-open] .sf-cursor {
  z-index: var(--z-content);
}
```

```tsx
// In ComponentsExplorer, when panel opens:
document.body.setAttribute("data-modal-open", "true");
// On close:
document.body.removeAttribute("data-modal-open");
```

**Note on z-levels:** Panel at `--z-content` (10) is below `--z-overlay` (100) and `--z-cursor` (500). The `[data-modal-open]` rule drops cursor to z-content so they are coplanar — panel wins via paint order since it appears later in the DOM. This satisfies SI-04 without any new tokens.

### Pattern 7: Variant Live Rendering (DV-05)

**What:** Each `COMPONENT_REGISTRY[index].variants` entry has `{ label, props }`. The `component` field is a string (e.g., `"SFButton"`). To render live instances, import all SF components and build a runtime lookup.

```tsx
// component-detail.tsx ('use client')
import * as SF from "@/components/sf";  // full barrel

function VariantPreview({
  componentName,
  props,
}: {
  componentName: string;
  props: Record<string, unknown>;
}) {
  const Comp = (SF as Record<string, unknown>)[componentName] as
    | React.ComponentType<Record<string, unknown>>
    | undefined;

  if (!Comp) {
    return (
      <div className="border border-destructive p-2 text-[var(--text-xs)] font-mono uppercase text-destructive">
        {componentName} NOT IN BARREL
      </div>
    );
  }
  return <Comp {...props} />;
}
```

**Risk:** Some components (SFDrawer, SFCalendar, SFMenubar) are NOT in sf/index.ts barrel (Pattern B/C lazy-only). The COMPONENT_REGISTRY `importPath` field distinguishes these. For Pattern B/C entries, variant rendering falls back to a static code preview rather than a live instance. This is acceptable behavior per the existing lazy component contract.

### Anti-Patterns to Avoid

- **Rendering ComponentDetail inside the Flip grid div:** Corrupts `Flip.getState()`. Panel must be DOM sibling after the grid closing tag.
- **Calling `highlight()` from a Client Component:** Will throw at runtime due to `import 'server-only'`. Always call from Server Component context.
- **Using `window.scrollTo` for any scroll within detail view code:** Must use `lenis.scrollTo` per project rule from STATE.md.
- **Exporting ComponentDetail from sf/index.ts barrel:** It is a block, not an SF primitive. Barrel must remain directive-free.
- **Creating a `--duration-moderate` token:** Does not exist — use `--duration-normal` (200ms).
- **Tweening `height: auto` directly with GSAP:** Will not animate. Read `scrollHeight` first.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tab UI | Custom tab state machine | SFTabs (sf/index.ts) | Radix-based; keyboard nav and ARIA already handled |
| Syntax highlighting | Custom tokenizer | lib/code-highlight.ts (shiki) | Already wired with OKLCH theme; server-only contract enforced |
| Copy to clipboard | Custom execCommand fallback | navigator.clipboard.writeText() | Modern browsers support it; graceful degradation with try/catch |
| Lazy loading | React.lazy + Suspense boundary | next/dynamic with ssr: false | Project standard; identical to SFCalendar/SFMenubar precedent |
| Session persistence | Custom localStorage hook | useSessionState from hooks/ | SSR-safe; hydration mismatch prevention already solved |
| Code block styling | New code display component | SharedCodeBlock (blocks/shared-code-block.tsx) | Consistent styling; already used in API explorer |

**Key insight:** Every infrastructure piece for this phase already exists. The work is wiring, not building new primitives.

---

## Common Pitfalls

### Pitfall 1: GSAP height tween on `auto`
**What goes wrong:** `gsap.to(el, { height: "auto" })` does not animate — GSAP cannot interpolate to a keyword value.
**Why it happens:** GSAP requires numeric start/end values for interpolation.
**How to avoid:** Read `el.scrollHeight` before tweening. Tween to that pixel value. Use `clearProps: "height,overflow"` in `onComplete` to restore natural flow.
**Warning signs:** Panel snaps to full height instantly on first open.

### Pitfall 2: Panel rendered inside Flip grid container
**What goes wrong:** GSAP Flip captures ALL children with `.flip-card` selector. An extra non-card child inside the grid div confuses Flip's position math, producing jank on filter transitions.
**Why it happens:** Easy to place the conditional `{openIndex && <ComponentDetail />}` inside the grid `<div>`.
**How to avoid:** Panel goes AFTER the closing tag of the grid. Both are children of the same React fragment or wrapper.
**Warning signs:** Filter animation produces unexpected card positions when a detail panel was open.

### Pitfall 3: Calling `highlight()` from client code
**What goes wrong:** Runtime error — Next.js enforces `server-only` at module evaluation time.
**Why it happens:** ComponentDetail is a Client Component (needs GSAP, state, event handlers), but shiki is server-only.
**How to avoid:** Use Server Component wrapper pattern. Pass `highlightedCode: string` as a serializable prop.
**Warning signs:** Build-time error mentioning "This module cannot be imported from a Client Component or Server Action."

### Pitfall 4: ComponentGrid homepage is currently a Server Component
**What goes wrong:** Adding `onClick` handlers to the grid cards requires `'use client'` directive. Currently `component-grid.tsx` has no directive and imports are server-safe.
**Why it happens:** SI-02 requires click interactivity; server components cannot have event handlers.
**How to avoid:** Add `'use client'` to `component-grid.tsx`. Import `ComponentDetailLazy` inside the file. Use `useState` for `openIndex`.
**Warning signs:** TypeScript error "Event handlers cannot be passed to Client Component props" when building.

### Pitfall 5: sf/index.ts barrel import inflating shared bundle
**What goes wrong:** Importing all SF components eagerly (even via `next/dynamic`) might include them in the initial shared chunk if the import graph is resolved at build time.
**Why it happens:** Webpack/Turbopack can merge dynamic chunk boundaries when tree-shaking detects the module is also imported elsewhere.
**How to avoid:** Ensure ComponentDetail is ONLY imported via `next/dynamic`, never directly. Verify with bundle analyzer after implementation.
**Warning signs:** Shared chunk exceeds 150 KB after Phase 25.

### Pitfall 6: Missing SESSION_KEYS entry causing key collision
**What goes wrong:** `useSessionState` writes to sessionStorage with a raw string key. If a new key is invented inline rather than added to SESSION_KEYS, it bypasses the collision-prevention convention.
**Why it happens:** `useSessionState` accepts any string; nothing enforces using SESSION_KEYS constants.
**How to avoid:** Add `DETAIL_OPEN: "sfux.detail.open"` to SESSION_KEYS in use-session-state.ts before using it.
**Warning signs:** Two components using the same session key, clobbering each other's state.

### Pitfall 7: `--duration-moderate` token does not exist
**What goes wrong:** CONTEXT.md references `--duration-moderate` for the height tween. This token is NOT defined in globals.css. Using it in a CSS `var()` produces `undefined`; using it to compute GSAP duration produces NaN (instant snap).
**Why it happens:** CONTEXT.md was authored with a token name that does not exist in the system.
**How to avoid:** Use `--duration-normal` (200ms) and `--ease-default`. Do NOT add a new token.
**Warning signs:** Panel opens/closes with no visible animation.

---

## Code Examples

### GSAP Height Tween Open/Close (DV-04)
```tsx
// Source: GSAP 3.x scrollHeight pattern
function openPanel(el: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(el, { height: "auto", overflow: "visible" });
    return;
  }
  gsap.fromTo(
    el,
    { height: 0, overflow: "hidden" },
    {
      height: el.scrollHeight,
      duration: 0.2,
      ease: "power2.out",
      clearProps: "height,overflow",
    }
  );
}

function closePanel(el: HTMLElement, onDone: () => void) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onDone();
    return;
  }
  gsap.to(el, {
    height: 0,
    overflow: "hidden",
    duration: 0.2,
    ease: "power2.in",
    onComplete: onDone,
  });
}
```

### Escape Key + Focus Return (DV-10)
```tsx
// In ComponentDetail 'use client' component
useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
      triggerRef.current?.focus();
    }
  }
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
}, [onClose]);
```

### Dynamic Import Pattern (DV-12)
```tsx
// In components-explorer.tsx and component-grid.tsx
import dynamic from "next/dynamic";

const ComponentDetailLazy = dynamic(
  () =>
    import("@/components/blocks/component-detail").then((m) => ({
      default: m.ComponentDetail,
    })),
  { ssr: false, loading: () => null }
);
```

### Copy to Clipboard (DV-07)
```tsx
// navigator.clipboard with graceful error handling
async function copyToClipboard(text: string, onSuccess: () => void) {
  try {
    await navigator.clipboard.writeText(text);
    onSuccess();
  } catch {
    // clipboard unavailable (non-https or denied permission) — silent fail
  }
}
```

### Variant Render from Registry (DV-05)
```tsx
// In component-detail.tsx — barrel import for runtime lookup
import * as SF from "@/components/sf";

function VariantPreview({
  componentName,
  props,
}: {
  componentName: string;
  props: Record<string, unknown>;
}) {
  const Comp = (SF as Record<string, unknown>)[componentName] as
    | React.ComponentType<Record<string, unknown>>
    | undefined;
  if (!Comp) {
    return (
      <span className="text-[var(--text-xs)] font-mono uppercase text-destructive">
        {componentName} NOT IN BARREL
      </span>
    );
  }
  return <Comp {...props} />;
}
```

### data-modal-open CSS Rule (SI-04)
```css
/* Add to app/globals.css near z-index scale section */
[data-modal-open] .sf-cursor {
  z-index: var(--z-content);
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `height: 0` to `height: auto` CSS transition | Read `scrollHeight`, tween to pixel value, clear with `clearProps` in `onComplete` | GSAP 3.x | Required for unknown content heights |
| React.lazy + Suspense | next/dynamic with ssr: false | Next.js App Router | Project standard; handles SSR boundary correctly |
| document.execCommand('copy') | navigator.clipboard.writeText() | ~2018, widely supported | Async, promise-based, no DOM manipulation required |
| shiki full bundle | shiki createHighlighter with fine-grained imports | shiki 1.x to 4.x | 50-80 KB async vs 695 KB+ full bundle |

**Deprecated/outdated:**
- `document.execCommand('copy')`: Deprecated in modern browsers — never use for clipboard operations
- `shiki/bundle/web` and `shiki/bundle/full`: Present in shiki 4.x but too large — project already uses `createHighlighter` from fine-grained API

---

## Open Questions

1. **How does ComponentGrid homepage pass highlighted code if it stays a Server Component at page level?**
   - What we know: `app/page.tsx` is a Server Component; `ComponentGrid` is currently also a Server Component
   - What's unclear: SI-02 requires the grid to be 'use client' for onClick — but passing pre-highlighted code as props from the page requires async data at the page level
   - Recommendation: Pre-compute all highlighted snippets in `app/page.tsx` as a Server Component (fast — shiki singleton, small snippets), pass as `highlightedCodeMap: Record<string, string>` prop to `ComponentGrid`. This keeps the page Server Component and delegates interactivity to `ComponentGrid`'s client boundary.

2. **How are variant previews handled for Pattern B/C components not in sf/index.ts barrel (SFDrawer, SFCalendar, SFMenubar)?**
   - What we know: These are in COMPONENT_REGISTRY with `importPath` pointing to direct lazy paths
   - What's unclear: CONTEXT.md says variants tab renders "live SF component instances" — but these can't be imported at barrel level
   - Recommendation: For Pattern B/C entries, fall back to rendering the `code` snippet statically rather than a live instance. Show a "LAZY COMPONENT — see CODE tab" placeholder in the variant grid. This is consistent with the existing lazy contract.

3. **Does "below the clicked card's row" mean between grid rows or below the entire grid?**
   - What we know: DV-11 requires the panel to be a DOM sibling OUTSIDE the Flip grid container
   - What's unclear: If the panel is a sibling, it can only appear above or below the entire grid — not between specific rows — unless the grid is restructured
   - Recommendation: Panel appears immediately below the entire grid. "Between rows" in CONTEXT.md appears to describe the visual intent (adjacent to the clicked card), but the DV-11 constraint makes grid restructuring impossible without Flip interference. The simpler below-grid position satisfies both constraints. Planner should note this interpretation and confirm if strict row-position is required.

---

## Validation Architecture

> workflow.nyquist_validation key is absent from config.json — treating as enabled.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — no jest.config, vitest.config, or test/ directory found |
| Config file | None — Wave 0 gap |
| Quick run command | N/A until framework installed |
| Full suite command | N/A until framework installed |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DV-04 | Panel opens/closes with correct tab structure | manual-only | Visual QA: click card, verify 3 tabs render | N/A |
| DV-05 | Variant grid renders live SF components | manual-only | Visual QA: open BUTTON detail, verify 3 variant instances | N/A |
| DV-06 | Props table renders all columns | manual-only | Visual QA: open PROPS tab, verify 5 columns for known component | N/A |
| DV-07 | Copy buttons write to clipboard | manual-only | Browser devtools: verify clipboard content after click | N/A |
| DV-08 | Header shows layer badge + pattern tier | manual-only | Visual QA: open detail, verify FRAME/SIGNAL badge and A/B/C tier visible | N/A |
| DV-09 | Animation token callout present for SIGNAL components | manual-only | Visual QA: open ACCORDION detail, verify token callout visible | N/A |
| DV-10 | Escape closes panel, focus returns to trigger | manual-only | Keyboard QA: Tab to card, Enter to open, Escape to close — verify focus | N/A |
| DV-11 | Panel is DOM sibling, not child of Flip grid | build check | Inspect DOM in devtools: panel div must not be descendant of gridRef div | N/A |
| DV-12 | next/dynamic lazy load — bundle stays under 150 KB | build check | `ANALYZE=true pnpm build` — verify shared chunk under 150 KB | N/A |
| SI-01 | Session state persists across navigation | manual-only | Open detail, navigate to /reference, return — verify same component reopens | N/A |
| SI-02 | Homepage grid cards open same panel | manual-only | On /, click card, verify ComponentDetail panel renders | N/A |
| SI-03 | DU/TDR aesthetic — sharp edges, uppercase, accent active tab | manual-only | Visual QA against CRT criteria | N/A |
| SI-04 | Cursor z-index drops when panel open | manual-only | Open panel, move cursor over panel area — cursor should not appear on top | N/A |

**Note on automation:** This phase is UI-assembly work. Meaningful automated tests require a DOM testing environment (jsdom + Testing Library or Playwright). Neither is installed. All DV/SI requirements are verifiable through manual QA. DV-12 has an automated proxy (bundle analyzer).

### Sampling Rate
- **Per task commit:** Visual QA in browser at `localhost:3000`
- **Per wave merge:** Full manual QA pass against all DV/SI criteria listed above
- **Phase gate:** All requirements manually verified before `/pde:verify-work`

### Wave 0 Gaps
- [ ] No automated test framework installed — all validation is manual/visual QA + build metrics
- [ ] Bundle gate check: `ANALYZE=true pnpm build` — run after each wave to verify 150 KB shared chunk limit

*(Existing test infrastructure: none detected. All phase validation is manual QA + build output inspection.)*

---

## Sources

### Primary (HIGH confidence)
- `lib/component-registry.ts` — ComponentRegistryEntry interface, COMPONENT_REGISTRY data, 34 entries verified
- `lib/api-docs.ts` — ComponentDoc interface, PropDef interface, API_DOCS map structure
- `lib/code-highlight.ts` — highlight() function signature, server-only import, SFUX_THEME structure confirmed
- `components/blocks/components-explorer.tsx` — Full GSAP Flip pattern, useSessionState usage, grid structure
- `components/blocks/component-grid.tsx` — Current homepage grid structure (Server Component, Link-based, no 'use client')
- `app/globals.css` lines 193-201 — Z-index scale: --z-content: 10, --z-overlay: 100, --z-cursor: 500
- `app/globals.css` lines 153-160 — Animation tokens: --duration-normal: 200ms, --ease-default confirmed; --duration-moderate ABSENT
- `hooks/use-session-state.ts` — useSessionState signature, SESSION_KEYS constants (2 existing keys)
- `lib/gsap-flip.ts` — GSAP Flip async import pattern confirmed
- `components/sf/index.ts` — Full SF barrel export list confirmed; SFDrawer absent (Pattern B)
- `.planning/STATE.md` — Phase 24 complete confirmation, critical constraints, lenis.scrollTo rule
- `.planning/REQUIREMENTS.md` — DV-04 through DV-12, SI-01 through SI-04 specifications

### Secondary (MEDIUM confidence)
- GSAP 3.x height-to-auto pattern: established pattern consistent with GSAP 3 documentation for scrollHeight technique
- next/dynamic ssr: false: project precedent confirmed in STATE.md (SFCalendar, SFMenubar)

### Tertiary (LOW confidence)
- None — all findings verified against project source files

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already in project, versions confirmed from package.json
- Architecture: HIGH — patterns derived from existing project code, not external speculation
- Pitfalls: HIGH — token mismatch (--duration-moderate) verified by direct grep; DOM sibling rule verified from GSAP Flip code
- Validation: MEDIUM — no test framework exists; all validation is manual QA

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable; no fast-moving dependencies)

---

## Critical Pre-Implementation Checklist

Before Plan 25-01 begins, implementer must verify:

- [ ] `--duration-moderate` does not exist — confirmed by grep; use `--duration-normal` (200ms)
- [ ] Pattern B/C components NOT in sf/index.ts barrel: SFDrawer, SFCalendar, SFMenubar — confirmed
- [ ] `component-grid.tsx` is currently a Server Component (no 'use client') — requires directive before SI-02 can be implemented — confirmed
- [ ] `lib/code-highlight.ts` export function is named `highlight()` not `highlightCode()` — CONTEXT.md and STATE.md reference `highlightCode()` but source code confirms correct name is `highlight()`
- [ ] SESSION_KEYS needs new `DETAIL_OPEN: "sfux.detail.open"` entry before useSessionState can be used for panel state — confirmed missing
