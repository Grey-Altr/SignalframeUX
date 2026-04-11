# Aesthetic Prototypes — SF//UX v1.7 Prep

Tasks 10-13 from the v1.7 dispatch. Substrate-as-content, diegetic design, SIGNAL default-on, idle escalation.

---

## Task 10: Substrate-as-Content Feasibility

### Current Grain Implementation

**Token:** `--sf-grain-opacity: 0.03` (3%) — `lib/tokens.css:125`

**Static grain:** `.sf-grain::after` in `globals.css:621-631`
- SVG-based (`public/grain.svg`) using `feTurbulence` (fractalNoise, baseFrequency 0.65, 3 octaves)
- `background: url("/grain.svg") repeat`
- `mix-blend-mode: multiply`
- Opacity controlled by `var(--sf-grain-opacity)`

**Animated grain:** `.sf-grain-animated::after` in `globals.css:843-855`
- Inline SVG data URI (256px tile), same 0.03 opacity
- `animation: sf-grain-drift 0.8s steps(4) infinite` — translates oversized grain layer in 4 discrete steps for film-flicker effect
- Triggered by idle state (see Task 13)

### Current VHS Overlay — Purely CSS + GSAP (`vhs-overlay.tsx`, 183 lines)

6 layers, all rendered as `<div>` inside a fixed overlay at `z-index: var(--z-vhs)` (99999):

| Layer | CSS Technique | Current Opacity |
|-------|--------------|----------------|
| CRT scanlines | `repeating-linear-gradient` (4px period, 1px transparent / 3px black) | `var(--sf-vhs-crt-opacity)` = **0.2** |
| Bright scanline | `::before` (1px magenta line with box-shadow glow) + `::after` (backdrop-filter blur) | Fixed magenta glow |
| Slow scanline | Same structure, 1px, no glow | 0.05 |
| Noise | Inline SVG data URI (fractalNoise baseFrequency 0.85) | `var(--sf-vhs-noise-opacity)` = **0.015** (1.5%) |
| Static burst | Inline SVG data URI (fractalNoise baseFrequency 1.2) | 0 → 0.015-0.035 via GSAP (every 12-25s) |
| Glitch | Linear gradient (magenta/cyan/green) with `mix-blend-mode: difference` | 0 → GSAP fires horizontal slice displacement every 25-50s |
| Chromatic aberration | Two 140px gradient strips at top/bottom edges | ~0.12 max at edges |

Outer wrapper: `filter: blur(0.8px) brightness(1.08) contrast(1.04)`.
Killed on touch devices (`pointer: coarse` check, line 29).
Tab visibility pauses animations.

### Existing Scan Line Implementations (5 Total)

1. `.vhs-crt` — 4px-period horizontal scan lines (`globals.css:1611-1618`)
2. `.vhs-scanline` — traveling bright scanline with magenta glow (`globals.css:1621-1676`)
3. `.sf-idle-overlay` — 4px-period magenta scan lines at 0.015 opacity (`globals.css:896-901`)
4. `GLSLSignal` CSS fallback — 8px-period scan lines (`glsl-signal.tsx:171`)
5. `GLSLSignal` shader — 120 horizontal scanlines in fragment shader (line 106-108)

### SIGNAL Intensity Variable

**Default:** `--signal-intensity: 0.5` — `tokens.css:169`
**Controlled by:** `SignalOverlay` component (writes to `:root` via `document.documentElement.style.setProperty()`)
**Also mutated by:** `SignalSection` (sets to 1.0 on scroll enter), `ProofSection` (section-scoped)

### WebGL Shaders (3 scenes)

| Shader | File | Technique | Uniforms |
|--------|------|-----------|----------|
| GLSLHero | `glsl-hero.tsx` | FBM noise field + geometric grid + Bayer 4x4 dither | uTime, uScroll, uColor, uGridDensity, uDitherOpacity, uResolution, uIntensity, uAccent, uMouse |
| ProofShader | `proof-shader.tsx` | Fork of GLSLHero, lattice ↔ noise blend via smoothstep on signal intensity | Same set |
| GLSLSignal | `glsl-signal.tsx` | Ikeda-inspired data field: 120 scanlines, 32 data columns, horizontal bursts, yellow spikes | Three color registers (foreground, primary, warning) |

