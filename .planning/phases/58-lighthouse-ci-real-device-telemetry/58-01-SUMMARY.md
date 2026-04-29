---
phase: 58
plan: 01
subsystem: ci-perf-gate
tags:
  - lhci
  - lighthouse
  - ci-gate
  - performance
  - infrastructure
  - cib-01
  - cib-02
requires:
  - "@lhci/cli (npm) — installed as devDep, runs Lighthouse 12.x in child process"
  - "pnpm 10.28.x (workspace package manager)"
  - "lighthouse@^13.1.0 — already devDep, untouched (CIB-04 lock; used by scripts/launch-gate.ts)"
provides:
  - ".lighthouseci/lighthouserc.json — mobile-emulation LHCI assertion config"
  - ".lighthouseci/lighthouserc.desktop.json — desktop-emulation LHCI assertion config"
  - "@lhci/cli@^0.15.1 binary at node_modules/.bin/lhci"
affects:
  - "Plan 02 GitHub Actions workflow (consumes both lighthouserc files via configPath:)"
  - ".gitignore — adds LHCI runtime artifact ignore rules"
tech-stack:
  added:
    - "@lhci/cli@^0.15.1 (devDep)"
  patterns:
    - "Dual-config form-factor pinning: mobile config drops `preset` entirely + pins explicit `screenEmulation`; desktop config keeps `preset: \"desktop\"`"
    - "Cold-start variance discipline: numberOfRuns: 5 + aggregationMethod: median-run"
    - "Environment-agnostic config: no `urls` field — workflow injects Vercel preview URL via --collect.url"
key-files:
  created:
    - ".lighthouseci/lighthouserc.json (60 lines)"
    - ".lighthouseci/lighthouserc.desktop.json (61 lines)"
  modified:
    - "package.json (one line added: `\"@lhci/cli\": \"^0.15.1\",`)"
    - "pnpm-lock.yaml (+1120 lines: @lhci/cli + transitive resolution graph)"
    - ".gitignore (+6 lines: LHCI runtime artifact ignore rules)"
decisions:
  - "Mobile config drops `preset` field entirely — earlier draft used `preset: \"desktop\"` together with `emulatedFormFactor: \"mobile\"`, producing a hybrid form factor. Now both `emulatedFormFactor: \"mobile\"` AND explicit `screenEmulation` (375×667 @ 2× DPR) are pinned, guaranteeing unambiguous mobile."
  - "Dual lighthouserc files (mobile primary + desktop variant) per OQ-04 lock — Phase 57 cross-viewport LCP divergence (mobile = THESIS GhostLabel, desktop = VL-05 // overlay) makes single-viewport gating insufficient."
  - "`upload.target: temporary-public-storage` (OQ-02 lock) — zero secret setup required for v0.1; LHCI_GITHUB_APP_TOKEN deferred to v1.8.1 if inline PR status comments needed."
  - "Two-Lighthouse-version coexistence accepted: existing `lighthouse@^13.1.0` (Node API import for scripts/launch-gate.ts) + new `@lhci/cli@^0.15.1` (bundles Lighthouse 12.x internally, child-process invocation). No version collision possible."
  - "Added `.lighthouseci/assertion-results.json` + `lhr-*` to .gitignore — Rule 3 deviation; LHCI dry-run regenerates these artifacts on every invocation, would otherwise pollute git status."
metrics:
  duration_seconds: 151
  duration_human: "~2.5 min"
  tasks_completed: 2
  files_created: 2
  files_modified: 3
  commits: 2
  completed_at: "2026-04-26T02:39:12Z"
---

# Phase 58 Plan 01: Lighthouse CI Foundation Summary

**One-liner:** Installs `@lhci/cli@^0.15.1` as devDep and ships dual lighthouserc configs (mobile primary + desktop variant) encoding the v1.8 cold-start variance discipline (`numberOfRuns: 5`, median-run aggregation, perf ≥0.97, LCP ≤1000ms, CLS ≤0, TBT ≤200ms) — the local-runnable half of the Phase 58 gate.

## What shipped

### Two new files

