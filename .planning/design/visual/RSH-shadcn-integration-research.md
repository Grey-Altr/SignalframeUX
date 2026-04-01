# SHADCN/UI INTEGRATION RESEARCH — SignalframeUX
## Maximum-depth analysis for brutalist/industrial design system product site
### Generated 2026-03-31

---

## 1. SHADCN/UI CURRENT STATE (2025-2026)

### Latest Version: shadcn/cli v4 (March 2026)

The CLI has undergone four major versions. v4 is the current release, focused on coding agent workflows and design system distribution.

**Key CLI Commands:**
```bash
pnpm dlx shadcn@latest init          # Initialize project
pnpm dlx shadcn@latest add [name]    # Add component
pnpm dlx shadcn@latest build         # Build registry JSON
pnpm dlx shadcn@latest docs [comp]   # Fetch component docs
pnpm dlx shadcn@latest info          # Show project config
pnpm dlx shadcn@latest search        # Search registries
pnpm dlx shadcn@latest view [item]   # Preview before install
pnpm dlx shadcn@latest migrate       # Run migrations (radix, rtl, icons)
```

**CLI v4 New Flags:**
- `--preset` — Pack entire design system config into shareable code
- `--dry-run`, `--diff`, `--view` — Inspect registry changes before writing
- `--template` — Scaffold for Next.js, Vite, Laravel, React Router, Astro, TanStack Start
- `--base` — Select between Radix UI or Base UI primitives
- `--rtl` — Enable right-to-left support

**Component Count: 75+ official components** across UI, form, data display, navigation, and layout categories.

### Major 2025-2026 Timeline

| Date | Release | Impact |
|------|---------|--------|
| Mar 2026 | CLI v4, `registry:base`, `registry:font`, presets, `shadcn/skills` | Design system distribution overhaul |
| Feb 2026 | Unified `radix-ui` package, blocks for Radix + Base UI | Breaking: migrate from individual `@radix-ui/react-*` packages |
| Jan 2026 | RTL support, inline start/end styles | Logical CSS properties |
| Dec 2025 | `npx shadcn create` rebuilt with preset previews | |
| Oct 2025 | 7 new components: Spinner, Kbd, ButtonGroup, InputGroup, Field, Item, Empty | |
| Sep 2025 | Registry Index and Directory | |
| Aug 2025 | CLI 3.0, MCP Server | |
| Jul 2025 | Universal registry items, local file support | |
| Jun 2025 | `radix-ui` migration, Calendar component | |
| Apr 2025 | MCP integration, shadcn 2.5.0 | |
| Mar 2025 | Tailwind v4 support, OKLCH colors | |

### Breaking Changes to Watch
1. **Unified Radix package** — Must run `pnpm dlx shadcn@latest migrate radix` to move from individual `@radix-ui/react-*` to unified `radix-ui`
2. **`tailwindcss-animate` deprecated** — Replaced by `tw-animate-css`
3. **`toast` component deprecated** — Replaced by `sonner`
4. **`default` style deprecated** — New projects use `new-york` style
5. **`forwardRef` removed** — Components now use `data-slot` attributes with standard function components

---

## 2. THEMING AND CUSTOMIZATION DEPTH

### Verdict: Extremely deep. shadcn does NOT fight a brutalist aesthetic.

shadcn/ui uses a semantic CSS variable system with `@theme inline` (Tailwind v4). Every visual property is token-controlled. The system was designed for exactly this kind of override.

### CSS Variable Architecture

All colors are defined as OKLCH values in `:root` and `.dark`, then exposed to Tailwind via `@theme inline`:

```css
:root {
  --radius: 0px;                              /* ZERO. Done. */
  --background: oklch(1 0 0);                 /* White */
  --foreground: oklch(0.145 0 0);             /* Near-black */
  --primary: oklch(0.550 0.180 298);          /* Magenta — maps to SignalframeUX accent */
  --primary-foreground: oklch(0.985 0 0);     /* White text on magenta */
  --secondary: oklch(0.970 0.005 298);        /* Light neutral */
  --secondary-foreground: oklch(0.205 0 0);   /* Black text */
  --muted: oklch(0.930 0.005 298);
  --muted-foreground: oklch(0.550 0.010 298);
  --accent: oklch(0.930 0.005 298);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.550 0.180 25);       /* Maps to error.500 */
  --border: oklch(0.870 0.010 298);
  --input: oklch(0.870 0.010 298);
  --ring: oklch(0.550 0.180 298);             /* Magenta focus ring */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... etc for all tokens ... */

  --radius-sm: calc(var(--radius) * 0.6);     /* All 0px when --radius: 0px */
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
}
```

### OKLCH Support
Native. shadcn v4+ uses OKLCH by default. Your existing `SYS-tokens.json` already uses OKLCH values at hue 298 — these map directly to shadcn's variable system with zero conversion needed.

### Complete Token Map

