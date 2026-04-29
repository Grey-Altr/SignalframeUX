# Phase 60: LCP Element Repositioning - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Close the LCP gap from current measurement to **<1.0s on prod homepage mobile** (real-world recovery from v1.7 Phase-37 baseline of LCP 6.5s on the THESIS GhostLabel) by deferring paint of the diagnosed mobile LCP element identified in Phase 57 — without aesthetic drift.

**In scope:** mobile-only LCP intervention via the diagnosed candidate (b); reusable pre-need LCP candidate analysis tooling; in-phase real-device sanity gate; AES-03 mid-milestone cohort review handoff into Phase 61.

**Out of scope:** desktop LCP intervention (synthetic LCP already 92/116ms cold/warm — well under <1.0s gate; LCP-01 success criterion is mobile-only); bundle hygiene / `optimizePackageImports` (Phase 61); full multi-device VRF-04 matrix (Phase 62); cohort review framework changes (standing rule per AES-03).

</domain>

<decisions>
## Implementation Decisions

### Plan/PR shape

- **D-01:** **2 plans, 2 PRs** — Plan 01 scaffolding + Plan 02 mobile intervention. Mirrors Phase 59's CRT-05 strict-bisect philosophy in scaled-down form: each PR is independently bisectable, mid-milestone cohort review (AES-03) fires after Plan 02 ships.
  - Note: this is a **revision** from the initial "3 plans" framing in Area 1 — Area 3 reframed desktop intervention as monitor-only, collapsing the desktop plan.
  - Why: success-criterion-bound scope. LCP-01 is explicitly mobile-only; desktop synthetic LCP already passes (92/116ms cold/warm); shipping a desktop intervention that violates the diagnosed (a)/(b)/(c) candidate set would require a ROADMAP/REQUIREMENTS amendment.

- **D-02:** **Strict parallel with Phase 61** — Phase 60 starts now per ROADMAP's `Phase 60 ⊥ Phase 61` declaration. Bundle hygiene (Phase 61) does not affect LCP element identity; measurement environments don't conflict.

### Mobile intervention (Plan 02)

