---
Generated: "2026-03-31"
Skill: /pde:opportunity (OPP)
Version: v1
Status: draft
Scope: "4 candidates"
Data Currency: "Opportunity scoring based on competitive analysis estimates as of 2026-03-31. Re-score as data improves."
Enhanced By: "none"
---

# Opportunity Evaluation: Portfolio (Product Design Engineer)

## Evaluation Candidates

Pre-populated from `/pde:competitive` gap analysis (CMP-competitive-v1.md, 4 candidates).

| # | Candidate | Source | Description |
|---|-----------|--------|-------------|
| 1 | Design System Playground | Gap analysis — no competitor demonstrates design system ownership through live interaction | Interactive component explorer; 100% of hiring manager visitors + design system community |
| 2 | Performance + Visual Quality Dual Achievement | Feature matrix — Framer/Webflow sacrifice performance; Custom Next.js sacrifices visuals | Every visitor experiences directly within 3 seconds (LCP, CLS, visual authority) |
| 3 | Accessibility-Forward Design | Porter's analysis + gap analysis — no competitor makes a11y visible as design quality | All visitors; specifically signals to a11y-conscious hiring managers at major tech companies |
| 4 | MDX Case Studies with Interactive Demos | Feature matrix — only Custom Next.js supports this, rarely with design quality | Primary audience (hiring managers) evaluate case study depth as top hiring signal |

## Scoring Table

| Rank | Candidate | Reach | Impact | Conf | Effort | UX Diff | A11y | DS Lev | RICE Base | Design Bonus | Final Score |
|------|-----------|-------|--------|------|--------|---------|------|--------|-----------|-------------|-------------|
| 1 | Accessibility-Forward Design | 10000 | 2 | 0.8 | S (1mo) | 2 | 3 | 2 | 16000 | 2.3 | 19680 |
| 2 | Performance + Visual Quality | 10000 | 2 | 0.8 | M (2mo) | 2 | 1 | 2 | 8000 | 1.7 | 9360 |
| 3 | Design System Playground | 5000 | 3 | 0.8 | M (2mo) | 3 | 1 | 3 | 6000 | 2.4 | 7440 |
| 4 | MDX Case Studies + Demos | 5000 | 3 | 0.8 | L (4mo) | 2 | 1 | 1 | 3000 | 1.5 | 3450 |

## Per-Item Breakdowns

### 1. Accessibility-Forward Design (Score: 19680)

**RICE Breakdown:**
- **Reach:** 10000 — affects every visitor. Accessibility quality is perceived by all users through focus indicators, skip links, motion preferences, and screen reader support.
- **Impact:** 2 (High) — meaningfully improves the experience. Makes accessibility visible as design quality rather than compliance afterthought.
- **Confidence:** 0.8 (Medium) — strong evidence from competitive gap analysis (no competitor does this well) but unproven in portfolio context.
- **Effort:** S (1 month / 0.5 PM equivalent) — leverages SignalframeUX components with built-in a11y. Primarily configuration and refinement, not new development.

**Design Extension Breakdown:**
- **UX Differentiation:** 2 (Strong) — meaningfully better than competitors who treat a11y as checkbox compliance.
- **Accessibility Impact:** 3 (Critical) — removes barriers for keyboard-only and screen reader users across the entire portfolio.
- **Design System Leverage:** 2 (Moderate) — uses existing SignalframeUX a11y primitives, adds 1-2 reusable focus/skip-link patterns.

**Key Considerations:** Highest score due to combination of universal reach and low effort. The design system already provides a11y foundations — this opportunity is about making them visible and intentional rather than hidden.

---

### 2. Performance + Visual Quality Dual Achievement (Score: 9360)

**RICE Breakdown:**
- **Reach:** 10000 — every visitor experiences page load speed and visual quality within the first 3 seconds.
- **Impact:** 2 (High) — sub-1s LCP with Awwwards-quality visuals directly determines whether hiring managers scroll or bounce.
- **Confidence:** 0.8 (Medium) — Next.js 16 + SignalframeUX architecture supports this, but Lighthouse 100/100 with rich visuals requires careful optimization.
- **Effort:** M (2 months) — image optimization pipeline, font loading strategy, critical CSS extraction, Cache Components integration, motion performance budgeting.

**Design Extension Breakdown:**
- **UX Differentiation:** 2 (Strong) — fills the gap that no competitor reliably bridges (performance OR visual quality, rarely both).
- **Accessibility Impact:** 1 (Moderate) — fast loading benefits users on slow connections and assistive technology.
- **Design System Leverage:** 2 (Moderate) — SignalframeUX components are pre-optimized; this validates the system's performance characteristics.

**Key Considerations:** Technical foundation for all other opportunities. Performance optimization is infrastructure work that benefits every page and interaction.

---

### 3. Design System Playground (Score: 7440)