| shadcn Token | SignalframeUX Mapping | OKLCH Value |
|---|---|---|
| `background` | White dominant | `oklch(1 0 0)` |
| `foreground` | Black text | `oklch(0.145 0 0)` |
| `primary` | Magenta accent (#FF0090) | `oklch(0.550 0.180 298)` or `oklch(0.65 0.29 350)` |
| `primary-foreground` | White on magenta | `oklch(0.985 0 0)` |
| `secondary` | Near-white surface | `oklch(0.970 0.005 298)` |
| `muted` | Light gray | `oklch(0.930 0.005 298)` |
| `muted-foreground` | Gray monospace text | `oklch(0.550 0.010 298)` |
| `destructive` | Error red | `oklch(0.550 0.180 25)` |
| `border` | Black borders (industrial) | `oklch(0.205 0 0)` |
| `input` | Black input borders | `oklch(0.205 0 0)` |
| `ring` | Magenta focus ring | `oklch(0.550 0.180 298)` |
| `radius` | 0px everywhere | `0px` |

### Tailwind v4 Compatibility
Fully supported. The `@theme inline` directive replaces the old `tailwind.config.ts` approach. No config file needed — everything lives in `globals.css`.

---

## 3. COMPONENT INVENTORY — SIGNALFRAMEUX MAPPING

### Full Official Component List (75+)

**Direct SignalframeUX Needs (HIGH priority):**

| shadcn Component | SignalframeUX Use | Customization Needed |
|---|---|---|
| **Button** | Primary CTAs, nav actions | Strip radius, add thick borders, monospace text |
| **ButtonGroup** | Toolbar-style grouped actions | Industrial bar styling |
| **Input** | Form fields | Black border, monospace text, 0px radius |
| **InputGroup** | Search with icons, prefixed inputs | Icon + monospace |
| **Field** | Form field wrapper (label + input + error) | Works across all form libs |
| **Card** | Component previews, token cards | Strip shadow/radius, add black border |
| **Dialog** | Modal overlays | Black border, no rounded corners |
| **Drawer** | Mobile navigation | Slide-in panel |
| **Sheet** | Side panel (API reference) | Full-height panel |
| **Table** | Token tables, prop tables | Dense monospace, black borders |
| **Tabs** | Code/preview toggle | Black underline style |
| **Badge** | Version tags, status indicators | Magenta or black, 0px radius |
| **Toast / Sonner** | Notifications | Black bar, monospace |
| **Dropdown Menu** | Actions menu | Black borders |
| **Select** | Framework selector | Monospace options |
| **Kbd** | Keyboard shortcuts display | Perfect for design system docs |
| **Spinner** | Loading states | Replace with custom industrial spinner |
| **Empty** | Empty states | Brutalist empty state |
| **Item** | List items (component nav, sidebars) | Dense, monospace |
| **Tooltip** | Prop descriptions | Black bg, white monospace text |
| **Separator** | Section dividers | Full-bleed black rules |
| **Scroll Area** | Code panels, long lists | Minimal scrollbar |
| **Skeleton** | Loading placeholders | Flat gray blocks |
| **Toggle / Toggle Group** | Theme switch, view modes | |
| **Breadcrumb** | Navigation path | Monospace with / separators |
| **Pagination** | (X / Y) pattern from TDR | |
| **Collapsible** | Expandable sections | |
| **Accordion** | FAQ, expandable API docs | |
| **Sidebar** | Documentation nav | |
| **Command** | Command palette (Cmd+K) | |
| **Navigation Menu** | Top nav | |

**Available but lower priority:**

| Component | Notes |
|---|---|
| Combobox | Searchable select — useful for component search |
| Context Menu | Right-click menus |
| Hover Card | Preview on hover |
| Menubar | Desktop-style menu bar |
| Popover | Positioned popups |
| Progress | Progress bars |
| Radio Group | Radio buttons |
| Checkbox | Checkboxes |
| Slider | Range inputs |
| Switch | Toggle switches |
| Textarea | Multi-line input |
| Calendar / Date Picker | Date selection |
| Carousel | Image/component carousels |
| Chart | Data visualization (Recharts) |
| Data Table | TanStack Table integration |
| Resizable | Resizable panels |
| Aspect Ratio | Image containers |
| Avatar | User avatars |
| Alert / Alert Dialog | Warning messages |
| Input OTP | Code input |
| Label | Form labels |
| Native Select | Native HTML select |

---

## 4. CUSTOM REGISTRY SYSTEM

### Can SignalframeUX BE a shadcn custom registry? YES.

This is the most strategically significant finding. shadcn's registry system was built for exactly this use case — distributing a design system as installable components.

### How It Works

1. Create a `registry.json` at your project root defining all items
2. Run `shadcn build` to generate individual JSON files in `public/r/`
3. Host anywhere that serves JSON over HTTP (Vercel, Netlify, any CDN)
4. Users install with `pnpm dlx shadcn@latest add https://signalframeux.com/r/button.json`

### Registry JSON Schema

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "signalframeux",
  "homepage": "https://signalframeux.com",
  "items": [
    {
      "name": "sf-button",
      "type": "registry:component",
      "title": "SF Button",
      "description": "Industrial flat button with 0px radius and monospace text",
      "files": [
        {
          "path": "registry/new-york/sf-button/sf-button.tsx",
          "type": "registry:component"
        }
      ],
      "registryDependencies": ["button"],
      "dependencies": ["class-variance-authority"]
    }
  ]
}
```

### Registry Item Schema (individual component JSON)

```json
{
  "$id": "sf-button",
  "name": "SF Button",
  "description": "Brutalist industrial button",
  "type": "registry:component",
  "registryDependencies": ["button"],
  "files": [
    {
      "path": "sf-button.tsx",
      "type": "registry:component",
      "content": "// full component source code here"
    }
  ]
}
```

### registry:base — Distribute the Entire Design System

This is the killer feature for SignalframeUX. A single `registry:base` item packages the entire design system config:

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "signalframeux-base",
  "type": "registry:base",
  "config": {
    "style": "radix-nova",
    "iconLibrary": "lucide",
    "tailwind": { "baseColor": "neutral" }
  },
  "dependencies": ["shadcn@latest", "class-variance-authority", "lucide-react"],
  "registryDependencies": ["utils", "font-electrolize"],
  "cssVars": {
    "light": {
      "radius": "0px",
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.145 0 0)",
      "primary": "oklch(0.65 0.29 350)",
      "primary-foreground": "oklch(0.985 0 0)",
      "border": "oklch(0.205 0 0)",
      "input": "oklch(0.205 0 0)",
      "ring": "oklch(0.65 0.29 350)"
    },
    "dark": {
      "background": "oklch(0.100 0 0)",
      "foreground": "oklch(0.930 0 0)",
      "primary": "oklch(0.65 0.29 350)",
      "primary-foreground": "oklch(0.100 0 0)",
      "border": "oklch(0.300 0 0)",
      "input": "oklch(0.300 0 0)"
    }
  },
  "css": {
    "@layer base": {
      "body": { "@apply bg-background text-foreground font-mono": {} },
      "*": { "@apply border-border": {} }
    }
  }
}
```

**One install sets up everything** — colors, fonts, radius, config. Users run:
```bash
pnpm dlx shadcn@latest add "https://signalframeux.com/r/signalframeux-base.json"
```

