---
phase: 4
slug: above-the-fold-lock
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-05
audited: 2026-04-05
---

# Phase 4 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Shell script (grep-based behavioral checks) |
| **Test file** | `.planning/phases/04-above-the-fold-lock/validate-phase-04.sh` |
| **Quick run command** | `bash .planning/phases/04-above-the-fold-lock/validate-phase-04.sh` |
| **Full suite command** | `bash .planning/phases/04-above-the-fold-lock/validate-phase-04.sh` |
| **Estimated runtime** | ~15 seconds (includes tsc --noEmit) |
| **Last run result** | 32/32 PASS — 2026-04-05 |

## Per-Task Verification Map

| Task ID | Requirement | Test Type | Automated Command | Status |
|---------|-------------|-----------|-------------------|--------|
| 04-01a | ATF-02 | smoke | `grep -qn "hero-mesh" components/layout/page-animations.tsx` | green |
| 04-01b | ATF-02 | smoke | `grep -qn "delay: 0" components/layout/page-animations.tsx` | green |
| 04-01c | ATF-02 | smoke | `grep -qn "delay: 0\.4" components/layout/page-animations.tsx` | green |
| 04-01d | ATF-01 | smoke | `grep -qn 'data-anim="hero-mesh"' components/blocks/hero.tsx` | green |
| 04-01e | ATF-01 | smoke | `grep -qn "opacity-0" components/blocks/hero.tsx` | green |
| 04-01f | ATF-02 | smoke | CLS check — no width/height/padding/margin in GSAP calls | green |
| 04-02a | ATF-03 | smoke | `grep -qn '"28"' components/blocks/stats-band.tsx` | green |
| 04-02b | ATF-03 | smoke | no "340" in stats-band.tsx | green |
| 04-02c | ATF-03 | smoke | `grep -q '28.*growing' app/page.tsx` | green |
| 04-02d | ATF-03 | smoke | `grep -qi "AND GROWING" components/blocks/hero.tsx` | green |
| 04-03a | ATF-04 | smoke | `grep -qn "SFContainer" app/error.tsx` | green |
| 04-03b | ATF-04 | smoke | `grep -qn "SFText" app/error.tsx` | green |
| 04-03c | ATF-04 | smoke | `grep -qn 'data-anim="error-code"' app/error.tsx` | green |
| 04-03d | ATF-04 | smoke | `grep -qn "sf-glitch" app/error.tsx` | green |
| 04-03e | ATF-04 | smoke | `grep -qn "prefers-reduced-motion" app/error.tsx` | green |
| 04-03f | ATF-04 | smoke | `grep -qn "SFContainer" app/not-found.tsx` | green |
| 04-03g | ATF-04 | smoke | `grep -qn "SFText" app/not-found.tsx` | green |
| 04-03h | ATF-04 | smoke | `grep -qn 'data-anim="page-heading"' app/not-found.tsx` | green |
| 04-03i | ATF-04 | smoke | not-found.tsx has no "use client" directive | green |
| 04-04a | ATF-05 | smoke | `grep -qn "filtered.length === 0" components/blocks/components-explorer.tsx` | green |
| 04-04b | ATF-05 | smoke | `grep -qi "RESET FILTERS" components/blocks/components-explorer.tsx` | green |
| 04-04c | ATF-05 | smoke | `grep -qn "SIGNAL WILL BE TRANSMITTED" components/blocks/api-explorer.tsx` | green |
| 04-04d | ATF-05 | smoke | `grep -qi "EXTENDED SCALES" components/blocks/token-tabs.tsx` | green |
| 04-04e | ATF-05 | smoke | `grep -qi "SHOW ALL" components/blocks/token-tabs.tsx` | green |
| 04-05a | ATF-06 | smoke | `grep -qn "prefers-reduced-motion" app/globals.css` | green |
| 04-05b | ATF-06 | smoke | `grep -qn 'data-anim="hero-mesh"' app/globals.css` | green |
| 04-05c | ATF-06 | smoke | `grep -qn 'data-anim="error-code"' app/globals.css` | green |
| 04-05d | ATF-06 | smoke | hero-mesh has opacity:0 initial state in globals.css | green |
| 04-05e | ATF-06 | smoke | error-code has opacity:0 initial state in globals.css | green |
| 04-05f | ATF-06 | smoke | `grep -qn "Reduced-Motion" SIGNAL-SPEC.md` | green |
| 04-05g | ATF-06 | smoke | SIGNAL-SPEC.md has >= 10 "Verified" entries | green |
| build  | ATF-01..06 | smoke | `npx tsc --noEmit` exits 0 | green |

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Status |
|----------|-------------|------------|--------|
| Hero at 1440x900 as jury moment | ATF-01 | Visual evaluation — aesthetic judgment | Approved (04-03 QA checkpoint) |
| Hero motion within 500ms from navigation start | ATF-02 | DevTools Performance trace required | Pending — code is correct (delay:0, duration:0.3); requires live browser trace |
| Error page FRAME+SIGNAL feel | ATF-04 | Visual evaluation | Approved (04-03 QA checkpoint) |
| Reduced-motion as intentional design | ATF-06 | Browser with prefers-reduced-motion emulation | Approved (04-03 Task 2 human-verify gate) |

**Approval:** 2026-04-05
