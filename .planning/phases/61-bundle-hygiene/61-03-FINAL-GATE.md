# 61-03 Final Gate — BND-01, BND-03, BND-04, AES-04

**Plan:** 61-03
**Phase:** 61 — Bundle Hygiene
**Captured:** 2026-04-26
**Source plans:** 61-01 (eager-path: radix-ui + input-otp), 61-02 (lazy-path: cmdk + vaul + sonner + react-day-picker)
**Final next.config.ts state:** `optimizePackageImports: ["lucide-react", "radix-ui", "input-otp", "cmdk", "vaul", "sonner", "react-day-picker"]`
**Build invocation contract:** `rm -rf .next/cache .next && ANALYZE=true pnpm build` (BND-04 stale-chunk guard mandatory)
**Gating source:** "Route (app)" stdout table from `pnpm build`. The `.next/analyze/client.html` chartData is FORBIDDEN as a gating source (ROADMAP success criterion 1).

---

## §1 BND-03 — sf barrel directive-free (verify-only)

**Requirement:** `components/sf/index.ts` MUST contain zero `'use client'` directives (v1.3 barrel-discipline rule from CLAUDE.md and REQUIREMENTS.md BND-03).

**Verification command:**

```bash
grep -c "use client" components/sf/index.ts
```

**Observed result:**

- Match count: **0**
- Exit code: **1** (grep -c returns 1 when zero matches)

**Verdict: PASS** — components/sf/index.ts is directive-free at the v1.8-lock end-state. This is consistent with the pre-audit finding and was preserved through Plan 01 + Plan 02 changes (those plans modified only `next.config.ts` — the sf barrel was not touched).

---

## §2 BND-04 — Stale-chunk guard documentation (doc-gate)

**Requirement:** The stale-chunk guard `rm -rf .next/cache .next` MUST be documented as mandatory prefix in `.planning/phases/61-bundle-hygiene/61-RESEARCH.md` AND replicated in the headers of `61-01-RESEARCH-LOG.md` and `61-02-RESEARCH-LOG.md`.

**Verification commands and observed results:**

```bash
grep -E "rm -rf \.next/cache \.next" .planning/phases/61-bundle-hygiene/61-RESEARCH.md
```

- Matches observed: 7 (Build invocation header, §4 Measurement Protocol body, BND-01 row, BND-02 row, BND-04 row, Risks §1 body, References §9)
- Exit code: 0

```bash
grep -E "rm -rf \.next/cache \.next" .planning/phases/61-bundle-hygiene/61-01-RESEARCH-LOG.md
```

- Matches observed: 4 (Plan-level Build invocation header + Build 0/A/B per-build invocation lines)
- Exit code: 0

```bash
grep -E "rm -rf \.next/cache \.next" .planning/phases/61-bundle-hygiene/61-02-RESEARCH-LOG.md
```

- Matches observed: 4 (Plan-level Build invocation header + Build B carry-over / C / D per-build invocation lines)
- Exit code: 0

**Verdict: PASS** — Stale-chunk guard documented in all three required locations (61-RESEARCH.md + 61-01-RESEARCH-LOG.md + 61-02-RESEARCH-LOG.md). Every gating measurement in Phase 61 was prefixed with the guard per BND-04 mandate (audit trail visible in each per-build "Build invocation:" line of both RESEARCH-LOG files).

---

## §3 BND-01 — Final gate (Shared by all + reduction%)

**Build invocation:**

```bash
rm -rf .next/cache .next && ANALYZE=true pnpm build 2>&1 | tee /tmp/phase61-build-final.log
```

**Stale-chunk guard:** APPLIED (BND-04)
**Timestamp:** 2026-04-26T20:32Z
**Source:** `/tmp/phase61-build-final.log` Route (app) stdout table

### Route (app) snapshot (verbatim, gating source)