### registry:font — Distribute Custom Typography

```json
{
  "name": "font-electrolize",
  "title": "Electrolize",
  "type": "registry:font",
  "font": {
    "family": "'Electrolize', monospace",
    "provider": "google",
    "variable": "--font-mono",
    "subsets": ["latin"],
    "weight": ["400", "700"],
    "import": "Electrolize"
  }
}
```

### Namespaced Registry

Users can configure a namespace so they can install like:
```bash
pnpm dlx shadcn@latest add signalframeux:button
pnpm dlx shadcn@latest add signalframeux:card
```

Configure in user's `components.json`:
```json
{
  "registries": {
    "signalframeux": "https://signalframeux.com/r/registry.json"
  }
}
```

### Official Template
GitHub template available at `shadcn-ui/registry-template` — Next.js project with build script pre-configured.

---

## 5. INTEGRATION WITH DESIGN SYSTEM ARCHITECTURE

### Recommended Layer Architecture for SignalframeUX

```
Layer 0: Radix UI Primitives (headless behavior + accessibility)
    |
Layer 1: shadcn/ui Components (styled with Tailwind + CSS vars)
    |
Layer 2: SignalframeUX Components (wrapped with custom API + DU/TDR styling)
    |
Layer 3: Blocks / Page Templates (composed from Layer 2 components)
```

### Wrapping Pattern

shadcn components live in `components/ui/`. SignalframeUX wrappers live in `components/sf/`:

```tsx
// components/sf/sf-button.tsx
import { Button, type ButtonProps } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sfButtonVariants = cva(
  "font-mono uppercase tracking-wider border-2 border-foreground transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
        ghost: "bg-transparent text-foreground hover:bg-foreground hover:text-background",
        signal: "bg-foreground text-background border-primary hover:bg-primary",
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
    <Button
      className={cn(sfButtonVariants({ intent, size }), className)}
      {...props}
    />
  )
}
```

### Key Architectural Principle

shadcn copies code into your project — you own it. The recommended approach is NOT to wrap-and-hide but to directly modify the copied components. However, for a distributable design system, the wrapper pattern preserves upgrade paths: you can re-add shadcn base components and only rebuild the wrapper layer.

### Composition Over Inheritance

Use shadcn's compound component pattern:

```tsx
// Field + Input composition for SignalframeUX forms
<Field>
  <FieldLabel className="font-mono uppercase text-xs tracking-widest">
    SIGNAL_NAME
  </FieldLabel>
  <InputGroup>
    <InputGroupAddon>
      <span className="font-mono text-muted-foreground">//</span>
    </InputGroupAddon>
    <InputGroupInput className="font-mono border-2 border-foreground" />
  </InputGroup>
  <FieldDescription className="font-mono text-xs text-muted-foreground">
    Enter signal identifier
  </FieldDescription>
</Field>
```

---

## 6. TYPOGRAPHY AND SPACING OVERRIDES

### Font Stack Override

shadcn uses CSS variables for fonts. Override in `globals.css`:

```css
:root {
  --font-sans: 'Electrolize', 'Courier New', 'SF Mono', ui-monospace, monospace;
  --font-mono: 'Electrolize', 'Courier New', 'SF Mono', ui-monospace, monospace;
  --font-display: 'Anton', 'Impact', 'Oswald', system-ui, sans-serif;
}
```

For Next.js, configure in layout.tsx:
```tsx
import { Electrolize } from "next/font/google"

const spaceMono = Electrolize({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
})

// Apply to html element
<html className={`${spaceMono.variable}`}>
```

Then in `globals.css` with Tailwind v4:
```css
@theme inline {
  --font-sans: var(--font-mono);  /* Force monospace everywhere */
  --font-mono: 'Electrolize', monospace;
}
```

### Spacing Token Override

shadcn uses Tailwind's default spacing scale. Your custom spacing maps cleanly:

```css
@theme inline {
  /* Override Tailwind spacing if needed */
  --spacing-inset: 16px;
  --spacing-stack: 24px;
  --spacing-section: 64px;
  --spacing-page: 80px;
}
```

