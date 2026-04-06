---
phase: 4
slug: above-the-fold-lock
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-05
---

# Phase 4 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep + browser visual verification |
| **Quick run command** | `npx tsc --noEmit 2>&1 | head -20` |
| **Full suite command** | `npx tsc --noEmit && grep -rn "data-anim" app/error.tsx app/not-found.tsx` |
| **Estimated runtime** | ~10 seconds |

## Per-Task Verification Map

| Task ID | Requirement | Test Type | Automated Command | Status |
|---------|-------------|-----------|-------------------|--------|
| 04-01 | ATF-01, ATF-02 | grep+browser | `grep "delay" components/blocks/hero.tsx components/layout/page-animations.tsx` | ⬜ |
| 04-02 | ATF-03 | grep | `grep -rn "340\|components and growing" components/blocks/` | ⬜ |
| 04-03 | ATF-04 | grep | `grep "ScrambleText\|data-anim" app/error.tsx app/not-found.tsx` | ⬜ |
| 04-04 | ATF-05 | grep | `grep "empty\|no results\|no components" components/blocks/components-explorer.tsx` | ⬜ |
| 04-05 | ATF-06 | grep | `grep "prefers-reduced-motion" app/globals.css` | ⬜ |

## Manual-Only Verifications

| Behavior | Requirement | Why Manual |
|----------|-------------|------------|
| Hero at 1440x900 as jury moment | ATF-01 | Visual evaluation |
| Hero motion within 500ms | ATF-02 | Timing measurement in browser |
| Error page FRAME+SIGNAL feel | ATF-04 | Visual evaluation |
| Reduced-motion as intentional design | ATF-06 | Browser with prefers-reduced-motion |

**Approval:** pending