```
Route (app)                                 Size  First Load JS  Revalidate  Expire
┌ ○ /                                    9.48 kB         264 kB
├ ○ /_not-found                            144 B         103 kB
├ ƒ /api/vitals                            144 B         103 kB
├ ○ /builds                                152 B         254 kB
├ ● /builds/[slug]                         151 B         254 kB
├ ○ /icon                                  144 B         103 kB
├ ○ /init                                 1.8 kB         251 kB
├ ○ /inventory                           11.8 kB         267 kB
├ ○ /opengraph-image                       144 B         103 kB
├ ○ /reference                           23.9 kB         273 kB
├ ○ /sitemap.xml                           144 B         103 kB
├ ○ /system                              9.19 kB         258 kB         15m      1y
└ ○ /twitter-image                         144 B         103 kB
+ First Load JS shared by all             103 kB
  ├ chunks/2979-7e3b1be684627f10.js      45.8 kB
  ├ chunks/5791061e-b51f32ecb5a3272a.js  54.2 kB
  └ other shared chunks (total)          2.56 kB
```

### BND-01 primary gate (ROADMAP success criterion 1) — Shared by all ≤ 102 KB

- `final_shared` = **103 KB**
- Assertion: `final_shared <= 102` → **103 <= 102 is FALSE**
- Verdict: **FAIL — BND-01 primary gate NOT MET**

The shared-floor remains at 103 KB across Build 0 (lucide-react only), Build A (radix-ui), Build B (input-otp), Build C (cmdk + vaul), Build D (sonner + react-day-picker), and this final stale-chunk-guarded gating build. The 1 KB gap to the ≤102 KB target was unreachable through the entire `optimizePackageImports` lever — confirming both 61-01 row A's prediction ("the 1 KB gap to BND-01 must come from either Plan 02 lazy-package transforms shifting marginal modules off the shared floor, OR a separate vector outside Phase 61's scope") and 61-02 row D's confirmation ("Lazy-path harvest is complete at 0 KB delta on Shared by all").

