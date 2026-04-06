# Analyst Brief v2

**Generated:** 2026-04-05
**Milestone:** v1.1 "Generative Surface"
**Interview rounds:** 5
**Dimensions covered:** User Segments, User Journeys, Error States, Edge Cases, Non-Functional Requirements, Integration Points
**Prior brief:** ANL-analyst-brief-v1 (v1.0 "Craft & Feedback") -- findings from v1 are referenced but not repeated

---

## Preamble

v1.1 introduces a fundamental identity shift: SignalframeUX moves from "design system showcase" to "generative technology." This is not incremental polish -- it extends the SIGNAL layer from decorative expression into procedural/generative output (3D meshes, motion graphics, data-driven visuals). Simultaneously, Track 1 activates the showcase as a real consumer of SF primitives and pushes toward SOTD quality.

The risk profile is qualitatively different from v1.0. Where v1.0 risks were about consistency and correctness (token fallbacks, spacing discipline, a11y), v1.1 risks are about scope creep, performance regression, and the tension between generative unpredictability and the FRAME layer's legibility guarantee. The interview surfaced 8 unstated requirements and 7 assumption risks.

---

## Round 1 -- User Segments

**Questions probed:**
- Who evaluates "generative technology" versus "design system showcase"?
- What is the cdOS/CD-Operator consumption model for generative output?
- Is there a client persona for the generative surface?

**Findings:**

The "generative technology" identity potentially shifts the audience beyond v1.0's hiring managers and design engineers. Creative technologists and the creative coding community (Processing, p5.js, Three.js ecosystem) evaluate generative work by different criteria: they look for algorithmic sophistication, parameter space richness, and novel visual territory -- not component API quality or token discipline. If v1.1 is meant to attract this audience, the showcase pages need to expose the "how" (parameters, algorithms, data sources), not just the "what." If the audience remains v1.0's, then "generative" is a capability label, not an audience shift, and the showcase should frame generative output as evidence of engineering depth rather than as standalone creative work.

The cdOS/CD-Operator consumption model for generative artifacts is undefined. If generative output is display-only (canvas/WebGL rendered at runtime), it has no portability. If it needs to travel as exported assets (SVG, video, stills) or as embeddable components, the generative layer needs an output contract: format, resolution, aspect ratio, color space preservation. This is a v1.1 scoping decision that has not been made explicitly.

No client persona is specified, but Culture Division is a studio. If the generative surface eventually produces client-facing output, the parameter space needs guardrails (brand-safe color ranges, content-appropriate motion intensity). Whether this is a v1.1 concern or a future concern should be stated explicitly.

---

## Round 2 -- User Journeys

**Questions probed:**
- What is the authoring journey for a generative visual?
- Where do generative outputs appear in the site?
- What is the performance budget for generative content?

**Findings:**

The authoring model is not specified. There are at least three possible models: (a) hand-coded components in `components/animation/` (extension of current approach), (b) a parametric system where rules are defined and variants are generated, (c) a runtime engine driven by data inputs. Each has radically different implications for the codebase, bundle size, and DX. The current interview context implies model (a) initially, but the language "procedural/generative output" and "data-driven visuals" suggests (b) or (c) are intended eventually. The authoring model must be locked before implementation begins.

The display journey is unclear. hero-mesh.tsx is the current precedent: a full-viewport canvas background element. But "3D meshes, motion graphics, data-driven visuals" implies standalone gallery pieces, not just background textures. If generative output deserves its own pages (e.g., `/work/{piece-name}`), that is a new route structure, new metadata pattern, and new OG image strategy. If it remains embedded in existing pages, it is a SIGNAL layer extension only. The display model determines routing, SEO, and the Awwwards Content scoring dimension.

The performance budget conflict is the hardest unresolved question. The v1.0 quality bar demands page weight < 200KB initial and LCP < 1.0s. Three.js alone is ~150KB gzipped. A single GLSL shader with textures can exceed the entire budget. The generative layer MUST either: (a) be fully lazy-loaded behind initial paint (LCP is measured before lazy content), (b) use lightweight alternatives to Three.js (raw WebGL, OGL at ~25KB, or CSS-only generative techniques), or (c) get an explicit budget exception documented in CLAUDE.md. Option (a) is the safest and preserves the Lighthouse 100/100 target. But if the generative content IS the hero, lazy loading it defeats the purpose.

---

## Round 3 -- Error States

**Questions probed:**
- WebGL/Canvas context failure for generative 3D content
- Data failure for data-driven visuals
- Legibility conflict between generative output and FRAME layer

**Findings:**

