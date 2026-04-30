---
phase: 66
slug: scalecanvas-track-b-architectural-decision
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-29
---

# Phase 66 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Hydrated from `66-RESEARCH.md` § Validation Architecture (lines 679-718).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright `^1.59.1` (e2e + visual + axe-core) + LHCI `^0.15.1` (perf + a11y) + Vitest `^4.1.4` (unit, lib only) |
| **Config file** | `playwright.config.ts` + `.lighthouseci/lighthouserc.json` (+ `.lighthouseci/lighthouserc.desktop.json`) |
| **Quick run command** | `pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts tests/v1.9-phase66-aes04-diff.spec.ts --project=chromium` |
| **Full suite command** | `pnpm test && pnpm exec playwright test --project=chromium && pnpm exec lhci autorun` |
| **Estimated runtime** | ~3 min quick / ~5 min wave / ~25 min phase-gate (incl. prod LHCI mobile + desktop) |

---

## Sampling Rate

- **After every task commit:** Run quick command (~3 min against `pnpm build && pnpm start`)
- **After every plan wave:** Run quick + `pillarbox-transform` + `lcp-stability` + `lhci-config` (~5 min)
- **Before `/pde:verify-work`:** Full suite must be green incl. prod LHCI mobile + desktop
- **Max feedback latency:** ~180 s for axe + AES-04 quick set

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 66-01-* | 01 | 1 | ARC-01 | T-66-01 (decision-doc tampering) / — | `scale-canvas-track-b-decision.md` exists with mechanism + 6-pillar audit + file:line evidence | structural (file presence + content schema) | `pnpm exec playwright test tests/v1.9-phase66-decision-doc.spec.ts --project=chromium` | ❌ W0 | ⬜ pending |
| 66-01-baseline | 01 | 1 | ARC-02 (cohort) | — | `.planning/visual-baselines/v1.9-pre/` captured pre-mutation | visual diff (capture-only) | `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --grep cohort --project=chromium` | ❌ W0 | ⬜ pending |
| 66-02-* | 02 | 2 | ARC-02 (architectural) | — | At `vw < 640`, `[data-sf-canvas]` computed `transform = matrix(1, 0, 0, 1, 0, 0)` | structural (computed-style query) | `pnpm exec playwright test tests/v1.9-phase66-pillarbox-transform.spec.ts --project=chromium` | ❌ W0 | ⬜ pending |
| 66-02-lcp | 02 | 2 | ARC-04 (LCP stability) | — | Mobile LCP candidate post-suppression matches stable SSR-paintable above-fold element | structural + LCP API | `pnpm exec playwright test tests/v1.9-phase66-lcp-stability.spec.ts --project=chromium` | ❌ W0 | ⬜ pending |
| 66-03-axe-target | 03 | 3 | ARC-03 (target-size) | T-66-03 (axe-rule regression) | axe-core direct `target-size` violations = 0 on `/` mobile (375×667) | axe-core direct | `pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts --grep target-size --project=chromium` | ❌ W0 | ⬜ pending |
| 66-03-axe-color | 03 | 3 | ARC-04 (color-contrast) | T-66-04 (GhostLabel exclusion bypass) | axe-core direct `color-contrast` violations = 0 on `/` desktop (1440×900); GhostLabel NOT excluded by selector | axe-core direct | `pnpm exec playwright test tests/v1.9-phase66-arc-axe.spec.ts --grep color-contrast --project=chromium` | ❌ W0 | ⬜ pending |
| 66-03-aes04-strict | 03 | 3 | ARC-02 (desktop+tablet) | — | Pixel-diff vs `v1.8-start/` ≤0.5% on `desktop-1440x900` and `ipad-834x1194` for all 5 routes | visual diff | `pnpm exec playwright test tests/v1.9-phase66-aes04-diff.spec.ts --grep strict --project=chromium` | ❌ W0 | ⬜ pending |
| 66-03-lhci-mobile | 03 | 3 | ARC-03 (LHCI mobile) | — | Lighthouse mobile a11y ≥0.97 on prod homepage | LHCI prod | `pnpm exec lhci autorun --collect.url=https://signalframe.culturedivision.com` | ✅ uses `lighthouserc.json` | ⬜ pending |
| 66-03-lhci-desktop | 03 | 3 | ARC-04 (LHCI desktop) | — | Lighthouse desktop a11y ≥0.97 on prod homepage | LHCI prod | `pnpm exec lhci autorun --config=.lighthouseci/lighthouserc.desktop.json --collect.url=https://signalframe.culturedivision.com` | ✅ uses desktop config | ⬜ pending |
| 66-03-path-h | 03 | 3 | ARC-03 (path_h removal) | T-66-05 (config rollback regression) | `_path_h_decision` block absent from `lighthouserc.json`; `categories:accessibility.minScore = 0.97` | structural (config-file query) | `pnpm exec playwright test tests/v1.9-phase66-lhci-config.spec.ts --grep path_h --project=chromium` | ❌ W0 | ⬜ pending |
| 66-03-path-i | 03 | 3 | ARC-04 (path_i removal) | T-66-05 (config rollback regression) | `_path_i_decision` block absent from desktop LHCI config | structural (config-file query) | `pnpm exec playwright test tests/v1.9-phase66-lhci-config.spec.ts --grep path_i --project=chromium` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/v1.9-phase66-decision-doc.spec.ts` — covers ARC-01 decision-doc presence (light schema test, copy pattern from `tests/v1.8-phase63-1-bundle-budget.spec.ts`)
- [ ] `tests/v1.9-phase66-arc-axe.spec.ts` — covers ARC-03 (target-size) + ARC-04 (color-contrast) via @axe-core/playwright; copy pattern from `tests/phase-38-a11y.spec.ts`
- [ ] `tests/v1.9-phase66-aes04-diff.spec.ts` — covers ARC-02 strict (desktop+tablet) + cohort capture (mobile+iphone13); copy pattern from `tests/v1.8-phase60-aes04-diff.spec.ts`
- [ ] `tests/v1.9-phase66-pillarbox-transform.spec.ts` — covers ARC-02 architectural assertion (computed-style query at `vw < 640`)
- [ ] `tests/v1.9-phase66-lhci-config.spec.ts` — covers ARC-03 + ARC-04 path_X_decision removal verification (read both `lighthouserc.json` files, assert blocks absent)
- [ ] `tests/v1.9-phase66-lcp-stability.spec.ts` — covers ARC-04 LCP candidate stability post-suppression (mobile + desktop, structural + LCP API check)
- [ ] `.planning/visual-baselines/v1.9-pre/` — full 5-route × 4-viewport capture before any source mutation (Plan 01 task; uses `tests/v1.8-baseline-capture.spec.ts` pattern)
- [x] **No new framework install** — `@axe-core/playwright`, `@playwright/test`, `@lhci/cli`, `pixelmatch`, `pngjs` all in devDeps already

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mid-phase mobile cohort review — "feels different without specific code-change cause" | ARC-02 (mobile cohort) | Aesthetic judgement against AES-03 cohort review standing rule; cannot be automated | After Plan 02 ships pillarbox, cohort opens `.planning/visual-baselines/v1.9-pre/mobile-360x800/*.png` side-by-side with new captures from same viewport. Approve or escalate. Decision recorded in `66-COHORT-REVIEW.md`. |
| 6-pillar visual audit (structure / hierarchy / contrast / spacing / alignment / motion) for Plan 01 decision-doc | ARC-01 | CRT critique convention — qualitative scoring; binary axe + pixel-diff don't capture register | Plan 01 attaches PASS verdict + per-pillar score table to `scale-canvas-track-b-decision.md` |
| `instrument-hud` positioning at native mobile scale (post-pillarbox) | ARC-02 | HUD reads `--sf-canvas-scale` — needs visual confirmation no overlap/clip with new layout | Plan 02 cohort-review checklist item; capture `mobile-360x800/index.png` with HUD visible |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (6 new spec files + 1 baseline directory)
- [ ] No watch-mode flags
- [ ] Feedback latency < 180 s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
