# Phase 41: Distribution & Launch Gate - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Verify SignalframeUX is publishable to npm, consumable by external projects, and the deployed site maintains Lighthouse 100/100 after all v1.6 changes. This phase produces: a publish-ready package (dry-run verified), an automated consumer integration test, CHANGELOG.md with semver strategy, LICENSE file, and final quality gate verification. No component or build pipeline changes — this is pure verification and distribution packaging.

</domain>

<decisions>
## Implementation Decisions

### Publish Packaging
- **D-01:** Package name remains `signalframeux` (unscoped) — already in package.json, simpler imports
- **D-02:** Source maps excluded from npm tarball — smaller package, no internal code exposure. Source maps remain in `dist/` for local dev but are filtered from the published package
- **D-03:** Published tarball includes: `dist/`, `README.md`, `LICENSE`, `CHANGELOG.md`, `MIGRATION.md`
- **D-04:** License is MIT
- **D-05:** `"files"` field in package.json updated to include the four extra files alongside `dist/`

### Consumer Integration Test
- **D-06:** Automated script (`scripts/consumer-test.ts` or similar) — creates a temp Next.js 16 app, installs the local SFUX tarball via `npm pack`, renders components, runs `next build`, asserts exit 0
- **D-07:** Broader surface test covering all three entry points: layout primitives (SFSection, SFGrid), interactive components (SFAccordion, SFToast), core (SFButton, SFCard), a hook (useSignalframe), and token CSS import — 6-8 components total
- **D-08:** Test validates: imports resolve, TypeScript compiles, `next build` succeeds, token CSS custom properties are present

### Versioning & Changelog
- **D-09:** First publish version is `0.1.0` (pre-release) — signals usable but API may change. Graduate to 1.0.0 after real consumer feedback
- **D-10:** CHANGELOG format follows Keep a Changelog (keepachangelog.com) — sections: Added, Changed, Deprecated, Removed, Fixed, Security
- **D-11:** Single semver version for the whole package. CHANGELOG notes which entry point(s) are affected by breaking changes (e.g., "signalframeux/animation: SFAccordion props changed")

### Final Quality Gate
- **D-12:** Distributed package bundle size verified by automated script — gzip each `dist/` entry point, sum sizes, assert < 50KB total (excluding peer deps). Runs as part of prepublishOnly or standalone
- **D-13:** Lighthouse 100/100 verification reuses existing `scripts/launch-gate.ts` from Phase 35 — same script, fresh run against deployed site after all v1.6 changes
- **D-14:** All E2E tests (18+ Playwright) + Vitest unit tests + axe-core must pass before publish gate clears

### Claude's Discretion
- Consumer test script implementation details (temp directory management, cleanup, component selection within the 6-8 range)
- CHANGELOG content for 0.1.0 (summarize v1.0-v1.6 work or just document the initial public release)
- Bundle size script implementation (inline in prepublishOnly vs standalone script)
- Whether to add a `publish` npm script or rely on manual `npm publish`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Package Configuration
- `package.json` — Current exports field, files field, scripts (prepublishOnly, build:lib), version (0.1.0), peer dependencies
- `tsup.config.ts` — Build configuration for three entry points (index, animation, webgl)

### Library Entry Points
- `lib/entry-core.ts` — Core entry point (49 SF components + utils + hooks)
- `lib/entry-animation.ts` — GSAP-dependent exports
- `lib/entry-webgl.ts` — Three.js-dependent exports

### Existing Verification Scripts
- `scripts/verify-tree-shake.ts` — Tree-shaking validation (already in prepublishOnly)
- `scripts/launch-gate.ts` — Lighthouse CLI verification from Phase 35

### Phase 39 & 40 Context
- `.planning/phases/39-library-build-pipeline/39-CONTEXT.md` — Library build decisions (entry point structure, dependency isolation)
- `.planning/phases/40-api-documentation-dx/40-CONTEXT.md` — Documentation decisions (README, Storybook, MIGRATION.md)

### Consumer-Facing Docs
- `README.md` — Consumer-facing documentation (Phase 40)
- `MIGRATION.md` — Import mapping guide for consumers (Phase 40)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/launch-gate.ts` — Lighthouse verification script, reusable for DIST-04
- `scripts/verify-tree-shake.ts` — Tree-shake validation, already wired into prepublishOnly
- `dist/` directory — Already built with ESM+CJS+declarations for all three entry points
- `README.md`, `MIGRATION.md` — Already written in Phase 40

### Established Patterns
- `prepublishOnly` script already chains `pnpm build:lib` + tree-shake verification — bundle size check can be added to this chain
- `"files": ["dist"]` — Currently only includes dist/, needs expansion for README/LICENSE/CHANGELOG/MIGRATION
- Three entry points (core/animation/webgl) with peer dependencies (react, gsap, three) — consumer test must validate all three paths

### Integration Points
- `package.json` `files` field — add README.md, LICENSE, CHANGELOG.md, MIGRATION.md
- `prepublishOnly` script — add bundle size verification step
- New files: LICENSE (MIT), CHANGELOG.md (Keep a Changelog format), scripts/consumer-test.ts (automated integration test), scripts/verify-bundle-size.ts (size gate)

</code_context>

<specifics>
## Specific Ideas

- Consumer test should be a realistic Next.js 16 app — not a minimal node script. It should import from all three entry points and run `next build` to validate the full compilation pipeline.
- Bundle size gate is for the distributed package (what consumers download), not the site bundle (already gated at 150KB).
- CHANGELOG 0.1.0 entry should document the initial public release with the three entry points and key capabilities.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 41-distribution-launch-gate*
*Context gathered: 2026-04-10*
