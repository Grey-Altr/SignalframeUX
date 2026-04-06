# Requirements — v1.3 Component Expansion

## Milestone v1.3 Requirements

### Infrastructure
- [x] **INFRA-01**: SF wrapper creation checklist codified in SCAFFOLDING.md — rounded-none audit, `intent` prop rule, barrel rule, registry same-commit rule, a11y smoke test, prefers-reduced-motion rule (completed 16-02)
- [x] **INFRA-02**: Performance baseline captured — Lighthouse LCP/TTI/bundle size recorded before first new component (completed 16-01: 103 KB shared, BASELINE.md created)
- [x] **INFRA-03**: ComponentsExplorer grouped by category — Forms, Feedback, Navigation, Data Display, Layout, Generative (completed 16-02)
- [x] **INFRA-04**: Prop vocabulary locked and documented — `intent` for semantic variants, `size` for scale, `asChild` for composition (completed 16-02)

### Feedback & Disclosure
- [x] **FD-01**: User can expand/collapse content sections via SFAccordion with stagger SIGNAL animation (completed 18-01)
- [ ] **FD-02**: User receives async notifications via SFToast (Sonner) with GSAP slide entrance, positioned bottom-left to avoid SignalOverlay conflict
- [x] **FD-03**: User sees task/upload progress via SFProgress with SIGNAL fill intensity tween (completed 18-01)
- [x] **FD-04**: User confirms destructive actions via SFAlertDialog with loading state support (completed 17-02)
- [x] **FD-05**: User sees inline feedback banners via SFAlert with intent variants (info, warning, destructive, success) (completed 17-01)
- [x] **FD-06**: User can show/hide content via SFCollapsible without accordion semantics (completed 17-01)

### Identity & Navigation
- [x] **NAV-01**: User is represented by square SFAvatar with Radix fallback chain (image → initials → icon) (completed 17-01)
- [x] **NAV-02**: User sees navigation hierarchy via SFBreadcrumb as Server Component (completed 17-01)
- [x] **NAV-03**: User sees designed empty states via SFEmptyState with optional ScrambleText SIGNAL treatment (completed 17-02)
- [ ] **NAV-04**: User navigates site via SFNavigationMenu with flyout panels and defined mobile behavior
- [ ] **NAV-05**: User navigates paginated content via SFPagination

### Multi-Step & Status
- [ ] **MS-01**: User completes multi-step flows via SFStepper with per-step error state
- [x] **MS-02**: User sees presence/status indicators via SFStatusDot with GSAP pulse on active state (completed 17-02)
- [ ] **MS-03**: User selects from exclusive/multi toggle options via SFToggleGroup

### Registry-Only (Lazy)
- [ ] **REG-01**: Consumer installs SFCalendar via shadcn CLI — lazy-loaded, bundle cost annotated, `meta.heavy: true`
- [ ] **REG-02**: Consumer installs SFMenubar via shadcn CLI — lazy-loaded, registry-only

---

## Future Requirements

- Registry namespace strategy (`@signalframe/` vs unnamespaced) — deferred until cdOS becomes a consumer
- Registry v2 "Smart Versioning" — monitor shadcn releases for v2 registry spec
- DataTable composite block (SFTable + SFPagination + SFSelect + SFInput) — deferred to v1.4 after SFPagination ships
- Input OTP / PinInput — relevant only for auth flows, defer to cdOS milestone
- Spinner component — SFSkeleton covers most loading cases; evaluate if insufficient

## Out of Scope

- React Three Fiber migration — R3F's independent rAF loop conflicts with GSAP globalTimeline.timeScale(0)
- New generative scenes — component expansion, not generative expansion
- Token expansion — palette and spacing stops remain frozen
- Carousel / Chart / Rich Text Editor / Color Picker — application-layer, not design system
- Rounded corner variants — zero border-radius is non-negotiable
- ContextMenu — right-click model conflicts with DU/TDR aesthetic
- Resizable panels — no identified consumer use case

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| INFRA-01 | Phase 16 | 16-02 | Complete |
| INFRA-02 | Phase 16 | 16-01 | Complete |
| INFRA-03 | Phase 16 | 16-02 | Complete |
| INFRA-04 | Phase 16 | 16-02 | Complete |
| FD-01 | Phase 18 | 18-01 | Complete |
| FD-02 | Phase 18 | — | Pending |
| FD-03 | Phase 18 | 18-01 | Complete |
| FD-04 | Phase 17 | 17-02 | Complete |
| FD-05 | Phase 17 | 17-01 | Complete |
| FD-06 | Phase 17 | 17-01 | Complete |
| NAV-01 | Phase 17 | 17-01 | Complete |
| NAV-02 | Phase 17 | 17-01 | Complete |
| NAV-03 | Phase 17 | 17-02 | Complete |
| NAV-04 | Phase 19 | — | Pending |
| NAV-05 | Phase 19 | — | Pending |
| MS-01 | Phase 19 | — | Pending |
| MS-02 | Phase 17 | 17-02 | Complete |
| MS-03 | Phase 19 | — | Pending |
| REG-01 | Phase 20 | — | Pending |
| REG-02 | Phase 20 | — | Pending |
