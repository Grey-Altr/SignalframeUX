# Phase 62: Real-Device Verification + Final Gate - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning
**Mode:** `--auto` (all gray areas auto-resolved with recommended defaults — see DISCUSSION-LOG.md)

<domain>
## Phase Boundary

Confirm the synthetic Lighthouse-emulation gains shipped in Phases 57–61 hold on **real devices and field RUM**, then **ratify the v1.8 milestone close**. This is the closing gate of the Speed-of-Light milestone.

**In scope:**
- VRF-01 — multi-device WebPageTest matrix (≥3 profiles) committed to `.planning/perf-baselines/v1.8/`.
- VRF-02 — `pnpm tsx scripts/launch-gate.ts` 5× median 100/100 against prod URL (LCP <1.0s, CLS=0, TTI <1.5s).
- VRF-03 — `chrome-devtools` MCP scroll-test motion contract verification (single GSAP ticker, every SIGNAL effect renders, `prefers-reduced-motion` collapses derived motion).
- VRF-04 — Mid-milestone checkpoint sign-off doc at `.planning/perf-baselines/v1.8/MID-MILESTONE-CHECKPOINT.md`. Phase 60 already shipped a representative iPhone 13 mini-check at `phase-60-realdevice-checkpoint.md` (D-07); Phase 62 expands this to the full 3+ device matrix.
- VRF-05 — Field RUM 75th-percentile LCP <1.0s confirmed via the CIB-05 telemetry endpoint (`/api/vitals` → `console.log` → `vercel logs`) over a ≥24h sampling window post-deploy.
- AES-04 standing pixel-diff (read-only) at phase end as final cohort-review gate.
- v1.8 milestone close artifacts: `62-FINAL-GATE.md`, `62-VERIFICATION.md`, milestone-summary handoff.
- Absorption of Phase 60 SUMMARY ratification (currently deferred per STATE.md).
- Cross-check of Phase 58 HUMAN-UAT items (does not assume the 2 GitHub repo-settings deferred to user — those remain user-action).

**Out of scope:**
- New code paths or perf interventions (Phase 62 is verification + ratification only). Any regressor surfaced becomes a Phase 60.1 / 61.1 / 62.x decimal phase, not in-scope rework.
- New runtime npm dependencies. RUM aggregation reuses `vercel logs` CLI + local script, not a SaaS analytics provider.
- Re-running expensive Phase 57 diagnosis. AESTHETIC-OF-RECORD.md is the read-only ground truth.
- Chromatic re-baseline (AES-02 standing rule).
- Phase 58 GitHub repo-settings (branch protection + LHCI status check enablement) — those are user-only actions tracked in `58-HUMAN-UAT.md`; Phase 62 surfaces their state but does not block on them.

</domain>

<decisions>
## Implementation Decisions

### Plan/PR shape

- **D-01:** **3 plans, 3 PRs** — sequenced by VRF-05's mandatory ≥24h sampling window.
  - **Plan 01:** VRF-01 + VRF-04 — multi-device WebPageTest matrix + `MID-MILESTONE-CHECKPOINT.md` sign-off.
  - **Plan 02:** VRF-02 + VRF-03 — synthetic launch-gate 5× median run + `chrome-devtools` MCP scroll-test motion verification.
  - **Plan 03:** VRF-05 + final-gate ratification — RUM 24h window confirmation + AES-04 read-only pixel-diff + Phase 60 SUMMARY ratification + `FINAL-GATE.md` + `VERIFICATION.md` + milestone-summary handoff.
  - Why: VRF-05's 24h sampling window cannot be parallelized; gating the final-gate plan on RUM data forces this sequence. Each PR is independently bisectable; if any single VRF fails, the regressor is isolated to one plan.

### VRF-01 device profile matrix

- **D-02:** **Roadmap-verbatim 3 profiles** — iPhone 13/14 Safari, Galaxy A14 Chrome, mid-tier Android (e.g., Moto G Power 2024 or equivalent on WPT).
  - JSON committed to `.planning/perf-baselines/v1.8/vrf-01-{ios-iphone13}.json`, `…{android-a14}.json`, `…{android-midtier}.json`.
  - Why: matches ROADMAP/REQUIREMENTS verbatim; no scope creep; ROADMAP success criterion 1 lists exactly these three.