WebGL context loss is a real runtime event on mobile and in multi-tab scenarios. The v1 brief flagged this for hero-mesh; v1.1 multiplies the risk surface. Every generative component using WebGL needs a context loss handler and a specified fallback. The fallback options are: (a) static snapshot image (requires build-time capture), (b) CSS-only approximation (requires a design for each piece), (c) graceful hide (remove the element, let FRAME carry the page). Option (c) is the cheapest but means the "generative technology" claim fails precisely when it would be tested. Option (a) is the most robust but requires a snapshot pipeline that does not yet exist.

If "data-driven visuals" means visuals that consume external data (API, CMS, analytics), the data contract must specify: schema shape, freshness window, fallback data, and error display. If data is static JSON bundled at build time, this is low-risk. If data is fetched at runtime, every fetch failure needs a visual fallback that does not break the page layout.

The legibility enforcement problem is the most architecturally significant finding. The FRAME/SIGNAL contract says "Signal layer MUST NOT interfere with usability." But procedural visuals produce unpredictable output by nature. A generative mesh that happens to produce high-contrast patterns behind text, or an animation that creates motion-sickness-inducing movement, violates the contract without any code bug. This requires either: (a) constraining the generative parameter space so outputs are always safe (design-time enforcement), (b) runtime contrast checking against overlaid text (expensive, fragile), or (c) accepting that generative content lives in dedicated zones where no FRAME text overlaps (spatial separation). Option (c) is the most pragmatic but limits where generative content can appear.

---

## Round 4 -- Edge Cases

**Questions probed:**
- CLAUDE.md scope constraint vs. v1.1 expansion intent
- 3D library dependency decision and its consequences
- Data attribute coupling between FRAME, SIGNAL, and generative layers

**Findings:**

CLAUDE.md explicitly says "DO NOT add features, components, or tokens beyond stabilization scope" and "DO NOT expand the component library." v1.1 explicitly intends to expand. This creates a rule conflict that will confuse AI agents working in the codebase. CLAUDE.md must be updated to reflect the v1.1 scope: what is now permitted to expand (SIGNAL layer, generative components, new animation components), what remains frozen (FRAME primitives, token palette, shadcn base), and what the new quality gates are.

The 3D library choice has cascade effects. Three.js (~150KB gz) is the default choice but conflicts with the performance budget. React Three Fiber adds React integration but increases bundle further. OGL (~25KB gz) is lightweight but has a smaller ecosystem. Raw WebGL/GLSL is zero-dependency but requires deep shader knowledge and has no ecosystem tooling. The choice must be made before any generative implementation begins, because it determines: SSR strategy (all are client-only), bundle splitting approach, animation system integration (GSAP vs. requestAnimationFrame), and the skill requirements for future contributors.

The data attribute namespace is getting crowded. Current attributes: `[data-section]`, `[data-section-label]`, `[data-bg-shift]`, `[data-anim]`, `[data-cursor]`. Adding generative components that also read/write data attributes (e.g., `[data-gen-mesh]`, `[data-gen-param]`) increases coupling. A namespace convention should be established: `data-frame-*` for FRAME layer, `data-signal-*` for SIGNAL layer, `data-gen-*` for generative layer. This prevents cross-layer attribute collisions as the system grows.

---

## Round 5 -- Non-Functional Requirements and Integration Points

**Questions probed:**
- Accessibility model for generative 3D/procedural visuals
- SEO/metadata story for generative content as portfolio pieces
- Visual reference integration workflow

**Findings:**

Generative visuals that are purely decorative (background meshes, ambient motion) can be marked `aria-hidden` and exempted from WCAG content requirements. But if any generative piece carries semantic meaning (a data visualization, an interactive configurator that communicates information), it needs alt text, keyboard interaction, and screen reader description. The distinction between "decorative generative" and "semantic generative" must be documented per-component.

If generative pieces deserve their own pages (portfolio entries), they need: dynamic OG images (possibly generated from the same generative system), structured metadata, and meaningful URLs. Next.js `generateMetadata` and `next/og` can handle this, but the OG image for a generative piece is itself a problem -- a static snapshot of a dynamic visual may misrepresent it. The OG image strategy for generative content is a design decision, not just a technical one.

The visual reference workflow ("user will drop references at appropriate stages") is an informal integration point. For it to drive systematic decisions, references should be catalogued in `.planning/design/assets/references/` with a brief noting: what aspect of the reference is relevant (composition, color, motion, texture), what it maps to in the SignalframeUX system, and what constraints it introduces. Without this, references are conversational context that evaporates between sessions.

---

## Unstated Requirements

