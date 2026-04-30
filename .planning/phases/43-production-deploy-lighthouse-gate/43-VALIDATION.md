---
phase: 43-production-deploy-lighthouse-gate
slug: production-deploy-lighthouse-gate
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-29
reconstructed: true
reconstructed_from: [43-01-PLAN.md, 43-01-SUMMARY.md]
---

# Phase 43 — Validation Strategy

> Per-phase validation contract reconstructed post-hoc (State B) from PLAN + SUMMARY artifacts.
> Phase 43 shipped 2026-04-11 as a v1.6 gap-closure phase: tactical Vercel deploy + GSAP tree-shaking fix + Lighthouse gate against production. Original plan had no embedded test infrastructure references — by-convention manual captured-output methodology (precedent: PRF-03/04 in v1.7 retrospective).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (unit), Playwright (e2e), grep (config / module-shape), Lighthouse CLI (manual gate) |
| **Config file** | `vitest.config.ts`, `playwright.config.ts`, `scripts/launch-gate.ts` + `scripts/launch-gate-runner.mjs` |
| **Quick run command** | `grep -n "registerPlugin" lib/gsap-*.ts && grep -n "sideEffects" package.json` |
| **Full suite command** | `pnpm exec vitest run && pnpm exec playwright test` |
| **Lighthouse gate command** | `pnpm tsx scripts/launch-gate-runner.mjs <prod-url>` (manual, captured-output) |
| **Estimated runtime** | grep < 1s · vitest+playwright ~120s · Lighthouse 3-run gate ~3min |

---

## Sampling Rate

- **After every task commit:** Run grep commands for the touched sub-claim (sideEffects, registerPlugin shape, hero CSS fade-in)
- **Before phase close:** Lighthouse CLI 3-run worst against the live Vercel production URL, captured to a sign-off note
- **Max feedback latency:** grep < 1s; Lighthouse gate ~3min (manual)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Sub-Claim | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-----------|-------------------|--------|
| 43-01-01 | 01 | 1 | DIST-04 | (a) `sideEffects` field preserves GSAP `registerPlugin` side effects | grep | `grep -n '"sideEffects"' package.json` | green |
| 43-01-02 | 01 | 1 | DIST-04 | (b) `registerPlugin` calls unconditional in all `lib/gsap-*.ts` (no SSR guards in app code) | grep | `grep -n 'registerPlugin\|typeof window' lib/gsap-*.ts` | green |
| 43-01-03 | 01 | 1 | DIST-04 | (c) Hero CSS fade-in keyframe exists and is applied to entry-section h1 | grep | `grep -n '@keyframes hero-fade-in\|animation: hero-fade-in' app/globals.css` | green |
| 43-01-04 | 01 | 1 | DIST-04 | (d) Lighthouse gate ratified against production via captured-output sign-off | manual | `pnpm tsx scripts/launch-gate-runner.mjs <prod-url>` (3-run worst) | green (sign-off in SUMMARY) |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky · 🔵 manual*

---

## Sub-Claim Evidence

### (a) `sideEffects` field — package.json
**Decision intent (SUMMARY):** "`sideEffects: true` (replaces `sideEffects: [css-only]`) — GSAP `registerPlugin()` calls are side effects webpack must preserve."
**Reality observed (2026-04-29 post-hoc):** `package.json` lines 49–56 use the more precise allowlist form:

```json
"sideEffects": [
  "**/*.css",
  "./lib/gsap-core.ts",
  "./lib/gsap-draw.ts",
  "./lib/gsap-flip.ts",
  "./lib/gsap-plugins.ts",
  "./lib/gsap-split.ts"
]
```

**Verdict:** RATIFY REALITY (per `feedback_ratify_reality_bias`). Allowlist form is a strict superset of the SUMMARY's narrative `true` for the GSAP entry points and a subset for everything else — webpack still preserves `registerPlugin` side effects in every gsap-*.ts file. Decision intent satisfied; this is a later refinement, not a regression.

