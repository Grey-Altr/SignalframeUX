# Phase 30: Homepage Architecture + ENTRY Section - Research

**Researched:** 2026-04-07
**Domain:** Next.js App Router page restructure, GLSL shader mouse interaction, GSAP ScrollTrigger nav reveal, section landmark architecture
**Confidence:** HIGH — all findings verified directly against codebase; no external library guessing required

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Current split-panel `Hero` component replaced entirely. `GLSLHero` becomes primary ENTRY content filling 100vh with zero padding or containment.
- **D-02:** `SIGNALFRAME//UX` title rendered as HTML overlay on top of shader canvas at 120px+ (Anton font), centered. Not embedded in the shader — HTML for LCP and accessibility.
- **D-03:** Single subtitle line below the title. No paragraph, no description, no scroll indicator (EN-03).
- **D-04:** CTAs ("GET STARTED", "VIEW ON GITHUB") relocate to ACQUISITION section.
- **D-05:** Component count and version tag relocate to ACQUISITION section.
- **D-06:** Multilingual text (JFM katakana/farsi/mandarin) is deferred.
- **D-07:** Manifesto copy ("a system you can feel") absorbed into THESIS section (Phase 31).
- **D-08:** LCP safety — title must NOT use `opacity: 0` as start state. Use `opacity: 0.01` or `clip-path` reveal per STATE.md constraint.
- **D-09:** Hard cuts between all sections. No animated transitions, no decorative dividers. Zero-gap section stacking via CSS.
- **D-10:** Background color shifts via existing `data-bg-shift` pattern handle visual separation.
- **D-11:** `CircuitDivider` and `MarqueeBand` imports removed from `page.tsx`. Components remain in codebase.
- **D-12:** Nav invisible on initial viewport. Appears via GSAP ScrollTrigger at ENTRY/THESIS boundary.
- **D-13:** Hard-cut appear — no slide, no fade. `visibility: hidden; opacity: 0` → `visibility: visible; opacity: 1` at threshold. DU channel-switch aesthetic.
- **D-14:** Replace existing `sf-nav-roll-up` behavior with ScrollTrigger-based reveal. Nav remains `fixed top-0` with `z-[var(--z-nav)]`.
- **D-15:** Nav starts `visibility: hidden` not `display: none` — preserves accessibility tree for skip-nav links.
- **D-16:** THESIS through ACQUISITION rendered as real `SFSection` components with `data-section`, `data-bg-shift`, `id`, `label` attributes.
- **D-17:** Minimum stub height: `100vh`. Exception: THESIS stub at `200vh`.
- **D-18:** Stub content: single `<h2>` with section name in monospaced type (JetBrains Mono), muted color, centered. Zero placeholder prose.
- **D-19:** Stubs preserve section indicator, bg-shift system, and scroll measurement so Phase 31–33 drop in real content without touching page architecture.

### Claude's Discretion

- Plan count and plan boundaries (how to split work across plans)
- Exact ScrollTrigger config for nav reveal (start/end positions, toggleActions)
- Whether to keep `HeroMesh` or remove it — `GLSLHero` replaces its visual function
- Import cleanup strategy (remove unused block component imports vs leave for other pages)
- Test structure for the new page architecture

### Deferred Ideas (OUT OF SCOPE)

- JFM multilingual text (katakana, farsi, mandarin flourishes)
- "a system you can feel" manifesto line — goes to Phase 31 THESIS
- HeroMesh (Three.js mesh) — may be redundant, Claude's discretion on removal
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| RA-05 | Homepage `page.tsx` restructured with 6-section architecture (ENTRY → THESIS → PROOF → INVENTORY → SIGNAL → ACQUISITION) | SFSection API confirmed; `data-bg-shift` pattern confirmed; architecture in ARCHITECTURE.md |
| EN-01 | GLSL hero shader fills 100vh — not contained in a padded section, IS the viewport | GLSLHero renders `absolute inset-0 z-0`; Hero wrapper uses `mt-[var(--nav-height)]` which will be eliminated; full-viewport approach confirmed |
| EN-02 | `SIGNALFRAME//UX` rendered at 120px+ (Anton) centered on shader | HTML overlay pattern; `--font-display` token points to Anton; LCP-safe via `opacity: 0.01` start |
| EN-03 | Single subtitle line only — no paragraph, no description, no scroll indicator | Content constraint — no component/pattern research needed |
| EN-04 | No visible navigation on initial viewport — nav reveals on scroll (sticky after ENTRY) | `sf-nav-roll-up` CSS animation to be replaced by GSAP ScrollTrigger; `visibility: hidden` start state pattern confirmed |
| EN-05 | Shader parameters respond to mouse position on ENTRY section (subtle, not overwhelming) | `pointermove` event → normalized coords → uniform mutation pattern; `uMouse` uniform addition to GLSLHero fragment shader confirmed |
| VL-03 | CircuitDivider replaced or removed — section transitions use hard cuts | `CircuitDivider` import removed from `page.tsx`; component stays in codebase |
| VL-07 | MarqueeBand removed or redesigned to fit new information hierarchy | `MarqueeBand` import removed from `page.tsx`; component stays in codebase |
</phase_requirements>

