---
Generated: "2026-03-31"
Skill: /pde:handoff (HND)
Version: v1
Status: complete
Enhanced By: "none"
---

# Implementation Handoff: SignalframeUX Portfolio

## 1. Executive Summary

SignalframeUX is a narrative-driven design engineering portfolio that uses its own construction as proof-of-work. The site demonstrates design system architecture, component engineering, performance optimization, and accessible interaction design through 5 screens: Homepage, Case Study, Design System, About, and Contact.

**Key design decisions locked during the pipeline:**

- Dark mode primary with light mode toggle, using OKLCH color space (hue 298, violet/purple) for perceptual uniformity
- Augmented Fourth type scale (ratio 1.414) with Inter variable font (wght axis 100-900)
- Scroll-driven narrative arc on the homepage mapping directly to Journey 1 (First Impression & Evaluation)
- Progressive enhancement: core content renders without JavaScript via Server Components; GSAP and command palette enhance interactively
- WCAG 2.2 AA compliance with 91/100 HIG audit score (4 major, 6 minor, 5 nit findings to address)

**Implementation priorities:** Design system tokens first, shared components second, page shells third, screen content fourth, animations fifth, polish last.

---

## 2. Architecture Overview

### Recommended Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 16 (App Router) | React Server Components for sub-1s LCP; Cache Components for static-first architecture |
| Language | TypeScript | Type safety for component APIs, MDX content types, design token types |
| Styling | Tailwind CSS + CSS custom properties | Utility classes for rapid iteration; tokens consumed via `var()` from `tokens.css` |
| Content | MDX | Case studies and blog posts authored in MDX with embedded interactive components |
| Animation | GSAP 3.14 + CSS `animation-timeline` | Entrance choreography via GSAP; scroll-driven reveals via native CSS with GSAP fallback |
| Deployment | Vercel | Edge runtime, ISR, Vercel Analytics, `@vercel/og` for dynamic OG images |
| Font | Inter (variable, self-hosted) | `font-display: swap` with `size-adjust` fallback to prevent CLS |
| Navigation | cmdk | Command palette (Cmd+K / Ctrl+K) as keyboard-first navigation enhancement |

### Project Structure

```
src/
  app/
    layout.tsx          — Root layout: tokens.css import, Inter font, theme provider, skip link
    page.tsx            — Homepage (Server Component)
    work/
      [slug]/page.tsx   — Case study chapters (Server Component + MDX)
    system/page.tsx     — Design system showcase (Server + Client Components)
    about/page.tsx      — About page (Server Component)
    contact/page.tsx    — Contact page (Server Component)
  components/
    shared/
      Header.tsx        — Sticky header with nav, command palette trigger, theme toggle
      Footer.tsx        — Footer with nav links, social links, copyright
      SkipLink.tsx      — Skip-to-main-content link
      ThemeToggle.tsx   — Dark/light toggle with aria-pressed
      CommandPalette.tsx — cmdk overlay (Client Component)
      ScrollToTop.tsx   — Fixed scroll-to-top button (Client Component)
      MobileMenu.tsx    — Hamburger-triggered mobile navigation panel (Client Component)
    homepage/
      Hero.tsx          — Hero section with eyebrow, title, subtitle, CTAs, scroll prompt
      NarrativeSection.tsx — Reusable narrative arc section (Problem, Exploration, Evidence)
      CaseStudyCard.tsx — Case study preview card with thumbnail, tags, description
      ProfessionalBlock.tsx — Skills, tools, availability blocks
    case-study/
      ProgressRibbon.tsx — Scroll-driven progress indicator (Client Component)
      ChapterNav.tsx    — Previous/Next chapter navigation
      InteractiveDemo.tsx — Embedded component demo with noscript fallback
      BeforeAfter.tsx   — Before/after comparison component
    design-system/
      Sidebar.tsx       — Navigation sidebar with scrollspy (Client Component)
      TokenCard.tsx     — Token display card (color swatch, type sample, spacing, motion)
      ComponentCard.tsx — Interactive component preview with code toggle
      VariationPill.tsx — Toggle pill for component variants
    about/
      IdentitySection.tsx — Portrait + bio + role statement
      Timeline.tsx      — Professional timeline with sequential dot illumination
      SkillsMatrix.tsx  — ARIA table with skill dots (Client Component)
    contact/
      ContactMethod.tsx — Contact method card (email, LinkedIn, GitHub, X)
      AvailabilityDot.tsx — Heartbeat-animated availability indicator
  styles/
    tokens.css          — Design tokens (copy from .planning/design/assets/tokens.css)
    globals.css         — Global resets, semantic aliases, reduced-motion guards
  lib/
    theme.ts            — Theme provider logic, localStorage persistence
    mdx.ts              — MDX compilation and component mapping
```

### Deployment Strategy

- **Static generation** for Homepage, About, Contact, Design System
- **ISR** for Case Study pages (revalidate on MDX content change)
- **Edge middleware** for theme cookie detection (prevent flash of wrong theme)
- **Dynamic OG images** via `@vercel/og` (Satori) for each page

