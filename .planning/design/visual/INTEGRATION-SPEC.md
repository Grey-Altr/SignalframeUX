# INTEGRATION SPEC — Graphic Realism × shadcn × GSAP
## SignalframeUX Design System Product Site
### Generated 2026-03-31

---

## 0. Design Axioms

These rules govern every decision in this spec. When in doubt, choose the option that honors more axioms.

1. **FLAT FIRST** — The DU/TDR brutalist-flat aesthetic is the primary visual language. Graphic realism is a subtle polish layer, never the dominant treatment.
2. **Typography drives hierarchy** — Size contrast (Anton 120px+ vs Electrolize 12px) creates visual weight. Not shadows, not gradients.
3. **0px everywhere** — `--radius: 0px`. No rounded corners. Industrial edges.
4. **White-dominant** — Light mode by default. Black is for type, rules, and fills — not backgrounds.
5. **Magenta is the signal** — #FF0090 / `oklch(0.65 0.29 350)` is the single accent. Yellow (#FFE500) is reserved for manifesto/highlight bands only.
6. **Monospace is the voice** — Electrolize for everything except display headlines (Anton).
7. **Motion has purpose** — Every animation must feel like the interface is *activating*, not decorating.

---

## 1. Token Architecture — shadcn Integration

### 1.1 CSS Variable Mapping

shadcn v4 uses `@theme inline` with OKLCH values. SignalframeUX tokens map directly:

```css
/* globals.css */
:root {
  /* ── Core ── */
  --radius: 0px;
  --background: oklch(1 0 0);                    /* White */
  --foreground: oklch(0.145 0 0);                /* Near-black */

  /* ── Brand ── */
  --primary: oklch(0.65 0.29 350);               /* Magenta #FF0090 */
  --primary-foreground: oklch(0.985 0 0);        /* White on magenta */

  /* ── Surfaces ── */
  --secondary: oklch(0.970 0.005 298);           /* Near-white */
  --secondary-foreground: oklch(0.205 0 0);      /* Black text */
  --muted: oklch(0.930 0.005 298);               /* Light gray */
  --muted-foreground: oklch(0.550 0.010 298);    /* Gray text */
  --accent: oklch(0.930 0.005 298);
  --accent-foreground: oklch(0.205 0 0);

  /* ── Semantic ── */
  --destructive: oklch(0.550 0.180 25);          /* Error red */
  --border: oklch(0.205 0 0);                    /* BLACK borders (industrial) */
  --input: oklch(0.205 0 0);                     /* BLACK input borders */
  --ring: oklch(0.65 0.29 350);                  /* Magenta focus ring */

  /* ── SignalframeUX Extensions ── */
  --sf-yellow: oklch(0.91 0.18 98);              /* TDR manifesto yellow #FFE500 */
  --sf-green: oklch(0.85 0.25 145);              /* DU matrix green #00FF00 */
  --sf-clock: oklch(0.145 0 0);                  /* Nav clock color */

  /* ── Graphic Realism Layer (subtle) ── */
  --sf-grain-opacity: 0.03;                      /* Surface noise intensity */
  --sf-inset-shadow: inset 0 1px 2px oklch(0 0 0 / 0.08);  /* Code block recession */
  --sf-deboss-light: 0 1px 0 oklch(1 0 0 / 0.1);           /* Debossed type highlight */
  --sf-deboss-shadow: 0 -1px 0 oklch(0 0 0 / 0.15);        /* Debossed type shadow */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
  --radius-2xl: 0px;

  --font-sans: 'Electrolize', 'Courier New', 'SF Mono', ui-monospace, monospace;
  --font-mono: 'Electrolize', 'Courier New', 'SF Mono', ui-monospace, monospace;
}
```

### 1.2 Typography Scale Override

Using the existing 1.414 augmented fourth scale from `SYS-tokens.json`:

```css
@theme inline {
  --text-xs: 0.500rem;    /*  8px */
  --text-sm: 0.707rem;    /* 11px */
  --text-base: 1.000rem;  /* 16px */
  --text-lg: 1.414rem;    /* 23px */
  --text-xl: 2.000rem;    /* 32px */
  --text-2xl: 2.828rem;   /* 45px */
  --text-3xl: 4.000rem;   /* 64px */
  --text-4xl: 5.657rem;   /* 91px */
}
```