---

## Summary

Phase 30 restructures `app/page.tsx` from a 7-section marketing layout into a 6-section cinematic architecture and delivers the ENTRY section as the only fully realized section. The remaining five sections (THESIS through ACQUISITION) become stub landmarks that Phase 31–33 will fill. The work touches four distinct areas: (1) complete rewrite of `page.tsx`, (2) replacement of `Hero` with a new ENTRY block wrapping `GLSLHero` in full-viewport mode, (3) addition of `uMouse` uniform to the existing GLSL shader for pointer-driven variation, and (4) replacement of the CSS `sf-nav-roll-up` animation with a GSAP ScrollTrigger visibility toggle on the nav.

All infrastructure the phase depends on is confirmed working from Phase 29: Lenis with `autoResize: false`, `PinnedSection` primitive, `fonts-ready` ScrollTrigger refresh, and `ScrollTrigger.update` wired into Lenis scroll events. The `SFSection` API, `data-bg-shift` pattern, and `SectionIndicator` require no changes — they read `data-section-label` attributes and will automatically pick up the new section names.

The single most consequential technical constraint is LCP: the `SIGNALFRAME//UX` h1 must start at `opacity: 0.01` (not `0`) or use `clip-path` reveal to remain LCP-measurable. The existing hero animation system (`data-anim='hero-title'`, `data-anim='hero-subtitle'`) in `PageAnimations` will be reused for the ENTRY overlay, avoiding a rewrite of the animation layer.

**Primary recommendation:** Write Phase 30 as two plans — Plan A handles `page.tsx` rewrite + stub sections + import cleanup, Plan B handles ENTRY block + nav reveal + mouse uniform. This boundary keeps the structural skeleton (Plan A) independently testable before the interactive ENTRY work (Plan B) layers on top.

---

## Standard Stack

No new libraries. All tools are in the existing stack. [VERIFIED: codebase audit]

### Core (confirmed in codebase)

| Tool | Version / Location | Purpose in Phase 30 |
|------|--------------------|---------------------|
| Next.js App Router | 15.3 | `app/page.tsx` Server Component rewrite |
| `SFSection` | `components/sf/sf-section.tsx` | All 6 section landmarks |
| `GLSLHero` / `GLSLHeroLazy` | `components/animation/glsl-hero.tsx` | ENTRY WebGL background — extended with `uMouse` |
| GSAP + `ScrollTrigger` | `lib/gsap-core.ts` | Nav reveal trigger; existing scroll wiring |
| `PinnedSection` | `components/animation/pinned-section.tsx` | THESIS stub at 200vh |
| `cn()` | `lib/utils.ts` | Class merging in all new components |
| Anton font | `--font-display` → `var(--font-anton)` in globals.css | 120px+ ENTRY title |

**Installation:** No new packages. Zero.

---

## Architecture Patterns

### Recommended Project Structure (new/modified files)

```
app/
└── page.tsx                         # REWRITE — 6-section shell

components/
├── blocks/
│   └── entry-section.tsx            # NEW — ENTRY block (full-viewport GLSLHero + HTML overlay)
├── animation/
│   └── glsl-hero.tsx                # MODIFY — add uMouse uniform + pointermove handler
└── layout/
    └── nav.tsx                      # MODIFY — add ScrollTrigger visibility toggle
```

### Pattern 1: Full-Viewport ENTRY Block

**What:** A Client Component that contains `GLSLHeroLazy` as the WebGL background layer plus the HTML title overlay. The containing `<div>` is `h-screen w-full relative overflow-hidden` with no top padding (no nav offset — nav is invisible at 0 scroll). The HTML overlay is `absolute inset-0 flex items-center justify-center z-[var(--z-content)]`.

