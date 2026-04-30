# Phase 70 — Capture Log

> Audit trail for VRF-06/07 capture cycle. Pairs with .planning/perf-baselines/v1.9/rum-p75-lcp.json.

## Tier Decision (Plan 02 Task 1)

Decided: 2026-04-30T17:11:05Z
Path: path-a-hobby
Rationale: orchestrator auto-selected under --auto (default per plan); user did not request Pro upgrade. Hobby seed-and-aggregate-within-1h cycle exercises the v1.9 RUM pipeline at zero cost. Sample-source label will reflect synthetic-seeded reality (105 Playwright Chromium sessions across iPhone 14 Pro UA / Pixel 7 UA / desktop Chrome UA).
auto_resolution: true
auto_resolution_note: "Task 1 is checkpoint:decision; under orchestrator --auto, first option is auto-selected. User retains override window via revert + re-execute."

## Auth + Prod URL (Plan 02 Task 2)

vercel_whoami: grey-altr
vercel_team_scope: grey-altrs-projects (team_uY4PqYooW9d80d9fTlGHAMB3)
vercel_project: grey-altrs-projects/signalframeux (prj_gwmf7fNhZiJqQ7AYL606u3xWsMGJ)
vercel_cli_version: 50.43.0
prod_url: https://signalframeux.vercel.app
latest_prod_deployment: https://signalframeux-odvg9c5wt-grey-altrs-projects.vercel.app (19h old; alias https://signalframeux.vercel.app resolves here)
smoke_test_status: 200
smoke_test_response_body: {"ok":true}
smoke_test_timestamp: 2026-04-30T17:12:01Z
smoke_test_method: POST /api/vitals
worktree_link_note: ".vercel/{project.json,README.txt} replicated from parent repo (worktree was unlinked); CLI now resolves project context correctly."

## Window Anchor (Plan 02 Task 3)

window_start: 2026-04-30T17:12:36Z
retention_window_minutes: 60 (Hobby tier — Path A)
expiry_estimate: 2026-04-30T18:12:36Z
note: "Aggregator (Task 5) MUST run before expiry_estimate. Seeder (Task 4) targets ~3min wall-clock; total cycle (seed + 30s settle + aggregate) projected to complete at ~T+5-6min, leaving ~54min slack before retention rolls."

## Synthetic Seed (Plan 02 Task 4)

executed: true
seeder_started_at: 2026-04-30T17:13:00.856Z
seeder_finished_at: 2026-04-30T17:18:18.917Z
seeder_wall_clock_seconds: 318
expected_sessions: 105
successful_sessions: 105
failed_sessions: 0
estimated_beacons: 525
viewports_covered: [mobile-iphone13, mobile-android, desktop-chrome]
routes_covered: [/, /system, /init, /inventory, /reference]
visits_per_route: 7
settle_seconds_after: 30
seed_log_path: .planning/perf-baselines/v1.8/vrf-05-rum-seed-log.json
ios_cohort_seeded_count: 35 (7 visits × 5 routes × 1 mobile-iphone13 viewport — Mobile/15E148 build family)
