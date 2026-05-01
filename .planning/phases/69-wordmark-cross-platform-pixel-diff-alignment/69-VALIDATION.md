---
phase: 69
slug: wordmark-cross-platform-pixel-diff-alignment
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-30
---

# Phase 69 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `@playwright/test` (already installed) |
| **Config file** | `playwright.config.ts` (no override; default per-platform snapshot routing) |
| **Quick run command** | `pnpm exec playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts --reporter=list` |
| **Full suite command** | `pnpm exec playwright test` |
| **Estimated runtime** | ~5 seconds (single spec, 4 viewports + 1 structural) |

---

## Sampling Rate

- **After every task commit:** `pnpm exec playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts --reporter=list` (local darwin self-pass)
- **After every plan wave:** Same — single-spec phase
- **Before `/pde:verify-work`:** Local spec green AND first CI run after the path_decision commit lands shows green on `ubuntu-latest`
- **Max feedback latency:** ~5s local · CI run latency ~3-5 minutes for `ci.yml` to complete

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 69-01-01 | 01 | 1 | WMK-01 | — | `_path_decision` block (or `_wmk_01_decision`) present in spec with all 7 required fields | structural / grep | `grep -cE "decided:\|audit:\|original_threshold:\|new_threshold:\|rationale:\|evidence:\|review_gate:" tests/v1.8-phase63-1-wordmark-hoist.spec.ts` ≥ 7 | ✅ tests/v1.8-phase63-1-wordmark-hoist.spec.ts | ⬜ pending |
| 69-01-02 | 01 | 1 | WMK-01 | — | Threshold value at line 71 reflects chosen path (0.001 retain OR 0.005 loosen) | structural / grep | `grep -E "maxDiffPixelRatio:\s*0\.(001\|005)" tests/v1.8-phase63-1-wordmark-hoist.spec.ts` exits 0 with exactly 1 match | ✅ tests/v1.8-phase63-1-wordmark-hoist.spec.ts | ⬜ pending |
| 69-01-03 | 01 | 1 | WMK-02 | — | Local darwin spec self-passes against `chromium-darwin` baselines under chosen threshold | integration / visual | `pnpm exec playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts --reporter=list` exits 0 | ✅ existing 4 chromium-darwin baselines | ⬜ pending |
| 69-01-04 | 01 | 1 | WMK-02 | — | First CI run after path_decision commit lands shows green on `ubuntu-latest` (linux self-pass) | integration / CI | `gh run list --workflow=ci.yml --branch=<branch> --limit=1` reports `status: completed`, `conclusion: success` | ✅ existing 4 chromium-linux baselines + `.github/workflows/ci.yml` | ⬜ pending |
| 69-01-05 | 01 | 1 | WMK-01 + WMK-02 | — | AES-04 source files NOT touched | structural / git | `git diff --name-only HEAD~1..HEAD \| grep -E "(v1.8-phase59-pixel-diff\|v1.8-phase61-bundle-hygiene)\.spec\.ts"` returns no output (i.e. neither file modified) | ✅ both AES-04 specs exist and remain untouched | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

> Optional Pattern D schema spec (`tests/v1.9-phase69-wmk-decision.spec.ts`) — if planner adopts, add row 69-01-06 with `pnpm exec playwright test tests/v1.9-phase69-wmk-decision.spec.ts -x` exits 0.

---

## Wave 0 Requirements

- [ ] **NOT REQUIRED** — no test framework install, no shared fixtures, no test config additions. Phase 69 inherits all infrastructure from existing project state (`@playwright/test`, `playwright.config.ts`, `.github/workflows/ci.yml`, 8 baseline PNGs already on disk).
- [ ] **OPTIONAL** `tests/v1.9-phase69-wmk-decision.spec.ts` — Pattern D schema test mirroring `tests/v1.9-phase66-lhci-config.spec.ts`. Authored only if planner wants mechanical schema guard against silent deletion of the path_decision block. ~30 LOC.

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| First fresh CI run on `ubuntu-latest` shows green | WMK-02 | Local Playwright on darwin cannot exercise `chromium-linux` baselines; only the CI runner does. The green-tick is the actual measurement. | After committing path_decision block, push to a branch (or main). Wait for `ci.yml` workflow run. Confirm via `gh run watch` or `gh run list --workflow=ci.yml --limit=1` that `conclusion: success`. Record run ID + URL in plan SUMMARY.md. |
| Path A vs Path B final selection | WMK-01 | Decision is judgment call between trademark-tightness (Path A) vs measured CI variance (Path B). Researcher recommends Path A; Plan author may flip if first CI run shows variance >0.001. | If first CI run after writing the Path A decision block FAILS (variance > 0.001), revise the decision block to Path B (`new_threshold: 0.005`, line 71 = `0.005`), commit, re-push, await second CI run. |

*All other phase behaviors have automated verification (grep + Playwright local + CI gh run).*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies (5/5 automated; 0 Wave 0)
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify (all tasks 69-01-0X have automated)
- [ ] Wave 0 covers all MISSING references (none — no Wave 0 needed)
- [ ] No watch-mode flags (Playwright runs `--reporter=list`, no `--watch`)
- [ ] Feedback latency < 5s local · ~3-5 min CI
- [ ] `nyquist_compliant: true` set in frontmatter (set during plan-checker pass)

**Approval:** pending
