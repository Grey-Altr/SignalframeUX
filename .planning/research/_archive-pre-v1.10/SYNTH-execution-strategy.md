# SYNTH: Execution Strategy
## SignalframeUX v1.0 "Craft & Feedback"
**Date:** 2026-04-05

---

## 1. The Central Tension

FRAME carries "fast and frictionless." Tokens, primitives, CVA defaults, the barrel export. The addendum governs this absolutely. Every FRAME decision reduces friction. If the system grows, you are doing it wrong.

SIGNAL carries "impressive." ScrambleText, asymmetric hover, hard-cut transitions, cursor detail, scroll choreography. SOTD Creativity dimension (2x weight). Progressive enhancement via data attributes -- silent no-ops when absent. Zero structural complexity added.

"NOT impressive" means: do not pursue impressiveness as a design goal. It emerges from well-constrained FRAME with well-authored SIGNAL on top. Design for frictionless, then express through it. Sequential dependencies, not competing priorities.

---

## 2. Friction-Driven Execution Map

**Concretely:** Build a real section (card grid, stats row) using only SF primitives. Time it. Note every hesitation or guess.

**Predicted frictions:**
1. **Spacing ambiguity.** Blessed stops listed but not enforced. Fix: constrain utilities in globals.css.
2. **Typography guesswork.** No semantic aliases implemented. Fix: `@utility text-heading-1` etc.
3. **Layout token absence.** No `--max-w-content`/`--max-w-wide`. Fix: define in globals.css, wire into SFContainer.
4. **Variant inconsistency.** Mixed `variant`/`intent`, missing `defaultVariants`. Fix: standardize on `intent`, add defaults.
5. **SIGNAL boundary confusion.** No clear import separation. Fix: `sf/` = FRAME, `animation/` = SIGNAL, data attributes bridge them.

Each fix is a token definition, utility constraint, or prop rename. The system gets smaller (fewer valid choices), not larger.

---

## 3. The SOTD Path Through the Addendum

| Addendum Constraint | SOTD Advantage |
|---|---|
| No fake depth/shadows/gradients | Forces the visual language that wins in the industrial SOTD corridor (Darknode, Shift 5). Removing this constraint would produce generic dark SaaS, capping Creativity. |
| Sharp, controlled, slightly tense | IS the DU/TDR aesthetic. Zero direct competitors on Awwwards for a design system site. |
| Speed of implementation | Forces AI DX fluency. Fast page builds = more iteration cycles within the sprint = higher polish. |
| Stability over expansion | Prevents feature creep. "Many effects that don't cohere" loses Creativity points. Restraint > accumulation. |
| Consistency over novelty | Obsessive spacing rhythm is what passes the 30-60s craft gate. Farm Minerals and Studio Dialect won SOTD through consistency, not novelty. |
| Every change must reduce friction | Filters out SOTD-irrelevant work. Nothing wasted = sprint produces SOTD quality. |

---

## 4. What We Actually Build (Scoped)

**Wave 1 -- FRAME Foundation (blocks everything):**
Spacing enforcement, typography aliases, layout tokens, CSS fallback values on all tokens, `defaultVariants` + `intent` standardization, `--vhs-*` to `--sf-vhs-*`.

**Wave 2 -- FRAME Primitives:**
SFContainer, SFSection, SFStack, SFGrid, SFText. CSS fallback ensuring `[data-anim]` elements visible without JS.

**Wave 3 -- SIGNAL Expression:**
ScrambleText on route entry, asymmetric hover (100ms in/400ms out), hard-cut section transitions, staggered grid entry, one signature cursor detail (magenta crosshair).

**Wave 4 -- Above-the-Fold Lock:**
Hero at 1440px: full 100vh, dominant type, motion within 500ms. Resolve component count claim honestly.

**Wave 5 (parallel to 3-4) -- DX Contract:**
Scaffolding spec in CLAUDE.md, per-component JSDoc with usage example.

**Out of scope:** Audio/haptic, `registry.json`, API architecture, new animation effects, print styles, state persistence, component library expansion, WebGL/particles, idle animations.

**Order rationale:** Tokens before primitives (1<2). FRAME before SIGNAL (2<3). SIGNAL before hero lock (3<4). DX parallel.

---

## 5. The Visual QA Protocol

**Measurable checkpoints:**
1. **Spacing:** Zero arbitrary values. Grep codebase -- every Tailwind spacing utility is a blessed stop.
2. **Typography:** Every text element uses semantic alias or scale token. No raw pixel values.
3. **Hierarchy:** Screenshot each section at 25% zoom. H1/H2/body/label must be distinguishable.
4. **Motion coherence:** Record at 0.25x speed. All animations use same easing family, rhythmically consistent stagger.
5. **Lighthouse 100/100:** Hard gate, every deployment.
6. **CLS = 0:** Hard gate, with and without GSAP.
7. **Above-fold:** Screenshot 1440x900. Binary comparison against Darknode/Shift 5/MOB LINKS.

**SIGNAL QA without subjective drift:** Every SIGNAL effect has a spec (chars, timing, easing, duration). QA checks implementation against spec, not whether it "feels right." Unspecced expression does not ship.

---

## 6. Risk Reconciliation

| Tension | Compromise |
|---|---|
| Addendum scopes 6 primitives; SOTD needs multiple distinct sections | Primitives are building blocks; page sections are compositions. Build 6 primitives, compose into enough sections for range. |
| "Short sprint" vs. SOTD polish | 40% time to FRAME (strict sprint, no iteration). 60% to SIGNAL+hero (iteration budget where SOTD is won/lost). |
| "No visual experimentation" vs. Creativity 2x weight | Research already happened. SIGNAL effects are specified. Implementation executes specs, not experiments. |
| 340+ component claim vs. 24 built | Show 24 honestly. Label as "growing." Craft quality > quantity with a skeptical technical audience. |
| DU/TDR niche legibility to international jury | References inform visual language but are never named in UI. Site must stand on "sharp, controlled, intentional" alone. |
| Lighthouse 100 with GSAP + Lenis | Complete 5-tier lazy loading (currently deferred). If 100 is not achievable, cut SIGNAL effects until it is. Performance is a hard gate. |