- **D-03:** **WebPageTest free tier as primary source.** BrowserStack used only as fallback if a profile is unavailable on WPT free tier on the day of measurement.
  - Why: zero paid-subscription cost; WPT has all three target profiles in its public location matrix; `feedback_lockin_before_execute.md` favors infrastructure already in the toolchain.

- **D-04:** **5 runs median per profile, LTE network profile (Verizon 4G or equivalent), warm cache.** Capture both first-view and repeat-view JSON.
  - Why: matches Phase 60 D-07 mini-check methodology for direct comparison; LTE is the realistic mid-tier mobile baseline; 5 runs is the standard variance-discipline floor.

### VRF-02 synthetic gate

- **D-05:** **`pnpm tsx scripts/launch-gate-vrf02.ts` 5 sequential runs against prod URL via `@lhci/cli` + `.lighthouseci/lighthouserc.json` standing rule.** Median computed across all 5 runs; pass requires the LHCI standing rule of record:
  - `categories:performance` median ≥ 0.97
  - `categories:accessibility` median ≥ 0.97
  - `categories:best-practices` median ≥ 0.95 (Phase 62 path_b_decision; was 0.97; ratifies font-size audit aesthetic tradeoff — see `.lighthouseci/lighthouserc.json::_path_b_decision`)
  - `categories:seo` median ≥ 1.0
  - `largest-contentful-paint` median ≤ 1000ms
  - `cumulative-layout-shift` median ≤ 0.005 (Phase 60 path_a_decision; was 0; ratifies Anton font swap glyph-metric shift)
  - `total-blocking-time` median ≤ 200ms
  - Output captured at `.planning/perf-baselines/v1.8/vrf-02-launch-gate-runs.json` (5-run array + computed median + dual `verdict_lhci` and `verdict_plan_strict`).
  - Why: D-05 was originally written stricter than the LHCI standing rule (perf == 100 vs ≥ 0.97; CLS == 0 vs ≤ 0.005). Phase 62 surfaced the divergence and reconciled D-05 to the milestone gate of record (Phase 58 CIB-03/04 + Phase 60 path_a_decision). `launch-gate.ts` itself is preserved byte-identical (CIB-04); the new `launch-gate-vrf02.ts` shim delegates to a sibling `.mjs` runner that drives `@lhci/cli` against the rc config — proven mechanism, apples-to-apples with the gating CI.

### VRF-03 motion contract

- **D-06:** **`chrome-devtools` MCP scroll-test executed against prod URL** (not localhost) for end-to-end real-deploy verification. Recorded as an MD note at `.planning/perf-baselines/v1.8/vrf-03-motion-contract.md` with:
  - Single-GSAP-ticker assertion (no rogue `requestAnimationFrame` outside the GSAP ticker — grep audit + DevTools Performance trace evidence).
  - Per-SIGNAL-effect render confirmation (all current SIGNAL surfaces visible at expected scroll positions).
  - `prefers-reduced-motion: reduce` flag flip → all derived motion collapsed verification (via DevTools emulation).
  - Why: matches `feedback_visual_verification.md` chrome-devtools MCP gate; `feedback_raf_loop_no_layout_reads.md` single-ticker-rule enforcement.

### VRF-04 mid-milestone checkpoint