**RICE Breakdown:**
- **Reach:** 5000 — primarily hiring managers and design system community members. Not every visitor will explore the playground.
- **Impact:** 3 (Massive) — transforms the portfolio from a showcase to proof-of-work. Visitors interact with the actual design system rather than viewing screenshots.
- **Confidence:** 0.8 (Medium) — novel concept with strong differentiation thesis but unproven user engagement pattern.
- **Effort:** M (2 months) — interactive component explorer, props editor, theme switcher, code output, responsive preview.

**Design Extension Breakdown:**
- **UX Differentiation:** 3 (Breakthrough) — no competitor portfolio offers this. Novel interaction pattern for the portfolio space.
- **Accessibility Impact:** 1 (Moderate) — playground itself must be accessible; demonstrates a11y support in components.
- **Design System Leverage:** 3 (High) — creates the highest-leverage reusable component (the explorer) and validates every component in the system.

**Key Considerations:** Highest design bonus (2.4) of all candidates. The playground is the single most differentiated feature — it makes the portfolio impossible to replicate with any builder platform.

---

### 4. MDX Case Studies with Interactive Demos (Score: 3450)

**RICE Breakdown:**
- **Reach:** 5000 — hiring managers who read case studies deeply. This is the primary evaluation content for design engineering roles.
- **Impact:** 3 (Massive) — deep case studies with interactive demos are the strongest signal hiring managers can evaluate.
- **Confidence:** 0.8 (Medium) — MDX + custom React components is a proven pattern (leerob.io, joshwcomeau.com) but requires significant content authoring.
- **Effort:** L (4 months) — MDX infrastructure, custom components per case study, interactive demos, before/after comparisons, process narrative templates.

**Design Extension Breakdown:**
- **UX Differentiation:** 2 (Strong) — meaningfully better than competitor case study formats (static images on builders, minimal interactivity on custom builds).
- **Accessibility Impact:** 1 (Moderate) — interactive demos must be keyboard-navigable and screen-reader compatible.
- **Design System Leverage:** 1 (Low) — each case study has unique custom components; limited reusability across studies.

**Key Considerations:** Lowest score due to high effort (L), but this is the most important content for the portfolio's primary purpose. Consider phasing: build MDX infrastructure first (Now), add interactive demos incrementally per case study (Next).

## Narrative Analysis

### Top Recommendations

