# RSH-gsap-animation-research.md
# GSAP Integration Research for SignalframeUX
**Generated: 2026-03-31 | Depth: Maximum**

---

## 1. GSAP CURRENT STATE (2025-2026)

### Version
- **Current version: 3.14.2** (latest stable on npm)
- Major milestone: v3.13.0 rewrote SplitText (50% smaller, 14 new features) and made all plugins free

### Licensing — The Webflow Acquisition
In late 2024, **Webflow acquired GreenSock**. The result:
- **ALL plugins are now 100% free**, including former "Club GreenSock" exclusives (SplitText, MorphSVG, DrawSVG, ScrollSmoother, ScrambleText, etc.)
- Free for **commercial use** — no restrictions
- License is GreenSock's "standard no-charge" license (NOT MIT/Apache, but functionally free)
- License URL: https://gsap.com/standard-license
- The license is NOT traditional open-source, but has zero cost and allows commercial use

### NPM Package Structure
```bash
npm install gsap          # Core + all plugins
npm install @gsap/react   # React integration (useGSAP hook)
```

Package contents:
- `gsap/` — ES modules (default imports)
- `gsap/dist/` — UMD files for CDN/legacy compatibility
- `gsap/src/` — Source files
- `gsap/types/` — TypeScript definitions included
- Zero external dependencies

### What's in the Box (all free)
**Core:** gsap, Timeline, CSSPlugin (auto-included), ScrollTrigger
**Text:** SplitText, ScrambleText, TextPlugin
**SVG:** DrawSVG, MorphSVG, MotionPath, MotionPathHelper
**Layout/UI:** Flip, Draggable, Inertia, Observer
**Scroll:** ScrollTrigger, ScrollSmoother, ScrollTo
**Easing:** CustomEase, EasePack (rough, slow, expoScale), CustomBounce, CustomWiggle
**Dev:** GSDevTools
**Integration:** Pixi plugin, Easel plugin
**React:** @gsap/react (useGSAP hook)

---

## 2. GSAP + REACT/NEXT.JS INTEGRATION

### Installation
```bash
npm install gsap @gsap/react
```

### The useGSAP Hook — Core Pattern

The `useGSAP()` hook from `@gsap/react` is the canonical way to use GSAP in React 18+. It replaces `useEffect`/`useLayoutEffect` and provides automatic cleanup via `gsap.context()`.

```tsx
'use client'; // REQUIRED for Next.js App Router

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export function AnimatedComponent() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // All GSAP animations here are auto-cleaned on unmount
    gsap.to('.box', { x: 360, duration: 1 });
  }, { scope: container }); // scope restricts selectors to this container

  return (
    <div ref={container}>
      <div className="box">Animated</div>
    </div>
  );
}
```

### Hook API Reference

```tsx
useGSAP(callback, config);
```

| Config Property | Type | Default | Purpose |
|----------------|------|---------|---------|
| `scope` | React ref | — | Restricts selector queries to container descendants |
| `dependencies` | Array | `[]` | Controls when animations re-run (like useEffect deps) |
| `revertOnUpdate` | boolean | `false` | Reverts all animations when deps change, not just unmount |

### Handling Event-Driven Animations (contextSafe)

Animations created OUTSIDE the useGSAP callback (e.g., onClick handlers) need `contextSafe()` wrapping for proper cleanup:

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function InteractiveComponent() {
  const container = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: container });

  // CORRECT: wrapped in contextSafe for cleanup
  const handleClick = contextSafe(() => {
    gsap.to('.target', { rotation: 360, duration: 0.6 });
  });

  return (
    <div ref={container}>
      <button onClick={handleClick}>Animate</button>
      <div className="target" />
    </div>
  );
}
```

### React 18 Strict Mode Gotcha

React 18's Strict Mode calls effects TWICE in development. Without proper cleanup, this creates duplicate animations. The `useGSAP` hook handles this automatically by using `gsap.context()` for cleanup. No special handling needed.

### SSR / Next.js App Router Considerations

1. **Always use `'use client'`** at the top of any file using GSAP — it is a browser-only library
2. The useGSAP hook uses `useIsomorphicLayoutEffect` internally — prefers `useLayoutEffect` on client, falls back to `useEffect` on server
3. **No hydration issues** as long as initial render matches server output. GSAP animations run AFTER hydration
4. **Plugin registration** should happen at module level (outside component):

```tsx
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register once at module level
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
```

### Recommended: Central Plugin Registration File

```tsx
// lib/gsap-plugins.ts
'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  Flip,
  Observer,
  useGSAP
);

