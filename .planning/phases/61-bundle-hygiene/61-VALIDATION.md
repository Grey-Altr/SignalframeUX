---
phase: 61
slug: bundle-hygiene
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-26
---

# Phase 61 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Bundle hygiene is invisible by construction: gates are numeric (build artifacts) + static-grep + pixel-diff.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.x (existing, see `playwright.config.ts`) + Node assertions |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `pnpm test tests/v1.8-phase61-bundle-hygiene.spec.ts` (Wave 0 creates this; mirrors `tests/v1.8-phase59-pixel-diff.spec.ts` template) |
| **Full suite command** | `rm -rf .next/cache .next && ANALYZE=true pnpm build && pnpm test` |
| **Estimated runtime** | ~120 seconds (build ~60s + Playwright ~60s) |

---

## Sampling Rate

- **After every task commit:** Run `pnpm typecheck` (fast, build artifact-free)
- **After every plan wave:** Run `rm -rf .next/cache .next && ANALYZE=true pnpm build` and capture "Route (app)" stdout table; commit measurement to plan RESEARCH.md log
- **Before `/pde:verify-work`:** Full suite must be green AND final gating build must show "Shared by all" ≤102 KB
- **Max feedback latency:** ~120 seconds (full prod build + pixel-diff)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 61-01-00 | 01 | 1 | BND-02 (Build 0 baseline + log template) | — | 61-01-RESEARCH-LOG.md exists with row 0 populated (lucide-react-only baseline) | static-grep | `grep -E "^\| 0 *\| lucide-react" .planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md \| grep -v "TBD"` | ❌ W0 | ⬜ pending |
| 61-01-01 | 01 | 1 | BND-02 (radix-ui) | — | optimizePackageImports includes "radix-ui"; Build A logged | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build` then `grep -F '"radix-ui"' next.config.ts` | ✅ | ⬜ pending |
| 61-01-02 | 01 | 1 | BND-02 (input-otp) | — | optimizePackageImports includes "input-otp"; Build B logged | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build` then `grep -F '"input-otp"' next.config.ts` | ✅ | ⬜ pending |
| 61-02-00 | 02 | 2 | BND-02 (Plan 02 log template + date-fns SKIP doc) | — | 61-02-RESEARCH-LOG.md exists with row B carry-over baseline + date-fns SKIP rationale | static-grep | `grep -F "date-fns" .planning/phases/61-bundle-hygiene/61-02-RESEARCH-LOG.md \| grep -i "skip\|default-optimized"` | ❌ W0 | ⬜ pending |
| 61-02-01 | 02 | 2 | BND-02 (cmdk + vaul) | — | optimizePackageImports includes "cmdk", "vaul"; Build C logged | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build` then `grep -E '"(cmdk\|vaul)"' next.config.ts` | ✅ | ⬜ pending |
| 61-02-02 | 02 | 2 | BND-02 (sonner + react-day-picker) | — | optimizePackageImports includes "sonner", "react-day-picker"; Build D logged | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build` then `grep -E '"(sonner\|react-day-picker)"' next.config.ts` | ✅ | ⬜ pending |
| 61-03-00 | 03 | 3 | AES-04 (Wave 0 — pixel-diff spec) | — | tests/v1.8-phase61-bundle-hygiene.spec.ts exists with MAX_DIFF_RATIO = 0 | static-grep | `grep -E "MAX_DIFF_RATIO\s*=\s*0\b" tests/v1.8-phase61-bundle-hygiene.spec.ts` | ❌ W0 | ⬜ pending |
| 61-03-01 | 03 | 3 | BND-03 verify + BND-04 doc gate | — | sf/index.ts directive-free; stale-chunk guard documented in 61-RESEARCH.md, 61-01-RESEARCH-LOG.md, 61-02-RESEARCH-LOG.md | static-grep | `grep -n "use client" components/sf/index.ts` exits 1 AND `grep -E "rm -rf \\.next/cache \\.next" .planning/phases/61-bundle-hygiene/61-{RESEARCH,01-RESEARCH-LOG,02-RESEARCH-LOG}.md` returns ≥3 matches | ✅ | ⬜ pending |
| 61-03-02 | 03 | 3 | BND-01 final gate + AES-04 pixel-diff (combined) | — | Final "Shared by all" ≤102 KB; reduction_percentage ≥80% (chunk 3302+7525 sum delta); pixel-diff spec exits 0 at MAX_DIFF_RATIO = 0 | build-output + visual-diff | `rm -rf .next/cache .next && ANALYZE=true pnpm build` (gate via Route (app) stdout, recorded manually in 61-03-FINAL-GATE.md) AND `pnpm exec playwright test tests/v1.8-phase61-bundle-hygiene.spec.ts --project=chromium` exits 0 | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/v1.8-phase61-bundle-hygiene.spec.ts` — clone of `tests/v1.8-phase59-pixel-diff.spec.ts` with `MAX_DIFF_RATIO = 0` (strict — bundle hygiene is invisible by construction). The "Shared by all ≤102 KB" assertion is performed manually in PLAN 03 Task 2 by extracting from `pnpm build` stdout (`/tmp/phase61-build-final.txt`) and recording PASS/FAIL into `61-03-FINAL-GATE.md` — NOT via a programmatic sub-spec assertion. This deliberate split avoids coupling the build invocation to the Playwright test runtime.
- [ ] `.planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md` — per-build measurement table created in PLAN 01 Task 0 (template populated with row 0 baseline; rows A, B added by Tasks 1, 2)
- [ ] `.planning/phases/61-bundle-hygiene/61-02-RESEARCH-LOG.md` — per-build measurement table created in PLAN 02 Task 0 (template carries Build B from Plan 01 as starting baseline; rows C, D added by Tasks 1, 2; date-fns SKIP rationale documented)
- [ ] `.planning/phases/61-bundle-hygiene/61-03-FINAL-GATE.md` — gate scorecard scaffold created in PLAN 03 Task 0 with placeholders for BND-01, BND-03, BND-04, AES-04 verdicts; populated by Tasks 1 and 2

*Existing infrastructure covers everything else: Playwright 1.x already configured, `pixelmatch` + `pngjs` already installed, baselines already present at `.planning/visual-baselines/v1.8-start/`.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| User-perceivable performance regression check | BND-01 | LH score numerical assertion is in CIB phase scope; manual smoke confirms no perceptual hitch on `/`, `/system`, `/inventory` post-optimization | After Plan 03 final build: `pnpm build && pnpm start`, navigate to `/` on desktop + iPhone-13 emulation; confirm hero stagger reveal + GhostLabel feel unchanged vs pre-Phase-61. |

*All Phase 61 acceptance gates have automated verification; the above is a defense-in-depth subjective check, not a gating signal.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all `❌ W0` references
- [ ] No watch-mode flags (`--watch`, `--ui`) in commands
- [ ] Feedback latency < 180s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
