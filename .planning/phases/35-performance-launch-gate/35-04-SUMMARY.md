---
phase: 35-performance-launch-gate
plan: 04
status: complete
started: 2026-04-10
completed: 2026-04-10
---

# Plan 35-04 Summary

## What was built

Wave 2 chrome-devtools exploratory audit across all 5 routes, Wave 3 triage with 5-fix cap, 4 approved fixes landed, Awwwards SOTD submission package (5 screenshots + description deck), and v1.6 carry-overs filed.

## Tasks

| # | Task | Commit | What |
|---|------|--------|------|
| 1 | CDT exploratory pass | `0f2e769` | wave-2-cdt-findings.md — 5 routes × 3 viewports, BLOCK/FLAG/PASS |
| 2 | Awwwards screenshots | — | 5 PNGs at 2880×1620 (2x retina of 1440×900) via chrome-devtools MCP |
| 3 | Lighthouse advisory | `70fcf44` | Performance 52, A11y 95, BP 96, SEO 91 — appended to findings |
| 4 | Wave 3 triage | `3202a0b` | 4 fixes approved within 5-fix cap + v1.6-carry-overs.md |
| 5 | Wave 3 fixes | `5b894b4`–`cebb2da` | CLS (Anton display:optional), nav-reveal (mouse.wheel), HUD labels (data-primary), test path |
| 6 | Awwwards description | `53ae950` | 3-act A+B+D hybrid, ~135 words, OPEN-1 resolved (Culture Division) |
| 7 | Final verification | `31186f0` | Description verified, carry-overs complete, VL-05 intact |

## Key files created

- `.planning/phases/35-performance-launch-gate/wave-2-cdt-findings.md`
- `.planning/phases/35-performance-launch-gate/wave-3-triage.md`
- `.planning/phases/35-performance-launch-gate/v1.6-carry-overs.md`
- `.planning/phases/35-performance-launch-gate/awwwards-description.md`
- `.planning/phases/35-performance-launch-gate/awwwards-screenshots/01-thesis-pinned.png`
- `.planning/phases/35-performance-launch-gate/awwwards-screenshots/02-entry-cold-boot.png`
- `.planning/phases/35-performance-launch-gate/awwwards-screenshots/03-inventory-breadth.png`
- `.planning/phases/35-performance-launch-gate/awwwards-screenshots/04-system-specimens.png`
- `.planning/phases/35-performance-launch-gate/awwwards-screenshots/05-reference-schematic.png`

## Key files modified

- `components/layout/instrument-hud.tsx` — data-primary query for subpage labels
- `app/system/page.tsx` — data-primary attribute on main
- `app/init/page.tsx` — data-primary attribute on main
- `app/reference/page.tsx` — data-primary attribute on main
- `app/inventory/page.tsx` — data-primary attribute on main
- `app/layout.tsx` — Anton font display:optional
- `tests/phase-35-homepage.spec.ts` — mouse.wheel for nav-reveal
- `tests/phase-35-system.spec.ts` — mouse.wheel + specimen ladder path fix
- `tests/phase-35-init.spec.ts` — mouse.wheel
- `tests/phase-35-reference.spec.ts` — mouse.wheel

## Deviations

- **Task 2 screenshot 01-thesis-pinned.png** — THESIS manifesto uses scroll-driven animation that didn't trigger through CDP programmatic scroll. Captured FRAME/SIGNAL section as placeholder. May need manual re-capture from Grey's browser.
- **Task 3 Lighthouse deviation** — `npx tsx` crashes on lighthouse 13.x due to ESM `import.meta.url` incompatibility. Used Lighthouse CLI directly with identical 3-run worst-score logic.
- **Task 6 two commits** — first commit had imprecise ship metrics; second corrected to verified values from codebase.

## Issues encountered

- CLS 0.485 on /system was the root cause of Lighthouse Performance 52. Fixed via Anton `display:swap` → `display:optional`.
- `window.scrollBy` doesn't drive Lenis smooth scrolling in Playwright. Fixed via `page.mouse.wheel`.
- InstrumentHUD used `sections.length === 1` guard for subpage detection, which was too strict. Fixed with `data-primary` attribute approach.

## Self-Check: PASSED
