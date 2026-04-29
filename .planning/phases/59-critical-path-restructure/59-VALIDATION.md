---
phase: 59
slug: critical-path-restructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-25
---

# Phase 59 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Authoritative test architecture in `59-RESEARCH.md` §"Validation Architecture" (L568-642). This doc is the per-task sampling contract; planner fills the table once plans are written.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright `^1.59.1` (`package.json:129`) |
| **Config file** | `playwright.config.ts` (existing) — headless Chromium SwiftShader WebGL |
| **Quick run command** | `pnpm exec playwright test tests/v1.8-phase59-{plan}-*.spec.ts --project=chromium` |
| **Full suite command** | `pnpm exec playwright test tests/v1.8-phase59-*.spec.ts --project=chromium` |
| **Build target** | `pnpm build && pnpm start` (production) — NOT `pnpm dev` (font-display + script-inlining only behave correctly under prod build) |
| **LHCI gate (per-PR)** | Vercel preview `deployment_status` event → `.github/workflows/lighthouse.yml` (mobile + desktop). Merge blocked by branch-protection rule `audit`. |
| **Estimated runtime** | ~45 s phase suite locally; ~3 min full LHCI median-of-5 on Vercel |

---

## Sampling Rate

- **After every task commit:** Plan-specific quick run (`pnpm exec playwright test tests/v1.8-phase59-{plan}-*.spec.ts --project=chromium`) + the cross-plan PF-04 grep guard (`grep -F "autoResize: true" components/layout/lenis-provider.tsx`).
- **After every plan wave:** Full Phase 59 suite green + LHCI median-of-5 ≥ 97 on Vercel preview (auto-triggered).
- **Phase gate (`/pde:verify-work 59`):**
  - All three plans merged in CRT-05 bisect order (A → B → C)
  - Pixel-diff full suite green vs `.planning/visual-baselines/v1.8-start/` (Plan B post-rebaseline as AES-02 documented exception)
  - Slow-3G screen recording artifact committed (`test-results/.../*.webm`)
  - `AESTHETIC-OF-RECORD.md` Change Log entry committed with commit SHA + justification
- **Max feedback latency:** ~45 s local, ~3 min CI (LHCI dominant).

---

## Per-Task Verification Map

> Plans are not yet written; this table will be filled by the planner. Source-of-truth mapping for **per-CRT** behaviors lives in `59-RESEARCH.md` §"Per-Plan Phase Requirements → Test Map" (L596-610). After plans land, copy that table here and add `Task ID` / `Wave` columns.

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 59-A-01 | A | 1 | CRT-01 | integration (CLS PerformanceObserver + network filter) | `pnpm exec playwright test tests/v1.8-phase59-canvas-sync-inline.spec.ts --project=chromium` | ❌ Wave 0 | ⬜ pending |
| 59-A-02 | A | 1 | CRT-01 (pixel-diff regression check) | integration | `pnpm exec playwright test tests/v1.8-phase59-pixel-diff.spec.ts --project=chromium` | ❌ Wave 0 (extends Phase 58 fixture) | ⬜ pending |
| 59-B-01 | B | 2 | CRT-02 (subset size) | smoke | `test $(wc -c < app/fonts/Anton-Regular.woff2) -le 20480` | n/a | ⬜ pending |
| 59-B-02 | B | 2 | CRT-02 (codepoint coverage) | integration | `pnpm exec playwright test tests/v1.8-phase59-anton-subset-coverage.spec.ts --project=chromium` | ❌ Wave 0 | ⬜ pending |
| 59-B-03 | B | 2 | CRT-03 (CLS=0 on slow-3G swap) | integration (CDP throttling + PerformanceObserver) | `pnpm exec playwright test tests/v1.8-phase59-anton-swap-cls.spec.ts --project=chromium` | ❌ Wave 0 | ⬜ pending |
| 59-B-04 | B | 2 | CRT-03 (slow-3G screen recording) | manual + Playwright `video: "on"` | same spec, `--reporter=list` | output: `test-results/.../*.webm` | ⬜ pending |
| 59-B-05 | B | 2 | CRT-03 (pixel-diff w/ AES-02 exception) | integration | `pnpm exec playwright test tests/v1.8-phase59-pixel-diff.spec.ts --project=chromium` | re-baselined per AES-02 exception | ⬜ pending |
| 59-C-01 | C | 3 | CRT-04 (PF-04 grep guard) | smoke (grep) | `grep -F "autoResize: true" components/layout/lenis-provider.tsx` | n/a | ⬜ pending |
| 59-C-02 | C | 3 | CRT-04 (deep-anchor scroll restore ≤ 2 frames) | integration | `pnpm exec playwright test tests/v1.8-phase59-lenis-ric.spec.ts --project=chromium` | ❌ Wave 0 | ⬜ pending |
| 59-C-03 | C | 3 | CRT-04 (`useLenisInstance()` null-window timing) | integration | same spec | ❌ Wave 0 | ⬜ pending |
| 59-ALL  | ALL | 1-3 | CRT-05 (per-PR LHCI ≥ 97) | LHCI workflow on Vercel preview | merge blocked by `audit` branch-protection check | n/a (operational) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

