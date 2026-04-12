# Requirements — v1.5 Redesign

## Route Architecture

- [ ] **RA-01**: `/components` route renamed to `/inventory` with redirect from old path
- [ ] **RA-02**: `/tokens` route renamed to `/system` with redirect from old path
- [ ] **RA-03**: `/start` route renamed to `/init` with redirect from old path
- [x] **RA-04**: All internal links, nav items, and footer links updated to new route names
- [x] **RA-05**: Homepage `page.tsx` restructured with 6-section architecture (ENTRY → THESIS → PROOF → INVENTORY → SIGNAL → ACQUISITION)

## ENTRY Section

- [x] **EN-01**: GLSL hero shader fills 100vh — not contained in a padded section, IS the viewport
- [x] **EN-02**: `SIGNALFRAME//UX` rendered at 120px+ (Anton or current display font) centered on shader
- [x] **EN-03**: Single subtitle line only — no paragraph, no description, no scroll indicator
- [x] **EN-04**: No visible navigation on initial viewport — nav reveals on scroll (sticky after ENTRY)
- [x] **EN-05**: Shader parameters respond to mouse position on ENTRY section (subtle, not overwhelming)

## THESIS Section

- [ ] **TH-01**: Scroll-driven typographic layout spanning 200–300vh of scroll distance
- [ ] **TH-02**: Manifesto phrases placed individually across viewport via GSAP ScrollTrigger pin/scrub — not flowing paragraph text
- [ ] **TH-03**: At least 3 type moments at 80px+ that dominate their scroll frame
- [ ] **TH-04**: Negative space between phrases is intentional design material (minimum 30vh gaps between key statements)
- [ ] **TH-05**: Content includes SIGNAL/FRAME thesis, Enhanced Flat Design position, and cybernetic biophilia concept — as statements, not explanations
- [ ] **TH-06**: prefers-reduced-motion: instant placement of all text, no scroll-driven animation

## PROOF Section

- [ ] **PR-01**: Full-viewport interactive demonstration of SIGNAL/FRAME layer separation
- [ ] **PR-02**: Mouse/pointer position controls SIGNAL layer intensity in real-time (no overlay panel needed)
- [ ] **PR-03**: Visual separation of SIGNAL and FRAME layers — user can see the generative expression separate from the deterministic structure
- [ ] **PR-04**: Stats (component count, bundle size, Lighthouse score, etc.) integrated as data points within the interactive section, not as a separate band
- [ ] **PR-05**: Touch support — tap and drag on mobile produces the same SIGNAL/FRAME separation effect
- [ ] **PR-06**: prefers-reduced-motion: static split view showing both layers side-by-side

## INVENTORY Section

- [x] **IV-01**: Component catalog uses coded nomenclature: `SF//BTN-001`, `SF//CRD-002`, etc.
- [x] **IV-02**: Each catalog entry displays layer tag (`[//SIGNAL]` / `[FRAME]`), pattern tier (`A` / `B` / `C`), and component name
- [x] **IV-03**: Monospaced type for catalog entries — dense, systematic, not card-based
- [x] **IV-04**: Click/tap expands existing ComponentDetail panel (Phase 25 feature preserved)
- [x] **IV-05**: Homepage INVENTORY section shows 12-item subset; `/inventory` page shows full catalog
- [x] **IV-06**: Filter by layer, pattern, and category functional on `/inventory` page (existing filter logic preserved)

## SIGNAL Section

- [x] **SG-01**: Full-viewport generative WebGL scene (SignalMesh or new shader) at maximum SIGNAL intensity
- [x] **SG-02**: 150vh scroll distance with slow parallax — atmospheric breathing section
- [x] **SG-03**: Minimal or no text — pure visual/generative experience
- [x] **SG-04**: SIGNAL parameters animated by scroll position (intensity ramps up as user scrolls through)
- [x] **SG-05**: prefers-reduced-motion: static frame of the generative output, no animation

## ACQUISITION Section

- [x] **AQ-01**: CLI command `npx signalframeux init` displayed prominently in monospaced type with copy-to-clipboard
- [x] **AQ-02**: Key system stats (component count, bundle size, Lighthouse scores) as monospaced data points
- [x] **AQ-03**: Links to `/init` (full guide) and `/inventory` (full catalog)
- [x] **AQ-04**: Section height ≤ 50vh — sharp and short, no padding inflation
- [x] **AQ-05**: No "Get Started" button energy — technical instrument presentation

