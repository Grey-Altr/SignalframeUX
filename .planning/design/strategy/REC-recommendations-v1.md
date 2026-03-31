---
Generated: "2026-03-31"
Skill: /pde:recommend (REC)
Version: v1
Status: draft
Scope: "full"
Data Currency: "Recommendations based on project context as of 2026-03-31. Re-run with live MCPs for updated registry data."
Enhanced By: "WebSearch MCP"
---

# Tool & MCP Recommendations — Portfolio (Product Design Engineer)

## Executive Summary

Analyzed a Next.js 16 / TypeScript portfolio website targeting Awwwards-quality visual execution, built on the SignalframeUX design system. 12 tools recommended across 5 categories, with highest priority on design tooling (Figma MCP, Playwright MCP), accessibility validation (Axe a11y MCP), and AI reasoning (Sequential Thinking, Context7). No existing dependencies detected — this is a greenfield project.

[Enhanced by WebSearch MCP -- live tool discovery]

## Project Context Analysis

| Signal | Detected Value | Source |
|--------|----------------|--------|
| Product type | software (web application) | PROJECT.md |
| Primary language | TypeScript | PROJECT.md |
| Framework | Next.js 16 (App Router) | PROJECT.md |
| Database | none detected | PROJECT.md |
| Deployment target | web (Vercel) | PROJECT.md |
| Feature areas | case studies, blog/MDX, design system showcase, SEO/OG images, dark/light theme, command palette, micro-interactions, RSS | PROJECT.md |
| Already installed | 0 tools detected | no package.json |
| Catalog mode | WebSearch + Inline catalog | Step 3 probe results |

## Recommended Tools

### AI & Reasoning (ai)

#### Sequential Thinking MCP
- **Relevance:** high
- **Why for this project:** Enhances all design pipeline skills — critical for multi-step reasoning during design system decisions, layout composition, and motion choreography planning.
- **Install:**
  ```bash
  claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
  ```
- **Configuration hint:** No configuration needed — works immediately after install.
- **Category:** ai

#### Context7 MCP
- **Relevance:** high
- **Why for this project:** Provides live documentation lookup for Next.js 16, React, Tailwind CSS, and MDX — essential when the project uses cutting-edge framework features (App Router, Cache Components, proxy.ts).
- **Install:**
  ```bash
  claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
  ```
- **Configuration hint:** No configuration needed — automatically indexes project dependencies.
- **Category:** ai

### Design & Prototyping (design)

#### Figma MCP
- **Relevance:** high
- **Why for this project:** Direct integration with Figma for design system work — wireframe-to-code workflows, component inspection, and design token extraction. Critical for a design engineer portfolio where the design process itself is a case study.
- **Install:**
  ```bash
  claude mcp add --transport http figma https://mcp.figma.com/mcp
  ```
- **Configuration hint:** Requires Figma account authentication on first use. Connect via browser OAuth flow.
- **Category:** design

#### Playwright MCP
- **Relevance:** high
- **Why for this project:** Automated visual regression testing and screenshot validation. Essential for maintaining Awwwards-quality visual fidelity across dark/light themes, responsive breakpoints, and component states.
- **Install:**
  ```bash
  claude mcp add playwright -- npx @playwright/mcp@latest
  ```
- **Configuration hint:** Run `npx playwright install chromium` after adding the MCP for browser binaries.
- **Category:** design

### Code Quality & Testing (code-quality)

#### Axe a11y MCP
- **Relevance:** high
- **Why for this project:** WCAG AA is a hard constraint. Axe provides automated accessibility auditing for every page and component — catches contrast failures, missing ARIA labels, and keyboard navigation gaps that manual review misses.
- **Install:**
  ```bash
  claude mcp add a11y -- npx -y a11y-mcp
  ```
- **Configuration hint:** No configuration needed — scans rendered HTML automatically.
- **Category:** code-quality

#### ESLint
- **Relevance:** medium
- **Why for this project:** TypeScript linting for code consistency across the portfolio codebase.
- **Install:**
  ```bash
  npm install -D eslint
  ```
- **Configuration hint:** Use `npx eslint --init` to generate config. Consider `eslint-config-next` for Next.js-specific rules.
- **Category:** code-quality

