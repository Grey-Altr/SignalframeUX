---
Generated: "2026-03-31"
Skill: /pde:ideate (IDT)
Version: v1
Status: ideation-complete
Scope: "6 directions diverged, The Narrative Arc recommended"
Enhanced By: "none"
---

# Ideation: Portfolio (Product Design Engineer)

## Diverge Phase

### Direction 1: The Living System
- **Core Concept:** A portfolio built entirely as a design system documentation site. Every page is a pattern example. The case studies section shows how patterns compose into products. Navigation follows the atomic design hierarchy (tokens → primitives → components → compositions → pages).
- **Key Assumption:** Hiring managers value design system literacy enough to engage with a documentation-style portfolio rather than a traditional showcase format.
- **Open Question:** Does a documentation-first structure alienate non-technical hiring managers who expect a traditional portfolio narrative?
- **Target User:** Design system teams and engineering managers evaluating design engineering candidates with strong systems thinking.
- **Tech Approach:** Next.js 16 with MDX, SignalframeUX component library exposed via interactive documentation pages (Storybook-like explorer embedded in the site), automated prop tables, live code editing.

### Direction 2: The Narrative Arc
- **Core Concept:** A portfolio structured as a linear narrative — a scrollable story that moves from problem discovery through design exploration to engineering execution. Each case study is a chapter. The homepage is a prologue that contextualizes the designer-engineer identity. Motion design reveals content in reading order.
- **Key Assumption:** A strong narrative structure creates more memorable impressions than a grid-based portfolio gallery.
- **Open Question:** Does a linear narrative structure conflict with the need for quick scanning by time-constrained hiring managers?
- **Target User:** Design-focused hiring managers and creative directors who value storytelling and process documentation.
- **Tech Approach:** Next.js 16 with scroll-driven animations, Server Components for content rendering, intersection observers for progressive content reveal, MDX chapters with embedded interactive elements.

### Direction 3: The Performance Statement
- **Core Concept:** A portfolio that makes performance itself the hero. Every interaction is accompanied by real-time performance metrics displayed as ambient UI elements. The site loads in under 500ms and shows you that it did. Core Web Vitals are a visible feature, not a hidden measurement. The design language draws from data visualization — clean, precise, information-dense.
- **Key Assumption:** Demonstrating engineering capability through visible performance metrics resonates with engineering-oriented hiring managers.
- **Open Question:** Does foregrounding metrics distract from the portfolio content itself, turning the site into a tech demo rather than a professional showcase?
- **Target User:** Engineering managers and CTOs evaluating candidates who bridge design and performance engineering.
- **Tech Approach:** Next.js 16 with Cache Components, real-time Performance Observer API integration, custom performance dashboard components, SignalframeUX data visualization tokens, server timing headers exposed in UI.

### Direction 4: The Dual Interface
- **Core Concept:** A portfolio with two parallel experiences: a polished visual interface for browsing (mouse/touch) and a terminal-style command interface for exploring (keyboard). The visual side showcases design craft; the command side showcases engineering craft. Both interfaces access the same content but through different interaction paradigms.
- **Key Assumption:** A dual-interface approach demonstrates versatility across audiences rather than diluting the experience for either.
- **Open Question:** Can two interface paradigms coexist without confusing users who accidentally trigger the wrong one?
- **Target User:** Hybrid roles — companies seeking candidates who can operate across design and engineering domains, comfortable in both Figma and the terminal.
- **Tech Approach:** Next.js 16 with cmdk command palette as the alternate interface, shared content API layer, keyboard-first navigation system, terminal UI components with SignalframeUX tokens, prefers-reduced-motion for motion-sensitive users.