export { gsap, ScrollTrigger, SplitText, Flip, Observer };
```

Then import from this file across components:
```tsx
import { gsap, ScrollTrigger } from '@/lib/gsap-plugins';
```

---

## 3. SCROLLTRIGGER — Deep Dive

### Core Concept
ScrollTrigger links GSAP animations to scroll position. It can trigger, scrub (sync to scroll), pin elements, and batch animations.

### Basic Usage in Next.js

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollReveal() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.reveal-item', {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.reveal-section',
        start: 'top 80%',    // trigger when top of element hits 80% of viewport
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: container });

  return <div ref={container}>{/* content */}</div>;
}
```

### Pinning

```tsx
useGSAP(() => {
  gsap.to('.hero-content', {
    opacity: 0,
    y: -50,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: '+=500',        // pin for 500px of scroll
      pin: true,
      scrub: true,         // sync animation to scroll position
    },
  });
}, { scope: container });
```

### Scrubbing (Scroll-Linked Animation)

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section',
      start: 'top top',
      end: '+=2000',
      scrub: 1,            // 1-second smoothing
      pin: true,
    },
  });

  tl.to('.element-a', { x: 300 })
    .to('.element-b', { rotation: 360 }, '<')  // simultaneous
    .to('.element-c', { scale: 2 }, '+=0.5');  // 0.5s after previous
}, { scope: container });
```

### ScrollTrigger.batch() for Staggered Reveals

```tsx
useGSAP(() => {
  ScrollTrigger.batch('.grid-item', {
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.6,
      }),
    start: 'top 85%',
  });
}, { scope: container });
```

### Performance Notes for ScrollTrigger
- ScrollTrigger uses `requestAnimationFrame` — does NOT run on scroll event directly
- `scrub: true` = zero smoothing (instant). `scrub: 1` = 1-second smoothing (recommended)
- Use `invalidateOnRefresh: true` for responsive layouts
- Call `ScrollTrigger.refresh()` after dynamic content loads
- In Next.js: call `ScrollTrigger.refresh()` after route transitions if content height changes

---

## 4. PLUGINS RELEVANT TO SIGNALFRAMEUX

### Tier 1: Essential for DU/TDR Aesthetic

#### SplitText — Text Decomposition & Animation
**Use case:** Massive headline reveals, character-by-character glitch effects, line-by-line scroll reveals

```tsx
useGSAP(() => {
  SplitText.create('.headline', {
    type: 'chars, words',
    mask: 'chars',         // clip mask for reveal effect
    autoSplit: true,       // re-split on resize/font load
    onSplit(self) {
      return gsap.from(self.chars, {
        y: '100%',
        opacity: 0,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power2.out',
      });
    },
  });
}, { scope: container });
```

Key SplitText features for SignalframeUX:
- `mask: 'chars'` — creates overflow:clip wrappers for slide-up reveals (DU-style)
- `autoSplit: true` — handles responsive re-splitting automatically
- `propIndex: true` — adds `--char`, `--word`, `--line` CSS variables for per-element styling
- `aria: 'auto'` — preserves accessibility (screen readers get full text)
- Split types: `chars`, `words`, `lines` — any combination

#### ScrambleText — Data Terminal / Matrix Effects
**Use case:** Scramble/decode effect on hover, loading states, DU-VHS aesthetic, counter displays

```tsx
useGSAP(() => {
  gsap.to('.terminal-text', {
    duration: 1.5,
    scrambleText: {
      text: 'SIGNAL//FRAME™',
      chars: '!<>-_\\/[]{}—=+*^?#01',  // custom char set
      revealDelay: 0.5,                  // hold scramble before revealing
      speed: 0.4,
      newClass: 'text-accent-magenta',   // class applied to revealed chars
    },
  });
}, { scope: container });
```

#### ScrollTrigger — Scroll-Driven Narratives
Already covered above. Essential for every section transition, parallax, and reveal.

#### Observer — Input Detection
**Use case:** Custom scroll hijacking, swipe-to-navigate sections, keyboard-driven page transitions

```tsx
useGSAP(() => {
  Observer.create({
    type: 'wheel, touch, pointer',
    onUp: () => goToSection(currentIndex - 1),
    onDown: () => goToSection(currentIndex + 1),
    tolerance: 10,
    preventDefault: true,
  });
}, { scope: container });
```

### Tier 2: High Impact for Brand Experience

#### Flip — Layout State Transitions
**Use case:** Component library grid filtering, layout mode switching (grid <-> list), route transitions

```tsx
const handleFilter = contextSafe((filter: string) => {
  const state = Flip.getState('.component-card');

  // Re-order/filter DOM
  setActiveFilter(filter);

  // Animate from old positions to new
  Flip.from(state, {
    duration: 0.6,
    ease: 'power2.inOut',
    stagger: 0.04,
    absolute: true,
    onEnter: (elements) =>
      gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }),
    onLeave: (elements) =>
      gsap.to(elements, { opacity: 0, scale: 0 }),
  });
});
```

#### DrawSVG — SVG Path Drawing
**Use case:** Circuit board line animations, logo reveals, connection diagrams, loading indicators

```tsx
useGSAP(() => {
  gsap.fromTo('.circuit-path',
    { drawSVG: '0%' },
    {
      drawSVG: '100%',
      duration: 2,
      ease: 'power1.inOut',
      stagger: 0.3,
      scrollTrigger: {
        trigger: '.circuit-section',
        start: 'top 60%',
      },
    }
  );
}, { scope: container });
```

#### CustomEase — Signature Motion Curves
**Use case:** Create SignalframeUX-specific easing curves that match the industrial/mechanical feel

```tsx
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

