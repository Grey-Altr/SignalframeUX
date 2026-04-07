---
phase: 25
slug: interactive-detail-views-site-integration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 25 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual QA + `ANALYZE=true pnpm build` (no test framework installed) |
| **Config file** | next.config.ts (build analysis) |
| **Quick run command** | `pnpm build` |
| **Full suite command** | `ANALYZE=true pnpm build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm build`
- **After every plan wave:** Run `ANALYZE=true pnpm build`
- **Before `/pde:verify-work`:** Full suite must be green + bundle gate check
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 25-01-01 | 01 | 1 | DV-04, DV-10, DV-11 | build + manual | `pnpm build` | ❌ W0 | ⬜ pending |
| 25-01-02 | 01 | 1 | DV-05 | build + manual | `pnpm build` | ❌ W0 | ⬜ pending |
| 25-01-03 | 01 | 1 | DV-06 | build + manual | `pnpm build` | ❌ W0 | ⬜ pending |
| 25-01-04 | 01 | 1 | DV-07 | build + manual | `pnpm build` | ❌ W0 | ⬜ pending |
| 25-01-05 | 01 | 1 | DV-08, DV-09 | build + manual | `pnpm build` | ❌ W0 | ⬜ pending |
| 25-01-06 | 01 | 1 | DV-12 | build + bundle | `ANALYZE=true pnpm build` | ✅ | ⬜ pending |
| 25-02-01 | 02 | 2 | SI-01 | build + manual | `pnpm build` | ❌ W0 | ⬜ pending |
| 25-02-02 | 02 | 2 | SI-02 | build + manual | `pnpm build` | ❌ W0 | ⬜ pending |
| 25-02-03 | 02 | 2 | SI-03 | build + manual | `pnpm build` | ❌ W0 | ⬜ pending |
| 25-02-04 | 02 | 2 | SI-04 | build + manual | `pnpm build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework install needed — validation is build-success + bundle gate + manual QA.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GSAP height tween animation | DV-04 | Visual animation quality | Click card → observe smooth height expansion, no layout shift |
| Escape key closes panel + focus return | DV-10 | Keyboard interaction | Open panel → press Escape → verify panel closes + focus on trigger card |
| Live SF component variant rendering | DV-05 | Visual correctness | Open VARIANTS tab → verify all intent/size combos render correctly |
| Copy-to-clipboard functionality | DV-07 | Browser API | Click copy button → paste → verify snippet matches |
| DU/TDR aesthetic compliance | SI-03 | Visual design judgment | Inspect panel for sharp edges, uppercase labels, accent on active tab |
| Z-index layering | SI-04 | Visual stacking | Open panel → move cursor → verify cursor above panel, overlay above cursor |
| Homepage grid same behavior | SI-02 | Cross-page feature parity | Click homepage card → verify identical detail panel behavior |
| Session state persistence | SI-01 | Cross-navigation state | Open detail → navigate away → return → verify same component expanded |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