Plus `SignalMesh` (`signal-mesh.tsx`) — wireframe icosahedron using Three.js ShaderMaterial with breathing displacement.

**Performance profile:**
- Singleton `WebGLRenderer` (`signal-canvas.tsx`): `antialias: false`, pixelRatio capped at 2
- GSAP ticker drives rendering (not Three.js animation loop)
- IntersectionObserver gates rendering — offscreen scenes skip render loop
- iOS Safari context limit handled

### CSS vs WebGL Split

**CSS-achievable (no WebGL needed):**
- All VHS layers (scan lines, noise, glitch, aberration, burst)
- Grain texture (static + animated)
- Idle overlay effects
- Glitch text effects (`.sf-glitch` — `globals.css:1488-1582`)
- Color cycle frame wipes

**WebGL-required:**
- FBM noise field (GLSLHero)
- Ikeda data field (GLSLSignal)
- Lattice/noise blend (ProofShader)
- Icosahedron wireframe (SignalMesh)

### Prototype Recommendations

**Grain at 0.08, 0.10, 0.12:**
- Change `--sf-grain-opacity` in `tokens.css:125`. Single token swap. CSS-only. Zero performance impact.
- Current `mix-blend-mode: multiply` means grain darkens on dark backgrounds. At 0.12, this may over-darken `oklch(0.145)` backgrounds. Test with `overlay` blend mode as alternative.

**CRT scan line overlay (new):**
- `.vhs-crt` already exists at 4px period / 0.2 opacity. For a separate, controllable scan line layer: new `repeating-linear-gradient` at 10%, 15%, 20% opacity. CSS-only. Negligible performance cost.
- Test: `background: repeating-linear-gradient(0deg, transparent 0px, transparent 3px, oklch(0 0 0 / 0.15) 3px, oklch(0 0 0 / 0.15) 4px);`

**VHS tracking glitch:**
- Already implemented as `.vhs-glitch` in `vhs-overlay.tsx` lines 93-132. Currently fires every 25-50s with 3-6 burst slices, horizontal displacement + skew via GSAP clip-path animation.
- For the dispatch spec (2-4 scanlines, 3-8px, 100-200ms): adjust existing GSAP timeline params rather than adding a new layer.

**Compression artifact texture:**
- New CSS layer. SVG data URI with blocky noise pattern (large baseFrequency in feTurbulence, e.g. 0.02 for large blocks). 5-8% opacity on section dividers.
- Apply via `.sf-section::after` pseudo-element or a new `.sf-compression-artifact` class on `SFSection` divider boundaries.

---

## Task 11: Diegetic Design Inventory

### Current Route Framing vs Proposed

