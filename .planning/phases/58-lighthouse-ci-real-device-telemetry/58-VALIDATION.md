---
phase: 58
slug: lighthouse-ci-real-device-telemetry
status: planned
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-26
last_updated: 2026-04-26
---

# Phase 58 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Phase 58 is infrastructure-only: no Wave 0 test scaffolding required.
> All verification is via existing tooling (jq, lhci dry-run, Playwright, tsc, curl).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (existing) + jq (CLI) + LHCI 0.15.x dry-run + tsc + node js-yaml/python yaml |
| **Config file** | `playwright.config.ts` (existing); `.lighthouseci/lighthouserc.json` (Plan 01 output) |
| **Quick run command** | `pnpm exec tsc --noEmit && jq -e . .lighthouseci/lighthouserc.json` |
| **Full suite command** | `pnpm build && pnpm start & sleep 10 && pnpm exec playwright test tests/v1.8-phase58-*.spec.ts tests/v1.8-web-vitals.spec.ts --project=chromium && kill %1` |
| **Estimated runtime** | ~6 min (full suite incl. pnpm build + 4 Playwright specs) — quick run ~10 s |

---

## Sampling Rate

- **After every task commit:** Run quick run command (`tsc --noEmit` + `jq` config check)
- **After every plan wave:** Run full suite (Playwright across 4 specs + curl smoke-tests)
- **Before `/pde:verify-phase`:** Full suite must be green; `git diff merge-base..HEAD -- scripts/launch-gate.ts` must be empty (CIB-04)
- **Max feedback latency:** Quick run ≤ 15s; full suite ~6 min (within Nyquist 58s for the per-task signal — full suite is the per-wave signal)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 58-01-01 | 01 | 1 | CIB-01 | T-DEP-01 | `@lhci/cli@^0.15.1` pinned via caret-major; lockfile integrity SHA-512 verified | unit | `cat package.json \| jq -e '.devDependencies["@lhci/cli"] \| test("^\\^0\\.15\\.")' && node_modules/.bin/lhci --version` | ✅ existing | ⬜ pending |
| 58-01-02 | 01 | 1 | CIB-02 | T-CFG-01 | Numeric thresholds locked verbatim from RESEARCH; mobile config drops `preset` + pins explicit `screenEmulation` (375×667 @ 2× DPR) for unambiguous mobile form factor; jq re-greps each value to detect drift | schema | `jq -e '.ci.collect.settings.preset == null and .ci.collect.settings.screenEmulation.mobile == true and .ci.collect.settings.screenEmulation.width == 375' .lighthouseci/lighthouserc.json && npx lhci assert --config=.lighthouseci/lighthouserc.json --dry-run && npx lhci assert --config=.lighthouseci/lighthouserc.desktop.json --dry-run` | ✅ existing | ⬜ pending |
| 58-02-01 | 02 | 2 | CIB-03 | T-CI-01 | Workflow trigger is `on: deployment_status` only; `pull_request_target` grep returns 0; target URL listed EXACTLY ONCE per emulation (LHCI's `numberOfRuns: 5` does the per-URL run multiplication — duplication would explode runtime); `timeout-minutes: 15` calibrated for 10 measured runs + setup overhead | unit + lint | `node -e "require('js-yaml').load(require('fs').readFileSync('.github/workflows/lighthouse.yml','utf8'))" && grep -c "pull_request_target" .github/workflows/lighthouse.yml \| grep -q "^0$" && grep -c "timeout-minutes: 15" .github/workflows/lighthouse.yml \| grep -q "^1$"` | ✅ existing | ⬜ pending |
| 58-02-02 | 02 | 2 | CIB-05 | T-CSP-01 | Stable module-scope sendToAnalytics; sendBeacon to same-origin only; CSP forward-compat documented | e2e (Playwright) | `pnpm exec playwright test tests/v1.8-web-vitals.spec.ts --project=chromium` | ✅ this task creates | ⬜ pending |
| 58-02-03 | 02 | 2 | CIB-05 | T-RUM-01 / T-RUM-02 | 2KB cap, JSON-only Content-Type, URL query-string strip, Authorization header NEVER read at any call-site (call-site-targeted regex; documentary mention in JSDoc is permitted) | e2e (curl) + unit | `curl -sS -X POST -H 'Content-Type: application/json' -d '{"name":"LCP","value":850,"id":"x","url":"http://h/?q=1"}' http://localhost:3000/api/vitals -w '%{http_code}' \| grep -q "200$" && grep -cE "headers\\.get\\(['\\\"][Aa]uthorization" app/api/vitals/route.ts \| grep -q "^0$"` | ✅ this task creates | ⬜ pending |
| 58-02-04 | 02 | 2 | CIB-05 | — | Two content-targeted additions to layout.tsx (one import + one JSX); content-presence checks (NOT line counts — robust against pre-commit formatters) | unit | `git diff HEAD -- app/layout.tsx \| grep -cE '^\\+import \\{ WebVitals' \| grep -q "^1$" && git diff HEAD -- app/layout.tsx \| grep -cE '^\\+\\s*<WebVitals' \| grep -q "^1$" && pnpm exec tsc --noEmit` | ✅ existing | ⬜ pending |
| 58-02-05 | 02 | 2 | CIB-05 (visual regression) | — | Pixel-diff ≤ 0.5% on all 20 baselines (AES-04 standing rule) | e2e (Playwright) | `pnpm build && pnpm start & sleep 10 && pnpm exec playwright test tests/v1.8-phase58-pixel-diff.spec.ts --project=chromium && kill %1` | ✅ this task creates | ⬜ pending |
| 58-02-06a | 02 | 2 | CIB-05 (LCP perturbation) | — | LCP element identity unchanged: mobile = GhostLabel, desktop = VL-05 // overlay; plain-substring `toContain()` checks against the dot-joined raw className (Tailwind arbitrary brackets/slashes appear LITERALLY, NOT CSS-escaped); both viewports assert `not.toBe('(no-lcp-captured)')` BEFORE substring checks to guard against the PerformanceObserver-timeout vacuous-pass | e2e (Playwright) | `pnpm exec playwright test tests/v1.8-phase58-lcp-guard.spec.ts --project=chromium` | ✅ this task creates | ⬜ pending |
| 58-02-06b | 02 | 2 | CIB-04 | T-EXEC-01 | `scripts/launch-gate.ts` SHA at HEAD equals SHA at merge-base; uses `execFileSync` (no shell) | e2e (Playwright) | `pnpm exec playwright test tests/v1.8-phase58-launch-gate-untouched.spec.ts --project=chromium` | ✅ this task creates | ⬜ pending |
| 58-02-07 | 02 | 2 | CIB-03 (operational) | — | Branch protection rule requires `audit` check; Vercel GH App has deployments:write | manual (checkpoint) | (human-action — see PLAN 02 Task 7) | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

**No Wave 0 test scaffolding required.** Phase 58 is infrastructure-only and reuses existing test infrastructure:
- `@playwright/test` (already in devDeps — used by Phase 57 baseline-capture and lcp-diagnosis specs)
- `pnpm exec tsc --noEmit` (existing TypeScript compilation check)
- `jq` (system tool — used for JSON config validation)
- `js-yaml` / `python3 yaml` (transitive devDep / system fallback for YAML parse)
- `curl` (system tool — endpoint smoke-tests)
- `git` (system tool — used by CIB-04 launch-gate-untouched spec via `execFileSync`)

**ONE devDep addition is permitted in Plan 02 Task 5** (pixel-diff): `pixelmatch` + `pngjs` + types. These are Playwright-companion pixel-comparison helpers (NOT runtime deps, NOT SaaS) and are fully compliant with the milestone's "no new runtime npm dep" constraint. If they are added, the Plan 02 SUMMARY must document them.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel GitHub App has `deployments: write` permission on this repo | CIB-03 (operational) | Repo settings — Claude has no GitHub App config API token in this environment | GitHub → repo → Settings → GitHub Apps → Vercel → Configure → confirm Deployments: Read & write |
| Branch protection rule on `main` requires `audit` check | CIB-03 (operational) | Repo settings — same constraint | GitHub → repo → Settings → Branches → Branch protection rules → main → Require status checks → add `audit` (after first workflow run) |
| Workflow `Lighthouse / audit` actually triggers within ~3 min of Vercel preview deploy_status:success | CIB-03 (smoke test) | Requires opening a real PR and observing GitHub Actions tab | Open trivial PR → wait for Vercel preview success → confirm new run of Lighthouse workflow appears within 3 min |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies (no Wave 0 needed — see above)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify (every task has either an automated verify or is the human-action checkpoint Task 7)
- [x] Wave 0 covers all MISSING references (N/A — none missing; existing infra covers all)
- [x] No watch-mode flags
- [x] Feedback latency < 58s for per-task signal (full suite is per-wave signal at ~6 min)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-26 (planner — pde-planner-phase) · revised 2026-04-26 (checker iteration 1: warmup math, LCP-guard escape strings, Authorization grep specificity, layout.tsx diff brittleness, mobile lighthouserc preset/screenEmulation)