Since shadcn components use Tailwind utility classes (`p-4`, `gap-2`, etc.), Tailwind's default 4px base spacing already aligns with your `SYS-tokens.json` spacing scale. No override needed for the base scale.

### Typography Scale

Your `SYS-tokens.json` uses a 1.414 (augmented fourth) type scale. This does not conflict with shadcn — components use Tailwind's `text-sm`, `text-base`, etc. You can override the scale:

```css
@theme inline {
  --text-xs: 0.500rem;
  --text-sm: 0.707rem;
  --text-base: 1.000rem;
  --text-lg: 1.414rem;
  --text-xl: 2.000rem;
  --text-2xl: 2.828rem;
  --text-3xl: 4.000rem;
  --text-4xl: 5.657rem;
}
```

---

## 7. 0PX BORDER-RADIUS EVERYWHERE

### One line. Done.

```css
:root {
  --radius: 0px;
}
```

This is the single source of truth. All shadcn components derive their border-radius from calculated values off `--radius`:

```css
@theme inline {
  --radius-sm: calc(var(--radius) * 0.6);   /* = 0px */
  --radius-md: calc(var(--radius) * 0.8);   /* = 0px */
  --radius-lg: var(--radius);                /* = 0px */
  --radius-xl: calc(var(--radius) * 1.4);   /* = 0px */
  --radius-2xl: calc(var(--radius) * 1.8);  /* = 0px */
  --radius-3xl: calc(var(--radius) * 2.2);  /* = 0px */
  --radius-4xl: calc(var(--radius) * 2.6);  /* = 0px */
}
```

When `--radius` is `0px`, every `calc()` resolves to `0px`. Every Button, Card, Input, Dialog, Popover, Dropdown, Badge, Toast — all sharp corners. No component-level overrides needed.

This is the ideal outcome for SignalframeUX's industrial flat aesthetic.

---

## 8. DARK MODE / THEME SWITCHING

### shadcn's Approach

Dark mode uses CSS class toggling (`.dark` selector). Define different values for the same tokens:

```css
:root {
  /* SignalframeUX LIGHT (DU-inspired: white dominant) */
  --background: oklch(1 0 0);           /* Pure white */
  --foreground: oklch(0.145 0 0);       /* Near black */
  --primary: oklch(0.65 0.29 350);      /* Magenta */
  --card: oklch(1 0 0);                 /* White cards */
  --border: oklch(0.205 0 0);           /* Black borders */
}

.dark {
  /* SignalframeUX DARK (terminal/matrix aesthetic) */
  --background: oklch(0.100 0 0);       /* Near black */
  --foreground: oklch(0.930 0 0);       /* Near white */
  --primary: oklch(0.65 0.29 350);      /* Magenta stays */
  --card: oklch(0.145 0 0);             /* Dark cards */
  --border: oklch(0.300 0 0);           /* Dark gray borders */
}
```

### White-Dominant as Default

Yes — this is the default behavior. shadcn's `:root` is the light theme. The `.dark` class activates dark mode. Your DU-inspired white background is the default state. No fighting required.

### Theme Switching Implementation

shadcn recommends `next-themes` for Next.js:
```tsx
import { ThemeProvider } from "next-themes"

<ThemeProvider attribute="class" defaultTheme="light">
  {children}
</ThemeProvider>
```

### Multiple Theme Modes

You could add additional themes beyond light/dark:

```css
.theme-terminal {
  --background: oklch(0.100 0 0);
  --foreground: oklch(0.85 0.18 145);   /* Matrix green */
  --primary: oklch(0.85 0.18 145);
  --border: oklch(0.85 0.18 145);
}

.theme-blueprint {
  --background: oklch(0.35 0.10 250);   /* Blueprint blue */
  --foreground: oklch(0.95 0 0);        /* White */
  --primary: oklch(0.95 0 0);
}
```

Apply with a class-based toggle. All components respond automatically through the CSS variable cascade.

---

## 9. SHADCN + GSAP

### Integration is proven and documented.