**When to use:** Only in the ENTRY section. This pattern is unique to the cinematic hero — do not generalize it.

**Key constraint — EN-01:** The SFSection wrapping ENTRY must use `className="py-0"` and must NOT apply `mt-[var(--nav-height)]` (which the old `Hero` component did). The nav is invisible, so the hero fills the full 100vh from `top: 0`.

**Key constraint — D-08 / LCP:** The h1 must NOT start at `opacity: 0`. Use `opacity: 0.01` or `clip-path: inset(0 100% 0 0)` as the start state. `opacity: 0` causes the browser's LCP algorithm to defer measurement, pushing LCP past 1.0s.

```tsx
// Source: direct codebase audit — LCP constraint from STATE.md + PITFALLS.md
// components/blocks/entry-section.tsx

"use client";

import { GLSLHeroLazy } from "@/components/animation/glsl-hero-lazy";
import { cn } from "@/lib/utils";

export function EntrySection() {
  return (
    <div className="relative h-screen w-full overflow-hidden" data-entry-section>
      {/* WebGL background — absolute inset-0, z-0 (GLSLHero renders this internally) */}
      <GLSLHeroLazy />

      {/* HTML overlay — LCP target */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-[var(--z-content)]">
        <h1
          data-anim="hero-title"
          aria-label="SIGNALFRAME//UX"
          className="font-display text-center text-foreground uppercase tracking-[-0.03em]"
          style={{
            fontSize: "clamp(80px, 12vw, 180px)",
            // LCP-safe: 0.01 not 0 — browser measures LCP at values > 0
            opacity: 0.01,
          }}
        >
          SIGNALFRAME<span className="text-primary">//</span>UX
        </h1>
        <p
          data-anim="hero-subtitle"
          className="mt-4 text-muted-foreground uppercase tracking-[0.2em] font-mono text-sm"
          style={{ opacity: 0 }}
        >
          DETERMINISTIC INTERFACE. GENERATIVE EXPRESSION.
        </p>
      </div>
    </div>
  );
}
```

### Pattern 2: Nav Scroll-Triggered Reveal (D-12 through D-15)

**What:** Remove the CSS `sf-nav-roll-up` class from the nav element. Start nav at `visibility: hidden` (not `display: none` — preserves skip-nav in accessibility tree). Use GSAP ScrollTrigger inside `nav.tsx` to toggle to `visibility: visible` when ENTRY scrolls out of view.

**Key config:** `toggleActions: "play none none reverse"` with no scrub — this is an instant binary toggle, not a scrub animation. `start: "bottom top"` on the ENTRY section trigger fires exactly when ENTRY leaves the top of the viewport.

**Hard-cut aesthetic (D-13):** No duration on the visibility change. Use ScrollTrigger `onEnter` / `onLeaveBack` callbacks to directly set `visibility` and `opacity` properties — no `gsap.to()` tween. This produces the DU channel-switch snap.

```tsx
// Source: codebase audit of nav.tsx + CONTEXT.md D-12/D-13/D-15
// Inside nav.tsx useEffect (requires 'use client' — already present)

useEffect(() => {
  const entrySection = document.querySelector("[data-entry-section]");
  if (!entrySection || !navRef.current) return;

  const nav = navRef.current;

  // Start state: nav invisible but in accessibility tree
  gsap.set(nav, { visibility: "hidden", opacity: 0 });

  const trigger = ScrollTrigger.create({
    trigger: entrySection,
    start: "bottom top",  // fires when ENTRY bottom crosses viewport top
    onEnter: () => {
      gsap.set(nav, { visibility: "visible", opacity: 1 });
    },
    onLeaveBack: () => {
      gsap.set(nav, { visibility: "hidden", opacity: 0 });
    },
  });

  return () => trigger.kill();
}, []);
```

**globals.css change:** The `sf-nav-roll-up` animation class on the nav element must be REMOVED. Replace with no class (the ScrollTrigger controls all nav visibility). The `@keyframes sf-nav-roll-up` rule and its media query can stay in globals.css — they're harmless dead code until Phase 34 audit.

**Reduced-motion:** When `prefers-reduced-motion: reduce`, skip the ScrollTrigger setup and set `visibility: visible; opacity: 1` immediately. Nav should be visible from page load in reduced-motion context.

### Pattern 3: Six-Section `page.tsx` Shell (RA-05)