## Visual Language

- [x] **VL-01**: Ghost labels scaled to 200px+ — architectural elements, not background decoration
- [x] **VL-02**: Display type moments at 120px+ in at least 3 locations across the site
- [x] **VL-03**: CircuitDivider replaced or removed — section transitions use hard cuts or scroll-driven reveals
- [x] **VL-04**: Negative space audit: minimum 40% of viewport is intentional void in key sections
- [x] **VL-05**: Magenta accent used in ≤ 5 moments per page — fewer instances, bigger impact
- [x] **VL-06**: Section indicators redesigned as system readout HUD (monospaced, coded, data-dense)
- [x] **VL-07**: MarqueeBand removed or redesigned to fit the new information hierarchy

## Subpage Redesign

- [x] **SP-01**: `/system` (tokens) — token groups presented as specimen-style visual diagrams, not tables
- [x] **SP-02**: `/system` — spacing scale, type scale, color palette, motion tokens each get designed visual sections
- [x] **SP-03**: `/init` — getting started reframed as system initialization; sharp, technical, minimal prose
- [x] **SP-04**: `/reference` — API docs styled as technical schematics; monospaced, dense layout
- [x] **SP-05**: All subpages share the redesigned nav (hidden on initial viewport, sticky on scroll) and footer

## Performance

- [x] **PF-01**: Shared JS bundle remains under 150 KB gzip after all redesign changes
- [x] **PF-02**: Lighthouse 100/100 on all four categories against deployed URL
- [x] **PF-03**: LCP < 1.0s on homepage (ENTRY section)
- [x] **PF-04**: CLS = 0 — scroll-driven animations must not cause layout shift
- [x] **PF-05**: No new animation libraries — all motion via GSAP ScrollTrigger (already in stack)
- [x] **PF-06**: prefers-reduced-motion fully functional across all new sections

## Launch Readiness

- [x] **LR-01**: Awwwards submission package prepared (project description, technologies, screenshots)
- [x] **LR-02**: Open Graph / social meta tags updated for redesigned site (title, description, preview image)
- [x] **LR-03**: Vercel production deployment live with no console errors
- [x] **LR-04**: Mobile responsive across all new sections (tested at 375px, 768px, 1440px)

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| RA-01 | Phase 28 | Complete |
| RA-02 | Phase 28 | Complete |
| RA-03 | Phase 28 | Complete |
| RA-04 | Phase 28 | Complete |
| PF-04 | Phase 29 | Complete |
| PF-05 | Phase 29 | Complete |
| PF-06 | Phase 29 | Complete |
| RA-05 | Phase 30 | Complete |
| EN-01 | Phase 30 | Complete |
| EN-02 | Phase 30 | Complete |
| EN-03 | Phase 30 | Complete |
| EN-04 | Phase 30 | Complete |
| EN-05 | Phase 30 | Complete |
| VL-03 | Phase 30 | Complete |
| VL-07 | Phase 30 | Complete |
| TH-01 | Phase 31 | Complete |
| TH-02 | Phase 31 | Complete |
| TH-03 | Phase 31 | Complete |
| TH-04 | Phase 31 | Complete |
| TH-05 | Phase 31 | Complete |
| TH-06 | Phase 31 | Complete |
| SG-01 | Phase 32 | Complete |
| SG-02 | Phase 32 | Complete |
| SG-03 | Phase 32 | Complete |
| SG-04 | Phase 32 | Complete |
| SG-05 | Phase 32 | Complete |
| PR-01 | Phase 32 | Complete |
| PR-02 | Phase 32 | Complete |
| PR-03 | Phase 32 | Complete |
| PR-04 | Phase 32 | Complete |
| PR-05 | Phase 32 | Complete |
| PR-06 | Phase 32 | Complete |
| IV-01 | Phase 33 | Complete |
| IV-02 | Phase 33 | Complete |
| IV-03 | Phase 33 | Complete |
| IV-04 | Phase 33 | Complete |
| IV-05 | Phase 33 | Complete |
| IV-06 | Phase 33 | Complete |
| AQ-01 | Phase 33 | Complete |
| AQ-02 | Phase 33 | Complete |
| AQ-03 | Phase 33 | Complete |
| AQ-04 | Phase 33 | Complete |
| AQ-05 | Phase 33 | Complete |
| VL-01 | Phase 34 | Complete |
| VL-02 | Phase 34 | Complete |
| VL-04 | Phase 34 | Complete |
| VL-05 | Phase 34 | Complete |
| VL-06 | Phase 34 | Complete |
| SP-01 | Phase 34 | Complete |
| SP-02 | Phase 34 | Complete |
| SP-03 | Phase 34 | Complete |
| SP-04 | Phase 34 | Complete |
| SP-05 | Phase 34 | Complete |
| PF-01 | Phase 35 | Complete |
| PF-02 | Phase 35 | Complete |
| PF-03 | Phase 35 | Complete |
| LR-01 | Phase 35 | Complete |
| LR-02 | Phase 35 | Complete |
| LR-03 | Phase 35 | Complete |
| LR-04 | Phase 35 | Complete |

