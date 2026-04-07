---
phase: 16-infrastructure-baseline
plan: 01
subsystem: infra
tags: [shadcn, baseline, bundle-analysis, performance, component-install]

requires: []
provides:
  - "7 shadcn base components for v1.3 SF wrapping (accordion, alert-dialog, avatar, navigation-menu, progress, collapsible, toggle-group)"
  - "Performance baseline captured in BASELINE.md (103 KB shared bundle)"
  - "rounded-* audit for all 7 bases (18 overrides documented)"
  - "'use client' directive map for all 7 bases"
affects: [17-p1-non-animated, 18-p1-animated, 19-p2-components]

tech-stack:
  added: []
  patterns:
    - "shadcn 4.1.2 radix-nova style with unified radix-ui import pattern"
    - "Bundle regression protocol: ANALYZE=true pnpm build after each P1 component"

key-files:
  created:
    - components/ui/accordion.tsx
    - components/ui/alert-dialog.tsx
    - components/ui/avatar.tsx
    - components/ui/navigation-menu.tsx
    - components/ui/progress.tsx
    - components/ui/collapsible.tsx
    - components/ui/toggle-group.tsx
    - .planning/phases/16-infrastructure-baseline/BASELINE.md
  modified:
    - components.json

key-decisions:
  - "components.json registries require @ prefix in shadcn 4.1.2 — fixed from signalframe to @signalframe"
  - "Bundle gate metric is shared JS (103 KB), not per-route First Load JS (varies 103-264 KB)"
  - "Lighthouse CLI headless numbers are NOT representative of production — use browser DevTools for accurate measurement"

requirements_completed: [INFRA-02]

duration: 8min
completed: 2026-04-06
---

# Phase 16 Plan 01: Install shadcn Bases and Capture Performance Baseline

**One-liner:** 7 Radix shadcn bases installed with 103 KB shared bundle baseline and 18 rounded-* overrides documented for SF wrapper authors.

## What Was Done

### Task 1: Install 7 shadcn base components and verify build
Installed accordion, alert-dialog, avatar, navigation-menu, progress, collapsible, and toggle-group via `pnpm dlx shadcn@4.1.2 add`. Fixed components.json registries format (shadcn 4.1.2 requires `@` prefix on registry names). Reverted shadcn init side-effects on globals.css and layout.tsx. Verified tsc --noEmit clean and pnpm build succeeds.

**Commit:** `3be0f55`

### Task 2: Capture numbered performance baseline
Ran `ANALYZE=true pnpm build` for bundle analysis. Ran Lighthouse CLI against `pnpm start` for performance metrics. Created BASELINE.md with all measured values, shadcn audit tables, and regression protocol.

**Commit:** `efb2858`

## Key Findings

### 'use client' Status (6/7 are client components)
- **Client:** accordion, alert-dialog, avatar, progress, collapsible, toggle-group
- **Server:** navigation-menu (unexpected — no 'use client' directive)

### rounded-* Audit (18 overrides needed across 6 components)
- **avatar.tsx:** 6 instances (rounded-full on Root, Image, Fallback, Badge, GroupCount, after pseudo)
- **navigation-menu.tsx:** 5 instances (rounded-lg on Trigger, Content, Viewport, Link; rounded-tl-sm on arrow)
- **toggle-group.tsx:** 2 instances (rounded-lg on Root, rounded-md on Item)
- **alert-dialog.tsx:** 3 instances (rounded-xl on Content, rounded-b-xl on Footer, rounded-md on Icon)
- **accordion.tsx:** 1 instance (rounded-lg on Item)
- **progress.tsx:** 1 instance (rounded-full on Root)
- **collapsible.tsx:** 0 instances (no overrides needed)

### Bundle Metrics
- Shared JS: 103 KB (well within 150 KB gate)
- Homepage First Load: 264 KB (includes Three.js async chunks)
- Lighthouse CLI (headless): 88/100 performance, 3.8s LCP, 4.6s TTI

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed components.json registries format**
- **Found during:** Task 1
- **Issue:** shadcn 4.1.2 requires registry names prefixed with `@` (e.g., `@signalframe`). The existing `signalframe` key caused "Invalid configuration" errors on every `shadcn add` command.
- **Fix:** Renamed registry key from `signalframe` to `@signalframe` in components.json
- **Files modified:** components.json
- **Commit:** 3be0f55

**2. [Rule 3 - Blocking] Reverted shadcn init side-effects**
- **Found during:** Task 1
- **Issue:** Running `shadcn init` to fix the config also injected duplicate color tokens into globals.css, added Geist font to layout.tsx, and modified lib/utils.ts. These changes would break the existing token system.
- **Fix:** Reverted globals.css, layout.tsx, and lib/utils.ts via `git checkout`
- **Files modified:** None (reverted)
- **Commit:** N/A (prevention, not fix)

## Commits

| # | Hash | Message |
|---|------|---------|
| 1 | 3be0f55 | feat(16-01): install 7 shadcn base components for v1.3 |
| 2 | efb2858 | docs(16-01): capture performance baseline for v1.3 expansion |

## Self-Check: PASSED

All 8 created files verified present. Both commits (3be0f55, efb2858) verified in git log.
