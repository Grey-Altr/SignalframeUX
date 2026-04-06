# Analyst Brief v1

**Generated:** 2026-04-05
**Interview rounds:** 5
**Dimensions covered:** User Segments, User Journeys, Error States, Edge Cases, Non-Functional Requirements, Integration Points

---

## Preamble

This brief was produced through a structured MECE analysis of SignalframeUX v1.0 milestone goals — Foundation, Feeling, Fluency — combined with close reading of 12 existing planning artifacts (BRF, HIG, HND, FLW, CRT v3–v12, SYS usage guide, interaction research). The interview probed five rounds of questioning against gaps identified in those documents. The project has strong design pipeline coverage; the gaps are concentrated in three areas: what "SOTD" actually requires operationally, how the AI DX contract is defined, and what systemic failure modes exist in the dual-layer model at production scale.

---

## Round 1 — User Segments

**Questions probed:**
- Who is the actual Awwwards jury member? What do they look for versus hiring managers?
- Who consumes the system as an AI agent? What does that agent need that a human developer does not?
- Is there a "return visitor" persona? What does the second session look like?

**Findings:**

The project currently treats "design/engineering hiring managers" and "fellow design engineers" as the primary audience. But Awwwards SOTD juries evaluate differently from either of those personas. Jury members are creative directors and agency leads looking for technical ambition, visual distinctiveness, and motion choreography quality — they spend 60–90 seconds per site, not 5 minutes. The current flows are optimized for a 5-minute deliberate evaluation, not a 90-second impression pass.

The "AI coding agent" persona is named in the Fluency pillar but never defined. There is a material difference between "an AI agent reading the docs" and "an AI agent writing components against the API." The second requires token naming predictability, CVA variant schema consistency, and error surfacing that helps the agent self-correct — none of which are explicitly specified anywhere in the planning artifacts.

There is no return visitor persona. The portfolio is designed as a first-impression tool. But design system discovery (Journey 3) typically happens across multiple sessions. If the token explorer, API reference, and component browser are only optimized for first-pass evaluation, repeat visitors will feel the system is shallow.

---

## Round 2 — User Journeys

**Questions probed:**
- What is the 90-second Awwwards jury path? What must they see without scrolling?
- What is the "something broke" path? What does the error state look like at SOTD quality?
- What happens to the FRAME layer when JavaScript is slow or fails?

**Findings:**

The 90-second jury path is unspecified. The homepage narrative arc (J1) assumes 3-second hook via hero, then scroll-driven revelation. But SOTD juries are unlikely to scroll unprompted. The above-the-fold state — hero + immediate visual — carries almost all the weight. The current hero has CRT score 93/100, but "93/100 at our own critique standard" is not the same as "SOTD jury moment." There is no stated answer to: what do you see in the first 800px on a 1440px viewport, and is that enough to win?

The error path (app/error.tsx) has been partially addressed in CRT v12 (role="alert" added), but the error state has no FRAME layer expression. Error pages on SOTD-quality sites are themselves crafted moments. The current error.tsx is functional but unexceptional — which is a visible gap when the rest of the site is high-craft.

The FRAME layer degradation path is not specified. hero-mesh.tsx pauses when offscreen and respects reduced-motion, but there is no explicit handling for: slow JS parse, canvas context failure (e.g., GPU blacklist), or partial hydration. If FRAME elements fail silently, the SIGNAL layer must still look complete. This is a correctness guarantee that is assumed but not documented anywhere.

---

## Round 3 — Error States

**Questions probed:**
- What are the failure modes of the dual-layer model specifically?
- What happens to motion during hydration — is there a FOAC (Flash of Animated Content)?
- What is the token system failure mode? What renders if a CSS custom property is missing?

**Findings:**

The dual-layer model has an undocumented failure mode: FRAME elements that attach to SIGNAL elements via DOM queries (e.g., hero-mesh.tsx anchoring to `[data-anim]`) will silently not animate if the data attribute is absent or renamed. This coupling is fragile. There is no contract specifying which data attributes are load-bearing for the FRAME layer.

