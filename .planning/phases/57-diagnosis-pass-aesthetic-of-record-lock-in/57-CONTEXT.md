# Phase 57: Diagnosis Pass + Aesthetic-of-Record Lock-in - Context

**Gathered:** 2026-04-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the measurement ground-truth (per-viewport LCP element identity, per-chunk owner attribution) and codify the aesthetic invariants that Phases 58-62 read from. Pure documentation + baseline capture — zero application code change. Phase 57 outputs are the inputs every other v1.8 phase consumes.

</domain>

<decisions>
## Implementation Decisions

### AESTHETIC-OF-RECORD.md scope
- **D-01:** Doc structure is **standing rules + canonical token references**, not full self-contained extraction.
  - Body codifies the four standing rules (AES-01 extract-from-shipped-code, AES-02 no-Chromatic-rebaseline-for-perf, AES-03 mid-milestone cohort review, AES-04 per-phase pixel-diff <=0.5%).
  - Body cites — does not duplicate — the existing locked artifacts: `.planning/LOCKDOWN.md`, `app/globals.css` token block, trademark primitive component paths.
  - Target length ~150 lines. LOCKDOWN.md remains the authoritative source for invariants; AESTHETIC-OF-RECORD.md is the perf-phase entry point that points downstream agents at the right slices.
  - Why: prevents content drift between two documents that say similar things. Lock-in mode (`feedback_lockin_before_execute.md`) explicitly requires extraction from shipped code, not re-derivation; LOCKDOWN.md already does that.

### Diagnosis output posture
- **D-02:** `v1.8-lcp-diagnosis.md` is **strictly diagnostic** — findings only.
  - Captures: LCP element identity per viewport (mobile 360 + desktop 1440) with file:line evidence; Lighthouse trace + `PerformanceObserver({type: 'largest-contentful-paint'})` corroboration; per-chunk owner attribution table for chunks `3302`, `e9a6067a`, `74c6194b`, `7525`.
  - Does NOT rank the three Phase-60 LCP-02 candidate paths (a/b/c). Ranking lives in Phase 60 plan-phase RESEARCH.md where intervention tradeoffs are properly contextualized against measurement.
  - Why: keeps diagnosis decoupled from intervention thinking. Phase 60 plan-phase reads the diagnosis cold and ranks against then-current evidence (LHCI median, Phase 59 ship state, real-device divergence). Phase 57 ranking would freeze a stale recommendation.

### Baseline screenshot tooling
- **D-03:** Use **Playwright** as the baseline capture tool for the 20 v1.8-start images.
  - Already in repo (`@playwright/test ^1.59.1`, `playwright.config.ts`, existing phase-35 visual specs to model from).
  - Add a baseline-capture spec that loops 5 pages × 4 viewports → emits to `.planning/visual-baselines/v1.8-start/`.
  - Per-phase AES-04 pixel-diff runs through the same Playwright harness for reproducibility.
  - chrome-devtools MCP is **retained** for AES-03 cohort review and ad-hoc visual verification (per `feedback_visual_verification.md`) — but is NOT the baseline-capture tool.
  - Why: deterministic, scriptable, anyone-runnable, CI-compatible. 20 manual MCP captures are slow and non-reproducible; cohort review benefits from MCP's interactive surface.

### Per-chunk attribution method
- **D-04:** Use **`@next/bundle-analyzer`** (already in repo, `^16.2.2`) and write the attribution table directly into `v1.8-lcp-diagnosis.md`.
  - Run `rm -rf .next && ANALYZE=true pnpm build` (BND-04 stale-chunk guard).
  - Inspect the emitted HTML, extract chunk → package mapping, write the table inline.
  - Phase 61 re-runs the same `ANALYZE=true pnpm build` to verify reductions; no new tooling.
  - No JSON artifact, no `source-map-explorer` script, no new dep.
  - Why: avoids new tool dependency; the attribution snapshot lives next to the LCP findings where Phase 61 plan-phase will read it together.

