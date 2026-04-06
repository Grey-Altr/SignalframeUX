# Requirements — v1.2 Tech Debt Sweep

## Milestone v1.2 Requirements

### Foundation
- [x] **FND-01**: `--signal-intensity`, `--signal-speed`, and `--signal-accent` CSS custom properties have sensible defaults declared in globals.css
- [x] **FND-02**: SFSection `bgShift` prop type changed from `boolean` to `"white" | "black"` with all call sites updated to use the typed prop instead of spread HTML attributes

### Integration Wiring
- [x] **INT-03**: SignalMotion component wraps at least 3 showcase sections on the homepage with scroll-driven animation active
- [x] **INT-04**: SignalOverlay CSS var changes (`--signal-intensity`, `--signal-speed`, `--signal-accent`) are read by WebGL scenes (GLSLHero and/or SignalMesh) via cached module-level reads — no per-frame `getComputedStyle`
- [x] **INT-01**: Reference page has correct `mt-[var(--nav-height)]` spacing and NEXT_CARDS grid is wrapped in SFSection

### Developer Experience
- [x] **DX-04**: registry.json includes all 29 interactive + 5 layout SF components plus an `sf-theme` entry with cssVars for token-only installation; `public/r/` is built and up to date
- [x] **DX-05**: `createSignalframeUX(config)` factory returns `{SignalframeProvider, useSignalframe}` using hole-in-the-donut SSR pattern; config accepts theme, animation, and signal parameters

### Session Persistence
- [x] **STP-01**: User's active filter selection, tab state, and scroll position persist across page navigations within a session using sessionStorage (hydration-safe via useEffect pattern)

### Documentation
- [x] **DOC-01**: All SUMMARY.md frontmatters include accurate `requirements_completed` fields; stale REQUIREMENTS.md checkboxes from v1.0/v1.1 are corrected

---

## Future Requirements

- Registry namespace strategy (`@signalframe/` vs unnamespaced) — deferred until cdOS becomes a consumer
- Registry v2 "Smart Versioning" — monitor shadcn releases for v2 registry spec

## Out of Scope

- React Three Fiber migration — excluded; R3F's independent rAF loop conflicts with GSAP globalTimeline.timeScale(0)
- New generative scenes — v1.2 is debt closure, not feature expansion
- New SF components — library frozen at 29 interactive + 5 layout primitives
- Token expansion — palette and spacing stops remain frozen

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| FND-01 | Phase 10 | 10-01 | Complete |
| FND-02 | Phase 10 | 10-01 | Complete |
| INT-01 | Phase 10 | 10-02 | Complete |
| DX-04 | Phase 11 | 11-01 | Complete |
| INT-04 | Phase 12 | 12-01 | Complete |
| INT-03 | Phase 12 | 12-02 | Complete |
| DX-05 | Phase 13 | 13-01 | Complete |
| STP-01 | Phase 14 | 14-01 | Complete |
| DOC-01 | Phase 15 | 15-01, 15-02 | Complete |