**`.lighthouseci/lighthouserc.json` (mobile primary, 60 lines)**
- `numberOfRuns: 5` with `aggregationMethod: "median-run"` on every assertion
- NO `preset` field (intentional — avoids hybrid form factor)
- `emulatedFormFactor: "mobile"` + explicit `screenEmulation: { mobile: true, width: 375, height: 667, deviceScaleFactor: 2, disabled: false }` (Lighthouse's canonical Moto-G-class mobile dims)
- `throttlingMethod: "simulate"` with `cpuSlowdownMultiplier: 4`, `rttMs: 40`, `throughputKbps: 10240`
- `disableStorageReset: false` (warmup discipline — browser disk cache warms across runs; CDN warmth supplied by Vercel readiness probe firing before `deployment_status:success`)
- `skipAudits: ["uses-http2"]` (defensive — Vercel edge already does HTTP/2)
- 7 assertions: `categories:performance` ≥0.97, `categories:accessibility` ≥0.97, `categories:best-practices` ≥0.97, `categories:seo` ≥1.0, `largest-contentful-paint` ≤1000ms, `cumulative-layout-shift` ≤0 (strict — milestone contract), `total-blocking-time` ≤200ms
- `upload.target: "temporary-public-storage"` (free LHCI hosted report viewer, 30-day retention)
- No `urls` field (workflow injects via `--collect.url` at invocation time — config is environment-agnostic)

**`.lighthouseci/lighthouserc.desktop.json` (desktop variant, 61 lines)**
- Same 7 assertions as mobile (identical thresholds)
- `preset: "desktop"` + `emulatedFormFactor: "desktop"` + explicit `screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }`
- `cpuSlowdownMultiplier: 1` (desktop has no CPU throttling — matches real-user desktop conditions)

### Three modified files

- **`package.json`**: one line added to `devDependencies`, alphabetical placement between `@gsap/react` and `@next/bundle-analyzer`:
  ```json
  "@lhci/cli": "^0.15.1",
  ```
- **`pnpm-lock.yaml`**: +1120 lines — `@lhci/cli@0.15.1` resolved with `integrity: sha512-yhC0oXnXqGHYy1xl4D8YqaydMZ/khFAnXGY/o2m/J3PqPa/D0nj3V6TLoH02oVMFeEF2AQim7UbmdXMiXx2tOw==` plus transitive dependency graph
- **`.gitignore`**: +6 lines — ignores LHCI runtime artifacts (`assertion-results.json`, `lhr-*.json`, `lhr-*.html`, `manifest.json`); keeps `lighthouserc*.json` tracked

### Confirmation: `lighthouse@^13.1.0` was NOT touched

Per CIB-04 lock, `scripts/launch-gate.ts` and its `lighthouse@^13.1.0` Node API dependency are read-only in Phase 58. Verified by:

```
$ git diff 9715648..HEAD -- scripts/launch-gate.ts
(empty output — exit 0)

$ cat package.json | jq -r '.devDependencies.lighthouse'
^13.1.0
```

The two Lighthouse versions coexist because LHCI 0.15.x bundles its own Lighthouse 12.x and forks a child process — it never imports from the host project's `node_modules/lighthouse`.

### Dry-run output proving schema validity

```
$ npx lhci assert --config=.lighthouseci/lighthouserc.json --dry-run
Checking assertions against 0 URL(s), 0 total run(s)

All results processed!
$ echo $?
0

$ npx lhci assert --config=.lighthouseci/lighthouserc.desktop.json --dry-run
Checking assertions against 0 URL(s), 0 total run(s)

All results processed!
$ echo $?
0
```

Both files exit 0 with no "unknown assertion" or "unknown audit" warnings — schema-valid against LHCI 0.15.x.

### pnpm install warnings encountered

One non-blocking advisory:

```
Ignored build scripts: esbuild@0.27.7, msw@2.12.14, sharp@0.34.5, unrs-resolver@1.11.1.
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

These are pre-existing transitive deps unrelated to `@lhci/cli` — pnpm 10's secure default of disabling lifecycle scripts on transitive packages. No action required for this plan; they are not introduced by `@lhci/cli`.

No peer-dep mismatches reported.

## Acceptance criteria — final state

| Criterion | Status |
|-----------|--------|
| `@lhci/cli@^0.15.1` in `devDependencies` (caret-major pinned) | ✅ |
| `lighthouse@^13.1.0` retained in `devDependencies` (CIB-04) | ✅ |
| `pnpm-lock.yaml` includes `@lhci/cli` resolution with sha512 integrity hash | ✅ |
| `node_modules/.bin/lhci --version` exits 0 and prints `0.15.1` | ✅ |
| `npx lhci --version` exits 0 and prints `0.15.1` | ✅ |
| Diff against HEAD shows exactly one added devDep line in `package.json` | ✅ |
| Runtime `dependencies` block unchanged (verified via JSON deep-equal) | ✅ |
| `peerDependencies` block unchanged (verified via JSON deep-equal) | ✅ |
| `.lighthouseci/lighthouserc.json` exists and is valid JSON | ✅ |
| `.lighthouseci/lighthouserc.desktop.json` exists and is valid JSON | ✅ |
| Mobile config: `preset == null`, `emulatedFormFactor == "mobile"`, `screenEmulation.mobile == true`, `screenEmulation.width == 375`, `deviceScaleFactor == 2` | ✅ |
| Desktop config: `preset == "desktop"`, `emulatedFormFactor == "desktop"`, `screenEmulation.width == 1440` | ✅ |
| Both files: `numberOfRuns == 5`, `aggregationMethod == "median-run"` on every assertion | ✅ |
| Both files: perf ≥0.97, a11y ≥0.97, best-practices ≥0.97, SEO ≥1.0, LCP ≤1000, CLS ≤0, TBT ≤200 | ✅ |
| Both files: `upload.target == "temporary-public-storage"` | ✅ |
| Both files: no `urls` field, no `LHCI_GITHUB_APP_TOKEN` reference | ✅ |
| `npx lhci assert --config=<each> --dry-run` exits 0 with no warnings | ✅ |
| `scripts/launch-gate.ts` diff against HEAD is empty (CIB-04 lock) | ✅ |
| All 4 OQ resolutions (OQ-02, OQ-04, OQ-05, OQ-06) documented in plan `notes` | ✅ |

## Deviations from Plan

### Auto-fixed issues

**1. [Rule 3 — Blocking] Added `.lighthouseci/assertion-results.json` to .gitignore**

- **Found during:** Task 2 (post-dry-run verification)
- **Issue:** `npx lhci assert --dry-run` writes an empty `[]` `assertion-results.json` artifact to `.lighthouseci/` on every invocation. Without a gitignore rule, this artifact would clutter `git status` and risk accidental commits during future LHCI work.
- **Fix:** Added a `.gitignore` block ignoring `.lighthouseci/assertion-results.json`, `.lighthouseci/lhr-*.json`, `.lighthouseci/lhr-*.html`, `.lighthouseci/manifest.json`. The two `lighthouserc*.json` config files remain tracked (negative-pattern not needed because the ignore rules are file-specific, not directory-wide).
- **Files modified:** `.gitignore` (+6 lines including section header)
- **Verification:** `git check-ignore -v .lighthouseci/assertion-results.json` → exit 0, matches rule on `.gitignore:54`. `git ls-files --others --exclude-standard -- .lighthouseci/` returns only the two lighthouserc files.
- **Commit:** `36b239f` (folded into Task 2 commit since it's a hygiene byproduct of the same task)

### Authentication gates

None — Plan 01 ships local-only artifacts (devDep + JSON config). No network, no SaaS, no auth surfaces.

## Commits

| # | Task | Hash | Message |
|---|------|------|---------|
| 1 | Task 1 — install @lhci/cli devDep | `e527ace` | `Chore(58-01): install @lhci/cli@^0.15.1 as devDep` |
| 2 | Task 2 — write lighthouserc configs (mobile + desktop) + gitignore hygiene | `36b239f` | `Feat(58-01): add lighthouserc configs (mobile primary + desktop variant)` |

## Downstream

Plan 02 (Wave 2) consumes both lighthouserc files via `treosh/lighthouse-ci-action@v12` `configPath:` input. The workflow invokes `lhci autorun` twice — once with `--config=.lighthouseci/lighthouserc.json` (mobile) and once with `--config=.lighthouseci/lighthouserc.desktop.json` (desktop) — both against `${{ github.event.deployment_status.target_url }}` listed exactly once per emulation (LHCI's `numberOfRuns: 5` does the per-URL run multiplication; URL duplication is explicitly avoided per OQ-05 lock).

## Self-Check: PASSED

- ✅ `.lighthouseci/lighthouserc.json` exists at expected path
- ✅ `.lighthouseci/lighthouserc.desktop.json` exists at expected path
- ✅ Commit `e527ace` exists in `git log` (Task 1)
- ✅ Commit `36b239f` exists in `git log` (Task 2)
- ✅ All 19 plan acceptance criteria green
- ✅ All 5 plan-level verification checks green (V1 schema, V2 thresholds, V3 lock-file integrity, V4 no devDep regression, V5 CIB-04 untouched)
- ✅ Runtime `dependencies` and `peerDependencies` blocks deep-equal between base (`9715648`) and HEAD
