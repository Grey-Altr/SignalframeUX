---
status: partial
phase: 61-bundle-hygiene
source: [61-VERIFICATION.md]
started: 2026-04-26T21:10:00Z
updated: 2026-04-26T21:10:00Z
---

## Current Test

[awaiting human decision on Phase 62 escalation paths]

## Tests

### 1. Phase 62 escalation path for BND-01 closure
expected: Choose one of three closure paths — (1) splitChunks retuning to pull 1 KB module off shared floor; (2) ROADMAP target recalibration via fresh Lighthouse audit (119 KiB budget may have included three.js-route-specific bytes optimizePackageImports cannot reduce); (3) acceptance of 103 KB as practical floor (Next.js 15 framework runtime 45.8 + react-dom 54.2 + other shared 2.56 = 103 KB, ROADMAP edit required)
result: [pending]
why_human: Strategic ROADMAP-amendment decision. Plan 03 explicitly defers — orchestrator-owned STATE.md/ROADMAP.md updates; no autonomous closure permitted.

### 2. AES-04 calibration path
expected: Choose one of two calibration paths — (1) re-capture baselines from pre-Phase-61 commit using tests/v1.8-baseline-capture.spec.ts and re-run; if 20/20 still FAIL strict 0%, harness non-determinism confirmed → relax to AES-04 standing 0.5% rule (which would 20/20 PASS per current data); (2) if 20/20 PASS strict 0% against fresh baselines, diffs ARE bundle-induced and bisect is justified (sonner+react-day-picker → cmdk+vaul → input-otp → radix-ui)
result: [pending]
why_human: Calibration question requires baseline re-capture from a different commit, plus root-cause attribution between bundle regression vs renderer/font-load timing non-determinism. Plan 03 honestly reports the strict 0% FAIL but cannot resolve attribution within Phase 61 scope.

### 3. Phase 59 spec MAX_DIFF_RATIO discrepancy ratification
expected: Acknowledge the discovery — Phase 59 row B claimed "20/20 PASS at 0%" but spec source uses MAX_DIFF_RATIO = 0.005. Strict 0% gate has never been validated in this harness on any prior plan. Decide whether this is a documentation error (claim should have been "20/20 PASS at 0.5%") or whether the strict 0% claim was a separate verification that was never recorded.
result: [pending]
why_human: Historical truth-claim audit. Cannot be resolved programmatically without re-running prior plans' spec under strict-0% gate which is itself the calibration question.

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps

- BND-01 primary (Shared by all ≤102 KB): 103 KB observed, 1 KB over target. status: failed. Plan 03 §3.
- BND-01 secondary (≥80% reduction% of 119 KiB unused JS): 0.41% / 42.10% under both attribution scenarios. status: failed. Plan 03 §3.
- AES-04 strict 0%: 20/20 FAIL at MAX_DIFF_RATIO=0; max diff 0.343%, all under AES-04 standing 0.5% rule. status: failed (gate-strictness question). Plan 03 §4.