**Plan A (CRT-01):**
- [ ] `tests/v1.8-phase59-canvas-sync-inline.spec.ts` — covers CRT-01 (CLS=0 + no `/sf-canvas-sync.js` network request in production build)
- [ ] `tests/v1.8-phase59-pixel-diff.spec.ts` — extends `tests/v1.8-phase58-pixel-diff.spec.ts` to Phase 59 scope (reuse pixelmatch fixture)

**Plan B (CRT-02 + CRT-03):**
- [ ] `tests/v1.8-phase59-anton-subset-coverage.spec.ts` — every Anton consumer renders Anton-from-subset, no fallback face
- [ ] `tests/v1.8-phase59-anton-swap-cls.spec.ts` — slow-3G CDP throttling + CLS=0 + screen recording (`video: "on"`)
- [ ] `scripts/measure-anton-descriptors.mjs` — one-shot opentype.js measurement of `size-adjust` / `ascent-override` / `descent-override` / `line-gap-override`; output committed to plan body
- [ ] `.planning/visual-baselines/v1.8-pre-anton-swap/` — preserve original 20 PNGs before Plan B re-baselines

**Plan C (CRT-04):**
- [ ] `tests/v1.8-phase59-lenis-ric.spec.ts` — deep-anchor `/inventory#prf-08` scroll restore + `useLenisInstance()` null-window timing + PF-04 grep guard

**Framework install:** none — all tooling already present in `package.json`.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Slow-3G screen recording shows no measurable layout shift on ghost-label or THESIS during Anton swap event | CRT-03 | Screen recording is a human-eyeball verdict on top of the automated CLS=0 spec; provides forensic evidence for the AES-02 exception | Run `pnpm exec playwright test tests/v1.8-phase59-anton-swap-cls.spec.ts --project=chromium --reporter=list`, retrieve `test-results/.../*.webm`, scrub frame-by-frame at 0.25× through swap moment. |
| Chromatic re-baseline cohort review for Plan B | CRT-03 / AES-02 exception | Storybook Chromatic accept/reject is a stakeholder cohort decision, not a deterministic check | Run `pnpm chromatic`, review only stories that consume `--font-display`; reject any re-baseline that touches non-Anton stories. |
| Phase 58 HUMAN-UAT items 1+2 (Vercel deployments:write + main branch protection requiring `audit`) complete BEFORE Plan B opens | CRT-05 (Pitfall ζ in RESEARCH) | Without branch protection, LHCI failure on Plan B doesn't block merge → bisect protection collapses | Run `/pde:audit-uat`; confirm both items checked in `.planning/phases/58-lighthouse-ci-real-device-telemetry/58-HUMAN-UAT.md`. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags (Playwright runs once, exit code blocks)
- [ ] Feedback latency < 60 s local quick run
- [ ] `nyquist_compliant: true` set in frontmatter once plans are written and Per-Task table is fully populated

**Approval:** pending (will be approved post-plan-checker green by /pde:plan-phase 59 closing step)
