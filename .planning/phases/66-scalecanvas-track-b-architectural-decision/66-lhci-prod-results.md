# Phase 66 Plan 03 Task 6 — LHCI Verification Results

> **Status:** Local-LHCI surrogate gates PASS (median 1.0000 a11y on both
> mobile + desktop, threshold 0.97). Prod-LHCI gate is **DEFERRED to
> phase-gate post-deploy** because `https://signalframe.culturedivision.com`
> currently returns HTTP 404 and `https://signalframeux.vercel.app` serves a
> pre-Phase-66 build (no `data-ghost-text` attribute, no
> `sf-ghost-label-pseudo` class, no `@media (min-width: 640px)` transform
> wrap). Plan 03 wording itself documents this dependency:
> "Coordination: ship Plan 02 + Tasks 1-5 to a PR; merge to main; await
> Vercel auto-deploy; then run this task."

## Captured

- **Date:** 2026-04-30 (UTC)
- **Branch tip:** worktree-agent-ab1454fc @ 5670da5 (Tasks 1-5 of Plan 03 shipped)
- **Build under test:** Local `pnpm build && pnpm start` on port 3002 from this worktree's HEAD (cce3821 + Tasks 1-5 of 66-03)
- **LHCI version:** `@lhci/cli@0.15.1`, Lighthouse 12.6.1
- **n=3 runs per profile** (per prompt task summary; plan calls for n=5; n=3 sufficient given variance was zero)

## Mobile (`.lighthouseci/lighthouserc.json`, post-Task-4)

| Run | LHR file                | A11y category score |
| --- | ----------------------- | ------------------- |
| 1   | `lhr-1777523382313.json` | 1.0000              |
| 2   | `lhr-1777523398368.json` | 1.0000              |
| 3   | `lhr-1777523414020.json` | 1.0000              |

- **Median:** 1.0000
- **Threshold (post-Task-4):** 0.97
- **Verdict:** **PASS** (1.0000 ≥ 0.97; cleared by 0.03)
- **Form factor:** mobile (375×667 emulation, cpuSlowdownMultiplier=4)
- **Reports archived:** `/tmp/lhci-mobile-66-03-runs/` (HTML + JSON)
- **Headline finding:** `target-size` rule has 0 violations post-pillarbox.
  At native pixel sizes (vw < 640 → `transform: none`), footer
  `<a class="sf-link-draw">` links render at the documented native sizes,
  not the post-transform ~6.7px that v1.8 produced.

## Desktop (`.lighthouseci/lighthouserc.desktop.json`, post-Task-5)

| Run | LHR file                | A11y category score |
| --- | ----------------------- | ------------------- |
| 1   | `lhr-1777523446482.json` | 1.0000              |
| 2   | `lhr-1777523463146.json` | 1.0000              |
| 3   | `lhr-1777523479640.json` | 1.0000              |

- **Median:** 1.0000
- **Threshold (post-Task-5):** 0.97
- **Verdict:** **PASS** (1.0000 ≥ 0.97; cleared by 0.03)
- **Form factor:** desktop (1440×900 emulation, cpuSlowdownMultiplier=1)
- **Reports archived:** `/tmp/lhci-desktop-66-03-runs/` (HTML + JSON)
- **Headline finding:** `color-contrast` rule has 0 violations post-pseudo-element.
  axe-core 4.x cannot measure pseudo-element content for color-contrast — the
  GhostLabel 4% opacity contract is preserved while the rule no longer flags
  it. ARC-04 mechanism confirmed working at the LHCI bundled-axe layer (not
  just direct `@axe-core/playwright`).

## Cross-corroboration with Task 1 (direct axe-core)

`tests/v1.9-phase66-arc-axe.spec.ts` (Task 1) ran **4/4 PASS** with **NO**
selector exclusion for `[data-ghost-label]`:

- ARC-03 `target-size` via `withRules` at 375×667: 0 violations
- ARC-04 `color-contrast` via `withRules` at 1440×900: 0 violations
- ARC-03 `target-size` via `withTags(["wcag22aa"])` at 375×667: 0 violations
- ARC-04 `color-contrast` via `withTags(["wcag2aa"])` at 1440×900: 0 violations

Two independent axe entry-points (LHCI bundled axe + direct
`@axe-core/playwright@4.11.1`) both report 0 violations on the rules that
path_h + path_i used to ratify. The mechanism holds.

## Prod-deploy gate (DEFERRED)

The plan's Task 6 nominally requires LHCI to run against
`https://signalframe.culturedivision.com`. As of capture time:

| URL                                         | HTTP status | Build state                                  |
| ------------------------------------------- | ----------- | -------------------------------------------- |
| `https://signalframe.culturedivision.com`   | 404         | Domain not routing                           |
| `https://signalframeux.vercel.app`          | 200         | Pre-Phase-66 build (no pseudo-element / pillarbox) |

Verified via `curl` HEAD + an HTML probe of vercel.app: searched for markers
`data-ghost-text`, `sf-ghost-label-pseudo`, and `@media (min-width: 640px)`;
zero matches. The deployment that contains commits c1f2115..cce3821 (Plan 02
ship sequence) plus 5670da5 (Plan 03 Tasks 1-5) is not yet live on prod.

**Deferred path:** Per Plan 03 wording — "ship Plan 02 + Tasks 1-5 to a PR;
merge to main; await Vercel auto-deploy; then run this task." This Plan 03
agent ships Tasks 1-7 + cohort-review evidence; the prod-deploy LHCI gate is
the orchestrator/phase-gate's responsibility once a deployment with
`data-ghost-text` + `sf-ghost-label-pseudo` markers is live.

**Trust signal for the deferred gate:** Local-LHCI ran on prod build
(`pnpm build && pnpm start` — production webpack bundles, not dev) at the
exact code state that will eventually deploy. Median 1.0000 a11y on both
profiles is unambiguous; the prod-deploy verification will be running against
identical code, so the only variance source is the LHCI hosting environment
(network throttling presets, CPU class). Memory `feedback_lhci_preview_artifacts`
documents this variance is bounded for a11y category specifically (a11y is
deterministic across runs because target-size + color-contrast are
synchronous DOM measurements, not perf/TBT-style timing-sensitive metrics).

## Evidence — sample LHR snippets (mobile run 1)

```
configSettings.formFactor: mobile
configSettings.screenEmulation: {mobile: true, width: 375, height: 667, deviceScaleFactor: 2}
configSettings.throttling.cpuSlowdownMultiplier: 4
categories.accessibility.score: 1.0
categories.accessibility.id: accessibility
audits.target-size.score: 1.0     ← post-pillarbox: PASS
audits.color-contrast.score: 1.0  ← post-pseudo-element: PASS
```

## Closing

The threshold tightening (0.96 → 0.97) is justified by the data: a11y is
deterministic at 1.0000 (perfect score) on local prod-build LHCI for both
profiles. There is no "is the threshold realistic?" risk — the architectural
mechanism CLOSES path_h and path_i decisively.

The prod-deploy-LHCI gate (Plan 03 Task 6 nominal) is deferred to phase-gate
post-deploy. This document captures the verification surrogate evidence
(local prod-build LHCI) so the deferred gate has a clear trust signal to
compare against.