### 1.3 Font Configuration (Next.js 16)

```tsx
// app/layout.tsx
import { Electrolize } from "next/font/google"
import localFont from "next/font/local"

const electrolize = Electrolize({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

const anton = localFont({
  src: "./fonts/Anton-Regular.woff2",
  variable: "--font-display",
  display: "swap",
})

// <html className={`${electrolize.variable} ${anton.variable}`}>
```

---

## 2. Component Architecture

### 2.1 Layer Model

```
Layer 0: Radix UI Primitives         (headless behavior + a11y)
   ↓
Layer 1: shadcn/ui Components        (base styled with Tailwind + CSS vars)
   ↓
Layer 2: sf-* Components             (SignalframeUX wrapping layer)
   ↓
Layer 3: Blocks / Page Sections      (composed from sf-* components)
   ↓
Layer 4: GSAP Animation Wrappers     (motion layer, applied to Blocks)
```

### 2.2 Component Map — What Gets Built

**Phase 1 — Foundation (site launch)**

| sf-* Component | Wraps shadcn | Key Customization |
|---|---|---|
| `sf-button` | Button | `font-mono uppercase tracking-wider border-2 border-foreground`, 3 intents: primary/ghost/signal |
| `sf-card` | Card | Strip shadow/radius, add `border-2 border-foreground`, hover: invert colors |
| `sf-input` | Input | `font-mono border-2 border-foreground`, magenta focus ring |
| `sf-badge` | Badge | Magenta or black fill, 0px radius, uppercase monospace |
| `sf-tabs` | Tabs | Black underline style (not pills), uppercase labels |
| `sf-table` | Table | Dense monospace, black borders, alternating row shading |
| `sf-separator` | Separator | Full-bleed 3px black rules |
| `sf-kbd` | Kbd | Industrial key style — black bg, white mono text |
| `sf-tooltip` | Tooltip | Black bg, white monospace, 0px radius |
| `sf-scroll-area` | Scroll Area | Minimal 2px scrollbar, magenta thumb |
| `sf-sidebar` | Sidebar | Dense nav, bullet-prefixed items (•ITEM), uppercase |
| `sf-command` | Command | Cmd+K palette, industrial styling |

**Phase 2 — Documentation features**

| sf-* Component | Wraps shadcn | Key Customization |
|---|---|---|
| `sf-dialog` | Dialog | Full-bleed black border, no rounded corners |
| `sf-sheet` | Sheet | API reference side panel, 3-column layout |
| `sf-accordion` | Accordion | Expandable API docs sections |
| `sf-breadcrumb` | Breadcrumb | Monospace with / separators |
| `sf-pagination` | Pagination | TDR-style `(X / Y)` pattern |
| `sf-select` | Select | Framework selector dropdown |
| `sf-toggle-group` | Toggle Group | View mode switching (grid/list) |

### 2.3 Wrapping Pattern

```tsx
// components/sf/sf-button.tsx
import { Button, type ButtonProps } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sfButtonVariants = cva(
  "font-mono uppercase tracking-wider border-2 border-foreground transition-colors duration-100",
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
        ghost: "bg-transparent text-foreground hover:bg-foreground hover:text-background",
        signal: "bg-foreground text-background border-primary hover:bg-primary hover:text-primary-foreground",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
)

interface SFButtonProps extends ButtonProps, VariantProps<typeof sfButtonVariants> {}

export function SFButton({ intent, size, className, ...props }: SFButtonProps) {
  return (
    <Button className={cn(sfButtonVariants({ intent, size }), className)} {...props} />
  )
}
```

### 2.4 Shared Industrial Modifiers (Tailwind utilities)

```css
/* globals.css — utility classes used across sf-* components */
@layer utilities {
  .sf-border { @apply border-2 border-foreground; }
  .sf-mono { @apply font-mono uppercase tracking-wider; }
  .sf-invert-hover { @apply hover:bg-foreground hover:text-background; }
  .sf-yellow-band { @apply bg-[var(--sf-yellow)] text-foreground py-6 px-8; }
}
```

---

## 3. Graphic Realism Layer — Rules of Application

### 3.1 Philosophy

