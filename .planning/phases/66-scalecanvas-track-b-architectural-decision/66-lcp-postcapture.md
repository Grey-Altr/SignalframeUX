# Phase 66 — Mobile LCP Candidate Post-ARC-04

Captured by tests/v1.9-phase66-lcp-stability.spec.ts (Task 6 BLOCKING gate).
Documents the post-pseudo-element LCP candidate identity for Plan 03 + future
phase-gate consumption. Reads LAST entry of largestPaints per
feedback_chrome_lcp_text_in_defs_quirk; honors entry.element=null path
per feedback_lcp_observer_content_visibility.

## Mobile (360×800)

```json
{
  "size": 11610,
  "startTime": 48,
  "hasElement": true,
  "selector": "span.sf-hero-deferred.inline-block",
  "bcr": {
    "width": 79.453125,
    "height": 149.296875,
    "top": 325.84375,
    "left": 282.234375
  }
}
```

## Desktop (1440×900)

```json
{
  "size": 55890,
  "startTime": 84,
  "hasElement": true,
  "selector": "span.relative.top-[0.08em].pr-[0.28em].tracking-[-0.12em].text-[1.28em]",
  "bcr": {
    "width": 187.962890625,
    "height": 214.998046875,
    "top": 361.599609375,
    "left": 1010.56640625
  }
}
```

Captured: 2026-04-30T04:11:41.686Z
