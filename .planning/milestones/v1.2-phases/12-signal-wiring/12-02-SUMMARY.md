---
phase: 12-signal-wiring
plan: "02"
subsystem: animation
tags: [signal-motion, scroll-animation, homepage, gsap-scrolltrigger]
completed: "2026-04-06T11:39:30Z"
duration_seconds: 110

dependency_graph:
  requires:
    - "12-01 (signal CSS vars and WebGL bridge — FND-01 prerequisite)"
  provides:
    - "INT-03: SignalMotion wraps at least 3 showcase sections on homepage (4 wrapped)"
  affects:
    - "app/page.tsx — homepage section layout"

tech_stack:
  added: []
  patterns:
    - "Server Component imports Client Component (SignalMotion) — valid RSC boundary"
    - "SignalMotion wraps block child, not SFSection, to preserve data-bg-shift targeting"

key_files:
  created: []
  modified:
    - path: app/page.tsx
      summary: "Added SignalMotion import; wrapped ManifestoBand, DualLayer, CodeSection, ComponentGrid"

decisions:
  - "Wrap block component only (not SFSection) — SFSection carries data-bg-shift which drives GSAP scroll targeting; wrapping it breaks bg-shift timing"
  - "opacity floor at 0.4 (not 0) — content is never invisible for slow scrollers or users who skip the scroll window"
  - "Identical props on all 4 sections (from/to/scrub) — visual consistency across showcase"
  - "HERO and STATS sections intentionally skipped — HERO has GLSL animation, STATS is a data band where motion distracts"

metrics:
  tasks_completed: 1
  tasks_total: 1
  files_modified: 1
  files_created: 0
  lines_added: 13
  lines_removed: 4
requirements_completed: [INT-03]
---

# Phase 12 Plan 02: SignalMotion Homepage Wiring Summary

ScrollTrigger scrub animation (opacity 0.4→1, y 24→0, scrub=1) wired to 4 homepage showcase sections — ManifestoBand, DualLayer, CodeSection, ComponentGrid — via existing SignalMotion component.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Wrap 4 homepage sections with SignalMotion | 05139d3 | app/page.tsx |

## What Was Built

Added `import { SignalMotion } from "@/components/animation/signal-motion"` to `app/page.tsx` and wrapped the block component inside 4 SFSection elements with consistent animation props.

The wrapping pattern:
```tsx
<SFSection label="MANIFESTO" data-bg-shift="black" data-section="manifesto" data-cursor className="py-0 relative overflow-hidden">
  <GhostLabel text="MANIFEST" className="-left-4 top-1/2 -translate-y-1/2" />
  <SignalMotion from={{ opacity: 0.4, y: 24 }} to={{ opacity: 1, y: 0 }} scrub={1}>
    <ManifestoBand />
  </SignalMotion>
</SFSection>
```

GhostLabel is intentionally left outside SignalMotion so the watermark remains static while the content block animates in. SFSection is never wrapped — it carries `data-bg-shift` which GSAP's `applyBgShift` targets by querying `[data-bg-shift]`; wrapping SFSection would nest the trigger inside the scrub boundary and break background palette transitions.

## Acceptance Criteria Verified

- AC-1: `import { SignalMotion }` present in app/page.tsx — confirmed
- AC-2: ManifestoBand, DualLayer, CodeSection, ComponentGrid wrapped with correct props — confirmed (4 occurrences)
- AC-3: SFSection elements NOT wrapped — confirmed (each SignalMotion preceded by GhostLabel)
- AC-4: `grep -c "SignalMotion" app/page.tsx` returns 9 (1 import + 4 open + 4 close) — >= 4 confirmed
- AC-5: `pnpm build` passes with zero errors — confirmed

## Requirements Satisfied

- INT-03: SignalMotion wraps at least 3 showcase sections on homepage — 4 sections wired (exceeds minimum)

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] `app/page.tsx` modified (13 lines added, 4 lines removed)
- [x] Commit 05139d3 exists
- [x] `pnpm build` passed clean
- [x] 4 `<SignalMotion` opening tags confirmed in file
- [x] No SFSection wrapped by SignalMotion

## Self-Check: PASSED