FOAC (Flash of Animated Content) is the inverse of FOUC. The inline blocking theme script prevents FOUC (flash of unstyled content), but there is no equivalent guard for animation state. If Lenis or GSAP bundles load slightly late, users may see content in its pre-animation state (opacity 0, translateY offset) for a visible frame before the entrance fires. This is a CLS/perception risk that is distinct from CLS as measured by Chrome.

Token fallback behavior is unspecified. Tailwind v4 `@theme` tokens in globals.css have no declared fallbacks. If a component references `var(--color-primary)` and that token is undefined (e.g., due to a build issue or SSR mismatch), the element renders with no fill/color — which is both a visual regression and a potential contrast failure. No token in the system has a fallback value declared.

---

## Round 4 — Edge Cases

**Questions probed:**
- What does the system look like at 320px width? At 2560px?
- What happens when the component count (340+) is actually rendered in the component browser?
- What is the "empty state" story for the design system showcase when no content is loaded?

**Findings:**

320px behavior is mentioned as a constraint in BRF (no horizontal scroll, no truncated content) but there are no documented decisions about which FRAME elements collapse or simplify at mobile. The hero-mesh canvas, VHS overlay, and horizontal-scroll component all have implicit desktop assumptions. The mobile behavior of each is unstated.

The 340+ component count is a marketing claim in the brief, but the current component browser (components-explorer.tsx) renders actual components from the SF library, which currently contains 24 components (sf/ directory). The gap between "340+ referenced" and "24 implemented" is not addressed in any planning document. If a hiring manager or jury member clicks into the component browser expecting 340 components, this is a trust-breaking moment.

Empty states in the token explorer, component browser, and API explorer are not designed. The SYS usage guide and interaction research define loading states (sf-skeleton, scanline sweep) but not zero-result states (e.g., search with no matches, filter with empty category). Empty states at SOTD quality are not afterthoughts — they are interaction moments that reveal craft.

---

## Round 5 — Non-Functional Requirements and Integration Points

**Questions probed:**
- What does "easy for AI agents" mean in terms of measurable DX contracts?
- How is the SOTD score decomposed? What specific technical criteria does Awwwards use?
- What is the token → component → page composition contract? Is it documented well enough to be followed by someone (or something) that has never seen the system?

**Findings:**

"Fluency" as a pillar has no success criterion. The tagline "as easy as feeling" is evocative but not testable. There is no specification for: what information must be in a component's JSDoc, what prop naming conventions make CVA variants predictable, what token names must follow to be guessable, or what errors an AI agent will most commonly make and how the system should catch them. Without these, "AI DX" remains aspirational.

Awwwards SOTD scoring criteria are not decomposed in any planning document. Based on Awwwards published criteria, the weighted categories are: Design (4x), Usability (3x), Creativity (2x), Content (1x). The project's CRT critique is weighted toward engineering quality and accessibility — legitimate concerns, but not Awwwards-weighted concerns. "Creativity" (2x) is essentially unscored in the current critique framework. The generative FRAME elements are the primary creativity signal, but their quality has not been evaluated against Awwwards benchmarks specifically.

The CLAUDE.md system rules are the primary DX contract for AI agents working in this codebase. They are detailed and disciplined. However, there are gaps: no specification of how new SF components should be scaffolded (what files, what exports, what CVA shape), no spec for what a "well-formed" section block looks like (data attributes, slot structure, animation integration), and no guidance on when to use FRAME elements versus SIGNAL-only components. An AI agent picking up this codebase must infer these from examples rather than following a contract.

---

## Unstated Requirements

- [REQ] The hero viewport state (first 800px at 1440px) must be strong enough to function as a standalone SOTD jury moment without requiring scroll — the current journey assumes scroll engagement that jury members may never perform.
- [REQ] FRAME layer degradation must be graceful and documented: canvas context failure, slow JS parse, and partial hydration must each leave the SIGNAL layer visually complete.
- [REQ] Every token in globals.css must have a declared CSS fallback value to prevent silent visual failures on token resolution errors.
- [REQ] The component browser must either show only what is built (24 components accurately labeled) or commit to a specific plan for closing the gap to the claimed 340+. A visible discrepancy is a trust-breaking moment for the technical audience.
- [REQ] Empty states for the component browser (zero search results), token explorer (no category selected), and API explorer (no item selected) must be designed as first-class interaction moments, not afterthoughts.
- [REQ] The error page (app/error.tsx) must be a crafted moment that expresses the SIGNAL + FRAME aesthetic, not just a functional fallback — on SOTD-quality sites, error states are reviewed by juries too.
- [REQ] The AI DX contract must be made concrete: a scaffolding spec for new SF components (file structure, CVA shape, barrel export pattern, required props, data attributes) that is machine-readable and testable.
- [REQ] Mobile FRAME layer behavior must be explicitly specified: which generative elements collapse to static at mobile widths, and what the static fallback looks like.