---

## 3. Component Inventory

### Shared Components (used across all 5 screens)

| Component | Props/Variants | States | A11y | Token Dependencies | Screens |
|-----------|---------------|--------|------|--------------------|---------|
| `Header` | `currentPage: string` | default, mobile-open | `role="banner"`, `aria-label="Primary navigation"`, `aria-current="page"` on active link, `aria-expanded` on mobile toggle | `--color-bg` (85% opacity), `--spacing-4`, `--border-width-thin`, `--hifi-border-subtle`, `backdrop-filter: blur(16px)` | All 5 |
| `Footer` | -- | default | `role="contentinfo"`, footer nav links need `:focus-visible` | `--color-surface`, `--border-width-thin`, `--spacing-semantic-section` | All 5 |
| `SkipLink` | -- | hidden, focused | Skip link as first focusable element, targets `#main` | `--color-accent`, `--color-focus-ring`, `--border-radius-sm` | All 5 |
| `ThemeToggle` | -- | dark (pressed), light (unpressed) | `aria-pressed`, dynamic `aria-label` ("Switch to light/dark theme") | `--hifi-border`, `--hifi-surface`, `--motion-duration-fast` | All 5 |
| `CommandPalette` | -- | closed, open, searching, no-results | `aria-label`, keyboard trap when open, Escape to close | `--hifi-surface-raised`, `--shadow-xl`, `--border-radius-lg` | All 5 |
| `MobileMenu` | -- | closed, open | `aria-expanded`, `aria-controls` linked to panel ID | `--hifi-surface`, `--shadow-lg` | All 5 |
| `ScrollToTop` | -- | hidden, visible, hover, focus | `aria-label="Scroll to top"`, `:focus-visible` outline | `--hifi-surface`, `--hifi-border`, `--border-radius-full` | Homepage, Case Study, Design System, About |
| `NavLink` | `href: string`, `label: string`, `current: boolean` | default, hover, focus, active, current | `aria-current="page"` when current | `--hifi-text-secondary`, `--hifi-accent`, font-variation-settings `wght` 400/600/700 | All 5 |
| `BtnIcon` | `icon: ReactNode`, `label: string` | default, hover, focus, active, loading, disabled | `aria-label`, `aria-busy`, `aria-disabled` | `--hifi-surface`, `--hifi-border`, `--motion-easing-spring` | All 5 |
| `BtnPrimary` | `children`, `href?: string` | default, hover, focus, active, loading, disabled, error | `aria-busy`, `aria-disabled`, `aria-invalid` | `--hifi-accent`, `--color-focus-ring`, `--shadow-md`/`--shadow-lg`, spring easing | Homepage, Case Study, Contact |
| `BtnSecondary` | `children`, `href?: string` | default, hover, focus, active, loading, disabled | `aria-busy`, `aria-disabled` | `--hifi-border`, `--hifi-text-secondary`, `--hifi-accent` | Homepage, Case Study |
| `Tag` | `label: string` | default, parent-hover | -- (decorative within card link) | `--hifi-mono`, `--hifi-border`, `--border-radius-full`, `--typography-fontSize-xs` | Homepage, Case Study |
| `SectionEyebrow` | `text: string` | default | -- | `--hifi-mono`, `--hifi-accent`, `--typography-letterSpacing-widest` | Homepage, Case Study, Design System |
| `SectionHeading` | `children` | default | Semantic heading level (h2/h3) | `--typography-fontSize-2xl`, `--typography-lineHeight-tight`, `--typography-letterSpacing-tight` | All 5 |

### Homepage-Specific Components

| Component | Props/Variants | States | A11y | Token Dependencies |
|-----------|---------------|--------|------|--------------------|
| `Hero` | -- | default, loading, error, empty | Landmark section, `aria-labelledby` | `--typography-fontSize-4xl` (clamped), `--typography-lineHeight-tight`, gradient accent text |
| `HeroTitle` | `children` | default | `<h1>`, max-width 14ch | `--typography-fontSize-4xl`, gradient: `--hifi-accent` to `--color-primary-300` |
| `ScrollPrompt` | -- | default, reduced-motion | `aria-hidden="true"` (decorative) | bounce-down animation, `--hifi-text-muted`, `--border-radius-full` |
| `NarrativeSection` | `eyebrow`, `heading`, `body`, `visual?` | default | `aria-labelledby` | `--spacing-semantic-section`, section visual gradient |
| `CaseStudyCard` | `chapter`, `title`, `description`, `tags[]`, `href`, `thumbnail` | default, hover, focus, active, loading, disabled, error | Full-card link with `:focus-visible` | `--hifi-surface`, `--border-radius-lg`, `--shadow-lg` on hover, spring translateY(-4px) |
| `ProfessionalBlock` | `title`, `variant: "default" | "availability"` | default, hover | Section landmark | `--hifi-surface`, accent border for availability variant |
| `AvailabilityIndicator` | `status: "available" | "booked" | "selective"` | default, reduced-motion | `role="status"`, `aria-live="polite"` | `--color-success-400`, heartbeat animation |
| `ContactCTA` | -- | default | Landmark section | `--hifi-accent`, `--border-radius-md` |