### Direction 5: The Component Playground
- **Core Concept:** A portfolio centered on an interactive component playground where visitors can explore, configure, and copy SignalframeUX components. Case studies are organized around the components they produced. The playground is the portfolio — it demonstrates design engineering craft through the artifacts themselves rather than through descriptions of past work.
- **Key Assumption:** Interacting with actual components is more convincing evidence of design engineering skill than reading about past projects.
- **Open Question:** Does a component-centric structure work for hiring managers who evaluate based on product outcomes rather than component quality?
- **Target User:** Front-end engineering leads and design system architects evaluating candidates for component library and design system roles.
- **Tech Approach:** Next.js 16 with live component rendering, props editor with Zod schema reflection, theme switching, responsive viewport preview, code output panel, SignalframeUX as both the subject and the rendering framework.

### Direction 6: The Accessible-First Showcase
- **Core Concept:** A portfolio that treats accessibility as its defining design feature rather than a compliance layer. Focus indicators are beautiful. Skip links are prominent and intentional. Screen reader narratives for case studies are authored content, not afterthoughts. Motion respects prefers-reduced-motion with alternative static compositions that are equally compelling. The portfolio is a statement that accessible design is craft.
- **Key Assumption:** Accessibility as a visible design philosophy differentiates in a market where most portfolios fail basic WCAG checks.
- **Open Question:** Does leading with accessibility narrow the perceived scope of the candidate's skills to only accessibility work?
- **Target User:** Companies with strong accessibility culture (Apple, Microsoft, Gov tech, healthcare tech) and hiring managers who value inclusive design principles.
- **Tech Approach:** Next.js 16 with Server Components for HTML-first content, progressive enhancement patterns, SignalframeUX a11y primitives (focus rings, skip links, live regions), ARIA landmarks as structural design elements, no-JS fallback compositions.

## Recommend Checkpoint

REC artifact consumed: .planning/design/strategy/REC-recommendations-v1.md
Feasibility annotations applied to all 6 directions.

## Converge Phase

| Direction | Goal Alignment (0-3) | Feasibility (0-3) | Distinctiveness (0-3) | Total (/9) | Recommended |
|-----------|---------------------|-------------------|----------------------|------------|-------------|
| 1. The Living System | 2 | 3 | 2 | 7 | |
| 2. The Narrative Arc | 3 | 3 | 2 | 8 | * |
| 3. The Performance Statement | 2 | 2 | 3 | 7 | |
| 4. The Dual Interface | 2 | 2 | 3 | 7 | |
| 5. The Component Playground | 2 | 3 | 2 | 7 | |
| 6. The Accessible-First Showcase | 2 | 3 | 2 | 7 | |

### Scoring Rationale

