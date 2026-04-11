# PDE Audit Report

**Generated:** 2026-04-11T17:45:00Z
**Categories scanned:** commands, workflows, agents, templates, references
**Total findings:** 16

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| HIGH | 2 |
| MEDIUM | 11 |
| LOW | 3 |

## PDE Health Report

**Overall Health:** 89.4%
**Trend:** N/A (no baseline)

### Category Breakdown

| Category | Health | Findings | Critical | High | Medium | Low |
|----------|--------|----------|----------|------|--------|-----|
| Commands | 86.0% | 7 | 0 | 1 | 6 | 0 |
| Workflows | 75.0% | 5 | 0 | 1 | 3 | 1 |
| Agents | 94.0% | 2 | 0 | 0 | 2 | 0 |
| Templates | 98.0% | 2 | 0 | 0 | 0 | 2 |
| References | 94.0% | 2 | 0 | 0 | 2 | 0 |
| **Overall** | **89.4%** | | | | | |

### Quick Health Check

- Tool availability: 5/6 referenced tools accessible (workflows/set-profile.md missing)
- Reference currency: 37/37 reference files exist and have content
- Skill quality: 89.4% average across categories

### Tool Effectiveness (AUDIT-07)

| Check Type | Passed | Failed | Total |
|------------|--------|--------|-------|
| Structural | 5 | 1 | 6 |
| Live MCP | 2 | 0 | 2 |

**Template completeness:** 3 sampled, 1 flagged (handoff-spec.md >20% undocumented placeholders)

## Delta from Baseline

Delta: N/A (no baseline — run with --save-baseline to establish one)

## Findings

### CRITICAL

None

### HIGH

**1. commands/set-profile.md — LINT-REF-01: Missing workflow reference**
Command references `@${CLAUDE_PLUGIN_ROOT}/workflows/set-profile.md` which does not exist on disk. The workflows/ directory contains no set-profile.md file.
**Suggestion:** Create workflows/set-profile.md implementing the profile-switch logic, or rename the reference to match an existing workflow such as workflows/settings.md if profile switching is handled there.

**2. workflows/help.md — LINT-005: Missing `<process>` section**
workflows/help.md uses a `<reference>` tag instead of the required `<process>` section. LINT-005 requires every skill file to contain a `<process>` section with numbered steps.
**Suggestion:** Wrap the existing `<reference>` content inside a `<process>` section, or add a minimal `<process>` section that instructs the agent to render the `<reference>` content verbatim.

### MEDIUM

**3. commands/stats.md — LINT-FM-01: Missing argument-hint frontmatter**
commands/stats.md is missing the required `argument-hint:` YAML frontmatter field. All 69 other command files include this field.
**Suggestion:** Add `argument-hint: ""` to the YAML frontmatter.

**4. commands/hardware.md — LINT-005: Stub process section**
commands/hardware.md process section contains only a 'Status: Planned' notice with no workflow reference. Same applies to commands/setup.md, commands/test.md, and commands/migrate.md.
**Suggestion:** Create the workflow or add an explicit user-facing message routing users to an alternative.

**5. commands/setup.md — LINT-005: Stub process section**
Same as hardware.md — stub process section with no workflow reference.

**6. commands/test.md — LINT-005: Stub process section**
Same as hardware.md — stub process section with no workflow reference.

**7. commands/migrate.md — LINT-005: Stub process section**
Same as hardware.md — stub process section with no workflow reference.

**8. workflows/ (53 of 74 files) — LINT-020: Missing --dry-run flag documentation**
53 of 74 workflow files do not document the --dry-run flag. skill-style-guide.md requires --dry-run as a universal flag on every skill.
**Suggestion:** Add a `## Supported Flags` section. Prioritize workflows that write files (execute-phase.md, plan-phase.md, complete-milestone.md, new-milestone.md).

**9. workflows/ (57 of 74 files) — LINT-022: Missing --verbose flag documentation**
57 of 74 workflow files do not document the --verbose flag.
**Suggestion:** Add --verbose to the supported flags table in the same pass as LINT-020 remediation.

**10. workflows/ (57 of 74 files) — LINT-023: Missing --no-mcp flag documentation**
57 of 74 workflow files do not document the --no-mcp flag.
**Suggestion:** For workflows that do not use MCPs, add an explicit note: `--no-mcp | Boolean | No MCP integration in this workflow. Flag accepted but has no effect.`

**11. agents/pde-analyst.md — AUDIT-12: Missing constraints section**
pde-analyst.md is missing a 'Your Constraints' section. No explicit constraint clauses preventing writes to protected files, no READ-ONLY declaration.
**Suggestion:** Add a `## Your Constraints` section with protected-files.json check instruction and allowed write destinations.

**12. agents/pde-analyst.md — AUDIT-12: No reference citations**
pde-analyst.md has zero @ references to any reference file. The analyst operates purely on training knowledge without grounded reference material.
**Suggestion:** Add `@${CLAUDE_PLUGIN_ROOT}/references/questioning.md` and `@${CLAUDE_PLUGIN_ROOT}/references/strategy-frameworks.md` to a Required Reading section.

**13. references/ (16 files) — REF-HEADER-01: Missing Version header**
16 reference files are missing the required Version header: checkpoints.md, continuation-format.md, decimal-phase-calculation.md, git-integration.md, git-planning-commit.md, model-profile-resolution.md, model-profiles.md, phase-argument-parsing.md, planning-config.md, questioning.md, tdd.md, telemetry-protocol.md, ui-brand.md, verification-patterns.md, workflow-methodology.md.
**Suggestion:** Add a version block using mcp-integration.md as the canonical template.

**14. references/ (18 files) — REF-HEADER-02: Missing Scope header**
18 reference files are missing the required Scope header. Superset of the Version-missing list, plus color-systems.md and typography.md.
**Suggestion:** Add Scope alongside Version in the same pass.

### LOW

**15. templates/handoff-spec.md — AUDIT-07-TMPL: Undocumented placeholders**
48 unique placeholder tokens with only 2 inline comments. More than 20% undocumented — agents may substitute incorrect values for ambiguous tokens like {grade}, {lead_time}, {auth}.
**Suggestion:** Add a template header section listing non-obvious placeholder tokens with expected values.

**16. templates/design-brief.md — AUDIT-07-TMPL: Missing usage header**
6 placeholder tokens with no template header or usage section.
**Suggestion:** Add a `<usage>` block stating which skill writes to it and what each placeholder represents.

**17. workflows/ (58 of 74 files) — LINT-041: Missing mcp-integration.md reference**
58 of 74 workflow files do not reference mcp-integration.md. Only 16 design-pipeline workflows include the reference.
**Suggestion:** For workflows that use MCP tools, add the reference. For others, add `<!-- No MCP integration in this workflow -->`.

## Missing References

| Skill | Missing Reference | Impact |
|-------|-------------------|--------|
| commands/set-profile.md | workflows/set-profile.md | Command is non-functional — invocation delegates to a workflow file that does not exist |

## Agent Prompt Quality (AUDIT-12)

- **pde-analyst.md:** Missing constraints section and zero reference citations. Agent operates without grounded methodology or explicit write boundaries. Remediation: add constraints section + required reading references.
- All other agents (pde-design-quality-evaluator, pde-pressure-test-evaluator, pde-quality-auditor, pde-skill-builder, pde-skill-improver, pde-skill-validator) follow the expected structure with constraints, return format, and reference citations.