**What:** Server Component. Six `SFSection` landmarks inside `#bg-shift-wrapper`. EntrySection renders inside the first SFSection. Stubs for THESIS–ACQUISITION each contain a single centered `<h2>`. THESIS stub wraps in `PinnedSection scrollDistance={2}` per D-17.

**Section ordering (non-negotiable per RA-05):**

```
ENTRY → THESIS → PROOF → INVENTORY → SIGNAL → ACQUISITION
```

**bg-shift values (alternating for visual separation):**

```
ENTRY:       data-bg-shift="black"
THESIS:      data-bg-shift="white"
PROOF:       data-bg-shift="black"
INVENTORY:   data-bg-shift="white"
SIGNAL:      data-bg-shift="black"
ACQUISITION: data-bg-shift="white"
```

**SFSection API confirmed from codebase audit:**
- `label` → rendered as `data-section-label` (picked up by SectionIndicator automatically)
- `bgShift` prop → renders as `data-bg-shift` attribute
- `className="py-0"` → suppress default `py-16` spacing for full-viewport sections
- Pass `id` via `...props` spread — SFSection forwards unknown props to `<section>`

**Important:** `data-bg-shift` is set directly as an HTML attribute in the current `page.tsx` (not via the `bgShift` prop). Both work — SFSection's `bgShift` prop and the HTML attribute `data-bg-shift` produce the same attribute. Use the `bgShift` prop going forward for type safety.

### Pattern 4: GLSL Mouse Uniform (EN-05)

**What:** Add `uMouse` uniform to the GLSLHero fragment shader. Wire a `pointermove` event listener on the ENTRY container. Normalize mouse position to `[0, 1]` range. Modulate FBM offset in the shader — subtle positional nudge, not a dramatic warp.

**Shader change (minimal):** Add to uniform declarations:
```glsl
uniform vec2 uMouse;  // normalized [0,1] mouse position, default 0.5, 0.5
```

Add mouse influence to FBM call:
```glsl
// Existing: fbm(uv * 4.0 + vec2(uTime * 0.1, uTime * 0.07))
// Modified: add small mouse offset to FBM input (0.3 scale = subtle)
float n = fbm(uv * 4.0 + vec2(uTime * 0.1 + uMouse.x * 0.3, uTime * 0.07 + uMouse.y * 0.3)) * (0.5 + uIntensity * 0.5);
```

**Event listener pattern:**
```tsx
// Source: codebase pattern audit — pointermove uniform mutation
useEffect(() => {
  const container = containerRef.current;
  if (!container || !hasWebGL) return;

  const handlePointerMove = (e: PointerEvent) => {
    if (!uniformsRef.current) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height; // flip Y for GLSL convention
    uniformsRef.current.uMouse.value.set(x, y);
  };

  container.addEventListener("pointermove", handlePointerMove, { passive: true });
  return () => container.removeEventListener("pointermove", handlePointerMove);
}, [hasWebGL]);
```

**Uniform ref type addition:**
```tsx
const uniformsRef = useRef<{
  // ...existing uniforms...
  uMouse: THREE.IUniform<THREE.Vector2>;
} | null>(null);
```

**Default value in `buildScene`:**
```tsx
uMouse: { value: new THREE.Vector2(0.5, 0.5) },  // centered default
```

**Reduced-motion:** pointermove handler is not added when reduced-motion is active (the existing early return in `useGSAP` guard also covers this — but the pointermove listener needs its own reduced-motion check or simply: add the check at the start of `handlePointerMove` and early-return without mutating).

### Pattern 5: Stub Section Architecture (D-16 through D-19)

**What:** Five stub SFSection instances with minimum height, stub `<h2>`, correct data attributes. THESIS gets `PinnedSection` wrapper at 200vh.

```tsx
// Stub pattern — confirmed from PinnedSection API + SFSection API
<SFSection
  id="thesis"
  label="THESIS"
  bgShift="white"
  className="py-0"
>
  <PinnedSection scrollDistance={2} id="thesis-pin">
    <div className="h-full flex items-center justify-center">
      <h2 className="font-mono text-muted-foreground uppercase tracking-[0.2em] text-base">
        THESIS
      </h2>
    </div>
  </PinnedSection>
</SFSection>

{/* Non-pinned stubs */}
<SFSection
  id="proof"
  label="PROOF"
  bgShift="black"
  className="py-0 min-h-screen flex items-center justify-center"
>
  <h2 className="font-mono text-muted-foreground uppercase tracking-[0.2em] text-base">
    PROOF
  </h2>
</SFSection>
```

