# Requirements — v1.1 Generative Surface

## Generative Foundation

- [x] **GEN-01**: Singleton SignalCanvas renderer manages all WebGL contexts from a single shared instance, preventing context exhaustion
- [x] **GEN-02**: OKLCH→sRGB color bridge utility extracted from canvas-cursor.tsx into `lib/color-resolve.ts`, shared by all canvas/WebGL components
- [x] **GEN-03**: `useSignalScene` hook provides automatic `.dispose()` traversal on unmount, GSAP ticker as render driver, and IntersectionObserver pause for offscreen canvases
- [x] **GEN-04**: All WebGL components load via `next/dynamic({ ssr: false })` with `transpilePackages: ['three']`, validated by bundle analyzer under 200KB initial budget
- [x] **GEN-05**: Every canvas/WebGL component has `matchMedia('prefers-reduced-motion')` guard with static fallback frame and appropriate ARIA role

## SIGNAL Activation

- [x] **SIG-06**: Audio feedback palette via Web Audio API with gesture-gating for browser autoplay policy compliance
- [x] **SIG-07**: Haptic feedback via Vibration API with graceful degradation on unsupported browsers (Safari/iOS)
- [ ] **SIG-08**: Idle state animation (grain drift + color pulse) activates after inactivity threshold
- [ ] **SIG-09**: `[data-cursor]` attribute placed on all showcase sections, activating the existing CanvasCursor crosshair + particle trail

## Generative Scenes

- [ ] **SCN-01**: SignalMesh — first procedural 3D mesh component validates full pipeline (Three.js + GSAP ticker + singleton renderer + disposal)
- [ ] **SCN-02**: Data-driven token visualization renders the token system visually using Canvas 2D (system demonstrates itself)
- [ ] **SCN-03**: ASCII/dithering post-process shader using ordered dithering (GPU-parallel) for CRT/terminal DU/TDR aesthetic
- [ ] **SCN-04**: Custom GLSL hero shader — procedural generative background driven by scroll position and `--color-primary` uniforms

## Showcase Integration

- [ ] **INT-01**: All showcase pages consume SFSection, SFStack, SFGrid primitives (resolving zero-consumer tech debt)
- [ ] **INT-02**: `data-anim="stagger"` applied to production component grid blocks
- [ ] **INT-03**: SignalMotion component provides scroll-driven motion graphics for showcase sections
- [ ] **INT-04**: Live SIGNAL authoring overlay allows visitors to adjust SIGNAL intensity and parameters interactively

## Future Requirements (Deferred)

- DX-04: registry.json for AI/CLI component installation — deferred with interface sketch in DX-SPEC.md
- DX-05: createSignalframeUX(config) + useSignalframe() API — deferred with interface sketch in DX-SPEC.md
- STP-01: Session state persistence (filters, scroll, tabs) — deferred with interface sketch in DX-SPEC.md

## Out of Scope

- Mobile app — web-first, responsive design handles mobile
- Backend API — design system is frontend-only
- CMS integration — MDX + JSON for content
- React Three Fiber — excluded; R3F's independent rAF loop conflicts with GSAP globalTimeline.timeScale(0) reduced-motion mechanism
- Lottie — JSON-replayed animation, not generative/procedural; incompatible with DU/TDR aesthetic
- Gradient meshes, glassmorphism, particle storms — anti-features per Awwwards SOTD research

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| GEN-01 | Phase 6 | Complete (06-02) |
| GEN-02 | Phase 6 | Complete (06-01) |
| GEN-03 | Phase 6 | Complete (06-02) |
| GEN-04 | Phase 6 | Complete (06-01) |
| GEN-05 | Phase 6 | Complete (06-02) |
| SIG-06 | Phase 7 | Complete (07-01) |
| SIG-07 | Phase 7 | Complete (07-01) |
| SIG-08 | Phase 7 | Pending |
| SIG-09 | Phase 7 | Pending |
| SCN-01 | Phase 8 | Pending |
| SCN-02 | Phase 8 | Pending |
| SCN-03 | Phase 9 | Pending |
| SCN-04 | Phase 9 | Pending |
| INT-01 | Phase 9 | Pending |
| INT-02 | Phase 9 | Pending |
| INT-03 | Phase 9 | Pending |
| INT-04 | Phase 9 | Pending |