Graphic realism is the *seasoning*, not the meal. It lives UNDER the flat DU/TDR aesthetic as a barely-perceptible quality layer that makes surfaces feel physical without competing with typography or layout.

**The 3% rule:** If you have to squint to notice a graphic realism effect, it's at the right intensity. If it catches your eye before the type does, it's too loud.

### 3.2 Where Realism Applies

| Element | Treatment | CSS Implementation | Intensity |
|---|---|---|---|
| **Code blocks** | Recessed into surface | `box-shadow: var(--sf-inset-shadow)` | Subtle inset |
| **Nav bar** | Barely-perceptible bottom shadow | `box-shadow: 0 1px 0 oklch(0 0 0 / 0.05)` beyond the 3px border | Whisper |
| **Hero headline (Anton)** | Debossed type on black surface | `text-shadow: var(--sf-deboss-light), var(--sf-deboss-shadow)` | Only on dark backgrounds |
| **Yellow manifesto band** | Surface grain texture | `background-image: url('/grain.svg')` at `var(--sf-grain-opacity)` | 3% opacity |
| **Component preview cards** | Machined edge hint | `box-shadow: 0 0 0 1px oklch(0 0 0 / 0.05)` inside the border | Hairline |
| **Token color swatches** | Matte surface feel | Noise texture overlay at 2% opacity | Barely there |
| **Scrollbar thumb** | Slight dimensional feel | 1px lighter top edge via `border-top: 1px solid oklch(1 0 0 / 0.1)` | Micro |

### 3.3 Where Realism Does NOT Apply

- Body text — always flat, clean Electrolize
- Navigation links — flat color transitions only
- Borders and rules — solid black, no gradients
- Buttons — flat color fill, never beveled or 3D
- Icons — flat single-color, never shadowed
- White backgrounds — always pure white, no texture
- Any interactive element — motion handles affordance, not shadows

### 3.4 Grain Texture Implementation

```svg
<!-- public/grain.svg — tileable noise texture -->
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)" opacity="0.5"/>
</svg>
```

Applied via CSS:
```css
.sf-grain {
  position: relative;
}
.sf-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/grain.svg') repeat;
  opacity: var(--sf-grain-opacity);
  pointer-events: none;
  mix-blend-mode: multiply;
}
```

---

## 4. GSAP Animation Architecture

### 4.1 Plugin Registry

```tsx
// lib/gsap-plugins.ts
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  Flip,
  CustomEase,
  useGSAP
);

// ── SignalframeUX Custom Easings ──
CustomEase.create('sf-snap', 'M0,0 C0.14,0 0.27,0.5 0.5,0.5 0.73,0.5 0.86,1 1,1');
CustomEase.create('sf-punch', 'M0,0 C0.7,0 0.3,1.5 1,1');

export { gsap, ScrollTrigger, SplitText, Flip, CustomEase };
```

### 4.2 Smooth Scroll Foundation

```tsx
// lib/lenis.ts
'use client';

import Lenis from 'lenis';
import { ScrollTrigger } from '@/lib/gsap-plugins';

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
  });

  // Sync Lenis scroll position with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}
```

### 4.3 Animation Hookpoints Per Screen

#### Homepage (`mockup-homepage.html`)

| Section | Animation | Plugin | Trigger |
|---|---|---|---|
| Nav clock | Live ticking (already CSS, keep as is) | None (JS setInterval) | Page load |
| Nav links | ScrambleText on hover | ScrambleTextPlugin | mouseenter |
| Hero headline "SIGNAL//FIELD" | SplitText char reveal with mask | SplitText | Page load, 0.3s delay |
| Hero subtitle | Fade up after headline completes | gsap.from | Timeline sequence |
| Hero katakana | ScrambleText decode from random chars | ScrambleTextPlugin | After subtitle |
| Black/white hero split | Horizontal wipe reveal | gsap.from clipPath | Page load |
| Component grid (4-col) | ScrollTrigger batch stagger | ScrollTrigger.batch | Scroll into view |
| Yellow manifesto band | Pin + parallax text scroll | ScrollTrigger pin + scrub | Scroll position |
| Footer circuit SVG | DrawSVG path trace | DrawSVGPlugin | Scroll into view |

#### Components Page (`mockup-components.html`)

