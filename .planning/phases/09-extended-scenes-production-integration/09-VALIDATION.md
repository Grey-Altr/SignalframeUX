---
phase: 9
slug: extended-scenes-production-integration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — visual/layout verification + Lighthouse |
| **Config file** | none |
| **Quick run command** | `pnpm build 2>&1 \| tail -5` |
| **Full suite command** | `pnpm build && pnpm start` + Lighthouse |
| **Estimated runtime** | ~30 seconds build + manual checks |

---

## Sampling Rate

- **After every task commit:** `pnpm build` — confirms zero SSR/type errors
- **After every plan wave:** `pnpm build` + manual visual walkthrough
- **Before `/pde:verify-work`:** Full build + Lighthouse 100/100 + visual QA on all 5 pages
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 09-01-01 | 01 | 1 | SCN-03, SCN-04 | manual | Verify dither + GLSL in hero | ⬜ pending |
| 09-02-01 | 02 | 1 | INT-01 | automated | `pnpm build` + grep for raw divs | ⬜ pending |
| 09-02-02 | 02 | 1 | INT-02 | manual | Scroll into component grid, verify stagger | ⬜ pending |
| 09-03-01 | 03 | 2 | INT-03, INT-04 | manual | Verify scroll motion + overlay | ⬜ pending |

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Ordered Bayer dither visible in hero | SCN-03 | Visual WebGL rendering | Open homepage, verify dither pattern in hero |
| GLSL hero responds to scroll | SCN-04 | Requires scroll interaction | Scroll hero section, verify noise/grid changes |
| GLSL hero responds to --color-primary | SCN-04 | Requires theme cycle | Toggle color cycle, verify shader color updates |
| SF primitives on all 5 pages | INT-01 | Layout visual comparison | Compare all pages before/after for visual parity |
| Stagger animation on scroll | INT-02 | Requires scroll into view | Scroll to component grid, verify stagger fires once |
| Lighthouse 100/100 | Quality | Requires Lighthouse audit | Run Lighthouse on all pages |

---

## Validation Sign-Off

- [ ] All tasks have verify steps
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