### v1.6 API-Ready Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CO-01 | Phase 36 → Phase 42 | Complete |
| CO-02 | Phase 36 → Phase 42 | Complete |
| CO-03 | Phase 36 → Phase 42 | Complete |
| CO-04 | Phase 36 → Phase 42 | Complete |
| MG-01 | Phase 37 | Complete |
| MG-02 | Phase 37 | Complete |
| MG-03 | Phase 37 | Complete |
| QA-01 | Phase 38 | Complete |
| QA-02 | Phase 38 | Complete |
| QA-03 | Phase 38 | Complete |
| LIB-01 | Phase 39 → Phase 42 | Complete |
| LIB-02 | Phase 39 → Phase 42 | Complete |
| LIB-03 | Phase 39 → Phase 42 | Complete |
| DOC-01 | Phase 40 | Complete |
| DOC-02 | Phase 40 | Complete |
| DOC-03 | Phase 40 | Complete |
| DOC-04 | Phase 40 | Complete |
| DIST-01 | Phase 41 | Complete |
| DIST-02 | Phase 41 | Complete |
| DIST-03 | Phase 41 | Complete |
| DIST-04 | Phase 41 → Phase 43 | Complete |

---

## Future Requirements (Deferred)

- Audio layer (Web Audio API) — deferred to v2+
- Haptic layer (Vibration API) — deferred to v2+
- Registry namespace strategy — deferred to v2+

## v1.6 API-Ready

### Housekeeping & Carry-Overs (Phase 36)
- [x] **CO-01**: Lighthouse Best Practices = 100 and SEO = 100 on signalframeux.vercel.app (3-run worst score)
- [x] **CO-02**: T-06 font-mono test path fixed — reads `components/blocks/api-explorer.tsx` not `app/reference/page.tsx`
- [x] **CO-03**: ESLint config wired with `eslint-config-next` preset, `pnpm lint` passes clean
- [x] **CO-04**: Toolchain currency verified — Vercel CLI at 50.42.0+, ROADMAP.md stale entries corrected

### Next.js 16 Migration (Phase 37)
- [x] **MG-01**: Next.js upgraded to ^16.x.x, app builds and starts without errors
- [x] **MG-02**: All 18 Playwright E2E tests pass on Next 16 with zero regressions
- [x] **MG-03**: Lighthouse scores >= Phase 36 baseline (100/100 all categories maintained)

### Test & Quality Hardening (Phase 38)
- [x] **QA-01**: Vitest configured with coverage; SF component utility functions have unit tests
- [x] **QA-02**: axe-core integrated into Playwright suite — every route passes WCAG AA audit
- [x] **QA-03**: Pre-commit hooks run `pnpm lint` + `tsc --noEmit`; blocked commits fail visibly

### Library Build Pipeline (Phase 39)
- [x] **LIB-01**: `package.json` exports field mapping SF components, tokens CSS, and utilities
- [x] **LIB-02**: `pnpm build:lib` produces ESM + CJS output via tsup in `dist/` with `.d.ts` declarations
- [x] **LIB-03**: Consumer importing `@signalframe/sf` does NOT bundle GSAP or Three.js (tree-shaking verified)

