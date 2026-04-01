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

Analyzed a **product design engineer portfolio** built on Next.js 16 with the SignalframeUX custom design system, targeting Vercel deployment. 15 tools recommended across 6 categories, prioritizing design prototyping, accessibility testing, and performance validation — the three pillars for achieving Awwwards-quality execution. Data enriched by WebSearch MCP for current MCP registry coverage.

## Project Context Analysis

| Signal | Detected Value | Source |
|--------|----------------|--------|
| Product type | software — web application (static-first with dynamic sections) | PROJECT.md |
| Primary language | TypeScript | PROJECT.md |
| Framework | Next.js 16 (App Router) | PROJECT.md |
| Database | none detected (MDX + JSON content) | PROJECT.md |
| Deployment target | web (Vercel) | PROJECT.md |
| Feature areas | design system, portfolio, MDX blog, case studies, SEO, dark mode, command palette, micro-interactions, motion design, performance, accessibility | PROJECT.md |
| Already installed | 0 tools detected | no package.json found |
| Catalog mode | WebSearch-enhanced + inline catalog | Step 3 probe results |

## Recommended Tools

### AI & Reasoning (ai)

#### Sequential Thinking MCP
- **Relevance:** high
- **Why for this project:** Enhances multi-step design reasoning across all PDE pipeline stages — critical for the 13-stage pressure test pipeline and complex design system decisions.
- **Install:**
  ```bash
  claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
  ```
- **Configuration hint:** No configuration needed — works immediately after install.
- **Category:** ai

#### Context7 MCP
- **Relevance:** high
- **Why for this project:** Provides up-to-date API documentation for Next.js 16, React, Tailwind CSS, and MDX — ensures generated code uses current APIs rather than stale training data.
- **Install:**
  ```bash
  claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
  ```
- **Configuration hint:** No configuration needed — automatically indexes project dependencies.
- **Category:** ai

### Design & Prototyping (design)

#### Next.js DevTools MCP
- **Relevance:** high
- **Why for this project:** Provides live error detection, page metadata inspection, server actions debugging, and Next.js knowledge base — essential for a Next.js 16 App Router portfolio with Server Components and Cache Components.
- **Install:**
  ```bash
  claude mcp add next-devtools -- npx -y @vercel/next-devtools-mcp@latest
  ```
- **Configuration hint:** Requires the Next.js dev server to be running (`next dev`). Connects via the built-in `/_next/mcp` endpoint in Next.js 16.
- **Category:** design

#### Figma MCP
- **Relevance:** high
- **Why for this project:** Enables design-to-code translation from Figma files to SignalframeUX components. Critical for the wireframe and mockup pipeline stages where visual fidelity must match Awwwards standards.
- **Install:**
  ```bash
  claude mcp add --transport http figma https://mcp.figma.com/mcp
  ```
- **Configuration hint:** Authenticate via Figma OAuth on first use. Works with any Figma file URL.
- **Category:** design

#### Playwright MCP
- **Relevance:** high
- **Why for this project:** Automated browser testing and screenshot validation for the portfolio. Validates responsive layouts, dark/light theme toggle, command palette interaction, and motion choreography across viewports.
- **Install:**
  ```bash
  claude mcp add playwright -- npx @playwright/mcp@latest
  ```
- **Configuration hint:** No additional setup — launches headless Chromium on first use.
- **Category:** design

### Code Quality & Testing (code-quality)

#### Axe Accessibility MCP
- **Relevance:** high
- **Why for this project:** Portfolio requires WCAG AA compliance and keyboard navigation throughout. Axe MCP enables automated accessibility auditing against WCAG 2.2 criteria directly from Claude.
- **Install:**
  ```bash
  claude mcp add a11y -- npx -y a11y-mcp
  ```
- **Configuration hint:** Requires a running dev server URL to test against.
- **Category:** code-quality

#### Vitest
- **Relevance:** high
- **Why for this project:** Native Vite-based test runner for Next.js 16 with Turbopack. Tests SignalframeUX component integration, MDX rendering, and theme toggle behavior with fast HMR-compatible test execution.
- **Install:**
  ```bash
  npm install -D vitest @vitejs/plugin-react
  ```
- **Configuration hint:** Create `vitest.config.ts` extending Next.js config. Use `@testing-library/react` for component tests.
- **Category:** code-quality

#### ESLint
- **Relevance:** high
- **Why for this project:** TypeScript linting with Next.js-specific rules (no-html-link-for-pages, no-img-element) and accessibility lint rules via eslint-plugin-jsx-a11y. Ships with Next.js but must be configured.
- **Install:**
  ```bash
  npm install -D eslint eslint-config-next
  ```
- **Configuration hint:** Next.js 16 uses flat config by default. Extend `next/core-web-vitals` for strictest rules.
- **Category:** code-quality

#### Prettier
- **Relevance:** medium
- **Why for this project:** Consistent code formatting across TypeScript, MDX, CSS, and JSON content files. Pairs with ESLint via eslint-config-prettier to avoid rule conflicts.
- **Install:**
  ```bash
  npm install -D prettier eslint-config-prettier
  ```
