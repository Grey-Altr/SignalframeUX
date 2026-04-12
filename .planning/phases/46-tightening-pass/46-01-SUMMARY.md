---
phase: 46-tightening-pass
plan: 01
status: complete
completed: "2026-04-12"
commit: "00868ca"
---

# Summary — Phase 46 Plan 01: Duration Token Normalization

## What was done

Replaced all hardcoded animation duration values and fixed all unprefixed `var(--duration-*)` / `var(--ease-*)` references across 20 component files.

## Changes made

**Category A — `duration-[34ms]` → `duration-[var(--sfx-duration-instant)]`:**
- acquisition-section.tsx, acquisition-copy-button.tsx, inventory-section.tsx, components-explorer.tsx

**Category B — Numeric Tailwind durations → token vars:**
- copy-button.tsx, back-to-top.tsx, global-effects.tsx, component-grid.tsx, components-explorer.tsx

**Category C — Unprefixed CSS var prefix fix:**
- sf-card.tsx, sf-tabs.tsx, sf-toggle.tsx, sf-toggle-group.tsx, sf-navigation-menu.tsx, sf-table.tsx, signal-overlay.tsx, hover-preview.tsx, xray-reveal.tsx, border-draw.tsx, nav-overlay.tsx

**TGH-04 — sf-button alignment:**
- Changed `duration-[var(--duration-normal)]` → `duration-[var(--sfx-duration-fast)]`
- Aligns sf-button hover (100ms) with all other SF components

## Verification

- AC-1 through AC-8 all pass
- Zero hardcoded duration values in components/blocks/, components/layout/, components/sf/, components/animation/
- Zero unprefixed var(--duration-*) or var(--ease-*) references
- Build passes
