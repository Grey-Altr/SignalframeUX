# Phase 36: Housekeeping & Carry-Overs - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Clean up v1.5 deferred items (Lighthouse Best Practices 96→100, SEO 91→100, font-mono test path fix), establish code quality baseline (ESLint strict + style), and formally define v1.6 requirements. Two original success criteria already met pre-phase: Vercel CLI at 50.43.0 (target 50.42.0+) and ROADMAP stale entries partially corrected.

</domain>

<decisions>
## Implementation Decisions

### Lighthouse Strategy
- Run fresh Lighthouse against signalframeux.vercel.app as the first task using existing `launch-gate.ts` (3-run worst-score, JSON output)
- Parse failing audits from the JSON output to identify specific Best Practices and SEO failures
- Fix identified issues, deploy, re-run Lighthouse
- Iterate until both Best Practices and SEO hit 100/100 — no cycle cap
- Accessibility already at 100 (confirmed in launch-gate-2026-04-10T18-09-10-797Z.json) — LH-02 carry-over is resolved

### ESLint Configuration
- Full stack strictness: eslint-config-next + @typescript-eslint/recommended-type-checked + style rules (import ordering, consistent type imports)
- Error-level from day 1 — no warn-level gradual adoption
- Initial cleanup: run `eslint --fix` for mechanical auto-fixable issues, then manually fix remaining violations
- One atomic cleanup commit — clean git blame boundary
- Config format: eslint.config.js (flat config, ESLint 9.x style)

### TypeScript Strict Fixes
- Fix 2 implicit `any[]` errors in `tests/phase-29-infra.spec.ts` (lines 117, 147)
- Small scope addition pulled from Phase 38 backlog

### REQUIREMENTS.md Update
- Append v1.6 requirement IDs under a new `## v1.6 API-Ready` section in the existing REQUIREMENTS.md
- Covers CO-01 through CO-04 (this phase), MG-01 through MG-03 (Phase 37), QA-01 through QA-03 (Phase 38), LIB-01 through LIB-03 (Phase 39), DOC-01 through DOC-04 (Phase 40), DIST-01 through DIST-04 (Phase 41)

### Scope — Already Resolved (Pre-Phase)
- Vercel CLI: already at 50.43.0 (target was 50.42.0+) — no action needed
- ROADMAP stale entries: Phase 31 checkbox, Phase 35 checkbox + plan count, v1.5 milestone checkbox already corrected this session — verify completeness only

### Claude's Discretion
- Specific ESLint rule selection within the strict + style framework (import ordering plugin choice, etc.)
- Order of Lighthouse fix tasks (BP first vs SEO first vs interleaved)
- Whether to split Lighthouse fixes and ESLint setup into separate plans or combine

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### v1.5 Carry-Over Documentation
- `.planning/phases/35-performance-launch-gate/v1.6-carry-overs.md` — Defines all 4 deferred items (T-06, LH-02, LH-03, LH-04) with severity, deferral reason, and suggested v1.6 plan targets
- `.planning/phases/35-performance-launch-gate/wave-3-triage.md` — Wave 3 triage decisions that produced the carry-overs

### Lighthouse Artifacts
- `.planning/phases/35-performance-launch-gate/launch-gate-2026-04-10T18-09-10-797Z.json` — Most recent Lighthouse run (A11y 100, BP 96, SEO 91). Scores only, no audit details — fresh run needed
- `scripts/launch-gate.ts` — Lighthouse runner script (3-run worst-score methodology)

### Test Files
- `tests/phase-35-reference.spec.ts` — Contains T-06 font-mono test that reads wrong file path
- `tests/phase-29-infra.spec.ts` — Contains 2 TypeScript strict-mode violations (implicit any[])

### Project Standards
- `CLAUDE.md` — System rules, design philosophy, quality bar, process conventions
- `.planning/ROADMAP.md` — Phase 36 success criteria and v1.6 milestone definition
- `.planning/REQUIREMENTS.md` — Current v1.5 requirements; will be extended with v1.6 section

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/launch-gate.ts` — Lighthouse runner with 3-run methodology, JSON output, category threshold checking. Reuse directly for fresh audit runs.
- `eslint` 9.25.1 + `eslint-config-next` 15.3.0 — Already installed as dev deps, just need config file

### Established Patterns
- Playwright E2E tests in `tests/` directory — 18 existing test suites, all phase-prefixed
- pnpm as package manager (pnpm-lock.yaml present)
- TypeScript 5.8.3 with strict mode enabled in tsconfig.json

### Integration Points
- `package.json` scripts — will need `"lint": "eslint ."` script added
- `.planning/REQUIREMENTS.md` — append v1.6 section after existing v1.5 content
- `next.config.ts` — ESLint may need Next.js-specific config awareness

</code_context>

<specifics>
## Specific Ideas

- Lighthouse target URL is signalframeux.vercel.app (not the culturedivision.com subdomain from OPEN-2 — DNS may not be wired yet)
- LH-02 (Accessibility 95) is already resolved — second Lighthouse run showed 100. Only BP and SEO remain.
- ESLint flat config (eslint.config.js) is the ESLint 9.x standard — do not use legacy .eslintrc format

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 36-housekeeping-carry-overs*
*Context gathered: 2026-04-10*
