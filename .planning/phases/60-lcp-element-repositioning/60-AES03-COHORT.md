---
phase: 60-lcp-element-repositioning
task: 60-02-07
gate: D-08 (AES-03 mid-milestone cohort review, fresh-eyes pass)
type: human-action
status: pending
created: 2026-04-26
mechanism: chrome-devtools MCP scroll-test
viewports: 4 (mobile-360, iphone13-390, ipad-834, desktop-1440)
pages: 5 (/, /system, /init, /inventory, /reference)
total_surface: 20 image surfaces
baseline_dir: .planning/visual-baselines/v1.8-start/
escalation_trigger: "feels different without specific code-change cause"
---

# Phase 60 D-08 AES-03 Cohort Review

> Solo cohort review via chrome-devtools MCP scroll-test against post-Phase-60 prod URL, side-by-side with `.planning/visual-baselines/v1.8-start/` baselines. "External eye" = fresh-eyes pass after time delay (next morning before unblocking Phase 61).

**Status:** ⬜ pending — awaiting human execution

## How to run

**Timing:** Do this the morning AFTER Phase 60 ships, not same-day. The whole point of "fresh eyes" is the time gap.

1. **Visit prod URL** in chrome-devtools MCP-driven browser (or chrome-devtools panel directly).
2. **For each of 4 viewports** (mobile-360x800, iphone13-390x844, ipad-834x1194, desktop-1440x900), and **each of 5 pages** (`/`, `/system`, `/init`, `/inventory`, `/reference`):
   - Set viewport
   - Scroll-test full page top → bottom slowly
   - Watch for: motion contract intact (single GSAP ticker, all SIGNAL effects render, reduced-motion still kills timeline), trademarks visible (T1 pixel-sort, T2 navbar glyph, T3 cube-tile, T4 `//` separator), no `feels different` moment
   - Cross-reference against `.planning/visual-baselines/v1.8-start/{viewport}/{page}.png`
3. **Note any visible difference** that is NOT explained by Phase 60's documented intervention (`content-visibility: auto` + `containIntrinsicSize` on GhostLabel — should be a NO-OP visually; pixel-diff already PASS at <0.5%).

## Sign-off table

| Viewport | Page | Trademarks visible (T1/T2/T3/T4) | Motion contract intact | "Feels different" without cause? | Status |
|----------|------|----------------------------------|------------------------|----------------------------------|--------|
| mobile-360x800 | / | ⬜ | ⬜ | ⬜ | ⬜ |
| mobile-360x800 | /system | ⬜ | ⬜ | ⬜ | ⬜ |
| mobile-360x800 | /init | ⬜ | ⬜ | ⬜ | ⬜ |
| mobile-360x800 | /inventory | ⬜ | ⬜ | ⬜ | ⬜ |
| mobile-360x800 | /reference | ⬜ | ⬜ | ⬜ | ⬜ |
| iphone13-390x844 | / | ⬜ | ⬜ | ⬜ | ⬜ |
| iphone13-390x844 | /system | ⬜ | ⬜ | ⬜ | ⬜ |
| iphone13-390x844 | /init | ⬜ | ⬜ | ⬜ | ⬜ |
| iphone13-390x844 | /inventory | ⬜ | ⬜ | ⬜ | ⬜ |
| iphone13-390x844 | /reference | ⬜ | ⬜ | ⬜ | ⬜ |
| ipad-834x1194 | / | ⬜ | ⬜ | ⬜ | ⬜ |
| ipad-834x1194 | /system | ⬜ | ⬜ | ⬜ | ⬜ |
| ipad-834x1194 | /init | ⬜ | ⬜ | ⬜ | ⬜ |
| ipad-834x1194 | /inventory | ⬜ | ⬜ | ⬜ | ⬜ |
| ipad-834x1194 | /reference | ⬜ | ⬜ | ⬜ | ⬜ |
| desktop-1440x900 | / | ⬜ | ⬜ | ⬜ | ⬜ |
| desktop-1440x900 | /system | ⬜ | ⬜ | ⬜ | ⬜ |
| desktop-1440x900 | /init | ⬜ | ⬜ | ⬜ | ⬜ |
| desktop-1440x900 | /inventory | ⬜ | ⬜ | ⬜ | ⬜ |
| desktop-1440x900 | /reference | ⬜ | ⬜ | ⬜ | ⬜ |

## Sign-off

**Decision:**
- [ ] **PASS — no escalation** — All 20 combos look identical to baselines + trademarks visible + motion contract intact. Phase 60 closes APPROVED. Phase 61 unblocked.
- [ ] **FAIL — escalation** — Some combo "feels different" without specific code-change cause. Document below; triggers Phase 62 VRF-04 deep-dive OR a Phase 60.1 polish phase.

**Specific findings (if any):**

_(For each issue: viewport, page, what feels different, suspected cause, severity)_

**Signed-off-by:** _(your name)_
**Date:** _(YYYY-MM-DD)_

---

## Path A acknowledgement

This cohort review intentionally does NOT use the AES-04 pixel-diff harness — that already ran in Wave 1 with PASS (max 0.361% across 20 combos). D-08 is a perception-level gate, not a pixel-level gate. The 0.002505 CLS regression accepted under Path A may not be visible at all in the captured-state baseline (which is reduced-motion + warm-Anton frozen pre-reveal at opacity 0.01). Look for:

- Motion judder or skipped frames during scroll on the THESIS section (where GhostLabel lives)
- Anton font-swap visible flash on initial paint (Phase 59 should have eliminated this; report regression if present)
- GhostLabel "//" character (or "THESIS" text) visibly jumping on viewport entry — this is the audit-attributed shift; it may or may not be perceptible

If any of these are noticeable, mark FAIL with notes; Phase 62 VRF-04 will need to revisit the Path A threshold loosening.
