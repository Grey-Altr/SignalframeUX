---
phase: 58
status: human_needed
score: 11/11 must-haves verified (code-side); 2 deferred external repo-settings items
must_haves_verified: 11/11
requirements_covered: 5/5
human_verification_items: 2
verified: 2026-04-26
re_verification:
  previous_status: none
  previous_score: n/a
  gaps_closed: []
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Vercel GitHub App holds deployments:write on this repo (OQ-01)"
    expected: "Open a trivial PR; within ~3 min of Vercel's preview success, the Lighthouse workflow appears in the Actions tab. If absent, fall back to pull_request + vercel/wait-for-vercel-deployment per 58-02-PLAN notes."
    why_human: "Repo Settings UI / GitHub App config — Claude has no GitHub App config API token in this environment. Tracked in 58-HUMAN-UAT.md."
  - test: "Branch protection on `main` requires the `audit` check (OQ-03 / CIB-03 operational)"
    expected: "Open a PR with an artificially regressed perf score (e.g., import a 200KB unused dep). The Merge button is blocked by the failing Lighthouse `audit` check. The check only appears in the rule-search list AFTER one workflow run completes — do test 1 first."
    why_human: "GitHub repo Settings → Branches UI; not scriptable from this environment. Tracked in 58-HUMAN-UAT.md."
---

# Phase 58: Lighthouse CI + Real-Device Telemetry — Verification Report

**Phase Goal:** Stand up the durable per-PR enforcement gate (LHCI on Vercel preview URLs) and field RUM collection so Phase 59's CLS-protection-touching changes ship under measurement, not luck.

**Verified:** 2026-04-26
**Status:** `human_needed` — code-side gate is fully wired and locally green; 2 external repo-settings items remain (already tracked in 58-HUMAN-UAT.md).
**Re-verification:** No — initial verification.

---

## Goal Achievement

### Observable Truths (Plan 01 + Plan 02)