### Case Study-Specific Components

| Component | Props/Variants | States | A11y | Token Dependencies |
|-----------|---------------|--------|------|--------------------|
| `ProgressRibbon` | -- | scrolling | `aria-hidden="true"` (decorative) | `--hifi-accent` to `--color-primary-300` gradient, 3px height, z-index 200. **Must use `transform: scaleX()` instead of `width` for GPU compositing** |
| `HeroImage` | `src`, `alt` | default, loading | `<img alt="...">` (descriptive) or `alt=""` if decorative | `--border-radius-lg`, aspect-ratio 21/9 |
| `ChapterSection` | `eyebrow`, `heading`, `body`, `children` | default | `aria-labelledby` | `--spacing-semantic-section` |
| `InteractiveDemo` | `component`, `fallback` | interactive, static-fallback, error | `<noscript>` fallback, error boundary | `--hifi-surface-raised`, `--border-radius-lg` |
| `BeforeAfter` | `before`, `after`, `label` | default | `role="region"`, `aria-label` | `--hifi-surface`, `--border-radius-md` |
| `MetricCard` | `value`, `label`, `description` | default | -- | `--typography-fontSize-2xl`, `--hifi-accent` for value |
| `ChapterNav` | `prev?`, `next?` | default, hover, focus | `aria-label="Chapter navigation"` | `--hifi-border-subtle`, `--hifi-accent` |

### Design System-Specific Components

| Component | Props/Variants | States | A11y | Token Dependencies |
|-----------|---------------|--------|------|--------------------|
| `DSSidebar` | `sections[]`, `activeSection` | default, scrollspy-active | `role="complementary"`, `aria-label="Design system navigation"`, `aria-current="true"` on active | `--hifi-surface`, `--hifi-accent-subtle` |
| `DSColorSwatch` | `color`, `name`, `value` | default, hover, focus | **Must add `role="button" tabindex="0"` and keydown handler OR remove interactive affordance** | `--border-radius-sm`, token pulse animation on hover |
| `DSTypeSample` | `size`, `label`, `weight` | default | -- | All typography tokens |
| `DSSpacingBar` | `value`, `label` | default | -- | `--hifi-accent`, all spacing tokens |
| `DSMotionCard` | `name`, `duration`, `easing` | default, hover | -- | **Preview bar must use `transform: scaleX()` not `width`** |
| `DSComponentCard` | `name`, `preview`, `code?` | default, code-visible, code-hidden | `aria-expanded` on code toggle, `aria-controls` linked to code block | `--hifi-surface`, `--border-radius-lg` |
| `DSPill` | `label`, `active: boolean` | default, active, hover, focus | `aria-pressed` for toggle state | `--hifi-accent`, `--border-radius-full` |

### About-Specific Components

| Component | Props/Variants | States | A11y | Token Dependencies |
|-----------|---------------|--------|------|--------------------|
| `IdentitySection` | `portrait`, `name`, `role`, `bio` | default | Portrait placeholder: 280x280 desktop, 200x200 mobile | `--typography-fontSize-3xl`, `--hifi-accent` |
| `Timeline` | `items[]` | default, animated | `aria-label="Professional timeline"` | Sequential dot illumination animation, `--hifi-accent`, `--spacing-semantic-stack` |
| `TimelineItem` | `year`, `title`, `description`, `type` | default, illuminated | -- | `--hifi-border-subtle`, `--color-success-400` for dot |
| `SkillsMatrix` | `categories[]`, `skills[]` | default | `role="table"` with `role="row"` wrappers, `role="columnheader"`, `role="rowheader"`, `role="cell"`. **Skill dots need `aria-label` with numeric values (e.g., "4 out of 5")** | `--hifi-accent`, `--color-primary-400` for dots |
| `SocialLinks` | `links[]` | default, hover, focus | `target="_blank"` + `rel="noopener noreferrer"`, `aria-label` with "(opens in new tab)" | `--hifi-border`, 40x40px touch targets |

### Contact-Specific Components

| Component | Props/Variants | States | A11y | Token Dependencies |
|-----------|---------------|--------|------|--------------------|
| `ContactMethod` | `type: "email" | "linkedin" | "github" | "x"`, `href`, `label`, `description`, `primary?: boolean` | default, hover, focus | Full-card link, `:focus-visible` outline | `--hifi-surface`, `--border-radius-lg`, accent border for `.contact-method--primary` (email) |
| `AvailabilityDot` | `status` | default, reduced-motion | `role="status"`, `aria-live="polite"` | `--color-success-400`, heartbeat animation `1.8s ease-in-out infinite` |
| `ContactCTASection` | `heading`, `body`, `responseTime` | default | Section landmark | `--hifi-accent`, `--border-radius-md` |

