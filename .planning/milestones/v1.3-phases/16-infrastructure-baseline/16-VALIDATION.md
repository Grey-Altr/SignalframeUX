---
phase: 16
slug: infrastructure-baseline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 16 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + TypeScript compiler |
| **Config file** | next.config.ts, tsconfig.json |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm tsc --noEmit`
- **After every plan wave:** Run `pnpm build`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 16-01-01 | 01 | 1 | INFRA-01 | file check | `test -f SCAFFOLDING.md && grep "SF Wrapper Creation Checklist" SCAFFOLDING.md` | ❌ W0 | ⬜ pending |
| 16-01-02 | 01 | 1 | INFRA-04 | file check | `grep "intent" SCAFFOLDING.md && grep "asChild" SCAFFOLDING.md` | ❌ W0 | ⬜ pending |
| 16-02-01 | 02 | 1 | INFRA-02 | build | `pnpm build && pnpm tsc --noEmit` | ✅ | ⬜ pending |
| 16-02-02 | 02 | 1 | INFRA-02 | lighthouse | `npx lighthouse http://localhost:3000 --output=json` | ✅ | ⬜ pending |
| 16-03-01 | 03 | 2 | INFRA-03 | visual | `grep "Forms\|Feedback\|Navigation\|Data Display\|Layout\|Generative" components/blocks/components-explorer.tsx` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `SCAFFOLDING.md` — new file for INFRA-01 wrapper checklist
- [ ] shadcn bases installed for P1/P2 — accordion, alert, alert-dialog, avatar, breadcrumb, collapsible, progress

*Existing build infrastructure covers compilation and bundle analysis.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ComponentsExplorer visual grouping | INFRA-03 | Layout/UX requires visual inspection | Open /components, verify six category groups render correctly |
| Lighthouse baseline recording | INFRA-02 | Requires running dev server | Run `pnpm dev`, capture Lighthouse scores |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