1. **Accessibility-Forward Design** leads by a wide margin (19680 vs 9360 for #2) due to the combination of universal reach and minimal effort. This should be the first investment — it sets the tone for the entire portfolio and leverages existing SignalframeUX foundations.

2. **Performance + Visual Quality** is the technical foundation. Without sub-1s LCP and visual authority, none of the other features matter because visitors won't stay to see them.

3. **Design System Playground** has the highest design differentiation score (2.4 design bonus) and represents the portfolio's unique competitive moat. It's the feature that makes this portfolio fundamentally different from every competitor.

### Surprising Findings

- **Accessibility scores highest overall** — this is often deprioritized in portfolio projects but emerges as the clear winner when reach (everyone benefits) and effort (design system already provides foundations) are properly weighted.
- **MDX Case Studies score lowest** despite being the most important content for hiring decisions. The L-size effort estimate penalizes it heavily. The recommendation is to phase the investment rather than defer it entirely.

### Risk Flags

- All items scored at 0.8 confidence — there's no validated user data for portfolio visitor behavior. Re-score after launch with analytics data.
- The Design System Playground's impact score (3) is aspirational — validate with 5 hiring manager interviews before committing full build effort.
- MDX Case Studies content authoring time is the real bottleneck, not infrastructure. Account for writing time in effort estimates.

## Score Distribution

```svg
<svg viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="500" height="300" fill="#fafafa"/>

  <!-- Title -->
  <text x="250" y="25" text-anchor="middle" font-size="14" font-weight="bold">Opportunity Score Distribution</text>

  <!-- Y-axis -->
  <line x1="120" y1="40" x2="120" y2="260" stroke="#333" stroke-width="1"/>

  <!-- Bars (bar_height = (score / 19680) * 220) -->

  <!-- Bar 1: Accessibility -->
  <rect x="140" y="40" width="70" height="220" fill="#2563eb" opacity="0.9" rx="4"/>
  <text x="175" y="275" text-anchor="middle" font-size="9">A11y</text>
  <text x="175" y="35" text-anchor="middle" font-size="9" font-weight="bold">19680</text>

  <!-- Bar 2: Performance -->
  <rect x="225" y="155" width="70" height="105" fill="#3b82f6" opacity="0.8" rx="4"/>
  <text x="260" y="275" text-anchor="middle" font-size="9">Perf+Visual</text>
  <text x="260" y="150" text-anchor="middle" font-size="9" font-weight="bold">9360</text>

  <!-- Bar 3: Playground -->
  <rect x="310" y="177" width="70" height="83" fill="#60a5fa" opacity="0.7" rx="4"/>
  <text x="345" y="275" text-anchor="middle" font-size="9">Playground</text>
  <text x="345" y="172" text-anchor="middle" font-size="9" font-weight="bold">7440</text>

  <!-- Bar 4: MDX -->
  <rect x="395" y="221" width="70" height="39" fill="#93c5fd" opacity="0.6" rx="4"/>
  <text x="430" y="275" text-anchor="middle" font-size="9">MDX Cases</text>
  <text x="430" y="216" text-anchor="middle" font-size="9" font-weight="bold">3450</text>
</svg>
```

## Now / Next / Later Buckets

**Bucket criteria:**
- Now: Score in top 30% AND Effort <= M AND no unresolved blockers
- Next: Score in top 60% OR depends on Now items
- Later: Remaining items AND fragile items from sensitivity analysis; re-evaluate quarterly

### Now

| Candidate | Score | Effort | Rationale |
|-----------|-------|--------|-----------|
| Accessibility-Forward Design | 19680 | S (1mo) | Highest score, lowest effort, leverages existing SignalframeUX a11y foundations |
| Design System Playground | 7440 | M (2mo) | Highest design differentiation (2.4 bonus), unique competitive moat |

### Next

| Candidate | Score | Effort | Rationale |
|-----------|-------|--------|-----------|
| Performance + Visual Quality | 9360 | M (2mo) | Technical foundation for all features; benefits every page. Start infrastructure work in parallel with Now items. |

### Later

| Candidate | Score | Effort | Rationale |
|-----------|-------|--------|-----------|
| MDX Case Studies + Demos | 3450 | L (4mo) | Highest effort, lowest score. Phase approach: build MDX infrastructure with Now items, add interactive demos incrementally. Content authoring is the real constraint. |

## Scenario Models

### Scenario 1: Optimistic (Confidence +0.2, capped at 1.0)

| Candidate | Original Score | Adjusted Score | Rank Change |
|-----------|---------------|----------------|-------------|
| Accessibility-Forward Design | 19680 | 24600 | -- |
| Performance + Visual Quality | 9360 | 11700 | -- |
| Design System Playground | 7440 | 9300 | -- |
| MDX Case Studies + Demos | 3450 | 4313 | -- |

**Finding:** All ranks stable. Higher confidence doesn't change relative ordering — the gap between items is large enough to absorb uniform confidence increases. This confirms the ranking is not sensitive to confidence uncertainty.

### Scenario 2: Pessimistic (Confidence -0.2, floor 0.3)

| Candidate | Original Score | Adjusted Score | Rank Change |
|-----------|---------------|----------------|-------------|
| Accessibility-Forward Design | 19680 | 14760 | -- |
| Performance + Visual Quality | 9360 | 7020 | -- |
| Design System Playground | 7440 | 5580 | -- |
| MDX Case Studies + Demos | 3450 | 2588 | -- |

**Finding:** Rankings unchanged under pessimistic conditions. Score gaps are proportional, so confidence reduction preserves ordering. No items are fragile.

### Scenario 3: Effort Doubled

| Candidate | Original Score | Adjusted Score | Rank Change |
|-----------|---------------|----------------|-------------|
| Accessibility-Forward Design | 19680 | 9840 | -- |
| Performance + Visual Quality | 9360 | 4680 | -- |
| Design System Playground | 7440 | 3720 | +1 |
| MDX Case Studies + Demos | 3450 | 1725 | -1 |

**Finding:** Only minor rank shift between positions 3 and 4 when effort doubles. Design System Playground overtakes MDX Case Studies because MDX's L-size baseline effort is more punitive when doubled (8mo vs 4mo). All items remain **robust** — no rank drops >= 2 under any scenario.

## Assumptions and Caveats

1. **Reach estimates are approximations.** "10000" for universal features assumes ~10K quarterly visitors based on typical design engineer portfolio traffic. Actual reach depends on SEO, social sharing, and community engagement. Track with Vercel Analytics post-launch.

2. **Impact scores reflect hiring manager value.** Impact is calibrated to "how much does this influence a hiring decision" rather than general user satisfaction. A portfolio's primary job is to get interviews.

3. **Effort estimates exclude content authoring.** Technical implementation effort is estimated; writing case study narratives, creating interactive demos, and producing design system documentation are separate efforts not captured in RICE.

4. **Confidence is uniformly 0.8.** No candidate has validated user data. All estimates are based on competitive analysis, market research, and design engineering expertise. Re-score with analytics data after 3 months.

5. **Design system maturity assumed.** Scores assume SignalframeUX provides the component and token foundation described in PROJECT.md. If the design system is less mature than expected, effort estimates increase across all candidates.

## Version History

| Version | Date | Changes | Candidates |
|---------|------|---------|------------|
| v1 | 2026-03-31 | Initial RICE scoring from competitive gap analysis | 4 |

---

*Generated by PDE-OS /pde:opportunity | 2026-03-31 | 4 candidates scored*