- [REQ] The authoring model for generative visuals must be defined before implementation: hand-coded components, parametric rule system, or runtime data engine. Each has different codebase and DX implications.
- [REQ] The performance budget for generative content must be explicitly stated. Either: lazy-load all generative content behind initial paint (preserving LCP < 1.0s), use a sub-50KB library (OGL or raw WebGL), or create a documented budget exception.
- [REQ] Every generative component using WebGL/Canvas must have a specified fallback: static snapshot, CSS approximation, or graceful removal. The fallback type must be documented per-component.
- [REQ] CLAUDE.md must be updated to reflect v1.1 scope: what may now expand (SIGNAL layer, generative components), what remains frozen (FRAME primitives, token palette, core 5 colors), and what quality gates apply to new generative work.
- [REQ] Data attribute namespace convention must be established to prevent cross-layer collisions: `data-frame-*`, `data-signal-*`, `data-gen-*` (or equivalent).
- [REQ] The legibility enforcement strategy for generative content overlapping FRAME text must be chosen: constrained parameter space, runtime contrast checking, or spatial separation.
- [REQ] Each generative component must be classified as "decorative" (aria-hidden) or "semantic" (needs alt text, keyboard access, screen reader support).
- [REQ] The cdOS/CD-Operator output contract for generative artifacts must be specified or explicitly deferred: can generative output be exported, and if so, in what format?

---

## Assumption Risks

- [RISK] "Three.js is the obvious choice for 3D" -- Three.js at ~150KB gz may break the performance budget and Lighthouse 100/100 target. The library choice has not been evaluated against the existing constraints. If the wrong library is chosen and deeply integrated, switching cost is very high.
- [RISK] "Generative content can coexist with FRAME legibility" -- The FRAME/SIGNAL contract assumes SIGNAL is controlled. Procedural output is by definition less controlled. If a generative mesh produces high-contrast patterns behind text, the legibility guarantee fails without a bug existing in the code. This tension is architectural, not incidental.
- [RISK] "The 200KB page weight budget still applies" -- If generative content is the value proposition of v1.1, but the budget prevents it from loading with the page, the generative "wow" moment may be invisible during the Awwwards jury's 60-90 second evaluation window (which overlaps with the LCP measurement window).
- [RISK] "CLAUDE.md constraints still apply" -- Multiple CLAUDE.md rules directly conflict with v1.1 goals ("DO NOT expand the component library," "DO NOT add new GSAP effects or animation components"). If not updated, AI agents will refuse to implement v1.1 work or produce confused output that tries to satisfy contradictory constraints.
- [RISK] "The current animation system (GSAP) extends naturally to 3D" -- GSAP animates DOM properties. WebGL/Three.js has its own animation loop (requestAnimationFrame). Mixing two animation systems increases complexity and potential for frame budget conflicts (both competing for the same 16.67ms frame).
- [RISK] "Generative output will look DU/TDR without explicit aesthetic constraints" -- DU/TDR aesthetic is specific: sharp, controlled, structured, slightly tense. Generative/procedural output tends toward organic, flowing, chaotic. Without explicit parameter constraints that enforce the DU/TDR visual language, generative output may drift into generic creative-coding aesthetics that contradict the design philosophy.
- [RISK] "Visual references dropped in conversation will persist as design decisions" -- Conversational context evaporates between sessions. If references are not catalogued and mapped to system decisions, the same aesthetic ground will be relitigated repeatedly.

---

## Edge Cases

- [EDGE] WebGL context loss during Awwwards jury evaluation -- the generative "wow" moment fails precisely when it matters most. Fallback must be visually complete, not a blank canvas.
- [EDGE] Generative component at 320px mobile width -- 3D meshes and complex shaders may exceed mobile GPU budget. Some devices will drop to < 10fps. Must define a mobile rendering strategy (reduce complexity, swap to 2D, or hide).
- [EDGE] Two generative WebGL contexts on the same page -- most mobile browsers limit WebGL contexts to 8-16. If hero-mesh uses one and a new generative component uses another, context eviction may occur silently.
- [EDGE] Generative animation running during page transition -- Lenis smooth scroll + GSAP page transition + WebGL render loop = three systems competing for frame budget. Must define which yields.
- [EDGE] prefers-reduced-motion with generative content -- current coverage is 100% for GSAP animations, but WebGL render loops are not controlled by CSS media queries. Each generative component needs its own reduced-motion implementation.
- [EDGE] Build-time OG image generation for dynamic generative content -- if a generative piece looks different every render, the OG image is necessarily a single frozen moment. Must decide if OG images are hand-curated snapshots or automated captures.
- [EDGE] Hot module reload during generative development -- WebGL contexts, GSAP timelines, and Lenis instances may not clean up properly on HMR, leading to memory leaks and ghost render loops during development.
- [EDGE] Generative content consuming stale or malformed data -- if data-driven visuals fetch from an API that returns unexpected shape, the render may produce visual artifacts rather than a clean error state.
- [EDGE] Theme toggle while generative content is rendering -- WebGL shaders use color values passed as uniforms, not CSS variables. A theme change will update CSS but not shader uniforms until the next render cycle syncs them.
- [EDGE] Safari WebGL compatibility -- Safari's WebGL2 support has historically lagged. If generative content uses WebGL2 features, Safari users (a significant Awwwards jury segment on macOS) may see degraded or broken output.