### Claude's Discretion
- AESTHETIC-OF-RECORD.md exact section ordering and prose voice — Claude follows LOCKDOWN.md style precedent.
- Playwright baseline spec naming (e.g., `tests/v1.8-baseline-capture.spec.ts`) and viewport descriptor exact key names — Claude picks consistent with existing phase-35-* naming.
- Whether the Phase 57 commit is split (one for AES doc, one for diagnosis, one for baselines) or single — Claude picks based on what reviews cleanly.
- Trademark primitive file-path enumeration — Claude derives from grep against shipped code (verified during this discussion).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor, verifier) MUST read these before planning or implementing.**

### Phase contract
- `.planning/ROADMAP.md` §"Phase 57: Diagnosis Pass + Aesthetic-of-Record Lock-in" (lines 875-886) — Goal, dependencies, success criteria, cross-cutting note on AES-02/03/04 ownership.
- `.planning/REQUIREMENTS.md` §Diagnosis (DGN-01..03, lines 11-13) and §Aesthetic Preservation (AES-01..04, lines 54-57) — exact requirement text and traceability rows.
- `.planning/research/SYNTH-execution-strategy.md` and `.planning/research/PITFALLS.md` — v1.8 research synthesis (the `Pitfall #10` cited in VRF-04 lives here).

### Aesthetic ground truth (lock-in source)
- `.planning/LOCKDOWN.md` — v1.0 lock @ 2026-04-23. Authoritative invariant set: R-01 through R-64 plus DECIDEs D-01 through D-11. AESTHETIC-OF-RECORD.md cites this; does not duplicate.
- `app/globals.css` — token source-of-truth for `--sf-*` (sizing/canvas/nav-state) and `--sfx-*` (color/theme/duration/spacing). Includes `--sfx-cube-hue`, `--sfx-primary-foreground`, motion easing tokens.
- `CLAUDE.md` §"Token System" — tier-locked palette, blessed spacing stops, semantic typography aliases, animation duration/easing tokens. Acts as the policy header AESTHETIC-OF-RECORD.md operationalizes.

### Trademark primitive locations (must appear in AESTHETIC-OF-RECORD.md per `feedback_trademark_primitives.md`)
- Pixel-sort signal: `components/blocks/entry-section.tsx`, `components/dossier/pointcloud-ring.tsx`, `components/dossier/pointcloud-ring-worker.ts`, `components/dossier/iris-cloud.tsx`, `components/dossier/iris-cloud-worker.ts`.
- Navbar glyph style: `components/layout/nav.tsx`, `components/layout/nav-overlay.tsx`, `components/layout/nav-reveal-mount.tsx`, `components/layout/frame-navigation.tsx`.
- Cube-tile box: `components/blocks/inventory-section.tsx` (semantic), `components/layout/instrument-hud.tsx` + `components/layout/cd-corner-panel.tsx` (cube-fill consumers), `app/globals.css` (`--sfx-cube-hue` slot).

### Tooling refs
- `next.config.ts` — `optimizePackageImports` current state and `withBundleAnalyzer` wiring (Phase 61 will extend; Phase 57 just snapshots).
- `package.json` — confirms `@next/bundle-analyzer ^16.2.2`, `@playwright/test ^1.59.1`, `@axe-core/playwright ^4.11.1` already present. No new deps in Phase 57.
- `playwright.config.ts` — viewport projects, base URL, server lifecycle. Phase 57 baseline spec extends existing config.
- `tests/phase-35-homepage.spec.ts`, `tests/phase-35-lcp-homepage.spec.ts`, `tests/phase-35-cls-all-routes.spec.ts`, `tests/phase-35-bundle-gate.spec.ts` — visual/perf test patterns to model the v1.8 baseline spec from.

