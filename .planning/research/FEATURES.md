# Feature Research

**Domain:** Awwwards SOTD-level design system showcase site redesign
**Milestone:** v1.5 Redesign — "Designed Artifact"
**Researched:** 2026-04-07
**Confidence:** HIGH (prior SYNTH corpus from Jan–Mar 2026 SOTD scrape + live Awwwards pattern analysis)

---

## Context: What Already Exists (v1.4 Baseline)

SignalframeUX v1.4 shipped:
- 49 SF components, ComponentsExplorer with 6 categories + filter
- Interactive component detail views: VARIANTS / PROPS / CODE tabs
- GLSL procedural hero shader, SignalMesh generative scene, TokenViz canvas visualization
- SignalMotion scroll-driven entrance animations on 4 homepage sections
- Code highlighting via shiki RSC with OKLCH custom theme
- Session persistence, scroll restoration, page transitions

**v1.5 goal:** Transform from a design system docs site into a designed artifact — an SOTD-level statement where the site IS the system demonstration.

---

## What SOTD Winners in This Corridor Actually Do

Evidence from Jan–Mar 2026 Awwwards SOTD corpus (60+ winners, SYNTH-awwwards-patterns.md):

**Above the fold — non-negotiable in every 2026 SOTD winner:**
- Full `100vh` composition. Nothing previews below fold on load.
- One dominant typographic element at 80–200px organizing the first screen.
- Motion begins within 500ms of load completion — no exceptions.
- Single-color identity commitment: accent on first screen = accent on every screen.

**SOTD vs Honorable Mention separator (verified against jury criteria):**
Awwwards weights: Design 40%, Usability 30%, Creativity 20%, Content 10%.
Design system sites (Design System Yellow, Tangerina) consistently land HM. SOTD requires:
1. One signature interaction that makes scrolling stop — not 20 effects, one unforgettable one.
2. Interactive brutalism outperforms static brutalism — cursor interactions or click-triggered state changes.
3. Typography-as-image: sites where type IS the visual score higher than layout-brutalism-only.
4. 60fps through all scroll interactions — Technical score caps the total score if jank appears.
5. Conceptual clarity visible to a 90-second jury: the site demonstrates a concept, not just components.

**What design system sites specifically miss for SOTD:**
Both HM-level design system sites (Extraset, Tangerina, Design System Yellow) use CSS-first reveal patterns, generic clamp() typography, and dropdown filter navigation. None use scroll-as-storytelling, pinned manifesto sections, or typographic specimens that fill the viewport. SFUX has zero direct competitors in the SOTD corridor with DU/TDR aesthetic applied to a design system.

---

## Feature Landscape

### Table Stakes (Jury Evaluates These — Missing Tanks the Score)

Features an SOTD-competitive design system site must demonstrate. Missing these = Honorable Mention ceiling.

| Feature | Why Expected | Complexity | Depends On |
|---------|--------------|------------|------------|
| Full `100vh` above-the-fold composition | Every 2026 SOTD winner — mandatory entry criterion. First screen must be compositionally complete. | LOW | Existing hero layout; needs locking to 100vh with no scroll-preview below |
| Entry motion within 500ms | 0-10s jury evaluation gate. Static above-fold = immediate Creativity cap. | LOW | Existing GLSL hero shader already animates; ensure it fires before scroll |
| Single-color identity across all sections | Accent color drift between sections signals design system immaturity — disqualifying signal | LOW | Token system already constrains this; audit `--color-accent` consistency across sections |
| Staggered grid entry on every content grid | `y:30, opacity:0, stagger:0.1` is the documented minimum for every 2026 SOTD with grid content | LOW | ScrollTrigger batch already partially implemented; extend to all grid contexts |
| Considered hover state on every interactive element | Absent hover states = "craft failure" in jury notes from SYNTH research. Every element. | MEDIUM | Asymmetric hover (100ms in / 400ms out) — already specced in SYNTH-interaction-feedback |
| Zero CLS on scroll entry | Technical score hard cap — layout shift during scroll = score ceiling drops | LOW | GSAP animations must use transforms only; no layout-affecting properties during scroll |
| Mobile as parallel design discipline | SOTD contenders treat mobile intentionally — touch interactions replace hover states | MEDIUM | Existing responsive layout; needs touch-specific interaction design |