### API Documentation & DX (Phase 40)
- [x] **DOC-01**: All exported SF components have JSDoc with description, props table, and usage example
- [x] **DOC-02**: README.md covers installation, quick start, token system, and FRAME/SIGNAL model
- [x] **DOC-03**: Storybook runs locally with stories for all SF-wrapped components
- [x] **DOC-04**: `/reference` route reflects actual exported API (not stale internal-only components)

### Distribution & Launch Gate (Phase 41)
- [x] **DIST-01**: `npm publish --dry-run` succeeds with correct package contents
- [x] **DIST-02**: Fresh Next.js 16 app installs SFUX, renders 3+ SF components — builds without errors
- [x] **DIST-03**: CHANGELOG.md and semver version strategy documented
- [x] **DIST-04**: Lighthouse 100/100 all categories on deployed site after all v1.6 changes

## v1.7 Tightening, Polish, and Aesthetic Push

### Copy & Content Integrity
- [x] **COP-01**: Component count reconciled to single accurate number across all pages (stats-band, hero, OG image, manifesto-band, init page)
- [x] **COP-02**: Version string consistent across hero and OG image — matches current release
- [x] **COP-03**: "FRAMEWORK-AGNOSTIC" replaced with accurate React/Next.js claim on /init
- [x] **COP-04**: "SHIP FASTER" replaced with specific claim in marquee-band
- [x] **COP-05**: "and growing" filler removed from hero and homepage meta
- [x] **COP-06**: Playwright test assertions updated to match new copy strings (phase-35-metadata.spec.ts)

### Token Bridge
- [x] **TBR-01**: CD site imports `signalframeux/signalframeux.css` + `cd-tokens.css` override layer; existing pages render identically
- [x] **TBR-02**: `@layer` cascade: `sf.tokens` → `consumer.overrides` — consumer CSS wins without specificity war
- [ ] **TBR-03**: `--sfx-*` consumer override tier documented in MIGRATION.md with full variable list
- [ ] **TBR-04**: No SSR flash — dark mode `class="dark"` server-rendered on CD `<html>`, no magenta primary visible during streaming

### Tightening
- [ ] **TGH-01**: Light mode `--muted-foreground` on `bg-muted` passes WCAG AA (>= 4.5:1 contrast ratio)
- [ ] **TGH-02**: All 15 hardcoded animation durations replaced with `--duration-*` token references
- [ ] **TGH-03**: All 7 hardcoded color values in component/page code replaced with CSS custom property references
- [ ] **TGH-04**: `sf-button` hover duration aligned with other SF components (`--duration-fast` not `--duration-normal`)

### Viewport Polish
- [ ] **VPT-01**: `--text-2xs` raised from 9px to 10px; `--text-xs` raised from 10px to 11px — functional text readable on 13" MacBook
- [ ] **VPT-02**: Inventory grid adds `md:grid-cols-3` intermediate breakpoint between 2-col and 4-col
- [ ] **VPT-03**: Page header `pt-10` (40px) replaced with `pt-12` (48px) on all 4 subpages — blessed spacing stop
- [ ] **VPT-04**: Storybook viewport presets added for 1440x900 and 1280x800

### Intensity Bridge
- [ ] **SIG-01**: `updateSignalDerivedProps(intensity)` function in global-effects.tsx computes per-effect CSS custom properties from `--signal-intensity`
- [ ] **SIG-02**: VHS scan lines and noise opacity scale with `--signal-intensity` (no longer hardcoded at 0.2 / 0.015)
- [ ] **SIG-03**: Grain opacity governed by derived property with logarithmic perceptual curve
- [ ] **SIG-04**: `data-signal-intensity` attribute presets available for per-section intensity overrides
- [ ] **SIG-05**: `prefers-reduced-motion` suppresses all intensity-driven effects

### Grain + Idle Escalation
- [ ] **GRN-01**: Grain baseline stays at 0.03-0.05; intensity dial escalates dynamically via SIG-03 curve
- [ ] **GRN-02**: Idle escalation refactored to `useIdleEscalation(thresholds[])` with 3 phases (8s grain drift, 20s scan emphasis, 45s glitch burst + auto-reset)
- [ ] **GRN-03**: Escalation targets use relative offsets (currentValue + delta), not absolute values
- [ ] **GRN-04**: Chromatic visual baselines captured before grain changes

