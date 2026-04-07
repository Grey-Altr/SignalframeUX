---
phase: 25-interactive-detail-views-site-integration
plan: 01
subsystem: detail-panel
tags: [component-detail, gsap-animation, next-dynamic, session-state, bundle-gate]
dependency_graph:
  requires: [lib/component-registry.ts, lib/api-docs.ts, lib/code-highlight.ts, hooks/use-session-state.ts, components/sf/index.ts]
  provides: [components/blocks/component-detail.tsx, ComponentsExplorer wired with detail panel]
  affects: [app/components/page.tsx, app/globals.css, hooks/use-session-state.ts]
tech_stack:
  added: []
  patterns: [next/dynamic ssr:false bundle gate, GSAP height tween open/close, SF barrel lookup for variant rendering, shiki server-side pre-computation]
key_files:
  created:
    - components/blocks/component-detail.tsx
  modified:
    - hooks/use-session-state.ts
    - components/blocks/components-explorer.tsx
    - app/components/page.tsx
    - app/globals.css
decisions:
  - "ComponentDetail loaded via next/dynamic with ssr: false keeps it out of shared 102 kB bundle"
  - "ShikiOutput is a dedicated wrapper function for server-generated HTML — documents trust boundary"
  - "handleClose uses closingRef guard to prevent double-close race during GSAP tween"
  - "triggerRefs stored as Record<string, HTMLDivElement | null> keyed by comp.index for O(1) focus return"
  - "highlightedCodeMap pre-computed server-side with Promise.all — zero client JS cost for syntax highlighting"
metrics:
  duration_seconds: 281
  completed_date: "2026-04-07T01:36:21Z"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 4
---

# Phase 25 Plan 01: ComponentDetail Panel + Explorer Wiring Summary

**One-liner:** Inline detail panel with VARIANTS/PROPS/CODE tabs, GSAP height animation, next/dynamic bundle gate, and server-side shiki pre-computation for zero-cost syntax highlighting.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create ComponentDetail panel component | 2cde088 | components/blocks/component-detail.tsx, hooks/use-session-state.ts |
| 2 | Wire ComponentDetail into ComponentsExplorer and page | 62dcf02 | components/blocks/components-explorer.tsx, app/components/page.tsx, app/globals.css |

## What Was Built

### ComponentDetail (components/blocks/component-detail.tsx)

A 'use client' panel component (~280 lines) with:
- 3 tabs: VARIANTS (live SF barrel lookup), PROPS (ComponentDoc table), CODE (shiki HTML + CLI)
- GSAP open animation: fromTo height 0 to scrollHeight over 200ms, clearProps on complete, reduced-motion guard
- GSAP close animation: gsap.to height collapse with onComplete: onClose + focus return
- Escape key handler: document.addEventListener('keydown') with cleanup, triggers close flow
- Copy-to-clipboard: CopyButton with 2000ms COPIED feedback, silent-fail on unavailable API
- data-modal-open: body attribute on mount, removed on cleanup (SI-04 z-index contract)
- DU/TDR aesthetic: zero border-radius, uppercase labels, monospace code, accent active tab
- ShikiOutput: dedicated wrapper for trusted server-generated HTML, documented trust boundary

### SESSION_KEYS update (hooks/use-session-state.ts)

Added DETAIL_OPEN: "sfux.detail.open" — enables session persistence of open component across navigation.

### ComponentsExplorer wiring (components/blocks/components-explorer.tsx)

- next/dynamic import of ComponentDetail with ssr: false, loading: () => null
- openIndex state via useSessionState(DETAIL_OPEN, null) for session persistence
- triggerRefs — Record<string, HTMLDivElement | null> for O(1) focus return by comp.index
- handleCardClick — toggle open/close by index
- Grid cards updated: ref callback, onClick, aria-expanded, cursor-pointer
- ComponentDetailLazy rendered as DOM sibling OUTSIDE gridRef div, BEFORE Detail Hint Bar

### page.tsx (app/components/page.tsx)

- Function made async
- highlight() called server-side for all 34 registry entries via Promise.all
- highlightedCodeMap passed to ComponentsExplorer — zero client JS cost for syntax highlighting

### globals.css (app/globals.css)

- [data-modal-open] .sf-cursor { z-index: var(--z-content); } added after :root block
- Drops canvas cursor (z-500) below content layer (z-10) when detail panel is open

## Acceptance Criteria Status

| AC | Status | Notes |
|----|--------|-------|
| AC-1: Detail panel below grid, 3 tabs | PASS | DOM sibling outside gridRef, VARIANTS/PROPS/CODE |
| AC-2: GSAP height animation, reduced-motion | PASS | fromTo height 0->scrollHeight, 200ms, mediaQuery guard |
| AC-3: Escape closes, focus returns | PASS | document keydown handler, triggerRef.current?.focus() |
| AC-4: Live SF instances on VARIANTS tab | PASS | import * as SF barrel lookup, VariantCard component |
| AC-5: Props table from API_DOCS | PASS | 5 columns: NAME/TYPE/DEFAULT/REQ/DESCRIPTION |
| AC-6: Copy-to-clipboard on CODE tab | PASS | navigator.clipboard.writeText, 2000ms reset |
| AC-7: Layer badge, pattern tier, animation callout | PASS | SFBadge intent, PATTERN X, signal callout |
| AC-8: next/dynamic ssr: false | PASS | Shared bundle 102 kB (gate: 150 kB) |
| AC-9: Session persistence | PASS | useSessionState(DETAIL_OPEN) |
| AC-10: data-modal-open + CSS rule | PASS | body attribute + globals.css rule |
| AC-11: DU/TDR styling | PASS | Zero radius, uppercase, monospace, accent tab |

## Deviations from Plan

None — plan executed exactly as written.

## Build Metrics

- Shared bundle: 102 kB (gate: 150 kB — PASS)
- ComponentDetail: async chunk only (not in shared bundle — PASS)
- pnpm build exit code: 0

## Self-Check: PASSED

- FOUND: components/blocks/component-detail.tsx
- FOUND: hooks/use-session-state.ts (DETAIL_OPEN key present)
- FOUND commit 2cde088 (Task 1)
- FOUND commit 62dcf02 (Task 2)
- Build passes with zero errors