---

## 4. Screen Specifications

### 4.1 Homepage

**Route:** `/` (Server Component)
**Layout:** Single-column, narrative scroll, max-width 1280px container
**Content sections (scroll order):** Hero > Problem > Exploration > Evidence (Case Study Cards) > Professional > Contact CTA

**Layout structure:**
- Hero: centered flex column, min-height 85vh, `gap: 24px`
- Narrative sections: `padding: var(--spacing-semantic-section)` (64px) vertical, max-width 720px body text
- Case study grid: single column (mobile), 2-column at 1024px+ (`grid-template-columns: repeat(2, 1fr)`)
- Professional grid: single column (mobile), 3-column at 1024px+ for skills/tools/availability
- Contact CTA: centered text, full-width accent background

**Responsive behavior:**
- < 640px: nav-list hidden, mobile-menu-toggle visible, hero title clamp minimum 2.5rem, single-column cards
- 640px+: 2-column case study cards
- 1024px+: 3-column professional grid, full desktop nav
- 1280px+: max-width container centered with 32px gutter

**Animation requirements:**
- GSAP entrance choreography on load: eyebrow (0ms) > title (120ms) > subtitle (240ms) > CTAs (360ms) > scroll prompt (480ms)
- Scroll-driven reveals on narrative sections using CSS `animation-timeline: view()` with GSAP ScrollTrigger fallback
- Spring physics (`cubic-bezier(0.34, 1.56, 0.64, 1)`) on button hovers and card hovers
- Bounce-down animation on scroll arrow (2s infinite, disabled in reduced-motion)
- Magnetic CTA effect: subtle cursor-proximity transform on hero buttons

**Data requirements:** Static content; case study cards sourced from MDX frontmatter

### 4.2 Case Study

**Route:** `/work/[slug]` (Server Component with Client Component interactive demos)
**Layout:** Single-column content, max-width 960px, centered

**Content sections:** Progress Ribbon > Hero Image > Prologue > Exploration > Interactive Demo > Engineering > Outcomes > Chapter Navigation

**Layout structure:**
- Progress ribbon: fixed, top 0, full-width, 3px height, z-index 200
- Main content: `max-width: 960px`, `padding: var(--spacing-semantic-page)` (80px) top/bottom
- Chapter sections: `gap: var(--spacing-semantic-section)` (64px) between sections
- Metric cards: 2-column grid at 640px+, 3-column at 1024px+
- Chapter nav: two-column flex (previous/next) at bottom

**Responsive behavior:**
- < 640px: hero image aspect-ratio 16/9 (instead of 21/9), metric cards stack to single column
- 768px+: side-by-side metric cards
- 1024px+: full 21/9 hero, 3-column metrics

**Animation requirements:**
- Progress ribbon fills on scroll (use `transform: scaleX()` + `transform-origin: left`, not `width`)
- GSAP entrance: chapter section reveal with 700ms duration, `opacity: 0; translateY: 30px` start
- Stagger: 120ms between section elements within each chapter

**Data requirements:** MDX content with frontmatter (title, slug, chapter, tags, thumbnail, metrics, prev/next)

### 4.3 Design System

**Route:** `/system` (Server Component + Client Components for interactive previews)
**Layout:** Two-column with sidebar at 768px+, single-column below

**Layout structure:**
- Sidebar: fixed 240px width at 768px+, collapses to horizontal scroll below
- Main content: `max-width: 960px` within remaining space
- Token sections: grid layouts per category (color: 6-column swatch grid, type: stacked samples, spacing: horizontal bars, motion: card grid)
- Component section: single card per component with variant pills and code toggle

**Responsive behavior:**
- < 768px: sidebar collapses to horizontal scrollable pills, main content full-width
- 768px+: sidebar visible with scrollspy tracking
- 1024px+: wider gutter, comfortable sidebar/main split

**Animation requirements:**
- Token pulse: 600ms scale + opacity animation on token swatch hover
- GSAP entrance reveals for each section
- Variable font weight transition on sidebar links (400 > 500 on active)

**Data requirements:** Token values from `SYS-tokens.json`, component previews rendered from actual SignalframeUX components

**State management:** Sidebar scrollspy via IntersectionObserver (Client Component), variant pill toggles, code disclosure toggles

### 4.4 About

**Route:** `/about` (Server Component)
**Layout:** Single-column, max-width 960px, centered, stacked sections with 64px gap

**Content sections:** Identity > Timeline > Skills Matrix > Philosophy > Social Links

**Layout structure:**
- Identity: 2-column grid (portrait left 280x280, bio right) at 768px+, stacked below
- Timeline: vertical list with connected dots, alternating content alignment optional
- Skills matrix: ARIA table grid with category rows and skill-level dot indicators
- Philosophy: prose section, max-width 72ch
- Social links: flex row of icon links (40x40px)

