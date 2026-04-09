---
phase: 35-performance-launch-gate
plan: 05
task: 3
task_of: 5
---

# Task 3: Task 3: Run final launch-gate.ts Lighthouse advisory against production URL

**Phase:** 35-performance-launch-gate
**Plan:** 05 — Wave 4 — Phase 35 close
**Task:** 3 of 5
**Files this task modifies:** .planning/phases/35-performance-launch-gate/launch-gate-final.json
**ACs this task satisfies:** AC-4, AC-5

## Plan Objective (Context)

Wave 4 — Phase 35 close. Run the production deploy, execute the LR-03 chrome-devtools MCP console sweep across all 5 routes, run the final launch-gate.ts Lighthouse advisory against the production URL, and compose the close commit with both verification strings per brief §Execution Order steps 22-26. After close, flip STATE.md and ROADMAP.md to Complete.

Purpose: This is the plan that takes v1.5 from "code done" to "shipped". LR-03 production console verification is specifically called out as requiring chrome-devtools MCP (not Playwright) because brief §LR-03 notes Playwright misses CSP violations that fire during real CDN font loading and third-party script errors that Chromium headless doesn't see. The Lighthouse advisory is recorded in the close commit as searchable audit trail per brief §PF-02 "Lighthouse verified..." convention.

Output: Production deployment live, verified, and documented. Close commit landed. STATE.md + ROADMAP.md flipped. Phase 35 officially Complete. Awwwards submission becomes Grey's next action (outside Phase 35 scope per user correction).

## Plan Acceptance Criteria (Reference)

ACs this task must help satisfy (see ac_refs above for which apply):

**AC-1:** Given `.vercel/project.json` is present and `vercel whoami` returns a user in the correct team, when `vercel --prod` runs from project root, then a production deployment completes and the CLI prints a production URL (format: `https://...vercel.app` or the custom domain from OPEN-2 resolution). The URL is captured for subsequent tasks.

**AC-2:** Given the production URL is live, when each of the 5 routes is fetched via `curl -I -L` or chrome-devtools MCP navigation, then each returns HTTP 200 (or 301/302 to a 200). No 404, 500, or hang.

**AC-3:** Given chrome-devtools MCP navigates to each of the 5 routes in sequence against the production URL, when `list_console_messages` is captured per route, then every route's message list contains ZERO entries with severity `error` AND ZERO entries with severity `warning`. Info-level messages are allowed.

**AC-4:** Given `scripts/launch-gate.ts` is executed with `--url <production URL>`, when the run completes, then it outputs 4 category scores (Performance, Accessibility, Best Practices, SEO) after the worst-of-3 mitigation. The JSON is written to `.planning/phases/35-performance-launch-gate/launch-gate-final.json` (or timestamped equivalent moved to this final name).

**AC-5:** Given the Phase 35 close commit, when `git log --grep "Lighthouse verified" -n 5` runs, then the close commit appears with the verification string block matching the brief format. When `git log --grep "Production console verified" -n 5` runs, the same close commit appears with the console verification string block. Both strings are searchable.

**AC-6:** Given `.planning/STATE.md` after close, when read, the Phase 35 row in the "v1.5 Phase Map" shows `Complete` and the progress block shows `v1.5: [██████████] 100% (20/20 plans) MILESTONE COMPLETE — shipped {date}`.

**AC-7:** Given `.planning/ROADMAP.md` after close, when grepped, every Phase 35 plan checkbox is `[x]` and the Progress table row for Phase 35 shows `Complete` with today's date.

