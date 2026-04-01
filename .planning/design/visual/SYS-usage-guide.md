---
title: "SignalframeUX Design System Usage Guide"
version: "1.0.0"
generated: "2026-03-31"
product: "Portfolio (Product Design Engineer)"
product_character: "reading"
type_scale: "Augmented Fourth (1.414)"
seed_color: "oklch(0.550 0.180 298)"
---

# SignalframeUX Design System — Usage Guide

## Token Overview

| Category     | Count | Description                               |
|-------------|-------|-------------------------------------------|
| Color       | 154   | 14 palettes x 11 steps                   |
| Typography  | 25    | 3 families, 8 sizes, 5 weights, 5 line-heights, 6 spacings |
| Spacing     | 21    | 15 primitives + 6 semantic               |
| Shadow      | 5     | xs through xl elevation                   |
| Border      | 11    | 7 radii, 3 widths, 1 style              |
| Motion      | 15    | 5 durations, 7 easings, 5 delays         |
| Feedback    | 22    | Press, hover, focus, error, entrance, flash, scanline, toggle, cursor |
| **Total**   | **253** |                                         |

## Interaction Feedback

The feedback system provides satisfying response to every user interaction.
Built on the principle of **"Industrial Tactility"** — like operating a well-machined instrument.

### Core Principle: Asymmetric Timing

| Phase | Duration | Easing | Why |
|-------|----------|--------|-----|
| Press (down) | 34ms | linear | Instant mechanical snap |
| Release (up) | 400ms | spring | Satisfying bounce-back |
| Hover (enter) | 200ms | overshoot | Rises to meet cursor |
| Hover (exit) | 600ms | default | Slow glacial settle |

### Feedback Utility Classes

| Class | Behavior | Use On |
|-------|----------|--------|
| `.sf-pressable` | Lift → snap → spring | Buttons, toggles, clickable cards |
| `.sf-hoverable` | Lift on hover, slow settle | Non-clickable cards, previews |
| `.sf-focusable` | Expanding focus ring | All interactive elements |
| `.sf-flash--active` | Color inversion flash | Submit/confirm buttons (via JS) |
| `.sf-shake--active` | Mechanical error shake | Inputs/buttons on error (via JS) |
| `.sf-entrance` | Scroll-triggered fade-up | Section containers |
| `.sf-entrance-stagger` | Staggered children cascade | Grid parents |
| `.sf-skeleton` | Scanline loading sweep | Loading placeholders |
| `.sf-link-draw` | Underline draws left→right | Inline links |
| `.sf-invert-hover` | Full color inversion hover | Primary buttons |
| `.sf-border-thicken` | Border grows on hover | Ghost/outlined elements |
| `.sf-scroll-progress` | Page scroll progress bar | Fixed to viewport top |
| `.sf-idle-overlay--active` | Standby scanline overlay | Body (via JS after 60s idle) |

### Files

| File | Purpose |
|------|---------|
| `SYS-motion.css` | Motion tokens + interaction feedback tokens |
| `SYS-feedback.css` | Keyframes + utility classes + pseudo-element effects |
| `SYS-components.css` | Components with feedback behaviors wired in |

## Brand Configuration

| Parameter          | Value                                    |
|-------------------|------------------------------------------|
| Seed Hue          | 298 (purple/violet)                      |
| Seed Chroma       | 0.18                                     |
| Seed Lightness    | 0.55                                     |
| Domain Shift      | +60 (creative/design)                    |
| Color Space       | OKLCH                                    |
| Type Scale Ratio  | 1.414 (Augmented Fourth)                 |
| Product Character | reading (case studies, narrative arc)    |
| Spacing Base      | 4px                                      |
| Primary Font      | system-ui stack                          |
| Dark Mode         | Primary (prefers-color-scheme + data-theme) |

## Type Pairing Recommendations

### 1. Display + Body (Primary Pairing)
- **Display**: system-ui, weight 700, size 4xl (5.657rem), tracking -0.05em
- **Body**: system-ui, weight 400, size base (1rem), leading 1.5
- **Use**: Hero sections, landing page headlines with body copy

### 2. Heading + Body Large (Case Study Pairing)
- **Heading**: system-ui, weight 600, size xl (2rem), tracking -0.025em
- **Body Large**: system-ui, weight 400, size lg (1.414rem), leading 1.625
- **Use**: Case study titles with generous reading text

### 3. Display + Mono (Technical Pairing)
- **Display**: system-ui, weight 700, size 3xl (4rem)
- **Mono**: ui-monospace, weight 400, size sm (0.707rem)
- **Use**: Project showcases mixing design narrative with code snippets

### 4. Heading + Caption (Card Pairing)
- **Heading**: system-ui, weight 600, size lg (1.414rem)
- **Caption**: system-ui, weight 600, size xs (0.5rem), tracking 0.1em, uppercase
- **Use**: Card components with overline categories and project titles

