---
phase: 10
slug: foundation-fixes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript compiler (tsc) |
| **Config file** | `tsconfig.json` |
| **Quick run command** | `pnpm tsc --noEmit` |
| **Full suite command** | `pnpm tsc --noEmit && pnpm build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm tsc --noEmit`
- **After every plan wave:** Run `pnpm tsc --noEmit && pnpm build`
- **Before `/pde:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | FND-01 | manual | `grep "signal-intensity\|signal-speed\|signal-accent" app/globals.css` | ✅ | ⬜ pending |
| 10-01-02 | 01 | 1 | FND-02 | compile | `pnpm tsc --noEmit` | ✅ | ⬜ pending |
| 10-01-03 | 01 | 1 | INT-01 | manual | `grep "mt-\[var(--nav-height)\]" app/reference/page.tsx` | ✅ | ⬜ pending |
| 10-01-04 | 01 | 1 | INT-01 | manual | `grep "SFSection" app/start/page.tsx` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test files need to be created.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| No magenta flash on first load | FND-01 | Visual rendering check | Load `/start` page, verify SignalOverlay colors render correctly without flash |
| Reference page nav clearance | INT-01 | Layout spacing check | Load `/reference` page, verify content starts below nav |
| NEXT_CARDS grid in SFSection | INT-01 | Semantic structure check | Inspect DOM on `/start` page, verify NEXT_CARDS div has SFSection parent with data-section attribute |

---

## Phase Gate

- [ ] `pnpm tsc --noEmit` — zero errors
- [ ] `pnpm build` — clean build
- [ ] Visual check: `/start` page (SignalOverlay defaults, NEXT_CARDS section)
- [ ] Visual check: `/reference` page (nav clearance)
