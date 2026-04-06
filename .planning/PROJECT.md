# Portfolio — Product Design Engineer Portfolio

## Vision

A portfolio website for a product design engineer that showcases the intersection of design and engineering — from design systems and component libraries to full-stack product builds. Built as the flagship implementation of the SignalframeUX design system, the site itself is a case study in design engineering craft.

## Product Type

Software — web application (static-first with dynamic sections)

## Tech Stack

- **Language:** TypeScript
- **Framework:** Next.js 16 (App Router)
- **UI:** React, SignalframeUX (custom design system & component library), Tailwind CSS
- **Design System:** SignalframeUX — housed at ~/code/projects/SignalframeUX
- **Deployment:** Vercel
- **Content:** MDX for case studies/writing, JSON for project data
- **Analytics:** Vercel Analytics + Speed Insights

## Target Users

- **Primary:** Design and engineering hiring managers evaluating product design engineer candidates
- **Secondary:** Fellow design engineers and developers interested in design systems and craft
- **Tertiary:** Potential collaborators, studios, or clients seeking design engineering expertise

## Core Goals

1. **Case study showcase** — present design engineering work with process narratives: problem framing, design exploration, technical decisions, and measurable outcomes
2. **Design system as proof of work** — the portfolio itself demonstrates SignalframeUX components in production, serving as a living reference
3. **Writing/thinking** — MDX-powered articles on design engineering, design systems, interaction design, and technical craft
4. **Professional presence** — about, contact, resume/CV, social links, and availability status
5. **Performance + craft benchmark** — sub-1s LCP, perfect Lighthouse scores, Awwwards-quality visual execution

## Constraints

- Must achieve Lighthouse 100/100 across all categories
- Dark mode as primary theme (design/dev audience), light mode available
- Mobile-first responsive design — portfolio browsing happens heavily on phones
- No JavaScript required for core content (progressive enhancement)
- Accessibility: WCAG AA minimum, keyboard-navigable throughout
- Page weight budget: < 200KB initial load (excluding images)
- Visual execution must reflect design engineering standards — no generic templates

## Key Feature Areas

- Case study gallery with filtering by discipline (design, engineering, hybrid)
- Case study detail pages with process narratives, before/after, and interactive demos
- Blog/writing section with MDX support and syntax highlighting
- About/bio page with professional timeline and skills matrix
- Contact section with availability indicator
- Design system showcase page (interactive component playground)
- Dark/light theme toggle with system preference detection
- SEO optimization with dynamic OG images
- RSS feed for blog posts
- Command palette for keyboard-first navigation (cmdk)
- Micro-interactions and motion design that demonstrate craft

## Success Metrics

- Lighthouse: 100/100 all categories
- LCP < 1.0s on 4G connection
- Time to Interactive < 1.5s
- Zero layout shift (CLS = 0)
- Awwwards SOTD quality (>= 8.0 weighted score across Design 4x, Usability 3x, Creativity 2x, Content 1x)

## Current Milestone: v1.0 Craft & Feedback

**Goal:** Stabilize the Frame foundation, amplify Signal-layer craft to SOTD level, and make the DX so fluent that AI agents produce award-quality output without friction.

**Pillars:**
- **Foundation** — lock tokens, primitives, and constraints (spacing, typography, layout, colors, animation)
- **Feeling** — SOTD-level micro and macro feedback (hover, click, scroll, transitions, state changes, content reveals)
- **Fluency** — AI/developer DX contract so clean that SignalframeUX is "as easy as feeling"

**Target features:**
- Token system stabilization (blessed spacing, semantic typography, layout tokens, color tiers)
- SF primitives (SFContainer, SFSection, SFStack, SFGrid, SFText)
- Satisfying micro-interactions and macro-transitions across all components
- AI DX scaffolding contract (component templates, CVA shapes, barrel export patterns)
- Progressive enhancement guarantees (Signal fallbacks, GSAP load failure resilience)
- 90-second jury moment — above-the-fold at 1440px must win without scroll
- Crafted empty states and error pages as first-class design moments

## Relationship to SignalframeUX

This portfolio is the first consumer of the SignalframeUX design system. It imports tokens, components, and patterns from the library. Design decisions made during this pipeline should feed back into SignalframeUX as validated patterns.

- **SignalframeUX location:** ~/code/projects/SignalframeUX (current directory)
- **Portfolio location:** ~/code/projects/portfolio (to be created)

---

*Created for PDE pressure test — greenfield fixture*
*Product concept: Personal developer portfolio built on SignalframeUX design system*