**Direction 1: The Living System (7/9)**
- Goal Alignment (2): Supports the design system proof-of-work goal but deprioritizes case study showcase (core goal #1) and professional presence (goal #4). Documentation-first structure may not serve hiring managers' evaluation workflow.
- Feasibility (3): Straightforward with current stack. Context7 MCP and Playwright MCP directly support interactive documentation. SignalframeUX components are already built — exposing them is low-friction.
- Distinctiveness (2): Novel for a portfolio but documentation sites exist widely (Storybook, Docusaurus). The combination with case studies is the differentiation.
- Feasibility Note: High tool feasibility — Context7 MCP + Playwright MCP support interactive docs.

**Direction 2: The Narrative Arc (8/9)**
- Goal Alignment (3): Directly addresses core goal #1 (case study showcase with process narratives) and goal #5 (Awwwards-quality visual execution through motion-driven storytelling). The narrative structure naturally accommodates goals #2 (design system as proof), #3 (writing), and #4 (professional presence) as sections within the arc.
- Feasibility (3): Straightforward implementation with Next.js 16 Server Components, scroll-driven animations, and MDX. All required tools are available in the recommended stack.
- Distinctiveness (2): Narrative portfolios exist but few combine scroll-driven storytelling with design engineering depth. The combination of narrative structure + motion design + interactive demos within chapters creates differentiation.
- Feasibility Note: Standard stack, no specific MCP signal required beyond base recommendations.

**Direction 3: The Performance Statement (7/9)**
- Goal Alignment (2): Supports goal #5 (performance benchmark) but makes metrics the hero over content. Risks turning the portfolio into a tech demo rather than a professional showcase.
- Feasibility (2): Performance Observer API integration and real-time metrics display require significant custom work. Server timing headers in UI is novel but untested in portfolio context.
- Distinctiveness (3): No portfolio makes performance metrics a visible design element. Unique market position.
- Feasibility Note: Vercel CLI + Speed Insights support performance monitoring. High tool feasibility for measurement; custom UI work required.

**Direction 4: The Dual Interface (7/9)**
- Goal Alignment (2): The dual-interface demonstrates versatility but splits development effort across two UX paradigms. Supports goal #2 (engineering proof) but may dilute goal #1 (case study showcase) and goal #5 (visual quality).
- Feasibility (2): Building and maintaining two parallel interfaces doubles the UI surface area. The cmdk palette is feasible but a full terminal interface is significant work.
- Distinctiveness (3): No portfolio offers parallel visual + terminal interfaces. Clear market differentiation.
- Feasibility Note: No specific MCP for terminal UI components. Standard stack feasibility.

**Direction 5: The Component Playground (7/9)**
- Goal Alignment (2): Supports goal #2 (design system as proof-of-work) directly but subordinates case study narratives (goal #1) to component organization. May not serve hiring managers evaluating product design thinking.
- Feasibility (3): Straightforward with SignalframeUX as both subject and framework. Figma MCP supports component exploration. Zod schema reflection for prop editors is well-understood.
- Distinctiveness (2): Interactive component playgrounds exist (Storybook) but as a portfolio structure this is novel.
- Feasibility Note: Figma MCP + Context7 MCP support component exploration. High tool feasibility.

**Direction 6: The Accessible-First Showcase (7/9)**
- Goal Alignment (2): Supports the accessibility constraint from PROJECT.md (WCAG AA) but risks narrowing perceived scope to a11y specialist rather than generalist design engineer.
- Feasibility (3): SignalframeUX already provides a11y primitives. Implementation is additive rather than architectural. Axe a11y MCP validates claims directly.
- Distinctiveness (2): Accessibility-focused portfolios are rare, but the accessibility angle alone may not carry the full portfolio identity.
- Feasibility Note: Axe a11y MCP directly validates accessibility claims. High tool feasibility.

## Recommended Direction

**The Narrative Arc**

- **Rationale:** Scores highest (8/9) because it directly addresses the portfolio's core purpose: showcasing design engineering work through process narratives (Goal #1). The narrative structure naturally accommodates all five project goals — case studies as chapters, the design system demonstrated through the rendering of those chapters, writing integrated as narrative content, professional presence as the story's frame, and Awwwards-quality execution through motion-driven storytelling. Unlike directions that center on a specific technical capability (performance metrics, dual interfaces, component playgrounds), The Narrative Arc centers on the portfolio's actual job: telling the story of a design engineer's work.

- **Key Assumptions:**
  1. Hiring managers will engage with a narrative structure rather than demanding a scannable grid layout
  2. Scroll-driven animations can be performant enough to achieve sub-1s LCP
  3. The linear narrative won't prevent visitors from directly accessing specific case studies via navigation

- **Primary Risks:**
  1. **Narrative fatigue:** Long-scroll portfolios risk losing visitors who want quick answers — mitigate with chapter navigation / jump links
  2. **Performance cost of motion:** Scroll-driven animations can tank Core Web Vitals if not carefully implemented — mitigate with prefers-reduced-motion fallbacks and CSS-only animations where possible
  3. **Content dependency:** The narrative structure requires strong written content to work — weak writing undermines the entire direction

- **Feasibility Note:** Standard Next.js 16 stack with no unusual tooling requirements. All recommended MCPs from REC artifact support this direction.

## Brief Seed

> Auto-generated from recommended direction. Consumable by /pde:brief.

### Problem Statement
Design engineers lack a portfolio format that demonstrates the intersection of design craft and engineering capability. Traditional portfolios showcase screenshots; developer portfolios showcase code. Neither format captures the process-driven, systems-thinking nature of design engineering work. A narrative-driven portfolio built on a custom design system solves this by making the portfolio itself the proof-of-work.

### Product Type
Software — web application (static-first with dynamic sections)

### Platform
Web (responsive, mobile-first)

### Target Users
- **Design engineering hiring managers:** Evaluating candidates for roles that bridge design and engineering — need to see process narratives, technical decisions, and design system thinking. Pain: current portfolio formats force them to infer these skills from screenshots or GitHub repos.
- **Fellow design engineers:** Evaluating peer work and learning from process documentation — need to see how decisions were made, not just what was made. Pain: most portfolios hide the decision-making process.
- **Potential collaborators:** Studios, agencies, and companies seeking design engineering expertise — need to quickly assess craft quality and domain depth. Pain: can't distinguish design engineers from visual designers or front-end developers through typical portfolio formats.

### Scope Boundaries
**In scope:** Homepage narrative with professional identity framing, case study chapters with process narratives and interactive demos, blog/writing section with MDX, design system showcase page, about/bio, contact with availability indicator, dark/light theme, command palette, SEO with dynamic OG images, RSS feed, micro-interactions and motion design.

**Out of scope:** E-commerce or payment flows, user authentication, real-time collaboration features, CMS admin interface, analytics dashboard (use Vercel Analytics), full component documentation site (Direction 1 deferred), visible performance metrics UI (Direction 3 deferred), terminal interface (Direction 4 deferred).

### Constraints
| Constraint | Type | Impact |
|------------|------|--------|
| Lighthouse 100/100 across all categories | hard | Performance budget constrains animation complexity and asset weight |
| Sub-1s LCP on 4G connection | hard | Requires Server Components, optimized images, font subsetting |
| WCAG AA minimum, keyboard-navigable | hard | All interactive elements must be accessible; motion must respect prefers-reduced-motion |
| < 200KB initial load (excluding images) | hard | Limits JS bundle size; favors Server Components over Client Components |
| Dark mode primary, light mode available | soft | Design system tokens must support both themes from the start |
| Mobile-first responsive | hard | All layouts must work on 320px+ viewports before scaling up |
| No JavaScript required for core content | soft | Progressive enhancement: content works without JS, interactions enhance with JS |

### Key Decisions
| Decision | Rationale | Provenance |
|----------|-----------|------------|
| The Narrative Arc direction | Highest converge score (8/9); directly addresses core goal of case study showcase while naturally accommodating all five project goals; centers the portfolio's actual job (telling the design engineering story) rather than a specific technical capability | ideation-recommended |
| Scroll-driven narrative structure | Creates memorable first impression aligned with Awwwards standards; motion design reveals content in meaning order (hero → context → evidence → CTA) | ideation-diverge |
| SignalframeUX as rendering framework | The portfolio itself demonstrates the design system, making it both showcase and proof-of-work | PROJECT.md relationship |

### Risk Register
| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Narrative fatigue (visitors abandon long scroll) | H | M | Chapter navigation with jump links; above-fold hook that communicates value in 3 seconds |
| Performance cost of scroll-driven motion | H | M | CSS-only animations where possible; prefers-reduced-motion fallbacks; performance budget per animation |
| Content dependency (weak writing undermines narrative) | M | M | MDX templates with structured sections; write case studies before building interactive demos |
| SignalframeUX maturity gap | M | L | Portfolio development validates and feeds back into the design system; build missing components as needed |

### Next Steps
- Run /pde:brief to generate full design brief from this seed
- Validate narrative structure assumption with 3-5 hiring manager interviews (addresses open question about scanning vs. narrative)
- Prototype scroll-driven animation performance on mobile devices to validate sub-1s LCP assumption