---

## Assumption Risks

- [RISK] "The hero is strong enough to win SOTD" — The CRT score is self-assessed; no external benchmark comparison has been made against actual SOTD winners. The current critique framework does not measure the Awwwards Creativity dimension specifically.
- [RISK] "340+ components is a credible claim" — The sf/ directory contains 24 components. If the number refers to a planned library not yet built, or to Radix/shadcn primitives wrapped but not differentiated, this claim may undermine trust with the technical audience the system is specifically targeting.
- [RISK] "An AI agent can pick up SF and produce SOTD-quality output" — This assumes CLAUDE.md rules are sufficient as a DX contract. But CLAUDE.md documents constraints, not affordances. It tells the agent what not to do but gives limited guidance on how to construct something novel within the system.
- [RISK] "The dual-layer model is self-explanatory from the site" — The BRF brief notes this as a known assumption risk. There is no interactive explainer for the Signal/Frame concept built into the current implementation — the dual-layer.tsx block exists, but whether it actually communicates the architecture to a fast-moving jury member is untested.
- [RISK] "Lighthouse 100/100 is achievable with GSAP + Lenis" — GSAP bundles (even with the 5-tier lazy loading system) add meaningful JS parse time. The performance critique scores 93/100 but notes the monolithic GSAP bundle refactor was deferred. "Deferred" may conflict with the 100/100 Lighthouse target.
- [RISK] "The DU/TDR aesthetic is legible to an international jury" — The Awwwards jury is globally distributed. Detroit Underground and The Designers Republic are niche references with strong regional/subcultural associations. The aesthetic may read as "aggressive" or "hard to parse" to evaluators unfamiliar with these references.

---

## Edge Cases

- [EDGE] Component browser with 0 search results — should show a crafted empty state consistent with the DU/TDR industrial aesthetic, not a generic "No results found" message.
- [EDGE] Token explorer with no token category selected (initial state) — must not be a blank panel; initial state is itself a design moment.
- [EDGE] Hero at 320px width — VHS overlay, hero-mesh canvas, and split-headline must all have specified mobile fallbacks; currently inferred but not documented.
- [EDGE] Hero at 2560px (ultrawide) — max-width constraint behavior of the generative canvas must be specified; does the mesh fill the viewport or constrain to content width?
- [EDGE] GSAP load failure (network error, blocked by extension) — all GSAP-dependent entrance animations begin in their pre-animation state (opacity 0). If GSAP fails to load, content is invisible. A CSS fallback for `[data-anim]` elements is required.
- [EDGE] First paint with prefers-reduced-motion: reduce — the reduced-motion coverage map shows 100% coverage, but the visual result of the reduced-motion state has not been QA'd as a standalone experience. Does it look intentional or broken?
- [EDGE] Tab/keyboard navigation through the component browser's filter system — current critique notes keyboard nav is comprehensive, but the filter + search + grid combination creates a complex tab order that has not been explicitly flow-tested.
- [EDGE] Dark/light theme toggle during a GSAP animation — if a user toggles theme mid-entrance, OKLCH color tokens will update but GSAP-interpolated values (set inline) will not. This may produce visible color conflicts for 400–600ms.
- [EDGE] Return visit within same browser session — Lenis scroll state, component browser filters, and token explorer tab state are not persisted. A return visitor starts fresh. Whether this is intentional is undocumented.
- [EDGE] Print media query — no print styles are specified. If a hiring manager prints the page for review, the result is undefined. VHS overlays, mesh backgrounds, and dark base will render unpredictably.

