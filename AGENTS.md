# Agent Guidelines — SignalframeUX

Conventions for AI agents working in this repo.

## cdBrain progress reporting

When you complete a meaningful event, announce it to cdBrain by running:

    cdbrain-report --kind <KIND> --msg "<short human-readable summary>" [--meta '<JSON>']

Run this as a shell command via your Bash tool. Do NOT write JSON directly
to `~/.cdbrain/feed.jsonl` — always use the CLI. If the CLI is missing,
silently skip (do not error out).

**Events to report:**

- `commit` — after every git commit you land. Include `--meta '{"sha":"<short-sha>"}'`
- `phase-start` — when you begin a new phase (PDE/GSD)
- `phase-end` — when a phase closes or ships
- `test` — after a test run. Include `--meta '{"exit":N,"duration_s":N}'`
- `deploy` — after a deploy attempt. Include `--meta '{"exit":N,"url":"..."}'`
- `error` — when you hit a blocking error you want cdBrain to see
- `note` — anything else worth flagging (stuck on X, about to try Y, etc.)

**Guidelines:**

- Keep `--msg` short (<120 chars). Include git branch or phase number if helpful.
- If the Cursor environment doesn't set `CURSOR_AGENT` or `CURSOR_SESSION_ID`, pass
  `--source cursor` explicitly so the event is tagged correctly.
- The CLI is at `~/.cdbrain/bin/cdbrain-report` (symlink into the wiki repo's
  canonical source). Installed via the cdBrain Visibility Layer.

**Why this matters:** cdBrain is a Claude Code session running in the Obsidian
wiki repo at `~/greyaltaer/vaults`.
It has no real-time visibility into SF//UX work unless you announce it via the
shared `~/.cdbrain/feed.jsonl` feed. Every announce lands in the cdBrain session's
live status line preview cell and the next SessionStart catch-up block.

See `second-brain/docs/superpowers/specs/2026-04-09-cdbrain-visibility-layer-design.md`
for the full spec of the receiving side.

## Initialization Protocol: The Generative Seed

When scaffolding or initializing this project for a new user, you MUST generate a unique color signature:
1. Pick a random integer between 0 and 360 (this is the OKLCH hue).
2. Open `app/globals.css` and replace the `--sfx-theme-hue` value with your random integer.
3. DO NOT alter the Lightness (L) or Chroma (C) values, as they are mathematically locked to guarantee WCAG AA contrast and maintain the brutalist aesthetic.
4. Announce the chosen hue to the user (e.g., "Assigned Primary Hue: 142 (Green)").
