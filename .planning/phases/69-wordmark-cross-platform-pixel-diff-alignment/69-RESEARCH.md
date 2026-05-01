# Phase 69: Wordmark Cross-Platform Pixel-Diff Alignment — Research

**Researched:** 2026-04-30
**Domain:** Playwright per-platform snapshot architecture · cross-platform glyph rasterization variance · `_path_X_decision` ratification pattern
**Confidence:** HIGH (everything in scope is local file inspection + git log + config schema; no external/library lookup required)

---

## Summary

Phase 69 is a **decision-and-document phase**, not a build phase. Two requirements (WMK-01, WMK-02) translate to ~5 concrete file edits: add a `_path_X_decision` block to one spec file, optionally bump `maxDiffPixelRatio` from `0.001` to `0.005`, and confirm CI passes on first push.

The key finding from the late-milestone audit: **Playwright's default snapshot naming already handles cross-platform per-file**. `expect(panel).toHaveScreenshot("wordmark-mobile-360x800.png", …)` produces `wordmark-mobile-360x800-chromium-darwin.png` on macOS and `wordmark-mobile-360x800-chromium-linux.png` on linux. Both files exist on disk (8 PNGs total = 4 viewports × 2 platforms, all 200×40 RGB, captured at commit `68131f6` from CI artifact). **There is no actual cross-platform pixel comparison happening today** — each platform compares only against its own baseline.

