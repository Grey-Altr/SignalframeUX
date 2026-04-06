---
phase: 3
slug: signal-expression
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-05
audited: 2026-04-05
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | grep audits + TypeScript compiler |
| **Config file** | none |
| **Quick run command** | `grep -n "[data-anim] {" app/globals.css && grep "duration: 0.034" components/layout/page-animations.tsx` |
| **Full suite command** | `npx tsc --noEmit && grep -c "ScrollTrigger.create" components/layout/page-animations.tsx && grep -c "sf-.*:hover" app/globals.css` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run relevant grep for modified signal behavior
- **After every plan wave:** Run full tsc + grep suite
- **Before `/pde:verify-work`:** Full suite + manual browser checks
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 03-01 | 03 | 2 | SIG-01 | grep | `grep -c "ScrollTrigger.create" components/layout/page-animations.tsx` — returns ≥ 7 | green |
| 03-02 | 01 | 1 | SIG-02 | grep | `grep -c "sf-.*:hover" app/globals.css` — returns ≥ 4 (one per interaction class) | green |
| 03-03 | 01 | 1 | SIG-03 | grep | `grep "duration: 0.034" components/layout/page-animations.tsx && grep 'ease: "none"' components/layout/page-animations.tsx` | green |
| 03-04 | 03 | 2 | SIG-04 | grep | `grep "ScrollTrigger.batch" components/layout/page-animations.tsx && grep "stagger: 0.04" components/layout/page-animations.tsx` | green |
| 03-05 | 01 | 1 | SIG-05 | grep | `grep -n "\[data-anim\] {" app/globals.css` — returns line with catch-all rule | green |
| 03-06 | 02 | 1 | SIG-09 | grep | `grep -c "CanvasCursor\|IntersectionObserver\|pointer.*coarse" components/animation/canvas-cursor.tsx` — returns ≥ 3 | green |
| 03-07 | 04 | 2 | SIG-10 | grep | `grep -c "DEFERRED" .planning/phases/03-signal-expression/SIGNAL-SPEC.md && grep -c "Collapse\|Persist" .planning/phases/03-signal-expression/SIGNAL-SPEC.md` — returns 3 and ≥ 8 | green |

---

## Audit Notes (2026-04-05)

Three commands in the original draft VALIDATION.md were broken and returned no output:

| Task | Original Command | Failure Reason | Corrected Command |
|------|-----------------|----------------|-------------------|
| 03-02 | `grep "duration-fast\|duration-slow" app/globals.css \| grep -c hover` | Timing token lines and `:hover` selector lines are on separate lines — pipe grep returns 0 | `grep -c "sf-.*:hover" app/globals.css` |
| 03-03 | `grep "duration-instant" components/layout/page-animations.tsx` | Implementation uses `0.034` literal, not the token name string | `grep "duration: 0.034" ... && grep 'ease: "none"' ...` |
| 03-05 | `grep "data-anim.*opacity" app/globals.css` | Catch-all rule is `[data-anim] { opacity: 1 }` — attribute selector and property are on separate lines | `grep -n "\[data-anim\] {" app/globals.css` |

All implementation artifacts confirmed present. No implementation changes made during audit.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| ScrambleText visual on scroll entry | SIG-01 | Requires browser scroll interaction | Scroll a `[data-anim="page-heading"]` into view, verify binary/punctuation scramble resolves to original text, does not re-trigger on scroll back |
| Asymmetric hover timing feel | SIG-02 | Requires hover interaction | Hover `.sf-pressable` / `.sf-hoverable` / `.sf-invert-hover` elements — verify snap-in at 100ms, slow release at 400ms |
| Hard-cut section transitions | SIG-03 | Requires scroll observation | Scroll `[data-anim="section-reveal"]` into view — verify perceptually instant opacity snap, no visible fade or easing |
| Stagger grid cascade | SIG-04 | Requires scroll observation | Scroll a `[data-anim="stagger"]` grid into view — verify 40ms wave cascade across children |
| Canvas cursor crosshair + trail | SIG-09 | Requires mouse movement in browser | Move mouse over `[data-cursor]` section on desktop — verify magenta crosshair and fading particle trail; clears outside section |
| Mobile signal collapse | SIG-10 | Requires touch device or coarse pointer emulation | Open on touch device or set pointer:coarse in DevTools — verify no canvas element rendered, VHS overlay hidden, system cursor visible |

---

## Validation Sign-Off

- [x] All tasks have accurate automated command
- [x] All automated commands produce non-empty output when implementation is correct
- [x] Sampling continuity maintained
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** green — all 7 tasks verified 2026-04-05