### Anti-Patterns to Avoid

- **`display: none` on nav:** Removes from accessibility tree, breaking skip-nav. Use `visibility: hidden` (D-15).
- **`opacity: 0` on h1 LCP target:** Defers LCP measurement. Use `opacity: 0.01` or `clip-path` (D-08).
- **`mt-[var(--nav-height)]` on ENTRY:** Pushes hero content below viewport top. Nav is invisible at scroll 0, so there is no nav bar to clear (EN-01).
- **`overflow-hidden` on SFSection containing PinnedSection:** Clips `position: fixed` during pin. ARCHITECTURE.md Anti-Pattern 4 — confirmed constraint.
- **Creating a new animation for nav reveal using `gsap.to()` with duration:** The DU aesthetic requires an instant channel-switch, not a fade. `gsap.set()` or `duration: 0` only.
- **Passing `data-bg-shift` as an HTML prop when `bgShift` prop is available:** Both work, but the typed `bgShift` prop catches typos at compile time. Use `bgShift` going forward.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Full-viewport WebGL section | Custom canvas + renderer | `GLSLHeroLazy` (existing) + `useSignalScene` | Scissor singleton already handles multi-scene; custom renderer creates extra WebGL context |
| 200vh pinned THESIS stub | Manual `position: sticky` + JS height calc | `PinnedSection` (Phase 29, already shipped) | Phase 29 delivered and tested; `anticipatePin: 1` + `invalidateOnRefresh: true` already configured |
| Scroll-triggered nav visibility | `IntersectionObserver` on nav | GSAP `ScrollTrigger.create()` | Lenis scroll events already routed through ScrollTrigger.update; IO would create a second scroll listener |
| Normalized mouse position math | Manual clamp/normalize | Direct division by `getBoundingClientRect()` dimensions | One-liner; no utility needed |
| Section landmark data attributes | Custom section registry | `SFSection` with `label`, `bgShift`, `id` props | SectionIndicator already reads `data-section-label`; bg-shift system reads `data-bg-shift` |

**Key insight:** This phase is almost entirely a composition exercise. The system is mature enough that Phase 30 assembles existing primitives into a new structure rather than building new infrastructure.

---

## Common Pitfalls

### Pitfall 1: LCP Suppression via `opacity: 0` Start State

**What goes wrong:** h1 is set to `opacity: 0` so GSAP can animate it in. Browser does not measure LCP for elements with `opacity: 0`. PF-03 (LCP < 1.0s) fails silently in development; only caught by Lighthouse on deployed URL.