| #  | Truth | Status | Evidence |
| -- | ----- | ------ | -------- |
| 1  | `@lhci/cli@^0.15.1` installed as devDep; `npx lhci --version` exits 0 | VERIFIED | `package.json: "@lhci/cli": "^0.15.1"`; `node_modules/.bin/lhci --version` → `0.15.1` |
| 2  | `.lighthouseci/lighthouserc.json` parses against LHCI 0.15.x schema | VERIFIED | File exists (1611 bytes); `jq -e .` exits 0; per 58-01-SUMMARY dry-run exits 0 |
| 3  | lighthouserc encodes cold-start variance discipline (5 runs, median-run, perf ≥0.97, LCP ≤1000, CLS ≤0, TBT ≤200) | VERIFIED | `jq -e` confirms numberOfRuns=5, perf.minScore=0.97 + median-run, LCP=1000, CLS=0, TBT=200, upload.target=temporary-public-storage |
| 4  | lighthouserc runs against BOTH mobile and desktop emulation (per OQ-04) | VERIFIED | Mobile config: `emulatedFormFactor=mobile`, `preset=null`, `screenEmulation.width=375`. Desktop config: `emulatedFormFactor=desktop`, `screenEmulation.width=1440`. Both files present. |
| 5  | Opening a PR triggers Lighthouse workflow within ~3 min of Vercel deployment_status success | PARTIAL — code-side wired, repo-settings deferred | `on: deployment_status` set; `if: state == 'success' && contains(environment, 'Preview')`; smoke test requires Vercel GH App `deployments:write` (HUMAN-UAT #1) |
| 6  | Workflow runs LHCI mobile + desktop against Vercel preview; failure blocks merge | PARTIAL — workflow correct, branch-protection deferred | Two `treosh/lighthouse-ci-action@v12` invocations with `configPath: .lighthouseci/lighthouserc.json` and `lighthouserc.desktop.json`; merge-blocking requires branch protection rule (HUMAN-UAT #2) |
| 7  | `useReportWebVitals` fires LCP/CLS/INP/FCP/TTFB → sendBeacon → `/api/vitals` | VERIFIED | `app/_components/web-vitals.tsx` imports `useReportWebVitals` from `next/web-vitals`; calls `navigator.sendBeacon("/api/vitals", blob)`; keepalive fetch fallback |
| 8  | `/api/vitals` returns 200 for ≤2KB JSON, 400 for malformed/oversized; logs sanitized JSON | VERIFIED | Route exports POST + OPTIONS; `MAX_BYTES = 2048`; Content-Type gate; `stripUrl` drops `?...`/`#...`; `console.log(JSON.stringify(sanitized))`; Authorization header read count = 0 |
| 9  | `<WebVitals />` mount adds zero visible pixels (pixel-diff ≤0.5% on all 20 baselines) | VERIFIED | `tests/v1.8-phase58-pixel-diff.spec.ts` exists; 58-02-SUMMARY reports 20/20 PASSED against `.planning/visual-baselines/v1.8-start/` (20 baseline PNGs confirmed on disk) |
| 10 | LCP element identity unchanged on both viewports (mobile=GhostLabel, desktop=VL-05 //) | VERIFIED | `tests/v1.8-phase58-lcp-guard.spec.ts` exists; 58-02-SUMMARY reports 2/2 PASSED with both substring guards (`sf-display`/`top-1/2` mobile; `top-[0.08em]`/`pr-[0.28em]`/`tracking-[-0.12em]` desktop) and not-vacuous-pass guard |
| 11 | `scripts/launch-gate.ts` byte-identical to merge-base (CIB-04 lock) | VERIFIED | `git diff merge-base..HEAD -- scripts/launch-gate.ts` is empty; HEAD SHA `b41eed28...` equals merge-base SHA `b41eed28...`; spec `tests/v1.8-phase58-launch-gate-untouched.spec.ts` reports 1/1 PASSED |

**Score:** 11/11 truths verified at the code level. Truths 5–6 carry an operational tail (repo-settings) tracked in `58-HUMAN-UAT.md`.

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `package.json` | devDep `@lhci/cli@^0.15.1` | VERIFIED | `^0.15.1` (lighthouse@^13.1.0 retained per CIB-04) |
| `pnpm-lock.yaml` | resolved `@lhci/cli` with sha512 integrity | VERIFIED | per 58-01-SUMMARY |
| `.lighthouseci/lighthouserc.json` | mobile config | VERIFIED | 1611 bytes; jq passes all threshold checks |
| `.lighthouseci/lighthouserc.desktop.json` | desktop config | VERIFIED | 1643 bytes; jq passes all threshold checks |
| `.github/workflows/lighthouse.yml` | LHCI gate (deployment_status, mobile + desktop) | VERIFIED | 2848 bytes; deployment_status trigger; 2× treosh@v12; pull_request_target count = 0; timeout-minutes: 15 |
| `app/_components/web-vitals.tsx` | useReportWebVitals → sendBeacon | VERIFIED | 2742 bytes; Module-scope sendToAnalytics; sendBeacon('/api/vitals') + fetch keepalive fallback; renders null |
| `app/api/vitals/route.ts` | Node-runtime RUM sink | VERIFIED | 3463 bytes; POST + OPTIONS; 2KB cap; Content-Type gate; stripUrl; console.log(JSON.stringify(...)); zero Authorization reads |
| `app/layout.tsx` | `<WebVitals />` mount | VERIFIED | `import { WebVitals } from "./_components/web-vitals";` + `<WebVitals />` JSX confirmed |
| `tests/v1.8-phase58-pixel-diff.spec.ts` | AES-04 ≤0.5% gate | VERIFIED | 3452 bytes; 20/20 reported pass |
| `tests/v1.8-web-vitals.spec.ts` | sendBeacon contract | VERIFIED | 2815 bytes; 2/2 reported pass |
| `tests/v1.8-phase58-lcp-guard.spec.ts` | LCP identity guard | VERIFIED | 4618 bytes; 2/2 reported pass |
| `tests/v1.8-phase58-launch-gate-untouched.spec.ts` | CIB-04 SHA-identity guard | VERIFIED | 2246 bytes; 1/1 reported pass; SHA confirmed equal at HEAD and merge-base |

All 12 expected artifacts exist on disk and pass content-level checks.

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| `.lighthouseci/lighthouserc.json` | `@lhci/cli` | `lhci assert --config=... --dry-run` | WIRED | `node_modules/.bin/lhci --version` → `0.15.1`; per 58-01-SUMMARY dry-run exits 0 |
| `package.json` | `pnpm-lock.yaml` | `pnpm add -D @lhci/cli@^0.15.1` | WIRED | per 58-01-SUMMARY (sha512 integrity hash present) |
| `.github/workflows/lighthouse.yml` | `.lighthouseci/lighthouserc.json` | `treosh/lighthouse-ci-action@v12` `configPath:` input | WIRED | `configPath: .lighthouseci/lighthouserc.json` AND `configPath: .lighthouseci/lighthouserc.desktop.json` both present |
| `.github/workflows/lighthouse.yml` | Vercel preview URL | `github.event.deployment_status.target_url` | WIRED | `${{ github.event.deployment_status.target_url }}` injected as `urls:` per emulation |
| `app/_components/web-vitals.tsx` | `/api/vitals` | `navigator.sendBeacon` | WIRED | `navigator.sendBeacon("/api/vitals", blob)` confirmed; fetch keepalive fallback present |
| `app/layout.tsx` | `app/_components/web-vitals.tsx` | import + JSX mount | WIRED | import line + `<WebVitals />` JSX both present |
| `app/_components/web-vitals.tsx` | `next/web-vitals` | `useReportWebVitals` | WIRED | `import { useReportWebVitals } from "next/web-vitals"`; called with `sendToAnalytics` |

All 7 key links wired.

### Requirements Coverage

| REQ-ID | Source Plan | Description | Status | Evidence |
| ------ | ----------- | ----------- | ------ | -------- |
| CIB-01 | 58-01 | `@lhci/cli@^0.15.1` installed as devDep | SATISFIED | `package.json` devDep `@lhci/cli: ^0.15.1`; `lhci --version` → `0.15.1` |
| CIB-02 | 58-01 | `.lighthouseci/lighthouserc.json` with cold-start variance discipline (5 runs, median, perf ≥0.97, LCP ≤1000, CLS ≤0, TBT ≤200) | SATISFIED | `jq` checks all six thresholds and metadata pass on both mobile and desktop configs |
| CIB-03 | 58-02 | `.github/workflows/lighthouse.yml` runs LHCI on PR against Vercel preview via `treosh/lighthouse-ci-action@v12`; failure blocks merge | SATISFIED (code) / DEFERRED (operational) | Workflow file present + correct trigger + treosh@v12 (×2) + lighthouserc configs wired. Operational merge-blocking requires branch protection rule — HUMAN-UAT #2 |
| CIB-04 | 58-02 | `scripts/launch-gate.ts` retained unchanged for manual prod 100/100 verification | SATISFIED | Git diff vs merge-base empty; SHA equality confirmed (`b41eed28...`); Playwright spec passes |
| CIB-05 | 58-02 | `useReportWebVitals` ships LCP/CLS/INP/TTFB to self-hosted endpoint via `navigator.sendBeacon`; no third-party SaaS, no new runtime npm dep | SATISFIED | `web-vitals.tsx` uses `next/web-vitals` (zero new runtime dep) + sendBeacon → `/api/vitals`; `<WebVitals />` mounted in `app/layout.tsx`; pixelmatch/pngjs are devDeps only |

**Coverage:** 5/5 phase requirement IDs accounted for. No orphaned IDs (REQUIREMENTS.md maps CIB-01..CIB-05 to Phase 58 — all five are claimed by 58-01 (CIB-01, CIB-02) and 58-02 (CIB-03, CIB-04, CIB-05) frontmatter `requirements:` blocks).

### Anti-Patterns Found

None. Phase 58 REVIEW.md (depth: quick, 10 files reviewed) reports `findings_total: 0`. Re-spot-check during this verification:

- Workflow uses `on: deployment_status` (no `pull_request_target` — count 0)
- RUM endpoint never reads Authorization header (count 0)
- Test specs use `execFileSync` (no shell-form `exec` — confirmed in 58-02-SUMMARY)
- Three intentional Rule-1/Rule-3 deviations are documented in 58-02-SUMMARY (Metric type derivation, postDataBuffer fallback, T-CI-01 comment rephrasing) — all out-of-scope per REVIEW.md
- AES-04 pixel-diff (≤0.5% over 20 baselines): all 20 baseline PNGs present; spec reports 20/20 pass

No blockers. No warnings. No info-level concerns.

### Human Verification Required

The Phase 58 gate is fully wired and locally green. Two operational items remain that cannot be scripted from this environment — already captured in `.planning/phases/58-lighthouse-ci-real-device-telemetry/58-HUMAN-UAT.md` (status: partial, 2 pending):

#### 1. Vercel GitHub App holds `deployments:write` (OQ-01)

**Test:** open https://github.com/settings/installations → Vercel app → repository permissions on the SignalframeUX repo. Then open a trivial-change PR.
**Expected:** within ~3 min of Vercel's preview deployment success, the **Lighthouse** workflow appears in the Actions tab.
**Why human:** Repo Settings / GitHub App config UI; no API token available in this environment. Fallback path (`pull_request` + `vercel/wait-for-vercel-deployment`) is documented in `58-02-PLAN.md` notes if event proves unreliable.

#### 2. Branch protection on `main` requires the `audit` check (OQ-03)

**Test:** GitHub → repo → Settings → Branches → branch protection for `main` → "Require status checks to pass before merging" → require **`audit`** (job name in `.github/workflows/lighthouse.yml`). Then open a PR that intentionally regresses perf (e.g., import a 200KB unused dep).
**Expected:** Merge button blocked by the failing Lighthouse `audit` check.
**Why human:** GitHub Branches UI; the `audit` check name only appears in the rule-search list AFTER one workflow run has completed, so test #1 must run first.

### Gaps Summary

No code-side gaps. The phase ships a working LHCI workflow (deployment_status-triggered, mobile + desktop, treosh@v12), a self-hosted RUM client/endpoint pair (`useReportWebVitals` → `sendBeacon` → `/api/vitals` → `console.log`), four locked-down Playwright specs (pixel-diff, web-vitals contract, LCP-identity, launch-gate-untouched), and CIB-04 byte-identity confirmed by both git SHA equality and the Playwright guard.

The two outstanding items are GitHub repo-settings actions outside Claude's reach. They are persistently tracked in `58-HUMAN-UAT.md` and will be surfaced by `/pde:audit-uat` until the user actions them. Per the orchestration directive in 58-02-PLAN's `checkpoint_deferred_note`, the gate becomes operative the moment the user enables branch protection — no further code changes required.

---

_Verified: 2026-04-26_
_Verifier: Claude (gsd-verifier)_
