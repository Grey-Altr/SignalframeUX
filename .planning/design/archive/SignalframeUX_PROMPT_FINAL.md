# SIGNALFRAMEUX — EXECUTABLE MASTER PROMPT (FINAL API + HYBRID)

## Universal Design System Generator (Claude Code)

---

# ROLE

You are a world-class design systems architect, frontend engineer, and creative technologist.

Your task is to generate a complete, production-ready design system and component library called SignalframeUX.

This system must be:
A universal, extensible, dual-layer, API-driven design system for building any website or application.

---

# CORE CONCEPT

SignalframeUX uses a dual-layer model:

## SIGNAL LAYER (INTERFACE)
- deterministic
- legible
- semantic
- consistent

## FIELD LAYER (EXPRESSION)
- generative
- parametric
- animated
- data-driven

---

# NON-NEGOTIABLE RULE

- Signal Layer must always remain readable
- Field Layer must never interfere with usability

---

# SYSTEM OBJECTIVES

Build a system that is:
- modular
- scalable
- themeable
- performant
- production-ready
- API-driven

---

# TECH STACK

- React (Vite)
- TypeScript
- TailwindCSS
- GSAP + ScrollTrigger
- Canvas (generative system)
- Storybook

---

# OUTPUT STRUCTURE

signalframeux/
  apps/
    demo-saas/
    demo-portfolio/
    demo-dashboard/
  packages/
    core/
    tokens/
    components/
    motion/
    field/
    react/
  docs/
    storybook/
  README.md
  HIG.md

---

# API ARCHITECTURE (CRITICAL)

System must function as a programmable API.

## Core Package

@signalframeux/core

## Initialization

createSignalframeUX(config)

## Global Hook

useSignalframe()

Returns:
- tokens
- theme controller
- motion controller
- field controller

## Field API

- setSeed
- setDensity
- enable / disable

## Motion API

- enable / disable
- setSpeed

## Theme API

- set(theme)
- extend(theme)

## Headless Mode

- usable without UI components

## React Layer

@signalframeux/react
- components
- hooks

---

# DESIGN TOKENS

## Signal Tokens
- typography
- spacing
- semantic colors
- borders
- radii

## Field Tokens
- seed
- density
- motionSpeed
- noise

---

# LAYOUT SYSTEM

- grid-based (4pt or 8pt)
- responsive

## Primitives
- Stack
- Grid
- Section
- Container

---

# HERO SYSTEM (CRITICAL)

- Hero.Container
- Hero.Content
- Hero.Field

- full-bleed generative background
- GSAP reveal sequences
- always readable content

---

# BACKGROUND SYSTEM

Types:
- StaticField
- AnimatedField
- InteractiveField

Rules:
- page + section usage
- adaptive contrast

---

# SECTION FIELD SYSTEM

Sections support Field layer

- context-aware visuals
- non-intrusive

---

# PAGE CONTINUITY

- persistent Field across navigation
- GSAP transitions
- no abrupt resets

---

# COMPONENT SYSTEM

Components:
Button, Input, Card, Panel, Modal, Tooltip, Dropdown, Tabs, Sidebar, Navbar

Each supports:
- signalProps
- fieldProps

---

# FIELD SYSTEM

- deterministic
- animated patterns
- performant

---

# MOTION SYSTEM

- GSAP timelines
- reusable hooks
- scroll orchestration

---

# THEMING

- light/dark
- runtime switching

---

# ACCESSIBILITY

- WCAG AA
- reduced motion

---

# PERFORMANCE

- lazy field loading
- disable animations option

---

# DEMO APPS

- SaaS dashboard
- portfolio (hero + generative backgrounds)
- data dashboard

---

# EXECUTION MODES

## FULL
generate all

## PHASED
1 tokens
2 primitives
3 components
4 motion
5 field
6 integration
7 apps
8 docs

---

# FINAL DIRECTIVE

Build a programmable design system platform combining clarity (Signal) and generative depth (Field).
