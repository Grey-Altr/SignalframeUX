
## From 38-03 (2026-04-11)

### React hooks rules deferred from eslint-config-next 16 flat config upgrade

Rules disabled in `eslint.config.js` (pre-existing patterns not introduced by plan 38-03):

- `react-hooks/refs` — GSAP `contextSafe()` ref access patterns in:
  - `components/animation/scramble-text.tsx:41`
  - `components/blocks/component-grid.tsx:344`
- `react-hooks/set-state-in-effect` — setState in mount effects in:
  - `components/animation/signal-overlay.tsx:116`
  - `components/blocks/inventory-section.tsx:67`
  - `components/blocks/manifesto-statement.tsx:54`
  - `components/blocks/thesis-section.tsx:63`
  - `components/layout/dark-mode-toggle.tsx:13`
  - `components/layout/instrument-hud.tsx:53`
  - `components/layout/lenis-provider.tsx` (line TBD)
- `react-hooks/purity` — impure function calls during render (line TBD)

**Recommended resolution:** Phase 39+ — audit GSAP patterns for React 19 compatibility.