| Route | Current Title | Current Metaphor | Proposed Metaphor | Key File |
|-------|--------------|-----------------|-------------------|----------|
| `/` | SIGNALFRAME//UX | Cinematic scroll-through with 6 "rooms" (ENTRY, THESIS, PROOF, INVENTORY, SIGNAL, ACQUISITION) | Same structure, diegetic overlays | `app/page.tsx` |
| `/inventory` | INVE\nNTORY | Component catalog / parts list | **Parts catalog with spec plates** | `app/inventory/page.tsx` |
| `/system` | TOKEN\nEXPLORER | Token explorer / design system inspector | Same (already system-like) | `app/system/page.tsx` |
| `/init` | [00//BOOT] INITIA\nLIZE | **Boot sequence / initialization terminal** | Same — **already diegetic** | `app/init/page.tsx` |
| `/reference` | API\nREFERENCE | API reference docs | **`SYS//REF` intelligence database** | `app/reference/page.tsx` |

### Current Section Labels (`data-section-label`)

`SFSection` at `sf-section.tsx:28-46` renders `<section data-section data-section-label={label}>`. Labels appear as CSS `::before` content (rotated sidebar labels at 30% opacity).

Current labels: `"ENTRY"`, `"THESIS"`, `"PROOF"`, `"INVENTORY"`, `"SIGNAL"`, `"ACQUISITION"`, `"TOKENS"`, `"INIT"`, `"SEQUENCE"`, `"TERMINAL"`, `"API REFERENCE"`, `"API REFERENCE HEADER"`, `"SIGNAL MESH"`.

**Proposed change:** Prefix with system codes: `SYS//ENTRY-000`, `SYS//THESIS-001`, `SYS//PROOF-002`, etc. Impact: string changes in label props across page files. Small effort, large world-building payoff.

### ACQUISITION Section (`acquisition-section.tsx`, 72 lines)

Server Component. Contains:
- `"-- ACQUIRE"` label
- CLI command (`npx signalframeux init`) with copy button
- Stats: COMPONENTS, BUNDLE, LIGHTHOUSE from `SYSTEM_STATS`
- Two text anchors: `-> /init`, `-> /inventory`

Design intent comment: "must feel like a terminal session that ended, not an invitation. No CTA energy."

**No email signup.** Pure terminal readout. 50vh max, overflow-hidden.

**For proposed terminal session upgrade:** The structure is already terminal-ish. Changes needed: blinking cursor, `> INITIATE CONTACT PROTOCOL` prompt styling, email input styled as command prompt, stats as system diagnostics. Medium effort — mostly CSS/copy changes to existing component.

### Nav Component (`nav.tsx`, 135 lines)

5 links: INVENTORY (/inventory), API (/reference), SYSTEM (/system), GET STARTED (/init), GITHUB (external).
Logo: SF//UX (LogoMark). Right side: Cmd+K palette, dark mode toggle, live clock.
Mobile: "MENU" button → NavOverlay. ScrambleText on link labels. Magnetic hover.

**For proposed `[SYS]` prefix:** Change link labels to `[SYS//INV]`, `[SYS//REF]`, `[SYS//TOK]`, `[SYS//BOOT]`. Minimal effort — string changes + ScrambleText adjustments.

### Loading States

`component-skeleton.tsx` (216 lines) — stroke-only silhouettes of 12 SF components. Used in PROOF section. No animation — parent rAF drives opacity.

No traditional skeleton loaders or spinners. `next/dynamic` lazy wrappers render nothing during load (no `loading:` fallback specified).

**For proposed boot sequence loading:** New `SFLoadingState` component with monospaced "LOADING MODULE..." + progress percentage. Medium effort — new component, then wire into `next/dynamic` loading fallbacks.

### Component Registry / Nomenclature

`lib/component-registry.ts` — `COMPONENT_REGISTRY` mapping index numbers ("001", "002") to entries with name, component, importPath, variants, code, docId, layer ("frame"/"signal"), pattern, category. SF codes like `SF//BTN-001` computed by `lib/nomenclature.ts`.

**For proposed spec plates in /inventory:** The registry already has all the data needed. Extend entries with "material" (React + Tailwind), "weight" (bundle size estimate), "clearance" (z-index), "tolerances" (a11y score). Medium effort — data extension + card redesign.

### Effort Estimates

| Diegetic Change | Effort | Breaking? |
|-----------------|--------|-----------|
| Section labels → `SYS//` prefix | **Small** — string changes | No |
| Nav labels → `[SYS//]` prefix | **Small** — string changes | No |
| `/reference` → intelligence database framing | **Medium** — copy rewrite, layout tweaks | No |
| `/inventory` → spec plate cards | **Medium** — component redesign, registry data extension | No |
| ACQUISITION → terminal session | **Medium** — CSS/copy changes to existing component | No |
| Loading → boot sequence | **Medium** — new component + integration | No |
| `/init` | **Already diegetic** — no changes needed | N/A |

### A11y Concerns

- `SYS//` prefixed labels must remain readable by screen readers — use `aria-label` with plain text alternatives where coded nomenclature would confuse assistive tech
- "CLASSIFIED" watermark on `/reference` must not be read as content — ensure `aria-hidden="true"` and role="presentation"
- Terminal-style ACQUISITION must not trap keyboard focus — ensure tab order flows naturally through the "command prompt" UI

---

## Task 12: SIGNAL Layer Default-On Test

### Current Default

`--signal-intensity: 0.5` in `tokens.css:169`. Module-level cache: `let _signalIntensity = 0.5` in `signal-mesh.tsx:61` and `glsl-hero.tsx:59`.

### Shift+S Behavior

`signal-overlay.tsx:122-132` — toggles `isOpen` state. This only shows/hides the **control panel** (3 sliders for intensity/speed/accent). **Does NOT toggle the SIGNAL layer on/off.** SIGNAL effects (VHS overlay, WebGL shaders) run unconditionally.

The dispatch says "Shift+S becomes a level control, not an on/off" — **this is already the case.** Shift+S opens a level control panel. The SIGNAL layer is always running.

### Breakage Analysis at 0.3

| Component | How it reads intensity | Behavior at 0.3 | Breaks? |
|-----------|----------------------|------------------|---------|
| SignalMesh | `_signalIntensity * 2 * 0.4` = max displacement | Displacement drops from 0.4 to 0.24 | **No** — subtler |
| GLSLHero | `0.5 + uIntensity * 0.5` = noise amplitude | Amplitude scales to 0.65x | **No** — subtler |
| ProofShader | `smoothstep(0.3, 0.7, intensity)` = lattice↔noise blend | At 0.3: shows pure geometric lattice | **No** — intentional |
| InstrumentHUD | Display only: "SIG:0.3" | Shows "SIG:0.3" | **No** |
| SignalSection | WRITES 1.0 to `:root` on scroll enter | Overrides to 1.0 when in viewport | **No** |

**Assessment: Setting default to 0.3 would not break anything.** All consumers treat it as continuous 0-1. Effects would be subtler at page load, then ramp up when scrolling to SignalSection.

### Lazy-Loading Status

| Component | Loading Strategy | In Sync Bundle? |
|-----------|-----------------|-----------------|
| SignalOverlay (panel) | `next/dynamic({ ssr: false })` | No |
| SignalMesh | `next/dynamic({ ssr: false })` | No |
| GLSLHero | `next/dynamic({ ssr: false })` | No |
| ProofShader | `next/dynamic({ ssr: false })` | No |
| GLSLSignal | `next/dynamic({ ssr: false })` | No |
| **VHSOverlay** | **Direct import in global-effects.tsx** | **Yes** |
| **CanvasCursor** | **Direct import in global-effects.tsx** | **Yes** |
| **IdleOverlay** | **Inline in global-effects.tsx** | **Yes** |
| SignalCanvas singleton | `signal-canvas-lazy.tsx` | No |

VHSOverlay and CanvasCursor are always-in-bundle. This is intentional — they're CSS-only effects (VHS) and Canvas 2D (cursor) with minimal JS.

### Recommendation

The dispatch proposes setting default to 0.3 — but the **current default is already 0.5**. If the intent is to make SIGNAL more visible by default, 0.5 is already higher than 0.3. The confusion may be that the dispatch assumed the default was 0 (it's not — Shift+S is a control panel, not an on/off).

**If anything, test at the current 0.5 and decide whether to go higher (0.6-0.7) for more visible generative effects at load.**

---

## Task 13: Idle State Escalation

### Current Idle Detection (`global-effects.tsx:201-305`)

- **Timer-based:** `setTimeout` with `IDLE_TIMEOUT = 8_000` (8 seconds)
- **Reset events:** `mousemove`, `mousedown`, `keydown`, `scroll`, `touchstart` (all `{ passive: true }`)
- **Reset behavior:** Clears timeout, removes GSAP ticker, restores `--color-primary`, removes `sf-grain-animated` class, snaps overlay back instantly

### Current Idle Effects (All Fire Simultaneously at 8s)

1. **OKLCH lightness oscillation** (lines 258-268): GSAP ticker oscillates `--color-primary` lightness ±5% over 4-second sine period
2. **Grain drift** (line 271): Adds `sf-grain-animated` class → `@keyframes sf-grain-drift` (0.8s steps(4) infinite)
3. **Scan line overlay** (line 272): Adds `sf-idle-overlay--active` → fades in (600ms), `@keyframes sf-idle-scan` (8s linear infinite) — slow downward drift of 4px magenta scan lines at 0.015 opacity

### No Existing Escalation System

The idle behavior is **binary**: off or on. Single timeout, single activation point. No progressive enhancement.

### Existing RGB/Color Separation Effects (Available for Reuse)

| Effect | Location | Technique |
|--------|----------|-----------|
| `.sf-glitch::before` | `globals.css:1546` | Cyan at 0.05 opacity, clip-pathed |
| `.sf-glitch::after` | `globals.css:1552` | Magenta at 0.05 opacity, clip-pathed |
| `.vhs-aberration` | `globals.css:1708-1736` | Gradient strips at viewport edges with separated hues |
| `.vhs-glitch` | `vhs-overlay.tsx:93-132` | `mix-blend-mode: difference` with magenta/cyan/green gradient |

**No RGB separation in WebGL shaders.** All fragment shaders output monochrome (single uColor). No chromatic aberration in shader code.

### Proposed Escalation Architecture

```
0-8s:    Normal — no idle effects
8s:      Phase 1 — grain drift + scan line overlay (CURRENT behavior)
30s:     Phase 2 — grain intensifies (--sf-grain-opacity: 0.03 → 0.08)
60s:     Phase 3 — subtle RGB offset (1-2px channel separation via CSS transforms on ::before/::after pseudo-elements)
120s:    Phase 4 — intermittent scan line displacement (reuse .vhs-glitch timing with lower intensity)
```

Implementation approach:
- Replace single `IDLE_TIMEOUT` with `IDLE_PHASES = [8000, 30000, 60000, 120000]`
- Each phase adds a CSS class: `.sf-idle-1`, `.sf-idle-2`, `.sf-idle-3`, `.sf-idle-4`
- Phase 2: GSAP tween on `--sf-grain-opacity` from current to 0.08
- Phase 3: Apply `.sf-glitch`-style `::before`/`::after` to a new idle-specific overlay div with 1-2px translate offsets
- Phase 4: Periodic GSAP timeline (reuse `.vhs-glitch` params) at reduced intensity

**Performance:** All CSS-based except the GSAP ticker for Phase 2 opacity tween and Phase 4 timing. Negligible GPU cost. The existing grain/scan line layers are already rendered.

**`prefers-reduced-motion` handling:** All phases must respect reduced-motion. Phase 1 grain could be static (no drift). Phases 2-4 should be suppressed entirely. The global kill-switch in `globals.css:1013-1021` handles CSS animations, but GSAP tweens need explicit guards (pattern already established in the codebase).

---

## Key File Reference

| Item | Path |
|------|------|
| Grain opacity token | `lib/tokens.css:125` |
| Signal intensity default | `lib/tokens.css:169` |
| Grain CSS | `globals.css:621-631, 843-855` |
| VHS overlay CSS | `globals.css:1590-1743` |
| VHS overlay component | `components/animation/vhs-overlay.tsx` |
| Signal overlay (Shift+S) | `components/animation/signal-overlay.tsx` |
| Idle system | `components/layout/global-effects.tsx:201-305` |
| SignalCanvas singleton | `lib/signal-canvas.tsx` |
| GLSLHero shader | `components/animation/glsl-hero.tsx` |
| GLSLSignal shader | `components/animation/glsl-signal.tsx` |
| ProofShader | `components/animation/proof-shader.tsx` |
| SignalMesh | `components/animation/signal-mesh.tsx` |
| Glitch CSS | `globals.css:1488-1582` |
| SFSection | `components/sf/sf-section.tsx` |
| Component registry | `lib/component-registry.ts` |
| Nomenclature | `lib/nomenclature.ts` |
| Nav | `components/layout/nav.tsx` |
| Acquisition section | `components/blocks/acquisition-section.tsx` |