### 5. Body + Overline (Detail Pairing)
- **Body**: system-ui, weight 400, size base (1rem)
- **Overline**: system-ui, weight 600, size xs (0.5rem), tracking 0.1em, uppercase
- **Use**: Metadata sections, project details, timeline entries

## Color Usage

### Backgrounds
```css
/* Light mode page background */
background: var(--color-bg);           /* neutral-50 */

/* Dark mode (automatic via data-theme="dark") */
background: var(--color-bg);           /* neutral-950 */

/* Subtle surface */
background: var(--color-surface-raised); /* neutral-100 / neutral-800 */
```

### Text
```css
/* Primary text */
color: var(--color-text);              /* neutral-950 / neutral-50 */

/* Secondary/muted */
color: var(--color-text-secondary);    /* neutral-600 / neutral-400 */
color: var(--color-text-muted);        /* neutral-500 */
```

### Accent / Interactive
```css
/* Links and interactive elements */
color: var(--color-accent);            /* primary-500 / primary-400 */

/* Hover state */
color: var(--color-accent-hover);      /* primary-600 / primary-300 */

/* Subtle accent background */
background: var(--color-accent-subtle); /* primary-100 / primary-900 */
```

### Semantic Colors
```css
/* Status indicators */
color: var(--color-success-500);  /* H=145 green */
color: var(--color-warning-500);  /* H=85 amber */
color: var(--color-error-500);    /* H=25 red */
color: var(--color-info-500);     /* H=250 blue */
```

## Typography Usage

### Headings
```css
/* Page title */
.page-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);       /* 4rem */
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tighter);
}

/* Section heading */
.section-heading {
  font-family: var(--font-display);
  font-size: var(--text-xl);        /* 2rem */
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}
```

### Body Text
```css
/* Long-form reading */
.prose {
  font-family: var(--font-body);
  font-size: var(--text-base);       /* 1rem */
  line-height: var(--leading-normal); /* 1.5 */
  max-width: 65ch;
}

/* Large body for case studies */
.case-study-text {
  font-family: var(--font-body);
  font-size: var(--text-lg);         /* 1.414rem */
  line-height: var(--leading-relaxed); /* 1.625 */
}
```

### Code
```css
.code-block {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}
```

## Component Usage

### Button
```html
<!-- Primary button -->
<button class="pde-btn pde-btn--primary">Get in Touch</button>

<!-- Secondary button, small -->
<button class="pde-btn pde-btn--secondary pde-btn--sm">View Source</button>

<!-- Large CTA -->
<button class="pde-btn pde-btn--primary pde-btn--lg">Explore Case Studies</button>
```

### Card
```html
<div class="pde-card">
  <div class="pde-card__header">
    <h3>Project Title</h3>
  </div>
  <div class="pde-card__body">
    <p>Brief description of the case study and key outcomes.</p>
  </div>
  <div class="pde-card__footer">
    <button class="pde-btn pde-btn--primary pde-btn--sm">Read More</button>
  </div>
</div>
```

### Form Field
```html
<div class="pde-field">
  <label class="pde-label" for="email">Email</label>
  <input class="pde-input" id="email" type="email" placeholder="you@example.com">
</div>

<!-- Error state -->
<div class="pde-field">
  <label class="pde-label" for="name">Name</label>
  <input class="pde-input pde-input--error" id="name" value="J">
  <span class="pde-error">Name must be at least 2 characters</span>
</div>
```

## Dark Mode

Enable dark mode with the `data-theme` attribute:

```html
<!-- Dark mode -->
<html data-theme="dark">

<!-- Light mode -->
<html data-theme="light">

<!-- System preference (default, no attribute needed) -->
<html>
```

All semantic tokens (`--color-bg`, `--color-text`, etc.) automatically adapt. Component classes include dark mode overrides. The system also responds to `prefers-color-scheme: dark` when no `data-theme` attribute is set.

## Spacing

Use semantic spacing tokens for consistent layouts:

```css
/* Page-level padding */
padding: var(--space-page);     /* 80px */

/* Section separation */
margin-bottom: var(--space-section); /* 64px */

/* Card internal padding */
padding: var(--space-inset);    /* 16px */

/* Element stacking */
gap: var(--space-stack);        /* 24px */
```

Switch density with the `data-density` attribute:

```html
<div data-density="compact"><!-- Tighter spacing --></div>
<div data-density="cozy"><!-- More generous spacing --></div>
```

## File Reference

| File | Purpose |
|------|---------|
| `SYS-tokens.json` | DTCG token tree (source of truth) |
| `SYS-colors.css` | Color primitives + semantic aliases |
| `SYS-typography.css` | Font families, sizes, presets |
| `SYS-spacing.css` | Spacing primitives + density |
| `SYS-shadows.css` | 5-level elevation system |
| `SYS-borders.css` | Radii, widths, style |
| `SYS-motion.css` | Durations, easings, delays |
| `SYS-components.css` | Button, Card, Input components |
| `SYS-utilities.css` | Spacing/flex/width utility classes |
| `tokens.css` | Unified CSS custom properties |
| `SYS-preview.html` | Visual preview with dark mode toggle |