Multiple libraries successfully combine shadcn/ui with GSAP:
- **PaceUI** — GSAP-powered animated components for React/Next.js
- **SmoothUI** — Motion + GSAP animations, explicitly shadcn-compatible
- **Motionify** — shadcn components animated with Framer Motion, GSAP, and React Spring

### Critical Pattern: useGSAP Hook

React 18+ strict mode calls effects twice. Without proper cleanup, GSAP animations double-fire. The solution:

```tsx
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

function SFButton({ children, ...props }) {
  const containerRef = useRef(null)

  useGSAP(() => {
    // All animations here auto-revert on unmount
    gsap.from(containerRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out"
    })
  }, { scope: containerRef })

  return <Button ref={containerRef} {...props}>{children}</Button>
}
```

### Potential Conflicts

1. **CSS transitions vs GSAP** — shadcn components have `transition-colors`, `transition-all` in their class lists. GSAP may fight these. Solution: strip Tailwind transition classes on GSAP-animated elements or use `gsap.set()` to override.

2. **Radix UI portals** — Dialog, Popover, Dropdown render in React portals. GSAP animations targeting parent containers won't reach portal content. Solution: animate the portal content directly using Radix's `onOpenAutoFocus` or custom open/close handlers.

3. **Server components** — GSAP requires client-side execution. Any component using GSAP must be `"use client"`. This is fine for interactive elements but means you can't use GSAP in RSC-rendered static content.

### Recommended GSAP Patterns for SignalframeUX

```tsx
// Page entry animation — stagger industrial blocks
useGSAP(() => {
  gsap.from("[data-animate]", {
    y: 40,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: "power3.out"
  })
})

// Hover glitch effect on buttons
useGSAP(() => {
  const btn = buttonRef.current
  btn.addEventListener("mouseenter", () => {
    gsap.to(btn, {
      x: () => gsap.utils.random(-2, 2),
      duration: 0.05,
      repeat: 3,
      yoyo: true,
      onComplete: () => gsap.set(btn, { x: 0 })
    })
  })
})

// ScrollTrigger for section reveals
useGSAP(() => {
  gsap.from(".section-divider", {
    scaleX: 0,
    transformOrigin: "left center",
    scrollTrigger: {
      trigger: ".section-divider",
      start: "top 80%",
    },
    duration: 0.8,
    ease: "power2.inOut"
  })
})
```

---

## 10. SHADCN VS BUILDING FROM SCRATCH

### Assessment for SignalframeUX Specifically

**The question is wrong.** It's not shadcn vs scratch. shadcn IS your scratch — it copies source code into your project. You own every line. The real question is: does starting from shadcn's code save time compared to writing from Radix UI primitives directly?

### Where shadcn SAVES time (use it):

| Area | Time Saved | Why |
|---|---|---|
| **Accessibility** | Major | Radix handles keyboard nav, ARIA, focus management. You get it free. |
| **Dialog/Modal** | Major | Portal rendering, scroll lock, focus trap, escape-to-close — all handled. |
| **Dropdown/Select** | Major | Positioning, keyboard nav, typeahead, overflow handling. |
| **Command palette** | Major | cmdk integration already wired. |
| **Data Table** | Major | TanStack Table integration with sorting, filtering, pagination. |
| **Form patterns** | Significant | Field, InputGroup, validation integration with RHF/TanStack Form. |
| **Toast/Sonner** | Significant | Queue management, positioning, auto-dismiss. |
| **Sidebar** | Significant | Collapsible, responsive, keyboard accessible. |
| **Tabs** | Moderate | Keyboard nav, ARIA roles, controlled/uncontrolled. |
| **Tooltip/Popover** | Moderate | Positioning, collision detection, portal rendering. |

### Where shadcn adds OVERHEAD (consider building from scratch):

| Area | Overhead | Why |
|---|---|---|
| **Button** | Low but exists | Your Button API might differ enough that the wrapper is thicker than the original. But Radix doesn't have a Button primitive — so no advantage to scratch. |
| **Badge** | Trivial | It's a styled span. Shadow DOM primitive is simpler. |
| **Separator** | Trivial | It's a styled hr. |
| **Card** | Trivial | It's styled divs. |
| **Skeleton** | Trivial | Animated div. |
| **Spinner** | Trivial | SVG animation. |

