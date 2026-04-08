# Phase 30: Homepage Architecture + ENTRY Section - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-07
**Phase:** 30-homepage-architecture-entry-section
**Areas discussed:** ENTRY composition, Section transitions, Nav reveal, Stub section architecture

---

## ENTRY Composition

| Option | Description | Selected |
|--------|-------------|----------|
| Strip to title + subtitle | Remove CTAs, multilingual text, manifesto copy; relocate stats to ACQUISITION | ✓ |
| Keep CTAs in ENTRY | Preserve navigation links in the hero section | |
| Relocate multilingual text to ENTRY | Keep JFM as SIGNAL-layer detail on the shader | |

**User's choice:** Strip to title + subtitle (Claude's recommendation)
**Notes:** CTAs → ACQUISITION, manifesto copy → THESIS (Phase 31), JFM → deferred. GLSLHero replaces Hero entirely with HTML title overlay.

---

## Section Transitions

| Option | Description | Selected |
|--------|-------------|----------|
| Hard cuts | Zero-gap CSS stacking, bg-shift handles separation | ✓ |
| Scroll-driven reveals | GSAP opacity/clip-path transitions between sections | |
| Minimal divider | Thin horizontal rule or subtle visual break | |

**User's choice:** Hard cuts (Claude's recommendation)
**Notes:** DU/TDR channel-switch aesthetic. CircuitDivider and MarqueeBand removed from page.tsx. Motion budget better spent inside sections.

---

## Nav Reveal

| Option | Description | Selected |
|--------|-------------|----------|
| GSAP ScrollTrigger, hard-cut appear | visibility/opacity toggle at ENTRY boundary, no animation | ✓ |
| CSS IntersectionObserver | Second observation pattern, class-toggle based | |
| GSAP slide-down | Nav slides in from top with tween | |
| GSAP fade-in | Nav fades in gradually | |

**User's choice:** GSAP ScrollTrigger, hard-cut appear (Claude's recommendation)
**Notes:** Consistent with existing animation infra. Hard-cut matches DU aesthetic. visibility:hidden (not display:none) preserves accessibility.

---

## Stub Section Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Real SFSection landmarks with labels | Correct attributes, 100vh min height, monospaced section name centered | ✓ |
| Empty divs | Minimal placeholders with no content | |
| Rich placeholder content | Fake content describing what will go in each section | |

**User's choice:** Real SFSection landmarks with labels (Claude's recommendation)
**Notes:** THESIS stub at 200vh (PinnedSection). Section indicator and bg-shift system preserved. Zero placeholder prose.

---

## Claude's Discretion

- Plan count and boundaries
- ScrollTrigger config details for nav reveal
- HeroMesh removal decision
- Import cleanup strategy
- Test structure

## Deferred Ideas

- JFM multilingual text — potential Phase 34 or v2 return
- "a system you can feel" — absorbed into Phase 31 THESIS
- HeroMesh redundancy — Claude's discretion on removal