| Section | Animation | Plugin | Trigger |
|---|---|---|---|
| Page title | SplitText word reveal | SplitText | Page load |
| Filter bar | ScrambleText on active filter change | ScrambleTextPlugin | Click |
| Component cards | Flip layout transition on filter | Flip | Filter change |
| Card hover | Scale 1.02 + border color shift | gsap.to | mouseenter/leave |
| Grid load | ScrollTrigger.batch stagger from bottom | ScrollTrigger.batch | Scroll |

#### API Reference (`mockup-api.html`)

| Section | Animation | Plugin | Trigger |
|---|---|---|---|
| Wipeout HUD overlay | Fade in with scanline | gsap.from + CSS | Page load |
| Code panel | Typewriter effect for live examples | TextPlugin | Tab switch |
| Sidebar nav items | Stagger reveal | gsap.from stagger | Page load |
| Button preview | ScrambleText label decode | ScrambleTextPlugin | Hover |
| Section transitions | ScrollTrigger fade + slide | ScrollTrigger | Scroll |

#### Tokens Page (`mockup-tokens.html`)

| Section | Animation | Plugin | Trigger |
|---|---|---|---|
| Color scale strips | Width reveal (0% → 100%) | gsap.from width | ScrollTrigger |
| Spacing tokens | Height/width grow animation | gsap.from | ScrollTrigger |
| Typography specimens | SplitText at each scale | SplitText | ScrollTrigger |
| Motion easing dots | Live easing curve preview | gsap.to with CustomEase | ScrollTrigger.batch |
| OKLCH values | ScrambleText number decode | ScrambleTextPlugin | ScrollTrigger |

#### Getting Started (`mockup-start.html`)

| Section | Animation | Plugin | Trigger |
|---|---|---|---|
| Step numbers | SplitText with mask reveal | SplitText | ScrollTrigger per step |
| Code snippets | Typewriter effect | TextPlugin | ScrollTrigger |
| Checklist items | Stagger check-in from left | gsap.from x:-20 | ScrollTrigger.batch |
| Yellow step highlight | Pin during scroll | ScrollTrigger pin | Scroll position |
| Community band | Parallax slide | ScrollTrigger scrub | Scroll |

### 4.4 Reusable Animation Components

```tsx
// components/animation/split-headline.tsx
'use client';

import { useRef } from 'react';
import { SplitText } from '@/lib/gsap-plugins';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface SplitHeadlineProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function SplitHeadline({ text, className, delay = 0, stagger = 0.02 }: SplitHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    SplitText.create(ref.current!, {
      type: 'chars',
      mask: 'chars',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.chars, {
          y: '100%',
          opacity: 0,
          duration: 0.5,
          stagger,
          delay,
          ease: 'sf-snap',
        });
      },
    });
  }, { scope: ref });

  return <h1 ref={ref} className={className}>{text}</h1>;
}
```

```tsx
// components/animation/scramble-text.tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: 'load' | 'hover';
  chars?: string;
}

const SF_CHARS = '!<>-_\\/[]{}—=+*^?#01シグナル';

export function ScrambleText({ text, className, trigger = 'hover', chars = SF_CHARS }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: ref });

  const handleHover = contextSafe(() => {
    gsap.to(ref.current!, {
      duration: 0.8,
      scrambleText: {
        text,
        chars,
        revealDelay: 0.3,
        speed: 0.4,
      },
    });
  });

  return (
    <span
      ref={ref}
      className={className}
      onMouseEnter={trigger === 'hover' ? handleHover : undefined}
    >
      {text}
    </span>
  );
}
```

### 4.5 Performance Budget

| Resource | Budget | Notes |
|---|---|---|
| GSAP core + plugins | ~50KB gzipped | Tree-shakeable, only import what's used |
| Lenis | ~8KB gzipped | Smooth scroll foundation |
| Total animation JS | <60KB gzipped | Well within performance budget |
| ScrollTrigger instances | Max 20 per page | Use batch() for repeated elements |
| Concurrent tweens | Max 10 active | Kill completed tweens, use timelines |

### 4.6 Reduced Motion