**Responsive behavior:**
- < 640px: portrait 200x200, stacked above bio; timeline dots inline
- 768px+: side-by-side identity; timeline with left border
- 1024px+: full desktop proportions

**Animation requirements:**
- Timeline trace: sequential dot illumination on scroll (GSAP ScrollTrigger with stagger)
- GSAP entrance reveals per section
- Availability dot pulse (2s infinite, disabled in reduced-motion)

**Data requirements:** Static content; skills matrix categories and levels; timeline items

### 4.5 Contact

**Route:** `/contact` (Server Component)
**Layout:** Single-column, max-width 640px, centered vertically and horizontally

**Content sections:** Heading + Subtitle > Contact Methods Grid > CTA Section

**Layout structure:**
- Centered text heading with subtitle
- Contact methods: 2-column grid at 640px+, single column below
- Email method: `.contact-method--primary` with accent border, visually emphasized
- CTA section: centered text with availability status and response time
- Social links in footer

**Responsive behavior:**
- < 640px: single-column contact methods, stacked
- 640px+: 2-column grid

**Animation requirements:**
- Availability heartbeat: `scale(1) > scale(1.3) > scale(1)` at 1.8s infinite (disabled in reduced-motion)
- GSAP entrance: heading > subtitle > methods (stagger 120ms) > CTA

**Data requirements:** Static contact information; availability status (could be a CMS field for easy updates)

---

## 5. Design Token Integration

### Consuming tokens.css

Import `tokens.css` at the root layout level. All components consume tokens via CSS custom properties:

```tsx
// app/layout.tsx
import '@/styles/tokens.css';
import '@/styles/globals.css';
```

### Token Naming Convention

All tokens follow the pattern `--{category}-{subcategory}-{scale}`:

| Pattern | Example | Usage |
|---------|---------|-------|
| `--color-{palette}-{step}` | `--color-primary-500` | Raw color scale values |
| `--color-{semantic}` | `--color-bg`, `--color-text`, `--color-accent` | Semantic aliases that swap in dark/light mode |
| `--typography-fontSize-{size}` | `--typography-fontSize-xl` | Type scale (xs through 4xl) |
| `--typography-fontFamily-{role}` | `--typography-fontFamily-mono` | Font stacks (display, body, mono) |
| `--typography-fontWeight-{name}` | `--typography-fontWeight-semibold` | Weight values (300-700) |
| `--typography-lineHeight-{name}` | `--typography-lineHeight-tight` | Line heights (1.1-2.0) |
| `--typography-letterSpacing-{name}` | `--typography-letterSpacing-widest` | Letter spacing (-0.05em to 0.1em) |
| `--spacing-{scale}` | `--spacing-8` | Spacing scale (0-20, values in 4px increments) |
| `--spacing-semantic-{name}` | `--spacing-semantic-section` | Semantic spacing (inset, stack, inline, section, page, gutter) |
| `--shadow-{size}` | `--shadow-lg` | Elevation shadows (xs through xl) |
| `--border-radius-{size}` | `--border-radius-lg` | Border radius (none through full/9999px) |
| `--border-width-{name}` | `--border-width-thin` | Border widths (1px, 2px, 4px) |
| `--motion-duration-{speed}` | `--motion-duration-slow` | Animation durations (50ms-600ms) |
| `--motion-easing-{name}` | `--motion-easing-spring-bounce` | Easing curves including spring physics |
| `--motion-delay-{name}` | `--motion-delay-stagger` | Stagger delays (0ms-300ms, stagger at 75ms) |

### Theme Switching

Dark mode is primary. Theme switching works via `data-theme` attribute on `<html>`:

- `data-theme="dark"` (default): semantic aliases point to dark values (neutral-950 bg, neutral-50 text)
- `data-theme="light"`: semantic aliases point to light values (neutral-50 bg, neutral-950 text)
- System preference: `@media (prefers-color-scheme: dark)` targets `:root:not([data-theme="light"])`

Persist theme choice in `localStorage`. Use edge middleware or a blocking `<script>` in `<head>` to read preference before paint (prevents flash).

### Tailwind Integration

