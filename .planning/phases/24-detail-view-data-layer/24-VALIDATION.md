---
phase: 24
slug: detail-view-data-layer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 24 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (if configured) / manual verification via tsc + grep |
| **Config file** | tsconfig.json (type checking) |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm tsc --noEmit && node -e "require('./lib/api-docs.ts')" 2>/dev/null || echo "use tsx check"` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm tsc --noEmit`
- **After every plan wave:** Run `pnpm tsc --noEmit` + grep verification of entry counts
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 24-01-01 | 01 | 1 | DV-03 | unit | `pnpm tsc --noEmit && grep "server-only" lib/code-highlight.ts` | ❌ W0 | ⬜ pending |
| 24-01-02 | 01 | 1 | DV-01 | unit | `pnpm tsc --noEmit && grep "ComponentRegistryEntry" lib/component-registry.ts` | ❌ W0 | ⬜ pending |
| 24-02-01 | 02 | 1 | DV-02 | grep | `grep -c '"id":' lib/api-docs.ts` (expect >= 49) | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm add shiki server-only` — shiki/core and server-only guard not yet in package.json
- [ ] `lib/code-highlight.ts` — new file, created in Plan 01
- [ ] `lib/component-registry.ts` — new file, created in Plan 01

*Existing infrastructure covers type checking (tsc) and build (next build).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Shiki HTML output renders correct syntax colors | DV-03 | Visual verification of OKLCH theme colors | Render a code snippet via code-highlight.ts, inspect HTML output for correct token classes |
| Variant preview props produce correct live renders | DV-01 | Requires Phase 25 ComponentDetail panel | Verify props objects match SF component APIs by reading source types |

*Visual rendering fully verified in Phase 25 when detail panel consumes this data.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