```tsx
// lib/gsap-plugins.ts — add after registration
if (typeof window !== 'undefined') {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    gsap.globalTimeline.timeScale(0);  // Freeze all animations
  }
  prefersReduced.addEventListener('change', (e) => {
    gsap.globalTimeline.timeScale(e.matches ? 0 : 1);
  });
}
```

---

## 5. Interaction Feedback System

### 5.1 Philosophy: Industrial Tactility

Every interaction produces feedback that feels like operating a well-machined instrument. Three rules:
1. **Acknowledge instantly** — the user never wonders "did that work?"
2. **Match force to action** — small actions get small feedback, destructive actions get dramatic feedback
3. **Stay flat** — feedback comes from motion and contrast, never decoration

### 5.2 New Design System Files

| File | Purpose |
|------|---------|
| `SYS-motion.css` | Motion tokens + 22 new interaction feedback tokens |
| `SYS-feedback.css` | Keyframes, utility classes, pseudo-element effects |
| `SYS-components.css` | Components with feedback wired in (sf-* namespace) |

### 5.3 Core Pattern: Asymmetric Press Response

The #1 technique for satisfying interactions. Every pressable element follows this timing:

```
Hover enter:  200ms  ease-hover (overshoot)  → element lifts -2px
Press down:    34ms  linear                  → snap to +1px, scale 0.97
Release:      400ms  spring (linear() curve) → bounce back to origin
Hover exit:   600ms  ease-default            → slow glacial settle
```

Fast in, slow out. Mimics physical key switches.

### 5.4 Feedback Utility Classes

Applied to any element via composition. All respect `prefers-reduced-motion`.

| Class | Behavior |
|-------|----------|
| `.sf-pressable` | Full press cycle: lift → snap → spring |
| `.sf-hoverable` | Lift-only hover with slow settle |
| `.sf-focusable` | Expanding magenta focus ring |
| `.sf-flash--active` | VHS color inversion flash (JS toggle) |
| `.sf-shake--active` | Mechanical error shake (JS toggle) |
| `.sf-entrance` / `.sf-entrance--visible` | Scroll-triggered fade-up |
| `.sf-entrance-stagger` | Staggered children cascade (CSS nth-child) |
| `.sf-skeleton` | Scanline loading sweep (magenta 2px bar) |
| `.sf-link-draw` | Underline draws left→right on hover |
| `.sf-invert-hover` | Full background/text color inversion |
| `.sf-border-thicken` | Border 1px→2px on hover |
| `.sf-scroll-progress` | Page scroll progress bar (CSS scroll-driven) |
| `.sf-idle-overlay--active` | Standby scanline after 60s idle |

### 5.5 Hover Vocabulary (Per Element Type)

| Element | Hover Response | Character |
|---------|---------------|-----------|
| Nav links | ScrambleText glitch → resolve | Hacker terminal |
| Primary buttons | Full color inversion | Hard switch |
| Ghost buttons | Border thickens 1px→2px + lift | Industrial |
| Cards | Translate -2px + border→magenta | Signal activation |
| Code blocks | Subtle green tint on border | Matrix warmth |
| Table rows | Full-width background bar | DU archive style |
| Inline links | Underline draws left→right | Typewriter |
| Icon buttons | Scale(1.1) + rotate(5deg) | Mechanical pivot |

### 5.6 GSAP Feedback Components

```tsx
// components/animation/feedback.ts — Interaction feedback helpers
'use client';

import gsap from '@/lib/gsap-plugins';

/** Flash inversion on confirm actions */
export function flashConfirm(el: HTMLElement) {
  el.classList.add('sf-flash--active');
  el.addEventListener('animationend', () => el.classList.remove('sf-flash--active'), { once: true });
}

/** Error shake on validation failure */
export function shakeError(el: HTMLElement) {
  el.classList.add('sf-shake--active');
  el.addEventListener('animationend', () => el.classList.remove('sf-shake--active'), { once: true });
}

/** ScrambleText on hover — uses branded character set */
export const SF_SCRAMBLE_CHARS = 'SIGNAL//01フレーム▓░▒';

export function scrambleHover(el: HTMLElement, text: string) {
  gsap.to(el, {
    duration: 0.4,
    scrambleText: {
      text,
      chars: SF_SCRAMBLE_CHARS,
      speed: 0.6,
      revealDelay: 0.1,
    },
  });
}

/** Copy-to-clipboard with inline label swap */
export function copyFeedback(btn: HTMLElement, duration = 2000) {
  btn.setAttribute('data-copied', 'true');
  setTimeout(() => btn.removeAttribute('data-copied'), duration);
}
```