---

## User Segment Analysis

- [USER] Awwwards jury member — Spends 60–90 seconds per site. Evaluates Design (4x weight), Usability (3x), Creativity (2x), Content (1x). Cares deeply about visual ambition and motion choreography. Does not read documentation or copy code. Needs: above-the-fold perfection, motion that creates a genuine "wow" moment, a site that feels like it could not have been made any other way. Currently underserved by the journey optimization.
- [USER] Returning design engineer (second session) — Has seen the hero. Wants to go deep into tokens, component API, and system architecture. Needs: faster access to the token explorer and API reference, persistent filter/tab state, and evidence that the system is more than a visual demo. Currently underserved by the "first impression" optimization.
- [USER] AI coding agent — Needs: predictable token naming, documented CVA variant shapes, scaffolding templates for new components, explicit data-attribute contracts for the FRAME layer, and error messages that surface constraint violations (e.g., "this spacing value is not a blessed stop"). Currently underserved: CLAUDE.md is a constraint document, not an affordance specification.
- [USER] Skeptical technical lead — Is actively looking for reasons not to trust the system. Will check component count claims, TypeScript interface quality, and accessibility guarantees. Needs: honest scope communication, clear distinction between "built" and "planned" components, and evidence of engineering rigor. Currently at risk due to the 340+ component claim gap.
- [USER] Mobile portfolio browser — The PROJECT.md notes "portfolio browsing happens heavily on phones." But the FRAME layer generative elements, VHS overlay, and hero-mesh canvas all carry significant mobile performance risk. There is no specified mobile-first rendering order or performance budget for mobile specifically.

---

## Priority Assessment

| Priority | Item | Rationale |
|----------|------|-----------|
| P0 | Define the 90-second jury moment: what does the above-the-fold state look like at 1440px, and is it SOTD-winning without any scroll? | Every other SOTD aspiration collapses if this is not locked. The current journey assumes scroll engagement that jury members may never perform. |
| P0 | Resolve or retire the 340+ component claim | A trust-breaking discrepancy with a technical audience is worse than an honest "24 components, growing." The claim needs to either be explained (what counts, what is planned) or corrected in the UI. |
| P0 | CSS fallback values on all tokens | Silent token resolution failures can produce invisible elements or contrast failures. This is a correctness issue, not a polish issue. |
| P0 | GSAP load failure fallback: ensure `[data-anim]` elements are visible without JS | Invisible content on GSAP failure violates the progressive enhancement constraint stated in PROJECT.md. |
| P1 | Decompose SOTD Creativity scoring: explicitly evaluate the FRAME layer generative elements against Awwwards published criteria | The current critique scores engineering quality well but does not address the Creativity dimension that carries 2x weight in Awwwards scoring. |
| P1 | Define the AI DX scaffolding contract: what does a new SF component look like, step by step, from file creation to barrel export | "Fluency" as a pillar has no testable success criterion without this. |
| P1 | Design empty states for component browser, token explorer, and API explorer as first-class interaction moments | At SOTD quality, zero-result states are visible and reviewed. |
| P1 | Specify mobile FRAME layer behavior: which elements collapse, what the static fallback looks like, and what the mobile performance budget is | The 320px constraint is stated but the FRAME behavior is inferred, not specified. |
| P2 | Craft the error page as a SIGNAL + FRAME aesthetic moment, not just a functional fallback | On SOTD sites, error states are sometimes the most memorable pages. The current error.tsx is functional but undifferentiated. |
| P2 | Specify and QA the reduced-motion experience as a standalone design, not just a "animations off" fallback | 100% coverage exists, but the visual result has not been evaluated as an intentional experience. |
| P2 | Add print media query styles | Hiring managers sometimes print for review. Undefined print behavior is a minor but visible gap. |
| P2 | Document the theme-toggle-during-animation edge case and add a transition guard | A visible color conflict during 400–600ms of a GSAP entrance is a polish issue but visible to discerning evaluators. |

---

*Generated by PDE-OS pde-analyst | 2026-04-05*
*Interview rounds: 5 | MECE dimensions: all 6 | Source artifacts reviewed: 12*