#### Prettier
- **Relevance:** medium
- **Why for this project:** Consistent code formatting across TypeScript, MDX, and CSS files.
- **Install:**
  ```bash
  npm install -D prettier
  ```
- **Configuration hint:** Add `.prettierrc` with Tailwind plugin: `npm install -D prettier-plugin-tailwindcss`.
- **Category:** code-quality

#### Vitest
- **Relevance:** medium
- **Why for this project:** Unit testing for SignalframeUX components and utility functions. Pairs well with Next.js and Vite-based tooling.
- **Install:**
  ```bash
  npm install -D vitest @testing-library/react
  ```
- **Configuration hint:** Add `vitest.config.ts` with React plugin for component testing.
- **Category:** code-quality

### Deployment & Infrastructure (deployment)

#### GitHub MCP
- **Relevance:** high
- **Why for this project:** Source control integration for PR workflows, issue tracking, and repository management. Enables automated workflows from Claude.
- **Install:**
  ```bash
  claude mcp add github -- npx -y @modelcontextprotocol/server-github
  ```
- **Configuration hint:** Set `GITHUB_TOKEN` environment variable with repo scope permissions.
- **Category:** deployment

#### Vercel CLI
- **Relevance:** high
- **Why for this project:** Direct stack match — Next.js 16 on Vercel deployment. Required for `vercel dev`, `vercel env pull`, preview deployments, and production promotion.
- **Install:**
  ```bash
  npm install -g vercel
  ```
- **Configuration hint:** Run `vercel link` to connect to your project, then `vercel env pull` for local environment variables.
- **Category:** deployment

### Research & Productivity (research)

#### WebSearch MCP
- **Relevance:** medium
- **Why for this project:** Already available as built-in. Useful for competitor portfolio research, design trend analysis, and documentation lookup during development.
- **Install:**
  ```bash
  # Already available as built-in WebSearch
  ```
- **Configuration hint:** No additional setup needed.
- **Category:** research

#### Fetch MCP
- **Relevance:** medium
- **Why for this project:** Direct URL fetching for inspecting competitor portfolios, pulling API responses, and validating OG image generation.
- **Install:**
  ```bash
  claude mcp add fetch -- npx -y @modelcontextprotocol/server-fetch
  ```
- **Configuration hint:** No configuration needed — fetches any public URL.
- **Category:** research

## Installation Guide

Copy-paste this block to install all HIGH relevance tools in order:

```bash
# AI & Reasoning
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest

# Design & Prototyping
claude mcp add --transport http figma https://mcp.figma.com/mcp
claude mcp add playwright -- npx @playwright/mcp@latest
npx playwright install chromium

# Code Quality & Testing
claude mcp add a11y -- npx -y a11y-mcp

# Deployment & Infrastructure
claude mcp add github -- npx -y @modelcontextprotocol/server-github
npm install -g vercel
```

## Integration Notes

The recommended tools form a cohesive workflow for design engineering. **Figma MCP** feeds design decisions into the codebase, while **Playwright MCP** validates that the implemented UI matches design intent across themes and viewports. **Axe a11y MCP** runs alongside Playwright to catch accessibility regressions before they ship.

**Sequential Thinking** and **Context7** enhance the AI-assisted development workflow — Sequential Thinking improves multi-step reasoning for design system decisions, while Context7 ensures Next.js 16 and React API usage stays current. Install these first, as they benefit all subsequent development work.

For deployment, run `vercel link` early to establish the project connection, then `vercel env pull` to get environment variables locally. Set `GITHUB_TOKEN` for the GitHub MCP to enable PR workflows. The Vercel CLI's `vercel dev` command provides the local development server with full platform feature parity.

## Category Coverage Map

| Category | Recommended | Installed | Gap |
|----------|-------------|-----------|-----|
| AI & Reasoning | 2 tools | 0 tools | 2 |
| Design & Prototyping | 2 tools | 0 tools | 2 |
| Code Quality & Testing | 4 tools | 0 tools | 4 |
| Data & Databases | 0 tools | 0 tools | 0 |
| Deployment & Infrastructure | 2 tools | 0 tools | 2 |
| Research & Productivity | 2 tools | 0 tools | 2 |
| Collaboration & Integrations | 0 tools | 0 tools | 0 |

---

*Generated by PDE-OS /pde:recommend | 2026-03-31*