### 5.7 Sound System (Opt-in, P3)

Off by default. Web Audio API synthesized sounds (no audio files):

| Interaction | Sound | Spec |
|-------------|-------|------|
| Button click | Short tick | 1200Hz square, 30ms |
| Toggle on | Rising blip | 800→1200Hz sine, 60ms |
| Toggle off | Falling blip | 1200→800Hz sine, 60ms |
| Copy success | Double tick | 2× 1500Hz, 20ms each |
| Error | Low buzz | 200Hz sawtooth, 100ms |
| Submit success | Rising chord | 800+1000+1200Hz, 200ms decay |

### 5.8 Accessibility Commitments

| Concern | Mitigation |
|---------|------------|
| Motion sensitivity | All animations → 0ms via `prefers-reduced-motion: reduce` |
| Sound | Off by default, opt-in toggle, never sole indicator |
| Custom cursor | Hidden on touch devices, respects a11y settings |
| Color flash | Always paired with text/icon state change |
| Seizure risk | No element flashes >3x/second |
| Screen readers | All states communicated via ARIA attributes |

---

## 6. Registry Distribution Strategy
<!-- (was section 5 before feedback system insertion) -->

### 5.1 SignalframeUX as a shadcn Custom Registry

The site IS the product. Users install SignalframeUX components with:

```bash
pnpm dlx shadcn@latest add "https://signalframeux.com/r/signalframeux-base.json"
# or with namespace:
pnpm dlx shadcn@latest add signalframeux:button
```

### 5.2 Registry Structure

```
public/r/
├── registry.json                    # Master index
├── signalframeux-base.json          # registry:base — full design system config
├── font-electrolize.json             # registry:font — Electrolize
├── font-anton.json                  # registry:font — Anton display
├── sf-button.json                   # registry:component
├── sf-card.json                     # registry:component
├── sf-input.json                    # registry:component
├── sf-badge.json                    # registry:component
├── sf-tabs.json                     # registry:component
├── sf-table.json                    # registry:component
├── sf-separator.json                # registry:component
├── sf-kbd.json                      # registry:component
├── sf-tooltip.json                  # registry:component
├── sf-scroll-area.json              # registry:component
├── sf-sidebar.json                  # registry:component
├── sf-command.json                  # registry:component
└── ...
```

### 5.3 Build Pipeline

```bash
# registry.json at project root defines all items
# shadcn build generates individual JSON files
pnpm dlx shadcn@latest build
```

---

## 7. Implementation Priority

### Wave 1 — Foundation (Blocks everything else)

1. `pnpm create next-app@latest` with App Router + Tailwind v4
2. `pnpm dlx shadcn@latest init` with custom CSS vars (section 1.1)
3. Install GSAP: `pnpm add gsap @gsap/react`
4. Install Lenis: `pnpm add lenis`
5. Create `lib/gsap-plugins.ts` (section 4.1)
6. Create `lib/lenis.ts` (section 4.2)
7. Configure fonts in `app/layout.tsx` (section 1.3)
8. Set `--radius: 0px` and all token overrides in `globals.css`

### Wave 2 — Core Components + Feedback System

1. Add shadcn base components: `button card input badge tabs table separator`
2. Create `sf-*` wrapper layer for each (section 2.3 pattern)
3. Add shared utility classes (section 2.4)
4. Wire `SYS-feedback.css` utility classes into sf-* components (section 5)
5. Create animation components: `SplitHeadline`, `ScrambleText`, feedback helpers (section 4.4, 5.6)
6. Implement scroll entrance observer for `.sf-entrance` elements

### Wave 3 — Homepage Build

1. Nav with live clock + ScrambleText hover links
2. Hero section with SplitText "SIGNAL//FIELD" reveal
3. Component grid with ScrollTrigger.batch stagger
4. Yellow manifesto band with grain texture + pin scroll
5. Footer with DrawSVG circuit paths

### Wave 4 — Remaining Pages