### Standing memory invariants (non-negotiable)
- `feedback_lockin_before_execute.md` — extract from shipped code, no fresh discovery.
- `feedback_trademark_primitives.md` — three system-wide trademarks must be visible in any aesthetic doc.
- `feedback_visual_verification.md` — chrome-devtools MCP scroll-test is the visual gate (used here for AES-03 cohort review, not baseline capture).
- `project_token_prefix_split.md` — `--sf-*` vs `--sfx-*` split. Class closed 2026-04-24. AESTHETIC-OF-RECORD.md must reference, never re-debate.
- `project_pf04_autoresize_contract.md` — `lenis-provider.tsx` `autoResize: true` is code-of-record. Phase 59 CRT-04 will preserve; Phase 57 documents it as locked.
- `feedback_audit_before_planning.md` — 2-min grep audit before spawning planner. Already executed above (verified `@next/bundle-analyzer`, `@playwright/test`, LOCKDOWN.md, trademark file paths).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Playwright harness** — `playwright.config.ts` plus 20+ existing `tests/phase-*.spec.ts` files. v1.8 baseline spec is one new file, no infra change.
- **Bundle analyzer wiring** — `next.config.ts` already wires `withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })` (per repo convention). `ANALYZE=true pnpm build` is the documented invocation.
- **chrome-devtools MCP** — already a project workflow tool per `feedback_visual_verification.md`. Used for AES-03 cohort review.
- **LOCKDOWN.md authority** — already extracts shipped invariants. AESTHETIC-OF-RECORD.md references it as canonical, never re-derives.

### Established Patterns
- Visual test spec naming: `tests/phase-{N}-{descriptor}.spec.ts`. Phase 57 baseline spec follows: `tests/v1.8-baseline-capture.spec.ts` (Claude's discretion on exact name, must be discoverable).
- Diagnosis docs land in `.planning/codebase/` (precedent: `HERO-ANIMATION.md`, `ARCHITECTURE.md`, `STACK.md`, etc.). v1.8-lcp-diagnosis.md and AESTHETIC-OF-RECORD.md follow.
- Visual baselines belong in `.planning/visual-baselines/{milestone-tag}/`. Phase 57 creates `.planning/visual-baselines/v1.8-start/` per DGN-03.
- Atomic commits, descriptive messages with metrics where applicable (`CLAUDE.md` §Git).

### Integration Points
- Phase 58 reads AESTHETIC-OF-RECORD.md to know what NOT to violate when standing up LHCI.
- Phase 59 reads v1.8-lcp-diagnosis.md DGN-01 + DGN-02 sections to know what Anton/Lenis/script changes are safe.
- Phase 60 reads DGN-01 to choose between LCP-02 candidates a/b/c.
- Phase 61 reads DGN-02 chunk attribution table to know which packages to add to `optimizePackageImports`.
- Every phase reads AESTHETIC-OF-RECORD.md per AES-04 (per-phase pixel-diff vs `.planning/visual-baselines/v1.8-start/`).

</code_context>

<specifics>
## Specific Ideas

- LOCKDOWN.md was authored as the v0.1.1/v0.1.2/v1.0 register-lock document; AESTHETIC-OF-RECORD.md is its perf-phase counterpart. Treat them as co-equal, single-source on different domains: LOCKDOWN owns "the system locked at v1.0", AESTHETIC-OF-RECORD owns "what perf work in v1.8 must not violate".
- The 20 baseline images are immutable v1.8-start ground truth. Once committed in Phase 57, they are frozen for the milestone — every per-phase pixel-diff (AES-04) and the AES-03 cohort review reference these exact files.
- Per-chunk attribution for `3302`, `e9a6067a`, `74c6194b`, `7525` may include "unattributable" entries if the analyzer cannot resolve them — flagging them is the diagnostic outcome, not a failure.

</specifics>

<deferred>
## Deferred Ideas

- AES-04 pixel-diff threshold automation (CI gate vs human review-only) — out of Phase 57 scope; lives in Phase 58 (CIB-* infrastructure) or Phase 62 (final gate) depending on how Phase 58 plan-phase decomposes.
- Cohort review external-eye recruitment process — operational, not a Phase 57 deliverable. Phase 60 plan-phase or `.planning/STATE.md` notes can capture when AES-03 fires.
- `source-map-explorer` adoption — rejected for Phase 57 (no new deps); revisitable if Phase 61 BND-01 measurement needs finer-grained per-export tracing than `@next/bundle-analyzer` HTML provides.
- Diagnosis-doc ranking of LCP-02 candidates — explicitly deferred to Phase 60 plan-phase RESEARCH.md (D-02).

</deferred>

---

*Phase: 57-diagnosis-pass-aesthetic-of-record-lock-in*
*Context gathered: 2026-04-25*