**Why it happens:** The existing `hero.tsx` uses this pattern for `hero-copy` and `hero-feel` (non-title elements where it's acceptable). The pattern is copied to the title without thinking.

**How to avoid:** Start state on h1 must be `opacity: 0.01` minimum, or use `clip-path: inset(0 100% 0 0)` for a wipe-in reveal. GSAP animates FROM `clip-path: inset(0 100% 0 0)` TO `clip-path: inset(0 0% 0 0)`.

**Warning signs:** Any h1 with `style={{ opacity: 0 }}` or `className="opacity-0"` in the ENTRY section. Audit before merge.

### Pitfall 2: Nav Visible Flash on Page Load

**What goes wrong:** Nav is `visibility: visible` by default. ScrollTrigger initializes asynchronously after paint. Between paint and ScrollTrigger init, the nav flashes visible for one frame.

**Why it happens:** ScrollTrigger is wired inside `useEffect` (or `useGSAP`) which fires after the DOM paints.

**How to avoid:** Set the initial state in CSS, not JavaScript. Add to `globals.css`:
```css
.nav-entry-hidden {
  visibility: hidden;
  opacity: 0;
}
```
Apply this class to the `<nav>` element in JSX. ScrollTrigger's `onEnter` removes the class or sets inline styles that override it. This ensures the nav is invisible before any JS runs.

Alternatively: use `gsap.set()` at the very top of the `useEffect` before `ScrollTrigger.create()` — GSAP set calls are synchronous and happen before the next paint if called in useEffect before returning.

### Pitfall 3: THESIS Stub 200vh and `overflow-hidden` on Parent SFSection

**What goes wrong:** SFSection has `overflow-hidden` in its className (common to prevent content bleed). PinnedSection switches to `position: fixed` during scroll. Fixed children of overflow-hidden parents are clipped in some browsers.

**Why it happens:** Developer adds `overflow-hidden` to the THESIS SFSection as a safeguard.

**How to avoid:** THESIS SFSection must NOT have `overflow-hidden`. `className="py-0"` only. The PinnedSection already documents this constraint in its JSDoc. [VERIFIED: codebase audit of `pinned-section.tsx`]

### Pitfall 4: `sf-nav-roll-up` CSS Class Left on Nav Element

**What goes wrong:** Phase 30 adds ScrollTrigger nav reveal, but the CSS `sf-nav-roll-up` class is still on the `<nav>` element. The CSS animation fires 3.5s after load and slides the nav down, fighting the ScrollTrigger which has set the nav hidden. Result: nav appears at 3.5s on the initial ENTRY viewport (before user scrolls), breaking EN-04.

**Why it happens:** Developer adds the ScrollTrigger logic but forgets to remove the CSS class from the nav JSX.

**How to avoid:** The PR checklist must include: `grep -r "sf-nav-roll-up" components/layout/nav.tsx` returns zero results.

### Pitfall 5: `data-bg-shift` Not Applied to All Six Sections

**What goes wrong:** THESIS or another stub section is missing `data-bg-shift`. The `applyBgShift()` function in `PageAnimations` reads this attribute to determine background color transitions. Missing attribute means the bg-shift logic sees no transition point and the background does not change at that section boundary.

**Why it happens:** Stubs are created quickly and the attribute is forgotten.

**How to avoid:** All six SFSection instances must have `bgShift` prop set. The pattern alternates black/white starting with ENTRY=black.

### Pitfall 6: `pointermove` Handler Registered on Wrong Element

**What goes wrong:** The `pointermove` listener is added to `window` or `document` instead of the ENTRY container. Mouse movement anywhere on the page modulates the shader, including when the user is in a stub section below ENTRY.

**Why it happens:** `window.addEventListener('pointermove', ...)` is the path of least resistance.

**How to avoid:** Attach the listener to `containerRef.current` (the GLSLHero container element), which is `absolute inset-0` within the ENTRY section. Pointer events only fire when the pointer is over that element. [VERIFIED: correct containerRef pattern already exists in glsl-hero.tsx]

---

## Code Examples

### Existing `sf-nav-roll-up` (to be replaced)

```css
/* Source: verified in app/globals.css lines 463-475 */
.sf-nav-roll-up {
  animation: sf-nav-roll-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) 3.5s both;
  transform-origin: top;
}

@keyframes sf-nav-roll-up {
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .sf-nav-roll-up { animation: none; }
}
```

This class must be removed from the `<nav>` className in `nav.tsx`. The `@keyframes` declaration and `.sf-nav-roll-up` rule can stay in globals.css as dead code (Phase 34 audit will clean up).

### Existing GLSLHero Uniforms Structure (confirmed)

```typescript
// Source: verified in components/animation/glsl-hero.tsx buildScene()
const uniforms = {
  uTime:          { value: 0 },
  uScroll:        { value: 0 },
  uColor:         { value: primaryColor },
  uGridDensity:   { value: 12.0 },
  uDitherOpacity: { value: 0.25 },
  uResolution:    { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
  uIntensity:     { value: 0.5 },
  uAccent:        { value: 0.0 },
  // ADD: uMouse: { value: new THREE.Vector2(0.5, 0.5) }
};
```

### Existing PinnedSection API (Phase 29, confirmed)

```typescript
// Source: verified in components/animation/pinned-section.tsx
interface PinnedSectionProps {
  children: ReactNode;
  className?: string;
  scrollDistance: number;  // viewport heights (2 = 200vh)
  id?: string;
}
// Usage: <PinnedSection scrollDistance={2} id="thesis-pin">...</PinnedSection>
```

### Existing SFSection API (confirmed)

```typescript
// Source: verified in components/sf/sf-section.tsx
interface SFSectionProps extends React.ComponentProps<"section"> {
  label?: string;
  bgShift?: "white" | "black";
  spacing?: "8" | "12" | "16" | "24";
}
// Note: spacing defaults to "16" (py-16). Override with className="py-0" for full-viewport sections.
// Note: bgShift prop renders data-bg-shift attribute. Additional props spread to <section>.
```

### Data Attribute Pattern for New Sections

```tsx
// Source: verified current page.tsx pattern + SFSection implementation
// All six sections must follow this shape:
<SFSection
  id="entry"
  label="ENTRY"
  bgShift="black"
  className="py-0 relative"
  data-section="entry"
  data-cursor
>
  <EntrySection />
</SFSection>
```

---

## Runtime State Inventory

Step 2.5: SKIPPED — this is not a rename/refactor/migration phase. It is a greenfield page restructure. No stored data, live service configs, OS-registered state, secrets/env vars, or build artifacts reference the replaced Hero component or old section names.

---

## Environment Availability

Step 2.6: SKIPPED — this phase is code/config changes only. No external tools, services, CLIs, or databases are required beyond the existing project stack. All dependencies confirmed installed via codebase audit:
- Next.js 15.3: in use
- GSAP + ScrollTrigger: `lib/gsap-core.ts` confirmed
- Three.js: `components/animation/glsl-hero.tsx` confirmed
- Lenis: `components/layout/lenis-provider.tsx` confirmed
- PinnedSection: `components/animation/pinned-section.tsx` confirmed shipped (Phase 29)

---

## Validation Architecture

`workflow.nyquist_validation` is not set in `.planning/config.json` → treat as enabled.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright (confirmed from `test-results/` directory in git status) |
| Config file | `playwright.config.ts` (standard location — not verified, inferred) |
| Quick run command | `pnpm playwright test --grep "phase-30"` |
| Full suite command | `pnpm playwright test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| RA-05 | `app/page.tsx` renders exactly 6 `[data-section]` landmarks | smoke | `pnpm playwright test --grep "RA-05"` | Count `document.querySelectorAll('[data-section]')` === 6 |
| EN-01 | GLSL hero fills 100vh, no padding above fold | visual/smoke | `pnpm playwright test --grep "EN-01"` | Assert hero bounding rect top === 0, height === viewport height |
| EN-02 | h1 renders at 120px+ at 1440px viewport | smoke | `pnpm playwright test --grep "EN-02"` | Assert computed font-size >= 120 |
| EN-03 | No paragraph or scroll indicator in ENTRY | smoke | `pnpm playwright test --grep "EN-03"` | Assert `[data-section="entry"] p` count === 1 (subtitle only) |
| EN-04 | Nav not visible at 0 scroll; visible after scroll past ENTRY | smoke | `pnpm playwright test --grep "EN-04"` | Assert nav visibility === hidden at scroll 0; scroll to ENTRY bottom; assert visible |
| EN-05 | Shader variation on pointermove | manual-only | — | WebGL uniform state not inspectable via Playwright without custom harness |
| VL-03 | CircuitDivider not present in homepage DOM | smoke | `pnpm playwright test --grep "VL-03"` | Assert `[data-testid="circuit-divider"]` count === 0 on `/` |
| VL-07 | MarqueeBand not present in homepage DOM | smoke | `pnpm playwright test --grep "VL-07"` | Assert `[data-testid="marquee-band"]` count === 0 on `/` |

**EN-05 is manual-only.** Playwright cannot inspect WebGL uniform values. Manual QA: open DevTools, observe visual variation as mouse moves over ENTRY. The effect is present but subtle — "non-overwhelming" is a subjective judgment requiring human review.

### Sampling Rate

- **Per task commit:** `pnpm playwright test --grep "phase-30"` (smoke only, ~15s)
- **Per wave merge:** `pnpm playwright test` (full suite)
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `tests/phase-30-entry.spec.ts` — covers RA-05, EN-01, EN-02, EN-03, EN-04, VL-03, VL-07
- [ ] Test IDs (`data-testid`) on `CircuitDivider` and `MarqueeBand` may not exist — add `data-testid` if needed, or query by component-specific class selectors

---

## Security Domain

Phase 30 introduces no authentication, form inputs, API calls, user data, or external data sources. All changes are client-rendered UI composition. ASVS categories are not applicable.

- V2 Authentication: no
- V3 Session Management: no
- V4 Access Control: no
- V5 Input Validation: no user input
- V6 Cryptography: no

The `pointermove` handler reads `e.clientX / e.clientY` (native browser values) — no sanitization risk.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Playwright is the test framework (inferred from `test-results/` directory) | Validation Architecture | Low — if wrong, adjust test commands; no implementation impact |
| A2 | `data-cursor` attribute on SFSection is passed through and handled by canvas cursor — not broken by removing the Hero component | Architecture Patterns | Low — cursor behavior is attribute-driven; removing Hero does not affect the cursor hook |
| A3 | `applyBgShift()` in PageAnimations reads `data-bg-shift` HTML attribute directly (not the `bgShift` prop) — so both prop and direct attribute produce the same runtime behavior | Code Examples | Very low — verified by reading SFSection source which renders `data-bg-shift={bgShift}` |

**All critical implementation claims are VERIFIED via direct codebase audit. Three minor assumptions above are low-risk.**

---

## Open Questions

1. **HeroMesh removal (Claude's discretion)**
   - What we know: `HeroMesh` is imported in `hero.tsx`, which is being deleted. `HeroMesh` itself lives in `components/animation/hero-mesh.tsx`. With the Hero block gone, `HeroMesh` has no homepage consumer.
   - What's unclear: Whether `HeroMesh` is used on any other page or in any other block.
   - Recommendation: Grep for `HeroMesh` imports across the codebase before removing. If it's used nowhere else after `hero.tsx` is deleted, remove it in the same commit as the Hero block deletion. If it's used elsewhere, leave it.

2. **Nav `useRef` needed for ScrollTrigger targeting**
   - What we know: The current `nav.tsx` has no `ref` on the `<nav>` element. ScrollTrigger's `onEnter`/`onLeaveBack` callbacks need to target the nav DOM node.
   - What's unclear: Whether to add `useRef` to `nav.tsx` or use `document.querySelector('nav')` as the target.
   - Recommendation: Add `const navRef = useRef<HTMLElement>(null)` and attach `ref={navRef}` to the `<nav>`. Direct ref is more robust than querySelector.

3. **`data-section` vs `id` attribute for ScrollTrigger trigger**
   - What we know: The nav ScrollTrigger needs to target the ENTRY section element. SFSection renders `data-section` attribute plus any `id` passed as a prop.
   - What's unclear: Whether `ScrollTrigger.create({ trigger: "[data-section='entry']" })` is more reliable than `trigger: document.getElementById("entry")`.
   - Recommendation: Add `id="entry"` to the ENTRY SFSection and use `document.getElementById("entry")` as the trigger. CSS attribute selectors are valid GSAP targets but DOM getElementById is faster and clearer.

---

## Sources

### Primary (HIGH confidence — direct codebase audit)

- `app/page.tsx` — current 7-section structure, confirmed import list
- `components/animation/glsl-hero.tsx` — uniform structure, ScrollTrigger wiring, ticker pattern, MutationObserver pattern
- `components/animation/glsl-hero-lazy.tsx` — `next/dynamic({ ssr: false })` pattern
- `components/animation/pinned-section.tsx` — Phase 29 shipped API, `scrollDistance` prop, `invalidateOnRefresh: true`
- `components/layout/nav.tsx` — current `sf-nav-roll-up` class location, no navRef present
- `components/sf/sf-section.tsx` — `bgShift` prop type, `data-bg-shift` attribute rendering, spacing default
- `components/blocks/hero.tsx` — content inventory (CTAs, multilingual, subtitle, version tag)
- `components/layout/page-animations.tsx` — `hero-title`, `hero-subtitle` data-anim targets, async plugin loading
- `app/globals.css` — `sf-nav-roll-up` animation at lines 463-475, `--nav-height: 83px`, `--font-display` override
- `.planning/research/ARCHITECTURE.md` — 6-section architecture, bg-shift alternation, anti-patterns
- `.planning/phases/30-homepage-architecture-entry-section/30-CONTEXT.md` — all locked decisions D-01 through D-19

### Secondary (MEDIUM confidence — research docs)

- `.planning/STATE.md §v1.5 Critical Constraints` — LCP suppression hazard, `opacity: 0.01` rule
- `.planning/STATE.md §From v1.1` — GLSLHero architecture summary

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all tools confirmed in codebase, zero new packages
- Architecture: HIGH — SFSection, PinnedSection, GLSLHero, ScrollTrigger patterns all verified in source
- Pitfalls: HIGH — LCP constraint from STATE.md, nav flash from GSAP pattern knowledge, overflow-hidden from ARCHITECTURE.md Anti-Pattern 4
- Mouse uniform: HIGH — GLSL uniform mutation pattern is identical to existing `uScroll` pattern in same file

**Research date:** 2026-04-07
**Valid until:** 2026-05-07 (stable stack — no fast-moving dependencies)
