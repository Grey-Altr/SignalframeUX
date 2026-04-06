---
phase: 11
slug: registry-completion
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | shadcn CLI + TypeScript compiler |
| **Config file** | `registry.json`, `tsconfig.json` |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm tsc --noEmit && pnpm registry:build` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm tsc --noEmit`
- **After every plan wave:** Run `pnpm tsc --noEmit && pnpm registry:build`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 1 | DX-04 | schema | `node -e "JSON.parse(require('fs').readFileSync('registry.json'))"` | ✅ | ⬜ pending |
| 11-01-02 | 01 | 1 | DX-04 | cli | `pnpm registry:build` | ✅ | ⬜ pending |
| 11-01-03 | 01 | 1 | DX-04 | file count | `ls public/r/*.json \| wc -l` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test files need to be created.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| shadcn add resolves components | DX-04 | CLI interactive | Run `pnpm shadcn add sf-button` in a fresh dir, verify file installed |
| sf-theme installs tokens only | DX-04 | CSS output check | Run `pnpm shadcn add sf-theme`, verify no component files |
| meta fields present | DX-04 | Schema structure | Inspect `public/r/sf-button.json` for meta.layer and meta.pattern |

---

## Phase Gate

- [ ] `registry.json` valid JSON with all 34 items
- [ ] `pnpm registry:build` succeeds
- [ ] `public/r/*.json` files exist for every component
- [ ] Each item has `meta.layer` and `meta.pattern`
- [ ] `sf-theme` item has `cssVars` and no `files`
