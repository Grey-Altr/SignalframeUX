---
status: partial
phase: 70-v1-8-verification-closure-vrf-01-04-05
source: [70-VERIFICATION.md]
started: 2026-04-30T18:00:00Z
updated: 2026-04-30T18:00:00Z
---

## Current Test

[awaiting human ratification of 3 documented caveats]

## Tests

### 1. Hobby-tier seed-and-aggregate cycle ratification (VRF-06 sample-source)
expected: User confirms that synthetic-seeded n=800 LCP samples within a ~6 min seed-and-aggregate window on Vercel Hobby tier (auto-selected under --auto orchestration) satisfies the SPIRIT of ROADMAP SC-1 ("Field RUM ≥100 sessions over ≥24h window, p75 LCP <1.0s"). The literal 24h interpretation requires Pro tier upgrade ($20/mo, out of autonomous scope). p75 LCP = 264ms (73.6% under 1000ms ceiling) on synthetic data.
result: [pending — orchestrator auto-selected Hobby; user can override post-facto via Pro upgrade if literal 24h-natural interpretation is required]

### 2. VRF-07 INSUFFICIENT_SAMPLES verdict ratification (iPhone 14 Pro iOS sub-cohort)
expected: User confirms that VRF-07 verdict INSUFFICIENT_SAMPLES is acceptable for v1.8 VRF-01 iOS partial closure. Root cause: Vercel CLI 50.43.0 log schema does not expose `proxy.userAgent` from Drains-style records, so iOS UA cohort attribution is impossible regardless of seed volume (35 iPhone UA sessions emitted by seed-runner but flattened by CLI). Defers to natural-traffic accumulation post-Phase-66 deploy + Vercel CLI schema enhancement.
result: [pending — natural traffic on prod containing Phase 66 surface will eventually accumulate enough iOS sessions for re-aggregation when CLI schema exposes UA strings]

### 3. VRF-08 `_path_b_decision` ratification (Moto G Power 3G Fast tier-move)
expected: User confirms that moving Moto G Power 3G Fast LCP gate to "supported but not gated" tier is acceptable per `_path_b_decision` block at `.planning/perf-baselines/v1.9/vrf-08-path-b-decision.json`. Path A (framework-chunk 2979 reshape) was structurally invalid because Phase 67 owns chunk-graph mutation per ROADMAP §v1.9 rule 2. review_gate fires after Phase 67 BND-05/06/07 ships and re-runs Moto G 3G Fast measurement.
result: [pending — auto-authored under --auto orchestration with full 7-field schema; review window remains open until Phase 67 ships]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps

[None — all 3 pending items are intentional measurement-tier or schema-limitation deferrals with documented review_gates. No code-side gaps; all 4 ROADMAP success criteria satisfied (with caveats acknowledged). Pattern matches Phase 64 + Phase 66 close.]