1. Components page (Flip filtering, card grid)
2. Tokens page (animated scales, ScrollTrigger reveals)
3. API reference (3-panel layout, code typewriter)
4. Getting Started (step-by-step scroll narrative)

### Wave 5 — Registry + Polish

1. Build `registry.json` and all component JSON files
2. Test install flow from hosted URL
3. Graphic realism polish pass (grain, inset shadows, debossed type)
4. Performance audit (Lighthouse, bundle size)
5. `prefers-reduced-motion` verification

---

## 8. File Structure (Implementation)

```
signalframeux/
├── app/
│   ├── layout.tsx                   # Fonts, Lenis provider, metadata
│   ├── page.tsx                     # Homepage
│   ├── components/page.tsx          # Component library
│   ├── tokens/page.tsx              # Token documentation
│   ├── api/page.tsx                 # API reference
│   ├── start/page.tsx               # Getting started
│   ├── globals.css                  # Token overrides, utilities, grain
│   └── fonts/
│       └── Anton-Regular.woff2
├── components/
│   ├── ui/                          # shadcn base (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── sf/                          # SignalframeUX wrappers
│   │   ├── sf-button.tsx
│   │   ├── sf-card.tsx
│   │   └── ...
│   ├── animation/                   # GSAP animation components
│   │   ├── split-headline.tsx
│   │   ├── scramble-text.tsx
│   │   ├── scroll-reveal.tsx
│   │   ├── draw-circuit.tsx
│   │   ├── vhs-scanline.tsx
│   │   └── feedback.ts              # Flash, shake, scramble, copy helpers
│   ├── layout/                      # Page-level layout components
│   │   ├── nav.tsx
│   │   ├── footer.tsx
│   │   └── lenis-provider.tsx
│   └── blocks/                      # Composed page sections
│       ├── hero.tsx
│       ├── component-grid.tsx
│       ├── manifesto-band.tsx
│       └── ...
├── lib/
│   ├── gsap-plugins.ts              # Central GSAP registration
│   ├── lenis.ts                     # Smooth scroll init
│   ├── sf-audio.ts                  # Web Audio API sound system (opt-in)
│   ├── sf-idle.ts                   # Idle detection + standby overlay
│   └── utils.ts                     # cn() and helpers
├── public/
│   ├── grain.svg                    # Tileable noise texture
│   └── r/                           # Registry JSON output
│       ├── registry.json
│       └── ...
├── registry.json                    # Registry source definition
├── components.json                  # shadcn config
└── package.json
```

---

## 9. Key Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| shadcn style | `new-york` | Default in v4, closest to industrial aesthetic |
| Primitives | Radix UI | Default in shadcn, battle-tested a11y |
| CSS approach | Tailwind v4 `@theme inline` | No config file, everything in globals.css |
| GSAP loading | Dynamic import per page | Only load plugins needed for that page |
| Lenis scope | Global via layout provider | Consistent smooth scroll across all pages |
| Registry hosting | Vercel (same deploy) | Zero-config, `public/r/` served as static JSON |
| Animation SSR | `'use client'` boundary | All animation components are client-only |
| Grain texture | SVG (not raster) | Scales perfectly, tiny file size, CSS-controllable opacity |

---

## Appendix: Token Cross-Reference

### SYS-tokens.json → shadcn CSS Variable

| SYS Token | OKLCH Value | shadcn Variable |
|---|---|---|
| `color.primary.500` | `oklch(0.550 0.180 298)` | `--primary` (adjusted to `oklch(0.65 0.29 350)` for true magenta) |
| `color.neutral.50` | `oklch(0.970 0.005 298)` | `--secondary` |
| `color.neutral.500` | `oklch(0.550 0.010 298)` | `--muted-foreground` |
| `color.neutral.950` | `oklch(0.150 0.008 298)` | `--foreground` |
| `color.error.500` | `oklch(0.550 0.180 25)` | `--destructive` |
| `spacing.4` | `16px` | Tailwind `p-4` (native alignment) |
| `shadow.sm` | Standard shadow | Used only on code blocks as inset variant |
| `motion.duration.fast` | `100ms` | `--duration-fast` (GSAP uses own timing) |
| `motion.ease.default` | `cubic-bezier(0.2, 0, 0, 1)` | CSS transitions; GSAP uses `sf-snap` CustomEase |