### VHS Enhancement
- [ ] **VHS-01**: Chromatic aberration (1-2px RGB channel offset) added to VHS overlay, scaled by derived intensity property
- [ ] **VHS-02**: Horizontal jitter (translateX noise per scan line) added
- [ ] **VHS-03**: Dropout bands (random horizontal black bars, 1-3px, <5% coverage) added
- [ ] **VHS-04**: Frame-edge vignette via radial-gradient added
- [ ] **VHS-05**: Safari `backdrop-filter` uses literal values with `-webkit-` prefix (no `var()` references)
- [ ] **VHS-06**: Combined visual review at intensity 0.0 / 0.5 / 1.0 passes human sign-off

### Halftone Texture
- [ ] **HLF-01**: CSS-only halftone dot pattern (`radial-gradient` + `filter: contrast()` + `background-blend-mode`)
- [ ] **HLF-02**: Gated at intensity >= 0.4 via derived property curve
- [ ] **HLF-03**: Scoped to specimen sections, not ambient overlay
- [ ] **HLF-04**: No moiré with grain at combined view — human visual review required

### Circuit Overlay
- [ ] **CIR-01**: SVG circuit pattern at 0.02-0.05 opacity as section background
- [ ] **CIR-02**: Exclusive with high grain via derived property curve (circuit fades as grain intensifies)
- [ ] **CIR-03**: `--signal-intensity` governs opacity

### Mesh Gradient
- [ ] **MSH-01**: Layered `radial-gradient()` with OKLCH colors at z:-1 behind content
- [ ] **MSH-02**: Grain composited on top of mesh gradient
- [ ] **MSH-03**: Slow position drift animation (60s+ cycle) for liveness

### Particle Field
- [ ] **PTL-01**: WebGL particle system using existing `useSignalScene()` singleton — no second WebGL context
- [ ] **PTL-02**: Stepped particle count (0 / 2000 / 5000) based on device capability
- [ ] **PTL-03**: Physical iOS Safari device test passes (no context loss, no black canvas)
- [ ] **PTL-04**: `prefers-reduced-motion`: static single-frame render

### Glitch Transition
- [ ] **GLT-01**: CSS `clip-path: inset()` + `@keyframes steps(1)` glitch effect, <300ms duration
- [ ] **GLT-02**: Triggered by idle escalation Phase 3 (45s) and optionally on page transitions
- [ ] **GLT-03**: Feels like signal dropout, not decoration

### Symbol System
- [ ] **SYM-01**: 20-30 curated modernist SVG symbols from Brando Corp collection
- [ ] **SYM-02**: `<CDSymbol name="..." size={N} />` React component, <5KB total sprite
- [ ] **SYM-03**: Used as section markers, list bullets, decorative dividers

### Datamosh Overlay
- [x] **DTM-01**: DatamoshOverlay component renders fullscreen fragment shader via useSignalScene — no separate WebGL context, registered with SignalCanvas singleton
- [x] **DTM-02**: uIntensity default 0.003 produces 1-2px noise-driven displacement with chromatic aberration (R/G/B at different offsets), visible at 100% zoom on close inspection, invisible in casual scroll
- [x] **DTM-03**: Effect wires to --signal-intensity CSS custom property via MutationObserver cache pattern, GPU time <0.5ms at 1920x1080
- [x] **DTM-04**: prefers-reduced-motion renders single static frame or disables entirely; GSAP breathing oscillates intensity between 0.001-0.004 over 8-12s cycles

### Visual Regression
- [ ] **VRG-01**: Chromatic installed (`@chromatic-com/storybook` + `chromatic` CLI) as devDependencies
- [ ] **VRG-02**: Visual baselines captured before Phase 49 (grain changes)
- [ ] **VRG-03**: Storybook story count gate updated from >= 40 to >= 60 after new effect stories added

### Performance Gates
- [ ] **PRF-01**: Lighthouse A11y/BP/SEO remain 100/100/100 after all v1.7 changes
- [ ] **PRF-02**: Lighthouse Performance does not regress below 75 (from 78 baseline)
- [ ] **PRF-03**: Combined stacked effects at intensity 1.0 pass human visual coherence review
- [ ] **PRF-04**: Bundle budget maintained: 50KB gzip library, 150KB gzip app shared chunks

