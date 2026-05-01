---
phase: 72
slug: sfcombobox
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-01
---

# Phase 72 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright + axe-core (E2E + a11y) · vitest (unit, where applicable) · @next/bundle-analyzer (bundle) |
| **Config file** | `playwright.config.ts` · `vitest.config.ts` · `next.config.ts` (ANALYZE env) |
| **Quick run command** | `pnpm exec playwright test tests/v1.10-phase72-sf-combobox*.spec.ts --reporter=line` |
| **Full suite command** | `pnpm test:e2e && pnpm test:axe && rm -rf .next/cache .next && ANALYZE=true pnpm build` |
| **Estimated runtime** | ~12s Playwright + axe; ~120s incl. clean build |

---

## Sampling Rate

- **After every task commit:** Run `pnpm exec playwright test tests/v1.10-phase72-sf-combobox*.spec.ts --grep "{tag for that task}"`
- **After every plan wave:** Run `pnpm test:e2e && pnpm test:axe`
- **Before `/pde:verify-work`:** Full suite green + bundle evidence captured (cmdk MUST NOT appear in homepage First Load chunk; SFCombobox is barrel-exported so verify dynamic-only entry on consumer pages)
- **Max feedback latency:** 30 seconds (per-task quick run)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 72-XX-XX | XX | X | CB-XX | — | {to be filled by planner} | playwright+axe / grep / shell | `{command}` | ⬜ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

> **Note:** Per-task rows populated by planner (PLAN.md generation). Each task MUST have either an `<automated>` block or a Wave-0 dependency reference.

---

## Wave 0 Requirements

- [ ] `tests/v1.10-phase72-sf-combobox.spec.ts` — Playwright spec stubs for CB-01..04 acceptance scenarios (single-select filter/keyboard/Escape, clear affordance, grouped options, multi-select chips API)
- [ ] `tests/v1.10-phase72-sf-combobox-axe.spec.ts` — axe-core spec for open-state listbox role + activedescendant + aria-multiselectable (TST-03 acceptance)
- [ ] `app/dev-playground/sf-combobox/page.tsx` — fixture page mounting all combobox modes (single, single+grouped, multi, controlled-out-of-range, empty filter)
- [ ] No new framework installs — Playwright + axe + vitest already present

*Wave-0 stubs MUST exist as failing tests before Plan 02 task work begins (TDD-light gate).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Visual chip-stack overflow at narrow viewports (multi-select with 6+ selections) | CB-03 | Layout perception; pixel-diff thresholds noisy below 320px | Open `/dev-playground/sf-combobox` → multi mode → select 8 options → resize Chrome window 320 → 480 → 640 → confirm chips wrap, no horizontal scroll, trigger remains keyboard-targetable |
| FRAME/SIGNAL register: combobox aesthetics align with DU/TDR — sharp corners (0 radius), blessed spacing, typography slot, no decorative shadow | CB-01..04 (cross-cutting) | Aesthetic register is human-judged | Side-by-side compare with SFInput + SFButton + SFBadge in same playground; confirm visual consistency with shipped v1.9 register |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
