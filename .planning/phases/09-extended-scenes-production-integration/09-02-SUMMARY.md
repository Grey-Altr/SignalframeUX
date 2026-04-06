---
phase: 09-extended-scenes-production-integration
plan: "02"
subsystem: animation
tags: [signal-motion, signal-overlay, scroll-driven, css-custom-properties, gsap, scrub]
dependency_graph:
  requires:
    - lib/gsap-core.ts
    - components/sf/sf-slider.tsx
    - components/layout/global-effects.tsx
  provides:
    - SignalMotion (scrub-capable scroll wrapper)
    - SignalOverlay (live SIGNAL parameter panel)
    - SignalOverlayLazy (SSR-safe wrapper)
  affects:
    - components/layout/global-effects.tsx (SignalOverlayLazy added as last child)
tech_stack:
  added: []
  patterns:
    - "GSAP fromTo + ScrollTrigger scrub — scroll-position-tied animation (distinct from ScrollReveal one-shot)"
    - "CSS custom property setProperty bridge — overlay values picked up by WebGL uniforms next frame"
    - "next/dynamic ssr:false in Client Component wrapper — mirrors SignalMeshLazy pattern"
key_files:
  created:
    - components/animation/signal-motion.tsx
    - components/animation/signal-overlay.tsx
    - components/animation/signal-overlay-lazy.tsx
  modified:
    - components/layout/global-effects.tsx
decisions:
  - "SFSlider used over native input[type=range] — already SF-styled, square, matches system aesthetic, Radix a11y included"
  - "No persistence for overlay state — resets on page reload per research recommendation; no localStorage needed"
  - "Speed control hidden on reduced-motion, not just disabled — clearer UX signal than a grayed-out slider"
  - "Reset-to-defaults button added — not in plan spec but needed for demo UX; CSS vars persist across navigation so reset is essential"
metrics:
  duration: "~2 minutes"
  tasks_completed: 2
  files_created: 3
  files_modified: 1
  commits: 2
  completed_date: "2026-04-05"
requirements_completed: [INT-03, INT-04]
---

# Phase 9 Plan 02: SignalMotion + SIGNAL Overlay Summary

**One-liner:** GSAP scrub-motion wrapper + floating CSS-property bridge panel for live WebGL parameter tuning.

## What Was Built

### Task 1 — SignalMotion (507826f)

`components/animation/signal-motion.tsx` — A scroll-driven animation wrapper that ties element state to scroll position rather than firing once on entry (the ScrollReveal distinction).

Key differentiators from ScrollReveal:
- `gsap.fromTo` with explicit `from`/`to` states vs `gsap.from` one-shot
- `scrub: 1` default — animation smoothly follows scroll position and reverses on scroll-up
- ScrollTrigger `start`/`end` window defines the scroll range mapped to 0–100% animation progress
- `prefers-reduced-motion` guard: children rendered at `to` state immediately via `gsap.set`, no ScrollTrigger created

Props: `children`, `className`, `from` (default: `{opacity:0.3, y:20}`), `to` (default: `{opacity:1, y:0}`), `scrub` (default: `1`), `start` (default: `"top 80%"`), `end` (default: `"top 30%"`), `markers`.

### Task 2 — SignalOverlay + Integration (36bdbeb)

`components/animation/signal-overlay.tsx` — A fixed floating panel (bottom-right) with 3 SFSlider controls that write CSS custom properties on `:root` in real-time.

Controls:
| Label | CSS Var | Range | Mapping |
|---|---|---|---|
| Signal Intensity | `--signal-intensity` | 0–100 | `value / 100` → 0.0–1.0 |
| Animation Speed | `--signal-speed` | 0–100 | `value / 50` → 0.0–2.0x (50=1x) |
| Accent Shift | `--signal-accent` | 0–360 | degrees passthrough |

Panel features:
- Toggle via "S" button (always visible, fixed bottom-right) or Shift+S keyboard shortcut
- `role="dialog"` with `aria-label` for screen reader accessibility
- Speed slider replaced by "Reduced motion active" message when `prefers-reduced-motion` is set
- Reset button restores all three CSS vars to their defaults (`0.5`, `1`, `0`)

`components/animation/signal-overlay-lazy.tsx` — `next/dynamic({ ssr: false })` wrapper matching the SignalMeshLazy pattern. Required because `ssr: false` cannot be used directly in Server Components in Next.js 15.

`components/layout/global-effects.tsx` — `SignalOverlayLazy` added as last child of `GlobalEffects` fragment, after `InteractionFeedback`.

## Deviations from Plan

### Auto-added: Reset button

**Rule 2 — Missing critical functionality**
- **Found during:** Task 2 implementation
- **Issue:** CSS custom properties set by the overlay persist on `:root` across in-page navigation. Without a reset, users have no way to restore defaults after experimenting.
- **Fix:** Added "Reset defaults" button that restores `--signal-intensity=0.5`, `--signal-speed=1`, `--signal-accent=0`.
- **Files modified:** `components/animation/signal-overlay.tsx`
- **Commit:** 36bdbeb (bundled with Task 2)

## Verification

- [x] `pnpm build` exits 0 — confirmed (exit code: 0)
- [x] `SignalMotion` exports from `signal-motion.tsx` with scrub support
- [x] `SignalOverlay` has 3 controls writing `--signal-intensity`, `--signal-speed`, `--signal-accent`
- [x] Overlay integrated into `global-effects.tsx` via `SignalOverlayLazy`
- [x] Keyboard shortcut Shift+S toggles overlay

## Requirements Met

- INT-03: SignalMotion component — scroll-driven scrub animation wrapper
- INT-04: Live SIGNAL overlay — floating parameter panel writing CSS custom properties

## Self-Check: PASSED