### v1.7 Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| COP-01 | Phase 44 | Complete |
| COP-02 | Phase 44 | Complete |
| COP-03 | Phase 44 | Complete |
| COP-04 | Phase 44 | Complete |
| COP-05 | Phase 44 | Complete |
| COP-06 | Phase 44 | Complete |
| TBR-01 | Phase 45 | Complete |
| TBR-02 | Phase 45 | Complete |
| TBR-03 | Phase 45 | Pending |
| TBR-04 | Phase 45 | Pending |
| TGH-01 | Phase 46 | Pending |
| TGH-02 | Phase 46 | Pending |
| TGH-03 | Phase 46 | Pending |
| TGH-04 | Phase 46 | Pending |
| VPT-01 | Phase 47 | Pending |
| VPT-02 | Phase 47 | Pending |
| VPT-03 | Phase 47 | Pending |
| VPT-04 | Phase 47 | Pending |
| SIG-01 | Phase 48 | Pending |
| SIG-02 | Phase 48 | Pending |
| SIG-03 | Phase 48 | Pending |
| SIG-04 | Phase 48 | Pending |
| SIG-05 | Phase 48 | Pending |
| GRN-01 | Phase 49 | Pending |
| GRN-02 | Phase 49 | Pending |
| GRN-03 | Phase 49 | Pending |
| GRN-04 | Phase 49 | Pending |
| VHS-01 | Phase 50 | Pending |
| VHS-02 | Phase 50 | Pending |
| VHS-03 | Phase 50 | Pending |
| VHS-04 | Phase 50 | Pending |
| VHS-05 | Phase 50 | Pending |
| VHS-06 | Phase 50 | Pending |
| DTM-01 | Phase 50.1 | Complete |
| DTM-02 | Phase 50.1 | Complete |
| DTM-03 | Phase 50.1 | Complete |
| DTM-04 | Phase 50.1 | Complete |
| HLF-01 | Phase 51 | Pending |
| HLF-02 | Phase 51 | Pending |
| HLF-03 | Phase 51 | Pending |
| HLF-04 | Phase 51 | Pending |
| CIR-01 | Phase 52 | Pending |
| CIR-02 | Phase 52 | Pending |
| CIR-03 | Phase 52 | Pending |
| MSH-01 | Phase 53 | Pending |
| MSH-02 | Phase 53 | Pending |
| MSH-03 | Phase 53 | Pending |
| PTL-01 | Phase 54 | Pending |
| PTL-02 | Phase 54 | Pending |
| PTL-03 | Phase 54 | Pending |
| PTL-04 | Phase 54 | Pending |
| GLT-01 | Phase 55 | Pending |
| GLT-02 | Phase 55 | Pending |
| GLT-03 | Phase 55 | Pending |
| SYM-01 | Phase 56 | Pending |
| SYM-02 | Phase 56 | Pending |
| SYM-03 | Phase 56 | Pending |
| VRG-01 | Phase 48 | Pending |
| VRG-02 | Phase 49 | Pending |
| VRG-03 | Phase 56 | Pending |
| PRF-01 | Phase 56 | Pending |
| PRF-02 | Phase 56 | Pending |
| PRF-03 | Phase 56 | Pending |
| PRF-04 | Phase 56 | Pending |

## Out of Scope

- React Three Fiber — excluded; R3F's independent rAF loop conflicts with GSAP globalTimeline.timeScale(0)
- ScrollSmoother — excluded; Lenis integration validated at Lighthouse 100/100, migration risk unjustified
- New animation libraries — GSAP + Lenis handle everything
- Glassmorphism — anti-feature per DU/TDR aesthetic
- Rounded corners — zero border-radius everywhere (existing constraint)
- CSS Houdini Paint API — excluded; Safari disabled, Firefox zero support (~24% users affected)
- VFX-JS — excluded; scrolling lag conflicts with SignalCanvas singleton
- Static grain above 0.07 — anti-feature per SOTD research; parametric escalation instead
- Diegetic design rewrite (Tier 2) — deferred to v1.8
- Environmental depth (Tier 3) — deferred to v1.8+
- CI/CD pipeline — deferred; manual quality gates continue for v1.7
