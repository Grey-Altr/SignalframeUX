---
phase: 42
slug: tracking-reconciliation-peerdep-fix
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-29
reconstructed_from: [42-01-PLAN.md, 42-01-SUMMARY.md]
---

# Phase 42 — Validation Strategy

> Per-phase validation contract reconstructed post-hoc for v1.6 archive nyquist compliance.
> Phase 42 is a metadata-only phase (SUMMARY frontmatter additions + package.json peer-dep relocation). No runtime behavior changed; verification is grep + JSON-shape assertion only.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep (frontmatter), node -e (package.json shape) |
| **Config file** | n/a — no test runner needed for metadata-only changes |
| **Quick run command** | `grep -H "requirements-completed:" .planning/phases/36-housekeeping-carry-overs/36-0{1,2}-SUMMARY.md .planning/phases/39-library-build-pipeline/39-0{1,2}-SUMMARY.md` |
| **Full suite command** | Quick run + `node -e "..."` package.json shape check (see Task 2 verify) |
| **Estimated runtime** | ~1 second |

---

## Sampling Rate

- **After every task commit:** Run quick command (grep frontmatter + node JSON shape)
- **After every plan wave:** Both checks (single plan, single wave)
- **Before `/pde:verify-work`:** Both must be green
- **Max feedback latency:** 1 second

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 42-01-01a | 01 | 1 | CO-01 | grep | `grep "requirements-completed: \[CO-01, CO-02\]" .planning/phases/36-housekeeping-carry-overs/36-01-SUMMARY.md` | yes | green |
| 42-01-01b | 01 | 1 | CO-02 | grep | `grep "requirements-completed: \[CO-01, CO-02\]" .planning/phases/36-housekeeping-carry-overs/36-01-SUMMARY.md` | yes | green |
| 42-01-01c | 01 | 1 | CO-03 | grep | `grep "requirements-completed: \[CO-03, CO-04\]" .planning/phases/36-housekeeping-carry-overs/36-02-SUMMARY.md` | yes | green |
| 42-01-01d | 01 | 1 | CO-04 | grep | `grep "requirements-completed: \[CO-03, CO-04\]" .planning/phases/36-housekeeping-carry-overs/36-02-SUMMARY.md` | yes | green |
| 42-01-01e | 01 | 1 | LIB-02 | grep | `grep "requirements-completed: \[LIB-02\]" .planning/phases/39-library-build-pipeline/39-01-SUMMARY.md` | yes | green |
| 42-01-01f | 01 | 1 | LIB-01 | grep | `grep "requirements-completed: \[LIB-01, LIB-03\]" .planning/phases/39-library-build-pipeline/39-02-SUMMARY.md` | yes | green |
| 42-01-01g | 01 | 1 | LIB-03 | grep | `grep "requirements-completed: \[LIB-01, LIB-03\]" .planning/phases/39-library-build-pipeline/39-02-SUMMARY.md` | yes | green |
| 42-01-02 | 01 | 1 | LIB-03 (peerDep) | node JSON | `node -e "const p=require('./package.json'); if(p.dependencies?.next) { process.exit(1); } if(!p.peerDependencies?.next) { process.exit(1); } if(!p.peerDependenciesMeta?.next?.optional) { process.exit(1); } console.log('PASS');"` | yes | green |

*Status: pending · green · red · flaky*

---

## Wave 0 Requirements

*None — all targets pre-existed; phase only modified frontmatter and package.json metadata.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| `npm publish --dry-run` exits 0 with 18 dist/ files | LIB-03 (AC-8) | Requires registry credential context + `prepublishOnly` hook chain (`build:lib` + `verify-tree-shake` + `verify-bundle-size`) — too heavyweight for sampling loop | Run `pnpm publish --dry-run` from repo root; expect exit 0 and ≥18 files staged. SUMMARY records this was green at commit `7a1fd1f` (2026-04-11). |
| Consumer install does not duplicate `next` | LIB-03 | Requires consumer-project simulation outside the SF repo | In a separate Next.js 15.3+ project, run `pnpm add signalframeux@<version>` and confirm no `next` is added to the consumer's `node_modules/signalframeux/node_modules/`. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or are explicitly Manual-Only
- [x] Sampling continuity: no 3 consecutive tasks without automated verify (single-plan phase, both tasks automated)
- [x] Wave 0 covers all MISSING references (none — pre-existing files)
- [x] No watch-mode flags
- [x] Feedback latency < 20s (~1s)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-29 (reconstructed) — metadata-only phase; grep + node JSON shape are the appropriate verify primitives. `npm publish --dry-run` (AC-8) and consumer-install non-duplication kept Manual-Only per project convention (heavyweight publish hook chain not suitable for sampling loop). Original task verifies from 42-01-PLAN.md confirmed green at archive time (commits `3fdcf61`, `7a1fd1f`).