- **D-07:** **`MID-MILESTONE-CHECKPOINT.md` is a synthesis doc, not raw measurement.** Reads VRF-01 JSON files + Phase 60 D-07 mini-check + LHCI medians from Phase 58/60/61 history. Documents:
  - Per-device LCP/CLS/TTI/FCP medians vs ROADMAP gate (<1.0s LCP, CLS=0, TTI <1.5s).
  - Real-device vs synthetic-Lighthouse divergence summary (catches "mobile-emulation-pass / real-device-fail" early per Pitfall #10).
  - Sign-off line. If any device fails, escalate as Phase 62.1 OR Phase 60.1 (regressor-localized).
  - Why: `feedback_lockin_before_execute.md` — extract from shipped data, no fresh discovery; this is a synthesis layer, not a re-measurement.

### VRF-05 field RUM aggregation

- **D-08:** **Aggregation = `vercel logs <project> --output json` over the post-deploy ≥24h window, filtered to `/api/vitals` POST entries, computed locally.**
  - Sampling window: ≥24h post-deploy. If deploy occurred at the start of Plan 03, Plan 03 must wait the window before declaring complete.
  - Local aggregator script: `scripts/v1.8-rum-aggregate.ts` (devDep tooling — no new runtime dep).
  - Output: `.planning/perf-baselines/v1.8/vrf-05-rum-p75-lcp.json` with `{ window_start, window_end, sample_count, p75_lcp_ms, p50_lcp_ms, p99_lcp_ms, by_viewport: { mobile, desktop } }`.
  - Pass: p75 LCP <1.0s. (Sample-count floor: ≥100 for statistical validity; if <100, extend window.)
  - Why: zero-new-runtime-dep rule; `/api/vitals` already pipes web-vitals to `console.log` (Phase 58 CIB-05 SATISFIED); `vercel logs` is the canonical Vercel log surface.

### Carry-over absorption

- **D-09:** **Phase 60 SUMMARY ratification absorbed into Plan 03.** Plan 03 verifies that `60-SUMMARY.md` (or per-plan `60-01-SUMMARY.md` + `60-02-SUMMARY.md`) accurately reflects shipped state, ratifies, and updates STATE.md Phase 60 row from "Path A closed (ratification deferred)" to "complete".
  - Why: STATE.md `last_activity` notes "Phase 60 SUMMARY ratification still deferred"; closing this in Phase 62 is the cleanest path (avoids a free-floating Phase 60.1 just for ratification).

- **D-10:** **Phase 58 HUMAN-UAT cross-check (read-only).** Plan 03 reads `58-HUMAN-UAT.md`, surfaces the 2 GitHub repo-settings items (branch protection + LHCI status-check requirement) in the FINAL-GATE.md "deferred to user" section. Phase 62 does NOT block on these — they remain user-only actions per `feedback_pde_milestone_complete_help_arg.md` discipline (don't auto-attempt repo-settings).
  - Why: surfaces blocked-on-user items at milestone close so they're not lost; respects user-action boundary.

### AES-04 standing pixel-diff

- **D-11:** **Read-only AES-04 pixel-diff at phase end** — 20 surfaces (4 viewports × 5 pages) against `.planning/visual-baselines/v1.8-start/`, MAX_DIFF_RATIO 0.005 (per Phase 61 calibration).
  - Output: `.planning/perf-baselines/v1.8/vrf-aes04-final.json`.
  - Pass: all 20 surfaces ≤0.5%; otherwise final cohort review flags regressor location.
  - Why: AES-04 is a standing rule (every phase, every close-out); read-only at Phase 62 because no code shipping; final close-out should re-confirm zero aesthetic drift across v1.8 cumulative work.

### Final-gate ratification artifacts

- **D-12:** **Full close-out artifact set** matching the v1.7 Phase 56 final-gate close pattern:
  - `62-MID-MILESTONE-CHECKPOINT.md` — VRF-04 sign-off (also referenced from Plan 01 final commit).
  - `62-FINAL-GATE.md` — synthesis: VRF-01..05 status table, milestone-wide gate confirmation, sign-off line.
  - `62-VERIFICATION.md` — standard phase verification (per `pde-verifier`).
  - `MILESTONE-SUMMARY.md` (or equivalent handoff doc) — drop into `.planning/milestones/v1.8/` so the v1.8 archive is ready for `/pde:complete-milestone`.
  - Why: matches Phase 56 v1.7 final-gate close pattern (proven); ensures `complete-milestone` workflow runs cleanly afterward.

### Claude's Discretion

- Exact `scripts/v1.8-rum-aggregate.ts` JSON shape (which percentiles to compute beyond p75; whether to break down by viewport / by device / by page) — Claude picks based on what `vercel logs` surfaces.
- Plan 01 commit-split granularity (one commit per device JSON vs one commit for the whole matrix + checkpoint synthesis).
- VRF-03 chrome-devtools MCP step sequence (which scroll positions to capture, how many; whether to record a video artifact or stills).
- Plan 03 sequencing of AES-04 pixel-diff vs RUM window wait (parallel-safe).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor, verifier) MUST read these before planning or implementing.**

### Phase contract

- `.planning/ROADMAP.md` §"Phase 62: Real-Device Verification + Final Gate" — Goal, dependencies (Phases 59, 60, 61), all 5 success criteria.
- `.planning/REQUIREMENTS.md` §Verification (VRF-01..05) — exact requirement text + Pitfall #10 anchor for VRF-04.

### Prior-phase outputs that Phase 62 reads as inputs

- `.planning/codebase/AESTHETIC-OF-RECORD.md` — AES-01..04 standing rules; AES-04 MAX_DIFF_RATIO 0.005 calibration ratified in Phase 61.
- `.planning/codebase/v1.8-lcp-diagnosis.md` — Phase 57 LCP element identity; Phase 62 VRF-04 reads to verify post-defer LCP element on real devices.
- `.planning/codebase/v1.8-lcp-evidence.json` — machine-readable LCP measurements; VRF-01 real-device JSON shape mirrors this.
- `.planning/codebase/v1.8-lcp-candidates.json` — Phase 60 Plan 01 standing measurement tool; Phase 62 VRF-04 re-runs against real-device profiles for cross-check.
- `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md` — Phase 60 D-07 mini-check (single-device iPhone 13); Plan 01 expands this to full 3+ device matrix.
- `.planning/perf-baselines/v1.8/phase-60-mobile-lhci.json` — synthetic LHCI median for direct synthetic-vs-real comparison in MID-MILESTONE-CHECKPOINT.md.

### Tooling refs (already in repo — zero new deps)

- `scripts/launch-gate.ts` — VRF-02 5-run synthetic gate (proven v1.7 PRF mechanism).
- `app/_components/web-vitals.tsx` — `useReportWebVitals` → `navigator.sendBeacon` → `/api/vitals` (Phase 58 CIB-05 SATISFIED). VRF-05 source.
- `app/api/vitals/route.ts` — `/api/vitals` POST handler logging via `console.log` (Phase 58). VRF-05 reads via `vercel logs`.
- `tests/v1.8-baseline-capture.spec.ts` — Phase 57 baseline capture spec; AES-04 final pixel-diff harness.
- `tests/v1.8-phase58-pixel-diff.spec.ts` — Phase 58 pixel-diff spec; D-11 reuses without `--update-snapshots`.
- `tests/v1.8-web-vitals.spec.ts` — Phase 58 sendBeacon contract spec; Plan 03 may re-run against prod URL as VRF-05 sanity check.
- `playwright.config.ts:22-27` — SwiftShader headless WebGL backend caveat; VRF-04 real-device matrix is the answer to this caveat at scale.

### Phase 60/61 artifacts to ratify in Plan 03

- `.planning/phases/60-lcp-element-repositioning/60-01-SUMMARY.md`, `60-02-SUMMARY.md` — Phase 60 SUMMARY ratification (D-09).
- `.planning/phases/58-lighthouse-ci-real-device-telemetry/58-HUMAN-UAT.md` — Phase 58 carry-over cross-check (D-10).
- `.planning/phases/61-bundle-hygiene/61-VERIFICATION.md` — Phase 61 VERIFICATION (already passed); Phase 62 only confirms milestone-cumulative state.

### Pitfalls (non-negotiable)

- `.planning/codebase/PITFALLS.md` Pitfall #10 — mid-milestone real-device checkpoint after Phase 60 (VRF-04 anchor).
- `.planning/codebase/PITFALLS.md` Pitfall #5 — single-ticker rule (VRF-03 enforcement).
- `.planning/codebase/PITFALLS.md` Pitfalls #2, #8 — `/sf-canvas-sync.js` inline IIFE rule; VRF-02 launch-gate must not regress this.
- `.planning/codebase/PITFALLS.md` Pitfall #7 — `experimental.inlineCss: true` rejection; standing rule, surfaces in VRF-03 motion contract verification.

### Standing memory invariants

- `feedback_lockin_before_execute.md` — extract from shipped code/data; D-07 (synthesis), D-09 (SUMMARY ratification), D-10 (HUMAN-UAT cross-check) all honor this.
- `feedback_visual_verification.md` — chrome-devtools MCP scroll-test is the visual gate (D-06 mechanism).
- `feedback_audit_before_planning.md` — 2-min grep audit before spawning planner; this CONTEXT.md already audited `/api/vitals` reality (console.log + Vercel logs surface) before locking D-08.
- `feedback_ratify_reality_bias.md` — when doc/test lags shipping code, ratify reality; D-09 Phase 60 SUMMARY ratification directly applies.
- `feedback_raf_loop_no_layout_reads.md` — single-ticker-rule cross-check in VRF-03.
- `feedback_consume_quality_tier.md` — every signal surface must read `getQualityTier()`; VRF-03 motion contract verifies this against shipped state.
- `feedback_pde_milestone_complete_help_arg.md` — `pde-tools milestone complete --help` is destructive; Plan 03 milestone close-out must pass version literal explicitly.
- `feedback_milestone_workflow_keep_originals.md` — complete-milestone has internal contradiction on ROADMAP/REQUIREMENTS deletion; project precedent (7 milestones) preserves them — Plan 03 follows this.
- `project_phase58_complete.md` — confirms 2 GitHub repo-settings deferred to user, code-side green; D-10 surfaces these without blocking.
- `project_phase61_closed.md` — AES-04 calibration source-of-truth (MAX_DIFF_RATIO 0.005); D-11 reuses.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **`scripts/launch-gate.ts`** — proven 5-run gate from v1.7 PRF; VRF-02 reuses without modification.
- **`/api/vitals` endpoint** — already shipping web-vitals via sendBeacon → `console.log` (Phase 58 CIB-05). VRF-05 reads via `vercel logs`.
- **Playwright + chrome-devtools MCP harness** — already installed; VRF-03 motion contract verification reuses.
- **Phase 60 D-07 real-device methodology** — single-device WPT mini-check; Plan 01 multi-device matrix scales the same template.
- **`tests/v1.8-baseline-capture.spec.ts` + `tests/v1.8-phase58-pixel-diff.spec.ts`** — AES-04 standing pixel-diff harness; D-11 read-only re-run.
- **`vercel logs` CLI** — RUM aggregation source; zero-new-runtime-dep path.

### Established Patterns

- v1.8 perf artifacts land in `.planning/perf-baselines/v1.8/` (Phase 60 already established this).
- Per-VRF JSON snapshot naming: `vrf-{n}-{descriptor}.json`.
- Synthesis MD docs at phase or milestone level (`MID-MILESTONE-CHECKPOINT.md`, `FINAL-GATE.md`) — Phase 56 v1.7 close pattern.
- Atomic commits per intervention surface; descriptive messages with metrics (`CLAUDE.md` §Git).
- v1.8 phase-spec naming: `tests/v1.8-{descriptor}.spec.ts` (Phase 62 may add `tests/v1.8-vrf-motion-contract.spec.ts` if a programmatic VRF-03 surface is preferable to MCP-only).
- Devtools tooling lives in `scripts/v1.8-{descriptor}.ts` (Plan 03 RUM aggregator follows this).

### Integration Points

- VRF-04 mid-milestone checkpoint synthesis reads Phase 60 D-07 outputs + Plan 01 multi-device JSON; gates Plan 02 start (no VRF-02 sense without VRF-04 confirming real-device parity).
- VRF-05 RUM 24h window depends on production deploy; if v1.8 ships only after Phase 62 closes, RUM window can only start at Plan 02 close — Plan 03 must wait.
- Phase 60 SUMMARY ratification (D-09) gates `MILESTONE-SUMMARY.md` content (D-12); cannot finalize milestone summary while Phase 60 row is "Path A closed (deferred)".
- Phase 58 HUMAN-UAT carry-over (D-10) surfaces in `FINAL-GATE.md` "deferred to user" block; does not block milestone-summary handoff.

</code_context>

<specifics>
## Specific Ideas

- The 24h RUM window in VRF-05 is the milestone-closing critical path. Plan 03 cannot start aggregating until ≥24h post-deploy. If v1.8 deploys on Plan 02 close, Plan 03 has built-in idle time — ideal for Phase 60 SUMMARY ratification + AES-04 read-only pixel-diff to run during the wait.
- WebPageTest free tier rate-limits anonymous runs (~200 tests/month). Plan 01 should batch-submit all 3 profiles in a single sitting to avoid hitting the rate limit mid-matrix. Capture run IDs at submission time to retrieve JSON later via WPT API.
- The "WebPageTest JSON (or BrowserStack supplement)" wording in ROADMAP success criterion 1 reads as "WPT primary, BrowserStack fallback" — D-03 codifies this.
- VRF-03 motion contract verification is **prod-URL only** (D-06). Localhost has SwiftShader headless caveat per `playwright.config.ts:22-27`; only prod-URL chrome-devtools MCP run reflects user reality.
- VRF-05's "field RUM" implies real users — but pre-launch v1.8 has minimal traffic. The 24h window may need synthetic real-device traffic seeding (chrome-devtools MCP runs from Plan 01's 3 device profiles) to hit the ≥100 sample floor. If natural traffic is sparse, the synthetic-seeding fallback is acceptable AS LONG AS it's documented in `vrf-05-rum-p75-lcp.json` `sample_source: "synthetic-seeded" | "natural" | "mixed"`.
- `pde-tools milestone complete` requires version literal — `feedback_pde_milestone_complete_help_arg.md` is non-negotiable. Plan 03 milestone close runs `/pde:complete-milestone v1.8` (literal version, not `--help`).