### (b) `registerPlugin` unconditional in app code
**Decision intent (SUMMARY):** "SSR guards reverted from `gsap-*.ts` — unnecessary for the app; only needed in `dist/` library output."
**Reality observed:**
- `lib/gsap-core.ts:12` — unconditional
- `lib/gsap-plugins.ts:14` — unconditional (the `typeof window` at line 45 is inside `initReducedMotion()`, an exported function called from a `useEffect`, not an SSR guard around `registerPlugin`)
- `lib/gsap-draw.ts:11` — unconditional
- `lib/gsap-flip.ts:15` — unconditional
- `lib/gsap-split.ts:17` — unconditional

**Verdict:** GREEN. Sub-claim satisfied.

### (c) Hero CSS fade-in
**Decision intent (SUMMARY):** "Hero CSS fade-in added — title was stuck at `opacity: 0.01` with no GSAP animation to reveal it. `hero-fade-in` keyframe (0.4s) on entry-section h1 and subtitle."
**Reality observed (`app/globals.css`):**
- Line 464–467: `@keyframes hero-fade-in { 0% { opacity: 0.01; } 100% { opacity: 1; } }`
- Line 496: `animation: hero-fade-in 0.4s var(--sfx-ease-default) both;`

**Verdict:** GREEN. Keyframe + 0.4s duration + `0.01 → 1` curve all match SUMMARY exactly.

### (d) Lighthouse gate captured-output
**Decision intent (SUMMARY):** Lighthouse 3-run worst against Vercel production URL: A11y 100/97, BP 100, SEO 100, Perf 92 (network-bound CLI methodology, not a code regression).
**Reality observed:** `scripts/launch-gate.ts` + `scripts/launch-gate-runner.mjs` exist as the canonical captured-output runner. The SUMMARY's results table at lines 47–54 is the sign-off artifact.

**Verdict:** GREEN (manual captured-output, by-convention sign-off — see `feedback_path_b_pattern` for the perf-92-as-CLI-artifact ratification precedent).

---

## Wave 0 Requirements

*None.* All sub-claims verify against existing files (`package.json`, `lib/gsap-*.ts`, `app/globals.css`, `scripts/launch-gate*`) — no new infrastructure required for Phase 43.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Lighthouse 3-run worst on Vercel production | DIST-04 (d) | Network-bound; remote URL; CLI methodology variance | Run `pnpm tsx scripts/launch-gate-runner.mjs https://signalframeux.vercel.app` three times; record worst-of-three for A11y / BP / SEO / Perf; capture in a SIGNOFF note alongside SUMMARY (PRF-03 v1.7 precedent) |
| Console clean on Vercel production (no `TypeError: M is not a function`) | DIST-04 (a) | Production-only artifact (depends on webpack treeshake of deployed bundle, not local) | Open https://signalframeux.vercel.app in a clean Chrome profile; DevTools Console; reload; assert zero red errors during initial paint + first scroll |
| Hero title visibly fades in on first paint (no `opacity: 0.01` stuck state) | DIST-04 (c) | Subjective visual — the failure mode was an invisible h1 | Hard-reload home; observe h1 going from invisible → fully visible across ~0.4s; subtitle follows; no flash-of-unstyled-content |

---

## Validation Sign-Off

- [x] All sub-claims have automated grep verify or proper Manual-Only entry
- [x] Sampling continuity: 3 of 4 sub-claims grep-verifiable (>0.75 automated coverage)
- [x] Wave 0 covers all MISSING references (none — all verifiers point at existing files)
- [x] No watch-mode flags
- [x] Feedback latency < 20s for grep tier; Lighthouse gate is by-convention manual
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-29 (post-hoc reconstruction) — Phase 43 was a tactical v1.6 gap-closure phase; tree-shaking + CSS fade-in + Lighthouse gate are by-convention captured-output + grep-verifiable; one ratify-reality note on `sideEffects` allowlist supersedes the original `true` (decision intent preserved, see sub-claim (a) evidence).