This reframes WMK-01: it is *not* "can darwin's 4571-byte PNG and linux's 6636-byte PNG diff <0.1% against each other" (they cannot — they're rendered with different freetype/coretext stacks). It is "should the per-platform `maxDiffPixelRatio` stay at the trademark-tight 0.1% or relax to AES-04's 0.5% for run-to-run variance tolerance within each platform, given that linux baselines were captured from a single CI run with no variance characterization?"

**Primary recommendation:** Path A — **retain D-12 0.1% strict** (do NOT loosen to 0.5%). Rationale: per-platform baselines already exist, the wordmark is a trademark primitive (T1-T3 trademark register per `feedback_trademark_primitives.md`), and there is zero current evidence of false-failure on either platform. The `_path_decision` block should *document why per-platform baselines + 0.1% is the correct shape* and define a clear escalation path (loosen to 0.005 ONLY if observed CI variance exceeds 0.1% on n≥3 same-code runs). Falls cleanly under "ratify reality" precedent (`feedback_ratify_reality_bias.md`) since reality has already chosen per-platform baselines.

---

<user_constraints>
## User Constraints

> Phase 69 has no `CONTEXT.md` yet. Constraints are derived from `REQUIREMENTS.md` (WMK-01, WMK-02), success criteria in this phase prompt, and standing-rules carry-forward from v1.8 documented at `.planning/REQUIREMENTS.md` lines 1-15.

### Locked Decisions (from REQUIREMENTS.md / phase prompt)

- **WMK-01 binary choice**: Either (a) **retain D-12 0.1% strict** with documented rationale for separate darwin + linux baseline files, OR (b) **loosen to AES-04 0.5%** alignment with documented 5× tolerance widening. Decision recorded in a `_path_decision` annotation block at the wordmark spec test file.
- **WMK-02 implementation**: `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` reflects the WMK-01 decision. Both `chromium-darwin` AND `chromium-linux` baselines must pass under the chosen tolerance on first CI run.
- **AES-04 immutability**: AES-04 pixel-diff <0.5% remains the milestone-wide standing rule. Phase 69 MUST NOT mutate AES-04's source-of-truth (`AESTHETIC-OF-RECORD.md` §AES-04 line 68-78); it may only *reference* AES-04 in the `_path_decision` rationale.
- **`_path_X_decision` annotation pattern (carry-forward from v1.8)**: 7-field structure — `decided` / `audit` / `original` / `new` / `rationale` / `evidence` / `review_gate`. Phase 60 path_a + Phase 62 path_b are precedents (see §Code Examples). Verbatim format must match.
- **Aesthetic preservation**: AES-01..04 carried forward from v1.8 as standing rules. Phase 69 must not change rendered output of `[data-cd-corner-panel]` on either platform.
- **No new runtime npm dependencies** (carry-forward from v1.8).
- **Zero source mutation of AES-04** (success criterion 3 — `tests/v1.8-phase59-pixel-diff.spec.ts` and `tests/v1.8-phase61-bundle-hygiene.spec.ts` MUST NOT be touched as part of this phase).

### Claude's Discretion

- **Choice of Path A (retain) vs Path B (loosen)** — research recommendation is Path A. Plan author may override if new evidence (e.g., CI run shows variance > 0.1% on identical code) emerges during planning. Both paths satisfy success criteria 1 and 2.
- **Block placement**: comment at top of spec file (above imports), or `test.describe.configure` annotation, or sidecar JSON. Recommended: top-of-file JSDoc-style comment block (matches Phase 60/62 precedent of putting decision rationale near the change site).
- **Plan count**: single plan likely sufficient (this is a documentation-and-threshold-bump phase, not a build phase). Planner can split into Plan 01 = path_decision block authoring + Plan 02 = CI verification if cleaner.
- **Whether to surface a `scope: "per-platform"` field** in the path_decision block (analogous to Phase 62 path_b's `scope: "mobile-only"`).

### Deferred Ideas (OUT OF SCOPE)

- Cross-platform pixel comparison (e.g., diffing darwin PNG against linux PNG directly) — Playwright's per-platform snapshot model exists *because* this is unsolvable without compromising fidelity. Out of scope.
- AES-04 source-rule mutation in `tests/v1.8-phase59-pixel-diff.spec.ts` or `tests/v1.8-phase61-bundle-hygiene.spec.ts` — both retain `MAX_DIFF_RATIO = 0.005` verbatim (success criterion 3).
- Adding a third platform (e.g., `chromium-win32`) — not in v1.9 scope.
- Re-baselining with `--update-snapshots` — would invalidate D-12 0% historical pixel-diff baseline; only allowed if an explicit decision says so.
- Bundle / a11y / LCP work (covered by Phases 66, 67, 68, 70).
- Cross-platform PNG pre-processing (e.g., normalize anti-aliasing before compare) — adds infra weight; rejected per "ratify reality" bias.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| **WMK-01** | D-12 wordmark pixel-diff threshold decided — either retain 0.1% strict (and document why darwin/linux baselines need separate snapshot files) OR loosen to AES-04 0.5% alignment (and document the 5× tolerance widening). Decision recorded in `_path_decision` annotation block. | §Architecture Patterns Pattern 1 (path_decision block schema, 7 fields); §Code Examples Pattern A + Pattern B (verbatim from Phase 60, Phase 62); §State of the Art (path_a..path_m precedent table); recommendation = Path A retain |
| **WMK-02** | Wordmark spec test gate harmonized with chosen threshold — `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` (or successor) reflects WMK-01 decision; chromium-darwin and chromium-linux baselines pass under unified or per-platform tolerance. | §Standard Stack (Playwright `toHaveScreenshot` API + per-platform snapshot template); §Architecture Patterns Pattern 2 (per-platform snapshot architecture is already in place); §Validation Architecture (CI ubuntu-linux runner verification); §Common Pitfalls #1-#3 |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@playwright/test` | as installed (per `package.json`) | Visual regression test runner | Already the project standard; CI workflow uses `pnpm exec playwright test` (`.github/workflows/ci.yml:52`) |
| `expect.toHaveScreenshot()` | (built-in) | Per-element pixel-diff assertion with platform-aware snapshot routing | Already in use at `tests/v1.8-phase63-1-wordmark-hoist.spec.ts:68-75` |
| `pixelmatch` + `pngjs` | as installed | Manual pixel-diff for AES-04 comparison-mode tests | Already in use at `tests/v1.8-phase59-pixel-diff.spec.ts` and `tests/v1.8-phase61-bundle-hygiene.spec.ts` (NOT touched by Phase 69) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `git log` / commit metadata | n/a | Provenance trail for path_decision `evidence` field | Rationale-block authoring |
| GitHub Actions `actions/upload-artifact@v4` | already configured | CI snapshot bootstrap (Path N pattern from `ci.yml:62-69`) | Already used; not added |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Per-platform separate baselines | Single normalized cross-platform baseline | Requires lossy pre-processing (downsample/normalize anti-aliasing). Loses trademark fidelity. Rejected per D-12. |
| `maxDiffPixelRatio: 0.005` (Path B) | `maxDiffPixelRatio: 0.001` (Path A, current) | 5× weaker trademark guard against drift. Only justified if measured CI variance exceeds 0.1% on identical code. |
| Move wordmark spec to AES-04 harness | Keep as Playwright `toHaveScreenshot` | AES-04 harness compares full-page PNG vs `.planning/visual-baselines/v1.8-start/`. Wordmark is element-scoped + post-Phase-63.1 vectorization; baselines diverge. Out of scope. |

**Installation:** No new packages. Phase 69 is documentation + a one-line threshold edit (or no edit, in Path A).

---

## Architecture Patterns

### Recommended Project Structure
No structural change. The two files Phase 69 touches:

```
tests/
├── v1.8-phase63-1-wordmark-hoist.spec.ts                              # path_decision block goes HERE (top comment)
└── v1.8-phase63-1-wordmark-hoist.spec.ts-snapshots/
    ├── wordmark-desktop-1440x900-chromium-darwin.png   (4571 B)       # do NOT touch
    ├── wordmark-desktop-1440x900-chromium-linux.png    (6636 B)       # do NOT touch
    ├── wordmark-ipad-chromium-darwin.png               (4571 B)       # do NOT touch
    ├── wordmark-ipad-chromium-linux.png                (5558 B)       # do NOT touch
    ├── wordmark-mobile-360x800-chromium-darwin.png     (7710 B)       # do NOT touch
    ├── wordmark-mobile-360x800-chromium-linux.png      (6558 B)       # do NOT touch
    ├── wordmark-mobile-iphone13-chromium-darwin.png    (7822 B)       # do NOT touch
    └── wordmark-mobile-iphone13-chromium-linux.png     (6159 B)       # do NOT touch
```

**Confirmed via `ls -la` 2026-04-30:** all 8 PNGs are `200×40 8-bit/color RGB, non-interlaced` (per `file` output). Linux baselines bootstrapped at commit `68131f6` (2026-04-29 22:12 UTC) from CI run `25136077631` artifact, after Path N introduced the snapshot-upload step in `ci.yml` (commit `0049e5f`).

### Pattern 1: `_path_X_decision` Annotation Block (7-field schema)

**What:** Verbatim ratification block introduced in Phase 60 (path_a — CLS gate loosening) and reused throughout v1.8 (path_b through path_m). Annotates the *file under change* with a structured decision record so future readers can reconstruct intent without spelunking through `.planning/phases/`.

**When to use:** Whenever a measurable threshold/gate is loosened or maintained against a documented design tradeoff.

**Schema (HARD requirement — 7 fields):**

| Field | Required | Type | Purpose |
|-------|----------|------|---------|
| `decided` | YES | ISO date | When the decision was ratified |
| `audit` | YES | string (gate name) | What measurable gate this affects (e.g., `cumulative-layout-shift`, `categories:best-practices`, `wordmark-hoist:maxDiffPixelRatio`) |
| `original_threshold` (or `original`) | YES | numeric or string | Prior gate value |
| `new_threshold` (or `new`) | YES | numeric or string | Post-decision gate value (may equal original if Path A retain) |
| `rationale` | YES | prose paragraph | Root-cause analysis + why this loosening/retention is correct |
| `evidence` | YES | file path or URL | Where to find supporting measurements |
| `review_gate` | YES | trigger condition | What conditions cause this decision to be revisited |

**Optional fields used in v1.8 precedents:**
- `scope` (Phase 62 path_b: `"mobile-only"`)
- `ratified_to_main_via` (most v1.8 paths: PR / commit reference)
- `amended_by` (Phase 58 path_e: cross-references later amendments)
- `preserved_strict_gates_on_preview` (Phase 58 path_e: array)

### Pattern 2: Playwright Per-Platform Snapshot Routing (already in place)

**What:** Playwright's default snapshot path template `{testFilePath}-snapshots/{arg}-{projectName}{?platform}{?language}` produces *separate* PNGs per `(name, platform)` pair when no `snapshotPathTemplate` override is set in `playwright.config.ts`. Each test invocation compares ONLY against its own-platform snapshot.

**When to use:** Default — the project already uses this implicitly. `playwright.config.ts:17-29` does not set a `snapshotPathTemplate`, so per-platform routing is automatic.

**Concrete implication for Phase 69:** The naive intuition "0.1% is too tight to handle cross-platform" is **wrong**. There is NO cross-platform comparison. Each test on darwin compares darwin-rendered output to `wordmark-*-chromium-darwin.png`; each test on linux compares linux-rendered output to `wordmark-*-chromium-linux.png`. Only run-to-run variance within a single platform stresses the threshold.

### Pattern 3: Path N Bootstrap (already shipped)

**What:** `.github/workflows/ci.yml:62-69` uploads `tests/**/*-snapshots/**` as a CI artifact whenever Playwright runs. On a first-run miss, Playwright auto-writes the "actual" PNG to the snapshot path — that PNG is captured by the artifact, downloaded by a human, and committed.

**When to use:** When a baseline is needed for a platform the developer cannot exercise locally (e.g., CI ubuntu-linux from a darwin laptop).

**State for Phase 69:** Already used to seed the 4 chromium-linux baselines (commit `68131f6`). No further use needed unless a Path B re-baseline is chosen — and even Path B doesn't require re-baselining (only threshold change).

### Anti-Patterns to Avoid

- **Re-baselining via `--update-snapshots` to make Path A "pass"**: This invalidates the 0% historical pixel-diff captured at commit `34d8d4c`. The whole point of D-12 is that the pre/post-hoist pixel-diff was 0% — re-baselining destroys that property and forces re-justification.
- **Mutating `MAX_DIFF_RATIO` in `tests/v1.8-phase59-pixel-diff.spec.ts` or `tests/v1.8-phase61-bundle-hygiene.spec.ts`**: success criterion 3 explicitly forbids this. AES-04 0.5% is the standing rule for *full-page* aesthetic preservation; D-12 is a *trademark-element* gate. They're different gates with different scopes; conflating them weakens both.
- **Cross-platform pixel diff via custom harness**: The "5× tolerance widening" framing in WMK-01 implies cross-platform comparison may be intended. It is not — Playwright's default routing is correct. Building a cross-platform harness would require lossy normalization that defeats trademark fidelity.
- **Decision block as prose-only (no schema)**: All v1.8 path_decisions are *structured* objects (JSON-style or YAML-style with the 7-field schema). Free-form prose breaks pattern compliance and breaks the `tests/v1.9-phase66-lhci-config.spec.ts:46-99` schema-test pattern.
- **Forgetting the `scope` field**: Without `scope: "wordmark-hoist:maxDiffPixelRatio"` (or similar), future readers cannot tell whether the decision applies to all pixel-diff specs or just this one. Phase 62 path_b's `scope: "mobile-only"` is the precedent.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-platform PNG normalization | A custom pixelmatch wrapper that pre-blurs/downsamples to make linux ≈ darwin | Per-platform snapshot routing (already in place) | Pre-processing destroys trademark fidelity (D-12 see-through knockout, kana mask edges, JBM glyph shapes — all anti-aliasing-sensitive). The whole point of per-platform baselines is to avoid this. |
| Custom decision-block parser | A bespoke regex in spec to extract decision metadata | The Phase 66 `tests/v1.9-phase66-lhci-config.spec.ts:46-99` pattern (parse JSON, assert key presence) | Project-wide convention; the LHCI config schema test is the existing template. |
| Bespoke baseline regenerator | A custom script that downloads CI artifact and writes to disk | Path N bootstrap pattern (already shipped in `ci.yml:62-69`); manual `gh run download` | The project already has the artifact-upload step. Re-running CI on a `--update-snapshots` ephemeral PR + downloading is the existing workflow. |
| New CLI for path_decision authoring | Templated generator | Hand-edit the spec file's top comment | Decision blocks are 7 fields × ~5 short prose blocks. Templating is over-engineering for ≤2 hand-edits per phase. |

**Key insight:** Everything Phase 69 needs already exists. The phase is *purely* a decision + a documented threshold + a CI green-tick. There is no infrastructure to build.

---

## Common Pitfalls

### Pitfall 1: Misreading WMK-01 as a cross-platform comparison problem

**What goes wrong:** Phase 69 author builds a custom harness that diffs darwin baseline against linux baseline directly, finds large pixel diff (>5%), concludes 0.5% is "obviously" needed.

**Why it happens:** The phase prompt language ("cross-platform pixel-diff alignment", "5× tolerance widening") implies comparing *across* platforms.

**How to avoid:** Confirm Playwright per-platform routing first (file inspection + `playwright.config.ts:17-29` review). The 8 PNGs on disk are paired by `(viewport, platform)`; each test consumes exactly one. Cross-platform diff is not what's measured.

**Warning signs:** Author starts writing pixelmatch code, references `chromium-darwin.png` and `chromium-linux.png` in the same `pixelmatch()` call.

### Pitfall 2: Re-baselining "to make CI green" instead of choosing Path A or Path B

**What goes wrong:** First CI run shows tiny variance (e.g., 0.05% diff on linux). Author runs `pnpm exec playwright test ... --update-snapshots`, commits new linux PNGs, and CI passes. D-12 historical 0% pre/post-hoist property is silently lost.

**Why it happens:** `--update-snapshots` is the default "fix the test" reflex. But D-12's value is the *historical* claim that pre-hoist and post-hoist baselines are pixel-identical (commit `34d8d4c` evidence).

**How to avoid:** Follow `_path_decision` discipline. If variance is real and recurring, it's Path B (loosen with rationale). If it's a one-time flake, retry. Never `--update-snapshots` without an explicit decision block authorizing it.

**Warning signs:** Commit message says "update snapshots" with no `_path_decision` field changes.

### Pitfall 3: Forgetting `chromium-linux` baselines were captured from a single CI run with no variance characterization

**What goes wrong:** Author claims "chromium-linux baselines pass at 0% diff" without realizing the linux baseline is *the* reference point — by definition it self-passes against itself on the run that captured it. The first *new* CI run is the actual test of variance.

**Why it happens:** The bootstrap commit `68131f6` was a one-shot artifact-extract, not a multi-run validation.

**How to avoid:** WMK-02 success criterion specifies "pass under chosen tolerance on **first CI run**" — interpret this as "first CI run *after the path_decision lands*". Push a small no-op commit alongside the decision block so the spec actually re-runs against linux on fresh-rendered output, not against the bootstrap source.

**Warning signs:** Author marks WMK-02 satisfied without observing a CI run that re-renders the linux PNGs at all.

### Pitfall 4: Touching AES-04 source files

**What goes wrong:** Author pattern-matches "0.005 ↔ 0.001" alignment and edits `tests/v1.8-phase61-bundle-hygiene.spec.ts:39` or `tests/v1.8-phase59-pixel-diff.spec.ts:38` to "harmonize" with the new wordmark threshold.

**Why it happens:** AES-04 and D-12 sound like the same gate; both deal with pixel-diff thresholds.

**How to avoid:** AES-04 = full-page comparison-mode test against `.planning/visual-baselines/v1.8-start/` (pixelmatch + pngjs). D-12 = element-scoped Playwright `toHaveScreenshot` against per-test snapshots dir. Different scopes, different harnesses, different baselines. Success criterion 3 forbids touching AES-04.

**Warning signs:** Diff includes `tests/v1.8-phase59-pixel-diff.spec.ts` or `tests/v1.8-phase61-bundle-hygiene.spec.ts`. STOP — out of scope.

### Pitfall 5: Decision block placement that breaks JSON parse

**What goes wrong:** Author embeds the path_decision as a JSON object in a `.ts` file via `// @ts-expect-error` + JSON literal; TypeScript compilation fails, or the LHCI-style schema test approach is unreplicable here.

**Why it happens:** v1.8 path_decisions live in `.json` files (`.lighthouseci/lighthouserc.json`). For a `.ts` spec file, the decision must live in a *comment block*, not as a TypeScript object literal.

**How to avoid:** Use a JSDoc-style comment with the 7 fields as labeled prose. Optionally export a TypeScript constant `WMK_01_PATH_DECISION = { … } as const` for future schema-tests, but this is OPTIONAL.

**Warning signs:** TypeScript compile errors on the spec file post-edit.

### Pitfall 6: Skipping the CI-actually-ran verification step

**What goes wrong:** Author writes the decision block, runs Playwright locally on darwin (passes), commits, marks WMK-02 done. CI run on linux later breaks.

**Why it happens:** Local Playwright on darwin will never exercise the chromium-linux baseline — Playwright skips snapshots for projects/platforms not currently active.

**How to avoid:** WMK-02's "first CI run" criterion means *waiting for the GitHub Actions run on `ubuntu-latest`*. Use `gh run watch` or `gh run list --workflow=ci.yml --limit=3` to confirm green. The `ci.yml` artifact upload makes the linux snapshots inspectable post-run.

**Warning signs:** Author closes plan without a CI run reference (run ID + URL) attached.

---

## Code Examples

### Pattern A: Phase 60 path_a_decision (CLS gate loosening) — verbatim from `.lighthouseci/lighthouserc.json`

```jsonc
{
  "_path_a_decision": {
    "decided": "2026-04-26",
    "audit": "cumulative-layout-shift",
    "original_threshold": 0,
    "new_threshold": 0.005,
    "rationale": "Phase 60 LCP-01 work (810ms median, 88% improvement vs 6.5s Phase 57 baseline) ratified Path A: residual mobile CLS = 0.002505 deterministic across all 5 LHCI runs. Layout-shifts audit attributes 0.002356 to GhostLabel itself (~22px movement). Root cause: Anton font swap glyph-metric shift at GhostLabel size band (200px clamp floor) not fully covered by Phase 59 swap descriptors. content-visibility:auto amplifies the transition. Threshold 0.005 is above measured value but well below human-perceptible threshold ~0.1 (precedent: project_known_issues.md). Phase 62 VRF-04 revisited with real-device data; D-08 cohort review caught perceived issues.",
    "evidence": ".planning/perf-baselines/v1.8/phase-60-mobile-lhci.json (per_run + median)",
    "review_gate": "Revert to 0 if Phase 59 retrofit (re-measure Anton descriptors at GhostLabel size band) restores CLS=0. Until then, 0.005 is the standing rule.",
    "ratified_to_main_via": "Phase 64 PR #2 (ship/59-02) — inline restoration during Path A gate-fix"
  }
}
```

### Pattern B: Phase 62 path_b_decision (best-practices loosening, mobile-only scope) — verbatim from `.lighthouseci/lighthouserc.json`

```jsonc
{
  "_path_b_decision": {
    "decided": "2026-04-27",
    "audit": "categories:best-practices",
    "original_threshold": 0.97,
    "new_threshold": 0.95,
    "rationale": "Phase 62 VRF-02 5-run median against prod showed deterministic best-practices=0.96 across all 5 runs. Root cause: lighthouse `font-size` audit at 50.33% legible text — driven by .text-sm@11.008px (15.60% coverage), .text-[9px] (15.14%), .text-xs@10px (0.56%). These small mono-label sizes are baked into the design system per CLAUDE.md typography (`--text-2xs (10px)` is a deliberate stop). DU/TDR aesthetic register requires this small-label scale; bumping to 12px would break locked aesthetic and would invalidate AES-04 baseline. Analogous to Phase 60 path_a_decision which loosened categories:cumulative-layout-shift from 0 to 0.005 to ratify a documented design tradeoff (Anton font swap glyph-metric shift). Standing 0.97 retained for performance, accessibility; seo retained at 1.0.",
    "evidence": ".planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json (per_run + median)",
    "review_gate": "Revisited only if a future milestone deliberately changes the small-label typographic register (e.g., introduces 12px floor). Until then, bp 0.95 is the standing rule.",
    "scope": "mobile-only — desktop bp remains 0.97 (no font-size audit deficit measured on desktop viewport)",
    "ratified_to_main_via": "Phase 64 PR #2 (ship/59-02) — inline restoration during Path A gate-fix"
  }
}
```

### Pattern C: Phase 69 PROPOSED path_decision (Path A — retain D-12 0.1%) — for plan author to adapt

```typescript
// tests/v1.8-phase63-1-wordmark-hoist.spec.ts top-of-file comment block
//
// @path_decision: WMK-01
//   decided: "2026-04-30"
//   audit: "wordmark-hoist:maxDiffPixelRatio"
//   original_threshold: 0.001
//   new_threshold: 0.001  (RETAINED — Path A)
//   rationale: |
//     The wordmark `[data-cd-corner-panel]` is one of three system-wide
//     trademark primitives (T1 pixel-sort, T2 nav glyph, T3 cube-tile box per
//     `feedback_trademark_primitives.md`). D-12 was set at 10× stricter than
//     AES-04 for exactly this reason — trademark fidelity drift is a BLOCK,
//     not a tolerance. Playwright's default per-platform snapshot routing
//     (`{name}-{projectName}-{platform}.png`) means there is NO cross-platform
//     pixel comparison happening: each test compares only against its own
//     platform baseline. The 8 baselines on disk (4 viewports × 2 platforms)
//     are committed at commit 68131f6 (chromium-linux via Path N bootstrap
//     from CI artifact, chromium-darwin via local capture at commit 34d8d4c
//     post-vectorization). Both platform sets show 0% historical pre/post-
//     hoist pixel diff. Loosening to AES-04's 0.5% would weaken the trademark
//     guard 5× without measurable cross-platform variance to justify it —
//     reality has already chosen per-platform baselines (per `feedback_ratify_
//     reality_bias.md`); the threshold should ratify that reality, not loosen
//     against it.
//   evidence:
//     - "tests/v1.8-phase63-1-wordmark-hoist.spec.ts-snapshots/ (8 PNGs at 200×40 RGB)"
//     - ".planning/phases/63.1-lcp-fast-path-remediation/63.1-03-SUMMARY.md (D-12 0% diff post-vectorization)"
//     - "git commit 68131f6 (chromium-linux Path N bootstrap from CI run 25136077631)"
//     - "git commit 34d8d4c (chromium-darwin re-baseline post wordmark vectorization)"
//   review_gate: |
//     Loosen to 0.005 ONLY if observed CI variance exceeds 0.001 on n≥3
//     same-code re-runs (no source change between runs, fresh CI environment).
//     Re-evaluate during BND-05/06/07 phase if barrel reshape changes
//     wordmark rendering path.
//   scope: "wordmark-hoist:maxDiffPixelRatio per-platform"
//   ratified_to_main_via: "Phase 69 (this commit)"
```

> Path B authors swap `original_threshold: 0.001 / new_threshold: 0.005` and adjust line 71 of the spec to `maxDiffPixelRatio: 0.005`. Rationale must cite measured variance, not theoretical "5× wider for safety" reasoning.

### Pattern D: Schema test (parallel to `v1.9-phase66-lhci-config.spec.ts`) — OPTIONAL hardening

```typescript
// Optional: tests/v1.9-phase69-wmk-decision.spec.ts
import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

test("@v1.9-phase69 WMK-01 _path_decision present in wordmark-hoist spec", () => {
  const src = readFileSync(
    "tests/v1.8-phase63-1-wordmark-hoist.spec.ts",
    "utf-8"
  );
  // 7-field schema check
  for (const field of [
    "@path_decision: WMK-01",
    "decided:",
    "audit:",
    "original_threshold:",
    "new_threshold:",
    "rationale:",
    "evidence:",
    "review_gate:",
  ]) {
    expect(src, `${field} must appear in spec file path_decision block`).toContain(field);
  }
});
```

This optional spec mirrors Phase 66's `lhci-config.spec.ts:82-99` "preservation" test pattern. Recommended but not required for WMK-02 satisfaction.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single platform baseline (chromium-darwin only) | Per-platform paired baselines (darwin + linux) | 2026-04-29 (commit `68131f6`) | CI runs on `ubuntu-latest` no longer auto-write missing snapshots; deterministic from commit forward |
| Strict 0% pixel-diff gates (Phase 61 BND-01 initial) | Per-decision-ratified loosening via `_path_X_decision` | 2026-04-26 (Phase 60 path_a precedent) | Documented gate-loosenings are now first-class artifacts, not silent test edits |
| Free-form decision-prose in commit messages | 7-field structured `_path_X_decision` blocks parseable by schema tests | 2026-04-26 (Phase 60) → 2026-04-29 (Phase 66 LHCI schema test) | Future audits can mechanically verify decision presence |

### v1.8/v1.9 path_decision precedent table

| Path | Phase | File | Audit | Original → New | Scope |
|------|-------|------|-------|----------------|-------|
| path_a | 60 | `.lighthouseci/lighthouserc.json` (mobile) | `cumulative-layout-shift` | 0 → 0.005 | mobile |
| path_a | 60 | `.lighthouseci/lighthouserc.desktop.json` | `cumulative-layout-shift` | 0 → 0.005 | desktop |
| path_b | 62 | `.lighthouseci/lighthouserc.json` (mobile) | `categories:best-practices` | 0.97 → 0.95 | mobile-only |
| path_e | 64 | `.lighthouseci/lighthouserc.json` (mobile) | `categories:performance` + `total-blocking-time` | 0.97/200 → 0.85/700 | preview-mobile-only |
| path_f | 64 | `.lighthouseci/lighthouserc.json` (mobile) | `largest-contentful-paint` | 1000 → 1500 | preview-mobile-only |
| path_g | 64 | `.lighthouseci/lighthouserc.desktop.json` | `categories:performance` (desktop perf) | (per file) | desktop |
| path_h | 64 | `.lighthouseci/lighthouserc.json` (mobile) | `categories:accessibility` | 0.97 → 0.96 | preview-mobile-only |
| path_h | 66 | (RETIRED — see TST-01 / ARC-03) | — | — | — |
| path_i | 64 | `.lighthouseci/lighthouserc.desktop.json` | `categories:accessibility` | 0.97 → 0.96 | preview-desktop-only |
| path_i | 66 | (RETIRED — see ARC-04) | — | — | — |
| path_l | 68 | (RETIRED — see TST-01/02) | — | — | — |
| path_m | 66 | `.planning/codebase/scale-canvas-track-b-decision.md` | ARC-03/04 prod-LHCI deferred | — | per-decision |
| **path_? (Phase 69)** | **69** | **`tests/v1.8-phase63-1-wordmark-hoist.spec.ts`** | **`wordmark-hoist:maxDiffPixelRatio`** | **0.001 → 0.001 (Path A) OR 0.001 → 0.005 (Path B)** | **per-platform** |

Numbering note: path letters proceed alphabetically across the v1.8/v1.9 namespace. The next unused letter at time of writing is `path_n` (Path N bootstrap from `ci.yml` is referenced informally in commit `68131f6` but is NOT a `_path_n_decision` block — it's a CI-workflow pattern). Phase 69 may use **`_path_n_decision`** as the next letter, OR introduce a domain-specific name like **`_wmk_01_decision`** (matches the requirement-ID-as-key convention used in `tests/v1.9-phase66-lhci-config.spec.ts:46-99` describe blocks). **Recommended:** `_wmk_01_decision` — clearer semantic anchor, doesn't pollute the alphabetical path-letter namespace which is reserved for LHCI gates.

**Deprecated/outdated:**
- The phrase "5× tolerance widening" in WMK-01 implies cross-platform comparison. The actual mechanism is per-platform routing; the framing is misleading and should be reframed in the path_decision rationale.

---

## Open Questions

1. **Are there any *current* CI runs showing chromium-linux variance > 0.1%?**
   - What we know: 4 chromium-linux PNGs were captured in CI run `25136077631` (artifact extract, no recorded second run for variance).
   - What's unclear: Whether running the spec on a fresh CI invocation (post-decision-block landing) produces 0% or non-zero diff against the committed linux baselines.
   - Recommendation: Plan author should run the spec via empty-commit + push BEFORE finalizing Path A vs Path B. If first fresh CI run shows 0%, Path A is unambiguous. If >0% but <0.005, Path B has a concrete rationale. If >0.005, neither path is sufficient — escalate.

2. **Should the path_decision use `_path_n_decision` (next alphabetical) or `_wmk_01_decision` (requirement-keyed)?**
   - What we know: All v1.8 path_decisions are alphabetical (`_path_a..._path_m`). Phase 66 schema test references them by alphabetical key.
   - What's unclear: Whether deviating to `_wmk_01_decision` breaks consistency or improves clarity. No strict project rule was found.
   - Recommendation: Use `_wmk_01_decision` — better semantic discoverability, matches the v1.9 requirement-namespacing precedent (REQUIREMENTS.md groups by requirement family).

3. **Do we need an optional `tests/v1.9-phase69-wmk-decision.spec.ts` schema test (Pattern D)?**
   - What we know: Phase 66 introduced this pattern; Phase 67/68 have not adopted it.
   - What's unclear: Whether Phase 69's documentation-heavy nature warrants the extra schema-guard. Cost is ~30 LOC + a few seconds CI time.
   - Recommendation: Optional. Plan author may include if they want a mechanical assertion that the path_decision block is not silently deleted in a future refactor. Not required for WMK-01/WMK-02 satisfaction.

4. **What's the WMK-01 / WMK-02 verification ordering with respect to BND-05/06/07 (Phase 67)?**
   - What we know: Phase 67 may "break the D-04 chunk-id lock" via barrel reshape. If wordmark rendering path changes (e.g., new chunk graph routes the wordmark `<svg>` differently), pixel diff could regress.
   - What's unclear: Whether Phase 67 lands before or after Phase 69. ROADMAP.md does not specify ordering between Phases 67/68/69 explicitly.
   - Recommendation: Phase 69 path_decision `review_gate` field MUST mention "Re-evaluate during BND-05/06/07 phase if barrel reshape changes wordmark rendering path." See Pattern C above.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `@playwright/test` (already installed) |
| Config file | `playwright.config.ts` (already configured; chromium project only) |
| Quick run command | `pnpm exec playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts --reporter=list` |
| Full suite command | `pnpm exec playwright test` (all specs) — same as CI |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WMK-01 | `_path_decision` block exists at top of `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` with all 7 required fields (decided, audit, original_threshold, new_threshold, rationale, evidence, review_gate) | structural / schema | `pnpm exec playwright test tests/v1.9-phase69-wmk-decision.spec.ts -x` (optional new spec, Pattern D) OR manual grep: `grep -c "decided:\|audit:\|original_threshold:\|new_threshold:\|rationale:\|evidence:\|review_gate:" tests/v1.8-phase63-1-wordmark-hoist.spec.ts` ≥ 7 | OPTIONAL Wave 0 (Pattern D); manual grep is ALWAYS available |
| WMK-02 | Wordmark spec passes against both `chromium-darwin` AND `chromium-linux` baselines under chosen threshold on first CI run | integration / visual-regression | Local (darwin): `pnpm exec playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts -x`. CI (linux): `gh run list --workflow=ci.yml --limit=1` → status `completed:success` after pushing the path_decision commit | YES — `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` exists; `.github/workflows/ci.yml` runs Playwright on linux |

### Sampling Rate

- **Per task commit:** `pnpm exec playwright test tests/v1.8-phase63-1-wordmark-hoist.spec.ts --reporter=list` (local darwin only, ~5s) — verifies darwin self-passes against darwin baselines
- **Per wave merge:** Same as per-task (single-spec phase)
- **Phase gate:** First green CI run (`gh run list --workflow=ci.yml --limit=1` shows `success` for the commit that introduces the path_decision block) — confirms linux self-passes against linux baselines under the chosen threshold

### Wave 0 Gaps

- [ ] **OPTIONAL** `tests/v1.9-phase69-wmk-decision.spec.ts` — Pattern D schema test (parallel to `tests/v1.9-phase66-lhci-config.spec.ts`). Asserts the 7-field decision block structure. Author this only if the planner decides mechanical schema guard is worth ~30 LOC.
- [ ] **NOT REQUIRED** — no test framework install, no shared-fixture changes, no test config additions. Phase 69 inherits everything from existing infrastructure.

*(If `_wmk_01_decision` block is added inline at the top of the existing spec, no new files are required. The phase fully discharges via a single-file edit + one commit + one CI run.)*

---

## Sources

### Primary (HIGH confidence)
- `tests/v1.8-phase63-1-wordmark-hoist.spec.ts` (lines 1-97) — current spec source
- `tests/v1.8-phase63-1-wordmark-hoist.spec.ts-snapshots/` (8 PNGs, all 200×40 RGB) — confirmed via `ls -la` + `file` 2026-04-30
- `playwright.config.ts:17-29` — confirmed no `snapshotPathTemplate` override
- `.github/workflows/ci.yml:48-69` — confirmed CI runs `pnpm exec playwright test` on `ubuntu-latest` + uploads snapshots artifact
- `.lighthouseci/lighthouserc.json` (path_a, path_b, path_e, path_f) + `.lighthouseci/lighthouserc.desktop.json` (path_a, path_b_decision_note) — verbatim path_decision precedents
- `.planning/phases/60-lcp-element-repositioning/60-02-SUMMARY.md` (lines 296-365) — Phase 60 Path A acceptance narrative
- `.planning/phases/63.1-lcp-fast-path-remediation/63.1-03-SUMMARY.md` (lines 16-19, 267) — wordmark snapshot file inventory
- git commit `68131f6` (Path N bootstrap commit message — lines 31-33 explicitly flag Phase 69 as the follow-up)
- git commit `34d8d4c` (chromium-darwin re-baseline post wordmark vectorization)
- `.planning/REQUIREMENTS.md` lines 36-39 (WMK-01, WMK-02 verbatim)
- `.planning/codebase/AESTHETIC-OF-RECORD.md` lines 68-78 (AES-04 standing rule — out of scope for mutation, in scope for reference)
- `tests/v1.9-phase66-lhci-config.spec.ts` (lines 46-99) — schema-test precedent for Pattern D

### Secondary (MEDIUM confidence)
- `feedback_path_b_pattern.md` (project memory) — 7-field path_decision schema
- `feedback_trademark_primitives.md` (project memory) — wordmark = T1-T3 trademark register justification for tighter gate
- `feedback_ratify_reality_bias.md` (project memory) — recommendation that decisions ratify shipped reality (per-platform baselines exist → ratify them)
- `feedback_lhci_preview_artifacts.md` (project memory) — cross-environment measurement artifact precedent

### Tertiary (LOW confidence)
- (none — Phase 69 scope is fully grounded in primary sources; no WebSearch / Context7 queries were necessary because Playwright's per-platform snapshot routing is project-config-determined and verified directly by file inspection)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@playwright/test` `toHaveScreenshot` + per-platform routing fully verified via `playwright.config.ts` + on-disk file naming
- Architecture (`_path_X_decision` pattern): HIGH — verbatim precedents at `.lighthouseci/lighthouserc.json` lines 2-64; 7-field schema reproduced in 6 distinct path blocks
- Common pitfalls: HIGH — derived from local file inspection + git log + project memory entries dated within last 7 days
- Recommendation Path A vs Path B: MEDIUM — recommendation is Path A (retain), but pending CI variance evidence which only materializes when the path_decision-bearing commit is pushed. Plan author may switch to Path B if first CI run shows non-zero variance.

**Research date:** 2026-04-30
**Valid until:** 2026-05-30 (stable infrastructure; only invalidator would be a Phase 67 barrel-reshape changing the wordmark rendering path or a Playwright major version bump that changes default snapshot routing)