// Harsh mechanical snap (DU-style)
CustomEase.create('signal-snap', 'M0,0 C0.14,0 0.27,0.5 0.5,0.5 0.73,0.5 0.86,1 1,1');

// Aggressive overshoot
CustomEase.create('signal-punch', 'M0,0 C0.7,0 0.3,1.5 1,1');
```

### Tier 3: Useful Enhancements

#### MorphSVG — Shape Morphing
**Use case:** Icon transitions (hamburger -> X, play -> pause), logo morphs
```tsx
gsap.to('#icon-path', { morphSVG: '#target-path', duration: 0.4 });
```

#### MotionPath — Path-Based Movement
**Use case:** Elements following circuit board traces, orbital decorations

#### TextPlugin — Text Content Animation
**Use case:** Typewriter effects, live data displays
```tsx
gsap.to('.typewriter', { text: 'シグナルフレーム SYSTEM ONLINE', duration: 2, ease: 'none' });
```

#### Inertia — Momentum Physics
**Use case:** Draggable component previews with physics-based deceleration

---

## 5. ANIMATION PATTERNS FOR DU/TDR AESTHETIC

### Pattern 1: Glitch Text Reveal (DU-VHS Style)

```tsx
'use client';

import { useRef } from 'react';
import { gsap, SplitText } from '@/lib/gsap-plugins';
import { useGSAP } from '@gsap/react';

