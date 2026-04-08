# SignalframeUX — Project Overview

## Purpose
High-performance design system for Culture Division. Stabilizing to v0.1 baseline. Every change must reduce friction.

## Tech Stack
- **Framework:** Next.js 15.3 (App Router, Turbopack) + TypeScript 5.8
- **Styling:** Tailwind CSS v4 (`@theme` in globals.css) + CVA variants + OKLCH color space
- **Components:** Radix UI via shadcn → SF-wrapped layer
- **Animation:** GSAP 3.12 + ScrollTrigger + Lenis
- **Deployment:** Vercel

## Dual-Layer Model (Core Architecture)
- **FRAME** — deterministic, legible, semantic, consistent. Structural layer. MUST remain readable.
- **SIGNAL** — generative, parametric, animated, data-driven. Expressive layer. MUST NOT interfere with usability.

## Design Philosophy
Enhanced Flat Design — Detroit Underground + The Designers Republic inspiration.
Sharp, controlled, structured, slightly tense. Zero border-radius everywhere.
NO skeuomorphism, fake depth, excessive shadows, decorative gradients.

## File Organization
- `components/ui/` — base shadcn (never modify)
- `components/sf/` — SF-wrapped components (SFButton, SFCard etc), barrel from `sf/index.ts`
- `components/blocks/` — page sections
- `components/animation/` — GSAP components
- `components/layout/` — nav, footer, chrome
- `lib/` — utils, theme, GSAP helpers
- `hooks/` — custom hooks
- `app/globals.css` — token source of truth
