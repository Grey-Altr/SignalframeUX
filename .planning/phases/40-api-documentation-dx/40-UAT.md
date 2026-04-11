---
status: testing
phase: 40-api-documentation-dx
source: [40-00-SUMMARY.md, 40-01-SUMMARY.md, 40-02-SUMMARY.md, 40-03-SUMMARY.md, 40-04-SUMMARY.md]
started: 2026-04-11T04:40:00Z
updated: 2026-04-11T04:40:00Z
---

## Current Test

number: 1
name: README.md content and tone
expected: |
  Open README.md at repo root. It should have a technical specimen tone (terse, data-dense, no warm developer guide energy). Verify these sections exist: INSTALL, QUICK START (with `signalframeux` import in under 10 lines of code), SIGNAL/FRAME MODEL explanation, TOKEN SYSTEM, and ENTRY POINTS table listing all 3 entry points. Link to MIGRATION.md at the bottom.
awaiting: user response

## Tests

### 1. README.md content and tone
expected: Open README.md at repo root. It should have a technical specimen tone (terse, data-dense, no warm developer guide energy). Verify these sections exist: INSTALL, QUICK START (with `signalframeux` import in under 10 lines of code), SIGNAL/FRAME MODEL explanation, TOKEN SYSTEM, and ENTRY POINTS table listing all 3 entry points. Link to MIGRATION.md at the bottom.
result: [pending]

### 2. MIGRATION.md import mapping
expected: Open MIGRATION.md at repo root. It should contain an import mapping table showing old internal paths (like `@/components/sf/sf-button`) mapped to new npm paths (`signalframeux`, `signalframeux/animation`, `signalframeux/webgl`). File should be under 200 lines. No `@sfux/` paths in new-path column.
result: [pending]

### 3. JSDoc coverage on SF components
expected: Open any SF component file (e.g., `components/sf/sf-card.tsx`). Every exported name (SFCard, SFCardHeader, SFCardTitle, etc.) should have a `/**` JSDoc block above it with a description and an `@example` tag showing usage.
result: [pending]

### 4. Auto-generated api-docs.ts
expected: Run `pnpm docs:generate` in terminal. It should exit 0 and regenerate `lib/api-docs.ts`. Open the file — it should contain entries for all SF components with `importPath` values of `signalframeux`, `signalframeux/animation`, or `signalframeux/webgl`. Zero occurrences of `@sfux/`.
result: [pending]

### 5. Storybook local dev
expected: Run `pnpm storybook` in terminal. Storybook should open in browser at localhost:6006. The UI should show SFUX branding — dark background, "SIGNALFRAME//UX" in the sidebar header, magenta accent color, zero rounded corners anywhere. Components should render with correct SFUX styling.
result: [pending]

### 6. Storybook story coverage
expected: In the Storybook sidebar, verify stories exist for major SF components. Check that flagship stories (under Flagship/ or SIGNAL/ categories) have interactive controls (knobs/args) and multiple variants. Total story count should be 40+.
result: [pending]

### 7. Storybook static build
expected: Run `pnpm build-storybook` in terminal. It should exit 0 and produce a `storybook-static/` directory with `index.html`.
result: [pending]

### 8. Storybook Vercel deployment
expected: Visit the deployed Storybook URL on Vercel. The Storybook should load with SFUX branding and render components correctly. Auto-deploy should be configured (pushing to the repo triggers a new deployment).
result: [pending]

## Summary

total: 8
passed: 0
issues: 0
pending: 8
skipped: 0

## Gaps

[none yet]