export function GlitchHeadline({ text }: { text: string }) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const split = SplitText.create('.glitch-text', {
      type: 'chars',
      charsClass: 'glitch-char',
    });

    const tl = gsap.timeline();

    // Phase 1: Characters appear at random positions
    tl.from(split.chars, {
      opacity: 0,
      x: () => gsap.utils.random(-20, 20),
      y: () => gsap.utils.random(-10, 10),
      rotationZ: () => gsap.utils.random(-15, 15),
      duration: 0.05,
      stagger: {
        each: 0.02,
        from: 'random',
      },
    });

    // Phase 2: Snap to position
    tl.to(split.chars, {
      x: 0,
      y: 0,
      rotationZ: 0,
      duration: 0.1,
      stagger: 0.01,
      ease: 'power4.out',
    });

    // Phase 3: Brief RGB offset flicker
    tl.to('.glitch-text', {
      textShadow: '2px 0 #FF0090, -2px 0 #00FF00',
      duration: 0.05,
      yoyo: true,
      repeat: 3,
    });

    tl.set('.glitch-text', { textShadow: 'none' });
  }, { scope: container });

  return (
    <div ref={container}>
      <h1 className="glitch-text">{text}</h1>
    </div>
  );
}
```

### Pattern 2: VHS Scanline Overlay (CSS + GSAP)

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function VHSScanlines() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate scanline position
    gsap.to('.scanline', {
      y: '100vh',
      duration: 4,
      ease: 'none',
      repeat: -1,
    });

    // Random static bursts
    gsap.to('.vhs-noise', {
      opacity: () => gsap.utils.random(0.02, 0.08),
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'none',
    });
  }, { scope: ref });

  return (
    <div ref={ref} className="vhs-overlay pointer-events-none fixed inset-0 z-50">
      <div
        className="scanline absolute left-0 w-full"
        style={{
          height: '2px',
          background: 'rgba(255, 0, 144, 0.15)',
          boxShadow: '0 0 10px rgba(255, 0, 144, 0.1)',
          top: '-2px',
        }}
      />
      <div
        className="vhs-noise absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        }}
      />
    </div>
  );
}
```

### Pattern 3: Staggered Grid Reveal (Component Library)

```tsx
useGSAP(() => {
  ScrollTrigger.batch('.component-card', {
    onEnter: (batch) =>
      gsap.from(batch, {
        opacity: 0,
        y: 40,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
      }),
    start: 'top 90%',
  });
}, { scope: container });
```

### Pattern 4: Parallax Section Dividers (DU Black Rules)

```tsx
useGSAP(() => {
  gsap.utils.toArray<HTMLElement>('.section-divider').forEach((divider) => {
    gsap.from(divider, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.8,
      ease: 'power3.inOut',
      scrollTrigger: {
        trigger: divider,
        start: 'top 85%',
      },
    });
  });
}, { scope: container });
```

### Pattern 5: Counter/Clock Animation (DU Header Clock)

```tsx
'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function SignalClock() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Update clock every second
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');

      const el = ref.current?.querySelector('.clock-display');
      if (el) el.textContent = `${h}:${m}:${s}`;
    };

    update();
    const interval = setInterval(update, 1000);

    // Scramble effect on initial load
    gsap.to('.clock-display', {
      scrambleText: {
        text: '00:00:00',
        chars: '0123456789:',
        revealDelay: 0.3,
        speed: 0.5,
      },
      duration: 1,
    });

    return () => clearInterval(interval);
  }, { scope: ref });

  return (
    <div ref={ref}>
      <span className="clock-display font-mono text-[200px] leading-none tracking-tight">
        00:00:00
      </span>
    </div>
  );
}
```

### Pattern 6: ScrambleText Navigation Hover (TDR Style)

```tsx
useGSAP(() => {
  document.querySelectorAll('.nav-link').forEach((link) => {
    const originalText = link.textContent;

    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        duration: 0.6,
        scrambleText: {
          text: originalText,
          chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01_/\\',
          revealDelay: 0.2,
          speed: 0.3,
        },
      });
    });
  });
}, { scope: container });
```

### Pattern 7: Geometric Section Transitions

```tsx
useGSAP(() => {
  const sections = gsap.utils.toArray<HTMLElement>('.page-section');

  sections.forEach((section, i) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
      },
    });

    // Wipe in from left with black overlay
    tl.fromTo(
      section.querySelector('.section-wipe'),
      { scaleX: 1, transformOrigin: 'right' },
      { scaleX: 0, ease: 'power2.inOut' }
    );

    // Slide in section title from bottom
    tl.from(
      section.querySelector('.section-title'),
      { y: 80, opacity: 0 },
      '-=0.3'
    );
  });
}, { scope: container });
```

### Pattern 8: Noise Texture via Canvas + GSAP

