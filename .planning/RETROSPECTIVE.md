# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Craft & Feedback

**Shipped:** 2026-04-06
**Phases:** 5 | **Plans:** 14 | **Sessions:** 1 (autonomous)

### What Was Built
- Token system locked and enforced across 115 files (spacing, typography, layout, colors, animation)
- 5 SF layout primitives (SFContainer, SFSection, SFStack, SFGrid, SFText) enforcing tokens by construction
- Full SIGNAL layer: ScrambleText via ScrollTrigger, 100ms/400ms asymmetric hover, 34ms hard-cut transitions, canvas cursor with particle trail, stagger batch
- Hero locked at 1440x900 — sub-500ms first motion, timeline compressed from 6s to 3s
- Crafted error/404 pages as FRAME+SIGNAL moments, 3 empty states as design moments
- DX contract: SCAFFOLDING.md (337 lines), JSDoc 28/28 components, SIGNAL-SPEC.md (259 lines), DX-SPEC.md deferred sketches

### What Worked
- **Autonomous execution** — full 5-phase milestone in a single session with no manual intervention except QA checkpoint and grey area approvals
- **Smart discuss batch tables** — grey area proposals with "Accept all" option kept discuss phases to ~2 minutes each
- **Parallel plan execution** — Wave 1 plans ran simultaneously, cutting execution time roughly in half per phase
- **Plan checker iteration loop** — caught 2 real blockers (missing --space-* tokens, missing empty states) before execution, preventing costly rework
- **Research agents** — identified that PRM-06 was already done and STP-02 was a no-op, saving unnecessary implementation time

### What Was Inefficient
- **SUMMARY.md one-liners empty** — all 14 summaries lacked one-liner frontmatter, making accomplishment extraction manual
- **REQUIREMENTS.md checkboxes not auto-updated** — `phase complete` CLI didn't update checkboxes, requiring a manual sweep
- **Pre-existing TS errors** — `color-cycle-frame.tsx` and `dark-mode-toggle.tsx` blocked build verification in early phases; should have been fixed in a Wave 0 task
- **Nyquist VALIDATION.md commands were stale** — 6 of ~30 grep commands across 5 phases had pattern mismatches (searching for token names instead of literal values)

### Patterns Established
- CVA + forwardRef + cn() + barrel export as canonical SF component pattern (documented in SCAFFOLDING.md)
- `[data-anim]` as the FRAME→SIGNAL bridge attribute
- `sf-no-transition` class for atomic theme switching
- Audit.sh scripts as phase-level verification suites
- SFText variant union type as compile-time enforcement model

### Key Lessons
1. **Fix pre-existing TS errors before milestone execution** — they block build verification in every phase and force deferred-item tracking
2. **Plan checkers pay for themselves** — 2 blocker catches prevented 2 re-execution cycles (estimated 30+ minutes each)
3. **Barrel import discipline must be enforced retroactively** — documenting a rule without migrating existing code creates two-tier imports
4. **Primitives without consumers are debt by definition** — SFSection/SFStack/SFGrid are ready but unexercised; ship consumers in next milestone

### Cost Observations
- Model mix: ~20% opus (orchestration), ~80% sonnet (research, planning, execution, verification)
- Sessions: 1 autonomous session
- Notable: 14 plans executed by parallel sonnet agents — orchestrator stayed lean at ~10-15% context

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 1 | 5 | First autonomous milestone — full discuss→plan→execute pipeline |

### Cumulative Quality

| Milestone | Validation Checks | Nyquist Compliant | Tech Debt Items |
|-----------|-------------------|-------------------|-----------------|
| v1.0 | 75+ grep checks | 5/5 phases | 2 (orphaned primitives, stagger no consumer) |

### Top Lessons (Verified Across Milestones)

1. Plan checker iteration catches real blockers — do not skip verification
2. Pre-existing errors compound across phases — fix them first
