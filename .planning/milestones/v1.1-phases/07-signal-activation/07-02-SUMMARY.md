---
phase: 07-signal-activation
plan: 02
subsystem: signal-layer
tags: [idle-animation, gsap-ticker, oklch-pulse, grain-drift, data-cursor, canvas-cursor]
dependency_graph:
  requires: [07-01, 06-01, 06-02]
  provides: [SIG-08-idle-overlay, SIG-09-cursor-activation]
  affects: [components/layout/global-effects.tsx, app/page.tsx, app/components/page.tsx, app/tokens/page.tsx, app/start/page.tsx, app/reference/page.tsx]
tech_stack:
  added: []
  patterns: [gsap-ticker-color-mutation, oklch-regex-null-check, ticker-accumulation-guard, instant-transition-bypass]
key_files:
  created: []
  modified:
    - components/layout/global-effects.tsx
    - app/page.tsx
    - app/components/page.tsx
    - app/tokens/page.tsx
    - app/start/page.tsx
    - app/reference/page.tsx
decisions:
  - "ticker-accumulation-guard: Old ticker is explicitly removed before registering a new one — prevents multiple pulseFn callbacks accumulating across repeated idle cycles"
  - "oklch-null-check: If --color-primary is overridden to a non-OKLCH value, pulse is skipped entirely (grain + overlay still activate) — graceful fallback, no runtime error"
  - "instant-snap-back: el.style.transition = none before removing --active class, restored via requestAnimationFrame — bypasses the glacial opacity transition that would otherwise fade the overlay out slowly"
  - "grain-div-fixed-position: The grain div uses fixed inset-0 to match the overlay bounds — sf-grain-animated::after with inset:-50% and 200% width/height still works correctly on a fixed element"
  - "data-cursor-placement: Explicit per-section placement on data-bg-shift divs + showcase main elements, not at SFSection primitive level — preserves showcase zone intentionality as specified in plan anti-patterns"
metrics:
  duration: "~12 minutes"
  completed_date: "2026-04-05"
  tasks_completed: 2
  files_modified: 6
  commits: 2
requirements_completed: [SIG-08, SIG-09]
---

# Phase 7 Plan 02: SIGNAL Activation — IdleOverlay + data-cursor SUMMARY

IdleOverlay upgraded to 8s threshold with GSAP ticker OKLCH lightness pulse (+/-5% over 4s cycle) and grain drift overlay; `data-cursor` placed on all 6 homepage showcase sections and 4 showcase page main elements.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Upgrade IdleOverlay — 8s, OKLCH pulse, grain drift | 890fc70 | components/layout/global-effects.tsx |
| 2 | Place data-cursor on all showcase sections | 52a9fbf | app/page.tsx, app/components/page.tsx, app/tokens/page.tsx, app/start/page.tsx, app/reference/page.tsx |

## Acceptance Criteria Status

- [x] AC-1: IDLE_TIMEOUT changed from 60_000 to 8_000
- [x] AC-2: GSAP ticker oscillates --color-primary lightness by +/-5% using Math.sin over 4s period
- [x] AC-3: Base value of --color-primary captured at idle activation time via getComputedStyle, not hardcoded
- [x] AC-4: resetIdle removes ticker via gsap.ticker.remove AND restores --color-primary instantly via setProperty
- [x] AC-5: Grain drift overlay activates via sf-grain-animated class toggle on dedicated fixed div
- [x] AC-6: Reduced-motion guard preserved — early return at top of useEffect
- [x] AC-7: app/page.tsx has data-cursor on all 6 data-bg-shift section divs
- [x] AC-8: app/components, tokens, start, reference pages all have data-cursor on main#main-content
- [x] AC-9: pnpm build passes with zero TypeScript errors

## Implementation Notes

### IdleOverlay Architecture

The upgraded IdleOverlay manages 5 refs:
- `overlayRef` — the scanline overlay div (existing)
- `grainRef` — NEW fixed grain overlay div (sf-grain class provides ::after pseudo-element)
- `timerRef` — setTimeout handle for idle threshold
- `tickerRef` — GSAP ticker callback reference (null when inactive)
- `basePrimaryRef` — captured --color-primary string (empty when inactive)

The setTimeout callback executes the idle activation sequence:
1. Capture --color-primary via `getComputedStyle(document.documentElement).getPropertyValue("--color-primary").trim()`
2. Match `/oklch\(([\d.]+)/` — if no match, skip pulse, still activate grain + overlay
3. Guard against accumulation: remove existing ticker if present
4. Create `pulseFn` with `let elapsed = 0` in closure — accumulates `deltaTime / 1000` per tick
5. Register pulseFn via `gsap.ticker.add(pulseFn)` and store in tickerRef
6. Add `sf-grain-animated` class, add `sf-idle-overlay--active` class

The `resetIdle` snap-back sequence (order matters):
1. Remove GSAP ticker (`gsap.ticker.remove`) — stops color mutation immediately
2. Restore `--color-primary` via `setProperty` — instant, no CSS transition
3. Remove `sf-grain-animated` from grain div — grain flicker stops
4. Set `el.style.transition = "none"` — bypasses glacial opacity fade
5. Remove `sf-idle-overlay--active` — instant hide
6. Restore transition via `requestAnimationFrame(() => { el.style.transition = ""; })`

### data-cursor Placement (SIG-09)

The CanvasCursor component (canvas-cursor.tsx, unchanged) already queries `[data-cursor]` via IntersectionObserver. The implementation is pure markup — no component logic changes needed.

Homepage: 6 sections with `data-bg-shift` all received `data-cursor`:
- hero, manifesto, signal, stats, code, grid

Showcase pages: `<main id="main-content">` on all 4 pages received `data-cursor`:
- /components, /tokens, /start, /reference

Total: 10 data-cursor occurrences across 5 files (confirmed by grep).

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check

- [x] components/layout/global-effects.tsx modified — IdleOverlay upgraded
- [x] app/page.tsx — 6 data-cursor attributes added
- [x] app/components/page.tsx — data-cursor on main
- [x] app/tokens/page.tsx — data-cursor on main
- [x] app/start/page.tsx — data-cursor on main
- [x] app/reference/page.tsx — data-cursor on main
- [x] Commit 890fc70 exists (feat: IdleOverlay upgrade)
- [x] Commit 52a9fbf exists (feat: data-cursor placement)
- [x] pnpm build passes, 10 data-cursor occurrences confirmed

## Self-Check: PASSED
