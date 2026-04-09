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
- [ ] **SP-04**: `/reference` — API docs styled as technical schematics; monospaced, dense layout
- [x] **SP-05**: All subpages share the redesigned nav (hidden on initial viewport, sticky on scroll) and footer

## Performance

- [ ] **PF-01**: Shared JS bundle remains under 150 KB gzip after all redesign changes
- [ ] **PF-02**: Lighthouse 100/100 on all four categories against deployed URL
- [ ] **PF-03**: LCP < 1.0s on homepage (ENTRY section)
- [x] **PF-04**: CLS = 0 — scroll-driven animations must not cause layout shift
- [x] **PF-05**: No new animation libraries — all motion via GSAP ScrollTrigger (already in stack)
- [x] **PF-06**: prefers-reduced-motion fully functional across all new sections

## Launch Readiness

- [ ] **LR-01**: Awwwards submission package prepared (project description, technologies, screenshots)
- [ ] **LR-02**: Open Graph / social meta tags updated for redesigned site (title, description, preview image)
- [ ] **LR-03**: Vercel production deployment live with no console errors
- [ ] **LR-04**: Mobile responsive across all new sections (tested at 375px, 768px, 1440px)

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| RA-01 | Phase 28 | Pending |
| RA-02 | Phase 28 | Pending |
| RA-03 | Phase 28 | Pending |
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
| TH-01 | Phase 31 | Pending |
| TH-02 | Phase 31 | Pending |
| TH-03 | Phase 31 | Pending |
| TH-04 | Phase 31 | Pending |
| TH-05 | Phase 31 | Pending |
| TH-06 | Phase 31 | Pending |
| SG-01 | Phase 32 | Complete |
| SG-02 | Phase 32 | Complete |
| SG-03 | Phase 32 | Complete |
| SG-04 | Phase 32 | Complete |
| SG-05 | Phase 32 | Complete |
| PR-01 | Phase 32 | Pending |
| PR-02 | Phase 32 | Pending |
| PR-03 | Phase 32 | Pending |
| PR-04 | Phase 32 | Pending |
| PR-05 | Phase 32 | Pending |
| PR-06 | Phase 32 | Pending |
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
| SP-04 | Phase 34 | Pending |
| SP-05 | Phase 34 | Complete |
| PF-01 | Phase 35 | Pending |
| PF-02 | Phase 35 | Pending |
| PF-03 | Phase 35 | Pending |
| LR-01 | Phase 35 | Pending |
| LR-02 | Phase 35 | Pending |
| LR-03 | Phase 35 | Pending |
| LR-04 | Phase 35 | Pending |

---

## Future Requirements (Deferred)

- Audio layer (Web Audio API) — deferred to v2+
- Haptic layer (Vibration API) — deferred to v2+
- Registry namespace strategy — deferred to v2+

## Out of Scope

- React Three Fiber — excluded; R3F's independent rAF loop conflicts with GSAP globalTimeline.timeScale(0)
- ScrollSmoother — excluded; Lenis integration validated at Lighthouse 100/100, migration risk unjustified
- New animation libraries — GSAP + Lenis handle everything
- Aurora/gradient backgrounds — anti-feature per Awwwards SOTD research
- Glassmorphism — anti-feature per DU/TDR aesthetic
- Rounded corners — zero border-radius everywhere (existing constraint)