```tsx
useGSAP(() => {
  const canvas = ref.current?.querySelector('canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const ctx = canvas.getContext('2d')!;
  canvas.width = 256;
  canvas.height = 256;

  const renderNoise = () => {
    const imageData = ctx.createImageData(256, 256);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 12; // low opacity
    }
    ctx.putImageData(imageData, 0, 0);
  };

  // Use GSAP ticker for consistent frame rate
  gsap.ticker.add(renderNoise);

  return () => gsap.ticker.remove(renderNoise);
}, { scope: ref });
```

---

## 6. GSAP VS ALTERNATIVES

### GSAP vs Motion (formerly Framer Motion)

| Dimension | GSAP | Motion (Framer Motion) |
|-----------|------|----------------------|
| **Philosophy** | Imperative — explicit timeline commands | Declarative — describe states, library handles transitions |
| **Bundle size (gzip)** | ~23 KB core, ~78 KB with plugins | ~32 KB (core), ~85 KB full |
| **React integration** | useGSAP hook + contextSafe | Native component props (`animate`, `exit`, `whileHover`) |
| **Timeline control** | Unmatched — nested timelines, labels, precise offsets | Variants + staggerChildren (simpler but less control) |
| **Scroll animations** | ScrollTrigger — best-in-class | useScroll + useMotionValueEvent (decent but less powerful) |
| **Exit animations** | Manual (must orchestrate) | AnimatePresence — automatic and elegant |
| **Layout animations** | Flip plugin (powerful but manual) | `layout` prop — automatic |
| **Text splitting** | SplitText built-in | None — needs external library |
| **Framework lock-in** | None — works with any framework | React/Next.js only |
| **Learning curve** | Steeper, more concepts | Gentler for React developers |
| **Best for** | Cinematic sequences, scroll narratives, complex choreography | State-driven UI, gesture-based interaction, simple transitions |

### Recommendation for SignalframeUX

**Use GSAP as primary animation engine.** The DU/TDR aesthetic demands:
- Complex timeline-based sequences (GSAP wins)
- Scroll-driven narratives (ScrollTrigger is unmatched)
- Text effects (SplitText, ScrambleText have no Motion equivalent)
- SVG path animations (DrawSVG, MorphSVG)
- Precise choreography over declarative convenience

**Optionally use Motion for:**
- Simple component micro-interactions (hover states, mount/unmount)
- AnimatePresence for route exit animations in Next.js
- Layout prop for simple layout shifts

**They can coexist.** GSAP and Motion do not conflict. Use Motion for declarative UI state animations and GSAP for creative/narrative animations. Many production sites use both.

### GSAP vs CSS Animations

| Use CSS when... | Use GSAP when... |
|----------------|-----------------|
| Simple hover transitions | Multi-step sequences |
| Basic opacity/transform changes | Scroll-linked animations |
| Performance-critical micro-interactions | Dynamic/randomized values |
| No JavaScript needed | Text splitting/scrambling |

SignalframeUX already defines CSS motion tokens in `SYS-motion.css`. Keep these for basic UI transitions (button hovers, focus rings, menu reveals). Layer GSAP on top for hero animations, scroll effects, and text treatments.

### GSAP + Lenis (Smooth Scroll)

**Lenis** (by darkroom.engineering) is the community standard for smooth scrolling in Next.js. It pairs with GSAP ScrollTrigger beautifully.

**Why Lenis over GSAP ScrollSmoother:**
- Lenis is lighter and more flexible
- Lenis doesn't restructure your DOM (ScrollSmoother wraps content)
- Lenis integrates cleanly with Next.js App Router
- Lenis + ScrollTrigger is the most popular combination in production

**Integration pattern:**
```tsx
'use client';

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,   // Let GSAP handle the RAF loop
    });

    // Sync Lenis scroll position to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker (single RAF loop)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

### Tailwind Motion / CSS-only libraries

For sub-5KB simple animations (fade, slide, scale), Tailwind CSS Motion is viable. But it cannot do timelines, scroll-linking, or text effects — not a replacement for GSAP in this project.

---

## 7. PERFORMANCE

### Bundle Size Breakdown

| Package | Gzipped Size |
|---------|-------------|
| `gsap` (core only) | ~23 KB |
| `gsap` + ScrollTrigger | ~33 KB |
| `gsap` + ScrollTrigger + SplitText | ~38 KB |
| `gsap` + all plugins | ~78 KB |
| `@gsap/react` | ~2 KB |

### Tree Shaking

GSAP supports tree-shaking with ES module imports. Only import what you use:

```tsx
// GOOD: Only imports what you need
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

