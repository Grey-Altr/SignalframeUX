---
phase: 27-integration-bug-fixes
plan: 01
subsystem: component-grid, signal-overlay, registry
tags: [bug-fix, registry, id-mapping, css-suppression, playwright]
dependency_graph:
  requires: [25-02]
  provides: [correct-detail-panels, overlay-suppression, waveformSignal-docId]
  affects: [app/page.tsx, components/blocks/component-grid.tsx, components/animation/signal-overlay.tsx, lib/component-registry.ts, app/globals.css]
tech_stack:
  added: []
  patterns: [CSS pointer-events suppression via data attribute, stable CSS class on dynamic component]
key_files:
  created:
    - tests/phase-27-integration-bugs.spec.ts
  modified:
    - components/blocks/component-grid.tsx
    - app/page.tsx
    - components/animation/signal-overlay.tsx
    - app/globals.css
    - lib/component-registry.ts
decisions:
  - "PreviewBadge uses intent=outline (not secondary) — SFBadge only has default/primary/outline/signal intents"
  - "pointer-events:none + opacity:0.4 approach for SignalOverlay suppression — no z-index escalation required"
  - "docId waveform -> waveformSignal for registry entry 102 — points to Phase-24 waveformSignal doc entry with correct importPath"
metrics:
  duration: ~8min
  completed: 2026-04-07
  tasks: 3
  files_modified: 5
  files_created: 1
---

# Phase 27 Plan 01: Integration Bug Fixes Summary

Three integration bugs found during v1.4 milestone audit — homepage ID-to-registry mismatch, SignalOverlay not suppressed by detail panel CSS rule, stale docId on WAVEFORM registry entry.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 0 | Create Playwright test stubs (IBF-01/02/03) | 2a56d1a | tests/phase-27-integration-bugs.spec.ts |
| 1 | Fix homepage ID-to-registry mapping (IBF-01) | d2466f4 | components/blocks/component-grid.tsx, app/page.tsx |
| 2 | Suppress SignalOverlay + fix docId (IBF-02/03) | 37fb914 | signal-overlay.tsx, globals.css, component-registry.ts |

## What Was Built

**IBF-01 (ID/registry mismatch):** The homepage COMPONENTS array had sequential IDs (003-012) that didn't match COMPONENT_REGISTRY keys. CARD was "003" but registry uses "005"; WAVEFORM was "012" but registry uses "102". All 10 mismatched IDs corrected. DROPDOWN (no registry entry) replaced by BADGE ("008"). `homepageIds` in page.tsx updated to include 101/102/103/104 for correct shiki pre-computation.

**IBF-02 (SignalOverlay not suppressed):** Toggle button had no stable CSS class selector — only inline Tailwind. Added `signal-overlay-toggle` as first `cn()` argument. CSS rule added to globals.css targeting both toggle and panel under `[data-modal-open]` with `pointer-events: none` and `opacity: 0.4`.

**IBF-03 (stale docId):** Registry entry "102" pointed to `docId: "waveform"` (generic entry without `waveformSignal` importPath). Changed to `docId: "waveformSignal"` to use the Phase-24 doc entry with the correct `@/components/animation/waveform` importPath.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] SFBadge intent="secondary" is invalid**
- **Found during:** Task 1 (tsc --noEmit after COMPONENTS fix)
- **Issue:** Plan spec used `intent="secondary"` in PreviewBadge but SFBadge only accepts `default | primary | outline | signal`
- **Fix:** Changed to `intent="outline"` — next most visually distinct intent after default
- **Files modified:** components/blocks/component-grid.tsx
- **Commit:** d2466f4

## Verification

- `npx tsc --noEmit`: clean (0 errors)
- `pnpm build`: clean, shared bundle 102 kB (gate: 150 kB)
- Old IDs (003/004/011/012 as CARD/MODAL/TABS/WAVEFORM) absent from component-grid.tsx
- Old homepageIds (003/004/011/012) absent from page.tsx
- `signal-overlay-toggle` class present in both signal-overlay.tsx and globals.css
- `docId: "waveformSignal"` confirmed at line 744 of component-registry.ts

## Self-Check: PASSED

All files confirmed present. All task commits verified in git log.