Map tokens to Tailwind config via CSS custom properties:

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      bg: 'var(--color-bg)',
      surface: 'var(--color-surface)',
      accent: 'var(--color-accent)',
      // ... all semantic aliases
    },
    fontFamily: {
      display: 'var(--typography-fontFamily-display)',
      body: 'var(--typography-fontFamily-body)',
      mono: 'var(--typography-fontFamily-mono)',
    },
    spacing: {
      'section': 'var(--spacing-semantic-section)',
      'page': 'var(--spacing-semantic-page)',
      'gutter': 'var(--spacing-semantic-gutter)',
    }
  }
}
```

---

## 6. Accessibility Implementation Guide

### WCAG 2.2 AA Requirements (from HIG audit)

**Overall score: 91/100 (PASS with advisories)**

#### P0 -- Must Fix Before Launch

1. **Skills matrix ARIA structure** (About page): Add `<div role="row">` wrappers around each row of cells. Add `aria-label` with numeric values to `.skill-level` containers (e.g., `aria-label="4 out of 5"`). Mark individual dots with `aria-hidden="true"`.

2. **Design system color swatches keyboard access** (Design System page): Either add `role="button" tabindex="0"` with Enter/Space keydown handlers, or remove `cursor: pointer` and hover animation if swatches are decorative-only.

3. **Scroll padding for sticky header**: Add `scroll-padding-top: 80px` to `<html>` element to prevent sticky header (60px + offset) from obscuring focused elements when tabbing (WCAG 2.4.11).

4. **Mobile navigation panel**: Implement the actual mobile menu panel that the hamburger toggle controls. Link via `aria-controls` to the panel's `id`. Manage focus: trap focus within panel when open, return focus to toggle on close.

#### P1 -- High Priority

5. **Footer link focus styles**: Add `:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }` to `.footer-links a` on all pages.

6. **Scroll-to-top accessibility**: Add `aria-label="Scroll to top"` and `:focus-visible` outline style to the scroll-to-top button.

7. **Color scheme meta tag**: Add `<meta name="color-scheme" content="dark light">` to `<head>` on all pages for correct browser form control/scrollbar theming before CSS loads.

#### Focus Management Patterns

| Pattern | Implementation |
|---------|---------------|
| Focus ring style | `outline: 2px solid var(--color-focus-ring); outline-offset: 2px;` via `:focus-visible` (never `:focus`) |
| Skip link | First focusable element on every page, targets `#main` |
| Tab order | Follows DOM order = visual reading order |
| Theme toggle | `aria-pressed="true"` (dark) / `"false"` (light), dynamic `aria-label` |
| Command palette | Focus trap when open, `Escape` closes, return focus to trigger on close |
| Mobile menu | `aria-expanded` on toggle, `aria-controls` linked to panel, focus trap when open |
| External links | `target="_blank"` + `rel="noopener noreferrer"` + `aria-label` including "(opens in new tab)" |

#### Keyboard Navigation Map

| Component | Keys | Behavior |
|-----------|------|----------|
| Skip link | Tab, Enter | First Tab stop; Enter jumps to `#main` |
| Nav links | Tab, Enter | Tab through links; Enter follows link |
| Theme toggle | Tab, Enter/Space | Toggle theme, update `aria-pressed` |
| Command palette | Cmd+K / Ctrl+K | Open overlay; Tab within; Escape closes |
| Mobile menu | Tab, Enter/Space | Toggle menu; Tab within panel when open |
| Case study cards | Tab, Enter | Tab to card link; Enter follows link |
| DS sidebar links | Tab, Enter | Tab through; Enter scrolls to section |
| DS variant pills | Tab, Enter/Space | Toggle `aria-pressed` |
| Code toggle | Tab, Enter/Space | Toggle `aria-expanded`, show/hide code |
| Scroll-to-top | Tab, Enter | Scroll to page top, move focus to skip link |

---

## 7. Animation & Motion Specification

### GSAP Entrance Choreography

All pages use a GSAP timeline on `DOMContentLoaded` for entrance reveals:

```js
// Pattern for all pages
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({ defaults: { duration: 0.7, ease: 'power2.out' } });
tl.from('.gsap-reveal', {
  opacity: 0,
  y: 30,
  stagger: 0.12  // 120ms stagger between elements
});
```

**Homepage hero sequence:** eyebrow (0ms) > title (120ms) > subtitle (240ms) > hero visual (360ms) > CTAs (480ms) > scroll prompt (600ms)

**Per-page stagger delay:** 120-150ms between elements, following reading order (top-to-bottom, left-to-right)

### Scroll-Driven Animations

**Primary method (modern browsers):**
```css
.gsap-reveal {
  animation: fade-in-up 600ms ease-out both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@supports not (animation-timeline: scroll()) {
  .gsap-reveal { animation: none; }
  /* GSAP ScrollTrigger fallback applies via JS */
}
```

**Fallback (GSAP ScrollTrigger):**
```js
gsap.utils.toArray('.gsap-reveal').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    opacity: 0, y: 30, duration: 0.6
  });
});
```

### Spring Physics Values

| Context | Easing | CSS Value |
|---------|--------|-----------|
| Button/card hover | Spring bounce | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Button hover lift | Transform | `translateY(-2px) scale(1.03)` |
| Button active press | Transform | `translateY(0) scale(0.98)` |
| Card hover lift | Transform | `translateY(-4px)` |
| Icon button hover | Transform | `scale(1.05)` |
| General easing | Default | `cubic-bezier(0.2, 0, 0, 1)` -- `var(--motion-easing-default)` |
| Entrance easing | Out | `cubic-bezier(0, 0, 0.2, 1)` -- `var(--motion-easing-out)` |

### Infinite Animations