// AVOID: Don't import everything
import gsap from 'gsap/all';
```

Note: GSAP's tree-shaking is not as granular as some libraries. The core (`gsap`) always includes CSSPlugin. But plugins are fully tree-shakable — only imported plugins are bundled.

### Lazy Loading Plugins

For pages that don't need heavy plugins (e.g., MorphSVG), use dynamic imports:

```tsx
'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

export function MorphAnimation() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import('gsap/MorphSVGPlugin').then(({ MorphSVGPlugin }) => {
      gsap.registerPlugin(MorphSVGPlugin);
      setReady(true);
    });
  }, []);

  // ... animate only after ready
}
```

### GPU Acceleration Tips

GSAP automatically optimizes for GPU compositing:

1. **Transforms use translate3d()** during animation (triggers GPU layer promotion), then switch to 2D after completion to free GPU memory
2. **Animate only compositable properties** when possible: `transform` (x, y, scale, rotation) and `opacity` — avoid `width`, `height`, `top`, `left`
3. **Use `will-change: transform`** sparingly on elements about to animate — remove after animation completes
4. **Stagger reduces simultaneous calculations** — even 0.02s between elements smooths performance significantly
5. **Use `force3D: true`** on GSAP tweens to keep elements on GPU layer throughout:
   ```tsx
   gsap.to('.element', { x: 100, force3D: true });
   ```

### requestAnimationFrame

GSAP uses `requestAnimationFrame` by default. It automatically syncs with the display refresh rate. The GSAP ticker batches all active animations into a single RAF callback — far more efficient than multiple independent animation loops.

### Reduced Motion Support

Integrate with the existing `SYS-motion.css` `prefers-reduced-motion` approach:

```tsx
useGSAP(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Skip animations, set final states immediately
    gsap.set('.animated', { opacity: 1, y: 0 });
    return;
  }

  // Full animations
  gsap.from('.animated', { opacity: 0, y: 50, stagger: 0.1 });
}, { scope: container });
```

---

## 8. SIGNALFRAMEUX-SPECIFIC RECOMMENDATIONS

### Animation Architecture

```
lib/
  gsap-plugins.ts          # Central plugin registration
  gsap-easings.ts          # Custom eases (signal-snap, signal-punch, etc.)

components/
  animation/
    GlitchText.tsx         # SplitText + random offset glitch
    ScrambleReveal.tsx     # ScrambleText on scroll/hover
    VHSOverlay.tsx         # Scanline + noise overlay
    ScrollReveal.tsx       # Generic scroll-triggered fade-in
    CircuitDraw.tsx        # DrawSVG circuit board paths
    SectionWipe.tsx        # Geometric wipe transitions
    SignalClock.tsx        # Live clock with scramble effect
    ParallaxDivider.tsx    # Black rule parallax reveals

providers/
  SmoothScrollProvider.tsx # Lenis + ScrollTrigger sync
```

### Priority Implementation Order

1. **Lenis + ScrollTrigger smooth scroll** — Foundation layer, affects everything
2. **SplitText headlines** — Highest visual impact, DU-style massive type reveals
3. **ScrambleText nav/hover** — Signature interaction, TDR data-terminal feel
4. **ScrollTrigger section reveals** — Staggered grid items, divider animations
5. **VHS overlay** — Subtle ambient texture (scanlines + noise)
6. **DrawSVG circuit paths** — Hero section / decorative elements
7. **Flip layout transitions** — Component library filtering
8. **CustomEase industrial curves** — Refine motion feel across all animations
9. **Observer** — Advanced scroll hijacking for specific sections if needed

### Plugin Budget

For the initial build, register only what you need:

```
gsap core          23 KB
ScrollTrigger      10 KB
SplitText           5 KB
ScrambleText        3 KB
CustomEase          3 KB
Observer            4 KB
@gsap/react         2 KB
─────────────────────────
Total:            ~50 KB gzipped
```

Add DrawSVG (~3 KB) and Flip (~5 KB) when needed. This is well within performance budgets.

### Integration with Existing Motion Tokens

Map the CSS custom properties from `SYS-motion.css` to GSAP defaults:

```tsx
// lib/gsap-easings.ts
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

