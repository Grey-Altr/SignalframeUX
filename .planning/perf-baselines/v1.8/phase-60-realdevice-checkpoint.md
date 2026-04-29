---
phase: 60-lcp-element-repositioning
task: 60-02-06
gate: D-07 (in-phase real-device sanity check, Pitfall #10 anchor)
type: human-action
status: pending
created: 2026-04-26
device: iPhone 13 Safari, Verizon LTE profile
runs: 5 (median-of-5)
threshold: real-device LCP <1500ms (lenient vs synthetic <1000ms — accommodates real-network noise)
escalates_to: Phase 62 VRF-04 (full multi-device matrix; strict <1000ms gate)
---

# Phase 60 D-07 Real-Device Checkpoint

> Single representative WebPageTest run on iPhone 13 Safari, Verizon LTE profile, 5 runs median, against the post-Phase-60 prod URL. Catches obvious real-device regressions before Phase 62 VRF-04's full matrix.

**Status:** ⬜ pending — awaiting human execution

## How to run

1. Open https://www.webpagetest.org/
2. Configure:
   - **Test URL:** prod homepage (https://signalframeux.vercel.app/ or current prod URL)
   - **Device:** iPhone 13 (Safari)
   - **Connection:** Verizon LTE (or 4G representative profile)
   - **Number of Tests to Run:** 5
   - **Repeat View:** First View only (cold-start variance is what we measure)
3. Submit. Wait ~5–10 min for the public-tier queue + run.
4. Read the median run's Web Vitals: LCP, CLS, FCP, TBT, TTI.

## Result (fill in after run)

| Metric | Median (5 runs) | Threshold | Status |
|--------|-----------------|-----------|--------|
| LCP    |          ms     | <1500ms (lenient — Phase 62 strict <1000ms)  | ⬜      |
| CLS    |                 | ≤0.005 (Phase 60 Path A acceptance — loosened from ≤0) | ⬜ |
| FCP    |          ms     | informational | ⬜      |
| TBT    |          ms     | informational | ⬜      |
| TTI    |          ms     | informational | ⬜      |

**WebPageTest run URL:** _(paste link from webpagetest.org)_

**All 5 individual LCP runs:** _(paste comma-separated)_

## Sign-off

**Decision:**
- [ ] **PASS** — real-device LCP <1500ms; CLS ≤0.005; no other red flags. Phase 60 cleared for Phase 61 to start.
- [ ] **FAIL** — real-device LCP ≥1500ms OR CLS materially worse than synthetic 0.002505. Triggers escalation to Phase 62 VRF-04 cleanup OR a Phase 59 retrofit (re-measure Anton swap descriptors at GhostLabel size band).

**Notes:** _(any observations, e.g., does the page feel slow / laggy in real-network conditions; any Anton font-swap visible flash; does the GhostLabel paint look identical to localhost emulation)_

**Signed-off-by:** _(your name)_
**Date:** _(YYYY-MM-DD)_

---

## What this checkpoint protects

- **Pitfall #10** anchor — discovering real-device blocker after all v1.8 phases ship is a refactor crisis.
- **SwiftShader headless WebGL caveat** (`playwright.config.ts:22-27`) — synthetic LHCI uses SwiftShader for WebGL contexts; real iOS Safari uses Metal. Performance differences can be material.
- **Network simulation accuracy** — LHCI's `simulate` throttling is a reasonable approximation but not real-network. Verizon LTE has different jitter, latency variance, and congestion patterns.