- **D-03:** **Mobile intervention = candidate (b)** — `content-visibility: auto` + `contain-intrinsic-size` applied to `GhostLabel` LEAF element ONLY, never the section wrapper (Anti-Pattern #5 from PITFALLS.md). Defers paint of the 4% opacity decorative wayfinding element until it scrolls into the viewport, removing the diagnosed LCP element from the critical paint path.
  - File scope: `components/animation/ghost-label.tsx` only (single-file change for the intervention itself).
  - `containIntrinsicSize` value: sized to actual rendered dimensions per viewport (clamped against the existing `clamp(200px, calc(25*var(--sf-vw)), 400px)` font-size formula). Plan 02 RESEARCH.md captures the measurement.
  - Why: most direct fix; ZERO aesthetic risk (decorative, not brand canonical); pixel-diff <0.5% expected trivially against `.planning/visual-baselines/v1.8-start/`.

- **D-04:** **Reactive post-defer posture** — Ship (b), measure LHCI median-of-5, identify the new LCP candidate from the same `PerformanceObserver` methodology used in Phase 57 DGN-01. If the new LCP is already <1.0s, Plan 02 declares complete. If not, escalate as Plan 03 of Phase 60 OR defer to Phase 60.1 / Phase 62 cleanup. **No speculative pre-emptive intervention.**
  - Why: avoids over-engineering; respects `feedback_lockin_before_execute.md` (extract from shipped code, no fresh discovery on speculative paths).

### Desktop posture

- **D-05:** **Desktop = monitor-only**. No desktop intervention shipped in Phase 60.
  - Monitoring mechanism: AES-04 pixel-diff at phase end + LHCI desktop run captured for informational record.
  - Escalation trigger: if desktop LHCI median regresses post-mobile-intervention OR cohort review (AES-03) flags "feels different" on desktop, escalate to Phase 60.1 OR roll into Phase 62 cleanup.
  - Why: LCP-01 success criterion is explicitly mobile-only; desktop synthetic LCP is 92ms cold / 116ms warm (well under <1.0s); the diagnosed (a)/(c) candidates do not directly target the desktop LCP element (visible VL-05 magenta `//` overlay at `entry-section.tsx:193-210`), so a "defensive" desktop intervention would either be speculative or violate LCP-02's verbatim candidate constraint.

### Scaffolding (Plan 01)

- **D-06:** **Plan 01 = pre-need LCP candidate analysis script** — Playwright spec + node script that enumerates all paint candidates >50px² on homepage at all 4 viewports (mobile-360, iPhone 13, iPad, desktop-1440), ranks by predicted LCP arrival time (using the same `PerformanceObserver({type:'largest-contentful-paint', buffered:true})` methodology), and emits a JSON map at `.planning/codebase/v1.8-lcp-candidates.json`.
  - Reuse #1: Plan 02 (mobile intervention) reads it to predict next-LCP-after-defer (informs D-04 reactive posture).
  - Reuse #2: Phase 62 VRF-04 (real-device gate) uses the same script structure for real-device candidate enumeration.
  - Spec naming: `tests/v1.8-lcp-candidates.spec.ts` (consistent with `tests/v1.8-lcp-diagnosis.spec.ts` from Phase 57).
  - Why: reusable infrastructure; converts a one-time pre-need analysis into a standing measurement tool that any future LCP work can re-run.

### Real-device gate (Plan 02 close-out)

- **D-07:** **In-phase mini real-device check before Plan 02 declares complete** — single representative WebPageTest run (free public webpagetest.org instance) on iPhone 13 Safari, Verizon LTE profile, 5 runs median. Result captured at `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md`.
  - This does NOT replace Phase 62 VRF-04 (which runs the full 3+ device matrix). It catches an obvious real-device-fail before Phase 60 hands off.
  - Pass threshold: real-device LCP <1.5s (more lenient than synthetic LHCI <1.0s — accommodates real-network noise; full VRF-04 strict <1.0s gate runs in Phase 62).
  - Why: Pitfall #10 explicit non-negotiability; avoids reopen risk if Phase 62 VRF-04 flags Phase 60 ship as the regressor.

### Cohort review (AES-03)

- **D-08:** **AES-03 cohort review = solo via chrome-devtools MCP scroll-test**. User runs chrome-devtools MCP scroll-test against post-Phase-60 prod URL, side-by-side with `.planning/visual-baselines/v1.8-start/` baselines (all 4 viewports × all 5 pages = 20 image surface). Sign-off note dropped at `.planning/phases/60-lcp-element-repositioning/60-AES03-COHORT.md`.
  - "External eye" interpreted as "fresh-eyes pass after time delay" — user looks at it the next morning before unblocking Phase 61.
  - Matches `feedback_visual_verification.md` chrome-devtools MCP gate.
  - Why: fast, no scheduling overhead, fits solo-developer reality of this project.

### Claude's Discretion

- Exact `containIntrinsicSize` value tuning per breakpoint — Claude derives from measurement during Plan 02 Wave 0.
- Plan 01 LCP-candidates script implementation language (TypeScript spec + node post-processor vs pure Playwright spec) — Claude picks for consistency with existing `tests/v1.8-lcp-diagnosis.spec.ts` structure.
- Plan 02 commit-split granularity within the single PR — Claude picks based on what reviews cleanly (likely: one commit for `containIntrinsicSize` + `content-visibility` + one commit for the LHCI gate snapshot).
- AES-04 pixel-diff CI integration vs human-review-only for Phase 60 — Claude defaults to human-review-only (Phase 58/62 own automation decision).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor, verifier) MUST read these before planning or implementing.**