// Mirror SYS-motion.css ease tokens
gsap.defaults({
  duration: 0.2,  // --duration-normal
  ease: CustomEase.create('signal-default', 'M0,0 C0.2,0 0,1 1,1'), // --ease-default approx
});

// Named eases matching the design system
CustomEase.create('signal-in', 'M0,0 C0.4,0 1,1 1,1');
CustomEase.create('signal-out', 'M0,0 C0,0 0.2,1 1,1');
CustomEase.create('signal-in-out', 'M0,0 C0.4,0 0.2,1 1,1');

// DU/TDR-specific aggressive eases
CustomEase.create('signal-snap', 'M0,0 C0.68,-0.55 0.27,1.55 1,1'); // hard overshoot
CustomEase.create('signal-glitch', 'M0,0 C0,0.5 0.5,0 0.5,0.5 0.5,1 1,0.5 1,1'); // stepped feel
```

---

## SOURCES

- [GSAP GitHub Repository](https://github.com/greensock/GSAP)
- [GSAP React Integration Guide](https://gsap.com/resources/React/)
- [GSAP Plugins Documentation](https://gsap.com/docs/v3/Plugins/)
- [SplitText API Documentation](https://gsap.com/docs/v3/Plugins/SplitText/)
- [ScrambleText Plugin](https://gsap.com/docs/v3/Plugins/ScrambleTextPlugin/)
- [Observer Plugin](https://gsap.com/docs/v3/Plugins/Observer/)
- [GSAP npm Package](https://www.npmjs.com/package/gsap)
- [@gsap/react npm Package](https://www.npmjs.com/package/@gsap/react)
- [GSAP Is Now Free — CSS-Tricks](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/)
- [GSAP Free Announcement — Webflow Blog](https://webflow.com/blog/gsap-becomes-free)
- [Setting Up GSAP with Next.js: 2025 Edition](https://javascript.plainenglish.io/setting-up-gsap-with-next-js-2025-edition-bcb86e48eab6)
- [GSAP & Next.js Setup: The BSMNT Way](https://basement.studio/blog/gsap-next-js-setup-the-bsmnt-way)
- [From SplitText to MorphSVG: 5 Creative Demos — Codrops](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/)
- [Brutalist Glitchy Portfolio with GSAP — Codrops](https://tympanus.net/codrops/2025/10/15/from-blank-canvas-to-mayhem-eloy-benoffis-brutalist-glitchy-portfolio-built-with-webflow-and-gsap/)
- [GSAP vs Motion: 2026 Guide](https://satishkumar.xyz/blogs/gsap-vs-motion-guide-2026)
- [GSAP vs Motion — Motion.dev](https://motion.dev/docs/gsap-vs-motion)
- [Best React Animation Libraries 2026 — LogRocket](https://blog.logrocket.com/best-react-animation-libraries/)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [Smooth Scrolling in Next.js with Lenis and GSAP](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap)
- [ScrollSmoother vs Lenis Comparison](https://zuncreative.com/en/blog/smooth_scroll_meditation/)
- [GSAP Bundlephobia](https://bundlephobia.com/package/gsap)
- [GSAP Performance Optimization](https://www.rustcodeweb.com/2024/04/optimizing-animation-performance-in-gsap.html)
- [Glitch Text Effect CodePen](https://codepen.io/eighthday/pen/pjdZvX)
- [GSAP Scramble Text CodePen](https://codepen.io/GreenSock/pen/zYRozmR)
- [Animating Responsive Grid with GSAP Flip — Codrops](https://tympanus.net/codrops/2026/01/20/animating-responsive-grid-layout-transitions-with-gsap-flip/)
- [WebGL Shaders with GSAP — Codrops](https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/)