### Differentiators (SOTD Territory — These Push Past HM)

Features that distinguish SFUX from design system HM-level competitors and earn Creativity points.

| Feature | Value Proposition | Complexity | Depends On |
|---------|-------------------|------------|------------|
| Scroll-driven typographic manifesto section (200–300vh) | No design system site on Awwwards has used scroll-as-manifesto. The FRAME+SIGNAL concept communicated through the act of scrolling, not text to be read. Locomotion-built SOTDs (Aupale Vodka, Dulcedo) proved wipe+pin+scroll-reveal wins SOTD. | HIGH | GSAP ScrollTrigger `pin:true` + SplitText; Lenis integration; needs dedicated section |
| Interactive FRAME/SIGNAL layer separation demo | Jury can see the architectural concept — FRAME structure remains as SIGNAL is toggled off. Makes conceptual claim legible in 90 seconds. Direct SOTD creativity argument: "one singular authorship detail." | HIGH | Existing `data-anim` + SIGNAL overlay components; needs dedicated interactive section |
| Coded nomenclature catalog (SF//BTN-001 format) | DU catalog language applied to component library. `detund™ informatics` translated to web UI. No Awwwards SOTD has used catalog/release-code visual grammar for a design system. Directly references DU R01–R10 release structure. | MEDIUM | Existing registry metadata (name, version, layer, pattern); needs new catalog surface |
| Specimen-style token visualization (full-viewport) | Token page as type specimen. Color swatches as halftone-printed Pantone references. Spacing scale as architectural section drawing. No design system site presents tokens as designed artifacts. | MEDIUM | TokenViz canvas already exists; needs redesign as specimen sections, not dashboard widgets |
| One signature cursor detail | Magenta crosshair on interactive elements (not blob, not trail). The Lookback (Mar 27, 2026 SOTD) earned its Creativity score with this exact pattern. Must be the single unmistakable authorship moment. | LOW | `quickTo()` cursor tracker already specced in SYNTH-interaction-feedback; implement once |
| Hard-cut section color transitions | Background wipes black→white→black on scroll trigger. ON Energy (Mar 9) and Springs (Mar 8) both won SOTD with scroll-driven color transitions. SFUX version must be sharper than gradient blends — mechanical cut. | MEDIUM | `data-bg-shift` attribute already exists; needs page-level orchestration across v1.5 sections |
| ScrambleText on route entry (completed) | Darknode and Shift 5 both won SOTD with this pattern in the industrial corridor. Character glitch on every route entry — the site "wakes up." Already partially implemented; needs completion. | LOW | GSAP ScrambleText plugin; route change detection |
| FRAME-layer-only fallback demonstrably functional | SOTD jury argument: the structure layer works independently — SIGNAL is additive. Show this explicitly. Reduces-motion compliance demonstrates system maturity. | MEDIUM | `prefers-reduced-motion` CSS already specced; needs explicit demo surface |

### Anti-Features (Common Requests That Hurt the Score)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Aurora / gradient mesh backgrounds | Trending in 2025 | Zero 2026 SOTD winners in the industrial corridor use them. Signals trend-chasing; immediate Creativity score cap. Jury-verified from SYNTH corpus. | True black `oklch(0% 0 0)` dominant field — the DU R08–R10 constraint |
| Glassmorphism on any surface | Modern aesthetic signal | Contrast failure (Usability score) + not present in any Jan–Mar 2026 SOTD winner. Disqualifying in industrial aesthetic. | Sharp-cornered bordered containers with 1px stroke — opacity on bg only if needed |
| 20+ simultaneous SIGNAL effects | "Impressive" accumulation | "Many effects that don't cohere" loses Creativity points in every documented SOTD analysis. The Creativity dimension rewards constraint, not accumulation. | One signature detail + restrained system-wide motion vocabulary |
| Parallax depth > 20px | Depth effect | "Spatial noise, not spatial intelligence" — SYNTH anti-patterns. Vestibular risk on mobile. Technical jank. | 0.95x scroll speed max (barely perceptible) establishes depth without disorientation |
| Particle systems / WebGL particles | Technical showcase | WebGL without conceptual purpose loses Creativity points. Existing GLSL shader and SignalMesh are justified by FRAME+SIGNAL concept; standalone particles are not. | Existing GLSL hero shader stays; no new particle systems |
| Rounded corners on any element | Common softening request | Contradicts core CLAUDE.md constraint + disqualifies from industrial SOTD corridor. Darknode/Shift 5/MOB LINKS: zero radius in all Jan–Mar 2026 industrial corridor winners. | Zero border-radius everywhere — zero exceptions |
| Multiple accent colors per section | Color variety | Single-color identity across all sections is a documented SOTD requirement. Color drift reads as "design system immaturity." | One accent (magenta) for one semantic purpose: interactive state + data highlight |
| Horizontal scroll navigation | Novel interaction | Disrupts linear narrative for a site presenting a system concept. Reduces usability score for users on keyboards/assistive tech. | Vertical scroll with pinned sections achieves equivalent pacing without accessibility cost |
| Storybook integration for live demos | Industry standard | Introduces separate build pipeline with visual identity that fights DU/TDR aesthetic. Documented in v1.4 anti-features with full rationale. | Existing custom explorer with inline renders — maintained from v1.4 |
| MDX prose per section | Narrative documentation | MDX authoring burden + pipeline dependency. The site should demonstrate, not document. | Section text as SIGNAL-layer overlays, read as system output not marketing copy |
| Idle grain / noise texture | DU aesthetic reference | Noise/grain requires analog-media rationale and must be 3–5% opacity max in SOTD winners. Higher = texture that reads as texture, not intent. | Scanline at ≤3% opacity max — DU VHS heritage, not decorative noise |

---

## Feature Dependencies

```
Scroll-driven manifesto section (200–300vh)
    └──requires──> Lenis + ScrollTrigger synchronization (already implemented)
    └──requires──> GSAP SplitText with mask:chars (already available)
    └──requires──> pin:true section scaffold (new: needs dedicated section component)
    └──requires──> FRAME+SIGNAL conceptual content (copywriting — not engineering)

Interactive FRAME/SIGNAL layer demo
    └──requires──> Existing data-anim + SIGNAL overlay architecture
    └──requires──> Toggle mechanism (button or scroll-driven) to disable SIGNAL layer
    └──requires──> Visual before/after that communicates the concept without prose
    └──enhances──> Scroll-driven manifesto (conceptual continuity between sections)

Coded nomenclature catalog (SF//BTN-001)
    └──requires──> Existing registry metadata (name, version, meta.layer, meta.pattern)
    └──requires──> New catalog surface component (replaces or extends ComponentsExplorer)
    └──requires──> Release code format decision: SF//[CAT]-[NNN] (new data, low effort)

Specimen-style token visualization
    └──requires──> Existing TokenViz canvas (needs redesign, not rebuild)
    └──requires──> Section scaffold at full-viewport dimensions
    └──conflicts──> Dashboard/widget-style token page (replace, don't supplement)

Signature cursor detail (magenta crosshair)
    └──requires──> quickTo() implementation (specced, not yet built)
    └──enhances──> Every interactive element on the site
    └──conflicts──> Blob cursors, trail cursors (explicitly excluded)

Hard-cut section color transitions
    └──requires──> data-bg-shift attribute (already exists in system)
    └──requires──> Page-level section orchestration (needs new logic)
    └──conflicts──> Gradient transitions between sections (replace existing smooth blends)

ScrambleText route entry
    └──requires──> GSAP ScrambleText plugin (registered in lib/gsap-plugins.ts)
    └──requires──> Route change detection (Next.js router events)
    └──partially-exists──> Needs completion from partial v1.3 implementation

100vh above-fold composition
    └──requires──> Existing GLSL hero shader (no changes needed)
    └──requires──> Layout audit: confirm no content previews below fold
    └──conflicts──> "Teaser" design patterns showing next-section content
```

### Dependency Notes

- **Manifesto section requires copywriting before engineering**: The section's impact depends entirely on the conceptual clarity of FRAME+SIGNAL text content. Engineering the scroll mechanics without finalized copy is backwards — write content first, then build the scroll container around it.
- **Catalog surface is the largest new component**: SF//BTN-001 format needs both a data decision (release code format) and a new rendering surface. ComponentsExplorer grid is not the right visual register for a catalog — it needs its own section with DU R01–R10 visual grammar.
- **Cursor signature must ship before other SIGNAL details**: It enhances the entire site globally. Implement once as a layout-level component, not per-section.
- **TokenViz redesign replaces, doesn't supplement**: The existing dashboard-widget approach conflicts with the specimen-style goal. Decision: replace the TokenViz section entirely in v1.5, not add to it.

---

## MVP Definition

### Launch With (v1.5 Redesign)

Minimum set that achieves "designed artifact" status and enters SOTD territory.

- [ ] **100vh above-fold lock** — audit and enforce: no content previews below the fold. GLSL hero shader fires entry motion within 500ms. Single dominant type element at 80–200px.
- [ ] **Scroll-driven typographic manifesto section** — 200–300vh pinned section. FRAME+SIGNAL concept communicated through scroll. SplitText char reveal, pin:true, scrub:1. This is the single most differentiating feature vs. all HM-level design system sites.
- [ ] **Signature cursor detail** — magenta crosshair on interactive elements. `quickTo()` implementation. Deployed globally at layout level. One detail, everywhere.
- [ ] **Hard-cut section color transitions** — bg-shift orchestrated across all v1.5 sections. Black→white→black mechanical cuts on scroll. No gradient blends.
- [ ] **ScrambleText route entry** — complete the partial v1.3 implementation. Every route change fires character glitch before content resolves.
- [ ] **Coded nomenclature catalog section** — SF//BTN-001 format. New section with DU release-catalog visual grammar. Registry metadata (already exists) as the data source.
- [ ] **Staggered grid entry on all content grids** — ScrollTrigger batch on ComponentsExplorer and any v1.5 grid sections. `y:30, opacity:0, stagger:0.1, once:true`.
- [ ] **Hover state audit** — every interactive element has asymmetric hover. 100ms in / 400ms out. No exceptions. This is the 30–60s craft gate.

### Add After Validation (v1.5.x)

Features to add once the core redesign passes visual QA.

- [ ] **Interactive FRAME/SIGNAL layer demo** — dedicated section showing SIGNAL-off → SIGNAL-on toggle. Trigger: manifesto section is complete and conceptual framing is established.
- [ ] **Specimen-style token visualization** — full-viewport redesign of TokenViz. Trigger: catalog section is built, token visual language is established.
- [ ] **FRAME-layer-only fallback demo** — `prefers-reduced-motion` explicitly demonstrated. Trigger: all SIGNAL effects finalized.

### Future Consideration (v2+)

- [ ] **Audio layer (Web Audio API synthesis)** — opt-in. Click tones, nav hover synthesis. Out of scope for v1.5; no consumer demand established yet. Specced in SYNTH-interaction-feedback if needed.
- [ ] **Haptic layer (Vibration API)** — Android Chrome only. Silent fail on all other platforms. Defer until mobile experience is validated.
- [ ] **Registry namespace strategy** (`@signalframe/` vs unnamespaced) — relevant when cdOS becomes active consumer.

---

## Feature Prioritization Matrix

| Feature | Jury Value | Implementation Cost | Priority |
|---------|-----------|---------------------|----------|
| 100vh above-fold lock | HIGH — mandatory SOTD gate | LOW | P1 |
| Scroll-driven typographic manifesto | HIGH — zero competitors, SOTD Creativity argument | HIGH | P1 |
| Signature cursor detail (magenta crosshair) | HIGH — documented SOTD "craft moment" | LOW | P1 |
| Hard-cut section color transitions | HIGH — industrial corridor SOTD pattern | MEDIUM | P1 |
| ScrambleText route entry (completion) | HIGH — Darknode/Shift 5 evidence | LOW | P1 |
| Coded nomenclature catalog (SF//BTN-001) | HIGH — unique, no Awwwards precedent | MEDIUM | P1 |
| Staggered grid entry (all grids) | MEDIUM — documented minimum | LOW | P1 |
| Hover state audit (all elements) | MEDIUM — craft gate, not differentiator | LOW | P1 |
| Interactive FRAME/SIGNAL layer demo | HIGH — conceptual SOTD argument | HIGH | P2 |
| Specimen-style token visualization | MEDIUM — differentiator if executed at full-viewport | MEDIUM | P2 |
| FRAME-layer fallback demo | MEDIUM — system maturity signal | MEDIUM | P2 |
| Audio layer | LOW — no current consumer demand | MEDIUM | P3 |
| Haptic layer | LOW — Android Chrome only | LOW | P3 |

**Priority key:**
- P1: Required for v1.5 launch — SOTD submission gate
- P2: Add in v1.5.x — deepens the SOTD argument
- P3: Future consideration — nice-to-have with no current evidence of jury value

---

## Competitor Feature Analysis

| Feature | Design System Yellow (HM) | Tangerina (HM) | Extraset Type Foundry (SOTD) | SFUX v1.5 Approach |
|---------|--------------------------|----------------|------------------------------|---------------------|
| Above-fold composition | CSS clamp typography, sticky header | Floating header, opacity transition | CSS Grid auto-fill, sticky sidebar | 100vh locked, GLSL shader, dominant type at 80–200px |
| Scroll technique | Position sticky | Sticky header on scroll direction | Position sticky | Pinned manifesto section 200–300vh, scrub:1 |
| Color system | Semantic color variables per section | Inter Tight, clamp scaling | Auto-fill grid | Single OKLCH accent, hard-cut transitions |
| Typography approach | Fluid clamp() headings | Fluid clamp() headings | Fluid clamp() headings | DU visual grammar: ~200px headline + 12px uppercase label, mixed scale |
| Component catalog | Grid thumbnails | Grid thumbnails | Swiper carousel, tab system | SF//BTN-001 coded nomenclature, release-catalog visual register |
| Interaction model | Hover transitions, dropdown filters | Opacity transitions | Figure-rollover hover states | ScrambleText on entry, asymmetric hover, magenta crosshair cursor |
| Conceptual frame | Generic documentation | Generic documentation | Font specimen | FRAME+SIGNAL concept demonstrated through scroll behavior |
| SOTD status | Honorable Mention | Honorable Mention | SOTD | Target: SOTD |

---

## Implementation Notes

### Manifesto Section: Structure and Content First

The scroll-driven manifesto section (P1, highest complexity) requires content before engineering. The implementation pattern is established:
- `pin:true` container at 200–300vh
- SplitText with `mask:'chars'` for clip-wrapper reveals
- `scrub:1` for smooth trackpad response
- `revealDelay:0.1` on ScrambleText for tension before payoff

The question is not HOW — it is WHAT. The manifesto text must communicate FRAME+SIGNAL at the word/phrase level, timed to scroll position. Content should be authored as a sequence of scroll-timed reveals, not as continuous prose.

Pattern from Locomotive SOTM case studies: each pinned phrase should stand alone as a complete thought visible at a single scroll position. Not a paragraph that scrolls past — a word or phrase that "arrives" and sits while the user reads it, then advances on the next scroll impulse.

### Coded Nomenclature: Data First, Render Second

The SF//BTN-001 format needs a concrete schema decision before the UI can be built:
- `SF` prefix (system identifier)
- `//` separator (DU release code visual grammar: `DU-R01`)
- `[CAT]` category abbreviation (BTN, CRD, INP, LAY, DSP, NAV — from existing 6 categories)
- `-` separator
- `[NNN]` three-digit index within category (001, 002… in registry order)

Data exists in `registry.json` and `lib/component-registry.ts`. The render surface needs a new catalog section component — the ComponentsExplorer grid does not have the right visual register for this.

### Cursor Signature: One Decision, Site-Wide Effect

The magenta crosshair cursor is the lowest-complexity, highest-impact P1 feature. `quickTo()` creates a reusable setter with built-in smoothing. Implement as:
1. Layout-level component (not per-section)
2. Crosshair SVG with magenta stroke, 1px line weight, ~24px total
3. Magnetic pull ≤8px on interactive elements
4. Disabled on touch devices (pointer:coarse media query)

Reference: The Lookback (Mar 27, 2026 SOTD) earned its craft moment with this exact pattern. SYNTH corpus confirms: one cursor detail, done correctly, locks Creativity points.

### Hard-Cut Color Transitions: Replace Gradient Blends

Existing `data-bg-shift` attribute fires smooth background transitions. v1.5 requires mechanical cuts:
- Gradient transition → immediate color switch at scroll trigger threshold
- Implementation: `onEnter`/`onLeave` callbacks, not scrubbed values
- Timing: 0ms transition-duration on the background-color property during scroll
- Section sequence: dark → light → dark → light (alternating for contrast rhythm)

---

## Sources

- SignalframeUX SYNTH-awwwards-patterns.md — Jan–Mar 2026 SOTD corpus, 60+ winners analyzed (HIGH confidence: prior research, direct Awwwards scrape)
- SignalframeUX SYNTH-design-references.md — DU/TDR visual language, Aristide Benoist, Locomotive, Warp Records (HIGH confidence: direct source scrape)
- SignalframeUX SYNTH-interaction-feedback.md — micro-interaction specs, GSAP techniques, FRAME+SIGNAL interaction model (HIGH confidence: prior research)
- [Awwwards Evaluation System](https://www.awwwards.com/about-evaluation/) — jury criteria weights: Design 40%, Usability 30%, Creativity 20%, Content 10% (HIGH confidence: official source)
- [Utsubo Award-Winning Design Guide](https://www.utsubo.com/blog/award-winning-website-design-guide) — SOTD vs HM separator: one signature interaction, 60fps, mobile intentionality (MEDIUM confidence: verified against SYNTH corpus)
- [Design System Yellow — Awwwards HM](https://www.awwwards.com/sites/design-system-yellow) — design system HM reference (MEDIUM confidence: Awwwards listing)
- [Tangerina Design System — Awwwards HM](https://www.awwwards.com/sites/tangerina-design-system-1) — design system HM reference (MEDIUM confidence: Awwwards listing)
- [Extraset Type Foundry — Awwwards SOTD](https://www.awwwards.com/sites/extraset-type-foundry) — type foundry SOTD pattern reference (MEDIUM confidence: CSS architecture analysis)
- [Power Type Foundry — Awwwards SOTD](https://www.awwwards.com/sites/power-type-foundry-1) — typography SOTD pattern reference (MEDIUM confidence: CSS architecture analysis)
- [Joffrey Spitzer Portfolio — Codrops 2026](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/) — SplitText reveal patterns, Flip layout transitions (HIGH confidence: direct source)
- [GSAP ScrambleText / SplitText Documentation](https://gsap.com) — plugin capabilities and usage patterns (HIGH confidence: official docs)
- [Adrián Gubrica WebGL Case Study — Codrops](https://tympanus.net/codrops/2025/12/05/from-illusions-to-optimization-the-creative-webgl-worlds-of-adrian-gubrica/) — procedural optimization strategy for full-viewport sections (HIGH confidence: direct source)

---

*Feature research for: SignalframeUX v1.5 Redesign — Awwwards SOTD-level designed artifact*
*Researched: 2026-04-07*
*Supersedes: v1.4 FEATURES.md (that file covers component library completion; this file covers redesign features only)*
