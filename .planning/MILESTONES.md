# Milestones

## v1.8 Speed of Light + Build-Order Constraints (Shipped: 2026-04-29)

**Phases completed:** 10 phases (57, 58, 59, 60, 61, 62, 63.1, 64; 63 + 65 deferred to v1.9)
**Timeline:** 5 days (2026-04-25 → 2026-04-29), 201 commits
**Requirements:** 26/29 satisfied (3 unsatisfied — phase-pending; not deferred)
**Audit:** `gaps_found` — Revision 3 reflects PR #4 merge (CRT-05 → satisfied; VRF-05 activator cleared)

**Delivered:** Closed the loop between aesthetic-of-record (Phase 57) and synthetic launch-gate verification (Phase 62) — homepage hits Lighthouse 100/100 perf in production with LCP 657ms / CLS 0.0042 / TBT 40ms while preserving all v1.7 trademark animations. Phase 64's CRT-05 cohort merged via three small atomic PRs + one 226-commit branch-merge ratification PR (#4) bringing v1.7+v1.8 surface to main.

**Key accomplishments:**

- **Aesthetic-of-record lock-in (Phase 57):** `.planning/codebase/AESTHETIC-OF-RECORD.md` shipped — 146-line single-source-of-truth codifying AES-01..04 standing rules with 18 LOCKDOWN.md citations + 13 trademark file paths + globals.css token reference. LCP element identity captured per-viewport: mobile-360 = GhostLabel (4% opacity), desktop-1440 = VL-05 magenta `//` overlay.
- **LHCI + RUM telemetry (Phase 58):** GitHub Actions LHCI gate workflow on `deployment_status` event; 5 mobile + 5 desktop runs against Vercel preview; CIB-04 launch-gate.ts byte-identity guard; CIB-05 `/api/vitals` route + WebVitals client component for Field RUM ingestion.
- **Critical-path restructure (Phase 59 → 64):** CRT-01 canvas-sync inline, CRT-02 Anton subset (300/700 weights, ~80 KB → ~18 KB woff2), CRT-03 font-display: swap with measured-from-woff2 descriptors, CRT-04 Lenis init via `requestIdleCallback (timeout: 100ms)`, CRT-05 3-PR atomic bisect ship sequence (PR #1/#2/#3 to main).
- **LCP fast-path (Phase 60 + 63.1):** Mobile LCP intervention via `content-visibility: auto` + responsive `containIntrinsicSize` on GhostLabel LEAF; desktop LCP achieved 657ms (90% improvement vs 6.5s baseline). Phase 63.1 sub-phase shipped chunk-id lock + below-fold dynamic import + ghost-label tweaks.
- **Bundle hygiene (Phase 61):** `optimizePackageImports` extended to 7 packages (`lucide-react`, `radix-ui`, `input-otp`, `cmdk`, `vaul`, `sonner`, `react-day-picker`); shared First Load JS at 103 KB (BND-01 recalibrated to ≤105 KB Next.js 15 floor reality); D-04 chunk-id stability lock established preventing barrel-export reshuffles.
- **Real-device verification (Phase 62):** VRF-02 launch-gate-runner against prod URL — perf 100 / a11y 100 / bp 96 / SEO 100; LCP 657ms / CLS 0.0042 / TBT 40ms / TTI 907ms; 20/20 pixel-diff PASS at max 0.343%; 4G LTE iOS = 3.20× and midtier = 2.63× synthetic anchor PASS post-recalibration.
- **Bisect protection + 3-PR ship (Phase 64):** PR #1 (8bef00e), PR #2 (b600fd7), PR #3 (32fc341) all merged with branch protection ruleset 15683540 ACTIVE on main (`audit` check required, strict policy). PR #4 (`2a825cf`) 226-commit branch-merge ratifies entire v1.7+v1.8 surface.
- **Path-decision lineage (10 ratifications standing on main):** path_a (CLS 0→0.005), path_b (mobile bp 0.97→0.95), path_e (mobile perf+TBT loosened), path_f (mobile LCP 1000→1500ms), path_g→ desktop perf+TBT omission, **path_h** (mobile a11y 0.97→0.96 ScaleCanvas target-size architectural), **path_i** (desktop a11y 0.97→0.96 GhostLabel color-contrast architectural), **path_k** (homepage bundle 200→260 KB D-04 freeze), **path_l** (lcp-guard test.fixme content-visibility:auto + Chrome LCP API .element=null) — plus SEO drop on preview-LHCI.
- **Wordmark Linux baselines bootstrapped (Path N):** chromium-linux baselines force-added past `.gitignore *.png` for D-12 wordmark fidelity; CI workflow gains `actions/upload-artifact@v4` step for future cross-platform baseline generation.

**Known gaps (3 unsatisfied REQs — deferred to v1.9):**

- **VRF-01:** Real-device 3-profile WPT matrix — Phase 63 directory empty. Activator: WPT API key at `~/.wpt-api-key` (external user resource).
- **VRF-04:** Mid-milestone real-vs-synthetic synthesis — Phase 63 cascade with VRF-01.
- **VRF-05:** Field RUM p75 LCP — Phase 65 directory not created. Activator NOW CLEARED post-PR-#4 (fresh prod deploy with `/api/vitals` route live), but execution within Vercel Hobby 1h log retention window deferred to v1.9.

**v1.9 carry-over backlog (closure conditions for path_decisions + 3 unsat REQs):**

1. Close path_h — ScaleCanvas mobile breakpoint exception (transform: none below `sm`)
2. Close path_i — GhostLabel low-contrast suppression mechanism (color: transparent + mask-image OR pseudo-element)
3. Close path_k — Bundle reduction phase allowed to break D-04 chunk-id lock
4. Close path_l — lcp-guard refactor as STRUCTURAL DOM-query test
5. Wordmark cross-platform pixel-diff threshold recalibration (D-12 0.1% → AES-04 0.5%)
6. Execute Phase 63 (VRF-01 + VRF-04) once WPT key provisioned
7. Execute Phase 65 (VRF-05) within Hobby 1h log retention window

**Archives:** `.planning/milestones/v1.8-ROADMAP.md`, `v1.8-REQUIREMENTS.md`, `v1.8-MILESTONE-AUDIT.md`

---

## v1.7 Tightening, Polish, and Aesthetic Push (Shipped: 2026-04-25)

**Phases completed:** 14 phases (44, 45, 46, 47, 48, 49, 50, 50.1, 51, 52, 53, 54, 55, 56), 16 plans
**Timeline:** 13 days (2026-04-12 → 2026-04-25), 370 commits
**Files changed:** 379 modified, +31,051 / −7,314 LOC
**Requirements:** 50/50 resolved (40 Ratified, 15 Obsolete, 9 Complete, 0 Pending)
**Audit:** PASSED — single-doc lean ratification (`v1.7-MILESTONE-AUDIT.md`), zero critical blockers

**Delivered:** Closed the gap between SF//UX's architectural completeness and the wiki's full aesthetic vision — the SIGNAL layer now speaks instead of whispers, with a complete intensity-derived effect stack and a consumer-override token contract.

**Key accomplishments:**

- **Token bridge (Phase 45):** `--sfx-*` namespace + `@theme inline` Tailwind aliasing + `@layer signalframeux` dist isolation — consumers (CD site first) override SF tokens via unlayered CSS that wins before first paint. `scripts/wrap-tokens-layer.ts` build pipeline + `cd-tokens.css` reference. No SSR magenta flash.
- **Intensity bridge (Phase 48):** `updateSignalDerivedProps(intensity)` derives 12 CSS custom properties from `--sfx-signal-intensity` via curves (linear, log, inverse). `[data-signal-intensity="low|med|high"]` attribute selectors set 0.2 / 0.5 / 0.8. `MutationObserver` real-time bridge in `SignalIntensityBridge`. Reduced-motion collapses all derived values to 0.
- **Effect stack wired through bridge:** grain (log curve `0.03 + 0.05·log10(1+9i)` — Phase 49), VHS (chromatic aberration + `steps(4)` jitter + vignette + Safari literal backdrop-filter — Phase 50), halftone (`mix-blend-mode: multiply` + threshold curve — Phase 51), circuit (inverse-of-intensity, mutually exclusive with grain — Phase 52), mesh gradient (fixed z:-1, theme-hue-driven OKLCH ellipses, 60s alternate drift — Phase 53), particle field (`useSignalScene` singleton WebGL + `ParticleFieldHQ` Canvas2D consumer chain via `getQualityTier` — Phase 54), glitch transition (`.sf-signal-dropout` 250ms `steps(1)` hard-cut, 11 clip-path waypoints — Phase 55).
- **Symbol system (Phase 56):** `public/symbols.svg` ships 24 symbols at 4145 bytes (within 20-30 / under 5KB spec), enabling site-wide SVG sprite consumption.
- **Tightening pass (Phase 46):** 15 hardcoded animation durations and 7 hardcoded color values replaced with `--sfx-*` token references; light-mode `--sfx-muted-foreground` verified at 5.81:1 contrast (WCAG AA pass); `sf-button` hover aligned to `--sfx-duration-fast`.
- **Viewport polish (Phase 47):** `--sfx-text-2xs` / `--sfx-text-xs` clamp floors lifted to 10px / 11px so functional micro-text stays readable on 1280px MacBook 13"; Storybook viewport presets for `macbook13` (1280×800) and `macbook15` (1440×900).
- **Copy audit (Phase 44):** component count reconciled to 48 across hero, stats-band, marquee, OG image, init page; v1.7 version strings unified; speculative v2.0.0 references removed.
- **Visual regression infrastructure (VRG-01):** `@chromatic-com/storybook` + `chromatic` CLI installed as devDependencies; `pnpm build-storybook` clean; story-count gate raised from ≥40 to ≥60 (61 stories shipped).
- **Launch gates closed:** PRF-01 bundle, PRF-02 Lighthouse Performance, PRF-03 (signoff at `.planning/PRF-03-SIGNOFF.md` 2026-04-13), PRF-04 — all four gates pass; `a260238 fix(cleanup): remove heavy SIGNAL effects from GlobalEffects render for performance gate` cut idle-overlay, datamosh-mount, particle-WebGL-mount to clear PRF-02.
- **Ratification methodology established:** lean-ratification pattern — grep shipped code for each requirement's named artifact, classify as Ratified / Obsolete / Genuine-gap with file:line evidence. Six process-gate obsolescence sub-families catalogued (process-review, retroactive-temporal, physical-device-test, feature-lost-to-launch-gate, dependency-obsolete-via-launch-gate, subjective-feel) — taxonomy reusable for future audits.

**Known tech debt (deferred):**

- `components/layout/global-effects.tsx:165-186, 201` — IdleOverlay JSDoc residue (stale doc-comment after consumer cut)
- `components/layout/global-effects.tsx:57` — Dead derive `--sfx-fx-particle-opacity` (particle code reads `--sfx-signal-intensity` directly)
- `components/layout/global-effects.tsx:56` — Dead derive `--sfx-fx-glitch-rate`
- `REQUIREMENTS.md` body has 15 stale `[ ]` checkboxes from v1.5 era (RA-01..03, TH-01..06, PR-01..06) — traceability table marks them Complete; cosmetic only, archived as-is

**Recommendation:** schedule a single `Chore: drop dead-derive slots + JSDoc residue` cleanup commit early in v1.8.

**Archives:** `.planning/milestones/v1.7-ROADMAP.md`, `v1.7-REQUIREMENTS.md`, `v1.7-MILESTONE-AUDIT.md`

---

## v1.4 Feature Complete (Shipped: 2026-04-08)

**Phases completed:** 7 phases, 13 plans, 6 tasks

**Key accomplishments:**

- TD-01 — MutationObserver disconnect on unmount
- One-liner:
- Elevation absence and deferred sidebar/chart token groups documented in globals.css and SCAFFOLDING.md with explicit DU/TDR rationale and do-not-use guidance for v1.4
- lib/code-highlight.ts
- One-liner:
- One-liner:
- One-liner:
- Production build at 100.0 KB gzip shared bundle (50 KB under 150 KB gate), all lazy-load isolation verified, 15/15 Playwright tests passing.
- Accessibility (90→100):
- IBF-01 (ID/registry mismatch):

---

## v1.3 Component Expansion (Shipped: 2026-04-06)

**Phases completed:** 5 phases, 10 plans, 6 tasks

**Key accomplishments:**

- (none recorded)

---

## v1.2 Tech Debt Sweep (Shipped: 2026-04-06)

**Phases completed:** 6 phases, 9 plans, 6 tasks

**Key accomplishments:**

- (none recorded)

---

## v1.1 Generative Surface (Shipped: 2026-04-06)

**Phases completed:** 4 phases, 9 plans
**Timeline:** 6 days (2026-03-31 → 2026-04-06)
**Requirements:** 15/17 satisfied (2 partial: INT-03 zero consumers, INT-04 one-sided bridge)
**Audit:** tech_debt — 2 partial reqs + documentation tracking debt, no blockers
**Nyquist:** 0/4 phases compliant (all draft)

**Key accomplishments:**

- Singleton WebGL infrastructure: SignalCanvas renderer, useSignalScene hook, color-resolve OKLCH→sRGB bridge with TTL cache
- Multi-sensory SIGNAL activation: audio feedback (Web Audio square wave), haptic feedback (Vibration API), idle animation (8s grain drift + OKLCH ±5% lightness pulse)
- Two generative scenes: SignalMesh (IcosahedronGeometry + vertex displacement + ScrollTrigger) and TokenViz (Canvas 2D self-depicting token visualization)
- GLSL procedural hero shader with FBM 4-octave noise, geometric grid lines, and integrated Bayer 4×4 ordered dither
- SF layout primitive migration across all 5 pages (32 SFSection instances, zero raw div section wrappers)
- SignalMotion scroll-driven wrapper + SignalOverlay live parameter panel with Shift+S toggle

**Known gaps (accepted):**

- INT-03: SignalMotion built but zero consumers — component exists with no page placement
- INT-04: SignalOverlay writes CSS vars (--signal-intensity, --signal-speed, --signal-accent) but no WebGL scene reads them
- INT-01 minor: reference page missing mt-[var(--nav-height)], start NEXT_CARDS grid not SFSection-wrapped
- Documentation tracking: 14/17 SUMMARY frontmatters missing requirements_completed, 8 REQUIREMENTS.md checkboxes stale

**Archives:** `.planning/milestones/v1.1-ROADMAP.md`, `v1.1-REQUIREMENTS.md`, `v1.1-MILESTONE-AUDIT.md`

---

## v1.0 Craft & Feedback (Shipped: 2026-04-05)

**Phases completed:** 5 phases, 14 plans
**Timeline:** 6 days (2026-03-31 → 2026-04-05)
**Requirements:** 31/37 satisfied (6 formally deferred)
**Audit:** tech_debt — 12 items, no blockers
**Nyquist:** 5/5 phases compliant

**Key accomplishments:**

- Token system locked and enforced — 9 blessed spacing stops, 5 semantic typography aliases, 3 layout tokens, tiered color palette (core 5 + extended), animation durations/easings
- 6 SF primitives built (SFContainer, SFSection, SFStack, SFGrid, SFText, SFButton) enforcing tokens by construction with CVA variants and TypeScript enforcement
- SIGNAL layer authored — ScrambleText, asymmetric hover (100ms/400ms), 34ms hard-cut section reveals, 40ms stagger cascades, canvas cursor with IntersectionObserver scoping
- Above-the-fold locked — hero fast-path (sub-500ms first motion), crafted error/404 pages, 3 designed empty states, reduced-motion as first-class 16-effect alternative
- DX contract established — SCAFFOLDING.md (337 lines), JSDoc on all 28 SF components, FRAME/SIGNAL import boundary documented, deferred items with interface sketches in DX-SPEC.md

**Known gaps (accepted):**

- SIG-06/07/08: Audio, haptic, idle state — deferred with rationale
- DX-04/05: Registry, API factory — deferred with interface sketches
- STP-01: Session persistence — deferred with interface sketch
- SIG-09: [data-cursor] not placed on any section — cursor never activates (tech debt)
- PRM-02/03/04: SFSection, SFStack, SFGrid exported but zero consumers

**Archives:** `.planning/milestones/v1.0-ROADMAP.md`, `v1.0-REQUIREMENTS.md`, `v1.0-MILESTONE-AUDIT.md`

---