### Decision Matrix

```
IF the component has complex behavior (keyboard, positioning, portals, state)
  → USE SHADCN (Radix provides the behavior for free)

IF the component is purely visual (styled div, span, hr)
  → COULD BUILD FROM SCRATCH
  → BUT shadcn's version is already there and costs nothing
  → SO USE SHADCN ANYWAY for consistency

IF the component needs heavy GSAP animation
  → USE SHADCN as base, animate with useGSAP wrapper

IF SignalframeUX needs to BE a registry
  → USE SHADCN as foundation, distribute via registry:base
```

### Final Verdict

**Use shadcn. It is not a hindrance for SignalframeUX.** Here's why:

1. **0px radius** — One CSS variable change. Not fighting.
2. **Monospace everywhere** — One font variable change. Not fighting.
3. **Black borders** — One border color token change. Not fighting.
4. **White backgrounds** — Default state. Not fighting.
5. **Magenta accents** — One primary token change. Not fighting.
6. **OKLCH colors** — Native in v4. Your tokens already use OKLCH.
7. **No shadows** — Override shadow tokens to `none`. Not fighting.
8. **Flat aesthetic** — Remove gradients from any component that has them (very few do).

The only thing shadcn's defaults fight is "looking like every other shadcn site." But since you're overriding every visual token, the result will look nothing like default shadcn. The DU/TDR brutalist aesthetic maps cleanly to the token system.

The real strategic advantage: **SignalframeUX as a shadcn custom registry** makes the design system installable via one command. Your users run `shadcn add signalframeux:base` and get your entire visual system. That distribution story is worth the investment alone.

---

## STRATEGIC RECOMMENDATIONS FOR SIGNALFRAMEUX

### Phase 1: Foundation
1. Initialize shadcn/ui with Tailwind v4 + `radix-nova` style
2. Set `--radius: 0px` in globals.css
3. Map all `SYS-tokens.json` OKLCH values to shadcn CSS variables
4. Configure Electrolize as `--font-mono` and `--font-sans` (monospace everywhere)
5. Override `--border` and `--input` to near-black for industrial borders

### Phase 2: Component Library
1. Install all high-priority shadcn components (Button, Input, Card, Dialog, Table, Tabs, etc.)
2. Build SignalframeUX wrapper layer in `components/sf/` with custom CVA variants
3. Add GSAP animations via `useGSAP` wrappers for page transitions and micro-interactions
4. Build custom components that don't exist in shadcn (HUD overlays, signal meters, data streams)

### Phase 3: Registry Distribution
1. Create `registry.json` defining all SignalframeUX components
2. Build `registry:base` item with full design system config (colors, fonts, radius, config)
3. Build `registry:font` item for Electrolize
4. Host registry on the SignalframeUX site itself (`/r/*.json`)
5. Users install with `pnpm dlx shadcn@latest add https://signalframeux.com/r/base.json`

### Phase 4: Preset
1. Create a SignalframeUX preset on `shadcn/create`
2. One code string packages: magenta primary, 0px radius, monospace fonts, black borders
3. Anyone can scaffold a project with the SignalframeUX look: `npx shadcn create --preset signalframeux`

---

## SIGNALFRAMEUX GLOBALS.CSS — COMPLETE STARTER

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
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

  /* SignalframeUX custom tokens */
  --color-signal: var(--signal);
  --color-signal-foreground: var(--signal-foreground);
  --color-terminal: var(--terminal);
  --color-terminal-foreground: var(--terminal-foreground);

  /* Radius — ALL ZERO */
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);

  /* Typography — Monospace dominant */
  --font-sans: 'Electrolize', 'Courier New', ui-monospace, monospace;
  --font-mono: 'Electrolize', 'Courier New', ui-monospace, monospace;
}