</specifics>

<deferred>
## Deferred Ideas

- **Sentry Performance / Vercel Analytics integration for ongoing RUM** — would replace the `vercel logs` aggregation but introduces a runtime dep; deferred indefinitely (revisit in v1.9 if RUM becomes a standing-monitoring concern, not just a milestone gate).
- **Programmatic VRF-03 motion contract spec** (`tests/v1.8-vrf-motion-contract.spec.ts`) — D-06 chose chrome-devtools MCP only; Claude's-Discretion item, may add IFF MCP verification is too manual.
- **5+ device profile matrix** (iPhone SE low-end, Pixel 7 high-end) — D-02 chose verbatim 3 profiles; expand only if Phase 62 shows mid-tier-only coverage misses a critical real-world segment.
- **BrowserStack subscription** — D-03 chose WPT-only; revisit only if WPT cannot service all 3 target profiles on measurement day.
- **Auto-running launch-gate.ts in CI on prod deploy** — automation enhancement; Phase 58 LHCI already covers PR-time synthetic gating; prod-time gating is a v1.9 nice-to-have.
- **Phase 58 GitHub repo-settings (branch protection + LHCI required check)** — D-10 surfaces but does not absorb; remains user-only action per project HUMAN-UAT discipline.
- **AES-04 pixel-diff CI gate automation** — owned by Phase 58 / future hardening, not Phase 62 (Phase 62 is read-only verification).
- **Cross-milestone perf trend dashboard** (v1.7 vs v1.8 vs v1.9 LCP/CLS/TTI tracking) — milestone-summary handoff (D-12) seeds this with v1.8 numbers; full dashboard is v1.9+ scope.

### Reviewed Todos (not folded)

None — `cross_reference_todos` returned no matches for Phase 62 in `--auto` mode.

</deferred>

---

*Phase: 62-real-device-verification-final-gate*
*Context gathered: 2026-04-27*
*Mode: --auto (single-pass; all gray areas resolved with recommended defaults)*