---

## User Segment Analysis

- [USER] Creative technologist / creative coder -- Evaluates generative work by algorithmic sophistication and visual novelty. Looks for: parameter exposure, novel shader techniques, interesting data mappings. Needs: visibility into the "how," not just the "what." Currently unaddressed: the showcase shows finished output but does not expose the generative system's depth.
- [USER] cdOS consumer (future) -- Needs generative output as portable artifacts: components, exported assets, or embeddable modules. Needs: defined output formats, predictable API surface, documented parameter space. Currently unaddressed: no output/export contract exists.
- [USER] Awwwards jury member (updated from v1) -- The generative layer is now the primary Creativity (2x weight) signal. Jury needs: immediate visual impact from generative content without scroll, evidence this could not have been built with a template. Risk: if generative content loads lazily after LCP, the jury sees the FRAME layer only during their evaluation window.
- [USER] Mobile portfolio browser (updated from v1) -- Mobile GPU constraints are now a harder problem. 3D generative content that runs at 60fps on desktop may run at < 10fps on mobile or fail entirely. Needs: explicit mobile rendering tier that degrades gracefully without looking broken.
- [USER] Future contributor / AI agent -- Must understand: which components are FRAME (frozen), which are SIGNAL (stable), which are generative (active development). Needs: CLAUDE.md updated with v1.1 scope, data-attribute namespace convention, and per-layer expansion rules.

---

## Priority Assessment

| Priority | Item | Rationale |
|----------|------|-----------|
| P0 | Lock the authoring model: hand-coded components, parametric system, or data engine | Every downstream decision (library choice, routing, DX) depends on this. Cannot be deferred. |
| P0 | Choose 3D library (or decide on raw WebGL/shaders) and validate against performance budget | Library choice cascades into bundle strategy, SSR handling, and animation system integration. Wrong choice has high switching cost. |
| P0 | Update CLAUDE.md to reflect v1.1 scope and resolve rule conflicts | AI agents will produce confused or contradictory output if CLAUDE.md still says "do not expand" while v1.1 requires expansion. |
| P0 | Define performance budget for generative content: lazy vs. eager, budget exception vs. lightweight library | The 200KB budget and Lighthouse 100/100 target directly conflict with meaningful generative content. This tension must be resolved, not ignored. |
| P1 | Establish legibility enforcement strategy for generative-over-text scenarios | The FRAME/SIGNAL legibility contract is the system's non-negotiable. Generative content threatens it by nature. Strategy must be chosen before generative content is placed on pages. |
| P1 | Define WebGL fallback strategy per-component (snapshot, CSS approximation, or graceful removal) | WebGL failure during jury evaluation is the worst-case scenario for the Awwwards target. |
| P1 | Establish data-attribute namespace convention across FRAME, SIGNAL, and generative layers | Prevents cross-layer coupling bugs as the system grows. Low cost to implement now, high cost to retrofit later. |
| P1 | Define mobile rendering tier for generative content | Mobile GPU limits make desktop-quality generative content impossible. Without an explicit tier, mobile visitors see broken or slow content. |
| P2 | Catalogue visual references in `.planning/design/assets/references/` with mapping notes | Prevents aesthetic decisions from evaporating between sessions. |
| P2 | Define OG image strategy for generative content (hand-curated vs. automated snapshots) | Matters for discoverability and Awwwards Content scoring, but not blocking for initial implementation. |
| P2 | Specify cdOS/CD-Operator output contract or explicitly defer to v1.2+ | Important for system evolution but not blocking for the showcase milestone. |
| P2 | Classify each generative component as decorative vs. semantic for accessibility | WCAG compliance depends on this classification, but most v1.1 generative content is likely decorative. |

---

## Carryover from v1 Brief

The following v1 findings remain unresolved and are amplified by v1.1 scope:

- **CSS token fallbacks (v1 P0)** -- Still needed. Generative components will also reference tokens.
- **GSAP load failure fallback (v1 P0)** -- Amplified: now WebGL load failure is also a concern.
- **90-second jury moment (v1 P0)** -- Amplified: generative content is now the primary "wow" factor, but may load after the jury's evaluation window.
- **340+ component claim (v1 P0)** -- Still unresolved. Not amplified by v1.1 but still a trust risk.
- **Mobile FRAME layer behavior (v1 P1)** -- Amplified: generative 3D content on mobile is a harder problem than 2D animation on mobile.

---

*Generated by PDE-OS pde-analyst | 2026-04-05*
*Interview rounds: 5 | MECE dimensions: all 6 | Source artifacts reviewed: ANL-v1 + 17 animation/block components + project-context.md + CLAUDE.md*