:root {
  --radius: 0px;

  /* Surfaces */
  --background: oklch(1 0 0);
  --foreground: oklch(0.100 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.100 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.100 0 0);

  /* Brand */
  --primary: oklch(0.65 0.29 350);           /* Magenta #FF0090 */
  --primary-foreground: oklch(1 0 0);         /* White */
  --secondary: oklch(0.970 0.005 298);
  --secondary-foreground: oklch(0.100 0 0);
  --muted: oklch(0.940 0 0);
  --muted-foreground: oklch(0.450 0 0);
  --accent: oklch(0.940 0 0);
  --accent-foreground: oklch(0.100 0 0);
  --destructive: oklch(0.550 0.180 25);

  /* Borders — BLACK for industrial look */
  --border: oklch(0.100 0 0);
  --input: oklch(0.100 0 0);
  --ring: oklch(0.65 0.29 350);              /* Magenta focus */

  /* SignalframeUX extended */
  --signal: oklch(0.85 0.18 145);            /* Matrix green */
  --signal-foreground: oklch(0.100 0 0);
  --terminal: oklch(0.100 0 0);
  --terminal-foreground: oklch(0.85 0.18 145);
}

.dark {
  --background: oklch(0.070 0 0);
  --foreground: oklch(0.930 0 0);
  --card: oklch(0.100 0 0);
  --card-foreground: oklch(0.930 0 0);
  --popover: oklch(0.100 0 0);
  --popover-foreground: oklch(0.930 0 0);

  --primary: oklch(0.65 0.29 350);
  --primary-foreground: oklch(0.070 0 0);
  --secondary: oklch(0.150 0 0);
  --secondary-foreground: oklch(0.930 0 0);
  --muted: oklch(0.200 0 0);
  --muted-foreground: oklch(0.550 0 0);
  --accent: oklch(0.200 0 0);
  --accent-foreground: oklch(0.930 0 0);
  --destructive: oklch(0.550 0.180 25);

  --border: oklch(0.300 0 0);
  --input: oklch(0.300 0 0);
  --ring: oklch(0.65 0.29 350);

  --signal: oklch(0.85 0.18 145);
  --signal-foreground: oklch(0.070 0 0);
  --terminal: oklch(0.070 0 0);
  --terminal-foreground: oklch(0.85 0.18 145);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground font-mono antialiased;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold tracking-tight uppercase;
  }
}
```

---

## SOURCES

- [shadcn/ui Official Docs](https://ui.shadcn.com/docs)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [shadcn/ui CLI Reference](https://ui.shadcn.com/docs/cli)
- [shadcn/ui Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4)
- [shadcn/ui Registry Introduction](https://ui.shadcn.com/docs/registry)
- [shadcn/ui Registry Getting Started](https://ui.shadcn.com/docs/registry/getting-started)
- [shadcn/ui Changelog](https://ui.shadcn.com/docs/changelog)
- [shadcn/ui October 2025 New Components](https://ui.shadcn.com/docs/changelog/2025-10-new-components)
- [shadcn/cli v4: registry:base and registry:font](https://shadcnstudio.com/blog/shadcn-cli-v4-registry-base-and-registry-font)
- [shadcn/ui March 2026 Update](https://dev.to/codedthemes/shadcnui-march-2026-update-cli-v4-ai-agent-skills-and-design-system-presets-1gp1)
- [Extending shadcn/ui Components — Vercel Academy](https://vercel.com/academy/shadcn-ui/extending-shadcn-ui-with-custom-components)
- [Border Radius Discussion #4902](https://github.com/shadcn-ui/ui/discussions/4902)
- [brutal-shadcn](https://github.com/v0sudo/brutal-shadcn)
- [neobrutalism.dev](https://www.neobrutalism.dev/)
- [tweakcn Theme Editor](https://tweakcn.com/)
- [Fonttrio — Font Pairing Registry](https://github.com/kapishdima/fonttrio)
- [Registry Template](https://github.com/shadcn-ui/registry-template)
- [GSAP + React Guide](https://gsap.com/resources/React/)
- [PaceUI — GSAP + Next.js Components](https://next.jqueryscript.net/next-js/animated-components-gsap-paceui/)
- [SmoothUI — shadcn + Motion/GSAP](https://smoothui.dev/)
