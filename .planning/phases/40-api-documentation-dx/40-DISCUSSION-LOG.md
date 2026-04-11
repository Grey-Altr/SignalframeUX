# Phase 40: API Documentation & DX - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-10
**Phase:** 40-api-documentation-dx
**Areas discussed:** Storybook scope & setup, README structure & tone, /reference alignment, Migration guide depth

---

## Storybook scope & setup

| Option | Description | Selected |
|--------|-------------|----------|
| Consumer showcase | Published Storybook for external devs — interactive props, live examples | |
| Dev-only sandbox | Local-only tool, not published | |
| Both | Local dev tool AND published reference | ✓ |

**User's choice:** Both — local dev sandbox and published consumer showcase

| Option | Description | Selected |
|--------|-------------|----------|
| All exported SF components | Every component gets a story (~49) | |
| Curated subset | Only key components (15-20 stories) | |
| Tiered approach | All get basic stories, 10-15 flagship get rich stories | ✓ |

**User's choice:** Tiered approach

| Option | Description | Selected |
|--------|-------------|----------|
| Custom branded theme | Dark, SFUX tokens, zero rounded corners, monospaced | ✓ |
| Default Storybook theme | Out-of-the-box dark theme | |
| Light custom touch | Default dark + logo/colors/fonts | |

**User's choice:** Custom branded theme

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel subdomain | storybook.signalframeux.com, separate Vercel project | ✓ |
| Chromatic | Storybook hosting + visual regression testing | |
| You decide | Claude picks | |

**User's choice:** Vercel subdomain

---

## README structure & tone

| Option | Description | Selected |
|--------|-------------|----------|
| Technical specimen | Terse, monospaced, data-dense, DU/TDR aesthetic | ✓ |
| Warm developer guide | Friendly, approachable, explains before showing code | |
| Hybrid | Sharp header then warm usage sections | |

**User's choice:** Technical specimen

**Sections selected (multi-select):** Install + Quick Start, FRAME/SIGNAL model explainer, Token system overview, Entry point guide

---

## /reference alignment

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-generate from source | Build script parses entry files + JSDoc, zero drift | ✓ |
| Manual curation with audit | Hand-written api-docs.ts + CI check for drift | |
| You decide | Claude picks | |

**User's choice:** Auto-generate from source

| Option | Description | Selected |
|--------|-------------|----------|
| All library exports | Everything in entry-core + animation + webgl on /reference | ✓ |
| Curated editorial subset | Keep current editorial selection | |
| All exports + editorial highlights | Everything, but highlight key components | |

**User's choice:** All library exports

---

## Migration guide depth

| Option | Description | Selected |
|--------|-------------|----------|
| Concise cheat sheet | Single page, import mapping table, peer deps, token CSS. Under 200 lines. | ✓ |
| Full walkthrough | Step-by-step with before/after, troubleshooting, 500+ lines | |
| Inline in README | Fold into README Quick Start subsection | |

**User's choice:** Concise cheat sheet

| Option | Description | Selected |
|--------|-------------|----------|
| MIGRATION.md in repo root | Standalone file, linked from README | ✓ |
| Section in README | Everything in one file | |
| On the /init page | Part of website's initialization page | |

**User's choice:** MIGRATION.md in repo root

---

## Claude's Discretion

- Storybook version and addon selection
- Which 10-15 components qualify as "flagship" for rich stories
- Auto-generation script implementation approach
- JSDoc audit scope

## Deferred Ideas

None
