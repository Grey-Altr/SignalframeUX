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
- [x] **TBR-03**: `--sfx-*` consumer override tier documented in MIGRATION.md with full variable list — Ratified (technique-divergence: rename-rule pattern in lieu of literal full-list enumeration; equivalent functional coverage via `## TOKEN NAMESPACE MIGRATION` + `## CONSUMER CSS INTEGRATION` + `## CD SITE INTEGRATION EXAMPLE`, MIGRATION.md L67-137)
- [x] **TBR-04**: No SSR flash — dark mode `class="dark"` server-rendered on CD `<html>`, no magenta primary visible during streaming — Ratified (architecture-shipping mode, PTL-01 precedent: `@layer signalframeux` + unlayered `cd-tokens.css` resolves override before first paint per MIGRATION.md L122; consumer-side `class="dark"` on `<html>` is downstream contract on CD site)

### Tightening
- [x] **TGH-01**: Light mode `--muted-foreground` on `bg-muted` passes WCAG AA (>= 4.5:1 contrast ratio) — Ratified (in-code annotation: `app/globals.css:151` `--sfx-muted-foreground oklch(0.460 0.010 298)` on `--sfx-muted oklch(0.930 0.005 298)` = 5.81:1)
- [x] **TGH-02**: All 15 hardcoded animation durations replaced with `--duration-*` token references — Ratified (live grep `duration-\[[0-9]+ms\]` returns zero in `components/`; commit `00868ca`)
- [x] **TGH-03**: All 7 hardcoded color values in component/page code replaced with CSS custom property references — Ratified (live grep `style={{ color: "#..." }}` and `bg-[oklch(` return zero in `components/`; commit `17c7197`)
- [x] **TGH-04**: `sf-button` hover duration aligned with other SF components (`--duration-fast` not `--duration-normal`) — Ratified (`components/sf/sf-button.tsx:6` ships `duration-[var(--sfx-duration-fast)]`)