| Animation | Duration | Property | Element |
|-----------|----------|----------|---------|
| Availability heartbeat | 1.8s infinite | `transform: scale()` | `.availability-dot` (contact) |
| Status dot pulse | 2s infinite | `opacity, transform: scale()` | `.status-dot` (homepage) |
| Scroll arrow bounce | 2s infinite | `transform: translateY()` | `.scroll-arrow` (homepage) |

### Reduced Motion Fallbacks

**Global guard (present on all mockups):**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Production refinement:** Replace the universal selector with targeted rules that preserve functional transitions (disclosure toggles, theme switches) while removing decorative motion. Add `.no-js .gsap-reveal { opacity: 1; transform: none; }` for JavaScript-disabled fallback.

### Performance Fixes Required

| Issue | Current | Fix |
|-------|---------|-----|
| Progress ribbon (Case Study) | `width: 0%` to `width: 100%` (layout reflow) | `transform: scaleX(0)` to `scaleX(1)` with `transform-origin: left` |
| DS motion preview bar | `width: 30%` to `width: 100%` on hover | `transform: scaleX(0.3)` to `scaleX(1)` with `transform-origin: left` |

---

## 8. Open Items & Deferred Findings

### Deferred from Iterate (5 items)

| ID | Severity | Screen | Issue | Recommended Resolution |
|----|----------|--------|-------|----------------------|
| F22/CON-05 | major | all screens | CSS class naming convention inconsistency (4 conventions across 5 screens) | Adopt BEM with no prefix for shared components; `ds-` prefix for design system page-specific components. Enforce via linting in production codebase. |
| F23/A11Y-04 | major | about | Skills matrix lacks `role="row"` wrappers | Add `<div role="row">` wrappers. Also add `role="rowgroup"` for header and body sections. |
| F24/VH-02 | major | case-study | Case study sections use identical heading treatment, no visual progression | Introduce differentiated section treatments: progress indicator, varying visual weights, alternating layout patterns. |
| F25/VH-04 | major | design-system | Sidebar competes with main content at 768-1024px | Increase sidebar collapse breakpoint to 1024px or make main content max-width fluid. |
| F26/UX-05 | minor | design-system | Sidebar does not track scroll position | Implement scrollspy via IntersectionObserver; update `aria-current="true"` on active sidebar link. |

### HIG Major Findings to Address

| ID | Location | Issue | Fix |
|----|----------|-------|-----|
| HIG-1 | All screens: `.btn-icon` | Internal `<kbd>` text at 0.5rem (8px) may be hard to read | Increase to 0.625rem (10px) or replace with SVG icons |
| HIG-2 | About: `.skill-dot` | 8x8px dots have no accessible text alternative | Add `aria-label="4 out of 5"` to `.skill-level` container, `aria-hidden="true"` on dots |
| HIG-3 | About: `.skills-matrix` | Missing `role="row"` wrappers | Add `<div role="row">` around each row |
| HIG-4 | Design System: `.ds-color-swatch` | Interactive but not keyboard-accessible | Add `role="button" tabindex="0"` + keydown handler, or remove interactive affordance |

### Known Gaps

- **Mobile navigation panel**: Toggle button exists but no panel implementation. Must build the slide-out/dropdown panel with focus trapping.
- **Command palette**: Only a trigger button exists in mockups. cmdk integration requires Client Component with fuzzy search over page inventory.
- **Content authoring**: MDX case study content is a blocking dependency. The narrative quality directly determines portfolio effectiveness (per brief).
- **Font self-hosting**: Inter is currently loaded from Google Fonts. For production, self-host with `size-adjust` fallback to prevent CLS and improve LCP.
- **Dynamic OG images**: Not prototyped in mockups. Requires `@vercel/og` (Satori) implementation per page.

---

## 9. Implementation Priority

### Recommended Build Order

**Phase 1: Foundation (Week 1)**
1. Project scaffolding: Next.js 16 App Router, TypeScript, Tailwind CSS
2. Copy `tokens.css` into `src/styles/`, configure Tailwind to consume token custom properties
3. Create `globals.css`: reset, semantic aliases, reduced-motion guard, `.sr-only`, `.no-js` fallback
4. Theme provider: `data-theme` attribute management, localStorage persistence, system preference detection, blocking script for flash prevention
5. Add `<meta name="color-scheme" content="dark light">` and `scroll-padding-top: 80px`

**Phase 2: Shared Components (Week 1-2)**
6. `SkipLink` component
7. `Header` component: sticky, frosted glass, canonical nav (Work | System | About | Contact), logo, nav links with font-weight animation, header actions (command palette trigger + theme toggle)
8. `Footer` component: nav links, social links, copyright, `:focus-visible` styles
9. `MobileMenu` component: hamburger toggle, slide-out panel, focus trap, `aria-expanded`/`aria-controls`
10. `ThemeToggle` component: `aria-pressed`, dynamic label
11. Button components: `BtnPrimary`, `BtnSecondary`, `BtnIcon` with all 7 states
12. `ScrollToTop` component with `aria-label`