**AC-8:** Given `.planning/phases/35-performance-launch-gate/production-console-sweep.md` after this plan runs, when read, it contains a table with one row per route showing `{route}: {n} errors, {n} warnings` matching the close commit string. If any count is non-zero, the file documents the triage decision (fix within cap, expand cap, or accept-as-risk with Grey's explicit approval).

**AC-9:** Given `components/blocks/entry-section.tsx` after the entire phase completes, when grepped, lines 43-58 still contain `data-anim="hero-slash-moment"`, `mix-blend-mode: screen`, and `opacity: 0.25` — VL-05 hero slash sibling status-quo lock holds through Wave 4.

**AC-10:** Given the Awwwards submission is EXPLICITLY outside this plan's scope, when `git log` is reviewed after Phase 35 close, no commit contains the word "submit" or "awwwards" in a way that implies the submission action was taken as a planner task. The awwwards-description.md and screenshots directory are present as artifacts; the click is Grey's.

**AC-11:** Given the 7 requirement IDs for Phase 35 (PF-01, PF-02, PF-03, LR-01, LR-02, LR-03, LR-04), when `.planning/REQUIREMENTS.md` is updated in this plan (or confirmed updated), then each ID moves from `Pending` to `Complete` in the traceability table, matching the Phase 35 column.

**AC-12:** Given the two OPEN items, when OPEN-ITEMS.md is reviewed in the close commit, then BOTH OPEN-1 (credits attribution) AND OPEN-2 (metadataBase URL) show `RESOLVED: <value>` with Grey's choice recorded.

## Read First

Before making any changes, read these files:
scripts/launch-gate.ts (from plan 35-03)
    /Users/greyaltaer/Library/Mobile Documents/iCloud~md~obsidian/Documents/second-brain/wiki/analyses/v1.5-phase35-brief.md (§PF-02 — Lighthouse verification string format)

## Task Boundaries (DO NOT CHANGE)

The following paths/sections must not be modified by this task:
<!-- Advisory only — a failing score is NOT a hard launch blocker unless Grey escalates. Brief §PF-02 "hybrid D mechanism". -->
    <!-- Must run against PRODUCTION URL, not preview. -->
    <!-- 3-run worst-score mitigation is in the script; do not pass flags that override this. -->
    <!-- components/blocks/entry-section.tsx lines 43-58 — VL-05 status-quo lock. -->

## Task Action

```bash
PROD_URL="<from Task 1>"
pnpm exec tsx scripts/launch-gate.ts --url "$PROD_URL"
```

The script runs Lighthouse 3 times, takes the worst score per category, prints results, writes timestamped JSON to `.planning/phases/35-performance-launch-gate/launch-gate-<timestamp>.json`.

After the run, rename (copy) the latest timestamped file to `launch-gate-final.json` for the close commit:

```bash
# Find the most recent launch-gate-*.json
LATEST=$(ls -t .planning/phases/35-performance-launch-gate/launch-gate-*.json 2>/dev/null | head -1)
cp "$LATEST" .planning/phases/35-performance-launch-gate/launch-gate-final.json
```

Capture the close-commit-ready string from the script stdout (or construct it from the JSON):

```
Lighthouse verified at commit <sha> on date <YYYY-MM-DD> against preview URL <PROD_URL>:
  Performance: <n>
  Accessibility: <n>
  Best Practices: <n>
  SEO: <n>
```

Note: brief §PF-02 says "preview URL" in the template, but production URL is fine — the intent is the searchable string pattern, not the word "preview". Update the template to say "production URL" if more truthful.

**If any category < 100:**

Per brief §PF-02, Lighthouse is ADVISORY not CI-blocking. A < 100 result does NOT automatically fail Phase 35. Options:
1. **Within original 5-fix cap** — land a targeted fix commit, redeploy, re-run. Acceptable if cap has headroom.
2. **Cap overflow** — escalate to Grey with explicit "Cap expanded from 5 to N" statement.
3. **Accept-as-risk** — if Grey decides the category is acceptable at current score (e.g., Performance 97 mobile is a reasonable WebGL compromise), document the decision in the close commit and in v1.6-carry-overs.md for future work.

Either way, the string gets into the close commit — whether it says `100` or `97`. Truth is the priority; searchable audit trail is the mechanism.

## Acceptance Criteria



## Verification

<automated>test -f .planning/phases/35-performance-launch-gate/launch-gate-final.json && python3 -c "import json; d=json.load(open('.planning/phases/35-performance-launch-gate/launch-gate-final.json')); assert 'worst' in d or 'runs' in d or 'url' in d, 'missing expected keys'; print('launch-gate-final.json valid')" && [ -z "$(git diff components/blocks/entry-section.tsx)" ]</automated>

## Done Condition

launch-gate-final.json exists with valid structure. Script ran against production URL. Close-commit Lighthouse verification string is ready. VL-05 slash sibling unchanged.

## Plan Must-Haves (Relevant to This Task)

**Truths:**
- "vercel --prod has landed a production deployment from main branch at the final v1.5 commit"
- "Production URL is live and returns 200 on all 5 routes"
- "chrome-devtools MCP has visited all 5 routes on the production URL and captured console messages"
- "All 5 routes report zero `error` severity console messages and zero `warning` severity messages"
- "scripts/launch-gate.ts has run against the production URL and the result is documented in the close commit message"
- "Phase 35 close commit contains both the Lighthouse verification string and the production console verification string"
- "STATE.md phase map Phase 35 row is flipped to Complete"
- "ROADMAP.md Phase 35 plan list checkboxes are all [x]"