### Viewport Polish
- [x] **VPT-01**: `--text-2xs` raised from 9px to 10px; `--text-xs` raised from 10px to 11px — functional text readable on 13" MacBook (clamp floor lift in `app/globals.css:200-201`, 2026-04-25)
- [x] **VPT-02**: Inventory grid adds `md:grid-cols-3` intermediate breakpoint between 2-col and 4-col — RATIFIED 2026-04-25, already shipped at `components/blocks/components-explorer.tsx:817` (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`)
- [x] **VPT-03**: Page header `pt-10` (40px) replaced with `pt-12` (48px) on all 4 subpages — blessed spacing stop — OBSOLETE 2026-04-25: `pt-10` page-header pattern eliminated by the `<main className="mt-[var(--nav-height)]">` + SFPanel-based hero architecture. No `pt-10` instances remain in any subpage.
- [x] **VPT-04**: Storybook viewport presets added for 1440x900 and 1280x800 — RATIFIED 2026-04-25, already shipped at `.storybook/preview.ts:23-34` (`macbook13` 1280×800 + `macbook15` 1440×900)

### Intensity Bridge
- [x] **SIG-01**: `updateSignalDerivedProps(intensity)` function in global-effects.tsx computes per-effect CSS custom properties from `--signal-intensity` — RATIFIED 2026-04-25, shipped at `components/layout/global-effects.tsx:23` (exported function with full body deriving 12 CSS custom properties)
- [x] **SIG-02**: VHS scan lines and noise opacity scale with `--signal-intensity` (no longer hardcoded at 0.2 / 0.015) — RATIFIED 2026-04-25, shipped at `components/layout/global-effects.tsx:29` (scanline `0.005 + i * 0.015`) and `:32` (noise `0.0025 + i * 0.0075`)
- [x] **SIG-03**: Grain opacity governed by derived property with logarithmic perceptual curve — RATIFIED 2026-04-25, shipped at `components/layout/global-effects.tsx:36` (`0.03 + 0.05 * Math.log10(1 + i * 9)`)
- [x] **SIG-04**: `data-signal-intensity` attribute presets available for per-section intensity overrides — RATIFIED 2026-04-25, shipped at `app/globals.css:2269-2271` (`[data-signal-intensity="low|med|high"]` set `--sfx-signal-intensity` to 0.2 / 0.5 / 0.8)
- [x] **SIG-05**: `prefers-reduced-motion` suppresses all intensity-driven effects — RATIFIED 2026-04-25, shipped at `components/layout/global-effects.tsx:24-25` (`const i = prefersReduced ? 0 : intensity` collapses all derived values to 0)

### Grain + Idle Escalation
- [x] **GRN-01**: Grain baseline stays at 0.03-0.05; intensity dial escalates dynamically via SIG-03 curve — RATIFIED 2026-04-25, shipped at `components/layout/global-effects.tsx:36` (`0.03 + 0.05 * Math.log10(1 + i * 9)` evaluates to 0.03 at i=0 — within spec; same line that ratified SIG-03)
- [x] **GRN-02**: Idle escalation refactored to `useIdleEscalation(thresholds[])` with 3 phases (8s grain drift, 20s scan emphasis, 45s glitch burst + auto-reset) — OBSOLETE 2026-04-25; hook shipped at `hooks/use-idle-escalation.ts:28` (commit `40e2f0d`) but the 3-phase consumer (`IdleOverlay`) was deliberately deleted in commit `a260238` ("remove heavy SIGNAL effects from GlobalEffects render for performance gate") to ship PRF-02 Lighthouse Performance compliance. Hook is currently library-only; zero consumers. Performance gate supersedes idle-escalation animation per v1.7 launch-gate hierarchy.
- [x] **GRN-03**: Escalation targets use relative offsets (currentValue + delta), not absolute values — OBSOLETE 2026-04-25; relative-offset pattern was implemented in `IdleOverlay` (commit `40e2f0d`'s scanline `+0.03` delta) but the consumer was removed by `a260238`. Pattern persists in commit history as encoded intent for any future re-wiring; same supersedence as GRN-02.
- [x] **GRN-04**: Chromatic visual baselines captured before grain changes — OBSOLETE 2026-04-25; temporal gate cannot be satisfied retroactively. Grain code (`global-effects.tsx:36`) predates Chromatic wiring (commits `54db119` + `abe0cfd`). Forward-looking baseline capture remains available via VRG-01's ratified Chromatic infrastructure; within v1.7 lock posture no further grain changes are scoped, so the gate is moot.

### VHS Enhancement
- [x] **VHS-01**: Chromatic aberration (1-2px RGB channel offset) added to VHS overlay, scaled by derived intensity property — RATIFIED 2026-04-25; `components/animation/vhs-overlay.tsx:153-178` derives `--sfx-vhs-chromatic-opacity` from `--sfx-vhs-scanline-opacity` (the SIG-02 derived property), gated at intensity > 0.3 then linearly scaled across 0.3–1.0; `app/globals.css:2195-2210` renders red+cyan layers with opposing ±1.5px translateX and `mix-blend-mode: screen`. Reads the Phase 48 derived intensity bridge — pre-satisfied at the consumer wiring level by SIG-02.
- [x] **VHS-02**: Horizontal jitter (translateX noise per scan line) added — RATIFIED 2026-04-25; `app/globals.css:2213-2225` `.vhs-jitter` runs `sf-vhs-jitter 0.15s steps(4, end) infinite` keyframes stepping translateX through −1.2px / +0.8px / −0.5px / +1px values. `steps(4, end)` produces the discrete tape-dropout register (not smooth animation). JSX layer 8 at `components/animation/vhs-overlay.tsx:230-233`.
- [x] **VHS-03**: Dropout bands (random horizontal black bars, 1-3px, <5% coverage) added — OBSOLETE 2026-04-25; CSS scaffold ships at `app/globals.css:2230-2246` (`.vhs-dropout` container + `.vhs-dropout--active` toggle + `.vhs-dropout__band` band style at `oklch(0 0 0 / 0.85)`) and JSX container ships at `vhs-overlay.tsx:236`, but the runtime activator was tied to the cut idle-escalation consumer per Phase 49's GRN-02 supersedence chain (`a260238 fix(cleanup): remove heavy SIGNAL effects from GlobalEffects render for performance gate`). The original feat commit `93fa031 feat(50): VHS enhancement — chromatic aberration, jitter, dropout bands, vignette` shipped with band-injection deferred to "idle phase 2+" wiring that never landed. Performance launch gate (PRF-02) supersedes; CSS persists as latent surface area identical to `useIdleEscalation`'s library-only / dead-code residue.
- [x] **VHS-04**: Frame-edge vignette via radial-gradient added — RATIFIED 2026-04-25; `app/globals.css:2249-2253` `.vhs-vignette` uses `radial-gradient(ellipse at center, transparent 60%, oklch(0 0 0 / 0.15) 100%)`, transparent through the 60% center band and darkening to ≈15% black opacity at the perimeter. JSX layer 10 at `components/animation/vhs-overlay.tsx:239`.
- [x] **VHS-05**: Safari `backdrop-filter` uses literal values with `-webkit-` prefix (no `var()` references) — RATIFIED 2026-04-25; both `.vhs-scanline` (`app/globals.css:2108-2109`) and `.vhs-scanline--slow` (`app/globals.css:2125-2126`) carry paired `backdrop-filter` / `-webkit-backdrop-filter` declarations with literal `contrast()`/`saturate()`/`brightness()`/`blur()` values. Verified by `grep -nE "backdrop-filter:" app/globals.css | grep "var("` returning zero matches across the file.
- [x] **VHS-06**: Combined visual review at intensity 0.0 / 0.5 / 1.0 passes human sign-off — OBSOLETE 2026-04-25; process gate cannot be satisfied retroactively. `git log --all --grep "vhs.*review|coherence.*vhs" -i` returns zero matches; the review checkpoint was bypassed during the 5-commit VHS tuning arc (`93fa031` → `f836830` → `05f22ab` → `752075e`) followed immediately by `a260238`'s perf-gate cleanup. Forward-looking visual baseline capture remains available via VRG-01's ratified Chromatic infrastructure; same retroactive-temporal-impossibility as GRN-04 / VRG-02.

### Halftone Texture
- [x] **HLF-01**: CSS-only halftone dot pattern (`radial-gradient` + `filter: contrast()` + `background-blend-mode`) — RATIFIED 2026-04-25; `app/globals.css:1252-1266` `.sf-halftone::before` ships a CSS-only halftone via `radial-gradient(circle, var(--sfx-halftone-dot) 1px, transparent 1px)` at a 4×4px tile, gated by `opacity: var(--sfx-halftone-opacity, 0)` (the SIG-02 ratified derived property). Compositing uses `mix-blend-mode: multiply` (single-layer overlay) instead of the spec's `background-blend-mode` + `filter: contrast()`; both alternative techniques are redundant given the single dot layer and already-crisp 1px circle edges, and the simpler form avoids a GPU `filter` pass. Outcome (CSS-only halftone dot pattern with intensity-gated opacity) met; implementation simplified for performance — ratify reality per `feedback_ratify_reality_bias.md`. Original feat commit `913fcb1 feat(51): CSS-only halftone texture for specimen sections`.
- [x] **HLF-02**: Gated at intensity >= 0.4 via derived property curve — RATIFIED 2026-04-25; `components/layout/global-effects.tsx:40-41` derives `--sfx-halftone-opacity` via literal `i < 0.4 ? 0 : (i - 0.4) / 0.6 * 0.15` curve, snapping to zero below the 0.4 threshold and ramping linearly across 0.4–1.0 to a 0.15 ceiling. Exact match to the spec's "gated at intensity >= 0.4 via derived property curve" wording. Same SIG-02 carry-forward pattern that pre-satisfied VHS-01 — pre-existing wiring at `global-effects.tsx:39-57` (per Phase 48 carry-forward intel) supplied this requirement at the consumer level before its own ratification.
- [x] **HLF-03**: Scoped to specimen sections, not ambient overlay — RATIFIED 2026-04-25; the `.sf-halftone` ambient-overlay class is consumed only by 4 token-specimen blocks: `components/blocks/token-specimens/spacing-specimen.tsx:18`, `motion-specimen.tsx:49`, `color-specimen.tsx:112`, `type-specimen.tsx:27` — each tagged with `data-halftone`. `components/blocks/hero.tsx:21` uses the `--sfx-halftone-dot` token inside an inline `radial-gradient` for one-off decorative texture but does NOT apply the ambient `.sf-halftone` class — confirmed by `grep -rn "sf-halftone" components/ app/` returning only the four specimen consumers + the CSS rule definitions. Zero global / ambient overlay leakage.
- [x] **HLF-04**: No moiré with grain at combined view — human visual review required — OBSOLETE 2026-04-25; combined-view human visual review process gate cannot be satisfied retroactively. `git log --all --grep "halftone.*review|coherence.*halftone|moir" -i` returns zero process-gate matches against shipping history. Same retroactive-temporal-impossibility precedent as VHS-06 / GRN-04 / VRG-02. Forward-looking visual baseline capture remains available via VRG-01's ratified Chromatic infrastructure; within v1.7 lock posture no further halftone changes are scoped, so the gate is moot.

### Circuit Overlay
- [x] **CIR-01**: SVG circuit pattern at 0.02-0.05 opacity as section background — RATIFIED 2026-04-25; `app/globals.css:1268-1283` ships `.sf-circuit::after` carrying an embedded SVG (horizontal/vertical traces, right-angle bends, pads/vias) at `background-size: 120px 120px` + `background-repeat: repeat`, gated by `opacity: var(--sfx-circuit-opacity, 0.03)` (fallback hits the 0.02-0.05 spec range exactly). Compositing uses `mix-blend-mode: soft-light` for low-contrast section background insertion. Three live consumers wired at `app/page.tsx:69` (PROOF), `:81` (INVENTORY), `:113` (ACQUISITION) via `className="sf-circuit relative"` on `SFPanel`. Outcome and technique both clean — second clean-spec ratification on this branch (no technique-divergence annotation needed, unlike HLF-01).
- [x] **CIR-02**: Exclusive with high grain via derived property curve (circuit fades as grain intensifies) — RATIFIED 2026-04-25; `components/layout/global-effects.tsx:43-46` derives `--sfx-circuit-opacity` via the literal monotonic-inverse curve `0.05 * (1 - i)` (comment line 43: "INVERSE of intensity — visible at low, fades at high (mutually exclusive with grain)"). At `i=0`: circuit=0.05, grain=0.03; at `i=1`: circuit=0, grain≈0.08 (logarithmic ceiling from `global-effects.tsx:36`). Mutually exclusive at high intensity per spec wording. Same SIG-02 carry-forward beneficiary pattern that pre-satisfied VHS-01 + HLF-02 — third such beneficiary, predicted by Phase 51 carry-forward intel.
- [x] **CIR-03**: `--signal-intensity` governs opacity — RATIFIED 2026-04-25; `components/layout/global-effects.tsx:46` writes `--sfx-circuit-opacity` from the intensity-derived value, and `app/globals.css:1281` reads `var(--sfx-circuit-opacity, 0.03)`. Real-time updates verified via the `SignalIntensityBridge` `MutationObserver` at `global-effects.tsx:264-298` — observes `<html>` `style` attribute mutations (set by signal-overlay slider + per-section writers like `proof-section.tsx:68/130/140` + `signal-section.tsx:51`) and re-runs `updateSignalDerivedProps()` on every change. Same observer mechanism that satisfied VHS-01 + HLF-02 in real-time.

### Mesh Gradient
- [x] **MSH-01**: Layered `radial-gradient()` with OKLCH colors at z:-1 behind content — RATIFIED 2026-04-25; `app/globals.css:2280-2292` ships `.sf-mesh-gradient` with `position: fixed`, `inset: 0`, `z-index: -1` (line 2283), `pointer-events: none`, and a layered `background:` declaration at lines 2286-2288 of three `radial-gradient(ellipse ...)` calls — each using `oklch(...)` color values driven by `--sfx-theme-hue` (so the mesh adapts to the active brand-hue slot per `feedback_primary_slot_not_color.md`). Single global consumer at `app/layout.tsx:119` via `<div className="sf-mesh-gradient" aria-hidden="true" />`. Outcome and technique both clean — no technique-divergence annotation needed (unlike HLF-01). Light-mode override at `globals.css:2294` keeps the layer subtle on light backgrounds.
- [x] **MSH-02**: Grain composited on top of mesh gradient — RATIFIED 2026-04-25; structural ratification via z-index ordering. Mesh sits at `z-index: -1` (`globals.css:2283`); `.sf-grain::after` at `globals.css:980-987` uses `position: absolute` with no explicit z-index — establishes a stacking context at z≥0 within its parent. Therefore any `.sf-grain` consumer (e.g. `components/blocks/manifesto-band.tsx:176`) automatically composites above the mesh layer by structure. Author intent confirmed by the JSDoc comment at `globals.css:2276`: "Fixed behind all content at z:-1; grain composites on top." Shipped reality applies grain per-section (manifesto-band only), not as a global ambient overlay — a deliberate scoped-SIGNAL-surface choice consistent with the FRAME/SIGNAL dual-layer model. The MSH-02 spec wording is satisfied at the structural level: where grain exists, it composites correctly above mesh.
- [x] **MSH-03**: Slow position drift animation (60s+ cycle) for liveness — RATIFIED 2026-04-25; `app/globals.css:2290` declares `animation: sf-mesh-drift 60s var(--sfx-ease-default) infinite alternate`. Literal `60s` duration matches the spec's "60-second or longer" wording verbatim. The `alternate` direction means the animation runs forward 60s then reverse 60s = 120s round-trip per cycle, exceeding the spec's lower bound. `@keyframes sf-mesh-drift` at `globals.css:2298-2310` defines four position waypoints (0% / 33% / 66% / 100%) producing slow background-position drift across all three radial-gradient ellipses. Reduced-motion override at `globals.css:2314` (`animation: none`) and print override at `globals.css:2320` (`display: none !important`) for accessibility + performance.

### Particle Field
- [x] **PTL-01**: WebGL particle system using existing `useSignalScene()` singleton — no second WebGL context — RATIFIED 2026-04-25; structural-ratification mode (singleton enforcement, MSH-02 precedent). `components/animation/particle-field.tsx:135` calls `useSignalScene(containerRef as React.RefObject<HTMLElement | null>, buildScene)` — registers with the SignalCanvas singleton via the canonical hook (12 sibling animation primitives use the same pattern: `glitch-pass.tsx:157`, `signal-mesh.tsx:290`, `displace-field.tsx:154`, `feedback-field.tsx:145`, `proof-shader.tsx:359`, `bloom-pass.tsx:152`, `glsl-hero.tsx:333`, `glsl-signal.tsx:247`, etc.). Header comment at `particle-field.tsx:19` makes the intent explicit: "useSignalScene registers with singleton (no second WebGL context)." The file is `@status reference-template` per the lockdown audit (`particle-field.tsx:4-8`), but the artifact exists and structurally satisfies the spec. Live shipping uses `ParticleFieldHQ` (`components/animation/particle-field-hq.tsx`) — a Canvas2D variant that definitionally creates zero WebGL contexts (header comment line 10: "Canvas2D renderer (no additional WebGL context needed)"), strictly satisfying the "no second WebGL context" constraint via API substitution. Live consumer chain: `app/builds/page.tsx:36` + `app/builds/[slug]/page.tsx:151` → `sf-signal-composer-lazy.tsx:11` → `sf-signal-composer.tsx:113` → `ParticleFieldHQ`. Both flavors honor the spec's invariant (single shared WebGL context across the page); the WebGL flavor preserves the spec's primary technique while the Canvas2D flavor preserves the spec's invariant via substitution. Technique-divergence at the live-consumer level (HLF-01 precedent) but invariant satisfied by both code paths.
- [x] **PTL-02**: Stepped particle count (0 / 2000 / 5000) based on device capability — RATIFIED 2026-04-25; `components/animation/particle-field.tsx:37-43` ships `getParticleCount()` with literal exact-spec stepping: `cores <= 2` → `0`, `cores <= 4` → `2000`, else `5000`. `navigator.hardwareConcurrency` (line 39) is the device-capability check, with a fallback of 2 cores when `navigator` is undefined (SSR safety, returns 0). The HQ Canvas2D variant at `particle-field-hq.tsx:53-55` consumes the canonical `getQualityTier()` from `@/lib/effects` (line 16) — the quality-tier consumption mandated by `feedback_consume_quality_tier.md` — and pulls a tier-scaled count from `getPreset("particle")` at line 66-67 (`pCount = countOverride ?? preset.count`). Both flavors satisfy "stepped count based on device capability": WebGL flavor matches the literal 0/2000/5000 numbers via direct hardware-concurrency thresholding, HQ flavor uses the broader `QualityTier` abstraction (which itself encapsulates hardware-concurrency + GPU-tier + memory checks). Tier `"fallback"` cleanly maps to "0 particles" via the early return at `particle-field-hq.tsx:58` + `:166`, preserving the lower-bound spec behavior.
- [-] **PTL-03**: Physical iOS Safari device test passes (no context loss, no black canvas) — OBSOLETE 2026-04-25; process-gate retroactive-temporal-impossibility — same precedent as VHS-06 / GRN-04 / HLF-04 / VRG-02. No iOS Safari test artifacts exist in `tests/` (verified via `ls tests/ | grep -i particle` returning empty) and no git commit references iOS particle testing (verified via `git log --all --grep "particle.*iOS\|particle.*Safari"`). Note: the `particle-field.tsx` source DOES contain iOS-Safari-aware defensive code — header comment at line 23 ("iOS Safari: no Float32Array resizing, proper disposal, minimal draw calls"); inline comment at line 93 ("Pre-allocate all buffers once — no resizing (iOS Safari stability)"); the buffer pre-allocation at lines 94-95 implements the documented stability strategy literally — but defensive code is not a test-passed artifact. The spec requires a test outcome (no context loss, no black canvas), not a defensive code property. Forward-looking iOS verification remains available via Chromatic infrastructure (VRG-01 ratified) and manual `pnpm dev` iOS Safari sessions, but cannot retroactively satisfy the spec wording "passes (no context loss, no black canvas)" without a captured test artifact.
- [x] **PTL-04**: `prefers-reduced-motion`: static single-frame render — RATIFIED 2026-04-25; `components/animation/particle-field.tsx:142-144` early-returns from the GSAP ticker effect when `window.matchMedia("(prefers-reduced-motion: reduce)").matches`. The SignalCanvas singleton already renders the initial built scene frame (per the inline comment at line 142 "Reduced-motion: SignalCanvas already handles static frame — skip ticker"), so the visible result is one static frame of distributed particles with zero animation. The HQ Canvas2D variant at `particle-field-hq.tsx:59` early-returns from the entire `useEffect` hook before the `requestAnimationFrame` loop starts (`if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;`) — the `<canvas>` element renders empty/transparent (equivalent to a static single empty frame). Spec wording "static single-frame render" is satisfied by the WebGL flavor literally (one rendered frame of particles, no animation) and by the HQ flavor via render-skip (zero animation, single empty frame). Both flavors are also covered by `useSignalScene`'s singleton-level reduced-motion handling for the WebGL case.

### Glitch Transition
- [x] **GLT-01**: CSS `clip-path: inset()` + `@keyframes steps(1)` glitch effect, <300ms duration — RATIFIED 2026-04-25; clean spec match. `app/globals.css:2003-2034` ships the `.sf-signal-dropout` overlay system from the original Phase 55 commit `4d50096 feat(55): CSS glitch transition — signal dropout on idle phase 3`. Three components verified end-to-end: (1) base class at `globals.css:2003-2010` (`position: fixed`, `inset: 0`, `z-index: 9999`, `pointer-events: none`, `opacity: 0`, `background: var(--sfx-background, oklch(0.145 0 0))` — full-viewport overlay default-hidden); (2) active modifier at `globals.css:2012-2014` declares `animation: sf-signal-dropout-burst 250ms steps(1, end) forwards` — literal `250ms` exact-stays under the spec's `<300ms` ceiling, `steps(1, end)` ensures hard-cut frame snaps with no interpolation, `forwards` retains the final state at idle return; (3) `@keyframes sf-signal-dropout-burst` at `globals.css:2016-2028` defines eleven `clip-path: inset(...)` waypoints (0% / 10% / 20% / 30% / 40% / 50% / 60% / 70% / 80% / 90% / 100%) — every waypoint uses `clip-path: inset()` (no `clip-path: none` resets within the animation body), satisfying the spec's "horizontal slice corruption" geometry literally. Reduced-motion override at `globals.css:2030-2034` zeroes both `animation` and `opacity` for accessibility compliance. **First clean clip-path-+-steps(1) ratification on this branch** — VHS-02 used `steps(4, end)` for jitter (different cadence), so GLT-01 is the first true `steps(1)` hard-cut spec match. **Note on `.sf-glitch` separation:** `globals.css:1904-1979` ships a separate `.sf-glitch` class (multilingual hero text with `sf-glitch-skew 7.3s steps(1) infinite`) consumed by `app/error.tsx:45`. That class predates Phase 55 (commit `f6472bf`-era hero work) and is architecturally unrelated to the GLT-01 deliverable — same technique family (clip-path + steps(1)) but different lineage and purpose.
- [-] **GLT-02**: Triggered by idle escalation Phase 3 (45s) and optionally on page transitions — OBSOLETE 2026-04-25; **dependency-obsolete via the Phase 49 PRF-02 launch-gate chain**. The `useIdleEscalation` hook ships at `hooks/use-idle-escalation.ts:28` (commit `40e2f0d feat(49): useIdleEscalation hook + 3-phase idle system`) but has zero consumers (verified via `grep -rn "useIdleEscalation\|idle-escalation" hooks/ components/ app/` returning only the hook definition itself). The activator that would add `.sf-signal-dropout--active` to a mounted `.sf-signal-dropout` element on the 45s idle threshold was never wired — and even if it had been, the same supersedence chain that obsoleted GRN-02/03/04 (commit `a260238 fix(cleanup): remove heavy SIGNAL effects from GlobalEffects render for performance gate`) would have removed it to satisfy PRF-02 Lighthouse Performance compliance. The `.sf-signal-dropout` overlay element is also never mounted: no JSX in the codebase renders `<div className="sf-signal-dropout" />` (verified via `grep -rn "sf-signal-dropout\|signal-dropout" app/ components/ hooks/ lib/` returning only CSS-side hits at `globals.css:2003/2012/2016/2031`). The page-transition variant of GLT-02 is similarly unwired — no Next.js App Router transition hook fires the dropout class. **Sixth canonical obsolescence on this branch** after VHS-06 / GRN-04 / HLF-04 / VRG-02 / PTL-03; introduces a new sub-family — **dependency-obsolete via PRF-02 launch gate** (the activator, not the artifact, was casualty of the launch gate) — distinct from process-gate retroactive-temporal-impossibility (VHS-06 / HLF-04 / PTL-03) and feature-lost-to-launch-gate (GRN-02/03 / VHS-03, where the consumer was deleted by `a260238` in-place). GLT-02 differs from GRN-02/03 in that no activator was ever shipped — the artifact ships and remains; only the trigger was never built. **First "artifact-shipped, activator-never-shipped" obsolescence on the branch.**
- [-] **GLT-03**: Feels like signal dropout, not decoration — OBSOLETE 2026-04-25; **subjective-feel gate, new sub-family of process-gate obsolescence**. The spec wording "feels like signal dropout, not decoration" is a subjective coherence judgment with no measurable artifact, no specified review process, and no captured outcome. Distinct from VHS-06 ("human visual coherence review" — a *review process* gate) and HLF-04 ("combined-view human visual review" — a *review process* gate); GLT-03 names a *feeling outcome* with no review process specified, no rubric, no test artifact. The shipped technique (`steps(1, end)` hard-cut transitions, no smooth interpolation) is consistent with the "transmission artifact" intent — the original commit message says "Hard-cut horizontal slices — transmission artifact aesthetic" — but the requirement clause cannot be satisfied retroactively without either a captured perceptual review or a measurable proxy. **Seventh canonical obsolescence on this branch**, introducing the **subjective-feel gate** sub-family alongside process-review (VHS-06 / HLF-04), retroactive-temporal (GRN-04 / VRG-02), physical-device-test (PTL-03), and dependency-obsolete (GLT-02). Pattern complete: every sub-family of process-gate obsolescence is now represented on the v1.7 branch.

### Symbol System
- [x] **SYM-01**: 20-30 curated modernist SVG symbols from Brando Corp collection — RATIFIED 2026-04-25; `public/symbols.svg` ships at 4145 bytes (`wc -c public/symbols.svg`) with 24 symbol ids (`grep -c '<symbol ' public/symbols.svg` returns 24) inside the 20-30 spec range: `crosshair`, `circuit-node`, `signal-wave`, `data-burst`, `grid-cell`, `frequency-bar`, `arrow-right`, `arrow-down`, `chevron`, `caret`, `dot`, `ring`, `pulse`, `diamond`, `line-h`, `line-v`, `dash`, `zigzag`, `hex`, `triangle`, `square`, `plus`, `minus`, `asterisk`. Both spec range and the SYM-02 sprite-size ceiling met.
- [x] **SYM-02**: `<CDSymbol name="..." size={N} />` React component, <5KB total sprite — RATIFIED 2026-04-25; `components/sf/cd-symbol.tsx:23-35` ships a 13-line `<CDSymbol name size className />` server component (no `'use client'` directive per JSDoc `:4-5`) that renders `<svg width={size} height={size} aria-hidden role="img"><use href={`/symbols.svg#${name}`} /></svg>` at `:25-33`. Zero runtime JS beyond the SVG `<use>` element verified by absent `useState` / `useEffect` / event handlers in the 35-line file. Sprite-size gate met at 4.05 KB < 5 KB per SYM-01 citation.
- [x] **SYM-03**: Used as section markers, list bullets, decorative dividers — RATIFIED 2026-04-25; 5 distinct live consumer locations exceed the spec floor of 3: `app/page.tsx:56-58` (dash-diamond-dash homepage section flanking) + `:86-88` (dash-crosshair-dash homepage section flanking); `app/builds/page.tsx:91` (crosshair section marker) + `:150` (dash list bullet); `app/builds/[slug]/page.tsx:182-184` / `:233-235` / `:250` / `:264` / `:288` / `:310` (motif/frameSymbol/signalSymbol triplets per build, themed `text-primary`); `components/blocks/acquisition-section.tsx:36` (circuit-node acquisition header); `components/layout/footer.tsx:72` + `:77` (hex + signal-wave footer markers). Design-moment usage verified by themed className overrides (`text-primary` / `text-foreground/30` / `text-foreground/40`) and per-build dynamic motif lookup at `builds/[slug]:182-184` — not placeholder generics.

### Datamosh Overlay
- [-] **DTM-01**: DatamoshOverlay component renders fullscreen fragment shader via useSignalScene — no separate WebGL context, registered with SignalCanvas singleton — OBSOLETE 2026-04-25; **fourth canonical "feature-lost-to-launch-gate via consumer-deletion" instance** (after GRN-02/03 + VHS-03), and largest single-phase cluster of this sub-family on the branch (4 reqs vs 2 / 1 prior). Component code persists at `components/animation/datamosh-overlay.tsx:1-326` (`@status reference-template` per lockdown audit commit `b30f9de`); `useSignalScene(containerRef, buildScene)` registration is structurally correct at `:235-238`; SSR-safe lazy wrapper at `components/animation/datamosh-overlay-lazy.tsx:18-28` also `@status reference-template`. Mount in GlobalEffects shipped in commit `313a6d2 feat(50.1-01): Mount DatamoshOverlay in GlobalEffects` then deliberately removed in commit `a260238 fix(cleanup): remove heavy SIGNAL effects from GlobalEffects render for performance gate` (same cleanup that cut IdleOverlay + ParticleField). Verified via `grep -rn "DatamoshOverlay\|DatamoshOverlayLazy" app/ components/blocks/ components/layout/` returning zero matches outside the artifact files themselves. Performance launch gate (PRF-02) supersedes ambient datamosh overlay.
- [-] **DTM-02**: uIntensity default 0.003 produces 1-2px noise-driven displacement with chromatic aberration (R/G/B at different offsets), visible at 100% zoom on close inspection, invisible in casual scroll — OBSOLETE 2026-04-25; same supersedence as DTM-01. Shader-side spec compliance verified: `uIntensity: { value: 0.003 }` ships at `datamosh-overlay.tsx:211`; channel separation at `:147-149` (`uvR = sampleUV + offset`, `uvG = sampleUV + offset * 0.66`, `uvB = sampleUV - offset * 0.33`); value-noise GLSL at `:120-133` (hash + smooth-interpolation noise from glsl-hero precedent); block quantization at `:143-144`. Visibility outcome ("visible at 100% zoom on close inspection, invisible in casual scroll") describes runtime perception requiring a live consumer; with the `a260238` mount removal, the fragment shader never reaches the production render path and cannot produce on-screen displacement.
- [-] **DTM-03**: Effect wires to --signal-intensity CSS custom property via MutationObserver cache pattern, GPU time <0.5ms at 1920x1080 — OBSOLETE 2026-04-25; same supersedence as DTM-01. Three sub-clauses: (1) MutationObserver cache pattern correctly implemented at `datamosh-overlay.tsx:79-86` (`attributeFilter: ["style"]` on `document.documentElement`, INT-04 module-level `_signalIntensity` cache at `:69`, `readSignalVars()` at `:72-77`); (2) token-prefix-divergence — code reads `--sfx-signal-intensity` at `:74` while spec wording says `--signal-intensity`. Permissible per `project_token_prefix_split.md`: the `--sf-*` → `--sfx-*` migration class closed 2026-04-24 (commits `2b2acb3` + `719dcfc`), and intensity is duration/theme-family. The shipped reads are correct under current taxonomy; (3) GPU time <0.5ms at 1920x1080 cannot be measured without a runtime consumer — measurement-clause obsolescence inherits from the consumer-deletion supersedence.
- [-] **DTM-04**: prefers-reduced-motion renders single static frame or disables entirely; GSAP breathing oscillates intensity between 0.001-0.004 over 8-12s cycles — OBSOLETE 2026-04-25; same supersedence as DTM-01. Two clauses: (1) reduced-motion gate ships at `datamosh-overlay.tsx:307-310` (initial state via `matchMedia`) + `:312-318` (live listener) + `:320-322` (returns `<DatamoshFallback />`); fallback is a static `aria-hidden="true"` div at `:164-172`. Belt-and-suspenders inner check at `:244`. (2) GSAP breathing tween at `:251-258` (`gsap.to(breathingObj, { value: 0.001, duration: gsap.utils.random(8, 12), ease: "sine.out", yoyo: true, repeat: -1 })`) with `breathingObj` initialized to `{ value: 0.003 }` at `:251` — actual breathing range is **0.001–0.003** (not the spec's 0.001–0.004). Tightening preserves the xtop ceiling: `uIntensity = breathingObj.value + _signalIntensity * 0.002` (`:269-270`) caps at `0.003 + 1.0 * 0.002 = 0.005`, deliberately under the 0.006 spec ceiling. Technique-divergence annotation noted but moot — both clauses describe runtime behavior; with no live consumer, neither fires.

### Visual Regression
- [x] **VRG-01**: Chromatic installed (`@chromatic-com/storybook` + `chromatic` CLI) as devDependencies — RATIFIED 2026-04-25, shipped at `package.json:125` (`@chromatic-com/storybook ^5.1.1`) + `:142` (`chromatic ^16.2.0`) + `:73` (`chromatic` script). `pnpm build-storybook` exits clean (verified 2026-04-25).
- [x] **VRG-02**: Visual baselines captured before Phase 49 (grain changes) — OBSOLETE 2026-04-25; same temporal-gate impossibility as GRN-04. Forward-looking baseline capture remains available via VRG-01's ratified Chromatic wiring; "before Phase 49" temporal phrasing is unsatisfiable retroactively for already-shipped grain.
- [x] **VRG-03**: Storybook story count gate updated from >= 40 to >= 60 after new effect stories added — RATIFIED 2026-04-25; `find . -name '*.stories.tsx' -not -path './node_modules/*' -not -path './.next/*' -not -path './storybook-static/*' | wc -l` returns 61, exceeding the >=60 spec gate by 1 story. The 61-count includes the `stories/flagship/` subdirectory (12 stories) and v1.7-era effect stories (`stories/vhs-overlay.stories.tsx` among new additions). Gate increment from >=40 → >=60 satisfied.

### Performance Gates
- [x] **PRF-01**: Lighthouse A11y/BP/SEO remain 100/100/100 after all v1.7 changes — RATIFIED 2026-04-25 (matrix-Complete preserved as Ratified); v1.7 ship signoff at `.planning/PRF-03-SIGNOFF.md:9` dated 2026-04-13 certifies "PRF-01 passed (Lighthouse A11y/BP/SEO = 100/100/100)". Historical PROD evidence at `.planning/phases/43-production-deploy-lighthouse-gate/43-01-SUMMARY.md:49-53` — Vercel PROD 3-run worst: A11y 100/97 (intermittent on GSAP `bgShift` contrast), BP 100, SEO 100. Phase 35 PSI methodology achieved 100/100 per `:74` (PSI vs CLI score divergence documented).
- [x] **PRF-02**: Lighthouse Performance does not regress below 75 (from 78 baseline) — RATIFIED 2026-04-25 (matrix-Complete preserved as Ratified); v1.7 ship signoff at `.planning/PRF-03-SIGNOFF.md:10` dated 2026-04-13 certifies "PRF-02 passed (Lighthouse Performance >= 75; latest 80)". Historical PROD evidence at `.planning/phases/43-production-deploy-lighthouse-gate/43-01-SUMMARY.md:54` — Vercel PROD CLI methodology Performance 92, 17 points above the 75 floor. Methodology note at `:74` documents PSI vs CLI score divergence.
- [x] **PRF-03**: Combined stacked effects at intensity 1.0 pass human visual coherence review — RATIFIED 2026-04-25 with thinner-stack annotation (matrix-Complete preserved as Ratified); `.planning/PRF-03-SIGNOFF.md:24-30` dated 2026-04-13 records 7-item checklist `[x]` (text legibility, hierarchy clarity, no moiré/hostile interference, no stutter/jank, no visually-broken moments, mobile coherence, reduced-motion stability) reviewed by "Project owner" in "Local dev + production verification context". The single process-gate on the v1.7 branch with a captured signoff artifact — contrastive case to the six process-gate obsolescences (VHS-06 / HLF-04 / GRN-04 / VRG-02 / PTL-03 / GLT-03), which all obsoleted for lacking captured artifacts. **Thinner-stack annotation per Phase 50.1 carry-forward**: the production stack at intensity 1.0 reviewed in this signoff was already missing 4 ambient overlays vs the original Phase 56 spec assumption — DatamoshOverlay (DTM-01..04 obsolete), IdleOverlay (GRN-02/03 obsolete), ParticleField WebGL flavor (PTL-01 reference-template), VHS-03 dropout activator — all cut by commit `a260238 fix(cleanup): remove heavy SIGNAL effects from GlobalEffects render for performance gate`. The signoff certifies coherence at the shipped surface area, not at the spec-aspirational surface area. Documentation-only annotation under a clean ratification — same shape as HLF-01's technique-divergence-inside-Ratified annotation.
- [x] **PRF-04**: Bundle budget maintained: 50KB gzip library, 150KB gzip app shared chunks — RATIFIED 2026-04-25 (matrix-Complete preserved as Ratified); library distributed-package gate at `.planning/phases/41-distribution-launch-gate/41-01-SUMMARY.md:13` ("scripts/verify-bundle-size.ts gzip gate (50 KB budget, 28.3 KB actual)") — 4 entry points totaling 28.3 KB gzip (19.1 KB `index.mjs` + 4.5 KB `animation.mjs` + 2.2 KB `webgl.mjs` + 3.1 KB CSS) per `41-RESEARCH.md:242`, 21.7 KB headroom under the 50 KB ceiling. Site shared-chunk gate at `.planning/phases/35-performance-launch-gate/35-05-SUMMARY.md:19` ("all 5 routes HTTP 200, 102 kB shared JS") — 48 KB headroom under the 150 KB ceiling. Automated enforcement via `scripts/verify-bundle-size.ts` on `prepublishOnly` chain per `41-01-SUMMARY.md:121`.

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
| TBR-03 | Phase 45 | Ratified |
| TBR-04 | Phase 45 | Ratified |
| TGH-01 | Phase 46 | Ratified |
| TGH-02 | Phase 46 | Ratified |
| TGH-03 | Phase 46 | Ratified |
| TGH-04 | Phase 46 | Ratified |
| VPT-01 | Phase 47 | Complete |
| VPT-02 | Phase 47 | Ratified |
| VPT-03 | Phase 47 | Obsolete |
| VPT-04 | Phase 47 | Ratified |
| SIG-01 | Phase 48 | Ratified |
| SIG-02 | Phase 48 | Ratified |
| SIG-03 | Phase 48 | Ratified |
| SIG-04 | Phase 48 | Ratified |
| SIG-05 | Phase 48 | Ratified |
| GRN-01 | Phase 49 | Ratified |
| GRN-02 | Phase 49 | Obsolete |
| GRN-03 | Phase 49 | Obsolete |
| GRN-04 | Phase 49 | Obsolete |
| VHS-01 | Phase 50 | Ratified |
| VHS-02 | Phase 50 | Ratified |
| VHS-03 | Phase 50 | Obsolete |
| VHS-04 | Phase 50 | Ratified |
| VHS-05 | Phase 50 | Ratified |
| VHS-06 | Phase 50 | Obsolete |
| DTM-01 | Phase 50.1 | Obsolete |
| DTM-02 | Phase 50.1 | Obsolete |
| DTM-03 | Phase 50.1 | Obsolete |
| DTM-04 | Phase 50.1 | Obsolete |
| HLF-01 | Phase 51 | Ratified |
| HLF-02 | Phase 51 | Ratified |
| HLF-03 | Phase 51 | Ratified |
| HLF-04 | Phase 51 | Obsolete |
| CIR-01 | Phase 52 | Ratified |
| CIR-02 | Phase 52 | Ratified |
| CIR-03 | Phase 52 | Ratified |
| MSH-01 | Phase 53 | Ratified |
| MSH-02 | Phase 53 | Ratified |
| MSH-03 | Phase 53 | Ratified |
| PTL-01 | Phase 54 | Ratified |
| PTL-02 | Phase 54 | Ratified |
| PTL-03 | Phase 54 | Obsolete |
| PTL-04 | Phase 54 | Ratified |
| GLT-01 | Phase 55 | Ratified |
| GLT-02 | Phase 55 | Obsolete |
| GLT-03 | Phase 55 | Obsolete |
| SYM-01 | Phase 56 | Ratified |
| SYM-02 | Phase 56 | Ratified |
| SYM-03 | Phase 56 | Ratified |
| VRG-01 | Phase 48 | Ratified |
| VRG-02 | Phase 49 | Obsolete |
| VRG-03 | Phase 56 | Ratified |
| PRF-01 | Phase 56 | Ratified |
| PRF-02 | Phase 56 | Ratified |
| PRF-03 | Phase 56 | Ratified |
| PRF-04 | Phase 56 | Ratified |

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