**Phase 3: Page Shells (Week 2)**
13. Root layout: token imports, font loading, theme provider, skip link, header, footer
14. Homepage shell: hero, narrative section containers, case study grid, professional grid, contact CTA
15. Case study shell: progress ribbon, main content container, chapter section, chapter nav
16. Design system shell: two-column layout with sidebar, section containers
17. About shell: identity section, timeline, skills matrix, philosophy
18. Contact shell: centered layout, contact methods grid, CTA section

**Phase 4: Screen Content (Week 2-3)**
19. Homepage content: hero copy, narrative sections, case study card data from MDX frontmatter
20. Design system token showcases: color swatches, type samples, spacing bars, motion cards
21. Design system component previews with variant pills and code toggles
22. About content: identity, timeline data, skills matrix data
23. Contact content: contact methods, availability status
24. Case study MDX template with interactive demo slots

**Phase 5: Animations (Week 3)**
25. GSAP entrance choreography (all pages)
26. CSS scroll-driven reveals with GSAP fallback
27. Spring physics on interactive elements
28. Homepage: magnetic CTA effect, scroll prompt bounce
29. Case study: progress ribbon (scaleX), section reveals
30. Design system: token pulse on hover
31. About: timeline trace (sequential dot illumination)
32. Contact: availability heartbeat

**Phase 6: Polish (Week 3-4)**
33. Command palette (cmdk) integration with fuzzy search
34. Dynamic OG images via `@vercel/og`
35. SEO: meta tags, structured data, sitemap
36. Font optimization: self-host Inter, `size-adjust` fallback, font subsetting
37. Performance audit: Lighthouse 100/100 target, < 200KB initial load, sub-1s LCP
38. Accessibility audit: address all HIG findings, automated WCAG scan, manual keyboard testing
39. RSS feed for blog/case studies
40. Vercel Analytics integration

---

## 10. Acceptance Criteria

### Performance Criteria (from Brief)

| Metric | Target | How to Verify |
|--------|--------|---------------|
| Lighthouse (all categories) | 100/100 | Run Lighthouse in Chrome DevTools on deployed Vercel URL |
| LCP | < 1.0s on 4G | WebPageTest with 4G throttling |
| CLS | 0 | Lighthouse + field data via Vercel Analytics |
| TTI | < 1.5s | Lighthouse |
| Initial page load (excl. images) | < 200KB | Network tab, transfer size |
| Mobile Lighthouse | 100/100 | Lighthouse with mobile emulation |

### Accessibility Criteria (from HIG)

| Criterion | Target | How to Verify |
|-----------|--------|---------------|
| WCAG 2.2 AA automated audit | 0 violations | axe-core or Lighthouse accessibility |
| Keyboard navigation | 100% interactive elements reachable via Tab | Manual keyboard walkthrough |
| Skip link | Present and functional on all 5 pages | Tab once from page load, verify skip link appears |
| Focus visibility | All interactive elements have `:focus-visible` outline | Tab through all elements, verify visible ring |
| Screen reader | Landmarks, headings, ARIA attributes correct | VoiceOver/NVDA walkthrough |
| Reduced motion | All animations disabled | Enable `prefers-reduced-motion`, verify no motion |
| Theme toggle | Dark/light switch works, persists, no flash | Toggle theme, reload, verify persistence |

### Design Fidelity Criteria (from Critique and Mockups)

| Criterion | How to Verify |
|-----------|---------------|
| Token usage | No hardcoded color/spacing/typography values; all consumed via `var()` |
| Navigation consistency | All 5 pages use identical header with Work | System | About | Contact |
| Logo consistency | "SignalframeUX" text with `.site-logo` class on all pages |
| 7-state interactivity | All buttons/cards show default, hover, focus, active, loading, disabled, error states |
| Dark mode primary | Site loads in dark mode by default; light mode available via toggle |
| Type scale | Augmented Fourth (1.414) ratio verified across heading hierarchy |
| Responsive | All 5 breakpoints (320, 640, 768, 1024, 1280) tested |
| Narrative arc | Homepage scroll sequence matches Journey 1: Hero > Problem > Exploration > Evidence > Professional > CTA |

### Content Criteria

| Criterion | How to Verify |
|-----------|---------------|
| Case study scroll depth | > 60% average (Vercel Analytics) |
| Contact engagement | Measurable via Vercel Analytics event tracking |
| Progressive enhancement | Disable JavaScript; verify all core content is readable |
| Command palette | Cmd+K opens on all pages; fuzzy search returns results |

---

*Generated by PDE-OS /pde:handoff (HND) | 2026-03-31*
*Sources: BRF-brief-v1, SYS-tokens.json, tokens.css, FLW-user-flows-v1, WFR-*-v1.html (5 screens), CRT-critique-v1, ITR-changelog-v1, MCK-mockup-spec-v1, HIG-guidelines-v1, mockup-*.html (5 screens)*
