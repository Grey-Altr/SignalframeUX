# Phase 60: LCP Element Repositioning - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-26
**Phase:** 60-lcp-element-repositioning
**Areas discussed:** Per-viewport pairing, Mobile intervention pick, Desktop intervention pick, Real-device gate cadence + AES-03 cohort review

---

## Gray-Area Selection

**Question:** Which areas do you want to discuss for Phase 60?

| Option | Description | Selected |
|--------|-------------|----------|
| Per-viewport pairing | How many interventions ship and how they're paired | ✓ |
| Mobile intervention pick | Choose between candidates (a)/(b) for mobile LCP target | ✓ |
| Desktop intervention pick | Choose between candidates (a)/(c) for desktop LCP target | ✓ |
| Real-device gate cadence | When does VRF-04 mid-milestone check fire? | ✓ |

**User's choice:** All four areas selected (multiSelect).

---

## Area 1 — Per-viewport pairing

### Q1: PR/plan structure for Phase 60

| Option | Description | Selected |
|--------|-------------|----------|
| 3 plans: mobile + desktop + scaffolding | CRT-05-style strict bisect, three independent PRs | ✓ (initial) |
| 2 plans: mobile + desktop | Skip scaffolding, faster path | |
| 1 unified plan, 1 PR | Both interventions together; breaks bisect | |
| Phase 60 mobile-only; spin desktop into 60.1 | Aggressive scope tightening | |

**User's choice:** 3 plans: mobile + desktop + scaffolding (Recommended)
**Notes:** This decision was REVISED in Area 3 — desktop reframed to monitor-only, collapsing to 2 plans (scaffolding + mobile). See D-01.

### Q2: Bisect order

| Option | Description | Selected |
|--------|-------------|----------|
| Mobile first, then desktop | Mirrors LCP-01 success-criterion priority | ✓ |
| Desktop first, then mobile | Front-load brand-canonical aesthetic risk | |
| Parallel (waves not strictly serial) | Independent LHCI gates per intervention | |

**User's choice:** Mobile first, then desktop (Recommended)
**Notes:** Moot after Area 3 reframe (desktop = monitor-only, no desktop plan to order).

### Q3: Phase 61 sequencing

| Option | Description | Selected |
|--------|-------------|----------|
| Strict parallel — Phase 60 starts now | Honor ROADMAP's `Phase 60 ⊥ Phase 61` | ✓ |
| Phase 60 first, then Phase 61 | Sequential; cleaner attribution | |
| Phase 61 first, then Phase 60 | Bundle hygiene first; speculative LCP shift risk | |

**User's choice:** Strict parallel — Phase 60 starts now (Recommended)

---

## Area 2 — Mobile intervention pick

### Q1: Mobile LCP-02 candidate

| Option | Description | Selected |
|--------|-------------|----------|
| (b) Ghost-label content-visibility | LEAF-only `content-visibility: auto` + `contain-intrinsic-size` | ✓ |
| (a) THESIS Anton manifesto reveal opacity→clip-path | Broader reveal-mechanism change | |
| Hybrid: (b) + Phase 57 next-candidate proactive | Speculative pre-emption | |

**User's choice:** (b) Ghost-label content-visibility (Recommended) — with preview ASCII confirming the leaf-only edit pattern
**Notes:** Preview accepted: single-file change to `components/animation/ghost-label.tsx` with `containIntrinsicSize` sized to actual rendered dimensions.

### Q2: Post-defer posture

| Option | Description | Selected |
|--------|-------------|----------|
| Reactive — measure first, then plan | Ship (b), measure, follow up only if needed | ✓ |
| Proactive — anticipate next candidate now | Pre-emptively intervene on top 2-3 candidates | |

**User's choice:** Reactive — measure first, then plan (Recommended)

---

## Area 3 — Desktop intervention pick

**Pre-question framing:** Quick file inspection of `entry-section.tsx:193-210` confirmed the desktop LCP element is a separate visible div with `opacity: 0.25` baseline + `mixBlendMode: screen`. Neither candidate (a) (THESIS section) nor candidate (c) (in-h1 chars) directly targets this element. This drove the reframing.

### Q1: Desktop intervention requirement

| Option | Description | Selected |
|--------|-------------|----------|
| Mobile-only — desktop is monitor-only | LCP-01 is mobile-only; desktop synthetic LCP already passes | ✓ |
| Defensive desktop intervention via (c) | Speculative LCP candidate shift | |
| Defensive desktop intervention via (a) | TTI/INP improvement, doesn't target diagnosed element | |
| Apply content-visibility to // overlay (extends mobile pattern) | Would violate LCP-02 verbatim candidate constraint | |

**User's choice:** Mobile-only — desktop is monitor-only (Recommended)
**Notes:** This reframes Area 1 D-01 from 3 plans → 2 plans. Captured as D-05.

### Q2: Scaffolding plan deliverable

| Option | Description | Selected |
|--------|-------------|----------|
| Pre-need LCP candidate analysis script | Reusable for Phase 62 VRF-04 | ✓ |
| LHCI-baseline-rerun + chrome-devtools MCP scroll-test harness | Lighter, snapshot-only | |
| No scaffolding plan — collapse to 1 mobile intervention plan | Tightest scope | |

**User's choice:** Pre-need LCP candidate analysis script (Recommended)

---

## Area 4 — Real-device gate cadence + AES-03 cohort review

### Q1: Phase 60 real-device gate

| Option | Description | Selected |
|--------|-------------|----------|
| In-phase mini real-device check before close | Single WebPageTest run, iPhone 13 Safari, LTE, median-of-5 | ✓ |
| Trust LHCI median + chrome-devtools MCP, defer to Phase 62 strict | Faster, accepts reopen risk | |
| Full VRF-04 matrix inside Phase 60 | Inverts ROADMAP scope, +paid-service dep | |

**User's choice:** In-phase mini real-device check before close (Recommended)

### Q2: AES-03 cohort review owner & format

| Option | Description | Selected |
|--------|-------------|----------|
| Solo via chrome-devtools MCP scroll-test | Fresh-eyes pass next morning, sign-off note in 60-AES03-COHORT.md | ✓ |
| Invited external eye (designer/peer) | Higher signal, scheduling overhead | |
| Defer cohort review framework to Phase 62 | Risks late drift detection | |

**User's choice:** Solo via chrome-devtools MCP scroll-test (Recommended)

---

## Claude's Discretion

- Exact `containIntrinsicSize` value tuning per breakpoint (Plan 02 Wave 0 measurement task)
- Plan 01 LCP-candidates script implementation language (TypeScript spec + node post-processor vs pure Playwright spec)
- Plan 02 commit-split granularity within the single PR
- AES-04 pixel-diff CI integration vs human-review-only for Phase 60

## Deferred Ideas

- Desktop LCP intervention → Phase 60.1 (only if AES-03 cohort or Phase 62 VRF-04 flags desktop regression)
- Adding candidate (d) `content-visibility` on visible `//` overlay → would require ROADMAP/REQUIREMENTS amendment
- Hybrid (b) + proactive next-candidate intervention → revisit only if Plan 02 measurement shows post-defer LCP still >1.0s
- Full VRF-04 multi-device matrix inside Phase 60 → Phase 62
- AES-04 pixel-diff CI gate automation → Phase 58 or Phase 62
- Invited external-eye cohort review → revisit at Phase 62 final-gate audit