- **Configuration hint:** Add `prettier` to the ESLint extends array last. Create `.prettierrc` with project conventions.
- **Category:** code-quality

### Deployment & Infrastructure (deployment)

#### Vercel CLI
- **Relevance:** high
- **Why for this project:** Direct deployment target per PROJECT.md. Enables `vercel dev` for local development with Vercel Functions, `vercel env pull` for OIDC credentials, and production deployment with preview URLs.
- **Install:**
  ```bash
  npm install -g vercel
  ```
- **Configuration hint:** Run `vercel link` to connect to project, then `vercel env pull` for environment variables. Use `vercel dev` for local development.
- **Category:** deployment

#### GitHub MCP
- **Relevance:** high
- **Why for this project:** Source control integration for PR creation, code review, and issue tracking during portfolio development. Required for /pde:handoff workflow stage.
- **Install:**
  ```bash
  claude mcp add github -- npx -y @modelcontextprotocol/server-github
  ```
- **Configuration hint:** Set `GITHUB_TOKEN` environment variable with `repo` scope permissions.
- **Category:** deployment

### Research & Productivity (research)

#### WebSearch MCP
- **Relevance:** medium
- **Why for this project:** Already available in this session. Useful for competitor portfolio research, current design trends, and Awwwards submission requirements.
- **Install:**
  ```bash
  # Already available via Claude built-in WebSearch
  ```
- **Configuration hint:** No additional setup needed — available by default.
- **Category:** research

#### Fetch MCP
- **Relevance:** medium
- **Why for this project:** Direct URL fetching for reading documentation pages, inspecting competitor portfolio source, and validating OG image generation endpoints.
- **Install:**
  ```bash
  claude mcp add fetch -- npx -y @modelcontextprotocol/server-fetch
  ```
- **Configuration hint:** No configuration needed. Supports HTML, JSON, and plain text responses.
- **Category:** research

### Collaboration & Integrations (collaboration)

#### Linear MCP
- **Relevance:** medium
- **Why for this project:** Task tracking for the multi-stage design pipeline if using Linear for project management. Useful for tracking design decisions and pipeline progress across sessions.
- **Install:**
  ```bash
  claude mcp add linear -- npx -y @linear/mcp-server
  ```
- **Configuration hint:** Set `LINEAR_API_KEY` environment variable. Create a dedicated project for portfolio work.
- **Category:** collaboration

#### Sentry MCP
- **Relevance:** medium
- **Why for this project:** Error monitoring for the deployed portfolio. Catches runtime errors in Server Components, client-side hydration issues, and MDX rendering failures in production.
- **Install:**
  ```bash
  claude mcp add sentry -- npx -y @sentry/mcp-server@latest
  ```
- **Configuration hint:** Requires `SENTRY_AUTH_TOKEN` and `SENTRY_ORG` environment variables. Install `@sentry/nextjs` in the portfolio project.
- **Category:** collaboration

## Installation Guide

Copy-paste this block to install all HIGH relevance tools in order:

```bash
# AI & Reasoning
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest

# Design & Prototyping
claude mcp add next-devtools -- npx -y @vercel/next-devtools-mcp@latest
claude mcp add --transport http figma https://mcp.figma.com/mcp
claude mcp add playwright -- npx @playwright/mcp@latest

# Code Quality & Testing
claude mcp add a11y -- npx -y a11y-mcp
npm install -D vitest @vitejs/plugin-react
npm install -D eslint eslint-config-next

# Deployment & Infrastructure
npm install -g vercel
claude mcp add github -- npx -y @modelcontextprotocol/server-github
```

## Integration Notes

The recommended tools form a cohesive development pipeline. **Sequential Thinking** and **Context7** enhance every PDE pipeline stage with structured reasoning and current API documentation. **Next.js DevTools MCP** provides real-time feedback during development, while **Playwright MCP** and **Axe a11y MCP** validate the output — visual fidelity, responsive behavior, and accessibility compliance.

For the design-to-code workflow, **Figma MCP** enables direct translation from design files to SignalframeUX components. Install Figma MCP before running /pde:wireframe and /pde:mockup stages for optimal results. The **GitHub MCP** should be configured before /pde:handoff for seamless repository integration.

The **Vercel CLI** is the deployment backbone — run `vercel link` and `vercel env pull` early to configure the project. This enables local development with `vercel dev` that mirrors production behavior, critical for validating Lighthouse scores and Core Web Vitals during development.

## Category Coverage Map

| Category | Recommended | Installed | Gap |
|----------|-------------|-----------|-----|
| AI & Reasoning | 2 tools | 0 tools | 2 |
| Design & Prototyping | 3 tools | 0 tools | 3 |
| Code Quality & Testing | 4 tools | 0 tools | 4 |
| Data & Databases | 0 tools | 0 tools | 0 |
| Deployment & Infrastructure | 2 tools | 0 tools | 2 |
| Research & Productivity | 2 tools | 0 tools | 2 |
| Collaboration & Integrations | 2 tools | 0 tools | 2 |

[Enhanced by WebSearch MCP -- live tool discovery]

---

*Generated by PDE-OS /pde:recommend | 2026-03-31*
