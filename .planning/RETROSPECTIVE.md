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

## Milestone: v1.1 — Generative Surface

**Shipped:** 2026-04-06
**Phases:** 4 | **Plans:** 9 | **Sessions:** 1 (autonomous)

### What Was Built
- Singleton WebGL infrastructure (SignalCanvas, useSignalScene, color-resolve with TTL cache)
- Multi-sensory SIGNAL activation: audio (Web Audio square wave 200-800Hz), haptics (Vibration API 5-10ms), idle animation (8s threshold, grain drift, OKLCH lightness ±5% pulse)
- SignalMesh (IcosahedronGeometry + vertex displacement + ScrollTrigger) and TokenViz (Canvas 2D self-depicting visualization)
- GLSL procedural hero shader with FBM noise, geometric grid lines, and integrated Bayer 4×4 ordered dither
- SF layout primitive migration across all 5 pages (32 SFSection instances, zero raw div wrappers)
- SignalMotion scroll-driven wrapper and SignalOverlay live parameter panel

### What Worked
- **Infrastructure-first phasing** — Phase 6 singleton foundation enabled Phases 8-9 to build scenes without infrastructure concerns
- **Parallel execution** — Plans 08-01 and 08-02 ran in parallel (different pages, different technologies), saving ~5 minutes
- **Plan checker blocker catches** — Phase 7 checker caught oscillator debounce missing from code template and build-only verify gap; fixed in one revision cycle
- **Executor memory accumulation** — by Phase 9, executors knew to use pnpm, create 'use client' lazy wrappers, and pass data-bg-shift as spread props without being told

### What Was Inefficient
- **REQUIREMENTS.md checkbox staleness** — Phases 8-9 executors didn't update REQUIREMENTS.md checkboxes, causing audit to flag 8 stale rows. The `phase complete` CLI handles ROADMAP/STATE but not REQUIREMENTS checkbox updates.
- **SignalMotion unused (INT-03)** — Component was planned, built, and verified as existing, but no placement was planned. Requirement satisfied "on paper" but not in production runtime.
- **SignalOverlay one-sided bridge (INT-04)** — CSS vars written but no WebGL consumer reads them. Research and planning assumed the connection would be obvious; it wasn't explicit in any task.

### Patterns Established
- `'use client'` lazy wrapper pattern for all WebGL components (discovered independently by two executors in Phase 8)
- `data-bg-shift="value"` as spread prop (never SFSection's boolean bgShift prop)
- GSAP ticker as sole render driver for Three.js (not setAnimationLoop)
- globalThis singleton pattern for HMR-safe state in signal-canvas.tsx

### Key Lessons
1. **Requirements need explicit consumer/integration tasks** — creating a component doesn't satisfy "component provides X" unless it's wired to a consumer
2. **Infrastructure phases can skip discuss** — Phase 6 correctly bypassed grey areas; all decisions were technical
3. **Single-pass shader design avoids complexity cascades** — combining dither into the hero shader eliminated render target management entirely
4. **Executor memory is genuinely useful by Phase 3+** — accumulated patterns prevent repeated auto-fixes

### Cost Observations
- Model mix: ~15% opus (orchestration), ~85% sonnet (research, planning, execution, verification)
- Sessions: 1 autonomous session
- Notable: 9 plans executed, 2 parallel waves in Phases 8 and 9; plan checker ran 3 times (2 first-pass, 1 revision)

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | 1 | 5 | First autonomous milestone — full discuss→plan→execute pipeline |
| v1.1 | 1 | 4 | Infrastructure-first phasing, parallel execution, executor memory accumulation |

### Cumulative Quality

| Milestone | Validation Checks | Nyquist Compliant | Tech Debt Items |
|-----------|-------------------|-------------------|-----------------|
| v1.0 | 75+ grep checks | 5/5 phases | 12 (audit: 0 blockers, orphaned primitives, [data-cursor] gap) |
| v1.1 | 45+ must-have checks | 0/4 phases (partial) | 5 (2 partial reqs: INT-03 unused, INT-04 one-sided bridge) |

### Top Lessons (Verified Across Milestones)

1. Plan checker iteration catches real blockers — do not skip verification
2. Pre-existing errors compound across phases — fix them first
3. Requirements need explicit consumer/integration tasks — creation ≠ deployment
4. Executor memory accumulates useful patterns by Phase 3+ — reduces auto-fix overhead