### Phase contract
- `.planning/ROADMAP.md` §"Phase 60: LCP Element Repositioning" (lines 924–933) — Goal, dependencies (Phase 57 + Phase 59), success criteria 1–4, plan-shape contingency note.
- `.planning/REQUIREMENTS.md` §LCP Repositioning (LCP-01..03, lines 31–35) and §Aesthetic Preservation (AES-01..04, lines 54–57) — exact requirement text and the verbatim (a)/(b)/(c) candidate constraint that LCP-02 imposes.
- `.planning/REQUIREMENTS.md` §Verification VRF-04 (line 49) — mid-milestone real-device checkpoint after Phase 60 (Pitfall #10 anchor).

### Phase 57 diagnosis (the input — non-negotiable)
- `.planning/codebase/v1.8-lcp-diagnosis.md` §1 LCP Element Identity (lines 17–48) — per-viewport LCP element identity with file:line evidence; cross-viewport divergence finding.
- `.planning/codebase/v1.8-lcp-diagnosis.md` §3 Diagnostic notes — no intervention ranking (lines 115–144) — D-02 deferral rationale; sync-script disambiguation (CRT-01 scope already shipped); headless WebGL caveat (Plan 02 real-device gate context).
- `.planning/codebase/v1.8-lcp-evidence.json` — machine-readable LCP measurements; Plan 01 candidates script extends the same JSON shape.
- `.planning/phases/57-diagnosis-pass-aesthetic-of-record-lock-in/57-CONTEXT.md` — Phase 57 D-01 through D-04; AESTHETIC-OF-RECORD scope; baseline tooling decisions inherited.

### Aesthetic ground truth
- `.planning/codebase/AESTHETIC-OF-RECORD.md` — perf-phase entry point. Phase 60 reads AES-01 (extract from shipped code), AES-03 (mid-milestone cohort review fires after Phase 60), AES-04 (per-phase pixel-diff <=0.5%); §5 Enforcement Matrix row for Phase 60.
- `.planning/codebase/AESTHETIC-OF-RECORD.md` §4 Captured-state note — mobile baselines are reduced-motion + warm-Anton variant frozen pre-reveal at opacity 0.01; Phase 60 mobile pixel-diff must understand this state (a content-visibility defer should NOT shift visible state at the captured frame because GhostLabel is at 4% opacity in the captured state).
- `.planning/LOCKDOWN.md` §1 Trademark Primitives (line 27) — T1 PIXEL-SORT, T4 `//` SEPARATOR. Mobile intervention does not touch T1/T4 (decorative wayfinding only); desktop monitor-only protects T4.
- `app/globals.css:1486-1488` — `.sf-hero-deferred { opacity: 0; }` rule referenced by D-04 reactive post-defer analysis.

### Trademark primitive locations to monitor (per `feedback_trademark_primitives.md`)
- T1 Pixel-sort signal: `components/blocks/entry-section.tsx`, `components/dossier/pointcloud-ring.tsx`, `components/dossier/pointcloud-ring-worker.ts`, `components/dossier/iris-cloud.tsx`, `components/dossier/iris-cloud-worker.ts`. Mobile (b) intervention does NOT touch any of these; AES-04 pixel-diff verifies.
- T4 `//` separator: `components/blocks/entry-section.tsx:132` (in-h1 chars) and `:193-210` (visible VL-05 overlay). Desktop monitor-only posture explicitly protects this.

### Tooling refs
- `tests/v1.8-lcp-diagnosis.spec.ts` — Phase 57 Plan 03 LCP measurement spec; Plan 01 LCP-candidates spec extends the same `PerformanceObserver` pattern.
- `tests/v1.8-baseline-capture.spec.ts` — Phase 57 Plan 02 baseline capture spec; AES-04 pixel-diff for Phase 60 close-out reuses this harness without `--update-snapshots`.
- `playwright.config.ts:22-27` — SwiftShader headless WebGL backend caveat documented in Phase 57; Plan 02 real-device gate (D-07) is the answer to this caveat.
- `next.config.ts` — `optimizePackageImports` current state (Phase 61 will extend; Phase 60 just measures).
- `package.json` — confirms `@next/bundle-analyzer ^16.2.2`, `@playwright/test ^1.59.1`, `@axe-core/playwright ^4.11.1` already present; **no new deps in Phase 60**.

### Standing memory invariants (non-negotiable)
- `feedback_lockin_before_execute.md` — extract from shipped code, no fresh discovery; reactive post-defer posture (D-04) directly honors this.
- `feedback_audit_before_planning.md` — 2-min grep audit before spawning planner; this CONTEXT.md already audited LCP-02 candidates against actual diagnosed elements (the (a)/(c) mismatch with desktop LCP element is the audit finding that drove D-05).
- `feedback_visual_verification.md` — chrome-devtools MCP scroll-test is the visual gate (D-08 cohort review mechanism).
- `feedback_trademark_primitives.md` — T1/T2/T3/T4 must remain visible after any aesthetic-affecting change; Phase 60 mobile (b) intervention does not touch any trademark.
- `feedback_consume_quality_tier.md` — every signal surface MUST consume `getQualityTier()`; not directly applicable to GhostLabel (decorative FRAME element, not SIGNAL surface) but Plan 01 candidates script should record per-viewport quality-tier value alongside LCP measurement for downstream cross-reference.
- `feedback_ratify_reality_bias.md` — when doc/test lags shipping code, ratify reality; Plan 02 measurement may surface that the diagnosed mobile LCP shifted between Phase 57 and Phase 60 due to Phase 59 Anton swap; if so, ratify the new reality and adjust the intervention target accordingly.
- `project_pf04_autoresize_contract.md` — `lenis-provider.tsx` `autoResize: true` is code-of-record; Plan 02 must not break this when measuring (Lenis init was deferred via rIC in Phase 59 CRT-04; LCP measurements run after Lenis settles).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Playwright + bundle-analyzer harness** — `playwright.config.ts`, `tests/v1.8-lcp-diagnosis.spec.ts`, `tests/v1.8-baseline-capture.spec.ts` already in repo from Phase 57. Plan 01 extends; Plan 02 reuses without modification.
- **Phase 57 `PerformanceObserver` extraction pattern** — `tests/v1.8-lcp-diagnosis.spec.ts` programmatic extraction methodology is the template for Plan 01's candidate enumeration.
- **chrome-devtools MCP** — already a project workflow tool per `feedback_visual_verification.md`. D-08 cohort review mechanism.
- **AESTHETIC-OF-RECORD.md citation map** — Phase 60 reads from this single entry point (AES-01 standing rule), not LOCKDOWN.md directly.

### Established Patterns
- v1.8 phase spec naming: `tests/v1.8-{descriptor}.spec.ts`. Plan 01 follows: `tests/v1.8-lcp-candidates.spec.ts`.
- Diagnostic + measurement docs land in `.planning/codebase/`. Plan 01 emits `.planning/codebase/v1.8-lcp-candidates.json`.
- Real-device perf snapshots land in `.planning/perf-baselines/{milestone-tag}/`. D-07 emits `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md`.
- AES-03 cohort review notes land in phase directory: `.planning/phases/60-lcp-element-repositioning/60-AES03-COHORT.md`.
- Atomic commits per intervention surface; descriptive messages with metrics where applicable (`CLAUDE.md` §Git).

### Integration Points
- Phase 60 outputs (post-Phase-60 LHCI median, AES-03 cohort sign-off, real-device checkpoint) gate Phase 61 start (Phase 61 reads Phase 60 STATE.md notes for go/no-go).
- Phase 62 VRF-04 reads `.planning/perf-baselines/v1.8/phase-60-realdevice-checkpoint.md` as the prior-art real-device baseline + extends to full 3+ device matrix.
- `.planning/codebase/v1.8-lcp-candidates.json` is read by Phase 62 VRF-04 (real-device candidate enumeration) and any future LCP intervention work in v1.9+.

</code_context>

<specifics>
## Specific Ideas

- The "diagnosed (a)/(b)/(c) candidate constraint" in LCP-02 is verbatim binding for the intervention shipped, but the diagnosis output revealed that (a) and (c) do NOT directly target the diagnosed desktop LCP element (the visible VL-05 magenta `//` overlay at `entry-section.tsx:193-210`). This drove D-05 (desktop = monitor-only) — shipping a "defensive" desktop intervention that doesn't actually target the diagnosed element would be aesthetic-risk-without-LCP-payoff theatre.
- Mobile (b) intervention is a one-line CSS-property addition to `ghost-label.tsx`. The complexity is in the **measurement infrastructure** (Plan 01) and the **gating discipline** (Plan 02 LHCI median-of-5 + WebPageTest mini-check + AES-04 pixel-diff + AES-03 cohort review), not the code change itself.
- Anti-Pattern #5 (`content-visibility` on section wrapper, never leaf) is the singular landmine for this phase. Plan 02 RESEARCH.md must reference this explicitly; Plan 02 commit message should call it out.
- Plan 01's LCP-candidates script is a **standing v1.8 measurement tool**, not a one-off Phase 60 artifact. Naming, location, and JSON shape choices are made for long-term reuse.

</specifics>

<deferred>
## Deferred Ideas

- **Desktop LCP intervention** — deferred to Phase 60.1 (decimal phase) IFF AES-03 cohort review or Phase 62 VRF-04 flags desktop regression; otherwise no desktop intervention ships at all in v1.8.
- **Adding candidate (d) `content-visibility` on visible `//` overlay** — would require ROADMAP/REQUIREMENTS amendment to the LCP-02 verbatim candidate set; deferred indefinitely (revisit only if desktop LCP becomes a real-world problem post-deploy).
- **Hybrid (b) + proactive next-candidate intervention** — explicitly deferred via D-04 reactive posture; revisit only if Plan 02 measurement shows post-defer LCP still >1.0s.
- **Full VRF-04 multi-device matrix inside Phase 60** — explicitly out of scope per D-07; lives in Phase 62.
- **AES-04 pixel-diff CI gate automation** — owned by Phase 58 (CIB-* infrastructure) or Phase 62 (final gate), not Phase 60.
- **Invited external-eye cohort review** — D-08 chose solo chrome-devtools MCP path; revisit if AES-03 mechanism feels insufficient at Phase 62 final-gate audit.

</deferred>

---

*Phase: 60-lcp-element-repositioning*
*Context gathered: 2026-04-26*
