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
| 61-01-01 | 01 | 1 | BND-02 (radix-ui) | — | optimizePackageImports includes "radix-ui"; build succeeds | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build` then `grep '"radix-ui"' next.config.ts` | ✅ | ⬜ pending |
| 61-01-02 | 01 | 1 | BND-02 (input-otp) | — | optimizePackageImports includes "input-otp"; build succeeds | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build` then `grep '"input-otp"' next.config.ts` | ✅ | ⬜ pending |
| 61-01-03 | 01 | 1 | BND-02 (Plan 01 measurement log) | — | RESEARCH.md per-package re-run table populated for builds A+B | static-grep | `grep -E "Build (A\|B)/" .planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md` | ❌ W0 | ⬜ pending |
| 61-02-01 | 02 | 2 | BND-02 (cmdk + vaul) | — | optimizePackageImports includes "cmdk", "vaul"; build succeeds | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build` then `grep -E '"(cmdk\|vaul)"' next.config.ts` | ✅ | ⬜ pending |
| 61-02-02 | 02 | 2 | BND-02 (sonner + react-day-picker) | — | optimizePackageImports includes "sonner", "react-day-picker"; build succeeds | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build` then `grep -E '"(sonner\|react-day-picker)"' next.config.ts` | ✅ | ⬜ pending |
| 61-02-03 | 02 | 2 | BND-02 (Plan 02 measurement log) | — | RESEARCH.md per-batch re-run table populated for builds C+D | static-grep | `grep -E "Build (C\|D)/" .planning/phases/61-bundle-hygiene/61-02-RESEARCH-LOG.md` | ❌ W0 | ⬜ pending |
| 61-03-01 | 03 | 3 | BND-03 verify | — | sf/index.ts directive-free | static-grep | `grep -n "use client" components/sf/index.ts` exits 1 (zero matches) | ✅ | ⬜ pending |
| 61-03-02 | 03 | 3 | BND-04 measurement-protocol doc | — | Stale-chunk guard documented in 61-RESEARCH.md (§4) and replicated in each plan's RESEARCH-LOG.md | static-grep | `grep -E "rm -rf \\.next/cache \\.next" .planning/phases/61-bundle-hygiene/61-RESEARCH.md` returns ≥1 match | ✅ | ⬜ pending |
| 61-03-03 | 03 | 3 | BND-01 final gate | — | "Shared by all" ≤102 KB; ≥80% of 119 KiB unused JS budget reduced | build-output | `rm -rf .next/cache .next && ANALYZE=true pnpm build` then assertion via `tests/v1.8-phase61-bundle-hygiene.spec.ts` (parses Route table, asserts shared-JS ≤102 KB) | ❌ W0 | ⬜ pending |
| 61-03-04 | 03 | 3 | AES-04 (zero pixel-diff) | — | Pixel-diff vs `.planning/visual-baselines/v1.8-start/` MAX_DIFF_RATIO=0 (bundle hygiene is invisible) | visual-diff | `pnpm test tests/v1.8-phase61-bundle-hygiene.spec.ts` (Playwright pixel-diff against v1.8-start baseline frames at 4 viewports × 5 routes) | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/v1.8-phase61-bundle-hygiene.spec.ts` — clone of `tests/v1.8-phase59-pixel-diff.spec.ts` with `MAX_DIFF_RATIO = 0` and an additional sub-spec parsing `pnpm build` stdout for "Shared by all ≤102 KB" assertion
- [ ] `.planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md` — per-build measurement table created in Plan 01 Task 01 (template; populated incrementally per build A, B)
- [ ] `.planning/phases/61-bundle-hygiene/61-02-RESEARCH-LOG.md` — per-build measurement table created in Plan 02 Task 01 (template; populated per build C, D)

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