**Per-route First Load JS deltas vs Build 0** (informational — these confirm Phase 61's secondary harvest):

| Route | Build 0 (KB) | Final (KB) | Δ (KB) |
|-------|--------------|------------|--------|
| `/` | 280 | 264 | −16 |
| `/system` | 274 | 258 | −16 |
| `/inventory` | 282 | 267 | −15 |
| `/init` | 266 | 251 | −15 |
| `/reference` | 288 | 273 | −15 |
| `/builds` | 269 | 254 | −15 |
| `/_not-found` | 103 | 103 | 0 |

The `/` First Load JS dropped 16 KB (5.7%) and every Radix-consuming route dropped 15-16 KB. This is the entirety of the Phase 61 BND-02 harvest — meaningful at the route level, zero at the gating Shared-by-all floor.

### BND-01 secondary gate (ROADMAP success criterion 1) — 119 KiB unused-JS reduced ≥ 80%

**Reduction percentage formula** (per 61-03-PLAN.md `<interfaces>` section):

```
delta = (B0_3302 + B0_7525) - (Bf_3302 + Bf_7525)
reduction_percentage = (delta / B0_unused) * 100
```

Where:

- `B0_3302 = 163,174 B = 159.35 KB` (Build 0 chunk 3302 raw size; per 61-01-RESEARCH-LOG.md "Chunk 3302 / 7525 individual sizes (Build 0)")
- `B0_7525 = 76,893 B = 75.09 KB` (Build 0 chunk 7525 raw size; same source)
- `B0_3302 + B0_7525 = 240,067 B = 234.44 KB` (Build 0 baseline sum)
- `B0_unused = 119 KiB` (the v1.8-start unused-JS budget per ROADMAP success criterion 1)

**Final-build chunk attribution** (read from `ls -la .next/static/chunks/` after the gating build above):

- `Bf_7525` = `chunks/7525-0ad32677ff03b3b4.js` = **76,392 B = 74.60 KB** (filename hash drifted from Build 0's `7525-bd3c686ad4f95bc2.js`; numeric prefix `7525-` matched, popper-floating cluster identity preserved per 61-01-RESEARCH-LOG.md row A interpretation)
- `Bf_3302` = **MISSING** — no chunk with prefix `3302-` exists in the final build. The original chunk 3302 (Radix aggregate at Build 0) was fragmented by the `optimizePackageImports: ["radix-ui"]` transform, with successor `chunks/4335-34c9973f1c6cc6ef.js` (= 112,377 B = 109.74 KB) attributed by 61-01-RESEARCH-LOG.md row A as the dominant Radix-aggregate replacement chunk.

This invokes the **FALSE-PASS GUARD** mandated by 61-03-PLAN.md `<acceptance_criteria>`: "If `Bf_3302` or `Bf_7525` successor chunk cannot be located by package signature ... default to the conservative interpretation `Bf_X = B0_X` for that chunk (zero reduction credit). Do NOT interpret a missing chunk as 'size = 0' — that would inflate the reduction% to a false PASS."

The plan's worded condition for the guard is "successor chunk cannot be located by package signature." Strictly, chunk 4335 IS located by package signature (Radix aggregate ~109.74 KB parsed; the same role chunk 3302 played at Build 0). Both interpretations are recorded below for transparency.

#### Scenario A — FALSE-PASS GUARD strict literal (Bf_3302 := B0_3302; chunk 3302 numeric ID missing → no reduction credit)

```
Bf_3302 = 163,174 B = 159.35 KB  (defaulted to B0_3302 per FALSE-PASS GUARD)
Bf_7525 = 76,392 B = 74.60 KB
Bf_sum  = 233.95 KB
delta   = 234.44 - 233.95 = 0.49 KB
reduction_percentage = (0.49 / 119) * 100 = 0.41%
```

Assertion: `0.41 >= 80` → **FALSE → FAIL**

#### Scenario B — package-signature attribution (chunk 4335 → Bf_3302 successor)

```
Bf_3302 = 112,377 B = 109.74 KB  (chunks/4335-34c9973f1c6cc6ef.js attributed per 61-01-RESEARCH-LOG.md row A)
Bf_7525 = 76,392 B = 74.60 KB
Bf_sum  = 184.34 KB
delta   = 234.44 - 184.34 = 50.10 KB
reduction_percentage = (50.10 / 119) * 100 = 42.10%
```

Assertion: `42.10 >= 80` → **FALSE → FAIL**

#### BND-01 secondary gate verdict

**Both scenarios FAIL the ≥80% reduction target.** Even under the most generous attribution (Scenario B), the realized reduction is 42.10% — roughly half the ROADMAP success criterion's 80% threshold. The realistic FALSE-PASS-GUARD-strict reading (Scenario A) shows 0.41% — effectively zero reduction in the chunk-3302+7525 sum, because chunk 3302 fragmented into multiple smaller chunks (4335 + others) rather than shrinking through tree-shaking.

This finding is **mechanically consistent with what 61-01 row A documented**: the Radix barrel-rewrite transform splits the aggregate chunk by sub-package, redistributing bytes rather than eliminating them. The 119 KiB unused-JS budget assumed by ROADMAP success criterion 1 was sourced from the v1.8-start Lighthouse "Reduce unused JavaScript" audit — that audit measures bytes the browser downloads but does not execute on initial render. `optimizePackageImports` reduces what the browser downloads only when the imported barrel actually contained substantial unused exports. For the Radix meta-package as used in this codebase (27 components, all of them eagerly used through the sf barrel), the realized unused-export deletion was modest.

### §3 final verdict — BND-01

| Sub-gate | Threshold | Observed | Verdict |
|----------|-----------|----------|---------|
| Primary: `Shared by all` ≤ 102 KB | ≤102 KB | 103 KB | **FAIL** |
| Secondary: 119 KiB unused-JS reduced ≥80% (Scenario A — guard-strict) | ≥80% | 0.41% | **FAIL** |
| Secondary: 119 KiB unused-JS reduced ≥80% (Scenario B — attribution) | ≥80% | 42.10% | **FAIL** |

**BND-01 verdict: NOT MET.** The 1 KB primary gap (103 → 102) and the secondary reduction% deficit are not closeable through the `optimizePackageImports` lever alone. Phase 61's mandated scope ("Use `optimizePackageImports` extension as the lever") is exhausted at the end of Build D (Plan 02). Escalation recommendation in §5.

---

## §4 AES-04 — Pixel-diff result (invisible-by-construction)

**Spec:** `tests/v1.8-phase61-bundle-hygiene.spec.ts` (created Task 3, commit 7fcf35d)
**Threshold (this plan):** `MAX_DIFF_RATIO = 0` (strict — no documented re-baseline exception for Phase 61)
**Threshold (AES-04 standing rule):** `0.005` (0.5%) — applies to global re-baseline-eligible plans, NOT this plan
**Baseline source:** `.planning/visual-baselines/v1.8-start/` (20 PNGs at 4 viewports x 5 routes)
**Build artifacts:** Reused from §3 BND-01 gating build (same `.next/` directory; Phase 61 plan task-2 note authorizes reuse)

**Invocation command:**

```bash
CI=true pnpm exec playwright test tests/v1.8-phase61-bundle-hygiene.spec.ts --project=chromium 2>&1 | tee /tmp/phase61-pixel-diff-output.txt
```

**Spec exit code:** **non-zero** (20 failed, 0 passed)
**Total / passed / failed:** 20 / 0 / 20

### Per-test pixel-diff distribution (observed ratios)

| # | Test | Diff ratio | Strict 0% gate | AES-04 0.5% standing rule |
|---|------|-----------|----------------|---------------------------|
| 1 | home @ desktop-1440x900 | 0.343% | FAIL | PASS (< 0.5%) |
| 2 | home @ iphone13-390x844 | 0.031% | FAIL | PASS |
| 3 | home @ ipad-834x1194 | 0.312% | FAIL | PASS |
| 4 | home @ mobile-360x800 | 0.027% | FAIL | PASS |
| 5 | system @ desktop-1440x900 | 0.235% | FAIL | PASS |
| 6 | system @ iphone13-390x844 | 0.063% | FAIL | PASS |
| 7 | system @ ipad-834x1194 | 0.158% | FAIL | PASS |
| 8 | system @ mobile-360x800 | 0.055% | FAIL | PASS |
| 9 | init @ desktop-1440x900 | 0.006% | FAIL | PASS |
| 10 | init @ iphone13-390x844 | 0.008% | FAIL | PASS |
| 11 | init @ ipad-834x1194 | 0.006% | FAIL | PASS |
| 12 | init @ mobile-360x800 | 0.009% | FAIL | PASS |
| 13 | inventory @ desktop-1440x900 | 0.012% | FAIL | PASS |
| 14 | inventory @ iphone13-390x844 | 0.001% | FAIL | PASS |
| 15 | inventory @ ipad-834x1194 | 0.002% | FAIL | PASS |
| 16 | inventory @ mobile-360x800 | 0.006% | FAIL | PASS |
| 17 | reference @ desktop-1440x900 | 0.006% | FAIL | PASS |
| 18 | reference @ iphone13-390x844 | 0.007% | FAIL | PASS |
| 19 | reference @ ipad-834x1194 | 0.005% | FAIL | PASS |
| 20 | reference @ mobile-360x800 | 0.008% | FAIL | PASS |

**Distribution summary:**

- Min ratio: 0.001% (inventory @ iphone13-390x844)
- Max ratio: 0.343% (home @ desktop-1440x900)
- Median: ~0.008% (all 20 ratios are below 0.4%)
- All 20 ratios are below the AES-04 standing-rule 0.5% gate
- All 20 ratios are above the Phase-61 strict 0% gate

### Verdict — strict 0% gate

**FAIL — AES-04 strict 0% gate NOT MET (20/20 tests show non-zero pixel diff against v1.8-start baselines).**

### Interpretation honest readout

The spec exited non-zero against the strict 0% gate the plan mandates. This is the binding verdict for §4.

The Phase 61 plan declared bundle hygiene "invisible by construction" because `optimizePackageImports` is a build-time barrel-rewrite transform with no runtime semantic surface. The observed sub-pixel-class diffs (max 0.343%, the rest in the 0.001-0.063% range with two desktop outliers around 0.2-0.3%) are mechanically inconsistent with that prediction and require investigation. Possible attribution paths:

1. **Genuine bundle-induced rendering change** — `optimizePackageImports` re-ordered chunk loading, changing the moment at which deferred CSS/font/JS landed and shifted the screenshot's first paint sample. Could affect Anton font load timing on hero copy; would explain larger desktop diffs (more pixels per glyph) and smaller mobile diffs (fewer glyph pixels).
2. **Renderer non-determinism** — SwiftShader software-WebGL is not bit-stable across runs even with `animations: "disabled"` and `reducedMotion: "reduce"`. The Phase 59 row B "20/20 PASS at 0%" claim was made against `MAX_DIFF_RATIO = 0.005`, NOT the strict 0% gate; the Phase 59 spec source code at line 38 reads `const MAX_DIFF_RATIO = 0.005`. So Phase 59's 20/20 PASS does NOT establish that strict-0% has ever been observed in this harness.
3. **Baseline-capture timing artifact** — The `.planning/visual-baselines/v1.8-start/` PNGs were captured at one specific moment via `tests/v1.8-baseline-capture.spec.ts` (Phase 57 era). Strict bit-equality with the same harness running today against a current build is not historically validated.

The plan's BLOCKERS section says: "Pixel-diff spec exits non-zero on any of 20 tests → AES-04 fail; bisect (revert Plan 02 sonner+react-day-picker first, then cmdk+vaul, then Plan 01 input-otp, then radix-ui)." However, the bisect path is not informative if the root cause is renderer non-determinism rather than a bundle-induced regression — bisecting would still show 20 fails at strict 0% even in a no-change branch. The §5 final verdict therefore documents both the binding strict-0% verdict and an escalation recommendation that calls out this calibration question.

**No bisect was attempted in this plan.** Performing a bisect requires (a) a baseline-capture re-run on `73b56ae`'s parent (the pre-Phase-61 commit) to establish whether the `tests/v1.8-baseline-capture.spec.ts` harness is bit-stable, and (b) per-revert AES-04 reruns. Both are outside the scope of this verification plan and belong in a follow-up phase.

---

## §5 Phase 61 final verdict

**Single-line summary:** BND-01 **FAIL** (primary 103>102; secondary reduction 0.41-42.10% < 80%), BND-03 **PASS** (Task 1), BND-04 **PASS** (Task 1), AES-04 **FAIL** (20/20 fail strict 0%, but 20/20 PASS AES-04 standing-rule 0.5%).

**Phase 61 BLOCKED — does not close.**

Two of four gates failed against their stated thresholds:

1. **BND-01** primary (Shared by all ≤ 102 KB) failed by 1 KB. Secondary (≥80% of 119 KiB unused-JS reduction) failed at 0.41% (FALSE-PASS-GUARD strict) or 42.10% (chunk-4335 attribution). Both fall below the 80% target. The `optimizePackageImports` lever delivered 16 KB of route-specific reduction on `/` and other Radix-consuming routes (BND-02 secondary harvest) but cannot move the shared-floor by 1 KB or the 119 KiB unused-JS budget by 47 percentage points.
2. **AES-04** strict 0% gate failed at 20/20 tests with sub-0.5% diffs. All diffs are below the global AES-04 standing-rule 0.5% gate, but Phase 61's plan asserts strict 0% and provides no re-baseline exception.

### Escalation recommendation

**Defer to a Phase 62 follow-up plan** to address both blockers in concert:

#### BND-01 closure path

The `optimizePackageImports` lever is exhausted at the v1.8-lock end-state (7 packages). The 1 KB primary gap and the reduction% deficit must come from a different vector. Candidates the planner should evaluate (NOT executed in this plan):

- **Webpack `splitChunks` retuning** — pull a single ~1 KB module off the shared floor (e.g., a small lodash-helper or a one-off polyfill imported eagerly) into a route-specific chunk
- **`useCache: true` cache-tag pruning** — investigate whether the Next.js 15 `useCache` experimental feature pulls runtime instrumentation onto the shared floor
- **Re-evaluate the 119 KiB ROADMAP target** — the 119 KiB unused-JS budget was sourced from a v1.8-start Lighthouse audit; if the audit's "unused JavaScript" measurement included three.js-route-specific bytes that `optimizePackageImports` was never going to reduce, the 80% target was unreachable from the start. A revised baseline against the *current* Lighthouse audit (post-Phase-60 LCP-01 +Phase-61 BND-02) would give Phase 62 a calibrated target.
- **Acceptance of 103 KB as the practical floor** — declare Next.js 15 framework runtime + react-dom (45.8 + 54.2 = 100 KB) plus 2.56 KB of "other shared chunks" as an irreducible floor, and lock the gate at ≤103 KB rather than ≤102 KB. ROADMAP edit required.

#### AES-04 calibration path

Before Phase 62 can re-run the strict 0% gate, the harness's bit-stability needs to be established. Recommended Phase 62 calibration steps (NOT executed in this plan):

1. Re-capture baselines from the pre-Phase-61 commit (`73b56ae5ad68a779ccf25e3ab498344c0b9cd2e2`'s parent) using `tests/v1.8-baseline-capture.spec.ts` and run `tests/v1.8-phase61-bundle-hygiene.spec.ts` against those fresh baselines. If 20/20 still FAIL strict 0%, the harness itself is non-deterministic at sub-pixel level (root cause: renderer/font-load timing) and the strict 0% gate is unsatisfiable by construction — it should be relaxed to the AES-04 standing 0.5% rule.
2. If 20/20 PASS strict 0% against fresh baselines, the diffs observed in this plan ARE bundle-induced and bisect is justified: revert sonner+react-day-picker (Plan 02 Task 2) → re-run; revert cmdk+vaul (Plan 02 Task 1) → re-run; revert input-otp (Plan 01 Task 2) → re-run; revert radix-ui (Plan 01 Task 1) → re-run. The first revert that restores 0% identifies the regression.

**This plan honestly reports both gate failures and recommends Phase 62 as the path forward.** Phase 61's plan-checker FALSE-PASS GUARD was honored: no rounding, no threshold-loosening, no mis-attribution of chunk 3302 to "size = 0," no claim of pass against any threshold the plan did not explicitly authorize.

### Phase 61 partial accomplishments (not a close, but worth recording)

- Per-route First Load JS dropped −15 to −16 KB across 6 routes (Radix-consuming `/`, `/system`, `/inventory`, `/init`, `/reference`, `/builds`); shared floor unchanged at 103 KB
- `optimizePackageImports` array correctly populated with the 7-package final state per ROADMAP success criterion 2 (BND-02 numeric target — array contents — is met; BND-01 numeric target is not)
- BND-03 (sf barrel directive-free) preserved through Plan 01 + Plan 02 changes
- BND-04 (stale-chunk guard documentation) honored across all three required documents and every per-build invocation in the RESEARCH-LOG history
- AES-04 informative finding: the Phase 59 spec's claimed "20/20 PASS at 0%" was actually a 20/20 PASS at 0.5% (the spec source has `MAX_DIFF_RATIO = 0.005`); the strict 0% gate has never been validated in this harness on any prior plan, so calibration is needed before any future strict-0% claim
- Pre-existing AES-04 standing-rule 0.5% gate would PASS at 20/20 (max observed ratio 0.343%); this plan does NOT loosen the gate to claim that PASS, but documents it for Phase 62 calibration

**Phase 61 does NOT close.** Orchestrator should treat this plan's outcome as `human_needed` pending the user's decision on the Phase 62 escalation path.
